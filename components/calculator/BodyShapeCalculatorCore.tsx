"use client";
import { useState, useMemo } from "react";

/* ── Sub-components ── */
function InputField({ label, value, onChange, unit, min, max, note }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; note?: string;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min ?? 0} max={max} step={1} placeholder="0" />
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

/* ── Body shape data ── */
interface ShapeInfo {
    nameAr: string;
    nameEn: string;
    emoji: string;
    descAr: string;
    exerciseAr: string;
    fashionAr: string;
}

const SHAPES: Record<string, ShapeInfo> = {
    hourglass: {
        nameAr: "الساعة الرملية", nameEn: "Hourglass", emoji: "⌛",
        descAr: "صدر ووركان متناسبان مع خصر محدد بوضوح. يُعتبر من أكثر الأشكال تناسقاً.",
        exerciseAr: "ركّز على تمارين القوة الشاملة للحفاظ على التناسق. يوغا وبيلاتس ممتازة. تمارين HIIT للياقة العامة.",
        fashionAr: "الملابس المحددة للخصر مثالية. فساتين ملتفة، أحزمة، قمصان بقصة ضيقة عند الخصر.",
    },
    topHourglass: {
        nameAr: "الساعة الرملية العلوي", nameEn: "Top Hourglass", emoji: "⌛",
        descAr: "خصر محدد مع صدر أكبر بشكل واضح مقارنة بالوركين.",
        exerciseAr: "ركّز على تمارين الجزء السفلي (سكوات، لانجز) لتعزيز التوازن. تمارين كارديو معتدلة.",
        fashionAr: "ألوان داكنة في الأعلى وفاتحة في الأسفل. تنانير A-line، بنطلونات واسعة. تجنب الكشكشة في الأعلى.",
    },
    bottomHourglass: {
        nameAr: "الساعة الرملية السفلي", nameEn: "Bottom Hourglass", emoji: "⌛",
        descAr: "خصر محدد مع وركين أكبر وصدر أصغر نسبياً.",
        exerciseAr: "تمارين الجزء العلوي (ضغط، سحب) لتعزيز التوازن. كتف وظهر لتوسيع الإطار العلوي.",
        fashionAr: "ألوان فاتحة وتفاصيل في الأعلى. أكتاف مبطنة. تنانير وبنطلونات بقصة مستقيمة.",
    },
    spoon: {
        nameAr: "الملعقة", nameEn: "Spoon", emoji: "🥄",
        descAr: "وركان أكبر بكثير من الصدر مع خصر محدد جيداً — مظهر يشبه الرف.",
        exerciseAr: "تمارين الجزء العلوي لتعزيزه. سباحة، تجديف. تمارين أكتاف وظهر.",
        fashionAr: "قمصان بياقات عريضة وتفاصيل. تجنب الجيوب على الوركين. بنطلونات داكنة ومستقيمة.",
    },
    triangle: {
        nameAr: "المثلث (الكمثرى)", nameEn: "Triangle / Pear", emoji: "🍐",
        descAr: "جزء علوي نحيل مع وركين عريضين أعرض من الكتفين وخصر أقل بروزاً.",
        exerciseAr: "ركّز على كتف وصدر وظهر لتوسيع الإطار العلوي. سباحة، تمارين ضغط. كارديو لحرق الدهون.",
        fashionAr: "ألوان فاتحة وزخارف في الأعلى. ياقات عريضة. بنطلونات داكنة بقصة مستقيمة.",
    },
    invertedTriangle: {
        nameAr: "المثلث المقلوب", nameEn: "Inverted Triangle", emoji: "🔻",
        descAr: "أكتاف وصدر عريضان مع وركين ضيقين — شكل V.",
        exerciseAr: "تمارين الجزء السفلي: سكوات، ديدلفت، لانجز. تجنب الإفراط في تمارين الكتف.",
        fashionAr: "بنطلونات بألوان فاتحة أو بنقشات. تنانير ذات حجم. قمصان بياقة V. تجنب الكتف المبطن.",
    },
    rectangle: {
        nameAr: "المستطيل", nameEn: "Rectangle", emoji: "▬",
        descAr: "صدر ووركان وخصر بنفس الحجم تقريباً — مظهر رياضي متناسق.",
        exerciseAr: "تمارين لبناء المنحنيات: سكوات وهيب ثرست للأرداف. تمارين خصر لتحديده. بيلاتس.",
        fashionAr: "أحزمة لتحديد الخصر. طبقات متعددة. فساتين ملتفة. تجنب الملابس المستقيمة تماماً.",
    },
};

/* ── Tabs ── */
type TabKey = "exercise" | "fashion" | "whr";

