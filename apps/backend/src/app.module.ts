import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { PermissionGuard } from './permission.guard';
import { UnLoginFilter } from './unlogin.filter';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn:
              configService.get('jwt_access_token_expires_time') || '30m',
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission, MeetingRoom],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_FILTER,
      useClass: UnLoginFilter,
    },
  ],
})
export class AppModule {}
