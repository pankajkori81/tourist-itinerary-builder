// ══════════════════════════════════════════════════════════════
// FILE: emails/ItineraryShareEmail.tsx
// PURPOSE: Enterprise React Email Template for Itinerary Sharing
// USES: @react-email/components
// ══════════════════════════════════════════════════════════════

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

// ── Types ──────────────────────────────────────────────────────
interface ItineraryShareEmailProps {
  clientName?: string;
  tripName: string;
  countries: string;
  days: number;
  nights: number;
  expiryDate: string;
  shareUrl: string;
}

// ── Default Props for React Email Preview Studio ──────────────
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://travdek.com";

export const ItineraryShareEmail = ({
  clientName = "Valued Client",
  tripName = "Luxury Swiss Alps Retreat",
  countries = "Switzerland, Italy",
  days = 7,
  nights = 6,
  expiryDate = "October 25, 2026",
  shareUrl = `${baseUrl}/view/preview-token-123`,
}: ItineraryShareEmailProps) => {
  const greeting = clientName ? `Hi ${clientName},` : "Hi there,";

  return (
    <Html>
      <Head />
      <Preview>Your personalized itinerary for {tripName} is ready to review!</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* ── HEADER ── */}
          <Section style={header}>
            <Text style={headerTitle}>TRAVDEK</Text>
            <Text style={headerSubtitle}>Your Personal Travel Advisor</Text>
          </Section>

          {/* ── CONTENT ── */}
          <Section style={content}>
            <Text style={paragraph}>{greeting}</Text>
            <Text style={paragraph}>
            
                Your personalized travel itinerary is ready to review. We have organized all the arrangements so you can simply review the plan and look forward to your trip.
            </Text>

      

            {/* ── TRIP CARD ── */}
            <Section style={tripCard}>
              <Text style={tripCardEyebrow}>YOUR TRIP</Text>
              <Text style={tripCardTitle}>{tripName}</Text>
              
              {countries && (
                <Text style={tripCardDetail}>
                  📍 <strong>{countries}</strong>
                </Text>
              )}
              
              {days > 1 && (
                <Text style={tripCardDetail}>
                  📅 <strong>{days} Days | {nights} Nights</strong>
                </Text>
              )}
              
              <Text style={expiryText}>
                ⏰ Link valid until <strong>{expiryDate}</strong>
              </Text>
            </Section>

            {/* ── CTA BUTTON ── */}
            <Section style={buttonContainer}>
              <Button style={button} href={shareUrl}>
                View Your Itinerary →
              </Button>
            </Section>

            <Text style={fallbackText}>
              Or copy and paste this link into your browser: <br />
              <Link href={shareUrl} style={fallbackLink}>{shareUrl}</Link>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* ── FOOTER ── */}
          <Section style={footer}>
            <Text style={footerText}>Questions? Reply to this email or contact us:</Text>
            <Text style={footerContact}>Sandeep@TravDek.com &nbsp;|&nbsp; +1 650 759 4331</Text>
            <Text style={copyright}>© {new Date().getFullYear()} Travdek · Official B2B Travel Network</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default ItineraryShareEmail;

// ── STYLES ─────────────────────────────────────────────────────
// React Email uses inline styles. These are optimized for email clients.
const main = {
  backgroundColor: "#f0f4ff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#1d4ed8",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "-0.5px",
  margin: "0",
};

const headerSubtitle = {
  color: "#bfdbfe",
  fontSize: "13px",
  margin: "4px 0 0",
};

const content = {
  padding: "40px",
};

const paragraph = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const tripCard = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "32px",
  marginTop: "16px",
};

const tripCardEyebrow = {
  color: "#1d4ed8",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 8px",
};

const tripCardTitle = {
  color: "#0f172a",
  fontSize: "22px",
  fontWeight: "900",
  margin: "0 0 16px",
};

const tripCardDetail = {
  color: "#475569",
  fontSize: "14px",
  margin: "0 0 8px",
};

const expiryText = {
  color: "#64748b",
  fontSize: "13px",
  margin: "16px 0 0",
  paddingTop: "16px",
  borderTop: "1px solid #dbeafe",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1d4ed8",
  color: "#ffffff",
  padding: "16px 40px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
};

const fallbackText = {
  color: "#94a3b8",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "24px",
  wordBreak: "break-all" as const,
};

const fallbackLink = {
  color: "#1d4ed8",
  textDecoration: "underline",
};

const divider = {
  borderColor: "#e2e8f0",
  margin: "0",
};

const footer = {
  padding: "24px 40px",
  textAlign: "center" as const,
  backgroundColor: "#f8fafc",
};

const footerText = {
  color: "#64748b",
  fontSize: "13px",
  margin: "0 0 4px",
};

const footerContact = {
  color: "#1d4ed8",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0",
};

const copyright = {
  color: "#94a3b8",
  fontSize: "11px",
  margin: "16px 0 0",
};