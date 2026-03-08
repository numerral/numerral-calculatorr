// ArCustomCalculators — Client components for Arabic-specific calculators
// Pregnancy, End-of-Service Gratuity, Citizen Account
"use client";

import { useState, useMemo } from "react";

// ─── Formatting ───
function fmtNum(n: number): string {
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// ═══════════════════════════════════════════════════
// حاسبة الحمل — Pregnancy Due Date Calculator
// Uses Naegele's Rule: LMP + 280 days
// ═══════════════════════════════════════════════════
export function PregnancyCalc() {
    const [lmpDate, setLmpDate] = useState("");

    const result = useMemo(() => {
        if (!lmpDate) return null;
        const lmp = new Date(lmpDate);
        if (isNaN(lmp.getTime())) return null;

        // Naegele's rule: add 280 days (40 weeks)
        const dueDate = new Date(lmp);
        dueDate.setDate(dueDate.getDate() + 280);

        // Current gestational age
        const today = new Date();
        const diffMs = today.getTime() - lmp.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;

        // Days remaining
        const remainMs = dueDate.getTime() - today.getTime();
        const daysRemaining = Math.max(0, Math.ceil(remainMs / (1000 * 60 * 60 * 24)));

        // Trimester
        let trimester = "الثلث الأول";
        let trimesterNum = 1;
        if (weeks >= 28) { trimester = "الثلث الثالث"; trimesterNum = 3; }
        else if (weeks >= 14) { trimester = "الثلث الثاني"; trimesterNum = 2; }

        // Key milestones
        const week12 = new Date(lmp); week12.setDate(week12.getDate() + 84);
        const week20 = new Date(lmp); week20.setDate(week20.getDate() + 140);
        const week28 = new Date(lmp); week28.setDate(week28.getDate() + 196);

        return {
            dueDate,
            weeks,
            days,
            totalDays,
            daysRemaining,
            trimester,
            trimesterNum,
            week12,
            week20,
            week28,
        };
    }, [lmpDate]);

    const formatDate = (d: Date) => d.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-group">
                <label>تاريخ أول يوم من آخر دورة شهرية</label>
                <input
                    type="date"
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="ar-custom-calc__date-input"
                />
            </div>

            {result && (
                <div className="ar-custom-calc__results">
                    <div className="ar-custom-calc__result-main">
                        <span className="ar-custom-calc__result-label">تاريخ الولادة المتوقع</span>
                        <span className="ar-custom-calc__result-value">{formatDate(result.dueDate)}</span>
                    </div>

                    <div className="ar-custom-calc__result-grid">
                        <div className="ar-custom-calc__result-card">
                            <span className="ar-custom-calc__card-icon">📅</span>
                            <span className="ar-custom-calc__card-value">{result.weeks} أسبوع و {result.days} أيام</span>
                            <span className="ar-custom-calc__card-label">عمر الحمل الحالي</span>
                        </div>
                        <div className="ar-custom-calc__result-card">
                            <span className="ar-custom-calc__card-icon">⏳</span>
                            <span className="ar-custom-calc__card-value">{result.daysRemaining} يوم</span>
                            <span className="ar-custom-calc__card-label">الأيام المتبقية</span>
                        </div>
                        <div className="ar-custom-calc__result-card">
                            <span className="ar-custom-calc__card-icon">🤰</span>
                            <span className="ar-custom-calc__card-value">{result.trimester}</span>
                            <span className="ar-custom-calc__card-label">المرحلة الحالية</span>
                        </div>
                    </div>

                    <div className="ar-custom-calc__milestones">
                        <h3>📌 المعالم الرئيسية</h3>
                        <div className="ar-custom-calc__milestone">
                            <span>نهاية الثلث الأول (الأسبوع 12)</span>
                            <span>{formatDate(result.week12)}</span>
                        </div>
                        <div className="ar-custom-calc__milestone">
                            <span>فحص منتصف الحمل (الأسبوع 20)</span>
                            <span>{formatDate(result.week20)}</span>
                        </div>
                        <div className="ar-custom-calc__milestone">
                            <span>بداية الثلث الثالث (الأسبوع 28)</span>
                            <span>{formatDate(result.week28)}</span>
                        </div>
                        <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight">
                            <span>تاريخ الولادة المتوقع (الأسبوع 40)</span>
                            <span>{formatDate(result.dueDate)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════
// حاسبة نهاية الخدمة — End of Service Gratuity
// Supports Saudi Arabia and UAE labor law
// ═══════════════════════════════════════════════════
export function EndOfServiceCalc() {
    const [country, setCountry] = useState<"sa" | "uae">("sa");
    const [salary, setSalary] = useState(10000);
    const [years, setYears] = useState(5);
    const [months, setMonths] = useState(0);
    const [reason, setReason] = useState<"termination" | "resignation">("termination");

    const result = useMemo(() => {
        const totalYears = years + months / 12;

        if (country === "sa") {
            // Saudi formula: first 5 years = 0.5 month/year, after = 1 month/year
            let fullGratuity = 0;
            if (totalYears <= 5) {
                fullGratuity = salary * 0.5 * totalYears;
            } else {
                fullGratuity = (salary * 0.5 * 5) + (salary * 1 * (totalYears - 5));
            }

            // Apply resignation rules
            let finalGratuity = fullGratuity;
            if (reason === "resignation") {
                if (totalYears < 2) finalGratuity = 0;
                else if (totalYears < 5) finalGratuity = fullGratuity / 3;
                else if (totalYears < 10) finalGratuity = (fullGratuity * 2) / 3;
                // 10+ years = full amount
            }

            return { fullGratuity, finalGratuity, country: "sa" as const };
        } else {
            // UAE formula: first 5 years = 21 days/year, after = 30 days/year
            const dailySalary = salary / 30;
            let fullGratuity = 0;
            if (totalYears <= 5) {
                fullGratuity = dailySalary * 21 * totalYears;
            } else {
                fullGratuity = (dailySalary * 21 * 5) + (dailySalary * 30 * (totalYears - 5));
            }
            // Cap at 2 years salary
            const cap = salary * 24;
            if (fullGratuity > cap) fullGratuity = cap;

            // Resignation rules
            let finalGratuity = fullGratuity;
            if (reason === "resignation") {
                if (totalYears < 1) finalGratuity = 0;
                else if (totalYears < 3) finalGratuity = fullGratuity / 3;
                else if (totalYears < 5) finalGratuity = (fullGratuity * 2) / 3;
                // 5+ years = full
            }

            return { fullGratuity, finalGratuity, country: "uae" as const };
        }
    }, [country, salary, years, months, reason]);

    return (
        <div className="ar-custom-calc">
            {/* Country selector */}
            <div className="ar-custom-calc__toggle-row">
                <button
                    className={`ar-custom-calc__toggle ${country === "sa" ? "ar-custom-calc__toggle--active" : ""}`}
                    onClick={() => setCountry("sa")}
                >
                    🇸🇦 السعودية
                </button>
                <button
                    className={`ar-custom-calc__toggle ${country === "uae" ? "ar-custom-calc__toggle--active" : ""}`}
                    onClick={() => setCountry("uae")}
                >
                    🇦🇪 الإمارات
                </button>
            </div>

            {/* Reason */}
            <div className="ar-custom-calc__toggle-row">
                <button
                    className={`ar-custom-calc__toggle ${reason === "termination" ? "ar-custom-calc__toggle--active" : ""}`}
                    onClick={() => setReason("termination")}
                >
                    إنهاء خدمات
                </button>
                <button
                    className={`ar-custom-calc__toggle ${reason === "resignation" ? "ar-custom-calc__toggle--active" : ""}`}
                    onClick={() => setReason("resignation")}
                >
                    استقالة
                </button>
            </div>

            <div className="ar-custom-calc__input-group">
                <label>الراتب الأساسي الشهري ({country === "sa" ? "ريال" : "درهم"})</label>
                <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    min={0}
                    className="ar-custom-calc__number-input"
                />
            </div>

            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>سنوات الخدمة</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        min={0}
                        max={50}
                        className="ar-custom-calc__number-input"
                    />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>أشهر إضافية</label>
                    <input
                        type="number"
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        min={0}
                        max={11}
                        className="ar-custom-calc__number-input"
                    />
                </div>
            </div>

            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">مكافأة نهاية الخدمة المستحقة</span>
                    <span className="ar-custom-calc__result-value">
                        {fmtNum(result.finalGratuity)} {country === "sa" ? "ريال" : "درهم"}
                    </span>
                </div>
                {reason === "resignation" && result.finalGratuity !== result.fullGratuity && (
                    <p className="ar-custom-calc__note">
                        المكافأة الكاملة: {fmtNum(result.fullGratuity)} {country === "sa" ? "ريال" : "درهم"} —
                        تم تطبيق نسبة الاستقالة حسب نظام العمل
                    </p>
                )}
                {reason === "resignation" && result.finalGratuity === 0 && (
                    <p className="ar-custom-calc__note ar-custom-calc__note--warning">
                        ⚠️ {country === "sa" ? "لا تستحق مكافأة عند الاستقالة قبل إتمام سنتين" : "لا تستحق مكافأة عند الاستقالة قبل إتمام سنة واحدة"}
                    </p>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// حاسبة حساب المواطن — Citizen Account Estimator
// Simplified estimation based on income and dependents
// ═══════════════════════════════════════════════════
export function CitizenAccountCalc() {
    const [income, setIncome] = useState(8000);
    const [dependentsOver18, setDependentsOver18] = useState(0);
    const [dependentsUnder18, setDependentsUnder18] = useState(2);
    const [maritalStatus, setMaritalStatus] = useState<"single" | "married">("married");

    const result = useMemo(() => {
        // Simplified estimation based on publicly available tiers
        // Base support: head of household
        const baseSupport = 1440; // Monthly max for head (based on 2024 data)
        const spouseSupport = maritalStatus === "married" ? 540 : 0;
        const dependentOver18Support = dependentsOver18 * 540;
        const dependentUnder18Support = dependentsUnder18 * 360;

        const maxSupport = baseSupport + spouseSupport + dependentOver18Support + dependentUnder18Support;

        // Income-based reduction
        // Higher income = lower support (simplified linear model)
        const incomeThreshold = 4000; // Below this, full support
        const maxIncomeForEligibility = 20000; // Above this, no support (family of 6)

        let reductionFactor = 0;
        if (income > incomeThreshold) {
            reductionFactor = Math.min(1, (income - incomeThreshold) / (maxIncomeForEligibility - incomeThreshold));
        }

        const estimatedSupport = Math.max(0, Math.round(maxSupport * (1 - reductionFactor)));

        const isEligible = income < maxIncomeForEligibility && estimatedSupport > 0;

        return {
            maxSupport,
            estimatedSupport,
            isEligible,
        };
    }, [income, dependentsOver18, dependentsUnder18, maritalStatus]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__toggle-row">
                <button
                    className={`ar-custom-calc__toggle ${maritalStatus === "married" ? "ar-custom-calc__toggle--active" : ""}`}
                    onClick={() => setMaritalStatus("married")}
                >
                    متزوج/ة
                </button>
                <button
                    className={`ar-custom-calc__toggle ${maritalStatus === "single" ? "ar-custom-calc__toggle--active" : ""}`}
                    onClick={() => setMaritalStatus("single")}
                >
                    أعزب/عزباء
                </button>
            </div>

            <div className="ar-custom-calc__input-group">
                <label>الدخل الشهري (ريال)</label>
                <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    min={0}
                    className="ar-custom-calc__number-input"
                />
            </div>

            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>تابعون فوق 18 سنة</label>
                    <input
                        type="number"
                        value={dependentsOver18}
                        onChange={(e) => setDependentsOver18(Number(e.target.value))}
                        min={0}
                        max={10}
                        className="ar-custom-calc__number-input"
                    />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>تابعون أقل من 18 سنة</label>
                    <input
                        type="number"
                        value={dependentsUnder18}
                        onChange={(e) => setDependentsUnder18(Number(e.target.value))}
                        min={0}
                        max={10}
                        className="ar-custom-calc__number-input"
                    />
                </div>
            </div>

            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">الدعم الشهري التقديري</span>
                    <span className="ar-custom-calc__result-value">
                        {result.isEligible ? `${fmtNum(result.estimatedSupport)} ريال` : "غير مؤهل"}
                    </span>
                </div>
                {result.isEligible && (
                    <p className="ar-custom-calc__note">
                        الحد الأقصى للدعم لعائلتك: {fmtNum(result.maxSupport)} ريال/شهر.
                        المبلغ الفعلي يعتمد على التحقق من البيانات عبر الجهات الحكومية.
                    </p>
                )}
                <p className="ar-custom-calc__note">
                    ⚠️ هذا تقدير تقريبي. المبلغ الدقيق يُحدد من خلال منصة حساب المواطن الرسمية بناءً على بيانات الجهات الحكومية.
                </p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// حاسبة الأوفر تايم — Overtime Calculator
// Saudi labor law: 150% for regular overtime, 200% for holidays
// ═══════════════════════════════════════════════════
export function OvertimeCalc() {
    const [salary, setSalary] = useState(8000);
    const [workDays, setWorkDays] = useState(22);
    const [hoursPerDay, setHoursPerDay] = useState(8);
    const [overtimeHours, setOvertimeHours] = useState(10);
    const [isHoliday, setIsHoliday] = useState(false);

    const result = useMemo(() => {
        const totalMonthlyHours = workDays * hoursPerDay;
        const hourlyRate = salary / totalMonthlyHours;
        const overtimeRate = isHoliday ? 2.0 : 1.5; // 200% holidays, 150% regular
        const overtimePayPerHour = hourlyRate * overtimeRate;
        const totalOvertimePay = overtimePayPerHour * overtimeHours;
        const totalSalary = salary + totalOvertimePay;

        return { hourlyRate, overtimeRate, overtimePayPerHour, totalOvertimePay, totalSalary };
    }, [salary, workDays, hoursPerDay, overtimeHours, isHoliday]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__toggle-row">
                <button className={`ar-custom-calc__toggle ${!isHoliday ? "ar-custom-calc__toggle--active" : ""}`} onClick={() => setIsHoliday(false)}>أيام عمل عادية (150%)</button>
                <button className={`ar-custom-calc__toggle ${isHoliday ? "ar-custom-calc__toggle--active" : ""}`} onClick={() => setIsHoliday(true)}>أيام عطل / إجازات (200%)</button>
            </div>
            <div className="ar-custom-calc__input-group">
                <label>الراتب الأساسي الشهري (ريال)</label>
                <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>أيام العمل في الشهر</label>
                    <input type="number" value={workDays} onChange={(e) => setWorkDays(Number(e.target.value))} min={1} max={31} className="ar-custom-calc__number-input" />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>ساعات العمل اليومية</label>
                    <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} min={1} max={24} className="ar-custom-calc__number-input" />
                </div>
            </div>
            <div className="ar-custom-calc__input-group">
                <label>عدد ساعات الأوفر تايم</label>
                <input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">إجمالي بدل الأوفر تايم</span>
                    <span className="ar-custom-calc__result-value">{fmtNum(result.totalOvertimePay)} ريال</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">⏰</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.hourlyRate)} ريال</span>
                        <span className="ar-custom-calc__card-label">أجر الساعة العادية</span>
                    </div>
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">💰</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.overtimePayPerHour)} ريال</span>
                        <span className="ar-custom-calc__card-label">أجر ساعة الأوفر تايم ({isHoliday ? "200%" : "150%"})</span>
                    </div>
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">📊</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.totalSalary)} ريال</span>
                        <span className="ar-custom-calc__card-label">إجمالي الراتب مع الأوفر تايم</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// حاسبة الضريبة — Saudi VAT Calculator (15%)
// ═══════════════════════════════════════════════════
export function VatCalc() {
    const [amount, setAmount] = useState(1000);
    const [mode, setMode] = useState<"add" | "remove">("add");
    const vatRate = 15;

    const result = useMemo(() => {
        if (mode === "add") {
            const vatAmount = amount * (vatRate / 100);
            return { priceBeforeVat: amount, vatAmount, priceAfterVat: amount + vatAmount };
        } else {
            const priceBeforeVat = amount / (1 + vatRate / 100);
            const vatAmount = amount - priceBeforeVat;
            return { priceBeforeVat, vatAmount, priceAfterVat: amount };
        }
    }, [amount, mode]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__toggle-row">
                <button className={`ar-custom-calc__toggle ${mode === "add" ? "ar-custom-calc__toggle--active" : ""}`} onClick={() => setMode("add")}>إضافة ضريبة (السعر بدون ضريبة)</button>
                <button className={`ar-custom-calc__toggle ${mode === "remove" ? "ar-custom-calc__toggle--active" : ""}`} onClick={() => setMode("remove")}>استخراج الضريبة (السعر شامل الضريبة)</button>
            </div>
            <div className="ar-custom-calc__input-group">
                <label>{mode === "add" ? "السعر بدون ضريبة (ريال)" : "السعر شامل الضريبة (ريال)"}</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">{mode === "add" ? "السعر شامل الضريبة" : "السعر بدون ضريبة"}</span>
                    <span className="ar-custom-calc__result-value">{fmtNum(mode === "add" ? result.priceAfterVat : result.priceBeforeVat)} ريال</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">🏷️</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.priceBeforeVat)} ريال</span>
                        <span className="ar-custom-calc__card-label">السعر بدون ضريبة</span>
                    </div>
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">🧾</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.vatAmount)} ريال</span>
                        <span className="ar-custom-calc__card-label">مبلغ الضريبة (15%)</span>
                    </div>
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">💳</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.priceAfterVat)} ريال</span>
                        <span className="ar-custom-calc__card-label">السعر شامل الضريبة</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// حاسبة الراتب — Saudi Salary Calculator
// Breakdown: Basic + Housing + Transport - GOSI
// ═══════════════════════════════════════════════════
export function SalaryCalc() {
    const [basicSalary, setBasicSalary] = useState(8000);
    const [housingPct, setHousingPct] = useState(25);
    const [transportAllowance, setTransportAllowance] = useState(500);
    const [otherAllowances, setOtherAllowances] = useState(0);

    const result = useMemo(() => {
        const housing = basicSalary * (housingPct / 100);
        const grossSalary = basicSalary + housing + transportAllowance + otherAllowances;
        // GOSI: Employee pays 9.75% of (basic + housing), capped at 45,000 SAR base
        const gosiBase = Math.min(basicSalary + housing, 45000);
        const gosiEmployee = gosiBase * 0.0975;
        const gosiEmployer = gosiBase * 0.1175; // Employer pays 11.75%
        const netSalary = grossSalary - gosiEmployee;

        return { housing, grossSalary, gosiEmployee, gosiEmployer, gosiBase, netSalary };
    }, [basicSalary, housingPct, transportAllowance, otherAllowances]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-group">
                <label>الراتب الأساسي (ريال)</label>
                <input type="number" value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>بدل السكن (% من الأساسي)</label>
                    <input type="number" value={housingPct} onChange={(e) => setHousingPct(Number(e.target.value))} min={0} max={100} className="ar-custom-calc__number-input" />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>بدل النقل (ريال)</label>
                    <input type="number" value={transportAllowance} onChange={(e) => setTransportAllowance(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
                </div>
            </div>
            <div className="ar-custom-calc__input-group">
                <label>بدلات أخرى (ريال)</label>
                <input type="number" value={otherAllowances} onChange={(e) => setOtherAllowances(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">صافي الراتب الشهري</span>
                    <span className="ar-custom-calc__result-value">{fmtNum(result.netSalary)} ريال</span>
                </div>
                <div className="ar-custom-calc__milestones">
                    <h3>📋 تفاصيل الراتب</h3>
                    <div className="ar-custom-calc__milestone"><span>الراتب الأساسي</span><span>{fmtNum(basicSalary)} ريال</span></div>
                    <div className="ar-custom-calc__milestone"><span>بدل السكن ({housingPct}%)</span><span>{fmtNum(result.housing)} ريال</span></div>
                    <div className="ar-custom-calc__milestone"><span>بدل النقل</span><span>{fmtNum(transportAllowance)} ريال</span></div>
                    {otherAllowances > 0 && <div className="ar-custom-calc__milestone"><span>بدلات أخرى</span><span>{fmtNum(otherAllowances)} ريال</span></div>}
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>إجمالي الراتب</span><span>{fmtNum(result.grossSalary)} ريال</span></div>
                    <div className="ar-custom-calc__milestone"><span>خصم التأمينات (GOSI) — 9.75%</span><span>- {fmtNum(result.gosiEmployee)} ريال</span></div>
                    <div className="ar-custom-calc__milestone ar-custom-calc__milestone--highlight"><span>صافي الراتب</span><span>{fmtNum(result.netSalary)} ريال</span></div>
                </div>
                <p className="ar-custom-calc__note">حصة صاحب العمل في التأمينات: {fmtNum(result.gosiEmployer)} ريال/شهر (11.75% من الأساسي + السكن)</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════
// حاسبة العمولة — Commission Calculator
// ═══════════════════════════════════════════════════
export function CommissionCalc() {
    const [salesAmount, setSalesAmount] = useState(100000);
    const [commissionRate, setCommissionRate] = useState(5);
    const [baseSalary, setBaseSalary] = useState(5000);

    const result = useMemo(() => {
        const commission = salesAmount * (commissionRate / 100);
        const totalEarnings = baseSalary + commission;
        const effectiveRate = salesAmount > 0 ? ((totalEarnings / salesAmount) * 100) : 0;
        return { commission, totalEarnings, effectiveRate };
    }, [salesAmount, commissionRate, baseSalary]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-group">
                <label>إجمالي المبيعات (ريال)</label>
                <input type="number" value={salesAmount} onChange={(e) => setSalesAmount(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>نسبة العمولة (%)</label>
                    <input type="number" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} min={0} max={100} step={0.5} className="ar-custom-calc__number-input" />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>الراتب الأساسي (ريال)</label>
                    <input type="number" value={baseSalary} onChange={(e) => setBaseSalary(Number(e.target.value))} min={0} className="ar-custom-calc__number-input" />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">مبلغ العمولة</span>
                    <span className="ar-custom-calc__result-value">{fmtNum(result.commission)} ريال</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">💼</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(baseSalary)} ريال</span>
                        <span className="ar-custom-calc__card-label">الراتب الأساسي</span>
                    </div>
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">🎯</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.commission)} ريال</span>
                        <span className="ar-custom-calc__card-label">العمولة ({commissionRate}%)</span>
                    </div>
                    <div className="ar-custom-calc__result-card">
                        <span className="ar-custom-calc__card-icon">💰</span>
                        <span className="ar-custom-calc__card-value">{fmtNum(result.totalEarnings)} ريال</span>
                        <span className="ar-custom-calc__card-label">إجمالي الدخل</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Dispatcher ───
interface Props {
    calcType: string;
}

const CUSTOM_CALCS: Record<string, React.FC> = {
    "pregnancy": PregnancyCalc,
    "end-of-service": EndOfServiceCalc,
    "citizen-account": CitizenAccountCalc,
    "overtime": OvertimeCalc,
    "vat": VatCalc,
    "salary": SalaryCalc,
    "commission": CommissionCalc,
};

export default function ArCustomCalculatorCore({ calcType }: Props) {
    const Comp = CUSTOM_CALCS[calcType];
    if (!Comp) return <p>الحاسبة غير متوفرة</p>;
    return <Comp />;
}

