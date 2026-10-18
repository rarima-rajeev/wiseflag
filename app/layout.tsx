import type { Metadata } from "next";
import DisclaimerStrip from "@/components/DisclaimerStrip";
import Footer from "@/components/Footer";
import PostHogInit from "@/components/PostHogInit";
import { PRODUCT_NAME } from "@/config/cards";
import "./globals.css";

export const metadata: Metadata = {
  title: `${PRODUCT_NAME} - Vaccine Report Triage`,
  description:
    "Human-in-the-loop AI triage of COVID-19 vaccine adverse event reports. Statistics find it. AI explains it. A human decides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 antialiased font-sans">
        <PostHogInit />
        <DisclaimerStrip />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
