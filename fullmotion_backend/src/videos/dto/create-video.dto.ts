import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { VideoAccessStatus } from '../video.entity'; // Importa o enum que você criou

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty({ message: 'O título do vídeo é obrigatório.' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional() // O status inicial pode ser padrão, mas permitimos que seja definido no upload
  @IsEnum(VideoAccessStatus, { message: 'Status de acesso inválido.' })
  accessStatus?: VideoAccessStatus;

  // As informações do arquivo (nome, caminho, tipo, tamanho) e o ID do uploader
  // serão preenchidos automaticamente pelo backend usando o Multer e o JWT.
}