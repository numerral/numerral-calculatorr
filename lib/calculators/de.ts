/**
 * German /de Calculators — Computation Functions
 * 7 categories × 5 calculators = 35 total
 */

// ═══════════════════════════════════════════════
// 1. GESUNDHEIT (Health)
// ═══════════════════════════════════════════════

export interface BMIResult { bmi: number; category: string; idealMin: number; idealMax: number; }
export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
    let category = "Normalgewicht";
    if (bmi < 18.5) category = "Untergewicht";
    else if (bmi < 25) category = "Normalgewicht";
    else if (bmi < 30) category = "Übergewicht";
    else if (bmi < 35) category = "Adipositas Grad I";
    else if (bmi < 40) category = "Adipositas Grad II";
    else category = "Adipositas Grad III";
    return { bmi, category, idealMin: Math.round(18.5 * heightM * heightM), idealMax: Math.round(24.9 * heightM * heightM) };
}

export interface CalorieResult { bmr: number; tdee: number; weightLoss: number; weightGain: number; }
export function calculateCalories(weightKg: number, heightCm: number, age: number, gender: "m" | "f", activity: number): CalorieResult {
    const bmr = gender === "m"
        ? Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
        : Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    const tdee = Math.round(bmr * activity);
    return { bmr, tdee, weightLoss: tdee - 500, weightGain: tdee + 500 };
}

export interface HeartRateResult { maxHR: number; zones: { name: string; min: number; max: number; desc: string }[]; }
export function calculateHeartRate(age: number, restingHR: number): HeartRateResult {
    const maxHR = 220 - age;
    const hrr = maxHR - restingHR;
    const zone = (lo: number, hi: number) => ({ min: Math.round(restingHR + hrr * lo), max: Math.round(restingHR + hrr * hi) });
    return {
        maxHR,
        zones: [
            { name: "Zone 1 – Erholung", ...zone(0.5, 0.6), desc: "Leichtes Training, Aufwärmen" },
            { name: "Zone 2 – Fettverbrennung", ...zone(0.6, 0.7), desc: "Aerobe Ausdauer, Fettabbau" },
            { name: "Zone 3 – Aerob", ...zone(0.7, 0.8), desc: "Verbesserung der Ausdauer" },
            { name: "Zone 4 – Anaerob", ...zone(0.8, 0.9), desc: "Leistungssteigerung" },
            { name: "Zone 5 – Maximum", ...zone(0.9, 1.0), desc: "Maximale Anstrengung" },
        ],
    };
}

export interface IdealWeightResult { robinson: number; miller: number; hamwi: number; devine: number; average: number; }
export function calculateIdealWeight(heightCm: number, gender: "m" | "f"): IdealWeightResult {
    const inchesOver5ft = Math.max(0, (heightCm - 152.4) / 2.54);
    const robinson = gender === "m" ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
    const miller = gender === "m" ? 56.2 + 1.41 * inchesOver5ft : 53.1 + 1.36 * inchesOver5ft;
    const hamwi = gender === "m" ? 48 + 2.7 * inchesOver5ft : 45.5 + 2.2 * inchesOver5ft;
    const devine = gender === "m" ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
    const avg = Math.round(((robinson + miller + hamwi + devine) / 4) * 10) / 10;
    return { robinson: Math.round(robinson * 10) / 10, miller: Math.round(miller * 10) / 10, hamwi: Math.round(hamwi * 10) / 10, devine: Math.round(devine * 10) / 10, average: avg };
}

export interface BodyFatResult { bodyFatPercent: number; category: string; fatMass: number; leanMass: number; }
export function calculateBodyFat(waistCm: number, neckCm: number, heightCm: number, hipCm: number, gender: "m" | "f"): BodyFatResult {
    let bf: number;
    if (gender === "m") {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }
    bf = Math.round(bf * 10) / 10;
    if (bf < 0) bf = 0;
    let category = "Normal";
    if (gender === "m") {
        if (bf < 6) category = "Essentiell"; else if (bf < 14) category = "Athletisch"; else if (bf < 18) category = "Fitness"; else if (bf < 25) category = "Normal"; else category = "Übergewicht";
    } else {
        if (bf < 14) category = "Essentiell"; else if (bf < 21) category = "Athletisch"; else if (bf < 25) category = "Fitness"; else if (bf < 32) category = "Normal"; else category = "Übergewicht";
    }
    const weight = 80; // placeholder
    return { bodyFatPercent: bf, category, fatMass: Math.round(weight * bf / 100 * 10) / 10, leanMass: Math.round(weight * (1 - bf / 100) * 10) / 10 };
}