/* ── Determine body shape ── */
function determineShape(gender: "male" | "female", bust: number, waist: number, hips: number, highHip: number): string {
    const bustHipDiff = bust - hips;
    const hipBustDiff = hips - bust;
    const bustWaistDiff = bust - waist;
    const hipWaistDiff = hips - waist;

    if (gender === "female") {
        // Hourglass: bust≈hips, narrow waist
        if (Math.abs(bustHipDiff) <= 2.54 && bustWaistDiff >= 22.86 && hipWaistDiff >= 22.86) return "hourglass";
        // Top Hourglass
        if (bustHipDiff > 2.54 && bustHipDiff < 25.4 && bustWaistDiff >= 22.86) return "topHourglass";
        // Bottom Hourglass
        if (hipBustDiff >= 9.14 && hipBustDiff <= 25.4 && hipWaistDiff >= 22.86 && (hips / waist) >= 1.193) return "bottomHourglass";
        // Spoon
        if (hipBustDiff > 5.08 && hipWaistDiff >= 17.78 && (highHip / waist) >= 1.1) return "spoon";
        // Triangle / Pear
        if (hipBustDiff >= 9.14 && hipWaistDiff < 22.86) return "triangle";
        // Inverted Triangle
        if (bustHipDiff >= 9.14 && bustWaistDiff < 22.86) return "invertedTriangle";
        // Rectangle (default)
        return "rectangle";
    } else {
        // Male shapes
        // Inverted Triangle (athletic V)
        if (bustHipDiff >= 5.08 && bustWaistDiff >= 17.78) return "invertedTriangle";
        // Hourglass (rare for men)
        if (Math.abs(bustHipDiff) <= 5.08 && bustWaistDiff >= 12.7 && hipWaistDiff >= 12.7) return "hourglass";
        // Triangle
        if (hipBustDiff >= 5.08 && (waist - bust) < 17.78) return "triangle";
        // Top Hourglass
        if (bustHipDiff > 5.08 && bustHipDiff < 25.4 && bustWaistDiff >= 12.7) return "topHourglass";
        // Rectangle
        return "rectangle";
    }
}

