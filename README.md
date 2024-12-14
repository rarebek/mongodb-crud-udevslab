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

### Advanced Reporting:
- **Top Products Report**: `GET /reports/top-products?limit=10`
  - Uses `$match` for completed orders
  - `$lookup` for product details
  - `$group` by product
  - Calculates totals with `$sum`
  - `$sort` by revenue
- **Sales Report**: `GET /reports/sales?startDate=2024-01-01&endDate=2024-12-31`
  - Date range filtering with `$match`
  - Daily aggregation using `$group`
  - Revenue calculations
  - `$project` for formatting

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
