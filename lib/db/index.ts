import { neon } from '@neondatabase/serverless';
import * as demo from './demo';

// Check if we have a valid database URL
const isDemoMode = !process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://neondb_owner:your_password@your-host.neon.tech/neondb?sslmode=require';

export interface Transaction {
  id?: number;
  cust_ref_num: string;
  agg_ref_no?: string;
  auth_id: string;
  amount: number;
  contact_no: string;
  email_id: string;
  payment_date: Date;
  pay_status?: string;
  resp_code?: string;
  resp_message?: string;
  service_rrn?: string;
  mop?: string;
  qr_string?: string;
  pay_resp_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

let sql: any = null;

if (!isDemoMode) {
  sql = neon(process.env.DATABASE_URL!);
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  if (isDemoMode) {
    console.log('Demo mode: Creating transaction');
    return demo.createTransaction(transaction);
  }
  
  const result = await sql`
    INSERT INTO transactions (
      cust_ref_num, agg_ref_no, auth_id, amount, contact_no, email_id,
      payment_date, pay_status, resp_code, resp_message, service_rrn,
      mop, qr_string, pay_resp_date
    ) VALUES (
      ${transaction.cust_ref_num}, ${transaction.agg_ref_no}, ${transaction.auth_id},
      ${transaction.amount}, ${transaction.contact_no}, ${transaction.email_id},
      ${transaction.payment_date}, ${transaction.pay_status}, ${transaction.resp_code},
      ${transaction.resp_message}, ${transaction.service_rrn}, ${transaction.mop},
      ${transaction.qr_string}, ${transaction.pay_resp_date}
    )
    ON CONFLICT (cust_ref_num) 
    DO UPDATE SET
      agg_ref_no = EXCLUDED.agg_ref_no,
      pay_status = EXCLUDED.pay_status,
      resp_code = EXCLUDED.resp_code,
      resp_message = EXCLUDED.resp_message,
      service_rrn = EXCLUDED.service_rrn,
      qr_string = EXCLUDED.qr_string,
      pay_resp_date = EXCLUDED.pay_resp_date,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return result[0];
}

export async function getTransactionByRefNum(custRefNum: string) {
  if (isDemoMode) {
    return demo.getTransactionByRefNum(custRefNum);
  }
  
  const result = await sql`
    SELECT * FROM transactions WHERE cust_ref_num = ${custRefNum}
  `;
  return result[0];
}

export async function getAllTransactions() {
  if (isDemoMode) {
    return demo.getAllTransactions();
  }
  
  const result = await sql`
    SELECT * FROM transactions ORDER BY created_at DESC
  `;
  return result;
}

export async function updateTransactionStatus(
  custRefNum: string,
  updates: Partial<Transaction>
) {
  if (isDemoMode) {
    return demo.updateTransactionStatus(custRefNum, updates);
  }
  
  const result = await sql`
    UPDATE transactions
    SET
      pay_status = ${updates.pay_status},
      resp_code = ${updates.resp_code},
      resp_message = ${updates.resp_message},
      service_rrn = ${updates.service_rrn},
      pay_resp_date = ${updates.pay_resp_date},
      updated_at = CURRENT_TIMESTAMP
    WHERE cust_ref_num = ${custRefNum}
    RETURNING *
  `;
  return result[0];
}
