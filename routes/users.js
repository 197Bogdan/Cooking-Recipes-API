const express = require('express');
const router = express.Router();
const { User } = require('../models');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to user profiles
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Get all users
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;