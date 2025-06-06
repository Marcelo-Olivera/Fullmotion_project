// src/appointments/appointment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// NOVO: Enum para os status do agendamento
export enum AppointmentStatus {
  PENDING = 'Pendente',
  CONFIRMED = 'Confirmado',
  COMPLETED = 'Realizado', // Mudado de 'Realizado' para 'COMPLETED' (inglês), mantendo o valor para BD como 'Realizado'
  CANCELED = 'Cancelado',
  AWAITING_PAYMENT = 'Aguardando Pagamento',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cep: string;

  @Column()
  address: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  neighborhood: string;

  @Column({ type: 'date' })
  appointmentDate: string;

  @Column({ type: 'time' })
  appointmentTime: string;

  // NOVO: Coluna para o status do agendamento
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING, // Status padrão quando um agendamento é criado
  })
  status: AppointmentStatus; // O tipo da coluna é o enum AppointmentStatus

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}