// ═══════════════════════════════════════════════
// 2. MATHEMATIK (Math)
// ═══════════════════════════════════════════════

export interface PercentResult { result: number; formula: string; }
export function calculatePercent(value: number, percent: number, mode: "of" | "increase" | "decrease" | "isWhat"): PercentResult {
    switch (mode) {
        case "of": return { result: Math.round(value * percent / 100 * 100) / 100, formula: `${percent}% von ${value} = ${Math.round(value * percent / 100 * 100) / 100}` };
        case "increase": return { result: Math.round(value * (1 + percent / 100) * 100) / 100, formula: `${value} + ${percent}% = ${Math.round(value * (1 + percent / 100) * 100) / 100}` };
        case "decrease": return { result: Math.round(value * (1 - percent / 100) * 100) / 100, formula: `${value} − ${percent}% = ${Math.round(value * (1 - percent / 100) * 100) / 100}` };
        case "isWhat": return { result: value === 0 ? 0 : Math.round(percent / value * 100 * 100) / 100, formula: `${percent} ist ${value === 0 ? 0 : Math.round(percent / value * 100 * 100) / 100}% von ${value}` };
    }
}

export interface RuleOfThreeResult { result: number; formula: string; }
export function calculateRuleOfThree(a: number, b: number, c: number): RuleOfThreeResult {
    const result = a === 0 ? 0 : Math.round((b * c / a) * 1000) / 1000;
    return { result, formula: `${a} → ${b}, ${c} → ${result}` };
}

export interface FractionResult { whole: number; num: number; den: number; decimal: number; simplified: string; }
export function addFractions(n1: number, d1: number, n2: number, d2: number, op: "+" | "-" | "×" | "÷"): FractionResult {
    let rn: number, rd: number;
    switch (op) {
        case "+": rn = n1 * d2 + n2 * d1; rd = d1 * d2; break;
        case "-": rn = n1 * d2 - n2 * d1; rd = d1 * d2; break;
        case "×": rn = n1 * n2; rd = d1 * d2; break;
        case "÷": rn = n1 * d2; rd = d1 * n2; break;
    }
    const g = gcd(Math.abs(rn), Math.abs(rd));
    rn /= g; rd /= g;
    if (rd < 0) { rn = -rn; rd = -rd; }
    return { whole: Math.trunc(rn / rd), num: rn, den: rd, decimal: Math.round(rn / rd * 10000) / 10000, simplified: rd === 1 ? `${rn}` : `${rn}/${rd}` };
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }

export interface GCDLCMResult { gcdVal: number; lcmVal: number; }
export function calculateGCDLCM(a: number, b: number): GCDLCMResult {
    return { gcdVal: gcd(Math.abs(a), Math.abs(b)), lcmVal: lcm(Math.abs(a), Math.abs(b)) };
}

export interface AreaResult { area: number; unit: string; formula: string; }
export function calculateArea(shape: "rect" | "circle" | "triangle", a: number, b: number): AreaResult {
    switch (shape) {
        case "rect": return { area: Math.round(a * b * 100) / 100, unit: "m²", formula: `${a} × ${b} = ${Math.round(a * b * 100) / 100} m²` };
        case "circle": return { area: Math.round(Math.PI * a * a * 100) / 100, unit: "m²", formula: `π × ${a}² = ${Math.round(Math.PI * a * a * 100) / 100} m²` };
        case "triangle": return { area: Math.round(0.5 * a * b * 100) / 100, unit: "m²", formula: `½ × ${a} × ${b} = ${Math.round(0.5 * a * b * 100) / 100} m²` };
    }
}

// ═══════════════════════════════════════════════
// 3. FINANZEN (Finance)
// ═══════════════════════════════════════════════

export interface ZinsResult { endBetrag: number; zinsBetrag: number; zinsen: number[]; }
export function calculateZins(kapital: number, zinssatz: number, jahre: number): ZinsResult {
    const zinsen: number[] = [];
    let current = kapital;
    for (let i = 0; i < jahre; i++) {
        const z = current * zinssatz / 100;
        zinsen.push(Math.round(z * 100) / 100);
        current += z;
    }
    return { endBetrag: Math.round(current * 100) / 100, zinsBetrag: Math.round((current - kapital) * 100) / 100, zinsen };
}

