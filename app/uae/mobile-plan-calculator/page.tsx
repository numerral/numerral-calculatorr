import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEMobilePlanCalculatorCore from "@/components/calculator/UAEMobilePlanCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Mobile Plan Calculator 2026 — e& (Etisalat) vs du Comparison",
    description: "Compare all UAE mobile plans: e& (Etisalat) Freedom/Wasel vs du Power/Prepaid. Find the best postpaid, prepaid, or tourist SIM by budget and data needs. Includes USSD codes, MNP guide, and roaming rates.",
    keywords: ["UAE mobile plan calculator", "Etisalat vs du", "e& plans 2026", "du prepaid plans", "best mobile plan UAE", "tourist SIM Dubai", "Wasel plan", "du Power plan", "TDRA number portability", "eSIM UAE"],
    alternates: { canonical: canonicalUrl("/uae/mobile-plan-calculator") },
};

const FAQ_ITEMS = [
    { question: "Which is cheaper — e& (Etisalat) or du?", answer: "Overall, du is approximately 10–15% cheaper for prepaid plans and 8–12% cheaper for postpaid plans. For example, du's Power 125 (AED 125/mo with 4 GB) has no direct e& equivalent at that price point. However, e& often offers aggressive promotional discounts (up to 50% off Freedom plans for 6 months), which can temporarily make them cheaper. For the best value, compare the actual price you'll pay after any promotional period ends. du also tends to include more bonus data with online activations." },
    { question: "Can I switch from Etisalat to du and keep my number?", answer: "Yes. Mobile Number Portability (MNP) has been available in the UAE since 2013, regulated by the TDRA. The process is free and typically completes within 1 business day. To switch: (1) Ensure your current number is active with no outstanding bills. (2) Visit any du store with your Emirates ID. (3) du handles the entire porting process. Requirements: valid Emirates ID, no active contract (or pay early termination fee), and for postpaid you may need a salary certificate (min AED 2,500/month). The same process works in reverse — du to e&." },
    { question: "What is the best tourist SIM card in Dubai?", answer: "For short visits (1–7 days), du's Tourist Unlimited 7-day plan (AED 199, unlimited data + 100 flexi min) is the best value. For longer stays (2–4 weeks), du's Tourist 189 plan (AED 189, 20 GB + 30 min, 28 days) offers the most balanced value. Both e& and du offer free starter SIMs at Dubai airports (DXB and DWC) with 1 GB data valid for 24 hours. Tourist SIMs require only a passport — no Emirates ID needed. eSIMs are also available for immediate activation without visiting a store." },
    { question: "What is a flexi minute?", answer: "A 'flexi minute' is a minute that can be used for either local calls OR international calls to select destinations. This is unique to the UAE market — in many countries, local and international minutes are separate allowances. Both e& and du use this system. One flexi minute to a local UAE number counts as 1 minute. One flexi minute to an international number may count as more (e.g., 2–3 flexi minutes for 1 minute to some countries). Check the specific rate card for your plan." },
    { question: "How do VoIP calls work in the UAE?", answer: "Standard VoIP apps like WhatsApp calls, FaceTime Audio/Video, and Skype are blocked in the UAE by the TDRA. However, licensed alternatives are available: BOTIM (AED 50/month), ToTok (free, limited), C'ME (via du, included in some plans), and Voico UAE. Both e& and du offer VoIP add-on packages. Some postpaid plans include unlimited internet calling via approved apps (e.g., e&'s GoChat). Microsoft Teams and Zoom calls for business use are generally permitted on business accounts." },
    { question: "Does the UAE have 5G coverage?", answer: "Yes, the UAE has extensive 5G coverage, particularly in urban areas. e& launched 5G in 2019 and covers most of Dubai, Abu Dhabi, and other major cities. du's 5G network covers 90%+ of urban areas. 5G speeds in the UAE typically reach 500 Mbps–1.5 Gbps in ideal conditions. To access 5G, you need: (1) a 5G-capable device, (2) a 5G SIM card (free upgrade at any store), and (3) a plan that includes 5G access (most postpaid plans above AED 200 include 5G; prepaid users need a 5G add-on)." },
    { question: "What is the TDRA and what does it regulate?", answer: "The Telecommunications and Digital Government Regulatory Authority (TDRA) — formerly known as TRA — is the UAE's telecommunications regulator. TDRA oversees: licensing of telecom operators (e& and du are the only licensed mobile providers), spectrum allocation, consumer protection, number portability (MNP), roaming rate oversight, data privacy regulations, VoIP/OTT service policies, and the National Numbering Plan. TDRA also regulates internet content filtering and cybersecurity standards. Their website (tdra.gov.ae) publishes tariff comparison tools and consumer complaint forms." },
    { question: "How do I check my mobile balance in the UAE?", answer: "For e& (Etisalat): dial *121# for account balance, *170# for data balance, or use the My Etisalat app. For du: dial *135# for balance, *135*1# for data balance, or use the du app. Both apps also allow recharging, purchasing add-ons, and managing your account. You can also check balance by calling customer service — 101 for e& (free) or 155 for du (free). Online portals (eand.ae and du.ae) also show real-time balance and usage details." },
    { question: "What documents do I need for a postpaid plan?", answer: "For a UAE postpaid mobile plan, you need: (1) Original Emirates ID (valid), (2) Passport copy, (3) Salary certificate or bank statement (for credit verification — minimum salary typically AED 2,500–3,000/month), (4) Proof of UAE residence (visa page). Self-employed individuals need a trade license and bank statements. For prepaid plans, only an Emirates ID is required (or passport for tourists). Both providers now support online registration through their apps, reducing the need for in-store visits." },
    { question: "Can I use an eSIM in the UAE?", answer: "Yes, both e& and du support eSIM activation. An eSIM is a digital SIM that doesn't require a physical SIM card — it's built into most modern smartphones (iPhone XS and later, Samsung Galaxy S20 and later, Google Pixel 3 and later). Benefits: instant activation, switch between plans easily, use dual SIM (physical + eSIM) for work and personal numbers. To activate: download the e& or du app → select eSIM → follow QR code or app-based activation. Tourist eSIMs are also available for immediate activation upon arrival." },
    { question: "What are Virgin Mobile UAE plans?", answer: "Virgin Mobile UAE operates as an MVNO (Mobile Virtual Network Operator) on du's network. It offers primarily prepaid plans targeted at younger, data-heavy users. Plans range from AED 50 to AED 200/month with competitive data allowances. Key advantages: no contract, app-managed account, frequent promotions, and a straightforward pricing model. However, coverage depends entirely on du's network, so it's equivalent to du in urban areas but may have limitations in remote regions." },
    { question: "How does mobile internet speed compare — e& vs du?", answer: "In independent speed tests (Ookla Speedtest, OpenSignal), e& generally edges ahead in: average download speed (150–200 Mbps vs 120–170 Mbps), 5G peak speeds, and latency. du performs comparably in urban Dubai and Abu Dhabi. For most users, the difference is negligible for streaming, social media, and browsing. The practical speed you experience depends more on: your device capability, location, time of day (peak hours reduce speeds), and your plan tier (some plans have speed caps, e.g., du Power 300 caps at 10 Mbps)." },
    { question: "What happens if I don't recharge my prepaid SIM?", answer: "For both e& and du, prepaid SIM cards follow a lifecycle: (1) Active period — SIM works normally for calls, data, and SMS. (2) Grace period — after balance expires, you can receive calls but not make them (typically 30 days). (3) Restricted period — incoming calls are also blocked; only recharge is possible (30–60 days). (4) Disconnection — number is permanently deactivated and may be reassigned. Total lifecycle from last recharge: approximately 90–180 days. To keep your number alive, recharge at least the minimum amount before the disconnection period." },
    { question: "Are there any hidden charges on UAE mobile plans?", answer: "Common charges to watch for: (1) VAT (5%) — already included in advertised prices since 2018. (2) Data overage — exceeding your plan's data allowance results in pay-as-you-go rates (AED 1–3 per MB). (3) International call rates — flexi minutes may be consumed faster for international calls. (4) Roaming — automatic roaming can be expensive if not managed. (5) Content subscriptions — some plans auto-subscribe to value-added services (check SMS confirmations). (6) Government fee — AED 7.50/month 'federal royalty fee' applies to postpaid plans." },
    { question: "How do I activate international roaming?", answer: "For e&: dial *121# and navigate to Roaming, or use My Etisalat app → Services → Roaming. For du: use the du app → My Account → Roaming, or call 155. Both providers require you to opt-in before roaming works. Important tips: (1) Activate a roaming package BEFORE you travel — pay-as-you-go roaming is 5–10× more expensive. (2) Turn off automatic app updates and cloud sync while roaming. (3) Both providers offer daily roaming packs (AED 25–60/day) for popular destinations. (4) GCC roaming is typically cheaper than other regions." },
    { question: "What is the federal royalty fee on UAE telecom bills?", answer: "The UAE government charges a 'federal royalty fee' of 15% on all telecommunications revenue, which was increased from 5% in 2012. This fee is partially passed on to consumers and is included in the advertised plan prices for most postpaid plans. Additionally, a 5% VAT applies to all telecom charges. Some postpaid bills may show a separate line item for 'government fee' (approximately AED 7.50/month). This is a regulated charge collected by e& and du on behalf of the federal government." },
];

