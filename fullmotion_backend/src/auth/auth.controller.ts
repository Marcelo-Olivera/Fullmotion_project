// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common'; // Importe UnauthorizedException
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Importa o DTO de login

@Controller('auth') // Prefixo da rota: /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Rota: POST /api/auth/login
  @HttpCode(HttpStatus.OK) // Retorna status 200 (OK)
  async login(@Body() loginDto: LoginDto) {
    // Primeiro, valide as credenciais do usuário usando email e senha
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      // Se a validação falhar, lança uma exceção de não autorizado
      throw new UnauthorizedException('Credenciais inválidas');
    }
    // Se a validação for bem-sucedida, proceda com o login (gerar token)
    return this.authService.login(user);
  }
  
  // NOVO: Endpoint para solicitar redefinição de senha
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK) // Retorna 200 OK mesmo que o e-mail não exista, por segurança
  async forgotPassword(@Body('email') email: string) { // Pega apenas o 'email' do body
    await this.authService.forgotPassword(email);
    // Mensagem genérica por segurança para não vazar informações de e-mails existentes
    return { message: 'Se o e-mail estiver registrado, um link para redefinir a senha será enviado.' };
  }
  
}