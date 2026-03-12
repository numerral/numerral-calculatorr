/**
 * Time & Date — Calculation Functions
 * Pure vanilla JS Date — no external libraries
 */

// ─── Time Calculator (add/subtract time) ───
export interface TimeCalcResult {
    originalTime: string;
    resultTime: string;
    totalSeconds: number;
    formatted: string;
}

export function addSubtractTime(
    baseHours: number, baseMinutes: number, baseSeconds: number,
    addHours: number, addMinutes: number, addSeconds: number,
    operation: "add" | "subtract"
): TimeCalcResult {
    let totalSec = baseHours * 3600 + baseMinutes * 60 + baseSeconds;
    const deltaSec = addHours * 3600 + addMinutes * 60 + addSeconds;
    totalSec = operation === "add" ? totalSec + deltaSec : totalSec - deltaSec;

    if (totalSec < 0) totalSec = 86400 + (totalSec % 86400);
    totalSec = totalSec % 86400;

    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    const fmt = (n: number) => n.toString().padStart(2, "0");
    return {
        originalTime: `${fmt(baseHours)}:${fmt(baseMinutes)}:${fmt(baseSeconds)}`,
        resultTime: `${fmt(h)}:${fmt(m)}:${fmt(s)}`,
        totalSeconds: totalSec,
        formatted: `${h}h ${m}m ${s}s`,
    };
}

// ─── Time Duration (between two times) ───
export interface TimeDurationResult {
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    totalMinutes: number;
    formatted: string;
}

export function calculateTimeDuration(
    startH: number, startM: number, startS: number,
    endH: number, endM: number, endS: number
): TimeDurationResult {
    let startSec = startH * 3600 + startM * 60 + startS;
    let endSec = endH * 3600 + endM * 60 + endS;
    if (endSec < startSec) endSec += 86400; // crosses midnight
    const diff = endSec - startSec;

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return {
        hours, minutes, seconds,
        totalSeconds: diff,
        totalMinutes: Math.floor(diff / 60),
        formatted: `${hours}h ${minutes}m ${seconds}s`,
    };
}

// ─── Time Card (work hours) ───
export interface TimeCardResult {
    grossHours: number;
    grossMinutes: number;
    breakMinutes: number;
    netHours: number;
    netMinutes: number;
    formatted: string;
    decimalHours: number;
}

export function calculateTimeCard(
    inH: number, inM: number, outH: number, outM: number, breakMins: number
): TimeCardResult {
    let inSec = inH * 60 + inM;
    let outSec = outH * 60 + outM;
    if (outSec <= inSec) outSec += 1440;
    const grossMin = outSec - inSec;
    const netMin = Math.max(0, grossMin - breakMins);

    return {
        grossHours: Math.floor(grossMin / 60),
        grossMinutes: grossMin % 60,
        breakMinutes: breakMins,
        netHours: Math.floor(netMin / 60),
        netMinutes: netMin % 60,
        formatted: `${Math.floor(netMin / 60)}h ${netMin % 60}m`,
        decimalHours: Math.round((netMin / 60) * 100) / 100,
    };
}

// ─── Hours Calculator ───
export interface HoursCalcResult {
    hours: number;
    minutes: number;
    totalMinutes: number;
    formatted: string;
}

export function calculateHoursBetween(startDate: Date, endDate: Date): HoursCalcResult {
    const diffMs = endDate.getTime() - startDate.getTime();
    const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
    return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
        totalMinutes,
        formatted: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
    };
}

// ─── Military Time Converter ───
export interface MilitaryTimeResult {
    input: string;
    military: string;
    standard: string;
    period: "AM" | "PM";
}

export function convertToMilitary(hours: number, minutes: number, period: "AM" | "PM"): MilitaryTimeResult {
    let h24 = hours;
    if (period === "AM" && hours === 12) h24 = 0;
    else if (period === "PM" && hours !== 12) h24 = hours + 12;
    const fmt = (n: number) => n.toString().padStart(2, "0");
    return {
        input: `${hours}:${fmt(minutes)} ${period}`,
        military: `${fmt(h24)}${fmt(minutes)}`,
        standard: `${hours}:${fmt(minutes)} ${period}`,
        period,
    };
}

