// middleware/auth.js
const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret'; // Use an environment variable in production

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
