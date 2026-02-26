// import { NextRequest, NextResponse } from 'next/server';
// import { Resend } from 'resend';

// // Initialize Resend with your API key from .env.local
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { toEmail, clientName, pdfBase64, tripName } = body;

//     if (!toEmail || !pdfBase64) {
//       return NextResponse.json(
//         { success: false, message: "Missing required fields (Email or PDF)" }, 
//         { status: 400 }
//       );
//     }

//     // Convert the Base64 string back into a Buffer so Resend can attach it
//     const base64Data = pdfBase64.split(',')[1] || pdfBase64;
//     const pdfBuffer = Buffer.from(base64Data, 'base64');

//     // Clean up the trip name for the filename (removes spaces, e.g., "Italy_Tour.pdf")
//     const cleanTripName = tripName ? tripName.replace(/\s+/g, '_') : 'Custom_Itinerary';

//     // Send the email using Resend
//     const { data, error } = await resend.emails.send({
//       from: 'Travdek <onboarding@resend.dev>', // Keep onboarding@resend.dev until you verify your domain
//       to: [toEmail],
//       subject: `Your Travel Itinerary: ${tripName || 'Luxury Getaway'}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
//             <h2>Hi ${clientName || 'Traveler'},</h2>
//             <p>Thank you for choosing Travdek to plan your next adventure.</p>
//             <p>Please find your detailed, day-by-day itinerary attached to this email. Take a look at the planned activities, stays, and transport arrangements.</p>
//             <p>If you have any questions or would like to make any adjustments to this plan, please feel free to reply directly to this email.</p>
//             <br/>
//             <p>Best regards,<br/><strong>The Travdek Team</strong></p>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: `${cleanTripName}.pdf`, // Output: e.g. Italy_Tour.pdf
//           content: pdfBuffer,
//         },
//       ],
//     });

//     if (error) {
//       console.error("Resend Error:", error);
//       return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ success: true, message: "Itinerary emailed successfully!", data });

//   } catch (error: any) {
//     console.error("API Route Error:", error);
//     return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
//   }
// }