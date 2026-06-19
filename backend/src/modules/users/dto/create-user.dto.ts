import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'Nome do usuário', example: 'Elbert' })
    @IsString({ message: 'O nome deve ser um texto' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    name: string;

    @ApiProperty({ description: 'E-mail do usuário', example: 'email@gmail.com' })
    @IsEmail({}, { message: 'O e-mail informado é inválido' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
    @IsString({ message: 'A senha deve ser um texto' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    password: string;
}