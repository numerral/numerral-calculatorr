// Standalone page — /ar/hisabat-dawra-shahriya
// حاسبة الدورة الشهرية — Arabic Period/Menstrual Cycle Calculator
// Ovulation, fertile window, PMS, cycle phases, PCOS, pregnancy planning

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import PeriodCalculatorCore from "@/components/calculator/PeriodCalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة الدورة الشهرية — Period Calculator (2026)",
    description: "احسبي موعد الدورة الشهرية القادمة، يوم التبويض، ونافذة الخصوبة لعدة أشهر مقدماً. تشمل مراحل الدورة الأربع (حيض، جرابية، تبويض، أصفرية)، أعراض PMS، تكيس المبايض (PCOS)، التخطيط للحمل، والتغذية المناسبة.",
    keywords: ["حاسبة الدورة الشهرية", "حساب الدورة", "period calculator", "أيام التبويض", "نافذة الخصوبة", "ovulation", "PMS", "تكيس المبايض", "PCOS", "الدورة الشهرية"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-dawra-shahriya` },
};

const FAQ_ITEMS = [
    { question: "ما هي الدورة الشهرية وكم تستغرق؟", answer: "الدورة الشهرية هي التغييرات الهرمونية الشهرية التي يمر بها جسم المرأة استعداداً للحمل. تبدأ من أول يوم نزيف وتنتهي قبل يوم النزيف التالي. المتوسط: 28 يوماً — لكن 21-35 يوماً طبيعي. فقط 13% من الدورات تكون 28 يوماً بالضبط — المتوسط الفعلي 29.3 يوم." },
    { question: "متى يحدث التبويض؟", answer: "التبويض يحدث عادة قبل 14 يوماً من الدورة القادمة (وليس بعد 14 يوماً من بدايتها). في دورة 28 يوم: التبويض ≈ يوم 14. في دورة 30 يوم: يوم 16. في دورة 26 يوم: يوم 12. البويضة تعيش 12-24 ساعة فقط بعد الإطلاق." },
    { question: "ما هي نافذة الخصوبة؟", answer: "نافذة الخصوبة هي الأيام التي يمكن فيها حدوث حمل. تمتد 6 أيام: 5 أيام قبل التبويض + يوم التبويض نفسه. السبب: الحيوانات المنوية تعيش في الجسم حتى 5 أيام، بينما البويضة تعيش 12-24 ساعة. أعلى فرصة: يوم التبويض واليومان قبله." },
    { question: "ما هي أعراض التبويض؟", answer: "1) ألم خفيف في جانب البطن (Mittelschmerz) — جانب المبيض الذي أطلق البويضة. 2) زيادة الإفرازات المهبلية (شفافة ومطاطية كبياض البيض). 3) ارتفاع طفيف في درجة حرارة الجسم (0.2-0.5°م). 4) زيادة الرغبة الجنسية. 5) حساسية خفيفة في الثدي." },
    { question: "ما هو PMS وما أعراضه؟", answer: "PMS (متلازمة ما قبل الحيض) — أعراض تحدث 7-10 أيام قبل الدورة بسبب انخفاض الإستروجين والبروجسترون. الأعراض: تقلبات مزاجية، انتفاخ، حساسية الثدي، رغبة في السكريات، أرق، صداع، تعب، قلق. تصيب 75% من النساء بدرجات متفاوتة." },
    { question: "ما الفرق بين المرحلة الجرابية والأصفرية؟", answer: "الجرابية (Follicular): من يوم 1 حتى التبويض. الجسم ينمّي بويضة — إستروجين يرتفع — طاقة ومزاج يتحسنان. الأصفرية (Luteal): من التبويض حتى الدورة القادمة. بروجسترون يرتفع — يجهز بطانة الرحم. إذا لم يحدث حمل → الهرمونات تنخفض → PMS → الحيض. طولها ثابت تقريباً: 12-14 يوم." },
    { question: "متى تكون الدورة غير منتظمة؟", answer: "الدورة غير منتظمة إذا: أقصر من 21 يوم أو أطول من 35 يوم. تختلف أكثر من 7-9 أيام بين الدورات. تغيب 3 أشهر متتالية (بدون حمل). الأسباب: تكيس المبايض (PCOS)، التوتر الشديد، فقدان/زيادة وزن سريعة، تمارين مكثفة، اضطرابات الغدة الدرقية، بداية البلوغ أو ما قبل انقطاع الطمث." },
    { question: "ما هو تكيس المبايض (PCOS)؟", answer: "PCOS (متلازمة تكيس المبايض) — اضطراب هرموني يصيب 8-13% من النساء. الأعراض: دورات غير منتظمة أو غائبة، أكياس صغيرة على المبايض، حب شباب، زيادة شعر الوجه/الجسم، صعوبة الحمل. الأسباب: مقاومة إنسولين + ارتفاع الأندروجينات. العلاج: تعديل نمط الحياة (وزن صحي، رياضة) + أدوية حسب الطبيب." },
    { question: "كيف أخطط للحمل باستخدام الحاسبة؟", answer: "1) تتبعي دورتك 3 أشهر لمعرفة متوسط طولها. 2) استخدمي الحاسبة لتحديد نافذة الخصوبة. 3) العلاقة الزوجية كل يوم أو يومين خلال نافذة الخصوبة (5 أيام قبل التبويض + يومه). 4) حمض الفوليك (400 ميكروغرام/يوم) قبل الحمل بـ 3 أشهر. 5) إذا لم يحدث حمل بعد 12 شهر محاولة (6 أشهر إذا فوق 35 سنة): استشيري طبيب." },
    { question: "هل يمكن حدوث حمل أثناء الحيض؟", answer: "نادر — لكن ممكن. إذا كانت الدورة قصيرة (21-22 يوم) والتبويض مبكر (يوم 7-8)، والحيوانات المنوية تعيش 5 أيام → قد يحدث إخصاب. أيضاً: بعض النساء يخلطن بين نزيف التبويض والحيض. القاعدة: لا يوجد وقت 'آمن' 100% بدون منع." },
    { question: "ما هي كمية الدم الطبيعية أثناء الحيض؟", answer: "الكمية الطبيعية: 30-80 مل خلال كامل الحيض (3-7 أيام). هذا يعادل 2-5 ملاعق طعام تقريباً. غزير (Menorrhagia) إذا: تغييرين الفوطة/التامبون كل ساعة. حيض أطول من 7 أيام. تجلطات كبيرة (> 2.5 سم). الأنيميا ناتجة عن النزيف. راجعي طبيبك." },
    { question: "هل التمارين الرياضية تؤثر على الدورة؟", answer: "تمارين معتدلة: مفيدة — تقلل تقلصات PMS والألم. تمارين مكثفة جداً: قد تسبب انقطاع الدورة (Amenorrhea) لأنها تخفض دهون الجسم والإستروجين. النصيحة: استمري في الرياضة أثناء الحيض (مشي، يوغا، سباحة). تجنبي التمارين العنيفة إذا كان الألم شديداً." },
    { question: "ما هي التغذية المناسبة أثناء الدورة؟", answer: "قبل الدورة (PMS): مغنيسيوم (موز، لوز، شوكولاتة داكنة). أوميغا-3 (سمك، جوز). تقليل ملح وكافيين. أثناء الحيض: حديد (لحم أحمر، سبانخ، عدس) لتعويض الفقد. فيتامين C (يساعد امتصاص الحديد). ماء كافٍ (8-10 أكواب). بعد الحيض: بروتين + حديد لإعادة بناء المخزون. لحساب سعراتك: حاسبة السعرات الحرارية." },
    { question: "متى تبدأ الدورة الشهرية عند البنات؟", answer: "المتوسط: 12 سنة (النطاق الطبيعي: 10-16 سنة). تبدأ عادة بعد 2-3 سنوات من بداية نمو الثدي. أول سنتين: الدورة غالباً غير منتظمة — طبيعي. إذا لم تبدأ بعمر 16: استشيري طبيب. العوامل المؤثرة: الوراثة، التغذية، الوزن، النشاط البدني." },
    { question: "ما هي علامات اقتراب انقطاع الطمث؟", answer: "يحدث عادة بين 45-55 سنة (المتوسط: 51). فترة ما قبل الانقطاع (Perimenopause): 4-8 سنوات قبله. العلامات: دورات غير منتظمة (أقصر/أطول/غائبة)، هبات ساخنة، تعرق ليلي، جفاف مهبلي، تقلبات مزاجية، اضطراب نوم. انقطاع رسمي: 12 شهر متتالي بدون دورة." },
];

export default function PeriodCalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة الدورة الشهرية", item: `${SITE_URL}/ar/hisabat-dawra-shahriya` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة الدورة الشهرية",
            url: `${SITE_URL}/ar/hisabat-dawra-shahriya`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسبي الدورة القادمة، التبويض، ونافذة الخصوبة لعدة أشهر مقدماً",
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
            <Script id="schema-period-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة الدورة الشهرية</span>
            </nav>

            <h1 className="ar-page__title">🩸 حاسبة الدورة الشهرية (2026)</h1>
            <p className="ar-page__subtitle">
                احسبي موعد الدورة الشهرية القادمة، يوم التبويض، ونافذة الخصوبة لعدة أشهر مقدماً. تعتمد على طول دورتك ومدة الحيض — مع شرح مراحل الدورة الأربع (حيض، جرابية، تبويض، أصفرية)، أعراض PMS، التخطيط للحمل، التغذية المناسبة، ومعلومات عن تكيس المبايض (PCOS).
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <PeriodCalculatorCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة الدورة الشهرية</h2>
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
                    <Link href="/ar/hisabat-kutlat-aljism" className="ar-related__card">
                        <span className="ar-related__icon">⚖️</span>
                        <span className="ar-related__name">حاسبة BMI</span>
                    </Link>
                    <Link href="/ar/hisabat-ihtiyaj-alma" className="ar-related__card">
                        <span className="ar-related__icon">💧</span>
                        <span className="ar-related__name">حاسبة احتياج الماء</span>
                    </Link>
                    <Link href="/ar/hisabat-dawrat-alnawm" className="ar-related__card">
                        <span className="ar-related__icon">🌙</span>
                        <span className="ar-related__name">حاسبة دورة النوم</span>
                    </Link>
                    <Link href="/ar/hisabat-kutla-adaliya" className="ar-related__card">
                        <span className="ar-related__icon">💪</span>
                        <span className="ar-related__name">حاسبة الكتلة العضلية</span>
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
    <h2 id="what-is-menstrual-cycle">ما هي الدورة الشهرية؟</h2>
    <p>الدورة الشهرية هي <strong>سلسلة من التغييرات الهرمونية الشهرية</strong> التي يمر بها جسم المرأة استعداداً لاحتمال الحمل. تبدأ من <strong>أول يوم نزيف</strong> (الحيض) وتنتهي قبل يوم النزيف التالي.</p>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">📊</span>
        <div>
            <strong>المتوسط:</strong> 28 يوماً — لكن 21-35 يوماً طبيعي تماماً<br/>
            <strong>حقيقة:</strong> فقط 13% من الدورات = 28 يوماً بالضبط (Healthline). المتوسط الفعلي ≈ 29.3 يوم<br/>
            <strong>مدة الحيض:</strong> 3-7 أيام في المتوسط
        </div>
    </div>

    <h2 id="four-phases">مراحل الدورة الشهرية الأربع</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المرحلة</th><th>الأيام (دورة 28)</th><th>الهرمونات</th><th>ماذا يحدث</th></tr></thead>
            <tbody>
                <tr><td><strong>🩸 الحيض</strong></td><td>يوم 1-5</td><td>إستروجين + بروجسترون ↓↓</td><td>بطانة الرحم تنسلخ — نزيف. أقل طاقة.</td></tr>
                <tr><td><strong>🔵 الجرابية (Follicular)</strong></td><td>يوم 1-13</td><td>إستروجين ↑↑ تدريجياً</td><td>الجسم ينمّي بويضة في المبيض. الطاقة والمزاج يتحسنان.</td></tr>
                <tr><td><strong>🥚 التبويض (Ovulation)</strong></td><td>يوم 14 تقريباً</td><td>LH يرتفع بشكل حاد</td><td>البويضة تُطلق. أعلى خصوبة. 12-24 ساعة فقط.</td></tr>
                <tr><td><strong>🟡 الأصفرية (Luteal)</strong></td><td>يوم 15-28</td><td>بروجسترون ↑↑ ثم ↓↓</td><td>الرحم يستعد. إذا لا حمل → PMS → الدورة القادمة.</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>ملاحظة مهمة:</strong> المرحلة الأصفرية (Luteal) ثابتة نسبياً عند <strong>12-14 يوم</strong> لمعظم النساء. المرحلة الجرابية هي التي تتغير وتسبب اختلاف طول الدورة. لذلك: التبويض = طول الدورة − 14 (وليس بالضرورة يوم 14).</p>

    <h2 id="ovulation">التبويض — كيف تحسبينه</h2>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">🥚</span>
        <div>
            <strong>معادلة التبويض:</strong> يوم التبويض = طول الدورة − 14<br/>
            <strong>مثال:</strong> دورة 30 يوم → التبويض يوم 16. دورة 26 يوم → يوم 12<br/>
            <strong>البويضة تعيش:</strong> 12-24 ساعة فقط بعد الإطلاق
        </div>
    </div>
    <h3>علامات التبويض</h3>
    <ul>
        <li><strong>ألم Mittelschmerz:</strong> وخز خفيف في جانب البطن السفلي (جانب المبيض الذي أطلق البويضة)</li>
        <li><strong>إفرازات:</strong> تصبح شفافة ومطاطية كبياض البيض (Cervical Mucus)</li>
        <li><strong>حرارة:</strong> ارتفاع طفيف 0.2-0.5°م (BBT — Basal Body Temperature)</li>
        <li><strong>اختبار LH:</strong> شرائط متوفرة في الصيدليات — تكشف ارتفاع هرمون LH قبل التبويض بـ 24-36 ساعة</li>
    </ul>

    <h2 id="fertile-window">نافذة الخصوبة — التخطيط للحمل</h2>
    <p>نافذة الخصوبة = <strong>6 أيام</strong>: 5 أيام قبل التبويض + يوم التبويض نفسه.</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>اليوم نسبة للتبويض</th><th>فرصة الحمل</th></tr></thead>
            <tbody>
                <tr><td>5 أيام قبل</td><td>~4%</td></tr>
                <tr><td>4 أيام قبل</td><td>~8%</td></tr>
                <tr><td>3 أيام قبل</td><td>~15%</td></tr>
                <tr><td>يومان قبل</td><td>~25%</td></tr>
                <tr><td><strong>يوم قبل التبويض</strong></td><td><strong>~30% (الأعلى)</strong></td></tr>
                <tr><td><strong>يوم التبويض</strong></td><td><strong>~25%</strong></td></tr>
                <tr><td>يوم بعد التبويض</td><td>~0% (البويضة ماتت)</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>نصيحة للتخطيط:</strong> العلاقة الزوجية كل يوم أو يومين خلال نافذة الخصوبة تعطي أفضل فرصة. حمض الفوليك (400 ميكروغرام/يوم) قبل الحمل بـ 3 أشهر يقلل تشوهات الأنبوب العصبي بنسبة 70%.</p>

    <h2 id="pms">متلازمة ما قبل الحيض (PMS)</h2>
    <p>PMS تصيب <strong>75% من النساء</strong> بدرجات متفاوتة، وتحدث 7-10 أيام قبل الدورة بسبب انخفاض الهرمونات:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>النوع</th><th>الأعراض</th></tr></thead>
            <tbody>
                <tr><td><strong>جسدية</strong></td><td>انتفاخ، حساسية الثدي، صداع، تعب، آلام عضلية</td></tr>
                <tr><td><strong>نفسية</strong></td><td>تقلبات مزاجية، قلق، اكتئاب خفيف، أرق، صعوبة تركيز</td></tr>
                <tr><td><strong>سلوكية</strong></td><td>رغبة في السكريات/الملح، فقدان الشهية أو زيادتها</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>تخفيف PMS:</strong> مغنيسيوم (400 مجم/يوم)، فيتامين B6 (50-100 مجم)، تقليل ملح وكافيين، تمارين خفيفة (30 دقيقة/يوم)، نوم كافٍ — <a href="/ar/hisabat-dawrat-alnawm">حاسبة دورة النوم</a>.</p>

    <h2 id="irregular-periods">الدورة غير المنتظمة — الأسباب والحلول</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>السبب</th><th>الشرح</th><th>الحل</th></tr></thead>
            <tbody>
                <tr><td><strong>تكيس المبايض (PCOS)</strong></td><td>اضطراب هرموني — 8-13% من النساء</td><td>طبيب نساء + تعديل نمط حياة</td></tr>
                <tr><td><strong>التوتر الشديد</strong></td><td>الكورتيزول يعطل هرمونات التبويض</td><td>تقنيات استرخاء، نوم كافٍ</td></tr>
                <tr><td><strong>تغير الوزن السريع</strong></td><td>فقدان/زيادة > 5 كجم في شهر</td><td>تغذية متوازنة — <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات</a></td></tr>
                <tr><td><strong>تمارين مكثفة</strong></td><td>نقص دهون الجسم + إستروجين</td><td>تقليل حدة التمارين</td></tr>
                <tr><td><strong>الغدة الدرقية</strong></td><td>فرط/قصور يعطل الهرمونات</td><td>تحليل TSH + طبيب</td></tr>
                <tr><td><strong>البلوغ الحديث</strong></td><td>أول سنتين: طبيعي أن تكون غير منتظمة</td><td>مراقبة ولا قلق</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="pcos">تكيس المبايض (PCOS) — الأكثر شيوعاً</h2>
    <p>PCOS يصيب <strong>8-13% من النساء</strong> في سن الإنجاب — وهو السبب الأول للعقم المرتبط بالتبويض:</p>
    <ul>
        <li><strong>الأعراض:</strong> دورات طويلة أو غائبة، حب شباب، زيادة شعر الوجه/الجسم، زيادة وزن (خاصة البطن)</li>
        <li><strong>السبب:</strong> مقاومة إنسولين + ارتفاع الأندروجينات (هرمونات ذكورية)</li>
        <li><strong>التشخيص:</strong> 2 من 3: دورات غير منتظمة + أكياس على المبايض (بالسونار) + ارتفاع أندروجينات</li>
        <li><strong>العلاج:</strong> فقدان 5-10% من الوزن يحسن التبويض بشكل كبير. تمارين 150 دقيقة/أسبوع. أدوية: ميتفورمين، كلوميفين (حسب الطبيب)</li>
    </ul>

    <h2 id="nutrition-cycle">التغذية حسب مراحل الدورة</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المرحلة</th><th>ما تحتاجين</th><th>الأطعمة</th></tr></thead>
            <tbody>
                <tr><td><strong>الحيض</strong></td><td>حديد + فيتامين C</td><td>لحم أحمر، سبانخ، عدس، برتقال</td></tr>
                <tr><td><strong>الجرابية</strong></td><td>بروتين + أطعمة مخمرة</td><td>بيض، زبادي، كيمتشي</td></tr>
                <tr><td><strong>التبويض</strong></td><td>مضادات أكسدة + ألياف</td><td>توت، خضروات ملونة، حبوب كاملة</td></tr>
                <tr><td><strong>الأصفرية (PMS)</strong></td><td>مغنيسيوم + أوميغا-3 + B6</td><td>لوز، سمك، موز، شوكولاتة داكنة</td></tr>
            </tbody>
        </table>
    </div>
    <p>لحساب سعراتك حسب مرحلتك: <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a>. ولا تنسي شرب الماء الكافي: <a href="/ar/hisabat-ihtiyaj-alma">حاسبة احتياج الماء</a>.</p>

    <h2 id="menstrual-products">منتجات صحية — المقارنة</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المنتج</th><th>المدة</th><th>المميزات</th><th>العيوب</th></tr></thead>
            <tbody>
                <tr><td><strong>فوط صحية</strong></td><td>4-8 ساعات</td><td>سهلة، الأكثر انتشاراً</td><td>غير مريحة في الرياضة/السباحة</td></tr>
                <tr><td><strong>تامبون</strong></td><td>4-8 ساعات</td><td>مرنة، تسمح بالسباحة</td><td>خطر TSS (نادر)</td></tr>
                <tr><td><strong>كأس الحيض</strong></td><td>حتى 12 ساعة</td><td>اقتصادية، صديقة للبيئة</td><td>منحنى تعلم</td></tr>
                <tr><td><strong>ملابس داخلية</strong></td><td>8-12 ساعة</td><td>مريحة جداً</td><td>تكلفة أولية عالية</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="when-see-doctor">متى تراجعين الطبيب؟</h2>
    <ul>
        <li>الدورة <strong>أقصر من 21 يوم</strong> أو <strong>أطول من 35 يوم</strong> باستمرار</li>
        <li><strong>غياب 3 أشهر</strong> متتالية بدون حمل</li>
        <li>نزيف <strong>غزير جداً</strong> (تغيير الفوطة كل ساعة)</li>
        <li><strong>ألم شديد</strong> يعيق الحياة اليومية</li>
        <li><strong>نزيف بين الدورات</strong></li>
        <li>بعد <strong>12 شهر محاولة حمل</strong> بدون نتيجة (6 أشهر فوق 35 سنة)</li>
    </ul>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات</strong> بناءً على متوسط طول دورتك. الدورة الفعلية قد تختلف بسبب التوتر، السفر، المرض، أو تغييرات الوزن. لا تُستخدم كوسيلة منع حمل. استشيري طبيبة نساء لأي مخاوف صحية.
    </p>
`;
