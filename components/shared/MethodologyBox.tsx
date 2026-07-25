// MethodologyBox.tsx
// Renders formula source citation, author attribution, last-updated date,
// and industry standard references — all visible, crawlable HTML for E-E-A-T.
// Per Koray Tuğberk: "Expertise" signals must be explicit and visible in the HTML,
// not just in metadata. Search engines look for verifiable authority markers.

interface MethodologyBoxProps {
    formula: string; // e.g. "M = P × r(1+r)^n / ((1+r)^n − 1)"
    formulaLabel?: string; // e.g. "Standard Amortization Formula"
    source: string; // e.g. "Consumer Financial Protection Bureau (CFPB)"
    sourceUrl?: string; // External URL to the source
    standard?: string; // e.g. "ISO 8601 date standard"
    lastUpdated: string; // e.g. "July 2026"
    authorName?: string; // e.g. "Numerral Finance Team"
    notes?: string; // Any additional methodology note
}

export default function MethodologyBox({
    formula,
    formulaLabel = "Calculation Formula",
    source,
    sourceUrl,
    standard,
    lastUpdated,
    authorName = "Numerral Finance Team",
    notes,
}: MethodologyBoxProps) {
    return (
        <aside
            className="methodology-box"
            aria-label="Calculation methodology and source"
        >
            <div className="methodology-box__header">
                <span className="methodology-box__icon" aria-hidden="true">📐</span>
                <strong className="methodology-box__title">Methodology & Source</strong>
            </div>
            <dl className="methodology-box__dl">
                <div className="methodology-box__row">
                    <dt className="methodology-box__dt">{formulaLabel}</dt>
                    <dd className="methodology-box__dd methodology-box__formula">
                        <code>{formula}</code>
                    </dd>
                </div>
                <div className="methodology-box__row">
                    <dt className="methodology-box__dt">Source</dt>
                    <dd className="methodology-box__dd">
                        {sourceUrl ? (
                            <a
                                href={sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="methodology-box__source-link"
                            >
                                {source}
                            </a>
                        ) : (
                            source
                        )}
                    </dd>
                </div>
                {standard && (
                    <div className="methodology-box__row">
                        <dt className="methodology-box__dt">Standard</dt>
                        <dd className="methodology-box__dd">{standard}</dd>
                    </div>
                )}
                <div className="methodology-box__row">
                    <dt className="methodology-box__dt">Last Updated</dt>
                    <dd className="methodology-box__dd">
                        <time dateTime={new Date(lastUpdated).toISOString().split("T")[0]}>
                            {lastUpdated}
                        </time>
                    </dd>
                </div>
                <div className="methodology-box__row">
                    <dt className="methodology-box__dt">Reviewed by</dt>
                    <dd className="methodology-box__dd">{authorName}</dd>
                </div>
            </dl>
            {notes && (
                <p className="methodology-box__notes">{notes}</p>
            )}
        </aside>
    );
}
