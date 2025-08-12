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
                    <span className="font-semibold">Frontend (React):</span> User fills out the payment form and clicks "Initiate Payment".
                  </li>
                  <li>
                    <span className="font-semibold">Frontend to Backend:</span> The React application sends a POST request to your backend API (e.g., `/api/payment/init`) with the payment details.
                  </li>
                  <li>
                    <span className="font-semibold">Backend:</span> Your server receives the request, validates the data, and prepares the payment payload for SkillPay.
                  </li>
                  <li>
                    <span className="font-semibold">Encryption (Backend):</span> The payment payload is encrypted using AES-256 with your SkillPay Auth Key.
                  </li>
                  <li>
                    <span className="font-semibold">Backend to SkillPay:</span> Your server sends a POST request to the SkillPay `paymentinit` endpoint with the encrypted data.
                  </li>
                  <li>
                    <span className="font-semibold">SkillPay to Backend:</span> SkillPay processes the request and returns an encrypted response containing the payment details (including a QR code string).
                  </li>
                  <li>
                    <span className="font-semibold">Decryption (Backend):</span> Your server decrypts the response from SkillPay.
                  </li>
                  <li>
                    <span className="font-semibold">Database (Backend):</span> The initial transaction details are saved to your database.
                  </li>
                  <li>
                    <span className="font-semibold">Backend to Frontend:</span> Your server sends the decrypted data (especially the QR code) back to the React application.
                  </li>
                  <li>
                    <span className="font-semibold">Frontend:</span> The React application displays the QR code and payment status to the user.
                  </li>
                  <li>
                    <span className="font-semibold">Polling:</span> The frontend starts polling your backend (`/api/payment/status`) to check for payment completion.
                  </li>
                   <li>
                    <span className="font-semibold">Callback:</span> Once the user completes the payment, SkillPay sends a POST request to your configured callback URL (`/api/payment/callback`) with the final transaction status.
                  </li>
                  <li>
                    <span className="font-semibold">Backend:</span> Your callback handler decrypts the data, verifies the transaction, and updates the payment status in your database.
                  </li>
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  React (Frontend) Code Snippet
                </h2>
                <p className="text-gray-600 mb-4">
                  Example of initiating a payment from a React component.
                </p>
                <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                  <code dangerouslySetInnerHTML={{ __html: `
                    <span class="text-blue-400">const</span> initiatePayment = <span class="text-blue-400">async</span> (paymentDetails) => {<br>
                    {'  '}<span class="text-blue-400">try</span> {<br>
                    <br />
                    {'    '}<span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> fetch('/api/payment/init', &#123;
                    <br />
                    {'      '}method: <span className="text-green-400">'POST'</span>,
                    <br />
                    {'      '}headers: &#123;
                    <br />
                    {'        '}<span className="text-green-400">'Content-Type'</span>: <span className="text-green-400">'application/json'</span>,
                    <br />
                    {'      '}&#125;,
                    <br />
                    {'      '}body: JSON.stringify(paymentDetails),
                    <br />
                    {'    '}&#125;);
                    <br />
                    <br />
                    {'    '}<span className="text-blue-400">const</span> data = <span className="text-blue-400">await</span> response.json();
                    <br />
                    <br />
                    {'    '}<span className="text-blue-400">if</span> (data.success) &#123;
                    <br />
                    {'      '}<span className="text-gray-500">// Display QR code and handle payment status</span>
                    <br />
                    {'      '}console.log(<span className="text-green-400">'QR Code String:'</span>, data.data.qrString);
                    <br />
                    {'    '}&#125; <span className="text-blue-400">else</span> &#123;
                    <br />
                    {'      '}console.error(<span className="text-green-400">'Payment initiation failed:'</span>, data.error);
                    <br />
                    {'    '}&#125;
                    <br />
                    {'  '}&#125; <span className="text-blue-400">catch</span> (error) &#123;
                    <br />
                    {'    '}console.error(<span className="text-green-400">'An error occurred:'</span>, error);
                    <br />
                    {'  '}&#125;
                    <br />
                    };
                  ` }} />
                </pre>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Java (Backend) Code Snippets
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Encryption</h3>
                    <p className="text-gray-600 mb-4">
                      Encrypting the payment data before sending to SkillPay.
                    </p>
                    <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                      <code dangerouslySetInnerHTML={{ __html: `
                        <span class="text-blue-400">import</span> javax.crypto.Cipher;<br>
                        <span class="text-blue-400">import</span> javax.crypto.spec.IvParameterSpec;<br>
                        <br />
                        <span className="text-blue-400">import</span> javax.crypto.spec.SecretKeySpec;
                        <br />
                        <span className="text-blue-400">import</span> java.util.Base64;
                        <br />
                        <br />
                        <span className="text-blue-400">public</span> <span className="text-blue-400">class</span> <span className="text-yellow-400">SkillPayCrypto</span> &#123;
                        <br />
                        {'    '}<span className="text-blue-400">private</span> <span className="text-blue-400">static</span> <span className="text-blue-400">final</span> String ALGORITHM = <span className="text-green-400">"AES/CBC/PKCS5Padding"</span>;
                        <br />
                        {'    '}<span className="text-blue-400">private</span> <span className="text-blue-400">final</span> String authKey;
                        <br />
                        {'    '}<span className="text-blue-400">private</span> <span className="text-blue-400">final</span> IvParameterSpec iv;
                        <br />
                        {'    '}<span className="text-blue-400">private</span> <span className="text-blue-400">final</span> SecretKeySpec secretKeySpec;
                        <br />
                        <br />
                        {'    '}<span className="text-blue-400">public</span> <span className="text-yellow-400">SkillPayCrypto</span>(String authKey) &#123;
                        <br />
                        {'        '}<span className="text-blue-400">this</span>.authKey = authKey;
                        <br />
                        {'        '}<span className="text-blue-400">this</span>.iv = <span className="text-blue-400">new</span> IvParameterSpec(authKey.substring(0, 16).getBytes());
                        <br />
                        {'        '}<span className="text-blue-400">this</span>.secretKeySpec = <span className="text-blue-400">new</span> SecretKeySpec(authKey.getBytes(), <span className="text-green-400">"AES"</span>);
                        <br />
                        {'    '}&#125;
                        <br />
                        <br />
                        {'    '}<span className="text-blue-400">public</span> String <span className="text-yellow-400">encrypt</span>(String data) <span className="text-blue-400">throws</span> Exception &#123;
                        <br />
                        {'        '}Cipher cipher = Cipher.getInstance(ALGORITHM);
                        <br />
                        {'        '}cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, iv);
                        <br />
                        {'        '}<span className="text-blue-400">byte</span>[] encrypted = cipher.doFinal(data.getBytes());
                        <br />
                        {'        '}<span className="text-blue-400">return</span> Base64.getEncoder().encodeToString(encrypted);
                        <br />
                        {'    '}&#125;
                        <br />
                        }
                      ` }} />
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Decryption</h3>
                    <p className="text-gray-600 mb-4">
                      Decrypting the response from SkillPay.
                    </p>
                    <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                      <code dangerouslySetInnerHTML={{ __html: `
                        <span class="text-blue-400">public</span> String <span class="text-yellow-400">decrypt</span>(String encryptedData) <span class="text-blue-400">throws</span> Exception {<br>
                        {'    '}Cipher cipher = Cipher.getInstance(ALGORITHM);<br>
                        <br />
                        {'    '}cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, iv);
                        <br />
                        {'    '}<span className="text-blue-400">byte</span>[] original = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
                        <br />
                        {'    '}<span className="text-blue-400">return</span> <span className="text-blue-400">new</span> String(original);
                        <br />
                        }
                      ` }} />
                    </pre>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  API Reference
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Authorization Request</h3>
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold">URL:</span> <code className="bg-gray-100 p-1 rounded">https://dashboard.skill-pay.in/pay/paymentinit</code><br />
                      <span className="font-semibold">Method:</span> POST
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mandatory</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr><td className="px-6 py-4 whitespace-nowrap">AuthID</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A Unique AuthID provided by aggregator</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">AuthKey</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A unique AuthKey key provided by aggregator</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">CustRefNum</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A unique tracking id created by the merchant for each transaction</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">txn_Amount</td><td className="px-6 py-4 whitespace-nowrap">Numeric</td><td className="px-6 py-4">Amount of the transaction</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">PaymentDate</td><td className="px-6 py-4 whitespace-nowrap">Date Time</td><td className="px-6 py-4">Date time of the originator (yyyy-mm-dd hh:mm:ss)</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">ContactNo</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">Mobile number of the customer</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">EmailId</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">Email id of the customer</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">IntegrationType</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">"seamless" or "nonseamless"</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">CallbackURL</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A Unique URL provided by the merchant to post the response</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">MOP</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">The mode of transaction (e.g., "UPI")</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">MOPDetails</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">For UPI txn pass - “I”</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">MOPType</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">For UPI txn pass – “UPI”</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Transaction Status Query</h3>
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold">URL:</span> <code className="bg-gray-100 p-1 rounded">https://dashboard.skill-pay.in/pay/statusenquiry</code><br />
                      <span className="font-semibold">Method:</span> POST
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mandatory</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr><td className="px-6 py-4 whitespace-nowrap">AuthID</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A Unique AuthID provide by</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">CustRefNum</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A unique tracking id created by the merchant for each transaction</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                        </tbody>
                      </table>
                    </div>
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
