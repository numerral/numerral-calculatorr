// Standalone page — /ar/hisabat-karbohidrat
// حاسبة الكربوهيدرات اليومية — Arabic Carb Calculator
// TDEE-driven, 5 strategies (keto→athlete), GI, Arab foods, fiber

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import CarbCalculatorCore from "@/components/calculator/CarbCalculatorCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة الكربوهيدرات اليومية — Carb Calculator (2026)",
    description: "احسب احتياجك اليومي من الكربوهيدرات حسب وزنك وطولك ونشاطك وهدفك — كيتو، لو كارب، متوسط، أو مرتفع. تشمل جدول المؤشر الغلايسيمي (GI) للأطعمة العربية، نسب الماكروز (كارب/بروتين/دهون)، والألياف الموصى بها.",
    keywords: ["حاسبة الكارب", "كربوهيدرات", "carb calculator", "كيتو", "لو كارب", "ماكروز", "TDEE", "مؤشر غلايسيمي", "GI", "أطعمة عربية كارب"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-karbohidrat` },
};

const FAQ_ITEMS = [
    { question: "كم غرام كربوهيدرات أحتاج يومياً؟", answer: "يعتمد على سعراتك وهدفك واستراتيجيتك. التوصية العامة (DGA): 45-65% من السعرات = 225-325 غ لنظام 2000 سعرة. الحد الأدنى (IOM): 130 غ/يوم للبالغين لوظائف الدماغ. كيتو: 20-50 غ. لو كارب: 50-130 غ. متوسط: 130-225 غ. مرتفع/رياضي: 225-400+ غ. استخدم الحاسبة أعلاه لحساب احتياجك الدقيق." },
    { question: "ما الفرق بين الكيتو واللو كارب؟", answer: "الكيتو: 5-10% كارب (20-50 غ/يوم) + 70-80% دهون. يحفز الكيتوزيس (الجسم يحرق الدهون بدل الجلوكوز). صارم ويصعب الاستمرار. اللو كارب: 20-26% كارب (50-130 غ). أكثر مرونة — لا يشترط الكيتوزيس. مناسب للمبتدئين والسيطرة على السكر." },
    { question: "ما هو المؤشر الغلايسيمي (GI)؟", answer: "GI يقيس سرعة ارتفاع سكر الدم بعد أكل طعام كربوهيدراتي. منخفض (≤55): ارتفاع بطيء — حمص (28)، تمر (42)، فول (40). متوسط (56-69): أرز بسمتي (58)، خبز عربي (57). مرتفع (≥70): أرز مصري (73)، خبز أبيض (75). الأطعمة منخفضة GI تبقيك شبعاناً أطول وتحافظ على استقرار السكر." },
    { question: "كيف أحسب الماكروز (كارب/بروتين/دهون)؟", answer: "1) احسب TDEE (السعرات التي تحرقها يومياً). 2) حدد هدفك (خسارة/ثبات/زيادة) لتحديد السعرات المستهدفة. 3) اختر استراتيجية كارب (كيتو، لو كارب، متوسط، مرتفع). 4) حوّل النسب لغرامات: كارب وبروتين = النسبة × السعرات ÷ 4. دهون = النسبة × السعرات ÷ 9." },
    { question: "ما هي أفضل مصادر الكربوهيدرات؟", answer: "أفضل المصادر: 1) حبوب كاملة: أرز بني، شوفان، فريكة. 2) بقوليات: حمص، عدس، فول. 3) خضروات: بطاطا حلوة، كوسة، بروكلي. 4) فواكه: تفاح، توت، برتقال. 5) تمر (باعتدال). تجنب: سكر مضاف، مشروبات غازية، معجنات بيضاء، حلويات صناعية." },
    { question: "هل الكارب يسبب السمنة؟", answer: "لا — الكارب نفسه لا يسبب السمنة. السبب الحقيقي: فائض السعرات (تأكل أكثر مما تحرق). لكن: الكارب المكرر (خبز أبيض، سكر) يرفع السكر سريعاً → جوع سريع → تأكل أكثر. الحل: اختر كارب منخفض GI + ألياف عالية + بروتين كافٍ. Harvard: النظام المتوسط (50-55% كارب) يرتبط بأقل معدل وفيات." },
    { question: "كم أحتاج ألياف يومياً؟", answer: "التوصية: 14 غ لكل 1000 سعرة (USDA). الحد الأدنى: 25 غ/يوم (نساء)، 28-34 غ/يوم (رجال). الألياف: تبطئ هضم الكارب = سكر مستقر. تعزز الشبع. تغذي بكتيريا الأمعاء. تقلل الكولسترول. مصادر عربية: حمص (13 غ/كوب)، فول (9 غ)، تمر (5 غ/3 حبات)، خبز كامل (4 غ/رغيف)." },
    { question: "هل نظام كيتو آمن؟", answer: "على المدى القصير (3-6 أشهر): آمن لمعظم الأصحاء — فعال لخسارة الوزن والسيطرة على السكري نوع 2. على المدى الطويل: مخاوف حول نقص الألياف والفيتامينات، حصوات كلى، ارتفاع كولسترول LDL. غير مناسب لـ: حوامل، مرضى الكلى، مرضى اضطرابات الأكل، السكري نوع 1 (خطر الحماض الكيتوني). استشر طبيبك قبل البدء." },
    { question: "ما الكربوهيدرات في الأرز العربي (كبسة/مندي)؟", answer: "كبسة (طبق واحد): ~55 غ كارب. مندي: ~50 غ. مجبوس: ~48 غ. أرز بسمتي (كوب مطبوخ): 45 غ (GI 58 — متوسط). أرز مصري (كوب): 53 غ (GI 73 — مرتفع). نصيحة: أرز بسمتي أفضل من المصري (GI أقل). اطبخ الأرز وبرّده ثم سخّنه — يتحول جزء من النشاء لنشاء مقاوم (Resistant Starch) = GI أقل." },
    { question: "كم كارب في التمر؟", answer: "3 حبات تمر مجهول (Medjool): ~54 غ كارب + 5 غ ألياف. GI: 42 (منخفض — أقل مما يظنه كثيرون). التمر غني بالبوتاسيوم والمغنيسيوم. في رمضان: 3 تمرات + ماء = إفطار مثالي (سكر طبيعي سريع الامتصاص + ألياف). لكن: اعتدل — 7 تمرات = ~126 غ كارب (نصف احتياج اللو كارب)." },
    { question: "هل يحتاج الرياضي كارب أكثر؟", answer: "نعم. التوصيات حسب ISSN: تمارين خفيفة: 3-5 غ/كجم/يوم. تمارين متوسطة (1 ساعة): 5-7 غ/كجم. تحمّل عالي (1-3 ساعات): 6-10 غ/كجم. رياضات فائقة (4+ ساعات): 8-12 غ/كجم. مثال: رياضي 80 كجم تمارين متوسطة = 400-560 غ كارب/يوم. الكارب = وقود الأداء الرياضي (يغذي الجليكوجين في العضلات)." },
    { question: "ما هو Net Carb (الكارب الصافي)؟", answer: "Net Carb = إجمالي الكارب − الألياف (− كحول السكر إن وُجد). السبب: الألياف لا تُهضم ولا ترفع سكر الدم. تطبيق: طعام 30 غ كارب − 10 غ ألياف = 20 غ كارب صافي. في نظام الكيتو: العد يكون بالكارب الصافي (هدف: < 20-50 غ صافي)." },
    { question: "متى أتناول الكارب — قبل أم بعد التمرين؟", answer: "قبل التمرين (1-3 ساعات): وجبة كارب + بروتين = طاقة مستدامة. مثال: أرز + دجاج أو شوفان + موز. بعد التمرين (خلال 30-60 دقيقة): كارب سريع + بروتين = تعويض الجليكوجين + ترميم العضلات. مثال: شيك بروتين + موز أو تمر + لبن. الكارب بعد التمرين يخفض الكورتيزول." },
    { question: "هل أحتاج كارب إذا كنت أريد خسارة الوزن؟", answer: "نعم — لكن بكمية أقل. الحد الأدنى: 130 غ/يوم لوظائف الدماغ (IOM). الأفضل: 100-200 غ حسب نشاطك. لماذا لا تقطعه تماماً؟ الكارب يحافظ على هرمونات الغدة الدرقية، اللبتين (هرمون الشبع)، وأداء التمارين. النصيحة: كارب منخفض GI + بروتين عالي + عجز سعرات 500 = خسارة مستدامة." },
    { question: "ما علاقة الكارب بالسكري؟", answer: "الكارب يتحول لجلوكوز = يرفع سكر الدم. مريض السكري: يحتاج إدارة كمية ونوع الكارب بعناية. نصائح: اختر كارب منخفض GI (حمص، عدس، شوفان). وزّع الكارب على 3-5 وجبات (لا تأكل كمية كبيرة دفعة واحدة). اقرن الكارب مع بروتين/دهون صحية (يبطئ الهضم). الألياف ≥ 25 غ/يوم. ADA: لا نسبة واحدة تناسب الجميع — اعمل مع أخصائي تغذية." },
];

export default function CarbCalculatorPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة الكربوهيدرات", item: `${SITE_URL}/ar/hisabat-karbohidrat` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة الكربوهيدرات اليومية",
            url: `${SITE_URL}/ar/hisabat-karbohidrat`,
            applicationCategory: "HealthApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "احسب احتياجك اليومي من الكربوهيدرات والماكروز حسب وزنك وهدفك",
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
            <Script id="schema-carb-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة الكربوهيدرات</span>
            </nav>

            <h1 className="ar-page__title">🍞 حاسبة الكربوهيدرات اليومية (2026)</h1>
            <p className="ar-page__subtitle">
                احسب احتياجك اليومي من الكربوهيدرات والبروتين والدهون بناءً على سعراتك (TDEE)، هدفك (خسارة/ثبات/زيادة)، واستراتيجيتك الغذائية (كيتو، لو كارب، متوسط، مرتفع، رياضي). تشمل جدول المؤشر الغلايسيمي (GI) ومرجع كارب 12 طعام عربي مع الألياف.
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <CarbCalculatorCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة الكربوهيدرات</h2>
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
                    <Link href="/ar/hisabat-shakl-aljism" className="ar-related__card">
                        <span className="ar-related__icon">📏</span>
                        <span className="ar-related__name">حاسبة شكل الجسم</span>
                    </Link>
                    <Link href="/ar/hisabat-dawrat-alnawm" className="ar-related__card">
                        <span className="ar-related__icon">🌙</span>
                        <span className="ar-related__name">حاسبة دورة النوم</span>
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
    <h2 id="what-are-carbs">ما هي الكربوهيدرات؟</h2>
    <p>الكربوهيدرات (الكارب) هي <strong>المصدر الرئيسي للطاقة</strong> في الجسم. تتحلل إلى جلوكوز يغذي الدماغ والعضلات والأعضاء. كل غرام كارب = <strong>4 سعرات حرارية</strong>.</p>
    <p>تنقسم الكربوهيدرات إلى 3 أنواع:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>النوع</th><th>الوصف</th><th>أمثلة</th><th>التأثير على السكر</th></tr></thead>
            <tbody>
                <tr><td><strong>سكريات بسيطة</strong></td><td>جزيئات صغيرة — تُهضم بسرعة</td><td>سكر المائدة، عسل، فواكه، عصير</td><td>🔴 سريع</td></tr>
                <tr><td><strong>نشويات معقدة</strong></td><td>سلاسل طويلة — تُهضم ببطء</td><td>أرز، خبز، بطاطا، شوفان، فريكة</td><td>🟡 معتدل</td></tr>
                <tr><td><strong>ألياف</strong></td><td>لا تُهضم — تغذي البكتيريا النافعة</td><td>خضار، بقوليات، حبوب كاملة</td><td>🟢 لا تأثير</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="how-much-carb">كم كارب تحتاج يومياً؟</h2>
    <p>التوصية العامة حسب <strong>Dietary Guidelines for Americans (DGA)</strong>: 45-65% من إجمالي السعرات. معهد الطب (IOM) يحدد الحد الأدنى بـ <strong>130 غ/يوم</strong> للبالغين — الكمية اللازمة لوظائف الدماغ.</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الاستراتيجية</th><th>% الكارب</th><th>غرامات (2000 سعرة)</th><th>مناسبة لـ</th></tr></thead>
            <tbody>
                <tr><td><strong>🥑 كيتو</strong></td><td>5-10%</td><td>20-50 غ</td><td>خسارة وزن سريعة، السكري نوع 2</td></tr>
                <tr><td><strong>🥩 لو كارب</strong></td><td>15-25%</td><td>50-130 غ</td><td>خسارة وزن، السيطرة على السكر</td></tr>
                <tr><td><strong>⚖️ متوسط</strong></td><td>40-50%</td><td>130-225 غ</td><td>صحة عامة، مستدام طويل المدى</td></tr>
                <tr><td><strong>🍚 مرتفع</strong></td><td>50-60%</td><td>225-325 غ</td><td>رياضيون، نشاط يومي عالي</td></tr>
                <tr><td><strong>🏃 رياضي مكثف</strong></td><td>60-70%</td><td>325-400+ غ</td><td>ماراثون، سباحة، رياضات تحمل</td></tr>
            </tbody>
        </table>
    </div>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">📊</span>
        <div>
            <strong>دراسة Harvard (Lancet 2018):</strong> النظام المتوسط (50-55% كارب) يرتبط بـ <strong>أقل معدل وفيات</strong>. النظام المنخفض جداً (< 40%) والمرتفع جداً (> 70%) كلاهما يرتبط بمعدل وفيات أعلى.
        </div>
    </div>

    <h2 id="macros-formula">كيف تحسب الماكروز (كارب/بروتين/دهون)؟</h2>
    <ol>
        <li><strong>احسب TDEE:</strong> السعرات التي تحرقها يومياً (<a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a> تحسبها تلقائياً)</li>
        <li><strong>حدد هدفك:</strong> خسارة (−500 سعرة) · ثبات · زيادة (+300 سعرة)</li>
        <li><strong>اختر نسب الماكروز:</strong> حسب استراتيجية الكارب</li>
        <li><strong>حوّل لغرامات:</strong></li>
    </ol>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">📐</span>
        <div>
            <strong>كارب (غ)</strong> = (السعرات المستهدفة × نسبة الكارب) ÷ 4<br/>
            <strong>بروتين (غ)</strong> = (السعرات × نسبة البروتين) ÷ 4<br/>
            <strong>دهون (غ)</strong> = (السعرات × نسبة الدهون) ÷ 9<br/>
            <strong>مثال:</strong> 2000 سعرة × 45% كارب = 900 سعرة ÷ 4 = <strong>225 غ كارب</strong>
        </div>
    </div>

    <h2 id="glycemic-index">المؤشر الغلايسيمي (GI) — دليل اختيار الكارب</h2>
    <p>المؤشر الغلايسيمي يقيس <strong>سرعة ارتفاع سكر الدم</strong> بعد أكل طعام يحتوي كربوهيدرات (مقياس 0-100):</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الفئة</th><th>GI</th><th>التأثير</th><th>أمثلة عربية</th></tr></thead>
            <tbody>
                <tr><td><strong>🟢 منخفض</strong></td><td>≤ 55</td><td>ارتفاع بطيء — شبع طويل</td><td>حمص (28)، فول (40)، تمر (42)، عدس (32)، خبز كامل (45)</td></tr>
                <tr><td><strong>🟡 متوسط</strong></td><td>56-69</td><td>ارتفاع معتدل</td><td>أرز بسمتي (58)، خبز عربي (57)، بطاطا حلوة (63)</td></tr>
                <tr><td><strong>🔴 مرتفع</strong></td><td>≥ 70</td><td>ارتفاع سريع — جوع سريع</td><td>أرز مصري (73)، خبز أبيض (75)، لقيمات (80+)</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>نصيحة عملية:</strong> اقرن الكارب المرتفع GI مع بروتين أو دهون صحية — هذا يبطئ الهضم ويقلل الارتفاع. مثال: أرز + دجاج أفضل من أرز وحده.</p>

    <h2 id="arab-foods-carb">كارب الأطعمة العربية — جدول مرجعي</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الطعام</th><th>الكارب (غ)</th><th>GI</th><th>الألياف (غ)</th></tr></thead>
            <tbody>
                <tr><td>أرز بسمتي (كوب مطبوخ)</td><td>45</td><td>58 — متوسط</td><td>0.6</td></tr>
                <tr><td>أرز مصري (كوب مطبوخ)</td><td>53</td><td>73 — مرتفع</td><td>0.4</td></tr>
                <tr><td>كبسة (طبق)</td><td>55</td><td>متوسط</td><td>2</td></tr>
                <tr><td>مندي (طبق)</td><td>50</td><td>متوسط</td><td>1.5</td></tr>
                <tr><td>مجبوس (طبق)</td><td>48</td><td>متوسط</td><td>2</td></tr>
                <tr><td>خبز عربي (رغيف)</td><td>33</td><td>57 — متوسط</td><td>1.3</td></tr>
                <tr><td>خبز تنور كامل (رغيف)</td><td>30</td><td>45 — منخفض</td><td>4.0</td></tr>
                <tr><td>فول مدمس (كوب)</td><td>33</td><td>40 — منخفض</td><td>9</td></tr>
                <tr><td>حمص (كوب)</td><td>45</td><td>28 — منخفض</td><td>13</td></tr>
                <tr><td>تمر مجهول (3 حبات)</td><td>54</td><td>42 — منخفض</td><td>5</td></tr>
                <tr><td>لقيمات (5 حبات)</td><td>40</td><td>مرتفع 80+</td><td>0.5</td></tr>
                <tr><td>شاي كرك بحليب (كوب)</td><td>25</td><td>—</td><td>0</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="fiber">الألياف — الكارب الذي لا يُحسب</h2>
    <p>الألياف نوع خاص من الكارب <strong>لا يُهضم ولا يرفع السكر</strong>. لذلك يُحسب الكارب الصافي (Net Carb) = إجمالي الكارب − الألياف.</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المصدر</th><th>الألياف (غ)</th><th>لماذا مهم؟</th></tr></thead>
            <tbody>
                <tr><td>حمص (كوب)</td><td>13</td><td>أغنى مصدر عربي — يبطئ السكر</td></tr>
                <tr><td>فول مدمس (كوب)</td><td>9</td><td>بروتين نباتي + ألياف</td></tr>
                <tr><td>تمر (3 حبات)</td><td>5</td><td>ألياف طبيعية مع سكر بسيط</td></tr>
                <tr><td>خبز تنور كامل</td><td>4</td><td>بديل صحي للخبز الأبيض</td></tr>
                <tr><td>بروكلي (كوب)</td><td>5</td><td>ألياف + فيتامين C + K</td></tr>
                <tr><td>شوفان (نصف كوب جاف)</td><td>4</td><td>بيتا-جلوكان يخفض الكولسترول</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>التوصية:</strong> 14 غ لكل 1000 سعرة (USDA). لنظام 2000 سعرة = <strong>28 غ/يوم</strong>. أكثر الناس يحصلون على 15 غ فقط — أقل من النصف!</p>

    <h2 id="keto-vs-lowcarb">كيتو مقابل لو كارب — أيهما أفضل؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المقارنة</th><th>كيتو</th><th>لو كارب</th></tr></thead>
            <tbody>
                <tr><td>الكارب/يوم</td><td>20-50 غ</td><td>50-130 غ</td></tr>
                <tr><td>الكيتوزيس</td><td>✅ نعم (مطلوب)</td><td>❌ لا (غير ضروري)</td></tr>
                <tr><td>نسبة الدهون</td><td>70-80%</td><td>40-50%</td></tr>
                <tr><td>المرونة</td><td>صارم جداً</td><td>مرن أكثر</td></tr>
                <tr><td>خسارة سريعة</td><td>✅ أسرع (أول أسبوعين = ماء)</td><td>أبطأ لكن مستدام</td></tr>
                <tr><td>سهولة الاستمرار</td><td>صعب > 6 أشهر</td><td>أسهل للاستمرار</td></tr>
                <tr><td>أعراض جانبية</td><td>إنفلونزا كيتو، إمساك، نقص ألياف</td><td>أقل أعراض</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="carbs-athletes">الكارب للرياضيين — متى وكم؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>التوقيت</th><th>الهدف</th><th>الكمية والنوع</th></tr></thead>
            <tbody>
                <tr><td><strong>قبل التمرين (1-3 ساعات)</strong></td><td>ملء الجليكوجين</td><td>1-4 غ/كجم — كارب معقد + بروتين (أرز + دجاج)</td></tr>
                <tr><td><strong>أثناء التمرين (> 60 دقيقة)</strong></td><td>طاقة مستمرة</td><td>30-60 غ/ساعة — كارب بسيط (تمر، موز، مشروب رياضي)</td></tr>
                <tr><td><strong>بعد التمرين (خلال 30-60 دقيقة)</strong></td><td>تعويض الجليكوجين + ترميم</td><td>1-1.2 غ/كجم — كارب سريع + بروتين (شيك + موز)</td></tr>
            </tbody>
        </table>
    </div>
    <p>الكارب هو <strong>وقود الأداء الرياضي</strong> — يغذي الجليكوجين في العضلات (المخزون الأول للطاقة). نقص الكارب = تعب مبكر + نقص أداء. لحساب سعراتك الكاملة: <a href="/ar/hisabat-suarat-hararia">حاسبة السعرات الحرارية</a>.</p>

    <h2 id="carbs-diabetes">الكارب ومرض السكري</h2>
    <p>الكارب يتحول لجلوكوز = يرفع سكر الدم. لمرضى السكري، <strong>إدارة الكارب</strong> هي الركيزة الأساسية:</p>
    <ul>
        <li><strong>اختر كارب منخفض GI:</strong> حمص (28)، عدس (32)، شوفان (55)</li>
        <li><strong>وزّع الكارب:</strong> 3-5 وجبات صغيرة — لا تأكل 100 غ دفعة واحدة</li>
        <li><strong>اقرن مع بروتين/دهون:</strong> يبطئ الهضم = ارتفاع أقل</li>
        <li><strong>ألياف ≥ 25 غ/يوم:</strong> تبطئ امتصاص السكر</li>
        <li><strong>احسب الكارب الصافي (Net Carbs):</strong> إجمالي − ألياف</li>
    </ul>
    <p>حسب <strong>الجمعية الأمريكية للسكري (ADA)</strong>: لا نسبة واحدة تناسب الجميع. اعمل مع أخصائي تغذية لتحديد الكمية المثالية لك. لمراقبة وزنك: <a href="/ar/hisabat-kutlat-aljism">حاسبة BMI</a>.</p>

    <h2 id="resistant-starch">النشاء المقاوم — حيلة ذكية من المطبخ العربي</h2>
    <p>عندما تطبخ الأرز/البطاطا ثم <strong>تبرّدها وتعيد تسخينها</strong>، يتحول جزء من النشاء إلى <strong>نشاء مقاوم (Resistant Starch)</strong>:</p>
    <ul>
        <li>لا يُهضم مثل النشاء العادي — يتصرف كألياف</li>
        <li>يخفض GI الفعلي للأرز/البطاطا</li>
        <li>يغذي البكتيريا النافعة في الأمعاء</li>
        <li>يقلل السعرات المُمتصة بـ 10-15%</li>
    </ul>
    <p><strong>تطبيق:</strong> اطبخ أرز الكبسة مسبقاً → برّده 12 ساعة في الثلاجة → سخّنه. نفس الطعم، كارب فعّال أقل!</p>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>تنبيه:</strong> هذه الحاسبة تقدم <strong>تقديرات أولية</strong> بناءً على معادلة Mifflin-St Jeor ونسب الماكروز المعيارية. لا تستبدل استشارة أخصائي تغذية — خاصة لمرضى السكري وأمراض الكلى والحوامل.
    </p>
`;
