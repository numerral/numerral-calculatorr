"use client";
import { useState, useMemo } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
};
const pct = (n: number) => `${n.toFixed(2)}%`;
const CI = (P: number, r: number, n: number, t: number) =>
    P * Math.pow(1 + r / (100 * n), n * t);

type Mode = "maturity" | "compare" | "tds" | "alternatives";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "maturity", icon: "💰", label: "FD Maturity" },
    { key: "compare", icon: "🏦", label: "Bank Comparison" },
    { key: "tds", icon: "📋", label: "TDS & Tax" },
    { key: "alternatives", icon: "📊", label: "FD vs Alternatives" },
];

const FREQ: { label: string; n: number }[] = [
    { label: "Monthly", n: 12 },
    { label: "Quarterly", n: 4 },
    { label: "Half-Yearly", n: 2 },
    { label: "Annually", n: 1 },
];

/* ─── Sub: Slider Row ─── */
function SliderRow({ label, value, set, min, max, step, suffix }: {
    label: string; value: number; set: (v: number) => void;
    min: number; max: number; step: number; suffix?: string;
}) {
    return (
        <div style={{ marginBottom: "var(--s-4)" }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginBottom: 4, fontSize: "0.92rem" }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)" }}>
                    {suffix === "%" ? `${value}%` : suffix === "yrs" ? `${value} yrs` : suffix === "num" ? `${value}` : fmt(value)}
                </span>
            </label>
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--n-text-muted)" }}>
                <span>{suffix === "%" ? `${min}%` : suffix === "yrs" ? `${min} yrs` : fmt(min)}</span>
                <span>{suffix === "%" ? `${max}%` : suffix === "yrs" ? `${max} yrs` : fmt(max)}</span>
            </div>
        </div>
    );
}

