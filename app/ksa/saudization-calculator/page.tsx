// Standalone page — /ksa/saudization-calculator
// KSA Saudization (Nitaqat) Calculator with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Saudization Calculator (Nitaqat) — حاسبة السعودة نطاقات",
    description: "Calculate your company's Saudization percentage and Nitaqat band. See sector-specific targets for 2026, weighted employee counting rules, gap analysis, and compliance status.",
    keywords: ["Saudization calculator", "حاسبة السعودة", "Nitaqat calculator", "نطاقات", "Saudization percentage", "Nitaqat bands Saudi Arabia", "Saudization ratio formula", "sector targets 2026", "Qiwa platform", "MHRSD compliance"],
    alternates: { canonical: canonicalUrl("/ksa/saudization-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is Saudization?", answer: "Saudization (السعودة) — also called nationalization or localization — is Saudi Arabia's government policy requiring private-sector companies to employ a certain percentage of Saudi nationals. It is enforced through the Nitaqat (نطاقات) system, managed by the Ministry of Human Resources and Social Development (MHRSD). The goal is to reduce unemployment among Saudi citizens and align with Vision 2030's target of creating quality jobs for nationals." },
    { question: "How do I calculate my Saudization percentage?", answer: "The basic formula is: (Number of Saudi Employees ÷ Total Employees) × 100. However, the actual count uses weighted factors: Saudi employees earning less than SAR 4,000/month count as 0.5, those with disabilities count as 4 (max 10% of Saudi workforce), and part-time Saudis count as 0.5. All contracts must be documented on the Qiwa platform to be counted." },
    { question: "What are the Nitaqat bands?", answer: "Companies are classified into 5 color-coded bands: Platinum (approximately 40%+ Saudization — premium benefits), High Green (26–40% — most benefits), Mid Green (19–26% — basic services), Low Green (16–19% — needs improvement), and Red (below 16% — severe restrictions). The exact thresholds vary by sector and company size." },
    { question: "What happens if my company is in the Red zone?", answer: "Red zone penalties include: (1) Cannot issue new work visas for expats, (2) Cannot renew existing work permits, (3) Government services (Qiwa, Muqeem, Absher) suspended, (4) Cannot prevent expat employees from transferring out, (5) Cannot open new branches, (6) Barred from government contracts, (7) Cannot change expat professions, (8) Risk of license suspension, (9) Financial penalties." },
    { question: "What are the sector-specific Saudization targets for 2025?", answer: "Key targets include: Medical Labs 70%, Physiotherapy 80%, Radiology 65%, Therapeutic Nutrition 80%, Dentistry 45% (rising to 55% in 2026), Community Pharmacy 35%, Hospital Pharmacy 65%, Technical Engineering 30%, Accounting 40% (rising to 70% over 5 years), Consulting/Cybersecurity 40%, Marketing & Sales 60%, and Procurement 70%." },
    { question: "What is the minimum salary for Saudization counting?", answer: "Saudi employees must earn at least SAR 4,000/month to count as 1.0 toward Saudization quotas. Those earning between SAR 3,000 and SAR 3,999 count as 0.5 employees. Specific professions have higher minimums: SAR 8,000 for engineers (effective Dec 2025) and SAR 9,000 for dentists." },
    { question: "How do employees with disabilities count?", answer: "Each Saudi employee with a disability counts as 4 employees for Saudization purposes. However, this is capped at 10% of the total Saudi workforce. This incentive encourages companies to create inclusive workplaces while boosting their Nitaqat rating." },
    { question: "What is the Qiwa platform?", answer: "Qiwa (قوى) is the unified digital platform for labor sector services in Saudi Arabia, managed by MHRSD. From April 15, 2026, ALL employee contracts must be electronically documented and approved on Qiwa to be counted in Saudization calculations. If a Saudi employee has GOSI registration but no verified Qiwa contract, they will NOT count toward Saudization." },
    { question: "Do GCC nationals count toward Saudization?", answer: "Yes. Citizens of GCC countries (Bahrain, Kuwait, Oman, Qatar, UAE) are generally counted as full Saudi employees (1.0) for Saudization purposes. Palestinians with Egyptian passports, Baluchis, and Myanmar nationals may count as 0.25 of an expatriate, with specific caps." },
    { question: "Can foreign business owners count as Saudi employees?", answer: "Yes. As of recent updates, foreign investors who own private establishments in Saudi Arabia are counted as Saudi nationals for Saudization quota purposes. This encourages foreign investment while maintaining compliance." },
    { question: "How does Saudization affect Iqama renewal?", answer: "Companies in the Red zone cannot renew Iqamas (residence permits) for their expatriate workers. Even companies in Low Green may face delays. The work permit fee is also affected: SAR 800/month for companies where expats exceed Saudis vs SAR 700/month for compliant companies — a SAR 1,200/year difference per worker." },
    { question: "What is the Developed Nitaqat Program (2026–2028)?", answer: "The Developed Nitaqat Program aims to localize over 340,000 private sector jobs between 2026 and 2028. It will gradually raise compliance thresholds, introduce new sector-specific targets, and strengthen enforcement. Companies should prepare by increasing Saudi hiring now to avoid future compliance issues." },
    { question: "How can I improve my Nitaqat rating?", answer: "Strategies include: (1) Hire Saudi graduates and train them, (2) Offer competitive salaries (minimum SAR 4,000 for full count), (3) Employ people with disabilities (4x multiplier), (4) Use part-time and remote Saudi workers, (5) Ensure all contracts are documented on Qiwa, (6) Partner with Saudi human capital development programs, (7) Focus on retaining Saudi employees to reduce turnover." },
    { question: "Do part-time Saudi workers count toward Saudization?", answer: "Yes, but at a reduced rate. Part-time Saudi employees count as 0.5 employees for Saudization purposes. There may be caps on the percentage of part-time workers that can be counted. Remote Saudi workers count as a full 1.0 employee." },
    { question: "What is the penalty for fake Saudization?", answer: "Fake Saudization (السعودة الوهمية) — registering Saudis on payroll without actual employment — is a serious offense. Penalties include: fines of SAR 20,000–100,000 per case, company closure, ban from commercial activities, referral to the Public Prosecution, and potential imprisonment. MHRSD actively audits for fake Saudization." },
];

