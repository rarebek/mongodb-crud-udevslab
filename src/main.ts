import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ProductSeeder } from './database/seeders/product.seeder';
import { OrderSeeder } from './database/seeders/order.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API for managing products and orders')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  
  if (process.env.SEED_DATA === 'true') {
    const productSeeder = app.get(ProductSeeder);
    const orderSeeder = app.get(OrderSeeder);
    
    await productSeeder.seed(parseInt(process.env.PRODUCTS_SEED_COUNT || '1000'));
    await orderSeeder.seed(parseInt(process.env.ORDERS_SEED_COUNT || '500'));
  }

  await app.listen(3000);
}
bootstrap(); 