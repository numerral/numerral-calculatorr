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
    "gravel-calculator": {
        subtitle: "Calculate how much gravel you need for driveways, pathways, and landscaping. Get results in cubic yards, tons, and estimated cost by material type.",
        explanation: {
            heading: "How to Calculate Gravel Quantities",
            paragraphs: [
                "Gravel is sold by the cubic yard or by the ton. The conversion between the two depends on the material density — crushed stone and pea gravel weigh about 1.4 tons per cubic yard, while river rock is heavier at around 1.5 tons per cubic yard.",
                "For driveways, the recommended depth is 4–6 inches of gravel. For walkways, 2–3 inches is sufficient. Always compact the subgrade before laying gravel and consider installing landscape fabric beneath to prevent weed growth and material migration.",
            ],
            highlight: "A 20×10 ft driveway area with 3 inches of gravel = 20 × 10 × 0.25 = 50 cu ft ÷ 27 = 1.85 cubic yards ≈ 2.6 tons of crushed stone.",
        },
        faq: [
            { question: "How much does gravel cost?", answer: "Bulk gravel typically costs $15–$75 per cubic yard depending on the type. Pea gravel: $25–$50, crushed stone: $20–$45, river rock: $40–$75. Delivery fees range from $50–$150 depending on distance and quantity." },
            { question: "How thick should a gravel driveway be?", answer: "A standard residential gravel driveway should be 4–6 inches deep, laid in two layers: a 3–4 inch base of larger crushed stone (¾ inch) topped with 1–2 inches of finer gravel. Heavy traffic areas may need 8–12 inches total depth." },
        ],
    },
    "mulch-calculator": {
        subtitle: "Calculate how much mulch you need for garden beds and landscaping. Get cubic yards, number of bags, and estimated cost for any area.",
        explanation: {
            heading: "How to Calculate Mulch Needs",
            paragraphs: [
                "Mulch is typically applied 2–4 inches deep depending on the type and purpose. Shredded bark and wood chips are best at 3–4 inches for weed suppression. Decorative stone mulch needs only 2 inches. Deeper applications can suffocate plant roots and trap excess moisture.",
                "Mulch is sold in bags (typically 2 cubic feet each) or in bulk by the cubic yard. Bulk is significantly cheaper for larger areas — a cubic yard covers about 108 sq ft at 3 inches deep, equivalent to about 13.5 bags.",
            ],
            highlight: "A 10×10 ft garden bed with 3 inches of mulch = 100 × 0.25 = 25 cu ft = 0.93 cu yd. That's about 13 bags (2 cu ft each). At $5/bag = $65 in bags vs. ~$35 for bulk.",
        },
        faq: [
            { question: "How often should mulch be replaced?", answer: "Organic mulch (bark, wood chips) decomposes and should be refreshed annually with 1–2 inches of new material. Fully replace every 2–3 years. Inorganic mulch (stone, rubber) is essentially permanent but may need occasional top-up." },
            { question: "What type of mulch is best?", answer: "Shredded hardwood bark: best all-around for landscaping beds. Cedar mulch: natural insect repellent. Pine straw: excellent for acidic-soil plants. Rubber mulch: best for playgrounds. Stone: best for drainage areas and permanent installations." },
        ],
    },
    "brick-calculator": {
        subtitle: "Calculate how many bricks you need for a wall, patio, or walkway. Accounts for brick size, mortar joints, and waste factor.",
        explanation: {
            heading: "How to Calculate Bricks Needed",
            paragraphs: [
                "Standard modular bricks are 7⅝ × 2¼ × 3⅝ inches (actual) or 8 × 2⅔ × 4 inches (nominal, with mortar). The most common mortar joint is ⅜ inch. When calculating, add the mortar joint width to the brick dimensions to get the effective coverage per brick.",
                "For walls, divide the wall face area by the face area of one brick (including mortar). For patios laid flat, use the brick's length × width (without mortar for dry-laid, with mortar for mortared). Always add 5–10% for cuts and breakage.",
            ],
            highlight: "A 20×8 ft brick wall using standard modular bricks (8\" × 2.67\" nominal with mortar) = 160 sq ft ÷ 0.148 sq ft/brick = ~1,081 bricks. With 5% waste = ~1,135 bricks.",
        },
        faq: [
            { question: "How many bricks are on a pallet?", answer: "Standard modular bricks: typically 500–534 per pallet. King-size bricks: approximately 360 per pallet. Paver bricks: 480–540 per pallet depending on size. Weights range from 2,000–2,500 lbs per pallet." },
            { question: "How much mortar do I need per brick?", answer: "For standard modular bricks, plan 1 bag (80 lb) of mortar mix per 35–40 bricks. This assumes standard ⅜-inch joints. Thicker joints or larger bricks require proportionally more mortar." },
        ],
    },
    "fence-calculator": {
        subtitle: "Calculate fencing materials — posts, rails, pickets, or panels needed for any fence. Supports wood picket, pre-built panel, and chain-link types.",
        explanation: {
            heading: "How to Calculate Fence Materials",
            paragraphs: [
                "Fence material calculations start with the total fence length. Divide by post spacing (typically 8 feet for wood fences, 10 feet for chain-link) and add 1 for the end post. Each section between posts needs horizontal rails — 2 rails for fences under 5 feet, 3 rails for taller fences.",
                "For wood picket fences, calculate the number of pickets by dividing fence length by the picket width (typically 3.5–5.5 inches). For pre-built panels (typically 6×8 or 4×8 feet), one panel fills each section. Don't forget concrete for post holes — plan 2 bags of 50 lb concrete per post.",
            ],
            highlight: "A 100 ft wood picket fence with 6 ft height and 8 ft spacing = 14 posts, 39 rails (3 per section), 200 pickets (6\" wide), and 28 bags of concrete.",
        },
        faq: [
            { question: "How deep should fence posts be?", answer: "The general rule is 1/3 the total post length underground, plus 6 inches. For a 6-foot fence with 8-foot posts, set posts 2.5–3 feet deep. In areas with frost, posts must extend below the frost line." },
            { question: "How far apart should fence posts be?", answer: "8 feet on center is standard for wood fences using standard lumber lengths. Chain-link: 10 feet. Vinyl: 6–8 feet depending on panel size. Shorter spacing provides more strength but costs more in materials." },
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
        subtitle: "Calculate board feet for any lumber purchase. Enter board dimensions and quantity to get total board footage and estimated cost.",
        explanation: {
            heading: "How to Calculate Board Feet",
            paragraphs: [
                "A board foot is the standard unit for rough lumber measurement, equal to a piece 1 inch thick × 12 inches wide × 12 inches long (144 cubic inches). The formula is: Board Feet = (Length in ft × Width in inches × Thickness in inches) ÷ 12.",
                "Lumber is sold in nominal dimensions (2×4, 2×6, etc.) which are larger than actual dimensions. A '2×4' actually measures 1.5 × 3.5 inches. For board foot calculations, use the actual dimensions for dressed/surfaced lumber, or nominal dimensions for rough-sawn lumber as sold by sawmills.",
            ],
            highlight: "10 boards of 8 ft × 6\" × 1\" = 10 × (8 × 6 × 1 ÷ 12) = 10 × 4 = 40 board feet. At $5/BF = $200 total.",
        },
        faq: [
            { question: "What is the difference between nominal and actual lumber dimensions?", answer: "Nominal is the rough-cut size; actual is after drying and planing. Example: 2×4 nominal = 1.5×3.5 actual, 2×6 = 1.5×5.5, 2×8 = 1.5×7.25, 2×10 = 1.5×9.25, 2×12 = 1.5×11.25, 4×4 = 3.5×3.5." },
            { question: "How much does lumber cost per board foot?", answer: "Pine/SPF: $2–$5/BF. Oak: $4–$8/BF. Walnut: $8–$15/BF. Cherry: $6–$10/BF. Maple: $5–$8/BF. Cedar: $4–$7/BF. Prices vary by region, grade, and market conditions." },
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
        subtitle: "Calculate how much carpet you need for any room. Get results in square feet, square yards, and total cost including waste factor.",
        explanation: {
            heading: "How to Calculate Carpet Needs",
            paragraphs: [
                "Carpet is sold by the square yard (9 sq ft). To calculate: measure the room length and width in feet, multiply for square footage, add waste factor (10% minimum), then divide by 9 to convert to square yards. Carpet comes in standard widths (12 ft or 15 ft), so seam placement may require additional material.",
                "Professional installers always add 10–15% waste for seaming, pattern matching, and fitting around obstacles. For patterned carpet, add 15–20% because patterns must align at seams. Always buy from the same dye lot to ensure color consistency.",
            ],
            highlight: "A 12×10 ft room = 120 sq ft. With 10% waste = 132 sq ft ÷ 9 = 14.7 sq yd. At $25/sq yd = $367 for materials.",
        },
        faq: [
            { question: "How much does carpet installation cost?", answer: "Carpet materials: $1–$10+ per sq ft depending on quality. Installation labor: $0.50–$1.50 per sq ft. Padding: $0.30–$0.60 per sq ft. Total installed cost for a 12×10 room: $250–$1,500+ depending on carpet quality." },
            { question: "How long does carpet last?", answer: "Economy carpet: 3–5 years. Mid-grade: 5–10 years. Premium: 10–15+ years. Lifespan depends heavily on traffic, maintenance, and padding quality. High-quality padding extends carpet life significantly." },
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
        subtitle: "Calculate how many 4×8 plywood sheets you need for floors, walls, roofs, or subfloors. Includes waste factor and cost estimator.",
        explanation: {
            heading: "How to Calculate Plywood Sheets",
            paragraphs: [
                "A standard plywood sheet is 4 feet × 8 feet = 32 square feet. To find how many sheets you need, calculate the total area, add a waste factor (10% for rectangular areas, 15% for complex shapes), and divide by 32. Round up — you can't buy partial sheets.",
                "Plywood comes in various thicknesses: ¼ inch (underlayment), ⅜ inch (wall sheathing), ½ inch (roof sheathing), ⅝ inch (subfloor residential), and ¾ inch (subfloor, heavy-duty). CDX is the standard structural grade, while sanded plywood is used for visible applications.",
            ],
            highlight: "A 20×12 ft subfloor with 10% waste: 240 sq ft × 1.10 = 264 sq ft ÷ 32 sq ft/sheet = 9 sheets of ¾\" plywood. At $45/sheet = $405.",
        },
        faq: [
            { question: "What thickness plywood do I need?", answer: "Subfloor: ¾\" (23/32\"). Roof sheathing: ½\" or ⅝\". Wall sheathing: ⅜\" or ½\". Underlayment: ¼\". Cabinet backs: ¼\". Shelving: ¾\". Always match to code requirements for your specific application and joist/rafter spacing." },
            { question: "What's the difference between CDX and OSB?", answer: "CDX plywood: layers of wood veneer cross-laminated, stronger and more water-resistant. OSB: oriented strand board made from compressed wood strands, cheaper but swells when wet. For subfloors and roof sheathing, both are code-approved. CDX is preferred for moisture-prone areas." },
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
        subtitle: "Calculate grass seed needed for new lawns or overseeding. Select seed type and area for pounds and bags required.",
        explanation: {
            heading: "How Much Grass Seed Do I Need?",
            paragraphs: [
                "Seeding rates vary by grass species. Kentucky bluegrass: 2–3 lbs per 1,000 sq ft. Tall fescue: 6–8 lbs. Bermuda grass: 1–2 lbs. Perennial ryegrass: 6–8 lbs. For overseeding existing lawns, use half the new lawn rate.",
                "For best germination: prepare the soil (rake, dethatch, or aerate), spread seed evenly with a broadcast or drop spreader, lightly rake seed into the top 1/4 inch of soil, and keep moist (not soaked) for 2–3 weeks. Apply starter fertilizer at seeding time.",
            ],
            highlight: "2,000 sq ft new lawn with Kentucky bluegrass at 3 lbs/1000 sf: 6 lbs of seed = 2 bags of 5 lb seed. Overseeding the same area: 3 lbs = 1 bag.",
        },
        faq: [
            { question: "When is the best time to seed a lawn?", answer: "Cool-season grasses (bluegrass, fescue, rye): late August to mid-October (ideal) or early spring. Warm-season grasses (Bermuda, zoysia): late spring to early summer when soil temps reach 65–70°F. Fall seeding is generally more successful due to less weed competition." },
            { question: "How long does grass seed take to germinate?", answer: "Kentucky bluegrass: 14–30 days. Tall fescue: 7–14 days. Perennial rye: 5–10 days. Bermuda: 10–30 days. Zoysia: 14–21 days. Keep the seedbed consistently moist — water lightly 2–3 times daily until germination, then reduce to once daily." },
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
    "cubic-feet-calculator": {
        subtitle: "Calculate volume in cubic feet from length, width, and height. Converts to cubic yards, cubic meters, gallons, and liters.",
        explanation: {
            heading: "How to Calculate Cubic Feet",
            paragraphs: [
                "Cubic feet = length (ft) × width (ft) × height (ft). One cubic foot equals 1,728 cubic inches, 7.48 US gallons, or 28.3 liters. It's the standard unit for measuring volume in construction, shipping, and storage.",
                "Common uses: refrigerator/freezer capacity, moving truck volume, storage unit sizing, concrete volume, firewood (a cord = 128 cu ft), and HVAC airflow (CFM = cubic feet per minute).",
            ],
            highlight: "A 10 × 8 × 4 ft space = 320 cubic feet = 11.85 cubic yards = 2,394 US gallons = 9,061 liters.",
        },
        faq: [
            { question: "How do I convert cubic feet to cubic yards?", answer: "Divide by 27. One cubic yard = 27 cubic feet (3 ft × 3 ft × 3 ft). For example, 81 cubic feet ÷ 27 = 3 cubic yards." },
            { question: "How many gallons in a cubic foot?", answer: "7.48 US gallons. So a 10 cubic foot container holds 74.8 gallons. To convert cubic feet to gallons, multiply by 7.48." },
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
        subtitle: "Add, subtract, multiply, and divide measurements in feet and inches. Essential for construction math.",
        explanation: {
            heading: "Construction Math: Feet and Inches",
            paragraphs: [
                "Construction measurements are typically in feet and inches (e.g., 10' 6\"). Adding, subtracting, or dividing these mixed measurements requires converting to a single unit, performing the operation, then converting back.",
                "This calculator handles the conversion automatically. Enter two measurements in feet and inches, select an operation, and get the result in feet-inches, decimal feet, total inches, and meters.",
            ],
            highlight: "10' 6\" + 5' 3\" = 15' 9\" = 189 inches = 15.75 decimal feet = 4.801 meters.",
        },
        faq: [
            { question: "How do I convert feet and inches to decimal feet?", answer: "Divide inches by 12 and add to feet. For example, 10' 6\" = 10 + (6/12) = 10.5 feet. For 8' 3\" = 8 + (3/12) = 8.25 feet." },
            { question: "How do I add feet and inches?", answer: "Add feet and inches separately, then carry over: 10' 9\" + 8' 7\" = 18' 16\". Since 16\" > 12\", subtract 12\" and add 1': 19' 4\"." },
        ],
    },
    "inch-fraction-calculator": {
        subtitle: "Convert decimal inches to fractions and fractions to decimals. Find the nearest standard tape measure fraction.",
        explanation: {
            heading: "Decimal to Fraction Inch Conversion",
            paragraphs: [
                "Tape measures and construction plans use fractions (1/2\", 3/8\", 5/16\"). This calculator converts any decimal measurement to the nearest standard fraction at your chosen precision (1/8, 1/16, 1/32, or 1/64 inch).",
                "For example, 3.375\" = 3 3/8\". The calculator also shows millimeter and centimeter equivalents, making it useful for converting between imperial and metric measurements.",
            ],
            highlight: "3.375\" = 3 3/8\" (at 1/16 precision). In metric: 85.72 mm = 8.57 cm.",
        },
        faq: [
            { question: "What fraction is 0.625 inches?", answer: "5/8 inch. Common decimals: 0.125 = 1/8, 0.25 = 1/4, 0.375 = 3/8, 0.5 = 1/2, 0.625 = 5/8, 0.75 = 3/4, 0.875 = 7/8." },
            { question: "How do I read a tape measure?", answer: "The longest marks are inches. The next longest is 1/2\". Then 1/4\" marks, 1/8\" marks, and the shortest marks are 1/16\". Count the smallest marks from the last whole inch to read the fraction." },
        ],
    },
    "scale-conversion-calculator": {
        subtitle: "Convert scale model measurements to actual dimensions. Works for architectural blueprints, maps, and model building.",
        explanation: {
            heading: "How to Use Scale Conversions",
            paragraphs: [
                "Architectural and engineering drawings use scale ratios to represent real dimensions on paper. Common scales: 1/4\" = 1' (1:48), 1/8\" = 1' (1:96), 1\" = 1' (1:12). To find the actual dimension, multiply the measured drawing dimension by the scale ratio.",
                "For example, at 1/4\" = 1' scale, a wall that measures 3\" on the blueprint is actually 3 × 48 = 144 inches = 12 feet in reality.",
            ],
            highlight: "Blueprint at 1/4\" = 1' scale: a 6\" measurement on paper = 6 × 48 = 288\" = 24 feet actual.",
        },
        faq: [
            { question: "What does 1/4 inch scale mean?", answer: "1/4\" = 1' means every 1/4 inch on the drawing represents 1 foot in real life. The ratio is 1:48. A 2-inch line on the blueprint = 8 feet actual. This is the most common residential architectural scale." },
            { question: "How do I read a blueprint scale?", answer: "Use an architect's scale ruler, or measure with a regular ruler and multiply. At 1/4\" = 1' scale, multiply inches by 4 to get feet. At 1/8\" = 1' scale, multiply inches by 8 to get feet." },
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
        subtitle: "Convert square feet to cubic yards by adding depth. Calculate how many cubic yards of material to order for any project.",
        explanation: {
            heading: "Square Feet to Cubic Yards",
            paragraphs: [
                "Cubic yards = (square feet × depth in feet) ÷ 27. Most bulk materials (gravel, soil, mulch, sand) are sold by the cubic yard. Always add 10% for waste and settling.",
                "Quick reference at common depths: at 2\" deep, 1 cubic yard covers 162 sq ft. At 3\", 108 sq ft. At 4\", 81 sq ft. At 6\", 54 sq ft. At 12\", 27 sq ft.",
            ],
            highlight: "500 sq ft at 4 inches deep: (500 × 0.333) ÷ 27 = 6.17 cubic yards. With 10% waste: 6.79 cu yd — order 7.",
        },
        faq: [
            { question: "How many cubic yards do I need?", answer: "Multiply area (sq ft) × depth (inches) ÷ 324. For example: 1,000 sq ft × 4 inches ÷ 324 = 12.35 cubic yards. Add 10% = 13.6 — order 14 cubic yards." },
            { question: "How much area does 1 cubic yard cover?", answer: "At 2\" depth: 162 sq ft. At 3\" depth: 108 sq ft. At 4\" depth: 81 sq ft. At 6\" depth: 54 sq ft. At 12\" depth: 27 sq ft." },
        ],
    },
    "square-inches-calculator": {
        subtitle: "Calculate area in square inches. Convert to square feet, square centimeters, and square millimeters.",
        explanation: {
            heading: "How to Calculate Square Inches",
            paragraphs: [
                "Square inches = length (in) × width (in). There are 144 square inches in one square foot (12 × 12). Square inches are used for smaller areas like tiles, screens, paper, and cross-sections.",
                "Common conversions: 1 sq in = 6.45 cm² = 645.16 mm². A standard sheet of paper (8.5 × 11\") = 93.5 sq in. A 12 × 12\" tile = 144 sq in = 1 sq ft.",
            ],
            highlight: "12 × 8 inches = 96 square inches = 0.667 square feet = 619.4 cm².",
        },
        faq: [
            { question: "How many square inches in a square foot?", answer: "144 square inches = 1 square foot (12 inches × 12 inches). To convert square inches to square feet, divide by 144." },
            { question: "How do I convert square inches to square centimeters?", answer: "Multiply by 6.4516. For example, 96 sq in × 6.4516 = 619.4 cm²." },
        ],
    },
    "square-meters-calculator": {
        subtitle: "Calculate area in square meters. Convert between square meters, square feet, square yards, acres, and hectares.",
        explanation: {
            heading: "How to Calculate Square Meters",
            paragraphs: [
                "Square meters = length (m) × width (m). One square meter = 10.764 square feet. It's the SI unit for area and is used worldwide for real estate, construction, and land measurement.",
                "Common references: a parking space ≈ 12 m², a single car garage ≈ 15–20 m², a tennis court = 260.87 m², a basketball court = 420 m², one hectare = 10,000 m².",
            ],
            highlight: "5 × 4 meters = 20 m² = 215.28 sq ft = 23.92 sq yd = 0.002 hectares.",
        },
        faq: [
            { question: "How do I convert square meters to square feet?", answer: "Multiply by 10.764. For example, 20 m² × 10.764 = 215.28 sq ft. To convert sq ft to sq m, divide by 10.764." },
            { question: "How big is 100 square meters?", answer: "About 1,076 square feet — roughly a 10 × 10 meter area (33 × 33 ft). It's about the size of a small apartment or a large living room." },
        ],
    },
    "square-yards-calculator": {
        subtitle: "Calculate area in square yards from dimensions. Convert between square yards, square feet, and square meters.",
        explanation: {
            heading: "How to Calculate Square Yards",
            paragraphs: [
                "Square yards = (length in feet × width in feet) ÷ 9. One square yard = 9 square feet = 0.8361 square meters. Square yards are commonly used for carpet, fabric, and flooring pricing.",
                "Quick conversion: divide square feet by 9 to get square yards. For example, a 12 × 10 ft room = 120 sq ft ÷ 9 = 13.33 sq yd of carpet needed.",
            ],
            highlight: "12 × 10 ft room = 120 sq ft = 13.33 sq yd = 11.15 m². Carpet at $25/sq yd = $333.",
        },
        faq: [
            { question: "How many square feet in a square yard?", answer: "9 square feet = 1 square yard (3 ft × 3 ft). To convert sq ft to sq yd, divide by 9." },
            { question: "Why is carpet sold in square yards?", answer: "Carpet rolls are typically 12 feet (4 yards) wide, making square yards a natural measurement. Some retailers now list prices per square foot, but the rolls are still manufactured in standard yard widths." },
        ],
    },
    "tank-volume-calculator": {
        subtitle: "Calculate tank volume for rectangular, cylindrical, and oval tanks. Get capacity in gallons, liters, and cubic feet.",
        explanation: {
            heading: "How to Calculate Tank Volume",
            paragraphs: [
                "Tank volume formulas: Rectangular = L × W × H. Cylindrical = π × r² × H. Oval = π × a × b × L (where a and b are the semi-axes of the elliptical cross-section). Enter dimensions in inches.",
                "Convert cubic inches to gallons by dividing by 231 (US) or by 277.42 (UK/Imperial). A standard 55-gallon drum is approximately 23\" diameter × 34\" tall. A 275-gallon oil tank is roughly 27\" × 44\" × 60\".",
            ],
            highlight: "Rectangular tank 48\" × 24\" × 36\" = 41,472 cu in = 179.5 gallons = 679.5 liters.",
        },
        faq: [
            { question: "How many gallons in my tank?", answer: "Rectangular: (L × W × H in inches) ÷ 231 = US gallons. Cylindrical: (π × r² × H in inches) ÷ 231 = US gallons. For example, a 24\" diameter × 48\" tall cylinder: 21,715 cu in ÷ 231 = 94 gallons." },
            { question: "How do I calculate a partially filled tank?", answer: "For a vertical tank: calculate full volume, then multiply by (current fill height ÷ total height). For a horizontal cylinder, the partial volume calculation is more complex — use the measured fill height with a tank chart for your specific diameter." },
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
