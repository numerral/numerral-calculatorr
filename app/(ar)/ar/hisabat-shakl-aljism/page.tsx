// Standalone page — /ar/hisabat-shakl-aljism
// حاسبة تحديد شكل الجسم — Arabic Body Shape Calculator
// 7 body shapes + WHR health + somatotypes + exercise & fashion recs

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import BodyShapeCalculatorCore from "@/components/calculator/BodyShapeCalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة تحديد شكل الجسم — Body Shape Calculator (2026)",
    description: "اكتشف شكل جسمك من قياساتك (صدر، خصر، وركين) — 7 أنواع أجسام مع نسبة الخصر للورك (WHR) والمخاطر الصحية. تشمل توصيات التمارين والملابس المناسبة لكل شكل جسم والأنماط الجسمانية الثلاثة.",
    keywords: ["حاسبة شكل الجسم", "معرفة شكل الجسم", "body shape calculator", "نوع الجسم", "ساعة رملية", "كمثرى", "مستطيل", "مثلث مقلوب", "WHR", "نسبة الخصر للورك", "أشكال الجسم للنساء", "أشكال الجسم للرجال"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-shakl-aljism` },
};

const FAQ_ITEMS = [
    { question: "كيف أعرف شكل جسمي؟", answer: "أدخل 4 قياسات في الحاسبة: محيط الصدر (أعرض نقطة)، محيط الخصر (أضيق جزء فوق السرة)، محيط الوركين (أعرض نقطة أسفل الخصر)، وأعلى الورك (عند عظمة الحوض). الحاسبة تقارن النسب بين هذه القياسات لتحديد شكلك من بين 7 أشكال: الساعة الرملية، الساعة الرملية العلوي/السفلي، الملعقة، الكمثرى، المثلث المقلوب، والمستطيل." },
    { question: "ما هي أشكال الجسم السبعة؟", answer: "1) الساعة الرملية — صدر ووركان متناسبان مع خصر محدد. 2) الساعة الرملية العلوي — خصر محدد مع صدر أكبر. 3) الساعة الرملية السفلي — خصر محدد مع وركين أكبر. 4) الملعقة — وركان كبيران جداً مع خصر محدد. 5) الكمثرى/المثلث — جزء علوي نحيل مع وركين عريضين. 6) المثلث المقلوب — أكتاف عريضة ووركان ضيقان. 7) المستطيل — قياسات متقاربة." },
    { question: "ما هي نسبة الخصر للورك (WHR) ولماذا هي مهمة؟", answer: "WHR = محيط الخصر ÷ محيط الوركين. هذه النسبة مؤشر على توزيع الدهون في الجسم. حسب منظمة الصحة العالمية: نساء WHR > 0.85 = خطر مرتفع. رجال WHR > 0.90 = خطر مرتفع. ارتفاع WHR يرتبط بزيادة مخاطر أمراض القلب والسكري نوع 2 وارتفاع ضغط الدم." },
    { question: "كيف آخذ قياسات جسمي بدقة؟", answer: "1) الصدر: شريط قياس حول أعرض نقطة — خذ نفساً عادياً. 2) الخصر: حول أضيق جزء من الجذع (فوق السرة) — لا تشد بطنك. 3) الوركين: حول أعرض نقطة (الأرداف) — ضم قدميك. 4) أعلى الورك: حول أعلى عظمة الحوض (ليس أعرض نقطة). استخدم شريط قياس ناعم، قف مستقيماً، والشريط مستوٍ وغير مشدود." },
    { question: "ما هو شكل الجسم الساعة الرملية؟", answer: "الساعة الرملية (Hourglass) يتميز بتوازن بين الصدر والوركين مع خصر محدد بوضوح. القياسات: الصدر والوركين متقاربان (فرق ≤ 2.5 سم) والخصر أصغر بـ 23+ سم من كليهما. يُعتبر من أكثر الأشكال تناسقاً. تمارين القوة الشاملة واليوغا مثالية للحفاظ على هذا التناسق." },
    { question: "ما هو شكل الجسم الكمثرى (المثلث)؟", answer: "شكل الكمثرى (Pear/Triangle) يتميز بجزء علوي نحيل مع وركين عريضين أعرض من الكتفين. الدهون تتراكم في الأرداف والفخذين. للتوازن: ركّز على تمارين الجزء العلوي (كتف، صدر، ظهر). ملابس: ألوان فاتحة وتفاصيل في الأعلى، ألوان داكنة في الأسفل." },
    { question: "هل شكل الجسم يتغير مع الوقت؟", answer: "نعم. شكل الجسم يمكن أن يتغير بسبب: 1) التغيرات الهرمونية (بلوغ، حمل، سن اليأس). 2) التمارين الرياضية (بناء عضلات يغيّر النسب). 3) تغير الوزن (زيادة أو نقصان). 4) التقدم في العمر (إعادة توزيع الدهون). لكن الهيكل العظمي (عرض الأكتاف والوركين) يبقى ثابتاً." },
    { question: "ما الفرق بين شكل الجسم ومؤشر كتلة الجسم (BMI)؟", answer: "BMI يقيس الوزن بالنسبة للطول — لا يميّز بين الدهون والعضلات ولا يحدد أين تتوزع الدهون. شكل الجسم + WHR يكشفان توزيع الدهون — وهو أهم صحياً. شخص BMI طبيعي قد يكون WHR مرتفع (دهون بطنية) = خطر صحي. الاثنان معاً يعطيان صورة أشمل." },
    { question: "ما هي الأنماط الجسمانية الثلاثة (Somatotypes)؟", answer: "1) إكتومورف (Ectomorph): نحيل، أطراف طويلة، صعوبة في زيادة الوزن والعضلات. 2) ميزومورف (Mesomorph): رياضي، يكسب العضلات بسهولة، كتف عريض وخصر ضيق. 3) إندومورف (Endomorph): ممتلئ، يخزن الدهون بسهولة خاصة حول الوسط. معظم الناس مزيج من نوعين." },
    { question: "ما هي التمارين المناسبة لكل شكل جسم؟", answer: "الساعة الرملية: تمارين شاملة + يوغا. الكمثرى: تمارين الجزء العلوي (كتف، ظهر). المثلث المقلوب: تمارين الجزء السفلي (سكوات، لانجز). المستطيل: تمارين لبناء المنحنيات (هيب ثرست، أكتاف). الملعقة: سباحة وتجديف. الهدف دائماً: تعزيز التوازن بين أجزاء الجسم." },
    { question: "هل شكل التفاحة خطير صحياً؟", answer: "نعم. شكل التفاحة (دهون حول البطن) يرتبط بأعلى مخاطر صحية: أمراض القلب والأوعية، السكري نوع 2، ارتفاع ضغط الدم، متلازمة الأيض. WHR > 0.85 (نساء) أو > 0.90 (رجال) يعني خطر مرتفع. دهون البطن (Visceral Fat) أخطر من دهون الأرداف والفخذين (Subcutaneous Fat)." },
    { question: "كيف أعرف الملابس المناسبة لشكل جسمي؟", answer: "القاعدة العامة: أبرز نقاط القوة وأوهم بالتناسق. الكمثرى: فاتح فوق + داكن تحت. المثلث المقلوب: داكن فوق + فاتح تحت. المستطيل: أحزمة لتحديد الخصر. الساعة الرملية: ملابس محددة للجسم. استخدم الحاسبة أعلاه ثم اطّلع على تبويب 'دليل الملابس' للحصول على توصيات مخصصة." },
    { question: "هل يمكن تغيير شكل الجسم بالتمارين؟", answer: "جزئياً. لا يمكنك تغيير الهيكل العظمي (عرض الأكتاف والوركين)، لكن يمكنك: 1) بناء عضلات في مناطق محددة (أكتاف، أرداف). 2) تقليل الدهون بشكل عام. 3) تحسين تحديد الخصر بتمارين Core. مثال: المستطيل يمكن أن يقترب من الساعة الرملية ببناء أكتاف وأرداف مع تمارين خصر." },
    { question: "ما هو الفرق بين شكل الجسم للرجال والنساء؟", answer: "النساء يوزعن الدهون في الوركين والفخذين (شكل الكمثرى أكثر شيوعاً). الرجال يوزعون الدهون في البطن (شكل التفاحة/المستطيل أكثر شيوعاً). الهرمونات (إستروجين vs تستوستيرون) تؤثر بشكل كبير. بعد سن اليأس عند النساء، يتحول التوزيع ليشبه الرجال." },
    { question: "كيف أقيس محيط الخصر والوركين بنفسي؟", answer: "الخصر: قف أمام مرآة، ضع الشريط حول أضيق نقطة (عادة فوق السرة بقليل). لا تشد بطنك. الوركين: ضع الشريط حول أعرض نقطة (الأرداف) مع ضم القدمين. تأكد أن الشريط مستوٍ من جميع الجوانب. أعلى الورك: ضع الشريط حول عظمة الحوض العلوية (أعلى من أعرض نقطة). قيسي 3 مرات وخذي المتوسط." },
];

export default function BodyShapeCalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة شكل الجسم", item: `${SITE_URL}/ar/hisabat-shakl-aljism` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة تحديد شكل الجسم",
            url: `${SITE_URL}/ar/hisabat-shakl-aljism`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "اكتشف شكل جسمك من القياسات مع نسبة الخصر للورك وتوصيات التمارين والملابس",
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
            <Script id="schema-bodyshape-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة شكل الجسم</span>
            </nav>

            <h1 className="ar-page__title">📏 حاسبة تحديد شكل الجسم (2026)</h1>
            <p className="ar-page__subtitle">
                اكتشف شكل جسمك من خلال إدخال قياساتك (الصدر، الخصر، الوركين). تحدد الحاسبة نوع جسمك من بين 7 أشكال، مع نسبة الخصر للورك (WHR) كمؤشر صحي، وتوصيات التمارين والملابس المناسبة لكل شكل — مع شرح الأنماط الجسمانية الثلاثة (إكتومورف، ميزومورف، إندومورف).
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <BodyShapeCalculatorCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة شكل الجسم</h2>
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
                    <Link href="/ar/hisabat-ratib" className="ar-related__card">
                        <span className="ar-related__icon">💵</span>
                        <span className="ar-related__name">حاسبة الراتب</span>
                    </Link>
                    <Link href="/ar/hisabat-nisba-miwiya" className="ar-related__card">
                        <span className="ar-related__icon">📐</span>
                        <span className="ar-related__name">حاسبة النسبة المئوية</span>
                    </Link>
                    <Link href="/ar/nitaqat-calculator" className="ar-related__card">
                        <span className="ar-related__icon">🏢</span>
                        <span className="ar-related__name">حاسبة نطاقات</span>
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
    <h2 id="what-are-body-shapes">ما هي أشكال الجسم؟</h2>
    <p>لكل شخص <strong>نسب جسمانية فريدة</strong> تحدد شكل جسمه. هذه النسب تعتمد على توزيع العظام والعضلات والدهون بين ثلاث مناطق رئيسية: <strong>الأكتاف/الصدر</strong>، <strong>الخصر</strong>، و<strong>الوركين/الأرداف</strong>. معرفة شكل جسمك تساعدك في:</p>
    <ul>
        <li><strong>اختيار الملابس المناسبة</strong> التي تُبرز نقاط القوة وتوازن النسب</li>
        <li><strong>تخطيط التمارين الرياضية</strong> لتعزيز التناسق الجسماني</li>
        <li><strong>فهم المخاطر الصحية</strong> — توزيع الدهون يكشف مخاطر أمراض القلب والسكري</li>
        <li><strong>وضع أهداف واقعية</strong> للياقة البدنية بما يتناسب مع طبيعة جسمك</li>
    </ul>

    <h2 id="seven-body-shapes">أنواع أشكال الجسم السبعة</h2>

    <h3>1. الساعة الرملية ⌛ (Hourglass)</h3>
    <p>يتميز بـ <strong>صدر ووركين متناسبين</strong> مع <strong>خصر محدد بوضوح</strong>. يُعتبر من أكثر الأشكال تناسقاً في عالم الأزياء.</p>
    <p><strong>المعادلة:</strong> الفرق بين الصدر والوركين ≤ 2.5 سم، والخصر أصغر من كليهما بـ 23+ سم.</p>

    <h3>2. الساعة الرملية العلوي ⌛ (Top Hourglass)</h3>
    <p>مشابه للساعة الرملية مع <strong>صدر أكبر بشكل واضح</strong> مقارنة بالوركين. الخصر محدد جيداً.</p>
    <p><strong>المعادلة (نساء):</strong> (الصدر − الوركين) > 2.5 سم و< 25 سم، والخصر أصغر من الصدر بـ 23+ سم.</p>

    <h3>3. الساعة الرملية السفلي ⌛ (Bottom Hourglass)</h3>
    <p>خصر محدد مع <strong>وركين أكبر وصدر أصغر</strong> نسبياً.</p>
    <p><strong>المعادلة (نساء):</strong> (الوركين − الصدر) ≥ 9 سم و≤ 25 سم، ونسبة الوركين/الخصر ≥ 1.193.</p>

    <h3>4. الملعقة 🥄 (Spoon)</h3>
    <p>الوركان <strong>أكبر بكثير</strong> من الصدر مع خصر محدد جيداً — يخلق مظهراً يشبه الرف عند الوركين.</p>
    <p><strong>المعادلة:</strong> الوركين أكبر من الصدر بـ 5+ سم، ونسبة أعلى الورك/الخصر ≥ 1.1.</p>

    <h3>5. المثلث / الكمثرى 🍐 (Triangle / Pear)</h3>
    <p>الجزء العلوي نحيل مع <strong>وركين عريضين</strong> أعرض من الكتفين. الدهون تتراكم في الأرداف والفخذين.</p>
    <p><strong>المعادلة (نساء):</strong> (الوركين − الصدر) ≥ 9 سم و(الوركين − الخصر) < 23 سم.</p>

    <h3>6. المثلث المقلوب 🔻 (Inverted Triangle)</h3>
    <p><strong>أكتاف وصدر عريضان</strong> مع وركين ضيقين — شكل V. شائع عند الرجال الرياضيين.</p>
    <p><strong>المعادلة (نساء):</strong> (الصدر − الوركين) ≥ 9 سم و(الصدر − الخصر) < 23 سم.</p>

    <h3>7. المستطيل ▬ (Rectangle)</h3>
    <p>الصدر والوركان والخصر بنفس الحجم تقريباً — مظهر <strong>رياضي مستقيم</strong> بدون منحنيات واضحة.</p>
    <p><strong>المعادلة (نساء):</strong> الفرق بين الصدر والوركين < 9 سم في كلا الاتجاهين.</p>

    <h2 id="how-to-measure">كيف تأخذ قياساتك بدقة</h2>
    <p>دقة القياسات تحدد دقة النتيجة. اتبع هذه الخطوات:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>القياس</th><th>الموقع</th><th>النصيحة</th></tr></thead>
            <tbody>
                <tr><td><strong>محيط الصدر</strong></td><td>أعرض نقطة من الصدر</td><td>خذ نفساً عادياً — لا تشد الصدر</td></tr>
                <tr><td><strong>محيط الخصر</strong></td><td>أضيق جزء من الجذع (فوق السرة)</td><td>لا تشد بطنك — الشريط مناسب بدون حفر</td></tr>
                <tr><td><strong>محيط الوركين</strong></td><td>أعرض نقطة أسفل الخصر (الأرداف)</td><td>ضم قدميك — اخلع الملابس السميكة</td></tr>
                <tr><td><strong>أعلى الورك</strong></td><td>عند أعلى عظمة الحوض (فوق أعرض نقطة)</td><td>حدد البروز العلوي لعظمة الحوض</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">💡</span>
        <div>
            <strong>نصائح الدقة:</strong> قف مستقيماً أمام مرآة. استخدم شريط قياس ناعم (ليس معدنياً). تأكد أن الشريط مستوٍ من جميع الجوانب. قيس 3 مرات وخذ المتوسط. الأفضل: صباحاً قبل الأكل.
        </div>
    </div>

    <h2 id="whr-health">نسبة الخصر إلى الورك (WHR) — مؤشر صحي مهم</h2>
    <p><strong>WHR = محيط الخصر ÷ محيط الوركين</strong>. هذه النسبة تكشف توزيع الدهون في الجسم وترتبط مباشرة بالمخاطر الصحية. حسب <strong>منظمة الصحة العالمية (WHO)</strong>:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة</th><th>نساء</th><th>رجال</th><th>المخاطر</th></tr></thead>
            <tbody>
                <tr><td><strong>🟢 منخفض</strong></td><td>≤ 0.80</td><td>≤ 0.85</td><td>مخاطر طبيعية</td></tr>
                <tr><td><strong>🟡 متوسط</strong></td><td>0.81 – 0.85</td><td>0.86 – 0.90</td><td>مخاطر مرتفعة قليلاً</td></tr>
                <tr><td><strong>🔴 مرتفع</strong></td><td>> 0.85</td><td>> 0.90</td><td>أمراض قلب، سكري نوع 2، ضغط دم</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>لماذا دهون البطن أخطر؟</strong> الدهون حول الأعضاء الداخلية (Visceral Fat) تُفرز هرمونات التهابية ومواد كيميائية تزيد مقاومة الإنسولين وتضر الأوعية الدموية. هذا يختلف عن دهون الأرداف والفخذين (Subcutaneous Fat) التي تكون أقل ضرراً نسبياً.</p>

    <h2 id="somatotypes">الأنماط الجسمانية الثلاثة (Somatotypes)</h2>
    <p>نظرية الأنماط الجسمانية وضعها <strong>د. ويليام شيلدون</strong> في الأربعينيات وتصنّف الأجسام حسب البنية العامة والأيض. معظم الناس <strong>مزيج من نوعين</strong>:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>النوع</th><th>الخصائص</th><th>الأيض</th><th>التمارين المثالية</th></tr></thead>
            <tbody>
                <tr><td><strong>إكتومورف<br/>(Ectomorph)</strong></td><td>نحيل، أطراف طويلة، أكتاف ووركان ضيقان، عضلات قليلة</td><td>سريع — يصعب زيادة الوزن</td><td>تمارين قوة بأوزان ثقيلة، تقليل الكارديو، سعرات فائضة</td></tr>
                <tr><td><strong>ميزومورف<br/>(Mesomorph)</strong></td><td>رياضي، كتف عريض، خصر ضيق، يكسب العضلات بسهولة</td><td>متوازن — يستجيب للتمارين بسرعة</td><td>تمارين متنوعة (قوة + كارديو)، يتكيّف مع معظم البرامج</td></tr>
                <tr><td><strong>إندومورف<br/>(Endomorph)</strong></td><td>ممتلئ، يخزن الدهون بسهولة خاصة حول الوسط، هيكل عريض</td><td>بطيء — يصعب خسارة الدهون</td><td>HIIT + كارديو مكثف، تمارين قوة، تقليل الكربوهيدرات</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="exercise-per-shape">التمارين المناسبة لكل شكل جسم</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الشكل</th><th>الهدف</th><th>التمارين الموصى بها</th><th>تجنّب</th></tr></thead>
            <tbody>
                <tr><td><strong>الساعة الرملية ⌛</strong></td><td>الحفاظ على التناسق</td><td>تمارين شاملة، يوغا، بيلاتس، HIIT</td><td>التركيز الزائد على منطقة واحدة</td></tr>
                <tr><td><strong>الكمثرى 🍐</strong></td><td>تعزيز الجزء العلوي</td><td>تمارين كتف وظهر، ضغط صدر، سباحة</td><td>الإفراط في تمارين الفخذين</td></tr>
                <tr><td><strong>المثلث المقلوب 🔻</strong></td><td>تعزيز الجزء السفلي</td><td>سكوات، ديدلفت، لانجز، هيب ثرست</td><td>الإفراط في تمارين الأكتاف</td></tr>
                <tr><td><strong>المستطيل ▬</strong></td><td>بناء المنحنيات</td><td>سكوات، هيب ثرست للأرداف + تمارين كتف</td><td>الكارديو المفرط الذي يحرق العضلات</td></tr>
                <tr><td><strong>الملعقة 🥄</strong></td><td>تعزيز الإطار العلوي</td><td>سباحة، تجديف، تمارين أكتاف وظهر</td><td>—</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="fashion-guide">دليل الملابس حسب شكل الجسم</h2>
    <p>القاعدة الذهبية في الأزياء: <strong>أبرز نقاط القوة وأوهم بالتناسق</strong>:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الشكل</th><th>الأفضل</th><th>تجنّب</th></tr></thead>
            <tbody>
                <tr><td><strong>الساعة الرملية</strong></td><td>ملابس محددة للخصر، فساتين ملتفة، أحزمة</td><td>ملابس فضفاضة تخفي الخصر</td></tr>
                <tr><td><strong>الكمثرى</strong></td><td>ألوان فاتحة + تفاصيل فوق، ياقات عريضة، A-line</td><td>بنطلونات ضيقة بألوان فاتحة</td></tr>
                <tr><td><strong>المثلث المقلوب</strong></td><td>V-neck، بنطلونات بألوان فاتحة، تنانير ذات حجم</td><td>كتف مبطن، ياقات عريضة</td></tr>
                <tr><td><strong>المستطيل</strong></td><td>طبقات متعددة، أحزمة، خطوط أفقية عند الخصر</td><td>ملابس مستقيمة بدون تفاصيل</td></tr>
                <tr><td><strong>الملعقة</strong></td><td>ياقات عريضة، قمصان بتفاصيل، بنطلونات مستقيمة</td><td>جيوب على الوركين، ألوان فاتحة أسفل</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="shape-vs-bmi">شكل الجسم مقابل مؤشر كتلة الجسم (BMI)</h2>
    <p>كثير من الناس يعتمدون على <strong>BMI</strong> فقط لتقييم صحتهم. لكن BMI له قيود مهمة:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المقارنة</th><th>BMI</th><th>شكل الجسم + WHR</th></tr></thead>
            <tbody>
                <tr><td>ماذا يقيس؟</td><td>الوزن بالنسبة للطول</td><td>توزيع الدهون في الجسم</td></tr>
                <tr><td>يميّز العضلات عن الدهون؟</td><td>❌ لا</td><td>✅ جزئياً (WHR يكشف دهون البطن)</td></tr>
                <tr><td>يحدد موقع الدهون؟</td><td>❌ لا</td><td>✅ نعم (بطن vs أرداف)</td></tr>
                <tr><td>فائدة صحية؟</td><td>فحص أولي عام</td><td>تقييم أدق للمخاطر القلبية</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>الخلاصة:</strong> استخدم الاثنين معاً. شخص BMI طبيعي لكن WHR مرتفع = "نحيل من الخارج، سمين من الداخل" (TOFI) — وهو أخطر مما يبدو. لحساب BMI، استخدم <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a> التي تتضمن مؤشر BMI.</p>

    <h2 id="does-shape-change">هل يتغير شكل الجسم؟</h2>
    <p>نعم — شكل الجسم <strong>ليس ثابتاً</strong> تماماً. العوامل:</p>
    <ul>
        <li><strong>الهرمونات:</strong> البلوغ يوسّع الأكتاف (رجال) والوركين (نساء). الحمل يوسّع الوركين مؤقتاً. سن اليأس يعيد توزيع الدهون للبطن</li>
        <li><strong>التمارين:</strong> بناء كتف عريض يحوّل الكمثرى لشكل أقرب للساعة الرملية. بناء أرداف يحوّل المستطيل للساعة الرملية السفلي</li>
        <li><strong>تغير الوزن:</strong> زيادة الوزن تبرز الشكل الطبيعي (المناطق الأكثر تخزيناً). نقصان الوزن يقلل الفروق</li>
        <li><strong>العمر:</strong> مع التقدم في السن، يقل العضل ويُعاد توزيع الدهون — غالباً نحو البطن</li>
    </ul>
    <p><strong>لكن:</strong> الهيكل العظمي (عرض الأكتاف، عرض الحوض) ثابت ولا يتغير بالتمارين أو الحمية.</p>

    <h2 id="health-risks">شكل الجسم والمخاطر الصحية</h2>
    <p>ليست كل أشكال الجسم متساوية من الناحية الصحية. <strong>توزيع الدهون</strong> — وليس مجرد كميتها — يحدد المخاطر:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>التوزيع</th><th>الشكل المرتبط</th><th>نوع الدهون</th><th>المخاطر</th></tr></thead>
            <tbody>
                <tr><td><strong>دهون بطنية (تفاحة)</strong></td><td>المستطيل / الملعقة العكسي</td><td>Visceral (حول الأعضاء)</td><td>🔴 أمراض قلب، سكري نوع 2، ارتفاع ضغط، سكتة دماغية</td></tr>
                <tr><td><strong>دهون أرداف/فخذين (كمثرى)</strong></td><td>الكمثرى / الملعقة</td><td>Subcutaneous (تحت الجلد)</td><td>🟢 مخاطر أقل نسبياً — قد تكون وقائية</td></tr>
            </tbody>
        </table>
    </div>
    <p>بحث من <strong>Cleveland Clinic</strong> و<strong>NCBI</strong> يؤكد أن شكل التفاحة (دهون مركزية) أخطر من الكمثرى بنسبة 20-40% في حالات أمراض القلب والأوعية.</p>

    <h2 id="practical-tips">نصائح لتحسين تناسق الجسم</h2>
    <ol>
        <li><strong>حدد شكل جسمك أولاً</strong> — استخدم الحاسبة أعلاه</li>
        <li><strong>ركّز على نقاط الضعف</strong> — بناء عضلات في المناطق الأقل حجماً</li>
        <li><strong>لا تحاول تغيير هيكلك العظمي</strong> — اعمل مع طبيعة جسمك لا ضدها</li>
        <li><strong>الغذاء أهم من التمرين</strong> — لتقليل دهون البطن: عجز سعرات + بروتين كافي</li>
        <li><strong>أعطِ أولوية للصحة</strong> — WHR < 0.85 (نساء) / < 0.90 (رجال) أهم من المظهر</li>
        <li><strong>التمارين المركبة</strong> — سكوات، ديدلفت، ضغط — تبني جسماً متناسقاً أكثر من العزل</li>
        <li><strong>تحلّ بالصبر</strong> — تغيير النسب الجسمانية يحتاج شهوراً وليس أسابيع</li>
        <li><strong>تتبّع التقدم بالقياسات</strong> — وليس فقط بالميزان. الوزن وحده لا يكفي</li>
    </ol>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات تقريبية</strong> بناءً على النسب الجسمانية. الأشكال ليست تشخيصاً طبياً. لتقييم صحي شامل، استشر طبيبك — خاصة إذا كانت نسبة WHR في النطاق المرتفع.
    </p>
`;
