import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CategoryGrid from "@/components/shared/CategoryGrid";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { getCalculatorsByCategory, type CalculatorDef } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Cooking & Baking Calculators — Recipe Scale & Conversions",
    description: "Free cooking and baking calculators to scale recipes, convert oven to air fryer temperatures, and translate baking ingredients from cups to grams.",
    keywords: ["cooking calculators", "baking calculators", "recipe scale", "baking conversion", "kitchen math", "cups to grams"],
    alternates: { canonical: canonicalUrl("/cooking-calculators") },
};

const FAQ_ITEMS = [
    { question: "Why is baking called a science?", answer: "Baking relies on precise chemical reactions between ingredients like flour, yeast, baking soda, and fats. Because exact ratios are required for the perfect rise, texture, and flavor, professional bakers measure ingredients by weight (grams) rather than volume (cups)." },
    { question: "How do I convert cups to grams for baking?", answer: "Converting volume (cups) to weight (grams) depends entirely on the ingredient's density. For example, 1 cup of all-purpose flour is about 120 grams, but 1 cup of granulated sugar is 200 grams. Use our Cups to Grams Converter for accurate measurements." },
    { question: "How do I scale a recipe up or down?", answer: "To scale a recipe, divide the desired yield by the original yield to get your conversion factor. Then, multiply every ingredient amount by that factor. Our Recipe Scale Calculator does this math automatically for you." },
    { question: "How do I convert oven times to air fryer times?", answer: "As a general rule, reduce the temperature by 25°F (or about 15°C) and reduce the cooking time by 20% to 25%. Our Oven to Air Fryer Converter applies this formula automatically to any dish." },
    { question: "What is baker's percentage?", answer: "Baker's percentage is a mathematical method used to scale recipes where flour is always set at 100%, and all other ingredients are calculated as a percentage of the flour's weight. This makes scaling massive batches of dough incredibly easy." },
];

