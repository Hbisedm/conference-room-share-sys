import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  UnauthorizedException,
  DefaultValuePipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserVo, UserInfoVo } from './vo/login-user.vo';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenVo } from './vo/refresh-token.vo';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private ConfigService: ConfigService;

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
    type: String,
  })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @ApiQuery({
    name: 'address',
    type: String,
    required: true,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 10 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Get('init-data')
  async initData() {
    // dev 初始化数据
    await this.userService.initData();
    return 'done';
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    this.packVoByLoginUserVo(vo);
    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    this.packVoByLoginUserVo(vo);
    return vo;
  }

  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxxyyyyzzz',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效, 请重新登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserByIdAndIsAdmin(
        data.userId,
        false,
      );

      return this.packVoByUserInfo(user);
    } catch (e) {
      throw new UnauthorizedException('token 已失效, 请重新登录');
    }
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserByIdAndIsAdmin(
        data.userId,
        true,
      );
      return this.packVoByUserInfo(user);
    } catch (e) {
      throw new UnauthorizedException('token 已失效, 请重新登录');
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserDetailVo,
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserById(userId);

    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isFrozen = user.isFrozen;

    return vo;
  }

  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      10 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是${code}</p>`,
    });

    return '发送成功';
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiResponse({
    type: String,
    description: '验证码已失效/不正确',
  })
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() upateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, upateUserDto);
  }

  @Get('freeze')
  async freeze(@Query('userId') userId: number) {
    console.log('user id:', userId);
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUserByPage(
      username,
      nickName,
      email,
      pageNo,
      pageSize,
    );
  }

  packVoByLoginUserVo(vo: Partial<LoginUserVo>) {
    const { access_token, refresh_token } = this.packVoByUserInfo(vo.userInfo);
    vo.accessToken = access_token;
    vo.refreshToken = refresh_token;
    return vo;
  }

  packVoByUserInfo(user: Partial<UserInfoVo>) {
    const access_token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      },
      {
        expiresIn:
          this.ConfigService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    const refresh_token = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn:
          this.ConfigService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );

    const vo = new RefreshTokenVo();

    vo.access_token = access_token;
    vo.refresh_token = refresh_token;

    return vo;
  }
}
