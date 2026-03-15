"use client";

import { useState, useMemo } from "react";

const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (n: number) => Math.ceil(n).toLocaleString("en-US");
const fmtUSD = (n: number) => `$${fmt(n, 2)}`;

function ResultRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
    return (
        <div className="con-result-row">
            <span className="con-result-row__label">{label}</span>
            <span className="con-result-row__value">{value}{unit ? <span className="con-result-row__unit"> {unit}</span> : null}</span>
        </div>
    );
}

function InputField({ label, value, onChange, unit, min, max, step }: {
    label: string; value: number; onChange: (v: number) => void; unit?: string;
    min?: number; max?: number; step?: number;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value}
                onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step || 1} />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

/* ──── 1. EV vs Gas Cost Comparison ──── */
function EvVsGasCalc() {
    const [annualMiles, setAnnualMiles] = useState(12000);
    const [gasMpg, setGasMpg] = useState(28);
    const [gasPrice, setGasPrice] = useState(3.50);
    const [evEfficiency, setEvEfficiency] = useState(3.5);
    const [elecRate, setElecRate] = useState(0.14);
    const r = useMemo(() => {
        const gasFuelCost = (annualMiles / gasMpg) * gasPrice;
        const evFuelCost = (annualMiles / evEfficiency) * elecRate;
        const gasMaint = annualMiles * 0.09; const evMaint = annualMiles * 0.03;
        return { gasFuelCost, evFuelCost, gasMaint, evMaint, fuelSavings: gasFuelCost - evFuelCost, totalSavings: (gasFuelCost + gasMaint) - (evFuelCost + evMaint) };
    }, [annualMiles, gasMpg, gasPrice, evEfficiency, elecRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚡ EV vs Gas Cost Comparison</h3>
        <div className="con-calc__inputs">
            <InputField label="Annual Miles" value={annualMiles} onChange={setAnnualMiles} unit="mi" min={1000} step={1000} />
            <InputField label="Gas Car MPG" value={gasMpg} onChange={setGasMpg} unit="MPG" min={10} />
            <InputField label="Gas Price" value={gasPrice} onChange={setGasPrice} unit="$/gal" min={1} step={0.1} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="mi/kWh" min={1} step={0.1} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="$/kWh" min={0.05} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Annual Cost Comparison</h4>
            <ResultRow label="Gas Fuel Cost" value={fmtUSD(r.gasFuelCost)} /><ResultRow label="EV Electricity Cost" value={fmtUSD(r.evFuelCost)} />
            <ResultRow label="Gas Maintenance" value={fmtUSD(r.gasMaint)} /><ResultRow label="EV Maintenance" value={fmtUSD(r.evMaint)} />
            <ResultRow label="Fuel Savings" value={fmtUSD(r.fuelSavings)} unit="/yr" /><ResultRow label="Total Savings" value={fmtUSD(r.totalSavings)} unit="/yr" />
        </div></div>);
}

/* ──── 2. EV Charging Cost ──── */
function EvChargingCostCalc() {
    const [batteryKwh, setBatteryKwh] = useState(75);
    const [currentPct, setCurrentPct] = useState(20);
    const [targetPct, setTargetPct] = useState(80);
    const [homeRate, setHomeRate] = useState(0.14);
    const [dcRate, setDcRate] = useState(0.35);
    const r = useMemo(() => {
        const kwhNeeded = batteryKwh * (targetPct - currentPct) / 100;
        return { kwhNeeded, homeCost: kwhNeeded * homeRate, dcCost: kwhNeeded * dcRate };
    }, [batteryKwh, currentPct, targetPct, homeRate, dcRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔌 EV Charging Cost Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="Current Charge" value={currentPct} onChange={setCurrentPct} unit="%" min={0} max={99} />
            <InputField label="Target Charge" value={targetPct} onChange={setTargetPct} unit="%" min={1} max={100} />
            <InputField label="Home Rate" value={homeRate} onChange={setHomeRate} unit="$/kWh" min={0.05} step={0.01} />
            <InputField label="DC Fast Rate" value={dcRate} onChange={setDcRate} unit="$/kWh" min={0.1} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Energy Needed" value={fmt(r.kwhNeeded, 1)} unit="kWh" />
            <ResultRow label="Cost at Home" value={fmtUSD(r.homeCost)} /><ResultRow label="Cost at DC Fast" value={fmtUSD(r.dcCost)} />
        </div></div>);
}

/* ──── 3. EV Fuel Savings ──── */
function EvFuelSavingsCalc() {
    const [annualMiles, setAnnualMiles] = useState(12000);
    const [gasMpg, setGasMpg] = useState(28);
    const [gasPrice, setGasPrice] = useState(3.50);
    const [evEfficiency, setEvEfficiency] = useState(3.5);
    const [elecRate, setElecRate] = useState(0.14);
    const r = useMemo(() => {
        const gasCost = (annualMiles / gasMpg) * gasPrice;
        const evCost = (annualMiles / evEfficiency) * elecRate;
        const savings = gasCost - evCost;
        return { gasCost, evCost, savings, savings5yr: savings * 5, savings10yr: savings * 10 };
    }, [annualMiles, gasMpg, gasPrice, evEfficiency, elecRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">💰 EV Fuel Savings Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Annual Miles" value={annualMiles} onChange={setAnnualMiles} unit="mi" min={1000} step={1000} />
            <InputField label="Gas Car MPG" value={gasMpg} onChange={setGasMpg} unit="MPG" min={10} />
            <InputField label="Gas Price" value={gasPrice} onChange={setGasPrice} unit="$/gal" min={1} step={0.1} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="mi/kWh" min={1} step={0.1} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="$/kWh" min={0.05} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Annual Gas Cost" value={fmtUSD(r.gasCost)} /><ResultRow label="Annual EV Cost" value={fmtUSD(r.evCost)} />
            <ResultRow label="Annual Savings" value={fmtUSD(r.savings)} /><ResultRow label="5-Year Savings" value={fmtUSD(r.savings5yr)} />
            <ResultRow label="10-Year Savings" value={fmtUSD(r.savings10yr)} />
        </div></div>);
}

/* ──── 4. EV Total Cost of Ownership ──── */
function EvTcoCalc() {
    const [purchasePrice, setPurchasePrice] = useState(35000);
    const [years, setYears] = useState(5);
    const [annualMiles, setAnnualMiles] = useState(12000);
    const [elecRate, setElecRate] = useState(0.14);
    const [evEfficiency, setEvEfficiency] = useState(3.5);
    const r = useMemo(() => {
        const charging = (annualMiles / evEfficiency) * elecRate * years;
        const maintenance = annualMiles * 0.03 * years;
        const insurance = 1800 * years;
        const depreciation = purchasePrice * (1 - Math.pow(0.85, years));
        const tco = purchasePrice + charging + maintenance + insurance - (purchasePrice - depreciation);
        const perMile = tco / (annualMiles * years);
        return { charging, maintenance, insurance, depreciation, tco, perMile };
    }, [purchasePrice, years, annualMiles, elecRate, evEfficiency]);
    return (<div className="con-calc"><h3 className="con-calc__title">📊 EV Total Cost of Ownership</h3>
        <div className="con-calc__inputs">
            <InputField label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} unit="$" min={15000} step={1000} />
            <InputField label="Ownership Period" value={years} onChange={setYears} unit="years" min={1} max={15} />
            <InputField label="Annual Miles" value={annualMiles} onChange={setAnnualMiles} unit="mi" min={5000} step={1000} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="$/kWh" min={0.05} step={0.01} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="mi/kWh" min={1} step={0.1} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Charging Cost" value={fmtUSD(r.charging)} /><ResultRow label="Maintenance" value={fmtUSD(r.maintenance)} />
            <ResultRow label="Insurance" value={fmtUSD(r.insurance)} /><ResultRow label="Depreciation" value={fmtUSD(r.depreciation)} />
            <ResultRow label="Total Cost of Ownership" value={fmtUSD(r.tco)} /><ResultRow label="Cost per Mile" value={fmtUSD(r.perMile)} />
        </div></div>);
}

/* ──── 5. EV Tax Credit ──── */
function EvTaxCreditCalc() {
    const [msrp, setMsrp] = useState(45000);
    const [vehicleType, setVehicleType] = useState("new-suv");
    const [agi, setAgi] = useState(120000);
    const [filingStatus, setFilingStatus] = useState("single");
    const r = useMemo(() => {
        const msrpLimit: Record<string, number> = { "new-sedan": 55000, "new-suv": 80000, "used": 25000 };
        const agiLimit: Record<string, Record<string, number>> = {
            "new-sedan": { single: 150000, joint: 300000 }, "new-suv": { single: 150000, joint: 300000 },
            "used": { single: 75000, joint: 150000 },
        };
        const maxCredit = vehicleType === "used" ? 4000 : 7500;
        const msrpOk = msrp <= (msrpLimit[vehicleType] || 80000);
        const agiOk = agi <= ((agiLimit[vehicleType] || {})[filingStatus] || 150000);
        const eligible = msrpOk && agiOk;
        return { maxCredit, msrpOk, agiOk, eligible, credit: eligible ? maxCredit : 0 };
    }, [msrp, vehicleType, agi, filingStatus]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏛️ EV Tax Credit Calculator</h3>
        <div className="con-calc__inputs">
            <SelectField label="Vehicle Type" value={vehicleType} onChange={setVehicleType} options={[
                { value: "new-sedan", label: "New Sedan/Hatchback (≤$55K)" }, { value: "new-suv", label: "New SUV/Truck/Van (≤$80K)" },
                { value: "used", label: "Used EV (≤$25K)" },
            ]} />
            <InputField label="Vehicle MSRP" value={msrp} onChange={setMsrp} unit="$" min={10000} step={1000} />
            <SelectField label="Filing Status" value={filingStatus} onChange={setFilingStatus} options={[
                { value: "single", label: "Single" }, { value: "joint", label: "Married Filing Jointly" },
            ]} />
            <InputField label="Adjusted Gross Income" value={agi} onChange={setAgi} unit="$" min={10000} step={5000} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="MSRP Eligible" value={r.msrpOk ? "✅ Yes" : "❌ Over limit"} />
            <ResultRow label="Income Eligible" value={r.agiOk ? "✅ Yes" : "❌ Over limit"} />
            <ResultRow label="Estimated Credit" value={fmtUSD(r.credit)} />
            <ResultRow label="Effective Price" value={fmtUSD(msrp - r.credit)} />
        </div></div>);
}

/* ──── 6. EV Lease vs Buy ──── */
function EvLeaseBuyCalc() {
    const [msrp, setMsrp] = useState(45000);
    const [downPayment, setDownPayment] = useState(3000);
    const [loanRate, setLoanRate] = useState(5.5);
    const [loanTerm, setLoanTerm] = useState(60);
    const [residualPct, setResidualPct] = useState(55);
    const [leaseTerm, setLeaseTerm] = useState(36);
    const [moneyFactor, setMoneyFactor] = useState(0.002);
    const r = useMemo(() => {
        const loanAmt = msrp - downPayment;
        const mr = loanRate / 100 / 12;
        const buyMonthly = mr > 0 ? loanAmt * mr / (1 - Math.pow(1 + mr, -loanTerm)) : loanAmt / loanTerm;
        const buyTotal = buyMonthly * loanTerm + downPayment;
        const residual = msrp * residualPct / 100;
        const depreciation = (msrp - residual) / leaseTerm;
        const financeCharge = (msrp + residual) * moneyFactor;
        const leaseMonthly = depreciation + financeCharge;
        const leaseTotal = leaseMonthly * leaseTerm + downPayment;
        return { buyMonthly, buyTotal, leaseMonthly, leaseTotal, residual };
    }, [msrp, downPayment, loanRate, loanTerm, residualPct, leaseTerm, moneyFactor]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔑 EV Lease vs Buy Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Vehicle MSRP" value={msrp} onChange={setMsrp} unit="$" min={20000} step={1000} />
            <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} unit="$" min={0} step={500} />
            <InputField label="Loan APR" value={loanRate} onChange={setLoanRate} unit="%" min={0} step={0.5} />
            <InputField label="Loan Term" value={loanTerm} onChange={setLoanTerm} unit="months" min={24} max={84} step={12} />
            <InputField label="Lease Residual" value={residualPct} onChange={setResidualPct} unit="%" min={30} max={70} />
            <InputField label="Lease Term" value={leaseTerm} onChange={setLeaseTerm} unit="months" min={24} max={48} step={12} />
        </div>
        <div className="con-calc__results"><h4>Buy</h4>
            <ResultRow label="Monthly Payment" value={fmtUSD(r.buyMonthly)} /><ResultRow label="Total Cost" value={fmtUSD(r.buyTotal)} />
            <h4>Lease</h4>
            <ResultRow label="Monthly Payment" value={fmtUSD(r.leaseMonthly)} /><ResultRow label="Total Cost" value={fmtUSD(r.leaseTotal)} />
        </div></div>);
}

/* ──── 7. EV Charging Time ──── */
function EvChargingTimeCalc() {
    const [batteryKwh, setBatteryKwh] = useState(75);
    const [currentPct, setCurrentPct] = useState(20);
    const [targetPct, setTargetPct] = useState(80);
    const r = useMemo(() => {
        const kwhNeeded = batteryKwh * (targetPct - currentPct) / 100;
        const l1 = kwhNeeded / 1.4; const l2 = kwhNeeded / 7.7; const l2fast = kwhNeeded / 11.5; const dc50 = kwhNeeded / 50; const dc150 = kwhNeeded / 150; const dc350 = kwhNeeded / 350;
        return { kwhNeeded, l1, l2, l2fast, dc50, dc150, dc350 };
    }, [batteryKwh, currentPct, targetPct]);
    const fmtTime = (h: number) => h >= 1 ? `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m` : `${Math.round(h * 60)}m`;
    return (<div className="con-calc"><h3 className="con-calc__title">⏱️ EV Charging Time Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="Current Charge" value={currentPct} onChange={setCurrentPct} unit="%" min={0} max={99} />
            <InputField label="Target Charge" value={targetPct} onChange={setTargetPct} unit="%" min={1} max={100} />
        </div>
        <div className="con-calc__results"><h4>Charging Times</h4>
            <ResultRow label="Level 1 (120V, 1.4 kW)" value={fmtTime(r.l1)} /><ResultRow label="Level 2 (240V, 7.7 kW)" value={fmtTime(r.l2)} />
            <ResultRow label="Level 2 Fast (11.5 kW)" value={fmtTime(r.l2fast)} /><ResultRow label="DC Fast (50 kW)" value={fmtTime(r.dc50)} />
            <ResultRow label="DC Fast (150 kW)" value={fmtTime(r.dc150)} /><ResultRow label="DC Ultra (350 kW)" value={fmtTime(r.dc350)} />
        </div></div>);
}

/* ──── 8. EV Range ──── */
function EvRangeCalc() {
    const [batteryKwh, setBatteryKwh] = useState(75);
    const [efficiency, setEfficiency] = useState(3.5);
    const [usablePercent, setUsablePercent] = useState(95);
    const r = useMemo(() => {
        const usableKwh = batteryKwh * usablePercent / 100;
        const rangeMi = usableKwh * efficiency;
        return { usableKwh, rangeMi, rangeKm: rangeMi * 1.60934, whPerMile: (usableKwh * 1000) / rangeMi };
    }, [batteryKwh, efficiency, usablePercent]);
    return (<div className="con-calc"><h3 className="con-calc__title">🛣️ EV Range Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="Efficiency" value={efficiency} onChange={setEfficiency} unit="mi/kWh" min={1} step={0.1} />
            <InputField label="Usable Battery" value={usablePercent} onChange={setUsablePercent} unit="%" min={80} max={100} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Usable Energy" value={fmt(r.usableKwh, 1)} unit="kWh" /><ResultRow label="Estimated Range" value={fmt(r.rangeMi, 0)} unit="miles" />
            <ResultRow label="Range (metric)" value={fmt(r.rangeKm, 0)} unit="km" /><ResultRow label="Energy Use" value={fmt(r.whPerMile, 0)} unit="Wh/mile" />
        </div></div>);
}

/* ──── 9. EV Range per Charge (Conditions) ──── */
function EvRangeConditionsCalc() {
    const [baseRange, setBaseRange] = useState(300);
    const [temp, setTemp] = useState("moderate");
    const [speed, setSpeed] = useState("mixed");
    const [hvac, setHvac] = useState("moderate");
    const TEMP_F: Record<string, number> = { "cold": 0.70, "cool": 0.85, "moderate": 1.0, "hot": 0.90 };
    const SPEED_F: Record<string, number> = { "city": 1.10, "mixed": 1.0, "highway": 0.80, "fast-highway": 0.65 };
    const HVAC_F: Record<string, number> = { "off": 1.0, "moderate": 0.92, "max": 0.82 };
    const r = useMemo(() => {
        const factor = (TEMP_F[temp] || 1) * (SPEED_F[speed] || 1) * (HVAC_F[hvac] || 1);
        const adjusted = baseRange * factor;
        const loss = baseRange - adjusted;
        return { adjusted, loss, factor };
    }, [baseRange, temp, speed, hvac]);
    return (<div className="con-calc"><h3 className="con-calc__title">🌡️ EV Range per Charge</h3>
        <div className="con-calc__inputs">
            <InputField label="EPA Rated Range" value={baseRange} onChange={setBaseRange} unit="miles" min={50} />
            <SelectField label="Temperature" value={temp} onChange={setTemp} options={[
                { value: "cold", label: "Cold (< 32°F) −30%" }, { value: "cool", label: "Cool (32–50°F) −15%" },
                { value: "moderate", label: "Moderate (50–85°F)" }, { value: "hot", label: "Hot (> 95°F) −10%" },
            ]} />
            <SelectField label="Driving Style" value={speed} onChange={setSpeed} options={[
                { value: "city", label: "City (+10%)" }, { value: "mixed", label: "Mixed" },
                { value: "highway", label: "Highway 65mph (−20%)" }, { value: "fast-highway", label: "Highway 80mph (−35%)" },
            ]} />
            <SelectField label="HVAC Use" value={hvac} onChange={setHvac} options={[
                { value: "off", label: "Off" }, { value: "moderate", label: "Moderate (−8%)" }, { value: "max", label: "Max Heat/AC (−18%)" },
            ]} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Adjusted Range" value={fmt(r.adjusted, 0)} unit="miles" /><ResultRow label="Range Loss" value={fmt(r.loss, 0)} unit="miles" />
            <ResultRow label="Efficiency Factor" value={`${(r.factor * 100).toFixed(0)}%`} />
        </div></div>);
}

/* ──── 10. Home EV Charger Installation Cost ──── */
function EvHomeChargerCalc() {
    const [chargerType, setChargerType] = useState("level2-40");
    const [wiringDist, setWiringDist] = useState(25);
    const [panelUpgrade, setPanelUpgrade] = useState("no");
    const [permitCost, setPermitCost] = useState(150);
    const CHARGER_COST: Record<string, number> = { "level2-32": 350, "level2-40": 500, "level2-48": 650, "hardwired": 800 };
    const r = useMemo(() => {
        const charger = CHARGER_COST[chargerType] || 500;
        const wiring = wiringDist * 8;
        const panel = panelUpgrade === "yes" ? 2000 : panelUpgrade === "subpanel" ? 1200 : 0;
        const labor = 500 + (wiringDist > 30 ? 200 : 0);
        const total = charger + wiring + panel + labor + permitCost;
        return { charger, wiring, panel, labor, total };
    }, [chargerType, wiringDist, panelUpgrade, permitCost]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏠 Home EV Charger Cost</h3>
        <div className="con-calc__inputs">
            <SelectField label="Charger Type" value={chargerType} onChange={setChargerType} options={[
                { value: "level2-32", label: "Level 2 – 32A (~$350)" }, { value: "level2-40", label: "Level 2 – 40A (~$500)" },
                { value: "level2-48", label: "Level 2 – 48A (~$650)" }, { value: "hardwired", label: "Hardwired 60A (~$800)" },
            ]} />
            <InputField label="Wiring Distance" value={wiringDist} onChange={setWiringDist} unit="ft" min={5} max={100} />
            <SelectField label="Panel Upgrade" value={panelUpgrade} onChange={setPanelUpgrade} options={[
                { value: "no", label: "None Needed" }, { value: "subpanel", label: "Add Sub-Panel (~$1,200)" }, { value: "yes", label: "Full Panel Upgrade (~$2,000)" },
            ]} />
            <InputField label="Permit Cost" value={permitCost} onChange={setPermitCost} unit="$" min={0} />
        </div>
        <div className="con-calc__results"><h4>Cost Breakdown</h4>
            <ResultRow label="Charger Unit" value={fmtUSD(r.charger)} /><ResultRow label="Wiring" value={fmtUSD(r.wiring)} />
            <ResultRow label="Panel Work" value={fmtUSD(r.panel)} /><ResultRow label="Labor" value={fmtUSD(r.labor)} />
            <ResultRow label="Permits" value={fmtUSD(permitCost)} /><ResultRow label="Total Installed Cost" value={fmtUSD(r.total)} />
        </div></div>);
}

/* ──── 11. EV Electricity Bill Impact ──── */
function EvElectricityBillCalc() {
    const [dailyMiles, setDailyMiles] = useState(40);
    const [efficiency, setEfficiency] = useState(3.5);
    const [elecRate, setElecRate] = useState(0.14);
    const r = useMemo(() => {
        const dailyKwh = dailyMiles / efficiency;
        const monthlyKwh = dailyKwh * 30;
        const monthlyCost = monthlyKwh * elecRate;
        const annualCost = monthlyCost * 12;
        return { dailyKwh, monthlyKwh, monthlyCost, annualCost };
    }, [dailyMiles, efficiency, elecRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">📋 EV Electricity Bill Impact</h3>
        <div className="con-calc__inputs">
            <InputField label="Daily Driving" value={dailyMiles} onChange={setDailyMiles} unit="mi" min={5} />
            <InputField label="EV Efficiency" value={efficiency} onChange={setEfficiency} unit="mi/kWh" min={1} step={0.1} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="$/kWh" min={0.05} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Daily Energy" value={fmt(r.dailyKwh, 1)} unit="kWh" /><ResultRow label="Monthly Energy" value={fmt(r.monthlyKwh, 0)} unit="kWh" />
            <ResultRow label="Monthly Bill Increase" value={fmtUSD(r.monthlyCost)} /><ResultRow label="Annual Charging Cost" value={fmtUSD(r.annualCost)} />
        </div></div>);
}

/* ──── 12. Solar Panels for EV ──── */
function EvSolarCalc() {
    const [dailyMiles, setDailyMiles] = useState(40);
    const [efficiency, setEfficiency] = useState(3.5);
    const [sunHours, setSunHours] = useState(5);
    const [panelWatts, setPanelWatts] = useState(400);
    const r = useMemo(() => {
        const dailyKwh = dailyMiles / efficiency;
        const annualKwh = dailyKwh * 365;
        const panelDailyKwh = (panelWatts / 1000) * sunHours;
        const panelsNeeded = Math.ceil(dailyKwh / panelDailyKwh);
        const systemKw = (panelsNeeded * panelWatts) / 1000;
        const systemCost = systemKw * 2800;
        return { dailyKwh, annualKwh, panelsNeeded, systemKw, systemCost };
    }, [dailyMiles, efficiency, sunHours, panelWatts]);
    return (<div className="con-calc"><h3 className="con-calc__title">☀️ Solar Panels for EV Charging</h3>
        <div className="con-calc__inputs">
            <InputField label="Daily Driving" value={dailyMiles} onChange={setDailyMiles} unit="mi" min={5} />
            <InputField label="EV Efficiency" value={efficiency} onChange={setEfficiency} unit="mi/kWh" min={1} step={0.1} />
            <InputField label="Peak Sun Hours" value={sunHours} onChange={setSunHours} unit="hrs" min={2} max={8} step={0.5} />
            <InputField label="Panel Wattage" value={panelWatts} onChange={setPanelWatts} unit="W" min={250} max={500} step={50} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Daily EV Energy" value={fmt(r.dailyKwh, 1)} unit="kWh" /><ResultRow label="Panels Needed" value={fmtInt(r.panelsNeeded)} />
            <ResultRow label="System Size" value={fmt(r.systemKw, 1)} unit="kW" /><ResultRow label="Est. System Cost" value={fmtUSD(r.systemCost)} />
        </div></div>);
}

/* ──── 13. EV Trip Cost ──── */
function EvTripCostCalc() {
    const [distance, setDistance] = useState(300);
    const [evEfficiency, setEvEfficiency] = useState(3.5);
    const [elecRate, setElecRate] = useState(0.14);
    const [gasMpg, setGasMpg] = useState(28);
    const [gasPrice, setGasPrice] = useState(3.50);
    const r = useMemo(() => {
        const evKwh = distance / evEfficiency; const evCost = evKwh * elecRate;
        const gasGal = distance / gasMpg; const gasCost = gasGal * gasPrice;
        return { evKwh, evCost, gasGal, gasCost, savings: gasCost - evCost };
    }, [distance, evEfficiency, elecRate, gasMpg, gasPrice]);
    return (<div className="con-calc"><h3 className="con-calc__title">🗺️ EV Trip Cost Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Trip Distance" value={distance} onChange={setDistance} unit="mi" min={10} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="mi/kWh" min={1} step={0.1} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="$/kWh" min={0.05} step={0.01} />
            <InputField label="Gas Car MPG" value={gasMpg} onChange={setGasMpg} unit="MPG" min={10} />
            <InputField label="Gas Price" value={gasPrice} onChange={setGasPrice} unit="$/gal" min={1} step={0.1} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="EV Trip Cost" value={fmtUSD(r.evCost)} /><ResultRow label="Gas Trip Cost" value={fmtUSD(r.gasCost)} />
            <ResultRow label="EV Savings" value={fmtUSD(r.savings)} />
        </div></div>);
}

/* ──── 14. EV Road Trip Planner ──── */
function EvRoadTripCalc() {
    const [totalDist, setTotalDist] = useState(500);
    const [range, setRange] = useState(270);
    const [dcSpeed, setDcSpeed] = useState(150);
    const [elecRate, setElecRate] = useState(0.35);
    const [batteryKwh, setBatteryKwh] = useState(75);
    const r = useMemo(() => {
        const usableRange = range * 0.80;
        const stops = Math.max(0, Math.ceil(totalDist / usableRange) - 1);
        const kwhPerStop = batteryKwh * 0.60;
        const minsPerStop = (kwhPerStop / dcSpeed) * 60;
        const totalChargeMins = stops * minsPerStop;
        const totalCost = (totalDist / range * batteryKwh) * elecRate;
        return { stops, minsPerStop, totalChargeMins, totalCost };
    }, [totalDist, range, dcSpeed, elecRate, batteryKwh]);
    const fmtTime = (m: number) => m >= 60 ? `${Math.floor(m / 60)}h ${Math.round(m % 60)}m` : `${Math.round(m)}m`;
    return (<div className="con-calc"><h3 className="con-calc__title">🚗 EV Road Trip Planner</h3>
        <div className="con-calc__inputs">
            <InputField label="Total Distance" value={totalDist} onChange={setTotalDist} unit="mi" min={50} />
            <InputField label="EV Range" value={range} onChange={setRange} unit="mi" min={100} />
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="DC Fast Speed" value={dcSpeed} onChange={setDcSpeed} unit="kW" min={50} max={350} step={50} />
            <InputField label="DC Rate" value={elecRate} onChange={setElecRate} unit="$/kWh" min={0.1} step={0.05} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Charging Stops" value={fmtInt(r.stops)} /><ResultRow label="Time per Stop" value={fmtTime(r.minsPerStop)} />
            <ResultRow label="Total Charging Time" value={fmtTime(r.totalChargeMins)} /><ResultRow label="Est. Charging Cost" value={fmtUSD(r.totalCost)} />
        </div></div>);
}

/* ──── 15. EV Cost per Mile ──── */
function EvCostPerMileCalc() {
    const [annualMiles, setAnnualMiles] = useState(12000);
    const [efficiency, setEfficiency] = useState(3.5);
    const [elecRate, setElecRate] = useState(0.14);
    const [annualInsurance, setAnnualInsurance] = useState(1800);
    const [annualMaint, setAnnualMaint] = useState(400);
    const r = useMemo(() => {
        const elecCost = (annualMiles / efficiency) * elecRate;
        const totalAnnual = elecCost + annualInsurance + annualMaint;
        const cpm = totalAnnual / annualMiles;
        const elecCpm = elecCost / annualMiles;
        return { elecCost, totalAnnual, cpm, elecCpm };
    }, [annualMiles, efficiency, elecRate, annualInsurance, annualMaint]);
    return (<div className="con-calc"><h3 className="con-calc__title">📈 EV Cost per Mile</h3>
        <div className="con-calc__inputs">
            <InputField label="Annual Miles" value={annualMiles} onChange={setAnnualMiles} unit="mi" min={1000} step={1000} />
            <InputField label="EV Efficiency" value={efficiency} onChange={setEfficiency} unit="mi/kWh" min={1} step={0.1} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="$/kWh" min={0.05} step={0.01} />
            <InputField label="Annual Insurance" value={annualInsurance} onChange={setAnnualInsurance} unit="$" min={500} step={100} />
            <InputField label="Annual Maintenance" value={annualMaint} onChange={setAnnualMaint} unit="$" min={0} step={50} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Electricity Cost/Mile" value={`${(r.elecCpm * 100).toFixed(1)}¢`} />
            <ResultRow label="All-In Cost/Mile" value={`${(r.cpm * 100).toFixed(1)}¢`} />
            <ResultRow label="Annual Operating Cost" value={fmtUSD(r.totalAnnual)} />
        </div></div>);
}

/* ──── 16. EV Battery Degradation ──── */
function EvBatteryDegradationCalc() {
    const [originalKwh, setOriginalKwh] = useState(75);
    const [ageYears, setAgeYears] = useState(3);
    const [mileage, setMileage] = useState(50000);
    const [fastChargePct, setFastChargePct] = useState(20);
    const r = useMemo(() => {
        const ageLoss = ageYears * 2.3;
        const mileLoss = (mileage / 10000) * 0.8;
        const fastChargeLoss = fastChargePct > 50 ? 1.5 : fastChargePct > 25 ? 0.5 : 0;
        const totalLoss = Math.min(ageLoss + mileLoss + fastChargeLoss, 40);
        const remaining = 100 - totalLoss;
        const currentKwh = originalKwh * remaining / 100;
        return { totalLoss, remaining, currentKwh };
    }, [originalKwh, ageYears, mileage, fastChargePct]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔋 EV Battery Degradation</h3>
        <div className="con-calc__inputs">
            <InputField label="Original Battery" value={originalKwh} onChange={setOriginalKwh} unit="kWh" min={20} />
            <InputField label="Vehicle Age" value={ageYears} onChange={setAgeYears} unit="years" min={0} max={15} />
            <InputField label="Odometer" value={mileage} onChange={setMileage} unit="mi" min={0} step={5000} />
            <InputField label="DC Fast Charging %" value={fastChargePct} onChange={setFastChargePct} unit="%" min={0} max={100} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Estimated Health" value={`${r.remaining.toFixed(1)}%`} />
            <ResultRow label="Current Capacity" value={fmt(r.currentKwh, 1)} unit="kWh" />
            <ResultRow label="Capacity Lost" value={`${r.totalLoss.toFixed(1)}%`} />
        </div></div>);
}

/* ──── 17. EV Battery Replacement Cost ──── */
function EvBatteryReplacementCalc() {
    const [batteryKwh, setBatteryKwh] = useState(75);
    const [costPerKwh, setCostPerKwh] = useState(150);
    const [laborHours, setLaborHours] = useState(8);
    const [laborRate, setLaborRate] = useState(150);
    const r = useMemo(() => {
        const packCost = batteryKwh * costPerKwh;
        const labor = laborHours * laborRate;
        const total = packCost + labor;
        return { packCost, labor, total };
    }, [batteryKwh, costPerKwh, laborHours, laborRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔧 EV Battery Replacement Cost</h3>
        <div className="con-calc__inputs">
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="Cost per kWh" value={costPerKwh} onChange={setCostPerKwh} unit="$" min={50} />
            <InputField label="Labor Hours" value={laborHours} onChange={setLaborHours} unit="hrs" min={2} max={20} />
            <InputField label="Labor Rate" value={laborRate} onChange={setLaborRate} unit="$/hr" min={50} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Battery Pack" value={fmtUSD(r.packCost)} /><ResultRow label="Labor" value={fmtUSD(r.labor)} />
            <ResultRow label="Total Replacement" value={fmtUSD(r.total)} />
        </div></div>);
}

/* ──── 18. EV HP ↔ kW Converter ──── */
function EvHpKwCalc() {
    const [hp, setHp] = useState(300);
    const r = useMemo(() => {
        const kw = hp * 0.7457; const metricHp = hp * 1.01387; const torqueEst = kw * 1.3558 * 9.5493;
        return { kw, metricHp, torqueEst };
    }, [hp]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚙️ HP ↔ kW Converter</h3>
        <div className="con-calc__inputs">
            <InputField label="Horsepower" value={hp} onChange={setHp} unit="HP" min={1} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Kilowatts" value={fmt(r.kw, 1)} unit="kW" />
            <ResultRow label="Metric HP" value={fmt(r.metricHp, 1)} unit="PS" />
        </div></div>);
}

/* ──── 19. EV 0-60 Estimator ──── */
function EvAccelerationCalc() {
    const [motorKw, setMotorKw] = useState(300);
    const [curbWeightLbs, setCurbWeightLbs] = useState(4500);
    const [drivetrain, setDrivetrain] = useState("awd");
    const r = useMemo(() => {
        const hp = motorKw / 0.7457; const pwr = hp / (curbWeightLbs / 1000);
        const tractionFactor = drivetrain === "awd" ? 0.85 : 1.0;
        const est060 = (curbWeightLbs / hp) * 0.0078 * tractionFactor;
        const quarter = est060 * 2.5 + 3.5;
        return { hp, pwr, est060: Math.max(est060, 1.8), quarter };
    }, [motorKw, curbWeightLbs, drivetrain]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏎️ EV 0-60 Estimator</h3>
        <div className="con-calc__inputs">
            <InputField label="Motor Power" value={motorKw} onChange={setMotorKw} unit="kW" min={50} />
            <InputField label="Curb Weight" value={curbWeightLbs} onChange={setCurbWeightLbs} unit="lbs" min={2000} step={100} />
            <SelectField label="Drivetrain" value={drivetrain} onChange={setDrivetrain} options={[
                { value: "rwd", label: "RWD" }, { value: "awd", label: "AWD / Dual Motor" },
            ]} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Motor HP" value={fmt(r.hp, 0)} unit="HP" />
            <ResultRow label="Power-to-Weight" value={fmt(r.pwr, 1)} unit="HP/1000 lb" />
            <ResultRow label="Est. 0-60 mph" value={fmt(r.est060, 1)} unit="sec" />
            <ResultRow label="Est. 1/4 Mile" value={fmt(r.quarter, 1)} unit="sec" />
        </div></div>);
}

/* ──── 20. EV Loan/EMI ──── */
function EvLoanCalc() {
    const [price, setPrice] = useState(45000);
    const [downPayment, setDownPayment] = useState(5000);
    const [tradeIn, setTradeIn] = useState(0);
    const [taxCredit, setTaxCredit] = useState(7500);
    const [rate, setRate] = useState(5.5);
    const [term, setTerm] = useState(60);
    const r = useMemo(() => {
        const loanAmt = price - downPayment - tradeIn - taxCredit;
        const mr = rate / 100 / 12;
        const monthly = mr > 0 ? loanAmt * mr / (1 - Math.pow(1 + mr, -term)) : loanAmt / term;
        const totalPaid = monthly * term + downPayment;
        const totalInterest = totalPaid - price + tradeIn + taxCredit;
        return { loanAmt, monthly, totalPaid, totalInterest };
    }, [price, downPayment, tradeIn, taxCredit, rate, term]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏦 EV Loan Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Vehicle Price" value={price} onChange={setPrice} unit="$" min={10000} step={1000} />
            <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} unit="$" min={0} step={500} />
            <InputField label="Trade-In Value" value={tradeIn} onChange={setTradeIn} unit="$" min={0} step={500} />
            <InputField label="Tax Credit Applied" value={taxCredit} onChange={setTaxCredit} unit="$" min={0} step={500} />
            <InputField label="Interest Rate" value={rate} onChange={setRate} unit="%" min={0} step={0.5} />
            <InputField label="Loan Term" value={term} onChange={setTerm} unit="months" min={24} max={84} step={12} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Loan Amount" value={fmtUSD(r.loanAmt)} /><ResultRow label="Monthly Payment" value={fmtUSD(r.monthly)} />
            <ResultRow label="Total Interest" value={fmtUSD(r.totalInterest)} /><ResultRow label="Total Cost" value={fmtUSD(r.totalPaid)} />
        </div></div>);
}

/* ──── 21. EV Break-Even ──── */
function EvBreakEvenCalc() {
    const [priceDiff, setPriceDiff] = useState(10000);
    const [annualFuelSavings, setAnnualFuelSavings] = useState(1500);
    const [annualMaintSavings, setAnnualMaintSavings] = useState(500);
    const r = useMemo(() => {
        const totalAnnualSavings = annualFuelSavings + annualMaintSavings;
        const years = totalAnnualSavings > 0 ? priceDiff / totalAnnualSavings : Infinity;
        const months = years * 12;
        return { totalAnnualSavings, years, months };
    }, [priceDiff, annualFuelSavings, annualMaintSavings]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚖️ EV Break-Even Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="EV Price Premium" value={priceDiff} onChange={setPriceDiff} unit="$" min={0} step={1000} />
            <InputField label="Annual Fuel Savings" value={annualFuelSavings} onChange={setAnnualFuelSavings} unit="$" min={0} step={100} />
            <InputField label="Annual Maint. Savings" value={annualMaintSavings} onChange={setAnnualMaintSavings} unit="$" min={0} step={50} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Annual Savings" value={fmtUSD(r.totalAnnualSavings)} />
            <ResultRow label="Break-Even" value={r.years === Infinity ? "N/A" : `${fmt(r.years, 1)} years`} />
            <ResultRow label="Break-Even" value={r.months === Infinity ? "N/A" : `${fmt(r.months, 0)} months`} />
        </div></div>);
}

/* ──── 22. EV Resale Value ──── */
function EvResaleCalc() {
    const [purchasePrice, setPurchasePrice] = useState(45000);
    const [ageYears, setAgeYears] = useState(3);
    const [mileage, setMileage] = useState(36000);
    const r = useMemo(() => {
        const depRates = [1.0, 0.80, 0.70, 0.62, 0.55, 0.50, 0.45, 0.41, 0.38, 0.35, 0.32];
        const baseRetention = depRates[Math.min(ageYears, 10)] || 0.32;
        const avgMilesPerYr = ageYears > 0 ? mileage / ageYears : 12000;
        const mileAdj = avgMilesPerYr > 15000 ? -0.03 : avgMilesPerYr < 10000 ? 0.02 : 0;
        const retention = Math.max(0.15, baseRetention + mileAdj);
        const resale = purchasePrice * retention;
        const lost = purchasePrice - resale;
        return { retention, resale, lost };
    }, [purchasePrice, ageYears, mileage]);
    return (<div className="con-calc"><h3 className="con-calc__title">💵 EV Resale Value</h3>
        <div className="con-calc__inputs">
            <InputField label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} unit="$" min={15000} step={1000} />
            <InputField label="Vehicle Age" value={ageYears} onChange={setAgeYears} unit="years" min={0} max={10} />
            <InputField label="Odometer" value={mileage} onChange={setMileage} unit="mi" min={0} step={5000} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Value Retention" value={`${(r.retention * 100).toFixed(0)}%`} />
            <ResultRow label="Estimated Resale" value={fmtUSD(r.resale)} /><ResultRow label="Depreciation" value={fmtUSD(r.lost)} />
        </div></div>);
}

/* ──── DISPATCHER ──── */
const CALC_MAP: Record<string, React.FC> = {
    "ev-vs-gas": EvVsGasCalc, "ev-charging-cost": EvChargingCostCalc, "ev-fuel-savings": EvFuelSavingsCalc,
    "ev-tco": EvTcoCalc, "ev-tax-credit": EvTaxCreditCalc, "ev-lease-vs-buy": EvLeaseBuyCalc,
    "ev-charging-time": EvChargingTimeCalc, "ev-range": EvRangeCalc, "ev-range-conditions": EvRangeConditionsCalc,
    "ev-home-charger": EvHomeChargerCalc, "ev-electricity-bill": EvElectricityBillCalc, "ev-solar": EvSolarCalc,
    "ev-trip-cost": EvTripCostCalc, "ev-road-trip": EvRoadTripCalc, "ev-cost-per-mile": EvCostPerMileCalc,
    "ev-battery-degradation": EvBatteryDegradationCalc, "ev-battery-replacement": EvBatteryReplacementCalc,
    "ev-hp-kw": EvHpKwCalc, "ev-acceleration": EvAccelerationCalc, "ev-loan": EvLoanCalc,
    "ev-break-even": EvBreakEvenCalc, "ev-resale": EvResaleCalc,
};

export default function EVCalculatorCore({ calcType }: { calcType: string }) {
    const CalcComponent = CALC_MAP[calcType];
    if (!CalcComponent) return <p>Calculator not found: {calcType}</p>;
    return <CalcComponent />;
}
