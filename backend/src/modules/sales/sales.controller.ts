import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decotator';
import { UserRole } from '../users/enums/user-role.enum';
import { IsOwnerOrAdminGuard } from 'src/common/guard/is-owner-or-admin.guard';

@ApiTags('Sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
    constructor(
        private readonly salesService: SalesService,
        private readonly usersService: UsersService,
    ) { }

    private async getUserStoreId(userId: number): Promise<number> {
        const user = await this.usersService.findOne(userId);
        if (!user.store) {
            throw new ForbiddenException('Acesso negado: Você precisa estar vinculado a uma loja para gerenciar vendas.');
        }
        return user.store.id;
    }

    @ApiOperation({ summary: 'Registra uma nova venda de disco' })
    @ApiResponse({ status: 201, description: 'Venda registrada com sucesso' })
    @ApiResponse({ status: 400, description: 'Prejuízo na venda ou dados inválidos' })
    @Post()
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    async create(@Body() createSaleDto: CreateSaleDto, @Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.salesService.create(createSaleDto, storeId);
    }

    @ApiOperation({ summary: 'Lista todas as vendas da loja do usuário' })
    @Get()
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    async findAll(@Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.salesService.findAll(storeId);
    }

    @ApiOperation({ summary: 'Busca detalhes de uma venda pelo ID' })
    @Get(':id')
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.salesService.findOne(id, storeId);
    }

    @ApiOperation({ summary: 'Atualiza dados de uma venda pelo ID' })
    @Patch(':id')
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSaleDto: UpdateSaleDto,
        @Req() req
    ) {
        const storeId = await this.getUserStoreId(req.user.sub);
        return this.salesService.update(id, updateSaleDto, storeId);
    }

    @ApiOperation({ summary: 'Exclui o registro de uma venda pelo ID' })
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const storeId = await this.getUserStoreId(req.user.sub);
        await this.salesService.remove(id, storeId);
    }
}
