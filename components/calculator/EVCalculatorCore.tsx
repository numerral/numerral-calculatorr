"use client";

import { useState, useMemo } from "react";

const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (n: number) => Math.ceil(n).toLocaleString();

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
    const [annualKm, setAnnualKm] = useState(20000);
    const [gasKmL, setGasKmL] = useState(12);
    const [gasPrice, setGasPrice] = useState(1.50);
    const [evEfficiency, setEvEfficiency] = useState(6.0);
    const [elecRate, setElecRate] = useState(0.15);
    const r = useMemo(() => {
        const gasFuelCost = (annualKm / gasKmL) * gasPrice;
        const evFuelCost = (annualKm / evEfficiency) * elecRate;
        const gasMaint = annualKm * 0.06; const evMaint = annualKm * 0.02;
        return { gasFuelCost, evFuelCost, gasMaint, evMaint, fuelSavings: gasFuelCost - evFuelCost, totalSavings: (gasFuelCost + gasMaint) - (evFuelCost + evMaint) };
    }, [annualKm, gasKmL, gasPrice, evEfficiency, elecRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚡ EV vs Gas Cost Comparison</h3>
        <div className="con-calc__inputs">
            <InputField label="Annual Distance" value={annualKm} onChange={setAnnualKm} unit="km" min={1000} step={1000} />
            <InputField label="Gas Car Efficiency" value={gasKmL} onChange={setGasKmL} unit="km/L" min={5} step={1} />
            <InputField label="Fuel Price" value={gasPrice} onChange={setGasPrice} unit="per litre" min={0.5} step={0.1} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="per kWh" min={0.01} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Annual Cost Comparison</h4>
            <ResultRow label="Gas Fuel Cost" value={fmt(r.gasFuelCost, 0)} /><ResultRow label="EV Electricity Cost" value={fmt(r.evFuelCost, 0)} />
            <ResultRow label="Gas Maintenance" value={fmt(r.gasMaint, 0)} /><ResultRow label="EV Maintenance" value={fmt(r.evMaint, 0)} />
            <ResultRow label="Fuel Savings" value={fmt(r.fuelSavings, 0)} unit="/yr" /><ResultRow label="Total Savings" value={fmt(r.totalSavings, 0)} unit="/yr" />
        </div></div>);
}

