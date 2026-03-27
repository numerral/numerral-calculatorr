"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 2) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const fmt = (n: number, d = 0) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

function ResultRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
    return (<div className="con-result-row" style={highlight ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : warn ? { background: "rgba(234,179,8,0.08)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined}>
        <span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value" style={highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : undefined}>{value}</span>
    </div>);
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder, id }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; placeholder?: string; id?: string;
}) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
        <input id={id} type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 1} placeholder={placeholder} /></div>);
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAECarLoanSalikCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🚗 Car Loan EMI", "🛣️ Salik Estimator", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🚗 Car Loan & Salik Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <CarLoanTab />}
        {tab === 1 && <SalikTab />}
        {tab === 2 && <ReferenceTab />}
    </div>);
}

/* ── Car Loan EMI Tab ── */
function CarLoanTab() {
    const [carPrice, setCarPrice] = useState("120000");
    const [downPayment, setDownPayment] = useState("20");
    const [flatRate, setFlatRate] = useState("2.99");
    const [tenure, setTenure] = useState("60");
    const [carType, setCarType] = useState("new");
    const [includeInsurance, setIncludeInsurance] = useState(true);
    const [insuranceRate, setInsuranceRate] = useState("2");

    const result = useMemo(() => {
        const price = parseFloat(carPrice) || 0;
        const dpPct = parseFloat(downPayment) || 0;
        const rate = parseFloat(flatRate) || 0;
        const months = parseInt(tenure) || 0;
        if (price <= 0 || months <= 0) return null;

        const dpAmount = price * (dpPct / 100);
        const loanAmount = price - dpAmount;
        const totalInterest = loanAmount * (rate / 100) * (months / 12);
        const totalRepay = loanAmount + totalInterest;
        const emi = totalRepay / months;

        // Reducing rate equivalent (approx flat × 1.82)
        const reducingRate = rate * 1.82;

        // Insurance
        const annualInsurance = includeInsurance ? price * (parseFloat(insuranceRate + "") / 100) : 0;
        const monthlyInsurance = annualInsurance / 12;

        // Registration (approx annual)
        const annualReg = 380 + 170; // renewal + inspection

        return {
            dpAmount, loanAmount, totalInterest, totalRepay, emi,
            reducingRate, annualInsurance, monthlyInsurance, annualReg,
            totalMonthly: emi + monthlyInsurance,
            totalCostWithInsurance: totalRepay + (annualInsurance * (months / 12)),
            price, months,
        };
    }, [carPrice, downPayment, flatRate, tenure, carType, includeInsurance, insuranceRate]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🚗 Enter the car price, down payment percentage, and flat interest rate to calculate your monthly EMI. CBUAE requires minimum 20% down payment and maximum 60 months tenure. Banks advertise flat rates — the effective reducing rate is ~1.8× higher.
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[{ v: "new", l: "🆕 New Car" }, { v: "used", l: "🔄 Used Car" }].map(e => (
                    <button key={e.v} onClick={() => setCarType(e.v)}
                        className={`calc-tab-btn${carType === e.v ? " calc-tab-btn--active" : ""}`}
                        style={{ fontSize: "0.85rem", padding: "6px 14px" }}>{e.l}</button>
                ))}
            </div>

            <InputField id="car-price" label="Car Price" value={carPrice} onChange={setCarPrice} unit="AED" min={0} placeholder="e.g. 120000" />
            <InputField id="car-dp" label="Down Payment" value={downPayment} onChange={setDownPayment} unit="%" min={20} max={90} step={5} placeholder="Min 20%" />
            <InputField id="car-rate" label="Flat Interest Rate" value={flatRate} onChange={setFlatRate} unit="% per annum" min={0} max={20} step={0.01} placeholder="e.g. 2.99" />
            <InputField id="car-tenure" label="Loan Tenure" value={tenure} onChange={setTenure} unit="months" min={12} max={60} step={12} placeholder="Max 60" />

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input type="checkbox" id="car-ins" checked={includeInsurance} onChange={e => setIncludeInsurance(e.target.checked)} style={{ width: 16, height: 16 }} />
                    <label htmlFor="car-ins" style={{ fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Include Insurance Estimate</label>
                </div>
                {includeInsurance && <InputField id="car-ins-rate" label="Insurance Rate" value={insuranceRate} onChange={setInsuranceRate} unit="% of car value/year" min={1} max={5} step={0.25} />}
            </div>
        </div>

        {result && <div className="con-calc__results">
            <h4>Loan Breakdown</h4>
            <ResultRow label="Car Price" value={fmtAED(result.price)} />
            <ResultRow label={`Down Payment (${downPayment}%)`} value={fmtAED(result.dpAmount)} />
            <ResultRow label="Loan Amount (financed)" value={fmtAED(result.loanAmount)} />
            <ResultRow label={`Total Interest (${flatRate}% flat × ${(result.months / 12).toFixed(1)} yrs)`} value={fmtAED(result.totalInterest)} warn />
            <ResultRow label="Total Repayment" value={fmtAED(result.totalRepay)} />

            <h4>Monthly Payment</h4>
            <ResultRow label="Monthly EMI (loan only)" value={fmtAED(result.emi)} highlight />
            {result.monthlyInsurance > 0 && <>
                <ResultRow label="Monthly Insurance" value={fmtAED(result.monthlyInsurance)} />
                <ResultRow label="Total Monthly (EMI + Insurance)" value={fmtAED(result.totalMonthly)} highlight />
            </>}

            <h4>Rate Comparison</h4>
            <ResultRow label="Advertised Flat Rate" value={`${flatRate}% p.a.`} />
            <ResultRow label="Effective Reducing Rate (approx.)" value={`${result.reducingRate.toFixed(2)}% p.a.`} warn />

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ <strong>Important:</strong> Banks advertise flat rates, but the effective cost (reducing rate) is roughly 1.8× higher. A 2.99% flat rate ≈ 5.44% reducing/APR. Always compare using the reducing rate or total cost — not the flat rate. CBUAE caps tenure at 60 months and requires min 20% down payment.
            </div>
        </div>}
    </div>);
}

/* ── Salik Estimator Tab ── */
function SalikTab() {
    const [dailyCrossings, setDailyCrossings] = useState("4");
    const [peakPct, setPeakPct] = useState("60");
    const [workDays, setWorkDays] = useState("22");

    const result = useMemo(() => {
        const crossings = parseFloat(dailyCrossings) || 0;
        const peak = parseFloat(peakPct) || 0;
        const days = parseFloat(workDays) || 0;
        if (crossings <= 0 || days <= 0) return null;

        const peakCrossings = crossings * (peak / 100);
        const offPeakCrossings = crossings - peakCrossings;
        const dailyCost = (peakCrossings * 6) + (offPeakCrossings * 4);
        const monthlyCost = dailyCost * days;
        const annualCost = monthlyCost * 12;

        return { peakCrossings, offPeakCrossings, dailyCost, monthlyCost, annualCost, crossings, days };
    }, [dailyCrossings, peakPct, workDays]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🛣️ Estimate your monthly Salik toll costs. Since January 2025, Dubai uses variable pricing: <strong>AED 6 peak</strong> (6–10AM, 4–8PM weekdays), <strong>AED 4 off-peak</strong>, <strong>free 1–6AM</strong>. Sundays are AED 4 all day.
            </div>

            <InputField id="salik-crossings" label="Gate Crossings per Day" value={dailyCrossings} onChange={setDailyCrossings} unit="crossings" min={0} max={20} placeholder="e.g. 4" />
            <InputField id="salik-peak" label="Peak Hour Crossings" value={peakPct} onChange={setPeakPct} unit="% of total" min={0} max={100} step={10} placeholder="e.g. 60" />
            <InputField id="salik-days" label="Working Days per Month" value={workDays} onChange={setWorkDays} unit="days" min={1} max={31} placeholder="e.g. 22" />
        </div>

        {result && <div className="con-calc__results">
            <h4>Daily Breakdown</h4>
            <ResultRow label={`Peak crossings (AED 6 × ${result.peakCrossings.toFixed(1)})`} value={fmtAED(result.peakCrossings * 6)} />
            <ResultRow label={`Off-peak crossings (AED 4 × ${result.offPeakCrossings.toFixed(1)})`} value={fmtAED(result.offPeakCrossings * 4)} />
            <ResultRow label="Daily Salik Cost" value={fmtAED(result.dailyCost)} />

            <h4>Monthly & Annual</h4>
            <ResultRow label={`Monthly (${result.days} working days)`} value={fmtAED(result.monthlyCost)} highlight />
            <ResultRow label="Annual Salik Cost" value={fmtAED(result.annualCost)} warn />

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                💡 <strong>Tip:</strong> If you cross Al Mamzar North/South or Al Safa North/South in the same direction within 1 hour, you&apos;re only charged once. Traveling 1–6AM is free. Sundays are AED 4 flat all day.
            </div>
        </div>}
    </div>);
}

/* ══════════════════════════════════════════════════
   REFERENCE TAB
   ══════════════════════════════════════════════════ */
function ReferenceTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        {/* Bank Rate Comparison */}
        <h4>UAE Car Loan Rate Comparison</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Bank</th>
                <th style={th}>Flat Rate (New)</th>
                <th style={th}>Max Finance</th>
                <th style={th}>Max Tenure</th>
            </tr></thead><tbody>
                {([
                    ["Emirates NBD", "From 1.99%", "AED 1.5M / 80%", "60 months"],
                    ["First Abu Dhabi Bank (FAB)", "From 2.49%", "AED 1.5M / 80%", "60 months"],
                    ["ADCB", "From 2.75%", "AED 1.5M / 80%", "60 months"],
                    ["Emirates Islamic", "From 2.49%", "AED 1M / 80%", "60 months"],
                    ["Mashreq", "From 3.19%", "AED 1M / 80%", "60 months"],
                    ["RAKBANK", "From 2.99%", "80% of value", "60 months"],
                    ["Dubai Islamic Bank", "From 2.65%", "AED 1M / 80%", "60 months"],
                    ["CBD", "From 2.99%", "80% of value", "60 months"],
                ] as string[][]).map(([bank, rate, max, tenure], i) => (
                    <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{bank}</td><td style={{ ...td, fontWeight: 700, color: "#009639" }}>{rate}</td><td style={td}>{max}</td><td style={td}>{tenure}</td></tr>
                ))}</tbody></table>
        </div>

        {/* Flat vs Reducing */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Flat Rate vs Reducing Rate Conversion</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={th}>Flat Rate</th>
                <th style={th}>≈ Reducing Rate (APR)</th>
                <th style={th}>Interest on AED 100K / 5yr</th>
                <th style={{ ...th, textAlign: "left" }}>Typical Scenario</th>
            </tr></thead><tbody>
                {([
                    ["1.99%", "~3.62%", "AED 9,950", "Best promotional rate"],
                    ["2.49%", "~4.53%", "AED 12,450", "UAE Nationals / salary transfer"],
                    ["2.99%", "~5.44%", "AED 14,950", "Standard new car rate"],
                    ["3.49%", "~6.35%", "AED 17,450", "Non-salary transfer"],
                    ["3.99%", "~7.26%", "AED 19,950", "Used car rate"],
                    ["5.00%", "~9.10%", "AED 25,000", "High-risk / older vehicle"],
                ] as string[][]).map(([flat, reducing, interest, scenario], i) => (
                    <tr key={i} style={b}><td style={{ ...td, fontWeight: 700 }}>{flat}</td><td style={{ ...td, fontWeight: 700, color: "#b45309" }}>{reducing}</td><td style={td}>{interest}</td><td style={tl}>{scenario}</td></tr>
                ))}</tbody></table>
        </div>

        {/* Salik Gate Locations */}
        <h4 style={{ marginTop: "var(--s-4)" }}>All 10 Salik Toll Gates (2025)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Gate</th>
                <th style={{ ...th, textAlign: "left" }}>Location</th>
                <th style={{ ...th, textAlign: "left" }}>Notes</th>
            </tr></thead><tbody>
                {([
                    ["Al Barsha", "Sheikh Zayed Road (E11)", "Between Mall of the Emirates & Dubai Marina"],
                    ["Al Garhoud Bridge", "Sheikh Rashid Road", "Crossing Dubai Creek near DAFZA"],
                    ["Al Maktoum Bridge", "Umm Hurair Road", "Peak hours only — free at night/Fridays"],
                    ["Al Mamzar North", "Al Ittihad Road (towards Sharjah)", "1-hour rule with South gate"],
                    ["Al Mamzar South", "Al Ittihad Road (opposite direction)", "1-hour rule with North gate"],
                    ["Al Safa North", "Sheikh Zayed Road", "Between DIFC and Jumeirah"],
                    ["Al Safa South ⭐", "Sheikh Zayed Road", "NEW — Nov 2024"],
                    ["Airport Tunnel", "Beirut Street", "Near DXB Terminal 3"],
                    ["Business Bay Crossing ⭐", "Al Khail Road", "NEW — Nov 2024"],
                    ["Jebel Ali", "Sheikh Zayed Road (towards Abu Dhabi)", "Last gate before Abu Dhabi border"],
                ] as string[][]).map(([gate, location, notes], i) => (
                    <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{gate}</td><td style={tl}>{location}</td><td style={tl}>{notes}</td></tr>
                ))}</tbody></table>
        </div>

        {/* Salik Variable Pricing */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Salik Variable Pricing (Jan 2025)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Time Period</th>
                <th style={th}>Weekday Rate</th>
                <th style={th}>Sunday Rate</th>
                <th style={{ ...th, textAlign: "left" }}>Hours</th>
            </tr></thead><tbody>
                {([
                    ["🔴 Peak", "AED 6", "AED 4", "6–10AM & 4–8PM"],
                    ["🟡 Off-Peak", "AED 4", "AED 4", "10AM–4PM & 8PM–1AM"],
                    ["🟢 Late Night", "FREE", "FREE", "1AM–6AM"],
                ] as string[][]).map(([period, weekday, sunday, hours], i) => (
                    <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{period}</td><td style={{ ...td, fontWeight: 700, color: i === 0 ? "#dc2626" : i === 1 ? "#b45309" : "#009639" }}>{weekday}</td><td style={td}>{sunday}</td><td style={tl}>{hours}</td></tr>
                ))}</tbody></table>
        </div>

        {/* Annual Ownership Cost */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Annual Car Ownership Costs (Dubai)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Cost Item</th>
                <th style={th}>Budget Car</th>
                <th style={th}>Mid-Range</th>
                <th style={th}>Luxury</th>
            </tr></thead><tbody>
                {([
                    ["Insurance (comprehensive)", "AED 1,200", "AED 2,500", "AED 5,000+"],
                    ["Registration renewal", "AED 380", "AED 380", "AED 380"],
                    ["Vehicle inspection", "AED 170", "AED 170", "AED 170"],
                    ["Salik tolls", "AED 1,200", "AED 2,400", "AED 3,600"],
                    ["Fuel (12,000 km/yr)", "AED 2,400", "AED 3,600", "AED 6,000"],
                    ["Maintenance/service", "AED 1,000", "AED 2,000", "AED 5,000+"],
                    ["Parking", "AED 1,200", "AED 2,400", "AED 4,800"],
                    ["Total (est. annual)", "~AED 7,550", "~AED 13,450", "~AED 24,950+"],
                ] as string[][]).map(([item, budget, mid, luxury], i) => (
                    <tr key={i} style={b}><td style={{ ...tl, fontWeight: i === 7 ? 700 : 600 }}>{item}</td><td style={{ ...td, fontWeight: i === 7 ? 700 : 400 }}>{budget}</td><td style={{ ...td, fontWeight: i === 7 ? 700 : 400 }}>{mid}</td><td style={{ ...td, fontWeight: i === 7 ? 700 : 400 }}>{luxury}</td></tr>
                ))}</tbody></table>
        </div>
    </div>);
}
