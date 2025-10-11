// src/routes/admin.js
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const { run, get, all } = require('../db');
const bcrypt = require('bcryptjs');

// protect all admin routes
router.use(authMiddleware, requireRole('admin'));

// Dashboard summary
router.get('/dashboard', async (req, res) => {
    try {
        const users = await get('SELECT COUNT(*) as count FROM users');
        const stores = await get('SELECT COUNT(*) as count FROM stores');
        const ratings = await get('SELECT COUNT(*) as count FROM ratings');
        res.json({ users: users.count, stores: stores.count, ratings: ratings.count });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Create user (admin can add normal/admin/owner)
router.post('/users', async (req, res) => {
    try {
        const { name, email, address, password, role } = req.body;
        if (!['admin', 'user', 'owner'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
        const exists = await get('SELECT * FROM users WHERE email = ?', [email]);
        if (exists) return res.status(409).json({ message: 'Email exists' });
        const hashed = await bcrypt.hash(password, 10);
        const r = await run('INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)', [name, email, hashed, address || '', role]);
        res.json({ id: r.id, message: 'User created' });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// list users with filters & sorting
router.get('/users', async (req, res) => {
    try {
        let { q, role, sortBy = 'name', order = 'asc', page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;
        const where = [];
        const params = [];
        if (q) {
            where.push('(name LIKE ? OR email LIKE ? OR address LIKE ?)');
            params.push(`%${q}%`, `%${q}%`, `%${q}%`);
        }
        if (role) {
            where.push('role = ?');
            params.push(role);
        }
        const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
        // sanitize sortBy/order minimal
        const allowedSort = ['name', 'email', 'address', 'role', 'created_at'];
        if (!allowedSort.includes(sortBy)) sortBy = 'name';
        order = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
        const rows = await all(`SELECT id,name,email,address,role,created_at FROM users ${whereSql} ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Create store
router.post('/stores', async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;
        const r = await run('INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)', [name, email || '', address || '', owner_id || null]);
        res.json({ id: r.id, message: 'Store created' });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// list stores (include average rating)
router.get('/stores', async (req, res) => {
    try {
        let { q, sortBy = 'name', order = 'asc', page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;
        const where = [];
        const params = [];
        if (q) { where.push('(s.name LIKE ? OR s.address LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
        const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
        const sql = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
             IFNULL(ROUND(AVG(r.rating),2),0) as average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      ${whereSql}
      GROUP BY s.id
      ORDER BY ${sortBy === 'rating' ? 'average_rating' : 's.' + sortBy} ${order}
      LIMIT ? OFFSET ?
    `;
        const rows = await all(sql, [...params, limit, offset]);
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
