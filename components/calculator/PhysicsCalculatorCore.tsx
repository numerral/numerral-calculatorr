"use client";
import { useState } from "react";

/* ─── Shared helpers ─── */
const fmt = (n: number, d = 4) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—");
const fmtSci = (n: number) => (Number.isFinite(n) ? (Math.abs(n) < 0.001 || Math.abs(n) > 1e9 ? n.toExponential(4) : fmt(n)) : "—");
const G_CONST = 6.674e-11; // gravitational constant
const G_ACCEL = 9.80665;   // standard gravity m/s²

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
   1. ACCELERATION — a = (v_f - v_i) / t
   ═══════════════════════════════════════════════════════════════ */
function AccelerationCalc() {
    const [vi, setVi] = useState(0);
    const [vf, setVf] = useState(30);
    const [t, setT] = useState(5);
    const a = t > 0 ? (vf - vi) / t : 0;
    return (<div className="calc-card">
        <NumField label="🚀 INITIAL VELOCITY" value={vi} onChange={setVi} unit="m/s" min={-1000} max={1000} step={0.1} />
        <NumField label="🏁 FINAL VELOCITY" value={vf} onChange={setVf} unit="m/s" min={-1000} max={1000} step={0.1} />
        <NumField label="🕐 TIME" value={t} onChange={setT} unit="s" min={0.01} max={1000} step={0.1} />
        <ResultCard label="ACCELERATION" value={fmt(a)} unit="m/s²" extras={[
            { label: "IN ft/s²", value: `${fmt(a * 3.28084)} ft/s²` },
            { label: "IN g", value: `${fmt(a / G_ACCEL)} g` },
            { label: "FORMULA", value: "a = (v₂ − v₁) / t" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Acceleration — Reference Table</h3>
            <table className="calc-table"><thead><tr><th>Scenario</th><th>Acceleration</th><th>g-force</th></tr></thead><tbody>
                {[{ n: "Walking start", a: 1.5 }, { n: "Car (0-60 mph, 8s)", a: 3.35 }, { n: "Sports car (0-60, 3s)", a: 8.94 }, { n: "Free fall", a: 9.81 }, { n: "Fighter jet turn", a: 88 }, { n: "Space shuttle launch", a: 29.4 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{fmt(r.a)} m/s²</td><td>{fmt(r.a / G_ACCEL)} g</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 2. ANGULAR ACCELERATION — α = (ω_f - ω_i) / t */
function AngularAccelerationCalc() {
    const [wi, setWi] = useState(0);
    const [wf, setWf] = useState(100);
    const [t, setT] = useState(5);
    const alpha = t > 0 ? (wf - wi) / t : 0;
    return (<div className="calc-card">
        <NumField label="🔄 INITIAL ANGULAR VELOCITY" value={wi} onChange={setWi} unit="rad/s" min={-500} max={500} step={0.1} />
        <NumField label="🎯 FINAL ANGULAR VELOCITY" value={wf} onChange={setWf} unit="rad/s" min={-500} max={500} step={0.1} />
        <NumField label="🕐 TIME" value={t} onChange={setT} unit="s" min={0.01} max={1000} step={0.1} />
        <ResultCard label="ANGULAR ACCELERATION" value={fmt(alpha)} unit="rad/s²" extras={[
            { label: "IN RPM/s", value: `${fmt(alpha * 60 / (2 * Math.PI))} RPM/s` },
            { label: "IN deg/s²", value: `${fmt(alpha * 180 / Math.PI)} °/s²` },
            { label: "FORMULA", value: "α = (ω₂ − ω₁) / t" },
        ]} />
    </div>);
}

/* 3. ANGULAR VELOCITY — ω = θ / t  OR  ω = 2π × RPM / 60 */
function AngularVelocityCalc() {
    const [method, setMethod] = useState<"angle" | "rpm">("rpm");
    const [angle, setAngle] = useState(360);
    const [rpm, setRpm] = useState(1800);
    const [t, setT] = useState(1);
    const omega = method === "rpm" ? (2 * Math.PI * rpm) / 60 : (t > 0 ? (angle * Math.PI / 180) / t : 0);
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">METHOD</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                {(["rpm", "angle"] as const).map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                        {m === "rpm" ? "From RPM" : "From Angle & Time"}
                    </button>
                ))}
            </div>
        </div>
        {method === "rpm" ? <NumField label="🔄 ROTATIONAL SPEED" value={rpm} onChange={setRpm} unit="RPM" max={100000} step={10} />
            : <><NumField label="📐 ANGLE" value={angle} onChange={setAngle} unit="degrees" max={36000} step={1} />
                <NumField label="🕐 TIME" value={t} onChange={setT} unit="s" min={0.01} max={1000} step={0.1} /></>}
        <ResultCard label="ANGULAR VELOCITY" value={fmt(omega)} unit="rad/s" extras={[
            { label: "IN RPM", value: `${fmt(omega * 60 / (2 * Math.PI))} RPM` },
            { label: "IN deg/s", value: `${fmt(omega * 180 / Math.PI)} °/s` },
            { label: "FORMULA", value: method === "rpm" ? "ω = 2π×RPM/60" : "ω = θ/t" },
        ]} />
    </div>);
}

/* 4. AVERAGE VELOCITY — v_avg = Δx / Δt */
function AverageVelocityCalc() {
    const [d, setD] = useState(100);
    const [t, setT] = useState(10);
    const v = t > 0 ? d / t : 0;
    return (<div className="calc-card">
        <NumField label="📏 DISPLACEMENT" value={d} onChange={setD} unit="m" min={-100000} max={100000} step={1} />
        <NumField label="🕐 TIME" value={t} onChange={setT} unit="s" min={0.01} max={100000} step={0.1} />
        <ResultCard label="AVERAGE VELOCITY" value={fmt(v)} unit="m/s" extras={[
            { label: "IN km/h", value: `${fmt(v * 3.6)} km/h` },
            { label: "IN mph", value: `${fmt(v * 2.23694)} mph` },
            { label: "FORMULA", value: "v = Δx / Δt" },
        ]} />
    </div>);
}

/* 5. CENTRIFUGAL FORCE — F = m × v² / r = m × ω² × r */
function CentrifugalForceCalc() {
    const [m, setM] = useState(5);
    const [v, setV] = useState(10);
    const [r, setR] = useState(2);
    const F = r > 0 ? (m * v * v) / r : 0;
    const omega = r > 0 ? v / r : 0;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.01} max={10000} step={0.1} />
        <NumField label="🚀 VELOCITY" value={v} onChange={setV} unit="m/s" max={10000} step={0.1} />
        <NumField label="📏 RADIUS" value={r} onChange={setR} unit="m" min={0.01} max={10000} step={0.1} />
        <ResultCard label="CENTRIFUGAL FORCE" value={fmt(F)} unit="N" extras={[
            { label: "IN lbf", value: `${fmt(F * 0.224809)} lbf` },
            { label: "ANGULAR VEL.", value: `${fmt(omega)} rad/s` },
            { label: "FORMULA", value: "F = mv²/r" },
        ]} />
    </div>);
}

/* 6. CENTRIPETAL FORCE — F = m × v² / r */
function CentripetalForceCalc() {
    const [m, setM] = useState(1000);
    const [v, setV] = useState(20);
    const [r, setR] = useState(50);
    const F = r > 0 ? (m * v * v) / r : 0;
    const a = r > 0 ? (v * v) / r : 0;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.01} max={100000} step={1} />
        <NumField label="🚀 VELOCITY" value={v} onChange={setV} unit="m/s" max={10000} step={0.1} />
        <NumField label="📏 RADIUS" value={r} onChange={setR} unit="m" min={0.01} max={100000} step={1} />
        <ResultCard label="CENTRIPETAL FORCE" value={fmt(F)} unit="N" extras={[
            { label: "CENTRIPETAL ACCEL.", value: `${fmt(a)} m/s²` },
            { label: "IN g", value: `${fmt(a / G_ACCEL)} g` },
            { label: "FORMULA", value: "F = mv²/r" },
        ]} />
    </div>);
}

