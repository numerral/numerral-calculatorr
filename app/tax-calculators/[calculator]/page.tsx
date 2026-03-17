// Dynamic Hub — /tax-calculators/[calculator]/
// Each tax calculator gets its own hub page with calculator + explanation + FAQ

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TaxCalculatorCore from "@/components/calculator/TaxCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export function generateStaticParams() {
    return getCalculatorsByCategory("tax").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("tax").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: `${calc.title}`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/tax-calculators/${calc.slug}`) },
    };
}

// Hub content per tax calculator
const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation: { heading: string; paragraphs: string[]; highlight: string };
    faq: { question: string; answer: string }[];
}> = {
    "income-tax-calculator": {
        subtitle: "Estimate your 2025 federal income tax refund or amount owed. Includes all filing statuses, standard & itemized deductions, credits, and FICA.",
        explanation: {
            heading: "Understanding U.S. Federal Income Tax",
            paragraphs: [
                "The U.S. uses a progressive federal income tax system with seven marginal tax brackets for 2025: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. Your marginal rate applies only to income within each bracket — not your entire income. For example, a single filer earning $75,000 pays 10% on the first $11,925, 12% on $11,925–$48,475, and 22% on $48,475–$60,000 (after the $15,000 standard deduction).",
                "Most taxpayers choose the standard deduction — $15,000 for single filers, $30,000 for married filing jointly in 2025. Itemizing makes sense when your mortgage interest, state & local taxes (SALT, capped at $40,000), charitable donations, and medical expenses (above 7.5% of AGI) exceed the standard deduction.",
                "Beyond income tax, employees pay FICA payroll taxes: 6.2% Social Security (on wages up to $176,100) and 1.45% Medicare (plus 0.9% surtax on wages above $200,000 for single filers). The Child Tax Credit is $2,000 per qualifying child under 17.",
            ],
            highlight: "Single filer, $75,000 wages, standard deduction → Taxable income: $60,000 → Federal tax: ~$8,600 → Effective rate: ~11.5%. Add FICA ($5,738) for a total tax burden of ~$14,338 (19.1% of income).",
        },
        faq: [
            { question: "What are the 2025 federal income tax brackets?", answer: "There are seven brackets: 10% ($0–$11,925), 12% ($11,925–$48,475), 22% ($48,475–$103,350), 24% ($103,350–$197,300), 32% ($197,300–$250,525), 35% ($250,525–$626,350), and 37% (above $626,350) for single filers. Married Filing Jointly brackets are roughly doubled." },
            { question: "What is the standard deduction for 2025?", answer: "$15,000 for Single and Married Filing Separately, $30,000 for Married Filing Jointly, and $22,500 for Head of Household. Most taxpayers (roughly 90%) choose the standard deduction over itemizing." },
            { question: "Should I take the standard deduction or itemize?", answer: "Itemize if your total deductible expenses (mortgage interest, charitable donations, state & local taxes up to $40,000, and medical expenses above 7.5% of AGI) exceed the standard deduction. Our calculator compares both and tells you which saves more." },
            { question: "How is the Child Tax Credit calculated?", answer: "The Child Tax Credit is $2,000 per qualifying child under 17. It begins phasing out at $200,000 AGI for single filers ($400,000 for joint). Up to $1,700 per child may be refundable as the Additional Child Tax Credit." },
            { question: "What is FICA and how much do I pay?", answer: "FICA stands for Federal Insurance Contributions Act and funds Social Security and Medicare. Employees pay 6.2% for Social Security (on wages up to $176,100) and 1.45% for Medicare (no wage cap). An additional 0.9% Medicare surtax applies to wages above $200,000 for single filers." },
        ],
    },
    "gst-calculator": {
        subtitle: "Calculate GST instantly — CGST, SGST & IGST split for any amount at 5%, 12%, 18% or 28%.",
        explanation: {
            heading: "Understanding GST Calculation",
            paragraphs: [
                "GST (Goods and Services Tax) is levied at 4 main rates: 5% (essential items), 12% (standard goods), 18% (most services), and 28% (luxury/sin goods). The tax is split into CGST + SGST for intra-state supply, or IGST for inter-state.",
                "When calculating GST, the mode matters: 'Exclusive' adds GST on top of the base price, while 'Inclusive' means GST is already included in the price — the calculator extracts the base amount and GST component.",
            ],
            highlight: "₹10,000 product at 18% GST exclusive = ₹11,800 total (CGST ₹900 + SGST ₹900). The same ₹10,000 at 18% inclusive = ₹8,475 base + ₹1,525 GST.",
        },
        faq: [
            { question: "What is the difference between CGST, SGST, and IGST?", answer: "CGST (Central GST) and SGST (State GST) apply to intra-state transactions — the rate is split equally between both. IGST (Integrated GST) applies to inter-state transactions — the full rate goes to the central government." },
            { question: "How do I know if GST is inclusive or exclusive?", answer: "MRP on consumer products is always GST-inclusive. B2B invoices usually show GST-exclusive prices. Check the invoice — if it says 'plus GST' or shows GST separately, it's exclusive." },
            { question: "Which GST rate applies to my product?", answer: "Check the HSN/SAC code for your product/service. Essential items (food, medicine) are at 5%, most goods at 12-18%, services at 18%, and luxury items (cars, tobacco) at 28%." },
        ],
    },
    "hra-exemption-calculator": {
        subtitle: "Calculate how much of your HRA is tax-exempt. Compare all 3 HRA rules to find your maximum exemption.",
        explanation: {
            heading: "How HRA Exemption Works",
            paragraphs: [
                "HRA (House Rent Allowance) exemption is available under Section 10(13A) for salaried employees who pay rent. The exempt amount is the LOWEST of three values: actual HRA received, 50% of basic (metro) / 40% (non-metro), or rent paid minus 10% of basic salary.",
                "Metro cities for HRA purposes include Delhi, Mumbai, Kolkata, and Chennai. If you live in any other city, you get 40% of basic instead of 50%. The HRA exemption is only available under the Old Tax Regime.",
            ],
            highlight: "Basic: ₹50K/month, HRA: ₹25K/month, Rent: ₹20K/month (Mumbai) → Exemption = ₹15K/month (Rent − 10% Basic = lowest). Annual savings: ₹1,80,000 exempt from tax.",
        },
        faq: [
            { question: "Can I claim HRA if I own a house?", answer: "Yes, if you live in a rented house in a different city than your owned property. You can claim both HRA exemption and home loan interest deduction (Section 24b) simultaneously." },
            { question: "Is HRA available under the New Tax Regime?", answer: "No. HRA exemption under Section 10(13A) is not available under the New Regime. This is one reason why the Old Regime can be better for those claiming HRA + other deductions." },
            { question: "What documents do I need for HRA claim?", answer: "Rent receipts (monthly), rental agreement, and landlord's PAN if rent exceeds ₹1,00,000/year. Some employers also require a declaration form." },
        ],
    },
    "tds-calculator": {
        subtitle: "Calculate TDS deduction on salary, rent, professional fees, property sale & other income types.",
        explanation: {
            heading: "Understanding TDS (Tax Deducted at Source)",
            paragraphs: [
                "TDS is a mechanism where the payer deducts tax at source before paying the recipient. Different income types have different TDS sections and rates — salary (Section 192), bank interest (194A), rent (194I), professional fees (194J), and property sale (194IA).",
                "Each type has a threshold below which no TDS is deducted. If you don't provide your PAN, TDS is deducted at a higher rate of 20%. TDS can be claimed as credit when filing your income tax return.",
            ],
            highlight: "₹5 Lakh salary at 10% TDS = ₹50,000 deducted. But if you submit investment proof (80C, 80D, HRA), your employer adjusts TDS downward — potentially to zero if your taxable income is below the threshold.",
        },
        faq: [
            { question: "Can I get a TDS refund?", answer: "Yes. If your actual tax liability is less than the total TDS deducted, you'll get a refund when filing your ITR. This commonly happens when you have multiple TDS deductions from different sources." },
            { question: "What happens if PAN is not provided?", answer: "TDS is deducted at 20% (the higher rate) instead of the applicable rate. For example, interest TDS goes from 10% to 20%. Always provide your PAN to avoid excess deduction." },
            { question: "When is TDS deposited to the government?", answer: "TDS must be deposited by the 7th of the next month. For March, the deadline is April 30. Late deposits attract interest at 1.5% per month." },
        ],
    },
    "capital-gains-tax-calculator": {
        subtitle: "Calculate STCG & LTCG tax on stocks, mutual funds, property & gold. Know your tax liability before you sell.",
        explanation: {
            heading: "Capital Gains Tax in India",
            paragraphs: [
                "Capital gains tax depends on two factors: the type of asset and how long you've held it. Equity shares and equity mutual funds become long-term after 12 months, while most other assets (debt MF, property, gold) need 24 months.",
                "As per Budget 2024, LTCG on all assets is taxed at 12.5%. Equity STCG is 20%, while other STCG is taxed at your income slab rate. Equity LTCG has an annual exemption of ₹1.25 Lakh — gains below this are tax-free.",
            ],
            highlight: "Bought stocks at ₹5L, sold at ₹8L after 14 months → LTCG = ₹3L. Tax = 12.5% × (₹3L − ₹1.25L exemption) = ₹21,875 + 4% cess = ₹22,750. Net gain after tax: ₹2,77,250.",
        },
        faq: [
            { question: "What is the LTCG exemption for equity?", answer: "₹1,25,000 per financial year. This means your first ₹1.25 Lakh of long-term capital gains from equity/equity MF is completely tax-free each year." },
            { question: "How is STCG different from LTCG?", answer: "STCG (Short-Term Capital Gain) applies when you sell before the minimum holding period (12 months for equity, 24 months for others). STCG has higher tax rates — 20% for equity and slab rate for other assets." },
            { question: "Is there indexation benefit for property?", answer: "After Budget 2024, LTCG on property is taxed at a flat 12.5% without indexation. Previously, you could adjust the purchase price for inflation using CII (Cost Inflation Index)." },
        ],
    },
    "professional-tax-calculator": {
        subtitle: "Calculate state-specific professional tax deductions for salaried employees across India.",
        explanation: {
            heading: "Understanding Professional Tax in India",
            paragraphs: [
                "Professional Tax (PT) is a direct tax levied by state governments in India on all individuals who earn a living through salary, professions, trades, or callings. Despite the name, it is not just for professionals like doctors or lawyers—it applies to all salaried employees working in states where the legislation is active.",
                "Under Article 276 of the Indian Constitution, the maximum amount any state can levy as professional tax is capped at ₹2,500 per financial year. Employers are responsible for deducting this amount directly from an employee's salary and remitting it to the state government. The exact amount deducted varies based on your gross salary slab and the specific state in which you are employed.",
                "It's important to note that not all Indian states levy Professional Tax. States like Delhi, Haryana, and Uttar Pradesh do not charge PT, whereas states like Maharashtra, Karnataka, Tamil Nadu, and West Bengal do. For salaried employees filing income tax, the total professional tax paid during the year is allowed as a deduction under Section 16(iii) of the Income Tax Act."
            ],
            highlight: "Did you know? Even if your employer doesn't deduct Professional Tax, self-employed professionals must register and pay this tax directly to their state commercial tax department.",
        },
        faq: [
            { question: "What is the maximum limit for professional tax?", answer: "As per the Constitution of India, the total professional tax payable by any person cannot exceed ₹2,500 per financial year." },
            { question: "Is professional tax deductible under Income Tax?", answer: "Yes. Salaried employees can claim a deduction for the exact amount of professional tax paid during the year under Section 16(iii) of the Income Tax Act." },
            { question: "Do all states charge professional tax?", answer: "No. It is a state-level tax. Many states and union territories (e.g., Delhi, Haryana, Chandigarh) do not levy any professional tax." },
            { question: "Is professional tax the same in all states?", answer: "No. Each state sets its own PT slabs. Some states like Rajasthan and UP don't levy PT at all. Maharashtra charges ₹200/month for salary above ₹10,000, while Tamil Nadu has slabs ranging from ₹135 to ₹1,250/month." },
            { question: "Can I claim PT as a deduction?", answer: "Yes. Professional tax paid is deductible under Section 16(iii) of the Income Tax Act. It's automatically deducted from your gross salary when computing taxable income — in both old and new regimes." },
        ],
    },
};

export default async function TaxCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const allTaxCalcs = getCalculatorsByCategory("tax");
    const calc = allTaxCalcs.find((c) => c.slug === calculator);
    if (!calc) notFound();

    const hub = HUB_CONTENT[calc.slug];
    if (!hub) notFound();

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Tax Calculators", url: `${SITE_URL}/tax-calculators` },
            { name: calc.title },
        ]),
        webAppSchema(
            calc.title,
            canonicalUrl(`/tax-calculators/${calc.slug}`),
        ),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }} >
            <Script
                id={`schema-${calc.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Tax Calculators", href: "/tax-calculators" },
                    { label: calc.title },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{hub.subtitle}</p>

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <TaxCalculatorCore calcType={calc.calcType || "income-tax"} />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <DynamicExplanation
                heading={hub.explanation.heading}
                paragraphs={hub.explanation.paragraphs}
                highlight={hub.explanation.highlight}
            />

            <FAQAccordion title={`${calc.title} FAQ`} items={hub.faq} />
        </main >
    );
}
