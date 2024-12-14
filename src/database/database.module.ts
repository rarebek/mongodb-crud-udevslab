import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSeeder } from './seeders/product.seeder';
import { OrderSeeder } from './seeders/order.seeder';
import { Product, ProductSchema } from '../products/product.schema';
import { Order, OrderSchema } from '../orders/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema }
    ])
  ],
  providers: [ProductSeeder, OrderSeeder],
  exports: [ProductSeeder, OrderSeeder]
})
export class DatabaseModule {} 