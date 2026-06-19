import { Sales } from "src/modules/sales/entities/sale.entity";
import { Store } from "src/modules/stores/entities/store.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150 })
    phone: string;

    @ManyToOne(() => Store, (store) => store.customers, { nullable: false })
    store: Store;

    @OneToMany(() => Sales, (sale) => sale.customer)
    sales: Sales[];
}