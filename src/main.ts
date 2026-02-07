import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // enable cors
  app.enableCors();

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Deebo Event & Ticket API')
    .setDescription('API documentation for Deebo Event & Ticket Systemt')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Enter JWT token obtained from the login endpoint. Format: Bearer <token>',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // env variables
  const env = configService.get<string>('env');
  const port = configService.get<number>('port', 3000);
  const appName = configService.get<string>('appName');

  await app.listen(port);

  logger.log(
    `
      ------------
      Internal Application Started!
      Environment: ${env}
      API: http://localhost:${port}/
      API Docs: http://localhost:${port}/docs
      ------------
  `,
    ` ${appName} | ${env}`,
  );
}

bootstrap();