/* ── Main Component ── */
export default function BodyShapeCalculatorCore() {
    const [gender, setGender] = useState<"male" | "female">("female");
    const [bust, setBust] = useState("90");
    const [waist, setWaist] = useState("70");
    const [hips, setHips] = useState("95");
    const [highHip, setHighHip] = useState("85");
    const [activeTab, setActiveTab] = useState<TabKey>("exercise");

    const result = useMemo(() => {
        const b = Math.max(30, parseFloat(bust) || 90);
        const w = Math.max(30, parseFloat(waist) || 70);
        const h = Math.max(30, parseFloat(hips) || 95);
        const hh = Math.max(30, parseFloat(highHip) || 85);

        const shapeKey = determineShape(gender, b, w, h, hh);
        const shape = SHAPES[shapeKey];

        // WHR (Waist-Hip Ratio)
        const whr = w / h;
        let whrRisk = "منخفض";
        let whrColor = "#006446";
        if (gender === "female") {
            if (whr > 0.85) { whrRisk = "مرتفع"; whrColor = "#c02020"; }
            else if (whr > 0.80) { whrRisk = "متوسط"; whrColor = "#c57600"; }
        } else {
            if (whr > 0.90) { whrRisk = "مرتفع"; whrColor = "#c02020"; }
            else if (whr > 0.85) { whrRisk = "متوسط"; whrColor = "#c57600"; }
        }

        // Somatotype hint
        let somatotype = "ميزومورف (رياضي)";
        let somatypeEn = "Mesomorph";
        if (gender === "female") {
            if (shapeKey === "rectangle" && w < 68) { somatotype = "إكتومورف (نحيل)"; somatypeEn = "Ectomorph"; }
            else if (shapeKey === "triangle" || shapeKey === "spoon") { somatotype = "إندومورف (ممتلئ)"; somatypeEn = "Endomorph"; }
        } else {
            if (shapeKey === "rectangle" && b < 95) { somatotype = "إكتومورف (نحيل)"; somatypeEn = "Ectomorph"; }
            else if (shapeKey === "triangle") { somatotype = "إندومورف (ممتلئ)"; somatypeEn = "Endomorph"; }
        }

        return { shapeKey, shape, whr, whrRisk, whrColor, somatotype, somatypeEn };
    }, [gender, bust, waist, hips, highHip]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة تحديد شكل الجسم</h2>
                <p className="con-calc__desc">أدخل قياساتك لمعرفة شكل جسمك ونسبة الخصر للورك (WHR) مع توصيات التمارين والملابس المناسبة.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📏 قياساتك</p>
                    <SelectField label="الجنس" value={gender} onChange={(v) => setGender(v as "male" | "female")} options={[
                        { value: "female", label: "أنثى" },
                        { value: "male", label: "ذكر" },
                    ]} />
                    <InputField label={gender === "female" ? "محيط الصدر" : "محيط الصدر"} value={bust} onChange={setBust} unit="سم" min={50} max={180} note="قيسي عند أعرض نقطة من الصدر" />
                    <InputField label="محيط الخصر" value={waist} onChange={setWaist} unit="سم" min={40} max={160} note="أضيق جزء من الجذع — فوق السرة" />
                    <InputField label="محيط الوركين" value={hips} onChange={setHips} unit="سم" min={50} max={180} note="أعرض نقطة أسفل الخصر (الأرداف)" />
                    <InputField label="أعلى الورك" value={highHip} onChange={setHighHip} unit="سم" min={50} max={170} note="عند أعلى عظمة الحوض — ليس أعرض نقطة" />
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>شكل جسمك</h4>

                {/* Main Result */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(120,70,180,0.06) 0%, rgba(120,70,180,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(120,70,180,0.12)", marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "3rem", marginBottom: "var(--s-2)" }}>{result.shape.emoji}</p>
                    <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#6b3fa0" }}>{result.shape.nameAr}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--n-text-secondary)", marginTop: "var(--s-1)" }}>{result.shape.nameEn}</p>
                    <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: "var(--s-3)", lineHeight: 1.6, maxWidth: 500, margin: "var(--s-3) auto 0" }}>
                        {result.shape.descAr}
                    </p>
                </div>

                {/* WHR + Somatotype badges */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginBottom: "var(--s-3)" }}>
                    <div style={{
                        padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)",
                        border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center",
                    }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)" }}>نسبة الخصر/الورك (WHR)</p>
                        <p style={{ fontSize: "1.3rem", fontWeight: 700, color: result.whrColor }}>{result.whr.toFixed(2)}</p>
                        <p style={{ fontSize: "0.78rem", color: result.whrColor, fontWeight: 600 }}>خطر صحي {result.whrRisk}</p>
                    </div>
                    <div style={{
                        padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)",
                        border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", textAlign: "center",
                    }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)" }}>النمط الجسماني</p>
                        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#6b3fa0" }}>{result.somatotype}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)" }}>{result.somatypeEn}</p>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-3)", flexWrap: "wrap" }}>
                    {([
                        { key: "exercise" as TabKey, label: "🏋️ تمارين مناسبة" },
                        { key: "fashion" as TabKey, label: "👗 دليل الملابس" },
                        { key: "whr" as TabKey, label: "❤️ المخاطر الصحية" },
                    ]).map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                            border: activeTab === t.key ? "1.5px solid #6b3fa0" : "1px solid var(--n-border)",
                            background: activeTab === t.key ? "rgba(120,70,180,0.06)" : "var(--n-surface)",
                            color: activeTab === t.key ? "#6b3fa0" : "var(--n-text-secondary)",
                            cursor: "pointer",
                        }}>{t.label}</button>
                    ))}
                </div>

                {activeTab === "exercise" && (
                    <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                        <p style={{ fontWeight: 700, marginBottom: "var(--s-2)", color: "#6b3fa0" }}>🏋️ تمارين مناسبة لشكل {result.shape.nameAr}:</p>
                        <p>{result.shape.exerciseAr}</p>
                    </div>
                )}

                {activeTab === "fashion" && (
                    <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                        <p style={{ fontWeight: 700, marginBottom: "var(--s-2)", color: "#6b3fa0" }}>👗 ملابس مناسبة لشكل {result.shape.nameAr}:</p>
                        <p>{result.shape.fashionAr}</p>
                    </div>
                )}

                {activeTab === "whr" && (
                    <div style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
                        <p style={{ marginBottom: "var(--s-3)", color: "var(--n-text-muted)" }}>نسبة الخصر للورك (WHR) مؤشر على توزيع الدهون والمخاطر الصحية (منظمة الصحة العالمية)</p>
                        <div style={{ display: "grid", gap: "var(--s-2)" }}>
                            {[
                                { label: gender === "female" ? "نساء — منخفض" : "رجال — منخفض", range: gender === "female" ? "≤ 0.80" : "≤ 0.85", color: "#006446" },
                                { label: gender === "female" ? "نساء — متوسط" : "رجال — متوسط", range: gender === "female" ? "0.81 – 0.85" : "0.86 – 0.90", color: "#c57600" },
                                { label: gender === "female" ? "نساء — مرتفع" : "رجال — مرتفع", range: gender === "female" ? "> 0.85" : "> 0.90", color: "#c02020" },
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
                        <p style={{ marginTop: "var(--s-3)", fontSize: "0.78rem", color: "var(--n-text-muted)" }}>
                            نسبتك: <strong style={{ color: result.whrColor }}>{result.whr.toFixed(2)} — خطر {result.whrRisk}</strong>
                            <br />WHR المرتفع يرتبط بزيادة مخاطر أمراض القلب والسكري نوع 2 وارتفاع ضغط الدم.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
