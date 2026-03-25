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

/* 5. Quadratic Equation Solver (Enhanced) */
function simplifyRadical(n: number): { coeff: number; radicand: number } {
    if (n < 0) { const r = simplifyRadical(-n); return { coeff: r.coeff, radicand: -r.radicand }; }
    if (n === 0) return { coeff: 0, radicand: 0 };
    let coeff = 1; let rem = n;
    for (let p = 2; p * p <= rem; p++) { while (rem % (p * p) === 0) { coeff *= p; rem /= p * p; } }
    return { coeff, radicand: rem };
}
function fmtFrac(num: number, den: number): string {
    if (den === 0) return "undefined";
    const sign = (num < 0) !== (den < 0) ? "-" : "";
    const an = Math.abs(num); const ad = Math.abs(den);
    const g = gcd(an, ad); const sn = an / g; const sd = ad / g;
    if (sd === 1) return `${sign}${sn}`;
    return `${sign}${sn}/${sd}`;
}
function QuadraticCalc() {
    const [aVal, setA] = useState("1"); const [bVal, setB] = useState("-5"); const [cVal, setC] = useState("6");
    const r = useMemo(() => {
        const a = parseFloat(aVal) || 0; const b = parseFloat(bVal) || 0; const c = parseFloat(cVal) || 0;
        if (a === 0) return { type: "linear", roots: b !== 0 ? [`x = ${fmt(-c / b)}`] : [], disc: 0, vertex: { x: 0, y: 0 }, steps: ["Not a quadratic equation (a = 0)"], exactRoots: [] as string[], sumOfRoots: "—", productOfRoots: "—", factoredForm: "—", yIntercept: `(0, ${c})`, axisOfSymmetry: "—" };
        const disc = b * b - 4 * a * c;
        const steps: string[] = [];
        // Step 1: Identify
        steps.push(`Equation: ${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0`);
        steps.push(`Coefficients: a = ${a}, b = ${b}, c = ${c}`);
        // Step 2: Discriminant
        steps.push(`Discriminant: Δ = b² − 4ac = (${b})² − 4(${a})(${c}) = ${b * b} − ${4 * a * c} = ${fmt(disc)}`);

        let roots: string[];
        let exactRoots: string[] = [];
        let type: string;
        let factoredForm = "—";

        if (disc > 0) {
            const sqrtDisc = Math.sqrt(disc);
            const r1 = (-b + sqrtDisc) / (2 * a);
            const r2 = (-b - sqrtDisc) / (2 * a);
            roots = [`x₁ = ${fmt(r1, 6)}`, `x₂ = ${fmt(r2, 6)}`];
            type = "Two distinct real roots";
            steps.push(`Δ > 0 → Two distinct real roots`);
            // Check for perfect square discriminant
            const sqrtInt = Math.round(sqrtDisc);
            if (sqrtInt * sqrtInt === disc) {
                steps.push(`√Δ = √${fmt(disc, 0)} = ${sqrtInt}`);
                steps.push(`x = (−b ± √Δ) / 2a = (${-b} ± ${sqrtInt}) / ${2 * a}`);
                steps.push(`x₁ = (${-b} + ${sqrtInt}) / ${2 * a} = ${-b + sqrtInt} / ${2 * a} = ${fmtFrac(-b + sqrtInt, 2 * a)}`);
                steps.push(`x₂ = (${-b} − ${sqrtInt}) / ${2 * a} = ${-b - sqrtInt} / ${2 * a} = ${fmtFrac(-b - sqrtInt, 2 * a)}`);
                exactRoots = [fmtFrac(-b + sqrtInt, 2 * a), fmtFrac(-b - sqrtInt, 2 * a)];
                // Factored form
                const fr1 = fmtFrac(-b + sqrtInt, 2 * a);
                const fr2 = fmtFrac(-b - sqrtInt, 2 * a);
                const ff1 = r1 >= 0 ? `(x − ${fr1})` : `(x + ${fr1.replace("-", "")})`;
                const ff2 = r2 >= 0 ? `(x − ${fr2})` : `(x + ${fr2.replace("-", "")})`;
                factoredForm = a === 1 ? `${ff1}${ff2}` : `${a}${ff1}${ff2}`;
            } else {
                // Simplify the radical
                const { coeff: rc, radicand: rr } = simplifyRadical(disc);
                const radStr = rc > 1 ? `${rc}√${rr}` : `√${disc}`;
                steps.push(`√Δ = √${disc} = ${radStr}`);
                steps.push(`x = (−b ± √Δ) / 2a = (${-b} ± ${radStr}) / ${2 * a}`);
                exactRoots = [`(${-b} + ${radStr}) / ${2 * a}`, `(${-b} − ${radStr}) / ${2 * a}`];
                // Try simplifying
                const den = 2 * a;
                const g2 = gcd(gcd(Math.abs(-b), rc), Math.abs(den));
                if (g2 > 1) {
                    const sB = (-b) / g2; const sRc = rc / g2; const sDen = den / g2;
                    const sRadStr = sRc > 1 ? `${sRc}√${rr}` : (sRc === 1 ? `√${rr}` : `${sRc}√${rr}`);
                    exactRoots = [`(${sB} + ${sRadStr}) / ${sDen}`, `(${sB} − ${sRadStr}) / ${sDen}`];
                    if (Math.abs(sDen) === 1) {
                        exactRoots = [`${sB} + ${sRadStr}`, `${sB} − ${sRadStr}`];
                    }
                    steps.push(`Simplify (÷${g2}): x = (${sB} ± ${sRadStr})${Math.abs(sDen) === 1 ? "" : ` / ${sDen}`}`);
                }
                steps.push(`x₁ ≈ ${fmt(r1, 6)}`);
                steps.push(`x₂ ≈ ${fmt(r2, 6)}`);
            }
        } else if (disc === 0) {
            const r1 = -b / (2 * a);
            roots = [`x = ${fmt(r1, 6)}`];
            exactRoots = [fmtFrac(-b, 2 * a)];
            type = "One repeated (double) real root";
            steps.push(`Δ = 0 → One repeated root`);
            steps.push(`x = −b / 2a = ${-b} / ${2 * a} = ${fmtFrac(-b, 2 * a)}`);
            const ex = fmtFrac(-b, 2 * a);
            const ff = r1 >= 0 ? `(x − ${ex})²` : `(x + ${ex.replace("-", "")})²`;
            factoredForm = a === 1 ? ff : `${a}${ff}`;
        } else {
            const real = -b / (2 * a);
            const imagVal = Math.sqrt(-disc) / (2 * a);
            roots = [`x₁ = ${fmt(real, 6)} + ${fmt(Math.abs(imagVal), 6)}i`, `x₂ = ${fmt(real, 6)} − ${fmt(Math.abs(imagVal), 6)}i`];
            type = "Two complex conjugate roots";
            steps.push(`Δ < 0 → Two complex conjugate roots`);
            const { coeff: rc, radicand: rr } = simplifyRadical(-disc);
            const radStr = rc > 1 ? `${rc}√${rr}` : `√${-disc}`;
            steps.push(`√|Δ| = √${-disc} = ${radStr}`);
            steps.push(`Real part: −b / 2a = ${-b} / ${2 * a} = ${fmtFrac(-b, 2 * a)}`);
            steps.push(`Imaginary part: ±${radStr} / ${2 * a} · i`);
            const realFrac = fmtFrac(-b, 2 * a);
            const den = 2 * a;
            const g2 = gcd(rc, Math.abs(den));
            const simpRadStr = (rc / g2) > 1 ? `${rc / g2}√${rr}` : `√${rr}`;
            const simpDen = Math.abs(den / g2);
            const imagPart = simpDen === 1 ? `${simpRadStr}i` : `(${simpRadStr}/${simpDen})i`;
            exactRoots = [`${realFrac} + ${imagPart}`, `${realFrac} − ${imagPart}`];
            steps.push(`x₁ = ${exactRoots[0]}`);
            steps.push(`x₂ = ${exactRoots[1]}`);
        }
        // Vertex
        const vx = -b / (2 * a);
        const vy = a * vx * vx + b * vx + c;
        steps.push(`Axis of symmetry: x = −b / 2a = ${fmtFrac(-b, 2 * a)}`);
        steps.push(`Vertex: (${fmtFrac(-b, 2 * a)}, ${fmt(vy)})`);
        steps.push(`Parabola opens ${a > 0 ? "upward ↑ (minimum)" : "downward ↓ (maximum)"}`);
        steps.push(`Y-intercept: (0, ${c})`);
        // Vieta's formulas
        const sumOfRoots = fmtFrac(-b, a);
        const productOfRoots = fmtFrac(c, a);
        steps.push(`Sum of roots (−b/a): ${sumOfRoots}`);
        steps.push(`Product of roots (c/a): ${productOfRoots}`);

        return { type, roots, disc, vertex: { x: vx, y: vy }, steps, exactRoots, sumOfRoots, productOfRoots, factoredForm, yIntercept: `(0, ${c})`, axisOfSymmetry: fmtFrac(-b, 2 * a) };
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
        {r.exactRoots.length > 0 && <><h4>Exact Form</h4>
        {r.exactRoots.map((root, i) => <ResultRow key={i} label={`x${r.exactRoots.length > 1 ? `₁₂`[i] : ""}`} value={root} />)}</>}
        <h4>Parabola Properties</h4>
        <ResultRow label="Vertex (h, k)" value={`(${r.axisOfSymmetry}, ${fmt(r.vertex.y)})`} />
        <ResultRow label="Axis of Symmetry" value={`x = ${r.axisOfSymmetry}`} />
        <ResultRow label="Y-intercept" value={r.yIntercept} />
        {r.factoredForm !== "—" && <ResultRow label="Factored Form" value={r.factoredForm} />}
        <h4>Vieta's Formulas</h4>
        <ResultRow label="Sum of Roots (−b/a)" value={r.sumOfRoots} />
        <ResultRow label="Product of Roots (c/a)" value={r.productOfRoots} />
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

/* 18. Mixed Number Calculator (Enhanced) */
function MixedNumberCalc() {
    const [w1, setW1] = useState("1"); const [n1, setN1] = useState("2"); const [d1, setD1] = useState("3");
    const [op, setOp] = useState("+");
    const [w2, setW2] = useState("1"); const [n2, setN2] = useState("3"); const [d2, setD2] = useState("4");
    const r = useMemo(() => {
        const whole1 = parseInt(w1) || 0; const num1 = parseInt(n1) || 0; const den1 = parseInt(d1) || 1;
        const whole2 = parseInt(w2) || 0; const num2 = parseInt(n2) || 0; const den2 = parseInt(d2) || 1;
        if (den1 === 0 || den2 === 0) return { fraction: "—", mixed: "—", decimal: "—", percent: "—", steps: ["Denominator cannot be zero"] };
        const steps: string[] = [];
        // Step 1: Convert to improper
        const imp1 = whole1 * den1 + num1; const imp2 = whole2 * den2 + num2;
        const fmtMixed = (w: number, n: number, d: number) => w !== 0 ? `${w} ${Math.abs(n)}/${Math.abs(d)}` : `${n}/${d}`;
        steps.push(`Convert to improper fractions:`);
        steps.push(`  ${fmtMixed(whole1, num1, den1)} = (${whole1}×${den1}+${num1})/${den1} = ${imp1}/${den1}`);
        steps.push(`  ${fmtMixed(whole2, num2, den2)} = (${whole2}×${den2}+${num2})/${den2} = ${imp2}/${den2}`);
        let resN: number, resD: number;
        if (op === "+" || op === "-") {
            const g = gcd(Math.abs(den1), Math.abs(den2));
            const lcd = Math.abs(den1 * den2) / g;
            const m1 = lcd / Math.abs(den1); const m2 = lcd / Math.abs(den2);
            const adj1 = imp1 * m1; const adj2 = imp2 * m2;
            steps.push(`Find LCD(${den1}, ${den2}) = ${lcd}`);
            steps.push(`Convert to common denominator:`);
            steps.push(`  ${imp1}/${den1} = ${imp1}×${m1} / ${den1}×${m1} = ${adj1}/${lcd}`);
            steps.push(`  ${imp2}/${den2} = ${imp2}×${m2} / ${den2}×${m2} = ${adj2}/${lcd}`);
            resN = op === "+" ? adj1 + adj2 : adj1 - adj2;
            resD = lcd;
            steps.push(`${op === "+" ? "Add" : "Subtract"} numerators: ${adj1} ${op} ${adj2} = ${resN}`);
            steps.push(`Result: ${resN}/${resD}`);
        } else if (op === "×") {
            resN = imp1 * imp2; resD = den1 * den2;
            steps.push(`Multiply: (${imp1}×${imp2}) / (${den1}×${den2}) = ${resN}/${resD}`);
        } else {
            if (imp2 === 0) return { fraction: "—", mixed: "—", decimal: "—", percent: "—", steps: ["Cannot divide by zero"] };
            resN = imp1 * den2; resD = den1 * imp2;
            steps.push(`Flip second fraction: ${imp2}/${den2} → ${den2}/${imp2}`);
            steps.push(`Multiply: (${imp1}×${den2}) / (${den1}×${imp2}) = ${resN}/${resD}`);
        }
        // Simplify
        const sign = (resN < 0) !== (resD < 0) ? "-" : "";
        const absN = Math.abs(resN); const absD = Math.abs(resD);
        const g2 = gcd(absN, absD);
        const sn = absN / g2; const sd = absD / g2;
        if (g2 > 1) steps.push(`Simplify: GCD(${absN}, ${absD}) = ${g2} → ${sign}${sn}/${sd}`);
        // To mixed
        let mixed = `${sign}${sn}/${sd}`;
        if (sn >= sd && sd > 1) {
            const q = Math.floor(sn / sd); const rem = sn % sd;
            mixed = rem > 0 ? `${sign}${q} ${rem}/${sd}` : `${sign}${q}`;
            steps.push(`Convert to mixed number: ${sign}${sn}/${sd} = ${mixed}`);
        } else if (sd === 1) {
            mixed = `${sign}${sn}`;
        }
        const decimal = resD !== 0 ? resN / resD : 0;
        const percent = fmt(decimal * 100, 4) + "%";
        return { fraction: `${sign}${sn}/${sd}`, mixed, decimal: fmt(decimal, 6), percent, steps };
    }, [w1, n1, d1, op, w2, n2, d2]);
    return (<div className="con-calc"><h3 className="con-calc__title">🧮 Mixed Number Calculator</h3><div className="con-calc__inputs">
        <p style={{fontSize:"0.85rem",color:"var(--text-muted)",margin:"0 0 var(--s-2)"}}>Enter mixed numbers (whole + numerator/denominator). Leave whole as 0 for pure fractions.</p>
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
        <ResultRow label="Improper Fraction" value={r.fraction} />
        <ResultRow label="Decimal" value={r.decimal} />
        <ResultRow label="Percentage" value={r.percent} />
        <h4>Step-by-Step Solution</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
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

/* 26. Parallelogram Area */
function ParallelogramAreaCalc() {
    const [mode, setMode] = useState("bh");
    const [base, setBase] = useState("10"); const [height, setHeight] = useState("6");
    const [sideA, setSideA] = useState("7"); const [sideB, setSideB] = useState("8"); const [angle, setAngle] = useState("60");
    const [diagC, setDiagC] = useState("9"); const [diagD, setDiagD] = useState("12"); const [dAngle, setDAngle] = useState("30");
    const r = useMemo(() => {
        const steps: string[] = [];
        let area = 0;
        if (mode === "bh") {
            const b = parseFloat(base) || 0; const h = parseFloat(height) || 0;
            area = b * h;
            steps.push(`Formula: A = base × height`);
            steps.push(`A = ${b} × ${h} = ${fmt(area, 4)}`);
        } else if (mode === "sides") {
            const a = parseFloat(sideA) || 0; const b2 = parseFloat(sideB) || 0; const ang = parseFloat(angle) || 0;
            const rad = ang * Math.PI / 180;
            area = a * b2 * Math.sin(rad);
            steps.push(`Formula: A = side a × side b × sin(α)`);
            steps.push(`A = ${a} × ${b2} × sin(${ang}°)`);
            steps.push(`sin(${ang}°) = ${fmt(Math.sin(rad), 6)}`);
            steps.push(`A = ${a} × ${b2} × ${fmt(Math.sin(rad), 6)} = ${fmt(area, 4)}`);
        } else {
            const c = parseFloat(diagC) || 0; const d = parseFloat(diagD) || 0; const ang = parseFloat(dAngle) || 0;
            const rad = ang * Math.PI / 180;
            area = 0.5 * c * d * Math.sin(rad);
            steps.push(`Formula: A = ½ × d₁ × d₂ × sin(θ)`);
            steps.push(`A = ½ × ${c} × ${d} × sin(${ang}°)`);
            steps.push(`sin(${ang}°) = ${fmt(Math.sin(rad), 6)}`);
            steps.push(`A = 0.5 × ${c} × ${d} × ${fmt(Math.sin(rad), 6)} = ${fmt(area, 4)}`);
        }
        return { area: fmt(area, 4), sqIn: fmt(area * 144, 2), sqM: fmt(area * 0.092903, 4), sqCm: fmt(area * 929.0304, 2), steps };
    }, [mode, base, height, sideA, sideB, angle, diagC, diagD, dAngle]);
    return (<div className="con-calc"><h3 className="con-calc__title">▱ Parallelogram Area Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Method" value={mode} onChange={setMode} options={[
            {value:"bh",label:"Base & Height"},
            {value:"sides",label:"Two Sides & Angle"},
            {value:"diags",label:"Diagonals & Angle"},
        ]} />
        {mode === "bh" && <>
            <InputField label="Base (b)" value={base} onChange={setBase} />
            <InputField label="Height (h)" value={height} onChange={setHeight} />
        </>}
        {mode === "sides" && <>
            <InputField label="Side a" value={sideA} onChange={setSideA} />
            <InputField label="Side b (base)" value={sideB} onChange={setSideB} />
            <InputField label="Angle α (degrees)" value={angle} onChange={setAngle} />
        </>}
        {mode === "diags" && <>
            <InputField label="Diagonal d₁" value={diagC} onChange={setDiagC} />
            <InputField label="Diagonal d₂" value={diagD} onChange={setDiagD} />
            <InputField label="Angle θ (degrees)" value={dAngle} onChange={setDAngle} />
        </>}
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Area" value={`${r.area} sq units`} />
        <ResultRow label="Sq ft → Sq m" value={`${r.area} ft² = ${r.sqM} m²`} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 27. Arc Length */
function ArcLengthCalc() {
    const [mode, setMode] = useState("ra");
    const [radius, setRadius] = useState("7"); const [angleDeg, setAngleDeg] = useState("90");
    const [chord, setChord] = useState("10"); const [sArea, setSArea] = useState("38.48");
    const r = useMemo(() => {
        const steps: string[] = [];
        let arcLen = 0, chordLen = 0, sectArea = 0, thetaRad = 0, rad = 0;
        if (mode === "ra") {
            rad = parseFloat(radius) || 0;
            const deg = parseFloat(angleDeg) || 0;
            thetaRad = deg * Math.PI / 180;
            arcLen = rad * thetaRad;
            chordLen = 2 * rad * Math.sin(thetaRad / 2);
            sectArea = (rad * rad * thetaRad) / 2;
            steps.push(`Convert angle: ${deg}° × π/180 = ${fmt(thetaRad, 6)} rad`);
            steps.push(`Arc length: s = r × θ = ${rad} × ${fmt(thetaRad, 6)} = ${fmt(arcLen, 6)}`);
            steps.push(`Chord: a = 2r × sin(θ/2) = 2×${rad} × sin(${fmt(thetaRad/2, 4)}) = ${fmt(chordLen, 6)}`);
            steps.push(`Sector area: A = r²θ/2 = ${rad}²×${fmt(thetaRad, 4)}/2 = ${fmt(sectArea, 6)}`);
        } else if (mode === "rc") {
            rad = parseFloat(radius) || 0;
            const c = parseFloat(chord) || 0;
            const ratio = c / (2 * rad);
            thetaRad = 2 * Math.asin(Math.min(1, Math.max(-1, ratio)));
            arcLen = rad * thetaRad;
            chordLen = c;
            sectArea = (rad * rad * thetaRad) / 2;
            steps.push(`Find angle: θ = 2×sin⁻¹(a/2r) = 2×sin⁻¹(${c}/${2*rad}) = ${fmt(thetaRad, 6)} rad (${fmt(thetaRad*180/Math.PI, 4)}°)`);
            steps.push(`Arc length: s = r × θ = ${rad} × ${fmt(thetaRad, 6)} = ${fmt(arcLen, 6)}`);
            steps.push(`Sector area: A = r²θ/2 = ${fmt(sectArea, 6)}`);
        } else if (mode === "ac") {
            const deg = parseFloat(angleDeg) || 0;
            const c = parseFloat(chord) || 0;
            thetaRad = deg * Math.PI / 180;
            rad = thetaRad > 0 ? c / (2 * Math.sin(thetaRad / 2)) : 0;
            arcLen = rad * thetaRad;
            chordLen = c;
            sectArea = (rad * rad * thetaRad) / 2;
            steps.push(`Convert angle: ${deg}° = ${fmt(thetaRad, 6)} rad`);
            steps.push(`Find radius: r = a / (2×sin(θ/2)) = ${c} / (2×sin(${fmt(thetaRad/2, 4)})) = ${fmt(rad, 6)}`);
            steps.push(`Arc length: s = r × θ = ${fmt(rad, 4)} × ${fmt(thetaRad, 4)} = ${fmt(arcLen, 6)}`);
            steps.push(`Sector area: A = r²θ/2 = ${fmt(sectArea, 6)}`);
        } else {
            const deg = parseFloat(angleDeg) || 0;
            const a = parseFloat(sArea) || 0;
            thetaRad = deg * Math.PI / 180;
            rad = thetaRad > 0 ? Math.sqrt((2 * a) / thetaRad) : 0;
            arcLen = rad * thetaRad;
            chordLen = 2 * rad * Math.sin(thetaRad / 2);
            sectArea = a;
            steps.push(`Convert angle: ${deg}° = ${fmt(thetaRad, 6)} rad`);
            steps.push(`Find radius: r = √(2A/θ) = √(2×${a}/${fmt(thetaRad, 4)}) = ${fmt(rad, 6)}`);
            steps.push(`Arc length: s = r × θ = ${fmt(rad, 4)} × ${fmt(thetaRad, 4)} = ${fmt(arcLen, 6)}`);
            steps.push(`Chord: a = 2r × sin(θ/2) = ${fmt(chordLen, 6)}`);
        }
        return { arcLen: fmt(arcLen, 6), chord: fmt(chordLen, 6), sectArea: fmt(sectArea, 6), thetaDeg: fmt(thetaRad * 180 / Math.PI, 4), thetaRad: fmt(thetaRad, 6), radius: fmt(rad, 6), steps };
    }, [mode, radius, angleDeg, chord, sArea]);
    return (<div className="con-calc"><h3 className="con-calc__title">⌒ Arc Length Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Known Values" value={mode} onChange={setMode} options={[
            {value:"ra", label:"Radius & Central Angle"},
            {value:"rc", label:"Radius & Chord Length"},
            {value:"ac", label:"Angle & Chord Length"},
            {value:"sa", label:"Sector Area & Angle"},
        ]} />
        {(mode === "ra" || mode === "rc") && <InputField label="Radius (r)" value={radius} onChange={setRadius} />}
        {(mode === "ra" || mode === "ac" || mode === "sa") && <InputField label="Central Angle (degrees)" value={angleDeg} onChange={setAngleDeg} />}
        {(mode === "rc" || mode === "ac") && <InputField label="Chord Length (a)" value={chord} onChange={setChord} />}
        {mode === "sa" && <InputField label="Sector Area (A)" value={sArea} onChange={setSArea} />}
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Arc Length (s)" value={r.arcLen} />
        <ResultRow label="Chord Length (a)" value={r.chord} />
        <ResultRow label="Sector Area (A)" value={r.sectArea} />
        <ResultRow label="Central Angle" value={`${r.thetaDeg}° = ${r.thetaRad} rad`} />
        <ResultRow label="Radius (r)" value={r.radius} />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 28. Pentagon Calculator */
function PentagonCalc() {
    const [mode, setMode] = useState("side");
    const [val, setVal] = useState("5");
    const r = useMemo(() => {
        const v = parseFloat(val) || 0;
        const steps: string[] = [];
        // Constants for regular pentagon
        const phi = (1 + Math.sqrt(5)) / 2; // golden ratio ≈ 1.618
        // Derive side length from whichever input
        let a = 0;
        if (mode === "side") { a = v; steps.push(`Side length: a = ${v}`); }
        else if (mode === "perimeter") { a = v / 5; steps.push(`Side from perimeter: a = P/5 = ${v}/5 = ${fmt(a, 6)}`); }
        else if (mode === "area") {
            // A = (a²/4)√(5(5+2√5)) → a = √(4A / √(5(5+2√5)))
            const k = Math.sqrt(5 * (5 + 2 * Math.sqrt(5)));
            a = Math.sqrt(4 * v / k);
            steps.push(`Side from area: a = √(4A / √(5(5+2√5))) = ${fmt(a, 6)}`);
        } else if (mode === "diagonal") {
            a = v / phi;
            steps.push(`Side from diagonal: a = d / φ = ${v} / ${fmt(phi, 6)} = ${fmt(a, 6)}`);
        } else if (mode === "circumradius") {
            const Rk = Math.sqrt(50 + 10 * Math.sqrt(5)) / 10;
            a = v / Rk;
            steps.push(`Side from circumradius: a = R / k = ${fmt(a, 6)}`);
        } else if (mode === "apothem") {
            const rk = Math.sqrt(25 + 10 * Math.sqrt(5)) / 10;
            a = v / rk;
            steps.push(`Side from apothem: a = r / k = ${fmt(a, 6)}`);
        }
        // Compute all properties
        const area = (a * a / 4) * Math.sqrt(5 * (5 + 2 * Math.sqrt(5)));
        const perimeter = 5 * a;
        const diagonal = a * phi;
        const height = a * Math.sqrt(5 + 2 * Math.sqrt(5)) / 2;
        const circumR = a * Math.sqrt(50 + 10 * Math.sqrt(5)) / 10;
        const apothem = a * Math.sqrt(25 + 10 * Math.sqrt(5)) / 10;
        steps.push(`Area: A = (a²/4)√(5(5+2√5)) = ${fmt(area, 6)}`);
        steps.push(`Perimeter: P = 5a = ${fmt(perimeter, 6)}`);
        steps.push(`Diagonal: d = a × φ = ${fmt(a, 4)} × ${fmt(phi, 6)} = ${fmt(diagonal, 6)}`);
        steps.push(`Height: h = a√(5+2√5)/2 = ${fmt(height, 6)}`);
        steps.push(`Circumradius: R = ${fmt(circumR, 6)}`);
        steps.push(`Apothem: r = ${fmt(apothem, 6)}`);
        steps.push(`Interior angle: 108° (each)`);
        return { a: fmt(a, 6), area: fmt(area, 6), perimeter: fmt(perimeter, 6), diagonal: fmt(diagonal, 6), height: fmt(height, 6), circumR: fmt(circumR, 6), apothem: fmt(apothem, 6), steps };
    }, [mode, val]);
    return (<div className="con-calc"><h3 className="con-calc__title">⬠ Pentagon Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Known Value" value={mode} onChange={setMode} options={[
            {value:"side",label:"Side Length (a)"},
            {value:"perimeter",label:"Perimeter (P)"},
            {value:"area",label:"Area (A)"},
            {value:"diagonal",label:"Diagonal (d)"},
            {value:"circumradius",label:"Circumradius (R)"},
            {value:"apothem",label:"Apothem / Inradius (r)"},
        ]} />
        <InputField label={mode === "side" ? "Side Length (a)" : mode === "perimeter" ? "Perimeter (P)" : mode === "area" ? "Area (A)" : mode === "diagonal" ? "Diagonal (d)" : mode === "circumradius" ? "Circumradius (R)" : "Apothem (r)"} value={val} onChange={setVal} />
    </div><div className="con-calc__results"><h4>Pentagon Properties</h4>
        <ResultRow label="Side Length (a)" value={r.a} />
        <ResultRow label="Area (A)" value={r.area} />
        <ResultRow label="Perimeter (P)" value={r.perimeter} />
        <ResultRow label="Diagonal (d)" value={r.diagonal} />
        <ResultRow label="Height (h)" value={r.height} />
        <ResultRow label="Circumradius (R)" value={r.circumR} />
        <ResultRow label="Apothem / Inradius (r)" value={r.apothem} />
        <ResultRow label="Interior Angle" value="108°" />
        <h4>Steps</h4>
        {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 29. Area Calculator — multi-shape */
const AREA_SHAPES = [
    { id:"square", label:"Square" }, { id:"rectangle", label:"Rectangle" },
    { id:"triangle", label:"Triangle (b×h)" }, { id:"triangle-heron", label:"Triangle (Heron's SSS)" },
    { id:"circle", label:"Circle" }, { id:"ellipse", label:"Ellipse" },
    { id:"trapezoid", label:"Trapezoid" }, { id:"parallelogram", label:"Parallelogram" },
    { id:"rhombus", label:"Rhombus" }, { id:"sector", label:"Sector" },
    { id:"ring", label:"Ring (Annulus)" }, { id:"polygon", label:"Regular Polygon (n-gon)" },
];
function AreaCalc() {
    const [shape, setShape] = useState("rectangle");
    const [a, setA] = useState("10"); const [b, setB] = useState("6");
    const [c, setC] = useState("8"); const [h, setH] = useState("5");
    const [r1, setR1] = useState("7"); const [r2, setR2] = useState("3");
    const [ang, setAng] = useState("90"); const [n, setN] = useState("6");
    const res = useMemo(() => {
        const va = parseFloat(a) || 0, vb = parseFloat(b) || 0, vc = parseFloat(c) || 0;
        const vh = parseFloat(h) || 0, vr1 = parseFloat(r1) || 0, vr2 = parseFloat(r2) || 0;
        const vang = parseFloat(ang) || 0, vn = parseInt(n) || 3;
        const steps: string[] = [];
        let area = 0;
        switch (shape) {
            case "square": area = va * va; steps.push(`A = a² = ${va}² = ${fmt(area, 4)}`); break;
            case "rectangle": area = va * vb; steps.push(`A = l × w = ${va} × ${vb} = ${fmt(area, 4)}`); break;
            case "triangle": area = 0.5 * va * vh; steps.push(`A = ½ × b × h = ½ × ${va} × ${vh} = ${fmt(area, 4)}`); break;
            case "triangle-heron": {
                const s = (va + vb + vc) / 2;
                area = Math.sqrt(s * (s - va) * (s - vb) * (s - vc));
                steps.push(`s = (a+b+c)/2 = (${va}+${vb}+${vc})/2 = ${fmt(s, 4)}`);
                steps.push(`A = √(s(s−a)(s−b)(s−c)) = √(${fmt(s, 2)}×${fmt(s - va, 2)}×${fmt(s - vb, 2)}×${fmt(s - vc, 2)}) = ${fmt(area, 4)}`);
                break;
            }
            case "circle": area = Math.PI * vr1 * vr1; steps.push(`A = πr² = π × ${vr1}² = ${fmt(area, 4)}`); break;
            case "ellipse": area = Math.PI * va * vb; steps.push(`A = π × a × b = π × ${va} × ${vb} = ${fmt(area, 4)}`); break;
            case "trapezoid": area = 0.5 * (va + vb) * vh; steps.push(`A = ½(a+b)×h = ½(${va}+${vb})×${vh} = ${fmt(area, 4)}`); break;
            case "parallelogram": area = va * vh; steps.push(`A = b × h = ${va} × ${vh} = ${fmt(area, 4)}`); break;
            case "rhombus": area = va * vh; steps.push(`A = a × h = ${va} × ${vh} = ${fmt(area, 4)}`); break;
            case "sector": { const rad = vang * Math.PI / 180; area = 0.5 * vr1 * vr1 * rad; steps.push(`A = ½r²θ = ½ × ${vr1}² × ${fmt(rad, 4)} = ${fmt(area, 4)}`); break; }
            case "ring": area = Math.PI * (vr1 * vr1 - vr2 * vr2); steps.push(`A = π(R²−r²) = π(${vr1}²−${vr2}²) = ${fmt(area, 4)}`); break;
            case "polygon": { const tanVal = Math.tan(Math.PI / vn); area = (va * va * vn) / (4 * tanVal); steps.push(`A = (a²×n)/(4×tan(π/n)) = (${va}²×${vn})/(4×tan(π/${vn})) = ${fmt(area, 4)}`); break; }
        }
        return { area: fmt(area, 6), steps };
    }, [shape, a, b, c, h, r1, r2, ang, n]);
    const showA = ["square","rectangle","triangle","triangle-heron","ellipse","trapezoid","parallelogram","rhombus","polygon"].includes(shape);
    const showB = ["rectangle","triangle-heron","ellipse","trapezoid"].includes(shape);
    const showC = shape === "triangle-heron";
    const showH = ["triangle","trapezoid","parallelogram","rhombus"].includes(shape);
    const showR1 = ["circle","sector","ring"].includes(shape);
    const showR2 = shape === "ring";
    const showAng = shape === "sector";
    const showN = shape === "polygon";
    return (<div className="con-calc"><h3 className="con-calc__title">📐 Area Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Shape" value={shape} onChange={setShape} options={AREA_SHAPES.map(s => ({value: s.id, label: s.label}))} />
        {showA && <InputField label={shape === "square" ? "Side (a)" : shape === "ellipse" ? "Semi-major axis (a)" : shape === "polygon" ? "Side length (a)" : shape === "trapezoid" ? "Base a" : "Base / Length"} value={a} onChange={setA} />}
        {showB && <InputField label={shape === "ellipse" ? "Semi-minor axis (b)" : shape === "trapezoid" ? "Base b" : shape === "triangle-heron" ? "Side b" : "Width"} value={b} onChange={setB} />}
        {showC && <InputField label="Side c" value={c} onChange={setC} />}
        {showH && <InputField label="Height (h)" value={h} onChange={setH} />}
        {showR1 && <InputField label={shape === "ring" ? "Outer Radius (R)" : "Radius (r)"} value={r1} onChange={setR1} />}
        {showR2 && <InputField label="Inner Radius (r)" value={r2} onChange={setR2} />}
        {showAng && <InputField label="Angle (degrees)" value={ang} onChange={setAng} />}
        {showN && <InputField label="Number of sides (n)" value={n} onChange={setN} />}
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label="Area" value={`${res.area} sq units`} />
        <h4>Steps</h4>
        {res.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 30. Perimeter Calculator — multi-shape */
const PERIM_SHAPES = [
    { id:"square", label:"Square" }, { id:"rectangle", label:"Rectangle" },
    { id:"triangle", label:"Triangle" }, { id:"circle", label:"Circle" },
    { id:"ellipse", label:"Ellipse" }, { id:"trapezoid", label:"Trapezoid" },
    { id:"parallelogram", label:"Parallelogram" }, { id:"rhombus", label:"Rhombus" },
    { id:"sector", label:"Sector" }, { id:"polygon", label:"Regular Polygon (n-gon)" },
];
function PerimeterCalc() {
    const [shape, setShape] = useState("rectangle");
    const [a, setA] = useState("10"); const [b, setB] = useState("6");
    const [c, setC] = useState("8"); const [d, setD] = useState("5");
    const [r1, setR1] = useState("7"); const [ang, setAng] = useState("90"); const [n, setN] = useState("6");
    const res = useMemo(() => {
        const va = parseFloat(a) || 0, vb = parseFloat(b) || 0, vc = parseFloat(c) || 0, vd = parseFloat(d) || 0;
        const vr = parseFloat(r1) || 0, vang = parseFloat(ang) || 0, vn = parseInt(n) || 3;
        const steps: string[] = [];
        let peri = 0;
        switch (shape) {
            case "square": peri = 4 * va; steps.push(`P = 4a = 4 × ${va} = ${fmt(peri, 4)}`); break;
            case "rectangle": peri = 2 * va + 2 * vb; steps.push(`P = 2l + 2w = 2×${va} + 2×${vb} = ${fmt(peri, 4)}`); break;
            case "triangle": peri = va + vb + vc; steps.push(`P = a + b + c = ${va} + ${vb} + ${vc} = ${fmt(peri, 4)}`); break;
            case "circle": peri = 2 * Math.PI * vr; steps.push(`C = 2πr = 2 × π × ${vr} = ${fmt(peri, 6)}`); break;
            case "ellipse": {
                // Ramanujan approximation
                const h3 = 3 * (va + vb);
                const root = Math.sqrt((3 * va + vb) * (va + 3 * vb));
                peri = Math.PI * (h3 - root);
                steps.push(`P ≈ π[3(a+b) − √((3a+b)(a+3b))]`);
                steps.push(`P ≈ π[${fmt(h3, 2)} − √(${fmt((3*va+vb)*(va+3*vb), 2)})]`);
                steps.push(`P ≈ π × ${fmt(h3 - root, 4)} = ${fmt(peri, 6)}`);
                break;
            }
            case "trapezoid": peri = va + vb + vc + vd; steps.push(`P = a + b + c + d = ${va} + ${vb} + ${vc} + ${vd} = ${fmt(peri, 4)}`); break;
            case "parallelogram": peri = 2 * va + 2 * vb; steps.push(`P = 2a + 2b = 2×${va} + 2×${vb} = ${fmt(peri, 4)}`); break;
            case "rhombus": peri = 4 * va; steps.push(`P = 4a = 4 × ${va} = ${fmt(peri, 4)}`); break;
            case "sector": {
                const rad = vang * Math.PI / 180;
                const arcLen = vr * rad;
                peri = 2 * vr + arcLen;
                steps.push(`Arc = rθ = ${vr} × ${fmt(rad, 4)} = ${fmt(arcLen, 4)}`);
                steps.push(`P = 2r + arc = 2×${vr} + ${fmt(arcLen, 4)} = ${fmt(peri, 6)}`);
                break;
            }
            case "polygon": peri = va * vn; steps.push(`P = a × n = ${va} × ${vn} = ${fmt(peri, 4)}`); break;
        }
        return { peri: fmt(peri, 6), steps };
    }, [shape, a, b, c, d, r1, ang, n]);
    const showA = ["square","rectangle","triangle","trapezoid","parallelogram","rhombus","polygon"].includes(shape);
    const showB = ["rectangle","triangle","trapezoid","parallelogram","ellipse"].includes(shape);
    const showC = ["triangle","trapezoid"].includes(shape);
    const showD = shape === "trapezoid";
    const showR = ["circle","sector"].includes(shape);
    const showAng = shape === "sector";
    const showN = shape === "polygon";
    const showElA = shape === "ellipse";
    return (<div className="con-calc"><h3 className="con-calc__title">📏 Perimeter Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Shape" value={shape} onChange={setShape} options={PERIM_SHAPES.map(s => ({value: s.id, label: s.label}))} />
        {showElA && <InputField label="Semi-major axis (a)" value={a} onChange={setA} />}
        {showA && !showElA && <InputField label={shape === "square" || shape === "rhombus" ? "Side (a)" : shape === "polygon" ? "Side length (a)" : shape === "trapezoid" ? "Base a" : shape === "triangle" ? "Side a" : "Length (l)"} value={a} onChange={setA} />}
        {showB && !showElA && <InputField label={shape === "triangle" ? "Side b" : shape === "trapezoid" ? "Base b" : "Width / Side b"} value={b} onChange={setB} />}
        {showElA && <InputField label="Semi-minor axis (b)" value={b} onChange={setB} />}
        {showC && <InputField label={shape === "trapezoid" ? "Side c" : "Side c"} value={c} onChange={setC} />}
        {showD && <InputField label="Side d" value={d} onChange={setD} />}
        {showR && <InputField label="Radius (r)" value={r1} onChange={setR1} />}
        {showAng && <InputField label="Angle (degrees)" value={ang} onChange={setAng} />}
        {showN && <InputField label="Number of sides (n)" value={n} onChange={setN} />}
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={shape === "circle" ? "Circumference" : "Perimeter"} value={`${res.peri} units`} />
        <h4>Steps</h4>
        {res.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 31. Circle Area / Properties Calculator */
function CircleCalc() {
    const [mode, setMode] = useState("radius");
    const [val, setVal] = useState("7");
    const res = useMemo(() => {
        const v = parseFloat(val) || 0;
        const steps: string[] = [];
        let r = 0;
        if (mode === "radius") { r = v; steps.push(`Radius: r = ${v}`); }
        else if (mode === "diameter") { r = v / 2; steps.push(`Radius: r = d/2 = ${v}/2 = ${fmt(r, 6)}`); }
        else if (mode === "circumference") { r = v / (2 * Math.PI); steps.push(`Radius: r = C/(2π) = ${v}/(2π) = ${fmt(r, 6)}`); }
        else { r = Math.sqrt(v / Math.PI); steps.push(`Radius: r = √(A/π) = √(${v}/π) = ${fmt(r, 6)}`); }
        const area = Math.PI * r * r;
        const circ = 2 * Math.PI * r;
        const diam = 2 * r;
        steps.push(`Area: A = πr² = π × ${fmt(r, 4)}² = ${fmt(area, 6)}`);
        steps.push(`Circumference: C = 2πr = 2 × π × ${fmt(r, 4)} = ${fmt(circ, 6)}`);
        steps.push(`Diameter: d = 2r = 2 × ${fmt(r, 4)} = ${fmt(diam, 6)}`);
        return { r: fmt(r, 6), area: fmt(area, 6), circ: fmt(circ, 6), diam: fmt(diam, 6), steps };
    }, [mode, val]);
    return (<div className="con-calc"><h3 className="con-calc__title">⊙ Circle Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Known Value" value={mode} onChange={setMode} options={[
            {value:"radius", label:"Radius (r)"},
            {value:"diameter", label:"Diameter (d)"},
            {value:"circumference", label:"Circumference (C)"},
            {value:"area", label:"Area (A)"},
        ]} />
        <InputField label={mode === "radius" ? "Radius (r)" : mode === "diameter" ? "Diameter (d)" : mode === "circumference" ? "Circumference (C)" : "Area (A)"} value={val} onChange={setVal} />
    </div><div className="con-calc__results"><h4>Circle Properties</h4>
        <ResultRow label="Radius (r)" value={res.r} />
        <ResultRow label="Diameter (d)" value={res.diam} />
        <ResultRow label="Area (A)" value={`${res.area} sq units`} />
        <ResultRow label="Circumference (C)" value={`${res.circ} units`} />
        <h4>Steps</h4>
        {res.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 32. Regular Polygon Calculator */
const POLY_NAMES: Record<number, string> = { 3:"Triangle",4:"Square",5:"Pentagon",6:"Hexagon",7:"Heptagon",8:"Octagon",9:"Nonagon",10:"Decagon",11:"Hendecagon",12:"Dodecagon",15:"Pentadecagon",20:"Icosagon" };
function RegularPolygonCalc() {
    const [n, setN] = useState("6");
    const [mode, setMode] = useState("side");
    const [val, setVal] = useState("5");
    const res = useMemo(() => {
        const vn = Math.max(3, parseInt(n) || 3);
        const v = parseFloat(val) || 0;
        const steps: string[] = [];
        let a = 0;
        if (mode === "side") { a = v; steps.push(`Side length: a = ${v}`); }
        else if (mode === "perimeter") { a = v / vn; steps.push(`Side from perimeter: a = P/n = ${v}/${vn} = ${fmt(a, 6)}`); }
        else if (mode === "area") {
            const k = vn / (4 * Math.tan(Math.PI / vn));
            a = Math.sqrt(v / k);
            steps.push(`Side from area: a = √(A / (n/(4tan(π/n)))) = ${fmt(a, 6)}`);
        } else if (mode === "circumradius") {
            a = v * 2 * Math.sin(Math.PI / vn);
            steps.push(`Side from circumradius: a = 2R×sin(π/n) = ${fmt(a, 6)}`);
        } else if (mode === "inradius") {
            a = v * 2 * Math.tan(Math.PI / vn);
            steps.push(`Side from apothem: a = 2r×tan(π/n) = ${fmt(a, 6)}`);
        }
        const area = (vn * a * a) / (4 * Math.tan(Math.PI / vn));
        const peri = vn * a;
        const intAngle = ((vn - 2) * 180) / vn;
        const extAngle = 360 / vn;
        const circumR = a / (2 * Math.sin(Math.PI / vn));
        const inR = a / (2 * Math.tan(Math.PI / vn));
        const diags = (vn * (vn - 3)) / 2;
        const angleSum = (vn - 2) * 180;
        const name = POLY_NAMES[vn] || `${vn}-gon`;
        steps.push(`Shape: ${name} (${vn} sides)`);
        steps.push(`Area: A = (n×a²)/(4×tan(π/n)) = ${fmt(area, 6)}`);
        steps.push(`Perimeter: P = n×a = ${vn}×${fmt(a, 4)} = ${fmt(peri, 6)}`);
        steps.push(`Interior angle: α = (n−2)×180/n = ${fmt(intAngle, 4)}°`);
        steps.push(`Exterior angle: β = 360/n = ${fmt(extAngle, 4)}°`);
        steps.push(`Angle sum: ${angleSum}°`);
        steps.push(`Circumradius: R = a/(2×sin(π/n)) = ${fmt(circumR, 6)}`);
        steps.push(`Inradius (apothem): r = a/(2×tan(π/n)) = ${fmt(inR, 6)}`);
        steps.push(`Diagonals: n(n−3)/2 = ${diags}`);
        return { name, a: fmt(a, 6), area: fmt(area, 6), peri: fmt(peri, 6), intAngle: fmt(intAngle, 4), extAngle: fmt(extAngle, 4), angleSum: String(angleSum), circumR: fmt(circumR, 6), inR: fmt(inR, 6), diags: String(diags), steps };
    }, [n, mode, val]);
    return (<div className="con-calc"><h3 className="con-calc__title">⬡ Regular Polygon Calculator</h3><div className="con-calc__inputs">
        <InputField label="Number of Sides (n)" value={n} onChange={setN} />
        <SelectField label="Known Value" value={mode} onChange={setMode} options={[
            {value:"side",label:"Side Length (a)"},
            {value:"perimeter",label:"Perimeter (P)"},
            {value:"area",label:"Area (A)"},
            {value:"circumradius",label:"Circumradius (R)"},
            {value:"inradius",label:"Inradius / Apothem (r)"},
        ]} />
        <InputField label={mode === "side" ? "Side Length (a)" : mode === "perimeter" ? "Perimeter (P)" : mode === "area" ? "Area (A)" : mode === "circumradius" ? "Circumradius (R)" : "Inradius (r)"} value={val} onChange={setVal} />
    </div><div className="con-calc__results"><h4>{res.name} Properties</h4>
        <ResultRow label="Shape" value={res.name} />
        <ResultRow label="Side Length (a)" value={res.a} />
        <ResultRow label="Area (A)" value={res.area} />
        <ResultRow label="Perimeter (P)" value={res.peri} />
        <ResultRow label="Interior Angle (α)" value={`${res.intAngle}°`} />
        <ResultRow label="Exterior Angle (β)" value={`${res.extAngle}°`} />
        <ResultRow label="Angle Sum" value={`${res.angleSum}°`} />
        <ResultRow label="Circumradius (R)" value={res.circumR} />
        <ResultRow label="Apothem / Inradius (r)" value={res.inR} />
        <ResultRow label="Diagonals" value={res.diags} />
        <h4>Steps</h4>
        {res.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
    </div></div>);
}

/* 33. Numbers to Words Converter */
function NumbersToWordsCalc() {
    const [input, setInput] = useState("5075.62");
    const [mode, setMode] = useState("words");
    const [letterCase, setLetterCase] = useState("lowercase");

    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];
    const ordinalOnes = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth",
        "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
    const ordinalTens = ["", "", "twentieth", "thirtieth", "fortieth", "fiftieth", "sixtieth", "seventieth", "eightieth", "ninetieth"];

    function chunkToWords(n: number): string {
        if (n === 0) return "";
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "");
        return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + chunkToWords(n % 100) : "");
    }

    function toWords(numStr: string): string {
        const cleaned = numStr.replace(/,/g, "").trim();
        if (cleaned === "" || isNaN(Number(cleaned))) return "(invalid number)";
        const num = Number(cleaned);
        if (num === 0) return "zero";
        const isNeg = num < 0;
        const abs = Math.abs(Math.floor(num));
        if (abs === 0) return isNeg ? "negative zero" : "zero";
        const digits = abs.toString();
        const chunks: number[] = [];
        for (let i = digits.length; i > 0; i -= 3) {
            chunks.unshift(parseInt(digits.slice(Math.max(0, i - 3), i)));
        }
        const parts: string[] = [];
        for (let i = 0; i < chunks.length; i++) {
            if (chunks[i] === 0) continue;
            const scaleIdx = chunks.length - 1 - i;
            const w = chunkToWords(chunks[i]) + (scaleIdx > 0 && scaleIdx < scales.length ? " " + scales[scaleIdx] : "");
            parts.push(w);
        }
        return (isNeg ? "negative " : "") + parts.join(" ");
    }

    function toOrdinal(numStr: string): string {
        const cleaned = numStr.replace(/,/g, "").trim();
        const num = parseInt(cleaned);
        if (isNaN(num) || num < 0) return "(enter a positive integer)";
        if (num === 0) return "zeroth";
        const abs = Math.abs(num);
        if (abs < 20) return ordinalOnes[abs];
        if (abs < 100) {
            const t = Math.floor(abs / 10);
            const o = abs % 10;
            return o === 0 ? ordinalTens[t] : tens[t] + "-" + ordinalOnes[o];
        }
        const baseWords = toWords(numStr);
        const lastTwo = abs % 100;
        if (lastTwo === 0) return baseWords.replace(/hundred$/, "hundredth");
        if (lastTwo < 20) {
            const parts = baseWords.split(" ");
            parts[parts.length - 1] = ordinalOnes[lastTwo];
            return parts.join(" ");
        }
        const lastOne = abs % 10;
        if (lastOne === 0) {
            const parts = baseWords.split(" ");
            const last = parts[parts.length - 1];
            parts[parts.length - 1] = ordinalTens[Math.floor(lastTwo / 10)];
            return parts.join(" ");
        }
        const parts = baseWords.split("-");
        parts[parts.length - 1] = ordinalOnes[lastOne];
        return parts.join("-");
    }

    function toCurrency(numStr: string): { check: string; display: string } {
        const cleaned = numStr.replace(/,/g, "").trim();
        const num = parseFloat(cleaned);
        if (isNaN(num)) return { check: "(invalid)", display: "(invalid)" };
        const abs = Math.abs(num);
        const dollars = Math.floor(abs);
        const cents = Math.round((abs - dollars) * 100);
        const dollarsWord = dollars === 0 ? "zero" : toWords(dollars.toString());
        const centsWord = cents === 0 ? "zero" : toWords(cents.toString());
        const neg = num < 0 ? "negative " : "";
        return {
            check: `${neg}${dollarsWord} and ${cents.toString().padStart(2, "0")}/100 dollars`,
            display: `${neg}${dollarsWord} dollar${dollars !== 1 ? "s" : ""} and ${centsWord} cent${cents !== 1 ? "s" : ""}`,
        };
    }

    function applyCase(text: string): string {
        switch (letterCase) {
            case "uppercase": return text.toUpperCase();
            case "title": return text.replace(/\b\w/g, c => c.toUpperCase());
            case "sentence": return text.charAt(0).toUpperCase() + text.slice(1);
            default: return text;
        }
    }

    const r = useMemo(() => {
        const cleaned = input.replace(/,/g, "").trim();
        const num = parseFloat(cleaned);
        const digitCount = cleaned.replace(/[^0-9]/g, "").length;
        if (mode === "currency") {
            const c = toCurrency(input);
            return { primary: applyCase(c.check), secondary: applyCase(c.display), digitCount, num };
        }
        if (mode === "ordinal") {
            return { primary: applyCase(toOrdinal(input)), secondary: !isNaN(num) ? `${Math.abs(Math.floor(num))}${["th","st","nd","rd"][(Math.abs(Math.floor(num))%100>10&&Math.abs(Math.floor(num))%100<14)?0:([1,2,3].indexOf(Math.abs(Math.floor(num))%10)+1)||0]||"th"}` : "", digitCount, num };
        }
        return { primary: applyCase(toWords(input)), secondary: "", digitCount, num };
    }, [input, mode, letterCase]);

    return (<div className="con-calc"><h3 className="con-calc__title">🔤 Numbers to Words Converter</h3><div className="con-calc__inputs">
        <InputField label="Enter a Number" value={input} onChange={setInput} placeholder="e.g. 5075.62, 1000000, -42" />
        <SelectField label="Mode" value={mode} onChange={setMode} options={[
            { value: "words", label: "Number → Words" },
            { value: "currency", label: "USD Currency (Check Writing)" },
            { value: "ordinal", label: "Ordinal (1st, 2nd, 3rd…)" },
        ]} />
        <SelectField label="Letter Case" value={letterCase} onChange={setLetterCase} options={[
            { value: "lowercase", label: "lowercase" },
            { value: "uppercase", label: "UPPERCASE" },
            { value: "title", label: "Title Case" },
            { value: "sentence", label: "Sentence case" },
        ]} />
    </div><div className="con-calc__results"><h4>Result</h4>
        <ResultRow label={mode === "currency" ? "Check Writing" : mode === "ordinal" ? "Ordinal" : "In Words"} value={r.primary} />
        {r.secondary && <ResultRow label={mode === "currency" ? "Full Form" : "Numeric Ordinal"} value={r.secondary} />}
        <ResultRow label="Digit Count" value={r.digitCount.toString()} />
        {!isNaN(r.num) && <ResultRow label="Number" value={r.num.toLocaleString("en-US", { maximumFractionDigits: 10 })} />}
    </div></div>);
}

/* ──── DISPATCHER ──── */
/* ── Roman Numeral helpers ── */
const ROMAN_VALS: [string, number][] = [
    ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
    ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
    ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1],
];
const ROMAN_MAP: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

function toRoman(n: number): string {
    if (n <= 0 || n > 3999999 || !Number.isInteger(n)) return "";
    if (n > 3999) {
        const hi = Math.floor(n / 1000);
        const lo = n % 1000;
        const hiR = toRomanBasic(hi);
        const loR = lo > 0 ? toRomanBasic(lo) : "";
        return hiR.split("").map(c => c + "\u0305").join("") + loR;
    }
    return toRomanBasic(n);
}
function toRomanBasic(n: number): string {
    let result = "";
    for (const [sym, val] of ROMAN_VALS) {
        while (n >= val) { result += sym; n -= val; }
    }
    return result;
}
function fromRoman(s: string): number {
    const clean = s.toUpperCase().replace(/[^IVXLCDM\u0305_]/g, "");
    // Handle _X style overline
    let total = 0; let i = 0;
    const chars: { val: number }[] = [];
    const arr = Array.from(clean);
    for (let j = 0; j < arr.length; j++) {
        if (arr[j] === "_" && j + 1 < arr.length && ROMAN_MAP[arr[j + 1]]) {
            chars.push({ val: ROMAN_MAP[arr[j + 1]] * 1000 }); j++;
        } else if (arr[j + 1] === "\u0305") {
            if (ROMAN_MAP[arr[j]]) { chars.push({ val: ROMAN_MAP[arr[j]] * 1000 }); j++; }
        } else if (ROMAN_MAP[arr[j]]) {
            chars.push({ val: ROMAN_MAP[arr[j]] });
        }
    }
    for (let k = 0; k < chars.length; k++) {
        if (k + 1 < chars.length && chars[k].val < chars[k + 1].val) {
            total += chars[k + 1].val - chars[k].val; k++;
        } else {
            total += chars[k].val;
        }
    }
    return total;
}
function placeValueBreakdown(n: number): { place: string; value: number; roman: string }[] {
    if (n <= 0 || n > 3999) return [{ place: "Number", value: n, roman: toRoman(n) }];
    const places: { place: string; value: number; roman: string }[] = [];
    const thousands = Math.floor(n / 1000);
    const hundreds = Math.floor((n % 1000) / 100);
    const tens = Math.floor((n % 100) / 10);
    const ones = n % 10;
    if (thousands > 0) places.push({ place: "Thousands", value: thousands * 1000, roman: toRomanBasic(thousands * 1000) });
    if (hundreds > 0) places.push({ place: "Hundreds", value: hundreds * 100, roman: toRomanBasic(hundreds * 100) });
    if (tens > 0) places.push({ place: "Tens", value: tens * 10, roman: toRomanBasic(tens * 10) });
    if (ones > 0) places.push({ place: "Ones", value: ones, roman: toRomanBasic(ones) });
    return places;
}
function conversionSteps(n: number): string[] {
    if (n <= 0 || n > 3999) return [`${n} → ${toRoman(n)}`];
    const steps: string[] = [];
    const bd = placeValueBreakdown(n);
    steps.push(`Break down ${n} by place value:`);
    bd.forEach(b => steps.push(`  ${b.place}: ${b.value} = ${b.roman}`));
    steps.push(`Combine: ${bd.map(b => b.roman).join(" + ")} = ${toRomanBasic(n)}`);
    return steps;
}

/* Roman Numeral Calculator (4 tabs) */
function RomanNumeralCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🏛️ Converter", "📅 Date", "➕ Arithmetic", "📊 Chart"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏛️ Roman Numeral Converter</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <RomanConverterTab />}
        {tab === 1 && <RomanDateTab />}
        {tab === 2 && <RomanArithmeticTab />}
        {tab === 3 && <RomanChartTab />}
    </div>);
}

function RomanConverterTab() {
    const [mode, setMode] = useState<"to-roman" | "to-number">("to-roman");
    const [numInput, setNumInput] = useState("2026");
    const [romanInput, setRomanInput] = useState("MMXXVI");
    const r = useMemo(() => {
        if (mode === "to-roman") {
            const n = parseInt(numInput) || 0;
            if (n < 1 || n > 3999999) return { result: "Enter 1–3,999,999", breakdown: [] as ReturnType<typeof placeValueBreakdown>, steps: ["Number must be between 1 and 3,999,999"] };
            return { result: toRoman(n), breakdown: n <= 3999 ? placeValueBreakdown(n) : [], steps: n <= 3999 ? conversionSteps(n) : [`${n} → ${toRoman(n)} (overline notation for values above 3,999)`] };
        } else {
            const n = fromRoman(romanInput);
            if (n === 0) return { result: "Invalid Roman numeral", breakdown: [] as ReturnType<typeof placeValueBreakdown>, steps: ["Enter a valid Roman numeral (I, V, X, L, C, D, M)"] };
            const verify = toRoman(n);
            const steps = [`Read left to right, applying subtractive notation:`, `${romanInput.toUpperCase()} = ${n}`];
            if (verify !== romanInput.toUpperCase()) steps.push(`Standard form: ${verify}`);
            return { result: n.toLocaleString(), breakdown: n <= 3999 ? placeValueBreakdown(n) : [], steps };
        }
    }, [mode, numInput, romanInput]);
    return (<div>
        <div className="con-calc__inputs">
            <SelectField label="Direction" value={mode} onChange={(v) => setMode(v as "to-roman" | "to-number")} options={[{ value: "to-roman", label: "Number → Roman Numeral" }, { value: "to-number", label: "Roman Numeral → Number" }]} />
            {mode === "to-roman"
                ? <InputField label="Enter a Number (1–3,999,999)" value={numInput} onChange={setNumInput} placeholder="e.g. 2026" />
                : <InputField label="Enter Roman Numeral" value={romanInput} onChange={setRomanInput} placeholder="e.g. MMXXVI" />}
        </div>
        <div className="con-calc__results"><h4>Result</h4>
            <ResultRow label={mode === "to-roman" ? "Roman Numeral" : "Number"} value={r.result} />
            {r.breakdown.length > 0 && <><h4>Place‑Value Breakdown</h4>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "1px solid var(--border)" }}><th style={{ padding: "6px 10px", textAlign: "left" }}>Place</th><th style={{ padding: "6px 10px", textAlign: "right" }}>Value</th><th style={{ padding: "6px 10px", textAlign: "right" }}>Roman</th></tr></thead>
                        <tbody>{r.breakdown.map((b, i) => <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}><td style={{ padding: "6px 10px" }}>{b.place}</td><td style={{ padding: "6px 10px", textAlign: "right" }}>{b.value.toLocaleString()}</td><td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600 }}>{b.roman}</td></tr>)}</tbody>
                    </table>
                </div></>}
            <h4>Step‑by‑Step</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label="" value={s} />)}
        </div>
    </div>);
}

function RomanDateTab() {
    const now = new Date();
    const [month, setMonth] = useState(String(now.getMonth() + 1));
    const [day, setDay] = useState(String(now.getDate()));
    const [year, setYear] = useState(String(now.getFullYear()));
    const [sep, setSep] = useState("·");
    const r = useMemo(() => {
        const m = parseInt(month) || 0; const d = parseInt(day) || 0; const y = parseInt(year) || 0;
        if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1 || y > 3999) return { date: "Invalid date", parts: [] as string[] };
        const parts = [toRomanBasic(m), toRomanBasic(d), toRomanBasic(y)];
        return { date: parts.join(` ${sep} `), parts };
    }, [month, day, year, sep]);
    return (<div>
        <div className="con-calc__inputs">
            <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                <InputField label="Month (1–12)" value={month} onChange={setMonth} min={1} max={12} />
                <InputField label="Day (1–31)" value={day} onChange={setDay} min={1} max={31} />
                <InputField label="Year (1–3999)" value={year} onChange={setYear} min={1} max={3999} />
            </div>
            <SelectField label="Separator" value={sep} onChange={setSep} options={[{ value: "·", label: "Dot ( · )" }, { value: "-", label: "Dash ( - )" }, { value: "/", label: "Slash ( / )" }, { value: " ", label: "Space" }]} />
        </div>
        <div className="con-calc__results"><h4>Roman Numeral Date</h4>
            <ResultRow label="Date" value={r.date} />
            {r.parts.length === 3 && <>
                <ResultRow label="Month" value={r.parts[0]} />
                <ResultRow label="Day" value={r.parts[1]} />
                <ResultRow label="Year" value={r.parts[2]} />
            </>}
            <h4>💡 Popular Uses</h4>
            <ResultRow label="" value="Tattoo designs, jewelry engravings, wedding invitations, and memorial plaques" />
        </div>
    </div>);
}

