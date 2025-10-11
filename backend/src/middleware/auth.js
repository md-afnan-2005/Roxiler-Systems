// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { get } = require('../db');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'secret';

async function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Authorization header missing' });
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });
    try {
        const payload = jwt.verify(token, SECRET);
        // attach minimal user
        req.user = { id: payload.id, role: payload.role, email: payload.email };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function requireRole(...allowedRoles) {
    return function (req, res, next) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}

module.exports = { authMiddleware, requireRole };
