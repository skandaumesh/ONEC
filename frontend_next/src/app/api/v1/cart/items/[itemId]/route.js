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

async function getCartWithItems(userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    if (!cart) return null;
    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    return {
      ...cart,
      totalItems,
      items: cart.items.map(item => ({
        ...item,
        price: item.product?.sellingPrice || 0,
        name: item.product?.name || 'Unknown Product',
        productName: item.product?.name || 'Unknown Product',
        imageUrl: item.product?.imageUrl || '',
        manufacturer: item.product?.manufacturer || 'Unknown Manufacturer'
      }))
    };
}

export async function PUT(req, { params }) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { itemId } = await params;
    const url = new URL(req.url);
    const quantity = parseInt(url.searchParams.get('quantity'));

    if (quantity > 0) {
      await prisma.cartItem.update({
        where: { id: parseInt(itemId) },
        data: { quantity }
      });
    } else {
      await prisma.cartItem.delete({
        where: { id: parseInt(itemId) }
      });
    }

    const updatedCart = await getCartWithItems(userId);
    return NextResponse.json({ success: true, data: updatedCart });
  } catch (error) {
    console.error('Cart updateItem error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { itemId } = await params;

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) }
    });

    const updatedCart = await getCartWithItems(userId);
    return NextResponse.json({ success: true, data: updatedCart });
  } catch (error) {
    console.error('Cart removeItem error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
