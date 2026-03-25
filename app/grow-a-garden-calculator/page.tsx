// Standalone Page — /grow-a-garden-calculator/
import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import GrowAGardenCalculator from "@/components/calculator/GrowAGardenCalculator";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import CategoryGrid from "@/components/shared/CategoryGrid";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Grow a Garden Calculator — Crop Value, Mutations & Pet Calculator (2026)",
  description:
    "Free Grow a Garden calculator for Roblox. Calculate crop values with 120+ mutations, pet XP, egg hatch speed, pet abilities, and profit optimization. The most comprehensive GAG calculator with mutation stacking formula, trading values & complete mutation guide.",
  keywords: [
    "grow a garden calculator",
    "grow a garden value calculator",
    "grow a garden mutation calculator",
    "roblox grow a garden calculator",
    "grow a garden crop calculator",
    "grow a garden pet value",
    "grow a garden mutation list",
    "GAG calculator",
    "grow a garden trading calculator",
    "grow a garden profit calculator",
  ],
  alternates: { canonical: canonicalUrl("/grow-a-garden-calculator") },
};

const FAQ_ITEMS = [
  {
    question: "What is the Grow a Garden Calculator and how does it work?",
    answer:
      'The Grow a Garden Calculator is a free, fanmade tool that helps Roblox players estimate the value of their crops in the game "Grow a Garden." Select a plant, apply mutations (which multiply value), enter the weight in kilograms, and the calculator instantly shows the estimated sell value in Sheckles. It supports over 120 mutations and uses the community-verified stacking formula.',
  },
  {
    question:
      "How accurate are the crop value calculations?",
    answer:
      "Our calculations use the same community-tested formula used by top traders: Base Value × Weight × Mutation Multiplier. Mutation stacking follows the rule: (sum of all multipliers) − (number of mutations) + 1. Values are estimates based on in-game testing and may vary slightly from actual in-game prices after updates.",
  },
  {
    question: "What are mutations and how do they affect crop value in Grow a Garden?",
    answer:
      "Mutations are special traits that multiply your crop's sell value. They range from common mutations like Wet (2x) to mythic mutations like Goldsparkle (500x) and Astral (365x). Mutations can be obtained through weather events, pet abilities, admin events, or by combining other mutations. Multiple mutations stack using the formula: total multiplier = (sum of multipliers) − (count) + 1.",
  },
  {
    question: "How does the mutation stacking formula work?",
    answer:
      "When you apply multiple mutations to a single crop, they stack additively with a correction factor. The formula is: Mutation Multiplier = (Sum of all individual multipliers) − (Number of mutations) + 1. For example, Gold (20x) + Shocked (100x) = (20 + 100) − 2 + 1 = 119x total multiplier. This prevents exponential scaling while still rewarding multiple mutations.",
  },
  {
    question: "What are the best crops for maximum profit in Grow a Garden?",
    answer:
      "For beginners, Strawberries (18¢, multi-harvest) provide steady income. Mid-tier players should target Watermelons (2,708¢) and Pineapples (1,805¢). Expert farmers maximize profit with Moon Mangos (45,125¢), Sugar Apples (43,320¢), and Galaxy Rose (100,000¢). Use our Profit Calculator tab to compare ROI for different seed-mutation combinations.",
  },
  {
    question: "How do I get the Shocked mutation in Grow a Garden?",
    answer:
      "The Shocked mutation (100x multiplier) is triggered by thunder/lightning weather events in the game. It can also appear during the Jandel admin event. Plant your most valuable crops before a thunderstorm for maximum profit. The Shocked mutation is one of the most sought-after mutations due to its high multiplier.",
  },
  {
    question: "What is the Value to Weight mode?",
    answer:
      'The Value to Weight mode reverses the calculator — instead of entering a weight to get a value, you enter a target Sheckles value and the calculator tells you what weight your crop needs to be worth that amount. This is useful when someone tells you a price using the in-game magnifying glass feature and you want to verify the weight.',
  },
  {
    question: "How do pets affect crop values in Grow a Garden?",
    answer:
      "Pets in Grow a Garden have passive abilities that can apply mutations to nearby crops. For example, the Phoenix grants Flaming (25x), the Griffin grants Cyclonic (50x), and the Goldfinch grants the legendary Goldsparkle (500x). Equipping the right pets while farming can dramatically increase your crop values. Use our Pet Ability tab to see which pet grants which mutation.",
  },
  {
    question: "Can I use this calculator for trading?",
    answer:
      "Yes — the calculator is designed for fair trading. Enter both players' crops with their mutations and weights, compare the calculated values, and determine if the trade is fair. The Add to List feature lets you build a multi-crop portfolio to calculate combined trade value. Values are estimates and actual trading prices may vary based on supply and demand.",
  },
  {
    question: "What is the highest possible mutation multiplier?",
    answer:
      "The highest single mutation is Goldsparkle at 500x (from the Goldfinch pet). For combination mutations, Astral (365x, from Cosmic + Galactic) and Stormbound (270x, from Riptide + Stormcharged) are among the highest. However, stacking multiple high-tier mutations together using the additive formula can produce total multipliers in the thousands.",
  },
  {
    question: "How does the Pet XP calculator work?",
    answer:
      "Enter your pet's current XP and your target XP level. The calculator divides the remaining XP by the pet's base XP rate per action to show how many actions (harvests, interactions) you need. Different pets have different XP rates, so higher-tier pets level up faster.",
  },
  {
    question: "What is the egg hatch speed in Grow a Garden?",
    answer:
      "Each pet egg has a base hatch time ranging from 5 minutes (common pets like Lobster) to 120 minutes (rare pets like Goldfinch). Speed boosts from items or game passes can cut hatch time in half. Our Egg Hatch Speed tab shows exact times for all pets with and without boosts.",
  },
  {
    question: "Is this calculator affiliated with Roblox or Grow a Garden?",
    answer:
      "No. This is a completely fanmade tool created for educational and informational purposes. It is not affiliated with, endorsed by, or connected to Roblox Corporation or the developers of Grow a Garden. All game data is gathered through community testing — no game code is used.",
  },
  {
    question: "How often is the calculator updated?",
    answer:
      "We update the calculator when significant game updates add new plants, mutations, or pets. Grow a Garden receives frequent updates, especially during events. If you notice missing data, check back soon as we work to add new content promptly after each game update.",
  },
  {
    question: "What is the difference between the Crop Value Calculator and the Profit Calculator?",
    answer:
      "The Crop Value Calculator shows the estimated sell value of a crop with mutations. The Profit Calculator goes further — it subtracts the seed purchase cost from the sell value to show your net profit and ROI percentage. It also ranks the top 10 most profitable seeds for your current mutation combination, helping you optimize which seeds to buy.",
  },
];

