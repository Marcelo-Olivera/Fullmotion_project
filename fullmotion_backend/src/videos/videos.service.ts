import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Video, VideoAccessStatus } from './video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UserRole } from '../users/user.entity'; // Importar UserRole

@Injectable()
export class VideosService {
  private readonly UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'videos');

  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }

  /**
   * Cria um novo registro de vídeo no banco de dados após o upload físico do arquivo.
   * Regra: SÓ ADMIN PODE ADICIONAR VÍDEOS (já tratado pelo @Roles no controller)
   */
  async create(createVideoDto: CreateVideoDto, file: Express.Multer.File, uploadedByUserId: string): Promise<Video> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo de vídeo foi enviado.');
    }

    const video = this.videosRepository.create({
      ...createVideoDto,
      filename: file.filename,
      filePath: `/uploads/videos/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
      uploadedByUserId: uploadedByUserId,
      accessStatus: createVideoDto.accessStatus || VideoAccessStatus.PRIVATE,
      allowedPatientIds: [],
    });

    return this.videosRepository.save(video);
  }

  /**
   * Busca todos os vídeos.
   * Regra: FISIOTERAPEUTAS E ADMINS VÊEM TODOS OS VÍDEOS.
   * @param requestUser Objecto do usuário da requisição (com ID e role).
   */
  async findAll(requestUser: { userId: string, role: string }): Promise<Video[]> {
    // Comentário: A rota já está protegida para ADMIN e PHYSIOTHERAPIST.
    // Se o requisito é que ambos vejam TUDO, não precisamos filtrar por uploadedByUserId aqui.
    // A query para findAll() pode ser simplesmente buscar todos os vídeos.
    return this.videosRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Busca um vídeo específico pelo ID. (SEM MUDANÇAS)
   */
  async findOne(id: string): Promise<Video> {
    const video = await this.videosRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException(`Vídeo com ID "${id}" não foi encontrado.`);
    }
    return video;
  }

  /**
   * Busca vídeos liberados para um paciente específico. (SEM MUDANÇAS)
   */
  async findReleasedVideosForPatient(patientId: string): Promise<Video[]> {
    return this.videosRepository.find({
      where: [
        { accessStatus: VideoAccessStatus.PUBLIC_FOR_PATIENTS },
        {
          accessStatus: VideoAccessStatus.SPECIFIC_PATIENTS,
          allowedPatientIds: Raw(
            (alias) => `${alias} @> '["${patientId}"]'::jsonb`
          ),
        },
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Atualiza informações de um vídeo existente. (SEM MUDANÇAS NA LÓGICA INTERNA)
   * A permissão (fisioterapeuta que fez o upload ou admin) já é tratada.
   */
  async update(id: string, updateVideoDto: UpdateVideoDto, requestUser: { userId: string, role: string }): Promise<Video> {
    const video = await this.videosRepository.findOne({ where: { id } });

    if (!video) {
      throw new NotFoundException(`Vídeo com ID "${id}" não foi encontrado para atualização.`);
    }

    // Apenas o usuário que fez o upload ou um admin pode editar o vídeo.
    if (video.uploadedByUserId !== requestUser.userId && requestUser.role !== UserRole.ADMIN) {
      throw new BadRequestException('Você não tem permissão para editar este vídeo.');
    }

    if (updateVideoDto.accessStatus === VideoAccessStatus.SPECIFIC_PATIENTS) {
        if (!updateVideoDto.allowedPatientIds || !Array.isArray(updateVideoDto.allowedPatientIds) || updateVideoDto.allowedPatientIds.length === 0) {
            throw new BadRequestException('Para o status "Pacientes Específicos", é necessário informar os IDs dos pacientes permitidos.');
        }
    } else {
        updateVideoDto.allowedPatientIds = [];
    }

    const updatedVideo = this.videosRepository.merge(video, updateVideoDto);
    return this.videosRepository.save(updatedVideo);
  }

  /**
   * Remove um vídeo e seu arquivo físico correspondente.
   * Regra: SÓ ADMIN PODE DELETAR VÍDEOS.
   * @param id ID do vídeo a ser removido.
   * @param requestUser Objeto do usuário da requisição (com ID e role) para verificação de permissão.
   */
  async remove(id: string, requestUser: { userId: string, role: string }): Promise<void> {
    const video = await this.videosRepository.findOne({ where: { id } });

    if (!video) {
      throw new NotFoundException(`Vídeo com ID "${id}" não foi encontrado para exclusão.`);
    }

    // Regra ajustada: APENAS ADMIN PODE DELETAR.
    if (requestUser.role !== UserRole.ADMIN) { // <--- MODIFICAÇÃO AQUI
      throw new BadRequestException('Você não tem permissão para deletar este vídeo. Apenas administradores podem.');
    }

    try {
      const fullPath = path.join(this.UPLOAD_DIR, video.filename);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (fsError) {
      console.error(`Erro ao deletar arquivo físico ${video.filename}:`, fsError);
    }

    const result = await this.videosRepository.delete(id);
    if (result.affected === 0) {
      throw new InternalServerErrorException('Falha ao remover o vídeo do banco de dados.');
    }
  }
}