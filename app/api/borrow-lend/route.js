import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const entries = await prisma.borrowLendEntry.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: [
        { status: 'asc' }, // 'active' first
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET BorrowLend Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { personName, direction, principalAmount, dueDate, note } = body;

    if (!personName || !direction || !principalAmount) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!['lent', 'borrowed'].includes(direction)) {
      return new NextResponse("Direction must be lent or borrowed", { status: 400 });
    }

    const entry = await prisma.borrowLendEntry.create({
      data: {
        userId: parseInt(session.user.id),
        personName,
        direction,
        principalAmount: parseFloat(principalAmount),
        outstandingAmount: parseFloat(principalAmount),
        dueDate: dueDate ? new Date(dueDate) : null,
        note: note || null,
        status: 'active'
      }
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("POST BorrowLend Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
