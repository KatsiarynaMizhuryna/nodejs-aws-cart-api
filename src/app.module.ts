import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import 'dotenv/config';
import { CartItem} from "./entities/cart_items";
import { Cart} from "./entities/carts";
import { Product } from "./entities/products";
import { Order } from "./entities/orders";
import { User } from "./entities/users";

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.RDS_DATABASE_NAME,
      host: process.env.RDS_HOST,
      port: 5432,
      username: process.env.RDS_USERNAME,
      password: process.env.RDS_PASSWORD,
      entities: [Product, CartItem, Cart, Order, User],
      // synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false
      }
      
   }),
    TypeOrmModule.forFeature([Product, CartItem, Cart, Order, User])
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
