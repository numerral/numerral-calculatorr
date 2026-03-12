// German Section Layout — /de/*
import type { Metadata } from "next";
import Script from "next/script";
import DeHeader from "@/components/de/DeHeader";
import DeFooter from "@/components/de/DeFooter";
import { SITE_URL } from "@/lib/constants";
import "../../globals.css";

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
};

export default function DeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de-DE" dir="ltr">
            <head>
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
            </head>
            <body className="ar-body">
                <DeHeader />
                {children}
                <DeFooter />
            </body>
        </html>
    );
}
