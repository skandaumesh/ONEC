import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page')) || 0;
    const size = parseInt(searchParams.get('size')) || 12;
    const sortBy = searchParams.get('sortBy') || 'id';
    const sortDir = searchParams.get('sortDir') || 'desc';

    const where = q ? {
      OR: [
        { name: { contains: q } },
        { manufacturer: { contains: q } }
      ]
    } : {};

    const totalElements = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalElements / size);

    const products = await prisma.product.findMany({
      where,
      skip: page * size,
      take: size,
      orderBy: { [sortBy]: sortDir }
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
    console.error('Products error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        mrp: parseFloat(data.mrp),
        sellingPrice: parseFloat(data.sellingPrice),
        manufacturer: data.manufacturer,
        saltComposition: data.saltComposition,
        uses: data.uses,
        sideEffects: data.sideEffects,
        directions: data.directions,
        imageUrl: data.imageUrl,
        prescriptionRequired: data.prescriptionRequired,
        featured: data.featured,
        stock: parseInt(data.stock),
        packSize: data.packSize,
        dosageForm: data.dosageForm,
        categoryId: parseInt(data.categoryId) || null
      }
    });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
