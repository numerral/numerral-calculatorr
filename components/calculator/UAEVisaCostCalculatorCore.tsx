"use client";
import { useState, useMemo, useCallback } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 0) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function ResultRow({ label, value, highlight, warn, danger, sub }: { label: string; value: string; highlight?: boolean; warn?: boolean; danger?: boolean; sub?: boolean }) {
    const style = highlight
        ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" }
        : warn
            ? { background: "rgba(234,179,8,0.08)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" }
            : danger
                ? { background: "rgba(220,38,38,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" }
                : undefined;
    const valStyle = highlight
        ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" }
        : warn
            ? { color: "#b45309", fontWeight: 700 }
            : danger
                ? { color: "#dc2626", fontWeight: 700 }
                : sub
                    ? { color: "var(--text-muted)", fontSize: "0.88rem" }
                    : undefined;
    return (<div className="con-result-row" style={style}>
        <span className="con-result-row__label" style={sub ? { fontSize: "0.88rem", paddingLeft: 12 } : undefined}>{label}</span>
        <span className="con-result-row__value" style={valStyle}>{value}</span>
    </div>);
}

/* ═══════════════════════════════════════════════════
   VISA TYPE DATA
   ═══════════════════════════════════════════════════ */
type VisaCategory = "tourist" | "employment" | "golden" | "green" | "family" | "student" | "remote" | "retirement" | "jobseeker" | "transit";

interface VisaVariant {
    id: string;
    label: string;
    application: number;
    medical: number;
    eid: number;
    stamping: number;
    typing: number;
    insurance: number;
    otherFees: number;
    otherLabel: string;
    duration: string;
    notes: string;
    eligibility: string;
    statusChangeFee: number; // if applying from inside UAE
}

interface VisaType {
    id: VisaCategory;
    name: string;
    icon: string;
    variants: VisaVariant[];
}

