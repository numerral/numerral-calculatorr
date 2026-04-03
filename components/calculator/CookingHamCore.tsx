"use client";

import React, { useState, useMemo } from "react";

type HamType = "bone-in" | "boneless" | "spiral";
type Leftover = "none" | "standard" | "generous";

const HAM_TYPES: { val: HamType; icon: string; label: string }[] = [
    { val: "bone-in", icon: "🦴", label: "Bone-In" },
    { val: "boneless", icon: "🥩", label: "Boneless" },
    { val: "spiral", icon: "🌀", label: "Spiral Sliced" },
];

const PER_PERSON: Record<HamType, { base: number; leftovers: number }> = {
    "bone-in":  { base: 0.75, leftovers: 1.0 },
    "boneless": { base: 0.5,  leftovers: 0.65 },
    "spiral":   { base: 0.5,  leftovers: 0.65 },
};

function formatTime(totalMins: number): string {
    const h = Math.floor(totalMins / 60);
    const m = Math.round(totalMins % 60);
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function CookingHamCore() {
    const [adults, setAdults] = useState<number>(10);
    const [children, setChildren] = useState<number>(4);
    const [hamType, setHamType] = useState<HamType>("bone-in");
    const [leftovers, setLeftovers] = useState<Leftover>("standard");

    const results = useMemo(() => {
        const childEquiv = children * 0.5;
        const totalPeople = adults + childEquiv;
        const mult = PER_PERSON[hamType];

        let perPerson = leftovers === "none" ? mult.base : leftovers === "standard" ? mult.leftovers : mult.leftovers * 1.3;
        const totalLbs = totalPeople * perPerson;
        const recommendedLbs = Math.ceil(totalLbs);

        // Cooking time
        let minRate = 15, maxRate = 18, ovenTemp = "325°F (163°C)", internalTemp = "140°F (60°C)";
        if (hamType === "boneless") { minRate = 10; maxRate = 15; }
        if (hamType === "spiral") { minRate = 12; maxRate = 15; ovenTemp = "275°F (135°C)"; }

        const minMinutes = recommendedLbs * minRate;
        const maxMinutes = recommendedLbs * maxRate;

        // Glaze estimate (cups of basic glaze for ham size)
        const glazeBrownSugar = (recommendedLbs * 0.1).toFixed(1);
        const glazeHoney = (recommendedLbs * 0.05).toFixed(1);
        const glazeMustard = Math.round(recommendedLbs * 0.4);

        return {
            totalLbs: totalLbs.toFixed(1),
            recommendedLbs,
            perPerson: perPerson.toFixed(2),
            cookTime: `${formatTime(minMinutes)} – ${formatTime(maxMinutes)}`,
            ovenTemp,
            internalTemp,
            glazeBrownSugar,
            glazeHoney,
            glazeMustard,
        };
    }, [adults, children, hamType, leftovers]);

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>

                {/* ── Adults ── */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Adults</label>
                        <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--n-text)" }}>{adults}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="range" className="range-slider" style={{ flex: 1 }} min={1} max={50} value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
                        <input type="number" className="input-field" style={{ width: "80px" }} min={1} max={100} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))} />
                    </div>
                    <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
                        {[6, 8, 10, 15, 20, 25, 30].map(p => (
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

                {/* ── Children ── */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Children (Under 12)</label>
                        <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--n-text)" }}>{children}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="range" className="range-slider" style={{ flex: 1 }} min={0} max={20} value={children} onChange={(e) => setChildren(Number(e.target.value))} />
                        <input type="number" className="input-field" style={{ width: "80px" }} min={0} max={50} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))} />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>Calculated as ½ of an adult portion.</p>
                </div>

                {/* ── Ham Type ── */}
                <div className="input-group">
                    <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Ham Type</label>
                    <div style={{ display: "flex", gap: "var(--s-2)" }}>
                        {HAM_TYPES.map(opt => (
                            <button key={opt.val} onClick={() => setHamType(opt.val)}
                                className={hamType === opt.val ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--r-md)", flex: 1 }}>
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Leftover Preference ── */}
                <div className="input-group">
                    <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Leftover Preference</label>
                    <div style={{ display: "flex", gap: "var(--s-2)" }}>
                        {([
                            { val: "none" as Leftover, label: "No Leftovers" },
                            { val: "standard" as Leftover, label: "Standard" },
                            { val: "generous" as Leftover, label: "Generous" },
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
                <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: "0 0 var(--s-4) 0" }}>
                    Ham Size & Cooking Time
                </h3>

                {/* Main metric cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--s-4)" }}>
                    {/* Recommended Size */}
                    <div style={{
                        background: "var(--n-bg)", padding: "var(--s-5)", borderRadius: "var(--r-lg)",
                        border: "2px solid var(--primary-color)", textAlign: "center",
                    }}>
                        <div style={{ fontSize: "0.65rem", color: "var(--primary-color)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--s-1)" }}>
                            Recommended Ham
                        </div>
                        <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--n-text)" }}>
                            {results.recommendedLbs} <span style={{ fontSize: "1rem", color: "var(--n-text-muted)" }}>lbs</span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                            {results.perPerson} lbs/person · {HAM_TYPES.find(t => t.val === hamType)?.label}
                        </div>
                    </div>

                    {/* Cook Time */}
                    <div style={{
                        background: "var(--n-bg)", padding: "var(--s-5)", borderRadius: "var(--r-lg)",
                        border: "1px solid var(--n-border)", textAlign: "center",
                    }}>
                        <div style={{ fontSize: "0.65rem", color: "#EF6C00", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--s-1)" }}>
                            Estimated Cook Time
                        </div>
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--n-text)" }}>
                            {results.cookTime}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                            at {results.ovenTemp}
                        </div>
                    </div>

                    {/* Internal Temp */}
                    <div style={{
                        background: "var(--n-bg)", padding: "var(--s-5)", borderRadius: "var(--r-lg)",
                        border: "1px solid var(--n-border)", textAlign: "center",
                    }}>
                        <div style={{ fontSize: "0.65rem", color: "#16A34A", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--s-1)" }}>
                            Safe Internal Temp
                        </div>
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#16A34A" }}>
                            {results.internalTemp}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                            {hamType === "spiral" ? "pre-cooked, reheat" : "pre-cooked smoked ham"}
                        </div>
                    </div>
                </div>

                {/* Glaze Estimate */}
                <div style={{
                    marginTop: "var(--s-4)", padding: "var(--s-4)",
                    background: "#FFF8E1", borderRadius: "var(--r-md)",
                    border: "1px solid #FFD54F",
                }}>
                    <div style={{ fontSize: "0.78rem", color: "#6D4C00", fontWeight: 700, marginBottom: "var(--s-2)" }}>
                        🍯 Glaze Estimate for a {results.recommendedLbs} lb Ham
                    </div>
                    <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
                        <div style={{ fontSize: "0.75rem", color: "#6D4C00" }}>
                            <strong>{results.glazeBrownSugar} cups</strong> brown sugar
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6D4C00" }}>
                            <strong>{results.glazeHoney} cups</strong> honey or maple
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6D4C00" }}>
                            <strong>{results.glazeMustard} tbsp</strong> Dijon mustard
                        </div>
                    </div>
                </div>

                {/* Spiral warning */}
                {hamType === "spiral" && (
                    <div style={{
                        marginTop: "var(--s-3)", padding: "var(--s-3)",
                        background: "#FEF3C7", borderRadius: "var(--r-md)",
                        border: "1px solid #FBBF24", fontSize: "0.8rem", color: "#92400E", lineHeight: 1.6,
                    }}>
                        ⚠️ <strong>Spiral hams dry out easily.</strong> Keep covered tightly in foil. Uncover only in the last 15 minutes to glaze. Lower oven to 275°F to prevent moisture loss.
                    </div>
                )}

                <p style={{ marginTop: "var(--s-3)", fontSize: "0.75rem", color: "var(--n-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                    All cooking times are USDA estimates. City hams (pre-cooked) are reheated to 140°F. Fresh hams must reach 145°F + 3 min rest.
                </p>
            </div>
        </div>
    );
}
