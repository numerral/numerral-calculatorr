// Reusable insight/tip box with gold accent border

interface InsightBoxProps {
    icon?: string;
    title: string;
    children: React.ReactNode;
}

export default function InsightBox({ icon = "💡", title, children }: InsightBoxProps) {
    return (
        <div className="insight-box">
            <span className="insight-box__icon">{icon}</span>
            <div className="insight-box__content">
                <p className="insight-box__title">{title}</p>
                <div className="insight-box__text">{children}</div>
            </div>
        </div>
    );
}
