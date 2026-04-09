# Database Schema

## Overview
The Eyecare Glass Website uses MySQL 8.0+ as the primary database with JPA/Hibernate for ORM. This document describes the complete database schema, relationships, and constraints.

---

## Database Configuration
- **Database Name**: `eyecare_glass`
- **Charset**: UTF-8
- **Collation**: utf8mb4_unicode_ci
- **Engine**: InnoDB (for transaction support)

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐         ┌──────────────────┐
│     USERS       │         │     PRODUCTS     │
├─────────────────┤         ├──────────────────┤
│ PK id           │────┐    │ PK id            │
│    email        │    │    │    name          │
│    password     │    │    │    description   │
│    name         │    │    │    price         │
│    phone        │    │    │    category      │
│    address      │    │    │    image_url     │
│    created_at   │    │    │    stock         │
│    updated_at   │    │    │    created_at    │
│    is_active    │    │1:N │    updated_at    │
└─────────────────┘    │    └──────────────────┘
         ▲             │
         │             │
         │ 1:N         │
         │             │
    ┌────┴─────────────┘
    │
    ▼
┌──────────────────────┐
│     ORDERS           │
├──────────────────────┤
│ PK id                │
│ FK user_id           │
│    total_price       │   ┌────────────────────────┐
│    status            │──N:1─│  ORDER_ITEMS           │
│    created_at        │   ├────────────────────────┤
│    updated_at        │   │ PK id                  │
└──────────────────────┘   │ FK order_id            │
                           │ FK product_id          │
                           │    quantity            │
                           │    price_at_purchase   │
                           │    created_at          │
                           └────────────────────────┘
```

---

## Tables

### 1. USERS Table

**Columns:**
- `id`: Unique identifier for user
- `email`: User's email address (unique, used for login)
- `password`: Hashed password (bcrypt or similar)
- `name`: User's full name
- `phone`: Contact phone number
- `address`: Delivery/billing address
- `is_active`: Flag for account activation status
- `created_at`: Timestamp when user was created
- `updated_at`: Timestamp when user was last updated

---

### 2. PRODUCTS Table

**Columns:**
- `id`: Unique product identifier
- `name`: Product name
- `description`: Detailed product description
- `price`: Product price (decimal for accuracy)
- `category`: Product category (men, women, kids)
- `image_url`: URL to product image
- `stock`: Available quantity in stock
- `created_at`: Product creation timestamp
- `updated_at`: Last update timestamp

**Valid Categories:**
- `men` - Men's eyewear
- `women` - Women's eyewear
- `kids` - Children's eyewear

---

### 3. ORDERS Table

**Columns:**
- `id`: Unique order identifier
- `user_id`: Foreign key to USERS table
- `total_price`: Order total amount
- `status`: Current order status
- `created_at`: Order creation timestamp
- `updated_at`: Last update timestamp

**Valid Status Values:**
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed
- `shipped` - Order shipped to customer
- `delivered` - Order delivered
- `cancelled` - Order cancelled

---

### 4. ORDER_ITEMS Table

**Columns:**
- `id`: Unique line item identifier
- `order_id`: Foreign key to ORDERS table
- `product_id`: Foreign key to PRODUCTS table
- `quantity`: Number of items ordered
- `price_at_purchase`: Price when item was purchased
- `created_at`: When item was added to order

---

## Relationships

### 1. User → Orders (1:N)
One User can have Many Orders
- User.id (1) ──→ (N) Order.user_id

### 2. Order → Order_Items (1:N)
One Order can have Many Line Items
- Order.id (1) ──→ (N) OrderItem.order_id

### 3. Product → Order_Items (1:N)
One Product can appear in Many Orders
- Product.id (1) ──→ (N) OrderItem.product_id
