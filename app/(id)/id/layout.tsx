// Indonesian Section Layout — /id/*
import type { Metadata } from "next";
import Script from "next/script";
import IdHeader from "@/components/id/IdHeader";
import IdFooter from "@/components/id/IdFooter";
import { SITE_URL } from "@/lib/constants";

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
    // hreflang — tells Google which URL to serve per language/region
    alternates: {
        canonical: `${SITE_URL}/id`,
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

export default function IdLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div lang="id" dir="ltr">
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
            <IdHeader />
            {children}
            <IdFooter />
        </div>
    );
}