export default function CookingCalculatorsHub() {
    // 1. Fetch calculators for the grid
    const cookingCalcs = getCalculatorsByCategory("cooking");

    // 2. Structured data
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Cooking & Baking Calculators" },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map(f => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer }
            }))
        }
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-cooking-hub" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Cooking & Baking Calculators" },
            ]} />

            {/* Hub Header */}
            <div style={{ marginBottom: "var(--s-6)" }}>
                <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Cooking & Baking Calculators</h1>
                <p className="t-body" style={{ color: "var(--n-text-muted)", maxWidth: "800px" }}>
                    Take the guesswork out of kitchen math. Our expert-reviewed cooking and baking calculators help you scale recipes automatically, convert ingredient weights from metric to US customary units, and calculate precise cooking times for perfect meals.
                </p>
            </div>

            {/* The primary calculator grid */}
            <section style={{ marginBottom: "var(--s-12)" }}>
                <div className="calc-index-grid">
                    {cookingCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/cooking-calculators/${calc.slug}`}
                            className="calc-index-card"
                        >
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body">
                                <h3>{calc.title}</h3>
                                <p>{calc.description}</p>
                                <span className="calc-index-card__stars">
                                    {"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Deep NLP Educational Content */}
            <section className="hub-content" style={{ marginTop: "var(--s-8)", marginBottom: "var(--s-6)" }}
                     dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}
            />

            {/* Rich FAQ block */}
            <FAQAccordion title="Cooking & Baking FAQs" items={FAQ_ITEMS} />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["cooking"]} />
            </section>
        </main>
    );
}

const CONTENT_HTML = `
<h2 id="kitchen-math">The Science of Kitchen Math</h2>
<p>Whether you're doubling a thanksgiving turkey recipe or converting an authentic European pastry formula from metric to US customary units, cooking is fundamentally an exercise in chemistry and math. Understanding how to manage yields, temperatures, and densities is the key to consistent results in the kitchen.</p>

<h3 id="weight-vs-volume">Weight vs. Volume (Why Cups Can Fail You)</h3>
<p>The most common source of baking failure in the United States is measuring dry ingredients by volume (cups, tablespoons) rather than by weight (grams, ounces). Because ingredients have different densities, the same volume can yield drastically different weights.</p>
<ul>
<li><strong>Flour compression:</strong> Depending on how densely you pack a measuring cup, 1 cup of all-purpose flour can weigh anywhere from 100 grams to 150 grams. A kitchen scale ensures you use exactly 120 grams every time.</li>
<li><strong>Salt varieties:</strong> 1 tablespoon of fine table salt contains nearly twice the sodium of 1 tablespoon of Diamond Crystal kosher salt because of the crystal size.</li>
<li><strong>Brown sugar:</strong> This is why recipes explicitly specify "packed" brown sugar—to standardize the density inside the volume measurement.</li>
</ul>
<p>Use our <strong>Cups to Grams Converter</strong> to eliminate this error margin and translate your volume-based recipes into a pro-level weight format.</p>

<h3 id="recipe-scaling">How to Scale Recipes Up or Down</h3>
<p>Scaling a recipe isn't always as simple as multiplying by two. The formula for finding your conversion multiplier is:</p>
<p style="text-align:center;font-weight:700;font-size:1.1em">Conversion Factor = Desired Yield ÷ Original Yield</p>
<p>For example, if a recipe makes 12 cookies and you want 30 cookies: <code>30 ÷ 12 = 2.5</code>. You multiply every ingredient by 2.5.</p>
<p><strong>🚨 Warning: Pan sizes don't scale linearly.</strong><br/>
If you scale a cake recipe up by 2×, you cannot just double the temperature or the baking time. The volume of batter increases exponentially relative to the surface area of the pan. You must use a thermometer and monitor the bake visually. You can use our <strong>Recipe Scale Calculator</strong> to adjust ingredient yields securely.</p>

<h3 id="oven-to-airfryer">Oven to Air Fryer Conversion Rules</h3>
<p>An air fryer is essentially a highly efficient convection oven. Because the fan blows intense hot air directly onto the food in a small chamber, thermal transfer is much faster. To convert a standard oven recipe for the air fryer, use this rule of thumb:</p>
<ul>
<li><strong>Temperature:</strong> Reduce by 25°F (or 15°C).</li>
<li><strong>Time:</strong> Reduce the overall cooking time by 20% to 25%.</li>
</ul>
<p>For example, chicken tenders that bake at 400°F for 20 minutes in a conventional oven should be air-fried at 375°F for roughly 15 minutes. Always check internal meat temperatures with a digital probe.</p>

<h2 id="us-customary">US Customary vs. Metric Kitchen Units</h2>
<p>The United States relies on the Customary system, which can be confusing when dealing with international recipes. Here are the core baseline conversions you need to know:</p>

<div style="overflow-x:auto;">
<table style="width:100%; border-collapse:collapse; margin-top:1rem; margin-bottom:1.5rem;">
<thead>
<tr>
<th style="text-align:left; padding:8px; border-bottom:2px solid var(--n-border);">Measurement</th>
<th style="text-align:left; padding:8px; border-bottom:2px solid var(--n-border);">US Customary Unit</th>
<th style="text-align:left; padding:8px; border-bottom:2px solid var(--n-border);">Metric Equivalent</th>
</tr>
</thead>
<tbody>
<tr>
<td style="padding:8px; border-bottom:1px solid var(--n-border);"><strong>Volume (Liquid)</strong></td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">1 Fluid Ounce (fl oz)</td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">29.57 mL</td>
</tr>
<tr>
<td style="padding:8px; border-bottom:1px solid var(--n-border);"><strong>Volume (Dry/Liquid)</strong></td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">1 Cup (c)</td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">236.59 mL (Standard)</td>
</tr>
<tr>
<td style="padding:8px; border-bottom:1px solid var(--n-border);"><strong>Weight</strong></td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">1 Ounce (oz)</td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">28.35 Grams (g)</td>
</tr>
<tr>
<td style="padding:8px; border-bottom:1px solid var(--n-border);"><strong>Weight</strong></td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">1 Pound (lb)</td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">453.59 Grams (g)</td>
</tr>
<tr>
<td style="padding:8px; border-bottom:1px solid var(--n-border);"><strong>Temperature</strong></td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">350° Fahrenheit (°F)</td>
<td style="padding:8px; border-bottom:1px solid var(--n-border);">175° Celsius (°C)</td>
</tr>
</tbody>
</table>
</div>
`;
