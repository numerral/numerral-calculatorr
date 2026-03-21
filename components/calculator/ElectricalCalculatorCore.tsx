"use client";
import { useState } from "react";

/* ─── Shared helpers ─── */
const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—");
const SQRT3 = Math.sqrt(3);

type CircuitType = "dc" | "ac-1p" | "ac-3p";

function CircuitSelector({ value, onChange }: { value: CircuitType; onChange: (v: CircuitType) => void }) {
    const opts: { key: CircuitType; label: string }[] = [
        { key: "dc", label: "DC" },
        { key: "ac-1p", label: "Single-Phase AC" },
        { key: "ac-3p", label: "Three-Phase AC" },
    ];
    return (
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
            <label className="calc-field__label">CIRCUIT TYPE</label>
            <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                {opts.map((o) => (
                    <button key={o.key} onClick={() => onChange(o.key)}
                        style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: value === o.key ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: value === o.key ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: value === o.key ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

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
   1. AMPS TO WATTS
   P = I × V  (DC)
   P = I × V × PF  (AC 1-phase)
   P = I × V × PF × √3  (AC 3-phase)
   ═══════════════════════════════════════════════════════════════ */
function AmpsToWattsCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [amps, setAmps] = useState(15);
    const [volts, setVolts] = useState(120);
    const [pf, setPf] = useState(1);

    const watts = circuit === "dc" ? amps * volts
        : circuit === "ac-1p" ? amps * volts * pf
        : amps * volts * pf * SQRT3;

    const tableAmps = [1, 2, 5, 10, 15, 20, 30, 40, 50, 60, 80, 100];

    return (
        <div className="calc-card">
            <CircuitSelector value={circuit} onChange={setCircuit} />
            <NumField label="⚡ CURRENT (AMPS)" value={amps} onChange={setAmps} unit="A" max={500} step={0.5} />
            <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
            {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}

            <ResultCard label="POWER" value={fmt(watts)} unit="W"
                extras={[
                    { label: "KILOWATTS", value: `${fmt(watts / 1000, 3)} kW` },
                    { label: "CIRCUIT TYPE", value: circuit === "dc" ? "DC" : circuit === "ac-1p" ? "AC 1Φ" : "AC 3Φ" },
                    { label: "FORMULA", value: circuit === "dc" ? "P = I × V" : circuit === "ac-1p" ? "P = I × V × PF" : "P = I × V × PF × √3" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Amps to Watts — Conversion Table</h3>
                <table className="calc-table">
                    <thead><tr><th>Amps</th><th>120V AC</th><th>240V AC</th><th>12V DC</th></tr></thead>
                    <tbody>
                        {tableAmps.map((a) => (
                            <tr key={a} style={a === amps ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{a} A</td>
                                <td>{fmt(a * 120)} W</td>
                                <td>{fmt(a * 240)} W</td>
                                <td>{fmt(a * 12)} W</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   2. WATTS TO AMPS
   I = P / V  (DC)
   I = P / (V × PF)  (AC 1-phase)
   I = P / (V × PF × √3)  (AC 3-phase)
   ═══════════════════════════════════════════════════════════════ */
function WattsToAmpsCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [watts, setWatts] = useState(1800);
    const [volts, setVolts] = useState(120);
    const [pf, setPf] = useState(1);

    const amps = circuit === "dc" ? watts / volts
        : circuit === "ac-1p" ? watts / (volts * pf)
        : watts / (volts * pf * SQRT3);

    const tableWatts = [100, 200, 500, 750, 1000, 1500, 1800, 2000, 3000, 4000, 5000, 10000];

    return (
        <div className="calc-card">
            <CircuitSelector value={circuit} onChange={setCircuit} />
            <NumField label="💡 POWER (WATTS)" value={watts} onChange={setWatts} unit="W" max={50000} step={10} />
            <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
            {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}

            <ResultCard label="CURRENT" value={fmt(amps)} unit="A"
                extras={[
                    { label: "MILLIAMPS", value: `${fmt(amps * 1000, 0)} mA` },
                    { label: "CIRCUIT TYPE", value: circuit === "dc" ? "DC" : circuit === "ac-1p" ? "AC 1Φ" : "AC 3Φ" },
                    { label: "FORMULA", value: circuit === "dc" ? "I = P / V" : circuit === "ac-1p" ? "I = P / (V×PF)" : "I = P / (V×PF×√3)" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Watts to Amps — Conversion Table</h3>
                <table className="calc-table">
                    <thead><tr><th>Watts</th><th>120V AC</th><th>240V AC</th><th>12V DC</th></tr></thead>
                    <tbody>
                        {tableWatts.map((w) => (
                            <tr key={w} style={w === watts ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{fmt(w, 0)} W</td>
                                <td>{fmt(w / 120)} A</td>
                                <td>{fmt(w / 240)} A</td>
                                <td>{fmt(w / 12)} A</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   3. VOLTS TO WATTS
   P = V × I  (DC)
   P = V × I × PF  (AC 1-phase)
   P = V × I × PF × √3  (AC 3-phase)
   ═══════════════════════════════════════════════════════════════ */
function VoltsToWattsCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [volts, setVolts] = useState(120);
    const [amps, setAmps] = useState(15);
    const [pf, setPf] = useState(1);

    const watts = circuit === "dc" ? volts * amps
        : circuit === "ac-1p" ? volts * amps * pf
        : volts * amps * pf * SQRT3;

    return (
        <div className="calc-card">
            <CircuitSelector value={circuit} onChange={setCircuit} />
            <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
            <NumField label="⚡ CURRENT (AMPS)" value={amps} onChange={setAmps} unit="A" max={500} step={0.5} />
            {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}

            <ResultCard label="POWER" value={fmt(watts)} unit="W"
                extras={[
                    { label: "KILOWATTS", value: `${fmt(watts / 1000, 3)} kW` },
                    { label: "CIRCUIT TYPE", value: circuit === "dc" ? "DC" : circuit === "ac-1p" ? "AC 1Φ" : "AC 3Φ" },
                    { label: "FORMULA", value: circuit === "dc" ? "P = V × I" : circuit === "ac-1p" ? "P = V × I × PF" : "P = V × I × PF × √3" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Volts to Watts — Common Conversions</h3>
                <table className="calc-table">
                    <thead><tr><th>Voltage</th><th>5 A</th><th>10 A</th><th>15 A</th><th>20 A</th></tr></thead>
                    <tbody>
                        {[12, 24, 48, 110, 120, 208, 220, 240, 277, 480].map((v) => (
                            <tr key={v} style={v === volts ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{v} V</td>
                                <td>{fmt(v * 5, 0)} W</td>
                                <td>{fmt(v * 10, 0)} W</td>
                                <td>{fmt(v * 15, 0)} W</td>
                                <td>{fmt(v * 20, 0)} W</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   4. WATTS TO VOLTS
   V = P / I  (DC)
   V = P / (I × PF)  (AC 1-phase)
   V = P / (I × PF × √3)  (AC 3-phase)
   ═══════════════════════════════════════════════════════════════ */
function WattsToVoltsCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [watts, setWatts] = useState(1800);
    const [amps, setAmps] = useState(15);
    const [pf, setPf] = useState(1);

    const volts = circuit === "dc" ? watts / amps
        : circuit === "ac-1p" ? watts / (amps * pf)
        : watts / (amps * pf * SQRT3);

    return (
        <div className="calc-card">
            <CircuitSelector value={circuit} onChange={setCircuit} />
            <NumField label="💡 POWER (WATTS)" value={watts} onChange={setWatts} unit="W" max={50000} step={10} />
            <NumField label="⚡ CURRENT (AMPS)" value={amps} onChange={setAmps} unit="A" max={500} step={0.5} />
            {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}

            <ResultCard label="VOLTAGE" value={fmt(volts)} unit="V"
                extras={[
                    { label: "KILOVOLTS", value: `${fmt(volts / 1000, 4)} kV` },
                    { label: "CIRCUIT TYPE", value: circuit === "dc" ? "DC" : circuit === "ac-1p" ? "AC 1Φ" : "AC 3Φ" },
                    { label: "FORMULA", value: circuit === "dc" ? "V = P / I" : circuit === "ac-1p" ? "V = P / (I×PF)" : "V = P / (I×PF×√3)" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Watts to Volts — Reference Table</h3>
                <table className="calc-table">
                    <thead><tr><th>Watts</th><th>At 5A</th><th>At 10A</th><th>At 15A</th><th>At 20A</th></tr></thead>
                    <tbody>
                        {[60, 100, 200, 500, 1000, 1500, 1800, 2000, 3600, 5000].map((w) => (
                            <tr key={w} style={w === watts ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{fmt(w, 0)} W</td>
                                <td>{fmt(w / 5)} V</td>
                                <td>{fmt(w / 10)} V</td>
                                <td>{fmt(w / 15)} V</td>
                                <td>{fmt(w / 20)} V</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   5. AMPS TO VOLTS  (requires resistance OR power)
   V = I × R  (Ohm's Law DC)
   V = P / I  (using power)
   V = P / (I × PF)  (AC 1-phase)
   ═══════════════════════════════════════════════════════════════ */
function AmpsToVoltsCalc() {
    const [method, setMethod] = useState<"resistance" | "power">("resistance");
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [amps, setAmps] = useState(15);
    const [resistance, setResistance] = useState(8);
    const [watts, setWatts] = useState(1800);
    const [pf, setPf] = useState(1);

    let volts: number;
    if (method === "resistance") {
        volts = amps * resistance;
    } else {
        volts = circuit === "dc" ? watts / amps
            : circuit === "ac-1p" ? watts / (amps * pf)
            : watts / (amps * pf * SQRT3);
    }

    return (
        <div className="calc-card">
            <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
                <label className="calc-field__label">CONVERSION METHOD</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    {(["resistance", "power"] as const).map((m) => (
                        <button key={m} onClick={() => setMethod(m)}
                            style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)", textTransform: "capitalize" }}>
                            {m === "resistance" ? "Using Resistance (Ω)" : "Using Power (W)"}
                        </button>
                    ))}
                </div>
            </div>
            {method === "power" && <CircuitSelector value={circuit} onChange={setCircuit} />}
            <NumField label="⚡ CURRENT (AMPS)" value={amps} onChange={setAmps} unit="A" max={500} step={0.5} />
            {method === "resistance"
                ? <NumField label="🔧 RESISTANCE" value={resistance} onChange={setResistance} unit="Ω" max={10000} step={0.5} />
                : <NumField label="💡 POWER (WATTS)" value={watts} onChange={setWatts} unit="W" max={50000} step={10} />
            }
            {method === "power" && circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}

            <ResultCard label="VOLTAGE" value={fmt(volts)} unit="V"
                extras={[
                    { label: "KILOVOLTS", value: `${fmt(volts / 1000, 4)} kV` },
                    { label: "METHOD", value: method === "resistance" ? "Ohm's Law" : "Watt's Law" },
                    { label: "FORMULA", value: method === "resistance" ? "V = I × R" : circuit === "dc" ? "V = P / I" : "V = P / (I×PF)" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Amps to Volts using Resistance — Reference Table</h3>
                <table className="calc-table">
                    <thead><tr><th>Amps</th><th>4 Ω</th><th>8 Ω</th><th>12 Ω</th><th>16 Ω</th></tr></thead>
                    <tbody>
                        {[1, 2, 5, 10, 15, 20, 30, 50].map((a) => (
                            <tr key={a} style={a === amps ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{a} A</td>
                                <td>{fmt(a * 4)} V</td>
                                <td>{fmt(a * 8)} V</td>
                                <td>{fmt(a * 12)} V</td>
                                <td>{fmt(a * 16)} V</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   6. VOLTS TO AMPS  (requires resistance OR power)
   I = V / R  (Ohm's Law DC)
   I = P / V  (using power)
   I = P / (V × PF)  (AC 1-phase)
   ═══════════════════════════════════════════════════════════════ */
function VoltsToAmpsCalc() {
    const [method, setMethod] = useState<"resistance" | "power">("resistance");
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [volts, setVolts] = useState(120);
    const [resistance, setResistance] = useState(8);
    const [watts, setWatts] = useState(1800);
    const [pf, setPf] = useState(1);

    let amps: number;
    if (method === "resistance") {
        amps = resistance > 0 ? volts / resistance : 0;
    } else {
        amps = circuit === "dc" ? (volts > 0 ? watts / volts : 0)
            : circuit === "ac-1p" ? (volts * pf > 0 ? watts / (volts * pf) : 0)
            : (volts * pf * SQRT3 > 0 ? watts / (volts * pf * SQRT3) : 0);
    }

    return (
        <div className="calc-card">
            <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
                <label className="calc-field__label">CONVERSION METHOD</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    {(["resistance", "power"] as const).map((m) => (
                        <button key={m} onClick={() => setMethod(m)}
                            style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: method === m ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: method === m ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: method === m ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)", textTransform: "capitalize" }}>
                            {m === "resistance" ? "Using Resistance (Ω)" : "Using Power (W)"}
                        </button>
                    ))}
                </div>
            </div>
            {method === "power" && <CircuitSelector value={circuit} onChange={setCircuit} />}
            <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
            {method === "resistance"
                ? <NumField label="🔧 RESISTANCE" value={resistance} onChange={setResistance} unit="Ω" max={10000} step={0.5} />
                : <NumField label="💡 POWER (WATTS)" value={watts} onChange={setWatts} unit="W" max={50000} step={10} />
            }
            {method === "power" && circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}

            <ResultCard label="CURRENT" value={fmt(amps)} unit="A"
                extras={[
                    { label: "MILLIAMPS", value: `${fmt(amps * 1000, 0)} mA` },
                    { label: "METHOD", value: method === "resistance" ? "Ohm's Law" : "Watt's Law" },
                    { label: "FORMULA", value: method === "resistance" ? "I = V / R" : circuit === "dc" ? "I = P / V" : "I = P / (V×PF)" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Volts to Amps using Resistance — Reference Table</h3>
                <table className="calc-table">
                    <thead><tr><th>Voltage</th><th>4 Ω</th><th>8 Ω</th><th>12 Ω</th><th>16 Ω</th></tr></thead>
                    <tbody>
                        {[12, 24, 48, 120, 208, 240, 277, 480].map((v) => (
                            <tr key={v} style={v === volts ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{v} V</td>
                                <td>{fmt(v / 4)} A</td>
                                <td>{fmt(v / 8)} A</td>
                                <td>{fmt(v / 12)} A</td>
                                <td>{fmt(v / 16)} A</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   7. kVA TO AMPS
   I = (S × 1000) / V            (Single-phase)
   I = (S × 1000) / (V × √3)    (Three-phase)
   ═══════════════════════════════════════════════════════════════ */
function KvaToAmpsCalc() {
    const [phase, setPhase] = useState<"1p" | "3p">("1p");
    const [kva, setKva] = useState(25);
    const [volts, setVolts] = useState(220);

    const amps = phase === "1p"
        ? (volts > 0 ? (kva * 1000) / volts : 0)
        : (volts > 0 ? (kva * 1000) / (volts * SQRT3) : 0);

    const tableKva = [5, 10, 15, 20, 25, 30, 50, 75, 100, 150, 200, 250];

    return (
        <div className="calc-card">
            <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
                <label className="calc-field__label">PHASE TYPE</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    {([{ k: "1p" as const, l: "Single-Phase" }, { k: "3p" as const, l: "Three-Phase" }]).map((o) => (
                        <button key={o.k} onClick={() => setPhase(o.k)}
                            style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: phase === o.k ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: phase === o.k ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: phase === o.k ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                            {o.l}
                        </button>
                    ))}
                </div>
            </div>
            <NumField label="🔋 APPARENT POWER" value={kva} onChange={setKva} unit="kVA" max={500} step={0.5} />
            <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />

            <ResultCard label="CURRENT" value={fmt(amps)} unit="A"
                extras={[
                    { label: "PHASE", value: phase === "1p" ? "Single-Phase" : "Three-Phase" },
                    { label: "FORMULA", value: phase === "1p" ? "I = (kVA×1000)/V" : "I = (kVA×1000)/(V×√3)" },
                    { label: "kVA INPUT", value: `${kva} kVA` },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>kVA to Amps — Conversion Table ({phase === "1p" ? "Single-Phase" : "Three-Phase"})</h3>
                <table className="calc-table">
                    <thead><tr><th>kVA</th><th>120V</th><th>208V</th><th>220V</th><th>240V</th><th>480V</th></tr></thead>
                    <tbody>
                        {tableKva.map((s) => {
                            const calc = (v: number) => phase === "1p" ? (s * 1000) / v : (s * 1000) / (v * SQRT3);
                            return (
                                <tr key={s} style={s === kva ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{s} kVA</td>
                                    <td>{fmt(calc(120))} A</td>
                                    <td>{fmt(calc(208))} A</td>
                                    <td>{fmt(calc(220))} A</td>
                                    <td>{fmt(calc(240))} A</td>
                                    <td>{fmt(calc(480))} A</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   8. AMPS TO kVA
   S = (I × V) / 1000            (Single-phase)
   S = (I × V × √3) / 1000      (Three-phase)
   ═══════════════════════════════════════════════════════════════ */
function AmpsToKvaCalc() {
    const [phase, setPhase] = useState<"1p" | "3p">("1p");
    const [amps, setAmps] = useState(100);
    const [volts, setVolts] = useState(220);

    const kva = phase === "1p"
        ? (amps * volts) / 1000
        : (amps * volts * SQRT3) / 1000;

    const tableAmps = [10, 20, 30, 50, 80, 100, 125, 150, 200, 300, 400, 600];

    return (
        <div className="calc-card">
            <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
                <label className="calc-field__label">PHASE TYPE</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    {([{ k: "1p" as const, l: "Single-Phase" }, { k: "3p" as const, l: "Three-Phase" }]).map((o) => (
                        <button key={o.k} onClick={() => setPhase(o.k)}
                            style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: phase === o.k ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: phase === o.k ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: phase === o.k ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>
                            {o.l}
                        </button>
                    ))}
                </div>
            </div>
            <NumField label="⚡ CURRENT (AMPS)" value={amps} onChange={setAmps} unit="A" max={1000} step={1} />
            <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />

            <ResultCard label="APPARENT POWER" value={fmt(kva)} unit="kVA"
                extras={[
                    { label: "IN VA", value: `${fmt(kva * 1000, 0)} VA` },
                    { label: "PHASE", value: phase === "1p" ? "Single-Phase" : "Three-Phase" },
                    { label: "FORMULA", value: phase === "1p" ? "S = (I×V)/1000" : "S = (I×V×√3)/1000" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Amps to kVA — Conversion Table ({phase === "1p" ? "Single-Phase" : "Three-Phase"})</h3>
                <table className="calc-table">
                    <thead><tr><th>Amps</th><th>120V</th><th>208V</th><th>220V</th><th>240V</th><th>480V</th></tr></thead>
                    <tbody>
                        {tableAmps.map((a) => {
                            const calc = (v: number) => phase === "1p" ? (a * v) / 1000 : (a * v * SQRT3) / 1000;
                            return (
                                <tr key={a} style={a === amps ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{a} A</td>
                                    <td>{fmt(calc(120))} kVA</td>
                                    <td>{fmt(calc(208))} kVA</td>
                                    <td>{fmt(calc(220))} kVA</td>
                                    <td>{fmt(calc(240))} kVA</td>
                                    <td>{fmt(calc(480))} kVA</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   9. WATTS TO kWh
   E = (P × t) / 1000
   ═══════════════════════════════════════════════════════════════ */
function WattsToKwhCalc() {
    const [watts, setWatts] = useState(1500);
    const [hours, setHours] = useState(8);

    const kwh = (watts * hours) / 1000;
    const costPerKwh = 0.16; // US average ~$0.16/kWh
    const dailyCost = kwh * costPerKwh;

    const tableWatts = [60, 100, 150, 200, 500, 750, 1000, 1500, 2000, 3000, 5000, 10000];

    return (
        <div className="calc-card">
            <NumField label="💡 POWER (WATTS)" value={watts} onChange={setWatts} unit="W" max={50000} step={10} />
            <NumField label="🕐 TIME" value={hours} onChange={setHours} unit="hours" min={0.5} max={24} step={0.5} />

            <ResultCard label="ENERGY CONSUMED" value={fmt(kwh, 3)} unit="kWh"
                extras={[
                    { label: "KILOWATTS", value: `${fmt(watts / 1000, 3)} kW` },
                    { label: "EST. COST (US AVG)", value: `$${fmt(dailyCost)}` },
                    { label: "FORMULA", value: "E = (W × h) / 1000" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Watts to kWh — Daily Energy Usage</h3>
                <table className="calc-table">
                    <thead><tr><th>Device (Watts)</th><th>1 hr</th><th>4 hrs</th><th>8 hrs</th><th>24 hrs</th><th>Cost/Day</th></tr></thead>
                    <tbody>
                        {tableWatts.map((w) => (
                            <tr key={w} style={w === watts ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{fmt(w, 0)} W</td>
                                <td>{fmt((w * 1) / 1000, 3)} kWh</td>
                                <td>{fmt((w * 4) / 1000, 2)} kWh</td>
                                <td>{fmt((w * 8) / 1000, 2)} kWh</td>
                                <td>{fmt((w * 24) / 1000, 1)} kWh</td>
                                <td>${fmt((w * 24 / 1000) * costPerKwh)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="t-body-sm text-muted" style={{ marginTop: "var(--s-2)" }}>
                    * Cost estimated at US national average of $0.16/kWh (EIA, 2024). Actual rates vary by state.
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   10. kWh TO WATTS
   P = (E × 1000) / t
   ═══════════════════════════════════════════════════════════════ */
function KwhToWattsCalc() {
    const [kwh, setKwh] = useState(12);
    const [hours, setHours] = useState(8);

    const watts = hours > 0 ? (kwh * 1000) / hours : 0;
    const costPerKwh = 0.16;
    const cost = kwh * costPerKwh;

    const tableKwh = [0.5, 1, 2, 3, 5, 8, 10, 12, 15, 20, 30, 50];

    return (
        <div className="calc-card">
            <NumField label="🔋 ENERGY" value={kwh} onChange={setKwh} unit="kWh" min={0.1} max={500} step={0.1} />
            <NumField label="🕐 TIME" value={hours} onChange={setHours} unit="hours" min={0.5} max={24} step={0.5} />

            <ResultCard label="POWER" value={fmt(watts)} unit="W"
                extras={[
                    { label: "KILOWATTS", value: `${fmt(watts / 1000, 3)} kW` },
                    { label: "EST. COST (US AVG)", value: `$${fmt(cost)}` },
                    { label: "FORMULA", value: "P = (kWh×1000)/h" },
                ]} />

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>kWh to Watts — Reference Table</h3>
                <table className="calc-table">
                    <thead><tr><th>kWh</th><th>1 hr</th><th>4 hrs</th><th>8 hrs</th><th>24 hrs</th></tr></thead>
                    <tbody>
                        {tableKwh.map((e) => (
                            <tr key={e} style={e === kwh ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{e} kWh</td>
                                <td>{fmt((e * 1000) / 1, 0)} W</td>
                                <td>{fmt((e * 1000) / 4, 0)} W</td>
                                <td>{fmt((e * 1000) / 8, 0)} W</td>
                                <td>{fmt((e * 1000) / 24, 0)} W</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="t-body-sm text-muted" style={{ marginTop: "var(--s-2)" }}>
                    * Cost estimated at US national average of $0.16/kWh (EIA, 2024). Actual rates vary by state.
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   11. kW TO AMPS — I = (kW×1000)/V (DC), I = (kW×1000)/(V×PF) (AC1p), I = (kW×1000)/(V×PF×√3) (AC3p)
   ═══════════════════════════════════════════════════════════════ */
function KwToAmpsCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [kw, setKw] = useState(5);
    const [volts, setVolts] = useState(240);
    const [pf, setPf] = useState(0.85);
    const amps = circuit === "dc" ? (volts > 0 ? (kw * 1000) / volts : 0)
        : circuit === "ac-1p" ? (volts * pf > 0 ? (kw * 1000) / (volts * pf) : 0)
        : (volts * pf * SQRT3 > 0 ? (kw * 1000) / (volts * pf * SQRT3) : 0);
    return (<div className="calc-card">
        <CircuitSelector value={circuit} onChange={setCircuit} />
        <NumField label="⚡ POWER" value={kw} onChange={setKw} unit="kW" max={500} step={0.5} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}
        <ResultCard label="CURRENT" value={fmt(amps)} unit="A" extras={[
            { label: "KILOWATTS", value: `${kw} kW` },
            { label: "CIRCUIT", value: circuit === "dc" ? "DC" : circuit === "ac-1p" ? "AC 1Φ" : "AC 3Φ" },
            { label: "FORMULA", value: circuit === "dc" ? "I=(kW×1000)/V" : circuit === "ac-1p" ? "I=(kW×1000)/(V×PF)" : "I=(kW×1000)/(V×PF×√3)" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>kW to Amps — Reference Table</h3>
            <table className="calc-table"><thead><tr><th>kW</th><th>120V</th><th>208V</th><th>240V</th><th>480V</th></tr></thead><tbody>
                {[1, 2, 3, 5, 7.5, 10, 15, 20, 25, 50].map((k) => (
                    <tr key={k} style={k === kw ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{k} kW</td><td>{fmt((k * 1000) / 120)} A</td><td>{fmt((k * 1000) / 208)} A</td>
                        <td>{fmt((k * 1000) / 240)} A</td><td>{fmt((k * 1000) / 480)} A</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 12. kW TO kVA — S = kW / PF */
function KwToKvaCalc() {
    const [kw, setKw] = useState(10);
    const [pf, setPf] = useState(0.85);
    const kva = pf > 0 ? kw / pf : 0;
    return (<div className="calc-card">
        <NumField label="⚡ REAL POWER" value={kw} onChange={setKw} unit="kW" max={500} step={0.5} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <ResultCard label="APPARENT POWER" value={fmt(kva)} unit="kVA" extras={[
            { label: "IN VA", value: `${fmt(kva * 1000, 0)} VA` }, { label: "FORMULA", value: "kVA = kW / PF" },
            { label: "REACTIVE (kVAR)", value: `${fmt(Math.sqrt(kva * kva - kw * kw))} kVAR` },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>kW to kVA — Reference Table</h3>
            <table className="calc-table"><thead><tr><th>kW</th><th>PF 0.7</th><th>PF 0.8</th><th>PF 0.85</th><th>PF 0.9</th><th>PF 1.0</th></tr></thead><tbody>
                {[5, 10, 15, 20, 25, 50, 75, 100, 150, 200].map((k) => (
                    <tr key={k} style={k === kw ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{k} kW</td><td>{fmt(k / 0.7)}</td><td>{fmt(k / 0.8)}</td><td>{fmt(k / 0.85)}</td>
                        <td>{fmt(k / 0.9)}</td><td>{fmt(k / 1)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 13. kW TO kWh — E = kW × h */
function KwToKwhCalc() {
    const [kw, setKw] = useState(3);
    const [hours, setHours] = useState(8);
    const kwh = kw * hours;
    const cost = kwh * 0.16;
    return (<div className="calc-card">
        <NumField label="⚡ POWER" value={kw} onChange={setKw} unit="kW" max={100} step={0.1} />
        <NumField label="🕐 TIME" value={hours} onChange={setHours} unit="hours" min={0.5} max={24} step={0.5} />
        <ResultCard label="ENERGY" value={fmt(kwh, 2)} unit="kWh" extras={[
            { label: "MONTHLY", value: `${fmt(kwh * 30)} kWh` }, { label: "EST. DAILY COST", value: `$${fmt(cost)}` },
            { label: "FORMULA", value: "kWh = kW × h" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>kW to kWh — Usage Table</h3>
            <table className="calc-table"><thead><tr><th>kW</th><th>1 hr</th><th>4 hrs</th><th>8 hrs</th><th>24 hrs</th><th>Cost/Day</th></tr></thead><tbody>
                {[0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20].map((k) => (
                    <tr key={k} style={k === kw ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{k} kW</td><td>{fmt(k * 1, 1)}</td><td>{fmt(k * 4, 1)}</td><td>{fmt(k * 8)}</td>
                        <td>{fmt(k * 24)}</td><td>${fmt(k * 24 * 0.16)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 14. kW TO VA — VA = kW × 1000 / PF */
function KwToVaCalc() {
    const [kw, setKw] = useState(5);
    const [pf, setPf] = useState(0.85);
    const va = pf > 0 ? (kw * 1000) / pf : 0;
    return (<div className="calc-card">
        <NumField label="⚡ REAL POWER" value={kw} onChange={setKw} unit="kW" max={100} step={0.1} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <ResultCard label="APPARENT POWER" value={fmt(va, 0)} unit="VA" extras={[
            { label: "IN kVA", value: `${fmt(va / 1000)} kVA` }, { label: "FORMULA", value: "VA = (kW×1000)/PF" },
            { label: "POWER FACTOR", value: `${pf}` },
        ]} />
    </div>);
}

/* 15. kWh TO kW — P = kWh / h */
function KwhToKwCalc() {
    const [kwh, setKwh] = useState(24);
    const [hours, setHours] = useState(8);
    const kw = hours > 0 ? kwh / hours : 0;
    return (<div className="calc-card">
        <NumField label="🔋 ENERGY" value={kwh} onChange={setKwh} unit="kWh" min={0.1} max={1000} step={0.5} />
        <NumField label="🕐 TIME" value={hours} onChange={setHours} unit="hours" min={0.5} max={24} step={0.5} />
        <ResultCard label="POWER" value={fmt(kw, 2)} unit="kW" extras={[
            { label: "IN WATTS", value: `${fmt(kw * 1000, 0)} W` }, { label: "FORMULA", value: "kW = kWh / h" },
            { label: "EST. COST", value: `$${fmt(kwh * 0.16)}` },
        ]} />
    </div>);
}

/* 16. kVA TO HP — HP = kVA × PF / 0.746 */
function KvaToHpCalc() {
    const [kva, setKva] = useState(25);
    const [pf, setPf] = useState(0.85);
    const [eff, setEff] = useState(0.9);
    const hp = eff > 0 ? (kva * pf) / (0.746 / eff) : 0;
    return (<div className="calc-card">
        <NumField label="🔋 APPARENT POWER" value={kva} onChange={setKva} unit="kVA" max={500} step={0.5} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <NumField label="⚙️ MOTOR EFFICIENCY" value={eff} onChange={setEff} unit="" min={0.5} max={1} step={0.01} />
        <ResultCard label="MECHANICAL POWER" value={fmt(hp)} unit="HP" extras={[
            { label: "REAL kW", value: `${fmt(kva * pf)} kW` }, { label: "FORMULA", value: "HP=(kVA×PF×Eff)/0.746" },
            { label: "1 HP", value: "= 746 watts" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>kVA to HP — Reference Table (PF=0.85, Eff=90%)</h3>
            <table className="calc-table"><thead><tr><th>kVA</th><th>HP</th><th>kW</th></tr></thead><tbody>
                {[5, 10, 15, 20, 25, 30, 50, 75, 100, 150, 200].map((s) => (
                    <tr key={s} style={s === kva ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{s} kVA</td><td>{fmt((s * 0.85 * 0.9) / 0.746)} HP</td><td>{fmt(s * 0.85)} kW</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 17. kVA TO kW — kW = kVA × PF */
function KvaToKwCalc() {
    const [kva, setKva] = useState(25);
    const [pf, setPf] = useState(0.85);
    const kw = kva * pf;
    return (<div className="calc-card">
        <NumField label="🔋 APPARENT POWER" value={kva} onChange={setKva} unit="kVA" max={500} step={0.5} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <ResultCard label="REAL POWER" value={fmt(kw)} unit="kW" extras={[
            { label: "IN WATTS", value: `${fmt(kw * 1000, 0)} W` }, { label: "FORMULA", value: "kW = kVA × PF" },
            { label: "REACTIVE", value: `${fmt(Math.sqrt(kva * kva - kw * kw))} kVAR` },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>kVA to kW — Reference Table</h3>
            <table className="calc-table"><thead><tr><th>kVA</th><th>PF 0.7</th><th>PF 0.8</th><th>PF 0.85</th><th>PF 0.9</th><th>PF 1.0</th></tr></thead><tbody>
                {[5, 10, 15, 20, 25, 50, 75, 100, 150, 200].map((s) => (
                    <tr key={s} style={s === kva ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{s} kVA</td><td>{fmt(s * 0.7)}</td><td>{fmt(s * 0.8)}</td><td>{fmt(s * 0.85)}</td>
                        <td>{fmt(s * 0.9)}</td><td>{fmt(s * 1)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 18. kVA TO VA — VA = kVA × 1000 */
function KvaToVaCalc() {
    const [kva, setKva] = useState(25);
    const va = kva * 1000;
    return (<div className="calc-card">
        <NumField label="🔋 APPARENT POWER" value={kva} onChange={setKva} unit="kVA" max={500} step={0.5} />
        <ResultCard label="VOLT-AMPS" value={fmt(va, 0)} unit="VA" extras={[
            { label: "FORMULA", value: "VA = kVA × 1,000" }, { label: "MEGAVOLT-AMPS", value: `${fmt(kva / 1000, 4)} MVA` },
        ]} />
    </div>);
}

/* 19. kVA TO WATTS — W = kVA × PF × 1000 */
function KvaToWattsCalc() {
    const [kva, setKva] = useState(25);
    const [pf, setPf] = useState(0.85);
    const watts = kva * pf * 1000;
    return (<div className="calc-card">
        <NumField label="🔋 APPARENT POWER" value={kva} onChange={setKva} unit="kVA" max={500} step={0.5} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <ResultCard label="REAL POWER" value={fmt(watts, 0)} unit="W" extras={[
            { label: "IN kW", value: `${fmt(watts / 1000)} kW` }, { label: "FORMULA", value: "W = kVA × PF × 1000" },
        ]} />
    </div>);
}

/* 20. Ah TO kWh — kWh = Ah × V / 1000 */
function AhToKwhCalc() {
    const [ah, setAh] = useState(100);
    const [volts, setVolts] = useState(12);
    const kwh = (ah * volts) / 1000;
    return (<div className="calc-card">
        <NumField label="🔋 CAPACITY" value={ah} onChange={setAh} unit="Ah" max={1000} step={1} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        <ResultCard label="ENERGY" value={fmt(kwh, 3)} unit="kWh" extras={[
            { label: "IN Wh", value: `${fmt(ah * volts)} Wh` }, { label: "FORMULA", value: "kWh = Ah × V / 1000" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Ah to kWh — Battery Table</h3>
            <table className="calc-table"><thead><tr><th>Ah</th><th>12V</th><th>24V</th><th>36V</th><th>48V</th></tr></thead><tbody>
                {[10, 20, 50, 100, 150, 200, 300, 400, 500].map((a) => (
                    <tr key={a} style={a === ah ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{a} Ah</td><td>{fmt((a * 12) / 1000, 2)} kWh</td><td>{fmt((a * 24) / 1000, 2)} kWh</td>
                        <td>{fmt((a * 36) / 1000, 2)} kWh</td><td>{fmt((a * 48) / 1000, 2)} kWh</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 21. Ah TO Wh — Wh = Ah × V */
function AhToWhCalc() {
    const [ah, setAh] = useState(100);
    const [volts, setVolts] = useState(12);
    const wh = ah * volts;
    return (<div className="calc-card">
        <NumField label="🔋 CAPACITY" value={ah} onChange={setAh} unit="Ah" max={1000} step={1} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        <ResultCard label="ENERGY" value={fmt(wh)} unit="Wh" extras={[
            { label: "IN kWh", value: `${fmt(wh / 1000, 3)} kWh` }, { label: "FORMULA", value: "Wh = Ah × V" },
        ]} />
    </div>);
}

/* 22. Wh TO Ah — Ah = Wh / V */
function WhToAhCalc() {
    const [wh, setWh] = useState(1200);
    const [volts, setVolts] = useState(12);
    const ah = volts > 0 ? wh / volts : 0;
    return (<div className="calc-card">
        <NumField label="🔋 ENERGY" value={wh} onChange={setWh} unit="Wh" max={50000} step={10} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        <ResultCard label="CAPACITY" value={fmt(ah)} unit="Ah" extras={[
            { label: "IN mAh", value: `${fmt(ah * 1000, 0)} mAh` }, { label: "FORMULA", value: "Ah = Wh / V" },
        ]} />
    </div>);
}

/* 23. Wh TO mAh — mAh = (Wh / V) × 1000 */
function WhToMahCalc() {
    const [wh, setWh] = useState(50);
    const [volts, setVolts] = useState(3.7);
    const mah = volts > 0 ? (wh / volts) * 1000 : 0;
    return (<div className="calc-card">
        <NumField label="🔋 ENERGY" value={wh} onChange={setWh} unit="Wh" max={500} step={0.1} />
        <NumField label="🔌 NOMINAL VOLTAGE" value={volts} onChange={setVolts} unit="V" min={1} max={48} step={0.1} />
        <ResultCard label="CAPACITY" value={fmt(mah, 0)} unit="mAh" extras={[
            { label: "IN Ah", value: `${fmt(mah / 1000, 2)} Ah` }, { label: "FORMULA", value: "mAh = (Wh/V) × 1000" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Wh to mAh — Battery Table (3.7V Li-ion)</h3>
            <table className="calc-table"><thead><tr><th>Wh</th><th>mAh (3.7V)</th><th>mAh (3.85V)</th><th>mAh (7.4V)</th></tr></thead><tbody>
                {[5, 10, 15, 20, 30, 40, 50, 75, 100].map((w) => (
                    <tr key={w} style={w === wh ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{w} Wh</td><td>{fmt((w / 3.7) * 1000, 0)}</td><td>{fmt((w / 3.85) * 1000, 0)}</td>
                        <td>{fmt((w / 7.4) * 1000, 0)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 24. mAh TO Wh — Wh = mAh × V / 1000 */
function MahToWhCalc() {
    const [mah, setMah] = useState(5000);
    const [volts, setVolts] = useState(3.7);
    const wh = (mah * volts) / 1000;
    return (<div className="calc-card">
        <NumField label="🔋 CAPACITY" value={mah} onChange={setMah} unit="mAh" max={100000} step={100} />
        <NumField label="🔌 NOMINAL VOLTAGE" value={volts} onChange={setVolts} unit="V" min={1} max={48} step={0.1} />
        <ResultCard label="ENERGY" value={fmt(wh, 2)} unit="Wh" extras={[
            { label: "IN kWh", value: `${fmt(wh / 1000, 4)} kWh` }, { label: "FORMULA", value: "Wh = mAh × V / 1000" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>mAh to Wh — Battery Table (3.7V Li-ion)</h3>
            <table className="calc-table"><thead><tr><th>mAh</th><th>Wh (3.7V)</th><th>Wh (3.85V)</th><th>Wh (7.4V)</th></tr></thead><tbody>
                {[1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 15000, 20000].map((m) => (
                    <tr key={m} style={m === mah ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{fmt(m, 0)}</td><td>{fmt((m * 3.7) / 1000, 1)}</td><td>{fmt((m * 3.85) / 1000, 1)}</td>
                        <td>{fmt((m * 7.4) / 1000, 1)}</td></tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}

/* 25. kWh TO Ah — Ah = (kWh × 1000) / V */
function KwhToAhCalc() {
    const [kwh, setKwh] = useState(5);
    const [volts, setVolts] = useState(12);
    const ah = volts > 0 ? (kwh * 1000) / volts : 0;
    return (<div className="calc-card">
        <NumField label="🔋 ENERGY" value={kwh} onChange={setKwh} unit="kWh" min={0.1} max={200} step={0.1} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        <ResultCard label="CAPACITY" value={fmt(ah)} unit="Ah" extras={[
            { label: "IN mAh", value: `${fmt(ah * 1000, 0)} mAh` }, { label: "FORMULA", value: "Ah = (kWh×1000)/V" },
        ]} />
    </div>);
}

/* 26. AMPS TO VA — VA = I × V (1p), VA = I × V × √3 (3p) */
function AmpsToVaCalc() {
    const [phase, setPhase] = useState<"1p" | "3p">("1p");
    const [amps, setAmps] = useState(15);
    const [volts, setVolts] = useState(120);
    const va = phase === "1p" ? amps * volts : amps * volts * SQRT3;
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}><label className="calc-field__label">PHASE TYPE</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>{([{ k: "1p" as const, l: "Single-Phase" }, { k: "3p" as const, l: "Three-Phase" }]).map((o) => (<button key={o.k} onClick={() => setPhase(o.k)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: phase === o.k ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: phase === o.k ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: phase === o.k ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>{o.l}</button>))}</div></div>
        <NumField label="⚡ CURRENT" value={amps} onChange={setAmps} unit="A" max={500} step={0.5} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        <ResultCard label="APPARENT POWER" value={fmt(va, 0)} unit="VA" extras={[
            { label: "IN kVA", value: `${fmt(va / 1000)} kVA` }, { label: "FORMULA", value: phase === "1p" ? "VA = I × V" : "VA = I × V × √3" },
        ]} />
    </div>);
}

/* 27. VA TO AMPS — I = VA / V (1p), I = VA / (V × √3) (3p) */
function VaToAmpsCalc() {
    const [phase, setPhase] = useState<"1p" | "3p">("1p");
    const [va, setVa] = useState(1800);
    const [volts, setVolts] = useState(120);
    const amps = phase === "1p" ? (volts > 0 ? va / volts : 0) : (volts > 0 ? va / (volts * SQRT3) : 0);
    return (<div className="calc-card">
        <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}><label className="calc-field__label">PHASE TYPE</label>
            <div style={{ display: "flex", gap: "var(--s-2)" }}>{([{ k: "1p" as const, l: "Single-Phase" }, { k: "3p" as const, l: "Three-Phase" }]).map((o) => (<button key={o.k} onClick={() => setPhase(o.k)} style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: phase === o.k ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: phase === o.k ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: phase === o.k ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)" }}>{o.l}</button>))}</div></div>
        <NumField label="🔋 APPARENT POWER" value={va} onChange={setVa} unit="VA" max={100000} step={100} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        <ResultCard label="CURRENT" value={fmt(amps)} unit="A" extras={[
            { label: "MILLIAMPS", value: `${fmt(amps * 1000, 0)} mA` }, { label: "FORMULA", value: phase === "1p" ? "I = VA / V" : "I = VA / (V×√3)" },
        ]} />
    </div>);
}

/* 28. VA TO kVA — kVA = VA / 1000 */
function VaToKvaCalc() {
    const [va, setVa] = useState(25000);
    const kva = va / 1000;
    return (<div className="calc-card">
        <NumField label="🔋 APPARENT POWER" value={va} onChange={setVa} unit="VA" max={1000000} step={100} />
        <ResultCard label="KILOVOLT-AMPS" value={fmt(kva)} unit="kVA" extras={[
            { label: "FORMULA", value: "kVA = VA / 1,000" }, { label: "IN MVA", value: `${fmt(kva / 1000, 4)} MVA` },
        ]} />
    </div>);
}

/* 29. VA TO kW — kW = VA × PF / 1000 */
function VaToKwCalc() {
    const [va, setVa] = useState(25000);
    const [pf, setPf] = useState(0.85);
    const kw = (va * pf) / 1000;
    return (<div className="calc-card">
        <NumField label="🔋 APPARENT POWER" value={va} onChange={setVa} unit="VA" max={1000000} step={100} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <ResultCard label="REAL POWER" value={fmt(kw)} unit="kW" extras={[
            { label: "IN WATTS", value: `${fmt(kw * 1000, 0)} W` }, { label: "FORMULA", value: "kW = (VA × PF)/1000" },
        ]} />
    </div>);
}

/* 30. AMPS TO HP — HP = (I × V × Eff × PF) / 746 */
function AmpsToHpCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("ac-1p");
    const [amps, setAmps] = useState(20);
    const [volts, setVolts] = useState(240);
    const [pf, setPf] = useState(0.85);
    const [eff, setEff] = useState(0.9);
    const watts = circuit === "dc" ? amps * volts : circuit === "ac-1p" ? amps * volts * pf : amps * volts * pf * SQRT3;
    const hp = (watts * eff) / 746;
    return (<div className="calc-card">
        <CircuitSelector value={circuit} onChange={setCircuit} />
        <NumField label="⚡ CURRENT" value={amps} onChange={setAmps} unit="A" max={500} step={0.5} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />}
        <NumField label="⚙️ MOTOR EFFICIENCY" value={eff} onChange={setEff} unit="" min={0.5} max={1} step={0.01} />
        <ResultCard label="HORSEPOWER" value={fmt(hp)} unit="HP" extras={[
            { label: "WATTS", value: `${fmt(watts, 0)} W` }, { label: "FORMULA", value: "HP=(I×V×PF×Eff)/746" },
            { label: "1 HP", value: "= 746 watts" },
        ]} />
    </div>);
}

/* 31. HP TO AMPS — I = (HP × 746) / (V × Eff × PF) */
function HpToAmpsCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("ac-1p");
    const [hp, setHp] = useState(5);
    const [volts, setVolts] = useState(240);
    const [pf, setPf] = useState(0.85);
    const [eff, setEff] = useState(0.9);
    const denom = circuit === "dc" ? volts * eff : circuit === "ac-1p" ? volts * eff * pf : volts * eff * pf * SQRT3;
    const amps = denom > 0 ? (hp * 746) / denom : 0;
    return (<div className="calc-card">
        <CircuitSelector value={circuit} onChange={setCircuit} />
        <NumField label="🏋️ HORSEPOWER" value={hp} onChange={setHp} unit="HP" max={500} step={0.5} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />}
        <NumField label="⚙️ MOTOR EFFICIENCY" value={eff} onChange={setEff} unit="" min={0.5} max={1} step={0.01} />
        <ResultCard label="CURRENT" value={fmt(amps)} unit="A" extras={[
            { label: "WATTS", value: `${fmt(hp * 746, 0)} W` }, { label: "FORMULA", value: "I=(HP×746)/(V×Eff×PF)" },
        ]} />
        <div style={{ marginTop: "var(--s-4)" }}>
            <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>HP to Amps — Reference (240V, PF=0.85, Eff=90%)</h3>
            <table className="calc-table"><thead><tr><th>HP</th><th>kW</th><th>Amps (1Φ)</th><th>Amps (3Φ)</th></tr></thead><tbody>
                {[0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 50].map((h) => {
                    const w = h * 746;
                    return (<tr key={h} style={h === hp ? { background: "var(--n-primary-light)" } : {}}>
                        <td>{h} HP</td><td>{fmt(w / 1000, 2)}</td>
                        <td>{fmt(w / (240 * 0.9 * 0.85))} A</td><td>{fmt(w / (240 * 0.9 * 0.85 * SQRT3))} A</td></tr>);
                })}
            </tbody></table>
        </div>
    </div>);
}

/* 32. HP TO kVA — kVA = (HP × 746) / (PF × 1000) */
function HpToKvaCalc() {
    const [hp, setHp] = useState(10);
    const [pf, setPf] = useState(0.85);
    const [eff, setEff] = useState(0.9);
    const kva = eff > 0 ? (hp * 746) / (pf * eff * 1000) : 0;
    return (<div className="calc-card">
        <NumField label="🏋️ HORSEPOWER" value={hp} onChange={setHp} unit="HP" max={500} step={0.5} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <NumField label="⚙️ MOTOR EFFICIENCY" value={eff} onChange={setEff} unit="" min={0.5} max={1} step={0.01} />
        <ResultCard label="APPARENT POWER" value={fmt(kva)} unit="kVA" extras={[
            { label: "WATTS", value: `${fmt(hp * 746, 0)} W` }, { label: "FORMULA", value: "kVA=(HP×746)/(PF×Eff×1000)" },
        ]} />
    </div>);
}

/* 33. VOLTS TO JOULES — J = V × Q (charge in coulombs) */
function VoltsToJoulesCalc() {
    const [volts, setVolts] = useState(12);
    const [coulombs, setCoulombs] = useState(10);
    const joules = volts * coulombs;
    return (<div className="calc-card">
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        <NumField label="⚡ CHARGE" value={coulombs} onChange={setCoulombs} unit="C" max={10000} step={0.1} />
        <ResultCard label="ENERGY" value={fmt(joules)} unit="J" extras={[
            { label: "IN kJ", value: `${fmt(joules / 1000, 3)} kJ` }, { label: "FORMULA", value: "J = V × C" },
            { label: "IN Wh", value: `${fmt(joules / 3600, 3)} Wh` },
        ]} />
    </div>);
}

/* 34. WATTS TO JOULES — J = W × s */
function WattsToJoulesCalc() {
    const [watts, setWatts] = useState(1000);
    const [seconds, setSeconds] = useState(60);
    const joules = watts * seconds;
    return (<div className="calc-card">
        <NumField label="💡 POWER" value={watts} onChange={setWatts} unit="W" max={50000} step={10} />
        <NumField label="🕐 TIME" value={seconds} onChange={setSeconds} unit="seconds" min={1} max={3600} step={1} />
        <ResultCard label="ENERGY" value={fmt(joules, 0)} unit="J" extras={[
            { label: "IN kJ", value: `${fmt(joules / 1000)} kJ` }, { label: "FORMULA", value: "J = W × s" },
            { label: "IN kWh", value: `${fmt(joules / 3600000, 4)} kWh` },
        ]} />
    </div>);
}

/* 35. JOULES TO VOLTS — V = J / C */
function JoulesToVoltsCalc() {
    const [joules, setJoules] = useState(120);
    const [coulombs, setCoulombs] = useState(10);
    const volts = coulombs > 0 ? joules / coulombs : 0;
    return (<div className="calc-card">
        <NumField label="⚡ ENERGY" value={joules} onChange={setJoules} unit="J" max={100000} step={1} />
        <NumField label="🔋 CHARGE" value={coulombs} onChange={setCoulombs} unit="C" max={10000} step={0.1} />
        <ResultCard label="VOLTAGE" value={fmt(volts)} unit="V" extras={[
            { label: "FORMULA", value: "V = J / C" }, { label: "ENERGY IN Wh", value: `${fmt(joules / 3600, 3)} Wh` },
        ]} />
    </div>);
}

/* 36. JOULES TO WATTS — W = J / s */
function JoulesToWattsCalc() {
    const [joules, setJoules] = useState(60000);
    const [seconds, setSeconds] = useState(60);
    const watts = seconds > 0 ? joules / seconds : 0;
    return (<div className="calc-card">
        <NumField label="⚡ ENERGY" value={joules} onChange={setJoules} unit="J" max={1000000} step={100} />
        <NumField label="🕐 TIME" value={seconds} onChange={setSeconds} unit="seconds" min={1} max={3600} step={1} />
        <ResultCard label="POWER" value={fmt(watts)} unit="W" extras={[
            { label: "IN kW", value: `${fmt(watts / 1000, 3)} kW` }, { label: "FORMULA", value: "W = J / s" },
        ]} />
    </div>);
}

/* 37. WATTS TO kVA — kVA = W / (PF × 1000) */
function WattsToKvaCalc() {
    const [watts, setWatts] = useState(5000);
    const [pf, setPf] = useState(0.85);
    const kva = pf > 0 ? watts / (pf * 1000) : 0;
    return (<div className="calc-card">
        <NumField label="💡 REAL POWER" value={watts} onChange={setWatts} unit="W" max={100000} step={100} />
        <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0.1} max={1} step={0.01} />
        <ResultCard label="APPARENT POWER" value={fmt(kva)} unit="kVA" extras={[
            { label: "IN VA", value: `${fmt(kva * 1000, 0)} VA` }, { label: "FORMULA", value: "kVA = W/(PF×1000)" },
        ]} />
    </div>);
}

/* 38. AMPS TO kW — kW = (I × V) / 1000 ... */
function AmpsToKwCalc() {
    const [circuit, setCircuit] = useState<CircuitType>("dc");
    const [amps, setAmps] = useState(20);
    const [volts, setVolts] = useState(240);
    const [pf, setPf] = useState(0.85);
    const watts = circuit === "dc" ? amps * volts : circuit === "ac-1p" ? amps * volts * pf : amps * volts * pf * SQRT3;
    const kw = watts / 1000;
    return (<div className="calc-card">
        <CircuitSelector value={circuit} onChange={setCircuit} />
        <NumField label="⚡ CURRENT" value={amps} onChange={setAmps} unit="A" max={500} step={0.5} />
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={480} step={1} />
        {circuit !== "dc" && <NumField label="📊 POWER FACTOR" value={pf} onChange={setPf} unit="" min={0} max={1} step={0.01} />}
        <ResultCard label="REAL POWER" value={fmt(kw, 3)} unit="kW" extras={[
            { label: "IN WATTS", value: `${fmt(watts, 0)} W` }, { label: "CIRCUIT", value: circuit === "dc" ? "DC" : circuit === "ac-1p" ? "AC 1Φ" : "AC 3Φ" },
            { label: "FORMULA", value: circuit === "dc" ? "kW=(I×V)/1000" : "kW=(I×V×PF)/1000" },
        ]} />
    </div>);
}

/* 39. CAPACITANCE TO CHARGE — Q = C × V */
function CapacitanceToChargeCalc() {
    const [capacitance, setCapacitance] = useState(100);
    const [capUnit, setCapUnit] = useState<"uF" | "mF" | "F" | "nF" | "pF">("uF");
    const [volts, setVolts] = useState(12);
    const multiplier = capUnit === "F" ? 1 : capUnit === "mF" ? 1e-3 : capUnit === "uF" ? 1e-6 : capUnit === "nF" ? 1e-9 : 1e-12;
    const farads = capacitance * multiplier;
    const coulombs = farads * volts;
    const mCoulombs = coulombs * 1000;
    const uCoulombs = coulombs * 1e6;
    return (<div className="calc-card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--s-2)", alignItems: "end" }}>
            <NumField label="🔋 CAPACITANCE" value={capacitance} onChange={setCapacitance} unit={capUnit} max={100000} step={1} />
            <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
                <select className="calc-field__input" value={capUnit} onChange={(e) => setCapUnit(e.target.value as typeof capUnit)}
                    style={{ padding: "var(--s-2)", minWidth: 80 }}>
                    <option value="pF">pF</option><option value="nF">nF</option><option value="uF">μF</option>
                    <option value="mF">mF</option><option value="F">F</option></select>
            </div>
        </div>
        <NumField label="🔌 VOLTAGE" value={volts} onChange={setVolts} unit="V" max={1000} step={1} />
        <ResultCard label="ELECTRIC CHARGE" value={coulombs >= 0.001 ? fmt(coulombs, 4) + " C" : coulombs >= 1e-6 ? fmt(mCoulombs, 4) + " mC" : fmt(uCoulombs, 2) + " μC"} unit="" extras={[
            { label: "COULOMBS", value: `${coulombs.toExponential(3)} C` },
            { label: "FORMULA", value: "Q = C × V" },
            { label: "ENERGY (J)", value: `${fmt(0.5 * farads * volts * volts, 4)} J` },
        ]} />
    </div>);
}

/* ─── Component Map ─── */
const CALC_MAP: Record<string, () => React.JSX.Element> = {
    "amps-to-watts": AmpsToWattsCalc,
    "watts-to-amps": WattsToAmpsCalc,
    "volts-to-watts": VoltsToWattsCalc,
    "watts-to-volts": WattsToVoltsCalc,
    "amps-to-volts": AmpsToVoltsCalc,
    "volts-to-amps": VoltsToAmpsCalc,
    "kva-to-amps": KvaToAmpsCalc,
    "amps-to-kva": AmpsToKvaCalc,
    "watts-to-kwh": WattsToKwhCalc,
    "kwh-to-watts": KwhToWattsCalc,
    "kw-to-amps": KwToAmpsCalc,
    "kw-to-kva": KwToKvaCalc,
    "kw-to-kwh": KwToKwhCalc,
    "kw-to-va": KwToVaCalc,
    "kwh-to-kw": KwhToKwCalc,
    "kva-to-hp": KvaToHpCalc,
    "kva-to-kw": KvaToKwCalc,
    "kva-to-va": KvaToVaCalc,
    "kva-to-watts": KvaToWattsCalc,
    "ah-to-kwh": AhToKwhCalc,
    "ah-to-wh": AhToWhCalc,
    "wh-to-ah": WhToAhCalc,
    "wh-to-mah": WhToMahCalc,
    "mah-to-wh": MahToWhCalc,
    "kwh-to-ah": KwhToAhCalc,
    "amps-to-va": AmpsToVaCalc,
    "va-to-amps": VaToAmpsCalc,
    "va-to-kva": VaToKvaCalc,
    "va-to-kw": VaToKwCalc,
    "amps-to-hp": AmpsToHpCalc,
    "hp-to-amps": HpToAmpsCalc,
    "hp-to-kva": HpToKvaCalc,
    "volts-to-joules": VoltsToJoulesCalc,
    "watts-to-joules": WattsToJoulesCalc,
    "joules-to-volts": JoulesToVoltsCalc,
    "joules-to-watts": JoulesToWattsCalc,
    "watts-to-kva": WattsToKvaCalc,
    "amps-to-kw": AmpsToKwCalc,
    "capacitance-to-charge": CapacitanceToChargeCalc,
};

export default function ElectricalCalculatorCore({ calcType }: { calcType: string }) {
    const Comp = CALC_MAP[calcType];
    if (!Comp) return <p>Calculator not found.</p>;
    return <Comp />;
}
