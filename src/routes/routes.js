const express = require('express');
const EventController = require('../controllers/eventController');
const AuthController = require("../controllers/authController");
const AuthValidator = require('../validators/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const validateResultMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/auth/login', AuthValidator.login(), validateResultMiddleware, AuthController.login);
router.post('/auth/register', AuthValidator.register(), validateResultMiddleware, AuthController.register);

router.post("/initialize", EventController.initializeEvent);
router.post("/book", authMiddleware, EventController.bookEvent);
router.post("/cancel", authMiddleware, EventController.cancelBooking);
router.get("/status/:event_id", EventController.getStatus);

module.exports = router;