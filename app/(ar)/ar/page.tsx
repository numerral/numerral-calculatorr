// Arabic Hub Page — /ar
// Displays all 10 Arabic calculators as a grid with Arabic titles and descriptions

import type { Metadata } from "next";
import Link from "next/link";
import { AR_CALCULATORS } from "@/data/ar-calculators";

export const metadata: Metadata = {
    title: "حاسبات مالية مجانية — قروض، تمويل، استثمار، خصم",
    description:
        "أكثر من 10 حاسبات مالية مجانية: حاسبة القروض، التمويل العقاري، القسط الشهري، الفائدة المركبة، الاستثمار، الادخار، العائد على الاستثمار، الربح والخصم. نتائج فورية ودقيقة.",
    keywords: AR_CALCULATORS.map(c => c.arabicKeyword),
};

export default function ArHomePage() {
    return (
        <main className="ar-hub">
            {/* Hero */}
            <section className="ar-hub__hero">
                <h1 className="ar-hub__title">
                    احسب <span className="ar-hub__title-accent">بذكاء</span> مع نمررال
                </h1>
                <p className="ar-hub__subtitle">
                    حاسبات مالية مجانية ودقيقة — قروض، تمويل عقاري، استثمار، ادخار، والمزيد.
                    نتائج فورية بدون تسجيل.
                </p>
            </section>

            {/* Calculator grid */}
            <section className="ar-hub__grid-section">
                <div className="ar-hub__grid">
                    {AR_CALCULATORS.map((calc) => (
                        <Link
                            key={calc.id}
                            href={`/ar/${calc.id}`}
                            className="ar-card"
                        >
                            <span className="ar-card__icon">{calc.icon}</span>
                            <h2 className="ar-card__title">{calc.arabicTitle}</h2>
                            <p className="ar-card__desc">{calc.subtitle}</p>
                            <span className="ar-card__cta">افتح الحاسبة ←</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SEO text */}
            <section className="ar-hub__seo">
                <h2>عن حاسبات نمررال العربية</h2>
                <p>
                    نمررال هي منصة حاسبات مالية مجانية بالكامل تغطي أهم الأدوات المالية في الخليج العربي:
                    حاسبة القروض بالفائدة المتناقصة، حاسبة التمويل العقاري بالمعدل الثابت والمتغير،
                    حاسبة القسط الشهري لجميع أنواع التمويل، حاسبة الفائدة المركبة والبسيطة،
                    حاسبة الاستثمار والعائد المركب السنوي، حاسبة الادخار، حاسبة الربح وهامش الربحية،
                    وحاسبة الخصم. جميع الأدوات تعمل بمعادلات مالية قياسية وتقدم نتائج فورية ودقيقة
                    بدون تسجيل.
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
