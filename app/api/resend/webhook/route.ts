import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook received:", body);

    await prisma.emailEvent.create({
      data: {
        emailId: body.data?.email_id ?? null,
        type: body.type,
        payload: body,
        recipient: body.data?.to?.[0] ?? null,
        subject: body.data?.subject
      }
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}