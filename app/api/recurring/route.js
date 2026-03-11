import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/recurring
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rules = await prisma.recurringRule.findMany({
    where: { userId: parseInt(session.user.id) },
    include: {
      sourceAccount: { select: { name: true } },
      category: { select: { name: true, icon: true, color: true } },
    },
    orderBy: { priority: 'asc' },
  });

  return NextResponse.json(rules);
}

// POST /api/recurring
export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, amount, frequency, dueDay, sourceAccountId, categoryId, autoPay, isEssential, priority } = body;

  if (!title || !amount || !sourceAccountId) {
    return NextResponse.json({ error: 'title, amount, sourceAccountId required' }, { status: 400 });
  }

  const rule = await prisma.recurringRule.create({
    data: {
      userId: parseInt(session.user.id),
      title,
      amount: parseFloat(amount),
      frequency: frequency || 'monthly',
      dueDay: dueDay ? parseInt(dueDay) : null,
      startDate: new Date(),
      sourceAccountId: parseInt(sourceAccountId),
      categoryId: categoryId ? parseInt(categoryId) : null,
      autoPay: autoPay || false,
      isEssential: isEssential !== undefined ? isEssential : true,
      priority: priority || 5,
    },
  });

  return NextResponse.json(rule, { status: 201 });
}
