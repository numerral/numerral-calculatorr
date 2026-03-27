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

/* ── Activity Levels ── */
const ACTIVITY_LEVELS = [
    { value: "0", label: "قليل النشاط — عمل مكتبي، بدون تمارين" },
    { value: "1", label: "نشاط خفيف — مشي خفيف أو تمارين 1-2 أيام/أسبوع" },
    { value: "2", label: "نشاط متوسط — تمارين 3-5 أيام/أسبوع" },
    { value: "3", label: "نشاط عالي — تمارين يومية أو عمل بدني" },
    { value: "4", label: "نشاط فائق — رياضي محترف / تدريب مكثف" },
];

/* ── Climate ── */
const CLIMATE_OPTIONS = [
    { value: "normal", label: "🌤️ معتدل (أقل من 30°م)" },
    { value: "hot", label: "☀️ حار (30-40°م) — ربيع/خريف الإمارات" },
    { value: "very_hot", label: "🔥 حار جداً (40°م+) — صيف الإمارات" },
];

/* ── Foods with water content ── */
const WATER_FOODS = [
    { name: "خيار", pct: 96, icon: "🥒" },
    { name: "خس", pct: 95, icon: "🥬" },
    { name: "طماطم", pct: 94, icon: "🍅" },
    { name: "بطيخ", pct: 92, icon: "🍉" },
    { name: "فراولة", pct: 91, icon: "🍓" },
    { name: "شمام", pct: 90, icon: "🍈" },
    { name: "برتقال", pct: 87, icon: "🍊" },
    { name: "حليب", pct: 87, icon: "🥛" },
    { name: "تفاح", pct: 86, icon: "🍎" },
    { name: "لبن زبادي", pct: 85, icon: "🥣" },
    { name: "أرز مطبوخ", pct: 70, icon: "🍚" },
    { name: "خبز", pct: 36, icon: "🍞" },
];

/* ── Tabs ── */
type TabKey = "schedule" | "foods" | "signs";

