/**
 * generate-tax-pages.cjs
 * Generate programmatic sub-pages for all 6 tax calculators.
 * 
 * Run:  node generate-tax-pages.cjs
 * Output: data/tax_pages.json (~44 pages)
 */

const fs = require("fs");
const path = require("path");

// ─── Helpers ───
function fmtINR(n) {
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 2) + " Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(n % 100000 === 0 ? 0 : 2) + " L";
    return "₹" + n.toLocaleString("en-IN");
}

function fmtLakh(n) {
    if (n >= 10000000) return (n / 10000000) + "-crore";
    if (n >= 100000) return (n / 100000) + "-lakh";
    return n.toLocaleString("en-IN");
}

// ─── Income Tax Calc (simplified for generation) ───
const NEW_SLABS = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400000, max: 800000, rate: 5 },
    { min: 800000, max: 1200000, rate: 10 },
    { min: 1200000, max: 1600000, rate: 15 },
    { min: 1600000, max: 2000000, rate: 20 },
    { min: 2000000, max: 2400000, rate: 25 },
    { min: 2400000, max: Infinity, rate: 30 },
];
const OLD_SLABS = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 5 },
    { min: 500000, max: 1000000, rate: 20 },
    { min: 1000000, max: Infinity, rate: 30 },
];

function calcSlabTax(income, slabs) {
    let rem = income, tax = 0;
    for (const s of slabs) {
        const w = s.max === Infinity ? rem : s.max - s.min;
        const t = Math.min(Math.max(rem, 0), w);
        tax += Math.round(t * s.rate / 100);
        rem -= t;
        if (rem <= 0) break;
    }
    return tax;
}

function calcIncomeTax(income, regime) {
    const std = 75000;
    const taxableOld = Math.max(income - std - 150000 - 25000, 0); // 80C + 80D
    const taxableNew = Math.max(income - std, 0);

    if (regime === "new") {
        let tax = calcSlabTax(taxableNew, NEW_SLABS);
        if (taxableNew <= 1200000) tax = 0; // rebate
        const cess = Math.round(tax * 0.04);
        return { taxable: taxableNew, tax, cess, total: tax + cess };
    } else {
        let tax = calcSlabTax(taxableOld, OLD_SLABS);
        if (taxableOld <= 500000) tax = Math.max(tax - 12500, 0);
        const cess = Math.round(tax * 0.04);
        return { taxable: taxableOld, tax, cess, total: tax + cess };
    }
}

// ─── 1. INCOME TAX VARIANTS ───
const INCOME_AMOUNTS = [
    500000, 700000, 800000, 1000000, 1200000, 1500000,
    2000000, 2500000, 3000000, 5000000, 10000000
];

