"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmtDate = (d: Date) => d.toLocaleDateString("ar-EG", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
const fmtShort = (d: Date) => d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });

/* ── Tabs ── */
type TabKey = "phases" | "symptoms" | "tips";

/* ── Main Component ── */
export default function PeriodCalculatorCore() {
    const today = new Date();
    const [lastPeriod, setLastPeriod] = useState(today.toISOString().split("T")[0]);
    const [cycleLength, setCycleLength] = useState("28");
    const [periodDuration, setPeriodDuration] = useState("5");
    const [months, setMonths] = useState("6");
    const [activeTab, setActiveTab] = useState<TabKey>("phases");

    const result = useMemo(() => {
        const lp = new Date(lastPeriod);
        const cl = Math.max(21, Math.min(45, parseInt(cycleLength) || 28));
        const pd = Math.max(2, Math.min(10, parseInt(periodDuration) || 5));
        const m = Math.max(1, Math.min(12, parseInt(months) || 6));

        // Ovulation ≈ 14 days before next period (luteal phase is relatively constant)
        const ovulationDay = cl - 14;
        // Fertile window: 5 days before ovulation + ovulation day
        const fertileStart = ovulationDay - 5;
        const fertileEnd = ovulationDay;

        // Generate future cycles
        const cycles: { start: Date; end: Date; ovulation: Date; fertileStart: Date; fertileEnd: Date; pmsStart: Date }[] = [];
        for (let i = 0; i < m; i++) {
            const cycleStart = addDays(lp, i * cl);
            const cycleEnd = addDays(cycleStart, pd - 1);
            const ov = addDays(cycleStart, ovulationDay);
            const fs = addDays(cycleStart, fertileStart);
            const fe = addDays(cycleStart, fertileEnd);
            const pms = addDays(cycleStart, cl - 7); // PMS ≈ 7 days before next period
            cycles.push({ start: cycleStart, end: cycleEnd, ovulation: ov, fertileStart: fs, fertileEnd: fe, pmsStart: pms });
        }

        // Current cycle info
        const next = cycles.length > 1 ? cycles[1] : cycles[0];

        return { cycles, next, cl, pd, ovulationDay, fertileStart, fertileEnd };
    }, [lastPeriod, cycleLength, periodDuration, months]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة الدورة الشهرية</h2>
                <p className="con-calc__desc">احسبي موعد الدورة القادمة، أيام التبويض، ونافذة الخصوبة — لعدة أشهر مقدماً.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 بياناتك</p>
                    <div className="con-input">
                        <label className="con-input__label">أول يوم من آخر دورة</label>
                        <input type="date" className="con-input__field" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-2)" }}>
                        <div className="con-input">
                            <label className="con-input__label">طول الدورة <span className="con-input__unit">(يوم)</span></label>
                            <input type="number" className="con-input__field" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} min={21} max={45} />
                            <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "2px" }}>المتوسط: 28 يوم (21-35 طبيعي)</p>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">مدة الحيض <span className="con-input__unit">(يوم)</span></label>
                            <input type="number" className="con-input__field" value={periodDuration} onChange={(e) => setPeriodDuration(e.target.value)} min={2} max={10} />
                            <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "2px" }}>المتوسط: 3-7 أيام</p>
                        </div>
                    </div>
                    <div className="con-input">
                        <label className="con-input__label">عدد الأشهر المستقبلية</label>
                        <select className="con-input__field" value={months} onChange={(e) => setMonths(e.target.value)}>
                            {[3, 6, 9, 12].map(n => <option key={n} value={n}>{n} أشهر</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>الدورة القادمة</h4>

                {/* Next cycle highlight */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: "var(--s-2)", marginBottom: "var(--s-4)",
                }}>
                    <div style={{ padding: "var(--s-3)", textAlign: "center", background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>🩸 بداية الدورة</p>
                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#dc2626" }}>{fmtDate(result.next.start)}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", textAlign: "center", background: "rgba(5,150,105,0.05)", border: "1px solid rgba(5,150,105,0.15)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>🥚 يوم التبويض</p>
                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#059669" }}>{fmtDate(result.next.ovulation)}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", textAlign: "center", background: "rgba(147,51,234,0.05)", border: "1px solid rgba(147,51,234,0.15)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>💜 نافذة الخصوبة</p>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#9333ea" }}>{fmtShort(result.next.fertileStart)} – {fmtShort(result.next.fertileEnd)}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", textAlign: "center", background: "rgba(217,119,6,0.05)", border: "1px solid rgba(217,119,6,0.15)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>😔 بداية PMS</p>
                        <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#d97706" }}>{fmtDate(result.next.pmsStart)}</p>
                    </div>
                </div>

                {/* Future cycles table */}
                <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-2)" }}>📅 جدول الدورات القادمة</p>
                <div style={{ display: "grid", gap: "var(--s-1)" }}>
                    {result.cycles.map((c, i) => (
                        <div key={i} style={{
                            display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr",
                            gap: "var(--s-2)", alignItems: "center",
                            padding: "8px var(--s-3)", background: i === 0 ? "rgba(220,38,38,0.04)" : "var(--n-surface)",
                            border: i === 0 ? "2px solid rgba(220,38,38,0.15)" : "1px solid var(--n-border)",
                            borderRadius: "var(--r-sm)", fontSize: "0.78rem",
                        }}>
                            <span style={{ fontWeight: 700, color: "var(--n-text-muted)", minWidth: 24, textAlign: "center" }}>{i + 1}</span>
                            <span>🩸 <strong style={{ color: "#dc2626" }}>{fmtShort(c.start)}</strong> – {fmtShort(c.end)}</span>
                            <span>🥚 <strong style={{ color: "#059669" }}>{fmtShort(c.ovulation)}</strong></span>
                            <span>💜 <span style={{ color: "#9333ea", fontSize: "0.72rem" }}>{fmtShort(c.fertileStart)}-{fmtShort(c.fertileEnd)}</span></span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap", marginTop: "var(--s-3)", fontSize: "0.72rem", color: "var(--n-text-muted)" }}>
                    <span>🩸 الحيض</span>
                    <span>🥚 التبويض (يوم {result.ovulationDay})</span>
                    <span>💜 الخصوبة (يوم {result.fertileStart}-{result.fertileEnd})</span>
                </div>

                {/* ── Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "phases" as TabKey, label: "🔬 مراحل الدورة" },
                        { key: "symptoms" as TabKey, label: "📋 الأعراض" },
                        { key: "tips" as TabKey, label: "💡 نصائح" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #9333ea" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(147,51,234,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#9333ea" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "phases" && (
                    <div style={{ display: "grid", gap: "var(--s-2)" }}>
                        {[
                            { name: "الحيض (Menstruation)", days: `يوم 1-${result.pd}`, desc: "بطانة الرحم تنسلخ — نزيف. إستروجين + بروجسترون منخفضان.", color: "#dc2626" },
                            { name: "المرحلة الجرابية (Follicular)", days: `يوم 1-${result.ovulationDay}`, desc: "الجسم ينمّي بويضة — إستروجين يرتفع تدريجياً. طاقة ومزاج يتحسنان.", color: "#0284c7" },
                            { name: "التبويض (Ovulation)", days: `يوم ${result.ovulationDay}`, desc: "البويضة تُطلق — أعلى خصوبة. ارتفاع LH. تستمر 12-24 ساعة.", color: "#059669" },
                            { name: "المرحلة الأصفرية (Luteal)", days: `يوم ${result.ovulationDay + 1}-${result.cl}`, desc: "بروجسترون يرتفع — يجهز الرحم. إذا لم يحدث حمل → تنخفض الهرمونات → PMS → الدورة.", color: "#d97706" },
                        ].map(p => (
                            <div key={p.name} style={{
                                padding: "var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                                borderInlineStart: `4px solid ${p.color}`, fontSize: "0.82rem",
                            }}>
                                <p style={{ fontWeight: 700, color: p.color }}>{p.name} <span style={{ fontWeight: 400, color: "var(--n-text-muted)" }}>— {p.days}</span></p>
                                <p style={{ color: "var(--n-text-secondary)", marginTop: "var(--s-1)" }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "symptoms" && (
                    <div style={{ display: "grid", gap: "var(--s-2)", fontSize: "0.82rem" }}>
                        {[
                            { phase: "الحيض", symptoms: "تقلصات، ألم أسفل البطن/الظهر، تعب، صداع" },
                            { phase: "ما بعد الحيض", symptoms: "ارتفاع الطاقة، تحسن المزاج، بشرة أنقى" },
                            { phase: "التبويض", symptoms: "ألم خفيف في جانب البطن (Mittelschmerz)، زيادة الإفرازات" },
                            { phase: "PMS (قبل الدورة)", symptoms: "تقلبات مزاجية، انتفاخ، حساسية الثدي، رغبة في السكر، أرق" },
                        ].map(s => (
                            <div key={s.phase} style={{ padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                                <p style={{ fontWeight: 700, color: "var(--n-text)" }}>{s.phase}</p>
                                <p style={{ color: "var(--n-text-muted)" }}>{s.symptoms}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "tips" && (
                    <div style={{ display: "grid", gap: "var(--s-2)", fontSize: "0.82rem" }}>
                        {[
                            "🩸 أثناء الحيض: ماء دافئ + مغنيسيوم يخفف التقلصات. تمارين خفيفة (مشي، يوغا) تساعد.",
                            "🥗 التغذية: حديد (لحوم حمراء، سبانخ) لتعويض الفقد. أوميغا-3 يقلل الالتهاب.",
                            "💧 الماء: اشربي 8-10 أكواب — الجفاف يزيد التقلصات والصداع.",
                            "😴 النوم: 7-9 ساعات — اضطراب النوم شائع قبل الدورة بسبب انخفاض البروجسترون.",
                            "🚫 تجنبي: كافيين زائد، ملح زائد (يزيد الانتفاخ)، سكر مكرر.",
                            "📝 تتبعي: سجّلي مواعيدك 3 أشهر متتالية لمعرفة نمطك الحقيقي.",
                        ].map((tip, i) => (
                            <div key={i} style={{ padding: "var(--s-2) var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>{tip}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
