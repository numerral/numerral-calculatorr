"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 0) => n.toFixed(d);

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

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </div>
    );
}

/* ── Carb strategies ── */
interface CarbStrategy { nameAr: string; nameEn: string; carbPct: number; protPct: number; fatPct: number; emoji: string; descAr: string; }
const STRATEGIES: Record<string, CarbStrategy> = {
    keto: { nameAr: "كيتو", nameEn: "Keto", carbPct: 5, protPct: 20, fatPct: 75, emoji: "🥑", descAr: "منخفض جداً — 20-50 غ/يوم. يحفز الكيتوزيس (حرق الدهون بدل السكر)." },
    lowCarb: { nameAr: "منخفض الكارب", nameEn: "Low Carb", carbPct: 20, protPct: 30, fatPct: 50, emoji: "🥩", descAr: "50-130 غ/يوم. مناسب لخسارة الوزن والسيطرة على السكر." },
    moderate: { nameAr: "متوسط", nameEn: "Moderate", carbPct: 45, protPct: 25, fatPct: 30, emoji: "⚖️", descAr: "130-225 غ/يوم. متوازن ومستدام — الأقل خطورة حسب Harvard." },
    highCarb: { nameAr: "مرتفع الكارب", nameEn: "High Carb", carbPct: 55, protPct: 20, fatPct: 25, emoji: "🍚", descAr: "225-325 غ/يوم. مناسب للرياضيين وأصحاب النشاط العالي." },
    athlete: { nameAr: "رياضي مكثف", nameEn: "Athletic", carbPct: 65, protPct: 15, fatPct: 20, emoji: "🏃", descAr: "325+ غ/يوم. ماراثون، كرة قدم، رياضات تحمّل." },
};

/* ── Activity multipliers (Mifflin-St Jeor TDEE) ── */
const ACTIVITY: { value: string; label: string; factor: number }[] = [
    { value: "1.2", label: "قليل النشاط (مكتبي)", factor: 1.2 },
    { value: "1.375", label: "نشاط خفيف (1-3 أيام/أسبوع)", factor: 1.375 },
    { value: "1.55", label: "نشاط متوسط (3-5 أيام/أسبوع)", factor: 1.55 },
    { value: "1.725", label: "نشاط عالي (6-7 أيام/أسبوع)", factor: 1.725 },
    { value: "1.9", label: "نشاط مكثف جداً (رياضي/عمل بدني)", factor: 1.9 },
];

/* ── Tabs ── */
type TabKey = "macros" | "gi" | "foods";

/* ── Arab food carb data ── */
const ARAB_FOODS = [
    { name: "أرز بسمتي (كوب مطبوخ)", carbs: 45, gi: "58 — متوسط", fiber: 0.6 },
    { name: "أرز مصري (كوب مطبوخ)", carbs: 53, gi: "73 — مرتفع", fiber: 0.4 },
    { name: "خبز عربي (رغيف)", carbs: 33, gi: "57 — متوسط", fiber: 1.3 },
    { name: "خبز أبيض (شريحة)", carbs: 14, gi: "75 — مرتفع", fiber: 0.6 },
    { name: "خبز تنور كامل (رغيف)", carbs: 30, gi: "45 — منخفض", fiber: 4.0 },
    { name: "كبسة (طبق)", carbs: 55, gi: "متوسط", fiber: 2 },
    { name: "مندي (طبق)", carbs: 50, gi: "متوسط", fiber: 1.5 },
    { name: "مجبوس (طبق)", carbs: 48, gi: "متوسط", fiber: 2 },
    { name: "فول مدمس (كوب)", carbs: 33, gi: "40 — منخفض", fiber: 9 },
    { name: "حمص (كوب)", carbs: 45, gi: "28 — منخفض", fiber: 13 },
    { name: "تمر (3 حبات)", carbs: 54, gi: "42 — منخفض", fiber: 5 },
    { name: "لقيمات (5 حبات)", carbs: 40, gi: "مرتفع", fiber: 0.5 },
];