function genIncomeTaxPages() {
    return INCOME_AMOUNTS.map(income => {
        const newR = calcIncomeTax(income, "new");
        const oldR = calcIncomeTax(income, "old");
        const better = newR.total <= oldR.total ? "New" : "Old";
        const savings = Math.abs(newR.total - oldR.total);
        const slug = fmtLakh(income);
        const label = fmtINR(income);
        const effRate = income > 0 ? ((Math.min(newR.total, oldR.total) / income) * 100).toFixed(1) : "0";

        return {
            calculatorId: "income-tax-calculator",
            slug,
            calcType: "income-tax",
            variantParam: income,
            isIndexable: true,
            title: `Income Tax on ${label} — FY 2025-26 Calculator | Numerral`,
            metaDescription: `Calculate income tax on ${label} annual income. New Regime: ${fmtINR(newR.total)} | Old Regime: ${fmtINR(oldR.total)}. ${better} Regime saves ${fmtINR(savings)}.`,
            h1: `Income Tax Calculator for ${label} Salary — FY 2025-26`,
            subtitle: `On <strong>${label}</strong> annual income: New Regime tax is <strong>${fmtINR(newR.total)}</strong>, Old Regime tax is <strong>${fmtINR(oldR.total)}</strong>. ${better} Regime saves you <strong>${fmtINR(savings)}</strong>.`,
            explanation: {
                heading: `Income Tax Breakdown on ${label}`,
                paragraphs: [
                    `For an annual income of ${label}, the New Tax Regime (FY 2025-26) results in a total tax of ${fmtINR(newR.total)} (effective rate: ${income > 0 ? ((newR.total / income) * 100).toFixed(1) : 0}%). The Old Regime with standard deductions (80C ₹1.5L + 80D ₹25K) gives ${fmtINR(oldR.total)} (effective rate: ${income > 0 ? ((oldR.total / income) * 100).toFixed(1) : 0}%).`,
                    `The ${better} Regime saves you ${fmtINR(savings)} on this income. ${income <= 1275000 ? "Under the New Regime, income up to ₹12.75 Lakh (including ₹75K standard deduction) is completely tax-free thanks to the Section 87A rebate." : `At ${label} income, the effective tax rate is just ${effRate}% — meaning you keep over ${(100 - parseFloat(effRate)).toFixed(0)}% of your earnings after tax.`}`,
                ],
                highlight: `${label} income → New Regime: ${fmtINR(newR.total)} | Old Regime: ${fmtINR(oldR.total)} | Save ${fmtINR(savings)} with ${better} Regime.`,
            },
            faq: [
                { question: `How much tax do I pay on ${label} income?`, answer: `Under the New Regime: ${fmtINR(newR.total)}. Under the Old Regime (with 80C + 80D deductions): ${fmtINR(oldR.total)}. The ${better} Regime saves ${fmtINR(savings)}.` },
                { question: `Which regime is better for ${label} salary?`, answer: `For ${label} income, the ${better} Regime is better, saving ${fmtINR(savings)}. ${better === "New" ? "The New Regime's lower slab rates outweigh the deduction benefit of the Old Regime at this income level." : "With 80C + 80D deductions available, the Old Regime's deductions outweigh the New Regime's lower rates."}` },
                { question: `What is the effective tax rate on ${label}?`, answer: `The effective tax rate is ${effRate}% (using the better regime). This accounts for all slabs, deductions, and the 4% health & education cess.` },
            ],
        };
    });
}

// ─── 2. GST VARIANTS ───
const GST_RATES = [5, 12, 18, 28];
const GST_AMOUNTS = [10000, 50000, 100000, 500000, 1000000];

