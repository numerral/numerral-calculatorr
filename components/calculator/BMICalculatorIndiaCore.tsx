"use client";

import { useState, useMemo } from "react";

type CalcMode = "bmi" | "idealweight" | "waistheight";
type HeightUnit = "cm" | "ftin";

function getBMI(weightKg: number, heightCm: number): number {
    const hm = heightCm / 100;
    return weightKg / (hm * hm);
}

interface BMICat { label: string; color: string; bg: string; }
function whoCategory(bmi: number): BMICat {
    if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" };
    if (bmi < 25) return { label: "Normal", color: "#16a34a", bg: "rgba(22,163,74,0.08)" };
    if (bmi < 30) return { label: "Overweight", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" };
    if (bmi < 35) return { label: "Obese Class I", color: "#ef4444", bg: "rgba(239,68,68,0.08)" };
    if (bmi < 40) return { label: "Obese Class II", color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
    return { label: "Obese Class III", color: "#991b1b", bg: "rgba(153,27,27,0.08)" };
}
function indianCategory(bmi: number): BMICat {
    if (bmi < 18.5) return { label: "Underweight", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" };
    if (bmi < 23) return { label: "Normal", color: "#16a34a", bg: "rgba(22,163,74,0.08)" };
    if (bmi < 25) return { label: "Overweight", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" };
    if (bmi < 30) return { label: "Obese Class I", color: "#ef4444", bg: "rgba(239,68,68,0.08)" };
    if (bmi < 35) return { label: "Obese Class II", color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
    return { label: "Obese Class III", color: "#991b1b", bg: "rgba(153,27,27,0.08)" };
}
function healthRisk(bmi: number): { level: string; conditions: string } {
    if (bmi < 18.5) return { level: "Moderate", conditions: "Malnutrition, anemia, weak immunity, osteoporosis" };
    if (bmi < 23) return { level: "Low", conditions: "Healthy range for Indians — lowest metabolic risk" };
    if (bmi < 25) return { level: "Increased", conditions: "Pre-diabetes, early insulin resistance, mild dyslipidemia" };
    if (bmi < 30) return { level: "High", conditions: "Type 2 diabetes, hypertension, high cholesterol, NAFLD" };
    return { level: "Very High", conditions: "Cardiovascular disease, stroke, PCOS, sleep apnea, kidney disease" };
}

export default function BMICalculatorIndiaCore() {
    const [mode, setMode] = useState<CalcMode>("bmi");

    /* Mode 1: BMI */
    const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
    const [heightCm, setHeightCm] = useState(170);
    const [heightFt, setHeightFt] = useState(5);
    const [heightIn, setHeightIn] = useState(7);
    const [weight, setWeight] = useState(70);
    const [gender, setGender] = useState<"male" | "female">("male");

    /* Mode 2: Ideal Weight */
    const [iwHeightCm, setIwHeightCm] = useState(170);
    const [iwUnit, setIwUnit] = useState<HeightUnit>("cm");
    const [iwFt, setIwFt] = useState(5);
    const [iwIn, setIwIn] = useState(7);

    /* Mode 3: Waist-Height */
    const [waist, setWaist] = useState(85);
    const [whHeight, setWhHeight] = useState(170);
    const [whGender, setWhGender] = useState<"male" | "female">("male");

    const effHeight = heightUnit === "cm" ? heightCm : (heightFt * 30.48 + heightIn * 2.54);
    const iwEffHeight = iwUnit === "cm" ? iwHeightCm : (iwFt * 30.48 + iwIn * 2.54);

    /* ── BMI Result ── */
    const bmiResult = useMemo(() => {
        if (effHeight < 50 || weight < 10) return null;
        const bmi = getBMI(weight, effHeight);
        const who = whoCategory(bmi);
        const india = indianCategory(bmi);
        const risk = healthRisk(bmi);
        const hm = effHeight / 100;
        const idealLow = Math.round(18.5 * hm * hm);
        const idealHighIndia = Math.round(22.9 * hm * hm);
        const idealHighWHO = Math.round(24.9 * hm * hm);
        const mismatch = who.label !== india.label;
        return { bmi, who, india, risk, idealLow, idealHighIndia, idealHighWHO, mismatch };
    }, [effHeight, weight]);

    /* ── Ideal Weight Result ── */
    const iwResult = useMemo(() => {
        if (iwEffHeight < 50) return null;
        const hm = iwEffHeight / 100;
        const rows = [
            { bmi: 18.5, label: "Underweight threshold", weight: Math.round(18.5 * hm * hm) },
            { bmi: 22.9, label: "Indian upper normal", weight: Math.round(22.9 * hm * hm) },
            { bmi: 24.9, label: "WHO upper normal", weight: Math.round(24.9 * hm * hm) },
            { bmi: 25.0, label: "Overweight (WHO)", weight: Math.round(25 * hm * hm) },
            { bmi: 30.0, label: "Obese (WHO) / India OW limit", weight: Math.round(30 * hm * hm) },
        ];
        return { idealLow: rows[0].weight, idealHighIndia: rows[1].weight, idealHighWHO: rows[2].weight, rows };
    }, [iwEffHeight]);

    /* ── Waist-Height Result ── */
    const whResult = useMemo(() => {
        if (whHeight < 50 || waist < 30) return null;
        const ratio = waist / whHeight;
        const abdominalThreshold = whGender === "male" ? 90 : 80;
        const abdominalObesity = waist >= abdominalThreshold;
        let category: BMICat;
        if (ratio < 0.4) category = { label: "Very Lean", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" };
        else if (ratio < 0.5) category = { label: "Healthy", color: "#16a34a", bg: "rgba(22,163,74,0.08)" };
        else if (ratio < 0.6) category = { label: "Increased Risk", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" };
        else category = { label: "High Risk", color: "#ef4444", bg: "rgba(239,68,68,0.08)" };
        return { ratio, category, abdominalObesity, abdominalThreshold };
    }, [waist, whHeight, whGender]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};
    const thStyle: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">🏋️ BMI Calculator India</h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["bmi", "BMI Calculator"], ["idealweight", "📏 Ideal Weight"], ["waistheight", "📐 Waist-to-Height"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE: BMI ═══════ */}
            {mode === "bmi" && (
                <>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        <button className="calc-tab-btn" onClick={() => setGender("male")} style={gender === "male" ? { background: "rgba(59,130,246,0.1)", borderColor: "#3b82f6", color: "#3b82f6", fontWeight: 700 } : {}}>♂ Male</button>
                        <button className="calc-tab-btn" onClick={() => setGender("female")} style={gender === "female" ? { background: "rgba(236,72,153,0.1)", borderColor: "#ec4899", color: "#ec4899", fontWeight: 700 } : {}}>♀ Female</button>
                        <div style={{ marginLeft: "auto" }}>
                            <button className="calc-tab-btn" onClick={() => setHeightUnit(heightUnit === "cm" ? "ftin" : "cm")} style={{ fontSize: "0.78rem", padding: "4px 10px" }}>
                                {heightUnit === "cm" ? "Switch to Feet/Inches" : "Switch to Centimeters"}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: heightUnit === "cm" ? "1fr 1fr" : "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        {heightUnit === "cm" ? (
                            <div className="con-input">
                                <label className="con-input__label">Height (cm)</label>
                                <input type="number" className="con-input__field" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} min={50} max={250} />
                            </div>
                        ) : (
                            <>
                                <div className="con-input">
                                    <label className="con-input__label">Height (Feet)</label>
                                    <input type="number" className="con-input__field" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} min={1} max={8} />
                                </div>
                                <div className="con-input">
                                    <label className="con-input__label">Inches</label>
                                    <input type="number" className="con-input__field" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} min={0} max={11} />
                                </div>
                            </>
                        )}
                        <div className="con-input">
                            <label className="con-input__label">Weight (kg)</label>
                            <input type="number" className="con-input__field" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={10} max={300} />
                        </div>
                    </div>

                    {bmiResult && (
                        <div className="con-calc__results">
                            <h4>Your BMI Result</h4>
                            <div style={{ textAlign: "center", padding: "16px 0", marginBottom: "16px" }}>
                                <div style={{ fontSize: "3rem", fontWeight: 800, color: bmiResult.india.color, letterSpacing: "-2px" }}>
                                    {bmiResult.bmi.toFixed(1)}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ padding: "16px", borderRadius: "12px", border: `2px solid ${bmiResult.india.color}`, background: bmiResult.india.bg, textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>🇮🇳 Asian-Indian Standard</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: bmiResult.india.color }}>{bmiResult.india.label}</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Normal: 18.5 – 22.9</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", border: `2px solid ${bmiResult.who.color}`, background: bmiResult.who.bg, textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>🌍 WHO International</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: bmiResult.who.color }}>{bmiResult.who.label}</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Normal: 18.5 – 24.9</div>
                                </div>
                            </div>

                            {bmiResult.mismatch && (
                                <div style={{ padding: "12px 16px", borderRadius: "8px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", marginBottom: "16px", fontSize: "0.82rem" }}>
                                    ⚠️ <strong>Important:</strong> Your BMI is <strong>{bmiResult.who.label}</strong> by WHO standards but <strong>{bmiResult.india.label}</strong> by Asian-Indian standards. Indians face metabolic risks at lower BMI due to higher visceral fat (thin-fat phenotype). The Indian threshold is clinically more relevant for you.
                                </div>
                            )}

                            <div className="con-result-row"><span className="con-result-row__label">Health Risk Level (India)</span><span className="con-result-row__value" style={{ fontWeight: 700, color: bmiResult.india.color }}>{bmiResult.risk.level}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Associated Conditions</span><span className="con-result-row__value" style={{ fontSize: "0.8rem" }}>{bmiResult.risk.conditions}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Ideal Weight (India: 18.5–22.9)</span><span className="con-result-row__value">{bmiResult.idealLow} – {bmiResult.idealHighIndia} kg</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Ideal Weight (WHO: 18.5–24.9)</span><span className="con-result-row__value">{bmiResult.idealLow} – {bmiResult.idealHighWHO} kg</span></div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: IDEAL WEIGHT ═══════ */}
            {mode === "idealweight" && (
                <>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        <button className="calc-tab-btn" onClick={() => setIwUnit(iwUnit === "cm" ? "ftin" : "cm")} style={{ fontSize: "0.78rem", padding: "4px 10px" }}>
                            {iwUnit === "cm" ? "Switch to Feet/Inches" : "Switch to Centimeters"}
                        </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: iwUnit === "cm" ? "1fr" : "1fr 1fr", gap: "12px", marginBottom: "16px", maxWidth: "400px" }}>
                        {iwUnit === "cm" ? (
                            <div className="con-input">
                                <label className="con-input__label">Your Height (cm)</label>
                                <input type="number" className="con-input__field" value={iwHeightCm} onChange={(e) => setIwHeightCm(Number(e.target.value))} min={50} max={250} />
                            </div>
                        ) : (
                            <>
                                <div className="con-input">
                                    <label className="con-input__label">Feet</label>
                                    <input type="number" className="con-input__field" value={iwFt} onChange={(e) => setIwFt(Number(e.target.value))} min={1} max={8} />
                                </div>
                                <div className="con-input">
                                    <label className="con-input__label">Inches</label>
                                    <input type="number" className="con-input__field" value={iwIn} onChange={(e) => setIwIn(Number(e.target.value))} min={0} max={11} />
                                </div>
                            </>
                        )}
                    </div>

                    {iwResult && (
                        <div className="con-calc__results">
                            <h4>📏 Ideal Weight for Your Height ({Math.round(iwEffHeight)} cm)</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ padding: "16px", borderRadius: "12px", border: "2px solid #16a34a", background: "rgba(22,163,74,0.03)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#16a34a", fontWeight: 700 }}>🇮🇳 Indian Healthy Range</div>
                                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a", marginTop: "4px" }}>{iwResult.idealLow} – {iwResult.idealHighIndia} kg</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>BMI 18.5 – 22.9</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>🌍 WHO Healthy Range</div>
                                    <div style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "4px" }}>{iwResult.idealLow} – {iwResult.idealHighWHO} kg</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>BMI 18.5 – 24.9</div>
                                </div>
                            </div>

                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                        <th style={{ ...thStyle, textAlign: "center" }}>BMI</th>
                                        <th style={{ ...thStyle, textAlign: "left" }}>Category</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Weight (kg)</th>
                                    </tr></thead>
                                    <tbody>
                                        {iwResult.rows.map((r, i) => (
                                            <tr key={i} style={i % 2 === 1 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", textAlign: "center", fontWeight: 700 }}>{r.bmi}</td>
                                                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>{r.label}</td>
                                                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", textAlign: "right", fontWeight: 700 }}>{r.weight} kg</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: WAIST-HEIGHT ═══════ */}
            {mode === "waistheight" && (
                <>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        <button className="calc-tab-btn" onClick={() => setWhGender("male")} style={whGender === "male" ? { background: "rgba(59,130,246,0.1)", borderColor: "#3b82f6", color: "#3b82f6", fontWeight: 700 } : {}}>♂ Male</button>
                        <button className="calc-tab-btn" onClick={() => setWhGender("female")} style={whGender === "female" ? { background: "rgba(236,72,153,0.1)", borderColor: "#ec4899", color: "#ec4899", fontWeight: 700 } : {}}>♀ Female</button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Waist Circumference (cm)</label>
                            <input type="number" className="con-input__field" value={waist} onChange={(e) => setWaist(Number(e.target.value))} min={30} max={200} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>Measure at navel level</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Height (cm)</label>
                            <input type="number" className="con-input__field" value={whHeight} onChange={(e) => setWhHeight(Number(e.target.value))} min={50} max={250} />
                        </div>
                    </div>

                    {whResult && (
                        <div className="con-calc__results">
                            <h4>📐 Waist-to-Height Ratio</h4>
                            <div style={{ textAlign: "center", padding: "16px 0", marginBottom: "16px" }}>
                                <div style={{ fontSize: "3rem", fontWeight: 800, color: whResult.category.color, letterSpacing: "-2px" }}>
                                    {whResult.ratio.toFixed(2)}
                                </div>
                                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: whResult.category.color }}>{whResult.category.label}</div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ padding: "16px", borderRadius: "12px", border: `2px solid ${whResult.abdominalObesity ? "#ef4444" : "#16a34a"}`, background: whResult.abdominalObesity ? "rgba(239,68,68,0.03)" : "rgba(22,163,74,0.03)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Abdominal Obesity</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: whResult.abdominalObesity ? "#ef4444" : "#16a34a" }}>
                                        {whResult.abdominalObesity ? "⚠️ Yes" : "✅ No"}
                                    </div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
                                        Threshold: {whGender === "male" ? "≥90 cm" : "≥80 cm"} ({whGender === "male" ? "Men" : "Women"})
                                    </div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>WHtR Target</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>Below 0.50</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Your waist: {waist} cm / Height: {whHeight} cm</div>
                                </div>
                            </div>

                            <div className="explanation__highlight" style={{ fontSize: "0.85rem" }}>
                                <strong>Why Waist-to-Height Ratio?</strong> BMI alone doesn't measure <strong>where</strong> fat is stored. Indians commonly have the "<strong>thin-fat phenotype</strong>" — normal BMI but high visceral (belly) fat. Waist-to-Height Ratio (WHtR) is a better predictor of cardiovascular and metabolic risk. A ratio <strong>below 0.50</strong> is the target for all adults. For Indian men, waist ≥90 cm and for women ≥80 cm indicates abdominal obesity.
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
