import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyAuthGuard } from './guards/api-key.guard';
import * as fs from 'fs';

async function bootstrap() {

  const privkey = process.env.PRIVKEY;
  const fullchain = process.env.FULLCHAIN;

  const httpsOptions = {
    key: fs.readFileSync(`${privkey}`),
    cert: fs.readFileSync(`${fullchain}`),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new ApiKeyAuthGuard());

  await app.listen(port);


  console.log(`Application running on port ${port}`);
}
bootstrap();