const VISA_TYPES: VisaType[] = [
    {
        id: "tourist", name: "Tourist Visa", icon: "✈️",
        variants: [
            { id: "tourist-30-single", label: "30-Day Single Entry", application: 350, medical: 0, eid: 0, stamping: 0, typing: 0, insurance: 100, otherFees: 50, otherLabel: "Service fee", duration: "30 days", notes: "Most common for short visits", eligibility: "Valid passport (6+ months)", statusChangeFee: 0 },
            { id: "tourist-60-single", label: "60-Day Single Entry", application: 550, medical: 0, eid: 0, stamping: 0, typing: 0, insurance: 100, otherFees: 50, otherLabel: "Service fee", duration: "60 days", notes: "Extended stay for leisure", eligibility: "Valid passport (6+ months)", statusChangeFee: 0 },
            { id: "tourist-90-single", label: "90-Day Single Entry", application: 650, medical: 0, eid: 0, stamping: 0, typing: 0, insurance: 150, otherFees: 1000, otherLabel: "Security deposit (refundable)", duration: "90 days", notes: "Refundable AED 1,000 security deposit may apply", eligibility: "Valid passport (6+ months)", statusChangeFee: 0 },
            { id: "tourist-30-multi", label: "30-Day Multiple Entry", application: 650, medical: 0, eid: 0, stamping: 0, typing: 0, insurance: 100, otherFees: 50, otherLabel: "Service fee", duration: "30 days/visit, 5-year validity", notes: "For frequent travelers", eligibility: "Bank balance proof (USD 4,000+), return ticket, health insurance", statusChangeFee: 0 },
            { id: "tourist-60-multi", label: "60-Day Multiple Entry", application: 1050, medical: 0, eid: 0, stamping: 0, typing: 0, insurance: 150, otherFees: 50, otherLabel: "Service fee", duration: "60 days/visit, 5-year validity", notes: "Premium multiple entry", eligibility: "Bank balance proof (USD 4,000+), return ticket, health insurance", statusChangeFee: 0 },
        ],
    },
    {
        id: "employment", name: "Employment Visa", icon: "💼",
        variants: [
            { id: "emp-mainland-c1", label: "Mainland — Class 1 Company", application: 210, medical: 400, eid: 370, stamping: 535, typing: 150, insurance: 0, otherFees: 0, otherLabel: "", duration: "2 years", notes: "Class 1: top-rated MoHRE companies, no work permit fee", eligibility: "Job offer + employer sponsorship", statusChangeFee: 500 },
            { id: "emp-mainland-c2", label: "Mainland — Class 2 Company", application: 210, medical: 400, eid: 370, stamping: 535, typing: 150, insurance: 0, otherFees: 900, otherLabel: "Work permit (Class 2 avg)", duration: "2 years", notes: "Class 2 work permit: AED 300–1,500 depending on skill level", eligibility: "Job offer + employer sponsorship", statusChangeFee: 500 },
            { id: "emp-mainland-c3", label: "Mainland — Class 3 Company", application: 210, medical: 400, eid: 370, stamping: 535, typing: 150, insurance: 0, otherFees: 5000, otherLabel: "Work permit (Class 3)", duration: "2 years", notes: "Class 3 companies: AED 5,000 work permit fee for all workers", eligibility: "Job offer + employer sponsorship", statusChangeFee: 500 },
            { id: "emp-freezone", label: "Free Zone Company", application: 210, medical: 400, eid: 370, stamping: 535, typing: 150, insurance: 0, otherFees: 500, otherLabel: "FZ processing fee", duration: "2–3 years", notes: "Fees vary by free zone; typically AED 2,500–6,500 total", eligibility: "Job offer from free zone entity", statusChangeFee: 500 },
            { id: "emp-3yr", label: "Mainland — 3-Year Visa", application: 210, medical: 400, eid: 480, stamping: 560, typing: 150, insurance: 0, otherFees: 900, otherLabel: "Work permit (avg)", duration: "3 years", notes: "Available for skilled workers in select sectors", eligibility: "Skilled job offer + employer sponsorship", statusChangeFee: 500 },
        ],
    },
    {
        id: "golden", name: "Golden Visa", icon: "🏅",
        variants: [
            { id: "golden-investor-10yr", label: "Property Investor (10-Year)", application: 3800, medical: 700, eid: 1150, stamping: 0, typing: 150, insurance: 1500, otherFees: 320, otherLabel: "DLD nomination letter", duration: "10 years", notes: "Requires property worth AED 2,000,000+. Total ~AED 10,000", eligibility: "Property investment ≥ AED 2,000,000", statusChangeFee: 0 },
            { id: "golden-investor-5yr", label: "Property Investor (5-Year)", application: 3200, medical: 700, eid: 570, stamping: 0, typing: 150, insurance: 1500, otherFees: 320, otherLabel: "DLD nomination letter", duration: "5 years", notes: "Requires property worth AED 750,000+", eligibility: "Property investment ≥ AED 750,000", statusChangeFee: 0 },
            { id: "golden-professional", label: "Skilled Professional", application: 3500, medical: 700, eid: 1150, stamping: 0, typing: 150, insurance: 1500, otherFees: 500, otherLabel: "Admin/govt fees", duration: "10 years", notes: "Minimum AED 30,000/mo salary requirement", eligibility: "Monthly salary ≥ AED 30,000 in priority fields", statusChangeFee: 0 },
            { id: "golden-entrepreneur", label: "Entrepreneur", application: 3500, medical: 700, eid: 1150, stamping: 0, typing: 150, insurance: 1500, otherFees: 500, otherLabel: "Admin/govt fees", duration: "10 years", notes: "Startup/business value ≥ AED 500,000", eligibility: "Business value ≥ AED 500,000 or approved by authorities", statusChangeFee: 0 },
            { id: "golden-student", label: "Outstanding Student/Graduate", application: 2800, medical: 500, eid: 570, stamping: 0, typing: 150, insurance: 1000, otherFees: 300, otherLabel: "Admin fees", duration: "5 years", notes: "From top 500 global universities", eligibility: "GPA ≥ 3.8/4.0 or from top 500 university", statusChangeFee: 0 },
            { id: "golden-retiree", label: "Retiree", application: 3200, medical: 700, eid: 570, stamping: 0, typing: 150, insurance: 1800, otherFees: 500, otherLabel: "Admin fees", duration: "5 years", notes: "Must be 55+ and meet financial thresholds", eligibility: "Age 55+; property ≥ AED 1M, or savings ≥ AED 1M, or income ≥ AED 15,000/mo", statusChangeFee: 0 },
        ],
    },
    {
        id: "green", name: "Green Visa", icon: "🌿",
        variants: [
            { id: "green-freelancer", label: "Freelancer / Self-Employed", application: 2500, medical: 400, eid: 570, stamping: 600, typing: 150, insurance: 1500, otherFees: 8000, otherLabel: "MoHRE/FZ freelance permit (avg)", duration: "5 years", notes: "Permit cost varies: AED 6,000–10,000 depending on profession", eligibility: "Bachelor's degree + AED 360,000/yr income (2 years)", statusChangeFee: 500 },
            { id: "green-skilled", label: "Skilled Employee", application: 2500, medical: 400, eid: 570, stamping: 600, typing: 150, insurance: 1500, otherFees: 0, otherLabel: "", duration: "5 years", notes: "Self-sponsored — no employer sponsorship needed", eligibility: "Salary ≥ AED 15,000/mo + bachelor's degree + MoHRE level 1-3", statusChangeFee: 500 },
            { id: "green-investor", label: "Business Investor", application: 2500, medical: 400, eid: 570, stamping: 600, typing: 150, insurance: 1500, otherFees: 0, otherLabel: "", duration: "5 years", notes: "AED 1M minimum investment in business", eligibility: "Business investment ≥ AED 1,000,000 + trade license", statusChangeFee: 500 },
        ],
    },
    {
        id: "family", name: "Family / Dependent Visa", icon: "👨‍👩‍👧‍👦",
        variants: [
            { id: "family-spouse", label: "Spouse", application: 200, medical: 400, eid: 370, stamping: 750, typing: 150, insurance: 400, otherFees: 0, otherLabel: "", duration: "Tied to sponsor's visa", notes: "Per person cost. Attested marriage certificate required", eligibility: "Sponsor salary ≥ AED 4,000/mo (male) or AED 10,000/mo (female)", statusChangeFee: 500 },
            { id: "family-child", label: "Child (under 18)", application: 200, medical: 0, eid: 370, stamping: 750, typing: 150, insurance: 300, otherFees: 0, otherLabel: "", duration: "Tied to sponsor's visa", notes: "No medical test for children under 18. Birth certificate required", eligibility: "Sponsor salary ≥ AED 4,000/mo. Sons up to 25, unmarried daughters any age", statusChangeFee: 500 },
            { id: "family-child-adult", label: "Adult Child (18-25)", application: 200, medical: 400, eid: 370, stamping: 750, typing: 150, insurance: 400, otherFees: 0, otherLabel: "", duration: "Tied to sponsor's visa", notes: "Medical test required for 18+. Only sons up to 25", eligibility: "Sponsor salary ≥ AED 4,000/mo. Attested birth certificate", statusChangeFee: 500 },
            { id: "family-parent", label: "Parent", application: 200, medical: 500, eid: 370, stamping: 750, typing: 150, insurance: 800, otherFees: 0, otherLabel: "", duration: "1 year (renewable)", notes: "Higher insurance for elderly. Must prove sole supporter", eligibility: "Sponsor salary ≥ AED 10,000/mo. Proof of sole support required", statusChangeFee: 500 },
        ],
    },
    {
        id: "student", name: "Student Visa", icon: "🎓",
        variants: [
            { id: "student-1yr", label: "University Student (1-Year)", application: 1500, medical: 350, eid: 370, stamping: 500, typing: 150, insurance: 500, otherFees: 0, otherLabel: "", duration: "1 year (renewable annually)", notes: "Sponsored by university. Can work part-time (20hr/week with permit)", eligibility: "Admission letter + financial proof + valid passport", statusChangeFee: 500 },
        ],
    },
    {
        id: "remote", name: "Remote Work Visa", icon: "💻",
        variants: [
            { id: "remote-1yr", label: "Remote Worker (1-Year)", application: 2870, medical: 500, eid: 370, stamping: 0, typing: 150, insurance: 1500, otherFees: 0, otherLabel: "", duration: "1 year (renewable)", notes: "Work for international companies while living in the UAE", eligibility: "Monthly income ≥ USD 5,000 (AED 18,360) + employment letter", statusChangeFee: 0 },
        ],
    },
    {
        id: "retirement", name: "Retirement Visa", icon: "🏖️",
        variants: [
            { id: "retire-5yr", label: "Retirement Visa (5-Year)", application: 3200, medical: 700, eid: 570, stamping: 0, typing: 150, insurance: 2000, otherFees: 800, otherLabel: "Admin/govt fees", duration: "5 years (renewable)", notes: "For retirees 55+ with financial stability", eligibility: "Age 55+; property ≥ AED 1M, OR savings ≥ AED 1M, OR income ≥ AED 15,000/mo", statusChangeFee: 0 },
        ],
    },
    {
        id: "jobseeker", name: "Job Seeker Visa", icon: "🔍",
        variants: [
            { id: "jobseeker-60", label: "Job Seeker (60 Days)", application: 500, medical: 0, eid: 0, stamping: 0, typing: 100, insurance: 100, otherFees: 0, otherLabel: "", duration: "60 days (non-renewable)", notes: "Explore employment opportunities", eligibility: "Bachelor's from top 500 university or skilled professional", statusChangeFee: 0 },
            { id: "jobseeker-120", label: "Job Seeker (120 Days)", application: 1500, medical: 0, eid: 0, stamping: 0, typing: 100, insurance: 200, otherFees: 0, otherLabel: "", duration: "120 days (non-renewable)", notes: "Extended job search period", eligibility: "Bachelor's from top 500 university or skilled professional", statusChangeFee: 0 },
        ],
    },
    {
        id: "transit", name: "Transit Visa", icon: "🔄",
        variants: [
            { id: "transit-48h", label: "48-Hour Transit (FREE)", application: 0, medical: 0, eid: 0, stamping: 0, typing: 0, insurance: 0, otherFees: 0, otherLabel: "", duration: "48 hours", notes: "Free at airport immigration for 8+ hour layovers", eligibility: "Confirmed onward flight within 48 hours", statusChangeFee: 0 },
            { id: "transit-96h", label: "96-Hour Transit", application: 150, medical: 0, eid: 0, stamping: 0, typing: 0, insurance: 0, otherFees: 0, otherLabel: "", duration: "96 hours", notes: "Paid option for longer layovers", eligibility: "Confirmed onward flight within 96 hours", statusChangeFee: 0 },
        ],
    },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function UAEVisaCostCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🛂 Visa Cost Calculator", "⏰ Overstay Calculator", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🛂 Visa Cost Calculator — UAE 2026</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <VisaCostTab />}
        {tab === 1 && <OverstayTab />}
        {tab === 2 && <ReferenceTab />}
    </div>);
}

