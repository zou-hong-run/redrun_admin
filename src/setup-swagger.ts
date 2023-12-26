import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationKeyPaths } from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const setupSwagger = (app: INestApplication) => {
  const configService: ConfigService<ConfigurationKeyPaths> =
    app.get(ConfigService);

  const enable = configService.get<boolean>('swagger.enable', true);

  if (!enable) {
    return;
  }
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title'))
    .setDescription(configService.get<string>('swagger.desc'))
    .setLicense('MIT', 'https://github.com/zou_hong_run/redrun-admin')
    .addBearerAuth({
      type: 'http',
      description: '基于jwt的认证',
    })
    // .addSecurity('redrun-admin', {
    //   description: '后台管理接口授权',
    //   type: 'apiKey',
    //   in: 'header',
    //   name: 'Authorization',
    // })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    configService.get<string>('swagger.path', '/swagger-api'),
    app,
    document,
  );
};

export { setupSwagger };
