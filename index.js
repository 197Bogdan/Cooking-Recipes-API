const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sequelize = require('./database'); 
const User = require('./models/user'); 
const Post = require('./models/post');
const Review = require('./models/review');

const app = express();
const secretKey = 'hahabcd';

app.use(express.json());

app.get('/' , authenticateToken, (req, res) => {
    res.send('Hello World!');
    });



app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
      const user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ username, password: hashedPassword });
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.post('/login', async (req, res) => {
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
  

function authenticateToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];
if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
}
jwt.verify(token, secretKey, (error, user) => {
    if (error) {
    return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
});
}


sequelize.sync()
  .then(() => {
    console.log('Sequelize models synchronized with the database.');
    app.listen(3000, () => {
      console.log('Server is running on port 3000.');
    });
  })
  .catch(error => {
    console.error('Unable to sync Sequelize with the database:', error);
  });