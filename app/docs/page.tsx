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
                  React (Frontend) Code Snippet
                </h2>
                <p className="text-gray-600 mb-4">
                  Example of initiating a payment from a React component.
                </p>
                <div className="bg-black text-white p-4 rounded-lg overflow-x-auto text-sm">
                  <pre>
{`const initiatePayment = async (paymentDetails) => {
  try {
    const response = await fetch('/api/payment/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    });
    const data = await response.json();
    if (data.success) {
      console.log('QR Code String:', data.data.qrString);
    } else {
      console.error('Payment initiation failed:', data.error);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};`}
                  </pre>
                </div>
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
                    <div className="bg-black text-white p-4 rounded-lg overflow-x-auto text-sm">
                      <pre>
{`import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class SkillPayCrypto {
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private final String authKey;
    private final IvParameterSpec iv;
    private final SecretKeySpec secretKeySpec;

    public SkillPayCrypto(String authKey) {
        this.authKey = authKey;
        this.iv = new IvParameterSpec(authKey.substring(0, 16).getBytes());
        this.secretKeySpec = new SecretKeySpec(authKey.getBytes(), "AES");
    }

    public String encrypt(String data) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, iv);
        byte[] encrypted = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Decryption</h3>
                    <p className="text-gray-600 mb-4">
                      Decrypting the response from SkillPay.
                    </p>
                    <div className="bg-black text-white p-4 rounded-lg overflow-x-auto text-sm">
                      <pre>
{`public String decrypt(String encryptedData) throws Exception {
    Cipher cipher = Cipher.getInstance(ALGORITHM);
    cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, iv);
    byte[] original = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
    return new String(original);
}`}
                      </pre>
                    </div>
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
                      <span className="font-semibold">URL:</span> <code className="bg-gray-200 p-1 rounded text-gray-800">https://dashboard.skill-pay.in/pay/paymentinit</code><br />
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
                        <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
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
                          <tr><td className="px-6 py-4 whitespace-nowrap">MOPDetails</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">For UPI txn pass - "I"</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">MOPType</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">For UPI txn pass – "UPI"</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Transaction Status Query</h3>
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold">URL:</span> <code className="bg-gray-200 p-1 rounded text-gray-800">https://dashboard.skill-pay.in/pay/statusenquiry</code><br />
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
                        <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
                          <tr><td className="px-6 py-4 whitespace-nowrap">AuthID</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A Unique AuthID provide by</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">CustRefNum</td><td className="px-6 py-4 whitespace-nowrap">String</td><td className="px-6 py-4">A unique tracking id created by the merchant for each transaction</td><td className="px-6 py-4 whitespace-nowrap">Yes</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Response Parameters
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Decrypted Response (Initial)</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
                          <tr><td className="px-6 py-4 whitespace-nowrap">payStatus</td><td className="px-6 py-4">Transaction Status (e.g., "Pending")</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">qrString</td><td className="px-6 py-4">Deeplink for transaction</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Final Response (Callback)</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-gray-800">
                          <tr><td className="px-6 py-4 whitespace-nowrap">payStatus</td><td className="px-6 py-4">OK (Success), F (Failed), PPPP (Pending)</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">resp_code</td><td className="px-6 py-4">Response Code (e.g., "00000" for success)</td></tr>
                          <tr><td className="px-6 py-4 whitespace-nowrap">resp_message</td><td className="px-6 py-4">Response Message</td></tr>
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
