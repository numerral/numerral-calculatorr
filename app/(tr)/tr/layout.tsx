// Turkish Section Layout — /tr/*
import type { Metadata } from "next";
import Script from "next/script";
import TrHeader from "@/components/tr/TrHeader";
import TrFooter from "@/components/tr/TrFooter";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Ücretsiz Online Hesaplayıcılar — Kredi, Vergi, Yatırım & Daha Fazlası | Numerral",
        template: "%s | Numerral Türkiye",
    },
    description:
        "25 ücretsiz online hesaplayıcı: konut kredisi, taşıt kredisi, KDV, gelir vergisi, maaş, SGK, yatırım, VKİ ve daha fazlası. Hızlı, doğru, reklamsız.",
    openGraph: {
        type: "website",
        siteName: "Numerral",
        locale: "tr_TR",
    },
    // hreflang — tells Google which URL to serve per language/region
    alternates: {
        canonical: `${SITE_URL}/tr`,
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

export default function TrLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div lang="tr" dir="ltr">
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-XVZQHV08SG"
                strategy="afterInteractive"
            />
            <Script id="ga4-init-tr" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-XVZQHV08SG');
                `}
            </Script>
            <TrHeader />
            {children}
            <TrFooter />
        </div>
    );
}
