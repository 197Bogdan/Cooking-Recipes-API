const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createAccountValidator = require('../middlewares/validators/createAccount');
const updateAccountValidator = require('../middlewares/validators/updateAccount');
const loginAccountValidator = require('../middlewares/validators/loginAccount');
const handleValidationErrors = require('../middlewares/handleValidationErrors.js');
const { User, Post, Review } = require('../models');
const { authenticateToken } = require('../middlewares/authenticateToken');
const swaggerJSDoc = require('swagger-jsdoc');

/**
 * @swagger
 * tags:
 *   - name: Accounts
 *     description: Operations related to user accounts
 */


/** 
 * @swagger
 * /account/register:
 *   post:
 *     summary: Register an account
 *     tags: [Accounts]
 *     description: Register an account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               realName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', createAccountValidator, handleValidationErrors, async (req, res) => {
    const { username, password, realName, description } = req.body;
    console.log(username, password);
    try {
      let user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ username, password: hashedPassword, realName, description});
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


/** 
 * @swagger
 * /account/login:
 *   post:
 *     summary: Login to an account
 *     tags: [Accounts]
 *     description: Get a token to access the account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginAccountValidator, handleValidationErrors, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/** 
 * @swagger
 * /account:
 *   put:
 *     summary: Update existing account
 *     tags: [Accounts]
 *     description: Change password, real name, or description of an account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/update', authenticateToken, updateAccountValidator, handleValidationErrors, async (req, res) => {
    const { password, realName, description } = req.body;
    console.log(req.body)
    const userId = req.user.userId;

    try {
        let user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({ password, realName, description });
        user = await User.findOne({ where: { id: userId }, attributes: { exclude: ['password'] } });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/** 
 * @swagger
 * /account/delete:
 *   delete:
 *     summary: Delete account
 *     tags: [Accounts]
 *     description: Delete account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/delete', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Review.destroy({ where: { UserId: userId } });
        await Post.destroy({ where: { UserId: userId } });
        await user.destroy();


        res.sendStatus(204); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;