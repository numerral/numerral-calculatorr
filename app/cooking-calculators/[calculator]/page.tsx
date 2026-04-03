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
        subtitle: "Scale a recipe and adjust every ingredient instantly using our professional recipe multiplier and conversion calculator. Whether you're doubling a cookie batch for a bake sale, halving a casserole for two, or scaling a dinner recipe for 50 guests at a potluck, this tool calculates exact quantities — no messy kitchen math required.",
        explanation: {
            heading: "How to Scale a Recipe — Step-by-Step Guide",
            contentHTML: `<p>Scaling a recipe is one of the most common kitchen tasks, yet it's also one of the most error-prone. Whether you're a home cook doubling Grandma's chocolate chip cookie recipe or a professional caterer preparing a wedding dinner for 200, the mathematical process is the same — but the pitfalls are surprisingly nuanced.</p>
<p>This complete guide walks you through the professional method used by culinary schools, restaurant kitchens, and food service operations across the United States.<sup><a href="#ref-1">[1]</a></sup></p>

<h3>Step 1: Calculate the Conversion Factor</h3>
<p>The <strong>conversion factor</strong> (also called the <strong>recipe conversion factor</strong> or <strong>scaling factor</strong>) is the single number you'll multiply every ingredient by. Industry professionals call the number of portions the <strong>yield</strong>, so the conversion factor is the required yield divided by the recipe's yield.<sup><a href="#ref-1">[1]</a></sup></p>
<div class="explanation__highlight"><strong>Conversion Factor = Desired Yield ÷ Original Yield</strong><br/><br/>If a recipe serves 4 and you want it to serve 10:<br/>Factor = 10 ÷ 4 = <strong>2.5</strong><br/><br/>Doubling a recipe: Factor = <strong>2.0</strong><br/>Halving a recipe: Factor = <strong>0.5</strong><br/>Tripling a recipe: Factor = <strong>3.0</strong></div>
<p>You can also use our <a href="/cooking-calculators/cake-calculator">cake pan calculator</a> to find the conversion factor between different pan sizes — since a 10-inch round pan has 56% more area than an 8-inch pan, the factor would be 1.56.</p>

<h3>Step 2: Multiply Every Ingredient by the Factor</h3>
<p>Once you have your conversion factor, multiply the quantity of each ingredient by that number. For example, if the conversion factor is 2.5 and the recipe calls for 3 tablespoons of an ingredient, the scaled calculation would be 2.5 × 3 = 7.5 tablespoons.</p>
<p>Enter your ingredients in our calculator above and it will handle all the multiplication instantly — including for complex decimal results that would be difficult to calculate by hand.</p>

<h3>Step 3: Convert Awkward Measurements to Practical Units</h3>
<p>After scaling, you'll often end up with impractical measurements like "24 teaspoons" or "6.5 tablespoons." This step is optional but greatly simplifies your recipe — and it's what professional chefs do.<sup><a href="#ref-1">[1]</a></sup> Convert these to larger, more convenient units using the reference chart below or our <a href="/cooking-calculators/tablespoons-to-cups-converter">tablespoons to cups converter</a> and <a href="/cooking-calculators/teaspoons-to-tablespoons-converter">teaspoons to tablespoons converter</a>.</p>
<p>For example: 24 teaspoons = 8 tablespoons = ½ cup. Much easier to measure.</p>

<h3>Step 4: Adjust Leaveners, Spices & Seasonings</h3>
<p>This is the step most recipe scaling guides miss — and it's the most important one for achieving professional results. <strong>Not all ingredients scale linearly.</strong></p>
<ul>
<li><strong>Leaveners (baking powder, baking soda, yeast):</strong> When scaling beyond 2×, use only 75–80% of the calculated amount. Over-leavening causes cakes to rise too fast and then collapse, or bread to develop large, irregular air pockets. For a 4× batch, use 3× the leavener and test.<sup><a href="#ref-4">[4]</a></sup></li>
<li><strong>Salt:</strong> Scale at 75% of the calculated amount and adjust to taste. Salt perception compounds — what tastes balanced in a small batch can taste aggressively salty in a large one.</li>
<li><strong>Strong spices (cayenne, cinnamon, cloves, nutmeg):</strong> Start at 50–75% of the calculated amount. These compounds become exponentially more potent in larger volumes because more surface area of the food is exposed during cooking.</li>
<li><strong>Vanilla extract and other flavorings:</strong> Scale at about 80%. Alcohol-based extracts concentrate differently in larger batches.</li>
<li><strong>Eggs:</strong> Scale normally. If a scaled recipe calls for a fractional egg (like 1.5 eggs), beat a whole egg thoroughly (it yields about 3 tablespoons), then measure out 1.5 tablespoons for half an egg.</li>
</ul>

<h2>Common Kitchen Measurement Conversion Chart</h2>
<p>When you scale a recipe, you'll frequently need to convert between US kitchen measurements. This comprehensive reference table covers every standard conversion used in American cooking and baking.</p>

<h3>US Volume Equivalents</h3>
<table>
<thead><tr><th>Measurement</th><th>Tablespoons</th><th>Teaspoons</th><th>Fluid Ounces</th><th>Milliliters</th></tr></thead>
<tbody>
<tr><td><strong>1 teaspoon</strong></td><td>⅓ tbsp</td><td>1 tsp</td><td>—</td><td>4.93 mL</td></tr>
<tr><td><strong>1 tablespoon</strong></td><td>1 tbsp</td><td>3 tsp</td><td>½ fl oz</td><td>14.79 mL</td></tr>
<tr><td><strong>⅛ cup</strong></td><td>2 tbsp</td><td>6 tsp</td><td>1 fl oz</td><td>29.57 mL</td></tr>
<tr><td><strong>¼ cup</strong></td><td>4 tbsp</td><td>12 tsp</td><td>2 fl oz</td><td>59.15 mL</td></tr>
<tr><td><strong>⅓ cup</strong></td><td>5 tbsp + 1 tsp</td><td>16 tsp</td><td>2.67 fl oz</td><td>78.86 mL</td></tr>
<tr><td><strong>½ cup</strong></td><td>8 tbsp</td><td>24 tsp</td><td>4 fl oz</td><td>118.29 mL</td></tr>
<tr><td><strong>⅔ cup</strong></td><td>10 tbsp + 2 tsp</td><td>32 tsp</td><td>5.33 fl oz</td><td>157.73 mL</td></tr>
<tr><td><strong>¾ cup</strong></td><td>12 tbsp</td><td>36 tsp</td><td>6 fl oz</td><td>177.44 mL</td></tr>
<tr><td><strong>1 cup</strong></td><td>16 tbsp</td><td>48 tsp</td><td>8 fl oz</td><td>236.59 mL</td></tr>
<tr><td><strong>1 pint</strong></td><td>32 tbsp</td><td>—</td><td>16 fl oz</td><td>473.18 mL</td></tr>
<tr><td><strong>1 quart</strong></td><td>64 tbsp</td><td>—</td><td>32 fl oz</td><td>946.35 mL</td></tr>
<tr><td><strong>1 gallon</strong></td><td>256 tbsp</td><td>—</td><td>128 fl oz</td><td>3,785 mL</td></tr>
</tbody>
</table>
<p>Use our <a href="/cooking-calculators/tablespoons-to-cups-converter">tablespoons to cups converter</a> or <a href="/cooking-calculators/teaspoons-to-tablespoons-converter">teaspoons to tablespoons converter</a> for instant calculations.</p>

<h3>US Weight Equivalents</h3>
<table>
<thead><tr><th>Imperial Weight</th><th>Metric Weight</th><th>Common Kitchen Use</th></tr></thead>
<tbody>
<tr><td>½ oz</td><td>14 g</td><td>Small spice amounts</td></tr>
<tr><td>1 oz</td><td>28.35 g</td><td>Cheese, chocolate squares</td></tr>
<tr><td>4 oz (¼ lb)</td><td>113 g</td><td>1 stick of butter</td></tr>
<tr><td>8 oz (½ lb)</td><td>227 g</td><td>2 sticks of butter (1 cup)</td></tr>
<tr><td>12 oz (¾ lb)</td><td>340 g</td><td>Standard bag of chocolate chips</td></tr>
<tr><td>16 oz (1 lb)</td><td>454 g</td><td>Standard baking measurement</td></tr>
</tbody>
</table>
<p>Need to convert between weight and volume? Use our <a href="/cooking-calculators/cups-to-grams-converter">cups to grams converter</a> or <a href="/cooking-calculators/grams-to-cups-converter">grams to cups converter</a> for ingredient-specific results.</p>

<h3>Fraction-to-Decimal Quick Reference</h3>
<p>When your scaled recipe shows a decimal result, use this table to convert it back to a practical kitchen fraction:</p>
<table>
<thead><tr><th>Fraction</th><th>Decimal</th><th>Practical Interpretation</th></tr></thead>
<tbody>
<tr><td>⅛</td><td>0.125</td><td>"About ⅛ of the unit"</td></tr>
<tr><td>¼</td><td>0.25</td><td>"Exactly one quarter"</td></tr>
<tr><td>⅓</td><td>0.333</td><td>"About one third"</td></tr>
<tr><td>⅜</td><td>0.375</td><td>"Between ⅓ and ½"</td></tr>
<tr><td>½</td><td>0.5</td><td>"Exactly half"</td></tr>
<tr><td>⅝</td><td>0.625</td><td>"Between ½ and ⅔"</td></tr>
<tr><td>⅔</td><td>0.667</td><td>"About two thirds"</td></tr>
<tr><td>¾</td><td>0.75</td><td>"Exactly three quarters"</td></tr>
<tr><td>⅞</td><td>0.875</td><td>"Almost one full unit"</td></tr>
</tbody>
</table>

<h2>Scaling by Recipe Type — What Changes and What Doesn't</h2>
<p>Not all recipes behave the same way when scaled. Understanding the fundamental difference between cooking and baking is critical for achieving consistent results.</p>

<h3>Scaling Savory Recipes (Soups, Stews, Casseroles)</h3>
<p>Savory recipes are generally <strong>forgiving</strong> when scaled. Because you can taste and adjust as you cook, you have significant room to fix seasoning, adjust liquid levels, and balance flavors during the cooking process. The primary concern with large batches is ensuring your pot or pan is large enough — overcrowding changes cooking dynamics.</p>

<h3>Scaling Baking Recipes (Cakes, Cookies, Bread)</h3>
<p>Baking, by contrast, is a <strong>science of precise ratios</strong>.<sup><a href="#ref-4">[4]</a></sup> The ratio of flour to fat to liquid to leavener determines the final texture, rise, and structure. Even small deviations — a tablespoon of extra flour, a touch too much baking soda — can produce a completely different product. This is why professional bakers and pastry chefs always measure by weight (grams), never by volume (cups).<sup><a href="#ref-2">[2]</a></sup></p>

<h3>When to Make Multiple Batches Instead of Scaling</h3>
<p>For delicate baked goods — soufflés, angel food cake, custards, meringues, and candy — it is almost always safer to <strong>make multiple separate batches</strong> rather than scaling a single batch beyond 2×. The chemistry of large batches of these items is fundamentally different due to protein denaturation rates, sugar crystallization behavior, and egg foam stability.</p>
<p>Rule of thumb: if a recipe relies on whipped egg whites, sugar syrup reaching a specific temperature, or precise gelatin ratios, do not scale beyond 2×. Make two batches instead.</p>

<h2>Weight vs. Volume — Why Professional Chefs Measure by Grams</h2>
<p>The single most important improvement you can make to your recipe scaling accuracy is switching from volume measurements (cups, tablespoons) to weight measurements (grams, ounces). The <strong>National Institute of Standards and Technology (NIST)</strong> recommends measuring dry ingredients by weight for accuracy in culinary applications.<sup><a href="#ref-2">[2]</a></sup></p>

<h3>How Cup Measurements Introduce Error</h3>
<p>A "cup of flour" is not a standardized amount. Depending on how you measure it, 1 cup of all-purpose flour can weigh anywhere from <strong>120 grams</strong> (spooned and leveled) to <strong>150 grams</strong> (scooped directly from the bag). That's a 25% variation — and when you multiply that error by a scaling factor of 3× or 4×, the difference becomes catastrophic.</p>
<p>For example: quadrupling a recipe that calls for 2 cups of flour could mean using anywhere from 960g to 1,200g — a 240-gram difference. That's nearly an entire extra cup of flour, enough to turn a moist cake into a dry brick.</p>

<h3>The Flour Problem</h3>
<p>Flour is the single most commonly mismeasured ingredient in American kitchens. The correct technique is the <strong>spoon-and-level method</strong>: use a spoon to aerate and transfer flour into the measuring cup, then level the top with a straight edge. Never scoop directly from the bag — the compression adds 20–30% more flour. Better yet, use a kitchen scale. Our <a href="/cooking-calculators/cups-to-grams-converter">cups to grams converter</a> and <a href="/cooking-calculators/grams-to-cups-converter">grams to cups converter</a> can help you convert any recipe from volume to weight measurements before scaling.</p>

<h3>Essential Kitchen Tools for Accurate Scaling</h3>
<ul>
<li><strong>Digital kitchen scale</strong> (accuracy to 1 gram) — the single most valuable tool for any baker who scales recipes regularly</li>
<li><strong>Instant-read thermometer</strong> — essential for verifying doneness when cooking times change due to scaling</li>
<li><strong>Liquid measuring cups</strong> (glass, for reading at eye level) — use for all liquids; never use dry measuring cups for liquids</li>
<li><strong>Nested dry measuring cups</strong> (stainless steel) — use the spoon-and-level technique for dry ingredients when a scale isn't available</li>
</ul>

<h2>How Cooking and Baking Times Change When You Scale</h2>
<p>One of the most common mistakes home cooks make is assuming that doubling a recipe means doubling the cooking time. <strong>It doesn't.</strong> The relationship between batch size and cooking time is non-linear because it depends on the <strong>surface-to-volume ratio</strong> of the food.</p>

<h3>The Surface-to-Volume Ratio Problem</h3>
<p>Heat enters food through its surface. When you increase the volume of food, the interior has proportionally less surface area per unit of mass, so heat takes longer to reach the center. This is why a large turkey takes disproportionately longer per pound than a small one — and why a doubled batch of soup in a larger pot takes longer to come to temperature than two separate pots.</p>

<h3>Temperature Adjustments for Larger Batches</h3>
<p>For baked goods in larger pans, reduce the oven temperature by <strong>25°F</strong> and increase baking time by approximately <strong>15–25%</strong>. The lower temperature prevents the exterior from burning before heat reaches the center. For stovetop cooking, larger volumes simply take more time at the same temperature — a doubled soup recipe may need 20–30% more simmering time.</p>
<p>Converting between oven and air fryer? Our <a href="/cooking-calculators/oven-to-air-fryer-converter">oven to air fryer converter</a> handles the temperature and time adjustments automatically.</p>

<h3>Use a Thermometer, Not a Timer</h3>
<p>The USDA recommends using an instant-read thermometer to verify doneness rather than relying on time alone. Target internal temperatures for common items: bread (190°F–210°F), cakes (205°F–210°F), chicken (165°F), and beef roasts (145°F for medium-rare).<sup><a href="#ref-3">[3]</a></sup></p>

<h2>Common Scaling Scenarios for American Home Cooks</h2>

<h3>How to Double a Recipe (Factor: 2×)</h3>
<p>The most common scaling task. Multiply every ingredient by 2. Use 1.75× for baking powder and baking soda. If using a larger pan, reduce oven temperature by 25°F. Cooking time increases by approximately 10–15 minutes for baked goods.</p>

<h3>How to Halve a Recipe (Factor: 0.5×)</h3>
<p>Multiply every ingredient by 0.5. The trickiest part is halving eggs: beat 1 whole egg (yields ~3 tablespoons), then use 1½ tablespoons for half an egg. Reduce baking time by approximately 25%. Check for doneness 5–10 minutes early.</p>

<h3>How to Scale a Recipe for 50 People (Party/Potluck)</h3>
<p>For large events, calculate the factor (e.g., 50 ÷ 6 = 8.33×). <strong>Always convert all ingredients to weight (grams or ounces) before scaling at this magnitude.</strong> Volume measurement errors compound exponentially at high factors. Season conservatively — start at 60% of the calculated spice amounts. Plan to make the recipe in manageable batches (e.g., four 12-person batches) rather than one enormous batch, especially for baked goods.</p>

<h3>How to Convert Between Pan Sizes</h3>
<p>When scaling a batter recipe, the pan area determines how much batter you need. Use our <a href="/cooking-calculators/cake-calculator">cake pan calculator</a> for precision. Quick reference: an 8″ round pan (50 sq in) requires about 56% less batter than a 9×13″ sheet (117 sq in). Never fill any pan more than ⅔ full to allow room for rising.</p>

<h2>References</h2>
<ol style="font-size: 0.875rem; color: var(--n-text-secondary);">
<li id="ref-1">The BC Cook Articulation Committee, <em>Basic Kitchen and Food Service Management</em>, BCcampus. <a href="https://ecampusontario.pressbooks.pub/basickitchenandfoodservicemanagement/chapter/convert-and-adjust-recipes-and-formulas/" target="_blank" rel="noopener noreferrer">Source</a></li>
<li id="ref-2">National Institute of Standards and Technology (NIST), <em>Culinary Measurement Tips</em>, U.S. Department of Commerce. <a href="https://www.nist.gov/pml/owm/culinary-measurement-tips" target="_blank" rel="noopener noreferrer">Source</a></li>
<li id="ref-3">USDA Food Safety and Inspection Service, <em>Safe Minimum Internal Temperature Chart</em>. <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart" target="_blank" rel="noopener noreferrer">Source</a></li>
<li id="ref-4">Auguste Escoffier School of Culinary Arts, <em>How to Scale a Recipe Up or Down</em>. <a href="https://www.escoffier.edu/blog/culinary-arts/how-to-scale-a-recipe/" target="_blank" rel="noopener noreferrer">Source</a></li>
<li id="ref-5">Culinary Institute of America, <em>Baking Formulas and Recipe Conversion</em>. <a href="https://www.ciafoodies.com" target="_blank" rel="noopener noreferrer">Source</a></li>
</ol>`,
            highlight: "Pro Tip from the Escoffier School: Never scoop dry ingredients like flour or powdered sugar directly from the bag with a measuring cup — it's settled and compacted from storage. Use a whisk to aerate dry ingredients, then spoon into the cup and level with a straight edge for accurate results.",
        },
        faq: [
            { question: "How do I double a recipe?", answer: "Multiply every ingredient by 2. For baking, use 1.75× for leaveners (baking powder and baking soda) instead of 2× — over-scaling leaveners causes cakes to rise too fast and collapse. Use a larger pan if needed, reduce oven temperature by 25°F, and add 10–15 minutes to the baking time. Always verify doneness with an instant-read thermometer." },
            { question: "How do I halve a recipe?", answer: "Multiply every ingredient by 0.5. The trickiest part is halving eggs: beat 1 whole egg thoroughly (it yields about 3 tablespoons), then measure 1.5 tablespoons for half an egg. Half of ¾ cup is ⅜ cup, which equals exactly 6 tablespoons. Reduce baking time by about 25% and check for doneness early." },
            { question: "What is a recipe conversion factor?", answer: "The conversion factor (also called the scaling factor or recipe multiplier) is the ratio of your desired yield divided by the original yield. If a recipe makes 8 cookies and you want 20, the factor is 20 ÷ 8 = 2.5. Multiply every ingredient quantity by 2.5 to get the scaled amounts. Professional chefs and culinary schools call this the Recipe Conversion Factor (RCF)." },
            { question: "How do I scale a recipe for 50 people?", answer: "Calculate the conversion factor: 50 ÷ original servings. For example, if the recipe serves 6: 50 ÷ 6 = 8.33×. At this magnitude, always convert all ingredients to weight (grams) before scaling to avoid compounding volume measurement errors. Start with 60% of the calculated spice amounts and adjust to taste. For baked goods, make multiple smaller batches instead of one giant batch." },
            { question: "Why do my scaled baking recipes turn out different?", answer: "The five most common reasons: (1) measuring by volume instead of weight introduces compounding errors at scale, (2) leaveners like baking powder don't scale linearly — they need to be reduced to 75-80% above 2×, (3) cooking time wasn't adjusted for the larger volume, (4) the pan size wasn't appropriate, creating too-thin or too-thick layers, (5) strong spices and salt compound and weren't scaled back." },
            { question: "Do spices scale the same way as other ingredients?", answer: "No. Strong spices (cayenne, cinnamon, cloves) and salt compound quickly in larger batches. When quadrupling a recipe, start with 3× the spice amount (not 4×) and adjust to taste. Leaveners like baking powder should be scaled at 75-80% of the calculated amount for batches above 2×. This is because chemical reactions don't always scale proportionally with volume." },
            { question: "Should I measure by cups or grams when scaling?", answer: "Always by weight (grams or ounces) when possible. A cup of flour can weigh 120g (spooned and leveled) or 150g (scooped from the bag) — a 25% variation. When you quadruple a recipe, that error multiplies to a 120g difference, which is almost an entire extra cup of flour. The NIST recommends weight-based measurement for culinary accuracy." },
            { question: "How do cooking times change when I scale a recipe?", answer: "Larger volumes take longer to heat through, but the relationship is not linear. A doubled soup may need 20-30% more time. Baked goods in larger pans may need both more time AND a lower temperature — reduce by 25°F to prevent burning the edges while the center cooks. Always use an instant-read thermometer: bread is done at 190-210°F, cakes at 205-210°F." }
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

                    <AuthorBadge categoryKey="cooking" />

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
                
                <aside className="layout-2col__sidebar">
                    <nav style={{
                        background: "var(--n-surface)",
                        border: "1px solid var(--n-border)",
                        borderRadius: "var(--r-md)",
                        padding: "var(--s-5)",
                    }}>
                        <h3 style={{ fontSize: "var(--t-body)", fontWeight: 700, marginBottom: "var(--s-4)", display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
                            🥘 Cooking Measurements
                        </h3>
                        {getCalculatorsByCategory("cooking").map((item) => (
                            <a
                                key={item.id}
                                href={`/cooking-calculators/${item.slug}`}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "var(--s-3) 0", borderBottom: "1px solid var(--n-border)",
                                    color: item.id === calc.id ? "var(--n-primary)" : "var(--n-text-secondary)",
                                    fontWeight: item.id === calc.id ? 600 : 400,
                                    fontSize: "var(--t-body-sm)", textDecoration: "none", transition: "color 0.2s",
                                }}
                            >
                                {item.title.replace(/ Calculator.*$/, "").replace(/ Converter.*$/, "")} <span style={{ color: "var(--n-text-muted)" }}>→</span>
                            </a>
                        ))}
                    </nav>
                </aside>
            </div>
        </main>
    );
}
