"use client";
import { useState, useMemo } from "react";

type Mode = "navy" | "bmi" | "categories" | "lbm";
type Gender = "male" | "female";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "navy", icon: "📏", label: "US Navy Method" },
    { key: "bmi", icon: "⚖️", label: "BMI-Based Estimate" },
    { key: "categories", icon: "📊", label: "Category Reference" },
    { key: "lbm", icon: "💪", label: "Lean Body Mass" },
];

/* ─── Formulas ─── */
function navyBF(gender: Gender, heightCm: number, neckCm: number, waistCm: number, hipCm: number): number | null {
    const h = heightCm / 2.54, n = neckCm / 2.54, w = waistCm / 2.54, hi = hipCm / 2.54;
    if (h <= 0 || n <= 0 || w <= 0) return null;
    if (gender === "male") {
        const v = w - n;
        if (v <= 0) return null;
        return 86.010 * Math.log10(v) - 70.041 * Math.log10(h) + 36.76;
    } else {
        if (hi <= 0) return null;
        const v = w + hi - n;
        if (v <= 0) return null;
        return 163.205 * Math.log10(v) - 97.684 * Math.log10(h) - 78.387;
    }
}

function bmiBF(bmi: number, age: number, gender: Gender): number {
    return 1.20 * bmi + 0.23 * age - 10.8 * (gender === "male" ? 1 : 0) - 5.4;
}

function getCategory(bf: number, gender: Gender): { label: string; color: string } {
    if (gender === "male") {
        if (bf < 6) return { label: "Essential Fat", color: "#ef4444" };
        if (bf < 14) return { label: "Athletes", color: "#3b82f6" };
        if (bf < 18) return { label: "Fitness", color: "#16a34a" };
        if (bf < 25) return { label: "Average", color: "#f59e0b" };
        return { label: "Obese", color: "#dc2626" };
    } else {
        if (bf < 14) return { label: "Essential Fat", color: "#ef4444" };
        if (bf < 21) return { label: "Athletes", color: "#3b82f6" };
        if (bf < 25) return { label: "Fitness", color: "#16a34a" };
        if (bf < 32) return { label: "Average", color: "#f59e0b" };
        return { label: "Obese", color: "#dc2626" };
    }
}

function getCategoryBarPct(bf: number, gender: Gender): number {
    const max = gender === "male" ? 40 : 50;
    return Math.min(100, Math.max(0, (bf / max) * 100));
}

function GenderToggle({ gender, setGender }: { gender: Gender; setGender: (g: Gender) => void }) {
    return (
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {(["male", "female"] as Gender[]).map(g => (
                <button key={g} onClick={() => setGender(g)} style={{
                    flex: 1, padding: "10px 6px", borderRadius: 8, cursor: "pointer",
                    border: gender === g ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: gender === g ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: gender === g ? 800 : 500, fontSize: "0.9rem",
                    color: gender === g ? "var(--n-primary)" : "var(--n-text)",
                }}>{g === "male" ? "♂ Male" : "♀ Female"}</button>
            ))}
        </div>
    );
}

