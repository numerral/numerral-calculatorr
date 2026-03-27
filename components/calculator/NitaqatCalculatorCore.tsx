"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtPct = (n: number) => `${fmt(n, 1)}%`;

function ResultRow({ label, value, unit, highlight }: { label: string; value: string; unit?: string; highlight?: boolean }) {
    return (
        <div className="con-result-row" style={highlight ? { background: "rgba(0,106,60,0.08)", borderRadius: 6, padding: "6px 10px" } : undefined}>
            <span className="con-result-row__label">{label}</span>
            <span className="con-result-row__value">{value}{unit ? <span className="con-result-row__unit"> {unit}</span> : null}</span>
        </div>
    );
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder }: {
    label: string; value: number | string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; placeholder?: string;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 1} placeholder={placeholder} />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </div>
    );
}

/* ── Nitaqat Sector Data ── */
// Each sector: name (AR), name (EN), and Saudization thresholds for each band
// Thresholds: [Red ceiling, Low Green ceiling, Mid Green ceiling, High Green ceiling], Platinum = above High Green
// These are approximate consolidated thresholds based on MHRSD published data
interface SectorThresholds {
    id: string;
    nameAr: string;
    nameEn: string;
    // Thresholds as min % for each band: [lowGreen, midGreen, highGreen, platinum]
    // Red = below lowGreen
    bands: { red: number; lowGreen: number; midGreen: number; highGreen: number; platinum: number };
    smallBiz?: boolean; // If true, 5 or fewer employees have simplified rules
}

const SECTORS: SectorThresholds[] = [
    { id: "construction", nameAr: "التشييد والبناء", nameEn: "Construction", bands: { red: 0, lowGreen: 6, midGreen: 12, highGreen: 22, platinum: 35 } },
    { id: "retail", nameAr: "تجارة التجزئة", nameEn: "Retail Trade", bands: { red: 0, lowGreen: 12, midGreen: 20, highGreen: 30, platinum: 44 } },
    { id: "wholesale", nameAr: "تجارة الجملة", nameEn: "Wholesale Trade", bands: { red: 0, lowGreen: 7, midGreen: 15, highGreen: 25, platinum: 40 } },
    { id: "accommodation", nameAr: "الإقامة والطعام", nameEn: "Accommodation & Food", bands: { red: 0, lowGreen: 8, midGreen: 15, highGreen: 24, platinum: 38 } },
    { id: "manufacturing", nameAr: "الصناعة التحويلية", nameEn: "Manufacturing", bands: { red: 0, lowGreen: 10, midGreen: 18, highGreen: 28, platinum: 42 } },
    { id: "ict", nameAr: "المعلومات والاتصالات", nameEn: "ICT / Telecom", bands: { red: 0, lowGreen: 18, midGreen: 28, highGreen: 38, platinum: 50 } },
    { id: "finance", nameAr: "الأنشطة المالية والتأمين", nameEn: "Finance & Insurance", bands: { red: 0, lowGreen: 20, midGreen: 30, highGreen: 40, platinum: 55 } },
    { id: "healthcare", nameAr: "الصحة والخدمات الطبية", nameEn: "Healthcare", bands: { red: 0, lowGreen: 15, midGreen: 25, highGreen: 35, platinum: 50 } },
    { id: "education", nameAr: "التعليم", nameEn: "Education", bands: { red: 0, lowGreen: 15, midGreen: 25, highGreen: 35, platinum: 50 } },
    { id: "transport", nameAr: "النقل والتخزين", nameEn: "Transport & Storage", bands: { red: 0, lowGreen: 5, midGreen: 10, highGreen: 18, platinum: 30 } },
    { id: "realestate", nameAr: "الأنشطة العقارية", nameEn: "Real Estate", bands: { red: 0, lowGreen: 12, midGreen: 20, highGreen: 30, platinum: 44 } },
    { id: "professional", nameAr: "الأنشطة المهنية والعلمية", nameEn: "Professional & Scientific", bands: { red: 0, lowGreen: 15, midGreen: 25, highGreen: 35, platinum: 50 } },
    { id: "admin", nameAr: "الخدمات الإدارية والدعم", nameEn: "Admin & Support Services", bands: { red: 0, lowGreen: 5, midGreen: 12, highGreen: 20, platinum: 32 } },
    { id: "mining", nameAr: "التعدين واستغلال المحاجر", nameEn: "Mining & Quarrying", bands: { red: 0, lowGreen: 8, midGreen: 16, highGreen: 26, platinum: 40 } },
    { id: "other", nameAr: "أنشطة أخرى", nameEn: "Other Activities", bands: { red: 0, lowGreen: 10, midGreen: 18, highGreen: 28, platinum: 42 } },
];

