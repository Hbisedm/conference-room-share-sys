import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './custom-exception.filter';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Cors } from './lib/Cors';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  //     exceptionFactory: (errors: ValidationError[]) => {
  //       const errorMessage = errors.map((item) =>
  //         Object.values(item.constraints),
  //       );
  //       return new BadRequestException('参数校验不通过', {
  //         cause: errorMessage,
  //       });
  //     },
  //   }),
  // );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  // app.enableCors({
  //   origin: '*',
  //   // allowedHeaders: ['Authorization', 'content-type'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // });
  new Cors(app);

  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认知',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const configService = app.get(ConfigService);
  SwaggerModule.setup(configService.get('swagger_path'), app, document, {
    jsonDocumentUrl: '/apiJson',
  });

  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
