// CIBIL Score Eligibility Configuration
// Editable config file — update thresholds, lender data, and tips here.

export interface CibilLoanConfig {
    loanType: string;
    label: string;
    typicalPreferred: number;
    idealScore: number;
    description: string;
}

export interface LenderType {
    id: string;
    label: string;
    minAccepted: number;
    typicalPreferred: number;
    idealScore: number;
    note: string;
}

export interface ScoreBand {
    min: number;
    max: number;
    label: string;
    color: string;
    tip: string;
}

// ── Score bands (eligibility labels) ──

export const SCORE_BANDS: ScoreBand[] = [
    {
        min: 300, max: 549,
        label: "Low eligibility",
        color: "#ef4444",
        tip: "Focus on clearing outstanding dues and reducing credit utilisation below 30%. Avoid applying for new credit for 6 months.",
    },
    {
        min: 550, max: 649,
        label: "Moderate eligibility",
        color: "#f59e0b",
        tip: "Pay all EMIs and credit card bills on time for 6-12 months. Reduce credit card utilisation to under 30% of your limit.",
    },
    {
        min: 650, max: 699,
        label: "Good eligibility",
        color: "#3b82f6",
        tip: "You're close to the ideal range. Keep credit utilisation below 25% and avoid multiple loan applications in a short period.",
    },
    {
        min: 700, max: 749,
        label: "Very good eligibility",
        color: "#10b981",
        tip: "You meet most lenders' preferred criteria. Negotiate for better rates — your score gives you bargaining power.",
    },
    {
        min: 750, max: 900,
        label: "Excellent eligibility",
        color: "#059669",
        tip: "You qualify for the best rates and fastest approvals. Always compare 3-4 lenders to get the lowest rate.",
    },
];

// ── Per-loan-type config ──

export const LOAN_CONFIGS: Record<string, CibilLoanConfig> = {
    "car-loan-emi": {
        loanType: "car-loan",
        label: "Car Loan",
        typicalPreferred: 700,
        idealScore: 750,
        description: "Car loans are secured against the vehicle, so lenders may accept slightly lower scores than unsecured loans.",
    },
    "home-loan-emi": {
        loanType: "home-loan",
        label: "Home Loan",
        typicalPreferred: 700,
        idealScore: 750,
        description: "Home loans have the longest tenure. A higher score not only improves approval odds but can save lakhs in interest.",
    },
    "personal-loan-emi": {
        loanType: "personal-loan",
        label: "Personal Loan",
        typicalPreferred: 720,
        idealScore: 750,
        description: "Personal loans are unsecured, so lenders place greater emphasis on CIBIL score. Higher scores unlock better rates.",
    },
    "bike-loan-emi": {
        loanType: "bike-loan",
        label: "Bike Loan",
        typicalPreferred: 680,
        idealScore: 750,
        description: "Two-wheeler loans are smaller in value. Some NBFCs may accept scores from 650+, but 700+ ensures better terms.",
    },
    "business-loan-emi": {
        loanType: "business-loan",
        label: "Business Loan",
        typicalPreferred: 700,
        idealScore: 750,
        description: "Business loans consider both personal CIBIL and business credit (CMR). Mudra loans may have relaxed score requirements.",
    },
    "loan-eligibility": {
        loanType: "loan-eligibility",
        label: "Loan Eligibility",
        typicalPreferred: 700,
        idealScore: 750,
        description: "Your CIBIL score directly impacts not just approval but the maximum loan amount you're eligible for. Higher scores can increase eligibility by 10-20%.",
    },
};

// ── Lender types ──

export const LENDER_TYPES: LenderType[] = [
    {
        id: "any",
        label: "Any Bank",
        minAccepted: 650,
        typicalPreferred: 700,
        idealScore: 750,
        note: "General industry preference across all types of lenders.",
    },
    {
        id: "public",
        label: "Public Sector Bank",
        minAccepted: 650,
        typicalPreferred: 700,
        idealScore: 750,
        note: "SBI, PNB, Bank of Baroda, Canara Bank, etc. may have slightly flexible criteria for existing customers.",
    },
    {
        id: "private",
        label: "Private Bank",
        minAccepted: 680,
        typicalPreferred: 720,
        idealScore: 750,
        note: "HDFC Bank, ICICI Bank, Axis Bank, Kotak — generally prefer 700+ for competitive rates.",
    },
    {
        id: "nbfc",
        label: "NBFC",
        minAccepted: 600,
        typicalPreferred: 680,
        idealScore: 720,
        note: "Bajaj Finance, Tata Capital, L&T Finance — may accept lower scores but at higher interest rates.",
    },
];

// ── Indian lender list (names only, for "Show bank list" toggle) ──

export const INDIAN_LENDERS = [
    { name: "State Bank of India (SBI)", type: "public" },
    { name: "Punjab National Bank (PNB)", type: "public" },
    { name: "Bank of Baroda", type: "public" },
    { name: "Canara Bank", type: "public" },
    { name: "Union Bank of India", type: "public" },
    { name: "Bank of India", type: "public" },
    { name: "HDFC Bank", type: "private" },
    { name: "ICICI Bank", type: "private" },
    { name: "Axis Bank", type: "private" },
    { name: "Kotak Mahindra Bank", type: "private" },
    { name: "IndusInd Bank", type: "private" },
    { name: "Yes Bank", type: "private" },
    { name: "Bajaj Finance", type: "nbfc" },
    { name: "Tata Capital", type: "nbfc" },
    { name: "L&T Finance", type: "nbfc" },
    { name: "Muthoot Finance", type: "nbfc" },
    { name: "HDB Financial Services", type: "nbfc" },
    { name: "Cholamandalam Finance", type: "nbfc" },
];

