'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: '',
    contactNo: '',
    emailId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.contactNo || !formData.emailId) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.contactNo.length !== 10) {
      toast.error('Contact number must be 10 digits');
      return;
    }

    const formattedAmount = parseFloat(formData.amount).toFixed(2);
    const query = new URLSearchParams({
      ...formData,
      amount: formattedAmount,
    }).toString();
    
    router.push(`/confirm?${query}`);
  };

  return (
    <div className="px-4 py-5 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white overflow-hidden shadow-xl rounded-lg">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-5 sm:px-6">
            <h3 className="text-2xl leading-6 font-bold text-white flex items-center">
              <CreditCard className="mr-3" size={28} />
              Make a Payment
            </h3>
            <p className="mt-1 text-indigo-100">
              Enter your details to initiate a UPI payment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="Enter amount"
                  step="0.01"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="contactNo"
                  id="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="10 digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label htmlFor="emailId" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailId"
                  id="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Confirmation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
