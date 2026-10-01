const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function checkSchema() {
    try {
        console.log('--- Industry Master Schema Check ---');
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'industry_master' 
            AND table_schema = 'public'
        `);
        console.log('Columns:', res.rows.map(r => `${r.column_name} (${r.data_type})`));
        await pool.end();
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkSchema();
