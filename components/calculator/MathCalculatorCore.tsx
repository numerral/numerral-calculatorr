"use client";
import { useState, useMemo } from "react";

const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

function ResultRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
    return (<div className="con-result-row"><span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value">{value}{unit ? <span className="con-result-row__unit"> {unit}</span> : null}</span></div>);
}
function InputField({ label, value, onChange, unit, min, max, step, placeholder }: {
    label: string; value: number | string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; placeholder?: string;
}) {
    return (<div className="con-input"><label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
        <input type={typeof value === "string" ? "text" : "number"} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 1} placeholder={placeholder} /></div>);
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
    return (<div className="con-input"><label className="con-input__label">{label}</label>
        <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

/* ── helpers ── */
function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function lcmTwo(a: number, b: number): number { return Math.abs(a * b) / gcd(a, b); }
function primeFactors(n: number): number[] { const f: number[] = []; let d = 2; n = Math.abs(n); while (d * d <= n) { while (n % d === 0) { f.push(d); n /= d; } d++; } if (n > 1) f.push(n); return f; }
function simplifyFraction(num: number, den: number): [number, number] { const g = gcd(Math.abs(num), Math.abs(den)); return [num / g, den / g]; }

/* 1. Percentage Calculator */
function PercentageCalc() {
    const [mode, setMode] = useState("of");
    const [a, setA] = useState("25"); const [b, setB] = useState("200");
    const r = useMemo(() => {
        const na = parseFloat(a) || 0; const nb = parseFloat(b) || 0;
        switch (mode) {
            case "of": return { result: `${fmt(na * nb / 100)}`, label: `${na}% of ${nb}`, formula: `(${na} / 100) × ${nb} = ${fmt(na * nb / 100)}` };
            case "is": return { result: `${fmt(nb !== 0 ? (na / nb) * 100 : 0)}%`, label: `${na} is what % of ${nb}?`, formula: `(${na} / ${nb}) × 100 = ${fmt(nb !== 0 ? (na / nb) * 100 : 0)}%` };
            case "change": { const ch = nb !== 0 ? ((na - nb) / Math.abs(nb)) * 100 : 0; return { result: `${fmt(ch)}%`, label: `% change from ${nb} to ${na}`, formula: `((${na} − ${nb}) / |${nb}|) × 100 = ${fmt(ch)}%` }; }
            case "increase": return { result: `${fmt(nb + nb * na / 100)}`, label: `${nb} increased by ${na}%`, formula: `${nb} + (${nb} × ${na}/100) = ${fmt(nb + nb * na / 100)}` };
            case "decrease": return { result: `${fmt(nb - nb * na / 100)}`, label: `${nb} decreased by ${na}%`, formula: `${nb} − (${nb} × ${na}/100) = ${fmt(nb - nb * na / 100)}` };
            default: return { result: "0", label: "", formula: "" };
        }
    }, [mode, a, b]);
    const labels: Record<string, [string, string]> = { of: ["Percentage (%)", "Of value"], is: ["Value", "Total"], change: ["New value", "Original value"], increase: ["Increase by (%)", "Original value"], decrease: ["Decrease by (%)", "Original value"] };
    return (<div className="con-calc"><h3 className="con-calc__title">📊 Percentage Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Mode" value={mode} onChange={setMode} options={[{value:"of",label:"What is X% of Y?"},{value:"is",label:"X is what % of Y?"},{value:"change",label:"% change from Y to X"},{value:"increase",label:"Y increased by X%"},{value:"decrease",label:"Y decreased by X%"}]} />
        <InputField label={labels[mode]?.[0] || "A"} value={a} onChange={setA} />
        <InputField label={labels[mode]?.[1] || "B"} value={b} onChange={setB} />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={r.label} value={r.result} />
        <ResultRow label="Formula" value={r.formula} />
    </div></div>);
}

/* 2. Fraction Calculator */
function FractionCalc() {
    const [op, setOp] = useState("add");
    const [n1, setN1] = useState("1"); const [d1, setD1] = useState("3");
    const [n2, setN2] = useState("1"); const [d2, setD2] = useState("4");
    const r = useMemo(() => {
        const num1 = parseInt(n1) || 0; const den1 = parseInt(d1) || 1;
        const num2 = parseInt(n2) || 0; const den2 = parseInt(d2) || 1;
        let rNum: number, rDen: number;
        const steps: string[] = [];
        switch (op) {
            case "add":
                rDen = lcmTwo(den1, den2);
                rNum = num1 * (rDen / den1) + num2 * (rDen / den2);
                steps.push(`LCD of ${den1} and ${den2} = ${rDen}`);
                steps.push(`${num1}/${den1} = ${num1 * (rDen / den1)}/${rDen}`);
                steps.push(`${num2}/${den2} = ${num2 * (rDen / den2)}/${rDen}`);
                steps.push(`${num1 * (rDen / den1)}/${rDen} + ${num2 * (rDen / den2)}/${rDen} = ${rNum}/${rDen}`);
                break;
            case "subtract":
                rDen = lcmTwo(den1, den2);
                rNum = num1 * (rDen / den1) - num2 * (rDen / den2);
                steps.push(`LCD of ${den1} and ${den2} = ${rDen}`);
                steps.push(`${num1 * (rDen / den1)}/${rDen} − ${num2 * (rDen / den2)}/${rDen} = ${rNum}/${rDen}`);
                break;
            case "multiply":
                rNum = num1 * num2; rDen = den1 * den2;
                steps.push(`(${num1} × ${num2}) / (${den1} × ${den2}) = ${rNum}/${rDen}`);
                break;
            case "divide":
                rNum = num1 * den2; rDen = den1 * num2;
                steps.push(`${num1}/${den1} ÷ ${num2}/${den2} = ${num1}/${den1} × ${den2}/${num2}`);
                steps.push(`= ${rNum}/${rDen}`);
                break;
            default: rNum = 0; rDen = 1;
        }
        const [sNum, sDen] = simplifyFraction(rNum, rDen);
        if (sNum !== rNum || sDen !== rDen) steps.push(`Simplified: ${sNum}/${sDen}`);
        const decimal = rDen !== 0 ? rNum / rDen : 0;
        const whole = Math.floor(Math.abs(sNum) / Math.abs(sDen));
        const mixedNum = Math.abs(sNum) % Math.abs(sDen);
        const mixed = whole > 0 ? `${sNum < 0 ? "-" : ""}${whole} ${mixedNum}/${Math.abs(sDen)}` : `${sNum}/${sDen}`;
        return { sNum, sDen, decimal, mixed, steps };
    }, [op, n1, d1, n2, d2]);
    return (<div className="con-calc"><h3 className="con-calc__title">➗ Fraction Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Operation" value={op} onChange={setOp} options={[{value:"add",label:"Add (+)"},{value:"subtract",label:"Subtract (−)"},{value:"multiply",label:"Multiply (×)"},{value:"divide",label:"Divide (÷)"}]} />
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 1" value={n1} onChange={setN1} />
            <InputField label="Denominator 1" value={d1} onChange={setD1} />
        </div>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 2" value={n2} onChange={setN2} />
            <InputField label="Denominator 2" value={d2} onChange={setD2} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Fraction" value={`${r.sNum}/${r.sDen}`} />
        <ResultRow label="Mixed Number" value={r.mixed} />
        <ResultRow label="Decimal" value={fmt(r.decimal, 6)} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 3. GCD Calculator */
function GcdCalc() {
    const [input, setInput] = useState("48, 36");
    const r = useMemo(() => {
        const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n) && n > 0);
        if (nums.length < 2) return { gcd: 0, nums: [], steps: [], factors: [] };
        let result = nums[0];
        const steps: string[] = [];
        for (let i = 1; i < nums.length; i++) {
            let a = result, b = nums[i];
            steps.push(`GCD(${a}, ${b}):`);
            while (b) {
                steps.push(`  ${a} = ${Math.floor(a / b)} × ${b} + ${a % b}`);
                [a, b] = [b, a % b];
            }
            result = a;
            steps.push(`  = ${result}`);
        }
        const factors: number[] = [];
        for (let i = 1; i <= result; i++) { if (result % i === 0) factors.push(i); }
        return { gcd: result, nums, steps, factors };
    }, [input]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔗 GCD Calculator</h3><div className="con-calc__inputs">
        <InputField label="Numbers (comma-separated)" value={input} onChange={setInput} placeholder="e.g. 48, 36, 24" />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={`GCD(${r.nums.join(", ")})`} value={r.gcd.toString()} />
        <ResultRow label="All Factors of GCD" value={r.factors.join(", ") || "—"} />
        <ResultRow label="Prime Factorization" value={r.gcd > 1 ? primeFactors(r.gcd).join(" × ") : "—"} />
        <h4>Euclidean Algorithm Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
    </div></div>);
}

/* 4. LCM Calculator */
function LcmCalc() {
    const [input, setInput] = useState("12, 18");
    const r = useMemo(() => {
        const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n) && n > 0);
        if (nums.length < 2) return { lcm: 0, nums: [], steps: [] };
        let result = nums[0];
        const steps: string[] = [];
        for (let i = 1; i < nums.length; i++) {
            const g = gcd(result, nums[i]);
            const l = lcmTwo(result, nums[i]);
            steps.push(`LCM(${result}, ${nums[i]}) = |${result} × ${nums[i]}| / GCD(${result}, ${nums[i]})`);
            steps.push(`= ${Math.abs(result * nums[i])} / ${g} = ${l}`);
            result = l;
        }
        return { lcm: result, nums, steps };
    }, [input]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔢 LCM Calculator</h3><div className="con-calc__inputs">
        <InputField label="Numbers (comma-separated)" value={input} onChange={setInput} placeholder="e.g. 12, 18, 24" />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={`LCM(${r.nums.join(", ")})`} value={r.lcm.toString()} />
        <ResultRow label="Prime Factorization" value={r.lcm > 1 ? primeFactors(r.lcm).join(" × ") : "—"} />
        <h4>Steps (using GCD method)</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
    </div></div>);
}

