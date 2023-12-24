import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { CartItem} from "./cart_items";

export enum CartStatus {
    OPEN = 'OPEN',
    ORDERED = 'ORDERED',
}

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('uuid', { nullable: false })
    user_id: string;
    
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
    
    @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.OPEN,
})
    status: CartStatus;
    
    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    items: CartItem[]
}
