"use client";

import { useState, useCallback, useMemo } from "react";

/* ── City-wise Fuel Prices (March 2026) ── */
const CITY_PRICES: Record<string, { petrol: number; diesel: number; cng: number }> = {
    "Delhi": { petrol: 94.77, diesel: 87.67, cng: 77.09 },
    "Mumbai": { petrol: 103.54, diesel: 90.03, cng: 80.50 },
    "Bangalore": { petrol: 102.96, diesel: 90.99, cng: 88.95 },
    "Chennai": { petrol: 100.85, diesel: 92.81, cng: 91.50 },
    "Kolkata": { petrol: 105.45, diesel: 92.02, cng: 93.50 },
    "Hyderabad": { petrol: 109.78, diesel: 97.45, cng: 88.00 },
    "Pune": { petrol: 104.36, diesel: 90.33, cng: 78.00 },
    "Ahmedabad": { petrol: 94.51, diesel: 90.07, cng: 72.00 },
    "Jaipur": { petrol: 104.88, diesel: 90.36, cng: 85.00 },
    "Lucknow": { petrol: 94.65, diesel: 87.75, cng: 76.00 },
    "Chandigarh": { petrol: 96.20, diesel: 84.26, cng: 79.00 },
    "Bhopal": { petrol: 108.65, diesel: 93.90, cng: 84.00 },
    "Patna": { petrol: 107.54, diesel: 94.27, cng: 89.00 },
    "Guwahati": { petrol: 96.01, diesel: 88.94, cng: 90.00 },
    "Kochi": { petrol: 104.47, diesel: 93.47, cng: 92.00 },
};

/* ── Popular Road Trip Routes ── */
const POPULAR_ROUTES: { label: string; km: number }[] = [
    { label: "Delhi → Jaipur", km: 281 },
    { label: "Mumbai → Pune", km: 149 },
    { label: "Bangalore → Mysore", km: 150 },
    { label: "Chennai → Pondicherry", km: 155 },
    { label: "Delhi → Agra", km: 233 },
    { label: "Mumbai → Goa", km: 589 },
    { label: "Bangalore → Goa", km: 560 },
    { label: "Delhi → Chandigarh", km: 244 },
    { label: "Hyderabad → Vijayawada", km: 275 },
    { label: "Kolkata → Digha", km: 185 },
];

type FuelType = "petrol" | "diesel" | "cng";
type CalcMode = "daily" | "trip" | "compare" | "reverse";

/* ── Indian number formatting (₹1,23,456) ── */
function formatINR(n: number): string {
    if (isNaN(n) || !isFinite(n)) return "₹0";
    const isNeg = n < 0;
    const abs = Math.abs(Math.round(n * 100) / 100);
    const [intPart, decPart] = abs.toFixed(2).split(".");
    let formatted = "";
    if (intPart.length <= 3) {
        formatted = intPart;
    } else {
        const last3 = intPart.slice(-3);
        const rest = intPart.slice(0, -3);
        const pairs: string[] = [];
        for (let i = rest.length; i > 0; i -= 2) {
            pairs.unshift(rest.slice(Math.max(0, i - 2), i));
        }
        formatted = pairs.join(",") + "," + last3;
    }
    return (isNeg ? "-" : "") + "₹" + formatted + "." + decPart;
}

