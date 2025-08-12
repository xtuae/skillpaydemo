'use client';

import { useState, useEffect } from 'react';
import { Receipt, Loader2, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Transaction {
  id: number;
  cust_ref_num: string;
  agg_ref_no?: string;
  amount: number;
  contact_no: string;
  email_id: string;
  payment_date: string;
  pay_status?: string;
  resp_code?: string;
  resp_message?: string;
  service_rrn?: string;
  mop?: string;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions');
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Ok':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'F':
        return <XCircle className="text-red-500" size={20} />;
      case 'PPPP':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'Ok':
        return 'Success';
      case 'F':
        return 'Failed';
      case 'PPPP':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="bg-white overflow-hidden shadow-xl rounded-lg">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-5 sm:px-6">
          <h3 className="text-2xl leading-6 font-bold text-white flex items-center">
            <Receipt className="mr-3" size={28} />
            Transaction History
          </h3>
          <p className="mt-1 text-purple-100">
            View all your payment transactions
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.pay_status)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {getStatusText(transaction.pay_status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.cust_ref_num}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.email_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.payment_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <Eye className="mr-1" size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-lg">
              <h3 className="text-xl font-bold text-white">Transaction Details</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reference Number</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.cust_ref_num}</p>
                </div>
                
                {selectedTransaction.agg_ref_no && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.agg_ref_no}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="mt-1 text-sm text-gray-900">{formatAmount(selectedTransaction.amount)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1 flex items-center">
                    {getStatusIcon(selectedTransaction.pay_status)}
                    <span className="ml-2 text-sm text-gray-900">
                      {getStatusText(selectedTransaction.pay_status)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.email_id}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Mobile</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.contact_no}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Date</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedTransaction.payment_date)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedTransaction.created_at)}</p>
                </div>
                
                {selectedTransaction.resp_code && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Response Code</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.resp_code}</p>
                  </div>
                )}
                
                {selectedTransaction.resp_message && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Response Message</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.resp_message}</p>
                  </div>
                )}
                
                {selectedTransaction.service_rrn && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service RRN</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.service_rrn}</p>
                  </div>
                )}
                
                {selectedTransaction.mop && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Mode</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.mop}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