/* 5. Quadratic Equation Solver */
function QuadraticCalc() {
    const [aVal, setA] = useState("1"); const [bVal, setB] = useState("-5"); const [cVal, setC] = useState("6");
    const r = useMemo(() => {
        const a = parseFloat(aVal) || 0; const b = parseFloat(bVal) || 0; const c = parseFloat(cVal) || 0;
        if (a === 0) return { type: "linear", roots: b !== 0 ? [`x = ${fmt(-c / b)}`] : [], disc: 0, vertex: { x: 0, y: 0 }, steps: ["Not a quadratic equation (a = 0)"] };
        const disc = b * b - 4 * a * c;
        const steps: string[] = [
            `Equation: ${a}x² + ${b >= 0 ? "+" : ""}${b}x + ${c >= 0 ? "+" : ""}${c} = 0`,
            `Discriminant (Δ) = b² − 4ac = ${b}² − 4(${a})(${c}) = ${fmt(disc)}`,
        ];
        let roots: string[];
        let type: string;
        if (disc > 0) {
            const r1 = (-b + Math.sqrt(disc)) / (2 * a);
            const r2 = (-b - Math.sqrt(disc)) / (2 * a);
            roots = [`x₁ = ${fmt(r1, 6)}`, `x₂ = ${fmt(r2, 6)}`];
            type = "Two distinct real roots";
            steps.push(`Δ > 0 → Two distinct real roots`);
            steps.push(`x = (−b ± √Δ) / 2a = (${-b} ± ${fmt(Math.sqrt(disc))}) / ${2 * a}`);
        } else if (disc === 0) {
            const r1 = -b / (2 * a);
            roots = [`x = ${fmt(r1, 6)}`];
            type = "One repeated real root";
            steps.push(`Δ = 0 → One repeated root`);
            steps.push(`x = −b / 2a = ${-b} / ${2 * a} = ${fmt(r1, 6)}`);
        } else {
            const real = -b / (2 * a);
            const imag = Math.sqrt(-disc) / (2 * a);
            roots = [`x₁ = ${fmt(real, 4)} + ${fmt(imag, 4)}i`, `x₂ = ${fmt(real, 4)} − ${fmt(imag, 4)}i`];
            type = "Two complex conjugate roots";
            steps.push(`Δ < 0 → Two complex conjugate roots`);
        }
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        steps.push(`Vertex: (${fmt(vx)}, ${fmt(vy)})`);
        return { type, roots, disc, vertex: { x: vx, y: vy }, steps };
    }, [aVal, bVal, cVal]);
    return (<div className="con-calc"><h3 className="con-calc__title">📐 Quadratic Equation Solver</h3><div className="con-calc__inputs">
        <p style={{fontSize:"0.85rem",color:"var(--text-muted)",margin:"0 0 var(--s-2)"}}>ax² + bx + c = 0</p>
        <InputField label="a (coefficient of x²)" value={aVal} onChange={setA} />
        <InputField label="b (coefficient of x)" value={bVal} onChange={setB} />
        <InputField label="c (constant)" value={cVal} onChange={setC} />
    </div><div className="con-calc__results"><h4>Solution</h4>
        <ResultRow label="Type" value={r.type} />
        <ResultRow label="Discriminant (Δ)" value={fmt(r.disc)} />
        {r.roots.map((root, i) => <ResultRow key={i} label={`Root ${i + 1}`} value={root} />)}
        <ResultRow label="Vertex" value={`(${fmt(r.vertex.x)}, ${fmt(r.vertex.y)})`} />
        <h4>Step-by-Step</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
    </div></div>);
}

/* 6. Exponent Calculator */
function ExponentCalc() {
    const [base, setBase] = useState("2"); const [exp, setExp] = useState("10");
    const r = useMemo(() => {
        const b = parseFloat(base) || 0; const e = parseFloat(exp) || 0;
        const result = Math.pow(b, e);
        const steps: string[] = [`${b}^${e}`];
        if (Number.isInteger(e) && e >= 0 && e <= 20) {
            const parts = Array(Math.round(e)).fill(b).join(" × ");
            if (parts) steps.push(`= ${parts}`);
        }
        steps.push(`= ${result.toLocaleString(undefined, { maximumFractionDigits: 10 })}`);
        const rules = [];
        if (e === 0) rules.push("Any non-zero number raised to 0 equals 1");
        if (e === 1) rules.push("Any number raised to 1 equals itself");
        if (e < 0) rules.push(`Negative exponent: ${b}^${e} = 1/${b}^${-e} = 1/${Math.pow(b, -e)}`);
        if (e === 0.5) rules.push(`Exponent 0.5 is the square root: √${b}`);
        return { result, steps, rules, digits: result.toString().length };
    }, [base, exp]);
    return (<div className="con-calc"><h3 className="con-calc__title">⬆️ Exponent Calculator</h3><div className="con-calc__inputs">
        <InputField label="Base" value={base} onChange={setBase} />
        <InputField label="Exponent" value={exp} onChange={setExp} />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={`${base}^${exp}`} value={isFinite(r.result) ? r.result.toLocaleString(undefined, { maximumFractionDigits: 10 }) : "∞"} />
        {isFinite(r.result) && <ResultRow label="Digit Count" value={r.digits.toString()} />}
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
        {r.rules.length > 0 && <><h4>Rules Applied</h4>{r.rules.map((s, i) => <ResultRow key={i} label="" value={s} />)}</>}
    </div></div>);
}

/* 7. Factorial Calculator */
function FactorialCalc() {
    const [n, setN] = useState("10");
    const r = useMemo(() => {
        const num = Math.min(Math.max(parseInt(n) || 0, 0), 170);
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        const expansion = num <= 20 ? Array.from({ length: num }, (_, i) => num - i).join(" × ") : `${num} × ${num - 1} × ... × 2 × 1`;
        const digits = result > 0 ? Math.floor(Math.log10(result)) + 1 : 1;
        return { result, expansion, digits, n: num };
    }, [n]);
    return (<div className="con-calc"><h3 className="con-calc__title">❗ Factorial Calculator</h3><div className="con-calc__inputs">
        <InputField label="n" value={n} onChange={setN} min={0} max={170} placeholder="Enter a non-negative integer" />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={`${r.n}!`} value={r.result <= 1e15 ? r.result.toLocaleString() : r.result.toExponential(6)} />
        <ResultRow label="Digits" value={r.digits.toString()} />
        <ResultRow label="Expansion" value={r.expansion} />
        <h4>Related</h4>
        <ResultRow label={`Permutations P(${r.n},${Math.min(r.n, 3)})`} value={r.n >= 3 ? (r.n * (r.n - 1) * (r.n - 2)).toLocaleString() : r.result.toLocaleString()} />
        <ResultRow label={`Combinations C(${r.n},${Math.min(r.n, 3)})`} value={r.n >= 3 ? Math.round(r.n * (r.n - 1) * (r.n - 2) / 6).toLocaleString() : "1"} />
    </div></div>);
}

/* 8. Average Calculator (Mean, Median, Mode) */
function AverageCalc() {
    const [input, setInput] = useState("10, 20, 30, 40, 50, 30");
    const r = useMemo(() => {
        const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        if (nums.length === 0) return { mean: 0, median: 0, mode: "—", range: 0, sum: 0, count: 0, min: 0, max: 0 };
        const sorted = [...nums].sort((a, b) => a - b);
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / nums.length;
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        const freq: Record<number, number> = {};
        nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
        const maxFreq = Math.max(...Object.values(freq));
        const modes = Object.entries(freq).filter(([, f]) => f === maxFreq && f > 1).map(([n]) => n);
        const mode = modes.length > 0 ? modes.join(", ") : "No mode";
        return { mean, median, mode, range: sorted[sorted.length - 1] - sorted[0], sum, count: nums.length, min: sorted[0], max: sorted[sorted.length - 1] };
    }, [input]);
    return (<div className="con-calc"><h3 className="con-calc__title">📉 Average Calculator</h3><div className="con-calc__inputs">
        <InputField label="Enter numbers (comma or space separated)" value={input} onChange={setInput} placeholder="e.g. 10, 20, 30, 40, 50" />
    </div><div className="con-calc__results"><h4>Results ({r.count} numbers)</h4>
        <ResultRow label="Mean (Average)" value={fmt(r.mean)} />
        <ResultRow label="Median" value={fmt(r.median)} />
        <ResultRow label="Mode" value={r.mode} />
        <ResultRow label="Range" value={fmt(r.range)} />
        <ResultRow label="Sum" value={fmt(r.sum)} />
        <ResultRow label="Min" value={fmt(r.min)} />
        <ResultRow label="Max" value={fmt(r.max)} />
    </div></div>);
}

