const jwt = require("jsonwebtoken");
const { User } = require("../../models");

const SECRET_KEY = process.env.JWT_SECRET



const handleJWTAuth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Access denied. No token provided."
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: true, message: "Invalid token" });
  }
}

const handleBasicAuth = async (req, res, next) => {

  try {

    const base64Token = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Token, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    const user = await User.findOne({ where: { email } });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    req.user = {
      user_id: user.id,
      email: user.email
    }
    next()
  } catch (error) {
    res.status(401).json({ error: true, message: "Error authenticating user" });
  }
}

const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Missing Authorization Header' });
  }

  if (req.headers.authorization.indexOf('Basic ') !== -1) {
    return handleBasicAuth(req, res, next)
  }

  if (req.headers.authorization.indexOf('Bearer ') !== -1) {
    return handleJWTAuth(req, res, next)
  }

};

module.exports = authMiddleware;

