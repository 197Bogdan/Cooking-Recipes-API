const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const getPostsValidator = require('../middlewares/validators/getPosts');
const createPostValidator = require('../middlewares/validators/createPost');
const updatePostValidator = require('../middlewares/validators/updatePost');
const handleValidationErrors = require('../middlewares/handleValidationErrors.js');
const { Post, UploadedImage } = require('../models');
const { authenticateToken } = require('../middlewares/authenticateToken');

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Operations related to user posts
 */


/**
    * @swagger
    * /posts:
    *   get:
    *     summary: Get all posts
    *     tags: [Posts]
    *     description: Get all posts
    *     parameters:
    *       - in: query
    *         name: minViews
    *         schema:
    *           type: integer
    *         description: Minimum number of views
    *       - in: query
    *         name: minRating
    *         schema:
    *           type: integer
    *         description: Minimum rating
    *       - in: query
    *         name: sort
    *         schema:
    *           type: string
    *         description: Sort by rating or views
    *       - in: query
    *         name: page
    *         schema:
    *           type: integer
    *         description: Page number
    *       - in: query
    *         name: postsPerPage
    *         schema:
    *           type: integer
    *         description: Number of posts per page
    *     responses:
    *       200:
    *         description: OK
    *       500:
    *         description: Internal server error
    */
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

/** 
 * @swagger
 * /posts/{id}:
 *  get:
 *   summary: Get a post by ID
 *   tags: [Posts]
 *   description: Get a post by ID
 *   parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: ID of the post
 *   responses:
 *     200:
 *       description: OK
 *     404:
 *       description: Post not found
 *     500:
 *       description: Internal server error
 */
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

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     description: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createPostValidator, handleValidationErrors, async (req, res) => {
    const { title, content, imageId } = req.body; 

    console.log(imageId)
    if (imageId !== null && imageId !== undefined) {
        const uploadedImage = await UploadedImage.findOne({
            where: {
            UserId: req.user.userId,
            id: imageId
            }
        });
        console.log(imageId);
        if (!uploadedImage) {
            return res.status(404).json({ error: 'imageId not found' });
        }
    }

    try {
        const post = await Post.create({
        title,
        content,
        ImageId: imageId,
        UserId: req.user.userId 
        });
        res.status(201).json(post); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     description: Update a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               imageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Post not found or unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/:postId', authenticateToken, updatePostValidator, handleValidationErrors, async (req, res) => {
    const { title, content, imageId } = req.body;
    const { postId } = req.params;
    console.log(req.user);
    const userId = req.user.userId;
  
    try {
      const post = await Post.findOne({ where: { id: postId, UserId: userId } });
      if (!post) {
        return res.status(404).json({ error: 'Post not found or unauthorized' });
      }
  
      await post.update({ title, content, imageId });
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     description: Delete a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Post not found or unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;

    try {
        const post = await Post.findOne({ where: { id: postId, UserId } });
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