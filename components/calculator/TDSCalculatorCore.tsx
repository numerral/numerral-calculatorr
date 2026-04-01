"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/* ─── TDS SECTION DATABASE (FY 2025-26) ─── */
type TdsSection = {
    section: string; nature: string; threshold: number; thresholdNote?: string;
    rate_ind: number; rate_other: number; rate_no_pan: number;
    notes?: string; category: "salary" | "interest" | "rent" | "professional" | "commission" | "property" | "crypto" | "other";
};

const TDS_SECTIONS: TdsSection[] = [
    { section: "192", nature: "Salary", threshold: 0, thresholdNote: "Basic exemption limit", rate_ind: -1, rate_other: -1, rate_no_pan: 20, notes: "Deducted by employer at average slab rate. Use our Income Tax Calculator for exact computation.", category: "salary" },
    { section: "194A", nature: "Interest (Banks / FD / RD)", threshold: 50000, thresholdNote: "₹50,000 (₹1,00,000 for Sr. Citizen)", rate_ind: 10, rate_other: 10, rate_no_pan: 20, notes: "Applicable on interest from banks, post office, cooperative societies. Senior citizens get higher threshold of ₹1,00,000.", category: "interest" },
    { section: "194B", nature: "Lottery / Crossword / Games", threshold: 10000, thresholdNote: "Per transaction", rate_ind: 30, rate_other: 30, rate_no_pan: 30, notes: "30% flat rate regardless of recipient type. No threshold aggregation.", category: "other" },
    { section: "194BB", nature: "Horse Race Winnings", threshold: 10000, rate_ind: 30, rate_other: 30, rate_no_pan: 30, category: "other" },
    { section: "194C", nature: "Contractor / Sub-contractor", threshold: 30000, thresholdNote: "₹30,000 single / ₹1,00,000 aggregate", rate_ind: 1, rate_other: 2, rate_no_pan: 20, notes: "Individual/HUF: 1%, Others: 2%. Aggregate limit ₹1,00,000 per FY.", category: "professional" },
    { section: "194D", nature: "Insurance Commission", threshold: 20000, rate_ind: 5, rate_other: 10, rate_no_pan: 20, category: "commission" },
    { section: "194DA", nature: "Life Insurance Payout", threshold: 100000, rate_ind: 5, rate_other: 5, rate_no_pan: 20, notes: "Only on taxable component. Maturity proceeds of policies with premium >10% of sum assured.", category: "other" },
    { section: "194E", nature: "Non-Resident Sportsperson", threshold: 0, rate_ind: 20, rate_other: 20, rate_no_pan: 20, category: "other" },
    { section: "194H", nature: "Commission / Brokerage", threshold: 20000, rate_ind: 2, rate_other: 2, rate_no_pan: 20, notes: "Applicable on commission paid to agents, brokers, etc. Excludes insurance commission (194D).", category: "commission" },
    { section: "194I(a)", nature: "Rent — Plant & Machinery", threshold: 50000, thresholdNote: "Aggregate per FY", rate_ind: 2, rate_other: 2, rate_no_pan: 20, category: "rent" },
    { section: "194I(b)", nature: "Rent — Land / Building / Furniture", threshold: 50000, thresholdNote: "Aggregate per FY", rate_ind: 10, rate_other: 10, rate_no_pan: 20, notes: "Applicable when payer is any person (other than Individual/HUF without tax audit). For Individual/HUF without audit, see 194IB.", category: "rent" },
    { section: "194IA", nature: "Property Purchase (>₹50L)", threshold: 5000000, rate_ind: 1, rate_other: 1, rate_no_pan: 20, notes: "Applicable on transfer of immovable property (except agricultural land) where consideration > ₹50 lakh.", category: "property" },
    { section: "194IB", nature: "Rent by Individual/HUF (no audit)", threshold: 50000, thresholdNote: "₹50,000 per month", rate_ind: 5, rate_other: 5, rate_no_pan: 20, notes: "Individual/HUF not liable for tax audit paying rent > ₹50K/month.", category: "rent" },
    { section: "194J", nature: "Professional / Technical Fees", threshold: 50000, rate_ind: 10, rate_other: 10, rate_no_pan: 20, notes: "Technical services: 2%. Professional fees (CA, lawyer, etc.): 10%. Royalty: 10%.", category: "professional" },
    { section: "194J(a)", nature: "Technical Services / Call Centre", threshold: 50000, rate_ind: 2, rate_other: 2, rate_no_pan: 20, category: "professional" },
    { section: "194K", nature: "MF Dividend", threshold: 10000, rate_ind: 10, rate_other: 10, rate_no_pan: 20, notes: "TDS on dividend income from mutual funds. ₹10,000 threshold per FY.", category: "interest" },
    { section: "194LA", nature: "Compensation — Land Acquisition", threshold: 250000, rate_ind: 10, rate_other: 10, rate_no_pan: 20, category: "property" },
    { section: "194N", nature: "Cash Withdrawal >₹1Cr", threshold: 10000000, rate_ind: 2, rate_other: 2, rate_no_pan: 20, notes: "Non-filers of ITR: 2% above ₹20L, 5% above ₹1Cr. ITR filers: 2% above ₹1Cr.", category: "other" },
    { section: "194O", nature: "E-Commerce Operator", threshold: 500000, rate_ind: 0.1, rate_other: 0.1, rate_no_pan: 5, notes: "TDS by e-commerce operator on seller's gross amount. Exemption for individuals/HUF with <₹5L turnover.", category: "commission" },
    { section: "194Q", nature: "Purchase of Goods", threshold: 5000000, rate_ind: 0.1, rate_other: 0.1, rate_no_pan: 5, notes: "Buyer deducts TDS on purchase of goods > ₹50 lakh from resident seller. Buyer's turnover must exceed ₹10 crore.", category: "other" },
    { section: "194R", nature: "Business Perquisite / Benefit", threshold: 20000, rate_ind: 10, rate_other: 10, rate_no_pan: 20, notes: "Applicable on any benefit or perquisite arising from business/profession.", category: "other" },
    { section: "194S", nature: "Crypto / VDA Transfer", threshold: 50000, thresholdNote: "₹50,000 (₹10,000 for specified persons)", rate_ind: 1, rate_other: 1, rate_no_pan: 20, notes: "1% TDS on transfer of Virtual Digital Assets. Specified persons (including exchanges) have ₹10,000 threshold.", category: "crypto" },
    { section: "194T", nature: "Payment to Partners (New FY25-26)", threshold: 20000, rate_ind: 10, rate_other: 10, rate_no_pan: 20, notes: "NEW: TDS on salary, remuneration, commission, bonus, and interest paid to partners of firm/LLP. Effective from FY 2025-26.", category: "professional" },
];

