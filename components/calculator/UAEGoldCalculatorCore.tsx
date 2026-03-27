"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 2) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

const KARATS = [
    { value: "24", label: "24K (999 — Pure Gold)", purity: 0.999, fineness: 999 },
    { value: "22", label: "22K (916)", purity: 0.916, fineness: 916 },
    { value: "21", label: "21K (875)", purity: 0.875, fineness: 875 },
    { value: "18", label: "18K (750)", purity: 0.750, fineness: 750 },
];

/* Approximate base rates per gram (AED) — users should enter current market rate */
const DEFAULT_24K_RATE = 350;

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
export default function UAEGoldCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🛒 Buy Gold", "💰 Sell / Buyback", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">✨ UAE Gold Price Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <BuyTab />}
        {tab === 1 && <SellTab />}
        {tab === 2 && <ReferenceTab />}
    </div>);
}

/* ── Buy Gold Tab ── */
function BuyTab() {
    const [karat, setKarat] = useState("22");
    const [rate24K, setRate24K] = useState(String(DEFAULT_24K_RATE));
    const [weightGrams, setWeightGrams] = useState("10");
    const [weightUnit, setWeightUnit] = useState("grams");
    const [makingChargeType, setMakingChargeType] = useState("percent");
    const [makingChargeValue, setMakingChargeValue] = useState("10");

    const result = useMemo(() => {
        const r24 = parseFloat(rate24K) || 0;
        let grams = parseFloat(weightGrams) || 0;
        if (r24 <= 0 || grams <= 0) return null;

        if (weightUnit === "tola") grams *= 11.664;
        if (weightUnit === "ounce") grams *= 31.1035;

        const karatData = KARATS.find(k => k.value === karat)!;
        const ratePerGram = r24 * karatData.purity;
        const goldValue = ratePerGram * grams;

        let makingCharges = 0;
        const mcVal = parseFloat(makingChargeValue) || 0;
        if (makingChargeType === "percent") {
            makingCharges = goldValue * (mcVal / 100);
        } else {
            makingCharges = mcVal * grams;
        }

        const subtotal = goldValue + makingCharges;
        const vat = subtotal * 0.05;
        const total = subtotal + vat;

        return {
            grams,
            karatData,
            ratePerGram,
            goldValue,
            makingCharges,
            subtotal,
            vat,
            total,
            perGram: total / grams,
        };
    }, [karat, rate24K, weightGrams, weightUnit, makingChargeType, makingChargeValue]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(212,175,55,0.08)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ✨ Enter today&apos;s <strong>24K gold rate per gram</strong> from the Dubai Gold &amp; Jewellery Group or any jeweller&apos;s display board. The calculator adjusts rates for your selected karat automatically.
            </div>

            <InputField id="gold-rate-24k" label="Today's 24K Gold Rate" value={rate24K} onChange={setRate24K} unit="AED/gram" min={0} placeholder="e.g. 350" />

            <SelectField id="gold-karat" label="Gold Purity (Karat)" value={karat} onChange={setKarat} options={KARATS.map(k => ({ value: k.value, label: k.label }))} />

            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                    <InputField id="gold-weight" label="Weight" value={weightGrams} onChange={setWeightGrams} min={0} placeholder="e.g. 10" />
                </div>
                <div style={{ width: 120, marginBottom: 12 }}>
                    <select className="con-input__field" value={weightUnit} onChange={e => setWeightUnit(e.target.value)} style={{ height: 42 }}>
                        <option value="grams">Grams</option>
                        <option value="tola">Tola</option>
                        <option value="ounce">Troy Oz</option>
                    </select>
                </div>
            </div>

            <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 4 }}>Making Charges</p>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    {[
                        { v: "percent", l: "% of gold value" },
                        { v: "flat", l: "AED/gram" },
                    ].map(m => (
                        <button key={m.v} onClick={() => setMakingChargeType(m.v)}
                            style={{ fontSize: "0.78rem", padding: "4px 10px", background: makingChargeType === m.v ? "var(--accent)" : "transparent", color: makingChargeType === m.v ? "white" : "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer" }}>{m.l}</button>
                    ))}
                </div>
                <InputField id="gold-mc" label={makingChargeType === "percent" ? "Making Charge %" : "Making Charge per Gram"} value={makingChargeValue} onChange={setMakingChargeValue} unit={makingChargeType === "percent" ? "%" : "AED/gram"} min={0} placeholder={makingChargeType === "percent" ? "e.g. 10" : "e.g. 25"} />
            </div>
        </div>

        {result && <div className="con-calc__results">
            <h4>Gold Purchase Breakdown</h4>

            <ResultRow label={`${result.karatData.label} Rate`} value={`${fmtAED(result.ratePerGram)}/gram`} />
            <ResultRow label={`Weight`} value={`${fmt(result.grams)} grams`} />
            <ResultRow label="Gold Value" value={fmtAED(result.goldValue)} />
            <ResultRow label="Making Charges" value={fmtAED(result.makingCharges)} />
            <ResultRow label="Subtotal" value={fmtAED(result.subtotal)} />
            <ResultRow label="VAT (5%)" value={fmtAED(result.vat)} />

            <div style={{ borderTop: "2px solid var(--border)", marginTop: "var(--s-3)", paddingTop: "var(--s-3)" }}>
                <ResultRow label="Total Price" value={fmtAED(result.total)} highlight />
                <ResultRow label="Price per Gram (incl. VAT)" value={`${fmtAED(result.perGram)}/gram`} />
            </div>

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                💡 <strong>Tip:</strong> Making charges are negotiable at the Gold Souk (aim for ~25% off). Gold rate itself is fixed and non-negotiable. Tourists can reclaim up to 85% of the 5% VAT at the airport.
            </div>
        </div>}
    </div>);
}

