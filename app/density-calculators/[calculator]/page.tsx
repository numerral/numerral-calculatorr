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
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
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
        explanation: { heading: "How to Calculate Ping Pong Balls to Fill a Pool", contentHTML: `<h3>Method</h3><div class="explanation__highlight"><strong>1.</strong> Calculate pool volume (L × W × avg depth)<br/><strong>2.</strong> Ball volume = (4/3)π × r³ = 33.51 cm³ (40 mm diameter)<br/><strong>3.</strong> Random packing efficiency ≈ 64% (Bernal packing)<br/><strong>4.</strong> Balls = Pool volume × 0.64 / Ball volume</div>
<p>A standard regulation ping pong ball is 40 mm in diameter and weighs 2.7 g. Random sphere packing fills about 64% of the volume (the rest is air gaps). A typical 20×40 ft pool at 5 ft average depth ≈ <strong>2.1 million balls</strong>!</p>`, highlight: "A standard 20×40 ft residential pool holds about 2.1 million ping pong balls (with 64% random packing efficiency)." },
    },

    "density-calculator": {
        subtitle: "Calculate density, mass, or volume using ρ = m/V. Solve for any variable. Includes a reference table of common material densities.",
        explanation: { heading: "How to Calculate Density", contentHTML: `<h3>The Density Triangle</h3><div class="explanation__highlight"><strong>ρ = m / V</strong> — solve for density<br/><strong>m = ρ × V</strong> — solve for mass<br/><strong>V = m / ρ</strong> — solve for volume<br/><br/>SI unit: kg/m³. US unit: lb/ft³ or lb/gal.</div>
<p>Density is an <strong>intrinsic property</strong> of a material — it doesn't depend on the amount. A teaspoon of gold has the same density (19,300 kg/m³) as a gold bar. This makes density a powerful tool for identifying materials and predicting behavior.</p>`, highlight: "Water: 1,000 kg/m³. Aluminum: 2,700. Steel: 7,850. Gold: 19,300. Objects denser than water sink." },
        faq: [
            { question: "What is the densest material on Earth?", answer: "Osmium is the densest naturally occurring element at 22,590 kg/m³ — about 22.6× denser than water and denser than gold (19,300 kg/m³)." },
            { question: "What affects density?", answer: "Temperature (most materials expand when heated → lower density), pressure (compression increases density), and composition (alloys, impurities). Water is unusual: it's densest at 4°C, not at freezing." },
        ],
    },

    "metal-weight-calculator": {
        subtitle: "Calculate the weight of metal by shape (plate, round bar, tube) and alloy. Supports 12 metals including steel, aluminum, copper, and titanium.",
        explanation: { heading: "How to Calculate Metal Weight", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Weight = Volume × Density</strong><br/><br/><strong>Plate:</strong> V = L × W × T<br/><strong>Round bar:</strong> V = π × (D/2)² × L<br/><strong>Tube:</strong> V = π × ((OD/2)² − (ID/2)²) × L</div>
<p>Metal weight calculations are essential for shipping estimates, structural engineering, CNC job quoting, and material purchasing. The density varies significantly between alloys — always use the right density for accurate results.</p>`, highlight: "Steel is 7,850 kg/m³, aluminum is 2,700 (3× lighter), titanium is 4,507. Metal weight = volume × density." },
    },

    "snow-water-equivalent-calculator": {
        subtitle: "Calculate snow water equivalent (SWE) from snow depth and snow-to-water ratio. Used in hydrology, flood forecasting, and water supply management.",
        explanation: { heading: "How to Calculate Snow Water Equivalent", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>SWE = Snow Depth / Snow-to-Water Ratio</strong><br/><br/>Example: 12 inches of average snow (12:1 ratio):<br/>SWE = 12 / 12 = <strong>1 inch of water</strong></div>
<p>SWE tells you how much water is stored in a snowpack — critical for flood forecasting, reservoir management, and water supply planning. The ratio varies from 3:1 (very wet snow) to 30:1 (dry powder).</p>`, highlight: "Average fresh snow: 12:1 ratio. 12 inches of snow = 1 inch of water. Powder: 20:1. Wet snow: 5:1." },
    },

    "snow-weight-calculator": {
        subtitle: "Calculate the total weight of snow on a roof or surface. Enter area dimensions, snow depth, and snow type to find load in lbs, kg, and tons.",
        explanation: { heading: "How to Calculate Snow Weight on a Roof", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Weight = Area × Depth × Snow Density</strong><br/><br/>Light dry snow: ~3 lb/ft³<br/>Average fresh: ~5 lb/ft³<br/>Wet heavy snow: ~12.5 lb/ft³<br/>Ice: ~31 lb/ft³</div>
<p>Snow load is a critical structural concern. Most US residential roofs are designed for 20-40 psf (pounds per square foot) ground snow load. A 1,500 sq ft roof with 2 feet of wet snow can hold <strong>over 15 tons</strong> — potentially exceeding design limits.</p>`, highlight: "A 30×20 ft roof with 8 inches of average snow weighs about 2,000 lbs (1 ton). Wet snow can be 2-3× heavier." },
        faq: [
            { question: "When should I remove snow from my roof?", answer: "General rule: if snow depth exceeds 2 feet of light snow or 1 foot of heavy/wet snow, consider removal. Watch for ice dams, sagging, and creaking sounds. Most modern roofs handle 20-40 psf snow load." },
        ],
    },

    "water-weight-calculator": {
        subtitle: "Calculate the weight of water by volume in gallons, liters, cubic feet, or cubic meters. Quick reference table included.",
        explanation: { heading: "How Much Does Water Weigh?", contentHTML: `<h3>Key Facts</h3><div class="explanation__highlight"><strong>1 US gallon = 8.34 lbs</strong> (3.785 kg)<br/><strong>1 liter = 2.205 lbs</strong> (1.000 kg)<br/><strong>1 cubic foot = 62.43 lbs</strong> (28.32 kg)<br/><strong>1 cubic meter = 2,205 lbs</strong> (1,000 kg = 1 metric ton)</div>
<p>Water weight is important for aquarium setup, pool filling, plumbing, trucking (weight limits), and emergency water storage. A standard 55-gallon drum of water weighs 459 lbs. A 20,000-gallon pool weighs about 167,000 lbs (83.5 tons).</p>`, highlight: "1 gallon of water = 8.34 lbs. A full bathtub (~50 gal) weighs 417 lbs. A 20,000 gal pool: 83.5 tons." },
    },
};

export default async function DensityCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("density").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/density-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Density Calculators", url: canonicalUrl("/density-calculators") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl)]);

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
