# API Documentation

Base URL: `http://localhost:8100`

## Authentication Endpoints

### Register User
Creates a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "data": "John Doe"
}
```

**Errors:**
- `400` - Email already in use or validation error

---

### Login
Authenticates user and returns access & refresh tokens.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

### Refresh Token
Generates new access and refresh tokens using a valid refresh token.

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401` - Invalid or expired refresh token

---

## User Endpoints

### Get Current User
Returns authenticated user information.

**Endpoint:** `GET /api/user`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Errors:**
- `401` - Unauthorized (missing or invalid token)

---

## Response Format

All API responses follow this structure:

```json
{
  "message": "Description of the result",
  "data": {}  // Optional, contains response data
}
```

## Token Information

- **Access Token:** Short-lived token for API requests (configured expiration)
- **Refresh Token:** Long-lived token to obtain new access tokens
- Access tokens must be included in the `Authorization` header as `Bearer {token}`
