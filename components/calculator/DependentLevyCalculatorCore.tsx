"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number) => n.toLocaleString("en-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n: number) => n.toLocaleString("en-SA", { maximumFractionDigits: 0 });

/* ── Sub-components ── */
function InputField({ label, value, onChange, unit, placeholder, step, min, max, note }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string; step?: number; min?: number; max?: number; note?: string;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min ?? 0} max={max} step={step || 1} placeholder={placeholder || "0"} />
            {note && <p style={{ fontSize: "0.73rem", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{note}</p>}
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </div>
    );
}

function ResultRow({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: boolean }) {
    return (
        <div className="con-result-row" style={highlight ? { background: "rgba(0,100,70,0.06)", borderRadius: 6, padding: "12px 0", margin: "4px 0" } : sub ? { paddingLeft: 16 } : {}}>
            <span className="con-result-row__label" style={highlight ? { fontWeight: 700, color: "var(--n-text)" } : sub ? { fontSize: "0.85rem", color: "var(--n-text-secondary)" } : {}}>{label}</span>
            <span className="con-result-row__value" style={highlight ? { fontSize: "1.1rem", color: "#006446" } : {}}>{value}</span>
        </div>
    );
}

/* ── Constants ── */
const MONTHLY_RATE = 400; // SAR per dependent per month
const DOMESTIC_WORKER_ANNUAL = 9600; // SAR per excess domestic worker per year

