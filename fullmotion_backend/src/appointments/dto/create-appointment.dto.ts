// src/appointments/dto/create-appointment.dto.ts
import { IsString, IsEmail, IsNotEmpty, Matches, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  // Validação de formato de CPF (XXX.XXX.XXX-XX ou XXXXXXXXXXX)
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, { message: 'Formato de CPF inválido. Use XXX.XXX.XXX-XX ou XXXXXXXXXXX.' })
  cpf: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  // Validação de formato de CEP (XXXXX-XXX ou XXXXXXXX)
  @Matches(/^\d{5}-?\d{3}$/, { message: 'Formato de CEP inválido. Use XXXXX-XXX ou XXXXXXXX.' })
  cep: string;

  @IsString()
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  number: string;

  @IsOptional()
  @IsString()
  complement?: string; // Campo opcional

  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty({ message: 'A data da avaliação é obrigatória.' })
  // Validação de formato de data YYYY-MM-DD
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Formato de data inválido. Use YYYY-MM-DD.' })
  appointmentDate: string;

  @IsString()
  @IsNotEmpty({ message: 'A hora da avaliação é obrigatória.' })
  // Validação de formato de hora HH:MM ou HH:MM:SS
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, { message: 'Formato de hora inválido. Use HH:MM ou HH:MM:SS.' })
  appointmentTime: string;
}