/* ═══════════════════════════════════════════════════
   VISA COST CALCULATOR TAB
   ═══════════════════════════════════════════════════ */
function VisaCostTab() {
    const [selectedType, setSelectedType] = useState<VisaCategory>("tourist");
    const [selectedVariantId, setSelectedVariantId] = useState("tourist-30-single");
    const [insideUAE, setInsideUAE] = useState(false);
    const [dependents, setDependents] = useState("0");

    const visaType = useMemo(() => VISA_TYPES.find(v => v.id === selectedType)!, [selectedType]);
    const variant = useMemo(() => visaType.variants.find(v => v.id === selectedVariantId) || visaType.variants[0], [visaType, selectedVariantId]);

    const handleTypeChange = useCallback((type: VisaCategory) => {
        setSelectedType(type);
        const vt = VISA_TYPES.find(v => v.id === type)!;
        setSelectedVariantId(vt.variants[0].id);
    }, []);

    /* Calculate costs */
    const costs = useMemo(() => {
        const statusChange = insideUAE ? variant.statusChangeFee : 0;
        const items: { label: string; amount: number }[] = [];

        if (variant.application > 0) items.push({ label: "Application / processing fee", amount: variant.application });
        if (variant.medical > 0) items.push({ label: "Medical examination", amount: variant.medical });
        if (variant.eid > 0) items.push({ label: "Emirates ID", amount: variant.eid });
        if (variant.stamping > 0) items.push({ label: "Visa stamping", amount: variant.stamping });
        if (variant.typing > 0) items.push({ label: "Typing / service center fee", amount: variant.typing });
        if (variant.insurance > 0) items.push({ label: "Health insurance (annual)", amount: variant.insurance });
        if (variant.otherFees > 0) items.push({ label: variant.otherLabel || "Other fees", amount: variant.otherFees });
        if (statusChange > 0) items.push({ label: "Status change fee (inside UAE)", amount: statusChange });

        const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
        const vat = Math.round(variant.application * 0.05);
        items.push({ label: "5% VAT on application fee", amount: vat });
        const totalPerPerson = subtotal + vat;

        /* Family / dependents */
        const numDeps = parseInt(dependents) || 0;
        let depCostEach = 0;
        if (numDeps > 0) {
            const famVariant = VISA_TYPES.find(v => v.id === "family");
            if (famVariant) {
                const spouse = famVariant.variants.find(v => v.id === "family-spouse")!;
                depCostEach = spouse.application + spouse.medical + spouse.eid + spouse.stamping + spouse.typing + spouse.insurance + (insideUAE ? spouse.statusChangeFee : 0) + Math.round(spouse.application * 0.05);
            }
        }
        const totalFamily = totalPerPerson + (depCostEach * numDeps);

        return { items, totalPerPerson, numDeps, depCostEach, totalFamily };
    }, [variant, insideUAE, dependents]);

    const showDependents = selectedType !== "transit" && selectedType !== "jobseeker" && selectedType !== "tourist";

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🛂 Estimate the total cost of any UAE visa. Select your visa type, sub-category, and number of dependents for a complete cost breakdown. All fees updated for 2025 (including new August 2025 visa categories).
            </div>

            {/* Visa type */}
            <div className="con-input">
                <label className="con-input__label" htmlFor="vc-type">Visa Type</label>
                <select id="vc-type" className="con-input__field" value={selectedType} onChange={e => handleTypeChange(e.target.value as VisaCategory)}>
                    {VISA_TYPES.map(v => <option key={v.id} value={v.id}>{v.icon} {v.name}</option>)}
                </select>
            </div>

            {/* Variant */}
            {visaType.variants.length > 1 && (
                <div className="con-input">
                    <label className="con-input__label" htmlFor="vc-variant">Sub-category</label>
                    <select id="vc-variant" className="con-input__field" value={selectedVariantId} onChange={e => setSelectedVariantId(e.target.value)}>
                        {visaType.variants.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                    </select>
                </div>
            )}

            {/* Inside UAE toggle */}
            {variant.statusChangeFee > 0 && (
                <div className="con-input">
                    <label className="con-input__label" htmlFor="vc-inside">Applying From</label>
                    <select id="vc-inside" className="con-input__field" value={insideUAE ? "inside" : "outside"} onChange={e => setInsideUAE(e.target.value === "inside")}>
                        <option value="outside">Outside UAE (new entry)</option>
                        <option value="inside">Inside UAE (status change +{fmtAED(variant.statusChangeFee)})</option>
                    </select>
                </div>
            )}

            {/* Dependents */}
            {showDependents && (
                <div className="con-input">
                    <label className="con-input__label" htmlFor="vc-deps">Number of Dependents <span className="con-input__unit">(spouse + children)</span></label>
                    <input id="vc-deps" type="number" className="con-input__field" value={dependents} onChange={e => setDependents(e.target.value)} min={0} max={10} step={1} placeholder="0" />
                </div>
            )}
        </div>

        {/* Results */}
        <div className="con-calc__results">
            <h4>{visaType.icon} {variant.label} — Cost Breakdown</h4>

            {costs.items.map((item, i) => (
                <ResultRow key={i} label={item.label} value={item.amount > 0 ? fmtAED(item.amount) : "Free"} sub />
            ))}

            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <ResultRow label="Total per person" value={fmtAED(costs.totalPerPerson)} highlight />

            {costs.numDeps > 0 && <>
                <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
                <ResultRow label={`Dependent cost (×${costs.numDeps})`} value={fmtAED(costs.depCostEach * costs.numDeps)} sub />
                <ResultRow label="Primary applicant" value={fmtAED(costs.totalPerPerson)} sub />
                <ResultRow label={`Grand Total (1 + ${costs.numDeps} dependents)`} value={fmtAED(costs.totalFamily)} highlight />
            </>}

            {/* Info panels */}
            <div style={{ marginTop: 12 }}>
                <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.04)", borderRadius: 6, fontSize: "0.82rem", marginBottom: 6, lineHeight: 1.6 }}>
                    <strong>⏱ Duration:</strong> {variant.duration}
                </div>
                <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.04)", borderRadius: 6, fontSize: "0.82rem", marginBottom: 6, lineHeight: 1.6 }}>
                    <strong>✅ Eligibility:</strong> {variant.eligibility}
                </div>
                {variant.notes && (
                    <div style={{ padding: "8px 12px", background: "rgba(234,179,8,0.06)", borderRadius: 6, fontSize: "0.82rem", lineHeight: 1.6 }}>
                        📌 {variant.notes}
                    </div>
                )}
                {selectedType === "employment" && (
                    <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 6, fontSize: "0.82rem", marginTop: 6, lineHeight: 1.6, fontWeight: 600 }}>
                        ⚖️ Under UAE law, <strong>employers must pay all visa costs</strong>. Employees should never be charged for recruitment or visa fees.
                    </div>
                )}
            </div>
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   OVERSTAY CALCULATOR TAB
   ═══════════════════════════════════════════════════ */
