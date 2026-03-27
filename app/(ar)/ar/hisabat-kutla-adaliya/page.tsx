// Standalone page — /ar/hisabat-kutla-adaliya
// حاسبة الكتلة العضلية — Arabic Lean Body Mass Calculator
// 3 formulas (Boer/James/Hume), FFMI, body fat categories

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import LeanBodyMassCore from "@/components/calculator/LeanBodyMassCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة الكتلة العضلية (LBM) — Lean Body Mass Calculator (2026)",
    description: "احسب كتلة جسمك الخالية من الدهون (LBM) بـ 3 معادلات علمية (Boer/James/Hume) + مؤشر FFMI. تشمل نسبة الدهون الصحية حسب الجنس، مقارنة المعادلات، تفسير FFMI للرياضيين، ونصائح بناء العضلات وتقليل الدهون.",
    keywords: ["حاسبة كتلة عضلية", "LBM", "lean body mass", "FFMI", "نسبة دهون", "كتلة خالية من الدهون", "بناء عضلات", "body fat percentage", "Boer formula"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-kutla-adaliya` },
};

const FAQ_ITEMS = [
    { question: "ما هي الكتلة الخالية من الدهون (LBM)؟", answer: "LBM = وزنك الإجمالي − كتلة الدهون. تشمل: العضلات الهيكلية، العظام، الأعضاء الداخلية، الدم، الجلد، والماء. LBM هي المؤشر الحقيقي لـ 'حجمك الوظيفي' — وزنك بدون الدهون المخزنة." },
    { question: "ما الفرق بين LBM و FFM؟", answer: "تقنياً: LBM (Lean Body Mass) = يشمل بعض الدهون الأساسية داخل الأعضاء والنخاع. FFM (Fat-Free Mass) = بدون أي دهون نهائياً. عملياً: يُستخدمان بالتبادل — الفرق 2-3% فقط. في الحاسبة نستخدمهما معاً." },
    { question: "ما هي معادلات Boer و James و Hume؟", answer: "3 معادلات تقدّر LBM من الوزن والطول بدون قياس الدهون. Boer (1984): الأدق للاستخدام العام. الأفضل لذوي BMI 35-40. James (1976): قد تقلل التقدير في السمنة المفرطة (BMI > 37 للنساء). Hume (1966): أنسب للأشخاص الأكبر حجماً. الإدخال الأدق: نسبة الدهون الفعلية (DEXA/مقبض) — تعطي حساباً مباشراً." },
    { question: "ما هو مؤشر FFMI؟", answer: "FFMI (Fat-Free Mass Index) = الكتلة الخالية من الدهون ÷ الطول(م)². يقيس العضلية نسبة للطول — أفضل من BMI للرياضيين. التفسير (رجال): أقل من 18 = تحت المتوسط. 18-20 = متوسط. 20-22 = فوق المتوسط. 22-25 = عضلي جداً. أكثر من 25 = نادر طبيعياً (يشير لمنشطات محتملة)." },
    { question: "ما هي نسبة الدهون الصحية؟", answer: "تختلف حسب الجنس: رجال — أساسية: 2-5%، رياضي: 6-13%، لياقة: 14-17%، متوسط: 18-24%، سمنة: 25%+. نساء — أساسية: 10-13%، رياضية: 14-20%، لياقة: 21-24%، متوسط: 25-31%، سمنة: 32%+. النساء يحتجن دهوناً أكثر بيولوجياً (هرمونات + إنجاب)." },
    { question: "كيف أقيس نسبة الدهون بدقة؟", answer: "الطرق مرتبة من الأدق: 1) DEXA Scan: أشعة سينية — الأدق (±1.5%). 2) Hydrostatic Weighing: وزن تحت الماء (±2%). 3) Bod Pod: ضغط الهواء (±2%). 4) مقبض الدهون (Skinfold Calipers): قياس ثنيات الجلد (±3-4%). 5) مقاييس BIA (الميزان الذكي): التحليل الكهربائي (±4-5%). 6) Navy Method: محيط الرقبة + الخصر + الأرداف (±3%)." },
    { question: "لماذا LBM أهم من الوزن الإجمالي؟", answer: "الوزن وحده لا يخبرك بشيء. شخصان بوزن 85 كجم: الأول: 65 كجم عضلات + 20 كجم دهون = رياضي. الثاني: 55 كجم عضلات + 30 كجم دهون = بحاجة لإنقاص. LBM يكشف التركيب الحقيقي. لحساب BMI: حاسبة مؤشر كتلة الجسم." },
    { question: "كيف أزيد الكتلة العضلية؟", answer: "5 أساسيات: 1) تمارين قوة (Resistance Training) 3-5 مرات/أسبوع — تمارين مركبة (سكوات، ديدلفت، بنش). 2) بروتين: 1.6-2.2 غ/كجم/يوم. 3) فائض سعرات: +300-500 سعرة/يوم (احسبها بحاسبة السعرات). 4) نوم: 7-9 ساعات (HGH يُفرز في النوم العميق). 5) تدرّج في الأثقال (Progressive Overload)." },
    { question: "هل يمكن بناء عضلات وحرق دهون في نفس الوقت؟", answer: "نعم — لكن ببطء أكثر. يُسمى Body Recomposition. يعمل أفضل مع: المبتدئين (أول 6-12 شهر). أصحاب الدهون العالية (> 25% رجال / > 32% نساء). الشروط: بروتين عالي (2+ غ/كجم). عجز سعرات خفيف (−200 إلى −300). تمارين قوة مكثفة. نوم وتعافي كافٍ." },
    { question: "ما علاقة LBM بحساب السعرات؟", answer: "LBM أدق لحساب BMR (معدل الأيض الأساسي) من الوزن الإجمالي. معادلة Katch-McArdle: BMR = 370 + (21.6 × LBM بالكجم). الكتلة العضلية تحرق سعرات أكثر في الراحة — كل 1 كجم عضلات يحرق ~13 سعرة/يوم. لحساب سعراتك: حاسبة السعرات الحرارية." },
    { question: "ما هو الحد الطبيعي للعضلات (بدون منشطات)؟", answer: "حسب الأبحاث: FFMI ≤ 25 هو الحد الأعلى لمعظم الرجال طبيعياً. دراسة Kouri et al. (1995): فحصت 157 رياضياً — لم يتجاوز أي طبيعي FFMI 25. فوق 25 = مؤشر قوي على استخدام منشطات (ليس حتمياً لكن نادر جداً). النساء: الحد الطبيعي ≈ FFMI 21-22." },
    { question: "هل تقل الكتلة العضلية مع العمر؟", answer: "نعم — ظاهرة Sarcopenia (فقدان العضلات المرتبط بالعمر). يبدأ بعد سن 30: فقدان 3-8% من الكتلة العضلية كل 10 سنوات. بعد 60: يتسارع الفقدان. الحل: تمارين قوة مدى الحياة + بروتين كافٍ (كبار السن يحتاجون 1.2-1.6 غ/كجم — أكثر من الشباب)." },
    { question: "كم يجب أن تكون نسبة العضلات من وزن الجسم؟", answer: "يعتمد على الجنس والعمر. تقديرياً: رجال: 75-85% LBM (15-25% دهون). نساء: 68-80% LBM (20-32% دهون). رياضي: 85-90% LBM (رجال) / 78-86% LBM (نساء). المهم: ليست العضلات فقط — LBM يشمل العظام والأعضاء أيضاً." },
    { question: "ما الأدق — المعادلات أم نسبة الدهون المقاسة؟", answer: "نسبة الدهون المقاسة (DEXA/Calipers) أدق دائماً. المعادلات (Boer/James/Hume) تقديرية — دقتها ±3-5 كجم. إذا عندك نسبة دهون مقاسة: أدخلها في الحاسبة → ستحسب LBM مباشرة = الوزن × (1 − BF%). إذا لا: المعادلات تعطي تقديراً معقولاً." },
    { question: "هل LBM يتأثر بالماء؟", answer: "نعم — الماء يشكل 60-65% من LBM. تغييرات الماء (جفاف، كرياتين، صوديوم، كارب) تؤثر على LBM المقاس. كرياتين يزيد وزن الماء في العضلات 1-2 كجم. بعد تمرين شاق: قد تخسر 0.5-1.5 كجم ماء. لذلك: قس LBM في نفس الظروف (صباحاً، على الريق) للمقارنة الدقيقة. لحساب احتياجك من الماء: حاسبة احتياج الماء." },
];

export default function LeanBodyMassPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة الكتلة العضلية", item: `${SITE_URL}/ar/hisabat-kutla-adaliya` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة الكتلة العضلية (LBM)",
            url: `${SITE_URL}/ar/hisabat-kutla-adaliya`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسب الكتلة الخالية من الدهون بـ 3 معادلات + FFMI ونسبة الدهون",
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
            <Script id="schema-lbm-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة الكتلة العضلية</span>
            </nav>

            <h1 className="ar-page__title">💪 حاسبة الكتلة العضلية — LBM (2026)</h1>
            <p className="ar-page__subtitle">
                احسب كتلة جسمك الخالية من الدهون (Lean Body Mass) بـ 3 معادلات علمية (Boer 1984 / James 1976 / Hume 1966) أو من نسبة الدهون مباشرة. تشمل مؤشر FFMI (Fat-Free Mass Index)، تصنيف نسبة الدهون حسب الجنس (5 فئات)، ونصائح بناء العضلات وتقليل الدهون.
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <LeanBodyMassCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة الكتلة العضلية</h2>
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
                    <Link href="/ar/hisabat-kutlat-aljism" className="ar-related__card">
                        <span className="ar-related__icon">⚖️</span>
                        <span className="ar-related__name">حاسبة BMI</span>
                    </Link>
                    <Link href="/ar/hisabat-suarat-hararia" className="ar-related__card">
                        <span className="ar-related__icon">🔥</span>
                        <span className="ar-related__name">حاسبة السعرات الحرارية</span>
                    </Link>
                    <Link href="/ar/hisabat-shakl-aljism" className="ar-related__card">
                        <span className="ar-related__icon">📏</span>
                        <span className="ar-related__name">حاسبة شكل الجسم</span>
                    </Link>
                    <Link href="/ar/hisabat-karbohidrat" className="ar-related__card">
                        <span className="ar-related__icon">🍞</span>
                        <span className="ar-related__name">حاسبة الكربوهيدرات</span>
                    </Link>
                    <Link href="/ar/hisabat-ihtiyaj-alma" className="ar-related__card">
                        <span className="ar-related__icon">💧</span>
                        <span className="ar-related__name">حاسبة احتياج الماء</span>
                    </Link>
                    <Link href="/ar/hisabat-dawrat-alnawm" className="ar-related__card">
                        <span className="ar-related__icon">🌙</span>
                        <span className="ar-related__name">حاسبة دورة النوم</span>
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
    <h2 id="what-is-lbm">ما هي الكتلة الخالية من الدهون (LBM)؟</h2>
    <p>الكتلة الخالية من الدهون (Lean Body Mass — LBM) هي <strong>وزنك الإجمالي ناقص كل الدهون المخزنة</strong>. تشمل:</p>
    <ul>
        <li><strong>العضلات الهيكلية</strong> — الجزء الذي تبنيه بالتمرين</li>
        <li><strong>العظام</strong> — الهيكل العظمي</li>
        <li><strong>الأعضاء</strong> — قلب، كبد، كلى، رئتين</li>
        <li><strong>الدم</strong> + السوائل</li>
        <li><strong>الجلد</strong> + الأنسجة الضامة</li>
    </ul>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">📐</span>
        <div>
            <strong>المعادلة الأساسية:</strong> LBM = الوزن الإجمالي − كتلة الدهون<br/>
            <strong>أو:</strong> LBM = الوزن × (1 − نسبة الدهون ÷ 100)<br/>
            <strong>مثال:</strong> 80 كجم بنسبة دهون 20% → 80 × (1 − 0.20) = <strong>64 كجم LBM</strong>
        </div>
    </div>

    <h2 id="why-lbm-matters">لماذا LBM أهم من الوزن الإجمالي؟</h2>
    <p>الوزن وحده <strong>لا يخبرك بتركيب جسمك</strong>. مثالان بنفس الوزن:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المؤشر</th><th>شخص A (رياضي)</th><th>شخص B (غير نشط)</th></tr></thead>
            <tbody>
                <tr><td>الوزن</td><td>85 كجم</td><td>85 كجم</td></tr>
                <tr><td>LBM</td><td><strong>72 كجم</strong></td><td><strong>57 كجم</strong></td></tr>
                <tr><td>دهون</td><td>13 كجم (15%)</td><td>28 كجم (33%)</td></tr>
                <tr><td>BMI</td><td>27.8 (زيادة وزن!)</td><td>27.8 (نفسه!)</td></tr>
                <tr><td>الحقيقة</td><td>صحي جداً</td><td>يحتاج تغيير</td></tr>
            </tbody>
        </table>
    </div>
    <p>BMI يعاملهما بنفس الطريقة — LBM يكشف الفرق الحقيقي. لحساب BMI: <a href="/ar/hisabat-kutlat-aljism">حاسبة مؤشر كتلة الجسم</a>.</p>

    <h2 id="three-formulas">المعادلات الثلاث — Boer / James / Hume</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المعادلة</th><th>الرجال</th><th>النساء</th><th>الملاحظة</th></tr></thead>
            <tbody>
                <tr><td><strong>Boer (1984)</strong></td><td>0.407W + 0.267H − 19.2</td><td>0.252W + 0.473H − 48.3</td><td>✅ الأدق للاستخدام العام (BMI 35-40)</td></tr>
                <tr><td><strong>James (1976)</strong></td><td>1.1W − 128(W²/H²)</td><td>1.07W − 148(W²/H²)</td><td>⚠️ تقلل التقدير في السمنة المفرطة</td></tr>
                <tr><td><strong>Hume (1966)</strong></td><td>0.328W + 0.339H − 29.53</td><td>0.296W + 0.418H − 43.29</td><td>أنسب للأشخاص الأكبر حجماً</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>W</strong> = الوزن (كجم)، <strong>H</strong> = الطول (سم). الحاسبة تحسب الثلاث وتعرض المتوسط. إذا أدخلت نسبة دهون فعلية (من DEXA أو مقبض)، تُستخدم كأساس أدق.</p>

    <h2 id="body-fat-categories">نسبة الدهون الصحية — حسب الجنس</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة</th><th>♂ رجال</th><th>♀ نساء</th><th>الوصف</th></tr></thead>
            <tbody>
                <tr><td><strong>💪 دهون أساسية</strong></td><td>2-5%</td><td>10-13%</td><td>الحد الأدنى للحياة — خطير إذا استمر</td></tr>
                <tr><td><strong>🏃 رياضي</strong></td><td>6-13%</td><td>14-20%</td><td>لاعبو كمال أجسام، عدّائون، سبّاحون</td></tr>
                <tr><td><strong>✅ لياقة</strong></td><td>14-17%</td><td>21-24%</td><td>مظهر رياضي + صحة ممتازة</td></tr>
                <tr><td><strong>🟡 متوسط</strong></td><td>18-24%</td><td>25-31%</td><td>معظم الناس — مقبول صحياً</td></tr>
                <tr><td><strong>🔴 سمنة</strong></td><td>25%+</td><td>32%+</td><td>مخاطر صحية — يحتاج تعديل</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>لماذا النساء أعلى؟</strong> الهرمونات الأنثوية (إستروجين) + الوظائف الإنجابية تتطلب دهوناً أساسية أكثر. نزول المرأة تحت 13% يسبب اضطراب الدورة الشهرية وهشاشة عظام.</p>

    <h2 id="ffmi">مؤشر FFMI — المقياس الحقيقي للعضلية</h2>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">💪</span>
        <div>
            <strong>المعادلة:</strong> FFMI = LBM (كجم) ÷ الطول (م)²<br/>
            <strong>المعدّل:</strong> FFMI = FFMI + 6.3 × (1.8 − الطول)<br/>
            <strong>مثال:</strong> LBM 64 كجم، طول 1.75 م → 64 ÷ 3.0625 = 20.9 → معدّل: 20.9 + 6.3 × 0.05 = <strong>21.2</strong>
        </div>
    </div>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>FFMI</th><th>التفسير (رجال)</th></tr></thead>
            <tbody>
                <tr><td>< 18</td><td>أقل من المتوسط — بحاجة لبناء عضلات</td></tr>
                <tr><td>18 – 20</td><td>متوسط — الشخص العادي</td></tr>
                <tr><td>20 – 22</td><td>فوق المتوسط — تمرين منتظم</td></tr>
                <tr><td><strong>22 – 25</strong></td><td><strong>عضلي جداً — رياضي متقدم</strong></td></tr>
                <tr><td>> 25</td><td>نادر طبيعياً (Kouri et al., 1995) — يشير لمنشطات محتملة</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="measuring-bf">طرق قياس نسبة الدهون</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الطريقة</th><th>الدقة</th><th>التكلفة</th><th>التوفر</th></tr></thead>
            <tbody>
                <tr><td><strong>DEXA Scan</strong></td><td>±1.5% (الأدق)</td><td>مرتفعة (300-500 درهم)</td><td>مستشفيات + مراكز رياضية</td></tr>
                <tr><td><strong>Hydrostatic Weighing</strong></td><td>±2%</td><td>مرتفعة</td><td>نادر</td></tr>
                <tr><td><strong>Bod Pod</strong></td><td>±2%</td><td>مرتفعة</td><td>نادر</td></tr>
                <tr><td><strong>مقبض الدهون (Calipers)</strong></td><td>±3-4%</td><td>منخفضة (50 درهم المقبض)</td><td>صالات رياضية</td></tr>
                <tr><td><strong>ميزان BIA (ذكي)</strong></td><td>±4-5%</td><td>متوسطة (200-500 درهم)</td><td>متاح للشراء</td></tr>
                <tr><td><strong>Navy Method (محيط)</strong></td><td>±3%</td><td>صفر (شريط قياس)</td><td>أي مكان</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="build-muscle">كيف تبني كتلة عضلية؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>#</th><th>الأساس</th><th>التفاصيل</th></tr></thead>
            <tbody>
                <tr><td>1</td><td><strong>تمارين قوة</strong></td><td>3-5 مرات/أسبوع — تمارين مركبة (سكوات، ديدلفت، بنش، سحب)</td></tr>
                <tr><td>2</td><td><strong>بروتين عالي</strong></td><td>1.6-2.2 غ/كجم/يوم — احسبه بـ <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات</a></td></tr>
                <tr><td>3</td><td><strong>فائض سعرات</strong></td><td>+300-500 سعرة/يوم فوق TDEE</td></tr>
                <tr><td>4</td><td><strong>نوم 7-9 ساعات</strong></td><td>HGH يُفرز في النوم العميق — <a href="/ar/hisabat-dawrat-alnawm">حاسبة النوم</a></td></tr>
                <tr><td>5</td><td><strong>تدرج في الأثقال</strong></td><td>زد الوزن/التكرار تدريجياً (Progressive Overload)</td></tr>
                <tr><td>6</td><td><strong>كارب كافي</strong></td><td>الجليكوجين = وقود العضلات — <a href="/ar/hisabat-karbohidrat">حاسبة الكارب</a></td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="lose-fat">كيف تقلل الدهون مع الحفاظ على العضلات؟</h2>
    <ol>
        <li><strong>عجز سعرات معتدل:</strong> −500 سعرة/يوم (لا تنزل أكثر — تخسر عضلات)</li>
        <li><strong>بروتين مرتفع:</strong> 2+ غ/كجم — يحمي العضلات أثناء العجز</li>
        <li><strong>تمارين قوة:</strong> أهم من الكارديو أثناء التنشيف — تُرسل إشارة للجسم "لا تأكل العضلات"</li>
        <li><strong>كارديو معتدل:</strong> 2-3 جلسات/أسبوع (مشي سريع، سباحة)</li>
        <li><strong>نوم + ماء:</strong> الجفاف وقلة النوم يرفعان الكورتيزول = فقدان عضلات</li>
    </ol>

    <h2 id="sarcopenia">فقدان العضلات مع العمر (Sarcopenia)</h2>
    <p>بعد سن 30، تفقد <strong>3-8% من كتلتك العضلية كل 10 سنوات</strong>. بعد 60: يتسارع الفقدان:</p>
    <ul>
        <li>ضعف بدني + صعوبة الحركة</li>
        <li>زيادة خطر السقوط والكسور</li>
        <li>انخفاض الأيض = زيادة دهون أسهل</li>
    </ul>
    <p><strong>الحل:</strong> تمارين قوة مدى الحياة + بروتين 1.2-1.6 غ/كجم (كبار السن يحتاجون أكثر من الشباب). لمعرفة شكل جسمك: <a href="/ar/hisabat-shakl-aljism">حاسبة شكل الجسم</a>.</p>

    <h2 id="lbm-calories">LBM والسعرات — معادلة Katch-McArdle</h2>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">🔥</span>
        <div>
            <strong>BMR (Katch-McArdle):</strong> 370 + (21.6 × LBM بالكجم)<br/>
            <strong>مثال:</strong> LBM = 60 كجم → BMR = 370 + (21.6 × 60) = <strong>1,666 سعرة/يوم</strong><br/>
            هذا أدق من Mifflin-St Jeor لأنه يعتمد على الكتلة النشطة أيضياً.
        </div>
    </div>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات</strong> بناءً على معادلات Boer/James/Hume. الطريقة الأدق لقياس LBM هي DEXA Scan أو Hydrostatic Weighing. إذا أدخلت نسبة دهون فعلية مقاسة، ستكون النتيجة أدق بكثير.
    </p>
`;