/* 7. COEFFICIENT OF FRICTION — μ = F_friction / F_normal */
function CoefficientOfFrictionCalc() {
    const [ff, setFf] = useState(50);
    const [fn, setFn] = useState(100);
    const mu = fn > 0 ? ff / fn : 0;
    return (<div className="calc-card">
        <NumField label="🔥 FRICTION FORCE" value={ff} onChange={setFf} unit="N" max={100000} step={0.1} />
        <NumField label="⬇️ NORMAL FORCE" value={fn} onChange={setFn} unit="N" max={100000} step={0.1} />
        <ResultCard label="COEFFICIENT OF FRICTION" value={fmt(mu)} unit="μ" extras={[
            { label: "FRICTION TYPE", value: mu > 0.7 ? "High (rubber)" : mu > 0.3 ? "Moderate (wood)" : "Low (ice)" },
            { label: "FORMULA", value: "μ = F_f / F_n" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Common Coefficients of Friction</h3>
            <table className="calc-table"><thead><tr><th>Surface Pair</th><th>Static μ</th><th>Kinetic μ</th></tr></thead><tbody>
                {[{ n: "Rubber on concrete", s: 1.0, k: 0.8 }, { n: "Rubber on wet road", s: 0.7, k: 0.5 }, { n: "Wood on wood", s: 0.5, k: 0.3 }, { n: "Steel on steel", s: 0.6, k: 0.4 }, { n: "Ice on ice", s: 0.1, k: 0.03 }, { n: "Teflon on steel", s: 0.04, k: 0.04 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{r.s}</td><td>{r.k}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 8. DISPLACEMENT — s = v₀t + ½at² */
function DisplacementCalc() {
    const [v0, setV0] = useState(0);
    const [a, setA] = useState(9.81);
    const [t, setT] = useState(5);
    const s = v0 * t + 0.5 * a * t * t;
    const vf = v0 + a * t;
    return (<div className="calc-card">
        <NumField label="🚀 INITIAL VELOCITY" value={v0} onChange={setV0} unit="m/s" min={-1000} max={1000} step={0.1} />
        <NumField label="📈 ACCELERATION" value={a} onChange={setA} unit="m/s²" min={-100} max={100} step={0.01} />
        <NumField label="🕐 TIME" value={t} onChange={setT} unit="s" min={0} max={1000} step={0.1} />
        <ResultCard label="DISPLACEMENT" value={fmt(s)} unit="m" extras={[
            { label: "IN ft", value: `${fmt(s * 3.28084)} ft` },
            { label: "FINAL VELOCITY", value: `${fmt(vf)} m/s` },
            { label: "FORMULA", value: "s = v₀t + ½at²" },
        ]} />
    </div>);
}

/* 9. ELASTIC POTENTIAL ENERGY — PE = ½kx² */
function ElasticPECalc() {
    const [k, setK] = useState(200);
    const [x, setX] = useState(0.1);
    const pe = 0.5 * k * x * x;
    return (<div className="calc-card">
        <NumField label="🔧 SPRING CONSTANT" value={k} onChange={setK} unit="N/m" min={0.1} max={100000} step={1} />
        <NumField label="📏 DISPLACEMENT" value={x} onChange={setX} unit="m" min={-10} max={10} step={0.001} />
        <ResultCard label="ELASTIC POTENTIAL ENERGY" value={fmt(pe)} unit="J" extras={[
            { label: "IN kJ", value: `${fmt(pe / 1000, 4)} kJ` },
            { label: "MAX FORCE", value: `${fmt(k * Math.abs(x))} N` },
            { label: "FORMULA", value: "PE = ½kx²" },
        ]} />
    </div>);
}

/* 10. FORCE — F = m × a (Newton's Second Law) */
function ForceCalc() {
    const [m, setM] = useState(10);
    const [a, setA] = useState(9.81);
    const F = m * a;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.001} max={1000000} step={0.1} />
        <NumField label="📈 ACCELERATION" value={a} onChange={setA} unit="m/s²" min={-1000} max={1000} step={0.01} />
        <ResultCard label="FORCE" value={fmt(F)} unit="N" extras={[
            { label: "IN lbf", value: `${fmt(F * 0.224809)} lbf` },
            { label: "IN kN", value: `${fmt(F / 1000)} kN` },
            { label: "FORMULA", value: "F = m × a" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Force — Reference Table (at g = 9.81 m/s²)</h3>
            <table className="calc-table"><thead><tr><th>Mass</th><th>Weight (N)</th><th>Weight (lbf)</th></tr></thead><tbody>
                {[0.1, 1, 5, 10, 50, 100, 500, 1000].map((mass) => (
                    <tr key={mass} style={mass === m ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{mass} kg</td><td>{fmt(mass * 9.81)} N</td><td>{fmt(mass * 9.81 * 0.224809)} lbf</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 11. FREQUENCY — f = 1/T  OR  f = v/λ */
function FrequencyCalc() {
    const [method, setMethod] = useState<"period" | "wave">("period");
    const [period, setPeriod] = useState(0.02);
    const [v, setV] = useState(343);
    const [wl, setWl] = useState(1);
    const f = method === "period" ? (period > 0 ? 1 / period : 0) : (wl > 0 ? v / wl : 0);
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">METHOD</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                {(["period", "wave"] as const).map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                        {m === "period" ? "From Period" : "From Wave Speed & Wavelength"}
                    </button>
                ))}
            </div>
        </div>
        {method === "period" ? <NumField label="🕐 PERIOD" value={period} onChange={setPeriod} unit="s" min={0.0001} max={1000} step={0.0001} />
            : <><NumField label="🚀 WAVE SPEED" value={v} onChange={setV} unit="m/s" max={300000000} step={1} />
                <NumField label="📏 WAVELENGTH" value={wl} onChange={setWl} unit="m" min={0.0001} max={100000} step={0.001} /></>}
        <ResultCard label="FREQUENCY" value={f > 1e6 ? fmtSci(f) : fmt(f)} unit="Hz" extras={[
            { label: "PERIOD", value: `${fmtSci(1 / f)} s` },
            { label: f > 1000 ? "IN kHz" : "IN mHz", value: f > 1000 ? `${fmt(f / 1000)} kHz` : `${fmt(f * 1000)} mHz` },
            { label: "FORMULA", value: method === "period" ? "f = 1/T" : "f = v/λ" },
        ]} />
    </div>);
}

/* 12. FRICTION FORCE — F_f = μ × F_n */
function FrictionForceCalc() {
    const [mu, setMu] = useState(0.5);
    const [fn, setFn] = useState(100);
    const ff = mu * fn;
    return (<div className="calc-card">
        <NumField label="📊 COEFFICIENT OF FRICTION" value={mu} onChange={setMu} unit="μ" min={0} max={2} step={0.01} />
        <NumField label="⬇️ NORMAL FORCE" value={fn} onChange={setFn} unit="N" max={100000} step={1} />
        <ResultCard label="FRICTION FORCE" value={fmt(ff)} unit="N" extras={[
            { label: "IN lbf", value: `${fmt(ff * 0.224809)} lbf` },
            { label: "FORMULA", value: "F_f = μ × F_n" },
        ]} />
    </div>);
}

/* 13. GRAVITATIONAL FORCE — F = G × m₁ × m₂ / r² */
function GravitationalForceCalc() {
    const [m1, setM1] = useState(5.972e24);
    const [m2, setM2] = useState(70);
    const [r, setR] = useState(6.371e6);
    const F = r > 0 ? (G_CONST * m1 * m2) / (r * r) : 0;
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">⚖️ MASS 1</label>
            <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                <input type="number" className="calc-field__input" value={m1} onChange={(e) => setM1(Number(e.target.value))} style={{ flex: 1 }} />
                <span className="t-body-sm text-muted">kg</span>
            </div>
        </div>
        <NumField label="⚖️ MASS 2" value={m2} onChange={setM2} unit="kg" min={0.001} max={1e30} step={1} />
        <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
            <label className="calc-field__label">📏 DISTANCE</label>
            <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                <input type="number" className="calc-field__input" value={r} onChange={(e) => setR(Number(e.target.value))} style={{ flex: 1 }} />
                <span className="t-body-sm text-muted">m</span>
            </div>
        </div>
        <ResultCard label="GRAVITATIONAL FORCE" value={fmtSci(F)} unit="N" extras={[
            { label: "G CONSTANT", value: "6.674×10⁻¹¹ N⋅m²/kg²" },
            { label: "ACCEL. (m₂)", value: `${fmtSci(F / m2)} m/s²` },
            { label: "FORMULA", value: "F = Gm₁m₂/r²" },
        ]} />
    </div>);
}

/* 14. GRAVITATIONAL POTENTIAL ENERGY — PE = mgh */
function GravitationalPECalc() {
    const [m, setM] = useState(10);
    const [h, setH] = useState(50);
    const pe = m * G_ACCEL * h;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.001} max={100000} step={0.1} />
        <NumField label="📏 HEIGHT" value={h} onChange={setH} unit="m" min={0} max={100000} step={0.1} />
        <ResultCard label="GRAVITATIONAL PE" value={fmt(pe)} unit="J" extras={[
            { label: "IN kJ", value: `${fmt(pe / 1000)} kJ` },
            { label: "IN ft⋅lbf", value: `${fmt(pe * 0.737562)} ft⋅lbf` },
            { label: "FORMULA", value: "PE = mgh" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Gravitational PE — Reference (g = 9.81 m/s²)</h3>
            <table className="calc-table"><thead><tr><th>Mass</th><th>1 m</th><th>10 m</th><th>50 m</th><th>100 m</th></tr></thead><tbody>
                {[1, 5, 10, 50, 100, 500].map((mass) => (
                    <tr key={mass} style={mass === m ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{mass} kg</td><td>{fmt(mass * 9.81 * 1, 0)} J</td><td>{fmt(mass * 9.81 * 10, 0)} J</td>
                        <td>{fmt(mass * 9.81 * 50, 0)} J</td><td>{fmt(mass * 9.81 * 100, 0)} J</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 15. KINETIC ENERGY — KE = ½mv² */
function KineticEnergyCalc() {
    const [m, setM] = useState(1000);
    const [v, setV] = useState(30);
    const ke = 0.5 * m * v * v;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.001} max={1000000} step={1} />
        <NumField label="🚀 VELOCITY" value={v} onChange={setV} unit="m/s" max={300000000} step={0.1} />
        <ResultCard label="KINETIC ENERGY" value={ke > 1e6 ? fmtSci(ke) : fmt(ke)} unit="J" extras={[
            { label: "IN kJ", value: `${fmt(ke / 1000)} kJ` },
            { label: "IN ft⋅lbf", value: `${fmt(ke * 0.737562)} ft⋅lbf` },
            { label: "FORMULA", value: "KE = ½mv²" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Kinetic Energy — Vehicle Examples</h3>
            <table className="calc-table"><thead><tr><th>Vehicle</th><th>Mass (kg)</th><th>Speed</th><th>KE</th></tr></thead><tbody>
                {[{ n: "Bicycle", m: 90, v: 6.7 }, { n: "Car (30 mph)", m: 1500, v: 13.4 }, { n: "Car (60 mph)", m: 1500, v: 26.8 }, { n: "Truck (60 mph)", m: 10000, v: 26.8 }, { n: "Train", m: 100000, v: 44.7 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{fmt(r.m, 0)}</td><td>{fmt(r.v)} m/s</td><td>{fmt(0.5 * r.m * r.v * r.v / 1000)} kJ</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 16. MAGNITUDE OF ACCELERATION — |a| = √(ax² + ay²) */
function MagnitudeOfAccelerationCalc() {
    const [ax, setAx] = useState(3);
    const [ay, setAy] = useState(4);
    const mag = Math.sqrt(ax * ax + ay * ay);
    const angle = Math.atan2(ay, ax) * 180 / Math.PI;
    return (<div className="calc-card">
        <NumField label="📐 X-COMPONENT" value={ax} onChange={setAx} unit="m/s²" min={-1000} max={1000} step={0.1} />
        <NumField label="📐 Y-COMPONENT" value={ay} onChange={setAy} unit="m/s²" min={-1000} max={1000} step={0.1} />
        <ResultCard label="MAGNITUDE" value={fmt(mag)} unit="m/s²" extras={[
            { label: "DIRECTION", value: `${fmt(angle)}°` },
            { label: "IN g", value: `${fmt(mag / G_ACCEL)} g` },
            { label: "FORMULA", value: "|a| = √(ax²+ay²)" },
        ]} />
    </div>);
}

/* 17. MASS — m = F/a  OR  m = ρ×V */
function MassCalc() {
    const [method, setMethod] = useState<"force" | "density">("force");
    const [F, setF] = useState(100);
    const [a, setA] = useState(9.81);
    const [rho, setRho] = useState(1000);
    const [vol, setVol] = useState(0.5);
    const mass = method === "force" ? (a !== 0 ? F / a : 0) : rho * vol;
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">METHOD</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                {(["force", "density"] as const).map((m) => (
                    <button key={m} onClick={() => setMethod(m)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                        {m === "force" ? "From Force & Acceleration" : "From Density & Volume"}
                    </button>
                ))}
            </div>
        </div>
        {method === "force" ? <>
            <NumField label="💪 FORCE" value={F} onChange={setF} unit="N" max={1000000} step={1} />
            <NumField label="📈 ACCELERATION" value={a} onChange={setA} unit="m/s²" min={0.001} max={1000} step={0.01} />
        </> : <>
            <NumField label="🔬 DENSITY" value={rho} onChange={setRho} unit="kg/m³" max={25000} step={1} />
            <NumField label="📦 VOLUME" value={vol} onChange={setVol} unit="m³" min={0.001} max={10000} step={0.001} />
        </>}
        <ResultCard label="MASS" value={fmt(mass)} unit="kg" extras={[
            { label: "IN lbs", value: `${fmt(mass * 2.20462)} lbs` },
            { label: "WEIGHT (N)", value: `${fmt(mass * G_ACCEL)} N` },
            { label: "FORMULA", value: method === "force" ? "m = F/a" : "m = ρ×V" },
        ]} />
    </div>);
}

/* 18. MOMENTUM — p = m × v */
function MomentumCalc() {
    const [m, setM] = useState(10);
    const [v, setV] = useState(5);
    const p = m * v;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.001} max={1000000} step={0.1} />
        <NumField label="🚀 VELOCITY" value={v} onChange={setV} unit="m/s" min={-10000} max={10000} step={0.1} />
        <ResultCard label="MOMENTUM" value={fmt(p)} unit="kg⋅m/s" extras={[
            { label: "IN N⋅s", value: `${fmt(p)} N⋅s` },
            { label: "KE", value: `${fmt(0.5 * m * v * v)} J` },
            { label: "FORMULA", value: "p = m × v" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Momentum — Common Examples</h3>
            <table className="calc-table"><thead><tr><th>Object</th><th>Mass</th><th>Speed</th><th>Momentum</th></tr></thead><tbody>
                {[{ n: "Baseball (pitched)", m: 0.145, v: 40 }, { n: "Football (kicked)", m: 0.41, v: 28 }, { n: "Person (running)", m: 75, v: 5 }, { n: "Car (city)", m: 1500, v: 13.4 }, { n: "Bowling ball", m: 6.35, v: 8 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{r.m} kg</td><td>{r.v} m/s</td><td>{fmt(r.m * r.v)} kg⋅m/s</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 19. NET FORCE — F_net = Σ forces (multiple forces) */
function NetForceCalc() {
    const [forces, setForces] = useState([{ mag: 50, angle: 0 }, { mag: 30, angle: 90 }]);
    const addForce = () => setForces([...forces, { mag: 0, angle: 0 }]);
    const removeForce = (i: number) => setForces(forces.filter((_, idx) => idx !== i));
    const updateForce = (i: number, key: "mag" | "angle", val: number) => {
        const nf = [...forces]; nf[i] = { ...nf[i], [key]: val }; setForces(nf);
    };
    const fx = forces.reduce((s, f) => s + f.mag * Math.cos(f.angle * Math.PI / 180), 0);
    const fy = forces.reduce((s, f) => s + f.mag * Math.sin(f.angle * Math.PI / 180), 0);
    const fnet = Math.sqrt(fx * fx + fy * fy);
    const dir = Math.atan2(fy, fx) * 180 / Math.PI;
    return (<div className="calc-card">
        <p className="calc-field__label">FORCES (magnitude & angle from horizontal)</p>
        {forces.map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "var(--s-2)", alignItems: "end", marginTop: "var(--s-2)" }}>
                <div className="calc-field"><label className="calc-field__label">Force {i + 1} (N)</label>
                    <input type="number" className="calc-field__input" value={f.mag} onChange={(e) => updateForce(i, "mag", Number(e.target.value))} /></div>
                <div className="calc-field"><label className="calc-field__label">Angle (°)</label>
                    <input type="number" className="calc-field__input" value={f.angle} onChange={(e) => updateForce(i, "angle", Number(e.target.value))} /></div>
                {forces.length > 1 && <button onClick={() => removeForce(i)} style={{ padding: "var(--s-2)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", background: "var(--n-surface)", cursor: "pointer" }}>✕</button>}
            </div>
        ))}
        <button onClick={addForce} style={{ marginTop: "var(--s-3)", padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: "1px solid var(--n-primary)", background: "var(--n-primary-light)", cursor: "pointer", fontSize: "var(--t-body-sm)" }}>+ Add Force</button>
        <ResultCard label="NET FORCE" value={fmt(fnet)} unit="N" extras={[
            { label: "DIRECTION", value: `${fmt(dir)}°` },
            { label: "Fx", value: `${fmt(fx)} N` },
            { label: "Fy", value: `${fmt(fy)} N` },
        ]} />
    </div>);
}

/* 20. NORMAL FORCE — F_n = mg cos(θ) */
function NormalForceCalc() {
    const [m, setM] = useState(50);
    const [theta, setTheta] = useState(0);
    const fn = m * G_ACCEL * Math.cos(theta * Math.PI / 180);
    const fp = m * G_ACCEL * Math.sin(theta * Math.PI / 180);
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.001} max={100000} step={0.1} />
        <NumField label="📐 INCLINE ANGLE" value={theta} onChange={setTheta} unit="°" min={0} max={90} step={0.1} />
        <ResultCard label="NORMAL FORCE" value={fmt(fn)} unit="N" extras={[
            { label: "WEIGHT", value: `${fmt(m * G_ACCEL)} N` },
            { label: "PARALLEL FORCE", value: `${fmt(fp)} N` },
            { label: "FORMULA", value: "Fn = mg cos(θ)" },
        ]} />
    </div>);
}

/* 21. SPECIFIC HEAT — Q = mcΔT */
function SpecificHeatCalc() {
    const [m, setM] = useState(1);
    const [c, setC] = useState(4186);
    const [dt, setDt] = useState(25);
    const Q = m * c * dt;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.001} max={100000} step={0.1} />
        <NumField label="🔬 SPECIFIC HEAT CAPACITY" value={c} onChange={setC} unit="J/(kg⋅°C)" min={1} max={10000} step={1} />
        <NumField label="🌡️ TEMPERATURE CHANGE" value={dt} onChange={setDt} unit="°C" min={-1000} max={1000} step={0.1} />
        <ResultCard label="HEAT ENERGY" value={Q > 1e6 ? fmtSci(Q) : fmt(Q, 0)} unit="J" extras={[
            { label: "IN kJ", value: `${fmt(Q / 1000)} kJ` },
            { label: "IN BTU", value: `${fmt(Q / 1055.06)} BTU` },
            { label: "FORMULA", value: "Q = mcΔT" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Specific Heat Capacities of Common Materials</h3>
            <table className="calc-table"><thead><tr><th>Material</th><th>c (J/kg⋅°C)</th></tr></thead><tbody>
                {[{ n: "Water", c: 4186 }, { n: "Ice", c: 2090 }, { n: "Steam", c: 2010 }, { n: "Aluminum", c: 897 }, { n: "Copper", c: 385 }, { n: "Iron/Steel", c: 449 }, { n: "Glass", c: 840 }, { n: "Air", c: 1005 }].map((r) => (
                    <tr key={r.n} style={r.c === c ? { background: "var(--n-primary-light)" } : {}}><td>{r.n}</td><td>{fmt(r.c, 0)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 22. SPEED — speed = distance / time */
function SpeedCalc() {
    const [d, setD] = useState(100);
    const [t, setT] = useState(10);
    const s = t > 0 ? d / t : 0;
    return (<div className="calc-card">
        <NumField label="📏 DISTANCE" value={d} onChange={setD} unit="m" min={0} max={1e9} step={1} />
        <NumField label="🕐 TIME" value={t} onChange={setT} unit="s" min={0.001} max={1e9} step={0.1} />
        <ResultCard label="SPEED" value={fmt(s)} unit="m/s" extras={[
            { label: "IN km/h", value: `${fmt(s * 3.6)} km/h` },
            { label: "IN mph", value: `${fmt(s * 2.23694)} mph` },
            { label: "FORMULA", value: "v = d / t" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Speed — Reference Table</h3>
            <table className="calc-table"><thead><tr><th>Speed</th><th>m/s</th><th>km/h</th><th>mph</th></tr></thead><tbody>
                {[{ n: "Walking", v: 1.4 }, { n: "Running", v: 5 }, { n: "Cycling", v: 8.3 }, { n: "Car (city)", v: 13.9 }, { n: "Car (highway)", v: 31.3 }, { n: "Bullet train", v: 83.3 }, { n: "Sound (air)", v: 343 }, { n: "Light", v: 3e8 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{fmt(r.v)}</td><td>{fmt(r.v * 3.6)}</td><td>{fmt(r.v * 2.23694)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 23. SPRING CONSTANT — k = F / x */
function SpringConstantCalc() {
    const [F, setF] = useState(50);
    const [x, setX] = useState(0.1);
    const k = x !== 0 ? Math.abs(F / x) : 0;
    return (<div className="calc-card">
        <NumField label="💪 APPLIED FORCE" value={F} onChange={setF} unit="N" max={100000} step={0.1} />
        <NumField label="📏 DISPLACEMENT" value={x} onChange={setX} unit="m" min={0.001} max={100} step={0.001} />
        <ResultCard label="SPRING CONSTANT" value={fmt(k)} unit="N/m" extras={[
            { label: "IN lbf/in", value: `${fmt(k * 0.00571015)} lbf/in` },
            { label: "PE STORED", value: `${fmt(0.5 * k * x * x)} J` },
            { label: "FORMULA", value: "k = F / x" },
        ]} />
    </div>);
}

/* 24. TERMINAL VELOCITY — v_t = √(2mg / (ρAC_d)) */
function TerminalVelocityCalc() {
    const [m, setM] = useState(75);
    const [cd, setCd] = useState(1.0);
    const [A, setA] = useState(0.7);
    const [rho, setRho] = useState(1.225);
    const vt = (rho * A * cd > 0) ? Math.sqrt((2 * m * G_ACCEL) / (rho * A * cd)) : 0;
    return (<div className="calc-card">
        <NumField label="⚖️ MASS" value={m} onChange={setM} unit="kg" min={0.001} max={100000} step={0.1} />
        <NumField label="💨 DRAG COEFFICIENT" value={cd} onChange={setCd} unit="Cd" min={0.01} max={5} step={0.01} />
        <NumField label="📐 CROSS-SECTIONAL AREA" value={A} onChange={setA} unit="m²" min={0.001} max={1000} step={0.01} />
        <NumField label="🌬️ AIR DENSITY" value={rho} onChange={setRho} unit="kg/m³" min={0.1} max={2} step={0.001} />
        <ResultCard label="TERMINAL VELOCITY" value={fmt(vt)} unit="m/s" extras={[
            { label: "IN km/h", value: `${fmt(vt * 3.6)} km/h` },
            { label: "IN mph", value: `${fmt(vt * 2.23694)} mph` },
            { label: "FORMULA", value: "vt = √(2mg/ρACd)" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Terminal Velocity — Examples</h3>
            <table className="calc-table"><thead><tr><th>Object</th><th>vt (m/s)</th><th>vt (mph)</th></tr></thead><tbody>
                {[{ n: "Skydiver (belly)", v: 55 }, { n: "Skydiver (head-down)", v: 90 }, { n: "Tennis ball", v: 31 }, { n: "Baseball", v: 42 }, { n: "Golf ball", v: 70 }, { n: "Raindrop", v: 9 }].map((r) => (
                    <tr key={r.n}><td>{r.n}</td><td>{fmt(r.v)}</td><td>{fmt(r.v * 2.23694)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 25. VELOCITY — v = v₀ + at */
function VelocityCalc() {
    const [v0, setV0] = useState(0);
    const [a, setA] = useState(9.81);
    const [t, setT] = useState(5);
    const v = v0 + a * t;
    const s = v0 * t + 0.5 * a * t * t;
    return (<div className="calc-card">
        <NumField label="🚀 INITIAL VELOCITY" value={v0} onChange={setV0} unit="m/s" min={-10000} max={10000} step={0.1} />
        <NumField label="📈 ACCELERATION" value={a} onChange={setA} unit="m/s²" min={-1000} max={1000} step={0.01} />
        <NumField label="🕐 TIME" value={t} onChange={setT} unit="s" min={0} max={10000} step={0.1} />
        <ResultCard label="FINAL VELOCITY" value={fmt(v)} unit="m/s" extras={[
            { label: "IN km/h", value: `${fmt(v * 3.6)} km/h` },
            { label: "DISPLACEMENT", value: `${fmt(s)} m` },
            { label: "FORMULA", value: "v = v₀ + at" },
        ]} />
    </div>);
}

/* 26. WAVELENGTH — λ = v / f */
function WavelengthCalc() {
    const [v, setV] = useState(343);
    const [f, setF] = useState(440);
    const wl = f > 0 ? v / f : 0;
    return (<div className="calc-card">
        <NumField label="🚀 WAVE SPEED" value={v} onChange={setV} unit="m/s" max={300000000} step={1} />
        <NumField label="🔊 FREQUENCY" value={f} onChange={setF} unit="Hz" min={0.001} max={1e15} step={1} />
        <ResultCard label="WAVELENGTH" value={wl > 0.001 ? fmt(wl) : fmtSci(wl)} unit="m" extras={[
            { label: "IN cm", value: `${fmt(wl * 100)} cm` },
            { label: "PERIOD", value: `${fmtSci(1 / f)} s` },
            { label: "FORMULA", value: "λ = v / f" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Wavelength — Examples (Sound in Air at 343 m/s)</h3>
            <table className="calc-table"><thead><tr><th>Note / Sound</th><th>Frequency</th><th>Wavelength</th></tr></thead><tbody>
                {[{ n: "Bass (low)", f: 60 }, { n: "Middle C", f: 262 }, { n: "Concert A", f: 440 }, { n: "Soprano (high)", f: 1047 }, { n: "Whistle", f: 3000 }, { n: "Ultrasonic", f: 40000 }].map((r) => (
                    <tr key={r.n} style={r.f === f ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{r.n}</td><td>{fmt(r.f, 0)} Hz</td><td>{fmt(343 / r.f)} m</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* ─── Component Map ─── */
const CALC_MAP: Record<string, () => React.JSX.Element> = {
    "acceleration": AccelerationCalc,
    "angular-acceleration": AngularAccelerationCalc,
    "angular-velocity": AngularVelocityCalc,
    "average-velocity": AverageVelocityCalc,
    "centrifugal-force": CentrifugalForceCalc,
    "centripetal-force": CentripetalForceCalc,
    "coefficient-of-friction": CoefficientOfFrictionCalc,
    "displacement": DisplacementCalc,
    "elastic-potential-energy": ElasticPECalc,
    "force": ForceCalc,
    "frequency": FrequencyCalc,
    "friction-force": FrictionForceCalc,
    "gravitational-force": GravitationalForceCalc,
    "gravitational-potential-energy": GravitationalPECalc,
    "kinetic-energy": KineticEnergyCalc,
    "magnitude-of-acceleration": MagnitudeOfAccelerationCalc,
    "mass": MassCalc,
    "momentum": MomentumCalc,
    "net-force": NetForceCalc,
    "normal-force": NormalForceCalc,
    "specific-heat": SpecificHeatCalc,
    "speed": SpeedCalc,
    "spring-constant": SpringConstantCalc,
    "terminal-velocity": TerminalVelocityCalc,
    "velocity": VelocityCalc,
    "wavelength": WavelengthCalc,
};

export default function PhysicsCalculatorCore({ calcType }: { calcType: string }) {
    const Comp = CALC_MAP[calcType];
    if (!Comp) return <p>Calculator not found.</p>;
    return <Comp />;
}
