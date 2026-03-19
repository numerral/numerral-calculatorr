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
    "inch-to-cm-converter": {
        subtitle: "Convert inches to centimeters (in to cm) instantly. Supports fractional inches (1/16″ to 15/16″). See results in cm, mm, meters, and feet with a comprehensive reference table.",
        contentHTML: `
            <h3>How to Convert Inches to Centimeters</h3>
            <p>There are exactly <strong>2.54 centimeters in one inch</strong>. This is an exact conversion factor established by international agreement in 1959, when the international yard was defined as exactly 0.9144 meters.</p>
            <p>The conversion formula is:</p>
            <div class="explanation__highlight">
                <strong>centimeters = inches × 2.54</strong><br/><br/>
                For example: 12 inches = 12 × 2.54 = <strong>30.48 cm</strong> (1 foot).<br/>
                And: 5.5 inches = 5.5 × 2.54 = <strong>13.97 cm</strong>.
            </div>
            <p>To convert back from centimeters to inches, divide by 2.54: <strong>inches = cm ÷ 2.54</strong>. For example, 10 cm = 10 ÷ 2.54 = 3.937 inches.</p>

            <h3>Inches to Centimeters Conversion Chart</h3>
            <p>This reference table covers the most commonly searched inch-to-cm conversions:</p>
            <table>
                <thead><tr><th>Inches</th><th>Centimeters</th><th>Millimeters</th><th>Feet + Inches</th></tr></thead>
                <tbody>
                    <tr><td>1/4″</td><td>0.635 cm</td><td>6.35 mm</td><td>—</td></tr>
                    <tr><td>1/2″</td><td>1.27 cm</td><td>12.7 mm</td><td>—</td></tr>
                    <tr><td>1″</td><td>2.54 cm</td><td>25.4 mm</td><td>—</td></tr>
                    <tr><td>2″</td><td>5.08 cm</td><td>50.8 mm</td><td>—</td></tr>
                    <tr><td>3″</td><td>7.62 cm</td><td>76.2 mm</td><td>—</td></tr>
                    <tr><td>6″</td><td>15.24 cm</td><td>152.4 mm</td><td>0′ 6″</td></tr>
                    <tr><td>12″</td><td>30.48 cm</td><td>304.8 mm</td><td>1′ 0″</td></tr>
                    <tr><td>18″</td><td>45.72 cm</td><td>457.2 mm</td><td>1′ 6″</td></tr>
                    <tr><td>24″</td><td>60.96 cm</td><td>609.6 mm</td><td>2′ 0″</td></tr>
                    <tr><td>36″</td><td>91.44 cm</td><td>914.4 mm</td><td>3′ 0″ (1 yard)</td></tr>
                    <tr><td>48″</td><td>121.92 cm</td><td>1219.2 mm</td><td>4′ 0″</td></tr>
                    <tr><td>60″</td><td>152.40 cm</td><td>1524.0 mm</td><td>5′ 0″</td></tr>
                    <tr><td>72″</td><td>182.88 cm</td><td>1828.8 mm</td><td>6′ 0″</td></tr>
                    <tr><td>84″</td><td>213.36 cm</td><td>2133.6 mm</td><td>7′ 0″</td></tr>
                    <tr><td>96″</td><td>243.84 cm</td><td>2438.4 mm</td><td>8′ 0″</td></tr>
                    <tr><td>120″</td><td>304.80 cm</td><td>3048.0 mm</td><td>10′ 0″</td></tr>
                </tbody>
            </table>

            <h3>Fractional Inches to Centimeters</h3>
            <p>US measurements frequently use fractional inches (like 3/8″ or 5/16″). Here's every 16th of an inch in centimeters:</p>
            <table>
                <thead><tr><th>Fraction</th><th>Decimal Inches</th><th>Centimeters</th><th>Millimeters</th></tr></thead>
                <tbody>
                    <tr><td>1/16″</td><td>0.0625</td><td>0.159 cm</td><td>1.588 mm</td></tr>
                    <tr><td>1/8″</td><td>0.125</td><td>0.318 cm</td><td>3.175 mm</td></tr>
                    <tr><td>3/16″</td><td>0.1875</td><td>0.476 cm</td><td>4.763 mm</td></tr>
                    <tr><td>1/4″</td><td>0.25</td><td>0.635 cm</td><td>6.350 mm</td></tr>
                    <tr><td>5/16″</td><td>0.3125</td><td>0.794 cm</td><td>7.938 mm</td></tr>
                    <tr><td>3/8″</td><td>0.375</td><td>0.953 cm</td><td>9.525 mm</td></tr>
                    <tr><td>7/16″</td><td>0.4375</td><td>1.111 cm</td><td>11.113 mm</td></tr>
                    <tr><td>1/2″</td><td>0.5</td><td>1.270 cm</td><td>12.700 mm</td></tr>
                    <tr><td>9/16″</td><td>0.5625</td><td>1.429 cm</td><td>14.288 mm</td></tr>
                    <tr><td>5/8″</td><td>0.625</td><td>1.588 cm</td><td>15.875 mm</td></tr>
                    <tr><td>11/16″</td><td>0.6875</td><td>1.746 cm</td><td>17.463 mm</td></tr>
                    <tr><td>3/4″</td><td>0.75</td><td>1.905 cm</td><td>19.050 mm</td></tr>
                    <tr><td>13/16″</td><td>0.8125</td><td>2.064 cm</td><td>20.638 mm</td></tr>
                    <tr><td>7/8″</td><td>0.875</td><td>2.223 cm</td><td>22.225 mm</td></tr>
                    <tr><td>15/16″</td><td>0.9375</td><td>2.381 cm</td><td>23.813 mm</td></tr>
                    <tr><td>1″</td><td>1.0</td><td>2.540 cm</td><td>25.400 mm</td></tr>
                </tbody>
            </table>

            <h3>Common Objects — Size Reference</h3>
            <p>Visualizing lengths is easier when you compare to everyday objects:</p>
            <ul>
                <li><strong>1 inch (2.54 cm)</strong> — Width of a US quarter dollar coin (24.26 mm ≈ 0.955″)</li>
                <li><strong>6 inches (15.24 cm)</strong> — Standard dollar bill width (6.14″)</li>
                <li><strong>12 inches (30.48 cm)</strong> — Standard ruler length (1 foot)</li>
                <li><strong>14 inches (35.56 cm)</strong> — Common laptop screen diagonal</li>
                <li><strong>27 inches (68.58 cm)</strong> — Common desktop monitor diagonal</li>
                <li><strong>55 inches (139.7 cm)</strong> — Popular TV screen size</li>
                <li><strong>72 inches (182.88 cm)</strong> — Standard interior door height (6 feet)</li>
                <li><strong>96 inches (243.84 cm)</strong> — Standard ceiling height (8 feet)</li>
            </ul>

            <h3>What Is an Inch?</h3>
            <p>An <strong>inch</strong> (abbreviation: <strong>in</strong> or <strong>″</strong>) is a unit of length in the US customary and Imperial systems. One inch is defined as exactly 1/12 of a foot, or 1/36 of a yard. Since the international yard equals exactly 0.9144 meters, one inch is exactly <strong>2.54 centimeters</strong> — by definition, not approximation.</p>
            <p>The inch has been used in various forms since at least the 7th century. The modern standardized inch was established in 1959 when the US, UK, Canada, Australia, New Zealand, and South Africa agreed on the international yard.</p>

            <h3>What Is a Centimeter?</h3>
            <p>A <strong>centimeter</strong> (abbreviation: <strong>cm</strong>) is a metric unit of length equal to one hundredth of a meter (1/100 m), or 10 millimeters. The prefix "centi-" means one hundredth. Centimeters are part of the International System of Units (SI) and are widely used worldwide for everyday measurements.</p>
            <p>A standard No. 2 pencil is about 1 cm in diameter, giving a quick real-world reference for the unit.</p>

            <h3>When to Convert Inches to Centimeters</h3>
            <ul>
                <li><strong>International shipping</strong>: Package dimensions must often be in centimeters for international carriers. A 12″ × 8″ × 6″ box is 30.48 × 20.32 × 15.24 cm.</li>
                <li><strong>Screen sizes</strong>: Monitors, TVs, and phones are advertised in inches in the US but in cm in most other countries. A 27-inch monitor = 68.58 cm diagonal.</li>
                <li><strong>Height conversion</strong>: Converting US height (e.g., 5′ 10″ = 70″) to metric (177.8 cm) for medical records, passports, or international forms.</li>
                <li><strong>DIY and construction</strong>: Converting plans between imperial and metric, especially when ordering materials manufactured in metric countries.</li>
                <li><strong>Academic and scientific work</strong>: All scientific measurements use the metric system. Converting lab measurements from US tools (in inches) to cm/mm for publication.</li>
            </ul>
        `,
        faq: [
            { question: "How many centimeters is 1 inch?", answer: "Exactly 2.54 centimeters. This is a precise, mathematically exact value — not a rounded approximation. It was established in 1959 by international agreement when the yard was defined as exactly 0.9144 meters." },
            { question: "How do I convert inches to cm?", answer: "Multiply the number of inches by 2.54. For example: 10 inches × 2.54 = 25.4 cm. For fractional inches like 5 3/4″, first convert to decimal (5.75), then multiply: 5.75 × 2.54 = 14.605 cm." },
            { question: "How tall is 5 feet 10 inches in cm?", answer: "5 feet 10 inches = 70 inches total (5 × 12 + 10). 70 × 2.54 = 177.8 cm. This is a very common height conversion for medical forms and passports." },
            { question: "How many inches in a centimeter?", answer: "There are approximately 0.3937 inches in 1 centimeter (1 ÷ 2.54 = 0.3937). To convert cm to inches, divide by 2.54 or multiply by 0.3937." },
            { question: "What is 12 inches in cm?", answer: "12 inches = 30.48 cm exactly. 12 inches equals 1 foot. This is one of the most common conversions — a standard ruler is 12 inches (30.48 cm) long." },
            { question: "Is 1 inch exactly 2.54 cm?", answer: "Yes — exactly, by definition. Since 1959, the international inch has been defined as exactly 25.4 millimeters (2.54 cm). This is not a rounded or approximate value — it's mathematically precise." },
        ],
    },
    "stone-to-kg-converter": {
        subtitle: "Convert stones and pounds to kilograms (st & lbs to kg). Enter stones and additional pounds for instant results in kg, grams, and total pounds.",
        contentHTML: `
            <h3>How to Convert Stones to Kilograms</h3>
            <p>One <strong>stone</strong> equals exactly <strong>14 pounds</strong>, or <strong>6.350293 kilograms</strong>. To convert stones (with optional additional pounds) to kilograms:</p>
            <div class="explanation__highlight">
                <strong>Step 1:</strong> Convert to total pounds: <strong>total lbs = (stone × 14) + additional pounds</strong><br/>
                <strong>Step 2:</strong> Convert pounds to kilograms: <strong>kg = total lbs × 0.453592</strong><br/><br/>
                <strong>Or directly: kg = stone × 6.350293</strong><br/><br/>
                Example: 11 stone 4 lbs = (11 × 14) + 4 = 158 lbs = 158 × 0.453592 = <strong>71.67 kg</strong>
            </div>

            <h3>Stones to Kilograms Conversion Chart</h3>
            <p>Quick reference for common stone-to-kg conversions:</p>
            <table>
                <thead><tr><th>Stones</th><th>Pounds</th><th>Kilograms</th><th>Approximate BMI Context</th></tr></thead>
                <tbody>
                    <tr><td>7 st</td><td>98 lbs</td><td>44.45 kg</td><td>Lightweight adult</td></tr>
                    <tr><td>8 st</td><td>112 lbs</td><td>50.80 kg</td><td>Small adult</td></tr>
                    <tr><td>9 st</td><td>126 lbs</td><td>57.15 kg</td><td>Average woman (UK)</td></tr>
                    <tr><td>10 st</td><td>140 lbs</td><td>63.50 kg</td><td>—</td></tr>
                    <tr><td>11 st</td><td>154 lbs</td><td>69.85 kg</td><td>Average man (UK)</td></tr>
                    <tr><td>12 st</td><td>168 lbs</td><td>76.20 kg</td><td>—</td></tr>
                    <tr><td>13 st</td><td>182 lbs</td><td>82.55 kg</td><td>Average man (US)</td></tr>
                    <tr><td>14 st</td><td>196 lbs</td><td>88.90 kg</td><td>—</td></tr>
                    <tr><td>15 st</td><td>210 lbs</td><td>95.25 kg</td><td>—</td></tr>
                    <tr><td>16 st</td><td>224 lbs</td><td>101.61 kg</td><td>—</td></tr>
                    <tr><td>18 st</td><td>252 lbs</td><td>114.31 kg</td><td>—</td></tr>
                    <tr><td>20 st</td><td>280 lbs</td><td>127.01 kg</td><td>—</td></tr>
                    <tr><td>25 st</td><td>350 lbs</td><td>158.76 kg</td><td>—</td></tr>
                    <tr><td>30 st</td><td>420 lbs</td><td>190.51 kg</td><td>—</td></tr>
                </tbody>
            </table>

            <h3>Stone + Pounds — Common Body Weights</h3>
            <p>Since body weight is rarely a round number of stones, here are common weights with pounds included:</p>
            <table>
                <thead><tr><th>Stone & Pounds</th><th>Total Pounds</th><th>Kilograms</th></tr></thead>
                <tbody>
                    <tr><td>8 st 7 lbs</td><td>119 lbs</td><td>53.98 kg</td></tr>
                    <tr><td>9 st 4 lbs</td><td>130 lbs</td><td>58.97 kg</td></tr>
                    <tr><td>10 st 0 lbs</td><td>140 lbs</td><td>63.50 kg</td></tr>
                    <tr><td>10 st 7 lbs</td><td>147 lbs</td><td>66.68 kg</td></tr>
                    <tr><td>11 st 0 lbs</td><td>154 lbs</td><td>69.85 kg</td></tr>
                    <tr><td>11 st 7 lbs</td><td>161 lbs</td><td>73.03 kg</td></tr>
                    <tr><td>12 st 0 lbs</td><td>168 lbs</td><td>76.20 kg</td></tr>
                    <tr><td>12 st 7 lbs</td><td>175 lbs</td><td>79.38 kg</td></tr>
                    <tr><td>13 st 0 lbs</td><td>182 lbs</td><td>82.55 kg</td></tr>
                    <tr><td>14 st 0 lbs</td><td>196 lbs</td><td>88.90 kg</td></tr>
                    <tr><td>15 st 7 lbs</td><td>217 lbs</td><td>98.43 kg</td></tr>
                </tbody>
            </table>

            <h3>What Is a Stone?</h3>
            <p>The <strong>stone</strong> (abbreviation: <strong>st</strong>) is an imperial unit of weight equal to <strong>14 pounds</strong> (6.35 kg). It's primarily used in the <strong>United Kingdom and Ireland</strong> to measure body weight. When a British person says "I weigh 11 stone," they mean 154 pounds (69.85 kg).</p>
            <p>The stone has ancient origins — it was historically the weight of a literal stone used as a counterweight on balance scales. Different trades used different "stone" weights until 1824, when the UK Weights and Measures Act standardized it at 14 pounds.</p>
            <p>Today, the stone is <strong>not recognized in the US</strong>, where pounds are used exclusively for body weight. It's also not an official SI unit, but remains deeply embedded in British and Irish culture.</p>

            <h3>What Is a Kilogram?</h3>
            <p>The <strong>kilogram</strong> (abbreviation: <strong>kg</strong>) is the SI base unit of mass, equal to 1,000 grams or approximately 2.205 pounds. Since 2019, the kilogram has been defined by the Planck constant (replacing the physical platinum-iridium prototype stored in France since 1889).</p>
            <p>Kilograms are used worldwide for body weight — except in the US (which uses pounds) and UK/Ireland (which use stones and pounds). Most medical records globally use kilograms.</p>

            <h3>US vs. UK vs. Metric Weight Systems</h3>
            <ul>
                <li><strong>United States</strong>: Body weight measured in <strong>pounds (lbs)</strong>. "I weigh 175 pounds."</li>
                <li><strong>United Kingdom & Ireland</strong>: Body weight measured in <strong>stones & pounds</strong>. "I weigh 12 stone 7." (= 175 lbs = 79.4 kg)</li>
                <li><strong>Most other countries</strong>: Body weight measured in <strong>kilograms</strong>. "I weigh 79 kg."</li>
            </ul>
            <p>This creates frequent conversion needs when Americans encounter British weight references (TV shows, sports, news), or when filling out international medical forms.</p>

            <h3>When to Convert Stones to Kilograms</h3>
            <ul>
                <li><strong>Understanding British body weight references</strong>: UK TV shows, news, and fitness content use stones. "She lost 2 stone" = she lost 28 lbs (12.7 kg).</li>
                <li><strong>Medical and fitness tracking</strong>: International health apps and medical records use kilograms. If you know your weight in stones, you need to convert for BMI calculations, medication dosing, or gym programs.</li>
                <li><strong>International travel</strong>: Airline baggage limits, visa medical exams, and hotel scales in Europe all use kilograms.</li>
                <li><strong>Combat sports</strong>: Boxing and MMA weight classes are listed in pounds in the US but sometimes in stones in the UK (e.g., "welterweight" = 10 st 7 lbs = 147 lbs = 66.7 kg).</li>
                <li><strong>Immigration and visas</strong>: Medical examination forms for UK and US visas require weight in specific units — converting between systems is often necessary.</li>
            </ul>
        `,
        faq: [
            { question: "How many kilograms is 1 stone?", answer: "1 stone = 6.350293 kilograms (exactly 14 pounds). This is the standard conversion factor. So 10 stone = 63.50 kg, and 15 stone = 95.25 kg." },
            { question: "How do I convert stone and pounds to kg?", answer: "First convert to total pounds: (stone × 14) + additional pounds. Then multiply by 0.453592 to get kilograms. Example: 12 stone 7 lbs = (12 × 14) + 7 = 175 lbs × 0.453592 = 79.38 kg." },
            { question: "How many pounds is 1 stone?", answer: "Exactly 14 pounds. This has been the standard since the UK Weights and Measures Act of 1824. So 10 stone = 140 lbs, 11 stone = 154 lbs, and 15 stone = 210 lbs." },
            { question: "What does '11 stone 4' mean?", answer: "It means 11 stones and 4 additional pounds, which equals (11 × 14) + 4 = 158 pounds, or 71.67 kilograms. This is the standard British way to express body weight — the 'pounds' part is understood to be 0–13 (since 14 pounds = another stone)." },
            { question: "Do Americans use stones?", answer: "No. The stone is not used in the United States. Americans measure body weight in pounds only (e.g., '175 pounds'). The stone is primarily used in the United Kingdom and Ireland. Most other countries use kilograms." },
            { question: "Is 13 stone overweight?", answer: "It depends on height. 13 stone = 182 lbs (82.55 kg). For a 5'10\" (178 cm) person, that gives a BMI of about 26.1, which is in the 'overweight' range. For a 6'2\" (188 cm) person, it's a BMI of 23.4, which is 'normal.' BMI alone doesn't account for muscle mass or body composition." },
        ],
    },
    "tbsp-to-gram-converter": {
        subtitle: "Convert tablespoons to grams (tbsp to g) for any ingredient. Select from 20 common cooking and baking ingredients or enter a custom density. See results in grams, ounces, and teaspoons.",
        contentHTML: `
            <h3>How to Convert Tablespoons to Grams</h3>
            <p>One US tablespoon equals <strong>14.787 milliliters</strong>. The weight in grams depends on the ingredient's density — a tablespoon of honey weighs much more than a tablespoon of flour because honey is denser.</p>
            <div class="explanation__highlight">
                <strong>grams = tablespoons × 14.787 × density (g/mL)</strong><br/><br/>
                Example: 2 tablespoons of butter (density 0.91 g/mL)<br/>
                = 2 × 14.787 × 0.91 = <strong>26.91 grams</strong><br/><br/>
                Example: 3 tablespoons of all-purpose flour (density 0.53 g/mL)<br/>
                = 3 × 14.787 × 0.53 = <strong>23.51 grams</strong>
            </div>

            <h3>How Many Grams in a Tablespoon?</h3>
            <p>This is the most commonly asked question. The answer depends entirely on the ingredient:</p>
            <table>
                <thead><tr><th>Ingredient</th><th>1 tbsp (grams)</th><th>2 tbsp (grams)</th><th>3 tbsp (grams)</th><th>Density (g/mL)</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>14.79 g</td><td>29.57 g</td><td>44.36 g</td><td>1.00</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>15.23 g</td><td>30.46 g</td><td>45.69 g</td><td>1.03</td></tr>
                    <tr><td><strong>Butter</strong></td><td>13.46 g</td><td>26.91 g</td><td>40.37 g</td><td>0.91</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>13.46 g</td><td>26.91 g</td><td>40.37 g</td><td>0.91</td></tr>
                    <tr><td><strong>Honey</strong></td><td>21.14 g</td><td>42.28 g</td><td>63.42 g</td><td>1.43</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>7.84 g</td><td>15.67 g</td><td>23.51 g</td><td>0.53</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>12.57 g</td><td>25.14 g</td><td>37.70 g</td><td>0.85</td></tr>
                    <tr><td><strong>Powdered Sugar</strong></td><td>8.87 g</td><td>17.75 g</td><td>26.62 g</td><td>0.60</td></tr>
                    <tr><td><strong>Cocoa Powder</strong></td><td>7.69 g</td><td>15.39 g</td><td>23.08 g</td><td>0.52</td></tr>
                    <tr><td><strong>Salt (table)</strong></td><td>17.74 g</td><td>35.49 g</td><td>53.23 g</td><td>1.20</td></tr>
                </tbody>
            </table>

            <h3>Tablespoon Size Reference</h3>
            <p>Understanding how US tablespoons relate to other volume units:</p>
            <table>
                <thead><tr><th>Measurement</th><th>Equivalent</th><th>Milliliters</th></tr></thead>
                <tbody>
                    <tr><td>1 tablespoon (tbsp)</td><td>3 teaspoons</td><td>14.787 mL</td></tr>
                    <tr><td>1/2 tablespoon</td><td>1.5 teaspoons</td><td>7.394 mL</td></tr>
                    <tr><td>2 tablespoons</td><td>1 fluid ounce</td><td>29.574 mL</td></tr>
                    <tr><td>4 tablespoons</td><td>1/4 cup</td><td>59.147 mL</td></tr>
                    <tr><td>8 tablespoons</td><td>1/2 cup</td><td>118.294 mL</td></tr>
                    <tr><td>16 tablespoons</td><td>1 cup</td><td>236.588 mL</td></tr>
                </tbody>
            </table>

            <h3>Why Does a Tablespoon of Flour Weigh Less Than a Tablespoon of Sugar?</h3>
            <p>Because <strong>flour is less dense</strong> than sugar. Flour particles are irregular and trap air, so a tablespoon of flour only weighs about 7.8 grams. Sugar crystals are denser and pack together tighter, so a tablespoon weighs about 12.6 grams.</p>
            <p>Honey is even denser at 1.43 g/mL — one tablespoon weighs over 21 grams. This is why precision baking recipes always specify ingredients by weight (grams), not volume (tablespoons).</p>

            <h3>When to Convert Tablespoons to Grams</h3>
            <ul>
                <li><strong>Following metric baking recipes</strong>: European and professional baking recipes list ingredients in grams. If you only have measuring spoons, you need to convert to know how many tablespoons to use.</li>
                <li><strong>Tracking nutrition accurately</strong>: Nutrition labels list serving sizes in grams. Knowing that 1 tbsp of peanut butter = ~16g helps you log calories and macros accurately.</li>
                <li><strong>Scaling recipes precisely</strong>: When you need "35 grams of butter," knowing that's about 2.6 tablespoons makes portioning easy without a scale.</li>
                <li><strong>Medication dosing</strong>: Some liquid medications are prescribed in milliliters or grams, but you may only have kitchen tablespoons for measuring. 1 tbsp = 14.79 mL (for water-like liquids).</li>
                <li><strong>Comparing products</strong>: A "2 tbsp serving" of brand A peanut butter vs. "32g" of brand B — is that the same amount? (Yes, approximately.)</li>
            </ul>

            <h3>Common Baking Conversions</h3>
            <p>These are the amounts you'll encounter most often in American baking recipes:</p>
            <table>
                <thead><tr><th>Recipe calls for…</th><th>That's about…</th><th>In grams</th></tr></thead>
                <tbody>
                    <tr><td>1 tbsp butter</td><td>~1/2 oz</td><td>13.5 g</td></tr>
                    <tr><td>2 tbsp flour</td><td>—</td><td>15.7 g</td></tr>
                    <tr><td>1 tbsp sugar</td><td>—</td><td>12.6 g</td></tr>
                    <tr><td>1 tbsp honey</td><td>~3/4 oz</td><td>21.1 g</td></tr>
                    <tr><td>1 tbsp olive oil</td><td>~1/2 oz</td><td>13.5 g</td></tr>
                    <tr><td>1 tbsp cocoa powder</td><td>—</td><td>7.7 g</td></tr>
                    <tr><td>1 tbsp vanilla extract</td><td>—</td><td>13.0 g</td></tr>
                    <tr><td>1 tbsp salt</td><td>—</td><td>17.7 g</td></tr>
                    <tr><td>1 tbsp baking powder</td><td>—</td><td>13.8 g</td></tr>
                    <tr><td>1 tbsp milk</td><td>—</td><td>15.2 g</td></tr>
                </tbody>
            </table>
        `,
        faq: [
            { question: "How many grams is 1 tablespoon of flour?", answer: "Approximately 7.8 grams. All-purpose flour has a density of about 0.53 g/mL, so 1 tablespoon (14.787 mL) × 0.53 = 7.84 grams. This is much less than a tablespoon of sugar (12.6g) because flour is fluffier and less dense." },
            { question: "How many grams is 1 tablespoon of butter?", answer: "Approximately 13.5 grams, or about half an ounce. Butter has a density of 0.91 g/mL. In US recipes, one stick of butter = 8 tablespoons = 113.4 grams = 4 ounces." },
            { question: "How many grams is 1 tablespoon of sugar?", answer: "Approximately 12.6 grams of granulated sugar. Sugar is denser than flour (0.85 g/mL vs 0.53 g/mL), which is why the same volume of sugar weighs more. For powdered sugar, 1 tablespoon is only about 8.9 grams." },
            { question: "Is 1 tablespoon always 15 grams?", answer: "No — only for water (and liquids with similar density). 1 tablespoon = 14.787 mL, and water weighs about 1 g/mL, so 1 tbsp of water ≈ 14.8g. But 1 tbsp of flour is only 7.8g, and 1 tbsp of honey is 21.1g. The weight depends on the ingredient's density." },
            { question: "How many tablespoons is 30 grams of butter?", answer: "About 2.2 tablespoons. Using the formula: tbsp = grams ÷ (14.787 × density) = 30 ÷ (14.787 × 0.91) = 30 ÷ 13.46 = 2.23 tablespoons." },
            { question: "What is the difference between a US tablespoon and a metric tablespoon?", answer: "A US tablespoon = 14.787 mL. A metric tablespoon (used in Australia, UK) = 20 mL — about 35% larger. The Australian tablespoon is the largest standard tablespoon in the world. Always check which standard your recipe uses." },
        ],
    },
    "kg-to-liter-converter": {
        subtitle: "Convert kilograms to liters (kg to L) for any substance. Select from 20 common ingredients or enter a custom density. See results in liters, US gallons, and US quarts.",
        contentHTML: `
            <h3>How to Convert Kilograms to Liters</h3>
            <p>To convert kilograms to liters, <strong>divide the weight by the substance's density</strong>. Different substances occupy different volumes for the same weight because they have different densities.</p>
            <div class="explanation__highlight">
                <strong>liters = kilograms ÷ density (kg/L)</strong><br/><br/>
                Example: 5 kg of olive oil (density 0.91 kg/L)<br/>
                = 5 ÷ 0.91 = <strong>5.495 liters</strong> (1.452 US gallons)<br/><br/>
                Example: 5 kg of honey (density 1.43 kg/L)<br/>
                = 5 ÷ 1.43 = <strong>3.497 liters</strong> (0.924 US gallons)
            </div>
            <p>Notice how 5 kg of oil takes up more space than 5 kg of honey — because oil is less dense. This is why you can't simply say "1 kg = 1 liter" for anything except water.</p>

            <h3>Kilograms to Liters — Common Substances</h3>
            <p>How much volume does 1 kg of each substance occupy?</p>
            <table>
                <thead><tr><th>Substance</th><th>Density (kg/L)</th><th>1 kg =</th><th>5 kg =</th><th>10 kg =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00</td><td>1.000 L</td><td>5.000 L</td><td>10.000 L</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03</td><td>0.971 L</td><td>4.854 L</td><td>9.709 L</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.91</td><td>1.099 L</td><td>5.495 L</td><td>10.989 L</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.43</td><td>0.699 L</td><td>3.497 L</td><td>6.993 L</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.53</td><td>1.887 L</td><td>9.434 L</td><td>18.868 L</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85</td><td>1.176 L</td><td>5.882 L</td><td>11.765 L</td></tr>
                    <tr><td><strong>Rice (uncooked)</strong></td><td>0.82</td><td>1.220 L</td><td>6.098 L</td><td>12.195 L</td></tr>
                    <tr><td><strong>Salt (table)</strong></td><td>1.20</td><td>0.833 L</td><td>4.167 L</td><td>8.333 L</td></tr>
                    <tr><td><strong>Vegetable Oil</strong></td><td>0.91</td><td>1.099 L</td><td>5.495 L</td><td>10.989 L</td></tr>
                    <tr><td><strong>Cream (heavy)</strong></td><td>1.01</td><td>0.990 L</td><td>4.950 L</td><td>9.901 L</td></tr>
                </tbody>
            </table>

            <h3>Why 1 Kilogram Is Not Always 1 Liter</h3>
            <p>Only for <strong>water at 4°C</strong> does 1 kg = exactly 1 liter. For every other substance, the relationship depends on density:</p>
            <ul>
                <li><strong>Less dense than water</strong> (oil, flour, butter): 1 kg occupies <em>more</em> than 1 liter</li>
                <li><strong>Denser than water</strong> (honey, salt, corn syrup): 1 kg occupies <em>less</em> than 1 liter</li>
            </ul>
            <p>For Americans: think of it like this — a gallon of water weighs about 8.34 pounds (3.78 kg), but a gallon of honey weighs about 12 pounds (5.4 kg). Same volume, very different weights.</p>

            <h3>US Volume Equivalents</h3>
            <p>Since Americans commonly use gallons, quarts, and cups:</p>
            <table>
                <thead><tr><th>Liters</th><th>US Gallons</th><th>US Quarts</th><th>US Cups</th><th>Fluid Ounces</th></tr></thead>
                <tbody>
                    <tr><td>0.5 L</td><td>0.132 gal</td><td>0.528 qt</td><td>2.113 cups</td><td>16.907 fl oz</td></tr>
                    <tr><td>1.0 L</td><td>0.264 gal</td><td>1.057 qt</td><td>4.227 cups</td><td>33.814 fl oz</td></tr>
                    <tr><td>2.0 L</td><td>0.528 gal</td><td>2.113 qt</td><td>8.454 cups</td><td>67.628 fl oz</td></tr>
                    <tr><td>3.785 L</td><td>1.000 gal</td><td>4.000 qt</td><td>16.000 cups</td><td>128.000 fl oz</td></tr>
                    <tr><td>5.0 L</td><td>1.321 gal</td><td>5.283 qt</td><td>21.134 cups</td><td>169.070 fl oz</td></tr>
                    <tr><td>10.0 L</td><td>2.642 gal</td><td>10.567 qt</td><td>42.268 cups</td><td>338.140 fl oz</td></tr>
                </tbody>
            </table>

            <h3>What Is a Kilogram?</h3>
            <p>The <strong>kilogram</strong> (kg) is the SI base unit of mass, equal to 1,000 grams or approximately 2.205 pounds. Since 2019, it has been defined using the Planck constant rather than a physical artifact. In cooking, kilograms are used worldwide for measuring ingredients by weight — the most accurate method for baking.</p>

            <h3>What Is a Liter?</h3>
            <p>A <strong>liter</strong> (L) is a metric unit of volume equal to 1,000 milliliters, 1,000 cubic centimeters, or approximately 0.264 US gallons. For Americans: 1 liter is slightly more than 1 US quart (1 L = 1.057 qt). A standard 2-liter bottle of soda holds 2 liters (about half a gallon).</p>

            <h3>When to Convert Kilograms to Liters</h3>
            <ul>
                <li><strong>Cooking and baking</strong>: A recipe says "500g flour" but you only have measuring cups. 500g flour ÷ 0.53 kg/L = 0.943 L ≈ about 4 US cups.</li>
                <li><strong>Shipping and freight</strong>: Carriers charge by either weight or volume (dimensional weight). Converting between kg and liters helps determine which measurement results in higher shipping costs.</li>
                <li><strong>Chemistry and labs</strong>: Mixing chemicals requires precise mass-to-volume conversions. A reaction calling for 2 kg of a reagent needs to know the volume to select the right container.</li>
                <li><strong>Fuel calculations</strong>: Fuel is sold by the liter in most countries but sometimes measured by weight. 1 kg of gasoline ≈ 1.37 liters (density ~0.73 kg/L).</li>
                <li><strong>Water storage and tanks</strong>: A 200-liter barrel holds 200 kg of water. But the same barrel holds only 182 kg of cooking oil (density 0.91 kg/L).</li>
            </ul>
        `,
        faq: [
            { question: "How many liters is 1 kg?", answer: "It depends on the substance. For water, 1 kg = exactly 1 liter. For olive oil (density 0.91 kg/L), 1 kg = 1.099 liters. For honey (density 1.43 kg/L), 1 kg = only 0.699 liters. You must know the density to convert accurately." },
            { question: "Is 1 kg equal to 1 liter?", answer: "Only for water (at approximately 4°C). The reason is that water's density is 1.00 kg/L. For all other substances, 1 kg does NOT equal 1 liter. Lighter substances (like oil) take up more than 1 liter per kg, while heavier substances (like honey) take up less." },
            { question: "How do I convert kg to liters?", answer: "Divide the weight in kilograms by the substance's density in kg/L. Formula: liters = kg ÷ density. For example: 5 kg of milk ÷ 1.03 kg/L = 4.854 liters." },
            { question: "How many liters is 5 kg of flour?", answer: "About 9.43 liters. Flour has a density of approximately 0.53 kg/L, so 5 ÷ 0.53 = 9.43 liters. That's roughly 40 US cups of flour. Flour is very low-density because of trapped air between particles." },
            { question: "How many US gallons is 1 liter?", answer: "1 liter = 0.264172 US gallons, or about 1.057 US quarts. To think of it another way: 1 US gallon = 3.785 liters. A standard 2-liter soda bottle holds about 0.528 gallons." },
            { question: "Why does density matter for kg to liter conversion?", answer: "Because kilograms measure mass (weight) and liters measure volume (space). The connection between mass and volume is density — how tightly packed the substance's molecules are. Oil molecules are spaced farther apart than honey molecules, so the same weight of oil takes up more space." },
        ],
    },
    "mg-to-ml-converter": {
        subtitle: "Convert milligrams to milliliters (mg to mL) for any substance. Select from 20 common ingredients or enter a custom density. See results in mL, teaspoons, fluid ounces, and drops.",
        contentHTML: `
            <h3>How to Convert Milligrams to Milliliters</h3>
            <p>Milligrams (mg) measure <strong>weight</strong>, while milliliters (mL) measure <strong>volume</strong>. To convert between them, you need the substance's density. The formula is:</p>
            <div class="explanation__highlight">
                <strong>mL = mg ÷ (density in g/mL × 1,000)</strong><br/><br/>
                Or equivalently: <strong>mL = mg ÷ density in mg/mL</strong><br/><br/>
                Example: 500 mg of water (density 1.00 g/mL)<br/>
                = 500 ÷ (1.00 × 1000) = 500 ÷ 1000 = <strong>0.5 mL</strong><br/><br/>
                Example: 500 mg of olive oil (density 0.91 g/mL)<br/>
                = 500 ÷ (0.91 × 1000) = 500 ÷ 910 = <strong>0.5495 mL</strong>
            </div>
            <p>For water and water-based solutions (like most liquid medications), 1 mg ≈ 0.001 mL, or equivalently, 1 mL ≈ 1,000 mg. This is because water has a density of approximately 1.00 g/mL.</p>

            <h3>Common mg to mL Conversions</h3>
            <p>Quick reference for how many milliliters common milligram amounts equal (for water-density substances like most medications):</p>
            <table>
                <thead><tr><th>Milligrams</th><th>Milliliters (water)</th><th>Teaspoons</th><th>Drops (~20/mL)</th></tr></thead>
                <tbody>
                    <tr><td>10 mg</td><td>0.01 mL</td><td>0.002 tsp</td><td>0.2 drops</td></tr>
                    <tr><td>25 mg</td><td>0.025 mL</td><td>0.005 tsp</td><td>0.5 drops</td></tr>
                    <tr><td>50 mg</td><td>0.05 mL</td><td>0.01 tsp</td><td>1.0 drops</td></tr>
                    <tr><td>100 mg</td><td>0.1 mL</td><td>0.02 tsp</td><td>2.0 drops</td></tr>
                    <tr><td>200 mg</td><td>0.2 mL</td><td>0.04 tsp</td><td>4.0 drops</td></tr>
                    <tr><td>250 mg</td><td>0.25 mL</td><td>0.05 tsp</td><td>5.0 drops</td></tr>
                    <tr><td>500 mg</td><td>0.5 mL</td><td>0.1 tsp</td><td>10.0 drops</td></tr>
                    <tr><td>1,000 mg (1 g)</td><td>1.0 mL</td><td>0.2 tsp</td><td>20.0 drops</td></tr>
                    <tr><td>2,000 mg (2 g)</td><td>2.0 mL</td><td>0.4 tsp</td><td>40.0 drops</td></tr>
                    <tr><td>5,000 mg (5 g)</td><td>5.0 mL</td><td>1.0 tsp</td><td>100.0 drops</td></tr>
                </tbody>
            </table>

            <h3>Medication Dosing Reference</h3>
            <p>One of the most common reasons Americans convert mg to mL is for medication dosing. Here's how common US OTC medications relate:</p>
            <table>
                <thead><tr><th>Medication</th><th>Typical Dose</th><th>Concentration</th><th>Volume to Take</th></tr></thead>
                <tbody>
                    <tr><td>Children's Tylenol (acetaminophen)</td><td>160 mg</td><td>160 mg/5 mL</td><td>5.0 mL (1 tsp)</td></tr>
                    <tr><td>Children's Advil (ibuprofen)</td><td>100 mg</td><td>100 mg/5 mL</td><td>5.0 mL (1 tsp)</td></tr>
                    <tr><td>Children's Benadryl (diphenhydramine)</td><td>12.5 mg</td><td>12.5 mg/5 mL</td><td>5.0 mL (1 tsp)</td></tr>
                    <tr><td>NyQuil (dextromethorphan)</td><td>30 mg</td><td>15 mg/15 mL</td><td>30.0 mL (2 tbsp)</td></tr>
                    <tr><td>Amoxicillin suspension</td><td>250 mg</td><td>250 mg/5 mL</td><td>5.0 mL (1 tsp)</td></tr>
                </tbody>
            </table>
            <p><strong>⚠️ Important:</strong> This table is for educational reference only. Always follow your doctor's dosing instructions and read the medication label carefully. Medication concentrations vary by brand and formulation.</p>

            <h3>Measuring Small Volumes</h3>
            <p>When dealing with milligrams, the resulting volumes are often very small. Here are the most common measuring tools:</p>
            <table>
                <thead><tr><th>Measurement Tool</th><th>Volume</th><th>Equivalent</th></tr></thead>
                <tbody>
                    <tr><td>Standard medical dropper</td><td>~1 mL (20 drops)</td><td>1 cc</td></tr>
                    <tr><td>1/4 teaspoon</td><td>~1.23 mL</td><td>—</td></tr>
                    <tr><td>1/2 teaspoon</td><td>~2.46 mL</td><td>—</td></tr>
                    <tr><td>1 teaspoon</td><td>~4.93 mL</td><td>~5 mL (medical standard)</td></tr>
                    <tr><td>1 tablespoon</td><td>~14.79 mL</td><td>~15 mL (medical standard)</td></tr>
                    <tr><td>Oral syringe (common sizes)</td><td>1, 3, 5, or 10 mL</td><td>Most accurate for small doses</td></tr>
                </tbody>
            </table>
            <p><strong>Tip:</strong> 1 mL = 1 cc (cubic centimeter). In medical settings, mL and cc are used interchangeably.</p>

            <h3>What Is a Milligram?</h3>
            <p>A <strong>milligram</strong> (mg) is a metric unit of mass equal to one thousandth of a gram (1/1,000 g), or one millionth of a kilogram. "Milli-" means thousandth. Milligrams are commonly used for medication dosages, nutritional supplement amounts, and in chemistry for small quantities of substances.</p>

            <h3>What Is a Milliliter?</h3>
            <p>A <strong>milliliter</strong> (mL) is a metric unit of volume equal to one thousandth of a liter (1/1,000 L), or exactly 1 cubic centimeter (cc). Milliliters are used for measuring liquid medications, small cooking quantities, and laboratory solutions. In medical contexts, mL and cc are interchangeable.</p>

            <h3>When to Convert mg to mL</h3>
            <ul>
                <li><strong>Medication dosing</strong>: Prescriptions are often written in milligrams, but liquid medications are measured in milliliters. Knowing the concentration (e.g., 100 mg/5 mL) lets you calculate the correct volume.</li>
                <li><strong>Vitamin and supplement dosing</strong>: Liquid vitamins and supplements list amounts in mg but are measured with droppers in mL.</li>
                <li><strong>Laboratory work</strong>: Preparing chemical solutions requires converting between mass (mg of solute) and volume (mL of solution).</li>
                <li><strong>Essential oils and flavorings</strong>: Recipes may specify mg of a flavoring, but you dispense with a dropper measured in mL.</li>
                <li><strong>Pet medications</strong>: Veterinary doses are calculated by the pet's weight in mg, then measured in mL from a liquid formulation.</li>
            </ul>
        `,
        faq: [
            { question: "How many mL is 500 mg?", answer: "For water or water-based liquids (density ~1 g/mL): 500 mg = 0.5 mL. For liquids with different densities, divide 500 by (density in g/mL × 1000). For example, 500 mg of olive oil = 0.549 mL because oil is less dense than water." },
            { question: "Is 1 mg the same as 1 mL?", answer: "No — they measure different things. Milligrams (mg) measure weight/mass, while milliliters (mL) measure volume. For water, 1 mg = 0.001 mL (or 1,000 mg = 1 mL). For other substances, the ratio depends on density." },
            { question: "How do I convert mg to mL for medication?", answer: "You need to know the medication's concentration (usually printed on the label, e.g., '100 mg/5 mL'). Then: volume (mL) = prescribed dose (mg) ÷ concentration (mg/mL). For example: 200 mg prescribed, concentration 100 mg/5 mL = 100/5 = 20 mg/mL. So 200 ÷ 20 = 10 mL." },
            { question: "What does 1 mL equal in drops?", answer: "Approximately 20 drops from a standard medical dropper. However, drop size varies depending on the dropper tip and the liquid's viscosity. For precise dosing, always use an oral syringe rather than counting drops." },
            { question: "Is 5 mL the same as 1 teaspoon?", answer: "Approximately yes. A US teaspoon is 4.929 mL, but in medical/pharmaceutical contexts, 1 teaspoon is standardized to 5 mL for simplicity. This small difference rarely matters for medication dosing, but always use the measuring device provided with your medication." },
            { question: "How many mg in 1 mL of water?", answer: "1,000 mg (= 1 gram). Since water has a density of 1.00 g/mL, 1 milliliter of water weighs exactly 1 gram = 1,000 milligrams. This is also true for dilute water-based solutions like most liquid medications." },
        ],
    },
    "gram-to-tsp-converter": {
        subtitle: "Convert grams to teaspoons (g to tsp) for any ingredient. Select from 20 common cooking and baking ingredients or enter a custom density. See results in teaspoons, tablespoons, and cups.",
        contentHTML: `
            <h3>How to Convert Grams to Teaspoons</h3>
            <p>A US teaspoon holds <strong>4.929 milliliters</strong>. Since different ingredients have different densities, the same weight occupies different volumes. To convert grams to teaspoons:</p>
            <div class="explanation__highlight">
                <strong>teaspoons = grams ÷ (4.929 × density in g/mL)</strong><br/><br/>
                Example: 7 grams of active dry yeast (density 0.63 g/mL)<br/>
                = 7 ÷ (4.929 × 0.63) = 7 ÷ 3.105 = <strong>2.25 tsp</strong><br/><br/>
                That's why a standard 7g yeast packet = 2¼ teaspoons!<br/><br/>
                Example: 5 grams of salt (density 1.20 g/mL)<br/>
                = 5 ÷ (4.929 × 1.20) = 5 ÷ 5.915 = <strong>0.85 tsp</strong>
            </div>

            <h3>How Many Teaspoons per Gram? — By Ingredient</h3>
            <p>The answer depends entirely on what you're measuring:</p>
            <table>
                <thead><tr><th>Ingredient</th><th>Grams per Teaspoon</th><th>5g =</th><th>10g =</th><th>25g =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>4.93 g/tsp</td><td>1.01 tsp</td><td>2.03 tsp</td><td>5.07 tsp</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>4.19 g/tsp</td><td>1.19 tsp</td><td>2.39 tsp</td><td>5.97 tsp</td></tr>
                    <tr><td><strong>Table Salt</strong></td><td>5.91 g/tsp</td><td>0.85 tsp</td><td>1.69 tsp</td><td>4.23 tsp</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>2.61 g/tsp</td><td>1.91 tsp</td><td>3.83 tsp</td><td>9.57 tsp</td></tr>
                    <tr><td><strong>Butter</strong></td><td>4.49 g/tsp</td><td>1.12 tsp</td><td>2.23 tsp</td><td>5.57 tsp</td></tr>
                    <tr><td><strong>Honey</strong></td><td>7.05 g/tsp</td><td>0.71 tsp</td><td>1.42 tsp</td><td>3.55 tsp</td></tr>
                    <tr><td><strong>Cocoa Powder</strong></td><td>2.56 g/tsp</td><td>1.95 tsp</td><td>3.90 tsp</td><td>9.74 tsp</td></tr>
                    <tr><td><strong>Powdered Sugar</strong></td><td>2.96 g/tsp</td><td>1.69 tsp</td><td>3.38 tsp</td><td>8.45 tsp</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>4.49 g/tsp</td><td>1.12 tsp</td><td>2.23 tsp</td><td>5.57 tsp</td></tr>
                    <tr><td><strong>Baking Powder</strong></td><td>4.60 g/tsp</td><td>1.09 tsp</td><td>2.17 tsp</td><td>5.43 tsp</td></tr>
                </tbody>
            </table>

            <h3>Common Baking Conversions</h3>
            <p>Quick answers for the most frequently searched baking amounts:</p>
            <table>
                <thead><tr><th>Recipe says…</th><th>That's about…</th><th>Density used</th></tr></thead>
                <tbody>
                    <tr><td>7g yeast</td><td>2¼ tsp (1 packet)</td><td>0.63 g/mL</td></tr>
                    <tr><td>5g salt</td><td>~1 tsp</td><td>1.20 g/mL</td></tr>
                    <tr><td>4g baking powder</td><td>~1 tsp</td><td>0.93 g/mL</td></tr>
                    <tr><td>5g sugar</td><td>~1¼ tsp</td><td>0.85 g/mL</td></tr>
                    <tr><td>10g flour</td><td>~3¾ tsp</td><td>0.53 g/mL</td></tr>
                    <tr><td>15g butter</td><td>~3⅓ tsp (1 tbsp)</td><td>0.91 g/mL</td></tr>
                    <tr><td>20g honey</td><td>~2¾ tsp</td><td>1.43 g/mL</td></tr>
                    <tr><td>3g vanilla extract</td><td>~⅔ tsp</td><td>0.88 g/mL</td></tr>
                    <tr><td>2g cinnamon</td><td>~¾ tsp</td><td>0.56 g/mL</td></tr>
                    <tr><td>30g cocoa powder</td><td>~11¾ tsp (4 tbsp)</td><td>0.52 g/mL</td></tr>
                </tbody>
            </table>

            <h3>Teaspoon Size Reference</h3>
            <table>
                <thead><tr><th>Measurement</th><th>Equivalent</th><th>Milliliters</th></tr></thead>
                <tbody>
                    <tr><td>1 teaspoon (tsp)</td><td>⅓ tablespoon</td><td>4.929 mL</td></tr>
                    <tr><td>3 teaspoons</td><td>1 tablespoon</td><td>14.787 mL</td></tr>
                    <tr><td>6 teaspoons</td><td>2 tablespoons (1 fl oz)</td><td>29.574 mL</td></tr>
                    <tr><td>12 teaspoons</td><td>¼ cup</td><td>59.147 mL</td></tr>
                    <tr><td>24 teaspoons</td><td>½ cup</td><td>118.294 mL</td></tr>
                    <tr><td>48 teaspoons</td><td>1 cup</td><td>236.588 mL</td></tr>
                </tbody>
            </table>

            <h3>Why Grams Are More Accurate Than Teaspoons</h3>
            <p>Professional bakers always weigh ingredients in grams rather than using teaspoons because:</p>
            <ul>
                <li><strong>Teaspoons vary by packing</strong>: A "heaped" teaspoon of flour can weigh 50% more than a "level" teaspoon.</li>
                <li><strong>Humidity affects volume</strong>: Flour absorbs moisture, becoming denser. The same cup of flour can weigh 120g or 145g depending on humidity.</li>
                <li><strong>Small amounts amplify errors</strong>: In baking, even 1 gram of baking powder too much can change the result. A teaspoon measurement is rarely that precise.</li>
            </ul>
            <p>However, most home cooks in the US use teaspoons — so this converter bridges the gap between metric recipes and American measuring spoons.</p>

            <h3>Reading Nutrition Labels in Teaspoons</h3>
            <p>Nutrition labels in the US list sugar, salt, and fat in grams — but Americans think in teaspoons. Quick conversions:</p>
            <ul>
                <li><strong>4 grams of sugar = ~1 teaspoon</strong>. A can of soda with 39g of sugar contains nearly 10 teaspoons!</li>
                <li><strong>6 grams of salt = ~1 teaspoon</strong>. The FDA recommends less than 2,300 mg (about ⅓ tsp) of sodium per day.</li>
                <li><strong>5 grams of fat = ~1 teaspoon</strong> (for oils with density ~0.91 g/mL).</li>
            </ul>
        `,
        faq: [
            { question: "How many teaspoons is 1 gram?", answer: "It depends on the ingredient. For sugar: 1 gram ≈ 0.24 tsp. For salt: 1 gram ≈ 0.17 tsp. For flour: 1 gram ≈ 0.38 tsp. The difference is because each ingredient has a different density — flour is fluffy (less dense), salt is heavy (more dense)." },
            { question: "How many grams is 1 teaspoon of sugar?", answer: "Approximately 4.2 grams. Granulated sugar has a density of 0.85 g/mL, and a US teaspoon holds 4.929 mL, so 1 tsp of sugar = 4.929 × 0.85 = 4.19 grams. This is a widely used rule of thumb: 4 grams of sugar ≈ 1 teaspoon." },
            { question: "How many grams is 1 teaspoon of salt?", answer: "Approximately 5.9 grams. Table salt is quite dense (1.20 g/mL), so a teaspoon holds more weight compared to lighter ingredients. Note: kosher salt is less dense and can weigh as little as 3g per teaspoon depending on the brand." },
            { question: "How many teaspoons is 7 grams of yeast?", answer: "About 2¼ teaspoons. Active dry yeast has a density of approximately 0.63 g/mL. So 7 ÷ (4.929 × 0.63) = 2.25 teaspoons. This is why a standard 7g yeast packet in recipes is described as '2¼ teaspoons.'" },
            { question: "How many teaspoons is 5 grams of baking powder?", answer: "About 1.1 teaspoons. Baking powder has a density of approximately 0.93 g/mL. So 5 ÷ (4.929 × 0.93) = 1.09 tsp. A common rule of thumb is that 1 teaspoon of baking powder weighs about 4.6 grams." },
            { question: "Why do different ingredients have different grams per teaspoon?", answer: "Because ingredients have different densities — how tightly packed their particles are. Salt crystals are heavy and pack tightly (5.9g/tsp). Flour particles are light and trap air (2.6g/tsp). Honey is a dense liquid (7.1g/tsp). The teaspoon measures volume, but grams measure weight." },
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
