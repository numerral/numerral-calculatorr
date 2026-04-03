import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

import CookingAirFryerCore from "@/components/calculator/CookingAirFryerCore";
import CookingCupsGramsCore from "@/components/calculator/CookingCupsGramsCore";
import CookingRecipeScaleCore from "@/components/calculator/CookingRecipeScaleCore";
import CookingPizzaCore from "@/components/calculator/CookingPizzaCore";
import CookingCakeCore from "@/components/calculator/CookingCakeCore";
import CookingTurkeySizeCore from "@/components/calculator/CookingTurkeySizeCore";
import CookingTurkeyTimeCore from "@/components/calculator/CookingTurkeyTimeCore";
import CookingTurkeyThawCore from "@/components/calculator/CookingTurkeyThawCore";
import CookingHamCore from "@/components/calculator/CookingHamCore";
import CookingUniversalConverterCore from "@/components/calculator/CookingUniversalConverterCore";

import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("cooking").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("cooking").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/cooking-calculators/${calc.slug}`) }
    };
}

const HUB_CONTENT: Record<string, any> = {
    "turkey-size-calculator": {
        subtitle: "Calculate exactly how big of a turkey you need to buy for Thanksgiving based on your number of guests and whether you want leftovers.",
        explanation: {
            heading: "How Much Turkey Per Person?",
            contentHTML: `<p>Buying the right size turkey ensures everyone is fed without spending money on massive excess. The mathematics of turkey sizing fundamentally depend on the bone-to-meat ratio of poultry.</p>
<h3>The General Rule</h3>
<div class="explanation__highlight"><strong>Rule of Thumb: Buy 1.25 lbs of turkey for every adult.</strong><br/><br/>Turkeys have a very high bone-to-meat ratio. A 16lb turkey will not yield 16lbs of meat. You can expect about 50% to 55% meat yield after roasting and carving.</div>
<ul>
<li><strong>Minimal Leftovers:</strong> Calculate 1.0 to 1.25 lbs per guest.</li>
<li><strong>Standard Leftovers:</strong> Calculate 1.5 lbs per guest. This guarantees enough for sandwiches the next day.</li>
<li><strong>Massive Birds (20+ lbs):</strong> Turkeys larger than 20 lbs actually yield a slightly higher percentage of meat because the skeleton stops growing proportionally as fast as the breast muscle.</li>
</ul>`,
            highlight: "Pro Tip: If you need to feed 20+ people, it is mathematically and thermodynamically better to buy two 12lb turkeys rather than one gigantic 24lb turkey. The smaller birds will cook faster, more evenly, and be less dry.",
        },
        faq: [
            { question: "How much turkey do I need for 10 adults?", answer: "For 10 adults with moderate leftovers, you should buy a 15-pound turkey (1.5 lbs per person)." },
            { question: "Do children count as a full portion?", answer: "Calculate children under 12 as a half-portion (0.5 to 0.75 lbs)." }
        ]
    },
    "turkey-cooking-time-calculator": {
        subtitle: "Calculate the exact baking time and temperature for your turkey, whether stuffed or unstuffed, to hit the safe 165°F internal temperature.",
        explanation: {
            heading: "The Thermodynamics of Roasting a Turkey",
            contentHTML: `<p>A turkey is a massive, irregularly shaped object. Cooking it safely to 165°F (74°C) without drying out the breast meat requires understanding standard USDA roasting times.</p>