/* 9. Standard Deviation Calculator */
function StdDevCalc() {
    const [input, setInput] = useState("4, 8, 6, 5, 3, 7, 9, 2");
    const r = useMemo(() => {
        const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        if (nums.length < 2) return { popSD: 0, sampleSD: 0, popVar: 0, sampleVar: 0, mean: 0, count: 0, steps: [] };
        const n = nums.length;
        const mean = nums.reduce((a, b) => a + b, 0) / n;
        const sumSqDiff = nums.reduce((sum, x) => sum + (x - mean) ** 2, 0);
        const popVar = sumSqDiff / n;
        const sampleVar = sumSqDiff / (n - 1);
        const steps = [
            `Mean (x̄) = ${nums.join(" + ")} / ${n} = ${fmt(mean)}`,
            `Σ(xᵢ − x̄)² = ${nums.map(x => `(${x} − ${fmt(mean)})²`).join(" + ")} = ${fmt(sumSqDiff)}`,
            `Population Variance (σ²) = ${fmt(sumSqDiff)} / ${n} = ${fmt(popVar)}`,
            `Sample Variance (s²) = ${fmt(sumSqDiff)} / ${n - 1} = ${fmt(sampleVar)}`,
        ];
        return { popSD: Math.sqrt(popVar), sampleSD: Math.sqrt(sampleVar), popVar, sampleVar, mean, count: n, steps };
    }, [input]);
    return (<div className="con-calc"><h3 className="con-calc__title">📈 Standard Deviation Calculator</h3><div className="con-calc__inputs">
        <InputField label="Enter numbers (comma or space separated)" value={input} onChange={setInput} placeholder="e.g. 4, 8, 6, 5, 3, 7" />
    </div><div className="con-calc__results"><h4>Results ({r.count} values)</h4>
        <ResultRow label="Mean (x̄)" value={fmt(r.mean)} />
        <ResultRow label="Population Std Dev (σ)" value={fmt(r.popSD)} />
        <ResultRow label="Sample Std Dev (s)" value={fmt(r.sampleSD)} />
        <ResultRow label="Population Variance (σ²)" value={fmt(r.popVar)} />
        <ResultRow label="Sample Variance (s²)" value={fmt(r.sampleVar)} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
    </div></div>);
}

