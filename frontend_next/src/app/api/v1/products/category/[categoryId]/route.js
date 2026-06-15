import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { categoryId } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 0;
    const size = parseInt(searchParams.get('size')) || 12;

    const totalElements = await prisma.product.count({
      where: { categoryId: parseInt(categoryId) }
    });
    const totalPages = Math.ceil(totalElements / size);

    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(categoryId) },
      skip: page * size,
      take: size,
    });

    return NextResponse.json({
      success: true,
      data: {
        content: products,
        totalPages,
        totalElements,
        size,
        number: page
      }
    });
  } catch (error) {
    console.error('Category products error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
