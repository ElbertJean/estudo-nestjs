import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/users/user-role.enum';
import { ROLES_KEY } from '../decorator/roles.decotator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Recupera as roles exigidas na rota usando getAllAndOverride (Sobrescrita inteligente)
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(), // Olha o método
            context.getClass(),   // Olha o Controller
        ]);

        // Se a rota não tem o decorator @Roles, ela é pública para qualquer usuário autenticado
        if (!requiredRoles) {
            return true;
        }

        // 2. Extrai o usuário da requisição (injetado anteriormente pelo JwtAuthGuard)
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('Acesso negado: Perfil de usuário não identificado no token.');
        }

        // 3. Verifica se o perfil do usuário atual atende aos requisitos
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('Acesso negado: Seu nível de acesso não permite esta operação.');
        }

        return true; // Acesso concedido
    }
}