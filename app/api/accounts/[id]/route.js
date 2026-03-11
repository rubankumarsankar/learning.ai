import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// GET /api/accounts/[id]
export async function GET(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const accountId = parseInt(id);

  const account = await prisma.account.findFirst({
    where: { id: accountId, userId: parseInt(session.user.id) },
  });

  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(account);
}

// PATCH /api/accounts/[id]
export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const accountId = parseInt(id);
  const body = await req.json();

  const account = await prisma.account.updateMany({
    where: { id: accountId, userId: parseInt(session.user.id) },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.type && { type: body.type }),
      ...(body.bankName !== undefined && { bankName: body.bankName }),
      ...(body.minimumBuffer !== undefined && { minimumBuffer: parseFloat(body.minimumBuffer) }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  });

  if (account.count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

// DELETE /api/accounts/[id]
export async function DELETE(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const accountId = parseInt(id);

  await prisma.account.deleteMany({
    where: { id: accountId, userId: parseInt(session.user.id) },
  });

  return NextResponse.json({ success: true });
}
