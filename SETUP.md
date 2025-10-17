# Career Compass - Complete Setup Guide

This guide will help you set up both the frontend and backend for the Career Compass psychometric assessment platform.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v5 or higher)
- **Git**

## Quick Start

### 1. Clone and Setup Frontend

```bash
# Navigate to the project directory
cd vijnax

# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### 2. Setup Backend

#### Option A: Using the provided scripts

**Windows:**
```bash
# Run the Windows batch script
start-backend.bat
```

**Unix/Linux/macOS:**
```bash
# Make the script executable
chmod +x start-backend.sh

# Run the shell script
./start-backend.sh
```

#### Option B: Manual setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit the .env file with your configuration
# (See Environment Configuration section below)

# Start the backend server
npm run dev
```

The backend API will be available at: `http://localhost:5000`

## Environment Configuration

### Backend Environment Variables

Edit the `backend/.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/career_compass

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Twilio SMS Configuration (Optional for development)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Razorpay Configuration (Optional for development)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Email Configuration (Optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend Configuration

The frontend is configured to connect to the backend automatically. If you need to change the API URL, edit `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';
```

## Database Setup

### MongoDB Installation

1. **Download MongoDB** from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Install MongoDB** following the official documentation
3. **Start MongoDB service**

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Unix/Linux/macOS:**
```bash
# Start MongoDB service
sudo systemctl start mongod
```

### Database Initialization

The database will be created automatically when you first run the backend. However, you may want to seed it with initial data:

```bash
# Navigate to backend directory
cd backend

# Create a seed script (optional)
node scripts/seed.js
```

## Testing the Setup

### 1. Health Check

Visit the backend health endpoint:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Career Compass API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. Frontend Test

1. Open `http://localhost:3000` in your browser
2. Click "Start Free Assessment"
3. Enter a mobile number (e.g., 9876543210)
4. In development mode, check the console for the OTP
5. Enter the OTP to proceed

### 3. Admin Panel Test

1. Visit `http://localhost:3000/admin/login`
2. Use the default admin credentials:
   - Email: `admin@careercompass.com`
   - Password: `admin123`

## Development Workflow

### Running Both Frontend and Backend

**Terminal 1 (Frontend):**
```bash
cd vijnax
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
```

### Making Changes

1. **Frontend Changes**: Edit files in the `src/` directory
2. **Backend Changes**: Edit files in the `backend/` directory
3. **Database Changes**: Edit models in `backend/models/`

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running
- Check if the MongoDB service is started
- Verify the connection string in `.env`

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```

**Solution:**
- Change the PORT in `backend/.env`
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

  # Unix/Linux/macOS
  lsof -ti:5000 | xargs kill -9
  ```

#### 3. CORS Error
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
- Ensure the backend is running
- Check CORS configuration in `backend/server.js`
- Verify the API URL in `src/services/api.js`

#### 4. OTP Not Working
In development mode, OTPs are logged to the console instead of being sent via SMS.

**Solution:**
- Check the backend console for OTP logs
- Use the OTP from the console for testing

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## Production Deployment

### Backend Deployment

1. **Set production environment variables**
2. **Use PM2 for process management**
3. **Set up reverse proxy (nginx)**
4. **Configure SSL certificates**

### Frontend Deployment

1. **Build the application**
   ```bash
   npm run build
   ```
2. **Deploy the `dist/` folder to your web server**
3. **Configure environment variables for production**

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/admin-login` - Admin login

### Test Endpoints

- `POST /api/tests/create` - Create new test
- `GET /api/tests/:testId` - Get test details
- `POST /api/tests/:testId/start` - Start test
- `POST /api/tests/:testId/answer` - Submit answer
- `POST /api/tests/:testId/complete` - Complete test

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all prerequisites are installed
4. Verify environment configuration

For additional support:
- Email: support@careercompass.com
- Documentation: [Backend README](backend/README.md)

## License

This project is licensed under the MIT License.













