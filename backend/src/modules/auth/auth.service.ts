import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async login(email: string, pass: string) {
        // 1. Busca o usuário pelo e-mail
        const user = await this.usersService.findByEmail(email); // *Você terá que criar esse método lá no UsersService!

        // Se não achar o user, ou a senha bater (vamos usar bcrypt.compare), lança erro!
        // OBS: Como não criamos as senhas criptografadas no banco ainda, faremos uma checagem simples por enquanto:
        const isMatch = await bcrypt.compare(pass, user.password);

        if (!user || !isMatch) {
            throw new UnauthorizedException('E-mail ou senha incorretos.');
        }

        // 2. Se a senha está certa, criamos o "Payload" (o recheio do crachá)
        const payload = { sub: user.id, email: user.email };

        // 3. Fabrica o Token e devolve
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}