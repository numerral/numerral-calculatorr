"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 2) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

/* ── DEWA Tariff Data 2025 ── */
const ELEC_SLABS_RES = [
    { min: 0, max: 2000, rate: 0.23, label: "0–2,000 kWh", color: "#16a34a", tag: "Green" },
    { min: 2001, max: 4000, rate: 0.28, label: "2,001–4,000 kWh", color: "#eab308", tag: "Yellow" },
    { min: 4001, max: 6000, rate: 0.32, label: "4,001–6,000 kWh", color: "#f97316", tag: "Orange" },
    { min: 6001, max: Infinity, rate: 0.38, label: "6,001+ kWh", color: "#dc2626", tag: "Red" },
];

const ELEC_RATE_COMM = 0.38; // Commercial: flat 38 fils/kWh

const WATER_SLABS_RES = [
    { min: 0, max: 6000, rate: 0.035, label: "0–6,000 IG", tag: "Slab 1" },
    { min: 6001, max: 12000, rate: 0.040, label: "6,001–12,000 IG", tag: "Slab 2" },
    { min: 12001, max: Infinity, rate: 0.046, label: "12,001+ IG", tag: "Slab 3" },
];

const WATER_RATE_COMM = 0.046; // Commercial: flat 4.6 fils/IG

const FUEL_SURCHARGE_ELEC = 0.06;  // AED/kWh
const FUEL_SURCHARGE_WATER = 0.005; // AED/IG (0.5 fils/IG)
const SEWERAGE_RATE = 0.0015; // AED/IG (1.5 fils/IG for 2025)
const VAT_RATE = 0.05;

type Slab = { min: number; max: number; rate: number; label: string; color?: string; tag?: string };

function calcSlabCost(usage: number, slabs: Slab[]): { total: number; breakdown: { label: string; units: number; rate: number; cost: number; color?: string; tag?: string }[] } {
    let remaining = usage;
    const breakdown: { label: string; units: number; rate: number; cost: number; color?: string; tag?: string }[] = [];
    let total = 0;
    for (const slab of slabs) {
        if (remaining <= 0) break;
        const slabSize = slab.max === Infinity ? remaining : slab.max - slab.min + 1;
        const units = Math.min(remaining, slabSize);
        const cost = units * slab.rate;
        breakdown.push({ label: slab.label, units, rate: slab.rate, cost, color: slab.color, tag: slab.tag });
        total += cost;
        remaining -= units;
    }
    return { total, breakdown };
}


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

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAEDEWACalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["💡 Bill Calculator", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">⚡ DEWA Bill Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <BillTab />}
        {tab === 1 && <ReferenceTab />}
    </div>);
}

