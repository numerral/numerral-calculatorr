"use client";
import { useState, useMemo } from "react";

/* ─── Formatters ─── */
const fmt = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

/* ─── Modes ─── */
type Mode = "corpus" | "tax" | "compare" | "annuity";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "corpus", icon: "🏛️", label: "Corpus & Pension" },
    { key: "tax", icon: "🧾", label: "Tax Benefits" },
    { key: "compare", icon: "⚖️", label: "NPS vs Others" },
    { key: "annuity", icon: "💰", label: "Annuity Planner" },
];

/* ─── Shared Input ─── */
function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "yr" ? `${value} yrs` : suffix === "mo" ? `${value} months` : fmt(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min || 0} max={max || 50_00_000} step={step || 5000} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

/* ═══════ MODE 1: NPS CORPUS & PENSION ═══════ */
function CorpusMode() {
    const [age, setAge] = useState(30);
    const [retireAge, setRetireAge] = useState(60);
    const [monthly, setMonthly] = useState(5000);
    const [employerMonthly, setEmployerMonthly] = useState(0);
    const [choice, setChoice] = useState<"active" | "auto">("auto");
    const [lifecycle, setLifecycle] = useState<"LC75" | "LC50" | "LC25">("LC50");
    const [eqPct, setEqPct] = useState(50);
    const [corpPct, setCorpPct] = useState(30);
    const [govPct, setGovPct] = useState(20);
    const [annuityPct, setAnnuityPct] = useState(40);
    const [annuityRate, setAnnuityRate] = useState(6);

    const result = useMemo(() => {
        const years = Math.max(retireAge - age, 1);
        const months = years * 12;
        const totalMonthly = monthly + employerMonthly;

        // Calculate blended return based on asset allocation
        const eqReturn = 12; // historical equity
        const corpReturn = 8.5; // corporate bonds
        const govReturn = 7.5; // govt bonds
        const altReturn = 9; // alternatives (max 5%)

        let eq: number, corp: number, gov: number;
        if (choice === "auto") {
            // Auto Choice lifecycle — varies by age
            const maxEq = lifecycle === "LC75" ? 75 : lifecycle === "LC50" ? 50 : 25;
            // At age 35, allocation starts reducing equity
            eq = Math.max(Math.min(maxEq, maxEq - Math.max(age - 35, 0) * 2), 15);
            corp = Math.min(40, (100 - eq) * 0.5);
            gov = 100 - eq - corp;
        } else {
            eq = Math.min(eqPct, 75);
            corp = Math.min(corpPct, 100 - eq);
            gov = Math.max(100 - eq - corp, 0);
        }

        const blendedReturn = (eq * eqReturn + corp * corpReturn + gov * govReturn) / 100;
        const rm = blendedReturn / 100 / 12;

        // FV of monthly contributions
        const corpus = rm > 0 ? totalMonthly * ((Math.pow(1 + rm, months) - 1) / rm) * (1 + rm) : totalMonthly * months;
        const totalInvested = totalMonthly * months;
        const totalInterest = corpus - totalInvested;

        // 2026 withdrawal rules
        let lumpSumPct: number, mandatoryAnnuityPct: number, withdrawalNote: string;
        if (corpus <= 8_00_000) {
            lumpSumPct = 100; mandatoryAnnuityPct = 0;
            withdrawalNote = "Corpus ≤ ₹8L — 100% lump sum withdrawal allowed";
        } else if (corpus <= 12_00_000) {
            lumpSumPct = 50; mandatoryAnnuityPct = 50; // approx
            withdrawalNote = "Corpus ₹8L–₹12L — Up to ₹6L lump sum, rest via annuity/SUR";
        } else {
            lumpSumPct = 80; mandatoryAnnuityPct = 20;
            withdrawalNote = "Corpus > ₹12L — 80% lump sum, 20% mandatory annuity (2026 rule)";
        }

        // Override with user's annuity choice if higher
        const effectiveAnnuityPct = Math.max(annuityPct, mandatoryAnnuityPct);
        const lumpSum = corpus * (1 - effectiveAnnuityPct / 100);
        const annuityCorpus = corpus * (effectiveAnnuityPct / 100);
        const monthlyPension = (annuityCorpus * annuityRate / 100) / 12;

        // Tax savings
        const annual = monthly * 12;
        const employer80CCD2 = employerMonthly * 12;
        const tax80CCD1 = Math.min(annual, 1_50_000);
        const tax80CCD1B = Math.min(annual, 50_000);

        // Year-by-year schedule
        const schedule: { year: number; invested: number; value: number; gain: number }[] = [];
        for (let y = 1; y <= Math.min(years, 30); y++) {
            const m = y * 12;
            const v = rm > 0 ? totalMonthly * ((Math.pow(1 + rm, m) - 1) / rm) * (1 + rm) : totalMonthly * m;
            const inv = totalMonthly * m;
            schedule.push({ year: y, invested: inv, value: v, gain: v - inv });
        }

        return { corpus, totalInvested, totalInterest, lumpSum, annuityCorpus, monthlyPension, years,
            blendedReturn, eq, corp, gov, withdrawalNote, effectiveAnnuityPct,
            tax80CCD1, tax80CCD1B, employer80CCD2, schedule };
    }, [age, retireAge, monthly, employerMonthly, choice, lifecycle, eqPct, corpPct, govPct, annuityPct, annuityRate]);

    return (
        <>
            <InputRow label="Current Age" value={age} set={setAge} max={55} step={1} suffix="yr" min={18} />
            <InputRow label="Retirement Age" value={retireAge} set={setRetireAge} max={75} step={1} suffix="yr" min={55}
                hint="Standard: 60. Can stay until 75." />
            <InputRow label="Your Monthly NPS Contribution" value={monthly} set={setMonthly} max={1_00_000} step={500} min={500} />
            <InputRow label="Employer Monthly Contribution" value={employerMonthly} set={setEmployerMonthly} max={1_00_000} step={500} min={0}
                hint="Corporate NPS — 80CCD(2) benefit, up to 10% of Basic+DA" />

            {/* Investment Choice */}
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Investment Choice</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {(["auto", "active"] as const).map(c => (
                        <button key={c} onClick={() => setChoice(c)} style={{
                            flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: "0.85rem", cursor: "pointer",
                            border: choice === c ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: choice === c ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: choice === c ? 700 : 500, color: choice === c ? "var(--n-primary)" : "var(--n-text)",
                        }}>{c === "auto" ? "🔄 Auto Choice (Lifecycle)" : "🎯 Active Choice"}</button>
                    ))}
                </div>
            </div>

            {choice === "auto" ? (
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Lifecycle Fund</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        {(["LC75", "LC50", "LC25"] as const).map(lc => (
                            <button key={lc} onClick={() => setLifecycle(lc)} style={{
                                flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                                border: lifecycle === lc ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                                background: lifecycle === lc ? "var(--n-primary-light)" : "var(--n-surface)",
                                fontWeight: lifecycle === lc ? 700 : 500, color: lifecycle === lc ? "var(--n-primary)" : "var(--n-text)",
                            }}>
                                {lc === "LC75" ? "⚡ Aggressive (75%)" : lc === "LC50" ? "⚖️ Moderate (50%)" : "🛡️ Conservative (25%)"}
                            </button>
                        ))}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                        Max equity at young age: {lifecycle === "LC75" ? "75%" : lifecycle === "LC50" ? "50%" : "25%"} — reduces as you age
                    </div>
                </div>
            ) : (
                <>
                    <InputRow label="Equity (E) Allocation" value={eqPct} set={setEqPct} max={75} step={5} suffix="%" min={0}
                        hint="Max 75% until age 50, then reduces" />
                    <InputRow label="Corporate Bonds (C)" value={corpPct} set={setCorpPct} max={100 - eqPct} step={5} suffix="%" min={0} />
                    <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 14, padding: "6px 10px", background: "var(--n-surface-alt)", borderRadius: 6 }}>
                        Govt Bonds (G): <strong>{Math.max(100 - eqPct - corpPct, 0)}%</strong> (auto-balanced)
                    </div>
                </>
            )}

            <InputRow label="Annuity Allocation" value={annuityPct} set={setAnnuityPct} max={100} step={5} suffix="%" min={20}
                hint="Min 20% for corpus > ₹12L (2026 rule). Choose higher for more pension." />
            <InputRow label="Expected Annuity Rate" value={annuityRate} set={setAnnuityRate} max={8} step={0.5} suffix="%" min={4}
                hint="LIC annuity rates: 5.5–6.5% typically" />

            {/* Results */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        Total NPS Corpus at Age {retireAge}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmt(result.corpus)}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)" }}>
                        Blended return: <strong>{result.blendedReturn.toFixed(1)}%</strong> (E:{result.eq}% C:{result.corp}% G:{result.gov}%)
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                    {[
                        ["Total Invested", fmt(result.totalInvested), undefined],
                        ["Interest Earned", fmt(result.totalInterest), "#16a34a"],
                    ].map(([l, v, c], i) => (
                        <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: c as string || undefined }}>{v}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 14, textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>
                            Lump Sum ({100 - result.effectiveAnnuityPct}% Tax-Free)
                        </div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: 4 }}>{fmt(result.lumpSum)}</div>
                    </div>
                    <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: 14, textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase" }}>Monthly Pension</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: 4, color: "var(--n-primary)" }}>{fmt(result.monthlyPension)}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: 2 }}>{result.effectiveAnnuityPct}% annuity at {annuityRate}%</div>
                    </div>
                </div>

                <div style={{ background: "var(--n-gold-light)", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                    <strong style={{ color: "#78350f" }}>📋 2026 Rule:</strong> <span style={{ color: "#78350f" }}>{result.withdrawalNote}</span>
                </div>

                {/* Year-by-year schedule */}
                <details style={{ marginTop: "var(--s-3)" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "var(--n-primary)" }}>📅 Year-by-Year Growth Schedule</summary>
                    <div style={{ overflowX: "auto", marginTop: 8 }}>
                        <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                                <th style={{ textAlign: "left", padding: "6px 4px" }}>Year</th>
                                <th style={{ textAlign: "right", padding: "6px 4px" }}>Invested</th>
                                <th style={{ textAlign: "right", padding: "6px 4px" }}>Value</th>
                                <th style={{ textAlign: "right", padding: "6px 4px" }}>Gain</th>
                            </tr></thead>
                            <tbody>
                                {result.schedule.map(s => (
                                    <tr key={s.year} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                        <td style={{ padding: "5px 4px" }}>Year {s.year}</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px" }}>{fmt(s.invested)}</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 600 }}>{fmt(s.value)}</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px", color: "#16a34a" }}>+{fmt(s.gain)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            </div>
        </>
    );
}

/* ═══════ MODE 2: TAX BENEFIT CALCULATOR ═══════ */
function TaxMode() {
    const [basicDA, setBasicDA] = useState(6_00_000);
    const [empContrib, setEmpContrib] = useState(60_000);
    const [employerContrib, setEmployerContrib] = useState(60_000);
    const [regime, setRegime] = useState<"old" | "new">("old");

    const result = useMemo(() => {
        // 80CCD(1): Employee contribution, max 10% of Basic+DA, within 80C cap of ₹1.5L
        const ccd1Limit = basicDA * 0.10;
        const ccd1 = Math.min(empContrib, ccd1Limit, 1_50_000);

        // 80CCD(1B): Additional ₹50K — available in BOTH Old & New Regime
        const ccd1b = Math.min(empContrib, 50_000);

        // 80CCD(2): Employer contribution — up to 10% of Basic+DA (14% for Govt)
        const ccd2Limit = basicDA * 0.10;
        const ccd2 = Math.min(employerContrib, ccd2Limit);

        // Tax savings at each slab
        const slabs = [
            { rate: 5, label: "5% (₹3L–₹6L)" },
            { rate: 10, label: "10% (₹6L–₹9L)" },
            { rate: 15, label: "15% (₹9L–₹12L)" },
            { rate: 20, label: "20% (₹12L–₹15L)" },
            { rate: 30, label: "30% (>₹15L)" },
        ];

        const oldRegimeTotal = ccd1 + ccd1b + ccd2;
        // New regime: only 80CCD(1B) ₹50K + 80CCD(2) employer
        const newRegimeTotal = ccd1b + ccd2;

        const savings = slabs.map(s => ({
            ...s,
            oldSaving: Math.round(oldRegimeTotal * s.rate / 100 * 1.04), // + 4% cess
            newSaving: Math.round(newRegimeTotal * s.rate / 100 * 1.04),
        }));

        return { ccd1, ccd1b, ccd2, ccd1Limit, ccd2Limit, oldRegimeTotal, newRegimeTotal, savings };
    }, [basicDA, empContrib, employerContrib, regime]);

    return (
        <>
            <InputRow label="Annual Basic + DA" value={basicDA} set={setBasicDA} max={30_00_000} step={10_000} min={1_00_000}
                hint="Your Basic Salary + Dearness Allowance per year" />
            <InputRow label="Your Annual NPS Contribution" value={empContrib} set={setEmpContrib} max={5_00_000} step={5_000} min={6000}
                hint="Minimum ₹500/month (₹6,000/year)" />
            <InputRow label="Employer Annual NPS Contribution" value={employerContrib} set={setEmployerContrib} max={5_00_000} step={5_000} min={0}
                hint="Corporate NPS — up to 10% of Basic+DA" />

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {(["old", "new"] as const).map(r => (
                    <button key={r} onClick={() => setRegime(r)} style={{
                        flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: "0.85rem", cursor: "pointer",
                        border: regime === r ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: regime === r ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: regime === r ? 700 : 500, color: regime === r ? "var(--n-primary)" : "var(--n-text)",
                    }}>{r === "old" ? "📜 Old Tax Regime" : "🆕 New Tax Regime"}</button>
                ))}
            </div>

            {/* Deduction breakdown */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    📋 NPS Tax Deduction Breakdown ({regime === "old" ? "Old" : "New"} Regime)
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", marginBottom: "var(--s-3)" }}>
                    <tbody>
                        {[
                            ["Section 80CCD(1)", `${fmt(result.ccd1)} (limit: ${fmt(result.ccd1Limit)})`, regime === "old" ? "✅" : "❌", "Employee — within ₹1.5L 80C cap"],
                            ["Section 80CCD(1B)", `${fmt(result.ccd1b)} (max ₹50,000)`, "✅", "Additional ₹50K — both regimes!"],
                            ["Section 80CCD(2)", `${fmt(result.ccd2)} (limit: ${fmt(result.ccd2Limit)})`, "✅", "Employer — no cap beyond 10% of Basic+DA"],
                        ].map(([section, amount, available, note], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px" }}>
                                    <div style={{ fontWeight: 700 }}>{section}</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{note}</div>
                                </td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600 }}>{amount}</td>
                                <td style={{ textAlign: "center", padding: "8px 4px" }}>{available}</td>
                            </tr>
                        ))}
                        <tr style={{ borderTop: "2px solid var(--n-border)" }}>
                            <td style={{ padding: "8px 4px", fontWeight: 700 }}>Total Deduction</td>
                            <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 800, color: "var(--n-primary)" }}>
                                {fmt(regime === "old" ? result.oldRegimeTotal : result.newRegimeTotal)}
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>💰 Tax Savings by Income Slab</div>
                <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Tax Slab</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Old Regime Saving</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>New Regime Saving</th>
                    </tr></thead>
                    <tbody>
                        {result.savings.map((s, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "5px 4px" }}>{s.label}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 600, color: "#16a34a" }}>{fmt(s.oldSaving)}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 600, color: "#7c3aed" }}>{fmt(s.newSaving)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ background: "var(--n-gold-light)", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                    <strong style={{ color: "#78350f" }}>💡 Key Insight:</strong>{" "}
                    <span style={{ color: "#78350f" }}>Section 80CCD(1B)&rsquo;s ₹50,000 additional deduction is the <strong>biggest NPS advantage</strong> — it works under <strong>both Old and New Tax Regimes</strong>, saving up to ₹15,600/year (at 30% slab + cess). No other 80C instrument offers this.</span>
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 3: NPS vs PPF vs ELSS vs MF ═══════ */
function CompareMode() {
    const [monthlyInvest, setMonthlyInvest] = useState(5000);
    const [years, setYears] = useState(25);
    const [taxBracket, setTaxBracket] = useState(30);

    const result = useMemo(() => {
        const months = years * 12;
        const annual = monthlyInvest * 12;

        const sipFV = (rate: number) => {
            const rm = rate / 12 / 100;
            return rm > 0 ? monthlyInvest * ((Math.pow(1 + rm, months) - 1) / rm) * (1 + rm) : monthlyInvest * months;
        };

        const totalInvested = monthlyInvest * months;

        // NPS: ~10% blended (moderate auto choice)
        const npsReturn = 10;
        const npsCorpus = sipFV(npsReturn);
        const nps80C = Math.min(annual, 1_50_000) * taxBracket / 100 * 1.04 * years;
        const nps80CCD1B = Math.min(annual, 50_000) * taxBracket / 100 * 1.04 * years;
        const npsTotalTaxSaved = nps80C + nps80CCD1B;

        // PPF: 7.1% fixed, EEE
        const ppfRate = 7.1;
        const ppfCorpus = sipFV(ppfRate);
        const ppf80C = Math.min(annual, 1_50_000) * taxBracket / 100 * 1.04 * years;

        // ELSS: 12% equity, 80C, 3yr lock-in, LTCG 12.5%
        const elssReturn = 12;
        const elssCorpus = sipFV(elssReturn);
        const elssGains = elssCorpus - totalInvested;
        const elssLTCG = Math.max(elssGains - 1_25_000, 0) * 0.125;
        const elssNet = elssCorpus - elssLTCG;
        const elss80C = Math.min(annual, 1_50_000) * taxBracket / 100 * 1.04 * years;

        // Equity MF (non-tax saving): 12%
        const mfReturn = 12;
        const mfCorpus = sipFV(mfReturn);
        const mfGains = mfCorpus - totalInvested;
        const mfLTCG = Math.max(mfGains - 1_25_000, 0) * 0.125;
        const mfNet = mfCorpus - mfLTCG;

        return {
            totalInvested,
            items: [
                { name: "🏛️ NPS", corpus: npsCorpus, net: npsCorpus * 0.6, returnRate: `${npsReturn}%`, taxSaved: npsTotalTaxSaved, lockIn: "Age 60", taxStatus: "EET", liquidity: "Low", note: "60% lump sum + 40% annuity (80:20 for non-govt)" },
                { name: "🏦 PPF", corpus: ppfCorpus, net: ppfCorpus, returnRate: `${ppfRate}%`, taxSaved: ppf80C, lockIn: "15 years", taxStatus: "EEE", liquidity: "Very Low", note: "Fully tax-free returns (EEE status)" },
                { name: "📈 ELSS", corpus: elssCorpus, net: elssNet, returnRate: `${elssReturn}%`, taxSaved: elss80C, lockIn: "3 years", taxStatus: "E-E-T", liquidity: "High", note: "LTCG 12.5% on gains > ₹1.25L" },
                { name: "📊 Equity MF", corpus: mfCorpus, net: mfNet, returnRate: `${mfReturn}%`, taxSaved: 0, lockIn: "None", taxStatus: "E-E-T", liquidity: "Very High", note: "No 80C benefit, highest liquidity" },
            ],
        };
    }, [monthlyInvest, years, taxBracket]);

    return (
        <>
            <InputRow label="Monthly Investment" value={monthlyInvest} set={setMonthlyInvest} max={50_000} step={500} min={500} />
            <InputRow label="Investment Horizon" value={years} set={setYears} max={35} step={1} suffix="yr" min={5} />
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Tax Bracket</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {[5, 10, 15, 20, 30].map(b => (
                        <button key={b} onClick={() => setTaxBracket(b)} style={{
                            flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: taxBracket === b ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: taxBracket === b ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: taxBracket === b ? 700 : 500, color: taxBracket === b ? "var(--n-primary)" : "var(--n-text)",
                        }}>{b}%</button>
                    ))}
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse", marginBottom: "var(--s-3)" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "8px 4px" }}>Instrument</th>
                        <th style={{ textAlign: "right", padding: "8px 4px" }}>Corpus</th>
                        <th style={{ textAlign: "right", padding: "8px 4px" }}>Tax Saved</th>
                        <th style={{ textAlign: "center", padding: "8px 4px" }}>Lock-in</th>
                        <th style={{ textAlign: "center", padding: "8px 4px" }}>Tax Status</th>
                    </tr></thead>
                    <tbody>
                        {result.items.map((item, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: i === 0 ? "var(--n-primary-light)" : "" }}>
                                <td style={{ padding: "8px 4px" }}>
                                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>{item.returnRate} return</div>
                                </td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700 }}>{fmt(item.corpus)}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", color: item.taxSaved > 0 ? "#16a34a" : "var(--n-text-muted)" }}>
                                    {item.taxSaved > 0 ? fmt(item.taxSaved) : "—"}
                                </td>
                                <td style={{ textAlign: "center", padding: "8px 4px", fontSize: "0.75rem" }}>{item.lockIn}</td>
                                <td style={{ textAlign: "center", padding: "8px 4px" }}>
                                    <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                                        background: item.taxStatus === "EEE" ? "#f0fdf4" : "#eff6ff",
                                        color: item.taxStatus === "EEE" ? "#16a34a" : "#2563eb"
                                    }}>{item.taxStatus}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Key notes per instrument */}
            {result.items.map((item, i) => (
                <div key={i} style={{ fontSize: "0.78rem", padding: "6px 10px", marginBottom: 4, borderLeft: `3px solid ${i === 0 ? "var(--n-primary)" : "var(--n-border)"}` }}>
                    <strong>{item.name}:</strong> {item.note}
                </div>
            ))}

            <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", marginTop: "var(--s-3)" }}>
                <strong style={{ color: "var(--n-primary)" }}>⚖️ Verdict:</strong> For <strong>maximum tax saving</strong>, invest ₹50,000/year in NPS (claim 80CCD(1B)) + balance in ELSS/PPF (claim 80C). For <strong>maximum growth</strong>, ELSS/Equity MF wins. For <strong>guaranteed safety</strong>, PPF is unbeatable. The ideal strategy is a <strong>combination</strong> — not a single instrument.
            </div>
        </>
    );
}

