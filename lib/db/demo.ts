// Demo database implementation using in-memory storage
// This is for testing purposes when Neon DB is not configured

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

// In-memory storage
let transactions: Transaction[] = [];
let nextId = 1;

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  const existingIndex = transactions.findIndex(t => t.cust_ref_num === transaction.cust_ref_num);
  
  if (existingIndex !== -1) {
    // Update existing transaction
    transactions[existingIndex] = {
      ...transactions[existingIndex],
      ...transaction,
      updated_at: new Date()
    };
    return transactions[existingIndex];
  } else {
    // Create new transaction
    const newTransaction: Transaction = {
      ...transaction,
      id: nextId++,
      created_at: new Date(),
      updated_at: new Date()
    };
    transactions.push(newTransaction);
    return newTransaction;
  }
}

export async function getTransactionByRefNum(custRefNum: string) {
  return transactions.find(t => t.cust_ref_num === custRefNum);
}

export async function getAllTransactions() {
  return transactions.sort((a, b) => {
    const dateA = a.created_at?.getTime() || 0;
    const dateB = b.created_at?.getTime() || 0;
    return dateB - dateA;
  });
}

export async function updateTransactionStatus(
  custRefNum: string,
  updates: Partial<Transaction>
) {
  const index = transactions.findIndex(t => t.cust_ref_num === custRefNum);
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updated_at: new Date()
    };
    return transactions[index];
  }
  return null;
}

// Add some demo transactions
const demoTransactions: Transaction[] = [
  {
    id: nextId++,
    cust_ref_num: "1734019800000demo1",
    agg_ref_no: "1852417210160006281",
    auth_id: "M00006572",
    amount: 500.00,
    contact_no: "9876543210",
    email_id: "demo@example.com",
    payment_date: new Date("2025-01-12T10:30:00"),
    pay_status: "Ok",
    resp_code: "00000",
    resp_message: "Transaction Successful.",
    service_rrn: "823510001250",
    mop: "UPI",
    created_at: new Date("2025-01-12T10:30:00"),
    updated_at: new Date("2025-01-12T10:30:00")
  },
  {
    id: nextId++,
    cust_ref_num: "1734019800000demo2",
    agg_ref_no: "1852417210170176343",
    auth_id: "M00006572",
    amount: 250.00,
    contact_no: "9876543211",
    email_id: "test@example.com",
    payment_date: new Date("2025-01-12T11:00:00"),
    pay_status: "F",
    resp_code: "FFFFF",
    resp_message: "Transaction Failed.",
    service_rrn: "41722538621",
    mop: "UPI",
    created_at: new Date("2025-01-12T11:00:00"),
    updated_at: new Date("2025-01-12T11:00:00")
  },
  {
    id: nextId++,
    cust_ref_num: "1734019800000demo3",
    agg_ref_no: "1852417210180187354",
    auth_id: "M00006572",
    amount: 1000.00,
    contact_no: "9876543212",
    email_id: "pending@example.com",
    payment_date: new Date("2025-01-12T11:30:00"),
    pay_status: "PPPP",
    resp_code: "PPPP",
    resp_message: "Transaction Pending.",
    mop: "UPI",
    qr_string: "upi://pay?pa=demo@paytm&tr=1734019800000demo3",
    created_at: new Date("2025-01-12T11:30:00"),
    updated_at: new Date("2025-01-12T11:30:00")
  }
];

// Initialize with demo data
transactions = [...demoTransactions];
