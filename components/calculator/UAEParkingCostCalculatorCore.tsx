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
   ZONE RATE DATA
   ═══════════════════════════════════════════════════ */
interface ZoneRate { id: string; label: string; emirate: string; peakRate: number; offPeakRate: number; dailyMax: number | null; maxHours: number | null; }

const DUBAI_ZONES: ZoneRate[] = [
    { id: "a_std", label: "Zone A — Standard On-Street", emirate: "dubai", peakRate: 4, offPeakRate: 4, dailyMax: null, maxHours: 4 },
    { id: "a_prm", label: "Zone A — Premium On-Street", emirate: "dubai", peakRate: 6, offPeakRate: 4, dailyMax: null, maxHours: 4 },
    { id: "b_std", label: "Zone B — Standard Off-Street", emirate: "dubai", peakRate: 3, offPeakRate: 3, dailyMax: 20, maxHours: 24 },
    { id: "b_prm", label: "Zone B — Premium Off-Street", emirate: "dubai", peakRate: 6, offPeakRate: 2, dailyMax: 30, maxHours: 24 },
    { id: "c", label: "Zone C — On-Street", emirate: "dubai", peakRate: 6, offPeakRate: 3, dailyMax: 40, maxHours: null },
    { id: "d_std", label: "Zone D — Standard Off-Street", emirate: "dubai", peakRate: 4, offPeakRate: 2, dailyMax: 20, maxHours: null },
    { id: "d_prm", label: "Zone D — Premium Off-Street", emirate: "dubai", peakRate: 6, offPeakRate: 2, dailyMax: 20, maxHours: null },
    { id: "f", label: "Zone F — Al Sufouh 2", emirate: "dubai", peakRate: 4, offPeakRate: 4, dailyMax: 32, maxHours: 24 },
    { id: "w", label: "Zone W — Standard", emirate: "dubai", peakRate: 4, offPeakRate: 4, dailyMax: null, maxHours: null },
    { id: "wp", label: "Zone WP — Premium", emirate: "dubai", peakRate: 6, offPeakRate: 4, dailyMax: null, maxHours: null },
    { id: "multi", label: "Multi-Level Garage", emirate: "dubai", peakRate: 5, offPeakRate: 5, dailyMax: 40, maxHours: 24 },
    { id: "event", label: "Grand Events (DWTC)", emirate: "dubai", peakRate: 25, offPeakRate: 25, dailyMax: null, maxHours: null },
];

const AD_ZONES: ZoneRate[] = [
    { id: "ad_prm", label: "Premium (White & Turquoise)", emirate: "abu_dhabi", peakRate: 3, offPeakRate: 3, dailyMax: null, maxHours: 4 },
    { id: "ad_std", label: "Standard (Black & Turquoise)", emirate: "abu_dhabi", peakRate: 2, offPeakRate: 2, dailyMax: 15, maxHours: 24 },
    { id: "ad_multi", label: "Multi-Storey Car Park", emirate: "abu_dhabi", peakRate: 2, offPeakRate: 2, dailyMax: 15, maxHours: 24 },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function UAEParkingCostCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🅿️ Parking Cost", "💰 Monthly Commuter", "📋 Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🅿️ Parking Cost Calculator — UAE 2025</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <CostTab />}
        {tab === 1 && <CommuterTab />}
        {tab === 2 && <ReferenceTab />}
    </div>);
}

/* ═══════════════════════════════════════════════════
   COST TAB
   ═══════════════════════════════════════════════════ */
