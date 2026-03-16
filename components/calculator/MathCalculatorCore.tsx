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
};

export default function MathCalculatorCore({ calcType }: { calcType: string }) {
    const C = CALC_MAP[calcType];
    if (!C) return <p>Calculator not found: {calcType}</p>;
    return <C />;
}
