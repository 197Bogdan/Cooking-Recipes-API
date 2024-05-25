const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const Post = require('./post');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

module.exports = Review;