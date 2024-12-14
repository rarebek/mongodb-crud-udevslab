import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/ecommerce'),
    ProductsModule,
    DatabaseModule,
    ReportsModule
  ],
})
export class AppModule {} 