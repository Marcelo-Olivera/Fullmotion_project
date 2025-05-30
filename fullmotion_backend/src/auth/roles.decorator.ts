import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user.entity'; // Importa o enum de roles

export const ROLES_KEY = 'roles'; // Uma chave única para armazenar os metadados
// Decorator @Roles que aceita uma lista de roles
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);