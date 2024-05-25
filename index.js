const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const rateLimiter = require('./middlewares/rateLimiter');

const sequelize = require('./database'); 
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews');
const accountRoutes = require('./routes/account');
const imageRoutes = require('./routes/images');

const app = express();


app.use(express.json());
app.use(rateLimiter);

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:postId/reviews', reviewRoutes);
app.use('/account', accountRoutes);
app.use('/images', imageRoutes);


sequelize.sync()
  .then(() => {
    console.log('Sequelize models synchronized with the database.');
    app.listen(3000, () => {
      console.log('Server is running on port 3000.');
    });
  })
  .catch(error => {
    console.error('Unable to sync Sequelize with the database:', error);
  });


module.exports = app;