import { ApiProperty } from '@nestjs/swagger';
export class UserInfoVo {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'zhangsan' })
  username: string;

  @ApiProperty({ example: '张三' })
  nickName: string;

  @ApiProperty({ example: 'xxx@xx.com' })
  email: string;

  @ApiProperty({ example: 'xxx.png' })
  headPic: string;

  @ApiProperty({ example: '1312312312' })
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  createTime: number;

  @ApiProperty({ example: ['管理员'] })
  roles: string[];

  @ApiProperty({ example: ['query_a'] })
  permissions: string[];
}
export class LoginUserVo {
  @ApiProperty()
  userInfo: UserInfoVo;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
