// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importe ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita a validação automática dos DTOs usando class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão definidas no DTO
    forbidNonWhitelisted: true, // Lança um erro se houver propriedades não definidas
    transform: true, // Transforma os payloads para instâncias do DTO
  }));

  // Habilita o CORS (Cross-Origin Resource Sharing)
  // Essencial para que seu frontend React (em um domínio/porta diferente)
  // consiga fazer requisições para o backend NestJS.
  app.enableCors({
    origin: 'http://localhost:5173', // <--- IMPORTANTE: Altere para a URL do seu frontend React em desenvolvimento
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Se você for usar cookies ou sessões (não é o caso do JWT direto, mas boa prática)
  });

  // Define um prefixo global para todas as rotas da API
  // Ex: suas rotas serão /api/users, /api/auth/login, /api/appointments
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000); // Usa a porta do .env ou 3000 por padrão
}
bootstrap();