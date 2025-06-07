// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer'; // Importe MailerService
import { ConfigService } from '@nestjs/config'; // Importe ConfigService
import { User } from '../users/user.entity'; // Importe User e UserRole

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService, // Injete MailerService
    private configService: ConfigService, // Injete ConfigService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // NOVO: Método para solicitar redefinição de senha
  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Por segurança, não informe se o e-mail não existe. Apenas diga que o e-mail foi enviado.
      // throw new NotFoundException('Usuário não encontrado com este e-mail.');
      console.warn(`Tentativa de redefinição de senha para e-mail inexistente: ${email}`);
      return; // Apenas saia, para não dar dica a invasores
    }

    // Gera um token único (pode ser um UUID, ou um hash mais complexo)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpires = new Date(Date.now() + 3600000); // Token válido por 1 hora

    // Salva o token e a expiração no usuário
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await this.usersService.save(user); // Crie um método save no UsersService se não tiver

    // Constrói o link de redefinição
    // O BASE_FRONTEND_URL deve ser definido no seu .env
    const frontendUrl = this.configService.get<string>('BASE_FRONTEND_URL') || 'http://localhost:3001';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Envia o e-mail
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Redefinição de Senha Fullmotion',
        template: 'reset-password', // Nome do arquivo Pug (sem a extensão)
        context: { // Variáveis que serão passadas para o template Pug
          name: user.email.split('@')[0], // Ou user.fullName se você tiver esse campo
          resetLink: resetLink,
        },
      });
      console.log(`E-mail de redefinição enviado para ${user.email}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail de redefinição para ${user.email}:`, error);
      throw new BadRequestException('Erro ao enviar e-mail de redefinição.');
    }
  }

  // NOVO: Método para redefinir a senha (será implementado na Parte 2)
  async resetPassword(token: string, newPasswordPlain: string): Promise<void> {
    // A ser implementado na Parte 2
    throw new BadRequestException('Funcionalidade de redefinição ainda não implementada.');
  }
}