function ResultDisplay({ bf, weightKg, gender }: { bf: number; weightKg: number; gender: Gender }) {
    const cat = getCategory(bf, gender);
    const fatMass = weightKg * (bf / 100);
    const leanMass = weightKg - fatMass;
    const barPct = getCategoryBarPct(bf, gender);

    return (
        <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 1 }}>
                    Body Fat Percentage — {cat.label}
                </div>
                <div style={{ fontSize: "2.6rem", fontWeight: 800, fontFamily: "var(--t-mono)", color: cat.color }}>
                    {bf.toFixed(1)}%
                </div>
            </div>
            <div style={{ position: "relative", height: 28, borderRadius: 8, overflow: "hidden", marginBottom: 12,
                background: "linear-gradient(to right, #ef4444 0%, #3b82f6 20%, #16a34a 40%, #f59e0b 60%, #dc2626 85%, #7f1d1d 100%)" }}>
                <div style={{ position: "absolute", left: `${barPct}%`, top: 0, width: 3, height: "100%", background: "var(--n-text)", transform: "translateX(-50%)" }} />
                <div style={{ position: "absolute", left: `${barPct}%`, top: -2, transform: "translateX(-50%)", fontSize: "0.7rem", fontWeight: 800, color: "var(--n-text)", background: "var(--n-surface)", padding: "1px 6px", borderRadius: 4 }}>
                    {bf.toFixed(1)}%
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                    ["Fat Mass", `${fatMass.toFixed(1)} kg`, "#dc2626"],
                    ["Lean Mass", `${leanMass.toFixed(1)} kg`, "#16a34a"],
                    ["Category", cat.label, cat.color],
                ].map(([l, v, c], i) => (
                    <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: c as string }}>{v}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NavyMode() {
    const [gender, setGender] = useState<Gender>("male");
    const [age, setAge] = useState(30);
    const [heightCm, setHeightCm] = useState(175);
    const [weightKg, setWeightKg] = useState(80);
    const [neckCm, setNeckCm] = useState(38);
    const [waistCm, setWaistCm] = useState(90);
    const [hipCm, setHipCm] = useState(100);

    const bf = useMemo(() => navyBF(gender, heightCm, neckCm, waistCm, hipCm), [gender, heightCm, neckCm, waistCm, hipCm]);

    const inputs: [string, number, (v: number) => void, string][] = [
        ["Age", age, setAge, "years"],
        ["Height", heightCm, setHeightCm, "cm"],
        ["Weight", weightKg, setWeightKg, "kg"],
        ["Neck Circumference", neckCm, setNeckCm, "cm"],
        ["Waist Circumference", waistCm, setWaistCm, "cm"],
    ];
    if (gender === "female") inputs.push(["Hip Circumference", hipCm, setHipCm, "cm"]);

    return (
        <>
            <GenderToggle gender={gender} setGender={setGender} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {inputs.map(([label, val, setter, unit]) => (
                    <div key={label}>
                        <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 3, color: "var(--n-text)" }}>{label} ({unit})</label>
                        <input type="number" value={val} onChange={e => setter(Number(e.target.value) || 0)}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.9rem", background: "var(--n-surface-input)", color: "var(--n-text)" }} />
                    </div>
                ))}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: 12 }}>
                📏 <strong>Measurement guide:</strong> Neck — measure below the Adam&apos;s apple. Waist — at navel level for men, narrowest point for women. Hip — at widest point of buttocks (women only).
            </div>
            {bf !== null && bf > 0 && bf < 60 && <ResultDisplay bf={bf} weightKg={weightKg} gender={gender} />}
            {(bf === null || bf <= 0 || bf >= 60) && (
                <div style={{ background: "var(--n-gold-light)", padding: 12, borderRadius: 10, fontSize: "0.82rem", color: "var(--n-gold-text)" }}>
                    Please enter valid measurements. Ensure waist is larger than neck circumference.
                </div>
            )}
        </>
    );
}

