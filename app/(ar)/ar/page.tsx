// Arabic Hub Page — /ar
// Premium categorized hub with 35+ Arabic calculators (financial + health/fitness)

import type { Metadata } from "next";
import Link from "next/link";
import { AR_CALCULATORS } from "@/data/ar-calculators";

export const metadata: Metadata = {
    title: "35+ حاسبة مجانية — مالية، صحة، لياقة | قروض، سعرات، BMI، دهون",
    description:
        "أكثر من 35 حاسبة مجانية: حاسبة القروض، التمويل العقاري، السعرات الحرارية، BMI، نسبة الدهون، الكتلة العضلية، الدورة الشهرية، احتياج الماء، دورة النوم والمزيد. نتائج فورية ودقيقة.",
    keywords: [...AR_CALCULATORS.map(c => c.arabicKeyword), "حاسبة سعرات حرارية", "حاسبة BMI", "حاسبة دهون الجسم", "حاسبة كتلة عضلية", "حاسبة الدورة الشهرية"],
};

/* ── Health/fitness standalone pages (not in AR_CALCULATORS data) ── */
const HEALTH_CALCULATORS = [
    { id: "hisabat-suarat-hararia", icon: "🔥", title: "حاسبة السعرات الحرارية", desc: "BMR + TDEE — Mifflin-St Jeor" },
    { id: "hisabat-ihtiyaj-alma", icon: "💧", title: "حاسبة احتياج الماء", desc: "حسب الوزن والنشاط والمناخ" },
    { id: "hisabat-kutlat-aljism", icon: "⚖️", title: "حاسبة مؤشر كتلة الجسم", desc: "BMI — تصنيف WHO" },
    { id: "hisabat-nisbat-duhun", icon: "📊", title: "حاسبة نسبة الدهون", desc: "Navy + BMI — تصنيف ACE" },
    { id: "hisabat-kutla-adaliya", icon: "💪", title: "حاسبة الكتلة العضلية", desc: "LBM — Boer/James/Hume + FFMI" },
    { id: "hisabat-karbohidrat", icon: "🍞", title: "حاسبة الكربوهيدرات", desc: "5 استراتيجيات + ماكرو" },
];

const WELLNESS_CALCULATORS = [
    { id: "hisabat-shakl-aljism", icon: "📏", title: "حاسبة شكل الجسم", desc: "7 أشكال + WHR" },
    { id: "hisabat-dawrat-alnawm", icon: "🌙", title: "حاسبة دورة النوم", desc: "90 دقيقة — 3 أوضاع" },
    { id: "hisabat-tahwil-altul", icon: "📐", title: "حاسبة تحويل الطول", desc: "سم ↔ قدم/بوصة" },
    { id: "hisabat-dawra-shahriya", icon: "🩸", title: "حاسبة الدورة الشهرية", desc: "التبويض + نافذة الخصوبة" },
];

/* ── Financial categories (driven by AR_CALCULATORS data) ── */
const AR_CATEGORIES = [
    {
        label: "القروض والتمويل",
        icon: "🏦",
        ids: [
            "hisabat-qurud", "hisabat-tamwil", "hisabat-tamwil-aqari",
            "hisabat-qist-shahri", "hisabat-faida", "hisabat-tamwil-shakhsi",
        ],
    },
    {
        label: "البنوك السعودية",
        icon: "🇸🇦",
        ids: [
            "hisabat-tamwil-rajhi", "hisabat-tamwil-rajhi-aam",
            "hisabat-tamwil-inma", "hisabat-tamwil-bilad",
        ],
    },
    {
        label: "الاستثمار والادخار",
        icon: "📈",
        ids: [
            "hisabat-istithmar", "hisabat-idkhar", "hisabat-roid",
            "hisabat-ribh", "hisabat-khasm", "hisabat-umula",
        ],
    },
    {
        label: "الراتب والضريبة",
        icon: "💼",
        ids: [
            "hisabat-ratib", "hisabat-overtime", "hisabat-dariba",
            "hisabat-nihayat-alkhidma", "hisabat-hisab-almuwatin",
        ],
    },
    {
        label: "أدوات عامة",
        icon: "🔧",
        ids: [
            "hisabat-nisba-miwiya", "hisabat-umr", "hisabat-haml",
        ],
    },
];

