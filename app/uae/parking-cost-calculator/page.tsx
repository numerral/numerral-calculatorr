import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEParkingCostCalculatorCore from "@/components/calculator/UAEParkingCostCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Parking Cost Calculator UAE 2026 — Dubai RTA & Abu Dhabi Mawaqif",
    description: "Calculate parking costs in Dubai and Abu Dhabi. Updated April 2025 variable tariffs (current rates) with peak/off-peak pricing. RTA zones, Mawaqif rates, monthly commuter costs, parking fines, and free parking schedule.",
    keywords: ["parking cost calculator UAE", "Dubai parking rates 2026", "RTA parking zones", "Mawaqif parking Abu Dhabi", "Dubai parking fine", "free parking Dubai", "mParking Dubai", "parking cost per hour Dubai", "Abu Dhabi parking permit cost", "Dubai variable parking tariff 2026"],
    alternates: { canonical: canonicalUrl("/uae/parking-cost-calculator") },
};

const FAQ_ITEMS = [
    { question: "How much does parking cost per hour in Dubai?", answer: "Dubai parking rates vary by zone and time of day since the April 2025 variable tariff update. Standard zones charge AED 4/hour (all day). Premium zones (near metro stations and high-demand areas) charge AED 6/hour during peak hours (8–10 AM & 4–8 PM) and AED 4/hour off-peak. Zone B off-street costs AED 3/hour (standard) or AED 6/2 per hour (premium peak/off-peak). Multi-level garages charge AED 5/hour with an AED 40 daily max. The most expensive is Grand Events parking near DWTC at AED 25/hour during events." },
    { question: "What are the new Dubai parking tariff changes for 2025?", answer: "Effective April 4, 2025, Dubai's RTA introduced variable parking tariffs with peak and off-peak pricing for the first time. Peak hours (8–10 AM & 4–8 PM) have higher rates — up to AED 6/hour in premium zones — while off-peak hours (10 AM–4 PM & 8–10 PM) are AED 2–4/hour. Additionally, a new Zone F (Al Sufouh 2) was created at AED 4/hour with an AED 32 daily max, and Grand Events parking was introduced at AED 25/hour for DWTC events. These changes aim to reduce congestion by incentivizing off-peak parking." },
    { question: "When is parking free in Dubai?", answer: "Parking in Dubai is free during: (1) Sundays — all day, all zones (except Al Khail Gate and multi-storey garages). (2) Public holidays — all day, as announced by the government. (3) Night hours — 10:00 PM to 8:00 AM in most zones. (4) Ramadan — adjusted schedule with a 2-hour free break between 6 PM and 8 PM. Exceptions: Al Khail Gate (Zone N.365) operates 24/7 with no free periods. Multi-storey car parks are paid 24 hours, every day. Always check zone signage for premium areas with different timing." },
    { question: "How much does parking cost in Abu Dhabi (Mawaqif)?", answer: "Abu Dhabi's Mawaqif parking system has two main zone types: Premium zones (white & turquoise curbs) at AED 3–4/hour with a 4-hour maximum stay, and Standard zones (black & turquoise curbs) at AED 2/hour with an AED 15 daily maximum. Multi-storey car parks also charge AED 2/hour with an AED 15 daily cap. Paid parking operates Monday to Saturday, 8 AM to midnight. Sundays and public holidays are free. This makes Abu Dhabi parking significantly cheaper than Dubai's premium zones." },
    { question: "What is a Mawaqif parking permit and how much does it cost?", answer: "Mawaqif offers several parking permit options in Abu Dhabi: Residential permits cost AED 800/year for the first car and AED 1,200 for the second car (non-UAE nationals; free for UAE nationals). For daily commuters, public parking passes are available: AED 391/month, AED 1,174/3 months, AED 2,348/6 months, or AED 4,695/year. Multi-storey annual passes cost AED 5,475. A monthly pass (AED 391) is worth it if your daily parking costs exceed about AED 18/day for 22+ working days per month." },
    { question: "What are the parking fines in Dubai?", answer: "Dubai parking fines range from AED 100 to AED 1,000: No valid ticket or expired meter: AED 150. Overstaying paid duration: AED 100. Parking in non-designated areas: AED 200. Incorrect parking or obstructing traffic: AED 200. Double parking: AED 200–500. Blocking pedestrian crossings: AED 400. Parking in disabled spaces without a permit: AED 1,000. Blocking fire hydrants: AED 1,000. Damaging parking equipment: AED 1,000. Fines are linked to your vehicle registration and can be paid through the Dubai Police website, RTA apps, or banks." },
    { question: "How do I pay for parking in Dubai?", answer: "Dubai offers multiple parking payment methods: (1) mParking SMS — send '<Plate Number> <Zone Number> <Hours>' to 7275 (PARK), with a 30 fils surcharge per SMS. (2) RTA Dubai App or Dubai Drive App — official mobile apps. (3) Dubai Now App — partner app for parking and other government services. (4) Mahboub Chatbot — via WhatsApp at +971 58 8009090. (5) Self-service machines — accept coins, NOL cards, or bank cards at parking locations. (6) NOL card — tap at parking meters. The mParking SMS is the most popular method as it requires no app installation." },
    { question: "What is the difference between peak and off-peak parking rates in Dubai?", answer: "Since April 2025, Dubai has variable parking rates based on time: Peak hours are 8:00–10:00 AM and 4:00–8:00 PM (Monday–Saturday) — these coincide with rush hours. Off-peak hours are 10:00 AM–4:00 PM and 8:00–10:00 PM. In premium zones, the difference is significant: AED 6/hour (peak) vs AED 2–4/hour (off-peak). For standard zones, the rate is flat at AED 3–4/hour regardless of time. If you have flexibility, parking during off-peak hours can save you 33–67% compared to peak rates in premium zones." },
    { question: "Which Dubai parking zones are near metro stations?", answer: "Premium parking zones (AED 6/hour peak) are typically located within 500 meters of metro stations and in high-demand commercial districts. Major areas with premium parking include: Downtown Dubai stations, Dubai Marina/JLT area, Business Bay metro, Mall of the Emirates, Dubai Internet City, and TECOM. Look for the 'Premium' designation on zone signs. If you're commuting, consider using the metro instead — a daily metro pass costs AED 22 for all zones, which can be cheaper than a full day of premium parking." },
    { question: "How much does monthly parking cost in Dubai for commuters?", answer: "Monthly parking costs in Dubai vary dramatically by zone. For a typical commuter parking 8 hours/day, 5 days/week (about 22 days/month): Zone A Standard: ~AED 704/month (AED 32/day). Zone A Premium (peak): ~AED 1,056/month (AED 48/day). Zone B Standard: ~AED 440/month (capped at AED 20/day). Multi-level garage: ~AED 880/month (capped at AED 40/day). In Abu Dhabi, a Mawaqif monthly pass at AED 391 is almost always cheaper than pay-as-you-go for daily commuters." },
    { question: "Is parking free during Ramadan in Dubai?", answer: "Parking is not completely free during Ramadan, but the schedule is adjusted. During Ramadan 2025, paid parking operates in a split schedule: 8:00 AM to 6:00 PM, then a 2-hour free break, then 8:00 PM to midnight. Standard free parking on Sundays and during night hours (after midnight) still applies. Multi-storey parking facilities remain 24-hour paid during Ramadan. The adjusted hours accommodate the earlier work schedules and iftar timing during the holy month." },
    { question: "What happens if I get a parking fine in Dubai?", answer: "When you receive a parking fine in Dubai, it's automatically linked to your vehicle registration. You can check and pay fines through: (1) Dubai Police website or app. (2) RTA apps. (3) Mobile banking apps. (4) Customer Happiness Centers. (5) Authorized bank branches. You can dispute a fine within 30 days by submitting an objection with evidence (photos, valid permits, witness statements) through the same channels. A response is expected within 10 working days. For rental cars, fines must be cleared before returning the vehicle." },
    { question: "What is the daily maximum parking charge in Dubai?", answer: "Daily maximum charges (parking caps) apply in several Dubai zones: Zone B Standard: AED 20/day. Zone B Premium: AED 30/day. Zone C: AED 40/day (for more than 4 hours). Zone D: AED 20/day. Zone F (Al Sufouh 2): AED 32/day. Multi-level garages: AED 40/day. Note that Zone A (on-street) does NOT have a daily cap — they have a maximum stay of 4 hours instead. If you need all-day parking, Zone B Standard (AED 20 cap) is the cheapest option, while multi-level garages offer covered parking for AED 40/day." },
    { question: "Can I park overnight in Dubai for free?", answer: "Yes, in most public parking zones in Dubai, parking is free overnight from 10:00 PM to 8:00 AM. However, there are exceptions: Al Khail Gate (Zone N.365) has no free overnight period — it's paid 24/7. Multi-storey car parks operate on 24-hour paid parking. Some premium zones may have different timing. Additionally, if you park during paid hours and don't move your vehicle overnight, you'll only be charged for the paid hours (up to 10 PM). Always check the zone signage for specific restrictions." },
    { question: "How does Abu Dhabi residential parking work?", answer: "Abu Dhabi's Mawaqif system has designated residential parking zones marked with turquoise lines or 'Resident Permit Only' signs. UAE nationals get free residential permits (up to 4 vehicles for apartments, 10 for villas). Non-UAE nationals pay AED 800/year for the first car and AED 1,200 for the second car. Permit holders park for free in their designated zone 24/7. Non-permit holders can use these spaces by paying standard hourly rates, except between 9:00 PM and 8:00 AM when they're restricted to permit holders only. Villa residents with permits can park all day at no cost." },
];

