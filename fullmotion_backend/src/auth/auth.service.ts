// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Importa o serviço de usuários
import { JwtService } from '@nestjs/jwt'; // Serviço para assinar e verificar JWTs
import * as bcrypt from 'bcryptjs'; // Para comparar senhas hasheadas
import { LoginDto } from './dto/login.dto'; // Importa o DTO de login

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Injeta o serviço de usuários
    private jwtService: JwtService,     // Injeta o serviço JWT
  ) {}

  /**
   * Valida as credenciais de um usuário.
   * @returns O usuário sem a senha, ou null se inválido.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // Remove a senha do objeto antes de retorná-lo
      // Isso é importante para não expor a senha em outros lugares.
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Realiza o login, valida o usuário e gera um token JWT.
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    // Payload do JWT: dados que serão armazenados no token
    // 'sub' é uma convenção para Subject (ID do usuário)
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload), // Assina o payload e gera o token
    };
  }
}