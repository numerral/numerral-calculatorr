// Swiss Section Layout — /ch/*
// Uses LTR direction, Inter font, separate header/footer

import type { Metadata } from "next";
import Script from "next/script";
import ChHeader from "@/components/ch/ChHeader";
import ChFooter from "@/components/ch/ChFooter";
import { SITE_URL } from "@/lib/constants";
import "../../globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Hypothekenrechner Schweiz — Kostenlose Finanzrechner | Numerral",
        template: "%s | Numerral Schweiz",
    },
    description:
        "Kostenlose Schweizer Finanzrechner: Hypothekenrechner, Tragbarkeitsrechner, Eigenkapital, Kaufnebenkosten, Belehnung, Amortisation. Berechnen Sie Ihre Hypothek einfach und schnell.",
    openGraph: {
        type: "website",
        siteName: "Numerral",
        locale: "de_CH",
    },
};

export default function ChLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de-CH" dir="ltr">
            <head>
                {/* Google Analytics GA4 */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-XVZQHV08SG"
                    strategy="afterInteractive"
                />
                <Script id="ga4-init-ch" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-XVZQHV08SG');
                    `}
                </Script>
            </head>
            <body className="ar-body">
                <ChHeader />
                {children}
                <ChFooter />
            </body>
        </html>
    );
}
