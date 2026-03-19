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
    "liter-to-kg-converter": {
        subtitle: "Convert liters (L) to kilograms (kg) for any substance. Select from 20 common ingredients or enter a custom density for instant, accurate volume-to-weight conversion at liter scale.",
        contentHTML: `
            <h3>How to Convert Liters to Kilograms</h3>
            <p>Liters (L) measure <strong>volume</strong> — one liter equals 1,000 milliliters or about 0.264 US gallons. Kilograms (kg) measure <strong>mass</strong>. The conversion requires knowing the <strong>density</strong> of the substance.</p>
            <p>The conversion formula is:</p>
            <div class="explanation__highlight">
                <strong>kilograms = liters × density (kg/L)</strong><br/>
                For example: 5 liters of water = 5 × 1.0 = <strong>5 kg</strong> (11.02 lbs), while 5 liters of olive oil = 5 × 0.92 = <strong>4.6 kg</strong> (10.14 lbs).
            </div>
            <p><strong>Key insight:</strong> The density in kg/L is numerically the same as g/mL. Water has a density of 1.0 kg/L (= 1.0 g/mL), so 1 liter of water weighs exactly 1 kilogram. For any other substance, the weight per liter differs.</p>

            <h3>Why 1 Liter Does NOT Always Weigh 1 Kilogram</h3>
            <p>The original definition of the kilogram was based on water — 1 kg was the mass of 1 liter of water at 4°C. This is why people often assume 1 L = 1 kg. But this only holds for water:</p>
            <ul>
                <li><strong>1 liter of honey</strong> = 1.42 kg (3.13 lbs) — 42% heavier than water</li>
                <li><strong>1 liter of olive oil</strong> = 0.92 kg (2.03 lbs) — 8% lighter than water</li>
                <li><strong>1 liter of flour</strong> = 0.53 kg (1.17 lbs) — almost half the weight of water</li>
                <li><strong>1 liter of rolled oats</strong> = 0.36 kg (0.79 lbs) — barely a third of water's weight</li>
            </ul>

            <h3>Liter to Kilogram Reference Table — Common Substances</h3>
            <table>
                <thead><tr><th>Substance</th><th>Density (kg/L)</th><th>1 L =</th><th>5 L =</th><th>10 L =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00</td><td>1.00 kg</td><td>5.00 kg</td><td>10.00 kg</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03</td><td>1.03 kg</td><td>5.15 kg</td><td>10.30 kg</td></tr>
                    <tr><td><strong>Heavy Cream</strong></td><td>1.01</td><td>1.01 kg</td><td>5.05 kg</td><td>10.10 kg</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.53</td><td>0.53 kg</td><td>2.65 kg</td><td>5.30 kg</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85</td><td>0.85 kg</td><td>4.25 kg</td><td>8.50 kg</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.42</td><td>1.42 kg</td><td>7.10 kg</td><td>14.20 kg</td></tr>
                    <tr><td><strong>Maple Syrup</strong></td><td>1.33</td><td>1.33 kg</td><td>6.65 kg</td><td>13.30 kg</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.92</td><td>0.92 kg</td><td>4.60 kg</td><td>9.20 kg</td></tr>
                    <tr><td><strong>Vegetable Oil</strong></td><td>0.92</td><td>0.92 kg</td><td>4.60 kg</td><td>9.20 kg</td></tr>
                    <tr><td><strong>Butter (melted)</strong></td><td>0.91</td><td>0.91 kg</td><td>4.55 kg</td><td>9.10 kg</td></tr>
                    <tr><td><strong>Table Salt</strong></td><td>1.22</td><td>1.22 kg</td><td>6.10 kg</td><td>12.20 kg</td></tr>
                    <tr><td><strong>Rice (uncooked)</strong></td><td>0.85</td><td>0.85 kg</td><td>4.25 kg</td><td>8.50 kg</td></tr>
                </tbody>
            </table>

            <h3>Liters to US Customary Units</h3>
            <p>Since this converter is designed for a US audience, here's how liters relate to common US volume measurements:</p>
            <table>
                <thead><tr><th>Liters</th><th>US Gallons</th><th>US Quarts</th><th>US Pints</th><th>US Cups</th><th>Fluid Ounces</th></tr></thead>
                <tbody>
                    <tr><td>0.5 L</td><td>0.132</td><td>0.528</td><td>1.057</td><td>2.113</td><td>16.907</td></tr>
                    <tr><td>1 L</td><td>0.264</td><td>1.057</td><td>2.113</td><td>4.227</td><td>33.814</td></tr>
                    <tr><td>2 L</td><td>0.528</td><td>2.113</td><td>4.227</td><td>8.454</td><td>67.628</td></tr>
                    <tr><td>3.785 L</td><td>1.000</td><td>4.000</td><td>8.000</td><td>16.000</td><td>128.000</td></tr>
                    <tr><td>5 L</td><td>1.321</td><td>5.283</td><td>10.567</td><td>21.134</td><td>169.070</td></tr>
                    <tr><td>10 L</td><td>2.642</td><td>10.567</td><td>21.134</td><td>42.268</td><td>338.140</td></tr>
                    <tr><td>20 L</td><td>5.283</td><td>21.134</td><td>42.268</td><td>84.535</td><td>676.280</td></tr>
                </tbody>
            </table>
            <p><em>Note: 1 US gallon = 3.785 liters. This is different from an Imperial (UK) gallon, which is 4.546 liters.</em></p>

            <h3>When You Need Liter-to-Kilogram Conversion</h3>
            <ul>
                <li><strong>Cooking and catering at scale</strong>: Restaurant and catering recipes often specify liquids in liters but dry goods in kilograms. Converting between the two ensures accurate bulk preparation.</li>
                <li><strong>Aquariums and water features</strong>: Knowing that 1 liter of water = 1 kg helps you calculate the total weight of a filled aquarium. A 200-liter (53-gallon) tank weighs 200 kg (441 lbs) of water alone — plus the tank itself.</li>
                <li><strong>Shipping and freight</strong>: Carriers charge by weight, not volume. If you're shipping 50 liters of olive oil, you need to know it weighs 46 kg (101 lbs), not 50 kg — which could affect your shipping bracket.</li>
                <li><strong>Chemistry and industrial applications</strong>: Chemical reactions require precise mass inputs. When working with large volumes of liquids, converting liters to kg ensures stoichiometric accuracy.</li>
                <li><strong>Homebrewing and winemaking</strong>: Brewers often measure ingredients by volume (liters) but need weights for shipping, recipe scaling, and gravity calculations.</li>
                <li><strong>Fuel and automotive</strong>: Gasoline has a density of about 0.74 kg/L. A full 60-liter (16-gallon) tank holds about 44.4 kg (98 lbs) of fuel.</li>
            </ul>

            <h3>What Is a Liter? What Is a Kilogram?</h3>
            <p>A <strong>liter</strong> is a metric unit of volume equal to 1,000 cubic centimeters (cm³), 1,000 milliliters, or about 0.264 US gallons. It's abbreviated as <strong>L</strong> (capitalized to distinguish it from the number "1").</p>
            <p>A <strong>kilogram</strong> is the SI base unit of mass, equal to 1,000 grams or about 2.205 pounds. Since 2019, it's formally defined using the Planck constant rather than a physical artifact. The prefix "kilo-" means 1,000, so 1 kg = 1,000 g. It's abbreviated as <strong>kg</strong>.</p>
            <p>Historically, the kilogram was defined as the mass of 1 liter of water at 4°C — which is why water's density of exactly 1.0 kg/L serves as the universal baseline for volume-to-weight conversions.</p>
        `,
        faq: [
            { question: "How many kilograms is 1 liter?", answer: "It depends on the substance. 1 liter of water weighs exactly 1 kg. But 1 liter of honey weighs 1.42 kg, and 1 liter of flour weighs only 0.53 kg. The formula is: kg = liters × density (kg/L). Use our converter above for instant results." },
            { question: "How much does 1 liter of water weigh?", answer: "Exactly 1 kilogram (2.205 pounds). This is by definition — the kilogram was originally defined as the mass of 1 liter of water at 4°C. This makes water the universal baseline for volume-to-weight conversions." },
            { question: "How do I convert liters to pounds?", answer: "First convert liters to kg (multiply by density), then multiply by 2.20462 to get pounds. For example: 5 liters of milk = 5 × 1.03 = 5.15 kg × 2.20462 = 11.35 pounds. Our calculator does both conversions instantly." },
            { question: "How many liters in a US gallon?", answer: "1 US gallon = 3.785 liters. This is different from an Imperial (UK) gallon, which is 4.546 liters. A US gallon of water weighs about 3.785 kg (8.34 lbs)." },
            { question: "Does 1 liter of oil weigh 1 kilogram?", answer: "No — most cooking oils have a density of about 0.92 kg/L, so 1 liter of oil weighs about 0.92 kg (2.03 lbs). This is why oil floats on water — it's less dense." },
            { question: "How much does a full aquarium weigh?", answer: "Multiply the volume in liters by 1.0 kg/L (for water). A 100-liter (26.4-gallon) tank holds 100 kg (220 lbs) of water, plus the weight of the tank, gravel, and decorations. Always check your floor's load capacity for large tanks." },
        ],
    },
    "gram-to-cup-converter": {
        subtitle: "Convert grams (g) to US cups for any ingredient. Select from 20 common cooking and baking ingredients or enter a custom density. See results in cups, tablespoons, and teaspoons instantly.",
        contentHTML: `
            <h3>How to Convert Grams to Cups</h3>
            <p>Grams (g) measure <strong>weight</strong>. US cups measure <strong>volume</strong>. Since different ingredients have different densities, the same weight of two ingredients fills different amounts of a measuring cup.</p>
            <p>The conversion is a two-step process:</p>
            <div class="explanation__highlight">
                <strong>Step 1:</strong> Convert grams to milliliters: <strong>mL = grams ÷ density (g/mL)</strong><br/>
                <strong>Step 2:</strong> Convert milliliters to cups: <strong>cups = mL ÷ 236.588</strong><br/><br/>
                <strong>Combined formula: cups = grams ÷ (density × 236.588)</strong><br/><br/>
                Example: 250g of all-purpose flour = 250 ÷ (0.53 × 236.588) = 250 ÷ 125.39 = <strong>1.99 cups</strong> (≈ 2 cups)
            </div>

            <h3>How Many Cups Is…? — Popular Answers</h3>
            <p>These are the most commonly searched gram-to-cup conversions for baking and cooking:</p>
            <table>
                <thead><tr><th>Ingredient</th><th>50g</th><th>100g</th><th>150g</th><th>200g</th><th>250g</th><th>500g</th></tr></thead>
                <tbody>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.40 cups</td><td>0.80 cups</td><td>1.20 cups</td><td>1.59 cups</td><td>1.99 cups</td><td>3.99 cups</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.25 cups</td><td>0.50 cups</td><td>0.75 cups</td><td>0.99 cups</td><td>1.24 cups</td><td>2.49 cups</td></tr>
                    <tr><td><strong>Powdered Sugar</strong></td><td>0.38 cups</td><td>0.75 cups</td><td>1.13 cups</td><td>1.51 cups</td><td>1.89 cups</td><td>3.77 cups</td></tr>
                    <tr><td><strong>Brown Sugar (packed)</strong></td><td>0.23 cups</td><td>0.45 cups</td><td>0.68 cups</td><td>0.91 cups</td><td>1.14 cups</td><td>2.27 cups</td></tr>
                    <tr><td><strong>Butter</strong></td><td>0.23 cups</td><td>0.46 cups</td><td>0.70 cups</td><td>0.93 cups</td><td>1.16 cups</td><td>2.32 cups</td></tr>
                    <tr><td><strong>Honey</strong></td><td>0.15 cups</td><td>0.30 cups</td><td>0.45 cups</td><td>0.59 cups</td><td>0.74 cups</td><td>1.49 cups</td></tr>
                    <tr><td><strong>Cocoa Powder</strong></td><td>0.41 cups</td><td>0.81 cups</td><td>1.22 cups</td><td>1.63 cups</td><td>2.03 cups</td><td>4.06 cups</td></tr>
                    <tr><td><strong>Rolled Oats</strong></td><td>0.59 cups</td><td>1.17 cups</td><td>1.76 cups</td><td>2.35 cups</td><td>2.94 cups</td><td>5.87 cups</td></tr>
                    <tr><td><strong>Rice (uncooked)</strong></td><td>0.25 cups</td><td>0.50 cups</td><td>0.75 cups</td><td>0.99 cups</td><td>1.24 cups</td><td>2.49 cups</td></tr>
                    <tr><td><strong>Water</strong></td><td>0.21 cups</td><td>0.42 cups</td><td>0.63 cups</td><td>0.85 cups</td><td>1.06 cups</td><td>2.11 cups</td></tr>
                </tbody>
            </table>

            <h3>Cup Subdivisions — Quick Reference</h3>
            <p>US recipes often use fractions of cups. Here's how they convert to other volume units:</p>
            <table>
                <thead><tr><th>Measurement</th><th>Cups</th><th>Tablespoons</th><th>Teaspoons</th><th>Milliliters</th></tr></thead>
                <tbody>
                    <tr><td>1 cup</td><td>1</td><td>16</td><td>48</td><td>236.59 mL</td></tr>
                    <tr><td>3/4 cup</td><td>0.75</td><td>12</td><td>36</td><td>177.44 mL</td></tr>
                    <tr><td>2/3 cup</td><td>0.667</td><td>10⅔</td><td>32</td><td>157.73 mL</td></tr>
                    <tr><td>1/2 cup</td><td>0.5</td><td>8</td><td>24</td><td>118.29 mL</td></tr>
                    <tr><td>1/3 cup</td><td>0.333</td><td>5⅓</td><td>16</td><td>78.86 mL</td></tr>
                    <tr><td>1/4 cup</td><td>0.25</td><td>4</td><td>12</td><td>59.15 mL</td></tr>
                    <tr><td>1/8 cup</td><td>0.125</td><td>2</td><td>6</td><td>29.57 mL</td></tr>
                </tbody>
            </table>

            <h3>US Cup vs. Metric Cup vs. Japanese Cup</h3>
            <p>Not all "cups" are the same:</p>
            <ul>
                <li><strong>US customary cup</strong> = 236.588 mL (used in American recipes — this is what our calculator uses)</li>
                <li><strong>US legal cup</strong> = 240 mL (used on US nutrition labels)</li>
                <li><strong>Metric cup</strong> = 250 mL (used in Australia, New Zealand, Canada)</li>
                <li><strong>Japanese cup</strong> = 200 mL (used in Japanese cooking)</li>
                <li><strong>Imperial cup</strong> = 284.131 mL (historical British measurement, rarely used today)</li>
            </ul>
            <p>This matters: 200g of flour is 1.59 US cups, but only 1.51 metric cups, and 1.89 Japanese cups. Always check which cup standard your recipe uses.</p>

            <h3>When to Convert Grams to Cups</h3>
            <ul>
                <li><strong>Following metric recipes with US measuring tools</strong>: European, Australian, and professional baking recipes specify ingredients in grams. If you only own a set of measuring cups and spoons, you need to convert grams to cups.</li>
                <li><strong>Scaling baking recipes</strong>: A recipe might call for "2 cups of flour," but if you're halving or doubling it, calculating in grams first (then converting back to cups) prevents rounding errors.</li>
                <li><strong>Comparing nutritional information</strong>: US nutrition labels specify serving sizes in grams, but your mental reference might be in cups. Knowing that a 30g serving of cereal = about 1 cup helps you visualize portion sizes.</li>
                <li><strong>Meal planning and portioning</strong>: When you have a 500g bag of flour and need to know how many cups that gives you (about 4 cups), gram-to-cup conversion helps plan how many batches you can make.</li>
            </ul>

            <h3>Common Mistakes When Converting Grams to Cups</h3>
            <ul>
                <li><strong>"1 cup = 240g for everything"</strong> — This only works for water. 1 cup of flour is about 126g, and 1 cup of honey is about 337g. The weight per cup varies wildly by ingredient.</li>
                <li><strong>Using the wrong cup size</strong> — If an Australian recipe says "1 cup," they mean 250 mL (metric cup), not 236.59 mL (US cup). That's a 5.7% difference, which matters in precision baking.</li>
                <li><strong>Not accounting for how you scoop</strong> — A "cup of flour" can weigh 120g (spooned and leveled) or 150g (scooped and packed). Professional recipes in grams eliminate this ambiguity entirely.</li>
                <li><strong>Confusing weight ounces and fluid ounces</strong> — 1 cup = 8 fluid ounces (volume). But 1 cup of flour weighs about 4.4 ounces (weight). These are different measurements.</li>
            </ul>
        `,
        faq: [
            { question: "How many cups is 100 grams of flour?", answer: "100 grams of all-purpose flour is approximately 0.80 cups (about ¾ cup + 1 tablespoon). This is based on flour's density of 0.53 g/mL. The formula: 100 ÷ (0.53 × 236.588) = 0.797 cups." },
            { question: "How many cups is 200 grams of sugar?", answer: "200 grams of granulated sugar is approximately 0.99 cups — essentially 1 cup. Sugar's density (0.85 g/mL) makes it heavier per cup than flour, so 200g fills almost exactly one measuring cup." },
            { question: "How do I convert grams to cups without a scale?", answer: "Use our calculator above — select the ingredient, enter the weight in grams, and get the cup measurement instantly. If you don't have a specific ingredient's density, use the Custom option to enter any density between 0.1 and 3.0 g/mL." },
            { question: "Is 250g of flour 2 cups?", answer: "Very close. 250 grams of all-purpose flour equals approximately 1.99 cups — essentially 2 cups. This is why many baking recipes round 250g of flour to 2 cups for convenience." },
            { question: "Why doesn't 1 cup of flour weigh the same as 1 cup of sugar?", answer: "Because flour and sugar have different densities. Flour (0.53 g/mL) is less dense — it's lighter and fluffier. Sugar (0.85 g/mL) is denser — the granules pack tighter. So 1 cup of flour weighs about 126g while 1 cup of sugar weighs about 201g." },
            { question: "What is the difference between US cups and metric cups?", answer: "A US customary cup = 236.588 mL. A metric cup (used in Australia, Canada) = 250 mL — about 5.7% larger. US nutrition labels use 240 mL. Japanese cups are only 200 mL. Always check which standard your recipe uses." },
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
