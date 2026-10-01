const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function checkContent() {
    try {
        console.log('--- DB Content Check ---');

        const tables = ['city_master', 'country_master'];
        for (const table of tables) {
            console.log(`\nTable: ${table}`);
            const res = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`Total rows: ${res.rows[0].count}`);

            if (parseInt(res.rows[0].count) > 0) {
                const sample = await pool.query(`SELECT * FROM ${table} LIMIT 3`);
                console.log('Sample data:', sample.rows);
            }
        }

        await pool.end();
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkContent();
