const jwt = require('jsonwebtoken');
const secretKey = 'hahabcd';

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


module.exports = { authenticateToken, secretKey };