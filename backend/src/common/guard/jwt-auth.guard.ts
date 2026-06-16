import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request); // Pega o token do cabeçalho

        if (!token) {
            throw new UnauthorizedException('Token não encontrado. Faça login.');
        }

        try {
            // Tenta decifrar o token com a nossa chave secreta
            const payload = await this.jwtService.verifyAsync(token, {
                secret: 'MINHA_CHAVE_SECRETA_SUPER_SEGURA'
            });
            // Se deu certo, gruda os dados do usuário na requisição para o Controller usar depois
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Token inválido ou expirado.');
        }
        return true; // Pode entrar!
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        // Pega o cabeçalho Authorization: Bearer <token>
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}