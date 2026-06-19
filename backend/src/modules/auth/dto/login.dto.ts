import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'E-mail cadastrado', example: 'email@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Senha de acesso', example: 'senha123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}