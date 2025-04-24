# McMock
## McDonald's Payment System Mock API

A NestJS-based mock API for simulating the McDonald's payments system.

☠ Do NOT order these past 3 AM ☠

TalentLand 2025

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

### Authentication

The API uses JWT authentication for all endpoints except the token generation endpoint, which uses an API key.

#### Getting a JWT Token

```bash
curl -X POST https://api.example.com/payments/auth/token \
  -H "x-mcd-api-key: test_mcd_api_key_123" \
  -H "Content-Type: application/json" \
  -d '{"client_id": "your_client_id"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
}
```

### API Endpoints

#### Execute Payment

Process a payment with one or more payment orders.

```
POST /payments
```

**Headers:**
- Authorization: Bearer {your_jwt_token}
- Content-Type: application/json

**Request Body:**
```json
{
  "checkout_id": "checkout_123",
  "buyer_info": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "psp": "stripe",
  "psp_info": {
    "transaction_id": "tx_123456",
    "success": true
  },
  "payment_orders": [
    {
      "payment_order_id": "order_123",
      "client_id": "client_456",
      "location_id": "location_789",
      "order_info": {
        "items": [
          { "name": "Big Mac", "quantity": 2 }
        ]
      },
      "amount": "10.99",
      "currency": "USD"
    }
  ]
}
```

**Response:**
```json
{
  "checkout_id": "checkout_123",
  "psp": "stripe",
  "payment_orders": [
    {
      "payment_order_id": "order_123",
      "status": "COMPLETED",
      "checkout_id": "checkout_123"
    }
  ]
}
```

#### Check Payment Status

Get the status of a payment order.

```
GET /payments/{payment_order_id}
```

**Headers:**
- Authorization: Bearer {your_jwt_token}

**Response:**
```json
{
  "payment_order_id": "order_123",
  "checkout_id": "checkout_123",
  "client_id": "client_456",
  "location_id": "location_789",
  "amount": "10.99",
  "currency": "USD",
  "psp": "stripe",
  "psp_reference": "psp_ref_abc123",
  "status": "COMPLETED",
  "order_status": "COMPLETED",
  "pickup_code": "A42"
}
```

### Mock Implementation Details

This mock API simulates payment processing with the following behaviors:

1. **Payment Execution**:
   - Creates a new payment entry for each order in the request
   - Generates a random PSP reference for each order
   - Payment status is determined by the `success` flag in the `psp_info` object (defaults to `true`)
   - Failed payments include error details with code, message, and recommendations

2. **Payment Status**:
   - Returns the payment details for the requested payment order ID
   - Randomly assigns an order status of either "PENDING" or "COMPLETED"
   - Generates a random pickup code (letter followed by number) for COMPLETED orders
   - Returns a 404 error if the payment order is not found

3. **Error Handling**:
   - Error responses include appropriate HTTP status codes and descriptive messages
   - Payment failures include detailed error information that can be used for testing error flows
