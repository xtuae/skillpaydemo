import { FileText } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <FileText className="h-10 w-10 text-indigo-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">
              SkillPay API Integration Guide
            </h1>
          </div>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Integration Process Flow
                </h2>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                  <li>
                    <span className="font-semibold">Payment Init:</span> Application sends a POST request with encrypted JSON data to the server.
                  </li>
                  <li>
                    <span className="font-semibold">Server Receives Data:</span> Server receives the encrypted data.
                  </li>
                  <li>
                    <span className="font-semibold">Decrypt Received Data:</span> Server decrypts the received data.
                  </li>
                  <li>
                    <span className="font-semibold">UPI Intent Page:</span> Application displays the required data and QR string from the decrypted response.
                  </li>
                  <li>
                    <span className="font-semibold">Set User/Payer UPI ID:</span> User sets their UPI ID.
                  </li>
                  <li>
                    <span className="font-semibold">Send for Transaction:</span> User clicks the "Pay with UPI" button to initiate the transaction.
                  </li>
                  <li>
                    <span className="font-semibold">Transaction Pending:</span> Server sends encrypted data in JSON format, and the transaction is now pending.
                  </li>
                  <li>
                    <span className="font-semibold">Get Callback Data:</span> Application gets the encrypted callback data.
                  </li>
                  <li>
                    <span className="font-semibold">Decrypt Data (Success):</span> If the transaction is successful, the application decrypts the data.
                  </li>
                  <li>
                    <span className="font-semibold">Show Successful:</span> Application shows a success message and redirects to the transaction detail page.
                  </li>
                  <li>
                    <span className="font-semibold">Decrypt Data (Failed):</span> If the transaction fails, the application decrypts the data.
                  </li>
                  <li>
                    <span className="font-semibold">Show Failed:</span> Application shows a failure message and redirects to the transaction detail page.
                  </li>
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  API Reference
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Authorization Request</h3>
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold">URL:</span> <code className="bg-gray-200 p-1 rounded text-gray-800">https://dashboard.skill-pay.in/pay/paymentinit</code><br />
                      <span className="font-semibold">Method:</span> POST
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Transaction Status Query</h3>
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold">URL:</span> <code className="bg-gray-200 p-1 rounded text-gray-800">https://dashboard.skill-pay.in/pay/statusenquiry</code><br />
                      <span className="font-semibold">Method:</span> POST
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
