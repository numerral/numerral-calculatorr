// Standalone page — /ar/hisabat-suarat-hararia
// حاسبة السعرات الحرارية اليومية — Arabic Calorie Calculator
// UAE-contextualized with MOHAP data, Emirati food reference, and comprehensive Arabic content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import ArabicCalorieCalculatorCore from "@/components/calculator/ArabicCalorieCalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة السعرات الحرارية اليومية — Daily Calorie Calculator (2026)",
    description: "احسب احتياجاتك اليومية من السعرات الحرارية حسب العمر والجنس والوزن ومستوى النشاط البدني. تشمل BMR وTDEE وعجز السعرات وتوزيع المغذيات الكبرى ودليل السعرات للأطعمة الإماراتية والعربية — متوافقة مع إرشادات وزارة الصحة ووقاية المجتمع.",
    keywords: ["حاسبة السعرات الحرارية", "حاسبة السعرات اليومية", "calorie calculator Arabic", "BMR calculator", "TDEE", "حساب السعرات الحرارية", "عجز السعرات", "خسارة الوزن", "MOHAP", "وزارة الصحة ووقاية المجتمع", "أطعمة إماراتية سعرات"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-suarat-hararia` },
};

const FAQ_ITEMS = [
    { question: "ما هي حاسبة السعرات الحرارية وكيف تعمل؟", answer: "حاسبة السعرات الحرارية أداة تقدّر عدد السعرات (كيلو كالوري) التي يحتاجها جسمك يومياً. تعمل بحساب معدل الأيض الأساسي (BMR) — الطاقة التي يحرقها جسمك في حالة الراحة — ثم ضربه بمعامل النشاط للحصول على إجمالي الاستهلاك اليومي (TDEE). نستخدم معادلة Mifflin-St Jeor المعتمدة عالمياً." },
    { question: "ما هو معدل الأيض الأساسي (BMR)؟", answer: "BMR هو عدد السعرات التي يحرقها جسمك في حالة الراحة التامة للحفاظ على الوظائف الحيوية (التنفس، الدورة الدموية، تجديد الخلايا). يمثل 60-70% من إجمالي استهلاكك اليومي. المعادلة: للرجال = (10 × الوزن) + (6.25 × الطول) − (5 × العمر) + 5. للنساء = (10 × الوزن) + (6.25 × الطول) − (5 × العمر) − 161." },
    { question: "ما هو TDEE وكيف يُحسب؟", answer: "TDEE (إجمالي الاستهلاك اليومي من الطاقة) هو عدد السعرات الكلي الذي تحرقه يومياً بما في ذلك جميع الأنشطة. يُحسب بضرب BMR × معامل النشاط: قليل النشاط (×1.2)، نشاط خفيف (×1.375)، نشاط متوسط (×1.55)، نشاط عالي (×1.725)، نشاط فائق (×1.9). TDEE هو عدد السعرات اللازم للحفاظ على وزنك الحالي." },
    { question: "كم سعرة حرارية في المجبوس الإماراتي؟", answer: "كوب من مجبوس الدجاج (236 غرام) يحتوي على حوالي 354 سعرة حرارية. مجبوس اللحم أعلى قليلاً بسبب محتوى الدهون. المجبوس طبق رئيسي في المطبخ الإماراتي ومن أكثر الأطعمة التقليدية استهلاكاً للسعرات. للتحكم بالسعرات، قلل حصة الأرز وزد الخضراوات." },
    { question: "كم سعرة حرارية أحتاج لخسارة 1 كجم أسبوعياً؟", answer: "لخسارة 1 كجم أسبوعياً تحتاج عجز يومي حوالي 1,000 سعرة (لأن 1 كجم دهون ≈ 7,700 سعرة). لخسارة أكثر أماناً واستدامة (0.5 كجم/أسبوع) استهدف عجز 500 سعرة/يوم. لا تنزل أبداً تحت 1,200 سعرة/يوم للنساء أو 1,500 سعرة/يوم للرجال بدون إشراف طبي." },
    { question: "ما هو معدل السمنة في الإمارات؟", answer: "حسب المسح الوطني للصحة والتغذية 2024-2025 من وزارة الصحة ووقاية المجتمع (MOHAP): نسبة السمنة بين البالغين 22.4%، و59.1% لا يمارسون نشاطاً بدنياً كافياً، ومتوسط الاستهلاك اليومي 2,852 سعرة. سمنة الأطفال (6-17 سنة) 16.1%. في دبي تحديداً: 28% من البالغين يعانون السمنة و63% زيادة في الوزن أو سمنة." },
    { question: "كم سعرة حرارية في شاي الكرك؟", answer: "كوب شاي كرك تقليدي يحتوي على حوالي 180 سعرة حرارية بسبب الحليب المكثف والسكر. إذا كنت تشرب 3 أكواب يومياً = 540 سعرة = ربع احتياجاتك اليومية! للتقليل: استخدم حليب قليل الدسم وقلل السكر تدريجياً. القهوة العربية (بدون سكر) فقط 2 سعرة لكل فنجان." },
    { question: "ما هي نسب المغذيات الكبرى المثالية لخسارة الوزن؟", answer: "النسبة الموصى بها لخسارة الوزن: 30% بروتين + 40% كربوهيدرات + 30% دهون. بروتين أعلى (1.6-2.4 غ/كجم وزن) يحافظ على كتلتك العضلية أثناء العجز. مثال: على نظام 1,800 سعرة = 135 غ بروتين + 180 غ كربوهيدرات + 60 غ دهون." },
    { question: "كيف أدير سعراتي في رمضان؟", answer: "هدفك اليومي يبقى نفسه — فقط يتوزع على الإفطار والسحور. نصائح: (1) افتح بـ 2-3 تمرات + ماء (~170 سعرة)، (2) انتظر 15 دقيقة ثم تناول وجبة متوازنة، (3) أولوية للبروتين والخضراوات قبل الأرز، (4) تجنب المقالي (سمبوسة، سبرنغ رول) — مليئة بالسعرات الفارغة، (5) السحور: شوفان + بيض + لبن." },
    { question: "ما هو دليل برج خليفة الغذائي؟", answer: "دليل برج خليفة هو الدليل البصري الغذائي الرسمي لدولة الإمارات، أطلقته وزارة الصحة ووقاية المجتمع ضمن الإرشادات الغذائية 2019. يستخدم شكل برج خليفة مقسماً إلى 6 مجموعات غذائية ملونة: الحبوب، الخضراوات، منتجات الألبان، الفواكه، اللحوم، والدهون. الماء في القاعدة يرمز لأهميته الأساسية." },
    { question: "ما الفرق بين السعرات الحرارية والكيلو كالوري؟", answer: "في الاستخدام اليومي، السعرة الحرارية = الكيلو كالوري (kcal). تقنياً: 1 كيلو كالوري = 1,000 سعرة حرارية صغيرة. عندما نقول 'طبق 500 سعرة' نقصد 500 كيلو كالوري. وحدة أخرى: الكيلو جول (kJ) = الكيلو كالوري × 4.184. أغلب ملصقات الأغذية في الإمارات تعرض كلا الوحدتين." },
    { question: "هل الصيام المتقطع فعّال لخسارة الوزن؟", answer: "الصيام المتقطع (16:8 — صيام 16 ساعة + أكل 8 ساعات) أثبت فعاليته في تقليل السعرات المستهلكة تلقائياً. في الإمارات اكتسب شعبية كبيرة، خاصة لتوافقه مع صيام رمضان. الأبحاث تشير لفوائد في حساسية الإنسولين وحرق الدهون. لكنه ليس سحراً — السعرات الإجمالية هي ما يحدد خسارة أو زيادة الوزن." },
    { question: "كم سعرة حرارية في اللقيمات؟", answer: "6 قطع لقيمات مع دبس التمر تحتوي على حوالي 240 سعرة حرارية. كل قطعة لقيمات صغيرة = 40-60 سعرة. اللقيمات من أشهر الحلويات الإماراتية التقليدية وتُقدم خاصة في رمضان. للتحكم: اكتفِ بـ 3-4 قطع وقلل دبس التمر." },
    { question: "ما هي الاستراتيجية الغذائية الوطنية للإمارات 2030؟", answer: "أطلقت وزارة الصحة ووقاية المجتمع الاستراتيجية الغذائية الوطنية 2022-2030 لبناء أنظمة غذائية مستدامة. الأهداف: تقليل التقزم عند الأطفال تحت 5 سنوات، زيادة الرضاعة الطبيعية الحصرية، وقف ارتفاع السمنة عند أطفال المدارس، وتوفير تثقيف غذائي شامل عبر المنظومة الصحية." },
    { question: "كم سعرة حرارية يحتاج الشخص العادي يومياً؟", answer: "حسب وزارة الصحة ووقاية المجتمع: متوسط الاستهلاك اليومي في الإمارات 2,852 سعرة. لكن الاحتياج الفعلي يختلف: الرجال (نشاط متوسط) ≈ 2,200-2,600 سعرة. النساء (نشاط متوسط) ≈ 1,800-2,200 سعرة. العوامل المؤثرة: العمر، الوزن، الطول، ومستوى النشاط. استخدم الحاسبة أعلاه لنتيجة شخصية دقيقة." },
];

export default function ArabicCalorieCalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة السعرات الحرارية", item: `${SITE_URL}/ar/hisabat-suarat-hararia` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة السعرات الحرارية اليومية",
            url: `${SITE_URL}/ar/hisabat-suarat-hararia`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسب احتياجاتك اليومية من السعرات الحرارية باستخدام معادلة Mifflin-St Jeor مع دليل الأطعمة الإماراتية",
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
            <Script id="schema-calorie-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            {/* Breadcrumb */}
            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة السعرات الحرارية</span>
            </nav>

            <h1 className="ar-page__title">🔥 حاسبة السعرات الحرارية اليومية (2026)</h1>
            <p className="ar-page__subtitle">
                احسب احتياجاتك اليومية من السعرات الحرارية حسب العمر والجنس والوزن ومستوى النشاط البدني. تشمل معدل الأيض الأساسي (BMR)، إجمالي الاستهلاك اليومي (TDEE)، عجز السعرات لخسارة الوزن، توزيع المغذيات الكبرى، ودليل السعرات الحرارية للأطعمة الإماراتية والعربية الشائعة — متوافقة مع إرشادات وزارة الصحة ووقاية المجتمع.
            </p>

            {/* Calculator widget */}
            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <ArabicCalorieCalculatorCore />
                </div>
            </div>

            {/* Rich Content */}
            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            {/* FAQ */}
            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة السعرات الحرارية</h2>
                {FAQ_ITEMS.map((item, i) => (
                    <details key={i} className="ar-faq__item">
                        <summary className="ar-faq__question">{item.question}</summary>
                        <p className="ar-faq__answer">{item.answer}</p>
                    </details>
                ))}
            </section>

            {/* Related */}
            <section className="ar-related">
                <h2 className="ar-related__title">🔗 حاسبات ذات صلة</h2>
                <div className="ar-related__grid">
                    <Link href="/ar/hisabat-ratib" className="ar-related__card">
                        <span className="ar-related__icon">💵</span>
                        <span className="ar-related__name">حاسبة الراتب</span>
                    </Link>
                    <Link href="/ar/hisabat-nisba-miwiya" className="ar-related__card">
                        <span className="ar-related__icon">📐</span>
                        <span className="ar-related__name">حاسبة النسبة المئوية</span>
                    </Link>
                    <Link href="/ar/hisabat-dariba" className="ar-related__card">
                        <span className="ar-related__icon">🧾</span>
                        <span className="ar-related__name">حاسبة الضريبة</span>
                    </Link>
                    <Link href="/ar/hisabat-nihayat-alkhidma" className="ar-related__card">
                        <span className="ar-related__icon">📋</span>
                        <span className="ar-related__name">حاسبة نهاية الخدمة</span>
                    </Link>
                    <Link href="/ar/nitaqat-calculator" className="ar-related__card">
                        <span className="ar-related__icon">🏢</span>
                        <span className="ar-related__name">حاسبة نطاقات</span>
                    </Link>
                    <Link href="/ar/hisabat-hisab-almuwatin" className="ar-related__card">
                        <span className="ar-related__icon">🇸🇦</span>
                        <span className="ar-related__name">حاسبة حساب المواطن</span>
                    </Link>
                </div>
            </section>

            {/* Back to hub */}
            <div className="ar-page__back">
                <Link href="/ar" className="ar-page__back-link">
                    → العودة لجميع الحاسبات
                </Link>
            </div>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-calorie-calculator">ما هي حاسبة السعرات الحرارية؟</h2>
    <p><strong>حاسبة السعرات الحرارية</strong> أداة تقدّر عدد <strong>السعرات الحرارية (كيلو كالوري/kcal)</strong> التي يحتاجها جسمك يومياً للحفاظ على وزنك أو إنقاصه أو زيادته. تعمل بحساب <strong>معدل الأيض الأساسي (BMR)</strong> — الطاقة التي يحرقها جسمك في حالة الراحة التامة — ثم تعديله حسب <strong>مستوى نشاطك البدني</strong> للحصول على <strong>إجمالي الاستهلاك اليومي من الطاقة (TDEE)</strong>.</p>
    <p>نستخدم <strong>معادلة Mifflin-St Jeor</strong> (1990) المعتمدة من الجمعية الأمريكية للتغذية كأدق معادلة لتقدير BMR. هذه المعادلة أكثر دقة من معادلة Harris-Benedict القديمة بنسبة 5-10%.</p>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">💡</span>
        <div>
            <strong>كيف تعمل الحاسبة في 3 خطوات:</strong><br/>
            <strong>الخطوة 1:</strong> حساب BMR (السعرات في حالة الراحة)<br/>
            <strong>الخطوة 2:</strong> ضرب BMR × معامل النشاط = TDEE (سعرات الحفاظ على الوزن)<br/>
            <strong>الخطوة 3:</strong> طرح العجز = السعرات المستهدفة لخسارة الوزن
        </div>
    </div>

    <h2 id="bmr-formula">معادلة Mifflin-St Jeor — حساب معدل الأيض الأساسي</h2>
    <p><strong>معادلة Mifflin-St Jeor</strong> هي المعيار الذهبي لتقدير معدل الأيض الأساسي (BMR):</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الجنس</th><th>المعادلة</th></tr></thead>
            <tbody>
                <tr><td><strong>الرجال</strong></td><td>BMR = (10 × الوزن بالكجم) + (6.25 × الطول بالسم) − (5 × العمر) + 5</td></tr>
                <tr><td><strong>النساء</strong></td><td>BMR = (10 × الوزن بالكجم) + (6.25 × الطول بالسم) − (5 × العمر) − 161</td></tr>
            </tbody>
        </table>
    </div>
    <h3>مثال عملي</h3>
    <p>رجل عمره 30 سنة، طوله 175 سم، وزنه 80 كجم:</p>
    <ul>
        <li>BMR = (10 × 80) + (6.25 × 175) − (5 × 30) + 5</li>
        <li>BMR = 800 + 1,093.75 − 150 + 5 = <strong>1,748.75 سعرة/يوم</strong></li>
        <li>إذا كان قليل النشاط (×1.2): TDEE = 1,748.75 × 1.2 = <strong>2,098 سعرة/يوم</strong></li>
    </ul>

    <h2 id="tdee-activity">مستويات النشاط البدني ومعاملاتها</h2>
    <p><strong>TDEE (إجمالي الاستهلاك اليومي)</strong> يحسب كل حركتك اليومية — ليس فقط التمارين الرياضية، بل المشي والطبخ وأعمال المنزل:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>مستوى النشاط</th><th>المعامل</th><th>الوصف</th><th>مثال في الإمارات</th></tr></thead>
            <tbody>
                <tr><td><strong>قليل النشاط</strong></td><td>× 1.2</td><td>عمل مكتبي، بدون تمارين</td><td>موظف مكتبي في دبي، يتنقل بالسيارة</td></tr>
                <tr><td><strong>نشاط خفيف</strong></td><td>× 1.375</td><td>تمارين خفيفة 1-3 أيام/أسبوع</td><td>مشي على كورنيش أبوظبي في عطلة الأسبوع</td></tr>
                <tr><td><strong>نشاط متوسط</strong></td><td>× 1.55</td><td>تمارين 3-5 أيام/أسبوع</td><td>اشتراك منتظم في نادي رياضي</td></tr>
                <tr><td><strong>نشاط عالي</strong></td><td>× 1.725</td><td>تمارين شاقة 6-7 أيام/أسبوع</td><td>كروس فيت يومي + رياضات خارجية</td></tr>
                <tr><td><strong>نشاط فائق</strong></td><td>× 1.9</td><td>رياضي محترف / عمل بدني</td><td>عامل بناء، رياضي أولمبي</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">🌡️</span>
        <div>
            <strong>واقع الإمارات:</strong> بسبب حرارة الصيف الشديدة (45°م+)، كثير من سكان الإمارات يُصنّفون كـ "قليلي النشاط" خلال أشهر الصيف. النوادي الرياضية المغلقة والمولات تصبح أماكن النشاط الرئيسية. حسب MOHAP: <strong>59.1% من البالغين لا يمارسون نشاطاً بدنياً كافياً</strong>.
        </div>
    </div>

    <h2 id="obesity-uae">تحدي السمنة في الإمارات — أرقام 2024/2025</h2>
    <p>حسب <strong>المسح الوطني للصحة والتغذية 2024-2025</strong> الصادر عن وزارة الصحة ووقاية المجتمع (MOHAP):</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المؤشر</th><th>النسبة</th><th>المصدر</th></tr></thead>
            <tbody>
                <tr><td><strong>السمنة — البالغون (18+)</strong></td><td>22.4%</td><td>MOHAP 2024-25</td></tr>
                <tr><td><strong>عدم ممارسة نشاط بدني كافٍ</strong></td><td>59.1%</td><td>MOHAP 2024-25</td></tr>
                <tr><td><strong>سمنة الأطفال (6-17 سنة)</strong></td><td>16.1%</td><td>MOHAP 2024-25</td></tr>
                <tr><td><strong>سمنة الأطفال (أقل من 5 سنوات)</strong></td><td>2.2%</td><td>MOHAP 2024-25</td></tr>
                <tr><td><strong>متوسط الاستهلاك اليومي</strong></td><td>2,852 سعرة</td><td>MOHAP 2024-25</td></tr>
                <tr><td><strong>السمنة — دبي (البالغون)</strong></td><td>28%</td><td>دراسة 2025</td></tr>
                <tr><td><strong>زيادة الوزن + السمنة — دبي</strong></td><td>63%</td><td>دراسة 2025</td></tr>
                <tr><td><strong>انخفاض السمنة (2010-2025)</strong></td><td>14.8%</td><td>MOHAP</td></tr>
            </tbody>
        </table>
    </div>
    <p>فهم احتياجاتك اليومية من السعرات الحرارية هو <strong>الخطوة الأولى</strong> نحو إدارة الوزن بفعالية. متوسط الاستهلاك 2,852 سعرة قد يكون أعلى من الاحتياج الفعلي لكثير من الناس — خاصة قليلي النشاط.</p>

    <h2 id="calorie-deficit">عجز السعرات الحرارية — دليل آمن لخسارة الوزن</h2>
    <p>لخسارة الوزن يجب أن تستهلك <strong>سعرات أقل</strong> من TDEE. هذا الفرق يسمى <strong>عجز السعرات (Calorie Deficit)</strong>.</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>العجز اليومي</th><th>خسارة أسبوعية</th><th>الاستدامة</th></tr></thead>
            <tbody>
                <tr><td>250 سعرة</td><td>~0.25 كجم</td><td>مستدام جداً — بدون جوع</td></tr>
                <tr><td><strong>500 سعرة</strong></td><td><strong>~0.5 كجم</strong></td><td><strong>مُوصى به — المعيار الذهبي ✅</strong></td></tr>
                <tr><td>750 سعرة</td><td>~0.75 كجم</td><td>معتدل — بعض الجوع</td></tr>
                <tr><td>1,000 سعرة</td><td>~1.0 كجم</td><td>مكثف — خطر خسارة العضلات</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">⚠️</span>
        <div>
            <strong>الحد الأدنى الآمن:</strong> لا تنزل أبداً تحت <strong>1,200 سعرة/يوم</strong> (للنساء) أو <strong>1,500 سعرة/يوم</strong> (للرجال) بدون إشراف طبي. التقييد الشديد يسبب خسارة العضلات، نقص العناصر الغذائية، وضرر في الأيض.
        </div>
    </div>

    <h2 id="uae-food-calories">دليل السعرات الحرارية — أطعمة إماراتية وعربية شائعة</h2>
    <p>معرفة السعرات في الأطعمة الشائعة تساعدك على اتخاذ قرارات غذائية أفضل:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الطعام</th><th>الحصة</th><th>السعرات</th><th>بروتين</th><th>كربوهيدرات</th><th>دهون</th></tr></thead>
            <tbody>
                <tr><td><strong>مجبوس دجاج</strong></td><td>كوب (236 غ)</td><td>354 سعرة</td><td>18 غ</td><td>42 غ</td><td>12 غ</td></tr>
                <tr><td><strong>هريس لحم</strong></td><td>200 غ</td><td>250 سعرة</td><td>12 غ</td><td>30 غ</td><td>8 غ</td></tr>
                <tr><td><strong>لقيمات مع دبس</strong></td><td>6 قطع</td><td>240 سعرة</td><td>3 غ</td><td>38 غ</td><td>9 غ</td></tr>
                <tr><td><strong>بلاليط</strong></td><td>حصة واحدة</td><td>313 سعرة</td><td>8 غ</td><td>45 غ</td><td>12 غ</td></tr>
                <tr><td><strong>شاورما دجاج</strong></td><td>لفة واحدة</td><td>450 سعرة</td><td>30 غ</td><td>40 غ</td><td>20 غ</td></tr>
                <tr><td><strong>فتوش</strong></td><td>طبق</td><td>180 سعرة</td><td>3 غ</td><td>18 غ</td><td>10 غ</td></tr>
                <tr><td><strong>حمص</strong></td><td>100 غ</td><td>166 سعرة</td><td>8 غ</td><td>14 غ</td><td>10 غ</td></tr>
                <tr><td><strong>فطائر جبن</strong></td><td>قطعتان</td><td>210 سعرة</td><td>7 غ</td><td>22 غ</td><td>10 غ</td></tr>
                <tr><td><strong>سمبوسة</strong></td><td>قطعة</td><td>120 سعرة</td><td>3 غ</td><td>12 غ</td><td>7 غ</td></tr>
                <tr><td><strong>تمر مدجول</strong></td><td>حبتان (50 غ)</td><td>110 سعرة</td><td>1 غ</td><td>26 غ</td><td>0 غ</td></tr>
                <tr><td><strong>شاي كرك</strong></td><td>كوب</td><td>180 سعرة</td><td>3 غ</td><td>28 غ</td><td>6 غ</td></tr>
                <tr><td><strong>قهوة عربية</strong></td><td>فنجان</td><td>2 سعرة</td><td>0 غ</td><td>0 غ</td><td>0 غ</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">☕</span>
        <div>
            <strong>تنبيه الكرك:</strong> كوب شاي كرك واحد = 180 سعرة. إذا تشرب 3 أكواب يومياً = <strong>540 سعرة</strong> — أي ربع احتياجاتك اليومية من مشروب واحد! القهوة العربية بدون سكر = 2 سعرة فقط.
        </div>
    </div>

    <h2 id="macros">توزيع المغذيات الكبرى — بروتين، كربوهيدرات، دهون</h2>
    <p>بينما <strong>إجمالي السعرات</strong> يحدد تغيّر الوزن، فإن <strong>نسب المغذيات الكبرى</strong> تؤثر على تكوين الجسم والشبع ومستوى الطاقة:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الهدف</th><th>بروتين</th><th>كربوهيدرات</th><th>دهون</th></tr></thead>
            <tbody>
                <tr><td><strong>خسارة وزن (متوازن) ✅</strong></td><td>30%</td><td>40%</td><td>30%</td></tr>
                <tr><td>خسارة وزن (بروتين عالي)</td><td>35%</td><td>35%</td><td>30%</td></tr>
                <tr><td>بناء عضلات</td><td>30%</td><td>50%</td><td>20%</td></tr>
                <tr><td>الحفاظ على الوزن</td><td>25%</td><td>50%</td><td>25%</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>نصيحة البروتين:</strong> أثناء عجز السعرات، استهدف <strong>1.6–2.4 غ بروتين لكل كجم وزن</strong> يومياً للحفاظ على كتلتك العضلية. لشخص وزنه 80 كجم: 128–192 غ بروتين/يوم.</p>

    <h2 id="mohap-guidelines">إرشادات وزارة الصحة ووقاية المجتمع (MOHAP)</h2>
    <p>أطلقت <strong>وزارة الصحة ووقاية المجتمع</strong> عدة مبادرات لتحسين التغذية في الإمارات:</p>

    <h3>دليل برج خليفة الغذائي</h3>
    <p>الدليل البصري الرسمي للتغذية في الإمارات يستخدم شكل <strong>برج خليفة</strong> مقسماً إلى <strong>6 مجموعات غذائية</strong> ملونة:</p>
    <ul>
        <li><strong>الحبوب والنشويات</strong> — القاعدة الأوسع (الأكثر استهلاكاً)</li>
        <li><strong>الخضراوات</strong> — ثاني أكبر مجموعة</li>
        <li><strong>الفواكه</strong></li>
        <li><strong>منتجات الألبان</strong></li>
        <li><strong>اللحوم والبروتينات</strong></li>
        <li><strong>الدهون والزيوت</strong> — أصغر مجموعة (أقل استهلاكاً)</li>
        <li><strong>الماء</strong> — في القاعدة يرمز لأهميته الأساسية</li>
    </ul>

    <h3>الاستراتيجية الغذائية الوطنية 2022-2030</h3>
    <p>أطلقت MOHAP <strong>الاستراتيجية الغذائية الوطنية 2022-2030</strong> بأهداف:</p>
    <ul>
        <li>تقليل التقزم عند الأطفال تحت 5 سنوات</li>
        <li>زيادة معدلات الرضاعة الطبيعية الحصرية</li>
        <li>وقف ارتفاع معدلات السمنة عند أطفال المدارس والمراهقين</li>
        <li>بناء أنظمة غذائية مستدامة ومرنة</li>
        <li>توفير تثقيف غذائي شامل عبر المنظومة الصحية</li>
    </ul>

    <h3>إرشادات 2019 (المعتمدة)</h3>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المغذي</th><th>الإرشاد</th></tr></thead>
            <tbody>
                <tr><td>الكربوهيدرات</td><td>≥ 50% من إجمالي السعرات</td></tr>
                <tr><td>البروتين</td><td>10-15% من إجمالي السعرات</td></tr>
                <tr><td>الدهون الكلية</td><td>≤ 30% من إجمالي السعرات</td></tr>
                <tr><td>الدهون المشبعة</td><td>< 10% من إجمالي السعرات</td></tr>
                <tr><td>الألياف</td><td>≥ 25 غ/يوم</td></tr>
                <tr><td>الصوديوم (ملح)</td><td>< 2,000 ملغ/يوم (5 غ ملح)</td></tr>
                <tr><td>السكر المضاف</td><td>< 10% من إجمالي السعرات</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="ramadan">التغذية في رمضان — إدارة السعرات أثناء الصيام</h2>
    <p>خلال رمضان تتركز فترة الأكل في وجبتين رئيسيتين — <strong>الإفطار</strong> عند غروب الشمس و<strong>السحور</strong> قبل الفجر. هدفك اليومي من السعرات <strong>يبقى نفسه</strong> — فقط يتوزع على وقت أقل.</p>

    <h3>نصائح الإفطار</h3>
    <ul>
        <li><strong>افتح بـ 2-3 تمرات + ماء أو لبن</strong> (~170 سعرة) — السنّة النبوية وأفضل طريقة لإعداد المعدة</li>
        <li><strong>انتظر 15-20 دقيقة</strong> ثم تناول وجبة متوازنة</li>
        <li><strong>أولوية للبروتين + الخضراوات</strong> قبل الأرز والنشويات</li>
        <li><strong>تجنب المقالي</strong> — السمبوسة والسبرنغ رول مليئة بالسعرات الفارغة</li>
        <li><strong>اشرب ماء وليس عصائر محلّاة</strong> — عصير الفيمتو الكبير = 300+ سعرة</li>
    </ul>

    <h3>نصائح السحور</h3>
    <ul>
        <li><strong>أطعمة بطيئة الهضم</strong> — شوفان، بيض، لبن، خبز أسمر</li>
        <li><strong>بروتين كافي</strong> لتحمّل ساعات الصيام الطويلة</li>
        <li><strong>اشرب 2-3 أكواب ماء</strong> بين الإفطار والسحور</li>
        <li><strong>تجنب الأطعمة المالحة</strong> التي تزيد العطش أثناء الصيام</li>
    </ul>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">🌙</span>
        <div>
            <strong>حقيقة مهمة:</strong> كثيرون <strong>يزيد</strong> وزنهم في رمضان بسبب وجبات الإفطار الكبيرة والحلويات. هدفك اليومي من السعرات يبقى نفسه — فقط وزّعه على الإفطار والسحور بذكاء.
        </div>
    </div>

    <h2 id="intermittent-fasting">الصيام المتقطع في الإمارات</h2>
    <p><strong>الصيام المتقطع (16:8)</strong> — صيام 16 ساعة مع نافذة أكل 8 ساعات — اكتسب شعبية كبيرة في الإمارات، خاصة لتوافقه مع <strong>تقليد صيام رمضان</strong>. الأبحاث تشير إلى فوائد:</p>
    <ul>
        <li><strong>تقليل تلقائي</strong> في السعرات المستهلكة بنسبة 10-25%</li>
        <li><strong>تحسين حساسية الإنسولين</strong> — مهم لمن لديهم مقاومة إنسولين</li>
        <li><strong>زيادة حرق الدهون</strong> — خاصة في الساعات الأخيرة من الصيام</li>
        <li><strong>سهولة الالتزام</strong> — بساطة القاعدة (متى تأكل، ليس ماذا تأكل)</li>
    </ul>
    <p>لكنه <strong>ليس سحراً</strong> — السعرات الإجمالية هي ما يحدد خسارة أو زيادة الوزن. يمكنك الإفراط في الأكل حتى في نافذة 8 ساعات.</p>

    <h2 id="bmi-guide">مؤشر كتلة الجسم (BMI) — دليل مرجعي</h2>
    <p><strong>مؤشر كتلة الجسم (BMI)</strong> يُقيّم وزنك بالنسبة لطولك. المعادلة: BMI = الوزن (كجم) ÷ الطول² (م²).</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>BMI</th><th>التصنيف</th><th>المخاطر الصحية</th></tr></thead>
            <tbody>
                <tr><td>أقل من 18.5</td><td>نقص في الوزن</td><td>نقص مناعة، هشاشة عظام</td></tr>
                <tr><td><strong>18.5 – 24.9</strong></td><td><strong>وزن طبيعي ✅</strong></td><td><strong>أقل مخاطر صحية</strong></td></tr>
                <tr><td>25.0 – 29.9</td><td>زيادة في الوزن</td><td>ضغط دم، كوليسترول</td></tr>
                <tr><td>30.0 – 34.9</td><td>سمنة درجة أولى</td><td>سكري نوع 2، أمراض قلب</td></tr>
                <tr><td>35.0 – 39.9</td><td>سمنة درجة ثانية</td><td>مخاطر عالية</td></tr>
                <tr><td>40.0+</td><td>سمنة مفرطة</td><td>مخاطر عالية جداً</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>ملاحظة:</strong> BMI لا يميّز بين الدهون والعضلات. الرياضيون وبناة الأجسام قد يكون BMI لديهم مرتفعاً بسبب الكتلة العضلية — وهذا طبيعي. استخدم BMI كمؤشر عام وليس تشخيصاً نهائياً.</p>

    <h2 id="tips">10 نصائح لتقليل السعرات بدون جوع</h2>
    <ol>
        <li><strong>اشرب كوب ماء قبل كل وجبة</strong> — يملأ المعدة ويقلل كمية الأكل بنسبة 13%</li>
        <li><strong>قلل الكرك</strong> — استبدل بقهوة عربية (2 سعرة) أو شاي أخضر (0 سعرة)</li>
        <li><strong>تناول بروتين كل وجبة</strong> — يعطي شعور شبع أطول (بيض، دجاج، لبن يوناني)</li>
        <li><strong>استخدم أطباق أصغر</strong> — خدعة بصرية تقلل حجم الحصة 20-30%</li>
        <li><strong>لا تتخطَّ الفطور</strong> — يؤدي لتناول كميات أكبر في الوجبات اللاحقة</li>
        <li><strong>اقرأ ملصقات الأغذية</strong> — انتبه لحجم الحصة (وليس فقط السعرات لكل 100 غ)</li>
        <li><strong>تحرّك أثناء استراحة العمل</strong> — 10 دقائق مشي × 3 = 30 دقيقة نشاط يومي</li>
        <li><strong>نم 7-8 ساعات</strong> — قلة النوم ترفع هرمون الجوع (غريلين) بنسبة 15%</li>
        <li><strong>طبق قاعدة النصف</strong> — نصف طبقك خضراوات، ربع بروتين، ربع نشويات</li>
        <li><strong>تجنب الأكل أمام الشاشات</strong> — يرتبط بزيادة 25% في استهلاك السعرات</li>
    </ol>

    <h2 id="calories-vs-kj">السعرات الحرارية مقابل الكيلو جول</h2>
    <p>ملصقات الأغذية في الإمارات تعرض عادة كلا الوحدتين:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الوحدة</th><th>التحويل</th><th>ملاحظة</th></tr></thead>
            <tbody>
                <tr><td><strong>1 كيلو كالوري (kcal)</strong></td><td>= 4.184 كيلو جول (kJ)</td><td>الوحدة الشائعة في الإمارات والعالم العربي</td></tr>
                <tr><td><strong>1 كيلو جول (kJ)</strong></td><td>= 0.239 كيلو كالوري</td><td>الوحدة الرسمية في النظام الدولي</td></tr>
            </tbody>
        </table>
    </div>
    <p>عندما نقول "طبق 500 سعرة" نقصد <strong>500 كيلو كالوري</strong> = 2,092 كيلو جول. النظام الأمريكي والعربي يستخدم "سعرة/كالوري" بشكل شائع.</p>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات تقريبية</strong> بناءً على معادلة Mifflin-St Jeor. الاحتياجات الفعلية تختلف حسب عوامل مثل معدل الأيض الفعلي، الحالة الصحية، والأدوية المستخدمة. للحميات الطبية أو إنقاص الوزن بأكثر من 5 كجم، استشر طبيباً أو أخصائي تغذية مُرخّص.
    </p>
`;
