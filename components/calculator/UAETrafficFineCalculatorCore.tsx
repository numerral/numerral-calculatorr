"use client";
import { useState, useMemo, useCallback } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 0) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function ResultRow({ label, value, highlight, warn, danger }: { label: string; value: string; highlight?: boolean; warn?: boolean; danger?: boolean }) {
    const style = highlight
        ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" }
        : warn
            ? { background: "rgba(234,179,8,0.08)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" }
            : danger
                ? { background: "rgba(220,38,38,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" }
                : undefined;
    const valStyle = highlight
        ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" }
        : warn
            ? { color: "#b45309", fontWeight: 700 }
            : danger
                ? { color: "#dc2626", fontWeight: 700 }
                : undefined;
    return (<div className="con-result-row" style={style}>
        <span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value" style={valStyle}>{value}</span>
    </div>);
}

/* ═══════════════════════════════════════════════════
   VIOLATION DATA
   ═══════════════════════════════════════════════════ */
type Emirate = "dubai" | "abudhabi" | "sharjah" | "other";

interface Violation {
    id: string;
    category: string;
    name: string;
    fine: number;
    blackPoints: number;
    impoundDays: number;
    releaseFee: number;
    notes: string;
    emirateOverrides?: Partial<Record<Emirate, { fine?: number; blackPoints?: number; impoundDays?: number; releaseFee?: number; notes?: string }>>;
}

/* Speeding brackets — base values, Abu Dhabi has zero-tolerance (no grace buffer) */
const SPEEDING_VIOLATIONS: Violation[] = [
    { id: "speed-20", category: "Speeding", name: "Exceeding speed limit by up to 20 km/h", fine: 300, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "Most emirates have ~20 km/h grace buffer before this triggers",
      emirateOverrides: { abudhabi: { notes: "Abu Dhabi: zero-tolerance — no grace buffer; fine triggers at even 1 km/h over" } } },
    { id: "speed-30", category: "Speeding", name: "Exceeding speed limit by 21–30 km/h", fine: 600, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "speed-40", category: "Speeding", name: "Exceeding speed limit by 31–40 km/h", fine: 700, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "speed-50", category: "Speeding", name: "Exceeding speed limit by 41–50 km/h", fine: 1000, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "speed-60", category: "Speeding", name: "Exceeding speed limit by 51–60 km/h", fine: 1500, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "speed-80", category: "Speeding", name: "Exceeding speed limit by 61–80 km/h", fine: 2000, blackPoints: 12, impoundDays: 30, releaseFee: 0, notes: "Vehicle impounded for 30 days",
      emirateOverrides: { dubai: { releaseFee: 50000, notes: "Dubai: AED 50,000 vehicle release fee (Decree No. 30/2023)" }, abudhabi: { releaseFee: 50000, notes: "Abu Dhabi: AED 50,000 vehicle release fee" } } },
    { id: "speed-80plus", category: "Speeding", name: "Exceeding speed limit by more than 80 km/h", fine: 3000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "Most severe — near-maximum black points",
      emirateOverrides: { dubai: { releaseFee: 50000, notes: "Dubai: AED 50,000 vehicle release fee" }, abudhabi: { releaseFee: 50000, notes: "Abu Dhabi: AED 50,000 vehicle release fee" } } },
];

