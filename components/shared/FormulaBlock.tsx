// FormulaBlock — Renders mathematical formulas with visual formatting
// Server component — used in hub pages for topical authority

interface FormulaBlockProps {
    formula: string;           // The formula text (e.g. "A = P(1 + r/n)^(nt)")
    variables?: { symbol: string; meaning: string }[];  // Variable definitions
    example?: { label: string; substitution: string; result: string }[];  // Worked example
}

export default function FormulaBlock({ formula, variables, example }: FormulaBlockProps) {
    return (
        <div className="formula-block">
            <div className="formula-block__formula">
                {formula}
            </div>

            {variables && variables.length > 0 && (
                <div className="formula-block__variables">
                    <p className="formula-block__where">Where:</p>
                    <ul>
                        {variables.map((v, i) => (
                            <li key={i}>
                                <span className="formula-block__symbol">{v.symbol}</span>
                                <span> = {v.meaning}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {example && example.length > 0 && (
                <div className="formula-block__example">
                    <p className="formula-block__example-title">📝 Worked Example</p>
                    <div className="formula-block__steps">
                        {example.map((step, i) => (
                            <div key={i} className="formula-block__step">
                                <span className="formula-block__step-num">{i + 1}</span>
                                <div>
                                    <p className="formula-block__step-label">{step.label}</p>
                                    <code className="formula-block__step-sub">{step.substitution}</code>
                                    <p className="formula-block__step-result">= {step.result}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
