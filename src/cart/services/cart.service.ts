import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CartItem} from "../../entities/cart_items";
import {Cart } from "../../entities/carts";
import { Product } from "../../entities/products";
import { v4 as uuidv4 } from 'uuid';
import { CartStatuses } from "../models";

// import { Cart, CartStatuses } from '../models';

@Injectable()
export class CartService {
  
  constructor(
      @InjectRepository(Cart) private cartRepository: Repository<Cart>,
      @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
  ) { }
  
  
    async findByUserId(userId: string): Promise<Cart> {
       const cart = await this.cartRepository.findOne({where: { user_id: userId }});
        if (!cart) {
            throw new NotFoundException(`Cart not found for user with ID ${userId}`);
        }
            return cart;
    }
  
  
  createByUserId(userId: string): Promise<Cart> {
    const status = CartStatuses.OPEN;
    const id = uuidv4();
    const date = new Date().toISOString();
    
    const newCart = this.cartRepository.create({
       id,
       user_id: userId,
       created_at: date,
       updated_at: date,
       status: status,
       items: [],
     });
    
    return this.cartRepository.save(newCart);
  }
 
  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const existingCart = await this.findByUserId(userId);
    
    if (existingCart) {
      return existingCart;
    }
    return this.createByUserId(userId);
  }
  
    
    async updateByUserId(userId: string, { product, count = 0 }: { product: Product, count?: number }): Promise<Cart> {
    const { id: cartId } = await this.findOrCreateByUserId(userId);
    
    const cartItem = await this.cartItemRepository.findOne({
     where: { cart: { id: cartId }, product: { id: product.id } },
   });
    
    if (!cartItem && +count) {
     const newCartItem = await this.cartItemRepository.create({
         id: uuidv4(),
         count,
         product: product.id,
         cart: { id: cartId },
       } as DeepPartial<CartItem>);
      await this.cartItemRepository.save(newCartItem);
    }
    
    if (cartItem) {
      if (+count) {
      cartItem.count = count;
        await this.cartItemRepository.save(cartItem);
      } else {
      await this.cartItemRepository.remove(cartItem);
      }
    }
    return this.findByUserId(userId);
  }
  
// async setOrdered(userId: string): Promise<void> {
//     const updatedCart = {
//         updatedAt: new Date().toISOString().split('T')[0],
//         status: CartStatuses.ORDERED,
//     };
//     await this.cartRepository.update({ user_id: userId }, updatedCart);
// }
    
    async setOrdered(userId: string): Promise<void> {
        const cart = await this.findByUserId(userId);
        if (!cart) {
            throw new NotFoundException(`Cart not found for user with ID ${userId}`);
        }
        
        cart.updated_at = new Date().toISOString().split('T')[0];
        cart.status = CartStatuses.ORDERED;
        
        await this.cartRepository.save(cart);
    }
  

  async removeByUserId(userId: string): Promise<void> {
    const existingCart = await this.findByUserId(userId);
    
    if (!existingCart) {
      throw new NotFoundException(`Cart not found for user with ID ${userId}`);
    }
    
    await this.cartRepository.remove(existingCart);
  }
  
}
