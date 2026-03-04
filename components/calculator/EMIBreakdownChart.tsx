// EMIBreakdownChart — Doughnut chart showing Principal vs Interest breakdown
// Also includes a year-by-year amortization bar chart
"use client";

import { useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler
);

interface EMIBreakdownChartProps {
    principal: number;
    totalInterest: number;
    emi: number;
    rate: number;
    tenureMonths: number;
}

function formatINR(num: number): string {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
    return "₹" + num.toLocaleString("en-IN");
}

export default function EMIBreakdownChart({
    principal,
    totalInterest,
    emi,
    rate,
    tenureMonths,
}: EMIBreakdownChartProps) {
    // Doughnut data
    const doughnutData = useMemo(
        () => ({
            labels: ["Principal", "Interest"],
            datasets: [
                {
                    data: [principal, totalInterest],
                    backgroundColor: ["#4f46e5", "#f59e0b"],
                    borderColor: ["#4338ca", "#d97706"],
                    borderWidth: 2,
                    hoverOffset: 8,
                },
            ],
        }),
        [principal, totalInterest]
    );

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                    font: { size: 13, family: "'Inter', sans-serif" },
                },
            },
            tooltip: {
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: (ctx: any) =>
                        `${ctx.label}: ${formatINR(ctx.raw as number)}`,
                },
            },
        },
    };

    // Year-by-year amortization data
    const amortizationData = useMemo(() => {
        const years = Math.ceil(tenureMonths / 12);
        const monthlyRate = rate / 12 / 100;
        let balance = principal;
        const yearLabels: string[] = [];
        const principalPaid: number[] = [];
        const interestPaid: number[] = [];

        for (let y = 1; y <= years; y++) {
            const monthsInYear = y === years ? tenureMonths - (y - 1) * 12 : 12;
            let yearPrincipal = 0;
            let yearInterest = 0;

            for (let m = 0; m < monthsInYear; m++) {
                const interestForMonth = balance * monthlyRate;
                const principalForMonth = emi - interestForMonth;
                yearPrincipal += principalForMonth;
                yearInterest += interestForMonth;
                balance = Math.max(0, balance - principalForMonth);
            }

            yearLabels.push(`Y${y}`);
            principalPaid.push(Math.round(yearPrincipal));
            interestPaid.push(Math.round(yearInterest));
        }

        return {
            labels: yearLabels,
            datasets: [
                {
                    label: "Principal",
                    data: principalPaid,
                    backgroundColor: "#4f46e5",
                    borderRadius: 4,
                    barPercentage: 0.7,
                },
                {
                    label: "Interest",
                    data: interestPaid,
                    backgroundColor: "#f59e0b",
                    borderRadius: 4,
                    barPercentage: 0.7,
                },
            ],
        };
    }, [principal, emi, rate, tenureMonths]);

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { font: { size: 11, family: "'Inter', sans-serif" } },
            },
            y: {
                stacked: true,
                grid: { color: "rgba(0,0,0,0.06)" },
                ticks: {
                    font: { size: 11, family: "'Inter', sans-serif" },
                    callback: (value: string | number) => formatINR(Number(value)),
                },
            },
        },
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                    font: { size: 12, family: "'Inter', sans-serif" },
                },
            },
            tooltip: {
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: (ctx: any) =>
                        `${ctx.dataset.label}: ${formatINR(ctx.raw as number)}`,
                },
            },
        },
    };

    return (
        <div className="chart-section">
            <h3 className="chart-section__title">📊 Interactive EMI Breakdown</h3>
            <div className="chart-grid">
                {/* Doughnut */}
                <div className="chart-card">
                    <h4 className="chart-card__title">Principal vs Interest</h4>
                    <div className="chart-card__canvas" style={{ height: "280px" }}>
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                    <div className="chart-card__legend-custom">
                        <div className="chart-legend-item">
                            <span className="chart-legend-dot" style={{ background: "#4f46e5" }} />
                            <span>Principal: {formatINR(principal)}</span>
                        </div>
                        <div className="chart-legend-item">
                            <span className="chart-legend-dot" style={{ background: "#f59e0b" }} />
                            <span>Interest: {formatINR(totalInterest)}</span>
                        </div>
                    </div>
                </div>

                {/* Amortization Bar */}
                <div className="chart-card">
                    <h4 className="chart-card__title">Year-by-Year Payment Split</h4>
                    <div className="chart-card__canvas" style={{ height: "280px" }}>
                        <Bar data={amortizationData} options={barOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
