import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    @ApiOperation({ summary: 'Lista todos os usuários' })
    @ApiResponse({ status: 200, description: 'Usuários encontrados com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuários não encontrados' })
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Busca um usuário pelo ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.usersService.update(id, updateUserDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
    @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.remove(id);
    }
}
