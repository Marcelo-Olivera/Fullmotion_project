// src/appointments/appointments.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Para proteger rotas
import { RolesGuard } from '../auth/roles.guard';     // Para autorização por role
import { Roles } from '../auth/roles.decorator';       // Decorator de roles
import { UserRole } from '../users/user.entity';     // Enum de roles

@Controller('appointments') // Prefixo da rota: /api/appointments
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post() // Rota: POST /api/appointments (para agendar avaliação)
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 (Created)
  // Não protegemos a rota de criação para que qualquer um possa agendar uma avaliação inicial.
  // Se for necessário que apenas usuários logados agendem, adicione @UseGuards(JwtAuthGuard) aqui.
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get() // Rota: GET /api/appointments (listar todos os agendamentos)
  @UseGuards(JwtAuthGuard, RolesGuard) // Protege a rota com autenticação e guarda de roles
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST) // Apenas administradores e fisioterapeutas podem listar agendamentos
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id') // Rota: GET /api/appointments/:id (buscar agendamento por ID)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST) // Apenas administradores e fisioterapeutas podem buscar
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Delete(':id') // Rota: DELETE /api/appointments/:id (deletar agendamento)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Apenas administradores podem deletar agendamentos
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.appointmentsService.remove(id);
  }
}