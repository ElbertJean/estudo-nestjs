import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storesRepository: Repository<Store>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async create(createStoreDto: CreateStoreDto, userId: number): Promise<Store> {
        let slug = createStoreDto.slug;
        if (!slug) {
            throw new BadRequestException('O slug é obrigatório!');
        }

        const slugExists = await this.storesRepository.findOne({ where: { slug } });
        if (slugExists) {
            throw new ConflictException('Já existe uma loja com este slug de acesso.');
        }

        const newStore = this.storesRepository.create({ ...createStoreDto, slug });
        const savedStore = await this.storesRepository.save(newStore);

        // Associa o usuário criador a esta loja
        await this.usersRepository.update(userId, { store: savedStore });

        return savedStore;
    }

    async findAll(): Promise<Store[]> {
        return this.storesRepository.find({ relations: { users: true } });
    }

    async findOne(id: number): Promise<Store> {
        const store = await this.storesRepository.findOne({
            where: { id },
            relations: { users: true, customers: true, sales: true }
        });

        if (!store) {
            throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
        }

        return store;
    }

    async findBySlug(slug: string): Promise<Store> {
        const store = await this.storesRepository.findOne({
            where: { slug },
            relations: { sales: true }
        });

        if (!store) {
            throw new NotFoundException(`Loja com slug "${slug}" não encontrada.`);
        }

        const apenasEmCatalogo = store.sales.filter((sale) => sale.status === 'EM_CATALOGO');
        console.log('apenas em catalogo', apenasEmCatalogo)

        return store;
    }

    async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
        const slug = updateStoreDto.slug;
        const store = await this.storesRepository.preload({
            id,
            ...updateStoreDto,
        });

        if (slug) {
            const slugExists = await this.storesRepository.findOne({ where: { slug } });
            if (slugExists) {
                throw new ConflictException('Já existe uma loja com este slug de acesso.');
            }
        }

        if (!store) {
            throw new NotFoundException(`Loja com ID ${id} não encontrada.`);
        }

        return this.storesRepository.save(store);
    }

    async remove(id: number): Promise<void> {
        const store = await this.findOne(id);
        await this.storesRepository.remove(store);
    }
}
