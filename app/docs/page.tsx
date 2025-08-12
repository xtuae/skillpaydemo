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
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>
{`
const initiatePayment = async (paymentDetails) => {
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
      // Display QR code and handle payment status
      console.log('QR Code String:', data.data.qrString);
    } else {
      console.error('Payment initiation failed:', data.error);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
`}
                  </code>
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
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>
{`
import javax.crypto.Cipher;
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
}
`}
                      </code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Decryption</h3>
                    <p className="text-gray-600 mb-4">
                      Decrypting the response from SkillPay.
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>
{`
public String decrypt(String encryptedData) throws Exception {
    Cipher cipher = Cipher.getInstance(ALGORITHM);
    cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, iv);
    byte[] original = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
    return new String(original);
}
`}
                      </code>
                    </pre>
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
