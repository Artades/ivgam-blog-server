import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs'; // Импортируем модуль fs
import * as cookieParser from 'cookie-parser';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'ivgamblogserver.online',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Ivgam-Blog')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(cookieParser());
  app.use(
    '/api/uploads',
    express.static(path.join(__dirname, '..', 'uploads')),
  );

  // Проверяем и создаем папку uploads, если она не существует
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    console.log("Creating Uploads directive...")
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  await app.listen(process.env.SERVER_PORT);

  console.log('Server is running on port:', process.env.SERVER_PORT);
}

bootstrap();
