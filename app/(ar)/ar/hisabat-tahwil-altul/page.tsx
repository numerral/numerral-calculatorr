// Standalone page — /ar/hisabat-tahwil-altul
// حاسبة تحويل الطول — Arabic Height Converter
// Bidirectional cm↔ft/in, average heights, ideal weight table

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import HeightConverterCore from "@/components/calculator/HeightConverterCore";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "حاسبة تحويل الطول — Height Converter (2026)",
    description: "حوّل الطول بين السنتيمتر والقدم/البوصة فوراً مع جدول تحويل شامل ومتوسط الطول في الدول العربية (الإمارات، السعودية، مصر، لبنان) والوزن المثالي حسب الطول.",
    keywords: ["حاسبة تحويل الطول", "تحويل سم لقدم", "height converter", "cm to feet", "قدم لسم", "متوسط الطول", "الطول بالقدم", "تحويل الطول"],
    alternates: { canonical: `${SITE_URL}/ar/hisabat-tahwil-altul` },
};

const FAQ_ITEMS = [
    { question: "كيف أحوّل الطول من سنتيمتر لقدم وبوصة؟", answer: "الخطوة 1: قسّم السنتيمتر على 2.54 = إجمالي البوصات. الخطوة 2: قسّم البوصات على 12 = القدم. الباقي = البوصات. مثال: 175 سم ÷ 2.54 = 68.9 بوصة ÷ 12 = 5 قدم و 8.9 بوصة ≈ 5'9\". أو استخدم الحاسبة أعلاه للتحويل الفوري." },
    { question: "كيف أحوّل من قدم وبوصة لسنتيمتر؟", answer: "الخطوة 1: اضرب عدد القدم × 12 + البوصات = إجمالي البوصات. الخطوة 2: اضرب × 2.54 = السنتيمتر. مثال: 5'10\" = (5 × 12) + 10 = 70 بوصة × 2.54 = 177.8 سم." },
    { question: "كم يعادل 170 سم بالقدم؟", answer: "170 سم = 5 أقدام و 6.9 بوصة (5'7\"). هذا تقريباً متوسط طول الرجل في السعودية (168.9 سم) وقريب من متوسط الإمارات (174.1 سم)." },
    { question: "كم يعادل 160 سم بالقدم؟", answer: "160 سم = 5 أقدام و 2.99 بوصة (5'3\"). هذا قريب من متوسط طول المرأة في الإمارات (160.5 سم)." },
    { question: "كم يعادل 180 سم بالقدم؟", answer: "180 سم = 5 أقدام و 10.87 بوصة (5'11\"). يُعتبر طويلاً في معظم الدول العربية — أعلى من المتوسط بـ 6-11 سم." },
    { question: "ما هو متوسط الطول في الإمارات؟", answer: "حسب World Population Review: الرجال: 174.1 سم (5'8.5\"). النساء: 160.5 سم (5'3\"). متوسط إماراتي أعلى من السعودية (168.9 سم للرجال) لكن أقل من لبنان (176 سم)." },
    { question: "ما هو متوسط الطول في السعودية؟", answer: "الرجال: 168.9 سم (5'6.5\"). النساء: 156 سم (5'1.5\"). أقصر من الإمارات ولبنان. العوامل: الجينات + التغذية + النشاط البدني." },
    { question: "ما الفرق بين النظام المتري والإمبراطوري؟", answer: "المتري (سنتيمتر/متر): يُستخدم في معظم العالم — سهل (عشري). الإمارات والدول العربية تستخدم المتري. الإمبراطوري (قدم/بوصة): يُستخدم في أمريكا وبريطانيا. 1 قدم = 12 بوصة = 30.48 سم. 1 بوصة = 2.54 سم. 1 متر = 3.28 قدم." },
    { question: "متى يتوقف نمو الطول؟", answer: "البنات: عادة بعمر 14-15 سنة (بعد سنتين من بداية الدورة الشهرية). الأولاد: عادة بعمر 16-18 سنة. صفائح النمو (Growth Plates) في العظام تُغلق ولا يمكن زيادة الطول بعدها. بعد ذلك: الوضعية السليمة والتمارين قد تضيف 1-2 سم ظاهرياً." },
    { question: "هل يمكن زيادة الطول بعد البلوغ؟", answer: "لا — بمجرد إغلاق صفائح النمو، لا يمكن زيادة الطول طبيعياً. ما يمكنك فعله: 1) تحسين الوضعية (Posture) — قد تُضيف 1-3 سم ظاهرياً. 2) تمارين إطالة ويوغا. 3) تجنب الانحناء والجلوس الخاطئ. 4) جراحة إطالة الأطراف (Limb Lengthening) — مكلفة ومؤلمة وتحتاج 6-12 شهر تعافي." },
    { question: "ما هو الوزن المثالي لطولي؟", answer: "يعتمد على BMI (18.5-24.9). أمثلة: 160 سم = 47-64 كجم. 170 سم = 54-72 كجم. 175 سم = 57-76 كجم. 180 سم = 60-81 كجم. لحساب BMI بدقة: حاسبة مؤشر كتلة الجسم." },
    { question: "كم طولي بالمتر إذا كان 5'7\"؟", answer: "5'7\" = (5 × 12) + 7 = 67 بوصة × 2.54 = 170.18 سم = 1.70 متر." },
    { question: "ما هي وحدات قياس الطول؟", answer: "النظام المتري: مليمتر (مم)، سنتيمتر (سم)، متر (م)، كيلومتر (كم). النظام الإمبراطوري: بوصة (inch)، قدم (foot)، ياردة (yard)، ميل (mile). التحويلات: 1 سم = 10 مم. 1 م = 100 سم. 1 بوصة = 2.54 سم. 1 قدم = 30.48 سم. 1 ياردة = 91.44 سم." },
    { question: "هل الطول يتأثر بالتغذية؟", answer: "نعم — خاصة أثناء مراحل النمو (الطفولة والمراهقة). العوامل: بروتين كافٍ (لحم، بيض، حليب). كالسيوم + فيتامين D (عظام قوية). زنك (نمو الخلايا). نوم كافٍ (هرمون النمو HGH يُفرز أثناء النوم العميق). التمارين الرياضية. سوء التغذية في الطفولة يقلل الطول النهائي بـ 5-10 سم." },
    { question: "لماذا يختلف الطول بين الشعوب؟", answer: "1) الجينات (60-80% من الطول وراثي). 2) التغذية (بروتين + كالسيوم في الطفولة). 3) الرعاية الصحية. 4) الوضع الاقتصادي. 5) العوامل البيئية. هولندا أطول شعب عالمياً (183.8 سم للرجال) بسبب تغذية ممتازة ورعاية صحية. الشعوب العربية تتفاوت: لبنان (176 سم) أطول من البحرين (165 سم)." },
];

