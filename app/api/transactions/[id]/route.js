import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// DELETE /api/transactions/[id]
export async function DELETE(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const txId = parseInt(id);

  const transaction = await prisma.transaction.findFirst({
    where: { id: txId, userId: parseInt(session.user.id) },
  });

  if (!transaction) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Reverse balance change
  if (transaction.status === 'completed') {
    const reversal = transaction.type === 'income' ? -transaction.amount : transaction.amount;
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { currentBalance: { increment: reversal } },
    });
  }

  await prisma.transaction.delete({ where: { id: txId } });

  return NextResponse.json({ success: true });
}
