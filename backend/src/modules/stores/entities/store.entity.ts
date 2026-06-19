import { Customer } from "src/modules/customers/entities/customer.entity";
import { Sales } from "src/modules/sales/entities/sale.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    slug: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    whatsapp: string

    // Uma loja pode ter muitos usuários (OneToMany)
    @OneToMany(() => User, (user) => user.store)
    users: User[];

    // Uma loja pode ter muitos clientes
    @OneToMany(() => Customer, (customer) => customer.store)
    customers: Customer[];

    // Uma loja pode ter muitas vendas
    @OneToMany(() => Sales, (sale) => sale.store)
    sales: Sales[];
}