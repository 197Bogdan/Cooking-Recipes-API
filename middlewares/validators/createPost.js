const { body } = require('express-validator');

const postValidator = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1 })
    .withMessage('Title cannot be empty'),
  
  body('content')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  
  body('thumbnail')
    .optional()
    .isString()
    .withMessage('Thumbnail must be a valid path'),
];

module.exports = postValidator;