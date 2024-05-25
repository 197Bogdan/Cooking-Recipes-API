const express = require('express');
const router = express.Router({ mergeParams: true });
// const { validateUser, validateUserId } = require('../middlewares/validators');
// const { handleValidationErrors } = require('../middlewares/handleValidationErrors');
const { Review } = require('../models');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.get('/', async (req, res) => {
    try {
      const reviews = await Review.findAll();
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

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


router.post('/', authenticateToken, async (req, res) => {
    const { rating, comment} = req.body; 
    const { postId } = req.params;
    try {
        const review = await Review.create({
        rating,
        comment,
        userId: req.user.userId, 
        postId 
        });
        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.put('/:reviewId', authenticateToken, async (req, res) => {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;
    const userId = req.user.userId;

    try {
        const review = await Review.findOne({ where: { id: reviewId, userId } });
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

router.delete('/:reviewId', authenticateToken, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.userId; 

    try {
        const review = await Review.findOne({ where: { id: reviewId, userId } });
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