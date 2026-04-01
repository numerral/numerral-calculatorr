// Arabic Section Layout — /ar/*
// Uses RTL direction, Noto Kufi Arabic font, separate header/footer

import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Kufi_Arabic } from "next/font/google";
import ArHeader from "@/components/ar/ArHeader";
import ArFooter from "@/components/ar/ArFooter";
import { SITE_URL } from "@/lib/constants";

const kufi = Noto_Kufi_Arabic({
    subsets: ["arabic"],
    display: "swap",
    variable: "--font-kufi",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "حاسبات مالية مجانية — قروض، تمويل، استثمار | Numerral",
        template: "%s | Numerral عربي",
    },
    description:
        "حاسبات مالية مجانية: حاسبة القروض، التمويل العقاري، القسط الشهري، الفائدة المركبة، الاستثمار، الادخار، العائد على الاستثمار، الربح والخصم.",
    openGraph: {
        type: "website",
        siteName: "Numerral",
        locale: "ar_SA",
        alternateLocale: ["ar_AE"],
    },
    alternates: {
        languages: {
            "ar-SA": `${SITE_URL}/ar`,
            "ar-AE": `${SITE_URL}/ar`,
            "en-SA": `${SITE_URL}/ksa`,
            "en-AE": `${SITE_URL}/uae`,
            "x-default": `${SITE_URL}/ar`,
        },
    },
};

export default function ArLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div lang="ar" dir="rtl" className={`${kufi.className} ${kufi.variable} ar-body`}>
            {/* Google Analytics GA4 */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-XVZQHV08SG"
                strategy="afterInteractive"
            />
            <Script id="ga4-init-ar" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-XVZQHV08SG');
                `}
            </Script>
            <ArHeader />
            {children}
            <ArFooter />
        </div>
    );
}
