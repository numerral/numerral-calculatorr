"use client";
import { useState } from "react";

// ─── Dog Age Calculator ───
function DogAgeCalc() {
    const [dogAge, setDogAge] = useState(5);
    const [size, setSize] = useState<"small" | "medium" | "large" | "giant">("medium");

    // AVMA + size-adjusted aging
    const getHumanAge = (age: number, s: string): number => {
        if (age <= 0) return 0;
        // Year 1 and 2 vary by size
        const firstYear = s === "small" ? 15 : s === "medium" ? 15 : s === "large" ? 14 : 12;
        const secondYear = s === "small" ? 9 : s === "medium" ? 9 : s === "large" ? 8 : 7;
        const perYear = s === "small" ? 4 : s === "medium" ? 5 : s === "large" ? 5 : 7;

        if (age <= 1) return Math.round(age * firstYear);
        if (age <= 2) return firstYear + Math.round((age - 1) * secondYear);
        return firstYear + secondYear + Math.round((age - 2) * perYear);
    };

    const humanAge = getHumanAge(dogAge, size);
    const lifeStage = humanAge < 15 ? "Puppy" : humanAge < 30 ? "Young Adult" : humanAge < 55 ? "Adult" : humanAge < 75 ? "Senior" : "Geriatric";

    const ageChart = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🐕 DOG&apos;S AGE (years)</label>
                <input type="range" className="calc-field__slider" min={0.5} max={20} step={0.5}
                    value={dogAge} onChange={(e) => setDogAge(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={dogAge}
                        onChange={(e) => setDogAge(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">years</span>
                </div>
            </div>

            <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
                <label className="calc-field__label">DOG SIZE</label>
                <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                    {(["small", "medium", "large", "giant"] as const).map((s) => (
                        <button key={s} onClick={() => setSize(s)}
                            style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: size === s ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: size === s ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: size === s ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>
                            {s === "small" ? "🐕 Small (<20 lbs)" : s === "medium" ? "🐕 Medium (20–50 lbs)" : s === "large" ? "🐕 Large (50–100 lbs)" : "🐕 Giant (100+ lbs)"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">EQUIVALENT HUMAN AGE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-2)" }}>
                    {humanAge} human years
                </p>
                <p style={{ fontSize: "var(--t-body)", fontWeight: 600 }}>
                    Life Stage: <span style={{ color: "var(--n-primary)" }}>{lifeStage}</span>
                </p>
            </div>

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Dog Years to Human Years — Age Chart</h3>
                <table className="calc-table">
                    <thead><tr><th>Dog Age</th><th>Small</th><th>Medium</th><th>Large</th><th>Giant</th></tr></thead>
                    <tbody>
                        {ageChart.map((a) => (
                            <tr key={a} style={a === dogAge ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{a} yr{a !== 1 ? "s" : ""}</td>
                                <td>{getHumanAge(a, "small")}</td>
                                <td>{getHumanAge(a, "medium")}</td>
                                <td>{getHumanAge(a, "large")}</td>
                                <td>{getHumanAge(a, "giant")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Cat Age Calculator ───
function CatAgeCalc() {
    const [catAge, setCatAge] = useState(5);

    // AAHA/AAFP guidelines
    const getHumanAge = (age: number): number => {
        if (age <= 0) return 0;
        if (age <= 1) return Math.round(age * 15);
        if (age <= 2) return 15 + Math.round((age - 1) * 9);
        return 24 + Math.round((age - 2) * 4);
    };

    const humanAge = getHumanAge(catAge);
    const lifeStage = catAge <= 0.5 ? "Kitten" : catAge <= 2 ? "Junior" : catAge <= 6 ? "Prime" : catAge <= 10 ? "Mature" : catAge <= 14 ? "Senior" : "Geriatric";

    const ageChart = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🐱 CAT&apos;S AGE (years)</label>
                <input type="range" className="calc-field__slider" min={0.5} max={25} step={0.5}
                    value={catAge} onChange={(e) => setCatAge(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={catAge}
                        onChange={(e) => setCatAge(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">years</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">EQUIVALENT HUMAN AGE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-2)" }}>
                    {humanAge} human years
                </p>
                <p style={{ fontSize: "var(--t-body)", fontWeight: 600 }}>
                    Life Stage: <span style={{ color: "var(--n-primary)" }}>{lifeStage}</span>
                </p>
            </div>

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Cat Years to Human Years — Age Chart</h3>
                <table className="calc-table">
                    <thead><tr><th>Cat Age</th><th>Human Age</th><th>Life Stage</th></tr></thead>
                    <tbody>
                        {ageChart.map((a) => {
                            const h = getHumanAge(a);
                            const stage = a <= 0.5 ? "Kitten" : a <= 2 ? "Junior" : a <= 6 ? "Prime" : a <= 10 ? "Mature" : a <= 14 ? "Senior" : "Geriatric";
                            return (
                                <tr key={a} style={a === catAge ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{a} yr{a !== 1 ? "s" : ""}</td>
                                    <td>{h} human years</td>
                                    <td>{stage}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Dog Chocolate Toxicity Calculator ───
function DogChocolateCalc() {
    const [weightLbs, setWeightLbs] = useState(30);
    const [chocoType, setChocoType] = useState("milk");
    const [amountOz, setAmountOz] = useState(2);

    // Methylxanthine content per oz (theobromine + caffeine combined, mg/oz)
    const chocoData: Record<string, { label: string; mgPerOz: number }> = {
        white: { label: "White Chocolate", mgPerOz: 0.25 },
        milk: { label: "Milk Chocolate", mgPerOz: 64 },
        dark: { label: "Dark Chocolate (60–69%)", mgPerOz: 228 },
        semisweet: { label: "Semi-Sweet/Bittersweet", mgPerOz: 274 },
        baking: { label: "Baker's Chocolate (unsweetened)", mgPerOz: 450 },
        cocoa: { label: "Dry Cocoa Powder", mgPerOz: 737 },
    };

    const weightKg = weightLbs * 0.453592;
    const totalMg = amountOz * chocoData[chocoType].mgPerOz;
    const dosePerKg = weightKg > 0 ? totalMg / weightKg : 0;

    let riskLevel = "None";
    let riskColor = "var(--n-success)";
    let riskDesc = "No expected symptoms.";
    if (dosePerKg >= 60) { riskLevel = "SEVERE / POTENTIALLY LETHAL"; riskColor = "#dc2626"; riskDesc = "Seizures, cardiac arrhythmia, internal bleeding. CALL YOUR VET AND ASPCA IMMEDIATELY."; }
    else if (dosePerKg >= 40) { riskLevel = "SEVERE"; riskColor = "#dc2626"; riskDesc = "Muscle tremors, seizures, racing heart. SEEK EMERGENCY VET CARE."; }
    else if (dosePerKg >= 20) { riskLevel = "MODERATE"; riskColor = "#f59e0b"; riskDesc = "Vomiting, diarrhea, restlessness, increased urination. Contact your vet."; }
    else if (dosePerKg >= 10) { riskLevel = "MILD"; riskColor = "#f59e0b"; riskDesc = "Possible mild vomiting or diarrhea. Monitor closely."; }

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🐕 DOG&apos;S WEIGHT</label>
                <input type="range" className="calc-field__slider" min={1} max={150} step={1}
                    value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={weightLbs}
                        onChange={(e) => setWeightLbs(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">lbs</span>
                </div>
            </div>

            <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
                <label className="calc-field__label">🍫 TYPE OF CHOCOLATE</label>
                <select className="calc-field__input" value={chocoType} onChange={(e) => setChocoType(e.target.value)}
                    style={{ width: "100%", padding: "var(--s-2)" }}>
                    {Object.entries(chocoData).map(([key, val]) => (
                        <option key={key} value={key}>{val.label} ({val.mgPerOz} mg/oz)</option>
                    ))}
                </select>
            </div>

            <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
                <label className="calc-field__label">AMOUNT EATEN</label>
                <input type="range" className="calc-field__slider" min={0.5} max={32} step={0.5}
                    value={amountOz} onChange={(e) => setAmountOz(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={amountOz}
                        onChange={(e) => setAmountOz(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">oz</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)", borderLeft: `4px solid ${riskColor}` }}>
                <p className="calc-field__label">TOXICITY RISK LEVEL</p>
                <p style={{ fontSize: "var(--t-h2)", fontWeight: 700, color: riskColor, marginBottom: "var(--s-1)" }}>
                    {riskLevel}
                </p>
                <p style={{ marginBottom: "var(--s-3)" }}>{riskDesc}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">METHYLXANTHINE DOSE</p><p style={{ fontWeight: 700 }}>{dosePerKg.toFixed(1)} mg/kg</p></div>
                    <div><p className="calc-field__label">TOTAL METHYLXANTHINE</p><p style={{ fontWeight: 700 }}>{totalMg.toFixed(0)} mg</p></div>
                    <div><p className="calc-field__label">DOG WEIGHT</p><p style={{ fontWeight: 700 }}>{weightKg.toFixed(1)} kg ({weightLbs} lbs)</p></div>
                </div>
            </div>

            <div style={{ marginTop: "var(--s-4)", padding: "var(--s-3)", background: "#fef2f2", borderRadius: "var(--r-md)", border: "1px solid #fca5a5" }}>
                <p style={{ fontWeight: 700, color: "#dc2626" }}>⚠️ Emergency Contact</p>
                <p>ASPCA Animal Poison Control: <strong>(888) 426-4435</strong> (24/7, fee may apply)</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>
                    This calculator is not a substitute for professional veterinary advice. When in doubt, always call your vet.
                </p>
            </div>
        </div>
    );
}

// ─── Dog Calorie Calculator ───
function DogCalorieCalc() {
    const [weightLbs, setWeightLbs] = useState(30);
    const [lifeStage, setLifeStage] = useState("neutered");

    const weightKg = weightLbs * 0.453592;
    const rer = 70 * Math.pow(weightKg, 0.75);

    const multipliers: Record<string, { label: string; factor: number; desc: string }> = {
        puppy4m: { label: "Puppy (< 4 months)", factor: 3.0, desc: "Rapid growth phase — highest calorie need" },
        puppy12m: { label: "Puppy (4–12 months)", factor: 2.0, desc: "Steady growth — still higher than adults" },
        neutered: { label: "Neutered Adult", factor: 1.6, desc: "Typical spayed/neutered adult dog" },
        intact: { label: "Intact Adult", factor: 1.8, desc: "Unaltered adult dog" },
        active: { label: "Active / Working Dog", factor: 2.5, desc: "High physical activity or working breed" },
        weightLoss: { label: "Weight Loss", factor: 1.0, desc: "Overweight dog needing to lose weight" },
        senior: { label: "Senior (7+ years)", factor: 1.4, desc: "Reduced activity in older dogs" },
        pregnant: { label: "Pregnant / Nursing", factor: 3.0, desc: "Increased needs during pregnancy and lactation" },
    };

    const der = rer * multipliers[lifeStage].factor;
    const cupsPerDay = der / 400; // ~400 kcal per cup of typical dry dog food

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🐕 DOG&apos;S WEIGHT</label>
                <input type="range" className="calc-field__slider" min={2} max={200} step={1}
                    value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={weightLbs}
                        onChange={(e) => setWeightLbs(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">lbs</span>
                </div>
            </div>

            <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
                <label className="calc-field__label">LIFE STAGE / ACTIVITY</label>
                <select className="calc-field__input" value={lifeStage} onChange={(e) => setLifeStage(e.target.value)}
                    style={{ width: "100%", padding: "var(--s-2)" }}>
                    {Object.entries(multipliers).map(([key, val]) => (
                        <option key={key} value={key}>{val.label} (×{val.factor})</option>
                    ))}
                </select>
                <p className="t-body-sm text-muted" style={{ marginTop: "var(--s-1)" }}>{multipliers[lifeStage].desc}</p>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">DAILY CALORIE NEEDS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {Math.round(der)} kcal / day
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">RER (RESTING)</p><p style={{ fontWeight: 700 }}>{Math.round(rer)} kcal</p></div>
                    <div><p className="calc-field__label">DER MULTIPLIER</p><p style={{ fontWeight: 700 }}>×{multipliers[lifeStage].factor}</p></div>
                    <div><p className="calc-field__label">≈ DRY FOOD</p><p style={{ fontWeight: 700 }}>{cupsPerDay.toFixed(1)} cups/day</p></div>
                </div>
            </div>

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Daily Calorie Guide by Weight</h3>
                <table className="calc-table">
                    <thead><tr><th>Weight</th><th>RER</th><th>Neutered Adult</th><th>Active Dog</th><th>Puppy</th></tr></thead>
                    <tbody>
                        {[10, 20, 30, 40, 50, 60, 70, 80, 100, 120].map((w) => {
                            const kg = w * 0.453592;
                            const r = 70 * Math.pow(kg, 0.75);
                            return (
                                <tr key={w} style={w === weightLbs ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{w} lbs</td>
                                    <td>{Math.round(r)}</td>
                                    <td>{Math.round(r * 1.6)}</td>
                                    <td>{Math.round(r * 2.5)}</td>
                                    <td>{Math.round(r * 2.0)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Dog Water Intake Calculator ───
function DogWaterCalc() {
    const [weightLbs, setWeightLbs] = useState(30);
    const [activity, setActivity] = useState("normal");
    const [weather, setWeather] = useState("temperate");

    // Base: approximately 1 oz per lb of body weight
    const baseOz = weightLbs;
    const activityMult = activity === "low" ? 0.8 : activity === "normal" ? 1.0 : activity === "high" ? 1.5 : 2.0;
    const weatherMult = weather === "cold" ? 0.85 : weather === "temperate" ? 1.0 : weather === "hot" ? 1.25 : 1.5;
    const totalOz = baseOz * activityMult * weatherMult;
    const cups = totalOz / 8;
    const liters = totalOz * 0.0295735;

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🐕 DOG&apos;S WEIGHT</label>
                <input type="range" className="calc-field__slider" min={2} max={200} step={1}
                    value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={weightLbs}
                        onChange={(e) => setWeightLbs(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">lbs</span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                <div className="calc-field">
                    <label className="calc-field__label">ACTIVITY LEVEL</label>
                    <select className="calc-field__input" value={activity} onChange={(e) => setActivity(e.target.value)}
                        style={{ width: "100%", padding: "var(--s-2)" }}>
                        <option value="low">Low (senior / sedentary)</option>
                        <option value="normal">Normal (daily walks)</option>
                        <option value="high">High (running / hiking)</option>
                        <option value="extreme">Extreme (working dog)</option>
                    </select>
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">WEATHER / CLIMATE</label>
                    <select className="calc-field__input" value={weather} onChange={(e) => setWeather(e.target.value)}
                        style={{ width: "100%", padding: "var(--s-2)" }}>
                        <option value="cold">Cold (below 40°F)</option>
                        <option value="temperate">Temperate (40–80°F)</option>
                        <option value="hot">Hot (80–95°F)</option>
                        <option value="extreme">Extreme Heat (95°F+)</option>
                    </select>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">RECOMMENDED DAILY WATER INTAKE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {totalOz.toFixed(0)} fl oz / day
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">IN CUPS</p><p style={{ fontWeight: 700 }}>{cups.toFixed(1)} cups</p></div>
                    <div><p className="calc-field__label">IN LITERS</p><p style={{ fontWeight: 700 }}>{liters.toFixed(2)} L</p></div>
                    <div><p className="calc-field__label">BASE RULE</p><p style={{ fontWeight: 700 }}>1 oz / lb</p></div>
                </div>
            </div>

            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Daily Water Guide by Weight</h3>
                <table className="calc-table">
                    <thead><tr><th>Weight</th><th>Base (oz)</th><th>Cups</th><th>Active + Hot</th></tr></thead>
                    <tbody>
                        {[10, 20, 30, 40, 50, 60, 70, 80, 100, 120].map((w) => (
                            <tr key={w} style={w === weightLbs ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{w} lbs</td>
                                <td>{w} oz</td>
                                <td>{(w / 8).toFixed(1)} cups</td>
                                <td>{Math.round(w * 1.5 * 1.25)} oz</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Component Map ───
const CALC_MAP: Record<string, () => React.JSX.Element> = {
    "dog-age": DogAgeCalc,
    "cat-age": CatAgeCalc,
    "dog-chocolate": DogChocolateCalc,
    "dog-calorie": DogCalorieCalc,
    "dog-water": DogWaterCalc,
};

export default function PetCalculatorCore({ calcType }: { calcType: string }) {
    const Comp = CALC_MAP[calcType];
    if (!Comp) return <p>Calculator not found.</p>;
    return <Comp />;
}
