// src/users/users.controller.ts
import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Iremos criar este
import { RolesGuard } from '../auth/roles.guard';     // Iremos criar este
import { Roles } from '../auth/roles.decorator';       // Iremos criar este
import { UserRole } from './user.entity';

@Controller('users') // Prefixo da rota: /api/users (devido ao setGlobalPrefix no main.ts)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Rota: POST /api/users
  @UseGuards(JwtAuthGuard, RolesGuard) // Protege a rota com autenticação JWT e guarda de roles
  @Roles(UserRole.ADMIN) // Somente administradores podem criar usuários
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 (Created)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() // Rota: GET /api/users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Somente administradores podem listar todos os usuários
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // Rota: GET /api/users/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Somente administradores podem buscar usuários por ID
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id') // Rota: DELETE /api/users/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Somente administradores podem deletar usuários
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna status 204 (No Content)
  async remove(@Param('id') id: string) {
    await this.usersService.delete(id);
  }
}