"use client";
import { useState, useMemo } from "react";
import {
    calculateAge,
    percentOf, whatPercent, percentChange, percentIncrease, percentDecrease,
    calculateCompoundInterest,
    calculateSimpleInterest,
    calculateBMI,
    calculateDiscount,
} from "@/lib/calculators/utilities";

function fmtINR(n: number): string {
    if (Math.abs(n) >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
    if (Math.abs(n) >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
    return "₹" + n.toLocaleString("en-IN");
}

// ─── Age ───
function AgeCalc() {
    const today = new Date();
    const defaultDOB = `${today.getFullYear() - 25}-01-15`;
    const [dob, setDob] = useState(defaultDOB);
    const [toDate, setToDate] = useState(today.toISOString().split("T")[0]);

    const result = useMemo(() => {
        if (!dob) return null;
        return calculateAge(new Date(dob), new Date(toDate));
    }, [dob, toDate]);

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🎂 DATE OF BIRTH</label>
                <input type="date" className="calc-field__input" value={dob}
                    onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📅 AGE ON DATE</label>
                <input type="date" className="calc-field__input" value={toDate}
                    onChange={(e) => setToDate(e.target.value)} />
            </div>

            {result && (
                <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                    <p className="calc-field__label">YOUR AGE</p>
                    <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                        {result.years} years, {result.months} months, {result.days} days
                    </p>
                    <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                        <div><p className="calc-field__label">TOTAL DAYS</p><p style={{ fontWeight: 700, color: "var(--n-text)" }}>{result.totalDays.toLocaleString("en-IN")}</p></div>
                        <div><p className="calc-field__label">TOTAL MONTHS</p><p style={{ fontWeight: 700, color: "var(--n-text)" }}>{result.totalMonths}</p></div>
                        <div><p className="calc-field__label">TOTAL WEEKS</p><p style={{ fontWeight: 700, color: "var(--n-text)" }}>{result.totalWeeks.toLocaleString("en-IN")}</p></div>
                    </div>
                    <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                    <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                        🎉 <strong style={{ color: "var(--n-primary)" }}>{result.nextBirthday}</strong> days until your next birthday!
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Percentage ───
function PercentageCalc() {
    type Mode = "of" | "what" | "change" | "increase" | "decrease";
    const [mode, setMode] = useState<Mode>("of");
    const [a, setA] = useState(10);
    const [b, setB] = useState(1000);

    const result = useMemo(() => {
        switch (mode) {
            case "of": return percentOf(a, b);
            case "what": return whatPercent(a, b);
            case "change": return percentChange(a, b);
            case "increase": return percentIncrease(b, a);
            case "decrease": return percentDecrease(b, a);
        }
    }, [mode, a, b]);

    const labels: Record<Mode, { a: string; b: string }> = {
        of: { a: "PERCENTAGE (%)", b: "VALUE" },
        what: { a: "VALUE (X)", b: "OF TOTAL (Y)" },
        change: { a: "FROM", b: "TO" },
        increase: { a: "INCREASE (%)", b: "VALUE" },
        decrease: { a: "DECREASE (%)", b: "VALUE" },
    };

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">📊 MODE</label>
                <div className="tax-toggle">
                    {(["of", "what", "change", "increase", "decrease"] as Mode[]).map((m) => (
                        <button key={m} className={`tax-toggle__btn${mode === m ? " active" : ""}`}
                            onClick={() => setMode(m)}>
                            {m === "of" ? "X% of Y" : m === "what" ? "X is ?% of Y" : m === "change" ? "% Change" : m === "increase" ? "% Increase" : "% Decrease"}
                        </button>
                    ))}
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🔢 {labels[mode].a}</label>
                <input type="number" className="calc-field__input" value={a}
                    onChange={(e) => setA(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🔢 {labels[mode].b}</label>
                <input type="number" className="calc-field__input" value={b}
                    onChange={(e) => setB(Number(e.target.value))} />
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">RESULT</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {mode === "what" || mode === "change" ? `${result.result.toFixed(2)}%` : result.result.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>{result.formula}</p>
            </div>
        </div>
    );
}

// ─── Compound Interest ───
function CompoundInterestCalc() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(8);
    const [tenure, setTenure] = useState(60);
    const [freq, setFreq] = useState(12);

    const result = useMemo(() =>
        calculateCompoundInterest(principal, rate, tenure, freq),
        [principal, rate, tenure, freq]
    );

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">₹ PRINCIPAL AMOUNT</label>
                <input type="range" className="calc-field__slider" min={1000} max={100000000} step={1000}
                    value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📈 ANNUAL INTEREST RATE (%)</label>
                <input type="range" className="calc-field__slider" min={1} max={30} step={0.1}
                    value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={rate}
                    onChange={(e) => setRate(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📅 TENURE (MONTHS)</label>
                <input type="range" className="calc-field__slider" min={1} max={360} step={1}
                    value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">{(tenure / 12).toFixed(1)} yr</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🔄 COMPOUNDING</label>
                <div className="tax-toggle">
                    {[{ label: "Monthly", value: 12 }, { label: "Quarterly", value: 4 }, { label: "Yearly", value: 1 }, { label: "Daily", value: 365 }].map((f) => (
                        <button key={f.value} className={`tax-toggle__btn${freq === f.value ? " active" : ""}`}
                            onClick={() => setFreq(f.value)}>{f.label}</button>
                    ))}
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">MATURITY AMOUNT</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {fmtINR(result.maturityAmount)}
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">PRINCIPAL</p><p style={{ fontWeight: 700 }}>{fmtINR(result.principal)}</p></div>
                    <div><p className="calc-field__label">TOTAL INTEREST</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmtINR(result.totalInterest)}</p></div>
                    <div><p className="calc-field__label">EFFECTIVE RATE</p><p style={{ fontWeight: 700 }}>{result.effectiveRate.toFixed(2)}%</p></div>
                </div>
            </div>

            {result.yearlyBreakdown.length > 1 && (
                <div style={{ marginTop: "var(--s-4)" }}>
                    <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Yearly Breakdown</h3>
                    <table className="calc-table">
                        <thead>
                            <tr><th>Year</th><th>Interest</th><th>Balance</th></tr>
                        </thead>
                        <tbody>
                            {result.yearlyBreakdown.map((row) => (
                                <tr key={row.year}>
                                    <td>{row.year}</td>
                                    <td>{fmtINR(row.interest)}</td>
                                    <td>{fmtINR(row.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── Simple Interest ───
function SimpleInterestCalc() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(8);
    const [tenure, setTenure] = useState(60);

    const result = useMemo(() =>
        calculateSimpleInterest(principal, rate, tenure),
        [principal, rate, tenure]
    );
    const ci = useMemo(() =>
        calculateCompoundInterest(principal, rate, tenure, 12),
        [principal, rate, tenure]
    );

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">₹ PRINCIPAL AMOUNT</label>
                <input type="range" className="calc-field__slider" min={1000} max={100000000} step={1000}
                    value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📈 ANNUAL INTEREST RATE (%)</label>
                <input type="range" className="calc-field__slider" min={1} max={30} step={0.1}
                    value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={rate}
                    onChange={(e) => setRate(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📅 TENURE (MONTHS)</label>
                <input type="range" className="calc-field__slider" min={1} max={360} step={1}
                    value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">{(tenure / 12).toFixed(1)} yr</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">MATURITY AMOUNT (SIMPLE INTEREST)</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {fmtINR(result.maturityAmount)}
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">PRINCIPAL</p><p style={{ fontWeight: 700 }}>{fmtINR(result.principal)}</p></div>
                    <div><p className="calc-field__label">TOTAL INTEREST</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmtINR(result.totalInterest)}</p></div>
                    <div><p className="calc-field__label">MONTHLY INTEREST</p><p style={{ fontWeight: 700 }}>{fmtINR(result.monthlyInterest)}</p></div>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Simple vs Compound Interest</h3>
                <table className="calc-table">
                    <thead><tr><th>Type</th><th>Interest</th><th>Maturity</th></tr></thead>
                    <tbody>
                        <tr><td>Simple Interest</td><td>{fmtINR(result.totalInterest)}</td><td>{fmtINR(result.maturityAmount)}</td></tr>
                        <tr><td>Compound Interest</td><td style={{ color: "var(--n-success)" }}>{fmtINR(ci.totalInterest)}</td><td>{fmtINR(ci.maturityAmount)}</td></tr>
                        <tr><td><strong>Difference</strong></td><td colSpan={2} style={{ color: "var(--n-primary)" }}><strong>CI earns {fmtINR(ci.totalInterest - result.totalInterest)} more</strong></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── BMI ───
function BMICalc() {
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);

    const result = useMemo(() => calculateBMI(weight, height), [weight, height]);

    const bmiScale = [
        { label: "Underweight", range: "< 18.5", color: "#f39c12" },
        { label: "Normal", range: "18.5 – 24.9", color: "#27ae60" },
        { label: "Overweight", range: "25 – 29.9", color: "#f39c12" },
        { label: "Obese", range: "≥ 30", color: "#e74c3c" },
    ];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⚖️ WEIGHT (kg)</label>
                <input type="range" className="calc-field__slider" min={20} max={200} step={0.5}
                    value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📏 HEIGHT (cm)</label>
                <input type="range" className="calc-field__slider" min={100} max={220} step={1}
                    value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={height}
                        onChange={(e) => setHeight(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">{Math.floor(height / 30.48)}&#39;{Math.round((height % 30.48) / 2.54)}&quot;</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">YOUR BMI</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: result.color, marginBottom: "var(--s-2)" }}>
                    {result.bmi}
                </p>
                <p style={{ fontSize: "var(--t-body)", fontWeight: 600, color: result.color, marginBottom: "var(--s-3)" }}>
                    {result.category}
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">HEALTHY WEIGHT</p><p style={{ fontWeight: 700 }}>{result.healthyWeightRange.min} – {result.healthyWeightRange.max} kg</p></div>
                    <div><p className="calc-field__label">YOUR HEIGHT</p><p style={{ fontWeight: 700 }}>{height} cm ({Math.floor(height / 30.48)}&#39;{Math.round((height % 30.48) / 2.54)}&quot;)</p></div>
                </div>
            </div>

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>BMI Scale</h3>
                <table className="calc-table">
                    <thead><tr><th>Category</th><th>BMI Range</th></tr></thead>
                    <tbody>
                        {bmiScale.map((s) => (
                            <tr key={s.label} style={s.label === result.category.split(" ")[0] ? { background: "var(--n-primary-light)" } : {}}>
                                <td style={{ color: s.color, fontWeight: 600 }}>{s.label}</td>
                                <td>{s.range}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Discount ───
function DiscountCalc() {
    const [price, setPrice] = useState(5000);
    const [discount, setDiscount] = useState(20);
    const [extra, setExtra] = useState(0);

    const result = useMemo(() => calculateDiscount(price, discount, extra), [price, discount, extra]);

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">₹ ORIGINAL PRICE</label>
                <input type="range" className="calc-field__slider" min={0} max={1000000} step={100}
                    value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={price}
                    onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ DISCOUNT (%)</label>
                <input type="range" className="calc-field__slider" min={0} max={100} step={0.5}
                    value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🎁 EXTRA DISCOUNT (%)</label>
                <input type="range" className="calc-field__slider" min={0} max={100} step={0.5}
                    value={extra} onChange={(e) => setExtra(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={extra}
                    onChange={(e) => setExtra(Number(e.target.value))} />
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">FINAL PRICE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {fmtINR(result.finalPrice)}
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">YOU SAVE</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmtINR(result.discountAmount)}</p></div>
                    <div><p className="calc-field__label">SAVED %</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{result.savedPercent}%</p></div>
                    <div><p className="calc-field__label">ORIGINAL</p><p style={{ fontWeight: 700, textDecoration: "line-through", color: "var(--n-text-muted)" }}>{fmtINR(result.originalPrice)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Dispatcher ───
interface Props { calcType: string; }

const CALCULATORS: Record<string, React.FC> = {
    "age": AgeCalc,
    "percentage": PercentageCalc,
    "compound-interest": CompoundInterestCalc,
    "simple-interest": SimpleInterestCalc,
    "bmi": BMICalc,
    "discount": DiscountCalc,
};

export default function UtilityCalculatorCore({ calcType }: Props) {
    const Calculator = CALCULATORS[calcType];
    if (!Calculator) return <p>Unknown calculator type: {calcType}</p>;
    return <Calculator />;
}