function CostTab() {
    const [emirate, setEmirate] = useState("dubai");
    const [zone, setZone] = useState("a_std");
    const [timeType, setTimeType] = useState("peak");
    const [hours, setHours] = useState("3");

    const zones = emirate === "dubai" ? DUBAI_ZONES : AD_ZONES;
    const selectedZone = zones.find(z => z.id === zone) || zones[0];

    // Reset zone when emirate changes
    const handleEmirateChange = (e: string) => {
        setEmirate(e);
        setZone(e === "dubai" ? "a_std" : "ad_prm");
    };

    const r = useMemo(() => {
        const h = parseFloat(hours) || 0;
        const rate = timeType === "peak" ? selectedZone.peakRate : selectedZone.offPeakRate;
        let sessionCost = h * rate;

        // Apply daily max cap if applicable
        if (selectedZone.dailyMax && sessionCost > selectedZone.dailyMax) {
            sessionCost = selectedZone.dailyMax;
        }

        const weeklyEst = sessionCost * 6; // Mon-Sat paid
        const monthlyEst = sessionCost * 26; // ~26 working days
        const annualEst = monthlyEst * 12;

        // mParking surcharge
        const mparkingSurcharge = 0.30; // 30 fils per SMS

        return { rate, sessionCost, weeklyEst, monthlyEst, annualEst, h, mparkingSurcharge, capped: selectedZone.dailyMax !== null && h * rate > selectedZone.dailyMax };
    }, [hours, timeType, selectedZone]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🅿️ Calculate your parking cost in Dubai or Abu Dhabi. Select your zone, enter hours, and choose peak or off-peak pricing. Rates updated for <strong>April 2025</strong> variable tariffs.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="pk-emir">Emirate</label>
                <select id="pk-emir" className="con-input__field" value={emirate} onChange={e => handleEmirateChange(e.target.value)}>
                    <option value="dubai">Dubai (RTA / Parkin)</option>
                    <option value="abu_dhabi">Abu Dhabi (Mawaqif)</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="pk-zone">Parking Zone</label>
                <select id="pk-zone" className="con-input__field" value={zone} onChange={e => setZone(e.target.value)}>
                    {zones.map(z => <option key={z.id} value={z.id}>{z.label}</option>)}
                </select>
            </div>
            {emirate === "dubai" && (
                <div className="con-input">
                    <label className="con-input__label" htmlFor="pk-time">Time Period</label>
                    <select id="pk-time" className="con-input__field" value={timeType} onChange={e => setTimeType(e.target.value)}>
                        <option value="peak">Peak (8–10 AM & 4–8 PM)</option>
                        <option value="offpeak">Off-Peak (10 AM–4 PM & 8–10 PM)</option>
                    </select>
                </div>
            )}
            <div className="con-input">
                <label className="con-input__label" htmlFor="pk-hrs">Duration <span className="con-input__unit">(hours)</span></label>
                <input id="pk-hrs" type="number" className="con-input__field" value={hours} onChange={e => setHours(e.target.value)} min={0.5} max={24} step={0.5} />
            </div>
        </div>

        <div className="con-calc__results">
            <h4>🅿️ Session Cost</h4>
            <ResultRow label={`Rate (${timeType === "peak" ? "peak" : "off-peak"})`} value={`${fmtAED(r.rate)}/hour`} sub />
            <ResultRow label={`Duration`} value={`${r.h} hours`} sub />
            {r.capped && <ResultRow label="Daily max cap applied" value={fmtAED(selectedZone.dailyMax!)} green />}
            <ResultRow label="Session cost" value={fmtAED(r.sessionCost)} highlight />
            <ResultRow label="+ mParking SMS fee" value={fmtAED2(r.mparkingSurcharge)} sub />

            {selectedZone.maxHours && r.h > selectedZone.maxHours && (
                <div style={{ padding: "8px 12px", background: "rgba(220,38,38,0.08)", borderRadius: 6, fontSize: "0.82rem", marginTop: 8, color: "#dc2626", fontWeight: 600 }}>
                    ⚠️ Max stay in this zone is {selectedZone.maxHours} hours. Overstaying may result in an AED 100–150 fine.
                </div>
            )}

            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <h4>📊 If You Park Here Regularly</h4>
            <ResultRow label="Weekly (6 paid days)" value={fmtAED(r.weeklyEst)} sub />
            <ResultRow label="Monthly (~26 days)" value={fmtAED(r.monthlyEst)} warn />
            <ResultRow label="Annual estimate" value={fmtAED(r.annualEst)} warn />

            <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(59,130,246,0.05)", borderRadius: 6, fontSize: "0.82rem" }}>
                💡 <strong>Free parking:</strong> {emirate === "dubai" ? "Sundays all day, public holidays, and 10 PM – 8 AM (most zones)." : "Sundays all day and public holidays. Hours: Mon–Sat 8 AM – 12 AM."}
            </div>
        </div>
    </div>);
}

/* ═══════════════════════════════════════════════════
   COMMUTER TAB
   ═══════════════════════════════════════════════════ */
