import { Module } from '@nestjs/common';
import { OrderService } from './services';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Order } from "../entities/orders";
import { Cart } from "../entities/carts";

@Module({
  // imports: [TypeOrmModule.forFeature([ Order, Cart ])],
  providers: [ OrderService ],
  exports: [ OrderService ]
})
export class OrderModule {}
