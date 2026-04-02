import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import BMICalculatorIndiaCore from "@/components/calculator/BMICalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "BMI Calculator India 2026 — Asian-Indian BMI, Ideal Weight & Waist-to-Height Ratio",
    description: "Free BMI calculator for India with Asian-Indian cutoffs (Overweight ≥23, Obese ≥25). Calculate BMI, ideal weight range, and waist-to-height ratio. Includes WHO vs Indian BMI comparison, thin-fat phenotype guide, ICMR guidelines, and health risk assessment.",
    keywords: ["BMI calculator India", "BMI calculator", "Indian BMI chart", "Asian BMI cutoff", "ideal weight India", "waist to height ratio", "Body Mass Index India", "overweight BMI 23", "obesity India", "ICMR dietary guidelines"],
    alternates: buildCountryAlternates("IN", "/in/bmi-calculator", "bmi-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is a healthy BMI for Indians?", answer: "For Indians and South Asians, a healthy (normal) BMI ranges from 18.5 to 22.9 kg/m². This is different from the WHO international standard of 18.5–24.9. The lower threshold was recommended by the Consensus Statement on Obesity in India because Asian Indians face higher metabolic risks (diabetes, cardiovascular disease) at lower BMI levels due to higher visceral fat and the thin-fat phenotype." },
    { question: "Why are BMI cutoffs different for Indians?", answer: "Asian Indians have a unique body composition called the 'thin-fat phenotype' — they tend to have more visceral (internal belly) fat and less muscle mass at the same BMI compared to Caucasians. Research shows that cardiovascular disease and Type 2 diabetes onset occurs at BMI 21–23 in Indians vs 25–30 in Western populations. Therefore, the consensus guidelines use Overweight ≥23 and Obese ≥25 for India, compared to WHO's ≥25 and ≥30." },
    { question: "What is the BMI formula?", answer: "BMI = Weight (kg) ÷ Height (m)². For example, a person weighing 70 kg with height 170 cm (1.70 m): BMI = 70 ÷ (1.70 × 1.70) = 70 ÷ 2.89 = 24.2 kg/m². In imperial units: BMI = Weight (lb) ÷ Height (inches)² × 703. BMI is a screening tool, not a diagnostic test — it doesn't directly measure body fat percentage." },
    { question: "Is BMI 24 normal or overweight for an Indian?", answer: "A BMI of 24 is classified as 'Normal' by WHO international standards (18.5–24.9) but 'Overweight' by Asian-Indian standards (≥23). For Indians, this is clinically significant — at BMI 24, insulin resistance and dyslipidemia risk are already elevated. You should consult a doctor and consider waist circumference measurement for a complete assessment." },
    { question: "What is the ideal weight for 5'7\" height in India?", answer: "For someone 5'7\" (170 cm) tall: Indian healthy range (BMI 18.5–22.9) = 53.5 to 66.2 kg. WHO range (BMI 18.5–24.9) = 53.5 to 71.9 kg. The Indian range is more conservative because metabolic risks increase at lower weights for South Asians. Aim for the 55–65 kg range if you're of average build." },
    { question: "What is waist-to-height ratio and why is it important?", answer: "Waist-to-Height Ratio (WHtR) = Waist circumference ÷ Height. A ratio below 0.50 is considered healthy for all ages and genders. WHtR is a better predictor of cardiovascular risk than BMI alone because it measures central (abdominal) fat distribution. For Indians, this is especially important due to the thin-fat phenotype — many Indians have normal BMI but dangerously high belly fat." },
    { question: "What is the normal waist circumference for Indian men and women?", answer: "For Indian adults, abdominal obesity thresholds are: Men — waist circumference ≥90 cm (vs WHO global ≥102 cm). Women — waist circumference ≥80 cm (vs WHO global ≥88 cm). These lower thresholds reflect the higher metabolic risk Indians face from central obesity. Measure at the navel level while standing, after exhaling normally." },
    { question: "What is the thin-fat phenotype?", answer: "The 'thin-fat phenotype' (also called the 'Asian Indian phenotype') describes the tendency of South Asians to have higher body fat percentage, more visceral (internal organ) fat, and lower muscle mass at any given BMI, compared to Caucasians. This means an Indian with BMI 23 may have the same metabolic risk as a European with BMI 27–28. It's genetically driven and explains why lower BMI cutoffs are needed for the Indian population." },
    { question: "Is BMI accurate for muscular people?", answer: "No. BMI is a weight-to-height ratio and cannot distinguish between muscle mass and fat mass. Muscular athletes, bodybuilders, and people who strength train may have a 'high' BMI (25–30) despite having low body fat. In such cases, waist circumference, body fat percentage (via DEXA scan or skinfold caliper), and waist-to-height ratio are better indicators of health." },
    { question: "What is the BMI for children in India?", answer: "BMI for children and teens (ages 2–20) is not interpreted using adult cutoffs. Instead, it's plotted on age- and gender-specific growth charts. The Indian Academy of Pediatrics (IAP) provides India-specific percentile charts. Overweight: BMI ≥23rd adult equivalent (approximately 85th percentile). Obese: BMI ≥27 adult equivalent (approximately 95th percentile). If your child's BMI is above the 85th percentile for their age, consult a pediatrician." },
    { question: "What health risks are associated with high BMI in India?", answer: "For Indians, elevated BMI (≥23) is linked to: Type 2 Diabetes (India has 101M+ diabetics, the highest globally), Cardiovascular disease (heart attack, stroke), Hypertension, Dyslipidemia (high triglycerides, low HDL), Non-Alcoholic Fatty Liver Disease (NAFLD), Polycystic Ovary Syndrome (PCOS) in women, Sleep apnea, Joint problems (osteoarthritis), and certain cancers. These risks start at lower BMI in Indians compared to Western populations." },
    { question: "What is the obesity rate in India?", answer: "According to NFHS-5 (2019–21), 24% of Indian women and 22.9% of Indian men are overweight or obese (BMI ≥25 by WHO standards). Using the more appropriate Asian-Indian cutoff of ≥23, the prevalence is significantly higher — estimated at 35–40% of the urban adult population. India ranks second globally in the number of obese children. Obesity prevalence is highest in urban areas, southern states (Kerala, Tamil Nadu, AP), and Delhi." },
    { question: "Does BMI apply to pregnant women?", answer: "BMI calculated during pregnancy is not a reliable indicator of health status because weight gain is expected and necessary. Pre-pregnancy BMI is used to classify pregnancy risk: Underweight (<18.5): higher risk of preterm birth. Normal (18.5–22.9): recommended weight gain 11.5–16 kg. Overweight (23–24.9): recommended gain 7–11.5 kg. Obese (≥25): recommended gain 5–9 kg. These ranges use Indian cutoffs. Always follow your obstetrician's guidance." },
    { question: "How can I reduce my BMI?", answer: "Evidence-based strategies for BMI reduction in the Indian context: (1) Follow ICMR 'My Plate' guidelines — half your plate should be vegetables/fruits, one-quarter cereals/millets, one-quarter protein (dal, paneer, chicken). (2) Reduce ultra-processed foods (packaged snacks, sugary drinks). (3) 150+ minutes of moderate exercise weekly (brisk walking, cycling, yoga). (4) Reduce refined carbs (maida, white rice portions). (5) Get 7–8 hours sleep. (6) Manage stress. Target a 5–10% weight loss over 6 months for clinically meaningful improvement." },
    { question: "Is BMI of 27 obese for an Indian?", answer: "Yes. By Asian-Indian standards, BMI 27 falls in the 'Obese Class I' category (25–29.9). By WHO standards, it would be classified as merely 'Overweight'. At BMI 27, an Indian has a significantly elevated risk of Type 2 diabetes, hypertension, and dyslipidemia. Immediate lifestyle modifications (diet + exercise) are recommended, and a doctor visit is advisable for metabolic screening (fasting glucose, HbA1c, lipid profile)." },
];