function CommuterTab() {
    const [emirate, setEmirate] = useState("dubai");
    const [zone, setZone] = useState("a_std");
    const [hoursPerDay, setHoursPerDay] = useState("8");
    const [daysPerWeek, setDaysPerWeek] = useState("5");

    const zones = emirate === "dubai" ? DUBAI_ZONES : AD_ZONES;
    const selectedZone = zones.find(z => z.id === zone) || zones[0];

    const handleEmirateChange = (e: string) => {
        setEmirate(e);
        setZone(e === "dubai" ? "a_std" : "ad_std");
    };

    const r = useMemo(() => {
        const h = parseFloat(hoursPerDay) || 0;
        const d = parseInt(daysPerWeek) || 5;

        // Mix of peak and off-peak for a typical workday (assume 4h peak + remaining off-peak)
        const peakHours = Math.min(h, 4);
        const offPeakHours = Math.max(0, h - 4);
        let dailyCost = peakHours * selectedZone.peakRate + offPeakHours * selectedZone.offPeakRate;

        if (selectedZone.dailyMax && dailyCost > selectedZone.dailyMax) {
            dailyCost = selectedZone.dailyMax;
        }

        const weeksPerMonth = 4.33;
        const monthlyPayGo = dailyCost * d * weeksPerMonth;
        const annualPayGo = monthlyPayGo * 12;

        // Monthly pass costs
        const monthlyPass = emirate === "dubai" ? null : 391; // Mawaqif monthly pass
        const annualPass = emirate === "dubai" ? null : 4695;
        const monthlySaving = monthlyPass ? Math.max(0, monthlyPayGo - monthlyPass) : null;
        const annualSaving = annualPass ? Math.max(0, annualPayGo - annualPass) : null;

        return { dailyCost, d, monthlyPayGo, annualPayGo, monthlyPass, annualPass, monthlySaving, annualSaving, peakHours, offPeakHours };
    }, [hoursPerDay, daysPerWeek, selectedZone, emirate]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                💰 Calculate your <strong>monthly commuter parking cost</strong> and compare pay-as-you-go vs monthly passes. Perfect for daily commuters deciding between parking options.
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="cm-emir">Emirate</label>
                <select id="cm-emir" className="con-input__field" value={emirate} onChange={e => handleEmirateChange(e.target.value)}>
                    <option value="dubai">Dubai</option>
                    <option value="abu_dhabi">Abu Dhabi</option>
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="cm-zone">Parking Zone</label>
                <select id="cm-zone" className="con-input__field" value={zone} onChange={e => setZone(e.target.value)}>
                    {zones.map(z => <option key={z.id} value={z.id}>{z.label}</option>)}
                </select>
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="cm-hrs">Hours Parked Per Day</label>
                <input id="cm-hrs" type="number" className="con-input__field" value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} min={1} max={24} step={0.5} />
            </div>
            <div className="con-input">
                <label className="con-input__label" htmlFor="cm-days">Days Per Week</label>
                <select id="cm-days" className="con-input__field" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)}>
                    <option value="5">5 days (Mon–Fri)</option>
                    <option value="6">6 days (Mon–Sat)</option>
                </select>
            </div>
        </div>

        <div className="con-calc__results">
            <h4>💰 Pay-As-You-Go Cost</h4>
            <ResultRow label={`Daily cost (${r.peakHours}h peak + ${r.offPeakHours}h off-peak)`} value={fmtAED(r.dailyCost)} sub />
            <ResultRow label={`Monthly (~${(r.d * 4.33).toFixed(0)} days)`} value={fmtAED(r.monthlyPayGo)} warn />
            <ResultRow label="Annual" value={fmtAED(r.annualPayGo)} warn />

            {emirate === "abu_dhabi" && r.monthlyPass && (
                <>
                    <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
                    <h4>🎫 Mawaqif Monthly Pass Comparison</h4>
                    <ResultRow label="Monthly pass cost" value={fmtAED(r.monthlyPass)} green />
                    <ResultRow label="Monthly pay-as-you-go" value={fmtAED(r.monthlyPayGo)} sub />
                    <ResultRow label={r.monthlySaving! > 0 ? "Monthly savings with pass 🎉" : "Pass costs more ❌"} value={fmtAED(Math.abs(r.monthlySaving!))} highlight={r.monthlySaving! > 0} warn={r.monthlySaving! <= 0} />
                    <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
                    <ResultRow label="Annual pass cost" value={fmtAED(r.annualPass!)} green />
                    <ResultRow label="Annual pay-as-you-go" value={fmtAED(r.annualPayGo)} sub />
                    <ResultRow label={r.annualSaving! > 0 ? "Annual savings with pass 🎉" : "Pass costs more ❌"} value={fmtAED(Math.abs(r.annualSaving!))} highlight={r.annualSaving! > 0} warn={r.annualSaving! <= 0} />
                </>
            )}

            {emirate === "dubai" && (
                <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(59,130,246,0.05)", borderRadius: 6, fontSize: "0.82rem" }}>
                    💡 <strong>Dubai tip:</strong> Consider alternative transport. A monthly Nol Silver card costs AED 25 + metro fares (AED 3–8.50/trip). For daily commuters, the Metro can be significantly cheaper than parking in premium zones.
                </div>
            )}
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
        <h4>Dubai RTA Parking Rates — April 2025</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Zone</th>
                <th style={th}>Peak/hr</th>
                <th style={th}>Off-Peak/hr</th>
                <th style={th}>Daily Max</th>
            </tr></thead><tbody>
                {DUBAI_ZONES.map((z, i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600, fontSize: "0.78rem" }}>{z.label}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#dc2626" }}>AED {z.peakRate}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>AED {z.offPeakRate}</td>
                        <td style={td}>{z.dailyMax ? `AED ${z.dailyMax}` : "—"}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Abu Dhabi Mawaqif Rates — 2025</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Zone</th>
                <th style={th}>Rate/hr</th>
                <th style={th}>Daily Max</th>
                <th style={th}>Max Stay</th>
            </tr></thead><tbody>
                {AD_ZONES.map((z, i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{z.label}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>AED {z.peakRate}</td>
                        <td style={td}>{z.dailyMax ? `AED ${z.dailyMax}` : "—"}</td>
                        <td style={td}>{z.maxHours ? `${z.maxHours} hrs` : "—"}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Mawaqif Parking Permits</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Permit</th>
                <th style={th}>Cost</th>
            </tr></thead><tbody>
                {([
                    ["Residential — 1st car (non-UAE)", "AED 800/year"],
                    ["Residential — 2nd car (non-UAE)", "AED 1,200/year"],
                    ["Residential — UAE nationals", "Free"],
                    ["Public — 1 month", "AED 391"],
                    ["Public — 3 months", "AED 1,174"],
                    ["Public — 6 months", "AED 2,348"],
                    ["Public — 1 year", "AED 4,695"],
                    ["Multi-storey — 1 year", "AED 5,475"],
                ] as string[][]).map(([permit, cost], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{permit}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#009639" }}>{cost}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Dubai Parking Fines</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>Violation</th>
                <th style={th}>Fine</th>
            </tr></thead><tbody>
                {([
                    ["No parking ticket / expired meter", "AED 150"],
                    ["Overstaying paid duration", "AED 100"],
                    ["Parking in non-designated area", "AED 200"],
                    ["Incorrect parking / obstructing traffic", "AED 200"],
                    ["Double parking", "AED 200–500"],
                    ["Blocking pedestrian crossing", "AED 400"],
                    ["Parking in disabled space without permit", "AED 1,000"],
                    ["Blocking fire hydrant", "AED 1,000"],
                    ["Damaging parking equipment", "AED 1,000"],
                ] as string[][]).map(([v, f], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600, fontSize: "0.78rem" }}>{v}</td>
                        <td style={{ ...td, fontWeight: 700, color: "#dc2626" }}>{f}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Free Parking Schedule</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}><thead><tr style={bh}>
                <th style={{ ...th, textAlign: "left" }}>When</th>
                <th style={th}>Dubai</th>
                <th style={th}>Abu Dhabi</th>
            </tr></thead><tbody>
                {([
                    ["Sundays", "Free all day ✅", "Free all day ✅"],
                    ["Public holidays", "Free all day ✅", "Free all day ✅"],
                    ["Night hours", "Free 10 PM – 8 AM ✅", "Free 12 AM – 8 AM ✅"],
                    ["Friday", "Paid (since 2025)", "Paid"],
                    ["Saturday", "Paid", "Paid"],
                    ["Exceptions", "Al Khail Gate: 24/7 paid", "—"],
                ] as string[][]).map(([when, dub, ad], i) => (
                    <tr key={i} style={b}>
                        <td style={{ ...tl, fontWeight: 600 }}>{when}</td>
                        <td style={{ ...td, fontSize: "0.78rem" }}>{dub}</td>
                        <td style={{ ...td, fontSize: "0.78rem" }}>{ad}</td>
                    </tr>
                ))}
            </tbody></table>
        </div>
    </div>);
}
