// src/users/users.controller.ts
import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common'; // Importar Req
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Rota: POST /api/users para criar usuários (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Somente administradores podem criar usuários (incluindo role)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() // Rota: GET /api/users para listar todos (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Somente administradores podem listar todos os usuários
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // Rota: GET /api/users/:id para buscar por ID (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Somente administradores podem buscar usuários por ID
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id') // Rota: DELETE /api/users/:id para deletar (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Somente administradores podem deletar usuários
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: any) { // <--- Adicionar @Req() req: any
    await this.usersService.delete(id, req.user.userId); // <--- Passar o ID do admin logado
  }
}