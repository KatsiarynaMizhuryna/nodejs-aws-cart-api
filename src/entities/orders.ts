import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User} from "./users";
import { Cart} from "./carts";


@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;
    
    @ManyToOne(() => Cart, (cart) => cart.id)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;
    
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