/* ── Main Component ── */
export default function CarbCalculatorCore() {
    const [gender, setGender] = useState("male");
    const [age, setAge] = useState("30");
    const [weight, setWeight] = useState("75");
    const [heightCm, setHeightCm] = useState("175");
    const [activityFactor, setActivityFactor] = useState("1.55");
    const [goal, setGoal] = useState("maintain");
    const [strategy, setStrategy] = useState("moderate");
    const [activeTab, setActiveTab] = useState<TabKey>("macros");

    const result = useMemo(() => {
        const a = Math.max(15, parseFloat(age) || 30);
        const w = Math.max(30, parseFloat(weight) || 75);
        const h = Math.max(100, parseFloat(heightCm) || 175);
        const af = parseFloat(activityFactor);

        // Mifflin-St Jeor BMR
        let bmr = 10 * w + 6.25 * h - 5 * a;
        bmr += gender === "male" ? 5 : -161;

        // TDEE
        let tdee = bmr * af;

        // Goal adjustment
        let targetCal = tdee;
        let goalLabelAr = "الحفاظ على الوزن";
        if (goal === "lose") { targetCal = tdee - 500; goalLabelAr = "خسارة وزن (-500 سعرة)"; }
        else if (goal === "loseFast") { targetCal = tdee - 750; goalLabelAr = "خسارة سريعة (-750 سعرة)"; }
        else if (goal === "gain") { targetCal = tdee + 300; goalLabelAr = "بناء عضلات (+300 سعرة)"; }
        else if (goal === "gainFast") { targetCal = tdee + 500; goalLabelAr = "زيادة وزن (+500 سعرة)"; }

        const s = STRATEGIES[strategy];

        // Macro grams
        const carbGrams = (targetCal * (s.carbPct / 100)) / 4;
        const protGrams = (targetCal * (s.protPct / 100)) / 4;
        const fatGrams = (targetCal * (s.fatPct / 100)) / 9;

        // Fiber recommendation (14g per 1000 cal, min 25)
        const fiberRec = Math.max(25, Math.round((targetCal / 1000) * 14));

        return { bmr, tdee, targetCal, goalLabelAr, s, carbGrams, protGrams, fatGrams, fiberRec };
    }, [gender, age, weight, heightCm, activityFactor, goal, strategy]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة الكربوهيدرات اليومية</h2>
                <p className="con-calc__desc">احسب احتياجك اليومي من الكارب والبروتين والدهون بناءً على سعراتك وهدفك واستراتيجيتك الغذائية.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 بياناتك</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-2)" }}>
                        <SelectField label="الجنس" value={gender} onChange={setGender} options={[{ value: "male", label: "ذكر" }, { value: "female", label: "أنثى" }]} />
                        <InputField label="العمر" value={age} onChange={setAge} unit="سنة" min={15} max={80} />
                    </div>
                    <InputField label="الوزن" value={weight} onChange={setWeight} unit="كجم" min={30} max={250} />
                    <InputField label="الطول" value={heightCm} onChange={setHeightCm} unit="سم" min={120} max={220} />
                    <SelectField label="مستوى النشاط" value={activityFactor} onChange={setActivityFactor} options={ACTIVITY.map(a => ({ value: a.value, label: a.label }))} />
                </div>

                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>🎯 الهدف والاستراتيجية</p>
                    <SelectField label="الهدف" value={goal} onChange={setGoal} options={[
                        { value: "loseFast", label: "خسارة سريعة (−750 سعرة)" },
                        { value: "lose", label: "خسارة وزن (−500 سعرة)" },
                        { value: "maintain", label: "الحفاظ على الوزن" },
                        { value: "gain", label: "بناء عضلات (+300 سعرة)" },
                        { value: "gainFast", label: "زيادة وزن (+500 سعرة)" },
                    ]} />
                    <SelectField label="استراتيجية الكارب" value={strategy} onChange={setStrategy} options={Object.entries(STRATEGIES).map(([k, v]) => ({ value: k, label: `${v.emoji} ${v.nameAr} (${v.carbPct}% كارب)` }))} />
                    <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{result.s.descAr}</p>
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>نتيجة الماكروز اليومية</h4>

                {/* Calorie badges */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>TDEE</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--n-text)" }}>{fmt(result.tdee)} سعرة</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>السعرات المستهدفة</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#c57600" }}>{fmt(result.targetCal)} سعرة</p>
                        <p style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>{result.goalLabelAr}</p>
                    </div>
                </div>

                {/* Macro breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    {[
                        { label: "🍞 كارب", grams: result.carbGrams, pct: result.s.carbPct, color: "#d97706" },
                        { label: "🥩 بروتين", grams: result.protGrams, pct: result.s.protPct, color: "#dc2626" },
                        { label: "🥑 دهون", grams: result.fatGrams, pct: result.s.fatPct, color: "#059669" },
                    ].map(m => (
                        <div key={m.label} style={{
                            padding: "var(--s-3)", textAlign: "center",
                            background: `${m.color}08`, border: `1px solid ${m.color}20`,
                            borderRadius: "var(--r-sm)",
                        }}>
                            <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)" }}>{m.label}</p>
                            <p style={{ fontSize: "1.4rem", fontWeight: 800, color: m.color }}>{fmt(m.grams)} غ</p>
                            <p style={{ fontSize: "0.7rem", color: m.color }}>{m.pct}% · {fmt(m.grams * (m.label.includes("دهون") ? 9 : 4))} سعرة</p>
                        </div>
                    ))}
                </div>

                {/* Fiber */}
                <div style={{ padding: "var(--s-2) var(--s-3)", background: "rgba(5,150,105,0.05)", border: "1px solid rgba(5,150,105,0.15)", borderRadius: "var(--r-sm)", fontSize: "0.82rem", textAlign: "center", marginBottom: "var(--s-3)" }}>
                    🥦 الألياف الموصى بها: <strong style={{ color: "#059669" }}>{result.fiberRec} غ/يوم</strong> <span style={{ color: "var(--n-text-muted)" }}>(14 غ لكل 1000 سعرة)</span>
                </div>

                {/* ── Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "macros" as TabKey, label: "📊 مقارنة الاستراتيجيات" },
                        { key: "gi" as TabKey, label: "📈 المؤشر الغلايسيمي" },
                        { key: "foods" as TabKey, label: "🍚 أطعمة عربية" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #d97706" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(217,119,6,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#d97706" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "macros" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {Object.entries(STRATEGIES).map(([k, s]) => (
                            <div key={k} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)",
                                background: strategy === k ? "rgba(217,119,6,0.06)" : "var(--n-surface)",
                                border: strategy === k ? "2px solid rgba(217,119,6,0.3)" : "1px solid var(--n-border)",
                                borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span>{s.emoji} <strong>{s.nameAr}</strong></span>
                                <span style={{ color: "var(--n-text-muted)" }}>{s.carbPct}% كارب · {s.protPct}% بروتين · {s.fatPct}% دهون</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "gi" && (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                        <div style={{ display: "grid", gap: "var(--s-2)" }}>
                            {[
                                { label: "🟢 منخفض (≤ 55)", desc: "ارتفاع بطيء — بقوليات، خضار، تمر، حمص", color: "#059669" },
                                { label: "🟡 متوسط (56-69)", desc: "ارتفاع معتدل — أرز بسمتي، خبز عربي", color: "#d97706" },
                                { label: "🔴 مرتفع (≥ 70)", desc: "ارتفاع سريع — خبز أبيض، أرز مصري، لقيمات", color: "#dc2626" },
                            ].map(g => (
                                <div key={g.label} style={{
                                    padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                    border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                                    borderInlineStart: `4px solid ${g.color}`,
                                }}>
                                    <p style={{ fontWeight: 700, color: g.color }}>{g.label}</p>
                                    <p style={{ color: "var(--n-text-muted)" }}>{g.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: "var(--s-3)", fontSize: "0.73rem", color: "var(--n-text-muted)" }}>
                            GI يقيس سرعة ارتفاع سكر الدم. الأطعمة منخفضة GI تبقيك شبعاناً أطول وتحافظ على استقرار السكر.
                        </p>
                    </div>
                )}

                {activeTab === "foods" && (
                    <div style={{ display: "grid", gap: "var(--s-1)" }}>
                        {ARAB_FOODS.map(f => (
                            <div key={f.name} style={{
                                display: "grid", gridTemplateColumns: "1fr auto auto auto",
                                gap: "var(--s-2)", alignItems: "center",
                                padding: "6px var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.78rem",
                            }}>
                                <span style={{ fontWeight: 600 }}>{f.name}</span>
                                <span style={{ color: "#d97706", fontWeight: 700 }}>{f.carbs} غ</span>
                                <span style={{ color: "var(--n-text-muted)", fontSize: "0.7rem" }}>GI: {f.gi}</span>
                                <span style={{ color: "#059669", fontSize: "0.7rem" }}>ألياف: {f.fiber} غ</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
