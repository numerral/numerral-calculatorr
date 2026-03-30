"use client";
import { useState, useMemo } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
};
const fmtShort = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

type Mode = "corpus" | "nps" | "eps" | "annuity";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "corpus", icon: "🎯", label: "Retirement Corpus" },
    { key: "nps", icon: "🏛️", label: "NPS Calculator" },
    { key: "eps", icon: "📋", label: "EPS/EPFO Pension" },
    { key: "annuity", icon: "💰", label: "Annuity Estimator" },
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
                <span>{suffix === "%" ? `${min}%` : suffix === "yrs" ? `${min} yrs` : suffix === "num" ? `${min}` : fmt(min)}</span>
                <span>{suffix === "%" ? `${max}%` : suffix === "yrs" ? `${max} yrs` : suffix === "num" ? `${max}` : fmt(max)}</span>
            </div>
        </div>
    );
}

/* ─── Sub: Result Card ─── */
function ResultCard({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: color || "var(--n-text)" }}>{value}</div>
            {sub && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{sub}</div>}
        </div>
    );
}

/* ═══════════ MODE 1: RETIREMENT CORPUS PLANNER ═══════════ */
function CorpusMode() {
    const [age, setAge] = useState(30);
    const [retireAge, setRetireAge] = useState(60);
    const [monthlyExp, setMonthlyExp] = useState(50000);
    const [inflation, setInflation] = useState(6);
    const [lifeExp, setLifeExp] = useState(80);
    const [existing, setExisting] = useState(5_00_000);
    const [preReturn, setPreReturn] = useState(10);
    const [postReturn, setPostReturn] = useState(7);

    const result = useMemo(() => {
        const yearsToRetire = Math.max(retireAge - age, 1);
        const retirementYears = Math.max(lifeExp - retireAge, 1);

        // Monthly expenses at retirement (inflation-adjusted)
        const monthlyAtRetire = monthlyExp * Math.pow(1 + inflation / 100, yearsToRetire);
        const annualAtRetire = monthlyAtRetire * 12;

        // Corpus needed: PV of annuity (real rate = postReturn - inflation)
        const realRate = (postReturn - inflation) / 100;
        let corpusNeeded: number;
        if (realRate <= 0) {
            corpusNeeded = annualAtRetire * retirementYears;
        } else {
            corpusNeeded = annualAtRetire * (1 - Math.pow(1 + realRate, -retirementYears)) / realRate;
        }

        // Existing savings grown to retirement
        const existingGrown = existing * Math.pow(1 + preReturn / 100, yearsToRetire);
        const gap = Math.max(corpusNeeded - existingGrown, 0);

        // Monthly SIP to bridge gap: FV annuity formula solved for PMT
        const monthlyRate = preReturn / 100 / 12;
        const months = yearsToRetire * 12;
        let monthlySIP = 0;
        if (monthlyRate > 0 && months > 0 && gap > 0) {
            monthlySIP = gap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
        }

        // Savings longevity: how many years savings last
        let savingsLastYears = 0;
        let remaining = existingGrown;
        let annualNeed = annualAtRetire;
        for (let y = 0; y < 50 && remaining > 0; y++) {
            remaining = remaining * (1 + postReturn / 100) - annualNeed;
            annualNeed *= (1 + inflation / 100);
            savingsLastYears = y + 1;
        }
        const savingsLastAge = retireAge + savingsLastYears;

        return { monthlyAtRetire, corpusNeeded, existingGrown, gap, monthlySIP, savingsLastAge, yearsToRetire };
    }, [age, retireAge, monthlyExp, inflation, lifeExp, existing, preReturn, postReturn]);

    return (
        <>
            <SliderRow label="Current Age" value={age} set={setAge} min={18} max={60} step={1} suffix="yrs" />
            <SliderRow label="Desired Retirement Age" value={retireAge} set={setRetireAge} min={50} max={70} step={1} suffix="yrs" />
            <SliderRow label="Current Monthly Expenses" value={monthlyExp} set={setMonthlyExp} min={10000} max={5_00_000} step={5000} />
            <SliderRow label="Expected Inflation Rate" value={inflation} set={setInflation} min={3} max={10} step={0.5} suffix="%" />
            <SliderRow label="Life Expectancy" value={lifeExp} set={setLifeExp} min={70} max={95} step={1} suffix="yrs" />
            <SliderRow label="Existing Retirement Savings" value={existing} set={setExisting} min={0} max={10_00_00_000} step={50000} />
            <SliderRow label="Pre-Retirement Return" value={preReturn} set={setPreReturn} min={4} max={16} step={0.5} suffix="%" />
            <SliderRow label="Post-Retirement Return" value={postReturn} set={setPostReturn} min={4} max={12} step={0.5} suffix="%" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    Retirement Plan — {result.yearsToRetire} Years to Go
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-text)" }}>{fmt(result.corpusNeeded)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--n-text-muted)", marginTop: 4 }}>Total Retirement Corpus Needed</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
                    <ResultCard label="Monthly Expenses at Retirement" value={fmt(result.monthlyAtRetire)} />
                    <ResultCard label="Existing Savings (Grown)" value={fmt(result.existingGrown)} />
                    <ResultCard label="Gap to Bridge" value={fmt(result.gap)} color="#dc2626" />
                    <ResultCard label="Monthly SIP Needed" value={fmt(result.monthlySIP)} color="var(--n-primary)" />
                </div>

                <div style={{ marginTop: "var(--s-3)", padding: "12px 14px", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, textAlign: "center",
                    background: result.savingsLastAge >= lifeExp ? "var(--n-success-light)" : "#fef2f2",
                    color: result.savingsLastAge >= lifeExp ? "#16a34a" : "#dc2626"
                }}>
                    {result.savingsLastAge >= lifeExp
                        ? `✅ Your current savings (if invested) can last until age ${result.savingsLastAge}`
                        : `⚠️ Your current savings would last only until age ${result.savingsLastAge} — you need ₹${fmtShort(result.gap).slice(1)} more`}
                </div>

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>How it works:</strong> Your monthly expenses of {fmt(monthlyExp)} today become {fmt(result.monthlyAtRetire)}/month at retirement due to {inflation}% inflation over {result.yearsToRetire} years. The corpus accounts for {lifeExp - retireAge} years of post-retirement living at {postReturn}% returns.
                </div>
            </div>
        </>
    );
}

