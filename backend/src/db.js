// src/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');
const INIT_SQL = fs.readFileSync(path.join(__dirname, '..', 'db', 'init.sql'), 'utf8');

function init() {
    if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'data'));
    }
    const db = new sqlite3.Database(DB_PATH);
    db.exec(INIT_SQL, (err) => {
        if (err) console.error("DB init error:", err);
        else console.log("DB initialized");
    });
    return db;
}

const db = init();

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

module.exports = { db, run, get, all };
