"use client";
import { useState, useMemo } from "react";
import {
    addSubtractTime,
    calculateTimeDuration,
    calculateTimeCard,
    calculateHoursBetween,
    convertToMilitary,
    convertFromMilitary,
    calculateReadingTime,
    calculatePlaybackSpeed,
    addSubtractDate,
    calculateDateDuration,
    calculateBusinessDays,
    calculateDaysUntil,
    calculateBirthYear,
    calculateDaysLeftInYear,
    calculateDeadline,
    calculateWeekNumber,
} from "@/lib/calculators/timeDate";

const pad = (n: number) => n.toString().padStart(2, "0");

// ─── Time Calculator ───
function TimeCalc() {
    const [h, setH] = useState(9);
    const [m, setM] = useState(30);
    const [s, setS] = useState(0);
    const [addH, setAddH] = useState(2);
    const [addM, setAddM] = useState(45);
    const [addS, setAddS] = useState(0);
    const [op, setOp] = useState<"add" | "subtract">("add");

    const result = useMemo(() => addSubtractTime(h, m, s, addH, addM, addS, op), [h, m, s, addH, addM, addS, op]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🕐 START TIME (HH : MM : SS)</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    <input type="number" className="calc-field__input" min={0} max={23} value={h} onChange={(e) => setH(Number(e.target.value))} style={{ flex: 1 }} placeholder="HH" />
                    <input type="number" className="calc-field__input" min={0} max={59} value={m} onChange={(e) => setM(Number(e.target.value))} style={{ flex: 1 }} placeholder="MM" />
                    <input type="number" className="calc-field__input" min={0} max={59} value={s} onChange={(e) => setS(Number(e.target.value))} style={{ flex: 1 }} placeholder="SS" />
                </div>
            </div>
            <div className="calc-field"><label className="calc-field__label">⚙️ OPERATION</label>
                <div className="tax-toggle">
                    <button className={`tax-toggle__btn${op === "add" ? " active" : ""}`} onClick={() => setOp("add")}>+ Add</button>
                    <button className={`tax-toggle__btn${op === "subtract" ? " active" : ""}`} onClick={() => setOp("subtract")}>− Subtract</button>
                </div>
            </div>
            <div className="calc-field"><label className="calc-field__label">⏱️ HOURS / MINUTES / SECONDS</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    <input type="number" className="calc-field__input" min={0} value={addH} onChange={(e) => setAddH(Number(e.target.value))} style={{ flex: 1 }} placeholder="H" />
                    <input type="number" className="calc-field__input" min={0} value={addM} onChange={(e) => setAddM(Number(e.target.value))} style={{ flex: 1 }} placeholder="M" />
                    <input type="number" className="calc-field__input" min={0} value={addS} onChange={(e) => setAddS(Number(e.target.value))} style={{ flex: 1 }} placeholder="S" />
                </div>
            </div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">RESULT</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.resultTime}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{result.originalTime} {op === "add" ? "+" : "−"} {addH}h {addM}m {addS}s = {result.formatted}</p>
            </div>
        </div>
    );
}

