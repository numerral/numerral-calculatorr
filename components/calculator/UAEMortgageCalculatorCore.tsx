"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtAED = (n: number, d = 0) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (<div className="con-result-row" style={highlight ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined}>
        <span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value" style={highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : undefined}>{value}</span>
    </div>);
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder, id }: {
    label: string; value: number | string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; placeholder?: string; id?: string;
}) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
        <input id={id} type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 1} placeholder={placeholder} /></div>);
}

function SelectField({ label, value, onChange, options, id }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; id?: string }) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}</label>
        <select id={id} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

/* ── LTV Limits based on CBUAE Regulations ── */
const LTV_LIMITS: Record<string, Record<string, { firstBelow5m: number; firstAbove5m: number; second: number; offPlan: number }>> = {
    national: {
        ready: { firstBelow5m: 85, firstAbove5m: 75, second: 65, offPlan: 50 },
    },
    resident: {
        ready: { firstBelow5m: 80, firstAbove5m: 70, second: 60, offPlan: 50 },
    },
    nonResident: {
        ready: { firstBelow5m: 65, firstAbove5m: 60, second: 50, offPlan: 50 },
    },
};

function getMaxLTV(residency: string, propertyValue: number, isFirstHome: boolean, isOffPlan: boolean): number {
    const limits = LTV_LIMITS[residency]?.ready;
    if (!limits) return 50;
    if (isOffPlan) return limits.offPlan;
    if (!isFirstHome) return limits.second;
    return propertyValue <= 5_000_000 ? limits.firstBelow5m : limits.firstAbove5m;
}

/* ── Fee Structures by Emirate ── */
interface FeeStructure {
    dldRate: number;         // % of property value
    dldName: string;
    dldAdmin: number;
    mortgageRegRate: number; // % of loan
    mortgageRegAdmin: number;
    trusteeFee: number;
    titleDeed: number;
    agentRate: number;       // %
    valuationFee: number;
    bankProcessingRate: number; // % of loan
    vatRate: number;            // on service fees
}

const FEE_STRUCTURES: Record<string, FeeStructure> = {
    dubai: {
        dldName: "DLD Transfer Fee",
        dldRate: 4,
        dldAdmin: 580,
        mortgageRegRate: 0.25,
        mortgageRegAdmin: 290,
        trusteeFee: 4200,
        titleDeed: 580,
        agentRate: 2,
        valuationFee: 3000,
        bankProcessingRate: 1,
        vatRate: 5,
    },
    abuDhabi: {
        dldName: "DMT Transfer Fee",
        dldRate: 2,
        dldAdmin: 400,
        mortgageRegRate: 0.1,
        mortgageRegAdmin: 400,
        trusteeFee: 4000,
        titleDeed: 1000,
        agentRate: 2,
        valuationFee: 2500,
        bankProcessingRate: 1,
        vatRate: 5,
    },
    other: {
        dldName: "Transfer Fee",
        dldRate: 2,
        dldAdmin: 500,
        mortgageRegRate: 0.15,
        mortgageRegAdmin: 350,
        trusteeFee: 4000,
        titleDeed: 750,
        agentRate: 2,
        valuationFee: 2500,
        bankProcessingRate: 1,
        vatRate: 5,
    },
};

