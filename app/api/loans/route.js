import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const loans = await prisma.loan.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error("GET Loans Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { lenderName, type, principal, rate, emiAmount, startDate, endDate, dueDay } = body;

    if (!lenderName || !type || !principal || !emiAmount || !startDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const loan = await prisma.loan.create({
      data: {
        userId: parseInt(session.user.id),
        lenderName,
        type,
        principal: parseFloat(principal),
        rate: parseFloat(rate) || 0,
        emiAmount: parseFloat(emiAmount),
        remainingPrincipal: parseFloat(principal), // Initially matches principal
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        dueDay: dueDay ? parseInt(dueDay) : null,
        status: "active"
      }
    });

    return NextResponse.json(loan);
  } catch (error) {
    console.error("POST Loan Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
