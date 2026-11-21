import { NextResponse } from "next/server";
import { logReceivedEmail } from "@/lib/dataStore";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Check if it's a Resend webhook event (type: "email.received" or similar)
    const emailData = payload.data || payload;

    const from = emailData.from || payload.from || "unknown@sender.com";
    const to = Array.isArray(emailData.to) ? emailData.to.join(", ") : (emailData.to || "adoptions@fhpra.org");
    const subject = emailData.subject || payload.subject || "No Subject";
    const message = emailData.text || emailData.html || payload.text || payload.message || "Empty message body";

    // Extract name from "Name <email@example.com>" if present
    let fromEmail = from;
    let fromName: string | undefined = undefined;
    const match = from.match(/^(.*?)\s*<(.+?)>$/);
    if (match) {
      fromName = match[1].replace(/["']/g, "").trim();
      fromEmail = match[2].trim();
    }

    const recorded = await logReceivedEmail({
      fromEmail,
      fromName: fromName || fromEmail.split("@")[0],
      toEmail: to,
      subject,
      message,
      status: "Unread",
      source: "Inbound Email",
      category: subject.toLowerCase().includes("adopt")
        ? "Adoption Inquiry"
        : subject.toLowerCase().includes("donat")
        ? "Donations"
        : "General",
    });

    return NextResponse.json({ success: true, email: recorded });
  } catch (error) {
    console.error("Inbound webhook processing error:", error);
    return NextResponse.json({ error: "Failed to process inbound webhook" }, { status: 400 });
  }
}
