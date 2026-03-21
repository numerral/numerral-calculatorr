"use client";
import { useState } from "react";

/* ─── Shared helpers ─── */
const fmt = (n: number, d = 4) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—");

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

/* ═══════════════════════════════════════════════════════════════
   1. PING PONG BALLS TO FILL A POOL
   ═══════════════════════════════════════════════════════════════ */
function PingPongPoolCalc() {
    const [length, setLength] = useState(40);
    const [width, setWidth] = useState(20);
    const [depth, setDepth] = useState(5);
    const [unit, setUnit] = useState<"ft" | "m">("ft");
    // Pool volume
    const toM = unit === "ft" ? 0.3048 : 1;
    const volM3 = length * toM * width * toM * depth * toM;
    const volFt3 = volM3 * 35.3147;
    const volGal = volM3 * 264.172;
    // Ping pong ball: 40mm diameter = 0.04m, radius 0.02m, sphere volume = 4/3 π r³
    const ballVolM3 = (4 / 3) * Math.PI * Math.pow(0.02, 3);
    // Random packing efficiency ~64%
    const packingEff = 0.64;
    const numBalls = Math.floor((volM3 * packingEff) / ballVolM3);
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">UNIT</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                {(["ft", "m"] as const).map((u) => (
                    <button key={u} onClick={() => setUnit(u)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: unit === u ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: unit === u ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: unit === u ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                        {u === "ft" ? "Feet" : "Meters"}
                    </button>
                ))}
            </div>
        </div>
        <NumField label="📏 LENGTH" value={length} onChange={setLength} unit={unit} max={200} step={0.5} />
        <NumField label="📏 WIDTH" value={width} onChange={setWidth} unit={unit} max={200} step={0.5} />
        <NumField label="📏 AVERAGE DEPTH" value={depth} onChange={setDepth} unit={unit} max={30} step={0.1} />
        <ResultCard label="PING PONG BALLS NEEDED" value={numBalls.toLocaleString()} unit="balls" extras={[
            { label: "POOL VOLUME", value: `${fmt(volFt3, 0)} ft³` },
            { label: "GALLONS", value: `${fmt(volGal, 0)} gal` },
            { label: "PACKING", value: "64% (random)" },
        ]} />
        <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "var(--n-surface)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)" }}>
            <p className="t-body-sm text-muted">Standard ping pong ball: 40 mm diameter, ~2.7 g. Random packing efficiency for spheres is approximately 64% (Bernal packing).</p>
        </div>
    </div>);
}

