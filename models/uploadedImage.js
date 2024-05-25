const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Image = sequelize.define('Image', {
  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

module.exports = Image;