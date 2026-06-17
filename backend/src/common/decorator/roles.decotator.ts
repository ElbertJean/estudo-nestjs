import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/users/user-role.enum';

// Chave utilizada para salvar os metadados
export const ROLES_KEY = 'roles';

// O decorator pode receber mais de um perfil, ex: @Roles(UserRole.ADMIN, UserRole.FREE)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);