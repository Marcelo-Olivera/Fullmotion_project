// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importa UsersModule para usar UsersService
import { JwtModule } from '@nestjs/jwt'; // Módulo JWT
import { PassportModule } from '@nestjs/passport'; // Módulo Passport
import { JwtStrategy } from './jwt.strategy'; // Sua estratégia JWT
import { ConfigModule, ConfigService } from '@nestjs/config'; // Para configurar JwtModule assincronamente

@Module({
  imports: [
    UsersModule, // Necessário para que AuthService possa usar UsersService
    PassportModule, // Necessário para a integração com Passport.js
    JwtModule.registerAsync({ // Configuração assíncrona do JwtModule (pega JWT_SECRET do ConfigService)
      imports: [ConfigModule], // Importa ConfigModule para que ConfigService esteja disponível
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Pega a chave secreta do .env
        signOptions: { expiresIn: '1h' }, // Token expira em 1 hora (ajuste conforme necessário)
      }),
      inject: [ConfigService], // Injeta ConfigService no useFactory
    }),
  ],
  providers: [AuthService, JwtStrategy], // Registra o serviço de autenticação e a estratégia JWT
  controllers: [AuthController], // Registra o controlador de autenticação
  exports: [AuthService], // Exporta o AuthService para outros módulos se necessário
})
export class AuthModule {}