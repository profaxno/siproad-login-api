import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('siproad-login');

  app.useGlobalPipes(
    new ValidationPipe({
       whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true
      // }
    })
  )

  // const config = new DocumentBuilder()
  //   .setTitle('Teslo RESTFul API')
  //   .setDescription('Teslo shop endpoint')
  //   .setVersion('1.0')
  //   //.addTag('cats')
  //   .build();
  
  // const document = SwaggerModule.createDocument(app, config);
  
  // SwaggerModule.setup('api', app, document);
  
  // app.enableCors({
  //   origin: 'http://localhost:5173', // Permitir solicitudes desde el frontend
  //   credentials: true, // Permitir autenticación con cookies o headers
  // });

  // app.enableCors({
  //   origin: 'https://0920-2800-300-6392-3d10-a9b6-2437-c2c0-4dd4.ngrok-free.app', // Permitir solicitudes desde el frontend
  //   credentials: true, // Permitir autenticación con cookies o headers
  //    allowedHeaders: 'Content-Type, Authorization',
  // });

  app.enableCors({
    origin: '*', // O usa el dominio de Ngrok: 'https://tudominio.ngrok-free.app'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT);
  
  const env = process.env.ENV.padEnd(20, ' ');

  console.log(`
╔════════════════════════════╗
║ @org: Profaxno Company     ║
║ @app: siproad-login-api    ║
║ @env: ${env} ║
╚════════════════════════════╝

running at PORT: ${process.env.PORT}...`
  );
}
bootstrap();
