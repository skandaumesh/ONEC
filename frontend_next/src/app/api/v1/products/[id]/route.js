import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    });
    
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const data = await req.json();
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
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
    console.error('Product PUT error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    // First, delete related cart items to avoid constraint errors
    await prisma.cartItem.deleteMany({
      where: { productId: parseInt(id) }
    });

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
