// KSA Hub Layout — overrides global og:locale and adds Saudi Arabia geo-targeting
// This layout wraps ALL pages under /ksa/* and sets region-specific metadata.

import type { Metadata } from "next";

export const metadata: Metadata = {
    openGraph: {
        locale: "en_SA",
    },
    other: {
        "geo.region": "SA",
        "geo.placename": "Saudi Arabia",
    },
};

export default function KSALayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