export interface KreditResult { monatsRate: number; gesamtKosten: number; gesamtZinsen: number; }
export function calculateKredit(betrag: number, zinssatz: number, laufzeitMonate: number): KreditResult {
    const r = zinssatz / 100 / 12;
    if (r === 0) return { monatsRate: Math.round(betrag / laufzeitMonate * 100) / 100, gesamtKosten: betrag, gesamtZinsen: 0 };
    const rate = betrag * r * Math.pow(1 + r, laufzeitMonate) / (Math.pow(1 + r, laufzeitMonate) - 1);
    const gesamt = rate * laufzeitMonate;
    return { monatsRate: Math.round(rate * 100) / 100, gesamtKosten: Math.round(gesamt * 100) / 100, gesamtZinsen: Math.round((gesamt - betrag) * 100) / 100 };
}

export interface SparResult { endBetrag: number; einzahlungen: number; zinsenGesamt: number; }
export function calculateSparen(startKapital: number, monatlicheRate: number, zinssatz: number, jahre: number): SparResult {
    const r = zinssatz / 100 / 12;
    let betrag = startKapital;
    for (let i = 0; i < jahre * 12; i++) {
        betrag = betrag * (1 + r) + monatlicheRate;
    }
    const einzahlungen = startKapital + monatlicheRate * jahre * 12;
    return { endBetrag: Math.round(betrag * 100) / 100, einzahlungen: Math.round(einzahlungen * 100) / 100, zinsenGesamt: Math.round((betrag - einzahlungen) * 100) / 100 };
}

export interface InflationResult { realWert: number; kaufkraftVerlust: number; realerZins: number; }
export function calculateInflation(betrag: number, inflationsrate: number, jahre: number, nominalZins: number): InflationResult {
    const realWert = Math.round(betrag / Math.pow(1 + inflationsrate / 100, jahre) * 100) / 100;
    return { realWert, kaufkraftVerlust: Math.round((betrag - realWert) * 100) / 100, realerZins: Math.round((nominalZins - inflationsrate) * 100) / 100 };
}

export interface TilgungResult { monatsRate: number; restschuld: number[]; tilgung: number[]; zinsen: number[]; }
export function calculateTilgung(betrag: number, zinssatz: number, tilgungssatz: number, jahre: number): TilgungResult {
    const jahresRate = betrag * (zinssatz + tilgungssatz) / 100;
    const monatsRate = Math.round(jahresRate / 12 * 100) / 100;
    const restschuld: number[] = []; const tilgung: number[] = []; const zinsen: number[] = [];
    let rest = betrag;
    for (let i = 0; i < Math.min(jahre, 30); i++) {
        const z = rest * zinssatz / 100;
        const t = jahresRate - z;
        zinsen.push(Math.round(z)); tilgung.push(Math.round(t)); rest -= t; restschuld.push(Math.round(Math.max(0, rest)));
    }
    return { monatsRate, restschuld, tilgung, zinsen };
}

// ═══════════════════════════════════════════════
// 4. PHYSIK (Physics)
// ═══════════════════════════════════════════════

export interface SpeedResult { speed: number; time: number; distance: number; unit: string; }
export function calculateSpeed(distance: number, time: number, mode: "speed" | "time" | "distance"): SpeedResult {
    switch (mode) {
        case "speed": return { speed: Math.round(distance / time * 100) / 100, time, distance, unit: "km/h" };
        case "time": return { speed: distance, time: Math.round(time / distance * 100) / 100, distance: time, unit: "h" };
        case "distance": return { speed: distance, time, distance: Math.round(distance * time * 100) / 100, unit: "km" };
    }
}

export interface ForceResult { force: number; mass: number; acceleration: number; formula: string; }
export function calculateForce(mass: number, acceleration: number): ForceResult {
    const force = Math.round(mass * acceleration * 100) / 100;
    return { force, mass, acceleration, formula: `F = ${mass} kg × ${acceleration} m/s² = ${force} N` };
}

export interface DensityResult { density: number; mass: number; volume: number; formula: string; }
export function calculateDensity(mass: number, volume: number): DensityResult {
    const density = volume === 0 ? 0 : Math.round(mass / volume * 1000) / 1000;
    return { density, mass, volume, formula: `ρ = ${mass} kg ÷ ${volume} m³ = ${density} kg/m³` };
}

