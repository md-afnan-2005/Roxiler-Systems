// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/stores', require('./src/routes/stores'));
app.use('/api/owner', require('./src/routes/owner'));

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(port, () => console.log(`Server running on ${port}`));
