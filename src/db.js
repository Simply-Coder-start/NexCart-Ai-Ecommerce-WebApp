const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let dbInstance = null;

const connectDB = async () => {
    try {
        const dbPath = path.resolve(__dirname, '..', 'database.sqlite');
        const dbExists = fs.existsSync(dbPath);

        dbInstance = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log(`SQLite Connected: ${dbPath}`);
        global.useInMemory = false;

    } catch (error) {
        console.error(`Error connecting to SQLite: ${error.message}`);
        console.warn('Falling back to in-memory store.');
        global.useInMemory = true;
    }
};

const getDb = () => dbInstance;

module.exports = { connectDB, getDb };
