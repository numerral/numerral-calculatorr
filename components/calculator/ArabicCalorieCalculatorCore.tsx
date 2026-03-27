"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/* ── Sub-components (Arabic labels) ── */
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

/* ── Activity Levels (Arabic) ── */
const ACTIVITY_LEVELS = [
    { value: "1.2", label: "قليل النشاط — عمل مكتبي، بدون تمارين" },
    { value: "1.375", label: "نشاط خفيف — تمارين 1-3 أيام/أسبوع" },
    { value: "1.55", label: "نشاط متوسط — تمارين 3-5 أيام/أسبوع" },
    { value: "1.725", label: "نشاط عالي — تمارين 6-7 أيام/أسبوع" },
    { value: "1.9", label: "نشاط فائق — رياضي محترف / عمل بدني شاق" },
];

/* ── Weight Loss Rate (Arabic) ── */
const LOSS_RATES = [
    { value: "0", label: "الحفاظ على الوزن الحالي" },
    { value: "250", label: "خسارة خفيفة — 0.25 كجم/أسبوع" },
    { value: "500", label: "خسارة معتدلة — 0.5 كجم/أسبوع (مُوصى به)" },
    { value: "750", label: "خسارة ملحوظة — 0.75 كجم/أسبوع" },
    { value: "1000", label: "خسارة مكثفة — 1 كجم/أسبوع" },
];

/* ── UAE / Emirati Food Reference ── */
const UAE_FOODS = [
    { name: "مجبوس دجاج (Machboos)", cal: 354, serving: "كوب (236 غ)" },
    { name: "هريس لحم (Harees)", cal: 250, serving: "200 غ" },
    { name: "لقيمات مع دبس (Luqaimat)", cal: 240, serving: "6 قطع" },
    { name: "بلاليط (Balaleet)", cal: 313, serving: "حصة واحدة" },
    { name: "شاورما دجاج (لفة)", cal: 450, serving: "لفة واحدة" },
    { name: "فتوش (سلطة)", cal: 180, serving: "طبق" },
    { name: "حمص (Hummus)", cal: 166, serving: "100 غ" },
    { name: "سمبوسة (Samosa)", cal: 120, serving: "قطعة" },
    { name: "فطائر جبن (Fatayer)", cal: 210, serving: "قطعتان" },
    { name: "تمر مدجول (Dates)", cal: 110, serving: "حبتان (50 غ)" },
    { name: "شاي كرك (Karak Chai)", cal: 180, serving: "كوب" },
    { name: "قهوة عربية (Qahwa)", cal: 2, serving: "فنجان" },
];

/* ── Tabs for quick reference ── */
type TabKey = "food" | "bmi" | "tips";

