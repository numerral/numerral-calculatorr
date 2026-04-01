"use client";

import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 2) => (isNaN(n) || !isFinite(n)) ? "—" : n.toFixed(d);
const fmtI = (n: number) => (isNaN(n) || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("en-US");

/* ── Common engine presets ── */
const ENGINE_PRESETS: { label: string; bore: number; stroke: number; cyl: number; unit: "in" | "mm" }[] = [
    { label: "Chevy 350 (5.7L V8)", bore: 4.00, stroke: 3.48, cyl: 8, unit: "in" },
    { label: "Ford 302 (5.0L V8)", bore: 4.00, stroke: 3.00, cyl: 8, unit: "in" },
    { label: "Honda B18 (1.8L I4)", bore: 81, stroke: 89, cyl: 4, unit: "mm" },
    { label: "Toyota 2JZ (3.0L I6)", bore: 86, stroke: 86, cyl: 6, unit: "mm" },
    { label: "BMW S54 (3.2L I6)", bore: 87, stroke: 91, cyl: 6, unit: "mm" },
    { label: "Ford Coyote (5.0L V8)", bore: 3.63, stroke: 3.65, cyl: 8, unit: "in" },
    { label: "LS3 (6.2L V8)", bore: 4.065, stroke: 3.622, cyl: 8, unit: "in" },
];

const CFM_PRESETS = [
    { label: "Chevy 305", cid: 305, rpm: 5500 },
    { label: "Chevy 350", cid: 350, rpm: 5600 },
    { label: "Ford 302", cid: 302, rpm: 6000 },
    { label: "Chevy 383", cid: 383, rpm: 5800 },
    { label: "Ford 351W", cid: 351, rpm: 5800 },
    { label: "Chevy 396", cid: 396, rpm: 5500 },
    { label: "Chrysler 440", cid: 440, rpm: 5200 },
    { label: "Chevy 454", cid: 454, rpm: 5500 },
    { label: "Ford 427", cid: 427, rpm: 6000 },
    { label: "Chevy 502", cid: 502, rpm: 5500 },
];

type CalcType = "engine-hp" | "engine-torque" | "engine-displacement" | "engine-compression" |
    "carburetor-cfm" | "quarter-mile" | "hp-weight-ratio" | "gear-ratio" | "top-speed" | "dyno-correction";

interface Props { calcType: string; }

/* ── Shared input component using design system ── */
const F = ({label, value, onChange, unit, step = 1, min}: {label: string; value: number; onChange: (v: number) => void; unit?: string; step?: number; min?: number}) => (
    <div className="calc-field">
        <label className="calc-field__label">{label}{unit && <span style={{ fontWeight: 400, opacity: 0.6 }}> ({unit})</span>}</label>
        <input type="number" className="calc-field__input" value={value} onChange={e => onChange(+e.target.value)} step={step} min={min} inputMode="decimal" />
    </div>
);

export default function EnginePerformanceCalculatorCore({ calcType }: Props) {
    const ct = calcType as CalcType;

    /* ── Engine HP ── */
    const [hpMethod, setHpMethod] = useState<"rpm-torque" | "elapsed" | "trap">("rpm-torque");
    const [hpTorque, setHpTorque] = useState(350);
    const [hpRpm, setHpRpm] = useState(5600);
    const [hpWeight, setHpWeight] = useState(3500);
    const [hpEt, setHpEt] = useState(13);
    const [hpTrapSpeed, setHpTrapSpeed] = useState(100);

    /* ── Engine Torque ── */
    const [tqHp, setTqHp] = useState(300);
    const [tqRpm, setTqRpm] = useState(5252);

    /* ── Displacement ── */
    const [bore, setBore] = useState(4.00);
    const [stroke, setStroke] = useState(3.48);
    const [cylinders, setCylinders] = useState(8);
    const [boreUnit, setBoreUnit] = useState<"in" | "mm">("in");

    /* ── Compression Ratio ── */
    const [sweptVol, setSweptVol] = useState(500);
    const [clearanceVol, setClearanceVol] = useState(50);

    /* ── Carburetor CFM ── */
    const [cfmCid, setCfmCid] = useState(350);
    const [cfmRpm, setCfmRpm] = useState(6000);
    const [cfmVe, setCfmVe] = useState(85);

    /* ── Quarter Mile ── */
    const [qmHp, setQmHp] = useState(350);
    const [qmWeight, setQmWeight] = useState(3500);

    /* ── HP-to-Weight ── */
    const [hwHp, setHwHp] = useState(300);
    const [hwWeight, setHwWeight] = useState(3500);
    const [hwDisp, setHwDisp] = useState(5.7);

    /* ── Gear Ratio ── */
    const [grTransGear, setGrTransGear] = useState(3.42);
    const [grDiffRatio, setGrDiffRatio] = useState(3.73);
    const [grTireDia, setGrTireDia] = useState(26.0);
    const [grRpm, setGrRpm] = useState(3000);

    /* ── Top Speed ── */
    const [tsHp, setTsHp] = useState(300);
    const [tsWeight, setTsWeight] = useState(3500);
    const [tsCd, setTsCd] = useState(0.32);
    const [tsFrontal, setTsFrontal] = useState(22);

    /* ── Dyno Correction ── */
    const [dcTemp, setDcTemp] = useState(77);
    const [dcBaro, setDcBaro] = useState(29.92);
    const [dcHumidity, setDcHumidity] = useState(50);
    const [dcObservedHp, setDcObservedHp] = useState(300);

    /* ═══════ RESULTS ═══════ */

    const hpResult = useMemo(() => {
        if (hpMethod === "rpm-torque") {
            const hp = (hpRpm * hpTorque) / 5252;
            return { hp, kw: hp * 0.7457, ps: hp * 1.01387, method: "RPM & Torque" };
        }
        if (hpMethod === "elapsed") {
            const hp = hpWeight / Math.pow(hpEt / 5.825, 3);
            return { hp, kw: hp * 0.7457, ps: hp * 1.01387, method: "Elapsed Time" };
        }
        const hp = hpWeight * Math.pow(hpTrapSpeed / 234, 3);
        return { hp, kw: hp * 0.7457, ps: hp * 1.01387, method: "Trap Speed" };
    }, [hpMethod, hpRpm, hpTorque, hpWeight, hpEt, hpTrapSpeed]);

    const tqResult = useMemo(() => {
        const tq = (tqHp * 5252) / tqRpm;
        return { lbft: tq, nm: tq * 1.35582, kgm: tq * 0.13826 };
    }, [tqHp, tqRpm]);

    const dispResult = useMemo(() => {
        let b = bore, s = stroke;
        if (boreUnit === "mm") { b = bore / 25.4; s = stroke / 25.4; }
        const cidPerCyl = (Math.PI / 4) * b * b * s;
        const totalCid = cidPerCyl * cylinders;
        return { cid: totalCid, cc: totalCid * 16.387, liters: totalCid * 0.016387 };
    }, [bore, stroke, cylinders, boreUnit]);

    const crResult = useMemo(() => {
        if (clearanceVol <= 0) return null;
        const cr = (sweptVol + clearanceVol) / clearanceVol;
        const octane = cr <= 9 ? "87 (Regular)" : cr <= 10.5 ? "91 (Mid-Grade)" : cr <= 12 ? "93 (Premium)" : "100+ (Race Fuel)";
        return { cr, octane };
    }, [sweptVol, clearanceVol]);

    const cfmResult = useMemo(() => {
        /* Smart VE: if user typed 0.85 instead of 85, normalize */
        const veNormalized = cfmVe > 0 && cfmVe <= 1 ? cfmVe * 100 : cfmVe;
        const veFraction = veNormalized / 100;
        const cfm = (cfmCid * cfmRpm * veFraction) / 3456;
        const cfm85 = (cfmCid * cfmRpm * 0.85) / 3456;
        const cfm100 = (cfmCid * cfmRpm * 1.0) / 3456;
        const recommended = Math.ceil(cfm / 50) * 50;
        return { cfm, cfm85, cfm100, veNormalized, veFraction, recommended };
    }, [cfmCid, cfmRpm, cfmVe]);

    const qmResult = useMemo(() => {
        if (qmHp <= 0) return null;
        const et = Math.pow(qmWeight / qmHp, 1 / 3) * 5.825;
        const trap = 234 / Math.pow(qmWeight / qmHp, 1 / 3);
        const zeroToSixty = et * 0.4558;
        return { et, trap, zeroToSixty, trapKmh: trap * 1.60934 };
    }, [qmHp, qmWeight]);

    const hwResult = useMemo(() => {
        const hpPerTon = hwHp / (hwWeight / 2000);
        const lbPerHp = hwWeight / hwHp;
        const hpPerLiter = hwHp / hwDisp;
        const kgPerKw = (hwWeight * 0.453592) / (hwHp * 0.7457);
        return { hpPerTon, lbPerHp, hpPerLiter, kwPerKg: 1 / kgPerKw, kgPerKw };
    }, [hwHp, hwWeight, hwDisp]);

    const grResult = useMemo(() => {
        const overallRatio = grTransGear * grDiffRatio;
        const tireCircumference = grTireDia * Math.PI;
        const tireRevsPerMile = 63360 / tireCircumference;
        const speedFromRpm = (grRpm * tireCircumference) / (overallRatio * 63360) * 60;
        const rpmFromSpeed = (60 * overallRatio * 63360) / (tireCircumference * 60);
        return { overallRatio, speedMph: speedFromRpm, speedKmh: speedFromRpm * 1.60934, rpmAt60: rpmFromSpeed, tireRevsPerMile };
    }, [grTransGear, grDiffRatio, grTireDia, grRpm]);

    const tsResult = useMemo(() => {
        const rho = 0.002378;
        const hpWatts = tsHp * 745.7;
        const frontalM2 = tsFrontal * 0.0929;
        const vMax = Math.pow((2 * hpWatts) / (rho * 0.4536 * tsCd * frontalM2), 1 / 3);
        const mph = vMax * 2.23694;
        return { mph, kmh: mph * 1.60934 };
    }, [tsHp, tsWeight, tsCd, tsFrontal]);

    const dcResult = useMemo(() => {
        const tempK = (dcTemp - 32) * 5 / 9 + 273.15;
        const baroKpa = dcBaro * 3.38639;
        const sae = 1.18 * (99.0 / baroKpa) * Math.sqrt(tempK / 302.4) - 0.18;
        const din = (1013.0 / (baroKpa * 10)) * Math.sqrt(tempK / 293.0);
        const std = (29.92 / dcBaro) * Math.sqrt(tempK / 302.59);
        return {
            sae: Math.max(sae, 0.5), din: Math.max(din, 0.5), std: Math.max(std, 0.5),
            correctedSae: dcObservedHp * sae, correctedDin: dcObservedHp * din, correctedStd: dcObservedHp * std
        };
    }, [dcTemp, dcBaro, dcHumidity, dcObservedHp]);

    /* ═══════ RENDER ═══════ */
    return (
        <div>
            {/* ═══════ ENGINE HP ═══════ */}
            {ct === "engine-hp" && (<>
                <div className="calc-input-panel">
                    <div className="calc-field">
                        <label className="calc-field__label">Calculation Method</label>
                        <div className="tax-toggle">
                            {([["rpm-torque", "RPM & Torque"], ["elapsed", "¼ Mile ET"], ["trap", "Trap Speed"]] as const).map(([m, label]) => (
                                <button key={m} className={`tax-toggle__btn${hpMethod === m ? " active" : ""}`} onClick={() => setHpMethod(m)}>{label}</button>
                            ))}
                        </div>
                    </div>

                    {hpMethod === "rpm-torque" && <>
                        <F label="🔩 Torque" value={hpTorque} onChange={setHpTorque} unit="lb-ft" step={10} />
                        <F label="🔄 RPM at Peak HP" value={hpRpm} onChange={setHpRpm} unit="RPM" step={100} />
                    </>}
                    {hpMethod === "elapsed" && <>
                        <F label="🏁 ¼ Mile Time" value={hpEt} onChange={setHpEt} unit="seconds" step={0.1} />
                        <F label="⚖️ Vehicle Weight" value={hpWeight} onChange={setHpWeight} unit="lbs" step={50} />
                    </>}
                    {hpMethod === "trap" && <>
                        <F label="💨 Trap Speed" value={hpTrapSpeed} onChange={setHpTrapSpeed} unit="mph" step={1} />
                        <F label="⚖️ Vehicle Weight" value={hpWeight} onChange={setHpWeight} unit="lbs" step={50} />
                    </>}
                </div>

                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Estimated Horsepower</p>
                    <p className="calc-result__emi">{fmt(hpResult.hp, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> HP</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Kilowatts</p><p className="calc-result__stat-value">{fmt(hpResult.kw, 1)} kW</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Metric HP</p><p className="calc-result__stat-value">{fmt(hpResult.ps, 1)} PS</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        {hpMethod === "rpm-torque" && <p className="calc-result__breakdown-line">💡 HP = (RPM × Torque) ÷ 5,252 = ({fmtI(hpRpm)} × {fmtI(hpTorque)}) ÷ 5,252 = <strong>{fmt(hpResult.hp, 1)} HP</strong></p>}
                        {hpMethod === "elapsed" && <p className="calc-result__breakdown-line">💡 HP = Weight ÷ (ET ÷ 5.825)³ = {fmtI(hpWeight)} ÷ ({fmt(hpEt, 1)} ÷ 5.825)³ = <strong>{fmt(hpResult.hp, 1)} HP</strong></p>}
                        {hpMethod === "trap" && <p className="calc-result__breakdown-line">💡 HP = Weight × (Speed ÷ 234)³ = {fmtI(hpWeight)} × ({fmtI(hpTrapSpeed)} ÷ 234)³ = <strong>{fmt(hpResult.hp, 1)} HP</strong></p>}
                    </div>
                </div>
            </>)}

            {/* ═══════ ENGINE TORQUE ═══════ */}
            {ct === "engine-torque" && (<>
                <div className="calc-input-panel">
                    <F label="🏎️ Horsepower" value={tqHp} onChange={setTqHp} unit="HP" step={10} />
                    <F label="🔄 Engine RPM" value={tqRpm} onChange={setTqRpm} unit="RPM" step={100} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Engine Torque</p>
                    <p className="calc-result__emi">{fmt(tqResult.lbft, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> lb-ft</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Newton-meters</p><p className="calc-result__stat-value">{fmt(tqResult.nm, 1)} Nm</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Kilogram-meters</p><p className="calc-result__stat-value">{fmt(tqResult.kgm, 2)} kg-m</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 Torque = (HP × 5,252) ÷ RPM = ({fmtI(tqHp)} × 5,252) ÷ {fmtI(tqRpm)} = <strong>{fmt(tqResult.lbft, 1)} lb-ft</strong></p>
                    </div>
                </div>
            </>)}

            {/* ═══════ ENGINE DISPLACEMENT ═══════ */}
            {ct === "engine-displacement" && (<>
                <div className="calc-input-panel">
                    <div className="calc-field">
                        <label className="calc-field__label">🔧 Quick Presets — Popular Engines</label>
                        <select className="calc-field__input" defaultValue="" onChange={e => { const p = ENGINE_PRESETS[+e.target.value]; if(p){ setBore(p.bore); setStroke(p.stroke); setCylinders(p.cyl); setBoreUnit(p.unit); } }} style={{ cursor: "pointer" }}>
                            <option value="" disabled>Select an engine...</option>
                            {ENGINE_PRESETS.map((p, i) => (
                                <option key={p.label} value={i}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label">📐 Unit System</label>
                        <div className="tax-toggle">
                            {(["in", "mm"] as const).map(u => (
                                <button key={u} className={`tax-toggle__btn${boreUnit === u ? " active" : ""}`} onClick={() => setBoreUnit(u)}>{u === "in" ? "Inches" : "Millimeters"}</button>
                            ))}
                        </div>
                    </div>
                    <F label="⊘ Bore" value={bore} onChange={setBore} unit={boreUnit} step={boreUnit === "in" ? 0.01 : 1} />
                    <F label="↕ Stroke" value={stroke} onChange={setStroke} unit={boreUnit} step={boreUnit === "in" ? 0.01 : 1} />
                    <F label="🔢 Cylinders" value={cylinders} onChange={setCylinders} unit="#" step={1} min={1} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Engine Displacement</p>
                    <p className="calc-result__emi">{fmt(dispResult.cid, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> cu in</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Cubic Centimeters</p><p className="calc-result__stat-value">{fmtI(dispResult.cc)} cc</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Liters</p><p className="calc-result__stat-value">{fmt(dispResult.liters, 2)} L</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 V = (π/4) × Bore² × Stroke × Cylinders = {fmt(dispResult.liters, 2)}L ({fmtI(dispResult.cc)} cc / {fmt(dispResult.cid, 1)} CID)</p>
                    </div>
                </div>
            </>)}

            {/* ═══════ COMPRESSION RATIO ═══════ */}
            {ct === "engine-compression" && (<>
                <div className="calc-input-panel">
                    <F label="📦 Swept Volume" value={sweptVol} onChange={setSweptVol} unit="cc" step={10} />
                    <F label="🔬 Clearance Volume" value={clearanceVol} onChange={setClearanceVol} unit="cc" step={1} min={1} />
                </div>
                {crResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Compression Ratio</p>
                        <p className="calc-result__emi">{fmt(crResult.cr, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}>:1</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Recommended Octane</p><p className="calc-result__stat-value">{crResult.octane}</p></div>
                        </div>
                        <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                            <p className="calc-result__breakdown-line">💡 CR = (Swept + Clearance) ÷ Clearance = ({fmtI(sweptVol)} + {fmtI(clearanceVol)}) ÷ {fmtI(clearanceVol)} = <strong>{fmt(crResult.cr, 1)}:1</strong></p>
                        </div>
                    </div>
                )}
            </>)}

            {/* ═══════ CARBURETOR CFM ═══════ */}
            {ct === "carburetor-cfm" && (<>
                <div className="calc-input-panel">
                    <div className="calc-field">
                        <label className="calc-field__label">🔧 Quick Presets — Popular Engines</label>
                        <select className="calc-field__input" defaultValue="" onChange={e => { const p = CFM_PRESETS[+e.target.value]; if(p){ setCfmCid(p.cid); setCfmRpm(p.rpm); } }} style={{ cursor: "pointer" }}>
                            <option value="" disabled>Select an engine...</option>
                            {CFM_PRESETS.map((p, i) => (
                                <option key={p.label} value={i}>{p.label} — {p.cid} CID / {p.rpm.toLocaleString()} RPM</option>
                            ))}
                        </select>
                    </div>
                    <F label="⚙️ Engine Displacement" value={cfmCid} onChange={setCfmCid} unit="CID" step={10} />
                    <F label="🔄 Maximum RPM" value={cfmRpm} onChange={setCfmRpm} unit="RPM" step={100} />
                    <div className="calc-field">
                        <label className="calc-field__label">📊 Volumetric Efficiency <span style={{ fontWeight: 400, opacity: 0.6 }}>(%)</span></label>
                        <select className="calc-field__input" value={cfmVe} onChange={e => setCfmVe(+e.target.value)} style={{ cursor: "pointer" }}>
                            <option value={70}>70% — Bone Stock</option>
                            <option value={75}>75% — Stock w/ Exhaust</option>
                            <option value={80}>80% — Mild Street Build</option>
                            <option value={85}>85% — Performance Street</option>
                            <option value={88}>88% — Hot Street/Strip</option>
                            <option value={90}>90% — Race Street</option>
                            <option value={95}>95% — Full Race (N/A)</option>
                            <option value={100}>100% — Maximum Race</option>
                            <option value={110}>110% — Forced Induction</option>
                        </select>
                    </div>
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Required Carburetor Size</p>
                    <p className="calc-result__emi">{fmtI(cfmResult.cfm)}<span style={{fontSize: "0.4em", fontWeight: 400}}> CFM</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Recommended Carb</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{fmtI(cfmResult.recommended)} CFM</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">At 85% VE</p><p className="calc-result__stat-value">{fmtI(cfmResult.cfm85)} CFM</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">At 100% VE</p><p className="calc-result__stat-value">{fmtI(cfmResult.cfm100)} CFM</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 CFM = (CID × RPM × VE%) ÷ 3,456 = ({fmtI(cfmCid)} × {fmtI(cfmRpm)} × {fmt(cfmResult.veNormalized, 0)}%) ÷ 3,456 = <strong>{fmtI(cfmResult.cfm)} CFM</strong></p>
                    </div>
                </div>
            </>)}

            {/* ═══════ QUARTER MILE ═══════ */}
            {ct === "quarter-mile" && (<>
                <div className="calc-input-panel">
                    <F label="🏎️ Horsepower" value={qmHp} onChange={setQmHp} unit="HP" step={10} min={1} />
                    <F label="⚖️ Vehicle Weight" value={qmWeight} onChange={setQmWeight} unit="lbs" step={50} />
                </div>
                {qmResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Quarter Mile Time</p>
                        <p className="calc-result__emi">{fmt(qmResult.et, 2)}<span style={{fontSize: "0.4em", fontWeight: 400}}> seconds</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Trap Speed</p><p className="calc-result__stat-value">{fmt(qmResult.trap, 1)} mph</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Trap Speed</p><p className="calc-result__stat-value">{fmt(qmResult.trapKmh, 1)} km/h</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">0–60 mph (est.)</p><p className="calc-result__stat-value">{fmt(qmResult.zeroToSixty, 1)} sec</p></div>
                        </div>
                        <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                            <p className="calc-result__breakdown-line">💡 ET = ∛(Weight ÷ HP) × 5.825 = ∛({fmtI(qmWeight)} ÷ {fmtI(qmHp)}) × 5.825 = <strong>{fmt(qmResult.et, 2)}s</strong></p>
                        </div>
                    </div>
                )}
            </>)}

            {/* ═══════ HP-TO-WEIGHT ═══════ */}
            {ct === "hp-weight-ratio" && (<>
                <div className="calc-input-panel">
                    <F label="🏎️ Horsepower" value={hwHp} onChange={setHwHp} unit="HP" step={10} min={1} />
                    <F label="⚖️ Vehicle Weight" value={hwWeight} onChange={setHwWeight} unit="lbs" step={50} />
                    <F label="⚙️ Engine Displacement" value={hwDisp} onChange={setHwDisp} unit="liters" step={0.1} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Power-to-Weight Ratio</p>
                    <p className="calc-result__emi">{fmt(hwResult.hpPerTon, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> HP/ton</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Pounds per HP</p><p className="calc-result__stat-value">{fmt(hwResult.lbPerHp, 1)} lb/HP</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">HP per Liter</p><p className="calc-result__stat-value">{fmt(hwResult.hpPerLiter, 1)} HP/L</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">kW per kg</p><p className="calc-result__stat-value">{fmt(hwResult.kwPerKg, 3)}</p></div>
                    </div>
                </div>
                <div style={{marginTop: "var(--s-6)", overflowX: "auto"}}>
                    <h3 className="t-h3" style={{marginBottom: "var(--s-3)"}}>Vehicle Class Reference</h3>
                    <table className="comparison-table"><thead><tr><th>Class</th><th>HP/ton</th><th>lb/HP</th></tr></thead>
                        <tbody>
                            {[["Economy Car", "80–120", "20–25"], ["Family Sedan", "120–180", "14–17"], ["Sports Car", "180–280", "9–12"], ["Supercar", "350–550", "5–7"], ["Hypercar", "600+", "<4"]].map(([cls, hpt, lph]) => (
                                <tr key={cls}><td>{cls}</td><td>{hpt}</td><td>{lph}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>)}

            {/* ═══════ GEAR RATIO ═══════ */}
            {ct === "gear-ratio" && (<>
                <div className="calc-input-panel">
                    <F label="⚙️ Transmission Gear Ratio" value={grTransGear} onChange={setGrTransGear} unit=":1" step={0.01} />
                    <F label="🔧 Differential (Axle) Ratio" value={grDiffRatio} onChange={setGrDiffRatio} unit=":1" step={0.01} />
                    <F label="🛞 Tire Diameter" value={grTireDia} onChange={setGrTireDia} unit="inches" step={0.5} />
                    <F label="🔄 Engine RPM" value={grRpm} onChange={setGrRpm} unit="RPM" step={100} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Overall Gear Ratio</p>
                    <p className="calc-result__emi">{fmt(grResult.overallRatio, 2)}<span style={{fontSize: "0.4em", fontWeight: 400}}>:1</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Speed at {fmtI(grRpm)} RPM</p><p className="calc-result__stat-value">{fmt(grResult.speedMph, 1)} mph</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Speed (metric)</p><p className="calc-result__stat-value">{fmt(grResult.speedKmh, 1)} km/h</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">RPM at 60 mph</p><p className="calc-result__stat-value">{fmtI(grResult.rpmAt60)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Tire Revs/Mile</p><p className="calc-result__stat-value">{fmtI(grResult.tireRevsPerMile)}</p></div>
                    </div>
                </div>
            </>)}

            {/* ═══════ TOP SPEED ═══════ */}
            {ct === "top-speed" && (<>
                <div className="calc-input-panel">
                    <F label="🏎️ Horsepower" value={tsHp} onChange={setTsHp} unit="HP" step={10} min={1} />
                    <F label="⚖️ Vehicle Weight" value={tsWeight} onChange={setTsWeight} unit="lbs" step={50} />
                    <F label="💨 Drag Coefficient (Cd)" value={tsCd} onChange={setTsCd} step={0.01} />
                    <F label="📐 Frontal Area" value={tsFrontal} onChange={setTsFrontal} unit="sq ft" step={0.5} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Theoretical Top Speed</p>
                    <p className="calc-result__emi">{fmt(tsResult.mph, 0)}<span style={{fontSize: "0.4em", fontWeight: 400}}> mph</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Metric</p><p className="calc-result__stat-value">{fmt(tsResult.kmh, 0)} km/h</p></div>
                    </div>
                </div>
                <div style={{marginTop: "var(--s-6)", overflowX: "auto"}}>
                    <h3 className="t-h3" style={{marginBottom: "var(--s-3)"}}>Typical Drag Coefficients</h3>
                    <table className="comparison-table"><thead><tr><th>Vehicle Type</th><th>Cd Range</th><th>Frontal Area (ft²)</th></tr></thead>
                        <tbody>
                            {[["Sedan", "0.27–0.33", "22–24"], ["SUV", "0.35–0.45", "28–32"], ["Sports Car", "0.28–0.35", "19–22"], ["Truck", "0.40–0.50", "30–38"], ["Supercar", "0.30–0.36", "17–20"]].map(([v, cd, fa]) => (
                                <tr key={v}><td>{v}</td><td>{cd}</td><td>{fa}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>)}

            {/* ═══════ DYNO CORRECTION ═══════ */}
            {ct === "dyno-correction" && (<>
                <div className="calc-input-panel">
                    <F label="🌡️ Temperature" value={dcTemp} onChange={setDcTemp} unit="°F" step={1} />
                    <F label="📊 Barometric Pressure" value={dcBaro} onChange={setDcBaro} unit="inHg" step={0.01} />
                    <F label="💧 Relative Humidity" value={dcHumidity} onChange={setDcHumidity} unit="%" step={1} />
                    <F label="🏎️ Observed Horsepower" value={dcObservedHp} onChange={setDcObservedHp} unit="HP" step={5} min={1} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">SAE Corrected Horsepower</p>
                    <p className="calc-result__emi">{fmt(dcResult.correctedSae, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> HP</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">SAE J1349 Factor</p><p className="calc-result__stat-value">{fmt(dcResult.sae, 4)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">DIN 70020 Factor</p><p className="calc-result__stat-value">{fmt(dcResult.din, 4)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">STD Factor</p><p className="calc-result__stat-value">{fmt(dcResult.std, 4)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">DIN Corrected</p><p className="calc-result__stat-value">{fmt(dcResult.correctedDin, 1)} HP</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 Standard conditions: SAE = 77°F, 29.235 inHg | DIN = 68°F, 29.92 inHg | STD = 60°F, 29.92 inHg</p>
                    </div>
                </div>
            </>)}
        </div>
    );
}
