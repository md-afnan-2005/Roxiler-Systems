// src/middleware/validators.js
const { body, validationResult } = require('express-validator');

const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const registerValidation = [
    body('name').isString().isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 chars'),
    body('email').isEmail(),
    body('address').optional().isLength({ max: 400 }),
    body('password').matches(passwordPattern).withMessage('Password 8-16 chars, at least one uppercase and one special character')
];

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
}

module.exports = { registerValidation, handleValidationErrors, passwordPattern };
