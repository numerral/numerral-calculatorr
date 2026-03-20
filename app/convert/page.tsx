// Conversion Calculators Category Page — /convert/
import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CategoryGrid from "@/components/shared/CategoryGrid";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import ConvertPageClient from "@/components/convert/ConvertPageClient";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Unit Conversion Calculators — Volume, Weight, Temperature, Length & More",
    description:
        "Free unit conversion calculators for volume, weight, temperature, length, area, speed, time, energy, electrical resistance, fuel economy, and angle. Convert mL to grams, Fahrenheit to Celsius, inches to cm, kΩ to Ω, and more.",
    alternates: { canonical: canonicalUrl("/convert") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Unit Conversion Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Unit Conversion Calculators",
        description:
            "Unit conversion tools for cooking and baking (mL to grams, cups to grams), weight and mass (stones to kilograms), temperature (Fahrenheit to Celsius, Celsius to Kelvin), length and area (inches to centimeters, square meters to square feet), speed (mph to km/h), time (seconds to minutes), electrical resistance (kiloohms to ohms), energy (MWh to kWh), fuel economy (MPG to L/100km), and angle (degrees to radians).",
        url: canonicalUrl("/convert"),
    },
]);

/* ── Rich semantic content for the explanation section ── */
const CONTENT_HTML = `
<h3>What Is Unit Conversion?</h3>
<p>Unit conversion is the process of changing a measurement from one unit to another while preserving the same quantity. Every conversion relies on a <strong>conversion factor</strong> — a fixed ratio between two units. For example, 1 inch equals exactly 2.54 centimeters, and 1 kilogram equals 2.20462 pounds.</p>

<h3>Conversion Types Covered</h3>
<p>Our conversion calculators span 10 measurement categories:</p>
<ul>
  <li><strong>Volume to Weight (Cooking &amp; Baking)</strong> — Convert milliliters to grams, cups to grams, tablespoons to grams, and more. These conversions require the <strong>density</strong> of the ingredient because volume and mass are different physical quantities. 1 mL of water weighs 1 gram, but 1 mL of honey weighs 1.42 grams.</li>
  <li><strong>Weight &amp; Mass</strong> — Convert between metric and imperial mass units: kilograms to stones and pounds, milligrams to milliliters (density-dependent), and calories to kilograms (energy-mass equivalence for dietary tracking).</li>
  <li><strong>Volume &amp; Liquid</strong> — Convert liters to kilograms, grams to liters, and cubic centimeters to cubic meters. These conversions use substance density for accuracy.</li>
  <li><strong>Length &amp; Area</strong> — Convert inches to centimeters (1 in = 2.54 cm), inches to feet, square meters to square feet (1 m² = 10.7639 ft²), and inch-pounds to foot-pounds for torque.</li>
  <li><strong>Temperature</strong> — Convert Fahrenheit to Celsius (°F to °C), Celsius to Fahrenheit (°C to °F), Fahrenheit to Kelvin (°F to K), and Celsius to Kelvin (°C to K). The Fahrenheit-Celsius formula is: °C = (°F − 32) × 5/9.</li>
  <li><strong>Time</strong> — Convert minutes to hours, seconds to minutes, and days to months. Time conversions use fixed ratios: 60 seconds = 1 minute, 60 minutes = 1 hour.</li>
  <li><strong>Speed &amp; Motion</strong> — Convert miles per hour to kilometers per hour (1 mph = 1.60934 km/h) and RPM to radians per second.</li>
  <li><strong>Electrical &amp; Energy</strong> — Convert kiloohms to ohms (1 kΩ = 1,000 Ω), megaohms to ohms, megawatt hours to kilowatt hours, million BTU to megawatt hours, and kilocalories to calories.</li>
  <li><strong>Fuel Economy</strong> — Convert between miles per gallon (MPG) and liters per 100 kilometers (L/100km), and between kilometers per liter (km/L) and MPG. These are reciprocal conversions used in US and metric automotive standards.</li>
  <li><strong>Angle</strong> — Convert degrees to radians (1° = π/180 rad ≈ 0.01745 rad), radians to degrees, degrees to milliradians, and milliradians to degrees. Used in trigonometry, navigation, and ballistics.</li>
</ul>

<h3>How Unit Conversions Work</h3>
<p>Most unit conversions follow a straightforward formula: <strong>result = input × conversion factor</strong>. For example, to convert 12 inches to centimeters: 12 × 2.54 = 30.48 cm. Temperature conversions are different — they use offset formulas because the Fahrenheit, Celsius, and Kelvin scales have different zero points.</p>
<p>Volume-to-weight conversions (like mL to grams) are unique because they require knowing the <strong>density</strong> of the specific substance. The formula is: <strong>mass = volume × density</strong>. Our cooking and baking converters include 20 preset ingredient densities — from water (1.0 g/mL) and milk (1.03 g/mL) to flour (0.53 g/mL), sugar (0.85 g/mL), honey (1.42 g/mL), and olive oil (0.92 g/mL).</p>

<h3>The Metric System vs. Imperial System</h3>
<p>The <strong>International System of Units (SI)</strong> — commonly called the metric system — is used in most countries worldwide. It is based on seven base units: meter (length), kilogram (mass), second (time), ampere (electric current), kelvin (temperature), mole (amount of substance), and candela (luminous intensity). The United States, Liberia, and Myanmar still primarily use the <strong>imperial system</strong> (or US customary units) for everyday measurements, using inches, feet, pounds, and Fahrenheit.</p>
<p>This difference is the main reason conversion calculators are essential — whether you're following a European recipe that lists ingredients in grams, reading a scientific paper with SI units, or comparing fuel efficiency between an American car rated in MPG and a European car rated in L/100km.</p>
`;

