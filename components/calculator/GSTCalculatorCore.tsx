"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/* ─── GST slab data ─── */
const GST_RATES = [0, 0.25, 3, 5, 12, 18, 28, 40];
const RATE_OPTIONS = GST_RATES.map(r => ({ label: `${r}%`, value: r }));

type Mode = "calculator" | "rate_chart" | "itc" | "returns";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "calculator", icon: "🧮", label: "GST Calculator" },
    { key: "rate_chart", icon: "📋", label: "GST Rate Chart" },
    { key: "itc", icon: "💰", label: "ITC Calculator" },
    { key: "returns", icon: "📅", label: "Return Calendar" },
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
            <input type="range" min={min || 0} max={max || 10_00_000} step={step || 1000} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

/* ═══════ MODE 1: GST CALCULATOR ═══════ */
function CalculatorMode() {
    const [amount, setAmount] = useState(10000);
    const [rate, setRate] = useState(18);
    const [isInclusive, setIsInclusive] = useState(false);
    const [isInterState, setIsInterState] = useState(false);

    const gstAmount = isInclusive
        ? amount - (amount * 100) / (100 + rate)
        : (amount * rate) / 100;
    const basePrice = isInclusive ? amount - gstAmount : amount;
    const totalPrice = isInclusive ? amount : amount + gstAmount;
    const cgst = isInterState ? 0 : gstAmount / 2;
    const sgst = isInterState ? 0 : gstAmount / 2;
    const igst = isInterState ? gstAmount : 0;

    return (
        <>
            <InputRow label="Amount" value={amount} set={setAmount} max={50_00_000} step={500} min={100}
                hint={isInclusive ? "This amount INCLUDES GST" : "This amount is BEFORE GST"} />

            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>GST Rate</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {RATE_OPTIONS.map(r => (
                        <button key={r.value} onClick={() => setRate(r.value)} style={{
                            padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: rate === r.value ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: rate === r.value ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: rate === r.value ? 700 : 500,
                            color: rate === r.value ? "var(--n-primary)" : "var(--n-text)",
                        }}>{r.label}</button>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsInclusive(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !isInclusive ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: !isInclusive ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: !isInclusive ? 700 : 500, color: !isInclusive ? "var(--n-primary)" : "var(--n-text)",
                }}>➕ Add GST (Exclusive)</button>
                <button onClick={() => setIsInclusive(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: isInclusive ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: isInclusive ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: isInclusive ? 700 : 500, color: isInclusive ? "var(--n-primary)" : "var(--n-text)",
                }}>➖ Remove GST (Inclusive)</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsInterState(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !isInterState ? "2px solid #16a34a" : "1px solid var(--n-border)",
                    background: !isInterState ? "#f0fdf4" : "var(--n-surface)",
                    fontWeight: !isInterState ? 700 : 500, color: !isInterState ? "#16a34a" : "var(--n-text)",
                }}>🏠 Intra-State (CGST + SGST)</button>
                <button onClick={() => setIsInterState(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: isInterState ? "2px solid #2563eb" : "1px solid var(--n-border)",
                    background: isInterState ? "#eff6ff" : "var(--n-surface)",
                    fontWeight: isInterState ? 700 : 500, color: isInterState ? "#2563eb" : "var(--n-text)",
                }}>🚛 Inter-State (IGST)</button>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        {isInclusive ? "GST Amount (included in price)" : "Total Amount (with GST)"}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#16a34a" }}>
                        {isInclusive ? fmt(gstAmount) : fmt(totalPrice)}
                    </div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Base Price (excl. GST)", fmt(basePrice)],
                            [`GST Amount @ ${rate}%`, fmt(gstAmount)],
                            ...(isInterState
                                ? [[`IGST @ ${rate}%`, fmt(igst)]]
                                : [[`CGST @ ${rate / 2}%`, fmt(cgst)], [`SGST/UTGST @ ${rate / 2}%`, fmt(sgst)]]
                            ),
                            ["Total Price (incl. GST)", fmt(totalPrice)],
                        ].map(([l, v], i, arr) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i === arr.length - 1 ? 700 : 500, color: i === arr.length - 1 ? "#16a34a" : i === 1 ? "#dc2626" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════ MODE 2: GST RATE CHART ═══════ */
const RATE_DATA = [
    { category: "Essential", items: [
        { name: "Fresh fruits, vegetables, milk, curd, eggs", rate: "0%", hsn: "0802–0910" },
        { name: "Unprocessed food grains (rice, wheat, pulses)", rate: "0%", hsn: "1001–1008" },
        { name: "Salt, jaggery, fresh meat, fish", rate: "0%", hsn: "0301–0511" },
        { name: "Books, newspapers, maps", rate: "0%", hsn: "4901–4905" },
        { name: "Healthcare services (hospitals, clinics)", rate: "0%", hsn: "SAC 9993" },
        { name: "Educational services (schools, colleges)", rate: "0%", hsn: "SAC 9992" },
    ]},
    { category: "Low (5%)", items: [
        { name: "Packaged food items, sugar, tea, spices", rate: "5%", hsn: "0901–2106" },
        { name: "Coal, lignite, coke", rate: "5%", hsn: "2701–2704" },
        { name: "Medicines (non-Ayurvedic), fertilizers", rate: "5%", hsn: "3003–3105" },
        { name: "Restaurant food (non-AC, non-hotel)", rate: "5%", hsn: "SAC 9963" },
        { name: "Cab aggregator services (Ola, Uber AC)", rate: "5%", hsn: "SAC 9964" },
        { name: "Hotel rooms (tariff ≤ ₹7,500/day)", rate: "5%", hsn: "SAC 9963" },
        { name: "Footwear up to ₹1,000", rate: "5%", hsn: "6401–6405" },
    ]},
    { category: "Standard (18%)", items: [
        { name: "Most consumer goods, electronics", rate: "18%", hsn: "8414–8528" },
        { name: "Banking, financial services, insurance (general)", rate: "18%", hsn: "SAC 9971" },
        { name: "Telecom services", rate: "18%", hsn: "SAC 9984" },
        { name: "IT services, software", rate: "18%", hsn: "SAC 9983" },
        { name: "Cement, iron & steel", rate: "18%", hsn: "2523, 7206" },
        { name: "Restaurant in hotel (room tariff > ₹7,500)", rate: "18%", hsn: "SAC 9963" },
        { name: "Real estate (non-affordable, under construction)", rate: "5%*", hsn: "SAC 9972" },
    ]},
    { category: "Luxury (28%)", items: [
        { name: "Automobiles (luxury, SUVs, large cars)", rate: "28%", hsn: "8703" },
        { name: "Air conditioners, dishwashers", rate: "28%", hsn: "8415–8422" },
        { name: "5-star hotel rooms (tariff > ₹7,500)", rate: "28%", hsn: "SAC 9963" },
        { name: "Aerated drinks, energy drinks", rate: "28%", hsn: "2202" },
        { name: "Tobacco, cigarettes, pan masala", rate: "40%", hsn: "2401–2404" },
    ]},
    { category: "Special", items: [
        { name: "Gold, silver, platinum jewellery", rate: "3%", hsn: "7108–7118" },
        { name: "Making charges on jewellery", rate: "5%", hsn: "SAC 9988" },
        { name: "Rough precious stones", rate: "0.25%", hsn: "7102–7104" },
        { name: "Real estate (affordable housing)", rate: "1%", hsn: "SAC 9972" },
        { name: "Life & health insurance (individual)", rate: "0%", hsn: "SAC 9971" },
    ]},
];

type RateFilter = "all" | "Essential" | "Low (5%)" | "Standard (18%)" | "Luxury (28%)" | "Special";

function RateChartMode() {
    const [filter, setFilter] = useState<RateFilter>("all");
    const filters: RateFilter[] = ["all", "Essential", "Low (5%)", "Standard (18%)", "Luxury (28%)", "Special"];
    const data = filter === "all" ? RATE_DATA : RATE_DATA.filter(d => d.category === filter);

    return (
        <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {filters.map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: "7px 14px", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer",
                        border: filter === f ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: filter === f ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: filter === f ? 700 : 500,
                        color: filter === f ? "var(--n-primary)" : "var(--n-text)",
                    }}>{f === "all" ? "All Categories" : f}</button>
                ))}
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)", background: "var(--n-surface-alt)" }}>
                        <th style={{ textAlign: "left", padding: "8px 6px" }}>Category</th>
                        <th style={{ textAlign: "left", padding: "8px 6px" }}>Goods / Service</th>
                        <th style={{ textAlign: "right", padding: "8px 6px" }}>GST Rate</th>
                        <th style={{ textAlign: "right", padding: "8px 6px" }}>HSN/SAC</th>
                    </tr></thead>
                    <tbody>
                        {data.map((cat) => cat.items.map((item, j) => (
                            <tr key={`${cat.category}-${j}`} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                {j === 0 && <td rowSpan={cat.items.length} style={{ padding: "6px", fontWeight: 700, verticalAlign: "top", color: "var(--n-primary)", fontSize: "0.75rem" }}>{cat.category}</td>}
                                <td style={{ padding: "6px" }}>{item.name}</td>
                                <td style={{ textAlign: "right", padding: "6px", fontWeight: 700, color: item.rate === "0%" ? "#16a34a" : item.rate === "28%" || item.rate === "40%" ? "#dc2626" : "var(--n-text)" }}>{item.rate}</td>
                                <td style={{ textAlign: "right", padding: "6px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{item.hsn}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 8 }}>
                * Real estate under construction: 5% without ITC (non-affordable) or 1% without ITC (affordable housing). HSN/SAC codes are indicative.
            </div>
        </>
    );
}

/* ═══════ MODE 3: ITC CALCULATOR ═══════ */
function ITCMode() {
    const [salesAmount, setSalesAmount] = useState(500000);
    const [salesRate, setSalesRate] = useState(18);
    const [purchaseAmount, setPurchaseAmount] = useState(300000);
    const [purchaseRate, setPurchaseRate] = useState(18);
    const [blockedITC, setBlockedITC] = useState(0);

    const outputTax = (salesAmount * salesRate) / 100;
    const inputTax = (purchaseAmount * purchaseRate) / 100;
    const eligibleITC = Math.max(0, inputTax - blockedITC);
    const netLiability = Math.max(0, outputTax - eligibleITC);
    const itcUtilised = Math.min(eligibleITC, outputTax);
    const cashPayment = netLiability;
    const excessITC = eligibleITC > outputTax ? eligibleITC - outputTax : 0;

    return (
        <>
            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--n-primary)", marginBottom: 8 }}>📤 Output (Sales)</div>
            <InputRow label="Sales Amount (excl. GST)" value={salesAmount} set={setSalesAmount} max={50_00_000} step={5000} min={0} />
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 4 }}>Output GST Rate</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {[5, 12, 18, 28].map(r => (
                        <button key={r} onClick={() => setSalesRate(r)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer",
                            border: salesRate === r ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: salesRate === r ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: salesRate === r ? 700 : 500, color: salesRate === r ? "var(--n-primary)" : "var(--n-text)",
                        }}>{r}%</button>
                    ))}
                </div>
            </div>

            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#16a34a", marginBottom: 8 }}>📥 Input (Purchases)</div>
            <InputRow label="Purchase Amount (excl. GST)" value={purchaseAmount} set={setPurchaseAmount} max={50_00_000} step={5000} min={0} />
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 4 }}>Input GST Rate</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {[5, 12, 18, 28].map(r => (
                        <button key={r} onClick={() => setPurchaseRate(r)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer",
                            border: purchaseRate === r ? "2px solid #16a34a" : "1px solid var(--n-border)",
                            background: purchaseRate === r ? "#f0fdf4" : "var(--n-surface)",
                            fontWeight: purchaseRate === r ? 700 : 500, color: purchaseRate === r ? "#16a34a" : "var(--n-text)",
                        }}>{r}%</button>
                    ))}
                </div>
            </div>
            <InputRow label="Blocked ITC (Sec 17(5))" value={blockedITC} set={setBlockedITC} max={inputTax} step={500} min={0}
                hint="Personal use, food, motor vehicles, etc." />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: cashPayment > 0 ? "#dc2626" : "#16a34a", textTransform: "uppercase", letterSpacing: 1 }}>
                        Net GST Payable (Cash)
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: cashPayment > 0 ? "#dc2626" : "#16a34a" }}>
                        {fmt(cashPayment)}
                    </div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            [`Output Tax (on Sales @ ${salesRate}%)`, fmt(outputTax)],
                            [`Input Tax (on Purchases @ ${purchaseRate}%)`, fmt(inputTax)],
                            ["Blocked ITC (Sec 17(5))", `-${fmt(blockedITC)}`],
                            ["Eligible ITC", fmt(eligibleITC)],
                            ["ITC Utilised", fmt(itcUtilised)],
                            ["Cash Payment Required", fmt(cashPayment)],
                            ...(excessITC > 0 ? [["Excess ITC (carry forward)", fmt(excessITC)]] : []),
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i >= 4 ? 700 : 500, color: i === 5 ? "#dc2626" : i === 4 ? "#16a34a" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════ MODE 4: RETURN FILING CALENDAR ═══════ */
function ReturnsMode() {
    const quarters = [
        { q: "Q1", period: "April – June", gstr1: "11th of following month", gstr3b: "20th of following month", qrmp1: "13th of month following quarter", qrmp3b: "22nd/24th of month following quarter" },
        { q: "Q2", period: "July – September", gstr1: "11th of following month", gstr3b: "20th of following month", qrmp1: "13th of month following quarter", qrmp3b: "22nd/24th of month following quarter" },
        { q: "Q3", period: "October – December", gstr1: "11th of following month", gstr3b: "20th of following month", qrmp1: "13th of month following quarter", qrmp3b: "22nd/24th of month following quarter" },
        { q: "Q4", period: "January – March", gstr1: "11th of following month", gstr3b: "20th of following month", qrmp1: "13th of month following quarter", qrmp3b: "22nd/24th of month following quarter" },
    ];

    const forms = [
        { form: "GSTR-1", purpose: "Outward supplies (sales)", who: "Regular taxpayer", freq: "Monthly (11th) / Quarterly (QRMP)" },
        { form: "GSTR-3B", purpose: "Summary return + tax payment", who: "Regular taxpayer", freq: "Monthly (20th) / Quarterly (QRMP)" },
        { form: "GSTR-2B", purpose: "Auto-generated ITC statement", who: "All taxpayers", freq: "Auto-generated (14th)" },
        { form: "GSTR-9", purpose: "Annual return", who: "Regular taxpayer", freq: "31st December of next FY" },
        { form: "GSTR-9C", purpose: "Reconciliation statement (turnover > ₹5 Cr)", who: "Regular taxpayer", freq: "31st December of next FY" },
        { form: "CMP-08", purpose: "Quarterly payment (composition)", who: "Composition dealer", freq: "18th of month following quarter" },
        { form: "GSTR-4", purpose: "Annual return (composition)", who: "Composition dealer", freq: "30th April of next FY" },
        { form: "IFF", purpose: "Invoice Furnishing Facility (M1, M2 only)", who: "QRMP taxpayer", freq: "13th of following month" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
            <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", marginBottom: 8 }}>📅 GST Return Filing Calendar — FY 2025-26</div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)", background: "var(--n-surface-alt)" }}>
                            <th style={{ textAlign: "left", padding: "8px 6px" }}>Quarter</th>
                            <th style={{ textAlign: "left", padding: "8px 6px" }}>Period</th>
                            <th style={{ textAlign: "center", padding: "8px 6px" }}>GSTR-1 (Monthly)</th>
                            <th style={{ textAlign: "center", padding: "8px 6px" }}>GSTR-3B (Monthly)</th>
                        </tr></thead>
                        <tbody>
                            {quarters.map((q, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                    <td style={{ padding: "6px", fontWeight: 700 }}>{q.q}</td>
                                    <td style={{ padding: "6px" }}>{q.period}</td>
                                    <td style={{ textAlign: "center", padding: "6px", fontWeight: 600 }}>{q.gstr1}</td>
                                    <td style={{ textAlign: "center", padding: "6px", fontWeight: 600 }}>{q.gstr3b}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", marginBottom: 8 }}>📋 GST Forms & Returns Guide</div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)", background: "var(--n-surface-alt)" }}>
                            <th style={{ textAlign: "left", padding: "8px 6px" }}>Form</th>
                            <th style={{ textAlign: "left", padding: "8px 6px" }}>Purpose</th>
                            <th style={{ textAlign: "left", padding: "8px 6px" }}>Filed By</th>
                            <th style={{ textAlign: "left", padding: "8px 6px" }}>Due Date</th>
                        </tr></thead>
                        <tbody>
                            {forms.map((f, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                    <td style={{ padding: "6px", fontWeight: 700 }}>{f.form}</td>
                                    <td style={{ padding: "6px" }}>{f.purpose}</td>
                                    <td style={{ padding: "6px" }}>{f.who}</td>
                                    <td style={{ padding: "6px", fontWeight: 600 }}>{f.freq}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ background: "#fffbeb", borderRadius: 8, padding: "10px 12px", fontSize: "0.78rem" }}>
                <strong style={{ color: "#b45309" }}>⚠️ Late Filing Penalty:</strong> ₹50/day (CGST ₹25 + SGST ₹25) for GSTR-3B, capped at ₹10,000 per return. Nil returns: ₹20/day. Interest on late tax payment: 18% p.a.
            </div>
        </div>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function GSTCalculatorCore() {
    const [mode, setMode] = useState<Mode>("calculator");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🧾 GST Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>CGST + SGST / IGST • All slabs • ITC • Return calendar</div>
            </div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--n-border)", flexWrap: "wrap" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        flex: 1, minWidth: 110, padding: "12px 8px", border: "none", cursor: "pointer",
                        borderBottom: mode === m.key ? "3px solid var(--n-primary)" : "3px solid transparent",
                        background: mode === m.key ? "var(--n-primary-light)" : "transparent",
                        fontWeight: mode === m.key ? 700 : 500, fontSize: "0.82rem",
                        color: mode === m.key ? "var(--n-primary)" : "var(--n-text-muted)",
                    }}>{m.icon} {m.label}</button>
                ))}
            </div>
            <div style={{ padding: "var(--s-5)" }}>
                {mode === "calculator" && <CalculatorMode />}
                {mode === "rate_chart" && <RateChartMode />}
                {mode === "itc" && <ITCMode />}
                {mode === "returns" && <ReturnsMode />}
            </div>
        </div>
    );
}
