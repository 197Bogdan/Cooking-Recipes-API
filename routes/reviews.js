const express = require('express');
const router = express.Router({ mergeParams: true });
const createReviewValidator = require('../middlewares/validators/createReview');
const updateReviewValidator = require('../middlewares/validators/updateReview');
const { Review, Post } = require('../models');
const { authenticateToken } = require('../middlewares/authenticateToken');
const handleValidationErrors = require('../middlewares/handleValidationErrors.js');


/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Operations related to reviews
 */

/**
 * @swagger
 * /posts/{postId}/reviews:
 *   get:
 *     summary: Get all reviews for a post
 *     tags: [Reviews]
 *     description: Get all reviews for a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
      const reviews = await Review.findAll();
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

/** 
 * @swagger 
 * 
 * /posts/{postId}/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     description: Get a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findByPk(id);
        if (!review) {
        return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /posts/{postId}/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     description: Create a new review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createReviewValidator, handleValidationErrors, async (req, res) => {
    const { rating, comment} = req.body; 
    const { postId } = req.params;
    try {
        const review = await Review.create({
        rating,
        comment,
        UserId: req.user.userId, 
        PostId: postId 
        });

        let post = await Post.findByPk(postId);
        let averageRating = post.averageRating;
        let reviewCount = post.reviewCount;
        let newAverageRating = (averageRating * reviewCount + rating) / (reviewCount + 1);
        await post.update({ averageRating: newAverageRating, reviewCount: reviewCount + 1 });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * @swagger
 * /posts/{postId}/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     description: Update a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Review not found or unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/:reviewId', authenticateToken, updateReviewValidator, handleValidationErrors, async (req, res) => {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;
    const userId = req.user.userId;

    try {
        const review = await Review.findOne({ where: { id: reviewId, UserId: userId } });
        if (!review) {
        return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        await review.update({ rating, comment });
        res.json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * @swagger
 * /posts/{postId}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     description: Delete a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the review
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Review not found or unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:reviewId', authenticateToken, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.userId; 

    try {
        const review = await Review.findOne({ where: { id: reviewId, UserId: userId } });
        if (!review) {
        return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        await review.destroy();
        res.sendStatus(204); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;