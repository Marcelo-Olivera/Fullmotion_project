// src/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common'; // Importar ConflictException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto'; // Usa este DTO, pois ele já tem 'role' opcional
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Cria um novo usuário.
   * Se a 'role' não for explicitamente fornecida (ex: por um admin), ela será 'patient'.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto; // Desestruturar role também

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Usuário com este e-mail já existe.'); // Usar ConflictException para este caso
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      // Define a role: se foi passada no DTO, usa ela; caso contrário, define como 'patient'.
      role: role || UserRole.PATIENT, // <--- Lógica de role ajustada
    });
    return this.usersRepository.save(newUser);
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
    // Opcional: Para segurança, pode-se excluir a senha antes de retornar
    // const { password, ...result } = user;
    // return result as User;
    return user;
  }

  /**
   * Retorna todos os usuários.
   * Para segurança, exclui o campo password.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ select: ['id', 'email', 'role', 'createdAt', 'updatedAt'] }); // <--- Excluir password
  }

  /**
   * Deleta um usuário pelo ID.
   * @param id O ID do usuário a ser deletado.
   * @param requestingUserId O ID do admin que está fazendo a requisição.
   */
  async delete(id: string, requestingUserId: string): Promise<void> { // <--- Adicionar requestingUserId
    if (id === requestingUserId) {
        throw new BadRequestException('Um administrador não pode deletar sua própria conta através desta rota.'); // <--- Nova regra
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado para exclusão.`);
    }
  }
}