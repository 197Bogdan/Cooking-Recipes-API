require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const rateLimiter = require('./middlewares/rateLimiter');
const logger = require('./middlewares/logger');

const sequelize = require('./database'); 
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews');
const accountRoutes = require('./routes/account');
const imageRoutes = require('./routes/images');

const app = express();



app.use(express.json());
app.use(logger);
app.use(rateLimiter);

const options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'Cooking Recipes API',
      version: '1.0.0',
      description: 'API documentation for the cooking recipes site.',
    },
  },
  apis: ['./routes/*.js'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:postId/reviews', reviewRoutes);
app.use('/account', accountRoutes);
app.use('/images', imageRoutes);




sequelize.sync()
  .then(() => {
    console.log('Sequelize models synchronized with the database.');
    app.listen(process.env.PORT, () => {
      console.log('Server is running on port 3000.');
    });
  })
  .catch(error => {
    console.error('Unable to sync Sequelize with the database:', error);
  });


module.exports = app;