/* ── Monthly EMI (standard amortization) ── */
function calcEMI(principal: number, annualRate: number, years: number) {
    if (principal <= 0 || annualRate <= 0 || years <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const r = annualRate / 100 / 12;
    const n = years * 12;
    const emi = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;
    return { emi, totalInterest, totalPayment };
}

/* ══════════════════════════════════════════════════
   MAIN CALCULATOR COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAEMortgageCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏠 UAE Mortgage Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <CalculatorTab />}
        {tab === 1 && <ReferenceTab />}
    </div>);
}

/* ── Calculator Tab ── */
function CalculatorTab() {
    const [residency, setResidency] = useState("resident");
    const [propertyValue, setPropertyValue] = useState("2000000");
    const [downPaymentPct, setDownPaymentPct] = useState("");
    const [downPaymentAmt, setDownPaymentAmt] = useState("");
    const [dpMode, setDpMode] = useState<"pct" | "amt">("pct");
    const [tenure, setTenure] = useState("25");
    const [rate, setRate] = useState("4.99");
    const [isFirstHome, setIsFirstHome] = useState("yes");
    const [propertyType, setPropertyType] = useState("ready");
    const [emirate, setEmirate] = useState("dubai");
    const [salary, setSalary] = useState("25000");
    const [existingEMI, setExistingEMI] = useState("0");

    const result = useMemo(() => {
        const pv = parseFloat(propertyValue) || 0;
        const t = parseInt(tenure) || 25;
        const r = parseFloat(rate) || 4.99;
        const sal = parseFloat(salary) || 0;
        const existingDebt = parseFloat(existingEMI) || 0;
        if (pv <= 0) return null;

        // LTV
        const first = isFirstHome === "yes";
        const offPlan = propertyType === "offplan";
        const maxLTV = getMaxLTV(residency, pv, first, offPlan);
        const minDownPct = 100 - maxLTV;

        // Down payment
        let dp: number;
        if (dpMode === "pct") {
            const pct = parseFloat(downPaymentPct) || minDownPct;
            dp = pv * (Math.max(pct, minDownPct) / 100);
        } else {
            dp = parseFloat(downPaymentAmt) || pv * (minDownPct / 100);
            dp = Math.max(dp, pv * (minDownPct / 100));
        }
        const actualDpPct = (dp / pv) * 100;
        const loanAmount = pv - dp;

        // EMI
        const { emi, totalInterest, totalPayment } = calcEMI(loanAmount, r, t);

        // DBR check
        const dbr = sal > 0 ? ((emi + existingDebt) / sal) * 100 : 0;
        const dbrPass = dbr <= 50;
        const maxEMI = sal * 0.5 - existingDebt;
        const maxLoanForSalary = maxEMI > 0 ? calcMaxLoan(maxEMI, r, t) : 0;

        // Fees
        const fees = FEE_STRUCTURES[emirate] || FEE_STRUCTURES.dubai;
        const dldFee = pv * (fees.dldRate / 100) + fees.dldAdmin;
        const agentFee = pv * (fees.agentRate / 100);
        const agentVAT = agentFee * (fees.vatRate / 100);
        const mortgageReg = loanAmount * (fees.mortgageRegRate / 100) + fees.mortgageRegAdmin;
        const valuationWithVAT = fees.valuationFee * (1 + fees.vatRate / 100);
        const bankProcessing = loanAmount * (fees.bankProcessingRate / 100);
        const bankProcessingVAT = bankProcessing * (fees.vatRate / 100);
        const totalUpfront = dldFee + agentFee + agentVAT + fees.trusteeFee + mortgageReg + valuationWithVAT + bankProcessing + bankProcessingVAT + fees.titleDeed;
        const totalCashNeeded = dp + totalUpfront;

        return {
            pv, dp, actualDpPct, loanAmount, maxLTV, minDownPct,
            emi, totalInterest, totalPayment, t,
            sal, dbr, dbrPass, maxEMI, maxLoanForSalary, existingDebt,
            fees, dldFee, agentFee, agentVAT, mortgageReg, valuationWithVAT,
            bankProcessing, bankProcessingVAT, totalUpfront, totalCashNeeded, emirate,
        };
    }, [residency, propertyValue, downPaymentPct, downPaymentAmt, dpMode, tenure, rate, isFirstHome, propertyType, emirate, salary, existingEMI]);

    return (<div>
        <div className="con-calc__inputs">
            <SelectField id="uae-residency" label="Residency Status" value={residency} onChange={setResidency} options={[
                { value: "national", label: "🇦🇪 UAE National" },
                { value: "resident", label: "🏢 UAE Resident (Expat)" },
                { value: "nonResident", label: "✈️ Non-Resident" },
            ]} />
            <SelectField id="uae-emirate" label="Emirate" value={emirate} onChange={setEmirate} options={[
                { value: "dubai", label: "🏙️ Dubai" },
                { value: "abuDhabi", label: "🕌 Abu Dhabi" },
                { value: "other", label: "📍 Other Emirates" },
            ]} />
            <InputField id="uae-property-value" label="Property Value" value={propertyValue} onChange={setPropertyValue} unit="AED" min={0} placeholder="e.g. 2000000" />
            <SelectField id="uae-property-type" label="Property Type" value={propertyType} onChange={setPropertyType} options={[
                { value: "ready", label: "🏗️ Ready (Completed)" },
                { value: "offplan", label: "📐 Off-Plan (Under Construction)" },
            ]} />
            <SelectField id="uae-first-home" label="Purchase Type" value={isFirstHome} onChange={setIsFirstHome} options={[
                { value: "yes", label: "First Home (Owner-Occupier)" },
                { value: "no", label: "Second/Investment Property" },
            ]} />

            {result && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 12 }}>
                📋 Max LTV: <strong>{result.maxLTV}%</strong> · Min Down Payment: <strong>{result.minDownPct}%</strong> ({fmtAED(result.pv * result.minDownPct / 100)})
            </div>}

            <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <button onClick={() => setDpMode("pct")} style={{ flex: 1, padding: "6px", borderRadius: 6, fontSize: "0.78rem", fontWeight: dpMode === "pct" ? 700 : 500, background: dpMode === "pct" ? "rgba(0,150,57,0.1)" : "transparent", color: dpMode === "pct" ? "#009639" : "var(--text-muted)", border: `1px solid ${dpMode === "pct" ? "#009639" : "var(--border)"}`, cursor: "pointer" }}>Down Payment %</button>
                <button onClick={() => setDpMode("amt")} style={{ flex: 1, padding: "6px", borderRadius: 6, fontSize: "0.78rem", fontWeight: dpMode === "amt" ? 700 : 500, background: dpMode === "amt" ? "rgba(0,150,57,0.1)" : "transparent", color: dpMode === "amt" ? "#009639" : "var(--text-muted)", border: `1px solid ${dpMode === "amt" ? "#009639" : "var(--border)"}`, cursor: "pointer" }}>Down Payment AED</button>
            </div>
            {dpMode === "pct"
                ? <InputField id="uae-dp-pct" label="Down Payment" value={downPaymentPct} onChange={setDownPaymentPct} unit="%" min={0} max={100} step={1} placeholder={result ? `Min ${result.minDownPct}%` : "20"} />
                : <InputField id="uae-dp-amt" label="Down Payment" value={downPaymentAmt} onChange={setDownPaymentAmt} unit="AED" min={0} placeholder={result ? `Min ${fmtAED(result.pv * result.minDownPct / 100)}` : ""} />
            }

            <InputField id="uae-tenure" label="Loan Tenure" value={tenure} onChange={setTenure} unit="years" min={1} max={25} />
            <InputField id="uae-rate" label="Annual Interest / Profit Rate" value={rate} onChange={setRate} unit="%" min={0} max={20} step={0.01} />

            <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 12, marginTop: 8 }}>
                <InputField id="uae-salary" label="Monthly Net Salary (for DBR Check)" value={salary} onChange={setSalary} unit="AED" min={0} placeholder="e.g. 25000" />
                <InputField id="uae-existing-emi" label="Existing Monthly Debt (loans, cards)" value={existingEMI} onChange={setExistingEMI} unit="AED" min={0} placeholder="e.g. 2000" />
            </div>
        </div>

        {result && result.emi > 0 && <div className="con-calc__results">
            <h4>Monthly Payment</h4>
            <ResultRow label="Monthly EMI" value={fmtAED(result.emi)} highlight />
            <ResultRow label="Loan Amount" value={fmtAED(result.loanAmount)} />
            <ResultRow label="Down Payment" value={`${fmtAED(result.dp)} (${fmt(result.actualDpPct, 1)}%)`} />
            <ResultRow label="Total Interest" value={fmtAED(result.totalInterest)} />
            <ResultRow label="Total Repayment" value={`${fmtAED(result.totalPayment)} over ${result.t} years`} />

            <h4>Debt Burden Ratio (DBR) Check</h4>
            <ResultRow label="Monthly Salary" value={fmtAED(result.sal)} />
            {result.existingDebt > 0 && <ResultRow label="Existing Monthly Debt" value={fmtAED(result.existingDebt)} />}
            <ResultRow label="Total Monthly Obligations" value={fmtAED(result.emi + result.existingDebt)} />
            <ResultRow label="DBR" value={`${fmt(result.dbr, 1)}% ${result.dbrPass ? "✅ Within 50% limit" : "❌ Exceeds 50% limit"}`} highlight={!result.dbrPass} />
            {!result.dbrPass && result.maxLoanForSalary > 0 && <ResultRow label="Max Affordable Loan" value={fmtAED(result.maxLoanForSalary)} />}

            <h4>Upfront Costs — {result.emirate === "dubai" ? "Dubai" : result.emirate === "abuDhabi" ? "Abu Dhabi" : "UAE"}</h4>
            <ResultRow label={result.fees.dldName} value={`${fmtAED(result.dldFee)} (${result.fees.dldRate}% + admin)`} />
            <ResultRow label="Agent Commission" value={`${fmtAED(result.agentFee)} + ${fmtAED(result.agentVAT)} VAT`} />
            <ResultRow label="Trustee Fee" value={fmtAED(result.fees.trusteeFee)} />
            <ResultRow label="Mortgage Registration" value={fmtAED(result.mortgageReg)} />
            <ResultRow label="Property Valuation" value={`${fmtAED(result.valuationWithVAT)} (incl. VAT)`} />
            <ResultRow label="Bank Processing" value={`${fmtAED(result.bankProcessing)} + ${fmtAED(result.bankProcessingVAT)} VAT`} />
            <ResultRow label="Title Deed" value={fmtAED(result.fees.titleDeed)} />
            <ResultRow label="Total Upfront Costs" value={fmtAED(result.totalUpfront)} highlight />

            <h4>Total Cash Needed</h4>
            <ResultRow label="Down Payment" value={fmtAED(result.dp)} />
            <ResultRow label="Upfront Costs" value={fmtAED(result.totalUpfront)} />
            <ResultRow label="Total Cash Required at Purchase" value={fmtAED(result.totalCashNeeded)} highlight />

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ This calculator provides estimates based on CBUAE regulations (2025). Actual rates, fees, and eligibility may vary by bank. Since Feb 2025, DLD fees and agent commissions must be paid upfront (cannot be included in the mortgage). Consult your bank or mortgage broker for official quotes.
            </div>
        </div>}
    </div>);
}

