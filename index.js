const express = require('express');
const sequelize = require('./database'); 
const User = require('./models/user'); 
const Post = require('./models/post');
const Review = require('./models/review');

const app = express();



app.get('/' , (req, res) => {
    res.send('Hello World!');
    });

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