// Turkish Section Layout — /tr/*
import type { Metadata } from "next";
import Script from "next/script";
import TrHeader from "@/components/tr/TrHeader";
import TrFooter from "@/components/tr/TrFooter";
import { SITE_URL } from "@/lib/constants";
import "../../globals.css";

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
};

export default function TrLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" dir="ltr">
            <head>
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
            </head>
            <body className="ar-body">
                <TrHeader />
                {children}
                <TrFooter />
            </body>
        </html>
    );
}
