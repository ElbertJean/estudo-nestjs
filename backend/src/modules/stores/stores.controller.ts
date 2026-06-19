import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decotator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsOwnerOrAdminGuard } from 'src/common/guard/is-owner-or-admin.guard';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cria uma nova loja para o usuário logado' })
    @ApiResponse({ status: 201, description: 'Loja criada com sucesso' })
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    @Post()
    create(@Body() createStoreDto: CreateStoreDto, @Req() req): Promise<any> {
        const userId = req.user.sub; // Extraído do JWT
        return this.storesService.create(createStoreDto, userId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lista todas as lojas do sistema (Apenas Admin)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll(): Promise<any[]> {
        return this.storesService.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Busca detalhes de uma loja pelo ID' })
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.storesService.findOne(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Busca loja pelo slug público' })
    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string): Promise<any> {
        return this.storesService.findBySlug(slug);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualiza dados da loja pelo ID' })
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStoreDto: UpdateStoreDto,
    ): Promise<any> {
        return this.storesService.update(id, updateStoreDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Exclui uma loja (Apenas Admin)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.storesService.remove(id);
    }
}
