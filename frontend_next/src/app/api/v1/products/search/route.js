import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '12');

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { name: { contains: query } } }
        ]
      },
      include: { category: true },
      skip: page * size,
      take: size,
      orderBy: { id: 'desc' }
    });

    const totalElements = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { name: { contains: query } } }
        ]
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        content: products,
        totalElements,
        totalPages: Math.ceil(totalElements / size),
        number: page,
        size
      }
    });
  } catch (error) {
    console.error('Product search error:', error);
    return NextResponse.json({ success: false, message: 'Failed to search products' }, { status: 500 });
  }
}
