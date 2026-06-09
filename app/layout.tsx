// Root Layout — wraps Header + Footer around all pages

import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LocaleAwareShell from "@/components/layout/LocaleAwareShell";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { organizationSchema, webSiteSchema } from "@/lib/seo";


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
    template: `%s`,
  },
  description:
    "Free online calculator platform — 565+ calculators for finance, construction, health, EV, and everyday math. Instant results, transparent formulas, zero data collection.",
  keywords: [
    "online calculator", "financial calculator", "loan calculator", "mortgage calculator",
    "salary calculator", "compound interest calculator", "percentage calculator",
    "construction calculator", "health calculator", "BMI calculator",
    "free online calculator", "Numerral",
  ],
  verification: {
    google: "MeU9cYu9W1hGdmNRzzMugVl6RYD6P-77U7R7FS1OpTY",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3948319670483938"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${jakarta.className} ${jakarta.variable} ${jetbrains.variable}`}>
        {/* Site-level Entity Schemas — Organization + WebSite */}
        <Script
          id="schema-org-entity"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationSchema(SITE_URL),
              webSiteSchema(SITE_URL),
            ]),
          }}
        />
        <LocaleAwareShell>
          {children}
        </LocaleAwareShell>
      </body>
    </html>
  );
}
