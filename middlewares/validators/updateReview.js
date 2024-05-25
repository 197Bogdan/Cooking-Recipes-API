const { body, param } = require('express-validator');

const reviewValidator = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  
  body('comment')
    .optional()
    .isString()
    .withMessage('Comment must be a string')
    .isLength({ min: 1 })
    .withMessage('Comment cannot be empty'),

  param('postId')
    .isInt()
    .withMessage('Post ID must be an integer'),

];

module.exports = reviewValidator;