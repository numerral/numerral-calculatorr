"use client";
import { useState, useMemo } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const CI = (P: number, r: number, n: number, t: number) =>
    P * Math.pow(1 + r / (100 * n), n * t);

const SI = (P: number, r: number, t: number) =>
    P * (1 + (r * t) / 100);

type Mode = "lumpsum" | "recurring" | "fdcompare" | "delay";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "lumpsum", icon: "💰", label: "Lump Sum" },
    { key: "recurring", icon: "🔄", label: "Recurring / SIP" },
    { key: "fdcompare", icon: "🏦", label: "FD Comparison" },
    { key: "delay", icon: "⏳", label: "Cost of Delay" },
];

const FREQ: { label: string; n: number }[] = [
    { label: "Annually", n: 1 },
    { label: "Semi-Annually", n: 2 },
    { label: "Quarterly", n: 4 },
    { label: "Monthly", n: 12 },
    { label: "Daily", n: 365 },
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

/* ─── Sub: Frequency Selector ─── */
function FreqSelector({ value, set }: { value: number; set: (v: number) => void }) {
    return (
        <div style={{ marginBottom: "var(--s-4)" }}>
            <label style={{ fontWeight: 600, fontSize: "0.92rem", display: "block", marginBottom: 8 }}>Compounding Frequency</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FREQ.map((f, i) => (
                    <button key={i} onClick={() => set(i)} style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                        border: i === value ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: i === value ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: i === value ? 700 : 500,
                        color: i === value ? "var(--n-primary)" : "var(--n-text)",
                    }}>{f.label}</button>
                ))}
            </div>
        </div>
    );
}

