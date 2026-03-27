// Standalone page — /ar/hisabat-nisbat-duhun
// حاسبة نسبة الدهون في الجسم — Arabic Body Fat Calculator
// US Navy + BMI methods, ACE categories, FFMI, measurement guide

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import BodyFatCalculatorCore from "@/components/calculator/BodyFatCalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة نسبة الدهون في الجسم — Body Fat Calculator (2026)",
    description: "احسب نسبة دهون جسمك بطريقتين علميتين (US Navy + BMI) مع تصنيف ACE، كتلة الدهون والعضلات، FFMI. تشمل 6 طرق قياس (DEXA/Calipers/BIA)، جدول النسب حسب العمر والجنس، والمخاطر الصحية.",
    keywords: ["حاسبة دهون الجسم", "نسبة الدهون", "body fat calculator", "US Navy method", "BMI", "FFMI", "DEXA", "ACE body fat", "دهون صحية"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-nisbat-duhun` },
};

const FAQ_ITEMS = [
    { question: "ما هي نسبة الدهون في الجسم؟", answer: "نسبة الدهون = كتلة الدهون ÷ الوزن الإجمالي × 100. تشمل الدهون الأساسية (للأعضاء والهرمونات) والدهون المخزنة (الطاقة الاحتياطية). المعادلة: إذا وزنك 80 كجم ودهونك 16 كجم → نسبة الدهون = 20%." },
    { question: "ما الفرق بين طريقة Navy و طريقة BMI؟", answer: "Navy Method: تستخدم محيط الخصر والرقبة (والأرداف للنساء) — أدق لأنها تقيس توزيع الدهون الفعلي (±3%). BMI Method: تستخدم الوزن والطول والعمر فقط — أبسط لكن أقل دقة (±4-5%) لأنها لا تفرق بين العضلات والدهون. الحاسبة تعرض كلتا النتيجتين + المتوسط." },
    { question: "كم نسبة الدهون الطبيعية للرجال؟", answer: "حسب ACE: أساسية: 2-5% (خطير إذا أقل). رياضي: 6-13%. لياقة: 14-17%. متوسط: 18-24%. سمنة: 25%+. حسب العمر (ACSM): 20-39 سنة: 8-19%. 40-59 سنة: 11-21%. 60-79 سنة: 13-24%." },
    { question: "كم نسبة الدهون الطبيعية للنساء؟", answer: "حسب ACE: أساسية: 10-13%. رياضية: 14-20%. لياقة: 21-24%. متوسط: 25-31%. سمنة: 32%+. النساء يحتجن نسبة أعلى بيولوجياً — الإستروجين والوظائف الإنجابية. نزول المرأة تحت 13% يسبب انقطاع الدورة وهشاشة عظام." },
    { question: "كيف أقيس محيط الخصر بشكل صحيح؟", answer: "1) قفي مستقيمة، قدمان متباعدتان بعرض الكتف. 2) تنفسي طبيعي — لا تشفطي بطنك. 3) ضعي شريط القياس عند السرة (أضيق نقطة فوق عظم الورك). 4) الشريط أفقي ومستوٍ — لا تشديه بقوة. 5) اقرئي القياس عند نهاية الزفير الطبيعي." },
    { question: "ما هي طريقة US Navy بالتفصيل؟", answer: "معادلة الرجال: BF% = 86.010 × log10(خصر − رقبة) − 70.041 × log10(الطول) + 36.76. معادلة النساء: BF% = 163.205 × log10(خصر + أرداف − رقبة) − 97.684 × log10(الطول) + 78.387. القياسات بالبوصة. دقة ±3% مقارنة بـ DEXA. طُوّرت للبحرية الأمريكية لتقييم لياقة الجنود ميدانياً." },
    { question: "ما هو DEXA Scan؟", answer: "DEXA (Dual-Energy X-ray Absorptiometry) = الطريقة الأدق (±1.5%). تستخدم أشعة سينية ثنائية الطاقة لقياس: الدهون، الكتلة العضلية، كثافة العظام — بالتفصيل لكل منطقة بالجسم. التكلفة: 300-500 درهم تقريباً. المدة: 10-15 دقيقة. متوفر في مستشفيات ومراكز رياضية كبيرة." },
    { question: "هل الميزان الذكي يقيس الدهون بدقة؟", answer: "الميزان الذكي (BIA — Bioelectrical Impedance Analysis) يمرر تياراً كهربائياً ضعيفاً ويقيس المقاومة. الدقة: ±4-5% — الأقل دقة. يتأثر بـ: الماء في الجسم (بعد التمرين/الأكل)، الجفاف، الدورة الشهرية. نصيحة: استخدمه لتتبع الاتجاه (هل تنزل أم ترتفع؟) وليس للقيمة المطلقة. قس في نفس الظروف: صباحاً، على الريق، بعد التبول." },
    { question: "ما الفرق بين الدهون الحشوية وتحت الجلد؟", answer: "تحت الجلد (Subcutaneous): الطبقة التي تقرصها — 80-90% من الدهون. أقل خطورة صحياً. حشوية (Visceral): تحيط بالأعضاء الداخلية (كبد، أمعاء). خطيرة جداً — ترتبط بـ: مقاومة إنسولين، سكري نوع 2، أمراض قلب. المؤشر: محيط خصر > 102 سم (رجال) أو > 88 سم (نساء) = خطر مرتفع." },
    { question: "كيف أخفض نسبة الدهون؟", answer: "1) عجز سعرات 500/يوم (حاسبة السعرات). 2) بروتين عالي: 1.6-2.2 غ/كجم (يحمي العضلات). 3) تمارين قوة 3-4 مرات/أسبوع (تحافظ على العضلات). 4) كارديو 2-3 جلسات (مشي سريع، سباحة). 5) نوم 7-9 ساعات (حاسبة النوم). 6) ماء كافٍ (حاسبة الماء). المعدل الآمن: 0.5-1% نسبة دهون/أسبوع." },
    { question: "هل يمكن تقليل الدهون في منطقة معينة (تنحيف موضعي)؟", answer: "لا — Spot Reduction خرافة علمية. لا يمكنك اختيار مكان حرق الدهون. تمارين البطن تقوّي العضلات لكن لا تحرق دهون البطن تحديداً. الحل: عجز سعرات شامل + تمارين كاملة الجسم. الجسم يخفض الدهون بترتيب جيني — غالباً آخر ما تخسره أول ما اكتسبته." },
    { question: "ما هو FFMI وعلاقته بالدهون؟", answer: "FFMI (Fat-Free Mass Index) = الكتلة الخالية من الدهون ÷ الطول(م)². يقيس العضلية نسبة للطول — أفضل من BMI للرياضيين. تفسير (رجال): < 18 = تحت المتوسط. 18-20 = متوسط. 20-22 = فوق المتوسط. 22-25 = عضلي جداً. > 25 = نادر طبيعياً. لحساب تفصيلي: حاسبة الكتلة العضلية (LBM)." },
    { question: "ما المخاطر الصحية لنسبة دهون مرتفعة؟", answer: "رجال > 25% / نساء > 32%: مقاومة إنسولين + سكري نوع 2. أمراض قلب (ضغط، كولسترول). التهابات مزمنة. آلام مفاصل. انقطاع تنفس أثناء النوم. بعض أنواع السرطان. في الإمارات: 22.4% سمنة + 59.1% قلة نشاط (MOHAP 2024). في السعودية: 24% سمنة بالغين." },
    { question: "ما المخاطر الصحية لنسبة دهون منخفضة جداً؟", answer: "رجال < 5% / نساء < 13%: اضطراب هرمونات (انقطاع الدورة عند النساء). ضعف المناعة. هشاشة عظام. فقدان طاقة مزمن. مشاكل خصوبة. الرياضيون يصلون مؤقتاً لنسب منخفضة (منافسات كمال أجسام) لكن لا يبقون عليها — ليست مستدامة." },
    { question: "كم يستغرق خفض نسبة الدهون 5%؟", answer: "المعدل الآمن: 0.5-1% نسبة دهون/أسبوع. من 25% → 20%: حوالي 5-10 أسابيع. من 20% → 15%: أصعب — 8-12 أسبوع. تحت 15%: يتباطأ — يحتاج صبر ودقة. العوامل: العمر، الجينات، الالتزام، النوم، التوتر. لا تتسرعي — خسارة سريعة = خسارة عضلات." },
];

export default function BodyFatCalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة نسبة الدهون", item: `${SITE_URL}/ar/hisabat-nisbat-duhun` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة نسبة الدهون في الجسم",
            url: `${SITE_URL}/ar/hisabat-nisbat-duhun`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسب نسبة الدهون بطريقتين (Navy + BMI) مع تصنيف ACE وتحليل تركيب الجسم",
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
            <Script id="schema-bodyfat-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة نسبة الدهون</span>
            </nav>

            <h1 className="ar-page__title">📊 حاسبة نسبة الدهون في الجسم (2026)</h1>
            <p className="ar-page__subtitle">
                احسب نسبة دهون جسمك بطريقتين علميتين (US Navy Method + BMI Method) مع تصنيف ACE (5 فئات)، كتلة الدهون والعضلات، ومؤشر FFMI. تشمل مقارنة 6 طرق قياس (DEXA/Calipers/BIA)، جدول النسب الصحية حسب العمر والجنس (ACSM)، الدهون الحشوية ومخاطرها، والخطة العملية لخفض الدهون.
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <BodyFatCalculatorCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة نسبة الدهون</h2>
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
                    <Link href="/ar/hisabat-kutla-adaliya" className="ar-related__card">
                        <span className="ar-related__icon">💪</span>
                        <span className="ar-related__name">حاسبة الكتلة العضلية (LBM)</span>
                    </Link>
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
                    <Link href="/ar/hisabat-ihtiyaj-alma" className="ar-related__card">
                        <span className="ar-related__icon">💧</span>
                        <span className="ar-related__name">حاسبة احتياج الماء</span>
                    </Link>
                    <Link href="/ar/hisabat-karbohidrat" className="ar-related__card">
                        <span className="ar-related__icon">🍞</span>
                        <span className="ar-related__name">حاسبة الكربوهيدرات</span>
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
    <h2 id="what-is-body-fat">ما هي نسبة الدهون في الجسم؟</h2>
    <p>نسبة الدهون = <strong>كتلة الدهون ÷ الوزن الإجمالي × 100</strong>. الجسم يحتوي نوعين من الدهون:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>النوع</th><th>الموقع</th><th>الوظيفة</th><th>النسبة</th></tr></thead>
            <tbody>
                <tr><td><strong>دهون أساسية</strong></td><td>حول الأعضاء، النخاع، الأعصاب</td><td>حماية الأعضاء، هرمونات، عزل حراري</td><td>♂ 2-5% · ♀ 10-13%</td></tr>
                <tr><td><strong>دهون مخزنة</strong></td><td>تحت الجلد + حول الأحشاء</td><td>مخزون طاقة احتياطي</td><td>الباقي</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">📊</span>
        <div>
            <strong>مثال:</strong> رجل وزنه 80 كجم، نسبة دهون 20%<br/>
            كتلة الدهون = 80 × 0.20 = <strong>16 كجم</strong><br/>
            كتلة خالية (LBM) = 80 − 16 = <strong>64 كجم</strong> (عضلات + عظام + أعضاء)
        </div>
    </div>

    <h2 id="bf-vs-bmi">نسبة الدهون مقابل BMI — لماذا الدهون أدق؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المقارنة</th><th>BMI</th><th>نسبة الدهون</th></tr></thead>
            <tbody>
                <tr><td>المدخلات</td><td>وزن + طول فقط</td><td>قياسات جسدية أو أجهزة</td></tr>
                <tr><td>يفرق بين عضل ودهون؟</td><td>❌ لا</td><td>✅ نعم</td></tr>
                <tr><td>لاعب كمال أجسام 100 كجم</td><td>"سمنة" (BMI > 30) — خطأ!</td><td>"رياضي" (BF 10%) — صحيح</td></tr>
                <tr><td>سيدة نحيفة ضعيفة العضلات</td><td>"طبيعي" (BMI 22)</td><td>"دهون مرتفعة" (BF 33%) — خطر مخفي</td></tr>
                <tr><td>الاستخدام</td><td>فحص سريع لعامة السكان</td><td>تقييم دقيق للأفراد</td></tr>
            </tbody>
        </table>
    </div>
    <p>Harvard School of Public Health: BMI أداة فحص مفيدة لكنها <strong>لا تكفي وحدها</strong>. نسبة الدهون + محيط الخصر أفضل لتقييم المخاطر الصحية. لحساب BMI: <a href="/ar/hisabat-kutlat-aljism">حاسبة مؤشر كتلة الجسم</a>.</p>

    <h2 id="navy-method">طريقة البحرية الأمريكية (US Navy Method)</h2>
    <p>طُوّرت لتقييم لياقة الجنود ميدانياً بدون أجهزة — تحتاج <strong>شريط قياس فقط</strong>:</p>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">🎖️</span>
        <div>
            <strong>الرجال:</strong> BF% = 86.010 × log₁₀(خصر − رقبة) − 70.041 × log₁₀(الطول) + 36.76<br/>
            <strong>النساء:</strong> BF% = 163.205 × log₁₀(خصر + أرداف − رقبة) − 97.684 × log₁₀(الطول) − 78.387<br/>
            <strong>الدقة:</strong> ±3% مقارنة بـ DEXA<br/>
            <em>القياسات بالبوصة (الحاسبة تحول من سم تلقائياً)</em>
        </div>
    </div>
    <h3>كيف تأخذ القياسات</h3>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>القياس</th><th>المكان</th><th>النصيحة</th></tr></thead>
            <tbody>
                <tr><td><strong>الخصر</strong></td><td>عند السرة — أضيق نقطة فوق عظم الورك</td><td>لا تشفط بطنك — تنفس طبيعي</td></tr>
                <tr><td><strong>الرقبة</strong></td><td>تحت تفاحة آدم مباشرة</td><td>الشريط أفقي بدون ضغط</td></tr>
                <tr><td><strong>الأرداف (نساء)</strong></td><td>أعرض نقطة في الأرداف</td><td>قف مستقيمة، قدمين متقاربتين</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="measurement-methods">6 طرق لقياس نسبة الدهون</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الطريقة</th><th>الدقة</th><th>التكلفة</th><th>التوفر</th><th>المبدأ</th></tr></thead>
            <tbody>
                <tr><td><strong>DEXA Scan</strong></td><td>±1.5%</td><td>300-500 درهم</td><td>مستشفيات</td><td>أشعة سينية ثنائية الطاقة</td></tr>
                <tr><td><strong>Hydrostatic</strong></td><td>±2%</td><td>مرتفع</td><td>نادر</td><td>وزن تحت الماء</td></tr>
                <tr><td><strong>Bod Pod</strong></td><td>±2%</td><td>مرتفع</td><td>نادر</td><td>إزاحة الهواء</td></tr>
                <tr><td><strong>Calipers (مقبض)</strong></td><td>±3-4%</td><td>50 درهم</td><td>صالات رياضية</td><td>قياس ثنيات الجلد (Jackson-Pollock)</td></tr>
                <tr><td><strong>US Navy (محيطات)</strong></td><td>±3%</td><td>صفر</td><td>أي مكان ✅</td><td>محيط الخصر/الرقبة/الأرداف</td></tr>
                <tr><td><strong>ميزان BIA</strong></td><td>±4-5%</td><td>200-500 درهم</td><td>منزلي</td><td>مقاومة التيار الكهربائي</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="healthy-bf">نسبة الدهون الصحية — ACE + ACSM</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة (ACE)</th><th>♂ رجال</th><th>♀ نساء</th><th>الوصف</th></tr></thead>
            <tbody>
                <tr><td><strong>💪 أساسية</strong></td><td>2-5%</td><td>10-13%</td><td>الحد الأدنى للحياة — ⚠️ خطير إذا استمر</td></tr>
                <tr><td><strong>🏃 رياضي</strong></td><td>6-13%</td><td>14-20%</td><td>كمال أجسام، عدّائون، رياضيون محترفون</td></tr>
                <tr><td><strong>✅ لياقة</strong></td><td>14-17%</td><td>21-24%</td><td>مظهر رياضي + صحة ممتازة — الهدف المثالي</td></tr>
                <tr><td><strong>🟡 متوسط</strong></td><td>18-24%</td><td>25-31%</td><td>معظم الناس — مقبول صحياً</td></tr>
                <tr><td><strong>🔴 سمنة</strong></td><td>25%+</td><td>32%+</td><td>مخاطر صحية — يحتاج تعديل</td></tr>
            </tbody>
        </table>
    </div>
    <h3>حسب العمر (ACSM)</h3>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>العمر</th><th>♂ رجال</th><th>♀ نساء</th></tr></thead>
            <tbody>
                <tr><td>20-39 سنة</td><td>8-19%</td><td>21-32%</td></tr>
                <tr><td>40-59 سنة</td><td>11-21%</td><td>23-33%</td></tr>
                <tr><td>60-79 سنة</td><td>13-24%</td><td>24-35%</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="visceral-fat">الدهون الحشوية — الخطر المخفي</h2>
    <p>الدهون الحشوية (Visceral Fat) تحيط بالأعضاء الداخلية ولا تُرى بالعين — وهي <strong>الأخطر صحياً</strong>:</p>
    <ul>
        <li>ترتبط بـ: مقاومة إنسولين، سكري نوع 2، أمراض القلب، ارتفاع ضغط الدم</li>
        <li><strong>مؤشر الخطر:</strong> محيط خصر > 102 سم (رجال) أو > 88 سم (نساء)</li>
        <li>DEXA يقيس الدهون الحشوية مباشرة</li>
        <li>الخبر الجيد: الدهون الحشوية <strong>تستجيب أولاً</strong> للعجز الغذائي والتمارين</li>
    </ul>

    <h2 id="reduce-bf">خطة خفض الدهون — 6 خطوات</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>#</th><th>الخطوة</th><th>التفاصيل</th></tr></thead>
            <tbody>
                <tr><td>1</td><td><strong>عجز سعرات</strong></td><td>−500 سعرة/يوم = ~0.5 كجم/أسبوع — <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات</a></td></tr>
                <tr><td>2</td><td><strong>بروتين عالي</strong></td><td>1.6-2.2 غ/كجم — يحمي العضلات أثناء العجز</td></tr>
                <tr><td>3</td><td><strong>تمارين قوة</strong></td><td>3-4 مرات/أسبوع (سكوات، ديدلفت، بنش) — أهم من الكارديو</td></tr>
                <tr><td>4</td><td><strong>كارديو معتدل</strong></td><td>2-3 جلسات (مشي سريع 30-45 دقيقة أو HIIT 20 دقيقة)</td></tr>
                <tr><td>5</td><td><strong>نوم 7-9 ساعات</strong></td><td>قلة النوم ترفع الكورتيزول + الجريلين (هرمون الجوع) — <a href="/ar/hisabat-dawrat-alnawm">حاسبة النوم</a></td></tr>
                <tr><td>6</td><td><strong>ماء كافٍ</strong></td><td>الجفاف يبطئ الأيض — <a href="/ar/hisabat-ihtiyaj-alma">حاسبة احتياج الماء</a></td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="spot-reduction">هل يمكن تنحيف منطقة معينة فقط؟</h2>
    <p><strong>لا — خرافة علمية.</strong> لا يمكنك اختيار مكان حرق الدهون. تمارين البطن تقوّي العضلات لكن لا تحرق دهون البطن تحديداً. الجسم يخفض الدهون بترتيب جيني — غالباً آخر ما تخسره أول ما اكتسبته. الحل: عجز سعرات شامل + تمارين كاملة الجسم.</p>

    <h2 id="uae-obesity">السمنة في المنطقة العربية — أرقام مقلقة</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الدولة</th><th>نسبة السمنة (بالغين)</th><th>المصدر</th></tr></thead>
            <tbody>
                <tr><td>🇦🇪 الإمارات</td><td>22.4%</td><td>MOHAP 2024</td></tr>
                <tr><td>🇸🇦 السعودية</td><td>24%</td><td>WHO/FAO</td></tr>
                <tr><td>🇰🇼 الكويت</td><td>37%</td><td>WHO 2023</td></tr>
                <tr><td>🇶🇦 قطر</td><td>33%</td><td>WHO 2023</td></tr>
                <tr><td>🇪🇬 مصر</td><td>32%</td><td>WHO 2023</td></tr>
            </tbody>
        </table>
    </div>
    <p>الكويت ومصر وقطر من أعلى معدلات السمنة عالمياً. السبب: تغيّر نمط الغذاء + قلة النشاط + حرارة المناخ. لمعرفة شكل جسمك وتوزيع الدهون: <a href="/ar/hisabat-shakl-aljism">حاسبة شكل الجسم</a>.</p>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات</strong> بناءً على معادلات US Navy و BMI. الطريقة الأدق لقياس نسبة الدهون هي DEXA Scan. لا تُستخدم كبديل لتقييم طبي — استشر أخصائي تغذية أو طبيب لخطة شخصية.
    </p>
`;
