// Reusable step-by-step calculation breakdown component
// Shows numbered steps with formula and result for each

interface Step {
    label: string;
    formula?: string;
    result: string;
}

interface StepByStepProps {
    title: string;
    steps: Step[];
}

export default function StepByStep({ title, steps }: StepByStepProps) {
    return (
        <section className="step-breakdown">
            <h3 className="step-breakdown__title">📐 {title}</h3>
            <ol className="step-breakdown__list">
                {steps.map((step, i) => (
                    <li key={i} className="step-breakdown__item">
                        <span className="step-breakdown__number" />
                        <div className="step-breakdown__content">
                            <p className="step-breakdown__label">{step.label}</p>
                            {step.formula && (
                                <code className="step-breakdown__formula">{step.formula}</code>
                            )}
                            <p className="step-breakdown__result">= {step.result}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