const OTHER_VIOLATIONS: Violation[] = [
    /* Red Light & Camera */
    { id: "red-light", category: "Red Light & Camera", name: "Jumping a red traffic light", fine: 1000, blackPoints: 12, impoundDays: 30, releaseFee: 0, notes: "Vehicle impounded for 30 days",
      emirateOverrides: { dubai: { releaseFee: 50000, notes: "Dubai: AED 50,000 release fee (Decree No. 30/2023)" }, abudhabi: { releaseFee: 50000, notes: "Abu Dhabi: AED 50,000 release fee (Law No. 5/2020)" } } },
    { id: "red-light-ped", category: "Red Light & Camera", name: "Pedestrian crossing on red signal", fine: 400, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "Pedestrian violation" },

    /* Mobile Phone */
    { id: "mobile-phone", category: "Mobile Phone", name: "Using mobile phone while driving", fine: 800, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "Includes texting, browsing, and handheld calls" },

    /* Seatbelt & Safety */
    { id: "seatbelt", category: "Seatbelt & Safety", name: "Not wearing seatbelt (driver or passenger)", fine: 400, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "Applies to all passengers including rear seats" },
    { id: "child-seat", category: "Seatbelt & Safety", name: "Child under 4 not in child safety seat", fine: 400, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "Front seat passenger must be 145cm+ and 10+ years" },
    { id: "no-helmet", category: "Seatbelt & Safety", name: "Motorcyclist not wearing helmet", fine: 500, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "Applies to rider and pillion passenger" },

    /* Reckless & Dangerous */
    { id: "reckless", category: "Reckless & Dangerous", name: "Reckless driving endangering lives", fine: 2000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "Court decision possible",
      emirateOverrides: { dubai: { releaseFee: 50000 }, abudhabi: { releaseFee: 50000 } } },
    { id: "racing", category: "Reckless & Dangerous", name: "Illegal road racing", fine: 3000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "Vehicle may be permanently confiscated",
      emirateOverrides: { dubai: { releaseFee: 100000, notes: "Dubai: AED 100,000 release fee" } } },
    { id: "drifting", category: "Reckless & Dangerous", name: "Drifting or stunt driving on public roads", fine: 2000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "Serious offense — court involvement likely",
      emirateOverrides: { dubai: { releaseFee: 50000 } } },
    { id: "tailgating", category: "Reckless & Dangerous", name: "Tailgating (not keeping safe distance)", fine: 400, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "Minimum 2-second following distance recommended" },
    { id: "wrong-way", category: "Reckless & Dangerous", name: "Driving against traffic (wrong way)", fine: 600, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "Severe danger — court may impose additional penalties" },

    /* DUI */
    { id: "dui-alcohol", category: "DUI & Substance", name: "Driving under influence of alcohol", fine: 20000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "Court decision — fine up to AED 100,000 + imprisonment. Decree-Law 14/2024" },
    { id: "dui-drugs", category: "DUI & Substance", name: "Driving under influence of narcotics", fine: 30000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "Fine up to AED 200,000 + imprisonment. Decree-Law 14/2024" },

    /* Parking */
    { id: "park-disabled", category: "Parking", name: "Parking in disabled space without permit", fine: 1000, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "Serious offense" },
    { id: "park-hydrant", category: "Parking", name: "Parking in front of fire hydrant", fine: 1000, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "park-obstruct", category: "Parking", name: "Parking that obstructs traffic", fine: 500, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "Vehicle may be towed" },
    { id: "park-wrong", category: "Parking", name: "Wrong/illegal parking", fine: 500, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "park-pavement", category: "Parking", name: "Parking on pavement/sidewalk", fine: 400, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "park-unsecured", category: "Parking", name: "Leaving vehicle unsecured (engine on / no handbrake)", fine: 500, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "Abu Dhabi specific regulation",
      emirateOverrides: { abudhabi: { fine: 500, notes: "Abu Dhabi: specific regulation for unsecured vehicles" } } },

    /* License & Registration */
    { id: "no-license", category: "License & Registration", name: "Driving without a valid license", fine: 5000, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "AED 2,000–10,000 range. Decree-Law 14/2024 (effective March 2025)" },
    { id: "expired-reg", category: "License & Registration", name: "Driving with expired registration", fine: 500, blackPoints: 4, impoundDays: 7, releaseFee: 0, notes: "" },
    { id: "no-plate", category: "License & Registration", name: "Driving without license plates", fine: 3000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "" },
    { id: "fake-plate", category: "License & Registration", name: "Using forged/imitation license plates", fine: 20000, blackPoints: 23, impoundDays: 60, releaseFee: 0, notes: "Imprisonment + AED 20,000 minimum. Decree-Law 14/2024" },
    { id: "underage", category: "License & Registration", name: "Driving under the legal age", fine: 50000, blackPoints: 0, impoundDays: 60, releaseFee: 0, notes: "Vehicle seized — AED 50,000 release fee in Dubai",
      emirateOverrides: { dubai: { releaseFee: 50000 } } },
    { id: "suspended-license", category: "License & Registration", name: "Driving with a suspended license", fine: 10000, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "Minimum AED 10,000 + possible imprisonment. Decree-Law 14/2024" },

    /* Accident-related */
    { id: "flee-accident", category: "Accident", name: "Fleeing the scene of an accident", fine: 50000, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "AED 50,000–100,000 + up to 1 year imprisonment. Decree-Law 14/2024" },
    { id: "no-report", category: "Accident", name: "Not reporting accident within 3 hours", fine: 500, blackPoints: 8, impoundDays: 0, releaseFee: 0, notes: "Must not move vehicle until police arrive (for major accidents)" },

    /* Other Common */
    { id: "no-emergency-way", category: "Other", name: "Not giving way to emergency vehicles", fine: 1000, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "Includes ambulance, fire, police" },
    { id: "garbage", category: "Other", name: "Throwing garbage/objects from vehicle", fine: 1000, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "tinted-windows", category: "Other", name: "Excessive window tinting (beyond permitted)", fine: 500, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "Maximum 50% VLT on side windows; 30% on rear" },
    { id: "jaywalking", category: "Other", name: "Jaywalking (pedestrian crossing illegally)", fine: 400, blackPoints: 0, impoundDays: 0, releaseFee: 0, notes: "AED 5,000–10,000 if causes accident. On 80+ km/h road: AED 10,000 + 3 mo prison" },
    { id: "noisy-vehicle", category: "Other", name: "Driving a noisy/modified exhaust vehicle", fine: 2000, blackPoints: 0, impoundDays: 30, releaseFee: 0, notes: "Vehicle may be impounded" },
    { id: "slow-driving", category: "Other", name: "Driving below minimum speed limit", fine: 400, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "Applies on highways with minimum speed limits" },
    { id: "no-indicator", category: "Other", name: "Not using indicator when changing lanes", fine: 400, blackPoints: 4, impoundDays: 0, releaseFee: 0, notes: "" },
    { id: "overtake-shoulder", category: "Other", name: "Overtaking on the hard shoulder", fine: 600, blackPoints: 6, impoundDays: 0, releaseFee: 0, notes: "" },
];