/* ── Helper: reverse-engineer max loan from monthly payment capacity ── */
function calcMaxLoan(maxEMI: number, annualRate: number, years: number): number {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    return maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
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
        {/* LTV Table */}
        <h4>CBUAE Loan-to-Value (LTV) Limits</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Buyer Type</th>
                    <th style={th}>First Home ≤ AED 5M</th>
                    <th style={th}>First Home &gt; AED 5M</th>
                    <th style={th}>2nd / Investment</th>
                    <th style={th}>Off-Plan</th>
                </tr></thead>
                <tbody>
                    {([
                        ["🇦🇪 UAE National", "85%", "75%", "65%", "50%"],
                        ["🏢 UAE Resident (Expat)", "80%", "70%", "60%", "50%"],
                        ["✈️ Non-Resident", "65%", "60%", "50%", "50%"],
                    ] as string[][]).map(([type, f1, f2, s, o], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{type}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{f1}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{f2}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{s}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{o}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Dubai vs Abu Dhabi Fees */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Dubai vs Abu Dhabi — Property Fee Comparison</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Fee</th>
                    <th style={th}>Dubai</th>
                    <th style={th}>Abu Dhabi</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Transfer/Registration Fee", "4% of property value + AED 580", "2% of property value + AED 400"],
                        ["Mortgage Registration", "0.25% of loan + AED 290", "0.1% of loan + AED 400"],
                        ["Trustee Fee", "AED 4,200", "AED 4,000"],
                        ["Title Deed", "AED 580", "AED 1,000"],
                        ["Agent Commission", "2% + 5% VAT", "2% + 5% VAT"],
                        ["Property Valuation", "AED 3,000 + 5% VAT", "AED 2,500 + 5% VAT"],
                        ["Bank Processing", "~1% of loan + 5% VAT", "~1% of loan + 5% VAT"],
                        ["Early Settlement", "1% of balance (max AED 10,000)", "1% of balance (max AED 10,000)"],
                    ] as string[][]).map(([fee, dxb, auh], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{fee}</td>
                            <td style={td}>{dxb}</td>
                            <td style={td}>{auh}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Bank Rates */}
        <h4 style={{ marginTop: "var(--s-4)" }}>UAE Bank Mortgage Rates (Indicative — 2025)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Bank</th>
                    <th style={th}>Fixed Rate</th>
                    <th style={th}>Variable Rate</th>
                    <th style={th}>Max Tenure</th>
                    <th style={{ ...th, textAlign: "left" }}>Products</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Emirates NBD", "4.49–5.49%", "EIBOR + 1.49%", "25 yrs", "Conventional + Islamic"],
                        ["ADCB", "4.25–5.25%", "EIBOR + 1.25%", "25 yrs", "Conventional + Islamic"],
                        ["First Abu Dhabi (FAB)", "4.49–5.49%", "EIBOR + 1.49%", "25 yrs", "Conventional + Islamic"],
                        ["Dubai Islamic Bank", "4.99–5.99%", "EIBOR + 1.75%", "25 yrs", "Murabaha / Ijara"],
                        ["Mashreq", "4.75–5.50%", "EIBOR + 1.50%", "25 yrs", "Conventional + Islamic"],
                        ["HSBC UAE", "4.39–5.25%", "EIBOR + 1.29%", "25 yrs", "Conventional"],
                        ["RAK Bank", "4.99–5.75%", "EIBOR + 1.60%", "25 yrs", "Conventional + Islamic"],
                        ["Abu Dhabi Islamic Bank", "5.25–6.25%", "EIBOR + 1.85%", "25 yrs", "Murabaha / Ijara"],
                    ] as string[][]).map(([bank, fixed, variable, max, products], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{bank}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fixed}</td>
                            <td style={td}>{variable}</td>
                            <td style={td}>{max}</td>
                            <td style={tl}>{products}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Quick EMI Lookup */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Quick EMI Lookup — Monthly Payment (AED)</h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>Based on 4.99% annual rate. Down payment already deducted.</p>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Loan Amount</th>
                    <th style={th}>15 Years</th>
                    <th style={th}>20 Years</th>
                    <th style={th}>25 Years</th>
                </tr></thead>
                <tbody>
                    {[500000, 750000, 1000000, 1500000, 2000000, 3000000, 4000000, 5000000].map((loan) => (
                        <tr key={loan} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{fmtAED(loan)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fmtAED(calcEMI(loan, 4.99, 15).emi)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fmtAED(calcEMI(loan, 4.99, 20).emi)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fmtAED(calcEMI(loan, 4.99, 25).emi)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* CBUAE Key Regulations */}
        <h4 style={{ marginTop: "var(--s-4)" }}>CBUAE Key Mortgage Regulations</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Regulation</th>
                    <th style={th}>Limit</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Debt Burden Ratio (DBR)", "50%", "Total monthly debt ≤ 50% of net income"],
                        ["Maximum Tenure", "25 years", "For all buyer categories"],
                        ["Age Limit (Salaried)", "65 years", "Loan must be repaid by age 65"],
                        ["Age Limit (Self-Employed)", "70 years", "Loan must be repaid by age 70"],
                        ["Minimum Salary (Expat)", "AED 15,000+", "Varies by bank and property"],
                        ["Early Settlement", "1% of balance", "Capped at AED 10,000"],
                        ["Upfront Fees (Feb 2025)", "Must be paid cash", "DLD, agent, trustee fees excluded from loan"],
                        ["Insurance", "Required", "Life + property insurance for mortgage duration"],
                    ] as string[][]).map(([reg, limit, details], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{reg}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{limit}</td>
                            <td style={tl}>{details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Minimum Salary by Loan */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Minimum Salary to Qualify (DBR 50%, no other debt)</h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>At 4.99%, 25-year tenure. Salary = EMI ÷ 0.50.</p>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Property Value</th>
                    <th style={th}>20% Down (Expat)</th>
                    <th style={th}>15% Down (National)</th>
                    <th style={th}>35% Down (Non-Resident)</th>
                </tr></thead>
                <tbody>
                    {[1000000, 1500000, 2000000, 3000000, 5000000].map((pv) => {
                        const salary20 = calcEMI(pv * 0.80, 4.99, 25).emi / 0.50;
                        const salary15 = calcEMI(pv * 0.85, 4.99, 25).emi / 0.50;
                        const salary35 = calcEMI(pv * 0.65, 4.99, 25).emi / 0.50;
                        return (<tr key={pv} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{fmtAED(pv)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fmtAED(salary20)}</td>
                            <td style={{ ...td }}>{fmtAED(salary15)}</td>
                            <td style={{ ...td }}>{fmtAED(salary35)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>
    </div>);
}
