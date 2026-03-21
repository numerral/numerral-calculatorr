// Methodology — /methodology/
// CRITICAL E-E-A-T page: explains HOW we build calculators, the formulas, data sources, and verification process

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL, TOTAL_CALCULATORS, TOTAL_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Our Methodology — How Numerral Builds Accurate Calculators",
    description:
        "Learn the rigorous methodology behind Numerral's calculators. We detail the formulas, data sources, verification processes, and accuracy standards used to build every tool on our platform.",
    alternates: { canonical: canonicalUrl("/methodology") },
};

export default function MethodologyPage() {
    const schema = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Methodology" },
        ]),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-methodology"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
            />

            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Methodology" }]} />

            <div className="editorial-content">
                <h1 className="t-h1" style={{ marginBottom: "var(--s-3)" }}>
                    Our Methodology
                </h1>
                <p className="t-body-sm text-muted" style={{ marginBottom: "var(--s-8)" }}>
                    How we build, verify, and maintain {TOTAL_CALCULATORS}+ calculators across {TOTAL_CATEGORIES} categories
                </p>

                <p>
                    At Numerral, every calculator is an <strong>engineered tool</strong> — not a simple formula wrapper. This page
                    explains exactly how we research, build, verify, and maintain each calculator to ensure the results you get
                    are accurate, reliable, and actionable.
                </p>

                <h2>1. Formula Selection &amp; Research</h2>
                <p>
                    Every calculator begins with rigorous formula research. We use only <strong>industry-standard, peer-reviewed,
                    or government-published formulas</strong> — never proprietary or unverified methods. Our research process:
                </p>
                <ul>
                    <li><strong>Primary source verification:</strong> All formulas are traced back to their authoritative origin — whether that is a government agency, published research paper, engineering standard, or medical guideline.</li>
                    <li><strong>Cross-reference validation:</strong> Each formula is verified against at least two independent authoritative sources before implementation.</li>
                    <li><strong>Industry-standard methods:</strong> We use established calculation methods recognized by professional bodies (e.g., reducing balance method for loan EMI, Mifflin-St Jeor for BMR, NEC tables for wire sizing).</li>
                </ul>

                <h2>2. Category-Specific Methodologies</h2>

                <h3>💰 Financial Calculators</h3>
                <p>Our financial calculators follow standard financial mathematics used by banks, financial institutions, and certified financial planners:</p>
                <ul>
                    <li><strong>Loan EMI:</strong> Calculated using the <strong>reducing balance method</strong> (standard amortization formula): EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P = principal, r = monthly rate, n = number of months.</li>
                    <li><strong>Compound interest:</strong> A = P × (1 + r/n)^(n×t) — standard compound interest formula used by all major financial institutions.</li>
                    <li><strong>Tax calculations:</strong> Based on the latest published tax brackets, deductions, and exemptions from the IRS (US) and Income Tax Department (India), updated within 48 hours of official announcements.</li>
                    <li><strong>Investment projections:</strong> Use time-value-of-money principles (present value, future value, annuity formulas) from CFA Institute curriculum and standard finance textbooks.</li>
                </ul>

                <h3>🏗️ Construction Calculators</h3>
                <p>Construction calculators use formulas from industry standards and building codes:</p>
                <ul>
                    <li><strong>Material estimation:</strong> Based on standard coverage rates from manufacturer specifications and industry guidelines (e.g., concrete yield tables, lumber board-foot calculations, roofing square calculations).</li>
                    <li><strong>Waste factors:</strong> Include industry-standard waste percentages (typically 5–15% depending on material) to provide realistic project estimates.</li>
                    <li><strong>Code compliance:</strong> Reference NEC (National Electrical Code), IRC (International Residential Code), and ASTM standards where applicable.</li>
                    <li><strong>Unit conversions:</strong> Use exact conversion factors from NIST (National Institute of Standards and Technology).</li>
                </ul>

                <h3>🏥 Health Calculators</h3>
                <p>Health calculators use formulas from peer-reviewed medical and nutrition research:</p>
                <ul>
                    <li><strong>BMR (Basal Metabolic Rate):</strong> Mifflin-St Jeor equation (1990), the most accurate predictive equation according to the Academy of Nutrition and Dietetics.</li>
                    <li><strong>TDEE:</strong> BMR × activity multiplier using Katch-McArdle activity factors validated in metabolic research.</li>
                    <li><strong>Body composition:</strong> US Navy body fat estimation method (circumference-based), Jackson-Pollock formulas (skinfold-based) — both validated in published studies.</li>
                    <li><strong>Blood pressure &amp; heart rate:</strong> Classifications from the American Heart Association (AHA) and American College of Cardiology (ACC) current guidelines.</li>
                    <li><strong>Pregnancy dating:</strong> Naegele&apos;s Rule (standard obstetric dating method used worldwide).</li>
                </ul>

                <h3>⚡ Electrical Calculators</h3>
                <p>Electrical calculators follow established physics and electrical engineering standards:</p>
                <ul>
                    <li><strong>Ohm&apos;s Law derivatives:</strong> V = IR, P = VI, and all derived formulas — fundamental electrical relationships.</li>
                    <li><strong>Wire sizing:</strong> Based on NEC (National Electrical Code) ampacity tables with temperature and conduit fill adjustments.</li>
                    <li><strong>Power factor &amp; three-phase:</strong> Standard AC power equations (P = √3 × V × I × PF for three-phase).</li>
                    <li><strong>Energy cost:</strong> kWh calculations using published utility rates from EIA (US Energy Information Administration).</li>
                </ul>

                <h2>3. Data Sources</h2>
                <p>
                    We use only <strong>authoritative primary sources</strong> for all data, rates, and regulatory information:
                </p>
                <ul>
                    <li><strong>US Government:</strong> IRS (tax brackets), EIA (energy data), CDC (health guidelines), NIST (measurement standards), BLS (economic data)</li>
                    <li><strong>India Government:</strong> Income Tax Department, RBI (Reserve Bank of India), SEBI, Ministry of Finance</li>
                    <li><strong>Professional Bodies:</strong> American Heart Association, National Fire Protection Association (NFPA/NEC), ASTM International</li>
                    <li><strong>Academic Sources:</strong> Peer-reviewed journals (JAMA, NEJM, Lancet for health formulas), CFA Institute curriculum (finance), standard engineering textbooks</li>
                    <li><strong>Industry Standards:</strong> Manufacturer specifications, building code publications, IEEE standards</li>
                </ul>

                <div className="editorial-highlight">
                    <p>
                        <strong>Our data integrity rule:</strong> If we cannot trace a formula or data point to an authoritative primary
                        source, we do not publish it. Numerral never uses unverified crowd-sourced data, anonymous blog posts,
                        or AI-generated formulas as sources.
                    </p>
                </div>

                <h2>4. Verification Process</h2>
                <p>Every calculator undergoes a four-step verification before publication:</p>

                <div className="editorial-process-flow">
                    <div className="editorial-process-step">
                        <div className="editorial-process-step__number">1</div>
                        <h4>Formula Audit</h4>
                        <p>
                            Mathematical formulas are verified against primary sources. Each formula is documented with its
                            source citation and the specific conditions under which it is valid.
                        </p>
                    </div>
                    <div className="editorial-process-step">
                        <div className="editorial-process-step__number">2</div>
                        <h4>Benchmark Testing</h4>
                        <p>
                            Calculator outputs are tested against known benchmark values — official government calculators,
                            published tables, and manually computed results. We verify across a range of inputs, not just typical values.
                        </p>
                    </div>
                    <div className="editorial-process-step">
                        <div className="editorial-process-step__number">3</div>
                        <h4>Edge Case Testing</h4>
                        <p>
                            Extreme inputs (very large numbers, zero values, negative values, decimal precision), boundary
                            conditions, and uncommon scenarios are tested to ensure graceful handling.
                        </p>
                    </div>
                    <div className="editorial-process-step">
                        <div className="editorial-process-step__number">4</div>
                        <h4>Expert Review</h4>
                        <p>
                            A domain expert reviews the calculator logic, output accuracy, and educational content before
                            publication. Financial tools are reviewed by CFA/MBA professionals; health tools by credentialed
                            health professionals.
                        </p>
                    </div>
                </div>

                <h2>5. Ongoing Maintenance</h2>
                <p>Calculators are not &quot;set and forget&quot; — we continuously maintain accuracy:</p>
                <ul>
                    <li><strong>Regulatory monitoring:</strong> Tax rates, brackets, deductions, and government scheme rates are updated within 48 hours of official announcements.</li>
                    <li><strong>Periodic re-verification:</strong> All calculators are re-tested quarterly against current benchmark data.</li>
                    <li><strong>User error reports:</strong> Every accuracy concern reported by users is investigated and resolved within 24 hours.</li>
                    <li><strong>Version tracking:</strong> All calculator updates are logged with date, change description, and source citation.</li>
                </ul>

                <h2>6. Transparency &amp; Limitations</h2>
                <p>
                    We believe transparency builds trust. Here is what our calculators <strong>can and cannot do</strong>:
                </p>
                <ul>
                    <li><strong>Estimates, not guarantees:</strong> All outputs are mathematical estimates based on the inputs provided. Actual real-world values may differ due to rounding, fees, policy variations, or individual circumstances.</li>
                    <li><strong>Not professional advice:</strong> Our health calculators do not replace medical consultation. Financial calculators do not constitute financial advice. Construction calculators do not replace professional engineering assessment.</li>
                    <li><strong>Input accuracy:</strong> Results are only as accurate as the inputs provided. We provide guidance and ranges, but the user is responsible for entering accurate data.</li>
                    <li><strong>Rounding:</strong> Results may be rounded for readability. Where precision matters (e.g., tax calculations), we show exact values.</li>
                </ul>

                <h2>7. Privacy in Calculations</h2>
                <p>
                    All calculations are performed <strong>entirely client-side</strong> — in your browser. No personal data,
                    inputs, or results are ever sent to our servers, stored in databases, or shared with third parties. This is
                    a core architectural decision, not just a policy.
                </p>
                <p>
                    Read our full <Link href="/privacy" style={{ fontWeight: 600 }}>Privacy Policy →</Link>
                </p>

                <h2>Report an Error</h2>
                <p>
                    If you believe any calculator produces an incorrect result, we want to know immediately. Please email
                    us at <strong>contact@numerral.com</strong> with the calculator name, your inputs, the result you received,
                    and the expected result with source. We investigate every report within 24 hours and issue corrections promptly.
                </p>
                <p>
                    <Link href="/contact" style={{ fontWeight: 600 }}>Contact Us →</Link>
                </p>
            </div>
        </main>
    );
}
