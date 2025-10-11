const express = require('express');
const router = express.Router();
const db = require('../db'); // your SQLite DB helper
const bcrypt = require('bcryptjs');
const { authMiddleware, requireRole } = require('../middleware/auth');

// -------------------- Protect routes --------------------
// Only admins can manage users
router.use(authMiddleware, requireRole('admin'));

// -------------------- Get all users --------------------
router.get('/', (req, res) => {
    db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ users: rows });
    });
});

// -------------------- Add new user --------------------
router.post('/', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
        return res.status(400).json({ message: 'All fields are required.' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ message: 'User added successfully.', userId: this.lastID });
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -------------------- Update user --------------------
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;

    try {
        let hashedPassword = null;
        if (password) hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'UPDATE users SET name = ?, email = ?, password = COALESCE(?, password), role = ? WHERE id = ?',
            [name, email, hashedPassword, role, userId],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                if (this.changes === 0) return res.status(404).json({ message: 'User not found.' });
                res.json({ message: 'User updated successfully.' });
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -------------------- Delete user --------------------
router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'User not found.' });
        res.json({ message: 'User deleted successfully.' });
    });
});

module.exports = router;
