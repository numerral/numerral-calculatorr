// Root Layout — wraps Header + Footer around all pages

import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import MegaFooter from "@/components/layout/MegaFooter";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Free Online Calculators — Loan, Investment, Tax & More | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "India's smartest calculator platform. 50+ free calculators for loan EMI, SIP returns, income tax, and more.",
  keywords: [
    "EMI calculator", "loan calculator", "SIP calculator", "income tax calculator",
    "home loan EMI", "car loan EMI", "personal loan EMI", "FD calculator",
    "compound interest calculator", "GST calculator", "HRA calculator",
    "mutual fund returns", "PPF calculator", "NPS calculator",
    "financial calculator India", "free online calculator", "Numerral",
    "loan eligibility", "CIBIL score", "tax calculator India",
  ],
  verification: {
    google: "MeU9cYu9W1hGdmNRzzMugVl6RYD6P-77U7R7FS1OpTY",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XVZQHV08SG"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XVZQHV08SG');
          `}
        </Script>
      </head>
      <body className={`${jakarta.className} ${jakarta.variable} ${jetbrains.variable}`}>
        <Header />
        {children}
        <MegaFooter />
      </body>
    </html>
  );
}
