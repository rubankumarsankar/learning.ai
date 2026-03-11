import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const monthsBack = parseInt(url.searchParams.get('months') || '6');

    // Calculate date range
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - monthsBack + 1, 1);
    
    // Fetch all transactions in date range
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: parseInt(session.user.id),
        status: 'completed',
        transactionDate: {
          gte: startDate,
          lte: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)
        }
      },
      include: {
        category: true
      }
    });

    // 1. Process Monthly Cashflow (Income vs Expenses)
    const monthlyData = {};
    
    // Initialize months map
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[monthKey] = { name: monthKey, income: 0, expense: 0 };
    }

    // 2. Process Category Spending (Only for current month)
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const categorySpending = {};

    transactions.forEach(t => {
      // Monthly Cashflow
      const tDate = new Date(t.transactionDate);
      const monthKey = tDate.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      
      if (monthlyData[monthKey]) {
        if (t.type === 'income') {
          monthlyData[monthKey].income += t.amount;
        } else if (t.type === 'expense' || t.type === 'debt_payment') {
          monthlyData[monthKey].expense += t.amount;
        }
      }

      // Category Spending (Current Month Only)
      if (tDate >= currentMonthStart && (t.type === 'expense' || t.type === 'debt_payment')) {
        const catName = t.category?.name || 'Uncategorized';
        categorySpending[catName] = (categorySpending[catName] || 0) + t.amount;
      }
    });

    // Format for Recharts
    const cashflow = Object.values(monthlyData);
    
    const categories = Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort highest first

    return NextResponse.json({
      cashflow,
      categories
    });
  } catch (error) {
    console.error("GET Reports Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
