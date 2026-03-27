"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 1) => n.toFixed(d);

/* ── Sub-components ── */
function InputField({ label, value, onChange, unit, min, max, step, note }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; note?: string;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min ?? 0} max={max} step={step || 1} placeholder="0" />
            {note && <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{note}</p>}
        </div>
    );
}

/* ── BMI Categories ── */
interface BmiCategory { nameAr: string; nameEn: string; min: number; max: number; color: string; emoji: string; riskAr: string; }
const BMI_CATS: BmiCategory[] = [
    { nameAr: "نحافة شديدة", nameEn: "Severe Underweight", min: 0, max: 16, color: "#0077b6", emoji: "🔵", riskAr: "خطر مرتفع — سوء تغذية، ضعف مناعة" },
    { nameAr: "نحافة", nameEn: "Underweight", min: 16, max: 18.5, color: "#2196f3", emoji: "🟦", riskAr: "خطر متوسط — فقر دم، هشاشة عظام" },
    { nameAr: "طبيعي", nameEn: "Normal", min: 18.5, max: 25, color: "#2e7d32", emoji: "🟢", riskAr: "خطر منخفض — الوزن الصحي المثالي" },
    { nameAr: "زيادة وزن", nameEn: "Overweight", min: 25, max: 30, color: "#f9a825", emoji: "🟡", riskAr: "خطر مرتفع قليلاً — ضغط، كولسترول" },
    { nameAr: "سمنة درجة أولى", nameEn: "Obese Class I", min: 30, max: 35, color: "#e65100", emoji: "🟠", riskAr: "خطر مرتفع — سكري نوع 2، قلب" },
    { nameAr: "سمنة درجة ثانية", nameEn: "Obese Class II", min: 35, max: 40, color: "#c62828", emoji: "🔴", riskAr: "خطر مرتفع جداً — أمراض مزمنة" },
    { nameAr: "سمنة مفرطة", nameEn: "Obese Class III", min: 40, max: 100, color: "#880e4f", emoji: "🟣", riskAr: "خطر شديد — تدخل طبي مطلوب" },
];

function getCategory(bmi: number): BmiCategory {
    return BMI_CATS.find(c => bmi >= c.min && bmi < c.max) || BMI_CATS[BMI_CATS.length - 1];
}

/* ── Tabs ── */
type TabKey = "chart" | "waist" | "ideal";

