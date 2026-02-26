import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Resend } from 'resend';
import twilio from 'twilio';

// 1. Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 3. Initialize Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // We get all the data from your new frontend Modal here
    const { clientName, clientEmail, clientPhone, pdfBase64, tripName, sendEmail, sendWhatsapp } = body;

    // if (!pdfBase64) {
    //   return NextResponse.json({ success: false, message: "PDF data is missing" }, { status: 400 });
    // }

    // const cleanTripName = tripName ? tripName.replace(/\s+/g, '_') : 'Custom_Itinerary';

    // // ==========================================
    // // STEP 1: UPLOAD TO CLOUDINARY (Always runs)
    // // ==========================================
    // // Cloudinary turns the Base64 string into a public, secure URL
    // const uploadResponse = await cloudinary.uploader.upload(pdfBase64, {
    //   resource_type: 'raw', // 'raw' is required for PDF files
    //   folder: 'travdek_itineraries',
    //   public_id: `${cleanTripName}_${Date.now()}` 
    // });


    if (!pdfBase64) {
      return NextResponse.json({ success: false, message: "PDF data is missing" }, { status: 400 });
    }

    const cleanTripName = tripName ? tripName.replace(/\s+/g, '_') : 'Custom_Itinerary';

    // 👇 FIX: Clean the string so Cloudinary doesn't crash
    const rawBase64Data = pdfBase64.split(',')[1] || pdfBase64;
    const cloudinaryReadyString = `data:application/pdf;base64,${rawBase64Data}`;

    // ==========================================
    // STEP 1: UPLOAD TO CLOUDINARY (Always runs)
    // ==========================================
    const uploadResponse = await cloudinary.uploader.upload(cloudinaryReadyString, {
      resource_type: 'raw', 
      folder: 'travdek_itineraries',
      public_id: `${cleanTripName}_${Date.now()}` 
    });
    
    const publicPdfUrl = uploadResponse.secure_url;

    // ==========================================
    // STEP 2: SEND EMAIL (If checkbox was checked)
    // ==========================================
    let emailStatus = "Not requested";
    // if (sendEmail && clientEmail) {
    //   const base64Data = pdfBase64.split(',')[1] || pdfBase64;
    //   const pdfBuffer = Buffer.from(base64Data, 'base64');

    if (sendEmail && clientEmail) {
      const pdfBuffer = Buffer.from(rawBase64Data, 'base64');

      const { error } = await resend.emails.send({
        from: 'Travdek <onboarding@resend.dev>', // Keep onboarding@resend.dev until domain is verified
        to: [clientEmail],
        subject: `Your Travel Itinerary: ${tripName || 'Luxury Getaway'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2>Hi ${clientName || 'Traveler'},</h2>
              <p>Thank you for choosing Travdek to plan your next adventure.</p>
              <p>Please find your detailed, day-by-day custom itinerary attached to this email. You can also view and download it securely using the link below:</p>
              <p><a href="${publicPdfUrl}" target="_blank" style="color: #1d4ed8; font-weight: bold;">View Itinerary Online</a></p>
              <br/>
              <p>Warm regards,<br/><strong>The Travdek Team</strong></p>
          </div>
        `,
        attachments: [
          {
            filename: `${cleanTripName}.pdf`,
            content: pdfBuffer, // The actual physical file attached to the email
          },
        ],
      });
      emailStatus = error ? `Failed: ${error.message}` : "Success";
    }

    // ==========================================
    // STEP 3: SEND WHATSAPP (If checkbox was checked)
    // ==========================================
    let whatsappStatus = "Not requested";
    if (sendWhatsapp && clientPhone) {
      // Twilio requires the number to start with a '+'
      const formattedPhone = clientPhone.startsWith('+') ? clientPhone : `+${clientPhone}`;

      try {
        await twilioClient.messages.create({
          // The WhatsApp message text includes the Cloudinary link generated in Step 1
          body: `Hi ${clientName || 'there'}!\n\nYour  itinerary for *${tripName || 'your upcoming trip'}* is ready. ✈️\n\nClick the link below to view and download your secure PDF:\n${publicPdfUrl}\n\nWarm regards,\n*The Travdek Team*`,
          from: `whatsapp:${twilioNumber}`,
          to: `whatsapp:${formattedPhone}`
        });
        whatsappStatus = "Success";
      } catch (waError: any) {
        whatsappStatus = `Failed: ${waError.message}`;
        console.error("Twilio Error Details:", waError);
      }
    }

    // Return the final result to your Frontend Toast Notification
    return NextResponse.json({ 
      success: true, 
      message: "Processing complete",
      details: { 
          pdfUrl: publicPdfUrl, 
          email: emailStatus, 
          whatsapp: whatsappStatus 
      }
    });

  } catch (error: any) {
    console.error("Master Share API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}