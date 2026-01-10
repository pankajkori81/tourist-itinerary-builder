// utils/generatePO.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SupplierData, AttractionData } from "./srmStorage";

// 1. Define the Booking Interface (The Transaction Data)
// You will pass this object when you click the button
export interface BookingData {
  bookingRef: string;    // e.g., "TRV-2026-001"
  guestName: string;     // e.g., "Mr. Smith"
  travelDate: string;    // e.g., "2026-01-12"
  pax: number;           // e.g., 2
  status: string;        // e.g., "Confirmed"
}

// 2. Helper to calculate Due Date based on Terms
const calculateDueDate = (terms: string): string => {
  const today = new Date();
  if (terms.includes("30")) today.setDate(today.getDate() + 30);
  else if (terms.includes("15")) today.setDate(today.getDate() + 15);
  else if (terms.includes("7")) today.setDate(today.getDate() + 7);
  // If "Prepaid" or "Pay at Hotel", due date is today or immediate
  return today.toISOString().split('T')[0];
};

// --- THE MAIN FUNCTION ---
export const generatePO = (
  booking: BookingData,
  activity: AttractionData,
  supplier: SupplierData
) => {
  const doc = new jsPDF();

  // --- A. CALCULATIONS ---
  // We sum up your cost fields from Activity Page
  const unitCost = (activity.entranceFee || 0) + (activity.activityFee || 0) + (activity.guideFee || 0);
  const totalCost = unitCost * booking.pax;
  
  // Tax Logic: If Supplier is Tax Registered (from Financials Tab), add 18% (Example)
  // You can adjust this logic based on your specific country rules
  const taxRate = supplier.taxRegistered ? 0.18 : 0; 
  const taxAmount = totalCost * taxRate;
  const grandTotal = totalCost + taxAmount;
  const currency = supplier.currency || "USD"; // From Financials Tab

  // --- B. HEADER SECTION (Travdek Info) ---
  doc.setFontSize(20);
  doc.setTextColor(10, 31, 68); // Travdek Blue
  doc.text("SERVICE ORDER / PO", 140, 20); // Top Right

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Travdek Solutions Pvt. Ltd.", 14, 20);
  doc.text("123 Business Park, Mumbai", 14, 25);
  doc.text("GST/Tax ID: 27AAAAA0000A1Z5", 14, 30); // Your Company Tax ID

  // --- C. METADATA SECTION ---
  doc.setDrawColor(200);
  doc.line(14, 35, 196, 35); // Horizontal Line

  doc.text(`PO Number: ${booking.bookingRef}`, 14, 45);
  doc.text(`Date of Issue: ${new Date().toISOString().split('T')[0]}`, 14, 50);
  doc.text(`Status: ${booking.status}`, 14, 55);

  // --- D. SUPPLIER SECTION (Fetching from Supplier Page) ---
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("TO VENDOR:", 14, 70);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  // [CONNECTIVITY POINT]: Fetching Name & Address from Supplier Storage
  doc.text(supplier.name, 14, 76); 
  doc.text(`${supplier.city}, ${supplier.country}`, 14, 81);
  doc.text(`Attn: ${supplier.contactPerson}`, 14, 86);
  // [CONNECTIVITY POINT]: Fetching Tax ID from Financials Tab
  if (supplier.taxNumber) {
    doc.text(`Tax ID: ${supplier.taxNumber}`, 14, 91);
  }

  // --- E. THE TABLE (The Service Details) ---
  autoTable(doc, {
    startY: 100,
    head: [['Description', 'Travel Date', 'Pax', 'Rate', 'Total']],
    body: [
      [
        `${activity.name} (${activity.type})`, // From Activity Page
        booking.travelDate,
        booking.pax,
        `${currency} ${unitCost.toFixed(2)}`,
        `${currency} ${totalCost.toFixed(2)}`,
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [10, 31, 68] }, // Travdek Blue Header
  });

  // --- F. FINANCIAL SUMMARY ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.text(`Subtotal:`, 140, finalY);
  doc.text(`${currency} ${totalCost.toFixed(2)}`, 170, finalY, { align: "right" });
  
  if (taxAmount > 0) {
    doc.text(`Tax (${taxRate * 100}%):`, 140, finalY + 5);
    doc.text(`${currency} ${taxAmount.toFixed(2)}`, 170, finalY + 5, { align: "right" });
  }

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Grand Total:`, 140, finalY + 15);
  doc.text(`${currency} ${grandTotal.toFixed(2)}`, 170, finalY + 15, { align: "right" });

  // --- G. FOOTER (Payment Terms & Bank Details) ---
  // [CONNECTIVITY POINT]: This is the most crucial part for your "Financials" tab
  doc.setFontSize(10);
  doc.setTextColor(100);
  
  const footerY = 240; // Near bottom of page
  doc.text("PAYMENT INSTRUCTIONS:", 14, footerY);
  
  doc.setFontSize(9);
  doc.setTextColor(50);
  // 1. Payment Terms Logic
  doc.text(`Payment Terms: ${supplier.paymentTerms}`, 14, footerY + 6);
  doc.text(`Due Date: ${calculateDueDate(supplier.paymentTerms)}`, 14, footerY + 11);

  // 2. Bank Details Logic (Only if they exist in Supplier Data)
  if (supplier.bankDetails?.accountNumber) {
      doc.text("Please remit payment to:", 14, footerY + 20);
      doc.text(`Bank Name: ${supplier.bankDetails.bankName}`, 14, footerY + 25);
      doc.text(`Account Name: ${supplier.bankDetails.accountName}`, 14, footerY + 30);
      doc.text(`Account No: ${supplier.bankDetails.accountNumber}`, 14, footerY + 35);
      doc.text(`IFSC/SWIFT: ${supplier.bankDetails.ifscCode}`, 14, footerY + 40);
  } else {
      doc.text("Bank details not on file. Please contact vendor.", 14, footerY + 20);
  }

  // Save the PDF
  doc.save(`PO_${booking.bookingRef}_${supplier.name}.pdf`);
};