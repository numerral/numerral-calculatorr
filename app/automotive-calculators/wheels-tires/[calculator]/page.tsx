// Dynamic Hub — /automotive-calculators/wheels-tires/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import WheelsTiresCalculatorCore from "@/components/calculator/WheelsTiresCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";

import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("wheels").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("wheels").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/automotive-calculators/wheels-tires/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; contentHTML: string; faq?: { question: string; answer: string }[] }> = {
    "tire-size-calculator": {
        subtitle: "Enter a tire size code (e.g., 225/55R17) to see overall diameter, width, sidewall height, circumference, and revolutions per mile in both inches and millimeters.",
        contentHTML: `<h2>How to Read a Tire Size Code</h2>
<p>A tire marked <strong>225/55R17</strong> contains three critical measurements:</p>
<ul>
<li><strong>225</strong> — Tread width in millimeters (the contact patch width)</li>
<li><strong>55</strong> — Aspect ratio (sidewall height = 55% of the tread width)</li>
<li><strong>R17</strong> — Radial construction, fits a 17-inch rim</li>
</ul>

<h3>Calculating Tire Dimensions</h3>
<table><thead><tr><th>Dimension</th><th>Formula</th><th>Example (225/55R17)</th></tr></thead><tbody>
<tr><td>Sidewall Height</td><td>Width × (Aspect ÷ 100)</td><td>225 × 0.55 = 123.75mm (4.87")</td></tr>
<tr><td>Overall Diameter</td><td>Rim + 2 × Sidewall</td><td>17" + 2 × 4.87" = 26.74"</td></tr>
<tr><td>Circumference</td><td>π × Diameter</td><td>3.14159 × 26.74" = 84.0"</td></tr>
<tr><td>Revolutions/Mile</td><td>63,360 ÷ Circumference</td><td>63,360 ÷ 84.0 = 754 rev/mile</td></tr>
</tbody></table>

<h3>Other Tire Coding Systems</h3>
<p><strong>P-Metric:</strong> P225/55R17 — "P" means passenger car. This is the most common US format.</p>
<p><strong>LT-Metric:</strong> LT265/70R17 — "LT" means Light Truck, built for heavier loads and trailer towing.</p>
<p><strong>Flotation:</strong> 33×12.50R15 — Used for off-road tires. 33 = diameter in inches, 12.50 = width in inches, R15 = 15-inch rim. Common on Jeeps, Broncos, and lifted trucks.</p>

<h3>Tire Load & Speed Ratings</h3>
<p>After the tire size, you'll see additional codes like <strong>99V</strong>:</p>
<ul>
<li><strong>99</strong> — Load index (1,709 lbs per tire max)</li>
<li><strong>V</strong> — Speed rating (149 mph max sustained speed)</li>
</ul>
<table><thead><tr><th>Speed Rating</th><th>Max Speed</th></tr></thead><tbody>
<tr><td>S</td><td>112 mph (180 km/h)</td></tr>
<tr><td>T</td><td>118 mph (190 km/h)</td></tr>
<tr><td>H</td><td>130 mph (210 km/h)</td></tr>
<tr><td>V</td><td>149 mph (240 km/h)</td></tr>
<tr><td>W</td><td>168 mph (270 km/h)</td></tr>
<tr><td>Y</td><td>186 mph (300 km/h)</td></tr>
</tbody></table>`,
        faq: [
            { question: "What does the R in tire size mean?", answer: "R stands for 'Radial' — the internal construction method where cord plies radiate from the center. Virtually all modern passenger tires are radial. You may rarely see 'B' for Bias-ply (some trailer and vintage tires) or 'D' for Diagonal." },
            { question: "Can I put different size tires on my car?", answer: "Yes, within limits. Stay within 3% of the OEM diameter to avoid speedometer errors and ABS issues. Width can vary more (±20mm is usually fine) but check for fender rubbing at full steering lock and over bumps. Never mix different tire sizes on the same axle." },
            { question: "How do I find my car's original tire size?", answer: "Check the placard on the driver's door jamb, the owner's manual, or the sidewall of your current tires. The door jamb also lists the recommended tire pressure." },
        ],
    },
    "tire-size-comparison-calculator": {
        subtitle: "Compare two tire sizes side by side — see the exact diameter, width, sidewall, circumference, and revolutions-per-mile difference. Flags whether the size change is within the safe 3% fitment range.",
        contentHTML: `<h2>How to Compare Tire Sizes</h2>
<p>When upgrading or changing tire sizes, the <strong>overall diameter difference</strong> is the most critical measurement. A tire that's too large can rub on fenders, throw off speedometer readings, and confuse ABS/traction control. A tire that's too small reduces ground clearance and can look visually disproportionate.</p>

<div class="explanation__highlight"><strong>Safe Rule: Stay within ±3% of the OEM overall diameter</strong></div>

<h3>What Changes When You Upsize</h3>
<table><thead><tr><th>Effect</th><th>Larger Tires</th><th>Smaller Tires</th></tr></thead><tbody>
<tr><td>Speedometer</td><td>Reads SLOW (you're going faster)</td><td>Reads FAST (you're going slower)</td></tr>
<tr><td>Ground Clearance</td><td>Increases</td><td>Decreases</td></tr>
<tr><td>Odometer</td><td>Under-counts miles</td><td>Over-counts miles</td></tr>
<tr><td>Acceleration</td><td>Slightly slower (taller gearing)</td><td>Slightly quicker</td></tr>
<tr><td>Fuel Economy</td><td>Slightly worse</td><td>Slightly better</td></tr>
</tbody></table>

<h3>Popular Upsize Examples</h3>
<table><thead><tr><th>From</th><th>To</th><th>Diameter Δ</th><th>Status</th></tr></thead><tbody>
<tr><td>215/55R16</td><td>225/50R17</td><td>+0.1" (+0.4%)</td><td>✅ Safe</td></tr>
<tr><td>225/55R17</td><td>235/65R17</td><td>+1.5" (+5.5%)</td><td>⚠️ Too large</td></tr>
<tr><td>265/70R17</td><td>285/70R17</td><td>+0.8" (+2.4%)</td><td>✅ Safe</td></tr>
<tr><td>225/45R18</td><td>245/40R18</td><td>−0.3" (−1.2%)</td><td>✅ Safe</td></tr>
</tbody></table>`,
        faq: [
            { question: "How much does tire diameter affect speedometer?", answer: "A 3% larger tire makes your speedometer read 3% slow — at an indicated 60 mph, you're actually going 61.8 mph. This also means your odometer under-counts miles by 3%, which can affect resale value, warranty claims, and maintenance intervals." },
        ],
    },
    "tire-size-conversion-calculator": {
        subtitle: "Convert between metric (225/55R17) and inch (26.7×8.9R17) tire size notation. Works for P-metric, LT, and flotation sizes.",
        contentHTML: `<h2>Metric ↔ Inch Tire Size Conversion</h2>
<p>Tire sizes can be expressed in <strong>metric notation</strong> (width/aspect R rim) used by most passenger cars, or <strong>inch notation</strong> (diameter × width R rim) commonly used for off-road and truck tires.</p>
<h3>Metric → Inch Conversion Steps</h3>
<ol>
<li>Calculate sidewall: Width × Aspect% (e.g., 225 × 0.55 = 123.75mm = 4.87")</li>
<li>Calculate diameter: Rim + 2 × Sidewall (e.g., 17" + 2 × 4.87" = 26.7")</li>
<li>Convert width: Width ÷ 25.4 (e.g., 225 ÷ 25.4 = 8.86")</li>
<li>Express as: 26.7 × 8.9R17</li>
</ol>
<h3>Common Off-Road Sizes</h3>
<table><thead><tr><th>Inch</th><th>Metric</th><th>Typical Use</th></tr></thead><tbody>
<tr><td>31×10.50R15</td><td>265/75R15</td><td>Wrangler, Tacoma stock</td></tr>
<tr><td>33×12.50R15</td><td>305/70R15</td><td>Lifted trucks, Jeeps</td></tr>
<tr><td>35×12.50R17</td><td>315/70R17</td><td>Heavy off-road</td></tr>
<tr><td>37×13.50R17</td><td>345/70R17</td><td>Extreme off-road</td></tr>
</tbody></table>`,
        faq: [
            { question: "Why do off-road tires use inch notation?", answer: "Flotation (inch) notation was developed for off-road tires where overall diameter is the primary concern — it tells you immediately how tall the tire is for ground clearance. Metric notation was designed for highway cars where width matters more for grip calculations." },
        ],
    },
    "speedometer-error-calculator": {
        subtitle: "Calculate the speedometer error caused by changing tire sizes. See a complete speed table showing indicated vs actual speed at every 10 mph.",
        contentHTML: `<h2>How Tire Size Causes Speedometer Error</h2>
<p>Your speedometer calculates speed by counting wheel rotations and multiplying by the factory tire circumference. When you change tire sizes, the <strong>actual distance per revolution changes</strong>, but the speedometer doesn't know — it still uses the original calibration.</p>

<div class="explanation__highlight"><strong>Actual Speed = Indicated Speed × (New Tire Diameter ÷ Old Tire Diameter)</strong></div>

<h3>Understanding the Error Direction</h3>
<ul>
<li><strong>Taller tire →</strong> Fewer rotations per mile → Speedometer reads <strong>SLOW</strong> (you're going faster than indicated)</li>
<li><strong>Shorter tire →</strong> More rotations per mile → Speedometer reads <strong>FAST</strong> (you're going slower than indicated)</li>
</ul>

<h3>Legal & Safety Implications</h3>
<p>A 3% speedometer error at highway speed means if your speedometer shows 65 mph, you're actually going <strong>67 mph</strong>. In a 65 mph zone, that difference could mean a speeding ticket. For trucks with tachograph-based speed limiters, the error can cause the truck to exceed legal speed limits while the tachograph shows compliance.</p>

<h3>How to Correct Speedometer Error</h3>
<ul>
<li><strong>Electronic recalibration:</strong> Most modern vehicles can have the ECU reprogrammed at a dealer ($50–$150)</li>
<li><strong>Speedometer gear change:</strong> Older vehicles with cable-driven speedometers need a different driven gear</li>
<li><strong>GPS verification:</strong> Use a GPS app to verify your actual speed and calculate the error %</li>
</ul>`,
        faq: [
            { question: "How much speedometer error is acceptable?", answer: "Most manufacturers calibrate speedometers to read 1–3% fast (a safety margin). Adding a tire change of up to 3% keeps total error under ~6%, which most people find tolerable. Beyond 5% error, you should recalibrate. Many states have no legal requirement to correct speedometer error, but it can affect speeding tickets." },
            { question: "Does tire pressure affect speedometer accuracy?", answer: "Yes, slightly. Under-inflated tires have a smaller effective diameter (the tire 'squishes'), which makes the speedometer read slightly fast. At 10 PSI below recommended, the error is about 0.5–1%. This is generally negligible compared to a tire size change." },
        ],
    },
    "speedometer-gear-calculator": {
        subtitle: "Calculate the correct driven gear tooth count for mechanical speedometers after changing tire size or differential ratio.",
        contentHTML: `<h2>Speedometer Gear Sizing</h2>
<p>Vehicles with cable-driven speedometers (pre-2000s vehicles, many trucks and muscle cars) use a pair of gears in the transmission tailhousing to drive the speedometer cable. When you change tire size or differential ratio, you need a new <strong>driven gear</strong> to maintain accuracy.</p>
<div class="explanation__highlight"><strong>Driven Teeth = (Tire Revs/Mile × Axle Ratio × Drive Teeth) ÷ 1,000</strong></div>
<p>The <strong>drive gear</strong> is attached to the output shaft and stays fixed. The <strong>driven gear</strong> (the replaceable plastic gear) meshes with it and spins the speedometer cable.</p>

<h3>Common Drive Gear Tooth Counts</h3>
<table><thead><tr><th>Vehicle</th><th>Drive Teeth</th></tr></thead><tbody>
<tr><td>GM TH350/TH400</td><td>7 or 8</td></tr>
<tr><td>GM 4L60E/4L80E</td><td>15</td></tr>
<tr><td>Ford C4/C6/AOD</td><td>7 or 8</td></tr>
<tr><td>Ford 4R70W</td><td>7</td></tr>
<tr><td>Chrysler A727/A518</td><td>8</td></tr>
</tbody></table>`,
        faq: [
            { question: "Where do I buy a speedometer gear?", answer: "Aftermarket speedometer gears are available from companies like TCI, B&M, and OER, typically for $10–$25. They come in different colors corresponding to tooth counts. You need to know your transmission type, drive gear tooth count, new tire size, and axle ratio to select the right one." },
        ],
    },
    "wheel-offset-calculator": {
        subtitle: "Calculate the inner clearance and outer position change when switching to wheels with different width and offset (ET). Includes a guide to positive, zero, and negative offset.",
        contentHTML: `<h2>Understanding Wheel Offset</h2>
<p>Wheel offset (measured in millimeters, abbreviated <strong>ET</strong> from the German "Einpresstiefe") is the distance from the wheel's mounting face to its geometric centerline.</p>

<h3>Types of Offset</h3>
<table><thead><tr><th>Type</th><th>Range</th><th>Appearance</th></tr></thead><tbody>
<tr><td><strong>Positive (+)</strong></td><td>+15 to +55mm</td><td>Wheel sits flush or slightly inside fender</td></tr>
<tr><td><strong>Zero (0)</strong></td><td>0mm</td><td>Mounting face at exact center</td></tr>
<tr><td><strong>Negative (−)</strong></td><td>−10 to −44mm</td><td>Wheel pokes outward past fender</td></tr>
</tbody></table>

<h3>What Happens When You Change Offset</h3>
<p><strong>Lower offset (more negative)</strong>: The wheel moves outward — more aggressive stance, potential fender contact, increased steering effort, and added stress on wheel bearings.</p>
<p><strong>Higher offset (more positive)</strong>: The wheel moves inward — more clearance from fenders, but potential contact with suspension components and brakes.</p>

<h3>Backspacing Explained</h3>
<p>Backspacing is the distance from the back edge of the wheel to the mounting face. It's related to offset but accounts for wheel width: <strong>Backspacing = (Width ÷ 2) + Offset</strong>. Wider wheels with the same offset have more backspacing.</p>`,
        faq: [
            { question: "What offset should I choose for an aggressive look?", answer: "For a flush/aggressive stance, drop the offset by 10–15mm from stock. For example, if your factory offset is ET45, try ET30–35 with the same or slightly wider wheel. Going below ET20 on most modern FWD/AWD cars will poke the tire past the fender." },
            { question: "Can wrong offset damage my car?", answer: "Yes. Too much negative offset puts extra leverage on wheel bearings, potentially causing premature failure. It also increases scrub radius, affecting steering feel and ABS performance. Too much positive offset can cause the tire to contact the struts or control arms." },
        ],
    },
    "tire-pressure-calculator": {
        subtitle: "Calculate how temperature changes affect your tire pressure. See the adjusted PSI for your current conditions with bar and kPa conversions.",
        contentHTML: `<h2>How Temperature Affects Tire Pressure</h2>
<p>Tire pressure changes approximately <strong>1 PSI for every 10°F (5.5°C) change</strong> in ambient temperature. This is a direct application of Gay-Lussac's gas law — as gas temperature increases, pressure increases proportionally at constant volume.</p>

<div class="explanation__highlight"><strong>PSI Change ≈ (Current Temp − Baseline Temp) ÷ 10</strong></div>

<h3>Seasonal Pressure Variation</h3>
<p>A tire set to 35 PSI on an 80°F summer day will drop to <strong>30 PSI</strong> on a 30°F winter morning — that's a 14% drop, enough to trigger a TPMS warning and reduce fuel economy by ~3%.</p>

<h3>Recommended Tire Pressures</h3>
<table><thead><tr><th>Vehicle Type</th><th>Front (PSI)</th><th>Rear (PSI)</th></tr></thead><tbody>
<tr><td>Sedan</td><td>32–35</td><td>32–35</td></tr>
<tr><td>SUV</td><td>33–36</td><td>33–36</td></tr>
<tr><td>Light Truck</td><td>35–40</td><td>35–44</td></tr>
<tr><td>Sports Car</td><td>30–34</td><td>32–38</td></tr>
</tbody></table>
<p><strong>Always check pressure when tires are "cold"</strong> — not driven for at least 3 hours. Driving heats the air inside, temporarily raising pressure by 4–6 PSI.</p>`,
        faq: [
            { question: "Should I inflate to the number on the tire sidewall?", answer: "No! The number on the tire sidewall is the maximum pressure, not the recommended. Follow the pressure on the driver's door jamb placard or owner's manual. Over-inflating to the sidewall max causes a harsh ride, uneven center wear, and reduced traction." },
        ],
    },
    "bolt-pattern-calculator": {
        subtitle: "Calculate or verify your wheel bolt pattern (PCD) from bolt count and measurement. Includes presets for popular vehicle bolt patterns.",
        contentHTML: `<h2>What Is a Bolt Pattern (PCD)?</h2>
<p><strong>Pitch Circle Diameter (PCD)</strong> is the diameter of the imaginary circle passing through the center of each bolt hole. It's expressed as <strong>"bolts × diameter"</strong>, e.g., 5×114.3 means 5 bolts on a 114.3mm circle.</p>

<h3>How to Measure Your Bolt Pattern</h3>
<p><strong>4 or 6 bolts:</strong> Measure the distance between the centers of two opposite bolt holes. That measurement is the PCD.</p>
<p><strong>5 bolts:</strong> Measure from the center of one bolt hole to the center of the bolt hole across (not adjacent). Multiply by 1.0515 to get PCD.</p>

<h3>Common Bolt Patterns by Make</h3>
<table><thead><tr><th>Bolt Pattern</th><th>Vehicles</th></tr></thead><tbody>
<tr><td>4×100</td><td>Honda Civic/Fit, Toyota Yaris/Corolla (older), VW Golf (older), Mazda MX-5</td></tr>
<tr><td>5×100</td><td>Toyota (Corolla, Prius, BRZ), Subaru (WRX, Impreza), VW Golf/Jetta</td></tr>
<tr><td>5×112</td><td>Audi (A4, A6, Q5), VW (Golf 8, Tiguan), Mercedes (C, E Class)</td></tr>
<tr><td>5×114.3</td><td>Honda (Accord, CR-V), Toyota (Camry, RAV4), Nissan, Hyundai, Ford (Mustang)</td></tr>
<tr><td>5×120</td><td>BMW (3/4/5 Series), Tesla Model 3, Chevy Camaro, Land Rover</td></tr>
<tr><td>6×139.7</td><td>Toyota (Tacoma, 4Runner), Chevy/GMC (Silverado), Ford (Ranger)</td></tr>
</tbody></table>

<p><strong>Important:</strong> Even if the bolt pattern matches, you must also verify <strong>hub bore diameter</strong> (the center hole), <strong>wheel offset</strong>, and <strong>wheel width</strong> for safe fitment. Hub-centric rings are needed if the hub bore doesn't match.</p>`,
        faq: [
            { question: "Can I convert one bolt pattern to another?", answer: "Yes, using bolt pattern adapters (spacers with different bolt patterns on each side). However, they add thickness (20–40mm), changing your effective offset. They also add a potential failure point. Quality adapters from companies like Motorsport Tech or Ichiba are generally safe; avoid no-name adapters." },
            { question: "What if my bolt pattern is close but not exact?", answer: "Even a 1mm difference matters. For example, 5×114.3 and 5×115 are NOT interchangeable — the 0.7mm difference causes the bolts to sit off-center, which leads to vibration, uneven bolt loading, and potential wheel failure at speed. Always match exactly." },
        ],
    },
};

