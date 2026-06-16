import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        UsersModule, // Precisamos acessar os Usuários para verificar se o email existe!
        JwtModule.register({
            global: true, // O token pode ser lido de qualquer lugar da aplicação
            secret: 'MINHA_CHAVE_SECRETA_SUPER_SEGURA', // Em produção, isso fica no arquivo .env!
            signOptions: { expiresIn: '1h' }, // O crachá expira em 1 hora
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }