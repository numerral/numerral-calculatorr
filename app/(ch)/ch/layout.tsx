// Swiss Section Layout — /ch/*
// Uses LTR direction, separate header/footer

import type { Metadata } from "next";
import Script from "next/script";
import ChHeader from "@/components/ch/ChHeader";
import ChFooter from "@/components/ch/ChFooter";
import { SITE_URL } from "@/lib/constants";

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
        <div lang="de-CH" dir="ltr">
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
            <ChHeader />
            {children}
            <ChFooter />
        </div>
    );
}