/* ═══════════ MODE 2: NPS CALCULATOR ═══════════ */
function NPSMode() {
    const [age, setAge] = useState(30);
    const [monthly, setMonthly] = useState(5000);
    const [returnRate, setReturnRate] = useState(10);
    const [annuityPct, setAnnuityPct] = useState(40);
    const [annuityRate, setAnnuityRate] = useState(6);

    const result = useMemo(() => {
        const years = Math.max(60 - age, 1);
        const months = years * 12;
        const r = returnRate / 100 / 12;

        // FV of annuity (monthly contributions)
        const corpus = monthly * ((Math.pow(1 + r, months) - 1) / r);
        const totalInvested = monthly * months;
        const totalInterest = corpus - totalInvested;

        const lumpSum = corpus * (1 - annuityPct / 100); // tax-free
        const annuityCorpus = corpus * (annuityPct / 100);
        const monthlyPension = (annuityCorpus * annuityRate / 100) / 12;

        // Tax savings
        const annual = monthly * 12;
        const tax80CCD1 = Math.min(annual, 1_50_000); // within 80C limit
        const tax80CCD1B = Math.min(annual, 50_000); // additional 50K
        const totalTaxSaved = (tax80CCD1 + tax80CCD1B) * 0.3 * years; // assuming 30% slab

        return { corpus, totalInvested, totalInterest, lumpSum, annuityCorpus, monthlyPension, years, tax80CCD1, tax80CCD1B, totalTaxSaved };
    }, [age, monthly, returnRate, annuityPct, annuityRate]);

    return (
        <>
            <SliderRow label="Current Age" value={age} set={setAge} min={18} max={55} step={1} suffix="yrs" />
            <SliderRow label="Monthly NPS Contribution" value={monthly} set={setMonthly} min={500} max={1_00_000} step={500} />
            <SliderRow label="Expected Return Rate" value={returnRate} set={setReturnRate} min={6} max={14} step={0.5} suffix="%" />
            <SliderRow label="Annuity Allocation" value={annuityPct} set={setAnnuityPct} min={40} max={100} step={5} suffix="%" />
            <SliderRow label="Expected Annuity Rate" value={annuityRate} set={setAnnuityRate} min={4} max={8} step={0.5} suffix="%" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    NPS Projection — {result.years} Years
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-text)" }}>{fmt(result.corpus)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--n-text-muted)", marginTop: 4 }}>Total NPS Corpus at Age 60</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
                    <ResultCard label="Total Invested" value={fmt(result.totalInvested)} />
                    <ResultCard label="Total Interest" value={fmt(result.totalInterest)} color="#16a34a" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-2)" }}>
                    <div style={{ background: "var(--n-success-light)", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>Lump Sum ({100 - annuityPct}% Tax-Free)</div>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: 4 }}>{fmt(result.lumpSum)}</div>
                    </div>
                    <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase" }}>Monthly Pension</div>
                        <div style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: 4 }}>{fmt(result.monthlyPension)}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>From {annuityPct}% annuity at {annuityRate}%</div>
                    </div>
                </div>

                <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "14px", marginTop: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: 6 }}>📋 Tax Savings Breakdown (30% slab)</div>
                    <table style={{ width: "100%", fontSize: "0.82rem" }}>
                        <tbody>
                            <tr><td style={{ padding: "4px 0", color: "var(--n-text-muted)" }}>Section 80CCD(1) — within 80C limit</td><td style={{ textAlign: "right", fontWeight: 600 }}>₹{(result.tax80CCD1).toLocaleString("en-IN")}/yr</td></tr>
                            <tr><td style={{ padding: "4px 0", color: "var(--n-text-muted)" }}>Section 80CCD(1B) — additional ₹50K</td><td style={{ textAlign: "right", fontWeight: 600 }}>₹{(result.tax80CCD1B).toLocaleString("en-IN")}/yr</td></tr>
                            <tr style={{ borderTop: "1px dashed var(--n-border)" }}><td style={{ padding: "4px 0", color: "var(--n-text-muted)" }}>Total tax saved over {result.years} years</td><td style={{ textAlign: "right", fontWeight: 700, color: "#16a34a" }}>{fmt(result.totalTaxSaved)}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

