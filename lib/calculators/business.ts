/**
 * Business & Financial Ratios — Calculation Functions
 */

// ─── Enterprise Value ───
export interface EnterpriseValueResult {
    marketCap: number;
    totalDebt: number;
    cash: number;
    enterpriseValue: number;
    evToEbitda?: number;
}

export function calculateEnterpriseValue(
    marketCap: number, totalDebt: number, cash: number, ebitda?: number
): EnterpriseValueResult {
    const enterpriseValue = marketCap + totalDebt - cash;
    return {
        marketCap, totalDebt, cash, enterpriseValue,
        evToEbitda: ebitda && ebitda > 0 ? Math.round((enterpriseValue / ebitda) * 100) / 100 : undefined,
    };
}

// ─── EBITDA ───
export interface EBITDAResult {
    netIncome: number;
    interest: number;
    taxes: number;
    depreciation: number;
    amortization: number;
    ebitda: number;
    ebitdaMargin: number;
}

export function calculateEBITDA(
    netIncome: number, interest: number, taxes: number,
    depreciation: number, amortization: number, revenue?: number
): EBITDAResult {
    const ebitda = netIncome + interest + taxes + depreciation + amortization;
    const ebitdaMargin = revenue && revenue > 0 ? Math.round((ebitda / revenue) * 10000) / 100 : 0;
    return { netIncome, interest, taxes, depreciation, amortization, ebitda, ebitdaMargin };
}

// ─── EBIT ───
export interface EBITResult {
    revenue: number;
    cogs: number;
    operatingExpenses: number;
    ebit: number;
    ebitMargin: number;
}

export function calculateEBIT(
    revenue: number, cogs: number, operatingExpenses: number
): EBITResult {
    const ebit = revenue - cogs - operatingExpenses;
    const ebitMargin = revenue > 0 ? Math.round((ebit / revenue) * 10000) / 100 : 0;
    return { revenue, cogs, operatingExpenses, ebit, ebitMargin };
}

// ─── WACC ───
export interface WACCResult {
    equityWeight: number;
    debtWeight: number;
    costOfEquity: number;
    costOfDebt: number;
    taxRate: number;
    wacc: number;
}

export function calculateWACC(
    equityValue: number, debtValue: number,
    costOfEquity: number, costOfDebt: number, taxRate: number
): WACCResult {
    const totalValue = equityValue + debtValue;
    const eW = totalValue > 0 ? equityValue / totalValue : 0;
    const dW = totalValue > 0 ? debtValue / totalValue : 0;
    const wacc = (eW * costOfEquity) + (dW * costOfDebt * (1 - taxRate / 100));
    return {
        equityWeight: Math.round(eW * 10000) / 100,
        debtWeight: Math.round(dW * 10000) / 100,
        costOfEquity, costOfDebt, taxRate,
        wacc: Math.round(wacc * 100) / 100,
    };
}

// ─── Cap Rate ───
export interface CapRateResult {
    noi: number;
    propertyValue: number;
    capRate: number;
    monthlyIncome: number;
}

export function calculateCapRate(noi: number, propertyValue: number): CapRateResult {
    const capRate = propertyValue > 0 ? Math.round((noi / propertyValue) * 10000) / 100 : 0;
    return { noi, propertyValue, capRate, monthlyIncome: Math.round(noi / 12) };
}

// ─── ROI ───
export interface ROIResult {
    gain: number;
    cost: number;
    netProfit: number;
    roi: number;
}

export function calculateROI(gain: number, cost: number): ROIResult {
    const netProfit = gain - cost;
    const roi = cost > 0 ? Math.round((netProfit / cost) * 10000) / 100 : 0;
    return { gain, cost, netProfit, roi };
}

// ─── Cost of Equity (CAPM) ───
export interface CostOfEquityResult {
    riskFreeRate: number;
    beta: number;
    marketReturn: number;
    marketPremium: number;
    costOfEquity: number;
}

export function calculateCostOfEquity(
    riskFreeRate: number, beta: number, marketReturn: number
): CostOfEquityResult {
    const marketPremium = marketReturn - riskFreeRate;
    const costOfEquity = Math.round((riskFreeRate + beta * marketPremium) * 100) / 100;
    return { riskFreeRate, beta, marketReturn, marketPremium, costOfEquity };
}

