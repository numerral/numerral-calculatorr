"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 2) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;

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
        <input id={id} type={type || "number"} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 0.01} placeholder={placeholder} /></div>);
}

function SelectField({ label, value, onChange, options, id }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; id?: string }) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}</label>
        <select id={id} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAEVATCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🧾 UAE VAT Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <CalculatorTab />}
        {tab === 1 && <ReferenceTab />}
    </div>);
}

/* ── Calculator Tab ── */
type LineItem = { description: string; amount: string; rate: string };

function CalculatorTab() {
    const [mode, setMode] = useState("add");
    const [amount, setAmount] = useState("1000");
    const [numTags, setNumTags] = useState("1");
    // Bulk mode
    const [bulkMode, setBulkMode] = useState(false);
    const [items, setItems] = useState<LineItem[]>([
        { description: "Item 1", amount: "500", rate: "5" },
        { description: "Item 2", amount: "300", rate: "5" },
    ]);

    const VAT_RATE = 5;

    const singleResult = useMemo(() => {
        const amt = parseFloat(amount) || 0;
        if (amt <= 0) return null;

        if (mode === "add") {
            const vat = amt * (VAT_RATE / 100);
            const gross = amt + vat;
            return {
                steps: [
                    { label: "Net Amount (excl. VAT)", value: fmtAED(amt) },
                    { label: `VAT (${VAT_RATE}%)`, value: fmtAED(vat) },
                    { label: "Formula", value: `${fmtAED(amt)} × ${VAT_RATE}% = ${fmtAED(vat)}` },
                ],
                finalLabel: "Total Amount (incl. VAT)",
                finalValue: fmtAED(gross),
                vat,
                net: amt,
                gross,
            };
        } else if (mode === "remove") {
            const net = amt / (1 + VAT_RATE / 100);
            const vat = amt - net;
            return {
                steps: [
                    { label: "Gross Amount (incl. VAT)", value: fmtAED(amt) },
                    { label: "Formula", value: `${fmtAED(amt)} ÷ ${1 + VAT_RATE / 100} = ${fmtAED(net)}` },
                    { label: `VAT Component (${VAT_RATE}%)`, value: fmtAED(vat) },
                ],
                finalLabel: "Net Amount (excl. VAT)",
                finalValue: fmtAED(net),
                vat,
                net,
                gross: amt,
            };
        } else {
            // Tourist refund
            const vat = amt * (VAT_RATE / 100);
            const tags = parseInt(numTags) || 1;
            const tagFee = 4.80 * tags;
            const adminFee = vat * 0.15;
            const refund = Math.max(vat - adminFee - tagFee, 0);
            return {
                steps: [
                    { label: "Purchase Amount (incl. VAT)", value: fmtAED(amt) },
                    { label: `VAT Paid (${VAT_RATE}%)`, value: fmtAED(vat) },
                    { label: "Admin Fee (15% of VAT)", value: `− ${fmtAED(adminFee)}` },
                    { label: `Tag Fee (AED 4.80 × ${tags})`, value: `− ${fmtAED(tagFee)}` },
                    { label: "Minimum purchase per invoice", value: "AED 250.00" },
                ],
                finalLabel: "Estimated Tourist Refund",
                finalValue: fmtAED(refund),
                vat,
                net: amt / 1.05,
                gross: amt,
            };
        }
    }, [amount, mode, numTags, VAT_RATE]);

    const bulkResult = useMemo(() => {
        if (!bulkMode) return null;
        let totalNet = 0;
        let totalVat = 0;
        const rows = items.map((item) => {
            const a = parseFloat(item.amount) || 0;
            const r = parseFloat(item.rate) || 0;
            const vat = a * (r / 100);
            totalNet += a;
            totalVat += vat;
            return { ...item, amountNum: a, rate: item.rate, vat, total: a + vat };
        });
        return { rows, totalNet, totalVat, totalGross: totalNet + totalVat };
    }, [bulkMode, items]);

    const addItem = () => setItems([...items, { description: `Item ${items.length + 1}`, amount: "0", rate: "5" }]);
    const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof LineItem, val: string) => {
        const newItems = [...items];
        newItems[i] = { ...newItems[i], [field]: val };
        setItems(newItems);
    };

    return (<div>
        <div className="con-calc__inputs">
            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {[
                    { v: "add", l: "➕ Add VAT" },
                    { v: "remove", l: "➖ Remove VAT" },
                    { v: "tourist", l: "✈️ Tourist Refund" },
                ].map((m) => (
                    <button key={m.v} onClick={() => { setMode(m.v); setBulkMode(false); }}
                        className={`calc-tab-btn${mode === m.v ? " calc-tab-btn--active" : ""}`}
                        style={{ fontSize: "0.85rem", padding: "6px 14px" }}>{m.l}</button>
                ))}
            </div>

            {mode === "add" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ➕ Enter the amount <strong>before VAT</strong>. The calculator will add 5% VAT and show the total payable.
            </div>}
            {mode === "remove" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ➖ Enter the <strong>total amount including VAT</strong>. The calculator will extract the VAT and show the net price.
            </div>}
            {mode === "tourist" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ✈️ Enter your <strong>purchase amount</strong> to estimate your tourist VAT refund. Minimum AED 250 per invoice. Refund = 85% of VAT minus AED 4.80 per tag.
            </div>}

            {!bulkMode && <>
                <InputField id="uae-vat-amount" label={mode === "add" ? "Net Amount (excl. VAT)" : mode === "remove" ? "Gross Amount (incl. VAT)" : "Purchase Amount"} value={amount} onChange={setAmount} unit="AED" min={0} placeholder="e.g. 1000" />
                {mode === "tourist" && <InputField id="uae-vat-tags" label="Number of Tax-Free Tags" value={numTags} onChange={setNumTags} min={1} max={100} placeholder="1" />}
            </>}

            {mode === "add" && <div style={{ marginTop: 8 }}>
                <button onClick={() => setBulkMode(!bulkMode)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {bulkMode ? "← Single Item Mode" : "📋 Bulk Mode (Multiple Items)"}
                </button>
            </div>}
        </div>

        {/* Bulk mode UI */}
        {bulkMode && <div className="con-calc__results" style={{ marginTop: "var(--s-3)" }}>
            <h4>Bulk VAT Calculation</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                        <th style={{ padding: "6px 8px", textAlign: "left" }}>Description</th>
                        <th style={{ padding: "6px 8px", textAlign: "right" }}>Amount (AED)</th>
                        <th style={{ padding: "6px 8px", textAlign: "center" }}>Rate</th>
                        <th style={{ padding: "6px 8px", textAlign: "right" }}>VAT</th>
                        <th style={{ padding: "6px 8px", textAlign: "right" }}>Total</th>
                        <th style={{ padding: "6px 8px", width: 40 }}></th>
                    </tr></thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "4px 8px" }}><input type="text" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} style={{ width: "100%", padding: "4px 6px", border: "1px solid var(--border)", borderRadius: 4, background: "var(--bg)", color: "var(--text)" }} /></td>
                                <td style={{ padding: "4px 8px" }}><input type="number" value={item.amount} onChange={(e) => updateItem(i, "amount", e.target.value)} style={{ width: 100, padding: "4px 6px", border: "1px solid var(--border)", borderRadius: 4, textAlign: "right", background: "var(--bg)", color: "var(--text)" }} /></td>
                                <td style={{ padding: "4px 8px", textAlign: "center" }}>
                                    <select value={item.rate} onChange={(e) => updateItem(i, "rate", e.target.value)} style={{ padding: "4px 6px", border: "1px solid var(--border)", borderRadius: 4, background: "var(--bg)", color: "var(--text)" }}>
                                        <option value="5">5% Standard</option>
                                        <option value="0">0% Zero-rated</option>
                                    </select>
                                </td>
                                <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 600 }}>{fmtAED((parseFloat(item.amount) || 0) * (parseFloat(item.rate) || 0) / 100)}</td>
                                <td style={{ padding: "4px 8px", textAlign: "right", fontWeight: 700 }}>{fmtAED((parseFloat(item.amount) || 0) * (1 + (parseFloat(item.rate) || 0) / 100))}</td>
                                <td style={{ padding: "4px 8px", textAlign: "center" }}>
                                    {items.length > 1 && <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1rem" }}>×</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addItem} style={{ marginTop: 8, background: "none", border: "1px dashed var(--border)", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: "0.82rem", color: "var(--text-muted)", width: "100%" }}>
                + Add Line Item
            </button>

            {bulkResult && <div style={{ marginTop: "var(--s-3)" }}>
                <ResultRow label="Total Net Amount" value={fmtAED(bulkResult.totalNet)} />
                <ResultRow label="Total VAT" value={fmtAED(bulkResult.totalVat)} />
                <ResultRow label="Grand Total (incl. VAT)" value={fmtAED(bulkResult.totalGross)} highlight />
            </div>}
        </div>}

        {/* Single mode results */}
        {!bulkMode && singleResult && <div className="con-calc__results">
            <h4>Step-by-Step Breakdown</h4>
            {singleResult.steps.map((s, i) => <ResultRow key={i} label={s.label} value={s.value} />)}
            <div style={{ borderTop: "2px solid var(--border)", marginTop: "var(--s-3)", paddingTop: "var(--s-3)" }}>
                <ResultRow label={singleResult.finalLabel} value={singleResult.finalValue} highlight />
            </div>

            {mode === "tourist" && parseFloat(amount) < 250 && <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.82rem" }}>
                ⚠️ Minimum purchase of <strong>AED 250 per invoice</strong> is required for the tourist refund scheme.
            </div>}

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ UAE VAT is 5% as per Federal Decree-Law No. 8 of 2017. Some goods/services are zero-rated (0%) or exempt. Check the Reference Tables tab for the full list.
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
        {/* VAT Supply Categories */}
        <h4>VAT Supply Categories</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Category</th>
                    <th style={th}>Rate</th>
                    <th style={{ ...th, textAlign: "left" }}>Input VAT Recovery</th>
                    <th style={{ ...th, textAlign: "left" }}>Examples</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 700 }}>🟢 Standard-Rated</td><td style={{ ...td, fontWeight: 700, color: "#009639" }}>5%</td><td style={tl}>✅ Yes</td><td style={tl}>Most goods & services, commercial rent, electronics, dining</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 700 }}>🔵 Zero-Rated</td><td style={{ ...td, fontWeight: 700, color: "#2563eb" }}>0%</td><td style={tl}>✅ Yes</td><td style={tl}>Exports, healthcare, education, first residential, precious metals (99%+)</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 700 }}>⚪ Exempt</td><td style={{ ...td, fontWeight: 700 }}>N/A</td><td style={tl}>❌ No</td><td style={tl}>Financial services, bare land, subsequent residential, local transport</td></tr>
                </tbody>
            </table>
        </div>

        {/* Zero-Rated Supplies */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Zero-Rated Supplies (0% VAT)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Supply</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Exports", "Goods/services exported outside UAE or GCC implementing states"],
                        ["International Transport", "Passenger & goods transport across borders"],
                        ["Healthcare", "Preventive & curative care, prescribed medicines, medical equipment"],
                        ["Education", "Tuition at government-recognized institutions, curriculum materials"],
                        ["First Residential Supply", "First sale/lease of new residential property within 3 years of completion"],
                        ["Precious Metals", "Gold, silver, platinum at 99%+ purity (investment grade)"],
                        ["Certain Transport", "Aircraft, ships, and related spare parts & equipment"],
                        ["Crude Oil & Gas", "For specific domestic supply scenarios"],
                    ] as string[][]).map(([item, detail], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{item}</td><td style={tl}>{detail}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Exempt Supplies */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Exempt Supplies (No VAT)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Supply</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Financial Services", "Without explicit fee — currency exchange, loans, securities, life insurance"],
                        ["Subsequent Residential", "Sale/lease of residential property after first supply"],
                        ["Bare Land", "Undeveloped land not covered by buildings"],
                        ["Local Passenger Transport", "Metro, bus, taxi within the UAE"],
                        ["Student Transport", "Home-to-school transport services"],
                    ] as string[][]).map(([item, detail], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{item}</td><td style={tl}>{detail}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Registration Thresholds */}
        <h4 style={{ marginTop: "var(--s-4)" }}>VAT Registration Thresholds</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Type</th>
                    <th style={th}>Threshold</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 700 }}>Mandatory</td><td style={{ ...td, fontWeight: 700, color: "#dc2626" }}>AED 375,000</td><td style={tl}>Must register within 30 days if taxable supplies exceed this in 12 months</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 700 }}>Voluntary</td><td style={{ ...td, fontWeight: 700, color: "#2563eb" }}>AED 187,500</td><td style={tl}>May register to recover input VAT if turnover exceeds this amount</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 700 }}>Non-Resident</td><td style={{ ...td, fontWeight: 700 }}>AED 0</td><td style={tl}>Must register from first taxable supply in UAE (no threshold)</td></tr>
                </tbody>
            </table>
        </div>

        {/* Penalty Schedule */}
        <h4 style={{ marginTop: "var(--s-4)" }}>FTA Penalty Schedule</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Violation</th>
                    <th style={th}>1st Offence</th>
                    <th style={th}>Repeat</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Late VAT registration", "AED 10,000", "AED 10,000"],
                        ["Late deregistration", "AED 1,000", "AED 1,000/month (max AED 10,000)"],
                        ["Late filing of VAT return", "AED 1,000", "AED 2,000 (within 24 months)"],
                        ["Late VAT payment", "2% immediately + 4% on day 7", "1%/day after 1 month (max 300%)"],
                        ["Error in return/records", "AED 500–3,000", "Up to AED 20,000"],
                        ["Not issuing tax invoices", "AED 2,500", "AED 5,000–10,000"],
                        ["Failure to notify FTA of changes", "AED 5,000", "AED 15,000"],
                    ] as string[][]).map(([violation, first, repeat], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{violation}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{first}</td>
                            <td style={td}>{repeat}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Designated Zones */}
        <h4 style={{ marginTop: "var(--s-4)" }}>VAT Designated Zones</h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>Treated as outside UAE for goods (not services). Must have customs controls.</p>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Emirate</th>
                    <th style={{ ...th, textAlign: "left" }}>Designated Zones</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Dubai", "Jebel Ali Free Zone (North & South), Dubai Airport Free Zone, DUCAMZ, International Humanitarian City"],
                        ["Abu Dhabi", "Khalifa Port Free Trade Zone, Abu Dhabi Airport Free Zone, Khalifa Industrial Zone"],
                        ["Sharjah", "Hamriyah Free Zone, Sharjah Airport Int'l Free Zone"],
                        ["Ras Al Khaimah", "RAK Free Trade Zone, RAK Maritime City, Al Hamra Industrial Zone"],
                        ["Ajman", "Ajman Free Zone"],
                        ["Umm Al Quwain", "UAQ Free Trade Zone"],
                        ["Fujairah", "Fujairah Free Zone, Fujairah Oil Industry Zone"],
                    ] as string[][]).map(([emirate, zones], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 700 }}>{emirate}</td>
                            <td style={tl}>{zones}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Tourist Refund Quick Reference */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Tourist VAT Refund — Quick Reference</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Requirement</th>
                    <th style={{ ...th, textAlign: "left" }}>Detail</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Eligibility", "Non-resident tourist, 18+ years old"],
                        ["Minimum purchase", "AED 250 per invoice"],
                        ["Refund amount", "85% of VAT paid (15% admin fee)"],
                        ["Tag fee", "AED 4.80 deducted per tax-free tag"],
                        ["Export requirement", "Goods must leave UAE within 90 days"],
                        ["Excluded items", "Services, food consumed locally, cars, items installed/used in UAE"],
                        ["Refund method", "Cash (max AED 10,000), credit card, or digital wallet"],
                        ["Validation", "Self-service kiosks at airports, sea ports, land borders"],
                        ["Operator", "Planet Tax Free (authorized by FTA)"],
                    ] as string[][]).map(([req, detail], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{req}</td>
                            <td style={tl}>{detail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}