/* ── Main Component ── */
export default function WaterIntakeCalculatorCore() {
    const [weight, setWeight] = useState("70");
    const [activity, setActivity] = useState("0");
    const [climate, setClimate] = useState("hot");
    const [exerciseMin, setExerciseMin] = useState("0");
    const [caffeineCups, setCaffeineCups] = useState("1");
    const [pregnant, setPregnant] = useState("none");
    const [activeTab, setActiveTab] = useState<TabKey>("schedule");

    const result = useMemo(() => {
        const w = Math.max(1, parseFloat(weight) || 70);
        const act = parseInt(activity);
        const exMin = Math.max(0, parseFloat(exerciseMin) || 0);
        const caff = Math.max(0, parseFloat(caffeineCups) || 0);

        // Base: weight × 0.033 (DHA formula)
        let baseLiters = w * 0.033;

        // Activity adjustment
        const activityAdd = [0, 0.35, 0.5, 0.7, 1.0][act] || 0;
        baseLiters += activityAdd;

        // Climate adjustment
        let climateAdd = 0;
        if (climate === "hot") climateAdd = 0.5;
        if (climate === "very_hot") climateAdd = 1.0;
        baseLiters += climateAdd;

        // Exercise adjustment (extra ~340ml per 30 min)
        const exerciseAdd = (exMin / 30) * 0.34;
        baseLiters += exerciseAdd;

        // Caffeine adjustment (~150ml per cup to compensate mild diuretic)
        const caffeineAdd = caff * 0.15;
        baseLiters += caffeineAdd;

        // Pregnancy/breastfeeding
        let pregAdd = 0;
        if (pregnant === "pregnant") pregAdd = 0.3;
        if (pregnant === "breastfeeding") pregAdd = 0.7;
        baseLiters += pregAdd;

        const totalLiters = Math.max(1.5, baseLiters);
        const glasses = Math.ceil(totalLiters / 0.25); // 250ml glasses
        const bottles500 = (totalLiters / 0.5).toFixed(1);

        // Hourly schedule (waking hours 6AM-10PM = 16 hours)
        const perHour = totalLiters / 16;
        const mlPerHour = Math.round(perHour * 1000);

        return {
            totalLiters, glasses, bottles500, mlPerHour,
            baseLiters: w * 0.033,
            activityAdd, climateAdd, exerciseAdd, caffeineAdd, pregAdd,
        };
    }, [weight, activity, climate, exerciseMin, caffeineCups, pregnant]);

    // Fill percentage for visual (cap at 100%)
    const fillPct = Math.min(100, (result.totalLiters / 4) * 100);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة احتياج الماء اليومي</h2>
                <p className="con-calc__desc">احسب كمية الماء التي تحتاجها يومياً حسب وزنك ومستوى نشاطك ومناخ بيئتك — مع جدول الترطيب المثالي ودليل الأطعمة الغنية بالماء.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {/* Basic Info */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 بياناتك الأساسية</p>
                    <InputField label="الوزن" value={weight} onChange={setWeight} unit="كجم" min={20} max={200} />
                    <SelectField label="مستوى النشاط اليومي" value={activity} onChange={setActivity} options={ACTIVITY_LEVELS} />
                    <SelectField label="المناخ / درجة الحرارة" value={climate} onChange={setClimate} options={CLIMATE_OPTIONS} />
                </div>

                {/* Additional Factors */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>⚙️ عوامل إضافية</p>
                    <InputField label="مدة التمرين اليومي" value={exerciseMin} onChange={setExerciseMin} unit="دقيقة" min={0} max={300} step={15} note="أضف وقت التمرين لحساب الماء الإضافي المطلوب" />
                    <InputField label="أكواب القهوة / الشاي (كافيين)" value={caffeineCups} onChange={setCaffeineCups} unit="كوب/يوم" min={0} max={10} note="الكافيين مدر خفيف للبول — نضيف 150 مل تعويضية لكل كوب" />
                    <SelectField label="الحمل / الرضاعة" value={pregnant} onChange={setPregnant} options={[
                        { value: "none", label: "لا ينطبق" },
                        { value: "pregnant", label: "حامل (+300 مل)" },
                        { value: "breastfeeding", label: "مرضعة (+700 مل)" },
                    ]} />
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>احتياجك اليومي من الماء</h4>

                {/* Main visual */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(30,130,200,0.06) 0%, rgba(30,130,200,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(30,130,200,0.12)", marginBottom: "var(--s-4)",
                }}>
                    {/* Water fill bar */}
                    <div style={{
                        width: 80, height: 120, margin: "0 auto var(--s-3)",
                        borderRadius: "0 0 16px 16px", border: "3px solid rgba(30,130,200,0.3)",
                        borderTop: "none", position: "relative", overflow: "hidden",
                        background: "rgba(255,255,255,0.5)",
                    }}>
                        <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            height: `${fillPct}%`,
                            background: "linear-gradient(180deg, rgba(30,130,200,0.3) 0%, rgba(30,130,200,0.6) 100%)",
                            transition: "height 0.5s ease",
                            borderRadius: "0 0 13px 13px",
                        }} />
                        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "1.8rem" }}>💧</span>
                    </div>

                    <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1a6fb5", letterSpacing: "-1px" }}>{fmt(result.totalLiters)} لتر</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--n-text-secondary)", marginTop: "var(--s-1)" }}>
                        {result.glasses} كوب (250 مل) · {result.bottles500} قارورة (500 مل)
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                        ≈ {result.mlPerHour} مل كل ساعة (خلال 16 ساعة يقظة)
                    </p>
                </div>

                {/* Breakdown */}
                <div style={{ display: "grid", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    {[
                        { label: "الأساس (الوزن × 0.033)", val: `${fmt(result.baseLiters)} لتر` },
                        ...(result.activityAdd > 0 ? [{ label: "إضافة النشاط البدني", val: `+${fmt(result.activityAdd)} لتر` }] : []),
                        ...(result.climateAdd > 0 ? [{ label: `إضافة المناخ (${climate === "very_hot" ? "حار جداً" : "حار"})`, val: `+${fmt(result.climateAdd)} لتر` }] : []),
                        ...(result.exerciseAdd > 0 ? [{ label: `إضافة التمرين (${exerciseMin} دقيقة)`, val: `+${fmt(result.exerciseAdd)} لتر` }] : []),
                        ...(result.caffeineAdd > 0 ? [{ label: `تعويض الكافيين (${caffeineCups} كوب)`, val: `+${fmt(result.caffeineAdd)} لتر` }] : []),
                        ...(result.pregAdd > 0 ? [{ label: pregnant === "pregnant" ? "إضافة الحمل" : "إضافة الرضاعة", val: `+${fmt(result.pregAdd)} لتر` }] : []),
                    ].map((r, i) => (
                        <div key={i} className="con-result-row">
                            <span className="con-result-row__label" style={i === 0 ? { fontWeight: 600 } : { fontSize: "0.85rem", color: "var(--n-text-secondary)" }}>{r.label}</span>
                            <span className="con-result-row__value" style={i === 0 ? { fontWeight: 600 } : {}}>{r.val}</span>
                        </div>
                    ))}
                </div>

                {/* ── Quick Reference Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "schedule" as TabKey, label: "🕐 جدول الترطيب" },
                        { key: "foods" as TabKey, label: "🥒 أطعمة غنية بالماء" },
                        { key: "signs" as TabKey, label: "⚠️ أعراض الجفاف" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #1a6fb5" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(30,130,200,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#1a6fb5" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "schedule" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {[
                            { time: "6:00 ص", note: "عند الاستيقاظ — كوبان على معدة فارغة", ml: Math.round(result.totalLiters * 1000 * 0.13) },
                            { time: "8:00 ص", note: "مع/بعد الفطور", ml: Math.round(result.totalLiters * 1000 * 0.1) },
                            { time: "10:00 ص", note: "استراحة منتصف الصباح", ml: Math.round(result.totalLiters * 1000 * 0.1) },
                            { time: "12:00 م", note: "قبل الغداء بـ 30 دقيقة", ml: Math.round(result.totalLiters * 1000 * 0.1) },
                            { time: "1:00 م", note: "بعد الغداء", ml: Math.round(result.totalLiters * 1000 * 0.1) },
                            { time: "3:00 م", note: "استراحة بعد الظهر", ml: Math.round(result.totalLiters * 1000 * 0.1) },
                            { time: "5:00 م", note: "قبل/أثناء التمرين", ml: Math.round(result.totalLiters * 1000 * 0.12) },
                            { time: "7:00 م", note: "مع/بعد العشاء", ml: Math.round(result.totalLiters * 1000 * 0.1) },
                            { time: "9:00 م", note: "قبل النوم بساعة (كمية أقل)", ml: Math.round(result.totalLiters * 1000 * 0.07) },
                        ].map((s, i) => (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <div>
                                    <span style={{ fontWeight: 700, color: "#1a6fb5" }}>{s.time}</span>
                                    <span style={{ color: "var(--n-text-secondary)", marginInlineStart: 8 }}>{s.note}</span>
                                </div>
                                <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{s.ml} مل</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "foods" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--s-2)" }}>
                        {WATER_FOODS.map(f => (
                            <div key={f.name} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span>{f.icon} {f.name}</span>
                                <span style={{ fontWeight: 700, color: "#1a6fb5" }}>{f.pct}%</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "signs" && (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                        <p style={{ fontWeight: 700, marginBottom: "var(--s-2)", color: "#c57600" }}>🟡 أعراض جفاف خفيف:</p>
                        <ul style={{ paddingInlineStart: "1.2rem", marginBottom: "var(--s-3)" }}>
                            <li>العطش المستمر</li>
                            <li>جفاف الفم والشفتين</li>
                            <li>بول غامق اللون (أصفر داكن)</li>
                            <li>صداع خفيف</li>
                            <li>تعب وكسل غير مبرر</li>
                            <li>جفاف الجلد</li>
                        </ul>
                        <p style={{ fontWeight: 700, marginBottom: "var(--s-2)", color: "#c02020" }}>🔴 أعراض جفاف شديد (يستلزم تدخل طبي):</p>
                        <ul style={{ paddingInlineStart: "1.2rem" }}>
                            <li>دوار وإغماء</li>
                            <li>تسارع ضربات القلب</li>
                            <li>عدم التبول لأكثر من 8 ساعات</li>
                            <li>عيون غائرة</li>
                            <li>تشنجات عضلية</li>
                            <li>ارتباك ذهني وعدم تركيز</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