/* ──── 2. EV Charging Cost ──── */
function EvChargingCostCalc() {
    const [batteryKwh, setBatteryKwh] = useState(75);
    const [currentPct, setCurrentPct] = useState(20);
    const [targetPct, setTargetPct] = useState(80);
    const [homeRate, setHomeRate] = useState(0.15);
    const [dcRate, setDcRate] = useState(0.40);
    const r = useMemo(() => {
        const kwhNeeded = batteryKwh * (targetPct - currentPct) / 100;
        return { kwhNeeded, homeCost: kwhNeeded * homeRate, dcCost: kwhNeeded * dcRate };
    }, [batteryKwh, currentPct, targetPct, homeRate, dcRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔌 EV Charging Cost Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="Current Charge" value={currentPct} onChange={setCurrentPct} unit="%" min={0} max={99} />
            <InputField label="Target Charge" value={targetPct} onChange={setTargetPct} unit="%" min={1} max={100} />
            <InputField label="Home Electricity Rate" value={homeRate} onChange={setHomeRate} unit="per kWh" min={0.01} step={0.01} />
            <InputField label="DC Fast Charge Rate" value={dcRate} onChange={setDcRate} unit="per kWh" min={0.05} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Energy Needed" value={fmt(r.kwhNeeded, 1)} unit="kWh" />
            <ResultRow label="Cost at Home" value={fmt(r.homeCost, 2)} /><ResultRow label="Cost at DC Fast" value={fmt(r.dcCost, 2)} />
        </div></div>);
}

/* ──── 3. EV Fuel Savings ──── */
function EvFuelSavingsCalc() {
    const [annualKm, setAnnualKm] = useState(20000);
    const [gasKmL, setGasKmL] = useState(12);
    const [gasPrice, setGasPrice] = useState(1.50);
    const [evEfficiency, setEvEfficiency] = useState(6.0);
    const [elecRate, setElecRate] = useState(0.15);
    const r = useMemo(() => {
        const gasCost = (annualKm / gasKmL) * gasPrice;
        const evCost = (annualKm / evEfficiency) * elecRate;
        const savings = gasCost - evCost;
        return { gasCost, evCost, savings, savings5yr: savings * 5, savings10yr: savings * 10 };
    }, [annualKm, gasKmL, gasPrice, evEfficiency, elecRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">💰 EV Fuel Savings Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Annual Distance" value={annualKm} onChange={setAnnualKm} unit="km" min={1000} step={1000} />
            <InputField label="Gas Car Efficiency" value={gasKmL} onChange={setGasKmL} unit="km/L" min={5} step={1} />
            <InputField label="Fuel Price" value={gasPrice} onChange={setGasPrice} unit="per litre" min={0.5} step={0.1} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="per kWh" min={0.01} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Annual Gas Cost" value={fmt(r.gasCost, 0)} /><ResultRow label="Annual EV Cost" value={fmt(r.evCost, 0)} />
            <ResultRow label="Annual Savings" value={fmt(r.savings, 0)} /><ResultRow label="5-Year Savings" value={fmt(r.savings5yr, 0)} />
            <ResultRow label="10-Year Savings" value={fmt(r.savings10yr, 0)} />
        </div></div>);
}

/* ──── 4. EV Total Cost of Ownership ──── */
function EvTcoCalc() {
    const [purchasePrice, setPurchasePrice] = useState(35000);
    const [years, setYears] = useState(5);
    const [annualKm, setAnnualKm] = useState(20000);
    const [elecRate, setElecRate] = useState(0.15);
    const [evEfficiency, setEvEfficiency] = useState(6.0);
    const [annualInsurance, setAnnualInsurance] = useState(1500);
    const r = useMemo(() => {
        const charging = (annualKm / evEfficiency) * elecRate * years;
        const maintenance = annualKm * 0.02 * years;
        const insurance = annualInsurance * years;
        const depreciation = purchasePrice * (1 - Math.pow(0.85, years));
        const tco = charging + maintenance + insurance + depreciation;
        const perKm = tco / (annualKm * years);
        return { charging, maintenance, insurance, depreciation, tco, perKm };
    }, [purchasePrice, years, annualKm, elecRate, evEfficiency, annualInsurance]);
    return (<div className="con-calc"><h3 className="con-calc__title">📊 EV Total Cost of Ownership</h3>
        <div className="con-calc__inputs">
            <InputField label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} min={5000} step={1000} />
            <InputField label="Ownership Period" value={years} onChange={setYears} unit="years" min={1} max={15} />
            <InputField label="Annual Distance" value={annualKm} onChange={setAnnualKm} unit="km" min={5000} step={1000} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="per kWh" min={0.01} step={0.01} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Annual Insurance" value={annualInsurance} onChange={setAnnualInsurance} min={200} step={100} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Charging Cost" value={fmt(r.charging, 0)} /><ResultRow label="Maintenance" value={fmt(r.maintenance, 0)} />
            <ResultRow label="Insurance" value={fmt(r.insurance, 0)} /><ResultRow label="Depreciation" value={fmt(r.depreciation, 0)} />
            <ResultRow label="Total Cost of Ownership" value={fmt(r.tco, 0)} /><ResultRow label="Cost per km" value={fmt(r.perKm, 2)} />
        </div></div>);
}

/* ──── 5. EV Government Incentive ──── */
function EvTaxCreditCalc() {
    const [vehiclePrice, setVehiclePrice] = useState(40000);
    const [incentiveAmount, setIncentiveAmount] = useState(5000);
    const [stateSub, setStateSub] = useState(0);
    const r = useMemo(() => {
        const totalIncentive = incentiveAmount + stateSub;
        const effectivePrice = vehiclePrice - totalIncentive;
        const savingsPct = (totalIncentive / vehiclePrice) * 100;
        return { totalIncentive, effectivePrice, savingsPct };
    }, [vehiclePrice, incentiveAmount, stateSub]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏛️ EV Government Incentive Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Vehicle Price" value={vehiclePrice} onChange={setVehiclePrice} min={5000} step={1000} />
            <InputField label="National/Federal Incentive" value={incentiveAmount} onChange={setIncentiveAmount} min={0} step={500} />
            <InputField label="State/Regional Subsidy" value={stateSub} onChange={setStateSub} min={0} step={500} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Total Incentive" value={fmt(r.totalIncentive, 0)} />
            <ResultRow label="Effective Price" value={fmt(r.effectivePrice, 0)} />
            <ResultRow label="Savings" value={`${fmt(r.savingsPct, 1)}%`} />
        </div></div>);
}

/* ──── 6. EV Lease vs Buy ──── */
function EvLeaseBuyCalc() {
    const [msrp, setMsrp] = useState(40000);
    const [downPayment, setDownPayment] = useState(3000);
    const [loanRate, setLoanRate] = useState(6.0);
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
            <InputField label="Vehicle Price" value={msrp} onChange={setMsrp} min={5000} step={1000} />
            <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} step={500} />
            <InputField label="Loan APR" value={loanRate} onChange={setLoanRate} unit="%" min={0} step={0.5} />
            <InputField label="Loan Term" value={loanTerm} onChange={setLoanTerm} unit="months" min={24} max={84} step={12} />
            <InputField label="Lease Residual" value={residualPct} onChange={setResidualPct} unit="%" min={30} max={70} />
            <InputField label="Lease Term" value={leaseTerm} onChange={setLeaseTerm} unit="months" min={24} max={48} step={12} />
        </div>
        <div className="con-calc__results"><h4>Buy</h4>
            <ResultRow label="Monthly Payment" value={fmt(r.buyMonthly, 0)} /><ResultRow label="Total Cost" value={fmt(r.buyTotal, 0)} />
            <h4>Lease</h4>
            <ResultRow label="Monthly Payment" value={fmt(r.leaseMonthly, 0)} /><ResultRow label="Total Cost" value={fmt(r.leaseTotal, 0)} />
        </div></div>);
}

