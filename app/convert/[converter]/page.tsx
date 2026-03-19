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
