// India Hub Layout — overrides global og:locale and adds India geo-targeting
// This layout wraps ALL pages under /in/* and sets region-specific metadata.

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    openGraph: {
        locale: "en_IN",
    },
    other: {
        "geo.region": "IN",
        "geo.placename": "India",
    },
    alternates: {
        languages: {
            "en-IN": `${SITE_URL}/in`,
            "x-default": `${SITE_URL}/in`,
        },
    },
};

export default function IndiaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
