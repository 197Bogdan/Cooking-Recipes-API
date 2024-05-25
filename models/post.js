const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

module.exports = Post;