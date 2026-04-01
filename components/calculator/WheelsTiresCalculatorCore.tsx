"use client";

import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 2) => (isNaN(n) || !isFinite(n)) ? "—" : n.toFixed(d);
const fmtI = (n: number) => (isNaN(n) || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("en-US");

/* ── Tire math ── */
function tireDims(width: number, aspect: number, rim: number) {
    const sidewallMm = width * (aspect / 100);
    const sidewallIn = sidewallMm / 25.4;
    const diameterIn = (rim + 2 * sidewallIn);
    const circumIn = diameterIn * Math.PI;
    const revsPerMile = 63360 / circumIn;
    return {
        widthMm: width, widthIn: width / 25.4, aspectRatio: aspect, rimIn: rim,
        sidewallMm, sidewallIn, diameterIn, diameterMm: diameterIn * 25.4,
        circumIn, circumMm: circumIn * 25.4, revsPerMile
    };
}

const COMMON_TIRES = [
    { label: "225/55R17 — Sedan", w: 225, a: 55, r: 17 },
    { label: "235/65R17 — Mid SUV", w: 235, a: 65, r: 17 },
    { label: "265/70R17 — Truck", w: 265, a: 70, r: 17 },
    { label: "215/55R16 — Compact", w: 215, a: 55, r: 16 },
    { label: "245/45R18 — Sport", w: 245, a: 45, r: 18 },
    { label: "275/55R20 — Full SUV", w: 275, a: 55, r: 20 },
    { label: "205/65R15 — Economy", w: 205, a: 65, r: 15 },
    { label: "315/70R17 — Off-road", w: 315, a: 70, r: 17 },
];

const BOLT_PATTERNS = [
    { label: "4×100 — Honda, Toyota", bolts: 4, pcd: 100 },
    { label: "5×114.3 — Honda, Nissan, Toyota", bolts: 5, pcd: 114.3 },
    { label: "5×120 — BMW, Tesla M3", bolts: 5, pcd: 120 },
    { label: "5×112 — Audi, VW, Mercedes", bolts: 5, pcd: 112 },
    { label: "6×139.7 — Toyota Truck, Chevy", bolts: 6, pcd: 139.7 },
    { label: "5×127 — Jeep Wrangler", bolts: 5, pcd: 127 },
];

type CalcType = "tire-size" | "tire-compare" | "tire-conversion" | "speedo-error" |
    "speedo-gear" | "wheel-offset" | "tire-pressure" | "bolt-pattern";

interface Props { calcType: string; }

/* ── Design system field component ── */
const F = ({label, value, onChange, unit, step = 1, min}: {label: string; value: number; onChange: (v: number) => void; unit?: string; step?: number; min?: number}) => (
    <div className="calc-field">
        <label className="calc-field__label">{label}{unit && <span style={{ fontWeight: 400, opacity: 0.6 }}> ({unit})</span>}</label>
        <input type="number" className="calc-field__input" value={value} onChange={e => onChange(+e.target.value)} step={step} min={min} inputMode="decimal" />
    </div>
);

/* ── Grouped tire inputs (3 fields) ── */
const TireGroup = ({label, w, a, r, setW, setA, setR}: {label: string; w: number; a: number; r: number; setW: (v:number)=>void; setA:(v:number)=>void; setR:(v:number)=>void}) => (
    <div>
        <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px", opacity: 0.8 }}>{label}</p>
        <F label="🛞 Width" value={w} onChange={setW} unit="mm" step={5} />
        <F label="📐 Aspect" value={a} onChange={setA} unit="%" step={5} />
        <F label="⊘ Rim" value={r} onChange={setR} unit="in" step={1} />
        <p style={{ fontSize: "0.78rem", opacity: 0.5, marginTop: "4px" }}>Format: {w}/{a}R{r}</p>
    </div>
);

export default function WheelsTiresCalculatorCore({ calcType }: Props) {
    const ct = calcType as CalcType;

    /* ── Tire Size ── */
    const [tsWidth, setTsWidth] = useState(225);
    const [tsAspect, setTsAspect] = useState(55);
    const [tsRim, setTsRim] = useState(17);

    /* ── Tire Compare ── */
    const [tc1w, setTc1w] = useState(225);
    const [tc1a, setTc1a] = useState(55);
    const [tc1r, setTc1r] = useState(17);
    const [tc2w, setTc2w] = useState(235);
    const [tc2a, setTc2a] = useState(65);
    const [tc2r, setTc2r] = useState(17);

    /* ── Tire Conversion ── */
    const [tcMode, setTcMode] = useState<"metric-to-inch" | "inch-to-metric">("metric-to-inch");
    const [tcWidth, setTcWidth] = useState(225);
    const [tcAspect, setTcAspect] = useState(55);
    const [tcRim, setTcRim] = useState(17);
    const [tcDiaIn, setTcDiaIn] = useState(28);
    const [tcWidthIn, setTcWidthIn] = useState(10.5);
    const [tcRimIn, setTcRimIn] = useState(15);

    /* ── Speedometer Error ── */
    const [seOldW, setSeOldW] = useState(225);
    const [seOldA, setSeOldA] = useState(55);
    const [seOldR, setSeOldR] = useState(17);
    const [seNewW, setSeNewW] = useState(235);
    const [seNewA, setSeNewA] = useState(65);
    const [seNewR, setSeNewR] = useState(17);

    /* ── Speedometer Gear ── */
    const [sgTireDia, setSgTireDia] = useState(26);
    const [sgAxleRatio, setSgAxleRatio] = useState(3.73);
    const [sgDriveGear, setSgDriveGear] = useState(8);

    /* ── Wheel Offset ── */
    const [woOldWidth, setWoOldWidth] = useState(8.0);
    const [woOldOffset, setWoOldOffset] = useState(45);
    const [woNewWidth, setWoNewWidth] = useState(9.0);
    const [woNewOffset, setWoNewOffset] = useState(35);

    /* ── Tire Pressure ── */
    const [tpBase, setTpBase] = useState(35);
    const [tpBaseTemp, setTpBaseTemp] = useState(70);
    const [tpCurrentTemp, setTpCurrentTemp] = useState(30);

    /* ── Bolt Pattern ── */
    const [bpBolts, setBpBolts] = useState(5);
    const [bpMeasurement, setBpMeasurement] = useState(4.5);
    const [bpUnit, setBpUnit] = useState<"in" | "mm">("in");

    /* ═══════ RESULTS ═══════ */

    const tireResult = useMemo(() => tireDims(tsWidth, tsAspect, tsRim), [tsWidth, tsAspect, tsRim]);

    const compareResult = useMemo(() => {
        const t1 = tireDims(tc1w, tc1a, tc1r);
        const t2 = tireDims(tc2w, tc2a, tc2r);
        const diaDiff = t2.diameterIn - t1.diameterIn;
        const diaPct = (diaDiff / t1.diameterIn) * 100;
        return { t1, t2, diaDiff, diaPct, widthDiff: t2.widthMm - t1.widthMm, circumDiff: t2.circumIn - t1.circumIn };
    }, [tc1w, tc1a, tc1r, tc2w, tc2a, tc2r]);

    const convResult = useMemo(() => {
        if (tcMode === "metric-to-inch") {
            const t = tireDims(tcWidth, tcAspect, tcRim);
            return { diameterIn: t.diameterIn, widthIn: t.widthIn, rimIn: t.rimIn, notation: `${fmt(t.diameterIn, 1)}×${fmt(t.widthIn, 1)}R${t.rimIn}`, metric: `${tcWidth}/${tcAspect}R${tcRim}` };
        }
        const widthMm = tcWidthIn * 25.4;
        const sidewallMm = (tcDiaIn * 25.4 - tcRimIn * 25.4) / 2;
        const aspect = Math.round((sidewallMm / widthMm) * 100);
        const w = Math.round(widthMm / 5) * 5;
        return { diameterIn: tcDiaIn, widthIn: tcWidthIn, rimIn: tcRimIn, notation: `${tcDiaIn}×${tcWidthIn}R${tcRimIn}`, metric: `${w}/${aspect}R${tcRimIn}` };
    }, [tcMode, tcWidth, tcAspect, tcRim, tcDiaIn, tcWidthIn, tcRimIn]);

    const speedoResult = useMemo(() => {
        const old = tireDims(seOldW, seOldA, seOldR);
        const newT = tireDims(seNewW, seNewA, seNewR);
        const errorPct = ((newT.diameterIn - old.diameterIn) / old.diameterIn) * 100;
        const speeds = [20, 30, 40, 50, 60, 70, 80].map(s => ({
            indicated: s, actual: s * (newT.diameterIn / old.diameterIn)
        }));
        return { old, new: newT, errorPct, speeds };
    }, [seOldW, seOldA, seOldR, seNewW, seNewA, seNewR]);

    const sgResult = useMemo(() => {
        const tireRevs = 20168 / sgTireDia;
        const drivenTeeth = Math.round((tireRevs * sgAxleRatio * sgDriveGear) / 1000);
        return { tireRevs, drivenTeeth, driveGear: sgDriveGear };
    }, [sgTireDia, sgAxleRatio, sgDriveGear]);

    const offsetResult = useMemo(() => {
        const oldHalf = (woOldWidth * 25.4) / 2;
        const newHalf = (woNewWidth * 25.4) / 2;
        const oldInner = oldHalf - woOldOffset;
        const newInner = newHalf - woNewOffset;
        const oldOuter = oldHalf + woOldOffset;
        const newOuter = newHalf + woNewOffset;
        const innerChange = newInner - oldInner;
        const outerChange = newOuter - oldOuter;
        const newBS = (woNewWidth * 25.4 / 2 + woNewOffset);
        const oldBS = (woOldWidth * 25.4 / 2 + woOldOffset);
        return { innerChange, outerChange, oldBS, newBS, bsChange: newBS - oldBS, trackChange: (outerChange - innerChange) };
    }, [woOldWidth, woOldOffset, woNewWidth, woNewOffset]);

    const tpResult = useMemo(() => {
        const tempDiff = tpCurrentTemp - tpBaseTemp;
        const psiChange = tempDiff * (1 / 10);
        const adjusted = tpBase + psiChange;
        return { adjusted: Math.max(adjusted, 0), psiChange, tempDiff, bar: adjusted * 0.0689476, kpa: adjusted * 6.89476 };
    }, [tpBase, tpBaseTemp, tpCurrentTemp]);

    const bpResult = useMemo(() => {
        let pcd: number;
        const m = bpUnit === "mm" ? bpMeasurement : bpMeasurement * 25.4;
        if (bpBolts === 4) pcd = m / Math.sin(Math.PI / 4) * Math.sin(Math.PI / 4);
        else if (bpBolts === 5) pcd = m / (2 * Math.sin(Math.PI / 5));
        else if (bpBolts === 6) pcd = m;
        else if (bpBolts === 8) pcd = m / (2 * Math.sin(Math.PI / 8));
        else pcd = m / (2 * Math.sin(Math.PI / bpBolts));
        const pcdIn = pcd / 25.4;
        const pcdMm = pcd;
        const standardPcds = [100, 108, 110, 112, 114.3, 115, 120, 127, 130, 139.7];
        const nearest = standardPcds.reduce((a, b) => Math.abs(b - pcdMm) < Math.abs(a - pcdMm) ? b : a);
        return { pcdMm, pcdIn, notation: `${bpBolts}×${fmt(pcdMm, 1)}`, notationIn: `${bpBolts}×${fmt(pcdIn, 2)}"`, nearest };
    }, [bpBolts, bpMeasurement, bpUnit]);

    /* ═══════ RENDER ═══════ */
    return (
        <div>
            {/* ═══════ TIRE SIZE ═══════ */}
            {ct === "tire-size" && (<>
                <div className="calc-input-panel">
                    <div className="calc-field">
                        <label className="calc-field__label">🛞 Common Tire Sizes</label>
                        <select className="calc-field__input" defaultValue="" onChange={e => { const t = COMMON_TIRES[+e.target.value]; if(t){ setTsWidth(t.w); setTsAspect(t.a); setTsRim(t.r); } }} style={{ cursor: "pointer" }}>
                            <option value="" disabled>Select a tire size...</option>
                            {COMMON_TIRES.map((t, i) => (<option key={t.label} value={i}>{t.label}</option>))}
                        </select>
                    </div>
                    <F label="🛞 Width" value={tsWidth} onChange={setTsWidth} unit="mm" step={5} />
                    <F label="📐 Aspect Ratio" value={tsAspect} onChange={setTsAspect} unit="%" step={5} />
                    <F label="⊘ Rim Diameter" value={tsRim} onChange={setTsRim} unit="inches" step={1} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Tire Dimensions — {tsWidth}/{tsAspect}R{tsRim}</p>
                    <p className="calc-result__emi">{fmt(tireResult.diameterIn, 2)}<span style={{fontSize: "0.4em", fontWeight: 400}}> inches</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Diameter</p><p className="calc-result__stat-value">{fmt(tireResult.diameterMm, 1)} mm</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Section Width</p><p className="calc-result__stat-value">{fmt(tireResult.widthIn, 2)}″ / {tireResult.widthMm}mm</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Sidewall</p><p className="calc-result__stat-value">{fmt(tireResult.sidewallIn, 2)}″ / {fmt(tireResult.sidewallMm, 1)}mm</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Revs/Mile</p><p className="calc-result__stat-value">{fmtI(tireResult.revsPerMile)}</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 Circumference: {fmt(tireResult.circumIn, 2)}″ ({fmt(tireResult.circumMm, 1)} mm)</p>
                    </div>
                </div>
            </>)}

            {/* ═══════ TIRE COMPARE ═══════ */}
            {ct === "tire-compare" && (<>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    <div className="calc-input-panel">
                        <TireGroup label="Original Tire (OEM)" w={tc1w} a={tc1a} r={tc1r} setW={setTc1w} setA={setTc1a} setR={setTc1r} />
                    </div>
                    <div className="calc-input-panel">
                        <TireGroup label="New Tire" w={tc2w} a={tc2a} r={tc2r} setW={setTc2w} setA={setTc2a} setR={setTc2r} />
                    </div>
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Size Comparison</p>
                    <p className="calc-result__emi">{compareResult.diaDiff > 0 ? "+" : ""}{fmt(compareResult.diaDiff, 2)}<span style={{fontSize: "0.4em", fontWeight: 400}}> inches</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Diameter Change</p><p className="calc-result__stat-value">{compareResult.diaPct > 0 ? "+" : ""}{fmt(compareResult.diaPct, 1)}%</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Width Change</p><p className="calc-result__stat-value">{compareResult.widthDiff > 0 ? "+" : ""}{compareResult.widthDiff}mm</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">{Math.abs(compareResult.diaPct) <= 3 ? "✅ Within safe 3% fitment range" : "⚠️ May require fender modification or recalibration"}</p>
                    </div>
                </div>
                <div style={{marginTop: "var(--s-6)", overflowX: "auto"}}>
                    <table className="comparison-table"><thead><tr><th>Dimension</th><th>Original</th><th>New</th><th>Diff</th></tr></thead>
                        <tbody>
                            {[
                                ["Diameter", `${fmt(compareResult.t1.diameterIn, 2)}"`, `${fmt(compareResult.t2.diameterIn, 2)}"`, `${compareResult.diaDiff > 0 ? "+" : ""}${fmt(compareResult.diaDiff, 2)}"`],
                                ["Width", `${compareResult.t1.widthMm}mm`, `${compareResult.t2.widthMm}mm`, `${compareResult.widthDiff > 0 ? "+" : ""}${compareResult.widthDiff}mm`],
                                ["Sidewall", `${fmt(compareResult.t1.sidewallIn, 2)}"`, `${fmt(compareResult.t2.sidewallIn, 2)}"`, `${(compareResult.t2.sidewallIn - compareResult.t1.sidewallIn) > 0 ? "+" : ""}${fmt(compareResult.t2.sidewallIn - compareResult.t1.sidewallIn, 2)}"`],
                                ["Circumference", `${fmt(compareResult.t1.circumIn, 1)}"`, `${fmt(compareResult.t2.circumIn, 1)}"`, `${compareResult.circumDiff > 0 ? "+" : ""}${fmt(compareResult.circumDiff, 1)}"`],
                                ["Revs/Mile", fmtI(compareResult.t1.revsPerMile), fmtI(compareResult.t2.revsPerMile), `${(compareResult.t2.revsPerMile - compareResult.t1.revsPerMile) > 0 ? "+" : ""}${fmtI(compareResult.t2.revsPerMile - compareResult.t1.revsPerMile)}`],
                            ].map(([dim, old, newV, diff]) => (
                                <tr key={dim}><td>{dim}</td><td>{old}</td><td>{newV}</td><td style={{ fontWeight: 700, color: "#d4620a" }}>{diff}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>)}

            {/* ═══════ TIRE CONVERSION ═══════ */}
            {ct === "tire-conversion" && (<>
                <div className="calc-input-panel">
                    <div className="calc-field">
                        <label className="calc-field__label">Conversion Direction</label>
                        <div className="tax-toggle">
                            {([["metric-to-inch", "Metric → Inches"], ["inch-to-metric", "Inches → Metric"]] as const).map(([m, label]) => (
                                <button key={m} className={`tax-toggle__btn${tcMode === m ? " active" : ""}`} onClick={() => setTcMode(m)}>{label}</button>
                            ))}
                        </div>
                    </div>
                    {tcMode === "metric-to-inch" ? <>
                        <F label="🛞 Width" value={tcWidth} onChange={setTcWidth} unit="mm" step={5} />
                        <F label="📐 Aspect" value={tcAspect} onChange={setTcAspect} unit="%" step={5} />
                        <F label="⊘ Rim" value={tcRim} onChange={setTcRim} unit="in" step={1} />
                    </> : <>
                        <F label="⊘ Overall Diameter" value={tcDiaIn} onChange={setTcDiaIn} unit="inches" step={0.5} />
                        <F label="🛞 Tread Width" value={tcWidthIn} onChange={setTcWidthIn} unit="inches" step={0.5} />
                        <F label="⊘ Rim Diameter" value={tcRimIn} onChange={setTcRimIn} unit="inches" step={1} />
                    </>}
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Conversion Result</p>
                    <p className="calc-result__emi" style={{fontSize: "1.8rem"}}>{tcMode === "inch-to-metric" ? convResult.metric : convResult.notation}</p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Metric</p><p className="calc-result__stat-value">{convResult.metric}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Inch</p><p className="calc-result__stat-value">{convResult.notation}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Diameter</p><p className="calc-result__stat-value">{fmt(convResult.diameterIn, 1)}″</p></div>
                    </div>
                </div>
            </>)}

            {/* ═══════ SPEEDOMETER ERROR ═══════ */}
            {ct === "speedo-error" && (<>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    <div className="calc-input-panel">
                        <TireGroup label="Original Tire (OEM)" w={seOldW} a={seOldA} r={seOldR} setW={setSeOldW} setA={setSeOldA} setR={setSeOldR} />
                    </div>
                    <div className="calc-input-panel">
                        <TireGroup label="New Tire" w={seNewW} a={seNewA} r={seNewR} setW={setSeNewW} setA={setSeNewA} setR={setSeNewR} />
                    </div>
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Speedometer Error</p>
                    <p className="calc-result__emi">{speedoResult.errorPct > 0 ? "+" : ""}{fmt(speedoResult.errorPct, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}>%</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Old Diameter</p><p className="calc-result__stat-value">{fmt(speedoResult.old.diameterIn, 2)}″</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">New Diameter</p><p className="calc-result__stat-value">{fmt(speedoResult.new.diameterIn, 2)}″</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">{speedoResult.errorPct > 0
                            ? `⚠️ Speedometer reads SLOW. At 60 mph indicated, actual speed is ${fmt(speedoResult.speeds.find(s => s.indicated === 60)?.actual ?? 0, 1)} mph.`
                            : speedoResult.errorPct < 0
                                ? `⚠️ Speedometer reads FAST. At 60 mph indicated, actual speed is ${fmt(speedoResult.speeds.find(s => s.indicated === 60)?.actual ?? 0, 1)} mph.`
                                : "✅ No speedometer error — tire diameters match."
                        }</p>
                    </div>
                </div>
                <div style={{marginTop: "var(--s-6)", overflowX: "auto"}}>
                    <h3 className="t-h3" style={{marginBottom: "var(--s-3)"}}>Speed Correction Table</h3>
                    <table className="comparison-table"><thead><tr><th>Speedo Shows</th><th>Actual Speed</th><th>Difference</th></tr></thead>
                        <tbody>{speedoResult.speeds.map(s => (
                            <tr key={s.indicated}>
                                <td>{s.indicated} mph</td>
                                <td style={{ fontWeight: 600 }}>{fmt(s.actual, 1)} mph</td>
                                <td style={{ color: Math.abs(s.actual - s.indicated) > 2 ? "#e74c3c" : "#27ae60" }}>{s.actual - s.indicated > 0 ? "+" : ""}{fmt(s.actual - s.indicated, 1)} mph</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            </>)}

            {/* ═══════ SPEEDOMETER GEAR ═══════ */}
            {ct === "speedo-gear" && (<>
                <div className="calc-input-panel">
                    <F label="🛞 Tire Diameter" value={sgTireDia} onChange={setSgTireDia} unit="inches" step={0.5} />
                    <F label="⚙️ Axle Ratio" value={sgAxleRatio} onChange={setSgAxleRatio} unit=":1" step={0.01} />
                    <F label="🔧 Drive Gear Teeth" value={sgDriveGear} onChange={setSgDriveGear} unit="teeth" step={1} min={1} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Driven Gear Teeth Needed</p>
                    <p className="calc-result__emi">{sgResult.drivenTeeth}<span style={{fontSize: "0.4em", fontWeight: 400}}> teeth</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Tire Revs/Mile</p><p className="calc-result__stat-value">{fmtI(sgResult.tireRevs)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Drive Gear</p><p className="calc-result__stat-value">{sgResult.driveGear} teeth</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 Formula: Driven Teeth = (Revs/Mile × Axle Ratio × Drive Teeth) ÷ 1,000</p>
                    </div>
                </div>
            </>)}

            {/* ═══════ WHEEL OFFSET ═══════ */}
            {ct === "wheel-offset" && (<>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    <div className="calc-input-panel">
                        <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px" }}>Current Wheel</p>
                        <F label="🛞 Width" value={woOldWidth} onChange={setWoOldWidth} unit="inches" step={0.5} />
                        <F label="📐 Offset (ET)" value={woOldOffset} onChange={setWoOldOffset} unit="mm" step={1} />
                    </div>
                    <div className="calc-input-panel">
                        <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px" }}>New Wheel</p>
                        <F label="🛞 Width" value={woNewWidth} onChange={setWoNewWidth} unit="inches" step={0.5} />
                        <F label="📐 Offset (ET)" value={woNewOffset} onChange={setWoNewOffset} unit="mm" step={1} />
                    </div>
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Wheel Fitment Change</p>
                    <p className="calc-result__emi">{offsetResult.outerChange > 0 ? "+" : ""}{fmt(offsetResult.outerChange, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> mm outer</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Inner Change</p><p className="calc-result__stat-value">{offsetResult.innerChange > 0 ? "+" : ""}{fmt(offsetResult.innerChange, 1)} mm</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Backspacing Change</p><p className="calc-result__stat-value">{offsetResult.bsChange > 0 ? "+" : ""}{fmt(offsetResult.bsChange, 1)} mm</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">{offsetResult.outerChange > 0
                            ? `⚠️ Wheel pokes ${fmt(offsetResult.outerChange, 1)}mm further out. Check fender clearance.`
                            : offsetResult.outerChange < 0
                                ? `✅ Wheel sits ${fmt(Math.abs(offsetResult.outerChange), 1)}mm further in. More fender clearance.`
                                : "No change in outer wheel position."
                        }</p>
                    </div>
                </div>
            </>)}

            {/* ═══════ TIRE PRESSURE ═══════ */}
            {ct === "tire-pressure" && (<>
                <div className="calc-input-panel">
                    <F label="🔧 Base Pressure" value={tpBase} onChange={setTpBase} unit="PSI" step={1} />
                    <F label="🌡️ Baseline Temperature" value={tpBaseTemp} onChange={setTpBaseTemp} unit="°F" step={1} />
                    <F label="🌡️ Current Temperature" value={tpCurrentTemp} onChange={setTpCurrentTemp} unit="°F" step={1} />
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Adjusted Tire Pressure</p>
                    <p className="calc-result__emi">{fmt(tpResult.adjusted, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> PSI</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">PSI Change</p><p className="calc-result__stat-value">{tpResult.psiChange > 0 ? "+" : ""}{fmt(tpResult.psiChange, 1)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Bar</p><p className="calc-result__stat-value">{fmt(tpResult.bar, 2)} bar</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">kPa</p><p className="calc-result__stat-value">{fmt(tpResult.kpa, 0)} kPa</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 Rule of thumb: Tire pressure changes ~1 PSI for every 10°F change. Always check when tires are cold.</p>
                    </div>
                </div>
            </>)}

            {/* ═══════ BOLT PATTERN ═══════ */}
            {ct === "bolt-pattern" && (<>
                <div className="calc-input-panel">
                    <div className="calc-field">
                        <label className="calc-field__label">🔧 Common Patterns</label>
                        <select className="calc-field__input" defaultValue="" onChange={e => { const b = BOLT_PATTERNS[+e.target.value]; if(b){ setBpBolts(b.bolts); setBpMeasurement(b.pcd); setBpUnit("mm"); } }} style={{ cursor: "pointer" }}>
                            <option value="" disabled>Select a bolt pattern...</option>
                            {BOLT_PATTERNS.map((b, i) => (<option key={b.label} value={i}>{b.label}</option>))}
                        </select>
                    </div>
                    <F label="🔢 Number of Bolts" value={bpBolts} onChange={setBpBolts} unit="#" step={1} min={3} />
                    <F label="📏 Bolt Measurement" value={bpMeasurement} onChange={setBpMeasurement} unit={bpUnit} step={bpUnit === "mm" ? 0.1 : 0.01} />
                    <div className="calc-field">
                        <label className="calc-field__label">📐 Measurement Unit</label>
                        <div className="tax-toggle">
                            {(["mm", "in"] as const).map(u => (
                                <button key={u} className={`tax-toggle__btn${bpUnit === u ? " active" : ""}`} onClick={() => setBpUnit(u)}>{u === "mm" ? "Millimeters" : "Inches"}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Bolt Pattern / PCD</p>
                    <p className="calc-result__emi" style={{fontSize: "2rem"}}>{bpResult.notation}</p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">PCD (mm)</p><p className="calc-result__stat-value">{fmt(bpResult.pcdMm, 1)} mm</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">PCD (inches)</p><p className="calc-result__stat-value">{fmt(bpResult.pcdIn, 2)}″</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">Nearest Standard</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{bpBolts}×{bpResult.nearest}</p></div>
                    </div>
                </div>
            </>)}
        </div>
    );
}
