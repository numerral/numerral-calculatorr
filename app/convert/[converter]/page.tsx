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
    "tsp-to-cup-converter": {
        subtitle: "Convert teaspoons to cups (tsp to cups) instantly. See results in cups, tablespoons, fluid ounces, and milliliters. Includes a complete conversion table.",
        contentHTML: `
            <h3>How to Convert Teaspoons to Cups</h3>
            <p>There are exactly <strong>48 teaspoons in 1 US cup</strong>. To convert teaspoons to cups, simply divide by 48:</p>
            <div class="explanation__highlight">
                <strong>cups = teaspoons ÷ 48</strong><br/><br/>
                Example: 12 teaspoons ÷ 48 = <strong>0.25 cups (¼ cup)</strong><br/><br/>
                Example: 24 teaspoons ÷ 48 = <strong>0.5 cups (½ cup)</strong><br/><br/>
                Example: 36 teaspoons ÷ 48 = <strong>0.75 cups (¾ cup)</strong>
            </div>
            <p>This is a <strong>fixed ratio</strong> — it does not depend on the ingredient. Whether you're measuring water, flour, or sugar, 48 teaspoons always equals 1 cup by volume.</p>

            <h3>Teaspoons to Cups Conversion Table</h3>
            <table>
                <thead><tr><th>Teaspoons</th><th>Cups</th><th>Tablespoons</th><th>Fluid Ounces</th><th>Milliliters</th></tr></thead>
                <tbody>
                    <tr><td>1 tsp</td><td>0.021 cups</td><td>⅓ tbsp</td><td>⅙ fl oz</td><td>4.93 mL</td></tr>
                    <tr><td>3 tsp</td><td>0.063 cups</td><td>1 tbsp</td><td>½ fl oz</td><td>14.79 mL</td></tr>
                    <tr><td>6 tsp</td><td>⅛ cup</td><td>2 tbsp</td><td>1 fl oz</td><td>29.57 mL</td></tr>
                    <tr><td>8 tsp</td><td>⅙ cup</td><td>2⅔ tbsp</td><td>1⅓ fl oz</td><td>39.43 mL</td></tr>
                    <tr><td>12 tsp</td><td><strong>¼ cup</strong></td><td>4 tbsp</td><td>2 fl oz</td><td>59.15 mL</td></tr>
                    <tr><td>16 tsp</td><td>⅓ cup</td><td>5⅓ tbsp</td><td>2⅔ fl oz</td><td>78.86 mL</td></tr>
                    <tr><td>24 tsp</td><td><strong>½ cup</strong></td><td>8 tbsp</td><td>4 fl oz</td><td>118.29 mL</td></tr>
                    <tr><td>32 tsp</td><td>⅔ cup</td><td>10⅔ tbsp</td><td>5⅓ fl oz</td><td>157.73 mL</td></tr>
                    <tr><td>36 tsp</td><td><strong>¾ cup</strong></td><td>12 tbsp</td><td>6 fl oz</td><td>177.44 mL</td></tr>
                    <tr><td>48 tsp</td><td><strong>1 cup</strong></td><td>16 tbsp</td><td>8 fl oz</td><td>236.59 mL</td></tr>
                    <tr><td>72 tsp</td><td>1½ cups</td><td>24 tbsp</td><td>12 fl oz</td><td>354.88 mL</td></tr>
                    <tr><td>96 tsp</td><td>2 cups (1 pint)</td><td>32 tbsp</td><td>16 fl oz</td><td>473.18 mL</td></tr>
                    <tr><td>144 tsp</td><td>3 cups</td><td>48 tbsp</td><td>24 fl oz</td><td>709.76 mL</td></tr>
                    <tr><td>192 tsp</td><td>4 cups (1 quart)</td><td>64 tbsp</td><td>32 fl oz</td><td>946.35 mL</td></tr>
                    <tr><td>768 tsp</td><td>16 cups (1 gallon)</td><td>256 tbsp</td><td>128 fl oz</td><td>3,785.41 mL</td></tr>
                </tbody>
            </table>

            <h3>US Customary Volume Units — Complete Hierarchy</h3>
            <p>Understanding how all US cooking volume units relate:</p>
            <table>
                <thead><tr><th>Unit</th><th>In Teaspoons</th><th>In mL</th></tr></thead>
                <tbody>
                    <tr><td>1 teaspoon (tsp)</td><td>1 tsp</td><td>4.929 mL</td></tr>
                    <tr><td>1 tablespoon (tbsp)</td><td>3 tsp</td><td>14.787 mL</td></tr>
                    <tr><td>1 fluid ounce (fl oz)</td><td>6 tsp</td><td>29.574 mL</td></tr>
                    <tr><td>1 cup</td><td>48 tsp</td><td>236.588 mL</td></tr>
                    <tr><td>1 pint (2 cups)</td><td>96 tsp</td><td>473.176 mL</td></tr>
                    <tr><td>1 quart (4 cups)</td><td>192 tsp</td><td>946.353 mL</td></tr>
                    <tr><td>1 gallon (16 cups)</td><td>768 tsp</td><td>3,785.41 mL</td></tr>
                </tbody>
            </table>

            <h3>US Cup vs. Metric Cup</h3>
            <p>Be aware that the <strong>US cup</strong> (236.588 mL) is different from the <strong>metric cup</strong> (250 mL) used in Australia, Canada, and some other countries. The US cup is about 5.4% smaller. If following an Australian recipe that says "1 cup," using a US measuring cup will give you slightly less volume.</p>
            <p>The <strong>Japanese cup</strong> is even smaller at 200 mL. Always check which cup standard your recipe uses.</p>

            <h3>What Is a Teaspoon?</h3>
            <p>A <strong>teaspoon</strong> (tsp) is a US customary unit of volume equal to ⅓ of a tablespoon, ⅙ of a fluid ounce, or approximately 4.929 milliliters. In nutrition labeling, the FDA standardizes 1 teaspoon to exactly 5 mL. Teaspoons are the smallest standard US measuring spoon and are used for spices, baking powder, vanilla extract, and liquid medications.</p>

            <h3>What Is a Cup?</h3>
            <p>A <strong>US cup</strong> is a customary unit of volume equal to 8 fluid ounces, 16 tablespoons, 48 teaspoons, or approximately 236.588 milliliters. It's the most commonly used volume measurement in American home cooking. Standard US measuring cup sets include 1 cup, ¾ cup, ⅔ cup, ½ cup, ⅓ cup, and ¼ cup sizes.</p>

            <h3>Kitchen Conversion Shortcuts</h3>
            <ul>
                <li><strong>¼ cup</strong> = 12 teaspoons = 4 tablespoons</li>
                <li><strong>⅓ cup</strong> = 16 teaspoons = 5⅓ tablespoons</li>
                <li><strong>½ cup</strong> = 24 teaspoons = 8 tablespoons</li>
                <li><strong>⅔ cup</strong> = 32 teaspoons = 10⅔ tablespoons</li>
                <li><strong>¾ cup</strong> = 36 teaspoons = 12 tablespoons</li>
                <li><strong>1 cup</strong> = 48 teaspoons = 16 tablespoons = 8 fl oz</li>
            </ul>
        `,
        faq: [
            { question: "How many teaspoons are in a cup?", answer: "There are exactly 48 teaspoons in 1 US cup. This is derived from the fact that 1 cup = 16 tablespoons, and 1 tablespoon = 3 teaspoons, so 16 × 3 = 48 teaspoons." },
            { question: "How many teaspoons is ¼ cup?", answer: "12 teaspoons. Since 1 cup = 48 teaspoons, ¼ cup = 48 ÷ 4 = 12 teaspoons. That's also equal to 4 tablespoons or 2 fluid ounces." },
            { question: "How many teaspoons is ½ cup?", answer: "24 teaspoons. Since 1 cup = 48 teaspoons, ½ cup = 48 ÷ 2 = 24 teaspoons. That's also equal to 8 tablespoons or 4 fluid ounces." },
            { question: "How many teaspoons is ⅓ cup?", answer: "16 teaspoons. Since 1 cup = 48 teaspoons, ⅓ cup = 48 ÷ 3 = 16 teaspoons. That's also equal to 5⅓ tablespoons or 2⅔ fluid ounces." },
            { question: "How many tablespoons are in a cup?", answer: "16 tablespoons in 1 US cup. Since 1 tablespoon = 3 teaspoons, and 1 cup = 48 teaspoons: 48 ÷ 3 = 16 tablespoons. This is one of the most important kitchen conversion facts to memorize." },
            { question: "Is a US cup the same as a metric cup?", answer: "No. A US cup = 236.588 mL, while a metric cup (used in Australia, Canada) = 250 mL. The metric cup is about 5.4% larger. A Japanese cup is even smaller at 200 mL. Always check which cup standard your recipe uses." },
        ],
    },
    "butter-tsp-to-gram-converter": {
        subtitle: "Convert teaspoons of butter to grams (tsp to g). See exact results in grams, ounces, tablespoons, sticks, and cups. Includes a complete butter conversion reference table.",
        contentHTML: `
            <h3>How to Convert Teaspoons of Butter to Grams</h3>
            <p>One teaspoon of butter weighs approximately <strong>4.73 grams</strong>. To convert teaspoons to grams:</p>
            <div class="explanation__highlight">
                <strong>grams = teaspoons × 4.73</strong><br/><br/>
                Example: 3 teaspoons of butter<br/>
                = 3 × 4.73 = <strong>14.19 grams</strong> (1 tablespoon)<br/><br/>
                Example: 24 teaspoons of butter<br/>
                = 24 × 4.73 = <strong>113.52 grams</strong> (1 stick)
            </div>
            <p>This conversion is specific to <strong>butter</strong> (density ~0.959 g/mL). Other fats like oil or lard have slightly different weights per teaspoon.</p>

            <h3>The US Butter Stick — Complete Anatomy</h3>
            <p>In the United States, butter is sold in "sticks" — a format unique to America. Here's how one stick breaks down:</p>
            <table>
                <thead><tr><th>Measurement</th><th>Per Stick</th><th>Per ½ Stick</th><th>Per ¼ Stick</th></tr></thead>
                <tbody>
                    <tr><td><strong>Grams</strong></td><td>113.4 g</td><td>56.7 g</td><td>28.35 g</td></tr>
                    <tr><td><strong>Ounces</strong></td><td>4 oz</td><td>2 oz</td><td>1 oz</td></tr>
                    <tr><td><strong>Tablespoons</strong></td><td>8 tbsp</td><td>4 tbsp</td><td>2 tbsp</td></tr>
                    <tr><td><strong>Teaspoons</strong></td><td>24 tsp</td><td>12 tsp</td><td>6 tsp</td></tr>
                    <tr><td><strong>Cups</strong></td><td>½ cup</td><td>¼ cup</td><td>⅛ cup</td></tr>
                    <tr><td><strong>Pounds</strong></td><td>¼ lb</td><td>⅛ lb</td><td>1/16 lb</td></tr>
                </tbody>
            </table>
            <p><strong>Tip:</strong> A standard US butter box contains 4 sticks = 1 pound = 454 grams = 2 cups.</p>

            <h3>Butter Measurement Quick Reference</h3>
            <table>
                <thead><tr><th>Common Amount</th><th>Teaspoons</th><th>Tablespoons</th><th>Grams</th><th>Ounces</th></tr></thead>
                <tbody>
                    <tr><td>A pat of butter</td><td>~1 tsp</td><td>⅓ tbsp</td><td>~5 g</td><td>~0.17 oz</td></tr>
                    <tr><td>1 tablespoon</td><td>3 tsp</td><td>1 tbsp</td><td>14.2 g</td><td>0.5 oz</td></tr>
                    <tr><td>2 tablespoons</td><td>6 tsp</td><td>2 tbsp</td><td>28.4 g</td><td>1.0 oz</td></tr>
                    <tr><td>¼ cup</td><td>12 tsp</td><td>4 tbsp</td><td>56.7 g</td><td>2.0 oz</td></tr>
                    <tr><td>⅓ cup</td><td>16 tsp</td><td>5⅓ tbsp</td><td>75.7 g</td><td>2.67 oz</td></tr>
                    <tr><td>½ cup (1 stick)</td><td>24 tsp</td><td>8 tbsp</td><td>113.4 g</td><td>4.0 oz</td></tr>
                    <tr><td>⅔ cup</td><td>32 tsp</td><td>10⅔ tbsp</td><td>151.2 g</td><td>5.33 oz</td></tr>
                    <tr><td>¾ cup</td><td>36 tsp</td><td>12 tbsp</td><td>170.1 g</td><td>6.0 oz</td></tr>
                    <tr><td>1 cup (2 sticks)</td><td>48 tsp</td><td>16 tbsp</td><td>226.8 g</td><td>8.0 oz</td></tr>
                    <tr><td>1 lb (4 sticks)</td><td>96 tsp</td><td>32 tbsp</td><td>453.6 g</td><td>16.0 oz</td></tr>
                </tbody>
            </table>

            <h3>Butter vs. Common Substitutes</h3>
            <p>If you're substituting butter in a recipe, the weight per teaspoon differs slightly:</p>
            <table>
                <thead><tr><th>Fat / Spread</th><th>Grams per Teaspoon</th><th>Density (g/mL)</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td><strong>Butter</strong></td><td>4.73 g</td><td>0.959</td><td>Standard dairy butter</td></tr>
                    <tr><td><strong>Margarine</strong></td><td>4.73 g</td><td>~0.96</td><td>Nearly identical to butter</td></tr>
                    <tr><td><strong>Coconut Oil (solid)</strong></td><td>4.51 g</td><td>0.915</td><td>Slightly lighter than butter</td></tr>
                    <tr><td><strong>Ghee (clarified butter)</strong></td><td>4.54 g</td><td>0.921</td><td>Water removed, so denser fat</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>4.49 g</td><td>0.911</td><td>Liquid — use a measuring spoon</td></tr>
                    <tr><td><strong>Lard</strong></td><td>4.52 g</td><td>0.917</td><td>Animal fat, similar to butter</td></tr>
                </tbody>
            </table>

            <h3>Why Americans Measure Butter in Sticks</h3>
            <p>The butter "stick" is an American invention from the early 1900s when butter companies began packaging butter in pre-formed 4-oz bars for convenience. Most other countries sell butter in 250g blocks. The stick system makes it easy to estimate amounts using the tablespoon markings printed on the wrapper — but for precise baking, weighing in grams is always more accurate.</p>

            <h3>Reading Butter Wrapper Markings</h3>
            <p>Each US butter stick wrapper has tablespoon markings printed on it. To measure a specific amount:</p>
            <ul>
                <li><strong>Each marking = 1 tablespoon = 3 teaspoons = 14.2 grams</strong></li>
                <li>The full stick has 8 markings (8 tablespoons = ½ cup)</li>
                <li>Half the stick (4 markings) = ¼ cup</li>
                <li>For teaspoon amounts: 1 marking = 3 teaspoons, so half a marking ≈ 1½ teaspoons</li>
            </ul>
        `,
        faq: [
            { question: "How many grams is 1 teaspoon of butter?", answer: "Approximately 4.73 grams. Butter has a density of about 0.959 g/mL, and a US teaspoon is 4.929 mL. So 4.929 × 0.959 = 4.73 grams per teaspoon." },
            { question: "How many teaspoons of butter is 1 stick?", answer: "24 teaspoons. One US stick of butter = 8 tablespoons = 24 teaspoons = 113.4 grams = 4 ounces = ½ cup. A standard butter box has 4 sticks = 1 pound." },
            { question: "How many grams of butter is 1 tablespoon?", answer: "About 14.2 grams. Since 1 tablespoon = 3 teaspoons, and each teaspoon of butter is 4.73 grams: 3 × 4.73 = 14.19 grams. This is a key number to memorize for baking." },
            { question: "How do I measure a teaspoon of butter?", answer: "The easiest method: use the wrapper markings on a butter stick. Each marking = 1 tablespoon = 3 teaspoons. Cut off ⅓ of a marking for 1 teaspoon (~5g). Alternatively, use a kitchen scale — 1 tsp = 4.73g." },
            { question: "Can I substitute oil for butter teaspoon-for-teaspoon?", answer: "By volume, yes — 1 teaspoon of oil can replace 1 teaspoon of melted butter. But by weight, oil is slightly lighter (4.49g vs 4.73g per tsp). For baking precision, it's better to convert to grams first. Butter also contains water (~15%) while oil is 100% fat, which affects texture." },
            { question: "How many tablespoons in a stick of butter?", answer: "8 tablespoons in one US butter stick. That's also 24 teaspoons, ½ cup, 4 ounces, or 113.4 grams. Each tablespoon marking on the butter wrapper equals 14.2 grams." },
        ],
    },
    "kg-to-stone-converter": {
        subtitle: "Convert kilograms to stone and pounds (kg to st & lbs). See your weight in stone + remaining pounds, total pounds, and ounces. Includes a body weight reference table.",
        contentHTML: `
            <h3>How to Convert Kilograms to Stone & Pounds</h3>
            <p>One stone equals <strong>6.35029 kilograms</strong>, or equivalently, one kilogram equals <strong>0.157473 stone</strong>. To convert:</p>
            <div class="explanation__highlight">
                <strong>Step 1:</strong> Divide kg by 6.35029 to get decimal stone<br/>
                <strong>Step 2:</strong> Take the whole number = stone<br/>
                <strong>Step 3:</strong> Multiply the decimal remainder × 14 = remaining pounds<br/><br/>
                Example: 75 kg<br/>
                = 75 ÷ 6.35029 = 11.811 stone<br/>
                = <strong>11 stone 11.4 pounds</strong> (or 165.3 lbs total)
            </div>

            <h3>Kilograms to Stone & Pounds — Body Weight Chart</h3>
            <table>
                <thead><tr><th>Kilograms</th><th>Stone & Pounds</th><th>Total Pounds</th><th>Decimal Stone</th></tr></thead>
                <tbody>
                    <tr><td>45 kg</td><td>7 st 1.5 lbs</td><td>99.2 lbs</td><td>7.09 st</td></tr>
                    <tr><td>50 kg</td><td>7 st 12.2 lbs</td><td>110.2 lbs</td><td>7.87 st</td></tr>
                    <tr><td>55 kg</td><td>8 st 9.0 lbs</td><td>121.3 lbs</td><td>8.66 st</td></tr>
                    <tr><td>60 kg</td><td>9 st 5.7 lbs</td><td>132.3 lbs</td><td>9.45 st</td></tr>
                    <tr><td>65 kg</td><td>10 st 2.4 lbs</td><td>143.3 lbs</td><td>10.24 st</td></tr>
                    <tr><td>70 kg</td><td>11 st 0.2 lbs</td><td>154.3 lbs</td><td>11.02 st</td></tr>
                    <tr><td>75 kg</td><td>11 st 11.4 lbs</td><td>165.3 lbs</td><td>11.81 st</td></tr>
                    <tr><td>80 kg</td><td>12 st 8.4 lbs</td><td>176.4 lbs</td><td>12.60 st</td></tr>
                    <tr><td>85 kg</td><td>13 st 5.3 lbs</td><td>187.4 lbs</td><td>13.39 st</td></tr>
                    <tr><td>90 kg</td><td>14 st 2.2 lbs</td><td>198.4 lbs</td><td>14.17 st</td></tr>
                    <tr><td>95 kg</td><td>14 st 13.1 lbs</td><td>209.4 lbs</td><td>14.96 st</td></tr>
                    <tr><td>100 kg</td><td>15 st 10.0 lbs</td><td>220.5 lbs</td><td>15.75 st</td></tr>
                    <tr><td>110 kg</td><td>17 st 4.8 lbs</td><td>242.5 lbs</td><td>17.32 st</td></tr>
                    <tr><td>120 kg</td><td>18 st 12.9 lbs</td><td>264.6 lbs</td><td>18.90 st</td></tr>
                    <tr><td>130 kg</td><td>20 st 6.4 lbs</td><td>286.6 lbs</td><td>20.47 st</td></tr>
                    <tr><td>140 kg</td><td>22 st 0.6 lbs</td><td>308.6 lbs</td><td>22.05 st</td></tr>
                    <tr><td>150 kg</td><td>23 st 8.8 lbs</td><td>330.7 lbs</td><td>23.62 st</td></tr>
                </tbody>
            </table>

            <h3>Imperial Weight Units — Complete Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>In Pounds</th><th>In Kilograms</th></tr></thead>
                <tbody>
                    <tr><td>1 grain (gr)</td><td>1/7000 lb</td><td>0.0000648 kg</td></tr>
                    <tr><td>1 ounce (oz)</td><td>1/16 lb</td><td>0.02835 kg</td></tr>
                    <tr><td>1 pound (lb)</td><td>1 lb</td><td>0.4536 kg</td></tr>
                    <tr><td><strong>1 stone (st)</strong></td><td><strong>14 lbs</strong></td><td><strong>6.350 kg</strong></td></tr>
                    <tr><td>1 hundredweight (cwt)</td><td>112 lbs (UK) / 100 lbs (US)</td><td>50.80 / 45.36 kg</td></tr>
                    <tr><td>1 ton</td><td>2,240 lbs (UK long) / 2,000 lbs (US short)</td><td>1,016 / 907 kg</td></tr>
                </tbody>
            </table>

            <h3>What Is a Kilogram?</h3>
            <p>The <strong>kilogram</strong> (kg) is the SI base unit of mass. It equals 1,000 grams, approximately 2.205 pounds, or 0.157 stone. Since 2019, the kilogram is defined using the Planck constant. The kilogram is used worldwide — it's the standard unit for body weight in most countries outside the US, UK, and a few others.</p>

            <h3>What Is a Stone?</h3>
            <p>A <strong>stone</strong> (st) is an imperial unit of weight equal to exactly <strong>14 pounds</strong> or approximately 6.35 kilograms. It originated in medieval England as a unit for weighing commodities like wool. Today it's primarily used for body weight in the United Kingdom and Ireland. One stone is 14 pounds — making it a convenient "package" of pounds for expressing human weight.</p>

            <h3>Where Is Stone Still Used?</h3>
            <ul>
                <li><strong>United Kingdom</strong>: Most British people express body weight in stone and pounds (e.g., "I weigh 11 stone 6").</li>
                <li><strong>Ireland</strong>: Same convention as the UK — stone and pounds for body weight.</li>
                <li><strong>Australia</strong>: Older Australians may still use stone, though kilograms are now the official standard.</li>
                <li><strong>United States</strong>: Stone is <em>not</em> commonly used in the US — Americans typically use pounds only. However, Americans may encounter stone when communicating with British or Irish people.</li>
            </ul>

            <h3>Why Americans Use Pounds Instead of Stone</h3>
            <p>While both the US and UK inherited the imperial system from Britain, the US dropped the stone as a commonly used unit by the mid-1800s. Americans simplified body weight to "just pounds" — so a 154-pound person in the US would be described as "11 stone" in the UK. Neither system uses kilograms in everyday conversation, though medical records in both countries increasingly record weight in kg.</p>

            <h3>BMI Reference — Multiple Units</h3>
            <p>Body Mass Index (BMI) categories using a 5'10" (178 cm) person as an example:</p>
            <table>
                <thead><tr><th>BMI Category</th><th>BMI Range</th><th>Weight (kg)</th><th>Weight (st & lbs)</th><th>Weight (lbs)</th></tr></thead>
                <tbody>
                    <tr><td>Underweight</td><td>< 18.5</td><td>< 58.7 kg</td><td>< 9 st 3.6 lbs</td><td>< 129.4 lbs</td></tr>
                    <tr><td>Normal</td><td>18.5–24.9</td><td>58.7–79.0 kg</td><td>9 st 3.6 – 12 st 6.0</td><td>129.4–174.2 lbs</td></tr>
                    <tr><td>Overweight</td><td>25.0–29.9</td><td>79.0–94.8 kg</td><td>12 st 6.0 – 14 st 13.0</td><td>174.2–209.0 lbs</td></tr>
                    <tr><td>Obese</td><td>≥ 30.0</td><td>≥ 94.8 kg</td><td>≥ 14 st 13.0</td><td>≥ 209.0 lbs</td></tr>
                </tbody>
            </table>
        `,
        faq: [
            { question: "How many stone is 70 kg?", answer: "70 kg = 11 stone 0.2 pounds (11.02 stone total). To calculate: 70 ÷ 6.35029 = 11.02 stone. The whole number (11) is stone. The decimal (0.02 × 14) = 0.2 remaining pounds." },
            { question: "How do I convert kg to stone and pounds?", answer: "Divide your weight in kg by 6.35029 to get decimal stone. The whole number is your stone. Multiply the decimal part by 14 to get remaining pounds. Example: 80 kg ÷ 6.35029 = 12.598 → 12 stone and (0.598 × 14) = 8.4 pounds = 12 st 8.4 lbs." },
            { question: "How many pounds is 1 stone?", answer: "Exactly 14 pounds. The stone is defined as 14 avoirdupois pounds. So 10 stone = 140 lbs, 11 stone = 154 lbs, 12 stone = 168 lbs, etc." },
            { question: "Is stone used in the United States?", answer: "No — stone is virtually never used in the US. Americans express body weight in pounds only (e.g., '165 lbs' not '11 stone 11'). However, Americans may encounter stone when communicating with people from the UK or Ireland, where stone is the standard for body weight." },
            { question: "How many kg is 1 stone?", answer: "1 stone = 6.35029 kilograms (approximately 6.35 kg). Since 1 stone = 14 pounds, and 1 pound = 0.453592 kg: 14 × 0.453592 = 6.35029 kg." },
            { question: "What is 100 kg in stone?", answer: "100 kg = 15 stone 10.0 pounds (15.75 stone total). To calculate: 100 ÷ 6.35029 = 15.747 → 15 stone and (0.747 × 14) = 10.5 remaining pounds." },
        ],
    },
    "gram-to-liter-converter": {
        subtitle: "Convert grams to liters (g to L) for any substance. Select from 20 common ingredients or enter a custom density. See results in liters, US gallons, quarts, and milliliters.",
        contentHTML: `
            <h3>How to Convert Grams to Liters</h3>
            <p>Grams measure <strong>weight</strong>, while liters measure <strong>volume</strong>. To convert between them, you need the substance's density:</p>
            <div class="explanation__highlight">
                <strong>liters = grams ÷ (density in g/mL × 1,000)</strong><br/><br/>
                Example: 500 grams of water (density 1.00 g/mL)<br/>
                = 500 ÷ (1.00 × 1000) = <strong>0.5 liters</strong> (about 2.1 cups)<br/><br/>
                Example: 500 grams of flour (density 0.53 g/mL)<br/>
                = 500 ÷ (0.53 × 1000) = <strong>0.943 liters</strong> (about 4 cups)<br/><br/>
                Example: 500 grams of olive oil (density 0.91 g/mL)<br/>
                = 500 ÷ (0.91 × 1000) = <strong>0.549 liters</strong>
            </div>
            <p>Notice how 500g of flour takes up almost twice as much space as 500g of water — because flour is much less dense.</p>

            <h3>Grams to Liters — By Substance</h3>
            <p>How much volume does each substance occupy per weight?</p>
            <table>
                <thead><tr><th>Substance</th><th>Density (g/mL)</th><th>100g =</th><th>500g =</th><th>1,000g =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00</td><td>0.100 L</td><td>0.500 L</td><td>1.000 L</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03</td><td>0.097 L</td><td>0.485 L</td><td>0.971 L</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.91</td><td>0.110 L</td><td>0.549 L</td><td>1.099 L</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.43</td><td>0.070 L</td><td>0.350 L</td><td>0.699 L</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.53</td><td>0.189 L</td><td>0.943 L</td><td>1.887 L</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85</td><td>0.118 L</td><td>0.588 L</td><td>1.176 L</td></tr>
                    <tr><td><strong>Rice (uncooked)</strong></td><td>0.82</td><td>0.122 L</td><td>0.610 L</td><td>1.220 L</td></tr>
                    <tr><td><strong>Salt (table)</strong></td><td>1.20</td><td>0.083 L</td><td>0.417 L</td><td>0.833 L</td></tr>
                    <tr><td><strong>Butter</strong></td><td>0.91</td><td>0.110 L</td><td>0.549 L</td><td>1.099 L</td></tr>
                    <tr><td><strong>Heavy Cream</strong></td><td>1.01</td><td>0.099 L</td><td>0.495 L</td><td>0.990 L</td></tr>
                </tbody>
            </table>

            <h3>Why the Metric System Makes This Easy</h3>
            <p>The metric system was designed so that <strong>1 gram of water = 1 milliliter = 1 cubic centimeter</strong> (at 4°C). This elegant relationship means:</p>
            <ul>
                <li>1,000 grams (1 kg) of water = 1,000 mL = <strong>1 liter</strong></li>
                <li>500 grams of water = 500 mL = <strong>0.5 liters</strong></li>
                <li>250 grams of water = 250 mL = <strong>0.25 liters</strong></li>
            </ul>
            <p>For any other substance, just divide by its density. The closer the density is to 1.0, the closer the grams-to-mL ratio is to 1:1.</p>

            <h3>US Volume Equivalents</h3>
            <p>Since Americans commonly use gallons, quarts, and cups:</p>
            <table>
                <thead><tr><th>Liters</th><th>US Gallons</th><th>US Quarts</th><th>US Cups</th></tr></thead>
                <tbody>
                    <tr><td>0.1 L (100 mL)</td><td>0.026 gal</td><td>0.106 qt</td><td>0.423 cups</td></tr>
                    <tr><td>0.25 L (250 mL)</td><td>0.066 gal</td><td>0.264 qt</td><td>1.057 cups</td></tr>
                    <tr><td>0.5 L (500 mL)</td><td>0.132 gal</td><td>0.528 qt</td><td>2.113 cups</td></tr>
                    <tr><td>1.0 L</td><td>0.264 gal</td><td>1.057 qt</td><td>4.227 cups</td></tr>
                    <tr><td>2.0 L</td><td>0.528 gal</td><td>2.113 qt</td><td>8.454 cups</td></tr>
                    <tr><td>3.785 L</td><td>1.000 gal</td><td>4.000 qt</td><td>16.000 cups</td></tr>
                </tbody>
            </table>

            <h3>What Is a Gram?</h3>
            <p>A <strong>gram</strong> (g) is a metric unit of mass equal to one thousandth of a kilogram (1/1,000 kg), or approximately 0.035 ounces. In the metric system, grams are the standard unit for measuring recipe ingredients and food labels. One gram of water occupies exactly 1 milliliter at 4°C — this was a deliberate design choice in the metric system.</p>

            <h3>What Is a Liter?</h3>
            <p>A <strong>liter</strong> (L) is a metric unit of volume equal to 1,000 milliliters, 1,000 cubic centimeters, or approximately 0.264 US gallons. For Americans: 1 liter is slightly more than 1 US quart (1 L ≈ 1.057 qt). A 2-liter soda bottle holds about half a gallon.</p>

            <h3>When to Convert Grams to Liters</h3>
            <ul>
                <li><strong>Cooking and recipes</strong>: A European recipe lists 500g of flour — using this converter you'd find that's about 0.943 liters (≈ 4 US cups).</li>
                <li><strong>Shipping and packaging</strong>: You know a product weighs 2,000g but need to pick a container by volume.</li>
                <li><strong>Chemistry</strong>: Dissolving a known mass of solute into a solution requires knowing the volume relationship.</li>
                <li><strong>Beverages</strong>: A recipe yields 1,500g of juice. At a density near water, that's about 1.5 liters (~0.4 gallons).</li>
                <li><strong>Gardening</strong>: Soil and fertilizer are often measured by weight but applied by volume.</li>
            </ul>
        `,
        faq: [
            { question: "How many liters is 500 grams?", answer: "It depends on the substance. For water (density 1.0 g/mL): 500g = 0.5 liters. For flour (density 0.53 g/mL): 500g = 0.943 liters. For honey (density 1.43 g/mL): 500g = only 0.35 liters. You must know the density." },
            { question: "Is 1 gram equal to 1 milliliter?", answer: "Only for water (at approximately 4°C). Since water has a density of 1.00 g/mL, 1 gram of water = exactly 1 milliliter. For other substances, the ratio depends on density. Flour is only 0.53 g/mL, so 1 gram of flour = 1.89 mL." },
            { question: "How do I convert grams to liters?", answer: "Divide the weight in grams by (density in g/mL × 1000). Formula: liters = grams ÷ (density × 1000). Example: 750g of milk ÷ (1.03 × 1000) = 0.728 liters." },
            { question: "How many grams of flour is 1 liter?", answer: "Approximately 530 grams. Flour has a density of ~0.53 g/mL, so 1 liter (1000 mL) of flour weighs about 530 grams. That's roughly 4.2 US cups of flour." },
            { question: "How many US cups is 1 liter?", answer: "Approximately 4.227 US cups. Or think of it this way: 1 US cup ≈ 236.6 mL, so 1,000 mL ÷ 236.6 = 4.227 cups. A 2-liter soda bottle holds about 8.45 cups." },
            { question: "Why does 500g of flour take up more space than 500g of water?", answer: "Because flour is less dense than water. Flour has a density of ~0.53 g/mL vs water's 1.00 g/mL. This means flour particles have a lot of air trapped between them, making 500g of flour occupy almost twice the volume (943 mL vs 500 mL)." },
        ],
    },
    "ml-to-mg-converter": {
        subtitle: "Convert milliliters to milligrams (mL to mg) for any substance. Select from 20 common ingredients or enter a custom density. Ideal for medication dosing and lab work.",
        contentHTML: `
            <h3>How to Convert Milliliters to Milligrams</h3>
            <p>Milliliters measure <strong>volume</strong> while milligrams measure <strong>weight</strong>. To convert between them, you need the substance's density:</p>
            <div class="explanation__highlight">
                <strong>milligrams = milliliters × density (g/mL) × 1,000</strong><br/><br/>
                Example: 5 mL of water (density 1.00 g/mL)<br/>
                = 5 × 1.00 × 1,000 = <strong>5,000 mg</strong><br/><br/>
                Example: 5 mL of olive oil (density 0.91 g/mL)<br/>
                = 5 × 0.91 × 1,000 = <strong>4,550 mg</strong><br/><br/>
                Example: 5 mL of honey (density 1.43 g/mL)<br/>
                = 5 × 1.43 × 1,000 = <strong>7,150 mg</strong>
            </div>

            <h3>Milliliters to Milligrams — By Substance</h3>
            <table>
                <thead><tr><th>Substance</th><th>Density (g/mL)</th><th>1 mL =</th><th>5 mL =</th><th>10 mL =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00</td><td>1,000 mg</td><td>5,000 mg</td><td>10,000 mg</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03</td><td>1,030 mg</td><td>5,150 mg</td><td>10,300 mg</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.91</td><td>910 mg</td><td>4,550 mg</td><td>9,100 mg</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.43</td><td>1,430 mg</td><td>7,150 mg</td><td>14,300 mg</td></tr>
                    <tr><td><strong>Rubbing Alcohol</strong></td><td>0.79</td><td>790 mg</td><td>3,950 mg</td><td>7,900 mg</td></tr>
                    <tr><td><strong>Glycerin</strong></td><td>1.26</td><td>1,260 mg</td><td>6,300 mg</td><td>12,600 mg</td></tr>
                    <tr><td><strong>Maple Syrup</strong></td><td>1.33</td><td>1,330 mg</td><td>6,650 mg</td><td>13,300 mg</td></tr>
                    <tr><td><strong>Coconut Oil (liquid)</strong></td><td>0.92</td><td>920 mg</td><td>4,600 mg</td><td>9,200 mg</td></tr>
                    <tr><td><strong>Soy Sauce</strong></td><td>1.20</td><td>1,200 mg</td><td>6,000 mg</td><td>12,000 mg</td></tr>
                    <tr><td><strong>Vanilla Extract</strong></td><td>0.88</td><td>880 mg</td><td>4,400 mg</td><td>8,800 mg</td></tr>
                </tbody>
            </table>

            <h3>Medication Dosing — mL to mg Reference</h3>
            <p>Many liquid medications are labeled in mg but measured in mL. Common US OTC medications:</p>
            <table>
                <thead><tr><th>Medication</th><th>Concentration</th><th>5 mL dose =</th><th>10 mL dose =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Children's Tylenol</strong></td><td>160 mg per 5 mL</td><td>160 mg</td><td>320 mg</td></tr>
                    <tr><td><strong>Children's Motrin</strong></td><td>100 mg per 5 mL</td><td>100 mg</td><td>200 mg</td></tr>
                    <tr><td><strong>Benadryl Liquid</strong></td><td>12.5 mg per 5 mL</td><td>12.5 mg</td><td>25 mg</td></tr>
                    <tr><td><strong>NyQuil</strong></td><td>650 mg/30 mL dose</td><td>108 mg</td><td>217 mg</td></tr>
                    <tr><td><strong>Amoxicillin Susp.</strong></td><td>250 mg per 5 mL</td><td>250 mg</td><td>500 mg</td></tr>
                </tbody>
            </table>
            <p><strong>⚠️ Important:</strong> This table is for reference only. Always follow your doctor's or pharmacist's instructions for medication dosing.</p>

            <h3>mL vs. cc — Are They the Same?</h3>
            <p>Yes. <strong>1 mL = 1 cc</strong> (cubic centimeter). In medical and pharmaceutical settings, you'll see both abbreviations used interchangeably. A "3 cc syringe" holds exactly 3 mL. The term "cc" is more common in medical jargon, while "mL" is the standard SI unit used on medication labels.</p>

            <h3>Measuring Small Volumes</h3>
            <table>
                <thead><tr><th>Tool</th><th>Typical Size</th><th>Best For</th></tr></thead>
                <tbody>
                    <tr><td><strong>Oral syringe</strong></td><td>1 mL, 5 mL, 10 mL</td><td>Most accurate for medication</td></tr>
                    <tr><td><strong>Medicine dropper</strong></td><td>~1 mL (20 drops)</td><td>Essential oils, infant doses</td></tr>
                    <tr><td><strong>Dosing cup</strong></td><td>5 mL – 30 mL</td><td>Liquid cold/flu medicine</td></tr>
                    <tr><td><strong>Teaspoon</strong></td><td>~5 mL</td><td>Kitchen — NOT precise for meds</td></tr>
                    <tr><td><strong>Tablespoon</strong></td><td>~15 mL</td><td>Kitchen — NOT precise for meds</td></tr>
                </tbody>
            </table>

            <h3>What Is a Milliliter?</h3>
            <p>A <strong>milliliter</strong> (mL) is a metric unit of volume equal to one thousandth of a liter (1/1,000 L) or one cubic centimeter (1 cc). In medicine, mL is the standard unit for liquid dosing. One US teaspoon equals approximately 4.929 mL, though for medication labeling the FDA uses 5 mL per teaspoon.</p>

            <h3>What Is a Milligram?</h3>
            <p>A <strong>milligram</strong> (mg) is a metric unit of mass equal to one thousandth of a gram (1/1,000 g) or one millionth of a kilogram. Drug dosages are almost always expressed in milligrams. For water-based solutions (density ~1.0 g/mL), 1 mL = 1,000 mg — a clean conversion specific to water.</p>

            <h3>When to Convert mL to mg</h3>
            <ul>
                <li><strong>Medication dosing</strong>: A prescription says "take 10 mL" — you want to know how many mg of active ingredient that contains.</li>
                <li><strong>Supplement drops</strong>: Vitamin D drops are measured in mL but labeled in IU/mg.</li>
                <li><strong>Lab chemistry</strong>: Converting between measured volumes and required masses for solutions.</li>
                <li><strong>Cooking</strong>: A recipe uses mL for a flavoring but the label shows mg per serving.</li>
                <li><strong>Essential oils</strong>: Dosing by drops (volume) while safety limits are given in mg.</li>
            </ul>
        `,
        faq: [
            { question: "How many mg is 1 mL?", answer: "For water: 1 mL = 1,000 mg (1 gram). But this only applies to substances with a density of 1.0 g/mL. For other substances, multiply 1 mL by the density in g/mL and then by 1,000. Example: 1 mL of olive oil (0.91 g/mL) = 910 mg." },
            { question: "How many mg is 5 mL of medicine?", answer: "That depends on the medication's concentration, not just the volume. For example, Children's Tylenol is 160 mg per 5 mL, while Benadryl Liquid is 12.5 mg per 5 mL. Check the label for the 'mg per mL' concentration, then multiply by the volume in mL." },
            { question: "Is 1 mL the same as 1 cc?", answer: "Yes, exactly. 1 milliliter (mL) = 1 cubic centimeter (cc). They are interchangeable. Medical professionals often use 'cc' while pharmacists and medication labels typically use 'mL'. A 5 cc syringe holds exactly 5 mL." },
            { question: "How many mg is 10 mL of water?", answer: "10,000 mg (10 grams). Since water has a density of 1.00 g/mL: 10 mL × 1.00 g/mL × 1,000 = 10,000 mg. This is the simplest conversion because water's density is exactly 1." },
            { question: "Should I use a teaspoon to measure medication?", answer: "No — the FDA and pediatricians recommend using an oral syringe or dosing cup instead of kitchen spoons. Kitchen teaspoons can vary from 3 mL to 7 mL, potentially causing under- or over-dosing. An oral syringe measures precisely to 0.1 mL." },
            { question: "How do I convert mL to mg for a liquid medication?", answer: "You need the drug's concentration (found on the label). Formula: mg = mL × concentration (mg/mL). Example: If a cough syrup is 50 mg/5 mL (= 10 mg/mL), then 15 mL = 15 × 10 = 150 mg of active ingredient." },
        ],
    },
    "liter-to-gram-converter": {
        subtitle: "Convert liters to grams (L to g) for any substance. Select from 20 common ingredients or enter a custom density. See results in grams, kilograms, and pounds.",
        contentHTML: `
            <h3>How to Convert Liters to Grams</h3>
            <p>Liters measure <strong>volume</strong> while grams measure <strong>weight</strong>. To convert, multiply the volume by the substance's density:</p>
            <div class="explanation__highlight">
                <strong>grams = liters × density (g/mL) × 1,000</strong><br/><br/>
                Example: 1 liter of water (density 1.00 g/mL)<br/>
                = 1 × 1.00 × 1,000 = <strong>1,000 grams</strong> (1 kg / 2.2 lbs)<br/><br/>
                Example: 1 liter of olive oil (density 0.91 g/mL)<br/>
                = 1 × 0.91 × 1,000 = <strong>910 grams</strong><br/><br/>
                Example: 1 liter of honey (density 1.43 g/mL)<br/>
                = 1 × 1.43 × 1,000 = <strong>1,430 grams</strong> (3.15 lbs)
            </div>
            <p>The density factor means 1 liter of honey weighs 43% more than 1 liter of water!</p>

            <h3>Liters to Grams — By Substance</h3>
            <table>
                <thead><tr><th>Substance</th><th>Density (g/mL)</th><th>0.5 L =</th><th>1 L =</th><th>2 L =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00</td><td>500 g</td><td>1,000 g</td><td>2,000 g</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03</td><td>515 g</td><td>1,030 g</td><td>2,060 g</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.91</td><td>455 g</td><td>910 g</td><td>1,820 g</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.43</td><td>715 g</td><td>1,430 g</td><td>2,860 g</td></tr>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.53</td><td>265 g</td><td>530 g</td><td>1,060 g</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85</td><td>425 g</td><td>850 g</td><td>1,700 g</td></tr>
                    <tr><td><strong>Vegetable Oil</strong></td><td>0.92</td><td>460 g</td><td>920 g</td><td>1,840 g</td></tr>
                    <tr><td><strong>Heavy Cream</strong></td><td>1.01</td><td>505 g</td><td>1,010 g</td><td>2,020 g</td></tr>
                    <tr><td><strong>Maple Syrup</strong></td><td>1.33</td><td>665 g</td><td>1,330 g</td><td>2,660 g</td></tr>
                    <tr><td><strong>Rubbing Alcohol</strong></td><td>0.79</td><td>395 g</td><td>790 g</td><td>1,580 g</td></tr>
                </tbody>
            </table>

            <h3>Common US Container Sizes — How Much Do They Weigh?</h3>
            <p>Americans encounter liters primarily with beverages. Here's what common containers weigh when filled with water:</p>
            <table>
                <thead><tr><th>Container</th><th>Volume</th><th>Water Weight</th><th>Milk Weight</th></tr></thead>
                <tbody>
                    <tr><td>Water bottle (standard)</td><td>0.5 L (16.9 fl oz)</td><td>500 g (1.1 lbs)</td><td>515 g</td></tr>
                    <tr><td>Soda bottle (large)</td><td>1 L (33.8 fl oz)</td><td>1,000 g (2.2 lbs)</td><td>1,030 g</td></tr>
                    <tr><td>2-Liter soda bottle</td><td>2 L (67.6 fl oz)</td><td>2,000 g (4.4 lbs)</td><td>2,060 g</td></tr>
                    <tr><td>US gallon jug</td><td>3.785 L (128 fl oz)</td><td>3,785 g (8.3 lbs)</td><td>3,899 g</td></tr>
                    <tr><td>5-gallon water cooler</td><td>18.93 L</td><td>18,930 g (41.7 lbs)</td><td>—</td></tr>
                </tbody>
            </table>

            <h3>Liters to US Volume Units</h3>
            <table>
                <thead><tr><th>Liters</th><th>US Gallons</th><th>US Quarts</th><th>US Cups</th><th>Fluid Ounces</th></tr></thead>
                <tbody>
                    <tr><td>0.25 L</td><td>0.066 gal</td><td>0.264 qt</td><td>1.06 cups</td><td>8.45 fl oz</td></tr>
                    <tr><td>0.5 L</td><td>0.132 gal</td><td>0.528 qt</td><td>2.11 cups</td><td>16.91 fl oz</td></tr>
                    <tr><td>1 L</td><td>0.264 gal</td><td>1.057 qt</td><td>4.23 cups</td><td>33.81 fl oz</td></tr>
                    <tr><td>2 L</td><td>0.528 gal</td><td>2.113 qt</td><td>8.45 cups</td><td>67.63 fl oz</td></tr>
                    <tr><td>3.785 L</td><td>1.000 gal</td><td>4.000 qt</td><td>16.00 cups</td><td>128.00 fl oz</td></tr>
                </tbody>
            </table>

            <h3>What Is a Liter?</h3>
            <p>A <strong>liter</strong> (L) is a metric unit of volume equal to 1,000 milliliters or 1,000 cubic centimeters. For Americans: 1 liter ≈ 1.057 US quarts, or about 4.23 US cups. The most familiar liter container in the US is the 2-liter soda bottle, which holds approximately half a gallon.</p>

            <h3>What Is a Gram?</h3>
            <p>A <strong>gram</strong> (g) is a metric unit of mass equal to 1/1,000 of a kilogram or approximately 0.035 ounces. The metric system was designed so that 1 gram of water = 1 mL at 4°C. This means 1 liter of water weighs exactly 1,000 grams (1 kg). For other substances, the weight per liter varies based on density.</p>

            <h3>When to Convert Liters to Grams</h3>
            <ul>
                <li><strong>Cooking</strong>: An American recipe calls for "1 liter of broth" — you need to know how much that weighs for shipping or portioning.</li>
                <li><strong>Shipping</strong>: Freight costs are based on weight. Converting a 5-liter container of oil to grams helps calculate shipping fees.</li>
                <li><strong>Nutrition</strong>: Understanding how much a 2-liter bottle of soda weighs helps visualize calorie density.</li>
                <li><strong>Chemistry</strong>: Lab work often requires knowing the mass of a measured volume of solution.</li>
                <li><strong>Water storage</strong>: Planning emergency water reserves requires converting gallons/liters to weight for shelf and floor capacity.</li>
            </ul>
        `,
        faq: [
            { question: "How many grams is 1 liter of water?", answer: "Exactly 1,000 grams (1 kilogram or 2.2 pounds). This is by design — the metric system defined the gram so that 1 mL of water = 1 gram. Therefore 1,000 mL (1 liter) = 1,000 grams." },
            { question: "How many grams is 1 liter of milk?", answer: "Approximately 1,030 grams. Milk is slightly denser than water (1.03 g/mL vs 1.00 g/mL) due to dissolved sugars, proteins, and fats. So 1 liter of whole milk weighs about 30g more than 1 liter of water." },
            { question: "How many grams is 1 liter of oil?", answer: "About 910 grams for olive oil (density 0.91 g/mL) or 920 grams for vegetable oil (density 0.92 g/mL). Oil is lighter than water, which is why oil floats on water — and why 1 liter of oil weighs less than 1 liter of water." },
            { question: "How many pounds does a 2-liter bottle weigh?", answer: "About 4.4 pounds when filled with water (2,000 grams = 2 kg ≈ 4.41 lbs). A 2-liter soda bottle weighs slightly more due to the sugar content — a Cola with ~108g of sugar in 2L has a density of about 1.04 g/mL, so it weighs ~2,080g (4.59 lbs)." },
            { question: "How heavy is a gallon of water?", answer: "About 8.34 pounds (3,785 grams). One US gallon = 3.785 liters, and since water weighs 1,000 grams per liter: 3.785 × 1,000 = 3,785 grams. The old saying 'a pint's a pound the world around' is approximately true (1 pint ≈ 473g ≈ 1.04 lbs)." },
            { question: "Does 1 liter always equal 1 kilogram?", answer: "Only for water (at ~4°C). For any other substance, 1 liter weighs more or less than 1 kg depending on density. Honey: 1L = 1.43 kg. Oil: 1L = 0.91 kg. Flour: 1L = only 0.53 kg. You must know the density to convert accurately." },
        ],
    },
    "cup-to-gram-converter": {
        subtitle: "Convert US cups to grams (c to g) for any ingredient. Select from 20 common substances or enter a custom density. Includes a fractional cup reference table for baking.",
        contentHTML: `
            <h3>How to Convert Cups to Grams</h3>
            <p>Cups measure <strong>volume</strong> while grams measure <strong>weight</strong>. To convert, multiply the cup measurement by the cup volume in mL (236.588) and by the ingredient's density:</p>
            <div class="explanation__highlight">
                <strong>grams = cups × 236.588 × density (g/mL)</strong><br/><br/>
                Example: 1 cup of water (density 1.00 g/mL)<br/>
                = 1 × 236.588 × 1.00 = <strong>236.6 grams</strong><br/><br/>
                Example: 1 cup of all-purpose flour (density 0.53 g/mL)<br/>
                = 1 × 236.588 × 0.53 = <strong>125.4 grams</strong><br/><br/>
                Example: 1 cup of granulated sugar (density 0.85 g/mL)<br/>
                = 1 × 236.588 × 0.85 = <strong>201.1 grams</strong>
            </div>

            <h3>One Cup in Grams — Common Baking Ingredients</h3>
            <p>The most searched baking conversions — how much does 1 cup weigh?</p>
            <table>
                <thead><tr><th>Ingredient</th><th>Density</th><th>¼ cup</th><th>½ cup</th><th>1 cup</th></tr></thead>
                <tbody>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>0.53 g/mL</td><td>31 g</td><td>63 g</td><td>125 g</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85 g/mL</td><td>50 g</td><td>101 g</td><td>201 g</td></tr>
                    <tr><td><strong>Brown Sugar (packed)</strong></td><td>0.93 g/mL</td><td>55 g</td><td>110 g</td><td>220 g</td></tr>
                    <tr><td><strong>Powdered Sugar</strong></td><td>0.56 g/mL</td><td>33 g</td><td>66 g</td><td>132 g</td></tr>
                    <tr><td><strong>Butter</strong></td><td>0.91 g/mL</td><td>54 g</td><td>108 g</td><td>215 g</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03 g/mL</td><td>61 g</td><td>122 g</td><td>244 g</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.91 g/mL</td><td>54 g</td><td>108 g</td><td>215 g</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.43 g/mL</td><td>85 g</td><td>169 g</td><td>338 g</td></tr>
                    <tr><td><strong>Rice (uncooked)</strong></td><td>0.82 g/mL</td><td>49 g</td><td>97 g</td><td>194 g</td></tr>
                    <tr><td><strong>Oats (rolled)</strong></td><td>0.34 g/mL</td><td>20 g</td><td>40 g</td><td>80 g</td></tr>
                </tbody>
            </table>
            <p><strong>Key insight:</strong> 1 cup of flour (125g) and 1 cup of sugar (201g) are very different weights — this is exactly why professional bakers weigh ingredients in grams.</p>

            <h3>Why Cup Measures Vary by Ingredient</h3>
            <p>A cup is a <strong>volume</strong> measurement — it always holds exactly 236.588 mL of space. But different ingredients fill that space differently:</p>
            <ul>
                <li><strong>Flour</strong> is fluffy with lots of air → 1 cup = only 125g</li>
                <li><strong>Sugar</strong> is denser, granules pack tighter → 1 cup = 201g</li>
                <li><strong>Honey</strong> is a thick liquid → 1 cup = 338g</li>
                <li><strong>Oats</strong> are very airy → 1 cup = only 80g</li>
            </ul>
            <p>This is why "1 cup" can mean anything from 80g to 338g depending on the ingredient.</p>

            <h3>Scooping vs. Weighing — Why Grams Win</h3>
            <p>How you scoop flour into a cup drastically changes the weight:</p>
            <table>
                <thead><tr><th>Method</th><th>1 Cup of Flour</th><th>Difference</th></tr></thead>
                <tbody>
                    <tr><td>Spoon-and-level (standard)</td><td>~125 g</td><td>Baseline</td></tr>
                    <tr><td>Scoop directly from bag</td><td>~140–160 g</td><td>+12% to +28%</td></tr>
                    <tr><td>Sifted, then spooned</td><td>~110–115 g</td><td>-8% to -12%</td></tr>
                    <tr><td>Kitchen scale (grams)</td><td>Exactly 125 g</td><td>0% error</td></tr>
                </tbody>
            </table>
            <p>That 28% difference between scooping and spoon-leveling can mean the difference between a light, fluffy cake and a dense brick. This is the #1 reason why bakers recommend weighing ingredients.</p>

            <h3>US Cup vs. Metric Cup vs. Imperial Cup</h3>
            <table>
                <thead><tr><th>Cup Standard</th><th>Volume</th><th>Where Used</th></tr></thead>
                <tbody>
                    <tr><td><strong>US Customary Cup</strong></td><td>236.588 mL (8 US fl oz)</td><td>United States</td></tr>
                    <tr><td><strong>Metric Cup</strong></td><td>250 mL</td><td>Australia, Canada, NZ</td></tr>
                    <tr><td><strong>Imperial Cup</strong></td><td>284.131 mL (10 imp fl oz)</td><td>UK (historical)</td></tr>
                    <tr><td><strong>Japanese Cup</strong></td><td>200 mL</td><td>Japan</td></tr>
                </tbody>
            </table>
            <p>When following a recipe, always check which "cup" is intended. A metric cup is 5.7% larger than a US cup.</p>

            <h3>What Is a Cup?</h3>
            <p>A <strong>US customary cup</strong> is a unit of volume equal to 236.588 mL, 8 US fluid ounces, 16 tablespoons, or 48 teaspoons. It is the standard volume measure used in American home cooking and baking recipes.</p>

            <h3>What Is a Gram?</h3>
            <p>A <strong>gram</strong> (g) is a metric unit of mass equal to 1/1,000 of a kilogram or approximately 0.035 ounces. In baking, grams are the preferred measurement because they are precise and not affected by how you scoop or level your ingredients.</p>
        `,
        faq: [
            { question: "How many grams is 1 cup of flour?", answer: "Approximately 125 grams when spooned and leveled (the standard method). If scooped directly from the bag, it can be 140–160g due to compaction. For baking accuracy, always weigh flour on a kitchen scale." },
            { question: "How many grams is 1 cup of sugar?", answer: "About 201 grams for granulated (white) sugar. Brown sugar (packed) is heavier at ~220g per cup. Powdered/confectioner's sugar is lighter at ~132g per cup. Each type of sugar has a different density." },
            { question: "How many grams in a cup of butter?", answer: "About 215 grams (7.6 oz). In the US butter stick system, 1 cup = 2 sticks = 226.8g. The slight difference is because stick measurements are exact (by weight) while cup measurements depend on how tightly the butter is packed." },
            { question: "Why do bakers prefer grams over cups?", answer: "Because cups measure volume, and volume varies depending on how you fill the cup. Scooping flour directly can give you 28% more flour than spooning-and-leveling. Grams always give the exact weight regardless of technique. This consistency produces better, more reproducible baking results." },
            { question: "Is a US cup the same as a metric cup?", answer: "No. A US cup = 236.588 mL, while a metric cup (Australia, Canada) = 250 mL — about 5.7% larger. A recipe calling for '2 metric cups' of flour would be 250g, while '2 US cups' would be about 236g. Always check which standard your recipe uses." },
            { question: "How many tablespoons in a cup?", answer: "16 tablespoons = 1 US cup. Other equivalents: 1 cup = 48 teaspoons = 8 fluid ounces = 236.588 mL = approximately ¼ of a quart." },
        ],
    },
    "min-to-hour-converter": {
        subtitle: "Convert minutes to hours and minutes (min to hr). See results in decimal hours, HH:MM format, seconds, and percentage of day. Includes a quick reference table.",
        contentHTML: `
            <h3>How to Convert Minutes to Hours</h3>
            <p>Since there are <strong>60 minutes in 1 hour</strong>, divide the number of minutes by 60:</p>
            <div class="explanation__highlight">
                <strong>hours = minutes ÷ 60</strong><br/><br/>
                <strong>Step 1:</strong> Divide to get decimal hours<br/>
                90 ÷ 60 = <strong>1.5 hours</strong><br/><br/>
                <strong>Step 2:</strong> Convert to hours & minutes<br/>
                Whole hours = 1<br/>
                Remaining minutes = (1.5 − 1) × 60 = 30<br/>
                = <strong>1 hour 30 minutes</strong> (1:30)
            </div>

            <h3>Minutes to Hours — Conversion Table</h3>
            <table>
                <thead><tr><th>Minutes</th><th>Hours & Min</th><th>Decimal Hours</th><th>Seconds</th></tr></thead>
                <tbody>
                    <tr><td>1 min</td><td>0h 1m</td><td>0.0167 hr</td><td>60 s</td></tr>
                    <tr><td>5 min</td><td>0h 5m</td><td>0.0833 hr</td><td>300 s</td></tr>
                    <tr><td>10 min</td><td>0h 10m</td><td>0.1667 hr</td><td>600 s</td></tr>
                    <tr><td>15 min</td><td>0h 15m</td><td>0.25 hr</td><td>900 s</td></tr>
                    <tr><td>20 min</td><td>0h 20m</td><td>0.3333 hr</td><td>1,200 s</td></tr>
                    <tr><td>30 min</td><td>0h 30m</td><td>0.50 hr</td><td>1,800 s</td></tr>
                    <tr><td>45 min</td><td>0h 45m</td><td>0.75 hr</td><td>2,700 s</td></tr>
                    <tr><td>60 min</td><td>1h 0m</td><td>1.00 hr</td><td>3,600 s</td></tr>
                    <tr><td>90 min</td><td>1h 30m</td><td>1.50 hr</td><td>5,400 s</td></tr>
                    <tr><td>120 min</td><td>2h 0m</td><td>2.00 hr</td><td>7,200 s</td></tr>
                    <tr><td>150 min</td><td>2h 30m</td><td>2.50 hr</td><td>9,000 s</td></tr>
                    <tr><td>180 min</td><td>3h 0m</td><td>3.00 hr</td><td>10,800 s</td></tr>
                    <tr><td>240 min</td><td>4h 0m</td><td>4.00 hr</td><td>14,400 s</td></tr>
                    <tr><td>300 min</td><td>5h 0m</td><td>5.00 hr</td><td>18,000 s</td></tr>
                    <tr><td>360 min</td><td>6h 0m</td><td>6.00 hr</td><td>21,600 s</td></tr>
                    <tr><td>480 min</td><td>8h 0m</td><td>8.00 hr</td><td>28,800 s</td></tr>
                    <tr><td>720 min</td><td>12h 0m</td><td>12.00 hr</td><td>43,200 s</td></tr>
                    <tr><td>1,440 min</td><td>24h 0m</td><td>24.00 hr</td><td>86,400 s</td></tr>
                </tbody>
            </table>

            <h3>Time Unit Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>Equivalent</th><th>In Seconds</th></tr></thead>
                <tbody>
                    <tr><td>1 millisecond</td><td>0.001 seconds</td><td>0.001 s</td></tr>
                    <tr><td>1 second</td><td>1,000 milliseconds</td><td>1 s</td></tr>
                    <tr><td><strong>1 minute</strong></td><td><strong>60 seconds</strong></td><td><strong>60 s</strong></td></tr>
                    <tr><td><strong>1 hour</strong></td><td><strong>60 minutes</strong></td><td><strong>3,600 s</strong></td></tr>
                    <tr><td>1 day</td><td>24 hours = 1,440 minutes</td><td>86,400 s</td></tr>
                    <tr><td>1 week</td><td>7 days = 10,080 minutes</td><td>604,800 s</td></tr>
                    <tr><td>1 month (avg)</td><td>30.437 days ≈ 43,829 min</td><td>~2,629,746 s</td></tr>
                    <tr><td>1 year</td><td>365.25 days ≈ 525,960 min</td><td>~31,557,600 s</td></tr>
                </tbody>
            </table>

            <h3>Decimal Hours for Payroll & Timesheets</h3>
            <p>Many US employers require <strong>decimal hours</strong> on timesheets instead of hours:minutes. Here's how common clock times convert:</p>
            <table>
                <thead><tr><th>Clock Time Worked</th><th>Minutes</th><th>Decimal Hours</th></tr></thead>
                <tbody>
                    <tr><td>7:30 AM – 12:00 PM</td><td>270 min</td><td>4.50 hrs</td></tr>
                    <tr><td>8:00 AM – 5:00 PM (w/ 1hr lunch)</td><td>480 min</td><td>8.00 hrs</td></tr>
                    <tr><td>9:00 AM – 5:30 PM (w/ 30min lunch)</td><td>480 min</td><td>8.00 hrs</td></tr>
                    <tr><td>6:45 AM – 3:15 PM (w/ 30min lunch)</td><td>480 min</td><td>8.00 hrs</td></tr>
                    <tr><td>Part-time: 4h 15m</td><td>255 min</td><td>4.25 hrs</td></tr>
                    <tr><td>Overtime: 10h 45m</td><td>645 min</td><td>10.75 hrs</td></tr>
                </tbody>
            </table>
            <p><strong>Quick trick:</strong> Divide the minutes past the hour by 60. So 7 hours 45 minutes = 7 + (45÷60) = 7.75 decimal hours.</p>

            <h3>Common Time Durations in Daily Life</h3>
            <table>
                <thead><tr><th>Activity</th><th>Typical Duration</th><th>In Hours</th></tr></thead>
                <tbody>
                    <tr><td>TV commercial break</td><td>2–4 minutes</td><td>0.03–0.07 hr</td></tr>
                    <tr><td>Average shower</td><td>8 minutes</td><td>0.13 hr</td></tr>
                    <tr><td>Coffee break</td><td>15 minutes</td><td>0.25 hr</td></tr>
                    <tr><td>Lunch break</td><td>30–60 minutes</td><td>0.5–1.0 hr</td></tr>
                    <tr><td>Movie</td><td>90–150 minutes</td><td>1.5–2.5 hr</td></tr>
                    <tr><td>Cross-country flight (US)</td><td>300–360 minutes</td><td>5–6 hr</td></tr>
                    <tr><td>Full work day</td><td>480 minutes</td><td>8 hr</td></tr>
                    <tr><td>Sleep (recommended)</td><td>420–540 minutes</td><td>7–9 hr</td></tr>
                </tbody>
            </table>

            <h3>What Is a Minute?</h3>
            <p>A <strong>minute</strong> (min) is a unit of time equal to 60 seconds or 1/60 of an hour. The word comes from the Latin "pars minuta prima" meaning "first small part." Minutes became widely used after the invention of mechanical clocks in the 14th century. Today, minutes are the most common unit for expressing durations under an hour.</p>

            <h3>What Is an Hour?</h3>
            <p>An <strong>hour</strong> (hr) is a unit of time equal to 60 minutes or 3,600 seconds. The concept of dividing the day into 24 hours dates back to ancient Egypt. Hours are the primary unit for expressing work schedules, travel times, and daily planning in the United States and worldwide.</p>
        `,
        faq: [
            { question: "How many hours is 90 minutes?", answer: "1.5 hours, or 1 hour and 30 minutes. To calculate: 90 ÷ 60 = 1.5 hours. The whole number (1) is the hours, and the decimal (0.5 × 60) = 30 remaining minutes." },
            { question: "How do I convert minutes to decimal hours?", answer: "Divide the minutes by 60. Examples: 15 min = 0.25 hr, 30 min = 0.50 hr, 45 min = 0.75 hr, 90 min = 1.50 hr. For payroll/timesheets, this decimal format is usually required." },
            { question: "How many minutes are in a day?", answer: "Exactly 1,440 minutes. A day has 24 hours × 60 minutes = 1,440 minutes. That's also 86,400 seconds." },
            { question: "How do I convert minutes to hours and minutes?", answer: "Step 1: Divide by 60 to get decimal hours (e.g., 135 ÷ 60 = 2.25). Step 2: Take the whole number as hours (2). Step 3: Multiply the decimal by 60 for remaining minutes (0.25 × 60 = 15). Result: 2 hours 15 minutes." },
            { question: "What is 480 minutes in hours?", answer: "Exactly 8 hours. 480 ÷ 60 = 8.0 hours. This is the standard US full-time work day (8 hours = 480 minutes), not counting lunch breaks." },
            { question: "How do I enter time on a timesheet in decimal format?", answer: "Convert the minutes portion to a decimal by dividing by 60. Example: If you worked 7 hours 45 minutes, enter 7.75 (because 45 ÷ 60 = 0.75). Common conversions: :15 = .25, :30 = .50, :45 = .75." },
        ],
    },
    "inch-to-foot-converter": {
        subtitle: "Convert inches to feet and inches (in to ft). See results in decimal feet, feet & inches format, yards, and centimeters. Includes a quick reference table.",
        contentHTML: `
            <h3>How to Convert Inches to Feet</h3>
            <p>Since there are <strong>12 inches in 1 foot</strong>, divide the total inches by 12:</p>
            <div class="explanation__highlight">
                <strong>feet = inches ÷ 12</strong><br/><br/>
                <strong>Step 1:</strong> Divide to get decimal feet<br/>
                32 ÷ 12 = <strong>2.6667 feet</strong><br/><br/>
                <strong>Step 2:</strong> Convert to feet & inches<br/>
                Whole feet = 2<br/>
                Remaining inches = (2.6667 − 2) × 12 = 8<br/>
                = <strong>2 feet 8 inches</strong> (2' 8")
            </div>

            <h3>Inches to Feet — Conversion Table</h3>
            <table>
                <thead><tr><th>Inches</th><th>Feet & In</th><th>Decimal Ft</th><th>Yards</th><th>Centimeters</th></tr></thead>
                <tbody>
                    <tr><td>1"</td><td>0' 1"</td><td>0.083 ft</td><td>0.028 yd</td><td>2.54 cm</td></tr>
                    <tr><td>6"</td><td>0' 6"</td><td>0.50 ft</td><td>0.167 yd</td><td>15.24 cm</td></tr>
                    <tr><td>12"</td><td>1' 0"</td><td>1.00 ft</td><td>0.333 yd</td><td>30.48 cm</td></tr>
                    <tr><td>18"</td><td>1' 6"</td><td>1.50 ft</td><td>0.500 yd</td><td>45.72 cm</td></tr>
                    <tr><td>24"</td><td>2' 0"</td><td>2.00 ft</td><td>0.667 yd</td><td>60.96 cm</td></tr>
                    <tr><td>30"</td><td>2' 6"</td><td>2.50 ft</td><td>0.833 yd</td><td>76.20 cm</td></tr>
                    <tr><td>36"</td><td>3' 0"</td><td>3.00 ft</td><td>1.000 yd</td><td>91.44 cm</td></tr>
                    <tr><td>48"</td><td>4' 0"</td><td>4.00 ft</td><td>1.333 yd</td><td>121.92 cm</td></tr>
                    <tr><td>60"</td><td>5' 0"</td><td>5.00 ft</td><td>1.667 yd</td><td>152.40 cm</td></tr>
                    <tr><td>72"</td><td>6' 0"</td><td>6.00 ft</td><td>2.000 yd</td><td>182.88 cm</td></tr>
                    <tr><td>84"</td><td>7' 0"</td><td>7.00 ft</td><td>2.333 yd</td><td>213.36 cm</td></tr>
                    <tr><td>96"</td><td>8' 0"</td><td>8.00 ft</td><td>2.667 yd</td><td>243.84 cm</td></tr>
                    <tr><td>120"</td><td>10' 0"</td><td>10.00 ft</td><td>3.333 yd</td><td>304.80 cm</td></tr>
                </tbody>
            </table>

            <h3>US Imperial Length Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>Equivalent</th><th>In Inches</th></tr></thead>
                <tbody>
                    <tr><td><strong>1 inch (in)</strong></td><td>2.54 centimeters</td><td>1 in</td></tr>
                    <tr><td><strong>1 foot (ft)</strong></td><td>12 inches</td><td>12 in</td></tr>
                    <tr><td><strong>1 yard (yd)</strong></td><td>3 feet = 36 inches</td><td>36 in</td></tr>
                    <tr><td><strong>1 mile (mi)</strong></td><td>5,280 feet = 1,760 yards</td><td>63,360 in</td></tr>
                </tbody>
            </table>
            <p>The US customary system is one of only three countries (along with Liberia and Myanmar) that hasn't officially adopted the metric system for everyday use.</p>

            <h3>Common Objects — Inches vs. Feet</h3>
            <table>
                <thead><tr><th>Object</th><th>Inches</th><th>Feet & Inches</th></tr></thead>
                <tbody>
                    <tr><td>Credit card (width)</td><td>3.37"</td><td>0' 3.4"</td></tr>
                    <tr><td>Standard ruler</td><td>12"</td><td>1' 0"</td></tr>
                    <tr><td>Laptop screen (15")</td><td>15"</td><td>1' 3"</td></tr>
                    <tr><td>Baseball bat</td><td>34"</td><td>2' 10"</td></tr>
                    <tr><td>Standard door (height)</td><td>80"</td><td>6' 8"</td></tr>
                    <tr><td>King-size bed (length)</td><td>80"</td><td>6' 8"</td></tr>
                    <tr><td>Ceiling height (standard)</td><td>96"</td><td>8' 0"</td></tr>
                    <tr><td>Garage door (height)</td><td>84"</td><td>7' 0"</td></tr>
                </tbody>
            </table>

            <h3>Height Chart — Inches to Feet & Inches</h3>
            <p>Human heights in the US are expressed in feet and inches:</p>
            <table>
                <thead><tr><th>Height (inches)</th><th>Feet & Inches</th><th>Centimeters</th></tr></thead>
                <tbody>
                    <tr><td>58"</td><td>4' 10"</td><td>147.3 cm</td></tr>
                    <tr><td>60"</td><td>5' 0"</td><td>152.4 cm</td></tr>
                    <tr><td>62"</td><td>5' 2"</td><td>157.5 cm</td></tr>
                    <tr><td>64"</td><td>5' 4" (avg US woman)</td><td>162.6 cm</td></tr>
                    <tr><td>66"</td><td>5' 6"</td><td>167.6 cm</td></tr>
                    <tr><td>68"</td><td>5' 8"</td><td>172.7 cm</td></tr>
                    <tr><td>69"</td><td>5' 9" (avg US man)</td><td>175.3 cm</td></tr>
                    <tr><td>72"</td><td>6' 0"</td><td>182.9 cm</td></tr>
                    <tr><td>74"</td><td>6' 2"</td><td>188.0 cm</td></tr>
                    <tr><td>78"</td><td>6' 6"</td><td>198.1 cm</td></tr>
                </tbody>
            </table>

            <h3>What Is an Inch?</h3>
            <p>An <strong>inch</strong> (in or ") is a US customary and imperial unit of length equal to exactly 2.54 centimeters or 1/12 of a foot. The inch is widely used in the United States for everyday measurements including screen sizes (TVs, phones), construction lumber dimensions, and personal heights on driver's licenses.</p>

            <h3>What Is a Foot?</h3>
            <p>A <strong>foot</strong> (ft or ') is a US customary and imperial unit of length equal to 12 inches, 1/3 of a yard, or 30.48 centimeters. In the US, feet are the primary unit for expressing room dimensions, building heights, elevation, and personal height. Real estate listings in America exclusively use square feet (sq ft) for property size.</p>
        `,
        faq: [
            { question: "How many feet is 36 inches?", answer: "Exactly 3 feet (1 yard). 36 ÷ 12 = 3.0 feet. This is also the length of a standard yardstick." },
            { question: "How do I convert inches to feet and inches?", answer: "Divide by 12. The whole number is feet, the remainder is inches. Example: 65 inches → 65 ÷ 12 = 5 remainder 5 → 5 feet 5 inches (5' 5\"). This is the format used for height in the US." },
            { question: "How tall is 72 inches in feet?", answer: "Exactly 6 feet (72 ÷ 12 = 6.0). This is a common height milestone — 6 feet = 182.88 cm = 1.83 meters." },
            { question: "What is 5'4\" in inches?", answer: "64 inches. Multiply feet by 12 and add inches: (5 × 12) + 4 = 64 inches. This is approximately the average height of an adult woman in the US (163 cm)." },
            { question: "How many inches in a foot?", answer: "Exactly 12 inches = 1 foot. This has been the standard since the International Yard and Pound Agreement of 1959, which defined 1 inch = exactly 2.54 centimeters." },
            { question: "How do I read decimal feet?", answer: "Decimal feet express the inches as a decimal fraction. For example, 5.5 feet = 5 feet 6 inches (0.5 × 12 = 6). Common decimals: .25 ft = 3\", .50 ft = 6\", .75 ft = 9\". Surveyors and engineers prefer decimal feet over feet-and-inches notation." },
        ],
    },
    "kiloohm-to-ohm-converter": {
        subtitle: "Convert kiloohms to ohms (kΩ to Ω) with Ohm's Law current calculation. See results in ohms, megaohms, milliohms, and milliamps at your chosen voltage.",
        contentHTML: `
            <h3>How to Convert Kiloohms to Ohms</h3>
            <p>The prefix "kilo" means 1,000, so <strong>1 kiloohm = 1,000 ohms</strong>. Simply multiply by 1,000:</p>
            <div class="explanation__highlight">
                <strong>ohms = kiloohms × 1,000</strong><br/><br/>
                Example: 4.7 kΩ = 4.7 × 1,000 = <strong>4,700 Ω</strong><br/><br/>
                Example: 0.47 kΩ = 0.47 × 1,000 = <strong>470 Ω</strong><br/><br/>
                Example: 100 kΩ = 100 × 1,000 = <strong>100,000 Ω</strong>
            </div>

            <h3>Ohm's Law — V = I × R</h3>
            <p>Ohm's Law is the fundamental relationship between voltage (V), current (I), and resistance (R):</p>
            <table>
                <thead><tr><th>Find</th><th>Formula</th><th>Example (4.7 kΩ, 5V)</th></tr></thead>
                <tbody>
                    <tr><td><strong>Voltage (V)</strong></td><td>V = I × R</td><td>V = 0.001064A × 4700Ω = 5V</td></tr>
                    <tr><td><strong>Current (I)</strong></td><td>I = V / R</td><td>I = 5V / 4700Ω = 1.064 mA</td></tr>
                    <tr><td><strong>Resistance (R)</strong></td><td>R = V / I</td><td>R = 5V / 0.001064A = 4700Ω</td></tr>
                </tbody>
            </table>
            <p>This calculator automatically shows the current at your chosen voltage using I = V/R.</p>

            <h3>Resistance Unit Prefixes</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>In Ohms</th><th>Example</th></tr></thead>
                <tbody>
                    <tr><td>Milliohm</td><td>mΩ</td><td>0.001 Ω</td><td>Wire resistance</td></tr>
                    <tr><td><strong>Ohm</strong></td><td><strong>Ω</strong></td><td><strong>1 Ω</strong></td><td><strong>Base unit</strong></td></tr>
                    <tr><td><strong>Kiloohm</strong></td><td><strong>kΩ</strong></td><td><strong>1,000 Ω</strong></td><td><strong>Most resistors</strong></td></tr>
                    <tr><td>Megaohm</td><td>MΩ</td><td>1,000,000 Ω</td><td>Insulation testing</td></tr>
                    <tr><td>Gigaohm</td><td>GΩ</td><td>1,000,000,000 Ω</td><td>Air insulation</td></tr>
                </tbody>
            </table>

            <h3>Common Resistor Values (E24 Series)</h3>
            <p>Standard resistors come in preferred values. Here are the most common kΩ resistors used in electronics:</p>
            <table>
                <thead><tr><th>kΩ Value</th><th>Ohms</th><th>Typical Use</th></tr></thead>
                <tbody>
                    <tr><td>0.1 kΩ</td><td>100 Ω</td><td>Current sensing, LED with 3.3V</td></tr>
                    <tr><td>0.22 kΩ</td><td>220 Ω</td><td>Standard LED resistor (5V)</td></tr>
                    <tr><td>0.47 kΩ</td><td>470 Ω</td><td>Signal line termination</td></tr>
                    <tr><td>1 kΩ</td><td>1,000 Ω</td><td>General purpose, voltage dividers</td></tr>
                    <tr><td>2.2 kΩ</td><td>2,200 Ω</td><td>I²C bus pull-ups (3.3V)</td></tr>
                    <tr><td>4.7 kΩ</td><td>4,700 Ω</td><td>I²C bus pull-ups (5V), biasing</td></tr>
                    <tr><td>10 kΩ</td><td>10,000 Ω</td><td>Pull-up/pull-down, potentiometers</td></tr>
                    <tr><td>47 kΩ</td><td>47,000 Ω</td><td>Audio circuits, filters</td></tr>
                    <tr><td>100 kΩ</td><td>100,000 Ω</td><td>High-impedance inputs, biasing</td></tr>
                    <tr><td>470 kΩ</td><td>470,000 Ω</td><td>Timing circuits, high-Z sensing</td></tr>
                    <tr><td>1,000 kΩ</td><td>1,000,000 Ω (1 MΩ)</td><td>ESD protection, input impedance</td></tr>
                </tbody>
            </table>

            <h3>What Is a Kiloohm?</h3>
            <p>A <strong>kiloohm</strong> (kΩ) is a unit of electrical resistance equal to 1,000 ohms. It is the most commonly used unit for expressing resistor values in electronics. The majority of through-hole and surface-mount resistors used in hobby projects, Arduino circuits, and consumer electronics fall in the 0.1kΩ–100kΩ range.</p>

            <h3>What Is an Ohm?</h3>
            <p>An <strong>ohm</strong> (Ω) is the SI unit of electrical resistance, named after German physicist Georg Simon Ohm. One ohm is defined as the resistance that allows one ampere of current to flow when one volt is applied. The ohm is used in every branch of electrical engineering, from household wiring to semiconductor design.</p>
        `,
        faq: [
            { question: "How many ohms in 1 kiloohm?", answer: "Exactly 1,000 ohms. The prefix 'kilo' means 1,000 in the metric system, so 1 kΩ = 1,000 Ω. To convert, multiply the kΩ value by 1,000." },
            { question: "What is a 4.7 kΩ resistor in ohms?", answer: "4,700 ohms. 4.7 × 1,000 = 4,700 Ω. This is one of the most commonly used resistor values — it's the standard pull-up resistor for I²C communication at 5V." },
            { question: "What is Ohm's Law?", answer: "Ohm's Law states that V = I × R, where V is voltage (volts), I is current (amps), and R is resistance (ohms). From this: I = V/R (find current) and R = V/I (find resistance). It's the foundational equation of electrical engineering." },
            { question: "How much current flows through a 10 kΩ resistor at 5V?", answer: "0.5 mA (milliamps). Using Ohm's Law: I = V/R = 5V ÷ 10,000Ω = 0.0005A = 0.5 mA. This is a very small current, typical for signal-level circuits." },
            { question: "What is the difference between kΩ and MΩ?", answer: "1 MΩ (megaohm) = 1,000 kΩ = 1,000,000 Ω. Kiloohms are used for most common resistors (0.1–100 kΩ). Megaohms are used for high-impedance applications like insulation testing, ESD protection, and sensitive analog inputs." },
            { question: "Why do resistors come in odd values like 4.7kΩ and 2.2kΩ?", answer: "Resistors follow the E-series (E12, E24, E96) — logarithmically spaced values that ensure any needed resistance can be approximated within a percentage tolerance. The E24 series has 24 values per decade: 1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1." },
        ],
    },
    "gal-to-lb-converter": {
        subtitle: "Convert US gallons to pounds (gal to lb) for any substance. Select from 20 common liquids or enter a custom density. See results in pounds, ounces, and kilograms.",
        contentHTML: `
            <h3>How to Convert Gallons to Pounds</h3>
            <p>Gallons measure <strong>volume</strong> while pounds measure <strong>weight</strong>. To convert, multiply by 8.3454 (the weight of 1 gallon of water in pounds) and the substance's density:</p>
            <div class="explanation__highlight">
                <strong>pounds = gallons × 8.3454 × density (g/mL)</strong><br/><br/>
                Example: 1 gallon of water (density 1.00 g/mL)<br/>
                = 1 × 8.3454 × 1.00 = <strong>8.35 lbs</strong><br/><br/>
                Example: 1 gallon of milk (density 1.03 g/mL)<br/>
                = 1 × 8.3454 × 1.03 = <strong>8.60 lbs</strong><br/><br/>
                Example: 5 gallons of gasoline (density 0.74 g/mL)<br/>
                = 5 × 8.3454 × 0.74 = <strong>30.88 lbs</strong>
            </div>

            <h3>How Much Does a Gallon Weigh? — By Substance</h3>
            <table>
                <thead><tr><th>Liquid</th><th>Density</th><th>1 Gallon =</th><th>5 Gallons =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00 g/mL</td><td>8.35 lbs</td><td>41.73 lbs</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03 g/mL</td><td>8.60 lbs</td><td>42.98 lbs</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.43 g/mL</td><td>11.93 lbs</td><td>59.67 lbs</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.91 g/mL</td><td>7.59 lbs</td><td>37.97 lbs</td></tr>
                    <tr><td><strong>Vegetable Oil</strong></td><td>0.92 g/mL</td><td>7.68 lbs</td><td>38.39 lbs</td></tr>
                    <tr><td><strong>Gasoline</strong></td><td>0.74 g/mL</td><td>6.18 lbs</td><td>30.88 lbs</td></tr>
                    <tr><td><strong>Diesel Fuel</strong></td><td>0.85 g/mL</td><td>7.09 lbs</td><td>35.47 lbs</td></tr>
                    <tr><td><strong>Maple Syrup</strong></td><td>1.33 g/mL</td><td>11.10 lbs</td><td>55.50 lbs</td></tr>
                    <tr><td><strong>Heavy Cream</strong></td><td>1.01 g/mL</td><td>8.43 lbs</td><td>42.14 lbs</td></tr>
                    <tr><td><strong>Rubbing Alcohol</strong></td><td>0.79 g/mL</td><td>6.59 lbs</td><td>32.96 lbs</td></tr>
                </tbody>
            </table>

            <h3>Common US Containers — How Much Do They Weigh?</h3>
            <table>
                <thead><tr><th>Container</th><th>Volume</th><th>Water Weight</th><th>Actual Liquid</th></tr></thead>
                <tbody>
                    <tr><td>Milk jug</td><td>1 gallon</td><td>8.35 lbs</td><td>8.60 lbs (milk)</td></tr>
                    <tr><td>Gas can (small)</td><td>2 gallons</td><td>16.69 lbs</td><td>12.35 lbs (gas)</td></tr>
                    <tr><td>Paint bucket</td><td>5 gallons</td><td>41.73 lbs</td><td>~50 lbs (latex paint)</td></tr>
                    <tr><td>Water cooler bottle</td><td>5 gallons</td><td>41.73 lbs</td><td>41.73 lbs (water)</td></tr>
                    <tr><td>Gas can (large)</td><td>5 gallons</td><td>41.73 lbs</td><td>30.88 lbs (gas)</td></tr>
                    <tr><td>Trash can (typical)</td><td>32 gallons</td><td>267.1 lbs</td><td>—</td></tr>
                    <tr><td>Bathtub (full)</td><td>~60 gallons</td><td>500.7 lbs</td><td>—</td></tr>
                    <tr><td>Water heater (standard)</td><td>40–50 gallons</td><td>334–418 lbs</td><td>—</td></tr>
                </tbody>
            </table>

            <h3>US Volume Unit Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>Equivalent</th><th>Water Weight</th></tr></thead>
                <tbody>
                    <tr><td>1 fluid ounce</td><td>2 tablespoons</td><td>0.065 lbs</td></tr>
                    <tr><td>1 cup</td><td>8 fluid ounces</td><td>0.522 lbs</td></tr>
                    <tr><td>1 pint</td><td>2 cups = 16 fl oz</td><td>1.044 lbs</td></tr>
                    <tr><td>1 quart</td><td>2 pints = 32 fl oz</td><td>2.087 lbs</td></tr>
                    <tr><td><strong>1 gallon</strong></td><td><strong>4 quarts = 128 fl oz</strong></td><td><strong>8.345 lbs</strong></td></tr>
                </tbody>
            </table>

            <h3>"A Pint's a Pound the World Around"</h3>
            <p>This classic American saying is approximately true: 1 US pint of water weighs about 1.044 pounds — close enough to 1 pound for quick kitchen estimates. However, it only works for water-like liquids. A pint of honey weighs about 1.49 lbs, while a pint of oil weighs only ~0.95 lbs.</p>

            <h3>US Gallon vs. Imperial Gallon</h3>
            <table>
                <thead><tr><th>Gallon Type</th><th>Volume</th><th>Water Weight</th><th>Where Used</th></tr></thead>
                <tbody>
                    <tr><td><strong>US Gallon</strong></td><td>3.785 liters (128 fl oz)</td><td>8.345 lbs</td><td>United States</td></tr>
                    <tr><td><strong>Imperial Gallon</strong></td><td>4.546 liters (160 imp fl oz)</td><td>10.022 lbs</td><td>UK (historical)</td></tr>
                </tbody>
            </table>
            <p>An Imperial gallon is 20% larger than a US gallon. This converter uses the <strong>US gallon</strong> (3.785 liters).</p>

            <h3>What Is a Gallon?</h3>
            <p>A <strong>US gallon</strong> (gal) is a unit of volume equal to 128 US fluid ounces, 4 quarts, 8 pints, or 3.785 liters. It is the standard unit for measuring fuel, milk, paint, and large liquid volumes in the United States. Gas pumps, milk jugs, and paint buckets are all sized in gallons.</p>

            <h3>What Is a Pound?</h3>
            <p>A <strong>pound</strong> (lb) is a US customary and imperial unit of weight equal to 16 ounces or approximately 453.592 grams. It is the primary unit of weight used in the United States for groceries, shipping, body weight, and everyday commerce. The abbreviation "lb" comes from the Latin "libra."</p>
        `,
        faq: [
            { question: "How much does a gallon of water weigh?", answer: "A US gallon of water weighs approximately 8.345 pounds (8 lbs 5.5 oz) at room temperature. This is one of the most commonly searched conversions in the US. For quick math: 8 gallons of water ≈ 67 pounds." },
            { question: "How much does a gallon of milk weigh?", answer: "About 8.6 pounds. Milk is slightly denser than water (1.03 g/mL vs 1.00 g/mL) because of dissolved sugars, proteins, and fat. So a gallon of milk weighs about 0.25 lbs more than a gallon of water." },
            { question: "How much does a gallon of gasoline weigh?", answer: "About 6.18 pounds. Gasoline has a density of approximately 0.74 g/mL, making it significantly lighter than water. This is why gasoline floats on water. A full 15-gallon gas tank weighs about 93 lbs of fuel." },
            { question: "How much does a 5-gallon bucket of water weigh?", answer: "About 41.7 pounds (just the water). Add ~2 lbs for the bucket itself, so roughly 44 pounds total. This is why OSHA guidelines recommend caution when lifting 5-gallon containers." },
            { question: "Is a US gallon the same as an Imperial gallon?", answer: "No. A US gallon = 3.785 liters (8.345 lbs of water), while an Imperial gallon = 4.546 liters (10.022 lbs of water). The Imperial gallon is 20% larger. If a UK recipe calls for 'a gallon,' it means the Imperial gallon." },
            { question: "Does a pint weigh a pound?", answer: "Almost! The saying 'a pint's a pound the world around' is approximately true for water: 1 US pint of water weighs ~1.044 lbs. For denser liquids like honey (1.49 lbs/pint) or lighter ones like oil (0.95 lbs/pint), the saying doesn't hold." },
        ],
    },
    "sec-to-min-converter": {
        subtitle: "Convert seconds to minutes and seconds (s to min). See results in decimal minutes, MM:SS format, hours, and milliseconds. Includes a quick reference table.",
        contentHTML: `
            <h3>How to Convert Seconds to Minutes</h3>
            <p>Since there are <strong>60 seconds in 1 minute</strong>, divide the number of seconds by 60:</p>
            <div class="explanation__highlight">
                <strong>minutes = seconds ÷ 60</strong><br/><br/>
                <strong>Step 1:</strong> Divide to get decimal minutes<br/>
                90 ÷ 60 = <strong>1.5 minutes</strong><br/><br/>
                <strong>Step 2:</strong> Convert to minutes & seconds<br/>
                Whole minutes = 1<br/>
                Remaining seconds = (1.5 − 1) × 60 = 30<br/>
                = <strong>1 minute 30 seconds</strong> (1:30)
            </div>

            <h3>Seconds to Minutes — Conversion Table</h3>
            <table>
                <thead><tr><th>Seconds</th><th>Min & Sec</th><th>Decimal Min</th><th>Hours</th></tr></thead>
                <tbody>
                    <tr><td>1 s</td><td>0m 1s</td><td>0.0167 min</td><td>0.000278 hr</td></tr>
                    <tr><td>5 s</td><td>0m 5s</td><td>0.0833 min</td><td>0.001389 hr</td></tr>
                    <tr><td>10 s</td><td>0m 10s</td><td>0.1667 min</td><td>0.002778 hr</td></tr>
                    <tr><td>15 s</td><td>0m 15s</td><td>0.25 min</td><td>0.004167 hr</td></tr>
                    <tr><td>30 s</td><td>0m 30s</td><td>0.50 min</td><td>0.008333 hr</td></tr>
                    <tr><td>45 s</td><td>0m 45s</td><td>0.75 min</td><td>0.012500 hr</td></tr>
                    <tr><td>60 s</td><td>1m 0s</td><td>1.00 min</td><td>0.016667 hr</td></tr>
                    <tr><td>90 s</td><td>1m 30s</td><td>1.50 min</td><td>0.025000 hr</td></tr>
                    <tr><td>120 s</td><td>2m 0s</td><td>2.00 min</td><td>0.033333 hr</td></tr>
                    <tr><td>180 s</td><td>3m 0s</td><td>3.00 min</td><td>0.050000 hr</td></tr>
                    <tr><td>300 s</td><td>5m 0s</td><td>5.00 min</td><td>0.083333 hr</td></tr>
                    <tr><td>600 s</td><td>10m 0s</td><td>10.00 min</td><td>0.166667 hr</td></tr>
                    <tr><td>3,600 s</td><td>60m 0s</td><td>60.00 min</td><td>1.000000 hr</td></tr>
                    <tr><td>86,400 s</td><td>1,440m 0s</td><td>1,440.00 min</td><td>24.000000 hr</td></tr>
                </tbody>
            </table>

            <h3>Time Sub-Units — Smaller Than a Second</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>In Seconds</th><th>Use Case</th></tr></thead>
                <tbody>
                    <tr><td>Nanosecond</td><td>ns</td><td>0.000000001 s</td><td>CPU clock cycles, GPS timing</td></tr>
                    <tr><td>Microsecond</td><td>μs</td><td>0.000001 s</td><td>Camera shutter speed, signals</td></tr>
                    <tr><td>Millisecond</td><td>ms</td><td>0.001 s</td><td>Web page load time, ping</td></tr>
                    <tr><td><strong>Second</strong></td><td><strong>s</strong></td><td><strong>1 s</strong></td><td><strong>Base SI unit of time</strong></td></tr>
                    <tr><td><strong>Minute</strong></td><td><strong>min</strong></td><td><strong>60 s</strong></td><td><strong>Everyday timing</strong></td></tr>
                </tbody>
            </table>

            <h3>How Fast Are Everyday Events?</h3>
            <table>
                <thead><tr><th>Event</th><th>Seconds</th><th>Minutes</th></tr></thead>
                <tbody>
                    <tr><td>Eye blink</td><td>0.3–0.4 s</td><td>~0.006 min</td></tr>
                    <tr><td>Human reaction time</td><td>0.2–0.3 s</td><td>~0.004 min</td></tr>
                    <tr><td>Microwave beep interval</td><td>1 s</td><td>0.017 min</td></tr>
                    <tr><td>Traffic light yellow</td><td>3–6 s</td><td>0.05–0.10 min</td></tr>
                    <tr><td>Elevator ride (10 floors)</td><td>~20 s</td><td>0.33 min</td></tr>
                    <tr><td>TV commercial</td><td>15–60 s</td><td>0.25–1.0 min</td></tr>
                    <tr><td>Brewing espresso shot</td><td>25–30 s</td><td>0.42–0.50 min</td></tr>
                    <tr><td>Boiling a 3-min egg</td><td>180 s</td><td>3.00 min</td></tr>
                </tbody>
            </table>

            <h3>Sports & Media Timing</h3>
            <table>
                <thead><tr><th>Context</th><th>Duration</th><th>In Seconds</th></tr></thead>
                <tbody>
                    <tr><td>100m sprint (world record)</td><td>9.58 s</td><td>0.16 min</td></tr>
                    <tr><td>NBA shot clock</td><td>24 s</td><td>0.40 min</td></tr>
                    <tr><td>NFL play clock</td><td>40 s</td><td>0.67 min</td></tr>
                    <tr><td>TikTok video (short)</td><td>15–60 s</td><td>0.25–1.0 min</td></tr>
                    <tr><td>YouTube Shorts</td><td>≤60 s</td><td>≤1.0 min</td></tr>
                    <tr><td>Instagram Reel</td><td>≤90 s</td><td>≤1.5 min</td></tr>
                    <tr><td>Pop song (average)</td><td>~210 s</td><td>~3.5 min</td></tr>
                    <tr><td>NFL quarter</td><td>900 s</td><td>15 min</td></tr>
                </tbody>
            </table>

            <h3>What Is a Second?</h3>
            <p>A <strong>second</strong> (s) is the base SI unit of time. Since 1967, it has been defined as the duration of 9,192,631,770 periods of the radiation corresponding to the transition between two energy levels of the cesium-133 atom. In everyday life, a second is roughly the duration of a heartbeat at rest.</p>

            <h3>What Is a Minute?</h3>
            <p>A <strong>minute</strong> (min) is a unit of time equal to 60 seconds. The word comes from the Latin "pars minuta prima" meaning "first small part." Minutes are the standard unit for measuring short durations in everyday American life — cooking times, workout intervals, commute estimates, and meeting lengths.</p>
        `,
        faq: [
            { question: "How many minutes is 120 seconds?", answer: "Exactly 2 minutes. 120 ÷ 60 = 2.0 minutes. This is a common conversion — 120 seconds = 2 minutes with zero remaining seconds." },
            { question: "How do I convert seconds to minutes and seconds?", answer: "Divide by 60. The whole number is minutes; multiply the decimal by 60 for remaining seconds. Example: 200 seconds → 200 ÷ 60 = 3.3333 → 3 minutes and (0.3333 × 60) = 20 seconds → 3:20." },
            { question: "How many seconds are in a minute?", answer: "Exactly 60 seconds = 1 minute. This has been the standard since ancient Babylonian mathematics, which used a base-60 (sexagesimal) number system." },
            { question: "How many seconds are in an hour?", answer: "3,600 seconds. 1 hour = 60 minutes × 60 seconds = 3,600 seconds. In a full day: 24 × 3,600 = 86,400 seconds." },
            { question: "How many seconds is a 3-minute song?", answer: "180 seconds. 3 × 60 = 180 seconds. The average pop song is about 3.5 minutes (210 seconds), though songs have been getting shorter in the streaming era." },
            { question: "What are milliseconds?", answer: "A millisecond (ms) is 1/1,000 of a second (0.001 seconds). Common uses: web page load times (under 3,000ms is good), ping/latency in online gaming (under 50ms is excellent), and camera shutter speeds." },
        ],
    },
    "floz-to-ml-converter": {
        subtitle: "Convert US fluid ounces to milliliters (fl oz to mL). See results in milliliters, liters, cups, and tablespoons. Includes a quick reference table.",
        contentHTML: `
            <h3>How to Convert Fluid Ounces to Milliliters</h3>
            <p>Multiply the number of US fluid ounces by <strong>29.5735</strong>:</p>
            <div class="explanation__highlight">
                <strong>mL = fluid ounces × 29.5735</strong><br/><br/>
                Example: 8 fl oz (1 cup)<br/>
                = 8 × 29.5735 = <strong>236.6 mL</strong><br/><br/>
                Example: 16 fl oz (1 pint)<br/>
                = 16 × 29.5735 = <strong>473.2 mL</strong><br/><br/>
                Example: 2 fl oz (medicine dose)<br/>
                = 2 × 29.5735 = <strong>59.1 mL</strong>
            </div>

            <h3>Fluid Ounces to Milliliters — Conversion Table</h3>
            <table>
                <thead><tr><th>Fluid Ounces</th><th>Milliliters</th><th>Cups</th><th>Common Use</th></tr></thead>
                <tbody>
                    <tr><td>0.5 fl oz</td><td>14.8 mL</td><td>1/16 cup</td><td>1 tablespoon</td></tr>
                    <tr><td>1 fl oz</td><td>29.6 mL</td><td>1/8 cup</td><td>Shot glass, medicine dose</td></tr>
                    <tr><td>2 fl oz</td><td>59.1 mL</td><td>¼ cup</td><td>Double shot, cough syrup</td></tr>
                    <tr><td>4 fl oz</td><td>118.3 mL</td><td>½ cup</td><td>Small juice glass</td></tr>
                    <tr><td>6 fl oz</td><td>177.4 mL</td><td>¾ cup</td><td>Standard tea cup</td></tr>
                    <tr><td>8 fl oz</td><td>236.6 mL</td><td>1 cup</td><td>Standard measuring cup</td></tr>
                    <tr><td>12 fl oz</td><td>354.9 mL</td><td>1.5 cups</td><td>Soda can</td></tr>
                    <tr><td>16 fl oz</td><td>473.2 mL</td><td>2 cups (1 pint)</td><td>Water bottle</td></tr>
                    <tr><td>20 fl oz</td><td>591.5 mL</td><td>2.5 cups</td><td>Large water bottle</td></tr>
                    <tr><td>32 fl oz</td><td>946.4 mL</td><td>4 cups (1 quart)</td><td>Large Gatorade</td></tr>
                    <tr><td>64 fl oz</td><td>1,892.7 mL</td><td>8 cups (½ gal)</td><td>Half-gallon jug</td></tr>
                    <tr><td>128 fl oz</td><td>3,785.4 mL</td><td>16 cups (1 gal)</td><td>Gallon jug</td></tr>
                </tbody>
            </table>

            <h3>US Volume Unit Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>Fluid Ounces</th><th>Milliliters</th></tr></thead>
                <tbody>
                    <tr><td>1 teaspoon</td><td>⅙ fl oz</td><td>4.929 mL</td></tr>
                    <tr><td>1 tablespoon</td><td>½ fl oz</td><td>14.787 mL</td></tr>
                    <tr><td><strong>1 fluid ounce</strong></td><td><strong>1 fl oz</strong></td><td><strong>29.574 mL</strong></td></tr>
                    <tr><td>1 cup</td><td>8 fl oz</td><td>236.588 mL</td></tr>
                    <tr><td>1 pint</td><td>16 fl oz</td><td>473.176 mL</td></tr>
                    <tr><td>1 quart</td><td>32 fl oz</td><td>946.353 mL</td></tr>
                    <tr><td>1 gallon</td><td>128 fl oz</td><td>3,785.41 mL</td></tr>
                </tbody>
            </table>

            <h3>Common US Containers — Fluid Ounces & Milliliters</h3>
            <table>
                <thead><tr><th>Container</th><th>Fl Oz</th><th>mL</th></tr></thead>
                <tbody>
                    <tr><td>Medicine cup</td><td>1 fl oz</td><td>30 mL</td></tr>
                    <tr><td>Shot glass</td><td>1.5 fl oz</td><td>44 mL</td></tr>
                    <tr><td>Espresso (double)</td><td>2 fl oz</td><td>59 mL</td></tr>
                    <tr><td>Juice box</td><td>6.75 fl oz</td><td>200 mL</td></tr>
                    <tr><td>Soda can</td><td>12 fl oz</td><td>355 mL</td></tr>
                    <tr><td>Starbucks Grande</td><td>16 fl oz</td><td>473 mL</td></tr>
                    <tr><td>Standard water bottle</td><td>16.9 fl oz</td><td>500 mL</td></tr>
                    <tr><td>Starbucks Venti (iced)</td><td>24 fl oz</td><td>710 mL</td></tr>
                    <tr><td>Wine bottle</td><td>25.4 fl oz</td><td>750 mL</td></tr>
                    <tr><td>2-liter soda</td><td>67.6 fl oz</td><td>2,000 mL</td></tr>
                </tbody>
            </table>

            <h3>Fluid Ounce vs. Weight Ounce — Not the Same!</h3>
            <p>A <strong>fluid ounce</strong> (fl oz) measures <strong>volume</strong>, while an <strong>ounce</strong> (oz) measures <strong>weight</strong>. They are completely different units that happen to share the word "ounce":</p>
            <ul>
                <li>1 fl oz of water weighs approximately 1.043 oz — close but not exact</li>
                <li>1 fl oz of honey weighs about 1.5 oz (honey is denser than water)</li>
                <li>1 fl oz of oil weighs about 0.95 oz (oil is lighter than water)</li>
            </ul>
            <p><strong>In recipes:</strong> "2 oz of chocolate" means weight (use a scale), while "2 fl oz of vanilla" means volume (use a measuring cup).</p>

            <h3>US Fluid Ounce vs. Imperial Fluid Ounce</h3>
            <table>
                <thead><tr><th>Type</th><th>Volume</th><th>Where Used</th></tr></thead>
                <tbody>
                    <tr><td><strong>US Fluid Ounce</strong></td><td>29.5735 mL</td><td>United States</td></tr>
                    <tr><td><strong>Imperial Fluid Ounce</strong></td><td>28.4131 mL</td><td>UK (historical)</td></tr>
                </tbody>
            </table>
            <p>A US fluid ounce is about 4% larger than an Imperial fluid ounce. This converter uses the <strong>US fluid ounce</strong>.</p>

            <h3>What Is a Fluid Ounce?</h3>
            <p>A <strong>US fluid ounce</strong> (fl oz) is a unit of volume equal to 1/128 of a US gallon, 1/8 of a cup, or 29.5735 milliliters. It is the standard unit for measuring liquid volumes on nutrition labels, beverage containers, and medicine dosages in the United States.</p>

            <h3>What Is a Milliliter?</h3>
            <p>A <strong>milliliter</strong> (mL) is a metric unit of volume equal to 1/1,000 of a liter or 1 cubic centimeter (cc). It is used worldwide for measuring small liquid volumes, especially in medicine, science, and international cooking. Most US medicine doses are now labeled in both fl oz and mL.</p>
        `,
        faq: [
            { question: "How many mL is 8 fluid ounces?", answer: "236.6 mL. 8 fl oz × 29.5735 = 236.6 mL. This is exactly 1 US cup — the standard measuring cup used in American cooking." },
            { question: "How many mL in 1 fluid ounce?", answer: "29.5735 mL. For quick estimates, round to 30 mL — this is what medicine cups use. The 30 mL = 1 fl oz approximation is accurate to within 1.4%." },
            { question: "How many fluid ounces is a 500 mL water bottle?", answer: "About 16.9 fl oz. 500 ÷ 29.5735 = 16.907 fl oz. This is the standard water bottle size sold in the US, often labeled as '16.9 fl oz (500 mL)'." },
            { question: "Is a fluid ounce the same as an ounce?", answer: "No! A fluid ounce (fl oz) measures volume, while a regular ounce (oz) measures weight. 1 fl oz of water weighs approximately 1.043 oz. For denser liquids like honey, the weight difference is even greater." },
            { question: "How many fluid ounces in a soda can?", answer: "12 fl oz, which equals 354.9 mL or about 355 mL. This has been the standard US soda can size since the 1960s." },
            { question: "How do I convert a recipe from fluid ounces to mL?", answer: "Multiply each fl oz measurement by 29.5735 (or round to 30 for simplicity). Key equivalents to memorize: 1 fl oz ≈ 30 mL, 8 fl oz (1 cup) ≈ 237 mL, 16 fl oz (1 pint) ≈ 473 mL." },
        ],
    },
    "sqm-to-sqft-converter": {
        subtitle: "Convert square meters to square feet (m² to ft²). See results in square feet, acres, square yards, and square inches. Includes a quick reference table with room sizes.",
        contentHTML: `
            <h3>How to Convert Square Meters to Square Feet</h3>
            <p>Multiply the area in square meters by <strong>10.7639</strong>:</p>
            <div class="explanation__highlight">
                <strong>sq ft = sq m × 10.7639</strong><br/><br/>
                Example: 100 m² apartment<br/>
                = 100 × 10.7639 = <strong>1,076 sq ft</strong><br/><br/>
                Example: 200 m² house<br/>
                = 200 × 10.7639 = <strong>2,153 sq ft</strong><br/><br/>
                Example: 4,047 m² (1 acre)<br/>
                = 4,047 × 10.7639 = <strong>43,560 sq ft</strong>
            </div>

            <h3>Square Meters to Square Feet — Conversion Table</h3>
            <table>
                <thead><tr><th>m²</th><th>ft²</th><th>Acres</th><th>What It Looks Like</th></tr></thead>
                <tbody>
                    <tr><td>1 m²</td><td>10.76 ft²</td><td>0.000247 ac</td><td>Small desk area</td></tr>
                    <tr><td>10 m²</td><td>107.6 ft²</td><td>0.00247 ac</td><td>Small bedroom</td></tr>
                    <tr><td>20 m²</td><td>215.3 ft²</td><td>0.00494 ac</td><td>Studio apartment</td></tr>
                    <tr><td>50 m²</td><td>538.2 ft²</td><td>0.01236 ac</td><td>1-bedroom apartment</td></tr>
                    <tr><td>93 m²</td><td>1,001 ft²</td><td>0.02299 ac</td><td>≈ 1,000 sq ft (benchmark)</td></tr>
                    <tr><td>100 m²</td><td>1,076 ft²</td><td>0.02471 ac</td><td>Small house / large apt</td></tr>
                    <tr><td>150 m²</td><td>1,615 ft²</td><td>0.03707 ac</td><td>Average US house</td></tr>
                    <tr><td>200 m²</td><td>2,153 ft²</td><td>0.04942 ac</td><td>Above-average house</td></tr>
                    <tr><td>300 m²</td><td>3,229 ft²</td><td>0.07413 ac</td><td>Large US house</td></tr>
                    <tr><td>500 m²</td><td>5,382 ft²</td><td>0.12355 ac</td><td>McMansion / luxury home</td></tr>
                    <tr><td>1,000 m²</td><td>10,764 ft²</td><td>0.24711 ac</td><td>Commercial space</td></tr>
                    <tr><td>4,047 m²</td><td>43,560 ft²</td><td>1.0000 ac</td><td>Exactly 1 acre</td></tr>
                </tbody>
            </table>

            <h3>US Area Unit Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>Equivalent</th><th>In Square Feet</th></tr></thead>
                <tbody>
                    <tr><td>1 square inch (in²)</td><td>6.452 cm²</td><td>0.00694 ft²</td></tr>
                    <tr><td><strong>1 square foot (ft²)</strong></td><td><strong>0.0929 m²</strong></td><td><strong>1 ft²</strong></td></tr>
                    <tr><td>1 square yard (yd²)</td><td>0.8361 m²</td><td>9 ft²</td></tr>
                    <tr><td>1 acre</td><td>4,047 m²</td><td>43,560 ft²</td></tr>
                    <tr><td>1 square mile (mi²)</td><td>2.59 km²</td><td>27,878,400 ft²</td></tr>
                </tbody>
            </table>

            <h3>Average US Home Sizes</h3>
            <p>The median US single-family home is approximately <strong>2,014 sq ft</strong> (187 m²) as of 2023:</p>
            <table>
                <thead><tr><th>Home Type</th><th>Avg. Size (ft²)</th><th>In m²</th></tr></thead>
                <tbody>
                    <tr><td>Studio apartment</td><td>400–600 ft²</td><td>37–56 m²</td></tr>
                    <tr><td>1-bedroom apartment</td><td>600–800 ft²</td><td>56–74 m²</td></tr>
                    <tr><td>2-bedroom apartment</td><td>900–1,100 ft²</td><td>84–102 m²</td></tr>
                    <tr><td>Small house</td><td>1,000–1,400 ft²</td><td>93–130 m²</td></tr>
                    <tr><td>Average house</td><td>1,500–2,000 ft²</td><td>139–186 m²</td></tr>
                    <tr><td>Large house</td><td>2,500–3,500 ft²</td><td>232–325 m²</td></tr>
                    <tr><td>McMansion</td><td>4,000–6,000 ft²</td><td>372–557 m²</td></tr>
                </tbody>
            </table>

            <h3>US Real Estate — Price Per Square Foot by City</h3>
            <table>
                <thead><tr><th>City</th><th>Avg. Price/ft²</th><th>Avg. Price/m²</th></tr></thead>
                <tbody>
                    <tr><td>New York City</td><td>~$750/ft²</td><td>~$8,073/m²</td></tr>
                    <tr><td>San Francisco</td><td>~$700/ft²</td><td>~$7,535/m²</td></tr>
                    <tr><td>Los Angeles</td><td>~$500/ft²</td><td>~$5,382/m²</td></tr>
                    <tr><td>Miami</td><td>~$400/ft²</td><td>~$4,306/m²</td></tr>
                    <tr><td>Chicago</td><td>~$250/ft²</td><td>~$2,691/m²</td></tr>
                    <tr><td>Austin</td><td>~$300/ft²</td><td>~$3,229/m²</td></tr>
                    <tr><td>Houston</td><td>~$175/ft²</td><td>~$1,884/m²</td></tr>
                    <tr><td>National average</td><td>~$225/ft²</td><td>~$2,422/m²</td></tr>
                </tbody>
            </table>
            <p>US real estate listings use <strong>square feet exclusively</strong>. International listings (Europe, Asia) use square meters, making this conversion essential for Americans buying property overseas.</p>

            <h3>What Is a Square Meter?</h3>
            <p>A <strong>square meter</strong> (m²) is the SI unit of area equal to a square with sides of 1 meter (3.281 feet). It is the standard unit for property size, floor area, and land measurement in every country except the United States, Myanmar, and Liberia.</p>

            <h3>What Is a Square Foot?</h3>
            <p>A <strong>square foot</strong> (ft² or sq ft) is a US customary and imperial unit of area equal to a square with sides of 1 foot (12 inches). It is the primary unit for expressing property size, room dimensions, flooring, and retail space in the United States. MLS listings, appraisals, and building codes all use square feet.</p>
        `,
        faq: [
            { question: "How many square feet is 100 square meters?", answer: "1,076 square feet. 100 × 10.7639 = 1,076.39 ft². This is roughly the size of a small US house or large apartment." },
            { question: "How many square feet in 1 square meter?", answer: "10.7639 square feet. For quick estimates, round to ~10.8 sq ft per sq m. To reverse: 1 sq ft = 0.0929 sq m." },
            { question: "How many square meters is a 2,000 sq ft house?", answer: "About 186 square meters. 2,000 ÷ 10.7639 = 185.8 m². The median US single-family home is approximately this size." },
            { question: "How many square feet in an acre?", answer: "Exactly 43,560 square feet = 1 acre = 4,047 square meters. An acre is roughly the size of a football field without the end zones (which is 48,000 sq ft)." },
            { question: "Why does the US use square feet instead of square meters?", answer: "The US uses the customary system inherited from British imperial units. While most of the world adopted the metric system, the US retained feet, pounds, and gallons. Real estate, construction, and building codes are all standardized in square feet." },
            { question: "How do I convert price per square meter to price per square foot?", answer: "Divide the $/m² price by 10.7639. Example: if a European property is listed at €3,000/m², that equals €3,000 ÷ 10.7639 = €278.7/ft². This helps Americans compare international property prices." },
        ],
    },
    "oz-to-ml-converter": {
        subtitle: "Convert weight ounces to milliliters (oz to mL) for any ingredient. Select a substance or enter a custom density. See results in mL, liters, fluid ounces, and cups.",
        contentHTML: `
            <h3>How to Convert Ounces (Weight) to Milliliters</h3>
            <p>This converter is for <strong>weight ounces (oz)</strong>, not fluid ounces. Since oz measures weight and mL measures volume, you need the substance's <strong>density</strong>:</p>
            <div class="explanation__highlight">
                <strong>mL = ounces × 28.3495 ÷ density (g/mL)</strong><br/><br/>
                Example: 5 oz of water (density 1.00 g/mL)<br/>
                = 5 × 28.3495 ÷ 1.00 = <strong>141.7 mL</strong><br/><br/>
                Example: 5 oz of olive oil (density 0.91 g/mL)<br/>
                = 5 × 28.3495 ÷ 0.91 = <strong>155.8 mL</strong><br/><br/>
                Example: 5 oz of honey (density 1.43 g/mL)<br/>
                = 5 × 28.3495 ÷ 1.43 = <strong>99.1 mL</strong>
            </div>
            <p><strong>Key insight:</strong> Heavier substances (higher density) produce <em>fewer</em> mL per ounce, while lighter substances produce <em>more</em> mL.</p>

            <h3>Ounces to Milliliters — By Ingredient (for 1 oz)</h3>
            <table>
                <thead><tr><th>Ingredient</th><th>Density</th><th>1 oz =</th><th>8 oz =</th></tr></thead>
                <tbody>
                    <tr><td><strong>Water</strong></td><td>1.00 g/mL</td><td>28.3 mL</td><td>226.8 mL</td></tr>
                    <tr><td><strong>Whole Milk</strong></td><td>1.03 g/mL</td><td>27.5 mL</td><td>220.2 mL</td></tr>
                    <tr><td><strong>All-purpose Flour</strong></td><td>0.53 g/mL</td><td>53.5 mL</td><td>428.0 mL</td></tr>
                    <tr><td><strong>Granulated Sugar</strong></td><td>0.85 g/mL</td><td>33.4 mL</td><td>266.8 mL</td></tr>
                    <tr><td><strong>Butter</strong></td><td>0.91 g/mL</td><td>31.2 mL</td><td>249.2 mL</td></tr>
                    <tr><td><strong>Olive Oil</strong></td><td>0.91 g/mL</td><td>31.2 mL</td><td>249.2 mL</td></tr>
                    <tr><td><strong>Honey</strong></td><td>1.43 g/mL</td><td>19.8 mL</td><td>158.6 mL</td></tr>
                    <tr><td><strong>Cocoa Powder</strong></td><td>0.52 g/mL</td><td>54.5 mL</td><td>436.1 mL</td></tr>
                    <tr><td><strong>Vegetable Oil</strong></td><td>0.92 g/mL</td><td>30.8 mL</td><td>246.5 mL</td></tr>
                    <tr><td><strong>Heavy Cream</strong></td><td>1.01 g/mL</td><td>28.1 mL</td><td>224.6 mL</td></tr>
                </tbody>
            </table>

            <h3>⚠️ Weight Ounce vs. Fluid Ounce — Critical Difference</h3>
            <p>US recipes use two completely different units that share the word "ounce":</p>
            <table>
                <thead><tr><th>Feature</th><th>Weight Ounce (oz)</th><th>Fluid Ounce (fl oz)</th></tr></thead>
                <tbody>
                    <tr><td><strong>Measures</strong></td><td>Weight / mass</td><td>Volume</td></tr>
                    <tr><td><strong>Tool needed</strong></td><td>Kitchen scale</td><td>Measuring cup</td></tr>
                    <tr><td><strong>1 unit of water =</strong></td><td>28.35 mL</td><td>29.57 mL</td></tr>
                    <tr><td><strong>Depends on density?</strong></td><td>Yes — changes by ingredient</td><td>No — always the same</td></tr>
                    <tr><td><strong>More accurate?</strong></td><td>✅ Yes — professional bakers prefer this</td><td>Less accurate for dry goods</td></tr>
                    <tr><td><strong>Example in recipe</strong></td><td>"4 oz chocolate" (weigh it)</td><td>"4 fl oz vanilla" (pour it)</td></tr>
                </tbody>
            </table>

            <h3>Common Baking Ingredients — oz to mL</h3>
            <table>
                <thead><tr><th>Ingredient</th><th>4 oz =</th><th>8 oz =</th><th>16 oz (1 lb) =</th></tr></thead>
                <tbody>
                    <tr><td>All-purpose flour</td><td>214 mL</td><td>428 mL</td><td>856 mL</td></tr>
                    <tr><td>Granulated sugar</td><td>133 mL</td><td>267 mL</td><td>534 mL</td></tr>
                    <tr><td>Brown sugar (packed)</td><td>130 mL</td><td>260 mL</td><td>519 mL</td></tr>
                    <tr><td>Butter</td><td>125 mL</td><td>249 mL</td><td>499 mL</td></tr>
                    <tr><td>Chocolate chips</td><td>118 mL</td><td>236 mL</td><td>472 mL</td></tr>
                    <tr><td>Cocoa powder</td><td>218 mL</td><td>436 mL</td><td>872 mL</td></tr>
                    <tr><td>Cream cheese</td><td>113 mL</td><td>227 mL</td><td>454 mL</td></tr>
                </tbody>
            </table>

            <h3>When to Use Weight vs. Volume in US Recipes</h3>
            <ul>
                <li><strong>Use weight (oz)</strong> for: flour, sugar, chocolate, cheese, meat, butter — anywhere precision matters</li>
                <li><strong>Use volume (fl oz)</strong> for: water, milk, oil, juice — pourable liquids</li>
                <li><strong>Professional bakeries always weigh</strong> — measuring by volume can cause 10–20% variation in flour, drastically affecting results</li>
                <li><strong>European and Asian recipes</strong> typically use grams (weight), so knowing oz↔mL helps when converting international recipes</li>
            </ul>

            <h3>What Is an Ounce?</h3>
            <p>An <strong>ounce</strong> (oz) is a US customary unit of weight equal to 1/16 of a pound or 28.3495 grams. In cooking, "ounces" without the "fluid" prefix typically means weight — check your recipe carefully. Most US kitchen scales can toggle between ounces and grams.</p>

            <h3>What Is a Milliliter?</h3>
            <p>A <strong>milliliter</strong> (mL) is a metric unit of volume equal to 1/1,000 of a liter or 1 cubic centimeter. It is the international standard for measuring small liquid volumes in cooking, medicine, and science.</p>
        `,
        faq: [
            { question: "How many mL is 1 ounce?", answer: "It depends on the substance! For water: 1 oz ≈ 28.3 mL. For flour: 1 oz ≈ 53.5 mL (flour is much less dense). For honey: 1 oz ≈ 19.8 mL (honey is very dense). This is why you need density for weight-to-volume conversions." },
            { question: "Is 1 oz the same as 1 fl oz?", answer: "No! 1 oz (weight) ≠ 1 fl oz (volume). For water they're close: 1 oz = 28.35 mL while 1 fl oz = 29.57 mL. But for other substances, the difference can be huge. 1 oz of flour is 53.5 mL, while 1 fl oz is always 29.57 mL regardless of what's in it." },
            { question: "How do I convert ounces to mL for baking?", answer: "Use the formula: mL = oz × 28.3495 ÷ density. For common ingredients: flour (density 0.53), sugar (0.85), butter (0.91), honey (1.43). Professional bakers prefer gram/ounce measurements over cup measurements because they're more precise." },
            { question: "How many ounces in a cup of flour?", answer: "About 4.25 oz (120g). Since 1 cup = 236.6 mL and flour has a density of 0.53 g/mL: 236.6 × 0.53 = 125.4g = 4.42 oz. However, this varies widely based on how the flour is scooped — which is why weight is more accurate." },
            { question: "Why do baking recipes sometimes list ounces and sometimes cups?", answer: "Older American recipes use volume (cups/tablespoons) because it's traditional and doesn't require a scale. Modern and professional recipes use weight (ounces or grams) because it's more precise. A cup of flour can vary by 20% depending on scooping technique." },
            { question: "How is this different from the fluid ounces to mL converter?", answer: "This converter handles WEIGHT ounces (oz) to mL, which requires knowing the substance's density. Our fluid ounces to mL converter handles VOLUME (fl oz) to mL, which is a direct conversion (1 fl oz = 29.57 mL) regardless of substance." },
        ],
    },
    "rpm-to-rads-converter": {
        subtitle: "Convert revolutions per minute to radians per second (RPM to rad/s). See results in rad/s, degrees/second, Hertz, and linear velocity. Includes a quick reference table.",
        contentHTML: `
            <h3>How to Convert RPM to Radians per Second</h3>
            <p>One revolution = 2π radians, and one minute = 60 seconds. So:</p>
            <div class="explanation__highlight">
                <strong>rad/s = RPM × 2π ÷ 60</strong><br/>
                <strong>rad/s = RPM × 0.10472</strong><br/><br/>
                Example: 3,600 RPM<br/>
                = 3,600 × 0.10472 = <strong>376.99 rad/s</strong><br/><br/>
                Example: 1,800 RPM (standard US motor)<br/>
                = 1,800 × 0.10472 = <strong>188.50 rad/s</strong><br/><br/>
                Example: 60 RPM (1 revolution per second)<br/>
                = 60 × 0.10472 = <strong>6.283 rad/s</strong> (= 2π)
            </div>

            <h3>Angular Velocity Units Compared</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>1 RPM =</th><th>Used In</th></tr></thead>
                <tbody>
                    <tr><td><strong>Revolutions/minute</strong></td><td>RPM</td><td>1 RPM</td><td>Motors, engines, tools</td></tr>
                    <tr><td><strong>Radians/second</strong></td><td>rad/s</td><td>0.10472 rad/s</td><td>Physics, engineering</td></tr>
                    <tr><td>Degrees/second</td><td>°/s</td><td>6 °/s</td><td>Gyroscopes, robotics</td></tr>
                    <tr><td>Hertz (rev/second)</td><td>Hz</td><td>0.01667 Hz</td><td>Frequency measurement</td></tr>
                </tbody>
            </table>

            <h3>RPM to rad/s — Conversion Table</h3>
            <table>
                <thead><tr><th>RPM</th><th>rad/s</th><th>°/s</th><th>Hz</th><th>Common Example</th></tr></thead>
                <tbody>
                    <tr><td>1 RPM</td><td>0.105</td><td>6</td><td>0.017</td><td>Rotisserie motor</td></tr>
                    <tr><td>33 RPM</td><td>3.456</td><td>198</td><td>0.550</td><td>Vinyl record (LP)</td></tr>
                    <tr><td>60 RPM</td><td>6.283</td><td>360</td><td>1.000</td><td>Clock second hand</td></tr>
                    <tr><td>300 RPM</td><td>31.42</td><td>1,800</td><td>5.000</td><td>Washing machine spin</td></tr>
                    <tr><td>900 RPM</td><td>94.25</td><td>5,400</td><td>15.00</td><td>US ceiling fan (high)</td></tr>
                    <tr><td>1,800 RPM</td><td>188.5</td><td>10,800</td><td>30.00</td><td>US 4-pole motor (60Hz)</td></tr>
                    <tr><td>3,600 RPM</td><td>377.0</td><td>21,600</td><td>60.00</td><td>US 2-pole motor (60Hz)</td></tr>
                    <tr><td>5,400 RPM</td><td>565.5</td><td>32,400</td><td>90.00</td><td>Laptop hard drive</td></tr>
                    <tr><td>7,200 RPM</td><td>753.9</td><td>43,200</td><td>120.0</td><td>Desktop hard drive</td></tr>
                    <tr><td>10,000 RPM</td><td>1,047</td><td>60,000</td><td>166.7</td><td>High-perf hard drive</td></tr>
                    <tr><td>15,000 RPM</td><td>1,571</td><td>90,000</td><td>250.0</td><td>Dental drill</td></tr>
                    <tr><td>20,000 RPM</td><td>2,094</td><td>120,000</td><td>333.3</td><td>Turbocharger</td></tr>
                </tbody>
            </table>

            <h3>Linear Velocity from RPM (v = ω × r)</h3>
            <p>If an object rotates at ω rad/s and has radius r meters, the edge moves at:</p>
            <div class="explanation__highlight">
                <strong>v = ω × r</strong> (meters per second)<br/><br/>
                Example: A 26" bicycle wheel at 300 RPM<br/>
                ω = 300 × 0.10472 = 31.42 rad/s<br/>
                r = 26" × 0.0254 ÷ 2 = 0.3302 m<br/>
                v = 31.42 × 0.3302 = <strong>10.37 m/s ≈ 23.2 mph</strong>
            </div>

            <h3>Common Motors & Engines — RPM in the US</h3>
            <table>
                <thead><tr><th>Device</th><th>Typical RPM</th><th>rad/s</th></tr></thead>
                <tbody>
                    <tr><td>Ceiling fan (low)</td><td>100–200 RPM</td><td>10.5–20.9</td></tr>
                    <tr><td>Washing machine (spin)</td><td>800–1,600 RPM</td><td>83.8–167.5</td></tr>
                    <tr><td>Car engine (idle)</td><td>600–1,000 RPM</td><td>62.8–104.7</td></tr>
                    <tr><td>Car engine (highway)</td><td>2,000–3,000 RPM</td><td>209.4–314.2</td></tr>
                    <tr><td>Power drill</td><td>500–3,000 RPM</td><td>52.4–314.2</td></tr>
                    <tr><td>Circular saw</td><td>3,000–5,000 RPM</td><td>314.2–523.6</td></tr>
                    <tr><td>Blender</td><td>6,000–20,000 RPM</td><td>628.3–2,094</td></tr>
                    <tr><td>Jet engine turbine</td><td>10,000–25,000 RPM</td><td>1,047–2,618</td></tr>
                </tbody>
            </table>

            <h3>What Are Revolutions per Minute (RPM)?</h3>
            <p><strong>RPM</strong> is a unit of rotational speed indicating how many full 360° turns an object completes in one minute. It is the most commonly used unit for expressing motor speed, engine speed, and tool speed in the United States. Tachometers in cars, spec sheets for power tools, and hard drive speeds all use RPM.</p>

            <h3>What Are Radians per Second (rad/s)?</h3>
            <p>A <strong>radian per second</strong> (rad/s) is the SI unit of angular velocity. One radian is approximately 57.3° — the angle where the arc length equals the radius. Radians are dimensionless, making rad/s the preferred unit in physics and engineering calculations involving torque, angular momentum, and rotational kinetic energy.</p>
        `,
        faq: [
            { question: "How do I convert RPM to radians per second?", answer: "Multiply RPM by 2π/60 (≈ 0.10472). Example: 3,600 RPM × 0.10472 = 376.99 rad/s. This works because 1 revolution = 2π radians and 1 minute = 60 seconds." },
            { question: "What is 1 RPM in radians per second?", answer: "1 RPM = 0.10472 rad/s. This is equal to 2π/60, since one revolution covers 2π radians and takes 60 seconds at 1 RPM." },
            { question: "Why are 1,800 and 3,600 RPM common motor speeds?", answer: "US electrical power runs at 60 Hz. AC motors synchronize to the power frequency: 2-pole motors spin at 3,600 RPM (60 Hz × 60 s/min) and 4-pole motors at 1,800 RPM (3,600 ÷ 2). These are the most common industrial motor speeds in the US." },
            { question: "How do I find linear velocity from RPM?", answer: "Convert RPM to rad/s (multiply by 0.10472), then use v = ω × r, where r is the radius in meters. Example: 1,000 RPM with a 0.5m radius → ω = 104.72 rad/s → v = 104.72 × 0.5 = 52.36 m/s." },
            { question: "What is the relationship between RPM and Hertz?", answer: "Hz = RPM ÷ 60. Hertz measures complete cycles per second, while RPM measures complete revolutions per minute. Since 1 minute = 60 seconds: 60 RPM = 1 Hz, 3,600 RPM = 60 Hz." },
            { question: "How fast does a car engine spin?", answer: "A typical car engine idles at 600–1,000 RPM (62.8–104.7 rad/s) and cruises at 2,000–3,000 RPM (209–314 rad/s) on the highway. Redline (maximum safe RPM) is typically 6,000–7,000 RPM for most US passenger vehicles." },
        ],
    },
    "gram-flour-to-cup-converter": {
        subtitle: "Convert grams of flour to cups for 7 flour types (all-purpose, bread, cake, whole wheat, almond, coconut, self-rising). See results in cups, tablespoons, and ounces.",
        contentHTML: `
            <h3>How to Convert Grams of Flour to Cups</h3>
            <p>Divide the weight in grams by the grams-per-cup for your flour type:</p>
            <div class="explanation__highlight">
                <strong>cups = grams ÷ grams per cup</strong><br/><br/>
                Example: 250g all-purpose flour (125 g/cup)<br/>
                = 250 ÷ 125 = <strong>2.00 cups</strong><br/><br/>
                Example: 250g cake flour (114 g/cup)<br/>
                = 250 ÷ 114 = <strong>2.19 cups</strong><br/><br/>
                Example: 250g almond flour (96 g/cup)<br/>
                = 250 ÷ 96 = <strong>2.60 cups</strong>
            </div>
            <p><strong>Key:</strong> The same weight of flour produces different cup amounts because each flour type has a different density!</p>

            <h3>Flour Types — Grams per Cup Comparison</h3>
            <table>
                <thead><tr><th>Flour Type</th><th>g/cup</th><th>100g =</th><th>250g =</th><th>500g =</th></tr></thead>
                <tbody>
                    <tr><td><strong>All-Purpose Flour</strong></td><td>125 g</td><td>0.80 cups</td><td>2.00 cups</td><td>4.00 cups</td></tr>
                    <tr><td><strong>Bread Flour</strong></td><td>130 g</td><td>0.77 cups</td><td>1.92 cups</td><td>3.85 cups</td></tr>
                    <tr><td><strong>Cake Flour</strong></td><td>114 g</td><td>0.88 cups</td><td>2.19 cups</td><td>4.39 cups</td></tr>
                    <tr><td><strong>Whole Wheat Flour</strong></td><td>120 g</td><td>0.83 cups</td><td>2.08 cups</td><td>4.17 cups</td></tr>
                    <tr><td><strong>Almond Flour</strong></td><td>96 g</td><td>1.04 cups</td><td>2.60 cups</td><td>5.21 cups</td></tr>
                    <tr><td><strong>Coconut Flour</strong></td><td>128 g</td><td>0.78 cups</td><td>1.95 cups</td><td>3.91 cups</td></tr>
                    <tr><td><strong>Self-Rising Flour</strong></td><td>125 g</td><td>0.80 cups</td><td>2.00 cups</td><td>4.00 cups</td></tr>
                </tbody>
            </table>

            <h3>All-Purpose Flour — Grams to Cups Reference</h3>
            <table>
                <thead><tr><th>Grams</th><th>Cups</th><th>Tablespoons</th><th>Ounces</th></tr></thead>
                <tbody>
                    <tr><td>25 g</td><td>⅕ cup</td><td>3 tbsp</td><td>0.9 oz</td></tr>
                    <tr><td>50 g</td><td>⅖ cup</td><td>6 tbsp</td><td>1.8 oz</td></tr>
                    <tr><td>100 g</td><td>⅘ cup</td><td>13 tbsp</td><td>3.5 oz</td></tr>
                    <tr><td>125 g</td><td>1 cup</td><td>16 tbsp</td><td>4.4 oz</td></tr>
                    <tr><td>150 g</td><td>1⅕ cups</td><td>19 tbsp</td><td>5.3 oz</td></tr>
                    <tr><td>200 g</td><td>1⅗ cups</td><td>26 tbsp</td><td>7.1 oz</td></tr>
                    <tr><td>250 g</td><td>2 cups</td><td>32 tbsp</td><td>8.8 oz</td></tr>
                    <tr><td>300 g</td><td>2⅖ cups</td><td>38 tbsp</td><td>10.6 oz</td></tr>
                    <tr><td>400 g</td><td>3⅕ cups</td><td>51 tbsp</td><td>14.1 oz</td></tr>
                    <tr><td>500 g</td><td>4 cups</td><td>64 tbsp</td><td>17.6 oz</td></tr>
                </tbody>
            </table>

            <h3>Why Do Different Flours Weigh Different Amounts per Cup?</h3>
            <p>Flour weight per cup depends on <strong>protein content, particle size, and how finely it's milled</strong>:</p>
            <ul>
                <li><strong>Cake flour</strong> (114 g/cup) — lowest protein, very finely milled, sifted → lighter and fluffier</li>
                <li><strong>All-purpose flour</strong> (125 g/cup) — medium protein, standard grind</li>
                <li><strong>Bread flour</strong> (130 g/cup) — highest protein (12–14%), slightly denser</li>
                <li><strong>Almond flour</strong> (96 g/cup) — ground almonds are much less dense than wheat flour</li>
                <li><strong>Coconut flour</strong> (128 g/cup) — very absorbent; use ¼ to ⅓ the amount of all-purpose</li>
            </ul>

            <h3>⚠️ Why Cup Measurements Vary — The Scooping Problem</h3>
            <p>How you scoop flour into a cup dramatically affects the weight:</p>
            <table>
                <thead><tr><th>Method</th><th>Typical Result</th><th>Accuracy</th></tr></thead>
                <tbody>
                    <tr><td><strong>Spoon & level</strong> (recommended)</td><td>~125 g/cup</td><td>Most accurate for cups</td></tr>
                    <tr><td>Scoop & pack</td><td>~140–160 g/cup</td><td>Up to 28% more flour!</td></tr>
                    <tr><td>Shake & settle</td><td>~130–140 g/cup</td><td>10–12% more flour</td></tr>
                    <tr><td><strong>Kitchen scale</strong> (best)</td><td>Exact grams</td><td>Perfect every time ✅</td></tr>
                </tbody>
            </table>
            <p><strong>Pro tip:</strong> A cup of scooped flour can weigh up to 155g vs 125g when spooned — that extra 30g per cup can ruin a recipe. This is why professional bakers and most international recipes use grams.</p>

            <h3>Common US Recipe Flour Amounts</h3>
            <table>
                <thead><tr><th>Recipe</th><th>Flour Amount</th><th>In Cups (AP)</th></tr></thead>
                <tbody>
                    <tr><td>Pancakes (serves 4)</td><td>150 g</td><td>1.2 cups</td></tr>
                    <tr><td>Cookies (1 batch)</td><td>250–300 g</td><td>2–2.4 cups</td></tr>
                    <tr><td>Cake (9" round)</td><td>300–360 g</td><td>2.4–2.9 cups</td></tr>
                    <tr><td>Pizza dough</td><td>350–400 g</td><td>2.8–3.2 cups</td></tr>
                    <tr><td>Bread loaf</td><td>450–550 g</td><td>3.6–4.4 cups</td></tr>
                    <tr><td>Pie crust (double)</td><td>300 g</td><td>2.4 cups</td></tr>
                </tbody>
            </table>

            <h3>What Is a Gram?</h3>
            <p>A <strong>gram</strong> (g) is a metric unit of weight equal to 1/1,000 of a kilogram. It is the preferred unit for measuring ingredients in professional baking and in recipes from Europe, Asia, and most of the world. Grams provide precise, consistent results because weight doesn't change with scooping technique.</p>

            <h3>What Is a Cup?</h3>
            <p>A <strong>US cup</strong> is a unit of volume equal to 8 fluid ounces or 236.6 mL. In US cooking, cups are the traditional unit for measuring dry ingredients like flour, sugar, and oats — though weight (grams/ounces) is more accurate for baking.</p>
        `,
        faq: [
            { question: "How many cups is 250 grams of flour?", answer: "For all-purpose flour: 2.00 cups (250 ÷ 125). For cake flour: 2.19 cups (250 ÷ 114). For bread flour: 1.92 cups (250 ÷ 130). The answer depends on the flour type because each has a different density." },
            { question: "How many grams is 1 cup of all-purpose flour?", answer: "125 grams when measured using the spoon-and-level method. If you scoop directly from the bag, you may pack in 140–155g per cup — which can make your baked goods dense and dry." },
            { question: "Why is my recipe giving flour amounts in grams?", answer: "Grams are more accurate than cups for baking. A cup of flour can vary by 20–30% depending on how you scoop it (125g vs 155g). Most modern recipes, especially from professional bakers and international sources, use grams for consistency." },
            { question: "Can I substitute different flour types?", answer: "Not directly cup-for-cup. Different flours have different protein content, absorption rates, and behaviors. Cake flour produces tender crumbs; bread flour gives chewy structure. If substituting, adjust the amount: use 2 tbsp less cake flour per cup of AP flour, or 1 tbsp more bread flour." },
            { question: "How do I measure flour in cups correctly?", answer: "Use the spoon-and-level method: (1) Stir flour in the bag to aerate it, (2) Spoon flour into the measuring cup, (3) Level off with a straight edge. Never scoop directly from the bag — this packs the flour and adds 20–30% more." },
            { question: "Why is almond flour measured differently?", answer: "Almond flour is made from ground almonds, not wheat, so it has very different density (96 g/cup vs 125 g for AP flour). It's also gluten-free and much higher in fat and protein. You cannot swap almond flour 1:1 for wheat flour — recipes need to be specifically designed for it." },
        ],
    },
    "inlb-to-ftlb-converter": {
        subtitle: "Convert inch-pounds to foot-pounds (in-lbs to ft-lbs). See results in foot-pounds, Newton-meters, and kilogram-centimeters. Includes a quick reference table with common torque specs.",
        contentHTML: `
            <h3>How to Convert Inch-Pounds to Foot-Pounds</h3>
            <p>Since there are <strong>12 inches in 1 foot</strong>, divide the torque in inch-pounds by 12:</p>
            <div class="explanation__highlight">
                <strong>ft-lbs = in-lbs ÷ 12</strong><br/><br/>
                Example: 120 in-lbs<br/>
                = 120 ÷ 12 = <strong>10.00 ft-lbs</strong><br/><br/>
                Example: 360 in-lbs (typical engine bolt)<br/>
                = 360 ÷ 12 = <strong>30.00 ft-lbs</strong><br/><br/>
                Example: 24 in-lbs (plumbing fitting)<br/>
                = 24 ÷ 12 = <strong>2.00 ft-lbs</strong>
            </div>

            <h3>Torque Unit Comparison</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>1 ft-lb =</th><th>Used In</th></tr></thead>
                <tbody>
                    <tr><td><strong>Inch-pound</strong></td><td>in-lbs</td><td>12 in-lbs</td><td>Small fasteners, precision</td></tr>
                    <tr><td><strong>Foot-pound</strong></td><td>ft-lbs</td><td>1 ft-lb</td><td>Automotive, construction</td></tr>
                    <tr><td><strong>Newton-meter</strong></td><td>N·m</td><td>1.3558 N·m</td><td>International, metric tools</td></tr>
                    <tr><td>Kilogram-centimeter</td><td>kg·cm</td><td>13.825 kg·cm</td><td>Some Asian tools</td></tr>
                    <tr><td>Inch-ounce</td><td>in-oz</td><td>192 in-oz</td><td>Very small electronics</td></tr>
                </tbody>
            </table>

            <h3>Inch-Pounds to Foot-Pounds — Conversion Table</h3>
            <table>
                <thead><tr><th>in-lbs</th><th>ft-lbs</th><th>N·m</th><th>Common Application</th></tr></thead>
                <tbody>
                    <tr><td>1 in-lb</td><td>0.083</td><td>0.11</td><td>Electronics, circuit board</td></tr>
                    <tr><td>5 in-lbs</td><td>0.417</td><td>0.56</td><td>Computer case screw</td></tr>
                    <tr><td>12 in-lbs</td><td>1.000</td><td>1.36</td><td>Small machine screw</td></tr>
                    <tr><td>24 in-lbs</td><td>2.000</td><td>2.71</td><td>Plumbing compression fitting</td></tr>
                    <tr><td>48 in-lbs</td><td>4.000</td><td>5.42</td><td>Electrical panel connection</td></tr>
                    <tr><td>72 in-lbs</td><td>6.000</td><td>8.13</td><td>Bicycle stem bolt</td></tr>
                    <tr><td>96 in-lbs</td><td>8.000</td><td>10.84</td><td>Rifle scope mount</td></tr>
                    <tr><td>120 in-lbs</td><td>10.000</td><td>13.56</td><td>Valve cover bolt</td></tr>
                    <tr><td>180 in-lbs</td><td>15.000</td><td>20.34</td><td>Thermostat housing</td></tr>
                    <tr><td>240 in-lbs</td><td>20.000</td><td>27.12</td><td>Intake manifold bolt</td></tr>
                    <tr><td>360 in-lbs</td><td>30.000</td><td>40.67</td><td>Spark plug (aluminum head)</td></tr>
                    <tr><td>600 in-lbs</td><td>50.000</td><td>67.79</td><td>Suspension bolt</td></tr>
                </tbody>
            </table>

            <h3>Common US Automotive Torque Specs</h3>
            <table>
                <thead><tr><th>Component</th><th>in-lbs</th><th>ft-lbs</th><th>N·m</th></tr></thead>
                <tbody>
                    <tr><td>Spark plug (aluminum head)</td><td>144–180</td><td>12–15</td><td>16–20</td></tr>
                    <tr><td>Spark plug (iron head)</td><td>300–360</td><td>25–30</td><td>34–41</td></tr>
                    <tr><td>Oil drain plug</td><td>240–360</td><td>20–30</td><td>27–41</td></tr>
                    <tr><td>Valve cover bolt</td><td>72–120</td><td>6–10</td><td>8–14</td></tr>
                    <tr><td>Wheel lug nut (car)</td><td>960–1,200</td><td>80–100</td><td>108–136</td></tr>
                    <tr><td>Wheel lug nut (truck)</td><td>1,560–1,800</td><td>130–150</td><td>176–203</td></tr>
                    <tr><td>Head bolt (typical)</td><td>540–780</td><td>45–65</td><td>61–88</td></tr>
                </tbody>
            </table>
            <p><strong>Always check your vehicle's service manual</strong> for exact torque specifications — values vary by manufacturer, model year, and bolt size.</p>

            <h3>When to Use Inch-Pounds vs. Foot-Pounds</h3>
            <ul>
                <li><strong>Use inch-pounds (in-lbs)</strong> for: small bolts, precision fasteners, electronics, plumbing fittings, scope mounts, bicycle parts — anything under ~75 ft-lbs (900 in-lbs)</li>
                <li><strong>Use foot-pounds (ft-lbs)</strong> for: lug nuts, engine bolts, suspension, structural bolts — larger automotive and construction fasteners</li>
                <li><strong>Rule of thumb:</strong> If the torque value would be less than 5 ft-lbs, express it in in-lbs for better precision (e.g., "24 in-lbs" is clearer than "2 ft-lbs")</li>
            </ul>

            <h3>What Is an Inch-Pound?</h3>
            <p>An <strong>inch-pound</strong> (in-lb) is a US unit of torque equal to the force of 1 pound applied at a distance of 1 inch from the pivot point. It provides finer resolution than foot-pounds, making it ideal for small fasteners where over-tightening can strip threads or crack components.</p>

            <h3>What Is a Foot-Pound?</h3>
            <p>A <strong>foot-pound</strong> (ft-lb) is a US unit of torque equal to the force of 1 pound applied at a distance of 1 foot (12 inches) from the pivot point. It is the standard torque unit used in American automotive repair, construction, and manufacturing. Most US torque wrenches display ft-lbs as the primary unit.</p>
        `,
        faq: [
            { question: "How do I convert inch-pounds to foot-pounds?", answer: "Divide by 12. Since there are 12 inches in a foot: ft-lbs = in-lbs ÷ 12. Example: 120 in-lbs ÷ 12 = 10.00 ft-lbs. To reverse: ft-lbs × 12 = in-lbs." },
            { question: "How many inch-pounds is 1 foot-pound?", answer: "Exactly 12 inch-pounds = 1 foot-pound. This is simply because there are 12 inches in 1 foot." },
            { question: "What torque wrench do I need for inch-pounds?", answer: "You need an inch-pound (in-lb) torque wrench, typically ranging from 20–200 in-lbs. Standard torque wrenches measure in ft-lbs and don't have the precision needed for small in-lb values. Brands like Tekton, CDI, and Park Tool make dedicated in-lb torque wrenches." },
            { question: "How tight is 25 inch-pounds?", answer: "25 in-lbs (≈ 2.1 ft-lbs or 2.8 N·m) is quite light — roughly the torque of snugging a plumbing fitting with two fingers on a short wrench. Over-tightening at this range is easy and can strip soft brass or plastic fittings." },
            { question: "What torque for spark plugs?", answer: "For aluminum cylinder heads: 12–15 ft-lbs (144–180 in-lbs). For cast iron heads: 25–30 ft-lbs (300–360 in-lbs). Always check your vehicle manual — incorrect spark plug torque can crack the head or cause a misfire." },
            { question: "Why do mechanics use both inch-pounds and foot-pounds?", answer: "Inch-pounds provide finer resolution for small, precision fasteners (electronics, scope mounts, bicycle parts). Foot-pounds are better for larger bolts (lug nuts, engine bolts) where higher torque values make in-lbs impractical. A 100 ft-lb lug nut = 1,200 in-lbs — easier to read as ft-lbs." },
        ],
    },
    "cal-to-kg-converter": {
        subtitle: "Convert calories burned to kilograms of weight loss (kcal to kg). See results in kg, pounds, and grams. Includes a timeline at your daily calorie deficit.",
        contentHTML: `
            <h3>How to Convert Calories to Kilograms</h3>
            <p>One kilogram of body fat contains approximately <strong>7,700 calories</strong> (kcal). To find how many kilograms a calorie deficit represents:</p>
            <div class="explanation__highlight">
                <strong>kg = calories ÷ 7,700</strong><br/><br/>
                Example: 7,700 kcal deficit<br/>
                = 7,700 ÷ 7,700 = <strong>1.00 kg (2.2 lbs)</strong><br/><br/>
                Example: 3,500 kcal deficit<br/>
                = 3,500 ÷ 7,700 = <strong>0.45 kg (1.0 lb)</strong><br/><br/>
                Example: 38,500 kcal deficit<br/>
                = 38,500 ÷ 7,700 = <strong>5.00 kg (11.0 lbs)</strong>
            </div>
            <p><strong>Note:</strong> In the US, the "3,500 calorie rule" is widely used: 3,500 kcal = 1 pound of body fat. Both rules yield the same result (7,700 kcal/kg ≈ 3,500 kcal/lb).</p>

            <h3>Calories to Weight Loss — Reference Table</h3>
            <table>
                <thead><tr><th>Calories</th><th>Kilograms</th><th>Pounds</th><th>Weeks (500 kcal/day deficit)</th></tr></thead>
                <tbody>
                    <tr><td>500 kcal</td><td>0.06 kg</td><td>0.14 lbs</td><td>0.1 wks</td></tr>
                    <tr><td>1,000 kcal</td><td>0.13 kg</td><td>0.29 lbs</td><td>0.3 wks</td></tr>
                    <tr><td>3,500 kcal</td><td>0.45 kg</td><td><strong>1.0 lb</strong></td><td>1.0 wk</td></tr>
                    <tr><td>7,700 kcal</td><td><strong>1.00 kg</strong></td><td>2.2 lbs</td><td>2.2 wks</td></tr>
                    <tr><td>15,400 kcal</td><td>2.00 kg</td><td>4.4 lbs</td><td>4.4 wks</td></tr>
                    <tr><td>23,100 kcal</td><td>3.00 kg</td><td>6.6 lbs</td><td>6.6 wks</td></tr>
                    <tr><td>38,500 kcal</td><td>5.00 kg</td><td>11.0 lbs</td><td>11.0 wks</td></tr>
                    <tr><td>77,000 kcal</td><td>10.00 kg</td><td>22.0 lbs</td><td>22.0 wks</td></tr>
                </tbody>
            </table>

            <h3>Calories Burned per Hour — Exercise Chart</h3>
            <p>Approximate calories burned per hour for a 155 lb (70 kg) person:</p>
            <table>
                <thead><tr><th>Activity</th><th>kcal/hour</th><th>Hours to Burn 1 lb</th><th>Hours to Burn 1 kg</th></tr></thead>
                <tbody>
                    <tr><td>Walking (3.5 mph)</td><td>298</td><td>11.7 hrs</td><td>25.8 hrs</td></tr>
                    <tr><td>Cycling (moderate)</td><td>520</td><td>6.7 hrs</td><td>14.8 hrs</td></tr>
                    <tr><td>Swimming (laps)</td><td>446</td><td>7.8 hrs</td><td>17.3 hrs</td></tr>
                    <tr><td>Running (6 mph)</td><td>596</td><td>5.9 hrs</td><td>12.9 hrs</td></tr>
                    <tr><td>HIIT</td><td>600</td><td>5.8 hrs</td><td>12.8 hrs</td></tr>
                    <tr><td>Weight lifting</td><td>224</td><td>15.6 hrs</td><td>34.4 hrs</td></tr>
                    <tr><td>Yoga</td><td>298</td><td>11.7 hrs</td><td>25.8 hrs</td></tr>
                    <tr><td>Elliptical</td><td>480</td><td>7.3 hrs</td><td>16.0 hrs</td></tr>
                </tbody>
            </table>

            <h3>Safe Weight Loss Rate — CDC Recommendations</h3>
            <p>The <strong>CDC recommends losing 1–2 pounds (0.45–0.9 kg) per week</strong> for sustainable weight loss:</p>
            <table>
                <thead><tr><th>Daily Deficit</th><th>Weekly Loss</th><th>Monthly Loss</th><th>Safety</th></tr></thead>
                <tbody>
                    <tr><td>250 kcal/day</td><td>0.5 lb / 0.23 kg</td><td>2.0 lbs / 0.9 kg</td><td>✅ Very safe</td></tr>
                    <tr><td>500 kcal/day</td><td>1.0 lb / 0.45 kg</td><td>4.0 lbs / 1.8 kg</td><td>✅ Recommended</td></tr>
                    <tr><td>750 kcal/day</td><td>1.5 lbs / 0.68 kg</td><td>6.0 lbs / 2.7 kg</td><td>⚠️ Moderate</td></tr>
                    <tr><td>1,000 kcal/day</td><td>2.0 lbs / 0.9 kg</td><td>8.0 lbs / 3.6 kg</td><td>⚠️ Maximum recommended</td></tr>
                </tbody>
            </table>

            <h3>Common US Foods — Calorie Context</h3>
            <table>
                <thead><tr><th>Food</th><th>Calories</th><th>Weight Equivalent</th></tr></thead>
                <tbody>
                    <tr><td>1 can of soda (12 oz)</td><td>140 kcal</td><td>18 g / 0.6 oz body fat</td></tr>
                    <tr><td>Big Mac</td><td>550 kcal</td><td>71 g / 2.5 oz body fat</td></tr>
                    <tr><td>Slice of pizza</td><td>285 kcal</td><td>37 g / 1.3 oz body fat</td></tr>
                    <tr><td>1 Starbucks Frappuccino (Grande)</td><td>380 kcal</td><td>49 g / 1.7 oz body fat</td></tr>
                    <tr><td>1 lb of chicken breast</td><td>748 kcal</td><td>97 g / 3.4 oz body fat</td></tr>
                    <tr><td>1 avocado</td><td>322 kcal</td><td>42 g / 1.5 oz body fat</td></tr>
                </tbody>
            </table>

            <h3>What Is a Calorie?</h3>
            <p>A <strong>calorie</strong> (kcal, kilocalorie) is a unit of energy. In nutrition, it represents the energy needed to raise 1 kilogram of water by 1°C. When we say "calories" in the US, we mean kilocalories (kcal). Food labels in the US list Calories (capital C) which are kilocalories. Your body burns calories through basal metabolism, physical activity, and digestion.</p>

            <h3>What Is a Kilogram?</h3>
            <p>A <strong>kilogram</strong> (kg) is the SI base unit of mass equal to 2.20462 pounds. In the context of weight loss, 1 kg of body fat stores approximately 7,700 kcal of energy. While Americans typically think in pounds, kilograms are used internationally and by medical professionals.</p>
        `,
        faq: [
            { question: "How many calories do I need to burn to lose 1 kg?", answer: "Approximately 7,700 calories (kcal). Since 1 kg of body fat contains about 7,700 kcal of stored energy, you need a total deficit of 7,700 kcal to lose 1 kg. At a 500 kcal/day deficit, this takes about 15 days (2.2 weeks)." },
            { question: "How many calories is 1 pound of fat?", answer: "Approximately 3,500 calories = 1 pound of body fat. This is the widely-used rule in the US. It's consistent with the metric equivalent: 7,700 kcal/kg ÷ 2.205 lbs/kg ≈ 3,493 kcal/lb." },
            { question: "How fast can I safely lose weight?", answer: "The CDC recommends 1–2 pounds (0.45–0.9 kg) per week, which requires a daily deficit of 500–1,000 kcal. Faster weight loss can cause muscle loss, nutrient deficiencies, and gallstones. Very low calorie diets (under 1,200 kcal/day for women, 1,500 for men) should only be done under medical supervision." },
            { question: "Does exercise or diet matter more for weight loss?", answer: "Diet creates the largest calorie deficit. Running for 1 hour burns ~600 kcal, but skipping a Big Mac saves 550 kcal. Most experts recommend 80% diet, 20% exercise for weight loss. However, exercise is crucial for maintaining muscle mass, cardiovascular health, and keeping weight off long-term." },
            { question: "Why does weight loss slow down over time?", answer: "As you lose weight, your body needs fewer calories (lower basal metabolic rate). A 200-lb person burns ~2,400 kcal/day at rest, but at 170 lbs they burn ~2,100 kcal/day. This means the same 500 kcal deficit produces slower results. You need to readjust your intake or increase exercise." },
            { question: "Is the 3,500 calorie rule accurate?", answer: "It's a useful approximation but not perfectly accurate. The rule assumes all weight loss comes from pure fat, but in reality you also lose some water and muscle. Actual weight loss may be faster initially (water loss) and slower later (metabolic adaptation). For planning purposes, it's still the best simple estimate." },
        ],
    },
    "cup-butter-to-gram-converter": {
        subtitle: "Convert cups of butter to grams. See results in grams, ounces, sticks, and tablespoons. Includes a quick reference table for common butter amounts.",
        contentHTML: `
            <h3>How to Convert Cups of Butter to Grams</h3>
            <p>One US cup of butter weighs <strong>227 grams</strong> (8 oz, 2 sticks):</p>
            <div class="explanation__highlight">
                <strong>grams = cups × 227</strong><br/><br/>
                Example: 1 cup of butter<br/>
                = 1 × 227 = <strong>227 g (2 sticks)</strong><br/><br/>
                Example: ½ cup of butter<br/>
                = 0.5 × 227 = <strong>113.5 g (1 stick)</strong><br/><br/>
                Example: ¼ cup of butter<br/>
                = 0.25 × 227 = <strong>56.75 g (½ stick)</strong>
            </div>

            <h3>US Butter Packaging — Complete Reference</h3>
            <p>US butter is sold in 1-pound boxes containing <strong>4 sticks</strong>. Each stick has tablespoon markings on the wrapper:</p>
            <table>
                <thead><tr><th>Amount</th><th>Sticks</th><th>Cups</th><th>Tbsp</th><th>Grams</th><th>Ounces</th></tr></thead>
                <tbody>
                    <tr><td>1 tablespoon</td><td>⅛ stick</td><td>1/16 cup</td><td>1 tbsp</td><td>14.2 g</td><td>0.5 oz</td></tr>
                    <tr><td>2 tablespoons</td><td>¼ stick</td><td>⅛ cup</td><td>2 tbsp</td><td>28.4 g</td><td>1.0 oz</td></tr>
                    <tr><td>¼ cup</td><td>½ stick</td><td>¼ cup</td><td>4 tbsp</td><td>56.7 g</td><td>2.0 oz</td></tr>
                    <tr><td>⅓ cup</td><td>⅔ stick</td><td>⅓ cup</td><td>5⅓ tbsp</td><td>75.7 g</td><td>2.7 oz</td></tr>
                    <tr><td><strong>½ cup (1 stick)</strong></td><td><strong>1 stick</strong></td><td><strong>½ cup</strong></td><td><strong>8 tbsp</strong></td><td><strong>113.5 g</strong></td><td><strong>4.0 oz</strong></td></tr>
                    <tr><td>¾ cup</td><td>1½ sticks</td><td>¾ cup</td><td>12 tbsp</td><td>170.1 g</td><td>6.0 oz</td></tr>
                    <tr><td><strong>1 cup (2 sticks)</strong></td><td><strong>2 sticks</strong></td><td><strong>1 cup</strong></td><td><strong>16 tbsp</strong></td><td><strong>227 g</strong></td><td><strong>8.0 oz</strong></td></tr>
                    <tr><td>1½ cups</td><td>3 sticks</td><td>1½ cups</td><td>24 tbsp</td><td>340.5 g</td><td>12.0 oz</td></tr>
                    <tr><td><strong>2 cups (1 lb)</strong></td><td><strong>4 sticks</strong></td><td><strong>2 cups</strong></td><td><strong>32 tbsp</strong></td><td><strong>454 g</strong></td><td><strong>16.0 oz</strong></td></tr>
                </tbody>
            </table>

            <h3>Common Baking Recipes — Butter Amounts</h3>
            <table>
                <thead><tr><th>Recipe</th><th>Butter</th><th>Cups</th><th>Grams</th></tr></thead>
                <tbody>
                    <tr><td>Cookies (1 batch)</td><td>1–2 sticks</td><td>½–1 cup</td><td>113–227 g</td></tr>
                    <tr><td>Pie crust (single)</td><td>1 stick + 2 tbsp</td><td>~⅔ cup</td><td>142 g</td></tr>
                    <tr><td>Cake (9" layer)</td><td>1–2 sticks</td><td>½–1 cup</td><td>113–227 g</td></tr>
                    <tr><td>Buttercream frosting</td><td>2–3 sticks</td><td>1–1½ cups</td><td>227–340 g</td></tr>
                    <tr><td>Pound cake</td><td>2 sticks (1 lb total)</td><td>1 cup</td><td>227 g</td></tr>
                    <tr><td>Croissants (12)</td><td>5–6 sticks</td><td>2½–3 cups</td><td>567–681 g</td></tr>
                    <tr><td>Garlic bread</td><td>½ stick</td><td>¼ cup</td><td>57 g</td></tr>
                </tbody>
            </table>

            <h3>US vs. European Butter</h3>
            <table>
                <thead><tr><th>Feature</th><th>US Butter</th><th>European Butter</th></tr></thead>
                <tbody>
                    <tr><td><strong>Fat content</strong></td><td>80% minimum (USDA)</td><td>82–86%</td></tr>
                    <tr><td><strong>Water content</strong></td><td>~16%</td><td>~14%</td></tr>
                    <tr><td><strong>Sold as</strong></td><td>Sticks (4 oz/113g each)</td><td>Blocks (250g typical)</td></tr>
                    <tr><td><strong>1 cup weighs</strong></td><td>227 g</td><td>~227 g (same density)</td></tr>
                    <tr><td><strong>Effect on baking</strong></td><td>Standard results</td><td>Flakier pastries, richer flavor</td></tr>
                    <tr><td><strong>Common brands</strong></td><td>Land O'Lakes, Challenge</td><td>Kerrygold, Plugrá, Lurpak</td></tr>
                </tbody>
            </table>

            <h3>Butter Substitutes — Cup Equivalents</h3>
            <table>
                <thead><tr><th>Substitute</th><th>Use Instead Of</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td>Margarine</td><td>1:1 (1 cup = 1 cup)</td><td>Look for "baking margarine" with 80% fat</td></tr>
                    <tr><td>Coconut oil</td><td>1:1 (1 cup = 1 cup)</td><td>Solid at room temp; gives slight coconut flavor</td></tr>
                    <tr><td>Vegetable oil</td><td>¾ cup oil per 1 cup butter</td><td>Only for recipes where texture isn't critical</td></tr>
                    <tr><td>Applesauce</td><td>½ cup per 1 cup butter</td><td>Reduces fat; works in muffins and quick breads</td></tr>
                    <tr><td>Greek yogurt</td><td>½ cup per 1 cup butter</td><td>Adds moisture and protein</td></tr>
                </tbody>
            </table>

            <h3>What Is a Cup?</h3>
            <p>A <strong>US cup</strong> is a unit of volume equal to 8 fluid ounces or 236.6 mL. For butter, 1 cup = 2 sticks = 16 tablespoons = 227 grams. The cup measurement is unique to US recipes — most international recipes measure butter by weight (grams).</p>

            <h3>What Is a Gram?</h3>
            <p>A <strong>gram</strong> (g) is a metric unit of weight equal to 1/1,000 of a kilogram. Grams are the preferred unit for measuring butter in international recipes and by professional bakers because weight is more precise than volume.</p>
        `,
        faq: [
            { question: "How many grams is 1 cup of butter?", answer: "227 grams = 1 cup of butter = 2 sticks = 16 tablespoons = 8 ounces. This is the standard US measurement. A 1-pound box of butter (4 sticks) = 2 cups = 454 grams." },
            { question: "How many sticks of butter is 1 cup?", answer: "2 sticks = 1 cup. Each US butter stick is ½ cup (113.5g, 4 oz, 8 tbsp). The markings on the butter wrapper make it easy to measure tablespoons without extra tools." },
            { question: "Can I substitute margarine for butter in baking?", answer: "Yes, use a 1:1 ratio — but choose margarine with at least 80% fat content (labeled 'baking margarine'). Light or reduced-fat margarine has too much water and will change the texture. Butter gives better flavor and browning." },
            { question: "Why do US recipes use sticks instead of grams?", answer: "US butter is packaged in sticks with tablespoon markings, making it easy to measure without a scale. This tradition dates back to the early 1900s when standardized stick packaging was introduced. Most of the world uses grams because it's more precise." },
            { question: "How do I measure butter without a scale?", answer: "Use the stick markings: each stick has 8 tablespoon marks. For odd amounts, use the water displacement method: fill a measuring cup to the 1-cup line, then add butter until the water reaches the target. Example: for ⅓ cup butter, fill to 1 cup, add butter until it reads 1⅓ cups." },
            { question: "Is European butter the same weight per cup?", answer: "Yes, the weight per cup is approximately the same (~227g) because the density is similar. However, European butter has higher fat (82–86% vs US 80%) and less water. This means European butter produces flakier pastries and richer flavors, even though the cup-to-gram conversion is identical." },
        ],
    },
    "day-to-month-converter": {
        subtitle: "Convert days to months. See results in months, weeks, hours, and a year/month/day breakdown. Includes a quick reference table with common durations.",
        contentHTML: `
            <h3>How to Convert Days to Months</h3>
            <p>Divide the number of days by <strong>30.4375</strong> (the average number of days per month, calculated as 365.25 ÷ 12):</p>
            <div class="explanation__highlight">
                <strong>months = days ÷ 30.4375</strong><br/><br/>
                Example: 90 days<br/>
                = 90 ÷ 30.4375 = <strong>2.96 months (~3 months)</strong><br/><br/>
                Example: 365 days<br/>
                = 365 ÷ 30.4375 = <strong>11.99 months (~1 year)</strong><br/><br/>
                Example: 180 days<br/>
                = 180 ÷ 30.4375 = <strong>5.91 months (~6 months)</strong>
            </div>
            <p><strong>Note:</strong> Calendar months vary from 28 to 31 days. The 30.4375-day average accounts for this variation, including leap years.</p>

            <h3>Days to Months — Conversion Table</h3>
            <table>
                <thead><tr><th>Days</th><th>Months</th><th>Weeks</th><th>Common Reference</th></tr></thead>
                <tbody>
                    <tr><td>1 day</td><td>0.03 mo</td><td>0.1 wk</td><td>1 day</td></tr>
                    <tr><td>7 days</td><td>0.23 mo</td><td>1.0 wk</td><td>1 week</td></tr>
                    <tr><td>14 days</td><td>0.46 mo</td><td>2.0 wks</td><td>2 weeks</td></tr>
                    <tr><td>30 days</td><td>0.99 mo</td><td>4.3 wks</td><td>~1 month</td></tr>
                    <tr><td>60 days</td><td>1.97 mo</td><td>8.6 wks</td><td>~2 months</td></tr>
                    <tr><td><strong>90 days</strong></td><td><strong>2.96 mo</strong></td><td><strong>12.9 wks</strong></td><td><strong>~1 quarter</strong></td></tr>
                    <tr><td>120 days</td><td>3.94 mo</td><td>17.1 wks</td><td>~4 months</td></tr>
                    <tr><td><strong>180 days</strong></td><td><strong>5.91 mo</strong></td><td><strong>25.7 wks</strong></td><td><strong>~6 months (half year)</strong></td></tr>
                    <tr><td>270 days</td><td>8.87 mo</td><td>38.6 wks</td><td>~9 months</td></tr>
                    <tr><td><strong>365 days</strong></td><td><strong>11.99 mo</strong></td><td><strong>52.1 wks</strong></td><td><strong>~1 year</strong></td></tr>
                    <tr><td>548 days</td><td>18.00 mo</td><td>78.3 wks</td><td>~1.5 years</td></tr>
                    <tr><td><strong>730 days</strong></td><td><strong>23.98 mo</strong></td><td><strong>104.3 wks</strong></td><td><strong>~2 years</strong></td></tr>
                </tbody>
            </table>

            <h3>Days Per Month — Calendar Reference</h3>
            <table>
                <thead><tr><th>Month</th><th>Days</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td>January</td><td>31</td><td></td></tr>
                    <tr><td>February</td><td>28 or 29</td><td>29 in leap years (2024, 2028, 2032)</td></tr>
                    <tr><td>March</td><td>31</td><td></td></tr>
                    <tr><td>April</td><td>30</td><td></td></tr>
                    <tr><td>May</td><td>31</td><td></td></tr>
                    <tr><td>June</td><td>30</td><td></td></tr>
                    <tr><td>July</td><td>31</td><td></td></tr>
                    <tr><td>August</td><td>31</td><td></td></tr>
                    <tr><td>September</td><td>30</td><td></td></tr>
                    <tr><td>October</td><td>31</td><td></td></tr>
                    <tr><td>November</td><td>30</td><td></td></tr>
                    <tr><td>December</td><td>31</td><td></td></tr>
                    <tr><td><strong>Average</strong></td><td><strong>30.4375</strong></td><td>365.25 ÷ 12</td></tr>
                </tbody>
            </table>

            <h3>Common US Durations in Days</h3>
            <table>
                <thead><tr><th>Duration</th><th>Days</th><th>Months</th><th>Context</th></tr></thead>
                <tbody>
                    <tr><td>30-day notice</td><td>30</td><td>~1 mo</td><td>Landlord notice, credit card billing</td></tr>
                    <tr><td>60-day return window</td><td>60</td><td>~2 mo</td><td>Many electronics retailers</td></tr>
                    <tr><td>90-day probation</td><td>90</td><td>~3 mo</td><td>New job trial period</td></tr>
                    <tr><td>FMLA leave</td><td>84</td><td>~2.8 mo</td><td>Up to 12 weeks unpaid leave</td></tr>
                    <tr><td>180-day deployment</td><td>180</td><td>~6 mo</td><td>Military deployment</td></tr>
                    <tr><td>US passport processing</td><td>42–56</td><td>~1.5–1.8 mo</td><td>Routine processing time</td></tr>
                    <tr><td>Pregnancy</td><td>280</td><td>9.2 mo</td><td>40 weeks from last period</td></tr>
                    <tr><td>Car warranty</td><td>1,095</td><td>36 mo</td><td>Typical 3yr/36k miles</td></tr>
                    <tr><td>Statute of limitations</td><td>730–2,190</td><td>24–72 mo</td><td>Varies by state and claim type</td></tr>
                </tbody>
            </table>

            <h3>US Fiscal Quarters</h3>
            <table>
                <thead><tr><th>Quarter</th><th>Months</th><th>Days</th><th>Tax/Business Use</th></tr></thead>
                <tbody>
                    <tr><td>Q1</td><td>Jan–Mar</td><td>90 days (91 in leap year)</td><td>IRS quarterly estimated taxes due Apr 15</td></tr>
                    <tr><td>Q2</td><td>Apr–Jun</td><td>91 days</td><td>Due Jun 15</td></tr>
                    <tr><td>Q3</td><td>Jul–Sep</td><td>92 days</td><td>Due Sep 15</td></tr>
                    <tr><td>Q4</td><td>Oct–Dec</td><td>92 days</td><td>Due Jan 15 (next year)</td></tr>
                </tbody>
            </table>

            <h3>What Is a Day?</h3>
            <p>A <strong>day</strong> is a unit of time equal to 24 hours, 1,440 minutes, or 86,400 seconds. It corresponds to one full rotation of the Earth on its axis. In the US, a "business day" typically refers to Monday–Friday, excluding federal holidays.</p>

            <h3>What Is a Month?</h3>
            <p>A <strong>month</strong> is a unit of time based on the lunar cycle, averaging 30.4375 days (365.25 ÷ 12). Calendar months range from 28 to 31 days. In legal and financial contexts in the US, a "month" usually means a calendar month (e.g., January 15 to February 15), not exactly 30 or 30.44 days.</p>
        `,
        faq: [
            { question: "How many months is 90 days?", answer: "90 days = 2.96 months (approximately 3 months). This is commonly used as a business quarter (Q1 = Jan–Mar = 90 days). In legal contexts, '90 days' and '3 months' are often used interchangeably but may differ by 1–2 days depending on the calendar months." },
            { question: "How many days are in a month?", answer: "It varies: 28 days (February), 29 days (February in leap years), 30 days (April, June, September, November), or 31 days (January, March, May, July, August, October, December). The average is 30.4375 days." },
            { question: "Is 30 days the same as 1 month?", answer: "Not exactly — 30 days is only 0.99 months using the average. Calendar months range from 28–31 days. In legal and business contexts, '1 month' usually means 1 calendar month, which could be 28, 29, 30, or 31 days depending on which month it falls in." },
            { question: "How many months is a pregnancy?", answer: "A full-term pregnancy is 280 days (40 weeks) from the last menstrual period = 9.2 months. While we commonly say '9 months,' it's actually slightly longer. The three trimesters are: 1st (days 1–90), 2nd (days 91–180), 3rd (days 181–280)." },
            { question: "Why isn't there an exact days-to-months conversion?", answer: "Because calendar months have different lengths (28–31 days), there's no single conversion factor. The 30.4375 average (365.25 ÷ 12) accounts for all months and leap years. For precise date calculations, always use a calendar rather than a fixed conversion factor." },
            { question: "How many business days are in a month?", answer: "Approximately 21–23 business days (weekdays excluding federal holidays). The average US work month has about 21.7 business days. This varies by month — February has fewer, and months with federal holidays (like November with Thanksgiving) also have fewer." },
        ],
    },
    "cc-to-m3-converter": {
        subtitle: "Convert cubic centimeters to cubic meters (cm³ to m³). See results in cubic meters, liters, US gallons, and cubic feet. Includes a quick reference table.",
        contentHTML: `
            <h3>How to Convert Cubic Centimeters to Cubic Meters</h3>
            <p>There are <strong>1,000,000 cubic centimeters in 1 cubic meter</strong>. Divide by 1,000,000 (or multiply by 10⁻⁶):</p>
            <div class="explanation__highlight">
                <strong>m³ = cm³ ÷ 1,000,000</strong><br/><br/>
                Example: 1,000,000 cm³<br/>
                = 1,000,000 ÷ 1,000,000 = <strong>1.000 m³</strong><br/><br/>
                Example: 5,000 cm³ (a 5-liter engine)<br/>
                = 5,000 ÷ 1,000,000 = <strong>0.005 m³ (5 liters)</strong><br/><br/>
                Example: 100 cm³<br/>
                = 100 ÷ 1,000,000 = <strong>0.0001 m³ (0.1 liters)</strong>
            </div>
            <p><strong>Why 1,000,000?</strong> Because 1 meter = 100 cm, so 1 m³ = 100 × 100 × 100 = 1,000,000 cm³.</p>

            <h3>Volume Unit Comparison</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>= cm³</th><th>= m³</th><th>US Equivalent</th></tr></thead>
                <tbody>
                    <tr><td><strong>Cubic centimeter</strong></td><td>cm³ / cc</td><td>1</td><td>0.000001</td><td>0.061 in³</td></tr>
                    <tr><td>Milliliter</td><td>mL</td><td>1</td><td>0.000001</td><td>0.034 fl oz</td></tr>
                    <tr><td><strong>Liter</strong></td><td>L</td><td>1,000</td><td>0.001</td><td>0.264 gal</td></tr>
                    <tr><td>US gallon</td><td>gal</td><td>3,785</td><td>0.003785</td><td>1 gal</td></tr>
                    <tr><td>Cubic foot</td><td>ft³</td><td>28,317</td><td>0.02832</td><td>7.48 gal</td></tr>
                    <tr><td><strong>Cubic meter</strong></td><td>m³</td><td>1,000,000</td><td>1</td><td>264.2 gal / 35.3 ft³</td></tr>
                    <tr><td>Cubic yard</td><td>yd³</td><td>764,555</td><td>0.7646</td><td>202 gal</td></tr>
                </tbody>
            </table>

            <h3>Engine Displacement — CC to Liters</h3>
            <p>In automotive, engine size is measured in cubic centimeters (cc) or liters. Americans often use liters:</p>
            <table>
                <thead><tr><th>Engine</th><th>cc</th><th>Liters</th><th>m³</th><th>Common In</th></tr></thead>
                <tbody>
                    <tr><td>Motorcycle (small)</td><td>250 cc</td><td>0.25 L</td><td>0.00025</td><td>Honda CRF250</td></tr>
                    <tr><td>Motorcycle (sport)</td><td>600 cc</td><td>0.6 L</td><td>0.0006</td><td>Yamaha YZF-R6</td></tr>
                    <tr><td>Motorcycle (cruiser)</td><td>1,200 cc</td><td>1.2 L</td><td>0.0012</td><td>Harley Sportster</td></tr>
                    <tr><td>Economy car</td><td>1,500 cc</td><td>1.5 L</td><td>0.0015</td><td>Honda Civic</td></tr>
                    <tr><td>Midsize sedan</td><td>2,000 cc</td><td>2.0 L</td><td>0.002</td><td>Toyota Camry</td></tr>
                    <tr><td>V6 truck</td><td>3,500 cc</td><td>3.5 L</td><td>0.0035</td><td>Ford F-150 EcoBoost</td></tr>
                    <tr><td>V8 muscle car</td><td>5,000 cc</td><td>5.0 L</td><td>0.005</td><td>Ford Mustang GT</td></tr>
                    <tr><td>V8 truck</td><td>6,200 cc</td><td>6.2 L</td><td>0.0062</td><td>Chevy Silverado</td></tr>
                </tbody>
            </table>

            <h3>Common Volumes in Cubic Centimeters</h3>
            <table>
                <thead><tr><th>Object</th><th>cm³</th><th>Liters</th><th>m³</th></tr></thead>
                <tbody>
                    <tr><td>Sugar cube</td><td>~1 cm³</td><td>0.001</td><td>0.000001</td></tr>
                    <tr><td>Standard dice</td><td>~8 cm³</td><td>0.008</td><td>0.000008</td></tr>
                    <tr><td>Tennis ball</td><td>~143 cm³</td><td>0.143</td><td>0.000143</td></tr>
                    <tr><td>Soda can (12 oz)</td><td>~355 cm³</td><td>0.355</td><td>0.000355</td></tr>
                    <tr><td>Basketball</td><td>~7,100 cm³</td><td>7.1</td><td>0.0071</td></tr>
                    <tr><td>Bathtub (full)</td><td>~300,000 cm³</td><td>300</td><td>0.3</td></tr>
                    <tr><td>Average room (12×12×8 ft)</td><td>~32,600,000 cm³</td><td>32,600</td><td>32.6</td></tr>
                </tbody>
            </table>

            <h3>What Is a Cubic Centimeter?</h3>
            <p>A <strong>cubic centimeter</strong> (cm³ or cc) is a metric unit of volume equal to a cube measuring 1 cm × 1 cm × 1 cm. It is exactly equal to 1 milliliter (mL). In the US, "cc" is commonly used in medicine (dosing) and automotive (engine displacement).</p>

            <h3>What Is a Cubic Meter?</h3>
            <p>A <strong>cubic meter</strong> (m³) is the SI unit of volume equal to a cube measuring 1 m × 1 m × 1 m = 1,000 liters = 264.2 US gallons = 35.3 cubic feet. It is used in construction, HVAC, shipping, and scientific applications. In the US, cubic feet are more common for everyday use, but m³ appears in science and engineering specifications.</p>
        `,
        faq: [
            { question: "How many cubic centimeters are in 1 cubic meter?", answer: "Exactly 1,000,000 cm³ = 1 m³. This is because 1 meter = 100 centimeters, so 1 m³ = 100 × 100 × 100 = 1,000,000 cm³. Conversely, 1 cm³ = 0.000001 m³ (one millionth of a cubic meter)." },
            { question: "Is a cubic centimeter the same as a milliliter?", answer: "Yes, 1 cm³ = 1 mL exactly. They are interchangeable. In medicine, 'cc' is commonly used (e.g., '5 cc of medication'), while in cooking, 'mL' is more common. Both equal 1/1,000 of a liter." },
            { question: "What does CC mean for engines?", answer: "CC stands for cubic centimeters and measures engine displacement — the total volume swept by all pistons. A 2,000 cc engine = 2.0 liters. In the US, car engines are usually described in liters (a '5.0L V8'), while motorcycles use cc ('600cc sportbike')." },
            { question: "How do I convert cubic meters to cubic feet?", answer: "Multiply by 35.3147: ft³ = m³ × 35.3147. For example, 1 m³ = 35.3 ft³. Cubic feet are the standard volume unit in US construction and HVAC." },
            { question: "How big is 1 cubic meter in real life?", answer: "1 cubic meter is about the size of a large washing machine or a standard pallet of goods. It equals 1,000 liters (264 US gallons), which would fill about 13 standard bathtubs. A typical US bedroom (12×12×8 ft) has about 32.6 m³ of volume." },
            { question: "Why is the conversion factor 1 million?", answer: "Because volume scales cubically. When you convert 1 meter to centimeters (×100), the volume conversion is 100³ = 1,000,000. This is why small linear differences create enormous volume differences — doubling each dimension makes the volume 8× larger (2³ = 8)." },
        ],
    },
    "f-to-c-converter": {
        subtitle: "Convert Fahrenheit to Celsius (°F to °C). See results in Celsius, Kelvin, and Rankine. Includes a quick reference table with weather, body temp, and oven temperatures.",
        contentHTML: `
            <h3>How to Convert Fahrenheit to Celsius</h3>
            <p>Subtract 32 from the Fahrenheit temperature, then multiply by 5/9:</p>
            <div class="explanation__highlight">
                <strong>°C = (°F − 32) × 5/9</strong><br/><br/>
                Example: 72°F (room temperature)<br/>
                = (72 − 32) × 5/9 = 40 × 0.5556 = <strong>22.22°C</strong><br/><br/>
                Example: 98.6°F (body temperature)<br/>
                = (98.6 − 32) × 5/9 = 66.6 × 0.5556 = <strong>37.00°C</strong><br/><br/>
                Example: 350°F (oven for baking)<br/>
                = (350 − 32) × 5/9 = 318 × 0.5556 = <strong>176.67°C</strong>
            </div>
            <p><strong>Mental math shortcut:</strong> Subtract 30, then divide by 2. Example: 72°F → (72−30)/2 = 21°C (actual: 22.2°C). Close enough for everyday use!</p>

            <h3>Fahrenheit to Celsius — Conversion Chart</h3>
            <table>
                <thead><tr><th>°F</th><th>°C</th><th>Kelvin</th><th>What It Means</th></tr></thead>
                <tbody>
                    <tr><td><strong>-40°F</strong></td><td><strong>-40°C</strong></td><td>233.15 K</td><td>F = C crossover point</td></tr>
                    <tr><td>0°F</td><td>-17.8°C</td><td>255.4 K</td><td>Very cold winter day</td></tr>
                    <tr><td><strong>32°F</strong></td><td><strong>0°C</strong></td><td>273.15 K</td><td><strong>Water freezes</strong></td></tr>
                    <tr><td>50°F</td><td>10°C</td><td>283.2 K</td><td>Cool autumn day</td></tr>
                    <tr><td>68°F</td><td>20°C</td><td>293.2 K</td><td>Room temperature (low)</td></tr>
                    <tr><td><strong>72°F</strong></td><td><strong>22.2°C</strong></td><td>295.4 K</td><td><strong>Ideal room temperature</strong></td></tr>
                    <tr><td>77°F</td><td>25°C</td><td>298.2 K</td><td>Warm comfortable day</td></tr>
                    <tr><td><strong>98.6°F</strong></td><td><strong>37°C</strong></td><td>310.2 K</td><td><strong>Normal body temperature</strong></td></tr>
                    <tr><td>100°F</td><td>37.8°C</td><td>310.9 K</td><td>Hot summer day / low fever</td></tr>
                    <tr><td><strong>212°F</strong></td><td><strong>100°C</strong></td><td>373.15 K</td><td><strong>Water boils</strong></td></tr>
                    <tr><td>350°F</td><td>176.7°C</td><td>449.8 K</td><td>Oven: baking</td></tr>
                    <tr><td>400°F</td><td>204.4°C</td><td>477.6 K</td><td>Oven: roasting</td></tr>
                    <tr><td>450°F</td><td>232.2°C</td><td>505.4 K</td><td>Oven: pizza</td></tr>
                    <tr><td>500°F</td><td>260°C</td><td>533.2 K</td><td>Oven: maximum</td></tr>
                </tbody>
            </table>

            <h3>US Weather Temperature Guide</h3>
            <table>
                <thead><tr><th>°F Range</th><th>°C Range</th><th>Conditions</th><th>What to Wear</th></tr></thead>
                <tbody>
                    <tr><td>Below 0°F</td><td>Below -18°C</td><td>Dangerously cold</td><td>Full winter gear, limit exposure</td></tr>
                    <tr><td>0–20°F</td><td>-18 to -7°C</td><td>Bitter cold</td><td>Heavy coat, hat, gloves, layers</td></tr>
                    <tr><td>20–32°F</td><td>-7 to 0°C</td><td>Freezing</td><td>Winter coat, potentially snow</td></tr>
                    <tr><td>32–50°F</td><td>0 to 10°C</td><td>Cold</td><td>Jacket, long sleeves</td></tr>
                    <tr><td>50–65°F</td><td>10 to 18°C</td><td>Cool</td><td>Light jacket or sweater</td></tr>
                    <tr><td>65–75°F</td><td>18 to 24°C</td><td>Comfortable</td><td>T-shirt, light layers</td></tr>
                    <tr><td>75–85°F</td><td>24 to 29°C</td><td>Warm</td><td>Shorts, t-shirt, sunscreen</td></tr>
                    <tr><td>85–100°F</td><td>29 to 38°C</td><td>Hot</td><td>Light clothing, stay hydrated</td></tr>
                    <tr><td>Above 100°F</td><td>Above 38°C</td><td>Dangerous heat</td><td>Stay indoors, AC, water</td></tr>
                </tbody>
            </table>

            <h3>US Oven Temperatures</h3>
            <table>
                <thead><tr><th>Setting</th><th>°F</th><th>°C</th><th>Used For</th></tr></thead>
                <tbody>
                    <tr><td>Warm</td><td>200°F</td><td>93°C</td><td>Keeping food warm</td></tr>
                    <tr><td>Low</td><td>250°F</td><td>121°C</td><td>Slow cooking, dehydrating</td></tr>
                    <tr><td>Moderate</td><td>325–350°F</td><td>163–177°C</td><td>Cakes, cookies, casseroles</td></tr>
                    <tr><td>Hot</td><td>375–400°F</td><td>191–204°C</td><td>Roasting chicken, pastries</td></tr>
                    <tr><td>Very hot</td><td>425–450°F</td><td>218–232°C</td><td>Pizza, bread, searing</td></tr>
                    <tr><td>Broil</td><td>500–550°F</td><td>260–288°C</td><td>Broiling, charring</td></tr>
                </tbody>
            </table>

            <h3>Body Temperature Guide</h3>
            <table>
                <thead><tr><th>Reading</th><th>°F</th><th>°C</th><th>Meaning</th></tr></thead>
                <tbody>
                    <tr><td>Hypothermia</td><td>Below 95°F</td><td>Below 35°C</td><td>⚠️ Seek medical attention</td></tr>
                    <tr><td>Normal (low)</td><td>97.0°F</td><td>36.1°C</td><td>Healthy range</td></tr>
                    <tr><td><strong>Normal (average)</strong></td><td><strong>98.6°F</strong></td><td><strong>37.0°C</strong></td><td>Standard body temp</td></tr>
                    <tr><td>Low-grade fever</td><td>99.1–100.4°F</td><td>37.3–38°C</td><td>Monitor, rest</td></tr>
                    <tr><td>Fever</td><td>100.4–103°F</td><td>38–39.4°C</td><td>Contact doctor if persistent</td></tr>
                    <tr><td>High fever</td><td>Above 103°F</td><td>Above 39.4°C</td><td>⚠️ Seek immediate medical care</td></tr>
                </tbody>
            </table>

            <h3>What Is Fahrenheit?</h3>
            <p><strong>Fahrenheit</strong> (°F) is a temperature scale developed by Daniel Gabriel Fahrenheit in 1724. Water freezes at 32°F and boils at 212°F (a 180-degree range). The US, Bahamas, Cayman Islands, Palau, and the Federated States of Micronesia are the only countries that primarily use Fahrenheit.</p>

            <h3>What Is Celsius?</h3>
            <p><strong>Celsius</strong> (°C), also called centigrade, is a temperature scale based on water: 0°C = freezing point, 100°C = boiling point. It is the standard temperature scale used by every country except the US and a handful of territories. All scientific work worldwide uses Celsius (or Kelvin).</p>
        `,
        faq: [
            { question: "What is the formula to convert Fahrenheit to Celsius?", answer: "°C = (°F − 32) × 5/9. Subtract 32 from the Fahrenheit temperature, then multiply by 5/9 (or divide by 1.8). Example: 72°F = (72 − 32) × 5/9 = 22.22°C. For a quick mental estimate: subtract 30, divide by 2." },
            { question: "What is 72°F in Celsius?", answer: "72°F = 22.22°C. This is considered the ideal indoor room temperature in the US. Most US thermostats are set between 68–72°F (20–22°C)." },
            { question: "At what temperature are Fahrenheit and Celsius equal?", answer: "Fahrenheit and Celsius are equal at -40 degrees. That is, -40°F = -40°C. This is the only temperature where both scales read the same number." },
            { question: "Why does the US use Fahrenheit?", answer: "The US adopted Fahrenheit before Celsius was widely standardized. While Congress authorized the metric system in 1866 and the Metric Conversion Act of 1975 encouraged a switch, adoption was voluntary and never took hold. Today, Americans learn Fahrenheit from birth and have an intuitive sense of what 72°F or 90°F 'feels like.'" },
            { question: "What is normal body temperature in Fahrenheit and Celsius?", answer: "Normal body temperature is 98.6°F (37.0°C), though individual variation is normal (97.0–99.0°F / 36.1–37.2°C). A fever is generally defined as 100.4°F (38.0°C) or higher. Modern research suggests average body temperature has dropped slightly to around 97.9°F (36.6°C)." },
            { question: "How do I convert oven temperatures from Fahrenheit to Celsius?", answer: "Use the formula °C = (°F − 32) × 5/9. Common conversions: 350°F = 177°C (baking), 375°F = 191°C (general cooking), 400°F = 204°C (roasting), 425°F = 218°C (high heat), 450°F = 232°C (pizza). Most European recipes use Celsius, so American bakers converting international recipes need this frequently." },
        ],
    },
    "c-to-f-converter": {
        subtitle: "Convert Celsius to Fahrenheit (°C to °F). See results in Fahrenheit, Kelvin, and Rankine. Includes a quick reference table with weather, body temp, and oven temperatures.",
        contentHTML: `
            <h3>How to Convert Celsius to Fahrenheit</h3>
            <p>Multiply the Celsius temperature by 9/5 (or 1.8), then add 32:</p>
            <div class="explanation__highlight">
                <strong>°F = (°C × 9/5) + 32</strong><br/><br/>
                Example: 22°C (room temperature)<br/>
                = (22 × 1.8) + 32 = 39.6 + 32 = <strong>71.6°F</strong><br/><br/>
                Example: 37°C (body temperature)<br/>
                = (37 × 1.8) + 32 = 66.6 + 32 = <strong>98.6°F</strong><br/><br/>
                Example: 180°C (oven for baking)<br/>
                = (180 × 1.8) + 32 = 324 + 32 = <strong>356°F</strong>
            </div>
            <p><strong>Mental math shortcut:</strong> Double it and add 30. Example: 22°C → (22 × 2) + 30 = 74°F (actual: 71.6°F). Good enough for a quick estimate!</p>

            <h3>Celsius to Fahrenheit — Conversion Chart</h3>
            <table>
                <thead><tr><th>°C</th><th>°F</th><th>Kelvin</th><th>What It Means</th></tr></thead>
                <tbody>
                    <tr><td><strong>-40°C</strong></td><td><strong>-40°F</strong></td><td>233.15 K</td><td>F = C crossover point</td></tr>
                    <tr><td>-18°C</td><td>0°F</td><td>255.2 K</td><td>0°F equivalent</td></tr>
                    <tr><td><strong>0°C</strong></td><td><strong>32°F</strong></td><td>273.15 K</td><td><strong>Water freezes</strong></td></tr>
                    <tr><td>10°C</td><td>50°F</td><td>283.15 K</td><td>Cool autumn day</td></tr>
                    <tr><td>20°C</td><td>68°F</td><td>293.15 K</td><td>Room temperature (low)</td></tr>
                    <tr><td><strong>22°C</strong></td><td><strong>71.6°F</strong></td><td>295.15 K</td><td><strong>Ideal room temperature</strong></td></tr>
                    <tr><td>25°C</td><td>77°F</td><td>298.15 K</td><td>Warm comfortable day</td></tr>
                    <tr><td>30°C</td><td>86°F</td><td>303.15 K</td><td>Hot summer day</td></tr>
                    <tr><td><strong>37°C</strong></td><td><strong>98.6°F</strong></td><td>310.15 K</td><td><strong>Normal body temperature</strong></td></tr>
                    <tr><td>38°C</td><td>100.4°F</td><td>311.15 K</td><td>Fever threshold</td></tr>
                    <tr><td><strong>100°C</strong></td><td><strong>212°F</strong></td><td>373.15 K</td><td><strong>Water boils</strong></td></tr>
                    <tr><td>180°C</td><td>356°F</td><td>453.15 K</td><td>Oven: baking</td></tr>
                    <tr><td>200°C</td><td>392°F</td><td>473.15 K</td><td>Oven: roasting</td></tr>
                    <tr><td>230°C</td><td>446°F</td><td>503.15 K</td><td>Oven: pizza</td></tr>
                </tbody>
            </table>

            <h3>International Travel — Temperature Reference for Americans</h3>
            <p>When you see Celsius on a weather app abroad, here's what it means in Fahrenheit:</p>
            <table>
                <thead><tr><th>°C Forecast</th><th>°F</th><th>What It Feels Like</th><th>Pack This</th></tr></thead>
                <tbody>
                    <tr><td>-10°C</td><td>14°F</td><td>Bitter cold</td><td>Heavy coat, thermals, hat</td></tr>
                    <tr><td>0°C</td><td>32°F</td><td>Freezing</td><td>Winter coat, gloves, scarf</td></tr>
                    <tr><td>10°C</td><td>50°F</td><td>Chilly</td><td>Jacket, long pants</td></tr>
                    <tr><td>15°C</td><td>59°F</td><td>Cool/mild</td><td>Light jacket, layers</td></tr>
                    <tr><td>20°C</td><td>68°F</td><td>Comfortable</td><td>T-shirt, light layers</td></tr>
                    <tr><td>25°C</td><td>77°F</td><td>Warm</td><td>Shorts, sunglasses</td></tr>
                    <tr><td>30°C</td><td>86°F</td><td>Hot</td><td>Light clothing, sunscreen</td></tr>
                    <tr><td>35°C</td><td>95°F</td><td>Very hot</td><td>Stay hydrated, seek shade</td></tr>
                    <tr><td>40°C</td><td>104°F</td><td>Extreme heat</td><td>Stay indoors, AC essential</td></tr>
                </tbody>
            </table>

            <h3>Cooking Conversion — European Recipes for US Ovens</h3>
            <table>
                <thead><tr><th>European Recipe</th><th>°C</th><th>US Oven (°F)</th><th>Gas Mark</th></tr></thead>
                <tbody>
                    <tr><td>Low / slow cook</td><td>120°C</td><td>250°F</td><td>½</td></tr>
                    <tr><td>Moderate low</td><td>150°C</td><td>300°F</td><td>2</td></tr>
                    <tr><td>Moderate</td><td>170–180°C</td><td>340–350°F</td><td>4</td></tr>
                    <tr><td>Moderately hot</td><td>190–200°C</td><td>375–400°F</td><td>5–6</td></tr>
                    <tr><td>Hot</td><td>210–220°C</td><td>410–425°F</td><td>7</td></tr>
                    <tr><td>Very hot</td><td>230–240°C</td><td>450–475°F</td><td>8–9</td></tr>
                </tbody>
            </table>

            <h3>Temperature Scale Comparison</h3>
            <table>
                <thead><tr><th>Scale</th><th>Freezing Point</th><th>Boiling Point</th><th>Absolute Zero</th><th>Used By</th></tr></thead>
                <tbody>
                    <tr><td><strong>Fahrenheit (°F)</strong></td><td>32°F</td><td>212°F</td><td>-459.67°F</td><td>USA, a few territories</td></tr>
                    <tr><td><strong>Celsius (°C)</strong></td><td>0°C</td><td>100°C</td><td>-273.15°C</td><td>Rest of the world</td></tr>
                    <tr><td>Kelvin (K)</td><td>273.15 K</td><td>373.15 K</td><td>0 K</td><td>Science worldwide</td></tr>
                    <tr><td>Rankine (°R)</td><td>491.67°R</td><td>671.67°R</td><td>0°R</td><td>US engineering (rare)</td></tr>
                </tbody>
            </table>

            <h3>What Is Celsius?</h3>
            <p><strong>Celsius</strong> (°C), formerly called centigrade, is the world's most widely used temperature scale. It was designed by Anders Celsius in 1742 with 0°C as the freezing point and 100°C as the boiling point of water — a clean, logical 100-degree range. Every country except the US and a few territories uses Celsius for weather, cooking, and everyday temperature.</p>

            <h3>What Is Fahrenheit?</h3>
            <p><strong>Fahrenheit</strong> (°F) was developed by Daniel Gabriel Fahrenheit in 1724. Water freezes at 32°F and boils at 212°F. While less intuitive than Celsius, Fahrenheit provides finer granularity per degree — the 180-degree range (32–212) vs. 100-degree range (0–100) means each °F is a smaller change than each °C, which some argue makes it better for describing weather.</p>
        `,
        faq: [
            { question: "What is the formula to convert Celsius to Fahrenheit?", answer: "°F = (°C × 9/5) + 32, or equivalently °F = (°C × 1.8) + 32. Example: 25°C = (25 × 1.8) + 32 = 77°F. For a quick mental estimate: double the Celsius and add 30." },
            { question: "What is 0°C in Fahrenheit?", answer: "0°C = 32°F. This is the freezing point of water. It's the most important temperature to remember when converting — water freezes at 0°C/32°F and boils at 100°C/212°F." },
            { question: "What is 37°C in Fahrenheit?", answer: "37°C = 98.6°F. This is normal human body temperature. When traveling internationally, if a doctor says your temperature is 37°C, that's perfectly normal. A fever is typically 38°C (100.4°F) or higher." },
            { question: "How do I convert European oven temperatures to Fahrenheit?", answer: "Multiply by 1.8 and add 32: 150°C = 300°F, 170°C = 340°F, 180°C = 356°F (round to 350°F), 190°C = 375°F, 200°C = 392°F (round to 400°F), 220°C = 428°F (round to 425°F). When converting recipes, round to the nearest 25°F that your US oven supports." },
            { question: "Why does Celsius make more sense for science?", answer: "Celsius is based on water's phase transitions (0° = freezing, 100° = boiling), making it intuitive for chemistry and physics. It also directly relates to Kelvin (K = °C + 273.15), the SI standard. Fahrenheit's reference points (32° and 212°) are less convenient for calculations." },
            { question: "Is Fahrenheit better for weather than Celsius?", answer: "It's subjective. Fahrenheit covers 0–100°F as a practical range for most US weather (very cold to very hot). Celsius users argue 0–40°C is equally practical. Each °F is a smaller increment (0.56°C), technically offering finer resolution without decimals — but in practice, both scales work fine." },
        ],
    },
    "f-to-k-converter": {
        subtitle: "Convert Fahrenheit to Kelvin (°F to K). See results in Kelvin, Celsius, and Rankine. Includes a quick reference table from absolute zero to oven temperatures.",
        contentHTML: `
            <h3>How to Convert Fahrenheit to Kelvin</h3>
            <p>First convert to Celsius, then add 273.15:</p>
            <div class="explanation__highlight">
                <strong>K = (°F − 32) × 5/9 + 273.15</strong><br/><br/>
                Example: 72°F (room temperature)<br/>
                = (72 − 32) × 5/9 + 273.15 = 22.22 + 273.15 = <strong>295.37 K</strong><br/><br/>
                Example: 32°F (water freezes)<br/>
                = (32 − 32) × 5/9 + 273.15 = 0 + 273.15 = <strong>273.15 K</strong><br/><br/>
                Example: -459.67°F (absolute zero)<br/>
                = (-459.67 − 32) × 5/9 + 273.15 = -273.15 + 273.15 = <strong>0 K</strong>
            </div>

            <h3>Fahrenheit to Kelvin — Conversion Chart</h3>
            <table>
                <thead><tr><th>°F</th><th>K</th><th>°C</th><th>Significance</th></tr></thead>
                <tbody>
                    <tr><td><strong>-459.67°F</strong></td><td><strong>0 K</strong></td><td>-273.15°C</td><td><strong>Absolute zero</strong></td></tr>
                    <tr><td>-40°F</td><td>233.15 K</td><td>-40°C</td><td>F = C crossover</td></tr>
                    <tr><td>0°F</td><td>255.37 K</td><td>-17.78°C</td><td>Very cold winter day</td></tr>
                    <tr><td><strong>32°F</strong></td><td><strong>273.15 K</strong></td><td>0°C</td><td><strong>Water freezes</strong></td></tr>
                    <tr><td>68°F</td><td>293.15 K</td><td>20°C</td><td>Room temperature</td></tr>
                    <tr><td><strong>98.6°F</strong></td><td><strong>310.15 K</strong></td><td>37°C</td><td><strong>Body temperature</strong></td></tr>
                    <tr><td><strong>212°F</strong></td><td><strong>373.15 K</strong></td><td>100°C</td><td><strong>Water boils</strong></td></tr>
                    <tr><td>450°F</td><td>505.37 K</td><td>232.2°C</td><td>Oven: pizza</td></tr>
                    <tr><td>1000°F</td><td>810.93 K</td><td>537.8°C</td><td>Red-hot metal</td></tr>
                </tbody>
            </table>

            <h3>What Is Absolute Zero?</h3>
            <p><strong>Absolute zero</strong> (0 K = -459.67°F = -273.15°C) is the lowest possible temperature. At absolute zero, molecular motion theoretically stops completely. The Third Law of Thermodynamics states that reaching exactly 0 K is physically impossible, though scientists have cooled materials to within billionths of a degree.</p>
            <p>For Americans, -459.67°F is hard to visualize — it's 460 degrees below zero Fahrenheit, or about 500°F colder than the coldest temperature ever recorded on Earth (-128.6°F in Antarctica).</p>

            <h3>Notable Temperatures in Science</h3>
            <table>
                <thead><tr><th>Event</th><th>K</th><th>°F</th><th>°C</th></tr></thead>
                <tbody>
                    <tr><td>Absolute zero</td><td>0 K</td><td>-459.67°F</td><td>-273.15°C</td></tr>
                    <tr><td>Liquid nitrogen boils</td><td>77 K</td><td>-320.4°F</td><td>-196°C</td></tr>
                    <tr><td>Dry ice sublimes</td><td>195 K</td><td>-109.3°F</td><td>-78.5°C</td></tr>
                    <tr><td>Water's triple point</td><td>273.16 K</td><td>32.02°F</td><td>0.01°C</td></tr>
                    <tr><td>Human body</td><td>310.15 K</td><td>98.6°F</td><td>37°C</td></tr>
                    <tr><td>Water boils</td><td>373.15 K</td><td>212°F</td><td>100°C</td></tr>
                    <tr><td>Iron melts</td><td>1811 K</td><td>2800°F</td><td>1538°C</td></tr>
                    <tr><td>Sun's surface</td><td>5778 K</td><td>9941°F</td><td>5505°C</td></tr>
                </tbody>
            </table>

            <h3>Where Americans Encounter Kelvin</h3>
            <table>
                <thead><tr><th>Context</th><th>Kelvin Value</th><th>What It Means</th></tr></thead>
                <tbody>
                    <tr><td>Light bulb packaging</td><td>2700K – 6500K</td><td>Color temperature: warm (2700K) to daylight (6500K)</td></tr>
                    <tr><td>Photography / video</td><td>3200K – 5600K</td><td>White balance: tungsten (3200K) to daylight (5600K)</td></tr>
                    <tr><td>LED smart bulbs</td><td>2000K – 6500K</td><td>Adjustable color temperature range</td></tr>
                    <tr><td>Science class (AP/college)</td><td>Various</td><td>Gas laws (PV = nRT), thermodynamics</td></tr>
                    <tr><td>Weather science</td><td>Various</td><td>Blackbody radiation, atmospheric science</td></tr>
                </tbody>
            </table>

            <h3>What Is Fahrenheit?</h3>
            <p><strong>Fahrenheit</strong> (°F) is a temperature scale used primarily in the United States. Water freezes at 32°F and boils at 212°F. It was developed by Daniel Gabriel Fahrenheit in 1724.</p>

            <h3>What Is Kelvin?</h3>
            <p><strong>Kelvin</strong> (K) is the SI base unit of temperature used in science worldwide. It starts at absolute zero (0 K) — the coldest possible temperature. Each kelvin is the same size as one degree Celsius, but the scale starts at absolute zero instead of water's freezing point. Note: Kelvin uses no degree symbol — it's "295 K" not "295°K".</p>
        `,
        faq: [
            { question: "What is the formula to convert Fahrenheit to Kelvin?", answer: "K = (°F − 32) × 5/9 + 273.15. This is a two-step process: first convert to Celsius by subtracting 32 and multiplying by 5/9, then add 273.15 to convert Celsius to Kelvin. Example: 72°F = (72 − 32) × 5/9 + 273.15 = 295.37 K." },
            { question: "What is absolute zero in Fahrenheit?", answer: "Absolute zero = 0 K = -459.67°F = -273.15°C. It's the coldest possible temperature, where molecular motion theoretically stops. No temperature below 0 K can exist in physics." },
            { question: "Why is Kelvin used in science instead of Fahrenheit?", answer: "Kelvin starts at absolute zero (0 K), making it ideal for scientific calculations. Gas laws (PV = nRT) require an absolute temperature scale. Kelvin also has no negative values, which simplifies thermodynamic calculations. The size of each kelvin equals one degree Celsius." },
            { question: "Why doesn't Kelvin use a degree symbol?", answer: "The kelvin was redefined in 1967 as a base SI unit, not a 'degree.' It's written as '295 K' (no degree symbol), just like other SI units such as meters (m) or kilograms (kg). This was done to distinguish it from relative temperature scales (°F, °C) since Kelvin is an absolute scale." },
            { question: "Where do Americans use Kelvin in everyday life?", answer: "The most common place is light bulb packaging — color temperature is measured in Kelvin (2700K = warm white, 5000K = daylight). Photographers also use Kelvin for white balance settings. US science students encounter Kelvin in chemistry (gas laws), physics (thermodynamics), and astronomy." },
            { question: "What is room temperature in Kelvin?", answer: "Room temperature (72°F / 22°C) = approximately 295 K. In science, 'standard temperature' is defined as 273.15 K (0°C / 32°F), while 'room temperature' in lab settings is typically 293–298 K (68–77°F / 20–25°C)." },
        ],
    },
    "c-to-k-converter": {
        subtitle: "Convert Celsius to Kelvin (°C to K). The simplest temperature conversion: just add 273.15. See results in Kelvin, Fahrenheit, and Rankine.",
        contentHTML: `
            <h3>How to Convert Celsius to Kelvin</h3>
            <p>This is the simplest temperature conversion — just <strong>add 273.15</strong>:</p>
            <div class="explanation__highlight">
                <strong>K = °C + 273.15</strong><br/><br/>
                Example: 0°C (water freezes)<br/>
                = 0 + 273.15 = <strong>273.15 K</strong><br/><br/>
                Example: 22°C (room temperature)<br/>
                = 22 + 273.15 = <strong>295.15 K</strong><br/><br/>
                Example: 100°C (water boils)<br/>
                = 100 + 273.15 = <strong>373.15 K</strong>
            </div>
            <p><strong>Why is it so simple?</strong> Because Celsius and Kelvin use the same degree size — a 1°C change equals a 1 K change. The only difference is the starting point: Kelvin starts at absolute zero (-273.15°C) instead of water's freezing point.</p>

            <h3>Celsius to Kelvin — Conversion Chart</h3>
            <table>
                <thead><tr><th>°C</th><th>K</th><th>°F</th><th>Significance</th></tr></thead>
                <tbody>
                    <tr><td><strong>-273.15°C</strong></td><td><strong>0 K</strong></td><td>-459.67°F</td><td><strong>Absolute zero</strong></td></tr>
                    <tr><td>-196°C</td><td>77.15 K</td><td>-320.8°F</td><td>Liquid nitrogen boils</td></tr>
                    <tr><td>-78.5°C</td><td>194.65 K</td><td>-109.3°F</td><td>Dry ice sublimes</td></tr>
                    <tr><td>-40°C</td><td>233.15 K</td><td>-40°F</td><td>°F = °C crossover</td></tr>
                    <tr><td><strong>0°C</strong></td><td><strong>273.15 K</strong></td><td>32°F</td><td><strong>Water freezes</strong></td></tr>
                    <tr><td>20°C</td><td>293.15 K</td><td>68°F</td><td>Room temperature</td></tr>
                    <tr><td><strong>37°C</strong></td><td><strong>310.15 K</strong></td><td>98.6°F</td><td><strong>Body temperature</strong></td></tr>
                    <tr><td><strong>100°C</strong></td><td><strong>373.15 K</strong></td><td>212°F</td><td><strong>Water boils</strong></td></tr>
                    <tr><td>1538°C</td><td>1811.15 K</td><td>2800°F</td><td>Iron melts</td></tr>
                    <tr><td>5505°C</td><td>5778.15 K</td><td>9941°F</td><td>Sun's surface</td></tr>
                </tbody>
            </table>

            <h3>Why 273.15?</h3>
            <p>In 1848, Lord Kelvin (William Thomson) proposed an absolute temperature scale starting at the point where molecular motion theoretically ceases. Through experiments with gas expansion, scientists determined that this "absolute zero" occurs at <strong>-273.15°C</strong>. Adding 273.15 to any Celsius temperature shifts the scale so that 0 represents absolute zero — the coldest possible temperature in the universe.</p>

            <h3>Why Does Science Use Kelvin?</h3>
            <table>
                <thead><tr><th>Reason</th><th>Explanation</th><th>Example</th></tr></thead>
                <tbody>
                    <tr><td><strong>No negative values</strong></td><td>Temperature is always ≥ 0 K</td><td>Simplifies thermodynamic equations</td></tr>
                    <tr><td><strong>Absolute scale</strong></td><td>0 K = actual zero energy</td><td>Required for gas laws (PV = nRT)</td></tr>
                    <tr><td><strong>Proportional</strong></td><td>Doubling K = doubling thermal energy</td><td>200 K has exactly 2× the energy of 100 K</td></tr>
                    <tr><td><strong>SI standard</strong></td><td>International System base unit</td><td>Used in all scientific publications</td></tr>
                    <tr><td><strong>Same degree size</strong></td><td>1 K = 1°C change</td><td>Easy to convert: just add 273.15</td></tr>
                </tbody>
            </table>

            <h3>US Courses That Use Kelvin</h3>
            <table>
                <thead><tr><th>Course</th><th>Level</th><th>Kelvin Used For</th></tr></thead>
                <tbody>
                    <tr><td>AP Chemistry</td><td>High school</td><td>Gas laws, thermochemistry, equilibrium</td></tr>
                    <tr><td>AP Physics</td><td>High school</td><td>Thermodynamics, thermal radiation</td></tr>
                    <tr><td>General Chemistry</td><td>College</td><td>Ideal gas law (PV = nRT), calorimetry</td></tr>
                    <tr><td>Organic Chemistry</td><td>College</td><td>Reaction kinetics, Arrhenius equation</td></tr>
                    <tr><td>Physics I & II</td><td>College</td><td>Heat transfer, entropy, blackbody radiation</td></tr>
                    <tr><td>Astronomy</td><td>College</td><td>Star temperatures, cosmic microwave background</td></tr>
                    <tr><td>Engineering Thermo</td><td>College</td><td>Carnot efficiency, Rankine cycle</td></tr>
                </tbody>
            </table>

            <h3>Cosmic Temperature Scale</h3>
            <table>
                <thead><tr><th>Object / Event</th><th>K</th><th>°C</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td>Cosmic microwave background</td><td>2.725 K</td><td>-270.4°C</td><td>Coldest natural temperature</td></tr>
                    <tr><td>Outer space (average)</td><td>~3 K</td><td>-270°C</td><td>Near absolute zero</td></tr>
                    <tr><td>Pluto's surface</td><td>~44 K</td><td>-229°C</td><td>Distant dwarf planet</td></tr>
                    <tr><td>Mars (average)</td><td>~210 K</td><td>-63°C</td><td>Red planet</td></tr>
                    <tr><td>Earth (average)</td><td>~288 K</td><td>15°C</td><td>Our planet</td></tr>
                    <tr><td>Venus (surface)</td><td>~737 K</td><td>464°C</td><td>Hottest planet</td></tr>
                    <tr><td>Sun's surface</td><td>5,778 K</td><td>5,505°C</td><td>Yellow dwarf star</td></tr>
                    <tr><td>Sun's core</td><td>~15,000,000 K</td><td>~15,000,000°C</td><td>Nuclear fusion</td></tr>
                </tbody>
            </table>

            <h3>What Is Celsius?</h3>
            <p><strong>Celsius</strong> (°C) is a temperature scale where 0°C = water's freezing point and 100°C = water's boiling point (at standard pressure). It is used by virtually every country in the world for everyday temperature, and in science when an absolute scale isn't required.</p>

            <h3>What Is Kelvin?</h3>
            <p><strong>Kelvin</strong> (K) is the SI base unit of temperature. It starts at absolute zero (0 K = -273.15°C), the coldest possible temperature. Each kelvin equals one degree Celsius in size. Kelvin is used in science, engineering, and astronomy worldwide. Remember: no degree symbol — write "295 K" not "295°K".</p>
        `,
        faq: [
            { question: "How do you convert Celsius to Kelvin?", answer: "Simply add 273.15: K = °C + 273.15. For example, 25°C = 25 + 273.15 = 298.15 K. This is the simplest temperature conversion because both scales use the same degree size — they only differ in their starting point." },
            { question: "Why do you add 273.15 to convert Celsius to Kelvin?", answer: "Because absolute zero (the coldest possible temperature) occurs at -273.15°C. Adding 273.15 shifts the scale so that 0 represents absolute zero. This value was determined experimentally by measuring how gases contract as they cool — all gases would theoretically reach zero volume at -273.15°C." },
            { question: "Is a degree Celsius the same size as a kelvin?", answer: "Yes, exactly. A change of 1°C equals a change of 1 K. The only difference is the zero point: 0°C = water freezes (273.15 K), while 0 K = absolute zero (-273.15°C). This is why the conversion is just adding a constant." },
            { question: "What is 0°C in Kelvin?", answer: "0°C = 273.15 K. This is water's freezing point at standard atmospheric pressure. It's one of the most important reference points in temperature conversion." },
            { question: "Can you have negative Kelvin?", answer: "No — 0 K (absolute zero) is the lowest possible temperature. Negative Kelvin values are physically impossible because Kelvin measures absolute thermal energy. This is one reason science uses Kelvin: it prevents meaningless negative values in thermodynamic equations." },
            { question: "When do US students need Celsius to Kelvin conversion?", answer: "Most commonly in AP Chemistry and AP Physics (high school), and in college-level General Chemistry, Organic Chemistry, and Physics courses. The ideal gas law (PV = nRT) requires temperature in Kelvin. It's also used in astronomy, engineering thermodynamics, and materials science." },
        ],
    },
    "mph-to-kmh-converter": {
        subtitle: "Convert miles per hour to kilometers per hour (mph to km/h). See results in km/h, m/s, ft/s, and knots. Includes US speed limits and sports speeds.",
        contentHTML: `
            <h3>How to Convert MPH to KM/H</h3>
            <p>Multiply by <strong>1.60934</strong> (since 1 mile = 1.60934 kilometers):</p>
            <div class="explanation__highlight">
                <strong>km/h = mph × 1.60934</strong><br/><br/>
                Example: 60 mph (US highway)<br/>
                = 60 × 1.60934 = <strong>96.56 km/h</strong><br/><br/>
                Example: 70 mph (interstate)<br/>
                = 70 × 1.60934 = <strong>112.65 km/h</strong><br/><br/>
                Example: 100 mph (NASCAR)<br/>
                = 100 × 1.60934 = <strong>160.93 km/h</strong>
            </div>
            <p><strong>Quick estimate:</strong> Multiply by 1.6 for a fast approximation. 60 mph × 1.6 = 96 km/h (actual: 96.56).</p>

            <h3>US Speed Limits — MPH to KM/H</h3>
            <table>
                <thead><tr><th>Zone</th><th>mph</th><th>km/h</th><th>Where</th></tr></thead>
                <tbody>
                    <tr><td>Parking lot</td><td>5 mph</td><td>8 km/h</td><td>Malls, garages</td></tr>
                    <tr><td>School zone</td><td>15–20 mph</td><td>24–32 km/h</td><td>Near schools (during hours)</td></tr>
                    <tr><td>Residential</td><td>25 mph</td><td>40 km/h</td><td>Neighborhoods</td></tr>
                    <tr><td>City street</td><td>30–35 mph</td><td>48–56 km/h</td><td>Urban areas</td></tr>
                    <tr><td>Suburban road</td><td>40–45 mph</td><td>64–72 km/h</td><td>Arterial roads</td></tr>
                    <tr><td>Rural highway</td><td>55 mph</td><td>89 km/h</td><td>Two-lane roads</td></tr>
                    <tr><td>US highway</td><td>55–60 mph</td><td>89–97 km/h</td><td>Non-interstate highways</td></tr>
                    <tr><td>Interstate (urban)</td><td>55–65 mph</td><td>89–105 km/h</td><td>Cities like NYC, LA</td></tr>
                    <tr><td>Interstate (standard)</td><td>65–70 mph</td><td>105–113 km/h</td><td>Most states</td></tr>
                    <tr><td>Interstate (rural)</td><td>70–75 mph</td><td>113–121 km/h</td><td>Western states</td></tr>
                    <tr><td>Texas toll roads</td><td>80–85 mph</td><td>129–137 km/h</td><td>Highest US speed limit</td></tr>
                </tbody>
            </table>

            <h3>US Sports Speeds</h3>
            <table>
                <thead><tr><th>Sport</th><th>mph</th><th>km/h</th><th>Context</th></tr></thead>
                <tbody>
                    <tr><td>NFL — running back</td><td>~22 mph</td><td>~35 km/h</td><td>Top sprint speed</td></tr>
                    <tr><td>MLB — fastball</td><td>~100 mph</td><td>~161 km/h</td><td>Elite pitcher speed</td></tr>
                    <tr><td>NBA — fast break</td><td>~18 mph</td><td>~29 km/h</td><td>Player sprint</td></tr>
                    <tr><td>NHL — slap shot</td><td>~100 mph</td><td>~161 km/h</td><td>Puck speed</td></tr>
                    <tr><td>NASCAR — race speed</td><td>~200 mph</td><td>~322 km/h</td><td>Superspeedway</td></tr>
                    <tr><td>F1 — top speed</td><td>~230 mph</td><td>~370 km/h</td><td>Grand Prix straight</td></tr>
                    <tr><td>PGA — golf drive</td><td>~185 mph</td><td>~298 km/h</td><td>Ball speed off tee</td></tr>
                    <tr><td>Usain Bolt</td><td>27.8 mph</td><td>44.7 km/h</td><td>Fastest human ever</td></tr>
                </tbody>
            </table>

            <h3>Speed Unit Comparison</h3>
            <table>
                <thead><tr><th>Unit</th><th>= 1 mph</th><th>Used By</th></tr></thead>
                <tbody>
                    <tr><td><strong>Miles per hour (mph)</strong></td><td>1.000</td><td>USA, UK (roads), Liberia, Myanmar</td></tr>
                    <tr><td><strong>Kilometers per hour (km/h)</strong></td><td>1.60934</td><td>Rest of the world</td></tr>
                    <tr><td>Meters per second (m/s)</td><td>0.44704</td><td>Science, physics</td></tr>
                    <tr><td>Feet per second (ft/s)</td><td>1.46667</td><td>US engineering, ballistics</td></tr>
                    <tr><td>Knots (kn)</td><td>0.86898</td><td>Aviation, maritime (worldwide)</td></tr>
                </tbody>
            </table>

            <h3>What Is Miles per Hour?</h3>
            <p><strong>Miles per hour</strong> (mph) is a speed unit used primarily in the United States and the United Kingdom (for road signs). 1 mph = 1.60934 km/h. All US speed limit signs, speedometers, and weather reports use mph.</p>

            <h3>What Is Kilometers per Hour?</h3>
            <p><strong>Kilometers per hour</strong> (km/h) is the standard speed unit used by most countries worldwide. It's based on the metric system: 1 km/h = traveling 1 kilometer in 1 hour. Americans encounter km/h when renting cars abroad, watching international sports, or reading metric speedometers.</p>
        `,
        faq: [
            { question: "How do you convert mph to km/h?", answer: "Multiply by 1.60934: km/h = mph × 1.60934. For a quick estimate, multiply by 1.6. Example: 60 mph × 1.6 = 96 km/h (exact: 96.56 km/h)." },
            { question: "What is 60 mph in km/h?", answer: "60 mph = 96.56 km/h. This is a typical US highway speed. Most other countries have highway limits of 100–120 km/h, which corresponds to 62–75 mph." },
            { question: "What is 100 mph in km/h?", answer: "100 mph = 160.93 km/h. This is roughly the speed of an MLB fastball or an NHL slap shot. On the road, this is well above all US speed limits (the highest is 85 mph on a Texas toll road)." },
            { question: "Why does the US use miles per hour?", answer: "The US inherited the mile from the British Imperial system. While the UK has since adopted km for many uses, both the US and UK still use mph for road speed. The US Metric Conversion Act of 1975 was voluntary, so mph remains the legal standard for all US road signs and speed limits." },
            { question: "What speed do I need when driving abroad?", answer: "When renting a car abroad, convert: 30 mph ≈ 50 km/h (city), 50 mph ≈ 80 km/h (suburban), 65 mph ≈ 105 km/h (highway), 75 mph ≈ 120 km/h (autobahn standard). Most rental car speedometers show both units. European speed cameras enforce km/h limits strictly." },
            { question: "What is the fastest speed limit in the US?", answer: "85 mph (137 km/h) on State Highway 130 in Texas, a toll road between Austin and San Antonio. The most common US interstate speed limits are 65–75 mph (105–121 km/h), varying by state. Montana and Nevada had no speed limits on rural highways until the late 1990s." },
        ],
    },
    "mmbtu-to-mwh-converter": {
        subtitle: "Convert million BTU to megawatt hours (MMBtu to MWh). See results in MWh, kWh, gigajoules, and therms. Essential for US natural gas, utility billing, and HVAC.",
        contentHTML: `
            <h3>How to Convert MMBtu to MWh</h3>
            <p>Multiply by <strong>0.29307107</strong>:</p>
            <div class="explanation__highlight">
                <strong>MWh = MMBtu × 0.29307107</strong><br/><br/>
                Example: 10 MMBtu (average US home monthly gas)<br/>
                = 10 × 0.29307107 = <strong>2.9307 MWh</strong><br/><br/>
                Example: 1 MMBtu<br/>
                = 1 × 0.29307107 = <strong>0.2931 MWh = 293.07 kWh</strong><br/><br/>
                Example: 100 MMBtu (commercial building)<br/>
                = 100 × 0.29307107 = <strong>29.307 MWh</strong>
            </div>
            <p><strong>Key relationship:</strong> 1 MMBtu = 10 therms = 293.07 kWh = 0.2931 MWh. These units appear on US gas and electric bills.</p>

            <h3>MMBtu to MWh — Conversion Chart</h3>
            <table>
                <thead><tr><th>MMBtu</th><th>MWh</th><th>kWh</th><th>Therms</th><th>US Context</th></tr></thead>
                <tbody>
                    <tr><td>0.1</td><td>0.0293</td><td>29.3</td><td>1</td><td>Gas stove running 1 hour</td></tr>
                    <tr><td>0.5</td><td>0.1465</td><td>146.5</td><td>5</td><td>Water heater (1 day)</td></tr>
                    <tr><td>1</td><td>0.2931</td><td>293.1</td><td>10</td><td>Gas furnace (cold day)</td></tr>
                    <tr><td>3</td><td>0.8792</td><td>879.2</td><td>30</td><td>Home heating (1 week, winter)</td></tr>
                    <tr><td>5</td><td>1.4654</td><td>1,465</td><td>50</td><td>Small home (1 month)</td></tr>
                    <tr><td><strong>10</strong></td><td><strong>2.9307</strong></td><td>2,931</td><td>100</td><td><strong>Avg US home (1 month, winter)</strong></td></tr>
                    <tr><td>20</td><td>5.8614</td><td>5,861</td><td>200</td><td>Large home / cold climate</td></tr>
                    <tr><td>50</td><td>14.654</td><td>14,654</td><td>500</td><td>Small commercial building</td></tr>
                    <tr><td>100</td><td>29.307</td><td>29,307</td><td>1,000</td><td>Large commercial building</td></tr>
                    <tr><td>1,000</td><td>293.07</td><td>293,071</td><td>10,000</td><td>Industrial facility</td></tr>
                </tbody>
            </table>

            <h3>Understanding US Natural Gas Pricing</h3>
            <p>In the US, natural gas is priced per MMBtu at the wholesale level (Henry Hub benchmark) and per therm or CCF on residential utility bills:</p>
            <table>
                <thead><tr><th>Level</th><th>Unit</th><th>Typical Price</th><th>Who Uses It</th></tr></thead>
                <tbody>
                    <tr><td>Wholesale (Henry Hub)</td><td>$/MMBtu</td><td>$2–$6/MMBtu</td><td>Traders, utilities, power plants</td></tr>
                    <tr><td>Residential utility</td><td>$/therm</td><td>$0.50–$1.50/therm</td><td>Homeowners (gas bills)</td></tr>
                    <tr><td>Residential utility</td><td>$/CCF</td><td>$0.50–$1.50/CCF</td><td>Homeowners (some utilities)</td></tr>
                    <tr><td>Electricity equivalent</td><td>$/kWh</td><td>$0.10–$0.20/kWh</td><td>Electric bills for comparison</td></tr>
                    <tr><td>Electricity wholesale</td><td>$/MWh</td><td>$30–$80/MWh</td><td>Power grid operators, ISOs</td></tr>
                </tbody>
            </table>

            <h3>Energy Unit Comparison</h3>
            <table>
                <thead><tr><th>Unit</th><th>Abbreviation</th><th>= How Many BTU</th><th>Common Use</th></tr></thead>
                <tbody>
                    <tr><td>British Thermal Unit</td><td>BTU</td><td>1</td><td>HVAC ratings, appliances</td></tr>
                    <tr><td>Therm</td><td>therm</td><td>100,000</td><td>US gas utility bills</td></tr>
                    <tr><td>Million BTU</td><td>MMBtu</td><td>1,000,000</td><td>Natural gas wholesale, EIA</td></tr>
                    <tr><td>Kilowatt hour</td><td>kWh</td><td>3,412</td><td>Electric utility bills</td></tr>
                    <tr><td>Megawatt hour</td><td>MWh</td><td>3,412,142</td><td>Power grid, wholesale electricity</td></tr>
                    <tr><td>Gigajoule</td><td>GJ</td><td>947,817</td><td>International energy markets</td></tr>
                </tbody>
            </table>

            <h3>US Household Energy Usage</h3>
            <table>
                <thead><tr><th>Appliance / System</th><th>MMBtu/year</th><th>MWh/year</th><th>% of Avg Home</th></tr></thead>
                <tbody>
                    <tr><td>Gas furnace (heating)</td><td>40–60</td><td>11.7–17.6</td><td>45–55%</td></tr>
                    <tr><td>Gas water heater</td><td>15–25</td><td>4.4–7.3</td><td>15–20%</td></tr>
                    <tr><td>Gas dryer</td><td>3–5</td><td>0.9–1.5</td><td>3–5%</td></tr>
                    <tr><td>Gas stove / oven</td><td>2–4</td><td>0.6–1.2</td><td>2–4%</td></tr>
                    <tr><td>Gas fireplace</td><td>5–15</td><td>1.5–4.4</td><td>5–10%</td></tr>
                    <tr><td><strong>Total avg US home</strong></td><td><strong>60–100</strong></td><td><strong>17.6–29.3</strong></td><td><strong>100%</strong></td></tr>
                </tbody>
            </table>

            <h3>What Is a Million BTU (MMBtu)?</h3>
            <p><strong>MMBtu</strong> stands for one million British Thermal Units. The "MM" comes from the Roman numeral for 1,000 × 1,000. It's the standard unit for pricing natural gas in the US — Henry Hub prices, EIA reports, and commercial energy contracts all use $/MMBtu. One MMBtu equals 10 therms or approximately 1,000 cubic feet (MCF) of natural gas.</p>

            <h3>What Is a Megawatt Hour (MWh)?</h3>
            <p><strong>MWh</strong> (megawatt hour) equals 1,000 kilowatt hours. It's the standard unit for wholesale electricity trading in the US. Regional grid operators (ERCOT, PJM, CAISO, MISO, etc.) price electricity in $/MWh. One MWh can power about 30 average US homes for one hour, or one home for about 30 hours.</p>
        `,
        faq: [
            { question: "How do you convert MMBtu to MWh?", answer: "Multiply by 0.29307107: MWh = MMBtu × 0.29307107. This means 1 MMBtu equals approximately 293 kWh or 0.293 MWh. For quick estimates, multiply by 0.293." },
            { question: "What does MMBtu stand for?", answer: "MMBtu stands for 'one million BTU' (British Thermal Units). The 'MM' comes from the Roman numeral M (1,000) doubled: M × M = 1,000,000. It's the standard energy unit for US natural gas wholesale pricing (Henry Hub) and EIA energy reports." },
            { question: "How is natural gas billed in the US?", answer: "Residential: per therm (100,000 BTU) or per CCF (100 cubic feet ≈ 1 therm). Wholesale/commercial: per MMBtu (1,000,000 BTU). Typical residential prices are $0.50–$1.50 per therm. Henry Hub wholesale prices range from $2–$6 per MMBtu depending on market conditions." },
            { question: "How many kWh are in 1 MMBtu?", answer: "1 MMBtu = 293.07 kWh. This conversion is useful for comparing natural gas costs to electricity costs. If gas costs $5/MMBtu and electricity costs $0.12/kWh, then gas energy costs about $0.017/kWh — roughly 7× cheaper than electricity per unit of energy." },
            { question: "How much natural gas does an average US home use?", answer: "According to the EIA, the average US home uses about 60–100 MMBtu of natural gas per year (17.6–29.3 MWh), varying significantly by climate. Cold-climate states like Minnesota or Wisconsin may use 80–120 MMBtu, while mild-climate states like Florida or California may use 20–40 MMBtu." },
            { question: "Why convert between MMBtu and MWh?", answer: "Energy professionals need to compare natural gas (priced in $/MMBtu) with electricity (priced in $/MWh) to determine the most cost-effective fuel for power generation, heating, or industrial processes. This conversion is essential for utility planning, energy trading, and HVAC system design." },
        ],
    },
    "mwh-to-kwh-converter": {
        subtitle: "Convert megawatt hours to kilowatt hours (MWh to kWh). See results in kWh, Wh, MMBtu, and gigajoules. Essential for US electricity bills, solar panels, and EV charging.",
        contentHTML: `
            <h3>How to Convert MWh to kWh</h3>
            <p>Multiply by <strong>1,000</strong> — the simplest energy conversion:</p>
            <div class="explanation__highlight">
                <strong>kWh = MWh × 1,000</strong><br/><br/>
                Example: 1 MWh<br/>
                = 1 × 1,000 = <strong>1,000 kWh</strong><br/><br/>
                Example: 10.7 MWh (avg US home annual electricity)<br/>
                = 10.7 × 1,000 = <strong>10,700 kWh</strong><br/><br/>
                Example: 0.05 MWh (Tesla Model 3 full charge)<br/>
                = 0.05 × 1,000 = <strong>50 kWh</strong>
            </div>
            <p><strong>Remember:</strong> "Mega" means million, "Kilo" means thousand. So 1 MWh = 1,000 kWh, just like 1 megabyte = 1,000 kilobytes.</p>

            <h3>Electricity Unit Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>= How Many Wh</th><th>Typical Use</th></tr></thead>
                <tbody>
                    <tr><td>Watt hour</td><td>Wh</td><td>1</td><td>Phone battery, LED bulb</td></tr>
                    <tr><td><strong>Kilowatt hour</strong></td><td><strong>kWh</strong></td><td>1,000</td><td><strong>Home electric bills</strong></td></tr>
                    <tr><td><strong>Megawatt hour</strong></td><td><strong>MWh</strong></td><td>1,000,000</td><td><strong>Wholesale electricity, solar farms</strong></td></tr>
                    <tr><td>Gigawatt hour</td><td>GWh</td><td>1,000,000,000</td><td>Power plant output, city usage</td></tr>
                    <tr><td>Terawatt hour</td><td>TWh</td><td>1,000,000,000,000</td><td>National electricity production</td></tr>
                </tbody>
            </table>

            <h3>US Electricity Prices by State (Average $/kWh)</h3>
            <table>
                <thead><tr><th>State</th><th>$/kWh</th><th>1 MWh Cost</th><th>Rank</th></tr></thead>
                <tbody>
                    <tr><td>Hawaii</td><td>$0.33</td><td>$330</td><td>Most expensive</td></tr>
                    <tr><td>Connecticut</td><td>$0.25</td><td>$250</td><td>2nd most</td></tr>
                    <tr><td>California</td><td>$0.23</td><td>$230</td><td>3rd most</td></tr>
                    <tr><td>New York</td><td>$0.20</td><td>$200</td><td>High cost</td></tr>
                    <tr><td><strong>US Average</strong></td><td><strong>$0.14</strong></td><td><strong>$140</strong></td><td><strong>National avg</strong></td></tr>
                    <tr><td>Texas</td><td>$0.12</td><td>$120</td><td>Below average</td></tr>
                    <tr><td>Idaho</td><td>$0.09</td><td>$90</td><td>Low cost</td></tr>
                    <tr><td>Louisiana</td><td>$0.09</td><td>$90</td><td>Low cost</td></tr>
                </tbody>
            </table>

            <h3>US Appliance Electricity Usage</h3>
            <table>
                <thead><tr><th>Appliance</th><th>kWh/year</th><th>MWh/year</th><th>% of Avg Home</th></tr></thead>
                <tbody>
                    <tr><td>Central AC</td><td>2,000–3,500</td><td>2.0–3.5</td><td>20–30%</td></tr>
                    <tr><td>Electric water heater</td><td>2,000–3,000</td><td>2.0–3.0</td><td>15–25%</td></tr>
                    <tr><td>Refrigerator</td><td>400–600</td><td>0.4–0.6</td><td>4–6%</td></tr>
                    <tr><td>Electric dryer</td><td>600–900</td><td>0.6–0.9</td><td>5–8%</td></tr>
                    <tr><td>Lighting (whole home)</td><td>500–1,000</td><td>0.5–1.0</td><td>5–10%</td></tr>
                    <tr><td>EV charging (12k mi/yr)</td><td>3,000–4,000</td><td>3.0–4.0</td><td>25–35% (added load)</td></tr>
                    <tr><td><strong>Total avg US home</strong></td><td><strong>10,700</strong></td><td><strong>10.7</strong></td><td><strong>100%</strong></td></tr>
                </tbody>
            </table>

            <h3>Solar Panel Output Context</h3>
            <table>
                <thead><tr><th>System Size</th><th>Annual Output</th><th>MWh/year</th><th>Homes Powered</th></tr></thead>
                <tbody>
                    <tr><td>5 kW (small residential)</td><td>6,000–8,000 kWh</td><td>6–8 MWh</td><td>~0.7 homes</td></tr>
                    <tr><td>10 kW (large residential)</td><td>12,000–16,000 kWh</td><td>12–16 MWh</td><td>~1.3 homes</td></tr>
                    <tr><td>1 MW (commercial)</td><td>1,200–1,600 MWh</td><td>1,200–1,600 MWh</td><td>~130 homes</td></tr>
                    <tr><td>100 MW (utility scale)</td><td>120,000–200,000 MWh</td><td>120–200 GWh</td><td>~15,000 homes</td></tr>
                </tbody>
            </table>

            <h3>What Is a Megawatt Hour (MWh)?</h3>
            <p><strong>MWh</strong> (megawatt hour) = 1,000 kWh. It's the standard unit for wholesale electricity trading in the US. Power plants measure output in MWh, and regional grid operators (ERCOT, PJM, CAISO) price electricity in $/MWh. Solar and wind farms report generation in MWh.</p>

            <h3>What Is a Kilowatt Hour (kWh)?</h3>
            <p><strong>kWh</strong> (kilowatt hour) is the energy unit on every US electric bill. Running a 1,000-watt appliance for 1 hour uses 1 kWh. The average US home uses about 30 kWh per day or ~900 kWh per month, though this varies widely by state and climate.</p>
        `,
        faq: [
            { question: "How do you convert MWh to kWh?", answer: "Multiply by 1,000: kWh = MWh × 1,000. This is because 'mega' means million and 'kilo' means thousand — 1 megawatt hour = 1,000 kilowatt hours. Example: 5 MWh = 5,000 kWh." },
            { question: "How much electricity does an average US home use?", answer: "About 10,700 kWh (10.7 MWh) per year, or roughly 900 kWh per month. This varies widely: Hawaii averages 6,200 kWh/year, while Louisiana averages 14,800 kWh/year. AC usage in hot climates and electric heating in cold climates are the biggest factors." },
            { question: "What is the difference between kW and kWh?", answer: "kW (kilowatt) is power — how fast energy is used. kWh (kilowatt hour) is energy — how much total energy is consumed. A 2 kW heater running for 3 hours uses 6 kWh. Think of kW as speed and kWh as distance." },
            { question: "How much does 1 MWh of electricity cost?", answer: "At the US average residential rate of about $0.14/kWh, 1 MWh costs $140. Wholesale prices are lower — typically $30–$80/MWh depending on the grid region and time of day. Prices range from $90/MWh (Idaho) to $330/MWh (Hawaii)." },
            { question: "How many homes can 1 MWh power?", answer: "1 MWh (1,000 kWh) can power about 1 average US home for roughly 1 month (since the average is ~900 kWh/month). Alternatively, it can power about 33 homes for one hour. Large power plants produce hundreds of MWh per hour." },
            { question: "How much electricity does an EV need?", answer: "A typical EV (like a Tesla Model 3) has a ~60 kWh battery (0.06 MWh). Driving 12,000 miles per year requires about 3,000–4,000 kWh (3–4 MWh) of electricity, which adds roughly $420–$560/year to your electric bill at the US average rate." },
        ],
    },
    "kcal-to-cal-converter": {
        subtitle: "Convert kilocalories to calories (kcal to cal). Clarifies the confusing Calorie vs calorie naming on US food labels. See results in calories, kilojoules, and BTU.",
        contentHTML: `
            <h3>How to Convert Kilocalories to Calories</h3>
            <p>Multiply by <strong>1,000</strong>:</p>
            <div class="explanation__highlight">
                <strong>cal = kcal × 1,000</strong><br/><br/>
                Example: 200 kcal (candy bar)<br/>
                = 200 × 1,000 = <strong>200,000 calories</strong><br/><br/>
                Example: 2,000 kcal (daily recommended intake)<br/>
                = 2,000 × 1,000 = <strong>2,000,000 calories</strong><br/><br/>
                Example: 500 kcal (fast food burger)<br/>
                = 500 × 1,000 = <strong>500,000 calories</strong>
            </div>

            <h3>⚠️ The Calorie Confusion — What Americans Need to Know</h3>
            <p>This is one of the most confusing unit conversions in science because of how the US uses the word "Calorie":</p>
            <table>
                <thead><tr><th>Term</th><th>Symbol</th><th>Definition</th><th>Where You See It</th></tr></thead>
                <tbody>
                    <tr><td><strong>calorie</strong> (small c)</td><td>cal</td><td>Energy to heat 1g water by 1°C</td><td>Chemistry, physics</td></tr>
                    <tr><td><strong>Calorie</strong> (capital C)</td><td>Cal</td><td>= 1 kilocalorie (kcal) = 1,000 cal</td><td><strong>US food labels, nutrition</strong></td></tr>
                    <tr><td><strong>kilocalorie</strong></td><td>kcal</td><td>= 1,000 calories = 1 Cal</td><td>International nutrition, science</td></tr>
                </tbody>
            </table>
            <p><strong>Bottom line:</strong> When a US food label says "200 Calories," it means 200 kcal = 200,000 small calories. The "Calorie" on American food labels is always a kilocalorie.</p>

            <h3>Common US Foods — kcal to cal</h3>
            <table>
                <thead><tr><th>Food</th><th>kcal (=Cal)</th><th>cal (small)</th><th>kJ</th></tr></thead>
                <tbody>
                    <tr><td>1 stick of gum</td><td>5 kcal</td><td>5,000 cal</td><td>21 kJ</td></tr>
                    <tr><td>1 medium apple</td><td>95 kcal</td><td>95,000 cal</td><td>397 kJ</td></tr>
                    <tr><td>1 egg</td><td>78 kcal</td><td>78,000 cal</td><td>326 kJ</td></tr>
                    <tr><td>1 slice of pizza</td><td>285 kcal</td><td>285,000 cal</td><td>1,192 kJ</td></tr>
                    <tr><td>Chicken breast (6 oz)</td><td>280 kcal</td><td>280,000 cal</td><td>1,171 kJ</td></tr>
                    <tr><td>Big Mac</td><td>550 kcal</td><td>550,000 cal</td><td>2,301 kJ</td></tr>
                    <tr><td>Starbucks Grande Latte</td><td>190 kcal</td><td>190,000 cal</td><td>795 kJ</td></tr>
                    <tr><td>Chipotle burrito</td><td>1,000 kcal</td><td>1,000,000 cal</td><td>4,184 kJ</td></tr>
                </tbody>
            </table>

            <h3>Macronutrient Energy Values (The 4-4-9 Rule)</h3>
            <table>
                <thead><tr><th>Macronutrient</th><th>kcal per gram</th><th>cal per gram</th><th>kJ per gram</th></tr></thead>
                <tbody>
                    <tr><td><strong>Protein</strong></td><td>4 kcal/g</td><td>4,000 cal/g</td><td>16.7 kJ/g</td></tr>
                    <tr><td><strong>Carbohydrates</strong></td><td>4 kcal/g</td><td>4,000 cal/g</td><td>16.7 kJ/g</td></tr>
                    <tr><td><strong>Fat</strong></td><td>9 kcal/g</td><td>9,000 cal/g</td><td>37.7 kJ/g</td></tr>
                    <tr><td>Alcohol</td><td>7 kcal/g</td><td>7,000 cal/g</td><td>29.3 kJ/g</td></tr>
                    <tr><td>Fiber</td><td>~2 kcal/g</td><td>~2,000 cal/g</td><td>~8.4 kJ/g</td></tr>
                </tbody>
            </table>

            <h3>US Daily Calorie Recommendations</h3>
            <table>
                <thead><tr><th>Group</th><th>Activity</th><th>kcal/day</th><th>cal/day</th></tr></thead>
                <tbody>
                    <tr><td>Women 19–30</td><td>Sedentary</td><td>1,800–2,000</td><td>1.8–2.0 million</td></tr>
                    <tr><td>Women 19–30</td><td>Active</td><td>2,200–2,400</td><td>2.2–2.4 million</td></tr>
                    <tr><td>Men 19–30</td><td>Sedentary</td><td>2,200–2,400</td><td>2.2–2.4 million</td></tr>
                    <tr><td>Men 19–30</td><td>Active</td><td>2,800–3,200</td><td>2.8–3.2 million</td></tr>
                    <tr><td>Children 4–8</td><td>Moderate</td><td>1,400–1,600</td><td>1.4–1.6 million</td></tr>
                    <tr><td>Teens 14–18</td><td>Active</td><td>2,400–3,200</td><td>2.4–3.2 million</td></tr>
                </tbody>
            </table>

            <h3>What Is a Kilocalorie (kcal)?</h3>
            <p><strong>Kilocalorie</strong> (kcal) = 1,000 calories = the energy needed to raise 1 kilogram (1 liter) of water by 1°C. In the US, this is exactly what food labels call a "Calorie" (capital C). International food labels use "kcal" directly, which is more technically accurate.</p>

            <h3>What Is a Calorie (cal)?</h3>
            <p><strong>Calorie</strong> (cal, small c) = the energy needed to raise 1 gram of water by 1°C. It's a very small unit — too small for nutrition. That's why food uses kilocalories (1,000 cal). The US FDA chose to label food energy as "Calories" (capital C) instead of "kilocalories" to keep labels simpler, creating the ongoing confusion.</p>
        `,
        faq: [
            { question: "How do you convert kilocalories to calories?", answer: "Multiply by 1,000: cal = kcal × 1,000. For example, 200 kcal = 200,000 calories. However, in everyday US nutrition, 'Calories' on food labels already means kilocalories — so 200 'Calories' on a label = 200 kcal = 200,000 small calories." },
            { question: "Are kcal and Calories the same thing?", answer: "Yes! In US nutrition, 1 kcal = 1 Calorie (capital C) = 1,000 calories (small c). When a US food label says '200 Calories,' it means 200 kilocalories. The capital C 'Calorie' is a kilocalorie. This naming convention was adopted by the FDA to simplify food labels." },
            { question: "Why does the US use 'Calories' instead of 'kcal' on food labels?", answer: "The FDA chose 'Calories' (capital C) for simplicity. Internationally, food labels use 'kcal' or 'kJ' (kilojoules). The US convention dates back decades and persists because changing it would confuse consumers accustomed to the current labeling. It's technically a kilocalorie but labeled as a Calorie." },
            { question: "How many kcal should I eat per day?", answer: "The FDA recommends a 2,000 kcal (2,000 Calorie) daily diet as a general guideline for nutrition labeling. Actual needs vary: sedentary women may need 1,600–1,800 kcal, active men may need 2,800–3,200 kcal. Factors include age, sex, weight, height, and physical activity level." },
            { question: "What is the 4-4-9 rule in calories?", answer: "It's a quick way to calculate calories from macronutrients: protein provides 4 kcal per gram, carbohydrates provide 4 kcal per gram, and fat provides 9 kcal per gram. Alcohol provides 7 kcal/g. Example: 10g protein + 20g carbs + 5g fat = 40 + 80 + 45 = 165 kcal." },
            { question: "How do international food labels differ from US labels?", answer: "International labels typically show energy in both kJ (kilojoules) and kcal. US labels show only 'Calories' (which means kcal). To convert: 1 kcal = 4.184 kJ. A food with 200 kcal has about 837 kJ. Australia and New Zealand primarily use kJ on labels." },
        ],
    },
    "l100km-to-mpg-converter": {
        subtitle: "Convert liters per 100km to miles per gallon (L/100km to MPG). See results in US MPG, UK MPG, and km/L. Essential for comparing international car reviews and renting abroad.",
        contentHTML: `
            <h3>How to Convert L/100km to MPG</h3>
            <p>This is a <strong>division</strong>, not multiplication (because L/100km and MPG are inversely related):</p>
            <div class="explanation__highlight">
                <strong>US MPG = 235.215 ÷ L/100km</strong><br/><br/>
                Example: 8 L/100km (midsize SUV)<br/>
                = 235.215 ÷ 8 = <strong>29.4 mpg</strong><br/><br/>
                Example: 5 L/100km (compact car)<br/>
                = 235.215 ÷ 5 = <strong>47.0 mpg</strong><br/><br/>
                Example: 12 L/100km (full-size truck)<br/>
                = 235.215 ÷ 12 = <strong>19.6 mpg</strong>
            </div>
            <p><strong>Why divide?</strong> L/100km measures fuel <em>used</em> (lower = better), while MPG measures distance <em>traveled</em> (higher = better). They're inverse relationships, so you divide rather than multiply.</p>

            <h3>L/100km to MPG — Conversion Chart</h3>
            <table>
                <thead><tr><th>L/100km</th><th>US MPG</th><th>UK MPG</th><th>Vehicle Type</th></tr></thead>
                <tbody>
                    <tr><td>3 L/100km</td><td>78.4 mpg</td><td>94.2 mpg</td><td>Hybrid / plug-in hybrid</td></tr>
                    <tr><td>4 L/100km</td><td>58.8 mpg</td><td>70.6 mpg</td><td>Hybrid sedan</td></tr>
                    <tr><td>5 L/100km</td><td>47.0 mpg</td><td>56.5 mpg</td><td>Efficient compact car</td></tr>
                    <tr><td>6 L/100km</td><td>39.2 mpg</td><td>47.1 mpg</td><td>Midsize sedan</td></tr>
                    <tr><td>7 L/100km</td><td>33.6 mpg</td><td>40.4 mpg</td><td>Standard sedan / compact SUV</td></tr>
                    <tr><td><strong>8 L/100km</strong></td><td><strong>29.4 mpg</strong></td><td>35.3 mpg</td><td><strong>Crossover / small SUV</strong></td></tr>
                    <tr><td>10 L/100km</td><td>23.5 mpg</td><td>28.2 mpg</td><td>Midsize SUV / V6</td></tr>
                    <tr><td>12 L/100km</td><td>19.6 mpg</td><td>23.5 mpg</td><td>Full-size SUV / pickup</td></tr>
                    <tr><td>15 L/100km</td><td>15.7 mpg</td><td>18.8 mpg</td><td>Heavy-duty truck</td></tr>
                    <tr><td>20 L/100km</td><td>11.8 mpg</td><td>14.1 mpg</td><td>RV / large work truck</td></tr>
                </tbody>
            </table>

            <h3>Popular US Cars — Both Units</h3>
            <table>
                <thead><tr><th>Vehicle (2024)</th><th>L/100km</th><th>US MPG (combined)</th><th>Type</th></tr></thead>
                <tbody>
                    <tr><td>Toyota Prius</td><td>4.4</td><td>53 mpg</td><td>Hybrid</td></tr>
                    <tr><td>Honda Civic</td><td>6.7</td><td>35 mpg</td><td>Sedan</td></tr>
                    <tr><td>Toyota Camry</td><td>7.1</td><td>33 mpg</td><td>Sedan</td></tr>
                    <tr><td>Toyota RAV4</td><td>7.8</td><td>30 mpg</td><td>Compact SUV</td></tr>
                    <tr><td>Honda CR-V</td><td>8.1</td><td>29 mpg</td><td>Compact SUV</td></tr>
                    <tr><td>Ford Explorer</td><td>9.8</td><td>24 mpg</td><td>Midsize SUV</td></tr>
                    <tr><td>Ford F-150</td><td>11.2</td><td>21 mpg</td><td>Pickup truck</td></tr>
                    <tr><td>Chevrolet Tahoe</td><td>12.4</td><td>19 mpg</td><td>Full-size SUV</td></tr>
                </tbody>
            </table>

            <h3>US MPG vs UK MPG — Why the Numbers Differ</h3>
            <table>
                <thead><tr><th>Feature</th><th>US MPG</th><th>UK MPG (Imperial)</th></tr></thead>
                <tbody>
                    <tr><td><strong>Gallon size</strong></td><td>3.785 liters</td><td>4.546 liters</td></tr>
                    <tr><td><strong>Result for same car</strong></td><td>Lower number</td><td>~20% higher number</td></tr>
                    <tr><td>Formula from L/100km</td><td>235.215 ÷ L/100km</td><td>282.481 ÷ L/100km</td></tr>
                    <tr><td>Example: 8 L/100km</td><td>29.4 mpg</td><td>35.3 mpg</td></tr>
                </tbody>
            </table>
            <p><strong>Always check which gallon!</strong> A car rated at "40 mpg" in the UK is only about 33 mpg in the US. British gallons are 20% larger than American gallons.</p>

            <h3>Renting a Car Abroad — Quick Guide</h3>
            <table>
                <thead><tr><th>Their Rating</th><th>Your MPG</th><th>What It Means</th></tr></thead>
                <tbody>
                    <tr><td>4 L/100km</td><td>59 mpg</td><td>Excellent — small European diesel/hybrid</td></tr>
                    <tr><td>6 L/100km</td><td>39 mpg</td><td>Good — European compact</td></tr>
                    <tr><td>8 L/100km</td><td>29 mpg</td><td>Average — midsize car</td></tr>
                    <tr><td>10 L/100km</td><td>24 mpg</td><td>Below average — larger car or van</td></tr>
                    <tr><td>12+ L/100km</td><td><20 mpg</td><td>Gas guzzler — SUV or minibus</td></tr>
                </tbody>
            </table>

            <h3>What Is L/100km?</h3>
            <p><strong>Liters per 100 kilometers</strong> (L/100km) measures fuel consumption — how many liters of fuel a vehicle uses to travel 100 km. Lower = better. It's used in Europe, Canada, Australia, and most of the world. Unlike MPG, it measures <em>consumption</em> not <em>efficiency</em>, so the scale goes in the opposite direction.</p>

            <h3>What Is Miles per Gallon (MPG)?</h3>
            <p><strong>Miles per gallon</strong> (MPG) measures fuel efficiency — how far a vehicle travels on one gallon of fuel. Higher = better. It's used in the US and UK (but with different gallon sizes). The US EPA rates all new cars sold in America in MPG.</p>
        `,
        faq: [
            { question: "How do you convert L/100km to MPG?", answer: "Divide 235.215 by the L/100km value: US MPG = 235.215 ÷ L/100km. For example, 8 L/100km = 235.215 ÷ 8 = 29.4 mpg. Note: this gives US MPG. For UK (Imperial) MPG, divide 282.481 by L/100km instead." },
            { question: "Why do you divide instead of multiply?", answer: "Because L/100km and MPG measure opposite things: L/100km measures fuel USED (lower = better), while MPG measures distance TRAVELED (higher = better). They have an inverse relationship — doubling your L/100km halves your MPG, and vice versa." },
            { question: "What is considered good fuel economy in L/100km?", answer: "For a standard gasoline car: under 6 L/100km (39+ mpg) is excellent, 6–8 L/100km (29–39 mpg) is good, 8–12 L/100km (20–29 mpg) is average, and over 12 L/100km (under 20 mpg) is poor. Hybrids can achieve 3–4 L/100km (59–78 mpg)." },
            { question: "What's the difference between US and UK MPG?", answer: "The UK uses Imperial gallons (4.546 liters) while the US uses US gallons (3.785 liters). Since Imperial gallons are about 20% larger, UK MPG numbers are always about 20% higher than US MPG for the same car. A car at 30 US MPG = 36 UK MPG." },
            { question: "How do I compare international car reviews to US ratings?", answer: "European and Australian car reviews use L/100km. Divide 235.215 by their number to get US MPG. Also note that international test cycles (WLTP) often give more optimistic results than the US EPA cycle, so real-world US MPG may be 10–15% lower than the converted WLTP rating." },
            { question: "What should I expect when renting a car in Europe?", answer: "European rental cars typically range from 5–8 L/100km (29–47 mpg). Fuel is priced per liter (usually €1.50–€2.00/L vs ~$3.50/gallon in the US). A car rated at 6 L/100km costs about €9–€12 per 100km in fuel (roughly the same as 39 mpg at US gas prices)." },
        ],
    },
    "mpg-to-l100km-converter": {
        subtitle: "Convert miles per gallon to liters per 100 kilometers (MPG to L/100km). See results in L/100km, UK MPG, and km/L. Essential for US expats, car exporters, and international comparisons.",
        contentHTML: `
            <h3>How to Convert MPG to L/100km</h3>
            <p>This is a <strong>division</strong>, not multiplication (because MPG and L/100km are inversely related):</p>
            <div class="explanation__highlight">
                <strong>L/100km = 235.215 ÷ MPG</strong><br/><br/>
                Example: 30 mpg (standard sedan)<br/>
                = 235.215 ÷ 30 = <strong>7.8 L/100km</strong><br/><br/>
                Example: 50 mpg (hybrid)<br/>
                = 235.215 ÷ 50 = <strong>4.7 L/100km</strong><br/><br/>
                Example: 15 mpg (pickup truck)<br/>
                = 235.215 ÷ 15 = <strong>15.7 L/100km</strong>
            </div>
            <p><strong>Key insight:</strong> MPG measures how <em>far</em> you go (higher = better), while L/100km measures how much fuel you <em>use</em> (lower = better). They move in opposite directions.</p>

            <h3>MPG to L/100km — Conversion Chart</h3>
            <table>
                <thead><tr><th>US MPG</th><th>L/100km</th><th>UK MPG</th><th>Vehicle Type</th></tr></thead>
                <tbody>
                    <tr><td>10 mpg</td><td>23.5 L/100km</td><td>12.0 mpg</td><td>Heavy-duty truck / RV</td></tr>
                    <tr><td>15 mpg</td><td>15.7 L/100km</td><td>18.0 mpg</td><td>Full-size SUV / pickup</td></tr>
                    <tr><td>20 mpg</td><td>11.8 L/100km</td><td>24.0 mpg</td><td>Midsize SUV</td></tr>
                    <tr><td>25 mpg</td><td>9.4 L/100km</td><td>30.0 mpg</td><td>Crossover / small SUV</td></tr>
                    <tr><td><strong>30 mpg</strong></td><td><strong>7.8 L/100km</strong></td><td>36.0 mpg</td><td><strong>Standard sedan</strong></td></tr>
                    <tr><td>35 mpg</td><td>6.7 L/100km</td><td>42.0 mpg</td><td>Efficient sedan</td></tr>
                    <tr><td>40 mpg</td><td>5.9 L/100km</td><td>48.0 mpg</td><td>Compact car</td></tr>
                    <tr><td>50 mpg</td><td>4.7 L/100km</td><td>60.0 mpg</td><td>Hybrid sedan</td></tr>
                    <tr><td>60 mpg</td><td>3.9 L/100km</td><td>72.1 mpg</td><td>Plug-in hybrid</td></tr>
                    <tr><td>80 mpg</td><td>2.9 L/100km</td><td>96.1 mpg</td><td>Full hybrid / EV-assist</td></tr>
                </tbody>
            </table>

            <h3>US Best-Selling Vehicles — Both Units</h3>
            <table>
                <thead><tr><th>Vehicle (2024)</th><th>US MPG</th><th>L/100km</th><th>Type</th></tr></thead>
                <tbody>
                    <tr><td>Ford F-150</td><td>21 mpg</td><td>11.2 L/100km</td><td>#1 US vehicle</td></tr>
                    <tr><td>Chevrolet Silverado</td><td>20 mpg</td><td>11.8 L/100km</td><td>#2 US vehicle</td></tr>
                    <tr><td>RAM 1500</td><td>22 mpg</td><td>10.7 L/100km</td><td>#3 US vehicle</td></tr>
                    <tr><td>Toyota RAV4</td><td>30 mpg</td><td>7.8 L/100km</td><td>Top-selling SUV</td></tr>
                    <tr><td>Tesla Model Y</td><td>123 MPGe</td><td>~2 L/100km equiv</td><td>Top-selling EV</td></tr>
                    <tr><td>Honda CR-V</td><td>29 mpg</td><td>8.1 L/100km</td><td>Compact SUV</td></tr>
                    <tr><td>Toyota Camry</td><td>33 mpg</td><td>7.1 L/100km</td><td>Top-selling car</td></tr>
                    <tr><td>Toyota Corolla</td><td>35 mpg</td><td>6.7 L/100km</td><td>Compact sedan</td></tr>
                </tbody>
            </table>

            <h3>Why the World Uses L/100km Instead of MPG</h3>
            <table>
                <thead><tr><th>Feature</th><th>L/100km</th><th>MPG</th></tr></thead>
                <tbody>
                    <tr><td><strong>Measures</strong></td><td>Fuel consumed</td><td>Distance traveled</td></tr>
                    <tr><td><strong>Better = </strong></td><td>Lower number</td><td>Higher number</td></tr>
                    <tr><td><strong>Linear scale?</strong></td><td>Yes — proportional</td><td>No — diminishing returns</td></tr>
                    <tr><td><strong>Fuel savings</strong></td><td>Easy to calculate</td><td>Misleading at high values</td></tr>
                    <tr><td><strong>Used by</strong></td><td>Europe, Canada, Australia</td><td>USA, UK</td></tr>
                </tbody>
            </table>
            <p><strong>The MPG illusion:</strong> Going from 15→20 mpg saves more fuel than going from 35→50 mpg (for the same distance). L/100km makes fuel savings obvious: 15.7→11.8 = saves 3.9L vs 6.7→4.7 = saves 2.0L per 100km.</p>

            <h3>US Gas Prices vs International Fuel Prices</h3>
            <table>
                <thead><tr><th>Country</th><th>Price</th><th>$/gallon equiv</th><th>Cost per 100 miles at 30mpg</th></tr></thead>
                <tbody>
                    <tr><td>USA</td><td>$3.50/gal</td><td>$3.50</td><td>$11.67</td></tr>
                    <tr><td>Canada</td><td>C$1.60/L</td><td>~$4.50</td><td>$15.00</td></tr>
                    <tr><td>UK</td><td>£1.40/L</td><td>~$6.70</td><td>$22.33</td></tr>
                    <tr><td>Germany</td><td>€1.70/L</td><td>~$6.90</td><td>$23.00</td></tr>
                    <tr><td>Norway</td><td>kr18/L</td><td>~$6.50</td><td>$21.67</td></tr>
                </tbody>
            </table>

            <h3>What Is Miles per Gallon (MPG)?</h3>
            <p><strong>Miles per gallon</strong> (MPG) measures fuel efficiency — how far a vehicle travels on one US gallon (3.785 liters) of fuel. Higher MPG = better fuel economy. The US EPA rates every new car in MPG. US gas is sold by the gallon, so MPG directly tells Americans their cost per mile.</p>

            <h3>What Is L/100km?</h3>
            <p><strong>Liters per 100 kilometers</strong> (L/100km) measures fuel consumption — how many liters a vehicle needs to travel 100 km. Lower = better. It's the global standard used in Europe, Canada, Australia, Japan, and most of the world. Fuel is sold by the liter internationally, so L/100km directly shows fuel cost per trip.</p>
        `,
        faq: [
            { question: "How do you convert MPG to L/100km?", answer: "Divide 235.215 by the MPG value: L/100km = 235.215 ÷ MPG. For example, 30 mpg = 235.215 ÷ 30 = 7.8 L/100km. The constant 235.215 accounts for converting miles to kilometers and gallons to liters simultaneously." },
            { question: "What is 25 MPG in L/100km?", answer: "25 MPG = 235.215 ÷ 25 = 9.4 L/100km. This is typical for a crossover SUV or small SUV in the US. In European terms, 9.4 L/100km would be considered average for a larger vehicle." },
            { question: "Why is the MPG scale misleading?", answer: "MPG uses a non-linear scale. Improving from 15→20 mpg saves 1.67 gallons per 100 miles, while improving from 35→50 mpg only saves 0.86 gallons. L/100km avoids this illusion because it uses a linear scale — every 1 L/100km reduction saves the same amount of fuel regardless of your starting point." },
            { question: "What is MPGe for electric vehicles?", answer: "MPGe (miles per gallon equivalent) is an EPA rating that converts EV electricity consumption to an equivalent MPG number. It uses the energy content of 1 gallon of gasoline (33.7 kWh). A Tesla Model 3 at 132 MPGe uses about 25 kWh per 100 miles, equivalent to about 1.8 L/100km of gasoline." },
            { question: "Why do Americans need to know L/100km?", answer: "For several reasons: renting cars abroad (fuel economy listed in L/100km), reading international car reviews, comparing US cars to European/Asian models, understanding Canadian fuel labels, or shipping/selling vehicles internationally. European and Australian buyers expect L/100km specs." },
            { question: "How much does fuel cost per 100km at different MPG levels?", answer: "At $3.50/gallon US gas: 15 mpg = $23.40/100mi ($14.50/100km), 25 mpg = $14.00/100mi ($8.70/100km), 35 mpg = $10.00/100mi ($6.20/100km), 50 mpg = $7.00/100mi ($4.35/100km). In Europe at €1.70/L: 7.8 L/100km = €13.26/100km." },
        ],
    },
    "kml-to-mpg-converter": {
        subtitle: "Convert kilometers per liter to miles per gallon (km/L to MPG). See results in US MPG, UK MPG, and L/100km. Used in Japan, India, South Korea, and Brazil.",
        contentHTML: `
            <h3>How to Convert km/L to MPG</h3>
            <p>Multiply by <strong>2.35215</strong>:</p>
            <div class="explanation__highlight">
                <strong>US MPG = km/L × 2.35215</strong><br/><br/>
                Example: 12 km/L (standard sedan)<br/>
                = 12 × 2.35215 = <strong>28.2 mpg</strong><br/><br/>
                Example: 20 km/L (hybrid)<br/>
                = 20 × 2.35215 = <strong>47.0 mpg</strong><br/><br/>
                Example: 8 km/L (SUV)<br/>
                = 8 × 2.35215 = <strong>18.8 mpg</strong>
            </div>
            <p><strong>Good news:</strong> Unlike L/100km (which requires division), km/L converts to MPG with simple multiplication. Both km/L and MPG measure <em>efficiency</em> — higher = better — so the conversion is straightforward.</p>

            <h3>km/L to MPG — Conversion Chart</h3>
            <table>
                <thead><tr><th>km/L</th><th>US MPG</th><th>L/100km</th><th>Vehicle Type</th></tr></thead>
                <tbody>
                    <tr><td>5 km/L</td><td>11.8 mpg</td><td>20.0 L/100km</td><td>Heavy truck / old vehicle</td></tr>
                    <tr><td>8 km/L</td><td>18.8 mpg</td><td>12.5 L/100km</td><td>Full-size SUV / pickup</td></tr>
                    <tr><td>10 km/L</td><td>23.5 mpg</td><td>10.0 L/100km</td><td>Midsize SUV</td></tr>
                    <tr><td><strong>12 km/L</strong></td><td><strong>28.2 mpg</strong></td><td>8.3 L/100km</td><td><strong>Standard sedan</strong></td></tr>
                    <tr><td>14 km/L</td><td>32.9 mpg</td><td>7.1 L/100km</td><td>Efficient sedan</td></tr>
                    <tr><td>16 km/L</td><td>37.6 mpg</td><td>6.3 L/100km</td><td>Compact car</td></tr>
                    <tr><td>18 km/L</td><td>42.3 mpg</td><td>5.6 L/100km</td><td>Subcompact / kei car</td></tr>
                    <tr><td>20 km/L</td><td>47.0 mpg</td><td>5.0 L/100km</td><td>Hybrid sedan</td></tr>
                    <tr><td>25 km/L</td><td>58.8 mpg</td><td>4.0 L/100km</td><td>Plug-in hybrid</td></tr>
                    <tr><td>30 km/L</td><td>70.6 mpg</td><td>3.3 L/100km</td><td>Full hybrid (best)</td></tr>
                </tbody>
            </table>

            <h3>Countries That Use km/L</h3>
            <table>
                <thead><tr><th>Country</th><th>Unit</th><th>Fuel Price Unit</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td><strong>Japan</strong></td><td>km/L</td><td>¥/liter</td><td>JC08 / WLTC test cycle</td></tr>
                    <tr><td><strong>India</strong></td><td>km/L (kmpl)</td><td>₹/liter</td><td>ARAI certified mileage</td></tr>
                    <tr><td><strong>South Korea</strong></td><td>km/L</td><td>₩/liter</td><td>Korean test cycle</td></tr>
                    <tr><td><strong>Brazil</strong></td><td>km/L</td><td>R$/liter</td><td>INMETRO certification</td></tr>
                    <tr><td><strong>Thailand</strong></td><td>km/L</td><td>฿/liter</td><td>Common usage</td></tr>
                    <tr><td>Europe</td><td>L/100km</td><td>€/liter</td><td>Inverse of km/L</td></tr>
                    <tr><td>USA</td><td>MPG</td><td>$/gallon</td><td>EPA test cycle</td></tr>
                </tbody>
            </table>

            <h3>Popular Japanese Cars — km/L to MPG</h3>
            <table>
                <thead><tr><th>Vehicle</th><th>Japan (km/L)</th><th>US MPG (equiv)</th><th>Type</th></tr></thead>
                <tbody>
                    <tr><td>Toyota Yaris Hybrid</td><td>35.8 km/L</td><td>84.2 mpg</td><td>Subcompact hybrid</td></tr>
                    <tr><td>Toyota Aqua (Prius C)</td><td>35.0 km/L</td><td>82.3 mpg</td><td>Compact hybrid</td></tr>
                    <tr><td>Honda Fit / Jazz</td><td>29.4 km/L</td><td>69.1 mpg</td><td>Subcompact hybrid</td></tr>
                    <tr><td>Toyota Corolla</td><td>25.0 km/L</td><td>58.8 mpg</td><td>Sedan hybrid</td></tr>
                    <tr><td>Suzuki Swift</td><td>23.0 km/L</td><td>54.1 mpg</td><td>Subcompact</td></tr>
                    <tr><td>Toyota RAV4</td><td>15.2 km/L</td><td>35.7 mpg</td><td>Compact SUV</td></tr>
                    <tr><td>Nissan Note e-Power</td><td>28.4 km/L</td><td>66.8 mpg</td><td>Series hybrid</td></tr>
                    <tr><td>Suzuki Jimny</td><td>13.2 km/L</td><td>31.0 mpg</td><td>Mini off-road SUV</td></tr>
                </tbody>
            </table>
            <p><strong>Note:</strong> Japanese km/L ratings (JC08/WLTC cycle) tend to be more optimistic than US EPA ratings. Real-world US MPG may be 15–25% lower than the converted Japanese rating.</p>

            <h3>Why km/L Is Easier for Americans</h3>
            <p>Unlike L/100km (which inverts the scale — lower = better), <strong>km/L works the same way as MPG</strong>: higher = better. Both measure how <em>far</em> you travel per unit of fuel. The only difference is the units: kilometers instead of miles, liters instead of gallons. This makes km/L more intuitive for Americans to understand than L/100km.</p>

            <h3>What Is km/L?</h3>
            <p><strong>Kilometers per liter</strong> (km/L) measures fuel efficiency — how many kilometers a vehicle can travel on one liter of fuel. Higher = better. It's used primarily in Japan, India, South Korea, Brazil, and Thailand. To convert to L/100km: L/100km = 100 ÷ km/L.</p>

            <h3>What Is Miles per Gallon (MPG)?</h3>
            <p><strong>Miles per gallon</strong> (MPG) measures how far a vehicle travels on one US gallon (3.785 liters). Higher = better. The US EPA rates every new car in MPG. Both km/L and MPG measure the same concept (distance per fuel unit), making the conversion a simple multiplication.</p>
        `,
        faq: [
            { question: "How do you convert km/L to MPG?", answer: "Multiply by 2.35215: US MPG = km/L × 2.35215. For example, 15 km/L = 15 × 2.35215 = 35.3 mpg. This is a simple multiplication because both km/L and MPG measure the same thing — distance traveled per unit of fuel." },
            { question: "Why is km/L to MPG simpler than L/100km to MPG?", answer: "Because km/L and MPG both measure EFFICIENCY (distance per fuel, higher = better), so you just multiply. L/100km measures CONSUMPTION (fuel per distance, lower = better), which is the inverse, requiring division. km/L × 2.35215 = MPG is straightforward math." },
            { question: "Which countries use km/L?", answer: "Primarily Japan, India, South Korea, Brazil, and Thailand. Japan's test cycles (JC08, now WLTC) rate cars in km/L. India uses 'kmpl' (kilometers per liter). The rest of Asia and Latin America also commonly uses km/L. Europe uses L/100km, and the US/UK use MPG." },
            { question: "Are Japanese km/L ratings accurate for US driving?", answer: "Japanese ratings tend to be 15–25% more optimistic than US EPA ratings due to different test cycles. The Japanese JC08 cycle involves more idling and lower speeds. The newer WLTC cycle is closer to real-world driving but still tends to give higher numbers than the US EPA cycle." },
            { question: "What is good fuel economy in km/L?", answer: "For gasoline cars: 15+ km/L (35+ mpg) is good, 20+ km/L (47+ mpg) is excellent. Japanese kei cars and hybrids commonly achieve 25–35 km/L (59–82 mpg). For comparison, the average US car gets about 12–13 km/L (28–30 mpg)." },
            { question: "How do I convert km/L to L/100km?", answer: "Divide 100 by the km/L value: L/100km = 100 ÷ km/L. For example, 15 km/L = 100 ÷ 15 = 6.67 L/100km. This is useful when comparing Japanese car specs (km/L) with European specs (L/100km)." },
        ],
    },
    "mpg-to-kml-converter": {
        subtitle: "Convert miles per gallon to kilometers per liter (MPG to km/L). See results in km/L, L/100km, and UK MPG. Essential for US expats in Japan, India, South Korea, and Asia.",
        contentHTML: `
            <h3>How to Convert MPG to km/L</h3>
            <p>Multiply by <strong>0.42514</strong>:</p>
            <div class="explanation__highlight">
                <strong>km/L = MPG × 0.42514</strong><br/><br/>
                Example: 30 mpg (standard sedan)<br/>
                = 30 × 0.42514 = <strong>12.8 km/L</strong><br/><br/>
                Example: 50 mpg (hybrid)<br/>
                = 50 × 0.42514 = <strong>21.3 km/L</strong><br/><br/>
                Example: 20 mpg (SUV)<br/>
                = 20 × 0.42514 = <strong>8.5 km/L</strong>
            </div>
            <p><strong>Simple math:</strong> Both MPG and km/L measure efficiency (higher = better), so conversion is a straightforward multiplication. Divide by the same factor (2.35215) to go the other way: km/L × 2.35215 = MPG.</p>

            <h3>MPG to km/L — Conversion Chart</h3>
            <table>
                <thead><tr><th>US MPG</th><th>km/L</th><th>L/100km</th><th>Vehicle Type</th></tr></thead>
                <tbody>
                    <tr><td>10 mpg</td><td>4.3 km/L</td><td>23.5 L/100km</td><td>Heavy truck / RV</td></tr>
                    <tr><td>15 mpg</td><td>6.4 km/L</td><td>15.7 L/100km</td><td>Full-size SUV / pickup</td></tr>
                    <tr><td>20 mpg</td><td>8.5 km/L</td><td>11.8 L/100km</td><td>Midsize SUV</td></tr>
                    <tr><td>25 mpg</td><td>10.6 km/L</td><td>9.4 L/100km</td><td>Crossover / small SUV</td></tr>
                    <tr><td><strong>30 mpg</strong></td><td><strong>12.8 km/L</strong></td><td>7.8 L/100km</td><td><strong>Standard sedan</strong></td></tr>
                    <tr><td>35 mpg</td><td>14.9 km/L</td><td>6.7 L/100km</td><td>Efficient sedan</td></tr>
                    <tr><td>40 mpg</td><td>17.0 km/L</td><td>5.9 L/100km</td><td>Compact car</td></tr>
                    <tr><td>50 mpg</td><td>21.3 km/L</td><td>4.7 L/100km</td><td>Hybrid sedan</td></tr>
                    <tr><td>60 mpg</td><td>25.5 km/L</td><td>3.9 L/100km</td><td>Plug-in hybrid</td></tr>
                    <tr><td>80 mpg</td><td>34.0 km/L</td><td>2.9 L/100km</td><td>Full hybrid (best)</td></tr>
                </tbody>
            </table>

            <h3>US Best-Sellers in km/L</h3>
            <table>
                <thead><tr><th>Vehicle (2024)</th><th>US MPG</th><th>km/L</th><th>Asian Market Equivalent</th></tr></thead>
                <tbody>
                    <tr><td>Ford F-150</td><td>21 mpg</td><td>8.9 km/L</td><td>Not sold (too large)</td></tr>
                    <tr><td>Toyota RAV4</td><td>30 mpg</td><td>12.8 km/L</td><td>Japan: ~15 km/L (JC08)</td></tr>
                    <tr><td>Honda CR-V</td><td>29 mpg</td><td>12.3 km/L</td><td>Japan: ~14 km/L</td></tr>
                    <tr><td>Toyota Camry</td><td>33 mpg</td><td>14.0 km/L</td><td>Japan: ~18 km/L</td></tr>
                    <tr><td>Toyota Corolla</td><td>35 mpg</td><td>14.9 km/L</td><td>Japan: ~20 km/L</td></tr>
                    <tr><td>Honda Civic</td><td>35 mpg</td><td>14.9 km/L</td><td>Japan: ~20 km/L</td></tr>
                    <tr><td>Toyota Prius</td><td>53 mpg</td><td>22.5 km/L</td><td>Japan: ~32 km/L</td></tr>
                </tbody>
            </table>
            <p><strong>Note:</strong> Japanese km/L ratings are typically 15–25% higher than the US EPA MPG equivalent due to different test cycles (JC08/WLTC vs EPA).</p>

            <h3>Fuel Economy Systems Worldwide</h3>
            <table>
                <thead><tr><th>System</th><th>Unit</th><th>Higher = ?</th><th>Countries</th></tr></thead>
                <tbody>
                    <tr><td><strong>MPG (US)</strong></td><td>miles/US gal</td><td>Better</td><td>United States</td></tr>
                    <tr><td>MPG (UK)</td><td>miles/imp gal</td><td>Better</td><td>United Kingdom</td></tr>
                    <tr><td><strong>km/L</strong></td><td>km/liter</td><td>Better</td><td>Japan, India, S. Korea, Brazil</td></tr>
                    <tr><td>L/100km</td><td>liters/100km</td><td>Worse</td><td>Europe, Canada, Australia</td></tr>
                </tbody>
            </table>

            <h3>US Expat & Military Guide</h3>
            <p>If you're a US expat or military member stationed in Japan, South Korea, or India, here's a quick guide:</p>
            <table>
                <thead><tr><th>Your US Car</th><th>US MPG</th><th>Local km/L</th><th>What Locals Drive</th></tr></thead>
                <tbody>
                    <tr><td>Subcompact (Civic)</td><td>35 mpg</td><td>14.9 km/L</td><td>Locals: 18–25 km/L</td></tr>
                    <tr><td>Midsize (Camry)</td><td>33 mpg</td><td>14.0 km/L</td><td>Locals: 15–20 km/L</td></tr>
                    <tr><td>Compact SUV (RAV4)</td><td>30 mpg</td><td>12.8 km/L</td><td>Locals: 14–18 km/L</td></tr>
                    <tr><td>Full-size truck (F-150)</td><td>21 mpg</td><td>8.9 km/L</td><td>Not common in Asia</td></tr>
                </tbody>
            </table>

            <h3>What Is Miles per Gallon (MPG)?</h3>
            <p><strong>Miles per gallon</strong> (MPG) measures how far a vehicle travels on one US gallon (3.785 liters). Higher = better. The US EPA rates every new car in MPG. It's the standard US fuel economy measure.</p>

            <h3>What Is km/L?</h3>
            <p><strong>Kilometers per liter</strong> (km/L) measures how far a vehicle travels on one liter of fuel. Higher = better. Used in Japan (JC08/WLTC cycles), India (ARAI kmpl), South Korea, Brazil, and Thailand. It's conceptually identical to MPG — just with metric units.</p>
        `,
        faq: [
            { question: "How do you convert MPG to km/L?", answer: "Multiply by 0.42514: km/L = MPG × 0.42514. For example, 30 mpg × 0.42514 = 12.8 km/L. Both units measure distance per fuel unit (higher = better), so the conversion is a simple multiplication." },
            { question: "What is 30 MPG in km/L?", answer: "30 MPG = 30 × 0.42514 = 12.8 km/L. This is typical for a standard US sedan like a Toyota Camry or Honda Accord. In Japan, the same car might be rated at 15–18 km/L due to different test cycles." },
            { question: "Why are Japanese km/L ratings higher than US MPG equivalents?", answer: "Japan's test cycles (JC08 and now WLTC) involve more city driving at lower speeds with more idling, which favors Japanese cars' efficient designs. The US EPA cycle includes higher highway speeds and more aggressive acceleration. Real-world difference is typically 15–25%." },
            { question: "Is km/L the same concept as MPG?", answer: "Yes! Both measure fuel EFFICIENCY — distance traveled per unit of fuel. km/L uses kilometers and liters, MPG uses miles and gallons. Higher = better in both cases. This makes conversion simple (multiply by 0.42514). Unlike L/100km, which measures CONSUMPTION (lower = better)." },
            { question: "What do US expats in Japan need to know about km/L?", answer: "Japanese fuel economy is rated in km/L. A car rated at 20 km/L is about 47 mpg — very efficient by US standards. Japanese kei cars (660cc engines) can get 25–35 km/L (59–82 mpg). Fuel costs ¥160–180/liter (about $4.50/gallon), so efficiency matters more than in the US." },
            { question: "How do I compare US and Indian car fuel economy?", answer: "India uses 'kmpl' (kilometers per liter), which is the same as km/L. To convert your US car's MPG to Indian kmpl: multiply by 0.42514. Indian cars typically achieve 15–25 kmpl because they're smaller and lighter. A Maruti Suzuki Alto gets 22 kmpl (52 mpg) — far higher than most US cars." },
        ],
    },
    "megaohm-to-ohm-converter": {
        subtitle: "Convert megaohms to ohms (MΩ to Ω). See results in ohms, kilohms, and gigaohms. Essential for insulation testing, electrical safety, and high-impedance circuits in the US.",
        contentHTML: `
            <h3>How to Convert Megaohms to Ohms</h3>
            <p>Multiply by <strong>1,000,000</strong> (one million):</p>
            <div class="explanation__highlight">
                <strong>Ω = MΩ × 1,000,000</strong><br/><br/>
                Example: 1 MΩ (insulation test threshold)<br/>
                = 1 × 1,000,000 = <strong>1,000,000 Ω</strong><br/><br/>
                Example: 0.1 MΩ (sensor circuit)<br/>
                = 0.1 × 1,000,000 = <strong>100,000 Ω</strong><br/><br/>
                Example: 10 MΩ (transformer insulation)<br/>
                = 10 × 1,000,000 = <strong>10,000,000 Ω</strong>
            </div>
            <p><strong>Remember:</strong> "Mega" means million. 1 MΩ = 1,000 kΩ = 1,000,000 Ω. Megaohms are used when resistance values are extremely high — typically in insulation testing and high-impedance circuits.</p>

            <h3>Resistance Unit Hierarchy</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>= How Many Ω</th><th>Typical Use</th></tr></thead>
                <tbody>
                    <tr><td>Milliohm</td><td>mΩ</td><td>0.001</td><td>Wire resistance, contact resistance</td></tr>
                    <tr><td><strong>Ohm</strong></td><td><strong>Ω</strong></td><td>1</td><td><strong>Standard resistors, speakers</strong></td></tr>
                    <tr><td>Kilohm</td><td>kΩ</td><td>1,000</td><td>Pull-up resistors, voltage dividers</td></tr>
                    <tr><td><strong>Megaohm</strong></td><td><strong>MΩ</strong></td><td>1,000,000</td><td><strong>Insulation testing, high-Z circuits</strong></td></tr>
                    <tr><td>Gigaohm</td><td>GΩ</td><td>1,000,000,000</td><td>PCB leakage, ultra-high-Z</td></tr>
                </tbody>
            </table>

            <h3>Insulation Resistance Standards (US)</h3>
            <table>
                <thead><tr><th>Equipment</th><th>Min Insulation (MΩ)</th><th>In Ohms</th><th>Standard</th></tr></thead>
                <tbody>
                    <tr><td>Electric motors (< 1kV)</td><td>1 MΩ minimum</td><td>1,000,000 Ω</td><td>IEEE 43</td></tr>
                    <tr><td>Electric motors (> 1kV)</td><td>1 MΩ per kV + 1</td><td>Varies</td><td>IEEE 43</td></tr>
                    <tr><td>Power cables (600V)</td><td>1–5 MΩ</td><td>1–5 million Ω</td><td>NETA MTS</td></tr>
                    <tr><td>Transformers</td><td>2–100+ MΩ</td><td>2–100+ million Ω</td><td>IEEE C57.12</td></tr>
                    <tr><td>Switchgear</td><td>100+ MΩ</td><td>100+ million Ω</td><td>NFPA 70B</td></tr>
                    <tr><td>Residential wiring</td><td>1+ MΩ</td><td>1+ million Ω</td><td>NEC</td></tr>
                </tbody>
            </table>

            <h3>Megger Testing Guide</h3>
            <table>
                <thead><tr><th>Reading</th><th>In MΩ</th><th>In Ω</th><th>Verdict</th></tr></thead>
                <tbody>
                    <tr><td>0–0.5 MΩ</td><td>< 0.5</td><td>< 500,000</td><td>🔴 Bad — replace immediately</td></tr>
                    <tr><td>0.5–1 MΩ</td><td>0.5–1</td><td>500k–1M</td><td>🟡 Questionable — investigate</td></tr>
                    <tr><td>1–5 MΩ</td><td>1–5</td><td>1M–5M</td><td>🟢 Acceptable — monitor</td></tr>
                    <tr><td>5–100 MΩ</td><td>5–100</td><td>5M–100M</td><td>🟢 Good</td></tr>
                    <tr><td>100+ MΩ</td><td>100+</td><td>100M+</td><td>🟢 Excellent</td></tr>
                </tbody>
            </table>

            <h3>Common US Electrical Applications</h3>
            <table>
                <thead><tr><th>Application</th><th>Typical Range</th><th>In Ohms</th><th>Why MΩ</th></tr></thead>
                <tbody>
                    <tr><td>Multimeter input impedance</td><td>10 MΩ</td><td>10,000,000 Ω</td><td>Avoids loading the circuit</td></tr>
                    <tr><td>Oscilloscope probe</td><td>1–10 MΩ</td><td>1M–10M Ω</td><td>High-impedance measurement</td></tr>
                    <tr><td>ESD protection</td><td>1–100 MΩ</td><td>1M–100M Ω</td><td>Static dissipation</td></tr>
                    <tr><td>Humidity sensor</td><td>0.1–100 MΩ</td><td>100k–100M Ω</td><td>Varies with moisture</td></tr>
                    <tr><td>Photoresistor (dark)</td><td>1–10 MΩ</td><td>1M–10M Ω</td><td>High in dark, low in light</td></tr>
                </tbody>
            </table>

            <h3>What Is a Megaohm (MΩ)?</h3>
            <p><strong>Megaohm</strong> (MΩ) = 1,000,000 ohms = 1,000 kilohms. It's the standard unit for measuring insulation resistance, used by electricians and maintenance technicians across the US. Megger testers (insulation resistance testers) display readings in MΩ. Per the NEC and IEEE standards, insulation must meet minimum MΩ thresholds to be considered safe.</p>

            <h3>What Is an Ohm (Ω)?</h3>
            <p><strong>Ohm</strong> (Ω) is the SI unit of electrical resistance, named after Georg Simon Ohm. It measures how much a material resists the flow of electric current. Per Ohm's Law: V = I × R, where V is voltage (volts), I is current (amps), and R is resistance (ohms). A 1 Ω resistor allows 1 amp to flow when 1 volt is applied.</p>
        `,
        faq: [
            { question: "How do you convert megaohms to ohms?", answer: "Multiply by 1,000,000: Ω = MΩ × 1,000,000. For example, 5 MΩ = 5 × 1,000,000 = 5,000,000 ohms. 'Mega' means million, so 1 megaohm is literally one million ohms." },
            { question: "What is a Megger test?", answer: "A Megger test (insulation resistance test) uses a specialized instrument to measure the resistance of electrical insulation in megaohms (MΩ). It applies a high DC voltage (typically 500V or 1000V) and measures how much current leaks through the insulation. Results below 1 MΩ typically indicate failed insulation that needs replacement." },
            { question: "What is the minimum insulation resistance for motors?", answer: "Per IEEE 43, the minimum insulation resistance for electric motors rated below 1 kV is 1 MΩ (1,000,000 Ω). For motors rated above 1 kV, the minimum is (kV rating + 1) MΩ. For example, a 4.16 kV motor needs at least 5.16 MΩ. New motors typically read 100+ MΩ." },
            { question: "Why do multimeters have 10 MΩ input impedance?", answer: "A 10 MΩ (10,000,000 Ω) input impedance is high enough that the multimeter draws negligible current from the circuit being measured, avoiding measurement errors. This is an industry standard for digital multimeters. Oscilloscope probes similarly use 1–10 MΩ input impedance." },
            { question: "What causes insulation resistance to drop?", answer: "Common causes include: moisture absorption, chemical contamination, physical damage, aging/heat degradation, and electrical stress. In the US, the NEC requires periodic insulation testing for critical equipment. A reading that drops below 1 MΩ typically warrants investigation or replacement." },
            { question: "What is the difference between kΩ and MΩ?", answer: "1 MΩ = 1,000 kΩ. Kilohms (kΩ) are commonly used for resistors in electronic circuits (1 kΩ to 1,000 kΩ), while megaohms (MΩ) are used for insulation resistance and high-impedance measurements (1 MΩ and above). The prefix 'kilo' means thousand, 'mega' means million." },
        ],
    },
    "ohm-to-kiloohm-converter": {
        subtitle: "Convert ohms to kilohms (Ω to kΩ). See results in kilohms, megaohms, and milliohms. Essential for electronics, Arduino projects, and resistor selection.",
        contentHTML: `
            <h3>How to Convert Ohms to Kilohms</h3>
            <p>Divide by <strong>1,000</strong>:</p>
            <div class="explanation__highlight">
                <strong>kΩ = Ω ÷ 1,000</strong><br/><br/>
                Example: 4,700 Ω (common pull-up resistor)<br/>
                = 4,700 ÷ 1,000 = <strong>4.7 kΩ</strong><br/><br/>
                Example: 10,000 Ω (I²C pull-up)<br/>
                = 10,000 ÷ 1,000 = <strong>10 kΩ</strong><br/><br/>
                Example: 220 Ω (LED current limiter)<br/>
                = 220 ÷ 1,000 = <strong>0.22 kΩ</strong>
            </div>
            <p><strong>Remember:</strong> "Kilo" means thousand. 1 kΩ = 1,000 Ω. Schematics and datasheets often use kΩ to keep numbers small and readable. A "4.7k" resistor means 4,700 Ω.</p>

            <h3>E12 Standard Resistor Values</h3>
            <table>
                <thead><tr><th>Ω Value</th><th>kΩ</th><th>Color Code</th><th>Common Use</th></tr></thead>
                <tbody>
                    <tr><td>100 Ω</td><td>0.1 kΩ</td><td>Brown-Black-Brown</td><td>Signal termination</td></tr>
                    <tr><td>220 Ω</td><td>0.22 kΩ</td><td>Red-Red-Brown</td><td>LED current limiter (5V)</td></tr>
                    <tr><td>330 Ω</td><td>0.33 kΩ</td><td>Orange-Orange-Brown</td><td>LED series (3.3V)</td></tr>
                    <tr><td>470 Ω</td><td>0.47 kΩ</td><td>Yellow-Violet-Brown</td><td>Logic level shifter</td></tr>
                    <tr><td><strong>1,000 Ω</strong></td><td><strong>1 kΩ</strong></td><td>Brown-Black-Red</td><td><strong>General purpose</strong></td></tr>
                    <tr><td>2,200 Ω</td><td>2.2 kΩ</td><td>Red-Red-Red</td><td>Audio circuits</td></tr>
                    <tr><td><strong>4,700 Ω</strong></td><td><strong>4.7 kΩ</strong></td><td>Yellow-Violet-Red</td><td><strong>Pull-up (Arduino default)</strong></td></tr>
                    <tr><td>10,000 Ω</td><td>10 kΩ</td><td>Brown-Black-Orange</td><td>I²C pull-up, voltage divider</td></tr>
                    <tr><td>47,000 Ω</td><td>47 kΩ</td><td>Yellow-Violet-Orange</td><td>Audio tone control</td></tr>
                    <tr><td>100,000 Ω</td><td>100 kΩ</td><td>Brown-Black-Yellow</td><td>High-impedance input</td></tr>
                </tbody>
            </table>

            <h3>Common Arduino/Maker Resistor Values</h3>
            <table>
                <thead><tr><th>Project</th><th>Resistor (Ω)</th><th>In kΩ</th><th>Why This Value</th></tr></thead>
                <tbody>
                    <tr><td>LED on 5V Arduino</td><td>220 Ω</td><td>0.22 kΩ</td><td>Limits to ~15mA for standard LED</td></tr>
                    <tr><td>LED on 3.3V ESP32</td><td>100 Ω</td><td>0.1 kΩ</td><td>Limits to ~13mA</td></tr>
                    <tr><td>Push button pull-down</td><td>10,000 Ω</td><td>10 kΩ</td><td>Prevents floating input</td></tr>
                    <tr><td>I²C pull-up (3.3V)</td><td>4,700 Ω</td><td>4.7 kΩ</td><td>Standard I²C specification</td></tr>
                    <tr><td>Voltage divider (sensors)</td><td>10,000 Ω × 2</td><td>10 kΩ × 2</td><td>Divides voltage by 2</td></tr>
                    <tr><td>Piezo buzzer</td><td>100 Ω</td><td>0.1 kΩ</td><td>Current limiter</td></tr>
                    <tr><td>Potentiometer (volume)</td><td>10,000 Ω</td><td>10 kΩ</td><td>Audio taper standard</td></tr>
                </tbody>
            </table>

            <h3>Resistance Unit Scale</h3>
            <table>
                <thead><tr><th>Unit</th><th>Symbol</th><th>= How Many Ω</th><th>Typical Range</th></tr></thead>
                <tbody>
                    <tr><td>Milliohm</td><td>mΩ</td><td>0.001 Ω</td><td>Wire & contact resistance</td></tr>
                    <tr><td><strong>Ohm</strong></td><td><strong>Ω</strong></td><td>1 Ω</td><td><strong>Speakers, power resistors</strong></td></tr>
                    <tr><td><strong>Kilohm</strong></td><td><strong>kΩ</strong></td><td>1,000 Ω</td><td><strong>Most circuit resistors</strong></td></tr>
                    <tr><td>Megaohm</td><td>MΩ</td><td>1,000,000 Ω</td><td>Insulation, high-Z</td></tr>
                    <tr><td>Gigaohm</td><td>GΩ</td><td>1,000,000,000 Ω</td><td>PCB leakage</td></tr>
                </tbody>
            </table>

            <h3>Ohm's Law Quick Reference</h3>
            <p>Ohm's Law relates voltage (V), current (I), and resistance (R):</p>
            <div class="explanation__highlight">
                <strong>V = I × R</strong> &nbsp;&nbsp;|&nbsp;&nbsp; <strong>I = V ÷ R</strong> &nbsp;&nbsp;|&nbsp;&nbsp; <strong>R = V ÷ I</strong><br/><br/>
                Example: What current flows through a 4.7 kΩ (4,700 Ω) resistor at 5V?<br/>
                I = 5V ÷ 4,700 Ω = <strong>0.00106 A = 1.06 mA</strong>
            </div>

            <h3>What Is a Kiloohm (kΩ)?</h3>
            <p><strong>Kiloohm</strong> (kΩ) = 1,000 ohms. It's the most common unit for resistors in electronic circuits. When you see "4.7k" or "10k" on a schematic, it means 4.7 kΩ (4,700 Ω) or 10 kΩ (10,000 Ω). The kilohm range (1 kΩ – 100 kΩ) covers most resistors used in Arduino, Raspberry Pi, and general electronics projects.</p>

            <h3>What Is an Ohm (Ω)?</h3>
            <p><strong>Ohm</strong> (Ω) is the SI unit of electrical resistance. Named after Georg Simon Ohm, it measures opposition to current flow. Low-value resistors (under 1 kΩ) are typically expressed in ohms: 100 Ω, 220 Ω, 470 Ω. High-value resistors use kΩ or MΩ for readability.</p>
        `,
        faq: [
            { question: "How do you convert ohms to kilohms?", answer: "Divide by 1,000: kΩ = Ω ÷ 1,000. For example, 4,700 Ω ÷ 1,000 = 4.7 kΩ. 'Kilo' means thousand, so 1 kilohm = 1,000 ohms. On schematics, '4.7k' means 4,700 Ω." },
            { question: "What does '4.7k' mean on a schematic?", answer: "4.7k means 4.7 kilohms = 4,700 ohms. The 'k' suffix is shorthand for kilohms (×1,000). Similarly, '10k' = 10,000 Ω, '100k' = 100,000 Ω, and '1M' = 1,000,000 Ω (1 megaohm). This notation is standard in US electronics." },
            { question: "What resistor value do I need for an LED?", answer: "For a standard LED on a 5V Arduino: R = (5V - 2V) / 0.015A = 200 Ω → use 220 Ω (0.22 kΩ). For 3.3V: R = (3.3V - 2V) / 0.015A = 87 Ω → use 100 Ω (0.1 kΩ). The forward voltage drop varies by LED color (red ~2V, blue ~3.2V)." },
            { question: "Why is 10 kΩ used for pull-up/pull-down resistors?", answer: "10 kΩ (10,000 Ω) is a standard choice because it's high enough to limit wasted current (only 0.5 mA at 5V) but low enough to reliably pull the pin to a defined logic level. Too low wastes power; too high makes the pin susceptible to noise. 4.7 kΩ is also common for I²C buses." },
            { question: "How do I read resistor color codes?", answer: "For a 4-band resistor: Band 1 = first digit, Band 2 = second digit, Band 3 = multiplier, Band 4 = tolerance. Example: Yellow (4) - Violet (7) - Red (×100) = 4,700 Ω = 4.7 kΩ. Gold tolerance band = ±5%. Use our converter to verify: enter 4700 Ω → see 4.7 kΩ." },
            { question: "What's the difference between Ω, kΩ, and MΩ?", answer: "They're all units of resistance, differing by factors of 1,000: 1 kΩ = 1,000 Ω, 1 MΩ = 1,000 kΩ = 1,000,000 Ω. Ohms for low resistance (speakers, LED limiters), kilohms for most electronics (pull-ups, dividers), megaohms for insulation and high-impedance circuits." },
        ],
    },
    "deg-to-rad-converter": {
        subtitle: "Convert degrees to radians (° to rad). See exact π fractions, decimal radians, and sin/cos values. Essential for trigonometry, calculus, programming, and engineering.",
        contentHTML: `
            <h3>How to Convert Degrees to Radians</h3>
            <p>Multiply by <strong>π/180</strong> (approximately 0.01745):</p>
            <div class="explanation__highlight">
                <strong>radians = degrees × (π ÷ 180)</strong><br/><br/>
                Example: 45° (diagonal)<br/>
                = 45 × π/180 = <strong>π/4 ≈ 0.7854 rad</strong><br/><br/>
                Example: 90° (right angle)<br/>
                = 90 × π/180 = <strong>π/2 ≈ 1.5708 rad</strong><br/><br/>
                Example: 180° (straight line)<br/>
                = 180 × π/180 = <strong>π ≈ 3.1416 rad</strong>
            </div>
            <p><strong>Why π/180?</strong> A full circle = 360° = 2π radians. So 1° = 2π/360 = π/180 radians. The radian is the "natural" angle unit because an arc of length equal to the radius subtends exactly 1 radian.</p>

            <h3>Key Angles — Degrees to Radians</h3>
            <table>
                <thead><tr><th>Degrees</th><th>Radians (exact)</th><th>Radians (decimal)</th><th>sin</th><th>cos</th><th>tan</th></tr></thead>
                <tbody>
                    <tr><td><strong>0°</strong></td><td>0</td><td>0.0000</td><td>0</td><td>1</td><td>0</td></tr>
                    <tr><td><strong>30°</strong></td><td>π/6</td><td>0.5236</td><td>1/2</td><td>√3/2</td><td>√3/3</td></tr>
                    <tr><td><strong>45°</strong></td><td>π/4</td><td>0.7854</td><td>√2/2</td><td>√2/2</td><td>1</td></tr>
                    <tr><td><strong>60°</strong></td><td>π/3</td><td>1.0472</td><td>√3/2</td><td>1/2</td><td>√3</td></tr>
                    <tr><td><strong>90°</strong></td><td>π/2</td><td>1.5708</td><td>1</td><td>0</td><td>∞</td></tr>
                    <tr><td>120°</td><td>2π/3</td><td>2.0944</td><td>√3/2</td><td>−1/2</td><td>−√3</td></tr>
                    <tr><td>135°</td><td>3π/4</td><td>2.3562</td><td>√2/2</td><td>−√2/2</td><td>−1</td></tr>
                    <tr><td>150°</td><td>5π/6</td><td>2.6180</td><td>1/2</td><td>−√3/2</td><td>−√3/3</td></tr>
                    <tr><td><strong>180°</strong></td><td>π</td><td>3.1416</td><td>0</td><td>−1</td><td>0</td></tr>
                    <tr><td>270°</td><td>3π/2</td><td>4.7124</td><td>−1</td><td>0</td><td>∞</td></tr>
                    <tr><td><strong>360°</strong></td><td>2π</td><td>6.2832</td><td>0</td><td>1</td><td>0</td></tr>
                </tbody>
            </table>

            <h3>Radians in Programming Languages</h3>
            <table>
                <thead><tr><th>Language</th><th>Trig Functions Use</th><th>Convert Degrees → Radians</th></tr></thead>
                <tbody>
                    <tr><td><strong>JavaScript</strong></td><td>Radians</td><td>Math.sin(degrees * Math.PI / 180)</td></tr>
                    <tr><td><strong>Python</strong></td><td>Radians</td><td>math.radians(degrees) or numpy.deg2rad()</td></tr>
                    <tr><td><strong>C / C++</strong></td><td>Radians</td><td>sin(degrees * M_PI / 180.0)</td></tr>
                    <tr><td><strong>Java</strong></td><td>Radians</td><td>Math.toRadians(degrees)</td></tr>
                    <tr><td><strong>C#</strong></td><td>Radians</td><td>degrees * Math.PI / 180</td></tr>
                    <tr><td><strong>CSS</strong></td><td>Both</td><td>transform: rotate(1.5708rad) or rotate(90deg)</td></tr>
                </tbody>
            </table>
            <p><strong>Every major programming language</strong> uses radians for trigonometric functions. If you pass degrees to Math.sin() or sin(), you'll get wrong results. Always convert first!</p>

            <h3>Unit Circle — Quadrant Reference</h3>
            <table>
                <thead><tr><th>Quadrant</th><th>Degrees</th><th>Radians</th><th>sin</th><th>cos</th></tr></thead>
                <tbody>
                    <tr><td><strong>I</strong></td><td>0°–90°</td><td>0–π/2</td><td>+</td><td>+</td></tr>
                    <tr><td><strong>II</strong></td><td>90°–180°</td><td>π/2–π</td><td>+</td><td>−</td></tr>
                    <tr><td><strong>III</strong></td><td>180°–270°</td><td>π–3π/2</td><td>−</td><td>−</td></tr>
                    <tr><td><strong>IV</strong></td><td>270°–360°</td><td>3π/2–2π</td><td>−</td><td>+</td></tr>
                </tbody>
            </table>

            <h3>Angle Measurement Systems</h3>
            <table>
                <thead><tr><th>System</th><th>Full Circle</th><th>Right Angle</th><th>Used By</th></tr></thead>
                <tbody>
                    <tr><td><strong>Degrees (°)</strong></td><td>360°</td><td>90°</td><td>Navigation, construction, everyday</td></tr>
                    <tr><td><strong>Radians (rad)</strong></td><td>2π</td><td>π/2</td><td>Math, physics, programming</td></tr>
                    <tr><td>Gradians (gon)</td><td>400 gon</td><td>100 gon</td><td>European surveying</td></tr>
                    <tr><td>Turns</td><td>1 turn</td><td>0.25 turns</td><td>Engineering, astronomy</td></tr>
                </tbody>
            </table>

            <h3>What Is a Degree (°)?</h3>
            <p>A <strong>degree</strong> is 1/360th of a full rotation. The 360-degree system dates back to ancient Babylonians (who used base-60 math). Degrees are used in everyday life for navigation, construction, weather (wind direction), and education. In the US, degrees are taught first in geometry class before students encounter radians in precalculus or AP Calculus.</p>

            <h3>What Is a Radian?</h3>
            <p>A <strong>radian</strong> is the angle subtended by an arc equal in length to the radius of the circle. One full circle = 2π radians ≈ 6.2832 rad. Radians are the SI unit for angles and are required by virtually all programming languages and scientific calculations. They make calculus formulas cleaner: d/dx sin(x) = cos(x) only works when x is in radians.</p>
        `,
        faq: [
            { question: "How do you convert degrees to radians?", answer: "Multiply by π/180: radians = degrees × (π/180). For example, 90° = 90 × π/180 = π/2 ≈ 1.5708 radians. This works because a full circle is 360° = 2π radians, so 1° = π/180 radians." },
            { question: "Why do programming languages use radians?", answer: "All major programming languages (JavaScript, Python, C++, Java) use radians for Math.sin(), Math.cos(), etc. Radians are the mathematically 'natural' unit — calculus derivatives of trig functions only work correctly in radians. If you pass degrees to Math.sin(90), you'll get 0.894 instead of 1.0." },
            { question: "What is π/4 in degrees?", answer: "π/4 radians = 45°. This is one of the 'special angles' where sin and cos both equal √2/2 ≈ 0.7071. The special angles (π/6 = 30°, π/4 = 45°, π/3 = 60°, π/2 = 90°) are memorized by every US precalculus and AP Calculus student." },
            { question: "How many radians are in a circle?", answer: "A full circle = 2π radians ≈ 6.2832 radians. Half circle = π radians. Quarter circle (right angle) = π/2 radians. The circumference of a circle with radius r is 2πr, and since a radian is defined by arc length = radius, there are exactly 2π radians in a full rotation." },
            { question: "When do US students learn radians?", answer: "US students first encounter radians in precalculus (typically 11th or 12th grade) or AP Calculus. Before that, angles are always taught in degrees. Radians become essential in calculus, physics, and engineering. The College Board's AP Calculus AB/BC exams require radians for all trig problems." },
            { question: "How do I convert radians to degrees?", answer: "Multiply by 180/π: degrees = radians × (180/π). For example, π/3 radians = (π/3) × (180/π) = 60°. This is the reverse of the degrees-to-radians formula. You can also use our Radians to Degrees converter for instant results." },
        ],
    },
    "rad-to-deg-converter": {
        subtitle: "Convert radians to degrees (rad to °). See exact degree values, π fractions, and sin/cos. Essential for interpreting programming output, physics calculations, and engineering.",
        contentHTML: `
            <h3>How to Convert Radians to Degrees</h3>
            <p>Multiply by <strong>180/π</strong> (approximately 57.2958):</p>
            <div class="explanation__highlight">
                <strong>degrees = radians × (180 ÷ π)</strong><br/><br/>
                Example: π/2 rad (right angle)<br/>
                = 1.5708 × 57.2958 = <strong>90°</strong><br/><br/>
                Example: π/4 rad (diagonal)<br/>
                = 0.7854 × 57.2958 = <strong>45°</strong><br/><br/>
                Example: 1 radian<br/>
                = 1 × 57.2958 = <strong>57.2958°</strong>
            </div>
            <p><strong>Why 180/π?</strong> A full circle = 2π radians = 360°. So 1 radian = 360/(2π) = 180/π ≈ 57.2958°. This is the exact inverse of the degrees-to-radians formula (×π/180).</p>

            <h3>Key Radian Values in Degrees</h3>
            <table>
                <thead><tr><th>Radians</th><th>Exact (π)</th><th>Degrees</th><th>sin</th><th>cos</th><th>Where You See It</th></tr></thead>
                <tbody>
                    <tr><td>0.0000</td><td>0</td><td><strong>0°</strong></td><td>0</td><td>1</td><td>Starting angle</td></tr>
                    <tr><td>0.5236</td><td>π/6</td><td><strong>30°</strong></td><td>0.5</td><td>0.866</td><td>Special angle</td></tr>
                    <tr><td>0.7854</td><td>π/4</td><td><strong>45°</strong></td><td>0.707</td><td>0.707</td><td>Diagonal, atan2(1,1)</td></tr>
                    <tr><td>1.0472</td><td>π/3</td><td><strong>60°</strong></td><td>0.866</td><td>0.5</td><td>Hexagon angle</td></tr>
                    <tr><td><strong>1.5708</strong></td><td><strong>π/2</strong></td><td><strong>90°</strong></td><td>1</td><td>0</td><td><strong>Right angle, "up"</strong></td></tr>
                    <tr><td>2.0944</td><td>2π/3</td><td><strong>120°</strong></td><td>0.866</td><td>−0.5</td><td>Triangle vertex</td></tr>
                    <tr><td><strong>3.1416</strong></td><td><strong>π</strong></td><td><strong>180°</strong></td><td>0</td><td>−1</td><td><strong>Straight line, "behind"</strong></td></tr>
                    <tr><td>4.7124</td><td>3π/2</td><td><strong>270°</strong></td><td>−1</td><td>0</td><td>"Down" direction</td></tr>
                    <tr><td><strong>6.2832</strong></td><td><strong>2π</strong></td><td><strong>360°</strong></td><td>0</td><td>1</td><td><strong>Full rotation</strong></td></tr>
                    <tr><td>1.0000</td><td>—</td><td><strong>57.30°</strong></td><td>0.841</td><td>0.540</td><td>1 radian (radius arc)</td></tr>
                </tbody>
            </table>

            <h3>Common Radian Values from Programming</h3>
            <table>
                <thead><tr><th>Code Output</th><th>Radians</th><th>Degrees</th><th>Meaning</th></tr></thead>
                <tbody>
                    <tr><td>Math.atan2(1, 0)</td><td>1.5708</td><td>90°</td><td>Pointing straight up</td></tr>
                    <tr><td>Math.atan2(0, -1)</td><td>3.1416</td><td>180°</td><td>Pointing left</td></tr>
                    <tr><td>Math.atan2(-1, 0)</td><td>−1.5708</td><td>−90°</td><td>Pointing down</td></tr>
                    <tr><td>Math.atan2(1, 1)</td><td>0.7854</td><td>45°</td><td>Diagonal upper-right</td></tr>
                    <tr><td>Math.PI</td><td>3.14159</td><td>180°</td><td>Half rotation</td></tr>
                    <tr><td>Math.PI * 2</td><td>6.28318</td><td>360°</td><td>Full rotation</td></tr>
                    <tr><td>Math.asin(0.5)</td><td>0.5236</td><td>30°</td><td>Arc sine of 0.5</td></tr>
                    <tr><td>Math.acos(0)</td><td>1.5708</td><td>90°</td><td>Arc cosine of 0</td></tr>
                </tbody>
            </table>
            <p><strong>Every trig function</strong> in JavaScript, Python, C++, Java, and C# returns radians. To display angles to users, you must convert to degrees: <code>degrees = radians * 180 / Math.PI</code>.</p>

            <h3>Interpreting Radians in Real-World contexts</h3>
            <table>
                <thead><tr><th>Context</th><th>Radian Value</th><th>In Degrees</th><th>What It Means</th></tr></thead>
                <tbody>
                    <tr><td>Game dev: sprite rotation</td><td>0 to 2π</td><td>0° to 360°</td><td>Full sprite rotation</td></tr>
                    <tr><td>Robotics: servo angle</td><td>0 to π</td><td>0° to 180°</td><td>Standard servo range</td></tr>
                    <tr><td>CSS transform: rotate()</td><td>1.5708rad</td><td>90°</td><td>Quarter turn clockwise</td></tr>
                    <tr><td>Physics: angular velocity</td><td>rad/s</td><td>°/s × π/180</td><td>Rotation speed</td></tr>
                    <tr><td>Navigation: heading</td><td>0 to 2π</td><td>0° to 360°</td><td>Compass bearing</td></tr>
                </tbody>
            </table>

            <h3>What Is a Radian?</h3>
            <p>A <strong>radian</strong> is the angle where the arc length equals the radius. One full circle = 2π ≈ 6.2832 radians. Radians are the SI angle unit and are used by all programming languages for trig functions. The value 1 radian ≈ 57.3° — not an intuitive number, which is why developers often convert to degrees for display.</p>

            <h3>What Is a Degree?</h3>
            <p>A <strong>degree</strong> (°) is 1/360th of a full rotation. Degrees are intuitive for humans: 90° = right angle, 180° = half turn, 360° = full circle. In the US, degrees are the standard for construction, navigation, weather, and everyday use. Radians are only used in math, physics, and programming.</p>
        `,
        faq: [
            { question: "How do you convert radians to degrees?", answer: "Multiply by 180/π: degrees = radians × (180/π). For example, π/2 = 1.5708 × 57.2958 = 90°. This works because a full circle is 2π radians = 360°, so 1 radian = 180/π ≈ 57.2958°." },
            { question: "What is 1 radian in degrees?", answer: "1 radian = 180/π ≈ 57.2958°. This isn't a 'clean' number because radians and degrees are based on different systems — radians on π (circle geometry), degrees on the Babylonian base-60 system (360 = 6 × 60). One radian is the angle where the arc length equals the radius." },
            { question: "Why does Math.atan2() return radians?", answer: "All major programming languages (JavaScript, Python, C++, Java) return radians from trig functions because radians are the mathematical standard. To get degrees: degrees = Math.atan2(y, x) * 180 / Math.PI. For example, atan2(1, 0) returns 1.5708 rad = 90° (pointing up)." },
            { question: "How do I convert radians to degrees in JavaScript?", answer: "Use: degrees = radians * (180 / Math.PI). For example: let deg = Math.atan2(1, 1) * 180 / Math.PI; // 45. There's no built-in function — you must multiply manually. Python has math.degrees(), but JavaScript requires the formula." },
            { question: "What is π radians in degrees?", answer: "π radians = 180° (a straight line / half rotation). This is a fundamental relationship: π rad = 180°, 2π rad = 360°, π/2 rad = 90°. The entire degree-radian conversion system is built on this relationship." },
            { question: "When should I use radians vs degrees?", answer: "Use radians for: programming (all trig functions), calculus, physics, and engineering formulas. Use degrees for: UI display, user input, construction, navigation, and everyday communication. Most apps convert internally (radians) → display (degrees)." },
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
