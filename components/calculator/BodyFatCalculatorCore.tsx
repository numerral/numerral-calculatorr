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
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min ?? 0} max={max} step={step || 0.1} placeholder="0" />
            {note && <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{note}</p>}
        </div>
    );
}

/* ── BF categories (ACE) ── */
interface BFCat { nameAr: string; maleMin: number; maleMax: number; femaleMin: number; femaleMax: number; color: string; emoji: string; }
const BF_CATS: BFCat[] = [
    { nameAr: "دهون أساسية", maleMin: 0, maleMax: 5, femaleMin: 0, femaleMax: 13, color: "#0284c7", emoji: "💪" },
    { nameAr: "رياضي", maleMin: 6, maleMax: 13, femaleMin: 14, femaleMax: 20, color: "#059669", emoji: "🏃" },
    { nameAr: "لياقة", maleMin: 14, maleMax: 17, femaleMin: 21, femaleMax: 24, color: "#2e7d32", emoji: "✅" },
    { nameAr: "متوسط", maleMin: 18, maleMax: 24, femaleMin: 25, femaleMax: 31, color: "#d97706", emoji: "🟡" },
    { nameAr: "سمنة", maleMin: 25, maleMax: 100, femaleMin: 32, femaleMax: 100, color: "#c62828", emoji: "🔴" },
];

function getBFCat(bf: number, gender: string): BFCat {
    for (const c of BF_CATS) {
        const min = gender === "male" ? c.maleMin : c.femaleMin;
        const max = gender === "male" ? c.maleMax : c.femaleMax;
        if (bf >= min && bf <= max) return c;
    }
    return BF_CATS[BF_CATS.length - 1];
}

/* ── Tabs ── */
type TabKey = "methods" | "categories" | "age";