export interface OhmResult { voltage: number; current: number; resistance: number; power: number; }
export function calculateOhm(known: "V" | "I" | "R", val1: number, val2: number): OhmResult {
    switch (known) {
        case "V": return { voltage: val1 * val2, current: val1, resistance: val2, power: Math.round(val1 * val1 * val2 * 100) / 100 };
        case "I": return { voltage: val1, current: val2 === 0 ? 0 : Math.round(val1 / val2 * 1000) / 1000, resistance: val2, power: Math.round(val1 * val1 / (val2 || 1) * 100) / 100 };
        case "R": return { voltage: val1, current: val2, resistance: val2 === 0 ? 0 : Math.round(val1 / val2 * 1000) / 1000, power: Math.round(val1 * val2 * 100) / 100 };
    }
}

export interface EnergyResult { value: number; from: string; to: string; }
export function convertEnergy(value: number, from: "J" | "kJ" | "cal" | "kcal" | "kWh"): EnergyResult[] {
    const toJ: Record<string, number> = { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, kWh: 3600000 };
    const joules = value * toJ[from];
    return Object.entries(toJ).map(([unit, factor]) => ({
        value: Math.round(joules / factor * 10000) / 10000, from, to: unit,
    }));
}

// ═══════════════════════════════════════════════
// 5. STATISTIKEN (Statistics)
// ═══════════════════════════════════════════════

export interface MeanResult { mean: number; sum: number; count: number; }
export function calculateMean(values: number[]): MeanResult {
    const sum = values.reduce((a, b) => a + b, 0);
    return { mean: Math.round(sum / values.length * 10000) / 10000, sum, count: values.length };
}

export interface StdDevResult { mean: number; variance: number; stdDev: number; stdDevPop: number; }
export function calculateStdDev(values: number[]): StdDevResult {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
    const variancePop = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
    return { mean: Math.round(mean * 10000) / 10000, variance: Math.round(variance * 10000) / 10000, stdDev: Math.round(Math.sqrt(variance) * 10000) / 10000, stdDevPop: Math.round(Math.sqrt(variancePop) * 10000) / 10000 };
}

export interface MedianResult { median: number; q1: number; q3: number; iqr: number; sorted: number[]; }
export function calculateMedian(values: number[]): MedianResult {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const lower = sorted.slice(0, Math.floor(n / 2));
    const upper = sorted.slice(Math.ceil(n / 2));
    const q1 = lower.length % 2 === 0 ? (lower[lower.length / 2 - 1] + lower[lower.length / 2]) / 2 : lower[Math.floor(lower.length / 2)];
    const q3 = upper.length % 2 === 0 ? (upper[upper.length / 2 - 1] + upper[upper.length / 2]) / 2 : upper[Math.floor(upper.length / 2)];
    return { median, q1: q1 || 0, q3: q3 || 0, iqr: (q3 || 0) - (q1 || 0), sorted };
}

export interface PercentileResult { percentile: number; value: number; rank: number; }
export function calculatePercentile(values: number[], p: number): PercentileResult {
    const sorted = [...values].sort((a, b) => a - b);
    const rank = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(rank);
    const upper = Math.ceil(rank);
    const value = sorted[lower] + (rank - lower) * (sorted[upper] - sorted[lower]);
    return { percentile: p, value: Math.round(value * 10000) / 10000, rank: Math.round(rank * 100) / 100 };
}

export interface ProbResult { probability: number; odds: string; complement: number; }
export function calculateProbability(favorable: number, total: number): ProbResult {
    const p = total === 0 ? 0 : Math.round(favorable / total * 10000) / 10000;
    const comp = Math.round((1 - p) * 10000) / 10000;
    const oddsFor = favorable;
    const oddsAgainst = total - favorable;
    return { probability: p, odds: `${oddsFor}:${oddsAgainst}`, complement: comp };
}

// ═══════════════════════════════════════════════
// 6. ALLTAG (Everyday)
// ═══════════════════════════════════════════════

export interface AgeResult { years: number; months: number; days: number; totalDays: number; nextBirthdayIn: number; }
export function calculateAge(birthDate: Date): AgeResult {
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / 86400000);
    const nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const nextBirthdayIn = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
    return { years, months, days, totalDays, nextBirthdayIn };
}

export interface DateDiffResult { days: number; weeks: number; months: number; years: number; }
export function calculateDateDiff(start: Date, end: Date): DateDiffResult {
    const diffMs = Math.abs(end.getTime() - start.getTime());
    const days = Math.round(diffMs / 86400000);
    return { days, weeks: Math.floor(days / 7), months: Math.floor(days / 30.44), years: Math.floor(days / 365.25) };
}

