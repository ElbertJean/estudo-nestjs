import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enums/user-role.enum";
import { Store } from "src/modules/stores/entities/store.entity";
import { Exclude } from "class-transformer";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Exclude()
    @Column({ type: 'varchar' })
    password?: string

    @Column({ type: 'varchar', default: UserRole.FREE })
    role: UserRole;

    // Quando utilizamos ManyToOne, ele cria automaticamente a coluna na tabela users
    // que fará a ligação com a tabela de lojas. Chama-se storeId
    // Muitos usuários podem pertencer a uma loja (ManyToOne)
    @ManyToOne(() => Store, (store) => store.users)
    store: Store;
}