export function convertFromMilitary(h24: number, minutes: number): MilitaryTimeResult {
    const period: "AM" | "PM" = h24 < 12 ? "AM" : "PM";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    const fmt = (n: number) => n.toString().padStart(2, "0");
    return {
        input: `${fmt(h24)}${fmt(minutes)}`,
        military: `${fmt(h24)}${fmt(minutes)}`,
        standard: `${h12}:${fmt(minutes)} ${period}`,
        period,
    };
}

// ─── Reading Time ───
export interface ReadingTimeResult {
    wordCount: number;
    readingTimeMinutes: number;
    readingTimeSeconds: number;
    speakingTimeMinutes: number;
    formatted: string;
}

export function calculateReadingTime(text: string, wpm: number = 238): ReadingTimeResult {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const totalSec = Math.round((wordCount / wpm) * 60);
    const speakingSec = Math.round((wordCount / 150) * 60);
    return {
        wordCount,
        readingTimeMinutes: Math.floor(totalSec / 60),
        readingTimeSeconds: totalSec % 60,
        speakingTimeMinutes: Math.ceil(speakingSec / 60),
        formatted: totalSec < 60 ? `${totalSec}s` : `${Math.floor(totalSec / 60)}m ${totalSec % 60}s`,
    };
}

// ─── Playback Speed ───
export interface PlaybackSpeedResult {
    originalMinutes: number;
    speeds: { speed: number; minutes: number; formatted: string; saved: string }[];
}

