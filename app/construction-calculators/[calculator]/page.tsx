// Dynamic Hub — /construction-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ConstructionCalculatorCore from "@/components/calculator/ConstructionCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("construction");
    return calcs.map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("construction").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/construction-calculators/${calc.slug}`) },
    };
}

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    faq?: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "concrete-calculator": {
        subtitle: "Calculate exactly how much concrete you need for slabs, footings, walls, and columns. Get results in cubic feet, cubic yards, and ready-mix bag counts.",
        explanation: {
            heading: "How to Calculate Concrete Volume",
            paragraphs: [
                "Concrete is ordered and delivered in cubic yards (in the US) or cubic meters (metric). For a rectangular slab, the volume is simply Length × Width × Depth. The critical detail most people miss is converting depth from inches to feet before multiplying — a 4-inch slab is 4/12 = 0.333 feet deep, not 4 feet.",
                "For ready-mix bags: a standard 60 lb bag fills about 0.45 cubic feet, while an 80 lb bag fills about 0.6 cubic feet. For projects over 1 cubic yard, ordering from a ready-mix truck is usually more economical and produces a better result than mixing individual bags.",
            ],
            highlight: "A typical 10×10 ft patio with 4 inches of concrete = 10 × 10 × 0.333 = 33.3 cu ft = 1.23 cubic yards. That's about 74 bags of 60 lb mix or 56 bags of 80 lb mix.",
        },
        faq: [
            { question: "How much does a cubic yard of concrete cost?", answer: "Ready-mix concrete typically costs $125–$150 per cubic yard delivered, depending on your location and the mix design. Individual bags (60 lb or 80 lb) cost $4–$7 each but are only practical for small projects under 1 cubic yard." },
            { question: "How thick should a concrete slab be?", answer: "Standard recommendations: sidewalks 4 inches, residential driveways 4–6 inches, garage floors 4–6 inches, and commercial driveways / heavy equipment pads 6–8 inches. Thicker slabs are needed for heavier loads." },
            { question: "Should I order extra concrete?", answer: "Yes, always order 5–10% more than calculated. Concrete is mixed in bulk and slight variations in subgrade elevation, form dimensions, and spillage mean you'll need a small buffer. Running short mid-pour is far more costly than having a little extra." },
        ],
    },
    "concrete-block-calculator": {
        subtitle: "Estimate the number of concrete blocks (CMU) needed for any wall. Enter wall dimensions and block size to get total blocks and mortar bags.",
        explanation: {
            heading: "How to Estimate Concrete Blocks for a Wall",
            paragraphs: [
                "Standard concrete masonry units (CMU) are 16 inches long × 8 inches tall × 8 inches wide (nominal). Actual dimensions are slightly smaller (15⅝ × 7⅝) to account for the mortar joint, typically 3/8 inch. When calculating, use the nominal dimensions — the mortar is already factored in.",
                "The calculation divides the total wall area (sq ft) by the face area of one block (in sq ft). A standard 16×8 block covers 0.89 sq ft of wall. For mortar, plan about one 80 lb bag of mortar mix per 33 standard blocks.",
            ],
            highlight: "A 20 ft × 8 ft wall = 160 sq ft ÷ 0.89 sq ft/block = 180 blocks needed. Add 5–10% for cuts and breakage, especially at corners and around openings.",
        },
        faq: [
            { question: "What size concrete blocks are available?", answer: "Standard sizes: 8×8×16 (most common), 8×4×16 (half-height), 8×8×8 (half-length), and 12×8×16 (thicker walls). The first number is width, second is height, third is length — all in inches (nominal)." },
            { question: "How many blocks per pallet?", answer: "Standard 8×8×16 blocks: typically 90–108 blocks per pallet. Half blocks: approximately 180 per pallet. Verify with your supplier as counts vary by manufacturer." },
        ],
    },
    "flooring-calculator": {
        subtitle: "Calculate exactly how much flooring you need for any room. Supports hardwood, laminate, vinyl plank, and engineered wood with waste factor and cost estimation.",
        explanation: {
            heading: "How to Calculate Flooring Material",
            paragraphs: [
                "The basic flooring calculation is Length × Width to get the room's square footage. But you should never order just the exact amount — cuts, fitting around obstacles, and pattern matching require extra material. Industry standard is 10% waste for rectangular rooms with straight-lay patterns.",
                "Flooring is sold by the box, with each box covering a specific square footage (typically 15–25 sq ft per box depending on the product). Divide your total needed area (including waste) by the box coverage to get the number of boxes. Always round up — you can't buy a fraction of a box.",
            ],
            highlight: "12×10 ft room = 120 sq ft. With 10% waste = 132 sq ft. At 20 sq ft/box, you need 7 boxes. At $3/sq ft, budget $396 for materials.",
        },
        faq: [
            { question: "How much extra flooring should I buy?", answer: "10% for standard rectangular rooms with straight-lay. 15% for diagonal or herringbone patterns, L-shaped rooms, or many obstacles. 20% if you're a first-time installer. Keep leftover boxes for future repairs." },
            { question: "How do I account for closets and irregular areas?", answer: "Break the room into rectangles. Calculate each section separately, then add them together. For odd shapes, draw the room on graph paper and count the full and partial squares." },
        ],
    },
    "tile-calculator": {
        subtitle: "Calculate exactly how many tiles you need for your floor or wall project, including gap spacing, waste factor, and grout estimates.",
        explanation: {
            heading: "How to Calculate Tiles Needed",
            paragraphs: [
                "Tile calculation involves dividing your total area by the area of a single tile (including the grout gap). A 12×12 inch tile with a 1/8 inch gap has an effective size of 12.125 × 12.125 inches. This small difference adds up significantly over large areas.",
                "Grout quantity depends on tile size, gap width, and tile thickness. As a general rule, plan 1 lb of unsanded grout per 10 sq ft for standard tiles with 1/8 inch gaps. Larger gaps or larger tiles require more grout. Always buy one extra bag.",
            ],
            highlight: "100 sq ft area with 12×12 tiles and 1/8\" gap = about 100 tiles. With 10% waste = 110 tiles. At 10 tiles/box, you need 11 boxes.",
        },
        faq: [
            { question: "What grout width should I use?", answer: "1/16\" for rectified (precision-cut) tiles, 1/8\" for standard ceramic/porcelain, 3/16\" for larger format tiles, and 1/4\" or wider for natural stone with irregular edges." },
            { question: "How many tiles come in a box?", answer: "It varies by tile size: 12×12 tiles typically 10–12 per box, 18×18 tiles 6–8 per box, 24×24 tiles 4–6 per box, subway tiles (3×6) 50–80 per box. Always check the box coverage (sq ft) on the product label." },
        ],
    },
    "roofing-calculator": {
        subtitle: "Calculate the roofing materials needed for your project — including shingle bundles, roofing squares, and underlayment rolls based on roof dimensions and pitch.",
        explanation: {
            heading: "How to Calculate Roofing Materials",
            paragraphs: [
                "Roofing is measured in 'squares' — one square equals 100 square feet of roof area. To calculate actual roof area from ground-level measurements, you must apply a pitch multiplier. A 4:12 pitch multiplies the footprint area by 1.054, while a 12:12 (45°) pitch multiplies by 1.414.",
                "Standard asphalt shingles come in bundles, with 3 bundles covering 1 square (100 sq ft). Underlayment (felt or synthetic) comes in rolls covering approximately 400 sq ft. Always include a 10% waste factor for cuts, ridges, hips, and valleys.",
            ],
            highlight: "A 30×40 ft roof at 4:12 pitch = 1,200 sq ft footprint × 1.054 = 1,265 sq ft actual. With 10% waste = 1,391 sq ft = 13.9 squares = 42 bundles of shingles.",
        },
        faq: [
            { question: "What is a roofing square?", answer: "A roofing square is a unit of measurement equal to 100 square feet of roof area. Shingles, underlayment, and other roofing materials are priced and sold per square. A 2,000 sq ft roof is 20 squares." },
            { question: "How do I measure roof pitch?", answer: "Place a level against the roof and measure how many inches the roof rises for every 12 inches of horizontal run. A 6-inch rise per 12-inch run is a 6:12 pitch. You can also use our Roof Pitch Calculator for precise calculations." },
        ],
    },
    "roof-pitch-calculator": {
        subtitle: "Calculate roof pitch from rise and run measurements. Get the pitch ratio, angle in degrees, slope percentage, and the pitch multiplier used for area calculations.",
        explanation: {
            heading: "Understanding Roof Pitch",
            paragraphs: [
                "Roof pitch is expressed as a ratio of rise to run — for example, 6:12 means the roof rises 6 inches for every 12 inches of horizontal run. This ratio directly determines the steepness of the roof and affects everything from material selection to walkability to structural requirements.",
                "The pitch multiplier is crucial for accurate material estimation. It converts a flat (horizontal) footprint area into actual roof surface area. For example a 6:12 pitch has a multiplier of 1.118, meaning the actual roof area is 11.8% larger than what you'd measure from the ground.",
            ],
            highlight: "Common pitch classifications: 0-1:12 = flat roof, 2-4:12 = low slope, 5-8:12 = conventional, 9-12:12 = steep, 12:12+ = very steep. Most residential roofs fall in the 4:12 to 8:12 range.",
        },
        faq: [
            { question: "What is the best roof pitch for residential homes?", answer: "4:12 to 6:12 is the most common and practical range. It provides good water drainage, allows most roofing materials, and is safe enough for workers. Steeper pitches (8:12+) look more dramatic but require more materials and specialized safety equipment." },
            { question: "Does roof pitch affect energy efficiency?", answer: "Yes. Steeper roofs have more surface area exposed to sun, which can increase cooling costs. However, steeper pitches also allow better attic ventilation and can accommodate more insulation. The optimal pitch depends on climate and orientation." },
        ],
    },
    "paint-calculator": {
        subtitle: "Calculate how many gallons of paint you need for any room. Accounts for doors, windows, wall height, and number of coats.",
        explanation: {
            heading: "How to Calculate Paint Coverage",
            paragraphs: [
                "Paint coverage depends on the paint type, surface texture, and color change. Most interior latex paints cover approximately 350 square feet per gallon on smooth surfaces. Textured walls, new drywall, and dramatic color changes (light to dark or vice versa) may require additional coats, reducing effective coverage.",
                "The formula: calculate total wall area (perimeter × height), subtract openings (standard door ≈ 21 sq ft, standard window ≈ 15 sq ft), multiply by number of coats, then divide by paint coverage per gallon. Always round up — it's better to have leftover paint for touch-ups.",
            ],
            highlight: "A 12×10 ft room with 8 ft ceilings, 1 door, 2 windows, 2 coats: Wall area = 352 sq ft, minus openings = 301 sq ft, × 2 coats = 602 sq ft ÷ 350 = 1.7 gallons. Buy 2 gallons.",
        },
        faq: [
            { question: "How many coats of paint do I need?", answer: "Most color changes require 2 coats for even coverage. Going from dark to light or priming new drywall may need 3 coats. Same-color touch-ups or high-quality paint-and-primer combos may achieve coverage in 1 coat." },
            { question: "How much does paint cost?", answer: "Economy paint: $20–$30 per gallon. Mid-range: $30–$50. Premium: $50–$80+. Higher-quality paints typically offer better coverage (fewer coats needed), better color retention, and easier application — often making them more cost-effective overall." },
        ],
    },
    "drywall-calculator": {
        subtitle: "Calculate how many drywall sheets you need for walls and ceilings, plus joint tape, joint compound, and screw estimates.",
        explanation: {
            heading: "How to Estimate Drywall Materials",
            paragraphs: [
                "Standard drywall sheets are 4 feet wide × 8 feet tall (32 sq ft per sheet). Longer sheets (10 ft, 12 ft) are available for taller walls or fewer horizontal joints. To calculate sheets needed, divide the total wall and ceiling area by 32 and round up.",
                "Don't forget the finishing materials: plan approximately 12 feet of joint tape per sheet, 1 bucket (4.5 gallons) of joint compound per 100 sq ft, and about 28–32 drywall screws per sheet (spaced 12 inches on ceilings, 16 inches on walls).",
            ],
            highlight: "A 12×10 ft room with 8 ft ceilings, 1 door, 2 windows, plus ceiling: Wall area ≈ 301 sq ft + ceiling 120 sq ft = 421 sq ft ÷ 32 = 14 sheets of 4×8 drywall.",
        },
        faq: [
            { question: "What thickness of drywall do I need?", answer: "1/2 inch is standard for most walls and ceilings with 16-inch on-center framing. 5/8 inch is required for fire-rated assemblies and is recommended for ceilings to reduce sag. 1/4 inch is used for curved walls. Moisture-resistant (green board) is for bathrooms." },
            { question: "How much joint compound do I need?", answer: "Plan for about 1 bucket (4.5-gallon) of all-purpose joint compound per 100 sq ft of drywall. This covers three coats of bedding, taping, and finish coating. Larger rooms need proportionally more." },
        ],
    },
    "square-footage-calculator": {
        subtitle: "Calculate the square footage of any space or shape — rectangle, triangle, circle, or trapezoid. Includes conversions to square meters, square yards, and acres.",
        explanation: {
            heading: "How to Calculate Square Footage",
            paragraphs: [
                "Square footage measures the area of a two-dimensional space. For a rectangle: Length × Width. For a triangle: ½ × Base × Height. For a circle: π × (Diameter/2)². For a trapezoid: ½ × (Base₁ + Base₂) × Height. All measurements must be in the same units.",
                "For irregularly shaped rooms, break the space into simple geometric shapes (rectangles, triangles), calculate each area separately, and add them together. For L-shaped rooms, split into two rectangles. For rooms with bay windows, add a triangle or trapezoid to the main rectangle.",
            ],
            highlight: "Quick conversions: 1 sq ft = 0.0929 sq m = 0.111 sq yd. 1 acre = 43,560 sq ft. A standard 2-car garage is about 400 sq ft. An average US home is about 2,300 sq ft.",
        },
        faq: [
            { question: "How do I measure square footage for flooring?", answer: "Measure the longest length and widest width of each section of the room. For L-shaped rooms, divide into two rectangles and calculate each separately. Always measure to the nearest inch and include closets if they'll be floored." },
            { question: "What's the difference between square footage and linear footage?", answer: "Square footage measures area (length × width). Linear footage measures only length in one direction. You can't convert between them without knowing the width. For example, 100 linear feet of 6-inch-wide planks covers 50 sq ft of floor." },
        ],
    },
    "cubic-yards-calculator": {
        subtitle: "Calculate cubic yards for any material — fill dirt, gravel, mulch, topsoil, or concrete. Enter length, width, and depth for instant volume results.",
        explanation: {
            heading: "How to Calculate Cubic Yards",
            paragraphs: [
                "A cubic yard is a volume measurement equal to 27 cubic feet (3ft × 3ft × 3ft). It's the standard unit for ordering bulk materials like gravel, mulch, topsoil, fill dirt, sand, and concrete. To calculate: Length (ft) × Width (ft) × Depth (ft) ÷ 27 = Cubic Yards.",
                "An important detail: depth is often measured in inches but must be converted to feet before calculating. A 3-inch layer of mulch is 3/12 = 0.25 feet deep. Also note that most materials compact 10–20% after installation, so order accordingly for projects that require a specific finished depth.",
            ],
            highlight: "A 10×10 ft area at 6 inch depth = 10 × 10 × 0.5 = 50 cu ft ÷ 27 = 1.85 cubic yards. For gravel, that's roughly 2.6 tons (1 cu yd of gravel ≈ 1.4 tons).",
        },
        faq: [
            { question: "How much does a cubic yard of material weigh?", answer: "It varies hugely by material: topsoil ≈ 1.0–1.3 tons, mulch ≈ 0.4–0.8 tons, gravel ≈ 1.4 tons, sand ≈ 1.3 tons, concrete ≈ 2.0 tons, decorative stone ≈ 1.2–1.5 tons." },
            { question: "How much area will a cubic yard cover?", answer: "Depends on depth: at 1\" deep = 324 sq ft, at 2\" deep = 162 sq ft, at 3\" deep = 108 sq ft, at 4\" deep = 81 sq ft, at 6\" deep = 54 sq ft. These are the standard coverage rates used for landscaping materials." },
        ],
    },
};

export default async function ConstructionCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("construction").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];

    const pageUrl = canonicalUrl(`/construction-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Construction Calculators", url: canonicalUrl("/construction-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-construction-calc"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Construction Calculators", href: "/construction-calculators" },
                    { label: calc.title.replace(" Calculator", "") },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && (
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                    {content.subtitle}
                </p>
            )}

            <div className="layout-2col">
                <div className="layout-2col__main">
                    <ConstructionCalculatorCore calcType={calc.calcType || "concrete"} />

                    {content && (
                        <>
                            <DynamicExplanation
                                heading={content.explanation?.heading}
                                paragraphs={content.explanation?.paragraphs}
                                highlight={content.explanation?.highlight}
                                contentHTML={content.contentHTML}
                            />
                            {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                        </>
                    )}
                </div>

                <aside className="layout-2col__sidebar">
                    <TrendingCalculations variant="sidebar" />
                </aside>
            </div>
        </main>
    );
}