/* ── Main Component ── */
export default function BMICalculatorCore() {
    const [weight, setWeight] = useState("70");
    const [heightCm, setHeightCm] = useState("170");
    const [waistCm, setWaistCm] = useState("");
    const [gender, setGender] = useState<"male" | "female">("male");
    const [activeTab, setActiveTab] = useState<TabKey>("chart");

    const result = useMemo(() => {
        const w = Math.max(10, parseFloat(weight) || 70);
        const hCm = Math.max(50, parseFloat(heightCm) || 170);
        const hM = hCm / 100;
        const bmi = w / (hM * hM);
        const cat = getCategory(bmi);

        // Healthy weight range
        const minHealthy = 18.5 * hM * hM;
        const maxHealthy = 24.9 * hM * hM;

        // Weight to lose/gain to reach healthy
        let delta = 0;
        if (bmi < 18.5) delta = minHealthy - w;
        else if (bmi >= 25) delta = w - maxHealthy;

        // Waist risk
        const waist = parseFloat(waistCm) || 0;
        let waistRisk = "";
        let waistColor = "";
        if (waist > 0) {
            if (gender === "male") {
                if (waist > 102) { waistRisk = "مرتفع جداً"; waistColor = "#c02020"; }
                else if (waist > 94) { waistRisk = "مرتفع"; waistColor = "#c57600"; }
                else { waistRisk = "طبيعي"; waistColor = "#006446"; }
            } else {
                if (waist > 88) { waistRisk = "مرتفع جداً"; waistColor = "#c02020"; }
                else if (waist > 80) { waistRisk = "مرتفع"; waistColor = "#c57600"; }
                else { waistRisk = "طبيعي"; waistColor = "#006446"; }
            }
        }

        // BMI Prime
        const bmiPrime = bmi / 25;

        return { bmi, cat, minHealthy, maxHealthy, delta, waistRisk, waistColor, bmiPrime };
    }, [weight, heightCm, waistCm, gender]);

    // Bar position (BMI 12-45 range)
    const barPct = Math.min(100, Math.max(0, ((result.bmi - 12) / (45 - 12)) * 100));

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة مؤشر كتلة الجسم (BMI)</h2>
                <p className="con-calc__desc">احسب مؤشر كتلة جسمك من الوزن والطول — مع تصنيف منظمة الصحة العالمية ومحيط الخصر والوزن المثالي.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 بياناتك</p>
                    <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <div className="con-input">
                                <label className="con-input__label">الجنس</label>
                                <select className="con-input__field" value={gender} onChange={(e) => setGender(e.target.value as "male" | "female")}>
                                    <option value="male">ذكر</option>
                                    <option value="female">أنثى</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <InputField label="الوزن" value={weight} onChange={setWeight} unit="كجم" min={20} max={300} />
                    <InputField label="الطول" value={heightCm} onChange={setHeightCm} unit="سم" min={100} max={250} />
                    <InputField label="محيط الخصر (اختياري)" value={waistCm} onChange={setWaistCm} unit="سم" min={40} max={200} note="أضيق جزء من الجذع — لتقييم خطر الدهون الحشوية" />
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>نتيجة مؤشر كتلة الجسم</h4>

                {/* Main BMI result */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: `linear-gradient(135deg, ${result.cat.color}08 0%, ${result.cat.color}03 100%)`,
                    borderRadius: "var(--r-md)", border: `1px solid ${result.cat.color}20`, marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "2.5rem", fontWeight: 800, color: result.cat.color }}>{fmt(result.bmi)}</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: result.cat.color, marginTop: "var(--s-1)" }}>
                        {result.cat.emoji} {result.cat.nameAr}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{result.cat.nameEn}</p>

                    {/* BMI bar */}
                    <div style={{ position: "relative", height: 12, borderRadius: 6, overflow: "hidden", margin: "var(--s-4) 0 var(--s-2)", background: "linear-gradient(90deg, #0077b6 0%, #2196f3 15%, #2e7d32 25%, #2e7d32 40%, #f9a825 50%, #e65100 65%, #c62828 80%, #880e4f 100%)" }}>
                        <div style={{
                            position: "absolute", top: -2, width: 4, height: 16, background: "#fff",
                            border: "2px solid #333", borderRadius: 2,
                            left: `${barPct}%`, transform: "translateX(-50%)",
                        }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--n-text-muted)" }}>
                        <span>12</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span><span>45</span>
                    </div>

                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-3)" }}>{result.cat.riskAr}</p>
                </div>

                {/* Key metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>الوزن الصحي</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2e7d32" }}>{fmt(result.minHealthy)} – {fmt(result.maxHealthy)} كجم</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>BMI Prime</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: result.bmiPrime > 1 ? "#c57600" : "#2e7d32" }}>{fmt(result.bmiPrime, 2)}</p>
                    </div>
                    {result.delta > 0 && (
                        <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                            <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>{result.bmi < 18.5 ? "تحتاج زيادة" : "تحتاج خسارة"}</p>
                            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: result.cat.color }}>{fmt(result.delta)} كجم</p>
                        </div>
                    )}
                    {result.waistRisk && (
                        <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                            <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>خطر محيط الخصر</p>
                            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: result.waistColor }}>{result.waistRisk}</p>
                        </div>
                    )}
                </div>

                {/* ── Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "chart" as TabKey, label: "📊 تصنيف WHO" },
                        { key: "waist" as TabKey, label: "📏 محيط الخصر" },
                        { key: "ideal" as TabKey, label: "⚖️ الوزن المثالي" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #2e7d32" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(46,125,50,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#2e7d32" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "chart" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {BMI_CATS.map(c => (
                            <div key={c.nameEn} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)", background: result.cat.nameEn === c.nameEn ? `${c.color}0a` : "var(--n-surface)",
                                border: result.cat.nameEn === c.nameEn ? `2px solid ${c.color}30` : "1px solid var(--n-border)",
                                borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span>{c.emoji} <strong>{c.nameAr}</strong> <span style={{ color: "var(--n-text-muted)" }}>({c.nameEn})</span></span>
                                <span style={{ fontWeight: 700, color: c.color }}>{c.min === 0 ? `< ${c.max}` : c.max === 100 ? `≥ ${c.min}` : `${c.min} – ${c.max}`}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "waist" && (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                        <p style={{ marginBottom: "var(--s-3)", color: "var(--n-text-muted)" }}>محيط الخصر يكشف دهون البطن الحشوية (Visceral Fat) — أخطر من BMI وحده.</p>
                        <div style={{ display: "grid", gap: "var(--s-2)" }}>
                            {[
                                { label: "رجال — طبيعي", range: "≤ 94 سم", color: "#006446" },
                                { label: "رجال — مرتفع", range: "94 – 102 سم", color: "#c57600" },
                                { label: "رجال — مرتفع جداً", range: "> 102 سم", color: "#c02020" },
                                { label: "نساء — طبيعي", range: "≤ 80 سم", color: "#006446" },
                                { label: "نساء — مرتفع", range: "80 – 88 سم", color: "#c57600" },
                                { label: "نساء — مرتفع جداً", range: "> 88 سم", color: "#c02020" },
                            ].map(r => (
                                <div key={r.label} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                    border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                                }}>
                                    <span>{r.label}</span>
                                    <span style={{ fontWeight: 700, color: r.color }}>{r.range}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "ideal" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {[150, 155, 160, 165, 170, 175, 180, 185, 190].map(h => {
                            const hM = h / 100;
                            return (
                                <div key={h} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "var(--s-2) var(--s-3)",
                                    background: parseInt(heightCm) === h ? "rgba(46,125,50,0.06)" : "var(--n-surface)",
                                    border: parseInt(heightCm) === h ? "2px solid rgba(46,125,50,0.3)" : "1px solid var(--n-border)",
                                    borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                                }}>
                                    <span>الطول <strong>{h} سم</strong></span>
                                    <span style={{ fontWeight: 700, color: "#2e7d32" }}>{fmt(18.5 * hM * hM)} – {fmt(24.9 * hM * hM)} كجم</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
