/**
 * Email utility using nodemailer
 * Supports multiple email services (Gmail, SendGrid, Resend, SMTP)
 */

import nodemailer from "nodemailer";

interface EmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

/**
 * Create email transporter based on available environment variables
 */
function createTransporter() {
  // Option 1: Gmail with app password
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Option 2: Custom SMTP
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD || "",
          }
        : undefined,
    });
  }

  // Option 3: SendGrid SMTP
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // Development fallback: Log emails instead of sending
  console.warn("No email service configured. Emails will be logged to console.");
  return nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const fromEmail = options.from || process.env.FROM_EMAIL || "noreply@athingonwheels.com";
    const toEmails = Array.isArray(options.to) ? options.to : [options.to];

    const info = await transporter.sendMail({
      from: `ATOW <${fromEmail}>`,
      to: toEmails.join(", "),
      subject: options.subject,
      text: options.text,
      html: options.html || options.text.replace(/\n/g, "<br>"),
    });

    // If using streamTransport (dev mode), log the email
    if (!process.env.GMAIL_USER && !process.env.SMTP_HOST && !process.env.SENDGRID_API_KEY) {
      console.log("📧 Email (DEV MODE - not actually sent):");
      console.log("To:", toEmails.join(", "));
      console.log("Subject:", options.subject);
      console.log("---");
      console.log(options.text);
      console.log("---");
      return true;
    }

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email send error:", error);
    return false;
  }
}

/**
 * Send vehicle inquiry notification
 */
export async function sendInquiryEmail(data: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  vehicleName: string;
  vehiclePrice: number;
  vehicleSlug: string;
}): Promise<boolean> {
  const recipient = process.env.SALES_EMAIL || "sales@jsautohaus.com";

  const text = `
New Vehicle Inquiry - ATOW

VEHICLE:
${data.vehicleName}
Price: $${data.vehiclePrice.toLocaleString()}
Link: https://athingonwheels.com/shop/${data.vehicleSlug}

CUSTOMER:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

${data.message ? `MESSAGE:\n${data.message}\n` : ""}
---
Submitted: ${new Date().toLocaleString()}
Source: athingonwheels.com
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { margin-bottom: 25px; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .vehicle { background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #667eea; }
    .customer { background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #764ba2; }
    .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Vehicle Inquiry</h1>
    </div>
    <div class="content">
      <div class="vehicle">
        <h2>Vehicle Details</h2>
        <p><span class="label">Model:</span> ${data.vehicleName}</p>
        <p><span class="label">Price:</span> $${data.vehiclePrice.toLocaleString()}</p>
        <p><span class="label">View:</span> <a href="https://athingonwheels.com/shop/${data.vehicleSlug}">athingonwheels.com/shop/${data.vehicleSlug}</a></p>
      </div>
      
      <div class="customer">
        <h2>Customer Information</h2>
        <p><span class="label">Name:</span> ${data.name}</p>
        <p><span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><span class="label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a></p>
      </div>
      
      ${
        data.message
          ? `
      <div class="section">
        <h3>Customer Message</h3>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      </div>
      `
          : ""
      }
      
      <div class="footer">
        <p>Submitted: ${new Date().toLocaleString()}</p>
        <p>Source: athingonwheels.com</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: recipient,
    subject: `Vehicle Inquiry: ${data.vehicleName}`,
    text,
    html,
  });
}

/**
 * Send sell/trade inquiry notification
 */
export async function sendSellInquiryEmail(data: {
  name: string;
  email: string;
  phone: string;
  vin?: string;
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  comments?: string;
  tradeIn: boolean;
}): Promise<boolean> {
  const recipient = process.env.SALES_EMAIL || "sales@jsautohaus.com";

  const vehicleInfo = data.vin
    ? `VIN: ${data.vin}`
    : data.licensePlate
    ? `License Plate: ${data.licensePlate}`
    : `${data.year || "N/A"} ${data.make || "N/A"} ${data.model || "N/A"}`;

  const text = `
New ${data.tradeIn ? "Trade-In" : "Vehicle Sale"} Inquiry - ATOW

VEHICLE:
${vehicleInfo}
${data.mileage ? `Mileage: ${data.mileage.toLocaleString()} mi` : ""}

CUSTOMER:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Type: ${data.tradeIn ? "Trade-In" : "Straight Sale"}

${data.comments ? `COMMENTS:\n${data.comments}\n` : ""}
---
Submitted: ${new Date().toLocaleString()}
Source: athingonwheels.com
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { margin-bottom: 25px; }
    .label { font-weight: bold; color: #555; }
    .badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
    .badge-trade { background: #fbbf24; color: #92400e; }
    .badge-sale { background: #10b981; color: #065f46; }
    .vehicle { background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #667eea; }
    .customer { background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #764ba2; }
    .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New ${data.tradeIn ? "Trade-In" : "Sale"} Inquiry</h1>
      <span class="badge ${data.tradeIn ? "badge-trade" : "badge-sale"}">
        ${data.tradeIn ? "Trade-In Request" : "Direct Sale"}
      </span>
    </div>
    <div class="content">
      <div class="vehicle">
        <h2>Vehicle Information</h2>
        <p>${vehicleInfo}</p>
        ${data.mileage ? `<p><span class="label">Mileage:</span> ${data.mileage.toLocaleString()} mi</p>` : ""}
      </div>
      
      <div class="customer">
        <h2>Customer Information</h2>
        <p><span class="label">Name:</span> ${data.name}</p>
        <p><span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><span class="label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a></p>
      </div>
      
      ${
        data.comments
          ? `
      <div class="section">
        <h3>Additional Comments</h3>
        <p>${data.comments.replace(/\n/g, "<br>")}</p>
      </div>
      `
          : ""
      }
      
      <div class="footer">
        <p>Submitted: ${new Date().toLocaleString()}</p>
        <p>Source: athingonwheels.com</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: recipient,
    subject: `${data.tradeIn ? "Trade-In" : "Sale"} Inquiry: ${vehicleInfo}`,
    text,
    html,
  });
}
