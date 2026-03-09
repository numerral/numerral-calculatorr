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
};

export default function ChCustomCalculatorCore({ calcType }: Props) {
    const Comp = CUSTOM_CALCS[calcType];
    if (!Comp) return <p>Rechner nicht gefunden.</p>;
    return <Comp />;
}
