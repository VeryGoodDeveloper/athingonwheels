import { NextResponse } from "next/server";

/**
 * POST /api/sell
 * Handle sell/trade form submissions
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone" },
        { status: 400 }
      );
    }

    // Validate vehicle info (either VIN or manual entry)
    if (!data.vin && !data.licensePlate && (!data.make || !data.model || !data.year)) {
      return NextResponse.json(
        { error: "Please provide either VIN/License Plate or vehicle details (make, model, year)" },
        { status: 400 }
      );
    }

    // Build email content
    const emailContent = buildEmailContent(data);

    // TODO: Send email notification
    // Option 1: Use Resend, SendGrid, or similar email service
    // Option 2: Use nodemailer with SMTP
    // Option 3: Store in database and notify via webhook
    
    // For now, log the submission
    console.log("Sell form submission:", {
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      vehicle: data.vin || `${data.year} ${data.make} ${data.model}`,
    });

    // Simulate email sending
    const emailSent = await sendEmail({
      to: process.env.SALES_EMAIL || "sales@athingonwheels.com",
      subject: "New Vehicle Inquiry - ATOW",
      content: emailContent,
      data,
    });

    if (!emailSent) {
      console.error("Failed to send email notification");
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll contact you within 24 hours with an offer.",
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sell form error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Build email content from form data
 */
function buildEmailContent(data: any): string {
  const lines = [
    "=== New Sell/Trade Inquiry ===",
    "",
    "VEHICLE INFORMATION:",
  ];

  if (data.vin) {
    lines.push(`VIN: ${data.vin}`);
  } else if (data.licensePlate) {
    lines.push(`License Plate: ${data.licensePlate}`);
  } else {
    lines.push(`Make: ${data.make}`);
    lines.push(`Model: ${data.model}`);
    lines.push(`Year: ${data.year}`);
    if (data.mileage) lines.push(`Mileage: ${data.mileage}`);
  }

  lines.push("");
  lines.push("CUSTOMER INFORMATION:");
  lines.push(`Name: ${data.name}`);
  lines.push(`Email: ${data.email}`);
  lines.push(`Phone: ${data.phone}`);
  
  lines.push("");
  lines.push(`Trade-In Interest: ${data.tradeIn ? "Yes" : "No"}`);

  if (data.comments) {
    lines.push("");
    lines.push("ADDITIONAL COMMENTS:");
    lines.push(data.comments);
  }

  lines.push("");
  lines.push("---");
  lines.push(`Submitted: ${new Date().toLocaleString()}`);
  lines.push(`Source: athingonwheels.com`);

  return lines.join("\n");
}

/**
 * Send email notification
 * TODO: Implement actual email sending with your preferred provider
 */
async function sendEmail(params: {
  to: string;
  subject: string;
  content: string;
  data: any;
}): Promise<boolean> {
  // Option 1: Resend (recommended)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || "noreply@athingonwheels.com",
          to: params.to,
          subject: params.subject,
          text: params.content,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Resend email error:", error);
      return false;
    }
  }

  // Option 2: SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: params.to }] }],
          from: { email: process.env.FROM_EMAIL || "noreply@athingonwheels.com" },
          subject: params.subject,
          content: [{ type: "text/plain", value: params.content }],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("SendGrid email error:", error);
      return false;
    }
  }

  // Option 3: Webhook (forward to external service)
  if (process.env.WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sell_inquiry",
          data: params.data,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Webhook error:", error);
      return false;
    }
  }

  // No email service configured
  console.warn("No email service configured. Set RESEND_API_KEY, SENDGRID_API_KEY, or WEBHOOK_URL");
  return false;
}
