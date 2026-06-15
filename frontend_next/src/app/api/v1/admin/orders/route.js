import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 0;
    const size = parseInt(searchParams.get('size')) || 100;

    const orders = await prisma.order.findMany({
      skip: page * size,
      take: size,
      include: {
        user: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalElements = await prisma.order.count();
    const totalPages = Math.ceil(totalElements / size);

    // Format for the frontend
    const formattedOrders = orders.map(o => ({
      id: o.id,
      orderNumber: `ONEC-${o.id}`,
      userFirstName: o.user?.name?.split(' ')[0] || 'Guest',
      userLastName: o.user?.name?.split(' ').slice(1).join(' ') || '',
      totalAmount: o.totalAmount,
      status: o.status,
      items: o.items,
      createdAt: o.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: {
        content: formattedOrders,
        totalPages,
        totalElements,
        size,
        number: page
      }
    });
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
