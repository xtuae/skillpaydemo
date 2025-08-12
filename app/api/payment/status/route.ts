import { NextRequest, NextResponse } from 'next/server';
import { getTransactionByRefNum, updateTransactionStatus } from '@/lib/db';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const custRefNum = searchParams.get('custRefNum');

    if (!custRefNum) {
      return NextResponse.json(
        { error: 'Customer reference number is required' },
        { status: 400 }
      );
    }

    // First check local database
    const localTransaction = await getTransactionByRefNum(custRefNum);
    
    // If transaction exists and is already completed, return it
    if (localTransaction && (localTransaction.pay_status === 'Ok' || localTransaction.pay_status === 'F')) {
      return NextResponse.json({
        success: true,
        data: localTransaction
      });
    }

    // Otherwise, query SkillPay API for latest status
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SKILLPAY_API_URL}/statusenquiry`,
        null,
        {
          params: {
            AuthID: process.env.NEXT_PUBLIC_SKILLPAY_AUTH_ID,
            CustRefNum: custRefNum
          }
        }
      );

      const statusData = response.data;

      // Update local database with latest status
      if (localTransaction) {
        await updateTransactionStatus(custRefNum, {
          pay_status: statusData.payStatus,
          resp_code: statusData.resp_code,
          resp_message: statusData.resp_message,
          service_rrn: statusData.serviceRRN,
          pay_resp_date: statusData.payrespDate ? new Date(statusData.payrespDate) : undefined
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          ...localTransaction,
          ...statusData
        }
      });

    } catch (apiError) {
      console.error('SkillPay API error:', apiError);
      
      // If API fails but we have local data, return it
      if (localTransaction) {
        return NextResponse.json({
          success: true,
          data: localTransaction,
          warning: 'Unable to fetch latest status from payment gateway'
        });
      }
      
      throw apiError;
    }

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check transaction status' },
      { status: 500 }
    );
  }
}
