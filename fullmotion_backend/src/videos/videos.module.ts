// src/videos/videos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from './video.entity'; // Importa a entidade Video
import { UsersModule } from '../users/users.module'; // Importa UsersModule para usar UsersService no VideosService

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    UsersModule, // Necessário para injetar UsersService no VideosService para verificações de permissão (opcionalmente)
  ],
  providers: [VideosService],
  controllers: [VideosController],
  exports: [VideosService], // Exporta o serviço se outros módulos precisarem dele
})
export class VideosModule {}