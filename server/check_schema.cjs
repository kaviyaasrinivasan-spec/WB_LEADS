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
        const tables = ['account_contacts', 'account_line_of_business', 'account_departments', 'account_use_cases', 'department_pain_points'];
        for (const table of tables) {
            console.log(`Checking columns for ${table}:`);
            const res = await pool.query(
                "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
                [table]
            );
            console.log(res.rows);
            console.log('---');
        }
    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        await pool.end();
    }
}

check();
