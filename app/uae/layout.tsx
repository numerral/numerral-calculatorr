// UAE Hub Layout — overrides global og:locale and adds UAE geo-targeting
// This layout wraps ALL pages under /uae/* and sets region-specific metadata.

import type { Metadata } from "next";

export const metadata: Metadata = {
    openGraph: {
        locale: "en_AE",
    },
    other: {
        "geo.region": "AE",
        "geo.placename": "United Arab Emirates",
    },
};

export default function UAELayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