/* ──── 7. EV Charging Time ──── */
function EvChargingTimeCalc() {
    const [batteryKwh, setBatteryKwh] = useState(75);
    const [currentPct, setCurrentPct] = useState(20);
    const [targetPct, setTargetPct] = useState(80);
    const r = useMemo(() => {
        const kwhNeeded = batteryKwh * (targetPct - currentPct) / 100;
        const l1 = kwhNeeded / 2.3; const l2 = kwhNeeded / 7.4; const l2fast = kwhNeeded / 11; const dc50 = kwhNeeded / 50; const dc150 = kwhNeeded / 150; const dc350 = kwhNeeded / 350;
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
            <ResultRow label="AC Slow (2.3 kW)" value={fmtTime(r.l1)} /><ResultRow label="AC Standard (7.4 kW)" value={fmtTime(r.l2)} />
            <ResultRow label="AC Fast (11 kW)" value={fmtTime(r.l2fast)} /><ResultRow label="DC Fast (50 kW)" value={fmtTime(r.dc50)} />
            <ResultRow label="DC Fast (150 kW)" value={fmtTime(r.dc150)} /><ResultRow label="DC Ultra (350 kW)" value={fmtTime(r.dc350)} />
        </div></div>);
}

/* ──── 8. EV Range ──── */
function EvRangeCalc() {
    const [batteryKwh, setBatteryKwh] = useState(75);
    const [efficiency, setEfficiency] = useState(6.0);
    const [usablePercent, setUsablePercent] = useState(95);
    const r = useMemo(() => {
        const usableKwh = batteryKwh * usablePercent / 100;
        const rangeKm = usableKwh * efficiency;
        return { usableKwh, rangeKm, whPerKm: (usableKwh * 1000) / rangeKm };
    }, [batteryKwh, efficiency, usablePercent]);
    return (<div className="con-calc"><h3 className="con-calc__title">🛣️ EV Range Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="Efficiency" value={efficiency} onChange={setEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Usable Battery" value={usablePercent} onChange={setUsablePercent} unit="%" min={80} max={100} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Usable Energy" value={fmt(r.usableKwh, 1)} unit="kWh" /><ResultRow label="Estimated Range" value={fmt(r.rangeKm, 0)} unit="km" />
            <ResultRow label="Energy Consumption" value={fmt(r.whPerKm, 0)} unit="Wh/km" />
        </div></div>);
}

/* ──── 9. EV Range per Charge (Conditions) ──── */
function EvRangeConditionsCalc() {
    const [baseRange, setBaseRange] = useState(400);
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
            <InputField label="Rated Range" value={baseRange} onChange={setBaseRange} unit="km" min={50} />
            <SelectField label="Temperature" value={temp} onChange={setTemp} options={[
                { value: "cold", label: "Cold (< 0°C) −30%" }, { value: "cool", label: "Cool (0–10°C) −15%" },
                { value: "moderate", label: "Moderate (10–30°C)" }, { value: "hot", label: "Hot (> 35°C) −10%" },
            ]} />
            <SelectField label="Driving Style" value={speed} onChange={setSpeed} options={[
                { value: "city", label: "City (+10%)" }, { value: "mixed", label: "Mixed" },
                { value: "highway", label: "Highway 100 km/h (−20%)" }, { value: "fast-highway", label: "Highway 130 km/h (−35%)" },
            ]} />
            <SelectField label="HVAC Use" value={hvac} onChange={setHvac} options={[
                { value: "off", label: "Off" }, { value: "moderate", label: "Moderate (−8%)" }, { value: "max", label: "Max Heat/AC (−18%)" },
            ]} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Adjusted Range" value={fmt(r.adjusted, 0)} unit="km" /><ResultRow label="Range Loss" value={fmt(r.loss, 0)} unit="km" />
            <ResultRow label="Efficiency Factor" value={`${(r.factor * 100).toFixed(0)}%`} />
        </div></div>);
}

/* ──── 10. Home EV Charger Installation Cost ──── */
function EvHomeChargerCalc() {
    const [chargerCost, setChargerCost] = useState(500);
    const [wiringDist, setWiringDist] = useState(8);
    const [wiringCostPerM, setWiringCostPerM] = useState(25);
    const [panelUpgrade, setPanelUpgrade] = useState(0);
    const [laborCost, setLaborCost] = useState(400);
    const [permitCost, setPermitCost] = useState(100);
    const r = useMemo(() => {
        const wiring = wiringDist * wiringCostPerM;
        const total = chargerCost + wiring + panelUpgrade + laborCost + permitCost;
        return { wiring, total };
    }, [chargerCost, wiringDist, wiringCostPerM, panelUpgrade, laborCost, permitCost]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏠 Home EV Charger Cost</h3>
        <div className="con-calc__inputs">
            <InputField label="Charger Unit Cost" value={chargerCost} onChange={setChargerCost} min={100} step={50} />
            <InputField label="Wiring Distance" value={wiringDist} onChange={setWiringDist} unit="m" min={1} max={50} />
            <InputField label="Wiring Cost" value={wiringCostPerM} onChange={setWiringCostPerM} unit="per metre" min={5} step={5} />
            <InputField label="Panel Upgrade" value={panelUpgrade} onChange={setPanelUpgrade} min={0} step={100} />
            <InputField label="Electrician Labor" value={laborCost} onChange={setLaborCost} min={0} step={50} />
            <InputField label="Permit Cost" value={permitCost} onChange={setPermitCost} min={0} step={50} />
        </div>
        <div className="con-calc__results"><h4>Cost Breakdown</h4>
            <ResultRow label="Charger Unit" value={fmt(chargerCost, 0)} /><ResultRow label="Wiring" value={fmt(r.wiring, 0)} />
            <ResultRow label="Panel Upgrade" value={fmt(panelUpgrade, 0)} /><ResultRow label="Labor" value={fmt(laborCost, 0)} />
            <ResultRow label="Permits" value={fmt(permitCost, 0)} /><ResultRow label="Total Installed Cost" value={fmt(r.total, 0)} />
        </div></div>);
}

/* ──── 11. EV Electricity Bill Impact ──── */
function EvElectricityBillCalc() {
    const [dailyKm, setDailyKm] = useState(50);
    const [efficiency, setEfficiency] = useState(6.0);
    const [elecRate, setElecRate] = useState(0.15);
    const r = useMemo(() => {
        const dailyKwh = dailyKm / efficiency;
        const monthlyKwh = dailyKwh * 30;
        const monthlyCost = monthlyKwh * elecRate;
        const annualCost = monthlyCost * 12;
        return { dailyKwh, monthlyKwh, monthlyCost, annualCost };
    }, [dailyKm, efficiency, elecRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">📋 EV Electricity Bill Impact</h3>
        <div className="con-calc__inputs">
            <InputField label="Daily Driving" value={dailyKm} onChange={setDailyKm} unit="km" min={5} />
            <InputField label="EV Efficiency" value={efficiency} onChange={setEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="per kWh" min={0.01} step={0.01} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Daily Energy" value={fmt(r.dailyKwh, 1)} unit="kWh" /><ResultRow label="Monthly Energy" value={fmt(r.monthlyKwh, 0)} unit="kWh" />
            <ResultRow label="Monthly Bill Increase" value={fmt(r.monthlyCost, 2)} /><ResultRow label="Annual Charging Cost" value={fmt(r.annualCost, 0)} />
        </div></div>);
}

/* ──── 12. Solar Panels for EV ──── */
function EvSolarCalc() {
    const [dailyKm, setDailyKm] = useState(50);
    const [efficiency, setEfficiency] = useState(6.0);
    const [sunHours, setSunHours] = useState(5);
    const [panelWatts, setPanelWatts] = useState(400);
    const [costPerWatt, setCostPerWatt] = useState(1.0);
    const r = useMemo(() => {
        const dailyKwh = dailyKm / efficiency;
        const annualKwh = dailyKwh * 365;
        const panelDailyKwh = (panelWatts / 1000) * sunHours;
        const panelsNeeded = Math.ceil(dailyKwh / panelDailyKwh);
        const systemKw = (panelsNeeded * panelWatts) / 1000;
        const systemCost = systemKw * 1000 * costPerWatt;
        return { dailyKwh, annualKwh, panelsNeeded, systemKw, systemCost };
    }, [dailyKm, efficiency, sunHours, panelWatts, costPerWatt]);
    return (<div className="con-calc"><h3 className="con-calc__title">☀️ Solar Panels for EV Charging</h3>
        <div className="con-calc__inputs">
            <InputField label="Daily Driving" value={dailyKm} onChange={setDailyKm} unit="km" min={5} />
            <InputField label="EV Efficiency" value={efficiency} onChange={setEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Peak Sun Hours" value={sunHours} onChange={setSunHours} unit="hrs/day" min={2} max={8} step={0.5} />
            <InputField label="Panel Wattage" value={panelWatts} onChange={setPanelWatts} unit="W" min={250} max={500} step={50} />
            <InputField label="Cost per Watt" value={costPerWatt} onChange={setCostPerWatt} unit="per W" min={0.3} step={0.1} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Daily EV Energy" value={fmt(r.dailyKwh, 1)} unit="kWh" /><ResultRow label="Panels Needed" value={fmtInt(r.panelsNeeded)} />
            <ResultRow label="System Size" value={fmt(r.systemKw, 1)} unit="kW" /><ResultRow label="Est. System Cost" value={fmt(r.systemCost, 0)} />
        </div></div>);
}

/* ──── 13. EV Trip Cost ──── */
function EvTripCostCalc() {
    const [distance, setDistance] = useState(500);
    const [evEfficiency, setEvEfficiency] = useState(6.0);
    const [elecRate, setElecRate] = useState(0.15);
    const [gasKmL, setGasKmL] = useState(12);
    const [gasPrice, setGasPrice] = useState(1.50);
    const r = useMemo(() => {
        const evKwh = distance / evEfficiency; const evCost = evKwh * elecRate;
        const gasL = distance / gasKmL; const gasCost = gasL * gasPrice;
        return { evKwh, evCost, gasL, gasCost, savings: gasCost - evCost };
    }, [distance, evEfficiency, elecRate, gasKmL, gasPrice]);
    return (<div className="con-calc"><h3 className="con-calc__title">🗺️ EV Trip Cost Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Trip Distance" value={distance} onChange={setDistance} unit="km" min={10} />
            <InputField label="EV Efficiency" value={evEfficiency} onChange={setEvEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="per kWh" min={0.01} step={0.01} />
            <InputField label="Gas Car Efficiency" value={gasKmL} onChange={setGasKmL} unit="km/L" min={5} step={1} />
            <InputField label="Fuel Price" value={gasPrice} onChange={setGasPrice} unit="per litre" min={0.5} step={0.1} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="EV Trip Cost" value={fmt(r.evCost, 2)} /><ResultRow label="Gas Trip Cost" value={fmt(r.gasCost, 2)} />
            <ResultRow label="EV Savings" value={fmt(r.savings, 2)} />
        </div></div>);
}

/* ──── 14. EV Road Trip Planner ──── */
function EvRoadTripCalc() {
    const [totalDist, setTotalDist] = useState(800);
    const [range, setRange] = useState(400);
    const [dcSpeed, setDcSpeed] = useState(150);
    const [elecRate, setElecRate] = useState(0.40);
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
            <InputField label="Total Distance" value={totalDist} onChange={setTotalDist} unit="km" min={50} />
            <InputField label="EV Range" value={range} onChange={setRange} unit="km" min={100} />
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="DC Fast Speed" value={dcSpeed} onChange={setDcSpeed} unit="kW" min={50} max={350} step={50} />
            <InputField label="DC Charging Rate" value={elecRate} onChange={setElecRate} unit="per kWh" min={0.05} step={0.05} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Charging Stops" value={fmtInt(r.stops)} /><ResultRow label="Time per Stop" value={fmtTime(r.minsPerStop)} />
            <ResultRow label="Total Charging Time" value={fmtTime(r.totalChargeMins)} /><ResultRow label="Est. Charging Cost" value={fmt(r.totalCost, 2)} />
        </div></div>);
}

/* ──── 15. EV Cost per km ──── */
function EvCostPerMileCalc() {
    const [annualKm, setAnnualKm] = useState(20000);
    const [efficiency, setEfficiency] = useState(6.0);
    const [elecRate, setElecRate] = useState(0.15);
    const [annualInsurance, setAnnualInsurance] = useState(1500);
    const [annualMaint, setAnnualMaint] = useState(300);
    const r = useMemo(() => {
        const elecCost = (annualKm / efficiency) * elecRate;
        const totalAnnual = elecCost + annualInsurance + annualMaint;
        const cpk = totalAnnual / annualKm;
        const elecCpk = elecCost / annualKm;
        return { elecCost, totalAnnual, cpk, elecCpk };
    }, [annualKm, efficiency, elecRate, annualInsurance, annualMaint]);
    return (<div className="con-calc"><h3 className="con-calc__title">📈 EV Cost per km</h3>
        <div className="con-calc__inputs">
            <InputField label="Annual Distance" value={annualKm} onChange={setAnnualKm} unit="km" min={1000} step={1000} />
            <InputField label="EV Efficiency" value={efficiency} onChange={setEfficiency} unit="km/kWh" min={3} step={0.5} />
            <InputField label="Electricity Rate" value={elecRate} onChange={setElecRate} unit="per kWh" min={0.01} step={0.01} />
            <InputField label="Annual Insurance" value={annualInsurance} onChange={setAnnualInsurance} min={200} step={100} />
            <InputField label="Annual Maintenance" value={annualMaint} onChange={setAnnualMaint} min={0} step={50} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Electricity Cost/km" value={fmt(r.elecCpk, 3)} /><ResultRow label="All-In Cost/km" value={fmt(r.cpk, 3)} />
            <ResultRow label="Annual Operating Cost" value={fmt(r.totalAnnual, 0)} />
        </div></div>);
}

/* ──── 16. EV Battery Degradation ──── */
function EvBatteryDegradationCalc() {
    const [originalKwh, setOriginalKwh] = useState(75);
    const [ageYears, setAgeYears] = useState(3);
    const [mileage, setMileage] = useState(80000);
    const [fastChargePct, setFastChargePct] = useState(20);
    const r = useMemo(() => {
        const ageLoss = ageYears * 2.3;
        const mileLoss = (mileage / 16000) * 0.8;
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
            <InputField label="Odometer" value={mileage} onChange={setMileage} unit="km" min={0} step={5000} />
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
    const [laborRate, setLaborRate] = useState(100);
    const r = useMemo(() => {
        const packCost = batteryKwh * costPerKwh;
        const labor = laborHours * laborRate;
        const total = packCost + labor;
        return { packCost, labor, total };
    }, [batteryKwh, costPerKwh, laborHours, laborRate]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔧 EV Battery Replacement Cost</h3>
        <div className="con-calc__inputs">
            <InputField label="Battery Capacity" value={batteryKwh} onChange={setBatteryKwh} unit="kWh" min={20} />
            <InputField label="Cost per kWh" value={costPerKwh} onChange={setCostPerKwh} unit="per kWh" min={50} />
            <InputField label="Labor Hours" value={laborHours} onChange={setLaborHours} unit="hrs" min={2} max={20} />
            <InputField label="Labor Rate" value={laborRate} onChange={setLaborRate} unit="per hr" min={20} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Battery Pack" value={fmt(r.packCost, 0)} /><ResultRow label="Labor" value={fmt(r.labor, 0)} />
            <ResultRow label="Total Replacement" value={fmt(r.total, 0)} />
        </div></div>);
}

/* ──── 18. EV HP ↔ kW Converter ──── */
function EvHpKwCalc() {
    const [hp, setHp] = useState(300);
    const r = useMemo(() => {
        const kw = hp * 0.7457; const metricHp = hp * 1.01387;
        return { kw, metricHp };
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

/* ──── 19. EV 0-60 / 0-100 Estimator ──── */
function EvAccelerationCalc() {
    const [motorKw, setMotorKw] = useState(300);
    const [curbWeightKg, setCurbWeightKg] = useState(2000);
    const [drivetrain, setDrivetrain] = useState("awd");
    const r = useMemo(() => {
        const hp = motorKw / 0.7457;
        const curbWeightLbs = curbWeightKg * 2.205;
        const pwr = hp / (curbWeightLbs / 1000);
        const tractionFactor = drivetrain === "awd" ? 0.85 : 1.0;
        const est060 = (curbWeightLbs / hp) * 0.0078 * tractionFactor;
        const est0100 = est060 * 1.45;
        const quarter = est060 * 2.5 + 3.5;
        return { hp, pwr, est060: Math.max(est060, 1.8), est0100, quarter };
    }, [motorKw, curbWeightKg, drivetrain]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏎️ EV Acceleration Estimator</h3>
        <div className="con-calc__inputs">
            <InputField label="Motor Power" value={motorKw} onChange={setMotorKw} unit="kW" min={50} />
            <InputField label="Curb Weight" value={curbWeightKg} onChange={setCurbWeightKg} unit="kg" min={800} step={50} />
            <SelectField label="Drivetrain" value={drivetrain} onChange={setDrivetrain} options={[
                { value: "rwd", label: "RWD" }, { value: "awd", label: "AWD / Dual Motor" },
            ]} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Motor HP" value={fmt(r.hp, 0)} unit="HP" />
            <ResultRow label="Est. 0-100 km/h" value={fmt(r.est0100, 1)} unit="sec" />
            <ResultRow label="Est. 0-60 mph" value={fmt(r.est060, 1)} unit="sec" />
            <ResultRow label="Est. 1/4 Mile" value={fmt(r.quarter, 1)} unit="sec" />
        </div></div>);
}

/* ──── 20. EV Loan/EMI ──── */
function EvLoanCalc() {
    const [price, setPrice] = useState(40000);
    const [downPayment, setDownPayment] = useState(5000);
    const [tradeIn, setTradeIn] = useState(0);
    const [incentive, setIncentive] = useState(5000);
    const [rate, setRate] = useState(6.0);
    const [term, setTerm] = useState(60);
    const r = useMemo(() => {
        const loanAmt = price - downPayment - tradeIn - incentive;
        const mr = rate / 100 / 12;
        const monthly = mr > 0 ? loanAmt * mr / (1 - Math.pow(1 + mr, -term)) : loanAmt / term;
        const totalPaid = monthly * term + downPayment;
        const totalInterest = totalPaid - price + tradeIn + incentive;
        return { loanAmt, monthly, totalPaid, totalInterest };
    }, [price, downPayment, tradeIn, incentive, rate, term]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏦 EV Loan Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="Vehicle Price" value={price} onChange={setPrice} min={5000} step={1000} />
            <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} step={500} />
            <InputField label="Trade-In Value" value={tradeIn} onChange={setTradeIn} min={0} step={500} />
            <InputField label="Incentive/Subsidy" value={incentive} onChange={setIncentive} min={0} step={500} />
            <InputField label="Interest Rate" value={rate} onChange={setRate} unit="%" min={0} step={0.5} />
            <InputField label="Loan Term" value={term} onChange={setTerm} unit="months" min={12} max={84} step={12} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Loan Amount" value={fmt(r.loanAmt, 0)} /><ResultRow label="Monthly Payment" value={fmt(r.monthly, 0)} />
            <ResultRow label="Total Interest" value={fmt(r.totalInterest, 0)} /><ResultRow label="Total Cost" value={fmt(r.totalPaid, 0)} />
        </div></div>);
}

/* ──── 21. EV Break-Even ──── */
function EvBreakEvenCalc() {
    const [priceDiff, setPriceDiff] = useState(8000);
    const [annualFuelSavings, setAnnualFuelSavings] = useState(1200);
    const [annualMaintSavings, setAnnualMaintSavings] = useState(400);
    const r = useMemo(() => {
        const totalAnnualSavings = annualFuelSavings + annualMaintSavings;
        const years = totalAnnualSavings > 0 ? priceDiff / totalAnnualSavings : Infinity;
        const months = years * 12;
        return { totalAnnualSavings, years, months };
    }, [priceDiff, annualFuelSavings, annualMaintSavings]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚖️ EV Break-Even Calculator</h3>
        <div className="con-calc__inputs">
            <InputField label="EV Price Premium" value={priceDiff} onChange={setPriceDiff} min={0} step={1000} />
            <InputField label="Annual Fuel Savings" value={annualFuelSavings} onChange={setAnnualFuelSavings} min={0} step={100} />
            <InputField label="Annual Maint. Savings" value={annualMaintSavings} onChange={setAnnualMaintSavings} min={0} step={50} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Annual Savings" value={fmt(r.totalAnnualSavings, 0)} />
            <ResultRow label="Break-Even" value={r.years === Infinity ? "N/A" : `${fmt(r.years, 1)} years`} />
            <ResultRow label="Break-Even" value={r.months === Infinity ? "N/A" : `${fmt(r.months, 0)} months`} />
        </div></div>);
}

/* ──── 22. EV Resale Value ──── */
function EvResaleCalc() {
    const [purchasePrice, setPurchasePrice] = useState(40000);
    const [ageYears, setAgeYears] = useState(3);
    const [mileage, setMileage] = useState(60000);
    const r = useMemo(() => {
        const depRates = [1.0, 0.80, 0.70, 0.62, 0.55, 0.50, 0.45, 0.41, 0.38, 0.35, 0.32];
        const baseRetention = depRates[Math.min(ageYears, 10)] || 0.32;
        const avgKmPerYr = ageYears > 0 ? mileage / ageYears : 20000;
        const mileAdj = avgKmPerYr > 25000 ? -0.03 : avgKmPerYr < 15000 ? 0.02 : 0;
        const retention = Math.max(0.15, baseRetention + mileAdj);
        const resale = purchasePrice * retention;
        const lost = purchasePrice - resale;
        return { retention, resale, lost };
    }, [purchasePrice, ageYears, mileage]);
    return (<div className="con-calc"><h3 className="con-calc__title">💵 EV Resale Value</h3>
        <div className="con-calc__inputs">
            <InputField label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} min={5000} step={1000} />
            <InputField label="Vehicle Age" value={ageYears} onChange={setAgeYears} unit="years" min={0} max={10} />
            <InputField label="Odometer" value={mileage} onChange={setMileage} unit="km" min={0} step={5000} />
        </div>
        <div className="con-calc__results"><h4>Results</h4>
            <ResultRow label="Value Retention" value={`${(r.retention * 100).toFixed(0)}%`} />
            <ResultRow label="Estimated Resale" value={fmt(r.resale, 0)} /><ResultRow label="Depreciation" value={fmt(r.lost, 0)} />
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
