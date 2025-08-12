'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTransactionStatus(params.id as string);
    }
  }, [params.id]);

  const fetchTransactionStatus = async (custRefNum: string) => {
    try {
      const response = await axios.get(`/api/payment/status?custRefNum=${custRefNum}`);
      if (response.data.success) {
        setTransaction(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to fetch transaction details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactionStatus(params.id as string);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Ok':
        return <CheckCircle className="text-green-500" size={48} />;
      case 'F':
        return <XCircle className="text-red-500" size={48} />;
      case 'PPPP':
        return <Clock className="text-yellow-500" size={48} />;
      default:
        return <Clock className="text-gray-400" size={48} />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'Ok':
        return 'Payment Successful';
      case 'F':
        return 'Payment Failed';
      case 'PPPP':
        return 'Payment Pending';
      default:
        return 'Unknown Status';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Transaction not found</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>

        <div className="bg-white overflow-hidden shadow-xl rounded-lg">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon(transaction.pay_status || transaction.payStatus)}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {getStatusText(transaction.pay_status || transaction.payStatus)}
            </h2>
            <p className="text-indigo-100">
              Reference: {transaction.cust_ref_num || transaction.CustRefNum}
            </p>
          </div>

          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                <RefreshCw className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} size={16} />
                Refresh Status
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatAmount(transaction.amount || transaction.PayAmount)}
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.agg_ref_no || transaction.AggRefNo || 'N/A'}
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.email_id || transaction.EmailId}
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500">Mobile</p>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.contact_no || transaction.ContactNo}
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500">Payment Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(transaction.payment_date || transaction.PaymentDate)}
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm font-medium text-gray-500">Payment Mode</p>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.mop || transaction.MOP || 'UPI'}
                </p>
              </div>

              {(transaction.resp_code || transaction.resp_code) && (
                <div className="border-b pb-4">
                  <p className="text-sm font-medium text-gray-500">Response Code</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {transaction.resp_code || transaction.resp_code}
                  </p>
                </div>
              )}

              {(transaction.service_rrn || transaction.serviceRRN) && (
                <div className="border-b pb-4">
                  <p className="text-sm font-medium text-gray-500">Service RRN</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {transaction.service_rrn || transaction.serviceRRN}
                  </p>
                </div>
              )}
            </div>

            {(transaction.resp_message || transaction.resp_message) && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500">Response Message</p>
                <p className="mt-1 text-sm text-gray-900">
                  {transaction.resp_message || transaction.resp_message}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Make Another Payment
              </button>
              <button
                onClick={() => router.push('/transactions')}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