export default function SaudizationPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Saudization Calculator" },
        ]),
        webAppSchema("Saudization Calculator (Nitaqat)", canonicalUrl("/ksa/saudization-calculator")),
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
                "@type": "Question", name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-saudization" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Saudization Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Saudization Calculator (Nitaqat)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your company's Saudization percentage and determine your Nitaqat band.
                See sector-specific targets for 2025/2026, use weighted employee counting, analyze your compliance gap,
                and find out how many Saudi employees you need to reach the next band.
            </p>
            <AuthorBadge categoryKey="salary" />
            <KSACalculatorCore calcType="saudization" />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudization & Nitaqat FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Min SAR 4K salary for Saudization count</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">GOSI for Saudi employees</div>
                        </div>
                    </Link>
                    <Link href="/ksa/iqama-renewal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">📋</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Iqama Renewal Calculator</div>
                            <div className="ksa-related-link__desc">Saudization affects work permit costs</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">End of Service Calculator</div>
                            <div className="ksa-related-link__desc">EOSB for Saudi and expat employees</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-saudization">What Is Saudization (السعودة)?</h2>
    <p><strong>Saudization</strong> — also known as <strong>nationalization</strong> or <strong>localization (توطين)</strong> — is Saudi Arabia's government-mandated policy requiring private-sector companies to employ a minimum percentage of Saudi nationals. It is the Kingdom's primary tool for addressing <strong>youth unemployment</strong> and creating sustainable career opportunities for its citizens.</p>
    <p>The policy is enforced through the <strong>Nitaqat (نطاقات) system</strong>, managed by the Ministry of Human Resources and Social Development (<strong>MHRSD</strong>). Companies are classified into color-coded bands based on their Saudization ratio, with significant operational benefits or restrictions tied to each band.</p>
    <div class="explanation__highlight">
        <strong>Vision 2030 Context:</strong><br/>
        • Target: Reduce Saudi unemployment from 12.3% (2017) to <strong>7% by 2030</strong><br/>
        • The Developed Nitaqat Program (2026–2028) aims to localize <strong>340,000+ jobs</strong><br/>
        • Over <strong>13 sector-specific targets</strong> announced for 2025/2026<br/>
        • Qiwa platform contract documentation <strong>mandatory from April 2026</strong>
    </div>

    <h2 id="formula">How to Calculate Your Saudization Percentage</h2>
    <h3>Basic Formula</h3>
    <table>
        <thead><tr><th>Formula</th><th>Description</th></tr></thead>
        <tbody>
            <tr><td><strong>(Saudi Employees ÷ Total Employees) × 100</strong></td><td>Basic Saudization ratio</td></tr>
        </tbody>
    </table>
    <h3>Weighted Counting Rules</h3>
    <p>The actual calculation uses <strong>weighted employee counts</strong>. Not all employees count equally:</p>
    <table>
        <thead><tr><th>Employee Type</th><th>Count Factor</th><th>Condition</th></tr></thead>
        <tbody>
            <tr><td><strong>Saudi ≥ SAR 4,000/month</strong></td><td>1.0</td><td>Full-time, documented on Qiwa</td></tr>
            <tr><td><strong>Saudi < SAR 4,000/month</strong></td><td>0.5</td><td>Half count — aim for SAR 4K+ salaries</td></tr>
            <tr><td><strong>Saudi with disability</strong></td><td>4.0</td><td>Max 10% of total Saudi workforce</td></tr>
            <tr><td><strong>Part-time Saudi</strong></td><td>0.5</td><td>With caps on percentage</td></tr>
            <tr><td><strong>Saudi student</strong></td><td>0.5</td><td>With caps</td></tr>
            <tr><td><strong>Remote Saudi worker</strong></td><td>1.0</td><td>Full count</td></tr>
            <tr><td><strong>Foreign investor (owner)</strong></td><td>1.0</td><td>Counted as Saudi</td></tr>
            <tr><td><strong>GCC national</strong></td><td>1.0</td><td>Full count</td></tr>
        </tbody>
    </table>
    <p><strong>Example:</strong> A company with 50 total employees, 8 full Saudis, 2 Saudis below SAR 4K, and 1 Saudi with disability: Weighted = 8 + (2 × 0.5) + (1 × 4) = <strong>13 weighted Saudis</strong>. Rate = (13/50) × 100 = <strong>26% → High Green band</strong>.</p>
    <p>For exact salary calculation of your Saudi employees, use our <a href="/ksa/salary-calculator">Salary Calculator</a> to ensure they meet the SAR 4,000 minimum threshold.</p>

    <h2 id="nitaqat-bands">Nitaqat Bands — Benefits and Restrictions</h2>
    <p>The Nitaqat system classifies companies into <strong>5 color-coded bands</strong>:</p>

    <h3>🟪 Platinum Band (40%+ Saudization)</h3>
    <ul>
        <li><strong>Fast-track visa processing</strong> — expedited work permit issuance</li>
        <li><strong>Priority in government contracts</strong> — eligible for all tenders</li>
        <li><strong>Premium government services</strong> — dedicated service channels</li>
        <li><strong>Unlimited employee transfers</strong> — can recruit from any company</li>
        <li><strong>Extended visa validity</strong> — longer exit/re-entry options</li>
    </ul>

    <h3>🟩 High Green Band (26–40%)</h3>
    <ul>
        <li><strong>Most benefits</strong> — easy visa processing and renewals</li>
        <li><strong>Employee transfers allowed</strong> — from Red/Yellow companies</li>
        <li><strong>Government contract eligible</strong></li>
        <li><strong>Branch expansion</strong> — no restrictions</li>
    </ul>

    <h3>🟢 Mid Green Band (19–26%)</h3>
    <ul>
        <li><strong>Basic government services</strong> — standard processing times</li>
        <li><strong>Good standing</strong> — no penalties</li>
        <li><strong>Limited transfer ability</strong> — from Red companies only</li>
    </ul>

    <h3>🟡 Low Green Band (16–19%)</h3>
    <ul>
        <li><strong>Needs improvement</strong> — warning status</li>
        <li><strong>Limited visa quotas</strong> — restricted new hires</li>
        <li><strong>Cannot transfer employees from Green+ companies</strong></li>
    </ul>

    <h3>🔴 Red Band (&lt;16% Saudization)</h3>
    <ul>
        <li><strong>Cannot issue new work visas</strong> for expatriates</li>
        <li><strong>Cannot renew work permits</strong> — affects <a href="/ksa/iqama-renewal-calculator">Iqama renewal</a></li>
        <li><strong>Government services suspended</strong> — Qiwa, Muqeem, Absher restricted</li>
        <li><strong>Cannot prevent employee transfers</strong> — expats can leave freely</li>
        <li><strong>Cannot open new branches</strong></li>
        <li><strong>Barred from government contracts</strong></li>
        <li><strong>Cannot change expat professions</strong></li>
        <li><strong>Risk of license suspension</strong></li>
        <li><strong>Financial penalties</strong></li>
    </ul>

    <h2 id="sector-targets">Sector-Specific Targets (2025/2026)</h2>
    <p>The MHRSD has announced <strong>13 sector-specific Saudization targets</strong> for 2025/2026, each with specific effective dates and minimum employee thresholds:</p>
    <table>
        <thead><tr><th>Sector</th><th>Target %</th><th>Effective Date</th><th>Min Employees</th><th>Min Salary</th></tr></thead>
        <tbody>
            <tr><td><strong>Medical Laboratories</strong></td><td>70%</td><td>Apr 17, 2025</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Physiotherapy</strong></td><td>80%</td><td>Apr 17, 2025</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Radiology</strong></td><td>65%</td><td>Apr 17, 2025</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Therapeutic Nutrition</strong></td><td>80%</td><td>Apr 17, 2025</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Dentistry</strong></td><td>45% → 55%</td><td>Jul 27, 2025 → 2026</td><td>3+</td><td>SAR 9,000</td></tr>
            <tr><td><strong>Community Pharmacy</strong></td><td>35%</td><td>Jul 27, 2025</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Hospital Pharmacy</strong></td><td>65%</td><td>Jul 27, 2025</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Other Pharmacy</strong></td><td>55%</td><td>Jul 27, 2025</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Technical Engineering</strong></td><td>30%</td><td>Jul 27, 2025</td><td>5+</td><td>SAR 8,000</td></tr>
            <tr><td><strong>Accounting</strong></td><td>40% → 70%</td><td>Oct 27, 2025 → 5 years</td><td>5+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Consulting / Cybersecurity</strong></td><td>40%</td><td>Ongoing</td><td>3+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Marketing & Sales</strong></td><td>60%</td><td>Jan 2026</td><td>3+</td><td>SAR 4,000</td></tr>
            <tr><td><strong>Procurement</strong></td><td>70%</td><td>Nov 30, 2025</td><td>3+</td><td>SAR 4,000</td></tr>
        </tbody>
    </table>

    <h2 id="qiwa-platform">Qiwa Platform — Mandatory Contract Documentation</h2>
    <p>The <strong>Qiwa platform (قوى)</strong> is the unified digital gateway for labor sector services in Saudi Arabia. A critical change takes effect on <strong>April 15, 2026</strong>:</p>
    <div class="explanation__highlight">
        <strong>⚠️ CRITICAL CHANGE:</strong> From April 15, 2026, <strong>only Saudi employees with electronically documented and approved contracts on Qiwa</strong> will be counted in Saudization calculations. A Saudi registered with GOSI but WITHOUT a verified Qiwa contract will <strong>NOT</strong> count toward your Nitaqat ratio.
    </div>
    <h3>Key Qiwa Features</h3>
    <ul>
        <li><strong>Contract Management</strong> — digitally document all employee contracts</li>
        <li><strong>Real-time Saudization Monitoring</strong> — track your Nitaqat status</li>
        <li><strong>Compliance Alerts</strong> — notifications about changes and deadlines</li>
        <li><strong>Integrated with GOSI</strong> — cross-referenced for verification</li>
        <li><strong>Employee Transfer Services</strong> — manage worker mobility</li>
    </ul>
    <p>GOSI registration is still required for all Saudi employees. Use our <a href="/ksa/gosi-calculator">GOSI Calculator</a> to compute contribution amounts.</p>

    <h2 id="improve-rating">How to Improve Your Nitaqat Rating</h2>
    <ol>
        <li><strong>Hire Saudi graduates</strong> — partner with universities and Tamheer program for internship-to-hire pipelines</li>
        <li><strong>Pay above SAR 4,000</strong> — ensure every Saudi earns at least SAR 4,000 for full count; use our <a href="/ksa/salary-calculator">Salary Calculator</a></li>
        <li><strong>Employ people with disabilities</strong> — 4x multiplier (max 10%); significant Saudization boost</li>
        <li><strong>Offer remote work options</strong> — remote Saudis count as full 1.0 employees</li>
        <li><strong>Document ALL contracts on Qiwa</strong> — mandatory from Apr 2026</li>
        <li><strong>Retain Saudi employees</strong> — high turnover nullifies hiring efforts; invest in career development</li>
        <li><strong>Use part-time Saudis</strong> — 0.5 count helps boost numbers for smaller companies</li>
        <li><strong>Consider sector-specific minimums</strong> — SAR 8K for engineers, SAR 9K for dentists</li>
        <li><strong>Avoid fake Saudization</strong> — fines of SAR 20,000–100,000, possible criminal prosecution</li>
        <li><strong>Plan for Developed Nitaqat (2026–2028)</strong> — targets will increase further</li>
    </ol>

    <h2 id="iqama-impact">Impact on Iqama and Work Permit Costs</h2>
    <p>Your Nitaqat band directly affects the cost and feasibility of maintaining expatriate workers:</p>
    <table>
        <thead><tr><th>Nitaqat Impact</th><th>Green/Platinum</th><th>Red Zone</th></tr></thead>
        <tbody>
            <tr><td><strong>Work Permit Fee</strong></td><td>SAR 700/mo/expat</td><td>SAR 800/mo/expat</td></tr>
            <tr><td><strong>Annual Difference</strong></td><td>SAR 8,400/year</td><td>SAR 9,600/year</td></tr>
            <tr><td><strong>New Visas</strong></td><td>✅ Can issue</td><td>❌ Blocked</td></tr>
            <tr><td><strong>Iqama Renewal</strong></td><td>✅ Normal</td><td>❌ Blocked</td></tr>
            <tr><td><strong>Employee Retention</strong></td><td>Can block transfers</td><td>Cannot prevent transfers</td></tr>
        </tbody>
    </table>
    <p>The <strong>SAR 1,200/year per worker</strong> difference in work permit fees alone makes compliance financially worthwhile. For detailed Iqama cost calculations, use our <a href="/ksa/iqama-renewal-calculator">Iqama Renewal Calculator</a>.</p>

    <h2 id="fake-saudization">Warning: Fake Saudization (السعودة الوهمية)</h2>
    <p>Fake Saudization — registering Saudi nationals on company payroll without actual employment — is a <strong>serious criminal offense</strong>:</p>
    <ul>
        <li><strong>Financial penalties</strong>: SAR 20,000–100,000 per violation</li>
        <li><strong>Company closure</strong>: Temporary or permanent business shutdown</li>
        <li><strong>Commercial ban</strong>: Prohibition from commercial activities</li>
        <li><strong>Criminal prosecution</strong>: Referral to Public Prosecution</li>
        <li><strong>Imprisonment</strong>: Possible for repeated or large-scale violations</li>
    </ul>
    <p>MHRSD actively audits companies using data cross-referencing between <strong>Qiwa, GOSI, and banking records</strong>. The risks far outweigh any short-term gain.</p>

    <h2 id="vision-2030">Vision 2030 Employment Goals</h2>
    <p>Saudization is a cornerstone of <strong>Vision 2030's</strong> economic transformation:</p>
    <ul>
        <li><strong>Unemployment target</strong>: Reduce from 12.3% to 7% by 2030</li>
        <li><strong>Female participation</strong>: Increase women's workforce participation to 30%+</li>
        <li><strong>Private sector growth</strong>: Increase private sector GDP contribution from 40% to 65%</li>
        <li><strong>Quality jobs</strong>: Focus on high-skilled, well-paying positions for nationals</li>
        <li><strong>Developed Nitaqat (2026–2028)</strong>: 340,000+ additional private-sector jobs to localize</li>
    </ul>
    <p>For workers planning their career finances, our <a href="/ksa/end-of-service-calculator">End of Service Calculator</a> helps compute EOSB entitlements, while the <a href="/ksa/savings-goal-calculator">Savings Goal Calculator</a> helps plan long-term financial objectives.</p>
`;