const schemaData = JSON.stringify([
  breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Grow a Garden Calculator" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Grow a Garden Calculator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description:
      "Free calculator for the Roblox game Grow a Garden. Calculate crop values with 120+ mutations, pet XP, egg hatch speed, and profit optimization.",
    url: canonicalUrl("/grow-a-garden-calculator"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  },
]);

const CONTENT_HTML = `<p>The <strong>Grow a Garden Calculator</strong> is the most comprehensive free tool for <strong>Roblox's Grow a Garden</strong> game. Whether you're a beginner learning the ropes or an expert trader stacking legendary mutations, this calculator helps you estimate crop values, optimize your farming strategy, and make fair trades — all with real community-tested data.</p>
<p>Grow a Garden is one of Roblox's most popular idle farming simulations, with millions of active players. The game revolves around planting seeds, growing crops, harvesting fruits, and selling them for <strong>Sheckles (¢)</strong> — the in-game currency. What makes the game uniquely complex is its <strong>mutation system</strong>: over 120 different mutations can be applied to crops, each one multiplying the fruit's value. Understanding how mutations stack, which pets trigger them, and which crops offer the highest ROI is essential for serious players — and that's exactly what this calculator does.</p>

<h3>How the Grow a Garden Value Formula Works</h3>
<p>Every crop in Grow a Garden has a <strong>base sell value</strong> determined by the plant type. The final sell price is calculated using:</p>
<div class="explanation__highlight">
<strong>Final Value = Base Value × Weight (kg) × Mutation Multiplier × Amount</strong><br/><br/>
The <strong>Mutation Multiplier</strong> uses additive stacking:<br/>
<strong>Mutation Multiplier = (Sum of all mutation multipliers) − (Number of mutations) + 1</strong><br/><br/>
<strong>Example:</strong> Gold (20x) + Shocked (100x) Carrot at 10 kg<br/>
Mutation Multiplier = (20 + 100) − 2 + 1 = <strong>119x</strong><br/>
Final Value = 18 × 10 × 119 × 1 = <strong>¢21,420</strong>
</div>
<p>This additive stacking formula prevents exponential value explosions while still rewarding players who manage to stack multiple mutations. The formula has been verified through extensive community testing and is used by all major Grow a Garden value calculators.</p>

<h3>Understanding Mutation Tiers in Grow a Garden</h3>
<p>Mutations are the key to massive profits in Grow a Garden. They're organized into five rarity tiers based on how they're obtained and their multiplier strength:</p>
<table><thead><tr><th>Tier</th><th>Multiplier Range</th><th>Examples</th><th>How to Obtain</th></tr></thead><tbody>
<tr><td><strong>Common</strong></td><td>2x – 3x</td><td>Wet, Chilled, Moonlit, Sandy, Pollinated</td><td>Weather events, basic pets, sprays</td></tr>
<tr><td><strong>Uncommon</strong></td><td>4x – 20x</td><td>Frozen (10x), Burnt (4x), Amber (10x), Cooked (10x)</td><td>Combo mutations, uncommon pets, events</td></tr>
<tr><td><strong>Rare</strong></td><td>25x – 100x</td><td>Shocked (100x), Sundried (85x), Aurora (90x), Graceful (77x)</td><td>Rare weather, admin events, rare pets</td></tr>
<tr><td><strong>Legendary</strong></td><td>100x – 200x</td><td>Disco (125x), Meteoric (125x), Dawnbound (150x), Biohazard (157x)</td><td>Admin-only events, high-tier combos</td></tr>
<tr><td><strong>Mythic</strong></td><td>200x – 500x</td><td>Goldsparkle (500x), Astral (365x), Stormbound (270x), Cosmic (240x)</td><td>Ultra-rare combos, Goldfinch pet, multi-step recipes</td></tr>
</tbody></table>
<p>The most valuable single mutation is <strong>Goldsparkle (500x)</strong>, obtainable only from the Goldfinch pet — one of the rarest pets in the game. For combination mutations, <strong>Astral (365x)</strong> is the highest, requiring you to first combine Celestial + Aurora into Cosmic, then combine Cosmic with Galactic.</p>

<h3>How to Get Mutations in Grow a Garden</h3>
<p>Mutations can be obtained through several methods in Grow a Garden:</p>
<ul>
<li><strong>Weather Events:</strong> Rain triggers Wet (2x), snow triggers Chilled (2x), thunderstorms trigger Shocked (100x), sandstorms trigger Sandy (3x), and heat waves trigger Sundried (85x). Weather is random, so plant valuable crops and wait for favorable conditions.</li>
<li><strong>Pet Abilities:</strong> Many pets grant specific mutations to nearby crops when their passive ability activates. The Phoenix gives Flaming (25x), the Griffin gives Cyclonic (50x), and the Golden Goose gives Fortune (50x). Equip pets strategically based on what mutations you want.</li>
<li><strong>Admin Events:</strong> Game administrators occasionally trigger special events that grant powerful mutations like Celestial (120x), Disco (125x), or Void Touched (135x). These are unpredictable but extremely valuable.</li>
<li><strong>Combination Mutations:</strong> Some mutations can only be created by combining two or more other mutations on the same crop. For example, Frozen (10x) = Wet + Chilled, and Cosmic (240x) = Celestial + Aurora. Combination chains can reach up to 5 steps deep.</li>
<li><strong>Time-Based Mutations:</strong> Amber (10x) from the Raptor pet ages into OldAmber (20x) and eventually AncientAmber (50x) if left long enough — rewarding patient farmers.</li>
</ul>

<h3>Best Pets for Farming in Grow a Garden</h3>
<p>Pets are essential profit multipliers in Grow a Garden. You can equip up to three pets at once, and their passive abilities trigger automatically. Here are the best pets ranked by their mutation multiplier:</p>
<table><thead><tr><th>Rank</th><th>Pet</th><th>Mutation Granted</th><th>Multiplier</th><th>Notes</th></tr></thead><tbody>
<tr><td>1</td><td>🐤 Goldfinch</td><td>Goldsparkle</td><td>500x</td><td>Rarest pet in the game — extremely hard to obtain</td></tr>
<tr><td>2</td><td>🦁 Lemon Lion</td><td>Brainrot</td><td>100x</td><td>Also available from admin events</td></tr>
<tr><td>3</td><td>🦢 Swan</td><td>Graceful</td><td>77x</td><td>Elegant pet with a strong mutation</td></tr>
<tr><td>4</td><td>🐍 Hydra</td><td>Terran</td><td>75x</td><td>Safari event pet</td></tr>
<tr><td>5</td><td>🐉 Mizuchi</td><td>Azure</td><td>75x</td><td>Dragon-type pet</td></tr>
<tr><td>6</td><td>🦅 Griffin</td><td>Cyclonic</td><td>50x</td><td>Feeds into Maelstrom (100x) combo</td></tr>
<tr><td>7</td><td>🐋 Whale</td><td>Whalebound</td><td>50x</td><td>Aquatic event pet</td></tr>
<tr><td>8</td><td>🦓 Zebra</td><td>Stampede</td><td>50x</td><td>Safari event pet</td></tr>
<tr><td>9</td><td>🦛 Hippo</td><td>Monsoon</td><td>50x</td><td>Feeds into Riptide (80x) combo</td></tr>
<tr><td>10</td><td>🪿 Golden Goose</td><td>Fortune</td><td>50x</td><td>Spawns on Golden Egg</td></tr>
</tbody></table>
<p>The ideal three-pet setup depends on your strategy. For raw mutation power, run <strong>Goldfinch + Swan + Hydra</strong>. For combination mutation chains, use pets that trigger components of combo mutations — for example, Phoenix (Flaming) + an admin Molten source enables the Blazing (52x) chain.</p>

<h3>Crop Profit Optimization — Seed ROI Guide</h3>
<p>Not all seeds are created equal. While expensive seeds have higher base values, cheaper seeds can actually offer better ROI when mutations are applied:</p>
<table><thead><tr><th>Tier</th><th>Best Seeds</th><th>Base Value</th><th>Strategy</th></tr></thead><tbody>
<tr><td><strong>Beginner</strong></td><td>Strawberry, Blueberry</td><td>18¢</td><td>Multi-harvest crops — keep producing fruit without replanting. Great for learning mutations and building initial capital.</td></tr>
<tr><td><strong>Intermediate</strong></td><td>Watermelon, Pineapple, Bell Pepper</td><td>1,805 – 4,964¢</td><td>High single-harvest value. Plant before thunderstorms for Shocked mutation. One good Shocked Watermelon can fund dozens more seeds.</td></tr>
<tr><td><strong>Expert</strong></td><td>Moon Mango, Sugar Apple, Feijoa</td><td>27,075 – 45,125¢</td><td>Maximum base value. Combined with stacked legendary mutations, a single crop can be worth billions of Sheckles.</td></tr>
<tr><td><strong>Limited</strong></td><td>Galaxy Rose, Void Fruit, Golden Fruit</td><td>100,000 – 200,000¢</td><td>Extremely rare seeds from events or ascension rewards. Handle with care — apply only the best mutation combos.</td></tr>
</tbody></table>
<p>Use our <strong>Profit Calculator tab</strong> to compare the net profit (sell value minus seed cost) and ROI percentage for different seed-mutation combinations. This is a feature unique to our calculator that competitors don't offer.</p>

<h3>Trading Tips for Grow a Garden</h3>
<p>Fair trading is one of the most important skills in Grow a Garden's economy. Here's how to use the calculator for better trades:</p>
<ol>
<li><strong>Always check both sides:</strong> Calculate the value of what you're giving AND what you're receiving. A trade should be close to equal value.</li>
<li><strong>Use Value to Weight mode:</strong> If someone tells you a crop's value from the in-game magnifying glass, switch to Value → Weight mode to verify the implied weight and check if it's reasonable.</li>
<li><strong>Build a portfolio:</strong> Use the "Add to List" feature to calculate the combined value of multiple items in a trade offer.</li>
<li><strong>Account for rarity:</strong> Some mutations (especially admin-only ones) are worth more than their multiplier suggests because of scarcity. Celestial, Disco, and Void Touched crops command premium trading prices.</li>
<li><strong>Verify pet abilities:</strong> Use the Pet Ability tab to confirm that a pet you're trading for actually has the mutation ability the seller claims.</li>
</ol>

<h3>About This Calculator</h3>
<p>This Grow a Garden Calculator is a completely <strong>fanmade tool</strong> and is not affiliated with Roblox Corporation or the developers of Grow a Garden. All data is gathered through community testing and publicly available game information — no game code is used or reverse-engineered.</p>
<p>Values are estimates based on the community-verified stacking formula. Actual in-game values may vary after game updates. We recommend checking back after major game updates for the latest data.</p>`;