const ALL_VIOLATIONS = [...SPEEDING_VIOLATIONS, ...OTHER_VIOLATIONS];

const CATEGORIES = Array.from(new Set(ALL_VIOLATIONS.map(v => v.category)));

/* Discount logic */
function getDiscount(fine: number, daysSinceViolation: "within60" | "within1yr" | "none", excludeDiscount: boolean): { discountedFine: number; discountPct: number } {
    if (excludeDiscount || daysSinceViolation === "none") return { discountedFine: fine, discountPct: 0 };
    const pct = daysSinceViolation === "within60" ? 35 : 25;
    return { discountedFine: Math.round(fine * (1 - pct / 100)), discountPct: pct };
}

/* Violations that are excluded from discounts */
const DISCOUNT_EXCLUDED_IDS = new Set(["dui-alcohol", "dui-drugs", "reckless", "racing", "drifting", "speed-80plus", "speed-80", "red-light", "flee-accident"]);

function getEffectiveViolation(v: Violation, emirate: Emirate): Violation {
    if (!v.emirateOverrides || !v.emirateOverrides[emirate]) return v;
    const override = v.emirateOverrides[emirate]!;
    return { ...v, ...override, notes: override.notes || v.notes };
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function UAETrafficFineCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🚨 Fine Calculator", "📋 Full Penalty Table"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🚦 Traffic Fine Calculator — UAE</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <FineCalculatorTab />}
        {tab === 1 && <PenaltyTableTab />}
    </div>);
}

/* ═══════════════════════════════════════════════════
   FINE CALCULATOR TAB
   ═══════════════════════════════════════════════════ */
interface SelectedViolation { violation: Violation; emirate: Emirate; }

