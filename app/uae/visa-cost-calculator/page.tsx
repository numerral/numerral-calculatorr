import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEVisaCostCalculatorCore from "@/components/calculator/UAEVisaCostCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Visa Cost Calculator 2025 — Tourist, Employment, Golden & Green Visa Fees",
    description: "Calculate the total cost of any UAE visa: tourist, employment, Golden Visa, Green Visa, family, student, and remote work. Instant breakdown of application fees, medical, Emirates ID, and stamping costs. Includes overstay fine calculator and 2025 new visa types.",
    keywords: ["UAE visa cost calculator", "Dubai visa fees 2025", "Golden Visa cost UAE", "Green Visa cost", "UAE employment visa fees", "family visa UAE cost", "UAE overstay fine calculator", "tourist visa Dubai price", "UAE visa types 2025", "Emirates ID cost"],
    alternates: { canonical: canonicalUrl("/uae/visa-cost-calculator") },
};

const FAQ_ITEMS = [
    { question: "How much does a UAE tourist visa cost in 2025?", answer: "A UAE tourist visa costs between AED 350 and AED 2,500 depending on duration and entry type. A 30-day single entry visa costs approximately AED 350–500, a 60-day costs AED 500–750, and a 90-day costs AED 600–700 for single entry. Multiple entry visas are pricier: a 30-day multiple entry is about AED 600–700, while a 60-day multiple entry costs AED 950–1,200. These prices may include travel insurance and service fees. Extensions cost approximately AED 1,100 per 30-day period (including the AED 500 in-country fee and VAT)." },
    { question: "What is the total cost of a UAE employment visa?", answer: "The total cost of a UAE employment visa ranges from AED 3,000 to AED 7,000 for a 2-year visa. The breakdown typically includes: work permit approval (AED 200 + 5% VAT), work permit fee (AED 0 for Class 1 companies, AED 300–1,500 for Class 2, AED 5,000 for Class 3), medical examination (AED 300–500), Emirates ID (AED 370 for 2 years), residency visa stamping (AED 510–560), and typing center fees (AED 100–200). Free zone employees typically pay AED 2,500–6,500 total. Crucially, under UAE law, the employer is legally required to pay all visa costs — employees should never be charged." },
    { question: "How much does a Golden Visa cost for property investors?", answer: "A Golden Visa for property investors costs approximately AED 9,685–15,000 in government and processing fees. This includes: application/processing fee (AED 3,200–3,800), Emirates ID for 10 years (AED 1,070–1,400), medical examination (AED 500–1,000), health insurance annual premium (AED 800–2,500), and Dubai Land Department nomination letter (AED 320). To qualify, you must own property worth at least AED 2,000,000 (for a 10-year visa) or AED 750,000 (for a 5-year visa). The property investment itself is not included in the visa cost — it's the eligibility criterion." },
    { question: "What is the difference between Golden Visa and Green Visa?", answer: "The Golden Visa (5 or 10 years) targets investors, skilled professionals, and entrepreneurs with higher thresholds — AED 2M property or AED 30,000/mo salary. The Green Visa (5 years) is designed for freelancers, self-employed, and skilled employees with lower thresholds — AED 1M business investment or AED 15,000/mo salary. Both are self-sponsored (no employer needed), offer family sponsorship, have a 6-month grace period after expiry, and benefit from 0% personal income tax. The Golden Visa costs ~AED 5,300–15,000 while the Green Visa costs ~AED 4,700–13,700 (including freelance permit). The Green Visa allows sponsoring parents; the Golden Visa sponsors children of any age." },
    { question: "Can I sponsor my family on a Green Visa?", answer: "Yes, Green Visa holders can sponsor: spouse, sons up to age 25, unmarried daughters of any age, and parents. The salary threshold for family sponsorship is AED 4,000/mo for a male sponsor (AED 3,000 if employer provides housing) or AED 10,000/mo for a female sponsor. Each dependent costs approximately AED 4,000–7,000 to sponsor, including application fees, medical test, Emirates ID, visa stamping, typing fees, and health insurance. You also need an Ejari-registered tenancy contract as proof of accommodation." },
    { question: "What salary do I need to sponsor my spouse in the UAE?", answer: "Male residents need a minimum monthly salary of AED 4,000 (or AED 3,000 if the employer provides accommodation) to sponsor a spouse. Female residents need AED 10,000/mo (or AED 8,000 with employer housing). For sponsoring parents, both genders need AED 10,000/mo minimum, with elderly parents requiring AED 20,000/mo. To sponsor second-degree relatives for a visit visa, you need AED 8,000/mo, and for friends, AED 15,000/mo. Use our Salary Calculator to verify if your net salary meets these thresholds." },
    { question: "How much is the UAE overstay fine per day?", answer: "The UAE overstay fine is AED 50 per day, starting from the day immediately after your visa expires. Additionally, there is an exit service fee (out-pass fee) of approximately AED 100–350 when departing. This accumulates quickly: 7 days = AED 350 + exit fee; 30 days = AED 1,500 + exit fee; 90 days = AED 4,500 + exit fee; 1 year = AED 18,250 + exit fee. Extended overstay can result in travel bans, inability to re-enter the UAE, and legal action. Fines can be paid at airport immigration, Amer Centers, ICP service centers, or online through GDRFA/ICP portals." },
    { question: "Does my employer have to pay for my visa?", answer: "Yes — under UAE Federal Decree-Law No. 33/2021 on the Regulation of Labor Relations and Ministerial Decree No. 1 of 2022, employers are legally obligated to bear all costs related to the recruitment, employment, and residency of their employees. This includes: work permit fees, medical examination, Emirates ID, residency visa stamping, and any status change fees. Deducting visa costs from an employee's salary is illegal. If your employer asks you to pay for your own visa or deducts visa costs from your wages, you can file a complaint with MoHRE (Ministry of Human Resources and Emiratisation)." },
    { question: "What are the new 2025 UAE visa types?", answer: "The UAE introduced four new visa categories effective August 10, 2025: (1) AI Professional Visa — a 60/90-day multiple-entry visa for foreign nationals working in artificial intelligence, extendable up to 180 days. (2) Event Visa — 30/60-day visa for individuals attending economic, cultural, sports, and educational events, extendable up to 180 days. (3) Commercial Gaming Visa — 30-day single-entry visa for individuals in commercial gaming activities, with one 30-day renewal. (4) Cruise and Leisure Boat Visa — 30-day multiple-entry visa for tourists arriving by cruise ship or recreational boat, with a 30-day extension option." },
    { question: "How do I extend my tourist visa inside the UAE?", answer: "Tourist visas can be extended for 30 days at a time, typically up to twice (total maximum stay of 120-180 days depending on visa type). To extend: (1) Apply through the ICP website (icp.gov.ae), GDRFA website (for Dubai), or visit an Amer Center. (2) Pay the extension fee of approximately AED 600 + 5% VAT. (3) If extending from inside the UAE, an additional AED 500 in-country fee applies, bringing the total to approximately AED 1,100 per 30-day extension. Important: apply before your current visa expires — the previous 10-day grace period generally no longer applies to tourist visas. Late extensions risk overstay fines." },
    { question: "How much does it cost to sponsor parents in the UAE?", answer: "Sponsoring a parent to the UAE costs approximately AED 4,000–7,000 per parent. The cost breakdown includes: application fee (~AED 200), medical test (~AED 400–500), Emirates ID (~AED 370), visa stamping (~AED 750), typing fees (~AED 150), and health insurance (~AED 800–1,500 per year, higher for elderly). The salary requirement is AED 10,000/mo minimum, with elderly parents requiring AED 20,000/mo. You must also provide proof that you are the sole supporter of the parent and have adequate accommodation (Ejari/tenancy contract required)." },
    { question: "What is the visa cost for remote workers?", answer: "The UAE Remote Work Visa costs approximately AED 5,390 total. This includes: application fee (~AED 2,870), medical examination (~AED 500), Emirates ID (~AED 370), typing fees (~AED 150), and health insurance (~AED 1,500/year). It is valid for 1 year and renewable. To qualify, you must earn at least USD 5,000 per month (approximately AED 18,360), provide proof of employment with an overseas company, and have comprehensive health insurance coverage. The visa allows you to live in the UAE while working for your international employer — you pay 0% personal income tax." },
    { question: "Can students work on a UAE student visa?", answer: "Yes, students on a UAE student visa can work part-time for up to 20 hours per week during term time, and full-time during official university breaks. To work legally, students need: (1) Written permission from their sponsoring university. (2) A work permit from the UAE Labor Department. (3) The job must not conflict with academic studies. Some free zones offer student work permits more easily. A student visa costs approximately AED 3,370 (application + medical + Emirates ID + stamping + typing + insurance) and is valid for 1 year, renewable annually as long as enrollment continues." },
    { question: "What documents do I need for a family visa?", answer: "Documents required for a UAE family visa include: (1) Passport copies of sponsor and all family members (valid 6+ months). (2) Sponsor's UAE residence visa and Emirates ID copy. (3) Passport-sized photographs. (4) Attested marriage certificate (for spouse — must be attested by UAE Embassy in home country and MOFA in UAE). (5) Attested birth certificates (for children). (6) Tenancy contract (Ejari registration in Dubai). (7) Salary certificate or employment contract. (8) Bank statements from last 3 months. (9) Medical fitness test reports (for applicants 18+). (10) Health insurance for all dependents. Special cases: unmarried daughters have no age limit; children with special needs can be sponsored regardless of age." },
    { question: "How long does UAE visa processing take?", answer: "Processing times vary by visa type: Tourist visa: 2–5 business days (standard) or 24–48 hours (express). Employment visa: 5–15 business days (standard) or 3–5 days (express). Golden Visa: 10–30 business days (standard) or 5–10 days (express). Green Visa: 10–20 business days (standard) or 5–7 days (express). Family visa: 5–15 business days (standard) or 3–5 days (express). Student visa: 7–14 business days. Remote Work visa: 5–10 business days. Application channels: ICP website (icp.gov.ae), GDRFA Dubai (gdrfad.gov.ae), Amer Centers (walk-in), and the U.ae federal portal." },
];

