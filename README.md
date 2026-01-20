# Minimal Authentication App

A minimal full-stack authentication application built as part of Rakuten Symphony Full Stack Developer assignment.

The goal of this project is to demonstrate **clean architecture, clear separation of concerns, and sound trade-offs**.

---

## Overview

The application consists of:
- A **Go REST API backend** that handles authentication and user persistence
- A **React (TypeScript) single-page application** frontend that allows users to:
  - Sign up
  - Sign in
  - View a protected profile page
  - Sign out

Authentication is implemented using **JWT (stateless)**.

---

## Tech Stack

### Backend
- Go
- `net/http`
- PostgreSQL
- JWT (HS256)
- bcrypt

### Frontend
- React
- TypeScript
- React Router
- Context API for state management

---

## Architecture

### Backend

The backend follows a simple layered architecture:

handler → service → repository → database

- **Handlers**: HTTP request/response handling
- **Service**: Business logic (authentication, hashing, JWT)
- **Repository**: Database access
- **Middleware**: Cross-cutting concerns (authentication, CORS)

JWT authentication is **stateless** and enforced via middleware on protected routes.

---

### Frontend

- Authentication state is managed using **React Context**
- Tokens are stored in `localStorage`
- API requests are centralized in a client module
- Protected routes are enforced using a `ProtectedRoute` component

Redux was intentionally avoided to keep state management simple and scoped.

---

## API Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/signup` | Create a new user |
| POST | `/api/auth/signin` | Authenticate a user |
| GET | `/api/me` | Get current user (protected) |
| POST | `/api/auth/signout` | Handled client-side |

All requests and responses use JSON.

---

## Environment Variables

### Backend

```bash
PORT=8080
DATABASE_URL=postgres://user:password@localhost:5432/authdb?sslmode=disable
JWT_SECRET=dev-secret
```

- JWT_SECRET has a fallback for local development
- Secrets are injected via environment variables, not hardcoded

---

## Local Run 

### Backend 

```bash
go run ./cmd/server
```

The server will start on: http://0.0.0.0:8080


### Frontend 

The frontend is built using **Vite** and React (TypeScript).

```bash
npm install
npm run dev
```

The frontend runs on: http://localhost:5173

***CORS is enabled on the backend to support local development with separate ports.***

---

## Unittest

1. Make sure users table is set up in Postgres for testing 
2. Set environment variable (similar to backend setup)
```bash 
export DATABASE_URL="postgres://<username>:<password>@localhost:5432/<database>?sslmode=disable"
```
3. Run the test - `handler_test.go`
```bash 
go test -v ./internal/auth
```

Expected output: 
```bash 
maureenpriscilla@Maureens-MacBook-Pro backend % go test -v ./internal/auth                                                                    
=== RUN   TestSignUpAndSignIn
--- PASS: TestSignUpAndSignIn (0.26s)
PASS
ok      auth-app/internal/auth  0.514s
maureenpriscilla@Maureens-MacBook-Pro backend % 
```