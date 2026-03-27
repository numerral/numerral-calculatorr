// Standalone page — /ar/hisabat-ihtiyaj-alma
// حاسبة احتياج الماء اليومي — Arabic Water Intake Calculator
// UAE-contextualized with DHA/MOHAP hydration guidelines

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import WaterIntakeCalculatorCore from "@/components/calculator/WaterIntakeCalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة احتياج الماء اليومي — Water Intake Calculator (2026)",
    description: "احسب كمية الماء التي تحتاجها يومياً حسب وزنك ومستوى نشاطك ومناخ بيئتك. تشمل معادلة هيئة الصحة بدبي (الوزن × 0.033)، جدول الترطيب المثالي، أطعمة غنية بالماء، ونصائح الترطيب في رمضان — مع مراعاة مناخ الإمارات الحار.",
    keywords: ["حاسبة الماء", "احتياج الماء اليومي", "water intake calculator", "كمية الماء حسب الوزن", "معدل شرب الماء", "ترطيب الجسم", "جفاف", "dehydration", "DHA guidelines", "MOHAP", "ماء رمضان"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-ihtiyaj-alma` },
};

const FAQ_ITEMS = [
    { question: "كم لتر ماء يحتاج الجسم يومياً؟", answer: "حسب هيئة الصحة بدبي (DHA): اضرب وزنك بالكيلوغرام × 0.033 = الاحتياج الأساسي باللتر. مثال: شخص 70 كجم يحتاج 70 × 0.033 = 2.31 لتر كحد أدنى. في مناخ الإمارات الحار (40°م+) تحتاج 0.5-1 لتر إضافي. التوصية العامة: 3-4 لتر للرجال و2-3 لتر للنساء." },
    { question: "كيف أعرف أنني أشرب ماء كافياً؟", answer: "أفضل مؤشر هو لون البول: أصفر فاتح شفاف = ترطيب جيد. أصفر غامق = تحتاج المزيد. شفاف تماماً بلا لون = قد تكون تفرط. أيضاً: إذا لم تشعر بالعطش خلال اليوم ولا تعاني من صداع أو تعب غير مبرر، فأنت على المسار الصحيح." },
    { question: "هل القهوة والشاي يُحتسبان من شرب الماء؟", answer: "نعم جزئياً. القهوة والشاي يحتويان على ماء لكن الكافيين مدر خفيف للبول — يفقدك 150-200 مل إضافية لكل كوب. الحاسبة تضيف تعويضاً تلقائياً. القهوة العربية (بدون كافيين زائد) أفضل من الكرك المحلّى. الماء النقي يبقى الخيار الأمثل." },
    { question: "كم ماء أشرب أثناء التمرين؟", answer: "قبل التمرين: 500 مل قبل ساعة. أثناء التمرين: 200-250 مل كل 15-20 دقيقة. بعد التمرين: 500-750 مل لكل نصف كجم مفقود من الوزن. في مناخ الإمارات الحار، زد الكميات بنسبة 25-50%. تمارين أكثر من ساعة تحتاج مشروب إلكتروليت (صوديوم + بوتاسيوم)." },
    { question: "ما هي أعراض الجفاف؟", answer: "أعراض خفيفة: عطش، جفاف الفم، بول غامق، صداع خفيف، تعب. أعراض متوسطة: دوار، قلة التبول، جلد جاف غير مرن. أعراض شديدة (تستلزم طبيب): إغماء، تسارع القلب، عدم تبول 8+ ساعات، عيون غائرة، ارتباك ذهني. فقدان 1% فقط من ماء الجسم يؤثر على الأداء البدني والعقلي." },
    { question: "كيف أشرب ماء كافياً في رمضان؟", answer: "بين الإفطار والسحور لديك ~8 ساعات. الخطة: (1) 2 كوب عند الإفطار مع التمر، (2) كوب كل 30-45 دقيقة بعد الإفطار (ليس دفعة واحدة)، (3) 2 كوب مع السحور. تجنب: المشروبات المحلاة والمالحة. أفضل: ماء بدرجة حرارة الغرفة، ماء جوز الهند. أطعمة غنية بالماء في السحور: خيار، بطيخ، لبن." },
    { question: "هل يمكن الإفراط في شرب الماء؟", answer: "نعم. حالة نادرة تسمى تسمم الماء (Hyponatremia) تحدث عند شرب كميات كبيرة جداً (5-6 لتر في ساعات قليلة) مما يخفف صوديوم الدم. الأعراض: غثيان، صداع شديد، تشنجات. الحد الآمن العام: لا تتجاوز 1 لتر في الساعة. الحاسبة توزع الكمية على 16 ساعة يقظة لتجنب هذا." },
    { question: "كم ماء تحتاج الحامل والمرضعة؟", answer: "الحامل: +300 مل يومياً فوق الاحتياج العادي (لدعم السائل الأمنيوسي وزيادة حجم الدم). المرضعة: +700 مل يومياً (لإنتاج الحليب). إجمالي: الحامل ≈ 2.7 لتر/يوم، المرضعة ≈ 3.2 لتر/يوم. استشيري طبيبتك للكمية الدقيقة حسب وضعك الصحي." },
    { question: "لماذا الترطيب مهم في مناخ الإمارات؟", answer: "الإمارات تصل حرارتها إلى 45°م+ في الصيف مع رطوبة عالية. هذا يزيد التعرق بشكل كبير — قد تفقد 1-2 لتر/ساعة في الخارج. هيئة الصحة بدبي توصي العمال في الخارج بشرب كوب كل 15-20 دقيقة. حتى في المكاتب المكيفة، التكييف يجفف الهواء ويزيد الفقد غير المحسوس." },
    { question: "ما هي الأطعمة الغنية بالماء؟", answer: "أعلى محتوى مائي: خيار (96%)، خس (95%)، طماطم (94%)، بطيخ (92%)، فراولة (91%)، شمام (90%)، برتقال (87%). هذه الأطعمة تساهم في 20-30% من احتياجك اليومي من الماء. أضفها لوجباتك خاصة في الصيف وفي سحور رمضان." },
    { question: "معدل شرب الماء حسب الوزن — الرجال؟", answer: "50 كجم = 1.75 لتر، 60 كجم = 2.1 لتر، 70 كجم = 2.31 لتر، 80 كجم = 2.64 لتر، 90 كجم = 2.97 لتر، 100 كجم = 3.3 لتر. هذه الأرقام الأساسية (بدون تمارين أو مناخ حار). في الإمارات أضف 0.5-1 لتر." },
    { question: "معدل شرب الماء حسب الوزن — النساء؟", answer: "50 كجم = 1.55 لتر، 60 كجم = 1.86 لتر، 70 كجم = 2.17 لتر، 80 كجم = 2.48 لتر، 90 كجم = 2.79 لتر، 100 كجم = 3.1 لتر. النساء يحتجن أقل قليلاً بسبب الفرق في كتلة الجسم. الحوامل والمرضعات يحتجن أكثر." },
    { question: "متى يجب شرب الماء — قبل أم بعد الأكل؟", answer: "قبل الأكل بـ 30 دقيقة: كوب ماء يحسن الهضم ويقلل كمية الأكل بنسبة 13% (مفيد لخسارة الوزن). أثناء الأكل: رشفات قليلة مقبولة. بعد الأكل: انتظر 30-60 دقيقة ثم اشرب بحرية. عند الاستيقاظ: كوبان على معدة فارغة ينشّطان الأيض." },
    { question: "هل ماء الصنبور آمن في الإمارات؟", answer: "نعم. ماء الصنبور في الإمارات يخضع لمعايير صارمة من هيئة الصحة. تحلية المياه بالتناضح العكسي تجعلها نظيفة ولكنها قد تكون قليلة المعادن. كثير من السكان يفضلون ماء العبوات أو فلاتر المنزل. الخيار الأرخص والأكثر استدامة: فلتر كربون منزلي + زجاجة قابلة لإعادة الاستخدام." },
    { question: "كم ماء يحتاج الطفل يومياً؟", answer: "حسب MOHAP: الأطفال 1-3 سنوات: 2-4 أكواب (500 مل - 1 لتر). الأطفال 4-8 سنوات: 1 لتر. الأطفال 9-12 سنة: 1.5 لتر. المراهقون 13-17 سنة: 2-2.5 لتر. في الصيف والنشاط الرياضي، زد الكمية بنسبة 30-50%. راقب لون البول كمؤشر." },
];

export default function WaterIntakeCalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة احتياج الماء", item: `${SITE_URL}/ar/hisabat-ihtiyaj-alma` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة احتياج الماء اليومي",
            url: `${SITE_URL}/ar/hisabat-ihtiyaj-alma`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسب كمية الماء اليومية حسب الوزن والنشاط والمناخ مع جدول ترطيب ودليل أطعمة",
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
            <Script id="schema-water-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة احتياج الماء</span>
            </nav>

            <h1 className="ar-page__title">💧 حاسبة احتياج الماء اليومي (2026)</h1>
            <p className="ar-page__subtitle">
                احسب كمية الماء التي تحتاجها يومياً حسب وزنك ومستوى نشاطك ومناخ بيئتك. تشمل الحاسبة معادلة هيئة الصحة بدبي (الوزن × 0.033)، تعديلات المناخ الحار والتمارين والكافيين والحمل، جدول الترطيب المثالي ساعة بساعة، ودليل الأطعمة الغنية بالماء — مصممة خصيصاً لمناخ الإمارات.
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <WaterIntakeCalculatorCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة احتياج الماء</h2>
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
                    <Link href="/ar/nitaqat-calculator" className="ar-related__card">
                        <span className="ar-related__icon">🏢</span>
                        <span className="ar-related__name">حاسبة نطاقات</span>
                    </Link>
                    <Link href="/ar/hisabat-dariba" className="ar-related__card">
                        <span className="ar-related__icon">🧾</span>
                        <span className="ar-related__name">حاسبة الضريبة</span>
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
    <h2 id="why-water">لماذا الماء مهم لجسمك؟</h2>
    <p>يتكون جسم الإنسان من حوالي <strong>60% ماء</strong>. هذه النسبة ليست موزعة بالتساوي — بعض الأعضاء تعتمد على الماء أكثر من غيرها:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>العضو</th><th>نسبة الماء</th></tr></thead>
            <tbody>
                <tr><td><strong>الرئتان</strong></td><td>83%</td></tr>
                <tr><td><strong>الكليتان والعضلات</strong></td><td>79%</td></tr>
                <tr><td><strong>الدماغ والقلب</strong></td><td>73%</td></tr>
                <tr><td><strong>الجلد</strong></td><td>64%</td></tr>
                <tr><td><strong>العظام</strong></td><td>31%</td></tr>
            </tbody>
        </table>
    </div>
    <p>بدون ماء كافٍ، لا يستطيع الجسم توزيع الماء بشكل صحيح لجميع الخلايا والأعضاء. يضطر للاختيار بين الأولويات — فتعمل عمليات حيوية عديدة بأقل من كفاءتها الطبيعية. هذا يؤثر على <strong>الأداء العقلي</strong> (تركيز، ذاكرة)، <strong>الأداء البدني</strong> (قوة، تحمّل)، <strong>الهضم</strong>، <strong>صحة الجلد</strong>، و<strong>صحة الكلى</strong>.</p>

    <h2 id="how-to-calculate">كيف تحسب احتياجك اليومي من الماء؟</h2>
    <h3>معادلة هيئة الصحة بدبي (DHA)</h3>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">💧</span>
        <div>
            <strong>المعادلة:</strong> الوزن بالكيلوغرام × 0.033 = الاحتياج الأساسي باللتر<br/>
            <strong>مثال:</strong> 70 كجم × 0.033 = <strong>2.31 لتر/يوم</strong> (9 أكواب تقريباً)
        </div>
    </div>
    <p>هذه المعادلة تعطي الاحتياج <strong>الأساسي</strong> فقط. يجب إضافة كميات حسب:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>العامل</th><th>الإضافة</th><th>السبب</th></tr></thead>
            <tbody>
                <tr><td><strong>مناخ حار (30-40°م)</strong></td><td>+500 مل</td><td>تعرق زائد</td></tr>
                <tr><td><strong>مناخ حار جداً (40°م+)</strong></td><td>+1,000 مل</td><td>صيف الإمارات — قد تفقد 1-2 لتر/ساعة</td></tr>
                <tr><td><strong>تمارين 30 دقيقة</strong></td><td>+340 مل</td><td>تعويض فقدان العرق</td></tr>
                <tr><td><strong>تمارين 60 دقيقة</strong></td><td>+680 مل</td><td>تعويض مضاعف</td></tr>
                <tr><td><strong>كوب قهوة/شاي (كافيين)</strong></td><td>+150 مل</td><td>تعويض تأثير الكافيين المدر</td></tr>
                <tr><td><strong>الحمل</strong></td><td>+300 مل</td><td>السائل الأمنيوسي وزيادة حجم الدم</td></tr>
                <tr><td><strong>الرضاعة</strong></td><td>+700 مل</td><td>إنتاج حليب الأم</td></tr>
            </tbody>
        </table>
    </div>

    <h3>التوصيات العامة — MOHAP/DHA</h3>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة</th><th>الكمية اليومية</th><th>المصدر</th></tr></thead>
            <tbody>
                <tr><td><strong>الرجال — عام</strong></td><td>3 – 4 لتر</td><td>DHA</td></tr>
                <tr><td><strong>النساء — عام</strong></td><td>2 – 3 لتر</td><td>DHA</td></tr>
                <tr><td><strong>التوصية الشائعة</strong></td><td>8 – 10 أكواب (2 – 2.5 لتر)</td><td>MOHAP</td></tr>
                <tr><td><strong>عمال الخارج (صيف)</strong></td><td>كوب كل 15-20 دقيقة</td><td>DHA</td></tr>
                <tr><td><strong>الأطفال 1-3 سنوات</strong></td><td>2-4 أكواب</td><td>MOHAP</td></tr>
                <tr><td><strong>الأطفال 5-8 سنوات</strong></td><td>1 لتر</td><td>MOHAP</td></tr>
                <tr><td><strong>الأطفال 9-12 سنة</strong></td><td>1.5 لتر</td><td>MOHAP</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="weight-table-men">معدل شرب الماء حسب الوزن — الرجال</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الوزن (كجم)</th><th>الأساس (لتر)</th><th>مع مناخ حار (لتر)</th><th>الأكواب (250 مل)</th></tr></thead>
            <tbody>
                <tr><td>50</td><td>1.65</td><td>2.15</td><td>9</td></tr>
                <tr><td>55</td><td>1.82</td><td>2.32</td><td>10</td></tr>
                <tr><td>60</td><td>1.98</td><td>2.48</td><td>10</td></tr>
                <tr><td>65</td><td>2.15</td><td>2.65</td><td>11</td></tr>
                <tr><td><strong>70</strong></td><td><strong>2.31</strong></td><td><strong>2.81</strong></td><td><strong>12</strong></td></tr>
                <tr><td>75</td><td>2.48</td><td>2.98</td><td>12</td></tr>
                <tr><td><strong>80</strong></td><td><strong>2.64</strong></td><td><strong>3.14</strong></td><td><strong>13</strong></td></tr>
                <tr><td>85</td><td>2.81</td><td>3.31</td><td>14</td></tr>
                <tr><td>90</td><td>2.97</td><td>3.47</td><td>14</td></tr>
                <tr><td>95</td><td>3.14</td><td>3.64</td><td>15</td></tr>
                <tr><td>100</td><td>3.30</td><td>3.80</td><td>16</td></tr>
                <tr><td>110</td><td>3.63</td><td>4.13</td><td>17</td></tr>
                <tr><td>120</td><td>3.96</td><td>4.46</td><td>18</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="weight-table-women">معدل شرب الماء حسب الوزن — النساء</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الوزن (كجم)</th><th>الأساس (لتر)</th><th>مع مناخ حار (لتر)</th><th>الأكواب (250 مل)</th></tr></thead>
            <tbody>
                <tr><td>45</td><td>1.49</td><td>1.99</td><td>8</td></tr>
                <tr><td>50</td><td>1.65</td><td>2.15</td><td>9</td></tr>
                <tr><td>55</td><td>1.82</td><td>2.32</td><td>10</td></tr>
                <tr><td><strong>60</strong></td><td><strong>1.98</strong></td><td><strong>2.48</strong></td><td><strong>10</strong></td></tr>
                <tr><td>65</td><td>2.15</td><td>2.65</td><td>11</td></tr>
                <tr><td><strong>70</strong></td><td><strong>2.31</strong></td><td><strong>2.81</strong></td><td><strong>12</strong></td></tr>
                <tr><td>75</td><td>2.48</td><td>2.98</td><td>12</td></tr>
                <tr><td>80</td><td>2.64</td><td>3.14</td><td>13</td></tr>
                <tr><td>85</td><td>2.81</td><td>3.31</td><td>14</td></tr>
                <tr><td>90</td><td>2.97</td><td>3.47</td><td>14</td></tr>
                <tr><td>100</td><td>3.30</td><td>3.80</td><td>16</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="uae-climate">الترطيب في مناخ الإمارات — لماذا تحتاج أكثر؟</h2>
    <p>الإمارات ذات <strong>مناخ صحراوي حار</strong>، تصل الحرارة إلى <strong>45°م+</strong> في الصيف مع <strong>رطوبة عالية</strong> في المناطق الساحلية (دبي، أبوظبي). هذا يعني:</p>
    <ul>
        <li><strong>التعرق المكثف:</strong> قد تفقد 1-2 لتر ماء في الساعة عند العمل أو الرياضة في الخارج</li>
        <li><strong>التكييف يجفف:</strong> حتى في المكاتب المكيفة، الهواء البارد يقلل الرطوبة ويزيد الفقد غير المحسوس عبر التنفس والجلد</li>
        <li><strong>التنقل بالسيارة:</strong> حرارة السيارة المتوقفة في الشمس قد تصل 60°م — اشرب قبل الركوب</li>
        <li><strong>الأطفال أكثر عرضة:</strong> نسبة المساحة السطحية للجسم أعلى عند الأطفال = فقدان ماء أسرع</li>
    </ul>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">☀️</span>
        <div>
            <strong>توصية DHA للعمال في الخارج:</strong> كوب ماء (250 مل) كل <strong>15-20 دقيقة</strong> أثناء العمل خارج المباني في الصيف. لا تنتظر حتى تشعر بالعطش — الشعور بالعطش يعني أنك فقدت 1% من ماء الجسم بالفعل.
        </div>
    </div>

    <h2 id="dehydration">أعراض الجفاف — من خفيف إلى خطير</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المستوى</th><th>الأعراض</th><th>الإجراء</th></tr></thead>
            <tbody>
                <tr><td><strong>🟡 خفيف (1-2%)</strong></td><td>عطش، جفاف الفم، بول غامق، صداع خفيف، تعب</td><td>اشرب كوبين ماء فوراً</td></tr>
                <tr><td><strong>🟠 متوسط (3-5%)</strong></td><td>دوار، قلة التبول، جلد جاف، تقلصات عضلية، ضعف تركيز</td><td>اشرب ماء ببطء + أملاح (ORS)</td></tr>
                <tr><td><strong>🔴 شديد (6%+)</strong></td><td>إغماء، تسارع القلب، عدم تبول 8+ ساعات، عيون غائرة، ارتباك</td><td>اذهب للطوارئ فوراً — قد تحتاج محاليل وريدية</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>قاعدة لون البول:</strong> أصفر فاتح شفاف = ترطيب ممتاز. أصفر غامق = تحتاج شرب المزيد. شفاف تماماً بدون لون = قد تكون تفرط (اشرب أقل قليلاً).</p>

    <h2 id="exercise">الماء والرياضة — بروتوكول الترطيب</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>التوقيت</th><th>الكمية</th><th>ملاحظات</th></tr></thead>
            <tbody>
                <tr><td><strong>قبل التمرين (ساعة)</strong></td><td>500 مل</td><td>ترطيب مسبق — ضروري في مناخ حار</td></tr>
                <tr><td><strong>أثناء التمرين</strong></td><td>200-250 مل كل 15-20 دقيقة</td><td>لا تنتظر العطش</td></tr>
                <tr><td><strong>بعد التمرين</strong></td><td>500-750 مل لكل 0.5 كجم مفقود</td><td>وزّن نفسك قبل وبعد لمعرفة الفقد</td></tr>
                <tr><td><strong>تمارين > 60 دقيقة</strong></td><td>+ مشروب إلكتروليت</td><td>صوديوم + بوتاسيوم لتعويض الأملاح</td></tr>
            </tbody>
        </table>
    </div>
    <p>في الإمارات، أغلب النوادي الرياضية مكيفة — لكن التعرق يظل عالياً بسبب شدة التمرين. زد الكميات بنسبة <strong>25-50%</strong> إذا كنت تتمرن في الخارج (جري على الكورنيش، Padel، إلخ). لحساب سعراتك مع الرياضة، استخدم <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a>.</p>

    <h2 id="ramadan">الترطيب في رمضان — خطة عملية</h2>
    <p>خلال رمضان، الصيام يمنع شرب الماء نهاراً. لديك <strong>~8 ساعات</strong> بين الإفطار والسحور لتعويض احتياجك. الخطة:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>التوقيت</th><th>الكمية</th><th>ملاحظات</th></tr></thead>
            <tbody>
                <tr><td><strong>عند الإفطار</strong></td><td>2 كوب (500 مل)</td><td>مع التمر — اشرب ببطء وليس دفعة واحدة</td></tr>
                <tr><td><strong>بين الإفطار والعشاء</strong></td><td>كوب كل 30-45 دقيقة</td><td>الأهم: التوزيع المنتظم</td></tr>
                <tr><td><strong>قبل التراويح</strong></td><td>كوب واحد</td><td>ترطيب خفيف</td></tr>
                <tr><td><strong>بعد التراويح</strong></td><td>1-2 كوب</td><td>تعويض</td></tr>
                <tr><td><strong>السحور</strong></td><td>2 كوب (500 مل)</td><td>+ أطعمة غنية بالماء (خيار، بطيخ، لبن)</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">🌙</span>
        <div>
            <strong>تجنب في رمضان:</strong> المشروبات عالية السكر (فيمتو، جلاب) — تزيد العطش. الأطعمة المالحة في السحور — تسحب الماء. الكافيين المفرط — مدر للبول.<br/>
            <strong>الأفضل:</strong> ماء بدرجة حرارة الغرفة (أسهل للمعدة)، ماء جوز الهند (إلكتروليت طبيعي)، لبن.
        </div>
    </div>

    <h2 id="water-rich-foods">أطعمة غنية بالماء — تساهم في 20-30% من احتياجك</h2>
    <p>لا يأتي كل الماء من الشرب. الأطعمة تساهم بنسبة <strong>20-30%</strong> من احتياجك اليومي:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الطعام</th><th>نسبة الماء</th><th>فائدة إضافية</th></tr></thead>
            <tbody>
                <tr><td><strong>🥒 خيار</strong></td><td>96%</td><td>منخفض السعرات (16 سعرة/100 غ)</td></tr>
                <tr><td><strong>🥬 خس</strong></td><td>95%</td><td>ألياف + فيتامين K</td></tr>
                <tr><td><strong>🍅 طماطم</strong></td><td>94%</td><td>ليكوبين (مضاد أكسدة)</td></tr>
                <tr><td><strong>🍉 بطيخ</strong></td><td>92%</td><td>بوتاسيوم + فيتامين C</td></tr>
                <tr><td><strong>🍓 فراولة</strong></td><td>91%</td><td>مضادات أكسدة + ألياف</td></tr>
                <tr><td><strong>🍈 شمام</strong></td><td>90%</td><td>فيتامين A + بوتاسيوم</td></tr>
                <tr><td><strong>🍊 برتقال</strong></td><td>87%</td><td>فيتامين C (مناعة)</td></tr>
                <tr><td><strong>🥛 حليب</strong></td><td>87%</td><td>كالسيوم + بروتين</td></tr>
                <tr><td><strong>🍎 تفاح</strong></td><td>86%</td><td>ألياف (بكتين)</td></tr>
                <tr><td><strong>🥣 لبن زبادي</strong></td><td>85%</td><td>بروبيوتيك + بروتين — خيار ممتاز للسحور</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="overhydration">الإفراط في شرب الماء — تسمم الماء</h2>
    <p>نعم، يمكن الإفراط. حالة <strong>نقص صوديوم الدم (Hyponatremia)</strong> تحدث عند شرب كميات كبيرة جداً في وقت قصير:</p>
    <ul>
        <li><strong>الخطر:</strong> شرب 5-6 لتر في ساعات قليلة يخفف الصوديوم في الدم</li>
        <li><strong>الأعراض:</strong> غثيان، صداع شديد، تشنجات، وفي الحالات القصوى: غيبوبة</li>
        <li><strong>القاعدة:</strong> لا تتجاوز <strong>1 لتر في الساعة</strong></li>
        <li><strong>الحل:</strong> وزّع الكمية على ساعات اليقظة (كما في جدول الترطيب أعلاه)</li>
    </ul>

    <h2 id="caffeine-drinks">الماء والقهوة والمشروبات — ما يُحتسب وما لا يُحتسب</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المشروب</th><th>يُحتسب؟</th><th>ملاحظة</th></tr></thead>
            <tbody>
                <tr><td><strong>ماء نقي</strong></td><td>✅ 100%</td><td>الخيار الأمثل دائماً</td></tr>
                <tr><td><strong>ماء بنكهة (بدون سكر)</strong></td><td>✅ 100%</td><td>ليمون، نعناع، خيار — نكهة بدون سعرات</td></tr>
                <tr><td><strong>شاي أعشاب (بدون كافيين)</strong></td><td>✅ ~95%</td><td>بابونج، يانسون — مهدئ ومرطب</td></tr>
                <tr><td><strong>قهوة/شاي (كافيين)</strong></td><td>⚠️ جزئياً</td><td>الكافيين مدر خفيف — أضف 150 مل تعويضية/كوب</td></tr>
                <tr><td><strong>شاي كرك</strong></td><td>⚠️ جزئياً</td><td>كافيين + سكر عالي — 180 سعرة/كوب</td></tr>
                <tr><td><strong>عصائر طبيعية</strong></td><td>⚠️ جزئياً</td><td>ماء + سكر طبيعي — اشرب باعتدال</td></tr>
                <tr><td><strong>مشروبات غازية</strong></td><td>❌ لا يُنصح</td><td>سكر عالي + كافيين = تأثير معاكس</td></tr>
                <tr><td><strong>مشروبات الطاقة</strong></td><td>❌ لا يُنصح</td><td>كافيين مرتفع + أثر مدر قوي</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="schedule">جدول الترطيب المثالي — ساعة بساعة</h2>
    <p>أفضل طريقة للترطيب هي <strong>التوزيع المنتظم</strong> على ساعات اليقظة. القاعدة العامة: <strong>كوب ماء كل ساعة إلى ساعتين</strong>. وبالنسبة لأوقات الطعام: كوب قبل الوجبة بـ 30 دقيقة:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الوقت</th><th>الكمية</th><th>السبب</th></tr></thead>
            <tbody>
                <tr><td><strong>6:00 ص — الاستيقاظ</strong></td><td>2 كوب (500 مل)</td><td>تعويض 7-8 ساعات بدون شرب أثناء النوم</td></tr>
                <tr><td><strong>8:00 ص — الفطور</strong></td><td>كوب واحد</td><td>مع أو بعد الوجبة</td></tr>
                <tr><td><strong>10:00 ص — استراحة</strong></td><td>كوب واحد</td><td>منتصف الصباح — أهم وقت في المكتب</td></tr>
                <tr><td><strong>12:00 م — قبل الغداء</strong></td><td>كوب واحد</td><td>قبل الأكل بـ 30 دقيقة يقلل كمية الأكل 13%</td></tr>
                <tr><td><strong>1:00 م — بعد الغداء</strong></td><td>كوب واحد</td><td>يساعد على الهضم</td></tr>
                <tr><td><strong>3:00 م — بعد الظهر</strong></td><td>كوب واحد</td><td>مكافحة خمول ما بعد الغداء</td></tr>
                <tr><td><strong>5:00 م — التمرين</strong></td><td>1-2 كوب</td><td>ترطيب قبل/أثناء التمرين — أو كوب عادي</td></tr>
                <tr><td><strong>7:00 م — العشاء</strong></td><td>كوب واحد</td><td>مع أو بعد الوجبة</td></tr>
                <tr><td><strong>9:00 م — قبل النوم</strong></td><td>نصف كوب</td><td>كمية أقل لتجنب الاستيقاظ ليلاً</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="weight-loss">الماء وخسارة الوزن — علاقة مثبتة علمياً</h2>
    <p>الماء ليس فقط حيوياً — بل أداة فعالة لخسارة الوزن:</p>
    <ul>
        <li><strong>كوب قبل الأكل:</strong> شرب 500 مل قبل الوجبة بـ 30 دقيقة يقلل كمية الأكل بنسبة <strong>13%</strong> (دراسة Dennis et al., 2010)</li>
        <li><strong>تأثير حراري:</strong> شرب 500 مل ماء بارد يرفع الأيض بنسبة <strong>24-30%</strong> لمدة 60-90 دقيقة (دراسة Boschmann et al., 2003)</li>
        <li><strong>بديل المشروبات:</strong> استبدال كوب مشروب غازي (150 سعرة) بماء يوفّر <strong>54,750 سعرة سنوياً</strong> = 7 كجم دهون</li>
        <li><strong>تمييز الجوع:</strong> 37% من إشارات الجوع هي في الحقيقة عطش — اشرب ماء أولاً وانتظر 10 دقائق</li>
    </ul>
    <p>لخطة متكاملة تجمع الماء مع حساب السعرات، استخدم <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a>.</p>

    <h2 id="water-quality">جودة مياه الشرب في الإمارات</h2>
    <p>مياه الصنبور في الإمارات تخضع لمعايير صارمة من <strong>هيئة الصحة</strong>. تحلية المياه بالتناضح العكسي (Reverse Osmosis) تجعلها نظيفة لكنها قد تكون <strong>قليلة المعادن</strong> مقارنة بمياه الينابيع. الخيارات:</p>
    <ul>
        <li><strong>مياه معبأة:</strong> آمنة ومنظمة — الأكثر شيوعاً في الإمارات</li>
        <li><strong>فلتر منزلي (كربون/RO):</strong> اقتصادي ومستدام بيئياً</li>
        <li><strong>ماء الصنبور مباشرة:</strong> آمن حسب الهيئات الرسمية — قد يختلف الطعم حسب المنطقة</li>
    </ul>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات تقريبية</strong> بناءً على معادلة هيئة الصحة بدبي والتوصيات العالمية. الاحتياج الفعلي يختلف حسب الحالة الصحية والأدوية والظروف الفردية. لأسئلة صحية محددة، استشر طبيبك أو أخصائي تغذية مُرخّص.
    </p>
`;
