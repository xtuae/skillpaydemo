const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Creating transactions table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        cust_ref_num VARCHAR(255) UNIQUE NOT NULL,
        agg_ref_no VARCHAR(255),
        auth_id VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        contact_no VARCHAR(20) NOT NULL,
        email_id VARCHAR(255) NOT NULL,
        payment_date TIMESTAMP NOT NULL,
        pay_status VARCHAR(10),
        resp_code VARCHAR(10),
        resp_message TEXT,
        service_rrn VARCHAR(255),
        mop VARCHAR(10),
        qr_string TEXT,
        pay_resp_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Creating index on cust_ref_num...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_cust_ref_num ON transactions(cust_ref_num)
    `;

    console.log('Creating index on created_at...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_created_at ON transactions(created_at DESC)
    `;

    console.log('Database setup completed successfully!');
    
    // Check if table was created
    const result = await sql`
      SELECT COUNT(*) as count FROM transactions
    `;
    console.log(`Current number of transactions: ${result[0].count}`);
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }

  process.exit(0);
}

setupDatabase();
