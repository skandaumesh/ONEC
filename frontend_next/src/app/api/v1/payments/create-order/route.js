import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-fallback-key';

function getUserId(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

export async function POST(req) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId');

    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });

    // Return dummy razorpay order details to trigger the simulated UI popup
    return NextResponse.json({
      success: true,
      data: {
        keyId: 'rzp_test_dummy_key',
        amount: order.totalAmount,
        currency: 'INR',
        razorpayOrderId: `order_sim_${Date.now()}`,
        orderId: order.id,
        orderNumber: `ORD-${10000 + order.id}`
      }
    });
  } catch (error) {
    console.error('Create razorpay order error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
