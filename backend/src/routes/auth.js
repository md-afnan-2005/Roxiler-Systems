// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get } = require('../db');
const { registerValidation, handleValidationErrors } = require('../middleware/validators');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', registerValidation, handleValidationErrors, async (req, res) => {
    try {
        const { name, email, address, password } = req.body;
        const exists = await get('SELECT * FROM users WHERE email = ?', [email]);
        if (exists) return res.status(409).json({ message: 'Email already registered' });
        const hashed = await bcrypt.hash(password, 10);
        const r = await run('INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)',
            [name, email, hashed, address || '', 'user']);
        res.json({ id: r.id, message: 'Registered' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        res.json({ token, role: user.role, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