<h3>Stuffed vs Unstuffed</h3>
<p>Because the cavity of a stuffed bird is filled with dense breading, heat cannot penetrate the center of the turkey effectively. <strong>A stuffed turkey takes roughly 20% to 30% longer to cook.</strong> The center of the stuffing MUST also reach 165°F.</p>
<div class="explanation__highlight"><strong>USDA Standard Roasting Times (at 325°F)</strong><br/>Unstuffed: 13 - 15 minutes per pound<br/>Stuffed: 15 - 18 minutes per pound</div>
<h3>Carryover Cooking</h3>
<p>When you pull a 15lb turkey out of a 325°F oven, the intense heat trapped in the outer layers will continue to migrate toward the interior. The temperature will rise by roughly 5°F to 10°F while resting. <strong>Pull the turkey when the breast hits 155°F or 160°F</strong> and let it rest for 30-45 minutes. It will finish cooking on the counter.</p>`,
            highlight: "Safety Warning: Never rely purely on time. Times are estimates based on standard ambient conditions. You must always verify with a digital meat thermometer inserted into the thickest part of the thigh and the deepest part of the breast.",
        },
        faq: [
            { question: "Should I cook my turkey at 325°F or 350°F?", answer: "325°F is the USDA standard for safe, even roasting of a large fowl. 350°F works, but dramatically increases the risk of the skin burning before the deep thigh meat is fully cooked." },
            { question: "How long to cook a 15lb unstuffed turkey?", answer: "At 325°F, an unstuffed 15lb turkey will take roughly 3 hours and 15 minutes to 3 hours and 45 minutes." }
        ]
    },
    "turkey-thawing-time-calculator": {
        subtitle: "Find out exactly how many days a frozen turkey needs to defrost safely in the refrigerator, or how many hours in cold water.",
        explanation: {
            heading: "Safe Thawing Protocols",
            contentHTML: `<p>Thawing a turkey incorrectly on a kitchen counter places the exterior of the bird in the "Danger Zone" (40°F - 140°F) for days while the core remains frozen, allowing catastrophic bacterial growth.</p>
<h3>Refrigerator Thawing (Recommended)</h3>
<div class="explanation__highlight"><strong>Rule: Allow 24 hours (1 day) of fridge thawing for every 4 to 5 pounds of turkey.</strong></div>
<p>This is the safest method. A 20lb turkey will take 4 to 5 full days to thaw in a 40°F refrigerator. Because the entire environment is below the danger zone, the turkey can safely sit in the fridge for an additional 2 days after it is completely thawed before cooking.</p>
<h3>Cold Water Thawing (Emergency Method)</h3>
<p>If you forgot to take the turkey out, you can thaw it rapidly by submerging it in cold tap water.</p>
<ul>
<li><strong>Rule:</strong> Allow 30 minutes per pound.</li>
<li><strong>Requirement:</strong> You MUST change the water every 30 minutes to ensure it stays cold enough to prevent bacterial growth while accelerating the ambient thermal transfer.</li>
<li>A 15lb turkey will take about 7.5 hours in cold water.</li>
</ul>`,
            highlight: "Safety Warning: Never thaw a turkey with hot water. The exterior will literally begin poaching and breeding bacteria while the interior remains ice-solid.",
        },
        faq: [
            { question: "How long does a 20lb turkey take to thaw in the fridge?", answer: "A 20lb turkey takes 4 to 5 full days to thaw in the refrigerator (roughly 24 hours per 4-5 lbs)." },
            { question: "Can I cook a completely frozen turkey?", answer: "Yes! According to the USDA, you can cook a frozen turkey safely, but it will take roughly 50% longer to cook than a fully thawed turkey. You cannot, however, deep fry a frozen turkey." }
        ]
    },
    "ham-calculator": {
        subtitle: "Calculate the perfect ham size for your holiday dinner and determine exact cooking times for spiral-sliced, bone-in, and boneless hams.",
        explanation: {
            heading: "Ham Sizing and Cooking Physics",
            contentHTML: `<p>Hams are entirely different from poultry. First, almost all holiday hams purchased in the USA are "City Hams," meaning they are already fully cooked and smoked. <strong>You are technically just reheating a ham, not cooking it.</strong></p>
