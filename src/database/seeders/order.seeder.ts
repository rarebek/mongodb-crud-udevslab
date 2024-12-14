import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../orders/order.schema';
import { Product } from '../../products/product.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class OrderSeeder {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async seed(count: number = 500) {
    const products = await this.productModel.find().exec();
    
    const orders = await Promise.all(
      Array.from({ length: count }, async () => {
        const itemCount = faker.number.int({ min: 1, max: 5 });
        const items = Array.from({ length: itemCount }, () => {
          const product = faker.helpers.arrayElement(products);
          const quantity = faker.number.int({ min: 1, max: 10 });
          return {
            product: product._id,
            quantity,
            price: product.price
          };
        });

        const totalAmount = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return {
          items,
          totalAmount,
          customerName: faker.person.fullName(),
          status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled'])
        };
      })
    );

    await this.orderModel.insertMany(orders);
    console.log(`✅ Seeded ${count} orders`);
  }
} 