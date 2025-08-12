'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PaymentResult {
  custRefNum: string;
  aggRefNo?: string;
  pay_status: 'Ok' | 'F' | 'PPPP';
  respMessage?: string;
  qrString?: string;
}

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const amount = searchParams.get('amount');
  const contactNo = searchParams.get('contactNo');
  const emailId = searchParams.get('emailId');

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setPaymentResult(null);

    console.log('Initiating payment with the following details:');
    console.log({ amount, contactNo, emailId, upiId });

    try {
      const response = await axios.post('/api/payment/init', { amount, contactNo, emailId });
      console.log('Encrypted request data:', response.config.data);
      
      if (response.data.success) {
        console.log('Decrypted response data:', response.data.data);
        setPaymentResult(response.data.data);
        setQrCode(response.data.data.qrString);
        toast.success('Payment initiated successfully!');
        pollPaymentStatus(response.data.data.custRefNum);
      } else {
        toast.error('Failed to initiate payment');
        setError('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to initiate payment';
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (custRefNum: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/payment/status?custRefNum=${custRefNum}`);
        if (response.data.success) {
          console.log('Payment status response:', response.data.data);
          const status = response.data.data.pay_status;
          if (status === 'Ok') {
            clearInterval(pollInterval);
            toast.success('Payment completed successfully!');
            setPaymentResult(response.data.data);
          } else if (status === 'F') {
            clearInterval(pollInterval);
            toast.error('Payment failed!');
            setPaymentResult(response.data.data);
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000);
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white overflow-hidden shadow-xl rounded-lg">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-5 sm:px-6">
            <h3 className="text-2xl leading-6 font-bold text-white">Confirm Payment</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-600">Amount:</span>
                <span className="ml-2 text-gray-900">₹{amount}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Mobile Number:</span>
                <span className="ml-2 text-gray-900">{contactNo}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email Address:</span>
                <span className="ml-2 text-gray-900">{emailId}</span>
              </div>
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="your-upi-id@okhdfcbank"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : (
                  'Pay with UPI'
                )}
              </button>
            </div>
          </div>

          {paymentResult && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  {paymentResult.pay_status === 'Ok' ? (
                    <CheckCircle className="text-green-500 mr-2" size={24} />
                  ) : paymentResult.pay_status === 'F' ? (
                    <XCircle className="text-red-500 mr-2" size={24} />
                  ) : (
                    <Loader2 className="animate-spin text-yellow-500 mr-2" size={24} />
                  )}
                  <span className={`font-semibold ${
                    paymentResult.pay_status === 'Ok' ? 'text-green-700' :
                    paymentResult.pay_status === 'F' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {paymentResult.pay_status === 'Ok' ? 'Payment Successful' :
                     paymentResult.pay_status === 'F' ? 'Payment Failed' :
                     'Payment Pending'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Reference Number:</span>
                    <span className="ml-2 text-gray-900">{paymentResult.custRefNum}</span>
                  </div>
                  {paymentResult.aggRefNo && (
                    <div>
                      <span className="font-medium text-gray-600">Transaction ID:</span>
                      <span className="ml-2 text-gray-900">{paymentResult.aggRefNo}</span>
                    </div>
                  )}
                  {paymentResult.respMessage && (
                    <div>
                      <span className="font-medium text-gray-600">Message:</span>
                      <span className="ml-2 text-gray-900">{paymentResult.respMessage}</span>
                    </div>
                  )}
                </div>
                {qrCode && paymentResult.pay_status === 'PPPP' && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Scan QR code or click the link below to complete payment:
                    </p>
                    <a
                      href={qrCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Open UPI App
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h4 className="text-lg font-medium text-red-600 mb-4">Error Details</h4>
              <div className="bg-red-50 rounded-lg p-4">
                <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