<h3>How Much Ham Per Person?</h3>
<p>Because ham is dense and rich, you need less per person than turkey.</p>
<ul>
<li><strong>Bone-in Ham:</strong> Calculate 0.5 to 0.75 lbs per person.</li>
<li><strong>Boneless Ham:</strong> Calculate 0.33 to 0.5 lbs per person.</li>
</ul>
<h3>Reheating Times</h3>
<div class="explanation__highlight"><strong>Rule of Thumb: Reheat at 325°F until internal temp reaches 140°F.</strong><br/>- Bone-in: ~15 to 18 minutes per lb<br/>- Boneless: ~10 to 15 minutes per lb</div>
<p>Spiral cut hams are particularly vulnerable to drying out because they have been pre-sliced, maximizing surface area. Always cook them covered tightly in foil, only uncovering for the final 15 minutes to glaze and caramelize.</p>`,
            highlight: "Pro Tip: If you are serving both a Turkey and a Ham (a massive holiday feast), scale back the per-person math to 0.75 lbs for the turkey and 0.25 lbs for the ham.",
        },
        faq: [
            { question: "How long do I cook a 10lb spiral ham?", answer: "At 325°F, it should take roughly 10-15 minutes per pound, so about 1.5 to 2.5 hours. Check with a thermometer to ensure it hits 140°F." },
            { question: "Do I have to cook a city ham?", answer: "Technically, no. City hams are fully cured and smoked. You can legally and safely eat them cold right out of the package. We heat them purely for culinary pleasure." }
        ]
    },
    "grams-to-cups-converter": {
        subtitle: "Instantly convert metric grams to US customary cups based on the specific density of over 100 common baking ingredients.",
        explanation: {
            heading: "Volume vs Mass in Baking",
            contentHTML: `<p>Converting grams (a unit of mass) to cups (a unit of volume) is not a 1:1 mathematical equation. The conversion depends entirely on the <strong>density of the ingredient</strong>.</p>
<h3>Ingredient Differences</h3>
<p>For example, 100 grams of water is exactly 100 milliliters. But 100 grams of flour is incredibly fluffy and takes up much more physical space (volume). Therefore, 100 grams of flour requires more cups than 100 grams of water.</p>
<h3>Quick Conversion Links</h3>
<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    <a href="/cooking-calculators/grams-to-cups-converter?amount=50" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Cups is 50 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-cups-converter?amount=100" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Cups is 100 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-cups-converter?amount=150" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Cups is 150 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-cups-converter?amount=200" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Cups is 200 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-cups-converter?amount=250" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Cups is 250 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-cups-converter?amount=500" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Cups is 500 Grams?</span></a>
</div>`,
            highlight: "Pro Tip: If possible, always bake using grams. It completely removes the margin of error caused by how heavily you pack a cup.",
        },
        faq: [
            { question: "How many grams of flour are in a cup?", answer: "One US Cup of All-Purpose Flour is exactly 120 grams if the flour is spooned and leveled. If packed heavily into the cup, it can weigh as much as 150 grams." }
        ]
    },
    "grams-to-tablespoons-converter": {
        subtitle: "Convert metric grams into US tablespoons depending on exactly what dry or liquid ingredient you are measuring.",
        explanation: {
            heading: "Tablespoon Yields",
            contentHTML: `<p>A US Tablespoon is a volumetric measurement equal to exactly 14.7868 milliliters. When converting from grams to tablespoons, the weight of the ingredient changes how many spoons you need.</p>
<h3>Quick Conversion Links</h3>
<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    <a href="/cooking-calculators/grams-to-tablespoons-converter?amount=10" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons is 10 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-tablespoons-converter?amount=15" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons is 15 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-tablespoons-converter?amount=20" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons is 20 Grams?</span></a>
    <a href="/cooking-calculators/grams-to-tablespoons-converter?amount=50" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons is 50 Grams?</span></a>
</div>`,
            highlight: "Quick Reference: 1 Tablespoon of water is 15 grams. 1 Tablespoon of butter is 14.2 grams. 1 Tablespoon of flour is roughly 8 grams.",
        },
        faq: [
            { question: "How many grams is 1 tablespoon of sugar?", answer: "1 Tablespoon of granulated white sugar weighs 12.5 grams." }
        ]
    },
    "ounces-to-grams-converter": {
        subtitle: "Instantly and accurately convert standard dry weight ounces directly into metric grams for precise baking measurements.",
        explanation: {
            heading: "The Mass Conversion",
            contentHTML: `<p>This is a pure mass-to-mass mathematical conversion. Unlike volume-to-mass conversions, the density of the ingredient does not matter when converting Dry Ounces to Grams.</p>`,
            highlight: "Mathematical Constant: 1 Dry Ounce = 28.3495 Grams exactly.",
        },
        faq: [
            { question: "Is a dry ounce the same as a fluid ounce?", answer: "No! A dry ounce measures mass (weight). A fluid ounce measures volume (space). Do not confuse them." }
        ]
    },
    "tablespoons-to-cups-converter": {
        subtitle: "Fast volume converter bridging the gap between US tablespoons and US cups. Perfect for scaling recipes up or down.",
        explanation: {
            heading: "Standard Volumetric Scales",
            contentHTML: `<p>A pure volumetric conversion. Both Tablespoons and Cups measure the space an ingredient occupies.</p>
