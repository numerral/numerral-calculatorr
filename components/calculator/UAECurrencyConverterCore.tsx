"use client";
import { useState, useMemo } from "react";

/* ── Reference Exchange Rates (indicative mid-market rates) ── */
const CURRENCIES = [
    { code: "USD", name: "US Dollar", symbol: "$", rate: 3.6725, flag: "🇺🇸", peg: true },
    { code: "EUR", name: "Euro", symbol: "€", rate: 4.14, flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", rate: 4.83, flag: "🇬🇧" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 0.04375, flag: "🇮🇳" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨", rate: 0.01318, flag: "🇵🇰" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱", rate: 0.06388, flag: "🇵🇭" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", rate: 0.03052, flag: "🇧🇩" },
    { code: "EGP", name: "Egyptian Pound", symbol: "E£", rate: 0.07457, flag: "🇪🇬" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 0.9793, flag: "🇸🇦" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", rate: 11.98, flag: "🇰🇼" },
    { code: "BHD", name: "Bahraini Dinar", symbol: "BD", rate: 9.74, flag: "🇧🇭" },
    { code: "OMR", name: "Omani Rial", symbol: "OMR", rate: 9.54, flag: "🇴🇲" },
    { code: "QAR", name: "Qatari Riyal", symbol: "QR", rate: 1.0089, flag: "🇶🇦" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 0.02544, flag: "🇯🇵" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 0.5082, flag: "🇨🇳" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 2.445, flag: "🇦🇺" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 2.678, flag: "🇨🇦" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 4.26, flag: "🇨🇭" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 2.79, flag: "🇸🇬" },
    { code: "ZAR", name: "South African Rand", symbol: "R", rate: 0.2064, flag: "🇿🇦" },
    { code: "NPR", name: "Nepalese Rupee", symbol: "रू", rate: 0.02734, flag: "🇳🇵" },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", rate: 0.01238, flag: "🇱🇰" },
];

const fmtNum = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

function ResultRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
    return (<div className="con-result-row" style={highlight ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : warn ? { background: "rgba(234,179,8,0.08)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined}>
        <span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value" style={highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : undefined}>{value}</span>
    </div>);
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAECurrencyConverterCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["💱 Converter", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">💱 AED Currency Converter</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <ConverterTab />}
        {tab === 1 && <ReferenceTab />}
    </div>);
}

/* ── Converter Tab ── */
function ConverterTab() {
    const [amount, setAmount] = useState("1000");
    const [fromCurrency, setFromCurrency] = useState("AED");
    const [toCurrency, setToCurrency] = useState("USD");

    const result = useMemo(() => {
        const amt = parseFloat(amount) || 0;
        if (amt <= 0) return null;

        if (fromCurrency === "AED") {
            // AED → Foreign
            const cur = CURRENCIES.find(c => c.code === toCurrency);
            if (!cur) return null;
            const converted = amt / cur.rate;
            const rate = 1 / cur.rate;
            return { from: "AED", to: cur.code, fromAmount: amt, toAmount: converted, rate, reverseRate: cur.rate, currency: cur };
        } else if (toCurrency === "AED") {
            // Foreign → AED
            const cur = CURRENCIES.find(c => c.code === fromCurrency);
            if (!cur) return null;
            const converted = amt * cur.rate;
            const rate = cur.rate;
            return { from: cur.code, to: "AED", fromAmount: amt, toAmount: converted, rate, reverseRate: 1 / cur.rate, currency: cur };
        } else {
            // Foreign → AED → Foreign
            const curFrom = CURRENCIES.find(c => c.code === fromCurrency);
            const curTo = CURRENCIES.find(c => c.code === toCurrency);
            if (!curFrom || !curTo) return null;
            const aedAmount = amt * curFrom.rate;
            const converted = aedAmount / curTo.rate;
            const rate = curFrom.rate / curTo.rate;
            return { from: curFrom.code, to: curTo.code, fromAmount: amt, toAmount: converted, rate, reverseRate: curTo.rate / curFrom.rate, currency: curTo, via: aedAmount };
        }
    }, [amount, fromCurrency, toCurrency]);

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const allOptions = [{ code: "AED", name: "UAE Dirham", flag: "🇦🇪" }, ...CURRENCIES.map(c => ({ code: c.code, name: c.name, flag: c.flag }))];

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 12 }}>
                💱 Convert between AED and 22 major world currencies. Rates shown are indicative mid-market reference rates. Actual exchange house rates may vary by 1–3%. The AED is <strong>pegged to the USD at 3.6725</strong> — this rate never changes.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Amount */}
                <div className="con-input">
                    <label className="con-input__label" htmlFor="cc-amount">Amount</label>
                    <input id="cc-amount" type="number" className="con-input__field" value={amount} onChange={e => setAmount(e.target.value)} min={0} step={1} placeholder="e.g. 1000" />
                </div>

                {/* From / Swap / To */}
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                    <div className="con-input" style={{ flex: 1 }}>
                        <label className="con-input__label" htmlFor="cc-from">From</label>
                        <select id="cc-from" className="con-input__field" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                            {allOptions.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
                        </select>
                    </div>

                    <button onClick={swapCurrencies} style={{ padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: "1.1rem", fontFamily: "inherit", flexShrink: 0 }} title="Swap currencies">⇄</button>

                    <div className="con-input" style={{ flex: 1 }}>
                        <label className="con-input__label" htmlFor="cc-to">To</label>
                        <select id="cc-to" className="con-input__field" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
                            {allOptions.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {result && <div className="con-calc__results">
            <h4>Conversion Result</h4>
            <ResultRow label={`${fmtNum(result.fromAmount, 2)} ${result.from}`} value={`${fmtNum(result.toAmount, result.toAmount > 100 ? 2 : 4)} ${result.to}`} highlight />
            <ResultRow label={`1 ${result.from}`} value={`${fmtNum(result.rate, result.rate > 10 ? 4 : 6)} ${result.to}`} />
            <ResultRow label={`1 ${result.to}`} value={`${fmtNum(result.reverseRate, result.reverseRate > 10 ? 4 : 6)} ${result.from}`} />

            {result.currency?.peg && (result.from === "USD" || result.to === "USD") && (
                <ResultRow label="🔒 USD/AED Peg" value="Fixed at 3.6725 since 1997" warn />
            )}

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ <strong>Disclaimer:</strong> These are indicative mid-market reference rates for informational purposes only. Actual exchange rates at banks, exchange houses, and money transfer services include a markup (typically 1–3%). Always compare rates from multiple providers before exchanging. USD/AED is fixed at 3.6725, but all other pairs fluctuate.
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
        {/* AED Cross Rates */}
        <h4>AED Reference Cross Rates</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Currency</th>
                    <th style={th}>1 AED =</th>
                    <th style={th}>1 Unit = AED</th>
                    <th style={{ ...th, textAlign: "left" }}>Type</th>
                </tr></thead>
                <tbody>
                    {CURRENCIES.slice(0, 13).map((c, i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{c.flag} {c.code} — {c.name}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fmtNum(1 / c.rate, 1 / c.rate > 10 ? 2 : 4)}</td>
                            <td style={td}>{fmtNum(c.rate, c.rate > 1 ? 4 : 5)}</td>
                            <td style={tl}>{c.peg ? "🔒 Pegged" : "📈 Floating"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* GCC Pegged Currencies */}
        <h4 style={{ marginTop: "var(--s-4)" }}>GCC Currency Pegs to USD</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Currency</th>
                    <th style={th}>Peg Rate (vs USD)</th>
                    <th style={th}>AED Equivalent</th>
                    <th style={{ ...th, textAlign: "left" }}>Status</th>
                </tr></thead>
                <tbody>
                    {([
                        ["🇦🇪 AED — UAE Dirham", "3.6725", "1.0000", "Fixed since 1997"],
                        ["🇸🇦 SAR — Saudi Riyal", "3.7500", "0.9793", "Fixed since 1986"],
                        ["🇧🇭 BHD — Bahraini Dinar", "0.3760", "9.7674", "Fixed since 1980"],
                        ["🇶🇦 QAR — Qatari Riyal", "3.6400", "1.0089", "Fixed since 2001"],
                        ["🇴🇲 OMR — Omani Rial", "0.3845", "9.5505", "Fixed since 1986"],
                        ["🇰🇼 KWD — Kuwaiti Dinar", "~0.306 (basket)", "~11.98", "Basket peg (not USD-only)"],
                    ] as string[][]).map(([currency, usdRate, aed, status], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{currency}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{usdRate}</td>
                            <td style={td}>{aed}</td>
                            <td style={tl}>{status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Remittance Corridors */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Top UAE Remittance Corridors</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Country</th>
                    <th style={th}>Annual Volume (est.)</th>
                    <th style={th}>~1 AED =</th>
                    <th style={{ ...th, textAlign: "left" }}>Key Channels</th>
                </tr></thead>
                <tbody>
                    {([
                        ["🇮🇳 India", "$21.6 billion", "~23.7 INR", "Al Ansari, Lulu Exchange, Wise, InstaPay"],
                        ["🇵🇰 Pakistan", "$8.4 billion", "~76.7 PKR", "Al Fardan, JazzCash, bank transfer"],
                        ["🇵🇭 Philippines", "$4.2 billion", "~15.7 PHP", "GCash, Sharaf Exchange, Western Union"],
                        ["🇧🇩 Bangladesh", "$3.1 billion", "~32.8 BDT", "bKash, Nagad, Al Ansari Exchange"],
                        ["🇪🇬 Egypt", "$2.8 billion", "~13.4 EGP", "Bank Misr, NBE, CBI transfers"],
                        ["🇳🇵 Nepal", "$1.2 billion", "~36.6 NPR", "Prabhu Money Transfer, IME"],
                        ["🇱🇰 Sri Lanka", "$0.9 billion", "~80.8 LKR", "Bank of Ceylon, exchange houses"],
                    ] as string[][]).map(([country, volume, rate, channels], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{country}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{volume}</td>
                            <td style={td}>{rate}</td>
                            <td style={tl}>{channels}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Exchange House Comparison */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Exchange Methods — Cost Comparison</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Method</th>
                    <th style={th}>Avg. Fee</th>
                    <th style={th}>Speed</th>
                    <th style={{ ...th, textAlign: "left" }}>Best For</th>
                </tr></thead>
                <tbody>
                    {([
                        ["🏛️ Banks (wire transfer)", "~5–14%", "1–3 days", "Large amounts, business transfers"],
                        ["🏪 Exchange houses", "~3–5%", "Same day/instant", "Cash exchange, popular corridors"],
                        ["📱 Mobile apps (Wise, Remitly)", "~1–3%", "Minutes to 1 day", "Best rates, small-medium amounts"],
                        ["💳 Credit/debit card abroad", "~2–4%", "Instant", "Travel spending (watch DCC fees)"],
                        ["✈️ Airport exchange", "~5–10%", "Instant", "Avoid if possible — worst rates"],
                    ] as string[][]).map(([method, fee, speed, best], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{method}</td>
                            <td style={{ ...td, fontWeight: 700, color: i <= 1 ? "#b45309" : i === 2 ? "#009639" : "#b45309" }}>{fee}</td>
                            <td style={td}>{speed}</td>
                            <td style={tl}>{best}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* AED Denominations */}
        <h4 style={{ marginTop: "var(--s-4)" }}>AED Banknote & Coin Denominations</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Denomination</th>
                    <th style={th}>Type</th>
                    <th style={th}>USD Equivalent</th>
                    <th style={{ ...th, textAlign: "left" }}>Color/Feature</th>
                </tr></thead>
                <tbody>
                    {([
                        ["1,000 AED", "Banknote", "$272.29", "Brownish — Al Hosn Palace"],
                        ["500 AED", "Banknote", "$136.15", "Dark blue — Sparrowhawk"],
                        ["200 AED", "Banknote", "$54.46", "Green/brown — Central Bank HQ"],
                        ["100 AED", "Banknote", "$27.23", "Pink — Al Fahidi Fort"],
                        ["50 AED", "Banknote", "$13.61", "Purple — Al Jahili Fort"],
                        ["20 AED", "Banknote", "$5.45", "Light blue — Dubai Creek"],
                        ["10 AED", "Banknote", "$2.72", "Green — Khor Fakkan"],
                        ["5 AED", "Banknote", "$1.36", "Brown — Al Ain Oasis"],
                        ["1 AED", "Coin", "$0.27", "Bimetallic — Palm tree design"],
                        ["50 fils", "Coin", "$0.14", "Copper-nickel — Oil derricks"],
                        ["25 fils", "Coin", "$0.07", "Copper-nickel — Gazelle"],
                    ] as string[][]).map(([denom, type, usd, feature], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{denom}</td>
                            <td style={td}>{type}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{usd}</td>
                            <td style={tl}>{feature}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}
