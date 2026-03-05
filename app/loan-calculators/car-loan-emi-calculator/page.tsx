// Main Calculator — /loan-calculators/car-loan-emi-calculator/ (Server Component)

import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CalculatorCore from "@/components/calculator/CalculatorCore";
import RelatedCalculations from "@/components/calculator/RelatedCalculations";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const pageUrl = canonicalUrl("/loan-calculators/car-loan-emi-calculator");

export const metadata: Metadata = {
    title: "Car Loan EMI Calculator — Calculate Your Monthly Payment",
    description:
        "Calculate your car loan EMI instantly. Adjust amount, interest rate & tenure. Compare scenarios side by side. Free tool by Numerral.",
    alternates: { canonical: pageUrl },
};

const defaults = { amount: 500000, rate: 8.5, tenure: 60 };


const faqItems = [
    {
        question: "What is EMI?",
        answer:
            "EMI (Equated Monthly Instalment) is the fixed amount you pay each month to repay a loan. It includes both principal and interest components.",
    },
    {
        question: "How is car loan EMI calculated?",
        answer:
            "Using the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal loan amount, r is the monthly interest rate, and n is the number of monthly instalments.",
    },
    {
        question: "Does prepaying my car loan reduce the EMI?",
        answer:
            "Prepayment reduces your outstanding principal, which can either reduce your EMI amount or shorten your loan tenure. Most lenders allow you to choose.",
    },
];

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Loan Calculators", url: canonicalUrl("/loan-calculators") },
        { name: "Car Loan EMI Calculator" },
    ]),
    webAppSchema("Car Loan EMI Calculator", pageUrl),
]);

export default function CarLoanEMICalculatorPage() {
    return (
        <main>
            <Script
                id="schema-calculator"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Loan Calculators", href: "/loan-calculators" },
                    { label: "Car Loan EMI" },
                ]}
            />

            <h1>Car Loan EMI Calculator</h1>
            <p>
                Calculate your monthly car loan payment. Adjust amount, interest rate,
                and tenure — results update instantly.
            </p>

            <div>
                {/* Main column */}
                <div>
                    <CalculatorCore defaults={defaults} loanTypeId="car-loan-emi" />

                    <DynamicExplanation
                        heading="Understanding Car Loan EMI"
                        paragraphs={[
                            "A car loan EMI depends on three factors: the principal amount you borrow, the annual interest rate offered by your bank, and the repayment tenure.",
                            "Always negotiate the interest rate before signing. Even a 0.25% reduction on a ₹5 Lakh loan over 5 years saves approximately ₹800 in total interest.",
                        ]}
                        highlight="Key insight: A ₹5 Lakh car loan at 8.5% for 5 years costs you ₹1,14,620 in total interest — that's 23% of the loan amount."
                    />

                    <RelatedCalculations
                        calculatorId="car-loan-emi"
                        limit={8}
                        heading="Popular Car Loan Amounts"
                    />

                    <FAQAccordion title="Car Loan EMI FAQ" items={faqItems} />
                </div>

                {/* Sidebar */}
                <aside>
                    <TrendingCalculations variant="sidebar" />
                    <div>
                        <h3>Compare Rates</h3>
                        <p>See car loan offers from 15+ banks and NBFCs.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
