import { Global, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseFilter } from './common/filters/response.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ConfigurationKeyPaths,
  getConfiguration,
} from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { UserModule } from './system/user/user.module';
import { DeptModule } from './system/dept/dept.module';
import { MenuModule } from './system/menu/menu.module';
import { RoleModule } from './system/role/role.module';
import { PostModule } from './system/post/post.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => {
        return {
          // autoLoadEntities: true,
          entities: configService.get<any>('database.entities'),
          type: configService.get<any>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<string>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          synchronize: configService.get<boolean>('database.synchronize'),
          logging: configService.get('database.logging'),
          timezone: configService.get('database.timezone'), // 时区
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService<ConfigurationKeyPaths>) {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: configService.get<string>('jwt.access_token'),
          },
        };
      },
      inject: [ConfigService],
    }),
    LoginModule,
    UserModule,
    DeptModule,
    MenuModule,
    RoleModule,
    PostModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局过滤器
    {
      provide: APP_FILTER,
      useClass: ResponseFilter,
    },
    // 全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // 全局守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // 全局管道
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
