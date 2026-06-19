import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
    ) {}

    async create(createCustomerDto: CreateCustomerDto, storeId: number): Promise<Customer> {
        const customer = this.customersRepository.create({
            ...createCustomerDto,
            store: { id: storeId }
        });
        return this.customersRepository.save(customer);
    }

    async findAll(storeId: number): Promise<Customer[]> {
        return this.customersRepository.find({
            where: { store: { id: storeId } }
        });
    }

    async findOne(id: number, storeId: number): Promise<Customer> {
        const customer = await this.customersRepository.findOne({
            where: { id, store: { id: storeId } }
        });

        if (!customer) {
            throw new NotFoundException(`Cliente com ID ${id} não encontrado na sua loja.`);
        }

        return customer;
    }

    async update(id: number, updateCustomerDto: UpdateCustomerDto, storeId: number): Promise<Customer> {
        // Primeiro garante que o cliente pertence à loja do usuário
        const existingCustomer = await this.findOne(id, storeId);

        const customer = await this.customersRepository.preload({
            id: existingCustomer.id,
            ...updateCustomerDto,
        });

        return this.customersRepository.save(customer);
    }

    async remove(id: number, storeId: number): Promise<void> {
        const customer = await this.findOne(id, storeId);
        await this.customersRepository.remove(customer);
    }
}
