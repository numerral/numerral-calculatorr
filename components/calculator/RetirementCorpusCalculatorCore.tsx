"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};

type Mode = "corpus" | "stack" | "income" | "readiness";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "corpus", icon: "🛡️", label: "Corpus Needed" },
    { key: "stack", icon: "📊", label: "NPS+EPF+PPF" },
    { key: "income", icon: "💰", label: "Post-Retirement Income" },
    { key: "readiness", icon: "✅", label: "Readiness Score" },
];

function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "yr" ? `${value} yrs` : suffix === "mo" ? `${value} months` : suffix === "/10" ? `${value}/10` : fmtCr(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min ?? 0} max={max ?? 100} step={step ?? 1} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

function ResultBox({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{label}</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: color || undefined, fontFamily: "var(--font-mono, monospace)" }}>{value}</div>
            {sub && <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", marginTop: 2 }}>{sub}</div>}
        </div>
    );
}

/* ─── Math helpers ─── */
function futureValue(pv: number, rate: number, years: number) {
    return pv * Math.pow(1 + rate / 100, years);
}
function sipFV(monthly: number, rate: number, years: number) {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}
function sipNeeded(target: number, rate: number, years: number) {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return target / n;
    return target / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}
// PV of annuity (how long corpus lasts with withdrawal)
function pvAnnuity(withdrawal: number, rate: number, years: number) {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return withdrawal * n;
    return withdrawal * ((1 - Math.pow(1 + r, -n)) / r);
}

