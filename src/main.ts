import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
   app.enableCors({
    credentials: true,
   })

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

  // app.use(cookieParser());

  await app.listen(process.env.SERVER_PORT);

  console.log('Port is running on port: ', process.env.SERVER_PORT);
}
bootstrap();
