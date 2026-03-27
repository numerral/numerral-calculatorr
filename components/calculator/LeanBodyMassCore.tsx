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

/* ── Body fat categories ── */
interface BFCat { nameAr: string; maleMin: number; maleMax: number; femaleMin: number; femaleMax: number; color: string; emoji: string; }
const BF_CATS: BFCat[] = [
    { nameAr: "دهون أساسية", maleMin: 2, maleMax: 5, femaleMin: 10, femaleMax: 13, color: "#0284c7", emoji: "💪" },
    { nameAr: "رياضي", maleMin: 6, maleMax: 13, femaleMin: 14, femaleMax: 20, color: "#059669", emoji: "🏃" },
    { nameAr: "لياقة", maleMin: 14, maleMax: 17, femaleMin: 21, femaleMax: 24, color: "#2e7d32", emoji: "✅" },
    { nameAr: "متوسط", maleMin: 18, maleMax: 24, femaleMin: 25, femaleMax: 31, color: "#d97706", emoji: "🟡" },
    { nameAr: "سمنة", maleMin: 25, maleMax: 100, femaleMin: 32, femaleMax: 100, color: "#c62828", emoji: "🔴" },
];

function getBFCat(bf: number, gender: string): BFCat {
    const cats = BF_CATS;
    for (const c of cats) {
        const min = gender === "male" ? c.maleMin : c.femaleMin;
        const max = gender === "male" ? c.maleMax : c.femaleMax;
        if (bf >= min && bf <= max) return c;
    }
    return cats[cats.length - 1];
}

/* ── Tabs ── */
type TabKey = "formulas" | "bf" | "ffmi";

