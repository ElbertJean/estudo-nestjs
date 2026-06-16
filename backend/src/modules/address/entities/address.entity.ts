import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 9 })
    cep: string;

    @OneToOne(() => User, (user) => user.address)
    @JoinColumn()
    user: User;
}