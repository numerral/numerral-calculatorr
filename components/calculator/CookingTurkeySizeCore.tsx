"use client";

import React, { useState, useMemo } from "react";

type TurkeyType = "whole" | "bone-in-breast" | "boneless";
type Unit = "lbs" | "kg";

const TURKEY_MULTIPLIERS: Record<TurkeyType, { base: number; leftovers: number; label: string }> = {
    "whole":           { base: 1.0, leftovers: 1.5, label: "Whole Turkey" },
    "bone-in-breast":  { base: 0.75, leftovers: 1.0, label: "Bone-In Breast" },
    "boneless":        { base: 0.5, leftovers: 0.75, label: "Boneless Breast" },
};

export default function CookingTurkeySizeCore() {
    const [adults, setAdults] = useState<number>(10);
    const [children, setChildren] = useState<number>(4);
    const [leftovers, setLeftovers] = useState<"none" | "standard" | "generous">("standard");
    const [turkeyType, setTurkeyType] = useState<TurkeyType>("whole");
    const [unit, setUnit] = useState<Unit>("lbs");

    const results = useMemo(() => {
        const childEquiv = children * 0.5;
        const totalPeople = adults + childEquiv;
        const mult = TURKEY_MULTIPLIERS[turkeyType];
        let perPerson = leftovers === "none" ? mult.base : leftovers === "standard" ? mult.leftovers : mult.leftovers * 1.33;
        const totalLbs = totalPeople * perPerson;
        const totalKg = totalLbs * 0.4536;

        const displayWeight = unit === "lbs" ? totalLbs : totalKg;
        const unitLabel = unit === "lbs" ? "lbs" : "kg";

        let recommendation = `${Math.ceil(displayWeight)} ${unitLabel}`;
        let warning = "";
        let tip = "";

        if (turkeyType === "whole") {
            if (totalLbs > 20) {
                const half = unit === "lbs" ? (totalLbs / 2).toFixed(0) : (totalKg / 2).toFixed(1);
                warning = `For ${Math.ceil(displayWeight)}+ ${unitLabel}, consider cooking two smaller turkeys (~${half} ${unitLabel} each) for more even roasting and juicier meat.`;
            }
            if (totalLbs < 12 && totalLbs > 0) {
                tip = `Small turkeys (under 12 lbs) have a lower meat-to-bone ratio. Consider adding ~50% more weight for adequate servings.`;
            }
        }

        return {
            totalLbs: totalLbs.toFixed(1),
            totalKg: totalKg.toFixed(1),
            displayWeight: Math.ceil(displayWeight),
            unitLabel,
            recommendation,
            warning,
            tip,
            perPerson: perPerson.toFixed(2),
            turkeyLabel: mult.label,
        };
    }, [adults, children, leftovers, turkeyType, unit]);

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>

                {/* Guest Count */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Adults</label>
                        <span className="input-value" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{adults}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="range" className="range-slider" style={{ flex: 1 }} min={1} max={50} value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
                        <input type="number" className="input-field" style={{ width: "80px" }} min={1} max={100} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))} />
                    </div>
                    <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
                        {[4, 8, 10, 15, 20, 30].map(p => (
                            <button key={p} onClick={() => setAdults(p)} style={{
                                padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600,
                                borderRadius: "20px", border: "1px solid var(--n-border)",
                                background: adults === p ? "var(--primary-color)" : "var(--n-surface)",
                                color: adults === p ? "white" : "var(--n-text-secondary)",
                                cursor: "pointer", transition: "all 0.2s",
                            }}>{p} adults</button>
                        ))}
                    </div>
                </div>

                {/* Children */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Children (Under 12)</label>
                        <span className="input-value" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{children}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="range" className="range-slider" style={{ flex: 1 }} min={0} max={20} value={children} onChange={(e) => setChildren(Number(e.target.value))} />
                        <input type="number" className="input-field" style={{ width: "80px" }} min={0} max={50} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))} />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>Calculated as ½ of an adult portion.</p>
                </div>

                {/* Turkey Type */}
                <div className="input-group">
                    <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Turkey Type</label>
                    <div style={{ display: "flex", gap: "var(--s-2)" }}>
                        {([
                            { val: "whole" as TurkeyType, icon: "🦃", label: "Whole" },
                            { val: "bone-in-breast" as TurkeyType, icon: "🍗", label: "Bone-In Breast" },
                            { val: "boneless" as TurkeyType, icon: "🥩", label: "Boneless" },
                        ]).map(opt => (
                            <button key={opt.val} onClick={() => setTurkeyType(opt.val)}
                                className={turkeyType === opt.val ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--r-md)", flex: 1 }}>
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leftover Preference */}
                <div className="input-group">
                    <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Leftover Preference</label>
                    <div style={{ display: "flex", gap: "var(--s-2)" }}>
                        {([
                            { val: "none" as const, label: "No Leftovers" },
                            { val: "standard" as const, label: "Standard" },
                            { val: "generous" as const, label: "Generous" },
                        ]).map(opt => (
                            <button key={opt.val} onClick={() => setLeftovers(opt.val)}
                                className={leftovers === opt.val ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--r-md)", flex: 1 }}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Results Panel ═══ */}
            <div className="calculator-engine__results" style={{
                background: "var(--n-surface)", border: "1px solid var(--primary-color)",
                borderRadius: "var(--r-xl)", padding: "var(--s-6)", marginTop: "var(--s-6)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-4)" }}>
                    <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: 0 }}>
                        Turkey Size Needed
                    </h3>
                    {/* Unit Toggle */}
                    <div style={{ display: "flex", gap: "4px", background: "var(--n-bg)", borderRadius: "20px", padding: "3px" }}>
                        {(["lbs", "kg"] as Unit[]).map(u => (
                            <button key={u} onClick={() => setUnit(u)} style={{
                                padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600,
                                borderRadius: "16px", border: "none",
                                background: unit === u ? "var(--primary-color)" : "transparent",
                                color: unit === u ? "white" : "var(--n-text-secondary)",
                                cursor: "pointer", transition: "all 0.2s",
                            }}>{u}</button>
                        ))}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Buy A Turkey Around</div>
                        <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--n-text)" }}>
                            {results.displayWeight} <span style={{ fontSize: "1rem", color: "var(--n-text-muted)" }}>{results.unitLabel}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>{results.turkeyLabel}</div>
                    </div>
                    <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Exact Weight</div>
                        <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary-color)" }}>
                            {unit === "lbs" ? results.totalLbs : results.totalKg}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>{results.unitLabel} ({results.perPerson} {results.unitLabel}/person)</div>
                    </div>
                </div>

                {/* Warnings & Tips */}
                {results.warning && (
                    <div style={{
                        marginTop: "var(--s-4)", padding: "var(--s-3)",
                        background: "#FFF3CD", borderRadius: "var(--r-md)",
                        border: "1px solid #FFECB5", fontSize: "0.85rem", color: "#664D03", lineHeight: 1.6
                    }}>
                        ⚠️ {results.warning}
                    </div>
                )}
                {results.tip && (
                    <div style={{
                        marginTop: "var(--s-3)", padding: "var(--s-3)",
                        background: "#D1ECF1", borderRadius: "var(--r-md)",
                        border: "1px solid #BEE5EB", fontSize: "0.85rem", color: "#0C5460", lineHeight: 1.6
                    }}>
                        💡 {results.tip}
                    </div>
                )}
            </div>
        </div>
    );
}
