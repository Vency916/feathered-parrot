import { NextResponse } from "next/server";
import { getReceivedEmails, logReceivedEmail } from "@/lib/dataStore";

export async function GET() {
  try {
    const emails = await getReceivedEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error("Failed to fetch received emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromEmail, fromName, toEmail, subject, message, source, category } = body;

    if (!fromEmail || !subject || !message) {
      return NextResponse.json(
        { error: "fromEmail, subject, and message are required" },
        { status: 400 }
      );
    }

    const email = await logReceivedEmail({
      fromEmail,
      fromName: fromName || fromEmail.split("@")[0],
      toEmail: toEmail || "adoptions@fhpra.org",
      subject,
      message,
      status: "Unread",
      source: source || "Contact Form",
      category: category || "General",
    });

    return NextResponse.json({ success: true, email }, { status: 201 });
  } catch (error) {
    console.error("Failed to log received email:", error);
    return NextResponse.json({ error: "Failed to record email" }, { status: 500 });
  }
}
