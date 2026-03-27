// ResultCard — child of CalculatorCore (inherits client boundary)
// DO NOT add "use client" here — CalculatorCore is the boundary.

import { type CarLoanResult } from "@/lib/calculators/carLoanEmi";

interface ResultCardProps {
    result: CarLoanResult;
    principal: number;
    locale?: "en" | "ar";
}

function fmtCurrency(num: number, locale: "en" | "ar"): string {
    if (locale === "ar") return num.toLocaleString("ar-SA") + " ر.س";
    return "₹" + num.toLocaleString("en-IN");
}

const L = {
    en: { emi: "Your Monthly EMI", principal: "Principal", interest: "Total Interest", payable: "Total Payable", breakdown: "Breakdown", intToPrinc: "Interest-to-Principal", copy: "📋 Copy", share: "📤 Share" },
    ar: { emi: "القسط الشهري", principal: "المبلغ الأصلي", interest: "إجمالي الأرباح", payable: "إجمالي المسدد", breakdown: "التفاصيل", intToPrinc: "نسبة الأرباح للمبلغ", copy: "📋 نسخ", share: "📤 مشاركة" },
};

export default function ResultCard({ result, principal, locale = "en" }: ResultCardProps) {
    const t = L[locale];
    const fmt = (n: number) => fmtCurrency(n, locale);

    const handleCopy = () => {
        const text = [
            `${t.emi}: ${fmt(result.emi)}`,
            `${t.principal}: ${fmt(principal)}`,
            `${t.interest}: ${fmt(result.totalInterest)}`,
            `${t.payable}: ${fmt(result.totalPayable)}`,
        ].join(" | ");
        navigator.clipboard.writeText(text);
    };

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="calc-result" aria-live="polite">
            <p className="calc-result__label">{t.emi}</p>
            <p className="calc-result__emi">{fmt(result.emi)}</p>

            {/* Stat trio */}
            <div className="calc-result__stats">
                <div className="calc-result__stat">
                    <p className="calc-result__stat-label">{t.principal}</p>
                    <p className="calc-result__stat-value">{fmt(principal)}</p>
                </div>
                <div className="calc-result__stat">
                    <p className="calc-result__stat-label">{t.interest}</p>
                    <p className="calc-result__stat-value">
                        {fmt(result.totalInterest)}
                    </p>
                </div>
                <div className="calc-result__stat">
                    <p className="calc-result__stat-label">{t.payable}</p>
                    <p className="calc-result__stat-value">
                        {fmt(result.totalPayable)}
                    </p>
                </div>
            </div>

            {/* Text-only breakdown (no chart) */}
            <div className="calc-result__breakdown">
                <p className="calc-result__breakdown-title">{t.breakdown}</p>
                <p className="calc-result__breakdown-line">
                    {t.principal}: {fmt(principal)} ({result.principalPercent}%)
                </p>
                <p className="calc-result__breakdown-line">
                    {t.interest}: {fmt(result.totalInterest)} (
                    {result.interestPercent}%)
                </p>
                <p className="calc-result__breakdown-line">
                    {t.intToPrinc}: {result.interestRatio}%
                </p>
            </div>

            {/* Actions */}
            <div className="calc-result__actions">
                <button className="btn btn--ghost" onClick={handleCopy}>
                    {t.copy}
                </button>
                <button className="btn btn--ghost" onClick={handleShare}>
                    {t.share}
                </button>
            </div>
        </div>
    );
}
