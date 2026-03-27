"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fils = (n: number) => `${n} fils/kWh`;

function ResultRow({ label, value, highlight, warn, sub, green, red }: { label: string; value: string; highlight?: boolean; warn?: boolean; sub?: boolean; green?: boolean; red?: boolean }) {
    const bg = highlight ? "rgba(0,150,57,0.06)" : warn ? "rgba(234,179,8,0.08)" : green ? "rgba(34,197,94,0.05)" : red ? "rgba(239,68,68,0.05)" : undefined;
    const style = bg ? { background: bg, borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined;
    const valStyle = highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : sub ? { color: "var(--text-muted)", fontSize: "0.88rem" } : undefined;
    return (<div className="con-result-row" style={style}>
        <span className="con-result-row__label" style={sub ? { fontSize: "0.88rem", paddingLeft: 12 } : undefined}>{label}</span>
        <span className="con-result-row__value" style={valStyle}>{value}</span>
    </div>);
}

/* ═══════════════════════════════════════════════════
   TARIFF DATA
   ═══════════════════════════════════════════════════ */
type CustomerType = "national" | "expat";
type PropertyType = "apartment" | "villa";

interface ElecTariff { greenRate: number; redRate: number; greenLimitPerDay: number; meterFee: number; }
interface WaterTariff { greenRate: number; redRate: number; greenLimitPerDay: number; }

const ELEC_TARIFFS: Record<CustomerType, Record<PropertyType, ElecTariff>> = {
    national: {
        apartment: { greenRate: 0.067, redRate: 0.081, greenLimitPerDay: 30, meterFee: 5.23 },
        villa: { greenRate: 0.067, redRate: 0.081, greenLimitPerDay: 400, meterFee: 5.23 },
    },
    expat: {
        apartment: { greenRate: 0.268, redRate: 0.295, greenLimitPerDay: 20, meterFee: 7.84 },
        villa: { greenRate: 0.268, redRate: 0.295, greenLimitPerDay: 30, meterFee: 7.84 },
    },
};

const WATER_TARIFFS: Record<CustomerType, Record<PropertyType, WaterTariff>> = {
    national: {
        apartment: { greenRate: 2.09, redRate: 2.60, greenLimitPerDay: 0.7 },
        villa: { greenRate: 2.09, redRate: 2.60, greenLimitPerDay: 7 },
    },
    expat: {
        apartment: { greenRate: 7.84, redRate: 10.41, greenLimitPerDay: 0.7 },
        villa: { greenRate: 7.84, redRate: 10.41, greenLimitPerDay: 5 },
    },
};

/* DEWA slab tariffs for comparison */
const DEWA_ELEC_SLABS = [
    { limit: 2000, rate: 0.23 },
    { limit: 4000, rate: 0.28 },
    { limit: 6000, rate: 0.32 },
    { limit: Infinity, rate: 0.38 },
];
const DEWA_WATER_SLABS = [
    { limit: 27, rate: 7.70 },   // m³
    { limit: 54, rate: 8.80 },
    { limit: Infinity, rate: 10.12 },
];
const DEWA_FUEL_ELEC = 0.060; // AED/kWh
const DEWA_FUEL_WATER = 1.10; // AED/m³
const DEWA_METER_FEE = 10.00;
const DEWA_SEWAGE_RATE = 0.33; // AED/m³

function calcDEWA(kWh: number, waterM3: number) {
    let elecCost = 0, remaining = kWh;
    for (const s of DEWA_ELEC_SLABS) {
        const chunk = Math.min(remaining, s.limit - (s === DEWA_ELEC_SLABS[0] ? 0 : DEWA_ELEC_SLABS[DEWA_ELEC_SLABS.indexOf(s) - 1].limit));
        if (chunk <= 0) break;
        elecCost += chunk * s.rate;
        remaining -= chunk;
        if (remaining <= 0) break;
    }
    const elecFuel = kWh * DEWA_FUEL_ELEC;
    let waterCost = 0; remaining = waterM3;
    for (const s of DEWA_WATER_SLABS) {
        const prevLimit = s === DEWA_WATER_SLABS[0] ? 0 : DEWA_WATER_SLABS[DEWA_WATER_SLABS.indexOf(s) - 1].limit;
        const chunk = Math.min(remaining, s.limit - prevLimit);
        if (chunk <= 0) break;
        waterCost += chunk * s.rate;
        remaining -= chunk;
        if (remaining <= 0) break;
    }
    const waterFuel = waterM3 * DEWA_FUEL_WATER;
    const sewage = waterM3 * DEWA_SEWAGE_RATE;
    const subtotal = elecCost + elecFuel + waterCost + waterFuel + sewage + DEWA_METER_FEE;
    const vat = subtotal * 0.05;
    return { elecCost: elecCost + elecFuel, waterCost: waterCost + waterFuel + sewage, meterFee: DEWA_METER_FEE, subtotal, vat, total: subtotal + vat };
}

function calcADDC(kWh: number, waterM3: number, days: number, customer: CustomerType, property: PropertyType, annualRent: number) {
    const et = ELEC_TARIFFS[customer][property];
    const wt = WATER_TARIFFS[customer][property];

    const greenKWh = Math.min(kWh, et.greenLimitPerDay * days);
    const redKWh = Math.max(0, kWh - greenKWh);
    const elecGreen = greenKWh * et.greenRate;
    const elecRed = redKWh * et.redRate;
    const elecTotal = elecGreen + elecRed;

    const greenM3 = Math.min(waterM3, wt.greenLimitPerDay * days);
    const redM3 = Math.max(0, waterM3 - greenM3);
    const waterGreen = greenM3 * wt.greenRate;
    const waterRed = redM3 * wt.redRate;
    const waterTotal = waterGreen + waterRed;

    const meterFee = et.meterFee;
    const muniMonthly = Math.max(annualRent * 0.05 / 12, annualRent > 0 ? 37.50 : 0);
    const subtotal = elecTotal + waterTotal + meterFee + muniMonthly;
    const vat = subtotal * 0.05;

    return {
        greenKWh, redKWh, elecGreen, elecRed, elecTotal,
        greenM3, redM3, waterGreen, waterRed, waterTotal,
        meterFee, muniMonthly, subtotal, vat, total: subtotal + vat,
        greenRate: et.greenRate, redRate: et.redRate,
        wGreenRate: wt.greenRate, wRedRate: wt.redRate,
    };
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function UAEADDCBillCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["⚡ Bill Calculator", "🔄 ADDC vs DEWA", "📋 Tariff Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">⚡ ADDC Bill Calculator — Abu Dhabi 2026</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <BillCalcTab />}
        {tab === 1 && <CompareTab />}
        {tab === 2 && <TariffTab />}
    </div>);
}

