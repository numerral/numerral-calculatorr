"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 0) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const fmt = (n: number, d = 1) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

function ResultRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
    return (<div className="con-result-row" style={highlight ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : warn ? { background: "rgba(234,179,8,0.08)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined}>
        <span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value" style={highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : undefined}>{value}</span>
    </div>);
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder, id, type }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; placeholder?: string; id?: string; type?: string;
}) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
        <input id={id} type={type || "number"} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 1} placeholder={placeholder} /></div>);
}

function SelectField({ label, value, onChange, options, id }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; id?: string }) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}</label>
        <select id={id} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

/* ── Dubai Decree 43/2013 Tier Logic ── */
function getDubaiTier(percentBelow: number): { tier: string; maxIncrease: number; band: string } {
    if (percentBelow <= 10) return { tier: "No increase permitted", maxIncrease: 0, band: "0–10% below average" };
    if (percentBelow <= 20) return { tier: "Up to 5% increase", maxIncrease: 5, band: "11–20% below average" };
    if (percentBelow <= 30) return { tier: "Up to 10% increase", maxIncrease: 10, band: "21–30% below average" };
    if (percentBelow <= 40) return { tier: "Up to 15% increase", maxIncrease: 15, band: "31–40% below average" };
    return { tier: "Up to 20% increase", maxIncrease: 20, band: "More than 40% below average" };
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAERERARentalCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏠 RERA Rental Increase Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <CalculatorTab />}
        {tab === 1 && <ReferenceTab />}
    </div>);
}

