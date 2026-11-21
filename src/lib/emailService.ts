import { Resend } from "resend";
import { logSentEmail } from "./dataStore";
import { EMAIL_TEMPLATES } from "./emailTemplates";

export { EMAIL_TEMPLATES };

export interface SendEmailParams {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  message: string;
  templateUsed?: string;
}

export async function sendAdminEmail(params: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  let deliveryStatus: "Sent" | "Delivered" | "Simulated (No API Key)" = "Simulated (No API Key)";
  let errorDetails: string | null = null;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const fromEmail = process.env.EMAIL_FROM || "Feathered Haven <onboarding@resend.dev>";

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fdfbf7; border: 1px solid #efe7d3; border-radius: 8px; overflow: hidden;">
          <div style="background: #1b4332; color: #fdfbf7; padding: 20px 24px;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">Feathered Haven Parrot Rescue</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.85;">Parrot Rescue, Rehabilitation & Adoption</p>
          </div>
          <div style="padding: 24px; color: #1b4332; font-size: 15px; line-height: 1.6;">
            ${params.message.replace(/\n/g, "<br/>")}
          </div>
          <div style="background: #f7f3e8; padding: 16px 24px; font-size: 12px; color: #666; border-top: 1px solid #efe7d3;">
            <p style="margin: 0;">Feathered Haven Parrot Rescue & Adoption • Dedicated to Ethical Avian Care</p>
            <p style="margin: 4px 0 0 0;">This email was sent by an administrator from the Feathered Haven Sanctuary Admin Portal.</p>
          </div>
        </div>
      `;

      const response = await resend.emails.send({
        from: fromEmail,
        to: [params.recipientEmail],
        subject: params.subject,
        text: params.message,
        html: htmlBody,
      });

      if (response.error) {
        errorDetails = response.error.message;
        deliveryStatus = "Simulated (No API Key)";
      } else {
        deliveryStatus = "Sent";
      }
    } catch (err: unknown) {
      errorDetails = err instanceof Error ? err.message : String(err);
      deliveryStatus = "Simulated (No API Key)";
    }
  }

  // Record in dataStore
  const log = await logSentEmail({
    recipientEmail: params.recipientEmail,
    recipientName: params.recipientName,
    subject: params.subject,
    message: params.message,
    templateUsed: params.templateUsed,
    status: deliveryStatus,
  });

  return {
    success: true,
    log,
    isRealDelivery: deliveryStatus === "Sent",
    note: apiKey
      ? (errorDetails ? `Attempted delivery via Resend: ${errorDetails}` : "Delivered via Resend")
      : "Simulated delivery recorded in admin log. To send real emails in production, set RESEND_API_KEY in your Vercel Environment Variables.",
  };
}
