"use client";
import { useState } from "react";

// ─── Shared substance densities ───
const SUBSTANCES: { label: string; density: number }[] = [
    { label: "Water", density: 1.0 },
    { label: "Whole Milk", density: 1.03 },
    { label: "All-Purpose Flour", density: 0.53 },
    { label: "Granulated Sugar", density: 0.85 },
    { label: "Powdered Sugar", density: 0.56 },
    { label: "Brown Sugar (packed)", density: 0.93 },
    { label: "Honey", density: 1.42 },
    { label: "Olive Oil", density: 0.92 },
    { label: "Vegetable Oil", density: 0.92 },
    { label: "Coconut Oil (melted)", density: 0.92 },
    { label: "Butter (melted)", density: 0.91 },
    { label: "Table Salt", density: 1.22 },
    { label: "Cocoa Powder", density: 0.52 },
    { label: "Rice (uncooked)", density: 0.85 },
    { label: "Rolled Oats", density: 0.36 },
    { label: "Baking Powder", density: 0.90 },
    { label: "Heavy Cream", density: 1.01 },
    { label: "Maple Syrup", density: 1.33 },
    { label: "Soy Sauce", density: 1.08 },
    { label: "Vanilla Extract", density: 1.04 },
    { label: "Custom", density: 1.0 },
];

