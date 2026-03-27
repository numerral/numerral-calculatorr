"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtAED2 = (n: number) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ResultRow({ label, value, highlight, warn, sub, green }: { label: string; value: string; highlight?: boolean; warn?: boolean; sub?: boolean; green?: boolean }) {
    const bg = highlight ? "rgba(0,150,57,0.06)" : warn ? "rgba(234,179,8,0.08)" : green ? "rgba(34,197,94,0.05)" : undefined;
    const style = bg ? { background: bg, borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined;
    const valStyle = highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : sub ? { color: "var(--text-muted)", fontSize: "0.88rem" } : undefined;
    return (<div className="con-result-row" style={style}>
        <span className="con-result-row__label" style={sub ? { fontSize: "0.88rem", paddingLeft: 12 } : undefined}>{label}</span>
        <span className="con-result-row__value" style={valStyle}>{value}</span>
    </div>);
}

/* ═══════════════════════════════════════════════════
   AREA RENT DATA
   ═══════════════════════════════════════════════════ */
interface AreaRent { name: string; emirate: string; studio: number; oneBR: number; twoBR: number; }

const AREA_RENTS: AreaRent[] = [
    // Dubai
    { name: "International City", emirate: "dubai", studio: 36000, oneBR: 50000, twoBR: 72000 },
    { name: "Dubai Silicon Oasis", emirate: "dubai", studio: 42000, oneBR: 62000, twoBR: 84000 },
    { name: "Sports City", emirate: "dubai", studio: 45000, oneBR: 66000, twoBR: 88000 },
    { name: "JVC (Jumeirah Village Circle)", emirate: "dubai", studio: 48000, oneBR: 72000, twoBR: 102000 },
    { name: "Dubai South", emirate: "dubai", studio: 50000, oneBR: 70000, twoBR: 96000 },
    { name: "JLT (Jumeirah Lake Towers)", emirate: "dubai", studio: 54000, oneBR: 90000, twoBR: 120000 },
    { name: "Business Bay", emirate: "dubai", studio: 60000, oneBR: 100000, twoBR: 140000 },
    { name: "Dubai Marina", emirate: "dubai", studio: 65000, oneBR: 100000, twoBR: 150000 },
    { name: "Downtown Dubai", emirate: "dubai", studio: 82000, oneBR: 125000, twoBR: 180000 },
    { name: "Palm Jumeirah", emirate: "dubai", studio: 95000, oneBR: 155000, twoBR: 220000 },
    // Abu Dhabi
    { name: "Khalifa City (AD)", emirate: "abu_dhabi", studio: 40000, oneBR: 54000, twoBR: 88000 },
    { name: "Al Reef (AD)", emirate: "abu_dhabi", studio: 48000, oneBR: 60000, twoBR: 90000 },
    { name: "Al Reem Island (AD)", emirate: "abu_dhabi", studio: 60000, oneBR: 105000, twoBR: 145000 },
    { name: "Saadiyat Island (AD)", emirate: "abu_dhabi", studio: 80000, oneBR: 130000, twoBR: 180000 },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function UAERentAffordabilityCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🏠 How Much Can I Afford?", "📊 Budget Breakdown", "📋 Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏠 Rent Affordability Calculator — UAE 2026</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <AffordabilityTab />}
        {tab === 1 && <BudgetTab />}
        {tab === 2 && <ReferenceTab />}
    </div>);
}

/* ═══════════════════════════════════════════════════
   AFFORDABILITY TAB
   ═══════════════════════════════════════════════════ */
