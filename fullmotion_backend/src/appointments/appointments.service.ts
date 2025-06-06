// src/appointments/appointments.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity'; // Importe AppointmentStatus
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto'; // Importe o novo DTO

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        cpf: createAppointmentDto.cpf,
        appointmentDate: createAppointmentDto.appointmentDate,
        appointmentTime: createAppointmentDto.appointmentTime,
      },
    });

    if (existingAppointment) {
      throw new ConflictException('Já existe um agendamento para este CPF nesta data e hora.');
    }

    // Ao criar, o status será automaticamente 'Pendente' devido ao 'default' na entidade
    const appointment = this.appointmentsRepository.create(createAppointmentDto);
    return this.appointmentsRepository.save(appointment);
  }

  // Método findAll existente para listar todos (pode ser usado em combinação com filtros no controller)
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find();
  }

  // NOVO: Método para buscar agendamentos com filtros (para a planilha do fisioterapeuta)
  async findFiltered(
    date?: string, // Ex: '2025-06-15'
    status?: AppointmentStatus, // Ex: AppointmentStatus.PENDING
    // physiotherapistId?: string, // Adicionar no futuro se agendamentos tiverem fisioterapeuta associado
  ): Promise<Appointment[]> {
    const query: any = {}; // Objeto para construir a query de filtro

    if (date) {
      query.appointmentDate = date;
    }
    if (status) {
      query.status = status;
    }
    // if (physiotherapistId) {
    //   query.physiotherapistId = physiotherapistId;
    // }

    // Ordena por data e hora para exibição na planilha
    return this.appointmentsRepository.find({
      where: query,
      order: {
        appointmentDate: 'ASC',
        appointmentTime: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID "${id}" não encontrado.`);
    }
    return appointment;
  }

  // NOVO: Método para atualizar um agendamento (incluindo o status)
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({ where: { id } });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID "${id}" não encontrado para atualização.`);
    }

    // Se o status estiver sendo atualizado, garantir que é um valor válido do enum
    if (updateAppointmentDto.status && !Object.values(AppointmentStatus).includes(updateAppointmentDto.status)) {
        throw new BadRequestException(`Status inválido: "${updateAppointmentDto.status}".`);
    }

    // Mescla os dados recebidos com os dados existentes do agendamento
    const updatedAppointment = this.appointmentsRepository.merge(appointment, updateAppointmentDto);

    return this.appointmentsRepository.save(updatedAppointment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agendamento com ID "${id}" não encontrado para exclusão.`);
    }
  }
}