// CalculatorCore — THE ONLY "use client" component for calculator interaction.
//
// Owns all interactive state: amount, rate, tenure, tenureUnit.
// Derives EMI result via useMemo (live-compute, no Calculate button).
// Orchestrates child components:
//   - InputPanel  (sliders + text inputs)
//   - ResultCard  (EMI + breakdown)
//   - ComparisonTable (3 scenarios)
//
// Everything outside this boundary (Explanation, Related, FAQ, Trending,
// Footer) stays server-rendered.
"use client";

import { useState, useMemo } from "react";
import { type CalculatorDefaults, type SliderRanges } from "@/lib/types";
import {
    calculateCarLoanEmi,
    type CarLoanInput,
} from "@/lib/calculators/carLoanEmi";
import InputPanel from "./InputPanel";
import ResultCard from "./ResultCard";
import ComparisonTable from "./ComparisonTable";
import EMIBreakdownChart from "./EMIBreakdownChart";

interface CalculatorCoreProps {
    /** Initial values (pre-filled on programmatic pages) */
    defaults: CalculatorDefaults;
    /** Optional slider min/max/step overrides per calculator type */
    sliderRanges?: SliderRanges;
    /** Show comparison table below result card (default: true) */
    showComparison?: boolean;
}

export default function CalculatorCore({
    defaults,
    sliderRanges,
    showComparison = true,
}: CalculatorCoreProps) {
    // ---- State ----
    const [amount, setAmount] = useState(defaults.amount);
    const [rate, setRate] = useState(defaults.rate);
    const [tenure, setTenure] = useState(defaults.tenure);
    const [tenureUnit, setTenureUnit] = useState<"months" | "years">("months");

    // Convert to months for calculation
    const tenureInMonths = tenureUnit === "years" ? tenure * 12 : tenure;

    // ---- Derived (live-compute) ----
    const input: CarLoanInput = useMemo(
        () => ({ amount, rate, tenure: tenureInMonths }),
        [amount, rate, tenureInMonths]
    );

    const result = useMemo(() => calculateCarLoanEmi(input), [input]);

    // ---- Tenure unit toggle handler ----
    const handleTenureUnitChange = (unit: "months" | "years") => {
        if (unit === tenureUnit) return;
        // Convert current value to new unit
        if (unit === "years") {
            setTenure(Math.round(tenure / 12));
        } else {
            setTenure(tenure * 12);
        }
        setTenureUnit(unit);
    };

    return (
        <div>
            <InputPanel
                amount={amount}
                rate={rate}
                tenure={tenure}
                tenureUnit={tenureUnit}
                onAmountChange={setAmount}
                onRateChange={setRate}
                onTenureChange={setTenure}
                onTenureUnitChange={handleTenureUnitChange}
                sliderRanges={sliderRanges}
            />

            <ResultCard result={result} principal={amount} />

            <EMIBreakdownChart
                principal={amount}
                totalInterest={result.totalInterest}
                emi={result.emi}
                rate={rate}
                tenureMonths={tenureInMonths}
            />

            {showComparison && (
                <section>
                    <h2>Scenario Comparison</h2>
                    <ComparisonTable input={input} />
                </section>
            )}
        </div>
    );
}
