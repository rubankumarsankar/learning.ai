import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/categories
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: { userId: parseInt(session.user.id) },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(categories);
}

// POST /api/categories
export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, type, icon, color } = body;

  if (!name || !type) return NextResponse.json({ error: 'Name and type required' }, { status: 400 });

  const category = await prisma.category.create({
    data: { userId: parseInt(session.user.id), name, type, icon, color },
  });

  return NextResponse.json(category, { status: 201 });
}
