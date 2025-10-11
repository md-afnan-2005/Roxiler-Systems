// src/routes/stores.js
const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db');
const { authMiddleware } = require('../middleware/auth');

// list all stores (public) with optional q, sort; if auth header provided, we will accept it to fetch user's submitted rating
router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        // simple allow q param
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
        const stores = await all(sql, [...params, limit, offset]);

        // if token provided and valid, get user's ratings for these stores
        let userId = null;
        if (token) {
            // verify token quickly
            try {
                const jwt = require('jsonwebtoken');
                const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
                userId = payload.id;
            } catch (e) { userId = null; }
        }
        if (userId) {
            const storeIds = stores.map(s => s.id);
            if (storeIds.length) {
                const placeholders = storeIds.map(() => '?').join(',');
                const userRatings = await all(`SELECT store_id,rating FROM ratings WHERE user_id = ? AND store_id IN (${placeholders})`, [userId, ...storeIds]);
                const m = {};
                userRatings.forEach(r => m[r.store_id] = r.rating);
                stores.forEach(s => s.user_rating = m[s.id] || null);
            } else stores.forEach(s => s.user_rating = null);
        } else stores.forEach(s => s.user_rating = null);

        res.json(stores);
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// get single store details
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const store = await get('SELECT * FROM stores WHERE id = ?', [id]);
        if (!store) return res.status(404).json({ message: 'Not found' });
        const avg = await get('SELECT IFNULL(ROUND(AVG(rating),2),0) as avg FROM ratings WHERE store_id = ?', [id]);
        res.json({ ...store, average_rating: avg.avg });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// submit or update rating: require auth (any user role 'user' allowed - but we will allow role 'user')
router.post('/:id/rate', authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.user.id;
        const storeId = req.params.id;
        const rInt = parseInt(rating, 10);
        if (!rInt || rInt < 1 || rInt > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

        // check existing
        const existing = await get('SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
        if (existing) {
            await run('UPDATE ratings SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?', [rInt, comment || '', existing.id]);
            return res.json({ message: 'Rating updated' });
        } else {
            await run('INSERT INTO ratings (user_id,store_id,rating,comment) VALUES (?,?,?,?)', [userId, storeId, rInt, comment || '']);
            return res.json({ message: 'Rating submitted' });
        }
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
