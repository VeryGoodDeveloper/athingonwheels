import { NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/email";

/**
 * POST /api/inquiry
 * Handle vehicle inquiry form submissions
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const errors: string[] = [];
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push("Name is required");
    }
    
    if (!data.email || !isValidEmail(data.email)) {
      errors.push("Valid email is required");
    }
    
    if (!data.phone || data.phone.trim().length === 0) {
      errors.push("Phone number is required");
    }
    
    if (!data.vehicleName) {
      errors.push("Vehicle information is missing");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: errors.join(", "),
          errors 
        },
        { status: 400 }
      );
    }

    // Send email notification
    const emailSent = await sendInquiryEmail({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message?.trim(),
      vehicleName: data.vehicleName,
      vehiclePrice: data.vehiclePrice || 0,
      vehicleSlug: data.vehicleSlug || "",
    });

    if (!emailSent) {
      console.error("Failed to send inquiry email notification");
      // Don't fail the request - still record the inquiry
    }

    // Log the inquiry for tracking
    console.log("📝 Vehicle Inquiry:", {
      timestamp: new Date().toISOString(),
      customer: data.name,
      email: data.email,
      vehicle: data.vehicleName,
      emailSent,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll contact you within 24 hours.",
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Inquiry form error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to process your request. Please try again or call us directly." 
      },
      { status: 500 }
    );
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