export interface UnitResult { value: number; from: string; to: string; result: number; }
export function convertUnit(value: number, from: string, to: string, category: "length" | "weight" | "temp"): UnitResult {
    const lengthToM: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, mi: 1609.34 };
    const weightToKg: Record<string, number> = { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592 };
    if (category === "temp") {
        let celsius: number;
        if (from === "°C") celsius = value;
        else if (from === "°F") celsius = (value - 32) * 5 / 9;
        else celsius = value - 273.15;
        let result: number;
        if (to === "°C") result = celsius;
        else if (to === "°F") result = celsius * 9 / 5 + 32;
        else result = celsius + 273.15;
        return { value, from, to, result: Math.round(result * 100) / 100 };
    }
    const table = category === "length" ? lengthToM : weightToKg;
    const base = value * (table[from] || 1);
    const result = base / (table[to] || 1);
    return { value, from, to, result: Math.round(result * 10000) / 10000 };
}

export interface DiscountResult { originalPrice: number; discount: number; savedAmount: number; finalPrice: number; }
export function calculateDiscount(originalPrice: number, discountPercent: number): DiscountResult {
    const saved = Math.round(originalPrice * discountPercent / 100 * 100) / 100;
    return { originalPrice, discount: discountPercent, savedAmount: saved, finalPrice: Math.round((originalPrice - saved) * 100) / 100 };
}

export interface TipResult { tipAmount: number; totalPerPerson: number; totalBill: number; }
export function calculateTip(billAmount: number, tipPercent: number, people: number): TipResult {
    const tip = Math.round(billAmount * tipPercent / 100 * 100) / 100;
    const total = billAmount + tip;
    return { tipAmount: tip, totalPerPerson: Math.round(total / people * 100) / 100, totalBill: Math.round(total * 100) / 100 };
}

// ═══════════════════════════════════════════════
// 7. KI-TOOLS (AI Tools)
// ═══════════════════════════════════════════════

export interface CharCountResult { chars: number; charsNoSpaces: number; words: number; sentences: number; paragraphs: number; }
export function countChars(text: string): CharCountResult {
    return {
        chars: text.length,
        charsNoSpaces: text.replace(/\s/g, "").length,
        words: text.trim().split(/\s+/).filter(Boolean).length,
        sentences: text.split(/[.!?]+/).filter(Boolean).length,
        paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    };
}

export interface WordCountResult { words: number; chars: number; readingTime: string; speakingTime: string; }
export function countWords(text: string): WordCountResult {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const readMin = Math.ceil(words / 238);
    const speakMin = Math.ceil(words / 150);
    return { words, chars: text.length, readingTime: `~${readMin} Min.`, speakingTime: `~${speakMin} Min.` };
}

export interface PageCountResult { pages: number; words: number; wordsPerPage: number; }
export function countPages(text: string, wordsPerPage: number = 250): PageCountResult {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return { pages: Math.round(words / wordsPerPage * 10) / 10, words, wordsPerPage };
}

export interface TokenResult { tokens: number; chars: number; words: number; cost4o: string; cost4oMini: string; }
export function countTokens(text: string): TokenResult {
    // Rough estimate: 1 token ≈ 4 chars for English, ~3 for German
    const chars = text.length;
    const tokens = Math.round(chars / 3.5);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return { tokens, chars, words, cost4o: `~$${(tokens / 1000 * 0.005).toFixed(4)}`, cost4oMini: `~$${(tokens / 1000 * 0.00015).toFixed(6)}` };
}

export interface TextStatsResult { words: number; chars: number; sentences: number; avgWordLength: number; avgSentenceLength: number; readability: string; }
export function analyzeText(text: string): TextStatsResult {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgWordLen = words.length === 0 ? 0 : Math.round(words.reduce((s, w) => s + w.length, 0) / words.length * 10) / 10;
    const avgSentLen = sentences.length === 0 ? 0 : Math.round(words.length / sentences.length * 10) / 10;
    let readability = "Leicht";
    if (avgSentLen > 20 || avgWordLen > 6) readability = "Mittel";
    if (avgSentLen > 25 || avgWordLen > 7) readability = "Schwer";
    return { words: words.length, chars: text.length, sentences: sentences.length, avgWordLength: avgWordLen, avgSentenceLength: avgSentLen, readability };
}
