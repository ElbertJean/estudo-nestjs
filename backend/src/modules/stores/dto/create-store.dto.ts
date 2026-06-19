import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateStoreDto {
    @ApiProperty({ description: 'Nome da loja', example: 'Loja 1' })
    @IsString({ message: 'O nome deve ser um texto' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    name: string;

    @ApiProperty({ description: 'Slug da loja', example: 'loja-1' })
    @IsString({ message: 'O slug deve ser um texto' })
    @IsNotEmpty({ message: 'O slug é obrigatório' })
    @MinLength(3, { message: 'O slug deve ter pelo menos 3 caracteres' })
    slug: string;

    @ApiProperty({ description: 'WhatsApp da loja', example: '11999999999' })
    @IsString({ message: 'O WhatsApp deve ser um texto' })
    @IsOptional()
    whatsapp: string;
}