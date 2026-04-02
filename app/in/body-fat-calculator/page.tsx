import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import BodyFatCalculatorCore from "@/components/calculator/BodyFatCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Body Fat Calculator India 2026 — US Navy Method, BMI Estimate, Lean Body Mass & Category Reference",
    description: "Free Body Fat Calculator with 4 modes: US Navy Method (gender-aware, neck/waist/hip circumference), BMI-Based Estimate (Deurenberg formula), Body Fat Category Reference (age-wise tables for men & women), and Lean Body Mass Target Weight Planner. Covers Indian thin-fat phenotype, ICMR guidelines, subcutaneous vs visceral fat, and how to measure circumferences.",
    keywords: ["body fat calculator", "body fat percentage India", "US Navy body fat formula", "body fat calculator men women", "lean body mass calculator", "body fat categories", "Indian thin-fat phenotype", "visceral fat India", "body fat percentage chart", "ICMR body fat guidelines"],
    alternates: buildCountryAlternates("IN", "/in/body-fat-calculator", "body-fat-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is body fat percentage?", answer: "Body fat percentage is the proportion of your total body weight that consists of fat tissue. Unlike BMI, which only considers height and weight, body fat percentage distinguishes between fat mass and lean mass (muscles, bones, organs, water). For example, a 80 kg person with 20% body fat has 16 kg of fat and 64 kg of lean mass. Body fat percentage is considered a more accurate indicator of health and fitness than weight or BMI alone." },
    { question: "How is body fat calculated using the US Navy method?", answer: "The US Navy Body Fat formula uses circumference measurements. For men: BF% = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76. For women: BF% = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387. All measurements are in inches. The formula was developed by Hodgdon and Beckett at the Naval Health Research Center and has been validated against hydrostatic weighing with a margin of error of approximately 3–4%." },
    { question: "What is a healthy body fat percentage for Indian men?", answer: "For Indian men: Essential fat is 3–5% (survival minimum). Athletes range from 6–13%. Fitness level is 14–17%. Average/acceptable is 18–24%. Obese is 25% and above. However, due to the Indian 'thin-fat phenotype,' metabolic risk may begin at lower body fat percentages compared to Western populations. ICMR research suggests that health risks increase at a BMI of 23+ for South Asians, corresponding to approximately 20–22% body fat for men in their 30s." },
    { question: "What is a healthy body fat percentage for Indian women?", answer: "For Indian women: Essential fat is 10–13% (needed for hormonal and reproductive health). Athletes range from 14–20%. Fitness level is 21–24%. Average/acceptable is 25–31%. Obese is 32% and above. Women biologically require more essential fat than men for hormonal balance, menstrual regulation, and pregnancy support. Very low body fat in women (below 12%) can cause amenorrhea, bone loss, and hormonal disorders." },
    { question: "Body fat vs BMI — which is more accurate?", answer: "Body fat percentage is significantly more accurate than BMI for assessing health. BMI only considers height and weight — it cannot distinguish between muscle and fat. A muscular athlete may have a 'overweight' BMI but healthy body fat. Conversely, a sedentary person may have 'normal' BMI but high body fat (this is especially common among Indians — the thin-fat phenotype). For Indians specifically, BMI is particularly misleading because South Asians tend to carry more visceral fat at the same BMI as Caucasians." },
    { question: "What is visceral fat and why is it dangerous?", answer: "Visceral fat is the fat stored deep inside your abdomen, surrounding vital organs like the liver, pancreas, and intestines. Unlike subcutaneous fat (which is stored under the skin and is relatively harmless), visceral fat is metabolically active and releases inflammatory compounds and hormones that increase the risk of type 2 diabetes, heart disease, stroke, and certain cancers. Indians are genetically predisposed to higher visceral fat accumulation — this is why waist circumference is a critical health indicator for South Asians." },
    { question: "What is the Indian thin-fat phenotype?", answer: "The 'thin-fat phenotype' (also called 'thin-outside-fat-inside' or TOFI) is a body composition pattern common in South Asians, including Indians. People with this phenotype appear thin or normal-weight based on BMI, but carry disproportionately high amounts of visceral fat and have lower muscle mass. Research published in the Indian Journal of Medical Research and by the National Institute of Nutrition (NIN) shows that Indians develop insulin resistance and metabolic syndrome at lower BMI levels than Western populations. This is why ICMR uses BMI 23 (not 25) as the overweight threshold for Indians." },
    { question: "How do I measure my waist circumference?", answer: "For accurate body fat measurement: Stand upright and relax your abdomen. For men, wrap a measuring tape around your waist at navel level. For women, measure at the narrowest point of your torso (usually between the lowest rib and the iliac crest). The tape should be snug but not compressing the skin. Take the measurement at the end of a normal exhale. Do not suck in your stomach. Use a non-stretching, flexible tape measure for consistency." },
    { question: "How do I measure my neck circumference?", answer: "Measure your neck circumference just below the larynx (Adam's apple). Look straight ahead and keep your shoulders relaxed. The tape should be level and perpendicular to the neck's axis — not tilted. It should touch the skin all the way around without compressing. For best accuracy, measure in the morning before eating, as neck size can fluctuate slightly throughout the day." },
    { question: "Can body fat be too low?", answer: "Yes, dangerously so. Essential fat (3–5% for men, 10–13% for women) is the minimum required for survival. Functions include: organ insulation and protection, hormone production (especially estrogen and testosterone), vitamin absorption (A, D, E, K are fat-soluble), temperature regulation, and nerve protection. Going below essential fat levels can cause: hormonal disruption, amenorrhea in women, weakened immune system, chronic fatigue, organ damage, and bone density loss. Bodybuilders who compete at 3–4% do so only for brief periods." },
    { question: "What is essential fat?", answer: "Essential fat is the minimum amount of body fat necessary for basic physiological functioning. For men, this is approximately 3–5% of total body weight. For women, it's 10–13% — higher because women need additional fat for reproductive health, breast tissue, and hormonal regulation. Essential fat is stored in organs, bone marrow, the central nervous system, and muscle tissue. It is different from storage fat (subcutaneous and visceral fat). Losing essential fat is medically dangerous and should never be a fitness goal." },
    { question: "How often should I check my body fat?", answer: "For general health monitoring, check every 4–6 weeks. For active fitness goals (fat loss or muscle gain), checking every 2–4 weeks provides useful trend data. Always measure under the same conditions: same time of day, same hydration level, same clothing. Morning measurements before eating are most consistent. Don't obsess over single readings — look at trends over 3+ measurements. Body fat naturally fluctuates 1–2% day-to-day due to hydration, food intake, and activity levels." },
    { question: "What is lean body mass?", answer: "Lean body mass (LBM) is everything in your body that is NOT fat — it includes muscles, bones, organs, blood, water, and connective tissue. LBM = Total Weight − Fat Mass. For example, if you weigh 80 kg with 20% body fat, your LBM is 64 kg (80 − 16). During weight loss, the goal should be to preserve lean body mass while losing fat. Crash diets often cause muscle loss alongside fat loss, which is counterproductive for long-term health and metabolism." },
    { question: "Does body fat percentage change with age?", answer: "Yes, body fat naturally increases with age, even if weight stays the same. This happens because: muscle mass declines approximately 3–8% per decade after age 30 (sarcopenia), metabolism slows, hormonal changes (reduced testosterone in men, menopause in women) promote fat storage, and physical activity typically decreases. This is why healthy body fat ranges increase by about 2–3% per decade. A 50-year-old man at 22% body fat is in the 'Fitness' category, while a 25-year-old at 22% would be 'Average.'" },
    { question: "How accurate is the US Navy body fat method?", answer: "The US Navy body fat method has been validated against hydrostatic weighing (underwater weighing) and DEXA scans, with a typical margin of error of 3–4%. It is considered one of the most accurate field methods (non-laboratory). Limitations include: it doesn't account for individual body shape variations, very muscular individuals may get overestimates, and measurement technique affects accuracy. For maximum precision, DEXA scans (available at major hospitals in Delhi, Mumbai, Bangalore) are the gold standard, but the US Navy method is the best free alternative for regular tracking." },
];

