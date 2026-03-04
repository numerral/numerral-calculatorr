// InputPanel — child of CalculatorCore (inherits client boundary)
// DO NOT add "use client" here — CalculatorCore is the boundary.

interface InputPanelProps {
    amount: number;
    rate: number;
    tenure: number;
    tenureUnit: "months" | "years";
    onAmountChange: (val: number) => void;
    onRateChange: (val: number) => void;
    onTenureChange: (val: number) => void;
    onTenureUnitChange: (unit: "months" | "years") => void;
    sliderRanges?: {
        amount: { min: number; max: number; step: number };
        rate: { min: number; max: number; step: number };
        tenure: { min: number; max: number; step: number };
    };
}

export default function InputPanel({
    amount,
    rate,
    tenure,
    tenureUnit,
    onAmountChange,
    onRateChange,
    onTenureChange,
    onTenureUnitChange,
    sliderRanges = {
        amount: { min: 50000, max: 10000000, step: 50000 },
        rate: { min: 1, max: 30, step: 0.1 },
        tenure: { min: 6, max: 360, step: 6 },
    },
}: InputPanelProps) {
    return (
        <div className="calc-input-panel">
            {/* Loan Amount */}
            <div className="calc-field">
                <label className="calc-field__label">
                    <span className="calc-field__label-icon">₹</span>
                    Loan Amount
                </label>
                <input
                    type="range"
                    className="calc-field__slider"
                    min={sliderRanges.amount.min}
                    max={sliderRanges.amount.max}
                    step={sliderRanges.amount.step}
                    value={amount}
                    onChange={(e) => onAmountChange(Number(e.target.value))}
                />
                <input
                    type="text"
                    className="calc-field__input"
                    value={amount.toLocaleString("en-IN")}
                    onChange={(e) => {
                        const parsed = parseInt(e.target.value.replace(/,/g, ""));
                        if (!isNaN(parsed)) onAmountChange(parsed);
                    }}
                    inputMode="numeric"
                />
            </div>

            {/* Interest Rate */}
            <div className="calc-field">
                <label className="calc-field__label">
                    <span className="calc-field__label-icon">%</span>
                    Interest Rate (p.a.)
                </label>
                <input
                    type="range"
                    className="calc-field__slider"
                    min={sliderRanges.rate.min}
                    max={sliderRanges.rate.max}
                    step={sliderRanges.rate.step}
                    value={rate}
                    onChange={(e) => onRateChange(Number(e.target.value))}
                />
                <input
                    type="text"
                    className="calc-field__input"
                    value={rate}
                    onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        if (!isNaN(parsed)) onRateChange(parsed);
                    }}
                    inputMode="decimal"
                />
            </div>

            {/* Tenure */}
            <div className="calc-field">
                <label className="calc-field__label">
                    <span className="calc-field__label-icon">📅</span>
                    Loan Tenure
                </label>
                <input
                    type="range"
                    className="calc-field__slider"
                    min={sliderRanges.tenure.min}
                    max={sliderRanges.tenure.max}
                    step={sliderRanges.tenure.step}
                    value={tenure}
                    onChange={(e) => onTenureChange(Number(e.target.value))}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                        type="text"
                        className="calc-field__input"
                        value={tenure}
                        onChange={(e) => {
                            const parsed = parseInt(e.target.value);
                            if (!isNaN(parsed)) onTenureChange(parsed);
                        }}
                        inputMode="numeric"
                        style={{ flex: 1 }}
                    />
                    <div className="calc-tenure-toggle">
                        <button
                            className={`calc-tenure-toggle__btn${tenureUnit === "months" ? " active" : ""}`}
                            onClick={() => onTenureUnitChange("months")}
                        >
                            Months
                        </button>
                        <button
                            className={`calc-tenure-toggle__btn${tenureUnit === "years" ? " active" : ""}`}
                            onClick={() => onTenureUnitChange("years")}
                        >
                            Years
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
