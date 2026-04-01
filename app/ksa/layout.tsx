// KSA Hub Layout — overrides global og:locale and adds Saudi Arabia geo-targeting
// This layout wraps ALL pages under /ksa/* and sets region-specific metadata.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    openGraph: {
        locale: "en_SA",
        alternateLocale: ["ar_SA"],
    },
    other: {
        "geo.region": "SA",
        "geo.placename": "Saudi Arabia",
    },
    alternates: {
        languages: {
            "en-SA": `${SITE_URL}/ksa`,
            "ar-SA": `${SITE_URL}/ar`,
            "x-default": `${SITE_URL}/ksa`,
        },
    },
};

export default function KSALayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