const CATEGORIES = [
    { key: "all", label: "All Sections" },
    { key: "interest", label: "Interest" },
    { key: "rent", label: "Rent" },
    { key: "professional", label: "Professional" },
    { key: "commission", label: "Commission" },
    { key: "property", label: "Property" },
    { key: "crypto", label: "Crypto/VDA" },
    { key: "salary", label: "Salary" },
    { key: "other", label: "Other" },
];

/* ─── Shared Input ─── */
function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : fmt(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min || 0} max={max || 1_00_00_000} step={step || 10000} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

type Mode = "calculator" | "rates" | "penalty" | "compliance";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "calculator", icon: "🧮", label: "TDS Calculator" },
    { key: "rates", icon: "📋", label: "TDS Rate Chart" },
    { key: "penalty", icon: "⚠️", label: "Penalty Calculator" },
    { key: "compliance", icon: "📅", label: "Filing Calendar" },
];

/* ═══════ MODE 1: TDS CALCULATOR ═══════ */
function CalculatorMode() {
    const [sectionIdx, setSectionIdx] = useState(1); // 194A default
    const [amount, setAmount] = useState(200000);
    const [hasPAN, setHasPAN] = useState(true);
    const [isIndividual, setIsIndividual] = useState(true);

    const sec = TDS_SECTIONS[sectionIdx];
    const result = useMemo(() => {
        const rate = !hasPAN ? sec.rate_no_pan : isIndividual ? sec.rate_ind : sec.rate_other;
        const isSalary = sec.section === "192";
        const isAboveThreshold = sec.threshold === 0 || amount > sec.threshold;
        const tdsAmount = isSalary ? 0 : isAboveThreshold ? amount * (rate / 100) : 0;
        const netAmount = amount - tdsAmount;
        return { rate, tdsAmount, netAmount, isAboveThreshold, isSalary };
    }, [sectionIdx, amount, hasPAN, isIndividual]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>TDS Section & Payment Type</label>
                <select value={sectionIdx} onChange={e => setSectionIdx(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.85rem", background: "var(--n-surface)", color: "var(--n-text)" }}>
                    {TDS_SECTIONS.map((s, i) => <option key={i} value={i}>Sec {s.section} — {s.nature}</option>)}
                </select>
            </div>
            <InputRow label="Payment Amount" value={amount} set={setAmount} max={1_00_00_000} step={5000} min={5000}
                hint={`Threshold for this section: ${sec.threshold > 0 ? fmt(sec.threshold) : 'N/A'}${sec.thresholdNote ? ` (${sec.thresholdNote})` : ''}`} />

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsIndividual(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: isIndividual ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: isIndividual ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: isIndividual ? 700 : 500, color: isIndividual ? "var(--n-primary)" : "var(--n-text)",
                }}>Individual / HUF</button>
                <button onClick={() => setIsIndividual(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !isIndividual ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: !isIndividual ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: !isIndividual ? 700 : 500, color: !isIndividual ? "var(--n-primary)" : "var(--n-text)",
                }}>Company / Firm / Others</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setHasPAN(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: hasPAN ? "2px solid #16a34a" : "1px solid var(--n-border)",
                    background: hasPAN ? "#f0fdf4" : "var(--n-surface)",
                    fontWeight: hasPAN ? 700 : 500, color: hasPAN ? "#16a34a" : "var(--n-text)",
                }}>✅ PAN Available</button>
                <button onClick={() => setHasPAN(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !hasPAN ? "2px solid #dc2626" : "1px solid var(--n-border)",
                    background: !hasPAN ? "#fef2f2" : "var(--n-surface)",
                    fontWeight: !hasPAN ? 700 : 500, color: !hasPAN ? "#dc2626" : "var(--n-text)",
                }}>❌ PAN Not Available</button>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                {result.isSalary ? (
                    <div style={{ textAlign: "center", padding: "var(--s-4)" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>Salary TDS (Section 192)</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>
                            TDS on salary is deducted at your average income tax slab rate by your employer. Use our <strong>Income Tax Calculator</strong> for exact computation.
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                                Section {sec.section} — {sec.nature}
                            </div>
                            <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#dc2626" }}>
                                {fmt(result.tdsAmount)}
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>TDS Deducted</div>
                        </div>
                        <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                            <tbody>
                                {[
                                    ["Payment Amount", fmt(amount)],
                                    ["TDS Rate", `${result.rate}%${!hasPAN ? " (Higher — no PAN)" : ""}`],
                                    ["Threshold", sec.threshold > 0 ? fmt(sec.threshold) : "N/A"],
                                    ["Above Threshold?", result.isAboveThreshold ? "Yes — TDS applicable" : "No — TDS NOT applicable"],
                                    ["TDS Amount", fmt(result.tdsAmount)],
                                    ["Net Amount Payable", fmt(result.netAmount)],
                                ].map(([l, v], i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                        <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                        <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i >= 4 ? 700 : 500, color: i === 4 ? "#dc2626" : i === 5 ? "#16a34a" : undefined }}>{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!hasPAN && (
                            <div style={{ background: "#fef2f2", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                                <strong style={{ color: "#dc2626" }}>⚠️ Higher Rate:</strong> TDS at {sec.rate_no_pan}% because PAN is not available. This can be up to {Math.round(sec.rate_no_pan / (sec.rate_ind > 0 ? sec.rate_ind : 10) * 100)}% higher than normal rate.
                            </div>
                        )}
                    </>
                )}
                {sec.notes && (
                    <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 8, padding: "6px 10px", background: "var(--n-surface)", borderRadius: 6 }}>
                        <strong>Note:</strong> {sec.notes}
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 2: TDS RATE CHART ═══════ */
function RatesMode() {
    const [catFilter, setCatFilter] = useState("all");

    const filtered = catFilter === "all" ? TDS_SECTIONS : TDS_SECTIONS.filter(s => s.category === catFilter);

    return (
        <>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--s-3)" }}>
                {CATEGORIES.map(c => (
                    <button key={c.key} onClick={() => setCatFilter(c.key)} style={{
                        padding: "6px 10px", borderRadius: 6, fontSize: "0.72rem", cursor: "pointer",
                        border: catFilter === c.key ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: catFilter === c.key ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: catFilter === c.key ? 700 : 500, color: catFilter === c.key ? "var(--n-primary)" : "var(--n-text)",
                    }}>{c.label}</button>
                ))}
            </div>
            <div style={{ overflowX: "auto", background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-3)" }}>
                <table style={{ width: "100%", fontSize: "0.72rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 3px" }}>Section</th>
                        <th style={{ textAlign: "left", padding: "6px 3px" }}>Nature</th>
                        <th style={{ textAlign: "right", padding: "6px 3px" }}>Threshold</th>
                        <th style={{ textAlign: "center", padding: "6px 3px" }}>Ind/HUF</th>
                        <th style={{ textAlign: "center", padding: "6px 3px" }}>Others</th>
                        <th style={{ textAlign: "center", padding: "6px 3px" }}>No PAN</th>
                    </tr></thead>
                    <tbody>
                        {filtered.map((s, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: s.section === "194T" ? "#fffbeb" : "" }}>
                                <td style={{ padding: "6px 3px", fontWeight: 700, whiteSpace: "nowrap" }}>{s.section}</td>
                                <td style={{ padding: "6px 3px" }}>{s.nature}</td>
                                <td style={{ textAlign: "right", padding: "6px 3px" }}>{s.threshold > 0 ? fmt(s.threshold) : "—"}</td>
                                <td style={{ textAlign: "center", padding: "6px 3px" }}>{s.rate_ind === -1 ? "Slab" : `${s.rate_ind}%`}</td>
                                <td style={{ textAlign: "center", padding: "6px 3px" }}>{s.rate_other === -1 ? "Slab" : `${s.rate_other}%`}</td>
                                <td style={{ textAlign: "center", padding: "6px 3px", color: "#dc2626", fontWeight: 700 }}>{s.rate_no_pan}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 8 }}>
                * Rates as per FY 2025–26 / AY 2026–27. Yellow row = new section introduced in FY 2025-26.
            </div>
        </>
    );
}

/* ═══════ MODE 3: PENALTY CALCULATOR ═══════ */
function PenaltyMode() {
    const [tdsAmount, setTdsAmount] = useState(50000);
    const [delayMonths, setDelayMonths] = useState(3);
    const [isNotDeducted, setIsNotDeducted] = useState(false);

    const result = useMemo(() => {
        const interestRate = isNotDeducted ? 1 : 1.5; // 1% for non-deduction, 1.5% for non-deposit
        const interest = tdsAmount * (interestRate / 100) * delayMonths;
        const lateFee = Math.min(200 * delayMonths * 30, tdsAmount); // ₹200/day capped at TDS amount
        const penaltyMin = 10000;
        const penaltyMax = 100000;
        const totalLiability = interest + lateFee;
        return { interestRate, interest, lateFee, penaltyMin, penaltyMax, totalLiability };
    }, [tdsAmount, delayMonths, isNotDeducted]);

    return (
        <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsNotDeducted(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !isNotDeducted ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: !isNotDeducted ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: !isNotDeducted ? 700 : 500, color: !isNotDeducted ? "var(--n-primary)" : "var(--n-text)",
                }}>Late Deposit (deducted but not paid)</button>
                <button onClick={() => setIsNotDeducted(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: isNotDeducted ? "2px solid #dc2626" : "1px solid var(--n-border)",
                    background: isNotDeducted ? "#fef2f2" : "var(--n-surface)",
                    fontWeight: isNotDeducted ? 700 : 500, color: isNotDeducted ? "#dc2626" : "var(--n-text)",
                }}>Non-Deduction (failed to deduct)</button>
            </div>
            <InputRow label="TDS Amount" value={tdsAmount} set={setTdsAmount} max={10_00_000} step={5000} min={5000} />
            <InputRow label="Delay Period (months)" value={delayMonths} set={setDelayMonths} max={24} step={1} min={1} suffix="%" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#dc2626", marginBottom: "var(--s-3)" }}>
                    ⚠️ Penalty & Interest — {isNotDeducted ? "Non-Deduction" : "Late Deposit"}
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["TDS Amount", fmt(tdsAmount)],
                            ["Delay Period", `${delayMonths} month(s)`],
                            ["Interest Rate", `${result.interestRate}% per month${isNotDeducted ? " (Sec 201(1A)(i))" : " (Sec 201(1A)(ii))"}`],
                            ["Interest Payable", fmt(result.interest)],
                            ["Late Filing Fee (₹200/day, Sec 234E)", fmt(result.lateFee)],
                            ["Total Financial Liability", fmt(result.totalLiability)],
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i >= 4 ? 700 : 500, color: i === 5 ? "#dc2626" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ background: "#fef2f2", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                    <strong style={{ color: "#dc2626" }}>Additional Penalty (Sec 271H):</strong> ₹10,000 to ₹1,00,000 may be imposed for late/incorrect TDS return filing.
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 4: FILING CALENDAR ═══════ */
function ComplianceMode() {
    const quarters = [
        { q: "Q1", period: "April – June", returns: "31 July", deposit: "7th of next month", cert16: "15 August", cert16A: "15 August" },
        { q: "Q2", period: "July – September", returns: "31 October", deposit: "7th of next month", cert16: "—", cert16A: "15 November" },
        { q: "Q3", period: "October – December", returns: "31 January", deposit: "7th of next month", cert16: "—", cert16A: "15 February" },
        { q: "Q4", period: "January – March", returns: "31 May", deposit: "30 April (March TDS)", cert16: "15 June", cert16A: "15 June" },
    ];

    const forms = [
        { form: "Form 24Q", purpose: "TDS on Salary", frequency: "Quarterly" },
        { form: "Form 26Q", purpose: "TDS on Non-Salary (Residents)", frequency: "Quarterly" },
        { form: "Form 27Q", purpose: "TDS on Non-Residents", frequency: "Quarterly" },
        { form: "Form 27EQ", purpose: "TCS (Tax Collected at Source)", frequency: "Quarterly" },
        { form: "Form 16", purpose: "Annual TDS Certificate — Salary", frequency: "Annual" },
        { form: "Form 16A", purpose: "Quarterly TDS Certificate — Non-Salary", frequency: "Quarterly" },
        { form: "Form 26AS", purpose: "Annual Tax Credit Statement", frequency: "Real-time" },
        { form: "Challan 281", purpose: "TDS/TCS Payment to Government", frequency: "Monthly" },
    ];

    return (
        <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                📅 TDS Filing Calendar — FY 2025–26
            </div>
            <div style={{ overflowX: "auto", marginBottom: "var(--s-4)" }}>
                <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 3px" }}>Quarter</th>
                        <th style={{ textAlign: "left", padding: "6px 3px" }}>Period</th>
                        <th style={{ textAlign: "center", padding: "6px 3px" }}>TDS Return Due</th>
                        <th style={{ textAlign: "center", padding: "6px 3px" }}>TDS Deposit</th>
                        <th style={{ textAlign: "center", padding: "6px 3px" }}>Form 16</th>
                        <th style={{ textAlign: "center", padding: "6px 3px" }}>Form 16A</th>
                    </tr></thead>
                    <tbody>
                        {quarters.map((q, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "6px 3px", fontWeight: 700 }}>{q.q}</td>
                                <td style={{ padding: "6px 3px" }}>{q.period}</td>
                                <td style={{ textAlign: "center", padding: "6px 3px", fontWeight: 600 }}>{q.returns}</td>
                                <td style={{ textAlign: "center", padding: "6px 3px" }}>{q.deposit}</td>
                                <td style={{ textAlign: "center", padding: "6px 3px" }}>{q.cert16}</td>
                                <td style={{ textAlign: "center", padding: "6px 3px" }}>{q.cert16A}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                📝 TDS Forms & Returns Guide
            </div>
            <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                    <th style={{ textAlign: "left", padding: "6px 3px" }}>Form</th>
                    <th style={{ textAlign: "left", padding: "6px 3px" }}>Purpose</th>
                    <th style={{ textAlign: "center", padding: "6px 3px" }}>Frequency</th>
                </tr></thead>
                <tbody>
                    {forms.map((f, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                            <td style={{ padding: "6px 3px", fontWeight: 700 }}>{f.form}</td>
                            <td style={{ padding: "6px 3px" }}>{f.purpose}</td>
                            <td style={{ textAlign: "center", padding: "6px 3px" }}>{f.frequency}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function TDSCalculatorCore() {
    const [mode, setMode] = useState<Mode>("calculator");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>📋 TDS Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>23+ sections • PAN impact • Penalty estimator • Filing calendar</div>
            </div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--n-border)", flexWrap: "wrap" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        flex: 1, minWidth: 120, padding: "12px 8px", border: "none", cursor: "pointer",
                        borderBottom: mode === m.key ? "3px solid var(--n-primary)" : "3px solid transparent",
                        background: mode === m.key ? "var(--n-primary-light)" : "transparent",
                        fontWeight: mode === m.key ? 700 : 500, fontSize: "0.82rem",
                        color: mode === m.key ? "var(--n-primary)" : "var(--n-text-muted)",
                    }}>{m.icon} {m.label}</button>
                ))}
            </div>
            <div style={{ padding: "var(--s-5)" }}>
                {mode === "calculator" && <CalculatorMode />}
                {mode === "rates" && <RatesMode />}
                {mode === "penalty" && <PenaltyMode />}
                {mode === "compliance" && <ComplianceMode />}
            </div>
        </div>
    );
}
