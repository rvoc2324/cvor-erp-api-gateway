# Auth Service

## Overview
The Auth Service handles user registration and authentication within the microservices architecture. It uses REST API endpoints to integrate with other services.

## Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }

### Login User
URL: /api/auth/login
Method: POST
Description: Authenticates a user and returns a JWT token.


##Configuration
Database Configuration
File: config/db.js
Description: Sets up the connection to the MongoDB database.

##Controllers
Auth Controller
File: controllers/authController.js
Description: Handles registration and login requests.

##Middleware
Auth Middleware
File: middleware/authMiddleware.js
Description: Verifies JWT tokens for protected routes.

##Models
User
File: models/User.js
Description: Defines the User schema for the MongoDB database.

##Services
Auth Service
File: services/authService.js
Description: Contains business logic for user authentication.

##Utilities
Generate Token
File: utils/generateToken.js
Description: Generates JWT tokens.

##Server Setup
File: server.js
Description: Sets up the Express server and includes middleware, routes, and other configurations.