/* ═══════════ MODE 1: FD MATURITY CALCULATOR ═══════════ */
function MaturityMode() {
    const [principal, setPrincipal] = useState(5_00_000);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(5);
    const [months, setMonths] = useState(0);
    const [freqIdx, setFreqIdx] = useState(1); // quarterly
    const [isSenior, setIsSenior] = useState(false);
    const [showTable, setShowTable] = useState(false);

    const effectiveRate = isSenior ? rate + 0.5 : rate;
    const n = FREQ[freqIdx].n;
    const tenure = years + months / 12;
    const maturity = CI(principal, effectiveRate, n, tenure);
    const interest = maturity - principal;
    const ear = (Math.pow(1 + effectiveRate / (100 * n), n) - 1) * 100;

    /* Non-cumulative payouts */
    const quarterlyPayout = (principal * effectiveRate) / (100 * 4);
    const monthlyPayout = (principal * effectiveRate) / (100 * 12);

    const yearlyData = useMemo(() => {
        const rows: { year: number; opening: number; interestEarned: number; closing: number }[] = [];
        const fullYears = Math.ceil(tenure);
        for (let y = 1; y <= fullYears; y++) {
            const t = Math.min(y, tenure);
            const tPrev = Math.min(y - 1, tenure);
            const opening = CI(principal, effectiveRate, n, tPrev);
            const closing = CI(principal, effectiveRate, n, t);
            rows.push({ year: y, opening, interestEarned: closing - opening, closing });
        }
        return rows;
    }, [principal, effectiveRate, n, tenure]);

    /* visual bar */
    const principalPct = (principal / maturity) * 100;
    const interestPct = 100 - principalPct;

    return (
        <>
            <SliderRow label="Deposit Amount" value={principal} set={setPrincipal} min={1000} max={10_00_00_000} step={1000} />
            <SliderRow label="Interest Rate (p.a.)" value={rate} set={setRate} min={1} max={12} step={0.1} suffix="%" />
            <SliderRow label="Tenure — Years" value={years} set={setYears} min={0} max={10} step={1} suffix="yrs" />
            <SliderRow label="Tenure — Additional Months" value={months} set={v => setMonths(v)} min={0} max={11} step={1} suffix="num" />

            {/* Compounding Frequency */}
            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ fontWeight: 600, fontSize: "0.92rem", display: "block", marginBottom: 8 }}>Compounding Frequency</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {FREQ.map((f, i) => (
                        <button key={i} onClick={() => setFreqIdx(i)} style={{
                            padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: i === freqIdx ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: i === freqIdx ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: i === freqIdx ? 700 : 500,
                            color: i === freqIdx ? "var(--n-primary)" : "var(--n-text)",
                        }}>{f.label}</button>
                    ))}
                </div>
            </div>

            {/* Senior Citizen toggle */}
            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "0.92rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={isSenior} onChange={e => setIsSenior(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: "var(--n-primary)" }} />
                    Senior Citizen (60+) — Extra 0.50% Rate
                </label>
            </div>

            {/* Results */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    Maturity Details — {FREQ[freqIdx].label} Compounding{isSenior ? " (Senior Citizen)" : ""}
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-text)" }}>{fmt(maturity)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--n-text-muted)", marginTop: 4 }}>Maturity Amount after {years > 0 ? `${years} yr${years > 1 ? "s" : ""}` : ""}{months > 0 ? ` ${months} mo` : ""}</div>
                </div>

                {/* Visual bar */}
                <div style={{ marginTop: "var(--s-4)", borderRadius: 8, overflow: "hidden", height: 28, display: "flex", fontSize: "0.72rem", fontWeight: 700 }}>
                    <div style={{ width: `${principalPct}%`, background: "var(--n-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", minWidth: 40 }}>
                        {principalPct > 15 ? `Principal ${principalPct.toFixed(0)}%` : ""}
                    </div>
                    <div style={{ width: `${interestPct}%`, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", minWidth: 40 }}>
                        {interestPct > 15 ? `Interest ${interestPct.toFixed(0)}%` : ""}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-4)", textAlign: "center" }}>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Principal</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{fmt(principal)}</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Interest Earned</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#16a34a" }}>+{fmt(interest)}</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Effective Rate (EAR)</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--n-primary)" }}>{pct(ear)}</div>
                    </div>
                </div>

                {/* Non-cumulative payout info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Monthly Payout (Non-Cumulative)</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{fmt(monthlyPayout)}</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Quarterly Payout (Non-Cumulative)</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{fmt(quarterlyPayout)}</div>
                    </div>
                </div>

                {/* Formula */}
                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Formula:</strong> A = P × (1 + r/n)<sup>n×t</sup> = {fmt(principal)} × (1 + {effectiveRate}%/{n})<sup>{n}×{tenure.toFixed(2)}</sup> = <strong>{fmt(maturity)}</strong>
                </div>

                {/* Year-by-year breakdown */}
                <button onClick={() => setShowTable(!showTable)} style={{
                    marginTop: "var(--s-3)", width: "100%", padding: "10px", border: "1px solid var(--n-border)",
                    borderRadius: 8, background: "var(--n-surface)", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem",
                    color: "var(--n-text)",
                }}>{showTable ? "▲ Hide" : "▼ Show"} Year-by-Year Breakdown</button>

                {showTable && (
                    <div style={{ marginTop: "var(--s-3)", overflowX: "auto" }}>
                        <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                                <th style={{ textAlign: "left", padding: "8px 4px" }}>Year</th>
                                <th style={{ textAlign: "right", padding: "8px 4px" }}>Opening Balance</th>
                                <th style={{ textAlign: "right", padding: "8px 4px" }}>Interest Earned</th>
                                <th style={{ textAlign: "right", padding: "8px 4px" }}>Closing Balance</th>
                            </tr></thead>
                            <tbody>
                                {yearlyData.map(r => (
                                    <tr key={r.year} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                        <td style={{ padding: "6px 4px" }}>{r.year}</td>
                                        <td style={{ textAlign: "right", padding: "6px 4px" }}>{fmt(r.opening)}</td>
                                        <td style={{ textAlign: "right", padding: "6px 4px", color: "#16a34a" }}>+{fmt(r.interestEarned)}</td>
                                        <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{fmt(r.closing)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════════ MODE 2: BANK RATE COMPARISON ═══════════ */
const BANK_RATES = [
    { name: "SBI", y1: 6.80, y3: 6.75, y5: 6.50, sc: 7.00 },
    { name: "HDFC Bank", y1: 6.60, y3: 7.00, y5: 7.00, sc: 7.50 },
    { name: "ICICI Bank", y1: 6.70, y3: 7.00, y5: 7.00, sc: 7.50 },
    { name: "Axis Bank", y1: 6.70, y3: 7.10, y5: 7.00, sc: 7.75 },
    { name: "Kotak Mahindra", y1: 6.50, y3: 7.10, y5: 6.70, sc: 7.20 },
    { name: "Bank of Baroda", y1: 6.85, y3: 7.05, y5: 6.50, sc: 7.15 },
    { name: "PNB", y1: 6.80, y3: 7.00, y5: 6.50, sc: 7.00 },
    { name: "Canara Bank", y1: 6.85, y3: 7.00, y5: 6.70, sc: 7.20 },
    { name: "IDBI Bank", y1: 6.75, y3: 7.05, y5: 6.50, sc: 7.10 },
    { name: "Post Office TD", y1: 6.90, y3: 7.10, y5: 7.50, sc: 7.50 },
    { name: "AU Small Finance", y1: 7.25, y3: 7.50, y5: 7.25, sc: 7.75 },
    { name: "Ujjivan SFB", y1: 7.40, y3: 7.90, y5: 7.60, sc: 8.10 },
];

function BankCompareMode() {
    const [principal, setPrincipal] = useState(5_00_000);
    const [tenureIdx, setTenureIdx] = useState(2); // 5 years
    const [isSenior, setIsSenior] = useState(false);
    const tenureOptions = [
        { label: "1 Year", years: 1, key: "y1" as const },
        { label: "3 Years", years: 3, key: "y3" as const },
        { label: "5 Years", years: 5, key: "y5" as const },
    ];
    const sel = tenureOptions[tenureIdx];

    const computed = BANK_RATES.map(b => {
        const rate = isSenior ? b.sc : b[sel.key];
        const maturity = CI(principal, rate, 4, sel.years);
        const interest = maturity - principal;
        return { ...b, rate, maturity, interest };
    }).sort((a, b) => b.interest - a.interest);

    return (
        <>
            <SliderRow label="Investment Amount" value={principal} set={setPrincipal} min={10_000} max={5_00_00_000} step={10_000} />

            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ fontWeight: 600, fontSize: "0.92rem", display: "block", marginBottom: 8 }}>Select Tenure</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {tenureOptions.map((t, i) => (
                        <button key={i} onClick={() => setTenureIdx(i)} style={{
                            padding: "8px 18px", borderRadius: 8, fontSize: "0.85rem", cursor: "pointer",
                            border: i === tenureIdx ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: i === tenureIdx ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: i === tenureIdx ? 700 : 500,
                            color: i === tenureIdx ? "var(--n-primary)" : "var(--n-text)",
                        }}>{t.label}</button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "0.92rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={isSenior} onChange={e => setIsSenior(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: "var(--n-primary)" }} />
                    Senior Citizen Rates
                </label>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    {sel.label} FD — {fmt(principal)} Investment{isSenior ? " (Senior Citizen)" : ""}
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "8px 4px" }}>#</th>
                            <th style={{ textAlign: "left", padding: "8px 4px" }}>Bank</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Rate (p.a.)</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Maturity</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Interest Earned</th>
                        </tr></thead>
                        <tbody>
                            {computed.map((b, i) => (
                                <tr key={i} style={{
                                    borderBottom: "1px solid var(--n-border)",
                                    background: i === 0 ? "var(--n-primary-light)" : "transparent",
                                }}>
                                    <td style={{ padding: "8px 4px", fontWeight: i === 0 ? 700 : 400 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</td>
                                    <td style={{ padding: "8px 4px", fontWeight: i === 0 ? 700 : 500 }}>{b.name}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600, color: "var(--n-primary)" }}>{b.rate}%</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600 }}>{fmt(b.maturity)}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", color: "#16a34a", fontWeight: 600 }}>+{fmt(b.interest)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {computed.length >= 2 && (
                    <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-success-light)", borderRadius: 8, fontSize: "0.82rem" }}>
                        <strong>💡 Best Pick:</strong> {computed[0].name} at {computed[0].rate}% gives you <strong>{fmt(computed[0].interest)}</strong> in interest — <strong>{fmt(computed[0].interest - computed[computed.length - 1].interest)} more</strong> than the lowest ({computed[computed.length - 1].name}).
                    </div>
                )}

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Disclaimer:</strong> Rates are indicative as of March 2026 for domestic retail deposits below ₹3 Cr. Quarterly compounding assumed. Senior Citizen rates shown for general category (60+). Verify latest rates on bank websites before investing.
                </div>
            </div>
        </>
    );
}

/* ═══════════ MODE 3: TDS & TAX IMPACT ═══════════ */
const TAX_SLABS = [
    { label: "No Tax (Below ₹7L)", rate: 0 },
    { label: "5% Slab", rate: 5 },
    { label: "10% Slab", rate: 10 },
    { label: "15% Slab", rate: 15 },
    { label: "20% Slab", rate: 20 },
    { label: "30% Slab", rate: 30 },
];

function TDSMode() {
    const [principal, setPrincipal] = useState(10_00_000);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(3);
    const [slabIdx, setSlabIdx] = useState(5); // 30%
    const [isSenior, setIsSenior] = useState(false);
    const [hasPAN, setHasPAN] = useState(true);

    const effectiveRate = isSenior ? rate + 0.5 : rate;
    const maturity = CI(principal, effectiveRate, 4, years);
    const grossInterest = maturity - principal;
    const annualInterest = grossInterest / years;

    const tdsThreshold = isSenior ? 1_00_000 : 50_000;
    const tdsApplicable = annualInterest > tdsThreshold;
    const tdsRate = hasPAN ? 10 : 20;
    const totalTDS = tdsApplicable ? (grossInterest * tdsRate) / 100 : 0;

    const taxSlab = TAX_SLABS[slabIdx].rate;
    const actualTax = (grossInterest * taxSlab) / 100;
    const netInterest = grossInterest - actualTax;
    const netMaturity = principal + netInterest;
    const postTaxReturn = (Math.pow(netMaturity / principal, 1 / years) - 1) * 100;

    const form15gEligible = taxSlab === 0;

    return (
        <>
            <SliderRow label="FD Amount" value={principal} set={setPrincipal} min={10_000} max={5_00_00_000} step={10_000} />
            <SliderRow label="Interest Rate (p.a.)" value={rate} set={setRate} min={3} max={10} step={0.1} suffix="%" />
            <SliderRow label="Tenure" value={years} set={setYears} min={1} max={10} step={1} suffix="yrs" />

            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ fontWeight: 600, fontSize: "0.92rem", display: "block", marginBottom: 8 }}>Your Tax Slab</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {TAX_SLABS.map((s, i) => (
                        <button key={i} onClick={() => setSlabIdx(i)} style={{
                            padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: i === slabIdx ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: i === slabIdx ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: i === slabIdx ? 700 : 500,
                            color: i === slabIdx ? "var(--n-primary)" : "var(--n-text)",
                        }}>{s.label}</button>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap", marginBottom: "var(--s-4)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "0.92rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={isSenior} onChange={e => setIsSenior(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: "var(--n-primary)" }} />
                    Senior Citizen (60+)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "0.92rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={hasPAN} onChange={e => setHasPAN(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: "var(--n-primary)" }} />
                    PAN Provided
                </label>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    Tax Impact Analysis
                </div>

                <table style={{ width: "100%", fontSize: "0.88rem" }}>
                    <tbody>
                        <tr><td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>Gross Maturity (Pre-Tax)</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(maturity)}</td></tr>
                        <tr><td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>Total Interest Earned</td><td style={{ textAlign: "right", fontWeight: 600, color: "#16a34a" }}>{fmt(grossInterest)}</td></tr>
                        <tr><td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>Annual Interest</td><td style={{ textAlign: "right", fontWeight: 600 }}>~{fmt(annualInterest)}/yr</td></tr>
                        <tr style={{ borderTop: "1px dashed var(--n-border)" }}>
                            <td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>TDS Threshold</td>
                            <td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(tdsThreshold)}/yr</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>TDS Applicable?</td>
                            <td style={{ textAlign: "right", fontWeight: 600, color: tdsApplicable ? "#dc2626" : "#16a34a" }}>
                                {tdsApplicable ? `Yes — ${tdsRate}%` : "No — Below threshold"}
                            </td>
                        </tr>
                        {tdsApplicable && (
                            <tr>
                                <td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>Total TDS Deducted</td>
                                <td style={{ textAlign: "right", fontWeight: 600, color: "#dc2626" }}>−{fmt(totalTDS)}</td>
                            </tr>
                        )}
                        <tr style={{ borderTop: "2px solid var(--n-border)" }}>
                            <td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>Tax on Interest ({taxSlab}% slab)</td>
                            <td style={{ textAlign: "right", fontWeight: 600, color: "#dc2626" }}>−{fmt(actualTax)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", fontWeight: 700 }}>Net Interest (After Tax)</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#16a34a", fontSize: "1.1rem" }}>{fmt(netInterest)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", fontWeight: 700 }}>Net Maturity</td>
                            <td style={{ textAlign: "right", fontWeight: 800, fontSize: "1.1rem" }}>{fmt(netMaturity)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "8px 0", color: "var(--n-text-muted)" }}>Post-Tax Effective Return</td>
                            <td style={{ textAlign: "right", fontWeight: 700, color: "var(--n-primary)" }}>{pct(postTaxReturn)} p.a.</td>
                        </tr>
                    </tbody>
                </table>

                {/* Visual comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
                    <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "var(--s-4)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Pre-Tax Return</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{pct(effectiveRate)}</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "var(--s-4)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Post-Tax Return</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#dc2626" }}>{pct(postTaxReturn)}</div>
                    </div>
                </div>

                {/* Form 15G/15H note */}
                {form15gEligible && (
                    <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-success-light)", borderRadius: 8, fontSize: "0.82rem" }}>
                        <strong>✅ You can avoid TDS!</strong> Since your income is below the taxable limit, submit <strong>{isSenior ? "Form 15H" : "Form 15G"}</strong> (or the new unified <strong>Form 121</strong>) to your bank at the start of each financial year.
                    </div>
                )}

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-gold-light)", borderRadius: 8, fontSize: "0.82rem" }}>
                    <strong>💡 Tax-Saver FD (Section 80C):</strong> You can invest up to ₹1.5 lakh in a 5-year Tax-Saver FD for deduction under Section 80C. However, the interest earned is still taxable at your slab rate.
                </div>
            </div>
        </>
    );
}