export default function ArHomePage() {
    return (
        <main className="ar-hub-v2">
            {/* Hero */}
            <section className="ar-hub-v2__hero">
                <div className="ar-hub-v2__badge">🌙 عربي</div>
                <h1 className="ar-hub-v2__title">
                    احسب<br />
                    <span className="ar-hub-v2__accent">بذكاء</span> مع نمررال
                </h1>
                <p className="ar-hub-v2__subtitle">
                    35+ حاسبة مجانية ودقيقة — مالية + صحة ولياقة. قروض، تمويل، سعرات حرارية، BMI، نسبة دهون، كتلة عضلية والمزيد.
                    نتائج فورية بدون تسجيل.
                </p>
                <div className="ar-hub-v2__stats">
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">35+</span><span className="ar-hub-v2__stat-label">حاسبة</span></div>
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">7</span><span className="ar-hub-v2__stat-label">فئات</span></div>
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">6</span><span className="ar-hub-v2__stat-label">دول خليجية</span></div>
                </div>
            </section>

            {/* ── Health & Fitness Categories ── */}
            <section className="ar-hub-v2__category">
                <div className="ar-hub-v2__cat-header">
                    <span className="ar-hub-v2__cat-icon">🏋️</span>
                    <h2 className="ar-hub-v2__cat-title">الصحة واللياقة</h2>
                    <span className="ar-hub-v2__cat-count">{HEALTH_CALCULATORS.length} حاسبة</span>
                </div>
                <div className="ar-hub-v2__grid">
                    {HEALTH_CALCULATORS.map((calc) => (
                        <Link key={calc.id} href={`/ar/${calc.id}`} className="ar-hub-v2__card">
                            <span className="ar-hub-v2__card-icon">{calc.icon}</span>
                            <div className="ar-hub-v2__card-body">
                                <h3 className="ar-hub-v2__card-title">{calc.title}</h3>
                                <p className="ar-hub-v2__card-desc">{calc.desc}</p>
                            </div>
                            <span className="ar-hub-v2__card-arrow">←</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="ar-hub-v2__category">
                <div className="ar-hub-v2__cat-header">
                    <span className="ar-hub-v2__cat-icon">🌿</span>
                    <h2 className="ar-hub-v2__cat-title">العافية والأدوات الصحية</h2>
                    <span className="ar-hub-v2__cat-count">{WELLNESS_CALCULATORS.length} حاسبة</span>
                </div>
                <div className="ar-hub-v2__grid">
                    {WELLNESS_CALCULATORS.map((calc) => (
                        <Link key={calc.id} href={`/ar/${calc.id}`} className="ar-hub-v2__card">
                            <span className="ar-hub-v2__card-icon">{calc.icon}</span>
                            <div className="ar-hub-v2__card-body">
                                <h3 className="ar-hub-v2__card-title">{calc.title}</h3>
                                <p className="ar-hub-v2__card-desc">{calc.desc}</p>
                            </div>
                            <span className="ar-hub-v2__card-arrow">←</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Financial Categories (driven by AR_CALCULATORS data) ── */}
            {AR_CATEGORIES.map((cat, ci) => {
                const calcs = cat.ids
                    .map(id => AR_CALCULATORS.find(c => c.id === id))
                    .filter(Boolean);
                if (calcs.length === 0) return null;
                return (
                    <section key={ci} className="ar-hub-v2__category">
                        <div className="ar-hub-v2__cat-header">
                            <span className="ar-hub-v2__cat-icon">{cat.icon}</span>
                            <h2 className="ar-hub-v2__cat-title">{cat.label}</h2>
                            <span className="ar-hub-v2__cat-count">{calcs.length} حاسبة</span>
                        </div>
                        <div className="ar-hub-v2__grid">
                            {calcs.map((calc) => calc && (
                                <Link key={calc.id} href={`/ar/${calc.id}`} className="ar-hub-v2__card">
                                    <span className="ar-hub-v2__card-icon">{calc.icon}</span>
                                    <div className="ar-hub-v2__card-body">
                                        <h3 className="ar-hub-v2__card-title">{calc.arabicTitle}</h3>
                                        <p className="ar-hub-v2__card-desc">{calc.subtitle}</p>
                                    </div>
                                    <span className="ar-hub-v2__card-arrow">←</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* SEO Content */}
            <section className="ar-hub-v2__seo">
                <h2 className="ar-hub-v2__seo-heading">لماذا نمررال؟</h2>
                <div className="ar-hub-v2__seo-grid">
                    <div className="ar-hub-v2__seo-item">
                        <span className="ar-hub-v2__seo-icon">🎯</span>
                        <h3>دقة عالية</h3>
                        <p>معادلات مالية قياسية مع مراعاة أنظمة التمويل الإسلامي والتقليدي في الخليج العربي.</p>
                    </div>
                    <div className="ar-hub-v2__seo-item">
                        <span className="ar-hub-v2__seo-icon">⚡</span>
                        <h3>فوري ومجاني</h3>
                        <p>نتائج فورية بدون تسجيل أو اشتراك. جميع الحاسبات مجانية بالكامل.</p>
                    </div>
                    <div className="ar-hub-v2__seo-item">
                        <span className="ar-hub-v2__seo-icon">🔒</span>
                        <h3>خصوصية تامة</h3>
                        <p>جميع الحسابات تتم في متصفحك. لا نحفظ أي بيانات ولا نشاركها مع أي طرف.</p>
                    </div>
                </div>
            </section>

            {/* Extended SEO text */}
            <section className="ar-hub-v2__seo-text">
                <h2>عن حاسبات نمررال العربية</h2>
                <p>
                    نمررال هي منصة حاسبات مجانية بالكامل تغطي أهم الأدوات المالية والصحية في الخليج العربي:
                    حاسبة القروض بالفائدة المتناقصة، حاسبة التمويل العقاري، حاسبة السعرات الحرارية (Mifflin-St Jeor)،
                    حاسبة مؤشر كتلة الجسم (BMI)، حاسبة نسبة الدهون (US Navy)، حاسبة الكتلة العضلية (LBM)،
                    حاسبة الدورة الشهرية والتبويض، حاسبة احتياج الماء، وحاسبة دورة النوم.
                </p>
                <p>
                    سواء كنت تقارن عروض تمويل بنكية، تخطط لشراء عقار، تحسب سعراتك اليومية،
                    تتابع نسبة دهون جسمك، أو تخططين للحمل — ستجدين الأداة المناسبة هنا.
                    الحاسبات مصممة لأسواق الإمارات والسعودية والكويت والبحرين وعمان،
                    مع مراعاة الأنظمة المالية المحلية والإرشادات الصحية الإقليمية (MOHAP/SFDA).
                </p>
            </section>
        </main>
    );
}
