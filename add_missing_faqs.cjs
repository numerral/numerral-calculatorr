const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/glossary.json', 'utf8'));

const faqData = {
  "tenure": [
    { question: "What is the ideal loan tenure?", answer: "It depends on your financial goals. Shorter tenure (5-10 years) means higher EMI but significantly less total interest. Longer tenure (20-30 years) means lower EMI but much more total interest. Choose based on your monthly cash flow capacity while keeping the tenure as short as affordable." },
    { question: "Can I change my loan tenure after taking a loan?", answer: "Yes, most banks allow tenure change through loan restructuring. You can either increase tenure (to lower EMI) or decrease it (to save on interest). Some banks charge a small fee for this. You can also effectively shorten tenure through part-prepayments." },
    { question: "How does tenure affect total interest paid?", answer: "Dramatically. For a ₹50L home loan at 8.5%: 15-year tenure costs ₹36L in interest; 20-year tenure costs ₹51L; 30-year tenure costs ₹88L. The 30-year option costs ₹52 lakh MORE in interest compared to 15 years." }
  ],
  "collateral": [
    { question: "What types of assets can be used as collateral?", answer: "Common collateral includes: residential/commercial property (for home loans, LAP), the vehicle being purchased (car/bike loans), fixed deposits, gold/jewelry, shares and securities, insurance policies, and warehouse receipts for business loans." },
    { question: "What happens to collateral if I default on the loan?", answer: "If you default (typically after 90 days of non-payment), the bank can initiate recovery proceedings. For secured loans, the bank can seize and auction the collateral under SARFAESI Act to recover the outstanding amount. You will be given notices and time to rectify before seizure." },
    { question: "Do all loans require collateral?", answer: "No. Personal loans, credit cards, and small business loans (like Mudra) are unsecured and don't require collateral. Home loans, car loans, gold loans, and loans against property are secured (require collateral). Unsecured loans typically have higher interest rates to compensate for the lender's higher risk." }
  ],
  "ppf": [
    { question: "What is the current PPF interest rate?", answer: "The PPF interest rate is set by the government and revised quarterly. It is compounded annually. Check the latest rate on the Ministry of Finance website or any banking portal. The rate has historically ranged between 7-8.7% over the past decade." },
    { question: "Can I withdraw from PPF before 15 years?", answer: "Partial withdrawal is allowed from the 7th financial year onwards (up to 50% of the balance at the end of the 4th year). Premature closure before 15 years is allowed only in specific cases: life-threatening illness, higher education, or change of residency status (NRI)." },
    { question: "Is PPF interest taxable?", answer: "No, PPF enjoys EEE (Exempt-Exempt-Exempt) status under the Income Tax Act. The contribution qualifies for Section 80C deduction, the interest earned is tax-free, and the maturity amount is also tax-free. This makes PPF one of the most tax-efficient investments." }
  ],
  "tax-slab": [
    { question: "How do tax slabs work?", answer: "Tax slabs are progressive brackets. You pay the specified rate only on income within that bracket, not on your entire income. For example, under the new regime: first ₹3L is tax-free, the next ₹4L (₹3-7L) is taxed at 5%, the next ₹3L (₹7-10L) at 10%, and so on." },
    { question: "Are tax slabs the same for the old and new regime?", answer: "No, the old regime has different brackets and higher rates but allows deductions (80C, 80D, HRA, etc.). The new regime has more brackets with lower rates but very limited deductions. Compare both using a tax calculator to find which saves more for your specific income and deductions." },
    { question: "Do senior citizens have different tax slabs?", answer: "Under the old regime, yes: basic exemption is ₹3L for citizens aged 60-80 and ₹5L for super senior citizens (80+). Under the new regime, the same slabs apply to all ages, but the rebate under Section 87A ensures zero tax up to ₹7L for everyone." }
  ],
  "capital-gains-tax": [
    { question: "What assets are subject to capital gains tax?", answer: "Capital gains tax applies to profits from selling: listed/unlisted shares, equity & debt mutual funds, real estate, gold/jewelry, bonds, and any other capital asset. The tax rate depends on whether the gain is short-term or long-term, which depends on the holding period." },
    { question: "How is the holding period determined for STCG vs. LTCG?", answer: "Listed equity/equity mutual funds: 12 months. Debt mutual funds, gold, real estate: 24 months. Unlisted shares: 24 months. Bonds/debentures: 12 months. Assets held beyond these periods qualify for long-term treatment." },
    { question: "Can I save capital gains tax?", answer: "Yes, through: (1) Section 54 — invest real estate LTCG in another residential property, (2) Section 54EC — invest in specified bonds (up to ₹50L), (3) Tax-loss harvesting — sell loss-making investments to offset gains, (4) Hold equity for 12+ months to get LTCG rate (12.5%) with ₹1.25L exemption." }
  ],
  "ltcg": [
    { question: "What is the LTCG tax rate on equity in India?", answer: "Long-term capital gains on listed equity shares and equity mutual funds (held > 12 months) are taxed at 12.5% on gains exceeding ₹1.25 lakh per year. Gains up to ₹1.25 lakh are completely tax-free. This rate was revised from 10% in Budget 2024." },
    { question: "Is there any exemption on LTCG for equity?", answer: "Yes, LTCG on listed equity/equity mutual funds up to ₹1.25 lakh per financial year is completely exempt from tax. Only gains above this threshold are taxed at 12.5%. This exemption resets every financial year." },
    { question: "How is LTCG calculated on shares?", answer: "LTCG = Sale Price − Cost of Acquisition. For shares acquired before January 31, 2018, the cost is the higher of actual purchase price or the fair market value as on January 31, 2018 (grandfathering provision). STT must have been paid on the sale transaction." }
  ],
  "cess": [
    { question: "What is Health and Education Cess?", answer: "It is a 4% cess levied on the total income tax (including surcharge, if applicable). The revenue is earmarked specifically for funding health and education initiatives in India. Every taxpayer pays this cess regardless of income level." },
    { question: "How is cess calculated?", answer: "Cess = 4% × (Income Tax + Surcharge). For example, if your income tax is ₹1,00,000 and surcharge is ₹10,000, cess = 4% × ₹1,10,000 = ₹4,400. Total tax = ₹1,00,000 + ₹10,000 + ₹4,400 = ₹1,14,400." },
    { question: "Is cess the same as surcharge?", answer: "No. Cess is levied on ALL taxpayers at a flat 4% rate and is earmarked for specific purposes (health + education). Surcharge is levied only on high-income individuals at varying rates (10-37%) and goes to the general revenue pool." }
  ],
  "old-tax-regime": [
    { question: "What deductions are available in the old tax regime?", answer: "Major deductions include: Section 80C (₹1.5L), Section 80D (₹25K-1L), HRA exemption, Section 24(b) home loan interest (₹2L), NPS under 80CCD(1B) (₹50K), Section 80E (education loan interest), LTA, and many more. These are not available in the new regime." },
    { question: "Who should choose the old tax regime?", answer: "The old regime benefits individuals with heavy deductions — typically those who have home loans (Sec 24b), health insurance (80D), children in school (tuition fees), and heavy 80C investments. If your total deductions exceed ₹3.75-4.25L, the old regime likely saves more." },
    { question: "Can I switch from old to new regime?", answer: "Yes, salaried individuals can switch between old and new regimes every year while filing ITR. Those with business income can switch from new to old regime only once in their lifetime and cannot switch back." }
  ],
  "indexation": [
    { question: "How does indexation reduce tax on capital gains?", answer: "Indexation adjusts the purchase price of an asset for inflation using the Cost Inflation Index (CII). This increases the cost base, reducing the taxable capital gain. For example, if you bought a property for ₹30L in 2014 and the CII ratio is 1.5x, the indexed cost becomes ₹45L, reducing your taxable gain." },
    { question: "Is indexation still available for debt mutual funds?", answer: "No, from April 2023, the indexation benefit was removed for debt mutual funds. Gains from debt funds (regardless of holding period) are now taxed at the investor's income tax slab rate. This significantly reduced the tax efficiency of debt funds." },
    { question: "Where is indexation still applicable?", answer: "Indexation benefit is still available for: real estate (if sold after 24 months, though now there's an option for 12.5% without indexation), gold/jewelry, unlisted shares, and certain bonds. It is NOT available for listed equity, equity mutual funds, or debt mutual funds." }
  ]
};

let updated = 0;
data.forEach(term => {
  if (faqData[term.slug]) {
    term.faq = faqData[term.slug];
    updated++;
  }
});

fs.writeFileSync('./data/glossary.json', JSON.stringify(data, null, 2));
console.log('Added FAQs to ' + updated + ' previously enriched terms');

// Final verification
const noFaq = data.filter(t => !t.faq || t.faq.length === 0);
const noContent = data.filter(t => !t.contentHTML || t.contentHTML.trim() === '');
console.log('Remaining without FAQs: ' + noFaq.length);
console.log('Remaining without contentHTML: ' + noContent.length);
