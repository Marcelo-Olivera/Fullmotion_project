import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appointments') // Nome da tabela no banco de dados
export class Appointment {
  @PrimaryGeneratedColumn('uuid') // ID único universal para cada agendamento
  id: string;

  @Column()
  fullName: string; // Nome completo do paciente

  @Column({ unique: true }) // CPF deve ser único para evitar duplicidade de agendamentos
  cpf: string;

  @Column()
  email: string;

  @Column()
  phone: string; // Telefone de contato

  @Column()
  cep: string;

  @Column()
  address: string; // Endereço (logradouro)

  @Column()
  number: string; // Número do endereço

  @Column({ nullable: true }) // Complemento é opcional
  complement?: string;

  @Column()
  neighborhood: string; // Bairro

  @Column({ type: 'date' }) // Armazena apenas a data (YYYY-MM-DD)
  appointmentDate: string;

  @Column({ type: 'time' }) // Armazena apenas a hora (HH:MM:SS)
  appointmentTime: string;

  @CreateDateColumn() // Coluna para a data de criação do registro
  createdAt: Date;

  @UpdateDateColumn() // Coluna para a data da última atualização do registro
  updatedAt: Date;
}