export default async function WheelsCalcHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("wheels").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/automotive-calculators/wheels-tires/${calc.slug}`);
    const schemas: object[] = [
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Automotive Calculators", url: canonicalUrl("/automotive-calculators") }, { name: "Wheels & Tires", url: canonicalUrl("/automotive-calculators/wheels-tires") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl, "USD", "UtilitiesApplication"),
    ];
    if (content?.faq && content.faq.length > 0) {
        schemas.push(faqSchema(content.faq));
    }
    const schemaData = JSON.stringify(schemas);
    const allWheelsCalcs = getCalculatorsByCategory("wheels").filter(c => c.slug !== calculator);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-wheels-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Automotive", href: "/automotive-calculators" }, { label: "Wheels & Tires", href: "/automotive-calculators/wheels-tires" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <WheelsTiresCalculatorCore calcType={calc.calcType || "tire-size"} />
                    <AuthorBadge categoryKey="wheels" />
                    {content && (<>
                        <DynamicExplanation heading={`How to Use the ${calc.title}`} contentHTML={content.contentHTML} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    <RelatedCalculators calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar">
                    <div className="sidebar-card" style={{ position: "sticky", top: "80px" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>🛞 Wheels & Tires Tools</h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            {allWheelsCalcs.slice(0, 9).map(c => (
                                <li key={c.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                                    <a href={`/automotive-calculators/wheels-tires/${c.slug}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.87rem", textDecoration: "none", color: "var(--text)" }}>
                                        <span>{c.title.replace(/ Calculator$/, "")}</span>
                                        <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>→</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <a href="/automotive-calculators/wheels-tires" style={{ display: "block", marginTop: "14px", fontSize: "0.82rem", color: "#d4620a", fontWeight: 600, textDecoration: "none" }}>View all Wheel Calculators →</a>
                    </div>
                </aside>
            </div>
        </main>
    );
}
