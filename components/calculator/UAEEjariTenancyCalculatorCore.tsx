"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtAED2 = (n: number) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ResultRow({ label, value, highlight, warn, sub, green, red }: { label: string; value: string; highlight?: boolean; warn?: boolean; sub?: boolean; green?: boolean; red?: boolean }) {
    const bg = highlight ? "rgba(0,150,57,0.06)" : warn ? "rgba(234,179,8,0.08)" : green ? "rgba(34,197,94,0.05)" : red ? "rgba(239,68,68,0.05)" : undefined;
    const style = bg ? { background: bg, borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined;
    const valStyle = highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : sub ? { color: "var(--text-muted)", fontSize: "0.88rem" } : undefined;
    return (<div className="con-result-row" style={style}>
        <span className="con-result-row__label" style={sub ? { fontSize: "0.88rem", paddingLeft: 12 } : undefined}>{label}</span>
        <span className="con-result-row__value" style={valStyle}>{value}</span>
    </div>);
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function UAEEjariTenancyCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["📋 Move-In Costs", "📊 First-Year Total", "📋 Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">📋 Ejari & Tenancy Cost Calculator — UAE 2026</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <MoveInTab />}
        {tab === 1 && <FirstYearTab />}
        {tab === 2 && <ReferenceTab />}
    </div>);
}

/* ═══════════════════════════════════════════════════
   MOVE-IN COSTS TAB
   ═══════════════════════════════════════════════════ */
