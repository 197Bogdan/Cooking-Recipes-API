const { body } = require('express-validator');

const accountValidator = [

  body('username')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),

  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),

  body('realName')
    .optional()
    .isString()
    .withMessage('Real name must be a string')
    .isLength({ min: 1 })
    .withMessage('Real name cannot be empty'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];

module.exports = accountValidator;