<h3>Quick Conversion Links</h3>
<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    <a href="/cooking-calculators/tablespoons-to-cups-converter?amount=1" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons In 1 Cup?</span></a>
    <a href="/cooking-calculators/tablespoons-to-cups-converter?amount=1/2" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons In 1/2 Cup?</span></a>
    <a href="/cooking-calculators/tablespoons-to-cups-converter?amount=1/3" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons In 1/3 Cup?</span></a>
    <a href="/cooking-calculators/tablespoons-to-cups-converter?amount=1/4" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons In 1/4 Cup?</span></a>
    <a href="/cooking-calculators/tablespoons-to-cups-converter?amount=2/3" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons In 2/3 Cup?</span></a>
    <a href="/cooking-calculators/tablespoons-to-cups-converter?amount=3/4" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Tablespoons In 3/4 Cup?</span></a>
</div>`,
            highlight: "Standard Scale: There are exactly 16 US Tablespoons in 1 US Customary Cup.",
        },
        faq: []
    },
    "teaspoons-to-tablespoons-converter": {
        subtitle: "Simple kitchen volumetric tool to scale US teaspoons up to tablespoons instantly.",
        explanation: {
            heading: "Tiny Measurements",
            contentHTML: `<p>When doubling or tripling a recipe, you quickly end up needing 9 or 12 teaspoons of an ingredient. It is highly inefficient to measure that out 12 times.</p>
<h3>Quick Conversion Links</h3>
<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
    <a href="/cooking-calculators/teaspoons-to-tablespoons-converter?amount=1/2" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Teaspoons in a 1/2 Tablespoon?</span></a>
    <a href="/cooking-calculators/teaspoons-to-tablespoons-converter?amount=1" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Teaspoons in a Tablespoon?</span></a>
    <a href="/cooking-calculators/teaspoons-to-tablespoons-converter?amount=2" class="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all group w-full"><span class="mr-3 text-emerald-500 group-hover:scale-110 transition-transform">🥄</span><span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">How Many Teaspoons in 2 Tablespoons?</span></a>
</div>`,
            highlight: "Standard Scale: There are exactly 3 Teaspoons in 1 Tablespoon.",
        },
        faq: []
    },
    "pizza-calculator": {
        subtitle: "Calculate exact ingredient weights for the perfect Neapolitan, New York, or Chicago style pizza dough using professional baker's percentages.",
        explanation: {
            heading: "What is Baker's Percentage?",
            contentHTML: `<p>Baker's percentage is a mathematical method used by professional bakers and pizzaiolos to formulaically balance dough. Instead of measuring by volume, <strong>every ingredient is expressed as a percentage of the total flour weight.</strong></p>
<h3>Understanding Hydration</h3>
<div class="explanation__highlight"><strong>Hydration = (Water Weight ÷ Flour Weight) × 100</strong><br/><br/>If you use 1000g of flour and 650g of water, your dough is exactly <strong>65% hydration.</strong></div>
<p>Different pizza styles demand precise hydration levels:</p>
<ul>
<li><strong>Neapolitan (Wood-fired):</strong> ≈ 58% - 65% hydration. High heat means less water is needed to avoid a gummy interior.</li>
<li><strong>New York Style (Home Oven):</strong> ≈ 60% - 68% hydration. The standard for foldable, crispy crusts.</li>
<li><strong>Detroit / Pan Pizza:</strong> ≈ 70% - 80%+ hydration. High water content creates massive air bubbles within thick crusts.</li>
</ul>
<h3>Salt and Yeast</h3>
<p>Salt is typically fixed around <strong>2% to 3%</strong> of flour weight. This regulates fermentation and strengthens the gluten network. Yeast amounts vary drastically based on fermentation time (e.g., a 72-hour cold ferment might only use 0.2% yeast, whereas a 2-hour rapid ferment might require 1.5%).</p>`,
            highlight: "Pro Tip: Always weigh your ingredients in grams. The margin of error when measuring flour or water by volume (cups) is easily high enough to completely ruin a high-hydration dough.",
        },
        faq: [
            { question: "Why do my dough balls end up sticky and unworkable?", answer: "Your hydration level is likely too high for your flour's protein content. Try dropping the hydration back to 60%. High protein flour (like Bread Flour or 00) can absorb significantly more water than standard All-Purpose flour." },
            { question: "How much dough is needed for a 12-inch pizza?", answer: "A classic 12-inch Neapolitan pizza requires about 250g to 260g of dough. For a thicker, more American style 12-inch, you might want 300g to 330g of dough." },
            { question: "What does salt do in pizza dough besides add flavor?", answer: "Salt tightens the gluten structure, making the dough less extensible (stretchy) but more elastic (strong). It also acts as an antioxidant and slows down the activity of the yeast, preventing over-fermentation." }
        ]
    },
    "cake-calculator": {
        subtitle: "Scale your cake batter perfectly between different pan sizes without sacrificing thickness. Instantly convert an 8-inch round layer to a 9x13 rectangular sheet pan.",
        explanation: {
            heading: "The Mathematics of Cake Pans",
            contentHTML: `<p>A common baking mistake is assuming that increasing a cake pan's diameter by 1 or 2 inches only requires a tiny bit more batter. Because pans are three-dimensional cylinders, <strong>volume increases exponentially with the radius.</strong></p>
