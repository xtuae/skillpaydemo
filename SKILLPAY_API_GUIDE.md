# SkillPay API Integration Guide

## Integration Process Flow

1.  **Payment Init:** Application sends a POST request with encrypted JSON data to the server.
2.  **Server Receives Data:** Server receives the encrypted data.
3.  **Decrypt Received Data:** Server decrypts the received data.
4.  **UPI Intent Page:** Application displays the required data and QR string from the decrypted response.
5.  **Set User/Payer UPI ID:** User sets their UPI ID.
6.  **Send for Transaction:** User clicks the "Pay with UPI" button to initiate the transaction.
7.  **Transaction Pending:** Server sends encrypted data in JSON format, and the transaction is now pending.
8.  **Get Callback Data:** Application gets the encrypted callback data.
9.  **Decrypt Data (Success):** If the transaction is successful, the application decrypts the data.
10. **Show Successful:** Application shows a success message and redirects to the transaction detail page.
11. **Decrypt Data (Failed):** If the transaction fails, the application decrypts the data.
12. **Show Failed:** Application shows a failure message and redirects to the transaction detail page.

## API Reference

### Authorization Request

*   **URL:** `https://dashboard.skill-pay.in/pay/paymentinit`
*   **Method:** POST

| Attribute | Type | Description | Mandatory |
| :--- | :--- | :--- | :--- |
| AuthID | String | A Unique AuthID provided by aggregator | Yes |
| AuthKey | String | A unique AuthKey key provided by aggregator | Yes |
| CustRefNum | String | A unique tracking id created by the merchant for each transaction | Yes |
| txn\_Amount | Numeric | Amount of the transaction | Yes |
| PaymentDate | Date Time | Date time of the originator (yyyy-mm-dd hh:mm:ss) | Yes |
| ContactNo | String | Mobile number of the customer | Yes |
| EmailId | String | Email id of the customer | Yes |
| IntegrationType | String | "seamless" or "nonseamless" | Yes |
| CallbackURL | String | A Unique URL provided by the merchant to post the response | Yes |
| MOP | String | The mode of transaction (e.g., "UPI") | Yes |
| MOPDetails | String | For UPI txn pass - “I” | Yes |
| MOPType | String | For UPI txn pass – “UPI” | Yes |

### Transaction Status Query

*   **URL:** `https://dashboard.skill-pay.in/pay/statusenquiry`
*   **Method:** POST

| Attribute | Type | Description | Mandatory |
| :--- | :--- | :--- | :--- |
| AuthID | String | A Unique AuthID provide by | Yes |
| CustRefNum | String | A unique tracking id created by the merchant for each transaction | Yes |

### Response Parameters

#### Decrypted Response (Initial)

| Attribute | Description |
| :--- | :--- |
| payStatus | Transaction Status (e.g., "Pending") |
| qrString | Deeplink for transaction |

#### Final Response (Callback)

| Attribute | Description |
| :--- | :--- |
| payStatus | OK (Success), F (Failed), PPPP (Pending) |
| resp\_code | Response Code (e.g., "00000" for success) |
| resp\_message | Response Message |