/* ═══════════ MODE 1: LUMP SUM ═══════════ */
function LumpSumMode() {
    const [principal, setPrincipal] = useState(1_00_000);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(10);
    const [freqIdx, setFreqIdx] = useState(2); // quarterly
    const [showTable, setShowTable] = useState(false);

    const n = FREQ[freqIdx].n;
    const maturity = CI(principal, rate, n, years);
    const interest = maturity - principal;
    const siMaturity = SI(principal, rate, years);
    const siInterest = siMaturity - principal;
    const ciAdvantage = interest - siInterest;

    const yearlyData = useMemo(() => {
        const rows: { year: number; opening: number; interestEarned: number; closing: number }[] = [];
        for (let y = 1; y <= years; y++) {
            const opening = CI(principal, rate, n, y - 1);
            const closing = CI(principal, rate, n, y);
            rows.push({ year: y, opening, interestEarned: closing - opening, closing });
        }
        return rows;
    }, [principal, rate, n, years]);

    return (
        <>
            <SliderRow label="Principal Amount" value={principal} set={setPrincipal} min={1000} max={10_00_00_000} step={1000} />
            <SliderRow label="Annual Interest Rate" value={rate} set={setRate} min={1} max={20} step={0.1} suffix="%" />
            <SliderRow label="Time Period" value={years} set={setYears} min={1} max={50} step={1} suffix="yrs" />
            <FreqSelector value={freqIdx} set={setFreqIdx} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>Results — {FREQ[freqIdx].label} Compounding</div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-text)" }}>{fmt(maturity)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--n-text-muted)", marginTop: 4 }}>Maturity Amount</div>
                </div>

                <table style={{ width: "100%", marginTop: "var(--s-4)", fontSize: "0.88rem" }}>
                    <tbody>
                        <tr><td style={{ padding: "6px 0", color: "var(--n-text-muted)" }}>Principal Invested</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(principal)}</td></tr>
                        <tr><td style={{ padding: "6px 0", color: "var(--n-text-muted)" }}>Compound Interest Earned</td><td style={{ textAlign: "right", fontWeight: 600, color: "#16a34a" }}>{fmt(interest)}</td></tr>
                        <tr style={{ borderTop: "1px dashed var(--n-border)" }}><td style={{ padding: "6px 0", color: "var(--n-text-muted)" }}>Simple Interest (for comparison)</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(siInterest)}</td></tr>
                        <tr><td style={{ padding: "6px 0", color: "var(--n-text-muted)" }}>CI Advantage over SI</td><td style={{ textAlign: "right", fontWeight: 600, color: "var(--n-primary)" }}>+{fmt(ciAdvantage)}</td></tr>
                    </tbody>
                </table>

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Formula:</strong> A = P × (1 + r/n)<sup>n×t</sup> = {fmt(principal)} × (1 + {rate}%/{n})<sup>{n}×{years}</sup> = <strong>{fmt(maturity)}</strong>
                </div>

                <button onClick={() => setShowTable(!showTable)} style={{
                    marginTop: "var(--s-3)", width: "100%", padding: "10px", border: "1px solid var(--n-border)",
                    borderRadius: 8, background: "var(--n-surface)", cursor: "pointer", fontWeight: 600, fontSize: "0.88rem",
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

/* ═══════════ MODE 2: RECURRING / SIP ═══════════ */
function RecurringMode() {
    const [monthly, setMonthly] = useState(5000);
    const [rate, setRate] = useState(8);
    const [years, setYears] = useState(15);
    const [stepUp, setStepUp] = useState(0);

    const result = useMemo(() => {
        let totalInvested = 0;
        let totalValue = 0;
        const r = rate / 100 / 12;
        const rows: { year: number; invested: number; value: number }[] = [];

        for (let y = 1; y <= years; y++) {
            const currentMonthly = monthly * Math.pow(1 + stepUp / 100, y - 1);
            for (let m = 0; m < 12; m++) {
                totalInvested += currentMonthly;
                totalValue = (totalValue + currentMonthly) * (1 + r);
            }
            rows.push({ year: y, invested: totalInvested, value: totalValue });
        }
        return { totalInvested, totalValue, interest: totalValue - totalInvested, rows };
    }, [monthly, rate, years, stepUp]);

    return (
        <>
            <SliderRow label="Monthly Investment" value={monthly} set={setMonthly} min={500} max={5_00_000} step={500} />
            <SliderRow label="Expected Annual Return" value={rate} set={setRate} min={1} max={20} step={0.5} suffix="%" />
            <SliderRow label="Investment Period" value={years} set={setYears} min={1} max={40} step={1} suffix="yrs" />
            <SliderRow label="Annual Step-up" value={stepUp} set={setStepUp} min={0} max={25} step={1} suffix="%" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>Maturity Value</div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-text)" }}>{fmt(result.totalValue)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--n-text-muted)", marginTop: 4 }}>After {years} years{stepUp > 0 ? ` with ${stepUp}% annual step-up` : ""}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-4)", textAlign: "center" }}>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Total Invested</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{fmt(result.totalInvested)}</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Interest Earned</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#16a34a" }}>{fmt(result.interest)}</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "12px" }}>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 4 }}>Wealth Gain</div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--n-primary)" }}>{result.totalInvested > 0 ? ((result.totalValue / result.totalInvested - 1) * 100).toFixed(1) : 0}%</div>
                    </div>
                </div>

                {stepUp > 0 && (
                    <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                        <strong>Step-up Note:</strong> Monthly investment starts at {fmt(monthly)} in Year 1 and grows to {fmt(monthly * Math.pow(1 + stepUp / 100, years - 1))} by Year {years}
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════════ MODE 3: FD COMPARISON ═══════════ */
const FD_SCHEMES = [
    { name: "SBI FD", rate: 6.50, seniorRate: 7.00, freq: 4, tenure: 5, taxable: true },
    { name: "HDFC Bank FD", rate: 6.60, seniorRate: 7.10, freq: 4, tenure: 5, taxable: true },
    { name: "ICICI Bank FD", rate: 6.70, seniorRate: 7.20, freq: 4, tenure: 5, taxable: true },
    { name: "PPF", rate: 7.10, seniorRate: 7.10, freq: 1, tenure: 15, taxable: false },
    { name: "NSC (5-Year)", rate: 7.70, seniorRate: 7.70, freq: 1, tenure: 5, taxable: false },
    { name: "KVP", rate: 7.50, seniorRate: 7.50, freq: 1, tenure: 10, taxable: true },
    { name: "Post Office TD (5Y)", rate: 7.50, seniorRate: 7.50, freq: 4, tenure: 5, taxable: true },
    { name: "SCSS", rate: 8.20, seniorRate: 8.20, freq: 4, tenure: 5, taxable: true },
    { name: "Sukanya Samriddhi", rate: 8.20, seniorRate: 8.20, freq: 1, tenure: 21, taxable: false },
];

function FDCompareMode() {
    const [principal, setPrincipal] = useState(5_00_000);
    const [isSenior, setIsSenior] = useState(false);

    const computed = FD_SCHEMES.map(s => {
        const r = isSenior ? s.seniorRate : s.rate;
        const maturity = CI(principal, r, s.freq, s.tenure);
        const interest = maturity - principal;
        return { ...s, effectiveRate: r, maturity, interest };
    }).sort((a, b) => b.interest / b.maturity - a.interest / a.maturity);

    const bestIdx = computed.reduce((best, s, i) =>
        (s.interest > computed[best].interest && !s.taxable) ? i :
        (s.interest > computed[best].interest) ? i : best, 0);

    return (
        <>
            <SliderRow label="Investment Amount" value={principal} set={setPrincipal} min={10_000} max={5_00_00_000} step={10_000} />
            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: "0.92rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={isSenior} onChange={e => setIsSenior(e.target.checked)}
                        style={{ width: 18, height: 18, accentColor: "var(--n-primary)" }} />
                    Senior Citizen (60+) — Higher FD Rates
                </label>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    Comparison — {fmt(principal)} Investment
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "8px 4px" }}>Scheme</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Rate</th>
                            <th style={{ textAlign: "center", padding: "8px 4px" }}>Freq.</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Tenure</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Maturity</th>
                            <th style={{ textAlign: "right", padding: "8px 4px" }}>Interest</th>
                            <th style={{ textAlign: "center", padding: "8px 4px" }}>Tax</th>
                        </tr></thead>
                        <tbody>
                            {computed.map((s, i) => (
                                <tr key={i} style={{
                                    borderBottom: "1px solid var(--n-border)",
                                    background: i === bestIdx ? "var(--n-primary-light)" : "transparent",
                                }}>
                                    <td style={{ padding: "8px 4px", fontWeight: i === bestIdx ? 700 : 500 }}>
                                        {i === bestIdx && "⭐ "}{s.name}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600 }}>{s.effectiveRate}%</td>
                                    <td style={{ textAlign: "center", padding: "8px 4px", fontSize: "0.78rem" }}>{s.freq === 1 ? "Annual" : s.freq === 4 ? "Qtrly" : "Monthly"}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px" }}>{s.tenure} yr</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 600 }}>{fmt(s.maturity)}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", color: "#16a34a", fontWeight: 600 }}>+{fmt(s.interest)}</td>
                                    <td style={{ textAlign: "center", padding: "8px 4px" }}>{s.taxable ? "📋 Taxable" : "✅ EEE"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Note:</strong> Rates as of Q1 FY 2025-26. Bank FDs compound quarterly; PPF and NSC compound annually. EEE = Exempt-Exempt-Exempt (no tax on investment, interest, or maturity).
                </div>
            </div>
        </>
    );
}

