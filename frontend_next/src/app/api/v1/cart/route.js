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

export async function GET(req) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const formattedCart = {
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

    return NextResponse.json({ success: true, data: formattedCart });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    const emptyCart = { ...cart, items: [], totalItems: 0 };
    return NextResponse.json({ success: true, data: emptyCart });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