/* ═══════ MODE 1: CORPUS CALCULATOR ═══════ */
function CorpusMode() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(60);
    const [lifeExpectancy, setLifeExpectancy] = useState(85);
    const [monthlyExp, setMonthlyExp] = useState(50_000);
    const [inflation, setInflation] = useState(6);
    const [preReturn, setPreReturn] = useState(12);
    const [postReturn, setPostReturn] = useState(7);
    const [existingSavings, setExistingSavings] = useState(5_00_000);

    const result = useMemo(() => {
        const yearsToRetire = retireAge - currentAge;
        const retirementYears = lifeExpectancy - retireAge;
        if (yearsToRetire <= 0 || retirementYears <= 0) return null;

        const annualExpToday = monthlyExp * 12;
        const annualExpAtRetire = futureValue(annualExpToday, inflation, yearsToRetire);
        const monthlyExpAtRetire = annualExpAtRetire / 12;

        // Healthcare inflation adjustment: assume 25% of expenses are healthcare at 14%
        const healthPortion = monthlyExp * 0.15;
        const nonHealthPortion = monthlyExp * 0.85;
        const healthAtRetire = futureValue(healthPortion * 12, 14, yearsToRetire) / 12;
        const nonHealthAtRetire = futureValue(nonHealthPortion * 12, inflation, yearsToRetire) / 12;
        const adjustedMonthlyAtRetire = healthAtRetire + nonHealthAtRetire;

        // Required corpus = PV of annuity (monthly withdrawals for retirementYears at postReturn)
        const requiredCorpus = pvAnnuity(adjustedMonthlyAtRetire, postReturn, retirementYears);

        // Growth of existing savings
        const existingGrowth = futureValue(existingSavings, preReturn, yearsToRetire);
        const gap = Math.max(0, requiredCorpus - existingGrowth);
        const sipRequired = gap > 0 ? sipNeeded(gap, preReturn, yearsToRetire) : 0;

        // Benchmarks: corpus multiples
        const rule25x = annualExpAtRetire * 25;
        const rule30x = annualExpAtRetire * 30;
        const rule33x = annualExpAtRetire * 33;

        return {
            yearsToRetire, retirementYears, annualExpAtRetire, monthlyExpAtRetire,
            adjustedMonthlyAtRetire, healthAtRetire, nonHealthAtRetire,
            requiredCorpus, existingGrowth, gap, sipRequired,
            rule25x, rule30x, rule33x,
        };
    }, [currentAge, retireAge, lifeExpectancy, monthlyExp, inflation, preReturn, postReturn, existingSavings]);

    return (
        <>
            <InputRow label="Current Age" value={currentAge} set={setCurrentAge} max={55} suffix="yr" min={18} />
            <InputRow label="Retirement Age" value={retireAge} set={setRetireAge} max={70} suffix="yr" min={currentAge + 5} />
            <InputRow label="Life Expectancy" value={lifeExpectancy} set={setLifeExpectancy} max={100} suffix="yr" min={retireAge + 5} hint="Plan for longevity — average Indian life expectancy is rising to 75+. Use 85 for safety." />
            <InputRow label="Monthly Expenses (today)" value={monthlyExp} set={setMonthlyExp} max={5_00_000} step={5_000} min={10_000} />
            <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} hint="India CPI: ~5-7%. Healthcare inflation is 12-14% — factored separately." />
            <InputRow label="Pre-Retirement Return" value={preReturn} set={setPreReturn} max={18} step={0.5} suffix="%" min={6} hint="Equity SIP: 12%, Balanced: 10%, Conservative: 8%" />
            <InputRow label="Post-Retirement Return" value={postReturn} set={setPostReturn} max={12} step={0.5} suffix="%" min={4} hint="SCSS 8.2%, Debt MF 7%, FD 6.5%, Annuity 6%" />
            <InputRow label="Existing Retirement Savings" value={existingSavings} set={setExistingSavings} max={5_00_00_000} step={50_000} min={0} hint="Total across EPF + NPS + PPF + MF + FD" />

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
                            Required Retirement Corpus
                        </div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-primary)" }}>
                            {fmtCr(result.requiredCorpus)}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)" }}>
                            To sustain {fmt(Math.round(result.adjustedMonthlyAtRetire))}/month for {result.retirementYears} years (age {retireAge}→{lifeExpectancy})
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, marginBottom: "var(--s-3)" }}>
                        <ResultBox label="Monthly Expenses at Retirement" value={fmt(Math.round(result.adjustedMonthlyAtRetire))} color="#dc2626" sub={`₹${Math.round(result.healthAtRetire).toLocaleString("en-IN")} healthcare`} />
                        <ResultBox label="Existing Savings Growth" value={fmtCr(result.existingGrowth)} color="#16a34a" sub={`${fmtCr(existingSavings)} → at ${preReturn}%`} />
                        <ResultBox label="Gap to Fill" value={fmtCr(result.gap)} color={result.gap > 0 ? "#dc2626" : "#16a34a"} sub={result.gap <= 0 ? "No gap!" : "Via SIP"} />
                        <ResultBox label="Monthly SIP Needed" value={result.sipRequired > 0 ? fmt(Math.round(result.sipRequired)) : "₹0"} color="var(--n-primary)" sub={`For ${result.yearsToRetire} years`} />
                    </div>

                    {/* Rule of thumb comparison */}
                    <div style={{ marginBottom: "var(--s-3)" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>📐 Corpus Rule Comparison</div>
                        <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                                <th style={{ textAlign: "left", padding: "6px 4px" }}>Method</th>
                                <th style={{ textAlign: "right", padding: "6px 4px" }}>Corpus</th>
                                <th style={{ textAlign: "right", padding: "6px 4px" }}>SIP Needed</th>
                            </tr></thead>
                            <tbody>
                                {[
                                    { label: "25× Rule (Moderate)", corpus: result.rule25x },
                                    { label: "30× Rule (Conservative)", corpus: result.rule30x },
                                    { label: "33× Rule (Safe for India)", corpus: result.rule33x },
                                    { label: "Annuity Method (This Calculator)", corpus: result.requiredCorpus },
                                ].map((r, i) => {
                                    const gap = Math.max(0, r.corpus - result.existingGrowth);
                                    const sip = gap > 0 ? sipNeeded(gap, preReturn, result.yearsToRetire) : 0;
                                    return (
                                        <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: i === 3 ? "var(--n-primary-light)" : undefined }}>
                                            <td style={{ padding: "5px 4px", fontWeight: i === 3 ? 700 : 500 }}>{r.label}</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)", fontWeight: 600 }}>{fmtCr(r.corpus)}</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(Math.round(sip))}/mo</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ background: "var(--n-gold-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem" }}>
                        <strong style={{ color: "var(--n-gold-text)" }}>⚠️ Healthcare Alert:</strong>
                        <span style={{ color: "#78350f" }}> At 14% medical inflation, your healthcare costs alone will be <strong>{fmt(Math.round(result.healthAtRetire))}/month</strong> at retirement — that&apos;s {((result.healthAtRetire / result.adjustedMonthlyAtRetire) * 100).toFixed(0)}% of your total expenses. Ensure you have ₹25L+ health insurance with super top-up cover.</span>
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 2: NPS + EPF + PPF STACK ═══════ */
function StackMode() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(60);
    const [basicDA, setBasicDA] = useState(50_000);
    const [npsMonthly, setNpsMonthly] = useState(5_000);
    const [ppfAnnual, setPpfAnnual] = useState(1_50_000);
    const [epfBalance, setEpfBalance] = useState(3_00_000);
    const [npsBalance, setNpsBalance] = useState(1_00_000);
    const [ppfBalance, setPpfBalance] = useState(2_00_000);
    const [npsEquity, setNpsEquity] = useState(75);
    const [monthlyExp, setMonthlyExp] = useState(50_000);

    const result = useMemo(() => {
        const years = retireAge - currentAge;
        if (years <= 0) return null;

        // EPF: 12% employee + 3.67% employer to EPF (8.33% to EPS)
        const epfEmployeeMonthly = basicDA * 0.12;
        const epfEmployerMonthly = basicDA * 0.0367;
        const totalEPFMonthly = epfEmployeeMonthly + epfEmployerMonthly;
        const epfRate = 8.25;
        const epfCorpus = futureValue(epfBalance, epfRate, years) + sipFV(totalEPFMonthly, epfRate, years);

        // EPS: 8.33% of basic+DA, capped at ₹15,000
        const epsCapped = Math.min(basicDA, 15_000);
        const epsServiceYears = Math.min(years + 5, 35); // assume 5 years prior service
        const epsPension = (epsServiceYears * epsCapped) / 70; // EPS-95 formula

        // NPS: weighted return based on equity allocation
        const npsEquityReturn = 12;
        const npsDebtReturn = 8;
        const npsReturn = (npsEquity / 100) * npsEquityReturn + ((100 - npsEquity) / 100) * npsDebtReturn;
        const npsCorpus = futureValue(npsBalance, npsReturn, years) + sipFV(npsMonthly, npsReturn, years);
        const npsLumpSum = npsCorpus * 0.60; // 60% tax-free lump sum
        const npsAnnuityCorpus = npsCorpus * 0.40; // 40% mandatory annuity
        const npsMonthlyPension = (npsAnnuityCorpus * 0.06) / 12; // ~6% annuity rate

        // PPF: 7.1% tax-free
        const ppfRate = 7.1;
        const ppfMonthly = ppfAnnual / 12;
        const ppfCorpus = futureValue(ppfBalance, ppfRate, years) + sipFV(ppfMonthly, ppfRate, years);

        const totalCorpus = epfCorpus + npsLumpSum + ppfCorpus;
        const totalPension = epsPension + npsMonthlyPension;

        const monthlyExpAtRetire = futureValue(monthlyExp * 12, 6, years) / 12;
        const pensionGap = Math.max(0, monthlyExpAtRetire - totalPension);

        // Tax saved per year
        const sec80C = Math.min(1_50_000, epfEmployeeMonthly * 12 + ppfAnnual);
        const sec80CCD1B = Math.min(50_000, npsMonthly * 12);
        const totalTaxSaved = (sec80C + sec80CCD1B) * 0.312; // 30% + 4% cess

        return {
            years, epfCorpus, epsPension, npsCorpus, npsLumpSum, npsAnnuityCorpus, npsMonthlyPension, npsReturn,
            ppfCorpus, totalCorpus, totalPension, monthlyExpAtRetire, pensionGap,
            totalEPFMonthly, epfEmployeeMonthly, epfEmployerMonthly,
            sec80C, sec80CCD1B, totalTaxSaved,
        };
    }, [currentAge, retireAge, basicDA, npsMonthly, ppfAnnual, epfBalance, npsBalance, ppfBalance, npsEquity, monthlyExp]);

    return (
        <>
            <InputRow label="Current Age" value={currentAge} set={setCurrentAge} max={55} suffix="yr" min={22} />
            <InputRow label="Retirement Age" value={retireAge} set={setRetireAge} max={65} suffix="yr" min={currentAge + 5} />
            <InputRow label="Basic + DA (Monthly)" value={basicDA} set={setBasicDA} max={3_00_000} step={5_000} min={15_000} hint="EPF contribution is 12% of Basic+DA" />
            <InputRow label="NPS Monthly Contribution" value={npsMonthly} set={setNpsMonthly} max={50_000} step={500} min={500} />
            <InputRow label="PPF Annual Contribution" value={ppfAnnual} set={setPpfAnnual} max={1_50_000} step={10_000} min={500} hint="Max ₹1.5L/year" />
            <InputRow label="NPS Equity Allocation" value={npsEquity} set={setNpsEquity} max={75} step={5} suffix="%" min={25} hint="Max 75% equity (Tier-I). Auto-choice reduces equity after age 35." />
            <InputRow label="Current EPF Balance" value={epfBalance} set={setEpfBalance} max={1_00_00_000} step={50_000} min={0} />
            <InputRow label="Current NPS Balance" value={npsBalance} set={setNpsBalance} max={1_00_00_000} step={50_000} min={0} />
            <InputRow label="Current PPF Balance" value={ppfBalance} set={setPpfBalance} max={1_00_00_000} step={50_000} min={0} />
            <InputRow label="Monthly Expenses (today)" value={monthlyExp} set={setMonthlyExp} max={5_00_000} step={5_000} min={10_000} hint="To calculate pension gap" />

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 12 }}>📊 Your Retirement Stack — {result.years} Years to Retirement</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid var(--n-border)" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", fontWeight: 600 }}>🏦 EPF Corpus</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#2563eb" }}>{fmtCr(result.epfCorpus)}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>@ 8.25% p.a.</div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid var(--n-border)" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", fontWeight: 600 }}>📈 NPS (Lump Sum)</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#16a34a" }}>{fmtCr(result.npsLumpSum)}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>60% of {fmtCr(result.npsCorpus)}</div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid var(--n-border)" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", fontWeight: 600 }}>🏛️ PPF Maturity</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#7c3aed" }}>{fmtCr(result.ppfCorpus)}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>@ 7.1% (tax-free)</div>
                        </div>
                    </div>

                    <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: "var(--s-3)", border: "2px solid var(--n-primary)" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", fontWeight: 600 }}>TOTAL RETIREMENT CORPUS (Lump Sum)</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-primary)" }}>{fmtCr(result.totalCorpus)}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)" }}>EPF + NPS (60% lump) + PPF</div>
                    </div>

                    {/* Monthly Pension Income */}
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 8 }}>💸 Monthly Pension Income</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        <ResultBox label="EPS-95 Pension" value={fmt(Math.round(result.epsPension))} color="#2563eb" sub="Lifelong from EPFO" />
                        <ResultBox label="NPS Annuity" value={fmt(Math.round(result.npsMonthlyPension))} color="#16a34a" sub="From 40% annuity @ 6%" />
                        <ResultBox label="Total Monthly Pension" value={fmt(Math.round(result.totalPension))} color="var(--n-primary)" sub="Guaranteed income" />
                    </div>

                    {/* Pension Gap */}
                    <div style={{
                        background: result.pensionGap > 0 ? "#fef2f2" : "#f0fdf4",
                        borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", marginBottom: "var(--s-3)",
                        border: result.pensionGap > 0 ? "1px solid #fca5a5" : "1px solid #86efac",
                    }}>
                        <strong style={{ color: result.pensionGap > 0 ? "#dc2626" : "#16a34a" }}>
                            {result.pensionGap > 0 ? `⚠️ Pension Gap: ${fmt(Math.round(result.pensionGap))}/month` : "✅ Pension Covers Expenses!"}
                        </strong>
                        <span style={{ color: result.pensionGap > 0 ? "#7f1d1d" : "#14532d" }}>
                            {result.pensionGap > 0
                                ? ` — Your expenses at retirement will be ${fmt(Math.round(result.monthlyExpAtRetire))}/month, but pension covers only ${fmt(Math.round(result.totalPension))}. Fill the gap with SWP from your ${fmtCr(result.totalCorpus)} lump sum corpus.`
                                : ` — EPS + NPS annuity covers your projected expenses. Your lump sum corpus is additional safety.`}
                        </span>
                    </div>

                    {/* Tax Savings */}
                    <div style={{ background: "var(--n-gold-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem" }}>
                        <strong style={{ color: "var(--n-gold-text)" }}>🧾 Annual Tax Savings:</strong>
                        <span style={{ color: "#78350f" }}> Section 80C: {fmt(result.sec80C)} + 80CCD(1B): {fmt(result.sec80CCD1B)} = Total deduction {fmt(result.sec80C + result.sec80CCD1B)}. <strong>Tax saved: ~{fmt(Math.round(result.totalTaxSaved))}/year</strong> (at 30% + cess). That&apos;s {fmt(Math.round(result.totalTaxSaved * result.years))} over {result.years} years!</span>
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 3: POST-RETIREMENT INCOME PLANNER ═══════ */
function IncomeMode() {
    const [monthlyNeed, setMonthlyNeed] = useState(1_00_000);
    const [corpus, setCorpus] = useState(3_00_00_000);
    const [epsPension, setEpsPension] = useState(5_000);
    const [npsAnnuity, setNpsAnnuity] = useState(15_000);
    const [otherIncome, setOtherIncome] = useState(0);
    const [retirementYears, setRetirementYears] = useState(25);

    const result = useMemo(() => {
        const guaranteedIncome = epsPension + npsAnnuity + otherIncome;
        const corpusNeeded = Math.max(0, monthlyNeed - guaranteedIncome);

        // Bucket strategy
        const bucket1 = corpusNeeded * 12 * 3; // 3 years liquid
        const bucket2 = Math.min(30_00_000, corpus * 0.25); // SCSS ₹30L max
        const bucket2Income = (bucket2 * 0.082) / 12; // SCSS 8.2% quarterly = monthly
        const remaining = Math.max(0, corpus - bucket1 - bucket2);

        // SWP from remaining at 7%
        const swpRate = 7;
        const swpMonths = retirementYears * 12;
        const swpMonthly = remaining > 0 ? (remaining * (swpRate / 100 / 12)) / (1 - Math.pow(1 + swpRate / 100 / 12, -swpMonths)) : 0;

        const totalMonthlyIncome = guaranteedIncome + bucket2Income + swpMonthly;
        const surplus = totalMonthlyIncome - monthlyNeed;

        // Corpus depletion check
        const yearsCorpusLasts = corpus > 0 && corpusNeeded > 0 ? (() => {
            const r = 7 / 100 / 12;
            const withdrawal = corpusNeeded;
            if (withdrawal <= corpus * r) return 99; // perpetual
            const n = -Math.log(1 - (corpus * r) / withdrawal) / Math.log(1 + r);
            return Math.round(n / 12);
        })() : 99;

        return {
            guaranteedIncome, corpusNeeded, bucket1, bucket2, bucket2Income,
            remaining, swpMonthly, totalMonthlyIncome, surplus, yearsCorpusLasts,
        };
    }, [monthlyNeed, corpus, epsPension, npsAnnuity, otherIncome, retirementYears]);

    return (
        <>
            <InputRow label="Monthly Income Needed" value={monthlyNeed} set={setMonthlyNeed} max={5_00_000} step={5_000} min={20_000} hint="Your expected monthly expenses at retirement (inflation-adjusted)" />
            <InputRow label="Retirement Corpus Available" value={corpus} set={setCorpus} max={20_00_00_000} step={5_00_000} min={10_00_000} hint="Total lump sum: EPF + NPS(60%) + PPF + MF + FD" />
            <InputRow label="EPS-95 Monthly Pension" value={epsPension} set={setEpsPension} max={50_000} step={500} min={0} hint="From EPFO — use NPS+EPF+PPF tab to estimate" />
            <InputRow label="NPS Annuity Income" value={npsAnnuity} set={setNpsAnnuity} max={1_00_000} step={500} min={0} hint="Monthly pension from NPS 40% annuity" />
            <InputRow label="Other Fixed Income" value={otherIncome} set={setOtherIncome} max={2_00_000} step={1_000} min={0} hint="Rental income, family pension, dividends, etc." />
            <InputRow label="Retirement Duration" value={retirementYears} set={setRetirementYears} max={40} suffix="yr" min={10} hint="How long corpus must last (age 60 to 85 = 25 years)" />

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 12 }}>💰 Income Plan for {retirementYears} Years of Retirement</div>

                    {/* Income sources */}
                    <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse", marginBottom: "var(--s-3)" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "6px 4px" }}>Income Source</th>
                            <th style={{ textAlign: "right", padding: "6px 4px" }}>Monthly</th>
                            <th style={{ textAlign: "right", padding: "6px 4px" }}>Annual</th>
                        </tr></thead>
                        <tbody>
                            <tr style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "5px 4px" }}>🏦 EPS-95 Pension</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(epsPension)}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(epsPension * 12)}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "5px 4px" }}>📈 NPS Annuity</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(npsAnnuity)}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(npsAnnuity * 12)}</td>
                            </tr>
                            {otherIncome > 0 && <tr style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "5px 4px" }}>📋 Other Income</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(otherIncome)}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(otherIncome * 12)}</td>
                            </tr>}
                            <tr style={{ borderBottom: "1px solid var(--n-border)", background: "rgba(59,130,246,0.05)" }}>
                                <td style={{ padding: "5px 4px" }}>🏛️ SCSS Interest (₹{(result.bucket2 / 1_00_000).toFixed(0)}L @ 8.2%)</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(Math.round(result.bucket2Income))}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(Math.round(result.bucket2Income * 12))}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid var(--n-border)", background: "rgba(59,130,246,0.05)" }}>
                                <td style={{ padding: "5px 4px" }}>📊 SWP from Corpus ({fmtCr(result.remaining)} @ 7%)</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(Math.round(result.swpMonthly))}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>{fmt(Math.round(result.swpMonthly * 12))}</td>
                            </tr>
                            <tr style={{ borderBottom: "2px solid var(--n-primary)", background: "var(--n-primary-light)" }}>
                                <td style={{ padding: "6px 4px", fontWeight: 700 }}>Total Monthly Income</td>
                                <td style={{ textAlign: "right", padding: "6px 4px", fontFamily: "var(--font-mono, monospace)", fontWeight: 800, color: "var(--n-primary)", fontSize: "1.05rem" }}>{fmt(Math.round(result.totalMonthlyIncome))}</td>
                                <td style={{ textAlign: "right", padding: "6px 4px", fontFamily: "var(--font-mono, monospace)", fontWeight: 700 }}>{fmtCr(result.totalMonthlyIncome * 12)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{
                        background: result.surplus >= 0 ? "#f0fdf4" : "#fef2f2",
                        borderRadius: 10, padding: "12px 16px", fontSize: "0.85rem", marginBottom: "var(--s-3)",
                        border: result.surplus >= 0 ? "2px solid #22c55e" : "2px solid #ef4444", textAlign: "center",
                    }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: result.surplus >= 0 ? "#16a34a" : "#dc2626" }}>
                            {result.surplus >= 0 ? `✅ Surplus: ${fmt(Math.round(result.surplus))}/month` : `⚠️ Shortfall: ${fmt(Math.round(Math.abs(result.surplus)))}/month`}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                            {result.yearsCorpusLasts >= 99 ? "Your corpus is perpetual at this withdrawal rate!" : `Corpus lasts approximately ${result.yearsCorpusLasts} years at current withdrawal.`}
                        </div>
                    </div>

                    {/* Bucket Strategy Visual */}
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 8 }}>🪣 Bucket Strategy Allocation</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <div style={{ background: "#dbeafe", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#1e40af" }}>Bucket 1 (0–3 yrs)</div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e40af", fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.bucket1)}</div>
                            <div style={{ fontSize: "0.65rem", color: "#3b82f6" }}>Liquid MF, Savings</div>
                        </div>
                        <div style={{ background: "#fef3c7", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#92400e" }}>Bucket 2 (3–10 yrs)</div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#92400e", fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.bucket2)}</div>
                            <div style={{ fontSize: "0.65rem", color: "#b45309" }}>SCSS, Debt MF, FD</div>
                        </div>
                        <div style={{ background: "#dcfce7", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#166534" }}>Bucket 3 (10+ yrs)</div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#166534", fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.remaining)}</div>
                            <div style={{ fontSize: "0.65rem", color: "#16a34a" }}>Equity MF, Index Fund</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 4: RETIREMENT READINESS SCORE ═══════ */
function ReadinessMode() {
    const [currentAge, setCurrentAge] = useState(30);
    const [retireAge, setRetireAge] = useState(60);
    const [monthlyExp, setMonthlyExp] = useState(50_000);
    const [totalInv, setTotalInv] = useState(10_00_000);
    const [monthlySIP, setMonthlySIP] = useState(20_000);
    const [returnRate, setReturnRate] = useState(12);
    const [inflation, setInflation] = useState(6);
    const [healthIns, setHealthIns] = useState(5);
    const [emergencyMo, setEmergencyMo] = useState(3);
    const [termIns, setTermIns] = useState(5);

    const result = useMemo(() => {
        const years = retireAge - currentAge;
        if (years <= 0) return null;

        const annualExpAtRetire = futureValue(monthlyExp * 12, inflation, years);
        const requiredCorpus = annualExpAtRetire * 30;
        const projFromExisting = futureValue(totalInv, returnRate, years);
        const projFromSIP = sipFV(monthlySIP, returnRate, years);
        const projTotal = projFromExisting + projFromSIP;
        const gap = requiredCorpus - projTotal;
        const fundedPct = Math.min(100, (projTotal / requiredCorpus) * 100);

        let score = 0;
        score += Math.min(40, (fundedPct / 100) * 40);
        const savingsRate = (monthlySIP / monthlyExp) * 100;
        score += Math.min(15, (savingsRate / 50) * 15);
        score += Math.min(15, (healthIns / 10) * 15);
        score += Math.min(15, (emergencyMo / 6) * 15);
        score += Math.min(15, (termIns / 10) * 15);
        score = Math.round(score);

        const additionalSIP = gap > 0 ? sipNeeded(gap, returnRate, years) : 0;
        const scoreColor = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : score >= 40 ? "#ea580c" : "#dc2626";
        const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Needs Work" : "Critical";

        return { years, requiredCorpus, projTotal, gap, fundedPct, score, scoreColor, scoreLabel, additionalSIP, savingsRate };
    }, [currentAge, retireAge, monthlyExp, totalInv, monthlySIP, returnRate, inflation, healthIns, emergencyMo, termIns]);

    return (
        <>
            <InputRow label="Current Age" value={currentAge} set={setCurrentAge} max={55} suffix="yr" min={18} />
            <InputRow label="Retirement Age" value={retireAge} set={setRetireAge} max={70} suffix="yr" min={currentAge + 5} />
            <InputRow label="Monthly Expenses (today)" value={monthlyExp} set={setMonthlyExp} max={5_00_000} step={5_000} min={10_000} />
            <InputRow label="Total Current Investments" value={totalInv} set={setTotalInv} max={10_00_00_000} step={1_00_000} min={0} hint="MF + NPS + PPF + EPF + FD + Stocks" />
            <InputRow label="Current Monthly SIP/Savings" value={monthlySIP} set={setMonthlySIP} max={5_00_000} step={5_000} min={0} />
            <InputRow label="Expected Return" value={returnRate} set={setReturnRate} max={18} step={0.5} suffix="%" min={6} />
            <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} />

            <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 8, marginTop: 12 }}>Risk Protection Check</div>
            <InputRow label="Health Insurance Cover" value={healthIns} set={setHealthIns} max={10} suffix="/10" min={0} hint="0 = none, 5 = ₹10L, 10 = ₹50L+ super top-up" />
            <InputRow label="Emergency Fund" value={emergencyMo} set={setEmergencyMo} max={12} suffix="mo" min={0} hint="Months of expenses in liquid savings" />
            <InputRow label="Term Insurance" value={termIns} set={setTermIns} max={10} suffix="/10" min={0} hint="0 = none, 5 = basic, 10 = 15-20× income" />

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ textAlign: "center", marginBottom: "var(--s-4)" }}>
                        <div style={{
                            width: 120, height: 120, borderRadius: "50%", margin: "0 auto",
                            border: `6px solid ${result.scoreColor}`, display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: result.scoreColor, lineHeight: 1 }}>{result.score}</div>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: result.scoreColor }}>{result.scoreLabel}</div>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 8 }}>Retirement Readiness Score</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        <ResultBox label="Required Corpus (30×)" value={fmtCr(result.requiredCorpus)} sub={`At age ${retireAge}`} />
                        <ResultBox label="Projected Corpus" value={fmtCr(result.projTotal)} color={result.gap <= 0 ? "#16a34a" : "#dc2626"} sub={`${result.fundedPct.toFixed(0)}% funded`} />
                    </div>

                    {result.gap > 0 && (
                        <div style={{ background: "#fef2f2", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", marginBottom: "var(--s-3)", border: "1px solid #fca5a5" }}>
                            <strong style={{ color: "#dc2626" }}>⚠️ Gap: {fmtCr(result.gap)}</strong>
                            <span style={{ color: "#7f1d1d" }}> — Increase SIP by <strong>{fmt(Math.round(result.additionalSIP))}/month</strong> to close this gap by age {retireAge}.</span>
                        </div>
                    )}

                    <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>✅ Action Checklist</div>
                    <div style={{ fontSize: "0.82rem" }}>
                        {[
                            { check: result.savingsRate >= 20, text: `Savings rate: ${result.savingsRate.toFixed(0)}% of expenses (target: ≥20%)` },
                            { check: healthIns >= 5, text: `Health insurance: ${healthIns >= 5 ? "Adequate" : "₹10L+ cover needed"}` },
                            { check: emergencyMo >= 6, text: `Emergency fund: ${emergencyMo} months (target: 6 months)` },
                            { check: termIns >= 5, text: `Term insurance: ${termIns >= 5 ? "Adequate" : "Get 15-20× annual income cover"}` },
                            { check: result.gap <= 0, text: result.gap <= 0 ? "On track for retirement!" : `Increase SIP by ${fmt(Math.round(result.additionalSIP))}/mo` },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: "6px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ color: item.check ? "#16a34a" : "#dc2626", fontSize: "1rem" }}>{item.check ? "✅" : "❌"}</span>
                                <span style={{ color: item.check ? "var(--n-text)" : "#dc2626" }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function RetirementCorpusCalculatorCore() {
    const [mode, setMode] = useState<Mode>("corpus");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, #dbeafe, #bfdbfe, var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🛡️ Retirement Corpus Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Healthcare inflation modelling • NPS/EPF/PPF stack • Post-retirement income planner • Bucket strategy</div>
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
                {mode === "stack" && <StackMode />}
                {mode === "income" && <IncomeMode />}
                {mode === "readiness" && <ReadinessMode />}
            </div>
        </div>
    );
}
