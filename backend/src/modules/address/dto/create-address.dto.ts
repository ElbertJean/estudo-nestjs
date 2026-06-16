import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAddressDto {
    @ApiProperty({ description: 'Id do usuário', example: 1 })
    @IsNumber({}, { message: 'O id do usuario deve ser um número' })
    @IsNotEmpty({ message: 'O id do usuario é obrigatório' })
    userId: number;

    @ApiProperty({ description: 'Cep do usuário', example: '12345678 ou 12226-330' })
    @IsString({ message: 'O cep deve ser uma string' })
    @IsNotEmpty({ message: 'O cep é obrigatório' })
    @MaxLength(9, { message: 'O cep deve ter no máximo 9 caracteres' })
    @MinLength(8, { message: 'O cep deve ter no mínimo 8 caracteres' })
    cep: string;

}