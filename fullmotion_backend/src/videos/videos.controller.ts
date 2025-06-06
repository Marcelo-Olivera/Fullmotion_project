import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Req, Query, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { VideoAccessStatus } from './video.entity';
import * as path from 'path';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  // Rota para upload de vídeo
  // Regra: SÓ ADMIN PODE ADICIONAR VÍDEOS
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // <--- APENAS ADMIN AGORA
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads', 'videos'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const extension = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(mp4|mov|avi|wmv|flv|webm)$/)) {
          return cb(new BadRequestException('Apenas arquivos de vídeo são permitidos!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
    @Req() req: any,
  ) {
    return this.videosService.create(createVideoDto, file, req.user.userId);
  }

  // Rota para listar todos os vídeos
  // Regra: FISIOTERAPEUTAS TÊM ACESSO A TODOS OS VÍDEOS (assim como admin)
  @Get() // Rota: GET /api/videos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST) // <--- AMBOS PODEM VER
  async findAll(@Req() req: any) {
    // A lógica de filtragem foi movida para o service ou ajustada lá
    // para que fisioterapeutas vejam todos os vídeos.
    return this.videosService.findAll(req.user); // Passa o objeto user completo
  }

  // Rota para listar vídeos liberados para o paciente logado (SEM MUDANÇAS)
  @Get('released')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  async findReleasedForPatient(@Req() req: any) {
    return this.videosService.findReleasedVideosForPatient(req.user.userId);
  }

  // Rota para buscar um vídeo específico (SEM MUDANÇAS NA PERMISSÃO DE ROTA)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST, UserRole.PATIENT)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const video = await this.videosService.findOne(id);
    if (req.user.role === UserRole.PATIENT) {
      if (
        video.accessStatus === VideoAccessStatus.PUBLIC_FOR_PATIENTS ||
        (video.accessStatus === VideoAccessStatus.SPECIFIC_PATIENTS && video.allowedPatientIds.includes(req.user.userId))
      ) {
        return video;
      } else {
        throw new BadRequestException('Você não tem permissão para acessar este vídeo.');
      }
    }
    return video;
  }

  // Rota para atualizar um vídeo (SEM MUDANÇAS NA PERMISSÃO DE ROTA)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHYSIOTHERAPIST) // Ambos ainda podem atualizar
  async updateVideo(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @Req() req: any,
  ) {
    return this.videosService.update(id, updateVideoDto, req.user);
  }

  // Rota para deletar um vídeo
  // Regra: SÓ ADMIN PODE DELETAR VÍDEOS
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // <--- APENAS ADMIN AGORA
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVideo(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.videosService.remove(id, req.user); // A validação mais fina está no service
  }
}