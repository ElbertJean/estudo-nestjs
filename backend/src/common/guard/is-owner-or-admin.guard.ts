import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { UserRole } from 'src/modules/users/user-role.enum';

@Injectable()
export class IsOwnerOrAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Pega o ID que veio na URL (ex: :id) e converte para número
        const paramId = Number(request.params.id);

        if (!user) {
            throw new ForbiddenException('Acesso negado: Usuário não autenticado.');
        }

        // Regra: Permitido se for Admin OU se o ID do token (sub) for igual ao ID do parâmetro
        if (user.role === UserRole.ADMIN || user.sub === paramId) {
            return true; // Liberado!
        }

        throw new ForbiddenException('Acesso negado: Você não tem permissão para gerenciar este recurso.');
    }
}