export default function FuelCostCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("daily");
    const [fuelType, setFuelType] = useState<FuelType>("petrol");
    const [city, setCity] = useState("Delhi");
    const [distance, setDistance] = useState(30);
    const [mileage, setMileage] = useState(18);
    const [fuelPrice, setFuelPrice] = useState(CITY_PRICES["Delhi"].petrol);
    const [tripDistance, setTripDistance] = useState(281);
    const [budget, setBudget] = useState(500);

    // Mileage defaults for comparison mode
    const [mileagePetrol, setMileagePetrol] = useState(18);
    const [mileageDiesel, setMileageDiesel] = useState(22);
    const [mileageCNG, setMileageCNG] = useState(25);

    const handleCityChange = useCallback((newCity: string) => {
        setCity(newCity);
        const prices = CITY_PRICES[newCity];
        if (prices) setFuelPrice(prices[fuelType]);
    }, [fuelType]);

    const handleFuelTypeChange = useCallback((ft: FuelType) => {
        setFuelType(ft);
        const prices = CITY_PRICES[city];
        if (prices) setFuelPrice(prices[ft]);
    }, [city]);

    /* ── RESULTS ── */
    const dailyResult = useMemo(() => {
        if (!distance || !mileage || !fuelPrice) return null;
        const litresPerDay = distance / mileage;
        const costPerDay = litresPerDay * fuelPrice;
        const costPerKm = fuelPrice / mileage;
        return {
            litresPerDay: litresPerDay.toFixed(2),
            costPerDay,
            costPerMonth: costPerDay * 30,
            costPerYear: costPerDay * 365,
            costPerKm,
        };
    }, [distance, mileage, fuelPrice]);

    const tripResult = useMemo(() => {
        if (!tripDistance || !mileage || !fuelPrice) return null;
        const litres = tripDistance / mileage;
        const cost = litres * fuelPrice;
        return {
            litres: litres.toFixed(2),
            cost,
            costPerKm: fuelPrice / mileage,
        };
    }, [tripDistance, mileage, fuelPrice]);

    const compareResult = useMemo(() => {
        const prices = CITY_PRICES[city];
        if (!prices || !distance) return null;
        const daily = {
            petrol: (distance / mileagePetrol) * prices.petrol,
            diesel: (distance / mileageDiesel) * prices.diesel,
            cng: (distance / mileageCNG) * prices.cng,
        };
        return {
            daily,
            monthly: { petrol: daily.petrol * 30, diesel: daily.diesel * 30, cng: daily.cng * 30 },
            yearly: { petrol: daily.petrol * 365, diesel: daily.diesel * 365, cng: daily.cng * 365 },
            cheapest: daily.petrol <= daily.diesel && daily.petrol <= daily.cng ? "Petrol"
                : daily.diesel <= daily.cng ? "Diesel" : "CNG",
        };
    }, [city, distance, mileagePetrol, mileageDiesel, mileageCNG]);

    const reverseResult = useMemo(() => {
        if (!budget || !mileage || !fuelPrice) return null;
        const litres = budget / fuelPrice;
        const km = litres * mileage;
        return { litres: litres.toFixed(2), km: km.toFixed(1) };
    }, [budget, mileage, fuelPrice]);

    const cityNames = Object.keys(CITY_PRICES);
    const fuelUnit = fuelType === "cng" ? "kg" : "litre";

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">⛽ Fuel Cost Calculator</h3>

            {/* ── Mode Tabs ── */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([
                    ["daily", "Daily / Monthly"],
                    ["trip", "Trip Cost"],
                    ["compare", "Fuel Comparison"],
                    ["reverse", "Budget → Distance"],
                ] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)}
                        style={mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {}}>
                        {label}
                    </button>
                ))}
            </div>

            {/* ── SHARED: City + Fuel Type ── */}
            {mode !== "compare" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div className="con-input">
                        <label className="con-input__label">City</label>
                        <select className="con-input__field" value={city} onChange={(e) => handleCityChange(e.target.value)}>
                            {cityNames.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="con-input">
                        <label className="con-input__label">Fuel Type</label>
                        <div style={{ display: "flex", gap: "6px" }}>
                            {(["petrol", "diesel", "cng"] as FuelType[]).map((ft) => (
                                <button key={ft} className="calc-tab-btn" onClick={() => handleFuelTypeChange(ft)}
                                    style={fuelType === ft ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", flex: 1 } : { flex: 1 }}>
                                    {ft.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ MODE: DAILY ═══════ */}
            {mode === "daily" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Daily Distance <span className="con-input__unit">(km)</span></label>
                            <input type="number" className="con-input__field" value={distance} onChange={(e) => setDistance(+e.target.value)} min={0} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Mileage <span className="con-input__unit">(km/{fuelUnit})</span></label>
                            <input type="number" className="con-input__field" value={mileage} onChange={(e) => setMileage(+e.target.value)} min={1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Fuel Price <span className="con-input__unit">(₹/{fuelUnit})</span></label>
                            <input type="number" className="con-input__field" value={fuelPrice} onChange={(e) => setFuelPrice(+e.target.value)} step={0.01} min={0} />
                        </div>
                    </div>
                    {dailyResult && (
                        <div className="con-calc__results">
                            <h4>Results</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Cost per km</span><span className="con-result-row__value">{formatINR(dailyResult.costPerKm)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Daily Fuel ({dailyResult.litresPerDay} {fuelUnit}s)</span><span className="con-result-row__value">{formatINR(dailyResult.costPerDay)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Monthly (30 days)</span><span className="con-result-row__value" style={{ color: "#d4620a", fontSize: "1.1rem" }}>{formatINR(dailyResult.costPerMonth)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Yearly (365 days)</span><span className="con-result-row__value" style={{ fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(dailyResult.costPerYear)}</span></div>
                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>Formula:</strong> ({distance} km ÷ {mileage} km/{fuelUnit}) × ₹{fuelPrice}/{fuelUnit} = {formatINR(dailyResult.costPerDay)}/day
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: TRIP ═══════ */}
            {mode === "trip" && (
                <>
                    <div style={{ marginBottom: "12px" }}>
                        <label className="con-input__label" style={{ marginBottom: "8px", display: "block" }}>Popular Routes</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {POPULAR_ROUTES.map((r) => (
                                <button key={r.label} className="calc-tab-btn" onClick={() => setTripDistance(r.km)}
                                    style={tripDistance === r.km ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>
                                    {r.label} ({r.km} km)
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Trip Distance <span className="con-input__unit">(km)</span></label>
                            <input type="number" className="con-input__field" value={tripDistance} onChange={(e) => setTripDistance(+e.target.value)} min={0} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Mileage <span className="con-input__unit">(km/{fuelUnit})</span></label>
                            <input type="number" className="con-input__field" value={mileage} onChange={(e) => setMileage(+e.target.value)} min={1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Fuel Price <span className="con-input__unit">(₹/{fuelUnit})</span></label>
                            <input type="number" className="con-input__field" value={fuelPrice} onChange={(e) => setFuelPrice(+e.target.value)} step={0.01} min={0} />
                        </div>
                    </div>
                    {tripResult && (
                        <div className="con-calc__results">
                            <h4>Trip Cost Estimate</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Fuel Needed</span><span className="con-result-row__value">{tripResult.litres} {fuelUnit}s</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Trip Cost</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(tripResult.cost)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Cost per km</span><span className="con-result-row__value">{formatINR(tripResult.costPerKm)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Round Trip Cost</span><span className="con-result-row__value">{formatINR(tripResult.cost * 2)}</span></div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: COMPARE ═══════ */}
            {mode === "compare" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">City</label>
                            <select className="con-input__field" value={city} onChange={(e) => handleCityChange(e.target.value)}>
                                {cityNames.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Daily Distance <span className="con-input__unit">(km)</span></label>
                            <input type="number" className="con-input__field" value={distance} onChange={(e) => setDistance(+e.target.value)} min={0} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Petrol Mileage <span className="con-input__unit">(kmpl)</span></label>
                            <input type="number" className="con-input__field" value={mileagePetrol} onChange={(e) => setMileagePetrol(+e.target.value)} min={1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Diesel Mileage <span className="con-input__unit">(kmpl)</span></label>
                            <input type="number" className="con-input__field" value={mileageDiesel} onChange={(e) => setMileageDiesel(+e.target.value)} min={1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">CNG Mileage <span className="con-input__unit">(km/kg)</span></label>
                            <input type="number" className="con-input__field" value={mileageCNG} onChange={(e) => setMileageCNG(+e.target.value)} min={1} />
                        </div>
                    </div>
                    {compareResult && (
                        <div className="con-calc__results">
                            <h4>Fuel Cost Comparison — {city}</h4>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                <thead>
                                    <tr style={{ background: "#d4620a", color: "#fff" }}>
                                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Period</th>
                                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Petrol</th>
                                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Diesel</th>
                                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>CNG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>Daily</td><td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(compareResult.daily.petrol)}</td><td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(compareResult.daily.diesel)}</td><td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(compareResult.daily.cng)}</td></tr>
                                    <tr><td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>Monthly</td><td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(compareResult.monthly.petrol)}</td><td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(compareResult.monthly.diesel)}</td><td style={{ padding: "10px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(compareResult.monthly.cng)}</td></tr>
                                    <tr style={{ fontWeight: 700 }}><td style={{ padding: "10px 12px" }}>Yearly</td><td style={{ padding: "10px 12px", textAlign: "right" }}>{formatINR(compareResult.yearly.petrol)}</td><td style={{ padding: "10px 12px", textAlign: "right" }}>{formatINR(compareResult.yearly.diesel)}</td><td style={{ padding: "10px 12px", textAlign: "right" }}>{formatINR(compareResult.yearly.cng)}</td></tr>
                                </tbody>
                            </table>
                            <div className="explanation__highlight" style={{ marginTop: "12px" }}>
                                <strong>Most Economical:</strong> {compareResult.cheapest} — saving {formatINR(Math.max(compareResult.yearly.petrol, compareResult.yearly.diesel, compareResult.yearly.cng) - Math.min(compareResult.yearly.petrol, compareResult.yearly.diesel, compareResult.yearly.cng))}/year vs the most expensive option
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: REVERSE ═══════ */}
            {mode === "reverse" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Your Budget <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={budget} onChange={(e) => setBudget(+e.target.value)} min={0} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Mileage <span className="con-input__unit">(km/{fuelUnit})</span></label>
                            <input type="number" className="con-input__field" value={mileage} onChange={(e) => setMileage(+e.target.value)} min={1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Fuel Price <span className="con-input__unit">(₹/{fuelUnit})</span></label>
                            <input type="number" className="con-input__field" value={fuelPrice} onChange={(e) => setFuelPrice(+e.target.value)} step={0.01} min={0} />
                        </div>
                    </div>
                    {reverseResult && (
                        <div className="con-calc__results">
                            <h4>With {formatINR(budget)} you can travel</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Fuel You Get</span><span className="con-result-row__value">{reverseResult.litres} {fuelUnit}s</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Maximum Distance</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.2rem" }}>{reverseResult.km} km</span></div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
