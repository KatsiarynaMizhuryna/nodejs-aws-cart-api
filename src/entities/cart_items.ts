import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Column } from "typeorm";
import { Cart} from "./carts";


@Entity()
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ type: 'uuid', nullable: false })
    cart_id: string;
    
    @ManyToOne(() => Cart, (cart) => cart.items, )
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;
    
    @Column('uuid')
    product_id: string;
    
    @Column({nullable: false})
    price: number;
    
    @Column()
    count: number;
}
