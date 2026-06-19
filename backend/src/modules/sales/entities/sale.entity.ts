import { Customer } from "src/modules/customers/entities/customer.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SalesStatus } from "../enum/sales.enum";
import { Store } from "src/modules/stores/entities/store.entity";

@Entity('sales')
export class Sales {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    artist: string;

    @Column({ type: 'varchar', length: 150 })
    album: string;

    @Column({ type: 'float' })
    value: number

    @Column({ type: 'float' })
    cost: number;

    @Column({ type: 'date' })
    data: Date;

    @Column({ type: 'enum', enum: SalesStatus })
    status: SalesStatus;

    @ManyToOne(() => Customer, (customer) => customer.sales, { nullable: true })
    customer: Customer;

    @ManyToOne(() => Store, (store) => store.sales, { nullable: false })
    store: Store;
}