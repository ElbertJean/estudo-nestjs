import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService,
        private readonly usersService: UsersService,
    ) {}

    private async getUserStoreId(userId: number): Promise<number> {
        const user = await this.usersService.findOne(userId);
        if (!user.store) {
            throw new ForbiddenException('Acesso negado: Você precisa estar vinculado a uma loja para gerenciar clientes.');
        }
        return user.store.id;
    }

    @ApiOperation({ summary: 'Cadastra um novo cliente na loja do usuário' })
    @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
    @Post()
    async create(@Body() createCustomerDto: CreateCustomerDto, @Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.customersService.create(createCustomerDto, storeId);
    }

    @ApiOperation({ summary: 'Lista todos os clientes da loja do usuário' })
    @Get()
    async findAll(@Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.customersService.findAll(storeId);
    }

    @ApiOperation({ summary: 'Busca um cliente pelo ID' })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.customersService.findOne(id, storeId);
    }

    @ApiOperation({ summary: 'Atualiza um cliente pelo ID' })
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCustomerDto: UpdateCustomerDto,
        @Req() req
    ) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.customersService.update(id, updateCustomerDto, storeId);
    }

    @ApiOperation({ summary: 'Exclui um cliente pelo ID' })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        await this.customersService.remove(id, storeId);
    }
}
