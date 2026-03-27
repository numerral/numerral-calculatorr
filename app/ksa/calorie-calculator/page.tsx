// Standalone page — /ksa/calorie-calculator
// KSA Calorie Calculator with comprehensive SFDA-aligned content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import CalorieCalculatorCore from "@/components/calculator/CalorieCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Calorie Calculator (KSA) — حاسبة السعرات الحرارية | BMR & TDEE (2026)",
    description: "Calculate your daily calorie needs with SFDA-aligned guidelines. BMR, TDEE, calorie deficit for weight loss, macronutrient breakdown, and Saudi food calorie reference table — Kabsa, Mandi, Shawarma & more.",
    keywords: ["calorie calculator Saudi Arabia", "حاسبة السعرات الحرارية", "BMR calculator KSA", "TDEE calculator", "calorie deficit weight loss", "Saudi food calories", "SFDA dietary guidelines", "حساب السعرات الحرارية", "Kabsa calories", "حاسبة الوزن المثالي"],
    alternates: { canonical: canonicalUrl("/ksa/calorie-calculator") },
};

const FAQ_ITEMS = [
    { question: "How many calories should I eat per day in Saudi Arabia?", answer: "According to the SFDA (Saudi Food and Drug Authority) Saudi Healthy Plate 2024 guidelines, the reference daily calorie intake is approximately 2,800 kcal for men (65 kg) and 2,100 kcal for women (56 kg). However, your actual needs depend on age, weight, height, and activity level. Use the Mifflin-St Jeor equation in our calculator for a personalized result." },
    { question: "What is BMR and how is it calculated?", answer: "BMR (Basal Metabolic Rate) is the number of calories your body burns at rest to maintain basic functions like breathing and circulation. We use the Mifflin-St Jeor equation: Men: BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5. Women: BMR = (10 × weight kg) + (6.25 × height cm) − (5 × age) − 161. This formula is considered the most accurate by nutrition researchers." },
    { question: "What is TDEE?", answer: "TDEE (Total Daily Energy Expenditure) is your total daily calorie burn including all activities. It's calculated by multiplying your BMR by an activity factor: Sedentary (×1.2), Lightly Active (×1.375), Moderately Active (×1.55), Very Active (×1.725), or Extra Active (×1.9). Your TDEE represents the calories you need to maintain your current weight." },
    { question: "How many calories does Kabsa have?", answer: "A standard serving of Chicken Kabsa (200g) contains approximately 312 calories, with 10.8g protein, 34.7g carbohydrates, and 14.5g fat. Kabsa is the national dish of Saudi Arabia and is one of the most calorie-dense traditional meals. Mutton Kabsa can be slightly higher in calories due to the fat content in lamb." },
    { question: "How much calorie deficit do I need to lose 1 kg per week?", answer: "To lose 1 kg per week, you need a daily calorie deficit of approximately 1,000 kcal (since 1 kg of body fat ≈ 7,700 kcal). For a safer, more sustainable rate of 0.5 kg per week, aim for a 500 kcal daily deficit. Never go below 1,200 kcal/day for women or 1,500 kcal/day for men without medical supervision." },
    { question: "What is the obesity rate in Saudi Arabia?", answer: "Saudi Arabia has one of the highest obesity rates in the region. The World Obesity Atlas 2024 projects that by 2025, obesity will affect 40% of men and 49.1% of women. Among children aged 2-14, 14.6% are obese, and 45.1% of adults aged 15+ are classified as overweight. This is why the SFDA has introduced new restaurant labeling regulations effective July 2025." },
    { question: "What are the SFDA new restaurant regulations (July 2025)?", answer: "Starting July 1, 2025, the SFDA mandates: (1) Caffeine content disclosure on all menus with a note that max daily intake is 400mg, (2) 'Salt' icon on items with over 5g salt (2,000mg sodium), (3) Physical activity calorie burn labels showing how much exercise is needed to burn off each meal's calories. These apply to all restaurants and cafes in Saudi Arabia." },
    { question: "How many calories does Shawarma have?", answer: "A standard chicken shawarma wrap contains approximately 450 calories with 30g protein, 40g carbohydrates, and 20g fat. Shawarma platters served with rice can range from 700-900 calories. For a healthier option, skip the bread and eat the chicken with salad, which can reduce the calories to around 250-300 kcal." },
    { question: "What macronutrient ratio is best for weight loss?", answer: "A balanced approach for weight loss is 30% protein, 40% carbohydrates, and 30% fat. Higher protein (1.6-2.4g per kg body weight) helps preserve muscle mass during calorie deficit. For example, on a 1,800 kcal diet: Protein = 135g (540 kcal), Carbs = 180g (720 kcal), Fat = 60g (540 kcal). Adjust based on your preferences and results." },
    { question: "How many calories in Arabic coffee and dates?", answer: "Plain Arabic coffee (Qahwa) is virtually calorie-free at only 2 kcal per cup. Dates are calorie-dense: 2 Medjool dates contain about 110 kcal with 26g of natural sugars. During Ramadan, a typical Iftar opener of 3 dates + Arabic coffee provides about 170 kcal. Dates are nutritious (fiber, potassium, magnesium) but should be consumed in moderation during weight loss." },
    { question: "How should I manage calories during Ramadan?", answer: "During Ramadan, your eating window is compressed to Iftar and Suhoor. Tips: (1) Break fast with 2-3 dates + water, (2) Eat a balanced Iftar with protein, vegetables, and complex carbs, (3) Avoid deep-fried Samosas and sugary drinks, (4) Suhoor should include slow-digesting foods like oats, eggs, and yogurt, (5) Your total daily calorie target remains the same — just distributed across fewer meals." },
    { question: "Is intermittent fasting popular in Saudi Arabia?", answer: "Yes, intermittent fasting has gained significant popularity in Saudi Arabia, partly influenced by the Ramadan fasting tradition. Many Saudi fitness enthusiasts practice 16:8 fasting (16 hours fast, 8 hours eating window). This naturally aligns with the Ramadan schedule. Studies suggest intermittent fasting can help with weight management when combined with a proper calorie target." },
];