/* ── Bill Calculator Tab ── */
function BillTab() {
    const [propType, setPropType] = useState("residential");
    const [elecUsage, setElecUsage] = useState("1500");
    const [waterUsage, setWaterUsage] = useState("5000");
    const [annualRent, setAnnualRent] = useState("60000");
    const [includeHousing, setIncludeHousing] = useState(true);

    const result = useMemo(() => {
        const elec = parseFloat(elecUsage) || 0;
        const water = parseFloat(waterUsage) || 0;
        const rent = parseFloat(annualRent) || 0;
        if (elec <= 0 && water <= 0) return null;

        // Electricity
        let elecResult: { total: number; breakdown: { label: string; units: number; rate: number; cost: number; color?: string; tag?: string }[] };
        if (propType === "residential") {
            elecResult = calcSlabCost(elec, ELEC_SLABS_RES);
        } else {
            elecResult = { total: elec * ELEC_RATE_COMM, breakdown: [{ label: "Commercial rate", units: elec, rate: ELEC_RATE_COMM, cost: elec * ELEC_RATE_COMM }] };
        }

        // Water
        let waterResult: { total: number; breakdown: { label: string; units: number; rate: number; cost: number; color?: string; tag?: string }[] };
        if (propType === "residential") {
            waterResult = calcSlabCost(water, WATER_SLABS_RES);
        } else {
            waterResult = { total: water * WATER_RATE_COMM, breakdown: [{ label: "Commercial rate", units: water, rate: WATER_RATE_COMM, cost: water * WATER_RATE_COMM }] };
        }

        // Surcharges
        const fuelElec = elec * FUEL_SURCHARGE_ELEC;
        const fuelWater = water * FUEL_SURCHARGE_WATER;
        const sewerage = water * SEWERAGE_RATE;
        const housingFee = includeHousing && rent > 0 ? (rent * 0.05) / 12 : 0;

        const subtotal = elecResult.total + waterResult.total + fuelElec + fuelWater + sewerage + housingFee;
        const vat = subtotal * VAT_RATE;
        const total = subtotal + vat;

        return {
            elecResult, waterResult,
            fuelElec, fuelWater, sewerage, housingFee,
            subtotal, vat, total,
            elecUnits: elec, waterUnits: water,
        };
    }, [propType, elecUsage, waterUsage, annualRent, includeHousing]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ⚡ Enter your monthly electricity (kWh) and water (Imperial Gallons) usage from your DEWA bill or smart meter readings. Residential tariffs use progressive slab rates — the more you use, the higher the per-unit cost.
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[
                    { v: "residential", l: "🏠 Residential" },
                    { v: "commercial", l: "🏢 Commercial" },
                ].map((e) => (
                    <button key={e.v} onClick={() => setPropType(e.v)}
                        className={`calc-tab-btn${propType === e.v ? " calc-tab-btn--active" : ""}`}
                        style={{ fontSize: "0.85rem", padding: "6px 14px" }}>{e.l}</button>
                ))}
            </div>

            <InputField id="dewa-elec" label="Electricity Usage" value={elecUsage} onChange={setElecUsage} unit="kWh/month" min={0} placeholder="e.g. 1500" />
            <InputField id="dewa-water" label="Water Usage" value={waterUsage} onChange={setWaterUsage} unit="Imperial Gallons/month" min={0} placeholder="e.g. 5000" />

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input type="checkbox" id="dewa-housing" checked={includeHousing} onChange={e => setIncludeHousing(e.target.checked)} style={{ width: 16, height: 16 }} />
                    <label htmlFor="dewa-housing" style={{ fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Include Housing Fee (5% of annual rent ÷ 12)</label>
                </div>
                {includeHousing && <InputField id="dewa-rent" label="Annual Rent" value={annualRent} onChange={setAnnualRent} unit="AED/year" min={0} placeholder="e.g. 60000" />}
            </div>
        </div>

        {result && <div className="con-calc__results">
            <h4>Electricity Breakdown</h4>
            {result.elecResult.breakdown.map((s, i) => (
                <ResultRow key={i} label={`${s.tag ? `${s.tag}: ` : ""}${fmt(s.units, 0)} kWh × ${(s.rate * 100).toFixed(0)} fils`} value={fmtAED(s.cost)} />
            ))}
            <ResultRow label="Electricity Subtotal" value={fmtAED(result.elecResult.total)} />
            <ResultRow label="Fuel Surcharge (6 fils/kWh)" value={fmtAED(result.fuelElec)} />

            <h4>Water Breakdown</h4>
            {result.waterResult.breakdown.map((s, i) => (
                <ResultRow key={i} label={`${s.tag ? `${s.tag}: ` : ""}${fmt(s.units, 0)} IG × ${(s.rate * 1000).toFixed(1)} fils`} value={fmtAED(s.cost)} />
            ))}
            <ResultRow label="Water Subtotal" value={fmtAED(result.waterResult.total)} />
            <ResultRow label="Fuel Surcharge (0.5 fils/IG)" value={fmtAED(result.fuelWater)} />
            <ResultRow label="Sewerage Fee (1.5 fils/IG)" value={fmtAED(result.sewerage)} />

            <h4>Other Charges</h4>
            {result.housingFee > 0 && <ResultRow label="Housing Fee (5% of rent ÷ 12)" value={fmtAED(result.housingFee)} />}
            <ResultRow label="Subtotal (before VAT)" value={fmtAED(result.subtotal)} />
            <ResultRow label="VAT (5%)" value={fmtAED(result.vat)} />

            <div style={{ borderTop: "2px solid var(--border)", marginTop: "var(--s-3)", paddingTop: "var(--s-3)" }}>
                <ResultRow label="Estimated Monthly DEWA Bill" value={fmtAED(result.total)} highlight />
                {result.housingFee > 0 && <ResultRow label="Bill without Housing Fee" value={fmtAED(result.total - result.housingFee * 1.05)} />}
            </div>

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                💡 <strong>Note:</strong> Fuel surcharge rates are updated monthly by the Dubai Supreme Council of Energy. Actual rates may vary. Sewerage fee is 1.5 fils/IG for 2025 (rising to 2.0 in 2026, 2.8 in 2027). Housing fee does not apply to UAE Nationals.
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
        {/* Electricity Slabs */}
        <h4>DEWA Electricity Tariff — Residential</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Slab</th>
                    <th style={th}>Usage (kWh/month)</th>
                    <th style={th}>Rate (fils/kWh)</th>
                    <th style={th}>Rate (AED/kWh)</th>
                </tr></thead>
                <tbody>
                    {([
                        ["🟢 Green", "0–2,000", "23", "0.23"],
                        ["🟡 Yellow", "2,001–4,000", "28", "0.28"],
                        ["🟠 Orange", "4,001–6,000", "32", "0.32"],
                        ["🔴 Red", "6,001+", "38", "0.38"],
                    ] as string[][]).map(([slab, usage, fils, aed], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{slab}</td><td style={td}>{usage}</td><td style={{ ...td, fontWeight: 700 }}>{fils}</td><td style={td}>{aed}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Water Slabs */}
        <h4 style={{ marginTop: "var(--s-4)" }}>DEWA Water Tariff — Residential</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Slab</th>
                    <th style={th}>Usage (IG/month)</th>
                    <th style={th}>Rate (fils/IG)</th>
                    <th style={th}>Equivalent (AED/m³)</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Slab 1", "0–6,000", "3.5", "7.70"],
                        ["Slab 2", "6,001–12,000", "4.0", "8.80"],
                        ["Slab 3", "12,001+", "4.6", "10.12"],
                    ] as string[][]).map(([slab, usage, fils, m3], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{slab}</td><td style={td}>{usage}</td><td style={{ ...td, fontWeight: 700 }}>{fils}</td><td style={td}>{m3}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Fuel Surcharge & Other Charges */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Additional DEWA Charges</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Charge</th>
                    <th style={th}>Rate</th>
                    <th style={{ ...th, textAlign: "left" }}>Notes</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Fuel surcharge (electricity)", "6 fils/kWh (AED 0.060)", "Variable — updated monthly by Dubai Supreme Council of Energy"],
                        ["Fuel surcharge (water)", "0.5 fils/IG (AED 1.10/m³)", "Variable — reflects desalination fuel costs"],
                        ["Sewerage fee (2025)", "1.5 fils/IG (AED 0.33/m³)", "Phased increase: 2.0 fils in 2026, 2.8 fils in 2027"],
                        ["Housing fee", "5% of annual rent ÷ 12", "Dubai Municipality charge — UAE Nationals exempt"],
                        ["VAT", "5% of total bill", "Applied on all DEWA charges including housing fee"],
                    ] as string[][]).map(([charge, rate, note], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{charge}</td><td style={{ ...td, fontWeight: 700, color: "#b45309" }}>{rate}</td><td style={tl}>{note}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Sewerage Phase-in */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Sewerage Fee Schedule (2025–2027)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Year</th>
                    <th style={th}>Rate (fils/IG)</th>
                    <th style={th}>Rate (AED/m³)</th>
                    <th style={{ ...th, textAlign: "left" }}>Status</th>
                </tr></thead>
                <tbody>
                    {([
                        ["2025", "1.5", "0.33", "Current — effective Jan 2025"],
                        ["2026", "2.0", "0.44", "Scheduled increase"],
                        ["2027", "2.8", "0.62", "Final phase — full rate"],
                    ] as string[][]).map(([year, fils, m3, status], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 700 }}>{year}</td><td style={{ ...td, fontWeight: 700 }}>{fils}</td><td style={td}>{m3}</td><td style={tl}>{status}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Connection Deposits */}
        <h4 style={{ marginTop: "var(--s-4)" }}>DEWA Connection Deposits & Fees</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Fee</th>
                    <th style={th}>Apartment</th>
                    <th style={th}>Villa</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Security deposit (refundable)", "AED 2,000", "AED 4,000"],
                        ["Activation fee", "AED 130", "AED 130"],
                        ["Knowledge + Innovation fee", "AED 20", "AED 20"],
                        ["VAT (5%)", "~AED 108", "~AED 208"],
                        ["Total (approx.)", "AED 2,258", "AED 4,358"],
                    ] as string[][]).map(([fee, apt, villa], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: i === 4 ? 700 : 600 }}>{fee}</td><td style={{ ...td, fontWeight: i === 4 ? 700 : 400 }}>{apt}</td><td style={{ ...td, fontWeight: i === 4 ? 700 : 400 }}>{villa}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* DEWA vs ADDC */}
        <h4 style={{ marginTop: "var(--s-4)" }}>DEWA (Dubai) vs TAQA/ADDC (Abu Dhabi)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Aspect</th>
                    <th style={th}>Dubai (DEWA)</th>
                    <th style={th}>Abu Dhabi (TAQA)</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Electricity tariff", "23–38 fils/kWh (4 slabs)", "26.8–30.5 fils/kWh (Green/Red band)"],
                        ["Water tariff", "3.5–4.6 fils/IG", "7.84–10.41 AED/m³ (expat)"],
                        ["Fuel surcharge", "6 fils/kWh + 0.5 fils/IG", "No separate fuel surcharge"],
                        ["National subsidy", "Same rates for all", "Heavy subsidies for UAE Nationals"],
                        ["Sewerage fee", "1.5 fils/IG (2025)", "Included in tariff"],
                        ["Housing fee", "5% of rent (via DEWA bill)", "5% of rent (via municipality)"],
                        ["Meter service charge", "Included", "AED 7.84/month (expat)"],
                    ] as string[][]).map(([aspect, dewa, addc], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{aspect}</td><td style={td}>{dewa}</td><td style={td}>{addc}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}
