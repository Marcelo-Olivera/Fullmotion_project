// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { VideosModule } from './videos/videos.module'; // Importe o VideosModule aqui!

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'seu_usuario_postgres',
      password: process.env.DB_PASSWORD || 'sua_senha_postgres', // Certifique-se que esta senha está correta!
      database: process.env.DB_DATABASE || 'fullmotion_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Use em desenvolvimento para criar/atualizar tabelas automaticamente
    }),
    // NOVO ServeStaticModule para a pasta 'uploads'
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Caminho absoluto para a pasta 'uploads' na raiz do backend
      serveRoot: '/uploads/', // URL prefixo para acessar os arquivos (ex: http://localhost:3000/uploads/videos/meuvideo.mp4)
      exclude: ['/api/(.*)', '/frontend/(.*)'], // Exclua rotas de API e do frontend para evitar conflitos
    }),
    // ServeStaticModule EXISTENTE para o frontend React (pasta 'build')
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
      exclude: ['/api/(.*)', '/uploads/(.*)'], // Exclua também a pasta de uploads para evitar conflito
    }),
    UsersModule,
    AuthModule,
    AppointmentsModule, // Mantido, pois a lógica de agendamentos continua no backend
    VideosModule, // Adicione VideosModule aqui!
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}