<h3>Calculating Pan Volume</h3>
<div class="explanation__highlight"><strong>Area of a Round Pan = π × Radius²</strong><br/><br/>An 8-inch pan: 3.14 × (4)² = 50.24 sq inches<br/>A 10-inch pan: 3.14 × (5)² = 78.50 sq inches</br><strong>That is a mathematically massive 56% increase in volume!</strong></div>
<p>If you put an 8-inch cake recipe into a 10-inch pan without scaling the ingredients, your final baked layer will be paper-thin and dry.</p>
<h3>Baking Thermodynamics (Time & Temp)</h3>
<p>Scaling batter volume perfectly using our calculator guarantees the cake layers will have the identical height. However, the <strong>baking time must be adjusted manually.</strong></p>
<ul>
<li><strong>Larger Pan = Lower Temp + More Time.</strong> If you scale up to a massive sheet pan, the exterior perimeter of the batter will burn long before the center rises. Drop your oven temperature by 25°F and increase the baking time.</li>
<li><strong>Smaller Pans.</strong> Cupcakes or tiny 6-inch rounds bake much faster. </li>
</ul>`,
            highlight: "Rule of Thumb: Never fill any cake pan more than 2/3 full, regardless of how you scaled the recipe. Always leave room for the batter to rise.",
        },
        faq: [
            { question: "Can I use an 8x8 square pan instead of a 9-inch round pan?", answer: "Yes, they hold almost exactly the same volume. An 8x8 square pan is 64 square inches, and a 9-inch round pan is 63.5 square inches. You can substitute them 1:1." },
            { question: "Why did my scaled cake sink in the middle?", answer: "Usually this happens when baking a large cake (like a 10-inch or 12-inch round) at too high a temperature. The edges set immediately, while the massive center remains liquid. Try using a heating core or baking strips around the pan." },
            { question: "How do I calculate the area of a rectangular pan?", answer: "Length × Width. A standard 9x13 sheet pan is 117 square inches. This is roughly double the volume of a single 9-inch round cake pan." }
        ]
    },
    "recipe-scale-calculator": {
        subtitle: "Scale any recipe up or down with perfect mathematical precision. Whether doubling a cookie batch or halving a casserole, this tool automatically adjusts ingredient volumes and weights without messy kitchen fractions.",
        explanation: {
            heading: "How to Scale a Recipe",
            contentHTML: `<p>Scaling a recipe manually often leads to fractional disasters — like trying to measure "0.33 of a quarter-cup." Our recipe scale calculator standardizes this process by applying a universal <strong>conversion factor</strong> across all ingredients.</p>
