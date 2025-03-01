import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyAuthGuard } from './guards/api-key.guard';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new ApiKeyAuthGuard());

  await app.listen(port);


  console.log(`Application running on port ${port}`);
}
bootstrap();