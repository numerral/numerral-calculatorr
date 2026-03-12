"use client";
import { useState, useMemo } from "react";
import {
    calculateEnterpriseValue,
    calculateEBITDA,
    calculateEBIT,
    calculateWACC,
    calculateCapRate,
    calculateROI,
    calculateCostOfEquity,
    calculateROAS,
    calculateBeta,
    calculateCashBack,
    calculateCurrentRatio,
    calculateNetWorth,
    calculateOpportunityCost,
} from "@/lib/calculators/business";

function fmt(n: number): string {
    if (Math.abs(n) >= 10000000) return "$" + (n / 10000000).toFixed(2) + "Cr";
    if (Math.abs(n) >= 100000) return "$" + (n / 100000).toFixed(2) + "L";
    if (Math.abs(n) >= 1000) return "$" + (n / 1000).toFixed(2) + "K";
    return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtNum(n: number): string {
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// ─── Enterprise Value ───
function EnterpriseValueCalc() {
    const [marketCap, setMarketCap] = useState(5000000);
    const [totalDebt, setTotalDebt] = useState(1000000);
    const [cash, setCash] = useState(500000);
    const [ebitda, setEbitda] = useState(800000);

    const result = useMemo(() => calculateEnterpriseValue(marketCap, totalDebt, cash, ebitda), [marketCap, totalDebt, cash, ebitda]);

    return (
        <div className="calc-card">
            <div className="calc-field">
                <label className="calc-field__label">🏛️ MARKET CAPITALIZATION</label>
                <input type="range" className="calc-field__slider" min={100000} max={100000000} step={100000} value={marketCap} onChange={(e) => setMarketCap(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={marketCap} onChange={(e) => setMarketCap(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">💳 TOTAL DEBT</label>
                <input type="range" className="calc-field__slider" min={0} max={50000000} step={100000} value={totalDebt} onChange={(e) => setTotalDebt(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={totalDebt} onChange={(e) => setTotalDebt(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">💵 CASH & EQUIVALENTS</label>
                <input type="range" className="calc-field__slider" min={0} max={50000000} step={100000} value={cash} onChange={(e) => setCash(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={cash} onChange={(e) => setCash(Number(e.target.value))} />
            </div>
            <div className="calc-field">
                <label className="calc-field__label">📊 EBITDA (for EV/EBITDA ratio)</label>
                <input type="range" className="calc-field__slider" min={10000} max={20000000} step={10000} value={ebitda} onChange={(e) => setEbitda(Number(e.target.value))} />
                <input type="number" className="calc-field__input" value={ebitda} onChange={(e) => setEbitda(Number(e.target.value))} />
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">ENTERPRISE VALUE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{fmt(result.enterpriseValue)}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">MARKET CAP</p><p style={{ fontWeight: 700 }}>{fmt(result.marketCap)}</p></div>
                    <div><p className="calc-field__label">+ DEBT</p><p style={{ fontWeight: 700, color: "var(--n-danger, #e74c3c)" }}>{fmt(result.totalDebt)}</p></div>
                    <div><p className="calc-field__label">− CASH</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmt(result.cash)}</p></div>
                </div>
                {result.evToEbitda !== undefined && (
                    <p style={{ marginTop: "var(--s-3)", fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                        EV/EBITDA Multiple: <strong style={{ color: "var(--n-primary)" }}>{result.evToEbitda}×</strong>
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── EBITDA ───
function EBITDACalc() {
    const [netIncome, setNetIncome] = useState(500000);
    const [interest, setInterest] = useState(50000);
    const [taxes, setTaxes] = useState(150000);
    const [depreciation, setDepreciation] = useState(80000);
    const [amortization, setAmortization] = useState(20000);
    const [revenue, setRevenue] = useState(2000000);

    const result = useMemo(() => calculateEBITDA(netIncome, interest, taxes, depreciation, amortization, revenue), [netIncome, interest, taxes, depreciation, amortization, revenue]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">💰 NET INCOME</label><input type="range" className="calc-field__slider" min={0} max={50000000} step={10000} value={netIncome} onChange={(e) => setNetIncome(Number(e.target.value))} /><input type="number" className="calc-field__input" value={netIncome} onChange={(e) => setNetIncome(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">🏦 INTEREST EXPENSE</label><input type="range" className="calc-field__slider" min={0} max={10000000} step={5000} value={interest} onChange={(e) => setInterest(Number(e.target.value))} /><input type="number" className="calc-field__input" value={interest} onChange={(e) => setInterest(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">🧾 TAXES</label><input type="range" className="calc-field__slider" min={0} max={10000000} step={5000} value={taxes} onChange={(e) => setTaxes(Number(e.target.value))} /><input type="number" className="calc-field__input" value={taxes} onChange={(e) => setTaxes(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📉 DEPRECIATION</label><input type="range" className="calc-field__slider" min={0} max={5000000} step={5000} value={depreciation} onChange={(e) => setDepreciation(Number(e.target.value))} /><input type="number" className="calc-field__input" value={depreciation} onChange={(e) => setDepreciation(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📄 AMORTIZATION</label><input type="range" className="calc-field__slider" min={0} max={5000000} step={5000} value={amortization} onChange={(e) => setAmortization(Number(e.target.value))} /><input type="number" className="calc-field__input" value={amortization} onChange={(e) => setAmortization(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📊 TOTAL REVENUE (for margin)</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={50000} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} /><input type="number" className="calc-field__input" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">EBITDA</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{fmt(result.ebitda)}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">EBITDA MARGIN</p><p style={{ fontWeight: 700, color: "var(--n-primary)" }}>{result.ebitdaMargin}%</p></div>
                    <div><p className="calc-field__label">NET INCOME</p><p style={{ fontWeight: 700 }}>{fmt(result.netIncome)}</p></div>
                </div>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-3)" }}>
                    Formula: {fmt(netIncome)} + {fmt(interest)} + {fmt(taxes)} + {fmt(depreciation)} + {fmt(amortization)} = {fmt(result.ebitda)}
                </p>
            </div>
        </div>
    );
}

// ─── EBIT ───
function EBITCalc() {
    const [revenue, setRevenue] = useState(2000000);
    const [cogs, setCogs] = useState(800000);
    const [opex, setOpex] = useState(500000);

    const result = useMemo(() => calculateEBIT(revenue, cogs, opex), [revenue, cogs, opex]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📊 TOTAL REVENUE</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={50000} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} /><input type="number" className="calc-field__input" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">🏭 COST OF GOODS SOLD (COGS)</label><input type="range" className="calc-field__slider" min={0} max={50000000} step={50000} value={cogs} onChange={(e) => setCogs(Number(e.target.value))} /><input type="number" className="calc-field__input" value={cogs} onChange={(e) => setCogs(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">💼 OPERATING EXPENSES</label><input type="range" className="calc-field__slider" min={0} max={50000000} step={50000} value={opex} onChange={(e) => setOpex(Number(e.target.value))} /><input type="number" className="calc-field__input" value={opex} onChange={(e) => setOpex(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">EBIT (OPERATING INCOME)</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: result.ebit >= 0 ? "var(--n-primary)" : "var(--n-danger, #e74c3c)", marginBottom: "var(--s-3)" }}>{fmt(result.ebit)}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">GROSS PROFIT</p><p style={{ fontWeight: 700 }}>{fmt(revenue - cogs)}</p></div>
                    <div><p className="calc-field__label">EBIT MARGIN</p><p style={{ fontWeight: 700, color: "var(--n-primary)" }}>{result.ebitMargin}%</p></div>
                    <div><p className="calc-field__label">GROSS MARGIN</p><p style={{ fontWeight: 700 }}>{revenue > 0 ? ((revenue - cogs) / revenue * 100).toFixed(1) : 0}%</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── WACC ───
function WACCCalc() {
    const [equityValue, setEquityValue] = useState(7000000);
    const [debtValue, setDebtValue] = useState(3000000);
    const [costOfEquity, setCostOfEquity] = useState(12);
    const [costOfDebt, setCostOfDebt] = useState(6);
    const [taxRate, setTaxRate] = useState(25);

    const result = useMemo(() => calculateWACC(equityValue, debtValue, costOfEquity, costOfDebt, taxRate), [equityValue, debtValue, costOfEquity, costOfDebt, taxRate]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📈 EQUITY VALUE (E)</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={100000} value={equityValue} onChange={(e) => setEquityValue(Number(e.target.value))} /><input type="number" className="calc-field__input" value={equityValue} onChange={(e) => setEquityValue(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">💳 DEBT VALUE (D)</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={100000} value={debtValue} onChange={(e) => setDebtValue(Number(e.target.value))} /><input type="number" className="calc-field__input" value={debtValue} onChange={(e) => setDebtValue(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📊 COST OF EQUITY (Re %)</label><input type="range" className="calc-field__slider" min={1} max={30} step={0.5} value={costOfEquity} onChange={(e) => setCostOfEquity(Number(e.target.value))} /><input type="number" className="calc-field__input" value={costOfEquity} onChange={(e) => setCostOfEquity(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">🏦 COST OF DEBT (Rd %)</label><input type="range" className="calc-field__slider" min={1} max={20} step={0.25} value={costOfDebt} onChange={(e) => setCostOfDebt(Number(e.target.value))} /><input type="number" className="calc-field__input" value={costOfDebt} onChange={(e) => setCostOfDebt(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">🧾 TAX RATE (%)</label><input type="range" className="calc-field__slider" min={0} max={50} step={1} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} /><input type="number" className="calc-field__input" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">WEIGHTED AVERAGE COST OF CAPITAL</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.wacc}%</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">EQUITY WEIGHT</p><p style={{ fontWeight: 700 }}>{result.equityWeight}%</p></div>
                    <div><p className="calc-field__label">DEBT WEIGHT</p><p style={{ fontWeight: 700 }}>{result.debtWeight}%</p></div>
                </div>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-3)" }}>
                    WACC = ({result.equityWeight}% × {costOfEquity}%) + ({result.debtWeight}% × {costOfDebt}% × (1 − {taxRate}%))
                </p>
            </div>
        </div>
    );
}

// ─── Cap Rate ───
function CapRateCalc() {
    const [noi, setNoi] = useState(120000);
    const [propertyValue, setPropertyValue] = useState(1500000);

    const result = useMemo(() => calculateCapRate(noi, propertyValue), [noi, propertyValue]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">💰 NET OPERATING INCOME (ANNUAL)</label><input type="range" className="calc-field__slider" min={0} max={10000000} step={5000} value={noi} onChange={(e) => setNoi(Number(e.target.value))} /><input type="number" className="calc-field__input" value={noi} onChange={(e) => setNoi(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">🏢 PROPERTY VALUE</label><input type="range" className="calc-field__slider" min={100000} max={100000000} step={100000} value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value))} /><input type="number" className="calc-field__input" value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">CAPITALIZATION RATE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.capRate}%</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">MONTHLY INCOME</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmt(result.monthlyIncome)}</p></div>
                    <div><p className="calc-field__label">ANNUAL NOI</p><p style={{ fontWeight: 700 }}>{fmt(result.noi)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── ROI ───
function ROICalc() {
    const [gain, setGain] = useState(150000);
    const [cost, setCost] = useState(100000);

    const result = useMemo(() => calculateROI(gain, cost), [gain, cost]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">💰 TOTAL RETURN / GAIN</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={10000} value={gain} onChange={(e) => setGain(Number(e.target.value))} /><input type="number" className="calc-field__input" value={gain} onChange={(e) => setGain(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">💳 INVESTMENT COST</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={10000} value={cost} onChange={(e) => setCost(Number(e.target.value))} /><input type="number" className="calc-field__input" value={cost} onChange={(e) => setCost(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">RETURN ON INVESTMENT</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: result.roi >= 0 ? "var(--n-success)" : "var(--n-danger, #e74c3c)", marginBottom: "var(--s-3)" }}>{result.roi}%</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">NET PROFIT</p><p style={{ fontWeight: 700, color: result.netProfit >= 0 ? "var(--n-success)" : "var(--n-danger, #e74c3c)" }}>{fmt(result.netProfit)}</p></div>
                    <div><p className="calc-field__label">TOTAL GAIN</p><p style={{ fontWeight: 700 }}>{fmt(result.gain)}</p></div>
                    <div><p className="calc-field__label">COST</p><p style={{ fontWeight: 700 }}>{fmt(result.cost)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Cost of Equity (CAPM) ───
function CostOfEquityCalc() {
    const [riskFreeRate, setRiskFreeRate] = useState(4.5);
    const [beta, setBeta] = useState(1.2);
    const [marketReturn, setMarketReturn] = useState(10);

    const result = useMemo(() => calculateCostOfEquity(riskFreeRate, beta, marketReturn), [riskFreeRate, beta, marketReturn]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🛡️ RISK-FREE RATE (Rf %)</label><input type="range" className="calc-field__slider" min={0} max={15} step={0.1} value={riskFreeRate} onChange={(e) => setRiskFreeRate(Number(e.target.value))} /><input type="number" className="calc-field__input" value={riskFreeRate} onChange={(e) => setRiskFreeRate(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📈 BETA (β)</label><input type="range" className="calc-field__slider" min={-1} max={3} step={0.05} value={beta} onChange={(e) => setBeta(Number(e.target.value))} /><input type="number" className="calc-field__input" value={beta} onChange={(e) => setBeta(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📊 EXPECTED MARKET RETURN (Rm %)</label><input type="range" className="calc-field__slider" min={1} max={25} step={0.5} value={marketReturn} onChange={(e) => setMarketReturn(Number(e.target.value))} /><input type="number" className="calc-field__input" value={marketReturn} onChange={(e) => setMarketReturn(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">COST OF EQUITY (REQUIRED RETURN)</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.costOfEquity}%</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">EQUITY RISK PREMIUM</p><p style={{ fontWeight: 700 }}>{result.marketPremium.toFixed(2)}%</p></div>
                    <div><p className="calc-field__label">BETA × ERP</p><p style={{ fontWeight: 700 }}>{(beta * result.marketPremium).toFixed(2)}%</p></div>
                </div>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-3)" }}>
                    Re = {riskFreeRate}% + {beta} × ({marketReturn}% − {riskFreeRate}%) = {result.costOfEquity}%
                </p>
            </div>
        </div>
    );
}

// ─── ROAS ───
function ROASCalc() {
    const [revenue, setRevenue] = useState(50000);
    const [adSpend, setAdSpend] = useState(10000);

    const result = useMemo(() => calculateROAS(revenue, adSpend), [revenue, adSpend]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">💰 REVENUE FROM ADS</label><input type="range" className="calc-field__slider" min={0} max={10000000} step={1000} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} /><input type="number" className="calc-field__input" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📢 AD SPEND</label><input type="range" className="calc-field__slider" min={0} max={10000000} step={1000} value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} /><input type="number" className="calc-field__input" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">RETURN ON AD SPEND</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.roas}× ({result.roasPercent}%)</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">NET RETURN</p><p style={{ fontWeight: 700, color: result.netReturn >= 0 ? "var(--n-success)" : "var(--n-danger, #e74c3c)" }}>{fmt(result.netReturn)}</p></div>
                    <div><p className="calc-field__label">REVENUE</p><p style={{ fontWeight: 700 }}>{fmt(result.revenue)}</p></div>
                    <div><p className="calc-field__label">AD SPEND</p><p style={{ fontWeight: 700 }}>{fmt(result.adSpend)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Beta ───
function BetaCalc() {
    const [stockReturn, setStockReturn] = useState(15);
    const [marketReturn, setMarketReturn] = useState(10);

    const result = useMemo(() => calculateBeta(stockReturn, marketReturn), [stockReturn, marketReturn]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">📈 STOCK RETURN (%)</label><input type="range" className="calc-field__slider" min={-50} max={100} step={0.5} value={stockReturn} onChange={(e) => setStockReturn(Number(e.target.value))} /><input type="number" className="calc-field__input" value={stockReturn} onChange={(e) => setStockReturn(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">📊 MARKET RETURN (%)</label><input type="range" className="calc-field__slider" min={-50} max={50} step={0.5} value={marketReturn} onChange={(e) => setMarketReturn(Number(e.target.value))} /><input type="number" className="calc-field__input" value={marketReturn} onChange={(e) => setMarketReturn(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">BETA (β)</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.beta}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>{result.interpretation}</p>
            </div>
        </div>
    );
}

// ─── Cash Back ───
function CashBackCalc() {
    const [purchaseAmount, setPurchaseAmount] = useState(5000);
    const [cashBackRate, setCashBackRate] = useState(5);

    const result = useMemo(() => calculateCashBack(purchaseAmount, cashBackRate), [purchaseAmount, cashBackRate]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">🛒 PURCHASE AMOUNT</label><input type="range" className="calc-field__slider" min={0} max={1000000} step={100} value={purchaseAmount} onChange={(e) => setPurchaseAmount(Number(e.target.value))} /><input type="number" className="calc-field__input" value={purchaseAmount} onChange={(e) => setPurchaseAmount(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">💳 CASH BACK RATE (%)</label><input type="range" className="calc-field__slider" min={0} max={50} step={0.5} value={cashBackRate} onChange={(e) => setCashBackRate(Number(e.target.value))} /><input type="number" className="calc-field__input" value={cashBackRate} onChange={(e) => setCashBackRate(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">CASH BACK EARNED</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-success)", marginBottom: "var(--s-3)" }}>{fmt(result.cashBack)}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">EFFECTIVE COST</p><p style={{ fontWeight: 700, color: "var(--n-primary)" }}>{fmt(result.effectiveCost)}</p></div>
                    <div><p className="calc-field__label">PURCHASE AMOUNT</p><p style={{ fontWeight: 700 }}>{fmt(result.purchaseAmount)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Current Ratio ───
function CurrentRatioCalc() {
    const [currentAssets, setCurrentAssets] = useState(500000);
    const [currentLiabilities, setCurrentLiabilities] = useState(300000);

    const result = useMemo(() => calculateCurrentRatio(currentAssets, currentLiabilities), [currentAssets, currentLiabilities]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">💰 CURRENT ASSETS</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={10000} value={currentAssets} onChange={(e) => setCurrentAssets(Number(e.target.value))} /><input type="number" className="calc-field__input" value={currentAssets} onChange={(e) => setCurrentAssets(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">💳 CURRENT LIABILITIES</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={10000} value={currentLiabilities} onChange={(e) => setCurrentLiabilities(Number(e.target.value))} /><input type="number" className="calc-field__input" value={currentLiabilities} onChange={(e) => setCurrentLiabilities(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">CURRENT RATIO</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{result.currentRatio}×</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>{result.interpretation}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">WORKING CAPITAL</p><p style={{ fontWeight: 700, color: (currentAssets - currentLiabilities) >= 0 ? "var(--n-success)" : "var(--n-danger, #e74c3c)" }}>{fmt(currentAssets - currentLiabilities)}</p></div>
                    <div><p className="calc-field__label">ASSETS</p><p style={{ fontWeight: 700 }}>{fmt(currentAssets)}</p></div>
                    <div><p className="calc-field__label">LIABILITIES</p><p style={{ fontWeight: 700 }}>{fmt(currentLiabilities)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Net Worth ───
function NetWorthCalc() {
    const [totalAssets, setTotalAssets] = useState(5000000);
    const [totalLiabilities, setTotalLiabilities] = useState(2000000);

    const result = useMemo(() => calculateNetWorth(totalAssets, totalLiabilities), [totalAssets, totalLiabilities]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">💰 TOTAL ASSETS</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={50000} value={totalAssets} onChange={(e) => setTotalAssets(Number(e.target.value))} /><input type="number" className="calc-field__input" value={totalAssets} onChange={(e) => setTotalAssets(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">💳 TOTAL LIABILITIES</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={50000} value={totalLiabilities} onChange={(e) => setTotalLiabilities(Number(e.target.value))} /><input type="number" className="calc-field__input" value={totalLiabilities} onChange={(e) => setTotalLiabilities(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">NET WORTH</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: result.netWorth >= 0 ? "var(--n-success)" : "var(--n-danger, #e74c3c)", marginBottom: "var(--s-3)" }}>{fmt(result.netWorth)}</p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">ASSETS</p><p style={{ fontWeight: 700 }}>{fmt(result.totalAssets)}</p></div>
                    <div><p className="calc-field__label">LIABILITIES</p><p style={{ fontWeight: 700 }}>{fmt(result.totalLiabilities)}</p></div>
                    <div><p className="calc-field__label">DEBT-TO-ASSET</p><p style={{ fontWeight: 700 }}>{result.debtToAssetRatio}%</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Opportunity Cost ───
function OpportunityCostCalc() {
    const [investmentAmount, setInvestmentAmount] = useState(1000000);
    const [chosenReturn, setChosenReturn] = useState(8);
    const [alternativeReturn, setAlternativeReturn] = useState(12);

    const result = useMemo(() => calculateOpportunityCost(investmentAmount, chosenReturn, alternativeReturn), [investmentAmount, chosenReturn, alternativeReturn]);

    return (
        <div className="calc-card">
            <div className="calc-field"><label className="calc-field__label">💰 INVESTMENT AMOUNT</label><input type="range" className="calc-field__slider" min={0} max={100000000} step={50000} value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} /><input type="number" className="calc-field__input" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">✅ CHOSEN OPTION RETURN (%)</label><input type="range" className="calc-field__slider" min={0} max={50} step={0.5} value={chosenReturn} onChange={(e) => setChosenReturn(Number(e.target.value))} /><input type="number" className="calc-field__input" value={chosenReturn} onChange={(e) => setChosenReturn(Number(e.target.value))} /></div>
            <div className="calc-field"><label className="calc-field__label">🔀 BEST ALTERNATIVE RETURN (%)</label><input type="range" className="calc-field__slider" min={0} max={50} step={0.5} value={alternativeReturn} onChange={(e) => setAlternativeReturn(Number(e.target.value))} /><input type="number" className="calc-field__input" value={alternativeReturn} onChange={(e) => setAlternativeReturn(Number(e.target.value))} /></div>

            <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">OPPORTUNITY COST</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: result.opportunityCost > 0 ? "var(--n-danger, #e74c3c)" : "var(--n-success)", marginBottom: "var(--s-3)" }}>
                    {result.opportunityCost > 0 ? `${result.opportunityCost}% (${fmt(result.dollarCost)} lost)` : "No opportunity cost — you chose the best option!"}
                </p>
                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                    <div><p className="calc-field__label">CHOSEN RETURN</p><p style={{ fontWeight: 700 }}>{chosenReturn}%</p></div>
                    <div><p className="calc-field__label">ALTERNATIVE</p><p style={{ fontWeight: 700 }}>{alternativeReturn}%</p></div>
                    <div><p className="calc-field__label">DOLLAR COST</p><p style={{ fontWeight: 700, color: result.dollarCost > 0 ? "var(--n-danger, #e74c3c)" : "var(--n-success)" }}>{fmt(result.dollarCost)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Dispatcher ───
const CALCULATORS: Record<string, React.FC> = {
    "enterprise-value": EnterpriseValueCalc,
    "ebitda": EBITDACalc,
    "ebit": EBITCalc,
    "wacc": WACCCalc,
    "cap-rate": CapRateCalc,
    "roi": ROICalc,
    "cost-of-equity": CostOfEquityCalc,
    "roas": ROASCalc,
    "beta": BetaCalc,
    "cash-back": CashBackCalc,
    "current-ratio": CurrentRatioCalc,
    "net-worth": NetWorthCalc,
    "opportunity-cost": OpportunityCostCalc,
};

interface Props { calcType: string; }

export default function BusinessCalculatorCore({ calcType }: Props) {
    const Calculator = CALCULATORS[calcType];
    if (!Calculator) return <p>Unknown calculator type: {calcType}</p>;
    return <Calculator />;
}
