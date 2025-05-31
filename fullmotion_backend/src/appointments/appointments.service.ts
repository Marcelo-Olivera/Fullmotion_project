// src/appointments/appointments.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment) // Injeta o repositório da entidade Appointment
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  /**
   * Cria um novo agendamento de avaliação.
   * Verifica se já existe um agendamento para o mesmo CPF, data e hora.
   */
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Verifica se já existe um agendamento para este CPF na mesma data e hora
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

    const appointment = this.appointmentsRepository.create(createAppointmentDto);
    return this.appointmentsRepository.save(appointment);
  }

  /**
   * Retorna todos os agendamentos.
   * (No futuro, pode ser filtrado por data, fisioterapeuta, etc.)
   */
  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find();
  }

  /**
   * Busca um agendamento pelo ID.
   */
  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID "${id}" não encontrado.`);
    }
    return appointment;
  }

  /**
   * Atualiza um agendamento pelo ID.
   * Implementar DTO de update-appointment.dto.ts se necessário.
   */
  // async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
  //   const appointment = await this.findOne(id); // Reutiliza findOne para verificar existência
  //   const updatedAppointment = this.appointmentsRepository.merge(appointment, updateAppointmentDto);
  //   return this.appointmentsRepository.save(updatedAppointment);
  // }

  /**
   * Remove um agendamento pelo ID.
   */
  async remove(id: string): Promise<void> {
    const result = await this.appointmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agendamento com ID "${id}" não encontrado para exclusão.`);
    }
  }
}