export function calculatePlaybackSpeed(durationMinutes: number): PlaybackSpeedResult {
    const speeds = [1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((speed) => {
        const adjusted = Math.round(durationMinutes / speed);
        const saved = durationMinutes - adjusted;
        return {
            speed,
            minutes: adjusted,
            formatted: adjusted >= 60 ? `${Math.floor(adjusted / 60)}h ${adjusted % 60}m` : `${adjusted}m`,
            saved: saved >= 60 ? `${Math.floor(saved / 60)}h ${saved % 60}m` : `${saved}m`,
        };
    });
    return { originalMinutes: durationMinutes, speeds };
}

// ─── Date Calculator (add/subtract days/weeks/months/years) ───
export interface DateCalcResult {
    original: Date;
    result: Date;
    resultFormatted: string;
    dayOfWeek: string;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function addSubtractDate(
    baseDate: Date,
    days: number, weeks: number, months: number, years: number,
    operation: "add" | "subtract"
): DateCalcResult {
    const sign = operation === "add" ? 1 : -1;
    const result = new Date(baseDate);
    result.setFullYear(result.getFullYear() + sign * years);
    result.setMonth(result.getMonth() + sign * months);
    result.setDate(result.getDate() + sign * (days + weeks * 7));
    return {
        original: baseDate,
        result,
        resultFormatted: result.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        dayOfWeek: DAYS_OF_WEEK[result.getDay()],
    };
}

// ─── Date Duration (between dates) ───
export interface DateDurationResult {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
}

export function calculateDateDuration(startDate: Date, endDate: Date): DateDurationResult {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.round(Math.abs(end.getTime() - start.getTime()) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) { months--; const prev = new Date(end.getFullYear(), end.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }

    return { years: Math.abs(years), months: Math.abs(months), days: Math.abs(days), totalDays, totalWeeks, totalMonths: Math.abs(years) * 12 + Math.abs(months) };
}

// ─── Business Days ───
export interface BusinessDaysResult {
    totalDays: number;
    businessDays: number;
    weekendDays: number;
    weeks: number;
}

export function calculateBusinessDays(startDate: Date, endDate: Date): BusinessDaysResult {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let current = new Date(start);
    let businessDays = 0;
    let weekendDays = 0;

    while (current <= end) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) businessDays++;
        else weekendDays++;
        current.setDate(current.getDate() + 1);
    }

    const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    return { totalDays, businessDays, weekendDays, weeks: Math.floor(totalDays / 7) };
}

// ─── Days Until ───
export interface DaysUntilResult {
    targetDate: Date;
    daysUntil: number;
    weeksUntil: number;
    monthsUntil: number;
    hoursUntil: number;
    isPast: boolean;
    formatted: string;
}

export function calculateDaysUntil(targetDate: Date): DaysUntilResult {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - now.getTime();
    const totalDays = Math.round(diffMs / 86400000);
    const isPast = totalDays < 0;
    const absDays = Math.abs(totalDays);

    return {
        targetDate: target,
        daysUntil: totalDays,
        weeksUntil: Math.floor(absDays / 7),
        monthsUntil: Math.floor(absDays / 30),
        hoursUntil: Math.abs(Math.round(diffMs / 3600000)),
        isPast,
        formatted: target.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    };
}

// ─── Birth Year ───
export interface BirthYearResult {
    age: number;
    birthYear: number;
    possibleBirthYears: [number, number];
}

export function calculateBirthYear(age: number): BirthYearResult {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return {
        age,
        birthYear,
        possibleBirthYears: [birthYear - 1, birthYear],
    };
}

// ─── Days Left In Year ───
export interface DaysLeftResult {
    today: Date;
    daysLeft: number;
    daysPassed: number;
    totalDays: number;
    percentComplete: number;
    weeksLeft: number;
}

export function calculateDaysLeftInYear(): DaysLeftResult {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    const daysPassed = Math.round((now.getTime() - start.getTime()) / 86400000) + 1;
    const daysLeft = totalDays - daysPassed;

    return {
        today: now,
        daysLeft,
        daysPassed,
        totalDays,
        percentComplete: Math.round((daysPassed / totalDays) * 10000) / 100,
        weeksLeft: Math.floor(daysLeft / 7),
    };
}

// ─── Deadline Calculator ───
export interface DeadlineResult {
    startDate: Date;
    leadTimeDays: number;
    deadlineDate: Date;
    deadlineFormatted: string;
    dayOfWeek: string;
    businessDeadline: Date;
    businessDeadlineFormatted: string;
}

export function calculateDeadline(startDate: Date, leadTimeDays: number): DeadlineResult {
    const deadline = new Date(startDate);
    deadline.setDate(deadline.getDate() + leadTimeDays);

    // Business deadline (skip weekends)
    const bizDeadline = new Date(startDate);
    let remaining = leadTimeDays;
    while (remaining > 0) {
        bizDeadline.setDate(bizDeadline.getDate() + 1);
        const day = bizDeadline.getDay();
        if (day !== 0 && day !== 6) remaining--;
    }

    return {
        startDate,
        leadTimeDays,
        deadlineDate: deadline,
        deadlineFormatted: deadline.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        dayOfWeek: DAYS_OF_WEEK[deadline.getDay()],
        businessDeadline: bizDeadline,
        businessDeadlineFormatted: bizDeadline.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    };
}

// ─── Week Calculator ───
export interface WeekCalcResult {
    date: Date;
    weekNumber: number;
    year: number;
    weekStart: Date;
    weekEnd: Date;
    weekStartFormatted: string;
    weekEndFormatted: string;
    dayOfYear: number;
}

export function calculateWeekNumber(date: Date): WeekCalcResult {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const dayOfYear = Math.ceil((d.getTime() - yearStart.getTime()) / 86400000) + 1;

    // ISO week
    const jan4 = new Date(d.getFullYear(), 0, 4);
    const startOfWeek1 = new Date(jan4);
    startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
    const weekNumber = Math.ceil(((d.getTime() - startOfWeek1.getTime()) / 86400000 + 1) / 7);

    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return {
        date: d,
        weekNumber: Math.max(1, weekNumber),
        year: d.getFullYear(),
        weekStart,
        weekEnd,
        weekStartFormatted: weekStart.toLocaleDateString("en-US", opts),
        weekEndFormatted: weekEnd.toLocaleDateString("en-US", opts),
        dayOfYear,
    };
}