function RomanArithmeticTab() {
    const [a, setA] = useState("XIV");
    const [b, setB] = useState("VIII");
    const [op, setOp] = useState("add");
    const r = useMemo(() => {
        const na = fromRoman(a); const nb = fromRoman(b);
        if (na === 0 || nb === 0) return { result: "—", decimal: 0, steps: ["Enter valid Roman numerals"] };
        let result: number;
        const opSym = { add: "+", subtract: "−", multiply: "×", divide: "÷" }[op] || "+";
        switch (op) {
            case "add": result = na + nb; break;
            case "subtract": result = na - nb; break;
            case "multiply": result = na * nb; break;
            case "divide": result = Math.floor(na / nb); break;
            default: result = na + nb;
        }
        const steps = [
            `Convert: ${a.toUpperCase()} = ${na}, ${b.toUpperCase()} = ${nb}`,
            `Calculate: ${na} ${opSym} ${nb} = ${op === "divide" ? `${result} (integer quotient)` : result}`,
        ];
        if (result > 0 && result <= 3999999) {
            steps.push(`Convert back: ${result} = ${toRoman(result)}`);
        } else if (result <= 0) {
            steps.push("Result is zero or negative — cannot be represented in Roman numerals");
        }
        return { result: result > 0 && result <= 3999999 ? toRoman(result) : String(result), decimal: result, steps };
    }, [a, b, op]);
    return (<div>
        <div className="con-calc__inputs">
            <InputField label="First Roman Numeral" value={a} onChange={setA} placeholder="e.g. XIV" />
            <SelectField label="Operation" value={op} onChange={setOp} options={[{ value: "add", label: "Add (+)" }, { value: "subtract", label: "Subtract (−)" }, { value: "multiply", label: "Multiply (×)" }, { value: "divide", label: "Divide (÷)" }]} />
            <InputField label="Second Roman Numeral" value={b} onChange={setB} placeholder="e.g. VIII" />
        </div>
        <div className="con-calc__results"><h4>Result</h4>
            <ResultRow label="Roman Numeral" value={r.result} />
            <ResultRow label="Decimal" value={r.decimal.toLocaleString()} />
            <h4>Steps</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
        </div>
    </div>);
}

