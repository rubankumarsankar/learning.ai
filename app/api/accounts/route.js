import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/accounts — list all accounts for the logged-in user
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const accounts = await prisma.account.findMany({
    where: { userId: parseInt(session.user.id) },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(accounts);
}

// POST /api/accounts — create a new account
export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, type, bankName, openingBalance, minimumBuffer } = body;

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const account = await prisma.account.create({
    data: {
      userId: parseInt(session.user.id),
      name,
      type: type || 'savings',
      bankName: bankName || null,
      openingBalance: parseFloat(openingBalance) || 0,
      currentBalance: parseFloat(openingBalance) || 0,
      minimumBuffer: parseFloat(minimumBuffer) || 0,
    },
  });

  return NextResponse.json(account, { status: 201 });
}
