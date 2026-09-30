# E-Commerce Web Application

Full-stack online store built during HCL training.

| Part | Tech | Folder |
|---|---|---|
| Backend | Java 21, Spring Boot 4, Spring Security (JWT), MySQL | `backend/` |
| Frontend | Angular | `frontend/` |

## Features
- Register / login with JWT, BCrypt passwords, ADMIN and CUSTOMER roles
- Categories and products with search and category filter
- Shopping cart with stock validation, checkout
- Orders with status tracking and cancellation (stock restored)
- Global error handling and input validation

## Run the backend
1. Run `CREATE DATABASE ecommerce_db;` in MySQL
2. In `backend/`, copy `.env.example` to `.env` and fill in your values
3. `cd backend` then `./mvnw spring-boot:run` (runs on http://localhost:8081)
4. Default admin: `admin@shop.com` / `admin123`

## Run the frontend
Coming soon.

## Author
Ritesh Singh - B.Tech CSE, ABES Engineering College
