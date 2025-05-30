// src/users/dto/update-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'E-mail deve ser um formato válido.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password?: string;

  @IsOptional()
  // Atualize o IsEnum para incluir as novas roles
  @IsEnum(UserRole, { message: 'Role inválida. Deve ser admin, patient ou physiotherapist.' })
  role?: UserRole;
}