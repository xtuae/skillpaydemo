import { NextRequest, NextResponse } from 'next/server';
import { SkillPayCrypto } from '@/lib/crypto';
import { updateTransactionStatus } from '@/lib/db';

interface DecryptedData {
  CustRefNum: string;
  payStatus: string;
  resp_code: string;
  resp_message: string;
  serviceRRN: string;
  payrespDate?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if response contains encrypted data
    if (body.respData) {
      // Decrypt the response
      const decryptedData = SkillPayCrypto.decrypt(body.respData) as DecryptedData;
      
      // Update transaction in database
      await updateTransactionStatus(decryptedData.CustRefNum, {
        pay_status: decryptedData.payStatus,
        resp_code: decryptedData.resp_code,
        resp_message: decryptedData.resp_message,
        service_rrn: decryptedData.serviceRRN,
        pay_resp_date: decryptedData.payrespDate ? new Date(decryptedData.payrespDate) : undefined
      });

      return NextResponse.json({
        success: true,
        message: 'Callback processed successfully'
      });
    }

    // Handle direct response format (non-encrypted)
    if (body.CustRefNum) {
      await updateTransactionStatus(body.CustRefNum, {
        pay_status: body.payStatus,
        resp_code: body.resp_code,
        resp_message: body.resp_message,
        service_rrn: body.serviceRRN,
        pay_resp_date: body.payrespDate ? new Date(body.payrespDate) : undefined
      });

      return NextResponse.json({
        success: true,
        message: 'Callback processed successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid callback data' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}

// Also handle GET requests for redirect callbacks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const custRefNum = searchParams.get('CustRefNum');
    const payStatus = searchParams.get('payStatus');
    
    if (custRefNum) {
      // Redirect to transaction status page
      return NextResponse.redirect(
        new URL(`/transaction/${custRefNum}?status=${payStatus}`, request.url)
      );
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Callback redirect error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
