import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import AgeCalculatorIndiaCore from "@/components/calculator/AgeCalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Age Calculator India 2026 — Exact Age, Legal Milestones & Age Difference",
    description: "Free age calculator for India. Calculate exact age in years, months, days. Track India legal milestones — voting age 18, driving license, marriage age, senior citizen 60+, retirement, school admission (NEP 2020). Compare ages and find birthday countdown.",
    keywords: ["age calculator India", "age calculator", "calculate age from date of birth", "India legal age milestones", "voting age India", "senior citizen age India", "driving license age", "marriage age India", "school admission age NEP 2020", "age difference calculator"],
    alternates: buildCountryAlternates("IN", "/in/age-calculator", "age-calculator"),
};

const FAQ_ITEMS = [
    { question: "How is age calculated in India?", answer: "Age in India is calculated from the date of birth (DOB) to the current date using the Gregorian calendar. The formula counts completed years, months, and days. For official purposes like government forms, competitive exams, and legal documents, India follows the 'completed years' method — you are considered a certain age only after your birthday passes. For example, if born on 15 Jan 2000, you turn 26 only on 15 Jan 2026, not before." },
    { question: "What is the voting age in India?", answer: "The voting age in India is 18 years. This was lowered from 21 to 18 by the 61st Constitutional Amendment Act, 1988. To vote, you must be 18 years old on the qualifying date (1st January of the year elections are held) and must be registered in the electoral roll. You can apply for Voter ID (EPIC) through the NVSP portal once you turn 18." },
    { question: "What is the legal driving age in India?", answer: "Under the Motor Vehicles Act, 1988: (1) 16 years — Learner's license for gearless motorcycles with engine capacity up to 50cc. (2) 18 years — Driving license for cars, motorcycles with gear, and all light motor vehicles. (3) 20+ years — Commercial vehicle license (transport vehicles). The learner's license is valid for 6 months, after which you can apply for a permanent driving license by passing a driving test." },
    { question: "What is the legal marriage age in India?", answer: "Under the Prohibition of Child Marriage Act (PCMA) 2006, the minimum legal marriage age is 18 years for women and 21 years for men. Marriages below these ages are voidable (can be annulled). There have been proposals to raise women's marriage age to 21, but as of 2026, the law remains 18/21. For special marriage under the Special Marriage Act, 1954, the same age limits apply." },
    { question: "What is the legal drinking age in India?", answer: "The legal drinking age varies by state in India: 18 years — Goa, Himachal Pradesh, Puducherry, Rajasthan, Sikkim. 21 years — Delhi, Karnataka, West Bengal, Tamil Nadu, Maharashtra, and most states. 23 years — Kerala. 25 years — Punjab, Haryana, Chandigarh. Completely prohibited — Bihar, Gujarat, Mizoram, Nagaland, Lakshadweep. This is a state subject under the Indian Constitution, so there's no uniform national drinking age." },
    { question: "What age is a 'Senior Citizen' in India?", answer: "In India, a Senior Citizen is defined as a person aged 60 years and above under the Income Tax Act. Senior citizens (60–79) get a higher basic exemption limit (₹3,00,000 under the old regime). Super Senior Citizens (80+) get an even higher limit (₹5,00,000). For banking purposes, senior citizens get 0.25–0.50% higher interest rates on FDs. Note: Railway concessions for senior citizens were suspended in 2020 and have not been restored." },
    { question: "What is the retirement age in India?", answer: "Retirement age varies: Central Government employees — 60 years (62 for some specialized roles). State Government — 58–62 years depending on the state. Private sector — Usually 58–60 as per company policy (not governed by law). EPFO/PF withdrawal — Full withdrawal allowed at age 58. NPS vesting — Age 60. Judges: High Court — 62, Supreme Court — 65." },
    { question: "What is the school admission age under NEP 2020?", answer: "Under NEP 2020 and the RTE Act, the minimum age for admission to Class 1 is 6 years as of the academic year cutoff date. Most states follow June 1 or April 1 as the cutoff. Some states have specific variations — for example, Delhi uses March 31, while Karnataka uses June 1. The NEP 2020 also introduced a 5+3+3+4 structure starting with Foundational Stage at age 3." },
    { question: "How does age affect income tax in India?", answer: "Under the old tax regime: Below 60 — Basic exemption ₹2,50,000. Senior Citizen (60–79) — Exemption ₹3,00,000. Super Senior (80+) — Exemption ₹5,00,000. Under the new tax regime (optional): No age-based difference — exemption is ₹3,00,000 for all. The new regime offers lower rates but fewer deductions. Senior citizens are also exempt from advance tax if they don't have business income." },
    { question: "At what age can you get an Aadhaar card?", answer: "There is no minimum age for Aadhaar enrollment — even newborns can get it. Children under 5 receive a 'Baal Aadhaar' (blue color) based on the parent's biometrics. Mandatory biometric updates are required at: Age 5 — First biometric update (fingerprints, iris, photo captured). Age 15 — Second mandatory biometric update. After 15, no further mandatory updates are needed. PAN card also has no age restriction — minors can get one through a guardian." },
    { question: "How is age calculated for leap year babies (Feb 29)?", answer: "People born on February 29 (leap year) celebrate their birthday on Feb 28 or March 1 in non-leap years — there's no legal standard. For official Indian government purposes (competitive exams, retirement), Feb 29 birthdays are typically treated as March 1 in non-leap years. This means a person born on 29 Feb 2000 is considered to have turned 26 on 1 March 2026, not 28 February." },
    { question: "Can a 16-year-old drive a car in India?", answer: "No. Under the Motor Vehicles Act, 1988, you must be 18 years old to get a driving license for cars, motorcycles with gear, or any light motor vehicle. At 16, you can only get a learner's license for a gearless motorcycle with an engine capacity of 50cc or below, and you need written parental consent. Driving a car at 16 is illegal and can result in fines and vehicle seizure." },
    { question: "What is the age limit for government job exams in India?", answer: "Age limits vary by exam: UPSC CSE — 21–32 years (general), with relaxation for OBC (+3), SC/ST (+5). SSC CGL — 18–32 years. Banking (IBPS PO) — 20–30 years. NDA — 16.5–19.5 years. CDS — 19–25 years. Railways (RRB NTPC) — 18–33 years. All exams provide age relaxation for reserved categories (OBC/SC/ST/PwD/Ex-Servicemen) as per government guidelines." },
    { question: "When do you become eligible for a passport in India?", answer: "There is no minimum age for an Indian passport — even infants can get one, applied for by parents. However, a minor passport (under 18) is valid for only 5 years or until the holder turns 18 (whichever is earlier). At 18, you can independently apply for a full 10-year passport. At 16+, minors can get a 10-year passport with a declaration from parents." },
    { question: "What is the PAN card age requirement in India?", answer: "There is no minimum age requirement for a PAN card. Minors (including newborns) can get a PAN card — the application must be submitted by a parent or guardian using Form 49A. The minor's PAN is linked to the parent's PAN until the child turns 18. Once 18, the child should update the PAN with their own identity documents. PAN is required for financial transactions exceeding ₹50,000." },
];

