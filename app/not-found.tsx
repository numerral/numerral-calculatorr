// Global Not Found — catches all unmatched routes

import Link from "next/link";

export default function NotFound() {
    return (
        <main>
            <h1>404 — Page Not Found</h1>
            <p>
                The calculator or page you&apos;re looking for doesn&apos;t exist. It may have
                been moved or the URL might be incorrect.
            </p>
            <p>
                <Link href="/">← Back to all calculators</Link>
            </p>
        </main>
    );
}
