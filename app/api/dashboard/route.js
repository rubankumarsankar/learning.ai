import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/dashboard — aggregate data for dashboard widgets
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = parseInt(session.user.id);

  // All accounts
  const accounts = await prisma.account.findMany({
    where: { userId, isActive: true },
  });

  // Total balance (net worth for now)
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  // This month's transactions
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const monthlyTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      transactionDate: { gte: startOfMonth, lte: endOfMonth },
      status: 'completed',
    },
    include: {
      category: { select: { name: true, icon: true, color: true, type: true } },
      account: { select: { name: true } },
    },
    orderBy: { transactionDate: 'desc' },
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Spending by category
  const categorySpending = {};
  monthlyTransactions
    .filter(t => t.type === 'expense' && t.category)
    .forEach(t => {
      const key = t.category.name;
      if (!categorySpending[key]) {
        categorySpending[key] = { name: key, icon: t.category.icon, color: t.category.color, amount: 0 };
      }
      categorySpending[key].amount += t.amount;
    });

  // Upcoming dues (planned transactions in next 30 days)
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingDues = await prisma.transaction.findMany({
    where: {
      userId,
      status: 'planned',
      transactionDate: { gte: now, lte: next30Days },
    },
    include: {
      category: { select: { name: true, icon: true } },
      account: { select: { name: true } },
    },
    orderBy: { transactionDate: 'asc' },
    take: 10,
  });

  // Recent transactions
  const recentTransactions = monthlyTransactions.slice(0, 10);

  // Recurring rules count
  const recurringCount = await prisma.recurringRule.count({
    where: { userId, isActive: true },
  });

  return NextResponse.json({
    accounts,
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    monthlySavings: monthlyIncome - monthlyExpense,
    categorySpending: Object.values(categorySpending),
    upcomingDues,
    recentTransactions,
    recurringCount,
  });
}