function MoveInTab() {
    const [annualRent, setAnnualRent] = useState("80000");
    const [emirate, setEmirate] = useState("dubai");
    const [furnished, setFurnished] = useState("unfurnished");
    const [property, setProperty] = useState("apartment");
    const [cheques, setCheques] = useState("4");
    const [chiller, setChiller] = useState("no");
    const [moving, setMoving] = useState("1500");

    const r = useMemo(() => {
        const rent = parseFloat(annualRent) || 0;
        const depositPct = furnished === "furnished" ? 0.10 : 0.05;
        const securityDeposit = rent * depositPct;
        const agencyFee = rent * 0.05;
        const agencyVAT = agencyFee * 0.05;

        // Ejari / Tawtheeq
        const ejariBase = emirate === "dubai" ? 220 : 100;
        const ejariLabel = emirate === "dubai" ? "Ejari registration" : "Tawtheeq registration";

        // DEWA / ADDC
        const utilityDeposit = emirate === "dubai" ? (property === "villa" ? 4000 : 2000) : (property === "villa" ? 3000 : 2000);
        const utilityConnection = emirate === "dubai" ? 130 : 100;
        const utilityLabel = emirate === "dubai" ? "DEWA" : "ADDC";

        // Internet & chiller
        const internetSetup = 350;
        const chillerDeposit = chiller === "yes" ? 1500 : 0;
        const movingCost = parseFloat(moving) || 0;

        // Totals
        const numCheques = parseInt(cheques) || 4;
        const firstCheque = rent / numCheques;

        const nonRefundable = agencyFee + agencyVAT + ejariBase + utilityConnection + internetSetup + movingCost;
        const refundable = securityDeposit + utilityDeposit + chillerDeposit;
        const totalUpfront = nonRefundable + refundable;
        const totalMoveIn = totalUpfront + firstCheque;

        return {
            rent, securityDeposit, depositPct, agencyFee, agencyVAT,
            ejariBase, ejariLabel, utilityDeposit, utilityConnection, utilityLabel,
            internetSetup, chillerDeposit, movingCost,
            firstCheque, numCheques, nonRefundable, refundable, totalUpfront, totalMoveIn,
        };
    }, [annualRent, emirate, furnished, property, cheques, chiller, moving]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                📋 Calculate the <strong>total cost to move in</strong> to a rental property in the UAE. Includes security deposit, agency fee, Ejari/Tawtheeq registration, utility deposits, and your first rent cheque.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ej-rent">Annual Rent <span className="con-input__unit">(AED)</span></label>
                <input id="ej-rent" type="number" className="con-input__field" value={annualRent} onChange={e => setAnnualRent(e.target.value)} min={0} step={5000} placeholder="e.g. 80000" />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ej-emirate">Emirate</label>
                <select id="ej-emirate" className="con-input__field" value={emirate} onChange={e => setEmirate(e.target.value)}>
                    <option value="dubai">Dubai (Ejari)</option>
                    <option value="abu_dhabi">Abu Dhabi (Tawtheeq)</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ej-furn">Furnishing</label>
                <select id="ej-furn" className="con-input__field" value={furnished} onChange={e => setFurnished(e.target.value)}>
                    <option value="unfurnished">Unfurnished (5% deposit)</option>
                    <option value="furnished">Furnished (10% deposit)</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ej-prop">Property Type</label>
                <select id="ej-prop" className="con-input__field" value={property} onChange={e => setProperty(e.target.value)}>
                    <option value="apartment">Apartment / Flat</option>
                    <option value="villa">Villa</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ej-cheq">Payment Cheques</label>
                <select id="ej-cheq" className="con-input__field" value={cheques} onChange={e => setCheques(e.target.value)}>
                    <option value="1">1 cheque (full year)</option>
                    <option value="2">2 cheques (semi-annual)</option>
                    <option value="4">4 cheques (quarterly)</option>
                    <option value="6">6 cheques (bi-monthly)</option>
                    <option value="12">12 cheques (monthly)</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ej-chill">District Cooling (Chiller)</label>
                <select id="ej-chill" className="con-input__field" value={chiller} onChange={e => setChiller(e.target.value)}>
                    <option value="no">No / Included in DEWA</option>
                    <option value="yes">Yes — Separate chiller (Empower/Emicool)</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="ej-move">Moving Cost Estimate <span className="con-input__unit">(AED)</span></label>
                <input id="ej-move" type="number" className="con-input__field" value={moving} onChange={e => setMoving(e.target.value)} min={0} step={100} />
            </div>
        </div>

        <div className="con-calc__results">
            <h4>🔴 Non-Refundable Costs</h4>
            <ResultRow label="Agency fee (5% of annual rent)" value={fmtAED(r.agencyFee)} red sub />
            <ResultRow label="Agency fee VAT (5%)" value={fmtAED2(r.agencyVAT)} red sub />
            <ResultRow label={r.ejariLabel} value={fmtAED(r.ejariBase)} red sub />
            <ResultRow label={`${r.utilityLabel} connection fee`} value={fmtAED(r.utilityConnection)} red sub />
            <ResultRow label="Internet setup" value={fmtAED(r.internetSetup)} red sub />
            <ResultRow label="Moving costs" value={fmtAED(r.movingCost)} red sub />
            <ResultRow label="Total non-refundable" value={fmtAED(r.nonRefundable)} warn />

            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <h4>🟢 Refundable Deposits</h4>
            <ResultRow label={`Security deposit (${(r.depositPct * 100).toFixed(0)}%)`} value={fmtAED(r.securityDeposit)} green sub />
            <ResultRow label={`${r.utilityLabel} deposit`} value={fmtAED(r.utilityDeposit)} green sub />
            {r.chillerDeposit > 0 && <ResultRow label="Chiller deposit" value={fmtAED(r.chillerDeposit)} green sub />}
            <ResultRow label="Total refundable" value={fmtAED(r.refundable)} green />

            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <ResultRow label="Total upfront (excl. rent)" value={fmtAED(r.totalUpfront)} warn />
            <ResultRow label={`First rent cheque (1/${r.numCheques} of annual)`} value={fmtAED(r.firstCheque)} sub />
            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <ResultRow label="💰 Total Move-In Cost" value={fmtAED(r.totalMoveIn)} highlight />

            <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(0,150,57,0.04)", borderRadius: 6, fontSize: "0.82rem", lineHeight: 1.6 }}>
                📌 <strong>Upfront costs = {((r.totalUpfront / r.rent) * 100).toFixed(1)}% of annual rent.</strong> You will get back {fmtAED(r.refundable)} when you end your lease (security deposit + utility deposits), provided the property is returned in good condition.
            </div>
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   FIRST-YEAR TAB
   ═══════════════════════════════════════════════════ */
function FirstYearTab() {
    const [annualRent, setAnnualRent] = useState("80000");
    const [emirate, setEmirate] = useState("dubai");
    const [property, setProperty] = useState("apartment");

    const r = useMemo(() => {
        const rent = parseFloat(annualRent) || 0;
        const monthlyRent = rent / 12;

        // Ongoing monthly costs
        const utilityMonthly = emirate === "dubai" ? (property === "villa" ? 1200 : 600) : (property === "villa" ? 900 : 450);
        const muniFee = rent * 0.05 / 12;
        const internet = 350;
        const monthlyTotal = monthlyRent + utilityMonthly + muniFee + internet;

        // First-year costs
        const ejari = emirate === "dubai" ? 220 : 100;
        const secDep = rent * 0.05; // unfurnished default
        const agencyFee = rent * 0.05;
        const agencyVAT = agencyFee * 0.05;
        const utilityDep = emirate === "dubai" ? (property === "villa" ? 4000 : 2000) : 2000;
        const utilityConn = emirate === "dubai" ? 130 : 100;
        const internetSetup = 350;
        const moving = 1500;

        const oneTimeTotal = ejari + secDep + agencyFee + agencyVAT + utilityDep + utilityConn + internetSetup + moving;
        const annualUtility = utilityMonthly * 12;
        const annualMuni = muniFee * 12;
        const annualInternet = internet * 12;
        const firstYearTotal = rent + oneTimeTotal + annualUtility + annualMuni + annualInternet;

        const costBeyondRent = firstYearTotal - rent;
        const pctAboveRent = rent > 0 ? (costBeyondRent / rent) * 100 : 0;

        return { rent, monthlyRent, utilityMonthly, muniFee, internet, monthlyTotal, ejari, secDep, agencyFee, agencyVAT, utilityDep, utilityConn, internetSetup, moving, oneTimeTotal, annualUtility, annualMuni, annualInternet, firstYearTotal, costBeyondRent, pctAboveRent };
    }, [annualRent, emirate, property]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                📊 See the <strong>true first-year cost</strong> of renting, including all one-time fees and monthly expenses. This reveals how much MORE than the headline rent you actually pay.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="fy-rent">Annual Rent <span className="con-input__unit">(AED)</span></label>
                <input id="fy-rent" type="number" className="con-input__field" value={annualRent} onChange={e => setAnnualRent(e.target.value)} min={0} step={5000} />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="fy-emirate">Emirate</label>
                <select id="fy-emirate" className="con-input__field" value={emirate} onChange={e => setEmirate(e.target.value)}>
                    <option value="dubai">Dubai</option>
                    <option value="abu_dhabi">Abu Dhabi</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="fy-prop">Property Type</label>
                <select id="fy-prop" className="con-input__field" value={property} onChange={e => setProperty(e.target.value)}>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                </select>
            </div>
        </div>

        <div className="con-calc__results">
            <h4>📊 First-Year Cost Summary</h4>

            <div style={{ padding: "14px", background: "rgba(220,38,38,0.06)", borderRadius: 8, textAlign: "center", marginBottom: 12 }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>True first-year cost</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#dc2626" }}>{fmtAED(r.firstYearTotal)}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#b45309" }}>
                    {r.pctAboveRent.toFixed(0)}% more than headline rent of {fmtAED(r.rent)}
                </div>
            </div>

            <h4>One-Time Costs</h4>
            <ResultRow label="Security deposit (5%)" value={fmtAED(r.secDep)} sub />
            <ResultRow label="Agency fee (5% + VAT)" value={fmtAED(r.agencyFee + r.agencyVAT)} sub />
            <ResultRow label={emirate === "dubai" ? "Ejari" : "Tawtheeq"} value={fmtAED(r.ejari)} sub />
            <ResultRow label={`${emirate === "dubai" ? "DEWA" : "ADDC"} deposit + connection`} value={fmtAED(r.utilityDep + r.utilityConn)} sub />
            <ResultRow label="Internet setup" value={fmtAED(r.internetSetup)} sub />
            <ResultRow label="Moving (est.)" value={fmtAED(r.moving)} sub />
            <ResultRow label="Total one-time" value={fmtAED(r.oneTimeTotal)} warn />

            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <h4>Annual Recurring Costs</h4>
            <ResultRow label="Rent" value={fmtAED(r.rent)} />
            <ResultRow label={`${emirate === "dubai" ? "DEWA" : "ADDC"} (12 months)`} value={fmtAED(r.annualUtility)} sub />
            <ResultRow label="Municipality fee (5% of rent)" value={fmtAED(r.annualMuni)} sub />
            <ResultRow label="Internet (12 months)" value={fmtAED(r.annualInternet)} sub />
            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <ResultRow label="First-Year Grand Total" value={fmtAED(r.firstYearTotal)} highlight />

            <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
            <h4>📆 Monthly Cost Breakdown</h4>
            <ResultRow label="Rent (monthly)" value={fmtAED(r.monthlyRent)} sub />
            <ResultRow label={emirate === "dubai" ? "DEWA (est.)" : "ADDC (est.)"} value={fmtAED(r.utilityMonthly)} sub />
            <ResultRow label="Municipality fee" value={fmtAED2(r.muniFee)} sub />
            <ResultRow label="Internet" value={fmtAED(r.internet)} sub />
            <ResultRow label="Total monthly housing" value={fmtAED(r.monthlyTotal)} warn />
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
        <h4>Ejari vs Tawtheeq — Side-by-Side Comparison</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Feature</th>
                <th style={th}>📋 Ejari (Dubai)</th>
                <th style={th}>📋 Tawtheeq (Abu Dhabi)</th>
            </tr></thead><tbody>
                {([
                    ["Managed by", "Dubai Land Department (DLD)", "Abu Dhabi Judiciary"],
                    ["Online platform", "Dubai REST app / DLD website", "SmartHub / TAMM portal"],
                    ["Registration fee", "AED 120–320", "AED 50–100"],
                    ["Renewal fee", "Same as registration", "AED 50/year"],
                    ["Cancellation fee", "Free (online)", "Free"],
                    ["Processing time", "Same day (online)", "1 business day"],
                    ["Required for", "DEWA, visa, school, trade license", "ADDC, visa, school, services"],
                    ["Municipality fee", "5% of rent via DEWA", "5% of rent via ADDC"],
                    ["Responsibility", "Landlord (tenant can initiate)", "Landlord"],
                ] as string[][]).map(([feat, ejari, taw], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{feat}</td>
                        <td style={td}>{ejari}</td>
                        <td style={td}>{taw}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Upfront Costs by Annual Rent</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={th}>Annual Rent</th>
                <th style={th}>Deposit (5%)</th>
                <th style={th}>Agency (5%)</th>
                <th style={th}>Ejari+DEWA</th>
                <th style={th}>Total Upfront</th>
            </tr></thead><tbody>
                {([40000, 60000, 80000, 100000, 120000, 150000, 200000] as number[]).map((rent, i) => {
                    const dep = rent * 0.05;
                    const ag = rent * 0.05;
                    const misc = 2350; // Ejari + DEWA dep + connection + internet
                    const total = dep + ag + (ag * 0.05) + misc;
                    return (<tr key={i} style={b}>
                        <td style={{ ...td, fontWeight: 700 }}>{fmtAED(rent)}</td>
                        <td style={td}>{fmtAED(dep)}</td>
                        <td style={td}>{fmtAED(ag)}</td>
                        <td style={td}>~{fmtAED(misc)}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#b45309" }}>~{fmtAED(total)}</td>
                    </tr>);
                })}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Moving Cost Estimates</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Property Size</th>
                <th style={th}>Cost Range</th>
            </tr></thead><tbody>
                {([
                    ["Studio apartment", "AED 500 – AED 1,200"],
                    ["1-Bedroom apartment", "AED 800 – AED 2,500"],
                    ["2-Bedroom apartment", "AED 1,300 – AED 3,500"],
                    ["3-Bedroom apartment/villa", "AED 2,000 – AED 6,000"],
                    ["Large villa (4–5 BR)", "AED 3,500 – AED 7,000+"],
                ] as string[][]).map(([size, cost], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{size}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>{cost}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Ejari Registration — Required Documents</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Document</th>
                <th style={th}>Required</th>
            </tr></thead><tbody>
                {([
                    ["Signed Unified Tenancy Contract", "✅"],
                    ["Tenant Emirates ID + passport copy", "✅"],
                    ["Landlord Emirates ID / passport copy", "✅"],
                    ["Title deed / ownership certificate", "✅"],
                    ["DEWA premise number or latest bill", "✅"],
                    ["Security deposit receipt", "Optional"],
                    ["Trade license (commercial only)", "If commercial"],
                ] as string[][]).map(([doc, req], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{doc}</td>
                        <td style={{ ...td, color: req === "✅" ? "#16a34a" : "#b45309", fontWeight: 600 }}>{req}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}
