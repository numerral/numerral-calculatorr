// Dynamic Hub — /density-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import DensityCalculatorCore from "@/components/calculator/DensityCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("density").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("density").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/density-calculators/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; explanation?: { heading: string; paragraphs?: string[]; contentHTML?: string; highlight?: string }; faq?: { question: string; answer: string }[] }> = {

    "ping-pong-balls-pool-calculator": {
        subtitle: "Calculate how many ping pong balls it takes to fill a swimming pool. Enter pool dimensions and see the answer — plus the math behind it.",
        explanation: { heading: "How to Calculate Ping Pong Balls to Fill a Pool", contentHTML: `<h2>The Ping Pong Ball Pool Problem</h2>
<p>How many ping pong balls does it take to fill a swimming pool? This classic math and physics problem combines geometry, volume calculations, and an important concept called packing efficiency. It is a common job interview and physics class question that demonstrates practical application of <a href="/density-calculators/density-calculator">density</a> and volume concepts.</p>

<h2>How to Calculate It</h2>

<h3>Step-by-Step Method</h3>
<div class="explanation__highlight"><strong>Step 1:</strong> Calculate pool volume = Length × Width × Average Depth<br/><strong>Step 2:</strong> Ball volume = (4/3) × π × r³ = 33.51 cm³ (40 mm diameter)<br/><strong>Step 3:</strong> Apply random packing efficiency ≈ 64% (Bernal packing)<br/><strong>Step 4:</strong> Number of balls = Pool volume × 0.64 / Ball volume</div>
<p>A regulation ping pong ball has a diameter of 40 mm and weighs 2.7 grams. When you randomly fill a container with spheres, only about 64% of the space is occupied by the spheres — the remaining 36% is air gaps between them. This is known as random (Bernal) packing.</p>

<h3>Worked Example</h3>
<p>A standard residential pool (20 ft × 40 ft × 5 ft average depth):</p>
<p>Pool volume = 20 × 40 × 5 = 4,000 ft³ = 113.27 m³ = 113,270,000 cm³<br/>Usable space = 113,270,000 × 0.64 = 72,492,800 cm³<br/>Balls = 72,492,800 / 33.51 ≈ <strong>2.16 million ping pong balls</strong></p>`, highlight: "A standard 20×40 ft residential pool holds about 2.1 million ping pong balls (with 64% random packing efficiency)." },
    },

    "density-calculator": {
        subtitle: "Calculate density, mass, or volume using ρ = m/V. Solve for any variable. Includes a reference table of common material densities.",
        explanation: { heading: "How to Calculate Density", contentHTML: `<h2>What Is Density?</h2>
<p>Density is a measure of how much <a href="/physics-calculators/mass-calculator">mass</a> is contained in a given volume. It is an intrinsic property of a material — meaning it does not depend on the amount of the substance. A teaspoon of gold has the same density (19,300 kg/m³) as a gold bar.</p>
<p>Density determines whether an object floats or sinks: objects denser than water (1,000 kg/m³) sink, while less dense objects float. This principle is used in material identification, quality control, and engineering design.</p>

<h2>How to Calculate Density</h2>

<h3>The Density Formula (Density Triangle)</h3>
<div class="explanation__highlight"><strong>ρ = m / V</strong> — solve for density<br/><strong>m = ρ × V</strong> — solve for <a href="/physics-calculators/mass-calculator">mass</a><br/><strong>V = m / ρ</strong> — solve for volume</div>
<p>Where ρ (rho) is density in kg/m³, m is mass in kg, and V is volume in m³. In US customary units, density is often expressed as lb/ft³ or lb/gal.</p>

<h3>Worked Example</h3>
<p>A block of aluminum has a mass of 2.7 kg and a volume of 0.001 m³ (1 liter):</p>
<p>ρ = 2.7 / 0.001 = <strong>2,700 kg/m³</strong></p>

<h2>Densities of Common Materials</h2>
<p>Air: 1.225 kg/m³. Wood (oak): 600–900 kg/m³. Water: 1,000 kg/m³. Concrete: 2,300 kg/m³. Aluminum: 2,700 kg/m³. Steel: 7,850 kg/m³. Copper: 8,960 kg/m³. Lead: 11,340 kg/m³. Gold: 19,300 kg/m³. Use our <a href="/density-calculators/metal-weight-calculator">metal weight calculator</a> to find the weight of specific metal shapes.</p>`, highlight: "Water: 1,000 kg/m³. Aluminum: 2,700. Steel: 7,850. Gold: 19,300. Objects denser than water sink." },
        faq: [
            { question: "What is the densest material on Earth?", answer: "Osmium is the densest naturally occurring element at 22,590 kg/m³ — about 22.6 times denser than water and even denser than gold (19,300 kg/m³)." },
            { question: "What affects density?", answer: "Temperature affects density because most materials expand when heated, reducing their density. Pressure increases density through compression. Composition matters too — alloys and impurities change density. Water is unusual: it is densest at 4°C, not at its freezing point." },
        ],
    },

    "metal-weight-calculator": {
        subtitle: "Calculate the weight of metal by shape (plate, round bar, tube) and alloy. Supports 12 metals including steel, aluminum, copper, and titanium.",
        explanation: { heading: "How to Calculate Metal Weight", contentHTML: `<h2>Why Calculate Metal Weight?</h2>
<p>Calculating the weight of metal is essential for shipping estimates, structural engineering, CNC job quoting, and material purchasing. The weight depends on the shape of the piece, its dimensions, and the <a href="/density-calculators/density-calculator">density</a> of the specific alloy used.</p>

<h2>How to Calculate Metal Weight</h2>

<h3>Metal Weight Formula</h3>
<div class="explanation__highlight"><strong>Weight = Volume × Density</strong></div>
<p>Volume formulas by shape:</p>
<ul><li><strong>Plate/Sheet:</strong> V = Length × Width × Thickness</li><li><strong>Round bar:</strong> V = π × (Diameter/2)² × Length</li><li><strong>Tube:</strong> V = π × ((OD/2)² − (ID/2)²) × Length</li></ul>

<h2>Common Metal Densities</h2>
<p>Aluminum: 2,700 kg/m³ (168.6 lb/ft³). Titanium: 4,507 kg/m³. Steel (carbon): 7,850 kg/m³ (490 lb/ft³). Stainless steel: 8,000 kg/m³. Brass: 8,500 kg/m³. Copper: 8,960 kg/m³. Lead: 11,340 kg/m³. Aluminum is about 3 times lighter than steel, making it popular for aerospace and automotive applications where weight savings matter.</p>`, highlight: "Steel is 7,850 kg/m³, aluminum is 2,700 (3× lighter), titanium is 4,507. Metal weight = volume × density." },
    },

    "snow-water-equivalent-calculator": {
        subtitle: "Calculate snow water equivalent (SWE) from snow depth and snow-to-water ratio. Used in hydrology, flood forecasting, and water supply management.",
        explanation: { heading: "How to Calculate Snow Water Equivalent", contentHTML: `<h2>What Is Snow Water Equivalent?</h2>
<p>Snow water equivalent (SWE) tells you how much liquid water is stored in a snowpack. It is the depth of water that would result if the entire snowpack were melted instantly. SWE is critical for flood forecasting, reservoir management, and water supply planning in regions that depend on snowmelt for their water supply.</p>

<h2>How to Calculate SWE</h2>

<h3>Snow Water Equivalent Formula</h3>
<div class="explanation__highlight"><strong>SWE = Snow Depth / Snow-to-Water Ratio</strong></div>
<p>The snow-to-water ratio varies widely depending on snow type:</p>
<ul><li><strong>Wet, heavy snow:</strong> 3:1 to 5:1 (3–5 inches of snow = 1 inch of water)</li><li><strong>Average fresh snow:</strong> 10:1 to 15:1</li><li><strong>Light, dry powder:</strong> 20:1 to 30:1</li></ul>

<h3>Worked Example</h3>
<p>12 inches of average fresh snow with a 12:1 ratio:</p>
<p>SWE = 12 / 12 = <strong>1 inch of water</strong></p>
<p>The same 12 inches of wet snow at 5:1 = 2.4 inches of water. This illustrates why wet snow causes more flooding — it contains much more water per inch of depth. See our <a href="/density-calculators/snow-weight-calculator">snow weight calculator</a> to find the actual load on a roof.</p>`, highlight: "Average fresh snow: 12:1 ratio. 12 inches of snow = 1 inch of water. Powder: 20:1. Wet snow: 5:1." },
    },

    "snow-weight-calculator": {
        subtitle: "Calculate the total weight of snow on a roof or surface. Enter area dimensions, snow depth, and snow type to find load in lbs, kg, and tons.",
        explanation: { heading: "How to Calculate Snow Weight on a Roof", contentHTML: `<h2>Why Calculate Snow Weight?</h2>
<p>Snow load is a critical structural safety concern. Snow can weigh far more than many homeowners realize, and excessive accumulation can exceed a roof's design load capacity, leading to structural damage or collapse. Understanding snow weight helps you decide when removal is necessary.</p>

<h2>How to Calculate Snow Weight</h2>

<h3>Snow Weight Formula</h3>
<div class="explanation__highlight"><strong>Weight = Area × Depth × Snow Density</strong></div>
<p>Snow <a href="/density-calculators/density-calculator">density</a> varies significantly by type:</p>
<ul><li><strong>Light dry snow:</strong> ~3 lb/ft³ (48 kg/m³)</li><li><strong>Average fresh snow:</strong> ~5 lb/ft³ (80 kg/m³)</li><li><strong>Wet heavy snow:</strong> ~12.5 lb/ft³ (200 kg/m³)</li><li><strong>Ice:</strong> ~31 lb/ft³ (500 kg/m³)</li></ul>

<h3>Worked Example</h3>
<p>A 30 × 20 ft roof with 8 inches of average fresh snow:</p>
<p>Weight = 600 ft² × (8/12 ft) × 5 lb/ft³ = <strong>2,000 lbs (1 ton)</strong></p>
<p>Most US residential roofs are designed for 20–40 psf (pounds per square foot) ground snow load. A 1,500 sq ft roof with 2 feet of wet snow can hold over 15 tons — potentially exceeding design limits. For the water content of snow, see our <a href="/density-calculators/snow-water-equivalent-calculator">snow water equivalent calculator</a>.</p>`, highlight: "A 30×20 ft roof with 8 inches of average snow weighs about 2,000 lbs (1 ton). Wet snow can be 2-3× heavier." },
        faq: [
            { question: "When should I remove snow from my roof?", answer: "General guideline: if snow depth exceeds 2 feet of light snow or 1 foot of heavy/wet snow, consider removal. Watch for signs of stress like ice dams along the eaves, visible sagging, and creaking sounds. Most modern roofs are designed to handle 20–40 psf snow load." },
        ],
    },

    "water-weight-calculator": {
        subtitle: "Calculate the weight of water by volume in gallons, liters, cubic feet, or cubic meters. Quick reference table included.",
        explanation: { heading: "How Much Does Water Weigh?", contentHTML: `<h2>Weight of Water by Volume</h2>
<p>Water at room temperature (approximately 4°C for maximum <a href="/density-calculators/density-calculator">density</a>) weighs exactly 1 kilogram per liter, or about 8.34 pounds per US gallon. This makes water a convenient reference standard for density measurements.</p>

<h3>Water Weight Reference</h3>
<div class="explanation__highlight"><strong>1 US gallon = 8.34 lbs</strong> (3.785 kg)<br/><strong>1 liter = 2.205 lbs</strong> (1.000 kg)<br/><strong>1 cubic foot = 62.43 lbs</strong> (28.32 kg)<br/><strong>1 cubic meter = 2,205 lbs</strong> (1,000 kg = 1 metric ton)</div>

<h2>Practical Applications</h2>
<p>Knowing the weight of water is important for aquarium setup (a 55-gallon aquarium weighs about 459 lbs when full), pool filling (a 20,000-gallon pool weighs about 167,000 lbs = 83.5 tons), plumbing design, water trucking (weight limits), and emergency water storage planning.</p>
<p>A standard 55-gallon drum of water weighs 459 lbs. A standard bathtub filled to capacity (~50 gallons) weighs about 417 lbs. A hot tub (400 gallons) weighs over 3,300 lbs — which is why they require structural support and a reinforced deck or pad.</p>`, highlight: "1 gallon of water = 8.34 lbs. A full bathtub (~50 gal) weighs 417 lbs. A 20,000 gal pool: 83.5 tons." },
    },
};

export default async function DensityCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("density").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/density-calculators/${calc.slug}`);
    const schemas: object[] = [
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Density Calculators", url: canonicalUrl("/density-calculators") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl, "USD", "EducationalApplication"),
    ];
    if (content?.faq && content.faq.length > 0) {
        schemas.push(faqSchema(content.faq));
    }
    const schemaData = JSON.stringify(schemas);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-density-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Density Calculators", href: "/density-calculators" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <AuthorBadge categoryKey="density" />
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <DensityCalculatorCore calcType={calc.calcType || "density"} />
                    {content && (<>
                        <DynamicExplanation heading={content.explanation?.heading} paragraphs={content.explanation?.paragraphs} contentHTML={content.explanation?.contentHTML} highlight={content.explanation?.highlight} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar"><TrendingCalculations variant="sidebar" /></aside>
            </div>
        </main>
    );
}
