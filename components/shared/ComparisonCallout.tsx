// Reusable side-by-side comparison callout
// Shows two options with a "winner" badge on the better one

interface ComparisonOption {
    title: string;
    value: string;
    detail: string;
    isWinner?: boolean;
}

interface ComparisonCalloutProps {
    options: [ComparisonOption, ComparisonOption];
}

export default function ComparisonCallout({ options }: ComparisonCalloutProps) {
    return (
        <div className="comparison-callout">
            {options.map((opt, i) => (
                <div
                    key={i}
                    className={`comparison-callout__card${opt.isWinner ? " comparison-callout__card--winner" : ""}`}
                >
                    <p className="comparison-callout__title">{opt.title}</p>
                    <p className="comparison-callout__value">{opt.value}</p>
                    <p className="comparison-callout__detail">{opt.detail}</p>
                </div>
            ))}
        </div>
    );
}