function BmiMode() {
    const [gender, setGender] = useState<Gender>("male");
    const [age, setAge] = useState(30);
    const [heightCm, setHeightCm] = useState(175);
    const [weightKg, setWeightKg] = useState(80);

    const result = useMemo(() => {
        const hm = heightCm / 100;
        if (hm <= 0 || weightKg <= 0) return null;
        const bmi = weightKg / (hm * hm);
        const bf = bmiBF(bmi, age, gender);
        return { bmi, bf: Math.max(3, bf) };
    }, [gender, age, heightCm, weightKg]);

    return (
        <>
            <GenderToggle gender={gender} setGender={setGender} />
            <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 10 }}>
                Simpler method — no tape measure needed. Uses the Deurenberg formula based on BMI, age, and gender.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {([["Age", age, setAge, "years"], ["Height", heightCm, setHeightCm, "cm"], ["Weight", weightKg, setWeightKg, "kg"]] as [string, number, (v: number) => void, string][]).map(([label, val, setter, unit]) => (
                    <div key={label}>
                        <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 3, color: "var(--n-text)" }}>{label} ({unit})</label>
                        <input type="number" value={val} onChange={e => setter(Number(e.target.value) || 0)}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.9rem", background: "var(--n-surface-input)", color: "var(--n-text)" }} />
                    </div>
                ))}
            </div>
            {result && result.bf > 0 && result.bf < 60 && (
                <>
                    <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: "0.82rem", border: "1px solid var(--n-border)" }}>
                        <strong style={{ color: "var(--n-primary)" }}>Your BMI: {result.bmi.toFixed(1)}</strong>
                        <span style={{ color: "var(--n-text-muted)" }}> — used to estimate body fat below</span>
                    </div>
                    <ResultDisplay bf={result.bf} weightKg={weightKg} gender={gender} />
                    <div style={{ background: "var(--n-gold-light)", borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: "0.78rem", color: "var(--n-gold-text)", border: "1px solid var(--n-border)" }}>
                        ⚠️ BMI-based estimates are less accurate than circumference methods. For better results, use the US Navy Method tab.
                    </div>
                </>
            )}
        </>
    );
}

function CategoryMode() {
    const [gender, setGender] = useState<Gender>("male");

    const MALE_TABLE = [
        ["20–29", "3–5%", "6–13%", "14–17%", "18–24%", "≥25%"],
        ["30–39", "3–5%", "6–14%", "15–18%", "19–25%", "≥26%"],
        ["40–49", "3–5%", "6–16%", "17–20%", "21–27%", "≥28%"],
        ["50–59", "3–5%", "6–17%", "18–21%", "22–28%", "≥29%"],
        ["60+", "3–5%", "6–18%", "19–22%", "23–29%", "≥30%"],
    ];
    const FEMALE_TABLE = [
        ["20–29", "10–13%", "14–20%", "21–24%", "25–31%", "≥32%"],
        ["30–39", "10–13%", "14–21%", "22–25%", "26–32%", "≥33%"],
        ["40–49", "10–13%", "14–23%", "24–27%", "28–34%", "≥35%"],
        ["50–59", "10–13%", "14–24%", "25–28%", "29–35%", "≥36%"],
        ["60+", "10–13%", "14–25%", "26–29%", "30–36%", "≥37%"],
    ];
    const table = gender === "male" ? MALE_TABLE : FEMALE_TABLE;

    return (
        <>
            <GenderToggle gender={gender} setGender={setGender} />
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 8, color: "var(--n-text)" }}>Body Fat % Ranges by Age — {gender === "male" ? "Men" : "Women"}</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px", color: "var(--n-text)" }}>Age</th>
                        <th style={{ padding: "6px 4px", background: "var(--n-danger-light)", color: "var(--n-danger)" }}>Essential</th>
                        <th style={{ padding: "6px 4px", background: "var(--n-primary-light)", color: "var(--n-primary)" }}>Athletes</th>
                        <th style={{ padding: "6px 4px", background: "var(--n-success-light)", color: "var(--n-success)" }}>Fitness</th>
                        <th style={{ padding: "6px 4px", background: "var(--n-gold-light)", color: "var(--n-gold-text)" }}>Average</th>
                        <th style={{ padding: "6px 4px", background: "var(--n-danger-light)", color: "var(--n-danger)" }}>Obese</th>
                    </tr></thead>
                    <tbody>
                        {table.map((row, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "6px 4px", fontWeight: 700, color: "var(--n-text)" }}>{row[0]}</td>
                                {row.slice(1).map((v, j) => (
                                    <td key={j} style={{ padding: "6px 4px", textAlign: "center", color: "var(--n-text-secondary)" }}>{v}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: "0.78rem", border: "1px solid var(--n-border)" }}>
                <strong style={{ color: "var(--n-primary)" }}>🇮🇳 India Note:</strong>{" "}
                <span style={{ color: "var(--n-text-secondary)" }}>Indians tend to carry higher visceral fat at lower BMI/BF% due to the &quot;thin-fat phenotype.&quot; ICMR and Asian guidelines use lower thresholds — a BMI of 23 (not 25) is considered overweight for South Asians. Body fat risk may start 2–3% lower than Western standards.</span>
            </div>
        </>
    );
}