/* ── Sell / Buyback Tab ── */
function SellTab() {
    const [karat, setKarat] = useState("22");
    const [rate24K, setRate24K] = useState(String(DEFAULT_24K_RATE));
    const [weightGrams, setWeightGrams] = useState("10");
    const [buybackRate, setBuybackRate] = useState("98");
    const [originalPaid, setOriginalPaid] = useState("");

    const result = useMemo(() => {
        const r24 = parseFloat(rate24K) || 0;
        const grams = parseFloat(weightGrams) || 0;
        const bbRate = parseFloat(buybackRate) || 98;
        if (r24 <= 0 || grams <= 0) return null;

        const karatData = KARATS.find(k => k.value === karat)!;
        const ratePerGram = r24 * karatData.purity;
        const goldValue = ratePerGram * grams;
        const buybackValue = goldValue * (bbRate / 100);

        const paid = parseFloat(originalPaid) || 0;
        const netResult = paid > 0 ? buybackValue - paid : null;

        return { grams, karatData, ratePerGram, goldValue, buybackValue, buybackPct: bbRate, paid, netResult };
    }, [karat, rate24K, weightGrams, buybackRate, originalPaid]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(212,175,55,0.08)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                💰 When selling gold, you receive the <strong>gold value only</strong> — making charges are NOT refunded. Most Dubai jewellers offer <strong>95–100%</strong> of the current gold rate for buyback.
            </div>

            <InputField id="sell-rate-24k" label="Today's 24K Gold Rate" value={rate24K} onChange={setRate24K} unit="AED/gram" min={0} placeholder="e.g. 350" />
            <SelectField id="sell-karat" label="Gold Purity (Karat)" value={karat} onChange={setKarat} options={KARATS.map(k => ({ value: k.value, label: k.label }))} />
            <InputField id="sell-weight" label="Weight" value={weightGrams} onChange={setWeightGrams} unit="grams" min={0} placeholder="e.g. 10" />
            <InputField id="sell-buyback" label="Buyback Rate" value={buybackRate} onChange={setBuybackRate} unit="% of gold value" min={80} max={100} placeholder="e.g. 98" />

            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                <InputField id="sell-original" label="Original Purchase Price (optional)" value={originalPaid} onChange={setOriginalPaid} unit="AED" min={0} placeholder="What you originally paid" />
            </div>
        </div>

        {result && <div className="con-calc__results">
            <h4>Buyback Estimate</h4>

            <ResultRow label={`${result.karatData.label} Rate`} value={`${fmtAED(result.ratePerGram)}/gram`} />
            <ResultRow label="Weight" value={`${fmt(result.grams)} grams`} />
            <ResultRow label="Gold Value (100%)" value={fmtAED(result.goldValue)} />
            <ResultRow label={`Buyback Rate (${result.buybackPct}%)`} value={fmtAED(result.buybackValue)} highlight />

            {result.netResult !== null && <div style={{ marginTop: "var(--s-3)", paddingTop: "var(--s-3)", borderTop: "1px solid var(--border)" }}>
                <ResultRow label="Original Price Paid" value={fmtAED(result.paid)} />
                <ResultRow label="Net Gain/Loss"
                    value={`${result.netResult >= 0 ? "+" : ""}${fmtAED(result.netResult)}`}
                    highlight={result.netResult >= 0}
                    warn={result.netResult < 0} />
                {result.netResult < 0 && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                    ℹ️ Loss is mainly due to making charges — these are not refunded on buyback. The gold itself may have appreciated.
                </div>}
            </div>}

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.8rem" }}>
                💡 <strong>Tips:</strong> Compare offers from multiple shops. Bring original invoice for better rates. XRF purity testing is free at most Gold Souk shops. Gold bars/coins get closer to 100% buyback rates.
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
        {/* Karat Purity */}
        <h4>Gold Karat & Fineness Chart</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Karat</th>
                    <th style={th}>Fineness</th>
                    <th style={th}>Gold %</th>
                    <th style={{ ...th, textAlign: "left" }}>Common Use</th>
                </tr></thead>
                <tbody>
                    {([
                        ["24K", "999", "99.9%", "Investment bars, coins, bullion"],
                        ["22K", "916", "91.6%", "Traditional jewellery (most popular in UAE)"],
                        ["21K", "875", "87.5%", "Jewellery (popular in Gulf region)"],
                        ["18K", "750", "75.0%", "Fine jewellery, watches, designer pieces"],
                        ["14K", "585", "58.5%", "Western-style jewellery (less common in UAE)"],
                    ] as string[][]).map(([k, f, p, use], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 700 }}>{k}</td><td style={{ ...td, fontWeight: 600 }}>{f}</td><td style={td}>{p}</td><td style={tl}>{use}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Making Charges Guide */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Making Charges by Jewellery Type</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Jewellery Type</th>
                    <th style={th}>Typical Making Charge</th>
                    <th style={{ ...th, textAlign: "left" }}>Notes</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Machine-made chains/bangles", "6–10%", "Mass-produced, lowest charges"],
                        ["Standard rings/earrings", "10–15%", "Common designs, moderate charges"],
                        ["Handcrafted/designer pieces", "15–25%", "Intricate detailing, artisan work"],
                        ["Bridal/wedding sets", "20–35%", "Complex multi-piece sets, highest charges"],
                        ["Gold coins (without design)", "1–3%", "Minimal fabrication charge"],
                        ["Gold bars/ingots", "0–2%", "Near-spot pricing, lowest premium"],
                    ] as string[][]).map(([type, charge, note], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{type}</td><td style={{ ...td, fontWeight: 700, color: "#b45309" }}>{charge}</td><td style={tl}>{note}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* ESMA Hallmark */}
        <h4 style={{ marginTop: "var(--s-4)" }}>ESMA Hallmark Components</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Mark</th>
                    <th style={{ ...th, textAlign: "left" }}>Meaning</th>
                </tr></thead>
                <tbody>
                    {([
                        ["UAE crescent moon logo", "Indicates item was tested and hallmarked in the UAE"],
                        ["Fineness number (e.g. 916)", "Gold purity — 916 = 22K, 750 = 18K, 999 = 24K"],
                        ["Manufacturer code", "Unique identifier of the manufacturer/workshop"],
                        ["12-digit serial number", "Unique tracking number — verifiable online via ESMA portal"],
                        ["Bareeq certification mark", "Dubai Central Laboratory purity verification"],
                    ] as string[][]).map(([mark, meaning], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{mark}</td><td style={tl}>{meaning}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* VAT Rules */}
        <h4 style={{ marginTop: "var(--s-4)" }}>VAT on Gold in the UAE</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Category</th>
                    <th style={th}>VAT Rate</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Gold jewellery (retail)", "5%", "Applied to gold value + making charges"],
                        ["Investment gold (≥99% purity)", "Zero-rated", "B2B between VAT-registered entities"],
                        ["Gold bars/coins (retail)", "5%", "Standard rate for individual retail buyers"],
                        ["Tourist VAT refund", "Up to 85% refund", "Process at airport — Planet Tax Free scheme"],
                    ] as string[][]).map(([cat, rate, detail], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{cat}</td><td style={{ ...td, fontWeight: 700, color: rate === "Zero-rated" ? "#009639" : "#b45309" }}>{rate}</td><td style={tl}>{detail}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Weight Conversions */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Gold Weight Conversions</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Unit</th>
                    <th style={th}>In Grams</th>
                    <th style={{ ...th, textAlign: "left" }}>Used In</th>
                </tr></thead>
                <tbody>
                    {([
                        ["1 Gram", "1.000 g", "Standard metric unit — most common in UAE"],
                        ["1 Tola", "11.664 g", "South Asian market (India, Pakistan)"],
                        ["1 Troy Ounce", "31.1035 g", "International bullion market (LBMA, DGCX)"],
                        ["1 Kilogram", "1,000 g", "Wholesale/investment bars"],
                        ["1 Mithqal", "4.68 g", "Traditional Gulf/Arabic unit"],
                    ] as string[][]).map(([unit, grams, used], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{unit}</td><td style={{ ...td, fontWeight: 700 }}>{grams}</td><td style={tl}>{used}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Import/Export Rules */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Gold Import & Export Rules</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Rule</th>
                    <th style={{ ...th, textAlign: "left" }}>Detail</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Max export from UAE", "10 kg per person — must declare at customs"],
                        ["Import duty (jewellery)", "5% customs duty on gold jewellery"],
                        ["Import duty (bullion)", "Typically duty-free for investment-grade"],
                        ["Customs declaration", "Mandatory for all gold when entering/leaving UAE"],
                        ["India duty-free allowance", "Male: 20g (₹50K), Female: 40g (₹1L)"],
                        ["Proof of purchase", "Always carry original invoice for customs"],
                    ] as string[][]).map(([rule, detail], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{rule}</td><td style={tl}>{detail}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}
