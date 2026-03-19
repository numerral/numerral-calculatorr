// Dynamic Converter Hub — /convert/[converter]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import ConversionCalculatorCore from "@/components/calculator/ConversionCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ converter: string }>;
}

export function generateStaticParams() {
    return getCalculatorsByCategory("convert").map((c) => ({ converter: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { converter } = await params;
    const calc = getCalculatorsByCategory("convert").find((c) => c.slug === converter);
    if (!calc) return {};
    return {
        title: `${calc.title}`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/convert/${calc.slug}`) },
    };
}

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    faq?: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "ml-to-gram-converter": {
        subtitle: "Convert milliliters (mL) to grams (g) for any ingredient or substance. Select from 20 common cooking ingredients or enter a custom density for instant, accurate volume-to-weight conversion.",
        contentHTML: `
            <h3>How to Convert Milliliters to Grams</h3>
            <p>Milliliters (mL) measure <strong>volume</strong> — the amount of space a substance occupies. Grams (g) measure <strong>mass</strong> — how heavy it is. Because different substances have different densities, <strong>1 mL does NOT always equal 1 gram</strong>.</p>
            <p>The conversion formula is:</p>
            <div class="explanation__highlight">
                <strong>grams = milliliters × density (g/mL)</strong><br/>
                For example: 100 mL of honey = 100 × 1.42 = <strong>142 grams</strong>, while 100 mL of flour = 100 × 0.53 = <strong>53 grams</strong>.
            </div>

            <h3>What Is Density and Why Does It Matter?</h3>
            <p><strong>Density</strong> is the mass of a substance per unit volume — typically expressed as grams per milliliter (g/mL). Water has a density of exactly 1.0 g/mL at 4°C, which is why it's the baseline: <strong>1 mL of water = 1 gram</strong>. But most other substances differ:</p>
            <ul>
                <li><strong>Heavier than water</strong> (density > 1): Honey (1.42), salt (1.22), maple syrup (1.33), soy sauce (1.08)</li>
                <li><strong>Lighter than water</strong> (density < 1): Flour (0.53), oil (0.92), oats (0.36), cocoa powder (0.52)</li>
            </ul>
            <p>This is why recipes that specify ingredients by weight (grams) are more accurate than those using volume (cups/mL) — the density of flour can vary by 20% or more depending on how tightly it's packed.</p>

            <h3>Common Ingredient Densities — Reference Table</h3>
            <table>
                <thead><tr><th>Ingredient</th><th>Density (g/mL)</th><th>100 mL =</th><th>1 Cup (237 mL) =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00</td><td>100 g</td><td>237 g</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03</td><td>103 g</td><td>244 g</td></tr>
                    <tr><td><strong>Heavy Cream</strong></td><td>1.01</td><td>101 g</td><td>239 g</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.53</td><td>53 g</td><td>126 g</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85</td><td>85 g</td><td>201 g</td></tr>
                    <tr><td><strong>Powdered Sugar</strong></td><td>0.56</td><td>56 g</td><td>133 g</td></tr>
                    <tr><td><strong>Brown Sugar (packed)</strong></td><td>0.93</td><td>93 g</td><td>220 g</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.42</td><td>142 g</td><td>337 g</td></tr>
                    <tr><td><strong>Maple Syrup</strong></td><td>1.33</td><td>133 g</td><td>315 g</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.92</td><td>92 g</td><td>218 g</td></tr>
                    <tr><td><strong>Vegetable Oil</strong></td><td>0.92</td><td>92 g</td><td>218 g</td></tr>
                    <tr><td><strong>Butter (melted)</strong></td><td>0.91</td><td>91 g</td><td>216 g</td></tr>
                    <tr><td><strong>Coconut Oil (melted)</strong></td><td>0.92</td><td>92 g</td><td>218 g</td></tr>
                    <tr><td><strong>Table Salt</strong></td><td>1.22</td><td>122 g</td><td>289 g</td></tr>
                    <tr><td><strong>Cocoa Powder</strong></td><td>0.52</td><td>52 g</td><td>123 g</td></tr>
                    <tr><td><strong>Rice (uncooked)</strong></td><td>0.85</td><td>85 g</td><td>201 g</td></tr>
                    <tr><td><strong>Rolled Oats</strong></td><td>0.36</td><td>36 g</td><td>85 g</td></tr>
                    <tr><td><strong>Baking Powder</strong></td><td>0.90</td><td>90 g</td><td>213 g</td></tr>
                    <tr><td><strong>Soy Sauce</strong></td><td>1.08</td><td>108 g</td><td>256 g</td></tr>
                    <tr><td><strong>Vanilla Extract</strong></td><td>1.04</td><td>104 g</td><td>247 g</td></tr>
                </tbody>
            </table>

            <h3>Kitchen Volume Equivalents</h3>
            <p>When converting recipes between US customary measurements and metric, these equivalents are essential:</p>
            <table>
                <thead><tr><th>US Measure</th><th>Milliliters (mL)</th><th>Grams (Water)</th></tr></thead>
                <tbody>
                    <tr><td>1 teaspoon (tsp)</td><td>4.93 mL</td><td>4.93 g</td></tr>
                    <tr><td>1 tablespoon (tbsp)</td><td>14.79 mL</td><td>14.79 g</td></tr>
                    <tr><td>1 fluid ounce (fl oz)</td><td>29.57 mL</td><td>29.57 g</td></tr>
                    <tr><td>1/4 cup</td><td>59.15 mL</td><td>59.15 g</td></tr>
                    <tr><td>1/3 cup</td><td>78.86 mL</td><td>78.86 g</td></tr>
                    <tr><td>1/2 cup</td><td>118.29 mL</td><td>118.29 g</td></tr>
                    <tr><td>1 cup</td><td>236.59 mL</td><td>236.59 g</td></tr>
                    <tr><td>1 pint</td><td>473.18 mL</td><td>473.18 g</td></tr>
                    <tr><td>1 quart</td><td>946.35 mL</td><td>946.35 g</td></tr>
                </tbody>
            </table>
            <p><em>Note: The gram values above are for water only. For other substances, multiply the mL by the ingredient's density from the table above.</em></p>

            <h3>When to Convert Milliliters to Grams</h3>
            <ul>
                <li><strong>Baking and cooking</strong>: Professional bakers measure by weight (grams) for precision. Converting volume-based recipes to weight-based eliminates variability from how tightly an ingredient is packed.</li>
                <li><strong>Nutrition tracking</strong>: Food labels in the US list serving sizes by weight. If you measure ingredients by volume at home, converting to grams gives you accurate calorie and macro counts.</li>
                <li><strong>Pharmacy and medicine</strong>: Liquid medication dosages are often in mL, but active ingredient amounts are in mg or g. Understanding the density relationship helps verify correct dosing.</li>
                <li><strong>Chemistry and science</strong>: Chemical reactions require precise mass measurements. When mixing liquids of different densities, volume-to-mass conversion ensures accurate stoichiometric ratios.</li>
                <li><strong>Shipping and packaging</strong>: Converting liquid volume to weight helps calculate shipping costs, which are typically based on weight.</li>
            </ul>

            <h3>Why 1 mL Does NOT Equal 1 Gram (Except Water)</h3>
            <p>The common misconception that 1 mL = 1 gram comes from water's unique property: its density is defined as exactly 1.0 g/mL at 4°C. This was actually the original basis for defining the gram — <strong>1 gram was defined as the mass of 1 cubic centimeter (= 1 mL) of water</strong>.</p>
            <p>But for any other substance, the relationship changes:</p>
            <ul>
                <li><strong>100 mL of flour ≈ 53 g</strong> (almost half the weight of water)</li>
                <li><strong>100 mL of honey ≈ 142 g</strong> (42% heavier than water)</li>
                <li><strong>100 mL of rolled oats ≈ 36 g</strong> (barely a third the weight of water)</li>
            </ul>
            <p>This is why professional recipes worldwide are moving to weight-based measurements — they're universally reproducible regardless of how you scoop, pack, or pour an ingredient.</p>
        `,
        faq: [
            { question: "How many grams is 1 mL?", answer: "It depends on the substance. 1 mL of water weighs exactly 1 gram. But 1 mL of honey weighs 1.42 grams (heavier), and 1 mL of flour weighs only 0.53 grams (lighter). The formula is: grams = mL × density (g/mL). Use our converter above to get instant results for 20 common ingredients." },
            { question: "How do I convert mL to grams for cooking?", answer: "Select the ingredient from the dropdown in our calculator above, enter the volume in mL, and get the exact weight in grams instantly. For baking, this is more accurate than using cups because flour density varies by up to 20% depending on how it's scooped or sifted." },
            { question: "Is 100 mL always 100 grams?", answer: "No — only for water. 100 mL of milk is about 103 g, 100 mL of flour is only 53 g, and 100 mL of honey is 142 g. The weight depends on the density of the substance. The '1 mL = 1 g' rule only applies to water." },
            { question: "How many mL are in a cup?", answer: "One US cup equals approximately 236.59 mL. One tablespoon is 14.79 mL, and one teaspoon is 4.93 mL. These are US customary measurements — a UK/Imperial cup is slightly different at 284 mL." },
            { question: "Why do professional bakers use grams instead of cups?", answer: "Because volume measurements like cups are inconsistent — a cup of flour can weigh anywhere from 120g to 150g depending on whether you scooped, spooned, or sifted it. Weighing in grams eliminates this variability entirely, giving you the same result every time." },
            { question: "What is the density of flour in g/mL?", answer: "All-purpose flour has a density of approximately 0.53 g/mL (or about 125-130 grams per cup). This means 100 mL of flour weighs only about 53 grams — roughly half the weight of the same volume of water. Bread flour is slightly denser at about 0.55 g/mL." },
        ],
    },
    "gram-to-ml-converter": {
        subtitle: "Convert grams (g) to milliliters (mL) for any ingredient or substance. Select from 20 common cooking ingredients or enter a custom density for instant, accurate weight-to-volume conversion.",
        contentHTML: `
            <h3>How to Convert Grams to Milliliters</h3>
            <p>Grams (g) measure <strong>mass</strong> — how heavy something is. Milliliters (mL) measure <strong>volume</strong> — the space it occupies. To convert between them, you need to know the <strong>density</strong> of the substance.</p>
            <p>The conversion formula is:</p>
            <div class="explanation__highlight">
                <strong>milliliters = grams ÷ density (g/mL)</strong><br/>
                For example: 100 g of flour = 100 ÷ 0.53 = <strong>188.7 mL</strong> (nearly 2 cups), while 100 g of honey = 100 ÷ 1.42 = <strong>70.4 mL</strong> (less than 1/3 cup).
            </div>

            <h3>Why the Same Weight Takes Up Different Amounts of Space</h3>
            <p>Imagine you have exactly 100 grams of three different ingredients sitting on your kitchen scale. They all weigh the same, but they look completely different:</p>
            <ul>
                <li><strong>100 g of water</strong> = 100 mL (about 0.42 cups) — fits in a small glass</li>
                <li><strong>100 g of flour</strong> = 188.7 mL (about 0.80 cups) — fills nearly a full measuring cup</li>
                <li><strong>100 g of rolled oats</strong> = 277.8 mL (about 1.17 cups) — overflows a measuring cup</li>
                <li><strong>100 g of honey</strong> = 70.4 mL (about 0.30 cups) — barely fills a third of a cup</li>
            </ul>
            <p>This happens because each substance has a different <strong>density</strong>. Lighter, fluffier substances (oats, flour) take up much more space per gram. Dense, heavy substances (honey, salt) take up much less.</p>

            <h3>Gram to Milliliter Reference Table — Common Ingredients</h3>
            <table>
                <thead><tr><th>Ingredient</th><th>Density</th><th>100 g =</th><th>250 g =</th><th>500 g =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00 g/mL</td><td>100 mL</td><td>250 mL</td><td>500 mL</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03 g/mL</td><td>97.1 mL</td><td>242.7 mL</td><td>485.4 mL</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.53 g/mL</td><td>188.7 mL</td><td>471.7 mL</td><td>943.4 mL</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85 g/mL</td><td>117.6 mL</td><td>294.1 mL</td><td>588.2 mL</td></tr>
                    <tr><td><strong>Brown Sugar</strong></td><td>0.93 g/mL</td><td>107.5 mL</td><td>268.8 mL</td><td>537.6 mL</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.42 g/mL</td><td>70.4 mL</td><td>176.1 mL</td><td>352.1 mL</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.92 g/mL</td><td>108.7 mL</td><td>271.7 mL</td><td>543.5 mL</td></tr>
                    <tr><td><strong>Butter (melted)</strong></td><td>0.91 g/mL</td><td>109.9 mL</td><td>274.7 mL</td><td>549.5 mL</td></tr>
                    <tr><td><strong>Table Salt</strong></td><td>1.22 g/mL</td><td>82.0 mL</td><td>204.9 mL</td><td>409.8 mL</td></tr>
                    <tr><td><strong>Cocoa Powder</strong></td><td>0.52 g/mL</td><td>192.3 mL</td><td>480.8 mL</td><td>961.5 mL</td></tr>
                    <tr><td><strong>Rolled Oats</strong></td><td>0.36 g/mL</td><td>277.8 mL</td><td>694.4 mL</td><td>1388.9 mL</td></tr>
                    <tr><td><strong>Maple Syrup</strong></td><td>1.33 g/mL</td><td>75.2 mL</td><td>188.0 mL</td><td>375.9 mL</td></tr>
                </tbody>
            </table>

            <h3>Converting Grams to US Cups</h3>
            <p>American recipes frequently use cups, tablespoons, and teaspoons. Here's how common weights translate to US cups for popular ingredients:</p>
            <table>
                <thead><tr><th>Ingredient</th><th>100 g</th><th>200 g</th><th>500 g</th></tr></thead>
                <tbody>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.80 cups</td><td>1.59 cups</td><td>3.99 cups</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.50 cups</td><td>0.99 cups</td><td>2.49 cups</td></tr>
                    <tr><td><strong>Butter</strong></td><td>0.46 cups</td><td>0.93 cups</td><td>2.32 cups</td></tr>
                    <tr><td><strong>Honey</strong></td><td>0.30 cups</td><td>0.59 cups</td><td>1.49 cups</td></tr>
                    <tr><td><strong>Rolled Oats</strong></td><td>1.17 cups</td><td>2.35 cups</td><td>5.87 cups</td></tr>
                    <tr><td><strong>Cocoa Powder</strong></td><td>0.81 cups</td><td>1.63 cups</td><td>4.06 cups</td></tr>
                    <tr><td><strong>Rice (uncooked)</strong></td><td>0.50 cups</td><td>0.99 cups</td><td>2.49 cups</td></tr>
                </tbody>
            </table>

            <h3>When to Convert Grams to Milliliters</h3>
            <ul>
                <li><strong>Following European or metric recipes</strong>: Many recipes from Europe, Asia, and Australia list ingredients by weight (grams). If you only have volumetric measuring tools (cups, tablespoons), you need to convert grams to mL so you can measure correctly.</li>
                <li><strong>Scaling recipes up or down</strong>: When you know the weight of an ingredient but need to know how much space it takes up in your mixing bowl or pot, gram-to-mL conversion is essential.</li>
                <li><strong>Substituting ingredients</strong>: If a recipe calls for 200g of sugar but you want to use honey instead, converting both to mL helps you understand the volume difference and adjust your mixing/baking time accordingly.</li>
                <li><strong>Science lab work</strong>: When you need a specific mass of a liquid chemical but only have graduated cylinders (which measure volume), you divide grams by density to get the correct mL to pour.</li>
                <li><strong>Portioning and meal prep</strong>: Nutrition labels list serving sizes in grams. Converting to mL or cups helps you visualize portion sizes more intuitively when scooping or pouring.</li>
            </ul>

            <h3>Common Gram-to-mL Mistakes to Avoid</h3>
            <ul>
                <li><strong>Assuming 1 g = 1 mL for everything</strong>: This only works for water. Using this assumption for flour would give you almost twice as much flour as needed.</li>
                <li><strong>Ignoring how ingredients are measured</strong>: "1 cup of flour" can be 120g (spooned) or 150g (scooped). When a recipe says "125g flour," it means exactly 125g — not approximately 1 cup.</li>
                <li><strong>Confusing fluid ounces with ounces</strong>: Fluid ounces (fl oz) measure volume. Ounces (oz) measure weight. They're only the same for water. 1 fl oz of honey weighs about 1.5 oz.</li>
                <li><strong>Not accounting for temperature</strong>: Density changes with temperature. Melted butter (0.91 g/mL) has a different density than solid butter (~0.96 g/mL). Our calculator uses liquid/melted densities for items commonly melted.</li>
            </ul>
        `,
        faq: [
            { question: "How many mL is 1 gram?", answer: "It depends on the substance. 1 gram of water = exactly 1 mL. But 1 gram of flour = about 1.89 mL (more volume), and 1 gram of honey = about 0.70 mL (less volume). The formula is: mL = grams ÷ density. Use our converter above for instant results with 20 common ingredients." },
            { question: "How do I convert grams to cups?", answer: "First convert grams to mL using the formula (mL = grams ÷ density), then divide by 236.59 to get US cups. For example, 250g of flour = 250 ÷ 0.53 = 471.7 mL ÷ 236.59 = about 2 cups. Our calculator does this automatically." },
            { question: "Is 100 grams the same as 100 mL?", answer: "Only for water. 100 grams of flour takes up about 188.7 mL (nearly 2x the volume), while 100 grams of honey takes up only 70.4 mL (about 70% the volume). The difference depends on density." },
            { question: "How do I convert grams to tablespoons?", answer: "Convert grams to mL (divide by density), then divide by 14.79 to get US tablespoons. For example: 30g of sugar = 30 ÷ 0.85 = 35.3 mL ÷ 14.79 = about 2.4 tablespoons." },
            { question: "Why does 1 cup of flour weigh less than 1 cup of sugar?", answer: "Because flour is less dense than sugar. Flour has a density of 0.53 g/mL while sugar is 0.85 g/mL. So a cup of flour weighs about 126g while a cup of sugar weighs about 201g — even though they fill the same space." },
            { question: "What is the most accurate way to measure ingredients?", answer: "Using a digital kitchen scale to measure in grams. This is 100% consistent regardless of how you scoop, pack, or level the ingredient. Volume measurements (cups, tablespoons) can vary by 20% or more depending on technique." },
        ],
    },
};

export default async function ConvertHubPage({ params }: PageProps) {
    const { converter } = await params;
    const allCalcs = getCalculatorsByCategory("convert");
    const calc = allCalcs.find((c) => c.slug === converter);
    if (!calc) notFound();

    const hub = HUB_CONTENT[calc.slug];
    if (!hub) notFound();

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Conversion Calculators", url: `${SITE_URL}/convert` },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, canonicalUrl(`/convert/${calc.slug}`)),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }} >
            <Script
                id={`schema-${calc.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Conversion Calculators", href: "/convert" },
                    { label: calc.title },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{hub.subtitle}</p>
            <AuthorBadge categoryKey="utility" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <ConversionCalculatorCore calcType={calc.calcType || "ml-to-gram"} />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <DynamicExplanation
                heading={hub.explanation?.heading}
                paragraphs={hub.explanation?.paragraphs}
                highlight={hub.explanation?.highlight}
                contentHTML={hub.contentHTML}
            />

            {hub.faq && <FAQAccordion title={`${calc.title} FAQ`} items={hub.faq} />}
        </main >
    );
}
