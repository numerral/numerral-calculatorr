"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 0) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function ResultRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
    return (<div className="con-result-row" style={highlight ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : warn ? { background: "rgba(234,179,8,0.08)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined}>
        <span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value" style={highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : undefined}>{value}</span>
    </div>);
}

/* ── Plan Data ── */
type Plan = { name: string; price: number; data: string; dataGB: number; minutes: string; extras: string; provider: "e&" | "du" };

const POSTPAID_PLANS: Plan[] = [
    { name: "Freedom Basic", price: 100, data: "2 GB", dataGB: 2, minutes: "100 local min", extras: "GoChat unlimited", provider: "e&" },
    { name: "Freedom 200", price: 200, data: "10 GB", dataGB: 10, minutes: "300 flexi min", extras: "Unlimited local calls, Smiles", provider: "e&" },
    { name: "Freedom 300", price: 300, data: "20 GB", dataGB: 20, minutes: "Unlimited local", extras: "Unlimited calls, STARZPLAY", provider: "e&" },
    { name: "Freedom 500", price: 500, data: "Unlimited", dataGB: 999, minutes: "Unlimited all", extras: "5G, roaming data, premium", provider: "e&" },
    { name: "Power 125", price: 125, data: "4 GB (+8 WiFi)", dataGB: 4, minutes: "200 flexi min", extras: "WiFi UAE data", provider: "du" },
    { name: "Power 200", price: 200, data: "13 GB (+26 WiFi)", dataGB: 13, minutes: "400 flexi min", extras: "100 MB roaming, Disney+", provider: "du" },
    { name: "Power 300", price: 300, data: "Non-stop (10 Mbps)", dataGB: 100, minutes: "800 flexi min", extras: "1 GB roaming, unlimited WiFi", provider: "du" },
    { name: "Power 500", price: 500, data: "Unlimited 5G", dataGB: 999, minutes: "1500 flexi min", extras: "10 GB roaming, premium perks", provider: "du" },
];

const PREPAID_PLANS: Plan[] = [
    { name: "Wasel Flexi 35", price: 35, data: "500 MB", dataGB: 0.5, minutes: "30 flexi min", extras: "Double data online", provider: "e&" },
    { name: "Wasel Flexi 55", price: 55, data: "1 GB", dataGB: 1, minutes: "50 flexi min", extras: "GoChat unlimited", provider: "e&" },
    { name: "Wasel Flexi 100", price: 100, data: "3 GB", dataGB: 3, minutes: "60 flexi min", extras: "10% bonus online", provider: "e&" },
    { name: "Wasel Flexi 160", price: 160, data: "5 GB", dataGB: 5, minutes: "120 flexi min", extras: "Best prepaid value", provider: "e&" },
    { name: "du Prepaid 35", price: 35, data: "750 MB", dataGB: 0.75, minutes: "15 flexi min", extras: "250 MB bonus", provider: "du" },
    { name: "du Prepaid 50", price: 50, data: "1.5 GB", dataGB: 1.5, minutes: "30 flexi min", extras: "750 MB bonus", provider: "du" },
    { name: "du Prepaid 100", price: 100, data: "6 GB", dataGB: 6, minutes: "60 flexi min", extras: "Best du prepaid value", provider: "du" },
    { name: "du Prepaid 150", price: 150, data: "3 GB + bonus", dataGB: 3, minutes: "150 flexi min", extras: "More minutes focus", provider: "du" },
];

const TOURIST_PLANS: Plan[] = [
    { name: "du Tourist 49", price: 49, data: "2 GB", dataGB: 2, minutes: "30 flexi min", extras: "28 days validity", provider: "du" },
    { name: "du Tourist 99", price: 99, data: "6 GB", dataGB: 6, minutes: "30 flexi min", extras: "28 days, intl calling", provider: "du" },
    { name: "du Tourist 189", price: 189, data: "20 GB", dataGB: 20, minutes: "30 flexi min", extras: "28 days validity", provider: "du" },
    { name: "du Tourist Unlimited 7d", price: 199, data: "Unlimited", dataGB: 999, minutes: "100 flexi min", extras: "7 days validity", provider: "du" },
    { name: "du Tourist Unlimited 28d", price: 499, data: "Unlimited", dataGB: 999, minutes: "400 flexi min", extras: "28 days validity", provider: "du" },
    { name: "e& Visitor 55", price: 55, data: "1 GB", dataGB: 1, minutes: "30 local min", extras: "14 days, free SIM", provider: "e&" },
    { name: "e& Visitor 110", price: 110, data: "5 GB", dataGB: 5, minutes: "60 local min", extras: "28 days validity", provider: "e&" },
    { name: "e& Visitor 210", price: 210, data: "15 GB", dataGB: 15, minutes: "120 local min", extras: "28 days, intl calls", provider: "e&" },
];

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAEMobilePlanCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["📱 Plan Finder", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">📱 Mobile Plan Calculator — e& vs du</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <PlanFinderTab />}
        {tab === 1 && <ReferenceTab />}
    </div>);
}

