import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(req, props) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const entryId = parseInt(params.id);
    const body = await req.json();
    
    const existing = await prisma.borrowLendEntry.findUnique({ where: { id: entryId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Special action for recording a repayment
    if (body.action === 'REPAY') {
      const repayAmount = parseFloat(body.amount);
      if (isNaN(repayAmount) || repayAmount <= 0) {
        return new NextResponse("Invalid repay amount", { status: 400 });
      }

      const newOutstanding = Math.max(0, existing.outstandingAmount - repayAmount);
      let newStatus = existing.status;
      
      if (newOutstanding === 0) {
        newStatus = 'settled';
      } else if (newOutstanding < existing.principalAmount) {
        newStatus = 'partial';
      }

      const updated = await prisma.borrowLendEntry.update({
        where: { id: entryId },
        data: { 
          outstandingAmount: newOutstanding,
          status: newStatus
        }
      });
      return NextResponse.json(updated);
    }

    // Default update
    const updated = await prisma.borrowLendEntry.update({
      where: { id: entryId },
      data: { ...body }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH BorrowLend Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const entryId = parseInt(params.id);
    
    const existing = await prisma.borrowLendEntry.findUnique({ where: { id: entryId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.borrowLendEntry.delete({
      where: { id: entryId }
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE BorrowLend Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
