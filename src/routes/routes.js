const express = require('express');
const EventController = require('../controllers/eventController');
const AuthController = require("../controllers/authController");
const AuthValidator = require('../validators/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const validateResultMiddleware = require('../middlewares/validationMiddleware');
const EventValidator = require('../validators/eventValidator');
const { default: rateLimit } = require('express-rate-limit');

const router = express.Router();


const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: "Too many attempts, please try again later.",
});


router.use(authLimiter);

router.post('/auth/login', AuthValidator.login(), validateResultMiddleware, AuthController.login);
router.post('/auth/register', AuthValidator.register(), validateResultMiddleware, AuthController.register);

router.post("/initialize", EventValidator.initialize(), EventController.initializeEvent);
router.post("/book", authMiddleware, EventController.bookEvent);
router.post("/cancel", authMiddleware, EventController.cancelBooking);
router.get("/status/:event_id", EventController.getStatus);

module.exports = router;