type BandName = "red" | "lowGreen" | "midGreen" | "highGreen" | "platinum";

interface BandInfo {
    key: BandName;
    nameAr: string;
    nameEn: string;
    color: string;
    bgColor: string;
    emoji: string;
}

const BANDS: BandInfo[] = [
    { key: "red", nameAr: "الأحمر", nameEn: "Red", color: "#dc2626", bgColor: "rgba(220,38,38,0.12)", emoji: "🔴" },
    { key: "lowGreen", nameAr: "الأخضر المنخفض", nameEn: "Low Green", color: "#a3a300", bgColor: "rgba(163,163,0,0.12)", emoji: "🟡" },
    { key: "midGreen", nameAr: "الأخضر المتوسط", nameEn: "Mid Green", color: "#65a30d", bgColor: "rgba(101,163,13,0.12)", emoji: "🟢" },
    { key: "highGreen", nameAr: "الأخضر المرتفع", nameEn: "High Green", color: "#16a34a", bgColor: "rgba(22,163,74,0.12)", emoji: "🟩" },
    { key: "platinum", nameAr: "البلاتيني", nameEn: "Platinum", color: "#7c3aed", bgColor: "rgba(124,58,237,0.12)", emoji: "🟪" },
];

function getBand(pct: number, sector: SectorThresholds): BandInfo {
    if (pct >= sector.bands.platinum) return BANDS[4];
    if (pct >= sector.bands.highGreen) return BANDS[3];
    if (pct >= sector.bands.midGreen) return BANDS[2];
    if (pct >= sector.bands.lowGreen) return BANDS[1];
    return BANDS[0];
}

function getNextBand(current: BandInfo): BandInfo | null {
    const idx = BANDS.findIndex(b => b.key === current.key);
    return idx < BANDS.length - 1 ? BANDS[idx + 1] : null;
}

function getNextBandThreshold(current: BandInfo, sector: SectorThresholds): number | null {
    const next = getNextBand(current);
    if (!next) return null;
    return sector.bands[next.key];
}

