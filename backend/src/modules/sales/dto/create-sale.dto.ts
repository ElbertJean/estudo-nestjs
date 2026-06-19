import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsInt } from "class-validator";
import { SalesStatus } from "../enum/sales.enum";

export class CreateSaleDto {
    @ApiProperty({ description: 'Nome do artista ou banda', example: 'Pink Floyd' })
    @IsString({ message: 'O artista deve ser um texto' })
    @IsNotEmpty({ message: 'O artista é obrigatório' })
    artist: string;

    @ApiProperty({ description: 'Nome do álbum de vinil', example: 'The Dark Side of the Moon' })
    @IsString({ message: 'O álbum deve ser um texto' })
    @IsNotEmpty({ message: 'O álbum é obrigatório' })
    album: string;

    @ApiProperty({ description: 'Valor de venda do disco', example: 180.00 })
    @IsNumber({}, { message: 'O valor de venda deve ser um número' })
    @IsPositive({ message: 'O valor de venda deve ser maior que zero' })
    @IsNotEmpty({ message: 'O valor de venda é obrigatório' })
    value: number;

    @ApiProperty({ description: 'Custo de aquisição do disco', example: 120.00 })
    @IsNumber({}, { message: 'O custo de compra deve ser um número' })
    @IsPositive({ message: 'O custo de compra deve ser maior que zero' })
    @IsNotEmpty({ message: 'O custo de compra é obrigatório' })
    cost: number;

    @ApiProperty({ description: 'ID do cliente associado à venda (opcional)', example: 1, required: false })
    @IsInt({ message: 'O ID do cliente deve ser um número inteiro' })
    @IsOptional()
    customerId?: number;

    @ApiProperty({ description: 'Status atual da venda', enum: SalesStatus, example: SalesStatus.EM_CATALOGO, required: false })
    @IsEnum(SalesStatus, { message: 'O status deve ser EM_CATALOGO, RESERVADO ou VENDIDO' })
    @IsOptional()
    status?: SalesStatus = SalesStatus.EM_CATALOGO;
}