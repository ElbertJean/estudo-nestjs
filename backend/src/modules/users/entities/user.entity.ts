import { Address } from "src/modules/address/entities/address.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string

    @Column({ type: 'int' })
    age: number;

    @OneToOne(() => Address, (address) => address.user, { cascade: true })
    address: Address;
}