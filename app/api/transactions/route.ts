import { NextRequest, NextResponse } from 'next/server';
import { getAllTransactions } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const transactions = await getAllTransactions();
    
    return NextResponse.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
