const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',       
  storage: process.env.DB_PATH, 
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;