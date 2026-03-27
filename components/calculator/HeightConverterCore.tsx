"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 2) => n.toFixed(d);

/* ── Conversion constants ── */
const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
const CM_PER_METER = 100;

/* ── Tabs ── */
type TabKey = "table" | "avg" | "bmi";

/* ── Average heights ── */
const AVG_HEIGHTS = [
    { country: "🇳🇱 هولندا", male: 183.8, female: 170.4 },
    { country: "🇩🇪 ألمانيا", male: 180.3, female: 166.2 },
    { country: "🇺🇸 أمريكا", male: 177.1, female: 163.5 },
    { country: "🇱🇧 لبنان", male: 176.0, female: 162.5 },
    { country: "🇦🇪 الإمارات", male: 174.1, female: 160.5 },
    { country: "🇸🇾 سوريا", male: 173.0, female: 159.0 },
    { country: "🇪🇬 مصر", male: 172.0, female: 158.5 },
    { country: "🇸🇦 السعودية", male: 168.9, female: 156.0 },
    { country: "🇧🇭 البحرين", male: 165.1, female: 154.0 },
    { country: "🇮🇳 الهند", male: 166.5, female: 155.2 },
];

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

/* ── Mode ── */
type ConvMode = "cmToFt" | "ftToCm";

/* ── Main Component ── */
export default function HeightConverterCore() {
    const [mode, setMode] = useState<ConvMode>("cmToFt");
    const [cm, setCm] = useState("175");
    const [feet, setFeet] = useState("5");
    const [inches, setInches] = useState("9");
    const [activeTab, setActiveTab] = useState<TabKey>("table");

    const result = useMemo(() => {
        if (mode === "cmToFt") {
            const c = Math.max(0, parseFloat(cm) || 175);
            const totalInches = c / CM_PER_INCH;
            const ft = Math.floor(totalInches / INCHES_PER_FOOT);
            const inch = totalInches % INCHES_PER_FOOT;
            const meters = c / CM_PER_METER;
            return { cm: c, ft, inch, meters, totalInches };
        } else {
            const f = Math.max(0, parseFloat(feet) || 5);
            const i = Math.max(0, parseFloat(inches) || 0);
            const totalInches = f * INCHES_PER_FOOT + i;
            const c = totalInches * CM_PER_INCH;
            const meters = c / CM_PER_METER;
            return { cm: c, ft: f, inch: i, meters, totalInches };
        }
    }, [mode, cm, feet, inches]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة تحويل الطول</h2>
                <p className="con-calc__desc">حوّل بين السنتيمتر والقدم/بوصة فوراً — مع جدول مرجعي ومتوسط الطول في الدول العربية.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {/* Mode toggle */}
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    {([
                        { key: "cmToFt" as ConvMode, label: "📏 سم → قدم/بوصة" },
                        { key: "ftToCm" as ConvMode, label: "📐 قدم/بوصة → سم" },
                    ]).map(m => (
                        <button key={m.key} onClick={() => setMode(m.key)} style={{
                            flex: 1, padding: "8px 16px", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600,
                            border: mode === m.key ? "2px solid #0284c7" : "1px solid var(--n-border)",
                            background: mode === m.key ? "rgba(2,132,199,0.06)" : "var(--n-surface)",
                            color: mode === m.key ? "#0284c7" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{m.label}</button>
                    ))}
                </div>

                {/* Input */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    {mode === "cmToFt" ? (
                        <InputField label="الطول" value={cm} onChange={setCm} unit="سم" min={30} max={300} step={1} note="أدخل الطول بالسنتيمتر" />
                    ) : (
                        <div style={{ display: "flex", gap: "var(--s-2)" }}>
                            <div style={{ flex: 1 }}>
                                <InputField label="قدم" value={feet} onChange={setFeet} unit="ft" min={0} max={9} step={1} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <InputField label="بوصة" value={inches} onChange={setInches} unit="in" min={0} max={11.99} step={0.1} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>نتيجة التحويل</h4>

                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(2,132,199,0.06) 0%, rgba(2,132,199,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(2,132,199,0.15)", marginBottom: "var(--s-4)",
                }}>
                    {mode === "cmToFt" ? (
                        <>
                            <p style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>📏 {fmt(result.cm, 1)} سم =</p>
                            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#0284c7", marginTop: "var(--s-2)" }}>
                                {result.ft}′ {fmt(result.inch, 1)}″
                            </p>
                            <p style={{ fontSize: "0.85rem", color: "var(--n-text-secondary)", marginTop: "var(--s-2)" }}>
                                {result.ft} قدم و {fmt(result.inch, 1)} بوصة
                            </p>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>📐 {Math.floor(parseFloat(feet))}′ {fmt(parseFloat(inches) || 0, 1)}″ =</p>
                            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#0284c7", marginTop: "var(--s-2)" }}>
                                {fmt(result.cm, 1)} سم
                            </p>
                            <p style={{ fontSize: "0.85rem", color: "var(--n-text-secondary)", marginTop: "var(--s-2)" }}>
                                {fmt(result.meters, 2)} م
                            </p>
                        </>
                    )}
                </div>

                {/* All conversions */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "var(--s-2)", marginBottom: "var(--s-3)" }}>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>سنتيمتر</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700 }}>{fmt(result.cm, 1)} سم</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>متر</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700 }}>{fmt(result.meters)} م</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>قدم + بوصة</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700 }}>{result.ft}′ {fmt(result.inch, 1)}″</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>إجمالي بوصة</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700 }}>{fmt(result.totalInches, 1)}″</p>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "table" as TabKey, label: "📊 جدول التحويل" },
                        { key: "avg" as TabKey, label: "🌍 متوسط الطول" },
                        { key: "bmi" as TabKey, label: "⚖️ الوزن المثالي" },
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

                {activeTab === "table" && (
                    <div style={{ display: "grid", gap: "var(--s-1)" }}>
                        {[150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200].map(h => {
                            const totalIn = h / CM_PER_INCH;
                            const f = Math.floor(totalIn / 12);
                            const i = totalIn % 12;
                            const isMatch = Math.abs(result.cm - h) < 3;
                            return (
                                <div key={h} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "6px var(--s-3)",
                                    background: isMatch ? "rgba(2,132,199,0.06)" : "var(--n-surface)",
                                    border: isMatch ? "2px solid rgba(2,132,199,0.25)" : "1px solid var(--n-border)",
                                    borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                                }}>
                                    <span><strong>{h} سم</strong> ({fmt(h / 100)} م)</span>
                                    <span style={{ fontWeight: 700, color: "#0284c7" }}>{f}′ {fmt(i, 1)}″</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === "avg" && (
                    <div style={{ display: "grid", gap: "var(--s-1)" }}>
                        {AVG_HEIGHTS.map(c => (
                            <div key={c.country} style={{
                                display: "grid", gridTemplateColumns: "1fr auto auto",
                                gap: "var(--s-2)", alignItems: "center",
                                padding: "6px var(--s-3)", background: "var(--n-surface)",
                                border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.8rem",
                            }}>
                                <span style={{ fontWeight: 600 }}>{c.country}</span>
                                <span style={{ color: "#0284c7" }}>♂ {c.male} سم</span>
                                <span style={{ color: "#be185d" }}>♀ {c.female} سم</span>
                            </div>
                        ))}
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>المصدر: World Population Review / NCD Risk Factor</p>
                    </div>
                )}

                {activeTab === "bmi" && (
                    <div style={{ display: "grid", gap: "var(--s-1)" }}>
                        {[150, 155, 160, 165, 170, 175, 180, 185, 190].map(h => {
                            const hM = h / 100;
                            const isMatch = Math.abs(result.cm - h) < 3;
                            return (
                                <div key={h} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "6px var(--s-3)",
                                    background: isMatch ? "rgba(2,132,199,0.06)" : "var(--n-surface)",
                                    border: isMatch ? "2px solid rgba(2,132,199,0.25)" : "1px solid var(--n-border)",
                                    borderRadius: "var(--r-sm)", fontSize: "0.82rem",
                                }}>
                                    <span>{h} سم</span>
                                    <span style={{ fontWeight: 700, color: "#059669" }}>{fmt(18.5 * hM * hM, 1)} – {fmt(24.9 * hM * hM, 1)} كجم</span>
                                </div>
                            );
                        })}
                        <p style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>
                            الوزن المثالي (BMI 18.5-24.9). لحساب BMI: <a href="/ar/hisabat-kutlat-aljism" style={{ color: "#0284c7" }}>حاسبة BMI</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
