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

// ─── Dispatcher ───
interface Props { calcType: string; }

const CALCULATORS: Record<string, React.FC> = {
    "ml-to-gram": MlToGramCalc,
    "gram-to-ml": GramToMlCalc,
    "liter-to-kg": LiterToKgCalc,
    "gram-to-cup": GramToCupCalc,
    "inch-to-cm": InchToCmCalc,
    "stone-to-kg": StonesToKgCalc,
};

export default function ConversionCalculatorCore({ calcType }: Props) {
    const Calculator = CALCULATORS[calcType];
    if (!Calculator) return <p>Unknown converter type: {calcType}</p>;
    return <Calculator />;
}
