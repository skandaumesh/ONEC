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

    const body = await req.json();
    const { paymentMethod } = body;

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total
    const subtotal = cart.items.reduce((sum, i) => sum + i.product.sellingPrice * i.quantity, 0);
    const deliveryFee = subtotal >= 499 ? 0 : 49;
    const totalAmount = subtotal + deliveryFee;

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.sellingPrice
          }))
        }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Format order number
    const orderNumber = `ORD-${10000 + order.id}`;

    return NextResponse.json({ 
      success: true, 
      data: { 
        ...order, 
        orderNumber, 
        paymentMethod 
      } 
    });

  } catch (error) {
    console.error('Order place error:', error);
    return NextResponse.json({ success: false, message: 'Failed to place order' }, { status: 500 });
  }
}
