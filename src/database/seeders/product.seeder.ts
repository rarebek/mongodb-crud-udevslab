import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../products/product.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductSeeder {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async seed(count: number = 1000) {
    const products = Array.from({ length: count }, () => ({
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      stock: faker.number.int({ min: 0, max: 1000 }),
      category: faker.commerce.department(),
      isActive: faker.datatype.boolean(),
    }));

    await this.productModel.insertMany(products);
    console.log(`✅ Seeded ${count} products`);
  }
} 