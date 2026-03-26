"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/* ── Sub-components ── */
function InputField({ label, value, onChange, unit, placeholder, step, min, max, note }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string; step?: number; min?: number; max?: number; note?: string;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min ?? 0} max={max} step={step || 1} placeholder={placeholder || "0"} />
            {note && <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{note}</p>}
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </div>
    );
}

function ResultRow({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: boolean }) {
    return (
        <div className="con-result-row" style={highlight ? { background: "rgba(0,100,70,0.06)", borderRadius: 6, padding: "12px 0", margin: "4px 0" } : sub ? { paddingLeft: 16 } : {}}>
            <span className="con-result-row__label" style={highlight ? { fontWeight: 700, color: "var(--n-text)" } : sub ? { fontSize: "0.85rem", color: "var(--n-text-secondary)" } : {}}>{label}</span>
            <span className="con-result-row__value" style={highlight ? { fontSize: "1.1rem", color: "#006446" } : {}}>{value}</span>
        </div>
    );
}

/* ── Activity Levels ── */
const ACTIVITY_LEVELS = [
    { value: "1.2", label: "Sedentary — desk job, no exercise" },
    { value: "1.375", label: "Lightly Active — 1-3 days/week" },
    { value: "1.55", label: "Moderately Active — 3-5 days/week" },
    { value: "1.725", label: "Very Active — 6-7 days/week" },
    { value: "1.9", label: "Extra Active — athlete / physical job" },
];

/* ── Weight Loss Rate ── */
const LOSS_RATES = [
    { value: "0", label: "Maintain current weight" },
    { value: "250", label: "Mild loss — 0.25 kg/week" },
    { value: "500", label: "Moderate loss — 0.5 kg/week" },
    { value: "750", label: "Significant loss — 0.75 kg/week" },
    { value: "1000", label: "Aggressive loss — 1 kg/week" },
];

/* ── Saudi Food Reference ── */
const SAUDI_FOODS = [
    { name: "Chicken Kabsa (200g)", cal: 312 },
    { name: "Mutton Mandi (200g)", cal: 288 },
    { name: "Chicken Shawarma (1 wrap)", cal: 450 },
    { name: "Samosa (1 piece)", cal: 120 },
    { name: "Dates — Medjool (2 pcs)", cal: 110 },
    { name: "Arabic Coffee (1 cup)", cal: 2 },
    { name: "Lamb Kabab (2 skewers)", cal: 280 },
    { name: "Hummus (100g)", cal: 166 },
    { name: "Fattoush Salad (1 bowl)", cal: 180 },
    { name: "Jareesh (200g)", cal: 250 },
];

/* ── Main Component ── */
export default function CalorieCalculatorCore() {
    const [gender, setGender] = useState<"male" | "female">("male");
    const [age, setAge] = useState("30");
    const [weight, setWeight] = useState("75");
    const [height, setHeight] = useState("170");
    const [activity, setActivity] = useState("1.2");
    const [lossRate, setLossRate] = useState("0");

    const result = useMemo(() => {
        const a = Math.max(1, parseFloat(age) || 30);
        const w = Math.max(1, parseFloat(weight) || 75);
        const h = Math.max(1, parseFloat(height) || 170);
        const actFactor = parseFloat(activity);
        const deficit = parseFloat(lossRate);

        // Mifflin-St Jeor BMR
        const bmr = gender === "male"
            ? (10 * w) + (6.25 * h) - (5 * a) + 5
            : (10 * w) + (6.25 * h) - (5 * a) - 161;

        const tdee = bmr * actFactor;
        const targetCalories = Math.max(1200, tdee - deficit);

        // Macros (30/40/30)
        const proteinCal = targetCalories * 0.3;
        const carbCal = targetCalories * 0.4;
        const fatCal = targetCalories * 0.3;
        const proteinG = proteinCal / 4;
        const carbG = carbCal / 4;
        const fatG = fatCal / 9;

        // Weekly weight change (kg)
        const weeklyChange = deficit > 0 ? deficit * 7 / 7700 : 0;

        // How many Saudi foods fit
        const kabsaServings = targetCalories / 312;

        return { bmr, tdee, targetCalories, deficit, proteinG, carbG, fatG, weeklyChange, kabsaServings };
    }, [gender, age, weight, height, activity, lossRate]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة السعرات الحرارية — Calorie Calculator</h2>
                <p className="con-calc__desc">Calculate your daily calorie needs using the Mifflin-St Jeor equation. Includes TDEE, calorie deficit targets, and macronutrient breakdown.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {/* Personal Details */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 Personal Details</p>
                    <SelectField label="Gender" value={gender} onChange={(v) => setGender(v as "male" | "female")} options={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                    ]} />
                    <InputField label="Age" value={age} onChange={setAge} unit="years" min={1} max={120} />
                    <InputField label="Weight" value={weight} onChange={setWeight} unit="kg" min={1} max={300} />
                    <InputField label="Height" value={height} onChange={setHeight} unit="cm" min={50} max={250} />
                </div>

                {/* Activity & Goal */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>🏃 Activity Level & Goal</p>
                    <SelectField label="Activity Level" value={activity} onChange={setActivity} options={ACTIVITY_LEVELS} />
                    <SelectField label="Weight Loss Goal" value={lossRate} onChange={setLossRate} options={LOSS_RATES} />
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>Your Daily Calorie Needs</h4>

                {/* Main Number */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(0,100,70,0.06) 0%, rgba(0,100,70,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(0,100,70,0.12)", marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>
                        {result.deficit > 0 ? "Daily Target (with deficit)" : "Daily Maintenance Calories"}
                    </p>
                    <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#006446", letterSpacing: "-1px" }}>{fmt(result.targetCalories)} kcal</p>
                    {result.deficit > 0 && (
                        <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                            {fmt(result.deficit)} kcal/day deficit → ~{result.weeklyChange.toFixed(2)} kg/week loss
                        </p>
                    )}
                </div>

                <ResultRow label="Basal Metabolic Rate (BMR)" value={`${fmt(result.bmr)} kcal`} />
                <ResultRow label="Total Daily Energy Expenditure (TDEE)" value={`${fmt(result.tdee)} kcal`} highlight />
                {result.deficit > 0 && <ResultRow label="Daily Calorie Deficit" value={`−${fmt(result.deficit)} kcal`} sub />}

                {/* Macros */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <h4>Macronutrient Breakdown</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>Based on 30% protein · 40% carbs · 30% fat split</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-3)", marginBottom: "var(--s-3)" }}>
                    {[
                        { label: "Protein", g: result.proteinG, color: "#006446" },
                        { label: "Carbs", g: result.carbG, color: "#1a6fb5" },
                        { label: "Fat", g: result.fatG, color: "#c04e00" },
                    ].map((m) => (
                        <div key={m.label} style={{
                            textAlign: "center", padding: "var(--s-3)",
                            background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                        }}>
                            <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)" }}>{m.label}</p>
                            <p style={{ fontSize: "1.3rem", fontWeight: 700, color: m.color }}>{fmt(m.g)}g</p>
                        </div>
                    ))}
                </div>

                {/* Saudi Food Context */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <h4>🇸🇦 Saudi Food Reference</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>How many servings fit in your daily {fmt(result.targetCalories)} kcal target?</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--s-2)" }}>
                    {SAUDI_FOODS.map((f) => (
                        <div key={f.name} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                            border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.8rem",
                        }}>
                            <span style={{ color: "var(--n-text-secondary)" }}>{f.name}</span>
                            <span style={{ fontWeight: 600, color: "var(--n-text)" }}>{f.cal} kcal</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
