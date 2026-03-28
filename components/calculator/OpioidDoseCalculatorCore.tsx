// OpioidDoseCalculatorCore — MME Calculator for US clinical audience
// Calculates total daily Morphine Milligram Equivalents from multiple opioid inputs
"use client";

import "./opioid-calc.css";

import { useState, useMemo, useCallback, useRef } from "react";

/* ── Opioid definitions with CDC/AMDG-aligned conversion factors ── */
interface OpioidDef {
    id: string;
    name: string;
    unit: string;
    factor: number | "methadone";
    note?: string;
    footnote?: string;
}

const OPIOIDS: OpioidDef[] = [
    { id: "codeine", name: "Codeine", unit: "mg/day", factor: 0.15, note: "Oral" },
    { id: "fentanyl", name: "Fentanyl Transdermal", unit: "mcg/hr", factor: 2.4, note: "Patch only — NOT for IV/IM", footnote: "†" },
    { id: "hydrocodone", name: "Hydrocodone", unit: "mg/day", factor: 1.0, note: "Oral — 1:1 with Morphine" },
    { id: "hydromorphone", name: "Hydromorphone", unit: "mg/day", factor: 5.0, note: "Oral — high potency" },
    { id: "methadone", name: "Methadone", unit: "mg/day", factor: "methadone", note: "Dose-dependent — see below", footnote: "‡" },
    { id: "morphine", name: "Morphine", unit: "mg/day", factor: 1.0, note: "Oral — reference standard" },
    { id: "oxycodone", name: "Oxycodone", unit: "mg/day", factor: 1.5, note: "Oral" },
    { id: "oxymorphone", name: "Oxymorphone", unit: "mg/day", factor: 3.0, note: "Oral" },
    { id: "tapentadol", name: "Tapentadol", unit: "mg/day", factor: 0.4, note: "Dual mechanism" },
    { id: "tramadol", name: "Tramadol", unit: "mg/day", factor: 0.1, note: "Synthetic — lower potency" },
    { id: "buprenorphine", name: "Buprenorphine Transdermal", unit: "mcg/hr", factor: 12.6, note: "Partial agonist — ceiling effect", footnote: "§" },
];

/* ── Methadone dose-dependent conversion (AMDG/WA State) ── */
function methadoneMME(dailyDose: number): number {
    if (dailyDose <= 0) return 0;
    if (dailyDose <= 20) return dailyDose * 4;
    if (dailyDose <= 40) return dailyDose * 8;
    if (dailyDose <= 60) return dailyDose * 10;
    return dailyDose * 12;
}

function methadoneFactor(dailyDose: number): number {
    if (dailyDose <= 0) return 4;
    if (dailyDose <= 20) return 4;
    if (dailyDose <= 40) return 8;
    if (dailyDose <= 60) return 10;
    return 12;
}

/* ── Risk tier computation ── */
interface RiskTier {
    label: string;
    color: string;
    bg: string;
    border: string;
    description: string;
    icon: string;
}

function getRiskTier(mme: number): RiskTier {
    if (mme === 0) return { label: "No Opioids", color: "#64748b", bg: "rgba(100,116,139,.08)", border: "rgba(100,116,139,.2)", description: "Enter opioid doses above to calculate MME.", icon: "⚪" };
    if (mme < 50) return { label: "Lower Risk", color: "#16a34a", bg: "rgba(22,163,74,.08)", border: "rgba(22,163,74,.25)", description: "Below CDC cautionary threshold. Standard monitoring recommended.", icon: "🟢" };
    if (mme < 90) return { label: "Increased Caution", color: "#ca8a04", bg: "rgba(202,138,4,.08)", border: "rgba(202,138,4,.25)", description: "≥50 MME/day — CDC recommends reassessing benefits and risks, overdose prevention education, and considering naloxone co-prescribing.", icon: "🟡" };
    if (mme < 120) return { label: "High Risk", color: "#ea580c", bg: "rgba(234,88,12,.08)", border: "rgba(234,88,12,.25)", description: "≥90 MME/day — CDC recommends avoiding increase to this level, or carefully justifying the clinical decision. Specialist consultation advised.", icon: "🟠" };
    return { label: "Very High Risk", color: "#dc2626", bg: "rgba(220,38,38,.08)", border: "rgba(220,38,38,.25)", description: "≥120 MME/day — AMDG Guideline recommends pain specialist consultation before prescribing at this level.", icon: "🔴" };
}

