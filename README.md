# Manas Backend API

This is the backend API for the Manas application, built with Express.js and TypeScript, designed for serverless deployment on Vercel.

## Features

- User authentication with JWT
- Email verification with OTP
- Profile management
- MongoDB integration
- TypeScript support
- Serverless deployment ready

## Prerequisites

- Node.js 16.x or later
- MongoDB database
- SMTP server for email functionality
- Vercel account for deployment

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# API Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set up environment variables in Vercel:
   - Go to your project settings in Vercel
   - Add all environment variables from `.env.example`
   - Redeploy if needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/resend-otp` - Resend verification OTP

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:
```json
{
  "message": "Error message here"
}
```

## Security

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable protection
- Rate limiting (via Vercel)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 