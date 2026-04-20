// AgeCalculatorClient — Enhanced age calculator for /id/age-calculator
// Features: DOB input, "As of" date, real-time result, full unit breakdown
"use client";

import { useState, useMemo } from "react";

function getTodayString(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function calcAge(dobStr: string, asOfStr: string) {
    if (!dobStr || !asOfStr) return null;

    const dob = new Date(dobStr);
    const asOf = new Date(asOfStr);

    if (isNaN(dob.getTime()) || isNaN(asOf.getTime())) return null;
    if (dob >= asOf) return null;

    let years = asOf.getFullYear() - dob.getFullYear();
    let months = asOf.getMonth() - dob.getMonth();
    let days = asOf.getDate() - dob.getDate();

    if (days < 0) {
        months -= 1;
        // Days in the previous month relative to asOf
        const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / 86_400_000);
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBirthday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday <= asOf) {
        nextBirthday = new Date(asOf.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }
    const daysToNextBirthday = Math.ceil(
        (nextBirthday.getTime() - asOf.getTime()) / 86_400_000
    );

    // Day of week born
    const days_of_week = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dayOfWeekBorn = days_of_week[dob.getDay()];

    return {
        years,
        months,
        days,
        totalDays,
        totalMonths,
        totalWeeks,
        totalHours,
        daysToNextBirthday,
        dayOfWeekBorn,
        nextBirthdayDate: nextBirthday.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    };
}

export default function AgeCalculatorClient() {
    const [dob, setDob] = useState("1995-08-17");
    const [asOf, setAsOf] = useState(getTodayString());
    const [calculated, setCalculated] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const result = useMemo(() => calcAge(dob, asOf), [dob, asOf]);

    const handleCalculate = () => {
        setCalculated(true);
        setShowResult(true);
    };

    const fmt = (n: number) => n.toLocaleString("id-ID");

    return (
        <div className="age-calc-enhanced">
            {/* ── Inputs ─────── */}
            <div className="ar-custom-calc">
                <div className="ar-custom-calc__input-row">
                    <div className="ar-custom-calc__input-group">
                        <label htmlFor="age-dob">📅 Tanggal Lahir</label>
                        <input
                            id="age-dob"
                            type="date"
                            className="ar-custom-calc__number-input"
                            value={dob}
                            max={getTodayString()}
                            onChange={(e) => {
                                setDob(e.target.value);
                                setShowResult(false);
                            }}
                        />
                    </div>
                    <div className="ar-custom-calc__input-group">
                        <label htmlFor="age-asof">🗓️ Hitung Per Tanggal</label>
                        <input
                            id="age-asof"
                            type="date"
                            className="ar-custom-calc__number-input"
                            value={asOf}
                            onChange={(e) => {
                                setAsOf(e.target.value);
                                setShowResult(false);
                            }}
                        />
                    </div>
                </div>

                <button
                    id="age-calc-submit"
                    onClick={handleCalculate}
                    disabled={!dob || !asOf}
                    style={{
                        width: "100%",
                        padding: "0.9rem",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        marginTop: "0.75rem",
                        letterSpacing: "0.02em",
                        transition: "opacity 0.2s",
                    }}
                >
                    🔢 Hitung Sekarang
                </button>

                {/* ── Results ──────── */}
                {showResult && result && (
                    <div className="ar-custom-calc__results" style={{ marginTop: "1.25rem" }}>
                        {/* Primary Result */}
                        <div className="ar-custom-calc__result-main">
                            <span className="ar-custom-calc__result-label">Usia Anda</span>
                            <span className="ar-custom-calc__result-value" style={{ fontSize: "1.6rem" }}>
                                {result.years} Tahun {result.months} Bulan {result.days} Hari
                            </span>
                        </div>

                        {/* Secondary Cards */}
                        <div className="ar-custom-calc__result-grid">
                            <div className="ar-custom-calc__result-card">
                                <span className="ar-custom-calc__card-icon">📅</span>
                                <span className="ar-custom-calc__card-value">{fmt(result.totalDays)}</span>
                                <span className="ar-custom-calc__card-label">Total Hari</span>
                            </div>
                            <div className="ar-custom-calc__result-card">
                                <span className="ar-custom-calc__card-icon">📆</span>
                                <span className="ar-custom-calc__card-value">{fmt(result.totalMonths)}</span>
                                <span className="ar-custom-calc__card-label">Total Bulan</span>
                            </div>
                            <div className="ar-custom-calc__result-card">
                                <span className="ar-custom-calc__card-icon">🗓️</span>
                                <span className="ar-custom-calc__card-value">{fmt(result.totalWeeks)}</span>
                                <span className="ar-custom-calc__card-label">Total Minggu</span>
                            </div>
                            <div className="ar-custom-calc__result-card">
                                <span className="ar-custom-calc__card-icon">⏰</span>
                                <span className="ar-custom-calc__card-value">{fmt(result.totalHours)}</span>
                                <span className="ar-custom-calc__card-label">Total Jam</span>
                            </div>
                            <div className="ar-custom-calc__result-card">
                                <span className="ar-custom-calc__card-icon">🎉</span>
                                <span className="ar-custom-calc__card-value">{result.daysToNextBirthday} hari</span>
                                <span className="ar-custom-calc__card-label">Menuju Ulang Tahun</span>
                            </div>
                            <div className="ar-custom-calc__result-card">
                                <span className="ar-custom-calc__card-icon">🌅</span>
                                <span className="ar-custom-calc__card-value">{result.dayOfWeekBorn}</span>
                                <span className="ar-custom-calc__card-label">Hari Lahir</span>
                            </div>
                        </div>

                        {/* Next birthday info */}
                        <div style={{
                            marginTop: "0.75rem",
                            padding: "0.75rem 1rem",
                            background: "linear-gradient(135deg, #f0f0ff 0%, #faf5ff 100%)",
                            borderRadius: "10px",
                            borderLeft: "4px solid #6366f1",
                            fontSize: "0.9rem",
                            color: "#3730a3",
                        }}>
                            🎂 <strong>Ulang tahun berikutnya:</strong> {result.nextBirthdayDate} ({result.daysToNextBirthday} hari lagi)
                        </div>
                    </div>
                )}

                {showResult && !result && (
                    <div style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        background: "#fef2f2",
                        borderRadius: "10px",
                        color: "#dc2626",
                        fontSize: "0.9rem",
                    }}>
                        ⚠️ Pastikan tanggal lahir lebih awal dari tanggal perhitungan.
                    </div>
                )}
            </div>
        </div>
    );
}