function genGSTPages() {
    const pages = [];
    // By rate
    for (const rate of GST_RATES) {
        const amt = 10000;
        const gst = Math.round(amt * rate / 100);
        const total = amt + gst;
        const cgst = Math.round(gst / 2);
        const sgst = gst - cgst;
        pages.push({
            calculatorId: "gst-calculator",
            slug: `${rate}-percent`,
            calcType: "gst",
            variantParam: rate,
            isIndexable: true,
            title: `GST Calculator ${rate}% — CGST SGST Split on Any Amount | Numerral`,
            metaDescription: `Calculate ${rate}% GST on any amount. Example: ₹10,000 + ${rate}% GST = ${fmtINR(total)} (CGST ${fmtINR(cgst)} + SGST ${fmtINR(sgst)}). Free instant calculator.`,
            h1: `GST Calculator at ${rate}% — CGST & SGST Breakdown`,
            subtitle: `Calculate <strong>${rate}% GST</strong> on any amount. Example: ₹10,000 product → GST <strong>${fmtINR(gst)}</strong> → Total <strong>${fmtINR(total)}</strong>.`,
            explanation: {
                heading: `Understanding ${rate}% GST`,
                paragraphs: [
                    `${rate}% GST applies to ${rate === 5 ? "essential items like food, medicines, and transport" : rate === 12 ? "standard goods like processed food, computers, and business class air tickets" : rate === 18 ? "most services, restaurants, and consumer goods like mobile phones and cameras" : "luxury & sin goods like cars, air conditioners, tobacco, and amusement parks"}.`,
                    `On a ₹${amt.toLocaleString("en-IN")} product at ${rate}% GST exclusive: CGST (${rate / 2}%) = ${fmtINR(cgst)}, SGST (${rate / 2}%) = ${fmtINR(sgst)}, Total GST = ${fmtINR(gst)}. Final price = ${fmtINR(total)}. For inter-state, the full ${rate}% goes as IGST.`,
                ],
                highlight: `₹10,000 at ${rate}% GST → CGST: ${fmtINR(cgst)} + SGST: ${fmtINR(sgst)} = Total ${fmtINR(total)}.`,
            },
            faq: [
                { question: `What items fall under ${rate}% GST?`, answer: `${rate === 5 ? "Essential items: packaged food, tea, spices, fertilizers, newspapers, transport services, and economy hotel stays." : rate === 12 ? "Standard goods: processed food, butter, cheese, fruit juices, computers, mobile phones under ₹10K, and business class air tickets." : rate === 18 ? "Most services: restaurants (non-AC), IT services, consulting, mobile phones, cameras, ACs, refrigerators, and standard consumer goods." : "Luxury items: cars, motorcycles, air conditioners, dishwashers, tobacco, pan masala, aerated drinks, and 5-star hotel stays."}` },
                { question: `How is ${rate}% GST split?`, answer: `For intra-state supply: CGST ${rate / 2}% + SGST ${rate / 2}% = ${rate}%. For inter-state supply: IGST ${rate}%. The total tax is the same either way.` },
            ],
        });
    }
    // By amount
    for (const amt of GST_AMOUNTS) {
        const rate = 18;
        const gst = Math.round(amt * rate / 100);
        const total = amt + gst;
        pages.push({
            calculatorId: "gst-calculator",
            slug: `on-${fmtLakh(amt)}`,
            calcType: "gst",
            variantParam: amt,
            isIndexable: true,
            title: `GST on ${fmtINR(amt)} — 18% Tax Calculation | Numerral`,
            metaDescription: `GST on ${fmtINR(amt)} at 18%: tax = ${fmtINR(gst)}, total = ${fmtINR(total)}. Calculate GST at any rate — 5%, 12%, 18%, 28%. Free calculator.`,
            h1: `GST Calculator on ${fmtINR(amt)} — All Rates`,
            subtitle: `GST on <strong>${fmtINR(amt)}</strong> at 18% = <strong>${fmtINR(gst)}</strong> tax. Total payable: <strong>${fmtINR(total)}</strong>.`,
            explanation: {
                heading: `GST Calculation on ${fmtINR(amt)}`,
                paragraphs: [
                    `On an amount of ${fmtINR(amt)}, GST at the most common rate of 18% adds ${fmtINR(gst)} in tax, making the total ${fmtINR(total)}. For intra-state, this splits into CGST (9%) = ${fmtINR(Math.round(gst / 2))} and SGST (9%) = ${fmtINR(gst - Math.round(gst / 2))}.`,
                    `At different rates: 5% GST = ${fmtINR(Math.round(amt * 0.05))}, 12% = ${fmtINR(Math.round(amt * 0.12))}, 18% = ${fmtINR(gst)}, 28% = ${fmtINR(Math.round(amt * 0.28))}. Use our calculator to switch between exclusive (amount + GST) and inclusive (GST extracted from amount) modes.`,
                ],
                highlight: `${fmtINR(amt)} at 18% GST exclusive = ${fmtINR(total)} total. GST amount: ${fmtINR(gst)}.`,
            },
            faq: [
                { question: `What is the GST on ${fmtINR(amt)}?`, answer: `At 18%: ${fmtINR(gst)} GST, total ${fmtINR(total)}. At 5%: ${fmtINR(Math.round(amt * 0.05))}. At 12%: ${fmtINR(Math.round(amt * 0.12))}. At 28%: ${fmtINR(Math.round(amt * 0.28))}.` },
            ],
        });
    }
    return pages;
}

// ─── 3. HRA VARIANTS ───
const HRA_SALARIES = [
    { basic: 300000, hra: 150000, rent: 120000, label: "₹25K/month" },
    { basic: 480000, hra: 240000, rent: 180000, label: "₹40K/month" },
    { basic: 600000, hra: 300000, rent: 240000, label: "₹50K/month" },
    { basic: 900000, hra: 450000, rent: 360000, label: "₹75K/month" },
    { basic: 1200000, hra: 600000, rent: 480000, label: "₹1L/month" },
    { basic: 1800000, hra: 900000, rent: 600000, label: "₹1.5L/month" },
];