function AffordabilityTab() {
    const [salary, setSalary] = useState("15000");
    const [emirate, setEmirate] = useState("dubai");
    const [pct, setPct] = useState("30");
    const [furnished, setFurnished] = useState("unfurnished");
    const [cheques, setCheques] = useState("4");

    const result = useMemo(() => {
        const monthlySalary = parseFloat(salary) || 0;
        const ratio = (parseFloat(pct) || 30) / 100;
        const maxMonthlyRent = monthlySalary * ratio;
        const maxAnnualRent = maxMonthlyRent * 12;

        // Upfront costs
        const depositPct = furnished === "furnished" ? 0.10 : 0.05;
        const securityDeposit = maxAnnualRent * depositPct;
        const agencyFee = maxAnnualRent * 0.05;
        const ejari = emirate === "dubai" ? 220 : 150; // Tawtheeq for Abu Dhabi
        const dewaDep = emirate === "dubai" ? 2000 : 2500;
        const totalUpfront = securityDeposit + agencyFee + ejari + dewaDep;

        // First cheque
        const numCheques = parseInt(cheques) || 4;
        const firstCheque = maxAnnualRent / numCheques;
        const moveInTotal = totalUpfront + firstCheque;

        // Monthly ongoing
        const utilityEst = emirate === "dubai" ? 600 : 450;
        const muniFee = maxAnnualRent * 0.05 / 12;
        const internet = 350;
        const monthlyHousing = maxMonthlyRent + utilityEst + muniFee + internet;
        const remaining = monthlySalary - monthlyHousing;

        // Affordable areas
        const areas = AREA_RENTS
            .filter(a => emirate === "dubai" ? a.emirate === "dubai" : a.emirate === "abu_dhabi")
            .map(a => ({
                ...a,
                canAffordStudio: a.studio <= maxAnnualRent,
                canAfford1BR: a.oneBR <= maxAnnualRent,
                canAfford2BR: a.twoBR <= maxAnnualRent,
            }));

        return { monthlySalary, maxMonthlyRent, maxAnnualRent, securityDeposit, agencyFee, ejari, dewaDep, totalUpfront, firstCheque, moveInTotal, utilityEst, muniFee, internet, monthlyHousing, remaining, areas, numCheques, ratio };
    }, [salary, emirate, pct, furnished, cheques]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🏠 Enter your monthly salary to find out how much rent you can afford, total move-in costs, and which areas fit your budget. All calculations include upfront costs (deposit, agency, Ejari) and ongoing housing expenses.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ra-salary">Monthly Gross Salary <span className="con-input__unit">(AED)</span></label>
                <input id="ra-salary" type="number" className="con-input__field" value={salary} onChange={e => setSalary(e.target.value)} min={0} step={1000} placeholder="e.g. 15000" />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ra-emirate">Emirate</label>
                <select id="ra-emirate" className="con-input__field" value={emirate} onChange={e => setEmirate(e.target.value)}>
                    <option value="dubai">Dubai</option>
                    <option value="abu_dhabi">Abu Dhabi</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ra-pct">Rent-to-Salary Ratio <span className="con-input__unit">(% of salary)</span></label>
                <select id="ra-pct" className="con-input__field" value={pct} onChange={e => setPct(e.target.value)}>
                    <option value="20">20% — Aggressive saver</option>
                    <option value="25">25% — Conservative</option>
                    <option value="30">30% — Recommended</option>
                    <option value="35">35% — Comfortable</option>
                    <option value="40">40% — Stretched</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ra-furn">Furnishing</label>
                <select id="ra-furn" className="con-input__field" value={furnished} onChange={e => setFurnished(e.target.value)}>
                    <option value="unfurnished">Unfurnished (5% deposit)</option>
                    <option value="furnished">Furnished (10% deposit)</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ra-cheq">Payment Cheques</label>
                <select id="ra-cheq" className="con-input__field" value={cheques} onChange={e => setCheques(e.target.value)}>
                    <option value="1">1 cheque (entire year upfront)</option>
                    <option value="2">2 cheques (semi-annual)</option>
                    <option value="4">4 cheques (quarterly)</option>
                    <option value="6">6 cheques (bi-monthly)</option>
                    <option value="12">12 cheques (monthly)</option>
                </select>
            </div>
        </div>

        <div className="con-calc__results">
            <h4>💰 Maximum Affordable Rent</h4>
            <ResultRow label={`Max monthly rent (${(result.ratio * 100).toFixed(0)}% of salary)`} value={fmtAED(result.maxMonthlyRent)} highlight />
            <ResultRow label="Max annual rent" value={fmtAED(result.maxAnnualRent)} sub />

            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <h4>🏦 Upfront Move-In Costs</h4>
            <ResultRow label={`Security deposit (${furnished === "furnished" ? "10%" : "5%"})`} value={fmtAED(result.securityDeposit)} sub />
            <ResultRow label="Agency fee (5%)" value={fmtAED(result.agencyFee)} sub />
            <ResultRow label={emirate === "dubai" ? "Ejari registration" : "Tawtheeq registration"} value={fmtAED(result.ejari)} sub />
            <ResultRow label={emirate === "dubai" ? "DEWA deposit" : "ADDC deposit"} value={fmtAED(result.dewaDep)} sub />
            <ResultRow label="Total upfront (excl. rent)" value={fmtAED(result.totalUpfront)} warn />
            <ResultRow label={`First rent cheque (1/${result.numCheques} of annual)`} value={fmtAED(result.firstCheque)} sub />
            <ResultRow label="Total move-in cost" value={fmtAED(result.moveInTotal)} highlight />

            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <h4>📆 Monthly Housing Budget</h4>
            <ResultRow label="Rent" value={fmtAED(result.maxMonthlyRent)} sub />
            <ResultRow label={`Utilities (${emirate === "dubai" ? "DEWA" : "ADDC"} estimate)`} value={fmtAED(result.utilityEst)} sub />
            <ResultRow label="Municipality fee (5% of rent ÷ 12)" value={fmtAED2(result.muniFee)} sub />
            <ResultRow label="Internet (e& / du)" value={fmtAED(result.internet)} sub />
            <ResultRow label="Total monthly housing" value={fmtAED(result.monthlyHousing)} warn />
            <ResultRow label="Remaining salary" value={fmtAED(result.remaining)} highlight={result.remaining > 0} warn={result.remaining <= 0} />

            {result.remaining < 0 && (
                <div style={{ padding: "10px 12px", background: "rgba(220,38,38,0.08)", borderRadius: 6, fontSize: "0.85rem", marginTop: 8, color: "#dc2626", fontWeight: 600 }}>
                    ⚠️ Housing costs exceed your salary. Consider reducing your rent-to-salary ratio or looking at more affordable areas.
                </div>
            )}

            {/* Affordable areas */}
            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <h4>📍 Areas You Can Afford ({emirate === "dubai" ? "Dubai" : "Abu Dhabi"})</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                        <th style={{ padding: "6px 10px", textAlign: "left" }}>Area</th>
                        <th style={{ padding: "6px 10px", textAlign: "center" }}>Studio</th>
                        <th style={{ padding: "6px 10px", textAlign: "center" }}>1BR</th>
                        <th style={{ padding: "6px 10px", textAlign: "center" }}>2BR</th>
                    </tr></thead>
                    <tbody>
                        {result.areas.map((a, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "5px 10px", fontWeight: 600, fontSize: "0.8rem" }}>{a.name}</td>
                                <td style={{ padding: "5px 10px", textAlign: "center", color: a.canAffordStudio ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                                    {a.canAffordStudio ? "✅" : "❌"} {fmtAED(a.studio / 12)}<span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/mo</span>
                                </td>
                                <td style={{ padding: "5px 10px", textAlign: "center", color: a.canAfford1BR ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                                    {a.canAfford1BR ? "✅" : "❌"} {fmtAED(a.oneBR / 12)}<span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/mo</span>
                                </td>
                                <td style={{ padding: "5px 10px", textAlign: "center", color: a.canAfford2BR ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                                    {a.canAfford2BR ? "✅" : "❌"} {fmtAED(a.twoBR / 12)}<span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>/mo</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   BUDGET BREAKDOWN TAB
   ═══════════════════════════════════════════════════ */
function BudgetTab() {
    const [salary, setSalary] = useState("20000");
    const [annualRent, setAnnualRent] = useState("80000");
    const [emirate, setEmirate] = useState("dubai");

    const result = useMemo(() => {
        const monthlySalary = parseFloat(salary) || 0;
        const annual = parseFloat(annualRent) || 0;
        const monthlyRent = annual / 12;

        const utilityEst = emirate === "dubai" ? 700 : 500;
        const muniFee = annual * 0.05 / 12;
        const internet = 350;
        const transport = 800;
        const groceries = 1500;
        const totalHousing = monthlyRent + utilityEst + muniFee + internet;
        const totalLiving = totalHousing + transport + groceries;
        const remaining = monthlySalary - totalLiving;
        const rentPct = monthlySalary > 0 ? (monthlyRent / monthlySalary) * 100 : 0;
        const housingPct = monthlySalary > 0 ? (totalHousing / monthlySalary) * 100 : 0;

        return { monthlySalary, monthlyRent, annual, utilityEst, muniFee, internet, transport, groceries, totalHousing, totalLiving, remaining, rentPct, housingPct };
    }, [salary, annualRent, emirate]);

    const pctColor = result.rentPct <= 25 ? "#16a34a" : result.rentPct <= 30 ? "#009639" : result.rentPct <= 35 ? "#b45309" : "#dc2626";
    const pctLabel = result.rentPct <= 25 ? "Conservative ✅" : result.rentPct <= 30 ? "Recommended ✅" : result.rentPct <= 35 ? "Stretched ⚠️" : "Over-budget 🚨";

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                📊 Enter your salary and target rent to see a complete monthly budget breakdown, including utilities, municipality fee, transport, and groceries.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="bb-salary">Monthly Gross Salary <span className="con-input__unit">(AED)</span></label>
                <input id="bb-salary" type="number" className="con-input__field" value={salary} onChange={e => setSalary(e.target.value)} min={0} step={1000} />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="bb-rent">Annual Rent <span className="con-input__unit">(AED)</span></label>
                <input id="bb-rent" type="number" className="con-input__field" value={annualRent} onChange={e => setAnnualRent(e.target.value)} min={0} step={5000} />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="bb-emir">Emirate</label>
                <select id="bb-emir" className="con-input__field" value={emirate} onChange={e => setEmirate(e.target.value)}>
                    <option value="dubai">Dubai</option>
                    <option value="abu_dhabi">Abu Dhabi</option>
                </select>
            </div>
        </div>

        <div className="con-calc__results">
            <h4>📊 Rent-to-Income Ratio</h4>
            <div style={{ padding: "12px", background: `${pctColor}11`, borderRadius: 8, textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: pctColor }}>{result.rentPct.toFixed(1)}%</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: pctColor }}>{pctLabel}</div>
            </div>

            <h4>📆 Monthly Budget</h4>
            <ResultRow label="Rent" value={fmtAED(result.monthlyRent)} />
            <ResultRow label={`Utilities (${emirate === "dubai" ? "DEWA" : "ADDC"} est.)`} value={fmtAED(result.utilityEst)} sub />
            <ResultRow label="Municipality fee" value={fmtAED2(result.muniFee)} sub />
            <ResultRow label="Internet" value={fmtAED(result.internet)} sub />
            <ResultRow label="Total housing" value={fmtAED(result.totalHousing)} warn />
            <ResultRow label={`Housing as % of salary`} value={`${result.housingPct.toFixed(1)}%`} sub />
            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <ResultRow label="Transport (est.)" value={fmtAED(result.transport)} sub />
            <ResultRow label="Groceries (est.)" value={fmtAED(result.groceries)} sub />
            <ResultRow label="Total living expenses" value={fmtAED(result.totalLiving)} />
            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <ResultRow label="Remaining for savings/lifestyle" value={fmtAED(result.remaining)} highlight={result.remaining > 0} warn={result.remaining <= 0} />
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   REFERENCE TAB
   ═══════════════════════════════════════════════════ */
function ReferenceTab() {
    const ts = { width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" as const };
    const th = { padding: "7px 10px", textAlign: "center" as const };
    const td = { padding: "5px 10px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        <h4>Average Monthly Rents — Dubai 2025</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Area</th>
                <th style={th}>Studio</th>
                <th style={th}>1BR</th>
                <th style={th}>2BR</th>
            </tr></thead><tbody>
                {AREA_RENTS.filter(a => a.emirate === "dubai").map((a, i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{a.name}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{fmtAED(a.studio / 12)}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{fmtAED(a.oneBR / 12)}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{fmtAED(a.twoBR / 12)}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Average Monthly Rents — Abu Dhabi 2025</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Area</th>
                <th style={th}>Studio</th>
                <th style={th}>1BR</th>
                <th style={th}>2BR</th>
            </tr></thead><tbody>
                {AREA_RENTS.filter(a => a.emirate === "abu_dhabi").map((a, i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{a.name}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{fmtAED(a.studio / 12)}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{fmtAED(a.oneBR / 12)}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{fmtAED(a.twoBR / 12)}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Upfront Costs Reference</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Cost</th>
                <th style={th}>Amount</th>
                <th style={{ ...th, textAlign: "left" }}>Notes</th>
            </tr></thead><tbody>
                {([
                    ["Security deposit (unfurnished)", "5% of annual rent", "Refundable at lease end"],
                    ["Security deposit (furnished)", "10% of annual rent", "Refundable at lease end"],
                    ["Agency fee", "5% of annual rent", "Non-refundable, paid to broker"],
                    ["Ejari (Dubai)", "AED 155–320", "Online AED 155; typing center AED 220–320"],
                    ["Tawtheeq (Abu Dhabi)", "AED 100–200", "Abu Dhabi tenancy registration"],
                    ["DEWA deposit (Dubai)", "AED 2,000 (apt) / AED 4,000 (villa)", "Refundable utility deposit"],
                    ["ADDC deposit (Abu Dhabi)", "AED 2,000–3,000", "TAQA Distribution deposit"],
                    ["Internet setup", "AED 200–400", "e& or du installation"],
                ] as string[][]).map(([cost, amount, notes], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{cost}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>{amount}</td>
                        <td style={{ ...tl, fontSize: "0.78rem" }}>{notes}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Salary vs Rent Benchmarks (30% Rule)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={th}>Monthly Salary</th>
                <th style={th}>Max Monthly Rent</th>
                <th style={th}>Max Annual Rent</th>
                <th style={{ ...th, textAlign: "left" }}>Typical Options</th>
            </tr></thead><tbody>
                {([
                    ["AED 8,000", "AED 2,400", "AED 28,800", "Studio in International City / DSO sharing"],
                    ["AED 12,000", "AED 3,600", "AED 43,200", "Studio in DSO, Sports City, or JVC"],
                    ["AED 15,000", "AED 4,500", "AED 54,000", "Studio in JVC/JLT or 1BR in DSO"],
                    ["AED 20,000", "AED 6,000", "AED 72,000", "1BR in JVC/JLT or Studio in Marina"],
                    ["AED 25,000", "AED 7,500", "AED 90,000", "1BR in Marina/Business Bay"],
                    ["AED 35,000", "AED 10,500", "AED 126,000", "1BR in Downtown or 2BR in JLT"],
                    ["AED 50,000", "AED 15,000", "AED 180,000", "2BR Downtown or 1BR Palm Jumeirah"],
                ] as string[][]).map(([sal, monRent, annRent, options], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...td, fontWeight: 700 }}>{sal}</td>
                        <td style={{ ...td, color: "#009639", fontWeight: 700 }}>{monRent}</td>
                        <td style={td}>{annRent}</td>
                        <td style={{ ...tl, fontSize: "0.78rem" }}>{options}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}
