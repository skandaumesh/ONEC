import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      firstName: u.name?.split(' ')[0] || 'User',
      lastName: u.name?.split(' ').slice(1).join(' ') || '',
      email: u.email,
      role: u.role,
      enabled: true // Prisma schema doesn't have enabled field by default, defaulting to true
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Users error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
