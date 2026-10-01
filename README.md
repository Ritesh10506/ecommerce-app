# ShopEasy – Full-Stack E-Commerce Application

![CI](https://github.com/Ritesh10506/ecommerce-app/actions/workflows/ci.yml/badge.svg)

A full-stack online store built during **HCL Industry Training**.
Customers can browse products, manage a cart, check out and track orders.
Admins get a separate panel to manage products, categories, orders and users.

## Features

### Customer store
- Register / login with JWT authentication
- Search, category filter and sorting
- Product details with live stock status
- Cart with quantity control and stock validation
- Checkout with address form (cash on delivery)
- My Orders with status tracker and cancellation (stock restored)

### Admin panel (`/admin`)
- Dashboard: revenue, orders by status, low-stock alerts, recent orders
- Add / edit / delete products (with image preview)
- Create categories
- Update order status (PENDING → CONFIRMED → SHIPPED → DELIVERED)
- View and delete users

### Backend
- Layered architecture: Controller → Service → Repository
- Transactional checkout – stock is never half-updated
- BCrypt password hashing, JWT tokens, ADMIN / CUSTOMER roles
- Bean Validation and global error handling (400 / 401 / 403 / 404 / 409)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, TypeScript, Signals, Router, HttpClient |
| Backend | Java 21, Spring Boot 4, Spring Data JPA (Hibernate) |
| Security | Spring Security, JWT (jjwt), BCrypt |
| Database | MySQL 8 |
| Tools | Maven, Git & GitHub, GitHub Actions, IntelliJ IDEA, VS Code |

## Project Structure

```
ecommerce-app/
├── backend/              Spring Boot REST API (port 8081)
├── frontend/             Angular app (port 4200)
└── .github/workflows/    CI – builds and tests both on every push
```

## Run Locally

### 1. Database
```sql
CREATE DATABASE ecommerce_db;
```

### 2. Backend
```bash
cd backend
# copy .env.example to .env and fill in your MySQL password
./mvnw spring-boot:run
```
- Runs on `http://localhost:8081`
- Change the DB port in `application.properties` if yours is not 3506
- Default admin: `admin@shop.com` / `admin123`

### 3. Frontend
```bash
cd frontend
npm install
ng serve
```
- Open `http://localhost:4200`

## API Overview

| Module | Endpoints | Access |
|---|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Public / logged in |
| Products | `GET /api/products`, `GET /api/products/{id}`, `GET /api/products/category/{id}`, `GET /api/products/search?name=` | Public |
| Products (admin) | `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}` | Admin |
| Categories | `GET /api/categories`, `POST /api/categories` | Public / Admin |
| Cart | `POST /api/cart/{userId}/add`, `GET /api/cart/{userId}`, `PUT /api/cart/item/{id}`, `DELETE /api/cart/item/{id}`, `POST /api/cart/{userId}/checkout` | Logged in |
| Orders | `GET /api/orders/user/{userId}`, `PUT /api/orders/{id}/cancel` | Logged in |
| Orders (admin) | `GET /api/orders`, `PUT /api/orders/{id}/status?status=` | Admin |
| Users (admin) | `GET /api/users`, `DELETE /api/users/{id}` | Admin |

## Author

**Ritesh Singh** – B.Tech CSE, ABES Engineering College, Ghaziabad
[GitHub](https://github.com/Ritesh10506) · [LinkedIn](https://www.linkedin.com/in/ritesh-singh-79453433b)