/* ═══════════════════════════════════════════════════
   BILL CALCULATOR TAB
   ═══════════════════════════════════════════════════ */
function BillCalcTab() {
    const [customer, setCustomer] = useState<CustomerType>("expat");
    const [property, setProperty] = useState<PropertyType>("apartment");
    const [kWh, setKWh] = useState("1000");
    const [waterM3, setWaterM3] = useState("10");
    const [days, setDays] = useState("30");
    const [rent, setRent] = useState("60000");

    const r = useMemo(() => calcADDC(parseFloat(kWh) || 0, parseFloat(waterM3) || 0, parseInt(days) || 30, customer, property, parseFloat(rent) || 0), [kWh, waterM3, days, customer, property, rent]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ⚡ Estimate your monthly ADDC / TAQA Distribution bill. Select your customer type and property, enter consumption, and see an itemized breakdown including Green/Red band split, municipality fee, and VAT.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ad-cust">Customer Type</label>
                <select id="ad-cust" className="con-input__field" value={customer} onChange={e => setCustomer(e.target.value as CustomerType)}>
                    <option value="expat">Expatriate Resident</option>
                    <option value="national">UAE National</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ad-prop">Property Type</label>
                <select id="ad-prop" className="con-input__field" value={property} onChange={e => setProperty(e.target.value as PropertyType)}>
                    <option value="apartment">Apartment / Flat</option>
                    <option value="villa">Villa</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ad-kwh">Electricity Consumption <span className="con-input__unit">(kWh)</span></label>
                <input id="ad-kwh" type="number" className="con-input__field" value={kWh} onChange={e => setKWh(e.target.value)} min={0} step={100} placeholder="e.g. 1000" />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ad-water">Water Consumption <span className="con-input__unit">(cubic meters)</span></label>
                <input id="ad-water" type="number" className="con-input__field" value={waterM3} onChange={e => setWaterM3(e.target.value)} min={0} step={1} placeholder="e.g. 10" />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ad-days">Billing Days</label>
                <input id="ad-days" type="number" className="con-input__field" value={days} onChange={e => setDays(e.target.value)} min={1} max={60} step={1} />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ad-rent">Annual Rent <span className="con-input__unit">(AED — for municipality fee)</span></label>
                <input id="ad-rent" type="number" className="con-input__field" value={rent} onChange={e => setRent(e.target.value)} min={0} step={1000} placeholder="e.g. 60000" />
            </div>
        </div>

        <div className="con-calc__results">
            <h4>⚡ Electricity Charges</h4>
            <ResultRow label={`🟢 Green Band (${r.greenKWh.toFixed(0)} kWh × ${r.greenRate} AED)`} value={fmtAED(r.elecGreen)} green sub />
            {r.redKWh > 0 && <ResultRow label={`🔴 Red Band (${r.redKWh.toFixed(0)} kWh × ${r.redRate} AED)`} value={fmtAED(r.elecRed)} red sub />}
            <ResultRow label="Electricity subtotal" value={fmtAED(r.elecTotal)} />

            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <h4>💧 Water Charges</h4>
            <ResultRow label={`🟢 Green Band (${r.greenM3.toFixed(1)} m³ × ${r.wGreenRate} AED)`} value={fmtAED(r.waterGreen)} green sub />
            {r.redM3 > 0 && <ResultRow label={`🔴 Red Band (${r.redM3.toFixed(1)} m³ × ${r.wRedRate} AED)`} value={fmtAED(r.waterRed)} red sub />}
            <ResultRow label="Water subtotal" value={fmtAED(r.waterTotal)} />

            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <ResultRow label="Meter service fee" value={fmtAED(r.meterFee)} sub />
            {r.muniMonthly > 0 && <ResultRow label="Municipality fee (5% of rent ÷ 12)" value={fmtAED(r.muniMonthly)} sub />}
            <ResultRow label="Subtotal before VAT" value={fmtAED(r.subtotal)} />
            <ResultRow label="5% VAT" value={fmtAED(r.vat)} sub />
            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <ResultRow label="Total Monthly Bill" value={fmtAED(r.total)} highlight />

            <div style={{ marginTop: 12 }}>
                <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.04)", borderRadius: 6, fontSize: "0.82rem", lineHeight: 1.6 }}>
                    📌 <strong>Green Band limit:</strong> {property === "apartment" ? (customer === "expat" ? "20" : "30") : (customer === "expat" ? "30" : "400")} kWh/day for electricity, {property === "apartment" ? "0.7" : (customer === "expat" ? "5" : "7")} m³/day for water. Consumption beyond these thresholds is charged at the higher Red Band rate.
                </div>
            </div>
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   ADDC vs DEWA COMPARISON TAB
   ═══════════════════════════════════════════════════ */
function CompareTab() {
    const [kWh, setKWh] = useState("2000");
    const [waterM3, setWaterM3] = useState("15");
    const [rent, setRent] = useState("60000");

    const addc = useMemo(() => calcADDC(parseFloat(kWh) || 0, parseFloat(waterM3) || 0, 30, "expat", "apartment", parseFloat(rent) || 0), [kWh, waterM3, rent]);
    const dewa = useMemo(() => calcDEWA(parseFloat(kWh) || 0, parseFloat(waterM3) || 0), [kWh, waterM3]);
    const dewaTotal = dewa.total + Math.max((parseFloat(rent) || 0) * 0.05 / 12, 0);
    const diff = dewaTotal - addc.total;

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🔄 Compare the same consumption across ADDC (Abu Dhabi) and DEWA (Dubai). Enter your usage below to see which emirate is cheaper for your consumption level. Comparison uses <strong>expatriate apartment</strong> rates.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="cmp-kwh">Electricity (kWh)</label>
                <input id="cmp-kwh" type="number" className="con-input__field" value={kWh} onChange={e => setKWh(e.target.value)} min={0} step={100} />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="cmp-water">Water (m³)</label>
                <input id="cmp-water" type="number" className="con-input__field" value={waterM3} onChange={e => setWaterM3(e.target.value)} min={0} step={1} />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="cmp-rent">Annual Rent (AED)</label>
                <input id="cmp-rent" type="number" className="con-input__field" value={rent} onChange={e => setRent(e.target.value)} min={0} step={1000} />
            </div>
        </div>

        <div className="con-calc__results">
            <h4>Side-by-Side Comparison</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Component</th>
                        <th style={{ padding: "8px 12px", textAlign: "center" }}>⚡ ADDC</th>
                        <th style={{ padding: "8px 12px", textAlign: "center" }}>💡 DEWA</th>
                    </tr></thead>
                    <tbody>
                        {([
                            ["Electricity", fmtAED(addc.elecTotal), fmtAED(dewa.elecCost)],
                            ["Water", fmtAED(addc.waterTotal), fmtAED(dewa.waterCost)],
                            ["Meter fee", fmtAED(addc.meterFee), fmtAED(dewa.meterFee)],
                            ["Municipality fee", fmtAED(addc.muniMonthly), fmtAED(Math.max((parseFloat(rent) || 0) * 0.05 / 12, 0))],
                            ["5% VAT", fmtAED(addc.vat), fmtAED(dewa.vat + Math.max((parseFloat(rent) || 0) * 0.05 / 12, 0) * 0.05)],
                        ] as string[][]).map(([label, addcVal, dewaVal], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "6px 12px", fontWeight: 600 }}>{label}</td>
                                <td style={{ padding: "6px 12px", textAlign: "center" }}>{addcVal}</td>
                                <td style={{ padding: "6px 12px", textAlign: "center" }}>{dewaVal}</td>
                            </tr>
                        ))}
                        <tr style={{ borderTop: "2px solid var(--border)", fontWeight: 800 }}>
                            <td style={{ padding: "8px 12px" }}>Total</td>
                            <td style={{ padding: "8px 12px", textAlign: "center", color: diff > 0 ? "#009639" : "#dc2626" }}>{fmtAED(addc.total)}</td>
                            <td style={{ padding: "8px 12px", textAlign: "center", color: diff < 0 ? "#009639" : "#dc2626" }}>{fmtAED(dewaTotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: 12 }}>
                {diff > 0 ? (
                    <div style={{ padding: "10px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 6, fontSize: "0.9rem", fontWeight: 700, color: "#009639", textAlign: "center" }}>
                        ✅ ADDC is cheaper by {fmtAED(Math.abs(diff))}/month ({((Math.abs(diff)/dewaTotal)*100).toFixed(1)}% savings)
                    </div>
                ) : diff < 0 ? (
                    <div style={{ padding: "10px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 6, fontSize: "0.9rem", fontWeight: 700, color: "#2563eb", textAlign: "center" }}>
                        ✅ DEWA is cheaper by {fmtAED(Math.abs(diff))}/month ({((Math.abs(diff)/addc.total)*100).toFixed(1)}% savings)
                    </div>
                ) : (
                    <div style={{ padding: "10px 12px", background: "rgba(100,100,100,0.06)", borderRadius: 6, fontSize: "0.9rem", fontWeight: 700, textAlign: "center" }}>
                        🤝 Same cost in both emirates
                    </div>
                )}
            </div>
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   TARIFF TABLES TAB
   ═══════════════════════════════════════════════════ */
function TariffTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        <h4>Electricity Tariffs — ADDC / TAQA Distribution 2025</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Customer</th>
                <th style={th}>🟢 Green (fils/kWh)</th>
                <th style={th}>🔴 Red (fils/kWh)</th>
                <th style={th}>Green Limit</th>
                <th style={th}>Meter Fee</th>
            </tr></thead><tbody>
                {([
                    ["🇦🇪 National — Apartment", "6.7", "8.1", "30 kWh/day", "AED 5.23"],
                    ["🇦🇪 National — Villa", "6.7", "8.1", "400 kWh/day", "AED 5.23"],
                    ["🌍 Expat — Apartment", "26.8", "29.5", "20 kWh/day", "AED 7.84"],
                    ["🌍 Expat — Villa", "26.8", "29.5", "30 kWh/day", "AED 7.84"],
                    ["🏢 Commercial", "20.0", "—", "—", "AED 7.84"],
                    ["🏭 Industrial", "15.0", "—", "—", "AED 10.41"],
                    ["🏛️ Government", "29.4", "—", "—", "AED 10.41"],
                    ["🌾 Agricultural", "3.0", "—", "—", "AED 5.23"],
                ] as string[][]).map(([cust, green, red, limit, fee], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{cust}</td>
                        <td style={{ ...td, color: "#16a34a", fontWeight: 700 }}>{green}</td>
                        <td style={{ ...td, color: red === "—" ? "var(--text-muted)" : "#dc2626", fontWeight: red === "—" ? 400 : 700 }}>{red}</td>
                        <td style={td}>{limit}</td>
                        <td style={td}>{fee}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Water Tariffs — ADDC / TAQA Distribution 2025</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Customer</th>
                <th style={th}>🟢 Green (AED/m³)</th>
                <th style={th}>🔴 Red (AED/m³)</th>
                <th style={th}>Green Limit</th>
            </tr></thead><tbody>
                {([
                    ["🇦🇪 National — Apartment", "2.09", "2.60", "0.7 m³/day"],
                    ["🇦🇪 National — Villa", "2.09", "2.60", "7 m³/day"],
                    ["🌍 Expat — Apartment", "7.84", "10.41", "0.7 m³/day"],
                    ["🌍 Expat — Villa", "7.84", "10.41", "5 m³/day"],
                    ["🏢 Commercial", "10.41", "—", "—"],
                    ["🏭 Industrial", "10.41", "—", "—"],
                ] as string[][]).map(([cust, green, red, limit], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{cust}</td>
                        <td style={{ ...td, color: "#16a34a", fontWeight: 700 }}>{green}</td>
                        <td style={{ ...td, color: red === "—" ? "var(--text-muted)" : "#dc2626", fontWeight: red === "—" ? 400 : 700 }}>{red}</td>
                        <td style={td}>{limit}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Average Monthly Bills (Expatriate)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Property</th>
                <th style={th}>Avg. kWh/mo</th>
                <th style={th}>Electricity</th>
                <th style={th}>Total Bill (est.)</th>
            </tr></thead><tbody>
                {([
                    ["1BR Apartment", "800–1,200", "AED 239–357", "AED 350–550"],
                    ["2BR Apartment", "2,000–3,000", "AED 593–888", "AED 700–1,200"],
                    ["3BR Villa", "4,000–6,000", "AED 1,183–1,773", "AED 1,400–2,200"],
                    ["5BR Villa", "6,000–10,000", "AED 1,773–2,953", "AED 2,000–5,000+"],
                ] as string[][]).map(([prop, kwh, elec, total], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{prop}</td>
                        <td style={td}>{kwh}</td>
                        <td style={td}>{elec}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>{total}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}
