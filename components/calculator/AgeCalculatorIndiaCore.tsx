"use client";

import { useState, useMemo } from "react";

type CalcMode = "age" | "milestones" | "difference";

function daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}
function isLeapYear(y: number): boolean {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function calcAge(dob: Date, ref: Date): { years: number; months: number; days: number } {
    let years = ref.getFullYear() - dob.getFullYear();
    let months = ref.getMonth() - dob.getMonth();
    let days = ref.getDate() - dob.getDate();
    if (days < 0) {
        months--;
        days += daysInMonth(ref.getFullYear(), ref.getMonth());
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

function totalDaysBetween(a: Date, b: Date): number {
    return Math.floor(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(d: Date): string {
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function toInputStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface Milestone { age: number; label: string; icon: string; category: string; }
const MILESTONES: Milestone[] = [
    { age: 5, label: "Aadhaar Biometric Update (Mandatory)", icon: "🪪", category: "Documents" },
    { age: 6, label: "School Class 1 Admission (NEP 2020/RTE)", icon: "🏫", category: "Education" },
    { age: 10, label: "Minor Bank Account (with guardian)", icon: "🏦", category: "Finance" },
    { age: 14, label: "End of Compulsory Education (RTE Act)", icon: "📚", category: "Education" },
    { age: 15, label: "Aadhaar 2nd Biometric Update", icon: "🪪", category: "Documents" },
    { age: 16, label: "Gearless Motorcycle License (<50cc)", icon: "🛵", category: "Driving" },
    { age: 18, label: "Voting Rights (61st Amendment)", icon: "🗳️", category: "Legal" },
    { age: 18, label: "Driving License (Car & Motorcycle)", icon: "🚗", category: "Driving" },
    { age: 18, label: "Legal Marriage Age (Women — PCMA 2006)", icon: "💒", category: "Legal" },
    { age: 18, label: "Passport Application (Independent)", icon: "📕", category: "Documents" },
    { age: 21, label: "Legal Marriage Age (Men — PCMA 2006)", icon: "💒", category: "Legal" },
    { age: 21, label: "Legal Drinking Age (Most States)", icon: "🍷", category: "Legal" },
    { age: 25, label: "Drinking Age (Punjab, Haryana, Chandigarh)", icon: "🍷", category: "Legal" },
    { age: 55, label: "Voluntary Retirement (VRS — Most Companies)", icon: "📋", category: "Retirement" },
    { age: 58, label: "EPFO/PF Full Withdrawal Eligible", icon: "💰", category: "Retirement" },
    { age: 60, label: "Senior Citizen (Income Tax Benefits)", icon: "👴", category: "Retirement" },
    { age: 60, label: "Central/State Govt Retirement", icon: "🏛️", category: "Retirement" },
    { age: 60, label: "NPS Vesting Age", icon: "📊", category: "Retirement" },
    { age: 80, label: "Super Senior Citizen (Higher Tax Exemption)", icon: "🌟", category: "Retirement" },
];

export default function AgeCalculatorIndiaCore() {
    const [mode, setMode] = useState<CalcMode>("age");
    const today = new Date();

    /* Mode 1: Age */
    const [dob, setDob] = useState("1990-01-15");
    const [refDate, setRefDate] = useState(toInputStr(today));

    /* Mode 2: Milestones */
    const [msDob, setMsDob] = useState("1990-01-15");

    /* Mode 3: Difference */
    const [dobA, setDobA] = useState("1990-01-15");
    const [dobB, setDobB] = useState("1995-06-20");

    /* ── Age Results ── */
    const ageResult = useMemo(() => {
        const d = new Date(dob);
        const r = new Date(refDate);
        if (isNaN(d.getTime()) || isNaN(r.getTime()) || d > r) return null;
        const age = calcAge(d, r);
        const totalDays = totalDaysBetween(d, r);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = age.years * 12 + age.months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;
        // Next birthday
        let nextBday = new Date(r.getFullYear(), d.getMonth(), d.getDate());
        if (nextBday <= r) nextBday = new Date(r.getFullYear() + 1, d.getMonth(), d.getDate());
        const daysToNextBday = totalDaysBetween(r, nextBday);
        const nextBdayAge = nextBday.getFullYear() - d.getFullYear();
        return { age, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, totalSeconds, daysToNextBday, nextBdayAge, nextBdayDate: nextBday, dobDate: d, leapBaby: d.getMonth() === 1 && d.getDate() === 29 };
    }, [dob, refDate]);

    /* ── Milestone Results ── */
    const msResults = useMemo(() => {
        const d = new Date(msDob);
        if (isNaN(d.getTime())) return [];
        return MILESTONES.map((m) => {
            const milestoneDate = new Date(d.getFullYear() + m.age, d.getMonth(), d.getDate());
            const reached = milestoneDate <= today;
            const daysRemaining = reached ? 0 : totalDaysBetween(today, milestoneDate);
            return { ...m, milestoneDate, reached, daysRemaining };
        });
    }, [msDob]);

    /* ── Difference Results ── */
    const diffResult = useMemo(() => {
        const a = new Date(dobA);
        const b = new Date(dobB);
        if (isNaN(a.getTime()) || isNaN(b.getTime())) return null;
        const older = a < b ? a : b;
        const younger = a < b ? b : a;
        const diff = calcAge(older, younger);
        const totalDays = totalDaysBetween(older, younger);
        const ageA = calcAge(a, today);
        const ageB = calcAge(b, today);
        return { diff, totalDays, olderLabel: a < b ? "Person A" : "Person B", ageA, ageB };
    }, [dobA, dobB]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};
    const thStyle = { padding: "10px 12px", fontWeight: 600 as const, fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.5px" };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">🎂 Age Calculator India</h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["age", "Calculate Age"], ["milestones", "🇮🇳 Milestone Tracker"], ["difference", "Age Difference"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE: AGE ═══════ */}
            {mode === "age" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Date of Birth</label>
                            <input type="date" className="con-input__field" value={dob} onChange={(e) => setDob(e.target.value)} max={toInputStr(today)} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Calculate Age On</label>
                            <input type="date" className="con-input__field" value={refDate} onChange={(e) => setRefDate(e.target.value)} />
                        </div>
                    </div>

                    {ageResult && (
                        <div className="con-calc__results">
                            <h4>Your Age</h4>
                            <div style={{ textAlign: "center", padding: "16px 0", borderBottom: "1px solid var(--border)", marginBottom: "16px" }}>
                                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#d4620a", letterSpacing: "-1px" }}>
                                    {ageResult.age.years} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>years</span>{" "}
                                    {ageResult.age.months} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>months</span>{" "}
                                    {ageResult.age.days} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>days</span>
                                </div>
                            </div>

                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                        <th style={{ ...thStyle, textAlign: "left" }}>Unit</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Value</th>
                                    </tr></thead>
                                    <tbody>
                                        {[
                                            ["Age in Months", `${ageResult.totalMonths.toLocaleString("en-IN")} months, ${ageResult.age.days} days`],
                                            ["Age in Weeks", `${ageResult.totalWeeks.toLocaleString("en-IN")} weeks, ${ageResult.totalDays % 7} days`],
                                            ["Age in Days", ageResult.totalDays.toLocaleString("en-IN")],
                                            ["Age in Hours", ageResult.totalHours.toLocaleString("en-IN")],
                                            ["Age in Minutes", ageResult.totalMinutes.toLocaleString("en-IN")],
                                            ["Age in Seconds", ageResult.totalSeconds.toLocaleString("en-IN")],
                                        ].map(([label, val], i) => (
                                            <tr key={i} style={i % 2 === 1 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{label}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                🎂 <strong>Next Birthday:</strong> Your {ageResult.nextBdayAge}{ageResult.nextBdayAge === 1 ? "st" : ageResult.nextBdayAge === 2 ? "nd" : ageResult.nextBdayAge === 3 ? "rd" : "th"} birthday is on <strong>{formatDate(ageResult.nextBdayDate)}</strong> — <strong>{ageResult.daysToNextBday} days</strong> away!
                                {ageResult.leapBaby && <><br />🌟 <strong>Leap Year Baby!</strong> You were born on February 29. In non-leap years, your birthday is celebrated on Feb 28 or March 1.</>}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: MILESTONES ═══════ */}
            {mode === "milestones" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "16px", maxWidth: "400px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Your Date of Birth</label>
                            <input type="date" className="con-input__field" value={msDob} onChange={(e) => setMsDob(e.target.value)} max={toInputStr(today)} />
                        </div>
                    </div>

                    {msResults.length > 0 && (
                        <div className="con-calc__results">
                            <h4>🇮🇳 India Legal Age Milestones</h4>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                        <th style={{ ...thStyle, textAlign: "center", width: "40px" }}></th>
                                        <th style={{ ...thStyle, textAlign: "center", width: "50px" }}>Age</th>
                                        <th style={{ ...thStyle, textAlign: "left" }}>Milestone</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Date / Status</th>
                                    </tr></thead>
                                    <tbody>
                                        {msResults.map((m, i) => (
                                            <tr key={i} style={{ background: m.reached ? "rgba(22,163,74,0.04)" : "rgba(255,153,51,0.03)" }}>
                                                <td style={{ padding: "8px 6px", borderBottom: "1px solid var(--border)", textAlign: "center", fontSize: "1.1rem" }}>{m.icon}</td>
                                                <td style={{ padding: "8px 6px", borderBottom: "1px solid var(--border)", textAlign: "center", fontWeight: 700 }}>{m.age}</td>
                                                <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)" }}>
                                                    <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{m.label}</div>
                                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{m.category}</div>
                                                </td>
                                                <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", whiteSpace: "nowrap" }}>
                                                    {m.reached ? (
                                                        <span style={{ color: "#16a34a", fontWeight: 700 }}>✅ {formatDate(m.milestoneDate)}</span>
                                                    ) : (
                                                        <span style={{ color: "#d4620a", fontWeight: 600 }}>⏳ {m.daysRemaining.toLocaleString("en-IN")} days</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>How It Works:</strong> We calculate the exact date you reach each legal milestone based on your date of birth. Green ✅ means you've already reached that age. Orange ⏳ shows days remaining. All ages are based on Indian law — PCMA 2006, Motor Vehicles Act 1988, Income Tax Act, and NEP 2020.
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: DIFFERENCE ═══════ */}
            {mode === "difference" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Person A — Date of Birth</label>
                            <input type="date" className="con-input__field" value={dobA} onChange={(e) => setDobA(e.target.value)} max={toInputStr(today)} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Person B — Date of Birth</label>
                            <input type="date" className="con-input__field" value={dobB} onChange={(e) => setDobB(e.target.value)} max={toInputStr(today)} />
                        </div>
                    </div>

                    {diffResult && (
                        <div className="con-calc__results">
                            <h4>Age Difference</h4>
                            <div style={{ textAlign: "center", padding: "16px 0", borderBottom: "1px solid var(--border)", marginBottom: "16px" }}>
                                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#d4620a", letterSpacing: "-1px" }}>
                                    {diffResult.diff.years} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>years</span>{" "}
                                    {diffResult.diff.months} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>months</span>{" "}
                                    {diffResult.diff.days} <span style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text-muted)" }}>days</span>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                                <div style={{ padding: "16px", border: "2px solid #16a34a", borderRadius: "12px", background: "rgba(22,163,74,0.03)" }}>
                                    <div style={{ fontWeight: 700, marginBottom: "8px", color: "#16a34a", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Person A</div>
                                    <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{diffResult.ageA.years} yrs {diffResult.ageA.months} mo {diffResult.ageA.days} days</div>
                                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>Born: {formatDate(new Date(dobA))}</div>
                                </div>
                                <div style={{ padding: "16px", border: "2px solid #d4620a", borderRadius: "12px", background: "rgba(212,98,10,0.03)" }}>
                                    <div style={{ fontWeight: 700, marginBottom: "8px", color: "#d4620a", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Person B</div>
                                    <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{diffResult.ageB.years} yrs {diffResult.ageB.months} mo {diffResult.ageB.days} days</div>
                                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>Born: {formatDate(new Date(dobB))}</div>
                                </div>
                            </div>

                            <div className="con-result-row"><span className="con-result-row__label">{diffResult.olderLabel} is older by</span><span className="con-result-row__value">{diffResult.diff.years} yrs, {diffResult.diff.months} mo, {diffResult.diff.days} days</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total day difference</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{diffResult.totalDays.toLocaleString("en-IN")} days</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>Fun Fact:</strong> {diffResult.olderLabel} is exactly <strong>{diffResult.totalDays.toLocaleString("en-IN")} days</strong> older. That's approximately <strong>{(diffResult.totalDays / 7).toFixed(0)} weeks</strong> or <strong>{(diffResult.totalDays / 30.44).toFixed(1)} months</strong>.
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
