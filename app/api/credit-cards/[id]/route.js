import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(req, props) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const cardId = parseInt(params.id);
    const body = await req.json();
    
    // Verify ownership
    const existing = await prisma.creditCard.findUnique({ where: { id: cardId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updated = await prisma.creditCard.update({
      where: { id: cardId },
      data: {
        ...body,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH Credit Card Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const cardId = parseInt(params.id);
    
    // Verify ownership
    const existing = await prisma.creditCard.findUnique({ where: { id: cardId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.creditCard.delete({
      where: { id: cardId }
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE Credit Card Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
