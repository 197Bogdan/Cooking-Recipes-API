const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const getPostsValidator = require('../middlewares/validators/getPosts');
const createPostValidator = require('../middlewares/validators/createPost');
const updatePostValidator = require('../middlewares/validators/updatePost');
const handleValidationErrors = require('../middlewares/handleValidationErrors');
const { Post } = require('../models');
const { authenticateToken } = require('../middlewares/authenticateToken');


router.get('/', getPostsValidator, handleValidationErrors, async (req, res) => {
    const { minViews, minRating, sort, page = 1, postsPerPage = 5 } = req.query;

    const startingPoint = (page - 1) * postsPerPage;
    const pageCount = postsPerPage;

    const queryOptions = {};
    if (minViews) {
      queryOptions.views = { [Op.gte]: minViews };
    }
    if (minRating) {
      queryOptions.averageRating = { [Op.gte]: minRating };
    }
    let sortOption = [['createdAt', 'DESC']]; // Default sorting
    if (sort === 'rating') {
      sortOption = [['averageRating', 'DESC']];
    } else if (sort === 'views') {
      sortOption = [['views', 'DESC']];
    }

    try {
        const posts = await Post.findAll({where: queryOptions, order: sortOption, offset: startingPoint, limit: pageCount});
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByPk(id);
        if (!post) {
        return res.status(404).json({ error: 'post not found' });
        }
        await post.increment('views');
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticateToken, createPostValidator, handleValidationErrors, async (req, res) => {
    const { title, content, thumbnail} = req.body; 
    try {
        const post = await Post.create({
        title,
        content,
        thumbnail,
        userId: req.user.userId 
        });
        res.status(201).json(post); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:postId', authenticateToken, updatePostValidator, handleValidationErrors, async (req, res) => {
    const { title, content, thumbnail } = req.body;
    const { postId } = req.params;
    console.log(req.user);
    const userId = req.user.userId;
  
    try {
      const post = await Post.findOne({ where: { id: postId, userId } });
      if (!post) {
        return res.status(404).json({ error: 'Post not found or unauthorized' });
      }
  
      await post.update({ title, content, thumbnail });
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.delete('/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;

    try {
        const post = await Post.findOne({ where: { id: postId, userId } });
        if (!post) {
        return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        await post.destroy();
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;