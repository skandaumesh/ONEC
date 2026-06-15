import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Basic real-time stats from Prisma
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'USER' } });
    
    // Calculate total revenue
    const revenueAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true }
    });
    const totalRevenue = revenueAgg._sum.totalAmount || 0;

    // Today's orders & revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: today } }
    });
    
    const todayRevenueAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: today } }
    });
    const todayRevenue = todayRevenueAgg._sum.totalAmount || 0;

    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    });

    const lowStockProducts = await prisma.product.count({
      where: { inStock: false } // or stock <= 10 if you have a stock field
    });

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        todayOrders,
        todayRevenue,
        pendingOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