function LbmMode() {
    const [weightKg, setWeightKg] = useState(80);
    const [currentBf, setCurrentBf] = useState(22);
    const [targetBf, setTargetBf] = useState(15);

    const result = useMemo(() => {
        const fatMass = weightKg * (currentBf / 100);
        const leanMass = weightKg - fatMass;
        const targetWeight = leanMass / (1 - targetBf / 100);
        const fatToLose = weightKg - targetWeight;
        return { fatMass, leanMass, targetWeight, fatToLose };
    }, [weightKg, currentBf, targetBf]);

    return (
        <>
            <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: 10 }}>
                Enter your weight and body fat % (from US Navy or BMI method) to see your fat/lean split and target weight.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                    <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 3, color: "var(--n-text)" }}>Weight (kg)</label>
                    <input type="number" value={weightKg} onChange={e => setWeightKg(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.9rem", background: "var(--n-surface-input)", color: "var(--n-text)" }} />
                </div>
                <div>
                    <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 3, color: "var(--n-text)" }}>Current BF%</label>
                    <input type="number" value={currentBf} onChange={e => setCurrentBf(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.9rem", background: "var(--n-surface-input)", color: "var(--n-text)" }} />
                </div>
                <div>
                    <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 3, color: "var(--n-text)" }}>Target BF%</label>
                    <input type="number" value={targetBf} onChange={e => setTargetBf(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.9rem", background: "var(--n-surface-input)", color: "var(--n-text)" }} />
                </div>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[
                        ["Current Fat Mass", `${result.fatMass.toFixed(1)} kg`, "#dc2626"],
                        ["Lean Body Mass", `${result.leanMass.toFixed(1)} kg`, "#16a34a"],
                    ].map(([l, v, c], i) => (
                        <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: c as string }}>{v}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", height: 30, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ width: `${100 - currentBf}%`, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>
                        Lean {(100 - currentBf).toFixed(0)}%
                    </div>
                    <div style={{ width: `${currentBf}%`, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>
                        Fat {currentBf}%
                    </div>
                </div>
                <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        Target: {targetBf}% Body Fat
                    </div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--t-mono)", margin: "6px 0", color: "var(--n-text)" }}>
                        {result.targetWeight.toFixed(1)} kg
                    </div>
                    <div style={{ fontSize: "0.82rem", color: result.fatToLose > 0 ? "#dc2626" : "#16a34a" }}>
                        {result.fatToLose > 0
                            ? `Need to lose ${result.fatToLose.toFixed(1)} kg of fat (keeping lean mass constant)`
                            : `You're already below target — maintain current composition`}
                    </div>
                </div>
            </div>
        </>
    );
}

export default function BodyFatCalculatorCore() {
    const [mode, setMode] = useState<Mode>("navy");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--n-border)", background: "var(--n-primary-light)" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--n-text)" }}>📏 Body Fat Calculator — US Navy &amp; BMI Methods</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Estimate body fat %, lean mass &amp; fat mass • India-adapted categories • Target weight planner</div>
            </div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--n-border)", flexWrap: "wrap" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        flex: 1, minWidth: 110, padding: "12px 6px", border: "none", cursor: "pointer",
                        borderBottom: mode === m.key ? "3px solid var(--n-primary)" : "3px solid transparent",
                        background: mode === m.key ? "var(--n-primary-light)" : "transparent",
                        fontWeight: mode === m.key ? 700 : 500, fontSize: "0.78rem",
                        color: mode === m.key ? "var(--n-primary)" : "var(--n-text-muted)",
                    }}>{m.icon} {m.label}</button>
                ))}
            </div>
            <div style={{ padding: 20 }}>
                {mode === "navy" && <NavyMode />}
                {mode === "bmi" && <BmiMode />}
                {mode === "categories" && <CategoryMode />}
                {mode === "lbm" && <LbmMode />}
            </div>
        </div>
    );
}
