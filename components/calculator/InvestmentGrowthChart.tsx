// InvestmentGrowthChart — Doughnut + Area chart for investment calculators
"use client";

import { useMemo } from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
);

interface InvestmentGrowthChartProps {
    totalInvested: number;
    estimatedReturns: number;
    maturityValue: number;
    monthlyAmount: number;
    rate: number;
    tenureMonths: number;
    calcType: string;
}

function formatINR(num: number): string {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
    return "₹" + num.toLocaleString("en-IN");
}

export default function InvestmentGrowthChart({
    totalInvested,
    estimatedReturns,
    monthlyAmount,
    rate,
    tenureMonths,
    calcType,
}: InvestmentGrowthChartProps) {
    // Doughnut: Invested vs Returns
    const doughnutData = useMemo(
        () => ({
            labels: ["Total Invested", "Est. Returns"],
            datasets: [
                {
                    data: [totalInvested, estimatedReturns],
                    backgroundColor: ["#4f46e5", "#10b981"],
                    borderColor: ["#4338ca", "#059669"],
                    borderWidth: 2,
                    hoverOffset: 8,
                },
            ],
        }),
        [totalInvested, estimatedReturns]
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

    // Growth curve over time
    const growthData = useMemo(() => {
        const years = Math.ceil(tenureMonths / 12);
        const monthlyRate = rate / 12 / 100;
        const labels: string[] = [];
        const investedLine: number[] = [];
        const corpusLine: number[] = [];
        const isSIP = ["sip", "rd", "nps", "elss"].includes(calcType);
        const isFD = ["fd"].includes(calcType);

        for (let y = 1; y <= years; y++) {
            labels.push(`Y${y}`);
            const months = y * 12;

            if (isSIP) {
                // SIP: FV = P × [((1+r)^n - 1) / r] × (1+r)
                const fvSIP =
                    monthlyAmount *
                    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
                    (1 + monthlyRate);
                investedLine.push(monthlyAmount * months);
                corpusLine.push(Math.round(fvSIP));
            } else if (isFD) {
                // FD: compound interest A = P(1+r/n)^(nt)
                const a = monthlyAmount * Math.pow(1 + rate / 400, y * 4);
                investedLine.push(monthlyAmount);
                corpusLine.push(Math.round(a));
            } else {
                // PPF / lump sum: A = P(1+r)^t
                const a = monthlyAmount * Math.pow(1 + rate / 100, y);
                investedLine.push(monthlyAmount);
                corpusLine.push(Math.round(a));
            }
        }

        return {
            labels,
            datasets: [
                {
                    label: "Total Invested",
                    data: investedLine,
                    borderColor: "#4f46e5",
                    backgroundColor: "rgba(79, 70, 229, 0.08)",
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 2,
                },
                {
                    label: "Corpus Value",
                    data: corpusLine,
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 2,
                },
            ],
        };
    }, [monthlyAmount, rate, tenureMonths, calcType]);

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" as const },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11, family: "'Inter', sans-serif" } },
            },
            y: {
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
            <h3 className="chart-section__title">📊 Interactive Growth Analysis</h3>
            <div className="chart-grid">
                {/* Doughnut */}
                <div className="chart-card">
                    <h4 className="chart-card__title">Invested vs Returns</h4>
                    <div className="chart-card__canvas" style={{ height: "280px" }}>
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                    <div className="chart-card__legend-custom">
                        <div className="chart-legend-item">
                            <span className="chart-legend-dot" style={{ background: "#4f46e5" }} />
                            <span>Invested: {formatINR(totalInvested)}</span>
                        </div>
                        <div className="chart-legend-item">
                            <span className="chart-legend-dot" style={{ background: "#10b981" }} />
                            <span>Returns: {formatINR(estimatedReturns)}</span>
                        </div>
                    </div>
                </div>

                {/* Growth Curve */}
                <div className="chart-card">
                    <h4 className="chart-card__title">Wealth Growth Over Time</h4>
                    <div className="chart-card__canvas" style={{ height: "280px" }}>
                        <Line data={growthData} options={lineOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