/* ═══════════ MODE 3: EPS/EPFO PENSION ═══════════ */
function EPSMode() {
    const [avgSalary, setAvgSalary] = useState(15000);
    const [serviceYears, setServiceYears] = useState(25);
    const [pensionType, setPensionType] = useState<"normal" | "early" | "deferred">("normal");
    const [earlyAge, setEarlyAge] = useState(55);

    const result = useMemo(() => {
        const cappedSalary = Math.min(avgSalary, 15000);
        const service = Math.min(serviceYears, 35);
        const bonusService = service > 20 ? 2 : 0;
        const effectiveService = service + bonusService;

        let basePension = (cappedSalary * effectiveService) / 70;
        basePension = Math.max(basePension, 1000); // minimum ₹1,000

        let adjustment = 0;
        let adjustedPension = basePension;

        if (pensionType === "early") {
            const yearsEarly = 58 - earlyAge;
            adjustment = -4 * yearsEarly;
            adjustedPension = basePension * (1 + adjustment / 100);
        } else if (pensionType === "deferred") {
            adjustment = 4 * 2; // max 2 years deferment
            adjustedPension = basePension * (1 + adjustment / 100);
        }

        adjustedPension = Math.max(adjustedPension, 1000);

        const higherPension = (avgSalary * effectiveService) / 70;

        return { cappedSalary, effectiveService, bonusService, basePension, adjustment, adjustedPension, higherPension };
    }, [avgSalary, serviceYears, pensionType, earlyAge]);

    return (
        <>
            <SliderRow label="Avg Monthly Salary (Basic + DA) — Last 60 Months" value={avgSalary} set={setAvgSalary} min={5000} max={1_00_000} step={1000} />
            <SliderRow label="Total Years of Service" value={serviceYears} set={setServiceYears} min={1} max={35} step={1} suffix="yrs" />

            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ fontWeight: 600, fontSize: "0.92rem", display: "block", marginBottom: 8 }}>Pension Type</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {(["normal", "early", "deferred"] as const).map(t => (
                        <button key={t} onClick={() => setPensionType(t)} style={{
                            flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: pensionType === t ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: pensionType === t ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: pensionType === t ? 700 : 500,
                            color: pensionType === t ? "var(--n-primary)" : "var(--n-text)",
                        }}>
                            {t === "normal" ? "Normal (Age 58)" : t === "early" ? "Early (50–57)" : "Deferred (59–60)"}
                        </button>
                    ))}
                </div>
            </div>

            {pensionType === "early" && (
                <SliderRow label="Early Retirement Age" value={earlyAge} set={setEarlyAge} min={50} max={57} step={1} suffix="yrs" />
            )}

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    EPS Monthly Pension
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-text)" }}>{fmt(result.adjustedPension)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                        per month {result.adjustment !== 0 ? `(${result.adjustment > 0 ? "+" : ""}${result.adjustment}% adjustment)` : "(normal retirement)"}
                    </div>
                </div>

                <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "14px", marginTop: "var(--s-4)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: 8 }}>📋 Calculation Breakdown</div>
                    <table style={{ width: "100%", fontSize: "0.82rem" }}>
                        <tbody>
                            <tr><td style={{ padding: "4px 0", color: "var(--n-text-muted)" }}>Pensionable Salary (capped at ₹15,000)</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(result.cappedSalary)}</td></tr>
                            <tr><td style={{ padding: "4px 0", color: "var(--n-text-muted)" }}>Service Years</td><td style={{ textAlign: "right", fontWeight: 600 }}>{serviceYears} yrs{result.bonusService > 0 ? ` + ${result.bonusService} bonus` : ""}</td></tr>
                            <tr><td style={{ padding: "4px 0", color: "var(--n-text-muted)" }}>Effective Service</td><td style={{ textAlign: "right", fontWeight: 600 }}>{result.effectiveService} yrs</td></tr>
                            <tr style={{ borderTop: "1px dashed var(--n-border)" }}><td style={{ padding: "6px 0", color: "var(--n-text-muted)" }}><strong>Formula:</strong> (Salary × Service) / 70</td><td style={{ textAlign: "right", fontWeight: 700 }}>({fmt(result.cappedSalary)} × {result.effectiveService}) / 70 = {fmt(result.basePension)}</td></tr>
                        </tbody>
                    </table>
                </div>

                {avgSalary > 15000 && (
                    <div style={{ marginTop: "var(--s-3)", padding: "12px 14px", background: "var(--n-gold-light)", borderRadius: 8, fontSize: "0.82rem" }}>
                        <strong>⚠️ Higher Pension Option:</strong> Your actual salary ({fmt(avgSalary)}) exceeds the ₹15,000 cap. If you opted for higher pension under the September 2014 scheme, your pension could be <strong>{fmt(result.higherPension)}/month</strong> instead. Check your eligibility on the EPFO portal.
                    </div>
                )}

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Minimum Pension:</strong> ₹1,000/month guaranteed under EPS-95. <strong>Early pension</strong> reduces by 4% per year before 58. <strong>Deferred pension</strong> increases by 4% per year (max 2 years, age 60).
                </div>
            </div>
        </>
    );
}