/* 10. Long Division Calculator */
function LongDivisionCalc() {
    const [dividend, setDividend] = useState("1234"); const [divisor, setDivisor] = useState("56");
    const r = useMemo(() => {
        const a = Math.abs(parseInt(dividend) || 0); const b = Math.abs(parseInt(divisor) || 1);
        if (b === 0) return { quotient: 0, remainder: 0, decimal: 0, steps: ["Cannot divide by zero"] };
        const quotient = Math.floor(a / b);
        const remainder = a % b;
        const decimal = a / b;
        // Build long division steps
        const steps: string[] = [];
        const dStr = a.toString();
        let carry = 0;
        let result = "";
        for (let i = 0; i < dStr.length; i++) {
            carry = carry * 10 + parseInt(dStr[i]);
            const q = Math.floor(carry / b);
            result += q.toString();
            const product = q * b;
            const newRem = carry - product;
            if (carry >= b || result.length > 1) {
                steps.push(`Bring down ${dStr[i]} → ${carry}. ${carry} ÷ ${b} = ${q}, remainder ${newRem}`);
            } else if (carry < b) {
                steps.push(`Bring down ${dStr[i]} → ${carry}. ${carry} < ${b}, write 0`);
            }
            carry = newRem;
        }
        const isNeg = ((parseInt(dividend) || 0) < 0) !== ((parseInt(divisor) || 1) < 0);
        return { quotient: isNeg ? -quotient : quotient, remainder, decimal: isNeg ? -decimal : decimal, steps };
    }, [dividend, divisor]);
    return (<div className="con-calc"><h3 className="con-calc__title">➗ Long Division Calculator</h3><div className="con-calc__inputs">
        <InputField label="Dividend" value={dividend} onChange={setDividend} placeholder="e.g. 1234" />
        <InputField label="Divisor" value={divisor} onChange={setDivisor} placeholder="e.g. 56" />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={`${dividend} ÷ ${divisor}`} value={`${r.quotient} remainder ${r.remainder}`} />
        <ResultRow label="Quotient" value={r.quotient.toString()} />
        <ResultRow label="Remainder" value={r.remainder.toString()} />
        <ResultRow label="Decimal" value={fmt(r.decimal, 6)} />
        <ResultRow label="Check" value={`${r.quotient} × ${divisor} + ${r.remainder} = ${r.quotient * (parseInt(divisor) || 1) + r.remainder}`} />
        <h4>Long Division Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 11. Fraction to Ratio Calculator */
function FractionToRatioCalc() {
    const [mode, setMode] = useState("fraction-to-ratio");
    const [whole, setWhole] = useState("");
    const [num, setNum] = useState("3"); const [den, setDen] = useState("4");
    // ratio inputs
    const [ra, setRa] = useState("3"); const [rb, setRb] = useState("4");
    const r = useMemo(() => {
        const steps: string[] = [];
        if (mode === "fraction-to-ratio") {
            let n = parseInt(num) || 0;
            let d = parseInt(den) || 1;
            const w = parseInt(whole) || 0;
            if (w !== 0) {
                steps.push(`Convert mixed number ${w} ${Math.abs(n)}/${d} to improper fraction`);
                n = w * d + (w < 0 ? -Math.abs(n) : Math.abs(n));
                steps.push(`= ${n}/${d}`);
            }
            const g = gcd(Math.abs(n), Math.abs(d));
            const sn = n / g;
            const sd = d / g;
            if (g > 1) steps.push(`Simplify ${n}/${d} by dividing both by GCD(${Math.abs(n)},${Math.abs(d)}) = ${g}`);
            steps.push(`${sn}/${sd} → write as ratio → ${sn}:${sd}`);
            const decimal = d !== 0 ? n / d : 0;
            const percent = decimal * 100;
            return { ratio: `${sn}:${sd}`, fraction: `${sn}/${sd}`, decimal: fmt(decimal, 6), percent: fmt(percent, 4) + "%", steps };
        } else {
            // ratio to fraction
            const a = parseInt(ra) || 0;
            const b = parseInt(rb) || 1;
            steps.push(`Ratio ${a}:${b} → write as fraction → ${a}/${b}`);
            const g = gcd(Math.abs(a), Math.abs(b));
            const sn = a / g;
            const sd = b / g;
            if (g > 1) steps.push(`Simplify: ${a}/${b} = ${sn}/${sd}`);
            const decimal = b !== 0 ? a / b : 0;
            const whole = Math.floor(Math.abs(sn) / Math.abs(sd));
            const rem = Math.abs(sn) % Math.abs(sd);
            const mixed = whole > 0 && rem > 0 ? `${sn < 0 ? "-" : ""}${whole} ${rem}/${Math.abs(sd)}` : `${sn}/${sd}`;
            if (whole > 0 && rem > 0) steps.push(`As mixed number: ${mixed}`);
            return { ratio: `${a}:${b}`, fraction: `${sn}/${sd}`, decimal: fmt(decimal, 6), percent: fmt(decimal * 100, 4) + "%", mixed, steps };
        }
    }, [mode, whole, num, den, ra, rb]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔄 Fraction ↔ Ratio Converter</h3><div className="con-calc__inputs">
        <SelectField label="Conversion" value={mode} onChange={setMode} options={[{value:"fraction-to-ratio",label:"Fraction → Ratio"},{value:"ratio-to-fraction",label:"Ratio → Fraction"}]} />
        {mode === "fraction-to-ratio" ? (<>
            <InputField label="Whole Number (optional)" value={whole} onChange={setWhole} placeholder="Leave empty for simple fraction" />
            <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
                <InputField label="Numerator" value={num} onChange={setNum} />
                <InputField label="Denominator" value={den} onChange={setDen} />
            </div>
        </>) : (<>
            <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
                <InputField label="A (left side)" value={ra} onChange={setRa} />
                <InputField label="B (right side)" value={rb} onChange={setRb} />
            </div>
        </>)}
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Ratio" value={r.ratio} />
        <ResultRow label="Fraction" value={r.fraction} />
        <ResultRow label="Decimal" value={r.decimal} />
        <ResultRow label="Percentage" value={r.percent} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 12. Compare Fractions Calculator */
function CompareFractionsCalc() {
    const [n1, setN1] = useState("2"); const [d1, setD1] = useState("3");
    const [n2, setN2] = useState("3"); const [d2, setD2] = useState("5");
    const r = useMemo(() => {
        const num1 = parseInt(n1) || 0; const den1 = parseInt(d1) || 1;
        const num2 = parseInt(n2) || 0; const den2 = parseInt(d2) || 1;
        const dec1 = den1 !== 0 ? num1 / den1 : 0;
        const dec2 = den2 !== 0 ? num2 / den2 : 0;
        const steps: string[] = [];
        // Method 1: Decimal conversion
        steps.push(`Method 1 — Convert to decimals:`);
        steps.push(`  ${num1}/${den1} = ${fmt(dec1, 6)}`);
        steps.push(`  ${num2}/${den2} = ${fmt(dec2, 6)}`);
        // Method 2: Cross multiplication
        const cross1 = num1 * den2;
        const cross2 = num2 * den1;
        steps.push(`Method 2 — Cross multiply:`);
        steps.push(`  ${num1} × ${den2} = ${cross1}`);
        steps.push(`  ${num2} × ${den1} = ${cross2}`);
        // Method 3: Common denominator
        const lcd = lcmTwo(Math.abs(den1), Math.abs(den2));
        const eqN1 = num1 * (lcd / den1);
        const eqN2 = num2 * (lcd / den2);
        steps.push(`Method 3 — Common denominator (LCD = ${lcd}):`);
        steps.push(`  ${num1}/${den1} = ${eqN1}/${lcd}`);
        steps.push(`  ${num2}/${den2} = ${eqN2}/${lcd}`);
        let comparison: string;
        let symbol: string;
        if (dec1 > dec2) { comparison = `${num1}/${den1} is GREATER than ${num2}/${den2}`; symbol = ">"; }
        else if (dec1 < dec2) { comparison = `${num1}/${den1} is LESS than ${num2}/${den2}`; symbol = "<"; }
        else { comparison = `${num1}/${den1} is EQUAL to ${num2}/${den2}`; symbol = "="; }
        const diff = Math.abs(dec1 - dec2);
        // Simplify both
        const [s1n, s1d] = simplifyFraction(num1, den1);
        const [s2n, s2d] = simplifyFraction(num2, den2);
        const pct1 = fmt(dec1 * 100, 4) + "%";
        const pct2 = fmt(dec2 * 100, 4) + "%";
        return { comparison, symbol, dec1, dec2, diff, steps, s1n, s1d, s2n, s2d, pct1, pct2 };
    }, [n1, d1, n2, d2]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚖️ Comparing Fractions Calculator</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 1" value={n1} onChange={setN1} />
            <InputField label="Denominator 1" value={d1} onChange={setD1} />
        </div>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 2" value={n2} onChange={setN2} />
            <InputField label="Denominator 2" value={d2} onChange={setD2} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Comparison" value={r.comparison} />
        <ResultRow label="" value={`${r.s1n}/${r.s1d}  ${r.symbol}  ${r.s2n}/${r.s2d}`} />
        <ResultRow label="Decimal 1" value={fmt(r.dec1, 6)} />
        <ResultRow label="Decimal 2" value={fmt(r.dec2, 6)} />
        <ResultRow label="Percentage 1" value={r.pct1} />
        <ResultRow label="Percentage 2" value={r.pct2} />
        <ResultRow label="Difference" value={fmt(r.diff, 6)} />
        <h4>Step-by-Step (3 Methods)</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
    </div></div>);
}

/* 13. Fraction to Mixed Number Calculator */
function FractionToMixedCalc() {
    const [mode, setMode] = useState("to-mixed");
    // improper fraction inputs
    const [num, setNum] = useState("7"); const [den, setDen] = useState("3");
    // mixed number inputs
    const [whole, setWhole] = useState("2"); const [mNum, setMNum] = useState("1"); const [mDen, setMDen] = useState("3");
    const r = useMemo(() => {
        const steps: string[] = [];
        if (mode === "to-mixed") {
            const n = parseInt(num) || 0; const d = parseInt(den) || 1;
            // Simplify first
            const g = gcd(Math.abs(n), Math.abs(d));
            const sn = n / g; const sd = d / g;
            if (g > 1) steps.push(`Simplify: ${n}/${d} ÷ ${g} = ${sn}/${sd}`);
            if (Math.abs(sn) < Math.abs(sd)) {
                steps.push(`${sn}/${sd} is a proper fraction (numerator < denominator)`);
                steps.push(`Already in simplest form: ${sn}/${sd}`);
                return { result: `${sn}/${sd}`, decimal: fmt(d !== 0 ? n / d : 0, 6), fraction: `${sn}/${sd}`, steps };
            }
            const q = Math.floor(Math.abs(sn) / Math.abs(sd));
            const rem = Math.abs(sn) % Math.abs(sd);
            const sign = (sn < 0) !== (sd < 0) ? "-" : "";
            steps.push(`Step 1 — Long division: ${Math.abs(sn)} ÷ ${Math.abs(sd)} = ${q} remainder ${rem}`);
            steps.push(`Step 2 — Quotient = ${q} (whole number), Remainder = ${rem} (new numerator)`);
            steps.push(`Step 3 — Keep original denominator: ${Math.abs(sd)}`);
            const mixed = rem > 0 ? `${sign}${q} ${rem}/${Math.abs(sd)}` : `${sign}${q}`;
            steps.push(`Result: ${sn}/${sd} = ${mixed}`);
            return { result: mixed, decimal: fmt(d !== 0 ? n / d : 0, 6), fraction: `${sn}/${sd}`, steps };
        } else {
            const w = parseInt(whole) || 0;
            const n = parseInt(mNum) || 0;
            const d = parseInt(mDen) || 1;
            steps.push(`Mixed number: ${w} ${n}/${d}`);
            steps.push(`Step 1 — Multiply whole number by denominator: ${Math.abs(w)} × ${Math.abs(d)} = ${Math.abs(w) * Math.abs(d)}`);
            const newNum = w * d + (w < 0 ? -Math.abs(n) : Math.abs(n));
            steps.push(`Step 2 — Add numerator: ${Math.abs(w) * Math.abs(d)} + ${n} = ${Math.abs(newNum)}`);
            steps.push(`Step 3 — Keep denominator: ${d}`);
            const sign = newNum < 0 ? "-" : "";
            steps.push(`Result: ${w} ${n}/${d} = ${sign}${Math.abs(newNum)}/${Math.abs(d)}`);
            // Simplify
            const g = gcd(Math.abs(newNum), Math.abs(d));
            if (g > 1) steps.push(`Simplified: ${newNum / g}/${d / g}`);
            return { result: `${newNum}/${d}`, decimal: fmt(d !== 0 ? newNum / d : 0, 6), fraction: g > 1 ? `${newNum / g}/${d / g}` : `${newNum}/${d}`, steps };
        }
    }, [mode, num, den, whole, mNum, mDen]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔀 Fraction ↔ Mixed Number Converter</h3><div className="con-calc__inputs">
        <SelectField label="Conversion" value={mode} onChange={setMode} options={[{value:"to-mixed",label:"Improper Fraction → Mixed Number"},{value:"to-improper",label:"Mixed Number → Improper Fraction"}]} />
        {mode === "to-mixed" ? (
            <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
                <InputField label="Numerator" value={num} onChange={setNum} />
                <InputField label="Denominator" value={den} onChange={setDen} />
            </div>
        ) : (<>
            <InputField label="Whole Number" value={whole} onChange={setWhole} />
            <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
                <InputField label="Numerator" value={mNum} onChange={setMNum} />
                <InputField label="Denominator" value={mDen} onChange={setMDen} />
            </div>
        </>)}
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={mode === "to-mixed" ? "Mixed Number" : "Improper Fraction"} value={r.result} />
        <ResultRow label="Simplified" value={r.fraction} />
        <ResultRow label="Decimal" value={r.decimal} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 14. Decimal to Fraction Calculator */
function DecimalToFractionCalc() {
    const [input, setInput] = useState("0.75");
    const r = useMemo(() => {
        const val = parseFloat(input);
        if (isNaN(val)) return { fraction: "—", simplified: "—", mixed: "—", percent: "—", steps: ["Enter a valid decimal number"] };
        const steps: string[] = [];
        const neg = val < 0;
        const absVal = Math.abs(val);
        // Count decimal places
        const decStr = absVal.toString();
        const decIdx = decStr.indexOf(".");
        const places = decIdx >= 0 ? decStr.length - decIdx - 1 : 0;
        const denom = Math.pow(10, places);
        const numer = Math.round(absVal * denom);
        steps.push(`Step 1 — Write as fraction: ${absVal} / 1`);
        if (places > 0) {
            steps.push(`Step 2 — Multiply by 10^${places}: ${numer} / ${denom}`);
        }
        const g = gcd(numer, denom);
        const sn = numer / g;
        const sd = denom / g;
        if (g > 1) steps.push(`Step 3 — Simplify: GCD(${numer}, ${denom}) = ${g} → ${sn}/${sd}`);
        else steps.push(`Step 3 — Already in simplest form: ${sn}/${sd}`);
        const sign = neg ? "-" : "";
        const fraction = `${sign}${sn}/${sd}`;
        // Mixed number
        let mixed = fraction;
        if (sn >= sd && sd > 1) {
            const w = Math.floor(sn / sd);
            const rem = sn % sd;
            mixed = rem > 0 ? `${sign}${w} ${rem}/${sd}` : `${sign}${w}`;
            steps.push(`As mixed number: ${mixed}`);
        }
        const percent = fmt(val * 100, 4) + "%";
        return { fraction, simplified: fraction, mixed, percent, decimal: input, steps };
    }, [input]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔢 Decimal to Fraction Calculator</h3><div className="con-calc__inputs">
        <InputField label="Decimal Number" value={input} onChange={setInput} placeholder="e.g. 0.75, 1.25, -0.333" />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Fraction" value={r.fraction} />
        <ResultRow label="Mixed Number" value={r.mixed} />
        <ResultRow label="Percentage" value={r.percent} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 15. Inch Fraction Calculator */
function InchFractionCalc() {
    const [mode, setMode] = useState("decimal-to-fraction");
    const [decIn, setDecIn] = useState("2.695");
    const [precision, setPrecision] = useState("16");
    const [fNum, setFNum] = useState("11"); const [fDen, setFDen] = useState("16"); const [fWhole, setFWhole] = useState("2");
    const r = useMemo(() => {
        const steps: string[] = [];
        if (mode === "decimal-to-fraction") {
            const val = parseFloat(decIn) || 0;
            const prec = parseInt(precision) || 16;
            const neg = val < 0;
            const abs = Math.abs(val);
            const whole = Math.floor(abs);
            const dec = abs - whole;
            steps.push(`Separate: ${abs} = ${whole} whole inches + ${fmt(dec, 6)} decimal`);
            const rawNum = dec * prec;
            const roundedNum = Math.round(rawNum);
            steps.push(`Multiply decimal by ${prec}: ${fmt(dec, 6)} × ${prec} = ${fmt(rawNum, 4)}`);
            steps.push(`Round to nearest whole: ${roundedNum}`);
            // Simplify the fraction
            const g = gcd(roundedNum, prec);
            const sn = roundedNum / g; const sd = prec / g;
            if (g > 1) steps.push(`Simplify: ${roundedNum}/${prec} = ${sn}/${sd}`);
            const sign = neg ? "-" : "";
            const inchFrac = sn > 0 ? `${sign}${whole > 0 ? whole + " " : ""}${sn}/${sd}″` : `${sign}${whole}″`;
            const totalInches = neg ? -abs : abs;
            const mm = fmt(totalInches * 25.4, 4);
            const cm = fmt(totalInches * 2.54, 4);
            steps.push(`Result: ${decIn}″ ≈ ${inchFrac}`);
            steps.push(`Metric: ${mm} mm = ${cm} cm`);
            return { inchFrac, decimal: decIn + "″", mm: mm + " mm", cm: cm + " cm", steps };
        } else {
            const w = parseInt(fWhole) || 0;
            const n = parseInt(fNum) || 0;
            const d = parseInt(fDen) || 1;
            const totalInches = w + n / d;
            steps.push(`${w} ${n}/${d}″ = ${w} + ${n}/${d}`);
            steps.push(`${n} ÷ ${d} = ${fmt(n / d, 6)}`);
            steps.push(`Total: ${fmt(totalInches, 6)}″`);
            const mm = fmt(totalInches * 25.4, 4);
            const cm = fmt(totalInches * 2.54, 4);
            steps.push(`Metric: ${mm} mm = ${cm} cm`);
            return { inchFrac: `${w} ${n}/${d}″`, decimal: fmt(totalInches, 6) + "″", mm: mm + " mm", cm: cm + " cm", steps };
        }
    }, [mode, decIn, precision, fWhole, fNum, fDen]);
    return (<div className="con-calc"><h3 className="con-calc__title">📏 Inch Fraction Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Conversion" value={mode} onChange={setMode} options={[{value:"decimal-to-fraction",label:"Decimal → Inch Fraction"},{value:"fraction-to-decimal",label:"Inch Fraction → Decimal"}]} />
        {mode === "decimal-to-fraction" ? (<>
            <InputField label="Decimal Inches" value={decIn} onChange={setDecIn} placeholder="e.g. 2.695" />
            <SelectField label="Precision" value={precision} onChange={setPrecision} options={[{value:"8",label:"1/8″"},{value:"16",label:"1/16″"},{value:"32",label:"1/32″"},{value:"64",label:"1/64″"}]} />
        </>) : (<>
            <InputField label="Whole Inches" value={fWhole} onChange={setFWhole} placeholder="0" />
            <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
                <InputField label="Numerator" value={fNum} onChange={setFNum} />
                <InputField label="Denominator" value={fDen} onChange={setFDen} />
            </div>
        </>)}
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Inch Fraction" value={r.inchFrac} />
        <ResultRow label="Decimal" value={r.decimal} />
        <ResultRow label="Millimeters" value={r.mm} />
        <ResultRow label="Centimeters" value={r.cm} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 16. Equivalent Fractions Calculator */
function EquivalentFractionsCalc() {
    const [num, setNum] = useState("6"); const [den, setDen] = useState("9");
    const r = useMemo(() => {
        const n = parseInt(num) || 0; const d = parseInt(den) || 1;
        const steps: string[] = [];
        const g = gcd(Math.abs(n), Math.abs(d));
        const sn = n / g; const sd = d / g;
        if (g > 1) {
            steps.push(`Simplify: GCD(${Math.abs(n)}, ${Math.abs(d)}) = ${g}`);
            steps.push(`${n}/${d} = ${sn}/${sd} (simplest form)`);
        } else {
            steps.push(`${n}/${d} is already in simplest form`);
        }
        // Generate equivalents
        const equivalents: string[] = [];
        for (let m = 2; m <= 11; m++) {
            equivalents.push(`${sn * m}/${sd * m}`);
        }
        steps.push(`Multiply numerator & denominator by 2, 3, ... 11 to get equivalents`);
        const decimal = d !== 0 ? n / d : 0;
        return { simplified: `${sn}/${sd}`, equivalents, decimal: fmt(decimal, 6), percent: fmt(decimal * 100, 4) + "%", steps };
    }, [num, den]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔗 Equivalent Fractions Calculator</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator" value={num} onChange={setNum} />
            <InputField label="Denominator" value={den} onChange={setDen} />
        </div>
    </div><div className="con-calc__results"><h4>Simplified Form</h4>
        <ResultRow label="Simplest Form" value={r.simplified} />
        <ResultRow label="Decimal" value={r.decimal} />
        <ResultRow label="Percentage" value={r.percent} />
        <h4>10 Equivalent Fractions</h4>
        {r.equivalents.map((eq, i) => <ResultRow key={i} label={`×${i + 2}`} value={eq} />)}
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
    </div></div>);
}

/* 17. LCD Calculator */
function LCDCalc() {
    const [n1, setN1] = useState("1"); const [d1, setD1] = useState("3");
    const [n2, setN2] = useState("2"); const [d2, setD2] = useState("5");
    const r = useMemo(() => {
        const a = parseInt(d1) || 1; const b = parseInt(d2) || 1;
        const num1 = parseInt(n1) || 0; const num2 = parseInt(n2) || 0;
        const steps: string[] = [];
        const g = gcd(Math.abs(a), Math.abs(b));
        const lcd = Math.abs(a * b) / g;
        steps.push(`Denominators: ${a} and ${b}`);
        steps.push(`GCD(${a}, ${b}) = ${g}`);
        steps.push(`LCD = (${a} × ${b}) / GCD = ${Math.abs(a * b)} / ${g} = ${lcd}`);
        // Convert fractions
        const mult1 = lcd / Math.abs(a);
        const mult2 = lcd / Math.abs(b);
        const newN1 = num1 * mult1;
        const newN2 = num2 * mult2;
        steps.push(`Convert: ${num1}/${a} = ${num1}×${mult1} / ${a}×${mult1} = ${newN1}/${lcd}`);
        steps.push(`Convert: ${num2}/${b} = ${num2}×${mult2} / ${b}×${mult2} = ${newN2}/${lcd}`);
        // Multiples for reference
        const mults1 = []; const mults2 = [];
        for (let i = 1; i <= 8; i++) { mults1.push(a * i); mults2.push(b * i); }
        steps.push(`Multiples of ${a}: ${mults1.join(", ")}, …`);
        steps.push(`Multiples of ${b}: ${mults2.join(", ")}, …`);
        steps.push(`Smallest common multiple: ${lcd}`);
        return { lcd: lcd.toString(), frac1: `${newN1}/${lcd}`, frac2: `${newN2}/${lcd}`, steps };
    }, [n1, d1, n2, d2]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔍 LCD Calculator (Least Common Denominator)</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 1" value={n1} onChange={setN1} />
            <InputField label="Denominator 1" value={d1} onChange={setD1} />
        </div>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 2" value={n2} onChange={setN2} />
            <InputField label="Denominator 2" value={d2} onChange={setD2} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="LCD" value={r.lcd} />
        <ResultRow label="Fraction 1" value={r.frac1} />
        <ResultRow label="Fraction 2" value={r.frac2} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 18. Mixed Number Calculator */
function MixedNumberCalc() {
    const [w1, setW1] = useState("1"); const [n1, setN1] = useState("2"); const [d1, setD1] = useState("3");
    const [op, setOp] = useState("+");
    const [w2, setW2] = useState("1"); const [n2, setN2] = useState("3"); const [d2, setD2] = useState("4");
    const r = useMemo(() => {
        const whole1 = parseInt(w1) || 0; const num1 = parseInt(n1) || 0; const den1 = parseInt(d1) || 1;
        const whole2 = parseInt(w2) || 0; const num2 = parseInt(n2) || 0; const den2 = parseInt(d2) || 1;
        const steps: string[] = [];
        // Step 1: Convert to improper
        const imp1 = whole1 * den1 + num1; const imp2 = whole2 * den2 + num2;
        steps.push(`Convert: ${whole1} ${num1}/${den1} = (${whole1}×${den1}+${num1})/${den1} = ${imp1}/${den1}`);
        steps.push(`Convert: ${whole2} ${num2}/${den2} = (${whole2}×${den2}+${num2})/${den2} = ${imp2}/${den2}`);
        let resN: number, resD: number;
        if (op === "+" || op === "-") {
            const g = gcd(den1, den2);
            const lcd = (den1 * den2) / g;
            const m1 = lcd / den1; const m2 = lcd / den2;
            const adj1 = imp1 * m1; const adj2 = imp2 * m2;
            steps.push(`LCD(${den1}, ${den2}) = ${lcd}`);
            steps.push(`${imp1}/${den1} = ${adj1}/${lcd}, ${imp2}/${den2} = ${adj2}/${lcd}`);
            resN = op === "+" ? adj1 + adj2 : adj1 - adj2;
            resD = lcd;
            steps.push(`${adj1} ${op} ${adj2} = ${resN}`);
            steps.push(`Result: ${resN}/${resD}`);
        } else if (op === "×") {
            resN = imp1 * imp2; resD = den1 * den2;
            steps.push(`Multiply: ${imp1}×${imp2} / ${den1}×${den2} = ${resN}/${resD}`);
        } else {
            resN = imp1 * den2; resD = den1 * imp2;
            steps.push(`Divide (flip & multiply): ${imp1}×${den2} / ${den1}×${imp2} = ${resN}/${resD}`);
        }
        // Simplify
        const sign = (resN < 0) !== (resD < 0) ? "-" : "";
        const absN = Math.abs(resN); const absD = Math.abs(resD);
        const g2 = gcd(absN, absD);
        const sn = absN / g2; const sd = absD / g2;
        if (g2 > 1) steps.push(`Simplify: GCD(${absN},${absD})=${g2} → ${sn}/${sd}`);
        // To mixed
        let mixed = `${sign}${sn}/${sd}`;
        if (sn >= sd && sd > 1) {
            const q = Math.floor(sn / sd); const rem = sn % sd;
            mixed = rem > 0 ? `${sign}${q} ${rem}/${sd}` : `${sign}${q}`;
            steps.push(`As mixed number: ${mixed}`);
        }
        const decimal = resD !== 0 ? fmt(resN / resD, 6) : "0";
        return { fraction: `${sign}${sn}/${sd}`, mixed, decimal, steps };
    }, [w1, n1, d1, op, w2, n2, d2]);
    return (<div className="con-calc"><h3 className="con-calc__title">🧮 Mixed Number Calculator</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Whole" value={w1} onChange={setW1} />
            <InputField label="Num" value={n1} onChange={setN1} />
            <InputField label="Den" value={d1} onChange={setD1} />
        </div>
        <SelectField label="Operation" value={op} onChange={setOp} options={[{value:"+",label:"Add (+)"},{value:"-",label:"Subtract (−)"},{value:"×",label:"Multiply (×)"},{value:"÷",label:"Divide (÷)"}]} />
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Whole" value={w2} onChange={setW2} />
            <InputField label="Num" value={n2} onChange={setN2} />
            <InputField label="Den" value={d2} onChange={setD2} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Mixed Number" value={r.mixed} />
        <ResultRow label="Fraction" value={r.fraction} />
        <ResultRow label="Decimal" value={r.decimal} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 19. Fraction Simplifier */
function FractionSimplifierCalc() {
    const [num, setNum] = useState("18"); const [den, setDen] = useState("24");
    const r = useMemo(() => {
        const n = parseInt(num) || 0; const d = parseInt(den) || 1;
        const steps: string[] = [];
        const absN = Math.abs(n); const absD = Math.abs(d);
        // Factors
        const fN: number[] = []; const fD: number[] = [];
        for (let i = 1; i <= absN; i++) if (absN % i === 0) fN.push(i);
        for (let i = 1; i <= absD; i++) if (absD % i === 0) fD.push(i);
        steps.push(`Factors of ${absN}: ${fN.join(", ")}`);
        steps.push(`Factors of ${absD}: ${fD.join(", ")}`);
        const g = gcd(absN, absD);
        steps.push(`Greatest Common Factor: ${g}`);
        const sn = absN / g; const sd = absD / g;
        steps.push(`Divide both by ${g}: ${absN}÷${g} / ${absD}÷${g} = ${sn}/${sd}`);
        const sign = (n < 0) !== (d < 0) ? "-" : "";
        const simplified = `${sign}${sn}/${sd}`;
        steps.push(`Simplified form: ${simplified}`);
        let mixed = simplified;
        if (sn >= sd && sd > 1) {
            const q = Math.floor(sn / sd); const rem = sn % sd;
            mixed = rem > 0 ? `${sign}${q} ${rem}/${sd}` : `${sign}${q}`;
            steps.push(`As mixed number: ${mixed}`);
        }
        const decimal = d !== 0 ? fmt(n / d, 6) : "0";
        const percent = d !== 0 ? fmt((n / d) * 100, 4) + "%" : "0%";
        const alreadySimplified = g === 1;
        if (alreadySimplified) steps.push("This fraction is already in simplest form!");
        return { simplified, mixed, decimal, percent, alreadySimplified, steps };
    }, [num, den]);
    return (<div className="con-calc"><h3 className="con-calc__title">✂️ Fraction Simplifier</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator" value={num} onChange={setNum} />
            <InputField label="Denominator" value={den} onChange={setDen} />
        </div>
    </div><div className="con-calc__results"><h4>Simplified Fraction</h4>
        <ResultRow label="Simplest Form" value={r.simplified} />
        <ResultRow label="Mixed Number" value={r.mixed} />
        <ResultRow label="Decimal" value={r.decimal} />
        <ResultRow label="Percentage" value={r.percent} />
        <ResultRow label="Already Simplified?" value={r.alreadySimplified ? "Yes ✔" : "No — reduced above"} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 20. Mixed Number to Improper Fraction */
function MixedToImproperCalc() {
    const [w, setW] = useState("2"); const [n, setN] = useState("1"); const [d, setD] = useState("4");
    const r = useMemo(() => {
        const whole = parseInt(w) || 0; const num = parseInt(n) || 0; const den = parseInt(d) || 1;
        const steps: string[] = [];
        const neg = whole < 0;
        const absW = Math.abs(whole);
        steps.push(`Mixed number: ${whole} ${num}/${den}`);
        const wholeNum = absW * den;
        steps.push(`Step 1: Multiply whole × denominator: ${absW} × ${den} = ${wholeNum}`);
        const impNum = wholeNum + num;
        steps.push(`Step 2: Add numerator: ${wholeNum} + ${num} = ${impNum}`);
        const sign = neg ? "-" : "";
        steps.push(`Improper fraction: ${sign}${impNum}/${den}`);
        // Simplify
        const g = gcd(impNum, Math.abs(den));
        const sn = impNum / g; const sd = Math.abs(den) / g;
        if (g > 1) steps.push(`Simplify: GCD(${impNum},${Math.abs(den)})=${g} → ${sign}${sn}/${sd}`);
        const totalVal = neg ? -(absW + num / den) : (absW + num / den);
        const decimal = fmt(totalVal, 6);
        const percent = fmt(totalVal * 100, 4) + "%";
        return { improper: `${sign}${impNum}/${den}`, simplified: `${sign}${sn}/${sd}`, decimal, percent, steps };
    }, [w, n, d]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔄 Mixed Number to Improper Fraction</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Whole" value={w} onChange={setW} />
            <InputField label="Numerator" value={n} onChange={setN} />
            <InputField label="Denominator" value={d} onChange={setD} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Improper Fraction" value={r.improper} />
        <ResultRow label="Simplified" value={r.simplified} />
        <ResultRow label="Decimal" value={r.decimal} />
        <ResultRow label="Percentage" value={r.percent} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 21. Solve for Unknown Fraction */
function SolveUnknownFractionCalc() {
    const [pos, setPos] = useState("n1");
    const [a, setA] = useState(""); const [b, setB] = useState("3");
    const [c, setC] = useState("3"); const [d, setD] = useState("4");
    const r = useMemo(() => {
        const steps: string[] = [];
        const va = parseFloat(a) || 0; const vb = parseFloat(b) || 0;
        const vc = parseFloat(c) || 0; const vd = parseFloat(d) || 0;
        let x = 0;
        if (pos === "n1") {
            steps.push(`x/${vb} = ${vc}/${vd}`);
            steps.push(`Cross multiply: x × ${vd} = ${vc} × ${vb}`);
            steps.push(`${vd}x = ${vc * vb}`);
            x = (vc * vb) / vd;
            steps.push(`x = ${vc * vb} / ${vd} = ${fmt(x, 6)}`);
        } else if (pos === "d1") {
            steps.push(`${va}/x = ${vc}/${vd}`);
            steps.push(`Cross multiply: ${va} × ${vd} = ${vc} × x`);
            steps.push(`${va * vd} = ${vc}x`);
            x = (va * vd) / vc;
            steps.push(`x = ${va * vd} / ${vc} = ${fmt(x, 6)}`);
        } else if (pos === "n2") {
            steps.push(`${va}/${vb} = x/${vd}`);
            steps.push(`Cross multiply: ${va} × ${vd} = x × ${vb}`);
            steps.push(`${va * vd} = ${vb}x`);
            x = (va * vd) / vb;
            steps.push(`x = ${va * vd} / ${vb} = ${fmt(x, 6)}`);
        } else {
            steps.push(`${va}/${vb} = ${vc}/x`);
            steps.push(`Cross multiply: ${va} × x = ${vc} × ${vb}`);
            steps.push(`${va}x = ${vc * vb}`);
            x = (vc * vb) / va;
            steps.push(`x = ${vc * vb} / ${va} = ${fmt(x, 6)}`);
        }
        // As fraction
        const num = Math.round(x * 1000); const den = 1000;
        const g = gcd(Math.abs(num), den);
        const sn = num / g; const sd = den / g;
        if (sd !== 1) steps.push(`As fraction: ${sn}/${sd}`);
        let mixed = sd === 1 ? `${sn}` : `${sn}/${sd}`;
        if (Math.abs(sn) >= sd && sd > 1) {
            const q = Math.floor(Math.abs(sn) / sd); const rem = Math.abs(sn) % sd;
            const sign = sn < 0 ? "-" : "";
            mixed = rem > 0 ? `${sign}${q} ${rem}/${sd}` : `${sign}${q}`;
            steps.push(`As mixed number: ${mixed}`);
        }
        return { x: fmt(x, 6), fraction: sd === 1 ? `${sn}` : `${sn}/${sd}`, mixed, steps };
    }, [pos, a, b, c, d]);
    const lbl = (p: string, v: string) => p === pos ? "x (unknown)" : v;
    return (<div className="con-calc"><h3 className="con-calc__title">❓ Solve for Unknown Fraction</h3><div className="con-calc__inputs">
        <SelectField label="Unknown Position" value={pos} onChange={setPos} options={[{value:"n1",label:"Numerator 1 (x/b = c/d)"},{value:"d1",label:"Denominator 1 (a/x = c/d)"},{value:"n2",label:"Numerator 2 (a/b = x/d)"},{value:"d2",label:"Denominator 2 (a/b = c/x)"}]} />
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            {pos !== "n1" && <InputField label="a (Num 1)" value={a} onChange={setA} />}
            {pos !== "d1" && <InputField label="b (Den 1)" value={b} onChange={setB} />}
            {pos !== "n2" && <InputField label="c (Num 2)" value={c} onChange={setC} />}
            {pos !== "d2" && <InputField label="d (Den 2)" value={d} onChange={setD} />}
        </div>
    </div><div className="con-calc__results"><h4>Solution</h4>
        <ResultRow label="x" value={r.x} />
        <ResultRow label="As Fraction" value={r.fraction} />
        <ResultRow label="Mixed Number" value={r.mixed} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 22. Fraction to Percent */
function FractionToPercentCalc() {
    const [w, setW] = useState("0"); const [n, setN] = useState("3"); const [d, setD] = useState("4");
    const r = useMemo(() => {
        const whole = parseInt(w) || 0; const num = parseInt(n) || 0; const den = parseInt(d) || 1;
        const steps: string[] = [];
        const totalNum = whole * den + num;
        if (whole) steps.push(`Convert mixed: ${whole} ${num}/${den} = ${totalNum}/${den}`);
        const decimal = totalNum / den;
        steps.push(`Divide: ${totalNum} ÷ ${den} = ${fmt(decimal, 6)}`);
        const percent = decimal * 100;
        steps.push(`Multiply by 100: ${fmt(decimal, 6)} × 100 = ${fmt(percent, 4)}%`);
        // Simplified
        const g = gcd(Math.abs(totalNum), Math.abs(den));
        const sn = totalNum / g; const sd = den / g;
        return { percent: fmt(percent, 4) + "%", decimal: fmt(decimal, 6), fraction: `${totalNum}/${den}`, simplified: `${sn}/${sd}`, steps };
    }, [w, n, d]);
    return (<div className="con-calc"><h3 className="con-calc__title">💯 Fraction to Percent Calculator</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Whole (opt)" value={w} onChange={setW} />
            <InputField label="Numerator" value={n} onChange={setN} />
            <InputField label="Denominator" value={d} onChange={setD} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Percentage" value={r.percent} />
        <ResultRow label="Decimal" value={r.decimal} />
        <ResultRow label="Fraction" value={r.fraction} />
        <ResultRow label="Simplified" value={r.simplified} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 23. Add Fractions */
function AddFractionsCalc() {
    const [w1, setW1] = useState(""); const [n1, setN1] = useState("1"); const [d1, setD1] = useState("3");
    const [w2, setW2] = useState(""); const [n2, setN2] = useState("1"); const [d2, setD2] = useState("4");
    const r = useMemo(() => {
        const whole1 = parseInt(w1) || 0; const num1 = parseInt(n1) || 0; const den1 = parseInt(d1) || 1;
        const whole2 = parseInt(w2) || 0; const num2 = parseInt(n2) || 0; const den2 = parseInt(d2) || 1;
        const steps: string[] = [];
        // Convert mixed to improper
        const imp1 = whole1 * den1 + (whole1 < 0 ? -Math.abs(num1) : num1);
        const imp2 = whole2 * den2 + (whole2 < 0 ? -Math.abs(num2) : num2);
        if (whole1) steps.push(`Convert: ${whole1} ${Math.abs(num1)}/${den1} = (${Math.abs(whole1)}×${den1}${num1 >= 0 ? "+" : "−"}${Math.abs(num1)})/${den1} = ${imp1}/${den1}`);
        if (whole2) steps.push(`Convert: ${whole2} ${Math.abs(num2)}/${den2} = (${Math.abs(whole2)}×${den2}${num2 >= 0 ? "+" : "−"}${Math.abs(num2)})/${den2} = ${imp2}/${den2}`);
        steps.push(`${imp1}/${den1} + ${imp2}/${den2}`);
        // Find LCD
        const g = gcd(Math.abs(den1), Math.abs(den2));
        const lcd = (Math.abs(den1) * Math.abs(den2)) / g;
        const m1 = lcd / Math.abs(den1); const m2 = lcd / Math.abs(den2);
        const adj1 = imp1 * m1; const adj2 = imp2 * m2;
        steps.push(`LCD(${den1}, ${den2}) = ${lcd}`);
        if (m1 !== 1) steps.push(`${imp1}/${den1} = ${imp1}×${m1} / ${den1}×${m1} = ${adj1}/${lcd}`);
        if (m2 !== 1) steps.push(`${imp2}/${den2} = ${imp2}×${m2} / ${den2}×${m2} = ${adj2}/${lcd}`);
        // Add
        const resN = adj1 + adj2;
        steps.push(`${adj1}/${lcd} + ${adj2}/${lcd} = ${adj1} + ${adj2} = ${resN}`);
        steps.push(`Result: ${resN}/${lcd}`);
        // Simplify
        const sign = (resN < 0) !== (lcd < 0) ? "-" : "";
        const absN = Math.abs(resN); const absD = Math.abs(lcd);
        const g2 = gcd(absN, absD);
        const sn = absN / g2; const sd = absD / g2;
        if (g2 > 1) steps.push(`Simplify: GCD(${absN},${absD})=${g2} → ${sign}${sn}/${sd}`);
        // Mixed number
        let mixed = `${sign}${sn}/${sd}`;
        if (sn >= sd && sd > 1) {
            const q = Math.floor(sn / sd); const rem = sn % sd;
            mixed = rem > 0 ? `${sign}${q} ${rem}/${sd}` : `${sign}${q}`;
            steps.push(`As mixed number: ${mixed}`);
        }
        const decimal = lcd !== 0 ? fmt(resN / lcd, 6) : "0";
        return { fraction: `${sign}${sn}/${sd}`, mixed, decimal, steps };
    }, [w1, n1, d1, w2, n2, d2]);
    return (<div className="con-calc"><h3 className="con-calc__title">➕ Adding Fractions Calculator</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Whole 1 (opt)" value={w1} onChange={setW1} placeholder="0" />
            <InputField label="Numerator 1" value={n1} onChange={setN1} />
            <InputField label="Denominator 1" value={d1} onChange={setD1} />
        </div>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Whole 2 (opt)" value={w2} onChange={setW2} placeholder="0" />
            <InputField label="Numerator 2" value={n2} onChange={setN2} />
            <InputField label="Denominator 2" value={d2} onChange={setD2} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Fraction" value={r.fraction} />
        <ResultRow label="Mixed Number" value={r.mixed} />
        <ResultRow label="Decimal" value={r.decimal} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 24. Subtract Fractions */
function SubtractFractionsCalc() {
    const [n1, setN1] = useState("1"); const [d1, setD1] = useState("2");
    const [n2, setN2] = useState("1"); const [d2, setD2] = useState("3");
    const r = useMemo(() => {
        const a = parseInt(n1) || 0; const b = parseInt(d1) || 1;
        const c = parseInt(n2) || 0; const d = parseInt(d2) || 1;
        const steps: string[] = [];
        steps.push(`${a}/${b} − ${c}/${d}`);
        const g = gcd(Math.abs(b), Math.abs(d));
        const lcd = (Math.abs(b) * Math.abs(d)) / g;
        const m1 = lcd / Math.abs(b); const m2 = lcd / Math.abs(d);
        const adj1 = a * m1; const adj2 = c * m2;
        steps.push(`LCD(${b}, ${d}) = ${lcd}`);
        steps.push(`${a}/${b} = ${adj1}/${lcd}, ${c}/${d} = ${adj2}/${lcd}`);
        const resN = adj1 - adj2;
        steps.push(`${adj1} − ${adj2} = ${resN}`);
        steps.push(`Result: ${resN}/${lcd}`);
        // Simplify
        const sign = resN < 0 ? "-" : "";
        const absN = Math.abs(resN);
        const g2 = gcd(absN, lcd);
        const sn = absN / g2; const sd = lcd / g2;
        if (g2 > 1) steps.push(`Simplify: GCD(${absN},${lcd})=${g2} → ${sign}${sn}/${sd}`);
        let mixed = `${sign}${sn}/${sd}`;
        if (sn >= sd && sd > 1) {
            const q = Math.floor(sn / sd); const rem = sn % sd;
            mixed = rem > 0 ? `${sign}${q} ${rem}/${sd}` : `${sign}${q}`;
            steps.push(`As mixed number: ${mixed}`);
        }
        const decimal = lcd !== 0 ? fmt(resN / lcd, 6) : "0";
        return { fraction: `${sign}${sn}/${sd}`, mixed, decimal, steps };
    }, [n1, d1, n2, d2]);
    return (<div className="con-calc"><h3 className="con-calc__title">➖ Subtracting Fractions Calculator</h3><div className="con-calc__inputs">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 1" value={n1} onChange={setN1} />
            <InputField label="Denominator 1" value={d1} onChange={setD1} />
        </div>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
            <InputField label="Numerator 2" value={n2} onChange={setN2} />
            <InputField label="Denominator 2" value={d2} onChange={setD2} />
        </div>
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Fraction" value={r.fraction} />
        <ResultRow label="Mixed Number" value={r.mixed} />
        <ResultRow label="Decimal" value={r.decimal} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 25. Angle Converter */
const ANGLE_UNITS: { id: string; label: string; symbol: string; toDeg: number }[] = [
    { id: "degree", label: "Degrees", symbol: "°", toDeg: 1 },
    { id: "radian", label: "Radians", symbol: "rad", toDeg: 180 / Math.PI },
    { id: "milliradian", label: "Milliradians", symbol: "mrad", toDeg: 180 / (Math.PI * 1000) },
    { id: "arcminute", label: "Arcminutes", symbol: "′", toDeg: 1 / 60 },
    { id: "arcsecond", label: "Arcseconds", symbol: "″", toDeg: 1 / 3600 },
    { id: "gradian", label: "Gradians", symbol: "grad", toDeg: 0.9 },
    { id: "revolution", label: "Revolutions", symbol: "rev", toDeg: 360 },
    { id: "circle", label: "Circles", symbol: "circle", toDeg: 360 },
    { id: "mil", label: "Mils (NATO)", symbol: "mil", toDeg: 360 / 6400 },
];
function AngleConverterCalc() {
    const [value, setValue] = useState("90");
    const [fromUnit, setFromUnit] = useState("degree");
    const [toUnit, setToUnit] = useState("radian");
    const r = useMemo(() => {
        const v = parseFloat(value) || 0;
        const from = ANGLE_UNITS.find(u => u.id === fromUnit)!;
        const to = ANGLE_UNITS.find(u => u.id === toUnit)!;
        const degrees = v * from.toDeg;
        const result = degrees / to.toDeg;
        const factor = from.toDeg / to.toDeg;
        const steps: string[] = [];
        steps.push(`${v} ${from.symbol} → convert to ${to.label}`);
        if (from.id !== "degree" && to.id !== "degree") {
            steps.push(`Step 1: Convert to degrees: ${v} × ${fmt(from.toDeg, 6)} = ${fmt(degrees, 6)}°`);
            steps.push(`Step 2: Convert to ${to.label}: ${fmt(degrees, 6)} ÷ ${fmt(to.toDeg, 6)} = ${fmt(result, 6)} ${to.symbol}`);
        } else if (from.id === "degree") {
            steps.push(`Multiply: ${v} × (1 ${to.symbol} / ${fmt(to.toDeg, 6)}°) = ${fmt(result, 6)} ${to.symbol}`);
        } else {
            steps.push(`Multiply: ${v} × ${fmt(from.toDeg, 6)} = ${fmt(result, 6)}°`);
        }
        if (fromUnit === "degree" && toUnit === "radian") {
            const g = gcd(Math.abs(Math.round(v)), 180);
            if (g > 0 && Number.isInteger(v)) {
                const num = Math.round(v) / g;
                const den = 180 / g;
                steps.push(`Exact: ${Math.round(v)}° × π/180 = ${num === 1 ? "" : num === -1 ? "-" : num}π${den > 1 ? "/" + den : ""}`);
            }
        }
        if (fromUnit === "radian" && toUnit === "degree") {
            steps.push(`Formula: degrees = radians × 180/π`);
        }
        steps.push(`Conversion factor: 1 ${from.symbol} = ${fmt(factor, 8)} ${to.symbol}`);
        // All-units table
        const allConv = ANGLE_UNITS.map(u => ({
            label: u.label,
            symbol: u.symbol,
            value: fmt(degrees / u.toDeg, 6),
        }));
        return { result: fmt(result, 8), from, to, steps, allConv, factor: fmt(factor, 8) };
    }, [value, fromUnit, toUnit]);
    return (<div className="con-calc"><h3 className="con-calc__title">📐 Angle Converter</h3><div className="con-calc__inputs">
        <InputField label="Value" value={value} onChange={setValue} placeholder="e.g. 90" />
        <SelectField label="From" value={fromUnit} onChange={setFromUnit} options={ANGLE_UNITS.map(u => ({ value: u.id, label: `${u.label} (${u.symbol})` }))} />
        <SelectField label="To" value={toUnit} onChange={setToUnit} options={ANGLE_UNITS.map(u => ({ value: u.id, label: `${u.label} (${u.symbol})` }))} />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={`${value} ${r.from.symbol}`} value={`${r.result} ${r.to.symbol}`} />
        <ResultRow label="Conversion Factor" value={`1 ${r.from.symbol} = ${r.factor} ${r.to.symbol}`} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
        <h4>All Units</h4>
        {r.allConv.map((c, i) => <ResultRow key={i} label={c.label} value={`${c.value} ${c.symbol}`} />)}
    </div></div>);
}

/* ──── DISPATCHER ──── */
const CALC_MAP: Record<string, React.FC> = {
    "percentage": PercentageCalc,
    "fraction": FractionCalc,
    "gcd": GcdCalc,
    "lcm": LcmCalc,
    "quadratic": QuadraticCalc,
    "exponent": ExponentCalc,
    "factorial": FactorialCalc,
    "average": AverageCalc,
    "standard-deviation": StdDevCalc,
    "long-division": LongDivisionCalc,
    "fraction-to-ratio": FractionToRatioCalc,
    "compare-fractions": CompareFractionsCalc,
    "fraction-to-mixed": FractionToMixedCalc,
    "decimal-to-fraction": DecimalToFractionCalc,
    "inch-fraction": InchFractionCalc,
    "equivalent-fractions": EquivalentFractionsCalc,
    "lcd": LCDCalc,
    "mixed-number": MixedNumberCalc,
    "fraction-simplifier": FractionSimplifierCalc,
    "mixed-to-improper": MixedToImproperCalc,
    "solve-unknown-fraction": SolveUnknownFractionCalc,
    "fraction-to-percent": FractionToPercentCalc,
    "add-fractions": AddFractionsCalc,
    "subtract-fractions": SubtractFractionsCalc,
    "angle-converter": AngleConverterCalc,
};

export default function MathCalculatorCore({ calcType }: { calcType: string }) {
    const C = CALC_MAP[calcType];
    if (!C) return <p>Calculator not found: {calcType}</p>;
    return <C />;
}