/* ═══════════ MODE 4: COST OF DELAY ═══════════ */
function DelayMode() {
    const [monthly, setMonthly] = useState(5000);
    const [rate, setRate] = useState(12);
    const [retireAge, setRetireAge] = useState(60);
    const [startA, setStartA] = useState(25);
    const [startB, setStartB] = useState(35);

    const calcCorpus = (start: number) => {
        const yrs = Math.max(retireAge - start, 1);
        const r = rate / 100 / 12;
        // FV of an annuity: PMT × [((1+r)^n - 1) / r]
        const n = yrs * 12;
        if (r === 0) return monthly * n;
        return monthly * ((Math.pow(1 + r, n) - 1) / r);
    };

    const corpusA = calcCorpus(startA);
    const corpusB = calcCorpus(startB);
    const investedA = monthly * 12 * Math.max(retireAge - startA, 1);
    const investedB = monthly * 12 * Math.max(retireAge - startB, 1);
    const costOfDelay = Math.max(corpusA - corpusB, 0);
    const delaYears = Math.abs(startB - startA);

    return (
        <>
            <SliderRow label="Monthly Investment" value={monthly} set={setMonthly} min={500} max={1_00_000} step={500} />
            <SliderRow label="Expected Annual Return" value={rate} set={setRate} min={4} max={18} step={0.5} suffix="%" />
            <SliderRow label="Target Retirement Age" value={retireAge} set={setRetireAge} min={45} max={70} step={1} suffix="yrs" />
            <SliderRow label="Early Bird — Start at Age" value={startA} set={setStartA} min={18} max={45} step={1} suffix="yrs" />
            <SliderRow label="Late Starter — Start at Age" value={startB} set={setStartB} min={20} max={55} step={1} suffix="yrs" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                    Cost of {delaYears}-Year Delay
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#dc2626" }}>{fmt(costOfDelay)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--n-text-muted)", marginTop: 4 }}>Lost wealth due to {delaYears}-year delay</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
                    <div style={{ background: "var(--n-success-light)", borderRadius: 10, padding: "var(--s-4)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>🟢 Start at Age {startA}</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmt(corpusA)}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Invested: {fmt(investedA)}</div>
                        <div style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 600, marginTop: 2 }}>Interest: +{fmt(corpusA - investedA)}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 4 }}>{retireAge - startA} years of investing</div>
                    </div>

                    <div style={{ background: "#fef2f2", borderRadius: 10, padding: "var(--s-4)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>🔴 Start at Age {startB}</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmt(corpusB)}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Invested: {fmt(investedB)}</div>
                        <div style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 600, marginTop: 2 }}>Interest: +{fmt(corpusB - investedB)}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 4 }}>{retireAge - startB} years of investing</div>
                    </div>
                </div>

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--n-surface)", borderRadius: 8, fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                    <strong>Insight:</strong> Starting {delaYears} years earlier at {fmt(monthly)}/mo, you invest {fmt(investedA - investedB)} more — but earn {fmt(costOfDelay)} more in total. The extra interest alone is {investedA - investedB > 0 ? ((costOfDelay / (investedA - investedB)).toFixed(1)) : "∞"}× your additional investment.
                </div>
            </div>
        </>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function CompoundInterestIndiaCore() {
    const [mode, setMode] = useState<Mode>("lumpsum");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>📊 Compound Interest Calculator</h2>
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
                {mode === "lumpsum" && <LumpSumMode />}
                {mode === "recurring" && <RecurringMode />}
                {mode === "fdcompare" && <FDCompareMode />}
                {mode === "delay" && <DelayMode />}
            </div>
        </div>
    );
}