/* ═══════════ MODE 4: FD vs ALTERNATIVES ═══════════ */
const ALTERNATIVES = [
    { name: "Bank FD (Best Rate)", rate: 7.50, freq: 4, tenure: 5, tax: "Slab", riskLevel: "Very Low", dicgc: true },
    { name: "Post Office TD (5Y)", rate: 7.50, freq: 4, tenure: 5, tax: "Slab (80C)", riskLevel: "Very Low", dicgc: false },
    { name: "PPF", rate: 7.10, freq: 1, tenure: 15, tax: "EEE ✅", riskLevel: "Zero", dicgc: false },
    { name: "Sukanya Samriddhi (SSY)", rate: 8.20, freq: 1, tenure: 21, tax: "EEE ✅", riskLevel: "Zero", dicgc: false },
    { name: "Senior Citizen Savings (SCSS)", rate: 8.20, freq: 4, tenure: 5, tax: "Slab (80C)", riskLevel: "Zero", dicgc: false },
    { name: "NSC (5-Year)", rate: 7.70, freq: 1, tenure: 5, tax: "Slab (80C)", riskLevel: "Zero", dicgc: false },
    { name: "Kisan Vikas Patra (KVP)", rate: 7.50, freq: 1, tenure: 10, tax: "Slab", riskLevel: "Zero", dicgc: false },
    { name: "Debt Mutual Fund", rate: 7.00, freq: 1, tenure: 5, tax: "Slab", riskLevel: "Low", dicgc: false },
    { name: "Equity Mutual Fund (SIP)", rate: 12.00, freq: 1, tenure: 5, tax: "12.5% LTCG", riskLevel: "High", dicgc: false },
    { name: "NPS Tier-1", rate: 10.00, freq: 1, tenure: 25, tax: "Partial EEE", riskLevel: "Moderate", dicgc: false },
];

