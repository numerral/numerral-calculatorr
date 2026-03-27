"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const pad = (n: number) => n.toString().padStart(2, "0");
const fmtTime = (h: number, m: number) => {
    const ampm = h >= 12 ? "م" : "ص";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${pad(h12)}:${pad(m)} ${ampm}`;
};

const FALL_ASLEEP_MIN = 14; // average time to fall asleep
const CYCLE_MIN = 90;       // one sleep cycle

/* ── Age recommendations (CDC/AASM/Sleep Foundation) ── */
const AGE_TABLE = [
    { age: "حديثو الولادة (0-3 أشهر)", hours: "14 – 17", icon: "👶" },
    { age: "رضّع (4-12 شهر)", hours: "12 – 16", icon: "🍼" },
    { age: "أطفال صغار (1-2 سنة)", hours: "11 – 14", icon: "👧" },
    { age: "ما قبل المدرسة (3-5 سنوات)", hours: "10 – 13", icon: "🧒" },
    { age: "أطفال المدرسة (6-12 سنة)", hours: "9 – 12", icon: "📚" },
    { age: "مراهقون (13-17 سنة)", hours: "8 – 10", icon: "🎓" },
    { age: "بالغون (18-64 سنة)", hours: "7 – 9", icon: "🧑" },
    { age: "كبار السن (65+ سنة)", hours: "7 – 8", icon: "👴" },
];

/* ── Tabs ── */
type TabKey = "stages" | "ages" | "tips";

/* ── Mode ── */
type CalcMode = "wake" | "sleep" | "now";

/* ── Main Component ── */
export default function SleepCycleCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("wake");
    const [hour, setHour] = useState("7");
    const [minute, setMinute] = useState("0");
    const [ampm, setAmpm] = useState<"am" | "pm">("am");
    const [activeTab, setActiveTab] = useState<TabKey>("stages");

    const results = useMemo(() => {
        let baseH: number, baseM: number;

        if (mode === "now") {
            const now = new Date();
            baseH = now.getHours();
            baseM = now.getMinutes();
        } else {
            baseH = parseInt(hour) || 0;
            baseM = parseInt(minute) || 0;
            // Convert to 24h
            if (ampm === "pm" && baseH < 12) baseH += 12;
            if (ampm === "am" && baseH === 12) baseH = 0;
        }

        const times: { time: string; cycles: number; hours: string; quality: string }[] = [];

        if (mode === "wake") {
            // Count backwards from wake time
            for (let c = 6; c >= 3; c--) {
                const totalMin = c * CYCLE_MIN + FALL_ASLEEP_MIN;
                let bedH = baseH;
                let bedM = baseM - totalMin;
                while (bedM < 0) { bedM += 60; bedH -= 1; }
                while (bedH < 0) bedH += 24;
                bedH = bedH % 24;
                const hrs = (c * CYCLE_MIN / 60).toFixed(1);
                let quality = "جيد";
                if (c >= 5) quality = "ممتاز ⭐";
                else if (c === 4) quality = "مقبول";
                else if (c <= 3) quality = "قليل ⚠️";
                times.push({ time: fmtTime(bedH, bedM), cycles: c, hours: hrs, quality });
            }
        } else {
            // Count forward from bed/now time
            const sleepH = baseH;
            const sleepM = baseM;
            for (let c = 3; c <= 6; c++) {
                const totalMin = c * CYCLE_MIN + FALL_ASLEEP_MIN;
                let wakeH = sleepH;
                let wakeM = sleepM + totalMin;
                while (wakeM >= 60) { wakeM -= 60; wakeH += 1; }
                wakeH = wakeH % 24;
                const hrs = (c * CYCLE_MIN / 60).toFixed(1);
                let quality = "جيد";
                if (c >= 5) quality = "ممتاز ⭐";
                else if (c === 4) quality = "مقبول";
                else if (c <= 3) quality = "قليل ⚠️";
                times.push({ time: fmtTime(wakeH, wakeM), cycles: c, hours: hrs, quality });
            }
        }

        return times;
    }, [mode, hour, minute, ampm]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة دورة النوم</h2>
                <p className="con-calc__desc">حدد أفضل وقت للنوم أو الاستيقاظ بناءً على دورات النوم (90 دقيقة) — لتستيقظ نشيطاً بدون تعب.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {/* Mode Selector */}
                <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                    {([
                        { key: "wake" as CalcMode, label: "⏰ أريد الاستيقاظ في..." },
                        { key: "sleep" as CalcMode, label: "🛏️ سأنام في..." },
                        { key: "now" as CalcMode, label: "💤 سأنام الآن" },
                    ]).map(m => (
                        <button key={m.key} onClick={() => setMode(m.key)} style={{
                            padding: "8px 16px", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600,
                            border: mode === m.key ? "2px solid #5b3fbf" : "1px solid var(--n-border)",
                            background: mode === m.key ? "rgba(91,63,191,0.08)" : "var(--n-surface)",
                            color: mode === m.key ? "#5b3fbf" : "var(--n-text-secondary)",
                            cursor: "pointer", flex: "1 1 auto", minWidth: 100,
                        }}>{m.label}</button>
                    ))}
                </div>

                {/* Time Input (not shown for "now" mode) */}
                {mode !== "now" && (
                    <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>
                            {mode === "wake" ? "⏰ وقت الاستيقاظ المطلوب:" : "🛏️ وقت النوم:"}
                        </p>
                        <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center", flexWrap: "wrap" }}>
                            <div className="con-input" style={{ flex: "0 0 auto", minWidth: 70 }}>
                                <label className="con-input__label">الساعة</label>
                                <select className="con-input__field" value={hour} onChange={(e) => setHour(e.target.value)}>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                            <div className="con-input" style={{ flex: "0 0 auto", minWidth: 70 }}>
                                <label className="con-input__label">الدقيقة</label>
                                <select className="con-input__field" value={minute} onChange={(e) => setMinute(e.target.value)}>
                                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => <option key={m} value={m}>{pad(m)}</option>)}
                                </select>
                            </div>
                            <div className="con-input" style={{ flex: "0 0 auto", minWidth: 70 }}>
                                <label className="con-input__label">الفترة</label>
                                <select className="con-input__field" value={ampm} onChange={(e) => setAmpm(e.target.value as "am" | "pm")}>
                                    <option value="am">صباحاً</option>
                                    <option value="pm">مساءً</option>
                                </select>
                            </div>
                        </div>
                        <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                            * تحتسب الحاسبة ~14 دقيقة كمتوسط وقت الغفو
                        </p>
                    </div>
                )}

                {mode === "now" && (
                    <div style={{ padding: "var(--s-3) var(--s-4)", background: "rgba(91,63,191,0.05)", border: "1px solid rgba(91,63,191,0.12)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.85rem", color: "#5b3fbf", fontWeight: 600 }}>💤 ستنام الآن — نحسب أفضل أوقات الاستيقاظ من هذه اللحظة</p>
                        <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>+ 14 دقيقة للغفو</p>
                    </div>
                )}
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>{mode === "wake" ? "أفضل أوقات النوم" : "أفضل أوقات الاستيقاظ"}</h4>

                <div style={{ display: "grid", gap: "var(--s-2)", marginBottom: "var(--s-4)" }}>
                    {results.map((r, i) => {
                        const isOptimal = r.cycles === 5;
                        return (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-3) var(--s-4)",
                                background: isOptimal ? "rgba(91,63,191,0.06)" : "var(--n-surface)",
                                border: isOptimal ? "2px solid rgba(91,63,191,0.3)" : "1px solid var(--n-border)",
                                borderRadius: "var(--r-sm)",
                            }}>
                                <div>
                                    <p style={{ fontSize: "1.3rem", fontWeight: 800, color: isOptimal ? "#5b3fbf" : "var(--n-text)" }}>
                                        🕐 {r.time}
                                    </p>
                                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 2 }}>
                                        {r.cycles} دورات · {r.hours} ساعة
                                    </p>
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <span style={{
                                        padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600,
                                        background: r.cycles >= 5 ? "rgba(0,100,70,0.08)" : r.cycles === 4 ? "rgba(197,118,0,0.08)" : "rgba(192,32,32,0.08)",
                                        color: r.cycles >= 5 ? "#006446" : r.cycles === 4 ? "#c57600" : "#c02020",
                                    }}>{r.quality}</span>
                                    {isOptimal && <p style={{ fontSize: "0.7rem", color: "#5b3fbf", fontWeight: 600, marginTop: 4 }}>⭐ الأمثل</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Quick Reference Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "stages" as TabKey, label: "🧠 مراحل النوم" },
                        { key: "ages" as TabKey, label: "👶 ساعات حسب العمر" },
                        { key: "tips" as TabKey, label: "💡 نصائح نوم" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #5b3fbf" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(91,63,191,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#5b3fbf" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "stages" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {[
                            { stage: "N1 — النوم الخفيف", dur: "1-5 دقائق", desc: "انتقال من اليقظة — يمكن الاستيقاظ بسهولة", color: "#7ec8e3" },
                            { stage: "N2 — نوم خفيف أعمق", dur: "10-25 دقيقة", desc: "50% من الليل — تباطؤ القلب والحرارة", color: "#4a9bd9" },
                            { stage: "N3 — النوم العميق", dur: "20-40 دقيقة", desc: "ترميم الجسم، إصلاح الأنسجة، تعزيز المناعة", color: "#2563a8" },
                            { stage: "REM — حركة العين السريعة", dur: "10-60 دقيقة", desc: "الأحلام، تقوية الذاكرة، التنظيم العاطفي", color: "#5b3fbf" },
                        ].map(s => (
                            <div key={s.stage} style={{
                                display: "flex", gap: "var(--s-3)", alignItems: "flex-start",
                                padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                                borderInlineStart: `4px solid ${s.color}`,
                            }}>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: "0.85rem", color: s.color }}>{s.stage}</p>
                                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)" }}>{s.dur}</p>
                                    <p style={{ fontSize: "0.8rem", color: "var(--n-text-secondary)", marginTop: 2 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                        <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>
                            * دورة واحدة ≈ 90 دقيقة (N1 → N2 → N3 → N2 → REM). تتكرر 4-6 مرات في الليلة. مدة REM تزداد مع كل دورة.
                        </p>
                    </div>
                )}

                {activeTab === "ages" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {AGE_TABLE.map(a => (
                            <div key={a.age} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                            }}>
                                <span>{a.icon} {a.age}</span>
                                <span style={{ fontWeight: 700, color: "#5b3fbf" }}>{a.hours} ساعة</span>
                            </div>
                        ))}
                        <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>
                            المصدر: CDC / AASM / National Sleep Foundation (2024)
                        </p>
                    </div>
                )}

                {activeTab === "tips" && (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.8 }}>
                        <ol style={{ paddingInlineStart: "1.3rem" }}>
                            <li><strong>جدول ثابت:</strong> نم واستيقظ بنفس الوقت يومياً — حتى في العطل</li>
                            <li><strong>غرفة مظلمة وباردة:</strong> 18-21°م مثالية — استخدم ستائر حاجبة للضوء</li>
                            <li><strong>بلا شاشات 30 دقيقة قبل النوم:</strong> الضوء الأزرق يثبط الميلاتونين</li>
                            <li><strong>قاطع الكافيين قبل 6 ساعات:</strong> نصف عمر الكافيين 5-6 ساعات</li>
                            <li><strong>تمارين منتظمة — لكن ليس قبل النوم:</strong> توقف قبل ساعتين</li>
                            <li><strong>وجبة خفيفة مسائية:</strong> تجنب الوجبات الثقيلة قبل 3 ساعات</li>
                            <li><strong>روتين استرخاء:</strong> قراءة، تأمل، حمام دافئ</li>
                            <li><strong>تجنب القيلولة الطويلة:</strong> 20 دقيقة كافية — وقبل الـ 3 م</li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}
