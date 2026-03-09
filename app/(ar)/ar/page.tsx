// Arabic Hub Page — /ar
// Premium categorized hub with 25 Arabic calculators

import type { Metadata } from "next";
import Link from "next/link";
import { AR_CALCULATORS } from "@/data/ar-calculators";

export const metadata: Metadata = {
    title: "25 حاسبة مالية مجانية — قروض، تمويل، استثمار، راتب، ضريبة",
    description:
        "أكثر من 25 حاسبة مالية مجانية: حاسبة القروض، التمويل العقاري، القسط الشهري، الفائدة المركبة، الاستثمار، الادخار، العائد على الاستثمار، الراتب، الضريبة والمزيد. نتائج فورية ودقيقة.",
    keywords: AR_CALCULATORS.map(c => c.arabicKeyword),
};

const AR_CATEGORIES = [
    {
        label: "القروض والتمويل",
        icon: "🏦",
        ids: [
            "loan-calculator", "finance-calculator", "mortgage-calculator",
            "monthly-installment", "interest-calculator", "personal-finance",
        ],
    },
    {
        label: "البنوك السعودية",
        icon: "🇸🇦",
        ids: [
            "rajhi-personal-finance", "rajhi-finance", "inma-personal-finance",
            "bilad-personal-finance",
        ],
    },
    {
        label: "الاستثمار والادخار",
        icon: "📈",
        ids: [
            "investment-calculator", "savings-calculator", "roi-calculator",
            "profit-calculator", "discount-calculator", "commission-calculator",
        ],
    },
    {
        label: "الراتب والضريبة",
        icon: "💼",
        ids: [
            "salary-calculator", "overtime-calculator", "tax-calculator",
            "end-of-service", "citizen-account",
        ],
    },
    {
        label: "أدوات عامة",
        icon: "🔧",
        ids: [
            "percentage-calculator", "age-calculator", "pregnancy-calculator",
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
                    25 حاسبة مالية مجانية ودقيقة — قروض، تمويل عقاري، استثمار، ادخار، راتب والمزيد.
                    نتائج فورية بدون تسجيل.
                </p>
                <div className="ar-hub-v2__stats">
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">25</span><span className="ar-hub-v2__stat-label">حاسبة</span></div>
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">5</span><span className="ar-hub-v2__stat-label">فئات</span></div>
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">6</span><span className="ar-hub-v2__stat-label">دول خليجية</span></div>
                </div>
            </section>

            {/* Categorized Calculator Grid */}
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
                    نمررال هي منصة حاسبات مالية مجانية بالكامل تغطي أهم الأدوات المالية في الخليج العربي:
                    حاسبة القروض بالفائدة المتناقصة، حاسبة التمويل العقاري بالمعدل الثابت والمتغير،
                    حاسبة القسط الشهري لجميع أنواع التمويل، حاسبة الفائدة المركبة والبسيطة،
                    حاسبة الاستثمار والعائد المركب السنوي، حاسبة الادخار، حاسبة الربح وهامش الربحية،
                    وحاسبة الخصم.
                </p>
                <p>
                    سواء كنت تقارن عروض تمويل بنكية، تخطط لشراء عقار، تحسب عائد استثمارك،
                    أو تقيّم ربحية مشروعك — ستجد الأداة المناسبة هنا. الحاسبات مصممة لأسواق
                    الإمارات والسعودية والكويت والبحرين وعمان، مع مراعاة الأنظمة المالية المحلية
                    ومتطلبات التمويل الإسلامي والتقليدي.
                </p>
            </section>
        </main>
    );
}
