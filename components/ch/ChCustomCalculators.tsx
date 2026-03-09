// ChCustomCalculators — Client components for Swiss finance calculators
// Mortgage, Affordability, Down Payment, Rent vs Buy, Property ROI,
// Amortization, Interest, Closing Costs, LTV, Budget

"use client";

import { useState, useMemo } from "react";

// ─── Formatting ───
const fmtCHF = (n: number) =>
    n.toLocaleString("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const fmtPct = (n: number) => n.toFixed(2) + "%";

// ═══════════════════════════════════════════════════
// 1. Hypothekenrechner — Mortgage Calculator
// ═══════════════════════════════════════════════════
function MortgageCalc() {
    const [price, setPrice] = useState(1000000);
    const [equity, setEquity] = useState(200000);
    const [rate, setRate] = useState(1.5);
    const [term, setTerm] = useState(15);

    const res = useMemo(() => {
        const mortgage = price - equity;
        const belehnungPct = (mortgage / price) * 100;
        const first = Math.min(mortgage, price * 0.65);
        const second = Math.max(0, mortgage - first);
        const monthlyInterest = (mortgage * (rate / 100)) / 12;
        const monthlyAmort = second > 0 ? second / (term * 12) : 0;
        const monthlyMaintenance = (price * 0.01) / 12;
        const totalMonthly = monthlyInterest + monthlyAmort + monthlyMaintenance;
        const totalInterest10y = mortgage * (rate / 100) * 10;
        return { mortgage, belehnungPct, first, second, monthlyInterest, monthlyAmort, monthlyMaintenance, totalMonthly, totalInterest10y };
    }, [price, equity, rate, term]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Kaufpreis (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={100000} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Eigenkapital (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={equity} onChange={e => setEquity(+e.target.value)} min={0} step={10000} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Zinssatz (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rate} onChange={e => setRate(+e.target.value)} min={0.1} max={10} step={0.05} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Amortisation 2. Hyp. (Jahre)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={term} onChange={e => setTerm(+e.target.value)} min={1} max={30} step={1} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Monatliche Gesamtbelastung</span>
                    <span className="ar-custom-calc__result-value">CHF {fmtCHF(res.totalMonthly)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏦</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.mortgage)}</span><span className="ar-custom-calc__card-label">Hypothek total</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">1️⃣</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.first)}</span><span className="ar-custom-calc__card-label">1. Hypothek (≤65%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">2️⃣</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.second)}</span><span className="ar-custom-calc__card-label">2. Hypothek</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtPct(res.belehnungPct)}</span><span className="ar-custom-calc__card-label">Belehnung</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Monatliche Aufschlüsselung</h3>
                    <div className="ar-custom-calc__milestone"><span>Hypothekarzinsen</span><span>CHF {fmtCHF(res.monthlyInterest)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Amortisation 2. Hypothek</span><span>CHF {fmtCHF(res.monthlyAmort)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Nebenkosten (1%/Jahr)</span><span>CHF {fmtCHF(res.monthlyMaintenance)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Total monatlich</span><span>CHF {fmtCHF(res.totalMonthly)}</span></div>
                </div>
                <p className="ar-custom-calc__note">Gesamte Zinskosten über 10 Jahre: CHF {fmtCHF(res.totalInterest10y)}</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 2. Tragbarkeitsrechner — Affordability Calculator
// Uses Swiss 33% rule with 5% calc rate
// ═══════════════════════════════════════════════════
function AffordabilityCalc() {
    const [income, setIncome] = useState(150000);
    const [equity, setEquity] = useState(200000);
    const CALC_RATE = 0.05;
    const MAINT_RATE = 0.01;
    const AMORT_RATE = 0.01;

    const res = useMemo(() => {
        const maxCosts = income / 3;
        const costRate = CALC_RATE + MAINT_RATE + AMORT_RATE;
        const maxFromIncome = maxCosts / costRate;
        const maxFromEquity = equity / 0.20;
        const maxPrice = Math.min(maxFromIncome, maxFromEquity);
        const maxMortgage = maxPrice * 0.80;
        const calcInterest = maxMortgage * CALC_RATE;
        const calcAmort = maxMortgage * AMORT_RATE;
        const calcMaint = maxPrice * MAINT_RATE;
        const calcTotal = calcInterest + calcAmort + calcMaint;
        const tragbar = calcTotal <= maxCosts;
        const pctOfIncome = (calcTotal / income) * 100;
        const limitedBy = maxFromIncome <= maxFromEquity ? "Tragbarkeit" : "Eigenkapital";
        return { maxPrice, maxMortgage, calcTotal, tragbar, pctOfIncome, limitedBy, maxCosts };
    }, [income, equity]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Brutto-Haushaltseinkommen (CHF/Jahr)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={income} onChange={e => setIncome(+e.target.value)} min={50000} step={5000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Verfügbares Eigenkapital (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={equity} onChange={e => setEquity(+e.target.value)} min={0} step={10000} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Maximaler Kaufpreis</span>
                    <span className="ar-custom-calc__result-value">CHF {fmtCHF(res.maxPrice)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏦</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.maxMortgage)}</span><span className="ar-custom-calc__card-label">Max. Hypothek</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtPct(res.pctOfIncome)}</span><span className="ar-custom-calc__card-label">Anteil Einkommen</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">{res.tragbar ? "✅" : "❌"}</span><span className="ar-custom-calc__card-value">{res.tragbar ? "Ja" : "Nein"}</span><span className="ar-custom-calc__card-label">Tragbar</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">⚠️</span><span className="ar-custom-calc__card-value">{res.limitedBy}</span><span className="ar-custom-calc__card-label">Limitierender Faktor</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Kalkulatorische Kosten (pro Jahr)</h3>
                    <div className="ar-custom-calc__milestone"><span>Kalk. Zinsen (5%)</span><span>CHF {fmtCHF(res.maxMortgage * 0.05)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Kalk. Amortisation (1%)</span><span>CHF {fmtCHF(res.maxMortgage * 0.01)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Kalk. Nebenkosten (1%)</span><span>CHF {fmtCHF(res.maxPrice * 0.01)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Total kalk. Kosten</span><span>CHF {fmtCHF(res.calcTotal)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Max. erlaubt (33%)</span><span>CHF {fmtCHF(res.maxCosts)}</span></div>
                </div>
                <p className="ar-custom-calc__note">Berechnung mit kalkulatorischem Zinssatz von 5% (Stresstest der Banken).</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 3. Eigenkapital Rechner — Down Payment Calculator
// ═══════════════════════════════════════════════════
function DownPaymentCalc() {
    const [price, setPrice] = useState(800000);
    const [savings, setSavings] = useState(60000);
    const [pillar3a, setPillar3a] = useState(40000);
    const [pillar2, setPillar2] = useState(80000);

    const res = useMemo(() => {
        const required = price * 0.20;
        const hardMin = price * 0.10;
        const hardAvail = savings + pillar3a;
        const softAvail = pillar2;
        const totalAvail = hardAvail + softAvail;
        const gap = Math.max(0, required - totalAvail);
        const hardOk = hardAvail >= hardMin;
        const totalOk = totalAvail >= required;
        const mortgage = price - Math.min(totalAvail, required);
        return { required, hardMin, hardAvail, softAvail, totalAvail, gap, hardOk, totalOk, mortgage };
    }, [price, savings, pillar3a, pillar2]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Kaufpreis (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={100000} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Bankguthaben (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={savings} onChange={e => setSavings(+e.target.value)} min={0} step={5000} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Säule 3a (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={pillar3a} onChange={e => setPillar3a(+e.target.value)} min={0} step={5000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Pensionskasse / 2. Säule (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={pillar2} onChange={e => setPillar2(+e.target.value)} min={0} step={5000} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Eigenkapital-Status</span>
                    <span className="ar-custom-calc__result-value">{res.totalOk && res.hardOk ? "✅ Ausreichend" : "❌ Nicht ausreichend"}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.required)}</span><span className="ar-custom-calc__card-label">Benötigt (20%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏦</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.totalAvail)}</span><span className="ar-custom-calc__card-label">Verfügbar total</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">{res.hardOk ? "✅" : "❌"}</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.hardAvail)}</span><span className="ar-custom-calc__card-label">Hart (≥{fmtCHF(res.hardMin)})</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">{res.gap > 0 ? "⚠️" : "✅"}</span><span className="ar-custom-calc__card-value">{res.gap > 0 ? `CHF ${fmtCHF(res.gap)}` : "Kein Defizit"}</span><span className="ar-custom-calc__card-label">Fehlbetrag</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Aufschlüsselung</h3>
                    <div className="ar-custom-calc__milestone"><span>Bankguthaben (hart)</span><span>CHF {fmtCHF(savings)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Säule 3a (hart)</span><span>CHF {fmtCHF(pillar3a)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Pensionskasse (weich)</span><span>CHF {fmtCHF(pillar2)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Resultierende Hypothek</span><span>CHF {fmtCHF(res.mortgage)}</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 4. Mieten oder Kaufen — Rent vs Buy
// ═══════════════════════════════════════════════════
function RentVsBuyCalc() {
    const [rent, setRent] = useState(2500);
    const [price, setPrice] = useState(900000);
    const [equity, setEquity] = useState(180000);
    const [rate, setRate] = useState(1.5);
    const [years, setYears] = useState(20);

    const res = useMemo(() => {
        const rentIncrease = 0.01;
        const priceIncrease = 0.02;
        const investReturn = 0.04;
        const mortgage = price - equity;
        const monthlyInterest = (mortgage * (rate / 100)) / 12;
        const monthlyMaint = (price * 0.01) / 12;
        const monthlyAmort = (Math.max(0, mortgage - price * 0.65)) / (15 * 12);
        const monthlyCostBuy = monthlyInterest + monthlyMaint + monthlyAmort;
        let totalRent = 0;
        let totalBuy = 0;
        let currentRent = rent;
        for (let y = 0; y < years; y++) {
            totalRent += currentRent * 12;
            totalBuy += monthlyCostBuy * 12;
            currentRent *= (1 + rentIncrease);
        }
        const equityGrowth = equity * Math.pow(1 + investReturn, years) - equity;
        totalRent -= equityGrowth;  // opportunity cost offset
        const propertyValueEnd = price * Math.pow(1 + priceIncrease, years);
        const equityInProperty = propertyValueEnd - (mortgage - monthlyAmort * 12 * Math.min(years, 15));
        const winner = totalRent < totalBuy ? "Mieten" : "Kaufen";
        return { totalRent, totalBuy, monthlyCostBuy, winner, propertyValueEnd, equityInProperty, equityGrowth };
    }, [rent, price, equity, rate, years]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Monatsmiete (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rent} onChange={e => setRent(+e.target.value)} min={500} step={100} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Kaufpreis Liegenschaft (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={100000} step={10000} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Eigenkapital (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={equity} onChange={e => setEquity(+e.target.value)} min={0} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Zinssatz (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rate} onChange={e => setRate(+e.target.value)} min={0.5} max={5} step={0.1} />
                </div>
            </div>
            <div className="ar-custom-calc__input-group">
                <label>Vergleichszeitraum (Jahre)</label>
                <div className="ar-custom-calc__toggle-row">
                    {[10, 20, 30].map(y => (
                        <button key={y} className={`ar-custom-calc__toggle${years === y ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setYears(y)}>{y} Jahre</button>
                    ))}
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Empfehlung über {years} Jahre</span>
                    <span className="ar-custom-calc__result-value">{res.winner} ist günstiger</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏢</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.totalRent)}</span><span className="ar-custom-calc__card-label">Kosten Mieten*</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏠</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.totalBuy)}</span><span className="ar-custom-calc__card-label">Kosten Kaufen</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📈</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.propertyValueEnd)}</span><span className="ar-custom-calc__card-label">Liegenschaftswert</span></div>
                </div>
                <p className="ar-custom-calc__note">*Mietkosten berücksichtigen Anlagerendite des Eigenkapitals (4%/Jahr). Annahmen: Mietanstieg 1%/Jahr, Wertsteigerung Immobilie 2%/Jahr.</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 5. Renditerechner — Property ROI
// ═══════════════════════════════════════════════════
function PropertyRoiCalc() {
    const [price, setPrice] = useState(1200000);
    const [annualRent, setAnnualRent] = useState(48000);
    const [vacancy, setVacancy] = useState(3);
    const [admin, setAdmin] = useState(5);
    const [maint, setMaint] = useState(1);

    const res = useMemo(() => {
        const grossYield = (annualRent / price) * 100;
        const vacancyLoss = annualRent * (vacancy / 100);
        const adminCost = annualRent * (admin / 100);
        const maintCost = price * (maint / 100);
        const netIncome = annualRent - vacancyLoss - adminCost - maintCost;
        const netYield = (netIncome / price) * 100;
        return { grossYield, netYield, netIncome, vacancyLoss, adminCost, maintCost };
    }, [price, annualRent, vacancy, admin, maint]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Kaufpreis (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={100000} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Jahresmieteinnahmen (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={annualRent} onChange={e => setAnnualRent(+e.target.value)} min={0} step={1000} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Leerstand (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={vacancy} onChange={e => setVacancy(+e.target.value)} min={0} max={20} step={0.5} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Verwaltung (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={admin} onChange={e => setAdmin(+e.target.value)} min={0} max={15} step={0.5} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Nettorendite</span>
                    <span className="ar-custom-calc__result-value">{fmtPct(res.netYield)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtPct(res.grossYield)}</span><span className="ar-custom-calc__card-label">Bruttorendite</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.netIncome)}</span><span className="ar-custom-calc__card-label">Nettoertrag/Jahr</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Kostenabzüge</h3>
                    <div className="ar-custom-calc__milestone"><span>Bruttomieteinnahmen</span><span>CHF {fmtCHF(annualRent)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Leerstand ({vacancy}%)</span><span>CHF –{fmtCHF(res.vacancyLoss)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Verwaltung ({admin}%)</span><span>CHF –{fmtCHF(res.adminCost)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Unterhalt ({maint}%)</span><span>CHF –{fmtCHF(res.maintCost)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Nettoertrag</span><span>CHF {fmtCHF(res.netIncome)}</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 6. Amortisationsrechner — Amortization Plan
// ═══════════════════════════════════════════════════
function AmortizationCalc() {
    const [mortgage, setMortgage] = useState(800000);
    const [propertyVal, setPropertyVal] = useState(1000000);
    const [rate, setRate] = useState(1.5);
    const [method, setMethod] = useState<"direct" | "indirect">("indirect");

    const res = useMemo(() => {
        const first = propertyVal * 0.65;
        const second = Math.max(0, mortgage - first);
        const termYears = 15;
        const annualAmort = second / termYears;
        const monthlyAmort = annualAmort / 12;
        const maxPillar3a = 7258; // 2026 max
        const schedule: { year: number; balance: number; interest: number; amort: number }[] = [];
        let bal = mortgage;
        for (let y = 1; y <= termYears; y++) {
            const interest = bal * (rate / 100);
            const amort = method === "direct" ? annualAmort : 0;
            bal -= amort;
            schedule.push({ year: y, balance: Math.max(0, bal), interest, amort });
        }
        const totalInterestDirect = schedule.reduce((s, r) => s + r.interest, 0);
        const totalInterestIndirect = mortgage * (rate / 100) * termYears;
        const taxSavingIndirect = maxPillar3a * 0.30 * termYears; // ~30% marginal rate
        return { first, second, monthlyAmort, annualAmort, maxPillar3a, totalInterestDirect, totalInterestIndirect, taxSavingIndirect, schedule: schedule.slice(0, 5), termYears };
    }, [mortgage, propertyVal, rate, method]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Hypothek total (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={mortgage} onChange={e => setMortgage(+e.target.value)} min={100000} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Verkehrswert (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={propertyVal} onChange={e => setPropertyVal(+e.target.value)} min={100000} step={10000} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Zinssatz (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rate} onChange={e => setRate(+e.target.value)} min={0.5} max={5} step={0.05} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Amortisationsart</label>
                    <div className="ar-custom-calc__toggle-row">
                        <button className={`ar-custom-calc__toggle${method === "direct" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setMethod("direct")}>Direkt</button>
                        <button className={`ar-custom-calc__toggle${method === "indirect" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setMethod("indirect")}>Indirekt (3a)</button>
                    </div>
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">2. Hypothek (Amortisationspflicht)</span>
                    <span className="ar-custom-calc__result-value">CHF {fmtCHF(res.second)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.monthlyAmort)}</span><span className="ar-custom-calc__card-label">Monatl. Amortisation</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(method === "direct" ? res.totalInterestDirect : res.totalInterestIndirect)}</span><span className="ar-custom-calc__card-label">Zinskosten ({res.termYears} J.)</span></div>
                    {method === "indirect" && <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🎁</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.taxSavingIndirect)}</span><span className="ar-custom-calc__card-label">Steuerersparnis 3a</span></div>}
                </div>
                <p className="ar-custom-calc__note">{method === "indirect" ? `Indirekte Amortisation: CHF ${fmtCHF(res.maxPillar3a)}/Jahr in Säule 3a einzahlen (steuerbegünstigt). Hypothek bleibt bestehen → maximaler Zinsabzug.` : `Direkte Amortisation: Hypothek wird regelmässig um CHF ${fmtCHF(res.annualAmort)}/Jahr reduziert. Zinsabzug sinkt mit der Zeit.`}</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 7. Zinsrechner — Interest Comparison
// ═══════════════════════════════════════════════════
function InterestCalc() {
    const [mortgage, setMortgage] = useState(800000);
    const [saronRate, setSaronRate] = useState(1.35);
    const [fixedRate5, setFixedRate5] = useState(1.55);
    const [fixedRate10, setFixedRate10] = useState(1.85);

    const res = useMemo(() => {
        const calcInterest = (m: number, r: number, y: number) => ({ annual: m * (r / 100), total: m * (r / 100) * y, monthly: (m * (r / 100)) / 12 });
        return {
            saron: calcInterest(mortgage, saronRate, 10),
            fixed5: calcInterest(mortgage, fixedRate5, 10),
            fixed10: calcInterest(mortgage, fixedRate10, 10),
        };
    }, [mortgage, saronRate, fixedRate5, fixedRate10]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-group">
                <label>Hypothek (CHF)</label>
                <input type="number" className="ar-custom-calc__number-input" value={mortgage} onChange={e => setMortgage(+e.target.value)} min={100000} step={10000} />
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>SARON-Zins (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={saronRate} onChange={e => setSaronRate(+e.target.value)} min={0.1} max={5} step={0.05} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Fest 5 Jahre (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={fixedRate5} onChange={e => setFixedRate5(+e.target.value)} min={0.1} max={5} step={0.05} />
                </div>
            </div>
            <div className="ar-custom-calc__input-group">
                <label>Fest 10 Jahre (%)</label>
                <input type="number" className="ar-custom-calc__number-input" value={fixedRate10} onChange={e => setFixedRate10(+e.target.value)} min={0.1} max={5} step={0.05} />
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Günstigstes Modell</span>
                    <span className="ar-custom-calc__result-value">{saronRate <= fixedRate5 && saronRate <= fixedRate10 ? "SARON" : fixedRate5 <= fixedRate10 ? "Fest 5J" : "Fest 10J"}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📈</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.saron.monthly)}/Mt.</span><span className="ar-custom-calc__card-label">SARON ({saronRate}%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🔒</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.fixed5.monthly)}/Mt.</span><span className="ar-custom-calc__card-label">Fest 5J ({fixedRate5}%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🔐</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.fixed10.monthly)}/Mt.</span><span className="ar-custom-calc__card-label">Fest 10J ({fixedRate10}%)</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Gesamtzinsen über 10 Jahre</h3>
                    <div className="ar-custom-calc__milestone"><span>SARON</span><span>CHF {fmtCHF(res.saron.total)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Festhypothek 5 Jahre</span><span>CHF {fmtCHF(res.fixed5.total)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Festhypothek 10 Jahre</span><span>CHF {fmtCHF(res.fixed10.total)}</span></div>
                </div>
                <p className="ar-custom-calc__note">SARON-Zinsen können sich verändern. Die Berechnung basiert auf dem aktuellen Satz.</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 8. Kaufnebenkosten Rechner — Closing Costs by Canton
// ═══════════════════════════════════════════════════
const CANTONS: { name: string; tax: number; split: string }[] = [
    { name: "Zürich", tax: 0, split: "–" },
    { name: "Bern", tax: 1.8, split: "50/50" },
    { name: "Luzern", tax: 1.5, split: "Käufer" },
    { name: "Uri", tax: 0, split: "–" },
    { name: "Schwyz", tax: 0, split: "–" },
    { name: "Obwalden", tax: 0, split: "–" },
    { name: "Nidwalden", tax: 0, split: "–" },
    { name: "Glarus", tax: 0, split: "–" },
    { name: "Zug", tax: 0, split: "–" },
    { name: "Freiburg", tax: 1.5, split: "50/50" },
    { name: "Solothurn", tax: 2.2, split: "Käufer" },
    { name: "Basel-Stadt", tax: 3.0, split: "Käufer" },
    { name: "Basel-Landschaft", tax: 2.5, split: "Käufer" },
    { name: "Schaffhausen", tax: 0, split: "–" },
    { name: "Appenzell A.Rh.", tax: 0, split: "–" },
    { name: "Appenzell I.Rh.", tax: 0, split: "–" },
    { name: "St. Gallen", tax: 1.0, split: "Käufer" },
    { name: "Graubünden", tax: 2.0, split: "50/50" },
    { name: "Aargau", tax: 0, split: "–" },
    { name: "Thurgau", tax: 1.0, split: "50/50" },
    { name: "Tessin", tax: 2.5, split: "50/50" },
    { name: "Waadt", tax: 3.3, split: "Käufer" },
    { name: "Wallis", tax: 1.5, split: "50/50" },
    { name: "Neuenburg", tax: 2.2, split: "Käufer" },
    { name: "Genf", tax: 3.0, split: "Käufer" },
    { name: "Jura", tax: 2.0, split: "50/50" },
];

function ClosingCostsCalc() {
    const [price, setPrice] = useState(1000000);
    const [cantonIdx, setCantonIdx] = useState(0);

    const res = useMemo(() => {
        const canton = CANTONS[cantonIdx];
        const handaenderung = price * (canton.tax / 100);
        const notar = price * 0.003;
        const grundbuch = price * 0.002;
        const schuldbrief = price * 0.005;
        const total = handaenderung + notar + grundbuch + schuldbrief;
        const pct = (total / price) * 100;
        return { canton, handaenderung, notar, grundbuch, schuldbrief, total, pct };
    }, [price, cantonIdx]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Kaufpreis (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={100000} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Kanton</label>
                    <select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>
                        {CANTONS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Kaufnebenkosten — {res.canton.name}</span>
                    <span className="ar-custom-calc__result-value">CHF {fmtCHF(res.total)} ({fmtPct(res.pct)})</span>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Kostenaufstellung</h3>
                    <div className="ar-custom-calc__milestone"><span>Handänderungssteuer ({res.canton.tax}%)</span><span>CHF {fmtCHF(res.handaenderung)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Notarkosten (~0.3%)</span><span>CHF {fmtCHF(res.notar)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Grundbuchgebühr (~0.2%)</span><span>CHF {fmtCHF(res.grundbuch)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Schuldbrieferrichtung (~0.5%)</span><span>CHF {fmtCHF(res.schuldbrief)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Total Nebenkosten</span><span>CHF {fmtCHF(res.total)}</span></div>
                </div>
                {res.canton.tax > 0 && <p className="ar-custom-calc__note">Handänderungssteuer trägt: {res.canton.split}</p>}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 9. Belehnungsrechner — LTV Calculator
// ═══════════════════════════════════════════════════
function LtvCalc() {
    const [propertyVal, setPropertyVal] = useState(1000000);
    const [mortgage, setMortgage] = useState(800000);

    const res = useMemo(() => {
        const ltv = (mortgage / propertyVal) * 100;
        const first = Math.min(mortgage, propertyVal * 0.65);
        const second = Math.max(0, mortgage - first);
        const equity = propertyVal - mortgage;
        const equityPct = (equity / propertyVal) * 100;
        const ok = ltv <= 80;
        return { ltv, first, second, equity, equityPct, ok };
    }, [propertyVal, mortgage]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Verkehrswert (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={propertyVal} onChange={e => setPropertyVal(+e.target.value)} min={100000} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Gewünschte Hypothek (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={mortgage} onChange={e => setMortgage(+e.target.value)} min={0} step={10000} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Belehnung (LTV)</span>
                    <span className="ar-custom-calc__result-value">{fmtPct(res.ltv)} {res.ok ? "✅" : "❌ Über 80%"}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">1️⃣</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.first)}</span><span className="ar-custom-calc__card-label">1. Hypothek (≤65%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">2️⃣</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.second)}</span><span className="ar-custom-calc__card-label">2. Hypothek</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.equity)} ({fmtPct(res.equityPct)})</span><span className="ar-custom-calc__card-label">Eigenkapital</span></div>
                </div>
                {res.second > 0 && <p className="ar-custom-calc__note">Die 2. Hypothek (CHF {fmtCHF(res.second)}) muss innerhalb von 15 Jahren oder bis Alter 65 amortisiert werden.</p>}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 10. Eigenheim Budget Rechner
// ═══════════════════════════════════════════════════
function BudgetCalc() {
    const [income, setIncome] = useState(180000);
    const [savings, setSavings] = useState(150000);
    const [pillar3a, setPillar3a] = useState(50000);
    const [pillar2, setPillar2] = useState(100000);

    const res = useMemo(() => {
        const CALC_RATE = 0.05;
        const MAINT_RATE = 0.01;
        const AMORT_RATE = 0.01;
        const totalEquity = savings + pillar3a + pillar2;
        const hardEquity = savings + pillar3a;
        const maxCosts = income / 3;
        const costRate = CALC_RATE + MAINT_RATE + AMORT_RATE;
        const fromTragbarkeit = maxCosts / costRate;
        const fromEquity20 = totalEquity / 0.20;
        const fromHard10 = hardEquity / 0.10;
        const maxPrice = Math.min(fromTragbarkeit, fromEquity20, fromHard10);
        const mortgage = maxPrice * 0.80;
        const limitedBy = fromTragbarkeit <= fromEquity20 && fromTragbarkeit <= fromHard10 ? "Tragbarkeit" : fromEquity20 <= fromHard10 ? "Eigenkapital (20%)" : "Hartes Eigenkapital (10%)";
        const monthlyInterest = (mortgage * 0.015) / 12;
        const monthlyAmort = (Math.max(0, mortgage - maxPrice * 0.65)) / (15 * 12);
        const monthlyMaint = (maxPrice * 0.01) / 12;
        const totalMonthly = monthlyInterest + monthlyAmort + monthlyMaint;
        return { maxPrice, mortgage, totalEquity, hardEquity, limitedBy, totalMonthly, maxCosts };
    }, [income, savings, pillar3a, pillar2]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Bruttoeinkommen (CHF/Jahr)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={income} onChange={e => setIncome(+e.target.value)} min={50000} step={5000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Bankguthaben (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={savings} onChange={e => setSavings(+e.target.value)} min={0} step={5000} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Säule 3a (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={pillar3a} onChange={e => setPillar3a(+e.target.value)} min={0} step={5000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Pensionskasse (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={pillar2} onChange={e => setPillar2(+e.target.value)} min={0} step={5000} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Maximales Kaufbudget</span>
                    <span className="ar-custom-calc__result-value">CHF {fmtCHF(res.maxPrice)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏦</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.mortgage)}</span><span className="ar-custom-calc__card-label">Max. Hypothek</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.totalEquity)}</span><span className="ar-custom-calc__card-label">Eigenkapital total</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.totalMonthly)}</span><span className="ar-custom-calc__card-label">Monatl. Kosten (1.5%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">⚠️</span><span className="ar-custom-calc__card-value">{res.limitedBy}</span><span className="ar-custom-calc__card-label">Limitierender Faktor</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Budget-Analyse</h3>
                    <div className="ar-custom-calc__milestone"><span>Max. Wohnkosten (33%)</span><span>CHF {fmtCHF(res.maxCosts)}/Jahr</span></div>
                    <div className="ar-custom-calc__milestone"><span>Hartes Eigenkapital</span><span>CHF {fmtCHF(res.hardEquity)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Weiches Eigenkapital (PK)</span><span>CHF {fmtCHF(pillar2)}</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 11. Steuerrechner — Swiss Tax Overview
// ═══════════════════════════════════════════════════
const TAX_CANTONS = [
    { name: "Zürich", incomeRate: 12.5, steuerfuss: 119, wealthRate: 2.5 },
    { name: "Bern", incomeRate: 15.5, steuerfuss: 153, wealthRate: 3.0 },
    { name: "Luzern", incomeRate: 10.5, steuerfuss: 175, wealthRate: 1.5 },
    { name: "Schwyz", incomeRate: 7.5, steuerfuss: 150, wealthRate: 0.8 },
    { name: "Zug", incomeRate: 6.0, steuerfuss: 82, wealthRate: 0.6 },
    { name: "Basel-Stadt", incomeRate: 19.0, steuerfuss: 100, wealthRate: 6.0 },
    { name: "St. Gallen", incomeRate: 12.0, steuerfuss: 144, wealthRate: 2.0 },
    { name: "Aargau", incomeRate: 11.0, steuerfuss: 112, wealthRate: 1.8 },
    { name: "Genf", incomeRate: 20.0, steuerfuss: 44.5, wealthRate: 7.5 },
    { name: "Waadt", incomeRate: 15.0, steuerfuss: 150, wealthRate: 5.5 },
];

function TaxOverviewCalc() {
    const [income, setIncome] = useState(100000);
    const [cantonIdx, setCantonIdx] = useState(0);
    const [status, setStatus] = useState<"single" | "married">("single");
    const [children, setChildren] = useState(0);

    const res = useMemo(() => {
        const canton = TAX_CANTONS[cantonIdx];
        const ahv = income * 0.064;
        const deductions = 7258 + 4000 + 2600 + (children * 6600);
        const taxable = Math.max(0, income - ahv - deductions);
        const marriedFactor = status === "married" ? 0.82 : 1.0;
        const bundessteuer = Math.min(taxable * 0.04 * marriedFactor, taxable * 0.115);
        const kantonssteuer = taxable * (canton.incomeRate / 100) * marriedFactor;
        const gemeindesteuer = kantonssteuer * (canton.steuerfuss / 100);
        const total = bundessteuer + kantonssteuer + gemeindesteuer;
        const effectiveRate = (total / income) * 100;
        return { canton, taxable, bundessteuer, kantonssteuer, gemeindesteuer, total, effectiveRate, deductions, ahv };
    }, [income, cantonIdx, status, children]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Bruttoeinkommen (CHF/Jahr)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={income} onChange={e => setIncome(+e.target.value)} min={20000} step={5000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Kanton</label>
                    <select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>
                        {TAX_CANTONS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Zivilstand</label>
                    <div className="ar-custom-calc__toggle-row">
                        <button className={`ar-custom-calc__toggle${status === "single" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("single")}>Ledig</button>
                        <button className={`ar-custom-calc__toggle${status === "married" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("married")}>Verheiratet</button>
                    </div>
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Kinder</label>
                    <input type="number" className="ar-custom-calc__number-input" value={children} onChange={e => setChildren(+e.target.value)} min={0} max={10} step={1} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Geschätzte Gesamtsteuer — {res.canton.name}</span>
                    <span className="ar-custom-calc__result-value">CHF {fmtCHF(res.total)} ({fmtPct(res.effectiveRate)})</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏛️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.bundessteuer)}</span><span className="ar-custom-calc__card-label">Bundessteuer</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏔️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.kantonssteuer)}</span><span className="ar-custom-calc__card-label">Kantonssteuer</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏘️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.gemeindesteuer)}</span><span className="ar-custom-calc__card-label">Gemeindesteuer</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Berechnung</h3>
                    <div className="ar-custom-calc__milestone"><span>Bruttoeinkommen</span><span>CHF {fmtCHF(income)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– AHV/IV/EO/ALV (6.4%)</span><span>CHF –{fmtCHF(res.ahv)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Abzüge (3a + Berufskosten)</span><span>CHF –{fmtCHF(res.deductions)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Steuerbares Einkommen</span><span>CHF {fmtCHF(res.taxable)}</span></div>
                </div>
                <p className="ar-custom-calc__note">Vereinfachte Berechnung. Die tatsächliche Steuer hängt von der Gemeinde, weiteren Abzügen und dem persönlichen Tarif ab.</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 12. Einkommenssteuer Rechner
// ═══════════════════════════════════════════════════
function IncomeTaxCalc() {
    const [gross, setGross] = useState(120000);
    const [beruf, setBeruf] = useState(4000);
    const [pillar3a, setPillar3a] = useState(7258);
    const [insurance, setInsurance] = useState(2600);
    const [mortgage, setMortgage] = useState(0);
    const [status, setStatus] = useState<"single" | "married">("single");

    const res = useMemo(() => {
        const ahv = gross * 0.064;
        const totalDeductions = beruf + pillar3a + insurance + mortgage;
        const taxable = Math.max(0, gross - ahv - totalDeductions);
        const mf = status === "married" ? 0.82 : 1.0;
        const bund = Math.min(taxable * 0.04 * mf, taxable * 0.115);
        const saved = totalDeductions * 0.25;
        return { ahv, totalDeductions, taxable, bund, saved };
    }, [gross, beruf, pillar3a, insurance, mortgage, status]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Bruttoeinkommen (CHF)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={gross} onChange={e => setGross(+e.target.value)} min={0} step={5000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Zivilstand</label>
                    <div className="ar-custom-calc__toggle-row">
                        <button className={`ar-custom-calc__toggle${status === "single" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("single")}>Ledig</button>
                        <button className={`ar-custom-calc__toggle${status === "married" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("married")}>Verheiratet</button>
                    </div>
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Berufskosten (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={beruf} onChange={e => setBeruf(+e.target.value)} min={0} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Säule 3a (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={pillar3a} onChange={e => setPillar3a(+e.target.value)} min={0} max={7258} step={100} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Versicherungen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={insurance} onChange={e => setInsurance(+e.target.value)} min={0} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Hypothekarzinsen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={mortgage} onChange={e => setMortgage(+e.target.value)} min={0} step={1000} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Steuerbares Einkommen</span>
                    <span className="ar-custom-calc__result-value">CHF {fmtCHF(res.taxable)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📝</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.totalDeductions)}</span><span className="ar-custom-calc__card-label">Total Abzüge</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏛️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.bund)}</span><span className="ar-custom-calc__card-label">Bundessteuer (geschätzt)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.saved)}</span><span className="ar-custom-calc__card-label">Steuerersparnis durch Abzüge</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 13. Vermögenssteuer Rechner
// ═══════════════════════════════════════════════════
function WealthTaxCalc() {
    const [assets, setAssets] = useState(500000);
    const [debts, setDebts] = useState(300000);
    const [cantonIdx, setCantonIdx] = useState(0);
    const [status, setStatus] = useState<"single" | "married">("single");

    const res = useMemo(() => {
        const canton = TAX_CANTONS[cantonIdx];
        const freibetrag = status === "married" ? 154000 : 77000;
        const reinvermoegen = Math.max(0, assets - debts);
        const taxable = Math.max(0, reinvermoegen - freibetrag);
        const tax = taxable * (canton.wealthRate / 1000);
        const gemeinde = tax * (canton.steuerfuss / 100);
        const total = tax + gemeinde;
        return { canton, reinvermoegen, freibetrag, taxable, tax, gemeinde, total };
    }, [assets, debts, cantonIdx, status]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Vermögenswerte (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={assets} onChange={e => setAssets(+e.target.value)} min={0} step={10000} /></div>
                <div className="ar-custom-calc__input-group"><label>Schulden/Hypotheken (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={debts} onChange={e => setDebts(+e.target.value)} min={0} step={10000} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Kanton</label><select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>{TAX_CANTONS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}</select></div>
                <div className="ar-custom-calc__input-group"><label>Zivilstand</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${status === "single" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("single")}>Ledig</button><button className={`ar-custom-calc__toggle${status === "married" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("married")}>Verheiratet</button></div></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Vermögenssteuer — {res.canton.name}</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.total)}</span></div>
                <div className="ar-custom-calc__milestones">
                    <div className="ar-custom-calc__milestone"><span>Reinvermögen</span><span>CHF {fmtCHF(res.reinvermoegen)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Freibetrag</span><span>CHF –{fmtCHF(res.freibetrag)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Steuerbares Vermögen</span><span>CHF {fmtCHF(res.taxable)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Kantonssteuer ({res.canton.wealthRate}‰)</span><span>CHF {fmtCHF(res.tax)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Gemeindesteuer (Steuerfuss {res.canton.steuerfuss}%)</span><span>CHF {fmtCHF(res.gemeinde)}</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 14. Quellensteuer Rechner
// ═══════════════════════════════════════════════════
function WithholdingTaxCalc() {
    const [monthly, setMonthly] = useState(8000);
    const [tariff, setTariff] = useState<"A0" | "B0" | "C0">("A0");
    const [cantonIdx, setCantonIdx] = useState(0);

    const res = useMemo(() => {
        const canton = TAX_CANTONS[cantonIdx];
        const basePct = tariff === "A0" ? canton.incomeRate * 0.85 : tariff === "B0" ? canton.incomeRate * 0.68 : canton.incomeRate * 0.75;
        const monthlyTax = monthly * (basePct / 100);
        const annualTax = monthlyTax * 12;
        const netMonthly = monthly - monthlyTax;
        const effectiveRate = (monthlyTax / monthly) * 100;
        const annual = monthly * 12;
        const needsNOV = annual > 120000;
        return { monthlyTax, annualTax, netMonthly, effectiveRate, annual, needsNOV, basePct };
    }, [monthly, tariff, cantonIdx]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Bruttolohn/Monat (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={monthly} onChange={e => setMonthly(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Kanton</label><select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>{TAX_CANTONS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}</select></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>Tarif</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${tariff === "A0" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setTariff("A0")}>A0 (ledig)</button><button className={`ar-custom-calc__toggle${tariff === "B0" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setTariff("B0")}>B0 (verh. Alleinverd.)</button><button className={`ar-custom-calc__toggle${tariff === "C0" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setTariff("C0")}>C0 (verh. Doppelverd.)</button></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Quellensteuer/Monat</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.monthlyTax)} ({fmtPct(res.effectiveRate)})</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💵</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.netMonthly)}</span><span className="ar-custom-calc__card-label">Nettolohn/Monat</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.annualTax)}</span><span className="ar-custom-calc__card-label">Quellensteuer/Jahr</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">{res.needsNOV ? "⚠️" : "✅"}</span><span className="ar-custom-calc__card-value">{res.needsNOV ? "Ja" : "Nein"}</span><span className="ar-custom-calc__card-label">Ordentl. Veranlagung</span></div>
                </div>
                {res.needsNOV && <p className="ar-custom-calc__note">Jahreseinkommen über CHF 120'000: Nachträgliche ordentliche Veranlagung (NOV) erforderlich.</p>}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 15. Mehrwertsteuer (MWST) Rechner
// ═══════════════════════════════════════════════════
function VatCalcCH() {
    const [amount, setAmount] = useState(1000);
    const [rate, setRate] = useState(8.1);
    const [direction, setDirection] = useState<"net-to-gross" | "gross-to-net">("net-to-gross");

    const res = useMemo(() => {
        if (direction === "net-to-gross") {
            const vat = amount * (rate / 100);
            return { net: amount, vat, gross: amount + vat };
        }
        const net = amount / (1 + rate / 100);
        const vat = amount - net;
        return { net, vat, gross: amount };
    }, [amount, rate, direction]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Betrag (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={amount} onChange={e => setAmount(+e.target.value)} min={0} step={10} /></div>
                <div className="ar-custom-calc__input-group"><label>MWST-Satz</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${rate === 8.1 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setRate(8.1)}>Normal 8.1%</button><button className={`ar-custom-calc__toggle${rate === 2.6 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setRate(2.6)}>Reduziert 2.6%</button><button className={`ar-custom-calc__toggle${rate === 3.8 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setRate(3.8)}>Sonder 3.8%</button></div></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>Richtung</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${direction === "net-to-gross" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setDirection("net-to-gross")}>Netto → Brutto</button><button className={`ar-custom-calc__toggle${direction === "gross-to-net" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setDirection("gross-to-net")}>Brutto → Netto</button></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">MWST-Betrag ({rate}%)</span><span className="ar-custom-calc__result-value">CHF {res.vat.toFixed(2)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📄</span><span className="ar-custom-calc__card-value">CHF {res.net.toFixed(2)}</span><span className="ar-custom-calc__card-label">Nettobetrag</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {res.gross.toFixed(2)}</span><span className="ar-custom-calc__card-label">Bruttobetrag</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 16. Steuervergleich Kantone
// ═══════════════════════════════════════════════════
function TaxCompareCalc() {
    const [income, setIncome] = useState(120000);
    const [status, setStatus] = useState<"single" | "married">("single");

    const res = useMemo(() => {
        const mf = status === "married" ? 0.82 : 1.0;
        const ahv = income * 0.064;
        const deductions = 13858;
        const taxable = Math.max(0, income - ahv - deductions);
        return TAX_CANTONS.map(c => {
            const bund = Math.min(taxable * 0.04 * mf, taxable * 0.115);
            const kanton = taxable * (c.incomeRate / 100) * mf;
            const gemeinde = kanton * (c.steuerfuss / 100);
            const total = bund + kanton + gemeinde;
            return { name: c.name, total, pct: (total / income) * 100 };
        }).sort((a, b) => a.total - b.total);
    }, [income, status]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Bruttoeinkommen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={income} onChange={e => setIncome(+e.target.value)} min={20000} step={5000} /></div>
                <div className="ar-custom-calc__input-group"><label>Zivilstand</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${status === "single" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("single")}>Ledig</button><button className={`ar-custom-calc__toggle${status === "married" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("married")}>Verheiratet</button></div></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Steuervergleich — {res.length} Kantone</span><span className="ar-custom-calc__result-value">Differenz: CHF {fmtCHF(res[res.length - 1].total - res[0].total)}</span></div>
                <div className="ar-custom-calc__milestones">
                    <h3>Ranking (günstigster zuerst)</h3>
                    {res.map((c, i) => <div key={i} className={`ar-custom-calc__milestone${i === 0 ? " ar-custom-calc__milestone--highlight" : ""}`}><span>{i + 1}. {c.name}</span><span>CHF {fmtCHF(c.total)} ({fmtPct(c.pct)})</span></div>)}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 17. Kapitalgewinnsteuer — Capital Gains (Property)
// ═══════════════════════════════════════════════════
function CapitalGainsCalc() {
    const [purchase, setPurchase] = useState(800000);
    const [sale, setSale] = useState(1200000);
    const [improvements, setImprovements] = useState(50000);
    const [years, setYears] = useState(10);

    const res = useMemo(() => {
        const costs = purchase + improvements + purchase * 0.03;
        const gain = Math.max(0, sale - costs);
        let discount = 0;
        if (years >= 25) discount = 0.6;
        else if (years >= 20) discount = 0.4;
        else if (years >= 15) discount = 0.25;
        else if (years >= 10) discount = 0.1;
        else if (years < 2) discount = -0.5;
        else if (years < 5) discount = -0.2;
        const effectiveGain = gain * (1 - discount);
        const baseRate = effectiveGain > 200000 ? 0.25 : effectiveGain > 100000 ? 0.20 : 0.15;
        const tax = effectiveGain * baseRate;
        const netProfit = gain - tax;
        return { gain, discount, effectiveGain, tax, netProfit, baseRate, costs };
    }, [purchase, sale, improvements, years]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Kaufpreis (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={purchase} onChange={e => setPurchase(+e.target.value)} min={10000} step={10000} /></div>
                <div className="ar-custom-calc__input-group"><label>Verkaufspreis (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={sale} onChange={e => setSale(+e.target.value)} min={10000} step={10000} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Wertverm. Investitionen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={improvements} onChange={e => setImprovements(+e.target.value)} min={0} step={5000} /></div>
                <div className="ar-custom-calc__input-group"><label>Haltedauer (Jahre)</label><input type="number" className="ar-custom-calc__number-input" value={years} onChange={e => setYears(+e.target.value)} min={0} max={50} step={1} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Grundstückgewinnsteuer (geschätzt)</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.tax)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📈</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.gain)}</span><span className="ar-custom-calc__card-label">Bruttogewinn</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">{res.discount >= 0 ? "🎁" : "⚠️"}</span><span className="ar-custom-calc__card-value">{res.discount >= 0 ? `-${(res.discount * 100).toFixed(0)}%` : `+${(Math.abs(res.discount) * 100).toFixed(0)}%`}</span><span className="ar-custom-calc__card-label">{res.discount >= 0 ? "Ermässigung" : "Zuschlag"}</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.netProfit)}</span><span className="ar-custom-calc__card-label">Nettogewinn</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 18. Unternehmenssteuer Rechner
// ═══════════════════════════════════════════════════
const CORP_TAX = [
    { name: "Zug", rate: 11.9 }, { name: "Luzern", rate: 12.2 }, { name: "Nidwalden", rate: 12.0 },
    { name: "Schwyz", rate: 14.1 }, { name: "Zürich", rate: 19.7 }, { name: "Bern", rate: 21.0 },
    { name: "Basel-Stadt", rate: 13.0 }, { name: "Genf", rate: 14.0 }, { name: "Waadt", rate: 14.0 }, { name: "St. Gallen", rate: 14.5 },
];

function CorporateTaxCalc() {
    const [profit, setProfit] = useState(500000);
    const [capital, setCapital] = useState(100000);
    const [cantonIdx, setCantonIdx] = useState(0);

    const res = useMemo(() => {
        const c = CORP_TAX[cantonIdx];
        const bund = profit * 0.085;
        const cantonGemeinde = profit * ((c.rate - 8.5) / 100);
        const total = profit * (c.rate / 100);
        const capitalTax = capital * 0.002;
        const grandTotal = total + capitalTax;
        const netProfit = profit - grandTotal;
        return { c, bund, cantonGemeinde, total, capitalTax, grandTotal, netProfit };
    }, [profit, capital, cantonIdx]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Reingewinn (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={profit} onChange={e => setProfit(+e.target.value)} min={0} step={10000} /></div>
                <div className="ar-custom-calc__input-group"><label>Eigenkapital (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={capital} onChange={e => setCapital(+e.target.value)} min={20000} step={10000} /></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>Kanton</label><select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>{CORP_TAX.map((c, i) => <option key={i} value={i}>{c.name} ({c.rate}%)</option>)}</select></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Gesamtsteuer — {res.c.name}</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.grandTotal)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏛️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.bund)}</span><span className="ar-custom-calc__card-label">Bundessteuer (8.5%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏔️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.cantonGemeinde)}</span><span className="ar-custom-calc__card-label">Kantons-/Gemeindesteuer</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.netProfit)}</span><span className="ar-custom-calc__card-label">Verbleibender Gewinn</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 19. Steuerabzug Rechner
// ═══════════════════════════════════════════════════
function TaxDeductionsCalc() {
    const [pillar3a, setPillar3a] = useState(7258);
    const [beruf, setBeruf] = useState(4000);
    const [fahr, setFahr] = useState(3200);
    const [versicherung, setVersicherung] = useState(2600);
    const [hypZins, setHypZins] = useState(12000);
    const [unterhalt, setUnterhalt] = useState(0);
    const [kinder, setKinder] = useState(0);
    const [marginalRate, setMarginalRate] = useState(30);

    const res = useMemo(() => {
        const kinderabzug = kinder * 6600;
        const total = pillar3a + beruf + fahr + versicherung + hypZins + unterhalt + kinderabzug;
        const saving = total * (marginalRate / 100);
        return { total, saving, kinderabzug };
    }, [pillar3a, beruf, fahr, versicherung, hypZins, unterhalt, kinder, marginalRate]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Säule 3a (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={pillar3a} onChange={e => setPillar3a(+e.target.value)} min={0} max={7258} step={100} /></div>
                <div className="ar-custom-calc__input-group"><label>Berufskosten (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={beruf} onChange={e => setBeruf(+e.target.value)} min={0} step={500} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Fahrkosten (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={fahr} onChange={e => setFahr(+e.target.value)} min={0} step={200} /></div>
                <div className="ar-custom-calc__input-group"><label>Versicherungen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={versicherung} onChange={e => setVersicherung(+e.target.value)} min={0} step={200} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Hypothekarzinsen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={hypZins} onChange={e => setHypZins(+e.target.value)} min={0} step={1000} /></div>
                <div className="ar-custom-calc__input-group"><label>Liegenschaftsunterhalt (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={unterhalt} onChange={e => setUnterhalt(+e.target.value)} min={0} step={1000} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Kinder</label><input type="number" className="ar-custom-calc__number-input" value={kinder} onChange={e => setKinder(+e.target.value)} min={0} max={10} step={1} /></div>
                <div className="ar-custom-calc__input-group"><label>Grenzsteuersatz (%)</label><input type="number" className="ar-custom-calc__number-input" value={marginalRate} onChange={e => setMarginalRate(+e.target.value)} min={5} max={45} step={1} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Gesamte Steuerersparnis</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.saving)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📝</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.total)}</span><span className="ar-custom-calc__card-label">Total Abzüge</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.saving)}</span><span className="ar-custom-calc__card-label">Steuerersparnis ({marginalRate}%)</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Einzelne Abzüge</h3>
                    <div className="ar-custom-calc__milestone"><span>Säule 3a</span><span>CHF {fmtCHF(pillar3a)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Berufskosten</span><span>CHF {fmtCHF(beruf)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Fahrkosten</span><span>CHF {fmtCHF(fahr)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>Hypothekarzinsen</span><span>CHF {fmtCHF(hypZins)}</span></div>
                    {kinder > 0 && <div className="ar-custom-calc__milestone"><span>Kinderabzug ({kinder} Kinder)</span><span>CHF {fmtCHF(res.kinderabzug)}</span></div>}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 20. Steueroptimierung Rechner
// ═══════════════════════════════════════════════════
function TaxOptimizationCalc() {
    const [income, setIncome] = useState(150000);
    const [current3a, setCurrent3a] = useState(0);
    const [pkPotential, setPkPotential] = useState(50000);
    const [hypRemaining, setHypRemaining] = useState(600000);
    const [marginalRate, setMarginalRate] = useState(30);

    const res = useMemo(() => {
        const max3a = 7258;
        const save3a = Math.max(0, max3a - current3a) * (marginalRate / 100);
        const savePk = pkPotential * (marginalRate / 100);
        const saveHyp = hypRemaining * 0.015 * (marginalRate / 100);
        const totalPotential = save3a + savePk + saveHyp;
        return { max3a, gap3a: Math.max(0, max3a - current3a), save3a, savePk, saveHyp, totalPotential };
    }, [income, current3a, pkPotential, hypRemaining, marginalRate]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Bruttoeinkommen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={income} onChange={e => setIncome(+e.target.value)} min={50000} step={5000} /></div>
                <div className="ar-custom-calc__input-group"><label>Grenzsteuersatz (%)</label><input type="number" className="ar-custom-calc__number-input" value={marginalRate} onChange={e => setMarginalRate(+e.target.value)} min={5} max={45} step={1} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Aktuelle 3a-Einzahlung (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={current3a} onChange={e => setCurrent3a(+e.target.value)} min={0} max={7258} step={100} /></div>
                <div className="ar-custom-calc__input-group"><label>PK-Einkaufspotenzial (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={pkPotential} onChange={e => setPkPotential(+e.target.value)} min={0} step={5000} /></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>Restliche Hypothek (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={hypRemaining} onChange={e => setHypRemaining(+e.target.value)} min={0} step={10000} /></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Jährliches Optimierungspotenzial</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.totalPotential)}</span></div>
                <div className="ar-custom-calc__milestones">
                    <h3>Optimierungsmöglichkeiten</h3>
                    {res.gap3a > 0 && <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Säule 3a aufstocken (+CHF {fmtCHF(res.gap3a)})</span><span>CHF {fmtCHF(res.save3a)} sparen</span></div>}
                    {pkPotential > 0 && <div className="ar-custom-calc__milestone"><span>PK-Einkauf (CHF {fmtCHF(pkPotential)})</span><span>CHF {fmtCHF(res.savePk)} sparen</span></div>}
                    {hypRemaining > 0 && <div className="ar-custom-calc__milestone"><span>Hypothekar-Zinsabzug</span><span>CHF {fmtCHF(res.saveHyp)} sparen</span></div>}
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Total Ersparnis</span><span>CHF {fmtCHF(res.totalPotential)}/Jahr</span></div>
                </div>
                <p className="ar-custom-calc__note">Basierend auf Grenzsteuersatz {marginalRate}%. Effektive Ersparnis kann je nach Kanton und Gemeinde abweichen.</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 21. Brutto Netto Rechner — Gross to Net
// ═══════════════════════════════════════════════════
function GrossNetCalc() {
    const [gross, setGross] = useState(8000);
    const [age, setAge] = useState(35);
    const [has13, setHas13] = useState(true);

    const res = useMemo(() => {
        const ahv = gross * 0.0435;
        const iv = gross * 0.007;
        const eo = gross * 0.0025;
        const alv = gross * 0.011;
        const bvgRate = age < 25 ? 0 : age < 35 ? 0.07 : age < 45 ? 0.10 : age < 55 ? 0.15 : 0.18;
        const bvg = gross * bvgRate;
        const nbu = gross * 0.013;
        const totalDeductions = ahv + iv + eo + alv + bvg + nbu;
        const net = gross - totalDeductions;
        const annual = has13 ? gross * 13 : gross * 12;
        const annualNet = has13 ? net * 13 : net * 12;
        return { ahv, iv, eo, alv, bvg, nbu, totalDeductions, net, annual, annualNet, bvgRate: bvgRate * 100 };
    }, [gross, age, has13]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Bruttolohn/Monat (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={gross} onChange={e => setGross(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Alter</label><input type="number" className="ar-custom-calc__number-input" value={age} onChange={e => setAge(+e.target.value)} min={18} max={65} step={1} /></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>13. Monatslohn</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${has13 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setHas13(true)}>Ja (× 13)</button><button className={`ar-custom-calc__toggle${!has13 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setHas13(false)}>Nein (× 12)</button></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Nettolohn/Monat</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.net)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtPct((res.net / gross) * 100)}</span><span className="ar-custom-calc__card-label">Netto-Quote</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.annualNet)}</span><span className="ar-custom-calc__card-label">Jahresnetto</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💸</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.totalDeductions)}</span><span className="ar-custom-calc__card-label">Total Abzüge/Mt.</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Lohnabrechnung</h3>
                    <div className="ar-custom-calc__milestone"><span>Bruttolohn</span><span>CHF {fmtCHF(gross)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– AHV (4.35%)</span><span>–CHF {fmtCHF(res.ahv)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– IV (0.70%)</span><span>–CHF {fmtCHF(res.iv)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– EO (0.25%)</span><span>–CHF {fmtCHF(res.eo)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– ALV (1.10%)</span><span>–CHF {fmtCHF(res.alv)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– BVG ({fmtPct(res.bvgRate)})</span><span>–CHF {fmtCHF(res.bvg)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– NBU (1.30%)</span><span>–CHF {fmtCHF(res.nbu)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Nettolohn</span><span>CHF {fmtCHF(res.net)}</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 22. Nettolohn Rechner — Net to Gross (reverse)
// ═══════════════════════════════════════════════════
function NetSalaryCalc() {
    const [desired, setDesired] = useState(6500);
    const [age, setAge] = useState(35);

    const res = useMemo(() => {
        const bvgRate = age < 25 ? 0 : age < 35 ? 0.07 : age < 45 ? 0.10 : age < 55 ? 0.15 : 0.18;
        const totalRate = 0.0435 + 0.007 + 0.0025 + 0.011 + bvgRate + 0.013;
        const gross = desired / (1 - totalRate);
        const deductions = gross - desired;
        return { gross, deductions, totalRate: totalRate * 100, bvgRate: bvgRate * 100 };
    }, [desired, age]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Gewünschter Nettolohn (CHF/Mt.)</label><input type="number" className="ar-custom-calc__number-input" value={desired} onChange={e => setDesired(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Alter</label><input type="number" className="ar-custom-calc__number-input" value={age} onChange={e => setAge(+e.target.value)} min={18} max={65} step={1} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Benötigter Bruttolohn</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.gross)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💵</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(desired)}</span><span className="ar-custom-calc__card-label">Nettolohn</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💸</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.deductions)}</span><span className="ar-custom-calc__card-label">Abzüge/Monat</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtPct(res.totalRate)}</span><span className="ar-custom-calc__card-label">Gesamtabzugsrate</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 23. Stundenlohn Rechner
// ═══════════════════════════════════════════════════
function HourlyRateCalc() {
    const [monthly, setMonthly] = useState(7000);
    const [weeklyHours, setWeeklyHours] = useState(42);
    const [vacWeeks, setVacWeeks] = useState(4);

    const res = useMemo(() => {
        const monthlyHours = (weeklyHours * 52) / 12;
        const hourly = monthly / monthlyHours;
        const vacPct = vacWeeks / (52 - vacWeeks);
        const hourlyWithVac = hourly * (1 + vacPct);
        const annualHours = weeklyHours * (52 - vacWeeks);
        return { monthlyHours, hourly, vacPct: vacPct * 100, hourlyWithVac, annualHours };
    }, [monthly, weeklyHours, vacWeeks]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Monatslohn (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={monthly} onChange={e => setMonthly(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Wochenstunden</label><input type="number" className="ar-custom-calc__number-input" value={weeklyHours} onChange={e => setWeeklyHours(+e.target.value)} min={20} max={50} step={0.5} /></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>Ferienanspruch (Wochen)</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${vacWeeks === 4 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setVacWeeks(4)}>4 Wochen</button><button className={`ar-custom-calc__toggle${vacWeeks === 5 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setVacWeeks(5)}>5 Wochen</button><button className={`ar-custom-calc__toggle${vacWeeks === 6 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setVacWeeks(6)}>6 Wochen</button></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Stundenlohn</span><span className="ar-custom-calc__result-value">CHF {res.hourly.toFixed(2)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏖️</span><span className="ar-custom-calc__card-value">CHF {res.hourlyWithVac.toFixed(2)}</span><span className="ar-custom-calc__card-label">Inkl. Ferienzuschlag ({fmtPct(res.vacPct)})</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🕐</span><span className="ar-custom-calc__card-value">{res.monthlyHours.toFixed(1)}h</span><span className="ar-custom-calc__card-label">Ø Stunden/Monat</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">{fmtCHF(res.annualHours)}h</span><span className="ar-custom-calc__card-label">Arbeitsstunden/Jahr</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 24. Monatslohn Rechner
// ═══════════════════════════════════════════════════
function MonthlySalaryCalc() {
    const [annual, setAnnual] = useState(100000);
    const [has13, setHas13] = useState(true);
    const [pensum, setPensum] = useState(100);

    const res = useMemo(() => {
        const divisor = has13 ? 13 : 12;
        const fullTime = annual / divisor;
        const partTime = fullTime * (pensum / 100);
        const annualPartTime = partTime * divisor;
        return { fullTime, partTime, annualPartTime, divisor };
    }, [annual, has13, pensum]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Jahreslohn (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={annual} onChange={e => setAnnual(+e.target.value)} min={10000} step={5000} /></div>
                <div className="ar-custom-calc__input-group"><label>Pensum (%)</label><input type="number" className="ar-custom-calc__number-input" value={pensum} onChange={e => setPensum(+e.target.value)} min={10} max={100} step={10} /></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>13. Monatslohn</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${has13 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setHas13(true)}>Ja (÷ 13)</button><button className={`ar-custom-calc__toggle${!has13 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setHas13(false)}>Nein (÷ 12)</button></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Monatslohn ({pensum}%)</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.partTime)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💼</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.fullTime)}</span><span className="ar-custom-calc__card-label">Vollzeit-Monatslohn</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.annualPartTime)}</span><span className="ar-custom-calc__card-label">Jahreslohn ({pensum}%)</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 25. Jahreslohn Rechner
// ═══════════════════════════════════════════════════
function AnnualSalaryCalc() {
    const [monthly, setMonthly] = useState(8000);
    const [has13, setHas13] = useState(true);
    const [bonus, setBonus] = useState(0);

    const res = useMemo(() => {
        const base = has13 ? monthly * 13 : monthly * 12;
        const total = base + bonus;
        const agCosts = total * 1.17;
        const agExtra = agCosts - total;
        return { base, total, agCosts, agExtra };
    }, [monthly, has13, bonus]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Monatslohn (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={monthly} onChange={e => setMonthly(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Jährlicher Bonus (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={bonus} onChange={e => setBonus(+e.target.value)} min={0} step={1000} /></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>13. Monatslohn</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${has13 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setHas13(true)}>Ja (× 13)</button><button className={`ar-custom-calc__toggle${!has13 ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setHas13(false)}>Nein (× 12)</button></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Jahreslohn (Total)</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.total)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💼</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.base)}</span><span className="ar-custom-calc__card-label">Grundlohn/Jahr</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏢</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.agCosts)}</span><span className="ar-custom-calc__card-label">Arbeitgeberkosten</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💸</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.agExtra)}</span><span className="ar-custom-calc__card-label">AG-Sozialabgaben (~17%)</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 26. Freelancer Einkommen Rechner
// ═══════════════════════════════════════════════════
function FreelancerCalc() {
    const [revenue, setRevenue] = useState(150000);
    const [expenses, setExpenses] = useState(20000);
    const [pillar3a, setPillar3a] = useState(7258);
    const [cantonIdx, setCantonIdx] = useState(0);

    const res = useMemo(() => {
        const net = revenue - expenses;
        const ahvRate = net <= 57400 ? 0.10 : 0.05371;
        const ahv = net * ahvRate;
        const pillar3aMax = Math.min(36288, net * 0.20);
        const actual3a = Math.min(pillar3a, pillar3aMax);
        const taxable = net - ahv - actual3a;
        const canton = TAX_CANTONS[cantonIdx];
        const tax = taxable * ((canton.incomeRate + 4) / 100);
        const finalNet = net - ahv - tax;
        const mwstRequired = revenue > 100000;
        const hourly = finalNet / 1700;
        return { net, ahv, ahvRate: ahvRate * 100, taxable, tax, finalNet, mwstRequired, hourly, pillar3aMax, actual3a };
    }, [revenue, expenses, pillar3a, cantonIdx]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Jahresumsatz (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={revenue} onChange={e => setRevenue(+e.target.value)} min={10000} step={5000} /></div>
                <div className="ar-custom-calc__input-group"><label>Berufsauslagen (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={expenses} onChange={e => setExpenses(+e.target.value)} min={0} step={1000} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Säule 3a (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={pillar3a} onChange={e => setPillar3a(+e.target.value)} min={0} max={36288} step={100} /></div>
                <div className="ar-custom-calc__input-group"><label>Kanton</label><select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>{TAX_CANTONS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}</select></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Nettoeinkommen (nach Steuern)</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.finalNet)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🧾</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.ahv)}</span><span className="ar-custom-calc__card-label">AHV/IV/EO ({fmtPct(res.ahvRate)})</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏛️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.tax)}</span><span className="ar-custom-calc__card-label">Steuern (geschätzt)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">{res.mwstRequired ? "⚠️" : "✅"}</span><span className="ar-custom-calc__card-value">{res.mwstRequired ? "Ja" : "Nein"}</span><span className="ar-custom-calc__card-label">MWST-Pflicht</span></div>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>Kalkulation</h3>
                    <div className="ar-custom-calc__milestone"><span>Umsatz</span><span>CHF {fmtCHF(revenue)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Berufsauslagen</span><span>–CHF {fmtCHF(expenses)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>= Nettoeinkommen</span><span>CHF {fmtCHF(res.net)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– AHV/IV/EO</span><span>–CHF {fmtCHF(res.ahv)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Steuern</span><span>–CHF {fmtCHF(res.tax)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Verfügbar</span><span>CHF {fmtCHF(res.finalNet)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>≈ Stundenlohn (1'700h)</span><span>CHF {res.hourly.toFixed(2)}/h</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 27. Quellensteuer Lohn Rechner
// ═══════════════════════════════════════════════════
function PayrollWithholdingCalc() {
    const [gross, setGross] = useState(7500);
    const [tariff, setTariff] = useState<"A0" | "B0" | "B2" | "C0">("A0");
    const [cantonIdx, setCantonIdx] = useState(0);

    const res = useMemo(() => {
        const canton = TAX_CANTONS[cantonIdx];
        const sozial = gross * 0.064;
        const bvg = gross * 0.10;
        const nbu = gross * 0.013;
        const tariffMulti = tariff === "A0" ? 0.85 : tariff === "B0" ? 0.68 : tariff === "B2" ? 0.55 : 0.75;
        const qst = gross * (canton.incomeRate * tariffMulti / 100);
        const totalDeductions = sozial + bvg + nbu + qst;
        const net = gross - totalDeductions;
        return { sozial, bvg, nbu, qst, totalDeductions, net };
    }, [gross, tariff, cantonIdx]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Bruttolohn/Monat (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={gross} onChange={e => setGross(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Kanton</label><select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>{TAX_CANTONS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}</select></div>
            </div>
            <div className="ar-custom-calc__input-group"><label>Tarif</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${tariff === "A0" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setTariff("A0")}>A0 (ledig)</button><button className={`ar-custom-calc__toggle${tariff === "B0" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setTariff("B0")}>B0 (verh.)</button><button className={`ar-custom-calc__toggle${tariff === "B2" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setTariff("B2")}>B2 (verh. 2K)</button><button className={`ar-custom-calc__toggle${tariff === "C0" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setTariff("C0")}>C0 (Doppel)</button></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Nettolohn (nach QST + Sozial)</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.net)}</span></div>
                <div className="ar-custom-calc__milestones">
                    <div className="ar-custom-calc__milestone"><span>Bruttolohn</span><span>CHF {fmtCHF(gross)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– AHV/IV/EO/ALV (6.4%)</span><span>–CHF {fmtCHF(res.sozial)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– BVG (~10%)</span><span>–CHF {fmtCHF(res.bvg)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– NBU (1.3%)</span><span>–CHF {fmtCHF(res.nbu)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Quellensteuer ({tariff})</span><span>–CHF {fmtCHF(res.qst)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Nettolohn</span><span>CHF {fmtCHF(res.net)}</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 28. Bonus Rechner
// ═══════════════════════════════════════════════════
function BonusCalc() {
    const [bonusGross, setBonusGross] = useState(20000);
    const [marginalRate, setMarginalRate] = useState(30);

    const res = useMemo(() => {
        const ahvIvEoAlv = bonusGross * 0.064;
        const netBeforeTax = bonusGross - ahvIvEoAlv;
        const taxOnBonus = bonusGross * (marginalRate / 100);
        const netAfterTax = bonusGross - ahvIvEoAlv - taxOnBonus;
        const effectiveRate = ((ahvIvEoAlv + taxOnBonus) / bonusGross) * 100;
        const save3a = Math.min(7258, bonusGross) * (marginalRate / 100);
        return { ahvIvEoAlv, netBeforeTax, taxOnBonus, netAfterTax, effectiveRate, save3a };
    }, [bonusGross, marginalRate]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Bonus brutto (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={bonusGross} onChange={e => setBonusGross(+e.target.value)} min={0} step={1000} /></div>
                <div className="ar-custom-calc__input-group"><label>Grenzsteuersatz (%)</label><input type="number" className="ar-custom-calc__number-input" value={marginalRate} onChange={e => setMarginalRate(+e.target.value)} min={5} max={45} step={1} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Netto-Bonus (nach Sozial + Steuern)</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.netAfterTax)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🧾</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.ahvIvEoAlv)}</span><span className="ar-custom-calc__card-label">Sozialabgaben (6.4%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏛️</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.taxOnBonus)}</span><span className="ar-custom-calc__card-label">Steuern ({marginalRate}%)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🎯</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.save3a)}</span><span className="ar-custom-calc__card-label">Sparpotenzial (3a)</span></div>
                </div>
                <p className="ar-custom-calc__note">Tipp: Investieren Sie den Bonus in die Säule 3a (max. CHF 7'258) — das spart CHF {fmtCHF(res.save3a)} Steuern!</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 29. Überstunden Rechner
// ═══════════════════════════════════════════════════
function OvertimeCalc() {
    const [monthly, setMonthly] = useState(7000);
    const [weeklyHours, setWeeklyHours] = useState(42);
    const [overtimeHours, setOvertimeHours] = useState(10);
    const [isOvertime, setIsOvertime] = useState(true);

    const res = useMemo(() => {
        const monthlyH = (weeklyHours * 52) / 12;
        const hourly = monthly / monthlyH;
        const surcharge = isOvertime ? 1.25 : 1.0;
        const pay = overtimeHours * hourly * surcharge;
        const payNoSurcharge = overtimeHours * hourly;
        const surchargeAmount = pay - payNoSurcharge;
        return { hourly, surcharge, pay, payNoSurcharge, surchargeAmount, monthlyH };
    }, [monthly, weeklyHours, overtimeHours, isOvertime]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Monatslohn (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={monthly} onChange={e => setMonthly(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Wochenstunden (vertragl.)</label><input type="number" className="ar-custom-calc__number-input" value={weeklyHours} onChange={e => setWeeklyHours(+e.target.value)} min={20} max={50} step={0.5} /></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Zusatzstunden (diesen Monat)</label><input type="number" className="ar-custom-calc__number-input" value={overtimeHours} onChange={e => setOvertimeHours(+e.target.value)} min={0} max={50} step={1} /></div>
                <div className="ar-custom-calc__input-group"><label>Art</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${isOvertime ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setIsOvertime(true)}>Überzeit (+25%)</button><button className={`ar-custom-calc__toggle${!isOvertime ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setIsOvertime(false)}>Überstunden (1:1)</button></div></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Vergütung Zusatzstunden</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.pay)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">⏱️</span><span className="ar-custom-calc__card-value">CHF {res.hourly.toFixed(2)}</span><span className="ar-custom-calc__card-label">Stundenlohn</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(res.surchargeAmount)}</span><span className="ar-custom-calc__card-label">Zuschlag</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">CHF {fmtCHF(monthly + res.pay)}</span><span className="ar-custom-calc__card-label">Gesamtlohn diesen Mt.</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// 30. Lohn nach Steuern Rechner
// ═══════════════════════════════════════════════════
function AfterTaxSalaryCalc() {
    const [gross, setGross] = useState(8000);
    const [cantonIdx, setCantonIdx] = useState(0);
    const [status, setStatus] = useState<"single" | "married">("single");
    const [age, setAge] = useState(35);

    const res = useMemo(() => {
        const canton = TAX_CANTONS[cantonIdx];
        const sozial = gross * 0.064;
        const bvgRate = age < 25 ? 0 : age < 35 ? 0.07 : age < 45 ? 0.10 : age < 55 ? 0.15 : 0.18;
        const bvg = gross * bvgRate;
        const nbu = gross * 0.013;
        const netBeforeTax = gross - sozial - bvg - nbu;
        const annual = gross * 12;
        const mf = status === "married" ? 0.82 : 1.0;
        const monthlyTax = (annual * ((canton.incomeRate + 4) / 100) * mf) / 12;
        const afterEverything = netBeforeTax - monthlyTax;
        const effectiveRate = ((gross - afterEverything) / gross) * 100;
        return { sozial, bvg, nbu, netBeforeTax, monthlyTax, afterEverything, effectiveRate };
    }, [gross, cantonIdx, status, age]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Bruttolohn/Monat (CHF)</label><input type="number" className="ar-custom-calc__number-input" value={gross} onChange={e => setGross(+e.target.value)} min={1000} step={500} /></div>
                <div className="ar-custom-calc__input-group"><label>Kanton</label><select className="ar-custom-calc__number-input" value={cantonIdx} onChange={e => setCantonIdx(+e.target.value)}>{TAX_CANTONS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}</select></div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Zivilstand</label><div className="ar-custom-calc__toggle-row"><button className={`ar-custom-calc__toggle${status === "single" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("single")}>Ledig</button><button className={`ar-custom-calc__toggle${status === "married" ? " ar-custom-calc__toggle--active" : ""}`} onClick={() => setStatus("married")}>Verheiratet</button></div></div>
                <div className="ar-custom-calc__input-group"><label>Alter</label><input type="number" className="ar-custom-calc__number-input" value={age} onChange={e => setAge(+e.target.value)} min={18} max={65} step={1} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Verfügbares Einkommen/Monat</span><span className="ar-custom-calc__result-value">CHF {fmtCHF(res.afterEverything)}</span></div>
                <div className="ar-custom-calc__milestones">
                    <h3>Vollständige Lohnrechnung</h3>
                    <div className="ar-custom-calc__milestone"><span>Bruttolohn</span><span>CHF {fmtCHF(gross)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– AHV/IV/EO/ALV</span><span>–CHF {fmtCHF(res.sozial)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– BVG (Pensionskasse)</span><span>–CHF {fmtCHF(res.bvg)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– NBU</span><span>–CHF {fmtCHF(res.nbu)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>= Nettolohn (Auszahlung)</span><span>CHF {fmtCHF(res.netBeforeTax)}</span></div>
                    <div className="ar-custom-calc__milestone"><span>– Einkommenssteuer (monatl.)</span><span>–CHF {fmtCHF(res.monthlyTax)}</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>Verfügbar</span><span>CHF {fmtCHF(res.afterEverything)} ({fmtPct(100 - res.effectiveRate)} vom Brutto)</span></div>
                </div>
            </div>
        </div>
    );
}

// ─── Dispatcher ───
interface Props { calcType: string }

const CUSTOM_CALCS: Record<string, React.FC> = {
    "mortgage": MortgageCalc,
    "affordability": AffordabilityCalc,
    "downpayment": DownPaymentCalc,
    "rent-vs-buy": RentVsBuyCalc,
    "property-roi": PropertyRoiCalc,
    "amortization": AmortizationCalc,
    "interest": InterestCalc,
    "closing-costs": ClosingCostsCalc,
    "ltv": LtvCalc,
    "budget": BudgetCalc,
    // Tax calculators
    "tax-overview": TaxOverviewCalc,
    "income-tax": IncomeTaxCalc,
    "wealth-tax": WealthTaxCalc,
    "withholding-tax": WithholdingTaxCalc,
    "vat": VatCalcCH,
    "tax-compare": TaxCompareCalc,
    "capital-gains": CapitalGainsCalc,
    "corporate-tax": CorporateTaxCalc,
    "tax-deductions": TaxDeductionsCalc,
    "tax-optimization": TaxOptimizationCalc,
    // Salary & Payroll calculators
    "gross-net": GrossNetCalc,
    "net-salary": NetSalaryCalc,
    "hourly-rate": HourlyRateCalc,
    "monthly-salary": MonthlySalaryCalc,
    "annual-salary": AnnualSalaryCalc,
    "freelancer": FreelancerCalc,
    "payroll-withholding": PayrollWithholdingCalc,
    "bonus": BonusCalc,
    "overtime": OvertimeCalc,
    "after-tax-salary": AfterTaxSalaryCalc,
};

export default function ChCustomCalculatorCore({ calcType }: Props) {
    const Comp = CUSTOM_CALCS[calcType];
    if (!Comp) return <p>Rechner nicht gefunden.</p>;
    return <Comp />;
}