<h3>The Scaling Formula</h3>
<div class="explanation__highlight"><strong>Conversion Factor = Desired Yield ÷ Original Yield</strong><br/><br/>If a recipe serves 4 and you want it to serve 10:<br/>Factor = 10 / 4 = <strong>2.5</strong></div>
<p>Every single ingredient (both weight and volume) is multiplied by 2.5.</p>
<h3>Baking Limitations</h3>
<p>While multiplying yields mathematically works perfectly, <strong>baking physics</strong> do not always scale linearly. If you double a cake recipe, you cannot simply double the baking time or temperature. A larger pan has a different surface-to-mass ratio, affecting thermal transfer. <strong>Always monitor larger batches physically, and rely on internal temperatures rather than structural timers.</strong></p>`,
            highlight: "Rule of Thumb: Never scale spices (like salt and cayenne) strictly linearly on huge batches. Spices compound quickly. When quadrupling a recipe, start with 3× the spices and taste.",
        },
        faq: [
            { question: "Can I just multiply everything in a recipe by two?", answer: "Mathematically, yes. Practically, you must be careful with strong spices, baking soda, and yeast. These ingredients compound, and doubling them can sometimes overpower the dish. It is safer to scale them by 1.5x and adjust to taste." },
            { question: "How do I cut a recipe in half?", answer: "Divide your desired yield by the original yield to get 0.5. Multiply all ingredients by 0.5. Half of 3/4 cup is 3/8 cup (which is exactly 6 tablespoons)." },
            { question: "Does baking time scale when I double a recipe?", answer: "No! Doubling a cake recipe and using a larger pan will require more time, but not double the time. You must bake until an internal thermometer reads the correct temperature (e.g., 200°F for bread)." }
        ]
    },
    "oven-to-air-fryer-converter": {
        subtitle: "Instantly convert conventional or convection oven instructions into precise air fryer settings. Save time and energy while achieving the perfect crispy texture.",
        explanation: {
            heading: "The Air Fryer Conversion Rule",
            contentHTML: `<p>An air fryer is essentially a high-powered convection oven. Because the heating element is extremely close to the food and the fan circulates hot air aggressively within a tiny chamber, thermal transfer is significantly more intense than in a standard oven.</p>
<h3>The 25/20 Rule</h3>
<p>To convert an oven recipe for the air fryer, you must reduce both the temperature and the time to prevent burning the exterior before the interior is fully cooked.</p>
<ul>
<li><strong>Reduce Temperature:</strong> Subtract 25°F (or ~15°C) from the oven temperature.</li>
<li><strong>Reduce Time:</strong> Multiply the original cooking time by 80% (a 20% reduction).</li>
</ul>
<div class="explanation__highlight">Oven: 400°F for 20 minutes<br/>Air Fryer: <strong>375°F for 16 minutes</strong></div>
<h3>Why Does This Happen?</h3>
<p>In thermodynamics, convection heating works by displacing the static boundary layer of cooler air that surrounds food. The aggressive fan in an air fryer strips this layer away constantly, exposing the food to violent direct heat. This causes the Maillard reaction (browning) to happen much faster.</p>`,
            highlight: "Air Fryer warning: Always check your food halfway through the assigned time. Small chambers meaning that sugar or marinades can caramelize and burn in a matter of minutes.",
        },
        faq: [
            { question: "How do I convert oven temp to air fryer temp?", answer: "Reduce the conventional oven temperature by 25°F. If the recipe calls for 400°F, set your air fryer to 375°F." },
            { question: "How much time do I cut for an air fryer?", answer: "Reduce the cooking time by 20% to 25%. If something takes 20 minutes in the oven, check it at 15 or 16 minutes in the air fryer." },
            { question: "Can I put aluminum foil in an air fryer?", answer: "Yes, you can use aluminum foil in most air fryers, but make sure it doesn't block the air flow (the fan) perfectly. Weigh it down with food so it doesn't get sucked into the heating element." }
        ]
    },
    "cups-to-grams-converter": {
        subtitle: "Convert volumetric baking measurements (cups) to mass (grams). Because every ingredient has a drastically different density, measuring by weight is the only way to guarantee baking success.",
        explanation: {
            heading: "Why You Must Bake by Weight",
            contentHTML: `<p>Volume measurements (like cups) measure <em>space</em>, not <em>substance</em>. A cup of flour can weigh anywhere from 100 grams to 150 grams depending on how you scoop it, how humid it is, and the brand of flour.</p>
