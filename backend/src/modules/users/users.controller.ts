import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserRole } from './enums/user-role.enum';
import { Roles } from 'src/common/decorator/roles.decotator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { IsOwnerOrAdminGuard } from 'src/common/guard/is-owner-or-admin.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Cria um novo usuário no banco' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
    @ApiResponse({ status: 409, description: 'E-mail já está em uso' })
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lista todos os usuários (Apenas Admin)' })
    @ApiResponse({ status: 200, description: 'Usuários encontrados com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuários não encontrados' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Busca um usuário pelo ID' })
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<User> {
        return this.usersService.findOne(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @UseGuards(JwtAuthGuard, IsOwnerOrAdminGuard)
    @Patch(':id')
    async update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        const userLogado = req.user;
        if (userLogado.role !== UserRole.ADMIN && userLogado.sub !== id) {
            throw new ForbiddenException('Acesso negado: Você só pode atualizar o seu próprio perfil.');
        }
        return this.usersService.update(id, updateUserDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Altera o perfil (role) de um usuário (Apenas Admin)' })
    @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
    @ApiResponse({ status: 403, description: 'Acesso negado' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/role')
    updateRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserRoleDto: UpdateUserRoleDto
    ): Promise<User> {
        return this.usersService.updateRole(id, updateUserRoleDto.role);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deleta um usuário pelo ID (Apenas Admin)' })
    @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.remove(id);
    }
}
