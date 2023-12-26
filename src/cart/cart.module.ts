import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import {TypeOrmModule} from "@nestjs/typeorm";
import { CartItem} from "../entities/cart_items";
import { Cart} from "../entities/carts";
import { Product} from "../entities/products";
import {User} from "../entities/users";


@Module({
  imports: [ OrderModule, TypeOrmModule.forFeature([Cart, CartItem, Product, User]) ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