/* ── Main Component ── */
export default function ArabicCalorieCalculatorCore() {
    const [gender, setGender] = useState<"male" | "female">("male");
    const [age, setAge] = useState("30");
    const [weight, setWeight] = useState("75");
    const [height, setHeight] = useState("170");
    const [activity, setActivity] = useState("1.2");
    const [lossRate, setLossRate] = useState("0");
    const [activeTab, setActiveTab] = useState<TabKey>("food");

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
        const targetCalories = Math.max(gender === "female" ? 1200 : 1500, tdee - deficit);

        // Macros (30/40/30)
        const proteinCal = targetCalories * 0.3;
        const carbCal = targetCalories * 0.4;
        const fatCal = targetCalories * 0.3;
        const proteinG = proteinCal / 4;
        const carbG = carbCal / 4;
        const fatG = fatCal / 9;

        // Weekly weight change (kg)
        const weeklyChange = deficit > 0 ? deficit * 7 / 7700 : 0;

        // BMI
        const hMeters = h / 100;
        const bmi = w / (hMeters * hMeters);
        let bmiCategory = "وزن طبيعي";
        let bmiColor = "#006446";
        if (bmi < 18.5) { bmiCategory = "نقص في الوزن"; bmiColor = "#1a6fb5"; }
        else if (bmi >= 25 && bmi < 30) { bmiCategory = "زيادة في الوزن"; bmiColor = "#c57600"; }
        else if (bmi >= 30) { bmiCategory = "سمنة"; bmiColor = "#c02020"; }

        return { bmr, tdee, targetCalories, deficit, proteinG, carbG, fatG, weeklyChange, bmi, bmiCategory, bmiColor };
    }, [gender, age, weight, height, activity, lossRate]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة السعرات الحرارية اليومية</h2>
                <p className="con-calc__desc">احسب احتياجاتك اليومية من السعرات الحرارية باستخدام معادلة Mifflin-St Jeor. تشمل BMR، TDEE، عجز السعرات، وتوزيع المغذيات الكبرى.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {/* Personal Details */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 بياناتك الشخصية</p>
                    <SelectField label="الجنس" value={gender} onChange={(v) => setGender(v as "male" | "female")} options={[
                        { value: "male", label: "ذكر" },
                        { value: "female", label: "أنثى" },
                    ]} />
                    <InputField label="العمر" value={age} onChange={setAge} unit="سنة" min={1} max={120} />
                    <InputField label="الوزن" value={weight} onChange={setWeight} unit="كجم" min={1} max={300} />
                    <InputField label="الطول" value={height} onChange={setHeight} unit="سم" min={50} max={250} />
                </div>

                {/* Activity & Goal */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>🏃 مستوى النشاط والهدف</p>
                    <SelectField label="مستوى النشاط البدني" value={activity} onChange={setActivity} options={ACTIVITY_LEVELS} />
                    <SelectField label="هدف خسارة الوزن" value={lossRate} onChange={setLossRate} options={LOSS_RATES} />
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>احتياجاتك اليومية من السعرات الحرارية</h4>

                {/* Main Number */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(0,100,70,0.06) 0%, rgba(0,100,70,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(0,100,70,0.12)", marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>
                        {result.deficit > 0 ? "السعرات اليومية المستهدفة (مع العجز)" : "السعرات اليومية للحفاظ على الوزن"}
                    </p>
                    <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#006446", letterSpacing: "-1px" }}>{fmt(result.targetCalories)} سعرة</p>
                    {result.deficit > 0 && (
                        <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                            عجز {fmt(result.deficit)} سعرة/يوم → خسارة ~{result.weeklyChange.toFixed(2)} كجم/أسبوع
                        </p>
                    )}
                </div>

                <ResultRow label="معدل الأيض الأساسي (BMR)" value={`${fmt(result.bmr)} سعرة`} />
                <ResultRow label="إجمالي الاستهلاك اليومي (TDEE)" value={`${fmt(result.tdee)} سعرة`} highlight />
                {result.deficit > 0 && <ResultRow label="عجز السعرات اليومي" value={`−${fmt(result.deficit)} سعرة`} sub />}

                {/* BMI Badge */}
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "var(--s-3) var(--s-4)", marginTop: "var(--s-3)",
                    background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--n-text-secondary)" }}>مؤشر كتلة الجسم (BMI)</span>
                    <span style={{ fontWeight: 700, color: result.bmiColor }}>{result.bmi.toFixed(1)} — {result.bmiCategory}</span>
                </div>

                {/* Macros */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <h4>توزيع المغذيات الكبرى</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>بناءً على نسبة 30% بروتين · 40% كربوهيدرات · 30% دهون</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-3)", marginBottom: "var(--s-3)" }}>
                    {[
                        { label: "بروتين", g: result.proteinG, color: "#006446" },
                        { label: "كربوهيدرات", g: result.carbG, color: "#1a6fb5" },
                        { label: "دهون", g: result.fatG, color: "#c04e00" },
                    ].map((m) => (
                        <div key={m.label} style={{
                            textAlign: "center", padding: "var(--s-3)",
                            background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                        }}>
                            <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)" }}>{m.label}</p>
                            <p style={{ fontSize: "1.3rem", fontWeight: 700, color: m.color }}>{fmt(m.g)} غ</p>
                        </div>
                    ))}
                </div>

                {/* ── Quick Reference Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "food" as TabKey, label: "🍽️ أطعمة إماراتية" },
                        { key: "bmi" as TabKey, label: "📊 جدول BMI" },
                        { key: "tips" as TabKey, label: "💡 نصائح سريعة" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #006446" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(0,100,70,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#006446" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "food" && (
                    <div>
                        <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>كم حصة تناسب هدفك اليومي ({fmt(result.targetCalories)} سعرة)؟</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--s-2)" }}>
                            {UAE_FOODS.map((f) => (
                                <div key={f.name} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                    border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.8rem",
                                }}>
                                    <div>
                                        <span style={{ color: "var(--n-text)", fontWeight: 600 }}>{f.name}</span>
                                        <span style={{ display: "block", fontSize: "0.7rem", color: "var(--n-text-muted)" }}>{f.serving}</span>
                                    </div>
                                    <span style={{ fontWeight: 700, color: "#006446", whiteSpace: "nowrap" }}>{f.cal} سعرة</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "bmi" && (
                    <div style={{ fontSize: "0.82rem" }}>
                        <p style={{ marginBottom: "var(--s-3)", color: "var(--n-text-muted)" }}>تصنيف منظمة الصحة العالمية لمؤشر كتلة الجسم (BMI)</p>
                        <div style={{ display: "grid", gap: "var(--s-2)" }}>
                            {[
                                { range: "أقل من 18.5", cat: "نقص في الوزن", color: "#1a6fb5" },
                                { range: "18.5 – 24.9", cat: "وزن طبيعي ✅", color: "#006446" },
                                { range: "25.0 – 29.9", cat: "زيادة في الوزن", color: "#c57600" },
                                { range: "30.0 – 34.9", cat: "سمنة درجة أولى", color: "#c04e00" },
                                { range: "35.0 – 39.9", cat: "سمنة درجة ثانية", color: "#c02020" },
                                { range: "40.0+", cat: "سمنة مفرطة", color: "#8b0000" },
                            ].map(r => (
                                <div key={r.range} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                    border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                                }}>
                                    <span style={{ fontWeight: 600 }}>{r.range}</span>
                                    <span style={{ color: r.color, fontWeight: 600 }}>{r.cat}</span>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: "var(--s-3)", fontSize: "0.75rem", color: "var(--n-text-muted)" }}>مؤشر كتلة جسمك: <strong style={{ color: result.bmiColor }}>{result.bmi.toFixed(1)} — {result.bmiCategory}</strong></p>
                    </div>
                )}

                {activeTab === "tips" && (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                        <ul style={{ paddingInlineStart: "1.2rem", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                            <li><strong>اشرب ماء قبل كل وجبة</strong> — يقلل الشهية ويساعد على حرق السعرات</li>
                            <li><strong>قلل من الكرك والمشروبات المحلّاة</strong> — كوب كرك = 180 سعرة (9 ملاعق سكر في اليوم!)</li>
                            <li><strong>تناول بروتين كافي</strong> — يحافظ على الكتلة العضلية أثناء خسارة الوزن</li>
                            <li><strong>لا تتخطَّ وجبة الفطور</strong> — يؤدي لتناول كميات أكبر لاحقاً</li>
                            <li><strong>استخدم أطباق أصغر</strong> — خدعة بصرية تقلل حجم الحصة بنسبة 20-30%</li>
                            <li><strong>تحرّك أثناء استراحة العمل</strong> — 10 دقائق مشي × 3 = 30 دقيقة نشاط</li>
                            <li><strong>نم 7-8 ساعات</strong> — قلة النوم ترفع هرمون الجوع (غريلين) بنسبة 15%</li>
                            <li><strong>في رمضان</strong> — هدفك اليومي يبقى نفسه، فقط وزّعه على الإفطار والسحور</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
