import { NextRequest, NextResponse } from 'next/server';
import { SkillPayCrypto, generateCustRefNum, formatPaymentDate } from '@/lib/crypto';
import { createTransaction } from '@/lib/db';
import axios from 'axios';

interface DecryptedResponse {
  AggRefNo: string;
  payStatus: string;
  resp_code: string;
  resp_message: string;
  serviceRRN: string;
  MOP: string;
  qrString: string;
  payrespDate?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, contactNo, emailId } = body;

    // Validate input
    if (!amount || !contactNo || !emailId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique reference number
    const custRefNum = generateCustRefNum();
    const paymentDate = formatPaymentDate();

    // Prepare payment request data
    const paymentData = {
      AuthID: process.env.NEXT_PUBLIC_SKILLPAY_AUTH_ID,
      AuthKey: process.env.NEXT_PUBLIC_SKILLPAY_AUTH_KEY,
      CustRefNum: custRefNum,
      txn_Amount: parseFloat(amount).toFixed(2),
      PaymentDate: paymentDate,
      ContactNo: contactNo,
      EmailId: emailId,
      IntegrationType: "seamless",
      CallbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      adf1: "NA",
      adf2: "NA",
      adf3: "NA",
      MOP: "UPI",
      MOPType: "UPI",
      MOPDetails: "I"
    };

    // Encrypt the data
    const encData = SkillPayCrypto.encrypt(paymentData);

    // Make API request to SkillPay
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SKILLPAY_API_URL}/paymentinit`,
      null,
      {
        params: {
          encData: encData,
          AuthID: process.env.NEXT_PUBLIC_SKILLPAY_AUTH_ID
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Decrypt response
    const decryptedResponse = SkillPayCrypto.decrypt(response.data.respData) as DecryptedResponse;

    // Save transaction to database
    await createTransaction({
      cust_ref_num: custRefNum,
      agg_ref_no: decryptedResponse.AggRefNo,
      auth_id: process.env.NEXT_PUBLIC_SKILLPAY_AUTH_ID!,
      amount: parseFloat(amount),
      contact_no: contactNo,
      email_id: emailId,
      payment_date: new Date(paymentDate),
      pay_status: decryptedResponse.payStatus,
      resp_code: decryptedResponse.resp_code,
      resp_message: decryptedResponse.resp_message,
      service_rrn: decryptedResponse.serviceRRN,
      mop: decryptedResponse.MOP,
      qr_string: decryptedResponse.qrString,
      pay_resp_date: decryptedResponse.payrespDate ? new Date(decryptedResponse.payrespDate) : undefined
    });

    return NextResponse.json({
      success: true,
      data: {
        custRefNum,
        aggRefNo: decryptedResponse.AggRefNo,
        qrString: decryptedResponse.qrString,
        payStatus: decryptedResponse.payStatus,
        respMessage: decryptedResponse.resp_message
      }
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: `SkillPay API Error: ${error.response.data?.resp_message || error.message}` },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
