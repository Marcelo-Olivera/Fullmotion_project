import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // Importa o DTO de login

@Controller('auth') // Prefixo da rota: /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Rota: POST /api/auth/login
  @HttpCode(HttpStatus.OK) // Retorna status 200 (OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}