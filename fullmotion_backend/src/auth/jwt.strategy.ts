// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // Para acessar variáveis de ambiente

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o JWT do cabeçalho Authorization: Bearer <token>
      ignoreExpiration: false, // Não ignora a expiração do token (token expirado é inválido)
      secretOrKey: configService.get<string>('JWT_SECRET'), // Usa a chave secreta do .env para verificar o token
    });
  }

  // Este método é chamado após o token ser validado (assinado corretamente e não expirado)
  // O 'payload' contém os dados que você colocou no token (userId, email, role)
  async validate(payload: any) {
    // Você pode fazer uma validação extra aqui, como buscar o usuário no banco de dados
    // para garantir que ele ainda existe ou não foi banido.
    // Por enquanto, vamos retornar os dados do payload diretamente.
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}