// src/routes/owner.js
const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const { all, get } = require('../db');

router.use(authMiddleware, requireRole('owner'));

// list stores owned by the owner with ratings and list of users who rated each store
router.get('/stores', async (req, res) => {
    try {
        const ownerId = req.user.id;
        const stores = await all('SELECT id, name, address FROM stores WHERE owner_id = ?', [ownerId]);
        const out = [];
        for (const s of stores) {
            const avg = await get('SELECT IFNULL(ROUND(AVG(rating),2),0) as avg FROM ratings WHERE store_id = ?', [s.id]);
            const raters = await all(`SELECT u.id,u.name,u.email,r.rating,r.comment FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ?`, [s.id]);
            out.push({ store: s, average_rating: avg.avg, raters });
        }
        res.json(out);
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
