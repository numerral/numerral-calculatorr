// Dynamic Hub — /construction-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import ConstructionCalculatorCore from "@/components/calculator/ConstructionCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, constructionAppSchema, faqSchema, howToSchema, organizationSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

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
        subtitle: "Calculate how much concrete you need for slabs, footings, columns, and walls. Get volume in cubic yards, pre-mix bag counts (50, 60, 80 lb), weight, and cost estimate. Supports rectangular, cylindrical, and footing shapes.",
        explanation: {
            heading: "How to Calculate Concrete Volume",
            paragraphs: [
                "Concrete is ordered in cubic yards in the United States. For a rectangular slab, the formula is Length × Width × Depth — but the critical step most people miss is converting depth from inches to feet first. A 4-inch slab is 4 ÷ 12 = 0.333 feet, not 4 feet. Mixing up this unit conversion is the #1 reason homeowners over-order concrete.",
                "For cylindrical shapes (sono tubes, columns, piers), use π × radius² × height. For pre-mix bags: a 50 lb bag fills about 0.375 cu ft, a 60 lb bag fills about 0.45 cu ft, and an 80 lb bag fills about 0.6 cu ft. For projects over 1 cubic yard, ordering a ready-mix truck is more economical and produces better results than hand-mixing individual bags.",
            ],
            highlight: "A 10 × 10 ft patio slab at 4 inches thick = 10 × 10 × 0.333 = 33.3 cu ft = 1.23 cubic yards = about 89 bags (50 lb), 74 bags (60 lb), or 56 bags (80 lb). At $140/yard, that's about $172.",
        },
        contentHTML: `
<p>Concrete is ordered in cubic yards in the United States. For a rectangular slab, the formula is Length × Width × Depth — but the critical step most people miss is converting depth from inches to feet first. A 4-inch slab is 4 ÷ 12 = 0.333 feet, not 4 feet. Mixing up this unit conversion is the #1 reason homeowners over-order concrete.</p>
<p>For cylindrical shapes (sono tubes, columns, piers), use π × radius² × height. For pre-mix bags: a 50 lb bag fills about 0.375 cu ft, a 60 lb bag fills about 0.45 cu ft, and an 80 lb bag fills about 0.6 cu ft. For projects over 1 cubic yard, ordering a ready-mix truck is more economical and produces better results than hand-mixing individual bags.</p>
<p>Calculate volume with our <a href="/construction-calculators/cubic-yards-calculator">cubic yards calculator</a>. Measure your pour area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For block walls, see our <a href="/construction-calculators/concrete-block-calculator">concrete block calculator</a>.</p>

<h2>What Is Concrete?</h2>
<p><strong>Concrete</strong> is a composite material made by mixing <strong>Portland cement</strong>, water, sand (fine aggregate), and gravel or crushed stone (coarse aggregate). When water is added to the dry ingredients, a chemical reaction called <strong>hydration</strong> hardens the mixture into a durable, stone-like material.</p>
<p>Concrete is not the same as cement — cement is just one ingredient in concrete (typically 10–15% of the mix by volume). In the US, concrete is used for foundations, driveways, patios, sidewalks, retaining walls, curbs, columns, and footings.</p>
<p>Concrete is available in two forms: <strong>ready-mix</strong> (delivered by truck in large volumes) and <strong>pre-mixed bags</strong> (50, 60, or 80 lb bags that you mix with water on site). Ready-mix is standard for projects over 1 cubic yard.</p>

<h2>Step-by-Step: How to Calculate Concrete</h2>
<ol>
<li><strong>Measure length and width</strong> of the pour area in feet. For irregular shapes, break the project into simple rectangles or cylinders and calculate each separately.</li>
<li><strong>Measure depth (thickness)</strong> in inches. Standard slab thicknesses: 4 inches for sidewalks and patios, 4–6 inches for residential driveways, 6–8 inches for commercial or heavy-load areas.</li>
<li><strong>Convert depth to feet:</strong> divide inches by 12. Example: 4 inches ÷ 12 = 0.333 feet.</li>
<li><strong>Calculate cubic feet:</strong> Length (ft) × Width (ft) × Depth (ft) = volume in cubic feet.</li>
<li><strong>Convert to cubic yards:</strong> divide cubic feet by 27. One cubic yard = 27 cubic feet = 3 ft × 3 ft × 3 ft.</li>
<li><strong>Add 5–10% extra</strong> for waste, spillage, uneven subgrade, and over-excavation. Running short during a pour creates a cold joint — which permanently weakens the concrete.</li>
</ol>

<h2>Concrete Volume Formulas</h2>
<table>
<thead><tr><th>Shape</th><th>Formula</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Slab / Rectangle</strong></td><td>L × W × D (all in feet)</td><td>10 × 10 × 0.333 = 33.3 cu ft = 1.23 cu yd</td></tr>
<tr><td><strong>Cylinder / Column</strong></td><td>π × r² × H (all in feet)</td><td>π × 0.5² × 4 = 3.14 cu ft = 0.12 cu yd</td></tr>
<tr><td><strong>Footing / Wall</strong></td><td>L × W × D (all in feet)</td><td>40 × 1.5 × 1 = 60 cu ft = 2.22 cu yd</td></tr>
<tr><td><strong>Stairs</strong></td><td>Break into steps + platform</td><td>Use our concrete stairs calculator</td></tr>
</tbody>
</table>

<h2>How Many Bags of Concrete Per Cubic Yard?</h2>
<p>For small projects, pre-mixed bags are convenient. Here's how many bags you need per cubic yard:</p>
<table>
<thead><tr><th>Bag Size</th><th>Yield per Bag</th><th>Bags per Cubic Yard</th><th>Bags per Cubic Foot</th></tr></thead>
<tbody>
<tr><td><strong>50 lb</strong></td><td>0.375 cu ft</td><td>72 bags</td><td>2.67 bags</td></tr>
<tr><td><strong>60 lb</strong></td><td>0.45 cu ft</td><td>60 bags</td><td>2.22 bags</td></tr>
<tr><td><strong>80 lb</strong></td><td>0.6 cu ft</td><td>45 bags</td><td>1.67 bags</td></tr>
</tbody>
</table>
<p><strong>Tip:</strong> At more than 40–50 bags, consider ordering ready-mix instead. Hand-mixing that many bags is extremely labor-intensive and the quality may not be as consistent as truck-delivered concrete.</p>

<h2>Concrete Coverage Table</h2>
<p>How much area does one cubic yard of concrete cover at different thicknesses?</p>
<table>
<thead><tr><th>Slab Thickness</th><th>Coverage per Cubic Yard</th></tr></thead>
<tbody>
<tr><td>2 inches</td><td>162 sq ft</td></tr>
<tr><td>3 inches</td><td>108 sq ft</td></tr>
<tr><td>4 inches</td><td>81 sq ft</td></tr>
<tr><td>5 inches</td><td>64.8 sq ft</td></tr>
<tr><td>6 inches</td><td>54 sq ft</td></tr>
<tr><td>8 inches</td><td>40.5 sq ft</td></tr>
<tr><td>12 inches (1 ft)</td><td>27 sq ft</td></tr>
</tbody>
</table>

<h2>Concrete Cost (2025 US Pricing)</h2>
<table>
<thead><tr><th>Cost Component</th><th>Typical Range</th></tr></thead>
<tbody>
<tr><td><strong>Ready-mix per cubic yard</strong></td><td>$125–$165 delivered</td></tr>
<tr><td><strong>Short-load fee (&lt;5 yards)</strong></td><td>$50–$100 extra</td></tr>
<tr><td><strong>50 lb pre-mix bag</strong></td><td>$4–$6 each</td></tr>
<tr><td><strong>60 lb pre-mix bag</strong></td><td>$5–$7 each</td></tr>
<tr><td><strong>80 lb pre-mix bag</strong></td><td>$6–$9 each</td></tr>
<tr><td><strong>Installed (material + labor)</strong></td><td>$6–$20 per sq ft</td></tr>
<tr><td><strong>Average 10×10 patio (4")</strong></td><td>$750–$1,500 installed</td></tr>
<tr><td><strong>Average 2-car driveway (20×20, 5")</strong></td><td>$3,000–$6,000 installed</td></tr>
</tbody>
</table>
<p><strong>Factors affecting cost:</strong> concrete mix design (standard vs high-strength), delivery distance, pump truck (if needed for hard-to-reach areas), finishing style (broom, stamped, exposed aggregate), and your region. Saturday deliveries and orders under 5 yards often incur surcharges.</p>

<h2>Tips for a Successful Concrete Pour</h2>
<ul>
<li><strong>Build forms first:</strong> Use 2×4 or 2×6 lumber stakes to create the edges of your slab. Level the tops — they define the finished surface. Oil the inside face so forms release cleanly.</li>
<li><strong>Prepare the base:</strong> Compact the subgrade, then add 4–6 inches of compacted gravel or crushed stone as a base. This prevents settling and improves drainage beneath the slab.</li>
<li><strong>Add reinforcement:</strong> Use #3 or #4 rebar on 12–18 inch centers, or 6×6 welded wire mesh (WWM), to prevent cracking. Support rebar on chairs so it sits in the middle third of the slab.</li>
<li><strong>Order 5–10% extra:</strong> Subgrade is never perfectly level, forms may bow slightly, and some concrete is always lost to spillage and residue in the truck chute.</li>
<li><strong>Have your crew ready:</strong> Concrete starts setting within 60–90 minutes. The truck, tools (screed, bull float, edger, broom), and all workers must be on site before the truck arrives.</li>
<li><strong>Cure properly:</strong> Keep the surface moist for at least 7 days after pouring. Use curing compound, wet burlap, or plastic sheeting. Proper curing increases strength by 50% compared to uncured concrete.</li>
</ul>

<h2>Concrete Types &amp; Mix Designs</h2>
<table>
<thead><tr><th>Type</th><th>PSI Rating</th><th>Common Uses</th></tr></thead>
<tbody>
<tr><td><strong>Standard Mix</strong></td><td>2,500–3,000 PSI</td><td>Sidewalks, patios, non-structural slabs</td></tr>
<tr><td><strong>High-Strength</strong></td><td>4,000–5,000 PSI</td><td>Driveways, garage floors, footings, structural</td></tr>
<tr><td><strong>Fiber-Reinforced</strong></td><td>3,000–4,000 PSI</td><td>Slabs where wire mesh is impractical; reduces surface cracking</td></tr>
<tr><td><strong>Air-Entrained</strong></td><td>3,000–4,000 PSI</td><td>Required in freeze-thaw climates (northern US); tiny air bubbles absorb expansion</td></tr>
<tr><td><strong>Fast-Setting</strong></td><td>4,000 PSI (1 day)</td><td>Post setting, small repairs, cold-weather pours</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "How much does a yard of concrete cover?", answer: "It depends on thickness: at 4 inches thick, 1 cubic yard covers 81 sq ft. At 6 inches, it covers 54 sq ft. At 12 inches (1 ft), it covers 27 sq ft. The formula: 324 ÷ thickness in inches = square feet per cubic yard." },
            { question: "How much concrete is in a truck?", answer: "A standard concrete mixer truck carries 8–10 cubic yards. Mini-mix trucks carry 1–5 cubic yards and are ideal for residential projects where a full truck is too much. Most suppliers charge a short-load fee ($50–$100) for orders under 5 cubic yards." },
            { question: "How many bags of concrete make a yard?", answer: "It depends on bag size: 72 bags of 50 lb mix, 60 bags of 60 lb mix, or 45 bags of 80 lb mix = 1 cubic yard. At more than ~40 bags, ordering ready-mix is usually more practical and cost-effective." },
            { question: "How much does a yard of concrete weigh?", answer: "One cubic yard of standard concrete weighs approximately 4,050 lbs (about 2 US tons). That equals roughly 150 lbs per cubic foot. Lightweight concrete weighs 110–120 lbs/cu ft, while heavyweight concrete for radiation shielding can exceed 200 lbs/cu ft." },
            { question: "What is the correct mix ratio for concrete?", answer: "The standard ratio is 1 part Portland cement : 2 parts sand : 4 parts gravel (1:2:4) by volume, with about 0.5 parts water. This produces approximately 3,000 PSI concrete. For higher strength (4,000 PSI), use 1:1.5:3. For pre-mixed bags, all ratios are pre-measured — just add water." },
            { question: "How thick should a concrete slab be?", answer: "Sidewalks and patios: 4 inches. Residential driveways: 4–6 inches. Garage floors: 4–6 inches with thickened edges. Heavy equipment pads: 6–8 inches. Foundation footings: typically 8–12 inches thick. Always check local building codes for minimum requirements." },
            { question: "Should I order extra concrete?", answer: "Yes — always order 5–10% more than calculated. Variations in subgrade elevation, form dimensions, spillage, and chute residue mean you'll use more than the theoretical volume. Running short mid-pour creates a cold joint, which permanently weakens the slab and may require tearing it out." },
            { question: "How long does concrete take to cure?", answer: "Concrete reaches about 70% of its final strength in 7 days and 99% at 28 days. You can walk on it after 24–48 hours, drive on it after 7 days, and apply full load after 28 days. Keep the surface moist during the first 7 days — proper curing increases final strength by up to 50%." },
            { question: "Can I pour concrete in cold weather?", answer: "Yes, but with precautions. Concrete should not freeze within the first 24 hours. Use hot water in the mix, order air-entrained concrete, use blankets or heated enclosures, and never pour on frozen ground. Ideal temperature for concrete placement is 50–60°F. Below 40°F requires special measures." },
            { question: "What is the difference between cement and concrete?", answer: "Cement is a dry powder (Portland cement) that acts as a binder. Concrete is the finished product made by mixing cement with water, sand, and gravel. Cement makes up only about 10–15% of concrete by volume. Saying 'cement driveway' is technically incorrect — it should be 'concrete driveway.'" },
        ],
    },
    "concrete-block-calculator": {
        subtitle: "Calculate how many concrete blocks (CMU) you need for a wall or foundation. Get block count with 5% waste, mortar bags, sand, grout fill volume, and cost estimate. Supports standard and custom block sizes.",
        explanation: {
            heading: "How to Estimate Concrete Blocks for a Wall",
            paragraphs: [
                "Standard CMU (concrete masonry unit) blocks are 16 inches long × 8 inches high × 8 inches wide (nominal size including a ⅜-inch mortar joint). The actual block is slightly smaller (15⅝ × 7⅝). A standard 8×16 block covers 0.89 sq ft of wall — so you need about 1.125 blocks per square foot.",
                "To estimate blocks: measure wall length × height = wall area (sq ft), subtract any door/window openings, then divide by 0.89. Add 5% for waste (cuts, breakage, corners). For mortar, plan about 3 bags of Portland cement per 100 blocks, plus 1 cubic yard of sand per 7 bags of cement.",
            ],
            highlight: "A 20 ft × 8 ft wall = 160 sq ft ÷ 0.89 = 180 blocks. With 5% waste = 189 blocks. Mortar: 6 bags cement + 0.9 cu yd sand. Grout fill: about 1.3 cubic yards.",
        },
        contentHTML: `
<p>Standard CMU (concrete masonry unit) blocks are 16 inches long × 8 inches high × 8 inches wide (nominal size including a ⅜-inch mortar joint). The actual block is slightly smaller (15⅝ × 7⅝). A standard 8×16 block covers 0.89 sq ft of wall — so you need about 1.125 blocks per square foot.</p>
<p>To estimate blocks: measure wall length × height = wall area (sq ft), subtract any door/window openings, then divide by 0.89. Add 5% for waste (cuts, breakage, corners). For mortar, plan about 3 bags of Portland cement per 100 blocks, plus 1 cubic yard of sand per 7 bags of cement.</p>
<p>For poured concrete, use our <a href="/construction-calculators/concrete-calculator">concrete calculator</a>. Calculate wall area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For brick walls, see our <a href="/construction-calculators/brick-calculator">brick calculator</a>.</p>

<h2>What Are Concrete Blocks?</h2>
<p><strong>Concrete blocks</strong> (also called CMUs — concrete masonry units, or cinder blocks) are precast rectangular building units made from Portland cement, aggregate, and water. They are used to construct load-bearing walls, foundations, retaining walls, partition walls, and fencing.</p>
<p>CMUs come in two basic types: <strong>hollow blocks</strong> (the most common, with two open cells that are filled with grout/concrete during installation) and <strong>solid blocks</strong> (used for retaining walls, filled walls, and special applications). The hollow cells allow reinforcing rebar to be inserted vertically, making the wall much stronger.</p>
<p>In the United States, the standard CMU is <strong>8×8×16 inches</strong> (nominal). The actual dimensions are 7⅝ × 7⅝ × 15⅝ inches — the ⅜-inch difference is filled by the mortar joint during construction.</p>

<h2>Step-by-Step: How to Calculate Concrete Blocks</h2>
<h3>Step 1: Find Wall Square Footage</h3>
<p>Measure the length and height of the wall in feet. Multiply them together to get the gross wall area. If there are doors, windows, or other openings, measure those separately and subtract them.</p>
<p><strong>Example:</strong> A 30 ft long × 8 ft tall wall with one 3×7 ft door and two 3×4 ft windows: gross = 240 sq ft, openings = 21 + 24 = 45 sq ft, net = 195 sq ft.</p>

<h3>Step 2: Find Block Square Footage</h3>
<p>Calculate the face area of one block. For a standard 8×16 block: (8 × 16) ÷ 144 = <strong>0.89 sq ft per block</strong>. Different block sizes have different face areas — the table below lists common sizes.</p>

<h3>Step 3: Calculate Number of Blocks</h3>
<p>Divide the net wall area by the block face area, then add 5% for waste (cuts, breakage, corner pieces).</p>
<p><strong>blocks needed = (wall sq ft ÷ block sq ft) × 1.05</strong></p>

<h2>How to Estimate Mortar for a Block Wall</h2>
<p>Mortar is the paste that bonds blocks together. It's made from Portland cement, sand, and water (ratio: <strong>1 part cement to 3 parts sand</strong>).</p>
<ul>
<li><strong>Pre-mixed mortar (80 lb bags):</strong> 1 bag covers about 33 standard blocks. Divide your block count by 33 to get the number of bags.</li>
<li><strong>Site-mixed mortar:</strong> Plan about 3 bags (94 lb) of Portland cement per 100 blocks. For sand, use 1 cubic yard of masonry sand per 7 bags of cement.</li>
<li><strong>Mortar joint thickness:</strong> The standard joint is <strong>⅜ inch</strong> (for CMU walls). Thicker joints require more mortar.</li>
</ul>

<h2>How to Estimate Grout / Concrete Fill</h2>
<p>Hollow CMU blocks are designed to be filled with grout (a fluid concrete mix) after rebar is placed. To estimate fill volume:</p>
<ol>
<li>Calculate the <strong>cell volume</strong> per block: subtract the shell thickness (typically 1.25 inches on each side) and web thickness (typically 1 inch, 3 webs per standard block) from the block dimensions.</li>
<li>For a standard 8×8×16 block: cell width ≈ 5.5 in, cell length ≈ 6.5 in, height = 8 in → <strong>~572 cu in per block</strong> (2 cells).</li>
<li>Multiply by total blocks and divide by 46,656 cu in/cu yd to get <strong>cubic yards of grout</strong>.</li>
</ol>
<p><strong>Rule of thumb:</strong> Standard 8×8×16 CMU blocks require about <strong>0.007 cubic yards of fill per block</strong>, or roughly 1 cubic yard per 145 blocks.</p>

<h2>Standard Concrete Block Sizes</h2>
<table>
<thead><tr><th>Block Size (W×H×L)</th><th>Nominal (in)</th><th>Actual (in)</th><th>Face Area (sq ft)</th><th>Blocks per sq ft</th></tr></thead>
<tbody>
<tr><td><strong>Standard</strong></td><td>8×8×16</td><td>7⅝ × 7⅝ × 15⅝</td><td>0.89</td><td>1.125</td></tr>
<tr><td><strong>Half-Height</strong></td><td>8×4×16</td><td>7⅝ × 3⅝ × 15⅝</td><td>0.44</td><td>2.25</td></tr>
<tr><td><strong>Half-Length</strong></td><td>8×8×8</td><td>7⅝ × 7⅝ × 7⅝</td><td>0.44</td><td>2.25</td></tr>
<tr><td><strong>Thick Wall</strong></td><td>12×8×16</td><td>11⅝ × 7⅝ × 15⅝</td><td>0.89</td><td>1.125</td></tr>
<tr><td><strong>Thin Partition</strong></td><td>4×8×16</td><td>3⅝ × 7⅝ × 15⅝</td><td>0.89</td><td>1.125</td></tr>
<tr><td><strong>Wide</strong></td><td>10×8×16</td><td>9⅝ × 7⅝ × 15⅝</td><td>0.89</td><td>1.125</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> The nominal size includes the ⅜-inch mortar joint. When estimating, always use the nominal dimensions.</p>

<h2>Concrete Block Wall Cost (2025 US Pricing)</h2>
<table>
<thead><tr><th>Cost Component</th><th>Typical Range</th></tr></thead>
<tbody>
<tr><td><strong>Standard 8×8×16 CMU block</strong></td><td>$1.50–$3.00 each</td></tr>
<tr><td><strong>Half block (8×8×8)</strong></td><td>$1.00–$2.00 each</td></tr>
<tr><td><strong>Mortar (80 lb pre-mix bag)</strong></td><td>$5–$10 per bag</td></tr>
<tr><td><strong>Portland cement (94 lb bag)</strong></td><td>$12–$16 per bag</td></tr>
<tr><td><strong>Masonry sand</strong></td><td>$25–$40 per cubic yard</td></tr>
<tr><td><strong>Installed cost (material + labor)</strong></td><td>$10–$17 per sq ft of wall</td></tr>
<tr><td><strong>100 sq ft wall (about 113 blocks)</strong></td><td>$1,000–$1,700 installed</td></tr>
</tbody>
</table>

<h2>Tools Needed for a Block Wall</h2>
<ul>
<li><strong>Brick trowel</strong> — for spreading mortar on bed and head joints</li>
<li><strong>Mason line and line blocks</strong> — to keep courses straight and level</li>
<li><strong>4-ft level</strong> — to check plumb and level on every course</li>
<li><strong>Jointer / striking tool</strong> — to finish mortar joints for a clean appearance</li>
<li><strong>Mixing tub and hoe</strong> — to mix mortar on site</li>
<li><strong>Block chisel and hammer</strong> — to score and split blocks for corners and ends</li>
</ul>
`,
        faq: [
            { question: "How many concrete blocks do I need per square foot?", answer: "For standard 8×8×16 blocks: 1.125 blocks per square foot of wall. For half-height 8×4×16 blocks: 2.25 per sq ft. Multiply your total wall area (minus openings) by the blocks-per-sq-ft rate, then add 5% for waste." },
            { question: "How much mortar do I need for a block wall?", answer: "Using pre-mixed 80 lb bags: 1 bag per 33 standard blocks. For site mixing: 3 bags (94 lb) Portland cement per 100 blocks, plus about 1 cubic yard of masonry sand per 7 bags of cement. A 200-block wall needs about 6 bags of mortar or 6 bags cement + ~0.9 cu yd sand." },
            { question: "How much does it cost to build a concrete block wall?", answer: "Installed cost (material + labor) ranges from $10–$17 per square foot of wall area. A standard 8×8×16 CMU block costs $1.50–$3.00 each. A 20 ft × 8 ft wall (160 sq ft, ~189 blocks with waste) costs roughly $1,600–$2,700 fully installed." },
            { question: "What is the difference between a cinder block and a concrete block?", answer: "Historically, cinder blocks were made with cement and coal ash (cinders) and were lighter. Modern CMUs are made with Portland cement, sand, and gravel aggregate and are heavier and stronger. Today the terms are used interchangeably — most 'cinder blocks' sold are actually concrete blocks." },
            { question: "How much does a concrete block weigh?", answer: "A standard 8×8×16 hollow CMU weighs 35–38 lbs. A solid 8×8×16 block weighs about 50 lbs. Half blocks (8×8×8) weigh about 18–20 lbs. Lightweight blocks made with expanded aggregate weigh 25–28 lbs for the standard size." },
            { question: "Do I need rebar in a concrete block wall?", answer: "Yes — for structural walls, building codes typically require vertical #4 or #5 rebar at 32–48 inch spacing. Horizontal rebar or masonry ladder wire is placed every 2–3 courses. All cells containing rebar must be filled with grout. Non-load-bearing partition walls may need less reinforcement — check local codes." },
            { question: "How tall can a concrete block wall be without reinforcement?", answer: "Per most US building codes (IBC/IRC), an unreinforced 8-inch block wall can be up to 4 feet tall. For walls above 4 feet, vertical and horizontal reinforcement is required. Retaining walls almost always need reinforcement regardless of height. Always check your local building code." },
            { question: "What type of mortar should I use for concrete blocks?", answer: "Type S mortar (high strength, 1,800 PSI) is best for below-grade walls, foundations, and retaining walls. Type N mortar (750 PSI) is suitable for above-grade, non-load-bearing walls. Type M mortar (2,500 PSI) is the strongest — use for heavy load-bearing or below-grade in contact with soil." },
            { question: "How many blocks come on a pallet?", answer: "Standard 8×8×16: 90–108 blocks per pallet (varies by manufacturer). Half blocks (8×8×8): about 180 per pallet. A pallet of standard blocks weighs approximately 3,400–4,100 lbs. Always verify counts with your supplier." },
            { question: "How long does it take to build a concrete block wall?", answer: "An experienced mason can lay 150–200 standard blocks per day (about 130–175 sq ft of wall). A 20 ft × 8 ft wall (180 blocks) takes roughly one full day. This includes mixing mortar, setting blocks, and tooling joints — but not the footing, rebar, grouting, or curing time." },
        ],
    },
    "flooring-calculator": {
        subtitle: "Calculate how much flooring material you need for any room. Choose from 6 flooring types — hardwood, laminate, vinyl plank, engineered wood, bamboo, or tile — and get square footage, boxes, underlayment rolls, trim, and cost estimate.",
        explanation: {
            heading: "How to Calculate Flooring Material",
            paragraphs: [
                "The basic flooring calculation is Length × Width to get the room's square footage. But never order just the exact amount — cuts, fitting around obstacles, and pattern matching require extra material. Industry standard is 10% waste for straight-lay and 15–20% for diagonal, herringbone, or parquet patterns.",
                "Flooring is sold by the box, with each box covering a specific square footage (typically 15–25 sq ft depending on product). Divide your total area (including waste) by the box coverage and round up — you can't buy a fraction of a box. Don't forget underlayment (sold in 200 sq ft rolls) and baseboard/trim (sold by the linear foot).",
            ],
            highlight: "12 × 10 ft room = 120 sq ft. With 10% waste = 132 sq ft. At 20 sq ft/box: 7 boxes. Underlayment: 1 roll. Trim: ~41 linear feet. At $8/sq ft hardwood: $1,056 for material.",
        },
        contentHTML: `
<p>The basic flooring calculation is Length × Width to get the room’s square footage. But never order just the exact amount — cuts, fitting around obstacles, and pattern matching require extra material. Industry standard is 10% waste for straight-lay and 15–20% for diagonal, herringbone, or parquet patterns.</p>
<p>Flooring is sold by the box, with each box covering a specific square footage (typically 15–25 sq ft depending on product). Divide your total area (including waste) by the box coverage and round up — you can’t buy a fraction of a box. Don’t forget underlayment (sold in 200 sq ft rolls) and baseboard/trim (sold by the linear foot).</p>
<p>Measure your room with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For tile projects, try our <a href="/construction-calculators/tile-calculator">tile calculator</a>. For carpet, see our <a href="/construction-calculators/carpet-calculator">carpet calculator</a>.</p>

<h2>How to Measure Your Room for Flooring</h2>
<p>Accurate measurements are the foundation of a successful flooring project. Here's how to measure like a pro:</p>
<ul>
<li><strong>Use a quality tape measure</strong> (or laser measurer for large rooms). Measure wall to wall, not baseboard to baseboard — you'll be removing baseboards before installation.</li>
<li><strong>Measure at the widest points.</strong> Walls are rarely perfectly straight. Measure at multiple spots and use the largest number.</li>
<li><strong>Break complex rooms into rectangles.</strong> For L-shaped, T-shaped, or rooms with bump-outs, divide the space into simple rectangles, calculate each separately, and add them together.</li>
<li><strong>Account for closets.</strong> Don't forget walk-in closets, alcoves, and pantries — they add significant square footage.</li>
<li><strong>Convert all measurements to feet</strong> before calculating. If you measured in inches, divide by 12.</li>
</ul>

<h2>Room Area Formulas</h2>
<table>
<thead><tr><th>Room Shape</th><th>Formula</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Rectangle</strong></td><td>Length × Width</td><td>12 × 10 = 120 sq ft</td></tr>
<tr><td><strong>L-Shape</strong></td><td>(L1 × W1) + (L2 × W2)</td><td>(12 × 10) + (6 × 4) = 144 sq ft</td></tr>
<tr><td><strong>Circle</strong></td><td>π × radius²</td><td>π × 5² = 78.5 sq ft</td></tr>
<tr><td><strong>Triangle</strong></td><td>½ × base × height</td><td>½ × 10 × 8 = 40 sq ft</td></tr>
</tbody>
</table>
<p>For rooms with angled walls or curved sections, measure the bounding rectangle and use the larger area. It's better to have extra material than to come up short mid-installation.</p>

<h2>Flooring Types Comparison</h2>
<table>
<thead><tr><th>Type</th><th>Material $/sq ft</th><th>Installed $/sq ft</th><th>Durability</th><th>DIY Difficulty</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>Solid Hardwood</strong></td><td>$4–$12</td><td>$8–$18</td><td>25–100 years</td><td>Hard</td><td>Living rooms, bedrooms, dining</td></tr>
<tr><td><strong>Engineered Wood</strong></td><td>$3–$10</td><td>$6–$15</td><td>20–40 years</td><td>Moderate</td><td>Basements, over concrete, radiant heat</td></tr>
<tr><td><strong>Laminate</strong></td><td>$0.75–$4</td><td>$3–$8</td><td>15–25 years</td><td>Easy</td><td>Budget-friendly, high-traffic areas</td></tr>
<tr><td><strong>Vinyl Plank (LVP)</strong></td><td>$1.50–$5</td><td>$3–$10</td><td>10–20 years</td><td>Easy</td><td>Kitchens, bathrooms, basements</td></tr>
<tr><td><strong>Bamboo</strong></td><td>$3–$8</td><td>$5–$12</td><td>20–35 years</td><td>Moderate</td><td>Eco-friendly, modern aesthetic</td></tr>
<tr><td><strong>Ceramic/Porcelain Tile</strong></td><td>$1–$15</td><td>$5–$20</td><td>50+ years</td><td>Hard</td><td>Bathrooms, kitchens, entryways</td></tr>
</tbody>
</table>

<h2>Flooring Cost (2025 US Pricing)</h2>
<table>
<thead><tr><th>Cost Component</th><th>Typical Range</th></tr></thead>
<tbody>
<tr><td><strong>Flooring material</strong></td><td>$0.75–$15 per sq ft (varies by type)</td></tr>
<tr><td><strong>Underlayment</strong></td><td>$0.15–$0.50 per sq ft ($30–$100 per 200 sq ft roll)</td></tr>
<tr><td><strong>Baseboard / trim</strong></td><td>$0.60–$2.00 per linear foot</td></tr>
<tr><td><strong>Transition strips</strong></td><td>$5–$20 each</td></tr>
<tr><td><strong>Adhesive (glue-down)</strong></td><td>$30–$60 per gallon (covers ~40–60 sq ft)</td></tr>
<tr><td><strong>Professional installation</strong></td><td>$2–$8 per sq ft labor</td></tr>
<tr><td><strong>Old flooring removal</strong></td><td>$1–$3 per sq ft</td></tr>
<tr><td><strong>Average 200 sq ft room (laminate, DIY)</strong></td><td>$400–$1,200 total</td></tr>
<tr><td><strong>Average 200 sq ft room (hardwood, pro install)</strong></td><td>$2,000–$4,500 total</td></tr>
</tbody>
</table>

<h2>Installation Tips for a Professional-Quality Floor</h2>
<ul>
<li><strong>Acclimate the flooring:</strong> Store flooring in the room where it will be installed for 48–72 hours before beginning. This allows the planks to adjust to the room's temperature and humidity, preventing gaps or buckling.</li>
<li><strong>Always use underlayment:</strong> Underlayment provides moisture protection, sound dampening, and minor subfloor leveling. Most floating floors (laminate, LVP, engineered) require it. Some planks come with attached underlayment — don't double up.</li>
<li><strong>Leave expansion gaps:</strong> Wood and laminate expand and contract with humidity. Leave a ¼-inch to ½-inch gap between the flooring and all walls, covered by baseboard trim.</li>
<li><strong>Stagger the seams:</strong> For plank flooring, stagger end joints by at least 6 inches between rows. This creates a more natural look and makes the floor structurally stronger.</li>
<li><strong>Start from the longest, most visible wall:</strong> Run planks parallel to the longest wall or toward the room's main light source. This makes the space look larger.</li>
<li><strong>Check subfloor flatness:</strong> The subfloor should be flat within 3/16 inch per 10-foot span. Use self-leveling compound for low spots and sand down high spots. An uneven subfloor causes squeaking and premature wear.</li>
</ul>

<h2>Waste Factor Guide</h2>
<table>
<thead><tr><th>Installation Pattern</th><th>Recommended Waste %</th></tr></thead>
<tbody>
<tr><td>Straight-lay (standard)</td><td>10%</td></tr>
<tr><td>Diagonal (45°)</td><td>15%</td></tr>
<tr><td>Herringbone / Chevron</td><td>15–20%</td></tr>
<tr><td>Parquet</td><td>20%</td></tr>
<tr><td>Complex room shapes</td><td>15%</td></tr>
<tr><td>First-time DIY installer</td><td>15–20%</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "How much extra flooring should I buy?", answer: "10% for standard rectangular rooms with straight-lay patterns. 15% for diagonal or herringbone patterns, L-shaped rooms, or rooms with many obstacles. 20% for parquet or if you're a first-time installer. Always keep leftover boxes for future repairs — matching dye lots later is nearly impossible." },
            { question: "Do I need underlayment for my floor?", answer: "Yes for most floating floors (laminate, engineered wood, LVP). Underlayment provides moisture protection, sound dampening, and minor subfloor leveling. Skip it only if your planks have attached underlayment (check the back of the plank). Never double up underlayment — it makes the floor bouncy and can void your warranty." },
            { question: "How long should flooring acclimate before installation?", answer: "48–72 hours minimum. Remove the flooring from boxes and lay it flat in the room where it will be installed. The room should be at normal living temperature (60–80°F) and humidity (30–50%). Acclimation prevents post-installation gaps, buckling, and cupping." },
            { question: "Should I run flooring parallel or perpendicular to the longest wall?", answer: "Generally parallel to the longest wall or toward the room's main light source. This makes the room look larger and more cohesive. For hallways, always run planks lengthwise. For rooms that open to hallways, match the hallway direction for visual flow." },
            { question: "How much does it cost to install flooring?", answer: "DIY material only: laminate $0.75–$4/sq ft, LVP $1.50–$5, engineered $3–$10, hardwood $4–$12. Professional installation adds $2–$8/sq ft for labor. A 200 sq ft room with laminate costs $400–$1,200 DIY or $1,000–$2,400 professionally installed." },
            { question: "Can I install new flooring over old flooring?", answer: "It depends. Floating floors (laminate, LVP, some engineered) can go over existing hard, flat surfaces like vinyl sheet, tile, or old hardwood. You cannot install over carpet, damaged subfloor, or uneven surfaces. Adding a new floor on top raises floor height — check that doors still open and transitions to other rooms work." },
            { question: "What is the difference between laminate and vinyl plank?", answer: "Laminate has a fiberboard core with a printed design layer and melamine top — it looks like wood but is damaged by standing water. Vinyl plank (LVP) has a 100% waterproof PVC core — it can go in kitchens, bathrooms, and basements. LVP is also quieter underfoot and more forgiving on uneven subfloors." },
            { question: "How do I account for closets and irregular areas?", answer: "Break the room into simple rectangles. Measure each section (main room, closet, alcove) separately, calculate the square footage of each, and add them together. For odd shapes, measure the bounding rectangle and use a waste factor of 15% instead of 10% to cover extra cuts." },
            { question: "How much baseboard trim do I need?", answer: "Measure the room's perimeter in linear feet using a tape measure. Subtract 3 feet for each standard doorway (no trim needed where there's an opening). Add 10% for waste — mitre cuts at corners create some scrap. Trim is sold in 8-ft, 12-ft, and 16-ft lengths." },
            { question: "What tools do I need for a DIY flooring installation?", answer: "For floating floors: tape measure, spacers (¼ inch), tapping block, pull bar, rubber mallet, utility knife or miter saw, and a carpenter's square. For nail-down hardwood: add a pneumatic flooring nailer. For glue-down: add a trowel and adhesive. A miter saw is essential for clean, accurate cuts." },
        ],
    },
    "tile-calculator": {
        subtitle: "Calculate how many tiles you need for any floor or wall. Choose from popular tile sizes or enter custom dimensions. Get tile count with waste, boxes, grout, thinset mortar, and cost estimate.",
        explanation: {
            heading: "How to Calculate Tiles Needed",
            paragraphs: [
                "Tile calculation divides your total area by the area of one tile (including the grout gap). A 12×12 inch tile with a ⅛-inch gap has an effective size of 12.125 × 12.125 inches = 1.02 sq ft. This small difference matters — over 100 sq ft, it means 2–3 extra tiles.",
                "Always add a waste factor: 10% for standard straight-lay, 15% for diagonal or herringbone, and 20% for complex patterns. Tiles are sold by the box, so round up to full boxes. Don't forget thinset mortar (~50 sq ft per 50 lb bag) and grout (~1 lb per 10 sq ft at ⅛-inch joints).",
            ],
            highlight: "100 sq ft bathroom with 12×12 tiles and ⅛\" gap = 97 tiles exact. With 10% waste = 107 tiles. At 10 tiles/box: 11 boxes. Thinset: 2 bags. Grout: 10 lbs.",
        },
        contentHTML: `
<p>Tile calculation divides your total area by the area of one tile (including the grout gap). A 12×12 inch tile with a ⅛-inch gap has an effective size of 12.125 × 12.125 inches = 1.02 sq ft. This small difference matters — over 100 sq ft, it means 2–3 extra tiles.</p>
<p>Always add a waste factor: 10% for standard straight-lay, 15% for diagonal or herringbone, and 20% for complex patterns. Tiles are sold by the box, so round up to full boxes. Don’t forget thinset mortar (~50 sq ft per 50 lb bag) and grout (~1 lb per 10 sq ft at ⅛-inch joints).</p>
<p>Measure floor area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For general flooring, use our <a href="/construction-calculators/flooring-calculator">flooring calculator</a>. For outdoor surfaces, try our <a href="/construction-calculators/gravel-calculator">gravel calculator</a>.</p>

<h2>Tile Types Comparison</h2>
<table>
<thead><tr><th>Type</th><th>Material $/sq ft</th><th>Durability</th><th>Water Resistance</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>Ceramic</strong></td><td>$1–$5</td><td>10–20 years</td><td>Good (glazed)</td><td>Walls, light-traffic floors, backsplash</td></tr>
<tr><td><strong>Porcelain</strong></td><td>$3–$10</td><td>25–50 years</td><td>Excellent</td><td>Bathrooms, kitchens, outdoor, high-traffic</td></tr>
<tr><td><strong>Natural Stone</strong></td><td>$5–$30</td><td>50+ years</td><td>Needs sealing</td><td>Entryways, luxury baths, fireplaces</td></tr>
<tr><td><strong>Glass</strong></td><td>$7–$30</td><td>30+ years</td><td>Excellent</td><td>Backsplash, accent walls, showers</td></tr>
<tr><td><strong>Mosaic</strong></td><td>$5–$25</td><td>20+ years</td><td>Good</td><td>Shower floors, accent strips, borders</td></tr>
<tr><td><strong>Cement / Encaustic</strong></td><td>$8–$20</td><td>25+ years</td><td>Needs sealing</td><td>Decorative floors, entryways</td></tr>
</tbody>
</table>

<h2>Step-by-Step: How to Calculate Tiles</h2>
<ol>
<li><strong>Measure the area</strong> in feet (length × width). For L-shaped rooms, break into rectangles and add.</li>
<li><strong>Calculate the effective tile area:</strong> Add the grout gap to each tile dimension, then multiply. Example: 12" tile + ⅛" gap = 12.125" → (12.125 ÷ 12)² = 1.02 sq ft.</li>
<li><strong>Divide total area by tile area</strong> to get the exact tile count.</li>
<li><strong>Add waste:</strong> Multiply by 1.10 for standard lay, 1.15 for diagonal, or 1.20 for herringbone/complex patterns.</li>
<li><strong>Round up to full boxes.</strong> Check the box coverage (sq ft or tile count) on the product label.</li>
</ol>

<h2>Popular Tile Sizes</h2>
<table>
<thead><tr><th>Size (inches)</th><th>Tiles per sq ft</th><th>Tiles per box (typical)</th><th>Box coverage (sq ft)</th><th>Common Use</th></tr></thead>
<tbody>
<tr><td><strong>6 × 6</strong></td><td>4.0</td><td>40–50</td><td>10–12</td><td>Shower walls, accent areas</td></tr>
<tr><td><strong>12 × 12</strong></td><td>1.0</td><td>10–12</td><td>10–12</td><td>Floors, walls (most popular)</td></tr>
<tr><td><strong>12 × 24</strong></td><td>0.5</td><td>6–8</td><td>12–16</td><td>Modern floors, large bathrooms</td></tr>
<tr><td><strong>18 × 18</strong></td><td>0.44</td><td>5–7</td><td>11–16</td><td>Open-plan floors</td></tr>
<tr><td><strong>24 × 24</strong></td><td>0.25</td><td>4–5</td><td>16–20</td><td>Large living areas, commercial</td></tr>
<tr><td><strong>3 × 6 (subway)</strong></td><td>8.0</td><td>50–80</td><td>6–10</td><td>Backsplash, shower walls</td></tr>
<tr><td><strong>1 × 1 (mosaic sheet)</strong></td><td>—</td><td>10 sheets</td><td>10</td><td>Shower floors, borders</td></tr>
</tbody>
</table>

<h2>Tile Layout Patterns</h2>
<table>
<thead><tr><th>Pattern</th><th>Waste Factor</th><th>Difficulty</th><th>Description</th></tr></thead>
<tbody>
<tr><td><strong>Straight Lay (Grid)</strong></td><td>10%</td><td>Easy</td><td>Tiles aligned in a grid. Simplest pattern, great for beginners.</td></tr>
<tr><td><strong>Brick / Running Bond</strong></td><td>10%</td><td>Easy</td><td>Each row offset by half a tile. Classic subway tile pattern.</td></tr>
<tr><td><strong>Diagonal (45°)</strong></td><td>15%</td><td>Moderate</td><td>Grid rotated 45°. More cuts at walls, but makes rooms look larger.</td></tr>
<tr><td><strong>Herringbone</strong></td><td>15–20%</td><td>Hard</td><td>Rectangular tiles at 90° angles in a V-shape. Very stylish, more waste.</td></tr>
<tr><td><strong>Basket Weave</strong></td><td>15%</td><td>Moderate</td><td>Pairs of tiles alternating horizontal and vertical. Classic look.</td></tr>
<tr><td><strong>Chevron</strong></td><td>20%</td><td>Hard</td><td>Similar to herringbone but tiles are cut at an angle. Premium look.</td></tr>
</tbody>
</table>

<h2>Grout & Thinset Guide</h2>
<h3>Grout</h3>
<ul>
<li><strong>Unsanded grout:</strong> For joints ⅛ inch or narrower. Smooth finish, best for walls and polished tile.</li>
<li><strong>Sanded grout:</strong> For joints ⅛ to ½ inch. Stronger, less likely to crack in wider joints. Standard for floor tile.</li>
<li><strong>Epoxy grout:</strong> Waterproof and stain-proof. More expensive and harder to work with, but ideal for showers and kitchen backsplash.</li>
<li><strong>Coverage:</strong> ~1 lb per 10 sq ft for 12×12 tiles with ⅛" joints. Smaller tiles or wider joints need more.</li>
</ul>
<h3>Thinset Mortar</h3>
<ul>
<li><strong>Standard thinset:</strong> For ceramic and porcelain up to 15" in any direction. ~50 sq ft per 50 lb bag with ¼×¼ trowel.</li>
<li><strong>Large-format thinset (LFT):</strong> Required for tiles larger than 15" in any direction. Prevents lippage.</li>
<li><strong>White vs gray:</strong> Use white thinset under light-colored or translucent tiles (glass, light marble). Gray for everything else.</li>
</ul>

<h2>Tile Cost (2025 US Pricing)</h2>
<table>
<thead><tr><th>Cost Component</th><th>Typical Range</th></tr></thead>
<tbody>
<tr><td><strong>Ceramic tile</strong></td><td>$1–$5 per sq ft</td></tr>
<tr><td><strong>Porcelain tile</strong></td><td>$3–$10 per sq ft</td></tr>
<tr><td><strong>Natural stone tile</strong></td><td>$5–$30 per sq ft</td></tr>
<tr><td><strong>Subway tile (3×6)</strong></td><td>$2–$8 per sq ft</td></tr>
<tr><td><strong>Thinset mortar (50 lb bag)</strong></td><td>$15–$30 per bag</td></tr>
<tr><td><strong>Grout (25 lb bag)</strong></td><td>$12–$25 per bag</td></tr>
<tr><td><strong>Professional installation</strong></td><td>$4–$12 per sq ft labor</td></tr>
<tr><td><strong>100 sq ft bathroom (porcelain, pro)</strong></td><td>$1,000–$2,500 total</td></tr>
</tbody>
</table>

<h2>Installation Tips</h2>
<ul>
<li><strong>Dry-lay first:</strong> Place tiles without adhesive to check the layout, verify symmetry, and minimize narrow cuts at walls.</li>
<li><strong>Use tile spacers:</strong> Spacers ensure consistent grout joints. Remove them before grouting.</li>
<li><strong>Start from the center:</strong> Snap chalk lines from the center of each wall to find the center point. Start tiling there and work outward for a balanced layout.</li>
<li><strong>Back-butter large tiles:</strong> For tiles larger than 15", apply thinset to both the substrate and the back of the tile for full coverage.</li>
<li><strong>Waterproof wet areas:</strong> Apply a waterproofing membrane (RedGard, Kerdi, etc.) before tiling shower walls and floors. Tile is not waterproof — the membrane is.</li>
<li><strong>Wait before grouting:</strong> Let thinset cure for 24 hours before applying grout. Wait another 24–72 hours after grouting before exposing to water.</li>
</ul>
`,
        faq: [
            { question: "What grout width should I use?", answer: "1/16\" for rectified (precision-cut, perfectly squared) tiles. ⅛\" for standard ceramic and porcelain — the most common size. 3/16\" for large-format tiles (18\"+ or tiles with slight size variation). ¼\" or wider for natural stone with irregular edges or tumbled finishes." },
            { question: "How many tiles come in a box?", answer: "It depends on tile size: 6×6 tiles: 40–50 per box (~10 sq ft). 12×12 tiles: 10–12 per box (~10 sq ft). 18×18 tiles: 5–7 per box (~11 sq ft). 24×24 tiles: 4–5 per box (~16 sq ft). Subway 3×6: 50–80 per box (~6–10 sq ft). Always check the box label for exact coverage." },
            { question: "What is the difference between ceramic and porcelain tile?", answer: "Porcelain is fired at higher temperatures, making it denser, harder, and more water-resistant (absorption rate <0.5%). Ceramic is softer, easier to cut, and cheaper. Porcelain is best for wet areas, outdoors, and high-traffic floors. Ceramic is fine for dry walls and light-traffic areas." },
            { question: "How much thinset mortar do I need?", answer: "A 50 lb bag of thinset covers approximately 50 sq ft using a ¼×¼ inch square-notch trowel. For large-format tiles (18\"+), use a ½×½ trowel — coverage drops to about 30 sq ft per bag. Always back-butter tiles larger than 15\" for full adhesion." },
            { question: "Should I use sanded or unsanded grout?", answer: "Sanded grout for joints ⅛ inch or wider — it's stronger and resists cracking. Unsanded grout for joints narrower than ⅛ inch — it fills thin joints smoothly without scratching polished tile. For showers, consider epoxy grout: it's waterproof, stain-proof, and doesn't need sealing." },
            { question: "How much does it cost to tile a bathroom?", answer: "For a 100 sq ft bathroom: tile material $300–$1,500 (ceramic to porcelain), thinset $30–$60, grout $12–$25, waterproofing $50–$100. Total DIY: $400–$1,700. Professional installation adds $4–$12/sq ft for labor. Total with pro: $1,000–$2,500." },
            { question: "Do I need to waterproof before tiling a shower?", answer: "Yes — always. Tile and grout are not waterproof. Apply a liquid waterproofing membrane (like RedGard) or a sheet membrane (like Schluter Kerdi) over the cement board before tiling. The membrane is what actually keeps water out of the wall cavity. Skipping this step leads to mold and rot." },
            { question: "How do I handle cuts at the edges and corners?", answer: "Use a manual tile cutter for straight cuts on ceramic tile. Use a wet saw with a diamond blade for porcelain, natural stone, and angled/notched cuts. For small cutouts (around outlets), use a tile nipper or an angle grinder with a diamond blade. Always wear safety glasses." },
            { question: "What layout pattern wastes the least tile?", answer: "Straight lay (grid) has the least waste — about 10%. Brick/running bond is similar at 10%. Diagonal increases waste to 15% due to angled cuts at every wall. Herringbone and chevron are the most wasteful at 15–20% because of the many angled cuts required." },
            { question: "How long does it take to tile a floor?", answer: "A skilled DIYer can tile about 50–75 sq ft per day (including thinset, tile setting, and cleanup). Professional tilers do 100–200 sq ft per day. A 100 sq ft bathroom takes 1–2 days for tile installation, plus another day for grouting and cleanup. Add 24–72 hours for curing before use." },
        ],
    },
    "roofing-calculator": {
        subtitle: "Calculate roofing materials for any project. Choose from 5 material types — asphalt, architectural, metal, wood shake, or clay tile. Get squares, shingle bundles, underlayment, drip edge, ridge cap, nails, and cost estimate.",
        explanation: {
            heading: "How to Calculate Roofing Materials",
            paragraphs: [
                "Roofing is measured in 'squares' — one square equals 100 square feet of roof area. To convert ground-level (footprint) measurements to actual roof area, multiply by a pitch correction factor. A 4:12 pitch multiplies by 1.054; a 12:12 (45°) pitch multiplies by 1.414.",
                "Standard asphalt shingles come in bundles, with 3 bundles per square (100 sq ft). Underlayment (felt or synthetic) comes in rolls covering ~400 sq ft. Don't forget drip edge (roof perimeter), ridge cap (ridge length), and roofing nails (~2.5 lbs per square). Always add 10% for waste.",
            ],
            highlight: "A 30×40 ft roof at 4:12 pitch = 1,200 sq ft footprint × 1.054 = 1,265 sq ft actual. With 10% waste = 1,391 sq ft = 13.9 squares = 42 bundles. Underlayment: 4 rolls. Drip edge: 154 linear ft.",
        },
        contentHTML: `
<p>Roofing is measured in ‘squares’ — one square equals 100 square feet of roof area. To convert ground-level (footprint) measurements to actual roof area, multiply by a pitch correction factor. A 4:12 pitch multiplies by 1.054; a 12:12 (45°) pitch multiplies by 1.414.</p>
<p>Standard asphalt shingles come in bundles, with 3 bundles per square (100 sq ft). Underlayment (felt or synthetic) comes in rolls covering ~400 sq ft. Don’t forget drip edge (roof perimeter), ridge cap (ridge length), and roofing nails (~2.5 lbs per square). Always add 10% for waste.</p>
<p>Find your roof pitch with our <a href="/construction-calculators/roof-pitch-calculator">roof pitch calculator</a>. Calculate area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For metal roofing, see our <a href="/construction-calculators/metal-roofing-calculator">metal roofing calculator</a>.</p>

<h2>Roof Pitch Correction Factors</h2>
<p>Roof pitch determines how much larger the actual roof area is compared to the footprint you measure from the ground. Use this table to convert:</p>
<table>
<thead><tr><th>Pitch</th><th>Multiplier</th><th>Angle (°)</th><th>Classification</th></tr></thead>
<tbody>
<tr><td>0:12</td><td>1.000</td><td>0°</td><td>Flat</td></tr>
<tr><td>2:12</td><td>1.014</td><td>9.5°</td><td>Low slope</td></tr>
<tr><td>4:12</td><td>1.054</td><td>18.4°</td><td>Low slope</td></tr>
<tr><td>6:12</td><td>1.118</td><td>26.6°</td><td>Conventional</td></tr>
<tr><td>8:12</td><td>1.202</td><td>33.7°</td><td>Conventional</td></tr>
<tr><td>10:12</td><td>1.302</td><td>39.8°</td><td>Steep</td></tr>
<tr><td>12:12</td><td>1.414</td><td>45°</td><td>Very steep</td></tr>
</tbody>
</table>
<p><strong>Formula:</strong> Actual roof area = footprint area × pitch multiplier. Most US residential roofs are 4:12 to 8:12.</p>

<h2>Roofing Material Types</h2>
<table>
<thead><tr><th>Material</th><th>Cost / Square</th><th>Installed / Sq</th><th>Lifespan</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>Asphalt 3-Tab</strong></td><td>$70–$120</td><td>$250–$400</td><td>15–20 years</td><td>Budget roofs, rentals</td></tr>
<tr><td><strong>Architectural (Dimensional)</strong></td><td>$100–$160</td><td>$350–$500</td><td>25–30 years</td><td>Most residential homes</td></tr>
<tr><td><strong>Metal Panels (Standing Seam)</strong></td><td>$300–$500</td><td>$600–$1,200</td><td>40–70 years</td><td>Long-term, hail/wind areas</td></tr>
<tr><td><strong>Wood Shake / Shingle</strong></td><td>$350–$500</td><td>$600–$900</td><td>20–40 years</td><td>High-end, rustic aesthetic</td></tr>
<tr><td><strong>Clay / Concrete Tile</strong></td><td>$600–$1,000</td><td>$1,000–$1,800</td><td>50–100+ years</td><td>Southwest, Mediterranean style</td></tr>
</tbody>
</table>

<h2>Roofing Components Guide</h2>
<h3>Shingles / Panels</h3>
<p>The primary roof covering. Asphalt shingles are sold in bundles — <strong>3 bundles = 1 square (100 sq ft)</strong>. Metal panels are sold by the sheet or linear foot. Wood shakes are sold in bundles covering approximately 25 sq ft each (4 bundles per square).</p>

<h3>Underlayment</h3>
<p>A waterproof barrier between the shingles and the roof deck. Types include:</p>
<ul>
<li><strong>15 lb felt (tar paper):</strong> Budget option, covers ~400 sq ft per roll. Being replaced by synthetics.</li>
<li><strong>30 lb felt:</strong> Heavier, more durable. ~200 sq ft per roll. Required for some metal roofs.</li>
<li><strong>Synthetic underlayment:</strong> Lighter, stronger, and water-resistant. ~1,000 sq ft per roll. Industry standard for new construction.</li>
</ul>

<h3>Ice & Water Shield</h3>
<p>Self-adhering membrane applied at eaves, valleys, and around penetrations. Required by code in cold climates. Apply from the eave up to at least 24 inches past the interior wall line.</p>

<h3>Drip Edge</h3>
<p>Metal flashing installed along the eaves and rakes (sides) of the roof. Prevents water from wicking under the shingles. Sold in <strong>10-ft strips</strong> — divide your roof perimeter by 10 and add 10% for overlap.</p>

<h3>Ridge Cap</h3>
<p>Pre-bent or hand-cut shingles applied along the ridge (peak) of the roof. Sold by the linear foot or in bundles covering ~33 linear feet. Provides a finished look and ventilation gap for ridge vents.</p>

<h3>Roofing Nails</h3>
<p>Use 1¼-inch galvanized roofing nails for standard shingles. Plan <strong>~2.5 lbs of nails per square</strong>. High-wind zones may require 6 nails per shingle instead of 4, increasing nail consumption by ~50%.</p>

<h2>Roof Replacement Cost (2025 US Pricing)</h2>
<table>
<thead><tr><th>Cost Component</th><th>Typical Range</th></tr></thead>
<tbody>
<tr><td><strong>Asphalt shingles (architectural)</strong></td><td>$100–$160 per square (material)</td></tr>
<tr><td><strong>Underlayment (synthetic)</strong></td><td>$50–$75 per roll (1,000 sq ft)</td></tr>
<tr><td><strong>Drip edge</strong></td><td>$1–$3 per linear foot</td></tr>
<tr><td><strong>Ice & water shield</strong></td><td>$50–$100 per roll (75 sq ft)</td></tr>
<tr><td><strong>Ridge cap shingles</strong></td><td>$30–$60 per bundle (33 lin ft)</td></tr>
<tr><td><strong>Tear-off (old roof removal)</strong></td><td>$100–$150 per square</td></tr>
<tr><td><strong>Professional labor</strong></td><td>$150–$300 per square</td></tr>
<tr><td><strong>Average 20-square roof (architectural, full replacement)</strong></td><td>$8,000–$15,000 total</td></tr>
</tbody>
</table>

<h2>Does Your Roof Need Replacing?</h2>
<ul>
<li><strong>Age:</strong> Asphalt roofs over 20 years old are approaching end of life even without visible damage.</li>
<li><strong>Curling or buckling shingles:</strong> Shingles that curl at the edges or buckle in the center are failing.</li>
<li><strong>Missing granules:</strong> Check gutters for large granule deposits — this means the shingles are degrading.</li>
<li><strong>Daylight through the roof deck:</strong> If you see light in the attic, water is getting in.</li>
<li><strong>Sagging roof deck:</strong> A sagging roof indicates structural damage — get a professional inspection immediately.</li>
</ul>
`,
        faq: [
            { question: "What is a roofing square?", answer: "A roofing square is exactly 100 square feet of roof area. All roofing materials — shingles, underlayment, felt — are priced and sold per square. To find how many squares your roof is, divide the total roof area (including waste) by 100. A 2,000 sq ft roof is 20 squares." },
            { question: "How do I measure roof pitch?", answer: "Place a level against the roof rafters and measure how many inches the roof rises for every 12 inches of horizontal run. A 6-inch rise per 12-inch run = 6:12 pitch. You can also measure from inside the attic. Most residential roofs are 4:12 to 8:12." },
            { question: "How much does a new roof cost?", answer: "For a 20-square roof (~2,000 sq ft): asphalt architectural shingles cost $8,000–$15,000 fully installed (tear-off, disposal, materials, labor). Metal roofing runs $15,000–$30,000. Clay tile can exceed $25,000–$40,000. Prices vary by region, complexity, and contractor." },
            { question: "How many bundles of shingles do I need?", answer: "3 bundles per roofing square (100 sq ft). A 20-square roof needs 60 bundles. This applies to standard 3-tab and architectural asphalt shingles. Add 10% for waste (hips, valleys, starters, and cuts). Ridge cap shingles are separate — about 1 bundle per 33 linear feet of ridge." },
            { question: "Should I tear off the old roof or overlay?", answer: "Tear-off is always preferred — it lets you inspect the deck for rot, install new underlayment, and ensures proper adhesion. Most codes allow a maximum of 2 layers of shingles. Adding a third layer voids warranties and may exceed structural load limits. Tear-off adds $100–$150 per square." },
            { question: "What roof pitch is too steep to walk on?", answer: "Most roofers can safely walk on pitches up to 8:12 (33.7°). Above 8:12, roof jacks (brackets) and planks are needed for safety. Above 12:12 (45°), specialized equipment is required. Steep roofs cost 20–50% more to install due to the extra safety equipment and slower work pace." },
            { question: "How long does a roof installation take?", answer: "A professional crew (3–5 workers) can complete a typical 20-square residential roof in 1–3 days, including tear-off. Complex roofs with multiple valleys, dormers, or skylights may take 4–5 days. Weather delays can extend the timeline. Metal and tile roofs take longer than asphalt." },
            { question: "Do I need a permit to replace my roof?", answer: "In most US cities and counties, yes — a building permit is required for roof replacement. The permit ensures the work meets local building codes (wind uplift, fire rating, ice protection). Permits typically cost $100–$500. Your contractor usually handles the permit process." },
            { question: "What underlayment should I use?", answer: "Synthetic underlayment is the current industry standard — it's lighter, stronger, and more water-resistant than felt. Use ice & water shield (self-adhering membrane) at eaves, valleys, and around penetrations in cold climates. For metal roofs, use high-temperature synthetic underlayment rated for metal." },
            { question: "How do I calculate roofing for a complex roof?", answer: "Break the roof into simple rectangles, triangles, and trapezoids. Calculate the area of each section separately, apply the pitch multiplier for that section, then add all sections together. Don't forget to add waste (10% minimum). For very complex roofs, consider getting a satellite measurement from a supplier like EagleView." },
        ],
    },
    "roof-pitch-calculator": {
        subtitle: "Calculate roof pitch from rise and run. Get pitch ratio, angle in degrees, slope percentage, rafter multiplier, roof classification, and walkability rating. Choose from 7 common presets or enter custom values.",
        explanation: {
            heading: "Understanding Roof Pitch",
            paragraphs: [
                "Roof pitch is expressed as a ratio of vertical rise to horizontal run — for example, 6:12 means the roof rises 6 inches for every 12 inches of horizontal distance. In the US, pitch is always expressed over a 12-inch run. This ratio determines everything: material choices, walkability, cost, and structural requirements.",
                "The pitch multiplier converts the flat (footprint) area into actual roof surface area. A 6:12 pitch has a multiplier of 1.118 — meaning the actual roof area is 11.8% larger than the footprint. This directly affects how many shingles, underlayment rolls, and other materials you need.",
            ],
            highlight: "Most US residential roofs are 4:12 to 8:12. A 4:12 roof rises 4 inches per foot (18.4° angle, 1.054× multiplier). A 12:12 roof is a 45° angle with a 1.414× multiplier — 41% more roof area than the footprint.",
        },
        contentHTML: `
<p>Roof pitch is expressed as a ratio of vertical rise to horizontal run — for example, 6:12 means the roof rises 6 inches for every 12 inches of horizontal distance. In the US, pitch is always expressed over a 12-inch run. This ratio determines everything: material choices, walkability, cost, and structural requirements.</p>
<p>The pitch multiplier converts the flat (footprint) area into actual roof surface area. A 6:12 pitch has a multiplier of 1.118 — meaning the actual roof area is 11.8% larger than the footprint. This directly affects how many shingles, underlayment rolls, and other materials you need.</p>
<p>Estimate materials with our <a href="/construction-calculators/roofing-calculator">roofing calculator</a>. Check snow loads with our <a href="/construction-calculators/roof-snow-load-calculator">roof snow load calculator</a>. Size rafters with our <a href="/construction-calculators/lumber-calculator">lumber calculator</a>.</p>

<h2>Standard Roof Pitches</h2>
<table>
<thead><tr><th>Pitch</th><th>Angle (°)</th><th>Multiplier</th><th>Slope %</th><th>Classification</th><th>Walkable?</th></tr></thead>
<tbody>
<tr><td><strong>0:12</strong></td><td>0°</td><td>1.000</td><td>0%</td><td>Flat</td><td>Yes — easy</td></tr>
<tr><td><strong>1:12</strong></td><td>4.8°</td><td>1.003</td><td>8.3%</td><td>Flat</td><td>Yes</td></tr>
<tr><td><strong>2:12</strong></td><td>9.5°</td><td>1.014</td><td>16.7%</td><td>Low slope</td><td>Yes</td></tr>
<tr><td><strong>3:12</strong></td><td>14.0°</td><td>1.031</td><td>25.0%</td><td>Low slope</td><td>Yes</td></tr>
<tr><td><strong>4:12</strong></td><td>18.4°</td><td>1.054</td><td>33.3%</td><td>Conventional</td><td>Yes — caution</td></tr>
<tr><td><strong>5:12</strong></td><td>22.6°</td><td>1.083</td><td>41.7%</td><td>Conventional</td><td>Yes — caution</td></tr>
<tr><td><strong>6:12</strong></td><td>26.6°</td><td>1.118</td><td>50.0%</td><td>Conventional</td><td>Moderate</td></tr>
<tr><td><strong>7:12</strong></td><td>30.3°</td><td>1.158</td><td>58.3%</td><td>Conventional</td><td>Moderate</td></tr>
<tr><td><strong>8:12</strong></td><td>33.7°</td><td>1.202</td><td>66.7%</td><td>Steep</td><td>Difficult</td></tr>
<tr><td><strong>9:12</strong></td><td>36.9°</td><td>1.250</td><td>75.0%</td><td>Steep</td><td>Roof jacks needed</td></tr>
<tr><td><strong>10:12</strong></td><td>39.8°</td><td>1.302</td><td>83.3%</td><td>Steep</td><td>Roof jacks needed</td></tr>
<tr><td><strong>12:12</strong></td><td>45.0°</td><td>1.414</td><td>100%</td><td>Very steep</td><td>Not walkable</td></tr>
</tbody>
</table>

<h2>How to Measure Roof Pitch</h2>
<h3>Method 1: From the Roof</h3>
<p>Hold a 12-inch level horizontally on the roof surface. At the 12-inch mark, measure straight down to the roof. That distance is the rise. If it measures 6 inches, your pitch is 6:12.</p>

<h3>Method 2: From the Attic</h3>
<p>Inside the attic, hold a level against a rafter. Measure 12 inches along the level from the rafter, then measure the distance from that point down to the rafter. This gives the rise without going on the roof — safer for steep roofs.</p>

<h3>Method 3: Total Rise and Run</h3>
<p>If you know the peak height and building width: <strong>Rise = peak height. Run = half the building width.</strong> Divide the rise (in inches) by the run (in inches) and multiply by 12 for the pitch. Example: 4 ft peak, 20 ft wide building → rise = 48", run = 120" → 48/120 × 12 = 4.8:12 pitch.</p>

<h3>Method 4: Speed Square</h3>
<p>Place the pivot point of a speed square on the rafter edge with a level attached. Read the degree marking where the rafter crosses the scale. Convert degrees to pitch using the table above or the formula: pitch = tan(degrees) × 12.</p>

<h2>Converting Between Degrees and Pitch</h2>
<h3>Degrees → Pitch</h3>
<p><strong>Formula:</strong> Pitch = tan(angle°) × 12. Example: 30° → tan(30°) × 12 = 0.577 × 12 = 6.9:12.</p>

<h3>Pitch → Degrees</h3>
<p><strong>Formula:</strong> Angle = arctan(rise ÷ 12). Example: 4:12 → arctan(4/12) = arctan(0.333) = 18.4°.</p>

<h2>How Pitch Affects Cost</h2>
<table>
<thead><tr><th>Pitch Range</th><th>Cost Impact</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>0–2:12 (Flat/Low)</td><td>Base cost</td><td>Easy to walk, no safety equipment</td></tr>
<tr><td>3–5:12 (Low–Mid)</td><td>+5–10%</td><td>Slightly more material due to area increase</td></tr>
<tr><td>6–8:12 (Conventional)</td><td>+10–20%</td><td>More materials, moderate safety needs</td></tr>
<tr><td>9–12:12 (Steep)</td><td>+20–40%</td><td>Roof jacks, harnesses, slower work pace</td></tr>
<tr><td>12:12+ (Very Steep)</td><td>+40–60%</td><td>Full scaffolding, specialized labor</td></tr>
</tbody>
</table>

<h2>Roofing Material by Pitch</h2>
<table>
<thead><tr><th>Material</th><th>Minimum Pitch</th><th>Recommended Pitch</th></tr></thead>
<tbody>
<tr><td><strong>Built-up / TPO / EPDM (flat roofing)</strong></td><td>0.25:12</td><td>0.25–2:12</td></tr>
<tr><td><strong>Metal panels (standing seam)</strong></td><td>0.5:12</td><td>3:12+</td></tr>
<tr><td><strong>Asphalt shingles</strong></td><td>2:12 (with underlayment)</td><td>4:12–12:12</td></tr>
<tr><td><strong>Wood shakes / shingles</strong></td><td>3:12</td><td>4:12–8:12</td></tr>
<tr><td><strong>Clay / concrete tile</strong></td><td>2.5:12</td><td>4:12–8:12</td></tr>
<tr><td><strong>Slate</strong></td><td>4:12</td><td>6:12–12:12</td></tr>
</tbody>
</table>

<h2>Common Roof Types by Pitch</h2>
<ul>
<li><strong>Flat roof (0–1:12):</strong> Commercial buildings, modern homes. Requires membrane roofing (TPO, EPDM). Must have positive drainage.</li>
<li><strong>Low slope (2–4:12):</strong> Ranch homes, attached garages. Can use shingles with proper underlayment. Minimum for most residential insurance.</li>
<li><strong>Conventional (5–8:12):</strong> Most common US residential range. Supports all roofing materials. Good balance of aesthetics, cost, and drainage.</li>
<li><strong>Steep (9–12:12):</strong> Cape Cod, Tudor, A-frame homes. Excellent snow shedding. Higher cost to install and maintain.</li>
<li><strong>Gambrel (dual-pitch):</strong> Barn-style. Lower section ~20:12, upper section ~7:12. Maximizes attic/loft space.</li>
<li><strong>Mansard (dual-pitch, 4 sides):</strong> Similar to gambrel but on all four sides. Very steep lower walls, flat or low-slope top.</li>
</ul>
`,
        faq: [
            { question: "What is the standard roof pitch?", answer: "Most US residential roofs are 4:12 to 8:12. The most common single pitch is 4:12 (18.4°) — it provides adequate drainage for asphalt shingles, is safe enough for workers to walk on, and doesn't dramatically increase material costs. 6:12 (26.6°) is the second most popular." },
            { question: "What roof pitch is best for snow?", answer: "9:12 to 12:12 allows snow to slide off naturally, reducing structural snow load. However, you need snow guards to prevent dangerous avalanches. In heavy snow areas (40+ lb/sq ft ground snow load), steeper is better. Below 3:12, snow accumulates and adds structural load — design must account for it." },
            { question: "What roof pitch is best for high winds?", answer: "6:12 to 7:12 performs best in high-wind zones. Steeper roofs present more surface area to wind uplift. Flatter roofs can experience suction. The 6–7:12 range balances drainage and wind resistance. In hurricane zones, hip roofs outperform gable roofs regardless of pitch." },
            { question: "What angle is a 4/12 roof pitch?", answer: "A 4:12 pitch equals 18.43 degrees. The formula is: angle = arctan(rise ÷ run) = arctan(4 ÷ 12) = arctan(0.333) = 18.43°. This is considered a low conventional pitch — the minimum recommended for standard asphalt shingles without special underlayment." },
            { question: "How do I convert roof pitch to degrees?", answer: "Use the formula: degrees = arctan(rise ÷ 12). Examples: 3:12 = 14.0°, 4:12 = 18.4°, 6:12 = 26.6°, 8:12 = 33.7°, 10:12 = 39.8°, 12:12 = 45.0°. Or use the standard pitches table above for instant lookup." },
            { question: "What is the pitch multiplier used for?", answer: "The pitch multiplier converts the building footprint (measured from the ground or blueprints) into the actual roof surface area. Multiply footprint area × pitch multiplier = actual roof area. A 1,000 sq ft footprint at 6:12 pitch = 1,000 × 1.118 = 1,118 sq ft of actual roof to cover with shingles." },
            { question: "Can I install asphalt shingles on a low-slope roof?", answer: "Asphalt shingles require a minimum 2:12 pitch, and below 4:12 you must install a full waterproofing underlayment (ice & water shield) beneath the shingles. Many shingle manufacturers void the warranty below 4:12. For roofs below 2:12, use flat-roofing materials (TPO, EPDM, or modified bitumen)." },
            { question: "Does roof pitch affect energy efficiency?", answer: "Yes. Steeper roofs have more surface area exposed to sun (increasing summer heat gain) but also allow more attic space for insulation and better ventilation. In hot climates, a lower pitch with reflective roofing (cool roof) reduces cooling costs. In cold climates, steeper roofs shed snow and reduce ice dam risk." },
            { question: "What is the difference between roof pitch and slope?", answer: "In practice, they're used interchangeably, but technically: pitch is expressed as rise:12 (inches per foot), while slope is expressed as a percentage or ratio (rise ÷ run). A 6:12 pitch = 50% slope = 0.5 ratio. Both describe the same angle (26.6°), just in different formats." },
            { question: "How steep can a roof be?", answer: "There's no theoretical maximum, but practical limits exist. Above 12:12 (45°), roofing is extremely difficult and expensive — workers need full scaffolding. Mansard and A-frame roofs may reach 20:12 (59°) or even near-vertical. Building codes and wind loads typically limit practical residential pitches to 12:12 or less." },
        ],
    },
    "paint-calculator": {
        subtitle: "Calculate how many gallons of paint you need for any room or exterior. Choose paint type, add ceiling and trim, include primer coats, and get a cost estimate. Supports 8 paint finishes and custom coverage.",
        explanation: {
            heading: "How to Calculate Paint Coverage",
            paragraphs: [
                "Paint coverage depends on the paint type, surface texture, and color change. Most interior latex paints cover approximately 350 square feet per gallon on smooth surfaces. Textured walls, new drywall, and dramatic color changes (light to dark or vice versa) may require additional coats, reducing effective coverage.",
                "The formula: calculate total wall area (perimeter × height), subtract openings (standard door ≈ 21 sq ft, standard window ≈ 15 sq ft), multiply by number of coats, then divide by paint coverage per gallon. Always round up — it's better to have leftover paint for touch-ups.",
            ],
            highlight: "A 12×10 ft room with 8 ft ceilings, 1 door, 2 windows, 2 coats: Wall area = 352 sq ft, minus openings = 301 sq ft, × 2 coats = 602 sq ft ÷ 350 = 1.7 gallons. Buy 2 gallons.",
        },
        contentHTML: `
<p>Paint coverage depends on the paint type, surface texture, and color change. Most interior latex paints cover approximately 350 square feet per gallon on smooth surfaces. Textured walls, new drywall, and dramatic color changes (light to dark or vice versa) may require additional coats, reducing effective coverage.</p>
<p>The formula: calculate total wall area (perimeter × height), subtract openings (standard door ≈ 21 sq ft, standard window ≈ 15 sq ft), multiply by number of coats, then divide by paint coverage per gallon. Always round up — it's better to have leftover paint for touch-ups.</p>
<p>Measure wall area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For new walls, see our <a href="/construction-calculators/drywall-calculator">drywall calculator</a>.</p>

<h2>Paint Coverage by Type</h2>
<table>
<thead><tr><th>Paint Type</th><th>Coverage (sq ft/gal)</th><th>Best For</th><th>Typical Coats</th></tr></thead>
<tbody>
<tr><td><strong>Interior Flat / Matte</strong></td><td>350–400</td><td>Ceilings, low-traffic rooms, hiding imperfections</td><td>2</td></tr>
<tr><td><strong>Interior Eggshell</strong></td><td>300–350</td><td>Living rooms, bedrooms, dining rooms</td><td>2</td></tr>
<tr><td><strong>Interior Satin</strong></td><td>300–350</td><td>Hallways, kids' rooms, family rooms</td><td>2</td></tr>
<tr><td><strong>Interior Semi-Gloss</strong></td><td>300–350</td><td>Kitchens, bathrooms, trim, doors</td><td>2</td></tr>
<tr><td><strong>Interior High-Gloss</strong></td><td>250–300</td><td>Cabinets, furniture, accent trim</td><td>2–3</td></tr>
<tr><td><strong>Exterior Flat / Satin</strong></td><td>250–300</td><td>Siding, large exterior surfaces</td><td>2</td></tr>
<tr><td><strong>Exterior Semi-Gloss</strong></td><td>250–275</td><td>Exterior trim, doors, shutters</td><td>2</td></tr>
<tr><td><strong>Primer / Sealer</strong></td><td>250–300</td><td>New drywall, stain blocking, color changes</td><td>1</td></tr>
<tr><td><strong>Ceiling Paint</strong></td><td>350–400</td><td>Ceilings — thicker formula to reduce drips</td><td>1–2</td></tr>
</tbody>
</table>

<h2>Step-by-Step: How to Estimate Paint</h2>
<h3>Step 1: Measure the Walls</h3>
<p>Measure the length and height of each wall in feet. Multiply length × height to get the area of each wall. For rectangular rooms, a shortcut: <strong>perimeter × ceiling height = total wall area</strong>. Perimeter = 2 × (length + width).</p>

<h3>Step 2: Subtract Openings</h3>
<p>Measure doors and windows. Standard deductions: a <strong>standard door is about 21 sq ft</strong> (3 × 7 ft) and a <strong>standard window is about 15 sq ft</strong> (3 × 5 ft). Subtract these from total wall area. For large picture windows or sliding doors, measure the actual dimensions.</p>

<h3>Step 3: Add Ceiling and Trim (Optional)</h3>
<p>For ceiling paint, add the ceiling area: length × width. For trim and baseboards, measure the linear feet around the room and multiply by the trim height (usually 4–6 inches). Crown molding typically adds 3–4 inches of paintable surface per linear foot.</p>

<h3>Step 4: Calculate Gallons</h3>
<p><strong>Gallons = (paintable area × number of coats) ÷ coverage per gallon</strong>. Always round up to the next full gallon or quart. Having leftover paint is ideal for future touch-ups — colors vary slightly between batches.</p>

<h2>Paint Coverage Chart by Room Size</h2>
<p>This table shows estimated gallons needed for common room sizes with 8 ft ceilings, 1 standard door, and 2 standard windows — walls only:</p>
<table>
<thead><tr><th>Room Size</th><th>Wall Area (sq ft)</th><th>Paintable Area</th><th>1 Coat (gal)</th><th>2 Coats (gal)</th></tr></thead>
<tbody>
<tr><td><strong>8 × 10 ft</strong></td><td>288</td><td>237</td><td>0.7</td><td>1.4</td></tr>
<tr><td><strong>10 × 10 ft</strong></td><td>320</td><td>269</td><td>0.8</td><td>1.5</td></tr>
<tr><td><strong>10 × 12 ft</strong></td><td>352</td><td>301</td><td>0.9</td><td>1.7</td></tr>
<tr><td><strong>12 × 12 ft</strong></td><td>384</td><td>333</td><td>1.0</td><td>1.9</td></tr>
<tr><td><strong>12 × 14 ft</strong></td><td>416</td><td>365</td><td>1.0</td><td>2.1</td></tr>
<tr><td><strong>14 × 16 ft</strong></td><td>480</td><td>429</td><td>1.2</td><td>2.5</td></tr>
<tr><td><strong>16 × 20 ft</strong></td><td>576</td><td>525</td><td>1.5</td><td>3.0</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> These assume 350 sq ft/gal coverage. Textured walls or dark-to-light color changes may reduce effective coverage by 20–30%.</p>

<h2>How to Estimate Paint for Trim</h2>
<p>Trim includes baseboards, door casings, window casings, chair rail, and crown molding. Estimating separately from walls ensures accuracy:</p>
<ul>
<li><strong>Baseboards:</strong> Measure the room perimeter in linear feet. Height is typically 3.5–5.5 inches (0.29–0.46 ft). Multiply perimeter × height for total area.</li>
<li><strong>Door casings:</strong> Each standard door has about 17 linear feet of casing (both sides + top, inside and outside). At 3.5 inches wide, that's ~5 sq ft per door.</li>
<li><strong>Window casings:</strong> Each standard window has about 14 linear feet of casing. At 3.5 inches wide, that's ~4 sq ft per window.</li>
<li><strong>Crown molding:</strong> Room perimeter × crown height (typically 3–5 inches).</li>
</ul>
<p><strong>Tip:</strong> Semi-gloss or high-gloss paint is standard for trim — it's more durable and easier to clean than flat paint. One quart covers about 75–100 sq ft of trim.</p>

<h2>Interior vs. Exterior Paint</h2>
<table>
<thead><tr><th>Feature</th><th>Interior Paint</th><th>Exterior Paint</th></tr></thead>
<tbody>
<tr><td><strong>Binder type</strong></td><td>Soft resins for smooth finish</td><td>Hard, flexible resins for weather resistance</td></tr>
<tr><td><strong>UV resistance</strong></td><td>Low — not designed for sun exposure</td><td>High — UV stabilizers prevent fading</td></tr>
<tr><td><strong>Flexibility</strong></td><td>Minimal — stable indoor temps</td><td>High — expands/contracts with temperature</td></tr>
<tr><td><strong>Mildew resistance</strong></td><td>Low</td><td>High — contains mildewcides</td></tr>
<tr><td><strong>VOC levels</strong></td><td>Low-VOC and zero-VOC options common</td><td>Higher VOC (less concern outdoors)</td></tr>
<tr><td><strong>Coverage</strong></td><td>350–400 sq ft/gal</td><td>250–300 sq ft/gal</td></tr>
<tr><td><strong>Typical price</strong></td><td>$30–$60/gal</td><td>$35–$70/gal</td></tr>
</tbody>
</table>

<h2>Surface Preparation Guide</h2>
<ul>
<li><strong>New drywall:</strong> Apply 1 coat of PVA primer before painting. Primer seals the porous paper surface and reduces paint absorption — you'll use less paint and get better adhesion.</li>
<li><strong>Previously painted walls:</strong> Clean with TSP (trisodium phosphate) solution. Lightly sand glossy surfaces for adhesion. Fill nail holes and cracks with spackle.</li>
<li><strong>Textured surfaces:</strong> Expect 20–30% more paint than smooth walls. Use a thick-nap roller (¾ inch for medium texture, 1 inch for heavy texture).</li>
<li><strong>Stained or damaged walls:</strong> Use a stain-blocking primer (shellac-based for severe stains, latex-based for light stains) before painting.</li>
<li><strong>Exterior wood:</strong> Scrape loose paint, sand smooth, prime bare wood. Caulk gaps around trim, windows, and doors before painting.</li>
</ul>

<h2>2025 US Paint Cost Guide</h2>
<table>
<thead><tr><th>Paint Grade</th><th>Price per Gallon</th><th>Coverage (sq ft)</th><th>Best Brands</th></tr></thead>
<tbody>
<tr><td><strong>Economy</strong></td><td>$20–$30</td><td>300–350</td><td>Glidden, ColorPlace, Valspar (basic)</td></tr>
<tr><td><strong>Mid-Range</strong></td><td>$30–$50</td><td>350–400</td><td>Behr, Valspar Signature, PPG</td></tr>
<tr><td><strong>Premium</strong></td><td>$50–$80</td><td>350–400</td><td>Benjamin Moore, Sherwin-Williams, Farrow & Ball</td></tr>
<tr><td><strong>Primer</strong></td><td>$25–$40</td><td>250–300</td><td>Kilz, Zinsser, Behr primer</td></tr>
<tr><td><strong>Exterior</strong></td><td>$35–$70</td><td>250–300</td><td>Sherwin-Williams Duration, Behr Ultra</td></tr>
</tbody>
</table>
<p><strong>Pro tip:</strong> Premium paint often covers in fewer coats, has better durability, and is easier to touch up. A $60/gal premium paint that covers in 1 coat can be cheaper overall than a $25/gal economy paint that needs 3 coats.</p>
`,
        faq: [
            { question: "How much does 1 gallon of paint cover?", answer: "One gallon of standard interior latex paint covers 350–400 square feet per coat on smooth surfaces. Semi-gloss and high-gloss cover slightly less (300–350 sq ft). Exterior paint covers 250–300 sq ft per gallon. Textured surfaces, porous materials, and dark-to-light color changes all reduce coverage." },
            { question: "How much paint do I need for a 12×12 room?", answer: "A 12×12 ft room with 8 ft ceilings has 384 sq ft of wall area. Subtracting 1 door (21 sq ft) and 2 windows (30 sq ft) = 333 sq ft paintable. At 350 sq ft/gal: 1 coat needs ~1 gallon, 2 coats need ~2 gallons. Buy 2 gallons for a standard 2-coat job." },
            { question: "Do I need primer before painting?", answer: "Primer is recommended for: new drywall (PVA primer), dramatic color changes (tinted primer), covering stains (shellac-based primer), and bare wood (wood primer). If painting a similar color over clean, previously painted walls with quality paint-and-primer combo, you can often skip separate primer." },
            { question: "How many coats of paint do I need?", answer: "Most color changes require 2 coats for even coverage. Going dark to light may need a tinted primer + 2 coats (or 3 coats without primer). Premium paint-and-primer combos may cover in 1 coat for same-color refreshes. Bright reds and yellows are notoriously poor at covering and may need 3+ coats." },
            { question: "What is the difference between flat, eggshell, satin, and semi-gloss?", answer: "Flat (no shine): best for ceilings, hides imperfections, but hard to clean. Eggshell (slight sheen): most popular for living areas, easy to clean. Satin (medium sheen): good for high-traffic areas, kids' rooms. Semi-gloss (noticeable shine): standard for kitchens, bathrooms, and trim — very washable. High-gloss: cabinets and furniture." },
            { question: "How do I estimate ceiling paint?", answer: "Ceiling area = room length × width. Ceiling paint is thicker and covers about 350–400 sq ft per gallon. A 12×12 ft ceiling = 144 sq ft = less than half a gallon per coat. Most ceilings need 1 coat unless covering dark colors or stains. Use flat white ceiling paint for the best results." },
            { question: "Can I paint over wallpaper?", answer: "It's possible but not ideal. If the wallpaper is smooth, well-adhered, and not vinyl, you can: apply oil-based primer, then paint with 2 coats of latex. However, seams and texture may show through. For best results, remove the wallpaper, repair the wall, prime, and paint." },
            { question: "How long should I wait between coats?", answer: "Latex paint: 2–4 hours between coats (or until dry to touch). Oil-based paint: 24 hours between coats. High humidity and cold temperatures extend dry time. The label on your specific paint will have the most accurate recoat time. Don't rush — painting over wet paint causes peeling and uneven coverage." },
            { question: "How do I calculate exterior paint for a house?", answer: "Measure each exterior wall (length × height). For gable walls, add the triangle area: ½ × base × gable height. Subtract windows and doors. Add 10% for waste. Exterior paint covers less (250–300 sq ft/gal) and typically needs 2 coats. A 1,500 sq ft exterior needs about 10–12 gallons for 2 coats." },
            { question: "How much does it cost to paint a room?", answer: "DIY: A 12×12 room typically costs $50–$100 for paint (2 gallons) plus $30–$50 for supplies (rollers, tape, drop cloths). Professional painters charge $300–$800 per room depending on size, prep work, and paint quality. Exterior painting: $1,500–$4,000 for an average home." },
        ],
    },
    "drywall-calculator": {
        subtitle: "Calculate how many drywall sheets you need for walls and ceilings. Choose from 5 drywall types and 3 sheet sizes. Get sheets, joint tape, compound, screws, weight, and total cost estimate with 10% waste factor.",
        explanation: {
            heading: "How to Estimate Drywall Materials",
            paragraphs: [
                "Standard drywall sheets are 4 feet wide × 8 feet tall (32 sq ft per sheet). Longer sheets (10 ft, 12 ft) are available for taller walls or fewer horizontal joints. To calculate sheets needed, divide the total wall and ceiling area by 32 and round up.",
                "Don't forget the finishing materials: plan approximately 12 feet of joint tape per sheet, 1 bucket (4.5 gallons) of joint compound per 100 sq ft, and about 28–32 drywall screws per sheet (spaced 12 inches on ceilings, 16 inches on walls).",
            ],
            highlight: "A 12×10 ft room with 8 ft ceilings, 1 door, 2 windows, plus ceiling: Wall area ≈ 301 sq ft + ceiling 120 sq ft = 421 sq ft ÷ 32 = 14 sheets of 4×8 drywall.",
        },
        contentHTML: `
<p>Standard drywall sheets are 4 feet wide × 8 feet tall (32 sq ft per sheet). Longer sheets (10 ft, 12 ft) are available for taller walls or fewer horizontal joints. To calculate sheets needed, divide the total wall and ceiling area by the sheet size, add 10% for waste, and round up.</p>
<p>Don't forget the finishing materials: plan approximately 12 feet of joint tape per sheet, 1 bucket (4.5 gallons) of joint compound per 100 sq ft, and about 28–32 drywall screws per sheet (spaced 12 inches on ceilings, 16 inches on walls).</p>
<p>Calculate wall area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For painting after install, use our <a href="/construction-calculators/paint-calculator">paint calculator</a>. For framing, see our <a href="/construction-calculators/lumber-calculator">lumber calculator</a>.</p>

<h2>Drywall Types Guide</h2>
<table>
<thead><tr><th>Type</th><th>Thickness</th><th>Weight (4×8 sheet)</th><th>Best Use</th><th>Price per Sheet</th></tr></thead>
<tbody>
<tr><td><strong>Standard (white board)</strong></td><td>½"</td><td>54 lbs</td><td>Most interior walls and ceilings</td><td>$10–$15</td></tr>
<tr><td><strong>Fire-Rated (Type X)</strong></td><td>⅝"</td><td>70 lbs</td><td>Garage walls, furnace rooms, code-required fire barriers</td><td>$14–$18</td></tr>
<tr><td><strong>Moisture-Resistant (green board)</strong></td><td>½"</td><td>56 lbs</td><td>Bathrooms, kitchens, laundry rooms (not direct water contact)</td><td>$13–$17</td></tr>
<tr><td><strong>Mold-Resistant (purple board)</strong></td><td>½"</td><td>58 lbs</td><td>High-humidity areas, basements, behind tile</td><td>$16–$20</td></tr>
<tr><td><strong>Soundproof (QuietRock)</strong></td><td>⅝"</td><td>80 lbs</td><td>Media rooms, bedrooms, shared walls, home offices</td><td>$40–$55</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> ¼" drywall exists for curved walls and overlaying existing surfaces. ½" is the US standard for 16" on-center framing. ⅝" is required by code for ceilings with 24" on-center framing and all fire-rated assemblies.</p>

<h2>Drywall Sheet Sizes</h2>
<table>
<thead><tr><th>Sheet Size</th><th>Coverage (sq ft)</th><th>Weight (½")</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>4 × 8 ft</strong></td><td>32</td><td>54 lbs</td><td>Most common — easy to handle, fits through doorways</td></tr>
<tr><td><strong>4 × 10 ft</strong></td><td>40</td><td>68 lbs</td><td>9–10 ft ceilings, reduces horizontal seams</td></tr>
<tr><td><strong>4 × 12 ft</strong></td><td>48</td><td>82 lbs</td><td>High ceilings, commercial — fewer joints, harder to carry</td></tr>
</tbody>
</table>
<p><strong>Tip:</strong> Longer sheets mean fewer seams and less finishing work, but they're significantly heavier and harder to maneuver through stairwells and tight spaces. A 4×12 sheet weighs 82 lbs — always use at least two people.</p>

<h2>Step-by-Step: How to Calculate Drywall</h2>
<h3>Step 1: Measure Walls and Ceiling</h3>
<p>Measure the length and height of each wall. For a rectangular room, use the shortcut: <strong>perimeter × ceiling height = total wall area</strong>. Perimeter = 2 × (length + width). Add the ceiling area (length × width) if you're drywalling the ceiling too.</p>

<h3>Step 2: Subtract Openings</h3>
<p>Standard door opening = 21 sq ft (3 × 7 ft). Standard window = 15 sq ft (3 × 5 ft). Subtract these from total area. For large openings, measure actual dimensions.</p>

<h3>Step 3: Add 10% for Waste</h3>
<p>Always add 10% to your net area to account for cuts, damaged sheets, fitting around outlets and corners. For complex layouts with many angles, increase waste to 15%.</p>

<h3>Step 4: Divide by Sheet Size</h3>
<p><strong>Sheets = (net area × 1.10) ÷ sheet sq ft</strong>. Round up to whole sheets. A 421 sq ft room with 10% waste = 463 sq ft ÷ 32 = 15 sheets of 4×8.</p>

<h2>How to Estimate Joint Compound and Tape</h2>
<p>Finishing drywall requires three coats: bedding coat (embed the tape), filler coat (smooth the seam), and finish coat (final smooth pass).</p>
<ul>
<li><strong>Joint tape:</strong> ~12 linear feet per sheet. Rolls come in 250 ft and 500 ft lengths. Paper tape is standard; mesh tape is easier for beginners but requires setting compound.</li>
<li><strong>Joint compound (mud):</strong> ~1 bucket (4.5 gal) per 100 sq ft of drywall. For a 14-sheet room: ~4.5 buckets. Pre-mixed is easiest; powder (setting compound) is faster-drying and stronger.</li>
<li><strong>Corner bead:</strong> Metal or paper-faced — needed for all outside corners. Measure total linear feet of corners.</li>
</ul>

<h2>Drywall Screw Spacing Guide</h2>
<table>
<thead><tr><th>Application</th><th>Spacing</th><th>Screws per Sheet</th><th>Screw Size</th></tr></thead>
<tbody>
<tr><td><strong>Walls (edges)</strong></td><td>8" on center</td><td>—</td><td>#6 × 1¼"</td></tr>
<tr><td><strong>Walls (field/studs)</strong></td><td>16" on center</td><td>~28 total</td><td>#6 × 1¼"</td></tr>
<tr><td><strong>Ceilings</strong></td><td>12" on center</td><td>~36 total</td><td>#6 × 1⅝"</td></tr>
<tr><td><strong>⅝" Type X</strong></td><td>12" on center</td><td>~36 total</td><td>#6 × 1⅝"</td></tr>
</tbody>
</table>
<p><strong>Rule of thumb:</strong> Plan about <strong>0.8 screws per square foot</strong> of drywall. A 5 lb box contains ~150 screws — enough for about 5–6 sheets.</p>

<h2>Drywall Cost Guide (2025 US Pricing)</h2>
<table>
<thead><tr><th>Material</th><th>Cost</th><th>Coverage</th></tr></thead>
<tbody>
<tr><td><strong>Standard ½" sheet (4×8)</strong></td><td>$10–$15</td><td>32 sq ft</td></tr>
<tr><td><strong>Fire-Rated ⅝" (4×8)</strong></td><td>$14–$18</td><td>32 sq ft</td></tr>
<tr><td><strong>Joint compound (4.5 gal)</strong></td><td>$14–$18</td><td>~100 sq ft</td></tr>
<tr><td><strong>Joint tape (250 ft roll)</strong></td><td>$6–$10</td><td>~20 sheets</td></tr>
<tr><td><strong>Drywall screws (5 lb box)</strong></td><td>$8–$12</td><td>~5–6 sheets</td></tr>
<tr><td><strong>Corner bead (8 ft)</strong></td><td>$3–$5</td><td>1 corner</td></tr>
<tr><td><strong>Professional installation</strong></td><td>$1.50–$3.00/sq ft</td><td>Hang + finish</td></tr>
</tbody>
</table>
<p><strong>Average DIY cost:</strong> $0.50–$0.80 per sq ft (materials only). <strong>Professional installed:</strong> $1.50–$3.00 per sq ft including hanging, taping, mudding, and sanding.</p>

<h2>Drywall Finishing Levels (0–5)</h2>
<ul>
<li><strong>Level 0:</strong> No finishing — used in temporary construction or areas above ceilings.</li>
<li><strong>Level 1:</strong> Tape set in compound — for areas hidden above ceilings or in attic spaces.</li>
<li><strong>Level 2:</strong> Tape + one coat — for areas behind tile or in garages.</li>
<li><strong>Level 3:</strong> Tape + two coats — for areas receiving heavy texture (knockdown, orange peel).</li>
<li><strong>Level 4:</strong> Tape + three coats — standard for most painted walls. Light textures or flat paint.</li>
<li><strong>Level 5:</strong> Tape + three coats + skim coat — premium smooth finish for gloss/semi-gloss paint or harsh lighting.</li>
</ul>
`,
        faq: [
            { question: "How many sheets of drywall do I need for a 10×10 room?", answer: "A 10×10 ft room with 8 ft ceilings = 320 sq ft walls + 100 sq ft ceiling = 420 sq ft. Minus 1 door (21 sq ft) and 2 windows (30 sq ft) = 369 sq ft net. With 10% waste = 406 sq ft ÷ 32 = 13 sheets of 4×8 drywall." },
            { question: "What size drywall should I use?", answer: "4×8 ft sheets are standard for most homes. Use 4×10 for 9–10 ft ceilings and 4×12 for high ceilings or to minimize seams. Longer sheets are heavier (82 lbs for 4×12) and harder to maneuver. For thickness: ½\" for walls, ⅝\" for ceilings and fire-rated assemblies." },
            { question: "What thickness of drywall do I need?", answer: "½\" is standard for most walls and ceilings with 16\" on-center framing. ⅝\" (Type X) is required for fire-rated assemblies — garage-to-house walls, furnace rooms, and between units in multifamily. ⅝\" is also recommended for ceilings to reduce sag. ¼\" is for curved walls and overlays." },
            { question: "Is drywall the same as Sheetrock?", answer: "Sheetrock is a brand name of drywall made by USG (United States Gypsum Company). It's like Kleenex vs. tissue — Sheetrock is one brand, but 'drywall' is the generic term. Other brands include Georgia-Pacific (ToughRock), National Gypsum (Gold Bond), and CertainTeed." },
            { question: "How much joint compound do I need?", answer: "Plan about 1 bucket (4.5 gallons, ~60 lbs) of all-purpose joint compound per 100 sq ft of drywall. This covers bedding, taping, and finish coats. A 14-sheet room needs about 4.5 buckets. For Level 5 finish (skim coat), add 50% more." },
            { question: "How much does it cost to drywall a room?", answer: "DIY materials: $0.50–$0.80 per sq ft (drywall, tape, mud, screws). A 12×10 room with ceiling costs about $200–$350 in materials. Professional installation: $1.50–$3.00 per sq ft for hanging, taping, mudding, and sanding — roughly $600–$1,200 for the same room." },
            { question: "Do I need moisture-resistant drywall in bathrooms?", answer: "Yes — use green board (moisture-resistant) or purple board (mold-resistant) in bathrooms, kitchens, and laundry rooms. Behind shower surrounds and tub areas, use cement board (HardieBacker, Durock) instead of drywall — drywall will fail with direct water exposure." },
            { question: "How many screws do I need per sheet of drywall?", answer: "About 28–32 screws per 4×8 sheet on walls (8\" spacing on edges, 16\" in the field), and about 36 screws per sheet on ceilings (12\" spacing everywhere). Plan roughly 0.8 screws per square foot. A 5 lb box contains ~150 screws — enough for 5–6 sheets." },
            { question: "Can I install drywall by myself?", answer: "Walls: yes, one person can hang 4×8 sheets on walls using a drywall lift or dead man (T-brace). Ceilings: highly recommended to use 2 people or a mechanical drywall lift. 4×12 sheets always require 2 people. Taping and mudding is easier solo but takes practice to get smooth." },
            { question: "How long does a drywall project take?", answer: "Hanging: an experienced DIYer can install 8–12 sheets per day. Taping/mudding: 3 coats with drying time between = 3–4 days. Sanding: half a day. Total for a 12×10 room (14 sheets): about 5–6 days including drying time. Pros can do the same room in 2–3 days." },
        ],
    },
    "square-footage-calculator": {
        subtitle: "Calculate square footage for any shape — rectangle, square, triangle, circle, trapezoid, or rectangular border. Get area in sq ft, sq yd, sq m, and acres. Includes cost per square foot, material waste factor, and project cost estimate.",
        explanation: {
            heading: "How to Calculate Square Footage",
            paragraphs: [
                "Square footage is area measured in feet. The universal formula for any rectangular or square space is: Area = Length × Width. For a 10-foot by 14-foot bedroom: 10 × 14 = 140 square feet. If your measurements are in inches, divide by 12 to convert to feet before multiplying. For irregular shapes like L-shaped rooms, split the space into two rectangles, calculate each separately, then add the results together.",
                "When ordering materials, always add a waste factor to your calculated square footage. For straight-lay flooring and tile: add 10%. For diagonal or herringbone patterns: add 15–20%. Running short mid-project is far more expensive than returning unused material. The formula: Materials needed = Room sq ft × (1 + waste factor). For a 200 sq ft room at 10% waste: 200 × 1.10 = 220 sq ft to purchase.",
            ],
            highlight: "Quick example: A 12×12 ft bedroom = 144 sq ft. At $5/sq ft vinyl plank flooring with 10% waste: you need 159 sq ft = about 8 boxes at 20 sq ft/box. Total material cost: ~$795. That is how material calculation works in practice.",
        },
        contentHTML: `
<p>Square footage is area measured in feet — specifically, the number of 1-foot × 1-foot squares that fit inside a space. The universal formula is <strong>Length × Width = Square Feet</strong>. If your measurements are in inches, divide both by 12 before multiplying. For irregular rooms, break the space into rectangles, calculate each section, and add the totals.</p>
<p>This calculator supports rectangles, squares, triangles, circles, trapezoids, and rectangular borders. You can enter measurements in feet and inches, add a material waste factor, and get an instant cost estimate using price per square foot, square yard, or square meter.</p>
<p>For volume projects using square footage as a base, use our <a href="/construction-calculators/cubic-yards-calculator">cubic yards calculator</a>. For tile projects, try our <a href="/construction-calculators/tile-calculator">tile calculator</a>. For flooring quantities, see our <a href="/construction-calculators/flooring-calculator">flooring calculator</a>.</p>

<h2>Area Formulas for Every Shape</h2>

<h3>Rectangle or Square</h3>
<p><strong>Area = Length × Width</strong></p>
<p>For a square, since all sides are equal: Area = Side². The most common formula for floors, walls, yards, and any flat rectangular surface.</p>
<p><strong>Example:</strong> A rectangular living room 15 ft × 18 ft = <strong>270 sq ft</strong></p>

<h3>Triangle</h3>
<p><strong>Area = ½ × Base × Height</strong></p>
<p>The height must be perpendicular to the base. Use this for triangular garden beds, gable walls, or bump-out additions. For a triangle where you know only the three side lengths, use Heron's Formula — the calculator handles this automatically.</p>
<p><strong>Example:</strong> A triangular deck extension with a 12-ft base and 8-ft height: ½ × 12 × 8 = <strong>48 sq ft</strong></p>

<h3>Circle</h3>
<p><strong>Area = π × (Diameter ÷ 2)²</strong> (where π ≈ 3.14159)</p>
<p>Enter the diameter — the full width of the circle. The calculator divides by 2 for you to get the radius before applying the formula.</p>
<p><strong>Example:</strong> A circular patio 14 ft in diameter (radius = 7 ft): π × 7² = 3.14159 × 49 = <strong>153.9 sq ft</strong></p>

<h3>Trapezoid</h3>
<p><strong>Area = [(a + b) ÷ 2] × Height</strong></p>
<p>Where a and b are the two parallel sides and height is the perpendicular distance between them. Cathedral ceiling walls and rooms with one angled wall typically follow this shape.</p>
<p><strong>Example:</strong> A trapezoidal yard with parallel sides of 30 ft and 40 ft, height 20 ft: [(30+40) ÷ 2] × 20 = 35 × 20 = <strong>700 sq ft</strong></p>

<h3>Rectangular Border (Frame)</h3>
<p>Used to calculate the area of a frame or border around a pool, garden bed, or tile surround — where you need to tile or pave the surrounding area, but not the center.</p>
<p><strong>Formula:</strong> Border Area = Total Outer Area − Inner Area</p>
<p><strong>Example:</strong> A 10×8 ft garden bed with a 2-ft stone border: Total = (14×12) = 168 sq ft. Inner = 10×8 = 80 sq ft. <strong>Border = 88 sq ft</strong></p>

<h2>Unit Conversion Reference Table</h2>
<p>Once you have your square footage, convert to other units using these exact factors:</p>
<table>
<thead><tr><th>From</th><th>To</th><th>Multiply By</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Square feet (ft²)</strong></td><td>Square inches (in²)</td><td>× 144</td><td>100 sq ft = 14,400 sq in</td></tr>
<tr><td><strong>Square feet (ft²)</strong></td><td>Square yards (yd²)</td><td>÷ 9</td><td>180 sq ft = 20 sq yd</td></tr>
<tr><td><strong>Square feet (ft²)</strong></td><td>Square meters (m²)</td><td>× 0.0929</td><td>1,000 sq ft = 92.9 m²</td></tr>
<tr><td><strong>Square feet (ft²)</strong></td><td>Acres</td><td>× 0.0000230</td><td>43,560 sq ft = 1 acre</td></tr>
<tr><td><strong>Square meters (m²)</strong></td><td>Square feet (ft²)</td><td>× 10.764</td><td>100 m² = 1,076 sq ft</td></tr>
<tr><td><strong>Square yards (yd²)</strong></td><td>Square feet (ft²)</td><td>× 9</td><td>20 sq yd = 180 sq ft</td></tr>
<tr><td><strong>Acres</strong></td><td>Square feet (ft²)</td><td>× 43,560</td><td>1 acre = 43,560 sq ft</td></tr>
</tbody>
</table>
<p><strong>Quick facts to memorize:</strong> 1 sq ft = 144 sq in · 9 sq ft = 1 sq yd · 43,560 sq ft = 1 acre · 1 sq m ≈ 10.764 sq ft</p>

<h2>How to Measure a Room Step by Step</h2>
<ol>
<li><strong>Clear the floor:</strong> Move furniture away from walls so you can measure wall-to-wall without obstruction.</li>
<li><strong>Measure length and width:</strong> Extend your tape measure from wall to wall at floor level. Record both dimensions in feet and inches.</li>
<li><strong>Convert inches to decimal feet:</strong> Divide the inches by 12 and add to feet. Example: 12 ft 6 in = 12 + (6÷12) = 12.5 ft.</li>
<li><strong>Multiply:</strong> Length × Width = square footage.</li>
<li><strong>Handle irregular shapes:</strong> For L-shaped, T-shaped, or rooms with bump-outs, divide the space into two or more rectangles. Calculate each, then add.</li>
<li><strong>Add waste factor for materials:</strong> Multiply total sq ft by 1.10 for standard flooring or 1.15–1.20 for diagonal or herringbone patterns.</li>
</ol>

<h3>How to Measure an L-Shaped Room</h3>
<p>An L-shaped room is two rectangles joined together. Divide the space by drawing an imaginary line across the corner to create Rectangle A and Rectangle B. Measure each section separately, then add both areas.</p>
<p><strong>Example:</strong></p>
<ul>
<li>Rectangle A: 12 ft × 10 ft = 120 sq ft</li>
<li>Rectangle B: 8 ft × 6 ft = 48 sq ft</li>
<li><strong>Total: 168 sq ft</strong></li>
</ul>

<h2>How to Calculate Home Square Footage (The US Standard)</h2>
<p>When measuring a house for a real estate listing or mortgage appraisal, US professionals follow the <strong>ANSI Z765 standard</strong> — adopted by Fannie Mae and Freddie Mac as the benchmark for Gross Living Area (GLA) calculations.</p>
<table>
<thead><tr><th>What Counts Toward GLA</th><th>What Does NOT Count</th></tr></thead>
<tbody>
<tr><td>✅ Finished, heated space above ground level</td><td>❌ Basements — even finished ones (reported separately)</td></tr>
<tr><td>✅ Rooms with ceiling height ≥ 7 feet</td><td>❌ Attached or detached garages</td></tr>
<tr><td>✅ For sloped ceilings: ≥50% of floor area at 7+ ft</td><td>❌ Unheated sunrooms, porches without permanent heat</td></tr>
<tr><td>✅ All above-grade floors added together</td><td>❌ Attics unless finished, heated, and 7 ft ceiling met</td></tr>
</tbody>
</table>
<p><strong>Context:</strong> The median new single-family home in the US (2024) is <strong>2,146 sq ft</strong> with an average of approximately 2,367 sq ft, per the US Census Bureau. Existing homes tend to be smaller.</p>

<h2>Material Waste Factor Guide by Project Type</h2>
<table>
<thead><tr><th>Material / Pattern</th><th>Waste Factor</th><th>Why</th></tr></thead>
<tbody>
<tr><td><strong>Hardwood flooring, straight lay</strong></td><td>5–7%</td><td>Minimal cuts</td></tr>
<tr><td><strong>Carpet (most rooms)</strong></td><td>10%</td><td>Fitting seams and obstacles</td></tr>
<tr><td><strong>Ceramic/porcelain tile, straight lay</strong></td><td>10%</td><td>Cuts at walls and doorways</td></tr>
<tr><td><strong>Tile, diagonal (45°) pattern</strong></td><td>15%</td><td>Many angled cuts at walls</td></tr>
<tr><td><strong>Herringbone tile pattern</strong></td><td>15–20%</td><td>Complex cuts, high breakage</td></tr>
<tr><td><strong>Vinyl plank (LVP), straight lay</strong></td><td>10%</td><td>Fitting around fixtures</td></tr>
<tr><td><strong>Natural stone tile</strong></td><td>15–20%</td><td>Breakage + size variation</td></tr>
<tr><td><strong>Sod / turf</strong></td><td>5%</td><td>Shape fitting and settling</td></tr>
<tr><td><strong>Mulch / gravel / topsoil</strong></td><td>5–10%</td><td>Spillage and settling</td></tr>
</tbody>
</table>
<p><strong>Formula for total material to order:</strong> Materials = Room sq ft × (1 + waste factor decimal)</p>
<p>Example: 200 sq ft room with 10% waste = 200 × 1.10 = <strong>220 sq ft to purchase</strong>. Always round up to full boxes or rolls.</p>

<h2>Price Per Square Foot Guide — US Benchmarks (2025)</h2>
<h3>Flooring Cost Per Square Foot (Material + Installation)</h3>
<table>
<thead><tr><th>Flooring Type</th><th>Installed Cost Range (US)</th></tr></thead>
<tbody>
<tr><td><strong>Carpet</strong></td><td>$2 – $9/sq ft</td></tr>
<tr><td><strong>Vinyl plank (LVP)</strong></td><td>$5 – $10/sq ft</td></tr>
<tr><td><strong>Laminate</strong></td><td>$4 – $9/sq ft</td></tr>
<tr><td><strong>Ceramic/Porcelain tile</strong></td><td>$6 – $14/sq ft</td></tr>
<tr><td><strong>Hardwood</strong></td><td>$8 – $15/sq ft</td></tr>
</tbody>
</table>
<h3>Cost Per Square Foot Formula</h3>
<p><strong>Cost per sq ft = Total project cost ÷ Total sq ft</strong></p>
<p>Example: A 2,000 sq ft home sells for $350,000 → $350,000 ÷ 2,000 = <strong>$175/sq ft</strong>. This lets you compare homes of different sizes in the same market, or estimate material budgets before getting contractor quotes.</p>

<h2>Average Room Sizes in the US — Reference Table</h2>
<table>
<thead><tr><th>Room</th><th>Common US Dimensions</th><th>Average Sq Ft</th></tr></thead>
<tbody>
<tr><td><strong>Primary/master bedroom</strong></td><td>12×16 ft to 14×18 ft</td><td>200–250 sq ft</td></tr>
<tr><td><strong>Secondary bedroom</strong></td><td>10×11 ft to 10×12 ft</td><td>110–120 sq ft</td></tr>
<tr><td><strong>Kids bedroom</strong></td><td>9×10 ft to 10×10 ft</td><td>90–100 sq ft</td></tr>
<tr><td><strong>Living room</strong></td><td>12×18 ft to 15×20 ft</td><td>216–300 sq ft</td></tr>
<tr><td><strong>Kitchen</strong></td><td>10×10 ft to 12×15 ft</td><td>100–180 sq ft</td></tr>
<tr><td><strong>Full bathroom</strong></td><td>5×8 ft to 7×10 ft</td><td>40–70 sq ft</td></tr>
<tr><td><strong>Half bath (powder room)</strong></td><td>3×6 ft to 4×5 ft</td><td>18–20 sq ft</td></tr>
<tr><td><strong>2-car garage</strong></td><td>20×20 ft to 22×24 ft</td><td>400–528 sq ft</td></tr>
<tr><td><strong>Average new US home (2024)</strong></td><td>—</td><td>~2,146 sq ft</td></tr>
</tbody>
</table>

<h2>Square Footage for Landscaping and Outdoor Projects</h2>
<p>This calculator works equally well for outdoor areas. Common outdoor applications:</p>
<ul>
<li><strong>Lawn / sod:</strong> Measure the lawn area excluding the house footprint, walkways, and planting beds. Add 5% overage when ordering sod.</li>
<li><strong>Garden bed / mulch:</strong> Calculate bed area in sq ft, then use our <a href="/construction-calculators/cubic-yards-calculator">cubic yards calculator</a> to find how much mulch or topsoil you need at a given depth.</li>
<li><strong>Patio or deck:</strong> Use Rectangle for square/rectangular patios. Use Circle for circular fire pit areas. Add 10% for tile waste.</li>
<li><strong>Driveway:</strong> Calculate the rectangle, then add any triangular flare at the entry separately using the triangle formula.</li>
</ul>
<p><strong>Landscaping volume rule of thumb:</strong> 1 cubic yard covers 162 sq ft at 2 inches deep · 108 sq ft at 3 inches · 81 sq ft at 4 inches.</p>
`,
        faq: [
            {
                question: "How many square feet is a 12×12 room?",
                answer: "A 12 ft × 12 ft room is 144 square feet (12 × 12 = 144). This is a common size for secondary bedrooms and home offices in the US. At a flooring cost of $5/sq ft, that's $720 in materials before installation."
            },
            {
                question: "How do I calculate square footage?",
                answer: "Multiply the length of the space (in feet) by the width (in feet). The result is your square footage. For example, a room that is 15 ft long and 12 ft wide is 180 square feet. For irregular spaces, divide into rectangles, calculate each, and add the totals."
            },
            {
                question: "What is 1 square foot?",
                answer: "One square foot is a square where every side is exactly 12 inches (1 foot) long. Picture a standard 12×12-inch floor tile — that is exactly 1 square foot. A 10×10 ft room contains exactly 100 of these squares, so it is 100 square feet."
            },
            {
                question: "Are square feet and linear feet the same?",
                answer: "No. Linear feet measures straight-line distance — one dimension. Square feet measures flat area — two dimensions multiplied together. You buy carpet by the square foot but install baseboards by the linear foot. A 12-foot wall gives you 12 linear feet of baseboard trim."
            },
            {
                question: "How many square feet is an acre?",
                answer: "One acre equals exactly 43,560 square feet. Visually, that is roughly the size of an American football field minus both end zones. A standard US city block is typically 2 to 6 acres, depending on the city grid."
            },
            {
                question: "How do I calculate square footage for flooring?",
                answer: "Measure each room's length and width in feet, multiply to get area, then repeat for every room. Add all rooms together. Then add 10% for waste (cuts, fitting around obstacles). For diagonal or herringbone patterns, add 15–20%. Divide your total by the box coverage to find how many boxes to buy, always rounding up."
            },
            {
                question: "How do I calculate square footage for tile?",
                answer: "Use Length × Width to find floor area. Then apply a waste factor: 10% for straight-lay, 15% for diagonal, 15–20% for herringbone. Divide your total by the coverage listed on each tile box. Always round up to full boxes — never down — because running short means a second trip and potentially no matching dye lot."
            },
            {
                question: "How do I calculate the square footage of a house?",
                answer: "Use the ANSI Z765 standard followed by US appraisers. Measure the exterior walls of each above-grade floor. Include only finished, heated living space with ceiling heights of at least 7 feet. Exclude basements (reported separately), garages, and unheated porches. Add each floor level together for total Gross Living Area (GLA)."
            },
            {
                question: "How do I convert square feet to square meters?",
                answer: "Multiply square feet by 0.0929 to get square meters — or divide by 10.764. Example: a 1,500 sq ft apartment = 1,500 × 0.0929 = approximately 139 square meters. To go the other way, multiply square meters by 10.764 to get square feet."
            },
            {
                question: "What is the difference between square footage and square yards?",
                answer: "Square yards are a larger unit — 1 square yard = 9 square feet. To convert, divide square feet by 9. Carpet is sometimes sold by the square yard. A 180 sq ft room needs 180 ÷ 9 = 20 square yards of carpet."
            },
            {
                question: "How do I calculate the price per square foot of a home?",
                answer: "Divide the total sale price by the total square footage. A $400,000 home with 2,000 sq ft = $200/sq ft. A $400,000 home with 2,500 sq ft = $160/sq ft. Price per square foot helps compare homes of different sizes in the same neighborhood, but location, lot size, age, and condition matter too."
            },
            {
                question: "What is the average square footage of a house in the US?",
                answer: "Per the US Census Bureau (2024), the median new single-family home completed in the US is 2,146 square feet, with an average of approximately 2,367 sq ft. These figures are for newly built homes — the existing housing stock tends to be smaller. In the 1950s, the average new home was around 1,000 sq ft."
            },
            {
                question: "Does square footage include walls?",
                answer: "For floor area (what you use for flooring and tile estimates), square footage is measured wall-to-wall along the floor. For painting, you calculate wall surface area separately: Height × Width of each wall, minus door and window openings, multiplied by the number of coats."
            },
            {
                question: "How do I calculate square footage of an irregular room?",
                answer: "Break the room into simpler shapes. For an L-shaped room, divide into two rectangles. For a room with a curved alcove, calculate the alcove as a half-circle using (π × r²) ÷ 2. For any bump-out or bay window, add those sections separately. Sum all sections for the total."
            },
            {
                question: "Can I use this calculator for outdoor areas?",
                answer: "Yes. This calculator works for any flat surface — indoors or outdoors. Use it for patios, decks, garden beds, driveways, lawns, and parking areas. For projects that also involve depth (mulch, concrete, gravel), use our cubic yards calculator after you have your square footage."
            },
        ],
    },
    "cubic-yards-calculator": {
        subtitle: "Calculate cubic yards for any material — gravel, mulch, topsoil, sand, concrete, or fill dirt. Choose from rectangle or cylinder shape, select material type for weight estimate, and get cost per cubic yard.",
        explanation: {
            heading: "How to Calculate Cubic Yards",
            paragraphs: [
                "A cubic yard is a volume measurement equal to 27 cubic feet (3ft × 3ft × 3ft). It's the standard unit for ordering bulk materials like gravel, mulch, topsoil, fill dirt, sand, and concrete. To calculate: Length (ft) × Width (ft) × Depth (ft) ÷ 27 = Cubic Yards.",
                "An important detail: depth is often measured in inches but must be converted to feet before calculating. A 3-inch layer of mulch is 3/12 = 0.25 feet deep. Also note that most materials compact 10–20% after installation, so order accordingly for projects that require a specific finished depth.",
            ],
            highlight: "A 10×10 ft area at 6 inch depth = 10 × 10 × 0.5 = 50 cu ft ÷ 27 = 1.85 cubic yards. For gravel, that's roughly 2.6 tons (1 cu yd of gravel ≈ 1.4 tons).",
        },
        contentHTML: `
<p>A cubic yard is a volume measurement equal to 27 cubic feet (3 ft × 3 ft × 3 ft). It's the standard unit for ordering bulk landscaping and construction materials like gravel, mulch, topsoil, fill dirt, sand, and concrete in the United States. Understanding how to calculate cubic yards saves money by preventing over-ordering and project delays from under-ordering.</p>
<p>Depth is often measured in inches but must be converted to feet before calculating. A 3-inch layer of mulch is 3 ÷ 12 = 0.25 feet deep. Most materials compact 10–20% after settling, so consider ordering slightly more than the calculated amount.</p>
<p>Measure area first with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For concrete projects, use our <a href="/construction-calculators/concrete-calculator">concrete calculator</a>. For gravel, see our <a href="/construction-calculators/gravel-calculator">gravel calculator</a>.</p>

<h2>Cubic Yards Formulas</h2>
<h3>Rectangular / Square Area</h3>
<p>The most common calculation for driveways, garden beds, and rectangular patios:</p>
<p><strong>Cubic Yards = Length (ft) × Width (ft) × Depth (ft) ÷ 27</strong></p>
<p>Example: A 12 ft × 14 ft patio with 4-inch gravel base: 12 × 14 × 0.333 ÷ 27 = <strong>2.07 cubic yards</strong>.</p>

<h3>Circular / Cylinder Area</h3>
<p>For round garden beds, tree rings, fire pit bases, and circular patios:</p>
<p><strong>Cubic Yards = π × (Diameter ÷ 2)² × Depth (ft) ÷ 27</strong></p>
<p>Example: A 10 ft diameter round flower bed with 3-inch mulch: π × 5² × 0.25 ÷ 27 = <strong>0.73 cubic yards</strong>.</p>

<h2>Step-by-Step: How to Calculate Cubic Yards</h2>
<h3>Step 1: Measure the Area</h3>
<p>Measure the length and width (or diameter for circles) in feet. Use a tape measure for accuracy. For irregular shapes, break the area into rectangles and circles, calculate each separately, and add the results.</p>

<h3>Step 2: Measure the Depth</h3>
<p>Decide the desired material depth. Common depths: <strong>2–3 inches</strong> for mulch and decorative stone, <strong>4–6 inches</strong> for gravel driveways, <strong>4 inches</strong> for concrete slabs, <strong>6–8 inches</strong> for road base.</p>

<h3>Step 3: Convert Units</h3>
<p>All measurements must be in the same unit. Convert inches to feet by dividing by 12. Convert yards to feet by multiplying by 3. Then multiply L × W × D.</p>

<h3>Step 4: Divide by 27</h3>
<p>Divide the volume in cubic feet by 27 to get cubic yards. Round up to the next whole or half yard — most suppliers sell in full or half-yard increments. Add 10% extra for waste and compaction.</p>

<h2>Material Weight per Cubic Yard</h2>
<table>
<thead><tr><th>Material</th><th>Weight per Cu Yd (tons)</th><th>Weight per Cu Yd (lbs)</th><th>Common Use</th></tr></thead>
<tbody>
<tr><td><strong>Topsoil</strong></td><td>1.0–1.3</td><td>2,000–2,600</td><td>Gardens, lawns, raised beds</td></tr>
<tr><td><strong>Mulch (wood chips)</strong></td><td>0.4–0.8</td><td>800–1,600</td><td>Landscaping, garden beds, playgrounds</td></tr>
<tr><td><strong>Gravel / Crushed Stone</strong></td><td>1.3–1.5</td><td>2,600–3,000</td><td>Driveways, drainage, road base</td></tr>
<tr><td><strong>Sand</strong></td><td>1.3–1.5</td><td>2,600–3,000</td><td>Paver base, sandboxes, concrete mix</td></tr>
<tr><td><strong>Fill Dirt</strong></td><td>1.0–1.3</td><td>2,000–2,600</td><td>Grading, filling holes, foundation backfill</td></tr>
<tr><td><strong>Concrete (wet)</strong></td><td>1.8–2.0</td><td>3,600–4,000</td><td>Slabs, footings, foundations</td></tr>
<tr><td><strong>River Rock</strong></td><td>1.4–1.6</td><td>2,800–3,200</td><td>Decorative landscaping, drainage</td></tr>
<tr><td><strong>Compost</strong></td><td>0.5–0.7</td><td>1,000–1,400</td><td>Garden amendment, soil enrichment</td></tr>
</tbody>
</table>

<h2>How Much Area Does 1 Cubic Yard Cover?</h2>
<p>The coverage depends on the depth of material applied. One cubic yard = 27 cubic feet:</p>
<table>
<thead><tr><th>Depth</th><th>Coverage (sq ft)</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>1 inch</strong></td><td>324 sq ft</td><td>Light top-dressing</td></tr>
<tr><td><strong>2 inches</strong></td><td>162 sq ft</td><td>Mulch (light layer)</td></tr>
<tr><td><strong>3 inches</strong></td><td>108 sq ft</td><td>Standard mulch, decorative stone</td></tr>
<tr><td><strong>4 inches</strong></td><td>81 sq ft</td><td>Concrete slabs, gravel base</td></tr>
<tr><td><strong>6 inches</strong></td><td>54 sq ft</td><td>Driveway gravel, road base</td></tr>
<tr><td><strong>12 inches (1 ft)</strong></td><td>27 sq ft</td><td>Raised beds, deep fill</td></tr>
</tbody>
</table>

<h2>How Much Is a Cubic Yard?</h2>
<p>A cubic yard is a cube 3 feet on each side — <strong>3 ft × 3 ft × 3 ft = 27 cubic feet</strong>. To visualize it:</p>
<ul>
<li><strong>Size:</strong> About the size of a standard washer/dryer set — roughly a 3×3×3 ft cube.</li>
<li><strong>Wheelbarrows:</strong> A standard wheelbarrow holds about 3 cubic feet — so 1 cubic yard = about <strong>9 wheelbarrow loads</strong>.</li>
<li><strong>Bags:</strong> A 2 cubic foot bag of mulch = about 13.5 bags per cubic yard.</li>
<li><strong>Weight:</strong> Ranges from 800 lbs (mulch) to 4,000 lbs (concrete) depending on material.</li>
</ul>

<h2>Truck Bed Capacity</h2>
<table>
<thead><tr><th>Vehicle</th><th>Bed Size</th><th>Capacity (cu yd)</th><th>Max Weight (lbs)</th></tr></thead>
<tbody>
<tr><td><strong>Compact Truck (short bed)</strong></td><td>5 ft bed</td><td>~0.9</td><td>~1,200</td></tr>
<tr><td><strong>Standard Truck (6 ft bed)</strong></td><td>6 ft bed</td><td>~1.3</td><td>~1,500</td></tr>
<tr><td><strong>Full-Size Truck (8 ft bed)</strong></td><td>8 ft bed</td><td>~2.0</td><td>~2,000</td></tr>
<tr><td><strong>Dump Truck (small)</strong></td><td>—</td><td>5–8</td><td>~13,000</td></tr>
<tr><td><strong>Dump Truck (standard)</strong></td><td>—</td><td>10–14</td><td>~26,000</td></tr>
</tbody>
</table>
<p><strong>Warning:</strong> A cubic yard of gravel weighs about 2,800 lbs. Most pickup trucks have a payload capacity of 1,200–2,000 lbs. <strong>Never exceed your truck's payload rating</strong> — it damages the suspension, brakes, and frame. For heavy materials, limit to half a cubic yard per trip or get delivery.</p>

<h2>2025 US Material Cost Guide</h2>
<table>
<thead><tr><th>Material</th><th>Cost per Cu Yd</th><th>Cost per Ton</th><th>Delivery (typical)</th></tr></thead>
<tbody>
<tr><td><strong>Topsoil</strong></td><td>$25–$50</td><td>$20–$40</td><td>$50–$100</td></tr>
<tr><td><strong>Mulch</strong></td><td>$20–$45</td><td>$30–$60</td><td>$50–$100</td></tr>
<tr><td><strong>Gravel (crushed)</strong></td><td>$40–$65</td><td>$25–$50</td><td>$50–$150</td></tr>
<tr><td><strong>Sand</strong></td><td>$25–$50</td><td>$20–$40</td><td>$50–$100</td></tr>
<tr><td><strong>Fill Dirt</strong></td><td>$10–$25</td><td>$8–$20</td><td>$50–$100</td></tr>
<tr><td><strong>Concrete (ready-mix)</strong></td><td>$120–$160</td><td>—</td><td>$50–$200 (truck fee)</td></tr>
<tr><td><strong>River Rock</strong></td><td>$50–$80</td><td>$40–$60</td><td>$50–$150</td></tr>
<tr><td><strong>Compost</strong></td><td>$30–$50</td><td>$25–$45</td><td>$50–$100</td></tr>
</tbody>
</table>
<p><strong>Pro tip:</strong> Buying in bulk (by the cubic yard) is 50–70% cheaper than buying bags from a hardware store. A 2 cu ft bag of mulch costs $3–$5 (~$40–$67/cu yd equivalent). Bulk mulch is $20–$45/cu yd.</p>
`,
        faq: [
            { question: "How many cubic feet are in a cubic yard?", answer: "There are 27 cubic feet in 1 cubic yard (3 × 3 × 3 = 27). To convert cubic feet to cubic yards, divide by 27. To convert cubic yards to cubic feet, multiply by 27." },
            { question: "How much does a cubic yard of material weigh?", answer: "It varies by material: topsoil = 1.0–1.3 tons, mulch = 0.4–0.8 tons, gravel = 1.3–1.5 tons, sand = 1.3–1.5 tons, concrete (wet) = 1.8–2.0 tons, fill dirt = 1.0–1.3 tons, river rock = 1.4–1.6 tons, compost = 0.5–0.7 tons." },
            { question: "How much area will 1 cubic yard cover?", answer: "Depends on depth: at 1\" deep = 324 sq ft, at 2\" = 162 sq ft, at 3\" = 108 sq ft, at 4\" = 81 sq ft, at 6\" = 54 sq ft, at 12\" (1 ft) = 27 sq ft. Mulch is typically spread 2–3\" deep; gravel driveways need 4–6\" deep." },
            { question: "How many cubic yards fit in a truck bed?", answer: "Compact truck (5 ft bed): ~0.9 cu yd. Standard truck (6 ft bed): ~1.3 cu yd. Full-size truck (8 ft bed): ~2.0 cu yd. But weight matters more — a full cubic yard of gravel (2,800 lbs) exceeds most pickup payload limits (1,200–2,000 lbs). For heavy materials, take half loads." },
            { question: "How do I convert cubic yards to tons?", answer: "Multiply cubic yards by the material's density factor: gravel = 1.4 tons/cu yd, sand = 1.3, topsoil = 1.1, mulch = 0.5, concrete = 2.0. For example: 3 cu yd of gravel = 3 × 1.4 = 4.2 tons." },
            { question: "How much mulch do I need?", answer: "Measure the area in feet (L × W). Standard mulch depth is 2–3 inches. Formula: L × W × (depth in inches ÷ 12) ÷ 27 = cubic yards. A 20 × 10 ft bed at 3\" deep: 20 × 10 × 0.25 ÷ 27 = 1.85 cu yd. Order 2 cu yd." },
            { question: "How much does a cubic yard of concrete cost?", answer: "Ready-mix concrete costs $120–$160 per cubic yard delivered, plus a truck/delivery fee of $50–$200. Short load fees ($50–$100 per yard) apply for orders under 5–10 yards. A standard 4\" thick, 10×10 ft slab needs about 1.2 cu yd = $200–$400 total." },
            { question: "How many wheelbarrow loads in a cubic yard?", answer: "A standard wheelbarrow holds about 3 cubic feet. One cubic yard = 27 cubic feet ÷ 3 = about 9 wheelbarrow loads. A large (6 cu ft) wheelbarrow: 27 ÷ 6 = about 4.5 loads." },
            { question: "How many bags of mulch equal a cubic yard?", answer: "Standard bags are 2 cubic feet. 1 cu yd = 27 cu ft ÷ 2 = 13.5 bags. A 3 cubic foot bag: 27 ÷ 3 = 9 bags per cu yd. Bulk is always cheaper — bags cost $3–$5 each ($40–$67/cu yd equivalent) vs. $20–$45/cu yd in bulk." },
            { question: "Should I order extra material for waste?", answer: "Yes — add 10% for rectangular areas and 15% for irregular shapes. Materials compact 10–20% after settling (especially topsoil and mulch). It's better to have a small surplus than to run short and pay a second delivery fee ($50–$150)." },
        ],
    },
    "gravel-calculator": {
        subtitle: "Calculate how much gravel you need for driveways, paths, and landscaping. Choose from 8 gravel types, get weight in tons, add compaction factor, and estimate total cost with delivery.",
        explanation: {
            heading: "How to Calculate Gravel Quantities",
            paragraphs: [
                "Gravel is sold by the cubic yard or by the ton. The conversion between the two depends on the material density — crushed stone and pea gravel weigh about 1.4 tons per cubic yard, while river rock is heavier at around 1.5 tons per cubic yard.",
                "For driveways, the recommended depth is 4–6 inches of gravel. For walkways, 2–3 inches is sufficient. Always compact the subgrade before laying gravel and consider installing landscape fabric beneath to prevent weed growth and material migration.",
            ],
            highlight: "A 20×10 ft driveway area with 3 inches of gravel = 20 × 10 × 0.25 = 50 cu ft ÷ 27 = 1.85 cubic yards ≈ 2.6 tons of crushed stone.",
        },
        contentHTML: `
<p>Gravel is one of the most versatile landscaping and construction materials in the United States. Whether you're building a driveway, creating a drainage solution, or designing a decorative walkway, knowing how to accurately calculate the amount of gravel you need saves money and prevents costly over- or under-ordering.</p>
<p>Gravel is sold by the <strong>ton</strong> or by the <strong>cubic yard</strong> depending on your supplier. Most landscape suppliers sell by the ton for large orders. The calculator above automatically includes a <strong>10% overage</strong> for waste and spillage, and optionally adds <strong>30% for compaction</strong> if you plan to compact the gravel for driveways or road base.</p>
<p>Convert volume with our <a href="/construction-calculators/cubic-yards-calculator">cubic yards calculator</a>. Measure area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For mulch, see our <a href="/construction-calculators/mulch-calculator">mulch calculator</a>.</p>

<h2>Gravel Types and Specifications</h2>
<table>
<thead><tr><th>Gravel Type</th><th>Size Range</th><th>Density (tons/cu yd)</th><th>Cost per Ton</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>Crushed Stone</strong></td><td>¾"–1½"</td><td>1.4</td><td>$25–$50</td><td>Driveways, road base, fill</td></tr>
<tr><td><strong>Pea Gravel</strong></td><td>⅜"–½"</td><td>1.4</td><td>$30–$55</td><td>Walkways, patios, dog runs</td></tr>
<tr><td><strong>River Rock</strong></td><td>1"–3"</td><td>1.5</td><td>$40–$70</td><td>Decorative landscaping, drainage</td></tr>
<tr><td><strong>Limestone</strong></td><td>¾"–2"</td><td>1.5</td><td>$20–$40</td><td>Driveways, pathways, erosion control</td></tr>
<tr><td><strong>Decomposed Granite</strong></td><td>⅛"–¼"</td><td>1.3</td><td>$30–$60</td><td>Pathways, patios, xeriscaping</td></tr>
<tr><td><strong>Quarry Process (QP)</strong></td><td>Dust–¾"</td><td>1.5</td><td>$15–$35</td><td>Road base, sub-base, paver base</td></tr>
<tr><td><strong>Marble Chips</strong></td><td>½"–1"</td><td>1.4</td><td>$50–$90</td><td>Decorative borders, garden accents</td></tr>
<tr><td><strong>Slate Chips</strong></td><td>½"–1½"</td><td>1.5</td><td>$45–$80</td><td>Decorative mulch, pathways</td></tr>
</tbody>
</table>

<h2>Step-by-Step: How to Estimate Gravel Needs</h2>
<h3>Step 1: Measure the Area</h3>
<p>Measure the length and width of the area in feet. For circular areas (tree rings, fire pit surrounds), measure the diameter. For irregular shapes, break into rectangles and circles, then add the results.</p>

<h3>Step 2: Determine Depth</h3>
<p>Choose depth based on your project type:</p>
<ul>
<li><strong>Decorative ground cover:</strong> 2 inches</li>
<li><strong>Walkways and paths:</strong> 2–3 inches</li>
<li><strong>Patios:</strong> 3–4 inches</li>
<li><strong>Driveways (light traffic):</strong> 4 inches</li>
<li><strong>Driveways (heavy traffic):</strong> 6–8 inches</li>
<li><strong>Road base / sub-base:</strong> 6–12 inches</li>
</ul>

<h3>Step 3: Calculate Volume</h3>
<p><strong>Rectangular:</strong> Length (ft) × Width (ft) × Depth (ft) ÷ 27 = Cubic Yards</p>
<p><strong>Circular:</strong> π × (Diameter ÷ 2)² × Depth (ft) ÷ 27 = Cubic Yards</p>

<h3>Step 4: Convert to Tons</h3>
<p>Multiply cubic yards by the material density. Crushed stone: cu yd × 1.4 = tons. River rock: cu yd × 1.5 = tons.</p>

<h3>Step 5: Add Overage</h3>
<p>Add <strong>10% for waste</strong> (spillage during transport and installation). If compacting the gravel (driveways, base layers), add an additional <strong>30% for compaction loss</strong>.</p>

<h2>How Many Tons in a Cubic Yard of Gravel?</h2>
<table>
<thead><tr><th>Material</th><th>Tons per Cu Yd</th><th>Lbs per Cu Yd</th></tr></thead>
<tbody>
<tr><td><strong>Crushed Stone</strong></td><td>1.4</td><td>2,800</td></tr>
<tr><td><strong>Pea Gravel</strong></td><td>1.4</td><td>2,800</td></tr>
<tr><td><strong>River Rock</strong></td><td>1.5</td><td>3,000</td></tr>
<tr><td><strong>Limestone</strong></td><td>1.5</td><td>3,000</td></tr>
<tr><td><strong>Decomposed Granite</strong></td><td>1.3</td><td>2,600</td></tr>
<tr><td><strong>Quarry Process</strong></td><td>1.5</td><td>3,000</td></tr>
<tr><td><strong>Sand</strong></td><td>1.3–1.5</td><td>2,600–3,000</td></tr>
<tr><td><strong>Topsoil</strong></td><td>1.0–1.3</td><td>2,000–2,600</td></tr>
</tbody>
</table>

<h2>Gravel Driveway Depth Guide</h2>
<p>A proper gravel driveway is built in <strong>three layers</strong> for maximum durability:</p>
<table>
<thead><tr><th>Layer</th><th>Material</th><th>Size</th><th>Depth</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><strong>Bottom (Sub-base)</strong></td><td>Large crushed stone</td><td>2"–4"</td><td>4–6 inches</td><td>Drainage & stability</td></tr>
<tr><td><strong>Middle (Base)</strong></td><td>Crushed stone / QP</td><td>¾"–1"</td><td>3–4 inches</td><td>Load-bearing structure</td></tr>
<tr><td><strong>Top (Surface)</strong></td><td>Fine gravel or DG</td><td>⅜"–¾"</td><td>2–3 inches</td><td>Smooth driving surface</td></tr>
</tbody>
</table>
<p><strong>Total depth:</strong> 9–13 inches for a durable residential driveway. A single-layer driveway (4–6 inches) works for light traffic but won't last as long.</p>

<h2>Overage and Compaction</h2>
<p>Most professionals add <strong>10% extra</strong> to account for waste and spillage during transport and spreading. If the gravel will be compacted (compacted with a plate compactor or roller), expect to lose approximately <strong>30% of the volume</strong> during the compaction process. This means you need to order 30% more material to achieve the desired finished depth.</p>
<p><strong>Example:</strong> If your calculations show you need 5.2 tons, add 10% overage = 5.7 tons. If compacting, add 30%: 5.7 × 1.3 = <strong>7.4 tons</strong>.</p>

<h2>2025 US Gravel Cost Guide</h2>
<table>
<thead><tr><th>Gravel Type</th><th>Cost per Ton</th><th>Cost per Cu Yd</th><th>Delivery (5–10 mi)</th></tr></thead>
<tbody>
<tr><td><strong>Crushed Stone</strong></td><td>$25–$50</td><td>$35–$70</td><td>$50–$150</td></tr>
<tr><td><strong>Pea Gravel</strong></td><td>$30–$55</td><td>$40–$75</td><td>$50–$150</td></tr>
<tr><td><strong>River Rock</strong></td><td>$40–$70</td><td>$55–$100</td><td>$50–$200</td></tr>
<tr><td><strong>Limestone</strong></td><td>$20–$40</td><td>$30–$55</td><td>$50–$150</td></tr>
<tr><td><strong>Decomposed Granite</strong></td><td>$30–$60</td><td>$40–$80</td><td>$50–$150</td></tr>
<tr><td><strong>Quarry Process</strong></td><td>$15–$35</td><td>$20–$50</td><td>$50–$100</td></tr>
</tbody>
</table>
<p><strong>Delivery:</strong> Most suppliers offer free delivery for orders over 10–15 tons. Below that threshold, expect delivery fees of $50–$200 depending on distance. Dump truck loads hold 13–25 tons and cost $455–$1,250+ per full load.</p>
`,
        faq: [
            { question: "How much gravel do I need for a driveway?", answer: "Measure the driveway length × width in feet. For a single-layer driveway, use 4–6 inches depth. For a three-layer driveway (recommended), total depth is 9–13 inches. A typical 12×50 ft driveway at 6 inches: 12 × 50 × 0.5 ÷ 27 = 11.1 cu yd × 1.4 = 15.5 tons + 10% overage = 17 tons." },
            { question: "Do I order gravel by the yard or by the ton?", answer: "Most landscape suppliers sell by the ton for large orders (5+ tons). Some sell by the cubic yard, especially for smaller quantities. Our calculator shows both. When comparing prices, convert: 1 cu yd of crushed stone = about 1.4 tons." },
            { question: "How much will 1 ton of gravel cover?", answer: "One ton of gravel covers: at 2 inches deep = ~100 sq ft, at 3 inches = ~70 sq ft, at 4 inches = ~50 sq ft, at 6 inches = ~35 sq ft. Exact coverage depends on gravel size — smaller gravel packs more tightly and covers slightly more area." },
            { question: "How much does a truckload of gravel cost?", answer: "A standard dump truck holds 13–25 tons. At $25–$50 per ton for crushed stone, a full load costs $325–$1,250. Delivery fees run $50–$200. A pickup truck holds ~1 ton (be careful not to exceed payload capacity). Many suppliers offer free delivery over 10–15 tons." },
            { question: "What's the best gravel for a driveway?", answer: "Crushed stone (#57 or #411) is the standard for driveways — it's angular, locks together, and doesn't roll under tires. Use quarry process (crusher run) for the base layer. Avoid pea gravel and river rock for driveways — they're rounded and shift under weight." },
            { question: "Should I compact gravel for a driveway?", answer: "Yes. Compact each layer with a plate compactor. Compaction reduces volume by ~30% but dramatically increases stability and longevity. Without compaction, gravel ruts quickly under vehicle weight. Water the gravel lightly before compacting for best results." },
            { question: "How thick should gravel be under pavers?", answer: "A paver base typically requires 4–6 inches of compacted gravel (quarry process or crushed stone), plus 1 inch of leveling sand on top. In areas with poor drainage or freeze-thaw cycles, use 6–8 inches of gravel base." },
            { question: "How much does gravel weigh per cubic yard?", answer: "Crushed stone: 2,800 lbs (1.4 tons). Pea gravel: 2,800 lbs (1.4 tons). River rock: 3,000 lbs (1.5 tons). Limestone: 3,000 lbs (1.5 tons). Decomposed granite: 2,600 lbs (1.3 tons). Quarry process: 3,000 lbs (1.5 tons)." },
            { question: "Can a pickup truck carry a cubic yard of gravel?", answer: "Most pickup trucks can physically hold 1 cubic yard of gravel by volume, but a cubic yard weighs 2,600–3,000 lbs — far exceeding most truck payload limits (1,200–2,000 lbs). Limit to ½ cubic yard per trip for heavy materials, or get professional delivery." },
            { question: "How do I prevent weeds growing through gravel?", answer: "Install landscape fabric (weed barrier) before spreading gravel. Use commercial-grade fabric, not cheap plastic sheeting. Overlap seams by 6 inches and pin with landscape staples every 2 feet. Apply gravel at least 2–3 inches deep over the fabric." },
        ],
    },
    "mulch-calculator": {
        subtitle: "Calculate how much mulch you need for garden beds and landscaping. Choose from 8 mulch types, compare bagged vs. bulk cost, and get weight and bag count with 10% overage.",
        explanation: {
            heading: "How to Calculate Mulch Needs",
            paragraphs: [
                "Mulch is typically applied 2–4 inches deep depending on the type and purpose. Shredded bark and wood chips are best at 3–4 inches for weed suppression. Decorative stone mulch needs only 2 inches. Deeper applications can suffocate plant roots and trap excess moisture.",
                "Mulch is sold in bags (typically 2 cubic feet each) or in bulk by the cubic yard. Bulk is significantly cheaper for larger areas — a cubic yard covers about 108 sq ft at 3 inches deep, equivalent to about 13.5 bags.",
            ],
            highlight: "A 10×10 ft garden bed with 3 inches of mulch = 100 × 0.25 = 25 cu ft = 0.93 cu yd. That's about 13 bags (2 cu ft each). At $5/bag = $65 in bags vs. ~$35 for bulk.",
        },
        contentHTML: `
<p>Mulch is essential for healthy landscaping throughout the <strong>United States</strong>. It retains soil moisture, suppresses weeds, regulates soil temperature, and creates a polished, finished look for garden beds, tree rings, and walkways. Knowing exactly how much mulch to buy prevents waste and ensures even coverage.</p>
<p>The calculator above supports <strong>8 common mulch types</strong>, automatically includes <strong>10% overage</strong> for settlement and spillage, calculates <strong>bags needed</strong> (2 or 3 cu ft), and compares <strong>bagged vs. bulk pricing</strong> so you can see exactly how much you'll save buying in bulk.</p>
<p>Convert volume with our <a href="/construction-calculators/cubic-yards-calculator">cubic yards calculator</a>. Measure bed area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For gravel, try our <a href="/construction-calculators/gravel-calculator">gravel calculator</a>.</p>

<h2>Mulch Types and Recommended Depth</h2>
<table>
<thead><tr><th>Mulch Type</th><th>Recommended Depth</th><th>Weight per Cu Yd</th><th>Bag Cost (2 cu ft)</th><th>Bulk Cost per Cu Yd</th></tr></thead>
<tbody>
<tr><td><strong>Shredded Hardwood Bark</strong></td><td>3–4 inches</td><td>~600 lbs</td><td>$4–$5</td><td>$25–$35</td></tr>
<tr><td><strong>Cedar Mulch</strong></td><td>2–3 inches</td><td>~550 lbs</td><td>$5–$7</td><td>$35–$45</td></tr>
<tr><td><strong>Pine Bark Nuggets</strong></td><td>3–4 inches</td><td>~450 lbs</td><td>$4–$6</td><td>$30–$40</td></tr>
<tr><td><strong>Pine Straw</strong></td><td>3–4 inches</td><td>~300 lbs</td><td>$5–$8/bale</td><td>$25–$35</td></tr>
<tr><td><strong>Wood Chips</strong></td><td>3–4 inches</td><td>~500 lbs</td><td>$3–$5</td><td>$20–$30</td></tr>
<tr><td><strong>Dyed Mulch (black/red/brown)</strong></td><td>2–3 inches</td><td>~600 lbs</td><td>$4–$6</td><td>$30–$40</td></tr>
<tr><td><strong>Rubber Mulch</strong></td><td>1–2 inches</td><td>~1,200 lbs</td><td>$7–$10</td><td>$150–$180</td></tr>
<tr><td><strong>Decorative Stone Mulch</strong></td><td>2 inches</td><td>~2,800 lbs</td><td>$5–$8</td><td>$45–$70</td></tr>
</tbody>
</table>

<h2>Step-by-Step Mulch Calculation</h2>
<h3>Step 1: Measure the Area</h3>
<p>Measure the <strong>length and width</strong> of each bed in feet. For circular tree rings, measure the <strong>diameter</strong>. For irregular beds, break them into rectangles and circles, then add the results.</p>

<h3>Step 2: Choose Depth</h3>
<p>Select depth based on mulch type and purpose:</p>
<ul>
<li><strong>Fine mulch</strong> (decomposed, cocoa hull): 1–2 inches</li>
<li><strong>Medium mulch</strong> (shredded bark, cedar): 2–3 inches</li>
<li><strong>Coarse mulch</strong> (pine bark nuggets, wood chips): 3–4 inches</li>
<li><strong>Rubber mulch</strong> (playgrounds): 3–6 inches for fall protection</li>
<li><strong>Weed suppression only</strong>: 4+ inches with landscape fabric underneath</li>
</ul>

<h3>Step 3: Calculate Volume</h3>
<p><strong>Rectangle:</strong> Length (ft) × Width (ft) × Depth (in) ÷ 12 = Cubic Feet. Divide by 27 for Cubic Yards.</p>
<p><strong>Circle:</strong> π × (Diameter ÷ 2)² × Depth (in) ÷ 12 = Cubic Feet. Divide by 27 for Cubic Yards.</p>

<h3>Step 4: Add 10% Overage</h3>
<p>Mulch is lightweight and tends to migrate and settle. Add <strong>10% extra</strong> to account for spillage, settlement, and transport loss. If buying bags, always round up.</p>

<h2>Mulch Coverage Chart</h2>
<p>How much area does <strong>1 cubic yard</strong> of mulch cover at different depths?</p>
<table>
<thead><tr><th>Depth</th><th>Coverage (sq ft)</th><th>Bags (2 cu ft)</th><th>Bags (3 cu ft)</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>1 inch</strong></td><td>324 sq ft</td><td>14</td><td>9</td><td>Light top-up, fine mulch</td></tr>
<tr><td><strong>2 inches</strong></td><td>162 sq ft</td><td>14</td><td>9</td><td>Cedar, dyed, stone</td></tr>
<tr><td><strong>3 inches</strong></td><td>108 sq ft</td><td>14</td><td>9</td><td>Standard organic mulch</td></tr>
<tr><td><strong>4 inches</strong></td><td>81 sq ft</td><td>14</td><td>9</td><td>Heavy weed suppression</td></tr>
<tr><td><strong>6 inches</strong></td><td>54 sq ft</td><td>14</td><td>9</td><td>Playground rubber mulch</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> Bag counts are per cubic yard regardless of depth. Coverage area changes with depth, but 1 cu yd always equals 27 cu ft = 14 bags (2 cu ft) or 9 bags (3 cu ft).</p>

<h2>Bagged vs. Bulk: Which Is Cheaper?</h2>
<table>
<thead><tr><th>Method</th><th>Cost per Cu Yd</th><th>Pros</th><th>Cons</th></tr></thead>
<tbody>
<tr><td><strong>Bagged (2 cu ft)</strong></td><td>$54–$94 equivalent</td><td>Easy to transport, fits in car, no minimum order</td><td>More expensive per cu yd, more plastic waste</td></tr>
<tr><td><strong>Bulk delivery</strong></td><td>$20–$45 + delivery</td><td>40–60% cheaper, less waste</td><td>Needs driveway space, delivery fee ($50–$100)</td></tr>
</tbody>
</table>
<p><strong>Break-even point:</strong> For most mulch types, buying bulk becomes cheaper at about <strong>3+ cubic yards</strong> (40+ bags). Below that, bags may be more practical despite the higher per-unit cost.</p>

<h2>2025 US Mulch Price Guide</h2>
<table>
<thead><tr><th>Mulch Type</th><th>Bagged (2 cu ft)</th><th>Bulk per Cu Yd</th><th>Delivery (5–10 mi)</th></tr></thead>
<tbody>
<tr><td><strong>Shredded Hardwood</strong></td><td>$4–$5</td><td>$25–$35</td><td>$50–$100</td></tr>
<tr><td><strong>Cedar</strong></td><td>$5–$7</td><td>$35–$45</td><td>$50–$100</td></tr>
<tr><td><strong>Pine Bark Nuggets</strong></td><td>$4–$6</td><td>$30–$40</td><td>$50–$100</td></tr>
<tr><td><strong>Dyed (black/red/brown)</strong></td><td>$4–$6</td><td>$30–$40</td><td>$50–$100</td></tr>
<tr><td><strong>Rubber</strong></td><td>$7–$10</td><td>$150–$180</td><td>$75–$150</td></tr>
<tr><td><strong>Wood Chips</strong></td><td>$3–$5</td><td>$20–$30</td><td>$50–$100</td></tr>
</tbody>
</table>
<p><strong>Pro tip:</strong> Many municipalities offer <strong>free wood chip mulch</strong> from tree trimming programs. Check your city's public works department — you may only need to pay for delivery.</p>
`,
        faq: [
            { question: "How much does a yard of mulch cover?", answer: "One cubic yard covers: 324 sq ft at 1 inch deep, 162 sq ft at 2 inches, 108 sq ft at 3 inches, 81 sq ft at 4 inches, 54 sq ft at 6 inches. The most common application (3 inches) covers about 100 sq ft per cu yd." },
            { question: "What is the best depth for mulch?", answer: "Fine mulch (compost, cocoa shell): 1–2 inches. Standard mulch (hardwood bark, cedar): 2–3 inches. Coarse mulch (pine bark nuggets, wood chips): 3–4 inches. Rubber mulch for playgrounds: 3–6 inches for proper fall protection. Never exceed 4 inches for organic mulch around plants." },
            { question: "How much does a yard of mulch weigh?", answer: "It depends on the type and moisture content: wood chips ~500 lbs, shredded bark ~600 lbs, pine bark ~450 lbs, pine straw ~300 lbs, rubber mulch ~1,200 lbs, decorative stone ~2,800 lbs. Wet mulch can weigh 30–50% more than dry." },
            { question: "How many bags of mulch in a cubic yard?", answer: "One cubic yard = 27 cu ft. For 2 cu ft bags: 27 ÷ 2 = 13.5 bags (buy 14). For 3 cu ft bags: 27 ÷ 3 = 9 bags. Most big-box stores sell 2 cu ft bags." },
            { question: "Is it better to buy mulch bagged or in bulk?", answer: "Bags are convenient for small jobs (under 3 cu yd) and fit in a car. Bulk is 40–60% cheaper per cu yd and better for large projects. Break-even is about 3 cu yd (40+ bags). Bulk requires driveway space and a delivery fee of $50–$100." },
            { question: "How often should mulch be replaced?", answer: "Organic mulch (bark, chips) decomposes and should be refreshed annually with 1–2 inches of new material. Fully replace every 2–3 years. Inorganic mulch (stone, rubber) is essentially permanent but may need occasional top-up as pieces shift or settle." },
            { question: "What type of mulch is best for flower beds?", answer: "Shredded hardwood bark is the best all-around choice — it stays in place, enriches soil as it decomposes, and looks neat. Cedar mulch is excellent if you want natural insect repellent properties. Avoid wood chips for annual flower beds (they tie up nitrogen as they decompose)." },
            { question: "Is mulch better than gravel or stone?", answer: "Mulch retains moisture and enriches soil — better for plant beds and gardens. Gravel/stone is better for pathways, drainage, and areas where you want low maintenance. Rubber mulch is best for playgrounds. Each has trade-offs: organic mulch needs replacing, stone doesn't but doesn't feed the soil." },
            { question: "How much does a bag of mulch weigh?", answer: "A standard 2 cu ft bag of organic mulch weighs 15–25 lbs depending on moisture content and type. Cedar and pine bark are lighter (~15–18 lbs). Hardwood bark and dyed mulch are heavier (~20–25 lbs). A 2 cu ft bag of rubber mulch weighs ~40 lbs." },
            { question: "Can I put new mulch over old mulch?", answer: "Yes — this is the standard practice for annual refreshing. Add 1–2 inches of new mulch on top. But if the total depth exceeds 4 inches, remove some old mulch first. Thick mulch can mat down, prevent water penetration, and harbor fungal growth. Never pile mulch against tree trunks ('volcano mulching')." },
        ],
    },
    "brick-calculator": {
        subtitle: "Calculate how many bricks and mortar bags you need for walls, patios, or walkways. Choose from 6 brick sizes, estimate pallets, and get total material cost.",
        explanation: {
            heading: "How to Calculate Bricks Needed",
            paragraphs: [
                "Standard modular bricks are 7⅝ × 2¼ × 3⅝ inches (actual) or 8 × 2⅔ × 4 inches (nominal, with mortar). The most common mortar joint is ⅜ inch. When calculating, add the mortar joint width to the brick dimensions to get the effective coverage per brick.",
                "For walls, divide the wall face area by the face area of one brick (including mortar). For patios laid flat, use the brick's length × width (without mortar for dry-laid, with mortar for mortared). Always add 5–10% for cuts and breakage.",
            ],
            highlight: "A 20×8 ft brick wall using standard modular bricks (8\" × 2.67\" nominal with mortar) = 160 sq ft ÷ 0.148 sq ft/brick = ~1,081 bricks. With 10% waste = ~1,189 bricks.",
        },
        contentHTML: `
<p>Bricks are one of the most durable and aesthetically appealing building materials in the <strong>United States</strong>. Whether you're constructing an exterior wall, building a chimney, creating a patio, or adding a brick walkway, accurately estimating the number of bricks you need prevents costly over-ordering and project delays.</p>
<p>Bricks are commonly made of fired clay or shale and are laid in courses (rows) held together by <strong>mortar</strong> — a mixture of cement, sand, and lime. The calculator above supports <strong>6 standard US brick sizes</strong>, estimates <strong>mortar bags</strong>, calculates <strong>pallets</strong>, and provides a <strong>total material cost</strong> including both bricks and mortar.</p>
<p>For CMU blocks, see our <a href="/construction-calculators/concrete-block-calculator">concrete block calculator</a>. Measure wall area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For mortar and footings, use our <a href="/construction-calculators/concrete-calculator">concrete calculator</a>.</p>

<h2>Brick Sizes and Coverage</h2>
<p>Brick dimensions in the US follow standard ASTM specifications. The "nominal" size includes the mortar joint (typically ⅜"). When estimating, always use the actual brick dimensions plus the mortar joint.</p>
<table>
<thead><tr><th>Brick Type</th><th>Actual Size (L×H)</th><th>Bricks per sq ft</th><th>Per Pallet</th><th>Pallet Weight</th></tr></thead>
<tbody>
<tr><td><strong>Modular</strong></td><td>7⅝" × 2¼"</td><td>6.86</td><td>~532</td><td>~2,200 lbs</td></tr>
<tr><td><strong>Queen</strong></td><td>7⅝" × 2¾"</td><td>5.76</td><td>~390</td><td>~2,100 lbs</td></tr>
<tr><td><strong>King</strong></td><td>9⅝" × 2⅝"</td><td>4.61</td><td>~360</td><td>~2,400 lbs</td></tr>
<tr><td><strong>Utility</strong></td><td>11⅝" × 3⅝"</td><td>3.00</td><td>~270</td><td>~2,300 lbs</td></tr>
<tr><td><strong>Engineer</strong></td><td>7⅝" × 2 13⁄16"</td><td>5.63</td><td>~410</td><td>~2,200 lbs</td></tr>
<tr><td><strong>Closure</strong></td><td>7⅝" × 3⅝"</td><td>4.50</td><td>~340</td><td>~2,100 lbs</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> "Bricks per sq ft" assumes a ⅜" mortar joint. Thicker joints (½") reduce the count per sq ft.</p>

<h2>Step-by-Step Brick Estimation</h2>
<h3>Step 1: Calculate the Wall or Area</h3>
<p>Measure the <strong>length and height</strong> of the wall (or length and width for patios). Multiply to get the total square footage. Subtract square footage of any windows, doors, or openings.</p>
<p><strong>Example:</strong> A wall 20 ft long × 8 ft high = 160 sq ft. Minus one 3×5 ft window = 145 sq ft.</p>

<h3>Step 2: Find Bricks per Square Foot</h3>
<p>Add the mortar joint to each brick dimension. Multiply to get the area of one brick (in square inches), then divide by 144 to convert to sq ft. Divide 1 by that number to find bricks per sq ft.</p>
<p><strong>Modular brick with ⅜" joint:</strong> (7.625 + 0.375) × (2.25 + 0.375) = 8 × 2.625 = 21 sq in ÷ 144 = 0.1458 sq ft → <strong>6.86 bricks per sq ft</strong></p>

<h3>Step 3: Calculate Total Bricks + Waste</h3>
<p>Multiply wall area × bricks per sq ft. Add <strong>10% for waste</strong> (cuts, breakage, transport damage). Add 15–20% if the project involves intricate patterns like herringbone or basket weave.</p>
<p><strong>Example:</strong> 145 sq ft × 6.86 = 995 bricks. With 10% waste: 995 × 1.10 = <strong>1,095 bricks</strong> = ~2 pallets (modular).</p>

<h2>Mortar Estimation</h2>
<p>Mortar usage depends on brick size and joint thickness. The two most common methods:</p>
<table>
<thead><tr><th>Method</th><th>Coverage per Bag</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>Pre-mixed mortar (80 lb bag)</strong></td><td>30–36 bricks</td><td>Homeowners, small projects</td></tr>
<tr><td><strong>Portland cement (94 lb bag + sand)</strong></td><td>100–142 bricks (varies by size)</td><td>Contractors, large projects</td></tr>
</tbody>
</table>
<p><strong>Pre-mixed bags:</strong> Divide total bricks by 35 to estimate bags. For 1,095 modular bricks: 1,095 ÷ 35 = <strong>32 bags</strong>.</p>
<p><strong>Site-mix (1:3 cement to sand):</strong> 1 bag cement per 142 modular bricks, 125 queen bricks, or 100 utility bricks. Requires about 1 cu yd of sand per 7 bags of cement.</p>

<h2>Ordering by the Pallet</h2>
<p>Bricks are sold individually, by the pallet, or in bulk truckloads. Ordering by the pallet is standard for most projects:</p>
<ul>
<li><strong>Modular:</strong> ~532 bricks/pallet (~2,200 lbs)</li>
<li><strong>Queen:</strong> ~390 bricks/pallet (~2,100 lbs)</li>
<li><strong>King:</strong> ~360 bricks/pallet (~2,400 lbs)</li>
</ul>
<p>Always round up to the next full pallet. You can return unopened pallets to most suppliers. A forklift is typically needed to move pallets on-site.</p>

<h2>2025 US Brick Cost Guide</h2>
<table>
<thead><tr><th>Brick Type</th><th>Cost per Brick</th><th>Cost per Pallet</th><th>Cost per sq ft (wall)</th></tr></thead>
<tbody>
<tr><td><strong>Standard Modular</strong></td><td>$0.50–$0.75</td><td>$265–$400</td><td>$3.40–$5.15</td></tr>
<tr><td><strong>Face Brick (colored)</strong></td><td>$0.75–$1.50</td><td>$400–$800</td><td>$5.15–$10.30</td></tr>
<tr><td><strong>Used / Reclaimed</strong></td><td>$0.50–$2.00</td><td>$265–$1,060</td><td>$3.40–$13.70</td></tr>
<tr><td><strong>Thin Brick Veneer</strong></td><td>$0.80–$2.50</td><td>Varies</td><td>$6–$18</td></tr>
<tr><td><strong>Fire Brick</strong></td><td>$1.50–$3.00</td><td>$500–$1,000</td><td>Varies</td></tr>
</tbody>
</table>
<p><strong>Mortar:</strong> Pre-mixed 80 lb bags cost $8–$15 each. For 1,000 bricks you'll need ~30 bags = <strong>$240–$450 in mortar</strong>.</p>
<p><strong>Total installed cost:</strong> Professional brick masonry in the US runs $10–$25 per sq ft installed, depending on brick type and project complexity.</p>

<h2>Common Brick Projects</h2>
<table>
<thead><tr><th>Project</th><th>Typical Size</th><th>Bricks (Modular)</th><th>Mortar (80 lb bags)</th><th>Material Cost</th></tr></thead>
<tbody>
<tr><td><strong>Garden wall (4 ft high)</strong></td><td>20 × 4 ft = 80 sq ft</td><td>~605</td><td>~18</td><td>$500–$800</td></tr>
<tr><td><strong>Single-story façade</strong></td><td>40 × 10 ft = 400 sq ft</td><td>~3,020</td><td>~87</td><td>$2,500–$4,200</td></tr>
<tr><td><strong>Fireplace surround</strong></td><td>~50 sq ft</td><td>~380</td><td>~11</td><td>$300–$570</td></tr>
<tr><td><strong>Patio (10×10 ft)</strong></td><td>100 sq ft (flat)</td><td>~470 (4.7/sq ft flat)</td><td>~14 (mortared)</td><td>$400–$750</td></tr>
<tr><td><strong>Mailbox column</strong></td><td>~25 sq ft exposed</td><td>~190</td><td>~6</td><td>$150–$280</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "How many bricks per square foot?", answer: "Standard modular bricks: 6.86 per sq ft (with ⅜\" mortar joint). Queen: 5.76. King: 4.61. Utility: 3.00. The exact count depends on brick dimensions and mortar joint thickness. A ½\" joint reduces brick count by ~5%." },
            { question: "How many bricks are on a pallet?", answer: "Modular: ~532 per pallet (~2,200 lbs). Queen: ~390 per pallet. King: ~360 per pallet. Utility: ~270 per pallet. Pallet counts vary by manufacturer. Always verify with your supplier before ordering." },
            { question: "How much mortar do I need per 1,000 bricks?", answer: "For pre-mixed mortar (80 lb bags): ~30 bags per 1,000 modular bricks. For site-mixed (Portland cement + sand): ~7 bags of cement + 1 cu yd of sand per 1,000 modular bricks. Larger bricks and thicker joints require proportionally more mortar." },
            { question: "How much does brick cost per square foot?", answer: "Standard modular brick: $3.40–$5.15 per sq ft (materials only). Face brick: $5.15–$10.30. Add mortar at $2–$4 per sq ft. Professional installation: $10–$25 per sq ft total. A 400 sq ft single-story façade costs $4,000–$10,000 installed." },
            { question: "What's the standard mortar joint size?", answer: "The standard mortar joint in the US is ⅜ inch (3/8\"). This is the most common for residential construction. Commercial projects sometimes use ½\" joints. Raked, flush, concave, and V-shaped joints are the most common profiles." },
            { question: "How many bricks do I need for a wall?", answer: "Multiply the wall's length × height to get sq ft. Then multiply by 6.86 (for modular bricks) to get total bricks. Add 10% for waste. Example: 20×8 ft wall = 160 sq ft × 6.86 = 1,098 + 10% waste = ~1,207 bricks (about 2.3 pallets)." },
            { question: "What type of mortar should I use for bricks?", answer: "Type N: the most common for residential above-grade walls and veneers (medium strength). Type S: for below-grade, retaining walls, and exterior paving (high strength). Type M: for foundations, heavy loads, and below-grade structural (highest strength). Type O: interior, non-load-bearing only." },
            { question: "How much does a pallet of bricks weigh?", answer: "Most pallets weigh 2,000–2,500 lbs. A standard modular brick pallet (~532 bricks) weighs approximately 2,200 lbs. You'll need a forklift or equipment to move pallets. Verify delivery access before ordering — many suppliers charge $50–$150 for forklift delivery." },
            { question: "Can I lay bricks myself or do I need a mason?", answer: "Garden walls under 4 ft, patios, walkways, and mailbox columns are reasonable DIY projects. Anything structural (load-bearing walls, chimneys above 1 story, foundations) should be done by a licensed mason. DIY saves 50–60% but takes 3–5× longer." },
            { question: "How do I account for windows and doors in a brick wall?", answer: "Calculate the total wall area (length × height), then subtract the area of each opening (window or door width × height). For example: 40×10 ft wall = 400 sq ft minus two 3×5 ft windows = 400 - 30 = 370 sq ft of brick needed." },
        ],
    },
    "fence-calculator": {
        subtitle: "Calculate fence materials — posts, rails, pickets, panels, concrete, and screws. Choose from 7 fence styles with auto-presets and get a complete cost estimate.",
        explanation: {
            heading: "How to Calculate Fence Materials",
            paragraphs: [
                "Fence material calculations start with the total fence length. Divide by post spacing (typically 8 feet for wood fences, 10 feet for chain-link) and add 1 for the end post. Each section between posts needs horizontal rails — 2 rails for fences under 5 feet, 3 rails for taller fences.",
                "For wood picket fences, calculate the number of pickets by dividing fence length by the picket width (typically 3.5–5.5 inches). For pre-built panels (typically 6×8 or 4×8 feet), one panel fills each section. Don't forget concrete for post holes — plan 2 bags of 50 lb concrete per post.",
            ],
            highlight: "A 100 ft wood privacy fence with 6 ft height and 8 ft spacing = 14 posts, 39 rails (3 per section), ~240 pickets (5.5\" wide, +10% waste), and 28 bags of concrete.",
        },
        contentHTML: `
<p>Building a fence is one of the most common DIY and contractor projects for <strong>US homeowners</strong>. Whether you're installing a privacy fence, a decorative picket fence, or a ranch-style rail fence, accurate material estimation prevents over-ordering and costly return trips to the lumberyard.</p>
<p>The calculator above supports <strong>7 fence styles</strong> with auto-presets for picket width, spacing, and rails per section. It estimates <strong>posts, rails, pickets/panels, concrete, screws, and gates</strong> with a <strong>complete material cost breakdown</strong>.</p>
<p>Estimate lumber with our <a href="/construction-calculators/lumber-calculator">lumber calculator</a>. For post footings, use our <a href="/construction-calculators/concrete-calculator">concrete calculator</a>. Calculate area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>Fence Styles and Presets</h2>
<table>
<thead><tr><th>Style</th><th>Picket Width</th><th>Spacing</th><th>Rails/Section</th><th>Description</th></tr></thead>
<tbody>
<tr><td><strong>Privacy (solid board)</strong></td><td>5.5"</td><td>0" (no gap)</td><td>3</td><td>Boards side-by-side, rails on one side</td></tr>
<tr><td><strong>Shadowbox (board-on-board)</strong></td><td>5.5"</td><td>−1" (overlap)</td><td>3</td><td>Boards on both sides, offset — looks same from both sides</td></tr>
<tr><td><strong>Stockade</strong></td><td>2.5"</td><td>0"</td><td>3</td><td>Narrow pointed-top pickets, no gaps</td></tr>
<tr><td><strong>Picket (spaced)</strong></td><td>3.5"</td><td>3.5"</td><td>2</td><td>Classic American picket fence with equal gaps</td></tr>
<tr><td><strong>Rail (no pickets)</strong></td><td>—</td><td>—</td><td>3</td><td>Horizontal rails only — for ranch/boundary</td></tr>
<tr><td><strong>Pre-built Panel</strong></td><td>—</td><td>—</td><td>—</td><td>6×8 ft panels, 1 per section</td></tr>
<tr><td><strong>Chain Link</strong></td><td>—</td><td>—</td><td>2</td><td>Top + bottom rails, mesh fabric sold by linear foot</td></tr>
</tbody>
</table>

<h2>Step-by-Step Fence Material Estimation</h2>
<h3>Step 1: Calculate Posts</h3>
<p>Divide the total fence length by <strong>post spacing</strong> (8 ft standard for wood) and round up. Add 1 for the end post. Add 2 extra posts per gate (heavier gate posts, often 6×6).</p>
<p><strong>Formula:</strong> Posts = ⌈Length ÷ Spacing⌉ + 1 + (Gates × 2)</p>
<p><strong>Example:</strong> 100 ft fence ÷ 8 ft spacing = 12.5 → 13 sections → 14 posts + 2 gate posts = <strong>16 posts</strong></p>

<h3>Step 2: Calculate Rails</h3>
<p>Multiply the number of sections by rails per section. Standard: 2 rails for fences ≤ 4 ft, 3 rails for 5–8 ft, 4+ rails for 10–12 ft.</p>
<p><strong>Formula:</strong> Rails = Sections × Rails per Section</p>
<p><strong>Example:</strong> 13 sections × 3 rails = <strong>39 rails</strong></p>

<h3>Step 3: Calculate Pickets</h3>
<p>Convert fence length to inches. Divide by (picket width + spacing). Add <strong>10% for waste</strong> (cuts, splits, defects).</p>
<p><strong>Formula:</strong> Pickets = ⌈(Length × 12) ÷ (Picket Width + Spacing)⌉ × 1.10</p>
<p><strong>Example (privacy):</strong> (100 × 12) ÷ (5.5 + 0) = 218 × 1.10 = <strong>240 pickets</strong></p>
<p><strong>Shadowbox:</strong> Double the picket count because boards are on both sides.</p>

<h3>Step 4: Hardware and Concrete</h3>
<ul>
<li><strong>Concrete:</strong> 2 bags (50 lb) per post for a 2 ft deep, 10" diameter hole</li>
<li><strong>Screws:</strong> 2 exterior screws per picket per rail contact point (e.g. 3 rails = 6 screws per picket)</li>
<li><strong>Post caps:</strong> 1 per post (optional, decorative)</li>
</ul>

<h2>Lumber Types for Wood Fences</h2>
<table>
<thead><tr><th>Component</th><th>Lumber Size</th><th>Material Options</th><th>Cost Each (2025)</th></tr></thead>
<tbody>
<tr><td><strong>Posts</strong></td><td>4×4 (8 ft for 6 ft fence)</td><td>Pressure-treated, cedar, redwood</td><td>$8–$20</td></tr>
<tr><td><strong>Gate Posts</strong></td><td>6×6 (8 ft)</td><td>Pressure-treated, cedar</td><td>$18–$35</td></tr>
<tr><td><strong>Rails</strong></td><td>2×4 (8 ft)</td><td>Pressure-treated, cedar</td><td>$4–$10</td></tr>
<tr><td><strong>Pickets (privacy)</strong></td><td>1×6 (6 ft dog ear)</td><td>Pressure-treated, cedar</td><td>$2–$5</td></tr>
<tr><td><strong>Pickets (stockade)</strong></td><td>¾"×2½" (5–6 ft)</td><td>Pressure-treated, cedar</td><td>$1.50–$3</td></tr>
</tbody>
</table>
<p><strong>Wood choice:</strong> Pressure-treated pine is cheapest and lasts 15–20 years. Cedar is naturally rot-resistant and lasts 20–25 years but costs 30–50% more. Western red cedar is premium. Redwood is the most expensive but most durable (30+ years).</p>

<h2>2025 US Fence Cost Guide</h2>
<table>
<thead><tr><th>Fence Type</th><th>Material Cost per ft</th><th>Installed Cost per ft</th><th>100 ft Material</th><th>100 ft Installed</th></tr></thead>
<tbody>
<tr><td><strong>Wood Privacy (PT)</strong></td><td>$12–$18</td><td>$25–$35</td><td>$1,200–$1,800</td><td>$2,500–$3,500</td></tr>
<tr><td><strong>Wood Privacy (Cedar)</strong></td><td>$18–$28</td><td>$30–$45</td><td>$1,800–$2,800</td><td>$3,000–$4,500</td></tr>
<tr><td><strong>Shadowbox</strong></td><td>$18–$30</td><td>$30–$50</td><td>$1,800–$3,000</td><td>$3,000–$5,000</td></tr>
<tr><td><strong>Picket</strong></td><td>$8–$15</td><td>$18–$25</td><td>$800–$1,500</td><td>$1,800–$2,500</td></tr>
<tr><td><strong>Chain Link (4 ft)</strong></td><td>$7–$12</td><td>$15–$20</td><td>$700–$1,200</td><td>$1,500–$2,000</td></tr>
<tr><td><strong>Split Rail</strong></td><td>$6–$12</td><td>$12–$18</td><td>$600–$1,200</td><td>$1,200–$1,800</td></tr>
</tbody>
</table>
<p><strong>Gates:</strong> Add $75–$150 per walk gate and $200–$500 per drive (double) gate, plus $50–$100 in hardware per gate. Most residential fences have 1–2 gates.</p>
<p><strong>Labor:</strong> Professional fence installation is typically $10–$20 per linear foot for labor alone, or 50–60% of total installed cost.</p>
`,
        faq: [
            { question: "How far apart should fence posts be?", answer: "8 feet on center is standard for wood fences using standard lumber lengths. Chain-link: 10 feet. Vinyl: 6–8 feet depending on panel size. In windy areas or for extra strength, reduce to 6 feet. Never exceed 10 feet for wood fences — rails will sag." },
            { question: "How deep should fence posts be?", answer: "The rule is ⅓ of the total post length underground. For a 6 ft fence with 8 ft posts, set posts 2–2.5 ft deep. For a 4 ft fence: 2 ft deep. In cold climates, posts must extend below the frost line (36–48 inches in northern states). Always set posts in concrete." },
            { question: "How long should fence posts be?", answer: "Fence height + ⅓ of total post length underground. For a 6 ft fence: 8 ft posts (6 ft above + 2 ft below). For an 8 ft fence: 10–11 ft posts. For a 4 ft fence: 6 ft posts. Gate posts should be 6×6 instead of 4×4 for extra strength." },
            { question: "What is a linear foot of fence?", answer: "A linear foot is one foot of fence length, measured horizontally along the fence line. A 100 ft perimeter fence = 100 linear feet. Fence pricing is quoted per linear foot. To find the perimeter, add all sides of the area you're enclosing." },
            { question: "How many pickets do I need per foot of fence?", answer: "Privacy fence (5.5\" boards, no gap): ~2.2 pickets per foot. Stockade (2.5\" pickets, no gap): ~4.8 per foot. Picket fence (3.5\" pickets, 3.5\" gap): ~1.7 per foot. Shadowbox: double the privacy count (boards on both sides). Always add 10% for waste." },
            { question: "How much concrete per fence post?", answer: "Plan 2 bags (50 lb) of fast-setting concrete per post for a standard 10\" diameter × 24\" deep hole with a 4×4 post. Deeper holes (36\") need 3 bags each. For 6×6 gate posts in 12\" holes, use 3–4 bags each. Fast-setting concrete can be poured dry into the hole." },
            { question: "What's the best wood for a fence?", answer: "Pressure-treated pine: cheapest, lasts 15–20 years, requires staining. Western red cedar: naturally rot-resistant, 20–25 years, beautiful grain. Redwood: premium, 30+ years, expensive. For budget fences, PT pine is the standard. For appearance and longevity without chemical treatment, cedar." },
            { question: "What is the standard fence height?", answer: "Privacy fence: 6 ft standard (some areas allow up to 8 ft in backyards). Decorative/picket: 3–4 ft. Front yard: 3–4 ft max (most municipalities). Pool fence: 4 ft minimum (most states require 48\" with self-closing gate). Check local codes — many areas have strict height limits." },
            { question: "Do I need a permit for a fence?", answer: "Most municipalities require a fence permit ($50–$200). Contact your local building department before starting. You also need to check property lines (consider a survey), HOA restrictions, utility easements, and setback requirements (usually 6\"–1 ft from property line). Call 811 before digging." },
            { question: "How much does it cost to install a fence?", answer: "DIY wood privacy: $12–$18 per linear foot (materials only). Professional installation: $25–$45/ft total. A 150 ft backyard fence with 1 gate: DIY = $2,000–$3,000, installed = $4,000–$7,000. Chain link is cheapest ($15–$20/ft installed), vinyl most expensive ($35–$55/ft installed)." },
        ],
    },
    "deck-calculator": {
        subtitle: "Calculate decking materials — boards, joists, screws, and support posts needed for your deck. Enter dimensions and board specifications for a complete material list.",
        explanation: {
            heading: "How to Calculate Deck Materials",
            paragraphs: [
                "Deck board quantity depends on the board width and deck dimensions. Standard 5/4×6 deck boards have a 5.5-inch face width. Divide the deck width by the board face width to get the number of boards, then each board runs the full deck length (or is spliced over a joist for longer spans).",
                "Joists are typically spaced 16 inches on center (12 inches for composite decking). Support posts go under beams, spaced no more than 6–8 feet apart in both directions. Plan for 2 deck screws per board per joist crossing — that adds up quickly on a large deck.",
            ],
            highlight: "A 12×16 ft deck using 5.5\" boards = 35 boards × 12 ft each. With 16\" OC joists = 10 joists. Support posts: 2×3 = 6 posts. Deck screws: 35 × 10 × 2 = 700 screws.",
        },
        faq: [
            { question: "How much does it cost to build a deck?", answer: "Pressure-treated wood: $15–$25 per sq ft (materials only), $25–$40 installed. Composite: $25–$45 per sq ft materials, $40–$60 installed. A 12×16 (192 sq ft) deck costs roughly $3,000–$5,000 in materials for wood, $5,000–$9,000 for composite." },
            { question: "What joist spacing should I use?", answer: "16 inches on center is standard for wood decking. Composite decking manufacturers often require 12-inch spacing, especially for diagonal or picture-frame patterns. Always check the manufacturer's installation guide for specific requirements." },
        ],
    },
    "staircase-calculator": {
        subtitle: "Calculate staircase dimensions — number of risers, riser height, tread depth, and stringer length from total rise and desired specifications.",
        explanation: {
            heading: "How to Calculate Staircase Dimensions",
            paragraphs: [
                "Building codes require risers between 4 and 7¾ inches (most common: 7–7¾ inches) and treads with a minimum 10-inch depth. The relationship between riser and tread should satisfy the formula: 2 × Riser + Tread = 24–25 inches for comfortable stairs.",
                "Start by dividing the total rise (floor-to-floor height in inches) by your target riser height (7.5 inches is ideal for comfort). Round to the nearest whole number to get the number of risers. Then divide the total rise by the number of risers to get the exact riser height. The number of treads is always one less than the number of risers.",
            ],
            highlight: "A 9 ft (108 inch) floor-to-floor rise ÷ 7.5\" target = 14.4 → 14 risers. Actual riser = 108 ÷ 14 = 7.71 inches. Treads = 13 × 10.5\" = 136.5\" (11.4 ft) total run.",
        },
        faq: [
            { question: "What is the ideal riser height?", answer: "7 to 7¾ inches is ideal for interior residential stairs. Building codes allow 4\" to 7¾\" risers. Commercial buildings typically use 7\" risers. Exterior steps can be slightly lower (6–7\") for comfort. All risers in a staircase must be uniform — variation over ⅜\" is a code violation." },
            { question: "How many stringers do I need?", answer: "2 stringers for stairs up to 36 inches wide, 3 stringers for stairs 36–48 inches wide. Over 48 inches, use 4 stringers. Stringers are typically cut from 2×12 lumber. The stringer length equals √(rise² + run²)." },
        ],
    },
    "lumber-calculator": {
        subtitle: "Calculate board feet, weight, and cost for any lumber purchase. Choose from 11 wood species with density data and 8 dimensional lumber presets.",
        explanation: {
            heading: "How to Calculate Board Feet",
            paragraphs: [
                "A board foot is the standard unit for rough lumber measurement, equal to a piece 1 inch thick × 12 inches wide × 12 inches long (144 cubic inches). The formula is: Board Feet = (Length in ft × Width in inches × Thickness in inches) ÷ 12.",
                "Lumber is sold in nominal dimensions (2×4, 2×6, etc.) which are larger than actual dimensions. A '2×4' actually measures 1.5 × 3.5 inches. For board foot calculations, use the actual dimensions for dressed/surfaced lumber, or nominal dimensions for rough-sawn lumber as sold by sawmills.",
            ],
            highlight: "10 boards of 8 ft × 6\" × 1\" = 10 × (8 × 6 × 1 ÷ 12) = 10 × 4 = 40 board feet. At $5/BF = $200 total.",
        },
        contentHTML: `
<p>Lumber is the backbone of <strong>US construction and woodworking</strong>. Whether you're framing a house, building a deck, crafting furniture, or finishing a trim project, accurately calculating board footage, weight, and cost is essential to avoid over-ordering and wasted material.</p>
<p>The calculator above includes <strong>11 wood species</strong> with density data (for weight estimation), <strong>8 dimensional lumber presets</strong> (2×4 through 4×4 with actual sizes), and a <strong>weight output</strong> so you know how much your lumber order weighs before delivery.</p>
<p>For sheathing, see our <a href="/construction-calculators/plywood-calculator">plywood calculator</a>. For fencing, try our <a href="/construction-calculators/fence-calculator">fence calculator</a>. Measure area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>Wood Species Density Chart</h2>
<p>Wood density determines weight and hardness. Density values below are for air-dried wood (~12% moisture content). Green (freshly cut) lumber can weigh <strong>50–100% more</strong> due to moisture.</p>
<table>
<thead><tr><th>Species</th><th>Type</th><th>Density (lbs/cu ft)</th><th>8 ft 2×4 Weight</th><th>Cost per BF</th></tr></thead>
<tbody>
<tr><td><strong>SPF (Spruce-Pine-Fir)</strong></td><td>Softwood</td><td>28</td><td>~9 lbs</td><td>$2–$4</td></tr>
<tr><td><strong>Pressure-Treated Pine</strong></td><td>Softwood</td><td>35</td><td>~11 lbs</td><td>$3–$5</td></tr>
<tr><td><strong>Douglas Fir</strong></td><td>Softwood</td><td>34</td><td>~11 lbs</td><td>$3–$5</td></tr>
<tr><td><strong>Western Red Cedar</strong></td><td>Softwood</td><td>23</td><td>~7 lbs</td><td>$5–$8</td></tr>
<tr><td><strong>Redwood</strong></td><td>Softwood</td><td>28</td><td>~9 lbs</td><td>$6–$10</td></tr>
<tr><td><strong>Poplar</strong></td><td>Hardwood</td><td>29</td><td>~9 lbs</td><td>$3–$5</td></tr>
<tr><td><strong>Red Oak</strong></td><td>Hardwood</td><td>44</td><td>~14 lbs</td><td>$5–$8</td></tr>
<tr><td><strong>White Oak</strong></td><td>Hardwood</td><td>47</td><td>~15 lbs</td><td>$6–$9</td></tr>
<tr><td><strong>Hard Maple</strong></td><td>Hardwood</td><td>44</td><td>~14 lbs</td><td>$5–$8</td></tr>
<tr><td><strong>Black Walnut</strong></td><td>Hardwood</td><td>38</td><td>~12 lbs</td><td>$8–$15</td></tr>
<tr><td><strong>Cherry</strong></td><td>Hardwood</td><td>35</td><td>~11 lbs</td><td>$6–$10</td></tr>
</tbody>
</table>

<h2>Step-by-Step Board Foot Calculation</h2>
<h3>Step 1: Measure the Board</h3>
<p>Measure <strong>length</strong> in feet, <strong>width</strong> in inches, and <strong>thickness</strong> in inches. For dimensional lumber (2×4, 2×6, etc.), use the nominal dimensions for board foot pricing — lumberyards price by nominal size.</p>

<h3>Step 2: Calculate Board Feet</h3>
<p><strong>Formula:</strong> Board Feet = (Length ft × Width in × Thickness in) ÷ 12</p>
<p><strong>Example:</strong> An 8 ft × 6" × 1" board: (8 × 6 × 1) ÷ 12 = <strong>4 board feet</strong></p>
<p><strong>Example:</strong> A 10 ft 2×6: (10 × 6 × 2) ÷ 12 = <strong>10 board feet</strong></p>

<h3>Step 3: Estimate Weight</h3>
<p>Convert board feet to cubic feet (÷ 12), then multiply by the wood's density (lbs/cu ft).</p>
<p><strong>Example:</strong> 4 BF of red oak: 4 ÷ 12 = 0.333 cu ft × 44 lbs/cu ft = <strong>14.7 lbs</strong></p>

<h2>Dimensional Lumber: Nominal vs. Actual Sizes</h2>
<table>
<thead><tr><th>Nominal</th><th>Actual Size</th><th>Board Feet per 8 ft</th><th>Weight (SPF, 8 ft)</th></tr></thead>
<tbody>
<tr><td><strong>1×4</strong></td><td>¾" × 3½"</td><td>2.67 BF</td><td>~4.4 lbs</td></tr>
<tr><td><strong>1×6</strong></td><td>¾" × 5½"</td><td>4.00 BF</td><td>~6.2 lbs</td></tr>
<tr><td><strong>1×8</strong></td><td>¾" × 7¼"</td><td>5.33 BF</td><td>~8.2 lbs</td></tr>
<tr><td><strong>2×4</strong></td><td>1½" × 3½"</td><td>5.33 BF</td><td>~9.0 lbs</td></tr>
<tr><td><strong>2×6</strong></td><td>1½" × 5½"</td><td>8.00 BF</td><td>~13.1 lbs</td></tr>
<tr><td><strong>2×8</strong></td><td>1½" × 7¼"</td><td>10.67 BF</td><td>~17.3 lbs</td></tr>
<tr><td><strong>2×10</strong></td><td>1½" × 9¼"</td><td>13.33 BF</td><td>~22.1 lbs</td></tr>
<tr><td><strong>2×12</strong></td><td>1½" × 11¼"</td><td>16.00 BF</td><td>~26.8 lbs</td></tr>
<tr><td><strong>4×4</strong></td><td>3½" × 3½"</td><td>10.67 BF</td><td>~18.2 lbs</td></tr>
</tbody>
</table>

<h2>2025 US Lumber Cost Guide</h2>
<table>
<thead><tr><th>Lumber Type</th><th>Cost per BF</th><th>8 ft 2×4 Price</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>SPF (#2 grade)</strong></td><td>$2–$4</td><td>$3–$6</td><td>Framing, general construction</td></tr>
<tr><td><strong>Pressure-Treated</strong></td><td>$3–$5</td><td>$5–$9</td><td>Decks, fences, ground contact</td></tr>
<tr><td><strong>Douglas Fir</strong></td><td>$3–$5</td><td>$5–$8</td><td>Structural, beams, posts</td></tr>
<tr><td><strong>Cedar (WRC)</strong></td><td>$5–$8</td><td>$8–$14</td><td>Decks, siding, outdoor furniture</td></tr>
<tr><td><strong>Red Oak</strong></td><td>$5–$8</td><td>$10–$16</td><td>Furniture, cabinets, flooring</td></tr>
<tr><td><strong>Black Walnut</strong></td><td>$8–$15</td><td>$16–$30</td><td>Fine furniture, cutting boards</td></tr>
<tr><td><strong>Cherry</strong></td><td>$6–$10</td><td>$12–$20</td><td>Furniture, trim, cabinetry</td></tr>
</tbody>
</table>
<p><strong>Lumber grading:</strong> #1 (select/premium) costs 20–50% more than #2 (standard). FAS (First and Seconds) is the top hardwood grade. Common #1 is standard for cabinet-grade hardwood.</p>

<h2>Lumber Buying Tips</h2>
<ul>
<li><strong>Buy 10–15% extra</strong> for waste, defects, and miscuts</li>
<li><strong>Kiln-dried (KD)</strong> lumber is more stable than green; look for "KD" or "HT" (heat-treated) stamps</li>
<li><strong>Board foot pricing</strong> is standard for hardwoods and rough-sawn lumber; dimensional softwood is usually priced per piece</li>
<li><strong>Check for straight boards</strong> at the store — sight down the length for twist, bow, and warp</li>
<li><strong>Bulk discounts</strong> are common at lumberyards (not big-box stores) for orders over 100 BF</li>
</ul>
`,
        faq: [
            { question: "What is a board foot?", answer: "A board foot (BF) is the standard unit of lumber measurement: 1 inch thick × 12 inches wide × 12 inches long = 144 cubic inches. Formula: BF = (Length ft × Width in × Thickness in) ÷ 12. An 8 ft 2×6 = (8 × 6 × 2) ÷ 12 = 8 board feet." },
            { question: "What is the difference between nominal and actual lumber dimensions?", answer: "Nominal is the rough-cut size; actual is after drying and planing. 2×4 nominal = 1.5×3.5 actual. 2×6 = 1.5×5.5. 2×8 = 1.5×7.25. 2×10 = 1.5×9.25. 2×12 = 1.5×11.25. 4×4 = 3.5×3.5. 1x boards lose ¼\" in thickness." },
            { question: "How much does lumber weigh?", answer: "It depends on the species and moisture content. An 8 ft SPF 2×4 weighs ~9 lbs (air-dried). Douglas Fir: ~11 lbs. Red Oak: ~14 lbs. Western Red Cedar: ~7 lbs. Green (fresh-cut) lumber can weigh 50–100% more due to water content." },
            { question: "How much does lumber cost per board foot?", answer: "SPF/pine: $2–$4/BF. Pressure-treated: $3–$5/BF. Cedar: $5–$8/BF. Oak: $5–$8/BF. Walnut: $8–$15/BF. Cherry: $6–$10/BF. Prices vary by region, grade, moisture content, and market conditions. Hardwoods are priced per BF; softwood is often priced per piece." },
            { question: "How do I convert board feet to cubic feet?", answer: "Divide board feet by 12. Example: 48 board feet ÷ 12 = 4 cubic feet. This is because 1 board foot = 1/12 of a cubic foot (1\" thick × 12\" × 12\" = 144 cu in, while 1 cu ft = 1,728 cu in; 144/1,728 = 1/12)." },
            { question: "What lumber grade should I use?", answer: "Construction framing: #2 or better (SPF, Doug Fir). Decks/porches: #1 or premium pressure-treated. Furniture: FAS (First and Seconds) or Select hardwood. Trim/molding: Clear or #1 common. The grade affects appearance (knots, defects) and structural rating." },
            { question: "What's the best wood for outdoor projects?", answer: "Pressure-treated pine: cheapest, lasts 15–20 years. Western Red Cedar: naturally rot-resistant, 20+ years, no chemicals. Redwood: premium, 30+ years. Ipe (Brazilian hardwood): 40+ years, extremely durable but very expensive ($15–$25/BF). All outdoor wood should be sealed or stained." },
            { question: "How much weight can my truck carry?", answer: "A standard ½-ton pickup (F-150, Silverado) has a payload of 1,500–2,000 lbs. A typical load of 30 8-ft 2×4s weighs ~270 lbs. But 30 8-ft 2×12s weigh ~800 lbs. Hardwood is heavier — 20 8-ft red oak 2×4s weigh ~280 lbs. Always check your truck's payload rating." },
            { question: "What does 'S4S' mean on lumber?", answer: "S4S = Surfaced 4 Sides (planed smooth on all faces and edges). S2S = Surfaced 2 Sides (faces planed, edges rough). Rough-sawn = no planing (full nominal thickness). S4S is standard at big-box stores. Rough-sawn is common at sawmills and hardwood dealers." },
            { question: "How much lumber do I need for a 2,000 sq ft house?", answer: "A typical wood-frame house uses 6,000–10,000 board feet of lumber per 1,000 sq ft. A 2,000 sq ft house: ~12,000–20,000 BF total (framing, sheathing, trim). That's roughly $25,000–$50,000 in lumber at 2025 prices, or 15–20% of total construction cost." },
        ],
    },
    "insulation-calculator": {
        subtitle: "Calculate insulation for walls, attics, and floors. Get rolls/batts for fiberglass or bags for blown-in cellulose based on area and R-value.",
        explanation: {
            heading: "How to Calculate Insulation Needs",
            paragraphs: [
                "Insulation is sized to fit between standard framing. Batt insulation for 2×4 walls (R-13) comes in rolls covering approximately 40 sq ft. For 2×6 walls (R-19), coverage is about 48 sq ft per roll. Attic insulation (R-30 to R-38) has lower coverage per roll due to greater thickness.",
                "Blown-in cellulose insulation is sold in bags, with each bag covering roughly 40 sq ft at R-13 depth. It's ideal for attics and retrofitting existing walls. For attics, the recommended R-value is R-38 to R-49 in most US climate zones.",
            ],
            highlight: "A 40×8 ft wall = 320 sq ft. With R-13 batt insulation (40 sq ft/roll) = 8 rolls. For blown-in cellulose = 8 bags. Attic: same area at R-38 needs about 10 rolls or 13 bags.",
        },
        faq: [
            { question: "What R-value do I need?", answer: "Climate dependent. Zone 1-2 (hot): walls R-13, attic R-30. Zone 3-4 (moderate): walls R-13–R-15, attic R-38. Zone 5-7 (cold): walls R-19–R-21, attic R-49. Check DOE recommendations for your specific zone." },
            { question: "Batt vs. blown-in: which is better?", answer: "Batt is easier to DIY and better for open walls during new construction. Blown-in is better for retrofitting existing walls (drilled holes), irregular spaces, and attics. Blown-in typically achieves better coverage in attics due to fewer gaps." },
        ],
    },
    "carpet-calculator": {
        subtitle: "Calculate carpet, padding, and installation cost for any room. Choose from 6 carpet types with pricing, roll width, and seam estimation.",
        explanation: {
            heading: "How to Calculate Carpet Needs",
            paragraphs: [
                "Carpet is sold by the square yard (9 sq ft). To calculate: measure the room length and width in feet, multiply for square footage, add waste factor (10% minimum), then divide by 9 to convert to square yards. Carpet comes in standard widths (12 ft or 15 ft), so seam placement may require additional material.",
                "Professional installers always add 10–15% waste for seaming, pattern matching, and fitting around obstacles. For patterned carpet, add 15–20% because patterns must align at seams. Always buy from the same dye lot to ensure color consistency.",
            ],
            highlight: "A 12×10 ft room = 120 sq ft. With 10% waste = 132 sq ft ÷ 9 = 14.7 sq yd. At $30/sq yd carpet + $4/sq yd pad + $1/sq ft labor = $630 total.",
        },
        contentHTML: `
<p>Carpet remains one of the most popular <strong>US flooring choices</strong>, installed in an estimated 50% of American homes. It offers warmth, comfort, sound insulation, and a wide range of styles and price points. Accurately estimating carpet, padding, and installation costs is essential for budgeting any flooring project.</p>
<p>The calculator above supports <strong>6 carpet types</strong> with auto-filled pricing, <strong>padding cost</strong>, <strong>labor cost</strong>, roll width selection (12 ft or 15 ft), and <strong>seam estimation</strong> — giving you a complete cost breakdown before visiting the store.</p>
<p>Convert to square yards with our <a href="/construction-calculators/square-yards-calculator">square yards calculator</a>. Measure room area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For other flooring types, see our <a href="/construction-calculators/flooring-calculator">flooring calculator</a>.</p>

<h2>Carpet Types Comparison</h2>
<table>
<thead><tr><th>Type</th><th>Fiber</th><th>Pile Style</th><th>Durability</th><th>Cost/sq yd</th></tr></thead>
<tbody>
<tr><td><strong>Polyester</strong></td><td>Synthetic</td><td>Cut pile, plush</td><td>3–5 years</td><td>$10–$25</td></tr>
<tr><td><strong>Nylon</strong></td><td>Synthetic</td><td>Cut pile, textured</td><td>10–15 years</td><td>$20–$45</td></tr>
<tr><td><strong>Olefin (Polypropylene)</strong></td><td>Synthetic</td><td>Loop, Berber</td><td>5–8 years</td><td>$12–$25</td></tr>
<tr><td><strong>Triexta (SmartStrand)</strong></td><td>Synthetic</td><td>Cut pile, textured</td><td>10–15 years</td><td>$25–$50</td></tr>
<tr><td><strong>Wool</strong></td><td>Natural</td><td>Cut or loop</td><td>15–20+ years</td><td>$50–$100+</td></tr>
<tr><td><strong>Berber (loop pile)</strong></td><td>Olefin/Nylon</td><td>Level loop</td><td>10–15 years</td><td>$15–$35</td></tr>
</tbody>
</table>
<p><strong>Best value:</strong> Nylon is the most popular US carpet fiber — it combines durability, stain resistance, and reasonable cost. Triexta (Mohawk SmartStrand) is the newest option, offering built-in stain resistance without chemical treatments.</p>

<h2>Step-by-Step Carpet Estimation</h2>
<h3>Step 1: Measure the Room</h3>
<p>Measure <strong>wall-to-wall</strong> (not baseboard-to-baseboard) since carpet goes under the baseboard. Measure in feet. For complex rooms, break into rectangles and add them together.</p>
<p><strong>Pro tip:</strong> Measure at the widest point of each dimension — walls aren't always perfectly straight.</p>

<h3>Step 2: Calculate Square Yards</h3>
<p>Multiply length × width for <strong>square feet</strong>. Add waste (10–20%). Divide by 9 to get <strong>square yards</strong>.</p>
<p><strong>Example:</strong> 15 ft × 12 ft = 180 sq ft × 1.10 = 198 sq ft ÷ 9 = <strong>22 sq yd</strong></p>

<h3>Step 3: Estimate Total Cost</h3>
<p>Add carpet cost + padding cost + labor cost:</p>
<ul>
<li><strong>Carpet:</strong> 22 sq yd × $30/sq yd = $660</li>
<li><strong>Padding:</strong> 22 sq yd × $4/sq yd = $88</li>
<li><strong>Labor:</strong> 198 sq ft × $1/sq ft = $198</li>
<li><strong>Total: $946</strong></li>
</ul>

<h2>Seams and Pattern Matching</h2>
<p>Carpet comes in <strong>12 ft</strong> (standard) or <strong>15 ft</strong> (wide) rolls. If your room is wider than the roll width, you'll need a seam:</p>
<ul>
<li><strong>Room ≤ 12 ft wide:</strong> No seam needed with standard roll</li>
<li><strong>Room 13–15 ft wide:</strong> Choose 15 ft roll (no seam) or accept one seam with 12 ft roll</li>
<li><strong>Room 16–24 ft wide:</strong> One seam minimum with either roll width</li>
</ul>
<p><strong>Seam placement tips:</strong> Place seams in low-traffic areas, never in doorways. Seams should run parallel to the primary light source. With patterned carpet, add 15–20% waste for pattern matching at seams.</p>
<p><strong>Nap direction:</strong> All carpet pieces must run in the same nap direction — different directions create visible color differences at seams. Mark the nap direction before cutting.</p>

<h2>Carpet Padding Guide</h2>
<table>
<thead><tr><th>Padding Type</th><th>Thickness</th><th>Density</th><th>Best For</th><th>Cost/sq yd</th></tr></thead>
<tbody>
<tr><td><strong>Rebond (bonded urethane)</strong></td><td>⅜"–½"</td><td>6–8 lbs</td><td>Most residential, best value</td><td>$2–$4</td></tr>
<tr><td><strong>Memory foam</strong></td><td>¼"–⅜"</td><td>8–10 lbs</td><td>Premium comfort, bedrooms</td><td>$4–$7</td></tr>
<tr><td><strong>Fiber (felt)</strong></td><td>¼"–⅜"</td><td>Varies</td><td>Berber/loop carpet, low pile</td><td>$3–$5</td></tr>
<tr><td><strong>Rubber (waffle or flat)</strong></td><td>Varies</td><td>High</td><td>Commercial, high-traffic areas</td><td>$5–$10</td></tr>
</tbody>
</table>
<p><strong>Important:</strong> Too thick padding (over ½") can cause carpet to wrinkle and wear unevenly. Most carpet warranties require specific padding density — check your warranty before choosing.</p>

<h2>2025 US Carpet Cost Guide</h2>
<table>
<thead><tr><th>Category</th><th>Material (per sq yd)</th><th>Installed (per sq ft)</th><th>12×15 Room</th></tr></thead>
<tbody>
<tr><td><strong>Economy</strong></td><td>$10–$20</td><td>$2–$4</td><td>$360–$720</td></tr>
<tr><td><strong>Mid-Range</strong></td><td>$20–$40</td><td>$4–$7</td><td>$720–$1,260</td></tr>
<tr><td><strong>Premium</strong></td><td>$40–$70</td><td>$7–$11</td><td>$1,260–$1,980</td></tr>
<tr><td><strong>Luxury (Wool)</strong></td><td>$50–$100+</td><td>$9–$15+</td><td>$1,620–$2,700+</td></tr>
</tbody>
</table>
<p><strong>Additional costs to budget:</strong> Old carpet removal: $1–$2/sq ft. Furniture moving: $25–$75/room. Stair carpet: $10–$25/step. Transitions/thresholds: $3–$5 per linear foot.</p>
`,
        faq: [
            { question: "How much carpet do I need for a room?", answer: "Measure length × width in feet for square footage. Add 10% waste (15–20% for patterned carpet). Divide by 9 to get square yards. Example: 12×15 ft room = 180 sq ft × 1.10 = 198 sq ft ÷ 9 = 22 sq yd. Always round up — carpet is cut from rolls." },
            { question: "How much does carpet installation cost?", answer: "Total installed cost: $2–$15/sq ft depending on quality. Carpet material: $1–$10+/sq ft. Padding: $0.25–$0.75/sq ft. Installation labor: $0.50–$1.50/sq ft. A standard 12×15 room costs $360–$2,700+ fully installed." },
            { question: "What's the best carpet for high-traffic areas?", answer: "Nylon is the most durable carpet fiber — it resists matting, crushing, and staining. Look for nylon with a face weight of 35–45 oz/sq yd. Berber (loop pile) in nylon or olefin also performs well in hallways and stairs. Avoid polyester in high-traffic areas — it mats quickly." },
            { question: "How long does carpet last?", answer: "Polyester: 3–5 years. Olefin: 5–8 years. Nylon: 10–15 years. Triexta: 10–15 years. Berber: 10–15 years. Wool: 15–20+ years. Lifespan depends on traffic, maintenance, padding quality, and fiber type. Quality padding extends life by 3–5 years." },
            { question: "What carpet padding should I use?", answer: "Rebond (bonded urethane) is the best value for residential: ⅜\"–½\" thick, 6–8 lb density. For Berber/loop: use thinner, firmer padding (¼\"–⅜\"). Too-thick padding voids warranties. Memory foam is luxury but unnecessary for most rooms. Always check carpet warranty requirements." },
            { question: "What's the difference between 12 ft and 15 ft carpet rolls?", answer: "12 ft is standard — available in all styles. 15 ft is wide-width — eliminates seams in rooms up to 15 ft wide but has fewer style options. Choose 15 ft rolls to avoid seams if your room width allows. 15 ft rolls may cost 5–10% more per sq yd." },
            { question: "How do I convert square feet to square yards?", answer: "Divide square feet by 9. One square yard = 3 ft × 3 ft = 9 sq ft. Examples: 100 sq ft = 11.1 sq yd. 200 sq ft = 22.2 sq yd. 500 sq ft = 55.6 sq yd. Always round up when ordering from a roll." },
            { question: "Should I remove old carpet before installing new?", answer: "Yes — installing over old carpet voids most warranties, traps allergens, and creates an uneven surface. Old carpet removal costs $1–$2/sq ft. Some installers include removal in their installation price. Old padding should also be removed and replaced with new." },
            { question: "How much waste should I add for carpet?", answer: "10% for simple rectangular rooms. 15% for L-shaped rooms or rooms with closets. 20% for patterned carpet that requires pattern matching at seams. For stairs: each step requires a separate piece cut from the roll, so waste is 20–30%." },
            { question: "Is carpet cheaper than hardwood?", answer: "Yes — carpet is typically the most affordable flooring option. Carpet installed: $2–$7/sq ft (most homes). Hardwood installed: $8–$15/sq ft. Luxury vinyl plank (LVP): $4–$8/sq ft. Tile: $5–$12/sq ft. However, carpet requires replacement every 10–15 years vs. 25+ years for hardwood." },
        ],
    },
    "sand-calculator": {
        subtitle: "Calculate how much sand you need for construction, paving, landscaping, or filling projects. Get volume in cubic yards, tons, and bags.",
        explanation: {
            heading: "How to Calculate Sand Quantities",
            paragraphs: [
                "Sand is used in many construction applications: paver base (1–2 inches), concrete mixing, masonry, sandbox fill, and leveling. The calculation is Length × Width × Depth ÷ 27 for cubic yards. Sand weighs approximately 1.35 tons per cubic yard (2,700 lbs).",
                "For paver installations, you'll need two types of sand: leveling sand (coarse, ¾–1 inch layer below pavers) and polymeric sand (swept into joints after laying). Leveling sand is calculated by area; joint sand is approximately 1 bag per 25 sq ft for standard pavers.",
            ],
            highlight: "A 10×10 ft paver area with 4 inches of leveling sand = 100 × 0.333 = 33.3 cu ft = 1.23 cu yd ≈ 1.7 tons. At 50 lb/bag, that's about 67 bags.",
        },
        faq: [
            { question: "What type of sand should I use?", answer: "Concrete sand: best for mixing concrete and mortar. Mason sand: best for paver leveling and sandbox fill (fine, smooth). Sharp sand: best for drainage projects. Play sand: specifically washed and screened for children's sandboxes." },
            { question: "How much does sand cost?", answer: "Bulk sand: $25–$50 per cubic yard. Bags (50 lb): $4–$6 each. Specialty sands (play sand, polymeric) cost more: $15–$25 per bag. Delivery fees for bulk: $50–$150. Bulk is dramatically cheaper per unit for large projects." },
        ],
    },
    "topsoil-calculator": {
        subtitle: "Calculate how much topsoil you need for gardens, raised beds, and new lawns. Get results in cubic yards, tons, and bags by soil type.",
        explanation: {
            heading: "How to Calculate Topsoil Quantities",
            paragraphs: [
                "Topsoil is sold by the cubic yard or by the bag. One cubic yard covers approximately 108 sq ft at 3 inches deep — the recommended minimum for establishing new grass or garden beds. For raised beds, plan for 6–12 inches of depth.",
                "Different soil products have different densities: standard topsoil weighs about 1.1 tons per cubic yard, garden mix about 1.0 ton, and compost about 0.6 tons. Knowing the density helps you estimate delivery weight and plan for equipment access.",
            ],
            highlight: "A 10×10 ft raised bed at 6 inches deep = 50 cu ft = 1.85 cu yd of topsoil ≈ 2 tons. That's roughly 100 bags of 40 lb soil. Bulk delivery is typically 50–70% cheaper than buying bags.",
        },
        faq: [
            { question: "How deep should topsoil be?", answer: "New lawns: 4–6 inches minimum over compacted subgrade. Garden beds: 6–12 inches. Raised beds: fill to desired height (typically 8–12 inches). Top-dressing existing lawns: ¼–½ inch. The deeper the topsoil, the better the root development." },
            { question: "What's the difference between topsoil and garden soil?", answer: "Topsoil is natural surface soil (top 4–12 inches of earth), screened to remove debris. Garden soil is topsoil amended with compost, peat, and other organic matter for better drainage and nutrient content. Garden soil costs more but requires less amendment." },
        ],
    },
    "retaining-wall-calculator": {
        subtitle: "Calculate blocks, cap stones, gravel backfill, and drainage pipe needed for a retaining wall. Enter wall dimensions and block specifications.",
        explanation: {
            heading: "How to Estimate Retaining Wall Materials",
            paragraphs: [
                "Retaining wall block calculators work by dividing the wall face area by the face area of a single block. Standard landscape blocks are 12 inches long × 4 inches tall, requiring 3 blocks per linear foot per row. Walls over 4 feet typically need engineering review.",
                "Critical materials beyond blocks include: gravel backfill behind the wall (provides drainage and reduces hydrostatic pressure), perforated drainage pipe at the base, landscape fabric between backfill and soil, and cap blocks (adhesive-set) for the top course.",
            ],
            highlight: "A 20 ft × 3 ft retaining wall with 12×4 blocks = 9 rows × 20 blocks/row = 180 wall blocks + 20 cap blocks. Add 0.7 cu yd of gravel backfill and 20 ft of perforated drain pipe.",
        },
        faq: [
            { question: "How high can I build a retaining wall without engineering?", answer: "Most jurisdictions allow gravity retaining walls up to 3–4 feet without a permit or engineer. Walls over 4 feet typically require engineered design with geogrids, proper drainage, and a building permit. Always check local codes." },
            { question: "Do I need drainage behind a retaining wall?", answer: "Yes, always. Without drainage, water builds up behind the wall creating hydrostatic pressure that can cause failure. Install 6–12 inches of clean gravel backfill with a perforated pipe at the base, wrapped in landscape fabric." },
        ],
    },
    "asphalt-calculator": {
        subtitle: "Calculate how much asphalt you need for driveways, parking lots, and roads. Get tonnage, volume, truckloads, and cost estimates.",
        explanation: {
            heading: "How to Calculate Asphalt Quantities",
            paragraphs: [
                "Hot mix asphalt (HMA) weighs approximately 145 lbs per cubic foot, or about 2 tons per cubic yard. The standard residential driveway thickness is 2–3 inches for the surface course over a properly prepared gravel base. Commercial applications typically use 3–4 inches.",
                "Asphalt is ordered in tons and delivered by dump truck (typically 20 tons per load). The formula is: Length × Width × Thickness (in feet) × 145 ÷ 2000 = tons needed. Always order 5–10% extra to account for variations in subgrade and compaction.",
            ],
            highlight: "A 20×12 ft driveway at 3 inches thick = 240 × 0.25 = 60 cu ft × 145 lbs ÷ 2000 = 4.35 tons of hot mix asphalt. That's well under one truckload.",
        },
        faq: [
            { question: "How thick should an asphalt driveway be?", answer: "Residential driveways: 2–3 inches of asphalt over 6–8 inches of compacted gravel base. Heavy-use commercial driveways: 3–4 inches over 8–12 inches of base. The base preparation is actually more important than the asphalt thickness." },
            { question: "How much does asphalt cost?", answer: "Hot mix asphalt: $80–$150 per ton for materials. Professional installation: $3–$7 per square foot including base preparation. A typical 20×12 ft driveway costs $1,500–$3,500 fully installed." },
        ],
    },
    "rebar-calculator": {
        subtitle: "Calculate rebar needed for concrete slabs and footings. Get total bars, linear feet, and weight by bar size (#3–#8) and spacing.",
        explanation: {
            heading: "How to Calculate Rebar Quantities",
            paragraphs: [
                "Rebar is placed in a grid pattern within concrete to provide tensile strength. Standard residential slab spacing is 12–18 inches on center (OC) in both directions. Calculate bars in each direction: divide the perpendicular dimension by the spacing and add 1 for the starting bar.",
                "Rebar is identified by bar size number — the number represents eighths of an inch in diameter. #4 rebar (½ inch) is the most common for residential work. It weighs 0.668 lbs per foot. #3 (⅜ inch) is used for light-duty, while #5 and #6 are for heavier structural applications.",
            ],
            highlight: "A 20×20 ft slab with #4 rebar at 12\" OC needs: 21 bars each way = 42 total bars. Total linear feet = 42 × 20 = 840 ft. Weight = 840 × 0.668 = 561 lbs of rebar.",
        },
        faq: [
            { question: "What size rebar do I need?", answer: "#3 (⅜\"): light-duty slabs, thin walls. #4 (½\"): standard residential slabs, driveways, patios. #5 (⅝\"): foundation walls, heavier slabs. #6 (¾\"): structural columns, beams. #7–#8: heavy commercial and infrastructure projects." },
            { question: "What spacing should I use for rebar?", answer: "12 inches OC: driveways, garage floors, structural slabs. 16 inches OC: standard residential slabs, patios. 18 inches OC: lightly-loaded slabs, walkways. Always follow the structural engineer's specifications when available." },
        ],
    },
    "siding-calculator": {
        subtitle: "Calculate how much siding material you need for your home exterior. Accounts for walls, gables, doors, and windows with waste factor.",
        explanation: {
            heading: "How to Calculate Siding Materials",
            paragraphs: [
                "Siding is measured in 'squares' (100 sq ft each), similar to roofing. Start by calculating the gross wall area: average wall length × wall height × number of walls, plus any gable-end triangles. Then subtract openings: standard doors (≈ 21 sq ft each) and windows (≈ 15 sq ft each).",
                "Add 10% waste for standard rectangular homes with few obstacles. Increase to 15% for homes with many windows, unusual angles, or complex trim details. Siding types differ in coverage — vinyl panels are typically sold by the square, while fiber cement comes in individual planks.",
            ],
            highlight: "A home with 4 walls averaging 40×9 ft plus 60 sq ft of gables, with 2 doors and 8 windows: gross = 1,500 sq ft − 162 sq ft openings = 1,338 sq ft net. With 10% waste = 14.7 squares of siding.",
        },
        faq: [
            { question: "What type of siding is most cost-effective?", answer: "Vinyl siding: $3–$8/sq ft installed (cheapest, 20–30 year lifespan). Fiber cement (Hardie): $6–$13/sq ft installed (durable, 30–50 years). Wood: $5–$12/sq ft (classic look, requires maintenance). Engineered wood: $4–$9/sq ft (good middle ground)." },
            { question: "How do I measure gable ends?", answer: "A standard gable is a triangle: measure the base width and the height from the wall top to the peak, then calculate ½ × base × height. For a 30 ft wide gable with a 6 ft rise: ½ × 30 × 6 = 90 sq ft." },
        ],
    },
    "gutter-calculator": {
        subtitle: "Calculate gutters, downspouts, brackets, elbows, and end caps needed for your roof. Enter roof edge length and downspout spacing.",
        explanation: {
            heading: "How to Calculate Gutter Materials",
            paragraphs: [
                "Gutter length equals the total roof edge (eave) length where you want gutters installed — typically the front and back of the house, plus any side sections. Standard gutter sections are 10 feet long. Downspouts should be placed every 30–40 feet and at each end of a gutter run.",
                "For each downspout, plan 3 elbows (2 at the top to transition from gutter to wall, 1 at the bottom to direct water away). Brackets or hangers are installed every 3 feet along the gutter. End caps close off the gutter ends, and inside/outside corner pieces join gutter runs at angles.",
            ],
            highlight: "A home with 100 ft of roof edge, 40 ft downspout spacing: 10 gutter sections, 3 downspouts, 34 brackets, 9 elbows, and 2 end caps.",
        },
        faq: [
            { question: "What size gutters should I use?", answer: "5-inch K-style gutters handle most residential roofs. 6-inch gutters are recommended for large roof areas, steep pitches, or heavy rainfall regions. Match with 2×3 inch downspouts for 5-inch gutters, or 3×4 inch for 6-inch gutters." },
            { question: "How many downspouts do I need?", answer: "One downspout per 30–40 linear feet of gutter as a rule of thumb. Each 2×3 inch downspout can handle approximately 600 sq ft of roof area. More downspouts provide better drainage and reduce overflow risk." },
        ],
    },
    "paver-calculator": {
        subtitle: "Calculate how many pavers you need for patios, walkways, and driveways. Includes gravel base, leveling sand, and polymeric joint sand estimates.",
        explanation: {
            heading: "How to Calculate Paver Materials",
            paragraphs: [
                "Paver calculations divide the project area by the area of a single paver (including the joint gap). Common sizes include 4×8 inches (standard brick), 6×6, 6×9, and 12×12 inches. The joint gap is typically ¼ inch for polymeric sand or ⅛ inch for dry-laid.",
                "A proper paver installation requires three layers below the pavers: compacted subgrade, 4–6 inches of crushed gravel base, and 1 inch of leveling sand. After laying, polymeric sand is swept into the joints and activated with water to lock pavers in place.",
            ],
            highlight: "A 12×10 ft patio with 4×8\" pavers and ¼\" gap = 120 sq ft ÷ 0.233 sq ft/paver = 515 pavers. Add 10% waste = 567 pavers. Plus 1.5 cu yd gravel base, 0.4 cu yd leveling sand, and 5 bags of polymeric sand.",
        },
        faq: [
            { question: "How thick should the gravel base be under pavers?", answer: "4 inches for walkways and patios with light foot traffic. 6–8 inches for driveways and areas with vehicle traffic. The base should be compacted in 2-inch lifts using a plate compactor. Proper base preparation prevents settling and shifting." },
            { question: "How many pavers come on a pallet?", answer: "It varies by size: 4×8\" brick pavers: ~480 per pallet. Holland pavers (4×8×2.375\"): ~486. 6×6\" pavers: ~270. 12×12\" pavers: ~120. Always check with your specific manufacturer for exact pallet counts." },
        ],
    },
    "wallpaper-calculator": {
        subtitle: "Calculate how many rolls of wallpaper you need for any room. Accounts for doors, windows, roll size, and pattern repeat.",
        explanation: {
            heading: "How to Calculate Wallpaper Rolls",
            paragraphs: [
                "Standard American wallpaper rolls are 20.5 inches wide × 33 feet long, covering approximately 56 square feet per roll. Euro rolls are wider (21–27.5 inches) and shorter (33 feet is standard). Actual usable coverage is less due to trimming, pattern matching, and waste around openings.",
                "Pattern repeat is the most overlooked factor in wallpaper calculations. A large pattern repeat (21+ inches) can waste up to 15% of each roll in matching. Straight-match patterns are more efficient than drop-match patterns. For patterned wallpaper, always buy 1–2 extra rolls from the same batch.",
            ],
            highlight: "A 12×10 ft room with 8 ft ceilings, 1 door, 2 windows: perimeter = 44 ft, wall area = 352 sq ft, minus openings = 301 sq ft. At 56 sq ft usable/roll = 6 rolls needed (no pattern). With pattern repeat = 7 rolls.",
        },
        faq: [
            { question: "How do I handle pattern matching?", answer: "Random textures: no waste. Straight match: line up the pattern horizontally at the same height — budget 10% extra. Half-drop match: every other strip is offset by half the repeat — budget 15–20% extra. Large patterns (21\"+) waste the most." },
            { question: "How much wallpaper paste do I need?", answer: "Most pre-mixed paste covers 120–150 sq ft per quart. For a 300 sq ft room, plan 2–3 quarts. Pre-pasted wallpaper only needs water. Some premium papers require specialty adhesives — check manufacturer recommendations." },
        ],
    },
    "pool-volume-calculator": {
        subtitle: "Calculate the water volume of your swimming pool in gallons and liters. Supports rectangular, round, and oval pool shapes with variable shallow and deep ends.",
        explanation: {
            heading: "How to Calculate Pool Volume",
            paragraphs: [
                "Pool volume is calculated using the pool's surface area multiplied by the average depth, then converted to gallons. For rectangular pools: Length × Width × Average Depth × 7.48 gallons/cu ft. For round pools: π × radius² × Average Depth × 7.48. Average depth = (shallow end + deep end) ÷ 2.",
                "Knowing your pool volume is essential for proper chemical dosing, heater sizing, pump selection, and filling time estimation. A garden hose delivers approximately 5–10 gallons per minute, so a 15,000-gallon pool takes 25–50 hours to fill from empty.",
            ],
            highlight: "A 30×15 ft rectangular pool with 3 ft shallow and 8 ft deep end: average depth = 5.5 ft. Volume = 30 × 15 × 5.5 = 2,475 cu ft × 7.48 = 18,512 gallons (70,083 liters).",
        },
        faq: [
            { question: "How many gallons is a typical residential pool?", answer: "Small pools (12×24 ft): 8,000–12,000 gallons. Medium pools (16×32 ft): 15,000–25,000 gallons. Large pools (20×40 ft): 25,000–40,000 gallons. Above-ground round pools (18 ft diameter, 4 ft deep): ~7,600 gallons." },
            { question: "Why do I need to know my pool volume?", answer: "Chemical dosing (chlorine, pH adjusters, algaecide) is calculated per 10,000 gallons. Incorrect volume estimates lead to over- or under-dosing. It's also needed for sizing pool heaters, pumps, filters, and estimating water bills for filling." },
        ],
    },
    "fill-dirt-calculator": {
        subtitle: "Calculate how much fill dirt you need for grading, backfilling, and leveling. Get volume in cubic yards, tons, and truckloads with compaction factor.",
        explanation: {
            heading: "How to Calculate Fill Dirt Quantities",
            paragraphs: [
                "Fill dirt is used to raise grade, fill excavations, and create level building surfaces. The key to accurate estimation is the compaction factor — loose fill dirt compacts 20–30% when mechanically compacted, meaning you need to order 20–30% more than the finished volume.",
                "Fill dirt weighs approximately 1.15 tons per cubic yard (compacted). Standard dump trucks carry 10–14 cubic yards per load. For large projects, ordering by the truckload is most economical. Specify 'clean fill' to ensure you get dirt free of organic matter, debris, and contaminants.",
            ],
            highlight: "A 20×20 ft area needing 12 inches of fill: base volume = 400 cu ft, with 25% compaction factor = 500 cu ft = 18.5 cu yd ≈ 21.3 tons. That's about 1.3 dump truck loads (14 yd each).",
        },
        faq: [
            { question: "What's the difference between fill dirt and topsoil?", answer: "Fill dirt is subsoil — it has little to no organic content, making it ideal for structural fill, grading, and foundation backfill. Topsoil is nutrient-rich surface soil for growing plants. Never use topsoil as structural fill — it settles and decomposes over time." },
            { question: "How much does fill dirt cost?", answer: "Clean fill dirt: $5–$15 per cubic yard (some contractors give it away for free). Screened fill: $10–$25 per cubic yard. Delivery: $50–$150 per truckload depending on distance. For large projects, you can often find free fill dirt from nearby excavation sites." },
        ],
    },
    "soil-amendment-calculator": {
        subtitle: "Calculate how much lime, sulfur, gypsum, or compost to add to your soil. Enter area and application rate for bags and volume needed.",
        explanation: {
            heading: "How to Calculate Soil Amendments",
            paragraphs: [
                "Soil amendments are applied at specific rates per 100 square feet, depending on the material and your soil test results. Agricultural lime is applied at 3–8 lbs per 100 sq ft, elemental sulfur at 0.5–2 lbs, and gypsum at 3–5 lbs. Compost amendments are measured in cubic feet.",
                "Always start with a soil test to determine your soil's current pH and nutrient levels. Lime raises pH (makes soil less acidic), sulfur lowers pH (makes soil more acidic), gypsum improves clay soil structure without changing pH, and compost improves overall soil health and water retention.",
            ],
            highlight: "A 10×10 ft garden bed needing lime at 5 lbs per 100 sq ft: area = 100 sq ft, total lime = 5 lbs. For a 50×50 ft lawn at the same rate: 2,500 sq ft × 5/100 = 125 lbs = about 3 bags of 40 lb lime.",
        },
        faq: [
            { question: "How often should I amend my soil?", answer: "Lime and sulfur: every 2–3 years based on soil test results. Compost: annually in spring or fall (1–2 inches worked into the top 4–6 inches). Gypsum: annually for heavy clay soils. Always retest soil before reapplying pH-adjusting amendments." },
            { question: "Can I apply too much lime or sulfur?", answer: "Yes — over-liming raises pH too high, locking out iron, manganese, and other micronutrients. Too much sulfur drops pH below optimal range, making aluminum toxic to plants. Apply in increments and retest. Maximum single application: 50 lbs lime or 5 lbs sulfur per 1,000 sq ft." },
        ],
    },
    "concrete-stairs-calculator": {
        subtitle: "Calculate concrete volume for poured stairs. Enter total rise, stair width, and tread dimensions for cubic yards and bag counts.",
        explanation: {
            heading: "How to Calculate Concrete for Stairs",
            paragraphs: [
                "Poured concrete stairs are calculated by combining the volume of each individual step plus the underlying slab (stringer) volume. Each step is essentially a rectangular block: tread depth × riser height × stair width. The stringer adds a triangular cross-section beneath the steps.",
                "Building code requirements for stairs: riser height 4–7.75 inches (7–7.5 inches is ideal), tread depth minimum 10–11 inches, and stair width minimum 36 inches. The total rise determines the number of steps: divide total rise by desired riser height and round to the nearest whole number.",
            ],
            highlight: "A 36-inch total rise with 36-inch wide stairs, 7.5\" risers, 11\" treads, and 6\" slab: 5 steps. Volume ≈ 8.4 cu ft = 0.31 cu yd. That's about 14 bags of 80 lb concrete mix.",
        },
        faq: [
            { question: "What is the ideal riser height and tread depth?", answer: "The ideal riser height is 7–7.5 inches with an 11-inch tread depth. A common rule: riser + tread = 17–18 inches. All risers must be within ⅜ inch of each other in height per building code. Wider treads (12\"+) are more comfortable for outdoor stairs." },
            { question: "Do concrete stairs need rebar?", answer: "Yes — concrete stairs should be reinforced with #4 rebar (½ inch) placed in a grid within the slab, plus bars running through each step. Without reinforcement, concrete stairs are prone to cracking from freeze-thaw cycles and settling." },
        ],
    },
    "aggregate-calculator": {
        subtitle: "Calculate aggregate needed for sub-bases, drainage layers, and concrete mixing. Get cubic yards, tons, and cost by aggregate type.",
        explanation: {
            heading: "How to Calculate Aggregate Quantities",
            paragraphs: [
                "Aggregate is the general term for crushed stone, gravel, road base, and similar materials used as sub-bases under concrete, asphalt, and pavers. Different aggregates have different densities: crushed stone weighs about 1.4 tons per cubic yard, road base (Class 5) about 1.6 tons, and pea gravel about 1.4 tons.",
                "The calculation is straightforward: Length × Width × Depth = Volume in cubic feet, divide by 27 for cubic yards, then multiply by the material's density for tons. Sub-base depths vary by application: 4 inches for walkways, 6 inches under patios, and 8–12 inches under driveways.",
            ],
            highlight: "A 20×20 ft driveway sub-base at 6 inches of Class 5 road base: 200 cu ft = 7.4 cu yd × 1.6 tons/yd = 11.9 tons. At $25 per ton, the material costs about $297.",
        },
        faq: [
            { question: "What type of aggregate should I use for a sub-base?", answer: "Driveways/parking: Class 5 road base (crushed limestone with fines, compacts well). Patios/walkways: crushed stone or ¾\" clear aggregate. Drainage: washed stone or pea gravel (no fines, allows water flow). Concrete mixing: clean washed gravel/stone." },
            { question: "How deep should an aggregate sub-base be?", answer: "Walkways: 4 inches. Patios: 4–6 inches. Residential driveways: 6–8 inches. Commercial driveways: 8–12 inches. All aggregate should be compacted in 2-inch lifts using a plate compactor for maximum density." },
        ],
    },
    "column-calculator": {
        subtitle: "Calculate concrete volume for round or square columns and pier footings. Get results per column and totals in cubic feet, cubic yards, and bag counts.",
        explanation: {
            heading: "How to Calculate Concrete Column Volume",
            paragraphs: [
                "Round columns (Sonotubes) use the cylinder formula: π × radius² × height. Square columns simply multiply side × side × height. Common residential applications include deck piers (8–12 inch diameter), porch columns (12–18 inch), and structural piers (18–24 inch).",
                "Sonotube forms are available in diameters from 6 to 48 inches. For frost-protected foundations, pier depth must extend below the frost line — typically 36–48 inches in northern climates. Most jurisdictions require a footing pad at the bottom that's wider than the column.",
            ],
            highlight: "Four 12-inch round piers at 48 inches deep: volume per pier = π × 0.5² × 4 = 3.14 cu ft. Total = 12.57 cu ft = 0.47 cu yd ≈ 21 bags of 80 lb concrete.",
        },
        faq: [
            { question: "What diameter Sonotube do I need?", answer: "Deck piers: 8–12 inch diameter for most residential decks. Porch/pergola columns: 12–18 inch. Heavy structural loads: 18–24 inch. Always check local building codes — many require minimum 12-inch diameter for frost-protected foundations." },
            { question: "How deep do pier foundations need to be?", answer: "Below the local frost line — varies from 12 inches in southern states to 48+ inches in northern climates. Check your local building code. The bottom of the pier should rest on undisturbed soil or a compacted gravel base." },
        ],
    },
    "board-and-batten-calculator": {
        subtitle: "Calculate boards and battens needed for accent walls, siding, or wainscoting. Enter wall dimensions, board width, and spacing.",
        explanation: {
            heading: "How to Calculate Board and Batten Materials",
            paragraphs: [
                "Board and batten is a vertical siding pattern where wide boards are placed edge-to-edge (with a small gap) and narrow battens cover the joints. Common board widths are 6–10 inches with 1–2 inch battens. Calculate the number of boards by dividing wall width by the board width plus gap.",
                "The number of battens is always one fewer than the number of boards (battens cover the gaps between boards). Total linear feet equals the number of pieces multiplied by the wall height. This calculation works for both exterior siding and interior accent walls.",
            ],
            highlight: "A 12 ft wide × 8 ft tall accent wall with 6-inch boards and ½-inch gaps: 12 ft = 144 inches ÷ 6.5\" = 23 boards × 8 ft = 184 ft of board stock. Plus 22 battens × 8 ft = 176 ft of batten stock.",
        },
        faq: [
            { question: "What is the standard board and batten spacing?", answer: "Boards: 6–10 inches wide (1×6, 1×8, 1×10 common). Gap between boards: ¼–½ inch. Battens: 1.5–2 inches wide (1×2 lumber). For exterior siding, leave a ⅜\" gap behind battens for drainage. Interior accent walls can have tighter spacing." },
            { question: "What material should I use for board and batten?", answer: "Exterior: cedar, redwood, or fiber cement (most durable). Interior: MDF, pine, or poplar (easiest to paint). Pre-primed finger-joint pine is the most cost-effective for painted interior applications." },
        ],
    },
    "drainage-calculator": {
        subtitle: "Calculate French drain materials — perforated pipe, drainage gravel, landscape fabric, and catch basins by trench dimensions.",
        explanation: {
            heading: "How to Calculate French Drain Materials",
            paragraphs: [
                "A French drain consists of a gravel-filled trench with a perforated pipe at the bottom, wrapped in landscape fabric to prevent soil migration. Standard residential dimensions: 12 inches wide × 18 inches deep. The trench should slope ¼ inch per foot minimum toward the outlet.",
                "Materials breakdown: the pipe runs the full trench length, gravel fills the entire trench volume, and landscape fabric wraps around the gravel (bottom, sides, and top overlap). Catch basins are placed every 50 feet or at corners to provide inspection and cleanout points.",
            ],
            highlight: "A 50 ft French drain, 12\" wide × 18\" deep: gravel = 2.8 cu yd, pipe = 50 ft, landscape fabric = 200 sq ft, 1 catch basin. Total material cost: $200–$400.",
        },
        faq: [
            { question: "How deep should a French drain be?", answer: "Standard yard drainage: 12–18 inches deep. Foundation perimeter drains: 24–36 inches deep (at footing level). Deeper drains handle more water but cost more to install. Always ensure the bottom of the drain is above the water table." },
            { question: "What size gravel should I use for a French drain?", answer: "Washed ¾\" crushed stone or river rock is ideal — large enough for good flow but small enough to fill the trench evenly. Do NOT use pea gravel (too round, shifts easily) or road base (contains fines that clog the pipe). The gravel must be clean and washed." },
        ],
    },
    "plywood-calculator": {
        subtitle: "Calculate plywood sheets needed for floors, walls, roofs, or cabinets. Choose from 6 plywood types, 5 thicknesses, and get weight and cost estimates.",
        explanation: {
            heading: "How to Calculate Plywood Sheets",
            paragraphs: [
                "A standard plywood sheet is 4 feet × 8 feet = 32 square feet. To find how many sheets you need, calculate the total area, add a waste factor (10% for rectangular areas, 15% for complex shapes), and divide by 32. Round up — you can't buy partial sheets.",
                "Plywood comes in various thicknesses: ¼ inch (underlayment), ⅜ inch (wall sheathing), ½ inch (roof sheathing), ⅝ inch (subfloor residential), and ¾ inch (subfloor, heavy-duty). CDX is the standard structural grade, while sanded plywood is used for visible applications.",
            ],
            highlight: "A 20×12 ft subfloor with 10% waste: 240 sq ft × 1.10 = 264 sq ft ÷ 32 sq ft/sheet = 9 sheets of ¾\" plywood. At $40/sheet = $360.",
        },
        contentHTML: `
<p>Plywood is one of the most versatile building materials used in <strong>US construction</strong>. From structural subfloors and roof sheathing to cabinetry and furniture, understanding plywood types, thicknesses, and quantities is essential for accurate project planning and budgeting.</p>
<p>The calculator above supports <strong>6 plywood types</strong>, <strong>5 thicknesses</strong>, two sheet sizes (4×8 and 4×4), and provides <strong>weight per sheet and total weight</strong> — critical for delivery planning and structural load calculations.</p>
<p>Measure area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For framing lumber, see our <a href="/construction-calculators/lumber-calculator">lumber calculator</a>. For drywall, try our <a href="/construction-calculators/drywall-calculator">drywall calculator</a>.</p>

<h2>Plywood Types Comparison</h2>
<table>
<thead><tr><th>Type</th><th>Grade</th><th>Best For</th><th>¾" Weight (4×8)</th><th>¾" Cost (4×8)</th></tr></thead>
<tbody>
<tr><td><strong>CDX</strong></td><td>C-D Exposure 1</td><td>Subfloors, roof sheathing, wall sheathing</td><td>~60 lbs</td><td>$35–$50</td></tr>
<tr><td><strong>OSB</strong></td><td>Structural 1</td><td>Roof decking, wall sheathing, subfloors</td><td>~55 lbs</td><td>$25–$35</td></tr>
<tr><td><strong>Sanded (BC/AC)</strong></td><td>B-C or A-C</td><td>Cabinets, shelving, furniture, visible surfaces</td><td>~65 lbs</td><td>$45–$65</td></tr>
<tr><td><strong>Marine Grade</strong></td><td>A-A or A-B</td><td>Boats, docks, outdoor furniture, wet environments</td><td>~70 lbs</td><td>$70–$100</td></tr>
<tr><td><strong>Baltic Birch</strong></td><td>BB/BB or BB/CP</td><td>Fine furniture, laser cutting, drawer boxes</td><td>~68 lbs</td><td>$60–$85</td></tr>
<tr><td><strong>MDF</strong></td><td>Standard</td><td>Cabinet doors, trim, paintable surfaces</td><td>~85 lbs</td><td>$30–$40</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> CDX and OSB are the two most common structural plywood types. CDX is true plywood (cross-laminated veneers); OSB is made from compressed wood strands. Both are code-approved for structural use, but CDX handles moisture better.</p>

<h2>Plywood Thickness: Nominal vs. Actual</h2>
<table>
<thead><tr><th>Nominal</th><th>Actual Thickness</th><th>Weight (4×8, CDX)</th><th>Common Use</th></tr></thead>
<tbody>
<tr><td><strong>¼"</strong></td><td>7/32" (0.219")</td><td>~24 lbs</td><td>Underlayment, cabinet backs, craft projects</td></tr>
<tr><td><strong>⅜"</strong></td><td>11/32" (0.344")</td><td>~33 lbs</td><td>Wall sheathing (non-structural), hobby projects</td></tr>
<tr><td><strong>½"</strong></td><td>15/32" (0.469")</td><td>~42 lbs</td><td>Roof sheathing, wall sheathing, shelving</td></tr>
<tr><td><strong>⅝"</strong></td><td>19/32" (0.594")</td><td>~51 lbs</td><td>Subfloor (16" OC joists), heavy shelving</td></tr>
<tr><td><strong>¾"</strong></td><td>23/32" (0.719")</td><td>~60 lbs</td><td>Subfloor (24" OC joists), workbenches, heavy-duty</td></tr>
</tbody>
</table>
<p><strong>Important:</strong> Nominal and actual plywood thicknesses differ by 1/32" to 1/16" due to sanding. This matters for cabinetry and precision joinery — always measure before cutting dados and rabbets.</p>

<h2>Step-by-Step Plywood Estimation</h2>
<h3>Step 1: Measure the Area</h3>
<p>Measure the <strong>length and width</strong> of each surface to cover. Multiply to get square footage. For multiple walls or sections, calculate each separately and add together.</p>
<p><strong>Example:</strong> A room 20 ft × 12 ft = 240 sq ft of subfloor.</p>

<h3>Step 2: Add Waste</h3>
<p>Add <strong>10% for rectangular rooms</strong> (simple cuts). Add <strong>15% for L-shaped rooms, corners, and cutouts</strong>. Add <strong>20% for complex shapes</strong> like hexagonal or curved surfaces.</p>
<p><strong>Example:</strong> 240 sq ft × 1.10 = 264 sq ft.</p>

<h3>Step 3: Divide by Sheet Area</h3>
<p>Standard 4×8 sheet = <strong>32 sq ft</strong>. Half sheet (4×4) = <strong>16 sq ft</strong>. Round up to the nearest whole sheet — you can't buy partial sheets.</p>
<p><strong>Example:</strong> 264 ÷ 32 = 8.25 → <strong>9 sheets</strong>.</p>

<h2>Plywood by Project</h2>
<table>
<thead><tr><th>Project</th><th>Recommended Type</th><th>Thickness</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>Subfloor</strong></td><td>CDX or OSB</td><td>¾" (23/32")</td><td>Use T&G (tongue-and-groove) for 24" OC joists</td></tr>
<tr><td><strong>Roof Sheathing</strong></td><td>CDX or OSB</td><td>½" or ⅝"</td><td>½" for 16" OC rafters; ⅝" for 24" OC</td></tr>
<tr><td><strong>Wall Sheathing</strong></td><td>CDX or OSB</td><td>⅜" or ½"</td><td>Structural: ½" min. Non-structural: ⅜"</td></tr>
<tr><td><strong>Underlayment</strong></td><td>Sanded BC</td><td>¼"</td><td>Over existing subfloor before vinyl/tile</td></tr>
<tr><td><strong>Cabinets</strong></td><td>Sanded AC or Baltic Birch</td><td>¾"</td><td>AC for painted, Baltic Birch for clear finish</td></tr>
<tr><td><strong>Shelving</strong></td><td>Sanded BC or Baltic Birch</td><td>¾"</td><td>Max span without support: 36" for ¾" plywood</td></tr>
</tbody>
</table>

<h2>2025 US Plywood Cost Guide</h2>
<table>
<thead><tr><th>Type</th><th>½" (4×8)</th><th>¾" (4×8)</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>CDX</strong></td><td>$28–$38</td><td>$35–$50</td><td>Most common structural plywood</td></tr>
<tr><td><strong>OSB</strong></td><td>$20–$28</td><td>$25–$35</td><td>Cheapest structural option</td></tr>
<tr><td><strong>Sanded BC</strong></td><td>$35–$45</td><td>$45–$65</td><td>One good face, one utility face</td></tr>
<tr><td><strong>Sanded AC</strong></td><td>$40–$55</td><td>$55–$75</td><td>One premium face for cabinetry</td></tr>
<tr><td><strong>Baltic Birch</strong></td><td>$50–$65</td><td>$60–$85</td><td>5×5 ft sheets standard (not 4×8)</td></tr>
<tr><td><strong>Marine Grade</strong></td><td>$55–$75</td><td>$70–$100</td><td>Waterproof glue, void-free core</td></tr>
</tbody>
</table>
<p><strong>Delivery:</strong> Most lumberyards charge $50–$100 for delivery. Big-box stores often deliver free on orders over $500. A pallet typically holds 40–60 sheets (depending on thickness). Plan for pallets weighing 2,000–3,500 lbs.</p>
`,
        faq: [
            { question: "What thickness plywood do I need?", answer: "Subfloor: ¾\" (23/32\"). Roof sheathing: ½\" or ⅝\". Wall sheathing: ⅜\" or ½\". Underlayment: ¼\". Cabinet backs: ¼\". Shelving: ¾\". Always match to code requirements for your specific application, joist/rafter spacing (16\" vs 24\" OC), and load requirements." },
            { question: "What's the difference between CDX and OSB?", answer: "CDX plywood: layers of wood veneer cross-laminated, stronger and more water-resistant. OSB: oriented strand board made from compressed wood strands, cheaper but swells when wet. For subfloors and roof sheathing, both are code-approved. CDX is preferred for moisture-prone areas." },
            { question: "How much does a sheet of plywood weigh?", answer: "¾\" CDX plywood (4×8): ~60 lbs. ½\" CDX: ~42 lbs. ¾\" MDF: ~85 lbs. ¾\" OSB: ~55 lbs. ¾\" Baltic Birch: ~68 lbs. Weight matters for delivery, handling, and structural load calculations. MDF is the heaviest; OSB is the lightest." },
            { question: "What do plywood grades mean?", answer: "Letters indicate face quality: A = sanded smooth, few defects. B = solid surface, minor repairs allowed. C = unsanded, knotholes allowed. D = unsanded, larger defects. 'CDX' means C-face, D-back, Exposure 1 glue. 'AC' means A-face (smooth), C-back — good for cabinets where one side shows." },
            { question: "Is actual plywood thickness different from nominal?", answer: "Yes — always slightly thinner. ¾\" nominal = 23/32\" actual (0.719\"). ½\" = 15/32\" (0.469\"). ¼\" = 7/32\" (0.219\"). This 1/32\" difference matters for dados, rabbets, and precision woodworking. Always measure before cutting joints." },
            { question: "How many sheets of plywood fit in a pickup truck?", answer: "A standard full-size pickup bed (6.5 ft) can carry sheets flat, but they'll overhang. Most pickups have a 1,500–2,000 lb payload. At ~60 lbs per ¾\" sheet, you can safely carry 25–30 sheets. However, 10–15 sheets is more practical for handling and visibility." },
            { question: "Should I use plywood or OSB for subfloor?", answer: "Both are code-approved. Plywood (CDX): better moisture resistance, less likely to swell at edges, smoother surface. OSB: cheaper (20–30% less), no core voids. For basements or bathrooms: use plywood (CDX). For general subfloor: OSB saves money with adequate performance." },
            { question: "How much waste should I add?", answer: "10% for simple rectangular rooms with few cuts. 15% for L-shaped rooms, hallways, or rooms with many cutouts (plumbing, HVAC). 20% for complex shapes. For roofs, add 15% minimum due to hip/valley cuts and peak waste. Round up to the nearest full sheet." },
            { question: "What's the best plywood for cabinets?", answer: "Sanded AC plywood (A-face smooth, C-back) for painted cabinets. Baltic Birch for clear-finish or stained cabinets — it has more plies (13 vs 5–7 for standard), void-free core, and beautiful edge grain. Use ¾\" for cabinet boxes and ¼\" for backs." },
            { question: "How do I store plywood?", answer: "Store flat on a level surface — never leaned against a wall (causes warping). Keep indoors or under cover. Elevate off concrete floors (use 2×4 stickers) to prevent moisture absorption. Acclimate to the job site for 48 hours before installation. Stack sheets with stickers every 4 feet." },
        ],
    },
    "ceiling-tile-calculator": {
        subtitle: "Calculate drop ceiling tiles, main runners, cross tees, wall angle, and hanger wires for suspended ceiling grid installations.",
        explanation: {
            heading: "How to Calculate Suspended Ceiling Materials",
            paragraphs: [
                "A suspended ceiling grid system consists of main runners (12 ft sections running the length of the room), cross tees (2 ft or 4 ft sections connecting main runners), wall angle (perimeter trim), and hanger wires (every 4 ft along main runners). Tiles drop into the grid openings.",
                "The two standard tile sizes are 2×4 ft (most common in commercial spaces) and 2×2 ft (residential and offices wanting a refined look). With 2×4 tiles, you need fewer cross tees since tiles span the full 4 ft between main runners. Hanger wires support the grid from the ceiling joists above.",
            ],
            highlight: "A 20×12 ft room with 2×4 tiles: 240 sq ft ÷ 8 sq ft/tile = 30 tiles. Plus 30 main runner pieces, 64 ft of wall angle, and 15 hanger wires.",
        },
        faq: [
            { question: "How low does a drop ceiling need to hang?", answer: "Minimum 3–4 inches below the lowest obstruction (pipes, ductwork, joists). Most building codes require minimum 7 ft 6 in finished ceiling height in habitable rooms. Plan clearance carefully before installing — once the grid is up, adjustments are difficult." },
            { question: "What's the difference between 2×2 and 2×4 ceiling tiles?", answer: "2×4 tiles: fewer pieces to install, lower material cost, more visible grid lines. 2×2 tiles: more refined appearance, easier to replace individual tiles, better for rooms where access to above-ceiling utilities is needed frequently." },
        ],
    },
    "gabion-wall-calculator": {
        subtitle: "Calculate gabion baskets and rock fill needed for retaining walls, garden walls, and landscape features by wall and basket dimensions.",
        explanation: {
            heading: "How to Calculate Gabion Wall Materials",
            paragraphs: [
                "Gabion walls are constructed from wire mesh baskets filled with rock or stone. Standard basket sizes range from 3×3×3 ft to 6×3×3 ft. The total number of baskets depends on the wall dimensions divided by individual basket size. Baskets are stacked in rows with each upper row set back slightly for stability.",
                "Each basket is filled with clean, angular rock (typically 4–8 inches). The rock volume equals the basket dimensions, but since rock doesn't pack perfectly, expect about 30–40% void space. Rock weighs approximately 1.4 tons per cubic yard. Gabion walls are permeable, eliminating the need for separate drainage systems.",
            ],
            highlight: "A 20 ft × 3 ft gabion wall with 6×3×3 ft baskets: 1 row × 4 baskets/row = 4 baskets. Rock fill = 4 × 54 cu ft = 216 cu ft = 8 cu yd ≈ 11.2 tons of rock.",
        },
        faq: [
            { question: "How high can a gabion wall be?", answer: "Gravity gabion walls: up to 10 feet with proper stepped-back design (each row set back ½ the basket depth). Walls over 6 feet should be engineered. For taller walls, use a combination of gabion facing with reinforced earth or geogrids behind." },
            { question: "What type of rock should I use in gabion baskets?", answer: "Angular, hard rock: granite, limestone, basalt, or quartzite. Size: 4–8 inches (larger than the mesh openings). Avoid round river rock (shifts and settles). The rock must be durable and weather-resistant. River rock can be used for decorative gabion features that don't bear loads." },
        ],
    },
    "post-hole-calculator": {
        subtitle: "Calculate concrete needed for fence post holes. Enter hole diameter, depth, post size, and number of holes for total bags needed.",
        explanation: {
            heading: "How to Calculate Concrete for Post Holes",
            paragraphs: [
                "Post hole concrete volume equals the hole volume minus the post volume: π × (hole radius)² × depth − π × (post radius)² × depth. Standard fence post holes are 10 inches diameter × 36 inches deep for a 4×4 post. Deck post holes are typically 12 inches diameter × 42–48 inches deep.",
                "Each 80 lb bag of concrete yields approximately 0.6 cubic feet. Quick-set concrete can be poured dry into the hole and wetted — no mixing required. For structural posts (decks, pergolas), use standard concrete mix and allow full cure time (24–48 hours before loading).",
            ],
            highlight: "10 fence post holes, 10\" diameter × 36\" deep with 4\" posts: concrete per hole ≈ 0.15 cu ft. Total = 1.5 cu ft ≈ 3 bags of 80 lb concrete. For 12\" holes, it's about 5 bags total.",
        },
        faq: [
            { question: "How deep should fence post holes be?", answer: "General rule: ⅓ of total post length should be in the ground. For a 6 ft fence (8 ft post): 32 inches deep minimum. For a 4 ft fence (6 ft post): 24 inches deep. In cold climates, posts should extend below the frost line to prevent heaving." },
            { question: "Should I use fast-setting or regular concrete?", answer: "Fast-setting (e.g., Quikrete Fast-Setting): sets in 20–40 minutes, can be poured dry — ideal for fence posts. Regular concrete: requires mixing, 24-hour set time — better for structural posts (deck, pergola) that need maximum strength. Never use fast-set for structural support posts." },
        ],
    },
    "mortar-calculator": {
        subtitle: "Calculate mortar mix needed for brick, block, or stone projects. Get pre-mix bags and site-mix quantities by wall area and joint thickness.",
        explanation: {
            heading: "How to Calculate Mortar Quantities",
            paragraphs: [
                "Mortar volume depends on masonry unit size and joint thickness. Standard bricks have about 7 joints per square foot of wall, CMU blocks have about 3.5, and natural stone varies widely. Multiply the number of joints by the joint cross-section area to get total mortar volume.",
                "Pre-mixed mortar bags (Type S or Type N) yield about 0.5–0.6 cubic feet per 60–80 lb bag. For site mixing, use a 1:3 portland-to-sand ratio by volume. Type S mortar is standard for structural and below-grade work; Type N is for above-grade non-structural applications.",
            ],
            highlight: "A 100 sq ft brick wall with 3/8-inch joints: mortar volume ≈ 1.8 cu ft. That's about 4 bags of 60 lb pre-mix, or about half a bag of portland cement plus 1.4 cu ft of sand.",
        },
        faq: [
            { question: "What type of mortar should I use?", answer: "Type S: structural walls, retaining walls, below-grade, and high-wind areas. Type N: above-grade exterior walls, chimneys, and general use. Type M: heavy loads, below-grade foundations. Type O: interior non-load-bearing walls only." },
            { question: "How long does mortar stay workable?", answer: "Pre-mixed mortar is workable for about 90 minutes after mixing (less in hot weather). Do not retemper mortar that has started to set. Mix small batches and use quickly for best bond strength." },
        ],
    },
    "concrete-footing-calculator": {
        subtitle: "Calculate concrete volume for continuous strip footings. Enter footing length, width, and depth for cubic yards and bag counts.",
        explanation: {
            heading: "How to Calculate Concrete Footing Volume",
            paragraphs: [
                "Continuous footings (strip footings) run along the base of foundation walls. The volume calculation is straightforward: length × width × depth. Standard residential footings are typically 16–24 inches wide and 8–12 inches deep, extending at least 12 inches below the frost line.",
                "Building codes generally require footings to be twice the width of the wall they support. For an 8-inch foundation wall, the footing should be at least 16 inches wide. Rebar reinforcement (typically #4 bars) is required in most jurisdictions.",
            ],
            highlight: "A 40 ft perimeter footing, 16 inches wide × 8 inches deep: volume = 40 × 1.33 × 0.67 = 35.7 cu ft = 1.32 cu yd. That is about 59 bags of 80 lb concrete.",
        },
        faq: [
            { question: "How deep do footings need to be?", answer: "Below the frost line in your area — ranges from 12 inches in warm climates to 48+ inches in northern states. Check local building codes. The bottom of the footing must rest on undisturbed, compacted soil." },
            { question: "Do footings need rebar?", answer: "Yes — most building codes require at least 2 continuous #4 (1/2 inch) rebar running the length of the footing, plus vertical dowels every 4 feet to tie into the foundation wall above." },
        ],
    },
    "landscape-rock-calculator": {
        subtitle: "Calculate decorative landscape rock, river rock, or boulders needed for gardens and yards. Get tons, cubic yards, and estimated cost.",
        explanation: {
            heading: "How to Calculate Landscape Rock",
            paragraphs: [
                "Landscape rock is sold by the ton or cubic yard. Different rock types have different densities: river rock weighs about 1.3 tons per cubic yard, lava rock is very light at 0.5 tons, and dense flagstone weighs about 1.5 tons per cubic yard.",
                "A typical decorative rock bed is 2–3 inches deep. For weed suppression under rock, install landscape fabric first. Order 5–10% extra for irregular shapes and settling. For large areas, bulk delivery is more cost-effective than bagged rock.",
            ],
            highlight: "A 10×10 ft rock bed at 3 inches deep with river rock: 25 cu ft = 0.93 cu yd × 1.3 tons/yd = 1.2 tons. At $50/ton, that is about $60 in material.",
        },
        faq: [
            { question: "How deep should landscape rock be?", answer: "Decorative ground cover: 2–3 inches. Weed barrier over fabric: 2 inches minimum. Drainage beds: 4–6 inches. Dry creek beds: 3–4 inches. Deeper is not always better — too much rock can feel unnatural." },
            { question: "Should I use landscape fabric under rock?", answer: "Yes — it prevents weed growth and keeps rock from sinking into soil. Use commercial-grade woven fabric, not cheap plastic sheeting. Overlap seams by 6 inches and secure with landscape staples every 12 inches." },
        ],
    },
    "roof-truss-calculator": {
        subtitle: "Calculate the number of roof trusses needed for a building. Enter building length, span, pitch, and truss spacing.",
        explanation: {
            heading: "How to Calculate Roof Trusses",
            paragraphs: [
                "The number of trusses equals the building length divided by truss spacing, plus one for the end. Standard truss spacing is 24 inches on center for residential, 16 inches OC for heavy snow loads. Common truss types include king post, queen post, Fink, and scissors.",
                "Truss span (building width) determines the truss size and lumber requirements. Spans up to 24 feet use 2×4 lumber; 24–36 feet typically use 2×6 lumber. Always consult an engineer for spans over 30 feet or unusual load conditions.",
            ],
            highlight: "A 30 ft building with 24-inch OC spacing: 30 / 2 + 1 = 16 trusses. For a 24 ft span at 6/12 pitch, each rafter is 13.4 ft long. Estimated lumber per truss: about 35 board feet.",
        },
        faq: [
            { question: "What truss spacing should I use?", answer: "24 inches OC: standard for most residential applications. 16 inches OC: heavy snow load areas, tile roofs, or when using lighter sheathing. 48 inches OC: agricultural buildings with heavy purlins. Check local codes for your snow and wind loads." },
            { question: "Can I cut or modify a truss?", answer: "Never cut or modify a manufactured truss without an engineer's approval. Removing any member — even a web — can cause catastrophic failure. If you need attic space, specify attic trusses at the design stage." },
        ],
    },
    "wainscoting-calculator": {
        subtitle: "Calculate wainscoting panels, chair rail, and baseboard needed for any room. Enter room dimensions, height, and panel specifications.",
        explanation: {
            heading: "How to Calculate Wainscoting Materials",
            paragraphs: [
                "Wainscoting covers the lower portion of walls, typically 32–36 inches high (one-third of wall height). Materials include beadboard panels, flat panels with applied moulding, or raised panel sections. Calculate the total wall length, subtract door openings, and divide by panel width.",
                "In addition to panels, you will need chair rail moulding along the top, baseboard along the bottom, and possibly cap moulding. All trim pieces are measured in linear feet matching the total coverable wall length.",
            ],
            highlight: "A 12×10 ft room with 1 door: perimeter = 44 ft, less 3 ft door = 41 ft coverable. With 48-inch wide panels: 41 / 4 = 11 panels. Plus 41 ft each of chair rail and baseboard.",
        },
        faq: [
            { question: "What is the standard wainscoting height?", answer: "Standard: 32–36 inches (one-third of an 8–9 ft wall). Bathroom: 48–54 inches for moisture protection. Stairways: follow the stair slope with a consistent distance from each step. Dining rooms: 36 inches is traditional." },
            { question: "What material is best for wainscoting?", answer: "MDF: smooth, paintable, most affordable, not for wet areas. Solid wood: premium look, can be stained. Beadboard: cottage/farmhouse style, available in MDF or wood. PVC: waterproof, ideal for bathrooms. For painted applications, MDF is the best value." },
        ],
    },
    "grading-calculator": {
        subtitle: "Calculate cut and fill volumes for land grading and leveling. Enter area dimensions and elevation changes for cubic yards of earthwork.",
        explanation: {
            heading: "How to Calculate Grading Volumes",
            paragraphs: [
                "Grading involves removing soil (cut) from high spots and adding soil (fill) to low spots to achieve the desired grade. The volume is calculated by multiplying the area by the average depth of cut or fill. For proper drainage, grade away from buildings at a minimum slope of 1/4 inch per foot.",
                "When cut volume exceeds fill, excess soil must be hauled away. When fill exceeds cut, soil must be imported. A standard dump truck carries about 14 cubic yards. Compacted fill volume is about 25% less than loose fill, so order extra material for fill areas.",
            ],
            highlight: "A 50×50 ft area with 6 inches of cut: 2,500 sq ft × 0.5 ft = 1,250 cu ft = 46.3 cu yd. That is about 3.3 dump truck loads to haul away.",
        },
        faq: [
            { question: "What slope is needed for drainage?", answer: "Minimum 1/4 inch per foot (2% grade) away from foundations for the first 10 feet. Swales and drainage channels: 1/2 to 1 inch per foot. Driveways: 1–2% for surface drainage. Yards: 2–5% is ideal for positive drainage." },
            { question: "How much does grading cost?", answer: "DIY with a skid steer rental: $250–$500/day. Professional grading: $1,500–$5,000 for a typical residential lot. Factors: area size, soil type, access difficulty, and how much soil needs to be hauled away or imported." },
        ],
    },
    "stucco-calculator": {
        subtitle: "Calculate stucco mix, metal lath, and supplies needed for exterior or interior walls. Accounts for doors and windows.",
        explanation: {
            heading: "How to Calculate Stucco Materials",
            paragraphs: [
                "Traditional three-coat stucco consists of a scratch coat, brown coat, and finish coat applied over metal lath on exterior walls. Total thickness is about 7/8 inch. An 80 lb bag of stucco mix covers approximately 25 square feet per coat.",
                "Metal lath sheets are typically 2.5 × 10.5 feet (about 27 sq ft each). Subtract door openings (about 21 sq ft each) and window openings (about 15 sq ft each) from the gross wall area to get the net stucco area.",
            ],
            highlight: "A house with four 40×9 ft walls, 2 doors, 8 windows: gross = 1,440 sq ft, minus 162 sq ft openings = 1,278 sq ft net. 3-coat stucco: about 154 bags of 80 lb mix and 48 lath sheets.",
        },
        faq: [
            { question: "How many coats of stucco are needed?", answer: "Traditional stucco: 3 coats (scratch, brown, finish) over metal lath. Total thickness: 7/8 inch. One-coat stucco: a single 3/8-inch application over foam insulation board — faster but less durable than traditional three-coat." },
            { question: "Can I apply stucco over existing siding?", answer: "Not recommended. Stucco needs a solid substrate — typically plywood or OSB sheathing with moisture barrier and metal lath. Applying stucco over existing siding can trap moisture and cause rot. Remove old siding first." },
        ],
    },
    "rain-barrel-calculator": {
        subtitle: "Calculate rainwater harvest potential from your roof area. Get gallons per rainstorm and number of barrels needed.",
        explanation: {
            heading: "How to Calculate Rainwater Collection",
            paragraphs: [
                "One inch of rain on 1 square foot of roof yields 0.623 gallons of water. A typical 30×40 ft roof section produces 748 gallons per inch of rain. Collection efficiency is about 75–85% due to evaporation, splash, and first-flush diversion.",
                "Standard rain barrels hold 55 gallons. Position barrels under downspouts and connect overflow to a garden or drainage area. For larger systems, multiple barrels can be linked together. Collected rainwater is excellent for garden irrigation.",
            ],
            highlight: "A 30×40 ft roof section with 1 inch of rain at 80% efficiency: 1,200 sq ft × 0.623 × 0.80 = 598 gallons. You would need 11 standard 55-gallon rain barrels to capture it all.",
        },
        faq: [
            { question: "Is collecting rainwater legal?", answer: "Laws vary by state. Most states allow residential rainwater collection. Colorado limits barrels to two 55-gallon barrels. Some states (Texas, Ohio) offer incentives. Check your local regulations before installing a system." },
            { question: "How do I keep rain barrel water clean?", answer: "Use a first-flush diverter to discard the first gallon (which carries roof debris). Add a fine mesh screen to keep mosquitoes out. Cover the barrel to block sunlight (prevents algae). Use collected water within a week or treat with a small amount of bleach." },
        ],
    },
    "concrete-curb-calculator": {
        subtitle: "Calculate concrete volume for curbs, mow strips, and landscape edging. Enter curb length, height, and width for cubic yards and bag counts.",
        explanation: {
            heading: "How to Calculate Concrete Curb Volume",
            paragraphs: [
                "Concrete curbs are simple rectangular shapes: length × height × width = volume. Standard residential landscape curbs are 6 inches tall and 6 inches wide. Street curbs are typically 6 inches tall and 6 inches wide with a 12–18 inch gutter pan.",
                "For curved sections, measure along the inside curve. Add 10% for waste on curved layouts. Use 3,000–4,000 PSI concrete mix for curbs exposed to freeze-thaw cycles. Extruded curbing machines can pour continuous curbs much faster than hand-forming.",
            ],
            highlight: "A 50 ft landscape curb, 6 inches tall × 6 inches wide: 50 × 0.5 × 0.5 = 12.5 cu ft = 0.46 cu yd. That is about 21 bags of 80 lb concrete.",
        },
        faq: [
            { question: "How long does concrete curbing last?", answer: "Properly installed concrete curbing lasts 25–50 years. Factors: concrete strength (use 4,000 PSI minimum), proper drainage base, expansion joints every 10 feet, and sealing every 2–3 years. Machine-extruded curbing is denser and lasts longer than hand-poured." },
            { question: "Do concrete curbs need rebar?", answer: "Short landscape curbs (under 6 inches tall) generally do not need rebar. Taller curbs (8+ inches), driveway curbs, and curbs subject to vehicle traffic should have #3 or #4 rebar running continuously through the length." },
        ],
    },
    "wire-mesh-calculator": {
        subtitle: "Calculate welded wire mesh sheets needed for concrete slab reinforcement. Enter slab dimensions and overlap for total sheet count.",
        explanation: {
            heading: "How to Calculate Wire Mesh for Concrete",
            paragraphs: [
                "Welded wire mesh (WWM) comes in standard 5×10 ft sheets or 5 ft wide rolls. Sheets must overlap a minimum of 6 inches on all edges. The most common specification is 6×6 W1.4/W1.4 (10 gauge wire on 6-inch grid) for residential flatwork.",
                "Calculate the number of sheets by dividing slab dimensions by effective sheet size (sheet size minus overlap). Wire mesh should be positioned in the upper third of the slab — use wire mesh chairs or rebar chairs to support it at the correct height during the pour.",
            ],
            highlight: "A 20×20 ft slab with 6-inch overlap: effective size = 4.5 × 9.5 ft. Sheets wide: 5, sheets long: 3. Total = 15 sheets of 5×10 ft welded wire mesh.",
        },
        faq: [
            { question: "What gauge wire mesh should I use?", answer: "Residential flatwork: 6×6 W1.4 (10 gauge). Driveways and garage floors: 6×6 W2.9 (6 gauge). Heavy industrial: 4×4 W2.9 (6 gauge). Heavier gauge and tighter spacing provide more reinforcement. Check engineering specs for commercial applications." },
            { question: "Is wire mesh better than rebar for slabs?", answer: "Wire mesh: faster to install, good for thin slabs (4 inches), controls shrinkage cracking. Rebar: stronger, better for thick slabs, structural applications, and heavy loads. Many contractors use both — rebar on the perimeter and at control joints, mesh in the field." },
        ],
    },
    "lintel-calculator": {
        subtitle: "Calculate lintel size and concrete volume for door and window openings. Enter span, load type, and wall thickness.",
        explanation: {
            heading: "How to Calculate Lintels",
            paragraphs: [
                "A lintel is a horizontal beam spanning an opening (door, window) to carry the load above. Minimum lintel depth is typically span/8 for light loads, deeper for heavier loads. Bearing length on each end should be at least half the span or 4 inches, whichever is greater.",
                "Concrete lintels are reinforced with rebar — typically 2 bars in the bottom for spans up to 4 feet, and 3–4 bars for wider spans. For pre-cast lintels, sizes are standardized. For cast-in-place, form the lintel in position and pour with at least 3,000 PSI concrete.",
            ],
            highlight: "A 36-inch window opening with 8-inch wall: minimum lintel depth = 4.5 inches (use 5 inches). Concrete volume per lintel = 36 × 8 × 5 / 1728 = 0.83 cu ft. Four lintels = 3.3 cu ft ≈ 6 bags of 80 lb mix.",
        },
        faq: [
            { question: "What size lintel do I need?", answer: "Rule of thumb: lintel depth = span ÷ 8 (minimum 4 inches). Width matches wall thickness. For a 3 ft opening in an 8-inch wall, use an 8×5 inch lintel minimum. Increase depth by 25–50% for load-bearing walls." },
            { question: "How much bearing does a lintel need?", answer: "Minimum bearing: 4 inches or half the span, whichever is greater. For a 36-inch span, 4 inches each end. For a 10 ft span, at least 6 inches each end. Always use bearing pads under steel lintels on masonry." },
        ],
    },
    "concrete-slab-calculator": {
        subtitle: "Calculate concrete volume for flat slabs — patios, garage floors, driveways, and walkways. Get cubic yards, bags, and ready-mix cost.",
        explanation: {
            heading: "How to Calculate Concrete Slab Volume",
            paragraphs: [
                "Slab volume = length × width × thickness. Standard residential slab thicknesses: sidewalks and patios = 4 inches, garage floors and driveways = 4–6 inches, heavy-duty industrial = 6–8 inches. Order 10% extra for waste, uneven subgrade, and form variations.",
                "Ready-mix concrete is sold by the cubic yard and costs $120–$160 per yard in most markets. For small jobs under 1 cubic yard, bagged concrete may be more practical. One cubic yard fills a 10×10 ft slab at 3.24 inches thick.",
            ],
            highlight: "A 20×12 ft patio at 4 inches thick: 20 × 12 × 0.33 = 80 cu ft = 2.96 cu yd. Order 3.26 cu yd (+10%). At $130/yd, ready-mix cost ≈ $424.",
        },
        faq: [
            { question: "How thick should my concrete slab be?", answer: "Foot traffic only (sidewalk, patio): 4 inches. Passenger vehicles (driveway, garage): 4–6 inches. Heavy trucks or equipment: 6–8 inches. Always pour on a 4-inch compacted gravel base with vapor barrier." },
            { question: "Do I need rebar in a concrete slab?", answer: "For 4-inch slabs, wire mesh is adequate. For driveways and garages (5–6 inches), use #3 or #4 rebar on 18-inch centers. Fiber mesh is a good addition for crack control. Always use control joints every 8–12 feet." },
        ],
    },
    "roof-decking-calculator": {
        subtitle: "Calculate roof decking (sheathing) panels needed for your roof. Accounts for roof pitch, waste, and standard 4×8 sheet size.",
        explanation: {
            heading: "How to Calculate Roof Decking",
            paragraphs: [
                "Roof decking area is larger than the footprint because of the pitch. Multiply the flat area by the pitch factor: √(1 + (pitch/12)²). A 6/12 pitch increases area by 11.8%. Common decking is 4×8 ft CDX plywood or 7/16-inch OSB (32 sq ft per sheet).",
                "Add 10–15% for waste — more for complex roof shapes with valleys, hips, and dormers. Decking must be staggered (joints offset by at least 4 feet) and fastened with 8d nails every 6 inches on edges and 12 inches in the field.",
            ],
            highlight: "A 30×24 ft gable roof at 6/12 pitch: flat area = 720 sq ft × 1.118 = 805 sq ft. With 10% waste = 886 sq ft ÷ 32 = 28 sheets of 4×8 plywood or OSB.",
        },
        faq: [
            { question: "Should I use plywood or OSB for roof decking?", answer: "OSB: less expensive, consistent quality, but swells when wet. Plywood (CDX): more moisture-resistant, stronger, preferred in high-humidity areas. Both work when properly installed. Use H-clips between rafters for 7/16-inch panels." },
            { question: "What thickness for roof decking?", answer: "24-inch OC rafters: 7/16-inch OSB or 1/2-inch plywood minimum. 16-inch OC: 3/8-inch minimum. For heavy snow loads or tile roofs: 5/8-inch or 3/4-inch. Check local codes for your snow load zone." },
        ],
    },
    "vapor-barrier-calculator": {
        subtitle: "Calculate vapor barrier sheeting needed for crawl spaces, under slabs, and on walls. Includes overlap and seam tape quantities.",
        explanation: {
            heading: "How to Calculate Vapor Barrier Material",
            paragraphs: [
                "Vapor barriers are polyethylene sheeting (typically 6–20 mil thick) installed to prevent moisture migration. For crawl spaces, cover the entire floor and run 6 inches up the walls. For under-slab applications, use 10-mil or thicker.",
                "Seams must overlap 6–12 inches and be sealed with vapor barrier tape. Calculate strips by dividing the width of the area by the effective roll width (roll width minus overlap). Standard roll sizes: 10 ft, 12 ft, or 20 ft wide × 100 ft long.",
            ],
            highlight: "A 20×15 ft crawl space with 10 ft rolls and 12-inch overlap: effective width = 9 ft. Strips needed: 2. Material = 40 lin ft. 1 roll (10×100 ft) is sufficient. Seam tape: 20 lin ft.",
        },
        faq: [
            { question: "How thick should a vapor barrier be?", answer: "Crawl spaces: 6-mil minimum, 12–20 mil preferred. Under concrete slabs: 10-mil minimum (15-mil recommended). Wall applications: 6-mil poly. Thicker is always better — thin poly tears easily during construction." },
            { question: "Do I need a vapor barrier under a concrete slab?", answer: "Yes — always. Moisture wicking through a slab can cause flooring failures, mold, and humidity problems. Use 10-mil or thicker poly directly under the slab (not buried in gravel). Seal all seams and penetrations with vapor barrier tape." },
        ],
    },
    "excavation-calculator": {
        subtitle: "Calculate excavation volume for foundations, pools, and trenches. Get bank and loose cubic yards with swell factor by soil type.",
        explanation: {
            heading: "How to Calculate Excavation Volume",
            paragraphs: [
                "Excavation volumes must account for swell — soil expands when removed from the ground. Clay swells 35%, common earth 25%, sand 10%, and rock 50%. Bank cubic yards (in ground) × swell factor = loose cubic yards (in truck).",
                "Standard dump trucks hold about 14 cubic yards of loose material. For trenches, add 1–2 feet of extra width for working space around foundations and utilities. Stockpiled soil will also need more space than in-ground volume due to swell.",
            ],
            highlight: "A 20×15×4 ft foundation excavation in clay: bank volume = 44.4 cu yd × 1.35 swell = 60 cu yd loose. That is about 4.3 truck loads.",
        },
        faq: [
            { question: "What is the swell factor for different soils?", answer: "Sand/gravel: 10–15% swell. Common earth: 20–30%. Clay: 30–40%. Shale: 40–50%. Rock: 50–70%. These factors mean you need more trucks to haul material than the in-ground volume suggests." },
            { question: "How deep do I need to excavate for a foundation?", answer: "Depends on frost depth and footing requirements: 18–24 inches in temperate climates, 36–48 inches in cold climates. Add footing depth + 4 inches for gravel base. Always excavate to undisturbed soil — never pour footings on fill." },
        ],
    },
    "crown-molding-calculator": {
        subtitle: "Calculate crown molding needed for any room. Enter room dimensions and molding piece length for total linear feet and pieces.",
        explanation: {
            heading: "How to Calculate Crown Molding",
            paragraphs: [
                "Crown molding is measured by room perimeter. Measure each wall separately to account for closets, alcoves, and bump-outs. Standard piece lengths are 8, 12, or 16 feet. Add 10% for waste — crown molding cuts at compound angles waste material at each joint.",
                "Inside corners require coped joints (preferred) or compound miter cuts. Outside corners use miter joints. Count corners to plan your cuts. For a typical rectangular room, you have 4 inside corners and 0 outside corners.",
            ],
            highlight: "A 14×12 ft room: perimeter = 52 ft + 10% waste = 57.2 ft. With 8 ft pieces: 8 pieces needed. 4 inside corner cope cuts.",
        },
        faq: [
            { question: "What angle do I cut crown molding?", answer: "Standard crown sits at 38° (52/38 spring angle). Miter angle: 31.6°. Bevel angle: 33.9°. Most compound miter saws have crown molding settings. Alternatively, cut it upside down on a flat miter saw at 45°." },
            { question: "What size crown molding should I use?", answer: "8 ft ceilings: 3.5–4.5 inch crown. 9 ft ceilings: 4.5–6 inch. 10+ ft ceilings: 6–8 inch or built-up combinations. Larger molding has more visual impact but costs more and is harder to install." },
        ],
    },
    "soffit-calculator": {
        subtitle: "Calculate soffit panels, J-channel, and fascia needed for roof overhang enclosures. Enter perimeter and overhang width.",
        explanation: {
            heading: "How to Calculate Soffit Materials",
            paragraphs: [
                "Soffit covers the underside of the roof overhang. Area = perimeter × overhang width. Standard soffit panels are 12 inches wide by 12 feet long. Vented soffit provides attic ventilation — use it for at least 50% of soffit area.",
                "J-channel runs along both edges (wall side and fascia side) — so you need twice the perimeter in J-channel. Fascia board covers the vertical face of the overhang, matching the perimeter length. F-channel can replace J-channel where soffit meets the wall.",
            ],
            highlight: "A house with 120 ft perimeter and 12-inch overhang: soffit area = 120 sq ft. With 12-inch × 12-ft panels: 10 panels. J-channel: 240 lin ft. Fascia: 120 lin ft.",
        },
        faq: [
            { question: "Should I use vented or solid soffit?", answer: "Use vented soffit for proper attic ventilation — it prevents moisture buildup, ice dams, and heat buildup. Code typically requires 1 sq ft of soffit vent per 150 sq ft of attic floor. Combine with ridge vents for best airflow." },
            { question: "What material is best for soffit?", answer: "Aluminum: most popular, durable, low maintenance, available vented. Vinyl: affordable, easy to install, comes in many colors. Wood: traditional look, requires painting, prone to rot. Fiber cement: premium, fireproof, long-lasting." },
        ],
    },
    "rip-rap-calculator": {
        subtitle: "Calculate rip rap stone needed for erosion control, embankments, and shoreline protection. Get tons and cubic yards by area and thickness.",
        explanation: {
            heading: "How to Calculate Rip Rap",
            paragraphs: [
                "Rip rap is large, angular stone (typically 4–24 inches diameter) used for erosion control. It weighs about 1.5 tons per cubic yard. Minimum thickness should be 1.5× the maximum stone diameter, or 12 inches, whichever is greater.",
                "Place rip rap on filter fabric (geotextile) to prevent fine soil from migrating through the rock layer. For slopes steeper than 2:1, use grouted rip rap or consider retaining walls instead. Size selection depends on water velocity and slope angle.",
            ],
            highlight: "A 30×10 ft stream bank at 12 inches thick: volume = 300 cu ft = 11.1 cu yd × 1.5 = 16.7 tons. At $40/ton, cost ≈ $667.",
        },
        faq: [
            { question: "What size rip rap do I need?", answer: "Class I (4–8 inch): ditches and mild slopes. Class II (8–15 inch): stream banks and moderate flow. Class III (15–24 inch): heavy flow, shorelines, and steep slopes. Consult an engineer for specific hydraulic conditions." },
            { question: "Do I need filter fabric under rip rap?", answer: "Yes — always use non-woven geotextile filter fabric under rip rap. Without it, fine soil washes through the rocks, undermining the protection. Overlap fabric seams 12 inches and pin with landscape staples." },
        ],
    },
    "baseboard-calculator": {
        subtitle: "Calculate baseboard trim for any room. Enter room dimensions, number of doors, and piece length for total linear feet and pieces needed.",
        explanation: {
            heading: "How to Calculate Baseboard",
            paragraphs: [
                "Baseboard is measured by room perimeter minus door openings (standard door width = 3 ft). Add 10% for waste from cuts — especially inside and outside corner miters. Standard piece lengths are 8, 12, or 16 feet.",
                "Inside corners use cope joints (one piece butted, one coped to fit). Outside corners use 45° miter joints. Count the corners to plan joint types. Use a scarf joint (overlapping 45° cut) where two straight pieces meet along a wall.",
            ],
            highlight: "A 14×12 ft room with 2 doors: perimeter = 52 ft minus 6 ft doors = 46 ft + 10% = 50.6 ft. With 8 ft pieces: 7 pieces. 2 inside corners (after subtracting door positions).",
        },
        faq: [
            { question: "What size baseboard should I use?", answer: "3.25 inch: standard for most homes. 5.25 inch: popular upgrade for modern homes. 7.25+ inch: Victorian, craftsman, and high-end homes. Taller baseboard adds perceived luxury. Match style to crown molding." },
            { question: "How do I handle inside corners?", answer: "Coping is superior to mitering for inside corners. Cut the first piece square to the wall. Cut the second piece at 45°, then cope (cut along the profile with a coping saw). This accommodates walls that are not perfectly square." },
        ],
    },
    "concrete-wall-calculator": {
        subtitle: "Calculate concrete volume for poured walls — foundations, retaining walls, and privacy walls. Enter length, height, and thickness.",
        explanation: {
            heading: "How to Calculate Concrete Wall Volume",
            paragraphs: [
                "Wall volume = length × height × thickness. Standard foundation walls are 8 inches thick for 1-story homes and 10 inches for 2-story. Basement walls are typically 8–10 inches thick and 8 feet tall. Add 5% for waste and form settlement.",
                "Poured concrete walls require steel forms, rebar reinforcement, and proper curing. Walls over 4 feet tall need horizontal and vertical rebar — typically #4 bars at 12-inch centers both ways. Plan for inspection before the pour.",
            ],
            highlight: "A 40 ft foundation wall, 8 ft high, 8 inches thick: 40 × 8 × 0.67 = 213 cu ft = 7.9 cu yd. Order 8.3 cu yd (+5%). At $130/yd, cost ≈ $1,079.",
        },
        faq: [
            { question: "How thick should a concrete wall be?", answer: "Foundation walls: 8 inches for 1-story, 10 inches for 2-story, 12 inches for 3-story or deep basements. Retaining walls: 8 inches for walls under 4 ft, 10–12 inches for taller walls. Garden/privacy walls: 4–6 inches with pilasters." },
            { question: "How long before I can backfill against a concrete wall?", answer: "Wait at least 7 days — preferably 14 days — for the concrete to reach adequate strength before backfilling. Apply waterproofing, install drainage board, and place drain tile before backfilling. Never backfill with heavy clay directly against the wall." },
        ],
    },
    "french-drain-calculator": {
        subtitle: "Calculate gravel, pipe, and filter fabric needed for a French drain. Enter trench dimensions and pipe size.",
        explanation: {
            heading: "How to Calculate French Drain Materials",
            paragraphs: [
                "A French drain is a gravel-filled trench with a perforated pipe that redirects surface and groundwater away from foundations. Standard dimensions: 12 inches wide × 18 inches deep minimum. The pipe sits at the bottom on 2 inches of gravel, with gravel filling the rest of the trench.",
                "Wrap the entire trench with landscape filter fabric before adding gravel to prevent soil from clogging the system. Use washed crushed stone (3/4 inch) — not pea gravel, which can migrate into the pipe perforations.",
            ],
            highlight: "A 30 ft French drain, 12 inches wide × 18 inches deep: gravel ≈ 1.6 cu yd (2.2 tons). Perforated pipe: 30 lin ft. Filter fabric: about 120 sq ft.",
        },
        faq: [
            { question: "How deep should a French drain be?", answer: "Minimum 18 inches deep for surface water. For foundation drainage, dig to the footing level — typically 24–36 inches. The pipe should slope at least 1% (1 inch per 8 feet) toward the outlet. Deeper is better for intercepting groundwater." },
            { question: "What size pipe for a French drain?", answer: "4-inch perforated pipe handles most residential applications. Use 6-inch for heavy flow areas or long runs over 50 feet. Rigid PVC is more durable than flexible corrugated pipe. Place holes facing down for groundwater, up for surface water." },
        ],
    },
    "concrete-pier-calculator": {
        subtitle: "Calculate concrete volume for cylindrical piers and Sonotube footings. Enter diameter, depth, and quantity.",
        explanation: {
            heading: "How to Calculate Concrete Pier Volume",
            paragraphs: [
                "Pier volume uses the cylinder formula: π × r² × h. Common pier diameters: 8 inches for light loads (fences), 12 inches for deck posts, 18–24 inches for heavy structural loads. Depth must reach below the frost line — 36 to 48 inches in most northern climates.",
                "Sonotube cardboard forms make pouring cylindrical piers easy. Set the tube, add rebar (typically 2 vertical #4 bars), pour concrete, and insert a post bracket before the concrete sets. One 80 lb bag of concrete fills about 0.6 cubic feet.",
            ],
            highlight: "Six 12-inch diameter piers × 48 inches deep: volume each = 3.14 cu ft. Total = 18.8 cu ft = 0.70 cu yd ≈ 32 bags of 80 lb concrete.",
        },
        faq: [
            { question: "What diameter pier do I need?", answer: "Fence posts: 8–10 inches. Deck posts: 12 inches minimum. Load-bearing columns: 18–24 inches. Check local code for required footing size based on soil bearing capacity and tributary load." },
            { question: "How deep should concrete piers be?", answer: "At minimum below the frost line: 36 inches in moderate climates, 42–48 inches in cold climates. Check local building codes. Foundation piers may need to reach 5–6 feet to hit bearing soil. Always pour on undisturbed soil." },
        ],
    },
    "house-wrap-calculator": {
        subtitle: "Calculate house wrap (weather barrier) for exterior walls. Enter wall dimensions and openings for total rolls needed.",
        explanation: {
            heading: "How to Calculate House Wrap",
            paragraphs: [
                "House wrap is a weather-resistant barrier (WRB) installed over exterior sheathing before siding. Calculate net wall area by subtracting door and window openings from gross wall area. Add 10% for overlaps — horizontal laps should be 6 inches, vertical laps 12 inches.",
                "Standard rolls are 9 ft × 100 ft (900 sq ft) or 9 ft × 150 ft (1,350 sq ft). Install from bottom up so upper courses overlap lower courses. Tape all seams and penetrations with manufacturer-recommended tape.",
            ],
            highlight: "A home with 4 walls averaging 40 ft × 9 ft, 2 doors, and 8 windows: gross area = 1,440 sq ft minus 162 sq ft openings = 1,278 sq ft + 10% = 1,406 sq ft ≈ 2 rolls.",
        },
        faq: [
            { question: "Is house wrap necessary?", answer: "Yes — building code requires a weather-resistant barrier in most jurisdictions. House wrap prevents bulk water intrusion while allowing moisture vapor to escape, protecting sheathing and framing from rot. It also reduces air infiltration." },
            { question: "What is the best house wrap?", answer: "Tyvek HomeWrap is the industry standard. ZIP System (integrated sheathing + WRB) is gaining popularity. Other options: Typar, Henry Blueskin (self-adhered). Key factors: water resistance, vapor permeability, and durability during construction exposure." },
        ],
    },
    "stair-railing-calculator": {
        subtitle: "Calculate stair railing materials — balusters, posts, and rails. Enter railing length and spacing requirements.",
        explanation: {
            heading: "How to Calculate Stair Railing Materials",
            paragraphs: [
                "Building code requires railings on stairs with 4 or more risers. Rail height must be 34–38 inches measured from the stair nosing. Balusters must be spaced so a 4-inch sphere cannot pass through — typically 4 inches on center with standard balusters.",
                "Posts are required at the top and bottom of each stair run, and every 6–8 feet along the run. Top and bottom rails run the full railing length. Calculate balusters by dividing the railing length by the on-center spacing, then add one.",
            ],
            highlight: "A 12 ft stair railing at 4-inch baluster spacing: 37 balusters, 3 posts, 12 lin ft of top and bottom rail.",
        },
        faq: [
            { question: "What is the code for stair railing height?", answer: "IRC requires 34–38 inches measured vertically from the stair nosing to the top of the handrail. Guardrails (landing/deck) must be 36 inches minimum (42 inches in commercial). Graspable handrails must be 1.25–2 inches in diameter." },
            { question: "How far apart can balusters be on stairs?", answer: "Code requires that a 4-inch sphere cannot pass through any opening. With 1.5-inch balusters, on-center spacing is about 5.5 inches (4-inch gap + 1.5-inch width). On open risers, a 6-inch sphere cannot pass through." },
        ],
    },
    "drop-ceiling-calculator": {
        subtitle: "Calculate drop ceiling tiles, grid components, and hardware for a suspended ceiling. Enter room dimensions and tile size.",
        explanation: {
            heading: "How to Calculate Drop Ceiling Materials",
            paragraphs: [
                "A drop (suspended) ceiling consists of wall angle around the perimeter, main runners every 4 feet, cross tees connecting the runners, and ceiling tiles filling the grid. Standard tile sizes are 2×4 ft and 2×2 ft.",
                "Main runners hang from the joists/deck above with hanger wires every 4 feet. Install the ceiling at least 3 inches below the lowest obstruction (pipes, ducts). For 2×2 tiles, extra cross tees are needed to subdivide the 2×4 grid.",
            ],
            highlight: "A 14×12 ft room with 2×4 tiles: area = 168 sq ft. Tiles: 21. Main runners: 36 lin ft. Wall angle: 52 lin ft. Hang wires: 11 pieces.",
        },
        faq: [
            { question: "How low does a drop ceiling hang?", answer: "Minimum 3 inches below the lowest obstruction (pipe, duct, beam). Typical clearance is 4–6 inches. You need at least 7.5 ft finished ceiling height in habitable rooms (check local code). For recessed lights, allow 6+ inches." },
            { question: "Are 2×2 or 2×4 tiles better?", answer: "2×4 tiles: fewer grid pieces, faster installation, more economical. 2×2 tiles: more modern appearance, stiffer (less sag), easier to handle. Both use the same main runner grid — 2×2 just adds mid-span cross tees." },
        ],
    },
    "concrete-column-calculator": {
        subtitle: "Calculate concrete volume for square, rectangular, or round columns. Enter dimensions, height, and quantity.",
        explanation: {
            heading: "How to Calculate Concrete Column Volume",
            paragraphs: [
                "For rectangular columns: volume = width × depth × height. For round columns: volume = π × r² × height. Common residential columns are 12×12 inches square or 12 inches diameter. Structural columns may be 18–36 inches.",
                "All concrete columns require reinforcement — typically 4 vertical #5 or #6 bars with #3 ties every 12 inches. Forms must be plumb, braced, and oiled before pouring. Vibrate the concrete during placement to eliminate air pockets.",
            ],
            highlight: "Four 12×12 inch square columns × 10 ft tall: volume each = 10 cu ft. Total = 40 cu ft = 1.48 cu yd ≈ 67 bags of 80 lb mix.",
        },
        faq: [
            { question: "What size concrete column do I need?", answer: "Size depends on the load: residential porch posts 12×12 inches, carport columns 16×16, commercial 18–36 inches. Rule of thumb: column width should be at least 1/12 of the unsupported height. Always get engineering for structural columns." },
            { question: "How much rebar in a concrete column?", answer: "Minimum: 4 vertical bars, 1% of cross-sectional area. Typical residential: 4 #5 bars with #3 ties at 12 inches. Lap splice vertical bars 40 diameters (25 inches for #5). Ties should be spaced no more than 16 bar diameters or 48 tie diameters." },
        ],
    },
    "flashing-calculator": {
        subtitle: "Calculate roof and wall flashing for chimneys, valleys, drip edges, and penetrations. Get total linear feet and metal area.",
        explanation: {
            heading: "How to Calculate Flashing Materials",
            paragraphs: [
                "Flashing prevents water intrusion at roof intersections, penetrations, and transitions. Add up all valley runs, step flashing along walls, chimney perimeters, and drip edge lengths. Typical flashing widths: 4–8 inches for step flashing, 12–18 inches for valleys.",
                "Materials include aluminum (economical), galvanized steel (durable), copper (premium/long-lasting), and lead (chimneys). Step flashing pieces are typically 5×7 inches, overlapping shingle-style. Valley flashing uses W-shaped or open metal.",
            ],
            highlight: "A roof with 20 ft of valley, 16 ft of step flashing, 8 ft chimney perimeter, and 80 ft drip edge at 8-inch width: total = 124 lin ft of flashing = 83 sq ft of metal.",
        },
        faq: [
            { question: "What type of flashing should I use?", answer: "Aluminum: affordable, easy to bend, corrosion-resistant. Galvanized steel: stronger, good for drip edges. Copper: premium, 100+ year life, develops patina. Never mix copper with galvanized (galvanic corrosion). Use lead or lead-coated copper for chimney cricket flashing." },
            { question: "How wide should flashing be?", answer: "Step flashing: 5×7 inches minimum. Valleys: 12 inches minimum each side (24 total), 18 inches for low-slope roofs. Drip edge: 2×3 inches typical. Chimney base flashing: 8–12 inches. Always extend flashing 4+ inches under roofing material." },
        ],
    },
    "baluster-calculator": {
        subtitle: "Calculate balusters needed for deck or porch railings. Enter railing length, baluster width, and maximum gap spacing.",
        explanation: {
            heading: "How to Calculate Balusters",
            paragraphs: [
                "Building code requires that a 4-inch sphere cannot pass through railing openings. This means the maximum gap between balusters is 3.5 inches (accounting for the sphere contacting both sides). Divide the railing length by on-center spacing (baluster width + gap), then add 1.",
                "Standard balusters are 1.5 inches square (wood) or 0.75 inches (metal). Proper spacing ensures code compliance while maintaining visual balance. Use equal spacing — calculate the actual gap by distributing evenly across the full railing length.",
            ],
            highlight: "A 20 ft railing with 1.5-inch wood balusters at 4-inch max gap: on-center spacing = 5.5 inches. Balusters = 44 pieces.",
        },
        faq: [
            { question: "What is code-compliant baluster spacing?", answer: "IRC and IBC require that a 4-inch sphere cannot pass through any opening. With 1.5-inch balusters, max gap = 3.5 inches, giving 5-inch on-center spacing. Many builders use 4-inch spacing for a safer, cleaner look." },
            { question: "How do I space balusters evenly?", answer: "Measure total railing length between posts. Divide by desired on-center spacing to get the number of spaces. Adjust the gap slightly so all spaces are equal. Use a spacer jig cut to the exact gap width for consistent installation." },
        ],
    },
    "backsplash-calculator": {
        subtitle: "Calculate tile, grout, and adhesive for kitchen or bathroom backsplashes. Enter dimensions and tile size.",
        explanation: {
            heading: "How to Calculate Backsplash Tile",
            paragraphs: [
                "Backsplash area = length × height. Standard backsplash height is 18 inches (countertop to upper cabinets). Full-height backsplashes go to the ceiling (36–42 inches). Add 10% for waste from cuts, especially around outlets and corners.",
                "Subway tile (3×6 inches) is the most popular backsplash choice. Count tiles by dividing the total area by individual tile area. Grout coverage: about 0.5 lbs per square foot for subway tile. Use unsanded grout for joints 1/8 inch or smaller.",
            ],
            highlight: "A 10 ft backsplash × 18 inches high with 3×6 subway tile: area = 15 sq ft + 10% = 16.5 sq ft ≈ 132 tiles. Grout: 7.5 lbs.",
        },
        faq: [
            { question: "What is the most popular backsplash tile?", answer: "3×6 inch subway tile in white or neutral tones is the most popular — timeless, affordable, and versatile. Running bond (brick pattern) is the classic layout. Other popular options: herringbone, 4×12 stacked, hexagon, and penny tile." },
            { question: "How high should a kitchen backsplash be?", answer: "Standard: 18 inches (countertop to upper cabinets). Full height: countertop to ceiling (no upper cabinets). Behind the stove: extend to the range hood, typically 24–30 inches. Minimum recommended: 4 inches to protect the wall from splashes." },
        ],
    },
    "trench-fill-calculator": {
        subtitle: "Calculate backfill material for utility trenches. Enter trench dimensions and fill material type for cubic yards and tons.",
        explanation: {
            heading: "How to Calculate Trench Fill Volume",
            paragraphs: [
                "Trench fill volume = length × width × depth. For utility trenches, the fill typically consists of bedding material (sand or pea gravel around the pipe) and backfill (native soil or gravel above). Pipe diameter reduces the fill volume slightly.",
                "Standard utility trench widths: 12 inches for small pipes (water, electrical), 18–24 inches for sewer and drain pipes, 36–48 inches for large utilities. Compact backfill in 6-inch lifts to prevent settlement. Use clean fill — no rocks, debris, or organic material.",
            ],
            highlight: "A 30 ft trench, 12 inches wide × 24 inches deep with gravel fill: volume = 60 cu ft = 2.2 cu yd ≈ 3.1 tons.",
        },
        faq: [
            { question: "What should I backfill a trench with?", answer: "Above pipes: 6 inches of sand or pea gravel bedding, then native soil or clean fill in 6-inch compacted lifts. For drainage trenches: washed gravel. For structural fills: compactable gravel (road base). Never use clay, organic soil, or material with large rocks." },
            { question: "How wide should a utility trench be?", answer: "Water lines: 12-18 inches. Sewer pipes: pipe diameter + 12 inches. Electrical conduit: 6–12 inches. Gas lines: 12–18 inches. Wider trenches are easier to work in but require more backfill. Bell holes are needed at pipe joints." },
        ],
    },
    "concrete-driveway-calculator": {
        subtitle: "Calculate concrete volume for a new driveway. Get cubic yards, bag count, and ready-mix cost estimate.",
        explanation: {
            heading: "How to Calculate Concrete for a Driveway",
            paragraphs: [
                "Driveway concrete volume = length × width × thickness. Standard residential driveway thickness is 4–5 inches for passenger cars and 5–6 inches for heavy vehicles. Always order 10% extra for waste, subgrade variations, and over-excavation.",
                "A two-car driveway is typically 20–24 feet wide. Single-car driveways are 10–12 feet wide. Include aprons, turnarounds, and walkways in your calculations. Ready-mix concrete costs $120–$160 per cubic yard delivered.",
            ],
            highlight: "A 40×12 ft driveway at 5 inches thick: volume = 200 cu ft = 7.41 cu yd. Order 8.15 cu yd (+10%). At $130/yd, ready-mix cost ≈ $1,060.",
        },
        faq: [
            { question: "How thick should a concrete driveway be?", answer: "Passenger cars: 4 inches minimum, 5 inches recommended. Heavy vehicles (RVs, trucks): 5–6 inches. Commercial: 6–8 inches. Always pour on 4 inches of compacted gravel base. Thicken edges to 6 inches for support." },
            { question: "How much does a concrete driveway cost?", answer: "Materials: $8–$12 per sq ft for basic broom finish. Stamped or colored: $12–$20 per sq ft. Professional installation adds $3–$8 per sq ft for labor. A 40×12 ft driveway: $4,000–$8,000 total installed." },
        ],
    },
    "shingle-calculator": {
        subtitle: "Calculate roofing shingle bundles needed for your roof. Enter dimensions, pitch, and waste factor.",
        explanation: {
            heading: "How to Calculate Roofing Shingles",
            paragraphs: [
                "Roofing is measured in squares — one square = 100 sq ft. Standard 3-tab shingles come 3 bundles per square. Architectural shingles may require 4–5 bundles per square. Account for roof pitch using the pitch multiplier.",
                "Add 10–15% waste for valleys, hips, ridges, and starter courses. Complex roofs with many valleys and dormers waste more material. Ridge cap shingles are sold separately — plan 1 bundle per 20–35 linear feet of ridge.",
            ],
            highlight: "A 30×24 ft gable roof at 6/12 pitch: flat area = 720 sq ft × 1.118 = 805 sq ft + 10% = 886 sq ft = 8.9 squares = 27 bundles of 3-tab shingles.",
        },
        faq: [
            { question: "How many bundles of shingles per square?", answer: "3-tab shingles: 3 bundles per square. Architectural/dimensional: 3–5 bundles per square (varies by brand). Check the coverage listed on each bundle — it ranges from 25 to 33.3 sq ft per bundle." },
            { question: "How long do shingles last?", answer: "3-tab shingles: 15–20 years. Architectural/dimensional: 25–30 years. Premium architectural: 30–50 years. Metal roofing: 40–70 years. Lifespan depends on ventilation, sun exposure, and climate." },
        ],
    },
    "caulk-calculator": {
        subtitle: "Calculate caulk tubes needed for sealing joints. Enter joint length, width, and depth for tube count.",
        explanation: {
            heading: "How to Calculate Caulk Quantity",
            paragraphs: [
                "Caulk volume = joint length × width × depth. A standard 10.3 oz cartridge contains about 18.8 cubic inches of caulk. Squeeze tubes (5.5 oz) contain about 10 cubic inches. Calculate the joint cross-section and multiply by total length.",
                "For joints wider than 1/2 inch, use backer rod to fill the gap first, then caulk. The ideal caulk joint is wider than it is deep — a 2:1 width-to-depth ratio provides the best adhesion and flexibility.",
            ],
            highlight: "50 ft of 1/4 × 1/4 inch joints: volume = 600 × 0.25 × 0.25 = 37.5 cu in ÷ 18.8 = 2 tubes of 10.3 oz caulk.",
        },
        faq: [
            { question: "How much does a tube of caulk cover?", answer: "A 10.3 oz tube covers: 1/8 inch bead = 96 lin ft. 1/4 inch bead = 48 lin ft. 3/8 inch bead = 24 lin ft. 1/2 inch bead = 12 lin ft. Joint depth matters too — deeper joints use more caulk per foot." },
            { question: "What type of caulk should I use?", answer: "Exterior/windows: polyurethane or silicone. Bathrooms: 100% silicone (mold-resistant). Interior trim: acrylic latex (paintable). Concrete: polyurethane. Roof: roofing sealant. Never use silicone where you plan to paint." },
        ],
    },
    "gable-wall-calculator": {
        subtitle: "Calculate gable wall area for siding, sheathing, or framing. Enter base width and peak height.",
        explanation: {
            heading: "How to Calculate Gable Wall Area",
            paragraphs: [
                "A gable wall is the triangular end wall of a building where the roof slopes meet. Area = (base × height) / 2. Most homes have two gable ends. Include gable area in your siding, sheathing, and painting calculations.",
                "For siding coverage, add 10% waste for cutting triangular pieces. For sheathing (4×8 sheets), divide the total area by 32 sq ft per sheet. Gable vents, if present, reduce the area slightly.",
            ],
            highlight: "Two gable ends, 24 ft base × 8 ft peak: area each = 96 sq ft. Total = 192 sq ft. Sheathing: 6 sheets. Siding (+10%): 211 sq ft.",
        },
        faq: [
            { question: "How do I frame a gable wall?", answer: "Frame the gable wall on top of the end wall, using 2×4 or 2×6 studs on 16-inch centers. Cut each stud to follow the roof slope. A ridge board runs across the top. Use a template or layout the angle on the bottom plate." },
            { question: "Should I vent gable walls?", answer: "Gable vents help ventilate attics when used alone or with soffit vents. However, mixing gable vents with ridge vents can cause short-circuiting of airflow. The best system is continuous soffit vents + ridge vent (no gable vents)." },
        ],
    },
    "deck-board-calculator": {
        subtitle: "Calculate deck boards needed for your deck surface. Enter dimensions, board width, and gap spacing.",
        explanation: {
            heading: "How to Calculate Deck Boards",
            paragraphs: [
                "Count deck boards by dividing the deck width by the board width plus gap. Standard composite boards are 5.5 inches wide with a 1/8-inch gap. Wood boards (5/4×6) are 5.5 inches actual width. Always run boards perpendicular to joists.",
                "Each board needs 2 screws at every joist crossing (typically 16-inch centers). For a 16 ft board crossing joists at 16 inches, that is about 24 screws per board. Hidden fastener systems use 1 clip per joist per board.",
            ],
            highlight: "A 16×12 ft deck with 5.5-inch boards and 1/8-inch gap: 26 boards × 16 ft = 416 lin ft. About 1,248 deck screws.",
        },
        faq: [
            { question: "How far apart should deck boards be?", answer: "Wood boards: 1/8 to 1/4 inch gap for drainage and expansion. Composite boards: follow manufacturer specs (usually 1/8 inch side-to-side, 1/8 to 3/16 inch end-to-end). In hot climates, allow slightly more for thermal expansion." },
            { question: "Wood or composite decking?", answer: "Wood (pressure-treated): $2–$4/lin ft, requires annual maintenance, 10–15 year lifespan. Composite: $5–$12/lin ft, minimal maintenance, 25–50 year warranty. PVC: $8–$14/lin ft, no moisture absorption, best for pool decks." },
        ],
    },
    "mortar-bed-calculator": {
        subtitle: "Calculate mortar for tile or stone setting beds. Enter area, bed thickness, and mortar type for bag count.",
        explanation: {
            heading: "How to Calculate Mortar Bed Material",
            paragraphs: [
                "Mortar bed thickness determines the type: thinset (1/4 inch or less) for flat surfaces, medium-bed (1/4 to 3/4 inch) for slight leveling, and thick-bed/mud bed (3/4 to 1.5 inches) for significant leveling or shower pans.",
                "A 50 lb bag of thinset covers about 95 sq ft at 1/4 inch with a 1/4×1/4 inch notched trowel. Coverage decreases proportionally with thicker applications. Large-format tiles (over 15 inches) require back-buttering.",
            ],
            highlight: "A 50 sq ft shower floor with 3/4-inch thick mud bed: coverage per bag ≈ 8 sq ft. Need about 7 bags of 50 lb mortar = 350 lbs.",
        },
        faq: [
            { question: "How thick should a mortar bed be?", answer: "Thinset: 3/16 to 1/4 inch for flat substrates. Medium-bed: 1/4 to 3/4 inch for slight unevenness. Thick bed (mud bed): 3/4 to 1.5 inches for shower pans and major leveling. Never exceed the manufacturer's maximum thickness." },
            { question: "What is the difference between thinset and mortar?", answer: "Thinset is a thin-layer Portland cement adhesive for tile. Mortar (mud) is a thicker sand-cement mix for setting beds and leveling. Use thinset for most tile work. Use a mud bed for shower floors, large-format stone, and uneven substrates." },
        ],
    },
    "window-trim-calculator": {
        subtitle: "Calculate window trim (casing) needed for all windows. Enter window sizes and quantity for total linear feet.",
        explanation: {
            heading: "How to Calculate Window Trim",
            paragraphs: [
                "Window trim perimeter = 2 × (width + height) for each window. Multiply by the number of windows for total linear feet. Add 10% for waste from miter cuts at corners. Standard window casing is 2.25 to 3.5 inches wide.",
                "For picture-frame style casing (trim on all 4 sides), calculate the full perimeter. For traditional casing with a sill/stool, calculate 3 sides (top and both sides) plus the sill and apron separately.",
            ],
            highlight: "Eight windows at 36×48 inches: perimeter each = 14 ft. Total = 112 ft + 10% = 123 ft. That is 16 pieces of 8 ft trim.",
        },
        faq: [
            { question: "What width window casing should I use?", answer: "2.25 inch: standard builder-grade. 3.25 inch: popular upgrade. 3.5 inch: craftsman/farmhouse style. 4.5+ inch: Victorian and ornate homes. Match the style and scale to your baseboard and crown molding." },
            { question: "Should window casing match baseboard?", answer: "Ideally, yes. They should be the same style family and similar scale. Casing is typically the same width or slightly narrower than baseboard. Same wood species and finish create a cohesive look throughout the room." },
        ],
    },
    "grout-calculator": {
        subtitle: "Calculate grout needed for tile installations. Enter tile size, joint width, and area for pounds of grout.",
        explanation: {
            heading: "How to Calculate Grout",
            paragraphs: [
                "Grout volume depends on tile size, joint width, tile thickness, and installation area. Smaller tiles with wider joints use dramatically more grout. A 1-inch mosaic with 1/8-inch joints uses 10× more grout per sq ft than 12-inch tile.",
                "Use unsanded grout for joints 1/8 inch or less, sanded grout for joints over 1/8 inch. Epoxy grout is recommended for wet areas and high-traffic floors. A 25 lb bag of sanded grout covers 100–200 sq ft of 12-inch tile.",
            ],
            highlight: "100 sq ft of 12×12 tile with 1/8-inch joints at 3/8-inch tile thickness: grout ≈ 2 lbs. One 25 lb bag is more than sufficient.",
        },
        faq: [
            { question: "Sanded or unsanded grout?", answer: "Unsanded: joints 1/8 inch or narrower (polished marble, glass tile). Sanded: joints over 1/8 inch (floor tile, subway tile). Large joints (3/8+ inch): use sanded grout. Sanded grout is stronger and resists cracking in wider joints." },
            { question: "How much grout do I mix at a time?", answer: "Mix only what you can use in 30 minutes. For most jobs, mix 5–10 lbs at a time. Work in sections of 20–30 sq ft. Keep the consistency of smooth peanut butter. Do not add water to grout that has begun to set — discard it." },
        ],
    },
    "concrete-patio-calculator": {
        subtitle: "Calculate concrete for a patio with finish style options. Get volume, bags, and finish cost estimate.",
        explanation: {
            heading: "How to Calculate Concrete for a Patio",
            paragraphs: [
                "Patio concrete volume = length × width × thickness. Standard patio thickness is 4 inches. The base should be 4 inches of compacted gravel. Include control joints every 8–10 feet to prevent random cracking.",
                "Finish options significantly affect cost: broom finish ($8/sq ft installed), exposed aggregate ($10/sq ft), colored/stained ($12/sq ft), and stamped concrete ($15+/sq ft). Stamped patios can mimic stone, brick, or slate.",
            ],
            highlight: "A 16×12 ft patio at 4 inches thick: 64 cu ft = 2.37 cu yd. Order 2.6 cu yd (+10%). Stamped finish: $192 × $15 = $2,880.",
        },
        faq: [
            { question: "How thick should a concrete patio be?", answer: "4 inches for foot traffic and patio furniture. 5–6 inches if supporting hot tubs, fire pits, or outdoor kitchens. Always pour on 4 inches of compacted gravel with proper drainage slope (1/4 inch per foot away from the house)." },
            { question: "How long until I can use my new patio?", answer: "Light foot traffic: 24–48 hours. Furniture placement: 3–5 days. Full use: 7 days. Full strength: 28 days. Keep the concrete moist for the first 7 days for proper curing. Do not apply sealers for at least 28 days." },
        ],
    },
    "roof-underlayment-calculator": {
        subtitle: "Calculate roof underlayment (felt or synthetic) needed. Enter roof area, pitch, and overlap for rolls required.",
        explanation: {
            heading: "How to Calculate Roof Underlayment",
            paragraphs: [
                "Roof underlayment goes under shingles as a secondary moisture barrier. Calculate total roof area using the pitch multiplier, then add 15% for horizontal and vertical overlaps. Standard overlap: 4 inches horizontal, 6 inches at end laps.",
                "Types: #15 felt (400 sq ft/roll), #30 felt (200 sq ft/roll), synthetic (1,000 sq ft/roll), and self-adhered ice & water shield (75 sq ft/roll). Ice shield is required in the first 3 feet of eaves in cold climates.",
            ],
            highlight: "A 30×24 ft roof at 6/12 pitch: actual area = 805 sq ft + 15% overlap = 926 sq ft. Synthetic: 1 roll. #15 felt: 3 rolls. #30 felt: 5 rolls.",
        },
        faq: [
            { question: "Do I need synthetic or felt underlayment?", answer: "Synthetic: stronger, lighter, UV-resistant (can be exposed longer during construction), lays flat. More expensive. Felt (#15 or #30): traditional, affordable, breathable. Use #30 for steeper roofs and higher wind zones. Code may dictate the minimum." },
            { question: "Where do I need ice and water shield?", answer: "Code requires it from the eave edge to at least 24 inches past the interior wall line. In cold climates, this is typically the first 3–6 feet. Also apply at valleys, around chimneys, skylights, and any roof penetration. It is self-adhering and waterproof." },
        ],
    },
    "anchor-bolt-calculator": {
        subtitle: "Calculate anchor bolt quantity and spacing for sill plates, mudsills, and holdowns. Determine bolt diameter and embedment depth.",
        explanation: {
            heading: "How to Calculate Anchor Bolt Requirements",
            paragraphs: [
                "Anchor bolts (J-bolts or L-bolts) secure the wood sill plate to the concrete foundation. IRC code requires a minimum 1/2-inch diameter bolt embedded at least 7 inches into concrete, spaced no more than 6 feet apart, with a bolt within 12 inches of each end of each sill plate piece.",
                "In high-wind and seismic zones, spacing may be reduced to 4 feet or 32 inches. Holdown brackets at shear wall ends require additional anchor bolts — typically 5/8-inch or 3/4-inch diameter with deeper embedment. Always check your local building code for specific requirements.",
            ],
            highlight: "A 40 ft wall at 6 ft spacing: 40 / 6 + 1 = 8 bolts per wall. Four walls = 32 anchor bolts total. With 1/2-inch bolts, minimum 7-inch embedment into concrete.",
        },
        faq: [
            { question: "How far apart should anchor bolts be?", answer: "IRC standard: maximum 6 feet on center. High-wind zones: 4 feet. Seismic Design Category D/E: as close as 32 inches. Always place a bolt within 12 inches of each end of each sill plate piece, and within 12 inches of each side of openings." },
            { question: "What size anchor bolt do I need?", answer: "Standard residential: 1/2-inch × 10-inch J-bolt. High-wind/seismic: 5/8-inch. Holdown connections: 5/8 or 3/4-inch. Minimum embedment: 7 inches for 1/2-inch bolts, 8 inches for 5/8-inch. Use a nut and washer on top of the sill plate." },
        ],
    },
    "brick-veneer-calculator": {
        subtitle: "Calculate bricks, mortar, wall ties, and flashing for brick veneer walls. Accounts for openings and waste.",
        explanation: {
            heading: "How to Calculate Brick Veneer Materials",
            paragraphs: [
                "Brick veneer is a single-wythe layer of brick attached to a wood or steel-framed wall. Standard modular bricks require approximately 6.75 bricks per square foot (including mortar joints). Subtract door and window openings from the gross wall area to get the net brick area.",
                "Wall ties connect the brick veneer to the structural wall behind — one tie per 2.67 sq ft (every 16 inches vertically, 24 inches horizontally). Mortar uses about one 80-lb bag per 35 sq ft of wall. Base flashing with weep holes is required at the bottom of the veneer.",
            ],
            highlight: "A 20×9 ft wall with 2 openings (15 sq ft each): net area = 150 sq ft. Bricks: 1,013. Mortar: 5 bags. Wall ties: 57. Base flashing: 20 lin ft.",
        },
        faq: [
            { question: "How thick is a brick veneer wall?", answer: "The brick layer is typically 3.5–4 inches thick with a 1-inch air gap between the brick and the sheathing. Total added wall thickness: about 5 inches. The air gap is critical for drainage and must not be bridged by mortar droppings." },
            { question: "Do I need wall ties for brick veneer?", answer: "Yes — corrugated metal or adjustable wall ties are required to connect the veneer to the structural wall. Spacing: 16 inches vertically, 24 inches horizontally (one per 2.67 sq ft). Use stainless steel or hot-dipped galvanized ties to prevent corrosion." },
        ],
    },
    "concrete-washout-calculator": {
        subtitle: "Estimate washout pit size and water volume for cleaning concrete trucks, pumps, and tools on site.",
        explanation: {
            heading: "How to Calculate Concrete Washout Requirements",
            paragraphs: [
                "Concrete washout is required on any construction site that receives ready-mix deliveries. Each truck washout generates approximately 100–200 gallons of washwater (including chute rinse and drum washout). EPA regulations and most local stormwater permits require containment of all washout water.",
                "A washout pit should be lined with 10-mil polyethylene sheeting and sized to contain all expected washout water. Minimum pit depth is 2 feet. After the water evaporates, the hardened concrete residue can be broken up and disposed of as solid waste.",
            ],
            highlight: "3 truck loads with 150 gal washout each: 450 gallons total. At 2 ft depth, pit needs about 30 sq ft — roughly a 6×6 ft excavation. Liner: about 100 sq ft.",
        },
        faq: [
            { question: "Is concrete washout required by law?", answer: "Yes — EPA NPDES stormwater permits require concrete washout containment on most construction sites. Discharging washout water to storm drains, ditches, or waterways can result in significant fines. Washout pH is typically 12+, which is harmful to aquatic life." },
            { question: "How do I dispose of concrete washout?", answer: "Allow water to evaporate in the pit. The hardened concrete residue is classified as solid waste and can be disposed of at a construction debris landfill. Some sites recycle dried washout concrete as base material. Never dump liquid washout into storm drains." },
        ],
    },
    "ridge-vent-calculator": {
        subtitle: "Calculate ridge vent material for roof ventilation. Get vent pieces, cap shingles, and net free area.",
        explanation: {
            heading: "How to Calculate Ridge Vent",
            paragraphs: [
                "Ridge vents run along the peak of the roof and provide exhaust ventilation for the attic. They work best when paired with soffit vents (intake). Standard ridge vent pieces are 4 feet long and 10–14 inches wide. The total vent length should match the full ridge length for optimal airflow.",
                "Net Free Area (NFA) is the actual open area for airflow — typically 18 sq in per linear foot of quality ridge vent. Code requires a minimum 1:150 ratio of NFA to attic floor area (or 1:300 with balanced intake/exhaust). Cap shingles cover the vent, with one bundle covering 25–35 linear feet.",
            ],
            highlight: "A 30 ft ridge with 4 ft vent pieces: 8 pieces needed. NFA = 30 × 18 = 540 sq in. Cap shingle bundles: 1. That ventilates up to 810 sq ft of attic (at 1:150 ratio).",
        },
        faq: [
            { question: "How much ridge vent do I need?", answer: "Install ridge vent along the entire ridge length for best results. Cut the sheathing back 1 inch on each side of the ridge (2-inch slot total) before installing. Do not vent within 12 inches of the roof ends to prevent rain entry." },
            { question: "Can I use ridge vents with gable vents?", answer: "Not recommended. Gable vents can short-circuit the soffit-to-ridge airflow pattern, reducing ventilation efficiency. If you install ridge vents, close or cover any existing gable vents. The ideal system is continuous soffit intake + continuous ridge exhaust." },
        ],
    },
    "stair-stringer-calculator": {
        subtitle: "Calculate stair stringer length, riser count, tread dimensions, and lumber for building stairs.",
        explanation: {
            heading: "How to Calculate Stair Stringers",
            paragraphs: [
                "A stair stringer is the diagonal board that supports the treads and risers. The number of risers equals total rise divided by desired riser height (rounded to the nearest whole number). Treads = risers minus 1. Stringer length is calculated using the Pythagorean theorem: √(total rise² + total run²).",
                "Building code requires risers between 4–7.75 inches (7–7.5 inches is ideal) and treads at least 10 inches deep. All risers must be within 3/8 inch of each other. Use 2×12 lumber for stringers, as the notched throat depth must be at least 3.5 inches.",
            ],
            highlight: "A 36-inch total rise with 7.5-inch risers: 5 risers, 4 treads at 10 inches = 40-inch run. Stringer length = √(36² + 40²) / 12 = 4.5 ft. Use 2×12 × 6 ft lumber.",
        },
        faq: [
            { question: "How many stringers do I need?", answer: "Minimum 3 stringers for stairs up to 36 inches wide. For wider stairs, add a stringer every 16 inches. A 48-inch wide stair needs 4 stringers. Stringers at the edges plus evenly spaced interior stringers prevent tread bounce." },
            { question: "What is the maximum riser height allowed by code?", answer: "IRC maximum: 7.75 inches. Ideal range: 7.0–7.5 inches. The riser-tread relationship should follow: riser + tread = 17–18 inches. All risers in a flight must be consistent — maximum 3/8-inch variation between any two risers." },
        ],
    },
    "waterproofing-membrane-calculator": {
        subtitle: "Calculate waterproofing membrane for basement walls, decks, and wet areas. Get rolls, adhesive, and seam tape quantities.",
        explanation: {
            heading: "How to Calculate Waterproofing Membrane",
            paragraphs: [
                "Waterproofing membranes come in three main types: sheet membranes (rubberized asphalt, 200 sq ft/roll), liquid-applied (100 sq ft/gallon), and peel-and-stick (self-adhered, 75 sq ft/roll). Calculate the surface area to cover, add 15% for overlaps and waste.",
                "All seams must be overlapped 4–6 inches and sealed with compatible tape or adhesive. For below-grade applications, the membrane must extend from the footing to at least 6 inches above grade. Detail all penetrations, corners, and transitions carefully.",
            ],
            highlight: "A 30×8 ft basement wall: area = 240 sq ft + 15% = 276 sq ft. Sheet membrane: 2 rolls. Liquid applied: 3 gallons. Peel & stick: 4 rolls. Seam tape: 45 lin ft.",
        },
        faq: [
            { question: "What type of waterproofing membrane is best?", answer: "Below-grade foundations: peel-and-stick or liquid-applied (self-healing properties). Decks/balconies: sheet membrane with heat-welded seams. Shower/wet areas: liquid-applied or sheet. Self-adhered membranes are easiest for DIY; liquid-applied gives the most seamless coverage." },
            { question: "Can I waterproof over existing coatings?", answer: "Generally no — the surface must be clean, dry, and free of previous coatings for proper adhesion. Remove old paint, tar, or coatings first. Prime the surface with the manufacturer's recommended primer. Test adhesion in a small area before committing to the full application." },
        ],
    },
    "weep-screed-calculator": {
        subtitle: "Calculate weep screed for stucco and masonry wall bases. Get piece count and total stock length.",
        explanation: {
            heading: "How to Calculate Weep Screed",
            paragraphs: [
                "Weep screed is a metal flashing installed at the base of stucco and masonry walls, typically 4 inches above grade. It provides a termination point for the stucco and allows moisture to weep out of the wall assembly. Standard pieces are 10 feet long.",
                "Install weep screed around the entire building perimeter with 2-inch overlap at joints. Nail or screw every 6 inches along the top flange. The bottom leg should extend past the foundation by at least 1/2 inch. Building code requires weep screed on all stucco exteriors.",
            ],
            highlight: "A 120 ft perimeter with 10 ft pieces and 2-inch overlap: effective length = 9.83 ft. Pieces needed: 13. Total stock: 130 lin ft. About 78 fasteners.",
        },
        faq: [
            { question: "Is weep screed required by code?", answer: "Yes — IRC Section R703.7.2.2 requires weep screed at or below the foundation plate line on all exterior stucco walls. It must be a minimum of 4 inches above earth or 2 inches above paved surfaces. Omitting weep screed can trap moisture and cause rot." },
            { question: "What material is weep screed made of?", answer: "Galvanized steel (most common, 26 gauge), stainless steel (coastal/corrosive environments), or plastic (for EIFS systems). Use galvanized for standard residential. Stainless steel is required within 5 miles of salt water in many jurisdictions." },
        ],
    },
    "board-foot-calculator": {
        subtitle: "Convert lumber dimensions to board feet for pricing hardwood and specialty lumber. Includes cost estimator.",
        explanation: {
            heading: "How to Calculate Board Feet",
            paragraphs: [
                "A board foot is a unit of lumber volume: 1 inch thick × 12 inches wide × 12 inches long (144 cubic inches). The formula is: (thickness in inches × width in inches × length in feet) ÷ 12. Hardwood and specialty lumber are sold by the board foot rather than by the piece.",
                "When purchasing rough-sawn lumber, nominal dimensions equal actual dimensions. For surfaced lumber (S4S), the actual thickness is less than nominal — a 4/4 board (1 inch nominal) is actually 13/16 inch after surfacing. Price per board foot typically ranges from $3–$15+ depending on species and grade.",
            ],
            highlight: "Ten 2×6 boards, 8 ft long: BF each = (2 × 6 × 8) ÷ 12 = 8 BF. Total = 80 BF. At $5/BF (walnut), cost = $400.",
        },
        faq: [
            { question: "What is a board foot?", answer: "One board foot = 144 cubic inches of wood (1 inch × 12 inches × 12 inches). It is the standard unit for pricing hardwood lumber, turning blanks, and specialty wood. Softwood (construction lumber) is typically sold by the linear foot or piece, not by the board foot." },
            { question: "How do I calculate board feet for rough lumber?", answer: "Use the actual (not nominal) dimensions: (thickness × width × length) ÷ 12, where thickness and width are in inches and length is in feet. For rough lumber, measure the actual dimensions. Hardwood thickness is often expressed in quarters: 4/4 = 1 inch, 8/4 = 2 inches." },
        ],
    },
    "concrete-beam-calculator": {
        subtitle: "Calculate concrete volume and rebar for grade beams and structural beams. Get cubic yards, bags, and reinforcement.",
        explanation: {
            heading: "How to Calculate Concrete Beam Volume",
            paragraphs: [
                "Concrete beam volume = length × width × depth. Grade beams are horizontal beams that connect foundation piers and distribute loads. Typical residential grade beams are 12 inches wide × 18–24 inches deep. Structural beams above grade may be larger depending on span and load.",
                "All concrete beams require reinforcement. Minimum: 4 longitudinal bars (typically #5 or #6) with #3 stirrups spaced every 12 inches (closer near supports). Grade beams spanning between piers need bottom bars for tension. Use 3,000–4,000 PSI concrete for structural beams.",
            ],
            highlight: "Two grade beams, 20 ft × 12 in × 18 in: volume each = 22.5 cu ft. Total = 45 cu ft = 1.67 cu yd. Rebar: 160 lin ft of longitudinal bars. About 75 bags of 80 lb mix.",
        },
        faq: [
            { question: "What is a grade beam?", answer: "A grade beam is a reinforced concrete beam at ground level that connects foundation piers, distributes wall loads, and spans over poor soil. Unlike strip footings that bear directly on soil, grade beams transfer loads to the piers. Common in pier-and-beam foundations." },
            { question: "How much rebar does a concrete beam need?", answer: "Minimum 4 longitudinal bars: 2 top, 2 bottom. Typical: #5 bars for residential, #6 for commercial. Stirrups (#3 bars bent into rectangles) every 12 inches in the middle third, every 6 inches near the ends. Lap splice bars 40 diameters minimum." },
        ],
    },
    "downspout-calculator": {
        subtitle: "Calculate downspout count, length, and extensions for roof drainage. Get elbows and accessories needed.",
        explanation: {
            heading: "How to Calculate Downspouts",
            paragraphs: [
                "The standard rule is one downspout per 600 square feet of roof area (for 2×3 inch rectangular downspouts) or per 1,200 sq ft (for 3×4 inch). Downspout length equals the wall height plus approximately 1 foot for the top elbow connection from the gutter.",
                "Each downspout requires 2 elbows (one at the top to offset from the gutter and one at the bottom to direct water away). Extensions should carry water at least 4 feet from the foundation. Use splash blocks or underground drain pipes for proper dispersal.",
            ],
            highlight: "A 1,200 sq ft roof with 9 ft walls: 2 downspouts needed (2×3 size). Length each: 10 ft. Total: 20 lin ft of downspout, 4 elbows, 2 extensions at 4 ft each.",
        },
        faq: [
            { question: "How many downspouts do I need?", answer: "One 2×3 inch downspout per 600 sq ft of roof area. One 3×4 inch downspout per 1,200 sq ft. Place at corners and at low points of the gutter run. Maximum gutter run to a single downspout: 40 feet for 5-inch gutters, 50 feet for 6-inch gutters." },
            { question: "How far should downspouts extend from the foundation?", answer: "Minimum 4 feet — preferably 6–10 feet. Use splash blocks, flexible extensions, or underground drain pipes connected to a dry well or daylight outlet. Water pooling near the foundation is the #1 cause of basement water problems and foundation damage." },
        ],
    },
    "cabinet-door-calculator": {
        subtitle: "Calculate cabinet door sizes, hinge count, and overlay for kitchen and bathroom cabinets. Supports single and double door layouts.",
        explanation: {
            heading: "How to Calculate Cabinet Door Sizes",
            paragraphs: [
                "Cabinet door size depends on the opening dimensions and the overlay style. Standard overlay adds 1/2 inch on each side of the opening. Full overlay adds 1-1/4 inches, covering the face frame almost entirely. Inset doors are flush with the frame and equal the opening size exactly.",
                "Hinges: use 2 hinges for doors up to 40 inches tall, 3 hinges for taller doors. European concealed hinges are standard for overlay doors. For double doors, each door width = (opening width ÷ 2) + overlay. Always verify measurements before ordering custom doors.",
            ],
            highlight: "A 15×30 inch opening with 1/2-inch overlay: door size = 16 × 31 inches. For 10 cabinets with single doors: 10 doors, 20 hinges total.",
        },
        faq: [
            { question: "What is cabinet door overlay?", answer: "Overlay is how much the door covers the face frame. Standard overlay: 1/2 inch per side, revealing part of the frame between doors. Full overlay: 1-1/4 inches, minimal frame visible. Inset: door sits flush inside the frame (most expensive, requires precise fit)." },
            { question: "How many hinges per cabinet door?", answer: "Up to 40 inches tall: 2 hinges. 40–60 inches: 3 hinges. Over 60 inches: 4 hinges. Use soft-close European concealed hinges (110° or 170° opening). Full overlay requires full overlay hinges; standard overlay uses standard hinges." },
        ],
    },
    "framing-calculator": {
        subtitle: "Calculate wall framing lumber — studs, plates, headers, and corners. Enter wall dimensions and stud spacing.",
        explanation: {
            heading: "How to Calculate Wall Framing",
            paragraphs: [
                "Wall framing requires field studs at regular spacing (16 or 24 inches on center), plus bottom plate and double top plate. Field stud count = (wall length in inches ÷ spacing) + 1. Add 3 extra studs for each corner (California or 3-stud corner assemblies).",
                "Plate stock = wall length × 3 (one bottom plate, two top plates). Use 2×4 for non-load-bearing walls and 2×6 for load-bearing and exterior walls. Headers above openings require doubled lumber or engineered beams sized to the span.",
            ],
            highlight: "A 20 ft wall at 16\" OC: (240 ÷ 16) + 1 = 16 field studs. With 2 corners: 16 + 6 = 22 studs. Plates: 60 lin ft. Total lumber: ~236 lin ft.",
        },
        faq: [
            { question: "When should I use 16 vs 24 inch spacing?", answer: "16\" OC: load-bearing walls, exterior walls, and walls receiving drywall. Required by most codes for load-bearing applications. 24\" OC: allowed for non-load-bearing interior partitions and some advanced framing methods. Check local code." },
            { question: "How many extra studs for corners?", answer: "Standard 3-stud corner: 3 studs per corner. California corner (2-stud + blocking): 2 studs + drywall clips. Advanced framing corner: 2 studs with drywall clips for better insulation. Most inspectors accept all three methods." },
        ],
    },
    "lumber-weight-calculator": {
        subtitle: "Calculate the weight of lumber by species, dimensions, and quantity. Covers 9 softwood and hardwood species.",
        explanation: {
            heading: "How to Calculate Lumber Weight",
            paragraphs: [
                "Lumber weight depends on species, dimensions, and moisture content. Each species has a different density measured in pounds per cubic foot at 12% moisture content. Common softwoods range from 23 lb/cf (cedar) to 36 lb/cf (southern pine). Hardwoods range from 35 lb/cf (cherry) to 47 lb/cf (oak).",
                "Calculate volume using actual (not nominal) dimensions. A nominal 2×6 is actually 1.5 × 5.5 inches. Multiply the actual cross-section by length to get volume, then multiply by density. Green (wet) lumber weighs significantly more than kiln-dried lumber.",
            ],
            highlight: "Ten 2×6 SPF boards, 8 ft long: actual size 1.5 × 5.5 in. Volume each = 0.382 cu ft. Weight each = 10.7 lbs. Total = 107 lbs.",
        },
        faq: [
            { question: "How much does a 2×4×8 weigh?", answer: "SPF (Spruce-Pine-Fir): about 9 lbs. Douglas Fir: about 11 lbs. Southern Pine: about 13 lbs. Pressure-treated: about 17 lbs (wet weight, dries to ~14 lbs). These are approximate for kiln-dried lumber at 12% moisture content." },
            { question: "Does pressure-treated lumber weigh more?", answer: "Yes — significantly more when fresh. The treatment chemicals and additional moisture add 50-70% to the dry weight. A pressure-treated 2×4×8 can weigh 17+ lbs vs. 9 lbs for untreated SPF. It gets lighter as it dries over several months." },
        ],
    },
    "rafter-length-calculator": {
        subtitle: "Calculate rafter length, birdsmouth cut, and tail length from roof span, pitch, and overhang.",
        explanation: {
            heading: "How to Calculate Rafter Length",
            paragraphs: [
                "Rafter length is calculated from the building span, roof pitch, and overhang. The run = (span ÷ 2) minus half the ridge board thickness. The rise = run × (pitch ÷ 12). Rafter length = √(run² + rise²). Add the tail length for the overhang.",
                "The birdsmouth cut notches the rafter to sit flat on the wall plate. The seat cut (horizontal) should be at least 1.5 inches for a 2×4 wall. The HAP (Height Above Plate) should be at least 3.5 inches to maintain structural strength. Use 2×8 or larger rafters.",
            ],
            highlight: "24 ft span at 6/12 pitch with 12-inch overhang: run = 11.94 ft, rise = 5.97 ft. Rafter = 13.35 ft. Tail = 1.12 ft. Total = 14.47 ft — order 16 ft lumber.",
        },
        faq: [
            { question: "What size lumber for rafters?", answer: "2×6: spans up to 10 ft. 2×8: spans up to 14 ft. 2×10: spans up to 18 ft. 2×12: spans up to 22 ft. These are approximate for SPF #2 at 16\" OC. Always verify with local code span tables for your species, grade, and load requirements." },
            { question: "What is a birdsmouth cut?", answer: "A notch cut in the rafter where it sits on the wall plate. It has two cuts: the seat cut (horizontal, rests on plate) and the plumb cut (vertical, against the wall). The seat cut should not exceed 1/3 of the rafter depth. Minimum HAP is typically 3.5 inches." },
        ],
    },
    "dimensional-lumber-calculator": {
        subtitle: "Look up actual vs nominal lumber sizes for all common dimensions. See real measurements for 2×4, 2×6, 4×4, and more.",
        explanation: {
            heading: "Actual vs. Nominal Lumber Dimensions",
            paragraphs: [
                "Nominal lumber dimensions are not the actual size. A '2×4' is actually 1.5 × 3.5 inches after kiln-drying and planing. This difference matters for precise fitting, calculating board footage, and ordering materials. The larger the nominal size, the greater the dimensional difference.",
                "For 1-inch nominal thickness, actual is 3/4 inch. For 2-inch nominal, actual is 1.5 inches. Widths follow a similar pattern: nominal 4 = 3.5 actual, nominal 6 = 5.5, nominal 8 = 7.25, nominal 10 = 9.25, nominal 12 = 11.25. Posts (4×4) are 3.5 × 3.5 inches, and 6×6 is 5.5 × 5.5.",
            ],
            highlight: "A nominal 2×4 is actually 1.5 × 3.5 inches — that's a 37% reduction in cross-section area compared to a true 2×4 (5.25 sq in vs 8 sq in).",
        },
        faq: [
            { question: "Why aren't lumber dimensions actual?", answer: "Lumber is cut to nominal size when green (wet), then shrinks during kiln-drying and loses more material during planing to smooth surfaces. The resulting actual size is standardized by the American Lumber Standard Committee. This system dates back to the early 1900s." },
            { question: "Are rough-sawn boards actual size?", answer: "Yes — rough-sawn lumber is full nominal size because it hasn't been surfaced. A rough 2×4 is a true 2 × 4 inches. This is important for board foot calculations. Rough-sawn is common for timber framing, barn construction, and hardwood lumber yards." },
        ],
    },
    "plywood-thickness-calculator": {
        subtitle: "Look up actual plywood thickness vs nominal. Compare weights per sheet across all standard thicknesses.",
        explanation: {
            heading: "Actual vs. Nominal Plywood Thickness",
            paragraphs: [
                "Like dimensional lumber, plywood nominal thickness differs from actual thickness. A nominal 3/4-inch sheet is actually 23/32 inch (0.703 inches). This matters for dadoes, rabbets, and any joint where precise fit is required.",
                "A standard 4×8 sheet of 3/4-inch plywood weighs about 61 lbs. Thinner sheets are lighter: 1/4-inch weighs about 22 lbs, 1/2-inch about 41 lbs. Weight varies by wood species and grade. Baltic birch plywood runs true to nominal thickness and is heavier than softwood plywood.",
            ],
            highlight: "Nominal 3/4\" plywood is actually 0.703\" (23/32\"). A router bit set to 3/4\" will make a dado too wide. Use 23/32\" or test-fit before routing.",
        },
        faq: [
            { question: "Why is plywood thinner than labeled?", answer: "Manufacturing tolerance and sanding. Plywood is made from veneer layers glued together, then sanded smooth. Each sanding pass removes material. Industry standards allow up to 1/32-inch under nominal. This is why dados cut to nominal width are always slightly loose." },
            { question: "Is Baltic birch plywood actual thickness?", answer: "Yes — Baltic birch plywood is manufactured to metric sizes and is very close to nominal. A 3/4-inch (18mm) Baltic birch sheet is a true 18mm (0.709 inches). This makes it preferred for furniture, cabinetry, and any application requiring precise joinery." },
        ],
    },
    "carpentry-cost-calculator": {
        subtitle: "Estimate carpentry labor and material costs by project type. Get a cost range based on area, labor rate, and complexity.",
        explanation: {
            heading: "How to Estimate Carpentry Costs",
            paragraphs: [
                "Carpentry costs depend on project type, local labor rates, and complexity. Rough framing averages $4–$8 per sq ft. Trim installation runs $5–$15 per linear foot. Cabinet installation: $100–$300 per cabinet. Deck building: $15–$35 per sq ft installed.",
                "Labor rates for carpenters range from $25–$75/hr for a helper to $50–$150/hr for a master carpenter. Materials typically cost 40–80% of the labor cost. Complex custom work (curved trim, built-ins, timber framing) can cost 40–100% more than standard work.",
            ],
            highlight: "200 sq ft wall framing at $50/hr: ~16 hours labor = $800. Materials ~$480. Total range: $1,184 – $1,536 depending on complexity and material pricing.",
        },
        faq: [
            { question: "How much does a carpenter charge per hour?", answer: "Apprentice/helper: $25–$40/hr. Journeyman: $40–$75/hr. Master carpenter: $60–$150/hr. Rates vary by region — urban areas and high cost-of-living regions are higher. Some carpenters prefer to bid by the job rather than hourly, especially for larger projects." },
            { question: "What's included in carpentry costs?", answer: "Labor costs cover cutting, fitting, fastening, and finishing. Material costs include lumber, fasteners, adhesives, and finishing materials. Typically NOT included: permits, engineering, painting/staining, electrical/plumbing work. Always get an itemized quote." },
        ],
    },
    "stud-calculator": {
        subtitle: "Calculate wall stud count including king studs, jack studs, and cripples for doors and windows.",
        explanation: {
            heading: "How to Calculate Wall Studs",
            paragraphs: [
                "Wall stud count starts with field studs: (wall length in inches ÷ spacing) + 1. Then add framing for openings: each door or window needs 2 king studs (full height) and 2 jack studs (support the header). Windows also need cripple studs above and below.",
                "Standard stud spacing is 16 inches on center for load-bearing walls. Plate lumber (bottom plate + double top plate) = wall length × 3. For pre-cut studs (92-5/8 inches), pair with standard plates for an 8-foot finished wall height including drywall.",
            ],
            highlight: "A 20 ft wall at 16\" OC with 1 door and 2 windows: 16 field studs + 6 king + 6 jack + 4 cripples = 32 studs. Stud lumber: 256 lin ft. Plates: 60 lin ft.",
        },
        faq: [
            { question: "What are king studs and jack studs?", answer: "King studs are full-height studs on each side of an opening — they run from bottom plate to top plate. Jack studs (trimmers) are shorter studs nailed to the king studs that support the header above the opening. Every opening needs a pair of each." },
            { question: "How long is a pre-cut stud?", answer: "Standard pre-cut studs are 92-5/8 inches (7 ft 8-5/8 in). With a single bottom plate and double top plate (4.5 inches total), this gives exactly 97-1/8 inches — which allows for 8-foot (96-inch) drywall plus 1/8-inch clearance at the floor." },
        ],
    },
    "joist-span-calculator": {
        subtitle: "Find maximum allowable joist spans by size, spacing, species, and grade. Covers floor and ceiling joists.",
        explanation: {
            heading: "How to Determine Joist Span",
            paragraphs: [
                "Maximum joist span depends on four factors: lumber size, spacing, species/grade, and the type of load (floor vs. ceiling). Floor joists carry heavier live loads (40 psf residential) than ceiling joists (20 psf, no attic storage). Larger joists at closer spacing span farther.",
                "Standard SPF #2 at 16\" OC: 2×6 spans 9.5 ft (floor) or 12.5 ft (ceiling). 2×8 spans 12.5 ft (floor). 2×10 spans 16 ft (floor). 2×12 spans 19 ft (floor). Higher grades (Select Structural, #1) allow 5–10% longer spans.",
            ],
            highlight: "2×10 SPF #2 at 16\" OC: max floor span = 16 ft. At 12\" OC, span increases to 17.5 ft. At 24\" OC, span decreases to 13 ft. Always verify with your local building code.",
        },
        faq: [
            { question: "Can I use 2×6 for floor joists?", answer: "Yes, but with limited span: max ~9.5 ft for SPF #2 at 16\" OC (40 psf live load). Suitable for small rooms, closets, and stairway landings. For most rooms, 2×8 or 2×10 is more practical. Some codes require 2×10 minimum for floors spanning over 12 ft." },
            { question: "Do I need blocking between joists?", answer: "Solid blocking or cross-bridging is required at supports and often at mid-span for joists deeper than 2×10. Blocking prevents joist rotation, distributes point loads, and provides fire stops. Use full-depth solid wood blocks or metal cross-bridging." },
        ],
    },
    "shelf-bracket-calculator": {
        subtitle: "Calculate shelf brackets needed based on shelf length, load weight, and material type for safe support.",
        explanation: {
            heading: "How to Calculate Shelf Brackets",
            paragraphs: [
                "Bracket spacing depends on shelf material, load, and bracket type. Plywood can span 36 inches under light loads. MDF should not span more than 24 inches due to sag. Solid hardwood can span 42 inches. Heavy loads require closer spacing (24 inches max).",
                "Place brackets with no more than 25% of spacing as end overhang — for 36-inch spacing, max overhang is 9 inches. Bracket depth should be at least 2/3 of shelf depth for adequate support. Anchor into wall studs whenever possible; drywall anchors have limited load capacity.",
            ],
            highlight: "A 48-inch plywood shelf with 20 lb load: 2 brackets needed at 48-inch spacing. If load increases to 40 lbs, use 3 brackets at 24-inch spacing for sag prevention.",
        },
        faq: [
            { question: "How far apart should shelf brackets be?", answer: "3/4\" plywood: max 36 inches. 1\" hardwood: max 42 inches. 3/4\" MDF: max 24 inches. Particleboard: max 20 inches. Glass: max 18 inches. Reduce spacing for heavy loads (books, records, tools). These spans assume light to moderate weight." },
            { question: "Do shelf brackets need to be in studs?", answer: "Strongly recommended, especially for heavy loads. Each stud-mounted bracket can support 50–100+ lbs. Drywall anchors are limited to 15–25 lbs per anchor (toggle bolts up to 50 lbs). For floating shelves, stud mounting is essential." },
        ],
    },
    "concrete-block-fill-calculator": {
        subtitle: "Calculate grout or concrete fill volume for hollow CMU blocks. Supports 4\" through 12\" block sizes with partial fill options.",
        explanation: {
            heading: "How to Calculate Block Fill",
            paragraphs: [
                "Hollow CMU (concrete masonry unit) blocks have two cores that can be filled with grout or concrete. Solid grouting fills every core — required for reinforced walls and below-grade applications. Partial grouting fills only cores containing rebar, saving material on non-structural walls.",
                "Fill volume per block depends on block width: an 8-inch standard block takes about 0.028 cu ft of grout per core fill. For 100 blocks solid-grouted, you need roughly 2.8 cu ft (0.10 cu yd). Always add 10% waste for spillage and overfill.",
            ],
            highlight: "100 standard 8\" blocks, solid grouted: 2.8 cu ft = 0.10 cu yd. With 10% waste: 0.11 cu yd. Or about 5 bags of 80 lb premix grout.",
        },
        faq: [
            { question: "Do I have to fill all block cores?", answer: "Not always. Structural walls and walls below grade must be solid grouted per code. Above-grade non-structural walls can be partially grouted — fill only cores with rebar (typically every 48 inches). Check your structural engineer's specifications." },
            { question: "Can I use regular concrete to fill blocks?", answer: "Use grout, not concrete. Block fill grout has a higher slump (8–10 inches) so it flows into cores and around rebar. Regular concrete (3–4 inch slump) won't fill voids properly. Pre-mixed grout bags are available at any building supply store." },
        ],
    },
    "concrete-mix-calculator": {
        subtitle: "Calculate bags of premix concrete needed for any project. Shows bag counts for 40, 60, and 80 lb bags with waste factor.",
        explanation: {
            heading: "How Many Bags of Concrete Do I Need?",
            paragraphs: [
                "Premix concrete bags are sold by weight. An 80 lb bag yields about 0.60 cu ft. A 60 lb bag yields 0.45 cu ft. A 40 lb bag yields 0.30 cu ft. Calculate your project volume in cubic feet (length × width × thickness), add 10% for waste, then divide by the yield per bag.",
                "For projects over 1 cubic yard (27 cu ft), consider ordering ready-mix concrete from a truck — it's cheaper per yard and much less labor. Premix bags are best for small projects: fence posts, small pads, repairs, and patching.",
            ],
            highlight: "A 10×10 ft slab, 4 inches thick: 33.3 cu ft. With 10% waste: 36.7 cu ft. That's 62 bags at 80 lbs — about 2,480 lbs of bags. Consider ready-mix at this size.",
        },
        faq: [
            { question: "How many 80 lb bags per cubic yard?", answer: "45 bags of 80 lb concrete per cubic yard. One 80 lb bag yields 0.60 cu ft; 27 cu ft per yard ÷ 0.60 = 45 bags. That's 3,600 lbs (1.8 tons) of bags. At this volume, ready-mix delivery is almost always more economical." },
            { question: "How much water per bag of concrete?", answer: "An 80 lb bag needs about 3 quarts (0.75 gallons) of water. A 60 lb bag needs about 2.5 quarts. Start with less water and add slowly — the most common mistake is adding too much water, which weakens the concrete and causes cracking." },
        ],
    },
    "concrete-weight-calculator": {
        subtitle: "Calculate the weight of a concrete slab or structure by volume. Covers standard, lightweight, reinforced, and heavyweight concrete.",
        explanation: {
            heading: "How Much Does Concrete Weigh?",
            paragraphs: [
                "Standard concrete weighs 150 lbs per cubic foot (4,050 lbs per cubic yard). This is the most common type used for slabs, foundations, and structural work. Lightweight concrete (110 lb/cf) uses expanded shale or clay aggregate and is used for roof decks and non-structural fills.",
                "Reinforced concrete (with rebar) weighs about 156 lb/cf due to the added steel. Heavyweight concrete (180 lb/cf) uses heavyweight aggregate like barite and is used for radiation shielding. Always account for concrete weight when calculating structural loads.",
            ],
            highlight: "A 10×20 ft slab, 4 inches thick: 66.7 cu ft of standard concrete = 10,000 lbs (5 tons). That's the weight of two pickup trucks sitting on your soil.",
        },
        faq: [
            { question: "How much does a cubic yard of concrete weigh?", answer: "Standard: 4,050 lbs (2.03 tons). Lightweight: 2,970 lbs. Reinforced: 4,212 lbs. A standard concrete truck carries 8–10 cubic yards, meaning a full truck weighs 32,000–40,000 lbs of concrete alone." },
            { question: "Does wet concrete weigh more than dry?", answer: "Wet (freshly placed) concrete weighs about the same as cured concrete — approximately 150 lb/cf. As concrete cures, it doesn't dry out; it undergoes hydration (chemical reaction with water). The water becomes chemically bound, not evaporated." },
        ],
    },
    "rebar-weight-calculator": {
        subtitle: "Look up rebar sizes, diameters, and weight per foot for #3 through #18 bars. Calculate total weight by length.",
        explanation: {
            heading: "Rebar Size and Weight Reference",
            paragraphs: [
                "Rebar is designated by bar number, which represents the diameter in 1/8-inch increments. A #4 bar is 4/8 = 1/2 inch diameter. A #8 bar is 1 inch. Weight per foot increases with the square of the diameter — a #8 bar weighs 4× more per foot than a #4 bar.",
                "Standard rebar comes in 20-foot lengths. Common sizes for residential: #3 and #4 for slabs and light foundations. #5 and #6 for footings, walls, and grade beams. #7 and #8 for heavy structural. #9–#18 for commercial and industrial applications.",
            ],
            highlight: "#4 rebar (1/2\" dia.): 0.668 lb/ft. 100 feet = 66.8 lbs, requiring 5 standard 20-foot bars. #8 rebar (1\" dia.): 2.670 lb/ft. 100 feet = 267 lbs.",
        },
        faq: [
            { question: "What size rebar for a concrete slab?", answer: "#3 (3/8\") or #4 (1/2\") for residential slabs, typically on 18\" or 24\" centers both ways. #4 on 12\" centers for driveways. Some codes allow welded wire mesh (6×6 W1.4) instead of rebar for non-structural slabs." },
            { question: "How much does a 20-foot #4 rebar weigh?", answer: "#4 rebar weighs 0.668 lb/ft × 20 ft = 13.36 lbs per bar. A bundle of 50 bars weighs about 668 lbs. #5 rebar: 1.043 lb/ft × 20 = 20.86 lbs per bar. Always account for lap splice lengths (40 diameters minimum) when ordering." },
        ],
    },
    "concrete-cost-calculator": {
        subtitle: "Estimate total concrete project costs including material, delivery, labor, and finishing by finish type.",
        explanation: {
            heading: "How Much Does a Concrete Slab Cost?",
            paragraphs: [
                "Concrete project costs include three main components: material (~$140/cu yd for ready-mix), labor/finishing ($6–$14/sq ft depending on finish), and delivery. Small orders under 5 cubic yards incur a short load fee of $100–$200.",
                "Finish type significantly affects total cost: broom finish is cheapest (~$6/sq ft total). Exposed aggregate (~$10/sq ft). Stamped concrete is most expensive (~$14/sq ft) due to the additional labor for stamping, coloring, and sealing.",
            ],
            highlight: "20×20 ft driveway, 4 inches thick: 400 sq ft, 4.94 cu yd. Material: $691. Broom finish labor: $2,400. Total: ~$3,091. Stamped: ~$6,291.",
        },
        faq: [
            { question: "How much is ready-mix concrete per yard?", answer: "$125–$165 per cubic yard delivered, depending on region and mix design. High-strength mixes (4000+ psi) cost $10–$20 more per yard. Fiber-reinforced adds $5–$10 per yard. Colored concrete adds $10–$30 per yard. Minimum delivery is typically 1 yard." },
            { question: "Is DIY concrete cheaper?", answer: "For small jobs (under 1 cu yd), DIY with premix bags can save money — $4–$6/sq ft vs. $8–$14 for a contractor. For larger jobs, professional-poured concrete is usually cheaper per sq ft because ready-mix trucks and experienced crews work faster and waste less." },
        ],
    },
    "soil-volume-calculator": {
        subtitle: "Calculate soil for raised beds, planters, and landscaping. Get volume in cubic feet, cubic yards, and bag counts.",
        explanation: {
            heading: "How to Calculate Soil Volume",
            paragraphs: [
                "Soil volume = length × width × depth. For a 4×8 ft raised bed, 12 inches deep: 4 × 8 × 1 = 32 cu ft (1.19 cu yd). Bags of soil are sold in 1 or 2 cu ft sizes. Bulk soil by the cubic yard is cheaper for large projects.",
                "For raised beds, use a mix of 60% topsoil, 30% compost, and 10% perlite or vermiculite. Plan for 5–10% settling after the first watering — fill beds slightly higher than needed. Deeper beds (12–18 inches) support root vegetables; 6–8 inches is fine for herbs and lettuce.",
            ],
            highlight: "A 4×8 ft raised bed, 12\" deep: 32 cu ft = 1.19 cu yd. That's 32 bags (1 cu ft) or 16 bags (2 cu ft). Bulk delivery is cheaper above 3 cu yd.",
        },
        faq: [
            { question: "How much soil for a 4×8 raised bed?", answer: "12 inches deep: 32 cu ft (1.19 cu yd). 18 inches deep: 48 cu ft (1.78 cu yd). At about $3–5 per bag (1 cu ft), a 32 cu ft bed costs $96–$160 in bagged soil. Bulk topsoil runs $20–$50 per cu yd but requires a minimum delivery of 2–3 yards." },
            { question: "How much does soil weigh?", answer: "Dry topsoil: about 75 lbs per cu ft. Wet topsoil: 90–100 lbs per cu ft. One cubic yard of topsoil weighs about 2,000–2,700 lbs. A 4×8 bed, 12\" deep (32 cu ft) will weigh about 2,400 lbs when wet — make sure your raised bed frame can support this." },
        ],
    },
    "roofing-cost-calculator": {
        subtitle: "Estimate roofing costs by material — asphalt shingles, metal, tile, or TPO. Includes material, labor, and tear-off.",
        explanation: {
            heading: "How Much Does a New Roof Cost?",
            paragraphs: [
                "Roofing cost is calculated per square (100 sq ft of roof area). Roof area is larger than floor area due to pitch — a 6/12 pitch adds 12% to flat area. Common costs per square installed: 3-tab shingles: $350. Architectural shingles: $500. Standing seam metal: $900. Clay tile: $1,300.",
                "Total project cost includes tear-off ($100–$150/square), underlayment, flashing, ridge caps, and labor. Steep roofs (8/12+), complex geometry (dormers, valleys), and multi-story homes cost 20–50% more due to additional safety equipment and slower work pace.",
            ],
            highlight: "30×24 ft house, 6/12 pitch: 806 sq ft roof area (8.06 squares). Architectural shingles: $2,015 material + $2,015 labor + $1,008 tear-off = $5,038.",
        },
        faq: [
            { question: "How long does a roof last?", answer: "3-tab asphalt: 15–20 years. Architectural asphalt: 25–30 years. Metal standing seam: 40–70 years. Clay/concrete tile: 50–100 years. Slate: 75–200 years. These are typical lifespans with proper installation and attic ventilation." },
            { question: "Can I roof over existing shingles?", answer: "Most codes allow up to 2 layers of asphalt shingles. Adding a second layer saves tear-off cost ($100–$150/square), but adds weight, may void warranties, and can mask underlying deck damage. Best practice is to tear off and inspect the deck before re-roofing." },
        ],
    },
    "foundation-calculator": {
        subtitle: "Calculate concrete for foundations including footings and stem walls. Enter perimeter, footing width, depth, and wall dimensions.",
        explanation: {
            heading: "How to Calculate Foundation Concrete",
            paragraphs: [
                "Foundation concrete includes two parts: the footing (horizontal spread at the base) and the stem wall (vertical wall above the footing). Footing volume = perimeter × width × depth. Stem wall volume = perimeter × thickness × height. Total concrete = footing + wall.",
                "Standard residential footings: 16–24 inches wide, 8–12 inches deep. Stem walls: 6–8 inches thick, 8–48 inches tall depending on grade and frost depth. Always add 10% to your order for waste, overpour, and variations in the trench. Under-ordering concrete is very expensive.",
            ],
            highlight: "140 ft perimeter, 16\" wide × 8\" deep footing, 8 ft × 8\" wall: footing = 124 cu ft + wall = 747 cu ft = 871 cu ft (32.3 cu yd). Order 35.5 cu yd (+10%).",
        },
        faq: [
            { question: "How wide should footings be?", answer: "Minimum 2× the wall thickness. For an 8\" wall: 16\" wide footing (code minimum for 1-story). For 2-story: 20–24\" wide. In weak soils (clay, silt), widen footings to 24–36\" to spread the load. Always follow local code and soil bearing capacity reports." },
            { question: "How deep do footings need to be?", answer: "Below the frost line — varies by region: 12\" in southern US, 36–48\" in northern states. Code minimum depth is typically 12 inches into undisturbed soil. Deeper is better for frost protection and load distribution. Monolithic slabs combine slab and footing in one pour." },
        ],
    },
    "beam-span-calculator": {
        subtitle: "Find maximum beam span for dimensional lumber, LVL, glulam, and steel beams by load condition and tributary width.",
        explanation: {
            heading: "How to Determine Beam Span",
            paragraphs: [
                "Beam span depends on beam type, size, tributary load width (the area of floor or roof the beam supports), and load type (floor or roof). A larger tributary width means more load, which reduces allowable span. Standard tributary width is 8 feet for residential construction.",
                "LVL (laminated veneer lumber) and glulam beams span farther than dimensional lumber and don't shrink, twist, or warp. Steel beams span the farthest. Common residential beams: doubled 2×10 or 2×12 for short spans, LVL for mid-range, steel for long spans and point loads.",
            ],
            highlight: "LVL 1.75×11.25, 8 ft tributary, floor load: max span ~13 ft. Same beam supporting a roof: ~17 ft. Steel W8×18: floor span ~18 ft, roof ~24 ft.",
        },
        faq: [
            { question: "When should I use an LVL beam?", answer: "LVL (Laminated Veneer Lumber) when: span exceeds doubled 2×12 capacity (~9 ft floor), you need a consistent depth, or the beam is concealed in a wall/ceiling. LVLs are straight, don't crown, and come in lengths up to 60 ft. Common sizes: 1.75×9.25, 1.75×11.25, 1.75×14." },
            { question: "What is tributary width?", answer: "The width of floor or roof area that loads onto the beam. For a beam in the middle of a room, tributary width = room width ÷ 2 (joists connect from each side). A larger tributary width means more load on the beam, requiring a larger beam or shorter span." },
        ],
    },
    "header-size-calculator": {
        subtitle: "Determine the right header size for door and window openings. Enter span, wall type, and load conditions.",
        explanation: {
            heading: "How to Size a Header",
            paragraphs: [
                "Headers carry loads above openings (doors, windows) to the jack studs on each side. For load-bearing walls, header size depends on the span width and number of stories supported. Non-bearing walls need only a flat 2×4 header for spans up to 6 feet.",
                "Load-bearing headers (1 story): 4 ft span = doubled 2×6. 6 ft = doubled 2×8. 8 ft = doubled 2×10. 10 ft = doubled 2×12. For 2-story support, upsize by one or use LVL. Spans over 10 feet typically require engineered beams (LVL, glulam, or steel).",
            ],
            highlight: "6 ft window opening, 1-story load-bearing: Doubled 2×8 (7.25\" deep). 2-story support: Doubled 2×10 (9.25\" deep). Jack stud height = 80\" − header depth.",
        },
        faq: [
            { question: "Can I use a single 2×header instead of doubled?", answer: "No — headers must be doubled (two boards) for load-bearing walls. The two boards are nailed together with 1/2\" plywood spacer in between to match the 3.5\" wall stud depth. Some builders use solid 4×lumber for the same purpose." },
            { question: "What about non-load-bearing walls?", answer: "Non-bearing walls need only a flat 2×4 for openings up to 6 feet, or a single 2×6/2×8 on edge for wider openings. The header just prevents the top plate from sagging. Some codes allow no header at all for narrow openings (under 3 ft) in non-bearing walls." },
        ],
    },
    "deck-stain-calculator": {
        subtitle: "Calculate gallons of deck stain or sealer needed. Covers transparent, semi-transparent, solid, and clear sealer types.",
        explanation: {
            heading: "How Much Deck Stain Do I Need?",
            paragraphs: [
                "Coverage varies by stain type: transparent stains cover ~400 sq ft/gallon (thin coats, mostly absorbed). Semi-transparent: ~300 sq ft/gallon. Solid color stains: ~200 sq ft/gallon (thick film). Clear sealers: ~350 sq ft/gallon.",
                "Most manufacturers recommend 2 coats for optimal protection and color. New, unsealed wood absorbs more stain on the first coat — you may need 10–15% extra. Sand between coats for best adhesion. Re-stain every 2–3 years for horizontal surfaces.",
            ],
            highlight: "300 sq ft deck, semi-transparent, 2 coats: 600 sq ft total coverage ÷ 300 sq ft/gal = 2 gallons. Buy an extra quart for railings and touch-ups.",
        },
        faq: [
            { question: "How long does deck stain last?", answer: "Transparent: 1–2 years. Semi-transparent: 2–3 years. Solid: 3–5 years. Horizontal surfaces wear faster than vertical. Pressure-wash and re-stain when water no longer beads on the surface." },
            { question: "Should I stain or seal a new deck?", answer: "Wait 3–6 months for new pressure-treated wood to dry before staining. Test by sprinkling water — if it absorbs within 10 minutes, the wood is ready. New cedar can be stained immediately." },
        ],
    },
    "paver-base-calculator": {
        subtitle: "Calculate gravel base and sand bedding material for paver installations. Get cubic yards and tons for both layers.",
        explanation: {
            heading: "How Much Base Material for Pavers?",
            paragraphs: [
                "A proper paver base has two layers: compacted gravel base (4–6 inches for pedestrian, 8–12 inches for vehicular) and sand bedding (1 inch). The gravel base provides structural support while the sand bedding lets you level individual pavers.",
                "Crushed gravel weighs about 1.4 tons per cubic yard. Sand weighs about 1.35 tons per cubic yard. Always compact the gravel base in 2-inch lifts with a plate compactor. The sand layer should NOT be compacted before laying pavers — it's screeded flat.",
            ],
            highlight: "200 sq ft patio, 6\" gravel base + 1\" sand: Gravel = 3.7 cu yd (5.1 tons). Sand = 0.62 cu yd (0.8 tons). Order 10% extra for edge compaction.",
        },
        faq: [
            { question: "How deep should paver base be?", answer: "Pedestrian walkways/patios: 4–6 inches of compacted gravel. Driveways: 8–12 inches. Plus 1 inch of leveling sand on top. In areas with freeze-thaw, go deeper — 8 inches minimum for patios and 12 inches for driveways." },
            { question: "What type of gravel for paver base?", answer: "Use 3/4-inch crushed stone (not river rock) for the main base — angular edges interlock when compacted. Top with 1/4-inch crusher fines or concrete sand for the leveling layer. Never use pea gravel for the base — it doesn't compact." },
        ],
    },
    "polymeric-sand-calculator": {
        subtitle: "Calculate polymeric sand bags for paver joints. Enter area, joint width, and paver thickness for an accurate estimate.",
        explanation: {
            heading: "How Much Polymeric Sand Do I Need?",
            paragraphs: [
                "Polymeric sand fills paver joints and hardens when wet, preventing weed growth and insect penetration. Coverage depends on joint width, paver thickness (which determines joint depth), and paver size (which determines joint density).",
                "A standard 50-lb bag covers roughly 25–50 sq ft for standard pavers with 1/4-inch joints. Wider joints and thicker pavers require significantly more sand. Apply in dry conditions and activate with a fine mist of water.",
            ],
            highlight: "200 sq ft of standard pavers, 1/4\" joints, 2-3/8\" thick: approximately 2 bags of 50 lb polymeric sand. Add 10% for waste and uneven joints.",
        },
        faq: [
            { question: "Can I use regular sand between pavers?", answer: "Yes, but regular sand washes out and allows weed growth. Polymeric sand costs more ($25–$35/bag vs. $5 for play sand) but locks pavers together, inhibits weeds, and resists insect penetration. It's the recommended choice for permanent installations." },
            { question: "How do I apply polymeric sand?", answer: "1. Sweep sand into dry joints until full. 2. Compact with plate compactor to settle sand. 3. Sweep more sand to fill any gaps. 4. Blow off ALL excess sand from paver surfaces. 5. Mist lightly with water to activate. Any sand left on the surface will haze permanently." },
        ],
    },
    "asphalt-sealer-calculator": {
        subtitle: "Calculate driveway sealcoat needed based on area, surface condition, and number of coats.",
        explanation: {
            heading: "How Much Driveway Sealer Do I Need?",
            paragraphs: [
                "Asphalt sealcoat coverage depends on surface condition. Smooth, well-maintained driveways: ~90 sq ft per gallon. Fair condition with some cracks: ~70 sq ft/gal. Poor/rough surfaces: ~50 sq ft/gal. Most manufacturers recommend 2 coats for optimal protection.",
                "A 5-gallon bucket covers 350–450 sq ft (one coat). For a typical 2-car driveway (600 sq ft), plan on 2 buckets for 2 coats. Apply in dry weather above 50°F, and allow 24–48 hours between coats.",
            ],
            highlight: "600 sq ft driveway, fair condition, 2 coats: 1,200 sq ft total ÷ 70 sq ft/gal = 17.1 gallons. That's 4 five-gallon buckets.",
        },
        faq: [
            { question: "How often should I seal my driveway?", answer: "Every 2–3 years for asphalt driveways. Don't over-seal — too many coats build up and crack. Wait at least 6 months before sealing new asphalt. The best time to seal is late spring through early fall when temperatures stay above 50°F for 24 hours." },
            { question: "Should I fill cracks before sealing?", answer: "Yes — always fill cracks wider than 1/4 inch with crack filler before sealcoating. For cracks wider than 1 inch, use cold-patch asphalt. Let crack filler cure fully (24–48 hours) before applying sealer. Sealer alone won't fill or seal cracks." },
        ],
    },
    "gravel-driveway-calculator": {
        subtitle: "Calculate gravel for a driveway with base, middle, and top layer breakdown. Get volume in cubic yards and tons.",
        explanation: {
            heading: "How Much Gravel for a Driveway?",
            paragraphs: [
                "A proper gravel driveway has 3 layers: base layer (large #3 stone, 3–4 inches), middle layer (#57 stone, 2 inches), and top/surface layer (#8 or #411 stone, 1–2 inches). Total depth: 6–8 inches minimum. For heavy traffic, use 10–12 inches.",
                "Gravel weighs about 1.4 tons per cubic yard (varies by stone type and moisture). A 50×12 ft driveway at 6 inches deep needs roughly 12.3 cu yd (17.3 tons). Order 10% extra for edge spreading and compaction.",
            ],
            highlight: "50×12 ft driveway, 6\" total depth: 300 cu ft = 11.1 cu yd = 15.6 tons. Base layer (#3): 9.3 tons. Middle (#57): 4.7 tons. Top (#8): 1.6 tons.",
        },
        faq: [
            { question: "What type of gravel for a driveway?", answer: "Bottom layer: #3 stone (1.5–2 inch) for drainage and base. Middle: #57 stone (3/4 inch) for stability. Top: #8 stone or #411 (crusher run/stone dust mix) for a smooth surface. Don't use round river rock — it rolls under tires." },
            { question: "How thick should a gravel driveway be?", answer: "Minimum 6 inches for light traffic. 8–10 inches for regular cars. 12+ inches for heavy vehicles. On clay soil, add 2 inches of depth and consider geotextile fabric under the base layer to prevent stone migration." },
        ],
    },
    "fence-stain-calculator": {
        subtitle: "Calculate gallons of fence stain needed. Enter fence length, height, and whether you're staining one or both sides.",
        explanation: {
            heading: "How Much Stain for a Fence?",
            paragraphs: [
                "Fence stain coverage: transparent ~350 sq ft/gal, semi-transparent ~250 sq ft/gal, solid ~200 sq ft/gal. Wood fences with rough-sawn texture absorb more stain than smooth wood — reduce coverage by 15–20%.",
                "Staining both sides of a fence doubles your material needs. For spraying, add 10% for overspray. A 100 ft × 6 ft privacy fence (both sides) = 1,200 sq ft of staining surface.",
            ],
            highlight: "100 ft fence, 6 ft high, both sides, semi-transparent: 1,200 sq ft ÷ 250 sq ft/gal = 5 gallons.",
        },
        faq: [
            { question: "Should I stain both sides of a fence?", answer: "Ideally yes — staining both sides provides uniform protection and prevents warping from uneven moisture absorption. At minimum, stain the side facing the weather (sun/rain). If you can only do one side, stain the side that gets the most sun exposure." },
            { question: "How long does fence stain last?", answer: "Semi-transparent: 2–4 years. Solid stain: 4–6 years. Transparent: 1–2 years. Application method matters — brush application lasts longest because it works stain into the wood grain. Spray application is faster but may not penetrate as deeply." },
        ],
    },
    "vinyl-fence-calculator": {
        subtitle: "Calculate vinyl fence panels, posts, and gates needed. Enter perimeter and choose fence height and panel width.",
        explanation: {
            heading: "How to Estimate Vinyl Fence Materials",
            paragraphs: [
                "Vinyl fence comes in pre-assembled panels (typically 6 ft or 8 ft wide) with separate posts. Each panel requires a post on each side — shared between adjacent panels. Standard post spacing matches panel width: every 6 or 8 feet.",
                "Account for gates when calculating panels — a standard gate takes 4 feet of fencing. Gate posts are heavier-duty than line posts. Don't forget post caps, which protect the hollow post tops from rain and debris.",
            ],
            highlight: "150 ft of 6 ft privacy fence (8 ft panels), 1 gate: 18 panels, 20 posts, 20 post caps, 1 gate kit.",
        },
        faq: [
            { question: "How long does vinyl fence last?", answer: "20–30+ years with virtually no maintenance. Vinyl doesn't rot, peel, or need painting. Clean with soapy water and a garden hose. Most manufacturers offer lifetime limited warranties. UV inhibitors prevent yellowing; white is the most common and durable color." },
            { question: "Is vinyl fence cheaper than wood?", answer: "Higher upfront cost ($25–$40/ft vs. $15–$25/ft for wood), but much lower lifetime cost. No painting, staining, or replacing rotted boards. Over 20 years, vinyl typically costs less than wood when maintenance is factored in." },
        ],
    },
    "fence-cost-calculator": {
        subtitle: "Estimate total fence cost by material type — wood, vinyl, chain link, aluminum, or wrought iron. Includes material and labor.",
        explanation: {
            heading: "How Much Does a Fence Cost?",
            paragraphs: [
                "Fence costs vary dramatically by material. Chain link is cheapest ($17/ft installed), wood privacy is mid-range ($27/ft), and wrought iron is most expensive ($60/ft). Height affects cost — 8 ft fences cost 30% more than 6 ft.",
                "Labor is typically 50–60% of total fence cost. DIY can save significantly, but professional installation includes post-hole digging, alignment, and proper drainage. Add $200–$500 for each gate. Permit costs vary by municipality ($50–$200).",
            ],
            highlight: "150 ft wood privacy fence, 6 ft tall: Material $1,800 + Labor $2,250 = $4,050 total ($27/ft). Vinyl same length: $6,450 ($43/ft).",
        },
        faq: [
            { question: "What is the cheapest fence to install?", answer: "Chain link: $15–$20/ft installed. Wood picket: $18–$25/ft. Split rail: $12–$18/ft. For privacy, wood privacy fence at $25–$35/ft is the most affordable option. Prices include posts, hardware, and basic installation." },
            { question: "Do I need a permit for a fence?", answer: "Most municipalities require a fence permit ($50–$200). Height limits are typically 6 ft for backyard, 3–4 ft for front yard. Setback from property line is usually 6 inches to 1 foot. Some HOAs have additional restrictions on material, color, and style. Always check before building." },
        ],
    },
    "linear-feet-to-square-feet-calculator": {
        subtitle: "Convert between linear feet and square feet using material width. Works for flooring, siding, trim, and rolls.",
        explanation: {
            heading: "How to Convert Linear Feet to Square Feet",
            paragraphs: [
                "Linear feet to square feet: multiply linear feet by the material width in feet. For example, 100 linear feet of 6-inch-wide boards = 100 × 0.5 = 50 sq ft. To convert back: square feet ÷ width in feet = linear feet.",
                "This conversion is essential for materials sold by the linear foot but needed in square foot coverage, like: flooring boards, siding planks, wall paneling, fabric rolls, and fencing. Width must be converted to feet first (divide inches by 12).",
            ],
            highlight: "100 linear feet of 6\" wide boards = 100 × (6÷12) = 50 sq ft. Conversely, to cover 200 sq ft with 8\" boards: 200 ÷ (8÷12) = 300 linear feet.",
        },
        faq: [
            { question: "What is the difference between linear feet and square feet?", answer: "Linear feet measures length only (one dimension). Square feet measures area (length × width). A 10-foot board is 10 linear feet regardless of its width. If that board is 6 inches wide, it covers 5 square feet of surface area." },
            { question: "How do I convert board feet to square feet?", answer: "Board feet is a volume measure (1 bd ft = 1\" thick × 12\" × 12\"). To convert to square feet of coverage: board feet ÷ thickness in inches = square feet. So 100 board feet of 3/4\" lumber covers about 133 sq ft." },
        ],
    },
    "flooring-cost-calculator": {
        subtitle: "Estimate flooring installation costs by material — hardwood, laminate, tile, vinyl, or carpet. Includes material, labor, and underlayment.",
        explanation: {
            heading: "How Much Does Flooring Cost?",
            paragraphs: [
                "Flooring costs per sq ft installed: carpet ($4), laminate ($4.80), vinyl plank ($5.30), engineered wood ($9), hardwood ($10.50), tile ($11). These include material, labor, and underlayment. Always add 10% for waste and cuts.",
                "Tile is the most labor-intensive (highest labor cost per sq ft). Laminate and vinyl plank are the most DIY-friendly and can save $2–$4/sq ft in labor. Remove old flooring before estimating — demo adds $1–$2/sq ft.",
            ],
            highlight: "15×12 ft room (180 sq ft), laminate: Material $495 + Labor $360 + Underlay $54 = $909 total. Hardwood: $1,188 + $720 + $90 = $1,998.",
        },
        faq: [
            { question: "What is the cheapest flooring option?", answer: "Carpet: $2–$4/sq ft installed. Vinyl sheet: $3–$5. Laminate: $4–$7. Vinyl plank (LVP): $4–$8. Engineered wood: $6–$12. Solid hardwood: $8–$15. Tile: $7–$15. Natural stone: $10–$30. Prices vary by quality, brand, and region." },
            { question: "Should I install flooring myself?", answer: "Floating floors (laminate, click-lock vinyl) are very DIY-friendly and can save $2–$4/sq ft in labor. Tile requires more skill (mortar, grout, leveling). Hardwood nailing/gluing is intermediate. Carpet stretching requires specialized tools. Always level the subfloor first regardless of material." },
        ],
    },
    "bathroom-renovation-cost-calculator": {
        subtitle: "Estimate bathroom remodel costs by size and renovation scope. Get a breakdown of fixtures, tile, plumbing, electrical, and labor.",
        explanation: {
            heading: "How Much Does a Bathroom Renovation Cost?",
            paragraphs: [
                "Bathroom renovation costs vary dramatically based on the scope of work and bathroom size. A cosmetic refresh (paint, new fixtures, accessories) for a small bathroom can cost as little as $3,300, while a full upscale gut renovation of a large master bath can exceed $40,000.",
                "The biggest cost drivers are tile/surfaces (30–35% of budget), labor (35–40%), and plumbing (15–20%). Moving plumbing fixtures (toilet, shower, tub) from their existing locations adds $1,000–$3,000 per fixture. Keeping the existing layout saves significantly on plumbing costs.",
            ],
            highlight: "A medium bathroom, mid-range renovation: $15,000 total — $2,500 fixtures + $3,500 tile + $2,000 plumbing + $1,000 electrical + $6,000 labor.",
        },
        faq: [
            { question: "How long does a bathroom renovation take?", answer: "Cosmetic update: 1–2 weeks. Mid-range remodel: 3–5 weeks. Full gut renovation: 6–10 weeks. Timeline depends on permit requirements, custom orders (vanity, tile), and contractor availability. Allow 4–8 weeks lead time for custom orders." },
            { question: "What adds the most value in a bathroom remodel?", answer: "Updated vanity and fixtures (highest ROI), new tile flooring, modern shower/tub, and improved lighting. Walk-in showers have replaced tubs as the top desired feature. Heated floors and frameless glass shower doors are popular upgrades." },
        ],
    },
    "electrical-cost-calculator": {
        subtitle: "Estimate electrical project costs — full rewiring, panel upgrades, new circuits, or surge protection. Enter project type for a cost breakdown.",
        explanation: {
            heading: "How Much Does Electrical Work Cost?",
            paragraphs: [
                "Electrical costs vary by project scope. A full house rewire runs $6–$10 per square foot ($9,000–$15,000 for a 1,500 sq ft home). A panel upgrade from 100A to 200A costs $2,500–$4,500. Adding a new 20A circuit costs $200–$400 per circuit including materials and labor.",
                "Electricians charge $50–$100/hour depending on region and experience. Permits are required for most electrical work and cost $100–$500. Always hire a licensed electrician — DIY electrical work can void insurance, fail inspection, and create fire hazards.",
            ],
            highlight: "Adding 4 new circuits: $300 materials + $800 labor + $150 permit = $1,250 total. Full rewire of a 1,500 sq ft home: $3,600 materials + $7,400 labor + $500 permit = $11,500.",
        },
        faq: [
            { question: "When should I upgrade my electrical panel?", answer: "When: your panel is 100A and you're adding major appliances (EV charger, AC, hot tub), you see flickering lights, breakers trip frequently, or you have a Federal Pacific or Zinsco panel (known fire hazards). Modern homes should have 200A service minimum." },
            { question: "Do I need a permit for electrical work?", answer: "Yes — most jurisdictions require permits for new circuits, panel upgrades, and rewiring. Minor work like replacing switches/outlets may not require a permit, but check local codes. Unpermitted electrical work can cause problems when selling your home." },
        ],
    },
    "hvac-cost-calculator": {
        subtitle: "Estimate HVAC installation or replacement costs by system type and home size. Covers central AC, heat pumps, furnaces, and mini-splits.",
        explanation: {
            heading: "How Much Does a New HVAC System Cost?",
            paragraphs: [
                "HVAC costs depend on system type, home size, and whether existing ductwork is reused. Central AC replacement: $5,000–$8,000. Heat pump: $6,000–$10,000. Gas furnace: $3,500–$6,000. Ductless mini-split: $3,000–$8,000 (1–4 zones). Full system (AC + furnace): $8,000–$15,000.",
                "Ductwork adds $2,000–$5,000 if new or replacement is needed. Mini-splits avoid this cost entirely. System sizing is critical — oversized units short-cycle (wasting energy), while undersized units run constantly. A Manual J load calculation ($100–$300) ensures proper sizing.",
            ],
            highlight: "1,500 sq ft home, central AC: $2,250 equipment + $3,000 installation + $2,000 ductwork = $7,250 total. Mini-split (no ductwork): $3,750 equipment + $3,500 install = $7,250.",
        },
        faq: [
            { question: "How long does an HVAC system last?", answer: "Central AC: 15–20 years. Heat pump: 12–15 years. Gas furnace: 15–25 years. Ductless mini-split: 15–20 years. Regular maintenance (annual tune-ups, filter changes) extends lifespan. Efficiency drops 5% per year without maintenance." },
            { question: "Heat pump or AC — which is better?", answer: "Heat pumps provide both heating and cooling, making them more efficient overall (300% efficiency for heating vs. 95% for gas furnace). In mild climates, heat pumps are the clear winner. In very cold climates (below 0°F regularly), a dual-fuel system (heat pump + gas furnace backup) is ideal." },
        ],
    },
    "kitchen-renovation-cost-calculator": {
        subtitle: "Estimate kitchen remodel costs by size and scope. Get a breakdown of cabinets, countertops, appliances, flooring, and labor.",
        explanation: {
            heading: "How Much Does a Kitchen Renovation Cost?",
            paragraphs: [
                "Kitchen renovations range from $4,000 (cosmetic refresh) to $92,000+ (large upscale gut renovation). Mid-range kitchen remodels average $28,500 for a medium kitchen. Cabinets are typically the largest single expense (30–35%), followed by labor (25–30%) and countertops (10–15%).",
                "Cosmetic updates (painting cabinets, new hardware, backsplash) offer the highest ROI at 75–80% return. Full gut renovations have a lower ROI (55–65%) but create the most transformation. Keep the existing layout to avoid expensive plumbing and electrical relocation costs.",
            ],
            highlight: "Medium kitchen, mid-range scope: $8,000 cabinets + $4,000 countertops + $5,000 appliances + $2,500 flooring + $9,000 labor = $28,500 total.",
        },
        faq: [
            { question: "How long does a kitchen renovation take?", answer: "Cosmetic: 1–3 weeks. Mid-range: 6–10 weeks. Full gut: 10–16 weeks. Ordering custom cabinets adds 6–12 weeks of lead time before work begins. Plan to live without a kitchen for the duration — set up a temporary kitchen area with a microwave and mini-fridge." },
            { question: "What kitchen upgrades have the best ROI?", answer: "Highest ROI: painted/refaced cabinets (80%), new countertops (75%), updated appliances (70%), new flooring (70%). Lowest ROI: moving walls, relocating plumbing, ultra-high-end finishes. A minor kitchen remodel typically recoups 75–80% of its cost at resale." },
        ],
    },
    "acreage-calculator": {
        subtitle: "Calculate land area in acres, square feet, hectares, and square meters. Enter length and width for instant conversions.",
        explanation: {
            heading: "How to Calculate Acreage",
            paragraphs: [
                "One acre equals 43,560 square feet, approximately 208.71 × 208.71 feet, or about 90% of a football field (including end zones). To calculate acreage from dimensions: multiply length × width in feet, then divide by 43,560.",
                "For irregular lot shapes, divide the property into rectangles and triangles, calculate each area separately, and add them together. For very irregular parcels, a GPS survey provides the most accurate measurement. County GIS maps often list parcel acreage as well.",
            ],
            highlight: "A lot measuring 200 × 200 ft = 40,000 sq ft ÷ 43,560 = 0.918 acres. A full acre would be approximately 209 × 209 ft.",
        },
        faq: [
            { question: "How big is an acre?", answer: "43,560 sq ft — roughly 209 × 209 ft (square), or any rectangle with that area (e.g., 100 × 435 ft). About 90% of a football field. Visualize 16 tennis courts or 75% of a soccer field. A typical suburban lot is 1/4 to 1/3 acre." },
            { question: "How many acres is my lot?", answer: "Multiply length × width in feet, then divide by 43,560. For example, a 150 × 100 ft lot = 15,000 sq ft = 0.344 acres. You can also check your property deed, tax records, or county GIS website for the official acreage." },
        ],
    },
    "elevation-grade-calculator": {
        subtitle: "Calculate slope grade percentage, ratio, and angle from rise and run. Essential for drainage, roads, ADA ramps, and landscaping.",
        explanation: {
            heading: "How to Calculate Elevation Grade",
            paragraphs: [
                "Grade (slope) is the ratio of vertical rise to horizontal run, expressed as a percentage. A 6% grade means 6 feet of rise over 100 feet of horizontal run. Grade = (rise ÷ run) × 100. Positive grade = uphill; negative grade = downhill.",
                "Common grade requirements: lawn drainage (1–2%), driveway maximum (15–25%), wheelchair ramp (ADA maximum 8.33%, or 1:12), French drain (1%), sanitary sewer (1–2%), parking lot (1–5%). Steeper grades increase erosion, stormwater runoff, and construction difficulty.",
            ],
            highlight: "A 6 ft rise over 100 ft run: grade = 6%, slope ratio = 1:16.7, angle = 3.43°. Slope length = 100.2 ft — slightly longer than the horizontal run.",
        },
        faq: [
            { question: "What grade should my yard have for drainage?", answer: "Minimum 1% (1/8 inch per foot) away from the foundation — 2% (1/4 inch per foot) is preferred. For the first 10 feet from the house, aim for 6 inches of fall. After that, 1% is sufficient to move water to drainage areas or the street." },
            { question: "What is the maximum driveway grade?", answer: "Most building codes allow up to 15% (some areas up to 25%). Ideal driveway grade: 5–8%. Above 12%, consider heating elements or textured concrete for winter traction. ADA ramps must not exceed 8.33% (1:12 ratio) with landings every 30 feet." },
        ],
    },
    "grass-seed-calculator": {
        subtitle: "Calculate how much grass seed you need for a new lawn or overseeding project. Select your grass type, enter lawn area, and get pounds of seed, 5 lb and 25 lb bag counts, and seeding rate — instantly.",
        explanation: {
            heading: "How Much Grass Seed Do I Need?",
            paragraphs: [
                "The amount of grass seed you need depends on three factors: the grass species you're planting, the size of your lawn in square feet, and whether you're starting a brand-new lawn or overseeding an existing one. Seeding rates are measured in pounds per 1,000 square feet — Kentucky bluegrass needs only 2–3 lbs/1,000 sq ft, while tall fescue requires 6–8 lbs. Overseeding uses roughly half the new-lawn rate because you're filling gaps, not establishing bare ground.",
                "For the best germination results, prepare the soil properly before spreading seed. Dethatch or aerate compacted soil, rake the surface to create good seed-to-soil contact, spread seed evenly with a broadcast or drop spreader, lightly rake seed into the top ¼ inch of soil, and keep the seedbed consistently moist (not waterlogged) for 2–4 weeks. Applying a starter fertilizer at seeding time gives seedlings the phosphorus they need for root development.",
            ],
            highlight: "2,000 sq ft new lawn with tall fescue at 8 lbs/1,000 sq ft = 16 lbs of seed = 4 bags (5 lb) or 1 bag (25 lb). Overseeding the same area at half rate = 8 lbs = 2 bags (5 lb).",
        },
        contentHTML: `
<p>Establishing a lush, healthy lawn is one of the most rewarding <strong>home improvement projects</strong> in the United States. Whether you're building a new home, renovating a bare yard, or thickening an existing lawn, understanding how much <strong>grass seed</strong> you need — and which type to choose — saves money and ensures even coverage from the start.</p>

<h2>Sod vs. Grass Seed: Which Is Right for You?</h2>
<p>Homeowners in the US have two primary options for establishing a lawn: <strong>sod</strong> (pre-grown grass rolls) or <strong>grass seed</strong>. Each has distinct advantages:</p>
<p>Measure lawn area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For mulch beds, see our <a href="/construction-calculators/mulch-calculator">mulch calculator</a>. For landscape gravel, try our <a href="/construction-calculators/gravel-calculator">gravel calculator</a>.</p>
<table>
<thead><tr><th>Factor</th><th>Grass Seed</th><th>Sod</th></tr></thead>
<tbody>
<tr><td><strong>Cost per 1,000 sq ft</strong></td><td>$15–$60</td><td>$300–$800</td></tr>
<tr><td><strong>Installation</strong></td><td>DIY-friendly; spread with a spreader</td><td>Labor-intensive; must be laid within 24 hrs</td></tr>
<tr><td><strong>Time to usable lawn</strong></td><td>6–10 weeks for establishment</td><td>2–3 weeks for root attachment</td></tr>
<tr><td><strong>Variety selection</strong></td><td>Wide — dozens of species and mixes</td><td>Limited — typically 3–5 varieties per supplier</td></tr>
<tr><td><strong>Best planting window</strong></td><td>Fall (cool-season) or late spring (warm-season)</td><td>Nearly any time soil isn't frozen</td></tr>
<tr><td><strong>Best for</strong></td><td>Large areas, budget projects, specific varieties</td><td>Instant results, slopes, erosion control</td></tr>
</tbody>
</table>
<p><strong>Bottom line:</strong> Grass seed costs 80–90% less than sod and offers far more variety options. Sod provides an instant lawn and works in seasons when seeding isn't viable. For large yards (5,000+ sq ft), seed is almost always the more economical choice.</p>

<h2>Warm-Season vs. Cool-Season Grasses</h2>
<p>US lawn grasses fall into two categories based on the climate where they grow best:</p>
<h3>Cool-Season Grasses</h3>
<p>Thrive in the <strong>northern US</strong> (USDA zones 3–6) where temperatures range 60–75°F. They grow most actively in spring and fall, and may go dormant (turn brown) during hot summers. Best planted in <strong>early fall</strong> (late August–October).</p>
<ul>
<li><strong>Kentucky Bluegrass</strong> — Classic dark green lawn. Dense, self-spreading via rhizomes. Slow to establish but beautiful once mature. Dominant in the Midwest and Northeast.</li>
<li><strong>Tall Fescue</strong> — Deep-rooted, drought-tolerant, shade-tolerant. The #1 choice for the <strong>transition zone</strong> (Virginia, Tennessee, Kansas, Missouri). Bunching type — doesn't spread, so overseed bare spots.</li>
<li><strong>Fine Fescue</strong> — Low-maintenance, shade-tolerant, fine-textured. Excellent for under trees and shady areas. Common in seed mixes.</li>
<li><strong>Perennial Ryegrass</strong> — Fastest germination (5–10 days). Often used for quick cover and in seed mixes. Less heat- and drought-tolerant.</li>
</ul>
<h3>Warm-Season Grasses</h3>
<p>Thrive in the <strong>southern US</strong> (USDA zones 7–10) where summers are hot and long. They grow most actively when temperatures are 80–95°F and go dormant (tan/brown) in winter. Best planted in <strong>late spring to early summer</strong>.</p>
<ul>
<li><strong>Bermuda Grass</strong> — The most popular warm-season lawn grass. Extremely heat- and traffic-tolerant. Aggressive spreader. Dominant in Texas, the Southeast, and Southern California.</li>
<li><strong>Bahia Grass</strong> — Tough, low-maintenance, drought-tolerant. Common in the Deep South (Florida, Gulf Coast). Coarse-textured.</li>
<li><strong>Centipede Grass</strong> — Ultra-low-maintenance, slow-growing. Thrives in acidic, sandy soils of the Southeast. Very low seeding rate (0.5 lb/1,000 sq ft).</li>
<li><strong>St. Augustine Grass</strong> — Shade-tolerant, lush, thick-bladed. Dominant in Florida and Gulf Coast. Typically planted from plugs or sod — seed is available but uncommon.</li>
</ul>

<h2>Grass Seed Coverage Rates</h2>
<p>Every grass type has a recommended <strong>seeding rate</strong> — the number of pounds of seed per 1,000 square feet. Overseeding uses approximately half the new-lawn rate because the soil already has existing turf.</p>
<table>
<thead><tr><th>Grass Type</th><th>Season</th><th>New Lawn (lb/1,000 sf)</th><th>Overseeding (lb/1,000 sf)</th><th>Germination (days)</th></tr></thead>
<tbody>
<tr><td><strong>Kentucky Bluegrass</strong></td><td>Cool</td><td>2–3</td><td>1–1.5</td><td>14–30</td></tr>
<tr><td><strong>Tall Fescue</strong></td><td>Cool</td><td>6–8</td><td>3–4</td><td>7–14</td></tr>
<tr><td><strong>Fine Fescue</strong></td><td>Cool</td><td>4–5</td><td>2–3</td><td>7–14</td></tr>
<tr><td><strong>Perennial Ryegrass</strong></td><td>Cool</td><td>6–8</td><td>3–4</td><td>5–10</td></tr>
<tr><td><strong>Bermuda Grass</strong></td><td>Warm</td><td>1–2</td><td>0.5–1</td><td>10–30</td></tr>
<tr><td><strong>Bahia Grass</strong></td><td>Warm</td><td>6–8</td><td>3–4</td><td>14–28</td></tr>
<tr><td><strong>Centipede Grass</strong></td><td>Warm</td><td>0.25–0.5</td><td>0.15–0.25</td><td>14–28</td></tr>
<tr><td><strong>St. Augustine</strong></td><td>Warm</td><td>0.33–0.5</td><td>0.2–0.25</td><td>7–14</td></tr>
<tr><td><strong>Sun & Shade Mix</strong></td><td>Cool</td><td>4–6</td><td>2–3</td><td>7–21</td></tr>
<tr><td><strong>Zoysia Grass</strong></td><td>Warm</td><td>1–2</td><td>0.5–1</td><td>14–21</td></tr>
</tbody>
</table>
<p><strong>Tip:</strong> Seed mixes (like "Sun & Shade" or "Contractor's Mix") blend 2–4 species for broader adaptability. They're a smart choice if parts of your yard get different amounts of sun.</p>

<h2>Step-by-Step: How to Calculate Grass Seed</h2>
<ol>
<li><strong>Measure your lawn area in square feet.</strong> For rectangular lawns: length × width. For irregular shapes, break the yard into rectangles and add them together. If you know acreage, multiply by 43,560 to convert to square feet.</li>
<li><strong>Subtract non-grass areas.</strong> Deduct driveways, patios, flower beds, sidewalks, and the house footprint from the total lot area.</li>
<li><strong>Choose your grass type</strong> and find its seeding rate (lbs per 1,000 sq ft) from the table above. Use the "New Lawn" rate for bare soil or the "Overseeding" rate for existing turf.</li>
<li><strong>Calculate total seed needed:</strong> (lawn area ÷ 1,000) × seeding rate = total pounds of seed.</li>
<li><strong>Convert to bags:</strong> Divide total pounds by the bag size (typically 5 lb or 25 lb). Round up — you can't buy a fraction of a bag, and having a small surplus for touch-up seeding is ideal.</li>
</ol>

<h2>Worked Example: Seeding a 0.25-Acre Yard</h2>
<p>Suppose you have a <strong>quarter-acre yard</strong> (a common suburban lot size) and want to plant a new lawn with <strong>tall fescue</strong>.</p>
<h3>Step 1: Convert Acres to Square Feet</h3>
<p>0.25 acres × 43,560 sq ft/acre = <strong>10,890 sq ft</strong></p>
<h3>Step 2: Subtract Non-Grass Areas</h3>
<p>House footprint (1,200 sq ft) + driveway (400 sq ft) + patio (200 sq ft) + walkways (100 sq ft) = 1,900 sq ft<br>
Net lawn area: 10,890 − 1,900 = <strong>8,990 sq ft</strong></p>
<h3>Step 3: Calculate Seed Needed</h3>
<p>Tall fescue new lawn rate: 8 lbs per 1,000 sq ft<br>
(8,990 ÷ 1,000) × 8 = 8.99 × 8 = <strong>71.9 lbs of seed</strong></p>
<h3>Step 4: Convert to Bags</h3>
<p>71.9 ÷ 25 = 2.88 → Buy <strong>3 bags of 25 lb seed</strong> (75 lbs total, with 3.1 lbs left over for touch-ups).</p>

<h2>Grass Seed Cost (2025 US Pricing)</h2>
<table>
<thead><tr><th>Grass Type</th><th>Cost per Pound</th><th>5 lb Bag</th><th>25 lb Bag</th><th>Cost per 1,000 sq ft (new lawn)</th></tr></thead>
<tbody>
<tr><td><strong>Kentucky Bluegrass</strong></td><td>$5–$10</td><td>$25–$50</td><td>$100–$200</td><td>$15–$30</td></tr>
<tr><td><strong>Tall Fescue</strong></td><td>$2–$5</td><td>$10–$25</td><td>$40–$100</td><td>$16–$40</td></tr>
<tr><td><strong>Perennial Ryegrass</strong></td><td>$2–$5</td><td>$10–$25</td><td>$40–$100</td><td>$16–$40</td></tr>
<tr><td><strong>Bermuda Grass</strong></td><td>$5–$12</td><td>$25–$60</td><td>$100–$250</td><td>$10–$24</td></tr>
<tr><td><strong>Fine Fescue</strong></td><td>$3–$7</td><td>$15–$35</td><td>$60–$140</td><td>$15–$35</td></tr>
<tr><td><strong>Sun & Shade Mix</strong></td><td>$2–$6</td><td>$10–$30</td><td>$40–$120</td><td>$12–$36</td></tr>
<tr><td><strong>Zoysia Grass</strong></td><td>$8–$15</td><td>$40–$75</td><td>$160–$300</td><td>$16–$30</td></tr>
<tr><td><strong>Starter Fertilizer</strong></td><td>—</td><td>—</td><td>$20–$35 (covers 5,000 sq ft)</td><td>$4–$7</td></tr>
</tbody>
</table>
<p><strong>Where to buy:</strong> Most US homeowners purchase grass seed from Home Depot, Lowe's, Tractor Supply, or online retailers like Amazon and SeedSuperstore. Name brands include Scotts, Pennington, Jonathan Green, and Barenbrug. For large projects (1+ acre), buying in bulk from a farm supply store is significantly cheaper per pound.</p>

<h2>Lawn Preparation Checklist</h2>
<p>Proper soil preparation is the single biggest factor in seeding success. Skipping these steps is the #1 reason new lawns fail:</p>
<ol>
<li><strong>Test your soil.</strong> A $15–$20 soil test from your county extension office reveals pH, nutrient levels, and amendment recommendations. Most grasses prefer pH 6.0–7.0. If pH is below 5.5, apply lime. If above 7.5, apply sulfur.</li>
<li><strong>Grade the surface.</strong> Ensure the yard slopes away from the house foundation at 1–2% grade (1–2 inches drop per 10 feet). Fill low spots with topsoil. Remove rocks, debris, and old vegetation.</li>
<li><strong>Amend the top 4–6 inches.</strong> Work in 1–2 inches of compost if the soil is sandy or heavy clay. This improves water retention, drainage, and root growth.</li>
<li><strong>Rake the surface smooth.</strong> Create a firm, fine-textured seedbed. Break up clumps larger than a marble. Light rolling (half-filled lawn roller) firms the bed without compacting it.</li>
<li><strong>Spread seed evenly.</strong> Use a <strong>broadcast spreader</strong> for large areas or a <strong>drop spreader</strong> for precise edges. Apply half the seed in one direction and the other half perpendicular for uniform coverage.</li>
<li><strong>Lightly rake seed in.</strong> Cover seed with ⅛–¼ inch of soil using a leaf rake. Don't bury it — most grass seed needs light to germinate.</li>
<li><strong>Apply starter fertilizer</strong> (high phosphorus, such as 18-24-12) at seeding time. Phosphorus promotes root development in seedlings.</li>
<li><strong>Consider a thin layer of straw mulch</strong> (not hay — it contains weed seeds). One bale covers about 1,000 sq ft at the right thickness. This retains moisture and prevents erosion on slopes.</li>
</ol>

<h2>Watering Schedule After Seeding</h2>
<p>Consistent moisture is critical during germination. The seedbed should stay moist but not puddled:</p>
<table>
<thead><tr><th>Phase</th><th>Duration</th><th>Watering Frequency</th><th>Amount</th></tr></thead>
<tbody>
<tr><td><strong>Days 1–14 (germination)</strong></td><td>2 weeks</td><td>2–3 times daily, 5–10 min each</td><td>Keep top ½ inch moist</td></tr>
<tr><td><strong>Days 15–30 (seedling growth)</strong></td><td>2 weeks</td><td>Once daily, 15–20 min</td><td>Moisten top 1 inch</td></tr>
<tr><td><strong>Days 31–60 (establishment)</strong></td><td>4 weeks</td><td>Every other day, 20–30 min</td><td>Moisten top 2 inches</td></tr>
<tr><td><strong>After 60 days (mature lawn)</strong></td><td>Ongoing</td><td>1–2 times per week</td><td>1 inch per week total</td></tr>
</tbody>
</table>
<p><strong>Tip:</strong> Water early in the morning (6–10 AM) to minimize evaporation and allow blades to dry before evening, which reduces disease risk. Avoid watering at night — wet grass overnight promotes fungal diseases like brown patch and dollar spot.</p>

<h2>Best Grass Type by US Region</h2>
<table>
<thead><tr><th>Region</th><th>States</th><th>Best Grass Types</th></tr></thead>
<tbody>
<tr><td><strong>Northeast</strong></td><td>CT, DE, MA, MD, ME, NH, NJ, NY, PA, RI, VT</td><td>Kentucky bluegrass, fine fescue, perennial ryegrass</td></tr>
<tr><td><strong>Midwest</strong></td><td>IA, IL, IN, MI, MN, MO, OH, WI</td><td>Kentucky bluegrass, tall fescue, perennial ryegrass</td></tr>
<tr><td><strong>Southeast</strong></td><td>AL, FL, GA, LA, MS, NC, SC</td><td>Bermuda, zoysia, centipede, St. Augustine, bahia</td></tr>
<tr><td><strong>South Central</strong></td><td>AR, KS, OK, TX</td><td>Bermuda, zoysia, buffalo grass, bahia</td></tr>
<tr><td><strong>Transition Zone</strong></td><td>KY, MO, TN, VA, WV, southern KS/IL/IN</td><td>Tall fescue (primary), zoysia, bermuda, KBG blends</td></tr>
<tr><td><strong>Mountain West</strong></td><td>CO, ID, MT, NM, UT, WY</td><td>Kentucky bluegrass, tall fescue, buffalo grass</td></tr>
<tr><td><strong>Pacific Northwest</strong></td><td>OR, WA</td><td>Perennial ryegrass, fine fescue, KBG</td></tr>
<tr><td><strong>California</strong></td><td>CA</td><td>Bermuda (south), tall fescue (north), buffalo grass</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "How much grass seed do I need per 1,000 square feet?", answer: "It depends on the grass type. Kentucky bluegrass: 2–3 lbs. Tall fescue: 6–8 lbs. Perennial ryegrass: 6–8 lbs. Bermuda grass: 1–2 lbs. Fine fescue: 4–5 lbs. Centipede: 0.25–0.5 lbs. For overseeding, use half the new-lawn rate. Multiply the rate by the number of 1,000 sq ft units in your lawn." },
            { question: "When is the best time to plant grass seed?", answer: "Cool-season grasses (bluegrass, fescue, ryegrass): late August to mid-October is ideal — fall gives seedlings 2 seasons of growth before summer stress. Early spring (March–April) is the second-best window. Warm-season grasses (Bermuda, zoysia, centipede): late May to early July when soil temperatures consistently reach 65–70°F. Fall seeding of warm-season grasses will fail due to winter dormancy." },
            { question: "How long does grass seed take to germinate?", answer: "Perennial ryegrass: 5–10 days (fastest). Tall fescue: 7–14 days. Bermuda grass: 10–30 days. Kentucky bluegrass: 14–30 days (slowest). Fine fescue: 7–14 days. Zoysia: 14–21 days. These times assume consistent moisture and soil temperatures in the optimal range. Cold soil, dry conditions, or buried seed can delay germination significantly." },
            { question: "What is the difference between overseeding and new lawn seeding?", answer: "New lawn seeding plants grass on bare soil at the full recommended seeding rate. Overseeding spreads seed over an existing lawn to fill in bare spots, thicken thin areas, or introduce improved varieties — at roughly half the new-lawn rate. Overseeding is best done in fall after aerating and dethatching to improve seed-to-soil contact." },
            { question: "Which grass type is best for my region?", answer: "Northeast and Midwest: Kentucky bluegrass or bluegrass-fescue-rye mixes. Southeast and Gulf Coast: Bermuda, zoysia, centipede, or St. Augustine. Transition Zone (TN, VA, KY, MO): tall fescue is the #1 choice. Southwest and Texas: Bermuda or buffalo grass. Pacific Northwest: perennial ryegrass or fine fescue. Mountain West: Kentucky bluegrass." },
            { question: "Can I overseed without dethatching or aerating?", answer: "You can, but results will be poor. Seed needs contact with soil to germinate — if it sits on top of thatch or compacted ground, germination rates drop below 30%. For best results: dethatch if the thatch layer exceeds ½ inch, core aerate to relieve compaction (the aeration holes create perfect seed beds), then spread seed and top-dress with a thin layer of compost." },
            { question: "How long until my new lawn is ready to mow?", answer: "Wait until the grass reaches 3–4 inches tall before the first mowing — typically 3–4 weeks after germination for fast growers (ryegrass, fescue) and 6–8 weeks for slow growers (bluegrass, bermuda). Set the mower to its highest setting and remove no more than ⅓ of the blade length. Mowing too early or too short can uproot seedlings." },
            { question: "Should I use a starter fertilizer when seeding?", answer: "Yes — strongly recommended. Starter fertilizers are high in phosphorus (the middle number, e.g., 18-24-12), which promotes root development in seedlings. Apply at the rate listed on the bag, typically 3–4 lbs per 1,000 sq ft. Avoid weed-and-feed products — the pre-emergent herbicide will kill germinating grass seed. Wait at least 60 days after seeding before applying any weed control." },
            { question: "How much does grass seed cost vs. sod?", answer: "Grass seed: $15–$60 per 1,000 sq ft (seed + starter fertilizer). Sod: $300–$800 per 1,000 sq ft (material + delivery). For a 5,000 sq ft lawn: seed costs $75–$300 total vs. $1,500–$4,000 for sod. Seed is 80–90% cheaper but takes 6–10 weeks to establish. Sod provides an instant lawn but has far fewer variety options." },
            { question: "How do I fix bare spots in an existing lawn?", answer: "Rake the bare area to loosen the top ½ inch of soil. Remove dead grass and debris. Apply seed at the full new-lawn rate for your grass type. Cover lightly with ⅛ inch of topsoil or compost. Apply starter fertilizer. Water 2–3 times daily to keep the patch moist until germination. For spots larger than 1 sq ft, consider a seed-and-mulch product like Scotts EZ Seed, which includes seed, mulch, and fertilizer in one." },
        ],
    },
    "lawn-mowing-calculator": {
        subtitle: "Calculate lawn mowing time, fuel cost per mow, and seasonal expense by lawn size and mower type.",
        explanation: {
            heading: "How Long Does It Take to Mow a Lawn?",
            paragraphs: [
                "Mowing time depends on lawn size and mower type. A push mower covers about 150 sq ft per minute (2,500 sq ft/hr). A riding mower with a 42-inch deck covers 500 sq ft/min (about 1 acre/hr). A commercial zero-turn with a 54-inch deck covers 800 sq ft/min (2+ acres/hr).",
                "Fuel costs per mow are modest — a push mower uses about 0.5 gallons per hour ($2.50/hr). Electric push mowers cost about $0.15/hr in electricity. Riding mowers use 1–1.5 gal/hr ($4–$6/hr). Over a 28-week season, fuel costs add up — a half-acre lot with a push mower costs about $60–$70/season in fuel.",
            ],
            highlight: "5,000 sq ft lawn with a push gas mower: 33 minutes per mow. Fuel: $1.39/mow. Over 28 weekly mows: $38.89/season. A riding mower does it in 10 minutes but costs $2.22/mow.",
        },
        faq: [
            { question: "How often should I mow my lawn?", answer: "Follow the 1/3 rule — never cut more than 1/3 of the grass blade length at once. This means weekly mowing during peak growing season (spring/fall for cool-season, summer for warm-season). In slow-growth periods, every 10–14 days is fine." },
            { question: "What height should I mow my lawn?", answer: "Kentucky bluegrass: 2.5–3.5 inches. Tall fescue: 3–4 inches. Bermuda: 1–2 inches. Zoysia: 1–2 inches. Mow higher in summer (top of range) for drought tolerance and deeper roots. Mow shorter for the last cut of fall to reduce snow mold risk." },
        ],
    },
    "plant-and-flower-calculator": {
        subtitle: "Calculate how many plants or flowers you need for a garden bed. Enter bed dimensions and plant spacing for total count and flats.",
        explanation: {
            heading: "How Many Plants for a Garden Bed?",
            paragraphs: [
                "Plant count depends on bed area and desired spacing. For a grid layout: plants per row = (bed length ÷ spacing) + 1. Rows = (bed width ÷ spacing) + 1. Total plants = rows × plants per row. For a triangular (staggered) layout, add 15% more plants.",
                "Common spacing: annuals (6–12 inches apart), perennials (12–24 inches), shrubs (24–48 inches), ground cover (6–12 inches). Closer spacing gives faster fill-in but is more expensive. Wider spacing takes 1–2 seasons to fill in but costs less upfront.",
            ],
            highlight: "A 10 × 8 ft bed with 12-inch spacing: 11 plants per row × 9 rows = 99 plants. That's 6 flats of 18-count annuals. At 6-inch spacing: 21 × 17 = 357 plants.",
        },
        faq: [
            { question: "How far apart should I plant flowers?", answer: "Check the plant tag for mature spread. Annuals (petunias, marigolds): 6–12 inches. Small perennials (lavender, salvia): 12–18 inches. Large perennials (hostas, daylilies): 18–24 inches. Shrubs: half the mature width. Mass plantings can be closer for instant impact." },
            { question: "How many flats of flowers do I need?", answer: "Flats contain 18 plants (standard 6-cell packs × 3). Divide your total plant count by 18. For example, 99 plants = 5.5 flats — buy 6 to have extras for replacements. Flats of 4-inch pots usually contain 12 plants. Quart pots are sold individually." },
        ],
    },
    "sod-calculator": {
        subtitle: "Calculate sod rolls or pallets needed for a new lawn. Enter area and waste percentage for total coverage and cost estimate.",
        explanation: {
            heading: "How Much Sod Do I Need?",
            paragraphs: [
                "Standard sod rolls are 2 ft × 5 ft = 10 sq ft each. A pallet contains approximately 450 sq ft of sod (45 rolls). Calculate your lawn area, add 5–10% for waste (cutting around edges, irregular shapes, and damaged pieces), then divide by 10 for rolls or 450 for pallets.",
                "Sod costs $0.30–$0.80 per sq ft for the sod itself, plus $0.50–$1.00 per sq ft for professional installation. A 2,000 sq ft lawn costs $600–$1,600 for sod alone, or $1,600–$3,600 installed. Prepare the soil (grade, amend, water) before sod delivery day.",
            ],
            highlight: "2,000 sq ft lawn + 10% waste = 2,200 sq ft. That's 220 rolls or about 4.9 pallets. Cost range: $660–$1,760 for sod. Installed: $1,760–$3,960.",
        },
        faq: [
            { question: "How long does sod take to root?", answer: "Initial root attachment: 10–14 days. Fully rooted: 4–6 weeks. Start mowing after 2–3 weeks (when you can tug a corner and it resists). Stay off new sod for the first 2 weeks. Water heavily for the first 2 weeks (keep consistently moist), then gradually reduce." },
            { question: "Is sod or seed cheaper?", answer: "Seed is much cheaper ($0.05–$0.15/sq ft vs. $0.30–$0.80 for sod) but takes 6–8 weeks to establish and requires intensive watering. Sod gives instant lawn and is ready for light use in 2 weeks. Sod also prevents erosion on slopes where seed would wash away." },
        ],
    },
    "sod-weight-calculator": {
        subtitle: "Calculate the weight of sod rolls and pallets by quantity and moisture condition. Plan delivery and transport needs.",
        explanation: {
            heading: "How Much Does Sod Weigh?",
            paragraphs: [
                "A standard sod roll (2 × 5 ft, 10 sq ft) weighs approximately 15 lbs when freshly cut under normal moisture conditions. Wet sod can weigh 30% more (19–20 lbs per roll). A full pallet (~450 sq ft, ~45 rolls) weighs about 1,500 lbs under normal conditions — up to 2,000 lbs when wet.",
                "Weight matters for delivery and transport. A standard pickup truck can carry about 1 pallet (1,500 lbs). A half-ton truck should limit to 1 pallet. A 3/4-ton truck can carry 2 pallets. For larger jobs, have the supplier deliver. Sod should be installed the same day it's delivered — it deteriorates quickly in stacked pallets.",
            ],
            highlight: "1 pallet (normal moisture): 1,500 lbs. 50 individual rolls: 750 lbs. Total: 2,250 lbs. Wet conditions: add 30% = 2,925 lbs — you'll need a heavy-duty truck or trailer.",
        },
        faq: [
            { question: "Can I pick up sod in my truck?", answer: "A half-ton pickup (F-150, Silverado 1500) can safely carry 1 pallet (~1,500 lbs). A 3/4-ton truck can carry 2 pallets. For 3+ pallets, use a trailer or have it delivered. Always account for wet sod being 30% heavier. Lower your tailgate and slide pallets in over it." },
            { question: "How long can sod sit on a pallet?", answer: "Install within 12–24 hours of harvest. In hot weather (above 80°F), install the same day. Stacked sod generates heat and the inner rolls begin to yellow within 24 hours. If you can't install immediately, unroll the sod in a shaded area and keep it moist." },
        ],
    },
    "stone-calculator": {
        subtitle: "Calculate stone or rock needed for landscaping, pathways, and walls. Enter area, depth, and stone type for tons and cubic yards.",
        explanation: {
            heading: "How Much Stone Do I Need?",
            paragraphs: [
                "Stone volume = area × depth. Convert to cubic yards (divide cubic feet by 27), then multiply by the stone's density to get tons. Crushed stone: 1.4 tons/cu yd. River rock: 1.35 tons/cu yd. Flagstone: 1.5 tons/cu yd. Lava rock: 0.5 tons/cu yd (much lighter).",
                "Coverage depth depends on application: decorative ground cover (2–3 inches), pathway (3–4 inches), drainage (4–6 inches), driveway base (6–12 inches). Order 10% extra for settling, compaction, and edge irregularities. Bulk stone is sold by the ton — one ton covers roughly 100 sq ft at 2-inch depth.",
            ],
            highlight: "20×15 ft patio area, 3\" crushed stone: 300 sq ft × 0.25 ft = 75 cu ft = 2.8 cu yd × 1.4 = 3.9 tons. At $50/ton: ~$194. Lava rock same area: 1.4 tons at $100/ton = $139.",
        },
        faq: [
            { question: "What type of stone should I use for landscaping?", answer: "Decorative beds: river rock or lava rock (low maintenance, no decomposition). Pathways: crushed stone or pea gravel (compacts well). Patios: flagstone (flat, natural look). Drainage: crushed stone #57 (excellent water flow). Retaining walls: wall stone or fieldstone." },
            { question: "How much does a ton of stone cover?", answer: "At 2-inch depth: ~100 sq ft. At 3-inch depth: ~65 sq ft. At 4-inch depth: ~50 sq ft. Coverage varies slightly by stone type and size. Larger stones (4-6 inch river rock) have more air gaps and cover slightly more area. Crushed stone packs tightly with less void space." },
        ],
    },
    "cubic-inches-calculator": {
        subtitle: "Calculate volume in cubic inches from dimensions. Convert to cubic feet, gallons, liters, and milliliters.",
        explanation: {
            heading: "How to Calculate Cubic Inches",
            paragraphs: [
                "Cubic inches = length (in) × width (in) × height (in). One cubic inch = 16.387 mL = 0.004329 US gallons. There are 1,728 cubic inches in one cubic foot and 231 cubic inches in one US gallon.",
                "Common uses: engine displacement (e.g., a 350 cubic inch V8), box volume for shipping, 3D printing build volume, and small container capacity.",
            ],
            highlight: "A 12 × 8 × 6 inch box = 576 cubic inches = 0.33 cubic feet = 2.49 US gallons = 9,439 mL.",
        },
        faq: [
            { question: "How many cubic inches in a gallon?", answer: "231 cubic inches = 1 US gallon. To convert cubic inches to gallons, divide by 231. For example, 462 cubic inches = 2 gallons." },
            { question: "How do I convert cubic inches to cubic feet?", answer: "Divide by 1,728. One cubic foot = 12 × 12 × 12 = 1,728 cubic inches." },
        ],
    },
    "cubic-meters-calculator": {
        subtitle: "Calculate volume in cubic meters. Convert between cubic meters, cubic feet, cubic yards, liters, and US gallons.",
        explanation: {
            heading: "How to Calculate Cubic Meters",
            paragraphs: [
                "Cubic meters = length (m) × width (m) × height (m). One cubic meter = 35.31 cubic feet = 1.31 cubic yards = 1,000 liters = 264.17 US gallons. It is the SI unit for volume.",
                "Common uses: shipping containers (a 20-ft container ≈ 33 m³), concrete orders in metric countries, pool volume, and room volume for HVAC calculations.",
            ],
            highlight: "A 3 × 2 × 1 m space = 6 m³ = 211.9 cu ft = 7.85 cu yd = 6,000 liters = 1,585 gallons.",
        },
        faq: [
            { question: "How do I convert cubic meters to cubic feet?", answer: "Multiply by 35.3147. For example, 2 m³ × 35.3147 = 70.63 cubic feet." },
            { question: "How many liters in a cubic meter?", answer: "1,000 liters. A cubic meter is the same as a 1,000-liter tank (1 kiloliter)." },
        ],
    },
    "cubic-yards-to-tons-calculator": {
        subtitle: "Convert cubic yards to tons for gravel, sand, soil, mulch, asphalt, and other bulk materials. Select material for accurate density.",
        explanation: {
            heading: "How to Convert Cubic Yards to Tons",
            paragraphs: [
                "Tons = cubic yards × material density (tons per cubic yard). Different materials have different densities: gravel ≈ 1.4 ton/yd³, sand ≈ 1.35, topsoil ≈ 1.1, mulch ≈ 0.4, concrete ≈ 2.0. Bulk materials are typically sold by the ton.",
                "When ordering, always round up and add 5–10% for waste and settling. Delivery trucks typically carry 10–15 cubic yards or 15–22 tons depending on the truck type.",
            ],
            highlight: "5 cubic yards of gravel: 5 × 1.4 = 7 tons = 14,000 lbs. Same volume of mulch: 5 × 0.4 = 2 tons.",
        },
        faq: [
            { question: "How many tons is 1 cubic yard of gravel?", answer: "Approximately 1.4 tons (2,800 lbs). Crushed stone is similar. Pea gravel is slightly less at 1.35 tons per cubic yard." },
            { question: "How many cubic yards in a ton?", answer: "Divide 1 by the material density. Gravel: 1 ÷ 1.4 = 0.71 cubic yards per ton. Topsoil: 1 ÷ 1.1 = 0.91 cubic yards per ton. Mulch: 1 ÷ 0.4 = 2.5 cubic yards per ton." },
        ],
    },
    "cylinder-cubic-footage-calculator": {
        subtitle: "Calculate the volume of a cylinder in cubic feet. Enter diameter and height for volume in cu ft, cubic yards, gallons, and liters.",
        explanation: {
            heading: "How to Calculate Cylinder Volume in Cubic Feet",
            paragraphs: [
                "Cylinder volume = π × r² × h, where r = radius (diameter ÷ 2) and h = height. All measurements must be in the same unit. The result is in cubic units of that measurement.",
                "Common cylindrical applications: round concrete piers, Sonotube forms, pipes, water tanks, silos, round pools, and cisterns.",
            ],
            highlight: "A 4-ft diameter × 6-ft tall cylinder: π × 2² × 6 = 75.40 cu ft = 2.79 cu yd = 564 gallons.",
        },
        faq: [
            { question: "How do I calculate concrete for a round footing?", answer: "Use the cylinder formula: π × (diameter/2)² × depth. For a 2-ft diameter × 4-ft deep pier: π × 1² × 4 = 12.57 cu ft = 0.47 cu yd. One 80-lb bag fills 0.6 cu ft, so you need 21 bags." },
            { question: "How many gallons does a cylindrical tank hold?", answer: "Calculate cubic feet (π × r² × h), then multiply by 7.48 gallons per cubic foot. A 3-ft diameter × 4-ft high tank: π × 1.5² × 4 = 28.27 cu ft × 7.48 = 211 gallons." },
        ],
    },
    "cylinder-cubic-yardage-calculator": {
        subtitle: "Calculate cylinder volume in cubic yards for concrete piers, Sonotube forms, and round footings. Enter diameter and depth in inches.",
        explanation: {
            heading: "Cylinder Cubic Yardage for Concrete",
            paragraphs: [
                "For concrete piers and round footings, enter the diameter and depth in inches. The calculator converts to cubic feet and cubic yards, and estimates the number of 80-lb bags of premix concrete needed.",
                "Standard Sonotube sizes: 8\", 10\", 12\", 14\", 16\", 18\", 20\", and 24\" diameter. A 12\" × 48\" tube holds about 3.14 cu ft = 0.12 cu yd and needs 5–6 bags of 80-lb concrete mix.",
            ],
            highlight: "A 12\" diameter × 48\" deep pier: 3.14 cu ft = 0.12 cu yd. Needs 6 bags of 80-lb concrete. Four such piers: 12.57 cu ft = 0.47 cu yd = 21 bags.",
        },
        faq: [
            { question: "How many bags of concrete for a Sonotube?", answer: "12\" × 48\" tube: 5–6 bags (80 lb). 12\" × 36\": 4 bags. 8\" × 42\": 2–3 bags. 18\" × 48\": 12–13 bags. Each 80-lb bag fills about 0.6 cu ft." },
            { question: "What size Sonotube do I need for a deck?", answer: "Most deck codes require 10–12\" diameter piers extending below the frost line (24–48\" in most areas). Check local building codes. For heavy loads (hot tubs, multi-story decks), 16–18\" piers may be required." },
        ],
    },
    "feet-and-inches-calculator": {
        subtitle: "Add, subtract, multiply, and divide feet, inches, and fractions. Get results in feet-inches, decimal feet, yards, meters, cm, and mm.",
        explanation: {
            heading: "Construction Math: Feet and Inches",
            paragraphs: [
                "Enter measurements with feet, whole inches, and fractional inches (1/16 to 15/16). Supports 4 operations: add, subtract, multiply, and divide. Results show grouped imperial (ft-in, total inches, decimal feet, yards) and metric (m, cm, mm).",
                "For fraction-to-decimal conversion, use our Inch Fraction Calculator. For area calculations with these measurements, see our Square Footage or Square Yards calculators.",
            ],
            highlight: "10' 6\" + 5' 3\" = 15' 9\" = 189 in = 15.75 ft = 5.25 yd = 4.801 m. With fractions: 10' 6 3/8\" + 5' 3 1/4\" = 15' 9.63\".",
        },
        contentHTML: `
<p><strong>Feet and inches math</strong> is essential for US construction, carpentry, and home improvement. This calculator handles <strong>addition, subtraction, multiplication, and division</strong> of measurements with fractional inches — the same fractions found on a <strong>tape measure</strong>.</p>
<p>Need to convert fractions? Use our <a href="/construction-calculators/inch-fraction-calculator">inch fraction calculator</a>. For area calculations, see our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a> or <a href="/construction-calculators/square-yards-calculator">square yards calculator</a>.</p>

<h2>How to Add Feet and Inches</h2>
<ol>
<li><strong>Convert fractional inches to decimals:</strong> 3/8" = 0.375", 1/2" = 0.5", etc.</li>
<li><strong>Add feet separately,</strong> add inches separately</li>
<li><strong>Carry over:</strong> if inches ≥ 12, subtract 12 and add 1 to feet</li>
</ol>
<p><strong>Example:</strong> 10' 6 3/8" + 5' 3 1/4" = 15' 9 5/8"</p>
<ul>
<li>Feet: 10 + 5 = 15</li>
<li>Inches: 6.375 + 3.25 = 9.625 = 9 5/8"</li>
<li>Result: <strong>15' 9 5/8"</strong></li>
</ul>

<h2>Common Fraction Addition Reference</h2>
<table>
<thead><tr><th>A</th><th>+ B</th><th>= Result</th></tr></thead>
<tbody>
<tr><td>1/8"</td><td>1/8"</td><td><strong>1/4"</strong></td></tr>
<tr><td>1/4"</td><td>1/4"</td><td><strong>1/2"</strong></td></tr>
<tr><td>3/8"</td><td>1/4"</td><td><strong>5/8"</strong></td></tr>
<tr><td>1/2"</td><td>1/4"</td><td><strong>3/4"</strong></td></tr>
<tr><td>1/2"</td><td>1/2"</td><td><strong>1"</strong></td></tr>
<tr><td>5/8"</td><td>3/8"</td><td><strong>1"</strong></td></tr>
<tr><td>3/4"</td><td>1/2"</td><td><strong>1 1/4"</strong></td></tr>
<tr><td>7/8"</td><td>5/8"</td><td><strong>1 1/2"</strong></td></tr>
</tbody>
</table>

<h2>How to Multiply and Divide</h2>
<p><strong>Multiply:</strong> Convert to decimal inches, multiply by the factor, convert back.</p>
<p>Example: 5' 6" × 3 = 66" × 3 = 198" = <strong>16' 6"</strong></p>
<p><strong>Divide:</strong> Convert to decimal inches, divide by the factor, convert back.</p>
<p>Example: 10' 0" ÷ 4 = 120" ÷ 4 = 30" = <strong>2' 6"</strong></p>

<h2>Feet and Inches to Metric</h2>
<table>
<thead><tr><th>Feet & Inches</th><th>Decimal Feet</th><th>Meters</th><th>Centimeters</th></tr></thead>
<tbody>
<tr><td><strong>1' 0"</strong></td><td>1.0</td><td>0.3048</td><td>30.48</td></tr>
<tr><td><strong>3' 0"</strong></td><td>3.0</td><td>0.9144</td><td>91.44</td></tr>
<tr><td><strong>5' 0"</strong></td><td>5.0</td><td>1.524</td><td>152.4</td></tr>
<tr><td><strong>5' 6"</strong></td><td>5.5</td><td>1.676</td><td>167.6</td></tr>
<tr><td><strong>6' 0"</strong></td><td>6.0</td><td>1.829</td><td>182.9</td></tr>
<tr><td><strong>8' 0"</strong></td><td>8.0</td><td>2.438</td><td>243.8</td></tr>
<tr><td><strong>10' 0"</strong></td><td>10.0</td><td>3.048</td><td>304.8</td></tr>
</tbody>
</table>

<h2>Common Length References</h2>
<table>
<thead><tr><th>Item</th><th>Typical Length</th></tr></thead>
<tbody>
<tr><td><strong>Standard door height</strong></td><td>6' 8" (80")</td></tr>
<tr><td><strong>Standard door width</strong></td><td>2' 8" or 3' 0"</td></tr>
<tr><td><strong>Ceiling height</strong></td><td>8' 0" or 9' 0"</td></tr>
<tr><td><strong>Wall stud</strong></td><td>92 5/8" (pre-cut for 8' walls)</td></tr>
<tr><td><strong>Sheet of plywood</strong></td><td>4' × 8' (48" × 96")</td></tr>
<tr><td><strong>Standard 2×4 lumber</strong></td><td>8', 10', 12', 16' lengths</td></tr>
<tr><td><strong>Countertop height</strong></td><td>3' 0" (36")</td></tr>
<tr><td><strong>Stair riser</strong></td><td>7" to 7 3/4"</td></tr>
</tbody>
</table>
<p>For area calculations with these measurements, try our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a> or <a href="/construction-calculators/square-meters-calculator">square meters calculator</a>.</p>
`,
        faq: [
            { question: "How do I convert feet and inches to decimal feet?", answer: "Divide inches by 12 and add to feet. Example: 10' 6\" = 10 + (6 ÷ 12) = 10.5 ft. For fractions: 8' 3 1/2\" = 8 + (3.5 ÷ 12) = 8.292 ft. For metric: multiply decimal feet by 0.3048 for meters." },
            { question: "How do I add feet and inches?", answer: "Add feet and inches separately, then carry over: 10' 9\" + 8' 7\" = 18' 16\". Since 16\" > 12\", subtract 12\" and add 1': result = 19' 4\". With fractions: add fractions with a common denominator, then carry if needed." },
            { question: "What are the symbols for feet and inches?", answer: "Feet: single prime (') or \"ft\" — e.g., 5' or 5 ft. Inches: double prime (\") or \"in\" — e.g., 3\" or 3 in. Combined: 5' 3\" or 5 ft 3 in. In construction plans, the foot mark is sometimes omitted: 5-3 means 5' 3\"." },
            { question: "Is 12 inches the same as 1 foot?", answer: "Yes, exactly. 12 inches = 1 foot. 36 inches = 3 feet = 1 yard. This is why when adding inches, you carry over at 12 — e.g., 15\" = 1' 3\". There are no fractions involved in the foot-to-inch relationship." },
            { question: "How do I convert feet to meters?", answer: "Multiply by 0.3048. Examples: 5' = 1.524 m. 6' = 1.829 m. 10' = 3.048 m. Reverse: multiply meters by 3.28084 for feet. 1 meter = 3' 3 3/8\" (approximately)." },
            { question: "How do I subtract feet and inches with fractions?", answer: "Convert everything to decimal inches, subtract, then convert back. Example: 10' 6 1/4\" − 3' 8 3/4\" = 126.25\" − 44.75\" = 81.5\" = 6' 9 1/2\". The calculator handles the borrowing automatically." },
            { question: "How do I divide a board into equal parts?", answer: "Use Divide mode. Enter the total length and the number of parts. Example: a 10' 6\" board ÷ 4 = 126\" ÷ 4 = 31.5\" = 2' 7 1/2\" per piece. Remember to account for kerf (saw blade width, typically 1/8\") for each cut." },
            { question: "What length are pre-cut wall studs?", answer: "92 5/8\" for 8-foot walls (allows for bottom plate + double top plate + 1/2\" drywall ceiling = 8' 0\" finished). For 9-foot walls: 104 5/8\". For 10-foot walls: 116 5/8\". Standard stud spacing is 16\" on center." },
            { question: "How many inches in a yard?", answer: "36 inches = 1 yard = 3 feet. So 1 yard = 3 feet = 36 inches. Conversely, divide inches by 36 for yards. A standard 8' board = 2.667 yards. A 10' board = 3.333 yards." },
            { question: "How do I convert a measurement from a tape measure?", answer: "Read the tape: whole inches + fraction (the smallest marks are 1/16\"). Example: 7 marks past 5\" = 5 7/16\". Enter as 0' 5\" with 7/16 fraction. For longer measurements: 6 marks past the 3-foot mark = 3' 6\". Use our inch fraction calculator for decimal conversion." },
        ],
    },
    "inch-fraction-calculator": {
        subtitle: "Convert decimal inches to fractions or fractions to decimal. Choose 1/8 to 1/64 precision. See mm, cm, and feet + inches equivalents.",
        explanation: {
            heading: "Decimal to Fraction Inch Conversion",
            paragraphs: [
                "Two modes: Decimal → Fraction (enter decimal inches, get nearest fraction at 1/8, 1/16, 1/32, or 1/64 precision) or Fraction → Decimal (enter whole inches + numerator/denominator, get decimal). Results include mm, cm, and feet + inches.",
                "Tape measures use fractions: 1/2\", 1/4\", 1/8\", 1/16\". This calculator converts between decimal and fractional inches for woodworking, construction, machining, and DIY projects.",
            ],
            highlight: "3.375\" = 3 3/8\" = 85.73 mm. At 1/16 precision: 3 6/16\" = 3 3/8\" (simplified). In Fraction → Decimal: 3 3/8\" = 3.375\".",
        },
        contentHTML: `
<p><strong>Inch fractions</strong> use denominators that are powers of 2: halves (1/2), quarters (1/4), eighths (1/8), sixteenths (1/16), thirty-seconds (1/32), and sixty-fourths (1/64). They're the standard on US <strong>tape measures, rulers, and construction plans</strong>. For math with fractional measurements, try our <a href="/construction-calculators/feet-and-inches-calculator">feet and inches calculator</a> or convert areas with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>How to Convert Decimal to Fraction</h2>
<ol>
<li><strong>Separate</strong> the whole number: 3.375 → whole = 3, decimal = 0.375</li>
<li><strong>Multiply</strong> decimal by your precision denominator: 0.375 × 16 = 6</li>
<li><strong>Place</strong> result over denominator: 6/16</li>
<li><strong>Simplify:</strong> 6/16 = 3/8 (divide both by GCD of 2)</li>
<li><strong>Result:</strong> 3 3/8"</li>
</ol>

<h2>Decimal to Inches Chart</h2>
<table>
<thead><tr><th>Fraction</th><th>Decimal</th><th>mm</th></tr></thead>
<tbody>
<tr><td><strong>1/16"</strong></td><td>0.0625</td><td>1.59</td></tr>
<tr><td><strong>1/8"</strong></td><td>0.125</td><td>3.18</td></tr>
<tr><td><strong>3/16"</strong></td><td>0.1875</td><td>4.76</td></tr>
<tr><td><strong>1/4"</strong></td><td>0.25</td><td>6.35</td></tr>
<tr><td><strong>5/16"</strong></td><td>0.3125</td><td>7.94</td></tr>
<tr><td><strong>3/8"</strong></td><td>0.375</td><td>9.53</td></tr>
<tr><td><strong>7/16"</strong></td><td>0.4375</td><td>11.11</td></tr>
<tr><td><strong>1/2"</strong></td><td>0.5</td><td>12.70</td></tr>
<tr><td><strong>9/16"</strong></td><td>0.5625</td><td>14.29</td></tr>
<tr><td><strong>5/8"</strong></td><td>0.625</td><td>15.88</td></tr>
<tr><td><strong>11/16"</strong></td><td>0.6875</td><td>17.46</td></tr>
<tr><td><strong>3/4"</strong></td><td>0.75</td><td>19.05</td></tr>
<tr><td><strong>13/16"</strong></td><td>0.8125</td><td>20.64</td></tr>
<tr><td><strong>7/8"</strong></td><td>0.875</td><td>22.23</td></tr>
<tr><td><strong>15/16"</strong></td><td>0.9375</td><td>23.81</td></tr>
<tr><td><strong>1"</strong></td><td>1.0</td><td>25.40</td></tr>
</tbody>
</table>

<h2>Inches to Metric Conversion</h2>
<p><strong>mm = inches × 25.4</strong> | <strong>cm = inches × 2.54</strong></p>
<ul>
<li>1/4" = 6.35 mm</li>
<li>1/2" = 12.70 mm</li>
<li>1" = 25.40 mm = 2.54 cm</li>
<li>6" = 152.40 mm = 15.24 cm</li>
<li>12" = 304.80 mm = 30.48 cm = 1 foot</li>
</ul>

<h2>Reading a Tape Measure</h2>
<p>Tape measure markings are different lengths to indicate fraction size:</p>
<ul>
<li><strong>Longest marks:</strong> whole inches (1", 2", 3"…)</li>
<li><strong>Next longest:</strong> 1/2" marks</li>
<li><strong>Medium marks:</strong> 1/4" marks</li>
<li><strong>Short marks:</strong> 1/8" marks</li>
<li><strong>Shortest marks:</strong> 1/16" marks</li>
</ul>
<p>Count the smallest marks past the last whole inch. If you count 7 marks of 1/16" size, the reading is 7/16".</p>
`,
        faq: [
            { question: "What fraction is 0.625 inches?", answer: "5/8 inch. Common decimals: 0.125 = 1/8, 0.25 = 1/4, 0.375 = 3/8, 0.5 = 1/2, 0.625 = 5/8, 0.75 = 3/4, 0.875 = 7/8. These are the 8 standard eighth-inch fractions." },
            { question: "How do I read a tape measure?", answer: "The longest marks are inches. Next longest = 1/2\". Then 1/4\" marks, 1/8\" marks, and the shortest marks are 1/16\". Count the smallest marks from the last whole inch. Example: 3 marks past the 5\" mark at 1/8\" size = 5 3/8\"." },
            { question: "What is an inch fraction?", answer: "A fraction of an inch where the denominator is a power of 2: 1/2, 1/4, 1/8, 1/16, 1/32, or 1/64. Examples: 3/8\", 5/16\", 7/32\". These are used because tape measures divide inches by repeatedly halving." },
            { question: "How do I convert a fraction to decimal?", answer: "Divide numerator by denominator. Examples: 3/8 = 0.375. 5/16 = 0.3125. 7/32 = 0.21875. For mixed numbers: add the whole number. 3 3/8\" = 3 + 0.375 = 3.375\"." },
            { question: "What is 3/16 of an inch in mm?", answer: "3/16\" = 0.1875\" × 25.4 = 4.76 mm. Quick references: 1/16\" = 1.59 mm, 1/8\" = 3.18 mm, 1/4\" = 6.35 mm, 3/8\" = 9.53 mm, 1/2\" = 12.70 mm." },
            { question: "Why does the US use inches?", answer: "The US inherited the imperial system from the British Empire. While the UK switched to metric in the 1960s–70s, the US retained inches for everyday use. Inches remain standard in US construction, manufacturing, and consumer products." },
            { question: "What is the symbol for inches?", answer: "The double prime symbol (″) or quotation marks (\"). Example: 5 inches = 5\" = 5 in. For feet and inches: 5'3\" (5 feet 3 inches). In technical drawings, \"in\" is also acceptable." },
            { question: "How big is one inch?", answer: "1 inch = 25.4 mm = 2.54 cm. Visual references: the diameter of a US quarter ($0.25 coin), the width of a standard paperclip, or roughly the length from the tip to the first joint of your thumb." },
            { question: "When should I use 1/32 or 1/64 precision?", answer: "1/32\" (0.03125\") for fine woodworking, detailed millwork, and precision carpentry. 1/64\" (0.015625\") for machining, metalwork, and engineering. Most construction uses 1/16\" precision. Tape measures typically go to 1/16\" or 1/32\"." },
            { question: "How do I add fractions of inches?", answer: "Find a common denominator, add numerators, then simplify. Example: 3/8\" + 5/16\" = 6/16 + 5/16 = 11/16\". For mixed numbers: 2 3/4\" + 1 5/8\" = 2 6/8 + 1 5/8 = 3 11/8 = 4 3/8\"." },
        ],
    },
    "scale-conversion-calculator": {
        subtitle: "Convert scale to actual size, actual to scale, or find the scale factor. 12 preset architectural, engineering, and model scales plus custom ratio.",
        explanation: {
            heading: "How to Use Scale Conversions",
            paragraphs: [
                "Three modes: Scale → Actual Size (measure a drawing, get real dimensions), Actual → Scale Size (know real size, find drawing measurement), Find Scale Factor (compare drawing to reality). 12 preset ratios from 1:12 to 1:600 plus custom.",
                "Architectural scale: multiply drawing inches by ratio to get actual inches, then ÷ 12 for feet. Example: 1/4\" = 1' (1:48) — a 6\" line on paper = 6 × 48 = 288\" = 24 feet.",
            ],
            highlight: "At 1/4\" = 1' scale (1:48): a 6\" drawing measurement = 24 feet actual. A 30-foot wall = 7.5\" on the blueprint.",
        },
        contentHTML: `
<p><strong>Scale conversion</strong> translates measurements between <strong>drawings, blueprints, models, and real-world dimensions</strong>. The calculator supports 3 modes and 12 preset scales used in US <strong>architecture, engineering, and model building</strong>. For converting the resulting dimensions, use our <a href="/construction-calculators/feet-and-inches-calculator">feet and inches calculator</a> or <a href="/construction-calculators/inch-fraction-calculator">inch fraction calculator</a>.</p>

<h2>Three Calculation Modes</h2>
<ul>
<li><strong>Scale → Actual Size:</strong> Enter the measurement from a drawing or model, select the scale ratio, and get the real-world dimension in inches, feet, and meters.</li>
<li><strong>Actual → Scale Size:</strong> Enter the real dimension, select scale ratio, and find the drawing/model measurement in inches.</li>
<li><strong>Find Scale Factor:</strong> Enter both the scale measurement and actual measurement to determine the scale ratio (1:X).</li>
</ul>

<h2>Architectural Scales</h2>
<p>Used on US residential and commercial blueprints. The fraction of an inch on the drawing equals one foot in reality.</p>
<table>
<thead><tr><th>Scale Notation</th><th>Ratio</th><th>1" on Drawing =</th><th>Common Use</th></tr></thead>
<tbody>
<tr><td><strong>1" = 1'</strong></td><td>1:12</td><td>1 foot</td><td>Detail drawings, millwork</td></tr>
<tr><td><strong>1/2" = 1'</strong></td><td>1:24</td><td>2 feet</td><td>Interior details, cabinets</td></tr>
<tr><td><strong>1/4" = 1'</strong></td><td>1:48</td><td>4 feet</td><td>Residential floor plans</td></tr>
<tr><td><strong>1/8" = 1'</strong></td><td>1:96</td><td>8 feet</td><td>Small residential, elevations</td></tr>
<tr><td><strong>1/16" = 1'</strong></td><td>1:192</td><td>16 feet</td><td>Site plans, large buildings</td></tr>
</tbody>
</table>

<h2>Engineering Scales</h2>
<p>Used on US civil and site engineering drawings. One inch on the drawing equals a specific number of feet.</p>
<table>
<thead><tr><th>Scale Notation</th><th>Ratio</th><th>1" on Drawing =</th><th>Common Use</th></tr></thead>
<tbody>
<tr><td><strong>1" = 10'</strong></td><td>1:120</td><td>10 feet</td><td>Plot plans, details</td></tr>
<tr><td><strong>1" = 20'</strong></td><td>1:240</td><td>20 feet</td><td>Site plans, grading</td></tr>
<tr><td><strong>1" = 30'</strong></td><td>1:360</td><td>30 feet</td><td>Road profiles</td></tr>
<tr><td><strong>1" = 40'</strong></td><td>1:480</td><td>40 feet</td><td>Subdivision plans</td></tr>
<tr><td><strong>1" = 50'</strong></td><td>1:600</td><td>50 feet</td><td>City planning, civil</td></tr>
</tbody>
</table>

<h2>Common Model Scales</h2>
<table>
<thead><tr><th>Scale</th><th>Ratio</th><th>1" Model =</th><th>Common Use</th></tr></thead>
<tbody>
<tr><td><strong>1:12</strong></td><td>1:12</td><td>1 foot</td><td>Dollhouses, large models</td></tr>
<tr><td><strong>1:18</strong></td><td>1:18</td><td>1.5 feet</td><td>Large diecast cars</td></tr>
<tr><td><strong>1:24</strong></td><td>1:24</td><td>2 feet</td><td>Model cars, aircraft</td></tr>
<tr><td><strong>1:43</strong></td><td>1:43</td><td>3.58 feet</td><td>O Gauge trains, diecast</td></tr>
<tr><td><strong>1:64</strong></td><td>1:64</td><td>5.33 feet</td><td>Hot Wheels, S Gauge</td></tr>
<tr><td><strong>1:87</strong></td><td>1:87</td><td>7.25 feet</td><td>HO Scale (most popular)</td></tr>
<tr><td><strong>1:160</strong></td><td>1:160</td><td>13.33 feet</td><td>N Scale trains</td></tr>
<tr><td><strong>1:220</strong></td><td>1:220</td><td>18.33 feet</td><td>Z Scale trains</td></tr>
</tbody>
</table>

<h2>How to Find the Scale Factor</h2>
<p><strong>Scale factor = actual size ÷ model size</strong></p>
<p>Measure both the model/drawing and the real object in the same unit. Divide actual by model. Example: a doorway is 80" tall in reality and 1.67" on the model. 80 ÷ 1.67 = <strong>1:48</strong> (which is 1/4" = 1' architectural scale).</p>
`,
        faq: [
            { question: "What does 1/4 inch scale mean?", answer: "1/4\" = 1' means every 1/4 inch on the drawing represents 1 foot in real life. The ratio is 1:48. A 2\" line on the blueprint = 8 feet actual. This is the most common residential architectural scale in the US." },
            { question: "How do I read a blueprint scale?", answer: "Use an architect's scale ruler, or measure with a regular ruler and multiply. At 1/4\" = 1' (1:48): multiply drawing inches by 48 for actual inches, or by 4 for actual feet. At 1/8\" = 1': multiply inches by 8 for feet." },
            { question: "Is the scale factor always greater than 1?", answer: "No. Scale factor > 1 means the model is smaller than reality (most models, blueprints). Scale factor < 1 means the model is larger than reality (microscope images, circuit board diagrams). Scale factor = 1 means full size (1:1)." },
            { question: "How do I calculate scale from a drawing?", answer: "Measure a known dimension on the drawing and compare to the real object. Scale factor = actual size ÷ drawing size. Example: a wall measures 3\" on the drawing and is 12 feet (144\") in reality. Scale = 144 ÷ 3 = 1:48." },
            { question: "What scale are Hot Wheels cars?", answer: "Hot Wheels are 1:64 scale. A real car ~16 feet long = 3\" Hot Wheels model. This is also the scale used for S Gauge model trains. Matchbox cars are also approximately 1:64." },
            { question: "What is HO Scale?", answer: "HO (Half O) scale is 1:87 — the most popular model railroad scale in the US. 1 inch represents 87 inches (7.25 feet). A 50-foot boxcar is about 6.9\" long in HO. Track gauge: 16.5mm. This scale offers a good balance of detail and space." },
            { question: "How do I convert architectural scale to engineering scale?", answer: "Architectural uses fractions (1/4\" = 1'). Engineering uses whole numbers (1\" = 20'). To convert: express both as 1:X ratios. 1/4\" = 1' → 1:48. 1\" = 20' → 1:240. Then compare or convert between them." },
            { question: "What scale should I use for a model?", answer: "Depends on space and detail: 1:12 for large display models. 1:24 or 1:43 for cars. 1:87 (HO) or 1:160 (N) for model railroads. 1:48 for military models and aircraft. Consider available display space — larger scales need more room." },
            { question: "How do I scale up a drawing?", answer: "Use Actual → Scale mode in reverse. If you have a 1:48 drawing and want it at 1:24 (twice as large), multiply all drawing dimensions by 2. To go from 1:48 to 1:12 (4× larger), multiply by 4. The multiplier is old ratio ÷ new ratio." },
            { question: "What is a scale factor of 1:1?", answer: "1:1 means full size — the drawing/model is the same size as the real object. This is used for full-size templates (e.g., bracket patterns, stencils), actual-size medical imaging, and some architectural detail drawings." },
        ],
    },
    "square-feet-to-cubic-feet-calculator": {
        subtitle: "Convert area in square feet to volume in cubic feet by adding depth. Calculate material volume for any coverage area.",
        explanation: {
            heading: "Square Feet to Cubic Feet",
            paragraphs: [
                "Cubic feet = square feet × depth (in feet). If depth is in inches, divide by 12 first. This conversion is essential for calculating how much material you need to cover an area at a given depth.",
                "Common applications: concrete slabs, gravel base layers, topsoil, mulch, and sand. For example, a 200 sq ft patio with 4\" of gravel base needs 200 × (4/12) = 66.7 cubic feet.",
            ],
            highlight: "200 sq ft × 4 inches deep: 200 × 0.333 = 66.7 cubic feet = 2.47 cubic yards.",
        },
        faq: [
            { question: "How do I convert square feet to cubic feet?", answer: "Multiply the area by the depth in feet. If depth is in inches, divide inches by 12 first. Example: 500 sq ft × 6 inches = 500 × 0.5 = 250 cubic feet." },
            { question: "How many cubic feet of mulch for my garden?", answer: "Mulch is typically applied 2–4 inches deep. 100 sq ft at 3\" deep = 100 × 0.25 = 25 cubic feet. One bag of mulch is typically 2 cubic feet, so you need about 13 bags." },
        ],
    },
    "square-feet-to-cubic-yards-calculator": {
        subtitle: "Convert square feet to cubic yards by adding depth. Select material type, set waste factor, and get weight and cost estimates for bulk orders.",
        explanation: {
            heading: "Square Feet to Cubic Yards",
            paragraphs: [
                "Cubic yards = (sq ft × depth in inches) ÷ 324. Select material (gravel, sand, topsoil, mulch, concrete, crushed stone, asphalt) for automatic weight. Set waste factor (0–25%) and cost per cu yd for total budget.",
                "1 cubic yard = 27 cu ft. At 4\" depth, 1 cu yd covers 81 sq ft. Results include cu ft, cu yd, liters, weight in tons, and total cost.",
            ],
            highlight: "500 sq ft at 4\" deep = 6.17 cu yd. With 10% waste: 6.79 cu yd of gravel = 9.5 tons ≈ $340 at $50/cu yd.",
        },
        contentHTML: `
<p><strong>Square feet</strong> measure area (2D), while <strong>cubic yards</strong> measure volume (3D). To convert between them, you need <strong>depth or thickness</strong>. This calculator handles the conversion and estimates <strong>material weight and cost</strong> for 7 bulk materials. Measure your area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a> or convert between <a href="/construction-calculators/square-feet-to-cubic-feet-calculator">square feet and cubic feet</a>.</p>

<h2>Square Feet to Cubic Yards Formula</h2>
<p><strong>cu yd = (sq ft × depth in inches) ÷ 324</strong></p>
<p>Or equivalently: cu yd = (sq ft × depth in feet) ÷ 27</p>
<p><strong>Step-by-step:</strong></p>
<ol>
<li><strong>Measure area</strong> in square feet (length × width)</li>
<li><strong>Choose depth</strong> in inches (e.g., 4" for gravel, 6" for concrete)</li>
<li><strong>Multiply:</strong> sq ft × depth (in) = cubic inches of coverage</li>
<li><strong>Divide by 324</strong> (= 27 × 12) to get cubic yards</li>
<li><strong>Add 10% waste</strong> for settling, spreading, and uneven surfaces</li>
</ol>

<h2>Coverage per Cubic Yard at Common Depths</h2>
<table>
<thead><tr><th>Depth</th><th>Sq Ft per Cu Yd</th><th>Cu Yd per 1,000 Sq Ft</th></tr></thead>
<tbody>
<tr><td><strong>1"</strong></td><td>324</td><td>3.09</td></tr>
<tr><td><strong>2"</strong></td><td>162</td><td>6.17</td></tr>
<tr><td><strong>3"</strong></td><td>108</td><td>9.26</td></tr>
<tr><td><strong>4"</strong></td><td>81</td><td>12.35</td></tr>
<tr><td><strong>6"</strong></td><td>54</td><td>18.52</td></tr>
<tr><td><strong>8"</strong></td><td>40.5</td><td>24.69</td></tr>
<tr><td><strong>12"</strong></td><td>27</td><td>37.04</td></tr>
</tbody>
</table>

<h2>Bulk Material Weight & Cost</h2>
<table>
<thead><tr><th>Material</th><th>Tons/Cu Yd</th><th>Typical Cost/Cu Yd</th><th>Typical Depth</th></tr></thead>
<tbody>
<tr><td><strong>Gravel</strong></td><td>1.4</td><td>$30–$65</td><td>2–4"</td></tr>
<tr><td><strong>Sand</strong></td><td>1.35</td><td>$25–$50</td><td>2–4"</td></tr>
<tr><td><strong>Topsoil</strong></td><td>1.08</td><td>$25–$55</td><td>4–6"</td></tr>
<tr><td><strong>Mulch (wood)</strong></td><td>0.4</td><td>$25–$45</td><td>2–3"</td></tr>
<tr><td><strong>Concrete</strong></td><td>2.0</td><td>$120–$180</td><td>4–6"</td></tr>
<tr><td><strong>Crushed stone</strong></td><td>1.3</td><td>$35–$60</td><td>2–4"</td></tr>
<tr><td><strong>Asphalt</strong></td><td>1.15</td><td>$100–$200</td><td>2–3"</td></tr>
</tbody>
</table>
<p><strong>Delivery note:</strong> Most suppliers require a minimum order (often 3–5 cu yd) and charge $50–$150 for delivery within 10–20 miles.</p>

<h2>Cubic Yards to Square Feet (Reverse)</h2>
<p><strong>sq ft = (cu yd × 324) ÷ depth (in)</strong></p>
<p>Use this to figure out how much area a given amount of material will cover. Example: 5 cu yd of mulch at 3" deep: (5 × 324) ÷ 3 = <strong>540 sq ft</strong>.</p>

<h2>How Much Concrete Do I Need?</h2>
<table>
<thead><tr><th>Area (sq ft)</th><th>4" Thick</th><th>6" Thick</th></tr></thead>
<tbody>
<tr><td><strong>100</strong></td><td>1.23 cu yd</td><td>1.85 cu yd</td></tr>
<tr><td><strong>200</strong></td><td>2.47 cu yd</td><td>3.70 cu yd</td></tr>
<tr><td><strong>500</strong></td><td>6.17 cu yd</td><td>9.26 cu yd</td></tr>
<tr><td><strong>1,000</strong></td><td>12.35 cu yd</td><td>18.52 cu yd</td></tr>
</tbody>
</table>
<p><strong>Standard residential slab:</strong> 4" thick. Driveways and garages: 6" thick. Always add 10% for waste.</p>
`,
        faq: [
            { question: "How many cubic yards do I need?", answer: "Multiply area (sq ft) × depth (in) ÷ 324. Example: 1,000 sq ft × 4\" ÷ 324 = 12.35 cu yd. Add 10% waste = 13.6 — order 14 cubic yards. Or use the shortcut: at 4\" depth, each 81 sq ft needs 1 cu yd." },
            { question: "How much area does 1 cubic yard cover?", answer: "At 1\" depth: 324 sq ft. At 2\": 162 sq ft. At 3\": 108 sq ft. At 4\": 81 sq ft. At 6\": 54 sq ft. At 12\": 27 sq ft. Remember: 1 cu yd = 27 cubic feet." },
            { question: "What is the difference between cubic yards and square yards?", answer: "Square yards measure area (2D): length × width. Cubic yards measure volume (3D): length × width × depth. You need a depth measurement to convert between them. 1 sq yd at 1 yd deep = 1 cu yd." },
            { question: "How many square feet does a cubic yard of concrete cover?", answer: "At 4\" thick: 81 sq ft. At 6\" thick: 54 sq ft. Standard sidewalks: 4\" thick. Driveways: 6\" thick. For a 10×20 ft driveway (200 sq ft) at 6\": 200 ÷ 54 = 3.7 cu yd — order 4 cu yd with waste." },
            { question: "How do I convert cubic yards to tons?", answer: "Multiply cu yd × material density: gravel = 1.4 tons/cu yd, sand = 1.35, topsoil = 1.08, mulch = 0.4, concrete = 2.0, crushed stone = 1.3. Example: 10 cu yd of gravel = 14 tons." },
            { question: "How much does a cubic yard of gravel cost?", answer: "Gravel: $30–$65/cu yd depending on type. Pea gravel: $30–$45. Crushed stone: $35–$60. River rock: $45–$65. Add $50–$150 for delivery. A 500 sq ft driveway at 4\" deep needs about 7 cu yd = $210–$455 + delivery." },
            { question: "How much mulch do I need?", answer: "Apply mulch 2–3\" deep. At 3\" depth, 1 cu yd covers 108 sq ft. A 500 sq ft garden bed: 500 ÷ 108 = 4.6 cu yd + 10% waste = 5.1 — order 5 cu yd. At $30/cu yd: $150 for materials." },
            { question: "What depth of gravel do I need for a driveway?", answer: "Minimum 4\" for a residential gravel driveway, ideally in 3 layers: 4\" of large crushed stone base, 2\" of mid-size stone, and 2\" of fine surface gravel. Total: ~8\" or about 25 cu yd per 1,000 sq ft." },
            { question: "How many bags of concrete equal 1 cubic yard?", answer: "About 45 bags of 80 lb concrete mix = 1 cu yd. Or 60 bags of 60 lb mix. For more than 1-2 cu yd, ordering ready-mix concrete from a truck is more cost-effective and provides better quality ($120–$180/cu yd delivered)." },
            { question: "Should I order extra material?", answer: "Always add 10% waste for flat surfaces (gravel, sand, mulch). Add 15% for uneven terrain or areas with drainage. For concrete, add 10% for formwork waste. Having leftover is better than running short mid-pour — a short concrete pour creates a weak joint." },
        ],
    },
    "square-inches-calculator": {
        subtitle: "Calculate area in square inches for rectangles, circles, and triangles. Enter in inches, cm, mm, or feet. Convert to sq ft, cm², mm², and m².",
        explanation: {
            heading: "How to Calculate Square Inches",
            paragraphs: [
                "Square inches = length (in) × width (in). Select shape (rectangle, circle, triangle) and input unit (inches, cm, mm, feet). 144 sq in = 1 sq ft. Results show imperial (sq in, sq ft) and metric (cm², mm², m²).",
                "Square inches are used for smaller areas: tiles, screens, paper, cross-sections, gaskets, and crafts. 1 sq in = 6.4516 cm² = 645.16 mm².",
            ],
            highlight: "12 × 8 inches = 96 sq in = 0.667 sq ft = 619.4 cm². Circle with 6\" radius: 113.1 sq in.",
        },
        contentHTML: `
<p><strong>Square inches (sq in or in²)</strong> measure small areas in the US customary system. They're used for <strong>tiles, screens, paper, fabric swatches, gaskets, pipe cross-sections, and craft projects</strong>. For larger areas, use our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a> or <a href="/construction-calculators/square-yards-calculator">square yards calculator</a>.</p>
<p>The calculator above supports <strong>3 shapes</strong> (rectangle, circle, triangle), accepts <strong>4 input units</strong> (inches, cm, mm, feet), and converts to <strong>both imperial and metric</strong> area units. Pair it with our <a href="/construction-calculators/inch-fraction-calculator">inch fraction calculator</a> for tape-measure conversions.</p>

<h2>Square Inches Formulas</h2>
<table>
<thead><tr><th>Shape</th><th>Formula</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Rectangle</strong></td><td>L × W</td><td>12 × 8 = 96 sq in</td></tr>
<tr><td><strong>Circle</strong></td><td>π × r²</td><td>r = 6" → π × 36 = 113.1 sq in</td></tr>
<tr><td><strong>Triangle</strong></td><td>½ × base × height</td><td>10 × 8 ÷ 2 = 40 sq in</td></tr>
</tbody>
</table>
<p><strong>All dimensions must be in inches.</strong> The calculator converts from cm, mm, or feet automatically.</p>

<h2>Square Inches to Square Feet</h2>
<p><strong>Square feet = square inches ÷ 144</strong></p>
<p>Since 1 foot = 12 inches, 1 sq ft = 12 × 12 = 144 sq in.</p>
<p><strong>Quick conversions:</strong></p>
<ul>
<li>72 sq in = <strong>0.5 sq ft</strong></li>
<li>144 sq in = <strong>1 sq ft</strong></li>
<li>288 sq in = <strong>2 sq ft</strong></li>
<li>432 sq in = <strong>3 sq ft</strong></li>
<li>1,008 sq in = <strong>7 sq ft</strong></li>
</ul>

<h2>Common Object Sizes in Square Inches</h2>
<table>
<thead><tr><th>Object</th><th>Dimensions</th><th>Square Inches</th><th>Square Feet</th></tr></thead>
<tbody>
<tr><td><strong>Credit card</strong></td><td>3.37 × 2.13"</td><td>7.2</td><td>0.05</td></tr>
<tr><td><strong>Index card</strong></td><td>3 × 5"</td><td>15</td><td>0.10</td></tr>
<tr><td><strong>Letter paper</strong></td><td>8.5 × 11"</td><td>93.5</td><td>0.65</td></tr>
<tr><td><strong>Legal paper</strong></td><td>8.5 × 14"</td><td>119</td><td>0.83</td></tr>
<tr><td><strong>12 × 12" tile</strong></td><td>12 × 12"</td><td>144</td><td>1.00</td></tr>
<tr><td><strong>Pizza (14" dia)</strong></td><td>r = 7"</td><td>154</td><td>1.07</td></tr>
<tr><td><strong>Poster (18 × 24")</strong></td><td>18 × 24"</td><td>432</td><td>3.00</td></tr>
</tbody>
</table>

<h2>Screen Sizes in Square Inches</h2>
<table>
<thead><tr><th>Screen</th><th>Diagonal</th><th>Approx Area (sq in)</th></tr></thead>
<tbody>
<tr><td><strong>iPhone 15</strong></td><td>6.1"</td><td>~16</td></tr>
<tr><td><strong>iPad (10.9")</strong></td><td>10.9"</td><td>~64</td></tr>
<tr><td><strong>Laptop (15.6")</strong></td><td>15.6"</td><td>~92</td></tr>
<tr><td><strong>Monitor (24")</strong></td><td>24"</td><td>~219</td></tr>
<tr><td><strong>Monitor (27")</strong></td><td>27"</td><td>~277</td></tr>
<tr><td><strong>TV (55")</strong></td><td>55"</td><td>~1,150</td></tr>
<tr><td><strong>TV (65")</strong></td><td>65"</td><td>~1,606</td></tr>
</tbody>
</table>

<h2>Area Conversion Reference</h2>
<table>
<thead><tr><th>Unit</th><th>To sq in</th><th>To sq ft</th><th>To cm²</th></tr></thead>
<tbody>
<tr><td><strong>1 sq in</strong></td><td>1</td><td>0.00694</td><td>6.4516</td></tr>
<tr><td><strong>1 sq ft</strong></td><td>144</td><td>1</td><td>929.03</td></tr>
<tr><td><strong>1 cm²</strong></td><td>0.155</td><td>0.00108</td><td>1</td></tr>
<tr><td><strong>1 mm²</strong></td><td>0.00155</td><td>0.0000108</td><td>0.01</td></tr>
<tr><td><strong>1 m²</strong></td><td>1,550</td><td>10.764</td><td>10,000</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "How many square inches in a square foot?", answer: "144 square inches = 1 square foot (12\" × 12\" = 144 sq in). To convert sq in to sq ft: divide by 144. To convert sq ft to sq in: multiply by 144. Example: 288 sq in ÷ 144 = 2 sq ft." },
            { question: "How do I convert square inches to square centimeters?", answer: "Multiply by 6.4516. Example: 96 sq in × 6.4516 = 619.4 cm². Reverse: divide cm² by 6.4516. Since 1 inch = 2.54 cm, the area factor is 2.54² = 6.4516." },
            { question: "How many square inches is a sheet of paper?", answer: "Letter size (8.5 × 11\"): 93.5 sq in. Legal size (8.5 × 14\"): 119 sq in. Tabloid (11 × 17\"): 187 sq in. A4 (8.27 × 11.69\"): 96.7 sq in. A4 is slightly taller and narrower than US Letter." },
            { question: "How do I calculate square inches of a circle?", answer: "Area = π × r². Measure the diameter and divide by 2 to get the radius. Example: 12\" diameter circle: r = 6\", area = π × 36 = 113.1 sq in. A 14\" pizza: r = 7\", area = π × 49 = 153.9 sq in." },
            { question: "What is measured in square inches?", answer: "Small areas: screen displays, paper/cardboard, fabric swatches, tiles, gaskets, pipe cross-sections, decals, stickers, labels, and craft materials. Larger areas use sq ft or sq yd instead." },
            { question: "How many square inches in a 12×12 tile?", answer: "12 × 12 = 144 sq in = exactly 1 sq ft. This is why 12×12 tiles are so popular — each tile covers exactly one square foot, making quantity calculations easy: just count the sq ft of floor space." },
            { question: "How do I calculate the cross-section area of a pipe?", answer: "Use the circle formula: area = π × r². For a 2\" inner diameter pipe: r = 1\", area = π × 1 = 3.14 sq in. For a 4\" pipe: r = 2\", area = π × 4 = 12.57 sq in. This is the flow area for fluid calculations." },
            { question: "How do I convert square inches to square meters?", answer: "Multiply by 0.00064516. Example: 1,000 sq in × 0.00064516 = 0.645 m². Reverse: multiply m² by 1,550 to get sq in. This conversion is useful for international specifications." },
            { question: "What is the area of a TV screen in square inches?", answer: "TV screens are measured diagonally. For a 16:9 TV, viewable area ≈ diagonal² × 0.38. A 55\" TV: 55² × 0.38 ≈ 1,149 sq in (7.98 sq ft). A 65\" TV: 65² × 0.38 ≈ 1,606 sq in (11.15 sq ft)." },
            { question: "How do I measure irregular shapes in square inches?", answer: "Break the shape into rectangles, triangles, and circles. Calculate each area separately and add them together. For truly irregular shapes, trace onto graph paper and count the squares (each 1\" square = 1 sq in). Digital tools can measure from photos." },
        ],
    },
    "square-meters-calculator": {
        subtitle: "Calculate area in square meters for rectangles, circles, and triangles. Enter in meters, cm, feet, or inches. Add cost per m² for material estimates.",
        explanation: {
            heading: "How to Calculate Square Meters",
            paragraphs: [
                "Square meters = length (m) × width (m). Select shape (rectangle, circle, triangle), enter in meters, cm, feet, or inches. Add cost per m² for flooring, tiling, or painting budgets.",
                "1 m² = 10.764 sq ft = 1.196 sq yd. Results show metric (m², cm², hectares) and imperial (sq ft, sq yd, acres) conversions plus total cost.",
            ],
            highlight: "5 × 4 m room = 20 m² = 215.28 sq ft. At $50/m²: $1,000 total. Circle with 3 m radius: 28.27 m².",
        },
        contentHTML: `
<p><strong>Square meters (m²)</strong> is the SI unit of area, used worldwide for <strong>real estate, construction, flooring, landscaping, and international trade</strong>. In the US, square meters are increasingly used alongside square feet for global comparisons and scientific applications. Convert to US units with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a> or <a href="/construction-calculators/square-yards-calculator">square yards calculator</a>.</p>
<p>The calculator above supports <strong>3 shapes</strong> (rectangle, circle, triangle), accepts <strong>4 input units</strong> (meters, cm, feet, inches), and includes <strong>cost estimation per m²</strong>. For length conversions, try our <a href="/construction-calculators/feet-and-inches-calculator">feet and inches calculator</a>.</p>

<h2>Square Meter Formulas</h2>
<table>
<thead><tr><th>Shape</th><th>Formula</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Rectangle</strong></td><td>L × W</td><td>5 m × 4 m = 20 m²</td></tr>
<tr><td><strong>Circle</strong></td><td>π × r²</td><td>r = 3 m → π × 9 = 28.27 m²</td></tr>
<tr><td><strong>Triangle</strong></td><td>½ × base × height</td><td>6 m × 4 m ÷ 2 = 12 m²</td></tr>
</tbody>
</table>

<h2>How to Convert Square Feet to Square Meters</h2>
<p><strong>Square meters = square feet × 0.0929</strong></p>
<p><strong>Square feet = square meters × 10.764</strong></p>
<p><strong>Examples:</strong></p>
<ul>
<li>100 sq ft = <strong>9.29 m²</strong></li>
<li>200 sq ft = <strong>18.58 m²</strong></li>
<li>500 sq ft = <strong>46.45 m²</strong></li>
<li>1,000 sq ft = <strong>92.90 m²</strong></li>
<li>2,000 sq ft = <strong>185.81 m²</strong></li>
</ul>

<h2>Area Conversion Reference</h2>
<table>
<thead><tr><th>Unit</th><th>To m²</th><th>To sq ft</th><th>To sq yd</th></tr></thead>
<tbody>
<tr><td><strong>1 m²</strong></td><td>1</td><td>10.764</td><td>1.196</td></tr>
<tr><td><strong>1 sq ft</strong></td><td>0.0929</td><td>1</td><td>0.1111</td></tr>
<tr><td><strong>1 sq yd</strong></td><td>0.8361</td><td>9</td><td>1</td></tr>
<tr><td><strong>1 sq cm</strong></td><td>0.0001</td><td>0.00108</td><td>0.00012</td></tr>
<tr><td><strong>1 hectare</strong></td><td>10,000</td><td>107,639</td><td>11,960</td></tr>
<tr><td><strong>1 acre</strong></td><td>4,047</td><td>43,560</td><td>4,840</td></tr>
</tbody>
</table>

<h2>Real-World Size References</h2>
<table>
<thead><tr><th>Item / Space</th><th>Approx m²</th><th>Approx sq ft</th></tr></thead>
<tbody>
<tr><td><strong>1 square meter</strong></td><td>1.0</td><td>10.8</td></tr>
<tr><td><strong>King-size bed</strong></td><td>3.7</td><td>40</td></tr>
<tr><td><strong>Parking space</strong></td><td>12.5</td><td>135</td></tr>
<tr><td><strong>Single-car garage</strong></td><td>18.6</td><td>200</td></tr>
<tr><td><strong>Studio apartment</strong></td><td>35–50</td><td>375–540</td></tr>
<tr><td><strong>Tennis court</strong></td><td>261</td><td>2,808</td></tr>
<tr><td><strong>Basketball court</strong></td><td>420</td><td>4,520</td></tr>
<tr><td><strong>Olympic pool</strong></td><td>1,250</td><td>13,455</td></tr>
<tr><td><strong>1 acre</strong></td><td>4,047</td><td>43,560</td></tr>
<tr><td><strong>Football field</strong></td><td>5,351</td><td>57,600</td></tr>
</tbody>
</table>

<h2>Measuring Oddly Shaped Rooms</h2>
<p>For L-shaped, T-shaped, or irregular rooms: <strong>divide the space into rectangles</strong>, calculate each area in m², and add them together. Example: an L-shaped room = rectangle A (3 × 5 = 15 m²) + rectangle B (2 × 3 = 6 m²) = <strong>21 m² total</strong>.</p>
`,
        faq: [
            { question: "How do I convert square meters to square feet?", answer: "Multiply by 10.764. Example: 20 m² × 10.764 = 215.28 sq ft. To convert sq ft to m²: multiply sq ft by 0.0929. A 1,500 sq ft home = 139.35 m²." },
            { question: "How big is 100 square meters?", answer: "About 1,076 sq ft — a 10 × 10 meter area (roughly 33 × 33 ft). It's about the size of a small apartment, a large studio, or 4 parking spaces. In real estate, 100 m² is a common benchmark for apartments worldwide." },
            { question: "Are square meters and meters the same?", answer: "No. Meters measure length (one dimension). Square meters measure area (two dimensions). A room 5 m long and 4 m wide has dimensions of 5 m × 4 m but an area of 20 m². You can't directly convert between them without knowing both dimensions." },
            { question: "What does 1 square meter look like?", answer: "A square that is 1 meter (3.28 ft) on each side — roughly 3 ft 3 in × 3 ft 3 in. About the size of a large TV screen, a small desk, or the floor space under a dining chair. A guitar is about 1 m long, so picture a square framed by guitars." },
            { question: "How many square meters is a 10x10 room?", answer: "If measured in meters: 10 × 10 = 100 m². If measured in feet: 10 × 10 ft = 100 sq ft = 9.29 m². Always specify whether dimensions are in meters or feet — the difference is more than 10×." },
            { question: "What does per square meter mean?", answer: "A unit price for area-based products or services. If flooring costs $50/m² and your room is 20 m², total cost = $50 × 20 = $1,000. Compare: $50/m² = $4.65/sq ft = $41.80/sq yd. Always confirm whether quotes include installation." },
            { question: "How do I measure a room in square meters?", answer: "Measure length and width in meters (or feet, then convert). Multiply length × width. For cm measurements: multiply, then divide by 10,000 to get m². For oddly shaped rooms, divide into rectangles, calculate each, and add together." },
            { question: "How many square meters is a typical US house?", answer: "Average US home: ~200 m² (2,150 sq ft). Small home: 90–120 m² (1,000–1,300 sq ft). Medium: 150–230 m² (1,600–2,500 sq ft). Large: 280–465 m² (3,000–5,000 sq ft). US homes are 2–3× larger than European averages." },
            { question: "When do you use square meters in the US?", answer: "Square meters are used in US science, engineering, international real estate, trade, and government. Real estate listings often include both sq ft and m² for international buyers. Construction specs for government projects often use metric. Flooring imported from Europe is priced per m²." },
            { question: "How do I convert square centimeters to square meters?", answer: "Divide by 10,000. Example: 50,000 cm² ÷ 10,000 = 5 m². This is because 1 m = 100 cm, so 1 m² = 100 × 100 = 10,000 cm². Common mistake: dividing by 100 instead of 10,000 (that converts linear cm to m, not area)." },
        ],
    },
    "square-yards-calculator": {
        subtitle: "Calculate square yards for rectangles, circles, and triangles. Enter in feet, inches, yards, or meters. Add cost per sq yd and waste factor for material estimates.",
        explanation: {
            heading: "How to Calculate Square Yards",
            paragraphs: [
                "Square yards = (length ft × width ft) ÷ 9. Select shape (rectangle, circle, triangle), enter dimensions in feet/inches/yards/meters. Add cost per sq yd and waste factor (0–30%) for accurate material budgets.",
                "1 sq yd = 9 sq ft = 0.836 m². Used for carpet, flooring, fabric, sod, and landscaping. Results include sq yd, sq ft, m², and total cost with waste.",
            ],
            highlight: "12 × 10 ft room = 120 sq ft = 13.33 sq yd. At $25/sq yd + 10% waste: 14.67 sq yd × $25 = $367 total.",
        },
        contentHTML: `
<p><strong>Square yards</strong> measure area and are commonly used in the US for <strong>carpet, flooring, fabric, sod, and landscaping</strong>. One square yard equals a 3-foot × 3-foot area (9 square feet). See also our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>, <a href="/construction-calculators/square-meters-calculator">square meters calculator</a>, and <a href="/construction-calculators/square-inches-calculator">square inches calculator</a>.</p>
<p>The calculator above supports <strong>3 shapes</strong> (rectangle, circle, triangle), accepts <strong>4 input units</strong> (feet, inches, yards, meters), and includes <strong>cost estimation with waste factor</strong>. For volume calculations, try our <a href="/construction-calculators/square-feet-to-cubic-yards-calculator">square feet to cubic yards calculator</a>.</p>

<h2>Square Yardage Formulas</h2>
<table>
<thead><tr><th>Shape</th><th>Formula (ft)</th><th>To Sq Yd</th></tr></thead>
<tbody>
<tr><td><strong>Rectangle</strong></td><td>L × W</td><td>÷ 9</td></tr>
<tr><td><strong>Circle</strong></td><td>π × r²</td><td>÷ 9</td></tr>
<tr><td><strong>Triangle</strong></td><td>½ × base × height</td><td>÷ 9</td></tr>
</tbody>
</table>
<p><strong>All measurements must be in the same unit.</strong> The calculator converts automatically. To convert manually: divide sq ft by 9 to get sq yd.</p>

<h2>How to Convert Square Feet to Square Yards</h2>
<p><strong>Square yards = square feet ÷ 9</strong></p>
<p>This is the most common conversion. Since 1 yard = 3 feet, the area conversion factor is 3² = 9.</p>
<p><strong>Examples:</strong></p>
<ul>
<li>100 sq ft ÷ 9 = <strong>11.11 sq yd</strong></li>
<li>144 sq ft (12×12 room) ÷ 9 = <strong>16 sq yd</strong></li>
<li>200 sq ft ÷ 9 = <strong>22.22 sq yd</strong></li>
<li>500 sq ft ÷ 9 = <strong>55.56 sq yd</strong></li>
<li>1,000 sq ft ÷ 9 = <strong>111.11 sq yd</strong></li>
</ul>

<h2>Carpet & Flooring Cost per Square Yard</h2>
<table>
<thead><tr><th>Material</th><th>Cost/sq yd (installed)</th><th>Cost for 200 sq ft room</th></tr></thead>
<tbody>
<tr><td><strong>Builder-grade carpet</strong></td><td>$15–$25</td><td>$333–$556</td></tr>
<tr><td><strong>Mid-range carpet</strong></td><td>$25–$45</td><td>$556–$1,000</td></tr>
<tr><td><strong>Premium carpet</strong></td><td>$45–$80</td><td>$1,000–$1,778</td></tr>
<tr><td><strong>Indoor/outdoor carpet</strong></td><td>$10–$20</td><td>$222–$444</td></tr>
<tr><td><strong>Carpet padding</strong></td><td>$3–$8</td><td>$67–$178</td></tr>
</tbody>
</table>
<p><strong>Add 10–15% waste</strong> for seams, pattern matching, and closets. Stairways require additional yardage — typically 1 sq yd per 3 steps.</p>

<h2>Area Conversion Reference</h2>
<table>
<thead><tr><th>From</th><th>To Sq Yards</th><th>To Sq Feet</th><th>To Sq Meters</th></tr></thead>
<tbody>
<tr><td><strong>1 sq yd</strong></td><td>1</td><td>9</td><td>0.8361</td></tr>
<tr><td><strong>1 sq ft</strong></td><td>0.1111</td><td>1</td><td>0.0929</td></tr>
<tr><td><strong>1 sq m</strong></td><td>1.196</td><td>10.764</td><td>1</td></tr>
<tr><td><strong>1 sq in</strong></td><td>0.000772</td><td>0.00694</td><td>0.000645</td></tr>
<tr><td><strong>1 acre</strong></td><td>4,840</td><td>43,560</td><td>4,047</td></tr>
</tbody>
</table>

<h2>Common Room Sizes</h2>
<table>
<thead><tr><th>Room</th><th>Typical Size</th><th>Sq Ft</th><th>Sq Yd</th></tr></thead>
<tbody>
<tr><td><strong>Bedroom</strong></td><td>10 × 12 ft</td><td>120</td><td>13.3</td></tr>
<tr><td><strong>Living Room</strong></td><td>15 × 20 ft</td><td>300</td><td>33.3</td></tr>
<tr><td><strong>Master Bedroom</strong></td><td>14 × 16 ft</td><td>224</td><td>24.9</td></tr>
<tr><td><strong>Office</strong></td><td>10 × 10 ft</td><td>100</td><td>11.1</td></tr>
<tr><td><strong>Hallway</strong></td><td>3 × 20 ft</td><td>60</td><td>6.7</td></tr>
<tr><td><strong>Stairway (13 steps)</strong></td><td>—</td><td>~36</td><td>~4.0</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "How many square feet in a square yard?", answer: "9 square feet = 1 square yard (3 ft × 3 ft = 9 sq ft). To convert sq ft to sq yd, divide by 9. To convert sq yd to sq ft, multiply by 9. Example: 200 sq ft ÷ 9 = 22.22 sq yd." },
            { question: "Why is carpet sold in square yards?", answer: "Carpet rolls are manufactured in standard widths of 12 feet (4 yards) or 15 feet (5 yards). Square yards became the standard pricing unit because it aligns with these widths. Some retailers now list per sq ft pricing, but multiply by 9 to compare with sq yd prices." },
            { question: "How many square yards is 12 feet by 12 feet?", answer: "12 × 12 = 144 sq ft ÷ 9 = 16 square yards. This is a common room size. At $25/sq yd installed, carpet would cost about $400 (plus 10% waste = $440)." },
            { question: "How much carpet do I need with waste?", answer: "Calculate room area in sq yd, then add 10–15% for waste. A 12 × 15 ft room: 180 sq ft ÷ 9 = 20 sq yd. With 10% waste: 20 × 1.10 = 22 sq yd to order. Pattern carpets may need 15–20% extra for matching." },
            { question: "What is the difference between square meters and square yards?", answer: "1 sq m = 1.196 sq yd (square meters are ~20% smaller). 1 sq yd = 0.836 sq m. The US uses sq yd for carpet/flooring; most other countries use sq m. Multiply sq m by 1.196 to convert to sq yd." },
            { question: "How do I calculate square yards for a circular area?", answer: "Area = π × r² (in sq ft) ÷ 9. Example: 10 ft radius circle: π × 10² = 314.16 sq ft ÷ 9 = 34.9 sq yd. For the diameter, divide by 2 first. This is useful for round rugs, gazebos, and garden beds." },
            { question: "How much does carpet installation cost?", answer: "Builder-grade: $15–$25/sq yd installed. Mid-range: $25–$45/sq yd. Premium/luxury: $45–$80/sq yd. Typical 200 sq ft bedroom (22.2 sq yd): $550–$1,000 for mid-range carpet + pad + installation. Removal of old carpet: add $1–$2/sq yd." },
            { question: "How do I measure a room for carpet?", answer: "Measure length and width at the widest points, including closets and alcoves. Round up to the nearest half-foot. For L-shaped rooms, break into two rectangles and add. Always include doorways (carpet extends to the center of the doorway). Add 10% waste." },
            { question: "What is measured in square yards?", answer: "Carpet, area rugs, sod/turf, fabric/textiles, concrete work, and roofing are commonly measured in sq yd in the US. Land is measured in acres (1 acre = 4,840 sq yd). Construction materials are often priced per sq yd." },
            { question: "How many square yards of sod do I need?", answer: "Measure lawn area in sq ft, divide by 9. A 50 × 30 ft lawn: 1,500 sq ft ÷ 9 = 167 sq yd. Add 5–10% for cutting waste. Sod costs $2–$8/sq yd ($0.22–$0.89/sq ft) depending on grass type. Bermuda: $2–$4/sq yd. Zoysia: $4–$8/sq yd." },
        ],
    },
    "tank-volume-calculator": {
        subtitle: "Calculate tank volume for 6 shapes: rectangular, horizontal/vertical cylinder, oval, capsule, sphere. Add fill level and liquid type for filled volume and weight.",
        explanation: {
            heading: "How to Calculate Tank Volume",
            paragraphs: [
                "Select tank shape, enter dimensions in inches, set fill level (0–100%), and choose liquid type. Formulas: rectangular (L×W×H), cylinder (πr²L), oval (πabL), capsule (πr²L + ⁴⁄₃πr³), sphere (⁴⁄₃πr³).",
                "Results include total capacity and filled volume in gallons and liters, plus liquid weight for water, diesel, gasoline, propane, and heating oil.",
            ],
            highlight: "24\" diameter × 72\" horizontal cylinder: 32,572 cu in = 141 gal. At 75% fill with water: 105.8 gal = 882 lbs.",
        },
        contentHTML: `
<p><strong>Tank volume</strong> is the total internal capacity of a storage tank. Knowing exact volume is essential for <strong>ordering fuel, sizing pumps, calculating chemical dosages, estimating fill time, and determining structural loads</strong>.</p>
<p>The calculator above supports <strong>6 tank shapes</strong>, calculates <strong>filled volume at any fill level</strong>, and estimates <strong>liquid weight</strong> for 5 common liquids.</p>
<p>Convert volume with our <a href="/construction-calculators/cubic-feet-calculator">cubic feet calculator</a>. For pipes, see our <a href="/construction-calculators/pipe-volume-calculator">pipe volume calculator</a>. Calculate fill time with our <a href="/construction-calculators/flow-rate-calculator">flow rate calculator</a>.</p>

<h2>Tank Volume Formulas</h2>
<table>
<thead><tr><th>Shape</th><th>Formula</th><th>Variables</th></tr></thead>
<tbody>
<tr><td><strong>Rectangular</strong></td><td>V = L × W × H</td><td>L = length, W = width, H = height</td></tr>
<tr><td><strong>Cylinder (H)</strong></td><td>V = π × r² × L</td><td>r = diameter ÷ 2, L = length</td></tr>
<tr><td><strong>Cylinder (V)</strong></td><td>V = π × r² × H</td><td>r = diameter ÷ 2, H = height</td></tr>
<tr><td><strong>Oval</strong></td><td>V = π × a × b × L</td><td>a = width ÷ 2, b = height ÷ 2, L = length</td></tr>
<tr><td><strong>Capsule</strong></td><td>V = πr²L + ⁴⁄₃πr³</td><td>r = diameter ÷ 2, L = cylinder length</td></tr>
<tr><td><strong>Sphere</strong></td><td>V = ⁴⁄₃πr³</td><td>r = diameter ÷ 2</td></tr>
</tbody>
</table>
<p><strong>All formulas give volume in cubic inches.</strong> Divide by 231 for US gallons, or multiply by 0.016387 for liters.</p>

<h2>Common Propane Tank Sizes</h2>
<table>
<thead><tr><th>Tank Size</th><th>Capacity</th><th>Dimensions (approx)</th><th>Weight (full)</th></tr></thead>
<tbody>
<tr><td><strong>20 lb (BBQ)</strong></td><td>4.6 gal</td><td>12" dia × 18" tall</td><td>38 lbs</td></tr>
<tr><td><strong>30 lb</strong></td><td>7.0 gal</td><td>12" dia × 24" tall</td><td>55 lbs</td></tr>
<tr><td><strong>40 lb</strong></td><td>9.4 gal</td><td>12" dia × 29" tall</td><td>72 lbs</td></tr>
<tr><td><strong>100 lb</strong></td><td>23.6 gal</td><td>15" dia × 48" tall</td><td>170 lbs</td></tr>
<tr><td><strong>120 gal</strong></td><td>96 gal (80% fill)</td><td>30" dia × 52" long</td><td>500 lbs</td></tr>
<tr><td><strong>250 gal</strong></td><td>200 gal (80% fill)</td><td>30" dia × 92" long</td><td>960 lbs</td></tr>
<tr><td><strong>500 gal</strong></td><td>400 gal (80% fill)</td><td>37" dia × 120" long</td><td>1,900 lbs</td></tr>
<tr><td><strong>1,000 gal</strong></td><td>800 gal (80% fill)</td><td>41" dia × 192" long</td><td>3,700 lbs</td></tr>
</tbody>
</table>
<p><strong>Propane tanks are filled to 80% capacity</strong> to allow for thermal expansion. The "gallon" rating is total tank capacity, not usable propane.</p>

<h2>Common Tank Dimensions</h2>
<table>
<thead><tr><th>Tank Type</th><th>Dimensions</th><th>Capacity</th></tr></thead>
<tbody>
<tr><td><strong>55-gallon drum</strong></td><td>23" dia × 34" tall</td><td>55 gal</td></tr>
<tr><td><strong>275-gal oil tank</strong></td><td>27" × 44" × 60"</td><td>275 gal</td></tr>
<tr><td><strong>330-gal IBC tote</strong></td><td>48" × 40" × 46"</td><td>330 gal</td></tr>
<tr><td><strong>Water heater (40 gal)</strong></td><td>18" dia × 60" tall</td><td>40 gal</td></tr>
<tr><td><strong>Water heater (50 gal)</strong></td><td>20" dia × 60" tall</td><td>50 gal</td></tr>
<tr><td><strong>Septic tank (1,000 gal)</strong></td><td>60" × 60" × 96"</td><td>~1,000 gal</td></tr>
</tbody>
</table>

<h2>Liquid Weight Reference</h2>
<table>
<thead><tr><th>Liquid</th><th>lbs/gallon</th><th>Weight of 100 gal</th></tr></thead>
<tbody>
<tr><td><strong>Water</strong></td><td>8.34</td><td>834 lbs</td></tr>
<tr><td><strong>Diesel fuel</strong></td><td>7.1</td><td>710 lbs</td></tr>
<tr><td><strong>Gasoline</strong></td><td>6.3</td><td>630 lbs</td></tr>
<tr><td><strong>Heating oil</strong></td><td>7.2</td><td>720 lbs</td></tr>
<tr><td><strong>Propane (liquid)</strong></td><td>4.2</td><td>420 lbs</td></tr>
</tbody>
</table>
<p><strong>Structural note:</strong> A 1,000-gallon water tank weighs over 8,300 lbs when full. Always verify floor/foundation capacity before placing large tanks indoors.</p>
`,
        faq: [
            { question: "How many gallons in my tank?", answer: "Measure inside dimensions in inches. Rectangular: (L × W × H) ÷ 231. Cylinder: (π × r² × L) ÷ 231. Example: 24\" dia × 72\" cylinder: π × 12² × 72 ÷ 231 = 141 gallons. For oval tanks: (π × a × b × L) ÷ 231." },
            { question: "How do I calculate a partially filled tank?", answer: "For vertical tanks: total volume × (fill height ÷ total height). For horizontal cylinders, the calculation is more complex — use the calculator's fill level slider for accurate results. Propane tanks are typically filled to 80% for thermal expansion safety." },
            { question: "How much does a full water tank weigh?", answer: "Water weighs 8.34 lbs/gallon. A 55-gallon drum: 459 lbs water + 23 lbs drum = ~482 lbs total. A 275-gallon oil tank with water: 2,294 lbs. A 1,000-gallon tank: 8,340 lbs of water alone. Always check floor load capacity." },
            { question: "What size propane tank do I need?", answer: "BBQ grill: 20 lb (4.6 gal). Fireplace/space heater: 100 lb (23.6 gal). Whole-house heating: 500 gal (400 usable at 80% fill) for moderate use, 1,000 gal for cold climates or large homes. Tanks are refilled at 20–30% remaining." },
            { question: "How do I measure tank dimensions?", answer: "Measure inside dimensions (not outside) in inches for accuracy. For cylinders, measure the inside diameter. For rectangular tanks, measure inside length, width, and height. If you can only measure outside, subtract twice the wall thickness (typically 0.1\"–0.25\" for steel)." },
            { question: "What is the difference between US and Imperial gallons?", answer: "1 US gallon = 231 cubic inches = 3.785 liters. 1 Imperial gallon = 277.42 cubic inches = 4.546 liters. Imperial gallons are 20% larger. The US uses US gallons exclusively. The calculator outputs US gallons." },
            { question: "How fast will my tank fill?", answer: "Fill time = tank volume (gal) ÷ flow rate (GPM). A 275-gallon oil tank at 5 GPM: 275 ÷ 5 = 55 minutes. A 1,000-gallon water tank at 10 GPM: 100 minutes. Add 10% for hose friction and elevation." },
            { question: "How do I convert cubic inches to gallons?", answer: "Divide cubic inches by 231 for US gallons. Example: 32,572 cu in ÷ 231 = 141 gallons. For liters: multiply cubic inches by 0.016387. For cubic feet: divide cubic inches by 1,728." },
            { question: "What is a capsule tank?", answer: "A capsule (also called stadium or oblong) tank is a cylinder with hemispherical ends. Volume = cylinder portion (πr²L) + sphere portion (⁴⁄₃πr³). Common for pressurized tanks (propane, compressed gas) because the curved ends distribute pressure evenly." },
            { question: "How much does heating oil weigh?", answer: "Heating oil (No. 2 fuel oil) weighs 7.2 lbs/gallon. A full 275-gallon oil tank contains 275 × 7.2 = 1,980 lbs of oil, plus the tank itself (~250 lbs for steel). Total: ~2,230 lbs. This is important for floor/basement support calculations." },
        ],
    },
    "cfm-calculator": {
        subtitle: "Calculate CFM airflow for ventilation. Select room type for auto ACH, add occupant-based ASHRAE minimum, and get duct size recommendation.",
        explanation: {
            heading: "How to Calculate CFM",
            paragraphs: [
                "CFM = (Room Volume × ACH) ÷ 60. Select room type to auto-set air changes per hour, or enter custom ACH. ASHRAE minimum: 15 CFM per occupant or 0.35 ACH, whichever is greater.",
                "Results include recommended CFM (higher of ACH-based and ASHRAE), metric L/s conversion, CFM/sq ft, and duct diameter sized for 900 FPM velocity.",
            ],
            highlight: "12 × 10 × 8 ft living room, 6 ACH, 2 occupants: ACH-based = 96 CFM, ASHRAE min = 30 CFM → recommended 96 CFM. Min duct: 5\" round.",
        },
        contentHTML: `
<p><strong>CFM (cubic feet per minute)</strong> measures the volume of air flowing through a space or duct. It's the primary metric for sizing <strong>exhaust fans, range hoods, HVAC systems, air purifiers, and ventilation equipment</strong>.</p>
<p>The calculator above includes <strong>9 room type presets</strong> with auto-set ACH, <strong>ASHRAE occupant-based ventilation</strong>, <strong>L/s metric conversion</strong>, and <strong>duct diameter recommendation</strong>.</p>
<p>Size your furnace with our <a href="/construction-calculators/furnace-btu-calculator">furnace BTU calculator</a>. For cooling, see our <a href="/construction-calculators/window-ac-size-calculator">window AC size calculator</a>. Measure room area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>CFM Formula</h2>
<p><strong>CFM = (Length × Width × Height × ACH) ÷ 60</strong></p>
<p>Where L, W, H are room dimensions in feet, and ACH = air changes per hour.</p>

<h3>Step 1: Measure the Room</h3>
<p>Measure length, width, and ceiling height in feet. For irregular rooms, break into rectangles and add areas.</p>

<h3>Step 2: Calculate Volume</h3>
<p>Volume (cu ft) = L × W × H. Example: 12 × 10 × 8 = <strong>960 cu ft</strong>.</p>

<h3>Step 3: Determine ACH</h3>
<p>Air changes per hour depend on room type and use. Higher ACH = more air replacement per hour = better air quality.</p>

<h3>Step 4: Calculate CFM</h3>
<p>CFM = (960 × 6) ÷ 60 = <strong>96 CFM</strong> for a living room at 6 ACH.</p>

<h2>Air Changes per Hour by Room Type</h2>
<table>
<thead><tr><th>Room Type</th><th>Recommended ACH</th><th>CFM for 120 sq ft (8 ft ceiling)</th></tr></thead>
<tbody>
<tr><td><strong>Bedroom</strong></td><td>4</td><td>64 CFM</td></tr>
<tr><td><strong>Living Room</strong></td><td>6</td><td>96 CFM</td></tr>
<tr><td><strong>Office / Study</strong></td><td>6</td><td>96 CFM</td></tr>
<tr><td><strong>Kitchen</strong></td><td>8</td><td>128 CFM</td></tr>
<tr><td><strong>Bathroom</strong></td><td>10</td><td>160 CFM</td></tr>
<tr><td><strong>Laundry Room</strong></td><td>10</td><td>160 CFM</td></tr>
<tr><td><strong>Garage / Workshop</strong></td><td>12</td><td>192 CFM</td></tr>
<tr><td><strong>Restaurant Kitchen</strong></td><td>15–20</td><td>240–320 CFM</td></tr>
<tr><td><strong>Server Room</strong></td><td>15–20</td><td>240–320 CFM</td></tr>
</tbody>
</table>

<h2>Residential Ventilation Requirements</h2>
<table>
<thead><tr><th>Space</th><th>Minimum CFM</th><th>Code Reference</th></tr></thead>
<tbody>
<tr><td><strong>Bathroom (≤100 sq ft)</strong></td><td>50 CFM continuous or 1 CFM/sq ft</td><td>IRC M1507</td></tr>
<tr><td><strong>Bathroom (>100 sq ft)</strong></td><td>1 CFM/sq ft + 50 per fixture</td><td>IRC M1507</td></tr>
<tr><td><strong>Kitchen (range hood)</strong></td><td>100 CFM/ft of range</td><td>IMC Table 403</td></tr>
<tr><td><strong>Kitchen (downdraft)</strong></td><td>300–600 CFM</td><td>Manufacturer spec</td></tr>
<tr><td><strong>Utility/Laundry</strong></td><td>50 CFM continuous</td><td>IRC M1507</td></tr>
<tr><td><strong>Whole-house</strong></td><td>0.35 ACH or 15 CFM/person</td><td>ASHRAE 62.2</td></tr>
<tr><td><strong>Garage (attached)</strong></td><td>100 CFM continuous</td><td>IRC M1505</td></tr>
<tr><td><strong>Crawl space</strong></td><td>1 CFM/150 sq ft</td><td>IRC R408</td></tr>
</tbody>
</table>

<h2>Range Hood Sizing</h2>
<ul>
<li><strong>Wall-mounted:</strong> 100 CFM per linear foot of range. 30" range = 250 CFM min.</li>
<li><strong>Island hoods:</strong> 150 CFM per linear foot. 36" island range = 450 CFM min.</li>
<li><strong>Professional ranges (>60K BTU):</strong> 1 CFM per 100 BTU. 90K BTU range = 900 CFM.</li>
<li><strong>Makeup air:</strong> Hoods >400 CFM require makeup air per IRC M1503.6.</li>
</ul>

<h2>Bathroom Fan Sizing</h2>
<ul>
<li><strong>Small bathroom (≤100 sq ft):</strong> 1 CFM per sq ft, minimum 50 CFM.</li>
<li><strong>Large bathroom (>100 sq ft):</strong> Add 50 CFM per toilet, shower, bathtub, and jetted tub.</li>
<li><strong>Sone rating:</strong> ≤1.0 sone = very quiet, 1.0–2.0 = quiet, >3.0 = noticeable noise.</li>
</ul>
`,
        faq: [
            { question: "How many CFM do I need for a bathroom fan?", answer: "1 CFM per square foot, minimum 50 CFM. A 80 sq ft bathroom needs 80 CFM. For bathrooms over 100 sq ft: add 50 CFM for each toilet, shower, and bathtub. Example: 150 sq ft bathroom with toilet + shower + bathtub = 150 + 50 + 50 + 50 = 300 CFM." },
            { question: "What size exhaust fan for my kitchen?", answer: "Wall-mounted: 100 CFM per linear foot of range (30\" = 250 CFM, 36\" = 300 CFM). Island: 150 CFM/ft (36\" = 450 CFM). Professional ranges: 1 CFM per 100 BTU input (60K BTU = 600 CFM). Hoods over 400 CFM require makeup air per IRC M1503.6." },
            { question: "What is ACH (air changes per hour)?", answer: "ACH is the number of times the entire air volume in a room is replaced per hour. 6 ACH means the air is completely replaced 6 times per hour. Higher ACH = better air quality but more energy to heat/cool the incoming air. Residential: 4–8 ACH. Commercial kitchens: 15–20 ACH." },
            { question: "What is the ASHRAE ventilation standard?", answer: "ASHRAE 62.2 requires minimum 0.35 ACH or 15 CFM per person in residential homes, whichever is greater. For a 2,000 sq ft home with 8 ft ceilings and 4 occupants: 0.35 ACH = 93 CFM; 15 × 4 = 60 CFM → use 93 CFM minimum. This is for whole-house ventilation." },
            { question: "How do I size ductwork for CFM?", answer: "Target 600–900 FPM velocity in main ducts, 400–600 FPM in branch ducts. Duct area (sq in) = CFM ÷ FPM × 144. Example: 100 CFM at 900 FPM: area = 16 sq in → 5\" round duct (19.6 sq in). Common sizes: 4\" (25 CFM), 6\" (100 CFM), 8\" (200 CFM), 10\" (350 CFM)." },
            { question: "What is CFM per square foot?", answer: "A quick rule of thumb: 1 CFM per square foot is the minimum for bathrooms and kitchens. For living spaces, 0.5–1.0 CFM/sq ft is typical. For commercial spaces, 1.5–2.0 CFM/sq ft. The exact amount depends on ceiling height, ACH requirement, and occupancy." },
            { question: "How many CFM for a whole-house fan?", answer: "2–4 CFM per square foot of living space. A 2,000 sq ft home: 4,000–8,000 CFM. Whole-house fans work by pulling cool outdoor air through open windows and exhausting hot attic air. They can reduce AC usage by 50–90% on mild days." },
            { question: "Do I need makeup air for my range hood?", answer: "Yes, if your range hood exceeds 400 CFM (per IRC M1503.6 and most local codes). Makeup air replaces the air exhausted by the hood to prevent negative pressure, backdrafting of gas appliances, and CO infiltration. Makeup air systems typically cost $500–$2,000 to install." },
            { question: "How do I convert CFM to liters per second?", answer: "Multiply CFM by 0.4719. Example: 100 CFM × 0.4719 = 47.19 L/s. Reverse: L/s × 2.119 = CFM. Metric systems (Canada, Europe, Australia) typically specify airflow in L/s rather than CFM." },
            { question: "Why is my HVAC airflow low?", answer: "Common causes: dirty air filter (replace every 1–3 months), blocked/closed registers, kinked flex duct, undersized ductwork, failing blower motor, frozen evaporator coil, or dirty coils. Low airflow reduces comfort and efficiency. Target 400 CFM per ton of cooling capacity." },
        ],
    },
    "flow-rate-calculator": {
        subtitle: "Calculate water flow rate two ways: pipe velocity × area or volume ÷ time. Standard US pipe sizes, GPM, GPH, liters/min, CFS, and daily usage estimate.",
        explanation: {
            heading: "How to Calculate Flow Rate",
            paragraphs: [
                "Two methods: Q = A × v (pipe area × velocity) for known pipe diameter and velocity, or Q = V / t (volume ÷ time) for bucket-test measurement. The calculator uses actual copper IDs for 8 standard US pipe sizes.",
                "Results in GPM, GPH, liters/min, and CFS. Daily usage estimate based on hours of operation. Recommended velocities: 4–8 ft/s supply lines, 2–4 ft/s drain lines.",
            ],
            highlight: "1\" copper (1.049\" ID) at 5 ft/s: Q = 0.0060 ft² × 5 = 0.030 CFS = 13.5 GPM. Bucket test: 5 gal in 1 min = 5.0 GPM.",
        },
        contentHTML: `
<p><strong>Flow rate</strong> is the volume of fluid passing through a pipe per unit of time. It's the most fundamental measurement in plumbing design — every pipe size, pump selection, and fixture specification depends on it.</p>
<p>The calculator above supports <strong>two calculation methods</strong>: engineering formula (pipe area × velocity) with 8 standard pipe sizes, and practical measurement (volume ÷ time for bucket tests). Both output in <strong>GPM, GPH, liters/min, and CFS</strong>.</p>
<p>Calculate pipe volume with our <a href="/construction-calculators/pipe-volume-calculator">pipe volume calculator</a>. For tanks, see our <a href="/construction-calculators/tank-volume-calculator">tank volume calculator</a>. Check flow speed with our <a href="/construction-calculators/water-velocity-calculator">water velocity calculator</a>.</p>

<h2>Flow Rate Formula: Q = A × v</h2>
<p>The volumetric flow rate equals the <strong>pipe cross-sectional area multiplied by fluid velocity</strong>:</p>
<p><strong>Q = A × v</strong> — where Q = flow rate, A = pipe area, v = velocity</p>
<p>For a round pipe: <strong>A = π × (D/2)²</strong></p>
<p><strong>Example:</strong> 1" copper pipe (1.049" ID) at 5 ft/s:</p>
<ul>
<li>A = π × (1.049 ÷ 24)² = π × 0.001907 = <strong>0.005993 sq ft</strong></li>
<li>Q = 0.005993 × 5 = <strong>0.02997 CFS</strong></li>
<li>GPM = 0.02997 × 448.831 = <strong>13.45 GPM</strong></li>
</ul>

<h2>Alternate Formula: Q = V / t</h2>
<p>The <strong>bucket test</strong> is the easiest way to measure actual flow rate at a fixture:</p>
<p><strong>Q = V / t</strong> — where V = volume collected, t = time</p>
<p><strong>Example:</strong> Fill a 5-gallon bucket from your garden hose: takes 3 minutes → Q = 5 ÷ 3 = <strong>1.67 GPM</strong>.</p>

<h2>Fixture Flow Rate Standards (US)</h2>
<table>
<thead><tr><th>Fixture</th><th>Standard GPM</th><th>WaterSense GPM</th><th>Federal Max</th></tr></thead>
<tbody>
<tr><td><strong>Kitchen faucet</strong></td><td>2.2</td><td>1.5</td><td>2.2 GPM</td></tr>
<tr><td><strong>Bathroom faucet</strong></td><td>1.5</td><td>1.0</td><td>2.2 GPM</td></tr>
<tr><td><strong>Showerhead</strong></td><td>2.5</td><td>2.0</td><td>2.5 GPM</td></tr>
<tr><td><strong>Toilet (per flush)</strong></td><td>1.6 GPF</td><td>1.28 GPF</td><td>1.6 GPF</td></tr>
<tr><td><strong>Dishwasher</strong></td><td>2.0–3.0</td><td>—</td><td>—</td></tr>
<tr><td><strong>Washing machine</strong></td><td>3.0–5.0</td><td>—</td><td>—</td></tr>
<tr><td><strong>Garden hose (½")</strong></td><td>5.0–10.0</td><td>—</td><td>—</td></tr>
<tr><td><strong>Irrigation sprinkler</strong></td><td>2.0–4.0</td><td>—</td><td>—</td></tr>
<tr><td><strong>Bathtub filler</strong></td><td>4.0–6.0</td><td>—</td><td>—</td></tr>
<tr><td><strong>Hose bibb (¾")</strong></td><td>8.0–15.0</td><td>—</td><td>—</td></tr>
</tbody>
</table>
<p><strong>GPF = gallons per flush.</strong> WaterSense is the EPA's voluntary program for water-efficient products. Federal maximums are set by the Energy Policy Act.</p>

<h2>Flow Rate by Pipe Size (at 5 ft/s)</h2>
<table>
<thead><tr><th>Pipe (Copper ID)</th><th>Area (sq in)</th><th>GPM at 5 ft/s</th><th>GPH</th></tr></thead>
<tbody>
<tr><td><strong>½" (0.622")</strong></td><td>0.304</td><td>4.6</td><td>274</td></tr>
<tr><td><strong>¾" (0.824")</strong></td><td>0.533</td><td>8.0</td><td>481</td></tr>
<tr><td><strong>1" (1.049")</strong></td><td>0.864</td><td>13.5</td><td>808</td></tr>
<tr><td><strong>1¼" (1.368")</strong></td><td>1.470</td><td>22.9</td><td>1,374</td></tr>
<tr><td><strong>1½" (1.610")</strong></td><td>2.036</td><td>31.7</td><td>1,903</td></tr>
<tr><td><strong>2" (2.067")</strong></td><td>3.356</td><td>52.3</td><td>3,138</td></tr>
<tr><td><strong>3" (3.068")</strong></td><td>7.393</td><td>115.2</td><td>6,912</td></tr>
<tr><td><strong>4" (4.026")</strong></td><td>12.730</td><td>198.3</td><td>11,900</td></tr>
</tbody>
</table>
<p><strong>5 ft/s is the recommended maximum for residential supply lines.</strong> Higher velocities increase noise and water hammer risk.</p>

<h2>Unit Conversions</h2>
<ul>
<li><strong>1 CFS = 448.831 GPM</strong> = 7.481 gal/sec</li>
<li><strong>1 GPM = 3.785 liters/min</strong> = 0.0631 liters/sec</li>
<li><strong>1 GPM = 0.00223 CFS</strong></li>
<li><strong>1 liter/sec = 15.85 GPM</strong></li>
</ul>
`,
        faq: [
            { question: "What is a normal water flow rate for a house?", answer: "Typical whole-house flow: 6–12 GPM simultaneously. Individual fixtures: shower 2.0–2.5 GPM, kitchen faucet 1.5–2.2 GPM, toilet 1.6 GPF, garden hose 5–10 GPM. Total peak demand depends on how many fixtures run at once. Size your main line for peak demand." },
            { question: "How do I increase water flow rate?", answer: "Increase pipe diameter (largest effect — doubling diameter quadruples flow capacity). Reduce pipe length and number of fittings. Increase water pressure. Remove restrictions (corroded pipes, clogged aerators, partially closed valves). Replace ½\" supply branches with ¾\" pipe." },
            { question: "How do I measure flow rate at home?", answer: "Bucket test: place a bucket under the faucet/hose, open fully, time how long to fill a known volume. Q = volume ÷ time. Example: 5-gallon bucket fills in 2 minutes = 2.5 GPM. For more precision, use a flow meter (available for $20–$50 at hardware stores)." },
            { question: "What is the difference between GPM and CFS?", answer: "GPM (gallons per minute) is used for residential plumbing and fixtures. CFS (cubic feet per second) is used in engineering and larger systems. 1 CFS = 448.831 GPM. Most plumbers work in GPM; civil engineers use CFS for storm drains, rivers, and municipal systems." },
            { question: "How does pipe diameter affect flow rate?", answer: "Flow capacity is proportional to diameter squared (area). Doubling diameter = 4× the area = 4× the flow at the same velocity. Going from ½\" to ¾\" copper increases flow capacity by 75% at the same velocity. This is why upsizing pipes is the most effective way to increase flow." },
            { question: "What is the maximum flow rate for ¾\" pipe?", answer: "At 5 ft/s (recommended residential max): ¾\" copper = 8.0 GPM. At 8 ft/s (absolute max): 12.8 GPM. For WaterSense fixtures (lower flow), a ¾\" main can supply 2–3 fixtures simultaneously. For larger homes, use 1\" or 1¼\" main." },
            { question: "What flow rate do I need for a shower?", answer: "Standard showerhead: 2.5 GPM (federal max). WaterSense showerhead: 2.0 GPM. Rainfall/body spray systems: 5–8 GPM total. For a ½\" supply line at 5 ft/s, max flow is 4.6 GPM — sufficient for one standard shower. Two simultaneous showers need a ¾\" supply." },
            { question: "How do I calculate flow rate from pressure?", answer: "Use the Bernoulli equation or manufacturer's pressure/flow curves. As a rough guide: flow increases with the square root of pressure. Doubling pressure increases flow by ~41%. Most residential systems operate at 40–80 PSI. A pressure-reducing valve (PRV) limits flow to protect fixtures." },
            { question: "What is the WaterSense standard?", answer: "WaterSense is an EPA voluntary program for water-efficient products. WaterSense faucets: ≤1.5 GPM (vs 2.2 standard). WaterSense showerheads: ≤2.0 GPM (vs 2.5). WaterSense toilets: ≤1.28 GPF (vs 1.6). WaterSense-labeled products use at least 20% less water." },
            { question: "Why is my water flow rate low?", answer: "Common causes: partially closed main valve, clogged aerators, corroded/restricted pipes (especially galvanized), high demand (too many fixtures at once), low municipal pressure, undersized pipes (½\" mains), failing pressure regulator, or water heater restriction. Start by checking aerators and valves." },
        ],
    },
    "furnace-btu-calculator": {
        subtitle: "Calculate furnace BTU for your home. Adjust for climate zone, insulation, ceiling height, AFUE efficiency, and fuel type. See estimated annual heating cost.",
        explanation: {
            heading: "How to Size a Furnace",
            paragraphs: [
                "BTU = sq ft × climate factor (25–60 BTU/ft²) × insulation adjustment × ceiling height factor. The calculator adjusts for AFUE efficiency (80–98%) and estimates annual fuel cost based on fuel type and local rates.",
                "Fuel options: natural gas ($1.20/therm), propane ($2.80/gal), heating oil ($3.50/gal), electric ($0.16/kWh). Higher AFUE = less fuel for the same heat output.",
            ],
            highlight: "1,500 sq ft, moderate climate, average insulation, 95% AFUE gas: 52,500 BTU output → 55,263 BTU furnace input. Est. annual cost: ~$630.",
        },
        contentHTML: `
<p>A furnace's BTU (British Thermal Unit) rating determines <strong>how much heat it can produce per hour</strong>. Choosing the right size is critical — <strong>too small</strong> and your home stays cold on the worst days; <strong>too large</strong> and the furnace short-cycles, wasting fuel and wearing out faster.</p>
<p>The calculator above uses <strong>climate zone BTU factors</strong>, adjusts for <strong>insulation, ceiling height, and AFUE efficiency</strong>, and estimates <strong>annual heating cost</strong> across 4 fuel types (gas, propane, oil, electric).</p>
<p>Calculate airflow with our <a href="/construction-calculators/cfm-calculator">CFM calculator</a>. For cooling, see our <a href="/construction-calculators/window-ac-size-calculator">window AC size calculator</a>. Measure room area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>BTU per Square Foot by Climate Zone</h2>
<p>The DOE and HVAC industry recommend different BTU/sq ft based on your heating climate:</p>
<table>
<thead><tr><th>Climate Zone</th><th>BTU/sq ft</th><th>States</th></tr></thead>
<tbody>
<tr><td><strong>Mild</strong></td><td>25–30</td><td>FL, TX, AZ, GA, LA, SC, MS, AL, NM</td></tr>
<tr><td><strong>Moderate</strong></td><td>30–40</td><td>NC, VA, TN, KY, MO, KS, OK, AR, DE, MD</td></tr>
<tr><td><strong>Cold</strong></td><td>40–50</td><td>NY, PA, OH, MI, IL, IN, NJ, CT, MA, WI, IA</td></tr>
<tr><td><strong>Very Cold</strong></td><td>50–60</td><td>MN, ND, SD, MT, WY, VT, NH, ME, AK</td></tr>
<tr><td><strong>Subarctic</strong></td><td>60+</td><td>Interior AK, mountain regions</td></tr>
</tbody>
</table>
<p><strong>Example:</strong> 2,000 sq ft home in cold climate: 2,000 × 45 = <strong>90,000 BTU output needed</strong>.</p>

<h2>Insulation Adjustment</h2>
<table>
<thead><tr><th>Insulation</th><th>Adjustment</th><th>Description</th></tr></thead>
<tbody>
<tr><td><strong>Poor</strong></td><td>+30%</td><td>Old home, single-pane windows, no wall insulation, drafty</td></tr>
<tr><td><strong>Average</strong></td><td>Baseline</td><td>Standard double-pane, R-19 attic, some wall insulation</td></tr>
<tr><td><strong>Good</strong></td><td>−15%</td><td>Updated insulation, tight envelope, energy-efficient windows</td></tr>
<tr><td><strong>Excellent</strong></td><td>−30%</td><td>New construction, spray foam, triple-pane, air-sealed</td></tr>
</tbody>
</table>
<p><strong>An energy audit ($200–$500)</strong> can identify where your home loses heat most. Adding attic insulation is often the highest-ROI upgrade.</p>

<h2>AFUE Efficiency Explained</h2>
<p><strong>AFUE (Annual Fuel Utilization Efficiency)</strong> is the percentage of fuel converted to heat. The rest goes up the flue.</p>
<table>
<thead><tr><th>AFUE</th><th>Type</th><th>Heat from 100K BTU Input</th><th>Avg Cost</th></tr></thead>
<tbody>
<tr><td><strong>80%</strong></td><td>Standard</td><td>80,000 BTU</td><td>$1,500–$3,000</td></tr>
<tr><td><strong>90%</strong></td><td>Mid-Efficiency</td><td>90,000 BTU</td><td>$2,500–$4,000</td></tr>
<tr><td><strong>95%</strong></td><td>High-Efficiency</td><td>95,000 BTU</td><td>$3,000–$5,000</td></tr>
<tr><td><strong>98%</strong></td><td>Condensing</td><td>98,000 BTU</td><td>$4,000–$6,500</td></tr>
</tbody>
</table>
<p><strong>In cold climates, a 95%+ AFUE furnace pays for itself</strong> in 3–5 years through fuel savings. In mild climates, an 80% AFUE may be more cost-effective.</p>

<h2>Fuel Type Comparison</h2>
<table>
<thead><tr><th>Fuel</th><th>BTU/Unit</th><th>Avg Cost</th><th>Annual Cost (90K BTU home)</th></tr></thead>
<tbody>
<tr><td><strong>Natural Gas</strong></td><td>100,000/therm</td><td>$1.00–$1.50/therm</td><td>$600–$1,200</td></tr>
<tr><td><strong>Propane</strong></td><td>91,500/gallon</td><td>$2.50–$3.50/gal</td><td>$1,800–$3,000</td></tr>
<tr><td><strong>Heating Oil</strong></td><td>138,500/gallon</td><td>$3.00–$4.50/gal</td><td>$1,500–$2,800</td></tr>
<tr><td><strong>Electric</strong></td><td>3,412/kWh</td><td>$0.10–$0.25/kWh</td><td>$1,500–$4,000</td></tr>
</tbody>
</table>
<p><strong>Natural gas is the cheapest</strong> heating fuel in most US markets. Propane and oil are common in rural areas without gas lines. Electric furnaces are nearly 100% efficient but expensive to run.</p>

<h2>Common Furnace Sizes</h2>
<table>
<thead><tr><th>Furnace (Input BTU)</th><th>Output (95% AFUE)</th><th>Home Size (Moderate)</th></tr></thead>
<tbody>
<tr><td>40,000</td><td>38,000</td><td>800–1,100 sq ft</td></tr>
<tr><td>60,000</td><td>57,000</td><td>1,100–1,600 sq ft</td></tr>
<tr><td>80,000</td><td>76,000</td><td>1,600–2,200 sq ft</td></tr>
<tr><td>100,000</td><td>95,000</td><td>2,200–2,700 sq ft</td></tr>
<tr><td>120,000</td><td>114,000</td><td>2,700–3,300 sq ft</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "What size furnace do I need for 2,000 sq ft?", answer: "Depends on climate: mild (25 BTU/ft²) = 50,000 BTU, moderate (35) = 70,000 BTU, cold (45) = 90,000 BTU, very cold (60) = 120,000 BTU. Adjust for insulation (+30% poor, −30% excellent) and ceiling height (+5% per ft over 8 ft). Most 2,000 sq ft homes need an 80,000–100,000 BTU furnace." },
            { question: "What does AFUE mean?", answer: "Annual Fuel Utilization Efficiency — the percentage of fuel converted to heat. 95% AFUE means 95¢ of every $1 in fuel becomes heat, 5¢ goes up the flue. Standard furnaces: 80% AFUE. High-efficiency: 90–98% AFUE. Electric furnaces are ~100% AFUE but more expensive per BTU." },
            { question: "How many BTU per square foot for heating?", answer: "25–30 BTU/sq ft for mild climates (FL, TX, AZ). 30–40 for moderate (VA, NC, MO). 40–50 for cold (NY, OH, MI, MA). 50–60 for very cold (MN, MT, AK). These assume 8 ft ceilings and average insulation. Add 5% per foot of ceiling above 8 ft." },
            { question: "Is a bigger furnace better?", answer: "No — an oversized furnace short-cycles (turns on/off rapidly), causing uneven heating, higher energy bills, increased wear, and poor humidity control. Size your furnace to match your home's heat loss. A slightly oversized furnace (10–20% above calculated BTU) provides a safety margin." },
            { question: "Gas vs electric furnace — which is cheaper?", answer: "Gas is 2–3× cheaper to operate in most US markets. Natural gas: $600–$1,200/year for a typical home. Electric: $1,500–$4,000/year. However, electric furnaces cost less to install ($1,500–$3,000 vs $3,000–$6,000 for gas) and are nearly 100% efficient." },
            { question: "How does ceiling height affect furnace size?", answer: "Standard 8 ft ceilings are the baseline. Add 5% BTU per foot above 8 ft. A 10 ft ceiling needs 10% more BTU, a 12 ft vaulted ceiling needs 20% more. This accounts for the larger volume of air that must be heated." },
            { question: "What furnace efficiency should I choose?", answer: "Cold climates: 95%+ AFUE — the fuel savings pay for the higher price in 3–5 years. Moderate climates: 90% AFUE is a good balance. Mild climates: 80% AFUE may be sufficient since heating costs are already low. Always compare annual fuel cost, not just purchase price." },
            { question: "How much does it cost to heat a house per month?", answer: "Natural gas: $50–$150/month in winter for a typical 2,000 sq ft home. Propane: $150–$300/month. Oil: $150–$250/month. Electric: $125–$350/month. Actual costs depend on climate, insulation, thermostat settings, and local fuel prices." },
            { question: "Should I get a two-stage or variable-speed furnace?", answer: "Two-stage furnaces run at low (65%) and high (100%) capacity — better comfort, lower noise, less cycling. Variable-speed runs at 40–100% capacity for maximum comfort and efficiency. Both cost more upfront but save 10–20% on fuel. Best value in cold climates with long heating seasons." },
            { question: "How do I calculate annual heating cost?", answer: "Annual cost = (BTU output × heating hours × 0.5) ÷ (BTU per fuel unit × AFUE) × fuel price. The 0.5 factor accounts for the furnace not running at full capacity continuously. Example: 52,500 BTU × 1,800 hrs × 0.5 ÷ (100,000 × 0.95) × $1.20 = ~$596/year." },
        ],
    },
    "pipe-volume-calculator": {
        subtitle: "Calculate pipe volume from standard US pipe sizes and materials. Get gallons, liters, cubic feet, water weight, and gallons per foot. Supports multiple pipes.",
        explanation: {
            heading: "How to Calculate Pipe Volume",
            paragraphs: [
                "Volume = π × (ID/2)² × length. The calculator uses actual inner diameters for 8 standard US pipe sizes across 5 materials (copper, PEX, CPVC, PVC, galvanized). Nominal size ≠ actual ID.",
                "Results include gallons, liters, cubic feet, cubic inches, water weight (8.34 lbs/gal), and gallons per foot. Multi-pipe mode calculates total system volume and weight.",
            ],
            highlight: "1\" copper (1.049\" ID) × 100 ft: 4.24 gal, 16.1 L, 0.567 cu ft, 35.4 lbs water. Same size in PEX (0.863\" ID): 2.87 gal — 32% less!",
        },
        contentHTML: `
<p>Pipe volume is the <strong>internal capacity of a pipe</strong>, typically calculated for plumbing, HVAC, fire sprinkler, and irrigation systems. Knowing the volume is essential for <strong>filling, draining, flushing, sizing expansion tanks, calculating antifreeze amounts, and estimating water weight</strong>.</p>
<p>The calculator above uses <strong>actual inner diameters</strong> for 8 standard US pipe sizes across 5 pipe materials, calculates <strong>water weight</strong>, and supports <strong>multi-pipe systems</strong>.</p>
<p>Calculate flow with our <a href="/construction-calculators/flow-rate-calculator">flow rate calculator</a>. For tanks, see our <a href="/construction-calculators/tank-volume-calculator">tank volume calculator</a>. Check velocity with our <a href="/construction-calculators/water-velocity-calculator">water velocity calculator</a>.</p>

<h2>Pipe Volume Formula</h2>
<p><strong>Volume = π × r² × L</strong> — or equivalently: <strong>Volume = π × (D/2)² × L</strong></p>
<p>Where r = inner radius, D = inner diameter, L = length. All measurements must be in the same units.</p>
<p><strong>For US gallons:</strong> Calculate volume in cubic inches, then divide by 231 (1 US gallon = 231 cubic inches).</p>
<p><strong>Example:</strong> 1" copper pipe (1.049" ID) × 100 ft (1,200"):<br/>V = π × (1.049/2)² × 1,200 = π × 0.275 × 1,200 = <strong>1,037 cu in = 4.49 gal</strong></p>

<h2>Gallons Per Foot by Pipe Size</h2>
<table>
<thead><tr><th>Nominal Size</th><th>Copper (Type L)</th><th>PEX</th><th>PVC (Sch 40)</th><th>Gal/100 ft (Copper)</th></tr></thead>
<tbody>
<tr><td><strong>½"</strong></td><td>0.0160 gal/ft</td><td>0.0093 gal/ft</td><td>0.0160 gal/ft</td><td>1.60</td></tr>
<tr><td><strong>¾"</strong></td><td>0.0280 gal/ft</td><td>0.0191 gal/ft</td><td>0.0280 gal/ft</td><td>2.80</td></tr>
<tr><td><strong>1"</strong></td><td>0.0449 gal/ft</td><td>0.0304 gal/ft</td><td>0.0449 gal/ft</td><td>4.49</td></tr>
<tr><td><strong>1¼"</strong></td><td>0.0764 gal/ft</td><td>0.0496 gal/ft</td><td>0.0778 gal/ft</td><td>7.64</td></tr>
<tr><td><strong>1½"</strong></td><td>0.1059 gal/ft</td><td>0.0753 gal/ft</td><td>0.1059 gal/ft</td><td>10.59</td></tr>
<tr><td><strong>2"</strong></td><td>0.1746 gal/ft</td><td>0.1209 gal/ft</td><td>0.1746 gal/ft</td><td>17.46</td></tr>
<tr><td><strong>3"</strong></td><td>0.3844 gal/ft</td><td>—</td><td>0.3844 gal/ft</td><td>38.44</td></tr>
<tr><td><strong>4"</strong></td><td>0.6623 gal/ft</td><td>—</td><td>0.6623 gal/ft</td><td>66.23</td></tr>
</tbody>
</table>
<p><strong>Key insight:</strong> PEX pipes hold <strong>30–40% less water</strong> than copper pipes of the same nominal size due to thicker walls and smaller ID.</p>

<h2>Water Weight per 100 Feet</h2>
<table>
<thead><tr><th>Pipe Size (Copper)</th><th>Gallons/100 ft</th><th>Water Weight</th></tr></thead>
<tbody>
<tr><td><strong>½"</strong></td><td>1.60 gal</td><td>13.3 lbs</td></tr>
<tr><td><strong>¾"</strong></td><td>2.80 gal</td><td>23.4 lbs</td></tr>
<tr><td><strong>1"</strong></td><td>4.49 gal</td><td>37.4 lbs</td></tr>
<tr><td><strong>1½"</strong></td><td>10.59 gal</td><td>88.3 lbs</td></tr>
<tr><td><strong>2"</strong></td><td>17.46 gal</td><td>145.6 lbs</td></tr>
<tr><td><strong>3"</strong></td><td>38.44 gal</td><td>320.6 lbs</td></tr>
<tr><td><strong>4"</strong></td><td>66.23 gal</td><td>552.4 lbs</td></tr>
</tbody>
</table>
<p><strong>Water weighs 8.34 lbs per gallon</strong> at 60°F. For hot water (140°F), weight decreases ~1% to 8.26 lbs/gal. For structural load calculations, use the higher cold-water weight.</p>

<h2>Nominal Size vs. Actual Inner Diameter</h2>
<p>Nominal pipe size is a trade designation — <strong>NOT the actual measurement</strong>. The actual ID varies significantly by material:</p>
<table>
<thead><tr><th>Nominal</th><th>Copper L</th><th>PEX</th><th>CPVC</th><th>PVC Sch 40</th></tr></thead>
<tbody>
<tr><td><strong>½"</strong></td><td>0.622"</td><td>0.475"</td><td>0.536"</td><td>0.622"</td></tr>
<tr><td><strong>¾"</strong></td><td>0.824"</td><td>0.681"</td><td>0.720"</td><td>0.824"</td></tr>
<tr><td><strong>1"</strong></td><td>1.049"</td><td>0.863"</td><td>0.920"</td><td>1.049"</td></tr>
<tr><td><strong>2"</strong></td><td>2.067"</td><td>1.720"</td><td>1.935"</td><td>2.067"</td></tr>
</tbody>
</table>
<p><strong>Always use actual ID</strong> for volume calculations. Using nominal size will give incorrect results — a "1-inch" PEX pipe holds 32% less water than a "1-inch" copper pipe.</p>

<h2>Common Applications</h2>
<ul>
<li><strong>Drain-down volume:</strong> How much water you'll drain from a system (winterization, repair)</li>
<li><strong>Fill volume:</strong> How much water to add when filling a new system or after repairs</li>
<li><strong>Antifreeze calculation:</strong> Volume needed for glycol mix in radiant heating systems</li>
<li><strong>Expansion tank sizing:</strong> Total system volume determines expansion tank size</li>
<li><strong>Water hammer analysis:</strong> More water = more potential energy = worse water hammer</li>
<li><strong>Structural load:</strong> Water weight for floor/ceiling support calculations</li>
</ul>
`,
        faq: [
            { question: "How many gallons of water in 100 feet of pipe?", answer: "Copper: ½\" = 1.6 gal, ¾\" = 2.8 gal, 1\" = 4.5 gal, 1½\" = 10.6 gal, 2\" = 17.5 gal, 3\" = 38.4 gal, 4\" = 66.2 gal. PEX holds 30–40% less due to smaller inner diameter at the same nominal size." },
            { question: "Should I use ID or OD for pipe volume?", answer: "Always use inner diameter (ID). Nominal sizes don't match actual dimensions. A 1\" copper pipe has 1.049\" ID; a 1\" PEX has 0.863\" ID — using OD or nominal size gives wrong results. The calculator automatically uses correct IDs for each material." },
            { question: "How much does the water in a pipe weigh?", answer: "Water weighs 8.34 lbs/gallon at 60°F. A 100-ft run of 1\" copper holds 4.5 gal = 37.4 lbs. A 100-ft run of 2\" copper holds 17.5 gal = 145.6 lbs. For structural calculations (ceilings, floors), always use cold-water weight." },
            { question: "Why does PEX hold less water than copper?", answer: "PEX has thicker walls relative to its nominal size, resulting in a smaller inner diameter. A ¾\" PEX has 0.681\" ID vs ¾\" copper at 0.824\" ID — 17% smaller diameter means 32% less cross-sectional area and volume. This matters for antifreeze calculations and system fill volumes." },
            { question: "How do I calculate pipe volume in gallons?", answer: "Volume (gal) = π × (ID in inches / 2)² × length in inches ÷ 231. Example: 1\" copper (1.049\" ID) × 100 ft: V = π × 0.5245² × 1200 ÷ 231 = 4.49 gallons. Or use gallons-per-foot from the table and multiply by pipe length." },
            { question: "How many gallons per foot of pipe?", answer: "Copper: ½\" = 0.016 gal/ft, ¾\" = 0.028 gal/ft, 1\" = 0.045 gal/ft, 1½\" = 0.106 gal/ft, 2\" = 0.175 gal/ft. Multiply by total pipe length to get system volume. These values are specific to pipe material — check the table for PEX and PVC." },
            { question: "How much antifreeze do I need for radiant heating?", answer: "Calculate total system volume (pipes + boiler + headers). For propylene glycol: 30% mix for 0°F protection, 50% mix for -30°F. Example: 500 ft of 1\" copper = 22.5 gal. At 30% glycol: 6.7 gal glycol + 15.8 gal water. Add 10% for expansion tank." },
            { question: "How do I calculate volume for multiple pipe sizes?", answer: "Calculate each section separately (different sizes have different IDs), then add the volumes together. Example: 50 ft of 1\" copper (2.24 gal) + 200 ft of ¾\" copper (5.60 gal) = 7.84 gal total. Use the calculator's multi-pipe feature for runs of the same size." },
            { question: "What is the volume of a fire sprinkler system?", answer: "Typical residential fire sprinkler: 200–500 ft of 1\" CPVC + 50–100 ft of 1¼\" CPVC = 15–60 gallons total. Commercial systems with 2\"–4\" mains can hold 200+ gallons. Volume determines fill time and water supply requirements." },
            { question: "Does water temperature affect pipe volume?", answer: "Water volume changes less than 1% between 40°F and 140°F, so temperature has negligible effect on pipe capacity. However, for expansion tank sizing, thermal expansion matters: water expands ~2.5% when heated from 40°F to 180°F in a closed system." },
        ],
    },
    "refrigerant-line-charge-calculator": {
        subtitle: "Calculate additional refrigerant charge for HVAC line sets. Select refrigerant type (R-410A, R-22, R-407C), system tonnage, and both liquid and suction line sizes.",
        explanation: {
            heading: "Refrigerant Line Set Charging",
            paragraphs: [
                "Split-system AC and heat pump units ship with a factory charge sized for a standard line set (typically 15–25 ft). Longer runs need additional refrigerant based on both liquid and suction line diameters and refrigerant type.",
                "The calculator includes charge rates for R-410A, R-22, and R-407C with both liquid and suction lines. Select system tonnage to auto-fill factory charge and line sizes, or enter custom values.",
            ],
            highlight: "3 Ton R-410A, 50 ft run (factory: 15 ft): extra 35 ft × (0.43 + 0.28) oz/ft = 24.9 oz additional charge = 1.55 lbs.",
        },
        contentHTML: `
<p>When installing a <strong>split-system air conditioner or heat pump</strong>, the refrigerant line set connects the outdoor condenser to the indoor evaporator. Factory charge covers a standard line length — any line beyond that requires <strong>additional refrigerant</strong> calculated from the liquid and suction line charge rates.</p>
<p>The calculator above supports <strong>3 refrigerant types</strong> (R-410A, R-22, R-407C), <strong>7 system tonnage presets</strong> with auto-filled factory data, and separate <strong>liquid + suction line</strong> calculations for accurate total charge.</p>
<p>Calculate line volume with our <a href="/construction-calculators/pipe-volume-calculator">pipe volume calculator</a>. Size your HVAC with our <a href="/construction-calculators/furnace-btu-calculator">furnace BTU calculator</a>. Calculate airflow with our <a href="/construction-calculators/cfm-calculator">CFM calculator</a>.</p>

<h2>R-410A Liquid Line Charge (oz per foot)</h2>
<p>The liquid line (small line) carries high-pressure liquid refrigerant from the condenser to the expansion valve.</p>
<table>
<thead><tr><th>Line Size</th><th>oz/ft</th><th>Common System</th></tr></thead>
<tbody>
<tr><td><strong>1/4"</strong></td><td>0.19</td><td>1–1.5 ton</td></tr>
<tr><td><strong>5/16"</strong></td><td>0.30</td><td>2 ton</td></tr>
<tr><td><strong>3/8"</strong></td><td>0.43</td><td>2.5–5 ton (most common)</td></tr>
<tr><td><strong>1/2"</strong></td><td>0.78</td><td>5+ ton / commercial</td></tr>
<tr><td><strong>5/8"</strong></td><td>1.22</td><td>Large commercial</td></tr>
<tr><td><strong>3/4"</strong></td><td>1.76</td><td>Large commercial</td></tr>
<tr><td><strong>7/8"</strong></td><td>2.40</td><td>Large commercial</td></tr>
</tbody>
</table>

<h2>R-410A Suction Line Charge (oz per foot)</h2>
<p>The suction line (large line) carries low-pressure gas from the evaporator back to the compressor. It has lower charge per foot because the refrigerant is in gas form.</p>
<table>
<thead><tr><th>Line Size</th><th>oz/ft</th><th>Common System</th></tr></thead>
<tbody>
<tr><td><strong>1/2"</strong></td><td>0.12</td><td>Mini-split</td></tr>
<tr><td><strong>5/8"</strong></td><td>0.19</td><td>1–1.5 ton</td></tr>
<tr><td><strong>3/4"</strong></td><td>0.28</td><td>2–3 ton</td></tr>
<tr><td><strong>7/8"</strong></td><td>0.38</td><td>3–4 ton</td></tr>
<tr><td><strong>1-1/8"</strong></td><td>0.62</td><td>4–5 ton</td></tr>
<tr><td><strong>1-3/8"</strong></td><td>0.93</td><td>5+ ton</td></tr>
</tbody>
</table>

<h2>System Tonnage & Factory Charge</h2>
<table>
<thead><tr><th>System</th><th>BTU</th><th>Factory Charge (approx)</th><th>Factory Line (ft)</th><th>Liquid Line</th><th>Suction Line</th></tr></thead>
<tbody>
<tr><td><strong>1.5 Ton</strong></td><td>18,000</td><td>72 oz (4.5 lbs)</td><td>15 ft</td><td>1/4"</td><td>5/8"</td></tr>
<tr><td><strong>2 Ton</strong></td><td>24,000</td><td>96 oz (6 lbs)</td><td>15 ft</td><td>5/16"</td><td>3/4"</td></tr>
<tr><td><strong>2.5 Ton</strong></td><td>30,000</td><td>112 oz (7 lbs)</td><td>15 ft</td><td>3/8"</td><td>3/4"</td></tr>
<tr><td><strong>3 Ton</strong></td><td>36,000</td><td>128 oz (8 lbs)</td><td>15 ft</td><td>3/8"</td><td>3/4"</td></tr>
<tr><td><strong>3.5 Ton</strong></td><td>42,000</td><td>152 oz (9.5 lbs)</td><td>25 ft</td><td>3/8"</td><td>7/8"</td></tr>
<tr><td><strong>4 Ton</strong></td><td>48,000</td><td>176 oz (11 lbs)</td><td>25 ft</td><td>3/8"</td><td>7/8"</td></tr>
<tr><td><strong>5 Ton</strong></td><td>60,000</td><td>210 oz (13 lbs)</td><td>25 ft</td><td>3/8"</td><td>1-1/8"</td></tr>
</tbody>
</table>
<p><strong>Always check your unit's nameplate</strong> for exact factory charge — these are typical values and vary by manufacturer.</p>

<h2>Step-by-Step Estimation</h2>
<h3>Step 1: Identify Your System</h3>
<p>Find system tonnage, refrigerant type, and factory charge on the unit's data plate (outdoor condenser). Note the factory line set length.</p>

<h3>Step 2: Measure Total Line Length</h3>
<p>Measure actual line set from condenser to evaporator, including vertical rises. Calculate extra length: total length minus factory line length.</p>

<h3>Step 3: Calculate Additional Charge</h3>
<p>Look up liquid and suction line charge rates for your refrigerant type. Multiply extra length × (liquid rate + suction rate).</p>
<p><strong>Example:</strong> 3 Ton R-410A, 50 ft total run, factory 15 ft: Extra = 35 ft × (0.43 + 0.28) = 35 × 0.71 = <strong>24.9 oz (1.55 lbs)</strong> additional charge.</p>

<h2>R-22 vs R-410A Charge Rates</h2>
<table>
<thead><tr><th>Line Size</th><th>R-410A (oz/ft)</th><th>R-22 (oz/ft)</th><th>Difference</th></tr></thead>
<tbody>
<tr><td>3/8" liquid</td><td>0.43</td><td>0.34</td><td>R-410A is 26% more</td></tr>
<tr><td>3/4" suction</td><td>0.28</td><td>0.14</td><td>R-410A is 2× more</td></tr>
<tr><td>7/8" suction</td><td>0.38</td><td>0.19</td><td>R-410A is 2× more</td></tr>
</tbody>
</table>
<p><strong>R-410A requires significantly more charge per foot</strong> than R-22, especially on suction lines. Systems converting from R-22 to R-407C require different charge calculations — do not use R-22 rates for R-407C.</p>
`,
        faq: [
            { question: "How much refrigerant per foot of line set?", answer: "R-410A (most common): liquid line 3/8\" = 0.43 oz/ft + suction line 3/4\" = 0.28 oz/ft = 0.71 oz/ft combined. This varies by line size and refrigerant type. R-22 rates are lower (0.34 + 0.14 = 0.48 oz/ft for the same sizes)." },
            { question: "What is factory charge?", answer: "The amount of refrigerant pre-charged at the factory, sized for a standard line set (typically 15 ft for 1.5–3 ton, 25 ft for 3.5–5 ton). Check the unit nameplate for exact amount. Any line length beyond the factory length requires adding refrigerant at the per-foot rate." },
            { question: "Do I need to charge the suction line too?", answer: "Yes — both liquid and suction lines contain refrigerant and both need to be included in charge calculations. The suction line carries lower-density gas so its charge rate per foot is lower, but it's a larger diameter line. Ignoring suction line charge leads to undercharging." },
            { question: "How do I know my line sizes?", answer: "The liquid line is the smaller line (typically 1/4\" to 3/8\" for residential). The suction line is the larger, insulated line (typically 3/4\" to 1-1/8\"). Check the unit's installation manual for recommended line sizes based on system tonnage and run length." },
            { question: "What happens if I add too much or too little refrigerant?", answer: "Overcharging: high head pressure, reduced efficiency, potential compressor damage, liquid slugging. Undercharging: poor cooling, ice on evaporator coil, compressor overheating, potential burnout. Both reduce system lifespan. Proper superheat/subcooling measurement is essential." },
            { question: "Can I still use R-22?", answer: "R-22 was phased out on January 1, 2020 — no new production or import allowed in the US. Existing systems can use recycled/reclaimed R-22, but it's expensive ($40–$100/lb). For new installations, R-410A is standard. R-407C is a common R-22 retrofit replacement." },
            { question: "What's the maximum line set length?", answer: "Most residential systems: 50–75 ft maximum. Mini-splits: typically 50 ft max (some up to 230 ft). Longer runs reduce efficiency and may require larger line sizes. Always follow manufacturer specifications — exceeding maximum length voids the warranty." },
            { question: "How much does R-410A cost?", answer: "R-410A: $6–$15/lb wholesale, $30–$80/lb installed by HVAC technician. A typical residential charge is 6–14 lbs. Additional line charge for 35 extra feet is usually 1–2 lbs ($30–$160 installed). R-22 (recycled): $40–$100/lb." },
            { question: "Do I need EPA certification to handle refrigerant?", answer: "Yes — EPA Section 608 certification is required to purchase and handle refrigerants in the US. This applies to all HVAC refrigerants including R-410A, R-22, and R-407C. Venting refrigerant is illegal under the Clean Air Act. Only certified technicians should add refrigerant." },
            { question: "What is the difference between liquid and suction lines?", answer: "Liquid line (small, uninsulated): carries high-pressure liquid from condenser to expansion valve. Suction line (large, insulated): carries low-pressure gas from evaporator to compressor. The suction line is always insulated to prevent condensation and maintain efficiency." },
        ],
    },
    "water-velocity-calculator": {
        subtitle: "Calculate water velocity in pipes. Select standard US pipe sizes, pipe material, and water temperature. Get Reynolds number, flow type, and velocity assessment.",
        explanation: {
            heading: "Water Velocity in Pipes",
            paragraphs: [
                "Velocity = flow rate ÷ pipe cross-sectional area. For GPM: v (ft/s) = 0.408 × GPM ÷ D² (inches). The calculator uses actual inner diameter (ID) for standard copper pipe sizes and adjusts for material velocity limits.",
                "Results include Reynolds number (laminar < 2300 / turbulent > 4000), flow type classification, and water temperature correction. Recommended velocity: 5 ft/s residential, 8 ft/s commercial.",
            ],
            highlight: "10 GPM through 1\" copper (1.049\" ID): velocity = 3.72 ft/s ✅ Within limits. Reynolds = 25,300 (turbulent). Same flow in ¾\" pipe: 6.01 ft/s ⚠️ Moderate.",
        },
        contentHTML: `
<p>Water velocity is the <strong>speed of water flowing through a pipe</strong>, measured in feet per second (ft/s). It's one of the most important parameters in plumbing design — too fast causes <strong>water hammer, erosion, and noise</strong>; too slow causes <strong>sediment buildup and bacterial growth</strong>.</p>
<p>The calculator above uses <strong>actual inner diameters</strong> for 8 standard US copper pipe sizes, supports <strong>5 pipe materials</strong>, calculates <strong>Reynolds number</strong> to classify flow type (laminar/turbulent), and accounts for <strong>water temperature</strong> (which affects viscosity).</p>
<p>Calculate flow rate with our <a href="/construction-calculators/flow-rate-calculator">flow rate calculator</a>. For pipe volume, use our <a href="/construction-calculators/pipe-volume-calculator">pipe volume calculator</a>. For tanks, see our <a href="/construction-calculators/tank-volume-calculator">tank volume calculator</a>.</p>

<h2>Water Velocity Formula</h2>
<p>The universal formula is <strong>v = Q / A</strong> (velocity = flow rate ÷ cross-sectional area). For US plumbing units:</p>
<p><strong>v (ft/s) = 0.408 × GPM ÷ D²</strong></p>
<p>Where v = velocity in feet per second, GPM = gallons per minute, D = pipe inner diameter in inches.</p>
<p><strong>Example:</strong> 10 GPM through 1" copper pipe (1.049" ID): v = 0.408 × 10 ÷ 1.049² = 4.08 ÷ 1.1 = <strong>3.71 ft/s</strong></p>

<h2>Standard Pipe Inner Diameters</h2>
<p>Nominal pipe size ≠ actual inner diameter. The actual ID depends on pipe material and wall thickness.</p>
<table>
<thead><tr><th>Nominal Size</th><th>Copper Type L (ID)</th><th>PEX (ID)</th><th>Cross-Section</th></tr></thead>
<tbody>
<tr><td><strong>½"</strong></td><td>0.622"</td><td>0.475"</td><td>0.304 sq in</td></tr>
<tr><td><strong>¾"</strong></td><td>0.824"</td><td>0.681"</td><td>0.533 sq in</td></tr>
<tr><td><strong>1"</strong></td><td>1.049"</td><td>0.863"</td><td>0.864 sq in</td></tr>
<tr><td><strong>1¼"</strong></td><td>1.368"</td><td>1.102"</td><td>1.47 sq in</td></tr>
<tr><td><strong>1½"</strong></td><td>1.610"</td><td>1.358"</td><td>2.04 sq in</td></tr>
<tr><td><strong>2"</strong></td><td>2.067"</td><td>1.720"</td><td>3.36 sq in</td></tr>
<tr><td><strong>3"</strong></td><td>3.068"</td><td>—</td><td>7.39 sq in</td></tr>
<tr><td><strong>4"</strong></td><td>4.026"</td><td>—</td><td>12.73 sq in</td></tr>
</tbody>
</table>
<p><strong>Key insight:</strong> A ¾" PEX pipe has a <strong>smaller ID than ¾" copper</strong> (0.681" vs 0.824"). At the same GPM, water moves faster in PEX — which matters for velocity limits.</p>

<h2>Recommended Velocity Limits</h2>
<table>
<thead><tr><th>Application</th><th>Recommended</th><th>Maximum</th><th>Reason</th></tr></thead>
<tbody>
<tr><td><strong>Residential cold</strong></td><td>≤ 5 ft/s</td><td>8 ft/s</td><td>Noise, water hammer</td></tr>
<tr><td><strong>Residential hot</strong></td><td>≤ 4 ft/s</td><td>5 ft/s</td><td>Erosion at higher temps</td></tr>
<tr><td><strong>Commercial</strong></td><td>≤ 8 ft/s</td><td>10 ft/s</td><td>Short runs acceptable</td></tr>
<tr><td><strong>Fire sprinkler</strong></td><td>≤ 20 ft/s</td><td>32 ft/s</td><td>Per NFPA 13</td></tr>
<tr><td><strong>Minimum (any)</strong></td><td>≥ 2 ft/s</td><td>—</td><td>Prevent sediment, bacteria</td></tr>
</tbody>
</table>
<p><strong>Hot water systems</strong> have lower velocity limits because higher temperatures increase erosion — especially in copper pipes where turbulent flow above 4 ft/s accelerates copper dissolution.</p>

<h2>Reynolds Number & Flow Type</h2>
<p>The <strong>Reynolds number (Re)</strong> determines whether the flow is smooth or chaotic:</p>
<ul>
<li><strong>Re < 2,300:</strong> Laminar flow — smooth, parallel layers. Minimal noise and erosion. Rare in plumbing.</li>
<li><strong>2,300 < Re < 4,000:</strong> Transitional — unpredictable mix of laminar and turbulent.</li>
<li><strong>Re > 4,000:</strong> Turbulent — most common in plumbing. Higher friction, noise potential, but better mixing.</li>
</ul>
<p><strong>Formula:</strong> Re = v × D / ν — where v = velocity, D = pipe diameter, ν = kinematic viscosity (temperature-dependent).</p>

<h2>Water Temperature Effect</h2>
<p>Hot water is less viscous, which changes the Reynolds number and flow characteristics:</p>
<table>
<thead><tr><th>Temperature</th><th>Viscosity (ft²/s)</th><th>Effect on Re</th></tr></thead>
<tbody>
<tr><td>40°F (cold supply)</td><td>1.664 × 10⁻⁵</td><td>Lower Re</td></tr>
<tr><td>60°F (typical)</td><td>1.217 × 10⁻⁵</td><td>Baseline</td></tr>
<tr><td>100°F (warm)</td><td>7.39 × 10⁻⁶</td><td>Higher Re</td></tr>
<tr><td>140°F (hot water)</td><td>5.14 × 10⁻⁶</td><td>Highest Re — more turbulent</td></tr>
</tbody>
</table>

<h2>Pipe Sizing for Target Velocity</h2>
<p>To find the right pipe size, work backwards from your flow rate and target velocity:</p>
<p><strong>D (in) = √(0.408 × GPM ÷ v)</strong></p>
<p><strong>Example:</strong> 15 GPM at 5 ft/s target: D = √(0.408 × 15 ÷ 5) = √1.224 = <strong>1.11"</strong> → use 1¼" copper (1.368" ID).</p>
`,
        faq: [
            { question: "What is the maximum water velocity in pipes?", answer: "Residential cold: 5 ft/s recommended, 8 ft/s max. Residential hot: 4 ft/s recommended, 5 ft/s max. Commercial: 8 ft/s normal, 10 ft/s for short runs. Fire sprinkler: up to 32 ft/s per NFPA 13. Minimum: 2 ft/s to prevent sediment and bacteria." },
            { question: "What causes water hammer?", answer: "Water hammer is a pressure surge when flowing water is suddenly stopped (valve closing quickly). Higher velocity = worse hammer. V > 5 ft/s significantly increases risk. Solutions: lower velocity (larger pipe), install water hammer arrestors, use slow-closing valves, add expansion tanks." },
            { question: "How do I calculate water velocity from GPM?", answer: "v (ft/s) = 0.408 × GPM ÷ D² — where D is pipe inner diameter in inches. Example: 10 GPM through 1\" copper (1.049\" ID): v = 0.408 × 10 ÷ 1.049² = 3.71 ft/s. This formula converts GPM to cubic feet per second and divides by pipe area." },
            { question: "Why is actual ID different from nominal pipe size?", answer: "Nominal size is a trade designation, not a measurement. A \"1-inch\" copper pipe actually has a 1.049\" inner diameter. A \"1-inch\" PEX pipe has a 0.863\" ID — 18% smaller than copper. Always use actual ID for velocity calculations." },
            { question: "What is the Reynolds number?", answer: "Reynolds number (Re) determines flow type: Re < 2,300 = laminar (smooth), Re > 4,000 = turbulent (chaotic). Formula: Re = v × D / ν. Most plumbing systems operate in the turbulent range (Re > 10,000). Temperature affects Re because hot water is less viscous." },
            { question: "Does pipe diameter affect velocity?", answer: "Yes — dramatically. Velocity is inversely proportional to diameter squared. Doubling the pipe diameter reduces velocity by 75% (4× the area). Going from ¾\" to 1\" copper reduces velocity by 38% at the same flow rate." },
            { question: "What's the velocity in a ¾\" pipe at 10 GPM?", answer: "¾\" copper (0.824\" ID): v = 0.408 × 10 ÷ 0.824² = 4.08 ÷ 0.679 = 6.01 ft/s — ⚠️ above the 5 ft/s residential recommendation. Use 1\" copper at 10 GPM to stay within limits (3.71 ft/s)." },
            { question: "Does water temperature affect velocity calculations?", answer: "Temperature doesn't change velocity directly — v = Q/A regardless of temperature. But temperature changes viscosity, which affects the Reynolds number and flow type. Hot water (140°F) has half the viscosity of cold water (40°F), making flow more turbulent at the same velocity." },
            { question: "Why is hot water velocity limited to 4 ft/s?", answer: "Higher temperatures increase copper dissolution (erosion corrosion), especially in turbulent flow above 4 ft/s. This leads to pinhole leaks in copper pipes. CPVC and PEX are less susceptible, but the 4 ft/s guideline is widely followed as best practice." },
            { question: "How do I reduce water velocity in existing pipes?", answer: "Install a larger pipe (best solution). Reduce flow rate with pressure-reducing valve. Split the flow across two pipes. Add a bypass loop. For branches, use ¾\" minimum (not ½\") for fixtures. As a rule: size the pipe for 5 ft/s at peak flow demand." },
        ],
    },
    "window-ac-size-calculator": {
        subtitle: "Calculate the right BTU window AC unit. Adjust for room size, ceiling height, sun exposure, insulation, kitchen use, occupants, and see electrical requirements and monthly cost.",
        explanation: {
            heading: "How to Size a Window Air Conditioner",
            paragraphs: [
                "Base sizing: 20 BTU per sq ft (Energy Star). Adjust for ceiling height (+5% per foot over 8 ft), sun exposure (±10%), insulation quality (±10–15%), kitchen use (+4,000 BTU), and occupants (+600 BTU per person over 2).",
                "Units above 14,000 BTU require 230V dedicated circuits. The calculator estimates wattage, amperage, and monthly operating cost based on your electric rate and 8 hours/day usage.",
            ],
            highlight: "A 300 sq ft room, 8 ft ceiling, normal sun, average insulation, 2 people: 8,000 BTU. With heavy sun + poor insulation: 10,000 BTU. Est. monthly cost at $0.16/kWh: $30.72.",
        },
        contentHTML: `
<p>Window air conditioners are the most common <strong>room-level cooling solution</strong> in the US, with over 10 million units sold annually. Choosing the right BTU size is critical — <strong>too small</strong> and the unit runs constantly without cooling adequately; <strong>too large</strong> and it short-cycles, leaving the room cold and humid.</p>
<p>The calculator above uses the <strong>Energy Star BTU guidelines</strong> with 6 real-world adjustment factors: ceiling height, sun exposure, insulation, kitchen heat, occupants, and electric rate — plus it shows <strong>electrical requirements and estimated monthly cost</strong>.</p>
<p>For heating, use our <a href="/construction-calculators/furnace-btu-calculator">furnace BTU calculator</a>. Calculate airflow with our <a href="/construction-calculators/cfm-calculator">CFM calculator</a>. Measure room area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>Energy Star BTU Size Chart</h2>
<p>The DOE/Energy Star baseline assumes 8 ft ceilings, average insulation, and 2 occupants.</p>
<table>
<thead><tr><th>Room Size (sq ft)</th><th>Recommended BTU</th><th>Typical Unit</th></tr></thead>
<tbody>
<tr><td>100–150</td><td>5,000</td><td>Small bedroom</td></tr>
<tr><td>150–250</td><td>6,000</td><td>Bedroom / office</td></tr>
<tr><td>250–350</td><td>8,000</td><td>Large bedroom</td></tr>
<tr><td>350–450</td><td>10,000</td><td>Living room</td></tr>
<tr><td>450–550</td><td>12,000 (1 ton)</td><td>Large living room</td></tr>
<tr><td>550–700</td><td>14,000</td><td>Open plan room</td></tr>
<tr><td>700–1,000</td><td>18,000 (1.5 ton)</td><td>Large open area</td></tr>
<tr><td>1,000–1,200</td><td>21,000</td><td>Multi-room / studio</td></tr>
<tr><td>1,200–1,400</td><td>23,000</td><td>Large apartment</td></tr>
<tr><td>1,400+</td><td>25,000+</td><td>Consider central AC</td></tr>
</tbody>
</table>

<h2>Adjustment Factors</h2>
<h3>1. Ceiling Height</h3>
<p>Standard ceilings are 8 ft. Taller ceilings mean more air volume to cool. Add <strong>5% per foot over 8 ft</strong>. A 10 ft ceiling needs 10% more BTU; a 12 ft ceiling needs 20% more.</p>

<h3>2. Sun Exposure</h3>
<p><strong>Heavy sun</strong> (south-/west-facing, large windows): add 10%. <strong>Heavy shade</strong> (north-facing, tree cover): subtract 10%. This is one of the most significant factors — a sun-baked room can need 20% more cooling than a shaded one.</p>

<h3>3. Insulation Quality</h3>
<p><strong>Poor insulation</strong> (old homes, single-pane windows, no wall insulation): add 15%. <strong>Good insulation</strong> (new construction, double-pane, insulated walls): subtract 10%. Insulation quality dramatically affects cooling load.</p>

<h3>4. Kitchen Use</h3>
<p>Cooking appliances (oven, stove, dishwasher) generate significant heat. Add <strong>4,000 BTU</strong> for kitchens. This is a fixed addition regardless of room size.</p>

<h3>5. Occupants</h3>
<p>The baseline assumes 2 people. Each additional person adds roughly <strong>600 BTU</strong> of body heat. A room regularly occupied by 4 people needs 1,200 BTU more than baseline.</p>

<h3>6. Electronics & Appliances</h3>
<p>Rooms with many computers, monitors, or other heat-generating equipment may need an additional 10% BTU. Server rooms and home offices with multiple screens are common examples.</p>

<h2>Electrical Requirements</h2>
<table>
<thead><tr><th>BTU Range</th><th>Voltage</th><th>Amperage</th><th>Circuit Type</th></tr></thead>
<tbody>
<tr><td>5,000–12,000</td><td>115V</td><td>5–12 amps</td><td>Standard outlet (shared OK)</td></tr>
<tr><td>12,000–14,000</td><td>115V</td><td>12–15 amps</td><td>Dedicated 15A circuit recommended</td></tr>
<tr><td>14,000–18,000</td><td>230V</td><td>7–9 amps</td><td>Dedicated 230V outlet required</td></tr>
<tr><td>18,000–25,000</td><td>230V</td><td>9–13 amps</td><td>Dedicated 230V/20A circuit</td></tr>
</tbody>
</table>
<p><strong>Important:</strong> Units above 14,000 BTU require a <strong>dedicated 230V outlet</strong> — most homes don't have these in bedrooms. Check your electrical panel before purchasing. Installing a 230V outlet costs $150–$400.</p>

<h2>Estimated Operating Cost</h2>
<p>Monthly cost = (BTU ÷ 10) ÷ 1,000 × hours/day × 30 days × electric rate.</p>
<table>
<thead><tr><th>BTU</th><th>Watts</th><th>8 hrs/day @ $0.16/kWh</th><th>Annual (5 months)</th></tr></thead>
<tbody>
<tr><td>5,000</td><td>500W</td><td>$19/mo</td><td>$96</td></tr>
<tr><td>8,000</td><td>800W</td><td>$31/mo</td><td>$154</td></tr>
<tr><td>10,000</td><td>1,000W</td><td>$38/mo</td><td>$192</td></tr>
<tr><td>12,000</td><td>1,200W</td><td>$46/mo</td><td>$230</td></tr>
<tr><td>14,000</td><td>1,400W</td><td>$54/mo</td><td>$269</td></tr>
<tr><td>18,000</td><td>1,800W</td><td>$69/mo</td><td>$346</td></tr>
</tbody>
</table>
<p><strong>Tip:</strong> Look for <strong>Energy Star certified</strong> units — they use 10–15% less energy than standard models. CEER (Combined Energy Efficiency Ratio) of 12+ is excellent; 10+ is good.</p>
`,
        faq: [
            { question: "What size window AC for a 12×12 room?", answer: "144 sq ft = 5,000–6,000 BTU. If the room gets afternoon sun, go with 6,000 BTU. A 5,000 BTU unit is fine for a shaded room. Add 600 BTU per person beyond 2. For a 12×12 kitchen, add 4,000 BTU = 9,000–10,000 BTU." },
            { question: "Can a window AC be too big?", answer: "Yes! An oversized AC cools too quickly without removing humidity, leaving the room cold and clammy. It also cycles on/off more frequently (short-cycling), wasting energy and wearing out the compressor faster. Always choose the right size — not the biggest." },
            { question: "How many BTU per square foot?", answer: "The Energy Star baseline is 20 BTU per sq ft for standard rooms (8 ft ceiling, average insulation, 2 occupants). Adjust up for sun, poor insulation, kitchens, tall ceilings, or extra people. Adjust down for shade and good insulation." },
            { question: "What voltage does a window AC need?", answer: "Units up to 14,000 BTU: standard 115V outlet. Units above 14,000 BTU: dedicated 230V outlet. Check the unit's label for exact requirements. Running a 230V unit on 115V won't work. Installing a 230V outlet costs $150–$400." },
            { question: "How much does it cost to run a window AC?", answer: "An 8,000 BTU unit running 8 hrs/day at $0.16/kWh = ~$31/month. A 12,000 BTU unit = ~$46/month. Annual cost (5 summer months): $154–$230. Energy Star units save 10–15%. Use a programmable timer to reduce usage." },
            { question: "Do ceiling height affect AC size?", answer: "Yes — taller ceilings mean more air volume. Add 5% per foot above 8 ft. A 10 ft ceiling needs 10% more BTU. A 12 ft ceiling (loft, old home) needs 20% more. This is often overlooked but significantly affects cooling performance." },
            { question: "What is CEER and why does it matter?", answer: "CEER (Combined Energy Efficiency Ratio) measures how efficiently the AC converts electricity to cooling. Higher CEER = lower operating cost. 12+ CEER is excellent; 10+ is good; below 9.7 doesn't meet Energy Star standards. A CEER-12 unit costs ~15% less to run than a CEER-10 unit." },
            { question: "Can I cool two rooms with one window AC?", answer: "Not effectively. Window ACs are designed for single rooms. Cooling adjacent rooms requires the unit to work much harder, and the second room won't cool evenly. Use a fan to circulate air, or install a separate unit in each room. For multi-room cooling, consider a mini-split system." },
            { question: "When should I choose a portable AC instead?", answer: "Choose portable AC when: windows don't accommodate a window unit, you rent and can't modify windows, you need to move the unit between rooms, or HOA rules prohibit window units. Portable ACs are 10–40% less efficient than window units of the same BTU rating." },
            { question: "What size window do I need for a window AC?", answer: "Most units fit windows 23\"–36\" wide. Smaller 5,000–8,000 BTU units fit narrower windows (23\"–28\"). Large 14,000+ BTU units need wider windows (28\"–36\") and stronger sills. Measure your window opening (width and height) before purchasing. Use the included accordion panels to fill gaps." },
        ],
    },
    "ice-water-shield-calculator": {
        subtitle: "Calculate ice and water shield membrane for eaves, valleys, and penetrations. Choose roll size, roof pitch, and get rolls and cost.",
        explanation: {
            heading: "Ice & Water Shield Coverage",
            paragraphs: [
                "Ice and water shield (ice barrier) is a self-adhering membrane installed at vulnerable roof areas. Code requires it at eaves extending 24\" past the exterior wall line. The calculator applies your roof pitch to compute actual eave run up the slope.",
                "Standard rolls: 3' × 75' (225 sq ft), 3' × 67' (200 sq ft), or 3' × 36' (108 sq ft). Apply at eaves, valleys (3 ft wide), and around all penetrations (skylights, chimneys, vent pipes). Add 10% for overlaps.",
            ],
            highlight: "40 ft eave (both sides) at 4/12 pitch (3 ft coverage): 253 sq ft. 2 valleys (15 ft × 3 ft): 90 sq ft. 2 vents: 8 sq ft. With 10% overlap: 386 sq ft = 2 rolls (3'×75') = $260.",
        },
        contentHTML: `
<p>Ice and water shield (also called ice barrier, ice dam membrane, or self-adhering underlayment) is a <strong>critical waterproofing membrane</strong> used on US roofs to prevent leaks caused by ice dams, wind-driven rain, and water pooling. Building codes in cold-climate zones require it at eaves — and many roofers apply it generously at all vulnerable points.</p>
<p>The calculator above accounts for <strong>roof pitch</strong> (which increases eave run up the slope), <strong>3 roll sizes</strong> with pricing, individual <strong>penetration counts</strong> (skylights, chimneys, vent pipes), and outputs rolls needed + material cost.</p>
<p>Estimate roofing with our <a href="/construction-calculators/roofing-calculator">roofing calculator</a>. Find your pitch with our <a href="/construction-calculators/roof-pitch-calculator">roof pitch calculator</a>. For decking, see our <a href="/construction-calculators/plywood-sheathing-calculator">plywood sheathing calculator</a>.</p>

<h2>Roll Sizes and Coverage</h2>
<table>
<thead><tr><th>Roll Size</th><th>Width</th><th>Length</th><th>Coverage</th><th>Avg Cost</th></tr></thead>
<tbody>
<tr><td><strong>3' × 75'</strong></td><td>36"</td><td>75 ft</td><td>225 sq ft</td><td>$110–$150</td></tr>
<tr><td><strong>3' × 67'</strong></td><td>36"</td><td>67 ft</td><td>200 sq ft</td><td>$90–$130</td></tr>
<tr><td><strong>3' × 36'</strong></td><td>36"</td><td>36 ft</td><td>108 sq ft</td><td>$50–$80</td></tr>
</tbody>
</table>
<p><strong>All rolls are 36" (3 ft) wide</strong> — designed to cover the code-minimum eave protection on most roof pitches. One roll of 3' × 75' covers approximately 50 linear feet of eave at 4/12 pitch.</p>

<h2>Where to Install Ice & Water Shield</h2>
<table>
<thead><tr><th>Location</th><th>Width/Coverage</th><th>Code Required?</th></tr></thead>
<tbody>
<tr><td><strong>Eaves</strong></td><td>24" past interior wall line (min)</td><td>Yes — IRC R905.1.2</td></tr>
<tr><td><strong>Valleys</strong></td><td>36" wide (18" each side of centerline)</td><td>Recommended</td></tr>
<tr><td><strong>Skylights</strong></td><td>36" around all sides (~16 sq ft each)</td><td>Recommended</td></tr>
<tr><td><strong>Chimneys</strong></td><td>36" around all sides (~24 sq ft each)</td><td>Recommended</td></tr>
<tr><td><strong>Vent pipes</strong></td><td>18" radius minimum (~4 sq ft each)</td><td>Recommended</td></tr>
<tr><td><strong>Wall/roof intersections</strong></td><td>Full length of intersection</td><td>Recommended</td></tr>
</tbody>
</table>
<p><strong>Best practice:</strong> Many US roofers install ice and water shield at ALL vulnerable points — not just code-minimum eaves. The material cost is modest compared to leak repair costs.</p>

<h2>Code Requirements by Climate</h2>
<ul>
<li><strong>Cold climates (IECC Zone 5+):</strong> IRC R905.1.2 requires ice barrier at eaves extending 24" past the exterior wall line. This includes most of the Northeast, Midwest, and Mountain states.</li>
<li><strong>Moderate climates (Zone 4):</strong> Required in areas where the mean January temperature is 25°F or below. Check local amendments.</li>
<li><strong>Warm climates (Zone 1–3):</strong> Not required by IRC, but recommended for valleys, low-slope sections, and penetrations. FL, TX, AZ, and CA rarely need eave protection.</li>
</ul>

<h2>How Roof Pitch Affects Eave Run</h2>
<p>The 24" code minimum is measured horizontally — but the membrane runs up the slope. A steeper pitch means more membrane length (and area) to reach 24" past the wall.</p>
<table>
<thead><tr><th>Pitch</th><th>3 ft Horizontal</th><th>Actual Run</th><th>% More</th></tr></thead>
<tbody>
<tr><td>2/12</td><td>3 ft</td><td>3.04 ft</td><td>+1.4%</td></tr>
<tr><td>4/12</td><td>3 ft</td><td>3.16 ft</td><td>+5.4%</td></tr>
<tr><td>6/12</td><td>3 ft</td><td>3.35 ft</td><td>+11.8%</td></tr>
<tr><td>8/12</td><td>3 ft</td><td>3.61 ft</td><td>+20.2%</td></tr>
<tr><td>12/12</td><td>3 ft</td><td>4.24 ft</td><td>+41.4%</td></tr>
</tbody>
</table>
<p><strong>At 12/12 pitch, you need 41% more membrane</strong> than on a flat roof for the same horizontal coverage. The calculator applies this automatically.</p>

<h2>Step-by-Step Estimation</h2>
<h3>Step 1: Calculate Eave Coverage</h3>
<p>Measure eave length (one side of roof). Both eaves need coverage, so double the length. Apply the pitch multiplier to the coverage width.</p>
<p><strong>Example:</strong> 40 ft eave × 2 sides × (3 ft × 1.054 at 4/12) = 40 × 2 × 3.16 = 253 sq ft</p>

<h3>Step 2: Add Valleys</h3>
<p>Each valley needs 36"-wide membrane for its full length. Number of valleys × length × 3 ft.</p>
<p><strong>Example:</strong> 2 valleys × 15 ft × 3 ft = 90 sq ft</p>

<h3>Step 3: Add Penetrations</h3>
<p>Skylights: ~16 sq ft each. Chimneys: ~24 sq ft each. Vent pipes: ~4 sq ft each.</p>

<h3>Step 4: Total and Roll Count</h3>
<p>Add all areas, add 10% for overlaps, divide by roll coverage.</p>
<p><strong>Example:</strong> 253 + 90 + 8 = 351 × 1.10 = 386 sq ft ÷ 225 = 2 rolls</p>

<h2>Top US Ice & Water Shield Products</h2>
<table>
<thead><tr><th>Brand</th><th>Product</th><th>Thickness</th><th>Avg Cost/Roll</th></tr></thead>
<tbody>
<tr><td><strong>Grace</strong></td><td>Ice & Water Shield</td><td>40 mil</td><td>$130–$160</td></tr>
<tr><td><strong>GAF</strong></td><td>WeatherWatch</td><td>40 mil</td><td>$90–$120</td></tr>
<tr><td><strong>CertainTeed</strong></td><td>WinterGuard</td><td>40 mil</td><td>$100–$130</td></tr>
<tr><td><strong>Owens Corning</strong></td><td>WeatherLock G</td><td>40 mil</td><td>$95–$125</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "Where do I need ice and water shield?", answer: "Code requires it at eaves: 24\" minimum past the exterior wall (IRC R905.1.2) in cold climates (Zone 5+). Also recommended at: all valleys (3 ft wide), around skylights (36\" each side), chimneys, vent pipes, dormers, and any roof-to-wall intersection. Many roofers apply it at all these locations regardless of climate." },
            { question: "How many rolls of ice and water shield?", answer: "Measure eave length × 2 sides × coverage width. Add valley length × 3 ft. Add penetration areas. Add 10% for overlaps. Divide by roll coverage (225 sq ft for 3'×75', 200 for 3'×67'). Example: 40 ft eave (both sides, 3 ft) + 2 valleys + 2 vents = 386 sq ft = 2 rolls." },
            { question: "What is ice and water shield?", answer: "A self-adhering, rubberized asphalt membrane (typically 40 mil thick) applied directly to roof decking before shingles. It creates a waterproof seal around nail holes and prevents leaks from ice dams, wind-driven rain, and standing water. Unlike synthetic underlayment, it self-seals around fastener penetrations." },
            { question: "How does roof pitch affect ice barrier?", answer: "The 24\" code minimum is measured horizontally, but the membrane runs up the slope. At 4/12 pitch, 3 ft of horizontal coverage requires 3.16 ft of membrane. At 12/12 pitch, it requires 4.24 ft — 41% more material. Always account for pitch when estimating." },
            { question: "Can I use ice and water shield on the entire roof?", answer: "Yes — 'full-deck' application is becoming common in cold climates and premium builds. It provides maximum waterproofing but costs $0.50–$1.50/sq ft more than synthetic underlayment alone. Some manufacturers void warranties if applied over the entire deck due to moisture trapping — check specs." },
            { question: "How long does ice and water shield last?", answer: "The membrane itself lasts 25–50+ years, typically outlasting the shingles above it. UV exposure degrades it, so it must be covered by roofing material within 30–90 days (varies by manufacturer). Once covered, it remains effective for the life of the roof." },
            { question: "What's the difference between ice barrier and synthetic underlayment?", answer: "Ice and water shield is self-adhering and self-sealing around nail holes — it creates a waterproof barrier. Synthetic underlayment is mechanically fastened and water-resistant but not waterproof at nail penetrations. Use ice barrier at vulnerable areas; synthetic underlayment covers the remaining deck." },
            { question: "Do I need ice barrier in warm climates?", answer: "IRC doesn't require it in Zones 1–3 (TX, FL, AZ, CA). However, it's still recommended for valleys, low-slope areas, and penetrations where water can pool. In hurricane zones, it provides excellent wind-driven rain protection. Check local codes — some coastal areas require it." },
            { question: "How do I install ice and water shield?", answer: "Apply directly to clean, dry roof decking. Start at the eave and work up, overlapping each row by 3–4 inches. Peel the release film as you go. Press firmly with a roller. Overlap end joints by 6 inches. Cut around penetrations and seal with additional pieces. Cover with roofing within 30–90 days." },
            { question: "How much does ice and water shield cost?", answer: "Material: $0.50–$0.75/sq ft ($90–$160 per roll depending on brand and size). Installation adds $0.25–$0.50/sq ft labor. For a typical home: 2–4 rolls at eaves + 1–2 rolls for valleys and penetrations = $200–$600 in material. Full-deck coverage: $800–$2,000 for a 1,500 sq ft roof." },
        ],
    },
    "metal-roofing-calculator": {
        subtitle: "Calculate metal roofing panels, screws, ridge cap, and cost. Choose from 5 panel types with roof pitch, gauge, and material pricing.",
        explanation: {
            heading: "Metal Roofing Material Estimation",
            paragraphs: [
                "Metal roofing panels come in five main types: standing seam (16\" coverage), corrugated (26\"), R-panel (36\"), metal shingle (48\"), and 5V crimp (24\"). Panels are typically cut to length from eave to ridge — no horizontal seams needed.",
                "Apply the roof pitch multiplier to footprint area for actual roof area. Panel count = roof width ÷ panel coverage width. Standing seam uses concealed clips (30 screws/square); exposed-fastener types use 75–80 screws/square.",
            ],
            highlight: "30 × 20 ft roof at 4/12 pitch: 632 sq ft × 1.10 waste = 695 sq ft. Standing seam: 15 panels, 210 screws, 20 ft ridge cap. At $10/sq ft = $6,950.",
        },
        contentHTML: `
<p>Metal roofing is the <strong>fastest-growing segment</strong> of the US residential roofing market, now installed on 17% of new homes (up from 5% in 2000). Metal roofs last 40–70 years — 2–3× longer than asphalt shingles — and offer superior wind resistance, fire resistance, and energy efficiency.</p>
<p>The calculator above supports <strong>5 panel types</strong> with auto-filled pricing, <strong>roof pitch multiplier</strong>, <strong>gauge selection</strong>, and detailed output including panels, screws, ridge cap, and total material cost.</p>
<p>Compare materials with our <a href="/construction-calculators/roofing-calculator">roofing calculator</a>. Find your pitch with our <a href="/construction-calculators/roof-pitch-calculator">roof pitch calculator</a>. For sheathing, see our <a href="/construction-calculators/plywood-sheathing-calculator">plywood sheathing calculator</a>.</p>

<h2>Metal Roofing Panel Types</h2>
<table>
<thead><tr><th>Panel Type</th><th>Coverage Width</th><th>Fastening</th><th>Screws/sq</th><th>Cost/sq ft</th><th>Lifespan</th></tr></thead>
<tbody>
<tr><td><strong>Standing Seam</strong></td><td>12"–18"</td><td>Concealed clips</td><td>~30</td><td>$8–$14</td><td>50–70 yrs</td></tr>
<tr><td><strong>Corrugated</strong></td><td>26"</td><td>Exposed screws</td><td>~80</td><td>$3–$6</td><td>40–60 yrs</td></tr>
<tr><td><strong>Ribbed / R-Panel</strong></td><td>36"</td><td>Exposed screws</td><td>~80</td><td>$4–$7</td><td>40–60 yrs</td></tr>
<tr><td><strong>Metal Shingle</strong></td><td>48" (interlocking)</td><td>Hidden nails</td><td>~60</td><td>$7–$12</td><td>50–70 yrs</td></tr>
<tr><td><strong>5V Crimp</strong></td><td>24"</td><td>Exposed screws</td><td>~75</td><td>$3.50–$6</td><td>40–60 yrs</td></tr>
</tbody>
</table>
<p><strong>Most popular:</strong> Standing seam dominates the premium residential market (concealed fasteners, clean lines). Corrugated and R-panel are most cost-effective for agricultural, commercial, and budget-conscious residential projects.</p>

<h2>Metal Gauge Guide</h2>
<p>Gauge measures metal thickness — <strong>lower gauge = thicker metal</strong>. Thicker gauge costs more but resists dents, wind, and hail better.</p>
<table>
<thead><tr><th>Gauge</th><th>Thickness</th><th>Best For</th><th>Cost Premium</th></tr></thead>
<tbody>
<tr><td><strong>29 ga</strong></td><td>0.014"</td><td>Budget sheds, carports</td><td>Least expensive</td></tr>
<tr><td><strong>26 ga</strong></td><td>0.019"</td><td>Standard residential</td><td>Baseline</td></tr>
<tr><td><strong>24 ga</strong></td><td>0.024"</td><td>Premium residential, high-wind</td><td>+15–25%</td></tr>
<tr><td><strong>22 ga</strong></td><td>0.030"</td><td>Commercial, industrial</td><td>+30–50%</td></tr>
</tbody>
</table>
<p><strong>Recommendation:</strong> 26 gauge is the US residential standard. Use 24 gauge in high-wind zones (coastal, tornado-prone) or areas with frequent hail. Never use 29 gauge for a primary residence.</p>

<h2>Step-by-Step Metal Roofing Estimation</h2>
<h3>Step 1: Calculate Roof Area</h3>
<p>Measure the building footprint and apply the <strong>pitch multiplier</strong>. Metal roofing requires minimum 3/12 pitch for most panel types (standing seam can go as low as ½/12).</p>
<p><strong>Example:</strong> 30 × 20 ft footprint at 4/12 pitch = 600 × 1.054 = 632 sq ft. Add 10% waste = 695 sq ft.</p>

<h3>Step 2: Calculate Panels</h3>
<p>Divide roof width by panel coverage width. Panels run vertically from eave to ridge — they're cut to match your roof length.</p>
<p><strong>Example:</strong> 20 ft wide ÷ 16" standing seam (1.33 ft) = 15 panels, each cut to 30 ft length.</p>

<h3>Step 3: Calculate Fasteners and Trim</h3>
<p>Screws per square (100 sq ft): standing seam ~30, exposed-fastener ~75–80. Ridge cap: 1 linear foot per foot of ridge. Add eave trim, gable trim, and closures.</p>

<h2>Metal vs. Asphalt Shingles</h2>
<table>
<thead><tr><th>Feature</th><th>Metal Roofing</th><th>Asphalt Shingles</th></tr></thead>
<tbody>
<tr><td><strong>Lifespan</strong></td><td>40–70 years</td><td>15–25 years</td></tr>
<tr><td><strong>Installed cost</strong></td><td>$8–$14/sq ft</td><td>$3–$7/sq ft</td></tr>
<tr><td><strong>Wind rating</strong></td><td>140–180 mph</td><td>60–130 mph</td></tr>
<tr><td><strong>Fire rating</strong></td><td>Class A (non-combustible)</td><td>Class A–C</td></tr>
<tr><td><strong>Energy savings</strong></td><td>25–40% cooling</td><td>Minimal</td></tr>
<tr><td><strong>Weight</strong></td><td>1–1.5 lbs/sq ft</td><td>2–4 lbs/sq ft</td></tr>
<tr><td><strong>Maintenance</strong></td><td>Very low</td><td>Moderate</td></tr>
</tbody>
</table>
<p><strong>Lifetime cost:</strong> Metal costs 2–3× more upfront but lasts 2–3× longer. Over 50 years, metal is typically <strong>cheaper than two asphalt roof replacements</strong>.</p>

<h2>2025 US Metal Roofing Cost Guide</h2>
<table>
<thead><tr><th>Type</th><th>Material/sq ft</th><th>Installed/sq ft</th><th>1,500 sq ft Roof</th></tr></thead>
<tbody>
<tr><td><strong>Corrugated</strong></td><td>$3–$5</td><td>$5–$8</td><td>$7,500–$12,000</td></tr>
<tr><td><strong>5V Crimp</strong></td><td>$3.50–$5</td><td>$6–$9</td><td>$9,000–$13,500</td></tr>
<tr><td><strong>R-Panel</strong></td><td>$4–$6</td><td>$6–$10</td><td>$9,000–$15,000</td></tr>
<tr><td><strong>Metal Shingle</strong></td><td>$7–$10</td><td>$10–$15</td><td>$15,000–$22,500</td></tr>
<tr><td><strong>Standing Seam</strong></td><td>$8–$12</td><td>$12–$18</td><td>$18,000–$27,000</td></tr>
</tbody>
</table>
<p><strong>Additional costs:</strong> Old roof tear-off: $1–$3/sq ft. Underlayment: $0.50–$1.50/sq ft. Trim/flashing: 10–15% of panel cost. Permits: $150–$500.</p>
`,
        faq: [
            { question: "How many metal roofing panels do I need?", answer: "Divide roof width by panel coverage width. Standing seam at 16\": 20 ft ÷ 1.33 ft = 15 panels. Corrugated at 26\": 20 ft ÷ 2.17 ft = 10 panels. R-panel at 36\": 20 ft ÷ 3 ft = 7 panels. Each panel is cut to your roof length (eave to ridge)." },
            { question: "How much does metal roofing cost?", answer: "Corrugated: $5–$8/sq ft installed (most affordable). R-panel: $6–$10/sq ft. Metal shingle: $10–$15/sq ft. Standing seam: $12–$18/sq ft (premium). A typical 1,500 sq ft roof: $7,500–$27,000 depending on panel type." },
            { question: "What gauge metal for a residential roof?", answer: "26 gauge is the US residential standard — good balance of durability and cost. Use 24 gauge in high-wind or hail-prone areas. Avoid 29 gauge for primary residences — it's too thin and dents easily. 22 gauge is commercial-grade and rarely needed for homes." },
            { question: "What minimum roof pitch for metal roofing?", answer: "Most exposed-fastener panels (corrugated, R-panel, 5V): minimum 3/12 pitch. Standing seam: can go as low as ½/12 (nearly flat) because concealed clips allow thermal expansion. Metal shingles: minimum 3/12. Always check manufacturer specifications." },
            { question: "How long does a metal roof last?", answer: "Corrugated/R-panel: 40–60 years. Standing seam: 50–70 years. Metal shingle: 50–70 years. Copper/zinc: 80–100+ years. Lifespan depends on gauge, coating (Kynar/PVDF lasts longest), installation quality, and climate. Metal outlasts asphalt 2–3×." },
            { question: "Standing seam vs corrugated — which is better?", answer: "Standing seam: concealed fasteners (no leak points), clean modern look, handles thermal expansion, lasts 50–70 years, but costs 2–3× more. Corrugated: exposed fasteners (need resealing every 10–15 years), traditional look, very affordable. Standing seam is premium; corrugated is value." },
            { question: "How many screws per square of metal roofing?", answer: "Standing seam: ~30 concealed clips per square (100 sq ft). Corrugated: ~80 exposed screws per square. R-panel: ~80 per square. 5V crimp: ~75 per square. Use self-drilling screws with EPDM rubber washers for exposed-fastener types." },
            { question: "Can I install metal roofing over shingles?", answer: "Yes — in most US jurisdictions, metal can be installed over one layer of asphalt shingles. This saves $1–$3/sq ft in tear-off costs. Install furring strips or battens for an air gap. Check local codes — some jurisdictions require tear-off. Never install over two layers of shingles." },
            { question: "Do metal roofs attract lightning?", answer: "No — metal roofs don't increase the probability of a lightning strike. Metal is non-combustible, so it's actually safer than wood or asphalt during a strike. Metal roofs disperse energy across the entire surface rather than concentrating it. No grounding is required by code." },
            { question: "What accessories do I need for a metal roof?", answer: "Ridge cap (ridge line coverage). Eave/drip edge trim. Gable/rake trim. Closure strips (foam seals for corrugated profiles). Pipe boots (for vent penetrations). Underlayment (synthetic preferred over felt). Butyl tape for standing seam. Touch-up paint for cut edges." },
        ],
    },
    "plywood-sheathing-calculator": {
        subtitle: "Calculate plywood or OSB sheathing sheets for roofs, walls, or subfloors. Choose sheathing type, roof pitch, and get weight and cost estimates.",
        explanation: {
            heading: "Plywood Sheathing Estimation",
            paragraphs: [
                "Standard sheathing is 4' × 8' (32 sq ft per sheet). For roofs, multiply the footprint area by the pitch multiplier to get actual roof area, then divide by 32. Add 10–15% for waste — more for complex roofs with hips and valleys.",
                "Common types: 7/16\" OSB for walls ($22/sheet), ½\" OSB or CDX for roofs ($26–30/sheet), and ¾\" T&G plywood for subfloors ($48/sheet). OSB is cheaper; CDX handles moisture better.",
            ],
            highlight: "A 30 × 20 ft roof at 4/12 pitch: 600 sq ft × 1.054 = 632 sq ft ÷ 32 = 20 sheets. With 10% waste: 22 sheets of ½\" OSB × $26 = $572.",
        },
        contentHTML: `
<p>Plywood and OSB sheathing form the structural substrate of <strong>US residential roofs, walls, and subfloors</strong>. Accurate sheet estimation prevents costly jobsite delays and excess material waste. The calculator above accounts for <strong>roof pitch multipliers</strong> — the often-overlooked factor that increases actual roof area compared to the flat footprint.</p>
<p>Choose from <strong>6 sheathing types</strong>, select your <strong>application</strong> (roof, wall, subfloor), pick the <strong>roof pitch</strong>, and get sheets, weight, and cost instantly.</p>
<p>Estimate roofing with our <a href="/construction-calculators/roofing-calculator">roofing calculator</a>. For general plywood, use our <a href="/construction-calculators/plywood-calculator">plywood calculator</a>. Find your pitch with our <a href="/construction-calculators/roof-pitch-calculator">roof pitch calculator</a>.</p>

<h2>Sheathing Types</h2>
<table>
<thead><tr><th>Type</th><th>Thickness</th><th>Weight (4×8)</th><th>Cost (4×8)</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>CDX Plywood ½"</strong></td><td>15/32" actual</td><td>~42 lbs</td><td>$28–$35</td><td>Roof sheathing (16" OC rafters)</td></tr>
<tr><td><strong>CDX Plywood ⅝"</strong></td><td>19/32" actual</td><td>~51 lbs</td><td>$35–$42</td><td>Roof sheathing (24" OC rafters)</td></tr>
<tr><td><strong>CDX Plywood ¾"</strong></td><td>23/32" actual</td><td>~60 lbs</td><td>$40–$50</td><td>Heavy roofs, snow loads, solar panels</td></tr>
<tr><td><strong>OSB 7/16"</strong></td><td>7/16" actual</td><td>~38 lbs</td><td>$18–$25</td><td>Wall sheathing, light-duty</td></tr>
<tr><td><strong>OSB ½"</strong></td><td>15/32" actual</td><td>~44 lbs</td><td>$22–$30</td><td>Roof and wall sheathing</td></tr>
<tr><td><strong>T&G Plywood ¾"</strong></td><td>23/32" actual</td><td>~62 lbs</td><td>$42–$55</td><td>Subfloor (tongue-and-groove)</td></tr>
</tbody>
</table>

<h2>Roof Pitch Multiplier Table</h2>
<p>A pitched roof has more surface area than its flat footprint. Multiply the footprint area by the <strong>pitch multiplier</strong> to get the actual roof area.</p>
<table>
<thead><tr><th>Roof Pitch</th><th>Multiplier</th><th>600 sq ft Footprint</th><th>Sheets (4×8)</th></tr></thead>
<tbody>
<tr><td><strong>Flat (0/12)</strong></td><td>1.000</td><td>600 sq ft</td><td>19</td></tr>
<tr><td><strong>2/12</strong></td><td>1.014</td><td>608 sq ft</td><td>19</td></tr>
<tr><td><strong>4/12</strong></td><td>1.054</td><td>632 sq ft</td><td>20</td></tr>
<tr><td><strong>6/12</strong></td><td>1.118</td><td>671 sq ft</td><td>21</td></tr>
<tr><td><strong>8/12</strong></td><td>1.202</td><td>721 sq ft</td><td>23</td></tr>
<tr><td><strong>10/12</strong></td><td>1.302</td><td>781 sq ft</td><td>25</td></tr>
<tr><td><strong>12/12 (45°)</strong></td><td>1.414</td><td>849 sq ft</td><td>27</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> A steeper pitch dramatically increases sheathing needs. A 12/12 pitch requires <strong>41% more sheets</strong> than a flat roof over the same footprint.</p>

<h2>Step-by-Step Sheathing Estimation</h2>
<h3>Step 1: Measure the Area</h3>
<p>For <strong>roofs:</strong> measure the building footprint (length × width). For a gable roof, this is the total footprint of both sides. For <strong>walls:</strong> measure perimeter × wall height. For <strong>subfloors:</strong> measure room length × width.</p>

<h3>Step 2: Apply Pitch Multiplier (Roofs Only)</h3>
<p>Multiply footprint by the pitch multiplier from the table above. Formula: Multiplier = √(1 + (pitch/12)²).</p>
<p><strong>Example:</strong> 30 ft × 20 ft = 600 sq ft × 1.054 (4/12) = 632 sq ft actual roof area.</p>

<h3>Step 3: Calculate Sheets</h3>
<p>Divide actual area by 32 sq ft (one 4×8 sheet). Add 10% waste for simple roofs, 15% for complex roofs with hips, valleys, and dormers.</p>
<p><strong>Example:</strong> 632 sq ft × 1.10 = 695 sq ft ÷ 32 = 21.7 → <strong>22 sheets</strong>.</p>

<h2>Plywood vs. OSB for Sheathing</h2>
<table>
<thead><tr><th>Feature</th><th>CDX Plywood</th><th>OSB</th></tr></thead>
<tbody>
<tr><td><strong>Cost</strong></td><td>$28–$50/sheet</td><td>$18–$30/sheet</td></tr>
<tr><td><strong>Moisture</strong></td><td>Better — dries quickly</td><td>Swells at edges when wet</td></tr>
<tr><td><strong>Nail holding</strong></td><td>Better at edges</td><td>Good in field, weaker at edges</td></tr>
<tr><td><strong>Uniformity</strong></td><td>May have voids</td><td>Very uniform (no voids)</td></tr>
<tr><td><strong>Weight</strong></td><td>Slightly lighter</td><td>Slightly heavier (same thickness)</td></tr>
<tr><td><strong>Code approval</strong></td><td>Yes</td><td>Yes</td></tr>
</tbody>
</table>
<p><strong>Recommendation:</strong> Both are code-approved for structural sheathing. Use CDX plywood in moisture-prone areas (bathrooms, kitchens, coastal climates). Use OSB to save 20–30% on material cost where moisture isn't a concern.</p>

<h2>Sheathing by Application</h2>
<table>
<thead><tr><th>Application</th><th>Recommended</th><th>Min Thickness</th><th>Spacing</th></tr></thead>
<tbody>
<tr><td><strong>Roof (16" OC)</strong></td><td>CDX ½" or OSB ½"</td><td>7/16"</td><td>⅛" gap between sheets</td></tr>
<tr><td><strong>Roof (24" OC)</strong></td><td>CDX ⅝" or OSB ⅝"</td><td>½"</td><td>⅛" gap between sheets</td></tr>
<tr><td><strong>Wall</strong></td><td>OSB 7/16" or CDX ½"</td><td>7/16"</td><td>⅛" gap, stagger joints</td></tr>
<tr><td><strong>Subfloor (16" OC)</strong></td><td>CDX ¾" or T&G ¾"</td><td>⅝"</td><td>T&G eliminates gaps</td></tr>
<tr><td><strong>Subfloor (24" OC)</strong></td><td>T&G ¾" or CDX ¾"</td><td>¾"</td><td>Glue + screw recommended</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "Should I use plywood or OSB for sheathing?", answer: "Both are code-approved. OSB is 20–30% cheaper and more uniform (no core voids). CDX plywood handles moisture better, dries faster, and holds nails better at edges. For roofs in dry climates: OSB saves money. For moisture-prone areas: use CDX plywood." },
            { question: "What thickness plywood for a roof?", answer: "Minimum 7/16\" OSB or ½\" plywood for 16\" OC rafter spacing. Use ⅝\" for 24\" OC spacing. Use ¾\" for heavy snow loads, tile roofs, or solar panel installations. Always check local building codes — they may require thicker sheathing in your area." },
            { question: "What is a roof pitch multiplier?", answer: "The pitch multiplier converts flat footprint area to actual roof surface area. Formula: √(1 + (pitch/12)²). A 4/12 pitch = 1.054× (5.4% more area). A 12/12 pitch = 1.414× (41% more area). Always apply this multiplier before calculating sheets." },
            { question: "How many sheets of plywood for a 1,500 sq ft roof?", answer: "At 4/12 pitch: 1,500 × 1.054 = 1,581 sq ft ÷ 32 = 50 sheets. With 10% waste: 55 sheets. At 8/12 pitch: 1,500 × 1.202 = 1,803 sq ft ÷ 32 = 57 sheets. With 10% waste: 63 sheets." },
            { question: "How much does sheathing weigh?", answer: "½\" CDX: ~42 lbs/sheet. ½\" OSB: ~44 lbs/sheet. ⅝\" CDX: ~51 lbs/sheet. ¾\" CDX: ~60 lbs/sheet. A typical roof with 55 sheets of ½\" OSB = ~2,420 lbs total. Factor this into structural load calculations." },
            { question: "Do I need to leave gaps between sheathing panels?", answer: "Yes — leave ⅛\" (3mm) gap between all panels to allow for thermal expansion. Without gaps, panels can buckle in hot weather, causing visible bumps under roofing material. Use panel edge clips (H-clips) between rafters for ½\" and thinner sheathing." },
            { question: "How much waste should I add?", answer: "10% for simple gable roofs. 15% for hip roofs or roofs with multiple valleys. 15–20% for complex roofs with dormers, turrets, or mixed pitch. Waste is higher on roofs because of angle cuts at hips, valleys, and edges that create unusable small pieces." },
            { question: "What are H-clips for roof sheathing?", answer: "H-clips are small metal clips placed between panel edges at midspan between rafters. They support unsupported panel edges and prevent deflection under foot traffic and loads. Required by code for sheathing ½\" and thinner when rafter spacing is 24\" OC." },
            { question: "How do I install roof sheathing?", answer: "Start at the bottom corner. Stagger joints by at least 4 feet between rows. Leave ⅛\" gaps. Use 8d common nails or #8 screws, 6\" OC at edges and 12\" OC in the field. Install H-clips at midspan. Work from the eave to the ridge. Always follow local codes." },
            { question: "Can I use sheathing as a finished floor?", answer: "No — sheathing is a structural substrate, not a finished surface. CDX and OSB have rough surfaces and no aesthetic finish. For visible applications, use sanded plywood (AC or BC grade). For subfloors, the sheathing is always covered with a finished flooring material." },
        ],
    },
    "roof-snow-load-calculator": {
        subtitle: "Calculate snow weight on your roof. Choose snow type and roof pitch, compare against design load capacity, and check structural safety.",
        explanation: {
            heading: "Roof Snow Load Calculation",
            paragraphs: [
                "Snow load (PSF) = snow density × depth in inches. Fresh snow: ~1.25 PSF/inch. Settled: ~2 PSF/inch. Packed: ~3 PSF/inch. Wet/heavy: ~5 PSF/inch. The calculator accounts for roof pitch — steeper roofs accumulate more area but snow slides off faster.",
                "Most US residential roofs are designed for 20–40 PSF ground snow load. The calculator compares your snow load against your roof's design capacity and shows a structural warning if exceeded.",
            ],
            highlight: "12 in of packed snow on a 30 × 20 ft roof at 4/12 pitch: 632 sq ft × 37.5 PSF = 23,700 lbs (11.85 tons). At 30 PSF design load: 125% capacity — ⚠️ OVERLOADED.",
        },
        contentHTML: `
<p>Roof snow load is the <strong>weight of accumulated snow</strong> pressing down on your roof structure. In the US, snow-related roof collapses cause millions of dollars in damage annually — particularly during heavy winter storms in the Midwest, Northeast, and Mountain states. Understanding your roof's snow load capacity and monitoring accumulation is critical for <strong>structural safety</strong>.</p>
<p>The calculator above supports <strong>6 snow types</strong> with density values, <strong>roof pitch adjustment</strong>, and a <strong>structural capacity check</strong> that compares current snow load against your roof's design load — displaying a clear warning when capacity is exceeded.</p>
<p>Find your pitch with our <a href="/construction-calculators/roof-pitch-calculator">roof pitch calculator</a>. Estimate roofing with our <a href="/construction-calculators/roofing-calculator">roofing calculator</a>. Size rafters with our <a href="/construction-calculators/lumber-calculator">lumber calculator</a>.</p>

<h2>Snow Density Table</h2>
<p>Snow weight varies dramatically based on moisture content and age. The same depth of fresh powder weighs 4× less than wet heavy snow.</p>
<table>
<thead><tr><th>Snow Type</th><th>Density (lb/ft³)</th><th>PSF/inch</th><th>12" Depth = PSF</th></tr></thead>
<tbody>
<tr><td><strong>Fresh / Light Powder</strong></td><td>3–5</td><td>1.25</td><td>15 PSF</td></tr>
<tr><td><strong>Settled (few days)</strong></td><td>5–10</td><td>2.08</td><td>25 PSF</td></tr>
<tr><td><strong>Wind-Packed</strong></td><td>10–15</td><td>3.13</td><td>37.5 PSF</td></tr>
<tr><td><strong>Granular / Old</strong></td><td>12–18</td><td>3.75</td><td>45 PSF</td></tr>
<tr><td><strong>Wet / Heavy</strong></td><td>15–25</td><td>5.20</td><td>62.4 PSF</td></tr>
<tr><td><strong>Ice Crust</strong></td><td>30–57</td><td>4.69</td><td>56.3 PSF</td></tr>
</tbody>
</table>
<p><strong>Key insight:</strong> Snow on a roof often has <strong>multiple layers</strong> — fresh on top, packed/ice below. Use the heaviest type present for a conservative estimate, or calculate each layer separately and add them.</p>

<h2>Step-by-Step Snow Load Calculation</h2>
<h3>Step 1: Calculate Snow Volume</h3>
<p>Measure the roof footprint (length × width). Apply the <strong>roof pitch multiplier</strong> to get actual surface area. Multiply by snow depth (in feet) for volume in cubic feet.</p>
<p><strong>Example:</strong> 30 × 20 ft at 4/12 pitch = 632 sq ft × 1 ft depth = 632 cu ft of snow.</p>

<h3>Step 2: Determine Snow Density</h3>
<p>Identify the snow type. Fresh powder: ~1.25 PSF/inch. Packed: ~3.13 PSF/inch. Wet: ~5.2 PSF/inch. When unsure, use <strong>packed (3.13)</strong> as a conservative middle estimate.</p>

<h3>Step 3: Calculate Total Load</h3>
<p>Snow Load (PSF) = density (PSF/inch) × depth (inches). Total Weight = PSF × roof area.</p>
<p><strong>Example:</strong> Packed snow, 12 inches: 3.13 × 12 = <strong>37.5 PSF</strong> × 632 sq ft = <strong>23,700 lbs (11.85 tons)</strong>.</p>

<h2>US Regional Design Snow Loads</h2>
<p>Building codes specify <strong>ground snow load</strong> (Pg) for each region. Roof snow load is typically 70% of ground load (per ASCE 7). Actual design load depends on exposure, terrain, and building importance.</p>
<table>
<thead><tr><th>Region</th><th>Ground Snow Load</th><th>Roof Design Load</th><th>Examples</th></tr></thead>
<tbody>
<tr><td><strong>South / Gulf</strong></td><td>0–5 PSF</td><td>0–5 PSF</td><td>TX, FL, LA, AZ</td></tr>
<tr><td><strong>Mid-Atlantic</strong></td><td>15–30 PSF</td><td>10–21 PSF</td><td>VA, NC, PA, NJ</td></tr>
<tr><td><strong>Midwest</strong></td><td>20–40 PSF</td><td>14–28 PSF</td><td>OH, IN, IL, MO</td></tr>
<tr><td><strong>Northeast</strong></td><td>30–70 PSF</td><td>21–49 PSF</td><td>NY, VT, NH, ME</td></tr>
<tr><td><strong>Mountain / Rockies</strong></td><td>40–100+ PSF</td><td>28–70+ PSF</td><td>CO, MT, UT, WY</td></tr>
</tbody>
</table>
<p><strong>Important:</strong> These are approximate ranges. Your specific design load is determined by local building codes, elevation, and exposure category. Check with your building department for the exact value for your location.</p>

<h2>Roof Pitch and Snow</h2>
<p>Steeper roofs shed snow more easily but have more surface area. The <strong>pitch factor</strong> affects load calculation in two ways:</p>
<ul>
<li><strong>Area increase:</strong> A 12/12 pitch has 41% more surface area than a flat roof</li>
<li><strong>Snow shedding:</strong> Roofs steeper than 6/12 shed snow faster, reducing accumulation</li>
<li><strong>Code adjustment:</strong> ASCE 7 allows reduced snow loads for pitches above 30° (7/12) — called the "slope factor" (Cs)</li>
</ul>
<p>The calculator uses the pitch multiplier for area but does not apply the slope reduction factor — giving you a <strong>conservative (worst-case) estimate</strong>.</p>

<h2>Warning Signs of Snow Overload</h2>
<table>
<thead><tr><th>Warning Sign</th><th>Severity</th><th>Action</th></tr></thead>
<tbody>
<tr><td>Doors/windows sticking</td><td>Early</td><td>Monitor closely</td></tr>
<tr><td>New cracks in drywall</td><td>Moderate</td><td>Plan snow removal</td></tr>
<tr><td>Ceiling sagging</td><td>Serious</td><td>Remove snow immediately</td></tr>
<tr><td>Popping/cracking sounds</td><td>Critical</td><td>Evacuate, call professional</td></tr>
<tr><td>Visible roof deflection</td><td>Emergency</td><td>Evacuate immediately</td></tr>
</tbody>
</table>
`,
        faq: [
            { question: "How much snow can a roof hold?", answer: "Most US residential roofs are designed for 20–40 PSF. That equals: 16–32 inches of fresh powder, 6–13 inches of packed snow, or 4–8 inches of wet/heavy snow. Mountain/Northeast homes may be rated for 50–100+ PSF. Always check your local building code for your specific design load." },
            { question: "When should I remove snow from my roof?", answer: "Remove when depth exceeds 2 feet of fresh powder, 1 foot of packed snow, or 6 inches of wet/heavy snow — or whenever load approaches 75% of design capacity. Use a roof rake from the ground — never climb on a snow-covered roof. Call a professional for large accumulations or ice dams." },
            { question: "What is PSF (pounds per square foot)?", answer: "PSF is the unit for snow load — the weight per square foot of roof area. To calculate: snow density (PSF/inch) × depth (inches) = PSF. Example: 12 inches of packed snow = 3.13 × 12 = 37.5 PSF. Most residential roofs are designed for 20–40 PSF." },
            { question: "How do I find my roof's design snow load?", answer: "Check your original building plans or contact your local building department. It's based on ASCE 7 ground snow load maps + your elevation, exposure category, and building importance factor. Alternative: hire a structural engineer for an assessment ($300–$600)." },
            { question: "Does roof pitch affect snow load?", answer: "Yes — in two ways. Steeper roofs have more surface area (12/12 = 41% more), but snow slides off faster. ASCE 7 allows reduced snow load for pitches above 7/12 (30°). For safety, the calculator uses the conservative full-area calculation without slope reduction." },
            { question: "What's the difference between ground and roof snow load?", answer: "Ground snow load (Pg) is the weight on flat ground — measured by weather services. Roof snow load is typically 70% of ground load (factor of 0.7) per ASCE 7, because wind blows some snow off roofs. However, valleys and drift zones can exceed ground load." },
            { question: "How heavy is wet snow vs dry snow?", answer: "Fresh powder: ~1.25 PSF/inch (lightest). Packed: ~3.13 PSF/inch (3× heavier). Wet/heavy: ~5.2 PSF/inch (4× heavier than fresh). Ice: ~4.69 PSF/inch. One foot of wet snow weighs as much as 4 feet of fresh powder." },
            { question: "What causes roof collapses from snow?", answer: "Ice dams that block drainage, causing ponding. Rain-on-snow events that dramatically increase weight. Unbalanced loads from drifting. Multiple storms without melting. Flat or low-slope roofs that don't shed snow. Older buildings not designed for current snow loads." },
            { question: "How do I safely remove snow from a roof?", answer: "Use a telescoping roof rake from the ground. Work from the eave up, removing 2–3 feet at a time. Never use a ladder on ice. Never use salt, hot water, or flame — all damage shingles. Leave 2–3 inches of snow to protect shingles from rake damage. For flat roofs, hire a professional." },
            { question: "Do ice dams affect snow load?", answer: "Yes — ice dams form at the eave, trapping meltwater behind them. This ponding water adds significant weight: water weighs 62.4 lbs/cu ft, much heavier than even packed snow. Ice dams are caused by heat loss through the roof. Address by improving attic insulation and ventilation." },
        ],
    },
    "roofing-material-calculator": {
        subtitle: "Calculate complete roofing materials: shingles, underlayment, nails, ridge cap, drip edge, and flashing for a full job.",
        explanation: {
            heading: "Complete Roofing Material List",
            paragraphs: [
                "Roofing squares: total area (with waste) ÷ 100. Each square needs 3 bundles of shingles, 1.5 lbs of roofing nails, and coverage from underlayment rolls. Add 15% waste for a typical gable roof, 20% for hip roofs.",
                "Don't forget accessories: ridge cap shingles (one per 10\" of ridge), drip edge (one 10' piece per 10 feet of eave and rake), and flashing for valleys, walls, and penetrations.",
            ],
            highlight: "30 × 20 ft roof + 15% waste = 6.9 squares = 21 bundles of shingles, 1 roll underlayment, 11 lbs nails, 38 ridge caps, 10 drip edge pieces.",
        },
        faq: [
            { question: "How many bundles of shingles per square?", answer: "3 bundles = 1 square (100 sq ft). Some architectural/designer shingles may require 4–5 bundles per square. Always check the manufacturer's coverage specifications." },
            { question: "How many squares is my roof?", answer: "Measure footprint area, then multiply by pitch factor: 4/12 pitch = ×1.054, 6/12 = ×1.118, 8/12 = ×1.202, 10/12 = ×1.302, 12/12 = ×1.414. Add 15% for waste on a gable roof." },
        ],
    },
    "clapboard-siding-calculator": {
        subtitle: "Calculate clapboard or lap siding boards, courses, linear feet, and cost. Choose from 5 board materials with exposure, overlap, and gable area support.",
        explanation: {
            heading: "Clapboard & Lap Siding Estimation",
            paragraphs: [
                "Clapboard siding is installed horizontally with each board overlapping the one below. The visible portion is called the 'exposure' — typically board width minus 1–1.5 inches of overlap. Courses (rows) = wall height in inches ÷ exposure in inches.",
                "Total boards = courses × boards per course (wall length ÷ board length). Standard board lengths: 8', 10', 12', and 16'. Add 10% for straight walls and 15–20% for gable walls due to angle cuts.",
            ],
            highlight: "A 40 × 9 ft wall with 6\" cedar boards (4.75\" exposure) and 12' lengths: 23 courses × 4 boards = 92 boards. With 10% waste: 102 boards = 1,224 lin ft. At $2.50/lf = $3,060.",
        },
        contentHTML: `
<p>Clapboard (also called lap, bevel, or weatherboard siding) is one of the most iconic <strong>American home exterior styles</strong>, dating back to Colonial New England. Modern clapboard siding is available in natural wood, fiber cement, engineered wood, and composite materials — each with different exposure, overlap, and cost characteristics.</p>
<p>The calculator above supports <strong>5 board materials</strong> with auto-filled pricing, adjustable <strong>board width and overlap</strong>, multiple board lengths, <strong>gable area</strong> input, individual window/door counts, and outputs <strong>courses, boards, linear feet, and cost</strong>.</p>
<p>Compare siding with our <a href="/construction-calculators/siding-material-calculator">siding material calculator</a>. For vinyl, see our <a href="/construction-calculators/vinyl-siding-calculator">vinyl siding calculator</a>. Measure wall area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>Board Material Comparison</h2>
<table>
<thead><tr><th>Material</th><th>Common Width</th><th>Exposure</th><th>Cost/lin ft</th><th>Lifespan</th></tr></thead>
<tbody>
<tr><td><strong>Western Red Cedar</strong></td><td>6"</td><td>4.75"</td><td>$2.00–$3.50</td><td>30–50 yrs</td></tr>
<tr><td><strong>Fiber Cement (HardiePlank)</strong></td><td>8.25"</td><td>7"</td><td>$1.50–$2.50</td><td>30–50 yrs</td></tr>
<tr><td><strong>Pine / Spruce (primed)</strong></td><td>6"</td><td>4.75"</td><td>$0.80–$1.60</td><td>15–25 yrs</td></tr>
<tr><td><strong>Engineered Wood (LP SmartSide)</strong></td><td>8"</td><td>6.75"</td><td>$1.20–$2.00</td><td>25–50 yrs</td></tr>
<tr><td><strong>Composite / PVC</strong></td><td>8"</td><td>6.75"</td><td>$2.50–$4.00</td><td>30–50+ yrs</td></tr>
</tbody>
</table>
<p><strong>Most popular:</strong> Fiber cement (HardiePlank) dominates the US lap siding market — it's fire-resistant, termite-proof, and mimics the look of real wood. Western Red Cedar remains the premium natural-wood choice for its dimensional stability and natural decay resistance.</p>

<h2>Understanding Exposure and Overlap</h2>
<p><strong>Board width</strong> = the full width of the siding plank. <strong>Overlap</strong> = the hidden portion covered by the board above (typically 1"–1½"). <strong>Exposure</strong> = the visible portion = board width − overlap.</p>
<ul>
<li><strong>6" board, 1.25" overlap → 4.75" exposure</strong> (standard for cedar)</li>
<li><strong>8" board, 1.25" overlap → 6.75" exposure</strong> (standard for fiber cement)</li>
<li><strong>10" board, 1.5" overlap → 8.5" exposure</strong> (wider profile)</li>
</ul>
<p><strong>Important:</strong> Minimum overlap of 1" is required for water resistance. In high-wind zones, 1.5" or more is recommended. Always follow manufacturer specifications for your climate.</p>

<h2>Step-by-Step Clapboard Estimation</h2>
<h3>Step 1: Calculate Courses (Rows)</h3>
<p>Convert wall height to inches. Divide by the exposure in inches. Round up to the nearest whole number.</p>
<p><strong>Example:</strong> 9 ft wall = 108 in ÷ 4.75" exposure = 22.7 → <strong>23 courses</strong></p>

<h3>Step 2: Calculate Boards per Course</h3>
<p>Divide wall length by board length. Round up.</p>
<p><strong>Example:</strong> 40 ft wall ÷ 12 ft boards = 3.33 → <strong>4 boards per course</strong></p>

<h3>Step 3: Total Boards and Linear Feet</h3>
<p>Boards = courses × boards per course. Linear feet = total boards × board length.</p>
<p><strong>Example:</strong> 23 courses × 4 boards = 92 boards = 1,104 lin ft</p>

<h3>Step 4: Add Waste</h3>
<p>Add <strong>10% for rectangular walls</strong>. Add <strong>15–20% for gable walls</strong> (angle cuts produce more waste). Add <strong>5% extra if boards have knots</strong> or defects to cull.</p>

<h2>Gable Walls</h2>
<p>Gable walls are triangular. To estimate boards: calculate courses using the same exposure, multiply by the gable width, then <strong>divide by 2</strong> (since each successive course gets shorter). Add 15–20% waste for the angle cuts.</p>
<p><strong>Example:</strong> A 30 ft × 8 ft gable at 4.75" exposure: 21 courses × 30 ft ÷ 2 = 315 lin ft + 20% waste = 378 lin ft.</p>

<h2>Common Board Sizes</h2>
<table>
<thead><tr><th>Nominal Width</th><th>Actual Width</th><th>Typical Exposure</th><th>Lengths Available</th></tr></thead>
<tbody>
<tr><td>4"</td><td>3.5"</td><td>2.25"–2.5"</td><td>8', 10', 12'</td></tr>
<tr><td>6"</td><td>5.5"</td><td>4.25"–4.75"</td><td>8', 10', 12', 16'</td></tr>
<tr><td>8"</td><td>7.25"–8.25"</td><td>6"–7"</td><td>8', 10', 12', 16'</td></tr>
<tr><td>10"</td><td>9.25"</td><td>7.75"–8.5"</td><td>8', 12', 16'</td></tr>
<tr><td>12"</td><td>11.25"</td><td>9.75"–10.5"</td><td>8', 12', 16'</td></tr>
</tbody>
</table>

<h2>2025 US Clapboard Cost Guide</h2>
<table>
<thead><tr><th>Material</th><th>Material/lin ft</th><th>Installed/sq ft</th><th>1,200 sq ft Home</th></tr></thead>
<tbody>
<tr><td><strong>Pine (primed)</strong></td><td>$0.80–$1.60</td><td>$4–$7</td><td>$4,800–$8,400</td></tr>
<tr><td><strong>Fiber Cement</strong></td><td>$1.50–$2.50</td><td>$6–$10</td><td>$7,200–$12,000</td></tr>
<tr><td><strong>Engineered Wood</strong></td><td>$1.20–$2.00</td><td>$5–$9</td><td>$6,000–$10,800</td></tr>
<tr><td><strong>Cedar</strong></td><td>$2.00–$3.50</td><td>$8–$14</td><td>$9,600–$16,800</td></tr>
<tr><td><strong>Composite / PVC</strong></td><td>$2.50–$4.00</td><td>$10–$16</td><td>$12,000–$19,200</td></tr>
</tbody>
</table>
<p><strong>Labor:</strong> Professional installation typically runs $3–$6/sq ft for clapboard siding. Total installed cost ranges from $7–$20/sq ft depending on material and home complexity.</p>
`,
        faq: [
            { question: "What is clapboard siding?", answer: "Clapboard (also called lap, bevel, or weatherboard siding) consists of horizontal boards installed from bottom to top, with each board overlapping the one below. The overlapping design sheds water away from the wall. It's available in cedar, fiber cement, pine, engineered wood, and composite." },
            { question: "What is the standard exposure for clapboard siding?", answer: "Exposure depends on board width. 6\" board: 4.25\"–4.75\" exposure. 8\" board: 6\"–7\" exposure. 10\" board: 7.75\"–8.5\" exposure. The overlap (hidden portion) should be at least 1\"–1.5\" for water protection. Follow manufacturer specs for your specific material." },
            { question: "How do I calculate courses of siding?", answer: "Convert wall height to inches, divide by board exposure in inches, and round up. Example: 9 ft wall = 108\" ÷ 4.75\" exposure = 22.7 → 23 courses. Adjust exposure slightly so the top course isn't too short — 108\" ÷ 23 = 4.70\" adjusted exposure." },
            { question: "How much waste should I add?", answer: "10% for rectangular walls with few windows. 15% for walls with multiple windows and doors. 15–20% for gable walls (angle cuts). 5% extra if using natural wood with possible knot defects. Always order extra for future repairs from the same lot." },
            { question: "Cedar or fiber cement — which is better?", answer: "Cedar: natural beauty, lightweight, easy to cut, naturally rot-resistant, but requires staining every 3–5 years. Fiber cement (HardiePlank): fire-resistant, termite-proof, holds paint 15+ years, but heavier and requires professional cutting tools. Fiber cement has a lower lifetime maintenance cost." },
            { question: "How do I estimate gable walls?", answer: "A gable is triangular. Calculate courses using the same exposure. Multiply courses × gable width, then divide by 2 (each course is progressively shorter). Add 15–20% waste for angle cuts. Example: 30 ft wide × 8 ft tall gable at 4.75\" exposure: 21 courses × 30 ft ÷ 2 = 315 lin ft + 20% = 378 lin ft." },
            { question: "What board length should I use?", answer: "12 ft is the most common and easiest to handle. 16 ft reduces butt joints (seams) but is harder to manage alone. 8 ft is lightweight but creates many seams. Use longer boards on long walls to minimize joints — each butt joint is a potential water entry point." },
            { question: "How many linear feet of siding do I need?", answer: "Multiply courses × boards per course × board length. Example: 23 courses × 4 boards per course × 12 ft = 1,104 lin ft. Add 10% waste = 1,214 lin ft. Divide by board length to get total boards: 1,214 ÷ 12 = 102 boards." },
            { question: "Do I need to keep siding off the ground?", answer: "Yes — maintain a minimum 6\" gap between the bottom of the siding and the ground. This prevents moisture wicking, insect entry, and splash-back damage. Use a starter strip at the bottom to angle the first course correctly." },
            { question: "Can I install clapboard siding myself?", answer: "Yes — clapboard is one of the more DIY-friendly siding types, especially cedar and pine. Fiber cement requires a diamond blade for cutting and produces harmful silica dust. For a professional-looking job, invest in a story pole (layout gauge), pneumatic nailer, and quality caulk." },
        ],
    },
    "siding-material-calculator": {
        subtitle: "Calculate siding squares for any home exterior. Choose from 6 siding types, account for gables, windows, and doors, and get weight and cost estimates.",
        explanation: {
            heading: "Siding Material Estimation",
            paragraphs: [
                "Siding is measured in 'squares' — 1 square = 100 sq ft. Calculate gross wall area (perimeter × height + gable area), subtract openings (windows ~15 sq ft each, doors ~21 sq ft each), then add 10% for waste.",
                "Average house has 15–20% openings. A typical 1,500 sq ft home with 9 ft walls has about 1,350 sq ft of gross wall area, minus 200–270 sq ft of openings = 10–12 squares of siding needed.",
            ],
            highlight: "150 ft perimeter × 9 ft height + 100 sq ft gables = 1,450 sq ft gross. Minus 8 windows + 2 doors (162 sq ft) = 1,288 sq ft net + 10% waste = 14.2 squares.",
        },
        contentHTML: `
<p>Siding protects your home's exterior from weather, insects, and moisture while defining its curb appeal. Choosing the right siding material and accurately estimating quantities are critical steps in any <strong>US home exterior project</strong> — whether it's new construction, re-siding, or partial repairs.</p>
<p>The calculator above supports <strong>6 siding types</strong> with auto-filled cost per square, <strong>gable area input</strong>, individual <strong>window and door counts</strong> (auto-deducted at standard sizes), adjustable waste factor, and <strong>weight estimation</strong> for structural and delivery planning.</p>
<p>For vinyl, see our <a href="/construction-calculators/vinyl-siding-calculator">vinyl siding calculator</a>. For clapboard, try our <a href="/construction-calculators/clapboard-siding-calculator">clapboard siding calculator</a>. Measure wall area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>Siding Types Comparison</h2>
<table>
<thead><tr><th>Type</th><th>Material/sq</th><th>Installed/sq ft</th><th>Weight/sq</th><th>Lifespan</th></tr></thead>
<tbody>
<tr><td><strong>Vinyl</strong></td><td>$100–$200</td><td>$3–$8</td><td>~60 lbs</td><td>20–40 yrs</td></tr>
<tr><td><strong>Fiber Cement (HardiePlank)</strong></td><td>$250–$450</td><td>$6–$11</td><td>~300 lbs</td><td>30–50 yrs</td></tr>
<tr><td><strong>Wood / Cedar</strong></td><td>$300–$500</td><td>$8–$14</td><td>~200 lbs</td><td>20–40 yrs</td></tr>
<tr><td><strong>Engineered Wood (LP SmartSide)</strong></td><td>$200–$350</td><td>$5–$10</td><td>~180 lbs</td><td>25–50 yrs</td></tr>
<tr><td><strong>Metal / Aluminum</strong></td><td>$200–$400</td><td>$5–$10</td><td>~50 lbs</td><td>40–50 yrs</td></tr>
<tr><td><strong>Stone Veneer</strong></td><td>$600–$1,000</td><td>$15–$30</td><td>~800 lbs</td><td>50+ yrs</td></tr>
</tbody>
</table>
<p><strong>Most popular in the US:</strong> Vinyl leads with ~33% market share (affordable, low maintenance). Fiber cement (James Hardie) is fastest-growing (fire-resistant, durable). Engineered wood (LP SmartSide) is gaining popularity as a wood-look alternative with better durability.</p>

<h2>Step-by-Step Siding Estimation</h2>
<h3>Step 1: Measure Wall Area</h3>
<p>Measure the <strong>perimeter</strong> of the house and the <strong>wall height</strong> (ground to eave). Multiply to get rectangular wall area.</p>
<p><strong>Example:</strong> 150 ft perimeter × 9 ft height = 1,350 sq ft</p>

<h3>Step 2: Add Gable Area</h3>
<p>Gable walls are triangular. Measure <strong>width</strong> and <strong>height</strong> (from eave to peak). Area = ½ × width × height. Add all gable areas together.</p>
<p><strong>Example:</strong> Two gables at 30 ft wide × 6 ft tall = 2 × (½ × 30 × 6) = 180 sq ft</p>

<h3>Step 3: Subtract Openings</h3>
<p>Deduct window and door areas from the gross total:</p>
<table>
<thead><tr><th>Opening</th><th>Typical Size</th><th>Area</th></tr></thead>
<tbody>
<tr><td><strong>Standard window</strong></td><td>3 ft × 5 ft</td><td>15 sq ft</td></tr>
<tr><td><strong>Large window</strong></td><td>4 ft × 5 ft</td><td>20 sq ft</td></tr>
<tr><td><strong>Entry door</strong></td><td>3 ft × 7 ft</td><td>21 sq ft</td></tr>
<tr><td><strong>Sliding glass door</strong></td><td>6 ft × 7 ft</td><td>42 sq ft</td></tr>
<tr><td><strong>Garage door (single)</strong></td><td>9 ft × 7 ft</td><td>63 sq ft</td></tr>
<tr><td><strong>Garage door (double)</strong></td><td>16 ft × 7 ft</td><td>112 sq ft</td></tr>
</tbody>
</table>
<p>The calculator uses 15 sq ft per window and 21 sq ft per door as standard estimates.</p>

<h3>Step 4: Add Waste</h3>
<p>Add <strong>10% for simple rectangular homes</strong>. Add <strong>15% for homes with many corners, dormers, or complex trim</strong>. Divide total by 100 to get <strong>squares</strong>.</p>

<h2>2025 US Siding Cost Guide</h2>
<table>
<thead><tr><th>Siding Type</th><th>Material Only (per sq)</th><th>Installed (per sq ft)</th><th>~2,000 sq ft Home</th></tr></thead>
<tbody>
<tr><td><strong>Vinyl</strong></td><td>$100–$200</td><td>$3–$8</td><td>$4,500–$12,000</td></tr>
<tr><td><strong>Fiber Cement</strong></td><td>$250–$450</td><td>$6–$11</td><td>$9,000–$16,500</td></tr>
<tr><td><strong>Engineered Wood</strong></td><td>$200–$350</td><td>$5–$10</td><td>$7,500–$15,000</td></tr>
<tr><td><strong>Wood / Cedar</strong></td><td>$300–$500</td><td>$8–$14</td><td>$12,000–$21,000</td></tr>
<tr><td><strong>Metal / Aluminum</strong></td><td>$200–$400</td><td>$5–$10</td><td>$7,500–$15,000</td></tr>
<tr><td><strong>Stone Veneer</strong></td><td>$600–$1,000</td><td>$15–$30</td><td>$22,500–$45,000</td></tr>
</tbody>
</table>
<p><strong>Additional costs:</strong> Old siding removal: $1–$3/sq ft. House wrap (Tyvek): $0.50–$1/sq ft. Trim and accessories: 10–15% of material cost. Permits: $100–$500 depending on jurisdiction.</p>
`,
        faq: [
            { question: "What is a 'square' of siding?", answer: "A square is a unit of measurement equal to 100 square feet of siding material. For example, 1,200 sq ft of net wall area = 12 squares. Siding is often packaged and sold in boxes containing 2 squares (200 sq ft). Contractors price siding per square for easy comparison." },
            { question: "How many squares of siding for my house?", answer: "Measure perimeter × wall height = gross area. Add gable areas (½ × width × height). Subtract windows (~15 sq ft each) and doors (~21 sq ft each). Divide net area by 100 = squares. Add 10% waste. A typical 1,500 sq ft ranch: 10–14 squares. A 2-story home: 18–25 squares." },
            { question: "What type of siding is cheapest?", answer: "Vinyl siding is the most affordable: $3–$8/sq ft installed. Next is engineered wood (LP SmartSide) at $5–$10/sq ft. Fiber cement (HardiePlank) is mid-range at $6–$11/sq ft. Wood/cedar and metal are $5–$14/sq ft. Stone veneer is most expensive at $15–$30/sq ft." },
            { question: "How do I measure gable walls?", answer: "A gable is triangular. Measure the width (full base of the triangle) and the height (from eave to peak). Area = ½ × width × height. Example: A gable 30 ft wide and 8 ft tall = ½ × 30 × 8 = 120 sq ft. Add this to your rectangular wall area before calculating squares." },
            { question: "How much waste should I add for siding?", answer: "10% for simple rectangular homes with few corners. 15% for homes with multiple corners, bump-outs, or bay windows. 15–20% for complex designs with dormers, turrets, or mixed siding styles. Having extra material also allows future repairs that match existing siding." },
            { question: "What siding lasts the longest?", answer: "Stone veneer: 50+ years (essentially permanent). Metal/aluminum: 40–50 years. Fiber cement: 30–50 years. Engineered wood: 25–50 years. Vinyl: 20–40 years. Wood/cedar: 20–40 years (with regular maintenance). All lifespans depend on climate, installation quality, and maintenance." },
            { question: "Should I deduct windows and doors?", answer: "Yes — always deduct openings to avoid over-ordering. Standard estimates: window = 15 sq ft, entry door = 21 sq ft, sliding glass door = 42 sq ft, single garage door = 63 sq ft, double garage door = 112 sq ft. However, you still need trim/J-channel around each opening." },
            { question: "What is fiber cement siding?", answer: "Fiber cement (HardiePlank by James Hardie) is made from cement, sand, and cellulose fibers. It's fire-resistant, termite-proof, rot-resistant, and can mimic wood grain texture. It's heavier than vinyl (~300 lbs per square vs 60 lbs) and requires professional installation." },
            { question: "Can I install siding over existing siding?", answer: "Vinyl can sometimes be installed over existing vinyl or wood siding if the surface is flat and in good condition. Fiber cement and wood siding generally require removal of old siding first. Installing over rotten or damaged substrate traps moisture. Check local building codes — some jurisdictions limit layering." },
            { question: "How much does siding weigh?", answer: "Vinyl: ~60 lbs per square (lightest). Metal: ~50 lbs per square. Engineered wood: ~180 lbs. Wood/cedar: ~200 lbs. Fiber cement: ~300 lbs. Stone veneer: ~800 lbs per square (heaviest). Weight matters for structural loading, especially on older homes, and affects delivery logistics." },
        ],
    },
    "vinyl-siding-calculator": {
        subtitle: "Calculate vinyl siding panels, J-channel, starter strips, utility trim, corner posts, fascia, house wrap, and nails needed for your home. Get a detailed material list with cost estimate for your siding project.",
        explanation: {
            heading: "How to Estimate Vinyl Siding Materials",
            paragraphs: [
                "Vinyl siding is sold by the square — one square covers 100 square feet of wall area. To estimate how many squares you need: measure the house perimeter and wall height to get gross wall area, subtract windows (about 15 sq ft each) and doors (about 21 sq ft each), then divide the net area by 100 and add 10% for waste.",
                "Beyond the siding panels, you'll need five types of trim: J-channel around all windows and doors, starter strips along the bottom of every wall, undersill/utility trim under windows and at wall tops, corner posts on every outside corner, and optionally fascia to cover roof eave boards. Don't forget house wrap and galvanized siding nails — about ⅔ of a pound per square.",
            ],
            highlight: "A typical 1,500 sq ft ranch (150 ft perimeter × 9 ft walls, 8 windows, 2 doors): gross area = 1,350 sq ft, minus 162 sq ft openings = 1,188 sq ft net = 11.9 squares + 10% waste = 13.1 squares → 14 boxes of siding.",
        },
        contentHTML: `
<h2>What Is Vinyl Siding?</h2>
<p><strong>Vinyl siding</strong> is a plastic exterior cladding made from polyvinyl chloride (PVC) resin. It is the most popular siding material in the United States, covering more than <strong>30% of all US homes</strong>. Vinyl siding is favored for its low maintenance (no painting required), durability (25–40 year lifespan), affordability, and wide range of colors and styles.</p>
<p>Vinyl siding is installed horizontally in overlapping courses that interlock with one another. Each panel snaps into the one below it, creating a weather-resistant barrier. The bottom course attaches to a starter strip, and trim pieces finish all edges, corners, and openings.</p>
<p>Compare materials with our <a href="/construction-calculators/siding-material-calculator">siding material calculator</a>. For clapboard, see our <a href="/construction-calculators/clapboard-siding-calculator">clapboard siding calculator</a>. Measure wall area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>.</p>

<h2>Step-by-Step: How to Estimate Vinyl Siding</h2>
<ol>
<li><strong>Measure the perimeter:</strong> Walk around your home and measure the total length of all exterior walls in feet. A typical rectangular home is about 120–200 ft of perimeter.</li>
<li><strong>Measure wall height:</strong> Measure from the bottom of the siding to the top. Standard single-story homes are 8–9 ft; two-story homes are 16–18 ft.</li>
<li><strong>Calculate gross wall area:</strong> Perimeter × wall height = gross area in square feet.</li>
<li><strong>Subtract openings:</strong> Count all windows and doors. Average window = ~15 sq ft; average exterior door = ~21 sq ft. Subtract the total opening area from gross area to get <strong>net siding area</strong>.</li>
<li><strong>Convert to squares:</strong> Divide net area by 100. One square = 100 sq ft.</li>
<li><strong>Add 10% waste:</strong> Multiply by 1.10 to account for cutoffs, mistakes, and future repairs. Round up to the nearest whole number — this is how many <strong>boxes</strong> (squares) of siding to purchase.</li>
</ol>

<h2>Vinyl Siding Trim Guide</h2>
<p>Trim pieces are essential for a professional siding installation. Plan to budget <strong>30–40% of your siding material cost</strong> for trim and accessories.</p>

<h3>J-Channel Trim</h3>
<p>J-channel is a J-shaped trim piece that covers the exposed edges of siding where it meets a window, door, soffit, or different wall surface. Measure the <strong>perimeter of every window and door</strong> to calculate the total linear feet needed. Average window perimeter is ~16 ft; average door perimeter is ~17 ft. J-channel is sold in 12.5-ft lengths.</p>
<p>J-channel is also used where siding meets a different material (brick, stone) or as a transition strip between two siding styles on the same wall.</p>

<h3>Starter Strips</h3>
<p>Starter strips are narrow, flat strips installed along the <strong>very bottom of every wall</strong> before the first course of siding. They provide a solid attachment point for the first siding panel to snap into. Measure the total length of all walls at their base. Starter strips are sold in 10- or 12-ft lengths.</p>

<h3>Undersill / Utility Trim</h3>
<p>Utility trim (also called undersill trim) is installed on <strong>horizontal surfaces where the top edge of a siding panel is exposed</strong>. The most common locations are: under every window sill and at the top of the wall where siding meets the soffit. Measure the width of every window and the total perimeter at the wall tops. Utility trim is sold in 12-ft lengths.</p>

<h3>Corner Trim</h3>
<p><strong>Outside corner posts</strong> are installed vertically on every exterior corner of the home. They create a clean, finished edge where two walls meet. Each corner needs one post the full height of the wall. <strong>Inside corner posts</strong> are identical in function but designed for concave corners.</p>
<p>Count all outside and inside corners and multiply by wall height to get total linear feet. Corner posts are typically sold as 10-ft pieces.</p>

<h3>Fascia</h3>
<p>Fascia is a wide trim board that covers the <strong>front face of your roof eave boards</strong> (the horizontal board where gutters attach). Measure the total length of all eaves in feet. Aluminum or vinyl fascia is sold in 12-ft lengths. Fascia is optional if existing wood fascia is in good condition.</p>

<h2>Other Materials Needed</h2>
<table>
<thead><tr><th>Material</th><th>Amount Needed</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><strong>House Wrap</strong></td><td>1 roll per ~1,350 sq ft of wall</td><td>Installed over sheathing before siding. Standard rolls are 9 ft × 150 ft.</td></tr>
<tr><td><strong>Siding Nails</strong></td><td>⅔ lb per square of siding</td><td>Use galvanized or aluminum roofing nails, 1¼" to 2" long. One nail every 12–16 inches along each panel.</td></tr>
<tr><td><strong>Flashing</strong></td><td>At all window/door heads</td><td>Aluminum drip cap over every window and door to prevent water entry behind siding.</td></tr>
<tr><td><strong>Caulk</strong></td><td>1 tube per 5 windows/doors</td><td>Paintable silicone caulk for sealing gaps at trim edges and openings.</td></tr>
</tbody>
</table>

<h2>Vinyl Siding Styles</h2>
<p>Vinyl siding comes in several profiles that mimic traditional wood siding styles:</p>
<table>
<thead><tr><th>Style</th><th>Description</th><th>Cost Range (per sq ft)</th></tr></thead>
<tbody>
<tr><td><strong>Clapboard (Horizontal Lap)</strong></td><td>The most popular style. Overlapping horizontal planks. Available in 4", 5", or 8" widths.</td><td>$3–$7</td></tr>
<tr><td><strong>Dutch Lap</strong></td><td>Similar to clapboard but with a decorative notch at the top of each plank for added shadow line.</td><td>$3–$8</td></tr>
<tr><td><strong>Board and Batten (Vertical)</strong></td><td>Wide boards with narrow battens covering the joints. Creates a farmhouse/modern look.</td><td>$4–$9</td></tr>
<tr><td><strong>Shake / Shingle</strong></td><td>Mimics hand-split cedar shakes. Often used on gable ends, dormers, or as accent siding.</td><td>$5–$10</td></tr>
<tr><td><strong>Scallop / Fish Scale</strong></td><td>Rounded bottom edge for a Victorian or cottage aesthetic. Typically used as accent siding.</td><td>$5–$10</td></tr>
<tr><td><strong>Insulated Vinyl</strong></td><td>Standard vinyl backed with rigid foam insulation. Adds R-2 to R-5 insulation value.</td><td>$5–$12</td></tr>
</tbody>
</table>

<h2>Vinyl Siding Cost (2025 US Pricing)</h2>
<p>Vinyl siding is the most affordable cladding option in the United States. Here are typical costs:</p>
<table>
<thead><tr><th>Cost Component</th><th>Range</th></tr></thead>
<tbody>
<tr><td><strong>Material only</strong></td><td>$3–$8 per sq ft ($300–$800 per square)</td></tr>
<tr><td><strong>Labor (installation)</strong></td><td>$2–$5 per sq ft</td></tr>
<tr><td><strong>Total installed</strong></td><td>$5–$12 per sq ft</td></tr>
<tr><td><strong>1,000 sq ft of wall</strong></td><td>$3,000–$10,000 installed</td></tr>
<tr><td><strong>1,500 sq ft of wall</strong></td><td>$4,500–$15,000 installed</td></tr>
<tr><td><strong>2,000 sq ft of wall</strong></td><td>$6,000–$20,000 installed</td></tr>
<tr><td><strong>2,500 sq ft of wall</strong></td><td>$7,500–$25,000 installed</td></tr>
<tr><td><strong>Old siding removal</strong></td><td>$1,000–$3,000 additional</td></tr>
</tbody>
</table>
<p><strong>Factors affecting cost:</strong> siding grade (builder's vs premium), number of stories, architectural complexity (gables, dormers), your region, and whether old siding must be removed. Insulated vinyl adds $3–$4 per sq ft compared to standard.</p>

<h2>Pro Tips for Vinyl Siding Projects</h2>
<ul>
<li><strong>Always order 10% extra</strong> siding and <strong>15% extra trim</strong> — cutoffs, mistakes, and future repairs require spare material on hand.</li>
<li><strong>Buy all siding from the same lot number</strong> to ensure consistent color. Vinyl siding color can vary slightly between production runs.</li>
<li><strong>Leave ¼" expansion gap</strong> at all trim connections. Vinyl siding expands and contracts with temperature changes — never nail panels tight.</li>
<li><strong>Drive nails in the center of the slotted nail hole</strong>, leaving 1/32" between the nail head and the panel. This allows the siding to move freely.</li>
<li><strong>Install house wrap before siding</strong> — it's required by most building codes and protects your sheathing from water infiltration.</li>
<li><strong>Use galvanized or aluminum nails only</strong> — steel nails will rust and stain the siding. Stainless steel is ideal but more expensive.</li>
</ul>
`,
        faq: [
            { question: "How many squares of vinyl siding do I need?", answer: "Measure your house perimeter × wall height to get gross wall area. Subtract all windows (~15 sq ft each) and doors (~21 sq ft each). Divide the net area by 100 to get squares, then add 10% for waste. A 150 ft perimeter × 9 ft walls with 8 windows and 2 doors = about 13 squares." },
            { question: "What trim pieces are needed for vinyl siding?", answer: "Five main types: (1) J-channel around all windows/doors, (2) starter strips along the bottom of every wall, (3) undersill/utility trim under windows and at wall tops, (4) corner posts on all outside (and optionally inside) corners, and (5) fascia to cover roof eave boards. Budget 30–40% of siding cost for all trim and accessories." },
            { question: "How much does vinyl siding cost per square foot?", answer: "Material only: $3–$8 per sq ft depending on grade and style. Installed cost (material + labor): $5–$12 per sq ft. A typical 2,000 sq ft exterior costs $6,000–$20,000 fully installed. Insulated vinyl adds $3–$4 per sq ft. Prices vary by region and contractor." },
            { question: "Can I install vinyl siding over existing siding?", answer: "Yes, in many cases. Vinyl can be installed over wood clapboard, aluminum, or old vinyl siding if the existing surface is flat and structurally sound. You may need longer nails and furring strips. However, you cannot install over stucco or brick without furring strips, and removing rotted or damaged siding first is always recommended." },
            { question: "How long does vinyl siding last?", answer: "Quality vinyl siding lasts 25–40 years with minimal maintenance. Premium brands (CertainTeed, James Hardie, Alside) offer lifetime limited warranties. Factors affecting lifespan: UV exposure (south-facing walls fade faster), extreme weather (hail damage), and proper installation. No painting is needed — vinyl is color-through." },
            { question: "What is the best vinyl siding brand?", answer: "Top US brands: CertainTeed (best overall, wide selection), Alside (best value), Ply Gem (popular with contractors), Royal Building Products (premium colors), and Georgia-Pacific (budget-friendly). For insulated vinyl: Progressive Foam's CedarMAX or CertainTeed's CedarBoards are well-regarded." },
            { question: "Do I need house wrap under vinyl siding?", answer: "Yes — house wrap (like Tyvek or similar) is required by most US building codes. It provides a moisture barrier between the siding and the wall sheathing, allowing water vapor to escape outward while blocking liquid water from entering. Standard rolls (9 ft × 150 ft) cover about 1,350 sq ft of wall area." },
            { question: "How much waste should I plan for vinyl siding?", answer: "Plan for 10% waste on siding panels and 15% on trim pieces. This accounts for cutoffs around windows and doors, mistakes, damaged pieces during installation, and leftover material for future repairs. Having extra material from the same lot ensures color-matched replacements." },
            { question: "What is the difference between standard and insulated vinyl siding?", answer: "Standard vinyl siding is a hollow panel with air space behind it. Insulated vinyl has rigid foam insulation (EPS or XPS) bonded to the back, adding R-2 to R-5 insulation value. Insulated siding is thicker, more rigid, reduces noise, and resists denting — but costs $3–$4 more per sq ft than standard." },
            { question: "How many nails do I need for vinyl siding?", answer: "Plan approximately ⅔ of a pound (about 0.67 lbs) of nails per square (100 sq ft) of siding installed. Use 1¼ to 2 inch galvanized or aluminum roofing nails with at least a ⅜ inch head diameter. Nails should be driven every 12–16 inches along each panel's nailing hem — never tight against the panel." },
        ],
    },
    "cubic-feet-calculator": {
        subtitle: "Calculate volume in cubic feet for any shape — box, cylinder, sphere, cone, or triangular prism. Convert to cubic yards, cubic meters, gallons, and liters. Supports feet, inches, centimeters, and meters.",
        explanation: {
            heading: "How to Calculate Cubic Feet",
            paragraphs: [
                "Cubic feet measures three-dimensional volume — the amount of space occupied by an object or enclosed in a container. For a rectangular shape (the most common), the formula is simple: Length × Width × Height = Volume in cubic feet. The key detail most people miss: all measurements must be in feet before you multiply. If your dimensions are in inches, divide each by 12 first. If they're in centimeters, divide by 30.48.",
                "One cubic foot is the volume of a cube measuring 1 ft × 1 ft × 1 ft — about the size of a standard file box. This unit is used extensively in the United States for construction materials (concrete, gravel, mulch), shipping and moving (truck capacity, box sizing), HVAC (airflow in CFM — cubic feet per minute), and appliance capacities (refrigerator and freezer volume).",
            ],
            highlight: "Quick example: A storage closet measuring 5 ft long × 3 ft wide × 8 ft tall = 120 cubic feet. That's 4.44 cubic yards, 3.40 cubic meters, or 897.66 US gallons.",
        },
        contentHTML: `
<h2>What Is a Cubic Foot?</h2>
<p>A <strong>cubic foot</strong> (symbol: ft³ or cu ft) is a unit of volume in the US customary and imperial measurement systems. One cubic foot equals the volume of a cube with edges exactly one foot (12 inches) long. To put it in perspective, a cubic foot is roughly the size of a standard <strong>file storage box</strong> or a basketball.</p>
<p>The cubic foot is the primary volume unit used in the United States for:</p>
<p>Convert to cubic yards with our <a href="/construction-calculators/cubic-yards-calculator">cubic yards calculator</a>. Measure area with our <a href="/construction-calculators/square-footage-calculator">square footage calculator</a>. For tank volumes, see our <a href="/construction-calculators/tank-volume-calculator">tank volume calculator</a>.</p>
<ul>
<li><strong>Construction</strong> — ordering concrete, gravel, mulch, topsoil, and sand</li>
<li><strong>Moving and storage</strong> — measuring truck capacity and box sizes</li>
<li><strong>HVAC</strong> — airflow rated in CFM (cubic feet per minute)</li>
<li><strong>Shipping</strong> — calculating dimensional weight for freight</li>
<li><strong>Appliances</strong> — refrigerator, freezer, oven, and dishwasher capacity</li>
</ul>

<h2>Cubic Feet Formula for Common Shapes</h2>
<p>Different shapes require different formulas. Use all measurements in feet for results in cubic feet:</p>
<table>
<thead><tr><th>Shape</th><th>Formula</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>Rectangle / Box</strong></td><td>L × W × H</td><td>10 × 8 × 4 = 320 cu ft</td></tr>
<tr><td><strong>Cube</strong></td><td>Side³</td><td>5³ = 125 cu ft</td></tr>
<tr><td><strong>Cylinder</strong></td><td>π × r² × H</td><td>π × 2² × 6 = 75.4 cu ft</td></tr>
<tr><td><strong>Sphere</strong></td><td>(4/3) × π × r³</td><td>(4/3) × π × 3³ = 113.1 cu ft</td></tr>
<tr><td><strong>Cone</strong></td><td>(1/3) × π × r² × H</td><td>(1/3) × π × 2² × 6 = 25.1 cu ft</td></tr>
<tr><td><strong>Triangular Prism</strong></td><td>½ × B × H × L</td><td>½ × 4 × 3 × 10 = 60 cu ft</td></tr>
</tbody>
</table>

<h2>Cubic Feet Conversion Table</h2>
<p>Use these exact conversion factors to convert cubic feet to other volume units:</p>
<table>
<thead><tr><th>From 1 Cubic Foot</th><th>To</th><th>Multiply By</th></tr></thead>
<tbody>
<tr><td>1 cu ft</td><td>Cubic Inches</td><td>1,728</td></tr>
<tr><td>1 cu ft</td><td>Cubic Yards</td><td>0.037037</td></tr>
<tr><td>1 cu ft</td><td>Cubic Meters</td><td>0.0283168</td></tr>
<tr><td>1 cu ft</td><td>US Gallons</td><td>7.48052</td></tr>
<tr><td>1 cu ft</td><td>Liters</td><td>28.3168</td></tr>
<tr><td>1 cu ft</td><td>Quarts</td><td>29.922</td></tr>
<tr><td>27 cu ft</td><td>1 Cubic Yard</td><td>—</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> Cubic feet and square feet do not directly convert — square feet measures area (2D) while cubic feet measures volume (3D). To go from square feet to cubic feet, multiply the area by the height or depth in feet.</p>

<h2>When to Use Cubic Feet</h2>

<h3>Moving and Storage</h3>
<p>Moving companies in the US price estimates by total cubic feet of belongings. Knowing your cubic footage helps you choose the right truck size and get accurate quotes. Standard US moving box sizes:</p>
<ul>
<li><strong>Small box</strong> (16" × 12" × 12") = 1.33 cu ft</li>
<li><strong>Medium box</strong> (18" × 18" × 16") = 3.0 cu ft</li>
<li><strong>Large box</strong> (24" × 18" × 18") = 4.5 cu ft</li>
<li><strong>Extra-large box</strong> (24" × 20" × 24") = 6.67 cu ft</li>
</ul>
<p>Popular truck sizes: 10-ft truck = 402 cu ft, 15-ft truck = 764 cu ft, 20-ft truck = 1,015 cu ft, 26-ft truck = 1,611 cu ft. A typical one-bedroom apartment requires 350–500 cu ft of truck space.</p>

<h3>Landscaping Materials</h3>
<p>Mulch, topsoil, gravel, and sand are sold by the cubic foot (bags) or cubic yard (bulk). To calculate cubic feet for a garden bed: measure the area in square feet, decide on the depth (usually 2–4 inches for mulch), convert depth to feet (divide by 12), and multiply: Area × Depth = Cubic Feet.</p>
<p><strong>Worked example:</strong> A 20 × 8 ft flower bed with 3 inches of mulch: 20 × 8 = 160 sq ft × (3 ÷ 12) = 160 × 0.25 = <strong>40 cubic feet</strong>. That's 20 bags of 2 cu ft mulch, or about 1.5 cubic yards for a bulk delivery. Always order 5–10% extra for settling and uneven areas.</p>

<h3>HVAC and Airflow</h3>
<p>HVAC professionals size heating and cooling systems using the room's cubic footage. Multiply length × width × ceiling height to get the room volume in cubic feet. General guidelines:</p>
<ul>
<li><strong>Air conditioners:</strong> approximately 20–25 BTU per cubic foot</li>
<li><strong>Heaters:</strong> 30–35 BTU per cubic foot in cold climates (zones 5–7)</li>
<li><strong>Ventilation:</strong> most rooms need the air exchanged 4–6 times per hour — so a 1,200 cu ft room needs a fan rated at 80–120 CFM</li>
</ul>

<h3>Shipping and Freight</h3>
<p>Freight carriers calculate <strong>dimensional weight</strong> using cubic feet. The formula: (Length × Width × Height in inches) ÷ the carrier's DIM factor (usually 139 for domestic US shipments). If the dimensional weight exceeds the actual weight, you pay for the dimensional weight. Calculating cubic feet first helps you estimate whether you'll be charged by actual or dimensional weight.</p>

<h3>Appliance Capacity</h3>
<p>In the US, refrigerator and freezer capacity is measured in cubic feet. Common sizes: side-by-side refrigerators = 22–28 cu ft, French door = 20–30 cu ft, top-freezer = 15–22 cu ft, chest freezer = 5–25 cu ft. When shopping for appliances, knowing the cubic footage helps compare capacity across brands and styles.</p>

<h2>How to Calculate Cubic Feet from Other Units</h2>
<p>If your measurements are not in feet, convert them first:</p>
<ul>
<li><strong>From inches:</strong> divide each measurement by 12, then multiply L × W × H. Or multiply L × W × H in inches, then divide the result by 1,728.</li>
<li><strong>From yards:</strong> multiply each measurement by 3, then calculate. Or multiply the result in cubic yards by 27.</li>
<li><strong>From centimeters:</strong> divide each measurement by 30.48, then calculate. Or divide the result in cubic centimeters by 28,316.85.</li>
<li><strong>From meters:</strong> multiply each measurement by 3.28084, then calculate. Or multiply the result in cubic meters by 35.3147.</li>
</ul>

<h2>Pro Tips for Accurate Volume Calculations</h2>
<ul>
<li><strong>Always order 5–10% extra</strong> material for construction projects — dimensions are never perfect, and some material is lost to spillage and waste.</li>
<li><strong>Compaction factor:</strong> loose materials (gravel, soil) compact 20–30% when settled or compacted, so order accordingly.</li>
<li><strong>Don't confuse cubic feet with square feet.</strong> Square feet (sq ft) measures flat area. Cubic feet (cu ft) measures volume. You need a third dimension (depth/height) to convert between them.</li>
<li><strong>For irregular shapes:</strong> break the area into simpler shapes (rectangles, cylinders), calculate each volume separately, and add them together.</li>
<li><strong>A cord of firewood</strong> = 128 cubic feet (8 ft × 4 ft × 4 ft). A face cord = about 43 cubic feet.</li>
</ul>
`,
        faq: [
            { question: "How many cubic feet are in a cubic yard?", answer: "There are exactly 27 cubic feet in one cubic yard (3 ft × 3 ft × 3 ft = 27 cu ft). To convert cubic feet to cubic yards, divide by 27. To convert cubic yards to cubic feet, multiply by 27." },
            { question: "How do I convert cubic feet to gallons?", answer: "Multiply cubic feet by 7.48052 to get US gallons. For example, 10 cubic feet = 74.81 US gallons. One cubic foot holds exactly 7.48052 US liquid gallons or 6.22884 imperial gallons." },
            { question: "What is the cubic footage of a room?", answer: "Measure the room's length, width, and ceiling height in feet, then multiply all three: L × W × H. A 12 × 10 ft room with 8 ft ceilings = 960 cubic feet. This is useful for HVAC sizing, which typically requires 20–25 BTU per cubic foot for air conditioning." },
            { question: "How many cubic feet is a standard moving box?", answer: "Small boxes (16×12×12 in) = 1.33 cu ft. Medium boxes (18×18×16 in) = 3.0 cu ft. Large boxes (24×18×18 in) = 4.5 cu ft. Extra-large boxes (24×20×24 in) = 6.67 cu ft. To calculate any box: multiply L × W × H in inches, then divide by 1,728." },
            { question: "How do I calculate cubic feet for concrete?", answer: "Measure the slab's length and width in feet and the depth in inches. Convert depth to feet (divide by 12), then multiply: L × W × Depth(ft) = cubic feet. For a 10×10 ft slab at 4 inches thick: 10 × 10 × 0.333 = 33.3 cu ft = 1.23 cubic yards. Order 5–10% extra." },
            { question: "What's the difference between cubic feet and square feet?", answer: "Square feet (sq ft) measures flat, two-dimensional area (length × width). Cubic feet (cu ft) measures three-dimensional volume (length × width × height). You cannot convert between them without knowing the third dimension. Example: 100 sq ft of floor with a 0.25 ft (3 in) depth of mulch = 25 cu ft." },
            { question: "How many cubic feet of mulch do I need?", answer: "Calculate the area in square feet (length × width), then multiply by the depth in feet. For 3 inches of mulch: area × 0.25. A 10×10 ft bed at 3 in deep = 25 cu ft (about 13 bags of 2 cu ft mulch). One cubic yard (27 cu ft) covers 108 sq ft at 3 inches deep." },
            { question: "How do I calculate the cubic feet of a cylinder?", answer: "Use the formula: π × radius² × height. If you know the diameter, divide by 2 to get the radius. For a tank that's 4 ft in diameter and 6 ft tall: π × 2² × 6 = 75.4 cubic feet. That holds about 564 US gallons of water." },
            { question: "How do I size an air conditioner using cubic feet?", answer: "Calculate room volume: L × W × ceiling height = cubic feet. Then multiply by 20–25 BTU per cubic foot. A 12×10 ft room with 8 ft ceilings = 960 cu ft × 25 = 24,000 BTU (about a 2-ton unit). Adjust upward for sunny rooms, kitchens, or rooms with many occupants." },
            { question: "How many cubic feet is a standard refrigerator?", answer: "Top-freezer: 15–22 cu ft. Bottom-freezer: 18–25 cu ft. Side-by-side: 22–28 cu ft. French door: 20–30 cu ft. The most popular size for US families of 3–5 is 22–25 cu ft. Compact/apartment refrigerators range from 3–10 cu ft." },
        ],
    },

    "plastering-calculator": {
        subtitle: "Calculate cement and sand needed for wall plastering. Choose mix ratio (1:3 to 1:6), plaster thickness, and number of coats to get material quantities in bags and cubic feet with cost.",
        contentHTML: `<h2>What Is Plastering?</h2><p><strong>Plastering</strong> is the process of applying a thin coat of cement mortar on walls, ceilings, and columns to create a smooth, protective, and aesthetically pleasing surface. It protects masonry from moisture, provides a base for painting, and improves structural durability.</p><h2>Plastering Mix Ratios</h2><table><thead><tr><th>Mix Ratio</th><th>Application</th><th>Thickness</th></tr></thead><tbody><tr><td><strong>1:3</strong></td><td>External walls, waterproofing</td><td>15–20 mm</td></tr><tr><td><strong>1:4</strong></td><td>External walls (standard)</td><td>12–15 mm</td></tr><tr><td><strong>1:5</strong></td><td>Internal walls</td><td>12 mm</td></tr><tr><td><strong>1:6</strong></td><td>Ceilings, internal lean plaster</td><td>6–8 mm</td></tr></tbody></table><h2>How to Calculate Plastering Materials</h2><ol><li><strong>Find the area</strong> — Length × Height of each wall. Subtract door/window openings.</li><li><strong>Calculate wet volume</strong> — Area × Thickness (in meters).</li><li><strong>Convert to dry volume</strong> — Multiply wet volume by 1.35 (shrinkage factor).</li><li><strong>Split by ratio</strong> — For 1:4, cement = dry vol × 1/5, sand = dry vol × 4/5.</li><li><strong>Convert cement to bags</strong> — 1 bag of 50 kg cement = 0.035 m³.</li></ol><h2>Plastering Cost (India, 2025)</h2><table><thead><tr><th>Component</th><th>Rate</th></tr></thead><tbody><tr><td>Cement (50 kg bag)</td><td>₹340–₹400</td></tr><tr><td>Sand (per cu ft)</td><td>₹30–₹50</td></tr><tr><td>Labor (internal)</td><td>₹18–₹25/sq ft</td></tr><tr><td>Labor (external)</td><td>₹22–₹30/sq ft</td></tr></tbody></table>`,
        faq: [
            { question: "What is the standard plastering thickness for internal walls?", answer: "12 mm (½ inch) is the standard thickness for internal wall plastering. External walls typically require 15–20 mm. Ceilings use 6–8 mm. Thicker plaster wastes material without adding strength." },
            { question: "Which mix ratio is best for plastering?", answer: "1:4 (cement:sand) for external walls and 1:5 or 1:6 for internal walls and ceilings. Richer mixes (1:3) are used for waterproof areas like bathrooms." },
            { question: "How much cement is needed for 100 sq ft plastering?", answer: "For 12mm thick internal plaster at 1:5 ratio: approximately 0.8 bags of cement and 2 cu ft of sand per 100 sq ft. Exact quantities depend on thickness and mix ratio." },
            { question: "Why is dry volume 35% more than wet volume?", answer: "When cement and sand are mixed with water, the fine cement particles fill the voids between sand grains, causing the volume to shrink. The 1.35 factor (35% increase) accounts for this shrinkage." },
            { question: "How long should plastering cure?", answer: "Plaster must be cured by spraying water for at least 7 days. Start curing 24 hours after plastering. Proper curing prevents cracks and ensures full strength development." },
        ],
    },
    "pcc-calculator": {
        subtitle: "Calculate cement, sand, and aggregate for Plain Cement Concrete (PCC) work. Select from standard mix ratios (M5 to M20) and get dry volume quantities with the 1.54 conversion factor.",
        contentHTML: `<h2>What Is PCC (Plain Cement Concrete)?</h2><p><strong>PCC</strong> is a mix of cement, sand (fine aggregate), and stone chips (coarse aggregate) without any steel reinforcement. It is used for leveling, bedding, and non-structural applications like flooring base, foundation bed, and pathways.</p><h2>Standard PCC Mix Ratios</h2><table><thead><tr><th>Grade</th><th>Ratio (C:S:A)</th><th>Strength</th><th>Common Uses</th></tr></thead><tbody><tr><td>M5</td><td>1:5:10</td><td>5 N/mm²</td><td>Leveling course</td></tr><tr><td>M7.5</td><td>1:4:8</td><td>7.5 N/mm²</td><td>Foundation bed, lean concrete</td></tr><tr><td>M10</td><td>1:3:6</td><td>10 N/mm²</td><td>Floor base, substructure</td></tr><tr><td>M15</td><td>1:2:4</td><td>15 N/mm²</td><td>Standard PCC work</td></tr><tr><td>M20</td><td>1:1.5:3</td><td>20 N/mm²</td><td>Heavy-duty PCC</td></tr></tbody></table><h2>Why 1.54 Dry Volume Factor?</h2><p>When concrete ingredients are mixed with water, the dry materials compact into a smaller wet volume. To get 1 m³ of wet PCC, you need 1.54 m³ of dry materials. This accounts for the voids in loose sand and aggregate that get filled during compaction.</p>`,
        faq: [
            { question: "What is the difference between PCC and RCC?", answer: "PCC (Plain Cement Concrete) has no steel reinforcement and is used for leveling, bedding, and non-load-bearing applications. RCC (Reinforced Cement Concrete) includes steel bars for structural strength in beams, columns, slabs, and footings." },
            { question: "What grade of PCC is used for foundation?", answer: "M7.5 (1:4:8) or M10 (1:3:6) is typically used as a foundation bed/leveling course. M15 (1:2:4) is used for standard PCC work. The grade depends on the load and soil condition." },
            { question: "How many bags of cement for 1 cubic meter of PCC?", answer: "For M15 (1:2:4): approximately 6.3 bags. For M10 (1:3:6): approximately 4.6 bags. For M20 (1:1.5:3): approximately 8.4 bags of 50 kg cement." },
            { question: "What is the minimum PCC thickness?", answer: "75mm (3 inches) is the minimum PCC thickness for foundation beds per IS code. For floor bases, 100mm (4 inches) is standard. For road sub-base, 150mm (6 inches) or more." },
        ],
    },
    "rcc-calculator": {
        subtitle: "Calculate cement, sand, aggregate, and steel reinforcement for RCC work. Includes steel percentage input for different structural members — beams, columns, slabs, and footings.",
        contentHTML: `<h2>What Is RCC (Reinforced Cement Concrete)?</h2><p><strong>RCC</strong> is concrete strengthened with steel reinforcement bars (rebar). Concrete is strong in compression but weak in tension; steel bars handle the tensile forces. Together, they form the structural backbone of modern construction — beams, columns, slabs, footings, and retaining walls.</p><h2>Steel Percentage by Member</h2><table><thead><tr><th>Structural Member</th><th>Steel %</th><th>Typical Use</th></tr></thead><tbody><tr><td>Slab</td><td>0.7–1.0%</td><td>Floor and roof slabs</td></tr><tr><td>Beam</td><td>1.0–2.0%</td><td>Load-bearing beams</td></tr><tr><td>Column</td><td>1.5–3.0%</td><td>Vertical load transfer</td></tr><tr><td>Footing</td><td>0.5–0.8%</td><td>Foundation footings</td></tr><tr><td>Staircase</td><td>1.0–1.5%</td><td>Stair waist slab</td></tr></tbody></table><h2>Thumb Rule for Steel in Buildings</h2><p>For residential buildings: <strong>3.5–5.5 kg of steel per sq ft</strong> of built-up area. For commercial: 5–7 kg/sq ft. This includes all structural members (foundation, columns, beams, slabs).</p>`,
        faq: [
            { question: "How much steel is needed per cubic meter of RCC?", answer: "Typically 80–120 kg of steel per cubic meter of RCC. Slabs use 80–100 kg/m³, beams use 100–150 kg/m³, and columns use 150–250 kg/m³. The exact amount depends on the structural design." },
            { question: "What is the standard RCC mix ratio?", answer: "M20 (1:1.5:3) is the most commonly used mix for general RCC work in India. M25 (1:1:2) for columns and heavily loaded beams. M15 (1:2:4) for lightly loaded footings." },
            { question: "How to reduce steel in RCC construction?", answer: "Use higher-grade steel (Fe 500D instead of Fe 415), optimize structural design with proper software analysis, use post-tensioned slabs for large spans, and ensure proper cover to prevent wastage." },
        ],
    },
    "construction-cost-estimator": {
        subtitle: "Estimate total house construction cost based on built-up area, floors, quality level, and city tier. Get a detailed percentage breakdown of structure, finishing, plumbing, and electrical costs.",
        contentHTML: `<h2>House Construction Cost in India (2025)</h2><p>Construction costs vary significantly based on location, quality of materials, and finishing level. Here are approximate rates per square foot of built-up area:</p><table><thead><tr><th>Quality</th><th>Rate (₹/sq ft)</th><th>Description</th></tr></thead><tbody><tr><td><strong>Economy</strong></td><td>₹1,000–₹1,400</td><td>Basic materials, standard fittings, minimal finishing</td></tr><tr><td><strong>Standard</strong></td><td>₹1,500–₹2,000</td><td>Good quality materials, branded fittings, vitrified tiles</td></tr><tr><td><strong>Premium</strong></td><td>₹2,200–₹3,000</td><td>Premium brands, Italian marble, modular kitchen</td></tr><tr><td><strong>Luxury</strong></td><td>₹3,000–₹5,000+</td><td>Imported materials, smart home, architect-designed</td></tr></tbody></table><h2>Cost Breakdown</h2><table><thead><tr><th>Component</th><th>Share</th></tr></thead><tbody><tr><td>Structure (foundation, RCC, masonry)</td><td>40–50%</td></tr><tr><td>Finishing (flooring, painting, doors)</td><td>25–35%</td></tr><tr><td>Plumbing & Sanitary</td><td>7–10%</td></tr><tr><td>Electrical</td><td>6–8%</td></tr><tr><td>Miscellaneous & Contingency</td><td>5–10%</td></tr></tbody></table>`,
        faq: [
            { question: "How much does it cost to build a 1000 sq ft house in India?", answer: "At standard quality in a Tier-2 city: approximately ₹15–20 lakhs. Economy: ₹10–14 lakhs. Premium: ₹22–30 lakhs. Costs vary significantly by city — Tier-1 cities can be 30% higher." },
            { question: "What is included in construction cost per sq ft?", answer: "It includes foundation, structure (RCC, masonry), flooring, plastering, painting, plumbing, electrical, doors and windows, and basic finishing. It excludes land cost, compound wall, overhead water tank, and interior decoration." },
            { question: "How to save money on house construction?", answer: "Use local materials, avoid unnecessary design complexity, buy materials in bulk, plan thoroughly to avoid changes during construction, and hire experienced contractors who can minimize waste." },
        ],
    },
    "carpet-area-calculator": {
        subtitle: "Convert between carpet area, built-up area, and super built-up area instantly. Enter any one value with loading percentages to calculate the other two. RERA compliant for Indian real estate.",
        contentHTML: `<h2>Understanding Carpet, Built-Up, and Super Built-Up Area</h2><table><thead><tr><th>Area Type</th><th>What It Includes</th><th>RERA Status</th></tr></thead><tbody><tr><td><strong>Carpet Area</strong></td><td>Usable floor area inside walls (excludes wall thickness)</td><td>✅ Mandatory for pricing</td></tr><tr><td><strong>Built-Up Area</strong></td><td>Carpet area + wall thickness + balcony</td><td>–</td></tr><tr><td><strong>Super Built-Up Area</strong></td><td>Built-up area + share of common areas (lobby, stairs, lift)</td><td>❌ Not for pricing post-RERA</td></tr></tbody></table><h2>Conversion Formulas</h2><ul><li><strong>Built-Up Area</strong> = Carpet Area × (1 + 15–25%)</li><li><strong>Super Built-Up Area</strong> = Built-Up Area × (1 + 25–50%)</li><li><strong>Carpet Area</strong> = Usually 60–75% of Super Built-Up Area</li></ul><h2>What Is RERA?</h2><p>The <strong>Real Estate (Regulation and Development) Act, 2016</strong> mandates that developers sell properties based on <strong>carpet area only</strong>, not super built-up area. This protects buyers from inflated area figures.</p>`,
        faq: [
            { question: "What is carpet area?", answer: "Carpet area is the net usable floor area within the walls of a flat — the area where you can actually 'lay a carpet.' It excludes wall thickness, balcony, terrace, and common areas. Under RERA, this is the only area basis for property pricing." },
            { question: "How to calculate built-up area from carpet area?", answer: "Built-up area = Carpet Area × (1 + loading factor). Typical loading: 15–25%. For a 1,000 sq ft carpet area with 20% loading, built-up area = 1,200 sq ft. The loading covers wall thickness and small projections." },
            { question: "What is a good carpet-to-super-built-up ratio?", answer: "A ratio of 70% or higher is considered good. This means if super built-up is 1,000 sq ft, carpet should be at least 700 sq ft. Ratios below 65% indicate excessive common area loading." },
        ],
    },
    "steel-quantity-calculator": {
        subtitle: "Estimate total steel reinforcement for house construction based on built-up area and structure type. Get weight in kg/tons, bar count by diameter (8mm to 20mm), and cost estimate.",
        contentHTML: `<h2>Steel in Construction — Thumb Rules</h2><table><thead><tr><th>Structure Type</th><th>Steel (kg/sq ft)</th><th>Steel (kg/m²)</th></tr></thead><tbody><tr><td><strong>Residential (G+1/G+2)</strong></td><td>3.5–5.5</td><td>38–60</td></tr><tr><td><strong>Commercial</strong></td><td>5–7</td><td>55–75</td></tr><tr><td><strong>Industrial</strong></td><td>7–10</td><td>75–110</td></tr></tbody></table><h2>Steel Bar Weight Table</h2><table><thead><tr><th>Diameter</th><th>Weight per meter</th><th>Weight per 12m bar</th><th>Typical Use</th></tr></thead><tbody><tr><td>8 mm</td><td>0.395 kg</td><td>4.74 kg</td><td>Stirrups, ties</td></tr><tr><td>10 mm</td><td>0.617 kg</td><td>7.40 kg</td><td>Slab reinforcement</td></tr><tr><td>12 mm</td><td>0.888 kg</td><td>10.66 kg</td><td>Beams, slabs</td></tr><tr><td>16 mm</td><td>1.580 kg</td><td>18.96 kg</td><td>Columns, beams</td></tr><tr><td>20 mm</td><td>2.466 kg</td><td>29.60 kg</td><td>Heavy columns, footings</td></tr></tbody></table><h2>Bar Distribution (General Rule)</h2><ul><li>8mm stirrups: ~10% of total steel</li><li>10mm: ~15%</li><li>12mm: ~30%</li><li>16mm: ~30%</li><li>20mm: ~15%</li></ul>`,
        faq: [
            { question: "How much steel is needed for a 1000 sq ft house?", answer: "For a standard G+1 residential building: approximately 4,000–5,500 kg (4–5.5 tons) of steel. This includes foundation, columns, beams, slabs, and staircase. The exact amount depends on the structural design and soil condition." },
            { question: "What is the current steel price in India?", answer: "TMT steel bars (Fe 500D) cost approximately ₹50–₹65 per kg in 2025, varying by brand and location. Major brands: Tata Tiscon, JSW NeoSteel, SAIL, Jindal Panther." },
            { question: "How to calculate steel weight from diameter?", answer: "Weight (kg/m) = d² / 162.2, where d is diameter in mm. For a 12mm bar: 12² / 162.2 = 0.888 kg/m. For a 12-meter standard bar: 0.888 × 12 = 10.66 kg per bar." },
        ],
    },
    "anti-termite-calculator": {
        subtitle: "Calculate chemical solution for pre-construction anti-termite treatment per IS 6313. Enter plinth area, foundation perimeter, trench dimensions, and chemical concentration.",
        contentHTML: `<h2>What Is Anti-Termite Treatment?</h2><p><strong>Pre-construction anti-termite treatment</strong> creates a chemical barrier between the soil and the building foundation to prevent termites from entering the structure. It is applied during construction before flooring, as per <strong>IS 6313 (Part II)</strong>.</p><h2>Treatment Stages</h2><ol><li><strong>Soil Treatment</strong> — Chemical emulsion applied to the excavated soil and backfill around the foundation at 5 liters/m² of surface.</li><li><strong>Foundation Trench</strong> — Emulsion poured along the foundation trench perimeter at 7.5 liters/m³.</li><li><strong>Plinth Filling</strong> — Top soil layer treated before PCC/flooring.</li></ol><h2>Common Chemicals</h2><table><thead><tr><th>Chemical</th><th>Concentration</th><th>Life</th></tr></thead><tbody><tr><td>Chlorpyriphos</td><td>1% EC</td><td>5–10 years</td></tr><tr><td>Imidacloprid</td><td>0.05%</td><td>10–15 years</td></tr><tr><td>Fipronil</td><td>0.1%</td><td>10+ years</td></tr></tbody></table>`,
        faq: [
            { question: "Is anti-termite treatment mandatory?", answer: "Yes — IS 6313 (Part II) mandates pre-construction anti-termite treatment for all buildings in India. Most municipal corporations require a certificate before occupancy. It is also required for home loan documentation." },
            { question: "How long does anti-termite treatment last?", answer: "Pre-construction treatment typically lasts 5–15 years depending on the chemical used. Chlorpyriphos lasts 5–10 years, while newer chemicals like Imidacloprid and Fipronil can last 10–15 years." },
            { question: "What is the cost of anti-termite treatment?", answer: "Pre-construction: ₹3–₹6 per sq ft. Post-construction: ₹5–₹10 per sq ft. For a 1,000 sq ft house, pre-construction treatment costs ₹3,000–₹6,000." },
        ],
    },
    "compound-wall-calculator": {
        subtitle: "Calculate precast panels, pillars, and foundation materials for boundary/compound wall construction. Enter wall length, height, and pillar spacing for complete material and cost estimate.",
        contentHTML: `<h2>What Is a Compound Wall?</h2><p>A <strong>compound wall</strong> (boundary wall or fencing wall) encloses a property for security and privacy. <strong>Precast compound walls</strong> use factory-made concrete panels and pillars — they are faster to install, more economical, and more uniform than brick walls.</p><h2>Components</h2><ul><li><strong>Precast Panels</strong> — Concrete slabs (typically 4' × 1.5' or 5' × 1.5') that slot between pillars</li><li><strong>Precast Pillars</strong> — Reinforced columns (typically 4" × 6") at regular intervals</li><li><strong>Foundation</strong> — PCC pad for each pillar (typically 1.5' × 1.5' × 2' deep)</li></ul><h2>Precast vs Brick Compound Wall</h2><table><thead><tr><th>Feature</th><th>Precast</th><th>Brick</th></tr></thead><tbody><tr><td>Cost</td><td>₹70–₹120/sq ft</td><td>₹100–₹180/sq ft</td></tr><tr><td>Speed</td><td>50–100 ft/day</td><td>15–25 ft/day</td></tr><tr><td>Durability</td><td>25–30 years</td><td>40–50 years</td></tr><tr><td>Appearance</td><td>Uniform, smooth</td><td>Customizable</td></tr></tbody></table>`,
        faq: [
            { question: "How much does a compound wall cost per foot?", answer: "Precast: ₹500–₹900 per running foot (7 ft height). Brick: ₹800–₹1,500 per running foot. For a 100 ft compound wall, precast costs ₹50,000–₹90,000 and brick costs ₹80,000–₹1,50,000." },
            { question: "What is the standard height for a compound wall?", answer: "6–7 feet above ground is standard for residential properties. In India, most municipalities allow up to 5 feet without permission and require approval for walls above 5 feet. Industrial sites may have 8–10 feet walls." },
            { question: "What spacing should pillars have?", answer: "Standard pillar spacing is 8–10 feet for precast walls. Closer spacing (6 ft) provides more strength for tall walls or windy areas. Wider spacing (12 ft) is possible for short walls but risks panel sagging." },
        ],
    },
    "countertop-calculator": {
        subtitle: "Calculate countertop material for kitchens and vanities. Choose from granite, quartz, marble, laminate, or butcher block — get total area, slabs needed, and installed cost estimate.",
        contentHTML: `<h2>How to Measure for Countertops</h2><ol><li><strong>Measure each run</strong> — the straight sections of counter along walls. Include L-shapes and U-shapes as separate runs.</li><li><strong>Measure depth</strong> — Standard kitchen counter depth is 25 inches (including overhang). Bathroom vanity: 22 inches. Island: 36–42 inches.</li><li><strong>Add backsplash</strong> — Standard backsplash is 4 inches tall. Full-height backsplash goes to the upper cabinets (15–18 inches).</li></ol><h2>Countertop Material Comparison (US 2025)</h2><table><thead><tr><th>Material</th><th>$/sq ft</th><th>Installed $/sq ft</th><th>Durability</th></tr></thead><tbody><tr><td>Laminate</td><td>$10–$20</td><td>$30–$45</td><td>10–15 years</td></tr><tr><td>Butcher Block</td><td>$35–$55</td><td>$55–$80</td><td>20+ years</td></tr><tr><td>Granite</td><td>$40–$60</td><td>$60–$100</td><td>25+ years</td></tr><tr><td>Quartz</td><td>$50–$80</td><td>$75–$120</td><td>25+ years</td></tr><tr><td>Marble</td><td>$60–$100</td><td>$85–$135</td><td>25+ years</td></tr></tbody></table>`,
        faq: [
            { question: "How much countertop do I need for a standard kitchen?", answer: "A typical U-shaped kitchen has 20–25 linear feet of counter. At 25 inches deep, that is 42–52 sq ft of countertop. An L-shaped kitchen is 15–20 linear feet (31–42 sq ft)." },
            { question: "How much does a granite countertop cost?", answer: "Granite countertops cost $40–$60 per sq ft for material and $60–$100 installed. A typical kitchen (40 sq ft) costs $2,400–$4,000 installed. Exotic granites can exceed $100/sq ft." },
            { question: "How many slabs do I need?", answer: "A standard granite/quartz slab is approximately 45–55 sq ft (55 × 120 inches). Most kitchens need 2–3 slabs. A simple L-shape may fit in 1–2 slabs. Seams are placed at corners or behind the sink." },
        ],
    },
    "solar-rooftop-calculator": {
        subtitle: "Estimate solar panel system size for your roof. Enter available area, peak sun hours, and panel wattage to get system capacity, annual generation, electricity savings, and payback period.",
        contentHTML: `<h2>Solar Rooftop System Sizing</h2><p>A rooftop solar system converts sunlight into electricity using photovoltaic (PV) panels. Sizing depends on three factors: <strong>available roof area</strong>, <strong>peak sun hours</strong> in your location, and <strong>panel efficiency</strong>.</p><h2>Quick Sizing Rules</h2><table><thead><tr><th>System Size</th><th>Roof Area Needed</th><th>Monthly Generation</th><th>Suitable For</th></tr></thead><tbody><tr><td>1 kW</td><td>100 sq ft</td><td>120–150 kWh</td><td>1–2 BHK, low usage</td></tr><tr><td>3 kW</td><td>300 sq ft</td><td>360–450 kWh</td><td>2–3 BHK, moderate usage</td></tr><tr><td>5 kW</td><td>500 sq ft</td><td>600–750 kWh</td><td>3–4 BHK, AC usage</td></tr><tr><td>10 kW</td><td>1000 sq ft</td><td>1200–1500 kWh</td><td>Large house / commercial</td></tr></tbody></table><h2>Government Subsidies (India 2025)</h2><p>Under the PM Surya Ghar scheme: <strong>₹30,000/kW subsidy for up to 3 kW</strong> and ₹18,000/kW for 3–10 kW capacity. This can reduce system cost by 30–40%.</p>`,
        faq: [
            { question: "How much roof area do I need for solar panels?", answer: "Approximately 100 sq ft per 1 kW of solar capacity. A 5 kW system needs about 500 sq ft of shadow-free, south-facing roof area. Only 70% of total roof area is typically usable after accounting for obstructions." },
            { question: "What is the payback period for rooftop solar?", answer: "4–6 years in India after subsidies. Without subsidies: 5–7 years. The system produces free electricity for 20+ years after payback, making it an excellent long-term investment." },
            { question: "How much can I save with solar panels?", answer: "A 5 kW system generates approximately 600–750 kWh/month. At ₹8/kWh, that saves ₹5,000–₹6,000/month or ₹60,000–₹72,000/year. Savings increase as electricity tariffs rise." },
        ],
    },
    "solar-water-heater-calculator": {
        subtitle: "Calculate the right solar water heater size for your household. Enter family size, daily usage, and climate zone to get recommended tank size, collector area, and energy savings.",
        contentHTML: `<h2>How Solar Water Heaters Work</h2><p>Solar water heaters use <strong>flat plate collectors</strong> or <strong>evacuated tube collectors (ETC)</strong> to absorb sunlight and heat water stored in an insulated tank. They can provide 60–85% of a household's hot water needs, dramatically reducing electricity or gas bills.</p><h2>System Types</h2><table><thead><tr><th>Type</th><th>Efficiency</th><th>Cost</th><th>Best For</th></tr></thead><tbody><tr><td>Flat Plate (FPC)</td><td>60–70%</td><td>₹15,000–₹25,000 per 100L</td><td>Year-round hot climate</td></tr><tr><td>Evacuated Tube (ETC)</td><td>70–85%</td><td>₹10,000–₹18,000 per 100L</td><td>Cold/cloudy climates</td></tr></tbody></table><h2>Sizing Guide</h2><table><thead><tr><th>Family Size</th><th>Daily Hot Water</th><th>Recommended Tank</th></tr></thead><tbody><tr><td>2 persons</td><td>80–100 liters</td><td>100 liters</td></tr><tr><td>3–4 persons</td><td>150–200 liters</td><td>200 liters</td></tr><tr><td>5–6 persons</td><td>250–300 liters</td><td>300 liters</td></tr><tr><td>7–8 persons</td><td>350–400 liters</td><td>500 liters</td></tr></tbody></table>`,
        faq: [
            { question: "What size solar water heater do I need?", answer: "Plan 40–50 liters of hot water per person per day. A family of 4 needs a 200-liter system. In cold climates, size up by 25% since solar efficiency drops. Round up to the nearest standard size (100, 200, 300, 500 liters)." },
            { question: "Does a solar water heater work in winter?", answer: "Yes, but with reduced efficiency. In moderate winters, expect 50–60% of summer output. ETC systems perform better in cold/cloudy weather than flat plate systems. Most systems include an electric backup element." },
            { question: "What is the payback period for a solar water heater?", answer: "2–4 years depending on existing energy costs and usage. A 200L system costing ₹25,000 saves approximately ₹8,000–₹12,000/year in electricity, paying for itself in 2–3 years." },
        ],
    },
};


export default async function ConstructionCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("construction").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];

    const pageUrl = canonicalUrl(`/construction-calculators/${calc.slug}`);

    // ── Square Footage: full 6-schema package matching competitor ───────────
    let schemaData: string;
    if (calc.slug === "square-footage-calculator" && content?.faq) {
        const sqftDesc = "Calculate square footage for rooms, plots, and construction projects. Supports 11 shapes including rectangle, circle, triangle, trapezoid, wall-minus-window, and annulus. Enter measurements in feet and inches. Get area in sq ft, sq m, sq yd, and acres. Calculate project cost with price per sq ft, sq yd, sq m, or per box.";
        const sqftFaq = content.faq.slice(0, 10);
        schemaData = JSON.stringify([
            breadcrumbSchema([
                { name: "Home", url: `${SITE_URL}/` },
                { name: "Construction Calculators", url: canonicalUrl("/construction-calculators") },
                { name: calc.title },
            ]),
            webPageSchema(calc.title, pageUrl, sqftDesc),
            constructionAppSchema(
                calc.title,
                pageUrl,
                sqftDesc,
                [
                    "http://www.productontology.org/id/Software_calculator",
                    "http://www.productontology.org/id/Square_foot",
                    "http://www.productontology.org/id/Area",
                ]
            ),
            organizationSchema(SITE_URL),
            faqSchema(sqftFaq),
            howToSchema(
                "How to Calculate Square Footage",
                "Step-by-step guide to measuring and calculating square footage for rooms, plots, and construction projects.",
                [
                    { name: "Choose your shape", text: "Select the shape of the space — rectangle for standard rooms, circle for round areas, or triangle/trapezoid for angled spaces." },
                    { name: "Measure the dimensions", text: "Use a tape measure to record length and width in feet and inches. For rooms with alcoves, break them into sections and calculate each separately." },
                    { name: "Enter feet and inches", text: "Enter the whole-foot value and the remaining inches separately. The calculator converts them automatically (e.g., 10 ft 6 in = 10.5 ft)." },
                    { name: "Set quantity and waste factor", text: "If calculating multiple identical rooms, enter the room count. Add a waste factor — 10% for straight-lay flooring, 15% for diagonal or herringbone patterns." },
                    { name: "Read your results", text: "The calculator outputs total area in sq ft, sq in, sq yd, sq m, and acres. If you entered a price per unit, it also shows total material cost and boxes needed." },
                ]
            ),
        ]);
    } else {
        schemaData = JSON.stringify([
            breadcrumbSchema([
                { name: "Home", url: `${SITE_URL}/` },
                { name: "Construction Calculators", url: canonicalUrl("/construction-calculators") },
                { name: calc.title },
            ]),
            webAppSchema(calc.title, pageUrl, "USD", "EducationalApplication"),
        ]);
    }

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
                            <AuthorBadge categoryKey="construction" />
                            <DynamicExplanation
                                heading={content.explanation?.heading}
                                paragraphs={content.explanation?.paragraphs}
                                highlight={content.explanation?.highlight}
                                contentHTML={content.contentHTML}
                            />
                            {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                        </>
                    )}
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar">
                    <nav style={{
                        background: "var(--n-surface)",
                        border: "1px solid var(--n-border)",
                        borderRadius: "var(--r-md)",
                        padding: "var(--s-5)",
                    }}>
                        <h3 style={{ fontSize: "var(--t-body)", fontWeight: 700, marginBottom: "var(--s-4)", display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
                            🏗️ Construction Tools
                        </h3>
                        {[
                            { label: "Concrete Calculator", href: "/construction-calculators/concrete-calculator" },
                            { label: "Roofing Calculator", href: "/construction-calculators/roofing-calculator" },
                            { label: "Flooring Calculator", href: "/construction-calculators/flooring-calculator" },
                            { label: "Paint Calculator", href: "/construction-calculators/paint-calculator" },
                            { label: "Drywall Calculator", href: "/construction-calculators/drywall-calculator" },
                            { label: "Tile Calculator", href: "/construction-calculators/tile-calculator" },
                            { label: "Square Footage", href: "/construction-calculators/square-footage-calculator" },
                            { label: "Cubic Yards", href: "/construction-calculators/cubic-yards-calculator" },
                            { label: "Gravel Calculator", href: "/construction-calculators/gravel-calculator" },
                            { label: "Fence Calculator", href: "/construction-calculators/fence-calculator" },
                            { label: "Lumber Calculator", href: "/construction-calculators/lumber-calculator" },
                            { label: "Brick Calculator", href: "/construction-calculators/brick-calculator" },
                        ].map(link => (
                            <a key={link.href} href={link.href} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "var(--s-3) 0", borderBottom: "1px solid var(--n-border)",
                                color: "var(--n-text-secondary)", fontSize: "var(--t-body-sm)",
                                textDecoration: "none", transition: "color 0.2s",
                            }}>
                                {link.label} <span style={{ color: "var(--n-text-muted)" }}>→</span>
                            </a>
                        ))}
                        <a href="/construction-calculators" style={{
                            display: "block", marginTop: "var(--s-4)",
                            color: "var(--n-primary)", fontSize: "var(--t-body-sm)",
                            fontWeight: 600, textDecoration: "none",
                        }}>
                            View all Construction Calculators →
                        </a>
                    </nav>
                </aside>
            </div>
        </main>
    );
}