function OverstayTab() {
    const [days, setDays] = useState("1");
    const numDays = Math.max(0, parseInt(days) || 0);
    const dailyFine = 50;
    const totalFine = numDays * dailyFine;
    const exitFee = numDays > 0 ? 220 : 0;
    const grandTotal = totalFine + exitFee;

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(220,38,38,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ⚠️ UAE overstay fine is <strong>AED 50 per day</strong>, starting the day after your visa expires. Additional exit service fees apply. Fines accumulate quickly — even 30 days overstay = AED 1,500.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="os-days">Number of Days Overstayed</label>
                <input id="os-days" type="number" className="con-input__field" value={days} onChange={e => setDays(e.target.value)} min={0} max={730} step={1} placeholder="e.g. 30" />
            </div>
        </div>

        <div className="con-calc__results">
            <h4>Overstay Fine Calculation</h4>
            <ResultRow label="Daily fine rate" value={fmtAED(dailyFine) + "/day"} sub />
            <ResultRow label={`Days overstayed`} value={`${numDays} days`} sub />
            <ResultRow label="Overstay fine" value={fmtAED(totalFine)} warn={numDays > 0} />
            {numDays > 0 && <>
                <ResultRow label="Exit service / out-pass fee" value={fmtAED(exitFee)} sub />
                <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
                <ResultRow label="Total payable" value={fmtAED(grandTotal)} danger />
            </>}

            {numDays >= 180 && (
                <div style={{ padding: "10px 12px", background: "rgba(220,38,38,0.08)", borderRadius: 6, fontSize: "0.85rem", marginTop: 8, color: "#dc2626", fontWeight: 600 }}>
                    🚫 TRAVEL BAN RISK — Extended overstay of {numDays} days may result in travel restrictions, inability to re-enter the UAE, and possible legal action. Contact ICP or GDRFA immediately.
                </div>
            )}
            {numDays >= 30 && numDays < 180 && (
                <div style={{ padding: "10px 12px", background: "rgba(234,179,8,0.08)", borderRadius: 6, fontSize: "0.85rem", marginTop: 8, color: "#b45309", fontWeight: 600 }}>
                    ⚠️ Significant overstay — fines must be cleared before departure or visa renewal. Pay at airport immigration, Amer Centers, or ICP/GDRFA online portal.
                </div>
            )}

            {/* Quick reference table */}
            <h4 style={{ marginTop: 16 }}>Quick Overstay Reference</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Overstay Period</th>
                        <th style={{ padding: "8px 12px", textAlign: "center" }}>Fine</th>
                        <th style={{ padding: "8px 12px", textAlign: "center" }}>+ Exit Fee</th>
                        <th style={{ padding: "8px 12px", textAlign: "center" }}>Total</th>
                    </tr></thead>
                    <tbody>
                        {[1, 7, 14, 30, 60, 90, 180, 365].map(d => (
                            <tr key={d} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "6px 12px", fontWeight: 600 }}>{d} day{d > 1 ? "s" : ""}</td>
                                <td style={{ padding: "6px 12px", textAlign: "center" }}>{fmtAED(d * 50)}</td>
                                <td style={{ padding: "6px 12px", textAlign: "center" }}>{fmtAED(220)}</td>
                                <td style={{ padding: "6px 12px", textAlign: "center", fontWeight: 700, color: d >= 90 ? "#dc2626" : d >= 30 ? "#b45309" : undefined }}>{fmtAED(d * 50 + 220)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   REFERENCE TABLES TAB
   ═══════════════════════════════════════════════════ */
function ReferenceTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        {/* All visa types overview */}
        <h4>All UAE Visa Types — Cost Overview</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Visa Type</th>
                <th style={th}>Cost Range (AED)</th>
                <th style={th}>Duration</th>
                <th style={{ ...th, textAlign: "left" }}>Key Requirement</th>
            </tr></thead><tbody>
                {VISA_TYPES.map(vt => {
                    const costs = vt.variants.map(v => v.application + v.medical + v.eid + v.stamping + v.typing + v.insurance + v.otherFees);
                    const min = Math.min(...costs);
                    const max = Math.max(...costs);
                    const dur = vt.variants[0].duration;
                    const eligibility = vt.variants[0].eligibility;
                    return (
                        <tr key={vt.id} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{vt.icon} {vt.name}</td>
                            <td style={{ ...td, fontWeight: 700, color: "#009639" }}>
                                {min === max ? fmtAED(min) : `${fmtAED(min)} – ${fmtAED(max)}`}
                            </td>
                            <td style={td}>{dur}</td>
                            <td style={{ ...tl, fontSize: "0.78rem" }}>{eligibility}</td>
                        </tr>
                    );
                })}
            </tbody></table>
        </div>

        {/* Family sponsorship salary thresholds */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Family Sponsorship — Salary Thresholds</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Relationship</th>
                <th style={th}>Male Sponsor</th>
                <th style={th}>Female Sponsor</th>
                <th style={{ ...th, textAlign: "left" }}>Age Limit</th>
            </tr></thead><tbody>
                {([
                    ["Spouse", "AED 4,000/mo", "AED 10,000/mo", "No limit"],
                    ["  (with employer housing)", "AED 3,000/mo", "AED 8,000/mo", "No limit"],
                    ["Sons", "AED 4,000/mo", "AED 10,000/mo", "Up to 25 years"],
                    ["Unmarried daughters", "AED 4,000/mo", "AED 10,000/mo", "No age limit"],
                    ["Parents", "AED 10,000/mo", "AED 10,000/mo", "No limit"],
                    ["Elderly parents", "AED 20,000/mo", "AED 20,000/mo", "No limit"],
                    ["2nd-degree relatives (visit)", "AED 8,000/mo", "AED 8,000/mo", "—"],
                    ["Friends (visit visa)", "AED 15,000/mo", "AED 15,000/mo", "—"],
                ] as string[][]).map(([rel, male, female, age], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: rel.startsWith("  ") ? 400 : 600, paddingLeft: rel.startsWith("  ") ? 24 : 12, fontStyle: rel.startsWith("  ") ? "italic" : undefined }}>{rel.trim()}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>{male}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>{female}</td>
                        <td style={tl}>{age}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        {/* Golden vs Green comparison */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Golden Visa vs Green Visa — Comparison</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Feature</th>
                <th style={th}>🏅 Golden Visa</th>
                <th style={th}>🌿 Green Visa</th>
            </tr></thead><tbody>
                {([
                    ["Duration", "5 or 10 years", "5 years"],
                    ["Self-sponsored?", "Yes", "Yes"],
                    ["Minimum cost", "~AED 5,300", "~AED 4,700"],
                    ["Investor threshold", "AED 750K–2M property", "AED 1M business"],
                    ["Salary (professional)", "AED 30,000/mo", "AED 15,000/mo"],
                    ["Family sponsorship", "Spouse + children (any age)", "Spouse + children (to 25) + parents"],
                    ["Grace after expiry", "6 months", "6 months"],
                    ["Can change employer?", "Yes — self-sponsored", "Yes — self-sponsored"],
                    ["Income tax", "0%", "0%"],
                ] as string[][]).map(([feature, golden, green], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{feature}</td>
                        <td style={td}>{golden}</td>
                        <td style={td}>{green}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        {/* Processing timelines */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Visa Processing Timelines</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Visa Type</th>
                <th style={th}>Standard</th>
                <th style={th}>Express</th>
                <th style={{ ...th, textAlign: "left" }}>Where to Apply</th>
            </tr></thead><tbody>
                {([
                    ["Tourist Visa", "2–5 business days", "24–48 hours", "GDRFA / agency / airline"],
                    ["Employment Visa", "5–15 business days", "3–5 days", "MoHRE + GDRFA / free zone"],
                    ["Golden Visa", "10–30 business days", "5–10 days", "ICP / GDRFA / Amer Centers"],
                    ["Green Visa", "10–20 business days", "5–7 days", "ICP / MoHRE"],
                    ["Family Visa", "5–15 business days", "3–5 days", "GDRFA / Amer Centers"],
                    ["Student Visa", "7–14 business days", "—", "University + ICP"],
                    ["Remote Work", "5–10 business days", "—", "ICP (icp.gov.ae)"],
                ] as string[][]).map(([visa, std, express, where], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{visa}</td>
                        <td style={td}>{std}</td>
                        <td style={{ ...td, color: express === "—" ? "var(--text-muted)" : "#009639", fontWeight: express === "—" ? 400 : 600 }}>{express}</td>
                        <td style={tl}>{where}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}