/* ── Calculator Tab ── */
function CalculatorTab() {
    const [emirate, setEmirate] = useState("dubai");
    const [currentRent, setCurrentRent] = useState("60000");
    const [averageRent, setAverageRent] = useState("80000");
    const [leaseEndDate, setLeaseEndDate] = useState("");
    const [noticeDate, setNoticeDate] = useState("");

    const result = useMemo(() => {
        const current = parseFloat(currentRent) || 0;
        const average = parseFloat(averageRent) || 0;
        if (current <= 0) return null;

        const steps: { label: string; value: string; note?: string }[] = [];

        if (emirate === "dubai") {
            if (average <= 0) return null;
            const percentBelow = ((average - current) / average) * 100;
            const tier = getDubaiTier(Math.max(percentBelow, 0));
            const increaseAmount = current * (tier.maxIncrease / 100);
            const newRent = current + increaseAmount;

            steps.push({ label: "Current Annual Rent", value: fmtAED(current) });
            steps.push({ label: "Average Market Rent (RERA Index)", value: fmtAED(average) });
            steps.push({ label: "Difference", value: `${fmtAED(average - current)} (${fmt(Math.max(percentBelow, 0))}% below average)` });
            steps.push({ label: "Applicable Tier", value: tier.tier, note: `Band: ${tier.band} — Decree No. 43 of 2013` });

            if (tier.maxIncrease > 0) {
                steps.push({ label: `Max Increase (${tier.maxIncrease}%)`, value: fmtAED(increaseAmount) });
                steps.push({ label: "Monthly Increase", value: `${fmtAED(increaseAmount / 12, 2)}/month` });
            }

            return {
                newRent,
                increaseAmount,
                maxPercent: tier.maxIncrease,
                tier: tier.tier,
                percentBelow,
                steps,
                noticeDays: 90,
            };
        } else {
            // Abu Dhabi: flat 5% cap
            const maxIncrease = 5;
            const increaseAmount = current * (maxIncrease / 100);
            const newRent = current + increaseAmount;

            steps.push({ label: "Current Annual Rent", value: fmtAED(current) });
            steps.push({ label: "Abu Dhabi Cap", value: "5% maximum annual increase", note: "DMT regulation — Tawtheeq system" });
            steps.push({ label: `Max Increase (5%)`, value: fmtAED(increaseAmount) });
            steps.push({ label: "Monthly Increase", value: `${fmtAED(increaseAmount / 12, 2)}/month` });

            return {
                newRent,
                increaseAmount,
                maxPercent: maxIncrease,
                tier: "Up to 5% increase",
                percentBelow: 0,
                steps,
                noticeDays: 60,
            };
        }
    }, [emirate, currentRent, averageRent]);

    // Notice period validation
    const noticeResult = useMemo(() => {
        if (!leaseEndDate || !noticeDate) return null;
        const end = new Date(leaseEndDate);
        const notice = new Date(noticeDate);
        if (isNaN(end.getTime()) || isNaN(notice.getTime())) return null;
        const diffMs = end.getTime() - notice.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const required = emirate === "dubai" ? 90 : 60;
        const valid = diffDays >= required;
        return { diffDays, required, valid };
    }, [leaseEndDate, noticeDate, emirate]);

    return (<div>
        <div className="con-calc__inputs">
            {/* Emirate toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[
                    { v: "dubai", l: "🏙️ Dubai (RERA)" },
                    { v: "abudhabi", l: "🏛️ Abu Dhabi (Tawtheeq)" },
                ].map((e) => (
                    <button key={e.v} onClick={() => setEmirate(e.v)}
                        className={`calc-tab-btn${emirate === e.v ? " calc-tab-btn--active" : ""}`}
                        style={{ fontSize: "0.85rem", padding: "6px 14px" }}>{e.l}</button>
                ))}
            </div>

            {emirate === "dubai" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🏙️ Dubai uses the <strong>RERA Smart Rental Index</strong> (Decree No. 43/2013). The allowed increase depends on how far below the average market rent your current rent is. Check average rent at <strong>dubailand.gov.ae</strong> or the <strong>Dubai REST app</strong>.
            </div>}
            {emirate === "abudhabi" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🏛️ Abu Dhabi has a <strong>flat 5% annual cap</strong> on rent increases for renewals. Contracts must be registered via <strong>Tawtheeq</strong>. Landlords must give <strong>60 days&apos;</strong> notice.
            </div>}

            <InputField id="rera-current-rent" label="Current Annual Rent" value={currentRent} onChange={setCurrentRent} unit="AED/year" min={0} placeholder="e.g. 60000" />
            {emirate === "dubai" && <InputField id="rera-avg-rent" label="Average Market Rent (RERA Index)" value={averageRent} onChange={setAverageRent} unit="AED/year" min={0} placeholder="e.g. 80000" />}

            <div style={{ marginTop: "var(--s-3)", paddingTop: "var(--s-3)", borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 8 }}>📅 Notice Period Check (Optional)</p>
                <InputField id="rera-lease-end" label="Lease End Date" value={leaseEndDate} onChange={setLeaseEndDate} type="date" />
                <InputField id="rera-notice-date" label="Date Notice Was Given" value={noticeDate} onChange={setNoticeDate} type="date" />
            </div>
        </div>

        {/* Results */}
        {result && <div className="con-calc__results">
            <h4>Rental Increase Breakdown</h4>
            {result.steps.map((s: { label: string; value: string; note?: string }, i: number) => (
                <div key={i}>
                    <ResultRow label={s.label} value={s.value} />
                    {s.note && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", paddingLeft: 8, marginTop: -4, marginBottom: 6, fontStyle: "italic" }}>ℹ️ {s.note}</div>}
                </div>
            ))}

            <div style={{ borderTop: "2px solid var(--border)", marginTop: "var(--s-3)", paddingTop: "var(--s-3)" }}>
                <ResultRow label="Maximum New Annual Rent" value={fmtAED(result.newRent)} highlight />
                <ResultRow label="Maximum New Monthly Rent" value={fmtAED(result.newRent / 12, 2)} />
                {result.maxPercent === 0 && <ResultRow label="⚠️ No increase allowed" value="Current rent is within 10% of market average" warn />}
            </div>

            {/* Notice period result */}
            {noticeResult && <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: noticeResult.valid ? "rgba(0,150,57,0.06)" : "rgba(234,179,8,0.08)", borderRadius: 8 }}>
                <ResultRow label="Days Before Lease End" value={`${noticeResult.diffDays} days`} />
                <ResultRow label={`Required Notice (${emirate === "dubai" ? "Dubai" : "Abu Dhabi"})`} value={`${noticeResult.required} days`} />
                {noticeResult.valid
                    ? <ResultRow label="✅ Notice Valid" value="Landlord gave sufficient notice" highlight />
                    : <ResultRow label="❌ Notice Invalid" value={`Insufficient notice — need ${noticeResult.required} days, only ${noticeResult.diffDays} given. Increase cannot be enforced.`} warn />
                }
            </div>}

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ This calculator uses {emirate === "dubai" ? "Decree No. 43 of 2013 tiers" : "Abu Dhabi's 5% statutory cap"}. For the official average market rent, check {emirate === "dubai" ? "dubailand.gov.ae or the Dubai REST app" : "the ADREC website (adrec.gov.ae)"}. Disputes can be filed with the {emirate === "dubai" ? "Rental Disputes Centre (RDC)" : "Abu Dhabi Rental Disputes Settlement Centre"}.
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
        {/* Decree 43/2013 Tiers */}
        <h4>Dubai Rental Increase Tiers — Decree No. 43/2013</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Current Rent vs Average</th>
                    <th style={th}>Max Increase</th>
                    <th style={{ ...th, textAlign: "left" }}>Example (AED 60K rent)</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Up to 10% below average", "0% (No increase)", "Rent stays AED 60,000"],
                        ["11–20% below average", "Up to 5%", "Max AED 63,000 (+3,000)"],
                        ["21–30% below average", "Up to 10%", "Max AED 66,000 (+6,000)"],
                        ["31–40% below average", "Up to 15%", "Max AED 69,000 (+9,000)"],
                        ["More than 40% below", "Up to 20%", "Max AED 72,000 (+12,000)"],
                    ] as string[][]).map(([band, increase, example], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{band}</td>
                            <td style={{ ...td, fontWeight: 700, color: i === 0 ? "#009639" : "#b45309" }}>{increase}</td>
                            <td style={tl}>{example}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Dubai vs Abu Dhabi */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Dubai vs Abu Dhabi — Rental Rules Comparison</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Aspect</th>
                    <th style={th}>Dubai (RERA)</th>
                    <th style={th}>Abu Dhabi (Tawtheeq)</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Increase System", "Tiered (0–20%) based on RERA Index", "Flat 5% annual cap"],
                        ["Legal Basis", "Decree No. 43 of 2013", "DMT regulations (reinstated 2025)"],
                        ["Index/Calculator", "Smart Rental Index (dubailand.gov.ae)", "ADREC Rental Index (adrec.gov.ae)"],
                        ["Notice Period", "90 days before lease end", "60 days before lease end"],
                        ["Registration", "Ejari system", "Tawtheeq system"],
                        ["Dispute Resolution", "Rental Disputes Centre (RDC)", "Abu Dhabi Rental Disputes Centre"],
                        ["Governing Law", "Law No. 26 of 2007 (as amended)", "Law No. 20 of 2006 (as amended)"],
                    ] as string[][]).map(([aspect, dubai, ad], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{aspect}</td>
                            <td style={td}>{dubai}</td>
                            <td style={td}>{ad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Ejari Fees */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Ejari Registration Fees (Dubai)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Fee Component</th>
                    <th style={th}>Online (Dubai REST)</th>
                    <th style={th}>Trustee Centre</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Registration Fee", "AED 100", "AED 100"],
                        ["Knowledge Fee", "AED 10", "AED 10"],
                        ["Innovation Fee", "AED 10", "AED 10"],
                        ["Service Partner Fee", "AED 55", "AED 130 + VAT"],
                        ["Total (approx.)", "AED 175–220", "AED 270–320"],
                    ] as string[][]).map(([fee, online, trustee], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: i === 4 ? 700 : 600 }}>{fee}</td>
                            <td style={{ ...td, fontWeight: i === 4 ? 700 : 400 }}>{online}</td>
                            <td style={{ ...td, fontWeight: i === 4 ? 700 : 400 }}>{trustee}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Eviction Grounds */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Eviction Grounds — Dubai (Law No. 26/2007)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Ground</th>
                    <th style={th}>Notice</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Non-payment of rent", "30 days", "After written notification to pay"],
                        ["Illegal use of property", "Immediate", "Court order required"],
                        ["Unauthorized subletting", "30 days", "Without landlord's written consent"],
                        ["Property damage", "30 days", "Endangering safety or unauthorized modifications"],
                        ["Landlord personal use", "12 months", "For self or first-degree relative — no alternative property"],
                        ["Sale of property", "12 months", "Owner wishes to sell the leased property"],
                        ["Demolition/reconstruction", "12 months", "With municipality approval and permits"],
                        ["Major renovation", "12 months", "Cannot be done while occupied — technical report required"],
                    ] as string[][]).map(([ground, notice, details], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{ground}</td>
                            <td style={{ ...td, fontWeight: 700, color: notice === "12 months" ? "#dc2626" : "#b45309" }}>{notice}</td>
                            <td style={tl}>{details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* RDC Fees */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Rental Disputes Centre (RDC) Fees</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Fee</th>
                    <th style={th}>Amount</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Filing fee", "3.5% of annual rent (min AED 500, max AED 20,000)"],
                        ["Process service fee", "AED 100"],
                        ["Knowledge fee", "AED 10"],
                        ["Innovation fee", "AED 10"],
                        ["POA registration", "AED 25 (if representative)"],
                        ["Trustee centre surcharge", "AED 130 + VAT"],
                        ["Appeal deposit", "50% of awarded amount"],
                    ] as string[][]).map(([fee, amount], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{fee}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* DEWA Connection Costs */}
        <h4 style={{ marginTop: "var(--s-4)" }}>DEWA Connection Costs (After Ejari)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Fee</th>
                    <th style={th}>Apartment</th>
                    <th style={th}>Villa</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Security Deposit (refundable)", "AED 2,000", "AED 4,000"],
                        ["Connection Fee", "AED 130", "AED 130"],
                        ["Knowledge & Innovation Fee", "AED 20", "AED 20"],
                        ["VAT (5%)", "~AED 108", "~AED 208"],
                        ["Total (approx.)", "AED 2,258", "AED 4,358"],
                    ] as string[][]).map(([fee, apt, villa], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: i === 4 ? 700 : 600 }}>{fee}</td>
                            <td style={{ ...td, fontWeight: i === 4 ? 700 : 400 }}>{apt}</td>
                            <td style={{ ...td, fontWeight: i === 4 ? 700 : 400 }}>{villa}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}
