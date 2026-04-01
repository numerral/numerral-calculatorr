"use client";
import { useState, useMemo } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

/* ─── ASSET TYPE DATABASE ─── */
type AssetType = "equity_listed" | "equity_unlisted" | "equity_mf" | "debt_mf" | "property" | "gold" | "crypto" | "bonds" | "other";
type AssetMeta = {
    label: string; holdingLTCG: number; // months
    stcgRate: number; ltcgRate: number; ltcgExemption: number;
    sttPaid?: boolean; indexation?: "none" | "optional" | "required";
    section_stcg: string; section_ltcg: string; notes?: string;
};

const ASSETS: Record<AssetType, AssetMeta> = {
    equity_listed: {
        label: "Listed Equity Shares", holdingLTCG: 12,
        stcgRate: 20, ltcgRate: 12.5, ltcgExemption: 125000,
        sttPaid: true, indexation: "none",
        section_stcg: "Section 111A (now 196)", section_ltcg: "Section 112A (now 198)",
        notes: "STT must be paid on both buy and sell. ₹1.25 lakh LTCG exempt per year. Grandfathering applies for shares bought before 31-Jan-2018."
    },
    equity_mf: {
        label: "Equity Mutual Funds / ETFs", holdingLTCG: 12,
        stcgRate: 20, ltcgRate: 12.5, ltcgExemption: 125000,
        sttPaid: true, indexation: "none",
        section_stcg: "Section 111A (now 196)", section_ltcg: "Section 112A (now 198)",
        notes: "Equity-oriented MF (≥65% equity) and ETFs. Same treatment as listed equity."
    },
    equity_unlisted: {
        label: "Unlisted Equity Shares", holdingLTCG: 24,
        stcgRate: -1, ltcgRate: 12.5, ltcgExemption: 0,
        indexation: "none",
        section_stcg: "Slab Rate", section_ltcg: "Section 112 (now 197)",
        notes: "STCG taxed at your income tax slab rate. No ₹1.25L exemption."
    },
    debt_mf: {
        label: "Debt Mutual Funds", holdingLTCG: 24,
        stcgRate: -1, ltcgRate: -1, ltcgExemption: 0,
        indexation: "none",
        section_stcg: "Slab Rate", section_ltcg: "Slab Rate",
        notes: "Since April 2023, debt MF units (acquired on/after 01-Apr-2023) are taxed at slab rates regardless of holding period. No LTCG benefit."
    },
    property: {
        label: "Real Estate (Land / House)", holdingLTCG: 24,
        stcgRate: -1, ltcgRate: 12.5, ltcgExemption: 0,
        indexation: "optional",
        section_stcg: "Slab Rate", section_ltcg: "Section 112 (now 197)",
        notes: "For property bought before 23-Jul-2024: choice between 12.5% without indexation OR 20% with indexation (whichever is lower). Section 54/54EC/54F exemptions available."
    },
    gold: {
        label: "Gold / Jewellery", holdingLTCG: 24,
        stcgRate: -1, ltcgRate: 12.5, ltcgExemption: 0,
        indexation: "none",
        section_stcg: "Slab Rate", section_ltcg: "Section 112 (now 197)",
        notes: "Includes physical gold, gold ETFs, SGBs. Sovereign Gold Bonds (SGBs) held to maturity are fully tax-free."
    },
    crypto: {
        label: "Crypto / VDA / NFTs", holdingLTCG: 0,
        stcgRate: 30, ltcgRate: 30, ltcgExemption: 0,
        indexation: "none",
        section_stcg: "Section 115BBH (now 194)", section_ltcg: "Section 115BBH (now 194)",
        notes: "Flat 30% tax regardless of holding period. No deduction except cost of acquisition. 1% TDS on transfers above ₹50,000 (₹10,000 for specified persons). No set-off of losses."
    },
    bonds: {
        label: "Bonds / Debentures", holdingLTCG: 12,
        stcgRate: -1, ltcgRate: 12.5, ltcgExemption: 0,
        indexation: "none",
        section_stcg: "Slab Rate", section_ltcg: "Section 112 (now 197)",
        notes: "Listed bonds: 12 months holding for LTCG. Tax-free bonds are exempt from capital gains on maturity."
    },
    other: {
        label: "Other Capital Assets", holdingLTCG: 24,
        stcgRate: -1, ltcgRate: 12.5, ltcgExemption: 0,
        indexation: "none",
        section_stcg: "Slab Rate", section_ltcg: "Section 112 (now 197)",
        notes: "Includes art, collectibles, etc. STCG at slab rate, LTCG at 12.5%."
    },
};