/* ── Main Component ── */
export default function DependentLevyCalculatorCore() {
    const [spouse, setSpouse] = useState("1");
    const [children, setChildren] = useState("2");
    const [parents, setParents] = useState("0");
    const [domesticWorkers, setDomesticWorkers] = useState("0");
    const [sponsorType, setSponsorType] = useState<"expat" | "saudi" | "premium">("expat");
    const [salary, setSalary] = useState("");
    const [duration, setDuration] = useState("12");

    const result = useMemo(() => {
        const nSpouse = Math.max(0, Math.round(parseFloat(spouse) || 0));
        const nChildren = Math.max(0, Math.round(parseFloat(children) || 0));
        const nParents = Math.max(0, Math.round(parseFloat(parents) || 0));
        const nDomestic = Math.max(0, Math.round(parseFloat(domesticWorkers) || 0));
        const monthlySalary = parseFloat(salary) || 0;
        const months = Math.max(1, Math.min(24, Math.round(parseFloat(duration) || 12)));

        // Total family dependents (levy applies)
        const totalFamilyDeps = nSpouse + nChildren + nParents;

        // Monthly & annual dependent levy
        const monthlyDependentLevy = totalFamilyDeps * MONTHLY_RATE;
        const annualDependentLevy = monthlyDependentLevy * 12;
        const periodDependentLevy = monthlyDependentLevy * months;

        // Domestic worker levy (separate fee structure)
        const freeWorkerLimit = sponsorType === "expat" ? 2 : 4; // Saudi & Premium get 4 free
        const excessWorkers = Math.max(0, nDomestic - freeWorkerLimit);
        const annualDomesticLevy = excessWorkers * DOMESTIC_WORKER_ANNUAL;
        const monthlyDomesticLevy = annualDomesticLevy / 12;
        const periodDomesticLevy = monthlyDomesticLevy * months;

        // Totals
        const totalMonthly = monthlyDependentLevy + monthlyDomesticLevy;
        const totalAnnual = annualDependentLevy + annualDomesticLevy;
        const totalPeriod = periodDependentLevy + periodDomesticLevy;
        const dailyCost = totalMonthly / 30;

        // Salary impact
        const salaryPct = monthlySalary > 0 ? (totalMonthly / monthlySalary) * 100 : 0;
        const remainingAfterLevy = monthlySalary > 0 ? monthlySalary - totalMonthly : 0;

        // 5-year projection
        const fiveYearTotal = totalAnnual * 5;

        return {
            totalFamilyDeps, nDomestic, freeWorkerLimit, excessWorkers,
            monthlyDependentLevy, annualDependentLevy, periodDependentLevy,
            monthlyDomesticLevy, annualDomesticLevy, periodDomesticLevy,
            totalMonthly, totalAnnual, totalPeriod, dailyCost,
            salaryPct, remainingAfterLevy, fiveYearTotal, months,
        };
    }, [spouse, children, parents, domesticWorkers, sponsorType, salary, duration]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة رسوم المرافقين — Dependent Levy Calculator</h2>
                <p className="con-calc__desc">Calculate total cost of sponsoring family members and domestic workers in Saudi Arabia. SAR 400/month per dependent.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {/* Family Dependents */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>👨‍👩‍👧‍👦 Family Dependents</p>
                    <InputField label="Spouse" value={spouse} onChange={setSpouse} min={0} max={1} note="0 or 1" />
                    <InputField label="Children" value={children} onChange={setChildren} min={0} max={20} />
                    <InputField label="Parents (if sponsored)" value={parents} onChange={setParents} min={0} max={4} />
                </div>

                {/* Domestic Workers */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>🏠 Domestic Workers</p>
                    <InputField label="Number of Domestic Workers" value={domesticWorkers} onChange={setDomesticWorkers} min={0} max={10} />
                    <SelectField label="Sponsor Type" value={sponsorType} onChange={(v) => setSponsorType(v as "expat" | "saudi" | "premium")} options={[
                        { value: "expat", label: "Expatriate (first 2 free)" },
                        { value: "saudi", label: "Saudi Citizen (first 4 free)" },
                        { value: "premium", label: "Premium Residency (first 4 free)" },
                    ]} />
                    {result.excessWorkers > 0 && (
                        <p style={{ fontSize: "0.75rem", color: "#c83c00", marginTop: "var(--s-2)" }}>
                            ⚠️ {result.excessWorkers} worker{result.excessWorkers > 1 ? "s" : ""} exceed{result.excessWorkers === 1 ? "s" : ""} the free limit → SAR {fmtInt(result.annualDomesticLevy)}/year levy applies
                        </p>
                    )}
                </div>

                {/* Duration & Salary */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 Duration & Salary Impact</p>
                    <SelectField label="Iqama / Payment Period" value={duration} onChange={setDuration} options={[
                        { value: "1", label: "1 month" },
                        { value: "3", label: "3 months" },
                        { value: "6", label: "6 months" },
                        { value: "12", label: "12 months (1 year)" },
                        { value: "24", label: "24 months (2 years)" },
                    ]} />
                    <InputField label="Monthly Gross Salary" value={salary} onChange={setSalary} unit="SAR" placeholder="Optional — for salary impact" />
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>Dependent Levy Breakdown</h4>

                {/* Main Cost */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(0,100,70,0.06) 0%, rgba(0,100,70,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(0,100,70,0.12)", marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>Total for {result.months} month{result.months > 1 ? "s" : ""}</p>
                    <p style={{ fontSize: "2rem", fontWeight: 800, color: "#006446", letterSpacing: "-1px" }}>SAR {fmt(result.totalPeriod)}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                        {result.totalFamilyDeps} dependent{result.totalFamilyDeps !== 1 ? "s" : ""}{result.excessWorkers > 0 ? ` + ${result.excessWorkers} excess domestic worker${result.excessWorkers > 1 ? "s" : ""}` : ""}
                    </p>
                </div>

                {/* Family Dependents */}
                <ResultRow label="Family Dependents" value={String(result.totalFamilyDeps)} />
                <ResultRow label="Monthly Dependent Levy" value={`SAR ${fmt(result.monthlyDependentLevy)}`} sub />
                <ResultRow label={`${result.months}-Month Dependent Levy`} value={`SAR ${fmt(result.periodDependentLevy)}`} sub />
                <ResultRow label="Annual Dependent Levy" value={`SAR ${fmt(result.annualDependentLevy)}`} sub />

                {/* Domestic Workers (if applicable) */}
                {result.nDomestic > 0 && (
                    <>
                        <div style={{ height: 1, background: "var(--n-border)", margin: "var(--s-3) 0" }} />
                        <ResultRow label="Domestic Workers" value={`${result.nDomestic} (${result.freeWorkerLimit} free)`} />
                        <ResultRow label="Workers Subject to Levy" value={String(result.excessWorkers)} sub />
                        <ResultRow label="Monthly Domestic Levy" value={`SAR ${fmt(result.monthlyDomesticLevy)}`} sub />
                        <ResultRow label="Annual Domestic Levy" value={`SAR ${fmt(result.annualDomesticLevy)}`} sub />
                    </>
                )}

                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <ResultRow label="Total Monthly Cost" value={`SAR ${fmt(result.totalMonthly)}`} highlight />
                <ResultRow label="Total Annual Cost" value={`SAR ${fmt(result.totalAnnual)}`} highlight />
                <ResultRow label="Daily Cost" value={`SAR ${fmt(result.dailyCost)}`} sub />
                <ResultRow label="5-Year Projection" value={`SAR ${fmtInt(result.fiveYearTotal)}`} sub />

                {/* Salary Impact */}
                {parseFloat(salary) > 0 && (
                    <>
                        <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                        <h4>Salary Impact</h4>
                        <ResultRow label="Monthly Salary" value={`SAR ${fmt(parseFloat(salary))}`} />
                        <ResultRow label="Dependent Levy as % of Salary" value={`${result.salaryPct.toFixed(1)}%`} />
                        <ResultRow label="Remaining After Levy" value={`SAR ${fmt(result.remainingAfterLevy)}`} highlight />
                    </>
                )}
            </div>
        </div>
    );
}
