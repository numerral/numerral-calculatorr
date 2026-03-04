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
        title: `${calc.title} — Free Online ${calc.title} | Numerral`,
        description: calc.description,
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
        subtitle: "Calculate your income tax liability under Old & New regime for FY 2025-26. Compare both regimes instantly.",
        explanation: {
            heading: "Understanding Income Tax in India",
            paragraphs: [
                "India offers two tax regimes — the New Regime with simplified slabs but no deductions, and the Old Regime with higher rates but multiple deduction options under Sections 80C, 80D, 80G, and HRA.",
                "Under the New Regime (Budget 2025), income up to ₹12 Lakh is effectively tax-free with the Section 87A rebate. The standard deduction of ₹75,000 applies to both regimes, meaning salaried individuals up to ₹12.75 Lakh pay zero tax under the new regime.",
            ],
            highlight: "₹10 Lakh income → ₹0 tax (New Regime) vs ₹52,500 tax (Old Regime with no deductions). But with ₹3L+ deductions in Old Regime, it can be cheaper. Always compare both!",
        },
        faq: [
            { question: "Which tax regime is better for me?", answer: "It depends on your deductions. If your total deductions (80C + 80D + HRA + others) are less than ₹3.75 Lakh, the New Regime is usually better. For higher deductions, the Old Regime may save more — our calculator compares both instantly." },
            { question: "What is the standard deduction for FY 2025-26?", answer: "₹75,000 for both regimes. This is automatically deducted from your gross salary before computing taxable income." },
            { question: "Is income up to ₹12 Lakh really tax-free?", answer: "Yes, under the New Regime. The Section 87A rebate covers tax on income up to ₹12 Lakh. With the ₹75,000 standard deduction, salaried individuals earning up to ₹12,75,000 pay zero tax." },
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
        subtitle: "Know your professional tax deduction based on state and salary. PT varies significantly across Indian states.",
        explanation: {
            heading: "Professional Tax in India",
            paragraphs: [
                "Professional Tax (PT) is a state-level tax deducted by employers from employee salaries. It's capped at ₹2,500 per year (₹200-₹250/month maximum) by constitutional provision, though actual amounts vary by state and salary slab.",
                "Not all states levy professional tax. Major states that do include Maharashtra, Karnataka, West Bengal, Andhra Pradesh, Telangana, Tamil Nadu, Gujarat, Madhya Pradesh, Kerala, and Odisha. PT is deductible under Section 16 of the Income Tax Act.",
            ],
            highlight: "Maharashtra: ₹200/month for salary above ₹10,000 (₹300 in February) = ₹2,500/year. Karnataka: ₹200/month for salary above ₹15,000 = ₹2,400/year. Both are fully deductible from taxable income.",
        },
        faq: [
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
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
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
        </main>
    );
}
