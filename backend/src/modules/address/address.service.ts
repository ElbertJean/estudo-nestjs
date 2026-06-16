import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
    userRepository: any;
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
    ) { }

    async create(createAddressDto: CreateAddressDto): Promise<Address> {
        const newAddress = this.addressRepository.create({
            cep: createAddressDto.cep,
            user: { id: createAddressDto.userId }
        });

        return this.addressRepository.save(newAddress);
    }

}
