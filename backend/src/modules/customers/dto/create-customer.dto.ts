import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({ description: 'Nome do cliente', example: 'Elbert' })
    @IsString({ message: 'O nome deve ser um texto' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    name: string;

    @ApiProperty({ description: 'Telefone do cliente', example: '11999999999' })
    @IsString({ message: 'O telefone deve ser um texto' })
    @MinLength(9, { message: 'O telefone deve ter pelo menos 9 caracteres' })
    @IsOptional()
    phone: string;

}