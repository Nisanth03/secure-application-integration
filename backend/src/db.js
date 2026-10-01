const Database = require("better-sqlite3");

const db = new Database("internships.db");

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        mode TEXT NOT NULL,
        location TEXT NOT NULL,
        skills TEXT NOT NULL,
        openings INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        internship_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        portfolio_url TEXT,
        created_at TEXT NOT NULL,
        UNIQUE(internship_id, email),
        FOREIGN KEY (internship_id) REFERENCES internships(id)
    );
`);

module.exports = db;