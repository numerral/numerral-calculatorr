// German Section Layout — /de/*
import type { Metadata } from "next";
import Script from "next/script";
import DeHeader from "@/components/de/DeHeader";
import DeFooter from "@/components/de/DeFooter";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Rechner Online — Kostenlose Rechner für Gesundheit, Mathe, Finanzen & mehr | Numerral",
        template: "%s | Numerral Deutschland",
    },
    description:
        "35 kostenlose Online-Rechner: BMI, Prozent, Zins, Physik, Statistik und mehr. Sofort berechnen, keine Registrierung.",
    openGraph: {
        type: "website",
        siteName: "Numerral",
        locale: "de_DE",
    },
    // hreflang — tells Google which URL to serve per language/region
    alternates: {
        canonical: `${SITE_URL}/de`,
        languages: {
            "en":    SITE_URL,
            "en-IN": `${SITE_URL}/in`,
            "en-AE": `${SITE_URL}/uae`,
            "en-SA": `${SITE_URL}/ksa`,
            "ar":    `${SITE_URL}/ar`,
            "de":    `${SITE_URL}/de`,
            "de-CH": `${SITE_URL}/ch`,
            "id":    `${SITE_URL}/id`,
            "tr":    `${SITE_URL}/tr`,
            "x-default": SITE_URL,
        },
    },
};

export default function DeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div lang="de" dir="ltr">
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-XVZQHV08SG"
                strategy="afterInteractive"
            />
            <Script id="ga4-init-de" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-XVZQHV08SG');
                `}
            </Script>
            <DeHeader />
            {children}
            <DeFooter />
        </div>
    );
}
