import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../orders/order.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async getTopProducts(limit: number) {
    return this.orderModel.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$productDetails.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { 
            $sum: { $multiply: ['$items.quantity', '$items.price'] }
          },
          averageOrderValue: { $avg: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $project: {
          _id: 0,
          productName: 1,
          totalQuantity: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          averageOrderValue: { $round: ['$averageOrderValue', 2] }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: Number(limit) }
    ]);
  }

  async getSalesByPeriod(startDate: Date, endDate: Date) {
    return this.orderModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          totalSales: { $round: ['$totalSales', 2] },
          orderCount: 1,
          averageOrderValue: {
            $round: [{ $divide: ['$totalSales', '$orderCount'] }, 2]
          }
        }
      },
      { $sort: { date: 1 } }
    ]);
  }
} 