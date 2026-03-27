import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAETrafficFineCalculatorCore from "@/components/calculator/UAETrafficFineCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Traffic Fine Calculator 2026 — Dubai, Abu Dhabi & Sharjah",
    description: "Look up any UAE traffic fine by violation type: speeding, red light, parking, DUI. See fines, black points, impoundment, vehicle release fees, and early payment discounts for Dubai, Abu Dhabi, and Sharjah. Updated for Federal Decree-Law No. 14/2024.",
    keywords: ["UAE traffic fine calculator", "Dubai traffic fines 2026", "Abu Dhabi traffic fines", "Sharjah traffic fines", "UAE speeding fines", "black points UAE", "traffic fine discount Dubai", "red light fine UAE", "Federal Decree-Law 14/2024", "UAE traffic law 2026"],
    alternates: { canonical: canonicalUrl("/uae/traffic-fine-calculator") },
};

const FAQ_ITEMS = [
    { question: "How do I check my traffic fines in Dubai?", answer: "You can check Dubai traffic fines through several official platforms: (1) Dubai Police website (dubaipolice.gov.ae) or app — enter your traffic file number, vehicle plate number, or driving license details. (2) RTA website or app — navigate to 'Fines Inquiry and Payment.' (3) Dubai Now app — go to the 'Driving' section. (4) Ministry of Interior (MOI) website — works for all UAE emirates. All platforms show violation details, fine amounts, black points, and payment options. You can pay online using credit/debit card or through bank transfers." },
    { question: "What happens if I accumulate 24 black points?", answer: "Accumulating 24 black points triggers license suspension under UAE traffic law. The penalties escalate with each offense: 1st time — license suspended for 3 months (30 days for light vehicle drivers). 2nd time — suspended for 6 months. 3rd time — suspended for 1 year, and you must retake the full driving test (lessons + exam) to get your license back. Black points automatically expire 12 months from the violation date if no new violations are committed during that period." },
    { question: "Can I get a discount on UAE traffic fines?", answer: "Yes, all three major emirates offer early payment discounts: Dubai, Abu Dhabi, and Sharjah all provide a 35% discount if you pay within 60 days of the violation date, and a 25% discount if paid within 1 year. Dubai also has a 'Safe Driver' program offering up to 100% waiver for minor violations if you maintain a clean record (25% after 3 months, 50% after 6 months, 75% after 9 months, 100% after 12 months). Serious violations — DUI, reckless driving, speeding 60+ km/h over limit, and running red lights — are excluded from all discount programs." },
    { question: "Are Abu Dhabi traffic fines different from Dubai?", answer: "Yes, there are important emirate-specific differences: (1) Speed grace buffer — Abu Dhabi has zero-tolerance (fined for exceeding by even 1 km/h), while Dubai and Sharjah allow ~20 km/h grace above posted limits. (2) Vehicle release fees — both Dubai and Abu Dhabi charge AED 50,000 to release vehicles impounded for serious violations like running red lights (Sharjah uses standard fees). (3) For illegal racing, Dubai charges AED 100,000 for vehicle release. (4) Different fine portals — Dubai uses Dubai Police/RTA, Abu Dhabi uses TAMM/AD Police, Sharjah uses Sharjah Police/MOI. The base fine amounts for most violations are the same across all emirates under federal law." },
    { question: "What is the AED 50,000 red light fine?", answer: "The AED 50,000 figure is not the fine itself — it's the vehicle release fee. When you run a red light in Dubai or Abu Dhabi, you receive: (1) AED 1,000 fine (the actual traffic fine under federal law). (2) 12 black points on your license. (3) Vehicle impounded for 30 days. (4) To get your vehicle back, you must pay AED 50,000 as the release fee — this was introduced by Dubai Decree No. 30/2023 and Abu Dhabi's Law No. 5/2020. So the total cost of running a red light is effectively AED 51,000 (fine + release fee). Sharjah does not have this additional release fee." },
    { question: "How do I remove black points from my license?", answer: "You can reduce black points by attending a traffic safety course offered by Dubai Police or Abu Dhabi Police. These workshops remove up to 8 black points from your record. To enroll: visit the Dubai Police website or AD Police app, search for 'traffic awareness course' or 'black points reduction,' complete registration and attend the course (typically 4-8 hours). You can only attend one course per year. Additionally, black points automatically expire 12 months from the date of each individual violation if no new offenses are committed." },
    { question: "What are the new 2025 UAE traffic law changes?", answer: "Federal Decree-Law No. 14 of 2024, effective March 29, 2025, introduced major changes: (1) Minimum driving age lowered to 17 (from 18). (2) DUI penalties massively increased — alcohol: AED 20,000-100,000 + imprisonment; narcotics: AED 30,000-200,000 + prison. (3) Fleeing an accident scene: AED 50,000-100,000 + up to 1 year imprisonment. (4) Driving with suspended license: AED 10,000 minimum + possible imprisonment. (5) Causing death by negligence: AED 50,000 minimum + jail; if aggravated: AED 100,000 + 1 year minimum. (6) Jaywalking on 80+ km/h roads: AED 10,000 + 3 months prison minimum. (7) Provisions for autonomous vehicles added. (8) New Federal Traffic Council established." },
    { question: "Do I need to clear traffic fines before visa renewal?", answer: "Yes — as of 2025, Dubai has introduced a rule requiring all traffic fines to be cleared before any visa renewal or visa transfer can be processed. This applies to: all residents renewing their residence visa, employees transferring to a new sponsor, and any visa status change. The rule helps the government reduce fine backlogs and improve road safety. If you have outstanding fines on company-registered vehicles, coordinate with your employer — the fines are linked to the vehicle, not just the driver. You can pay outstanding fines in installments if the total exceeds AED 5,000." },
    { question: "Can I pay traffic fines in installments?", answer: "Yes, if your total outstanding fines exceed AED 5,000, you can request an installment plan through your emirate's payment portal. In Dubai, visit any Dubai Police service center or use the smart services portal. In Abu Dhabi, installment plans are available through AD Police or TAMM. Your payment schedule is typically spread over 3-12 months depending on the total amount. Some installment plans offer an additional 25% discount if all payments are made on time. Interest-free installment plans are available through select UAE banks for traffic fine payments." },
    { question: "What is the Dubai Safe Driver discount?", answer: "The Dubai Safe Driver discount is a progressive reward program for drivers who maintain a clean driving record. It works as follows: if you receive a minor traffic violation fine and then maintain zero violations for consecutive months, your fine is gradually reduced: 25% off after 3 months clean, 50% off after 6 months, 75% off after 9 months, and 100% waiver (full forgiveness) after 12 consecutive months with no violations. This only applies to minor violations — serious offenses like DUI, reckless driving, excessive speeding (80+ km/h over), and red light violations are permanently excluded from this program." },
    { question: "How much does it cost to get an impounded car released?", answer: "The cost depends on the violation and emirate. In Dubai and Abu Dhabi, serious violations trigger premium release fees under Decree No. 30/2023 and Law No. 5/2020: Running a red light — AED 50,000 release fee. Reckless driving — AED 50,000 release fee. Illegal racing — AED 100,000 release fee (Dubai). Driving under 18 — AED 50,000 release fee. These are in addition to the original fine. In Sharjah, standard release fees apply without the premium charges. Your vehicle remains impounded until the fee is paid. If fees are not paid within 3 months, the vehicle may be auctioned by authorities." },
    { question: "What is the speed grace buffer in the UAE?", answer: "The speed grace buffer (also called speed tolerance or camera threshold) varies by emirate. In Dubai and Sharjah, radar cameras typically allow about 20 km/h above the posted speed limit before triggering a fine — for example, a 120 km/h speed limit road usually triggers at 141 km/h. Abu Dhabi is different — it uses zero-tolerance enforcement, meaning you can be fined for exceeding the posted speed limit by even 1 km/h. The grace buffer is not guaranteed and can change — it is set by each emirate's police authority and may vary by road, time, or special enforcement periods." },
    { question: "Can tourists get traffic fines in the UAE?", answer: "Yes, tourists driving in the UAE are subject to the same traffic laws and fines as residents. Fines are typically linked to the rental car company, which will charge your credit card. Important for tourists: (1) Obtain an International Driving Permit (IDP) before renting — required for most nationalities. (2) Fines accumulate on the rental vehicle and are charged to your account, sometimes with an administrative surcharge from the rental company. (3) Serious violations (DUI, reckless driving) can result in vehicle impoundment and court appearances. (4) Unpaid fines may prevent departure from the UAE. (5) Some rental insurance policies do not cover fines — check your policy terms." },
    { question: "What happens if I don't pay my traffic fines?", answer: "Consequences of unpaid UAE traffic fines escalate over time: (1) You lose eligibility for early payment discounts (35% within 60 days, 25% within 1 year). (2) As of 2025, you cannot renew your residence visa in Dubai without clearing all fines. (3) Vehicle registration renewal may be blocked. (4) If your vehicle was impounded and fees remain unpaid for 3 months, authorities can auction it. (5) You may face travel restrictions if fines accumulate significantly. (6) Driving license renewal may be refused. (7) In extreme cases, court action can be initiated. Pay your fines as early as possible to benefit from discounts and avoid complications." },
    { question: "How do I dispute a traffic fine in the UAE?", answer: "To dispute a traffic fine, follow the process for your specific emirate: In Dubai, file objections through the Dubai Police app or website within 30 days of receiving the fine. You can request evidence photos and radar data. In Abu Dhabi, submit a dispute through the Abu Dhabi Police services or TAMM portal. In Sharjah, file a complaint through the Sharjah Police website. Key tips: (1) Act within 30 days — late disputes are rarely accepted. (2) Gather evidence — dashcam footage, GPS logs, or witness statements. (3) Common success cases include: wrong plate number recorded, vehicle was sold before violation date, or technical radar errors. If your dispute is rejected, you can escalate to the relevant traffic court." },
];