export default function BodyFatCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Body Fat Calculator" },
        ]),
        webAppSchema("Body Fat Calculator India 2026", canonicalUrl("/in/body-fat-calculator")),
        {
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map(f => ({
                "@type": "Question", name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-bodyfat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Body Fat Calculator" },
            ]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Body Fat Calculator India 2026</h1>
            <PageDesc>
                Estimate your body fat percentage with 4 methods — US Navy Body Fat Formula (gender-aware with neck, waist,
                and hip measurements), BMI-Based Estimate (Deurenberg formula, no tape needed), Body Fat Category Reference
                (age-wise tables for men &amp; women), and Lean Body Mass Target Weight Planner. India-adapted with
                thin-fat phenotype guidance and ICMR/Asian BMI thresholds.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <BodyFatCalculatorCore />

            <section className="in-content"><div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} /></section>
            <FAQAccordion title="Body Fat Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-body-fat">What Is Body Fat Percentage?</h2>
    <p><strong>Body fat percentage</strong> is the proportion of your total body weight that consists of fat tissue. Unlike body weight or BMI (Body Mass Index), which cannot distinguish between fat and muscle, body fat percentage gives you a precise picture of your body composition — how much of you is fat versus lean tissue (muscles, bones, organs, water).</p>
    <p>For example, two people weighing 75 kg can have vastly different health profiles: a gym-goer at 15% body fat (11.25 kg fat, 63.75 kg lean) is much healthier than a sedentary person at 30% body fat (22.5 kg fat, 52.5 kg lean), even though they weigh the same.</p>
    <div class="explanation__highlight">
        <strong>🇮🇳 Why This Matters for Indians:</strong> Indians are genetically prone to the <strong>&ldquo;thin-fat phenotype&rdquo;</strong> — carrying disproportionately high visceral (abdominal) fat despite appearing slim. This makes body fat percentage a far more important health metric for Indians than weight or BMI alone. The Indian Council of Medical Research (ICMR) recommends lower BMI thresholds (23 for overweight, 25 for obese) specifically because Indians develop metabolic disease at lower body weight.
    </div>

    <h2 id="us-navy-formula">The US Navy Body Fat Formula</h2>
    <p>The US Navy Body Fat method was developed by <strong>Hodgdon and Beckett</strong> at the Naval Health Research Center and is used by the United States military for fitness assessments. It uses circumference measurements and has been validated against hydrostatic weighing with 3&ndash;4% margin of error.</p>

    <h3>Formula for Men</h3>
    <div class="explanation__highlight">
        <strong>BF% = 86.010 &times; log<sub>10</sub>(waist &minus; neck) &minus; 70.041 &times; log<sub>10</sub>(height) + 36.76</strong><br/><br/>
        Measurements in inches. Waist measured at navel. Neck measured below Adam&rsquo;s apple.
    </div>

    <h3>Formula for Women</h3>
    <div class="explanation__highlight">
        <strong>BF% = 163.205 &times; log<sub>10</sub>(waist + hip &minus; neck) &minus; 97.684 &times; log<sub>10</sub>(height) &minus; 78.387</strong><br/><br/>
        Measurements in inches. Waist at narrowest point. Hip at widest point. Neck below larynx.
    </div>

    <h3>Worked Example (Indian Male)</h3>
    <table>
        <thead><tr><th>Input</th><th>Value (cm)</th><th>Value (inches)</th></tr></thead>
        <tbody>
            <tr><td>Height</td><td>175 cm</td><td>68.90&Prime;</td></tr>
            <tr><td>Neck</td><td>38 cm</td><td>14.96&Prime;</td></tr>
            <tr><td>Waist</td><td>90 cm</td><td>35.43&Prime;</td></tr>
        </tbody>
    </table>
    <p><strong>Calculation:</strong> BF% = 86.010 &times; log<sub>10</sub>(35.43 &minus; 14.96) &minus; 70.041 &times; log<sub>10</sub>(68.90) + 36.76 = <strong>20.8%</strong> (Average category)</p>

    <h2 id="body-fat-categories">Body Fat Categories — Men &amp; Women</h2>
    <table>
        <thead><tr><th>Category</th><th>Men (% BF)</th><th>Women (% BF)</th><th>Description</th></tr></thead>
        <tbody>
            <tr><td><strong>Essential Fat</strong></td><td>3&ndash;5%</td><td>10&ndash;13%</td><td>Minimum for survival. Below this is medically dangerous.</td></tr>
            <tr><td><strong>Athletes</strong></td><td>6&ndash;13%</td><td>14&ndash;20%</td><td>Competitive athletes, visible muscle definition.</td></tr>
            <tr><td><strong>Fitness</strong></td><td>14&ndash;17%</td><td>21&ndash;24%</td><td>Active, fit individuals. Ideal for long-term health.</td></tr>
            <tr><td><strong>Average</strong></td><td>18&ndash;24%</td><td>25&ndash;31%</td><td>Typical range for moderately active adults.</td></tr>
            <tr><td><strong>Obese</strong></td><td>&ge;25%</td><td>&ge;32%</td><td>Increased health risk. Action recommended.</td></tr>
        </tbody>
    </table>

    <h2 id="thin-fat-phenotype">The Indian &ldquo;Thin-Fat&rdquo; Phenotype</h2>
    <p>The <strong>thin-fat phenotype</strong> (also called TOFI &mdash; Thin Outside, Fat Inside) is a body composition pattern extensively documented in South Asian populations by researchers at the National Institute of Nutrition (NIN), Hyderabad, and published in journals including the <em>Indian Journal of Medical Research</em> and <em>The Lancet</em>.</p>
    <p>Key characteristics of the Indian thin-fat phenotype:</p>
    <ol>
        <li><strong>Higher visceral fat</strong> &mdash; Indians store more fat around organs (visceral) rather than under the skin (subcutaneous), even at normal BMI.</li>
        <li><strong>Lower muscle mass</strong> &mdash; South Asians tend to have less skeletal muscle percentage compared to Caucasians at the same weight.</li>
        <li><strong>Earlier insulin resistance</strong> &mdash; Metabolic syndrome, type 2 diabetes, and cardiovascular disease develop at lower BMI/BF% thresholds.</li>
        <li><strong>Abdominal obesity prevalence</strong> &mdash; Studies show that 30&ndash;40% of &ldquo;normal BMI&rdquo; Indians in urban areas have excess abdominal fat.</li>
    </ol>
    <div class="explanation__highlight">
        <strong>ICMR Thresholds for Indians:</strong> Normal BMI: 18.5&ndash;22.9 (not 24.9). Overweight: 23.0&ndash;24.9 (not 25&ndash;29.9). Obese: &ge;25 (not &ge;30). This is a <strong>5-point shift</strong> from WHO global standards, reflecting the higher metabolic risk at lower BMI for South Asians.
    </div>

    <h2 id="how-to-measure">How to Measure Body Circumferences</h2>
    <table>
        <thead><tr><th>Measurement</th><th>Location</th><th>Tips</th></tr></thead>
        <tbody>
            <tr><td><strong>Neck</strong></td><td>Just below the Adam&rsquo;s apple (larynx)</td><td>Look straight ahead. Tape level and snug, not tight. Measure in morning.</td></tr>
            <tr><td><strong>Waist (Men)</strong></td><td>At navel (belly button) level</td><td>Stand relaxed. Don&rsquo;t suck in stomach. Measure at end of normal exhale.</td></tr>
            <tr><td><strong>Waist (Women)</strong></td><td>At narrowest point of torso</td><td>Usually between lowest rib and iliac crest (hip bone).</td></tr>
            <tr><td><strong>Hip (Women only)</strong></td><td>At widest point of buttocks</td><td>Feet together. Tape level around fullest part.</td></tr>
        </tbody>
    </table>

    <h2 id="subcutaneous-vs-visceral">Subcutaneous vs Visceral Fat</h2>
    <table>
        <thead><tr><th>Feature</th><th>Subcutaneous Fat</th><th>Visceral Fat</th></tr></thead>
        <tbody>
            <tr><td><strong>Location</strong></td><td>Under the skin (arms, thighs, hips)</td><td>Deep inside abdomen (around organs)</td></tr>
            <tr><td><strong>Visibility</strong></td><td>You can pinch it</td><td>Hidden — &ldquo;belly fat&rdquo;</td></tr>
            <tr><td><strong>Health risk</strong></td><td>Generally lower</td><td><strong>High</strong> — linked to diabetes, heart disease, stroke</td></tr>
            <tr><td><strong>Indian prevalence</strong></td><td>Moderate</td><td><strong>Disproportionately high</strong> (thin-fat phenotype)</td></tr>
            <tr><td><strong>Reduction</strong></td><td>Cardio + caloric deficit</td><td>High-intensity exercise + reduced refined carbs</td></tr>
            <tr><td><strong>Measurement</strong></td><td>Skinfold calipers</td><td>Waist circumference, DEXA scan, MRI</td></tr>
        </tbody>
    </table>

    <h2 id="age-wise-ranges">Age-Wise Healthy Body Fat Ranges</h2>
    <h3>Men — Body Fat % by Age</h3>
    <table>
        <thead><tr><th>Age</th><th>Essential</th><th>Athletes</th><th>Fitness</th><th>Average</th><th>Obese</th></tr></thead>
        <tbody>
            <tr><td>20&ndash;29</td><td>3&ndash;5%</td><td>6&ndash;13%</td><td>14&ndash;17%</td><td>18&ndash;24%</td><td>&ge;25%</td></tr>
            <tr><td>30&ndash;39</td><td>3&ndash;5%</td><td>6&ndash;14%</td><td>15&ndash;18%</td><td>19&ndash;25%</td><td>&ge;26%</td></tr>
            <tr><td>40&ndash;49</td><td>3&ndash;5%</td><td>6&ndash;16%</td><td>17&ndash;20%</td><td>21&ndash;27%</td><td>&ge;28%</td></tr>
            <tr><td>50&ndash;59</td><td>3&ndash;5%</td><td>6&ndash;17%</td><td>18&ndash;21%</td><td>22&ndash;28%</td><td>&ge;29%</td></tr>
            <tr><td>60+</td><td>3&ndash;5%</td><td>6&ndash;18%</td><td>19&ndash;22%</td><td>23&ndash;29%</td><td>&ge;30%</td></tr>
        </tbody>
    </table>
    <h3>Women — Body Fat % by Age</h3>
    <table>
        <thead><tr><th>Age</th><th>Essential</th><th>Athletes</th><th>Fitness</th><th>Average</th><th>Obese</th></tr></thead>
        <tbody>
            <tr><td>20&ndash;29</td><td>10&ndash;13%</td><td>14&ndash;20%</td><td>21&ndash;24%</td><td>25&ndash;31%</td><td>&ge;32%</td></tr>
            <tr><td>30&ndash;39</td><td>10&ndash;13%</td><td>14&ndash;21%</td><td>22&ndash;25%</td><td>26&ndash;32%</td><td>&ge;33%</td></tr>
            <tr><td>40&ndash;49</td><td>10&ndash;13%</td><td>14&ndash;23%</td><td>24&ndash;27%</td><td>28&ndash;34%</td><td>&ge;35%</td></tr>
            <tr><td>50&ndash;59</td><td>10&ndash;13%</td><td>14&ndash;24%</td><td>25&ndash;28%</td><td>29&ndash;35%</td><td>&ge;36%</td></tr>
            <tr><td>60+</td><td>10&ndash;13%</td><td>14&ndash;25%</td><td>26&ndash;29%</td><td>30&ndash;36%</td><td>&ge;37%</td></tr>
        </tbody>
    </table>

    <h2 id="bmi-vs-body-fat">BMI vs Body Fat Percentage</h2>
    <table>
        <thead><tr><th>Feature</th><th>BMI</th><th>Body Fat %</th></tr></thead>
        <tbody>
            <tr><td><strong>Formula</strong></td><td>Weight / Height&sup2;</td><td>Various (Navy, DEXA, etc.)</td></tr>
            <tr><td><strong>Measurements needed</strong></td><td>Height + Weight only</td><td>Height + Weight + Circumferences</td></tr>
            <tr><td><strong>Distinguishes fat vs muscle?</strong></td><td>❌ No</td><td>✅ Yes</td></tr>
            <tr><td><strong>Accuracy for athletes</strong></td><td>Poor (labels muscular as obese)</td><td>Good</td></tr>
            <tr><td><strong>Accuracy for Indians</strong></td><td>Poor (misses thin-fat phenotype)</td><td>Better</td></tr>
            <tr><td><strong>Use case</strong></td><td>Quick screening</td><td>Detailed body composition</td></tr>
        </tbody>
    </table>

    <h2 id="reduce-body-fat">How to Reduce Body Fat — Evidence-Based Guide</h2>
    <ol>
        <li><strong>Caloric deficit</strong> &mdash; Consume 300&ndash;500 fewer calories than your TDEE (Total Daily Energy Expenditure). Avoid crash diets below 1,200 kcal — they cause muscle loss.</li>
        <li><strong>Strength training</strong> &mdash; Resistance exercise 3&ndash;4 times/week preserves lean mass during fat loss. Compound movements (squats, deadlifts, bench press) are most effective.</li>
        <li><strong>Protein intake</strong> &mdash; Aim for 1.6&ndash;2.2g protein per kg bodyweight. For an 80 kg person, that&rsquo;s 128&ndash;176g/day. Indian sources: paneer, dal, eggs, chicken, whey.</li>
        <li><strong>Reduce refined carbs</strong> &mdash; Replace white rice/maida with brown rice, roti, oats. Refined carbs spike insulin & promote visceral fat storage (particularly significant for Indians).</li>
        <li><strong>Cardio</strong> &mdash; 150 min/week moderate (brisk walking) or 75 min/week vigorous (running, cycling). HIIT is especially effective for visceral fat reduction.</li>
        <li><strong>Sleep &amp; stress</strong> &mdash; 7&ndash;9 hours sleep. Chronic stress elevates cortisol, which promotes abdominal fat storage.</li>
        <li><strong>Track consistently</strong> &mdash; Measure body fat every 2&ndash;4 weeks under the same conditions. Focus on trends, not individual readings.</li>
    </ol>
`;
