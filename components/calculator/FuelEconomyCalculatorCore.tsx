"use client";

import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 2) => (isNaN(n) || !isFinite(n)) ? "—" : n.toFixed(d);
const fmtI = (n: number) => (isNaN(n) || !isFinite(n)) ? "—" : Math.round(n).toLocaleString("en-US");
const fmtUSD = (n: number) => (isNaN(n) || !isFinite(n)) ? "—" : "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

type CalcType = "gas-mileage" | "fuel-cost-us" | "fuel-savings" | "cost-per-mile" |
    "mpg-l100km" | "fuel-injector" | "fuel-range" | "annual-fuel" | "mpg-improvement";

interface Props { calcType: string; }

/* ── Design system field component ── */
const F = ({label, value, onChange, unit, step = 1, min}: {label: string; value: number; onChange: (v: number) => void; unit?: string; step?: number; min?: number}) => (
    <div className="calc-field">
        <label className="calc-field__label">{label}{unit && <span style={{ fontWeight: 400, opacity: 0.6 }}> ({unit})</span>}</label>
        <input type="number" className="calc-field__input" value={value} onChange={e => onChange(+e.target.value)} step={step} min={min} inputMode="decimal" />
    </div>
);

export default function FuelEconomyCalculatorCore({ calcType }: Props) {
    const ct = calcType as CalcType;

    /* ── Gas Mileage ── */
    const [gmMethod, setGmMethod] = useState<"distance" | "odometer">("distance");
    const [gmDistance, setGmDistance] = useState(300);
    const [gmFuel, setGmFuel] = useState(12);
    const [gmOdoStart, setGmOdoStart] = useState(45000);
    const [gmOdoEnd, setGmOdoEnd] = useState(45300);
    const [gmFuelPrice, setGmFuelPrice] = useState(3.15);

    /* ── Fuel Cost US ── */
    const [fcDistance, setFcDistance] = useState(500);
    const [fcMpg, setFcMpg] = useState(25);
    const [fcPrice, setFcPrice] = useState(3.15);

    /* ── Fuel Savings ── */
    const [fsMiles, setFsMiles] = useState(15000);
    const [fsMpg1, setFsMpg1] = useState(22);
    const [fsMpg2, setFsMpg2] = useState(35);
    const [fsPrice, setFsPrice] = useState(3.15);

    /* ── Cost Per Mile ── */
    const [cpmMiles, setCpmMiles] = useState(15000);
    const [cpmMpg, setCpmMpg] = useState(25);
    const [cpmFuelPrice, setCpmFuelPrice] = useState(3.15);
    const [cpmInsurance, setCpmInsurance] = useState(1800);
    const [cpmMaint, setCpmMaint] = useState(1200);
    const [cpmDeprec, setCpmDeprec] = useState(3500);
    const [cpmPayment, setCpmPayment] = useState(4800);

    /* ── MPG to L/100km ── */
    const [convValue, setConvValue] = useState(25);
    const [convFrom, setConvFrom] = useState<"mpg-us" | "mpg-imp" | "kml" | "l100km">("mpg-us");

    /* ── Fuel Injector ── */
    const [fiHp, setFiHp] = useState(400);
    const [fiBsfc, setFiBsfc] = useState(0.50);
    const [fiInjectors, setFiInjectors] = useState(8);
    const [fiDuty, setFiDuty] = useState(80);

    /* ── Fuel Range ── */
    const [frTank, setFrTank] = useState(16);
    const [frMpg, setFrMpg] = useState(25);
    const [frCurrent, setFrCurrent] = useState(100);

    /* ── Annual Fuel ── */
    const [afMiles, setAfMiles] = useState(15000);
    const [afMpg, setAfMpg] = useState(25);
    const [afPrice, setAfPrice] = useState(3.15);

    /* ── MPG Improvement ── */
    const [miMiles, setMiMiles] = useState(15000);
    const [miOldMpg, setMiOldMpg] = useState(20);
    const [miNewMpg, setMiNewMpg] = useState(30);
    const [miPrice, setMiPrice] = useState(3.15);

    /* ═══════ RESULTS ═══════ */

    const gmResult = useMemo(() => {
        const dist = gmMethod === "distance" ? gmDistance : (gmOdoEnd - gmOdoStart);
        if (!dist || !gmFuel || dist <= 0 || gmFuel <= 0) return null;
        const mpg = dist / gmFuel;
        const costPerMile = gmFuelPrice / mpg;
        return { mpg, kml: mpg * 0.425144, l100km: 235.215 / mpg, costPerMile, distance: dist };
    }, [gmMethod, gmDistance, gmFuel, gmOdoStart, gmOdoEnd, gmFuelPrice]);

    const fcResult = useMemo(() => {
        if (!fcMpg || fcMpg <= 0) return null;
        const gallons = fcDistance / fcMpg;
        const cost = gallons * fcPrice;
        const costPerMile = fcPrice / fcMpg;
        return { gallons, cost, costPerMile, liters: gallons * 3.78541, costPerKm: costPerMile / 1.60934 };
    }, [fcDistance, fcMpg, fcPrice]);

    const fsResult = useMemo(() => {
        if (!fsMpg1 || !fsMpg2 || fsMpg1 <= 0 || fsMpg2 <= 0) return null;
        const cost1 = (fsMiles / fsMpg1) * fsPrice;
        const cost2 = (fsMiles / fsMpg2) * fsPrice;
        const savings = cost1 - cost2;
        const gal1 = fsMiles / fsMpg1;
        const gal2 = fsMiles / fsMpg2;
        return { cost1, cost2, savings, galSaved: gal1 - gal2, gal1, gal2, savings5yr: savings * 5 };
    }, [fsMiles, fsMpg1, fsMpg2, fsPrice]);

    const cpmResult = useMemo(() => {
        if (!cpmMpg || cpmMpg <= 0 || !cpmMiles || cpmMiles <= 0) return null;
        const fuelCost = (cpmMiles / cpmMpg) * cpmFuelPrice;
        const totalAnnual = fuelCost + cpmInsurance + cpmMaint + cpmDeprec + cpmPayment;
        const perMile = totalAnnual / cpmMiles;
        return { fuelCost, totalAnnual, perMile, perKm: perMile / 1.60934, fuelPerMile: cpmFuelPrice / cpmMpg };
    }, [cpmMiles, cpmMpg, cpmFuelPrice, cpmInsurance, cpmMaint, cpmDeprec, cpmPayment]);

    const convResult = useMemo(() => {
        let mpgUs: number;
        if (convFrom === "mpg-us") mpgUs = convValue;
        else if (convFrom === "mpg-imp") mpgUs = convValue * 0.832674;
        else if (convFrom === "kml") mpgUs = convValue / 0.425144;
        else mpgUs = 235.215 / convValue;
        return { mpgUs, mpgImp: mpgUs / 0.832674, kml: mpgUs * 0.425144, l100km: 235.215 / mpgUs, milesPerLiter: mpgUs * 0.264172 };
    }, [convValue, convFrom]);

    const fiResult = useMemo(() => {
        if (!fiInjectors || fiInjectors <= 0 || !fiDuty || fiDuty <= 0) return null;
        const lbPerHr = (fiHp * fiBsfc) / (fiInjectors * (fiDuty / 100));
        return { lbPerHr, ccPerMin: lbPerHr * 10.5, totalFlow: lbPerHr * fiInjectors };
    }, [fiHp, fiBsfc, fiInjectors, fiDuty]);

    const frResult = useMemo(() => {
        if (!frMpg || frMpg <= 0) return null;
        const usableFuel = frTank * (frCurrent / 100);
        const range = usableFuel * frMpg;
        return { range, rangeKm: range * 1.60934, usableFuel, fullRange: frTank * frMpg };
    }, [frTank, frMpg, frCurrent]);

    const afResult = useMemo(() => {
        if (!afMpg || afMpg <= 0) return null;
        const gallons = afMiles / afMpg;
        const cost = gallons * afPrice;
        return { gallons, cost, monthly: cost / 12, weekly: cost / 52, daily: cost / 365 };
    }, [afMiles, afMpg, afPrice]);

    const miResult = useMemo(() => {
        if (!miOldMpg || !miNewMpg || miOldMpg <= 0 || miNewMpg <= 0) return null;
        const oldCost = (miMiles / miOldMpg) * miPrice;
        const newCost = (miMiles / miNewMpg) * miPrice;
        const annualSavings = oldCost - newCost;
        const galSaved = (miMiles / miOldMpg) - (miMiles / miNewMpg);
        return { oldCost, newCost, annualSavings, galSaved, savings5yr: annualSavings * 5, savings10yr: annualSavings * 10 };
    }, [miMiles, miOldMpg, miNewMpg, miPrice]);

    /* ═══════ RENDER ═══════ */
    return (
        <div>
            {/* ═══════ GAS MILEAGE ═══════ */}
            {ct === "gas-mileage" && (<>
                <div className="calc-input-panel">
                    <div className="calc-field">
                        <label className="calc-field__label">Calculation Method</label>
                        <div className="tax-toggle">
                            {([["distance", "Distance Method"], ["odometer", "Odometer Method"]] as const).map(([m, label]) => (
                                <button key={m} className={`tax-toggle__btn${gmMethod === m ? " active" : ""}`} onClick={() => setGmMethod(m)}>{label}</button>
                            ))}
                        </div>
                    </div>
                    {gmMethod === "distance" ? <>
                        <F label="🛣️ Trip Distance" value={gmDistance} onChange={setGmDistance} unit="miles" step={10} />
                        <F label="⛽ Fuel Used" value={gmFuel} onChange={setGmFuel} unit="gallons" step={0.5} min={0.1} />
                        <F label="💲 Fuel Price" value={gmFuelPrice} onChange={setGmFuelPrice} unit="$/gal" step={0.05} />
                    </> : <>
                        <F label="📊 Start Odometer" value={gmOdoStart} onChange={setGmOdoStart} unit="miles" step={1} />
                        <F label="📊 End Odometer" value={gmOdoEnd} onChange={setGmOdoEnd} unit="miles" step={1} />
                        <F label="⛽ Fuel Used" value={gmFuel} onChange={setGmFuel} unit="gallons" step={0.5} min={0.1} />
                        <F label="💲 Fuel Price" value={gmFuelPrice} onChange={setGmFuelPrice} unit="$/gal" step={0.05} />
                    </>}
                </div>
                {gmResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Gas Mileage</p>
                        <p className="calc-result__emi">{fmt(gmResult.mpg, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> MPG</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">km/L</p><p className="calc-result__stat-value">{fmt(gmResult.kml, 1)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">L/100km</p><p className="calc-result__stat-value">{fmt(gmResult.l100km, 1)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Cost/Mile</p><p className="calc-result__stat-value">{fmtUSD(gmResult.costPerMile)}</p></div>
                        </div>
                        <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                            <p className="calc-result__breakdown-line">💡 MPG = Distance ÷ Fuel = {fmtI(gmResult.distance)} mi ÷ {fmt(gmFuel, 1)} gal = <strong>{fmt(gmResult.mpg, 1)} MPG</strong></p>
                        </div>
                    </div>
                )}
            </>)}

            {/* ═══════ FUEL COST ═══════ */}
            {ct === "fuel-cost-us" && (<>
                <div className="calc-input-panel">
                    <F label="🛣️ Trip Distance" value={fcDistance} onChange={setFcDistance} unit="miles" step={10} />
                    <F label="⛽ Fuel Efficiency" value={fcMpg} onChange={setFcMpg} unit="MPG" step={1} min={1} />
                    <F label="💲 Gas Price" value={fcPrice} onChange={setFcPrice} unit="$/gal" step={0.05} />
                </div>
                {fcResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Trip Fuel Cost</p>
                        <p className="calc-result__emi">{fmtUSD(fcResult.cost)}</p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Fuel Needed</p><p className="calc-result__stat-value">{fmt(fcResult.gallons, 1)} gal</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Fuel (Liters)</p><p className="calc-result__stat-value">{fmt(fcResult.liters, 1)} L</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Cost/Mile</p><p className="calc-result__stat-value">{fmtUSD(fcResult.costPerMile)}</p></div>
                        </div>
                    </div>
                )}
                {fcResult && (
                    <div style={{marginTop: "var(--s-6)", overflowX: "auto"}}>
                        <h3 className="t-h3" style={{marginBottom: "var(--s-3)"}}>Quick Distance Reference</h3>
                        <table className="comparison-table"><thead><tr><th>Distance</th><th>Fuel</th><th>Cost</th></tr></thead>
                            <tbody>{[50, 100, 250, 500, 1000].map(d => (
                                <tr key={d}><td>{fmtI(d)} mi</td><td>{fmt(d / fcMpg, 1)} gal</td><td>{fmtUSD((d / fcMpg) * fcPrice)}</td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}
            </>)}

            {/* ═══════ FUEL SAVINGS ═══════ */}
            {ct === "fuel-savings" && (<>
                <div className="calc-input-panel">
                    <F label="🛣️ Annual Miles" value={fsMiles} onChange={setFsMiles} unit="miles/yr" step={500} />
                    <F label="💲 Gas Price" value={fsPrice} onChange={setFsPrice} unit="$/gal" step={0.05} />
                    <F label="🚗 Vehicle 1 MPG" value={fsMpg1} onChange={setFsMpg1} unit="MPG" step={1} min={1} />
                    <F label="🚙 Vehicle 2 MPG" value={fsMpg2} onChange={setFsMpg2} unit="MPG" step={1} min={1} />
                </div>
                {fsResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Annual Fuel Savings</p>
                        <p className="calc-result__emi">{fmtUSD(Math.abs(fsResult.savings))}<span style={{fontSize: "0.4em", fontWeight: 400}}>/year</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Vehicle 1 Cost</p><p className="calc-result__stat-value">{fmtUSD(fsResult.cost1)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Vehicle 2 Cost</p><p className="calc-result__stat-value">{fmtUSD(fsResult.cost2)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Gallons Saved</p><p className="calc-result__stat-value">{fmtI(Math.abs(fsResult.galSaved))} gal</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">5-Year Savings</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{fmtUSD(Math.abs(fsResult.savings5yr))}</p></div>
                        </div>
                        <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                            <p className="calc-result__breakdown-line">{fsResult.savings > 0
                                ? `✅ Vehicle 2 saves ${fmtUSD(fsResult.savings)}/year — switching from ${fsMpg1} to ${fsMpg2} MPG saves ${fmtI(Math.abs(fsResult.galSaved))} gallons annually.`
                                : `ℹ️ Vehicle 1 is already more fuel-efficient — it costs ${fmtUSD(Math.abs(fsResult.savings))}/year less to fuel.`
                            }</p>
                        </div>
                    </div>
                )}
            </>)}

            {/* ═══════ COST PER MILE ═══════ */}
            {ct === "cost-per-mile" && (<>
                <div className="calc-input-panel">
                    <F label="🛣️ Annual Miles" value={cpmMiles} onChange={setCpmMiles} unit="miles/yr" step={500} />
                    <F label="⛽ Vehicle MPG" value={cpmMpg} onChange={setCpmMpg} unit="MPG" step={1} min={1} />
                    <F label="💲 Gas Price" value={cpmFuelPrice} onChange={setCpmFuelPrice} unit="$/gal" step={0.05} />
                    <F label="🛡️ Insurance" value={cpmInsurance} onChange={setCpmInsurance} unit="$/yr" step={100} />
                    <F label="🔧 Maintenance" value={cpmMaint} onChange={setCpmMaint} unit="$/yr" step={100} />
                    <F label="📉 Depreciation" value={cpmDeprec} onChange={setCpmDeprec} unit="$/yr" step={100} />
                    <F label="💳 Loan Payment" value={cpmPayment} onChange={setCpmPayment} unit="$/yr" step={100} />
                </div>
                {cpmResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">True Cost Per Mile</p>
                        <p className="calc-result__emi">{fmtUSD(cpmResult.perMile)}<span style={{fontSize: "0.4em", fontWeight: 400}}>/mile</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Fuel/Mile</p><p className="calc-result__stat-value">{fmtUSD(cpmResult.fuelPerMile)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Annual Fuel</p><p className="calc-result__stat-value">{fmtUSD(cpmResult.fuelCost)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Total Annual</p><p className="calc-result__stat-value">{fmtUSD(cpmResult.totalAnnual)}</p></div>
                        </div>
                    </div>
                )}
                {cpmResult && (
                    <div style={{marginTop: "var(--s-6)", overflowX: "auto"}}>
                        <h3 className="t-h3" style={{marginBottom: "var(--s-3)"}}>Cost Breakdown</h3>
                        <table className="comparison-table"><thead><tr><th>Category</th><th>Annual</th><th>Per Mile</th></tr></thead>
                            <tbody>
                                {([["Fuel", cpmResult.fuelCost], ["Insurance", cpmInsurance], ["Maintenance", cpmMaint], ["Depreciation", cpmDeprec], ["Loan Payment", cpmPayment]] as [string, number][]).map(([cat, val]) => (
                                    <tr key={cat}><td>{cat}</td><td>{fmtUSD(val)}</td><td>{fmtUSD(val / cpmMiles)}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>)}

            {/* ═══════ MPG CONVERTER ═══════ */}
            {ct === "mpg-l100km" && (<>
                <div className="calc-input-panel">
                    <F label="📊 Value" value={convValue} onChange={setConvValue} unit={convFrom === "mpg-us" ? "MPG" : convFrom === "mpg-imp" ? "MPG Imp" : convFrom === "kml" ? "km/L" : "L/100km"} step={0.5} min={0.1} />
                    <div className="calc-field">
                        <label className="calc-field__label">🔄 Convert From</label>
                        <select className="calc-field__input" value={convFrom} onChange={e => setConvFrom(e.target.value as typeof convFrom)} style={{ cursor: "pointer" }}>
                            <option value="mpg-us">MPG (US)</option>
                            <option value="mpg-imp">MPG (Imperial)</option>
                            <option value="kml">km/L</option>
                            <option value="l100km">L/100km</option>
                        </select>
                    </div>
                </div>
                <div className="calc-result" aria-live="polite">
                    <p className="calc-result__label">Fuel Economy Equivalents</p>
                    <p className="calc-result__emi">{fmt(convResult.mpgUs, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> MPG (US)</span></p>
                    <div className="calc-result__stats">
                        <div className="calc-result__stat"><p className="calc-result__stat-label">MPG (Imperial)</p><p className="calc-result__stat-value">{fmt(convResult.mpgImp, 2)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">km/L</p><p className="calc-result__stat-value">{fmt(convResult.kml, 2)}</p></div>
                        <div className="calc-result__stat"><p className="calc-result__stat-label">L/100km</p><p className="calc-result__stat-value">{fmt(convResult.l100km, 2)}</p></div>
                    </div>
                    <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                        <p className="calc-result__breakdown-line">💡 L/100km = 235.215 ÷ MPG (US) | 1 US gal = 3.785 L | 1 Imp gal = 4.546 L</p>
                    </div>
                </div>
            </>)}

            {/* ═══════ FUEL INJECTOR ═══════ */}
            {ct === "fuel-injector" && (<>
                <div className="calc-input-panel">
                    <F label="🏎️ Target HP" value={fiHp} onChange={setFiHp} unit="HP" step={10} min={1} />
                    <F label="⛽ BSFC" value={fiBsfc} onChange={setFiBsfc} unit="lb/HP-hr" step={0.01} />
                    <F label="💉 Number of Injectors" value={fiInjectors} onChange={setFiInjectors} unit="#" step={1} min={1} />
                    <F label="📊 Max Duty Cycle" value={fiDuty} onChange={setFiDuty} unit="%" step={1} min={10} />
                </div>
                {fiResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Required Injector Flow Rate</p>
                        <p className="calc-result__emi">{fmt(fiResult.lbPerHr, 1)}<span style={{fontSize: "0.4em", fontWeight: 400}}> lb/hr</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">cc/min</p><p className="calc-result__stat-value">{fmtI(fiResult.ccPerMin)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Total System Flow</p><p className="calc-result__stat-value">{fmt(fiResult.totalFlow, 1)} lb/hr</p></div>
                        </div>
                        <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                            <p className="calc-result__breakdown-line">💡 Flow = (HP × BSFC) ÷ (Injectors × Duty%) = ({fmtI(fiHp)} × {fmt(fiBsfc)}) ÷ ({fiInjectors} × {fiDuty}%) = <strong>{fmt(fiResult.lbPerHr, 1)} lb/hr</strong></p>
                        </div>
                    </div>
                )}
                {fiResult && (
                    <div style={{marginTop: "var(--s-6)", overflowX: "auto"}}>
                        <h3 className="t-h3" style={{marginBottom: "var(--s-3)"}}>Typical BSFC by Engine Type</h3>
                        <table className="comparison-table"><thead><tr><th>Engine Type</th><th>Typical BSFC</th></tr></thead>
                            <tbody>
                                {[["N/A Gasoline", "0.45–0.50"], ["Turbo Gasoline", "0.55–0.65"], ["Supercharged", "0.55–0.60"], ["E85", "0.65–0.70"], ["Methanol", "0.90–1.00"]].map(([type, bsfc]) => (
                                    <tr key={type}><td>{type}</td><td>{bsfc} lb/HP-hr</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>)}

            {/* ═══════ FUEL RANGE ═══════ */}
            {ct === "fuel-range" && (<>
                <div className="calc-input-panel">
                    <F label="⛽ Tank Size" value={frTank} onChange={setFrTank} unit="gallons" step={0.5} />
                    <F label="🏎️ Vehicle MPG" value={frMpg} onChange={setFrMpg} unit="MPG" step={1} min={1} />
                    <F label="📊 Current Fuel Level" value={frCurrent} onChange={setFrCurrent} unit="%" step={5} min={0} />
                </div>
                {frResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Driving Range</p>
                        <p className="calc-result__emi">{fmtI(frResult.range)}<span style={{fontSize: "0.4em", fontWeight: 400}}> miles</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Range (km)</p><p className="calc-result__stat-value">{fmtI(frResult.rangeKm)} km</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Usable Fuel</p><p className="calc-result__stat-value">{fmt(frResult.usableFuel, 1)} gal</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Full Tank Range</p><p className="calc-result__stat-value">{fmtI(frResult.fullRange)} mi</p></div>
                        </div>
                    </div>
                )}
            </>)}

            {/* ═══════ ANNUAL FUEL ═══════ */}
            {ct === "annual-fuel" && (<>
                <div className="calc-input-panel">
                    <F label="🛣️ Annual Miles" value={afMiles} onChange={setAfMiles} unit="miles/yr" step={500} />
                    <F label="⛽ Vehicle MPG" value={afMpg} onChange={setAfMpg} unit="MPG" step={1} min={1} />
                    <F label="💲 Gas Price" value={afPrice} onChange={setAfPrice} unit="$/gal" step={0.05} />
                </div>
                {afResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">Annual Fuel Cost</p>
                        <p className="calc-result__emi">{fmtUSD(afResult.cost)}<span style={{fontSize: "0.4em", fontWeight: 400}}>/year</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Monthly</p><p className="calc-result__stat-value">{fmtUSD(afResult.monthly)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Weekly</p><p className="calc-result__stat-value">{fmtUSD(afResult.weekly)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Daily</p><p className="calc-result__stat-value">{fmtUSD(afResult.daily)}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Gallons/Year</p><p className="calc-result__stat-value">{fmtI(afResult.gallons)} gal</p></div>
                        </div>
                        <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                            <p className="calc-result__breakdown-line">💡 ({fmtI(afMiles)} mi ÷ {fmtI(afMpg)} MPG) × ${fmt(afPrice)} = <strong>{fmtUSD(afResult.cost)}/year</strong></p>
                        </div>
                    </div>
                )}
            </>)}

            {/* ═══════ MPG IMPROVEMENT ═══════ */}
            {ct === "mpg-improvement" && (<>
                <div className="calc-input-panel">
                    <F label="🛣️ Annual Miles" value={miMiles} onChange={setMiMiles} unit="miles/yr" step={500} />
                    <F label="💲 Gas Price" value={miPrice} onChange={setMiPrice} unit="$/gal" step={0.05} />
                    <F label="⛽ Current MPG" value={miOldMpg} onChange={setMiOldMpg} unit="MPG" step={1} min={1} />
                    <F label="⛽ New MPG" value={miNewMpg} onChange={setMiNewMpg} unit="MPG" step={1} min={1} />
                </div>
                {miResult && (
                    <div className="calc-result" aria-live="polite">
                        <p className="calc-result__label">MPG Improvement Savings</p>
                        <p className="calc-result__emi">{fmtUSD(Math.abs(miResult.annualSavings))}<span style={{fontSize: "0.4em", fontWeight: 400}}>/year</span></p>
                        <div className="calc-result__stats">
                            <div className="calc-result__stat"><p className="calc-result__stat-label">Gallons Saved</p><p className="calc-result__stat-value">{fmtI(Math.abs(miResult.galSaved))} gal</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">5-Year Savings</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{fmtUSD(Math.abs(miResult.savings5yr))}</p></div>
                            <div className="calc-result__stat"><p className="calc-result__stat-label">10-Year Savings</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{fmtUSD(Math.abs(miResult.savings10yr))}</p></div>
                        </div>
                        <div className="calc-result__breakdown" style={{marginTop: "var(--s-3)"}}>
                            <p className="calc-result__breakdown-line">💡 At {miOldMpg} MPG: {fmtUSD(miResult.oldCost)}/yr → At {miNewMpg} MPG: {fmtUSD(miResult.newCost)}/yr</p>
                        </div>
                    </div>
                )}
            </>)}
        </div>
    );
}