export default function ParkingCostCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Parking Cost Calculator" },
        ]),
        webAppSchema("Parking Cost Calculator UAE", canonicalUrl("/uae/parking-cost-calculator")),
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
            <Script id="schema-park" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Parking Cost Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Parking Cost Calculator UAE 2026 — Dubai RTA & Abu Dhabi Mawaqif</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your parking costs in Dubai and Abu Dhabi with the latest 2026 rates. Covers all Dubai RTA zones (including the new April 2025 variable peak/off-peak tariffs), Abu Dhabi Mawaqif premium and standard zones, monthly commuter cost comparisons, parking fines, and the complete free parking schedule.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAEParkingCostCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE Parking FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/traffic-fine-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🚦</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Traffic Fine Calculator</div>
                            <div className="uae-related-link__desc">Check your UAE traffic fine amount and black points</div>
                        </div>
                    </Link>
                    <Link href="/uae/rent-affordability-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Rent Affordability Calculator</div>
                            <div className="uae-related-link__desc">Factor parking costs into your housing budget</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">See how parking fits in your monthly budget</div>
                        </div>
                    </Link>
                    <Link href="/uae/dewa-bill-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">⚡</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">DEWA Bill Calculator</div>
                            <div className="uae-related-link__desc">Estimate your Dubai utility costs</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="dubai-parking">Dubai Parking Rates — April 2025 Variable Tariffs</h2>
    <p>On April 4, 2025, Dubai's <strong>Roads and Transport Authority (RTA)</strong> — now managed by <strong>Parkin</strong> — introduced a major overhaul of the parking tariff system. For the first time, Dubai uses <strong>variable pricing</strong> with different peak and off-peak rates to manage demand and reduce congestion during rush hours.</p>
    <h3>Peak vs Off-Peak Hours</h3>
    <table>
        <thead><tr><th>Period</th><th>Hours</th><th>Premium Rate</th><th>Standard Rate</th></tr></thead>
        <tbody>
            <tr><td><strong>Peak</strong></td><td>8:00–10:00 AM & 4:00–8:00 PM</td><td>AED 6/hr</td><td>AED 4/hr</td></tr>
            <tr><td><strong>Off-Peak</strong></td><td>10:00 AM–4:00 PM & 8:00–10:00 PM</td><td>AED 2–4/hr</td><td>AED 2–4/hr</td></tr>
        </tbody>
    </table>
    <p>The variable pricing applies Monday through Saturday. <strong>Sundays remain free</strong> for most zones.</p>

    <h2 id="dubai-zones">Dubai Parking Zones Explained</h2>
    <p>Dubai's parking is divided into multiple zone types, each with different pricing and rules:</p>
    <table>
        <thead><tr><th>Zone</th><th>Type</th><th>Peak Rate</th><th>Off-Peak</th><th>Daily Max</th></tr></thead>
        <tbody>
            <tr><td><strong>Zone A</strong></td><td>Standard on-street</td><td>AED 4/hr</td><td>AED 4/hr</td><td>No cap (4hr max stay)</td></tr>
            <tr><td><strong>Zone A Premium</strong></td><td>Near metro/high-demand</td><td>AED 6/hr</td><td>AED 4/hr</td><td>No cap (4hr max stay)</td></tr>
            <tr><td><strong>Zone B</strong></td><td>Standard off-street</td><td>AED 3/hr</td><td>AED 3/hr</td><td>AED 20</td></tr>
            <tr><td><strong>Zone B Premium</strong></td><td>Off-street premium</td><td>AED 6/hr</td><td>AED 2/hr</td><td>AED 30</td></tr>
            <tr><td><strong>Zone C</strong></td><td>On-street</td><td>AED 6/hr</td><td>AED 3/hr</td><td>AED 40</td></tr>
            <tr><td><strong>Zone D</strong></td><td>Off-street</td><td>AED 4/hr</td><td>AED 2/hr</td><td>AED 20</td></tr>
            <tr><td><strong>Zone F</strong></td><td>Al Sufouh 2</td><td>AED 4/hr</td><td>AED 4/hr</td><td>AED 32</td></tr>
            <tr><td><strong>Zone W</strong></td><td>Standard</td><td>AED 4/hr</td><td>AED 4/hr</td><td>—</td></tr>
            <tr><td><strong>Zone WP</strong></td><td>Premium</td><td>AED 6/hr</td><td>AED 4/hr</td><td>—</td></tr>
            <tr><td><strong>Multi-Level</strong></td><td>Garages</td><td>AED 5/hr</td><td>AED 5/hr</td><td>AED 40</td></tr>
            <tr><td><strong>Grand Events</strong></td><td>DWTC area</td><td>AED 25/hr</td><td>—</td><td>—</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Best value:</strong> Zone B Standard at AED 3/hour with an AED 20 daily cap is the cheapest all-day parking in Dubai. For short stays (1–2 hours), Zone D off-peak at AED 2/hour saves the most.
    </div>

    <h2 id="free-parking">Free Parking in Dubai & Abu Dhabi</h2>
    <p>Understanding when parking is free can save hundreds of AED per month:</p>
    <table>
        <thead><tr><th>When</th><th>Dubai</th><th>Abu Dhabi</th></tr></thead>
        <tbody>
            <tr><td><strong>Sundays</strong></td><td>Free all day ✅</td><td>Free all day ✅</td></tr>
            <tr><td><strong>Public holidays</strong></td><td>Free all day ✅</td><td>Free all day ✅</td></tr>
            <tr><td><strong>Night hours</strong></td><td>Free 10 PM – 8 AM</td><td>Free 12 AM – 8 AM</td></tr>
            <tr><td><strong>Ramadan</strong></td><td>Adjusted: 8AM–6PM & 8PM–midnight</td><td>Normal schedule</td></tr>
        </tbody>
    </table>
    <p><strong>Exceptions:</strong> Al Khail Gate (Zone N.365) in Dubai has <strong>no free parking</strong> — it operates 24/7, 365 days a year. Multi-storey car parks also run on 24-hour paid schedules.</p>

    <h2 id="mawaqif">Abu Dhabi Mawaqif Parking System</h2>
    <p><strong>Mawaqif</strong> is Abu Dhabi's official parking management system. It's simpler and more affordable than Dubai's system:</p>
    <table>
        <thead><tr><th>Zone</th><th>Rate</th><th>Max Stay</th><th>Daily Max</th></tr></thead>
        <tbody>
            <tr><td><strong>Premium</strong> (white & turquoise)</td><td>AED 3–4/hr</td><td>4 hours</td><td>—</td></tr>
            <tr><td><strong>Standard</strong> (black & turquoise)</td><td>AED 2/hr</td><td>24 hours</td><td>AED 15</td></tr>
            <tr><td><strong>Multi-storey</strong></td><td>AED 2/hr</td><td>24 hours</td><td>AED 15</td></tr>
        </tbody>
    </table>
    <p>Mawaqif parking operates <strong>Monday to Saturday, 8 AM – midnight</strong>. Sundays and public holidays are free.</p>

    <h2 id="permits">Abu Dhabi Parking Permits</h2>
    <p>Mawaqif offers several permit options for daily parkers:</p>
    <table>
        <thead><tr><th>Permit Type</th><th>Cost</th></tr></thead>
        <tbody>
            <tr><td><strong>Residential — 1st car (non-UAE)</strong></td><td>AED 800/year</td></tr>
            <tr><td><strong>Residential — 2nd car (non-UAE)</strong></td><td>AED 1,200/year</td></tr>
            <tr><td><strong>Residential — UAE nationals</strong></td><td>Free</td></tr>
            <tr><td><strong>Public pass — Monthly</strong></td><td>AED 391</td></tr>
            <tr><td><strong>Public pass — 3 months</strong></td><td>AED 1,174</td></tr>
            <tr><td><strong>Public pass — 6 months</strong></td><td>AED 2,348</td></tr>
            <tr><td><strong>Public pass — Annual</strong></td><td>AED 4,695</td></tr>
            <tr><td><strong>Multi-storey — Annual</strong></td><td>AED 5,475</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>When is a monthly pass worth it?</strong> If you park 22+ days/month at AED 2/hour for 8 hours (AED 16/day), you'd pay AED 352/month vs AED 391 for a pass — not quite worth it. But at AED 3/hour premium (AED 24/day × 22 = AED 528/month), the pass saves AED 137/month. Use our calculator above.
    </div>

    <h2 id="payment">How to Pay for Parking in the UAE</h2>
    <h3>Dubai Payment Methods</h3>
    <ol>
        <li><strong>mParking (SMS):</strong> Send <code>&lt;Plate&gt; &lt;Zone&gt; &lt;Hours&gt;</code> to <strong>7275</strong> (PARK). Surcharge: 30 fils per SMS</li>
        <li><strong>RTA Dubai App / Dubai Drive App:</strong> Official apps with zone finder and payment</li>
        <li><strong>Dubai Now App:</strong> Government partner app for parking and all services</li>
        <li><strong>Mahboub Chatbot:</strong> WhatsApp at +971 58 8009090</li>
        <li><strong>Self-service machines:</strong> Accept coins, NOL cards, or bank cards</li>
        <li><strong>NOL card:</strong> Tap at parking meters</li>
    </ol>
    <h3>Abu Dhabi Payment Methods</h3>
    <ol>
        <li><strong>Mawaqif SMS:</strong> Send <code>&lt;Plate&gt; &lt;Zone&gt; &lt;Hours&gt;</code> to the designated number</li>
        <li><strong>DARB App:</strong> Abu Dhabi Mobility app for parking and tolls</li>
        <li><strong>Parking meters:</strong> Accept coins and cards</li>
    </ol>

    <h2 id="fines">Dubai Parking Fines</h2>
    <p>Parking violations in Dubai carry fines from <strong>AED 100 to AED 1,000</strong>:</p>
    <table>
        <thead><tr><th>Violation</th><th>Fine</th></tr></thead>
        <tbody>
            <tr><td>No valid ticket / expired meter</td><td><strong>AED 150</strong></td></tr>
            <tr><td>Overstaying paid duration</td><td><strong>AED 100</strong></td></tr>
            <tr><td>Parking in non-designated area</td><td><strong>AED 200</strong></td></tr>
            <tr><td>Incorrect parking / obstructing traffic</td><td><strong>AED 200</strong></td></tr>
            <tr><td>Double parking</td><td><strong>AED 200–500</strong></td></tr>
            <tr><td>Blocking pedestrian crossing</td><td><strong>AED 400</strong></td></tr>
            <tr><td>Parking on sidewalk</td><td><strong>AED 400</strong></td></tr>
            <tr><td>Blocking behind vehicles</td><td><strong>AED 500</strong></td></tr>
            <tr><td>Disabled space without permit</td><td><strong>AED 1,000</strong></td></tr>
            <tr><td>Blocking fire hydrant</td><td><strong>AED 1,000</strong></td></tr>
            <tr><td>Damaging parking equipment</td><td><strong>AED 1,000</strong></td></tr>
        </tbody>
    </table>
    <p>Fines can be paid via the <strong>Dubai Police app</strong>, <strong>RTA apps</strong>, or <strong>mobile banking</strong>. Use our <a href="/uae/traffic-fine-calculator">Traffic Fine Calculator</a> for a comprehensive fine lookup.</p>

    <h2 id="commuter-tips">Tips to Save on Parking</h2>
    <ol>
        <li><strong>Park during off-peak:</strong> Save 33–67% in premium zones by avoiding 8–10 AM & 4–8 PM</li>
        <li><strong>Use Zone B:</strong> AED 20 daily cap — cheapest all-day parking in Dubai</li>
        <li><strong>Combine with metro:</strong> Park at outer stations and ride the metro to your destination</li>
        <li><strong>Check for daily caps:</strong> Some zones cap daily charges even if hourly rates seem high</li>
        <li><strong>Mawaqif passes:</strong> Abu Dhabi monthly pass (AED 391) saves money if parking >18 days/month in premium zones</li>
        <li><strong>Use mParking SMS:</strong> Only 30 fils surcharge vs higher app-based fees</li>
        <li><strong>Park on Sundays:</strong> Free in both Dubai and Abu Dhabi</li>
        <li><strong>Night parking:</strong> Free after 10 PM (Dubai) or midnight (Abu Dhabi) in most zones</li>
    </ol>

    <h2 id="dubai-vs-abudhabi">Dubai vs Abu Dhabi Parking — Quick Comparison</h2>
    <table>
        <thead><tr><th>Feature</th><th>Dubai (RTA/Parkin)</th><th>Abu Dhabi (Mawaqif)</th></tr></thead>
        <tbody>
            <tr><td><strong>Cheapest hourly</strong></td><td>AED 2 (Zone D off-peak)</td><td>AED 2 (Standard zone)</td></tr>
            <tr><td><strong>Most expensive</strong></td><td>AED 25 (Grand Events)</td><td>AED 4 (Premium zone)</td></tr>
            <tr><td><strong>All-day cheapest</strong></td><td>AED 20 (Zone B)</td><td>AED 15 (Standard/multi-storey)</td></tr>
            <tr><td><strong>Variable pricing</strong></td><td>Yes (since April 2025)</td><td>No</td></tr>
            <tr><td><strong>Free day</strong></td><td>Sundays</td><td>Sundays</td></tr>
            <tr><td><strong>Free nights</strong></td><td>10 PM – 8 AM</td><td>12 AM – 8 AM</td></tr>
            <tr><td><strong>Monthly pass</strong></td><td>Not available</td><td>AED 391/month</td></tr>
            <tr><td><strong>Residential permit</strong></td><td>N/A (zone-based)</td><td>AED 800–1,200/year (expats)</td></tr>
        </tbody>
    </table>

    <h2 id="residential">Residential Parking in Abu Dhabi</h2>
    <p>Abu Dhabi's Mawaqif designates <strong>residential parking zones</strong> marked with turquoise lines:</p>
    <ul>
        <li><strong>UAE nationals:</strong> Free permits — up to 4 vehicles for apartments, 10 for villas</li>
        <li><strong>Non-UAE nationals:</strong> AED 800/year (1st car), AED 1,200/year (2nd car)</li>
        <li><strong>Hours:</strong> Permit holders park free 24/7 in their zone. Non-permit holders pay standard rates except 9 PM – 8 AM (restricted)</li>
        <li><strong>Villa visitors:</strong> UAE nationals park free; non-UAE pay AED 2/hour (free until 2 AM)</li>
    </ul>
`;
