"use client";
import { useState, useMemo, useCallback } from "react";

type Mode = "elo" | "perf" | "title" | "prob";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "elo", icon: "♟️", label: "Elo Calculator" },
    { key: "perf", icon: "🏆", label: "Performance Rating" },
    { key: "title", icon: "👑", label: "Title Tracker" },
    { key: "prob", icon: "🎯", label: "Win Probability" },
];

/* ─── Elo Math ─── */
function expectedScore(rA: number, rB: number): number {
    return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

function newRating(current: number, k: number, games: { oppRating: number; result: number }[]): { newRating: number; change: number; expectedTotal: number; actualTotal: number; perGame: { opp: number; expected: number; actual: number; delta: number }[] } {
    let totalChange = 0;
    let expectedTotal = 0;
    let actualTotal = 0;
    const perGame: { opp: number; expected: number; actual: number; delta: number }[] = [];
    for (const g of games) {
        const e = expectedScore(current + totalChange, g.oppRating);
        const delta = k * (g.result - e);
        expectedTotal += e;
        actualTotal += g.result;
        perGame.push({ opp: g.oppRating, expected: e, actual: g.result, delta });
        totalChange += delta;
    }
    return { newRating: Math.round((current + totalChange) * 10) / 10, change: Math.round(totalChange * 10) / 10, expectedTotal, actualTotal, perGame };
}

function perfRating(games: { oppRating: number; result: number }[]): number | null {
    if (games.length === 0) return null;
    const totalScore = games.reduce((s, g) => s + g.result, 0);
    const pct = totalScore / games.length;
    if (pct <= 0 || pct >= 1) return null;
    const avgOpp = games.reduce((s, g) => s + g.oppRating, 0) / games.length;
    // dp = −400 × log10(1/p − 1)
    const dp = -400 * Math.log10(1 / pct - 1);
    return Math.round(avgOpp + dp);
}

type Result = 1 | 0.5 | 0;
interface GameRow { id: number; oppRating: number; result: Result }

/* ═══════ MODE 1: ELO CALCULATOR ═══════ */
function EloMode() {
    const [currentRating, setCurrentRating] = useState(1500);
    const [kFactor, setKFactor] = useState(20);
    const [games, setGames] = useState<GameRow[]>([
        { id: 1, oppRating: 1450, result: 1 },
        { id: 2, oppRating: 1550, result: 0.5 },
        { id: 3, oppRating: 1600, result: 0 },
    ]);
    const [nextId, setNextId] = useState(4);

    const addGame = useCallback(() => {
        setGames(g => [...g, { id: nextId, oppRating: 1500, result: 0.5 }]);
        setNextId(n => n + 1);
    }, [nextId]);
    const removeGame = useCallback((id: number) => setGames(g => g.filter(x => x.id !== id)), []);
    const updateGame = useCallback((id: number, field: keyof GameRow, val: number) => {
        setGames(g => g.map(x => x.id === id ? { ...x, [field]: val } : x));
    }, []);

    const result = useMemo(() => {
        const validGames = games.filter(g => g.oppRating > 0);
        if (validGames.length === 0) return null;
        return newRating(currentRating, kFactor, validGames.map(g => ({ oppRating: g.oppRating, result: g.result })));
    }, [currentRating, kFactor, games]);

    const changeColor = result && result.change >= 0 ? "#16a34a" : "#dc2626";

    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                    <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 4 }}>Your FIDE Rating</label>
                    <input type="number" value={currentRating} onChange={e => setCurrentRating(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "1rem", fontWeight: 700 }} />
                </div>
                <div>
                    <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 4 }}>K-Factor</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        {[40, 20, 10].map(k => (
                            <button key={k} onClick={() => setKFactor(k)} style={{
                                flex: 1, padding: "10px 6px", borderRadius: 8, cursor: "pointer",
                                border: kFactor === k ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                                background: kFactor === k ? "var(--n-primary-light)" : "var(--n-surface)",
                                fontWeight: kFactor === k ? 800 : 500, fontSize: "0.9rem",
                                color: kFactor === k ? "var(--n-primary)" : "var(--n-text)",
                            }}>K={k}</button>
                        ))}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                        {kFactor === 40 ? "Junior (<18) or new (<30 games)" : kFactor === 20 ? "Standard (rating < 2400)" : "Elite (rating ≥ 2400)"}
                    </div>
                </div>
            </div>

            <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 8 }}>Tournament games — add opponents and results:</div>
            <div style={{ overflowX: "auto", maxHeight: 300, overflow: "auto", marginBottom: 12 }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)", position: "sticky", top: 0, background: "var(--n-surface-alt)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Rd</th>
                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Opponent Rating</th>
                        <th style={{ textAlign: "center", padding: "6px 4px" }}>Result</th>
                        <th style={{ textAlign: "center", padding: "6px 4px" }}></th>
                    </tr></thead>
                    <tbody>
                        {games.map((g, i) => (
                            <tr key={g.id} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "4px", fontWeight: 600, color: "var(--n-text-muted)" }}>{i + 1}</td>
                                <td style={{ padding: "4px" }}>
                                    <input type="number" value={g.oppRating} onChange={e => updateGame(g.id, "oppRating", Number(e.target.value) || 0)}
                                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid var(--n-border)", fontSize: "0.85rem" }} />
                                </td>
                                <td style={{ padding: "4px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                                        {([1, 0.5, 0] as Result[]).map(r => (
                                            <button key={r} onClick={() => updateGame(g.id, "result", r)} style={{
                                                padding: "5px 10px", borderRadius: 6, fontSize: "0.78rem", cursor: "pointer",
                                                border: g.result === r ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                                                background: g.result === r ? (r === 1 ? "var(--n-success-light)" : r === 0 ? "var(--n-danger-light)" : "var(--n-gold-light)") : "var(--n-surface)",
                                                fontWeight: g.result === r ? 700 : 500,
                                                color: r === 1 ? "#16a34a" : r === 0 ? "#dc2626" : "var(--n-gold-text)",
                                            }}>{r === 1 ? "Win" : r === 0.5 ? "Draw" : "Loss"}</button>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ textAlign: "center", padding: "4px" }}>
                                    {games.length > 1 && <button onClick={() => removeGame(g.id)} style={{
                                        border: "none", background: "var(--n-danger-light)", color: "#dc2626", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem"
                                    }}>✕</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addGame} style={{
                padding: "8px 16px", borderRadius: 8, border: "1px dashed var(--n-primary)", background: "var(--n-primary-light)",
                color: "var(--n-primary)", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", marginBottom: 14, width: "100%"
            }}>+ Add Round</button>

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>New Rating</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--t-mono)" }}>{result.newRating}</div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>Rating Change</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: changeColor, fontFamily: "var(--t-mono)" }}>
                                {result.change > 0 ? "+" : ""}{result.change}
                            </div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>Score</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--t-mono)" }}>
                                {result.actualTotal}/{games.length}
                            </div>
                        </div>
                    </div>

                    <details>
                        <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "var(--n-primary)" }}>📊 Round-by-Round Breakdown</summary>
                        <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse", marginTop: 8 }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                                <th style={{ textAlign: "left", padding: "5px 3px" }}>Rd</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Opp</th>
                                <th style={{ textAlign: "center", padding: "5px 3px" }}>Result</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Expected</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Δ Rating</th>
                            </tr></thead>
                            <tbody>
                                {result.perGame.map((pg, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                        <td style={{ padding: "4px 3px" }}>{i + 1}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px" }}>{pg.opp}</td>
                                        <td style={{ textAlign: "center", padding: "4px 3px", fontWeight: 700, color: pg.actual === 1 ? "#16a34a" : pg.actual === 0 ? "#dc2626" : "var(--n-gold-text)" }}>
                                            {pg.actual === 1 ? "1" : pg.actual === 0.5 ? "½" : "0"}
                                        </td>
                                        <td style={{ textAlign: "right", padding: "4px 3px" }}>{pg.expected.toFixed(2)}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px", fontWeight: 700, color: pg.delta >= 0 ? "#16a34a" : "#dc2626" }}>
                                            {pg.delta >= 0 ? "+" : ""}{pg.delta.toFixed(1)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </details>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 2: PERFORMANCE RATING ═══════ */
function PerfMode() {
    const [games, setGames] = useState<GameRow[]>([
        { id: 1, oppRating: 1800, result: 1 }, { id: 2, oppRating: 1900, result: 1 },
        { id: 3, oppRating: 2000, result: 0.5 }, { id: 4, oppRating: 1850, result: 1 },
        { id: 5, oppRating: 2100, result: 0 }, { id: 6, oppRating: 1750, result: 1 },
        { id: 7, oppRating: 1950, result: 0.5 }, { id: 8, oppRating: 2050, result: 0 },
        { id: 9, oppRating: 1900, result: 1 },
    ]);
    const [nextId, setNextId] = useState(10);

    const addGame = useCallback(() => { setGames(g => [...g, { id: nextId, oppRating: 1800, result: 0.5 }]); setNextId(n => n + 1); }, [nextId]);
    const removeGame = useCallback((id: number) => setGames(g => g.filter(x => x.id !== id)), []);
    const updateGame = useCallback((id: number, field: keyof GameRow, val: number) => {
        setGames(g => g.map(x => x.id === id ? { ...x, [field]: val } : x));
    }, []);

    const result = useMemo(() => {
        const valid = games.filter(g => g.oppRating > 0);
        if (valid.length === 0) return null;
        const avgOpp = Math.round(valid.reduce((s, g) => s + g.oppRating, 0) / valid.length);
        const totalScore = valid.reduce((s, g) => s + g.result, 0);
        const pct = totalScore / valid.length;
        const tpr = perfRating(valid.map(g => ({ oppRating: g.oppRating, result: g.result })));
        return { avgOpp, totalScore, totalGames: valid.length, pct, tpr };
    }, [games]);

    return (
        <>
            <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 10 }}>Enter opponent ratings and results for each round of your tournament:</div>
            <div style={{ overflowX: "auto", maxHeight: 320, overflow: "auto", marginBottom: 12 }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)", position: "sticky", top: 0, background: "var(--n-surface-alt)" }}>
                        <th style={{ textAlign: "left", padding: "5px 3px" }}>Rd</th>
                        <th style={{ textAlign: "left", padding: "5px 3px" }}>Opp Rating</th>
                        <th style={{ textAlign: "center", padding: "5px 3px" }}>Result</th>
                        <th style={{ textAlign: "center", padding: "5px 3px" }}></th>
                    </tr></thead>
                    <tbody>
                        {games.map((g, i) => (
                            <tr key={g.id} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "3px", fontWeight: 600, color: "var(--n-text-muted)" }}>{i + 1}</td>
                                <td style={{ padding: "3px" }}>
                                    <input type="number" value={g.oppRating} onChange={e => updateGame(g.id, "oppRating", Number(e.target.value) || 0)}
                                        style={{ width: "100%", padding: "5px 6px", borderRadius: 6, border: "1px solid var(--n-border)", fontSize: "0.82rem" }} />
                                </td>
                                <td style={{ padding: "3px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                                        {([1, 0.5, 0] as Result[]).map(r => (
                                            <button key={r} onClick={() => updateGame(g.id, "result", r)} style={{
                                                padding: "4px 8px", borderRadius: 6, fontSize: "0.75rem", cursor: "pointer",
                                                border: g.result === r ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                                                background: g.result === r ? (r === 1 ? "var(--n-success-light)" : r === 0 ? "var(--n-danger-light)" : "var(--n-gold-light)") : "var(--n-surface)",
                                                fontWeight: g.result === r ? 700 : 500,
                                            }}>{r === 1 ? "W" : r === 0.5 ? "D" : "L"}</button>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ textAlign: "center", padding: "3px" }}>
                                    {games.length > 1 && <button onClick={() => removeGame(g.id)} style={{ border: "none", background: "var(--n-danger-light)", color: "#dc2626", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: "0.75rem" }}>✕</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addGame} style={{ padding: "7px 14px", borderRadius: 8, border: "1px dashed var(--n-primary)", background: "var(--n-primary-light)", color: "var(--n-primary)", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", marginBottom: 14, width: "100%" }}>+ Add Round</button>

            {result && result.tpr !== null && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Tournament Performance Rating (TPR)</div>
                    <div style={{ fontSize: "2.6rem", fontWeight: 800, fontFamily: "var(--t-mono)", margin: "8px 0" }}>{result.tpr}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                            ["Avg Opponent", String(result.avgOpp)], ["Score", `${result.totalScore}/${result.totalGames}`], ["Score %", `${(result.pct * 100).toFixed(0)}%`],
                        ].map(([l, v], i) => (
                            <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 8, textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                                <div style={{ fontSize: "1rem", fontWeight: 700 }}>{v}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 3: TITLE TRACKER ═══════ */
function TitleMode() {
    const [currentRating, setCurrentRating] = useState(2100);
    const [target, setTarget] = useState<"CM" | "FM" | "IM" | "GM">("FM");
    const TITLES = { CM: { rating: 2200, norms: 0, label: "Candidate Master" }, FM: { rating: 2300, norms: 0, label: "FIDE Master" }, IM: { rating: 2400, norms: 3, label: "International Master" }, GM: { rating: 2500, norms: 3, label: "Grandmaster" } };
    const t = TITLES[target];
    const gap = Math.max(0, t.rating - currentRating);
    const gamesEstimate = gap > 0 ? Math.ceil(gap / 5) : 0; // ~5 points per strong tournament

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 4 }}>Your Current Rating</label>
                <input type="number" value={currentRating} onChange={e => setCurrentRating(Number(e.target.value) || 0)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "1rem", fontWeight: 700 }} />
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {(["CM", "FM", "IM", "GM"] as const).map(tt => (
                    <button key={tt} onClick={() => setTarget(tt)} style={{
                        flex: 1, padding: "10px 6px", borderRadius: 8, cursor: "pointer",
                        border: target === tt ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: target === tt ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: target === tt ? 800 : 500, fontSize: "0.85rem",
                        color: target === tt ? "var(--n-primary)" : "var(--n-text)",
                    }}>{tt}</button>
                ))}
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: gap === 0 ? "#16a34a" : "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        {gap === 0 ? `✅ You qualify for ${t.label}!` : `Path to ${t.label} (${target})`}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--t-mono)", margin: "8px 0" }}>
                        {gap === 0 ? `${t.rating}+` : `+${gap} points needed`}
                    </div>
                </div>

                <div style={{ background: "var(--n-surface)", borderRadius: 10, height: 24, marginBottom: "var(--s-3)", overflow: "hidden", position: "relative" }}>
                    <div style={{
                        height: "100%", borderRadius: 10, background: gap === 0 ? "#16a34a" : "var(--n-primary)",
                        width: `${Math.min(100, (currentRating / t.rating) * 100)}%`, transition: "width 0.3s",
                    }} />
                    <div style={{ position: "absolute", top: 3, left: "50%", transform: "translateX(-50%)", fontSize: "0.72rem", fontWeight: 700 }}>
                        {currentRating} / {t.rating}
                    </div>
                </div>

                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Required Rating", String(t.rating)],
                            ["Your Rating", String(currentRating)],
                            ["Rating Gap", gap > 0 ? `+${gap}` : "✅ Met"],
                            ["Norms Required", t.norms > 0 ? `${t.norms} norms` : "None (rating only)"],
                            ["Est. Rated Games", gap > 0 ? `~${gamesEstimate} games` : "—"],
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "6px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ padding: "6px 4px", fontWeight: 700, textAlign: "right" }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════ MODE 4: WIN PROBABILITY ═══════ */
function ProbMode() {
    const [yourRating, setYourRating] = useState(1500);
    const [oppRating, setOppRating] = useState(1700);

    const es = useMemo(() => expectedScore(yourRating, oppRating), [yourRating, oppRating]);
    const diff = yourRating - oppRating;

    const TABLE_DIFFS = [0, 25, 50, 100, 150, 200, 250, 300, 350, 400];

    return (
        <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                    <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 4 }}>Your Rating</label>
                    <input type="number" value={yourRating} onChange={e => setYourRating(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "1rem", fontWeight: 700 }} />
                </div>
                <div>
                    <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: 4 }}>Opponent Rating</label>
                    <input type="number" value={oppRating} onChange={e => setOppRating(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "1rem", fontWeight: 700 }} />
                </div>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center", marginBottom: "var(--s-3)" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Expected Score (Your Win Probability)
                </div>
                <div style={{ fontSize: "2.6rem", fontWeight: 800, fontFamily: "var(--t-mono)", margin: "8px 0" }}>
                    {(es * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>
                    Rating diff: {diff > 0 ? "+" : ""}{diff} | Expected score: {es.toFixed(3)}
                </div>

                <div style={{ display: "flex", height: 30, borderRadius: 8, overflow: "hidden", marginTop: 12 }}>
                    <div style={{ width: `${es * 100}%`, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>
                        {es > 0.15 ? `Win ${(es * 100).toFixed(0)}%` : ""}
                    </div>
                    <div style={{ width: `${(1 - es) * 100}%`, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>
                        {(1 - es) > 0.15 ? `Loss ${((1 - es) * 100).toFixed(0)}%` : ""}
                    </div>
                </div>
            </div>

            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 8 }}>📋 Expected Score Table (by Rating Difference)</h4>
            <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                    <th style={{ textAlign: "left", padding: "5px 3px" }}>Rating Diff</th>
                    <th style={{ textAlign: "center", padding: "5px 3px" }}>Higher Rated</th>
                    <th style={{ textAlign: "center", padding: "5px 3px" }}>Lower Rated</th>
                </tr></thead>
                <tbody>
                    {TABLE_DIFFS.map(d => {
                        const esH = expectedScore(1500 + d, 1500);
                        return (
                            <tr key={d} style={{ borderBottom: "1px solid var(--n-border)", background: Math.abs(diff) >= d && Math.abs(diff) < (TABLE_DIFFS[TABLE_DIFFS.indexOf(d) + 1] || 999) ? "var(--n-primary-light)" : undefined }}>
                                <td style={{ padding: "4px 3px", fontWeight: 600 }}>{d === 0 ? "Equal" : `+${d}`}</td>
                                <td style={{ textAlign: "center", padding: "4px 3px" }}>{(esH * 100).toFixed(0)}%</td>
                                <td style={{ textAlign: "center", padding: "4px 3px" }}>{((1 - esH) * 100).toFixed(0)}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}

/* ═══════ MAIN ═══════ */
export default function FIDERatingCalculatorCore() {
    const [mode, setMode] = useState<Mode>("elo");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, #1e293b, #334155)" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>♟️ FIDE Rating Calculator — Elo System</h2>
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 4 }}>Calculate new Elo rating • Tournament performance • Title progress • Win probability</div>
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
                {mode === "elo" && <EloMode />}
                {mode === "perf" && <PerfMode />}
                {mode === "title" && <TitleMode />}
                {mode === "prob" && <ProbMode />}
            </div>
        </div>
    );
}
