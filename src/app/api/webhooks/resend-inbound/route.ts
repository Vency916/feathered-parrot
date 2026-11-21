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
    let message =
      emailData.text ||
      emailData.html ||
      emailData.body ||
      emailData.content ||
      emailData.snippet ||
      payload.text ||
      payload.html ||
      payload.message ||
      "";

    const emailId = emailData.email_id || emailData.id || payload.email_id || payload.id;

    if (!message && emailId && process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        // 1. In Resend SDK, inbound emails are fetched via receiving.get()
        if (resend.emails?.receiving?.get) {
          const receivingDetails = await resend.emails.receiving.get(emailId);
          if (receivingDetails?.data) {
            message = receivingDetails.data.text || receivingDetails.data.html || "";
          }
        }

        // 2. Fallback to standard emails.get()
        if (!message && resend.emails?.get) {
          const emailDetails = await resend.emails.get(emailId);
          if (emailDetails?.data) {
            const data = emailDetails.data as any;
            message = data.text || data.html || data.snippet || "";
          }
        }
      } catch (fetchErr) {
        console.warn("Could not fetch full email content from Resend API:", fetchErr);
      }
    }

    if (!message) {
      if (!process.env.RESEND_API_KEY) {
        message = "Email received successfully, but RESEND_API_KEY is not configured in Vercel Environment Variables. Add RESEND_API_KEY to Vercel so the server can automatically fetch the full email body from Resend.";
      } else {
        message = "(No text content in received email)";
      }
    }

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