// ─── ROAS ───
export interface ROASResult {
    revenue: number;
    adSpend: number;
    roas: number;
    netReturn: number;
    roasPercent: number;
}

export function calculateROAS(revenue: number, adSpend: number): ROASResult {
    const roas = adSpend > 0 ? Math.round((revenue / adSpend) * 100) / 100 : 0;
    const netReturn = revenue - adSpend;
    const roasPercent = adSpend > 0 ? Math.round((netReturn / adSpend) * 10000) / 100 : 0;
    return { revenue, adSpend, roas, netReturn, roasPercent };
}

// ─── Beta (input-driven, not calculated from data) ───
export interface BetaResult {
    stockReturn: number;
    marketReturn: number;
    beta: number;
    interpretation: string;
}

export function calculateBeta(stockReturn: number, marketReturn: number): BetaResult {
    const beta = marketReturn !== 0 ? Math.round((stockReturn / marketReturn) * 100) / 100 : 0;
    let interpretation: string;
    if (beta < 0) interpretation = "Moves inversely to the market — rare defensive asset.";
    else if (beta < 0.8) interpretation = "Low volatility — less risky than the market.";
    else if (beta <= 1.2) interpretation = "Closely tracks the market — moderate risk.";
    else if (beta <= 2) interpretation = "High volatility — amplifies market moves.";
    else interpretation = "Very high volatility — speculative exposure.";
    return { stockReturn, marketReturn, beta, interpretation };
}

// ─── Cash Back ───
export interface CashBackResult {
    purchaseAmount: number;
    cashBackRate: number;
    cashBack: number;
    effectiveCost: number;
}

export function calculateCashBack(purchaseAmount: number, cashBackRate: number): CashBackResult {
    const cashBack = Math.round(purchaseAmount * cashBackRate) / 100;
    return {
        purchaseAmount, cashBackRate,
        cashBack,
        effectiveCost: Math.round((purchaseAmount - cashBack) * 100) / 100,
    };
}

// ─── Current Ratio ───
export interface CurrentRatioResult {
    currentAssets: number;
    currentLiabilities: number;
    currentRatio: number;
    interpretation: string;
}

export function calculateCurrentRatio(
    currentAssets: number, currentLiabilities: number
): CurrentRatioResult {
    const currentRatio = currentLiabilities > 0
        ? Math.round((currentAssets / currentLiabilities) * 100) / 100
        : 0;
    let interpretation: string;
    if (currentRatio < 1) interpretation = "Below 1× — the company may struggle to meet short-term obligations.";
    else if (currentRatio < 1.5) interpretation = "Between 1× and 1.5× — adequate but tight liquidity.";
    else if (currentRatio <= 3) interpretation = "Healthy range (1.5×–3×) — the company comfortably covers short-term debts.";
    else interpretation = "Above 3× — ample liquidity, but assets may be underutilized.";
    return { currentAssets, currentLiabilities, currentRatio, interpretation };
}

// ─── Net Worth ───
export interface NetWorthResult {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    debtToAssetRatio: number;
}

export function calculateNetWorth(
    totalAssets: number, totalLiabilities: number
): NetWorthResult {
    const netWorth = totalAssets - totalLiabilities;
    const debtToAssetRatio = totalAssets > 0
        ? Math.round((totalLiabilities / totalAssets) * 10000) / 100
        : 0;
    return { totalAssets, totalLiabilities, netWorth, debtToAssetRatio };
}

// ─── Opportunity Cost ───
export interface OpportunityCostResult {
    chosenReturn: number;
    alternativeReturn: number;
    opportunityCost: number;
    investmentAmount: number;
    dollarCost: number;
}

export function calculateOpportunityCost(
    investmentAmount: number, chosenReturn: number, alternativeReturn: number
): OpportunityCostResult {
    const opportunityCost = Math.round((alternativeReturn - chosenReturn) * 100) / 100;
    const dollarCost = Math.round(investmentAmount * opportunityCost) / 100;
    return { chosenReturn, alternativeReturn, opportunityCost, investmentAmount, dollarCost };
}