function RomanChartTab() {
    const [range, setRange] = useState("1-50");
    const [search, setSearch] = useState("");
    const ranges: Record<string, [number, number]> = { "1-50": [1, 50], "51-100": [51, 100], "100-500": [100, 500], "500-1000": [500, 1000] };
    const data = useMemo(() => {
        if (search.trim()) {
            const q = search.trim();
            const n = parseInt(q);
            if (!isNaN(n) && n >= 1 && n <= 3999) return [{ num: n, roman: toRomanBasic(n) }];
            const fromR = fromRoman(q);
            if (fromR > 0) return [{ num: fromR, roman: toRoman(fromR) }];
            return [];
        }
        const [lo, hi] = ranges[range] || [1, 50];
        const step = hi <= 100 ? 1 : hi <= 500 ? (range === "100-500" ? 10 : 1) : 50;
        const items: { num: number; roman: string }[] = [];
        for (let i = lo; i <= hi; i += step) items.push({ num: i, roman: toRomanBasic(i) });
        return items;
    }, [range, search]);
    return (<div>
        <div className="con-calc__inputs">
            <InputField label="🔍 Search (number or Roman numeral)" value={search} onChange={setSearch} placeholder="e.g. 42 or XLII" />
            <SelectField label="Range" value={range} onChange={setRange} options={[{ value: "1-50", label: "1 – 50" }, { value: "51-100", label: "51 – 100" }, { value: "100-500", label: "100 – 500 (by 10s)" }, { value: "500-1000", label: "500 – 1000 (by 50s)" }]} />
        </div>
        <div className="con-calc__results"><h4>Reference Chart {!search && `(${range})`}</h4>
            <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--card-bg, #1a1a2e)" }}><th style={{ padding: "6px 10px", textAlign: "right" }}>Number</th><th style={{ padding: "6px 10px", textAlign: "left" }}>Roman</th><th style={{ padding: "6px 10px", textAlign: "right" }}>Number</th><th style={{ padding: "6px 10px", textAlign: "left" }}>Roman</th></tr></thead>
                    <tbody>
                        {Array.from({ length: Math.ceil(data.length / 2) }, (_, i) => {
                            const left = data[i * 2];
                            const right = data[i * 2 + 1];
                            return (<tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "5px 10px", textAlign: "right" }}>{left?.num}</td>
                                <td style={{ padding: "5px 10px", fontWeight: 600 }}>{left?.roman}</td>
                                <td style={{ padding: "5px 10px", textAlign: "right" }}>{right?.num ?? ""}</td>
                                <td style={{ padding: "5px 10px", fontWeight: 600 }}>{right?.roman ?? ""}</td>
                            </tr>);
                        })}
                    </tbody>
                </table>
            </div>
            <h4 style={{ marginTop: "var(--s-3)" }}>Key Symbols</h4>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "1px solid var(--border)" }}><th style={{ padding: "6px 10px", textAlign: "left" }}>Symbol</th><th style={{ padding: "6px 10px", textAlign: "right" }}>Value</th><th style={{ padding: "6px 10px", textAlign: "left" }}>Origin</th></tr></thead>
                    <tbody>
                        {([["I", "1", "One finger"], ["V", "5", "Hand (5 fingers)"], ["X", "10", "Two hands crossed"], ["L", "50", "Half of C (Centum)"], ["C", "100", "Centum (Latin: hundred)"], ["D", "500", "Half of M (Mille)"], ["M", "1,000", "Mille (Latin: thousand)"]] as string[][]).map(([sym, val, origin], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: "5px 10px", fontWeight: 700, fontSize: "1.1rem" }}>{sym}</td>
                                <td style={{ padding: "5px 10px", textAlign: "right" }}>{val}</td>
                                <td style={{ padding: "5px 10px", color: "var(--text-muted)" }}>{origin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>);
}

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
    "parallelogram-area": ParallelogramAreaCalc,
    "arc-length": ArcLengthCalc,
    "pentagon": PentagonCalc,
    "area-calculator": AreaCalc,
    "perimeter-calculator": PerimeterCalc,
    "circle-area": CircleCalc,
    "polygon-calculator": RegularPolygonCalc,
    "numbers-to-words": NumbersToWordsCalc,
    "roman-numeral": RomanNumeralCalc,
};

export default function MathCalculatorCore({ calcType }: { calcType: string }) {
    const C = CALC_MAP[calcType];
    if (!C) return <p>Calculator not found: {calcType}</p>;
    return <C />;
}
