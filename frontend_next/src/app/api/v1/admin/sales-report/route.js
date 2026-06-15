import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      salesData: []
    }
  });
}
