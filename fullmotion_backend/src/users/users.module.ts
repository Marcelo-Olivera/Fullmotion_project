// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity'; // Importa a entidade User

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registra a entidade User com o TypeORM para este módulo
  providers: [UsersService], // Declara o serviço que será injetado em outros lugares
  controllers: [UsersController], // Declara o controlador que irá lidar com as requisições
  exports: [UsersService], // Exporta o serviço para que outros módulos (como AuthModule) possam usá-lo
})
export class UsersModule {}