// ── CIBIL FAQs per loan type ──

export const CIBIL_FAQS: Record<string, { question: string; answer: string }[]> = {
    "car-loan-emi": [
        { question: "What CIBIL score is needed for a car loan?", answer: "Most banks prefer 700+ for car loans. NBFCs like Bajaj Finance may accept 650+, but at higher rates (11-14%). A score of 750+ typically gets you the best rates of 7.5-9%." },
        { question: "Can I get a car loan with a CIBIL score of 600?", answer: "It's possible through some NBFCs, but expect higher interest rates (14-18%) and stricter terms. Consider improving your score for 3-6 months before applying." },
        { question: "Does a car loan affect my CIBIL score?", answer: "Yes, positively if you pay on time. A car loan adds to your credit mix (secured loan), which improves your score. Regular EMI payments strengthen your credit history." },
        { question: "How to check CIBIL score for free?", answer: "Visit cibil.com for one free report per year. You can also check via apps like Paytm, CRED, or BankBazaar for free monthly updates." },
    ],
    "home-loan-emi": [
        { question: "What is the minimum CIBIL score for home loan?", answer: "Most banks require 650+ for home loans. However, 700+ is needed for competitive rates (8.25-8.75%). A score of 750+ can save ₹5-10 Lakh in interest over 20 years." },
        { question: "Can I get a home loan with a CIBIL score of 650?", answer: "Yes, but at higher rates (9.5-10.5%). Public sector banks like SBI may be more accommodating. Adding a co-applicant with a higher score can improve terms." },
        { question: "How much does CIBIL score affect home loan interest rate?", answer: "Significantly. A 750+ score gets you 8.25-8.75%. A 650 score may get 9.5-10.5%. On a ₹50L/20yr loan, this difference is ₹8-12 Lakh in total interest." },
        { question: "How to improve CIBIL score quickly for home loan?", answer: "Pay all EMIs and credit card bills on time, reduce credit utilisation below 30%, avoid new credit inquiries, and dispute any errors on your credit report. Improvement takes 3-6 months." },
    ],
    "personal-loan-emi": [
        { question: "What CIBIL score is needed for personal loan?", answer: "Personal loans require 700+ at most banks. Since they're unsecured, lenders rely heavily on credit scores. 750+ gets the best rates (10.5-12%)." },
        { question: "Can I get a personal loan with a low CIBIL score?", answer: "Some NBFCs offer personal loans for scores of 600-650, but at 18-24% interest. Secured alternatives (loan against FD or mutual funds) offer 6-10% regardless of score." },
        { question: "Why is CIBIL score more important for personal loans?", answer: "Personal loans are unsecured — there's no collateral. The CIBIL score is the primary risk indicator. A 50-point score improvement can reduce your rate by 2-3%." },
    ],
    "bike-loan-emi": [
        { question: "What CIBIL score is required for bike loan?", answer: "Bike loans are more accessible — many lenders accept 650+. For the best rates (8-10%), a score of 700+ is preferred. NBFCs may approve with lower scores." },
        { question: "Can I get a bike loan with no credit history?", answer: "Yes, some dealers offer financing for first-time borrowers with salary proof. Expect higher rates (13-16%) and mandatory down payment of 20-30%." },
        { question: "Does a two-wheeler loan improve CIBIL score?", answer: "Yes, if repaid on time. It builds credit history and adds to your credit mix. This is often a good first step for building creditworthiness." },
    ],
    "business-loan-emi": [
        { question: "What CIBIL score is needed for business loan?", answer: "Banks prefer 700+ for business loans. Mudra loans under PMMY may have slightly relaxed requirements. Business vintage (2+ years) and turnover also matter significantly." },
        { question: "Is personal CIBIL score checked for business loans?", answer: "Yes, especially for proprietorships and partnerships. For companies, both the promoter's personal CIBIL and the company's CMR (Commercial Credit Report) are evaluated." },
        { question: "Can MSME businesses get loans with low CIBIL score?", answer: "CGTMSE-backed loans may be available for scores of 650+. Mudra SHISHU loans (up to ₹50K) have the most relaxed criteria. Higher amounts require stronger profiles." },
    ],
    "loan-eligibility": [
        { question: "How does CIBIL score affect loan eligibility amount?", answer: "A higher CIBIL score (750+) can increase your eligible loan amount by 10-20%. Banks offer higher loan-to-value ratios, lower rates, and more flexible FOIR limits for high-score borrowers, all of which increase the maximum amount you can borrow." },
        { question: "Can I check loan eligibility with a low CIBIL score?", answer: "Yes, but your eligible amount will be lower. Scores below 650 may restrict eligibility to only NBFC lenders at higher rates. Improving your score before applying can significantly increase the loan amount you qualify for." },
        { question: "What CIBIL score is needed for maximum loan eligibility?", answer: "750+ is ideal for maximum eligibility. At this score, banks offer the best rates and highest LTV ratios. Some banks even relax FOIR limits for borrowers with 800+ scores, effectively increasing your maximum eligible amount." },
    ],
};

// ── Disclaimer ──

export const CIBIL_DISCLAIMER = "CIBIL score ranges shown are typical industry preferences. Actual eligibility and interest rates depend on lender policy, income, existing obligations, employment, property profile, and documentation.";

// ── Helper: get score band for a given score ──

export function getScoreBand(score: number): ScoreBand | undefined {
    return SCORE_BANDS.find((b) => score >= b.min && score <= b.max);
}

// ── Helper: get lender type config ──

export function getLenderType(id: string): LenderType {
    return LENDER_TYPES.find((l) => l.id === id) || LENDER_TYPES[0];
}
