import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const loanId = parseInt(params.id);
    
    // Verify ownership
    const existing = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.loan.delete({
      where: { id: loanId }
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE Loan Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req, props) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const loanId = parseInt(params.id);
    const body = await req.json();
    
    // Verify ownership
    const existing = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Special action for recording a payment
    if (body.action === 'PAY_EMI') {
      const newRemaining = Math.max(0, existing.remainingPrincipal - (body.principalComponent || existing.emiAmount));
      const newStatus = newRemaining === 0 ? "closed" : existing.status;

      const updated = await prisma.loan.update({
        where: { id: loanId },
        data: { 
          remainingPrincipal: newRemaining,
          status: newStatus
        }
      });
      return NextResponse.json(updated);
    }

    // Default update
    const updated = await prisma.loan.update({
      where: { id: loanId },
      data: { ...body }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH Loan Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
