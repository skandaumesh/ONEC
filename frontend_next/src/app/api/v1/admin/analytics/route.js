import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Sales Trend Data (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, totalAmount: true }
    });

    const salesMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      salesMap[dateStr] = { name: dateStr, revenue: 0, orders: 0 };
    }

    recentOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (salesMap[dateStr]) {
        salesMap[dateStr].revenue += order.totalAmount;
        salesMap[dateStr].orders += 1;
      }
    });
    const salesData = Object.values(salesMap);

    // 2. Category Distribution Data
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } }
      }
    });
    
    let categoryData = categories.map(cat => ({
      name: cat.name,
      value: cat._count.products
    })).filter(cat => cat.value > 0);

    // If no categories have products, return some fallback data so the pie chart isn't totally empty
    if (categoryData.length === 0) {
      categoryData = [
        { name: 'Medicines', value: 10 },
        { name: 'Wellness', value: 5 },
        { name: 'Personal Care', value: 3 }
      ];
    }

    // 3. Top Value Products (Proxy for top selling if orders don't have detailed items, or highest price)
    const topProductsRaw = await prisma.product.findMany({
      orderBy: { sellingPrice: 'desc' },
      take: 5,
      select: { name: true, sellingPrice: true, stock: true, mrp: true }
    });

    const topProducts = topProductsRaw.map(p => ({
      name: p.name.substring(0, 15) + (p.name.length > 15 ? '...' : ''),
      price: p.sellingPrice,
      mrp: p.mrp
    }));

    return NextResponse.json({
      success: true,
      data: {
        salesData,
        categoryData,
        topProducts
      }
    });

  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
