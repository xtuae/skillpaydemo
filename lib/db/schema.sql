-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  cust_ref_num VARCHAR(32) UNIQUE NOT NULL,
  agg_ref_no VARCHAR(19),
  auth_id VARCHAR(16) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  contact_no VARCHAR(10) NOT NULL,
  email_id VARCHAR(60) NOT NULL,
  payment_date TIMESTAMP NOT NULL,
  pay_status VARCHAR(4),
  resp_code VARCHAR(5),
  resp_message VARCHAR(100),
  service_rrn VARCHAR(50),
  mop VARCHAR(10),
  qr_string TEXT,
  pay_resp_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_cust_ref_num ON transactions(cust_ref_num);
CREATE INDEX idx_email_id ON transactions(email_id);
CREATE INDEX idx_created_at ON transactions(created_at DESC);
