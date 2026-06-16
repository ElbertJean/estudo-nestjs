import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
        const userToSave = { ...createUserDto, password: hashedPassword };
        return this.usersRepository.save(userToSave);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            relations: { address: true }
        });
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ relations: { address: true }, where: { id } });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado`); // Erro HTTP 404
        }

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ relations: { address: true }, where: { email } });
        if (!user) {
            throw new NotFoundException(`Usuário com email ${email} não encontrado`); // Erro HTTP 404
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        // 1. Preload verifica se o ID existe e mescla as alterações na entidade
        const user = await this.usersRepository.preload({
            id: id,
            ...updateUserDto,
        });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        return this.usersRepository.save(user); // Salva as alterações
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }
        await this.usersRepository.remove(user);
    }


}
