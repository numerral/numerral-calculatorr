// Standalone page — /ar/hisabat-kutlat-aljism
// حاسبة مؤشر كتلة الجسم — Arabic BMI Calculator
// WHO classification, UAE MOHAP obesity data, waist circumference, ideal weight

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import BMICalculatorCore from "@/components/calculator/BMICalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة مؤشر كتلة الجسم (BMI) — Body Mass Index Calculator (2026)",
    description: "احسب مؤشر كتلة جسمك (BMI) من الوزن والطول مع تصنيف منظمة الصحة العالمية (7 فئات). تشمل محيط الخصر كمؤشر صحي، الوزن المثالي حسب الطول، إحصائيات السمنة في الإمارات (MOHAP 2024-25)، المخاطر الصحية، وعلاقة BMI بالتمارين والتغذية.",
    keywords: ["حاسبة BMI", "مؤشر كتلة الجسم", "BMI calculator", "حاسبة الوزن المثالي", "السمنة", "نحافة", "WHO BMI", "محيط الخصر", "MOHAP obesity", "سمنة الإمارات"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-kutlat-aljism` },
};

const FAQ_ITEMS = [
    { question: "ما هو مؤشر كتلة الجسم (BMI)؟", answer: "BMI = الوزن (كجم) ÷ الطول (م)². رقم يقيس نسبة الوزن للطول لتحديد ما إذا كان وزنك صحياً. ابتكره العالم البلجيكي أدولف كيتيليه في القرن 19. تستخدمه منظمة الصحة العالمية (WHO) كأداة فحص أولي." },
    { question: "ما هي فئات BMI حسب منظمة الصحة العالمية؟", answer: "نحافة شديدة: أقل من 16. نحافة: 16-18.5. طبيعي: 18.5-25. زيادة وزن: 25-30. سمنة درجة أولى: 30-35. سمنة درجة ثانية: 35-40. سمنة مفرطة: 40+. الهدف الصحي: 18.5-24.9 لمعظم البالغين." },
    { question: "كيف أحسب BMI يدوياً؟", answer: "المعادلة: الوزن بالكيلوغرام ÷ (الطول بالمتر × الطول بالمتر). مثال: شخص وزنه 75 كجم وطوله 175 سم → 75 ÷ (1.75 × 1.75) = 75 ÷ 3.0625 = 24.5 (طبيعي). يمكنك استخدام الحاسبة أعلاه للحصول على النتيجة فوراً." },
    { question: "ما هو الوزن المثالي حسب الطول؟", answer: "الوزن المثالي = BMI بين 18.5-24.9. أمثلة: طول 160 سم = 47.4-63.7 كجم. طول 170 سم = 53.5-71.9 كجم. طول 175 سم = 56.7-76.3 كجم. طول 180 سم = 59.9-80.7 كجم. الحاسبة تحسب الوزن المثالي تلقائياً من طولك." },
    { question: "هل BMI دقيق؟ ما هي حدوده؟", answer: "BMI أداة فحص أولي وليست تشخيصاً. حدوده: (1) لا يميّز بين العضلات والدهون — رياضي عضلي قد يكون BMI 28+ وهو صحي. (2) لا يكشف أين تتوزع الدهون — دهون البطن أخطر. (3) لا يراعي العمر والجنس. (4) صُمم لأصول أوروبية — قد لا يناسب كل الأعراق. لذلك: استخدمه مع محيط الخصر ونسبة الدهون للحصول على صورة أشمل." },
    { question: "لماذا محيط الخصر مهم مع BMI؟", answer: "محيط الخصر يكشف الدهون الحشوية (Visceral Fat) حول الأعضاء الداخلية — وهي أخطر من الدهون تحت الجلد. حتى لو BMI طبيعي، محيط خصر مرتفع = خطر صحي. حدود WHO: رجال > 94 سم = خطر مرتفع، > 102 سم = مرتفع جداً. نساء > 80 سم = مرتفع، > 88 سم = مرتفع جداً." },
    { question: "ما هي إحصائيات السمنة في الإمارات؟", answer: "حسب MOHAP (المسح الصحي الوطني 2024-25): 22.4% من البالغين يعانون من السمنة — انخفاض 14.8% عن 15 سنة سابقة. السمنة أعلى عند النساء (30.6%) مقارنة بالرجال (25.1%). المواطنون (36.9%) أعلى من المقيمين (26.3%). أعلى الإمارات: عجمان (39.1%)، الفجيرة (39.1%)، رأس الخيمة (38%+)." },
    { question: "ما هي المخاطر الصحية لزيادة الوزن والسمنة؟", answer: "BMI ≥ 25 يزيد مخاطر: أمراض القلب والأوعية (ضغط، كولسترول، جلطات). السكري نوع 2 (مقاومة الإنسولين). سرطانات (قولون، ثدي، رحم). انقطاع النفس النومي (Sleep Apnea). هشاشة مفاصل (خشونة الركبة). أمراض الكبد الدهني. مشاكل الخصوبة." },
    { question: "ما هي مخاطر النحافة (BMI < 18.5)؟", answer: "النحافة الشديدة تزيد مخاطر: سوء التغذية وفقر الدم. ضعف المناعة (عدوى متكررة). هشاشة العظام. فقدان عضلات. تساقط الشعر. عند النساء: اضطراب الدورة الشهرية، مشاكل خصوبة. عند الأطفال: تأخر النمو والتطور." },
    { question: "ما هو BMI Prime؟", answer: "BMI Prime = BMI الخاص بك ÷ 25. نسبة تُظهر بُعدك عن الحد الأعلى للطبيعي (25). BMI Prime = 1.0 = على الحد بالضبط. أقل من 1.0 = ضمن الطبيعي. أكثر من 1.0 = زيادة وزن. مثال: BMI 27.5 → BMI Prime = 1.10 (10% فوق الحد). ميزة: سهل الفهم والمقارنة." },
    { question: "هل BMI يختلف للأطفال والمراهقين؟", answer: "نعم. للأطفال والمراهقين (2-18 سنة)، يُستخدم BMI-for-Age (BMI حسب العمر والجنس) وليس الفئات الثابتة للبالغين. يُقارن BMI الطفل بالنسب المئوية (Percentiles) لأقرانه من نفس العمر والجنس. تحت 5% = نحافة. 5-85% = طبيعي. 85-95% = زيادة وزن. فوق 95% = سمنة." },
    { question: "هل يختلف BMI حسب العرق أو الجنس؟", answer: "نعم. NHS البريطانية تستخدم حدوداً أقل للأصول الآسيوية/العربية/الأفريقية: زيادة وزن من 23 (بدلاً من 25)، وسمنة من 27.5 (بدلاً من 30). النساء عموماً لديهن نسبة دهون أعلى من الرجال بنفس BMI. كبار السن لديهم دهون أكثر وعضلات أقل بنفس BMI." },
    { question: "كيف أخفض BMI بأمان؟", answer: "الهدف: خسارة 0.5-1 كجم/أسبوع (عجز 500-1000 سعرة/يوم). الطريقة: (1) احسب سعراتك بـ حاسبة السعرات الحرارية. (2) أنشئ عجزاً خفيفاً 500 سعرة. (3) تمارين قوة 3-4 مرات/أسبوع (للحفاظ على العضلات). (4) بروتين 1.6-2 غ/كجم من وزن الجسم. (5) نوم 7-9 ساعات. (6) ماء كافٍ (استخدم حاسبة الماء)." },
    { question: "ما هو الوزن الطبيعي لرجل طوله 170 سم؟", answer: "الوزن الصحي لطول 170 سم (BMI 18.5-24.9): 53.5 كجم – 71.9 كجم. الوزن المثالي (BMI ≈ 22): حوالي 63.6 كجم. إذا كنت رياضياً (عضلات كثيرة)، قد يكون وزنك أعلى وهذا طبيعي — استخدم محيط الخصر كمكمّل." },
    { question: "ما هو الوزن الطبيعي لامرأة طولها 160 سم؟", answer: "الوزن الصحي لطول 160 سم (BMI 18.5-24.9): 47.4 كجم – 63.7 كجم. الوزن المثالي (BMI ≈ 22): حوالي 56.3 كجم. النساء لديهن نسبة دهون أعلى طبيعياً — ركّزي على محيط الخصر (≤ 80 سم) أكثر من BMI وحده." },
];

export default function BMICalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة BMI", item: `${SITE_URL}/ar/hisabat-kutlat-aljism` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة مؤشر كتلة الجسم (BMI)",
            url: `${SITE_URL}/ar/hisabat-kutlat-aljism`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسب BMI من الوزن والطول مع تصنيف WHO ومحيط الخصر والوزن المثالي",
        },
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
        <main className="ar-page">
            <Script id="schema-bmi-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة مؤشر كتلة الجسم</span>
            </nav>

            <h1 className="ar-page__title">⚖️ حاسبة مؤشر كتلة الجسم — BMI (2026)</h1>
            <p className="ar-page__subtitle">
                احسب مؤشر كتلة جسمك (BMI) من الوزن والطول — مع تصنيف منظمة الصحة العالمية (7 فئات من النحافة الشديدة للسمنة المفرطة)، محيط الخصر كمؤشر على دهون البطن الحشوية، الوزن المثالي حسب الطول، وإحصائيات السمنة في الإمارات من المسح الصحي الوطني 2024-25 (MOHAP).
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <BMICalculatorCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة مؤشر كتلة الجسم</h2>
                {FAQ_ITEMS.map((item, i) => (
                    <details key={i} className="ar-faq__item">
                        <summary className="ar-faq__question">{item.question}</summary>
                        <p className="ar-faq__answer">{item.answer}</p>
                    </details>
                ))}
            </section>

            <section className="ar-related">
                <h2 className="ar-related__title">🔗 حاسبات ذات صلة</h2>
                <div className="ar-related__grid">
                    <Link href="/ar/hisabat-suarat-hararia" className="ar-related__card">
                        <span className="ar-related__icon">🔥</span>
                        <span className="ar-related__name">حاسبة السعرات الحرارية</span>
                    </Link>
                    <Link href="/ar/hisabat-ihtiyaj-alma" className="ar-related__card">
                        <span className="ar-related__icon">💧</span>
                        <span className="ar-related__name">حاسبة احتياج الماء</span>
                    </Link>
                    <Link href="/ar/hisabat-shakl-aljism" className="ar-related__card">
                        <span className="ar-related__icon">📏</span>
                        <span className="ar-related__name">حاسبة شكل الجسم</span>
                    </Link>
                    <Link href="/ar/hisabat-dawrat-alnawm" className="ar-related__card">
                        <span className="ar-related__icon">🌙</span>
                        <span className="ar-related__name">حاسبة دورة النوم</span>
                    </Link>
                    <Link href="/ar/hisabat-ratib" className="ar-related__card">
                        <span className="ar-related__icon">💵</span>
                        <span className="ar-related__name">حاسبة الراتب</span>
                    </Link>
                    <Link href="/ar/hisabat-nisba-miwiya" className="ar-related__card">
                        <span className="ar-related__icon">📐</span>
                        <span className="ar-related__name">حاسبة النسبة المئوية</span>
                    </Link>
                </div>
            </section>

            <div className="ar-page__back">
                <Link href="/ar" className="ar-page__back-link">→ العودة لجميع الحاسبات</Link>
            </div>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-bmi">ما هو مؤشر كتلة الجسم (BMI)؟</h2>
    <p>مؤشر كتلة الجسم (Body Mass Index — BMI) هو <strong>رقم يُحسب من الوزن والطول</strong> لتقييم ما إذا كان وزن الشخص صحياً بالنسبة لطوله. ابتكره العالم البلجيكي <strong>أدولف كيتيليه</strong> في القرن 19، وتستخدمه <strong>منظمة الصحة العالمية (WHO)</strong> كأداة فحص أولي عالمية.</p>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">📐</span>
        <div>
            <strong>المعادلة:</strong> BMI = الوزن (كجم) ÷ الطول (م)²<br/>
            <strong>مثال:</strong> 75 كجم ÷ (1.75 م × 1.75 م) = 75 ÷ 3.0625 = <strong>24.5</strong> (طبيعي)
        </div>
    </div>
    <p><strong>BMI أداة فحص — وليست تشخيصاً.</strong> لا يقيس نسبة الدهون مباشرة ولا يحدد أين تتوزع. لذلك يُستخدم مع قياسات أخرى (محيط الخصر، نسبة الدهون) للحصول على تقييم صحي شامل.</p>

    <h2 id="who-categories">تصنيف BMI — منظمة الصحة العالمية (WHO)</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة</th><th>BMI</th><th>المخاطر الصحية</th></tr></thead>
            <tbody>
                <tr><td><strong>🔵 نحافة شديدة</strong></td><td>أقل من 16</td><td>خطر مرتفع — سوء تغذية، ضعف مناعة، هشاشة عظام</td></tr>
                <tr><td><strong>🟦 نحافة</strong></td><td>16 – 18.5</td><td>خطر متوسط — فقر دم، تساقط شعر</td></tr>
                <tr><td><strong>🟢 طبيعي</strong></td><td>18.5 – 24.9</td><td>خطر منخفض — الوزن الصحي المثالي</td></tr>
                <tr><td><strong>🟡 زيادة وزن</strong></td><td>25 – 29.9</td><td>خطر مرتفع قليلاً — ضغط، كولسترول</td></tr>
                <tr><td><strong>🟠 سمنة درجة أولى</strong></td><td>30 – 34.9</td><td>خطر مرتفع — سكري نوع 2، أمراض قلب</td></tr>
                <tr><td><strong>🔴 سمنة درجة ثانية</strong></td><td>35 – 39.9</td><td>خطر مرتفع جداً — أمراض مزمنة متعددة</td></tr>
                <tr><td><strong>🟣 سمنة مفرطة (Class III)</strong></td><td>40+</td><td>خطر شديد — يستلزم تدخل طبي</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>ملاحظة مهمة:</strong> حسب NHS البريطانية، للأشخاص من أصول <strong>آسيوية، عربية، أفريقية</strong>: زيادة الوزن تبدأ من BMI 23 (بدلاً من 25)، والسمنة من 27.5 (بدلاً من 30). السبب: هذه المجموعات تخزن دهوناً حشوية بنسبة أعلى عند BMI أقل.</p>

    <h2 id="ideal-weight">الوزن المثالي حسب الطول</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الطول (سم)</th><th>الحد الأدنى (كجم)</th><th>المثالي ≈ BMI 22 (كجم)</th><th>الحد الأعلى (كجم)</th></tr></thead>
            <tbody>
                <tr><td>150</td><td>41.6</td><td>49.5</td><td>56.0</td></tr>
                <tr><td>155</td><td>44.4</td><td>52.9</td><td>59.8</td></tr>
                <tr><td><strong>160</strong></td><td>47.4</td><td>56.3</td><td>63.7</td></tr>
                <tr><td>165</td><td>50.4</td><td>59.9</td><td>67.8</td></tr>
                <tr><td><strong>170</strong></td><td>53.5</td><td>63.6</td><td>71.9</td></tr>
                <tr><td><strong>175</strong></td><td>56.7</td><td>67.4</td><td>76.3</td></tr>
                <tr><td><strong>180</strong></td><td>59.9</td><td>71.3</td><td>80.7</td></tr>
                <tr><td>185</td><td>63.3</td><td>75.3</td><td>85.2</td></tr>
                <tr><td>190</td><td>66.8</td><td>79.4</td><td>89.9</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="waist-circumference">محيط الخصر — لماذا أهم من BMI وحده</h2>
    <p>محيط الخصر يكشف <strong>الدهون الحشوية (Visceral Fat)</strong> — الدهون حول الأعضاء الداخلية (كبد، كلى، قلب، بنكرياس). هذه الدهون <strong>أخطر صحياً</strong> من الدهون تحت الجلد لأنها:</p>
    <ul>
        <li>تُفرز <strong>هرمونات التهابية</strong> تزيد مقاومة الإنسولين</li>
        <li>تزيد <strong>مخاطر أمراض القلب والأوعية</strong> بشكل مستقل عن BMI</li>
        <li>ترتبط بـ <strong>متلازمة الأيض</strong> (ضغط + سكر + كولسترول + دهون)</li>
    </ul>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الجنس</th><th>🟢 طبيعي</th><th>🟡 مرتفع</th><th>🔴 مرتفع جداً</th></tr></thead>
            <tbody>
                <tr><td><strong>رجال</strong></td><td>≤ 94 سم</td><td>94 – 102 سم</td><td>> 102 سم</td></tr>
                <tr><td><strong>نساء</strong></td><td>≤ 80 سم</td><td>80 – 88 سم</td><td>> 88 سم</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>حالة TOFI:</strong> شخص BMI طبيعي لكن محيط خصر مرتفع = "نحيل من الخارج، سمين من الداخل" (Thin Outside, Fat Inside). هذا أخطر مما يبدو — لأنه يُخفي المخاطر. لمعرفة تفاصيل أكثر عن توزيع الدهون، استخدم <a href="/ar/hisabat-shakl-aljism">حاسبة شكل الجسم</a>.</p>

    <h2 id="uae-obesity">السمنة في الإمارات — إحصائيات MOHAP 2024-25</h2>
    <p>حسب <strong>المسح الصحي الوطني 2024-25</strong> (MOHAP + WHO):</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المؤشر</th><th>النسبة</th></tr></thead>
            <tbody>
                <tr><td><strong>معدل السمنة (البالغون)</strong></td><td>22.4% — انخفاض 14.8% عن 15 سنة</td></tr>
                <tr><td>السمنة عند النساء</td><td>30.6%</td></tr>
                <tr><td>السمنة عند الرجال</td><td>25.1%</td></tr>
                <tr><td>السمنة — المواطنون</td><td>36.9%</td></tr>
                <tr><td>السمنة — المقيمون</td><td>26.3%</td></tr>
                <tr><td>عدم النشاط البدني الكافي</td><td>59.1%</td></tr>
            </tbody>
        </table>
    </div>
    <h3>السمنة حسب الإمارة (2023)</h3>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الإمارة</th><th>معدل السمنة</th></tr></thead>
            <tbody>
                <tr><td>عجمان</td><td>39.1%</td></tr>
                <tr><td>الفجيرة</td><td>39.1%</td></tr>
                <tr><td>رأس الخيمة</td><td>38%+</td></tr>
                <tr><td>أم القيوين</td><td>36.7%</td></tr>
                <tr><td>أبوظبي</td><td>35.9%</td></tr>
                <tr><td>الشارقة</td><td>24.4%</td></tr>
                <tr><td>دبي</td><td>22.2%</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="health-risks-overweight">المخاطر الصحية لزيادة الوزن والسمنة</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة</th><th>المخاطر</th></tr></thead>
            <tbody>
                <tr><td><strong>القلب والأوعية</strong></td><td>ارتفاع ضغط الدم، ارتفاع الكولسترول، تصلب الشرايين، سكتة دماغية</td></tr>
                <tr><td><strong>الأيض</strong></td><td>السكري نوع 2، مقاومة الإنسولين، متلازمة الأيض</td></tr>
                <tr><td><strong>السرطان</strong></td><td>سرطان القولون، الثدي، الرحم، المريء</td></tr>
                <tr><td><strong>الجهاز التنفسي</strong></td><td>انقطاع النفس النومي (Sleep Apnea)، ربو</td></tr>
                <tr><td><strong>العضلات والمفاصل</strong></td><td>خشونة الركبة، آلام الظهر، هشاشة المفاصل</td></tr>
                <tr><td><strong>الهضم</strong></td><td>حصوات المرارة، ارتجاع المريء، الكبد الدهني</td></tr>
                <tr><td><strong>الصحة النفسية</strong></td><td>اكتئاب، قلق، تدني الثقة بالنفس</td></tr>
                <tr><td><strong>الإنجاب</strong></td><td>مشاكل خصوبة، سكري حمل، تسمم حمل</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="underweight-risks">المخاطر الصحية للنحافة (BMI < 18.5)</h2>
    <ul>
        <li><strong>سوء التغذية وفقر الدم:</strong> نقص الحديد والفيتامينات = تعب مزمن</li>
        <li><strong>ضعف المناعة:</strong> عدوى متكررة وبطء التعافي</li>
        <li><strong>هشاشة العظام:</strong> خطر كسور — خاصة كبار السن</li>
        <li><strong>فقدان العضلات:</strong> ضعف بدني وتعب سريع</li>
        <li><strong>تساقط الشعر وجفاف الجلد</strong></li>
        <li><strong>النساء:</strong> اضطراب الدورة الشهرية، صعوبة الحمل، ولادة مبكرة</li>
        <li><strong>الأطفال:</strong> تأخر النمو الجسدي والعقلي</li>
    </ul>

    <h2 id="bmi-limitations">حدود BMI — لماذا لا يكفي وحده</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الحد</th><th>الشرح</th><th>البديل</th></tr></thead>
            <tbody>
                <tr><td><strong>لا يميّز العضلات عن الدهون</strong></td><td>رياضي عضلي BMI 28 = سمنة شكلياً؟ لا.</td><td>نسبة الدهون (DEXA Scan)</td></tr>
                <tr><td><strong>لا يحدد توزيع الدهون</strong></td><td>دهون البطن أخطر من دهون الأرداف</td><td>محيط الخصر + WHR</td></tr>
                <tr><td><strong>لا يراعي العمر</strong></td><td>كبار السن: عضلات أقل + دهون أكثر</td><td>BMI-for-Age للأطفال</td></tr>
                <tr><td><strong>لا يراعي الجنس</strong></td><td>النساء: 20-25% دهون طبيعي. الرجال: 10-20%</td><td>نسبة الدهون حسب الجنس</td></tr>
                <tr><td><strong>لا يراعي العرق</strong></td><td>صُمم لأصول أوروبية — حدود مختلفة لآسيويين</td><td>حدود NHS المعدلة</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="bmi-prime">ما هو BMI Prime؟</h2>
    <p><strong>BMI Prime</strong> = BMI الخاص بك ÷ 25 (الحد الأعلى للطبيعي). نسبة بسيطة تُسهّل الفهم:</p>
    <ul>
        <li><strong>BMI Prime = 1.0:</strong> على الحد بالضبط بين الطبيعي وزيادة الوزن</li>
        <li><strong>أقل من 1.0:</strong> ضمن الوزن الطبيعي (مثال: 0.92 = 8% تحت الحد)</li>
        <li><strong>أكثر من 1.0:</strong> فوق الطبيعي (مثال: 1.20 = 20% فوق الحد)</li>
    </ul>

    <h2 id="arab-obesity">السمنة في المنطقة العربية — إحصائيات 2022</h2>
    <p>حسب FAO/WHO، معدل السمنة في <strong>الدول العربية بلغ 32.1%</strong> (ضعف المعدل العالمي 15.8%):</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الدولة</th><th>نسبة السمنة (2022)</th></tr></thead>
            <tbody>
                <tr><td>🇪🇬 مصر</td><td>44.3%</td></tr>
                <tr><td>🇶🇦 قطر</td><td>43.1%</td></tr>
                <tr><td>🇰🇼 الكويت</td><td>41.4%</td></tr>
                <tr><td>🇯🇴 الأردن</td><td>35.5%</td></tr>
                <tr><td>🇸🇦 السعودية</td><td>35.4%</td></tr>
                <tr><td>🇱🇧 لبنان</td><td>32.0%</td></tr>
                <tr><td>🇦🇪 الإمارات</td><td>27.8% (MOHAP)</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>الأسباب الرئيسية:</strong> تحول نحو أنظمة غذائية غربية (لحوم، كربوهيدرات مكررة، سكر، زيوت)، قلة النشاط البدني (مكاتب، سيارات، حرارة)، وعوامل ثقافية.</p>

    <h2 id="how-to-improve">كيف تحسّن BMI بأمان</h2>
    <h3>لزيادة الوزن (BMI < 18.5)</h3>
    <ol>
        <li>فائض سعرات <strong>300-500 سعرة/يوم</strong> — احسبها بـ <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a></li>
        <li>بروتين <strong>1.6-2.2 غ/كجم</strong> من وزن الجسم</li>
        <li>تمارين قوة <strong>3-4 مرات/أسبوع</strong> (سكوات، ضغط، سحب)</li>
        <li>وجبات متعددة (5-6 وجبات صغيرة بدلاً من 3 كبيرة)</li>
    </ol>
    <h3>لخسارة الوزن (BMI ≥ 25)</h3>
    <ol>
        <li>عجز سعرات <strong>500-750 سعرة/يوم</strong> — لخسارة 0.5-0.75 كجم/أسبوع</li>
        <li>بروتين عالي (<strong>1.6-2 غ/كجم</strong>) للحفاظ على العضلات</li>
        <li>تمارين قوة + كارديو (<strong>150 دقيقة/أسبوع</strong>)</li>
        <li>نوم 7-9 ساعات — <a href="/ar/hisabat-dawrat-alnawm">حاسبة دورة النوم</a></li>
        <li>ماء كافٍ — <a href="/ar/hisabat-ihtiyaj-alma">حاسبة احتياج الماء</a></li>
    </ol>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات أولية</strong> بناءً على معادلة BMI القياسية. BMI أداة فحص وليست تشخيصاً طبياً. لا يستبدل استشارة الطبيب أو أخصائي التغذية. إذا كان BMI مرتفعاً أو منخفضاً بشكل كبير، استشر طبيبك لتقييم شامل يشمل نسبة الدهون ومحيط الخصر وتحاليل الدم.
    </p>
`;
