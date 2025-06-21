# Manas Backend API

This is the backend API for the Manas application, built with Express.js and MongoDB, designed for managing user data, content, and admin operations.

## Features

- User authentication with JWT
- Email verification with OTP
- Admin authentication and management
- Content management (Impact Cards, Achievement Cards, Success Stories, Media Cards)
- User profile management
- Event management
- Volunteer management
- MongoDB integration
- SMTP email integration

## Prerequisites

- Node.js 16.x or later
- MongoDB database (MongoDB Atlas recommended)
- Gmail account with App Password for SMTP
- Git

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Environment Variables

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Configuration (Generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Server Configuration
PORT=5000

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application URLs
ADMIN_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@example.com
```

### Environment Variable Details

#### Database Configuration
- **MONGODB_URI**: Your MongoDB connection string
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - Get this from MongoDB Atlas dashboard

#### JWT Configuration
- **JWT_SECRET**: A secure random string for JWT token signing
  - Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
  - Minimum 32 characters recommended

#### SMTP Configuration
- **SMTP_USER**: Your Gmail address
- **SMTP_PASS**: Gmail App Password (not your regular password)
  - Enable 2FA on your Gmail account
  - Generate App Password: Gmail Settings → Security → App Passwords

#### Application URLs
- **ADMIN_URL**: URL where your admin frontend is hosted
- **FRONTEND_URL**: URL where your main frontend is hosted

#### Admin Configuration
- **ADMIN_EMAIL**: Primary admin email address for system access

## Local Development Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd manas-backend-new
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. **Start development server:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/resend-otp` - Resend verification OTP

### Admin Authentication
- `POST /api/admin/send-otp` - Send admin OTP
- `POST /api/admin/verify-otp` - Verify admin OTP

### User Management (Admin)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Content Management (Admin)
- **Impact Cards**: `/api/admin/impact-cards`
- **Achievement Cards**: `/api/admin/achievement-cards`
- **Success Stories**: `/api/admin/success-stories`
- **Media Cards**: `/api/admin/media-cards`
- **Events**: `/api/admin/events`

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- CORS protection
- Environment variable protection
- Admin role-based access control
- Email verification system

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format:
```json
{
  "message": "Error message here"
}
```

## Production Deployment

### Environment Variables for Production
- Use strong, unique JWT_SECRET
- Use production MongoDB cluster
- Configure proper CORS origins
- Use production SMTP settings
- Set proper admin email

### Security Checklist
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB connection is secure
- [ ] SMTP credentials are app passwords
- [ ] CORS origins are properly configured
- [ ] Admin email is verified and secure

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, email admin@example.com or create an issue in the repository. 