/* ── Main Component ── */
export default function OpioidDoseCalculatorCore() {
    const [doses, setDoses] = useState<Record<string, number>>({});
    const [bzd, setBzd] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handleDoseChange = useCallback((id: string, value: string) => {
        const parsed = parseFloat(value);
        setDoses((prev) => ({ ...prev, [id]: isNaN(parsed) || parsed < 0 ? 0 : parsed }));
    }, []);

    /* ── Derived results ── */
    const results = useMemo(() => {
        const entries = OPIOIDS.map((op) => {
            const dose = doses[op.id] || 0;
            let mme = 0;
            if (dose > 0) {
                if (op.factor === "methadone") {
                    mme = methadoneMME(dose);
                } else {
                    mme = dose * op.factor;
                }
            }
            return { ...op, dose, mme: Math.round(mme * 10) / 10 };
        });
        const totalMME = entries.reduce((sum, e) => sum + e.mme, 0);
        return { entries, totalMME: Math.round(totalMME * 10) / 10 };
    }, [doses]);

    const tier = getRiskTier(results.totalMME);
    const showNaloxone = results.totalMME >= 50 || bzd;

    const handleReset = () => {
        setDoses({});
        setBzd(false);
    };

    const handlePrint = () => {
        if (printRef.current) window.print();
    };

    /* ── Risk meter gauge calculation ── */
    const gaugePercent = Math.min(results.totalMME / 150, 1) * 100;

    return (
        <div className="opioid-calc" ref={printRef}>
            {/* CAUTION Banner */}
            <div className="opioid-calc__caution">
                <strong>⚠️ CLINICAL TOOL — FOR EDUCATIONAL PURPOSES ONLY</strong>
                <p>This calculator estimates total daily Morphine Milligram Equivalents (MME). It should <strong>NOT</strong> be used to determine doses when converting a patient from one opioid to another. Always exercise independent clinical judgment.</p>
            </div>

            {/* Opioid Input Grid */}
            <div className="opioid-calc__grid">
                <div className="opioid-calc__header">
                    <span>Opioid (oral or transdermal)</span>
                    <span>Dose</span>
                    <span>MME/day</span>
                </div>
                {OPIOIDS.map((op) => {
                    const dose = doses[op.id] || 0;
                    const entry = results.entries.find((e) => e.id === op.id)!;
                    return (
                        <div className="opioid-calc__row" key={op.id}>
                            <label className="opioid-calc__label" htmlFor={`opioid-${op.id}`}>
                                {op.name}
                                {op.footnote && <sup className="opioid-calc__footnote-ref">{op.footnote}</sup>}
                                <span className="opioid-calc__unit">({op.unit})</span>
                            </label>
                            <input
                                id={`opioid-${op.id}`}
                                type="number"
                                className="opioid-calc__input"
                                value={dose || ""}
                                placeholder="0"
                                min={0}
                                onChange={(e) => handleDoseChange(op.id, e.target.value)}
                                inputMode="decimal"
                            />
                            <span className={`opioid-calc__mme ${entry.mme > 0 ? "opioid-calc__mme--active" : ""}`}>
                                {entry.mme > 0 ? entry.mme.toLocaleString("en-US") : "—"}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Total + Risk Meter */}
            <div className="opioid-calc__result" style={{ borderColor: tier.border, backgroundColor: tier.bg }}>
                <div className="opioid-calc__total-row">
                    <span className="opioid-calc__total-label">Total Daily MME</span>
                    <span className="opioid-calc__total-value" style={{ color: tier.color }}>
                        {results.totalMME.toLocaleString("en-US")}
                    </span>
                </div>

                {/* Risk Gauge */}
                <div className="opioid-calc__gauge">
                    <div className="opioid-calc__gauge-track">
                        <div className="opioid-calc__gauge-seg opioid-calc__gauge-seg--green" style={{ width: "33.3%" }} />
                        <div className="opioid-calc__gauge-seg opioid-calc__gauge-seg--yellow" style={{ width: "26.7%" }} />
                        <div className="opioid-calc__gauge-seg opioid-calc__gauge-seg--orange" style={{ width: "20%" }} />
                        <div className="opioid-calc__gauge-seg opioid-calc__gauge-seg--red" style={{ width: "20%" }} />
                        <div className="opioid-calc__gauge-needle" style={{ left: `${gaugePercent}%` }} />
                    </div>
                    <div className="opioid-calc__gauge-labels">
                        <span>0</span>
                        <span>50</span>
                        <span>90</span>
                        <span>120</span>
                        <span>150+</span>
                    </div>
                </div>

                <div className="opioid-calc__tier">
                    <span className="opioid-calc__tier-icon">{tier.icon}</span>
                    <span className="opioid-calc__tier-label" style={{ color: tier.color }}>{tier.label}</span>
                </div>
                <p className="opioid-calc__tier-desc">{tier.description}</p>

                {/* Naloxone Badge */}
                {showNaloxone && (
                    <div className="opioid-calc__naloxone">
                        <strong>💊 Naloxone Co-Prescribing Recommended</strong>
                        <p>CDC recommends offering naloxone and overdose prevention education when MME ≥50/day{bzd ? " or when benzodiazepines are co-prescribed" : ""}.</p>
                    </div>
                )}
            </div>

            {/* Benzodiazepine Toggle */}
            <div className="opioid-calc__bzd">
                <label className="opioid-calc__bzd-label">
                    <input type="checkbox" checked={bzd} onChange={() => setBzd(!bzd)} />
                    <span>Patient is also taking benzodiazepines</span>
                </label>
                {bzd && (
                    <div className="opioid-calc__bzd-warn">
                        <strong>⚠️ FDA Black Box Warning:</strong> Concurrent use of opioids with benzodiazepines or other CNS depressants significantly increases the risk of respiratory depression, profound sedation, coma, and death. The lowest effective doses and shortest durations should be used.
                    </div>
                )}
            </div>

            {/* Per-Opioid Breakdown */}
            {results.totalMME > 0 && (
                <div className="opioid-calc__breakdown">
                    <h4>MME Breakdown by Opioid</h4>
                    <div className="opioid-calc__breakdown-bars">
                        {results.entries
                            .filter((e) => e.mme > 0)
                            .sort((a, b) => b.mme - a.mme)
                            .map((e) => {
                                const pct = (e.mme / results.totalMME) * 100;
                                const factorDisplay = e.factor === "methadone" ? `${methadoneFactor(e.dose)}× (dose-dependent)` : `${e.factor}×`;
                                return (
                                    <div key={e.id} className="opioid-calc__bar-row">
                                        <span className="opioid-calc__bar-name">{e.name}</span>
                                        <div className="opioid-calc__bar-track">
                                            <div
                                                className="opioid-calc__bar-fill"
                                                style={{ width: `${pct}%`, backgroundColor: tier.color }}
                                            />
                                        </div>
                                        <span className="opioid-calc__bar-val">{e.mme} ({pct.toFixed(1)}%)</span>
                                        <span className="opioid-calc__bar-factor">Factor: {factorDisplay}</span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Methadone Info */}
            {(doses["methadone"] || 0) > 0 && (
                <div className="opioid-calc__methadone-info">
                    <h4>‡ Methadone Dose-Dependent Conversion</h4>
                    <p>Methadone&apos;s MME factor increases with daily dose due to its long half-life and accumulation:</p>
                    <table className="comparison-table">
                        <thead><tr><th>Daily Dose</th><th>Conversion Factor</th><th>Current</th></tr></thead>
                        <tbody>
                            {[
                                { range: "1–20 mg/day", factor: "4×", active: (doses["methadone"] || 0) <= 20 },
                                { range: "21–40 mg/day", factor: "8×", active: (doses["methadone"] || 0) > 20 && (doses["methadone"] || 0) <= 40 },
                                { range: "41–60 mg/day", factor: "10×", active: (doses["methadone"] || 0) > 40 && (doses["methadone"] || 0) <= 60 },
                                { range: ">60 mg/day", factor: "12×", active: (doses["methadone"] || 0) > 60 },
                            ].map((r) => (
                                <tr key={r.range} style={r.active ? { fontWeight: 700, backgroundColor: "rgba(79,70,229,.08)" } : {}}>
                                    <td>{r.range}</td>
                                    <td>{r.factor}</td>
                                    <td>{r.active ? "◀ Active" : ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Actions */}
            <div className="opioid-calc__actions">
                <button className="btn btn--primary" onClick={handlePrint}>🖨️ Print Summary</button>
                <button className="btn btn--ghost" onClick={handleReset}>🔄 Reset All</button>
            </div>

            {/* Footnotes */}
            <div className="opioid-calc__footnotes">
                <p><sup>†</sup> Fentanyl transdermal is expressed in mcg/hr, not mg/day. The conversion factor (2.4) converts mcg/hr directly to MME/day.</p>
                <p><sup>‡</sup> Methadone conversion factors are dose-dependent due to its unique pharmacokinetics. See the methadone conversion table above for details. Reference: <a href="https://www.agencymeddirectors.wa.gov/MethadoneFactors" target="_blank" rel="noopener noreferrer">AMDG Methadone Factors</a>.</p>
                <p><sup>§</sup> Buprenorphine has partial µ-opioid receptor agonist activity with ceiling effects. Transdermal buprenorphine is NOT approved for opioid use disorder. Factor varies by source (AMDG uses 2.2; CDC/CMS uses 12.6 per mcg/hr).</p>
            </div>
        </div>
    );
}
