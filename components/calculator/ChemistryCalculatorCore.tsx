"use client";
import { useState } from "react";

/* ─── Shared helpers ─── */
const fmt = (n: number, d = 4) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—");
const fmtSci = (n: number) => (Number.isFinite(n) ? (Math.abs(n) < 0.001 || Math.abs(n) > 1e9 ? n.toExponential(4) : fmt(n)) : "—");
const AVOGADRO = 6.02214076e23;

function NumField({ label, value, onChange, unit, min = 0, max = 10000, step = 1 }: { label: string; value: number; onChange: (v: number) => void; unit: string; min?: number; max?: number; step?: number }) {
    return (
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">{label}</label>
            <input type="range" className="calc-field__slider" min={min} max={max} step={step}
                value={value} onChange={(e) => onChange(Number(e.target.value))} />
            <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                <input type="number" className="calc-field__input" value={value}
                    onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1 }} />
                <span className="t-body-sm text-muted">{unit}</span>
            </div>
        </div>
    );
}

function ResultCard({ label, value, unit, extras }: { label: string; value: string; unit: string; extras?: { label: string; value: string }[] }) {
    return (
        <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
            <p className="calc-field__label">{label}</p>
            <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-2)" }}>
                {value} <span style={{ fontSize: "var(--t-body)", fontWeight: 400 }}>{unit}</span>
            </p>
            {extras && extras.length > 0 && (<>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(extras.length, 3)}, 1fr)`, gap: "var(--s-3)" }}>
                    {extras.map((e, i) => (
                        <div key={i}><p className="calc-field__label">{e.label}</p><p style={{ fontWeight: 700 }}>{e.value}</p></div>
                    ))}
                </div>
            </>)}
        </div>
    );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { key: string; label: string }[] }) {
    return (
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">{label}</label>
            <select className="calc-field__input" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%" }}>
                {options.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   1. ATOMS TO MOLES — moles = atoms / Avogadro
   ═══════════════════════════════════════════════════════════════ */
function AtomsToMolesCalc() {
    const [atoms, setAtoms] = useState(6.022e23);
    const moles = atoms / AVOGADRO;
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">⚛️ NUMBER OF ATOMS (or molecules)</label>
            <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                <input type="number" className="calc-field__input" value={atoms} onChange={(e) => setAtoms(Number(e.target.value))} style={{ flex: 1 }} />
                <span className="t-body-sm text-muted">atoms</span>
            </div>
        </div>
        <ResultCard label="MOLES" value={fmtSci(moles)} unit="mol" extras={[
            { label: "AVOGADRO'S #", value: "6.022 × 10²³" },
            { label: "FORMULA", value: "n = atoms / NA" },
        ]} />
    </div>);
}

/* 2. GRAMS TO MOLES — moles = grams / molar mass */
function GramsToMolesCalc() {
    const [grams, setGrams] = useState(18);
    const [mm, setMm] = useState(18.015);
    const moles = mm > 0 ? grams / mm : 0;
    const atoms = moles * AVOGADRO;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={grams} onChange={setGrams} unit="g" max={100000} step={0.01} />
        <NumField label="🔬 MOLAR MASS" value={mm} onChange={setMm} unit="g/mol" min={0.001} max={1000} step={0.001} />
        <ResultCard label="MOLES" value={fmt(moles)} unit="mol" extras={[
            { label: "ATOMS / MOLECULES", value: fmtSci(atoms) },
            { label: "FORMULA", value: "n = m / M" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Common Molar Masses</h3>
            <table className="calc-table"><thead><tr><th>Substance</th><th>Formula</th><th>Molar Mass (g/mol)</th></tr></thead><tbody>
                {[{ n: "Water", f: "H₂O", m: 18.015 }, { n: "Carbon dioxide", f: "CO₂", m: 44.009 }, { n: "Sodium chloride", f: "NaCl", m: 58.443 }, { n: "Glucose", f: "C₆H₁₂O₆", m: 180.156 }, { n: "Ethanol", f: "C₂H₅OH", m: 46.068 }, { n: "Oxygen gas", f: "O₂", m: 31.998 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{r.f}</td><td>{r.m}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 3. HALF-LIFE — N = N₀ × (1/2)^(t/t½) */
function HalfLifeCalc() {
    const [n0, setN0] = useState(1000);
    const [halfLife, setHalfLife] = useState(5730);
    const [t, setT] = useState(11460);
    const remaining = halfLife > 0 ? n0 * Math.pow(0.5, t / halfLife) : 0;
    const numHalfLives = halfLife > 0 ? t / halfLife : 0;
    const decayed = n0 - remaining;
    return (<div className="calc-card">
        <NumField label="☢️ INITIAL QUANTITY" value={n0} onChange={setN0} unit="units" max={1000000} step={1} />
        <NumField label="⏱️ HALF-LIFE" value={halfLife} onChange={setHalfLife} unit="time units" min={0.001} max={1e10} step={1} />
        <NumField label="🕐 ELAPSED TIME" value={t} onChange={setT} unit="same units" max={1e10} step={1} />
        <ResultCard label="REMAINING QUANTITY" value={fmt(remaining)} unit="units" extras={[
            { label: "HALF-LIVES ELAPSED", value: fmt(numHalfLives, 2) },
            { label: "DECAYED", value: fmt(decayed) },
            { label: "% REMAINING", value: `${fmt(remaining / n0 * 100, 2)}%` },
        ]} />
    </div>);
}

/* 4. LITERS TO MOLES — moles = (P×V) / (R×T) at STP: moles = L / 22.414 */
function LitersToMolesCalc() {
    const [liters, setLiters] = useState(22.414);
    const [condition, setCondition] = useState<"stp" | "custom">("stp");
    const [temp, setTemp] = useState(273.15);
    const [pres, setPres] = useState(1);
    const R = 0.082057; // L⋅atm/(mol⋅K)
    const moles = condition === "stp" ? liters / 22.414 : (temp > 0 ? (pres * liters) / (R * temp) : 0);
    return (<div className="calc-card">
        <NumField label="🧪 VOLUME" value={liters} onChange={setLiters} unit="L" max={100000} step={0.1} />
        <div className="calc-field" style={{ marginBottom: "var(--s-3)", marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">CONDITIONS</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                {(["stp", "custom"] as const).map((m) => (
                    <button key={m} onClick={() => setCondition(m)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: condition === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: condition === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: condition === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                        {m === "stp" ? "STP (0°C, 1 atm)" : "Custom T & P"}
                    </button>
                ))}
            </div>
        </div>
        {condition === "custom" && <>
            <NumField label="🌡️ TEMPERATURE" value={temp} onChange={setTemp} unit="K" min={1} max={10000} step={0.1} />
            <NumField label="📊 PRESSURE" value={pres} onChange={setPres} unit="atm" min={0.001} max={1000} step={0.01} />
        </>}
        <ResultCard label="MOLES" value={fmt(moles)} unit="mol" extras={[
            { label: "MOLECULES", value: fmtSci(moles * AVOGADRO) },
            { label: "FORMULA", value: condition === "stp" ? "n = V / 22.414" : "n = PV / RT" },
        ]} />
    </div>);
}

/* 5. mg/L TO PPM — 1 mg/L = 1 ppm (for water) */
function MglToPpmCalc() {
    const [mgl, setMgl] = useState(500);
    const ppm = mgl; // 1:1 in dilute aqueous solutions
    return (<div className="calc-card">
        <NumField label="🧪 CONCENTRATION" value={mgl} onChange={setMgl} unit="mg/L" max={1000000} step={0.1} />
        <ResultCard label="PARTS PER MILLION" value={fmt(ppm)} unit="ppm" extras={[
            { label: "IN %", value: `${fmt(ppm / 10000, 4)}%` },
            { label: "IN PPB", value: fmt(ppm * 1000, 0) },
            { label: "NOTE", value: "1 mg/L ≈ 1 ppm (water)" },
        ]} />
    </div>);
}

/* 6. MOLALITY — m = moles of solute / kg of solvent */
function MolalityCalc() {
    const [molesSolute, setMolesSolute] = useState(1);
    const [kgSolvent, setKgSolvent] = useState(1);
    const molality = kgSolvent > 0 ? molesSolute / kgSolvent : 0;
    return (<div className="calc-card">
        <NumField label="🧪 MOLES OF SOLUTE" value={molesSolute} onChange={setMolesSolute} unit="mol" max={100} step={0.01} />
        <NumField label="💧 MASS OF SOLVENT" value={kgSolvent} onChange={setKgSolvent} unit="kg" min={0.001} max={1000} step={0.01} />
        <ResultCard label="MOLALITY" value={fmt(molality)} unit="mol/kg (m)" extras={[
            { label: "FORMULA", value: "m = mol_solute / kg_solvent" },
        ]} />
    </div>);
}

/* 7. MOLAR MASS — M = mass / moles */
function MolarMassCalc() {
    const [mass, setMass] = useState(18.015);
    const [moles, setMoles] = useState(1);
    const mm = moles > 0 ? mass / moles : 0;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={mass} onChange={setMass} unit="g" max={100000} step={0.01} />
        <NumField label="🔬 MOLES" value={moles} onChange={setMoles} unit="mol" min={0.001} max={100000} step={0.001} />
        <ResultCard label="MOLAR MASS" value={fmt(mm)} unit="g/mol" extras={[
            { label: "ATOMS PER MOLE", value: "6.022 × 10²³" },
            { label: "FORMULA", value: "M = m / n" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Common Molar Masses</h3>
            <table className="calc-table"><thead><tr><th>Element / Compound</th><th>g/mol</th></tr></thead><tbody>
                {[{ n: "Hydrogen (H)", m: 1.008 }, { n: "Carbon (C)", m: 12.011 }, { n: "Nitrogen (N)", m: 14.007 }, { n: "Oxygen (O)", m: 15.999 }, { n: "Water (H₂O)", m: 18.015 }, { n: "NaCl", m: 58.443 }, { n: "Glucose (C₆H₁₂O₆)", m: 180.156 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{r.m}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 8. MOLARITY — M = moles / liters */
function MolarityCalc() {
    const [moles, setMoles] = useState(1);
    const [liters, setLiters] = useState(1);
    const molarity = liters > 0 ? moles / liters : 0;
    return (<div className="calc-card">
        <NumField label="🧪 MOLES OF SOLUTE" value={moles} onChange={setMoles} unit="mol" max={1000} step={0.01} />
        <NumField label="💧 VOLUME OF SOLUTION" value={liters} onChange={setLiters} unit="L" min={0.001} max={10000} step={0.01} />
        <ResultCard label="MOLARITY" value={fmt(molarity)} unit="M (mol/L)" extras={[
            { label: "IN mM", value: `${fmt(molarity * 1000)} mM` },
            { label: "FORMULA", value: "M = n / V" },
        ]} />
    </div>);
}

/* 9. MOLE CALCULATOR — General mole conversions */
function MoleCalc() {
    const [method, setMethod] = useState<"grams" | "atoms" | "liters">("grams");
    const [grams, setGrams] = useState(18);
    const [mm, setMm] = useState(18.015);
    const [atoms, setAtoms] = useState(6.022e23);
    const [liters, setLiters] = useState(22.414);
    let moles = 0;
    if (method === "grams") moles = mm > 0 ? grams / mm : 0;
    else if (method === "atoms") moles = atoms / AVOGADRO;
    else moles = liters / 22.414;
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">CONVERT FROM</label>
            <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                {(["grams", "atoms", "liters"] as const).map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)", textTransform: "capitalize" }}>
                        {m}
                    </button>
                ))}
            </div>
        </div>
        {method === "grams" && <><NumField label="⚖️ MASS" value={grams} onChange={setGrams} unit="g" max={100000} step={0.01} /><NumField label="🔬 MOLAR MASS" value={mm} onChange={setMm} unit="g/mol" min={0.001} max={1000} step={0.001} /></>}
        {method === "atoms" && <div className="calc-field" style={{ marginTop: "var(--s-3)" }}><label className="calc-field__label">⚛️ NUMBER OF ATOMS</label><div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}><input type="number" className="calc-field__input" value={atoms} onChange={(e) => setAtoms(Number(e.target.value))} style={{ flex: 1 }} /><span className="t-body-sm text-muted">atoms</span></div></div>}
        {method === "liters" && <NumField label="🧪 VOLUME (at STP)" value={liters} onChange={setLiters} unit="L" max={100000} step={0.1} />}
        <ResultCard label="MOLES" value={fmt(moles)} unit="mol" extras={[
            { label: "GRAMS (if H₂O)", value: `${fmt(moles * 18.015)} g` },
            { label: "ATOMS", value: fmtSci(moles * AVOGADRO) },
            { label: "LITERS (STP)", value: `${fmt(moles * 22.414)} L` },
        ]} />
    </div>);
}

/* 10. MOLE FRACTION — χ = moles_i / total_moles */
function MoleFractionCalc() {
    const [molesA, setMolesA] = useState(2);
    const [molesB, setMolesB] = useState(3);
    const total = molesA + molesB;
    const chiA = total > 0 ? molesA / total : 0;
    const chiB = total > 0 ? molesB / total : 0;
    return (<div className="calc-card">
        <NumField label="🧪 MOLES OF COMPONENT A" value={molesA} onChange={setMolesA} unit="mol" max={10000} step={0.01} />
        <NumField label="🧪 MOLES OF COMPONENT B" value={molesB} onChange={setMolesB} unit="mol" max={10000} step={0.01} />
        <ResultCard label="MOLE FRACTION OF A" value={fmt(chiA)} unit="χA" extras={[
            { label: "χ OF B", value: fmt(chiB) },
            { label: "TOTAL MOLES", value: fmt(total) },
            { label: "FORMULA", value: "χ = nᵢ / n_total" },
        ]} />
    </div>);
}

/* 11. PERCENT TO PPM — ppm = percent × 10,000 */
function PercentToPpmCalc() {
    const [pct, setPct] = useState(0.5);
    const ppm = pct * 10000;
    return (<div className="calc-card">
        <NumField label="📊 PERCENTAGE" value={pct} onChange={setPct} unit="%" max={100} step={0.001} />
        <ResultCard label="PARTS PER MILLION" value={fmt(ppm, 0)} unit="ppm" extras={[
            { label: "IN PPB", value: fmt(ppm * 1000, 0) },
            { label: "IN mg/L", value: fmt(ppm) },
            { label: "FORMULA", value: "ppm = % × 10,000" },
        ]} />
    </div>);
}

/* 12. PERCENT YIELD — % yield = (actual / theoretical) × 100 */
function PercentYieldCalc() {
    const [actual, setActual] = useState(85);
    const [theoretical, setTheoretical] = useState(100);
    const pctYield = theoretical > 0 ? (actual / theoretical) * 100 : 0;
    return (<div className="calc-card">
        <NumField label="🧪 ACTUAL YIELD" value={actual} onChange={setActual} unit="g" max={100000} step={0.01} />
        <NumField label="📐 THEORETICAL YIELD" value={theoretical} onChange={setTheoretical} unit="g" max={100000} step={0.01} />
        <ResultCard label="PERCENT YIELD" value={fmt(pctYield, 2)} unit="%" extras={[
            { label: "LOST / WASTED", value: `${fmt(theoretical - actual)} g` },
            { label: "FORMULA", value: "% = (actual / theoretical) × 100" },
        ]} />
    </div>);
}

/* 13. pH CALCULATOR — pH = -log₁₀[H⁺] */
function PhCalc() {
    const [method, setMethod] = useState<"concentration" | "ph">("ph");
    const [ph, setPh] = useState(7);
    const [hConc, setHConc] = useState(1e-7);
    const computedPh = method === "ph" ? ph : (hConc > 0 ? -Math.log10(hConc) : 0);
    const computedH = method === "ph" ? Math.pow(10, -ph) : hConc;
    const computedOH = 1e-14 / computedH;
    const pOH = 14 - computedPh;
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">INPUT TYPE</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                {(["ph", "concentration"] as const).map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                        {m === "ph" ? "Enter pH" : "Enter [H⁺]"}
                    </button>
                ))}
            </div>
        </div>
        {method === "ph" ? <NumField label="🧪 pH VALUE" value={ph} onChange={setPh} unit="pH" min={0} max={14} step={0.01} />
            : <div className="calc-field" style={{ marginTop: "var(--s-3)" }}><label className="calc-field__label">⚛️ [H⁺] CONCENTRATION</label><div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}><input type="number" className="calc-field__input" value={hConc} onChange={(e) => setHConc(Number(e.target.value))} style={{ flex: 1 }} /><span className="t-body-sm text-muted">mol/L</span></div></div>}
        <ResultCard label="pH" value={fmt(computedPh, 2)} unit="" extras={[
            { label: "pOH", value: fmt(pOH, 2) },
            { label: "[H⁺]", value: fmtSci(computedH) },
            { label: "[OH⁻]", value: fmtSci(computedOH) },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>pH Scale — Common Substances</h3>
            <table className="calc-table"><thead><tr><th>Substance</th><th>pH</th><th>Type</th></tr></thead><tbody>
                {[{ n: "Battery acid", p: 0 }, { n: "Lemon juice", p: 2 }, { n: "Vinegar", p: 2.9 }, { n: "Coffee", p: 5 }, { n: "Pure water", p: 7 }, { n: "Baking soda", p: 8.3 }, { n: "Bleach", p: 12.6 }, { n: "Drain cleaner", p: 14 }].map((r) => (
                    <tr key={r.n} style={Math.abs(r.p - computedPh) < 0.5 ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{r.n}</td><td>{r.p}</td><td>{r.p < 7 ? "Acidic" : r.p > 7 ? "Basic" : "Neutral"}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 14. PPB TO PPM — ppm = ppb / 1000 */
function PpbToPpmCalc() {
    const [ppb, setPpb] = useState(5000);
    const ppm = ppb / 1000;
    return (<div className="calc-card">
        <NumField label="🧪 PARTS PER BILLION" value={ppb} onChange={setPpb} unit="ppb" max={1e9} step={1} />
        <ResultCard label="PARTS PER MILLION" value={fmt(ppm)} unit="ppm" extras={[
            { label: "IN %", value: `${fmt(ppm / 10000, 6)}%` },
            { label: "IN mg/L", value: fmt(ppm) },
            { label: "FORMULA", value: "ppm = ppb / 1,000" },
        ]} />
    </div>);
}

/* 15. PPM CALCULATOR — ppm = (part / whole) × 1,000,000 */
function PpmCalc() {
    const [part, setPart] = useState(5);
    const [whole, setWhole] = useState(1000000);
    const ppm = whole > 0 ? (part / whole) * 1e6 : 0;
    return (<div className="calc-card">
        <NumField label="🔬 PART (solute)" value={part} onChange={setPart} unit="units" max={1e9} step={0.01} />
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">📊 WHOLE (solution/total)</label>
            <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                <input type="number" className="calc-field__input" value={whole} onChange={(e) => setWhole(Number(e.target.value))} style={{ flex: 1 }} />
                <span className="t-body-sm text-muted">units</span>
            </div>
        </div>
        <ResultCard label="CONCENTRATION" value={fmt(ppm)} unit="ppm" extras={[
            { label: "IN %", value: `${fmt(ppm / 10000, 6)}%` },
            { label: "IN PPB", value: fmt(ppm * 1000, 0) },
            { label: "FORMULA", value: "ppm = (part/whole) × 10⁶" },
        ]} />
    </div>);
}

/* 16. PPM CONVERTER — universal conversion hub */
function PpmConverterCalc() {
    const [ppm, setPpm] = useState(1000);
    return (<div className="calc-card">
        <NumField label="🧪 PPM VALUE" value={ppm} onChange={setPpm} unit="ppm" max={1e6} step={1} />
        <ResultCard label="CONVERSIONS" value={fmt(ppm)} unit="ppm" extras={[
            { label: "PERCENT (%)", value: `${fmt(ppm / 10000, 6)}%` },
            { label: "PPB", value: fmt(ppm * 1000, 0) },
            { label: "mg/L (water)", value: fmt(ppm) },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>PPM Quick Reference</h3>
            <table className="calc-table"><thead><tr><th>PPM</th><th>Percent</th><th>PPB</th><th>mg/L</th></tr></thead><tbody>
                {[1, 10, 100, 1000, 10000, 100000, 1000000].map((p) => (
                    <tr key={p} style={p === ppm ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{p.toLocaleString()}</td><td>{fmt(p / 10000, 4)}%</td><td>{(p * 1000).toLocaleString()}</td><td>{p.toLocaleString()}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 17. PPM TO mg/L — mg/L = ppm (water) */
function PpmToMglCalc() {
    const [ppm, setPpm] = useState(500);
    const mgl = ppm;
    return (<div className="calc-card">
        <NumField label="🧪 PARTS PER MILLION" value={ppm} onChange={setPpm} unit="ppm" max={1e6} step={1} />
        <ResultCard label="MILLIGRAMS PER LITER" value={fmt(mgl)} unit="mg/L" extras={[
            { label: "IN g/L", value: `${fmt(mgl / 1000)} g/L` },
            { label: "IN %", value: `${fmt(ppm / 10000, 4)}%` },
            { label: "NOTE", value: "1 ppm ≈ 1 mg/L (water)" },
        ]} />
    </div>);
}

/* 18. PPM TO PERCENT — % = ppm / 10,000 */
function PpmToPercentCalc() {
    const [ppm, setPpm] = useState(50000);
    const pct = ppm / 10000;
    return (<div className="calc-card">
        <NumField label="🧪 PARTS PER MILLION" value={ppm} onChange={setPpm} unit="ppm" max={1e6} step={1} />
        <ResultCard label="PERCENTAGE" value={fmt(pct, 4)} unit="%" extras={[
            { label: "DECIMAL", value: fmt(pct / 100, 6) },
            { label: "IN PPB", value: fmt(ppm * 1000, 0) },
            { label: "FORMULA", value: "% = ppm / 10,000" },
        ]} />
    </div>);
}

/* 19. PPM TO PPB — ppb = ppm × 1,000 */
function PpmToPpbCalc() {
    const [ppm, setPpm] = useState(5);
    const ppb = ppm * 1000;
    return (<div className="calc-card">
        <NumField label="🧪 PARTS PER MILLION" value={ppm} onChange={setPpm} unit="ppm" max={1e6} step={0.001} />
        <ResultCard label="PARTS PER BILLION" value={fmt(ppb, 0)} unit="ppb" extras={[
            { label: "IN %", value: `${fmt(ppm / 10000, 6)}%` },
            { label: "FORMULA", value: "ppb = ppm × 1,000" },
        ]} />
    </div>);
}

/* 20. THEORETICAL YIELD — theoretical = (moles reactant) × ratio × M_product */
function TheoreticalYieldCalc() {
    const [massReactant, setMassReactant] = useState(10);
    const [mmReactant, setMmReactant] = useState(18.015);
    const [ratio, setRatio] = useState(1);
    const [mmProduct, setMmProduct] = useState(44.009);
    const molesReactant = mmReactant > 0 ? massReactant / mmReactant : 0;
    const molesProduct = molesReactant * ratio;
    const massProduct = molesProduct * mmProduct;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS OF REACTANT" value={massReactant} onChange={setMassReactant} unit="g" max={100000} step={0.01} />
        <NumField label="🔬 MOLAR MASS OF REACTANT" value={mmReactant} onChange={setMmReactant} unit="g/mol" min={0.001} max={1000} step={0.001} />
        <NumField label="📊 STOICHIOMETRIC RATIO (product:reactant)" value={ratio} onChange={setRatio} unit="ratio" min={0.01} max={100} step={0.01} />
        <NumField label="🔬 MOLAR MASS OF PRODUCT" value={mmProduct} onChange={setMmProduct} unit="g/mol" min={0.001} max={1000} step={0.001} />
        <ResultCard label="THEORETICAL YIELD" value={fmt(massProduct)} unit="g" extras={[
            { label: "MOLES REACTANT", value: fmt(molesReactant) },
            { label: "MOLES PRODUCT", value: fmt(molesProduct) },
            { label: "FORMULA", value: "yield = (m/M) × ratio × M_prod" },
        ]} />
    </div>);
}

/* ─── Component Map ─── */
const CALC_MAP: Record<string, () => React.JSX.Element> = {
    "atoms-to-moles": AtomsToMolesCalc,
    "grams-to-moles": GramsToMolesCalc,
    "half-life": HalfLifeCalc,
    "liters-to-moles": LitersToMolesCalc,
    "mgl-to-ppm": MglToPpmCalc,
    "molality": MolalityCalc,
    "molar-mass": MolarMassCalc,
    "molarity": MolarityCalc,
    "mole": MoleCalc,
    "mole-fraction": MoleFractionCalc,
    "percent-to-ppm": PercentToPpmCalc,
    "percent-yield": PercentYieldCalc,
    "ph": PhCalc,
    "ppb-to-ppm": PpbToPpmCalc,
    "ppm": PpmCalc,
    "ppm-converter": PpmConverterCalc,
    "ppm-to-mgl": PpmToMglCalc,
    "ppm-to-percent": PpmToPercentCalc,
    "ppm-to-ppb": PpmToPpbCalc,
    "theoretical-yield": TheoreticalYieldCalc,
};

export default function ChemistryCalculatorCore({ calcType }: { calcType: string }) {
    const Comp = CALC_MAP[calcType];
    if (!Comp) return <p>Calculator not found.</p>;
    return <Comp />;
}