<h3>The Chemistry of Baking Density</h3>
<p>Because baking formulas rely on precise chemical hydration ratios, a 30-gram disparity in flour will drastically dry out your cookie dough. Measuring by weight (grams) ensures 100% accuracy every time.</p>
<h3>Ingredient Densities</h3>
<table>
<thead><tr><th>Ingredient</th><th>Density (g/cup)</th><th>Why It Matters</th></tr></thead>
<tbody>
<tr><td>All-Purpose Flour</td><td>120g</td><td>Easily compacted. Scooping heavily adds up to 30% more flour.</td></tr>
<tr><td>Granulated Sugar</td><td>200g</td><td>Crystalline structure makes density very stable.</td></tr>
<tr><td>Powdered Sugar</td><td>113g</td><td>Highly aerated. Must be weighed for icing consistency.</td></tr>
<tr><td>Butter</td><td>227g</td><td>Fat density. 1 stick = 1/2 cup = 113.5g.</td></tr>
<tr><td>Cocoa Powder</td><td>100g</td><td>Very light, but highly absorbent. Too much ruins moisture.</td></tr>
</tbody>
</table>`,
            highlight: "Pro Tip: 1 cup of water weighs exactly 236.59 grams. In baking, water, milk, and eggs (which are mostly water) have a 1:1 volume-to-weight ratio in mL vs grams.",
        },
        faq: [
            { question: "How many grams are in a cup of flour?", answer: "A standard, properly spooned-and-leveled cup of all-purpose flour weighs 120 grams. If you dip the measuring cup directly into the bag, it can weigh over 140 grams due to compaction." },
            { question: "How many grams in a cup of butter?", answer: "One cup of butter weighs 227 grams. In the US, this is exactly 2 sticks of butter." },
            { question: "Is metric better than US customary for baking?", answer: "Yes. Metric weight (grams) allows for single-unit precision without dealing in fractions. It completely removes human error associated with volume compression." }
        ]
    }
};

export default async function CookingCalculatorRoute({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("cooking").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/cooking-calculators/${calc.slug}`);
    
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Cooking & Baking Calculators", url: canonicalUrl("/cooking-calculators") },
            { name: calc.title }
        ]),
        webAppSchema(calc.title, pageUrl)
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-cooking-sub" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Cooking & Baking Calculators", href: "/cooking-calculators" },
                { label: calc.title.replace(/ Calculator.*$/, "") }
            ]} />
            
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            
            <AuthorBadge categoryKey="cooking" />

            <div className="layout-2col">
                <div className="layout-2col__main">
                    
                    {/* Render the specific cooking calculator core */}
                    {calc.id === "oven-to-air-fryer-converter" && <CookingAirFryerCore />}
                    {calc.id === "cups-to-grams-converter" && <CookingCupsGramsCore />}
                    {calc.id === "recipe-scale-calculator" && <CookingRecipeScaleCore />}
                    {calc.id === "pizza-calculator" && <CookingPizzaCore />}
                    {calc.id === "cake-calculator" && <CookingCakeCore />}
                    {calc.id === "turkey-size-calculator" && <CookingTurkeySizeCore />}
                    {calc.id === "turkey-cooking-time-calculator" && <CookingTurkeyTimeCore />}
                    {calc.id === "turkey-thawing-time-calculator" && <CookingTurkeyThawCore />}
                    {calc.id === "ham-calculator" && <CookingHamCore />}
                    
                    {calc.calcType === "cooking-universal" && <CookingUniversalConverterCore calculatorId={calc.id} />}

                    {content && (<>
                        <DynamicExplanation 
                            heading={content.explanation?.heading} 
                            paragraphs={content.explanation?.paragraphs} 
                            contentHTML={content.explanation?.contentHTML} 
                            highlight={content.explanation?.highlight} 
                        />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar relative">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-4 border-b border-emerald-200 dark:border-emerald-800/50 pb-2">
                            🥘 Cooking Measurements
                        </h3>
                        <div className="flex flex-col space-y-2">
                            {getCalculatorsByCategory("cooking").map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/cooking-calculators/${item.slug}`}
                                    style={{ display: 'flex', alignItems: 'flex-start', padding: '0.5rem 0' }}
                                    className={`group text-sm transition-colors ${
                                        item.id === calc.id 
                                        ? "text-emerald-600 dark:text-emerald-400 font-semibold" 
                                        : "text-gray-600 dark:text-gray-400 hover:text-emerald-500"
                                    }`}
                                >
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 mr-2 -ml-4 absolute">▹</span>
                                    <span>{item.title.replace(/ Calculator.*$/, "").replace(/ Converter.*$/, "")}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
