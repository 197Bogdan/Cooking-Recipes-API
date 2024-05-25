const { query } = require('express-validator');

const postValidator = [
    query('minViews').optional().isInt().withMessage('Minimum views must be an integer'),
    query('minRating').optional().isFloat({ min: 1, max: 5 }).withMessage('Minimum rating must be a value between 1 and 5'),
    query('sort').optional().isIn(['rating', 'views']).withMessage('Invalid sort parameter. Valid values are "rating" and "views"'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be an integer greater than 0'),
    query('postsPerPage').optional().isInt({ min: 3, max: 10 }).withMessage('Posts per page must be an integer greater than 0')
];

module.exports = postValidator;