# Shopee Affiliate Dashboard API

Backend API server for the Shopee Affiliate Dashboard React Native mobile application. This API provides comprehensive functionality for managing Shopee affiliate accounts, tracking commissions, managing links, and handling user subscriptions.

## 📱 Overview

This is the backend REST API that powers the Shopee Affiliate Dashboard mobile application. It enables users to:
- Manage Shopee affiliate API credentials
- Track affiliate links and conversions
- Monitor commission data and reports
- Manage user subscriptions and accounts
- Handle email verification and password resets

## 🚀 Features

- **User Management**: User registration, authentication, and profile management
- **Shopee API Integration**: Direct integration with Shopee's affiliate API
- **Link Management**: Create and manage short links for affiliate tracking
- **Subscription Management**: Track user subscription plans and history
- **Commission Tracking**: Real-time conversion and commission reporting
- **Email Notifications**: Automated email verification and password reset
- **Admin Panel**: Administrative controls for managing users and data
- **JWT Authentication**: Secure token-based authentication

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Email Service**: Nodemailer
- **Protocol**: HTTPS (SSL/TLS)
- **Port**: 443 (configurable)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- MySQL database server
- SSL certificates (for HTTPS)
- Shopee affiliate account and API credentials
- Gmail account (for email notifications)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alvinnebria23/SaperApi.git
   cd SaperApi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your credentials:
   ```env
   # Database Configuration
   DB_HOST=your_db_host
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name

   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password

   # JWT/API Configuration
   API_KEY=your_api_key
   API_SECRET=your_api_secret

   # Server Configuration
   PORT=443

   # SSL Certificate Paths
   SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
   SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem

   # Base URL
   BASE_URL=https://yourdomain.com
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE your_db_name;
   ```

5. **Start the server**
   ```bash
   node server.js
   ```
   The server will run on `https://localhost:443` (or your configured PORT)

## 📁 Project Structure

```
├── client/              # Shopee API client
│   └── ShopeeRequestClient.js
├── config/              # Configuration files
│   ├── dbConfig.js
│   └── mailAccountConfig.js
├── constants/           # Application constants
│   ├── DbConstants.js
│   ├── HttpCodes.js
│   ├── ShopeeConstants.js
│   └── mailConstants.js
├── controllers/         # Route controllers
│   ├── LinkController.js
│   ├── ShopeeController.js
│   ├── SubscriptionHistoryController.js
│   └── UserController.js
├── helpers/             # Utility helpers
│   ├── CheckAdminToken.js
│   ├── CheckToken.js
│   ├── ConversionReport.js
│   ├── Jwt.js
│   ├── NodeMailer.js
│   └── ShopeeErrorRequest.js
├── loggers/             # Logging configuration
│   └── logger.js
├── models/              # Database models
│   ├── LinkModel.js
│   ├── ShopeeApiModel.js
│   ├── SubscriptionHistory.js
│   └── UserModel.js
├── routes/              # API routes
│   ├── AdminRouter.js
│   ├── LinkRouter.js
│   ├── ShopeeRouter.js
│   └── UserRouter.js
├── service/             # Business logic services
│   ├── LinkService.js
│   ├── ShopeeApiService.js
│   ├── SubscriptionHistoryService.js
│   └── UserService.js
├── util/                # Utility functions
│   └── QueryStringUtil.js
├── server.js            # Main application entry point
├── package.json         # Project dependencies
└── README.md            # This file
```

## 🔐 Security

- **Credentials**: All sensitive credentials are managed through environment variables (`.env`). Never commit actual credentials to the repository.
- **JWT Authentication**: Endpoints are protected with JWT token validation.
- **HTTPS Only**: The API runs over HTTPS for encrypted communication.
- **Admin Token Validation**: Administrative endpoints require special authentication tokens.
- **Password Hashing**: User passwords are securely hashed using bcryptjs.

### Important: Environment Variables

Ensure your `.env` file is added to `.gitignore` and never committed to version control. Use `.env.example` as a template.

## 📚 API Endpoints

### User Routes (`/api/v1/user`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Verify email with code
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `GET /profile` - Get user profile (requires token)

### Shopee Routes (`/api/v1/shopee`)
- `POST /register-api` - Register Shopee API credentials
- `GET /data/:appId` - Get Shopee API data
- `PUT /update` - Update Shopee API credentials
- `GET /conversion-report` - Get conversion reports

### Link Routes (`/api/v1/link`)
- `POST /create` - Create affiliate link
- `GET /list` - List user's links
- `DELETE /remove/:linkId` - Remove link

### Subscription Routes
- `GET /subscription-history` - Get subscription history

### Admin Routes (`/api/v1/admin`)
- Admin-only endpoints for managing users and data
- Requires admin token validation

## 🔄 Authentication Flow

1. User registers or logs in with email and password
2. Server validates credentials and returns JWT token
3. Client stores token and includes in Authorization header for subsequent requests
4. Server validates token on each request via `CheckToken` middleware
5. Admin endpoints additionally validate admin token via `CheckAdminToken` middleware

## 📧 Email Configuration

The application uses Nodemailer for sending emails:
- **Email Verification**: Sent during user registration
- **Password Reset**: Sent when user requests password recovery
- **Configuration**: Uses Gmail SMTP (configurable in `.env`)

## 🗄️ Database Schema

The application uses Sequelize ORM with the following main models:
- **User**: User account and authentication
- **ShopeeApiModel**: Shopee API credentials and tokens
- **Link**: Affiliate links with conversion tracking
- **SubscriptionHistory**: User subscription records

## ⚠️ Error Handling

The API returns standardized HTTP status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow the format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚢 Deployment

### Production Checklist
- [ ] Update `.env` with production credentials
- [ ] Set up MySQL database on production server
- [ ] Install SSL certificates
- [ ] Configure firewall rules for port 443
- [ ] Set `NODE_ENV=production`
- [ ] Enable logging and monitoring
- [ ] Set up database backups
- [ ] Configure email service

### Deployment Steps
1. Clone repository on production server
2. Install dependencies: `npm install --production`
3. Configure `.env` with production values
4. Set up SSL certificates in specified paths
5. Start application: `node server.js`
6. (Optional) Use PM2 for process management:
   ```bash
   pm2 start server.js --name "shopee-api"
   pm2 save
   pm2 startup
   ```

## 📝 Logging

Application logs are stored in the `logs/` directory with daily log files. Configure logging behavior in `loggers/logger.js`.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL server is running
- Check `.env` database credentials
- Ensure database exists and user has permissions

### Email Not Sending
- Verify Gmail app password is correct
- Enable "Less secure app access" if using Gmail
- Check email configuration in `.env`

### SSL Certificate Issues
- Verify certificate paths in `.env`
- Ensure certificates have not expired
- Check file permissions on certificate files

### API Request Issues
- Verify Shopee API credentials are valid
- Check request payload format
- Ensure JWT token is included in Authorization header

## 📞 Support

For issues and support, please create an issue in the repository or contact the development team.

## 📄 License

This project is private. Usage is restricted to authorized users only.

## 🔄 Related Projects

- **Frontend**: [Shopee Affiliate Dashboard React Native App](link-to-mobile-app-repo)

## 👨‍💻 Development

### Code Style
- Use ES6+ features and async/await
- Follow existing naming conventions
- Add meaningful comments for complex logic
- Use proper error handling

### Testing
```bash
npm test
```

### Running in Development
```bash
# Install dev dependencies
npm install

# Start server
node server.js

# Or use nodemon for auto-restart
npx nodemon server.js
```

---

**Last Updated**: 2026
