const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function check() {
    try {
        const table = 'accounts';
        console.log(`Checking schema for ${table}:`);
        const schemaRes = await pool.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
            [table]
        );
        console.log(`Columns:`);
        schemaRes.rows.forEach(r => {
            console.log(`- ${r.column_name} (${r.data_type})`);
        });
    } catch (err) {
        console.error('Error checking:', err);
    } finally {
        await pool.end();
    }
}

check();