/* ═══════════ MODE 4: ANNUITY INCOME ESTIMATOR ═══════════ */
function AnnuityMode() {
    const [corpus, setCorpus] = useState(50_00_000);
    const [annuityAge, setAnnuityAge] = useState(60);
    const [annuityRate, setAnnuityRate] = useState(6);
    const [lifeExp, setLifeExp] = useState(80);

    const TYPES = useMemo(() => {
        const years = Math.max(lifeExp - annuityAge, 1);
        const r = annuityRate / 100;

        // Life Annuity: full benefit, no return of corpus
        const lifeMonthly = (corpus * r) / 12;
        // Joint Life: ~90% of life annuity (spouse gets 50% after death)
        const jointMonthly = lifeMonthly * 0.90;
        // Life with Return of Purchase Price: ~70-75% of life annuity
        const ropMonthly = lifeMonthly * 0.72;
        // Guaranteed 15 years: slightly less than life
        const guaranteedMonthly = lifeMonthly * 0.95;

        return [
            { name: "Life Annuity", desc: "Highest payout, stops at death", monthly: lifeMonthly, annual: lifeMonthly * 12, total: lifeMonthly * 12 * years, corpusReturn: 0, risk: "High" },
            { name: "Joint Life", desc: "Spouse gets 50% after your death", monthly: jointMonthly, annual: jointMonthly * 12, total: jointMonthly * 12 * years, corpusReturn: 0, risk: "Medium" },
            { name: "Life with RoP", desc: "Corpus returned to nominee at death", monthly: ropMonthly, annual: ropMonthly * 12, total: ropMonthly * 12 * years + corpus, corpusReturn: corpus, risk: "Low" },
            { name: "Guaranteed 15 yrs", desc: "Pension guaranteed for 15 years min", monthly: guaranteedMonthly, annual: guaranteedMonthly * 12, total: guaranteedMonthly * 12 * Math.max(years, 15), corpusReturn: 0, risk: "Low" },
        ];
    }, [corpus, annuityAge, annuityRate, lifeExp]);

    return (
        <>
            <SliderRow label="Corpus Amount" value={corpus} set={setCorpus} min={5_00_000} max={10_00_00_000} step={1_00_000} />
            <SliderRow label="Your Age at Annuity Purchase" value={annuityAge} set={setAnnuityAge} min={40} max={75} step={1} suffix="yrs" />
            <SliderRow label="Assumed Annuity Rate" value={annuityRate} set={setAnnuityRate} min={4} max={8} step={0.5} suffix="%" />
            <SliderRow label="Life Expectancy" value={lifeExp} set={setLifeExp} min={70} max={95} step={1} suffix="yrs" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    Annuity Comparison — {fmt(corpus)} Corpus at {annuityRate}%
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "8px 4px" }}>Annuity Type</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Monthly</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Annual</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Corpus Return</th>
                            <th style={{ textAlign: "center", padding: "8px 4px" }}>Risk</th>
                        </tr></thead>
                        <tbody>
                            {TYPES.map((t, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: i === 0 ? "var(--n-primary-light)" : "transparent" }}>
                                    <td style={{ padding: "8px 4px" }}>
                                        <div style={{ fontWeight: i === 0 ? 700 : 500 }}>{i === 0 && "⭐ "}{t.name}</div>
                                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{t.desc}</div>
                                    </td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600 }}>{fmt(t.monthly)}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px" }}>{fmt(t.annual)}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", color: t.corpusReturn > 0 ? "#16a34a" : "var(--n-text-muted)" }}>{t.corpusReturn > 0 ? fmt(t.corpusReturn) : "—"}</td>
                                    <td style={{ textAlign: "center", padding: "8px 4px" }}>
                                        <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: 99, fontWeight: 600,
                                            background: t.risk === "Low" ? "var(--n-success-light)" : t.risk === "Medium" ? "var(--n-gold-light)" : "#fef2f2",
                                            color: t.risk === "Low" ? "#16a34a" : t.risk === "Medium" ? "#d97706" : "#dc2626",
                                        }}>{t.risk}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Note:</strong> Actual annuity rates vary by insurer (LIC, SBI Life, HDFC Life, ICICI Pru). Life Annuity gives the highest payout but nothing to nominee. Life with Return of Purchase Price is the most popular choice for family security — corpus is returned to nominee at death.
                </div>
            </div>
        </>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function PensionCalculatorIndiaCore() {
    const [mode, setMode] = useState<Mode>("corpus");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🏦 Pension & Retirement Calculator</h2>
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
                {mode === "corpus" && <CorpusMode />}
                {mode === "nps" && <NPSMode />}
                {mode === "eps" && <EPSMode />}
                {mode === "annuity" && <AnnuityMode />}
            </div>
        </div>
    );
}
