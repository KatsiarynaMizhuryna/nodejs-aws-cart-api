import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn
} from "typeorm";
import { CartItem} from "./cart_items";
import { CartStatuses} from "../cart";


@Entity('Cart')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('uuid', { nullable: false })
    user_id: string;
    
    // @ManyToOne(() => User, (user) => user.id)
    // @JoinColumn({ name: 'user_id' })
    // user: User;
    
    @CreateDateColumn({ type: 'date', nullable: false })
    created_at: string;
    
    @UpdateDateColumn({ type: 'date', nullable: false })
    updated_at: string;
    
    @Column({
        type: 'enum',
        enum: CartStatuses,
        default: CartStatuses.OPEN,
    })
    status: CartStatuses;
    
    @OneToMany(() => CartItem, (cartItem) => cartItem.cart.id)
    @JoinColumn({ name: 'id', referencedColumnName: 'cart_id' })
    items: CartItem[]
}
