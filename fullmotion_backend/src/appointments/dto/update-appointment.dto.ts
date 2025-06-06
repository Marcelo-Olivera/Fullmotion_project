import { IsOptional, IsString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../appointment.entity'; // Importa o enum de status

export class UpdateAppointmentDto {
  // Você pode incluir outras propriedades que podem ser atualizadas
  // Por exemplo, email, phone, etc., se permitido
  @IsOptional()
  @IsString()
  email?: string; // Exemplo: se o email do agendamento puder ser atualizado

  @IsOptional()
  @IsString()
  phone?: string; // Exemplo: se o telefone do agendamento puder ser atualizado

  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Status inválido.' }) // Valida se o status é um dos valores do enum
  status?: AppointmentStatus; // O status é a propriedade chave aqui para atualização
}