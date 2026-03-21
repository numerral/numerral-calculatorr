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
        explanation: { heading: "How to Convert Atoms to Moles", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>n = atoms / Nₐ</strong><br/><br/>Where n = moles, Nₐ = Avogadro's number = 6.022 × 10²³ atoms/mol.</div>
<p>Avogadro's number connects the atomic scale to the macroscopic scale. 1 mole of any substance contains exactly 6.02214076 × 10²³ particles (atoms, molecules, or ions).</p>`, highlight: "6.022 × 10²³ atoms = 1 mole. This is true for any element or compound." },
    },

    "grams-to-moles-calculator": {
        subtitle: "Convert grams to moles using molar mass. Enter mass in grams and molar mass (g/mol) to find the number of moles.",
        explanation: { heading: "How to Convert Grams to Moles", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>n = m / M</strong><br/><br/>Where n = moles, m = mass (grams), M = molar mass (g/mol).</div>
<p>The molar mass of a substance equals the sum of atomic masses of all atoms in its formula. Water (H₂O): 2(1.008) + 15.999 = 18.015 g/mol. 18.015 g of water = exactly 1 mole = 6.022 × 10²³ molecules.</p>`, highlight: "18 grams of water = 1 mole = 6.022 × 10²³ molecules. Use the periodic table to find molar mass." },
        faq: [
            { question: "How do I find the molar mass?", answer: "Add up the atomic masses (from the periodic table) of all atoms in the formula. For NaCl: Na (22.99) + Cl (35.45) = 58.44 g/mol. For glucose C₆H₁₂O₆: 6(12.01) + 12(1.008) + 6(16.00) = 180.16 g/mol." },
        ],
    },

    "half-life-calculator": {
        subtitle: "Calculate radioactive decay or any exponential half-life process. Enter initial quantity, half-life, and elapsed time.",
        explanation: { heading: "How to Calculate Half-Life", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>N = N₀ × (½)^(t/t½)</strong><br/><br/>Where N = remaining quantity, N₀ = initial quantity, t = elapsed time, t½ = half-life.</div>
<p>Half-life is the time for half of a substance to decay or react. After 1 half-life: 50% remains. After 2: 25%. After 3: 12.5%. After 10 half-lives, only 0.098% remains.</p>
<h3>Common Half-Lives</h3><table><thead><tr><th>Isotope</th><th>Half-Life</th><th>Use</th></tr></thead><tbody>
<tr><td>Carbon-14</td><td>5,730 years</td><td>Radiocarbon dating</td></tr>
<tr><td>Uranium-238</td><td>4.5 billion years</td><td>Geological dating</td></tr>
<tr><td>Iodine-131</td><td>8 days</td><td>Medical imaging</td></tr>
<tr><td>Radon-222</td><td>3.8 days</td><td>Home testing</td></tr>
</tbody></table>`, highlight: "Carbon-14 has a half-life of 5,730 years. After 2 half-lives (11,460 years), only 25% of the original C-14 remains." },
    },

    "liters-to-moles-calculator": {
        subtitle: "Convert liters of gas to moles using the ideal gas law (PV = nRT) or STP conditions (22.414 L/mol).",
        explanation: { heading: "How to Convert Liters to Moles", contentHTML: `<h3>Formulas</h3><div class="explanation__highlight"><strong>At STP:</strong> n = V / 22.414<br/><strong>Ideal Gas Law:</strong> n = PV / RT<br/><br/>STP = 0°C (273.15 K), 1 atm. R = 0.08206 L⋅atm/(mol⋅K).</div>
<p>At Standard Temperature and Pressure (STP), one mole of any ideal gas occupies 22.414 liters. This is the molar volume — it's the same regardless of which gas, because at low pressures, gas behavior depends only on the number of molecules, not their identity.</p>` },
    },

    "mgl-to-ppm-converter": {
        subtitle: "Convert milligrams per liter (mg/L) to parts per million (ppm). For dilute aqueous solutions, 1 mg/L ≈ 1 ppm.",
        explanation: { heading: "How to Convert mg/L to PPM", contentHTML: `<div class="explanation__highlight"><strong>1 mg/L ≈ 1 ppm</strong> (for dilute aqueous solutions where density ≈ 1 g/mL)</div>
<p>In water chemistry, mg/L and ppm are essentially interchangeable for dilute solutions. This is because 1 liter of water weighs approximately 1,000,000 mg, so 1 mg in 1 L = 1 part per million.</p>` },
    },

    "molality-calculator": {
        subtitle: "Calculate molality (moles of solute per kilogram of solvent). Unlike molarity, molality is independent of temperature.",
        explanation: { heading: "How to Calculate Molality", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>m = mol_solute / kg_solvent</strong><br/><br/>Molality uses mass of solvent (not volume of solution), making it temperature-independent.</div>
<p>Molality is preferred over molarity in colligative property calculations (boiling point elevation, freezing point depression, vapor pressure lowering) because mass doesn't change with temperature, while volume does.</p>` },
    },

    "molar-mass-calculator": {
        subtitle: "Calculate molar mass from mass and moles using M = m/n. Includes a reference table of common molar masses.",
        explanation: { heading: "How to Calculate Molar Mass", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>M = m / n</strong><br/><br/>Where M = molar mass (g/mol), m = mass (g), n = moles.</div>
<p>Molar mass is the mass of one mole of a substance. It numerically equals the formula weight in atomic mass units (amu). Each element's molar mass comes from the periodic table.</p>` },
    },

    "molarity-calculator": {
        subtitle: "Calculate molarity (M) — moles of solute per liter of solution. The most common concentration unit in chemistry.",
        explanation: { heading: "How to Calculate Molarity", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>M = n / V</strong><br/><br/>Where M = molarity (mol/L), n = moles of solute, V = volume of solution (liters).</div>
<p>Molarity is the standard concentration unit in chemistry. A "1 M NaCl solution" means 1 mole of NaCl (58.44 g) dissolved in enough water to make 1 liter of total solution.</p>
<h3>Dilution Formula</h3><div class="explanation__highlight"><strong>M₁V₁ = M₂V₂</strong><br/><br/>This is used to calculate how to dilute a concentrated solution. Example: How much 12 M HCl to make 500 mL of 1 M HCl? V₁ = (1 × 0.5) / 12 = 41.7 mL.</div>`, highlight: "1 M NaCl = 58.44 g NaCl per liter of solution. Use M₁V₁ = M₂V₂ for dilution calculations." },
        faq: [
            { question: "What is the difference between molarity and molality?", answer: "Molarity (M) = mol/L of solution. Molality (m) = mol/kg of solvent. Key differences: molarity depends on volume (changes with temperature); molality depends on mass (constant with temperature). For dilute aqueous solutions, they're approximately equal." },
        ],
    },

    "mole-calculator": {
        subtitle: "Universal mole converter — convert between grams, atoms/molecules, and liters (at STP) using Avogadro's number and molar mass.",
        explanation: { heading: "How to Use the Mole Calculator", contentHTML: `<h3>The Mole: Central Concept of Chemistry</h3><div class="explanation__highlight"><strong>Key relationships:</strong><br/>• 1 mole = 6.022 × 10²³ particles<br/>• 1 mole = molar mass in grams<br/>• 1 mole of gas = 22.414 L at STP</div>
<p>The mole is the SI unit for "amount of substance." It connects three scales: counting (atoms), weighing (grams), and measuring gas volume (liters).</p>` },
    },

    "mole-fraction-calculator": {
        subtitle: "Calculate mole fraction (χ) for a two-component mixture. Mole fractions always sum to 1.",
        explanation: { heading: "How to Calculate Mole Fraction", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>χᵢ = nᵢ / n_total</strong><br/><br/>Where χᵢ = mole fraction of component i, nᵢ = moles of i, n_total = total moles of all components.<br/><br/>Key property: χ₁ + χ₂ + ... = 1 (always sums to 1)</div>
<p>Mole fraction is a dimensionless quantity used in Raoult's Law (vapor pressure), Dalton's Law (partial pressures), and colligative properties.</p>` },
    },

    "percent-to-ppm-converter": {
        subtitle: "Convert percentage to parts per million (ppm). 1% = 10,000 ppm.",
        explanation: { heading: "How to Convert Percent to PPM", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>ppm = % × 10,000</strong><br/><br/>1% = 10,000 ppm<br/>0.1% = 1,000 ppm<br/>0.01% = 100 ppm<br/>0.001% = 10 ppm</div>` },
    },

    "percent-yield-calculator": {
        subtitle: "Calculate percent yield from actual and theoretical yield. A key metric for evaluating reaction efficiency.",
        explanation: { heading: "How to Calculate Percent Yield", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>% Yield = (Actual Yield / Theoretical Yield) × 100</strong></div>
<p>Percent yield measures how efficient a reaction is. 100% yield is theoretically perfect — all reactant converts to product. In practice, yields are always below 100% due to:</p>
<ul><li>Incomplete reactions (equilibrium)</li><li>Side reactions producing unwanted products</li><li>Loss during transfer, filtration, or purification</li><li>Impure reactants</li></ul>`, highlight: "Typical lab yields: organic synthesis 60-90%, pharmaceutical manufacturing 80-95%, simple precipitation reactions 90-99%." },
    },

    "ph-calculator": {
        subtitle: "Calculate pH from hydrogen ion concentration or vice versa. See pOH, [H⁺], and [OH⁻] values with a reference table of common substances.",
        explanation: { heading: "How to Calculate pH", contentHTML: `<h3>Formulas</h3><div class="explanation__highlight"><strong>pH = −log₁₀[H⁺]</strong><br/><strong>[H⁺] = 10^(−pH)</strong><br/><br/>pH + pOH = 14 (at 25°C)<br/>[H⁺] × [OH⁻] = 10⁻¹⁴ (Kw at 25°C)</div>
<p>The pH scale runs from 0 (most acidic) to 14 (most basic), with 7 being neutral. Each unit represents a <strong>10-fold change</strong> in hydrogen ion concentration: pH 3 is 10× more acidic than pH 4, and 100× more acidic than pH 5.</p>`, highlight: "Each pH unit = 10× change. Stomach acid (pH 1) is 1,000,000× more acidic than pure water (pH 7)." },
        faq: [
            { question: "Can pH be below 0 or above 14?", answer: "Yes! Concentrated strong acids can have pH < 0. For example, 10 M HCl has [H⁺] = 10, giving pH = -1. Similarly, very concentrated strong bases can have pH > 14." },
            { question: "Is rain water acidic?", answer: "Normal rain has pH ≈ 5.6 (slightly acidic due to dissolved CO₂ forming carbonic acid). 'Acid rain' has pH < 5.0, typically caused by SO₂ and NOₓ emissions." },
        ],
    },

    "ppb-to-ppm-converter": {
        subtitle: "Convert parts per billion (ppb) to parts per million (ppm). 1,000 ppb = 1 ppm.",
        explanation: { heading: "How to Convert PPB to PPM", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>ppm = ppb / 1,000</strong><br/><br/>1 ppm = 1,000 ppb<br/>1 ppb = 0.001 ppm</div>
<p>Parts per billion is used for trace contaminants in water and air. The EPA drinking water standard for lead is 15 ppb (0.015 ppm). For arsenic, it's 10 ppb (0.010 ppm).</p>` },
    },

    "ppm-calculator": {
        subtitle: "Calculate parts per million (ppm) from a part-to-whole ratio. ppm = (part / whole) × 1,000,000.",
        explanation: { heading: "How to Calculate PPM", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>ppm = (part / whole) × 1,000,000</strong></div>
<p>PPM expresses very small concentrations. Think of it as "for every million parts, how many are the substance of interest?" It's widely used in water quality, air quality, manufacturing tolerances, and food safety.</p>` },
    },

    "ppm-converter": {
        subtitle: "Universal PPM converter — convert between ppm, percent, ppb, and mg/L in one tool. Quick reference table included.",
        explanation: { heading: "PPM Conversion Reference", contentHTML: `<h3>Conversion Relationships</h3><div class="explanation__highlight"><strong>1% = 10,000 ppm = 10,000,000 ppb</strong><br/><strong>1 ppm = 0.0001% = 1,000 ppb = 1 mg/L (water)</strong><br/><strong>1 ppb = 0.001 ppm = 0.0000001%</strong></div>` },
    },

    "ppm-to-mgl-converter": {
        subtitle: "Convert parts per million (ppm) to milligrams per liter (mg/L). For water: 1 ppm = 1 mg/L.",
        explanation: { heading: "How to Convert PPM to mg/L", contentHTML: `<div class="explanation__highlight"><strong>1 ppm = 1 mg/L</strong> (for dilute aqueous solutions at standard conditions)</div>
<p>This equality holds because 1 liter of water has a mass of ~1,000,000 mg. Therefore, 1 mg in 1 L = 1 part per 1,000,000 = 1 ppm. For non-aqueous solutions or at high concentrations, density corrections are needed.</p>` },
    },

    "ppm-to-percent-converter": {
        subtitle: "Convert parts per million (ppm) to percentage. 10,000 ppm = 1%.",
        explanation: { heading: "How to Convert PPM to Percent", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>% = ppm / 10,000</strong><br/><br/>10,000 ppm = 1%<br/>1 ppm = 0.0001%</div>` },
    },

    "ppm-to-ppb-converter": {
        subtitle: "Convert parts per million (ppm) to parts per billion (ppb). 1 ppm = 1,000 ppb.",
        explanation: { heading: "How to Convert PPM to PPB", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>ppb = ppm × 1,000</strong><br/><br/>1 ppm = 1,000 ppb<br/>0.001 ppm = 1 ppb</div>` },
    },

    "theoretical-yield-calculator": {
        subtitle: "Calculate theoretical yield from reactant mass, molar masses, and stoichiometric ratio. Find the maximum possible product.",
        explanation: { heading: "How to Calculate Theoretical Yield", contentHTML: `<h3>Steps</h3><div class="explanation__highlight"><strong>1.</strong> Convert mass of reactant to moles: n = m / M<br/><strong>2.</strong> Apply stoichiometric ratio: moles product = moles reactant × ratio<br/><strong>3.</strong> Convert to mass: theoretical yield = moles product × M_product</div>
<p>Theoretical yield is the <strong>maximum</strong> amount of product that can form from a given amount of reactant, assuming complete reaction with no losses. It's calculated from balanced equation stoichiometry.</p>
<h3>Example</h3><div class="explanation__highlight">2H₂ + O₂ → 2H₂O<br/>10 g of H₂ (M = 2.016 g/mol) → 4.96 mol H₂<br/>Ratio: 2 mol H₂O per 2 mol H₂ = 1:1<br/>Theoretical yield: 4.96 × 18.015 = <strong>89.4 g H₂O</strong></div>`, highlight: "Theoretical yield is the maximum possible product from a reaction. Actual yield is always less. Percent yield = (actual / theoretical) × 100%." },
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
