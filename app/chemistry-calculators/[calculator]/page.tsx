// Dynamic Hub — /chemistry-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import ChemistryCalculatorCore from "@/components/calculator/ChemistryCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("chemistry").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("chemistry").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/chemistry-calculators/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; explanation?: { heading: string; paragraphs?: string[]; contentHTML?: string; highlight?: string }; faq?: { question: string; answer: string }[] }> = {

    "atoms-to-moles-calculator": {
        subtitle: "Convert atoms (or molecules) to moles using Avogadro's number. Enter the number of atoms to find how many moles you have.",
        explanation: { heading: "How to Convert Atoms to Moles", contentHTML: `<h2>What Is a Mole?</h2>
<p>A mole is the SI unit for measuring the amount of a substance. One mole of any substance contains exactly 6.02214076 × 10²³ particles — this number is called Avogadro's number (Nₐ). The particles can be atoms, molecules, ions, or any other chemical entity.</p>
<p>Avogadro's number connects the atomic world, where individual atoms are far too small to count directly, to the macroscopic world, where we measure substances in <a href="/chemistry-calculators/grams-to-moles-calculator">grams</a>. Use our <a href="/chemistry-calculators/mole-calculator">mole calculator</a> to convert between grams, atoms, and liters.</p>

<h2>How to Convert Atoms to Moles</h2>

<h3>Atoms to Moles Formula</h3>
<div class="explanation__highlight"><strong>n = atoms / Nₐ</strong></div>
<p>Where:</p>
<ul><li><strong>n</strong> = number of moles</li><li><strong>atoms</strong> = number of atoms or molecules</li><li><strong>Nₐ</strong> = Avogadro's number = 6.022 × 10²³ /mol</li></ul>
<p>For example, if you have 3.011 × 10²³ atoms of carbon:</p>
<p>n = 3.011 × 10²³ / 6.022 × 10²³ = <strong>0.5 mol</strong></p>

<h2>Moles to Atoms</h2>
<p>To convert in the reverse direction (moles to atoms), multiply by Avogadro's number: atoms = n × Nₐ. For instance, 2 moles of iron contains 2 × 6.022 × 10²³ = 1.204 × 10²⁴ atoms. Once you know the number of moles, you can convert to <a href="/chemistry-calculators/grams-to-moles-calculator">grams</a> using the <a href="/chemistry-calculators/molar-mass-calculator">molar mass</a>.</p>`, highlight: "6.022 × 10²³ atoms = 1 mole. This is true for any element or compound." },
    },

    "grams-to-moles-calculator": {
        subtitle: "Convert grams to moles using molar mass. Enter mass in grams and molar mass (g/mol) to find the number of moles.",
        explanation: { heading: "How to Convert Grams to Moles", contentHTML: `<h2>What Is Molar Mass?</h2>
<p>Molar mass is the mass of one mole of a substance, measured in grams per mole (g/mol). It numerically equals the sum of the atomic masses of all atoms in the substance's chemical formula. You can find atomic masses on the periodic table or use our <a href="/chemistry-calculators/molar-mass-calculator">molar mass calculator</a>.</p>

<h2>How to Convert Grams to Moles</h2>

<h3>Grams to Moles Formula</h3>
<div class="explanation__highlight"><strong>n = m / M</strong></div>
<p>Where:</p>
<ul><li><strong>n</strong> = number of moles</li><li><strong>m</strong> = mass in grams (g)</li><li><strong>M</strong> = <a href="/chemistry-calculators/molar-mass-calculator">molar mass</a> (g/mol)</li></ul>
<p>For example, to find how many moles are in 36 grams of water (H₂O, M = 18.015 g/mol):</p>
<p>n = 36 / 18.015 = <strong>2.0 moles</strong></p>
<p>Those 2 moles contain 2 × 6.022 × 10²³ = 1.204 × 10²⁴ water molecules. Use our <a href="/chemistry-calculators/atoms-to-moles-calculator">atoms to moles calculator</a> to convert between particles and moles.</p>

<h2>Common Molar Masses</h2>
<p>Water (H₂O): 18.015 g/mol. Table salt (NaCl): 58.44 g/mol. Glucose (C₆H₁₂O₆): 180.16 g/mol. Carbon dioxide (CO₂): 44.01 g/mol. Oxygen gas (O₂): 32.00 g/mol. You can use these values in <a href="/chemistry-calculators/molarity-calculator">molarity</a> or <a href="/chemistry-calculators/theoretical-yield-calculator">theoretical yield</a> calculations.</p>`, highlight: "18 grams of water = 1 mole = 6.022 × 10²³ molecules. Use the periodic table to find molar mass." },
        faq: [
            { question: "How do I find the molar mass?", answer: "Add up the atomic masses (from the periodic table) of all atoms in the chemical formula. For NaCl: Na (22.99) + Cl (35.45) = 58.44 g/mol. For glucose C₆H₁₂O₆: 6(12.01) + 12(1.008) + 6(16.00) = 180.16 g/mol." },
        ],
    },

    "half-life-calculator": {
        subtitle: "Calculate radioactive decay or any exponential half-life process. Enter initial quantity, half-life, and elapsed time.",
        explanation: { heading: "How to Calculate Half-Life", contentHTML: `<h2>What Is Half-Life?</h2>
<p>Half-life is the time required for one-half of the atoms of a radioactive substance to disintegrate or decay. It is also used to describe any process that follows exponential decay, such as drug metabolism in the body or chemical reaction kinetics.</p>
<p>After one half-life, 50% of the original substance remains. After two half-lives, 25% remains. After three, 12.5%. After 10 half-lives, only about 0.1% of the original amount is left.</p>

<h2>How to Calculate Half-Life Decay</h2>

<h3>Half-Life Formula</h3>
<div class="explanation__highlight"><strong>N = N₀ × (½)^(t / t½)</strong></div>
<p>Where:</p>
<ul><li><strong>N</strong> = remaining quantity</li><li><strong>N₀</strong> = initial quantity</li><li><strong>t</strong> = elapsed time</li><li><strong>t½</strong> = half-life period</li></ul>
<p>For example, if you start with 100 grams of Carbon-14 (t½ = 5,730 years) and 11,460 years have passed (2 half-lives):</p>
<p>N = 100 × (½)² = 100 × 0.25 = <strong>25 grams</strong> remaining</p>

<h2>Common Radioactive Half-Lives</h2>
<table><thead><tr><th>Isotope</th><th>Half-Life</th><th>Use</th></tr></thead><tbody>
<tr><td>Carbon-14</td><td>5,730 years</td><td>Radiocarbon dating</td></tr>
<tr><td>Uranium-238</td><td>4.5 billion years</td><td>Geological dating</td></tr>
<tr><td>Iodine-131</td><td>8 days</td><td>Medical imaging</td></tr>
<tr><td>Radon-222</td><td>3.8 days</td><td>Home testing</td></tr>
</tbody></table>`, highlight: "Carbon-14 has a half-life of 5,730 years. After 2 half-lives (11,460 years), only 25% of the original C-14 remains." },
    },

    "liters-to-moles-calculator": {
        subtitle: "Convert liters of gas to moles using the ideal gas law (PV = nRT) or STP conditions (22.414 L/mol).",
        explanation: { heading: "How to Convert Liters to Moles", contentHTML: `<h2>What Is Molar Volume?</h2>
<p>At Standard Temperature and Pressure (STP — 0°C and 1 atm), one mole of any ideal gas occupies exactly 22.414 liters. This value is called the molar volume and is the same regardless of which gas you are measuring, because at low pressures, gas behavior depends only on the number of molecules, not their chemical identity.</p>

<h2>How to Convert Liters to Moles</h2>

<h3>At STP (Standard Temperature and Pressure)</h3>
<div class="explanation__highlight"><strong>n = V / 22.414</strong></div>
<p>For example, 44.828 liters of oxygen at STP is: n = 44.828 / 22.414 = <strong>2.0 moles</strong> of O₂.</p>

<h3>Using the Ideal Gas Law</h3>
<p>For conditions other than STP, use the ideal gas law:</p>
<div class="explanation__highlight"><strong>n = PV / RT</strong></div>
<p>Where P = pressure (atm), V = volume (L), R = 0.08206 L⋅atm/(mol⋅K), and T = temperature (K). You can then convert moles to <a href="/chemistry-calculators/grams-to-moles-calculator">grams</a> using <a href="/chemistry-calculators/molar-mass-calculator">molar mass</a>.</p>` },
    },

    "mgl-to-ppm-converter": {
        subtitle: "Convert milligrams per liter (mg/L) to parts per million (ppm). For dilute aqueous solutions, 1 mg/L ≈ 1 ppm.",
        explanation: { heading: "How to Convert mg/L to PPM", contentHTML: `<h2>What Is the Relationship Between mg/L and PPM?</h2>
<p>For dilute aqueous solutions (solutions based on water at standard conditions), milligrams per liter and parts per million are essentially interchangeable:</p>
<div class="explanation__highlight"><strong>1 mg/L ≈ 1 ppm</strong></div>
<p>This equality holds because 1 liter of water has a mass of approximately 1,000,000 mg (1 kg = 1,000,000 mg). Therefore, 1 mg dissolved in 1 L of water equals 1 part per 1,000,000 parts = 1 ppm.</p>

<h2>When This Approximation Breaks Down</h2>
<p>The 1:1 relationship is only accurate when the solution density is close to 1 g/mL (the density of pure water). For concentrated solutions, non-aqueous solvents, or solutions at high temperatures, you need a density correction. You can also use our <a href="/chemistry-calculators/ppm-to-mgl-converter">PPM to mg/L converter</a> for the reverse conversion, or our <a href="/chemistry-calculators/ppm-calculator">PPM calculator</a> for general calculations.</p>` },
    },

    "molality-calculator": {
        subtitle: "Calculate molality (moles of solute per kilogram of solvent). Unlike molarity, molality is independent of temperature.",
        explanation: { heading: "How to Calculate Molality", contentHTML: `<h2>What Is Molality?</h2>
<p>Molality (m) is a measure of the concentration of a solution expressed as the number of moles of solute per kilogram of solvent. Unlike <a href="/chemistry-calculators/molarity-calculator">molarity</a> (which uses volume of the total solution), molality uses the mass of the solvent only.</p>
<p>Because mass does not change with temperature, molality is temperature-independent, making it the preferred concentration unit for colligative property calculations.</p>

<h2>How to Calculate Molality</h2>

<h3>Molality Formula</h3>
<div class="explanation__highlight"><strong>m = mol_solute / kg_solvent</strong></div>
<p>Where m is molality in mol/kg, mol_solute is the number of moles of solute, and kg_solvent is the mass of the solvent in kilograms.</p>

<h2>Molality vs. Molarity</h2>
<p><a href="/chemistry-calculators/molarity-calculator">Molarity</a> (M) = moles of solute / liters of solution. Molality (m) = moles of solute / kilograms of solvent. The key difference is that molarity depends on volume (which changes with temperature), while molality depends on mass (which remains constant). For dilute aqueous solutions at room temperature, molality and molarity are approximately equal.</p>` },
    },

    "molar-mass-calculator": {
        subtitle: "Calculate molar mass from mass and moles using M = m/n. Includes a reference table of common molar masses.",
        explanation: { heading: "How to Calculate Molar Mass", contentHTML: `<h2>What Is Molar Mass?</h2>
<p>Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). It numerically equals the formula weight of the substance in atomic mass units (amu). The molar mass of each element is listed on the periodic table under the element symbol.</p>

<h2>How to Calculate Molar Mass</h2>

<h3>From Mass and Moles</h3>
<div class="explanation__highlight"><strong>M = m / n</strong></div>
<p>Where M = molar mass (g/mol), m = mass (g), n = number of moles. This is useful when you have experimental data and need to determine the molar mass of an unknown substance.</p>

<h3>From a Chemical Formula</h3>
<p>Add the atomic masses of every atom in the formula. For H₂O: 2 × 1.008 + 15.999 = <strong>18.015 g/mol</strong>. For NaCl: 22.99 + 35.45 = <strong>58.44 g/mol</strong>. Molar mass is essential for converting <a href="/chemistry-calculators/grams-to-moles-calculator">grams to moles</a>, calculating <a href="/chemistry-calculators/molarity-calculator">molarity</a>, and finding <a href="/chemistry-calculators/theoretical-yield-calculator">theoretical yield</a>.</p>` },
    },

    "molarity-calculator": {
        subtitle: "Calculate molarity (M) — moles of solute per liter of solution. The most common concentration unit in chemistry.",
        explanation: { heading: "How to Calculate Molarity", contentHTML: `<h2>What Is Molarity?</h2>
<p>Molarity is the most widely used concentration unit in chemistry. It expresses the number of moles of a solute dissolved in one liter of total solution. Molarity is represented by M and its units are moles per liter (mol/L).</p>
<p>A "1 M NaCl solution" means 1 mole of NaCl (58.44 g) has been dissolved in enough water to make exactly 1 liter of total solution. You can find the <a href="/chemistry-calculators/molar-mass-calculator">molar mass</a> of any substance to determine how many grams correspond to 1 mole.</p>

<h2>How to Calculate Molarity</h2>

<h3>Molarity Formula</h3>
<div class="explanation__highlight"><strong>M = n / V</strong></div>
<p>Where:</p>
<ul><li><strong>M</strong> = molarity (mol/L)</li><li><strong>n</strong> = moles of solute</li><li><strong>V</strong> = volume of solution (liters)</li></ul>
<p>The amount of substance in moles can be found using the <a href="/chemistry-calculators/molar-mass-calculator">molar mass</a> and the mass of the substance: n = m / M. Use our <a href="/chemistry-calculators/mole-calculator">mole calculator</a> if you need to convert grams to moles first.</p>

<h2>Dilution Formula</h2>
<p>When diluting a concentrated solution, use:</p>
<div class="explanation__highlight"><strong>M₁V₁ = M₂V₂</strong></div>
<p>For example, how much 12 M HCl is needed to prepare 500 mL of 1 M HCl?</p>
<p>V₁ = (M₂ × V₂) / M₁ = (1 × 0.5) / 12 = <strong>41.7 mL</strong></p>

<h2>Molarity vs. Molality</h2>
<p><a href="/chemistry-calculators/molality-calculator">Molality</a> uses mass of solvent (kg) instead of volume of solution (L). Molality is preferred for colligative properties because it is temperature-independent. For dilute aqueous solutions at room temperature, molarity and molality are approximately equal.</p>`, highlight: "1 M NaCl = 58.44 g NaCl per liter of solution. Use M₁V₁ = M₂V₂ for dilution calculations." },
        faq: [
            { question: "What is the difference between molarity and molality?", answer: "Molarity (M) = moles of solute per liter of total solution. Molality (m) = moles of solute per kilogram of solvent. Molarity depends on volume (changes with temperature); molality depends on mass (constant with temperature). For dilute aqueous solutions, they are approximately equal." },
        ],
    },

    "mole-calculator": {
        subtitle: "Universal mole converter — convert between grams, atoms/molecules, and liters (at STP) using Avogadro's number and molar mass.",
        explanation: { heading: "How to Use the Mole Calculator", contentHTML: `<h2>The Mole: Central Concept of Chemistry</h2>
<p>The mole is the SI unit for measuring the "amount of substance." It connects three fundamental scales used in chemistry: counting particles (atoms or molecules), weighing substances (grams), and measuring gas volumes (liters).</p>

<h3>Key Mole Relationships</h3>
<div class="explanation__highlight"><strong>1 mole = 6.022 × 10²³ particles</strong><br/><strong>1 mole = molar mass in grams</strong><br/><strong>1 mole of gas = 22.414 L at STP</strong></div>

<h2>Converting Between Units</h2>
<p>To convert <a href="/chemistry-calculators/grams-to-moles-calculator">grams to moles</a>, divide by the <a href="/chemistry-calculators/molar-mass-calculator">molar mass</a>. To convert <a href="/chemistry-calculators/atoms-to-moles-calculator">atoms to moles</a>, divide by Avogadro's number. To convert <a href="/chemistry-calculators/liters-to-moles-calculator">liters of gas at STP to moles</a>, divide by 22.414.</p>
<p>This calculator performs all of these conversions in one tool. Enter any known value and it will calculate the others. Use the result in <a href="/chemistry-calculators/molarity-calculator">molarity</a>, <a href="/chemistry-calculators/theoretical-yield-calculator">theoretical yield</a>, or <a href="/chemistry-calculators/percent-yield-calculator">percent yield</a> calculations.</p>` },
    },

    "mole-fraction-calculator": {
        subtitle: "Calculate mole fraction (χ) for a two-component mixture. Mole fractions always sum to 1.",
        explanation: { heading: "How to Calculate Mole Fraction", contentHTML: `<h2>What Is Mole Fraction?</h2>
<p>Mole fraction (χ) is a dimensionless measure of concentration that expresses the ratio of the number of moles of one component to the total number of moles in a mixture. Mole fractions are used in Raoult's Law (vapor pressure), Dalton's Law (partial pressures of gases), and colligative property calculations.</p>

<h2>How to Calculate Mole Fraction</h2>

<h3>Mole Fraction Formula</h3>
<div class="explanation__highlight"><strong>χᵢ = nᵢ / n_total</strong></div>
<p>Where:</p>
<ul><li><strong>χᵢ</strong> = mole fraction of component i</li><li><strong>nᵢ</strong> = moles of component i</li><li><strong>n_total</strong> = total moles of all components</li></ul>
<p>A key property of mole fractions is that they always sum to 1: χ₁ + χ₂ + ... = 1. You can find the number of moles from <a href="/chemistry-calculators/grams-to-moles-calculator">grams using molar mass</a>, then calculate mole fractions. This is also related to <a href="/chemistry-calculators/molality-calculator">molality</a> and <a href="/chemistry-calculators/molarity-calculator">molarity</a>.</p>` },
    },

    "percent-to-ppm-converter": {
        subtitle: "Convert percentage to parts per million (ppm). 1% = 10,000 ppm.",
        explanation: { heading: "How to Convert Percent to PPM", contentHTML: `<h2>What Is PPM?</h2>
<p>Parts per million (ppm) is a unit of measurement used to express very small concentrations. It describes the number of parts of a substance per one million parts of the total mixture. PPM is commonly used in water quality, air quality, food science, and manufacturing.</p>

<h2>How to Convert Percent to PPM</h2>

<h3>Percent to PPM Formula</h3>
<div class="explanation__highlight"><strong>ppm = % × 10,000</strong></div>
<p>The conversion factor is 10,000 because 1% = 1/100, and 1 ppm = 1/1,000,000. The ratio is 1,000,000/100 = 10,000.</p>
<p>Quick reference: 1% = 10,000 ppm. 0.1% = 1,000 ppm. 0.01% = 100 ppm. 0.001% = 10 ppm.</p>
<p>Use our <a href="/chemistry-calculators/ppm-to-percent-converter">PPM to percent converter</a> for the reverse conversion, or our <a href="/chemistry-calculators/ppm-converter">universal PPM converter</a> for other unit conversions.</p>` },
    },

    "percent-yield-calculator": {
        subtitle: "Calculate percent yield from actual and theoretical yield. A key metric for evaluating reaction efficiency.",
        explanation: { heading: "How to Calculate Percent Yield", contentHTML: `<h2>What Is Percent Yield?</h2>
<p>Percent yield measures how efficient a chemical reaction is by comparing the amount of product actually obtained (actual yield) to the maximum amount that could theoretically be produced (<a href="/chemistry-calculators/theoretical-yield-calculator">theoretical yield</a>). A yield of 100% would mean every atom of reactant was converted to product with no losses.</p>

<h2>How to Calculate Percent Yield</h2>

<h3>Percent Yield Formula</h3>
<div class="explanation__highlight"><strong>% Yield = (Actual Yield / Theoretical Yield) × 100</strong></div>
<p>In practice, percent yields are always less than 100% due to:</p>
<ul><li>Incomplete reactions (equilibrium)</li><li>Side reactions producing unwanted products</li><li>Loss during transfer, filtration, or purification</li><li>Impure reactants</li></ul>

<h2>Typical Yields by Reaction Type</h2>
<p>Simple precipitation reactions typically achieve 90–99% yield. Organic synthesis reactions vary widely from 60–90%. Pharmaceutical manufacturing usually targets 80–95%. Multi-step synthesis yields are multiplicative — if each of 5 steps has 90% yield, the overall yield is 0.9⁵ = 59%.</p>`, highlight: "Typical lab yields: organic synthesis 60-90%, pharmaceutical manufacturing 80-95%, simple precipitation reactions 90-99%." },
    },

    "ph-calculator": {
        subtitle: "Calculate pH from hydrogen ion concentration or vice versa. See pOH, [H⁺], and [OH⁻] values with a reference table of common substances.",
        explanation: { heading: "How to Calculate pH", contentHTML: `<h2>What Is pH?</h2>
<p>pH is a logarithmic scale used to measure the acidity or basicity (alkalinity) of a solution. The scale runs from 0 (most acidic) to 14 (most basic), with 7 being neutral (pure water). Each unit on the pH scale represents a <strong>10-fold change</strong> in hydrogen ion concentration.</p>
<p>This means stomach acid at pH 1 is 1,000,000 times more acidic than pure water at pH 7. Understanding pH is essential in chemistry, biology, environmental science, and many industrial applications.</p>

<h2>How to Calculate pH</h2>

<h3>pH Formulas</h3>
<div class="explanation__highlight"><strong>pH = −log₁₀[H⁺]</strong><br/><strong>[H⁺] = 10^(−pH)</strong><br/><br/>pH + pOH = 14 (at 25°C)<br/>[H⁺] × [OH⁻] = 10⁻¹⁴ (Kw at 25°C)</div>
<p>For example, if [H⁺] = 0.001 M = 10⁻³ M, then pH = −log₁₀(10⁻³) = <strong>3</strong>. Conversely, if pH = 5, then [H⁺] = 10⁻⁵ = 0.00001 M.</p>

<h2>pH of Common Substances</h2>
<p>Battery acid: pH ≈ 0. Stomach acid: pH ≈ 1.5–3.5. Lemon juice: pH ≈ 2. Vinegar: pH ≈ 3. Coffee: pH ≈ 5. Pure water: pH = 7. Baking soda: pH ≈ 9. Bleach: pH ≈ 12.5. Drain cleaner: pH ≈ 14.</p>`, highlight: "Each pH unit = 10× change in [H⁺]. Stomach acid (pH 1) is 1,000,000× more acidic than pure water (pH 7)." },
        faq: [
            { question: "Can pH be below 0 or above 14?", answer: "Yes. Concentrated strong acids can have pH below 0. For example, 10 M HCl has [H⁺] = 10 M, giving pH = −1. Similarly, very concentrated strong bases can have pH above 14." },
            { question: "Is rain water acidic?", answer: "Normal rain has pH ≈ 5.6 (slightly acidic due to dissolved CO₂ forming carbonic acid). 'Acid rain' has pH below 5.0, typically caused by SO₂ and NOₓ emissions from burning fossil fuels." },
        ],
    },

    "ppb-to-ppm-converter": {
        subtitle: "Convert parts per billion (ppb) to parts per million (ppm). 1,000 ppb = 1 ppm.",
        explanation: { heading: "How to Convert PPB to PPM", contentHTML: `<h2>What Is PPB?</h2>
<p>Parts per billion (ppb) is a unit used to express extremely small concentrations — one part per one billion parts of the total. It is commonly used for measuring trace contaminants in drinking water, air pollutants, and environmental samples where even minute quantities can have significant effects.</p>

<h2>How to Convert PPB to PPM</h2>

<h3>PPB to PPM Formula</h3>
<div class="explanation__highlight"><strong>ppm = ppb / 1,000</strong></div>
<p>Since 1 ppm = 1,000 ppb, dividing ppb by 1,000 gives the equivalent value in <a href="/chemistry-calculators/ppm-calculator">ppm</a>.</p>

<h2>EPA Drinking Water Standards</h2>
<p>The EPA sets maximum contaminant levels for drinking water in ppb: lead is 15 ppb (0.015 ppm), arsenic is 10 ppb (0.010 ppm), and mercury is 2 ppb (0.002 ppm). Use our <a href="/chemistry-calculators/ppm-to-ppb-converter">PPM to PPB converter</a> for the reverse conversion.</p>` },
    },

    "ppm-calculator": {
        subtitle: "Calculate parts per million (ppm) from a part-to-whole ratio. ppm = (part / whole) × 1,000,000.",
        explanation: { heading: "How to Calculate PPM", contentHTML: `<h2>What Is PPM?</h2>
<p>Parts per million (ppm) is a way of expressing very small concentrations or proportions. It describes the number of units of a substance per one million units of the total. Think of it as "for every million parts, how many are the substance of interest?"</p>

<h2>How to Calculate PPM</h2>

<h3>PPM Formula</h3>
<div class="explanation__highlight"><strong>ppm = (part / whole) × 1,000,000</strong></div>
<p>For example, if a water sample weighing 1 kg contains 5 mg of chlorine: ppm = (5 mg / 1,000,000 mg) × 1,000,000 = <strong>5 ppm</strong>.</p>

<h2>Where PPM Is Used</h2>
<p>PPM is widely used in water quality testing, air pollution monitoring, food safety, manufacturing tolerances, and chemical analysis. For aqueous solutions, 1 ppm ≈ 1 <a href="/chemistry-calculators/mgl-to-ppm-converter">mg/L</a>. Convert to other units using our <a href="/chemistry-calculators/ppm-converter">universal PPM converter</a>, <a href="/chemistry-calculators/ppm-to-percent-converter">PPM to percent</a>, or <a href="/chemistry-calculators/ppm-to-ppb-converter">PPM to PPB</a> tools.</p>` },
    },

    "ppm-converter": {
        subtitle: "Universal PPM converter — convert between ppm, percent, ppb, and mg/L in one tool. Quick reference table included.",
        explanation: { heading: "PPM Conversion Reference", contentHTML: `<h2>PPM Conversion Relationships</h2>
<p>Parts per million (ppm) is a versatile unit that can be converted to and from several related units. Below are the key relationships:</p>
<div class="explanation__highlight"><strong>1% = 10,000 ppm = 10,000,000 ppb</strong><br/><strong>1 ppm = 0.0001% = 1,000 ppb = 1 mg/L (water)</strong><br/><strong>1 ppb = 0.001 ppm = 0.0000001%</strong></div>

<h2>When to Use Each Unit</h2>
<p>Use <a href="/chemistry-calculators/ppm-to-percent-converter">percent</a> for concentrations above 1% (10,000 ppm). Use <a href="/chemistry-calculators/ppm-calculator">ppm</a> for trace-level concentrations (1–10,000 ppm). Use <a href="/chemistry-calculators/ppb-to-ppm-converter">ppb</a> for ultra-trace levels below 1 ppm. For water chemistry, <a href="/chemistry-calculators/mgl-to-ppm-converter">mg/L</a> and ppm are interchangeable for dilute solutions.</p>` },
    },

    "ppm-to-mgl-converter": {
        subtitle: "Convert parts per million (ppm) to milligrams per liter (mg/L). For water: 1 ppm = 1 mg/L.",
        explanation: { heading: "How to Convert PPM to mg/L", contentHTML: `<h2>PPM to mg/L Conversion</h2>
<p>For dilute aqueous solutions at standard conditions, parts per million and milligrams per liter are numerically equivalent:</p>
<div class="explanation__highlight"><strong>1 ppm = 1 mg/L</strong></div>
<p>This equality holds because 1 liter of water has a mass of approximately 1,000,000 mg. Therefore, 1 mg dissolved in 1 liter of water is 1 part per 1,000,000 parts = 1 ppm.</p>

<h2>Density Corrections</h2>
<p>For non-aqueous solutions or highly concentrated solutions where the density differs significantly from 1 g/mL, the conversion requires a density correction factor: mg/L = ppm × density (g/mL). Use our <a href="/chemistry-calculators/mgl-to-ppm-converter">mg/L to PPM converter</a> for the reverse conversion.</p>` },
    },

    "ppm-to-percent-converter": {
        subtitle: "Convert parts per million (ppm) to percentage. 10,000 ppm = 1%.",
        explanation: { heading: "How to Convert PPM to Percent", contentHTML: `<h2>PPM to Percent Conversion</h2>

<h3>PPM to Percent Formula</h3>
<div class="explanation__highlight"><strong>% = ppm / 10,000</strong></div>
<p>Since 1% represents 10,000 parts per million, you divide the ppm value by 10,000 to get the equivalent percentage.</p>
<p>Quick reference: 10,000 ppm = 1%. 1,000 ppm = 0.1%. 100 ppm = 0.01%. 1 ppm = 0.0001%.</p>
<p>Use our <a href="/chemistry-calculators/percent-to-ppm-converter">percent to PPM converter</a> for the reverse conversion, or our <a href="/chemistry-calculators/ppm-converter">universal PPM converter</a> for converting to other units.</p>` },
    },

    "ppm-to-ppb-converter": {
        subtitle: "Convert parts per million (ppm) to parts per billion (ppb). 1 ppm = 1,000 ppb.",
        explanation: { heading: "How to Convert PPM to PPB", contentHTML: `<h2>PPM to PPB Conversion</h2>

<h3>PPM to PPB Formula</h3>
<div class="explanation__highlight"><strong>ppb = ppm × 1,000</strong></div>
<p>Since 1 ppm equals 1,000 ppb, simply multiply by 1,000 to convert. Conversely, 0.001 ppm = 1 ppb.</p>

<h2>When to Use PPB vs. PPM</h2>
<p>PPB is used when dealing with extremely low concentrations, such as trace contaminants in drinking water or air pollutants. For example, the EPA limit for lead in drinking water is 15 <a href="/chemistry-calculators/ppb-to-ppm-converter">ppb</a> (0.015 ppm). Use our <a href="/chemistry-calculators/ppb-to-ppm-converter">PPB to PPM converter</a> for the reverse conversion.</p>` },
    },

    "theoretical-yield-calculator": {
        subtitle: "Calculate theoretical yield from reactant mass, molar masses, and stoichiometric ratio. Find the maximum possible product.",
        explanation: { heading: "How to Calculate Theoretical Yield", contentHTML: `<h2>What Is Theoretical Yield?</h2>
<p>Theoretical yield is the maximum amount of product that could theoretically be produced from a given amount of reactant, assuming the reaction goes to completion with no losses. It is calculated using the balanced chemical equation and stoichiometric ratios.</p>
<p>In practice, the actual yield is always less than the theoretical yield. The ratio of actual to theoretical yield gives the <a href="/chemistry-calculators/percent-yield-calculator">percent yield</a>, which measures how efficient the reaction was.</p>

<h2>How to Calculate Theoretical Yield</h2>

<h3>Step-by-Step Method</h3>
<div class="explanation__highlight"><strong>Step 1:</strong> Convert mass of reactant to moles: n = m / M<br/><strong>Step 2:</strong> Apply stoichiometric ratio from balanced equation<br/><strong>Step 3:</strong> Convert moles of product to mass: theoretical yield = n_product × M_product</div>

<h3>Worked Example</h3>
<p>For the reaction 2H₂ + O₂ → 2H₂O, starting with 10 g of H₂:</p>
<p>Step 1: n(H₂) = 10 / 2.016 = 4.96 mol<br/>Step 2: Ratio is 2:2 (1:1), so n(H₂O) = 4.96 mol<br/>Step 3: Theoretical yield = 4.96 × 18.015 = <strong>89.4 g H₂O</strong></p>
<p>If the actual yield was 80 g, the <a href="/chemistry-calculators/percent-yield-calculator">percent yield</a> would be (80/89.4) × 100 = 89.5%. You can use our <a href="/chemistry-calculators/grams-to-moles-calculator">grams to moles calculator</a> and <a href="/chemistry-calculators/molar-mass-calculator">molar mass calculator</a> for the individual conversion steps.</p>`, highlight: "Theoretical yield is the maximum possible product from a reaction. Actual yield is always less. Percent yield = (actual / theoretical) × 100%." },
    },
};

export default async function ChemistryCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("chemistry").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/chemistry-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Chemistry Calculators", url: canonicalUrl("/chemistry-calculators") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl)]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-chemistry-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Chemistry Calculators", href: "/chemistry-calculators" }, { label: calc.title.replace(/ Calculator.*$/, "").replace(/ Converter.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <AuthorBadge categoryKey="chemistry" />
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <ChemistryCalculatorCore calcType={calc.calcType || "mole"} />
                    {content && (<>
                        <DynamicExplanation heading={content.explanation?.heading} paragraphs={content.explanation?.paragraphs} contentHTML={content.explanation?.contentHTML} highlight={content.explanation?.highlight} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar"><TrendingCalculations variant="sidebar" /></aside>
            </div>
        </main>
    );
}
