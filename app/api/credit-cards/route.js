import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const cards = await prisma.creditCard.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        cardTransactions: {
          where: { status: { not: "paid" } }
        },
        cardEmis: {
          where: { status: "active" }
        },
        linkedPaymentAccount: true
      },
      orderBy: { createdAt: "desc" }
    });

    // Calculate outstanding balance per card
    const enhancedCards = cards.map(card => {
      const transactionsTotal = card.cardTransactions.reduce((sum, t) => sum + t.amount, 0);
      const currentMonthEmiTotal = card.cardEmis.reduce((sum, emi) => sum + emi.emiAmount, 0);
      
      const outstandingBalance = transactionsTotal + currentMonthEmiTotal;
      const utilizationPercent = card.creditLimit > 0 
        ? ((outstandingBalance / card.creditLimit) * 100).toFixed(1) 
        : 0;

      return {
        ...card,
        outstandingBalance,
        utilizationPercent: parseFloat(utilizationPercent)
      };
    });

    return NextResponse.json(enhancedCards);
  } catch (error) {
    console.error("GET Credit Cards Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, issuer, creditLimit, billingDay, dueDay, linkedPaymentAccountId, annualFee } = body;

    // Validate
    if (!name || !creditLimit || !billingDay || !dueDay) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const card = await prisma.creditCard.create({
      data: {
        userId: parseInt(session.user.id),
        name,
        issuer: issuer || null,
        creditLimit: parseFloat(creditLimit),
        billingDay: parseInt(billingDay),
        dueDay: parseInt(dueDay),
        linkedPaymentAccountId: linkedPaymentAccountId ? parseInt(linkedPaymentAccountId) : null,
        annualFee: annualFee ? parseFloat(annualFee) : 0,
      }
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("POST Credit Card Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
