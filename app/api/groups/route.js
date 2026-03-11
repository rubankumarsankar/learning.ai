import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const groups = await prisma.group.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        members: true,
        expenses: {
          include: {
            paidByMember: true,
            shares: true
          },
          orderBy: { expenseDate: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Calculate balances per group
    const groupsWithBalances = groups.map(group => {
      // Calculate who owes who is complex. For UI summary, just get total group expenses
      const totalExpenses = group.expenses.reduce((sum, e) => sum + e.totalAmount, 0);
      return { ...group, totalExpenses };
    });

    return NextResponse.json(groupsWithBalances);
  } catch (error) {
    console.error("GET Groups Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, members } = body; // members = Array of names e.g. ["Me", "John", "Alice"]

    if (!name || !members || !Array.isArray(members) || members.length < 2) {
      return new NextResponse("Group must have a name and at least 2 members", { status: 400 });
    }

    const group = await prisma.group.create({
      data: {
        userId: parseInt(session.user.id),
        name,
        members: {
          create: members.map(memberName => ({ name: memberName }))
        }
      },
      include: { members: true }
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("POST Group Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
