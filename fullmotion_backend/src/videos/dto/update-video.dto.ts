// src/videos/dto/update-video.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsArray, IsUUID } from 'class-validator';
import { VideoAccessStatus } from '../video.entity'; // Importa o enum

export class UpdateVideoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O título não pode ser vazio.' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(VideoAccessStatus, { message: 'Status de acesso inválido.' })
  accessStatus?: VideoAccessStatus;

  @IsOptional()
  @IsArray({ message: 'Os IDs de pacientes permitidos devem ser um array.' })
  // 'each: true' valida cada item do array como um UUID
  @IsUUID('4', { each: true, message: 'Cada ID de paciente deve ser um UUID válido.' })
  allowedPatientIds?: string[]; // Array de IDs de pacientes que terão acesso
}