import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_SIGNING_SECRET);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reqHeaders = await headers();
    const signature = reqHeaders.get("resend-signature") || "";

    console.log("Webhook received:", body);

    const eventPayload = resend.webhooks.verify({
      payload: body,
      headers: {
        signature,
        id: reqHeaders.get("resend-id") || "",
        timestamp: reqHeaders.get("resend-timestamp") || ""
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET || ""
    });

    const type = eventPayload.type;

    await prisma.emailEvent.upsert({
      where: {
        emailId: body.email_id,
        id: body.email_id
      },
      create: {
        emailId: body.email_id,
        type,
        payload: body,
        recipient: body.data?.to?.[0] ?? null,
        subject: body?.data?.subject ?? null
      },
      update: {
        type: body.type,
        payload: body
      }
    });

    switch (body.type) {
      case "email.delivered":
        await prisma.emailEvent.updateMany({
          where: {
            emailId:
              body.data.email_id
          },
          data: {
            deliveredAt: new Date()
          }
        });

        break;

      case "email.sent":
        await prisma.emailEvent.updateMany({
          where: {
            emailId: body.data.email_id
          },
          data: {
            createdAt: new Date()
          }
        });

        break;

      case "email.bounced":
        await prisma.emailEvent.updateMany({
          where: {
            emailId:
              body.data.email_id
          },
          data: {
            bouncedAt:
              new Date(),
          },
        });

        break;

      case "email.failed":
        await prisma.emailEvent.updateMany({
          where: {
            emailId:
              body.data.email_id
          },
          data: {
            failedAt:
              new Date(),
          },
        });

        break;
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}