/* ── Main Component ── */
export default function BodyFatCalculatorCore() {
    const [gender, setGender] = useState("male");
    const [age, setAge] = useState("30");
    const [weight, setWeight] = useState("80");
    const [heightCm, setHeightCm] = useState("175");
    const [waist, setWaist] = useState("85");
    const [neck, setNeck] = useState("38");
    const [hip, setHip] = useState("95");
    const [activeTab, setActiveTab] = useState<TabKey>("methods");

    const result = useMemo(() => {
        const w = Math.max(30, parseFloat(weight) || 80);
        const h = Math.max(100, parseFloat(heightCm) || 175);
        const a = Math.max(15, parseFloat(age) || 30);
        const waistCm = Math.max(50, parseFloat(waist) || 85);
        const neckCm = Math.max(25, parseFloat(neck) || 38);
        const hipCm = Math.max(60, parseFloat(hip) || 95);
        const hM = h / 100;

        // Convert to inches for Navy formula
        const hIn = h / 2.54;
        const waistIn = waistCm / 2.54;
        const neckIn = neckCm / 2.54;
        const hipIn = hipCm / 2.54;

        // US Navy Method
        let navy: number;
        if (gender === "male") {
            navy = 86.010 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(hIn) + 36.76;
        } else {
            navy = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(hIn) - 78.387;
        }
        navy = Math.max(2, Math.min(60, navy));

        // BMI Method
        const bmi = w / (hM * hM);
        let bmiMethod: number;
        if (gender === "male") {
            bmiMethod = 1.20 * bmi + 0.23 * a - 16.2;
        } else {
            bmiMethod = 1.20 * bmi + 0.23 * a - 5.4;
        }
        bmiMethod = Math.max(2, Math.min(60, bmiMethod));

        // Average
        const avg = (navy + bmiMethod) / 2;

        // Body composition
        const fatMass = w * (avg / 100);
        const lbm = w - fatMass;

        // BMI category
        const cat = getBFCat(avg, gender);

        // FFMI
        const ffmi = lbm / (hM * hM);
        const ffmiNorm = ffmi + 6.3 * (1.8 - hM);

        return { navy, bmiMethod, avg, bmi, fatMass, lbm, cat, ffmi, ffmiNorm, w };
    }, [gender, age, weight, heightCm, waist, neck, hip]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة نسبة الدهون في الجسم</h2>
                <p className="con-calc__desc">احسب نسبة دهون جسمك بطريقتين (Navy + BMI) مع تصنيف ACE وتحليل تركيب الجسم.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 بياناتك</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-2)" }}>
                        <div className="con-input">
                            <label className="con-input__label">الجنس</label>
                            <select className="con-input__field" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="male">ذكر</option>
                                <option value="female">أنثى</option>
                            </select>
                        </div>
                        <InputField label="العمر" value={age} onChange={setAge} unit="سنة" min={15} max={80} step={1} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-2)" }}>
                        <InputField label="الوزن" value={weight} onChange={setWeight} unit="كجم" min={30} max={250} step={0.5} />
                        <InputField label="الطول" value={heightCm} onChange={setHeightCm} unit="سم" min={100} max={230} step={1} />
                    </div>
                </div>

                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📏 القياسات (لطريقة Navy)</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>قيسي بشريط القياس — شدّي بدون ضغط على الجلد</p>
                    <InputField label="محيط الخصر" value={waist} onChange={setWaist} unit="سم" min={50} max={180} note="عند السرة — أضيق نقطة" />
                    <InputField label="محيط الرقبة" value={neck} onChange={setNeck} unit="سم" min={25} max={60} note="تحت تفاحة آدم مباشرة" />
                    {gender === "female" && (
                        <InputField label="محيط الأرداف" value={hip} onChange={setHip} unit="سم" min={60} max={180} note="أعرض نقطة في الأرداف" />
                    )}
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>نتائج نسبة الدهون</h4>

                {/* Main result */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: `${result.cat.color}08`, borderRadius: "var(--r-md)",
                    border: `1px solid ${result.cat.color}20`, marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>نسبة الدهون (متوسط الطريقتين)</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: 800, color: result.cat.color }}>{fmt(result.avg)}%</p>
                    <p style={{ fontSize: "0.92rem", fontWeight: 700, color: result.cat.color }}>{result.cat.emoji} {result.cat.nameAr}</p>

                    {/* Visual bar */}
                    <div style={{ display: "flex", height: 18, borderRadius: 9, overflow: "hidden", margin: "var(--s-3) 0 var(--s-2)", border: "1px solid var(--n-border)" }}>
                        <div style={{ width: `${100 - result.avg}%`, background: "linear-gradient(90deg, #059669, #2e7d32)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#fff", fontWeight: 700 }}>
                            كتلة خالية {fmt(100 - result.avg, 0)}%
                        </div>
                        <div style={{ flex: 1, background: `${result.cat.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: result.cat.color, fontWeight: 700 }}>
                            دهون {fmt(result.avg, 0)}%
                        </div>
                    </div>
                </div>

                {/* Key metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    {[
                        { label: "كتلة الدهون", value: `${fmt(result.fatMass)} كجم`, color: "#d97706" },
                        { label: "كتلة خالية (LBM)", value: `${fmt(result.lbm)} كجم`, color: "#059669" },
                        { label: "BMI", value: fmt(result.bmi), color: "var(--n-text)" },
                        { label: "FFMI المعدّل", value: fmt(result.ffmiNorm), color: result.ffmiNorm > 25 ? "#c62828" : "#059669" },
                    ].map(m => (
                        <div key={m.label} style={{ padding: "var(--s-3)", textAlign: "center", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                            <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>{m.label}</p>
                            <p style={{ fontSize: "1rem", fontWeight: 700, color: m.color }}>{m.value}</p>
                        </div>
                    ))}
                </div>

                {/* Two methods */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    <div style={{ padding: "var(--s-3)", textAlign: "center", background: "rgba(2,132,199,0.05)", border: "1px solid rgba(2,132,199,0.15)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>🎖️ Navy Method</p>
                        <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0284c7" }}>{fmt(result.navy)}%</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", textAlign: "center", background: "rgba(147,51,234,0.05)", border: "1px solid rgba(147,51,234,0.15)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>📊 BMI Method</p>
                        <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#9333ea" }}>{fmt(result.bmiMethod)}%</p>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "methods" as TabKey, label: "📐 طرق القياس" },
                        { key: "categories" as TabKey, label: "📊 فئات الدهون" },
                        { key: "age" as TabKey, label: "👤 حسب العمر" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #0284c7" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(2,132,199,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#0284c7" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "methods" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {[
                            { name: "DEXA Scan", accuracy: "±1.5%", cost: "مرتفع", note: "الأدق — أشعة سينية ثنائية" },
                            { name: "Hydrostatic (تحت الماء)", accuracy: "±2%", cost: "مرتفع", note: "وزن تحت الماء" },
                            { name: "Bod Pod (ضغط هواء)", accuracy: "±2%", cost: "مرتفع", note: "نادر التوفر" },
                            { name: "مقبض الدهون (Calipers)", accuracy: "±3-4%", cost: "منخفض", note: "قياس ثنيات الجلد" },
                            { name: "US Navy Method (محيطات)", accuracy: "±3%", cost: "صفر", note: "شريط قياس فقط ✅" },
                            { name: "ميزان BIA (ذكي)", accuracy: "±4-5%", cost: "متوسط", note: "التحليل الكهربائي" },
                        ].map(m => (
                            <div key={m.name} style={{
                                display: "grid", gridTemplateColumns: "1fr auto auto",
                                gap: "var(--s-2)", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.8rem",
                            }}>
                                <div>
                                    <span style={{ fontWeight: 700 }}>{m.name}</span>
                                    <p style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>{m.note}</p>
                                </div>
                                <span style={{ color: "#059669", fontWeight: 700 }}>{m.accuracy}</span>
                                <span style={{ color: "var(--n-text-muted)", fontSize: "0.72rem" }}>{m.cost}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "categories" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {BF_CATS.map(c => (
                            <div key={c.nameAr} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)",
                                background: result.cat.nameAr === c.nameAr ? `${c.color}0a` : "var(--n-surface)",
                                border: result.cat.nameAr === c.nameAr ? `2px solid ${c.color}28` : "1px solid var(--n-border)",
                                borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span>{c.emoji} <strong>{c.nameAr}</strong></span>
                                <span style={{ color: c.color, fontWeight: 700 }}>
                                    ♂ {c.maleMin}-{c.maleMax === 100 ? "+" : c.maleMax}% · ♀ {c.femaleMin}-{c.femaleMax === 100 ? "+" : c.femaleMax}%
                                </span>
                            </div>
                        ))}
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>المصدر: American Council on Exercise (ACE)</p>
                    </div>
                )}

                {activeTab === "age" && (
                    <div style={{ display: "grid", gap: "var(--s-1)" }}>
                        {[
                            { age: "20-39", male: "8-19%", female: "21-32%" },
                            { age: "40-59", male: "11-21%", female: "23-33%" },
                            { age: "60-79", male: "13-24%", female: "24-35%" },
                        ].map(r => (
                            <div key={r.age} style={{
                                display: "grid", gridTemplateColumns: "auto 1fr 1fr",
                                gap: "var(--s-3)", alignItems: "center",
                                padding: "8px var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span style={{ fontWeight: 700 }}>{r.age} سنة</span>
                                <span style={{ color: "#0284c7" }}>♂ {r.male}</span>
                                <span style={{ color: "#be185d" }}>♀ {r.female}</span>
                            </div>
                        ))}
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>المرجع: ACSM + Forbes Health</p>
                    </div>
                )}
            </div>
        </div>
    );
}
