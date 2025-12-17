# Customer Support Hub - Asset Management System

A full-stack Next.js 16 application for managing company assets, employees, and assignments.

## Features

- 🔐 JWT-based authentication (Login/Signup)
- 👥 Role-based access control (ADMIN, MANAGER, EMPLOYEE)
- 💾 MySQL database integration
- 🎨 Modern, responsive UI with Tailwind CSS
- ✨ Animated gradient backgrounds

## Tech Stack

- **Frontend/Backend**: Next.js 16 with TypeScript
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS
- **Password Hashing**: bcryptjs

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Make sure MySQL is running on your system
2. Create a database (or use the provided schema):

```bash
mysql -u root -p < lib/db-schema.sql
```

Or manually create the database and run the SQL file in your MySQL client.

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=customer_support_hub

# JWT Secret (Generate a strong random string for production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**: Change the `JWT_SECRET` to a strong random string in production!

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts      # Login API endpoint
│   │       └── signup/
│   │           └── route.ts      # Signup API endpoint
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Signup page
│   ├── layout.tsx
│   ├── page.tsx                  # Home page
│   └── globals.css
├── lib/
│   ├── db.ts                     # Database connection
│   ├── db-schema.sql             # Database schema
│   ├── auth.ts                   # Password hashing utilities
│   └── jwt.ts                    # JWT utilities
└── .env                          # Environment variables (create this)
```

## API Endpoints

### POST `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE"
  }
}
```

### POST `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE"
  }
}
```

## Database Schema

The application uses the following main tables:

- **users**: Stores user accounts with roles
- **assets**: Stores company assets (laptops, licenses, etc.)
- **asset_assignments**: Tracks asset assignments to employees
- **audit_logs**: Logs all system actions for audit purposes

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication
- Input validation and sanitization
- SQL injection prevention using parameterized queries
- Environment variables for sensitive data

## Next Steps

- [ ] Create dashboard page
- [ ] Implement asset management CRUD operations
- [ ] Add role-based authorization middleware
- [ ] Implement audit logging
- [ ] Add password reset functionality
- [ ] Add email verification

## License

MIT

