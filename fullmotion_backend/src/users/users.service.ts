// src/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs'; // Importa bcryptjs para hash de senhas

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // Injeta o repositório da entidade User
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Cria um novo usuário.
   * A senha é hasheada antes de ser salva no banco de dados.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('Usuário com este e-mail já existe.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Hash da senha com salt de 10 rodadas
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // Armazena a senha hasheada
    });
    return this.usersRepository.save(user);
  }

  /**
   * Busca um usuário pelo e-mail. Usado principalmente para login.
   */
  async findByEmail(email: string): Promise<User | null> { 
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Busca um usuário pelo ID.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    return user;
  }

  /**
   * Retorna todos os usuários.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Deleta um usuário pelo ID.
   */
  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) { // Verifica se algum registro foi afetado
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado para exclusão.`);
    }
  }
}