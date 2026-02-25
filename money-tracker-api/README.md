# Money Tracker API - Laravel Application
## Overview

A simple backend API built with **Laravel 12** that allows users to manage multiple wallets and track income/expense transactions. This API is designed to be consumed by a frontend application.

### Table Structure

#### 1. **users Table**
```sql
- id (bigint, primary key, auto-increment)
- name (varchar, 255)
- email (varchar, 255, unique)
- password (varchar, 255)
- created_at (timestamp, nullable)
- updated_at (timestamp, nullable)
```

#### 2. **wallets Table**
```sql
- id (bigint, primary key, auto-increment)
- user_id (bigint, foreign key → users.id, on delete cascade)
- name (varchar, 255)
- description (text, nullable)
- balance (decimal, 12,2, default: 0.00)
- created_at (timestamp, nullable)
- updated_at (timestamp, nullable)
```

#### 3. **transactions Table**
```sql
- id (bigint, primary key, auto-increment)
- wallet_id (bigint, foreign key → wallets.id, on delete cascade)
- title (varchar, 255)
- description (text, nullable)
- amount (decimal, 12,2)
- type (enum: 'income', 'expense')
- created_at (timestamp, nullable)
- updated_at (timestamp, nullable)
```

---

## Models Created

### 1. **User Model** (`app/Models/User.php`)
```php
- Fillable: name, email, password
- Hidden: password
- Relationships: hasMany(Wallet::class)
```

### 2. **Wallet Model** (`app/Models/Wallet.php`)
```php
- Fillable: user_id, name, description, balance
- Casts: balance → decimal:2
- Relationships: belongsTo(User::class), hasMany(Transaction::class)
```

### 3. **Transaction Model** (`app/Models/Transaction.php`)
```php
- Fillable: wallet_id, title, description, amount, type
- Casts: amount → decimal:2
- Relationships: belongsTo(Wallet::class)
```

---

## API Endpoints

### Base URL
```
http://127.0.0.1:8000/api
```

### 1. **Create a new user**
```
POST /api/users
```
**Description:** Creates a new user account (no authentication required)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (201 Created):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "updated_at": "2026-02-25T13:49:23.000000Z",
  "created_at": "2026-02-25T13:49:23.000000Z",
  "id": 1
}
```

### 2. **Get user profile with all wallets**
```
GET /api/users/{id}
```
**Description:** Returns user details, all wallets belonging to the user, each wallet's balance, and total balance across all wallets

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "wallets": [
    {
      "id": 1,
      "name": "Main Wallet",
      "description": "Primary spending account",
      "balance": 4450.25
    },
    {
      "id": 2,
      "name": "Savings Wallet",
      "description": "Long-term savings",
      "balance": 1000.00
    }
  ],
  "total_balance": 5450.25
}
```

### 3. **Create a new wallet**
```
POST /api/wallets
```
**Description:** Creates a new wallet for a specific user

**Request Body:**
```json
{
  "user_id": 1,
  "name": "Main Wallet",
  "description": "Primary spending account"
}
```

**Response (201 Created):**
```json
{
  "user_id": 1,
  "name": "Main Wallet",
  "description": "Primary spending account",
  "balance": 0,
  "updated_at": "2026-02-25T13:52:10.000000Z",
  "created_at": "2026-02-25T13:52:10.000000Z",
  "id": 1
}
```

### 4. **Get specific wallet with all transactions**
```
GET /api/wallets/{id}
```
**Description:** Returns wallet details with balance and all associated transactions

**Response (200 OK):**
```json
{
  "wallet": {
    "id": 1,
    "name": "Main Wallet",
    "description": "Primary spending account",
    "balance": 4450.25,
    "user_id": 1
  },
  "transactions": [
    {
      "id": 1,
      "title": "Monthly Salary",
      "description": "January 2026 salary",
      "amount": 5000.00,
      "type": "income",
      "created_at": "2026-02-25T13:53:15.000000Z"
    },
    {
      "id": 2,
      "title": "Rent Payment",
      "description": "February rent",
      "amount": 1500.00,
      "type": "expense",
      "created_at": "2026-02-25T13:54:22.000000Z"
    }
  ]
}
```

### 5. **Add a transaction to a wallet**
```
POST /api/transactions
```
**Description:** Adds an income or expense transaction to a wallet. Automatically updates wallet balance (income adds, expense subtracts)

**Request Body:**
```json
{
  "wallet_id": 1,
  "title": "Monthly Salary",
  "description": "January 2026 salary",
  "amount": 5000.00,
  "type": "income"
}
```

**Response (201 Created):**
```json
{
  "transaction": {
    "wallet_id": 1,
    "title": "Monthly Salary",
    "description": "January 2026 salary",
    "amount": 5000.00,
    "type": "income",
    "updated_at": "2026-02-25T13:53:15.000000Z",
    "created_at": "2026-02-25T13:53:15.000000Z",
    "id": 1
  },
  "new_balance": 5000.00
}
```

## Error Handling

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 422 Validation Error
```json
{
  "errors": {
    "email": ["The email has already been taken."],
    "amount": ["The amount must be at least 0.01."]
  }
}
```

### 400 Bad Request (Insufficient Balance)
```json
{
  "message": "Insufficient balance for this expense"
}
```

---

## Installation Guide

### Prerequisites
- PHP >= 8.2
- Composer
- MySQL / SQLite
- Laravel 12

### Step 1: Clone the repository
```bash
git clone https://github.com/MuthonduG/four_front_assessment
cd money-tracker-api
```

### Step 2: Install dependencies
```bash
composer install
```

### Step 3: Environment setup
```bash
cp .env.example .env
php artisan key:generate
```

### Step 4: Configure database
Edit `.env` file:
```env
# For MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=money_tracker
DB_USERNAME=root
DB_PASSWORD=yourpassword

# OR for SQLite
# DB_CONNECTION=sqlite
# (then create database/database.sqlite file)
```

### Step 5: Run migrations
```bash
php artisan migrate
```

### Step 6: Start the server
```bash
php artisan serve
```
Server will start at `http://127.0.0.1:8000`


