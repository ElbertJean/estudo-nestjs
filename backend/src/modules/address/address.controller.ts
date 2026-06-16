import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { AddressService } from './address.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cria um endereço para o usuário' })
    @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Erro ao criar endereço' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @Post()
    create(@Body() createAddressDto: CreateAddressDto): Promise<Address> {
        return this.addressService.create(createAddressDto);
    }

}
