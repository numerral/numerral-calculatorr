// Indonesian Section Layout — /id/*
import type { Metadata } from "next";
import Script from "next/script";
import IdHeader from "@/components/id/IdHeader";
import IdFooter from "@/components/id/IdFooter";
import { SITE_URL } from "@/lib/constants";
import "../../globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Kalkulator Online Gratis — Keuangan, Pajak, Bisnis & Matematika | Numerral",
        template: "%s | Numerral Indonesia",
    },
    description:
        "25 kalkulator online gratis: KPR, kredit mobil, PPh 21, PPN, cicilan, investasi, BMI, dan lainnya. Hitung cepat dan akurat untuk semua kebutuhan Anda.",
    openGraph: {
        type: "website",
        siteName: "Numerral",
        locale: "id_ID",
    },
};

export default function IdLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" dir="ltr">
            <head>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-XVZQHV08SG"
                    strategy="afterInteractive"
                />
                <Script id="ga4-init-id" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-XVZQHV08SG');
                    `}
                </Script>
            </head>
            <body className="ar-body">
                <IdHeader />
                {children}
                <IdFooter />
            </body>
        </html>
    );
}