export default function TrafficFineCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Traffic Fine Calculator" },
        ]),
        webAppSchema("Traffic Fine Calculator", canonicalUrl("/uae/traffic-fine-calculator")),
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
            <Script id="schema-traffic-fine" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Traffic Fine Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Traffic Fine Calculator 2026 — Dubai, Abu Dhabi & Sharjah</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Look up any UAE traffic violation and see the exact fine, black points, vehicle impoundment period, and early payment discounts. Covers all emirates with emirate-specific penalties. Updated for Federal Decree-Law No. 14/2024 (effective March 29, 2025).
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAETrafficFineCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE Traffic Fines FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/car-loan-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🚗</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Car Loan & Salik Calculator</div>
                            <div className="uae-related-link__desc">EMI, Salik tolls & ownership cost</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Net salary & cost of living</div>
                        </div>
                    </Link>
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE VAT Calculator</div>
                            <div className="uae-related-link__desc">5% VAT calculation</div>
                        </div>
                    </Link>
                    <Link href="/uae/currency-converter" className="uae-related-link">
                        <span className="uae-related-link__icon">💱</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Currency Converter</div>
                            <div className="uae-related-link__desc">AED to 22+ currencies</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="legal-framework">UAE Traffic Legal Framework</h2>
    <p>Traffic regulation in the <strong>United Arab Emirates</strong> is governed by a layered system of federal laws, emirate-level decrees, and ministerial resolutions. The primary legislation is <strong>Federal Law No. 21 of 1995</strong>, which established the foundation for traffic management across all seven emirates. This law has been substantially amended multiple times — most notably by <strong>Federal Law No. 12 of 2007</strong>, <strong>Ministerial Resolutions 177–178 of 2017</strong>, <strong>Dubai Decree No. 30 of 2023</strong>, and the landmark <strong>Federal Decree-Law No. 14 of 2024</strong> (effective March 29, 2025).</p>
    <p>The UAE traffic system uses three layers of penalties for violations:</p>
    <ul>
        <li><strong>Monetary fines</strong> — ranging from AED 200 (minor parking) to AED 200,000 (DUI with narcotics)</li>
        <li><strong>Black points</strong> — accumulated on the driver's license; 24 points triggers suspension</li>
        <li><strong>Vehicle impoundment</strong> — 7 to 60 days depending on severity; premium release fees up to AED 100,000 in Dubai</li>
    </ul>
    <p>Each emirate has some autonomy in enforcement and additional regulations. <a href="/uae/car-loan-calculator">Car loan</a> and vehicle ownership costs should factor in potential fines — particularly the substantial vehicle release fees introduced in 2023.</p>

    <h2 id="speeding-fines">Speeding Fines — Complete Breakdown</h2>
    <p>Speeding is the most common traffic violation in the UAE, with penalties escalating dramatically based on how far you exceed the posted limit. The UAE uses a <strong>seven-tier bracket system</strong>:</p>
    <table>
        <thead><tr><th>Speed Exceeded By</th><th>Fine (AED)</th><th>Black Points</th><th>Impound</th></tr></thead>
        <tbody>
            <tr><td><strong>Up to 20 km/h</strong></td><td>300</td><td>0</td><td>—</td></tr>
            <tr><td><strong>21–30 km/h</strong></td><td>600</td><td>0</td><td>—</td></tr>
            <tr><td><strong>31–40 km/h</strong></td><td>700</td><td>4</td><td>—</td></tr>
            <tr><td><strong>41–50 km/h</strong></td><td>1,000</td><td>6</td><td>—</td></tr>
            <tr><td><strong>51–60 km/h</strong></td><td>1,500</td><td>6</td><td>—</td></tr>
            <tr><td><strong>61–80 km/h</strong></td><td>2,000</td><td>12</td><td>30 days</td></tr>
            <tr><td><strong>80+ km/h</strong></td><td>3,000</td><td>23</td><td>60 days</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Abu Dhabi Zero-Tolerance:</strong> While Dubai and Sharjah typically allow a ~20 km/h grace buffer above the posted speed limit (cameras trigger at limit + 21 km/h), <strong>Abu Dhabi uses zero-tolerance enforcement</strong> — you can be fined for exceeding the limit by even 1 km/h. This is the single most important emirate-specific difference for drivers.
    </div>

    <h2 id="red-light">Red Light & Camera Violations</h2>
    <p>Running a red traffic light is one of the most severely penalized violations in the UAE. The base penalty under federal law is:</p>
    <ul>
        <li><strong>AED 1,000 fine</strong> — the traffic violation fine itself</li>
        <li><strong>12 black points</strong> — halfway to license suspension</li>
        <li><strong>Vehicle impounded for 30 days</strong></li>
    </ul>
    <p>However, the <strong>total cost is much higher</strong> than the AED 1,000 fine alone. Under <strong>Dubai Decree No. 30 of 2023</strong> and <strong>Abu Dhabi Law No. 5 of 2020</strong>, drivers must pay an additional <strong>AED 50,000 vehicle release fee</strong> to retrieve their impounded vehicle. This means the effective cost of running a red light in Dubai or Abu Dhabi is approximately <strong>AED 51,000</strong>.</p>
    <div class="explanation__highlight">
        <strong>Key distinction:</strong> The AED 50,000 is a <em>vehicle release fee</em>, not the fine. The fine is AED 1,000. Media reports that say "AED 50,000 red light fine" are technically incorrect — but the total cost is still AED 51,000. If the release fee is not paid within 3 months, the vehicle may be <strong>auctioned by authorities</strong>.
    </div>

    <h2 id="parking-fines">Parking Violations</h2>
    <p>Parking fines are among the most frequently issued tickets in the UAE, particularly in urban areas of Dubai and Abu Dhabi. The penalties range from AED 400 to AED 1,000:</p>
    <table>
        <thead><tr><th>Violation</th><th>Fine (AED)</th><th>Black Points</th></tr></thead>
        <tbody>
            <tr><td><strong>Disabled parking without permit</strong></td><td>1,000</td><td>6</td></tr>
            <tr><td><strong>Blocking fire hydrant</strong></td><td>1,000</td><td>6</td></tr>
            <tr><td><strong>Obstructing traffic</strong></td><td>500</td><td>0</td></tr>
            <tr><td><strong>Wrong/illegal parking</strong></td><td>500</td><td>0</td></tr>
            <tr><td><strong>Parking on pavement</strong></td><td>400</td><td>0</td></tr>
            <tr><td><strong>Unsecured vehicle</strong> (Abu Dhabi)</td><td>500</td><td>0</td></tr>
        </tbody>
    </table>
    <p>In Dubai, parking fines for paid zones (Parkin) are managed separately through the <strong>Parkin app</strong> and can be disputed or refunded through their platform. Government parking fines (traffic violations) are handled by Dubai Police/RTA.</p>

    <h2 id="dui-reckless">DUI & Reckless Driving</h2>
    <p>The UAE has <strong>zero tolerance for driving under the influence</strong>. The 2025 amendments under <strong>Federal Decree-Law No. 14 of 2024</strong> significantly increased penalties:</p>
    <table>
        <thead><tr><th>Offense</th><th>Fine (AED)</th><th>Black Points</th><th>Impound</th><th>Additional</th></tr></thead>
        <tbody>
            <tr><td><strong>DUI — Alcohol</strong></td><td>20,000–100,000</td><td>23</td><td>60 days</td><td>Court decision, possible imprisonment</td></tr>
            <tr><td><strong>DUI — Narcotics</strong></td><td>30,000–200,000</td><td>23</td><td>60 days</td><td>Imprisonment + fine</td></tr>
            <tr><td><strong>Reckless driving</strong></td><td>2,000</td><td>23</td><td>60 days</td><td>AED 50K release fee (Dubai/AD)</td></tr>
            <tr><td><strong>Illegal racing</strong></td><td>3,000</td><td>23</td><td>60 days</td><td>AED 100K release (Dubai)</td></tr>
            <tr><td><strong>Drifting/stunts</strong></td><td>2,000</td><td>23</td><td>60 days</td><td>Court involvement likely</td></tr>
        </tbody>
    </table>
    <p>Under the 2025 law, <strong>repeat DUI offenders face escalating consequences</strong>: first offense — license suspended 3 months; second — suspended 6 months; third — <strong>permanent revocation</strong> of driving license. The UAE considers DUI a criminal offense, not just a traffic violation.</p>

    <h2 id="black-points">Black Points — How the System Works</h2>
    <p>The <strong>black points system (نقاط سوداء)</strong> is the UAE's driver penalty tracking mechanism. Every traffic violation carries a specific number of black points that accumulate on your driving record:</p>
    <table>
        <thead><tr><th>Points Level</th><th>Assessment</th></tr></thead>
        <tbody>
            <tr><td><strong>4 points</strong></td><td>Minor offense — seatbelt, mobile phone, tailgating</td></tr>
            <tr><td><strong>6 points</strong></td><td>Moderate offense — wrong-way driving, obstructive parking</td></tr>
            <tr><td><strong>12 points</strong></td><td>Serious offense — red light, excessive speeding (61–80 km/h over)</td></tr>
            <tr><td><strong>23 points</strong></td><td>Severe offense — reckless driving, DUI, extreme speeding (80+ km/h over)</td></tr>
            <tr><td><strong>24 points = SUSPENSION</strong></td><td>1st: 3 months; 2nd: 6 months; 3rd: 1 year + retake test</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Point Reduction:</strong> You can remove up to <strong>8 black points</strong> by completing a traffic safety course offered by Dubai Police or Abu Dhabi Police. The course is typically 4–8 hours and can be taken once per year. Points automatically expire <strong>12 months</strong> from the individual violation date.
    </div>
    <p>Check your current black points total through the Dubai Police app, Abu Dhabi Police app, or the MOI portal. Understanding your black points balance is as important as managing your <a href="/uae/salary-calculator">salary budget</a> — both directly affect your financial wellbeing in the UAE.</p>

    <h2 id="fine-discounts">Fine Discounts & Early Payment</h2>
    <p>All three major emirates offer <strong>early payment discounts</strong> to encourage prompt settlement of traffic fines. The discount tiers are consistent across Dubai, Abu Dhabi, and Sharjah:</p>
    <table>
        <thead><tr><th>Payment Window</th><th>Discount</th><th>Example (AED 1,000 fine)</th></tr></thead>
        <tbody>
            <tr><td><strong>Within 60 days</strong></td><td>35% off</td><td>Pay AED 650</td></tr>
            <tr><td><strong>Within 1 year</strong></td><td>25% off</td><td>Pay AED 750</td></tr>
            <tr><td><strong>After 1 year</strong></td><td>No discount</td><td>Pay AED 1,000</td></tr>
        </tbody>
    </table>
    <h3>Dubai Safe Driver Program</h3>
    <p>Dubai offers a unique <strong>progressive discount program</strong> for drivers who maintain a clean record after receiving a minor violation:</p>
    <ul>
        <li>3 months with zero violations → <strong>25% off</strong></li>
        <li>6 months → <strong>50% off</strong></li>
        <li>9 months → <strong>75% off</strong></li>
        <li>12 months → <strong>100% waiver</strong> (fine completely forgiven)</li>
    </ul>
    <h3>Violations Excluded from Discounts</h3>
    <p>The following serious violations are <strong>permanently excluded</strong> from all discount programs:</p>
    <ul>
        <li>Driving under the influence (alcohol or drugs)</li>
        <li>Reckless driving endangering lives</li>
        <li>Speeding 60+ km/h over the limit</li>
        <li>Running a red traffic light</li>
        <li>Fleeing the scene of an accident</li>
        <li>Illegal road racing</li>
    </ul>

    <h2 id="check-fines">How to Check Your Fines</h2>
    <p>Each emirate has dedicated platforms for checking and paying traffic fines. All platforms accept Emirates ID, plate number, or traffic file number:</p>
    <table>
        <thead><tr><th>Emirate</th><th>Platforms</th><th>Payment Methods</th></tr></thead>
        <tbody>
            <tr><td><strong>Dubai</strong></td><td>Dubai Police app/web, RTA app/web, Dubai Now app, MOI</td><td>Credit/debit card, bank transfer, Apple Pay, Samsung Pay</td></tr>
            <tr><td><strong>Abu Dhabi</strong></td><td>Abu Dhabi Police app, TAMM portal, MOI app/web</td><td>Credit/debit card, bank transfer, payment kiosks</td></tr>
            <tr><td><strong>Sharjah</strong></td><td>Sharjah Police app/web, MOI, Tasjeel smart kiosks</td><td>Credit/debit card, bank transfer, smart kiosks</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro tip:</strong> Set up SMS alerts through your bank or telecom provider (<a href="/uae/mobile-plan-calculator">Mobile Plan Calculator</a>) for fine notifications. Both e& and du offer service alerts — getting early notification helps you pay within the 60-day window for the maximum 35% discount.
    </div>

    <h2 id="2025-changes">2025 Traffic Law Changes — Decree-Law No. 14/2024</h2>
    <p><strong>Federal Decree-Law No. 14 of 2024</strong>, signed by President Sheikh Mohammed bin Zayed Al Nahyan and <strong>effective March 29, 2025</strong>, introduces the most significant changes to UAE traffic regulation in a decade:</p>
    <h3>Key Changes</h3>
    <table>
        <thead><tr><th>Area</th><th>Old Rule</th><th>New Rule (2025)</th></tr></thead>
        <tbody>
            <tr><td><strong>Minimum driving age</strong></td><td>18 years (cars)</td><td>17 years</td></tr>
            <tr><td><strong>DUI — Alcohol</strong></td><td>Court-decided fine</td><td>AED 20,000–100,000 + prison</td></tr>
            <tr><td><strong>DUI — Narcotics</strong></td><td>Court-decided fine</td><td>AED 30,000–200,000 + prison</td></tr>
            <tr><td><strong>Fleeing accident</strong></td><td>AED 500–1,000</td><td>AED 50,000–100,000 + 1yr prison</td></tr>
            <tr><td><strong>Suspended license driving</strong></td><td>Standard fine</td><td>AED 10,000 min + imprisonment</td></tr>
            <tr><td><strong>Causing death</strong></td><td>Court-decided</td><td>AED 50,000 min + jail; aggravated: AED 100,000 + 1yr min</td></tr>
            <tr><td><strong>Jaywalking (80+ km/h road)</strong></td><td>AED 400</td><td>AED 10,000 + 3 months prison</td></tr>
            <tr><td><strong>Forged plates</strong></td><td>Fine + impound</td><td>AED 20,000 min + imprisonment</td></tr>
        </tbody>
    </table>
    <p>The law also introduces provisions for <strong>autonomous vehicles</strong> — registration, inspection, and licensing framework for self-driving vehicles — and establishes a new <strong>Federal Traffic Council</strong> to coordinate traffic policy across all seven emirates.</p>

    <h2 id="visa-link">Visa & Fine Link (2025 Rule)</h2>
    <p>Starting in 2025, Dubai has introduced a critical rule linking <strong>traffic fines to visa processing</strong>. All outstanding traffic fines must be cleared before:</p>
    <ul>
        <li>Residence visa renewal</li>
        <li>Visa transfer (changing employers/sponsors)</li>
        <li>Any visa status change</li>
    </ul>
    <p>This rule applies to all residents, including employees whose fines may be on company-registered vehicles. The rationale is threefold: improving road safety through accountability, reducing the backlog of unpaid fines (estimated at millions of AED), and ensuring all drivers face consequences for violations.</p>
    <div class="explanation__highlight">
        <strong>For employees:</strong> If you received fines while driving a company car, coordinate with your employer — the fines are linked to the vehicle registration. Some companies deduct fines from <a href="/uae/salary-calculator">employee salaries</a>, while others pay on behalf of the employee and recover later. Check your employment contract for the company's traffic fine policy.
    </div>

    <h2 id="emirate-differences">Emirate-Specific Differences</h2>
    <p>While the <strong>base fine amounts are set by federal law</strong>, each emirate has additional regulations that can significantly affect costs:</p>
    <table>
        <thead><tr><th>Feature</th><th>Dubai</th><th>Abu Dhabi</th><th>Sharjah</th></tr></thead>
        <tbody>
            <tr><td><strong>Speed tolerance</strong></td><td>~20 km/h grace</td><td>Zero tolerance</td><td>~20 km/h grace</td></tr>
            <tr><td><strong>Red light release</strong></td><td>AED 50,000</td><td>AED 50,000</td><td>Standard</td></tr>
            <tr><td><strong>Racing release</strong></td><td>AED 100,000</td><td>AED 50,000</td><td>Standard</td></tr>
            <tr><td><strong>Salik tolls</strong></td><td>Yes (variable pricing 2025)</td><td>No</td><td>No</td></tr>
            <tr><td><strong>Visa-fine link</strong></td><td>Yes (mandatory 2025)</td><td>Yes</td><td>Yes</td></tr>
            <tr><td><strong>Safe Driver program</strong></td><td>Yes (100% waiver possible)</td><td>No</td><td>No</td></tr>
            <tr><td><strong>Fine portal</strong></td><td>Dubai Police / RTA</td><td>TAMM / AD Police</td><td>Sharjah Police / MOI</td></tr>
        </tbody>
    </table>
    <p>The most impactful difference is Abu Dhabi's <strong>zero-tolerance speed enforcement</strong> — drivers accustomed to Dubai's ~20 km/h buffer frequently receive fines when driving on Abu Dhabi roads. When calculating your <a href="/uae/car-loan-calculator">total cost of car ownership</a> in the UAE, factor in your primary driving emirate to estimate potential fine exposure.</p>

    <h2 id="cost-saving">Cost-Saving Tips</h2>
    <ol>
        <li><strong>Pay within 60 days</strong> — The 35% early payment discount is the single biggest cost saver. Set calendar reminders.</li>
        <li><strong>Take a driving course</strong> — Remove up to 8 black points through Dubai/Abu Dhabi Police safety courses.</li>
        <li><strong>Know your emirate's rules</strong> — Adjust driving behavior for Abu Dhabi's zero-tolerance speed enforcement.</li>
        <li><strong>Use Waze or Google Maps</strong> — Speed camera alerts help prevent speeding fines.</li>
        <li><strong>Install a dashcam</strong> — Useful for disputing incorrect fines; some insurance providers offer discounts for dashcam users.</li>
        <li><strong>Leverage the Safe Driver program</strong> — In Dubai, maintaining a clean record after a minor violation can lead to full fine waiver.</li>
        <li><strong>Pay in installments if needed</strong> — For fines exceeding AED 5,000, installment plans preserve your <a href="/uae/salary-calculator">monthly cash flow</a>.</li>
        <li><strong>Check fines regularly</strong> — Use emirate apps to catch fines early before the 60-day discount window closes.</li>
        <li><strong>Factor fines into your budget</strong> — The average UAE driver receives 2–4 fines per year; budget AED 1,000–3,000 annually for traffic fines.</li>
        <li><strong>Review your <a href="/uae/car-loan-calculator">car insurance</a> terms</strong> — Some comprehensive policies offer fine-related legal assistance or coverage for dispute costs.</li>
    </ol>
`;
