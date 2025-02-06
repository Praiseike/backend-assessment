const { body } = require("express-validator");

class EventValidator {
  static initialize = () => [
    body('name').isString(),
    body('available_tickets').isLength({ min: 1 }).isNumeric().withMessage("please enter a valida number")
  ]
}

module.exports = EventValidator;