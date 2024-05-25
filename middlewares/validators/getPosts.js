const { query } = require('express-validator');

const postValidator = [
    query('minViews').optional().isInt().withMessage('Minimum views must be an integer'),
    query('minRating').optional().isFloat({ min: 1, max: 5 }).withMessage('Minimum rating must be a value between 1 and 5'),
    query('sort').optional().isIn(['rating', 'views']).withMessage('Invalid sort parameter. Valid values are "rating" and "views"'),
];

module.exports = postValidator;