// LocaleAwareShell — Hides English Header/Footer on locale pages
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import MegaFooter from "./MegaFooter";

const LOCALE_PREFIXES = ["/tr", "/de", "/ch", "/id", "/ar"];

export default function LocaleAwareShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLocale = LOCALE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );

    if (isLocale) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            {children}
            <MegaFooter />
        </>
    );
}
