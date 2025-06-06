import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Param, Delete, Put, Query } from '@nestjs/common'; // Importe Put e Query
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto'; // Importe o novo DTO
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { AppointmentStatus } from './appointment.entity'; // Importe o enum de status

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  // Rota para listar todos os agendamentos (ainda protegida por ADMIN/PHYSIOTHERAPIST)
  // Esta rota agora também aceita filtros opcionais via query parameters
  @Get() // Rota: GET /api/appointments?date=YYYY-MM-DD&status=Pendente
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST)
  async findAllFiltered(
    @Query('date') date?: string, // Pega o parâmetro 'date' da URL (opcional)
    @Query('status') status?: AppointmentStatus, // Pega o parâmetro 'status' da URL (opcional)
  ) {
    // Chama o novo método findFiltered do serviço
    return this.appointmentsService.findFiltered(date, status);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST)
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  // NOVO: Rota para atualizar um agendamento pelo ID
  @Put(':id') // Rota: PUT /api/appointments/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST) // Apenas administradores e fisioterapeutas podem atualizar
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto, // Utiliza o DTO de atualização
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.appointmentsService.remove(id);
  }
}