// ─── Time Duration ───
function TimeDurationCalc() {
    const [sH, setSH] = useState(9); const [sM, setSM] = useState(0); const [sS, setSS] = useState(0);
    const [eH, setEH] = useState(17); const [eM, setEM] = useState(30); const [eS, setES] = useState(0);

    const result = useMemo(() => calculateTimeDuration(sH, sM, sS, eH, eM, eS), [sH, sM, sS, eH, eM, eS]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🟢 START TIME (HH : MM : SS)</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    <input type="number" className="calc-field__input" min={0} max={23} value={sH} onChange={(e) => setSH(Number(e.target.value))} style={{ flex: 1 }} />
                    <input type="number" className="calc-field__input" min={0} max={59} value={sM} onChange={(e) => setSM(Number(e.target.value))} style={{ flex: 1 }} />
                    <input type="number" className="calc-field__input" min={0} max={59} value={sS} onChange={(e) => setSS(Number(e.target.value))} style={{ flex: 1 }} />
                </div>
            </div>
            <div className="calc-field"><label className="calc-field__label">🔴 END TIME (HH : MM : SS)</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    <input type="number" className="calc-field__input" min={0} max={23} value={eH} onChange={(e) => setEH(Number(e.target.value))} style={{ flex: 1 }} />
                    <input type="number" className="calc-field__input" min={0} max={59} value={eM} onChange={(e) => setEM(Number(e.target.value))} style={{ flex: 1 }} />
                    <input type="number" className="calc-field__input" min={0} max={59} value={eS} onChange={(e) => setES(Number(e.target.value))} style={{ flex: 1 }} />
                </div>
            </div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">DURATION</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.formatted}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">TOTAL MINUTES</p><p style={{ fontWeight: 700 }}>{result.totalMinutes.toLocaleString()}</p></div>
                    <div><p className="calc-field__label">TOTAL SECONDS</p><p style={{ fontWeight: 700 }}>{result.totalSeconds.toLocaleString()}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Time Card ───
function TimeCardCalc() {
    const [inH, setInH] = useState(9); const [inM, setInM] = useState(0);
    const [outH, setOutH] = useState(17); const [outM, setOutM] = useState(30);
    const [breakMins, setBreakMins] = useState(60);

    const result = useMemo(() => calculateTimeCard(inH, inM, outH, outM, breakMins), [inH, inM, outH, outM, breakMins]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🟢 CLOCK IN (HH : MM)</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    <input type="number" className="calc-field__input" min={0} max={23} value={inH} onChange={(e) => setInH(Number(e.target.value))} style={{ flex: 1 }} />
                    <input type="number" className="calc-field__input" min={0} max={59} value={inM} onChange={(e) => setInM(Number(e.target.value))} style={{ flex: 1 }} />
                </div>
            </div>
            <div className="calc-field"><label className="calc-field__label">🔴 CLOCK OUT (HH : MM)</label>
                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                    <input type="number" className="calc-field__input" min={0} max={23} value={outH} onChange={(e) => setOutH(Number(e.target.value))} style={{ flex: 1 }} />
                    <input type="number" className="calc-field__input" min={0} max={59} value={outM} onChange={(e) => setOutM(Number(e.target.value))} style={{ flex: 1 }} />
                </div>
            </div>
            <div className="calc-field"><label className="calc-field__label">☕ BREAK (MINUTES)</label>
                <input type="range" className="calc-field__slider" min={0} max={120} step={5} value={breakMins} onChange={(e) => setBreakMins(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={breakMins} onChange={(e) => setBreakMins(Number(e.target.value))} />
            </div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">NET HOURS WORKED</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.formatted}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">GROSS</p><p style={{ fontWeight: 700 }}>{result.grossHours}h {result.grossMinutes}m</p></div>
                    <div><p className="calc-field__label">BREAK</p><p style={{ fontWeight: 700 }}>{result.breakMinutes}m</p></div>
                    <div><p className="calc-field__label">DECIMAL</p><p style={{ fontWeight: 700 }}>{result.decimalHours}h</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Hours Calculator ───
function HoursCalc() {
    const now = new Date();
    const [startDate, setStartDate] = useState(now.toISOString().slice(0, 16));
    const tomorrow = new Date(now.getTime() + 86400000);
    const [endDate, setEndDate] = useState(tomorrow.toISOString().slice(0, 16));

    const result = useMemo(() => calculateHoursBetween(new Date(startDate), new Date(endDate)), [startDate, endDate]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🟢 START DATE & TIME</label><input type="datetime-local" className="calc-field__input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="calc-field"><label className="calc-field__label">🔴 END DATE & TIME</label><input type="datetime-local" className="calc-field__input" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">TOTAL DURATION</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.formatted}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{result.totalMinutes.toLocaleString()} total minutes</p>
            </div>
        </div>
    );
}

// ─── Military Time ───
function MilitaryTimeCalc() {
    const [mode, setMode] = useState<"toMil" | "fromMil">("toMil");
    const [h12, setH12] = useState(3); const [m12, setM12] = useState(30); const [period, setPeriod] = useState<"AM" | "PM">("PM");
    const [h24, setH24] = useState(15); const [m24, setM24] = useState(30);

    const result = useMemo(() => mode === "toMil" ? convertToMilitary(h12, m12, period) : convertFromMilitary(h24, m24), [mode, h12, m12, period, h24, m24]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🔄 CONVERSION DIRECTION</label>
                <div className="tax-toggle">
                    <button className={`tax-toggle__btn${mode === "toMil" ? " active" : ""}`} onClick={() => setMode("toMil")}>12h → 24h</button>
                    <button className={`tax-toggle__btn${mode === "fromMil" ? " active" : ""}`} onClick={() => setMode("fromMil")}>24h → 12h</button>
                </div>
            </div>
            {mode === "toMil" ? (
                <div className="calc-field"><label className="calc-field__label">🕐 12-HOUR TIME</label>
                    <div style={{ display: "flex", gap: "var(--s-2)" }}>
                        <input type="number" className="calc-field__input" min={1} max={12} value={h12} onChange={(e) => setH12(Number(e.target.value))} style={{ flex: 1 }} />
                        <input type="number" className="calc-field__input" min={0} max={59} value={m12} onChange={(e) => setM12(Number(e.target.value))} style={{ flex: 1 }} />
                        <div className="tax-toggle" style={{ flex: 1 }}>
                            <button className={`tax-toggle__btn${period === "AM" ? " active" : ""}`} onClick={() => setPeriod("AM")}>AM</button>
                            <button className={`tax-toggle__btn${period === "PM" ? " active" : ""}`} onClick={() => setPeriod("PM")}>PM</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="calc-field"><label className="calc-field__label">🎖️ 24-HOUR TIME</label>
                    <div style={{ display: "flex", gap: "var(--s-2)" }}>
                        <input type="number" className="calc-field__input" min={0} max={23} value={h24} onChange={(e) => setH24(Number(e.target.value))} style={{ flex: 1 }} />
                        <input type="number" className="calc-field__input" min={0} max={59} value={m24} onChange={(e) => setM24(Number(e.target.value))} style={{ flex: 1 }} />
                    </div>
                </div>
            )}
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">{mode === "toMil" ? "MILITARY (24H) TIME" : "STANDARD (12H) TIME"}</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{mode === "toMil" ? result.military : result.standard}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{result.standard} = {result.military} hours</p>
            </div>
        </div>
    );
}

// ─── Reading Time ───
function ReadingTimeCalc() {
    const [text, setText] = useState("Paste your text here to estimate reading time. The average adult reads at approximately 238 words per minute, while speaking pace is around 150 words per minute.");
    const [wpm, setWpm] = useState(238);

    const result = useMemo(() => calculateReadingTime(text, wpm), [text, wpm]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📝 YOUR TEXT</label>
                <textarea className="calc-field__input" rows={6} value={text} onChange={(e) => setText(e.target.value)} style={{ resize: "vertical", fontFamily: "inherit" }} placeholder="Paste or type your text here..." />
            </div>
            <div className="calc-field"><label className="calc-field__label">📖 READING SPEED (WPM)</label>
                <input type="range" className="calc-field__slider" min={100} max={500} step={10} value={wpm} onChange={(e) => setWpm(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} />
            </div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">READING TIME</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.formatted}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">WORDS</p><p style={{ fontWeight: 700 }}>{result.wordCount.toLocaleString()}</p></div>
                    <div><p className="calc-field__label">READING</p><p style={{ fontWeight: 700 }}>{result.readingTimeMinutes}m {result.readingTimeSeconds}s</p></div>
                    <div><p className="calc-field__label">SPEAKING</p><p style={{ fontWeight: 700 }}>~{result.speakingTimeMinutes} min</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Playback Speed ───
function PlaybackSpeedCalc() {
    const [duration, setDuration] = useState(60);
    const result = useMemo(() => calculatePlaybackSpeed(duration), [duration]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">⏩ ORIGINAL DURATION (MINUTES)</label>
                <input type="range" className="calc-field__slider" min={1} max={600} step={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">{duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : `${duration}m`}</span>
                </div>
            </div>
            <div style={{ marginTop: "var(--s-4)" }}>
                <table className="calc-table">
                    <thead><tr><th>Speed</th><th>Duration</th><th>Time Saved</th></tr></thead>
                    <tbody>
                        {result.speeds.map((s) => (
                            <tr key={s.speed} style={s.speed === 1 ? { background: "var(--n-surface-alt)" } : {}}>
                                <td style={{ fontWeight: 700 }}>{s.speed}×</td>
                                <td>{s.formatted}</td>
                                <td style={{ color: s.speed > 1 ? "var(--n-success)" : "var(--n-text-muted)" }}>{s.speed === 1 ? "—" : s.saved}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Date Calculator ───
function DateCalc() {
    const today = new Date().toISOString().split("T")[0];
    const [baseDate, setBaseDate] = useState(today);
    const [days, setDays] = useState(30); const [weeks, setWeeks] = useState(0);
    const [months, setMonths] = useState(0); const [years, setYears] = useState(0);
    const [op, setOp] = useState<"add" | "subtract">("add");

    const result = useMemo(() => addSubtractDate(new Date(baseDate), days, weeks, months, years, op), [baseDate, days, weeks, months, years, op]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📅 START DATE</label><input type="date" className="calc-field__input" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} /></div>
            <div className="calc-field"><label className="calc-field__label">⚙️ OPERATION</label>
                <div className="tax-toggle">
                    <button className={`tax-toggle__btn${op === "add" ? " active" : ""}`} onClick={() => setOp("add")}>+ Add</button>
                    <button className={`tax-toggle__btn${op === "subtract" ? " active" : ""}`} onClick={() => setOp("subtract")}>− Subtract</button>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-2)" }}>
                <div className="calc-field"><label className="calc-field__label">DAYS</label><input type="number" className="calc-field__input" min={0} value={days} onChange={(e) => setDays(Number(e.target.value))} /></div>
                <div className="calc-field"><label className="calc-field__label">WEEKS</label><input type="number" className="calc-field__input" min={0} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} /></div>
                <div className="calc-field"><label className="calc-field__label">MONTHS</label><input type="number" className="calc-field__input" min={0} value={months} onChange={(e) => setMonths(Number(e.target.value))} /></div>
                <div className="calc-field"><label className="calc-field__label">YEARS</label><input type="number" className="calc-field__input" min={0} value={years} onChange={(e) => setYears(Number(e.target.value))} /></div>
            </div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">RESULT DATE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.resultFormatted}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{result.dayOfWeek}</p>
            </div>
        </div>
    );
}

// ─── Date Duration ───
function DateDurationCalc() {
    const today = new Date();
    const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
    const future = new Date(today.getTime() + 90 * 86400000);
    const [endDate, setEndDate] = useState(future.toISOString().split("T")[0]);

    const result = useMemo(() => calculateDateDuration(new Date(startDate), new Date(endDate)), [startDate, endDate]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📅 START DATE</label><input type="date" className="calc-field__input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="calc-field"><label className="calc-field__label">📅 END DATE</label><input type="date" className="calc-field__input" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">DURATION</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.years > 0 ? `${result.years}y ` : ""}{result.months > 0 ? `${result.months}mo ` : ""}{result.days}d</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">TOTAL DAYS</p><p style={{ fontWeight: 700 }}>{result.totalDays.toLocaleString()}</p></div>
                    <div><p className="calc-field__label">TOTAL WEEKS</p><p style={{ fontWeight: 700 }}>{result.totalWeeks.toLocaleString()}</p></div>
                    <div><p className="calc-field__label">TOTAL MONTHS</p><p style={{ fontWeight: 700 }}>{result.totalMonths}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Business Days ───
function BusinessDaysCalc() {
    const today = new Date();
    const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
    const future = new Date(today.getTime() + 30 * 86400000);
    const [endDate, setEndDate] = useState(future.toISOString().split("T")[0]);

    const result = useMemo(() => calculateBusinessDays(new Date(startDate), new Date(endDate)), [startDate, endDate]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📅 START DATE</label><input type="date" className="calc-field__input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="calc-field"><label className="calc-field__label">📅 END DATE</label><input type="date" className="calc-field__input" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">BUSINESS DAYS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.businessDays}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">TOTAL DAYS</p><p style={{ fontWeight: 700 }}>{result.totalDays}</p></div>
                    <div><p className="calc-field__label">WEEKENDS</p><p style={{ fontWeight: 700 }}>{result.weekendDays}</p></div>
                    <div><p className="calc-field__label">WEEKS</p><p style={{ fontWeight: 700 }}>{result.weeks}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Days Until ───
function DaysUntilCalc() {
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    const [targetDate, setTargetDate] = useState(future.toISOString().split("T")[0]);

    const result = useMemo(() => calculateDaysUntil(new Date(targetDate)), [targetDate]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🎯 TARGET DATE</label><input type="date" className="calc-field__input" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">{result.isPast ? "DAYS AGO" : "DAYS UNTIL"}</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: result.isPast ? "var(--n-text-muted)" : "var(--n-primary)" }}>{Math.abs(result.daysUntil)} days</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{result.formatted}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">WEEKS</p><p style={{ fontWeight: 700 }}>{result.weeksUntil}</p></div>
                    <div><p className="calc-field__label">MONTHS</p><p style={{ fontWeight: 700 }}>{result.monthsUntil}</p></div>
                    <div><p className="calc-field__label">HOURS</p><p style={{ fontWeight: 700 }}>{result.hoursUntil.toLocaleString()}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Birth Year ───
function BirthYearCalc() {
    const [age, setAge] = useState(25);
    const result = useMemo(() => calculateBirthYear(age), [age]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🎂 CURRENT AGE</label>
                <input type="range" className="calc-field__slider" min={0} max={120} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={age} onChange={(e) => setAge(Number(e.target.value))} />
            </div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">BIRTH YEAR</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{result.birthYear}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                    If you are {age} years old, you were born in <strong>{result.possibleBirthYears[0]}</strong> or <strong>{result.possibleBirthYears[1]}</strong>, depending on whether your birthday has passed this year.
                </p>
            </div>
        </div>
    );
}

// ─── Days Left in Year ───
function DaysLeftYearCalc() {
    const result = useMemo(() => calculateDaysLeftInYear(), []);

    return (
        <div className="calc-card">
            <div className="calc-card" style={{ background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">DAYS LEFT IN {result.today.getFullYear()}</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.daysLeft} days</p>
                <div style={{ background: "var(--n-border)", borderRadius: "var(--r-md)", height: "12px", overflow: "hidden", marginBottom: "var(--s-3)" }}>
                    <div style={{ background: "var(--n-primary)", height: "100%", width: `${result.percentComplete}%`, borderRadius: "var(--r-md)", transition: "width 0.5s" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">PASSED</p><p style={{ fontWeight: 700 }}>{result.daysPassed}</p></div>
                    <div><p className="calc-field__label">REMAINING</p><p style={{ fontWeight: 700 }}>{result.daysLeft}</p></div>
                    <div><p className="calc-field__label">WEEKS LEFT</p><p style={{ fontWeight: 700 }}>{result.weeksLeft}</p></div>
                    <div><p className="calc-field__label">PROGRESS</p><p style={{ fontWeight: 700, color: "var(--n-primary)" }}>{result.percentComplete}%</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Deadline Calculator ───
function DeadlineCalc() {
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    const [leadDays, setLeadDays] = useState(14);

    const result = useMemo(() => calculateDeadline(new Date(startDate), leadDays), [startDate, leadDays]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📅 START DATE</label><input type="date" className="calc-field__input" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            <div className="calc-field"><label className="calc-field__label">⏱️ LEAD TIME (DAYS)</label>
                <input type="range" className="calc-field__slider" min={1} max={365} step={1} value={leadDays} onChange={(e) => setLeadDays(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={leadDays} onChange={(e) => setLeadDays(Number(e.target.value))} />
            </div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">CALENDAR DEADLINE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.deadlineFormatted}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <p className="calc-field__label">BUSINESS-DAY DEADLINE</p>
                <p style={{ fontSize: "var(--t-h2)", fontWeight: 700, color: "var(--n-text)", marginBottom: "var(--s-2)" }}>{result.businessDeadlineFormatted}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>Business-day deadline excludes weekends, so it may be later than the calendar deadline.</p>
            </div>
        </div>
    );
}

// ─── Week Calculator ───
function WeekCalc() {
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);
    const result = useMemo(() => calculateWeekNumber(new Date(date)), [date]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📅 SELECT DATE</label><input type="date" className="calc-field__input" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEEK NUMBER</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>Week {result.weekNumber} of {result.year}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">WEEK START</p><p style={{ fontWeight: 700 }}>{result.weekStartFormatted}</p></div>
                    <div><p className="calc-field__label">WEEK END</p><p style={{ fontWeight: 700 }}>{result.weekEndFormatted}</p></div>
                    <div><p className="calc-field__label">DAY OF YEAR</p><p style={{ fontWeight: 700 }}>#{result.dayOfYear}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Work Hours (Weekly Timesheet) ───
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
interface DayRow { startH: number; startM: number; endH: number; endM: number; breakMin: number; enabled: boolean; }

function WorkHoursCalc() {
    const defaultRow = (enabled: boolean, sH = 9, sM = 0, eH = 17, eM = 30, br = 60): DayRow => ({ startH: sH, startM: sM, endH: eH, endM: eM, breakMin: br, enabled });
    const [rows, setRows] = useState<DayRow[]>([
        defaultRow(true), defaultRow(true), defaultRow(true), defaultRow(true), defaultRow(true),
        defaultRow(false, 0, 0, 0, 0, 0), defaultRow(false, 0, 0, 0, 0, 0),
    ]);
    const [rate, setRate] = useState(25);
    const [showPay, setShowPay] = useState(false);

    const updateRow = (i: number, patch: Partial<DayRow>) => {
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
    };

    const calcDay = (r: DayRow) => {
        if (!r.enabled) return { netMin: 0, grossMin: 0, decHrs: 0, fmt: "—" };
        let startTotal = r.startH * 60 + r.startM;
        let endTotal = r.endH * 60 + r.endM;
        if (endTotal <= startTotal) endTotal += 1440; // overnight
        const grossMin = endTotal - startTotal;
        const netMin = Math.max(0, grossMin - r.breakMin);
        const h = Math.floor(netMin / 60);
        const m = netMin % 60;
        const decHrs = Math.round((netMin / 60) * 100) / 100;
        return { netMin, grossMin, decHrs, fmt: `${h}h ${pad(m)}m` };
    };

    const results = useMemo(() => {
        const daily = rows.map(calcDay);
        const totalMin = daily.reduce((s, d) => s + d.netMin, 0);
        const totalH = Math.floor(totalMin / 60);
        const totalM = totalMin % 60;
        const totalDec = Math.round((totalMin / 60) * 100) / 100;
        const regHrs = Math.min(totalDec, 40);
        const otHrs = Math.max(0, totalDec - 40);
        const regPay = Math.round(regHrs * rate * 100) / 100;
        const otPay = Math.round(otHrs * rate * 1.5 * 100) / 100;
        const grossPay = Math.round((regPay + otPay) * 100) / 100;
        return { daily, totalMin, totalH, totalM, totalDec, regHrs, otHrs, regPay, otPay, grossPay };
    }, [rows, rate]);

    return (
        <div className="calc-card">
            <div style={{ overflowX: "auto" }}>
                <table className="calc-table" style={{ fontSize: "var(--t-body-sm)", width: "100%" }}>
                    <thead><tr>
                        <th style={{ minWidth: 80 }}>Day</th>
                        <th style={{ minWidth: 60 }}>Start</th><th style={{ minWidth: 60 }}>End</th>
                        <th style={{ minWidth: 55 }}>Break</th><th style={{ minWidth: 70 }}>Net Hrs</th>
                        <th style={{ minWidth: 60 }}>Decimal</th>
                    </tr></thead>
                    <tbody>
                        {DAYS.map((day, i) => {
                            const d = results.daily[i];
                            return (
                                <tr key={day} style={{ opacity: rows[i].enabled ? 1 : 0.5 }}>
                                    <td>
                                        <label style={{ display: "flex", alignItems: "center", gap: "var(--s-1)", cursor: "pointer" }}>
                                            <input type="checkbox" checked={rows[i].enabled} onChange={(e) => updateRow(i, { enabled: e.target.checked })} />
                                            <span style={{ fontWeight: 600 }}>{day.slice(0, 3)}</span>
                                        </label>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: 2 }}>
                                            <input type="number" className="calc-field__input" style={{ width: 38, padding: "2px 4px", fontSize: "var(--t-body-sm)" }} min={0} max={23} value={rows[i].startH} onChange={(e) => updateRow(i, { startH: +e.target.value })} disabled={!rows[i].enabled} />
                                            <span>:</span>
                                            <input type="number" className="calc-field__input" style={{ width: 38, padding: "2px 4px", fontSize: "var(--t-body-sm)" }} min={0} max={59} value={rows[i].startM} onChange={(e) => updateRow(i, { startM: +e.target.value })} disabled={!rows[i].enabled} />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: 2 }}>
                                            <input type="number" className="calc-field__input" style={{ width: 38, padding: "2px 4px", fontSize: "var(--t-body-sm)" }} min={0} max={23} value={rows[i].endH} onChange={(e) => updateRow(i, { endH: +e.target.value })} disabled={!rows[i].enabled} />
                                            <span>:</span>
                                            <input type="number" className="calc-field__input" style={{ width: 38, padding: "2px 4px", fontSize: "var(--t-body-sm)" }} min={0} max={59} value={rows[i].endM} onChange={(e) => updateRow(i, { endM: +e.target.value })} disabled={!rows[i].enabled} />
                                        </div>
                                    </td>
                                    <td>
                                        <input type="number" className="calc-field__input" style={{ width: 50, padding: "2px 4px", fontSize: "var(--t-body-sm)" }} min={0} max={480} step={5} value={rows[i].breakMin} onChange={(e) => updateRow(i, { breakMin: +e.target.value })} disabled={!rows[i].enabled} />
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{d.fmt}</td>
                                    <td style={{ fontWeight: 600, color: "var(--n-primary)" }}>{rows[i].enabled ? d.decHrs.toFixed(2) : "—"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEEKLY TOTAL</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{results.totalH}h {pad(results.totalM)}m</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div><p className="calc-field__label">DECIMAL</p><p style={{ fontWeight: 700 }}>{results.totalDec.toFixed(2)} hrs</p></div>
                    <div><p className="calc-field__label">REGULAR</p><p style={{ fontWeight: 700 }}>{results.regHrs.toFixed(2)} hrs</p></div>
                    <div><p className="calc-field__label">OVERTIME</p><p style={{ fontWeight: 700, color: results.otHrs > 0 ? "var(--n-warning, #f59e0b)" : "var(--n-text-muted)" }}>{results.otHrs.toFixed(2)} hrs</p></div>
                </div>
            </div>

            <div className="calc-field" style={{ marginTop: "var(--s-4)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", cursor: "pointer" }}>
                    <input type="checkbox" checked={showPay} onChange={(e) => setShowPay(e.target.checked)} />
                    <span className="calc-field__label" style={{ margin: 0 }}>💰 SHOW PAY CALCULATION</span>
                </label>
            </div>
            {showPay && (
                <>
                    <div className="calc-field" style={{ marginTop: "var(--s-2)" }}>
                        <label className="calc-field__label">HOURLY RATE ($)</label>
                        <input type="number" className="calc-field__input" min={0} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} />
                    </div>
                    <div className="calc-card" style={{ marginTop: "var(--s-3)", background: "var(--n-surface-alt)" }}>
                        <p className="calc-field__label">ESTIMATED GROSS PAY</p>
                        <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>${results.grossPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                            <div><p className="calc-field__label">REGULAR PAY</p><p style={{ fontWeight: 700 }}>${results.regPay.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>({results.regHrs.toFixed(2)}h × ${rate})</span></p></div>
                            <div><p className="calc-field__label">OVERTIME PAY (1.5×)</p><p style={{ fontWeight: 700, color: results.otHrs > 0 ? "var(--n-warning, #f59e0b)" : "var(--n-text-muted)" }}>${results.otPay.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>({results.otHrs.toFixed(2)}h × ${(rate * 1.5).toFixed(2)})</span></p></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Dispatcher ───
const CALCULATORS: Record<string, React.FC> = {
    "time-calc": TimeCalc,
    "time-duration": TimeDurationCalc,
    "time-card": TimeCardCalc,
    "hours-calc": HoursCalc,
    "military-time": MilitaryTimeCalc,
    "reading-time": ReadingTimeCalc,
    "playback-speed": PlaybackSpeedCalc,
    "date-calc": DateCalc,
    "date-duration": DateDurationCalc,
    "business-days": BusinessDaysCalc,
    "days-until": DaysUntilCalc,
    "birth-year": BirthYearCalc,
    "days-left-year": DaysLeftYearCalc,
    "deadline-calc": DeadlineCalc,
    "week-calc": WeekCalc,
    "work-hours": WorkHoursCalc,
};

interface Props { calcType: string; }

export default function TimeDateCalculatorCore({ calcType }: Props) {
    const Calculator = CALCULATORS[calcType];
    if (!Calculator) return <p>Unknown calculator type: {calcType}</p>;
    return <Calculator />;
}
