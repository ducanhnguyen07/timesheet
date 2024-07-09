import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configSwagger } from './configs/api-docs.config';
import { TransformInterceptor } from './common/transform-data/transform.intercepter';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.enableCors();

  // swagger-ui
  configSwagger(app);

  const port: number | string = process.env.PORT;
  await app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
}

bootstrap();