/* ── Plan Finder Tab ── */
function PlanFinderTab() {
    const [planType, setPlanType] = useState<"postpaid" | "prepaid" | "tourist">("postpaid");
    const [budget, setBudget] = useState("300");
    const [minData, setMinData] = useState("5");
    const [provider, setProvider] = useState<"all" | "e&" | "du">("all");

    const plans = planType === "postpaid" ? POSTPAID_PLANS : planType === "prepaid" ? PREPAID_PLANS : TOURIST_PLANS;

    const filtered = useMemo(() => {
        const maxBudget = parseFloat(budget) || 9999;
        const minGB = parseFloat(minData) || 0;
        return plans.filter(p =>
            p.price <= maxBudget &&
            p.dataGB >= minGB &&
            (provider === "all" || p.provider === provider)
        ).sort((a, b) => a.price - b.price);
    }, [plans, budget, minData, provider]);

    const annualCost = useMemo(() => {
        if (filtered.length === 0) return null;
        const cheapest = filtered[0];
        return cheapest.price * 12;
    }, [filtered]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                📱 Find the best mobile plan in the UAE. Filter by budget, minimum data, and provider. Prices shown are monthly charges (VAT inclusive). Plans updated for 2025.
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                {([
                    { v: "postpaid" as const, l: "📋 Postpaid" },
                    { v: "prepaid" as const, l: "💳 Prepaid" },
                    { v: "tourist" as const, l: "✈️ Tourist SIM" },
                ] as const).map(e => (
                    <button key={e.v} onClick={() => setPlanType(e.v)}
                        className={`calc-tab-btn${planType === e.v ? " calc-tab-btn--active" : ""}`}
                        style={{ fontSize: "0.85rem", padding: "6px 14px" }}>{e.l}</button>
                ))}
            </div>

            <div className="con-input">
                <label className="con-input__label" htmlFor="mob-budget">Max Monthly Budget <span className="con-input__unit">(AED)</span></label>
                <input id="mob-budget" type="number" className="con-input__field" value={budget} onChange={e => setBudget(e.target.value)} min={0} step={25} placeholder="e.g. 300" />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="mob-data">Minimum Data <span className="con-input__unit">(GB)</span></label>
                <input id="mob-data" type="number" className="con-input__field" value={minData} onChange={e => setMinData(e.target.value)} min={0} step={1} placeholder="e.g. 5" />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="mob-provider">Provider</label>
                <select id="mob-provider" className="con-input__field" value={provider} onChange={e => setProvider(e.target.value as "all" | "e&" | "du")}>
                    <option value="all">Both (e& + du)</option>
                    <option value="e&">e& (Etisalat) only</option>
                    <option value="du">du only</option>
                </select>
            </div>
        </div>

        <div className="con-calc__results">
            <h4>Matching Plans ({filtered.length} found)</h4>
            {filtered.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No plans match your criteria. Try increasing your budget or reducing minimum data.</p>}

            {filtered.map((p, i) => (
                <div key={i} style={{ padding: "12px", border: "1.5px solid var(--border)", borderRadius: 8, marginBottom: 8, background: i === 0 ? "rgba(0,150,57,0.04)" : undefined }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                            <span style={{ background: p.provider === "e&" ? "#009639" : "#6B21A8", color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: "0.75rem", marginRight: 8 }}>{p.provider}</span>
                            {p.name}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#009639" }}>{fmtAED(p.price)}<span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)" }}>/mo</span></div>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: "0.82rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                        <span>📊 {p.data}</span>
                        <span>📞 {p.minutes}</span>
                        <span>✨ {p.extras}</span>
                    </div>
                    {i === 0 && <div style={{ marginTop: 6, fontSize: "0.78rem", color: "#009639", fontWeight: 600 }}>✅ Best match for your criteria</div>}
                </div>
            ))}

            {annualCost && filtered.length > 0 && <>
                <ResultRow label={`Annual cost (${filtered[0].name})`} value={fmtAED(annualCost)} highlight />
                <ResultRow label="Cost per day" value={fmtAED(annualCost / 365, 2)} />
            </>}
        </div>
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
        {/* e& vs du Overview */}
        <h4>e& (Etisalat) vs du — Head-to-Head</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Aspect</th>
                <th style={th}>e& (Etisalat)</th>
                <th style={th}>du</th>
            </tr></thead><tbody>
                {([
                    ["Market share", "~55%", "~45%"],
                    ["5G coverage", "Wider — launched 2019", "Growing — 90%+ urban"],
                    ["Prepaid pricing", "Slightly higher", "10–15% cheaper"],
                    ["Postpaid pricing", "Competitive", "8–12% cheaper"],
                    ["Coverage (remote)", "Better in rural/mountain", "Strong in urban areas"],
                    ["Roaming partners", "750+ networks, 220+ countries", "650+ networks, 200+ countries"],
                    ["App experience", "My Etisalat (4.5⭐)", "du App (4.3⭐)"],
                    ["eSIM support", "Yes", "Yes"],
                    ["Number portability", "Free — via TDRA", "Free — via TDRA"],
                ] as string[][]).map(([aspect, etisalat, du], i) => (
                    <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{aspect}</td><td style={td}>{etisalat}</td><td style={td}>{du}</td></tr>
                ))}</tbody></table>
        </div>

        {/* Postpaid Comparison */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Postpaid Plans — Side-by-Side</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Plan</th>
                <th style={th}>Price</th>
                <th style={th}>Data</th>
                <th style={th}>Minutes</th>
                <th style={{ ...th, textAlign: "left" }}>Key Perks</th>
            </tr></thead><tbody>
                {POSTPAID_PLANS.map((p, i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}><span style={{ color: p.provider === "e&" ? "#009639" : "#6B21A8", fontWeight: 700, fontSize: "0.78rem" }}>{p.provider}</span> {p.name}</td>
                        <td style={{ ...td, fontWeight: 700 }}>{fmtAED(p.price)}</td>
                        <td style={td}>{p.data}</td>
                        <td style={td}>{p.minutes}</td>
                        <td style={tl}>{p.extras}</td>
                    </tr>
                ))}</tbody></table>
        </div>

        {/* Tourist Plans */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Tourist SIM Plans — e& vs du</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Plan</th>
                <th style={th}>Price</th>
                <th style={th}>Data</th>
                <th style={th}>Minutes</th>
                <th style={{ ...th, textAlign: "left" }}>Validity</th>
            </tr></thead><tbody>
                {TOURIST_PLANS.map((p, i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}><span style={{ color: p.provider === "e&" ? "#009639" : "#6B21A8", fontWeight: 700, fontSize: "0.78rem" }}>{p.provider}</span> {p.name}</td>
                        <td style={{ ...td, fontWeight: 700 }}>{fmtAED(p.price)}</td>
                        <td style={td}>{p.data}</td>
                        <td style={td}>{p.minutes}</td>
                        <td style={tl}>{p.extras}</td>
                    </tr>
                ))}</tbody></table>
        </div>

        {/* USSD Codes */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Essential USSD Codes</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Action</th>
                <th style={th}>e& (Etisalat)</th>
                <th style={th}>du</th>
            </tr></thead><tbody>
                {([
                    ["Check balance", "*121#", "*135#"],
                    ["Check data balance", "*170#", "*135*1#"],
                    ["Recharge online", "eand.ae / My Etisalat app", "du.ae / du app"],
                    ["Customer service", "101 (free)", "155 (free)"],
                    ["International calls", "00 + country code", "00 + country code"],
                    ["Activate roaming", "*121# → Roaming", "My du app → Roaming"],
                    ["Port number (MNP)", "Visit new provider", "Visit new provider"],
                    ["Block SIM (lost)", "Call 800 (e&)", "Call 155 (du)"],
                ] as string[][]).map(([action, etisalat, du], i) => (
                    <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{action}</td><td style={td}>{etisalat}</td><td style={td}>{du}</td></tr>
                ))}</tbody></table>
        </div>

        {/* Roaming Rates */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Daily Roaming Packs (Popular Destinations)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Region</th>
                <th style={th}>e& Daily Rate</th>
                <th style={th}>du Daily Rate</th>
                <th style={{ ...th, textAlign: "left" }}>Includes</th>
            </tr></thead><tbody>
                {([
                    ["GCC countries", "AED 30–40", "AED 25–35", "500 MB data, 30 min calls"],
                    ["India / Pakistan", "AED 40–50", "AED 35–45", "500 MB data, 30 min calls"],
                    ["Europe (UK, EU)", "AED 50–60", "AED 45–55", "500 MB data, 20 min calls"],
                    ["USA / Canada", "AED 50–60", "AED 45–55", "500 MB data, 20 min calls"],
                    ["Southeast Asia", "AED 35–45", "AED 30–40", "500 MB data, 30 min calls"],
                ] as string[][]).map(([region, etisalat, du, includes], i) => (
                    <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{region}</td><td style={td}>{etisalat}</td><td style={{ ...td, fontWeight: 700, color: "#009639" }}>{du}</td><td style={tl}>{includes}</td></tr>
                ))}</tbody></table>
        </div>
    </div>);
}
