import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Enum para o status de acesso do vídeo
export enum VideoAccessStatus {
  PRIVATE = 'Privado',               // Apenas o fisioterapeuta que enviou e administradores podem ver.
  PUBLIC_FOR_PATIENTS = 'Público para Pacientes', // Todos os pacientes logados podem ver.
  SPECIFIC_PATIENTS = 'Pacientes Específicos',  // Apenas pacientes selecionados podem ver.
}

@Entity('videos') // Nome da tabela no banco de dados
export class Video {
  @PrimaryGeneratedColumn('uuid') // ID único para cada vídeo (UUID é bom para IDs distribuídos)
  id: string;

  @Column()
  title: string; // Título do vídeo (ex: "Exercício para Coluna Lombar")

  @Column({ nullable: true })
  description?: string; // Descrição do vídeo (opcional)

  @Column({ unique: true })
  filename: string; // Nome do arquivo no servidor (ex: "exercicio_coluna-abc123xyz.mp4")

  @Column()
  filePath: string; // Caminho de acesso ao arquivo no servidor (ex: "/uploads/videos/exercicio_coluna-abc123xyz.mp4")

  @Column()
  mimeType: string; // Tipo do arquivo (ex: "video/mp4")

  @Column()
  size: number; // Tamanho do arquivo em bytes

  // ID do usuário (fisioterapeuta) que fez o upload deste vídeo
  @Column()
  uploadedByUserId: string;

  // Status de acesso do vídeo: controla quem pode ver
  @Column({
    type: 'enum',
    enum: VideoAccessStatus,
    default: VideoAccessStatus.PRIVATE, // Por padrão, o vídeo é privado após o upload
  })
  accessStatus: VideoAccessStatus;

  // Lista de IDs de pacientes que têm acesso a este vídeo (se accessStatus for SPECIFIC_PATIENTS)
  @Column({ type: 'jsonb', nullable: true, default: [] }) // jsonb no PostgreSQL é bom para arrays e objetos JSON
  allowedPatientIds: string[]; // Array de UUIDs de pacientes

  @CreateDateColumn() // Data e hora de quando o vídeo foi enviado
  createdAt: Date;

  @UpdateDateColumn() // Data e hora da última atualização dos dados do vídeo
  updatedAt: Date;
}