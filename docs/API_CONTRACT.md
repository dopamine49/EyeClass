# Eyecare Glass - API Contract (v1)

Base URL: `http://localhost:8080/api`

Swagger UI: `http://localhost:8080/api/swagger-ui.html`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (Bearer token)

## User

- `GET /users/me` (Bearer token)
- `PUT /users/me` (Bearer token)

## Product (Public)

- `GET /products?keyword=&category=&minPrice=&maxPrice=&sortBy=&sortDir=&page=&size=`
- `GET /products/{id}`

## Cart

- `GET /cart` (Bearer token)
- `PUT /cart/items` (Bearer token)
- `DELETE /cart/items/{productId}` (Bearer token)
- `DELETE /cart/clear` (Bearer token)

## Order / Checkout

- `POST /orders/checkout` (Bearer token)
- `GET /orders/my` (Bearer token)
- `GET /orders/{orderId}` (Bearer token)

## Review / Feedback

- `GET /reviews/product/{productId}` (public)
- `POST /reviews/product/{productId}` (Bearer token)
- `POST /feedback` (public)

## Maps

- `GET /maps/branches` (public)

## Admin

- `POST /admin/products` (ADMIN)
- `PUT /admin/products/{id}` (ADMIN)
- `DELETE /admin/products/{id}` (ADMIN)
- `GET /admin/users` (ADMIN)
- `GET /admin/orders` (ADMIN)
- `PATCH /admin/orders/{orderId}/status` (ADMIN)
