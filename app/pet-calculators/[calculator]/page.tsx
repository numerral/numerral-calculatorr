// Dynamic Hub — /pet-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PetCalculatorCore from "@/components/calculator/PetCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("pet").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("pet").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/pet-calculators/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; explanation?: { heading: string; paragraphs?: string[]; contentHTML?: string; highlight?: string }; faq?: { question: string; answer: string }[] }> = {
    "dog-age-calculator": {
        subtitle: "Calculate your dog's age in human years using the American Veterinary Medical Association (AVMA) guidelines. See how breed size affects aging — small dogs live longer and age more slowly than giant breeds.",
        explanation: { heading: "How to Calculate Your Dog's Age in Human Years", contentHTML: `<p>The old "multiply by 7" rule is a myth. Dogs age rapidly in their first two years, then slow down significantly. The <strong>American Veterinary Medical Association (AVMA)</strong> provides more accurate guidelines, and recent research from the <strong>University of California San Diego</strong> has refined our understanding of canine aging using DNA methylation studies.</p>

<h3>The AVMA Method (Size-Adjusted)</h3>
<p>The AVMA's general guidelines, adjusted for breed size:</p>
<div class="explanation__highlight">
<strong>Year 1:</strong> 12–15 human years (varies by size)<br/>
<strong>Year 2:</strong> additional 7–9 human years<br/>
<strong>Year 3+:</strong> additional 4–7 human years per year (varies by size)<br/><br/>
Example: 5-year-old medium dog<br/>
= 15 + 9 + (3 × 5) = <strong>39 human years</strong>
</div>

<h3>Why Size Matters</h3>
<p>Larger dogs age faster and have shorter lifespans than smaller dogs. A Great Dane (giant breed) is considered senior at age 5, while a Chihuahua (small breed) may not be senior until age 10–12. The reasons aren't fully understood, but researchers believe accelerated growth in large breeds leads to faster cellular aging.</p>
<table><thead><tr><th>Size</th><th>Breeds</th><th>Average Lifespan</th><th>Senior At</th></tr></thead><tbody>
<tr><td>Small (&lt;20 lbs)</td><td>Chihuahua, Pomeranian, Shih Tzu, Dachshund</td><td>12–16 years</td><td>10–12 years</td></tr>
<tr><td>Medium (20–50 lbs)</td><td>Beagle, Cocker Spaniel, Bulldog, Australian Shepherd</td><td>10–14 years</td><td>8–10 years</td></tr>
<tr><td>Large (50–100 lbs)</td><td>Labrador, Golden Retriever, German Shepherd, Boxer</td><td>8–12 years</td><td>6–8 years</td></tr>
<tr><td>Giant (100+ lbs)</td><td>Great Dane, Mastiff, Saint Bernard, Irish Wolfhound</td><td>6–10 years</td><td>5–6 years</td></tr>
</tbody></table>

<h3>The UC San Diego Logarithmic Formula</h3>
<p>A 2019 study from the University of California San Diego used DNA methylation (epigenetic clock) to develop a more scientific formula:</p>
<div class="explanation__highlight">
<strong>Human Age ≈ 16 × ln(dog age) + 31</strong><br/><br/>
This means a 1-year-old dog is roughly 31 human years, and a 2-year-old is about 42. The aging rate slows dramatically after the first few years.
</div>
<p>This formula was validated on 104 Labrador Retrievers and provides the most scientifically grounded estimate. However, it doesn't account for breed size differences.</p>

<h3>US Dog Ownership — Key Statistics</h3>
<ul>
<li>65.1 million US households own at least one dog (APPA 2024)</li>
<li>The average American dog owner spends $1,533/year on their dog</li>
<li>The most popular breeds in 2024: French Bulldog, Labrador Retriever, Golden Retriever, German Shepherd, Poodle (AKC rankings)</li>
<li>Average veterinary visit costs $50–$400 depending on services</li>
</ul>`, highlight: "A 5-year-old medium-sized dog (like a Beagle) is approximately 39 human years — a young adult. The same age Great Dane would be about 47 human years — approaching middle age." },
        faq: [
            { question: "How old is my dog in human years?", answer: "Use our calculator above — enter your dog's age and select their size category. As a quick reference: a 1-year-old dog is about 15 human years, a 2-year-old is about 24, and each year after that adds 4–7 years depending on breed size." },
            { question: "Is the 7 dog years per 1 human year rule accurate?", answer: "No. The '7 years' rule is a myth that doesn't account for how dogs actually age. Dogs mature much faster in their first two years (reaching adulthood by age 2) and then age more slowly. The AVMA method and the UC San Diego logarithmic formula are both more accurate." },
            { question: "Do small dogs really live longer than large dogs?", answer: "Yes. Small breeds (Chihuahuas, Toy Poodles) routinely live 14–16 years, while giant breeds (Great Danes, Irish Wolfhounds) average only 6–8 years. The exact reason remains under study, but researchers believe accelerated growth and larger body mass increase oxidative stress and cellular damage." },
            { question: "At what age is a dog considered a senior?", answer: "It depends on size. Small dogs: 10–12 years. Medium: 8–10. Large: 6–8. Giant: 5–6. Senior dogs need more frequent vet visits (twice yearly), joint support, and adjusted nutrition." },
            { question: "How can I help my dog live longer?", answer: "Maintain a healthy weight (obesity shortens lifespan by 2+ years), provide regular exercise, feed high-quality food, schedule annual vet checkups (twice yearly for seniors), keep up with dental care, and provide mental stimulation." },
            { question: "What is DNA methylation and how does it relate to dog aging?", answer: "DNA methylation is a chemical process that changes gene expression over time — it's essentially an 'epigenetic clock.' Researchers at UC San Diego studied this in dogs and found that dogs and humans share similar age-related methylation patterns, allowing a more accurate cross-species age comparison than the old 7:1 rule." },
            { question: "What are the most common breeds in the United States?", answer: "According to the AKC's 2024 rankings: 1) French Bulldog, 2) Labrador Retriever, 3) Golden Retriever, 4) German Shepherd, 5) Poodle. Labs and Goldens are large breeds (average lifespan 10–12 years), while French Bulldogs are medium-small (10–12 years)." },
        ],
    },
    "cat-age-calculator": {
        subtitle: "Calculate your cat's age in human years using guidelines from the American Association of Feline Practitioners (AAFP) and the American Animal Hospital Association (AAHA). Understand your cat's life stage for better care.",
        explanation: { heading: "How to Calculate Your Cat's Age in Human Years", contentHTML: `<p>Unlike dogs, all domestic cats age at roughly the same rate regardless of breed. The <strong>American Association of Feline Practitioners (AAFP)</strong> and <strong>American Animal Hospital Association (AAHA)</strong> jointly developed the standard cat aging guidelines used by veterinarians across the United States.</p>

<h3>The AAHA/AAFP Cat Age Formula</h3>
<div class="explanation__highlight">
<strong>Year 1:</strong> 15 human years<br/>
<strong>Year 2:</strong> 24 human years (+ 9 more)<br/>
<strong>Year 3+:</strong> add 4 human years per cat year<br/><br/>
Formula: Human age = ((cat age − 2) × 4) + 24<br/><br/>
Example: 8-year-old cat<br/>
= ((8 − 2) × 4) + 24 = <strong>48 human years</strong>
</div>
<p>Cats mature extremely fast in their first year — a 6-month-old kitten is roughly equivalent to a 10-year-old child. By age 2, a cat is a fully mature young adult.</p>

<h3>Cat Life Stages (AAHA Classification)</h3>
<table><thead><tr><th>Stage</th><th>Cat Age</th><th>Human Equivalent</th><th>Key Characteristics</th></tr></thead><tbody>
<tr><td><strong>Kitten</strong></td><td>0–6 months</td><td>0–10 years</td><td>Rapid growth, socialization, vaccinations</td></tr>
<tr><td><strong>Junior</strong></td><td>7 months–2 years</td><td>12–24 years</td><td>Reaching full size, sexual maturity, high energy</td></tr>
<tr><td><strong>Prime</strong></td><td>3–6 years</td><td>28–40 years</td><td>Peak physical condition, established behavior</td></tr>
<tr><td><strong>Mature</strong></td><td>7–10 years</td><td>44–56 years</td><td>May slow down, weight management important</td></tr>
<tr><td><strong>Senior</strong></td><td>11–14 years</td><td>60–72 years</td><td>More frequent vet visits, possible chronic conditions</td></tr>
<tr><td><strong>Geriatric</strong></td><td>15+ years</td><td>76+ years</td><td>Special care needs, quality-of-life focus</td></tr>
</tbody></table>

<h3>Indoor vs Outdoor Cat Lifespan</h3>
<p>One of the biggest factors in cat longevity is whether they live indoors or outdoors:</p>
<ul>
<li><strong>Indoor cats:</strong> average lifespan of <strong>12–18 years</strong>, with many living into their 20s</li>
<li><strong>Outdoor cats:</strong> average lifespan of <strong>2–5 years</strong> due to cars, predators, disease, and weather</li>
<li><strong>Indoor/outdoor cats:</strong> average lifespan of <strong>8–12 years</strong></li>
</ul>
<p>The ASPCA and most US veterinarians recommend keeping cats indoors for their safety and longevity.</p>

<h3>US Cat Ownership — Key Statistics</h3>
<ul>
<li>46.5 million US households own at least one cat (APPA 2024)</li>
<li>There are approximately 58.3 million owned cats in the United States</li>
<li>The average American cat owner spends $1,149/year on their cat</li>
<li>Most popular cat breeds: Ragdoll, Maine Coon, British Shorthair, Exotic, Persian (CFA rankings)</li>
<li>The oldest cat on record (Creme Puff, Austin, TX) lived to 38 years — approximately 168 human years</li>
</ul>`, highlight: "An 8-year-old indoor cat is approximately 48 human years — a mature adult in prime health. Indoor cats in the US routinely live 15–18 years (76–88 human years)." },
        faq: [
            { question: "How old is my cat in human years?", answer: "Use our calculator above. Quick reference: Year 1 = 15, Year 2 = 24, then add 4 per year. So a 5-year-old cat ≈ 36 human years, a 10-year-old ≈ 56, and a 15-year-old ≈ 76." },
            { question: "Do all cat breeds age at the same rate?", answer: "Mostly yes, unlike dogs where size dramatically affects aging. Some breeds (Siamese, Burmese) tend to live slightly longer (15–20 years), while others (like the Maine Coon) may have breed-specific health conditions. But the aging formula is consistent across breeds." },
            { question: "How long do indoor cats live?", answer: "Indoor cats in the United States live an average of 12–18 years, with many reaching their early 20s. The key factors are nutrition, veterinary care, weight management, and mental stimulation. Outdoor cats average only 2–5 years due to dangers like traffic and predators." },
            { question: "When should I switch my cat to senior food?", answer: "Most veterinarians recommend transitioning to senior cat food at age 7–10 (when your cat enters the 'Mature' life stage). Senior food has adjusted protein, lower calories, and added joint support. Always transition gradually over 7–10 days." },
            { question: "How often should I take my cat to the vet?", answer: "Kittens: every 3–4 weeks until 16 weeks for vaccinations. Adults (1–10 years): annually. Seniors (11+): every 6 months. Geriatric cats (15+) may need quarterly visits. Many cats hide illness symptoms, so regular checkups are critical." },
            { question: "What is the oldest cat ever recorded?", answer: "The oldest verified cat was Creme Puff, who lived in Austin, Texas and reached 38 years and 3 days (1967–2005). That's approximately 168 human years using the AAHA formula. The current oldest living cats are typically 28–30 years old." },
            { question: "Is the 1 cat year = 7 human years rule accurate?", answer: "No. Like the dog version, this is a myth. Cats mature to young adulthood by age 2 (equivalent to 24 human years), then age about 4 human years per cat year. The 7:1 ratio dramatically underestimates how fast kittens mature and overestimates aging in older cats." },
        ],
    },
    "dog-chocolate-toxicity-calculator": {
        subtitle: "Calculate whether the chocolate your dog ate is dangerous. Enter your dog's weight, the type of chocolate, and the amount consumed to see the estimated methylxanthine dose and toxicity risk level.",
        explanation: { heading: "Can Dogs Eat Chocolate? Understanding Chocolate Toxicity in Dogs", contentHTML: `<p><strong>No — chocolate is toxic to dogs.</strong> Chocolate contains <strong>theobromine</strong> and <strong>caffeine</strong>, both of which belong to a class of chemicals called <strong>methylxanthines</strong>. Dogs metabolize these compounds much more slowly than humans, allowing toxic levels to build up in their system.</p>

<h3>Why Chocolate Is Toxic to Dogs</h3>
<p>Theobromine is the primary toxin. While humans process theobromine in about 2–3 hours, dogs take <strong>18–24 hours</strong> to metabolize the same amount. This slow processing means even moderate amounts can reach dangerous concentrations in a dog's bloodstream.</p>
<p>Symptoms of chocolate poisoning include:</p>
<ul>
<li><strong>Mild (10–20 mg/kg):</strong> Vomiting, diarrhea, increased thirst</li>
<li><strong>Moderate (20–40 mg/kg):</strong> Restlessness, excessive urination, panting, racing heart</li>
<li><strong>Severe (40–60 mg/kg):</strong> Muscle tremors, seizures, rapid heart rate</li>
<li><strong>Potentially lethal (60+ mg/kg):</strong> Cardiac arrhythmia, internal bleeding, cardiac arrest</li>
</ul>
<p>Symptoms can appear within <strong>2–4 hours</strong> of ingestion and may last 24–72 hours depending on the dose.</p>

<h3>How to Calculate the Methylxanthine Dose</h3>
<div class="explanation__highlight">
<strong>Methylxanthine dose (mg/kg) = (amount in oz × methylxanthine per oz) ÷ dog's weight in kg</strong><br/><br/>
Example: 30 lb dog eats 2 oz of dark chocolate<br/>
Dog weight = 30 × 0.4536 = 13.6 kg<br/>
Methylxanthine = 2 oz × 228 mg/oz = 456 mg<br/>
Dose = 456 ÷ 13.6 = <strong>33.5 mg/kg (MODERATE toxicity)</strong>
</div>

<h3>Methylxanthine Content by Chocolate Type</h3>
<p>Not all chocolate is equally dangerous. The darker the chocolate, the more theobromine it contains:</p>
<table><thead><tr><th>Chocolate Type</th><th>Methylxanthine (mg/oz)</th><th>Danger Level</th></tr></thead><tbody>
<tr><td>White Chocolate</td><td>0.25 mg/oz</td><td>Minimal (fat/sugar are the concern)</td></tr>
<tr><td>Milk Chocolate</td><td>64 mg/oz</td><td>Moderate — common in candy bars</td></tr>
<tr><td>Dark Chocolate (60–69%)</td><td>228 mg/oz</td><td>High — much more concentrated</td></tr>
<tr><td>Semi-Sweet / Bittersweet</td><td>274 mg/oz</td><td>High — baking chips, premium bars</td></tr>
<tr><td>Baker's Chocolate (unsweetened)</td><td>450 mg/oz</td><td>Very High — most dangerous solid form</td></tr>
<tr><td>Dry Cocoa Powder</td><td>737 mg/oz</td><td>Extremely High — most concentrated form</td></tr>
</tbody></table>
<p><em>Values based on published veterinary toxicology references and the Merck Veterinary Manual.</em></p>

<h3>What to Do If Your Dog Eats Chocolate</h3>
<ol>
<li><strong>Don't panic</strong> — note the type of chocolate, approximate amount, and your dog's weight</li>
<li><strong>Call your vet</strong> or the <strong>ASPCA Animal Poison Control Center: (888) 426-4435</strong> (available 24/7; a consultation fee may apply)</li>
<li><strong>Do NOT induce vomiting</strong> unless directed to do so by a veterinarian</li>
<li><strong>Monitor for symptoms</strong> — vomiting, diarrhea, restlessness, rapid breathing, muscle tremors</li>
<li><strong>Keep chocolate out of reach</strong> — holidays (Halloween, Christmas, Easter, Valentine's Day) are peak chocolate poisoning times in the US</li>
</ol>

<h3>Chocolate Toxicity by Dog Size — Quick Reference</h3>
<p>Amount of <strong>milk chocolate</strong> that may cause moderate symptoms (≈20 mg/kg dose):</p>
<table><thead><tr><th>Dog Weight</th><th>Milk Chocolate</th><th>Dark Chocolate</th><th>Baker's Chocolate</th></tr></thead><tbody>
<tr><td>10 lbs (4.5 kg)</td><td>1.4 oz</td><td>0.4 oz</td><td>0.2 oz</td></tr>
<tr><td>20 lbs (9.1 kg)</td><td>2.8 oz</td><td>0.8 oz</td><td>0.4 oz</td></tr>
<tr><td>30 lbs (13.6 kg)</td><td>4.3 oz</td><td>1.2 oz</td><td>0.6 oz</td></tr>
<tr><td>50 lbs (22.7 kg)</td><td>7.1 oz</td><td>2.0 oz</td><td>1.0 oz</td></tr>
<tr><td>75 lbs (34.0 kg)</td><td>10.6 oz</td><td>3.0 oz</td><td>1.5 oz</td></tr>
<tr><td>100 lbs (45.4 kg)</td><td>14.2 oz</td><td>4.0 oz</td><td>2.0 oz</td></tr>
</tbody></table>
<p><em>These are approximate amounts for moderate symptoms. Any chocolate ingestion warrants monitoring, and smaller amounts can still cause mild symptoms.</em></p>`, highlight: "A 30 lb dog eating just 1 oz of baker's chocolate ingests 33 mg/kg of methylxanthines — enough to cause moderate toxicity. The same dog would need 7+ oz of milk chocolate for the same dose. When in doubt, call the ASPCA at (888) 426-4435." },
        faq: [
            { question: "How much chocolate is toxic to dogs?", answer: "It depends on the type. As little as 0.5 oz of baker's chocolate can cause symptoms in a 10 lb dog, while it would take 3+ oz of milk chocolate for the same effect. The toxic dose is about 20 mg/kg of methylxanthines for moderate symptoms and 60+ mg/kg for potentially lethal effects." },
            { question: "What should I do if my dog ate chocolate?", answer: "Note the type and amount of chocolate and your dog's weight. Call your vet or the ASPCA Poison Control at (888) 426-4435 immediately. Do NOT induce vomiting unless instructed by a vet. Time is important — treatment is most effective within 2 hours of ingestion." },
            { question: "Is white chocolate safe for dogs?", answer: "White chocolate contains negligible theobromine (0.25 mg/oz), so theobromine toxicity is unlikely. However, it's very high in fat and sugar, which can cause pancreatitis and gastrointestinal upset. It's best to keep all chocolate away from dogs." },
            { question: "How long does it take for chocolate to affect a dog?", answer: "Symptoms typically appear within 2–4 hours of ingestion but can take up to 6–12 hours. Effects can last 24–72 hours because dogs metabolize theobromine very slowly (half-life of ~18 hours vs 2–3 hours in humans)." },
            { question: "Can a dog die from eating chocolate?", answer: "Yes, at very high doses (60+ mg/kg of methylxanthines). Deaths are more common with baker's chocolate and cocoa powder, which are highly concentrated. Small dogs are at highest risk because even small amounts produce high per-kilogram doses. Prompt veterinary treatment greatly improves outcomes." },
            { question: "When is chocolate poisoning most common in the US?", answer: "The ASPCA reports spikes during: Halloween (candy), Christmas/Hanukkah (baking chocolate, gift boxes), Valentine's Day (chocolate boxes), and Easter (chocolate eggs/bunnies). Keep all holiday chocolate securely stored away from pets." },
            { question: "What is the ASPCA Poison Control number?", answer: "The ASPCA Animal Poison Control Center can be reached at (888) 426-4435. It is available 24 hours a day, 365 days a year. A consultation fee of $99 may apply. They can provide expert guidance specific to your dog's situation." },
        ],
    },
    "dog-calorie-calculator": {
        subtitle: "Calculate how many calories your dog needs per day using the Resting Energy Requirement (RER) formula recommended by veterinary nutritionists. Adjust for life stage, activity level, and spay/neuter status.",
        explanation: { heading: "How to Calculate Your Dog's Daily Calorie Needs", contentHTML: `<p>Veterinary nutritionists use a two-step formula to determine a dog's daily calorie needs: first calculate the <strong>Resting Energy Requirement (RER)</strong>, then multiply by a <strong>life stage factor</strong> to get the <strong>Daily Energy Requirement (DER)</strong>.</p>

<h3>The RER Formula</h3>
<div class="explanation__highlight">
<strong>RER (kcal/day) = 70 × (body weight in kg)<sup>0.75</sup></strong><br/><br/>
Example: 30 lb dog<br/>
= 30 × 0.4536 = 13.6 kg<br/>
RER = 70 × 13.6<sup>0.75</sup> = 70 × 7.23 = <strong>506 kcal/day</strong>
</div>
<p>The exponent 0.75 is called the <strong>metabolic body weight</strong> or <strong>metabolic scaling factor</strong>. It accounts for the fact that smaller animals have higher metabolic rates per unit of body weight than larger animals. This formula is endorsed by the <strong>National Research Council (NRC)</strong> and used by veterinary nutritionists worldwide.</p>

<h3>DER Multipliers by Life Stage</h3>
<p>The <strong>Daily Energy Requirement (DER)</strong> adjusts RER for the dog's actual activity and life stage:</p>
<table><thead><tr><th>Life Stage</th><th>Multiplier</th><th>Notes</th></tr></thead><tbody>
<tr><td>Puppy (&lt; 4 months)</td><td>×3.0</td><td>Rapid growth requires the highest calorie density</td></tr>
<tr><td>Puppy (4–12 months)</td><td>×2.0</td><td>Still growing but rate slows</td></tr>
<tr><td>Neutered/Spayed Adult</td><td>×1.6</td><td>Most common — metabolism is slightly lower after altering</td></tr>
<tr><td>Intact (Unaltered) Adult</td><td>×1.8</td><td>Hormones maintain slightly higher metabolism</td></tr>
<tr><td>Active / Working Dog</td><td>×2.0–3.0</td><td>Hunting, herding, agility, or very active lifestyle</td></tr>
<tr><td>Weight Loss</td><td>×1.0</td><td>Feed at RER only — consult your vet</td></tr>
<tr><td>Senior (7+ years)</td><td>×1.2–1.4</td><td>Reduced activity, lower metabolism</td></tr>
<tr><td>Pregnant / Nursing</td><td>×2.0–3.0</td><td>Highest during peak lactation (3–5 weeks postpartum)</td></tr>
</tbody></table>

<h3>How Much to Feed — Dry Food Reference</h3>
<p>Most standard dry dog foods contain approximately <strong>350–450 kcal per cup</strong> (8 oz measuring cup). Premium and grain-free foods may contain 400–500+ kcal per cup. Always check your specific brand's label.</p>
<table><thead><tr><th>Dog Weight</th><th>RER</th><th>Neutered Adult (×1.6)</th><th>≈ Cups/Day (400 kcal/cup)</th></tr></thead><tbody>
<tr><td>10 lbs (4.5 kg)</td><td>218 kcal</td><td>349 kcal</td><td>~1 cup</td></tr>
<tr><td>20 lbs (9.1 kg)</td><td>366 kcal</td><td>586 kcal</td><td>~1.5 cups</td></tr>
<tr><td>30 lbs (13.6 kg)</td><td>497 kcal</td><td>795 kcal</td><td>~2 cups</td></tr>
<tr><td>50 lbs (22.7 kg)</td><td>722 kcal</td><td>1,155 kcal</td><td>~3 cups</td></tr>
<tr><td>70 lbs (31.8 kg)</td><td>924 kcal</td><td>1,479 kcal</td><td>~3.5 cups</td></tr>
<tr><td>100 lbs (45.4 kg)</td><td>1,183 kcal</td><td>1,893 kcal</td><td>~4.5 cups</td></tr>
</tbody></table>

<h3>Tips for Healthy Feeding</h3>
<ul>
<li><strong>Measure every meal</strong> — use an actual measuring cup, not a scoop or guess</li>
<li><strong>Count treats</strong> — treats should be ≤10% of daily calories (a Milk-Bone biscuit is ~40 kcal)</li>
<li><strong>Feed twice daily</strong> — most adult dogs do well with two meals per day (puppies need 3–4)</li>
<li><strong>Adjust for body condition</strong> — if you can't feel ribs easily, reduce portions by 10–15%</li>
<li><strong>Weigh your dog monthly</strong> — track trends, not single readings</li>
</ul>

<h3>US Dog Obesity Statistics</h3>
<p>According to the <strong>Association for Pet Obesity Prevention (APOP)</strong>, approximately <strong>59% of dogs in the United States are overweight or obese</strong>. Obesity is the #1 preventable disease in dogs and reduces lifespan by an average of <strong>2.5 years</strong>. Proper calorie management is the most effective tool for maintaining your dog's healthy weight.</p>`, highlight: "A 30 lb neutered adult dog needs approximately 795 kcal/day — about 2 cups of standard dry food. Overfeeding by just 10% (80 extra kcal/day) can lead to 1+ lb of weight gain per month." },
        faq: [
            { question: "How many calories does my dog need per day?", answer: "Use the RER formula: 70 × (weight in kg)^0.75, then multiply by the life stage factor. A typical 30 lb neutered adult needs about 795 kcal/day. Puppies need 2–3× more per pound of body weight." },
            { question: "What is RER in dog nutrition?", answer: "RER stands for Resting Energy Requirement — the calories a dog needs at complete rest. It's calculated as 70 × (body weight in kg)^0.75. This is the baseline before adjusting for activity, age, and reproductive status." },
            { question: "How many cups of food should I feed my dog?", answer: "Divide your dog's daily calorie need by the calories per cup on your food's label. Most dry foods are 350–450 kcal/cup. A 50 lb neutered adult (1,155 kcal/day) eating 400 kcal/cup food needs about 3 cups per day, split into 2 meals." },
            { question: "Should I feed my dog once or twice a day?", answer: "Most veterinarians recommend twice daily for adult dogs (morning and evening). Puppies under 6 months need 3–4 meals. Once-daily feeding can cause bloat in large breeds and may lead to begging behavior. Some working dogs may do well with one large meal." },
            { question: "How do I know if my dog is overweight?", answer: "Use the Body Condition Score (BCS): you should be able to feel (but not see) your dog's ribs easily. Looking from above, there should be a visible waist (hourglass shape). From the side, the belly should tuck up. If ribs are hard to feel, your dog is likely overweight." },
            { question: "Do neutered dogs need fewer calories?", answer: "Yes. Spaying/neutering reduces metabolism by approximately 25–30%. That's why the DER multiplier for neutered adults (×1.6) is lower than intact adults (×1.8). Many dogs gain weight after being altered if food isn't adjusted accordingly." },
            { question: "How many calories are in dog treats?", answer: "Common treats: small Milk-Bone ~40 kcal, Greenies dental chew ~70–140 kcal, bully stick ~90 kcal, pig ear ~230 kcal. The American Kennel Club recommends that treats make up no more than 10% of daily calories." },
        ],
    },
    "dog-water-intake-calculator": {
        subtitle: "Calculate how much water your dog should drink daily based on body weight, activity level, and weather conditions. Learn the signs of dehydration and overhydration in dogs.",
        explanation: { heading: "How Much Water Should My Dog Drink?", contentHTML: `<p>The general veterinary guideline is simple:</p>
<div class="explanation__highlight">
<strong>1 ounce of water per pound of body weight per day</strong><br/><br/>
A 30 lb dog needs approximately <strong>30 oz (≈ 3.75 cups)</strong> of water daily<br/>
A 60 lb dog needs approximately <strong>60 oz (≈ 7.5 cups)</strong> of water daily<br/><br/>
This is a baseline — actual needs vary with activity, temperature, and diet.
</div>

<h3>Factors That Increase Water Needs</h3>
<table><thead><tr><th>Factor</th><th>Adjustment</th><th>Why</th></tr></thead><tbody>
<tr><td>High activity (running, hiking)</td><td>+50%</td><td>Panting is a dog's primary cooling method and uses significant water</td></tr>
<tr><td>Hot weather (80°F+)</td><td>+25–50%</td><td>Dogs cool through panting and need more water to regulate body temperature</td></tr>
<tr><td>Dry kibble diet</td><td>Baseline</td><td>Dry food is ~10% moisture — dogs on kibble drink more water</td></tr>
<tr><td>Wet/canned food diet</td><td>−20–30%</td><td>Canned food is ~75% moisture, significantly supplementing water intake</td></tr>
<tr><td>Pregnant/nursing</td><td>+50–100%</td><td>Milk production requires significant fluid</td></tr>
<tr><td>Puppies</td><td>+50%</td><td>Growing puppies need more water per pound than adults</td></tr>
<tr><td>Senior dogs on medication</td><td>Varies</td><td>Some medications (steroids, diuretics) increase thirst significantly</td></tr>
</tbody></table>

<h3>Signs of Dehydration in Dogs</h3>
<ul>
<li><strong>Skin elasticity test (skin tenting):</strong> Gently pinch the skin on the back of the neck. In a hydrated dog, it springs back instantly. If it stays tented for 2+ seconds, the dog may be dehydrated.</li>
<li><strong>Dry, sticky gums:</strong> Healthy gums are wet and slippery. Dry or tacky gums indicate dehydration.</li>
<li><strong>Sunken eyes</strong> and <strong>lethargy</strong></li>
<li><strong>Loss of appetite</strong> and <strong>reduced urination</strong></li>
<li><strong>Thick, ropy saliva</strong> instead of thin and watery</li>
</ul>
<p>If your dog shows signs of <strong>severe dehydration</strong> (persistent skin tenting, sunken eyes, weakness), seek veterinary care immediately. Dehydration can become life-threatening quickly, especially in hot weather.</p>

<h3>Signs of Overhydration (Water Intoxication)</h3>
<p>While rare, <strong>water intoxication (hyponatremia)</strong> can occur in dogs, particularly those that play in water (swimming, fetching from lakes) or compulsively drink from hoses or sprinklers.</p>
<ul>
<li>Symptoms: bloating, vomiting, lethargy, loss of coordination, glazed eyes, seizures</li>
<li>Most common in small dogs playing in water for extended periods</li>
<li>If suspected, seek emergency veterinary care immediately</li>
</ul>

<h3>Tips for Keeping Your Dog Hydrated</h3>
<ul>
<li><strong>Always provide fresh water</strong> — change water at least once daily, more in hot weather</li>
<li><strong>Clean the bowl regularly</strong> — biofilm bacteria can make dogs avoid their water bowl</li>
<li><strong>Bring water on walks</strong> — carry a collapsible bowl and water bottle on walks longer than 30 minutes</li>
<li><strong>Add water to food</strong> — adding ¼ cup of water to dry kibble increases hydration and can slow fast eaters</li>
<li><strong>Consider a fountain</strong> — many dogs prefer running water over a still bowl</li>
<li><strong>Monitor intake</strong> — a sudden increase or decrease in water consumption can indicate health issues (diabetes, kidney disease, Cushing's)</li>
</ul>`, highlight: "A 30 lb dog needs about 30 oz (3.75 cups) of water daily at baseline. On a hot summer day with exercise, that increases to 56+ oz (7 cups). Always bring water on walks longer than 30 minutes." },
        faq: [
            { question: "How much water should my dog drink per day?", answer: "The general guideline is 1 ounce of water per pound of body weight per day. A 50 lb dog needs about 50 oz (6.25 cups). This increases with exercise, hot weather, dry food diet, and pregnancy/nursing." },
            { question: "How do I know if my dog is dehydrated?", answer: "Check the skin elasticity: gently pinch the skin on the back of the neck. If it takes more than 2 seconds to snap back, your dog may be dehydrated. Also check for dry/sticky gums, sunken eyes, lethargy, and decreased urination." },
            { question: "Can a dog drink too much water?", answer: "Yes — water intoxication (hyponatremia) can occur, especially in dogs that play in water for extended periods. Symptoms include bloating, vomiting, loss of coordination, and seizures. It's most common in small dogs swimming or playing with hoses. Seek emergency vet care if suspected." },
            { question: "Should I limit my dog's water intake?", answer: "Generally no — dogs should have access to fresh water at all times. The only exception is when a vet specifically recommends water restriction for a medical condition. Removing water overnight is acceptable for house-training puppies, but always provide water during the day." },
            { question: "Does wet food count toward water intake?", answer: "Yes. Canned/wet food is approximately 75% moisture, so dogs eating wet food get a significant portion of their daily water from food. Dogs on wet food diets typically drink 20–30% less from their bowl. Dogs on dry kibble (~10% moisture) need to drink more." },
            { question: "Why is my dog suddenly drinking more water?", answer: "A sudden increase in water consumption (polydipsia) can indicate several health conditions: diabetes mellitus, kidney disease, Cushing's disease (hyperadrenocorticism), pyometra (uterine infection in unspayed females), or medication side effects (steroids, anti-seizure drugs). If thirst increases significantly, consult your vet." },
            { question: "Should I give my dog ice water on hot days?", answer: "Despite the internet myth, ice water does NOT cause bloat (GDV) in dogs. The ASPCA and veterinary emergency specialists confirm that ice water is safe and can help cool an overheated dog. However, avoid letting overheated dogs drink large amounts of any water too quickly — offer small amounts frequently instead." },
        ],
    },
};

export default async function PetCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("pet").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/pet-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Pet Calculators", url: canonicalUrl("/pet-calculators") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl)]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-pet-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Pet Calculators", href: "/pet-calculators" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <AuthorBadge categoryKey="pet" />
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <PetCalculatorCore calcType={calc.calcType || "dog-age"} />
                    {content && (<>
                        <DynamicExplanation heading={content.explanation?.heading} paragraphs={content.explanation?.paragraphs} contentHTML={content.explanation?.contentHTML} highlight={content.explanation?.highlight} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar"><TrendingCalculations variant="sidebar" /></aside>
            </div>
        </main>
    );
}
