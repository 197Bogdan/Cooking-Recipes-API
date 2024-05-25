# Cooking Recipes REST API

This is a REST API for managing cooking recipes, allowing users to browse recipes, leave reviews, and post their own recipes.

## Features

- Register and login with JWT authentication
- Browse cooking recipes
- Post, update, and delete recipes
- Leave, update, and delete reviews for recipes
- Update account info if needed
- Upload and manage images for recipe thumbnails
- Automated calculation of recipe post views, total reviews and average rating
- Sort and filter by view count or average rating for recipes
- Paginated responses for recipes
- Rate limiting and logging middleware for enhanced security and monitoring
- Swagger documentation for all routes

## Technologies Used

- Node.js
- Express
- SQLite
- Sequelize ORM
- JWT for authentication
- Multer for handling file uploads
- Express-validator for request validation
- dotenv for managing environment variables
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js and npm installed
- SQLite3 installed

### Installation

1. Clone the repository:

2. Install the dependencies:
``` npm install ```

3. Create a '.env' file in the root of the directory

Sample .env:
```
DB_PATH=database.db         # file path to the sqlite3 database
JWT_SECRET=abchaha          # JWT secret used for encryption
JWT_EXPIRES_IN=1h           # JWT token lifetime
PORT=3000                   # the port the server will run on
UPLOAD_DIR=uploads          # directory path where uploaded images will be saved
REQUESTS_PER_MIN=20         # maximum requests allowed per IP per minute
LOG_FILE_PATH=logs.txt      # file path where the logs will be saved
MAX_BUFFER_SIZE=512         # logs are saved to the file when this buffer size is exceeded
```

4. Start the server:
``` node index.js ```

### After starting the server, you can find the swagger API documentation at /api-docs/