const CII_TABLE: Record<string, number> = {
    "2001-02": 100, "2002-03": 105, "2003-04": 109, "2004-05": 113,
    "2005-06": 117, "2006-07": 122, "2007-08": 129, "2008-09": 137,
    "2009-10": 148, "2010-11": 167, "2011-12": 184, "2012-13": 200,
    "2013-14": 220, "2014-15": 240, "2015-16": 254, "2016-17": 264,
    "2017-18": 272, "2018-19": 280, "2019-20": 289, "2020-21": 301,
    "2021-22": 317, "2022-23": 331, "2023-24": 348, "2024-25": 363,
    "2025-26": 377,
};

/* ─── Shared Input ─── */
function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "yr" ? `${value} months` : fmt(value);
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

type Mode = "calculator" | "comparison" | "exemption" | "harvest";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "calculator", icon: "🧮", label: "CG Tax Calculator" },
    { key: "comparison", icon: "📊", label: "Asset Tax Comparison" },
    { key: "exemption", icon: "🏠", label: "Section 54/54EC/54F" },
    { key: "harvest", icon: "🌾", label: "Tax Loss Harvesting" },
];

/* ═══════ MODE 1: CAPITAL GAINS TAX CALCULATOR ═══════ */
function CalculatorMode() {
    const [assetType, setAssetType] = useState<AssetType>("equity_listed");
    const [buyValue, setBuyValue] = useState(500000);
    const [sellValue, setSellValue] = useState(900000);
    const [holdingMonths, setHoldingMonths] = useState(18);
    const [expenses, setExpenses] = useState(5000);
    const [slabRate, setSlabRate] = useState(30);

    const asset = ASSETS[assetType];
    const result = useMemo(() => {
        const totalGain = sellValue - buyValue - expenses;
        const isLTCG = asset.holdingLTCG === 0 ? false : holdingMonths > asset.holdingLTCG;
        const isGain = totalGain > 0;

        let taxRate: number;
        let taxableGain = totalGain;
        let exemption = 0;

        if (isGain) {
            if (isLTCG) {
                taxRate = asset.ltcgRate === -1 ? slabRate : asset.ltcgRate;
                exemption = asset.ltcgExemption;
                taxableGain = Math.max(0, totalGain - exemption);
            } else {
                taxRate = asset.stcgRate === -1 ? slabRate : asset.stcgRate;
            }
        } else {
            taxRate = 0;
            taxableGain = 0;
        }

        const tax = taxableGain * (taxRate / 100);
        const cess = tax * 0.04;
        const totalTax = tax + cess;
        const netProfit = totalGain - totalTax;

        return {
            totalGain, isLTCG, isGain, taxRate, taxableGain, exemption,
            tax, cess, totalTax, netProfit,
            section: isLTCG ? asset.section_ltcg : asset.section_stcg,
            gainType: asset.holdingLTCG === 0 ? "Flat Rate (VDA)" : isLTCG ? "Long-Term (LTCG)" : "Short-Term (STCG)",
        };
    }, [assetType, buyValue, sellValue, holdingMonths, expenses, slabRate]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>Asset Type</label>
                <select value={assetType} onChange={e => setAssetType(e.target.value as AssetType)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.88rem", background: "var(--n-surface)", color: "var(--n-text)" }}>
                    {Object.entries(ASSETS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
            </div>
            <InputRow label="Purchase Value" value={buyValue} set={setBuyValue} max={5_00_00_000} step={10000} min={10000} hint="Total cost of acquisition" />
            <InputRow label="Sale Value" value={sellValue} set={setSellValue} max={5_00_00_000} step={10000} min={10000} hint="Amount received on sale" />
            <InputRow label="Holding Period" value={holdingMonths} set={setHoldingMonths} max={120} step={1} min={1} suffix="yr"
                hint={`LTCG threshold for ${asset.label}: ${asset.holdingLTCG === 0 ? 'N/A (flat rate)' : `>${asset.holdingLTCG} months`}`} />
            <InputRow label="Transfer Expenses" value={expenses} set={setExpenses} max={5_00_000} step={1000} hint="Brokerage, stamp duty, legal fees" />

            {(asset.stcgRate === -1 || asset.ltcgRate === -1) && (
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Your Income Tax Slab Rate</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        {[5, 10, 15, 20, 30].map(b => (
                            <button key={b} onClick={() => setSlabRate(b)} style={{
                                flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                                border: slabRate === b ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                                background: slabRate === b ? "var(--n-primary-light)" : "var(--n-surface)",
                                fontWeight: slabRate === b ? 700 : 500, color: slabRate === b ? "var(--n-primary)" : "var(--n-text)",
                            }}>{b}%</button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: result.isGain ? "var(--n-primary)" : "#dc2626", textTransform: "uppercase", letterSpacing: 1 }}>
                        {result.gainType}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: result.isGain ? undefined : "#dc2626" }}>
                        {result.isGain ? fmt(result.totalGain) : fmt(result.totalGain)}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                        {result.isGain ? "Capital Gain" : "Capital Loss (No tax payable)"}
                    </div>
                </div>

                {result.isGain && (
                    <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                        <tbody>
                            {[
                                ["Total Capital Gain", fmt(result.totalGain), undefined],
                                ...(result.exemption > 0 ? [["Annual Exemption (₹1.25L)", `−${fmt(result.exemption)}`, "#16a34a"]] : []),
                                ["Taxable Capital Gain", fmt(result.taxableGain), "var(--n-primary)"],
                                ["Tax Rate", pct(result.taxRate), undefined],
                                ["Tax on Capital Gain", fmt(result.tax), undefined],
                                ["Health & Education Cess (4%)", fmt(result.cess), undefined],
                                ["Total Tax Payable", fmt(result.totalTax), "#dc2626"],
                                ["Net Profit After Tax", fmt(result.netProfit), "#16a34a"],
                            ].map(([l, v, c], i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                    <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700, color: c as string || undefined }}>{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{ background: "var(--n-primary-light)", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                    <strong style={{ color: "var(--n-primary)" }}>📋 Applicable Section:</strong>{" "}
                    <span style={{ color: "var(--n-primary)" }}>{result.section}</span>
                </div>

                {asset.notes && (
                    <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 8, padding: "6px 10px", background: "var(--n-surface)", borderRadius: 6 }}>
                        <strong>Note:</strong> {asset.notes}
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 2: ASSET TAX COMPARISON ═══════ */
function ComparisonMode() {
    const [gain, setGain] = useState(500000);
    const [slabRate, setSlabRate] = useState(30);

    const comparison = useMemo(() => {
        const assets: { label: string; stcgRate: string; ltcgRate: string; stcgTax: number; ltcgTax: number; holding: string; exempt: string }[] = [
            {
                label: "Listed Equity / ETF", stcgRate: "20%", ltcgRate: "12.5%",
                stcgTax: gain * 0.20 * 1.04, ltcgTax: Math.max(0, gain - 125000) * 0.125 * 1.04,
                holding: ">12 months", exempt: "₹1.25L/yr"
            },
            {
                label: "Equity Mutual Funds", stcgRate: "20%", ltcgRate: "12.5%",
                stcgTax: gain * 0.20 * 1.04, ltcgTax: Math.max(0, gain - 125000) * 0.125 * 1.04,
                holding: ">12 months", exempt: "₹1.25L/yr"
            },
            {
                label: "Debt Mutual Funds", stcgRate: `${slabRate}%`, ltcgRate: `${slabRate}%`,
                stcgTax: gain * (slabRate / 100) * 1.04, ltcgTax: gain * (slabRate / 100) * 1.04,
                holding: "N/A (slab)", exempt: "None"
            },
            {
                label: "Real Estate", stcgRate: `${slabRate}%`, ltcgRate: "12.5%",
                stcgTax: gain * (slabRate / 100) * 1.04, ltcgTax: gain * 0.125 * 1.04,
                holding: ">24 months", exempt: "Sec 54/54EC/54F"
            },
            {
                label: "Gold / Jewellery", stcgRate: `${slabRate}%`, ltcgRate: "12.5%",
                stcgTax: gain * (slabRate / 100) * 1.04, ltcgTax: gain * 0.125 * 1.04,
                holding: ">24 months", exempt: "None"
            },
            {
                label: "Crypto / VDA", stcgRate: "30%", ltcgRate: "30%",
                stcgTax: gain * 0.30 * 1.04, ltcgTax: gain * 0.30 * 1.04,
                holding: "N/A (flat)", exempt: "None"
            },
            {
                label: "Unlisted Shares", stcgRate: `${slabRate}%`, ltcgRate: "12.5%",
                stcgTax: gain * (slabRate / 100) * 1.04, ltcgTax: gain * 0.125 * 1.04,
                holding: ">24 months", exempt: "None"
            },
        ];
        return assets;
    }, [gain, slabRate]);

    return (
        <>
            <InputRow label="Capital Gain Amount" value={gain} set={setGain} max={1_00_00_000} step={10000} min={50000}
                hint="Compare how same gain is taxed across different asset classes" />
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Your Slab Rate (for slab-rate assets)</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {[5, 10, 15, 20, 30].map(b => (
                        <button key={b} onClick={() => setSlabRate(b)} style={{
                            flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: slabRate === b ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: slabRate === b ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: slabRate === b ? 700 : 500, color: slabRate === b ? "var(--n-primary)" : "var(--n-text)",
                        }}>{b}%</button>
                    ))}
                </div>
            </div>
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    📊 Tax on {fmt(gain)} Capital Gain — All Asset Classes
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "6px 3px" }}>Asset</th>
                            <th style={{ textAlign: "center", padding: "6px 3px" }}>STCG Rate</th>
                            <th style={{ textAlign: "right", padding: "6px 3px" }}>STCG Tax</th>
                            <th style={{ textAlign: "center", padding: "6px 3px" }}>LTCG Rate</th>
                            <th style={{ textAlign: "right", padding: "6px 3px" }}>LTCG Tax</th>
                            <th style={{ textAlign: "center", padding: "6px 3px" }}>Holding</th>
                        </tr></thead>
                        <tbody>
                            {comparison.map((c, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: c.label === "Crypto / VDA" ? "#fef2f2" : c.ltcgTax === Math.min(...comparison.map(x => x.ltcgTax)) ? "#f0fdf4" : "" }}>
                                    <td style={{ padding: "6px 3px", fontWeight: 600 }}>{c.label}</td>
                                    <td style={{ textAlign: "center", padding: "6px 3px" }}>{c.stcgRate}</td>
                                    <td style={{ textAlign: "right", padding: "6px 3px" }}>{fmt(c.stcgTax)}</td>
                                    <td style={{ textAlign: "center", padding: "6px 3px" }}>{c.ltcgRate}</td>
                                    <td style={{ textAlign: "right", padding: "6px 3px", fontWeight: 700 }}>{fmt(c.ltcgTax)}</td>
                                    <td style={{ textAlign: "center", padding: "6px 3px", fontSize: "0.7rem" }}>{c.holding}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 3: SECTION 54/54EC/54F EXEMPTION ═══════ */
function ExemptionMode() {
    const [ltcg, setLtcg] = useState(3000000);
    const [exemptionType, setExemptionType] = useState<"54" | "54EC" | "54F">("54");
    const [reinvestment, setReinvestment] = useState(2000000);

    const result = useMemo(() => {
        let exemptAmount = 0;
        let maxLimit = 0;
        let timeLimit = "";
        let investIn = "";

        if (exemptionType === "54") {
            maxLimit = 10_00_00_000; // ₹10 crore cap
            exemptAmount = Math.min(reinvestment, ltcg, maxLimit);
            timeLimit = "Buy: 1 year before or 2 years after sale. Construct: 3 years after sale.";
            investIn = "One new residential house property in India";
        } else if (exemptionType === "54EC") {
            maxLimit = 50_00_000; // ₹50 lakh cap
            exemptAmount = Math.min(reinvestment, ltcg, maxLimit);
            timeLimit = "Within 6 months of sale";
            investIn = "NHAI / REC / PFC / IRFC bonds (5-year lock-in)";
        } else {
            maxLimit = 10_00_00_000;
            const netConsideration = ltcg + reinvestment; // simplified
            exemptAmount = Math.min(reinvestment, ltcg, maxLimit);
            timeLimit = "Buy: 1 year before or 2 years after sale. Construct: 3 years after.";
            investIn = "One new residential house property (from sale of any non-residential LTCG asset)";
        }

        const taxableGain = Math.max(0, ltcg - exemptAmount);
        const tax = taxableGain * 0.125 * 1.04;
        const taxSaved = exemptAmount * 0.125 * 1.04;

        return { exemptAmount, taxableGain, tax, taxSaved, maxLimit, timeLimit, investIn };
    }, [ltcg, exemptionType, reinvestment]);

    return (
        <>
            <InputRow label="Long-Term Capital Gain" value={ltcg} set={setLtcg} max={10_00_00_000} step={100000} min={100000} />
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Exemption Section</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {([["54", "Sec 54 (House)"], ["54EC", "Sec 54EC (Bonds)"], ["54F", "Sec 54F (Other)"]] as const).map(([k, l]) => (
                        <button key={k} onClick={() => setExemptionType(k as "54" | "54EC" | "54F")} style={{
                            flex: 1, padding: "10px 6px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: exemptionType === k ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: exemptionType === k ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: exemptionType === k ? 700 : 500, color: exemptionType === k ? "var(--n-primary)" : "var(--n-text)",
                        }}>{l}</button>
                    ))}
                </div>
            </div>
            <InputRow label="Amount Reinvested" value={reinvestment} set={setReinvestment}
                max={exemptionType === "54EC" ? 50_00_000 : 10_00_00_000} step={100000} min={0}
                hint={`Max limit: ${fmt(result.maxLimit)}`} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    🏠 Section {exemptionType} Exemption Analysis
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                    {[
                        ["LTCG", fmt(ltcg)],
                        ["Exempt Amount", fmt(result.exemptAmount)],
                        ["Taxable After Exemption", fmt(result.taxableGain)],
                        ["Tax Saved", fmt(result.taxSaved)],
                    ].map(([l, v], i) => (
                        <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: i === 3 ? "#16a34a" : i === 2 ? "var(--n-primary)" : undefined }}>{v}</div>
                        </div>
                    ))}
                </div>
                <div style={{ fontSize: "0.78rem", marginBottom: 8 }}>
                    <strong>📌 Invest In:</strong> {result.investIn}
                </div>
                <div style={{ fontSize: "0.78rem", marginBottom: 8 }}>
                    <strong>⏰ Time Limit:</strong> {result.timeLimit}
                </div>
                {result.tax > 0 && (
                    <div style={{ background: "#fef2f2", borderRadius: 8, padding: "8px 12px", fontSize: "0.78rem" }}>
                        <strong style={{ color: "#dc2626" }}>Tax Still Payable:</strong>{" "}
                        <span style={{ color: "#7f1d1d" }}>{fmt(result.tax)} on remaining taxable gain of {fmt(result.taxableGain)} (12.5% + 4% cess)</span>
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 4: TAX LOSS HARVESTING ═══════ */
function HarvestMode() {
    const [gains, setGains] = useState(200000);
    const [losses, setLosses] = useState(80000);
    const [isLTCG, setIsLTCG] = useState(true);

    const result = useMemo(() => {
        const exemption = isLTCG ? 125000 : 0;
        const netGain = Math.max(0, gains - losses);
        const taxableGain = Math.max(0, netGain - exemption);
        const taxRate = isLTCG ? 12.5 : 20;
        const tax = taxableGain * (taxRate / 100) * 1.04;
        const taxWithoutHarvest = Math.max(0, gains - exemption) * (taxRate / 100) * 1.04;
        const saving = taxWithoutHarvest - tax;
        const carryForward = losses > gains ? losses - gains : 0;

        return { netGain, taxableGain, tax, taxRate, saving, carryForward, taxWithoutHarvest, exemption };
    }, [gains, losses, isLTCG]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Gain Type</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {([true, false] as const).map(lt => (
                        <button key={String(lt)} onClick={() => setIsLTCG(lt)} style={{
                            flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.85rem", cursor: "pointer",
                            border: isLTCG === lt ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: isLTCG === lt ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: isLTCG === lt ? 700 : 500, color: isLTCG === lt ? "var(--n-primary)" : "var(--n-text)",
                        }}>{lt ? "LTCG (12.5%)" : "STCG (20%)"}</button>
                    ))}
                </div>
            </div>
            <InputRow label="Total Realised Gains (this FY)" value={gains} set={setGains} max={50_00_000} step={10000} min={0} />
            <InputRow label="Losses to Harvest" value={losses} set={setLosses} max={50_00_000} step={10000} min={0}
                hint="Sell loss-making holdings to offset gains" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    🌾 Tax Loss Harvesting — {isLTCG ? "LTCG" : "STCG"} Equity
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Total Gains", fmt(gains), undefined],
                            ["Harvested Losses", `−${fmt(losses)}`, "#dc2626"],
                            ["Net Gain", fmt(result.netGain), undefined],
                            ...(result.exemption > 0 ? [["₹1.25L Exemption", `−${fmt(result.exemption)}`, "#16a34a"]] : []),
                            ["Taxable Gain", fmt(result.taxableGain), "var(--n-primary)"],
                            ["Tax Rate", `${result.taxRate}% + 4% cess`, undefined],
                            ["Tax Payable (with harvesting)", fmt(result.tax), "#dc2626"],
                            ["Tax WITHOUT harvesting", fmt(result.taxWithoutHarvest), "var(--n-text-muted)"],
                        ].map(([l, v, c], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700, color: c as string || undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "10px 12px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                    <strong style={{ color: "#16a34a" }}>💰 Tax Saved by Harvesting: {fmt(result.saving)}</strong>
                </div>
                {result.carryForward > 0 && (
                    <div style={{ background: "var(--n-primary-light)", borderRadius: 8, padding: "8px 12px", marginTop: 8, fontSize: "0.78rem" }}>
                        <strong style={{ color: "var(--n-primary)" }}>📋 Carry Forward:</strong>{" "}
                        <span style={{ color: "var(--n-primary)" }}>Excess loss of {fmt(result.carryForward)} can be carried forward for up to 8 assessment years to offset future gains (must file ITR before due date).</span>
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function CapitalGainsTaxCalculatorCore() {
    const [mode, setMode] = useState<Mode>("calculator");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>📈 Capital Gains Tax Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>LTCG & STCG • Equity/MF/Property/Gold/Crypto • Section 54/54EC/54F • Tax Loss Harvesting</div>
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
                {mode === "comparison" && <ComparisonMode />}
                {mode === "exemption" && <ExemptionMode />}
                {mode === "harvest" && <HarvestMode />}
            </div>
        </div>
    );
}