export default function BMICalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "BMI Calculator" },
        ]),
        webAppSchema("BMI Calculator India 2026", canonicalUrl("/in/bmi-calculator")),
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
            <Script id="schema-bmi" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "BMI Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>BMI Calculator India 2026</h1>
            <PageDesc>
                Calculate your Body Mass Index with <strong>Asian-Indian cutoffs</strong> (Overweight ≥23, Obese ≥25) — clinically recommended for South Asians. Compare WHO vs Indian BMI categories, find your ideal weight, and check your waist-to-height ratio for abdominal obesity risk.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <BMICalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="BMI Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-bmi">What Is BMI (Body Mass Index)?</h2>
    <p><strong>Body Mass Index (BMI)</strong> is a numerical value calculated from a person's <strong>weight and height</strong>. Developed by Belgian mathematician <strong>Adolphe Quetelet</strong> in the 1830s, it's used worldwide as a screening tool to categorize individuals as underweight, normal weight, overweight, or obese.</p>
    <p>While BMI doesn't directly measure body fat, it correlates with more direct measures of body fat and is the most practical tool for population-level health screening.</p>

    <h2 id="bmi-formula">BMI Formula</h2>
    <div class="explanation__highlight">
        <strong>BMI = Weight (kg) ÷ Height (m)²</strong>
    </div>
    <p><strong>Example:</strong> Weight = 70 kg, Height = 170 cm (1.70 m)</p>
    <p>BMI = 70 ÷ (1.70 × 1.70) = 70 ÷ 2.89 = <strong>24.2 kg/m²</strong></p>
    <p>This BMI of 24.2 is <strong>"Normal" by WHO standards</strong> but <strong>"Overweight" by Indian standards</strong> — a critical distinction explained below.</p>

    <h2 id="who-vs-indian-bmi">WHO vs Asian-Indian BMI Categories — The Critical Difference</h2>
    <p>This is the <strong>most important section</strong> on this page. Most BMI calculators (including competitors) use only WHO categories — which are <strong>not appropriate for the Indian population</strong>.</p>
    <table>
        <thead><tr><th>Category</th><th>WHO (Global)</th><th>Asian-Indian</th><th>Difference</th></tr></thead>
        <tbody>
            <tr><td><strong>Underweight</strong></td><td>&lt; 18.5</td><td>&lt; 18.5</td><td>Same</td></tr>
            <tr><td><strong>Normal</strong></td><td>18.5 – 24.9</td><td><strong>18.5 – 22.9</strong></td><td>⚠️ 2 points lower</td></tr>
            <tr><td><strong>Overweight</strong></td><td>25.0 – 29.9</td><td><strong>23.0 – 24.9</strong></td><td>⚠️ Starts at 23, not 25</td></tr>
            <tr><td><strong>Obese Class I</strong></td><td>30.0 – 34.9</td><td><strong>25.0 – 29.9</strong></td><td>⚠️ 5 points lower</td></tr>
            <tr><td><strong>Obese Class II</strong></td><td>35.0 – 39.9</td><td><strong>30.0 – 34.9</strong></td><td>⚠️ 5 points lower</td></tr>
            <tr><td><strong>Obese Class III</strong></td><td>≥ 40</td><td><strong>≥ 35</strong></td><td>⚠️ 5 points lower</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> A BMI of 24 is "Normal" by WHO standards but "Overweight" by Indian standards. This matters because Indians develop diabetes and heart disease at BMI 23–25, while Europeans develop them at 27–30. Using the wrong cutoff can delay diagnosis by years.
    </div>

    <h2 id="why-lower-cutoffs">Why Indians Need Lower BMI Cutoffs</h2>
    <p>The scientific basis for lower Indian BMI thresholds:</p>
    <ul>
        <li><strong>Thin-Fat Phenotype:</strong> Indians have <strong>more visceral (internal belly) fat</strong> and less muscle mass at the same BMI compared to Caucasians. An Indian at BMI 24 may have the same body fat percentage as a European at BMI 28.</li>
        <li><strong>Higher Body Fat:</strong> At BMI 25, an average Indian has 25–30% body fat vs 20–25% for a European of the same BMI.</li>
        <li><strong>Earlier Disease Onset:</strong> Type 2 diabetes and cardiovascular disease hit Indians <strong>a decade earlier</strong> than Western populations — often in the 30s and 40s rather than 50s and 60s.</li>
        <li><strong>Insulin Resistance:</strong> Even at normal BMI (20–22), many Indians show signs of insulin resistance due to genetic predisposition and dietary patterns (high refined carbohydrate intake).</li>
        <li><strong>NFHS-5 Data:</strong> Using the Indian cutoff (≥23), approximately <strong>35–40% of urban Indians</strong> are overweight — nearly double the 22–24% using the WHO cutoff (≥25).</li>
    </ul>

    <h2 id="health-risks">Health Risks by BMI Range — India-Specific</h2>
    <table>
        <thead><tr><th>BMI (Indian)</th><th>Risk Level</th><th>Associated Conditions</th></tr></thead>
        <tbody>
            <tr><td><strong>&lt; 18.5</strong></td><td>Moderate</td><td>Malnutrition, anemia, weak immunity, osteoporosis, fertility issues</td></tr>
            <tr><td><strong>18.5 – 22.9</strong></td><td>Low</td><td>Healthy range — lowest risk of metabolic diseases</td></tr>
            <tr><td><strong>23.0 – 24.9</strong></td><td><strong>Increased</strong></td><td>Pre-diabetes, early insulin resistance, mild dyslipidemia, borderline BP</td></tr>
            <tr><td><strong>25.0 – 29.9</strong></td><td><strong>High</strong></td><td>Type 2 diabetes, hypertension, high cholesterol, NAFLD, PCOS</td></tr>
            <tr><td><strong>≥ 30</strong></td><td><strong>Very High</strong></td><td>Cardiovascular disease, stroke, sleep apnea, kidney disease, certain cancers</td></tr>
        </tbody>
    </table>

    <h2 id="ideal-weight-chart">Ideal Weight Chart for Indians</h2>
    <p>Based on the Indian BMI range of <strong>18.5 – 22.9</strong> for healthy weight:</p>
    <table>
        <thead><tr><th>Height</th><th>cm</th><th>Min Weight (BMI 18.5)</th><th>Max Weight (BMI 22.9)</th></tr></thead>
        <tbody>
            <tr><td><strong>5'0"</strong></td><td>152</td><td>42.8 kg</td><td>52.9 kg</td></tr>
            <tr><td><strong>5'2"</strong></td><td>157</td><td>45.6 kg</td><td>56.5 kg</td></tr>
            <tr><td><strong>5'4"</strong></td><td>163</td><td>49.2 kg</td><td>60.9 kg</td></tr>
            <tr><td><strong>5'5"</strong></td><td>165</td><td>50.4 kg</td><td>62.3 kg</td></tr>
            <tr><td><strong>5'6"</strong></td><td>168</td><td>52.2 kg</td><td>64.7 kg</td></tr>
            <tr><td><strong>5'7"</strong></td><td>170</td><td>53.5 kg</td><td>66.2 kg</td></tr>
            <tr><td><strong>5'8"</strong></td><td>173</td><td>55.4 kg</td><td>68.6 kg</td></tr>
            <tr><td><strong>5'9"</strong></td><td>175</td><td>56.7 kg</td><td>70.1 kg</td></tr>
            <tr><td><strong>5'10"</strong></td><td>178</td><td>58.6 kg</td><td>72.6 kg</td></tr>
            <tr><td><strong>5'11"</strong></td><td>180</td><td>59.9 kg</td><td>74.2 kg</td></tr>
            <tr><td><strong>6'0"</strong></td><td>183</td><td>62.0 kg</td><td>76.7 kg</td></tr>
            <tr><td><strong>6'2"</strong></td><td>188</td><td>65.4 kg</td><td>80.9 kg</td></tr>
        </tbody>
    </table>

    <h2 id="waist-circumference">Waist Circumference & Abdominal Obesity — India Thresholds</h2>
    <p>BMI alone doesn't tell you <strong>where</strong> fat is stored. Abdominal (belly) fat is far more dangerous than subcutaneous (under-skin) fat:</p>
    <table>
        <thead><tr><th>Gender</th><th>Normal</th><th>At Risk</th><th>Abdominal Obesity</th></tr></thead>
        <tbody>
            <tr><td><strong>Men</strong></td><td>&lt; 78 cm</td><td>78 – 89 cm</td><td><strong>≥ 90 cm</strong></td></tr>
            <tr><td><strong>Women</strong></td><td>&lt; 72 cm</td><td>72 – 79 cm</td><td><strong>≥ 80 cm</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Indian vs WHO Thresholds:</strong> WHO defines abdominal obesity as waist ≥102 cm (men) and ≥88 cm (women). India uses <strong>significantly lower cutoffs</strong> — ≥90 cm for men and ≥80 cm for women — because Indians develop metabolic complications at lower waist measurements.
    </div>
    <p><strong>How to measure:</strong> Stand upright, exhale normally, measure at the level of your navel (belly button) using a non-stretchy tape. Don't hold your stomach in.</p>

    <h2 id="bmi-limitations">BMI Limitations — What BMI Cannot Tell You</h2>
    <ul>
        <li><strong>Muscle vs fat:</strong> Athletes and bodybuilders may have "obese" BMI but low body fat</li>
        <li><strong>Body fat distribution:</strong> BMI doesn't show where fat is stored (waist circumference is better)</li>
        <li><strong>Age:</strong> Body composition changes with age — elderly may have low BMI but high body fat</li>
        <li><strong>Pregnancy:</strong> BMI is not applicable during pregnancy</li>
        <li><strong>Children:</strong> Adult BMI categories don't apply — use age/gender-specific percentile charts</li>
        <li><strong>Ethnicity:</strong> Body fat percentage varies by ethnicity at the same BMI (exactly why Indian cutoffs differ)</li>
    </ul>

    <h2 id="india-obesity-statistics">India Obesity Statistics — NFHS-5 Data</h2>
    <table>
        <thead><tr><th>Metric</th><th>Women</th><th>Men</th></tr></thead>
        <tbody>
            <tr><td><strong>Overweight/Obese (WHO ≥25)</strong></td><td>24.0%</td><td>22.9%</td></tr>
            <tr><td><strong>Estimated at Indian cutoff (≥23)</strong></td><td>~37%</td><td>~35%</td></tr>
            <tr><td><strong>Abdominal obesity (waist)</strong></td><td>~40% urban</td><td>~30% urban</td></tr>
            <tr><td><strong>Diabetics (total)</strong></td><td colspan="2">101 million+ (IDF 2024)</td></tr>
            <tr><td><strong>Pre-diabetics</strong></td><td colspan="2">136 million+ (estimated)</td></tr>
        </tbody>
    </table>
    <p>Highest obesity prevalence by state: <strong>Kerala</strong> (women: 38%), <strong>Tamil Nadu</strong> (36%), <strong>Andhra Pradesh</strong> (34%), <strong>Delhi</strong> (33%), <strong>Punjab</strong> (32%).</p>

    <h2 id="icmr-guidelines">ICMR Dietary Guidelines 2024 — "My Plate" Recommendations</h2>
    <p>The <strong>ICMR-NIN (Indian Council of Medical Research — National Institute of Nutrition)</strong> released updated dietary guidelines in 2024:</p>
    <ul>
        <li><strong>Half your plate:</strong> Vegetables, fruits, green leafy vegetables, roots & tubers</li>
        <li><strong>One quarter:</strong> Cereals and millets (ragi, jowar, bajra preferred over maida/white rice)</li>
        <li><strong>One quarter:</strong> Protein sources — dal, paneer, eggs, chicken, fish, nuts</li>
        <li><strong>Daily:</strong> Milk/curd (200–300 ml), cooking oil (25–30g), nuts & seeds</li>
        <li><strong>Avoid:</strong> Ultra-processed foods (packaged snacks, instant noodles, sugary drinks)</li>
        <li><strong>Exercise:</strong> Minimum 150 minutes of moderate activity per week</li>
    </ul>

    <h2 id="children-bmi">BMI for Children & Teens — India Guidelines</h2>
    <p>Adult BMI categories <strong>do not apply</strong> to children and adolescents (ages 2–20). For children:</p>
    <ul>
        <li>BMI is plotted on <strong>age- and gender-specific growth charts</strong></li>
        <li>The <strong>Indian Academy of Pediatrics (IAP)</strong> provides India-specific percentile charts</li>
        <li><strong>Overweight:</strong> BMI ≥ 85th percentile for age/gender</li>
        <li><strong>Obese:</strong> BMI ≥ 95th percentile for age/gender</li>
        <li>India ranks <strong>second globally</strong> in childhood obesity (World Obesity Atlas 2026)</li>
    </ul>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/age-calculator">Age Calculator</a></strong> — Track milestones and retirement age. Health risks increase with age and BMI combined.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Plan long-term savings for health emergencies and retirement.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Financial planning tools for India.</li>
        <li><strong><a href="/in/fuel-cost-calculator">Fuel Cost Calculator</a></strong> — Calculate travel costs for daily commutes.</li>
    </ul>
`;