// ─── mL to Grams ───
function MlToGramCalc() {
    const [ml, setMl] = useState(100);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    const grams = ml * density;
    const ounces = grams / 28.3495;

    const quickRef = [1, 5, 10, 15, 30, 50, 100, 150, 200, 250, 500, 1000];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🧪 VOLUME (MILLILITERS)</label>
                <input type="range" className="calc-field__slider" min={1} max={1000} step={1}
                    value={ml} onChange={(e) => setMl(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={ml}
                        onChange={(e) => setMl(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">mL</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🥄 SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN GRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {grams.toLocaleString("en-US", { maximumFractionDigits: 2 })} g
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">OUNCES</p><p style={{ fontWeight: 700 }}>{ounces.toFixed(3)} oz</p></div>
                    <div><p className="calc-field__label">DENSITY</p><p style={{ fontWeight: 700 }}>{density} g/mL</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{ml} × {density}</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>mL</th><th>Grams</th><th>Ounces</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((v) => (
                            <tr key={v} style={v === ml ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{v} mL</td>
                                <td>{(v * density).toFixed(2)} g</td>
                                <td>{(v * density / 28.3495).toFixed(3)} oz</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Grams to mL ───
function GramToMlCalc() {
    const [grams, setGrams] = useState(100);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    const ml = grams / density;
    const flOz = ml / 29.5735;
    const cups = ml / 236.588;

    const quickRef = [1, 5, 10, 25, 50, 100, 150, 200, 250, 500, 750, 1000];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⚖️ WEIGHT (GRAMS)</label>
                <input type="range" className="calc-field__slider" min={1} max={1000} step={1}
                    value={grams} onChange={(e) => setGrams(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={grams}
                        onChange={(e) => setGrams(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">g</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🥄 SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">VOLUME IN MILLILITERS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {ml.toLocaleString("en-US", { maximumFractionDigits: 2 })} mL
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">FLUID OUNCES</p><p style={{ fontWeight: 700 }}>{flOz.toFixed(3)} fl oz</p></div>
                    <div><p className="calc-field__label">US CUPS</p><p style={{ fontWeight: 700 }}>{cups.toFixed(3)} cups</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{grams} ÷ {density}</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Grams</th><th>Milliliters</th><th>US Cups</th><th>Fl Oz</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((g) => {
                            const v = g / density;
                            return (
                                <tr key={g} style={g === grams ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{g} g</td>
                                    <td>{v.toFixed(2)} mL</td>
                                    <td>{(v / 236.588).toFixed(3)}</td>
                                    <td>{(v / 29.5735).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Liters to Kilograms ───
function LiterToKgCalc() {
    const [liters, setLiters] = useState(1);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // density in g/mL = density in kg/L (numerically identical)
    const kg = liters * density;
    const lbs = kg * 2.20462;
    const gallons = liters * 0.264172;

    const quickRef = [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 10, 20, 50, 100];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🧪 VOLUME (LITERS)</label>
                <input type="range" className="calc-field__slider" min={0.1} max={100} step={0.1}
                    value={liters} onChange={(e) => setLiters(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={liters}
                        onChange={(e) => setLiters(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">L</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🥄 SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} kg/L)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (kg/L)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN KILOGRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {kg.toLocaleString("en-US", { maximumFractionDigits: 3 })} kg
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">POUNDS</p><p style={{ fontWeight: 700 }}>{lbs.toFixed(3)} lbs</p></div>
                    <div><p className="calc-field__label">US GALLONS</p><p style={{ fontWeight: 700 }}>{gallons.toFixed(3)} gal</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{liters} × {density}</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Liters</th><th>Kilograms</th><th>Pounds</th><th>US Gallons</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((v) => (
                            <tr key={v} style={v === liters ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{v} L</td>
                                <td>{(v * density).toFixed(3)} kg</td>
                                <td>{(v * density * 2.20462).toFixed(3)} lbs</td>
                                <td>{(v * 0.264172).toFixed(3)} gal</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Grams to Cups ───
function GramToCupCalc() {
    const [grams, setGrams] = useState(100);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // cups = grams / (density_g_per_mL × 236.588 mL_per_cup)
    const ml = grams / density;
    const cups = ml / 236.588;
    const tbsp = ml / 14.787;
    const tsp = ml / 4.929;

    const quickRef = [25, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 1000];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⚖️ WEIGHT (GRAMS)</label>
                <input type="range" className="calc-field__slider" min={1} max={1000} step={1}
                    value={grams} onChange={(e) => setGrams(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={grams}
                        onChange={(e) => setGrams(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">g</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🥄 INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">VOLUME IN US CUPS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {cups.toFixed(3)} cups
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">TABLESPOONS</p><p style={{ fontWeight: 700 }}>{tbsp.toFixed(2)} tbsp</p></div>
                    <div><p className="calc-field__label">TEASPOONS</p><p style={{ fontWeight: 700 }}>{tsp.toFixed(2)} tsp</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{grams} ÷ ({density} × 236.59)</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Grams</th><th>US Cups</th><th>Tablespoons</th><th>Teaspoons</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((g) => {
                            const v = g / density;
                            return (
                                <tr key={g} style={g === grams ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{g} g</td>
                                    <td>{(v / 236.588).toFixed(3)}</td>
                                    <td>{(v / 14.787).toFixed(1)}</td>
                                    <td>{(v / 4.929).toFixed(1)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Inches to Centimeters ───
function InchToCmCalc() {
    const [inches, setInches] = useState(12);
    const [fraction, setFraction] = useState(0); // fractional inch (0, 1/16, 1/8, ... 15/16)

    const totalInches = inches + fraction;
    const cm = totalInches * 2.54;
    const mm = cm * 10;
    const meters = cm / 100;
    const feet = totalInches / 12;
    const yards = totalInches / 36;

    const fractions = [
        { label: "0", value: 0 },
        { label: "1/16", value: 1/16 },
        { label: "1/8", value: 1/8 },
        { label: "3/16", value: 3/16 },
        { label: "1/4", value: 1/4 },
        { label: "5/16", value: 5/16 },
        { label: "3/8", value: 3/8 },
        { label: "7/16", value: 7/16 },
        { label: "1/2", value: 1/2 },
        { label: "9/16", value: 9/16 },
        { label: "5/8", value: 5/8 },
        { label: "11/16", value: 11/16 },
        { label: "3/4", value: 3/4 },
        { label: "13/16", value: 13/16 },
        { label: "7/8", value: 7/8 },
        { label: "15/16", value: 15/16 },
    ];

    const quickRef = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 18, 24, 36, 48, 60, 72, 84, 96, 100];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">📏 INCHES (WHOLE NUMBER)</label>
                <input type="range" className="calc-field__slider" min={0} max={120} step={1}
                    value={inches} onChange={(e) => setInches(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={inches}
                        onChange={(e) => setInches(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">in</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📐 FRACTIONAL INCH</label>
                <select className="calc-field__input" value={fraction}
                    onChange={(e) => setFraction(Number(e.target.value))}>
                    {fractions.map((f) => (
                        <option key={f.label} value={f.value}>{f.label} in</option>
                    ))}
                </select>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">LENGTH IN CENTIMETERS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {cm.toLocaleString("en-US", { maximumFractionDigits: 4 })} cm
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">MILLIMETERS</p><p style={{ fontWeight: 700 }}>{mm.toFixed(2)} mm</p></div>
                    <div><p className="calc-field__label">METERS</p><p style={{ fontWeight: 700 }}>{meters.toFixed(4)} m</p></div>
                    <div><p className="calc-field__label">FEET</p><p style={{ fontWeight: 700 }}>{feet.toFixed(4)} ft</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{totalInches} × 2.54</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Inches to Centimeters — Reference Table</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Inches</th><th>Centimeters</th><th>Millimeters</th><th>Feet</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((v) => (
                            <tr key={v} style={v === totalInches ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{v}″</td>
                                <td>{(v * 2.54).toFixed(2)} cm</td>
                                <td>{(v * 25.4).toFixed(1)} mm</td>
                                <td>{(v / 12).toFixed(3)} ft</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Stones & Pounds to Kilograms ───
function StonesToKgCalc() {
    const [stone, setStone] = useState(10);
    const [lbs, setLbs] = useState(0);

    const totalLbs = stone * 14 + lbs;
    const kg = totalLbs * 0.453592;
    const grams = kg * 1000;
    const poundsOnly = totalLbs;

    const quickRef = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🪨 STONES</label>
                <input type="range" className="calc-field__slider" min={0} max={50} step={1}
                    value={stone} onChange={(e) => setStone(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={stone}
                        onChange={(e) => setStone(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">st</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">⚖️ ADDITIONAL POUNDS</label>
                <input type="range" className="calc-field__slider" min={0} max={13} step={1}
                    value={lbs} onChange={(e) => setLbs(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={lbs}
                        onChange={(e) => setLbs(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">lbs (0–13)</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN KILOGRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {kg.toLocaleString("en-US", { maximumFractionDigits: 2 })} kg
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">GRAMS</p><p style={{ fontWeight: 700 }}>{grams.toFixed(0)} g</p></div>
                    <div><p className="calc-field__label">TOTAL POUNDS</p><p style={{ fontWeight: 700 }}>{poundsOnly} lbs</p></div>
                    <div><p className="calc-field__label">STONE + LBS</p><p style={{ fontWeight: 700 }}>{stone} st {lbs} lbs</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{totalLbs} × 0.4536</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Stones to Kilograms — Reference Table</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Stones</th><th>Pounds</th><th>Kilograms</th><th>Grams</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((s) => {
                            const k = s * 6.350293;
                            return (
                                <tr key={s} style={s === stone && lbs === 0 ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{s} st</td>
                                    <td>{s * 14} lbs</td>
                                    <td>{k.toFixed(2)} kg</td>
                                    <td>{(k * 1000).toFixed(0)} g</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Tablespoons to Grams ───
function TbspToGramCalc() {
    const [tbsp, setTbsp] = useState(1);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // grams = tbsp × 14.787 mL/tbsp × density g/mL
    const ml = tbsp * 14.787;
    const grams = ml * density;
    const oz = grams / 28.3495;
    const tsp = tbsp * 3;

    const quickRef = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 15, 20];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🥄 TABLESPOONS</label>
                <input type="range" className="calc-field__slider" min={0.25} max={50} step={0.25}
                    value={tbsp} onChange={(e) => setTbsp(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={tbsp}
                        onChange={(e) => setTbsp(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">tbsp</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN GRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {grams.toFixed(2)} g
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">OUNCES</p><p style={{ fontWeight: 700 }}>{oz.toFixed(3)} oz</p></div>
                    <div><p className="calc-field__label">TEASPOONS</p><p style={{ fontWeight: 700 }}>{tsp.toFixed(1)} tsp</p></div>
                    <div><p className="calc-field__label">MILLILITERS</p><p style={{ fontWeight: 700 }}>{ml.toFixed(2)} mL</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{tbsp} × 14.79 × {density}</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Tablespoons</th><th>Grams</th><th>Ounces</th><th>Teaspoons</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((t) => {
                            const g = t * 14.787 * density;
                            return (
                                <tr key={t} style={t === tbsp ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{t} tbsp</td>
                                    <td>{g.toFixed(2)} g</td>
                                    <td>{(g / 28.3495).toFixed(3)} oz</td>
                                    <td>{(t * 3).toFixed(0)} tsp</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Kilograms to Liters ───
function KgToLiterCalc() {
    const [kg, setKg] = useState(1);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    // density in g/mL is numerically same as kg/L
    const density = substance.label === "Custom" ? customDensity : substance.density;
    const liters = kg / density;
    const gallons = liters * 0.264172;
    const quarts = liters * 1.05669;
    const lbs = kg * 2.20462;

    const quickRef = [0.5, 1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⚖️ WEIGHT (KILOGRAMS)</label>
                <input type="range" className="calc-field__slider" min={0.1} max={100} step={0.1}
                    value={kg} onChange={(e) => setKg(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={kg}
                        onChange={(e) => setKg(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">kg</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} kg/L)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (kg/L)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">VOLUME IN LITERS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {liters.toLocaleString("en-US", { maximumFractionDigits: 3 })} L
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">US GALLONS</p><p style={{ fontWeight: 700 }}>{gallons.toFixed(3)} gal</p></div>
                    <div><p className="calc-field__label">US QUARTS</p><p style={{ fontWeight: 700 }}>{quarts.toFixed(3)} qt</p></div>
                    <div><p className="calc-field__label">POUNDS</p><p style={{ fontWeight: 700 }}>{lbs.toFixed(2)} lbs</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{kg} ÷ {density}</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Kilograms</th><th>Liters</th><th>US Gallons</th><th>Pounds</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((w) => {
                            const l = w / density;
                            return (
                                <tr key={w} style={w === kg ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{w} kg</td>
                                    <td>{l.toFixed(3)} L</td>
                                    <td>{(l * 0.264172).toFixed(3)} gal</td>
                                    <td>{(w * 2.20462).toFixed(2)} lbs</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Milligrams to Milliliters ───
function MgToMlCalc() {
    const [mg, setMg] = useState(500);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // mL = mg ÷ (density_g_per_mL × 1000)
    const ml = mg / (density * 1000);
    const flOz = ml / 29.5735;
    const tsp = ml / 4.929;
    const drops = ml * 20; // ~20 drops per mL (medical dropper standard)

    const quickRef = [10, 25, 50, 100, 200, 250, 500, 750, 1000, 1500, 2000, 5000];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">💊 MILLIGRAMS (mg)</label>
                <input type="range" className="calc-field__slider" min={1} max={5000} step={1}
                    value={mg} onChange={(e) => setMg(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={mg}
                        onChange={(e) => setMg(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">mg</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">VOLUME IN MILLILITERS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {ml.toLocaleString("en-US", { maximumFractionDigits: 4 })} mL
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">FLUID OUNCES</p><p style={{ fontWeight: 700 }}>{flOz.toFixed(4)} fl oz</p></div>
                    <div><p className="calc-field__label">TEASPOONS</p><p style={{ fontWeight: 700 }}>{tsp.toFixed(4)} tsp</p></div>
                    <div><p className="calc-field__label">DROPS (~20/mL)</p><p style={{ fontWeight: 700 }}>{drops.toFixed(1)} drops</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{mg} ÷ ({density}×1000)</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Milligrams</th><th>Milliliters</th><th>Teaspoons</th><th>Drops</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((m) => {
                            const v = m / (density * 1000);
                            return (
                                <tr key={m} style={m === mg ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{m} mg</td>
                                    <td>{v.toFixed(4)} mL</td>
                                    <td>{(v / 4.929).toFixed(4)} tsp</td>
                                    <td>{(v * 20).toFixed(1)} drops</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Grams to Teaspoons ───
function GramToTspCalc() {
    const [grams, setGrams] = useState(10);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // tsp = grams ÷ (4.929 mL/tsp × density g/mL)
    const tsp = grams / (4.929 * density);
    const tbsp = tsp / 3;
    const cups = tsp / 48;
    const ml = grams / density;

    const quickRef = [1, 2, 3, 5, 7, 10, 15, 20, 25, 50, 100, 200];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⚖️ GRAMS</label>
                <input type="range" className="calc-field__slider" min={0.5} max={500} step={0.5}
                    value={grams} onChange={(e) => setGrams(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={grams}
                        onChange={(e) => setGrams(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">g</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">VOLUME IN TEASPOONS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {tsp.toFixed(2)} tsp
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">TABLESPOONS</p><p style={{ fontWeight: 700 }}>{tbsp.toFixed(2)} tbsp</p></div>
                    <div><p className="calc-field__label">CUPS</p><p style={{ fontWeight: 700 }}>{cups.toFixed(3)} cups</p></div>
                    <div><p className="calc-field__label">MILLILITERS</p><p style={{ fontWeight: 700 }}>{ml.toFixed(2)} mL</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{grams} ÷ (4.93×{density})</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Grams</th><th>Teaspoons</th><th>Tablespoons</th><th>Cups</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((g) => {
                            const t = g / (4.929 * density);
                            return (
                                <tr key={g} style={g === grams ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{g} g</td>
                                    <td>{t.toFixed(2)} tsp</td>
                                    <td>{(t / 3).toFixed(2)} tbsp</td>
                                    <td>{(t / 48).toFixed(3)} cups</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Teaspoons to Cups ───
function TspToCupCalc() {
    const [tsp, setTsp] = useState(12);

    const cups = tsp / 48;
    const tbsp = tsp / 3;
    const flOz = tsp / 6;
    const ml = tsp * 4.929;

    const quickRef = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 36, 48, 72, 96];
    const fractionLabel = (val: number) => {
        if (val === 0.25) return "¼";
        if (val === 0.5) return "½";
        if (val === 0.75) return "¾";
        if (val === 0.333) return "⅓";
        if (val === 0.667) return "⅔";
        if (Number.isInteger(val)) return val.toString();
        return val.toFixed(3);
    };

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🥄 TEASPOONS</label>
                <input type="range" className="calc-field__slider" min={0.25} max={192} step={0.25}
                    value={tsp} onChange={(e) => setTsp(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={tsp}
                        onChange={(e) => setTsp(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">tsp</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">VOLUME IN CUPS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {cups.toFixed(3)} cups
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">TABLESPOONS</p><p style={{ fontWeight: 700 }}>{tbsp.toFixed(2)} tbsp</p></div>
                    <div><p className="calc-field__label">FLUID OUNCES</p><p style={{ fontWeight: 700 }}>{flOz.toFixed(2)} fl oz</p></div>
                    <div><p className="calc-field__label">MILLILITERS</p><p style={{ fontWeight: 700 }}>{ml.toFixed(1)} mL</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{tsp} ÷ 48</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Teaspoons to Cups — Quick Reference</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Teaspoons</th><th>Cups</th><th>Tablespoons</th><th>Fluid Ounces</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((t) => (
                            <tr key={t} style={t === tsp ? { background: "var(--n-primary-light)" } : {}}>
                                <td>{t} tsp</td>
                                <td>{(t / 48).toFixed(3)} cups</td>
                                <td>{(t / 3).toFixed(1)} tbsp</td>
                                <td>{(t / 6).toFixed(2)} fl oz</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Butter: Teaspoons to Grams ───
function ButterTspToGramCalc() {
    const [tsp, setTsp] = useState(1);

    // 1 tsp butter = 4.73g (density ~0.959 g/mL)
    const BUTTER_G_PER_TSP = 4.73;
    const grams = tsp * BUTTER_G_PER_TSP;
    const oz = grams / 28.3495;
    const tbsp = tsp / 3;
    const sticks = grams / 113.4; // 1 stick = 113.4g = 4 oz = 8 tbsp
    const cups = tsp / 48;

    const quickRef = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🧈 TEASPOONS OF BUTTER</label>
                <input type="range" className="calc-field__slider" min={0.25} max={96} step={0.25}
                    value={tsp} onChange={(e) => setTsp(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={tsp}
                        onChange={(e) => setTsp(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">tsp</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN GRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {grams.toFixed(2)} g
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">OUNCES</p><p style={{ fontWeight: 700 }}>{oz.toFixed(3)} oz</p></div>
                    <div><p className="calc-field__label">TABLESPOONS</p><p style={{ fontWeight: 700 }}>{tbsp.toFixed(2)} tbsp</p></div>
                    <div><p className="calc-field__label">STICKS</p><p style={{ fontWeight: 700 }}>{sticks.toFixed(3)} sticks</p></div>
                    <div><p className="calc-field__label">CUPS</p><p style={{ fontWeight: 700 }}>{cups.toFixed(3)} cups</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Butter — Teaspoons to Grams</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Teaspoons</th><th>Grams</th><th>Ounces</th><th>Tbsp</th><th>Sticks</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((t) => {
                            const g = t * BUTTER_G_PER_TSP;
                            return (
                                <tr key={t} style={t === tsp ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{t} tsp</td>
                                    <td>{g.toFixed(1)} g</td>
                                    <td>{(g / 28.3495).toFixed(2)} oz</td>
                                    <td>{(t / 3).toFixed(1)} tbsp</td>
                                    <td>{(g / 113.4).toFixed(2)} sticks</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Kilograms to Stone & Pounds ───
function KgToStoneCalc() {
    const [kg, setKg] = useState(70);

    const KG_PER_STONE = 6.35029;
    const totalStones = kg / KG_PER_STONE;
    const wholeStones = Math.floor(totalStones);
    const remainingLbs = (totalStones - wholeStones) * 14;
    const totalLbs = kg * 2.20462;
    const totalOz = totalLbs * 16;

    const quickRef = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100, 120, 150];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⚖️ KILOGRAMS</label>
                <input type="range" className="calc-field__slider" min={1} max={250} step={0.5}
                    value={kg} onChange={(e) => setKg(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={kg}
                        onChange={(e) => setKg(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">kg</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN STONE & POUNDS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {wholeStones} st {remainingLbs.toFixed(1)} lbs
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">DECIMAL STONE</p><p style={{ fontWeight: 700 }}>{totalStones.toFixed(4)} st</p></div>
                    <div><p className="calc-field__label">TOTAL POUNDS</p><p style={{ fontWeight: 700 }}>{totalLbs.toFixed(2)} lbs</p></div>
                    <div><p className="calc-field__label">TOTAL OUNCES</p><p style={{ fontWeight: 700 }}>{totalOz.toFixed(0)} oz</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{kg} ÷ 6.35</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Common Body Weights — kg to Stone & Pounds</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Kilograms</th><th>Stone & Pounds</th><th>Total Pounds</th><th>Decimal Stone</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((w) => {
                            const st = w / KG_PER_STONE;
                            const ws = Math.floor(st);
                            const rl = (st - ws) * 14;
                            return (
                                <tr key={w} style={w === kg ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{w} kg</td>
                                    <td>{ws} st {rl.toFixed(1)} lbs</td>
                                    <td>{(w * 2.20462).toFixed(1)} lbs</td>
                                    <td>{st.toFixed(2)} st</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Grams to Liters ───
function GramToLiterCalc() {
    const [grams, setGrams] = useState(500);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // liters = grams ÷ (density_g/mL × 1000)
    const liters = grams / (density * 1000);
    const gallons = liters * 0.264172;
    const quarts = liters * 1.05669;
    const ml = grams / density;

    const quickRef = [10, 25, 50, 100, 200, 250, 500, 750, 1000, 2000, 3000, 5000];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⚖️ GRAMS</label>
                <input type="range" className="calc-field__slider" min={1} max={5000} step={1}
                    value={grams} onChange={(e) => setGrams(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={grams}
                        onChange={(e) => setGrams(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">g</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">VOLUME IN LITERS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {liters.toLocaleString("en-US", { maximumFractionDigits: 4 })} L
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">US GALLONS</p><p style={{ fontWeight: 700 }}>{gallons.toFixed(4)} gal</p></div>
                    <div><p className="calc-field__label">US QUARTS</p><p style={{ fontWeight: 700 }}>{quarts.toFixed(4)} qt</p></div>
                    <div><p className="calc-field__label">MILLILITERS</p><p style={{ fontWeight: 700 }}>{ml.toFixed(2)} mL</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{grams} ÷ ({density}×1000)</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Grams</th><th>Liters</th><th>Milliliters</th><th>US Gallons</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((g) => {
                            const l = g / (density * 1000);
                            return (
                                <tr key={g} style={g === grams ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{g} g</td>
                                    <td>{l.toFixed(4)} L</td>
                                    <td>{(g / density).toFixed(1)} mL</td>
                                    <td>{(l * 0.264172).toFixed(4)} gal</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Milliliters to Milligrams ───
function MlToMgCalc() {
    const [ml, setMl] = useState(5);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // mg = mL × density (g/mL) × 1000
    const mg = ml * density * 1000;
    const grams = mg / 1000;
    const oz = grams / 28.3495;
    const tsp = ml / 4.929;

    const quickRef = [0.5, 1, 2, 2.5, 5, 10, 15, 20, 25, 30, 50, 100];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">💧 MILLILITERS</label>
                <input type="range" className="calc-field__slider" min={0.1} max={1000} step={0.1}
                    value={ml} onChange={(e) => setMl(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={ml}
                        onChange={(e) => setMl(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">mL</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN MILLIGRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {mg.toLocaleString("en-US", { maximumFractionDigits: 1 })} mg
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">GRAMS</p><p style={{ fontWeight: 700 }}>{grams.toFixed(2)} g</p></div>
                    <div><p className="calc-field__label">OUNCES</p><p style={{ fontWeight: 700 }}>{oz.toFixed(4)} oz</p></div>
                    <div><p className="calc-field__label">TEASPOONS</p><p style={{ fontWeight: 700 }}>{tsp.toFixed(2)} tsp</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{ml}×{density}×1000</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Milliliters</th><th>Milligrams</th><th>Grams</th><th>Teaspoons</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((v) => {
                            const m = v * density * 1000;
                            return (
                                <tr key={v} style={v === ml ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{v} mL</td>
                                    <td>{m.toLocaleString("en-US", { maximumFractionDigits: 0 })} mg</td>
                                    <td>{(m / 1000).toFixed(2)} g</td>
                                    <td>{(v / 4.929).toFixed(2)} tsp</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Liters to Grams ───
function LiterToGramCalc() {
    const [liters, setLiters] = useState(1);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    // grams = liters × density (g/mL) × 1000
    const grams = liters * density * 1000;
    const kg = grams / 1000;
    const lbs = grams / 453.592;
    const cups = liters * 4.22675;

    const quickRef = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 10];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🧴 LITERS</label>
                <input type="range" className="calc-field__slider" min={0.01} max={20} step={0.01}
                    value={liters} onChange={(e) => setLiters(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={liters}
                        onChange={(e) => setLiters(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">L</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN GRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {grams.toLocaleString("en-US", { maximumFractionDigits: 1 })} g
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">KILOGRAMS</p><p style={{ fontWeight: 700 }}>{kg.toFixed(3)} kg</p></div>
                    <div><p className="calc-field__label">POUNDS</p><p style={{ fontWeight: 700 }}>{lbs.toFixed(2)} lbs</p></div>
                    <div><p className="calc-field__label">US CUPS</p><p style={{ fontWeight: 700 }}>{cups.toFixed(2)} cups</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{liters}×{density}×1000</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Liters</th><th>Grams</th><th>Kilograms</th><th>Pounds</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((l) => {
                            const g = l * density * 1000;
                            return (
                                <tr key={l} style={l === liters ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{l} L</td>
                                    <td>{g.toLocaleString("en-US", { maximumFractionDigits: 0 })} g</td>
                                    <td>{(g / 1000).toFixed(2)} kg</td>
                                    <td>{(g / 453.592).toFixed(2)} lbs</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Cups to Grams ───
function CupToGramCalc() {
    const [cups, setCups] = useState(1);
    const [substanceIdx, setSubstanceIdx] = useState(0);
    const [customDensity, setCustomDensity] = useState(1.0);

    const substance = SUBSTANCES[substanceIdx];
    const density = substance.label === "Custom" ? customDensity : substance.density;
    const ML_PER_CUP = 236.588;
    // grams = cups × 236.588 × density
    const grams = cups * ML_PER_CUP * density;
    const oz = grams / 28.3495;
    const tbsp = cups * 16;
    const ml = cups * ML_PER_CUP;

    const quickRef = [0.25, 0.333, 0.5, 0.667, 0.75, 1, 1.5, 2, 3, 4];
    const fracLabels: Record<number, string> = { 0.25: "¼", 0.333: "⅓", 0.5: "½", 0.667: "⅔", 0.75: "¾" };

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🥤 US CUPS</label>
                <input type="range" className="calc-field__slider" min={0.25} max={10} step={0.25}
                    value={cups} onChange={(e) => setCups(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={cups}
                        onChange={(e) => setCups(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">cups</span>
                </div>
            </div>
            <div className="calc-field">
                <label className="calc-field__label">🏷️ SUBSTANCE / INGREDIENT</label>
                <select className="calc-field__input" value={substanceIdx}
                    onChange={(e) => setSubstanceIdx(Number(e.target.value))}>
                    {SUBSTANCES.map((s, i) => (
                        <option key={i} value={i}>{s.label} ({s.density} g/mL)</option>
                    ))}
                </select>
            </div>

            {substance.label === "Custom" && (
                <div className="calc-field">
                    <label className="calc-field__label">⚙️ CUSTOM DENSITY (g/mL)</label>
                    <input type="range" className="calc-field__slider" min={0.1} max={3.0} step={0.01}
                        value={customDensity} onChange={(e) => setCustomDensity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={customDensity}
                        onChange={(e) => setCustomDensity(Number(e.target.value))} />
                </div>
            )}

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHT IN GRAMS</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {grams.toLocaleString("en-US", { maximumFractionDigits: 1 })} g
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">OUNCES</p><p style={{ fontWeight: 700 }}>{oz.toFixed(2)} oz</p></div>
                    <div><p className="calc-field__label">TABLESPOONS</p><p style={{ fontWeight: 700 }}>{tbsp.toFixed(0)} tbsp</p></div>
                    <div><p className="calc-field__label">MILLILITERS</p><p style={{ fontWeight: 700 }}>{ml.toFixed(1)} mL</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{cups}×236.6×{density}</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Quick Reference — {substance.label}</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Cups</th><th>Grams</th><th>Ounces</th><th>Tablespoons</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((c) => {
                            const g = c * ML_PER_CUP * density;
                            const label = fracLabels[c] || String(c);
                            return (
                                <tr key={c} style={Math.abs(c - cups) < 0.01 ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{label} cup{c > 1 ? "s" : ""}</td>
                                    <td>{g.toFixed(1)} g</td>
                                    <td>{(g / 28.3495).toFixed(2)} oz</td>
                                    <td>{(c * 16).toFixed(0)} tbsp</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Minutes to Hours ───
function MinToHourCalc() {
    const [minutes, setMinutes] = useState(90);

    const decimalHours = minutes / 60;
    const wholeHours = Math.floor(decimalHours);
    const remainingMinutes = Math.round((decimalHours - wholeHours) * 60);
    const totalSeconds = minutes * 60;
    const fractionOfDay = minutes / 1440;

    const quickRef = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 1440];

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">⏱️ MINUTES</label>
                <input type="range" className="calc-field__slider" min={1} max={1440} step={1}
                    value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
                <div style={{ display: "flex", gap: "var(--s-2)", alignItems: "center" }}>
                    <input type="number" className="calc-field__input" value={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))} style={{ flex: 1 }} />
                    <span className="t-body-sm text-muted">min</span>
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">TIME IN HOURS & MINUTES</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {wholeHours}h {remainingMinutes}m
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">DECIMAL HOURS</p><p style={{ fontWeight: 700 }}>{decimalHours.toFixed(4)} hr</p></div>
                    <div><p className="calc-field__label">TOTAL SECONDS</p><p style={{ fontWeight: 700 }}>{totalSeconds.toLocaleString()} s</p></div>
                    <div><p className="calc-field__label">% OF DAY</p><p style={{ fontWeight: 700 }}>{(fractionOfDay * 100).toFixed(2)}%</p></div>
                    <div><p className="calc-field__label">FORMULA</p><p style={{ fontWeight: 700, fontSize: "var(--t-body-sm)" }}>{minutes} ÷ 60</p></div>
                </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "var(--s-4)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Minutes to Hours — Quick Reference</h3>
                <table className="calc-table">
                    <thead>
                        <tr><th>Minutes</th><th>Hours & Minutes</th><th>Decimal Hours</th><th>Seconds</th></tr>
                    </thead>
                    <tbody>
                        {quickRef.map((m) => {
                            const dh = m / 60;
                            const wh = Math.floor(dh);
                            const rm = Math.round((dh - wh) * 60);
                            return (
                                <tr key={m} style={m === minutes ? { background: "var(--n-primary-light)" } : {}}>
                                    <td>{m} min</td>
                                    <td>{wh}h {rm}m</td>
                                    <td>{dh.toFixed(4)} hr</td>
                                    <td>{(m * 60).toLocaleString()} s</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Dispatcher ───
interface Props { calcType: string; }

const CALCULATORS: Record<string, React.FC> = {
    "ml-to-gram": MlToGramCalc,
    "gram-to-ml": GramToMlCalc,
    "liter-to-kg": LiterToKgCalc,
    "gram-to-cup": GramToCupCalc,
    "inch-to-cm": InchToCmCalc,
    "stone-to-kg": StonesToKgCalc,
    "tbsp-to-gram": TbspToGramCalc,
    "kg-to-liter": KgToLiterCalc,
    "mg-to-ml": MgToMlCalc,
    "gram-to-tsp": GramToTspCalc,
    "tsp-to-cup": TspToCupCalc,
    "butter-tsp-to-gram": ButterTspToGramCalc,
    "kg-to-stone": KgToStoneCalc,
    "gram-to-liter": GramToLiterCalc,
    "ml-to-mg": MlToMgCalc,
    "liter-to-gram": LiterToGramCalc,
    "cup-to-gram": CupToGramCalc,
    "min-to-hour": MinToHourCalc,
};

export default function ConversionCalculatorCore({ calcType }: Props) {
    const Calculator = CALCULATORS[calcType];
    if (!Calculator) return <p>Unknown converter type: {calcType}</p>;
    return <Calculator />;
}