/* ── Band Progress Bar ── */
function BandBar({ pct, sector }: { pct: number; sector: SectorThresholds }) {
    const segments = [
        { band: BANDS[0], start: 0, end: sector.bands.lowGreen },
        { band: BANDS[1], start: sector.bands.lowGreen, end: sector.bands.midGreen },
        { band: BANDS[2], start: sector.bands.midGreen, end: sector.bands.highGreen },
        { band: BANDS[3], start: sector.bands.highGreen, end: sector.bands.platinum },
        { band: BANDS[4], start: sector.bands.platinum, end: 100 },
    ];
    const maxPct = Math.max(sector.bands.platinum + 10, pct + 5, 60);

    return (
        <div style={{ margin: "var(--s-4) 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 4, color: "var(--text-muted)" }}>
                <span>Nitaqat Band Position</span>
                <span style={{ fontWeight: 700 }}>{fmtPct(pct)}</span>
            </div>
            <div style={{ position: "relative", height: 28, borderRadius: 8, overflow: "hidden", display: "flex" }}>
                {segments.map((seg, i) => {
                    const w = ((Math.min(seg.end, maxPct) - seg.start) / maxPct) * 100;
                    return (
                        <div key={i} style={{
                            width: `${Math.max(w, 0)}%`, background: seg.band.color, opacity: 0.25,
                            borderRight: i < 4 ? "2px solid rgba(255,255,255,0.4)" : "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.65rem", color: "#fff", fontWeight: 600, minWidth: w > 0 ? 2 : 0,
                        }}>
                            {w > 8 ? `${seg.start}%` : ""}
                        </div>
                    );
                })}
                {/* Marker */}
                <div style={{
                    position: "absolute", left: `${Math.min((pct / maxPct) * 100, 99)}%`, top: 0, bottom: 0,
                    width: 3, background: "#fff", borderRadius: 2, boxShadow: "0 0 6px rgba(0,0,0,0.5)", transition: "left 0.4s ease",
                }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", marginTop: 2, color: "var(--text-muted)" }}>
                {BANDS.map((b) => <span key={b.key} style={{ color: b.color }}>{b.emoji} {b.nameAr}</span>)}
            </div>
        </div>
    );
}

/* ── Main Calculator Logic ── */
function calculateNitaqat(
    sectorId: string,
    saudiFull: number,
    saudiLowSalary: number,
    saudiDisability: number,
    saudiPartTime: number,
    nonSaudi: number,
) {
    const sector = SECTORS.find(s => s.id === sectorId) || SECTORS[0];
    const totalEmployees = saudiFull + saudiLowSalary + saudiDisability + saudiPartTime + nonSaudi;
    if (totalEmployees <= 0) return null;

    // Weighted Saudi count
    const disabilityCap = Math.floor(totalEmployees * 0.10); // 10% cap
    const effectiveDisability = Math.min(saudiDisability, disabilityCap);
    const weightedSaudi = (saudiFull * 1.0) + (saudiLowSalary * 0.5) + (effectiveDisability * 4.0) + (saudiPartTime * 0.5);
    const rawSaudi = saudiFull + saudiLowSalary + saudiDisability + saudiPartTime;

    const saudizationPct = (weightedSaudi / totalEmployees) * 100;
    const rawPct = (rawSaudi / totalEmployees) * 100;

    // Small business check
    const isSmallBiz = totalEmployees <= 5;

    const band = getBand(saudizationPct, sector);
    const nextBand = getNextBand(band);
    const nextThreshold = getNextBandThreshold(band, sector);

    // Gap analysis: how many more Saudis (full, SAR 4K+) needed for next band
    let gapSaudis: number | null = null;
    if (nextThreshold !== null) {
        // Need: (weightedSaudi + X) / (totalEmployees + X) * 100 >= nextThreshold
        // X = (nextThreshold * totalEmployees - weightedSaudi * 100) / (100 - nextThreshold)
        const numerator = (nextThreshold / 100) * totalEmployees - weightedSaudi;
        const denominator = 1 - (nextThreshold / 100);
        gapSaudis = denominator > 0 ? Math.ceil(numerator / denominator) : Math.ceil(numerator);
        if (gapSaudis < 0) gapSaudis = 0;
    }

    const steps = [
        `إجمالي الموظفين: ${totalEmployees}`,
        `السعوديون (راتب ≥ 4,000): ${saudiFull} × 1.0 = ${fmt(saudiFull * 1.0, 1)}`,
        saudiLowSalary > 0 ? `السعوديون (راتب < 4,000): ${saudiLowSalary} × 0.5 = ${fmt(saudiLowSalary * 0.5, 1)}` : null,
        saudiDisability > 0 ? `ذوو الإعاقة: ${saudiDisability} × 4.0 = ${fmt(effectiveDisability * 4.0, 1)}${effectiveDisability < saudiDisability ? ` (سقف 10%: ${disabilityCap})` : ""}` : null,
        saudiPartTime > 0 ? `دوام جزئي: ${saudiPartTime} × 0.5 = ${fmt(saudiPartTime * 0.5, 1)}` : null,
        `إجمالي السعوديين المرجّح: ${fmt(weightedSaudi, 1)}`,
        `غير السعوديين: ${nonSaudi}`,
        `نسبة التوطين = (${fmt(weightedSaudi, 1)} ÷ ${totalEmployees}) × 100 = ${fmtPct(saudizationPct)}`,
    ].filter(Boolean) as string[];

    return {
        sector, totalEmployees, weightedSaudi, rawSaudi, saudizationPct, rawPct,
        band, nextBand, nextThreshold, gapSaudis, isSmallBiz, steps,
    };
}

/* ── Calculator Tab ── */
function NitaqatCalculatorTab() {
    const [sectorId, setSectorId] = useState("retail");
    const [saudiFull, setSaudiFull] = useState("8");
    const [saudiLowSalary, setSaudiLowSalary] = useState("2");
    const [saudiDisability, setSaudiDisability] = useState("0");
    const [saudiPartTime, setSaudiPartTime] = useState("0");
    const [nonSaudi, setNonSaudi] = useState("40");
    const [showComparison, setShowComparison] = useState(false);
    const [futureSaudiFull, setFutureSaudiFull] = useState("12");
    const [futureNonSaudi, setFutureNonSaudi] = useState("38");

    const r = useMemo(() => calculateNitaqat(
        sectorId, parseInt(saudiFull) || 0, parseInt(saudiLowSalary) || 0,
        parseInt(saudiDisability) || 0, parseInt(saudiPartTime) || 0, parseInt(nonSaudi) || 0
    ), [sectorId, saudiFull, saudiLowSalary, saudiDisability, saudiPartTime, nonSaudi]);

    const futureR = useMemo(() => {
        if (!showComparison) return null;
        return calculateNitaqat(
            sectorId, parseInt(futureSaudiFull) || 0, parseInt(saudiLowSalary) || 0,
            parseInt(saudiDisability) || 0, parseInt(saudiPartTime) || 0, parseInt(futureNonSaudi) || 0
        );
    }, [showComparison, sectorId, futureSaudiFull, saudiLowSalary, saudiDisability, saudiPartTime, futureNonSaudi]);

    return (
        <div>
            <div className="con-calc__inputs">
                <SelectField label="النشاط الاقتصادي — Economic Activity" value={sectorId} onChange={setSectorId}
                    options={SECTORS.map(s => ({ value: s.id, label: `${s.nameAr} — ${s.nameEn}` }))} />
                <InputField label="سعوديون (راتب ≥ 4,000 ر.س) — Saudis ≥ SAR 4K" value={saudiFull} onChange={setSaudiFull} min={0} placeholder="e.g. 8" />
                <InputField label="سعوديون (راتب < 4,000 ر.س) — Saudis < SAR 4K" value={saudiLowSalary} onChange={setSaudiLowSalary} min={0} placeholder="e.g. 2" />
                <InputField label="سعوديون من ذوي الإعاقة — Saudis w/ Disability" value={saudiDisability} onChange={setSaudiDisability} min={0} placeholder="e.g. 1" />
                <InputField label="سعوديون دوام جزئي — Part-Time Saudis" value={saudiPartTime} onChange={setSaudiPartTime} min={0} placeholder="e.g. 0" />
                <InputField label="غير سعوديين — Non-Saudi Employees" value={nonSaudi} onChange={setNonSaudi} min={0} placeholder="e.g. 40" />
            </div>

            {r && (
                <div className="con-calc__results">
                    <h4>النتيجة — Result</h4>
                    <ResultRow label="نسبة التوطين (مرجّحة)" value={fmtPct(r.saudizationPct)} highlight />
                    <ResultRow label="نسبة التوطين (خام)" value={fmtPct(r.rawPct)} />
                    <ResultRow label="إجمالي الموظفين" value={`${r.totalEmployees}`} />
                    <ResultRow label="السعوديون المرجّحون" value={fmt(r.weightedSaudi, 1)} />

                    {/* Band Badge */}
                    <div style={{
                        margin: "var(--s-3) 0", padding: "12px 16px", borderRadius: 10,
                        background: r.band.bgColor, border: `2px solid ${r.band.color}`,
                        display: "flex", alignItems: "center", gap: 12,
                    }}>
                        <span style={{ fontSize: "1.8rem" }}>{r.band.emoji}</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: r.band.color }}>
                                {r.band.nameAr} — {r.band.nameEn}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                {r.sector.nameAr} — {r.sector.nameEn}
                            </div>
                        </div>
                    </div>

                    {r.isSmallBiz && (
                        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(234,179,8,0.1)", fontSize: "0.82rem", marginBottom: "var(--s-3)" }}>
                            ⚠️ <strong>منشأة صغيرة (فئة أ):</strong> المنشآت التي لديها 5 موظفين أو أقل تتبع قواعد مبسّطة — يكفي توظيف سعودي واحد للدخول في النطاق الأخضر.
                        </div>
                    )}

                    {/* Band Bar */}
                    <BandBar pct={r.saudizationPct} sector={r.sector} />

                    {/* Gap Analysis */}
                    {r.gapSaudis !== null && r.nextBand && r.gapSaudis > 0 && (
                        <div style={{
                            padding: "12px 16px", borderRadius: 8, background: "rgba(0,106,60,0.06)",
                            border: "1px solid rgba(0,106,60,0.2)", fontSize: "0.85rem", marginTop: "var(--s-3)",
                        }}>
                            📊 <strong>تحليل الفجوة:</strong> تحتاج لتوظيف <strong>{r.gapSaudis} موظف سعودي إضافي</strong> (براتب ≥ 4,000 ر.س) للانتقال إلى <span style={{ color: r.nextBand.color, fontWeight: 700 }}>{r.nextBand.nameAr} ({r.nextBand.nameEn})</span> — نسبة {fmtPct(r.nextThreshold!)}.
                        </div>
                    )}
                    {r.gapSaudis === 0 && r.nextBand && (
                        <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(0,106,60,0.06)", border: "1px solid rgba(0,106,60,0.2)", fontSize: "0.85rem", marginTop: "var(--s-3)" }}>
                            ✅ أنت على حافة النطاق التالي — أي توظيف إضافي سيرفع مستواك!
                        </div>
                    )}
                    {r.band.key === "platinum" && (
                        <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", fontSize: "0.85rem", marginTop: "var(--s-3)" }}>
                            🏆 <strong>ممتاز!</strong> منشأتك في النطاق البلاتيني — أعلى مستوى في برنامج نطاقات. تتمتع بجميع المزايا الحكومية ذات الأولوية.
                        </div>
                    )}

                    <h4 style={{ marginTop: "var(--s-4)" }}>خطوات الحساب</h4>
                    {r.steps.map((s, i) => <ResultRow key={i} label={`${i + 1}`} value={s} />)}

                    {/* Comparison Mode */}
                    <div style={{ marginTop: "var(--s-4)" }}>
                        <button onClick={() => setShowComparison(!showComparison)} style={{
                            padding: "8px 16px", borderRadius: 6, fontSize: "0.82rem", cursor: "pointer",
                            background: showComparison ? "var(--primary, #006a3c)" : "transparent",
                            color: showComparison ? "#fff" : "var(--text-muted)",
                            border: showComparison ? "none" : "1px solid var(--border)",
                        }}>
                            📊 {showComparison ? "إخفاء المقارنة" : "مقارنة سيناريو مستقبلي"}
                        </button>
                    </div>

                    {showComparison && (
                        <div style={{ marginTop: "var(--s-3)", padding: "16px", borderRadius: 10, background: "rgba(124,58,237,0.04)", border: "1px dashed var(--border)" }}>
                            <h4 style={{ marginBottom: "var(--s-2)" }}>🔮 السيناريو المستقبلي</h4>
                            <div className="con-calc__inputs">
                                <InputField label="سعوديون (≥ 4K) في السيناريو الجديد" value={futureSaudiFull} onChange={setFutureSaudiFull} min={0} />
                                <InputField label="غير سعوديين في السيناريو الجديد" value={futureNonSaudi} onChange={setFutureNonSaudi} min={0} />
                            </div>
                            {futureR && (
                                <div style={{ marginTop: "var(--s-2)" }}>
                                    <ResultRow label="نسبة التوطين الجديدة" value={fmtPct(futureR.saudizationPct)} highlight />
                                    <div style={{
                                        margin: "var(--s-2) 0", padding: "10px 14px", borderRadius: 8,
                                        background: futureR.band.bgColor, border: `1px solid ${futureR.band.color}`,
                                        display: "flex", alignItems: "center", gap: 10,
                                    }}>
                                        <span style={{ fontSize: "1.4rem" }}>{futureR.band.emoji}</span>
                                        <div>
                                            <span style={{ fontWeight: 700, color: futureR.band.color }}>{futureR.band.nameAr}</span>
                                            {futureR.band.key !== r.band.key && (
                                                <span style={{ fontSize: "0.78rem", marginRight: 8 }}>
                                                    {" "}← {BANDS.findIndex(b => b.key === futureR.band.key) > BANDS.findIndex(b => b.key === r.band.key) ? "⬆️ ترقية" : "⬇️ تراجع"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        ⚠️ هذه الحاسبة تقدم تقديرات تقريبية بناءً على بيانات نطاقات المنشورة. للنتائج الرسمية، استخدم منصة قوى (qiwa.sa). النسب الفعلية تعتمد على النشاط الاقتصادي الفرعي الدقيق (ISIC4) وتُحدَّث ربع سنوياً من وزارة الموارد البشرية.
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Quick Reference Tab ── */
function NitaqatReferenceTab() {
    const ts = { width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 10px", textAlign: "center" as const };
    const td = { padding: "6px 10px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (
        <div className="con-calc__results">
            <h4>نسب التوطين حسب النشاط الاقتصادي</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={ts}>
                    <thead><tr style={bh}>
                        <th style={{ ...th, textAlign: "left" }}>النشاط</th>
                        <th style={{ ...th, color: "#dc2626" }}>🔴 أحمر</th>
                        <th style={{ ...th, color: "#a3a300" }}>🟡 أخضر↓</th>
                        <th style={{ ...th, color: "#65a30d" }}>🟢 أخضر م</th>
                        <th style={{ ...th, color: "#16a34a" }}>🟩 أخضر↑</th>
                        <th style={{ ...th, color: "#7c3aed" }}>🟪 بلاتيني</th>
                    </tr></thead>
                    <tbody>
                        {SECTORS.map((s) => (
                            <tr key={s.id} style={b}>
                                <td style={{ ...tl, fontWeight: 600 }}>{s.nameAr}</td>
                                <td style={{ ...td, color: "#dc2626" }}>&lt;{s.bands.lowGreen}%</td>
                                <td style={td}>{s.bands.lowGreen}%–{s.bands.midGreen - 1}%</td>
                                <td style={td}>{s.bands.midGreen}%–{s.bands.highGreen - 1}%</td>
                                <td style={td}>{s.bands.highGreen}%–{s.bands.platinum - 1}%</td>
                                <td style={{ ...td, color: "#7c3aed", fontWeight: 700 }}>≥{s.bands.platinum}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h4 style={{ marginTop: "var(--s-4)" }}>قواعد احتساب الموظفين</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={ts}>
                    <thead><tr style={bh}>
                        <th style={{ ...th, textAlign: "left" }}>نوع الموظف</th>
                        <th style={th}>المعامل</th>
                        <th style={{ ...th, textAlign: "left" }}>الشرط</th>
                    </tr></thead>
                    <tbody>
                        {[
                            ["سعودي — راتب ≥ 4,000 ر.س", "1.0", "دوام كامل + عقد موثق في قوى"],
                            ["سعودي — راتب < 4,000 ر.س", "0.5", "نصف احتساب"],
                            ["سعودي من ذوي الإعاقة", "4.0", "بحد أقصى 10% من إجمالي السعوديين"],
                            ["سعودي — دوام جزئي", "0.5", "مع حدود على النسبة"],
                            ["سعودي — طالب", "0.5", "مع حدود"],
                            ["سعودي — عمل عن بُعد", "1.0", "احتساب كامل"],
                            ["مستثمر أجنبي (مالك)", "1.0", "يُحتسب كسعودي"],
                            ["مواطن خليجي (GCC)", "1.0", "احتساب كامل"],
                        ].map(([type, factor, cond], i) => (
                            <tr key={i} style={b}>
                                <td style={{ ...tl, fontWeight: 600 }}>{type}</td>
                                <td style={{ ...td, fontWeight: 700, color: "#006a3c" }}>{factor}</td>
                                <td style={tl}>{cond}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h4 style={{ marginTop: "var(--s-4)" }}>مزايا وعقوبات النطاقات</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={ts}>
                    <thead><tr style={bh}>
                        <th style={{ ...th, textAlign: "left" }}>الخدمة</th>
                        <th style={{ ...th, color: "#16a34a" }}>🟢 أخضر / 🟪 بلاتيني</th>
                        <th style={{ ...th, color: "#dc2626" }}>🔴 أحمر</th>
                    </tr></thead>
                    <tbody>
                        {[
                            ["إصدار تأشيرات عمل", "✅ مسموح", "❌ محظور"],
                            ["تجديد رخص العمل", "✅ طبيعي", "❌ محظور"],
                            ["تجديد الإقامات", "✅ طبيعي", "❌ محظور"],
                            ["نقل خدمات الموظفين", "✅ مسموح", "❌ لا يمكن منع النقل"],
                            ["فتح فروع جديدة", "✅ مسموح", "❌ محظور"],
                            ["المناقصات الحكومية", "✅ مؤهل", "❌ محظور"],
                            ["رسوم رخصة العمل", "700 ر.س/شهر", "800 ر.س/شهر"],
                            ["تغيير مهن الوافدين", "✅ مسموح", "❌ محظور"],
                        ].map(([service, green, red], i) => (
                            <tr key={i} style={b}>
                                <td style={{ ...tl, fontWeight: 600 }}>{service}</td>
                                <td style={{ ...td, color: "#16a34a" }}>{green}</td>
                                <td style={{ ...td, color: "#dc2626" }}>{red}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ── Main Export ── */
export default function NitaqatCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 الحاسبة", "📋 جداول مرجعية"];

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏢 حاسبة نطاقات — Nitaqat Calculator</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
                {tabs.map((t, i) => (
                    <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>
                ))}
            </div>
            {tab === 0 && <NitaqatCalculatorTab />}
            {tab === 1 && <NitaqatReferenceTab />}
        </div>
    );
}
