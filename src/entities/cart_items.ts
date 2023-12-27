import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Column } from "typeorm";
import { Cart} from "./carts";
import { Product } from "./products";

@Entity( 'cart_items')
export class CartItem {
    // @PrimaryGeneratedColumn('uuid')
    // product_id: string;
    //
    // @Column({ type: 'uuid', nullable: false })
    // cart_id: string;
    //
    // @ManyToOne(() => Cart)
    // @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
    // cart: Cart;
    //
    // @Column()
    // count: number;
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => Cart, (cart) => cart.id)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;
    
    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product: Product;
    
    @Column({ type: 'uuid' })
    product_id: string;
    
    @Column({ type: 'integer' })
    count: number;
    
    
    
    
}