function genHRAPages() {
    return HRA_SALARIES.map(s => {
        const metro50 = Math.round(s.basic * 0.50);
        const rent10 = Math.max(s.rent - Math.round(s.basic * 0.10), 0);
        const exemption = Math.min(s.hra, metro50, rent10);
        const taxable = Math.max(s.hra - exemption, 0);
        const slug = `${s.basic / 100000}-lakh-basic`;

        return {
            calculatorId: "hra-exemption-calculator",
            slug,
            calcType: "hra",
            variantParam: s.basic,
            isIndexable: true,
            title: `HRA Exemption on ${fmtINR(s.basic)} Basic Salary — Calculator | Numerral`,
            metaDescription: `HRA exemption on ${fmtINR(s.basic)} basic salary (${s.label} salary): exemption ${fmtINR(exemption)}, taxable HRA ${fmtINR(taxable)}. Free HRA calculator.`,
            h1: `HRA Calculator for ${s.label} Salary — ${fmtINR(s.basic)} Basic`,
            subtitle: `On <strong>${fmtINR(s.basic)}</strong> basic salary with <strong>${fmtINR(s.hra)}</strong> HRA and <strong>${fmtINR(s.rent)}</strong> rent (metro): your HRA exemption is <strong>${fmtINR(exemption)}</strong>.`,
            explanation: {
                heading: `HRA Exemption on ${fmtINR(s.basic)} Basic Salary`,
                paragraphs: [
                    `For a basic salary of ${fmtINR(s.basic)} (${s.label}), HRA received of ${fmtINR(s.hra)}, and rent paid of ${fmtINR(s.rent)} in a metro city, the three HRA rules give: (1) Actual HRA: ${fmtINR(s.hra)}, (2) 50% of Basic: ${fmtINR(metro50)}, (3) Rent − 10% Basic: ${fmtINR(rent10)}.`,
                    `The minimum of these three is ${fmtINR(exemption)} — this is your exempt HRA. The remaining ${fmtINR(taxable)} is added to your taxable income. At the 30% tax bracket, this exemption saves you approximately ${fmtINR(Math.round(exemption * 0.30))} in taxes.`,
                ],
                highlight: `${fmtINR(s.basic)} basic, ${fmtINR(s.hra)} HRA, ${fmtINR(s.rent)} rent (metro) → Exempt: ${fmtINR(exemption)} | Taxable: ${fmtINR(taxable)}.`,
            },
            faq: [
                { question: `What is HRA exemption on ${fmtINR(s.basic)} basic salary?`, answer: `With ${fmtINR(s.hra)} HRA and ${fmtINR(s.rent)} rent in a metro city, the exemption is ${fmtINR(exemption)}. The taxable HRA is ${fmtINR(taxable)}.` },
                { question: `How much tax does HRA exemption save at this salary?`, answer: `At the 30% tax bracket, the HRA exemption of ${fmtINR(exemption)} saves approximately ${fmtINR(Math.round(exemption * 0.30))} in income tax annually.` },
            ],
        };
    });
}

// ─── 4. CAPITAL GAINS VARIANTS ───
const CG_VARIANTS = [
    { asset: "equity", assetLabel: "Stocks / Equity MF", amounts: [100000, 500000, 1000000, 2500000], holding: 14, ltRate: 12.5, stRate: 20, exemption: 125000 },
    { asset: "property", assetLabel: "Real Estate", amounts: [2500000, 5000000, 10000000], holding: 30, ltRate: 12.5, stRate: 30, exemption: 0 },
    { asset: "gold", assetLabel: "Gold", amounts: [100000, 500000, 1000000], holding: 30, ltRate: 12.5, stRate: 30, exemption: 0 },
];

