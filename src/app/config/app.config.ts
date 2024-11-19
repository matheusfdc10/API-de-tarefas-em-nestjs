import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

export default (app: INestApplication) => {
  if (process.env.NODE_ENV === 'production') app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO
      forbidNonWhitelisted: true, // levantar erro quando a chave não existir
      transform: false, // tenta transformar os tipos de dados de param e dtos
    }),
  );

  return app;
};
