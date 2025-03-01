import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  // await app.listen(port);
  await app.listen(3000, '127.0.0.1');
  
  console.log(`Application running on port ${port}`);
}
bootstrap();