export default function CalorieCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Calorie Calculator" },
        ]),
        webAppSchema("Calorie Calculator (KSA — حاسبة السعرات الحرارية)", canonicalUrl("/ksa/calorie-calculator")),
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
                "@type": "Question", name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-calorie" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Calorie Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Calorie Calculator (KSA) — حاسبة السعرات الحرارية</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your daily calorie needs using the scientifically-proven Mifflin-St Jeor equation. Includes BMR, TDEE, calorie deficit for weight loss, macronutrient breakdown, and Saudi food calorie reference — aligned with SFDA guidelines.
            </p>
            <AuthorBadge categoryKey="salary" />
            <CalorieCalculatorCore />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Calorie Calculator FAQ — Saudi Arabia" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Budget for healthier food and gym memberships</div>
                        </div>
                    </Link>
                    <Link href="/ksa/savings-goal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🎯</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Savings Goal Calculator</div>
                            <div className="ksa-related-link__desc">Save for a diet plan or fitness program</div>
                        </div>
                    </Link>
                    <Link href="/ksa/zakat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🕌</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Zakat Calculator</div>
                            <div className="ksa-related-link__desc">Zakat supports community food programs</div>
                        </div>
                    </Link>
                    <Link href="/ksa/personal-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏦</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Personal Loan Calculator</div>
                            <div className="ksa-related-link__desc">Finance bariatric surgery or health programs</div>
                        </div>
                    </Link>
                    <Link href="/ksa/dependent-levy-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">👨‍👩‍👧‍👦</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Dependent Levy Calculator</div>
                            <div className="ksa-related-link__desc">Family meal planning within your budget</div>
                        </div>
                    </Link>
                    <Link href="/ksa/vat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🧾</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">VAT Calculator</div>
                            <div className="ksa-related-link__desc">15% VAT applies to restaurant meals and supplements</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-calorie-calculator">What Is a Calorie Calculator?</h2>
    <p>A <strong>calorie calculator</strong> estimates the number of <strong>calories (kcal)</strong> your body needs each day to maintain, lose, or gain weight. It works by first calculating your <strong>Basal Metabolic Rate (BMR)</strong> — the energy your body uses at complete rest — then adjusting for your <strong>activity level</strong> to determine your <strong>Total Daily Energy Expenditure (TDEE)</strong>.</p>
    <p>Our calculator uses the <strong>Mifflin-St Jeor equation</strong>, which is considered the most accurate BMR formula by the American Dietetic Association and is widely recommended by nutritionists globally.</p>
    <div class="explanation__highlight">
        <strong>How It Works:</strong><br/>
        <strong>Step 1:</strong> Calculate BMR (calories at rest)<br/>
        <strong>Step 2:</strong> Multiply by activity factor = TDEE (maintenance calories)<br/>
        <strong>Step 3:</strong> Subtract deficit = target calories for weight loss
    </div>

    <h2 id="obesity-crisis">Why It Matters — Saudi Arabia's Health Challenge</h2>
    <p>Saudi Arabia faces a significant obesity epidemic. According to the <strong>World Obesity Atlas 2024</strong>:</p>
    <table>
        <thead><tr><th>Metric</th><th>Rate</th><th>Source</th></tr></thead>
        <tbody>
            <tr><td><strong>Obesity rate — Men (2025)</strong></td><td>40.0%</td><td>World Obesity Atlas</td></tr>
            <tr><td><strong>Obesity rate — Women (2025)</strong></td><td>49.1%</td><td>World Obesity Atlas</td></tr>
            <tr><td><strong>Overweight (15+ age)</strong></td><td>45.1%</td><td>stats.gov.sa</td></tr>
            <tr><td><strong>Child obesity (2-14)</strong></td><td>14.6%</td><td>stats.gov.sa</td></tr>
        </tbody>
    </table>
    <p>Understanding your daily calorie needs is the <strong>first step</strong> toward managing weight effectively. The <strong>SFDA</strong> is also taking action with new restaurant labeling regulations starting <strong>July 2025</strong>.</p>

    <h2 id="bmr-formula">How to Calculate BMR — The Mifflin-St Jeor Equation</h2>
    <p>The <strong>Mifflin-St Jeor equation</strong> (1990) is the gold standard for estimating BMR:</p>
    <table>
        <thead><tr><th>Gender</th><th>Formula</th></tr></thead>
        <tbody>
            <tr><td><strong>Men</strong></td><td>BMR = (10 × weight<sub>kg</sub>) + (6.25 × height<sub>cm</sub>) − (5 × age) + 5</td></tr>
            <tr><td><strong>Women</strong></td><td>BMR = (10 × weight<sub>kg</sub>) + (6.25 × height<sub>cm</sub>) − (5 × age) − 161</td></tr>
        </tbody>
    </table>
    <h3>Worked Example</h3>
    <p>A 30-year-old Saudi male, 175 cm tall, weighing 80 kg:</p>
    <ul>
        <li>BMR = (10 × 80) + (6.25 × 175) − (5 × 30) + 5</li>
        <li>BMR = 800 + 1,093.75 − 150 + 5 = <strong>1,748.75 kcal/day</strong></li>
    </ul>

    <h2 id="tdee-activity">Understanding TDEE & Activity Levels</h2>
    <p>Your <strong>TDEE</strong> accounts for all daily movement — not just exercise, but daily activities like walking, cooking, and commuting.</p>
    <table>
        <thead><tr><th>Activity Level</th><th>Multiplier</th><th>Description</th><th>Example in KSA</th></tr></thead>
        <tbody>
            <tr><td><strong>Sedentary</strong></td><td>× 1.2</td><td>Little or no exercise</td><td>Office worker in Riyadh, drives everywhere</td></tr>
            <tr><td><strong>Lightly Active</strong></td><td>× 1.375</td><td>Light exercise 1-3 days/week</td><td>Weekend walking at Corniche or mall</td></tr>
            <tr><td><strong>Moderately Active</strong></td><td>× 1.55</td><td>Exercise 3-5 days/week</td><td>Regular gym, cycling, swimming</td></tr>
            <tr><td><strong>Very Active</strong></td><td>× 1.725</td><td>Hard exercise 6-7 days/week</td><td>CrossFit, daily gym + outdoor activities</td></tr>
            <tr><td><strong>Extra Active</strong></td><td>× 1.9</td><td>Athlete / physical job</td><td>Construction worker, professional athlete</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>KSA Context:</strong> Due to extreme summer heat (40°C+), many Saudi residents are classified as <strong>sedentary</strong> during summer months when outdoor exercise is impractical. Indoor gyms and malls become primary activity venues.
    </div>

    <h2 id="calorie-deficit">Calorie Deficit for Weight Loss — Safe Guidelines</h2>
    <p>To lose weight, you must consume <strong>fewer calories</strong> than your TDEE. This is called a <strong>calorie deficit</strong>.</p>
    <table>
        <thead><tr><th>Daily Deficit</th><th>Weekly Weight Loss</th><th>Sustainability</th></tr></thead>
        <tbody>
            <tr><td>250 kcal</td><td>~0.25 kg</td><td>Very sustainable, minimal hunger</td></tr>
            <tr><td><strong>500 kcal</strong></td><td><strong>~0.5 kg</strong></td><td><strong>Recommended — gold standard</strong></td></tr>
            <tr><td>750 kcal</td><td>~0.75 kg</td><td>Moderate, some hunger</td></tr>
            <tr><td>1,000 kcal</td><td>~1.0 kg</td><td>Aggressive — risk of muscle loss</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Minimum Safe Intake:</strong> Never go below <strong>1,200 kcal/day</strong> (women) or <strong>1,500 kcal/day</strong> (men) without medical supervision. Extreme restriction causes muscle loss, nutrient deficiencies, and metabolic damage.
    </div>

    <h2 id="saudi-food-calories">Saudi Food Calorie Guide — Popular KSA Dishes</h2>
    <p>Knowing the calorie content of popular Saudi dishes helps you make informed choices:</p>
    <table>
        <thead><tr><th>Food</th><th>Serving</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
        <tbody>
            <tr><td><strong>Chicken Kabsa</strong></td><td>200g</td><td>312 kcal</td><td>10.8g</td><td>34.7g</td><td>14.5g</td></tr>
            <tr><td><strong>Mutton Mandi</strong></td><td>200g</td><td>288 kcal</td><td>12.5g</td><td>37.2g</td><td>9.9g</td></tr>
            <tr><td><strong>Chicken Shawarma</strong></td><td>1 wrap</td><td>450 kcal</td><td>30g</td><td>40g</td><td>20g</td></tr>
            <tr><td><strong>Lamb Kabab</strong></td><td>2 skewers</td><td>280 kcal</td><td>22g</td><td>2g</td><td>20g</td></tr>
            <tr><td><strong>Samosa</strong></td><td>1 piece</td><td>120 kcal</td><td>3g</td><td>12g</td><td>7g</td></tr>
            <tr><td><strong>Hummus</strong></td><td>100g</td><td>166 kcal</td><td>8g</td><td>14g</td><td>10g</td></tr>
            <tr><td><strong>Fattoush Salad</strong></td><td>1 bowl</td><td>180 kcal</td><td>3g</td><td>18g</td><td>10g</td></tr>
            <tr><td><strong>Jareesh</strong></td><td>200g</td><td>250 kcal</td><td>8g</td><td>35g</td><td>9g</td></tr>
            <tr><td><strong>Dates (Medjool × 2)</strong></td><td>50g</td><td>110 kcal</td><td>1g</td><td>26g</td><td>0g</td></tr>
            <tr><td><strong>Arabic Coffee</strong></td><td>1 cup</td><td>2 kcal</td><td>0g</td><td>0g</td><td>0g</td></tr>
        </tbody>
    </table>

    <h2 id="macros">Macronutrient Ratios — Protein, Carbs & Fat</h2>
    <p>While total calories determine weight change, the <strong>macronutrient ratio</strong> affects body composition, satiety, and energy levels:</p>
    <table>
        <thead><tr><th>Goal</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr></thead>
        <tbody>
            <tr><td><strong>Weight Loss (balanced)</strong></td><td>30%</td><td>40%</td><td>30%</td></tr>
            <tr><td>Weight Loss (high protein)</td><td>35%</td><td>35%</td><td>30%</td></tr>
            <tr><td>Muscle Gain</td><td>30%</td><td>50%</td><td>20%</td></tr>
            <tr><td>Maintenance</td><td>25%</td><td>50%</td><td>25%</td></tr>
        </tbody>
    </table>
    <p><strong>Protein tip:</strong> During a calorie deficit, aim for <strong>1.6–2.4g of protein per kg body weight</strong> daily to preserve lean muscle mass. For an 80 kg person, that's 128–192g of protein per day.</p>

    <h2 id="sfda-regulations">SFDA Dietary Guidelines — Saudi Healthy Plate 2024</h2>
    <p>The <strong>Saudi Food and Drug Authority (هيئة الغذاء والدواء)</strong> released the <strong>Saudi Healthy Plate 2024 (SHP-2024)</strong> with these key nutritional targets:</p>
    <table>
        <thead><tr><th>Nutrient</th><th>Recommended</th></tr></thead>
        <tbody>
            <tr><td>Carbohydrates</td><td>≥ 50% of total calories</td></tr>
            <tr><td>Protein</td><td>≤ 10% of total calories</td></tr>
            <tr><td>Total Fat</td><td>≤ 30% of total calories</td></tr>
            <tr><td>Dietary Fiber</td><td>≥ 28g per day</td></tr>
            <tr><td>Max Caffeine (adults)</td><td>400mg per day</td></tr>
            <tr><td>Max Salt per meal</td><td>5g (2,000mg sodium)</td></tr>
        </tbody>
    </table>

    <h2 id="ramadan">Ramadan Nutrition — Managing Calories While Fasting</h2>
    <p>During Ramadan, the eating window is compressed to two main meals — <strong>Iftar</strong> (breaking fast at sunset) and <strong>Suhoor</strong> (pre-dawn meal). Here's how to manage your calorie intake:</p>
    <h3>Iftar Tips</h3>
    <ul>
        <li><strong>Break fast</strong> with 2-3 dates + water or laban (~170 kcal)</li>
        <li>Wait 15-20 minutes, then eat a <strong>balanced meal</strong></li>
        <li>Prioritize <strong>protein + vegetables</strong> before rice</li>
        <li>Avoid deep-fried starters (samosas, spring rolls)</li>
        <li>Skip sugary drinks — water, laban, or sugar-free alternatives</li>
    </ul>
    <h3>Suhoor Tips</h3>
    <ul>
        <li>Eat <strong>slow-digesting foods</strong> — oats, eggs, yogurt, whole wheat bread</li>
        <li>Include <strong>protein</strong> to sustain energy through the fast</li>
        <li>Drink 2-3 glasses of water</li>
        <li>Avoid salty foods that increase thirst during fasting</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Ramadan Calorie Target:</strong> Your daily calorie goal remains the <strong>same</strong> as calculated above — it's just distributed across fewer meals. Many people <em>gain</em> weight during Ramadan because Iftar portions are too large and rich.
    </div>
`;
