import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sales } from './entities/sale.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sales)
        private readonly salesRepository: Repository<Sales>,
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
    ) { }

    async create(createSaleDto: CreateSaleDto, storeId: number): Promise<Sales> {
        if (createSaleDto.customerId) {
            const customer = await this.customersRepository.findOne({
                where: { id: createSaleDto.customerId },
                relations: { store: true }
            });

            if (!customer) {
                throw new NotFoundException(`Cliente com ID ${createSaleDto.customerId} não encontrado.`);
            }

            if (customer.store.id !== storeId) {
                throw new ForbiddenException('Acesso negado: O cliente informado não pertence à sua loja.');
            }
        }

        // 3. Salva a venda injetando a data e a loja corretas
        const sale = this.salesRepository.create({
            ...createSaleDto,
            data: new Date(), // data atual do servidor
            store: { id: storeId },
            customer: createSaleDto.customerId ? { id: createSaleDto.customerId } : null
        });

        return this.salesRepository.save(sale);
    }

    async findAll(storeId: number): Promise<Sales[]> {
        return this.salesRepository.find({
            where: { store: { id: storeId } },
            relations: { customer: true }
        });
    }

    async findOne(id: number, storeId: number): Promise<Sales> {
        const sale = await this.salesRepository.findOne({
            where: { id, store: { id: storeId } },
            relations: { customer: true }
        });

        if (!sale) {
            throw new NotFoundException(`Venda com ID ${id} não encontrada na sua loja.`);
        }
        return sale;
    }

    async update(id: number, updateSaleDto: UpdateSaleDto, storeId: number): Promise<Sales> {
        const existingSale = await this.findOne(id, storeId);

        // Validar relação de lucro caso valores de venda/custo estejam mudando
        const value = updateSaleDto.value !== undefined ? updateSaleDto.value : existingSale.value;
        const cost = updateSaleDto.cost !== undefined ? updateSaleDto.cost : existingSale.cost;

        // Validar cliente caso esteja mudando
        let customerRelation = undefined;
        if (updateSaleDto.customerId !== undefined) {
            if (updateSaleDto.customerId === null) {
                customerRelation = null;
            } else {
                const customer = await this.customersRepository.findOne({
                    where: { id: updateSaleDto.customerId },
                    relations: { store: true }
                });

                if (!customer) {
                    throw new NotFoundException(`Cliente com ID ${updateSaleDto.customerId} não encontrado.`);
                }

                if (customer.store.id !== storeId) {
                    throw new ForbiddenException('Acesso negado: O cliente informado não pertence à sua loja.');
                }
                customerRelation = { id: updateSaleDto.customerId };
            }
        }

        const sale = await this.salesRepository.preload({
            id: existingSale.id,
            ...updateSaleDto,
            customer: customerRelation
        });

        return this.salesRepository.save(sale);
    }

    async remove(id: number, storeId: number): Promise<void> {
        const sale = await this.findOne(id, storeId);
        await this.salesRepository.remove(sale);
    }
}
