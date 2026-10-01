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
            console.log(`Checking data for ${table}:`);
            const countRes = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`Count: ${countRes.rows[0].count}`);

            const schemaRes = await pool.query(
                "SELECT column_name FROM information_schema.columns WHERE table_name = $1",
                [table]
            );
            console.log(`Columns: ${schemaRes.rows.map(r => r.column_name).join(', ')}`);
            console.log('---');
        }
    } catch (err) {
        console.error('Error checking:', err);
    } finally {
        await pool.end();
    }
}

check();