export default function VisaCostCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Visa Cost Calculator" },
        ]),
        webAppSchema("Visa Cost Calculator", canonicalUrl("/uae/visa-cost-calculator")),
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
            <Script id="schema-visa-cost" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Visa Cost Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Visa Cost Calculator 2025 — Tourist, Employment, Golden & Green Visa Fees</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate the total cost of any UAE visa with our interactive tool. Get an instant itemized breakdown of government fees, medical, Emirates ID, stamping, and insurance costs. Covers 15+ visa types including the new 2025 AI Professional and Event visas. Includes overstay fine calculator and family sponsorship cost estimation.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAEVisaCostCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE Visa Costs FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Check if your salary meets sponsorship thresholds</div>
                        </div>
                    </Link>
                    <Link href="/uae/gratuity-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💼</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Gratuity Calculator</div>
                            <div className="uae-related-link__desc">End-of-service benefits linked to visa duration</div>
                        </div>
                    </Link>
                    <Link href="/uae/mortgage-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Mortgage Calculator</div>
                            <div className="uae-related-link__desc">Property investment for Golden Visa eligibility</div>
                        </div>
                    </Link>
                    <Link href="/uae/currency-converter" className="uae-related-link">
                        <span className="uae-related-link__icon">💱</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Currency Converter</div>
                            <div className="uae-related-link__desc">Convert visa fees to your home currency</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="visa-overview">UAE Visa System Overview</h2>
    <p>The <strong>United Arab Emirates visa system</strong> is managed by three primary government entities: the <strong>Federal Authority for Identity, Citizenship, Customs, and Port Security (ICP)</strong>, which handles visa policy at the federal level; the <strong>General Directorate of Residency and Foreigners Affairs (GDRFA)</strong>, which manages emirate-specific visa processing (most notably in Dubai); and the <strong>Ministry of Human Resources and Emiratisation (MoHRE)</strong>, which handles employment-related permits and labor cards.</p>
    <p>The UAE offers <strong>15+ distinct visa types</strong> in 2025, ranging from short-term tourist visas (30 days) to long-term Golden Visas (10 years). The cost structure typically includes several components:</p>
    <ul>
        <li><strong>Application/processing fee</strong> — paid to ICP or GDRFA</li>
        <li><strong>Medical examination</strong> — mandatory fitness test (blood test + chest X-ray)</li>
        <li><strong>Emirates ID</strong> — biometric identity card (required for all residents)</li>
        <li><strong>Visa stamping</strong> — passport endorsement</li>
        <li><strong>Typing/service center fees</strong> — document processing at authorized centers</li>
        <li><strong>Health insurance</strong> — mandatory for all residents</li>
    </ul>
    <p>Understanding these cost components helps you plan your <a href="/uae/salary-calculator">salary budget</a> and avoid surprise expenses when relocating to the UAE.</p>

    <h2 id="tourist-visa">Tourist Visa — Complete Guide</h2>
    <p>Tourist visas are the most commonly issued UAE visas, with millions processed annually. They come in two main types — single entry and multiple entry — across three durations:</p>
    <table>
        <thead><tr><th>Type</th><th>Duration</th><th>Cost (AED)</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>30-Day Single Entry</strong></td><td>30 days</td><td>350–500</td><td>Short holidays, business trips</td></tr>
            <tr><td><strong>60-Day Single Entry</strong></td><td>60 days</td><td>500–750</td><td>Extended vacations</td></tr>
            <tr><td><strong>90-Day Single Entry</strong></td><td>90 days</td><td>600–700</td><td>Long stays, property viewing</td></tr>
            <tr><td><strong>30-Day Multiple Entry</strong></td><td>30 days/visit, 5yr validity</td><td>600–700</td><td>Frequent visitors</td></tr>
            <tr><td><strong>60-Day Multiple Entry</strong></td><td>60 days/visit, 5yr validity</td><td>950–1,200</td><td>Business travelers</td></tr>
        </tbody>
    </table>
    <h3>Extensions</h3>
    <p>Tourist visas can be extended for <strong>30 days at a time</strong> from inside the UAE. The cost per extension is approximately <strong>AED 1,100</strong> (AED 600 base + AED 500 in-country fee + VAT). Most tourist visas allow up to two extensions, giving a maximum total stay of 120–180 days. Apply before your current visa expires — overstay fines start immediately.</p>
    <div class="explanation__highlight">
        <strong>Free entry for 98+ nationalities:</strong> Citizens of many countries (including all EU, UK, US, Canada, Australia) receive a <strong>free 30-day visa-on-arrival</strong> stamp at UAE airports. This can be extended once for AED 600–1,100. GCC nationals enter freely with no visa required.
    </div>

    <h2 id="employment-visa">Employment Visa — Full Breakdown</h2>
    <p>The UAE employment visa is issued for 2–3 years and is <strong>always sponsor by the employer</strong>. The total cost ranges from <strong>AED 3,000 to AED 7,000</strong>, with the most significant variable being the company's MoHRE classification:</p>
    <table>
        <thead><tr><th>Component</th><th>Class 1</th><th>Class 2</th><th>Class 3</th></tr></thead>
        <tbody>
            <tr><td><strong>Work permit fee</strong></td><td>AED 0</td><td>AED 300–1,500</td><td>AED 5,000</td></tr>
            <tr><td>Initial approval</td><td colspan="3">AED 210 (incl. 5% VAT)</td></tr>
            <tr><td>Medical examination</td><td colspan="3">AED 300–500</td></tr>
            <tr><td>Emirates ID (2yr)</td><td colspan="3">AED 370</td></tr>
            <tr><td>Visa stamping</td><td colspan="3">AED 510–560</td></tr>
            <tr><td>Typing center fees</td><td colspan="3">AED 100–200</td></tr>
            <tr><td>Status change (if inside UAE)</td><td colspan="3">AED 500–650</td></tr>
            <tr><td><strong>Total estimate</strong></td><td><strong>~AED 3,200</strong></td><td><strong>~AED 4,500</strong></td><td><strong>~AED 7,000</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>⚖️ Legal requirement:</strong> Under UAE Federal Decree-Law No. 33/2021, <strong>employers must pay all visa and recruitment costs</strong>. Deducting these from employee salaries is illegal. If this happens, file a complaint with MoHRE directly. Use our <a href="/uae/salary-calculator">Salary Calculator</a> to understand your full employment package.
    </div>
    <h3>Senior Worker Surcharge</h3>
    <p>Foreign workers <strong>aged 65 and above</strong> incur an additional one-time surcharge of <strong>AED 5,000</strong> on top of standard visa fees. This applies to both new visas and renewals.</p>

    <h2 id="golden-visa">Golden Visa — Everything You Need to Know</h2>
    <p>The <strong>UAE Golden Visa</strong> is a long-term residency program offering 5 or 10-year renewable residency. It's self-sponsored (no employer needed) and offers unique benefits including 0% income tax, family sponsorship, and no requirement for a local sponsor.</p>
    <h3>Golden Visa Categories & Costs</h3>
    <table>
        <thead><tr><th>Category</th><th>Duration</th><th>Visa Cost (AED)</th><th>Investment/Eligibility</th></tr></thead>
        <tbody>
            <tr><td><strong>Property Investor</strong></td><td>10 years</td><td>~10,000</td><td>Property ≥ AED 2,000,000</td></tr>
            <tr><td><strong>Property Investor</strong></td><td>5 years</td><td>~8,500</td><td>Property ≥ AED 750,000</td></tr>
            <tr><td><strong>Skilled Professional</strong></td><td>10 years</td><td>~7,500</td><td>Salary ≥ AED 30,000/mo + priority field</td></tr>
            <tr><td><strong>Entrepreneur</strong></td><td>10 years</td><td>~7,500</td><td>Business value ≥ AED 500,000</td></tr>
            <tr><td><strong>Outstanding Student</strong></td><td>5 years</td><td>~5,300</td><td>GPA ≥ 3.8 or top 500 university</td></tr>
            <tr><td><strong>Retiree</strong></td><td>5 years</td><td>~8,900</td><td>Age 55+; AED 1M property/savings or AED 15K/mo</td></tr>
        </tbody>
    </table>
    <p>For property investors, the <strong>property value is the eligibility criterion</strong>, not an additional cost. If you're considering property investment, use our <a href="/uae/mortgage-calculator">Mortgage Calculator</a> to estimate monthly payments on a qualifying property worth AED 2M+.</p>
    <h3>Family Sponsorship on Golden Visa</h3>
    <p>Golden Visa holders can sponsor their spouse, children (of any age — unlike regular visas), and household staff. Each dependent costs approximately <strong>AED 5,870–8,270</strong> including visa application, medical test, Emirates ID, and health insurance.</p>

    <h2 id="green-visa">Green Visa — Self-Sponsored Residency</h2>
    <p>The <strong>UAE Green Visa</strong> is a 5-year self-sponsored residency introduced to attract freelancers, skilled employees, and business investors who don't qualify for the Golden Visa but still want independence from employer sponsorship.</p>
    <table>
        <thead><tr><th>Category</th><th>Visa Cost (AED)</th><th>Eligibility</th></tr></thead>
        <tbody>
            <tr><td><strong>Freelancer / Self-Employed</strong></td><td>~13,700 (incl. permit)</td><td>Bachelor's degree + AED 360,000/yr income for 2 years</td></tr>
            <tr><td><strong>Skilled Employee</strong></td><td>~5,700</td><td>Salary ≥ AED 15,000/mo + bachelor's + MoHRE level 1-3</td></tr>
            <tr><td><strong>Business Investor</strong></td><td>~5,700</td><td>Investment ≥ AED 1,000,000 + valid trade license</td></tr>
        </tbody>
    </table>
    <p>Key benefits: <strong>6-month grace period</strong> after expiry (vs. 30 days for regular visas), ability to sponsor spouse, children up to 25, unmarried daughters of any age, and parents. No employer sponsorship needed — you can change jobs freely.</p>

    <h2 id="family-visa">Family Visa & Sponsorship</h2>
    <p>UAE residents can sponsor immediate family members for <strong>dependent/family residence visas</strong>. The cost is approximately <strong>AED 4,000–7,000 per dependent</strong>, and you must meet minimum salary thresholds:</p>
    <table>
        <thead><tr><th>Relationship</th><th>Male Sponsor Salary</th><th>Female Sponsor Salary</th></tr></thead>
        <tbody>
            <tr><td><strong>Spouse & children</strong></td><td>AED 4,000/mo (3,000 with housing)</td><td>AED 10,000/mo (8,000 with housing)</td></tr>
            <tr><td><strong>Parents</strong></td><td>AED 10,000/mo</td><td>AED 10,000/mo</td></tr>
            <tr><td><strong>Elderly parents</strong></td><td>AED 20,000/mo</td><td>AED 20,000/mo</td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/uae/salary-calculator">Salary Calculator</a> to check if your net monthly salary meets these thresholds. Sons can be sponsored up to age 25; unmarried daughters and children with special needs have no age limit.</p>

    <h2 id="student-job-seeker">Student & Job Seeker Visas</h2>
    <h3>Student Visa</h3>
    <p>The UAE student visa costs approximately <strong>AED 3,370</strong> and is valid for 1 year, renewable annually. It's sponsored by the educational institution and allows <strong>part-time work</strong> (up to 20 hours/week during term, full-time during breaks) with university permission and a work permit from the Labor Department.</p>
    <h3>Job Seeker Visa</h3>
    <p>Introduced for professionals and graduates from top universities, the job seeker visa costs <strong>AED 700 (60 days)</strong> to <strong>AED 1,800 (120 days)</strong>. It cannot be renewed but can be converted to an employment visa if you secure a job. Eligibility: bachelor's degree from a top 500 globally-ranked university or recognized professional qualifications.</p>

    <h2 id="remote-retirement">Remote Work & Retirement Visas</h2>
    <h3>Remote Work Visa (Digital Nomad)</h3>
    <p>The remote work visa allows foreign professionals working for international companies to live in the UAE for <strong>1 year (renewable)</strong>. Total cost: approximately <strong>AED 5,390</strong>. You must earn at least <strong>USD 5,000 per month</strong> (AED 18,360) and provide employment proof. You benefit from <strong>0% personal income tax</strong> while enjoying UAE residency.</p>
    <h3>Retirement Visa</h3>
    <p>For retirees aged <strong>55 and above</strong>, the retirement visa offers 5-year residency costing approximately <strong>AED 7,420</strong>. Eligibility requires one of: property valued at AED 1,000,000+, bank savings of AED 1,000,000+, or monthly income of AED 15,000+. Family members can be sponsored.</p>

    <h2 id="2025-visas">New 2025 Visa Categories</h2>
    <p>Effective <strong>August 10, 2025</strong>, the UAE introduced four new visa categories to attract global talent and promote specific sectors:</p>
    <table>
        <thead><tr><th>New Visa</th><th>Duration</th><th>Extendable</th><th>Target Audience</th></tr></thead>
        <tbody>
            <tr><td><strong>AI Professional Visa</strong></td><td>60/90 days</td><td>Up to 180 days</td><td>Foreign nationals in artificial intelligence</td></tr>
            <tr><td><strong>Event Visa</strong></td><td>30/60 days</td><td>Up to 180 days</td><td>Attendees of economic, cultural, sports events</td></tr>
            <tr><td><strong>Commercial Gaming Visa</strong></td><td>30 days</td><td>1 renewal (30d)</td><td>Individuals in commercial gaming activities</td></tr>
            <tr><td><strong>Cruise/Leisure Boat Visa</strong></td><td>30 days</td><td>30-day extension</td><td>Tourists arriving by cruise or recreational boat</td></tr>
        </tbody>
    </table>
    <p>The AI Professional Visa is particularly notable — it reflects the UAE's strategic focus on becoming a global AI hub, complementing the country's existing investments in artificial intelligence and technology infrastructure.</p>

    <h2 id="overstay">Overstay Fines & Grace Periods</h2>
    <p>Overstaying your UAE visa incurs a fine of <strong>AED 50 per day</strong>, plus an exit service fee of <strong>AED 100–350</strong>. The fines accumulate quickly:</p>
    <table>
        <thead><tr><th>Overstay Period</th><th>Fine</th><th>+ Exit Fee</th><th>Total</th></tr></thead>
        <tbody>
            <tr><td>7 days</td><td>AED 350</td><td>AED 220</td><td><strong>AED 570</strong></td></tr>
            <tr><td>30 days</td><td>AED 1,500</td><td>AED 220</td><td><strong>AED 1,720</strong></td></tr>
            <tr><td>90 days</td><td>AED 4,500</td><td>AED 220</td><td><strong>AED 4,720</strong></td></tr>
            <tr><td>180 days</td><td>AED 9,000</td><td>AED 220</td><td><strong>AED 9,220</strong></td></tr>
            <tr><td>1 year</td><td>AED 18,250</td><td>AED 220</td><td><strong>AED 18,470</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Grace periods:</strong> Residence visas have a <strong>30-day grace period</strong> after expiry to renew, change status, or exit without fines. For tourist visas, this grace period is disputed — some sources say 10 days, others say none. <strong>Always verify with ICP or GDRFA</strong> before your visa expires. The safest approach is to act before your visa reaches its expiry date.
    </div>

    <h2 id="how-to-apply">How to Apply</h2>
    <p>UAE visa applications can be submitted through several channels depending on the visa type:</p>
    <table>
        <thead><tr><th>Channel</th><th>Visa Types</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>ICP (icp.gov.ae)</strong></td><td>All federal visas</td><td>Primary portal for Golden, Green, Remote Work</td></tr>
            <tr><td><strong>GDRFA Dubai</strong></td><td>Dubai-specific visas</td><td>gdrfad.gov.ae — tourist and residence visas</td></tr>
            <tr><td><strong>Amer Centers</strong></td><td>All UAE visas (walk-in)</td><td>Dubai walk-in service centers</td></tr>
            <tr><td><strong>TAMM (Abu Dhabi)</strong></td><td>Abu Dhabi visas</td><td>tamm.abudhabi.ae</td></tr>
            <tr><td><strong>U.ae</strong></td><td>Federal services</td><td>Unified government portal</td></tr>
            <tr><td><strong>Airlines (e& / du)</strong></td><td>Tourist visas</td><td>Available through Emirates, Etihad booking</td></tr>
            <tr><td><strong>Travel agencies</strong></td><td>Tourist and visit visas</td><td>Authorized agents — verify accreditation</td></tr>
        </tbody>
    </table>

    <h2 id="cost-saving">Cost-Saving Tips</h2>
    <ol>
        <li><strong>Use official channels</strong> — Apply directly through ICP or GDRFA to avoid agency markups of AED 200–500.</li>
        <li><strong>Check visa-on-arrival eligibility</strong> — 98+ nationalities get free 30-day entry; don't pay for a tourist visa unnecessarily.</li>
        <li><strong>Golden vs Green</strong> — If you meet both criteria, compare total costs; the Green Visa may be cheaper for freelancers.</li>
        <li><strong>Time your extensions</strong> — Renew or exit before your visa expires to avoid AED 50/day overstay fines.</li>
        <li><strong>Negotiate employment packages</strong> — Ensure your employer covers all visa costs (it's the law) and ask about family sponsorship support.</li>
        <li><strong>Compare free zones</strong> — Employment visa costs vary by free zone; some offer packages as low as AED 2,500.</li>
        <li><strong>Group family applications</strong> — Processing multiple dependents together can save typing and service center fees.</li>
        <li><strong>Use the right <a href="/uae/salary-calculator">salary benchmark</a></strong> — Know if your salary qualifies for family sponsorship before incurring costs.</li>
        <li><strong>Consider remote work visa</strong> — If you work for an overseas company, it costs ~AED 5,400/year with 0% income tax.</li>
        <li><strong>Convert <a href="/uae/currency-converter">visa fees to your currency</a></strong> — Plan your budget accurately before arriving in the UAE.</li>
    </ol>
`;