export default function ConvertPage() {
    const converters = getCalculatorsByCategory("convert");

    // Pass serializable data to the client component
    const clientConverters = converters.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        icon: c.icon,
        description: c.description,
        calcType: c.calcType,
    }));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-convert-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Unit Conversion Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)", textAlign: "center" }}>
                Unit Conversion Calculators
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)", maxWidth: "680px", marginInline: "auto", textAlign: "center" }}>
                Convert between units of volume, weight, temperature, length, area, speed, time,
                energy, electrical resistance, fuel economy, and angle.
                Search or browse by category to find the exact converter you need.
            </p>

            {/* Client-side interactive section */}
            <ConvertPageClient converters={clientConverters} />

            <DynamicExplanation
                heading="About Unit Conversion"
                contentHTML={CONTENT_HTML}
            />

            <FAQAccordion
                title="Unit Conversion FAQ"
                items={[
                    {
                        question: "Is 1 mL the same as 1 gram?",
                        answer: "Only for water at 4 °C, where its density is exactly 1.0 g/mL. For every other substance, the weight of 1 mL depends on its density. For example, 1 mL of honey weighs 1.42 grams, 1 mL of olive oil weighs 0.92 grams, and 1 mL of flour weighs approximately 0.53 grams. This is why volume-to-weight conversions always require knowing the substance's density.",
                    },
                    {
                        question: "What is the formula to convert Fahrenheit to Celsius?",
                        answer: "The formula is: °C = (°F − 32) × 5/9. For example, 72 °F = (72 − 32) × 5/9 = 22.22 °C. To convert Celsius to Fahrenheit, use: °F = (°C × 9/5) + 32. The Fahrenheit and Celsius scales intersect at −40° — that is, −40 °F = −40 °C.",
                    },
                    {
                        question: "How many centimeters are in an inch?",
                        answer: "1 inch equals exactly 2.54 centimeters. This is a defined conversion factor — it is exact, not an approximation. So 12 inches (1 foot) = 30.48 cm, and 1 meter = 39.3701 inches.",
                    },
                    {
                        question: "What is the difference between the metric system and the imperial system?",
                        answer: "The metric system (SI) uses meters, kilograms, and Celsius as its base units for length, mass, and temperature. The imperial system uses inches/feet/miles, pounds/ounces, and Fahrenheit. The metric system is decimal-based (multiples of 10), making arithmetic simpler. Nearly every country uses the metric system; the United States, Liberia, and Myanmar are the main exceptions for everyday measurements.",
                    },
                    {
                        question: "How do I convert miles per gallon (MPG) to liters per 100 kilometers (L/100km)?",
                        answer: "The formula is: L/100km = 235.215 ÷ MPG. For example, a car rated at 30 MPG = 235.215 ÷ 30 = 7.84 L/100km. These two units have an inverse relationship — higher MPG means lower L/100km. The US and UK use MPG, while most of Europe and Asia use L/100km.",
                    },
                    {
                        question: "How do I convert degrees to radians?",
                        answer: "The formula is: radians = degrees × π/180. For example, 90° = 90 × π/180 = π/2 ≈ 1.5708 radians. A full circle is 360° = 2π radians. Radians are the SI unit for angle measurement and are used in trigonometry, calculus, and physics.",
                    },
                    {
                        question: "What is electrical resistance and how do I convert between ohms, kiloohms, and megaohms?",
                        answer: "Electrical resistance (measured in ohms, Ω) describes how much a material opposes the flow of electric current. The SI prefixes are standard: 1 kiloohm (kΩ) = 1,000 ohms, and 1 megaohm (MΩ) = 1,000,000 ohms. These conversions are straightforward multiplications by powers of 10.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["convert"]} />
            </section>
        </main>
    );
}
