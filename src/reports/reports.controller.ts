import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('top-products')
  @ApiOperation({ summary: 'Get top selling products' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getTopProducts(@Query('limit', new ParseIntPipe({ optional: true })) limit = 10) {
    return this.reportsService.getTopProducts(limit);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales by period' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2024-12-31' })
  async getSalesByPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getSalesByPeriod(
      new Date(startDate),
      new Date(endDate),
    );
  }
} 