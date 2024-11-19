import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';
import documentConfig from './app/config/document.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appConfig(app);
  documentConfig(app);

  await app.listen(3000);
}
bootstrap();
