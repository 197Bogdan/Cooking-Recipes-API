const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { validateUser, validateUserId } = require('../middlewares/validators');
// const { handleValidationErrors } = require('../middlewares/handleValidationErrors');
const { User, Post, Review } = require('../models');
const { authenticateToken, secretKey } = require('../middlewares/authenticateToken');



router.post('/register', async (req, res) => {
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


router.post('/login', async (req, res) => {
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
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.put('/update', authenticateToken, async (req, res) => {
    const { password, realName, description } = req.body;
    const userId = req.user.userId;

    try {
        let user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let newUser;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            newUser = { password: hashedPassword };
        }
        if (realName) {
            newUser = { ...newUser, realName };
        }
        if (description) {
            newUser = { ...newUser, description };
        }

        await user.update(newUser);
        user = await User.findOne({ where: { id: userId }, attributes: { exclude: ['password'] } });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/delete', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await Review.destroy({ where: { userId } });
        await Post.destroy({ where: { userId } });
        await user.destroy();


        res.sendStatus(204); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;