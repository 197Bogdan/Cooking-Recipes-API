const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user'); 

const UploadedImage = sequelize.define('UploadedImages', {
  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //       model: User,
  //       key: 'id'
  //     }
  // } 
});

module.exports = UploadedImage;