import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/transactions
export async function GET(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get('accountId');
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit')) || 50;

  const where = { userId: parseInt(session.user.id) };
  if (accountId) where.accountId = parseInt(accountId);
  if (type) where.type = type;
  if (status) where.status = status;

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      account: { select: { name: true, type: true } },
      category: { select: { name: true, icon: true, color: true } },
    },
    orderBy: { transactionDate: 'desc' },
    take: limit,
  });

  return NextResponse.json(transactions);
}

// POST /api/transactions
export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { accountId, type, categoryId, amount, description, transactionDate, status } = body;

  if (!accountId || !type || !amount) {
    return NextResponse.json({ error: 'accountId, type, and amount are required' }, { status: 400 });
  }

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId: parseInt(session.user.id),
      accountId: parseInt(accountId),
      type,
      categoryId: categoryId ? parseInt(categoryId) : null,
      amount: parseFloat(amount),
      description: description || null,
      transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
      status: status || 'completed',
    },
  });

  // Update account balance
  if (status !== 'planned' && status !== 'skipped') {
    const balanceChange = type === 'income' ? parseFloat(amount) : -parseFloat(amount);
    await prisma.account.update({
      where: { id: parseInt(accountId) },
      data: { currentBalance: { increment: balanceChange } },
    });
  }

  return NextResponse.json(transaction, { status: 201 });
}
