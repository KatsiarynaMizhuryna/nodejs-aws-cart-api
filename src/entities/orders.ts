import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne} from 'typeorm';
import { User} from "./users";
import { Cart} from "./carts";


@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    user_id: string;
    
    // @ManyToOne(() => User, (user) => user.id)
    // @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    // user: User;
    
    // @ManyToOne(() => Cart, (cart) => cart.id)
    // @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
    // cart: Cart;
    @OneToOne(() => Cart)
    @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
    cart: Cart;
    
    @Column({ type: 'uuid', nullable: false })
    cart_id: string;
    
    @Column('json', { nullable: true })
    payment: Record<string, any>;
    
    @Column('json', { nullable: true })
    delivery: Record<string, any>;
    
    @Column('text', { nullable: true })
    comments: string;
    
    @Column()
    status: string;
    
    @Column('numeric')
    total: number;
}