export default function GrowAGardenCalculatorPage() {
  const pageUrl = canonicalUrl("/grow-a-garden-calculator");

  return (
    <main className="container" style={{ paddingTop: "var(--s-4)" }}>
      <Script
        id="schema-gag-calc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaData }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Grow a Garden Calculator" },
        ]}
      />

      <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
        Grow a Garden Calculator — Crop Value, Mutations &amp; Pet Calculator
      </h1>
      <p
        className="t-body text-muted"
        style={{ marginBottom: "var(--s-6)", maxWidth: "80ch" }}
      >
        Free Grow a Garden calculator for Roblox players. Calculate crop values
        with 120+ mutations, stacking formula, pet XP, egg hatch speed, pet
        abilities, and profit optimization. Updated for 2026 — the most
        comprehensive GAG calculator available.
      </p>

      <AuthorBadge categoryKey="math" />

      <div className="layout-2col">
        <div className="layout-2col__main">
          <GrowAGardenCalculator />

          <DynamicExplanation
            heading="How to Use the Grow a Garden Calculator — Complete Guide"
            contentHTML={CONTENT_HTML}
            highlight="A Gold + Shocked Carrot at 10 kg is worth approximately ¢21,420. Stack more mutations and use higher-tier crops like Moon Mango to reach values in the billions. Use the Profit Calculator tab to optimize your seed investment ROI."
          />

          <FAQAccordion
            title="Grow a Garden Calculator FAQ"
            items={FAQ_ITEMS}
          />
        </div>
        <aside className="layout-2col__sidebar">
          <TrendingCalculations variant="sidebar" />
        </aside>
      </div>

      <section style={{ marginTop: "var(--s-8)" }}>
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>
          Explore Other Calculator Categories
        </h2>
        <CategoryGrid />
      </section>
    </main>
  );
}
