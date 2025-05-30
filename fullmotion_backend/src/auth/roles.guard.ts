// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/user.entity'; // Importa o enum de roles
import { ROLES_KEY } from './roles.decorator'; // Importa a chave do decorator

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Pega as roles necessárias que foram definidas no decorator @Roles() na rota
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(), // Pega as roles definidas no método do controlador
      context.getClass(),   // Pega as roles definidas na classe do controlador
    ]);

    if (!requiredRoles) {
      return true; // Se não houver roles necessárias, permite o acesso
    }

    // Pega o objeto 'user' que foi anexado à requisição pelo JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // Verifica se a role do usuário está entre as roles necessárias
    return requiredRoles.some((role) => user.role === role);
  }
}