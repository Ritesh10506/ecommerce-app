# E-Commerce Backend (Spring Boot)

REST API for an online store, built during HCL training.

## Features
- User registration & login with JWT authentication
- BCrypt password encryption, ADMIN / CUSTOMER roles
- Categories & products (search, filter by category)
- Shopping cart with stock validation
- Checkout, order placement, cancellation (stock restored)
- Global error handling & input validation

## Tech Stack
Java 21 · Spring Boot 4 · Spring Data JPA (Hibernate) · Spring Security · JWT · MySQL 8 · Maven

## Run Locally
1. Create the database:
```sql
   CREATE DATABASE ecommerce_db;
```
2. Copy `.env.example` to `.env` and fill in your MySQL password.
3. Update the DB port in `application.properties` if yours is not 3506.
4. Run:
```
   ./mvnw spring-boot:run
```
5. API runs on `http://localhost:8081`
   Default admin: `admin@shop.com` / `admin123`

## Main APIs
| Module | Endpoint |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Products | `GET /api/products`, `GET /api/products/search?name=` |
| Cart | `POST /api/cart/{userId}/add`, `POST /api/cart/{userId}/checkout` |
| Orders | `GET /api/orders/user/{userId}`, `PUT /api/orders/{id}/cancel` |

## Author
Ritesh Singh — B.Tech CSE, ABES Engineering College