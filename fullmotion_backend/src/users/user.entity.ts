// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  PATIENT = 'patient',       // Nova role
  PHYSIOTHERAPIST = 'physiotherapist', // Nova role
  // USER = 'user', // Podemos remover esta se as novas roles cobrirem o uso geral
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @Column()
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  // Atualize o default para PATIENT se for a role mais comum ao criar sem especificar
  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;
}