// India Hub Layout — overrides global og:locale and adds India geo-targeting
// This layout wraps ALL pages under /in/* and sets region-specific metadata.

import type { Metadata } from "next";

export const metadata: Metadata = {
    openGraph: {
        locale: "en_IN",
    },
    other: {
        "geo.region": "IN",
        "geo.placename": "India",
    },
};

export default function IndiaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
