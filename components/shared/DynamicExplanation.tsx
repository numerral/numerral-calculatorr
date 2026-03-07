// DynamicExplanation — Server component with styled explanation block

interface DynamicExplanationProps {
    heading?: string;
    paragraphs?: string[];
    highlight?: string;
    contentHTML?: string;
}

export default function DynamicExplanation({
    heading,
    paragraphs,
    highlight,
    contentHTML,
}: DynamicExplanationProps) {
    return (
        <section className="explanation">
            {heading && <h2>💡 {heading}</h2>}
            {contentHTML ? (
                <div
                    className="explanation__html"
                    dangerouslySetInnerHTML={{ __html: contentHTML }}
                />
            ) : paragraphs ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : null}
            {highlight && (
                <div className="explanation__highlight">{highlight}</div>
            )}
        </section>
    );
}