export default function HeightConverterPage() {
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE_URL}/ar` },
                { "@type": "ListItem", position: 2, name: "حاسبة تحويل الطول", item: `${SITE_URL}/ar/hisabat-tahwil-altul` },
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "حاسبة تحويل الطول",
            url: `${SITE_URL}/ar/hisabat-tahwil-altul`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            inLanguage: "ar",
            description: "حوّل الطول بين سنتيمتر وقدم/بوصة مع جدول مرجعي ومتوسط الطول العربي",
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
            <Script id="schema-height-ar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>حاسبة تحويل الطول</span>
            </nav>

            <h1 className="ar-page__title">📏 حاسبة تحويل الطول (2026)</h1>
            <p className="ar-page__subtitle">
                حوّل الطول بين السنتيمتر (سم) والقدم/البوصة فوراً — ثنائي الاتجاه. تشمل جدول تحويل سريع (150-200 سم)، متوسط الطول في 10 دول (الإمارات، السعودية، مصر، لبنان)، والوزن المثالي حسب الطول. مع شرح كامل للمعادلات والفرق بين النظام المتري والإمبراطوري.
            </p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <HeightConverterCore />
                </div>
            </div>

            <div className="ar-rich-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section className="ar-faq">
                <h2 className="ar-faq__title">أسئلة شائعة — حاسبة تحويل الطول</h2>
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
                    <Link href="/ar/hisabat-ihtiyaj-alma" className="ar-related__card">
                        <span className="ar-related__icon">💧</span>
                        <span className="ar-related__name">حاسبة احتياج الماء</span>
                    </Link>
                    <Link href="/ar/hisabat-dawrat-alnawm" className="ar-related__card">
                        <span className="ar-related__icon">🌙</span>
                        <span className="ar-related__name">حاسبة دورة النوم</span>
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
    <h2 id="conversion-formula">معادلة تحويل الطول</h2>
    <div class="ar-explanation__highlight">
        <span class="ar-explanation__highlight-icon">📐</span>
        <div>
            <strong>من سم → قدم/بوصة:</strong><br/>
            إجمالي البوصات = السنتيمتر ÷ 2.54<br/>
            القدم = إجمالي البوصات ÷ 12 (الجزء الصحيح)<br/>
            البوصات = الباقي<br/><br/>
            <strong>من قدم/بوصة → سم:</strong><br/>
            السنتيمتر = (القدم × 12 + البوصات) × 2.54
        </div>
    </div>
    <p><strong>مثال:</strong> 175 سم → 175 ÷ 2.54 = 68.9 بوصة → 68.9 ÷ 12 = <strong>5 قدم و 8.9 بوصة (5'9")</strong></p>

    <h2 id="conversion-constants">ثوابت التحويل</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>من</th><th>إلى</th><th>اضرب في</th></tr></thead>
            <tbody>
                <tr><td>سنتيمتر</td><td>بوصة</td><td>÷ 2.54</td></tr>
                <tr><td>بوصة</td><td>سنتيمتر</td><td>× 2.54</td></tr>
                <tr><td>قدم</td><td>سنتيمتر</td><td>× 30.48</td></tr>
                <tr><td>سنتيمتر</td><td>قدم</td><td>÷ 30.48</td></tr>
                <tr><td>متر</td><td>قدم</td><td>× 3.2808</td></tr>
                <tr><td>قدم</td><td>متر</td><td>× 0.3048</td></tr>
                <tr><td>سنتيمتر</td><td>متر</td><td>÷ 100</td></tr>
                <tr><td>بوصة</td><td>قدم</td><td>÷ 12</td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="quick-table">جدول تحويل سريع — سم إلى قدم/بوصة</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>سم</th><th>متر</th><th>قدم/بوصة</th><th>ملاحظة</th></tr></thead>
            <tbody>
                <tr><td>150</td><td>1.50</td><td>4'11"</td><td></td></tr>
                <tr><td>155</td><td>1.55</td><td>5'1"</td><td>متوسط المرأة — البحرين</td></tr>
                <tr><td>160</td><td>1.60</td><td>5'3"</td><td>متوسط المرأة — الإمارات</td></tr>
                <tr><td>165</td><td>1.65</td><td>5'5"</td><td></td></tr>
                <tr><td>168</td><td>1.68</td><td>5'6"</td><td>متوسط الرجل — السعودية</td></tr>
                <tr><td>170</td><td>1.70</td><td>5'7"</td><td></td></tr>
                <tr><td>174</td><td>1.74</td><td>5'8.5"</td><td>متوسط الرجل — الإمارات</td></tr>
                <tr><td>175</td><td>1.75</td><td>5'9"</td><td></td></tr>
                <tr><td>180</td><td>1.80</td><td>5'11"</td><td></td></tr>
                <tr><td>185</td><td>1.85</td><td>6'1"</td><td></td></tr>
                <tr><td>190</td><td>1.90</td><td>6'3"</td><td></td></tr>
                <tr><td>195</td><td>1.95</td><td>6'5"</td><td></td></tr>
                <tr><td>200</td><td>2.00</td><td>6'7"</td><td></td></tr>
            </tbody>
        </table>
    </div>

    <h2 id="average-heights">متوسط الطول في الدول العربية والعالم</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الدولة</th><th>♂ رجال (سم)</th><th>♂ بالقدم</th><th>♀ نساء (سم)</th><th>♀ بالقدم</th></tr></thead>
            <tbody>
                <tr><td>🇳🇱 هولندا</td><td>183.8</td><td>6'0.5"</td><td>170.4</td><td>5'7"</td></tr>
                <tr><td>🇩🇪 ألمانيا</td><td>180.3</td><td>5'11"</td><td>166.2</td><td>5'5.5"</td></tr>
                <tr><td>🇺🇸 أمريكا</td><td>177.1</td><td>5'10"</td><td>163.5</td><td>5'4.5"</td></tr>
                <tr><td>🇱🇧 لبنان</td><td>176.0</td><td>5'9.5"</td><td>162.5</td><td>5'4"</td></tr>
                <tr><td><strong>🇦🇪 الإمارات</strong></td><td><strong>174.1</strong></td><td><strong>5'8.5"</strong></td><td><strong>160.5</strong></td><td><strong>5'3"</strong></td></tr>
                <tr><td>🇸🇾 سوريا</td><td>173.0</td><td>5'8"</td><td>159.0</td><td>5'2.5"</td></tr>
                <tr><td>🇪🇬 مصر</td><td>172.0</td><td>5'7.5"</td><td>158.5</td><td>5'2.5"</td></tr>
                <tr><td>🇸🇦 السعودية</td><td>168.9</td><td>5'6.5"</td><td>156.0</td><td>5'1.5"</td></tr>
                <tr><td>🇧🇭 البحرين</td><td>165.1</td><td>5'5"</td><td>154.0</td><td>5'0.5"</td></tr>
                <tr><td>🇮🇳 الهند</td><td>166.5</td><td>5'5.5"</td><td>155.2</td><td>5'1"</td></tr>
            </tbody>
        </table>
    </div>
    <p><strong>لماذا الفارق؟</strong> الطول يتأثر بـ: الجينات (60-80%)، التغذية في الطفولة (بروتين + كالسيوم + فيتامين D)، الرعاية الصحية، والوضع الاقتصادي. الشعوب الأوروبية (هولندا، ألمانيا) الأطول عالمياً بسبب تغذية ممتازة ورعاية صحية متقدمة.</p>

    <h2 id="metric-imperial">المتري مقابل الإمبراطوري — لماذا نظامان؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>المقارنة</th><th>المتري (SI)</th><th>الإمبراطوري</th></tr></thead>
            <tbody>
                <tr><td>الوحدات</td><td>مليمتر، سنتيمتر، متر، كيلومتر</td><td>بوصة، قدم، ياردة، ميل</td></tr>
                <tr><td>الأساس</td><td>عشري (×10)</td><td>مختلط (×12, ×3, ×5280)</td></tr>
                <tr><td>الاستخدام</td><td>معظم العالم + العلم</td><td>أمريكا + بريطانيا (جزئياً)</td></tr>
                <tr><td>الدول العربية</td><td>✅ رسمياً</td><td>محدود (رخص القيادة، هوية)</td></tr>
                <tr><td>السهولة</td><td>سهل جداً</td><td>محيّر</td></tr>
            </tbody>
        </table>
    </div>
    <p>الدول العربية تستخدم النظام المتري رسمياً. لكن كثيراً ما تُصادف القدم/البوصة في: المنتجات الأمريكية، الرياضة (NBA، كرة القدم الأمريكية)، بطاقات الهوية في بعض الدول.</p>

    <h2 id="height-weight">الطول والوزن المثالي</h2>
    <p>الوزن المثالي يعتمد على BMI بين 18.5-24.9. إليك الجدول المرجعي:</p>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الطول (سم)</th><th>بالقدم</th><th>الوزن المثالي (كجم)</th><th>BMI ≈ 22</th></tr></thead>
            <tbody>
                <tr><td>150</td><td>4'11"</td><td>41.6 – 56.0</td><td>49.5</td></tr>
                <tr><td>155</td><td>5'1"</td><td>44.4 – 59.8</td><td>52.9</td></tr>
                <tr><td>160</td><td>5'3"</td><td>47.4 – 63.7</td><td>56.3</td></tr>
                <tr><td>165</td><td>5'5"</td><td>50.4 – 67.8</td><td>59.9</td></tr>
                <tr><td>170</td><td>5'7"</td><td>53.5 – 71.9</td><td>63.6</td></tr>
                <tr><td>175</td><td>5'9"</td><td>56.7 – 76.3</td><td>67.4</td></tr>
                <tr><td>180</td><td>5'11"</td><td>59.9 – 80.7</td><td>71.3</td></tr>
                <tr><td>185</td><td>6'1"</td><td>63.3 – 85.2</td><td>75.3</td></tr>
                <tr><td>190</td><td>6'3"</td><td>66.8 – 89.9</td><td>79.4</td></tr>
            </tbody>
        </table>
    </div>
    <p>لحساب BMI بدقة: <a href="/ar/hisabat-kutlat-aljism">حاسبة مؤشر كتلة الجسم</a>. لمعرفة شكل جسمك: <a href="/ar/hisabat-shakl-aljism">حاسبة شكل الجسم</a>.</p>

    <h2 id="growth-factors">ما يؤثر على الطول</h2>
    <ul>
        <li><strong>الجينات (60-80%):</strong> الوالدان طويلان = احتمال أعلى لطول أكبر</li>
        <li><strong>التغذية:</strong> بروتين كافٍ (لحم، بيض، حليب) + كالسيوم + فيتامين D + زنك</li>
        <li><strong>النوم:</strong> هرمون النمو (HGH) يُفرز أثناء <strong>النوم العميق (N3)</strong> — <a href="/ar/hisabat-dawrat-alnawm">حاسبة دورة النوم</a></li>
        <li><strong>التمارين:</strong> الرياضة في الطفولة تعزز النمو — خاصة السباحة وكرة السلة والجمباز</li>
        <li><strong>الصحة العامة:</strong> أمراض مزمنة في الطفولة قد تعيق النمو</li>
    </ul>

    <h2 id="when-stop-growing">متى يتوقف نمو الطول؟</h2>
    <div class="ar-rich-section__table-wrap">
        <table class="ar-rich-section__table">
            <thead><tr><th>الجنس</th><th>التوقف</th><th>الملاحظة</th></tr></thead>
            <tbody>
                <tr><td><strong>البنات</strong></td><td>14-15 سنة</td><td>بعد سنتين تقريباً من بداية الدورة الشهرية</td></tr>
                <tr><td><strong>الأولاد</strong></td><td>16-18 سنة</td><td>قد يستمر بعض النمو حتى 21 في حالات نادرة</td></tr>
            </tbody>
        </table>
    </div>
    <p>صفائح النمو (Growth Plates) في العظام تُغلق وتتحول لعظم صلب — بعدها <strong>لا يمكن زيادة الطول طبيعياً</strong>. لكن تحسين الوضعية (Posture) والتمارين قد تُضيف 1-2 سم ظاهرياً.</p>

    <h2 id="height-across-history">هل يزداد الطول عبر الأجيال؟</h2>
    <p>نعم — ظاهرة <strong>الاتجاه العلماني (Secular Trend)</strong>: متوسط الطول يزداد جيلاً بعد جيل بسبب تحسن التغذية والرعاية الصحية:</p>
    <ul>
        <li><strong>هولندا:</strong> ازداد متوسط طول الرجال 20 سم خلال 150 سنة (من ~163 إلى 184 سم)</li>
        <li><strong>اليابان:</strong> ازداد 10 سم خلال 50 سنة (بعد الحرب العالمية الثانية)</li>
        <li><strong>الإمارات:</strong> الجيل الحالي أطول من أجدادهم بـ 5-8 سم بسبب التحسن الاقتصادي والتغذوي</li>
    </ul>

    <p style="margin-top: 2rem; padding: 1rem; border-radius: 8px; background: rgba(234,179,8,0.08); font-size: 0.85rem; color: var(--text-muted);">
        ⚠️ <strong>ملاحظة:</strong> متوسطات الطول تقديرية وتختلف حسب مصدر الدراسة والعينة. الأرقام المذكورة من World Population Review و NCD Risk Factor Collaboration و WHO.
    </p>
`;
