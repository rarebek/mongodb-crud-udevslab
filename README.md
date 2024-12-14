# Canvas E-commerce API with NestJS

A RESTful API for e-commerce built with NestJS and MongoDB, featuring automatic data seeding, advanced filtering, and reporting capabilities.

## Features

### Automatic Data Seeding:
- Generates 1000 products and 500 orders on startup
- Uses faker.js for realistic test data
- Configure via environment variables:
  - `SEED_DATA=true`
  - `PRODUCTS_SEED_COUNT=1000`
  - `ORDERS_SEED_COUNT=500`

### Product Management:
- **Pagination**: `GET /products?page=1&limit=10`
- **Search**: `GET /products?search=phone`
- **Exact Match Filter**: `GET /products?category=Electronics`
- **Sorting**: `GET /products?sortBy=price&sortOrder=desc`

```typescript
async findAll(queryDto: QueryProductDto) {
  const { page = 1, limit = 10, search, category, sortBy = 'name', sortOrder = 'asc' } = queryDto;
  const skip = (page - 1) * limit;

  const query = this.productModel.find();

  if (search) {
    query.or([
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]);
  }

  if (category) {
    query.where('category', category);
  }

  const total = await this.productModel.countDocuments(query.getQuery());
  const products = await query
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

### Advanced Reporting:
- **Top Products Report**: `GET /reports/top-products?limit=10`

```typescript
async getTopProducts(limit: number) {
  return this.orderModel.aggregate([
    { $match: { status: 'completed' } },
    { $unwind: '$items' },
    { $unwind: '$items.product' },
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
        averageOrderValue: { 
          $avg: { $multiply: ['$items.quantity', '$items.price'] }
        }
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
```

### Advanced Product Filtering

## Setup Instructions

### Clone and Install:
```bash
git clone https://github.com/rarebek/mongodb-crud-udevslab.git
cd mongodb-crud-udevslab
npm install
```

### Start Services:
```bash
docker-compose up --build
```

### Access:
- **API**: [http://localhost:3000](http://localhost:3000)
- **Docs**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Environment Variables

- `MONGODB_URI=mongodb://mongodb:27017/ecommerce`
- `SEED_DATA=true`
- `PRODUCTS_SEED_COUNT=1000`
- `ORDERS_SEED_COUNT=500`

## API Endpoints

### Products:
- `GET /products` - List with filters
- `POST /products` - Create new
- `GET /products/:id` - Get one
- `PATCH /products/:id` - Update
- `DELETE /products/:id` - Remove

### Reports:
- `GET /reports/top-products` - Sales performance
- `GET /reports/sales` - Period analysis

## Technology Stack

- NestJS Framework
- MongoDB Database
- Mongoose ODM
- OpenAPI/Swagger
- Docker Containers
- TypeScript Language

For detailed API documentation, visit the Swagger UI at `/api-docs` after starting the server.
