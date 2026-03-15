// Dynamic Hub — /health-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import HealthCalculatorCore from "@/components/calculator/HealthCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("health").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("health").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/health-calculators/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; explanation?: { heading: string; paragraphs: string[]; highlight: string }; faq?: { question: string; answer: string }[] }> = {
    "bmi-calculator": {
        subtitle: "Calculate your Body Mass Index from height and weight. See your BMI category and the healthy weight range for your height.",
        explanation: { heading: "How BMI Is Calculated", paragraphs: ["BMI = weight (kg) / height (m)². A BMI of 18.5–24.9 is considered normal weight. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese.", "BMI is a quick screening tool, not a diagnostic measure. It doesn't distinguish between muscle and fat — a muscular athlete may have a high BMI but low body fat. For a more complete picture, combine BMI with body fat percentage and waist-to-hip ratio."], highlight: "A 70 kg person at 170 cm has a BMI of 24.2 (normal weight). Their healthy weight range is 53.5–72.0 kg." },
        faq: [{ question: "What is a healthy BMI?", answer: "18.5–24.9 is the normal range. Below 18.5 is underweight (may indicate nutritional deficiency), 25–29.9 is overweight, and 30+ is obese. These ranges apply to adults over 18." }, { question: "Is BMI accurate for athletes?", answer: "Not always. BMI doesn't distinguish muscle from fat. A muscular person may be classified as overweight despite having low body fat. Use body fat percentage for a more accurate assessment." }],
    },
    "calorie-calculator": {
        subtitle: "Calculate how many calories you need per day to maintain, lose, or gain weight based on your age, sex, height, weight, and activity level.",
        explanation: { heading: "How Daily Calories Are Calculated", paragraphs: ["This calculator uses the Mifflin-St Jeor equation for BMR (the most accurate for most people), then multiplies by an activity factor to get total daily energy expenditure (TDEE). Weight loss target = TDEE − 500 kcal (≈0.5 kg/week loss). Weight gain = TDEE + 500 kcal.", "Activity levels range from sedentary (desk job, no exercise) to very active (athlete or physically demanding job + daily training). Be honest about your activity level — overestimating is the most common mistake."], highlight: "A 30-year-old male, 70 kg, 170 cm, moderate activity: BMR ≈ 1,596 kcal, TDEE ≈ 2,474 kcal. To lose weight: eat ~1,974 kcal/day." },
        faq: [{ question: "How many calories should I eat to lose weight?", answer: "Subtract 500 kcal from your maintenance (TDEE) for steady weight loss of about 0.5 kg/week. Never go below 1,200 (women) or 1,500 (men) without medical supervision." }, { question: "Which equation is more accurate?", answer: "Mifflin-St Jeor is considered the most accurate for most adults and is used by our calculator by default. Harris-Benedict tends to overestimate slightly." }],
    },
    "tdee-calculator": {
        subtitle: "Calculate your Total Daily Energy Expenditure — the total calories you burn per day including exercise. See all activity levels at once.",
        explanation: { heading: "Understanding TDEE", paragraphs: ["TDEE = BMR × Activity Multiplier. Your BMR (Basal Metabolic Rate) is the energy your body needs at complete rest. The activity multiplier accounts for movement and exercise throughout the day.", "The five activity levels: Sedentary (×1.2), Light exercise 1-3 days/wk (×1.375), Moderate 3-5 days/wk (×1.55), Active 6-7 days/wk (×1.725), Very Active athlete (×1.9). This calculator shows all levels so you can compare."], highlight: "BMR of 1,596 kcal: Sedentary = 1,915, Light = 2,195, Moderate = 2,474, Active = 2,753, Very Active = 3,032 kcal/day." },
        faq: [{ question: "What's the difference between TDEE and BMR?", answer: "BMR is calories at complete rest (lying still all day). TDEE adds your daily activity and exercise. TDEE is always higher than BMR." }, { question: "Should I eat at my TDEE to maintain weight?", answer: "Yes. Eating at TDEE maintains your current weight. Eat 300-500 below for weight loss, 300-500 above for weight gain." }],
    },
    "bmr-calculator": {
        subtitle: "Calculate your Basal Metabolic Rate — the calories your body burns at rest — using two established scientific equations.",
        explanation: { heading: "BMR Equations Explained", paragraphs: ["Mifflin-St Jeor (1990): Men: 10×weight + 6.25×height − 5×age + 5. Women: 10×weight + 6.25×height − 5×age − 161. This is the most accurate equation for most adults.", "Harris-Benedict (revised 1984) gives slightly different results. Both are widely used. If results differ significantly, the Mifflin-St Jeor value is generally preferred."], highlight: "30-year-old male, 70 kg, 170 cm: Mifflin-St Jeor BMR = 1,596 kcal/day. Harris-Benedict = 1,668 kcal/day." },
        faq: [{ question: "Why do I need to know my BMR?", answer: "BMR is the foundation for calculating your daily calorie needs. It tells you the minimum calories your body needs to function. Never eat below your BMR for extended periods." }, { question: "Does BMR change with age?", answer: "Yes, BMR decreases with age — roughly 1-2% per decade after 20. This is why calorie needs decrease as you age. Strength training helps maintain muscle mass and keeps BMR higher." }],
    },
    "body-fat-calculator": {
        subtitle: "Estimate your body fat percentage using the Navy method. Just enter your height and a few body measurements.",
        explanation: { heading: "The Navy Body Fat Method", paragraphs: ["The U.S. Navy method estimates body fat from circumference measurements. For men: neck and waist. For women: neck, waist, and hip. The formula uses logarithmic calculations validated against hydrostatic weighing.", "Body fat categories for men: Essential <6%, Athletic 6-14%, Fit 14-18%, Average 18-25%, Obese >25%. For women: Essential <14%, Athletic 14-21%, Fit 21-25%, Average 25-32%, Obese >32%."], highlight: "Male, 170 cm, waist 85 cm, neck 38 cm: estimated body fat ≈ 18.5% (Average/Fit boundary)." },
        faq: [{ question: "How accurate is the Navy method?", answer: "Within 3-4% of DEXA scan results for most people. It's one of the most practical methods — no equipment needed, just a tape measure." }, { question: "What body fat percentage is ideal?", answer: "For health: men 10-20%, women 18-28%. For visible abs: men typically need <15%, women <22%. Essential fat minimums: men 3-5%, women 10-13%." }],
    },
    "ideal-weight-calculator": {
        subtitle: "Calculate your ideal body weight using four established scientific formulas. See the healthy weight range for your height and sex.",
        explanation: { heading: "Ideal Weight Formulas", paragraphs: ["Four formulas are used: Devine (1974), Robinson (1983), Miller (1983), and BMI-based healthy range (18.5-24.9). Each uses height and sex to estimate ideal weight. Results vary because each formula was developed from different population data.", "The BMI-based range (18.5-24.9) is the most widely used by healthcare professionals. Individual ideal weight depends on body composition, frame size, and muscle mass."], highlight: "Male, 170 cm: Devine = 66.5 kg, Robinson = 63.5 kg, Miller = 67.6 kg, BMI range = 53.5-72.0 kg." },
        faq: [{ question: "Which ideal weight formula is best?", answer: "The BMI-based range gives the widest and most inclusive answer. For a single target, Devine is the most commonly used in clinical settings. All are estimates — body composition matters more than the exact number." }, { question: "Should I aim for my ideal weight?", answer: "Use it as a guideline, not an absolute target. A healthy weight is one where your blood pressure, blood sugar, and cholesterol are normal, you can be physically active, and you feel good." }],
    },
    "macro-calculator": {
        subtitle: "Calculate your daily macronutrient targets — protein, carbs, and fat in grams — based on your TDEE and fitness goal.",
        explanation: { heading: "How Macros Are Calculated", paragraphs: ["This calculator first computes your TDEE, then distributes calories across macronutrients. Protein is set at 2g per kg body weight (optimal for muscle maintenance/building), fat at 25% of calories, and remaining calories go to carbs.", "Adjust for your goal: weight loss reduces total calories by 500 (preserving protein), weight gain adds 500 (increasing carbs for energy). Protein stays high regardless of goal to protect lean mass."], highlight: "70 kg male, moderate activity, maintain: TDEE ≈ 2,474 kcal. Macros: Protein 140g (560 kcal), Fat 69g (619 kcal), Carbs 324g (1,295 kcal)." },
        faq: [{ question: "How much protein do I really need?", answer: "Research supports 1.6-2.2g per kg for active people and those trying to lose weight while preserving muscle. Our calculator uses 2g/kg as a solid middle ground." }, { question: "Are macros more important than total calories?", answer: "Total calories determine weight change. Macros determine body composition — same calories but different macros lead to different results in muscle vs fat." }],
    },
    "water-intake-calculator": {
        subtitle: "Calculate your recommended daily water intake based on body weight, activity level, and climate. Stay properly hydrated.",
        explanation: { heading: "How Water Needs Are Calculated", paragraphs: ["Base recommendation: 33ml per kg body weight. This increases with physical activity (+15-20% for active people) and hot/humid climates (+15%). Cold climates slightly reduce needs.", "Signs of adequate hydration: pale yellow urine, no persistent thirst. You also get water from food (fruits, vegetables, soups) — about 20% of daily intake comes from food."], highlight: "70 kg, moderate activity, temperate climate: base = 2.3L/day ≈ 9 glasses (250ml). Active in hot weather: 2.7L/day ≈ 11 glasses." },
        faq: [{ question: "Is the 8 glasses a day rule correct?", answer: "It's a reasonable approximation for an average-sized adult. But actual needs vary by body weight, activity, and climate. Our calculator gives a personalised recommendation." }, { question: "Can you drink too much water?", answer: "Yes — hyponatremia (water intoxication) can occur from extreme overhydration. This is rare and mainly a risk during endurance events. Normal daily consumption following thirst cues is safe." }],
    },
    "pregnancy-due-date-calculator": {
        subtitle: "Calculate your estimated due date based on the first day of your last menstrual period. See trimester milestones and current week.",
        explanation: { heading: "How Due Date Is Calculated", paragraphs: ["The Naegele's rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). This assumes a 28-day cycle with ovulation on day 14.", "Only about 5% of babies are born on their exact due date. The normal range is 37-42 weeks. Your healthcare provider may adjust the date based on ultrasound measurements."], highlight: "LMP of January 1: estimated due date = October 8. At 8 weeks: currently in the 1st trimester." },
        faq: [{ question: "How accurate is the due date?", answer: "It's an estimate. Only 5% of babies arrive on the exact due date. 80% are born within 2 weeks of the estimated date (38-42 weeks). Early ultrasound dating is more accurate than LMP-based calculation." }, { question: "What are the trimester milestones?", answer: "1st trimester (weeks 1-12): organ formation. 2nd trimester (weeks 13-26): growth and movement felt. 3rd trimester (weeks 27-40): rapid growth, preparing for birth." }],
    },
    "ovulation-calculator": {
        subtitle: "Estimate your ovulation date and fertile window based on your menstrual cycle. Plan for conception or understand your fertility.",
        explanation: { heading: "How Ovulation Is Estimated", paragraphs: ["Ovulation typically occurs 14 days before the next period. For a 28-day cycle, that's day 14. For a 32-day cycle, it's day 18. The fertile window spans 5 days before ovulation through 1 day after (sperm survive up to 5 days, egg survives 12-24 hours).", "This method works best with regular cycles. Irregular cycles, stress, illness, and hormonal changes can shift ovulation. For more precision, combine with basal body temperature tracking or ovulation test kits."], highlight: "28-day cycle starting June 1: ovulation ≈ June 15. Fertile window: June 10-16. Next period: June 29." },
        faq: [{ question: "When is the best time to conceive?", answer: "The 2-3 days leading up to ovulation have the highest conception rates. Having intercourse every 1-2 days during the fertile window maximises chances." }, { question: "Can I use this to avoid pregnancy?", answer: "Calendar-based methods alone are not reliable contraception (75-88% effective). Ovulation can shift unpredictably. Always consult a healthcare provider for family planning." }],
    },
    "heart-rate-zone-calculator": {
        subtitle: "Calculate your heart rate training zones using the Karvonen method. See fat burn, cardio, threshold, and peak zones for your age.",
        explanation: { heading: "Understanding Heart Rate Zones", paragraphs: ["The Karvonen method uses Heart Rate Reserve (HRR = Max HR − Resting HR). Zone HR = HRR × % + Resting HR. This is more accurate than simple percentage-of-max methods because it accounts for your fitness level.", "Zone 1 (50-60%): warm-up/recovery. Zone 2 (60-70%): fat burning, endurance base. Zone 3 (70-80%): aerobic/cardio fitness. Zone 4 (80-90%): lactate threshold. Zone 5 (90-100%): max effort, sprints."], highlight: "Age 30 (max HR 190), resting HR 65: Zone 2 (fat burn) = 140-153 bpm. Zone 4 (threshold) = 165-178 bpm." },
        faq: [{ question: "Which zone burns the most fat?", answer: "Zone 2 uses the highest percentage of fat for fuel, but Zone 3-4 burns more total calories (and total fat) per minute. For weight loss, higher-intensity work is more time-efficient. For endurance building, Zone 2 is king." }, { question: "How do I find my resting heart rate?", answer: "Measure first thing in the morning before getting out of bed. Count your pulse for 60 seconds (or 30 seconds × 2). Average of 3 mornings gives the best result. Normal range: 60-100 bpm; athletes may be 40-60." }],
    },
    "bsa-calculator": {
        subtitle: "Calculate your Body Surface Area using three established medical formulas. BSA is used in drug dosing and clinical assessments.",
        explanation: { heading: "Body Surface Area Formulas", paragraphs: ["Du Bois (1916): 0.007184 × W^0.425 × H^0.725. Mosteller (1987): √(W×H/3600). Haycock (1978): 0.024265 × W^0.5378 × H^0.3964. All give results in m².", "BSA is primarily used in medicine for calculating chemotherapy doses, burn area assessment, cardiac index, and renal function. Average adult BSA: 1.7-2.0 m²."], highlight: "70 kg, 170 cm: Du Bois BSA = 1.81 m², Mosteller = 1.81 m², Haycock = 1.82 m²." },
        faq: [{ question: "Why is BSA used instead of weight for drug dosing?", answer: "BSA better correlates with metabolic rate and organ size than weight alone. This is especially important for drugs with narrow therapeutic windows like chemotherapy agents." }, { question: "What is a normal BSA?", answer: "Average adult: 1.7-2.0 m². Men average ~1.9 m², women ~1.6 m². BSA varies with both height and weight." }],
    },
    "lean-body-mass-calculator": {
        subtitle: "Calculate your lean body mass — everything in your body except fat — using three validated scientific formulas.",
        explanation: { heading: "Lean Body Mass Formulas", paragraphs: ["Lean Body Mass (LBM) = total weight minus fat weight. Three formulas estimate LBM from height, weight, and sex: Boer (1984), James (1976), and Hume (1966). Each was validated against different populations.", "LBM includes muscle, bone, organs, water, and other non-fat tissue. It's useful for calculating protein needs, assessing body composition, and as an input for the Katch-McArdle BMR formula."], highlight: "Male, 70 kg, 170 cm: Boer LBM = 57.5 kg, James = 57.3 kg, Hume = 57.0 kg. Estimated body fat ≈ 18%." },
        faq: [{ question: "Why does lean body mass matter?", answer: "LBM drives your metabolism — more lean mass means higher BMR. It's also used to calculate protein needs (many recommend 2-2.5g protein per kg of LBM rather than total weight)." }, { question: "How can I increase lean body mass?", answer: "Resistance training (weightlifting) is the most effective method. Adequate protein intake (1.6-2.2g/kg), progressive overload, and sufficient sleep support muscle growth." }],
    },
    "waist-hip-ratio-calculator": {
        subtitle: "Calculate your waist-to-hip ratio and assess cardiovascular health risk. A key indicator of visceral fat and metabolic health.",
        explanation: { heading: "Why Waist-to-Hip Ratio Matters", paragraphs: ["WHR = waist circumference ÷ hip circumference. It measures fat distribution — apple-shaped (fat around the waist) carries higher cardiovascular risk than pear-shaped (fat around hips).", "WHO guidelines: Men — Low risk <0.90, Moderate 0.90-0.99, High ≥1.00. Women — Low risk <0.80, Moderate 0.80-0.84, High ≥0.85."], highlight: "Waist 80 cm, Hip 100 cm: WHR = 0.80. For a male: Low risk. For a female: borderline Moderate risk." },
        faq: [{ question: "Is WHR better than BMI?", answer: "WHR is better at predicting cardiovascular risk because it measures where fat is stored. Belly fat (visceral fat) is more dangerous than hip/thigh fat. Ideally, use both BMI and WHR." }, { question: "How do I measure correctly?", answer: "Waist: at the narrowest point, usually just above the belly button. Hip: at the widest point of the buttocks. Stand relaxed, don't pull the tape tight." }],
    },
    "protein-intake-calculator": {
        subtitle: "Calculate your optimal daily protein intake based on weight, activity level, and fitness goal. See your target in grams per day.",
        explanation: { heading: "How Protein Needs Are Calculated", paragraphs: ["Protein needs vary by goal and activity. Sedentary adults: 0.8-1.0g/kg. Active individuals maintaining weight: 1.2-1.4g/kg. Building muscle: 1.6-2.2g/kg. Losing weight (preserving muscle): 1.4-1.8g/kg.", "Higher protein intake helps preserve muscle during calorie restriction, increases satiety (feeling full), and has a higher thermic effect (more calories burned digesting it) compared to carbs or fat."], highlight: "70 kg, moderate activity, building muscle: recommended protein = 140g/day (2.0g/kg). Range: 126-154g/day." },
        faq: [{ question: "Can eating too much protein damage my kidneys?", answer: "No evidence of kidney damage in healthy adults from high protein intake. However, people with existing kidney disease should follow their doctor's protein guidelines." }, { question: "What foods are highest in protein?", answer: "Per 100g: chicken breast 31g, tuna 30g, Greek yogurt 10g, eggs 13g, lentils 9g, tofu 8g. Most people need 3-4 protein-rich meals/snacks daily to hit their target." }],
    },
    "calories-burned-calculator": {
        subtitle: "Calculate calories burned during any activity — running, cycling, swimming, weights, yoga, and more. Uses MET values for accuracy.",
        explanation: { heading: "How Calories Burned Are Calculated", paragraphs: ["Calories burned = MET × weight (kg) × time (hours). MET (Metabolic Equivalent of Task) represents the energy cost relative to rest. Walking = 2.5-4.3 MET, running = 8-12 MET, cycling = 7-10 MET.", "Higher body weight burns more calories for the same activity and duration. Intensity matters more than duration — 30 minutes of running burns more than 60 minutes of walking."], highlight: "70 kg, 30 min running at 8 km/h (MET 8.3): 290 kcal burned. Same person, 30 min walking: 88 kcal." },
        faq: [{ question: "Are calorie burn estimates accurate?", answer: "MET-based calculations are within 10-15% for most people. Individual variation depends on fitness level, body composition, and movement efficiency. Fitness watches are similar in accuracy." }, { question: "Which exercise burns the most calories?", answer: "Per minute: jump rope (11 MET), running at 12km/h (11.8 MET), vigorous cycling (10 MET), swimming (7 MET). For practical fat loss, choose activities you'll do consistently." }],
    },
    "sleep-calculator": {
        subtitle: "Calculate the best times to wake up or go to sleep based on 90-minute sleep cycles. Wake up between cycles to feel refreshed.",
        explanation: { heading: "How Sleep Cycles Work", paragraphs: ["Sleep occurs in 90-minute cycles of light sleep → deep sleep → REM. Waking mid-cycle (especially during deep sleep) causes grogginess. Waking between cycles feels natural and refreshing.", "The calculator adds 15 minutes for falling asleep. Most adults need 4-6 complete cycles (6-9 hours). 5 cycles (7.5 hours) is optimal for most people."], highlight: "Want to wake at 7:00 AM? Best sleep times: 11:15 PM (5 cycles, 7.75h), 9:45 PM (6 cycles, 9.25h), or 12:45 AM (4 cycles, 6.25h)." },
        faq: [{ question: "How many sleep cycles do I need?", answer: "Most adults need 5-6 cycles (7.5-9 hours). Some people function well on 4 cycles (6 hours). Consistently sleeping fewer than 4 cycles impairs cognitive function, immune response, and health." }, { question: "Why do I feel groggy with 8 hours of sleep?", answer: "8 hours doesn't align with 90-minute cycles (5 cycles = 7.5h, 6 = 9h). You may be waking during deep sleep. Try 7.5 or 9 hours instead." }],
    },
    "bac-calculator": {
        subtitle: "Estimate your blood alcohol concentration based on drinks consumed, body weight, sex, and time elapsed.",
        explanation: { heading: "How BAC Is Estimated", paragraphs: ["BAC uses the Widmark formula: BAC = (alcohol consumed in grams / (body weight × distribution factor)) − (0.015 × hours). Distribution factor: 0.68 for males, 0.55 for females. One standard drink = 14g pure alcohol.", "BAC of 0.05% = mildly impaired. 0.08% = legally drunk in many countries. 0.15%+ = severely impaired. The body metabolises alcohol at roughly 0.015% per hour — this rate is fixed and cannot be sped up."], highlight: "70 kg male, 3 standard drinks over 2 hours: estimated BAC ≈ 0.04%. Time to fully sober: ≈ 2.6 hours." },
        faq: [{ question: "How long does it take to get sober?", answer: "The body metabolises alcohol at ~0.015% BAC per hour. This is constant — coffee, food, or cold showers don't speed it up. A BAC of 0.08% takes about 5.3 hours to reach 0.00%." }, { question: "Is this calculator legally reliable?", answer: "No. BAC depends on many individual factors (metabolism, food, medications, genetics) that no calculator can account for. This is an estimate only. Never drive if you've been drinking." }],
    },
    "pace-calculator": {
        subtitle: "Calculate running or walking pace, speed, and predicted finish times. Enter distance and time to see your pace per km and predicted race times.",
        explanation: { heading: "How Pace Is Calculated", paragraphs: ["Pace (min/km) = total minutes ÷ distance (km). Speed (km/h) = distance ÷ (minutes / 60). Race predictions use your pace to estimate half marathon (21.1 km) and full marathon (42.2 km) times.", "Common race paces: recreational runner 6:00-7:00 min/km, intermediate 5:00-6:00, advanced 4:00-5:00, elite <3:30 min/km. Walking pace is typically 8:00-12:00 min/km."], highlight: "10 km in 50 minutes: pace = 5:00 min/km, speed = 12.0 km/h. Predicted half marathon ≈ 1h 45m, full marathon ≈ 3h 31m." },
        faq: [{ question: "What is a good running pace?", answer: "It depends on your experience. For beginners: 7:00-8:00 min/km is a great starting point. For intermediate runners: 5:00-6:00. Club runners: 4:00-5:00. Elite: sub-3:00 min/km." }, { question: "How accurate are marathon predictions?", answer: "Predictions from shorter distances are rough estimates. Most people slow 5-15% in a marathon compared to their 10K pace. Train specifically for the distance you're racing." }],
    },
    "one-rep-max-calculator": {
        subtitle: "Estimate your one rep max (1RM) from a submaximal lift using three validated formulas. See training percentages for strength and hypertrophy.",
        explanation: { heading: "1RM Estimation Formulas", paragraphs: ["Three formulas: Epley (weight × (1 + reps/30)), Brzycki (weight × 36 / (37 − reps)), and Lombardi (weight × reps^0.1). All are most accurate with 3-10 reps — below 3 reps or above 10 reduces accuracy.", "Training percentages: 90-100% = maximal strength (1-3 reps), 80-90% = strength (3-5 reps), 70-80% = hypertrophy (8-12 reps), 60-70% = muscular endurance (15+ reps)."], highlight: "100 kg × 5 reps: Epley 1RM = 117 kg, Brzycki = 113 kg, Lombardi = 117 kg. 80% (hypertrophy) = 92 kg." },
        faq: [{ question: "Why estimate instead of testing my actual 1RM?", answer: "Testing a true 1RM carries injury risk and requires proper warm-up, spotters, and experience. Estimation from 3-5 reps is safer and accurate within 5% for most lifters." }, { question: "Which formula should I use?", answer: "Epley and Brzycki are the most commonly used. They agree closely at 3-6 reps. Brzycki tends to give slightly conservative estimates, which may be safer for programming." }],
    },
    "body-recomp-calculator": {
        subtitle: "Calculate calories and macros for body recomposition — building muscle while losing fat. Get separate targets for training and rest days.",
        explanation: { heading: "How Body Recomposition Works", paragraphs: ["Body recomp uses calorie cycling: slight surplus on training days (+10% TDEE) for muscle building, moderate deficit on rest days (−15% TDEE) for fat loss. High protein throughout (2.0-2.2g/kg) preserves muscle.", "This approach works best for beginners, those returning from a break, or anyone within 10-15% of their ideal body fat. Advanced lifters may need dedicated bulk/cut phases instead."], highlight: "70 kg, TDEE 2,474: Training days 2,721 kcal (P:154g, C:292g, F:76g). Rest days 2,103 kcal (P:140g, C:176g, F:70g)." },
        faq: [{ question: "Can you really build muscle and lose fat at the same time?", answer: "Yes, especially if you're a beginner, returning after a break, or carrying excess body fat. The key is high protein (2g+/kg), progressive resistance training, and calorie cycling between training and rest days." }, { question: "How long does body recomposition take?", answer: "Slower than dedicated bulking or cutting — expect visible changes in 3-6 months. The advantage is you never get excessively lean or excessively fat during the process." }],
    },
    "glycemic-index-calculator": {
        subtitle: "Calculate the glycemic load of a food from its glycemic index and carb content. Understand the real blood sugar impact of what you eat.",
        explanation: { heading: "Glycemic Index vs Glycemic Load", paragraphs: ["GI measures how quickly a food raises blood sugar (0-100 scale). GL = (GI × carbs per serving) / 100. GL gives a more practical measure because it accounts for portion size — watermelon has high GI (72) but low GL (4) because a serving has few carbs.", "GL categories: Low ≤10 (minimal blood sugar impact), Medium 11-20, High >20 (significant blood sugar spike). For diabetes management and weight control, aim for low-GL meals."], highlight: "White rice: GI 73, 45g carbs per serving → GL = 32.9 (High). Brown rice: GI 68, 40g carbs → GL = 27.2 (High but lower)." },
        faq: [{ question: "What is glycemic index?", answer: "A 0-100 scale measuring how fast a food raises blood sugar compared to pure glucose (100). Low GI ≤55, Medium 56-69, High ≥70. Lower GI foods provide steadier energy." }, { question: "Should I avoid all high-GI foods?", answer: "Not necessarily. GL matters more than GI because it accounts for portion size. Also, mixing high-GI foods with protein, fat, or fibre lowers the overall glycemic response of the meal." }],
    },
    "blood-pressure-calculator": {
        subtitle: "Check your blood pressure category based on your systolic and diastolic readings. See if your blood pressure is normal, elevated, or high.",
        explanation: { heading: "Blood Pressure Categories", paragraphs: ["Blood pressure is measured in mmHg as systolic/diastolic. Categories: Normal <120/80, Elevated 120-129/<80, High Stage 1: 130-139 or 80-89, High Stage 2: ≥140 or ≥90, Crisis: >180 or >120.", "One reading isn't diagnostic — blood pressure varies throughout the day. Measure at the same time daily for a week to get a reliable average. Morning readings (before coffee/medication) are most informative."], highlight: "120/80 mmHg = Normal. 135/85 = High Stage 1 (lifestyle changes needed). 160/100 = High Stage 2 (medication likely needed)." },
        faq: [{ question: "What is considered normal blood pressure?", answer: "Below 120/80 mmHg. Systolic (top number) measures pressure during heartbeats. Diastolic (bottom) measures pressure between beats. Both numbers matter." }, { question: "How can I lower my blood pressure naturally?", answer: "Reduce sodium (<2,300mg/day), exercise 150 min/week, maintain healthy weight, limit alcohol, eat potassium-rich foods, manage stress, and get adequate sleep. These can lower BP by 5-15 mmHg." }],
    },
    "vo2-max-calculator": {
        subtitle: "Estimate your VO2 max from the Cooper test (12-minute run) or 5K race time. See your cardiovascular fitness level.",
        explanation: { heading: "What Is VO2 Max?", paragraphs: ["VO2 max = maximum oxygen your body can use during exercise, measured in ml/kg/min. It's the gold standard for cardiovascular fitness. Higher VO2 max = better endurance performance and lower disease risk.", "Cooper test formula: VO2 max = (distance in metres − 504.9) / 44.73. 5K time formula: VO2 max = 3.5 + 483 / time (minutes). Both are validated estimates of lab-measured VO2 max."], highlight: "Cooper test: 2,400m in 12 min → VO2 max ≈ 42.3 (Good). 5K in 25 min → VO2 max ≈ 22.8. Elite athletes: 60-80+ ml/kg/min." },
        faq: [{ question: "What is a good VO2 max?", answer: "Men: Poor <35, Fair 35-38, Good 39-48, Excellent 49-55, Superior 55+. Women: Poor <28, Fair 28-33, Good 34-43, Excellent 44-50, Superior 50+. Values decrease with age." }, { question: "How can I improve my VO2 max?", answer: "High-intensity interval training (HIIT) is most effective — 4×4 minute intervals at 90-95% max HR, 3 times/week. Also: consistent zone 2 training builds aerobic base. Improvements of 15-20% are common in 8-12 weeks." }],
    },
    "army-body-fat-calculator": {
        subtitle: "Calculate body fat percentage using the U.S. Army tape test method. See if you meet military body composition standards.",
        explanation: { heading: "The Army Tape Test Method", paragraphs: ["The U.S. Army (AR 600-9) uses circumference measurements to estimate body fat when a soldier exceeds screening weight. Men: height, waist (at navel), and neck. Women: height, waist, neck, and hip.", "Maximum allowable body fat: Men 26%, Women 36% (varies slightly by age group). The formula uses the same logarithmic approach as the Navy method but with military-specific standards."], highlight: "Male, 170 cm, waist 85 cm, neck 38 cm: body fat ≈ 19.7%. Max allowed: 26%. Status: within standard." },
        faq: [{ question: "How accurate is the tape test?", answer: "Within 3-4% of DEXA results for most people. It can over-estimate body fat for very muscular individuals. The military allows appeals for body composition testing via hydrostatic weighing if a soldier believes the tape test is inaccurate." }, { question: "What are the Army body fat standards?", answer: "Males: 26% (ages 17-20), 26% (21-27), 26% (28-39), 26% (40+). Females: 30% (17-20), 32% (21-27), 34% (28-39), 36% (40+). Standards vary slightly by branch of service." }],
    },
};

export default async function HealthCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("health").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/health-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Health Calculators", url: canonicalUrl("/health-calculators") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl)]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-health-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Health Calculators", href: "/health-calculators" }, { label: calc.title.replace(" Calculator", "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <HealthCalculatorCore calcType={calc.calcType || "bmi"} />
                    {content && (<>
                        <DynamicExplanation heading={content.explanation?.heading} paragraphs={content.explanation?.paragraphs} highlight={content.explanation?.highlight} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                </div>
                <aside className="layout-2col__sidebar"><TrendingCalculations variant="sidebar" /></aside>
            </div>
        </main>
    );
}
