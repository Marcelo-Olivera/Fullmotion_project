// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointment.entity'; // Importa a entidade Appointment

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])], // Registra a entidade Appointment
  providers: [AppointmentsService], // Declara o serviço
  controllers: [AppointmentsController], // Declara o controlador
})
export class AppointmentsModule {}