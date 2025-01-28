import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin:"*",
  });

  const config = new DocumentBuilder()
    .setTitle('LATIHAN NESTJS KELAS 5B')
    .setDescription('Muh.Dirham rahim - 105841105622')
    .setVersion('0.1')
    .addTag('LATIHAN-1')
    .addBearerAuth()
    .build();
    
    const documenFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documenFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();