function genCapitalGainsPages() {
    const pages = [];
    for (const v of CG_VARIANTS) {
        for (const gain of v.amounts) {
            const isLT = v.holding >= (v.asset === "equity" ? 12 : 24);
            const rate = isLT ? v.ltRate : v.stRate;
            const taxableGain = Math.max(gain - v.exemption, 0);
            const tax = Math.round(taxableGain * rate / 100);
            const cess = Math.round(tax * 0.04);
            const totalTax = tax + cess;
            const slug = `${v.asset}-${fmtLakh(gain)}-gain`;
            const gainLabel = fmtINR(gain);

            pages.push({
                calculatorId: "capital-gains-tax-calculator",
                slug,
                calcType: "capital-gains",
                variantParam: gain,
                isIndexable: true,
                title: `Capital Gains Tax on ${gainLabel} ${v.assetLabel} Profit | Numerral`,
                metaDescription: `Capital gains tax on ${gainLabel} profit from ${v.assetLabel}: LTCG tax = ${fmtINR(totalTax)} at ${rate}%. ₹1.25L exemption for equity. Free calculator.`,
                h1: `Capital Gains Tax on ${gainLabel} — ${v.assetLabel}`,
                subtitle: `<strong>${gainLabel}</strong> long-term capital gain from ${v.assetLabel} attracts <strong>${fmtINR(totalTax)}</strong> tax at <strong>${rate}%</strong>.`,
                explanation: {
                    heading: `Tax on ${gainLabel} ${v.assetLabel} Capital Gain`,
                    paragraphs: [
                        `A ${gainLabel} long-term capital gain from ${v.assetLabel} (held for ${v.holding} months) is taxed at ${rate}%. ${v.exemption > 0 ? `After the ₹1.25 Lakh LTCG exemption, the taxable gain is ${fmtINR(taxableGain)}.` : `There is no LTCG exemption for ${v.assetLabel}.`}`,
                        `Tax = ${rate}% × ${fmtINR(taxableGain)} = ${fmtINR(tax)} + 4% cess (${fmtINR(cess)}) = ${fmtINR(totalTax)}. Your net gain after tax: ${fmtINR(gain - totalTax)}.`,
                    ],
                    highlight: `${gainLabel} LTCG on ${v.assetLabel} → Tax: ${fmtINR(totalTax)} | Net gain: ${fmtINR(gain - totalTax)}.`,
                },
                faq: [
                    { question: `How much tax on ${gainLabel} capital gain from ${v.assetLabel}?`, answer: `LTCG tax at ${rate}%: ${fmtINR(totalTax)} (including 4% cess).${v.exemption > 0 ? ` After ₹1.25L exemption, taxable gain is ${fmtINR(taxableGain)}.` : ""} Net gain: ${fmtINR(gain - totalTax)}.` },
                ],
            });
        }
    }
    return pages;
}

// ─── 5. PROFESSIONAL TAX VARIANTS (by state) ───
const PT_STATES = [
    { value: "maharashtra", label: "Maharashtra", tax: 200, threshold: 10000 },
    { value: "karnataka", label: "Karnataka", tax: 200, threshold: 15000 },
    { value: "west-bengal", label: "West Bengal", tax: 200, threshold: 40000 },
    { value: "telangana", label: "Telangana", tax: 200, threshold: 20000 },
    { value: "tamil-nadu", label: "Tamil Nadu", tax: 1250, threshold: 75000 },
    { value: "andhra-pradesh", label: "Andhra Pradesh", tax: 200, threshold: 20000 },
    { value: "gujarat", label: "Gujarat", tax: 200, threshold: 12000 },
    { value: "kerala", label: "Kerala", tax: 250, threshold: 30000 },
    { value: "madhya-pradesh", label: "Madhya Pradesh", tax: 208, threshold: 25000 },
    { value: "odisha", label: "Odisha", tax: 200, threshold: 25000 },
];

function genProfessionalTaxPages() {
    return PT_STATES.map(s => {
        const annual = s.tax * 12;
        return {
            calculatorId: "professional-tax-calculator",
            slug: s.value,
            calcType: "professional-tax",
            variantParam: s.value,
            isIndexable: true,
            title: `Professional Tax in ${s.label} — ${new Date().getFullYear()} Rates & Calculator | Numerral`,
            metaDescription: `Professional tax in ${s.label}: ₹${s.tax}/month (₹${annual}/year) for salary above ₹${s.threshold.toLocaleString("en-IN")}. Calculate exact PT with our free tool.`,
            h1: `Professional Tax Calculator — ${s.label}`,
            subtitle: `Professional tax in <strong>${s.label}</strong> is <strong>₹${s.tax}/month</strong> (₹${annual}/year) for salary above ₹${s.threshold.toLocaleString("en-IN")}.`,
            explanation: {
                heading: `Professional Tax Rates in ${s.label}`,
                paragraphs: [
                    `${s.label} levies professional tax on salaried employees. The maximum monthly PT is ₹${s.tax} for employees earning more than ₹${s.threshold.toLocaleString("en-IN")}/month. Below this threshold, PT is either zero or charged at lower slab rates.`,
                    `Professional tax is deductible from taxable income under Section 16(iii) of the Income Tax Act. Annual deduction: ₹${annual}. This applies in both Old and New tax regimes.`,
                ],
                highlight: `${s.label} PT: ₹${s.tax}/month above ₹${s.threshold.toLocaleString("en-IN")} salary → ₹${annual}/year. Fully deductible from income tax.`,
            },
            faq: [
                { question: `What is professional tax in ${s.label}?`, answer: `The maximum PT rate is ₹${s.tax}/month for salary above ₹${s.threshold.toLocaleString("en-IN")}. Annual total: ₹${annual}. Lower slabs apply for lower salaries.` },
                { question: `Is professional tax deductible from income tax in ${s.label}?`, answer: `Yes. PT is deductible under Section 16(iii). The ₹${annual}/year deduction reduces your taxable income in both old and new regimes.` },
            ],
        };
    });
}

