import { NextResponse } from "next/server";
import { sendAdminEmail } from "@/lib/emailService";
import { getSentEmails } from "@/lib/dataStore";

export async function GET() {
  const emails = await getSentEmails();
  return NextResponse.json(emails);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientEmail, recipientName, subject, message, templateUsed } = body;

    if (!recipientEmail || !subject || !message) {
      return NextResponse.json(
        { error: "recipientEmail, subject, and message are required" },
        { status: 400 }
      );
    }

    const result = await sendAdminEmail({
      recipientEmail,
      recipientName,
      subject,
      message,
      templateUsed,
    });

    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to dispatch email";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
