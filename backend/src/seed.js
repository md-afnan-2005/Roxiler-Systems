// src/seed.js
const bcrypt = require('bcryptjs');
const { run, get, all } = require('./db');
async function seed() {
    try {
        // check if any users
        const u = await get('SELECT COUNT(*) as c FROM users');
        if (u && u.c > 0) {
            console.log('DB already seeded');
            return;
        }

        const pwAdmin = await bcrypt.hash('Admin@123', 10);
        const pwOwner = await bcrypt.hash('Owner@123', 10);
        const pwUser = await bcrypt.hash('User@123', 10);

        // Insert admin
        await run('INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)',
            ['Administrator of Platform', 'admin@example.com', pwAdmin, 'HQ Address', 'admin']);
        // owner
        const ownerRes = await run('INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)',
            ['Store Owner Example Place', 'owner@example.com', pwOwner, 'Owner address', 'owner']);
        const ownerId = ownerRes.id;

        // normal user
        await run('INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)',
            ['Normal User Example Randomly', 'user@example.com', pwUser, 'User address', 'user']);

        // create a store for owner
        await run('INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)',
            ['Demo Store 1', 'store1@example.com', 'Store address 1', ownerId]);

        console.log('Seed complete. Admin: admin@example.com / Admin@123 ; Owner: owner@example.com / Owner@123 ; User: user@example.com / User@123');
    } catch (err) {
        console.error('Seed error', err);
    }
}

if (require.main === module) seed();
module.exports = seed;