export default function AgeCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Age Calculator" },
        ]),
        webAppSchema("Age Calculator India 2026", canonicalUrl("/in/age-calculator")),
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
            <Script id="schema-agecalc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Age Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Age Calculator India 2026</h1>
            <PageDesc>
                Calculate your exact age in years, months, and days. Track your India legal milestones — voting age, driving license, marriage age, senior citizen benefits, and retirement. Compare two ages and countdown to your next birthday.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <AgeCalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Age Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="how-age-calculated">How Is Age Calculated?</h2>
    <p>Age is calculated by counting the number of <strong>completed years, months, and days</strong> between a person's date of birth and a reference date (usually today). The calculation follows the <strong>Gregorian calendar</strong>, which is the civil calendar used in India and most of the world.</p>
    <p>The key rules for accurate age calculation:</p>
    <ul>
        <li><strong>Completed years:</strong> A year is counted only after the birthday has passed. Born on 15 Jan 2000 → you are 25 until 14 Jan 2026, and become 26 on 15 Jan 2026.</li>
        <li><strong>Month handling:</strong> Months vary from 28–31 days. If born on Jan 31 and the current month has 28 days, the calculation adjusts accordingly.</li>
        <li><strong>Leap years:</strong> February has 29 days every 4 years (with exceptions for century years not divisible by 400). This affects day counts and Feb 29 birthdays.</li>
    </ul>

    <h2 id="legal-age-milestones">India Legal Age Milestones — Complete Reference Table</h2>
    <p>India has specific age requirements set by various laws and regulations. Here's the most comprehensive reference:</p>
    <table>
        <thead><tr><th>Age</th><th>Milestone</th><th>Governing Law / Rule</th></tr></thead>
        <tbody>
            <tr><td><strong>0 (birth)</strong></td><td>Aadhaar enrollment, Birth certificate, PAN card</td><td>Aadhaar Act 2016, Registration of Births Act</td></tr>
            <tr><td><strong>5</strong></td><td>Aadhaar mandatory biometric update</td><td>UIDAI Regulations</td></tr>
            <tr><td><strong>6</strong></td><td>School Class 1 admission minimum age</td><td>NEP 2020, RTE Act 2009</td></tr>
            <tr><td><strong>10</strong></td><td>Minor bank savings account (with guardian)</td><td>RBI Guidelines</td></tr>
            <tr><td><strong>14</strong></td><td>End of compulsory free education</td><td>Right to Education Act, 2009</td></tr>
            <tr><td><strong>15</strong></td><td>Aadhaar 2nd biometric update, Minor employment in non-hazardous work</td><td>UIDAI, Child Labour Act</td></tr>
            <tr><td><strong>16</strong></td><td>Learner's license for gearless motorcycle (&lt;50cc)</td><td>Motor Vehicles Act, 1988</td></tr>
            <tr><td><strong>18</strong></td><td>Voting rights, Driving license (car/bike), Marriage (women), Passport (independent), Criminal majority</td><td>Constitution (61st Amendment), MVA 1988, PCMA 2006, Passports Act</td></tr>
            <tr><td><strong>21</strong></td><td>Marriage (men), Legal drinking (most states)</td><td>PCMA 2006, State Excise Acts</td></tr>
            <tr><td><strong>25</strong></td><td>Legal drinking (Punjab, Haryana, Chandigarh)</td><td>State Excise Acts</td></tr>
            <tr><td><strong>55</strong></td><td>Voluntary Retirement Scheme (VRS) eligibility</td><td>Company policies, Govt rules</td></tr>
            <tr><td><strong>58</strong></td><td>EPFO/PF full withdrawal, Private sector common retirement</td><td>EPF & Miscellaneous Provisions Act</td></tr>
            <tr><td><strong>60</strong></td><td>Senior Citizen (tax benefits), Central Govt retirement, NPS vesting</td><td>Income Tax Act, Pension Rules</td></tr>
            <tr><td><strong>62</strong></td><td>High Court Judge retirement</td><td>Constitution of India, Art. 217</td></tr>
            <tr><td><strong>65</strong></td><td>Supreme Court Judge retirement</td><td>Constitution of India, Art. 124</td></tr>
            <tr><td><strong>80</strong></td><td>Super Senior Citizen (highest tax exemption)</td><td>Income Tax Act</td></tr>
        </tbody>
    </table>

    <h2 id="voting-age">Voting Age in India — 18 Years</h2>
    <p>The <strong>voting age in India</strong> was reduced from <strong>21 to 18 years</strong> by the <strong>61st Constitutional Amendment Act, 1988</strong>. To exercise your right to vote, you must:</p>
    <ul>
        <li>Be at least <strong>18 years old</strong> on the qualifying date (1st January of the election year)</li>
        <li>Be an Indian citizen</li>
        <li>Be registered in the <strong>electoral roll</strong> of your constituency</li>
        <li>Possess a valid <strong>EPIC (Voter ID card)</strong> — apply through the <strong>NVSP portal</strong></li>
    </ul>
    <div class="explanation__highlight">
        <strong>Did You Know?</strong> India has ~950 million eligible voters (2024 general elections), making it the world's largest democracy. The 61st Amendment effectively added millions of 18–20-year-old first-time voters to the electorate.
    </div>

    <h2 id="driving-license-age">Driving License Age in India</h2>
    <p>Under the <strong>Motor Vehicles Act, 1988</strong>, driving license ages are:</p>
    <table>
        <thead><tr><th>Vehicle Type</th><th>Minimum Age</th><th>Requirements</th></tr></thead>
        <tbody>
            <tr><td><strong>Gearless motorcycle (&lt;50cc)</strong></td><td>16 years</td><td>Learner's license with parental consent</td></tr>
            <tr><td><strong>Car, motorcycle with gear, LMV</strong></td><td>18 years</td><td>Learner's license → Permanent DL after 30 days</td></tr>
            <tr><td><strong>Transport/commercial vehicles</strong></td><td>20 years</td><td>Must hold LMV license for 1+ year first</td></tr>
            <tr><td><strong>International Driving Permit</strong></td><td>18 years</td><td>Must hold valid Indian DL for 1+ year</td></tr>
        </tbody>
    </table>

    <h2 id="marriage-age">Legal Marriage Age in India</h2>
    <p>The <strong>Prohibition of Child Marriage Act (PCMA), 2006</strong> sets the minimum age:</p>
    <ul>
        <li><strong>Women:</strong> 18 years</li>
        <li><strong>Men:</strong> 21 years</li>
    </ul>
    <p>The Prohibition of Child Marriage (Amendment) Bill was introduced in 2021 to raise women's marriage age to 21, matching men. However, as of March 2026, <strong>the existing law (18/21) remains in force</strong>. Child marriages are <em>voidable</em> (can be annulled by the minor within 2 years of attaining majority).</p>

    <h2 id="drinking-age-state">Legal Drinking Age by State — India 2026</h2>
    <p>The legal drinking age is a <strong>state subject</strong> under the Indian Constitution, leading to significant variation:</p>
    <table>
        <thead><tr><th>Drinking Age</th><th>States / UTs</th></tr></thead>
        <tbody>
            <tr><td><strong>18 years</strong></td><td>Goa, Himachal Pradesh, Puducherry, Rajasthan, Sikkim, Andaman & Nicobar</td></tr>
            <tr><td><strong>21 years</strong></td><td>Delhi, Karnataka, West Bengal, Tamil Nadu, Maharashtra, Telangana, Andhra Pradesh, Assam, Odisha, Jharkhand, Chhattisgarh, MP, UP, and most other states</td></tr>
            <tr><td><strong>23 years</strong></td><td>Kerala</td></tr>
            <tr><td><strong>25 years</strong></td><td>Punjab, Haryana, Chandigarh</td></tr>
            <tr><td><strong>Prohibited</strong></td><td>Bihar, Gujarat, Mizoram, Nagaland, Lakshadweep</td></tr>
        </tbody>
    </table>

    <h2 id="school-admission-age">School Admission Age — NEP 2020</h2>
    <p>Under the <strong>National Education Policy (NEP) 2020</strong> and the <strong>Right to Education (RTE) Act, 2009</strong>:</p>
    <ul>
        <li><strong>Class 1 admission:</strong> Minimum age <strong>6 years</strong> as of the academic year cutoff date</li>
        <li><strong>Cutoff dates vary by state:</strong> Delhi — March 31, Karnataka — June 1, Maharashtra — June 30, Tamil Nadu — July 31</li>
        <li><strong>NEP 5+3+3+4 structure:</strong> Foundational stage starts at age 3 (Anganwadi/pre-school)</li>
    </ul>

    <h2 id="senior-citizen">Senior Citizen Age & Benefits in India</h2>
    <p>In India, a <strong>Senior Citizen</strong> is defined as a person aged <strong>60 years and above</strong>. Benefits include:</p>
    <table>
        <thead><tr><th>Category</th><th>Age</th><th>Key Benefits</th></tr></thead>
        <tbody>
            <tr><td><strong>Senior Citizen</strong></td><td>60–79 years</td><td>Higher tax exemption (₹3L), Higher FD rates (+0.25–0.50%), Priority airport boarding</td></tr>
            <tr><td><strong>Super Senior</strong></td><td>80+ years</td><td>Highest exemption (₹5L), No advance tax (if no business income), Priority healthcare</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Railway Concession Note:</strong> Senior citizen fare concessions on Indian Railways were <strong>suspended in March 2020</strong> due to COVID-19 revenue impact and have <strong>not been restored as of March 2026</strong>. Despite periodic rumours, the government has confirmed no plans to reinstate them.
    </div>

    <h2 id="retirement-pension-age">Retirement & Pension Age in India</h2>
    <table>
        <thead><tr><th>Sector</th><th>Retirement Age</th><th>Pension/PF</th></tr></thead>
        <tbody>
            <tr><td><strong>Central Government</strong></td><td>60 years</td><td>NPS/OPS pension from age 60</td></tr>
            <tr><td><strong>State Government</strong></td><td>58–62 years (varies)</td><td>State pension rules apply</td></tr>
            <tr><td><strong>Private Sector</strong></td><td>58–60 (company policy)</td><td>EPFO/PF withdrawal at 58</td></tr>
            <tr><td><strong>Public Sector Banks</strong></td><td>60 years</td><td>NPS for post-2004 joiners</td></tr>
            <tr><td><strong>Armed Forces</strong></td><td>Varies by rank (35–60)</td><td>Military pension applies</td></tr>
            <tr><td><strong>High Court Judges</strong></td><td>62 years</td><td>Judicial pension</td></tr>
            <tr><td><strong>Supreme Court Judges</strong></td><td>65 years</td><td>Judicial pension</td></tr>
        </tbody>
    </table>

    <h2 id="income-tax-age-slabs">Income Tax Age Slabs — India 2026</h2>
    <h3>Old Tax Regime (with deductions)</h3>
    <table>
        <thead><tr><th>Age Category</th><th>Basic Exemption</th><th>5% Slab</th><th>20% Slab</th><th>30% Slab</th></tr></thead>
        <tbody>
            <tr><td><strong>Below 60</strong></td><td>₹2,50,000</td><td>₹2.5–5L</td><td>₹5–10L</td><td>Above ₹10L</td></tr>
            <tr><td><strong>Senior (60–79)</strong></td><td>₹3,00,000</td><td>₹3–5L</td><td>₹5–10L</td><td>Above ₹10L</td></tr>
            <tr><td><strong>Super Senior (80+)</strong></td><td>₹5,00,000</td><td>₹5–10L</td><td>N/A</td><td>Above ₹10L</td></tr>
        </tbody>
    </table>

    <h2 id="aadhaar-pan-age">Aadhaar & PAN Card Age Rules</h2>
    <table>
        <thead><tr><th>Document</th><th>Min Age</th><th>Special Rules</th></tr></thead>
        <tbody>
            <tr><td><strong>Aadhaar</strong></td><td>No limit (birth)</td><td>Baal Aadhaar (blue) for &lt;5. Biometric update at 5 & 15.</td></tr>
            <tr><td><strong>PAN Card</strong></td><td>No limit (birth)</td><td>Minor PAN via guardian (Form 49A). Update at age 18.</td></tr>
            <tr><td><strong>Passport</strong></td><td>No limit (birth)</td><td>Minor passport valid 5yr or till 18. Full 10yr passport at 18+.</td></tr>
            <tr><td><strong>Voter ID</strong></td><td>18 years</td><td>Apply via NVSP portal. Must be 18 by Jan 1 of election year.</td></tr>
            <tr><td><strong>Bank Account</strong></td><td>10+ (minor), 18 (independent)</td><td>Minor account co-operated by guardian. Full at 18.</td></tr>
        </tbody>
    </table>

    <h2 id="leap-year">Leap Year Impact on Age Calculation</h2>
    <p>A <strong>leap year</strong> occurs every 4 years (with exceptions for century years not divisible by 400). The extra day — <strong>February 29</strong> — affects age calculation in two ways:</p>
    <ul>
        <li><strong>Day count:</strong> Leap years have 366 days instead of 365, affecting "age in days" and "age in hours" calculations</li>
        <li><strong>Feb 29 birthdays:</strong> People born on February 29 are colloquially called "leaplings." In non-leap years, they typically celebrate on Feb 28 or March 1</li>
        <li><strong>Indian government practice:</strong> For competitive exams and official purposes, Feb 29 birthdays in non-leap years are treated as <strong>March 1</strong></li>
    </ul>

    <h2 id="govt-exam-ages">Government Exam Age Limits — Quick Reference</h2>
    <table>
        <thead><tr><th>Exam</th><th>Age Limit (General)</th><th>OBC Relaxation</th><th>SC/ST Relaxation</th></tr></thead>
        <tbody>
            <tr><td><strong>UPSC CSE (IAS/IPS)</strong></td><td>21–32 years</td><td>+3 years</td><td>+5 years</td></tr>
            <tr><td><strong>SSC CGL</strong></td><td>18–32 years</td><td>+3 years</td><td>+5 years</td></tr>
            <tr><td><strong>IBPS PO (Banking)</strong></td><td>20–30 years</td><td>+3 years</td><td>+5 years</td></tr>
            <tr><td><strong>NDA</strong></td><td>16.5–19.5 years</td><td>N/A</td><td>N/A</td></tr>
            <tr><td><strong>CDS</strong></td><td>19–25 years</td><td>N/A</td><td>N/A</td></tr>
            <tr><td><strong>RRB NTPC</strong></td><td>18–33 years</td><td>+3 years</td><td>+5 years</td></tr>
            <tr><td><strong>State PSC</strong></td><td>21–35 (varies)</td><td>+3 years</td><td>+5 years</td></tr>
        </tbody>
    </table>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Planning to buy a house? Check eligibility based on your age and income.</li>
        <li><strong><a href="/in/car-loan-calculator">Car Loan EMI Calculator</a></strong> — Age affects car insurance premiums. Calculate your loan EMI first.</li>
        <li><strong><a href="/in/personal-loan-calculator">Personal Loan EMI Calculator</a></strong> — Personal loan eligibility depends on age (21–60 salaried, 25–70 self-employed).</li>
        <li><strong><a href="/in/fuel-cost-calculator">Fuel Cost Calculator India</a></strong> — Calculate running costs for cars across Indian cities.</li>
    </ul>
`;
