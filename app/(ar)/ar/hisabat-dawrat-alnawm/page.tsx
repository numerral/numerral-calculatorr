// Standalone page — /ar/hisabat-dawrat-alnawm
// حاسبة دورة النوم — Arabic Sleep Cycle Calculator
// 90-min cycle engine, 4 sleep stages, age table, Ramadan schedule

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import SleepCycleCalculatorCore from "@/components/calculator/SleepCycleCalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة دورة النوم — Sleep Cycle Calculator (2026)",
    description: "احسب أفضل وقت للنوم أو الاستيقاظ بناءً على دورات النوم (90 دقيقة). تشمل مراحل النوم الأربع (N1/N2/N3/REM)، ساعات النوم حسب العمر من CDC، نصائح النوم الصحي، الكافيين، القيلولة، والنوم في رمضان.",
    keywords: ["حاسبة النوم", "دورة النوم", "sleep cycle calculator", "مراحل النوم", "وقت النوم المثالي", "REM sleep", "النوم العميق", "ساعات النوم", "النوم الصحي", "القيلولة"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-dawrat-alnawm` },
};

const FAQ_ITEMS = [
    { question: "ما هي دورة النوم وكم تستغرق؟", answer: "دورة النوم هي نمط متكرر يمر به دماغك أثناء النوم — تتكون من 4 مراحل: N1 (نوم خفيف، 1-5 دقائق)، N2 (نوم أعمق، 10-25 دقيقة)، N3 (نوم عميق، 20-40 دقيقة)، و REM (الأحلام وتقوية الذاكرة، 10-60 دقيقة). الدورة الكاملة ≈ 90 دقيقة. تتكرر 4-6 مرات في الليلة (6-9 ساعات)." },
    { question: "لماذا أستيقظ متعباً حتى بعد نوم طويل؟", answer: "السبب الأشهر: الاستيقاظ في منتصف دورة — خاصة أثناء النوم العميق (N3) أو REM. هذا يسبب 'خمول النوم' (Sleep Inertia) — شعور بالدوار والارتباك يستمر 15-30 دقيقة. الحل: استخدم الحاسبة لمحاذاة الاستيقاظ مع نهاية دورة (مضاعفات 90 دقيقة من وقت النوم + 14 دقيقة غفو)." },
    { question: "كم ساعة نوم يحتاج البالغ؟", answer: "حسب CDC والأكاديمية الأمريكية لطب النوم (AASM): البالغون 18-64 سنة: 7-9 ساعات. كبار السن 65+: 7-8 ساعات. 5 دورات × 90 دقيقة = 7.5 ساعة هو الأمثل لمعظم البالغين. أقل من 6 ساعات بانتظام يزيد مخاطر السمنة والسكري وأمراض القلب." },
    { question: "ما الفرق بين النوم العميق و REM؟", answer: "النوم العميق (N3): يركز على ترميم الجسم — إصلاح الأنسجة، بناء العضلات، تعزيز المناعة، إفراز هرمون النمو (HGH). يحدث أكثر في النصف الأول من الليل. REM: يركز على العقل — تقوية الذاكرة، التعلم، التنظيم العاطفي، الأحلام الحية. يزداد في النصف الثاني. كلاهما ضروري." },
    { question: "هل القيلولة مفيدة أم ضارة؟", answer: "مفيدة — بشروط. دراسة NASA وجدت أن قيلولة 26 دقيقة تحسن الأداء 34% واليقظة 54%. القواعد: 20 دقيقة (Power Nap) كافية — لا تدخل النوم العميق. قبل الـ 3 م — لتجنب اختلال النوم الليلي. لا تتجاوز 30 دقيقة — الاستيقاظ من N3 يسبب خمولاً. إذا كنت تعاني من الأرق: تجنب القيلولة تماماً." },
    { question: "كيف يؤثر الكافيين على النوم؟", answer: "نصف عمر الكافيين 5-6 ساعات: فنجان قهوة (200 مجم) الساعة 4 م = 100 مجم في دمك الساعة 10 م. الكافيين يمنع الأدينوسين (المسؤول عن الشعور بالنعاس). القاعدة: آخر كافيين قبل 6 ساعات من النوم. شاي كرك: ~60 مجم كافيين/كوب. قهوة عربية: ~40 مجم. إسبريسو: ~63 مجم. قهوة فلتر: ~96 مجم." },
    { question: "هل الضوء الأزرق (الشاشات) يؤثر على النوم؟", answer: "نعم. الضوء الأزرق من الهاتف والحاسوب والتلفزيون يثبط إفراز الميلاتونين (هرمون النوم) بنسبة تصل لـ 50%. دراسة من Harvard وجدت أن التعرض للضوء الأزرق يؤخر النوم 90 دقيقة. الحل: توقف عن الشاشات 30-60 دقيقة قبل النوم. استخدم الوضع الليلي (Night Mode). نظارات حجب الضوء الأزرق." },
    { question: "كيف أنظم نومي في رمضان؟", answer: "رمضان يغيّر الجدول — التراويح والسحور يؤخران النوم. خطة عملية: نم بعد العشاء/التراويح (≈ 11 م). استيقظ للسحور (≈ 4:30 ص) — ارجع للنوم بعده. إجمالي: 5-6 ساعات ليلاً + قيلولة 30 دقيقة بعد الظهر. الأهم: حافظ على الانتظام — نفس المواعيد يومياً." },
    { question: "ما العلاقة بين النوم وخسارة الوزن؟", answer: "علاقة مباشرة. قلة النوم (أقل من 7 ساعات): ترفع هرمون الجريلين (الجوع) وتخفض اللبتين (الشبع) = تأكل أكثر. ترفع الكورتيزول (هرمون التوتر) = تخزين دهون البطن. تقلل حساسية الإنسولين. دراسة: نوم 5.5 ساعات مقابل 8.5 = فقدان عضلات بدلاً من دهون. النوم الجيد يحرق 300-400 سعرة/ليلة." },
    { question: "ما هي اضطرابات النوم الشائعة؟", answer: "1) الأرق (Insomnia): صعوبة النوم أو البقاء نائماً — يصيب 30% من البالغين. 2) انقطاع النفس النومي (Sleep Apnea): توقف التنفس مراراً أثناء النوم — شخير عالي + تعب نهاري. 3) متلازمة الساقين المتململة (RLS): رغبة لا تقاوم في تحريك الساقين ليلاً. 4) اضطراب الساعة البيولوجية: نوم/استيقاظ في أوقات غير تقليدية. استشر طبيب نوم إذا استمرت المشكلة أكثر من أسبوعين." },
    { question: "هل النوم في العطلة يعوّض سهر الأسبوع؟", answer: "جزئياً فقط. دراسة من جامعة كولورادو: النوم الإضافي في العطلة يحسن صحة القلب قليلاً، لكنه لا يعوّض الضرر الأيضي (مقاومة الإنسولين). الأفضل: انتظام يومي (±30 دقيقة فقط بين أيام الأسبوع والعطلة). النوم ليس حساب بنكي تودع فيه وتسحب." },
    { question: "ما هي درجة الحرارة المثالية لغرفة النوم؟", answer: "18-21°م (64-70°ف). الجسم يخفض حرارته الداخلية 1-2 درجة أثناء النوم كإشارة للنوم العميق. غرفة حارة تمنع هذا الانخفاض = نوم سطحي. في الإمارات (صيف 45°م+): ضبط التكييف على 20-22°م أثناء الليل. بطانية خفيفة تساعد على تنظيم الحرارة." },
    { question: "كيف أساعد طفلي على النوم أفضل؟", answer: "الأطفال 6-12 سنة: 9-12 ساعة (CDC). نصائح: روتين ثابت (حمام → قصة → نوم). بلا شاشات ساعة قبل النوم. غرفة مظلمة وهادئة. موعد نوم ثابت حتى في العطل. لا مشروبات غازية أو شوكولاتة مسائية (كافيين). القلق أو كوابيس متكررة = استشر طبيب أطفال." },
    { question: "هل يمكنني تدريب نفسي على نوم أقل؟", answer: "لا. الاحتياج البيولوجي للنوم (7-9 ساعات للبالغين) محدد جينياً ولا يمكن 'تدريبه'. الأشخاص الذين يدّعون الاكتفاء بـ 4-5 ساعات إما: لديهم طفرة جينية نادرة (DEC2 — أقل من 1% من البشر)، أو يعانون من نقص نوم مزمن بدون إدراك. النوم أقل من 6 ساعات بانتظام يقصر العمر المتوقع." },
    { question: "ما أفضل وقت للاستيقاظ؟", answer: "يعتمد على وقت نومك. القاعدة: (وقت النوم + 14 دقيقة غفو) + (عدد الدورات × 90 دقيقة). مثال: نمت الساعة 11 م → أفضل أوقات الاستيقاظ: 4:44 ص (4 دورات)، 6:14 ص (5 دورات — الأمثل)، 7:44 ص (6 دورات). الأهم من التوقيت: الانتظام — استيقظ بنفس الوقت يومياً." },
];

export default function SleepCycleCalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة دورة النوم", item: `${SITE_URL}/ar/hisabat-dawrat-alnawm` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة دورة النوم",
            url: `${SITE_URL}/ar/hisabat-dawrat-alnawm`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسب أفضل وقت للنوم أو الاستيقاظ بناءً على دورات النوم (90 دقيقة)",
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
            <Script id="schema-sleep-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة دورة النوم</span>
            </nav>

            <h1 className="ar-page__title">🌙 حاسبة دورة النوم (2026)</h1>
            <p className="ar-page__subtitle">
                احسب أفضل وقت للنوم أو الاستيقاظ بناءً على دورات النوم (90 دقيقة لكل دورة). تعتمد الحاسبة على علم النوم: 4 مراحل (N1/N2/N3/REM)، متوسط وقت الغفو (14 دقيقة)، وتوصيات CDC/AASM حسب العمر — مع نصائح النوم الصحي ودليل النوم في رمضان.
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <SleepCycleCalculatorCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة دورة النوم</h2>
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
                    <Link href="/ar/hisabat-ratib" className="ar-related__card">
                        <span className="ar-related__icon">💵</span>
                        <span className="ar-related__name">حاسبة الراتب</span>
                    </Link>
                    <Link href="/ar/hisabat-nisba-miwiya" className="ar-related__card">
                        <span className="ar-related__icon">📐</span>
                        <span className="ar-related__name">حاسبة النسبة المئوية</span>
                    </Link>
                    <Link href="/ar/hisabat-nihayat-alkhidma" className="ar-related__card">
                        <span className="ar-related__icon">📋</span>
                        <span className="ar-related__name">حاسبة نهاية الخدمة</span>
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
    <h2 id="what-is-sleep-cycle">ما هي دورة النوم؟</h2>
    <p>دورة النوم هي <strong>نمط متكرر</strong> من نشاط الدماغ أثناء نومك. كل دورة تستغرق حوالي <strong>90 دقيقة</strong> (تتراوح بين 80-120 دقيقة) وتتكون من 4 مراحل متتالية. يمر دماغك بـ <strong>4 إلى 6 دورات</strong> في الليلة الواحدة — أي 6 إلى 9 ساعات.</p>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">💡</span>
        <div>
            <strong>لماذا 90 دقيقة مهمة؟</strong> الاستيقاظ في <strong>نهاية الدورة</strong> (بين دورتين) يجعلك تشعر بالنشاط والانتعاش. أما الاستيقاظ في <strong>منتصفها</strong> — خاصة أثناء النوم العميق (N3) — يسبب "خمول النوم" (Sleep Inertia): دوار وتعب وارتباك يستمر 15-30 دقيقة.
        </div>
    </div>

    <h2 id="four-stages">مراحل النوم الأربع — ماذا يحدث في كل مرحلة؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المرحلة</th><th>النوع</th><th>المدة</th><th>ماذا يحدث</th><th>أهمية</th></tr></thead>
            <tbody>
                <tr><td><strong>N1</strong></td><td>نوم خفيف (NREM)</td><td>1-5 دقائق</td><td>انتقال من اليقظة — تتباطأ موجات الدماغ — يمكن الاستيقاظ بسهولة</td><td>بوابة الدخول للنوم</td></tr>
                <tr><td><strong>N2</strong></td><td>نوم أعمق (NREM)</td><td>10-25 دقيقة</td><td>ينخفض معدل القلب والحرارة — تظهر مغازل النوم (Sleep Spindles)</td><td>50% من وقت النوم — تحضير للنوم العميق</td></tr>
                <tr><td><strong>N3</strong></td><td>نوم عميق (NREM)</td><td>20-40 دقيقة</td><td>موجات بطيئة (Delta Waves) — يصعب الاستيقاظ جداً</td><td>ترميم الجسم، إصلاح الأنسجة، إفراز HGH، تعزيز المناعة</td></tr>
                <tr><td><strong>REM</strong></td><td>حركة العين السريعة</td><td>10-60 دقيقة</td><td>الأحلام الحية — عيون تتحرك بسرعة — شلل مؤقت للجسم</td><td>تقوية الذاكرة، التعلم، التنظيم العاطفي</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>ملاحظة:</strong> في الدورات الأولى (بداية الليل)، النوم العميق (N3) يطول. في الدورات الأخيرة (آخر الليل)، REM يطول — لذلك تحلم أكثر قبل الاستيقاظ. النوم المثالي يحتاج <strong>كليهما</strong>: N3 للجسم + REM للعقل.</p>

    <h2 id="how-much-sleep">كم ساعة نوم تحتاج؟ — حسب العمر</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة العمرية</th><th>الساعات الموصى بها</th><th>الدورات</th><th>المصدر</th></tr></thead>
            <tbody>
                <tr><td>👶 حديثو الولادة (0-3 أشهر)</td><td>14 – 17 ساعة</td><td>—</td><td>CDC / NSF</td></tr>
                <tr><td>🍼 رضّع (4-12 شهر)</td><td>12 – 16 ساعة</td><td>—</td><td>AASM</td></tr>
                <tr><td>👧 أطفال صغار (1-2 سنة)</td><td>11 – 14 ساعة</td><td>—</td><td>AASM</td></tr>
                <tr><td>🧒 ما قبل المدرسة (3-5)</td><td>10 – 13 ساعة</td><td>7-9</td><td>AASM</td></tr>
                <tr><td>📚 أطفال المدرسة (6-12)</td><td>9 – 12 ساعة</td><td>6-8</td><td>AASM</td></tr>
                <tr><td>🎓 مراهقون (13-17)</td><td>8 – 10 ساعات</td><td>5-7</td><td>AASM</td></tr>
                <tr><td><strong>🧑 بالغون (18-64)</strong></td><td><strong>7 – 9 ساعات</strong></td><td><strong>5-6</strong></td><td>CDC / NSF</td></tr>
                <tr><td>👴 كبار السن (65+)</td><td>7 – 8 ساعات</td><td>5</td><td>NSF</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="why-tired">لماذا تستيقظ متعباً؟ — خمول النوم</h2>
    <p>إذا كنت تستيقظ بدوار وتعب رغم نومك ساعات كافية، فالسبب غالباً <strong>الاستيقاظ في منتصف دورة</strong>. الدماغ في مرحلة N3 (النوم العميق) يعمل بموجات بطيئة جداً — الاستيقاظ المفاجئ يعني انتقالاً قسرياً من "وضع الترميم" إلى اليقظة.</p>
    <ul>
        <li><strong>الحل:</strong> استخدم الحاسبة لضبط منبهك على نهاية دورة (مضاعفات 90 دقيقة + 14 دقيقة غفو)</li>
        <li><strong>تطبيق:</strong> إذا نمت 11:00 م → أفضل أوقات الاستيقاظ: 4:44 ص (4 دورات)، <strong>6:14 ص</strong> (5 دورات — الأمثل)، 7:44 ص (6 دورات)</li>
        <li><strong>منبه ذكي:</strong> بعض التطبيقات تتتبع حركتك وتوقظك في أخف مرحلة (N1/N2) ضمن نافذة 30 دقيقة</li>
    </ul>

    <h2 id="sleep-hygiene">النوم الصحي — 10 نصائح مبنية على العلم</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>#</th><th>النصيحة</th><th>لماذا؟</th></tr></thead>
            <tbody>
                <tr><td>1</td><td><strong>جدول ثابت</strong> — نم واستيقظ بنفس الوقت يومياً</td><td>ينظم الساعة البيولوجية (Circadian Rhythm)</td></tr>
                <tr><td>2</td><td><strong>غرفة مظلمة وباردة</strong> (18-21°م)</td><td>الظلام يحفز الميلاتونين — البرودة تدعم النوم العميق</td></tr>
                <tr><td>3</td><td><strong>بلا شاشات 30-60 دقيقة</strong> قبل النوم</td><td>الضوء الأزرق يثبط الميلاتونين بنسبة تصل 50%</td></tr>
                <tr><td>4</td><td><strong>آخر كافيين قبل 6 ساعات</strong></td><td>نصف عمر الكافيين 5-6 ساعات</td></tr>
                <tr><td>5</td><td><strong>تمارين — لكن ليس قبل ساعتين</strong></td><td>الرياضة ترفع الحرارة والأدرينالين مؤقتاً</td></tr>
                <tr><td>6</td><td><strong>وجبة خفيفة مسائية</strong></td><td>المعدة الممتلئة = ارتداد حمضي = نوم مضطرب</td></tr>
                <tr><td>7</td><td><strong>روتين استرخاء</strong>: قراءة، تأمل، حمام</td><td>يبلّغ الدماغ أن وقت النوم قد حان</td></tr>
                <tr><td>8</td><td><strong>السرير للنوم فقط</strong></td><td>العمل/الشاشات على السرير = ارتباط ذهني بالنشاط</td></tr>
                <tr><td>9</td><td><strong>شمس في الصباح</strong> (15-30 دقيقة)</td><td>ينظم الساعة البيولوجية ويوقف الميلاتونين</td></tr>
                <tr><td>10</td><td><strong>تجنب الكحول قبل النوم</strong></td><td>يُنعس لكنه يضعف REM ويسبب استيقاظات متكررة</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="sleep-exercise">النوم والرياضة — علاقة ذات اتجاهين</h2>
    <p>النوم والرياضة يعززان بعضهما:</p>
    <ul>
        <li><strong>النوم العميق (N3)</strong> هو الوقت الذي يُفرز فيه <strong>هرمون النمو (HGH)</strong> — ضروري لإصلاح العضلات والتعافي بعد التمرين</li>
        <li><strong>قلة النوم</strong> تقلل القوة بنسبة 11%، وسرعة الجري 5%، ودقة التسديد 9%</li>
        <li><strong>التمارين المنتظمة</strong> تحسن جودة النوم وتقلل وقت الغفو — لكن تجنب التمارين الشديدة قبل ساعتين من النوم</li>
    </ul>
    <p>لحساب سعراتك مع التمارين، استخدم <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a>. ولا تنسَ <a href="/ar/hisabat-ihtiyaj-alma">حاسبة احتياج الماء</a> — الجفاف يخلّ بدورات النوم.</p>

    <h2 id="caffeine">الكافيين ودورة النوم — متى تتوقف؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المشروب</th><th>الكافيين (مجم)</th><th>آخر وقت لتنام 11 م</th></tr></thead>
            <tbody>
                <tr><td><strong>إسبريسو (30 مل)</strong></td><td>63</td><td>5:00 م</td></tr>
                <tr><td><strong>قهوة فلتر (240 مل)</strong></td><td>96</td><td>5:00 م</td></tr>
                <tr><td><strong>قهوة عربية (فنجان)</strong></td><td>40</td><td>5:00 م</td></tr>
                <tr><td><strong>شاي كرك (كوب)</strong></td><td>60</td><td>5:00 م</td></tr>
                <tr><td><strong>مشروب طاقة (250 مل)</strong></td><td>80</td><td>5:00 م</td></tr>
                <tr><td><strong>كولا (330 مل)</strong></td><td>34</td><td>5:00 م</td></tr>
                <tr><td><strong>شوكولاتة داكنة (50 غ)</strong></td><td>25</td><td>5:00 م</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>القاعدة:</strong> نصف عمر الكافيين <strong>5-6 ساعات</strong>. هذا يعني أن 50% من كافيين قهوة الساعة 4 م لا يزال في دمك الساعة 10 م. الكافيين لا يمنعك من النوم فقط — بل <strong>يقلل النوم العميق (N3)</strong> حتى لو نمت.</p>

    <h2 id="blue-light">النوم والشاشات — الضوء الأزرق</h2>
    <p>الضوء الأزرق المنبعث من الهواتف والحواسيب والتلفزيونات يؤثر مباشرة على هرمون <strong>الميلاتونين</strong> (هرمون النوم):</p>
    <ul>
        <li><strong>دراسة Harvard:</strong> التعرض للضوء الأزرق مساءً يثبط الميلاتونين بنسبة تصل <strong>50%</strong> ويؤخر الساعة البيولوجية <strong>90 دقيقة</strong></li>
        <li><strong>النتيجة:</strong> صعوبة في النوم + نقص في REM (مرحلة الأحلام والذاكرة)</li>
    </ul>
    <p><strong>الحلول:</strong></p>
    <ol>
        <li>أوقف الشاشات <strong>30-60 دقيقة</strong> قبل النوم</li>
        <li>فعّل <strong>الوضع الليلي</strong> (Night Shift / Night Mode) على أجهزتك بعد غروب الشمس</li>
        <li>استبدل التمرير بالقراءة من كتاب ورقي</li>
    </ol>

    <h2 id="napping">القيلولة — متى وكيف</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>النوع</th><th>المدة</th><th>الفائدة</th><th>الخطر</th></tr></thead>
            <tbody>
                <tr><td><strong>Power Nap</strong></td><td>10-20 دقيقة</td><td>يقظة + تركيز (NASA: +34% أداء، +54% يقظة)</td><td>صفر — لا تدخل N3</td></tr>
                <tr><td><strong>قيلولة كاملة</strong></td><td>90 دقيقة (دورة كاملة)</td><td>إبداع + ذاكرة (تمر بكل المراحل)</td><td>قد تؤثر على النوم الليلي</td></tr>
                <tr><td><strong>قيلولة طويلة</strong></td><td>30-60 دقيقة</td><td>—</td><td>⚠️ الأسوأ: تستيقظ من N3 = خمول شديد</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>القاعدة:</strong> إما 20 دقيقة أو 90 دقيقة — تجنب ما بينهما. دائماً <strong>قبل الساعة 3 م</strong> لتجنب اختلال النوم الليلي.</p>

    <h2 id="ramadan-sleep">النوم في رمضان — خطة عملية</h2>
    <p>رمضان يغيّر جدول النوم بشكل كبير — التراويح والسحور يدفعان النوم لمواعيد غير تقليدية:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفترة</th><th>التوقيت</th><th>التوصية</th></tr></thead>
            <tbody>
                <tr><td><strong>بعد الإفطار والتراويح</strong></td><td>≈ 10:30 – 11:00 م</td><td>اذهب للنوم فوراً بعد صلاة العشاء والتراويح</td></tr>
                <tr><td><strong>السحور</strong></td><td>≈ 4:00 – 4:30 ص</td><td>استيقظ، تسحّر، ثم ارجع للنوم بعد صلاة الفجر</td></tr>
                <tr><td><strong>النوم الثاني</strong></td><td>≈ 5:00 – 7:00 ص</td><td>2 ساعة إضافية = إجمالي 7-8 ساعات</td></tr>
                <tr><td><strong>قيلولة الظهيرة</strong></td><td>≈ 1:00 – 1:30 م</td><td>20-30 دقيقة فقط — لتجنب اختلال الليل</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">🌙</span>
        <div>
            <strong>أهم نصيحة في رمضان:</strong> الانتظام أهم من المدة. حافظ على نفس مواعيد النوم والاستيقاظ كل يوم — الجسم يتأقلم خلال 3-5 أيام. تجنب السهر غير الضروري بعد التراويح.
        </div>
    </div>

    <h2 id="sleep-disorders">اضطرابات النوم الشائعة</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الاضطراب</th><th>الأعراض</th><th>الانتشار</th><th>متى تستشير طبيب؟</th></tr></thead>
            <tbody>
                <tr><td><strong>الأرق (Insomnia)</strong></td><td>صعوبة النوم أو البقاء نائماً</td><td>30% من البالغين</td><td>إذا استمر أكثر من أسبوعين</td></tr>
                <tr><td><strong>انقطاع النفس النومي</strong></td><td>شخير عالي، توقف التنفس، تعب نهاري</td><td>5-10%</td><td>إذا شكا الشريك من شخيرك أو توقف تنفسك</td></tr>
                <tr><td><strong>الساقين المتململة (RLS)</strong></td><td>رغبة لا تقاوم في تحريك الساقين ليلاً</td><td>5-15%</td><td>إذا أثّر على نومك بانتظام</td></tr>
                <tr><td><strong>اضطراب الساعة البيولوجية</strong></td><td>نوم/استيقاظ بأوقات غير تقليدية</td><td>—</td><td>إذا لم تستطع التأقلم مع جدول العمل</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="sleep-weight">النوم وخسارة الوزن — علاقة مباشرة</h2>
    <p>قلة النوم تُعطّل هرمونات الشبع والجوع:</p>
    <ul>
        <li><strong>الجريلين</strong> (هرمون الجوع): يرتفع 28% مع نوم أقل من 7 ساعات = تأكل أكثر</li>
        <li><strong>اللبتين</strong> (هرمون الشبع): ينخفض 18% = لا تشعر بالشبع</li>
        <li><strong>الكورتيزول</strong> (هرمون التوتر): يرتفع = تخزين دهون البطن (Visceral Fat)</li>
        <li><strong>الإنسولين:</strong> حساسية الإنسولين تنخفض مع قلة النوم = مقاومة إنسولين = خطر سكري نوع 2</li>
    </ul>
    <p><strong>دراسة:</strong> مجموعة نامت 5.5 ساعات مقابل 8.5 ساعات — المجموعة الأولى خسرت <strong>60% عضلات</strong> (بدلاً من دهون) رغم نفس السعرات. النوم الكافي يحرق <strong>300-400 سعرة</strong> إضافية في الليلة. لخطة متكاملة: <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a> + نوم 7-9 ساعات.</p>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات تقريبية</strong> بناءً على دورات النوم القياسية (90 دقيقة). مدة الدورة الفعلية تتراوح بين 80-120 دقيقة وتختلف من شخص لآخر. إذا كنت تعاني من اضطرابات نوم مستمرة، استشر طبيب نوم متخصص.
    </p>
`;