/* ── Main Component ── */
export default function LeanBodyMassCore() {
    const [gender, setGender] = useState("male");
    const [weight, setWeight] = useState("80");
    const [heightCm, setHeightCm] = useState("175");
    const [bodyFat, setBodyFat] = useState("");
    const [activeTab, setActiveTab] = useState<TabKey>("formulas");

    const result = useMemo(() => {
        const w = Math.max(30, parseFloat(weight) || 80);
        const h = Math.max(100, parseFloat(heightCm) || 175);
        const bf = parseFloat(bodyFat) || 0;
        const hM = h / 100;

        // Boer formula (1984) — most accurate for general use
        const boer = gender === "male"
            ? 0.407 * w + 0.267 * h - 19.2
            : 0.252 * w + 0.473 * h - 48.3;

        // James formula (1976)
        const james = gender === "male"
            ? 1.1 * w - 128 * ((w * w) / (h * h))
            : 1.07 * w - 148 * ((w * w) / (h * h));

        // Hume formula (1966)
        const hume = gender === "male"
            ? 0.32810 * w + 0.33929 * h - 29.5336
            : 0.29569 * w + 0.41813 * h - 43.2933;

        // Average of 3
        const avgLBM = (boer + james + hume) / 3;

        // If BF% provided — direct calculation
        const directLBM = bf > 0 ? w * (1 - bf / 100) : 0;
        const fatMass = bf > 0 ? w * (bf / 100) : w - avgLBM;

        // Use direct if BF given, otherwise average of formulas
        const primaryLBM = bf > 0 ? directLBM : avgLBM;
        const lbmPct = (primaryLBM / w) * 100;

        // FFMI (if BF or formulas available)
        const ffmi = primaryLBM / (hM * hM);
        const ffmiNorm = ffmi + 6.3 * (1.8 - hM);

        // BF category
        const bfPct = bf > 0 ? bf : ((w - primaryLBM) / w) * 100;
        const bfCat = getBFCat(bfPct, gender);

        return { boer, james, hume, avgLBM, directLBM, primaryLBM, fatMass: bf > 0 ? w * (bf / 100) : w - avgLBM, lbmPct, bfPct, bfCat, ffmi, ffmiNorm, w, bf };
    }, [gender, weight, heightCm, bodyFat]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة الكتلة العضلية الخالية من الدهون (LBM)</h2>
                <p className="con-calc__desc">احسب كتلة جسمك بدون دهون (عضلات + عظام + أعضاء) بـ 3 معادلات علمية + مؤشر FFMI.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 بياناتك</p>
                    <div className="con-input">
                        <label className="con-input__label">الجنس</label>
                        <select className="con-input__field" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                        </select>
                    </div>
                    <InputField label="الوزن" value={weight} onChange={setWeight} unit="كجم" min={30} max={250} />
                    <InputField label="الطول" value={heightCm} onChange={setHeightCm} unit="سم" min={100} max={230} />
                    <InputField label="نسبة الدهون (اختياري)" value={bodyFat} onChange={setBodyFat} unit="%" min={2} max={60} step={0.5} note="إذا عرفتها (DEXA/مقبض) — تعطي نتيجة أدق. بدونها نستخدم المعادلات." />
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>نتائج تركيب الجسم</h4>

                {/* Main LBM */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(5,150,105,0.06) 0%, rgba(5,150,105,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(5,150,105,0.15)", marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>الكتلة الخالية من الدهون (LBM)</p>
                    <p style={{ fontSize: "2.3rem", fontWeight: 800, color: "#059669" }}>{fmt(result.primaryLBM)} كجم</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--n-text-secondary)" }}>{fmt(result.lbmPct)}% من وزن الجسم</p>

                    {/* Visual bar */}
                    <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", margin: "var(--s-3) 0 var(--s-2)", border: "1px solid var(--n-border)" }}>
                        <div style={{ width: `${result.lbmPct}%`, background: "linear-gradient(90deg, #059669, #2e7d32)", borderRadius: "8px 0 0 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#fff", fontWeight: 700 }}>
                            عضلات {fmt(result.lbmPct, 0)}%
                        </div>
                        <div style={{ flex: 1, background: "rgba(217,119,6,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#d97706", fontWeight: 700 }}>
                            دهون {fmt(result.bfPct, 0)}%
                        </div>
                    </div>
                </div>

                {/* Key metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>كتلة الدهون</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#d97706" }}>{fmt(result.fatMass)} كجم</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>نسبة الدهون</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700, color: result.bfCat.color }}>{result.bfCat.emoji} {fmt(result.bfPct)}%</p>
                        <p style={{ fontSize: "0.68rem", color: result.bfCat.color }}>{result.bfCat.nameAr}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>FFMI</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700, color: result.ffmiNorm > 25 ? "#c62828" : result.ffmiNorm > 22 ? "#059669" : "var(--n-text)" }}>{fmt(result.ffmiNorm)}</p>
                        <p style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>معدّل للطول</p>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "formulas" as TabKey, label: "📐 المعادلات الثلاث" },
                        { key: "bf" as TabKey, label: "📊 نسبة الدهون" },
                        { key: "ffmi" as TabKey, label: "💪 مؤشر FFMI" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #059669" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(5,150,105,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#059669" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "formulas" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {[
                            { name: "Boer (1984)", value: result.boer, note: "الأدق للاستخدام العام" },
                            { name: "James (1976)", value: result.james, note: "قد يقلل التقدير في السمنة" },
                            { name: "Hume (1966)", value: result.hume, note: "أنسب للأشخاص الأكبر حجماً" },
                        ].map(f => (
                            <div key={f.name} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <div>
                                    <span style={{ fontWeight: 700 }}>{f.name}</span>
                                    <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>{f.note}</p>
                                </div>
                                <span style={{ fontWeight: 700, color: "#059669" }}>{fmt(f.value)} كجم</span>
                            </div>
                        ))}
                        {result.bf > 0 && (
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)", background: "rgba(5,150,105,0.06)",
                                border: "2px solid rgba(5,150,105,0.25)", borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <div>
                                    <span style={{ fontWeight: 700 }}>✅ حساب مباشر (من نسبة الدهون)</span>
                                    <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>الأدق — يعتمد على BF% المُدخلة</p>
                                </div>
                                <span style={{ fontWeight: 700, color: "#059669" }}>{fmt(result.directLBM)} كجم</span>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "bf" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {BF_CATS.map(c => (
                            <div key={c.nameAr} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)",
                                background: result.bfCat.nameAr === c.nameAr ? `${c.color}0a` : "var(--n-surface)",
                                border: result.bfCat.nameAr === c.nameAr ? `2px solid ${c.color}28` : "1px solid var(--n-border)",
                                borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span>{c.emoji} <strong>{c.nameAr}</strong></span>
                                <span style={{ color: c.color, fontWeight: 700 }}>
                                    ♂ {c.maleMin}-{c.maleMax === 100 ? "+" : c.maleMax}% · ♀ {c.femaleMin}-{c.femaleMax === 100 ? "+" : c.femaleMax}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "ffmi" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {[
                            { label: "أقل من المتوسط", range: "< 18", color: "#d97706" },
                            { label: "متوسط", range: "18 – 20", color: "var(--n-text)" },
                            { label: "فوق المتوسط", range: "20 – 22", color: "#059669" },
                            { label: "عضلي جداً", range: "22 – 25", color: "#2e7d32" },
                            { label: "فوق 25 — يحتاج مراجعة", range: "> 25", color: "#c62828" },
                        ].map(f => (
                            <div key={f.label} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)",
                                background: (result.ffmiNorm >= 25 && f.range === "> 25") || (result.ffmiNorm >= 22 && result.ffmiNorm < 25 && f.range === "22 – 25") || (result.ffmiNorm >= 20 && result.ffmiNorm < 22 && f.range === "20 – 22") || (result.ffmiNorm >= 18 && result.ffmiNorm < 20 && f.range === "18 – 20") || (result.ffmiNorm < 18 && f.range === "< 18") ? "rgba(5,150,105,0.06)" : "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span><strong>{f.label}</strong></span>
                                <span style={{ fontWeight: 700, color: f.color }}>{f.range}</span>
                            </div>
                        ))}
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>
                            FFMI = الكتلة الخالية من الدهون ÷ الطول(م)² + تعديل الطول. FFMI &gt; 25 نادر طبيعياً.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