// ─── 6. TDS VARIANTS (by income type) ───
const TDS_TYPES = [
    { type: "salary", label: "Salary", rate: 10, section: "192", threshold: 250000, example: 500000 },
    { type: "rent", label: "Rent", rate: 10, section: "194I", threshold: 240000, example: 600000 },
    { type: "professional", label: "Professional Fees", rate: 10, section: "194J", threshold: 30000, example: 200000 },
    { type: "property-sale", label: "Property Sale", rate: 1, section: "194IA", threshold: 5000000, example: 7500000 },
    { type: "interest", label: "Interest Income", rate: 10, section: "194A", threshold: 40000, example: 100000 },
];

function genTDSPages() {
    return TDS_TYPES.map(t => {
        const tds = Math.round(t.example * t.rate / 100);
        const net = t.example - tds;
        return {
            calculatorId: "tds-calculator",
            slug: `on-${t.type}`,
            calcType: "tds",
            variantParam: t.type,
            isIndexable: true,
            title: `TDS on ${t.label} — Section ${t.section} Rates & Calculator | Numerral`,
            metaDescription: `TDS on ${t.label} (Section ${t.section}): ${t.rate}% above ${fmtINR(t.threshold)} threshold. On ${fmtINR(t.example)}: TDS = ${fmtINR(tds)}, net = ${fmtINR(net)}.`,
            h1: `TDS Calculator on ${t.label} — Section ${t.section}`,
            subtitle: `TDS on <strong>${t.label}</strong> is <strong>${t.rate}%</strong> under Section ${t.section}. Threshold: <strong>${fmtINR(t.threshold)}</strong>.`,
            explanation: {
                heading: `TDS on ${t.label} — Section ${t.section}`,
                paragraphs: [
                    `TDS on ${t.label.toLowerCase()} is deducted at ${t.rate}% under Section ${t.section} of the Income Tax Act. The deduction is applicable only when the payment exceeds ${fmtINR(t.threshold)} ${t.type === "salary" ? "per year" : t.type === "rent" ? "per year" : "per transaction"}.`,
                    `Example: On ${fmtINR(t.example)} ${t.label.toLowerCase()}, TDS = ${t.rate}% × ${fmtINR(t.example)} = ${fmtINR(tds)}. Net amount received: ${fmtINR(net)}. Without PAN, TDS increases to 20%. The deducted TDS can be claimed as credit when filing your ITR.`,
                ],
                highlight: `${t.label}: ${t.rate}% TDS (Section ${t.section}) above ${fmtINR(t.threshold)}. On ${fmtINR(t.example)} → TDS: ${fmtINR(tds)} | Net: ${fmtINR(net)}.`,
            },
            faq: [
                { question: `What is the TDS rate on ${t.label.toLowerCase()}?`, answer: `${t.rate}% under Section ${t.section}. Threshold: ${fmtINR(t.threshold)}. Without PAN, the rate increases to 20%.` },
                { question: `How to calculate TDS on ${fmtINR(t.example)} ${t.label.toLowerCase()}?`, answer: `TDS = ${t.rate}% × ${fmtINR(t.example)} = ${fmtINR(tds)}. Net amount after TDS: ${fmtINR(net)}.` },
            ],
        };
    });
}

// ─── Generate all ───
const allPages = [
    ...genIncomeTaxPages(),
    ...genGSTPages(),
    ...genHRAPages(),
    ...genCapitalGainsPages(),
    ...genProfessionalTaxPages(),
    ...genTDSPages(),
];

const outPath = path.join(__dirname, "data", "tax_pages.json");
fs.writeFileSync(outPath, JSON.stringify(allPages, null, 2));
console.log(`✅ Generated ${allPages.length} tax sub-pages → data/tax_pages.json`);
console.log(`   Income Tax: ${genIncomeTaxPages().length}`);
console.log(`   GST: ${genGSTPages().length}`);
console.log(`   HRA: ${genHRAPages().length}`);
console.log(`   Capital Gains: ${genCapitalGainsPages().length}`);
console.log(`   Professional Tax: ${genProfessionalTaxPages().length}`);
console.log(`   TDS: ${genTDSPages().length}`);