function AlternativesMode() {
    const [principal, setPrincipal] = useState(5_00_000);
    const [taxSlab, setTaxSlab] = useState(30);

    const computed = ALTERNATIVES.map(a => {
        const maturity = CI(principal, a.rate, a.freq, a.tenure);
        const interest = maturity - principal;
        const isTaxFree = a.tax.includes("EEE");
        const taxOnInterest = isTaxFree ? 0 : (interest * taxSlab) / 100;
        const netInterest = interest - taxOnInterest;
        const netMaturity = principal + netInterest;
        const netReturn = (Math.pow(netMaturity / principal, 1 / a.tenure) - 1) * 100;
        return { ...a, maturity, interest, taxOnInterest, netInterest, netMaturity, netReturn };
    });

    return (
        <>
            <SliderRow label="Investment Amount" value={principal} set={setPrincipal} min={10_000} max={1_00_00_000} step={10_000} />
            <SliderRow label="Your Tax Slab" value={taxSlab} set={setTaxSlab} min={0} max={30} step={5} suffix="%" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    FD vs Alternative Investments — {fmt(principal)} at {taxSlab}% Tax Slab
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse", minWidth: 700 }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "8px 4px" }}>Investment</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Rate</th>
                            <th style={{ textAlign: "center", padding: "8px 4px" }}>Tenure</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Gross Maturity</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Tax Paid</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Net Maturity</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Net Return</th>
                            <th style={{ textAlign: "center", padding: "8px 4px" }}>Risk</th>
                        </tr></thead>
                        <tbody>
                            {computed.map((a, i) => (
                                <tr key={i} style={{
                                    borderBottom: "1px solid var(--n-border)",
                                    background: a.tax.includes("EEE") ? "var(--n-success-light)" : "transparent",
                                }}>
                                    <td style={{ padding: "8px 4px", fontWeight: 600 }}>{a.name}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600 }}>{a.rate}%</td>
                                    <td style={{ textAlign: "center", padding: "8px 4px" }}>{a.tenure} yr</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px" }}>{fmt(a.maturity)}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", color: a.taxOnInterest > 0 ? "#dc2626" : "#16a34a" }}>
                                        {a.taxOnInterest > 0 ? `−${fmt(a.taxOnInterest)}` : "₹0 ✅"}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700 }}>{fmt(a.netMaturity)}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700, color: "var(--n-primary)" }}>{pct(a.netReturn)}</td>
                                    <td style={{ textAlign: "center", padding: "8px 4px", fontSize: "0.75rem" }}>
                                        {a.riskLevel === "Zero" ? "🟢" : a.riskLevel === "Very Low" ? "🟢" : a.riskLevel === "Low" ? "🟡" : a.riskLevel === "Moderate" ? "🟠" : "🔴"} {a.riskLevel}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Note:</strong> EEE = Exempt at investment, interest, and maturity (tax-free). Equity MF returns are market-linked estimates. DICGC covers bank FDs up to ₹5 lakh per depositor per bank. Tenure varies by instrument — compare net annual return for a fair comparison.
                </div>

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-gold-light)", borderRadius: 8, fontSize: "0.82rem" }}>
                    <strong>💡 Key Insight:</strong> At the {taxSlab}% tax slab, a 7% FD gives only <strong>{pct(7 * (1 - taxSlab / 100))}</strong> after tax — {7 * (1 - taxSlab / 100) < 6 ? "which may not beat inflation (~5-6%). Consider tax-free alternatives like PPF." : "still a decent risk-free return."}
                </div>
            </div>
        </>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function FDCalculatorIndiaCore() {
    const [mode, setMode] = useState<Mode>("maturity");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🏦 Fixed Deposit (FD) Interest Calculator</h2>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid var(--n-border)", overflow: "auto" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)}
                        style={{
                            flex: 1, padding: "12px 8px", border: "none", cursor: "pointer",
                            borderBottom: mode === m.key ? "3px solid var(--n-primary)" : "3px solid transparent",
                            background: mode === m.key ? "var(--n-primary-light)" : "transparent",
                            fontWeight: mode === m.key ? 700 : 500, fontSize: "0.82rem",
                            color: mode === m.key ? "var(--n-primary)" : "var(--n-text-muted)",
                            whiteSpace: "nowrap",
                        }}>
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: "var(--s-5)" }}>
                {mode === "maturity" && <MaturityMode />}
                {mode === "compare" && <BankCompareMode />}
                {mode === "tds" && <TDSMode />}
                {mode === "alternatives" && <AlternativesMode />}
            </div>
        </div>
    );
}