export default function MobilePlanCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Mobile Plan Calculator" },
        ]),
        webAppSchema("Mobile Plan Calculator", canonicalUrl("/uae/mobile-plan-calculator")),
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
            <Script id="schema-mobile-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Mobile Plan Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Mobile Plan Calculator 2026 — e& vs du</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Compare all UAE mobile plans side-by-side: e& (Etisalat) Freedom and Wasel plans vs du Power and Prepaid plans. Filter by budget, minimum data, and provider to find the best postpaid, prepaid, or tourist SIM for your needs.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAEMobilePlanCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Mobile Plans FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Net salary & cost of living</div>
                        </div>
                    </Link>
                    <Link href="/uae/dewa-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">⚡</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">DEWA Bill Calculator</div>
                            <div className="uae-related-link__desc">Monthly utility costs</div>
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
    <h2 id="uae-telecom">UAE Telecom Landscape</h2>
    <p>The UAE has a <strong>duopoly telecom market</strong> regulated by the <strong>TDRA (Telecommunications and Digital Government Regulatory Authority)</strong>. Only two operators are licensed to provide mobile services:</p>
    <ul>
        <li><strong>e& (formerly Etisalat)</strong> — The incumbent operator, founded in 1976. Market share ~55%. Wider 5G and rural coverage.</li>
        <li><strong>du (EITC)</strong> — Launched in 2006 as the second operator. Market share ~45%. Generally 10–15% cheaper on prepaid plans.</li>
    </ul>
    <p><strong>Virgin Mobile UAE</strong> also operates as an MVNO (Mobile Virtual Network Operator) on du&apos;s network, offering app-managed prepaid plans targeted at younger users.</p>
    <p>The UAE has one of the highest mobile penetration rates in the world — exceeding <strong>200% (more SIM cards than people)</strong>. Both operators offer extensive 5G coverage in urban areas, with e& having launched 5G services in 2019.</p>

    <h2 id="postpaid-comparison">Postpaid Plans — e& Freedom vs du Power</h2>
    <p>Postpaid plans are ideal for residents with stable usage patterns. They offer better value per GB, include calling minutes, and often come with perks like streaming subscriptions and roaming data.</p>

    <h3>e& (Etisalat) Freedom Plans</h3>
    <table>
        <thead><tr><th>Plan</th><th>Price</th><th>Data</th><th>Minutes</th><th>Key Perks</th></tr></thead>
        <tbody>
            <tr><td><strong>Freedom Basic</strong></td><td>AED 100</td><td>2 GB</td><td>100 local</td><td>GoChat unlimited</td></tr>
            <tr><td><strong>Freedom 200</strong></td><td>AED 200</td><td>10 GB</td><td>300 flexi</td><td>Unlimited local calls, Smiles</td></tr>
            <tr><td><strong>Freedom 300</strong></td><td>AED 300</td><td>20 GB</td><td>Unlimited local</td><td>STARZPLAY, extra data</td></tr>
            <tr><td><strong>Freedom 500</strong></td><td>AED 500</td><td>Unlimited</td><td>Unlimited all</td><td>5G, roaming data, premium perks</td></tr>
        </tbody>
    </table>

    <h3>du Power Plans</h3>
    <table>
        <thead><tr><th>Plan</th><th>Price</th><th>Data</th><th>Minutes</th><th>Key Perks</th></tr></thead>
        <tbody>
            <tr><td><strong>Power 125</strong></td><td>AED 125</td><td>4 GB (+8 WiFi)</td><td>200 flexi</td><td>WiFi UAE data</td></tr>
            <tr><td><strong>Power 200</strong></td><td>AED 200</td><td>13 GB (+26 WiFi)</td><td>400 flexi</td><td>Disney+, roaming data</td></tr>
            <tr><td><strong>Power 300</strong></td><td>AED 300</td><td>Non-stop (10 Mbps)</td><td>800 flexi</td><td>1 GB roaming, unlimited WiFi</td></tr>
            <tr><td><strong>Power 500</strong></td><td>AED 500</td><td>Unlimited 5G</td><td>1500 flexi</td><td>10 GB roaming, premium perks</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key difference:</strong> du&apos;s Power 125 (AED 125) offers more data than e&&apos;s Freedom Basic (AED 100), making du slightly better value at the entry level. At the premium tier (AED 500), both offer unlimited 5G but e& includes more international calling minutes while du offers more roaming data.
    </div>

    <h2 id="prepaid-plans">Prepaid Plans — Wasel vs du Prepaid</h2>
    <p>Prepaid plans offer flexibility without contracts, making them ideal for visitors, temporary residents, and budget-conscious users.</p>
    <table>
        <thead><tr><th>Provider</th><th>Plan</th><th>Monthly Cost</th><th>Data</th><th>Minutes</th></tr></thead>
        <tbody>
            <tr><td><strong>e&</strong></td><td>Wasel Flexi 35</td><td>AED 35</td><td>500 MB</td><td>30 flexi</td></tr>
            <tr><td><strong>du</strong></td><td>Prepaid 35</td><td>AED 35</td><td>750 MB</td><td>15 flexi</td></tr>
            <tr><td><strong>e&</strong></td><td>Wasel Flexi 100</td><td>AED 100</td><td>3 GB</td><td>60 flexi</td></tr>
            <tr><td><strong>du</strong></td><td>Prepaid 100</td><td>AED 100</td><td>6 GB</td><td>60 flexi</td></tr>
            <tr><td><strong>e&</strong></td><td>Wasel Flexi 160</td><td>AED 160</td><td>5 GB</td><td>120 flexi</td></tr>
            <tr><td><strong>du</strong></td><td>Prepaid 150</td><td>AED 150</td><td>3 GB</td><td>150 flexi</td></tr>
        </tbody>
    </table>
    <p>At the AED 100 tier, <strong>du offers double the data</strong> (6 GB vs 3 GB) for the same price. At the AED 35 tier, du offers more data but fewer minutes. Your choice depends on whether you need more data or more calling minutes.</p>

    <h2 id="tourist-sims">Tourist SIM Cards</h2>
    <p>Both e& and du offer tourist SIM cards available at <strong>Dubai International Airport (DXB)</strong>, <strong>Al Maktoum Airport (DWC)</strong>, and retail stores across the UAE. Tourist SIMs only require a passport — no Emirates ID needed.</p>
    <ul>
        <li><strong>Free starter SIM</strong> — Both operators offer a free SIM with 1 GB data valid for 24 hours at airport desks</li>
        <li><strong>du Tourist 49</strong> — AED 49: 2 GB data, 30 flexi min, 28 days — best budget option</li>
        <li><strong>du Tourist Unlimited 7d</strong> — AED 199: unlimited data, 100 min, 7 days — best for short trips</li>
        <li><strong>e& Visitor 210</strong> — AED 210: 15 GB, 120 min, 28 days — best for extended stays</li>
        <li><strong>eSIM options</strong> — Both providers support eSIM activation — no physical SIM needed</li>
    </ul>

    <h2 id="mnp">Number Portability (MNP) — How to Switch</h2>
    <p><strong>Mobile Number Portability</strong> has been available in the UAE since 2013, regulated by the TDRA. You can switch between e&, du, and Virgin Mobile while keeping your existing phone number.</p>
    <ol>
        <li><strong>Check eligibility</strong> — Your number must be active with no outstanding bills or contract obligations</li>
        <li><strong>Visit the new provider</strong> — Go to any e& or du store with your Emirates ID</li>
        <li><strong>The new provider handles everything</strong> — They manage the porting process</li>
        <li><strong>Completion</strong> — Typically within 1 business day</li>
    </ol>
    <p>The MNP process is <strong>free of charge</strong>. If you have an active postpaid contract, you&apos;ll need to pay an early termination fee (typically 1–2 months&apos; plan cost). Prepaid users should use up any remaining balance before porting, as it doesn&apos;t transfer.</p>

    <h2 id="voip">VoIP and Internet Calling in the UAE</h2>
    <p>The UAE blocks standard VoIP applications like WhatsApp calls, FaceTime, and Skype. However, several <strong>licensed alternatives</strong> are available:</p>
    <table>
        <thead><tr><th>App</th><th>Cost</th><th>Provider</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>BOTIM</strong></td><td>AED 50/month</td><td>Both</td><td>Most popular licensed VoIP in UAE</td></tr>
            <tr><td><strong>C&apos;ME</strong></td><td>Included in some du plans</td><td>du</td><td>Built into du app</td></tr>
            <tr><td><strong>Voico UAE</strong></td><td>AED 50/month</td><td>Both</td><td>Video calling supported</td></tr>
            <tr><td><strong>GoChat</strong></td><td>Included in e& plans</td><td>e&</td><td>Unlimited with Freedom plans</td></tr>
            <tr><td><strong>Microsoft Teams</strong></td><td>Business license</td><td>Both</td><td>Permitted for business accounts</td></tr>
        </tbody>
    </table>

    <h2 id="5g">5G in the UAE</h2>
    <p>The UAE was one of the earliest 5G adopters globally, with e& launching commercial 5G in 2019. Key facts:</p>
    <ul>
        <li><strong>e& 5G</strong> — Covers most of Dubai, Abu Dhabi, Sharjah, and Northern Emirates; typical speeds 500 Mbps–1.5 Gbps</li>
        <li><strong>du 5G</strong> — 90%+ urban coverage; competitive speeds in downtown and business districts</li>
        <li><strong>5G requirements</strong> — 5G-capable device + 5G SIM (free upgrade) + compatible plan tier</li>
        <li><strong>mmWave vs Sub-6</strong> — UAE uses both; mmWave available in select high-density areas for multi-Gbps speeds</li>
    </ul>

    <h2 id="esim">eSIM in the UAE</h2>
    <p>Both e& and du fully support <strong>eSIM</strong> (embedded SIM) technology, allowing you to activate a mobile plan without a physical SIM card.</p>
    <ul>
        <li><strong>Supported devices</strong> — iPhone XS and later, Samsung Galaxy S20+, Google Pixel 3+, iPad Pro, Apple Watch</li>
        <li><strong>Activation</strong> — Via operator app (scan QR code) or in-store</li>
        <li><strong>Dual SIM</strong> — Use a physical SIM + eSIM simultaneously (e.g., work + personal numbers)</li>
        <li><strong>Tourist eSIM</strong> — Activate immediately upon landing — no need to visit a store</li>
    </ul>

    <h2 id="roaming">International Roaming</h2>
    <p>Both operators offer roaming packages for travelers. Key considerations:</p>
    <ul>
        <li><strong>Activate a package BEFORE travel</strong> — Pay-as-you-go roaming is 5–10× more expensive than packages</li>
        <li><strong>GCC roaming</strong> — Cheapest zone; AED 25–40/day for 500 MB + 30 min calls</li>
        <li><strong>Europe/USA</strong> — AED 45–60/day for similar allowances</li>
        <li><strong>e& advantage</strong> — 750+ partner networks in 220+ countries vs du&apos;s 650+ in 200+ countries</li>
        <li><strong>du advantage</strong> — Generally 10–15% cheaper roaming packages</li>
    </ul>

    <h2 id="cost-saving">Cost-Saving Tips</h2>
    <ol>
        <li><strong>Recharge online</strong> — Both operators give 10% bonus data for online recharges</li>
        <li><strong>Use WiFi wherever possible</strong> — Free WiFi is available in malls, cafes, and government buildings</li>
        <li><strong>Choose the right plan tier</strong> — Downgrade if you consistently use less than 50% of your data allowance</li>
        <li><strong>Buy yearly plans</strong> — Wasel Flexi yearly plans save up to 50% vs monthly</li>
        <li><strong>Port your number for promotions</strong> — Switching providers often unlocks welcome offers</li>
        <li><strong>Turn off roaming when not needed</strong> — Prevent accidental roaming charges near UAE borders</li>
        <li><strong>Check for employer corporate plans</strong> — Many companies have negotiated rates 20–40% below retail</li>
    </ol>
`;
