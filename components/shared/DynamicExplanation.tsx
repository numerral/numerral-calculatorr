// DynamicExplanation — Server component with styled explanation block

interface DynamicExplanationProps {
    heading: string;
    paragraphs: string[];
    highlight?: string;
}

export default function DynamicExplanation({
    heading,
    paragraphs,
    highlight,
}: DynamicExplanationProps) {
    return (
        <section className="explanation">
            <h2>💡 {heading}</h2>
            {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
            ))}
            {highlight && (
                <div className="explanation__highlight">{highlight}</div>
            )}
        </section>
    );
}
