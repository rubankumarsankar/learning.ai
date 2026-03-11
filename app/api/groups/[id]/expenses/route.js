import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req, props) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const groupId = parseInt(params.id);
    const body = await req.json();
    const { title, totalAmount, paidByMemberId, expenseDate } = body;

    if (!title || !totalAmount || !paidByMemberId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const parsedPaidByMemberId = parseInt(paidByMemberId);

    // Verify group belongs to user and get members
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true }
    });

    if (!group || group.userId !== parseInt(session.user.id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Calculate equal split
    const memberCount = group.members.length;
    const splitAmount = parseFloat(totalAmount) / memberCount;

    // Create Expense and Shares in transaction
    const expense = await prisma.$transaction(async (tx) => {
      // 1. Create the main expense
      const newExpense = await tx.groupExpense.create({
        data: {
          groupId,
          paidByMemberId: parsedPaidByMemberId,
          title,
          totalAmount: parseFloat(totalAmount),
          expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
          splitType: 'equal' // Hardcoded for MVP
        }
      });

      // 2. Create shares
      const sharesData = group.members.map(member => ({
        groupExpenseId: newExpense.id,
        memberId: member.id,
        shareAmount: splitAmount,
        // The person who paid is already "settled" for their own share
        settledAmount: member.id === parsedPaidByMemberId ? splitAmount : 0
      }));

      await tx.groupExpenseShare.createMany({
        data: sharesData
      });

      return newExpense;
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("POST Group Expense Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
