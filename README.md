# Kitco Price Server

A Node.js server that provides dynamic pricing for gold coins with ±5% random variation.

## Features

- Dynamic price generation within ±5% range of base price
- Configurable base price via query parameter
- CORS enabled for cross-origin requests
- TypeScript implementation
- Input validation and error handling

## API Endpoints

### GET /price

Returns a dynamic price within ±5% of the base price.

Query Parameters:
- `basePrice` (optional): The base price to calculate variations from. Default: 3297.61

Response Format:
```json
{
  "currentPrice": number,
  "originalPrice": number,
  "timestamp": string
}
```

### GET /

Health check endpoint.

Response Format:
```json
{
  "status": "ok",
  "message": "Kitco price server is running"
}
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Start production server:
   ```bash
   npm start
   ```

## Environment Variables

- `PORT`: Server port (default: 3000)

## Technologies

- Node.js
- Express
- TypeScript
- CORS 