/* 2. DENSITY CALCULATOR — ρ = m/V */
function DensityCalc() {
    const [method, setMethod] = useState<"density" | "mass" | "volume">("density");
    const [mass, setMass] = useState(1000);
    const [volume, setVolume] = useState(1);
    const [density, setDensity] = useState(1000);
    let result = 0;
    let rLabel = "", rUnit = "";
    if (method === "density") { result = volume > 0 ? mass / volume : 0; rLabel = "DENSITY"; rUnit = "kg/m³"; }
    else if (method === "mass") { result = density * volume; rLabel = "MASS"; rUnit = "kg"; }
    else { result = density > 0 ? mass / density : 0; rLabel = "VOLUME"; rUnit = "m³"; }
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">SOLVE FOR</label>
            <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                {(["density", "mass", "volume"] as const).map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)", textTransform: "capitalize" }}>
                        {m}
                    </button>
                ))}
            </div>
        </div>
        {method !== "mass" && <NumField label="⚖️ MASS" value={mass} onChange={setMass} unit="kg" max={1000000} step={0.1} />}
        {method !== "volume" && <NumField label="📦 VOLUME" value={volume} onChange={setVolume} unit="m³" min={0.001} max={100000} step={0.001} />}
        {method !== "density" && <NumField label="🔬 DENSITY" value={density} onChange={setDensity} unit="kg/m³" max={25000} step={1} />}
        <ResultCard label={rLabel} value={fmt(result)} unit={rUnit} extras={[
            { label: "FORMULA", value: "ρ = m / V" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Density of Common Materials</h3>
            <table className="calc-table"><thead><tr><th>Material</th><th>Density (kg/m³)</th><th>Density (lb/ft³)</th></tr></thead><tbody>
                {[{ n: "Air (sea level)", d: 1.225 }, { n: "Oak wood", d: 750 }, { n: "Ice", d: 917 }, { n: "Water (4°C)", d: 1000 }, { n: "Concrete", d: 2400 }, { n: "Aluminum", d: 2700 }, { n: "Steel", d: 7850 }, { n: "Copper", d: 8960 }, { n: "Lead", d: 11340 }, { n: "Gold", d: 19300 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{fmt(r.d, 0)}</td><td>{fmt(r.d * 0.062428, 2)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 3. METAL WEIGHT CALCULATOR */
function MetalWeightCalc() {
    const metals = [
        { key: "steel", name: "Steel", density: 7850 },
        { key: "aluminum", name: "Aluminum", density: 2700 },
        { key: "copper", name: "Copper", density: 8960 },
        { key: "brass", name: "Brass", density: 8530 },
        { key: "bronze", name: "Bronze", density: 8800 },
        { key: "stainless", name: "Stainless Steel", density: 8000 },
        { key: "titanium", name: "Titanium", density: 4507 },
        { key: "lead", name: "Lead", density: 11340 },
        { key: "zinc", name: "Zinc", density: 7135 },
        { key: "cast-iron", name: "Cast Iron", density: 7200 },
        { key: "gold", name: "Gold", density: 19300 },
        { key: "silver", name: "Silver", density: 10490 },
    ];
    const [metal, setMetal] = useState("steel");
    const [shape, setShape] = useState<"plate" | "round" | "tube">("plate");
    const [l, setL] = useState(100);
    const [w, setW] = useState(50);
    const [t, setT] = useState(5);
    const [dia, setDia] = useState(50);
    const [od, setOd] = useState(60);
    const [id, setId] = useState(50);
    const selected = metals.find((m) => m.key === metal)!;
    // dimensions in mm → convert to m
    let volM3 = 0;
    if (shape === "plate") volM3 = (l / 1000) * (w / 1000) * (t / 1000);
    else if (shape === "round") volM3 = Math.PI * Math.pow(dia / 2000, 2) * (l / 1000);
    else volM3 = Math.PI * (Math.pow(od / 2000, 2) - Math.pow(id / 2000, 2)) * (l / 1000);
    const weightKg = selected.density * volM3;
    const weightLb = weightKg * 2.20462;
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">🔧 METAL TYPE</label>
            <select className="calc-field__input" value={metal} onChange={(e) => setMetal(e.target.value)} style={{ width: "100%" }}>
                {metals.map((m) => <option key={m.key} value={m.key}>{m.name} ({fmt(m.density, 0)} kg/m³)</option>)}
            </select>
        </div>
        <div className="calc-field" style={{ marginTop: "var(--s-3)", marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">📐 SHAPE</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                {(["plate", "round", "tube"] as const).map((s) => (
                    <button key={s} onClick={() => setShape(s)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: shape === s ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: shape === s ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: shape === s ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)", textTransform: "capitalize" }}>
                        {s === "plate" ? "Plate/Sheet" : s === "round" ? "Round Bar" : "Tube/Pipe"}
                    </button>
                ))}
            </div>
        </div>
        <NumField label="📏 LENGTH" value={l} onChange={setL} unit="mm" max={100000} step={1} />
        {shape === "plate" && <><NumField label="📏 WIDTH" value={w} onChange={setW} unit="mm" max={10000} step={1} /><NumField label="📏 THICKNESS" value={t} onChange={setT} unit="mm" max={1000} step={0.1} /></>}
        {shape === "round" && <NumField label="📏 DIAMETER" value={dia} onChange={setDia} unit="mm" max={5000} step={0.1} />}
        {shape === "tube" && <><NumField label="📏 OUTER DIAMETER" value={od} onChange={setOd} unit="mm" max={5000} step={0.1} /><NumField label="📏 INNER DIAMETER" value={id} onChange={setId} unit="mm" max={5000} step={0.1} /></>}
        <ResultCard label="WEIGHT" value={fmt(weightKg)} unit="kg" extras={[
            { label: "IN lbs", value: `${fmt(weightLb)} lbs` },
            { label: "VOLUME", value: `${fmt(volM3 * 1e6)} cm³` },
            { label: "DENSITY", value: `${fmt(selected.density, 0)} kg/m³` },
        ]} />
    </div>);
}

/* 4. SNOW WATER EQUIVALENT — SWE = snow depth × density ratio */
function SnowWaterEquivCalc() {
    const [depth, setDepth] = useState(12);
    const [ratio, setRatio] = useState(12);
    const swe = ratio > 0 ? depth / ratio : 0;
    return (<div className="calc-card">
        <NumField label="❄️ SNOW DEPTH" value={depth} onChange={setDepth} unit="inches" max={200} step={0.5} />
        <NumField label="📊 SNOW-TO-WATER RATIO" value={ratio} onChange={setRatio} unit=":1" min={1} max={50} step={1} />
        <ResultCard label="SNOW WATER EQUIVALENT" value={fmt(swe, 2)} unit="inches of water" extras={[
            { label: "IN mm", value: `${fmt(swe * 25.4)} mm` },
            { label: "SNOW DENSITY", value: `${fmt(1000 / ratio, 0)} kg/m³` },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Snow Density — Common Ratios</h3>
            <table className="calc-table"><thead><tr><th>Snow Type</th><th>Ratio</th><th>Density (kg/m³)</th></tr></thead><tbody>
                {[{ n: "Light/fluffy (powder)", r: 20 }, { n: "Average fresh snow", r: 12 }, { n: "Wet/packing snow", r: 8 }, { n: "Heavy/wet snow", r: 5 }, { n: "Settled/old snow", r: 4 }, { n: "Firn (compacted)", r: 2 }].map((s) => (
                    <tr key={s.n} style={s.r === ratio ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{s.n}</td><td>{s.r}:1</td><td>{fmt(1000 / s.r, 0)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 5. SNOW WEIGHT CALCULATOR */
function SnowWeightCalc() {
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(20);
    const [depth, setDepth] = useState(8);
    const [type, setType] = useState("average");
    const densities: Record<string, number> = { light: 50, average: 83, wet: 125, heavy: 200, ice: 500 };
    const density = densities[type]; // kg/m³
    // ft to m: 0.3048, inches to m: 0.0254
    const volM3 = (length * 0.3048) * (width * 0.3048) * (depth * 0.0254);
    const weightKg = density * volM3;
    const weightLbs = weightKg * 2.20462;
    const psfLbPerFt2 = (density * 0.0254 * depth) * 2.20462 / (0.3048 * 0.3048); // approximate
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">❄️ SNOW TYPE</label>
            <select className="calc-field__input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%" }}>
                <option value="light">Light/Fluffy (3 lb/ft³)</option>
                <option value="average">Average Fresh Snow (5 lb/ft³)</option>
                <option value="wet">Wet Snow (8 lb/ft³)</option>
                <option value="heavy">Heavy/Packed Snow (12.5 lb/ft³)</option>
                <option value="ice">Ice (31 lb/ft³)</option>
            </select>
        </div>
        <NumField label="📏 ROOF/AREA LENGTH" value={length} onChange={setLength} unit="ft" max={200} step={1} />
        <NumField label="📏 ROOF/AREA WIDTH" value={width} onChange={setWidth} unit="ft" max={200} step={1} />
        <NumField label="❄️ SNOW DEPTH" value={depth} onChange={setDepth} unit="inches" max={96} step={0.5} />
        <ResultCard label="TOTAL SNOW WEIGHT" value={fmt(weightLbs, 0)} unit="lbs" extras={[
            { label: "IN kg", value: `${fmt(weightKg, 0)} kg` },
            { label: "IN tons", value: `${fmt(weightLbs / 2000, 2)} tons` },
            { label: "DENSITY", value: `${fmt(density, 0)} kg/m³` },
        ]} />
    </div>);
}

/* 6. WATER WEIGHT CALCULATOR */
function WaterWeightCalc() {
    const [volume, setVolume] = useState(1);
    const [vUnit, setVUnit] = useState<"gal" | "L" | "ft3" | "m3">("gal");
    const toL: Record<string, number> = { gal: 3.78541, L: 1, ft3: 28.3168, m3: 1000 };
    const liters = volume * toL[vUnit];
    const weightKg = liters; // 1 L water ≈ 1 kg at 4°C
    const weightLbs = weightKg * 2.20462;
    return (<div className="calc-card">
        <NumField label="💧 VOLUME" value={volume} onChange={setVolume} unit={vUnit} max={1000000} step={0.1} />
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">VOLUME UNIT</label>
            <select className="calc-field__input" value={vUnit} onChange={(e) => setVUnit(e.target.value as typeof vUnit)} style={{ width: "100%" }}>
                <option value="gal">US Gallons</option>
                <option value="L">Liters</option>
                <option value="ft3">Cubic Feet</option>
                <option value="m3">Cubic Meters</option>
            </select>
        </div>
        <ResultCard label="WATER WEIGHT" value={fmt(weightLbs, 2)} unit="lbs" extras={[
            { label: "IN kg", value: `${fmt(weightKg, 2)} kg` },
            { label: "LITERS", value: fmt(liters, 2) },
            { label: "GALLONS", value: fmt(liters / 3.78541, 2) },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Water Weight — Quick Reference</h3>
            <table className="calc-table"><thead><tr><th>Volume</th><th>Weight (lbs)</th><th>Weight (kg)</th></tr></thead><tbody>
                {[{ n: "1 cup (8 oz)", l: 0.2366 }, { n: "1 quart", l: 0.9464 }, { n: "1 gallon", l: 3.7854 }, { n: "5 gallons", l: 18.927 }, { n: "1 cubic foot", l: 28.317 }, { n: "55 gal drum", l: 208.2 }, { n: "Hot tub (400 gal)", l: 1514.2 }, { n: "Pool (20k gal)", l: 75708 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{fmt(r.l * 2.20462, 1)}</td><td>{fmt(r.l, 1)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* ─── Component Map ─── */
const CALC_MAP: Record<string, () => React.JSX.Element> = {
    "ping-pong-balls-pool": PingPongPoolCalc,
    "density": DensityCalc,
    "metal-weight": MetalWeightCalc,
    "snow-water-equivalent": SnowWaterEquivCalc,
    "snow-weight": SnowWeightCalc,
    "water-weight": WaterWeightCalc,
};

export default function DensityCalculatorCore({ calcType }: { calcType: string }) {
    const Comp = CALC_MAP[calcType];
    if (!Comp) return <p>Calculator not found.</p>;
    return <Comp />;
}