function FineCalculatorTab() {
    const [emirate, setEmirate] = useState<Emirate>("dubai");
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [selectedViolationId, setSelectedViolationId] = useState(SPEEDING_VIOLATIONS[0].id);
    const [discountTier, setDiscountTier] = useState<"none" | "within60" | "within1yr">("none");
    const [violations, setViolations] = useState<SelectedViolation[]>([]);

    const filteredViolations = useMemo(() => ALL_VIOLATIONS.filter(v => v.category === selectedCategory), [selectedCategory]);

    const currentViolation = useMemo(() => {
        const found = ALL_VIOLATIONS.find(v => v.id === selectedViolationId);
        return found ? getEffectiveViolation(found, emirate) : null;
    }, [selectedViolationId, emirate]);

    const handleCategoryChange = useCallback((cat: string) => {
        setSelectedCategory(cat);
        const first = ALL_VIOLATIONS.find(v => v.category === cat);
        if (first) setSelectedViolationId(first.id);
    }, []);

    const addViolation = useCallback(() => {
        if (!currentViolation) return;
        setViolations(prev => [...prev, { violation: currentViolation, emirate }]);
    }, [currentViolation, emirate]);

    const removeViolation = useCallback((idx: number) => {
        setViolations(prev => prev.filter((_, i) => i !== idx));
    }, []);

    const clearAll = useCallback(() => setViolations([]), []);

    /* Calculated results for current */
    const currentResult = useMemo(() => {
        if (!currentViolation) return null;
        const excludeDiscount = DISCOUNT_EXCLUDED_IDS.has(currentViolation.id);
        const { discountedFine, discountPct } = getDiscount(currentViolation.fine, discountTier, excludeDiscount);
        return { ...currentViolation, discountedFine, discountPct, excludeDiscount };
    }, [currentViolation, discountTier]);

    /* Accumulated totals for multi-violation */
    const totals = useMemo(() => {
        let totalFine = 0, totalBP = 0, totalImpound = 0, totalRelease = 0;
        for (const sv of violations) {
            const v = sv.violation;
            const excluded = DISCOUNT_EXCLUDED_IDS.has(v.id);
            const { discountedFine } = getDiscount(v.fine, discountTier, excluded);
            totalFine += discountedFine;
            totalBP += v.blackPoints;
            totalImpound = Math.max(totalImpound, v.impoundDays);
            totalRelease += v.releaseFee;
        }
        return { totalFine, totalBP, totalImpound, totalRelease };
    }, [violations, discountTier]);

    const emirateLabel = (e: Emirate) => e === "abudhabi" ? "Abu Dhabi" : e === "dubai" ? "Dubai" : e === "sharjah" ? "Sharjah" : "Other Emirates";

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🚦 Look up any UAE traffic fine by violation type. Select your emirate for emirate-specific penalties. Add multiple violations to see your total exposure. Penalty data updated for 2025 (Federal Decree-Law No. 14/2024).
            </div>

            {/* Emirate selector */}
            <div className="con-input">
                <label className="con-input__label" htmlFor="tf-emirate">Emirate</label>
                <select id="tf-emirate" className="con-input__field" value={emirate} onChange={e => setEmirate(e.target.value as Emirate)}>
                    <option value="dubai">🏙️ Dubai</option>
                    <option value="abudhabi">🕌 Abu Dhabi</option>
                    <option value="sharjah">🌴 Sharjah</option>
                    <option value="other">🇦🇪 Other Emirates</option>
                </select>
            </div>

            {/* Category */}
            <div className="con-input">
                <label className="con-input__label" htmlFor="tf-category">Violation Category</label>
                <select id="tf-category" className="con-input__field" value={selectedCategory} onChange={e => handleCategoryChange(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Specific violation */}
            <div className="con-input">
                <label className="con-input__label" htmlFor="tf-violation">Specific Violation</label>
                <select id="tf-violation" className="con-input__field" value={selectedViolationId} onChange={e => setSelectedViolationId(e.target.value)}>
                    {filteredViolations.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
            </div>

            {/* Discount */}
            <div className="con-input">
                <label className="con-input__label" htmlFor="tf-discount">Early Payment Discount</label>
                <select id="tf-discount" className="con-input__field" value={discountTier} onChange={e => setDiscountTier(e.target.value as "none" | "within60" | "within1yr")}>
                    <option value="none">No discount (standard fine)</option>
                    <option value="within60">Paid within 60 days (35% off)</option>
                    <option value="within1yr">Paid within 1 year (25% off)</option>
                </select>
            </div>
        </div>

        {/* Current violation result */}
        <div className="con-calc__results">
            <h4>Penalty Details — {emirateLabel(emirate)}</h4>
            {currentResult && <>
                <ResultRow label="Violation" value={currentResult.name} />
                <ResultRow label="Base Fine" value={fmtAED(currentResult.fine)} highlight />
                {currentResult.discountPct > 0 && (
                    <ResultRow label={`After ${currentResult.discountPct}% discount`} value={fmtAED(currentResult.discountedFine)} highlight />
                )}
                {currentResult.excludeDiscount && discountTier !== "none" && (
                    <ResultRow label="⚠️ Discount eligibility" value="Excluded — serious violation" warn />
                )}
                <ResultRow label="Black Points" value={currentResult.blackPoints > 0 ? `${currentResult.blackPoints} points` : "None"} warn={currentResult.blackPoints >= 12} />
                <ResultRow label="Vehicle Impoundment" value={currentResult.impoundDays > 0 ? `${currentResult.impoundDays} days` : "None"} warn={currentResult.impoundDays > 0} />
                {currentResult.releaseFee > 0 && (
                    <ResultRow label="Vehicle Release Fee" value={fmtAED(currentResult.releaseFee)} danger />
                )}
                {currentResult.releaseFee > 0 && (
                    <ResultRow label="Total Cost (fine + release)" value={fmtAED(currentResult.discountedFine + currentResult.releaseFee)} danger />
                )}
                {currentResult.notes && (
                    <div style={{ padding: "8px 12px", background: "rgba(234,179,8,0.06)", borderRadius: 6, fontSize: "0.82rem", marginTop: 8, color: "var(--text-muted)", lineHeight: 1.5 }}>
                        📌 {currentResult.notes}
                    </div>
                )}
            </>}

            {/* Add to multi-violation */}
            <button onClick={addViolation} style={{ marginTop: 12, padding: "8px 16px", background: "#009639", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                + Add This Violation
            </button>
        </div>

        {/* Multi-violation accumulation */}
        {violations.length > 0 && (
            <div className="con-calc__results" style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4>Accumulated Violations ({violations.length})</h4>
                    <button onClick={clearAll} style={{ padding: "4px 12px", background: "transparent", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", fontSize: "0.78rem", color: "var(--text-muted)" }}>Clear All</button>
                </div>

                {violations.map((sv, i) => {
                    const excluded = DISCOUNT_EXCLUDED_IDS.has(sv.violation.id);
                    const { discountedFine } = getDiscount(sv.violation.fine, discountTier, excluded);
                    return (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 600 }}>{sv.violation.name}</span>
                                <span style={{ color: "var(--text-muted)", marginLeft: 8, fontSize: "0.78rem" }}>({emirateLabel(sv.emirate)})</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontWeight: 700, color: "#009639" }}>{fmtAED(discountedFine)}</span>
                                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{sv.violation.blackPoints} BP</span>
                                <button onClick={() => removeViolation(i)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "1rem", padding: "0 4px" }}>✕</button>
                            </div>
                        </div>
                    );
                })}

                <div style={{ marginTop: 12 }}>
                    <ResultRow label="Total Fines" value={fmtAED(totals.totalFine)} highlight />
                    {totals.totalRelease > 0 && <ResultRow label="Total Release Fees" value={fmtAED(totals.totalRelease)} danger />}
                    {totals.totalRelease > 0 && <ResultRow label="Grand Total" value={fmtAED(totals.totalFine + totals.totalRelease)} danger />}
                    <ResultRow label="Total Black Points" value={`${totals.totalBP} / 24`} warn={totals.totalBP >= 12} danger={totals.totalBP >= 24} />
                    {totals.totalBP >= 24 && (
                        <div style={{ padding: "10px 12px", background: "rgba(220,38,38,0.08)", borderRadius: 6, fontSize: "0.85rem", marginTop: 8, color: "#dc2626", fontWeight: 600 }}>
                            🚫 LICENSE SUSPENSION — You have accumulated {totals.totalBP} black points (threshold: 24). Your license will be suspended for 3 months (1st offense), 6 months (2nd), or 1 year + retake test (3rd).
                        </div>
                    )}
                    {totals.totalBP >= 12 && totals.totalBP < 24 && (
                        <div style={{ padding: "10px 12px", background: "rgba(234,179,8,0.08)", borderRadius: 6, fontSize: "0.85rem", marginTop: 8, color: "#b45309", fontWeight: 600 }}>
                            ⚠️ WARNING — {totals.totalBP} black points accumulated. Suspension threshold is 24. Consider a traffic safety course to remove up to 8 points.
                        </div>
                    )}
                    {totals.totalImpound > 0 && (
                        <ResultRow label="Max Impoundment" value={`${totals.totalImpound} days`} warn />
                    )}
                </div>
            </div>
        )}
    </div>);
}

