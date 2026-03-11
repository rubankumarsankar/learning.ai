import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const investments = await prisma.investment.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: [
        { status: 'asc' }, // 'active' first
        { startDate: 'desc' }
      ]
    });

    return NextResponse.json(investments);
  } catch (error) {
    console.error("GET Investments Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, provider, type, amount, startDate, maturityDate, expectedReturn } = body;

    if (!name || !type || !amount || !startDate) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const investment = await prisma.investment.create({
      data: {
        userId: parseInt(session.user.id),
        name,
        provider: provider || null,
        type,
        amount: parseFloat(amount),
        startDate: new Date(startDate),
        maturityDate: maturityDate ? new Date(maturityDate) : null,
        expectedReturn: expectedReturn ? parseFloat(expectedReturn) : null,
        status: 'active'
      }
    });

    return NextResponse.json(investment);
  } catch (error) {
    console.error("POST Investment Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