/* ═══════ MODE 4: ANNUITY PLANNER ═══════ */
function AnnuityMode() {
    const [corpus, setCorpus] = useState(50_00_000);
    const [annuityAge, setAnnuityAge] = useState(60);
    const [annuityRate, setAnnuityRate] = useState(6);
    const [lifeExp, setLifeExp] = useState(80);

    const result = useMemo(() => {
        const years = Math.max(lifeExp - annuityAge, 1);
        const r = annuityRate / 100;
        const monthly = (corpus * r) / 12;

        const types = [
            { name: "Life Annuity", desc: "Highest payout — stops at death, no corpus return", monthly: monthly, corpusReturn: false, factor: 1.0, risk: "High" },
            { name: "Joint Life (50%)", desc: "Spouse gets 50% pension after your death", monthly: monthly * 0.90, corpusReturn: false, factor: 0.90, risk: "Medium" },
            { name: "Life + Return of Purchase", desc: "Lower pension — full corpus returned to nominee", monthly: monthly * 0.72, corpusReturn: true, factor: 0.72, risk: "Low" },
            { name: "Guaranteed 15 Years", desc: "Pension guaranteed for 15 years minimum", monthly: monthly * 0.95, corpusReturn: false, factor: 0.95, risk: "Low" },
            { name: "Guaranteed 20 Years", desc: "Pension guaranteed for 20 years minimum", monthly: monthly * 0.92, corpusReturn: false, factor: 0.92, risk: "Low" },
        ];

        return { types, years };
    }, [corpus, annuityAge, annuityRate, lifeExp]);

    return (
        <>
            <InputRow label="Annuity Corpus" value={corpus} set={setCorpus} max={10_00_00_000} step={1_00_000} min={5_00_000}
                hint="The portion of NPS corpus used to buy annuity (min 20%)" />
            <InputRow label="Age at Annuity Purchase" value={annuityAge} set={setAnnuityAge} max={75} step={1} suffix="yr" min={55} />
            <InputRow label="Assumed Annuity Rate" value={annuityRate} set={setAnnuityRate} max={8} step={0.25} suffix="%" min={4}
                hint="LIC: 5.5–6.5%, SBI Life: 5.0–6.0%, HDFC Life: 5.5–6.5%" />
            <InputRow label="Life Expectancy" value={lifeExp} set={setLifeExp} max={95} step={1} suffix="yr" min={70} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    💰 Annuity Comparison — {fmt(corpus)} at {annuityRate}%
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "8px 4px" }}>Annuity Type</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Monthly Pension</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Annual</th>
                            <th style={{ textAlign: "center", padding: "8px 4px" }}>Corpus Back?</th>
                            <th style={{ textAlign: "center", padding: "8px 4px" }}>Risk</th>
                        </tr></thead>
                        <tbody>
                            {result.types.map((t, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: i === 2 ? "var(--n-primary-light)" : "" }}>
                                    <td style={{ padding: "8px 4px" }}>
                                        <div style={{ fontWeight: i === 2 ? 700 : 500 }}>{i === 2 ? "⭐ " : ""}{t.name}</div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>{t.desc}</div>
                                    </td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700 }}>{fmt(t.monthly)}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px" }}>{fmt(t.monthly * 12)}</td>
                                    <td style={{ textAlign: "center", padding: "8px 4px", color: t.corpusReturn ? "#16a34a" : "var(--n-text-muted)" }}>
                                        {t.corpusReturn ? `✅ ${fmt(corpus)}` : "❌ No"}
                                    </td>
                                    <td style={{ textAlign: "center", padding: "8px 4px" }}>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 99, fontWeight: 600,
                                            background: t.risk === "Low" ? "#f0fdf4" : t.risk === "Medium" ? "#fffbeb" : "#fef2f2",
                                            color: t.risk === "Low" ? "#16a34a" : t.risk === "Medium" ? "#d97706" : "#dc2626",
                                        }}>{t.risk}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: "var(--s-3)", fontSize: "0.82rem", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8 }}>
                    <strong>📋 PFRDA-Empanelled Annuity Providers:</strong> LIC of India, SBI Life, ICICI Prudential Life, HDFC Life, Star Union Dai-ichi Life, IndiaFirst Life, Tata AIA Life. Among these, <strong>Life Annuity with Return of Purchase Price</strong> (⭐ highlighted) is the most popular choice — it provides a monthly pension while ensuring the full corpus is returned to your nominee upon death.
                </div>
            </div>
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function NPSCalculatorIndiaCore() {
    const [mode, setMode] = useState<Mode>("corpus");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🏛️ NPS Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Corpus &amp; pension • Active/Auto Choice • 80CCD tax benefits • Annuity comparison</div>
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
                {mode === "corpus" && <CorpusMode />}
                {mode === "tax" && <TaxMode />}
                {mode === "compare" && <CompareMode />}
                {mode === "annuity" && <AnnuityMode />}
            </div>
        </div>
    );
}