/* ═══════════════════════════════════════════════════
   FULL PENALTY TABLE TAB
   ═══════════════════════════════════════════════════ */
function PenaltyTableTab() {
    const [filterCat, setFilterCat] = useState("All");
    const displayed = filterCat === "All" ? ALL_VIOLATIONS : ALL_VIOLATIONS.filter(v => v.category === filterCat);

    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        <h4>Complete UAE Traffic Violation Penalties</h4>
        <div className="con-input" style={{ marginBottom: 12 }}>
            <label className="con-input__label" htmlFor="tf-filter">Filter by Category</label>
            <select id="tf-filter" className="con-input__field" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="All">All Categories ({ALL_VIOLATIONS.length} violations)</option>
                {CATEGORIES.map(c => {
                    const count = ALL_VIOLATIONS.filter(v => v.category === c).length;
                    return <option key={c} value={c}>{c} ({count})</option>;
                })}
            </select>
        </div>

        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Violation</th>
                <th style={th}>Fine (AED)</th>
                <th style={th}>Black Points</th>
                <th style={th}>Impound</th>
            </tr></thead><tbody>
                {displayed.map((v, i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>
                            <span style={{ color: "#009639", fontWeight: 700, fontSize: "0.72rem", marginRight: 6 }}>{v.category}</span>
                            {v.name}
                        </td>
                        <td style={{ ...td, fontWeight: 700, color: v.fine >= 10000 ? "#dc2626" : v.fine >= 2000 ? "#b45309" : undefined }}>{fmtAED(v.fine)}</td>
                        <td style={{ ...td, fontWeight: v.blackPoints >= 12 ? 700 : 400, color: v.blackPoints >= 23 ? "#dc2626" : v.blackPoints >= 12 ? "#b45309" : undefined }}>{v.blackPoints || "—"}</td>
                        <td style={td}>{v.impoundDays > 0 ? `${v.impoundDays}d` : "—"}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        {/* Emirate differences */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Emirate-Specific Differences</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Feature</th>
                <th style={th}>Dubai</th>
                <th style={th}>Abu Dhabi</th>
                <th style={th}>Sharjah</th>
            </tr></thead><tbody>
                {([
                    ["Speed grace buffer", "~20 km/h", "Zero tolerance", "~20 km/h"],
                    ["Red light release fee", "AED 50,000", "AED 50,000", "Standard"],
                    ["Reckless driving release", "AED 50,000", "AED 50,000", "Standard"],
                    ["Illegal racing release", "AED 100,000", "AED 50,000", "Standard"],
                    ["Salik toll integration", "Yes (variable 2025)", "No", "No"],
                    ["Visa-fine link (2025)", "Must clear fines", "Must clear fines", "Must clear fines"],
                    ["Fine inquiry portal", "Dubai Police / RTA", "TAMM / AD Police", "Sharjah Police / MOI"],
                ] as string[][]).map(([feature, dxb, ad, shj], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{feature}</td>
                        <td style={td}>{dxb}</td>
                        <td style={{ ...td, fontWeight: feature.includes("grace") ? 700 : 400, color: feature.includes("grace") ? "#dc2626" : undefined }}>{ad}</td>
                        <td style={td}>{shj}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        {/* Fine discount table */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Early Payment Discount by Emirate</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Emirate</th>
                <th style={th}>Within 60 Days</th>
                <th style={th}>Within 1 Year</th>
                <th style={{ ...th, textAlign: "left" }}>Special Programs</th>
            </tr></thead><tbody>
                {([
                    ["Dubai", "35% off", "25% off", "Safe Driver: up to 100% waiver (25% per 3mo clean)"],
                    ["Abu Dhabi", "35% off", "25% off", "Judicial Dept: up to 50% for eligible cases"],
                    ["Sharjah", "35% off", "25% off", "Periodic black point waiver campaigns"],
                ] as string[][]).map(([em, d60, d1y, special], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 700 }}>{em}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{d60}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 600 }}>{d1y}</td>
                        <td style={tl}>{special}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        {/* Black points reference */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Black Points — Suspension Thresholds</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Threshold</th>
                <th style={{ ...th, textAlign: "left" }}>Consequence</th>
            </tr></thead><tbody>
                {([
                    ["24 points (1st time)", "License suspended — 3 months (light vehicle: 30 days)"],
                    ["24 points (2nd time)", "License suspended — 6 months"],
                    ["24 points (3rd time)", "License suspended — 1 year + must retake driving test"],
                    ["Points expiry", "12 months from violation date (if no new violations)"],
                    ["Point reduction", "Up to 8 points removed via safety course (Dubai & Abu Dhabi Police)"],
                ] as string[][]).map(([threshold, consequence], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{threshold}</td>
                        <td style={tl}>{consequence}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}
