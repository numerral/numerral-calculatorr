// Dynamic Hub — /electrical-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import ElectricalCalculatorCore from "@/components/calculator/ElectricalCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("electrical").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("electrical").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/electrical-calculators/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; explanation?: { heading: string; paragraphs?: string[]; contentHTML?: string; highlight?: string }; faq?: { question: string; answer: string }[] }> = {
    "amps-to-watts-calculator": {
        subtitle: "Convert amps to watts for DC, single-phase AC, and three-phase AC circuits. Enter the current in amps and voltage to calculate power in watts using Watt's Law. Default values use US standard 120V AC.",
        explanation: { heading: "How to Convert Amps to Watts", contentHTML: `<p>Converting amps to watts requires knowing both the <strong>current (amps)</strong> and the <strong>voltage (volts)</strong> of the circuit. The relationship between these electrical quantities is defined by <strong>Watt's Law</strong>, one of the fundamental equations in electrical engineering.</p>

<h3>Amps to Watts Formula</h3>
<p>The formula depends on the type of circuit:</p>
<div class="explanation__highlight">
<strong>DC Circuit:</strong> P = I × V<br/>
<strong>Single-Phase AC:</strong> P = I × V × PF<br/>
<strong>Three-Phase AC:</strong> P = I × V × PF × √3<br/><br/>
Where:<br/>
P = Power in watts (W)<br/>
I = Current in amps (A)<br/>
V = Voltage in volts (V)<br/>
PF = Power factor (0–1, AC only)
</div>

<h3>How Many Watts Are in an Amp?</h3>
<p>The number of watts per amp depends entirely on voltage. In US residential circuits:</p>
<ul>
<li><strong>At 120V (standard outlet):</strong> 1 amp = 120 watts</li>
<li><strong>At 240V (large appliance):</strong> 1 amp = 240 watts</li>
<li><strong>At 12V DC (automotive/solar):</strong> 1 amp = 12 watts</li>
</ul>
<p>This is why a 15-amp circuit at 120V can handle up to 1,800 watts, while the same 15 amps at 240V can handle 3,600 watts.</p>

<h3>Example: 15 Amps at 120V (US Standard Outlet)</h3>
<div class="explanation__highlight">
Power = 15 A × 120 V = <strong>1,800 watts</strong><br/><br/>
This is the maximum wattage for a standard 15-amp circuit in US homes. Per NEC (National Electrical Code), you should only load a circuit to 80% capacity — so the practical limit is 1,440 watts.
</div>

<h3>Example: Three-Phase AC (Commercial)</h3>
<div class="explanation__highlight">
A 30-amp, 208V three-phase circuit with PF = 0.85:<br/>
P = 30 × 208 × 0.85 × √3 = <strong>9,189 watts (9.19 kW)</strong>
</div>

<h3>Common US Appliance Examples</h3>
<table><thead><tr><th>Appliance</th><th>Watts</th><th>Amps at 120V</th></tr></thead><tbody>
<tr><td>LED Light Bulb</td><td>10 W</td><td>0.08 A</td></tr>
<tr><td>Laptop Charger</td><td>65 W</td><td>0.54 A</td></tr>
<tr><td>Coffee Maker</td><td>900 W</td><td>7.5 A</td></tr>
<tr><td>Microwave Oven</td><td>1,100 W</td><td>9.2 A</td></tr>
<tr><td>Space Heater</td><td>1,500 W</td><td>12.5 A</td></tr>
<tr><td>Hair Dryer</td><td>1,875 W</td><td>15.6 A</td></tr>
</tbody></table>

<h3>NEC Circuit Sizing Rule</h3>
<p>The <strong>National Electrical Code (NEC)</strong> requires that continuous loads use no more than <strong>80%</strong> of a circuit breaker's rated capacity. This means:</p>
<ul>
<li>A <strong>15-amp breaker</strong> (120V) supports up to <strong>1,440 watts</strong> continuous</li>
<li>A <strong>20-amp breaker</strong> (120V) supports up to <strong>1,920 watts</strong> continuous</li>
<li>A <strong>30-amp breaker</strong> (240V) supports up to <strong>5,760 watts</strong> continuous</li>
</ul>

<h3>References</h3>
<ul>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition</li>
<li>Ugly's Electrical References, 2023 (Jones & Bartlett Learning)</li>
<li>AC Electrical Circuit Analysis — James Fiore, 2022</li>
</ul>`, highlight: "15 amps × 120 volts = 1,800 watts — the maximum for a standard US 15-amp outlet. Per NEC, only load to 80% (1,440W) for continuous use." },
        faq: [
            { question: "How many watts is 15 amps at 120 volts?", answer: "15 amps × 120 volts = 1,800 watts. This is the maximum wattage for a standard 15-amp, 120V circuit in US homes. However, per the NEC 80% rule, continuous loads should not exceed 1,440 watts on this circuit." },
            { question: "How do I convert amps to watts?", answer: "Multiply amps by volts: Watts = Amps × Volts. For AC circuits, also multiply by the power factor (PF). For three-phase AC, add the √3 multiplier: Watts = Amps × Volts × PF × √3." },
            { question: "What is the power factor in AC circuits?", answer: "Power factor (PF) is the ratio of real power to apparent power, ranging from 0 to 1. Resistive loads (heaters, incandescent bulbs) have PF ≈ 1. Inductive loads (motors, compressors) typically have PF of 0.6–0.85. PF affects how much useful work the current actually does." },
            { question: "What is the difference between DC and AC conversions?", answer: "DC circuits use a simple formula: P = I × V. AC circuits require the power factor because AC current and voltage may not be perfectly synchronized (phase difference). Three-phase AC also needs the √3 factor for line-to-line calculations." },
            { question: "How many amps can a 20-amp breaker handle?", answer: "A 20-amp breaker at 120V can handle 2,400 watts maximum (20A × 120V). Per NEC, continuous loads should be limited to 80%, which is 1,920 watts. This is the standard circuit for kitchens, bathrooms, and garages in US homes." },
        ],
    },

    "watts-to-amps-calculator": {
        subtitle: "Convert watts to amps for DC, single-phase AC, and three-phase AC circuits. Enter power in watts and voltage to calculate current in amps. Essential for determining wire gauge and circuit breaker size.",
        explanation: { heading: "How to Convert Watts to Amps", contentHTML: `<p>Converting watts to amps tells you how much <strong>current</strong> a device draws from the circuit. This is essential for choosing the right <strong>wire gauge</strong>, <strong>circuit breaker size</strong>, and ensuring your electrical system can safely handle the load.</p>

<h3>Watts to Amps Formula</h3>
<div class="explanation__highlight">
<strong>DC Circuit:</strong> I = P / V<br/>
<strong>Single-Phase AC:</strong> I = P / (V × PF)<br/>
<strong>Three-Phase AC:</strong> I = P / (V × PF × √3)<br/><br/>
Where:<br/>
I = Current in amps (A)<br/>
P = Power in watts (W)<br/>
V = Voltage in volts (V)<br/>
PF = Power factor (0–1, AC only)
</div>

<h3>Example: 1,500-Watt Space Heater on 120V</h3>
<div class="explanation__highlight">
I = 1,500 W / 120 V = <strong>12.5 amps</strong><br/><br/>
A 1,500W space heater draws 12.5A on a 120V circuit. This requires at least a 15-amp breaker, but is better on a 20-amp circuit per the NEC 80% rule (12.5A is 83% of 15A).
</div>

<h3>Why Converting Watts to Amps Matters</h3>
<p>Appliances are often rated in watts, but your circuit breakers and wiring are rated in <strong>amps</strong>. To determine if your circuit can handle a load, you must convert the wattage to amperage and compare it to your breaker rating.</p>

<h3>Common US Appliances — Watts to Amps at 120V</h3>
<table><thead><tr><th>Appliance</th><th>Watts</th><th>Amps (120V)</th><th>Min. Breaker</th></tr></thead><tbody>
<tr><td>Phone Charger</td><td>5 W</td><td>0.04 A</td><td>15 A</td></tr>
<tr><td>LED Bulb</td><td>10 W</td><td>0.08 A</td><td>15 A</td></tr>
<tr><td>Window Fan</td><td>200 W</td><td>1.67 A</td><td>15 A</td></tr>
<tr><td>Refrigerator</td><td>400 W</td><td>3.33 A</td><td>15 A</td></tr>
<tr><td>Vacuum Cleaner</td><td>1,200 W</td><td>10.0 A</td><td>15 A</td></tr>
<tr><td>Space Heater</td><td>1,500 W</td><td>12.5 A</td><td>20 A</td></tr>
<tr><td>Electric Oven (240V)</td><td>5,000 W</td><td>20.8 A</td><td>30 A</td></tr>
</tbody></table>

<h3>Wire Gauge Guide (NEC)</h3>
<p>The NEC specifies minimum wire gauge based on amperage:</p>
<table><thead><tr><th>Breaker Size</th><th>Wire Gauge (AWG)</th><th>Common Use</th></tr></thead><tbody>
<tr><td>15 A</td><td>14 AWG</td><td>Lighting, bedroom outlets</td></tr>
<tr><td>20 A</td><td>12 AWG</td><td>Kitchen, bathroom, garage</td></tr>
<tr><td>30 A</td><td>10 AWG</td><td>Dryer, water heater</td></tr>
<tr><td>40 A</td><td>8 AWG</td><td>Electric range, large AC</td></tr>
<tr><td>50 A</td><td>6 AWG</td><td>Large appliances, sub-panels</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition</li>
<li>Ugly's Electrical References, 2023</li>
</ul>`, highlight: "A 1,500-watt space heater draws 12.5 amps on a 120V circuit. At 83% of a 15-amp breaker, the NEC recommends a 20-amp circuit for continuous use." },
        faq: [
            { question: "How many amps does a 1,500-watt heater draw?", answer: "At 120V: 1,500 ÷ 120 = 12.5 amps. At 240V: 1,500 ÷ 240 = 6.25 amps. Most portable space heaters in the US run on 120V, drawing 12.5 amps." },
            { question: "How do I convert watts to amps?", answer: "Divide watts by volts: Amps = Watts ÷ Volts. For AC circuits, also divide by the power factor: Amps = Watts ÷ (Volts × PF). For three-phase: Amps = Watts ÷ (Volts × PF × √3)." },
            { question: "How many amps is 1,000 watts at 120V?", answer: "1,000 ÷ 120 = 8.33 amps. This is well within the capacity of a standard US 15-amp circuit." },
            { question: "Why is my circuit breaker tripping?", answer: "Most likely the total amperage on the circuit exceeds the breaker rating. Add up all devices' wattages, divide by 120V, and compare to the breaker size. A 15-amp breaker trips above 1,800W. A 20-amp breaker trips above 2,400W." },
            { question: "What size breaker do I need for 5,000 watts?", answer: "At 120V: 5,000 ÷ 120 = 41.7A → need a 50A breaker. At 240V: 5,000 ÷ 240 = 20.8A → need a 30A breaker. Most high-wattage appliances (ovens, dryers) use 240V to reduce amperage." },
        ],
    },

    "volts-to-watts-calculator": {
        subtitle: "Convert volts to watts by entering voltage and current. Works for DC and AC circuits with power factor support. See conversion tables for US standard voltages (120V, 240V, 208V, 480V).",
        explanation: { heading: "How to Convert Volts to Watts", contentHTML: `<p>Voltage alone doesn't tell you power — you also need <strong>current (amps)</strong>. Converting volts to watts uses the same Watt's Law formula: <strong>Power = Voltage × Current</strong>. This calculator lets you quickly determine the wattage for any voltage and amperage combination.</p>

<h3>Volts to Watts Formula</h3>
<div class="explanation__highlight">
<strong>DC Circuit:</strong> P = V × I<br/>
<strong>Single-Phase AC:</strong> P = V × I × PF<br/>
<strong>Three-Phase AC:</strong> P = V × I × PF × √3<br/><br/>
Where P is power (watts), V is voltage (volts), I is current (amps), PF is power factor.
</div>

<h3>Example: US Standard 120V Outlet at 15 Amps</h3>
<div class="explanation__highlight">
P = 120V × 15A = <strong>1,800 watts</strong><br/><br/>
This is the theoretical maximum for a 15-amp, 120V circuit — the most common circuit type in US homes.
</div>

<h3>US Voltage Standards</h3>
<p>Understanding US voltage standards is crucial for accurate conversions:</p>
<table><thead><tr><th>Voltage</th><th>Type</th><th>Common Use</th></tr></thead><tbody>
<tr><td>12V DC</td><td>Direct Current</td><td>Automotive, RV, solar batteries</td></tr>
<tr><td>24V DC</td><td>Direct Current</td><td>Solar systems, industrial controls</td></tr>
<tr><td>120V AC</td><td>Single-Phase</td><td>US residential outlets (standard)</td></tr>
<tr><td>208V AC</td><td>Three-Phase</td><td>US commercial buildings</td></tr>
<tr><td>240V AC</td><td>Single/Split-Phase</td><td>US residential (dryers, ovens, AC)</td></tr>
<tr><td>277V AC</td><td>Three-Phase</td><td>US commercial lighting</td></tr>
<tr><td>480V AC</td><td>Three-Phase</td><td>US industrial, large motors</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition</li>
<li>IEEE Standard 141 (Red Book) — Electric Power Distribution for Industrial Plants</li>
</ul>`, highlight: "120V × 15A = 1,800 watts — the max for a US standard outlet. 240V × 30A = 7,200 watts — typical for an electric dryer circuit." },
        faq: [
            { question: "How many watts is 120 volts?", answer: "Watts depend on both voltage AND current. At 120V: 15 amps = 1,800W, 20 amps = 2,400W. You need to know the amperage to calculate watts." },
            { question: "How do I convert volts to watts?", answer: "Multiply volts by amps: Watts = Volts × Amps. For AC circuits, also multiply by power factor. For three-phase AC, add the √3 multiplier." },
            { question: "What is the difference between 120V and 240V?", answer: "US homes receive 240V split-phase power from the utility. This is split into two 120V legs. Standard outlets use one leg (120V). Large appliances use both legs (240V), which allows them to draw the same wattage at half the current — reducing wire costs." },
            { question: "Why does the US use 120V instead of 240V like Europe?", answer: "The US adopted 120V in the early 1900s when electrical systems were being standardized. At the time, 120V was considered safer for direct human contact. Europe later adopted 240V for greater efficiency. Today, US homes actually receive 240V service but split it for standard outlets." },
        ],
    },

    "watts-to-volts-calculator": {
        subtitle: "Convert watts to volts by entering power in watts and current in amps. Determine the voltage required for any electrical load. Supports DC and AC circuits with power factor.",
        explanation: { heading: "How to Convert Watts to Volts", contentHTML: `<p>Converting watts to volts tells you the <strong>voltage required</strong> to deliver a certain power at a given current. This is useful for designing circuits, selecting power supplies, and troubleshooting electrical systems.</p>

<h3>Watts to Volts Formula</h3>
<div class="explanation__highlight">
<strong>DC Circuit:</strong> V = P / I<br/>
<strong>Single-Phase AC:</strong> V = P / (I × PF)<br/>
<strong>Three-Phase AC:</strong> V = P / (I × PF × √3)<br/><br/>
Where V is voltage (volts), P is power (watts), I is current (amps), PF is power factor.
</div>

<h3>Example: Finding Voltage for a 60W Light Bulb</h3>
<div class="explanation__highlight">
A 60W incandescent bulb drawing 0.5A:<br/>
V = 60W / 0.5A = <strong>120 volts</strong><br/><br/>
This confirms it's designed for a standard US 120V outlet.
</div>

<h3>When You Need This Conversion</h3>
<ul>
<li><strong>Power supply selection:</strong> Determine the output voltage needed for a specific wattage at a known current</li>
<li><strong>Battery system design:</strong> Calculate whether your battery voltage is sufficient for your load</li>
<li><strong>Solar panel sizing:</strong> Verify that panel voltage matches inverter requirements</li>
<li><strong>Troubleshooting:</strong> Compare calculated voltage to measured voltage to identify problems</li>
</ul>

<h3>References</h3>
<ul>
<li>Principles of Electric Circuits — Thomas Floyd, 10th Edition</li>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition</li>
</ul>`, highlight: "A 60W light bulb at 0.5 amps operates at 120 volts — the US standard. Use this calculator to verify voltage requirements for any device." },
        faq: [
            { question: "How do I convert watts to volts?", answer: "Divide watts by amps: Volts = Watts ÷ Amps. For AC circuits, also divide by power factor. For three-phase: Volts = Watts ÷ (Amps × PF × √3)." },
            { question: "Can I calculate volts from watts alone?", answer: "No — you need either current (amps) or resistance (ohms) in addition to watts. Voltage, current, and resistance are all interdependent per Ohm's Law and Watt's Law." },
            { question: "What voltage do I need for a 1,000-watt device?", answer: "It depends on available current. At 10A → 100V. At 8.33A → 120V (US standard). At 4.17A → 240V. Most 1,000W US appliances are designed for 120V." },
        ],
    },

    "amps-to-volts-calculator": {
        subtitle: "Convert amps to volts using Ohm's Law (with resistance) or Watt's Law (with power). Essential for circuit design, troubleshooting, and understanding electrical relationships.",
        explanation: { heading: "How to Convert Amps to Volts", contentHTML: `<p>Converting amps (current) to volts (voltage) requires a second known quantity — either <strong>resistance (ohms)</strong> or <strong>power (watts)</strong>. This calculator supports both methods.</p>

<h3>Method 1: Using Resistance (Ohm's Law)</h3>
<div class="explanation__highlight">
<strong>V = I × R</strong><br/><br/>
Where V is voltage (volts), I is current (amps), R is resistance (ohms).
</div>
<p>Ohm's Law is the most fundamental equation in electrical engineering, published by Georg Simon Ohm in 1827. It states that voltage across a conductor is directly proportional to current flowing through it.</p>

<h3>Method 2: Using Power (Watt's Law)</h3>
<div class="explanation__highlight">
<strong>V = P / I</strong><br/><br/>
Where V is voltage (volts), P is power (watts), I is current (amps).
</div>

<h3>Example: Finding Voltage with Ohm's Law</h3>
<div class="explanation__highlight">
A circuit draws 15 amps through an 8-ohm load:<br/>
V = 15A × 8Ω = <strong>120 volts</strong>
</div>

<h3>The Ohm's Law Triangle</h3>
<p>Remember the three forms of Ohm's Law:</p>
<ul>
<li><strong>V = I × R</strong> — Find voltage when you know current and resistance</li>
<li><strong>I = V / R</strong> — Find current when you know voltage and resistance</li>
<li><strong>R = V / I</strong> — Find resistance when you know voltage and current</li>
</ul>

<h3>References</h3>
<ul>
<li>Fundamentals of Electric Circuits — Sadiku & Alexander, 7th Edition</li>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition</li>
</ul>`, highlight: "15 amps × 8 ohms = 120 volts (Ohm's Law). This calculator supports both Ohm's Law (resistance) and Watt's Law (power) methods." },
        faq: [
            { question: "How do I convert amps to volts?", answer: "You need either resistance or power. With resistance: Volts = Amps × Ohms (Ohm's Law). With power: Volts = Watts ÷ Amps (Watt's Law)." },
            { question: "Can I convert amps to volts without knowing resistance or power?", answer: "No. Current (amps) and voltage (volts) are independent quantities. You need at least one additional value — either resistance (ohms) or power (watts) — to calculate the relationship." },
            { question: "What is Ohm's Law?", answer: "Ohm's Law states V = I × R — voltage equals current times resistance. Discovered by Georg Ohm in 1827, it's the most fundamental relationship in electrical engineering and applies to all DC circuits and resistive AC loads." },
        ],
    },

    "volts-to-amps-calculator": {
        subtitle: "Convert volts to amps using Ohm's Law (with resistance) or Watt's Law (with power). Calculate the current draw for any DC or AC electrical circuit.",
        explanation: { heading: "How to Convert Volts to Amps", contentHTML: `<p>Converting volts to amps tells you <strong>how much current flows</strong> through a circuit. This is critical for selecting the right wire size, fuse rating, and ensuring your circuit doesn't overheat.</p>

<h3>Method 1: Using Resistance (Ohm's Law)</h3>
<div class="explanation__highlight">
<strong>I = V / R</strong><br/><br/>
Where I is current (amps), V is voltage (volts), R is resistance (ohms).
</div>

<h3>Method 2: Using Power (Watt's Law)</h3>
<div class="explanation__highlight">
<strong>I = P / V</strong> (DC)<br/>
<strong>I = P / (V × PF)</strong> (AC)<br/><br/>
Where I is current (amps), P is power (watts), V is voltage (volts), PF is power factor.
</div>

<h3>Example: Current Draw of a 120V Outlet</h3>
<div class="explanation__highlight">
A 120V outlet powering a 1,440W load:<br/>
I = 1,440W / 120V = <strong>12 amps</strong><br/><br/>
This is 80% of a 15-amp breaker — the NEC maximum for continuous loads.
</div>

<h3>US Wire Sizing Based on Amperage</h3>
<p>Knowing the current draw is essential for selecting the correct wire gauge per NEC Table 310.16:</p>
<table><thead><tr><th>Current (Amps)</th><th>Min. Wire Gauge (AWG)</th><th>Typical Breaker</th></tr></thead><tbody>
<tr><td>Up to 15A</td><td>14 AWG</td><td>15A</td></tr>
<tr><td>Up to 20A</td><td>12 AWG</td><td>20A</td></tr>
<tr><td>Up to 30A</td><td>10 AWG</td><td>30A</td></tr>
<tr><td>Up to 40A</td><td>8 AWG</td><td>40A</td></tr>
<tr><td>Up to 55A</td><td>6 AWG</td><td>50A or 60A</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>NEC Table 310.16 — Allowable Ampacities of Insulated Conductors</li>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition</li>
</ul>`, highlight: "1,440 watts ÷ 120 volts = 12 amps — exactly 80% of a 15-amp breaker, the NEC-recommended maximum for continuous loads." },
        faq: [
            { question: "How do I convert volts to amps?", answer: "Using Ohm's Law: Amps = Volts ÷ Ohms. Using Watt's Law: Amps = Watts ÷ Volts. For AC circuits, also divide by the power factor." },
            { question: "How many amps is a 120V outlet?", answer: "The outlet itself doesn't have a fixed amperage — it depends on the load. A 120V circuit with a 15-amp breaker can provide up to 15 amps (1,800 watts). With a 20-amp breaker, up to 20 amps (2,400 watts)." },
            { question: "What wire size do I need for 30 amps?", answer: "Per NEC Table 310.16, 30-amp circuits require a minimum of 10 AWG copper wire. This is standard for dryer circuits, water heaters, and some air conditioning units in US homes." },
        ],
    },

    "kva-to-amps-calculator": {
        subtitle: "Convert kilovolt-amps (kVA) to amps for single-phase and three-phase circuits. Essential for generator sizing, transformer selection, and electrical panel capacity planning.",
        explanation: { heading: "How to Convert kVA to Amps", contentHTML: `<p><strong>Kilovolt-amps (kVA)</strong> is a measure of <strong>apparent power</strong> — the total power flowing in an AC circuit, including both the useful (real) power and the reactive power. Converting kVA to amps is essential for sizing generators, transformers, and electrical panels.</p>

<h3>kVA to Amps Formula</h3>
<div class="explanation__highlight">
<strong>Single-Phase:</strong> I = (kVA × 1,000) / V<br/>
<strong>Three-Phase:</strong> I = (kVA × 1,000) / (V × √3)<br/><br/>
Where I is current (amps), kVA is apparent power (kilovolt-amps), V is voltage (volts).
</div>

<h3>Example: 25 kVA Transformer (Single-Phase)</h3>
<div class="explanation__highlight">
At 240V single-phase:<br/>
I = (25 × 1,000) / 240 = <strong>104.2 amps</strong><br/><br/>
A 25 kVA single-phase transformer at 240V can supply 104.2 amps.
</div>

<h3>Example: 100 kVA Three-Phase Generator at 208V</h3>
<div class="explanation__highlight">
I = (100 × 1,000) / (208 × √3) = (100,000) / (360.2) = <strong>277.6 amps</strong><br/><br/>
A 100 kVA three-phase generator at 208V can supply 277.6 amps per line.
</div>

<h3>Common Generator Sizes — kVA to Amps</h3>
<table><thead><tr><th>Generator (kVA)</th><th>120V 1Φ Amps</th><th>240V 1Φ Amps</th><th>208V 3Φ Amps</th><th>480V 3Φ Amps</th></tr></thead><tbody>
<tr><td>10 kVA</td><td>83.3 A</td><td>41.7 A</td><td>27.8 A</td><td>12.0 A</td></tr>
<tr><td>25 kVA</td><td>208.3 A</td><td>104.2 A</td><td>69.4 A</td><td>30.1 A</td></tr>
<tr><td>50 kVA</td><td>416.7 A</td><td>208.3 A</td><td>138.8 A</td><td>60.1 A</td></tr>
<tr><td>100 kVA</td><td>833.3 A</td><td>416.7 A</td><td>277.6 A</td><td>120.3 A</td></tr>
<tr><td>200 kVA</td><td>1,666.7 A</td><td>833.3 A</td><td>555.1 A</td><td>240.6 A</td></tr>
</tbody></table>

<h3>kVA vs. kW — What's the Difference?</h3>
<p>kVA (kilovolt-amps) measures <strong>apparent power</strong>, while kW (kilowatts) measures <strong>real power</strong>. The relationship is:</p>
<div class="explanation__highlight">
<strong>kW = kVA × PF</strong><br/><br/>
Example: A 100 kVA generator with PF = 0.8 delivers 80 kW of real power.
</div>
<p>Generators and transformers are rated in kVA because they must handle the total apparent power, regardless of load power factor.</p>

<h3>References</h3>
<ul>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition</li>
<li>IEEE Standard 141 (Red Book) — Electric Power Distribution</li>
<li>Electrical Wiring: Residential — Ray Mullin, 20th Edition</li>
</ul>`, highlight: "A 25 kVA transformer at 240V single-phase supplies 104.2 amps. For three-phase at 208V, the same 25 kVA supplies 69.4 amps per line." },
        faq: [
            { question: "How do I convert kVA to amps?", answer: "For single-phase: Amps = (kVA × 1,000) ÷ Volts. For three-phase: Amps = (kVA × 1,000) ÷ (Volts × √3). The √3 factor (1.732) accounts for the three-phase power delivery." },
            { question: "What size generator do I need for my home?", answer: "Most US homes need 15–25 kVA for essential circuits or 30–50 kVA for whole-house backup. Add up the wattage of all devices you need to power simultaneously, add 25% for startup surge, then convert to kVA." },
            { question: "What is the difference between kVA and kW?", answer: "kVA is apparent power (total power flowing), kW is real power (useful work). They're related by power factor: kW = kVA × PF. A generator rated at 100 kVA with PF = 0.8 delivers 80 kW of real power." },
            { question: "Why are transformers rated in kVA instead of kW?", answer: "Transformers must handle the total apparent power (kVA) flowing through them, regardless of the load's power factor. The real power (kW) consumed depends on what's connected to the transformer, which varies. For safety and sizing, kVA is the appropriate rating." },
        ],
    },

    "amps-to-kva-calculator": {
        subtitle: "Convert amps to kVA (kilovolt-amps) for single-phase and three-phase circuits. Calculate the apparent power rating needed for generators, transformers, and UPS systems.",
        explanation: { heading: "How to Convert Amps to kVA", contentHTML: `<p>Converting amps to kVA tells you the <strong>apparent power</strong> of your electrical load. This is crucial for sizing transformers, generators, UPS systems, and electrical panels.</p>

<h3>Amps to kVA Formula</h3>
<div class="explanation__highlight">
<strong>Single-Phase:</strong> S = (I × V) / 1,000<br/>
<strong>Three-Phase:</strong> S = (I × V × √3) / 1,000<br/><br/>
Where S is apparent power (kVA), I is current (amps), V is voltage (volts).
</div>

<h3>Example: 200-Amp Service (US Residential)</h3>
<div class="explanation__highlight">
Most US homes have 200-amp, 240V single-phase service:<br/>
S = (200A × 240V) / 1,000 = <strong>48 kVA</strong><br/><br/>
A standard 200-amp residential service panel has a 48 kVA capacity.
</div>

<h3>US Residential Service Sizes</h3>
<table><thead><tr><th>Service (Amps)</th><th>Voltage</th><th>kVA Capacity</th><th>Typical Home</th></tr></thead><tbody>
<tr><td>100 A</td><td>240V</td><td>24 kVA</td><td>Small homes, condos</td></tr>
<tr><td>150 A</td><td>240V</td><td>36 kVA</td><td>Medium homes</td></tr>
<tr><td>200 A</td><td>240V</td><td>48 kVA</td><td>Most US homes</td></tr>
<tr><td>320 A</td><td>240V</td><td>76.8 kVA</td><td>Large homes, EV charging</td></tr>
<tr><td>400 A</td><td>240V</td><td>96 kVA</td><td>Large estates, workshops</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>NFPA 70 — National Electrical Code (NEC), 2023 Edition, Article 230</li>
<li>IEEE Standard 141 (Red Book)</li>
</ul>`, highlight: "200 amps × 240V = 48 kVA — the total capacity of a standard US 200-amp residential service panel." },
        faq: [
            { question: "How do I convert amps to kVA?", answer: "For single-phase: kVA = (Amps × Volts) ÷ 1,000. For three-phase: kVA = (Amps × Volts × √3) ÷ 1,000." },
            { question: "What is the kVA capacity of a 200-amp home?", answer: "A 200-amp, 240V single-phase service has a capacity of 48 kVA (200 × 240 ÷ 1,000 = 48). This is the most common residential service size in the US." },
            { question: "How many amps do I need for a home?", answer: "Most new US homes need a 200-amp service. If you have electric heating, EV charging, a hot tub, or a home workshop, you may need 320A or 400A. Older homes may have 100A or 150A, which may need upgrading." },
        ],
    },

    "watts-to-kwh-calculator": {
        subtitle: "Convert watts to kilowatt-hours (kWh) to calculate energy consumption. Enter wattage and hours of use to see how much electricity your appliances consume and what it costs based on US electricity rates.",
        explanation: { heading: "How to Convert Watts to Kilowatt-Hours (kWh)", contentHTML: `<p><strong>Kilowatt-hours (kWh)</strong> is the standard unit for measuring electrical energy consumption. It's what appears on your electricity bill. Converting watts to kWh tells you how much <strong>energy</strong> a device consumes over a given period.</p>

<h3>Watts to kWh Formula</h3>
<div class="explanation__highlight">
<strong>E = (P × t) / 1,000</strong><br/><br/>
Where:<br/>
E = Energy in kilowatt-hours (kWh)<br/>
P = Power in watts (W)<br/>
t = Time in hours (h)
</div>
<p>Kilowatt-hours measure <strong>energy</strong> (watts × time), while watts measure <strong>power</strong> (the rate of energy use). A 100-watt bulb running for 10 hours consumes 1 kWh.</p>

<h3>Example: Running a Space Heater</h3>
<div class="explanation__highlight">
A 1,500W space heater running for 8 hours/day:<br/>
E = (1,500 × 8) / 1,000 = <strong>12 kWh/day</strong><br/>
Monthly = 12 × 30 = <strong>360 kWh/month</strong><br/>
Cost = 360 × $0.16 = <strong>$57.60/month</strong>
</div>

<h3>US Electricity Cost by State (2024 Average)</h3>
<p>The US national average is approximately <strong>$0.16/kWh</strong>, but rates vary significantly by state:</p>
<table><thead><tr><th>State</th><th>Rate ($/kWh)</th><th>State</th><th>Rate ($/kWh)</th></tr></thead><tbody>
<tr><td>Hawaii</td><td>$0.43</td><td>Texas</td><td>$0.14</td></tr>
<tr><td>Connecticut</td><td>$0.29</td><td>Florida</td><td>$0.14</td></tr>
<tr><td>Massachusetts</td><td>$0.28</td><td>North Carolina</td><td>$0.12</td></tr>
<tr><td>California</td><td>$0.27</td><td>Idaho</td><td>$0.10</td></tr>
<tr><td>New York</td><td>$0.22</td><td>Louisiana</td><td>$0.10</td></tr>
</tbody></table>
<p><em>Source: U.S. Energy Information Administration (EIA), 2024 data</em></p>

<h3>Common Appliance Energy Use</h3>
<table><thead><tr><th>Appliance</th><th>Watts</th><th>Daily Use</th><th>kWh/Day</th><th>Cost/Month</th></tr></thead><tbody>
<tr><td>LED Bulb</td><td>10 W</td><td>8 hrs</td><td>0.08</td><td>$0.38</td></tr>
<tr><td>Laptop</td><td>65 W</td><td>8 hrs</td><td>0.52</td><td>$2.50</td></tr>
<tr><td>Refrigerator</td><td>150 W</td><td>24 hrs</td><td>3.60</td><td>$17.28</td></tr>
<tr><td>TV (55 inch)</td><td>100 W</td><td>5 hrs</td><td>0.50</td><td>$2.40</td></tr>
<tr><td>Space Heater</td><td>1,500 W</td><td>8 hrs</td><td>12.00</td><td>$57.60</td></tr>
<tr><td>Central AC</td><td>3,500 W</td><td>8 hrs</td><td>28.00</td><td>$134.40</td></tr>
<tr><td>Electric Dryer</td><td>5,000 W</td><td>1 hr</td><td>5.00</td><td>$24.00</td></tr>
</tbody></table>
<p><em>* Cost at US average of $0.16/kWh</em></p>

<h3>US Average Household Electricity Use</h3>
<p>According to the <strong>U.S. Energy Information Administration (EIA)</strong>, the average US household consumes approximately <strong>886 kWh per month</strong> (10,632 kWh/year), costing about <strong>$142/month</strong> at the national average rate.</p>

<h3>References</h3>
<ul>
<li>U.S. Energy Information Administration (EIA) — Electricity Data, 2024</li>
<li>ENERGY STAR — Energy-Saving Guidelines</li>
</ul>`, highlight: "A 1,500W space heater running 8 hours/day uses 12 kWh daily — about $57.60/month at the US average rate of $0.16/kWh." },
        faq: [
            { question: "How do I convert watts to kWh?", answer: "Multiply watts by hours, then divide by 1,000: kWh = (Watts × Hours) ÷ 1,000. A 1,000-watt device running for 1 hour uses exactly 1 kWh." },
            { question: "How much does 1 kWh of electricity cost in the US?", answer: "The US national average is approximately $0.16/kWh (2024, EIA). Rates range from $0.10/kWh in states like Idaho and Louisiana to $0.43/kWh in Hawaii. Check your electric bill for your exact rate." },
            { question: "How much electricity does an average US home use?", answer: "About 886 kWh per month (29.5 kWh per day). The biggest consumers are heating/cooling (46%), water heating (14%), appliances (13%), and lighting (10%), according to EIA data." },
            { question: "What is the difference between watts and kWh?", answer: "Watts measure the rate of energy use (power). Kilowatt-hours measure the total energy consumed over time. Think of watts as speed and kWh as distance: a 100W bulb uses energy at a rate of 100 watts, and running it for 10 hours consumes 1 kWh of energy." },
            { question: "How can I reduce my electricity bill?", answer: "The biggest savings come from: 1) Reducing heating/cooling usage (programmable thermostat, insulation), 2) Switching to LED lighting (90% less than incandescent), 3) Using ENERGY STAR appliances, 4) Unplugging standby devices, 5) Running dishwashers and laundry during off-peak hours." },
        ],
    },

    "kwh-to-watts-calculator": {
        subtitle: "Convert kilowatt-hours (kWh) to watts to find the power consumption of devices from your energy bill. Determine how many watts your appliances draw based on energy usage data.",
        explanation: { heading: "How to Convert kWh to Watts", contentHTML: `<p>Converting kWh to watts is the reverse of the watts-to-kWh calculation. It helps you determine the <strong>power draw (wattage)</strong> of a device when you know how much energy it consumed over a specific time period. This is useful for analyzing your electricity bill or comparing appliance efficiency.</p>

<h3>kWh to Watts Formula</h3>
<div class="explanation__highlight">
<strong>P = (E × 1,000) / t</strong><br/><br/>
Where:<br/>
P = Power in watts (W)<br/>
E = Energy in kilowatt-hours (kWh)<br/>
t = Time in hours (h)
</div>

<h3>Example: Reading Your Electricity Bill</h3>
<div class="explanation__highlight">
Your meter shows 12 kWh used over 8 hours:<br/>
P = (12 × 1,000) / 8 = <strong>1,500 watts</strong><br/><br/>
This tells you the average power draw was 1,500W — equivalent to running a space heater.
</div>

<h3>Understanding Your Electricity Bill</h3>
<p>US electricity bills show consumption in kWh. Here's how to interpret common readings:</p>
<table><thead><tr><th>Monthly kWh</th><th>Average kW Draw</th><th>Cost (US Avg)</th><th>Comparable To</th></tr></thead><tbody>
<tr><td>300 kWh</td><td>0.42 kW</td><td>$48</td><td>Efficient apartment</td></tr>
<tr><td>600 kWh</td><td>0.83 kW</td><td>$96</td><td>Small home, mild climate</td></tr>
<tr><td>886 kWh</td><td>1.23 kW</td><td>$142</td><td>US average household</td></tr>
<tr><td>1,200 kWh</td><td>1.67 kW</td><td>$192</td><td>Large home, hot climate</td></tr>
<tr><td>2,000 kWh</td><td>2.78 kW</td><td>$320</td><td>Very large home, electric heating</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>U.S. Energy Information Administration (EIA) — Residential Electricity Data, 2024</li>
<li>ENERGY STAR — Home Energy Assessment Guidelines</li>
</ul>`, highlight: "12 kWh over 8 hours = 1,500 watts average power draw. The US average household uses 886 kWh/month, or about 1.23 kW continuous average draw." },
        faq: [
            { question: "How do I convert kWh to watts?", answer: "Multiply kWh by 1,000 and divide by hours: Watts = (kWh × 1,000) ÷ Hours. For example, 5 kWh over 4 hours = (5 × 1,000) ÷ 4 = 1,250 watts." },
            { question: "What does kWh mean on my electric bill?", answer: "kWh (kilowatt-hour) is the unit of energy used for billing. 1 kWh equals running a 1,000-watt device for 1 hour, or a 100-watt device for 10 hours. Your bill shows total kWh consumed during the billing period." },
            { question: "How many kWh does the average US household use?", answer: "Approximately 886 kWh per month (10,632 kWh/year) according to the EIA. This equals an average continuous power draw of about 1.23 kW." },
        ],
    },

    /* ═══ Phase 2 — 29 calculators ═══ */

    "kw-to-amps-calculator": {
        subtitle: "Convert kilowatts (kW) to amps for DC and AC circuits. Enter power in kW and voltage to calculate current. Supports single-phase and three-phase AC with power factor.",
        explanation: { heading: "How to Convert kW to Amps", contentHTML: `<p>Kilowatts (kW) measure <strong>real power</strong> — the useful power doing actual work. Converting kW to amps tells you the <strong>current draw</strong> of your equipment, which is critical for wire sizing, breaker selection, and circuit planning.</p>
<h3>kW to Amps Formula</h3>
<div class="explanation__highlight"><strong>DC:</strong> I = (kW × 1,000) / V<br/><strong>AC 1-Phase:</strong> I = (kW × 1,000) / (V × PF)<br/><strong>AC 3-Phase:</strong> I = (kW × 1,000) / (V × PF × √3)</div>
<h3>Example: 5 kW Load on 240V Single-Phase</h3>
<div class="explanation__highlight">I = (5 × 1,000) / (240 × 0.85) = <strong>24.5 amps</strong><br/>A 5 kW load at 240V with PF=0.85 draws about 24.5 amps — requires a 30A breaker.</div>
<h3>References</h3><ul><li>NFPA 70 — National Electrical Code (NEC), 2023</li><li>IEEE Std 141 — Electric Power Distribution</li></ul>`, highlight: "5 kW at 240V (PF=0.85) = 24.5 amps. Use this to size breakers and wiring for your kW-rated equipment." },
        faq: [
            { question: "How many amps is 1 kW?", answer: "It depends on voltage and power factor. At 120V DC: 1 kW = 8.33A. At 240V DC: 1 kW = 4.17A. For AC, divide further by the power factor." },
            { question: "How do I convert kW to amps?", answer: "Divide kW × 1,000 by voltage: Amps = (kW × 1,000) / V. For AC circuits, also divide by power factor. For three-phase, include the √3 factor." },
        ],
    },

    "kw-to-kva-calculator": {
        subtitle: "Convert kilowatts (kW) to kilovolt-amps (kVA) using power factor. Essential for generator and transformer sizing.",
        explanation: { heading: "How to Convert kW to kVA", contentHTML: `<p>kW measures <strong>real power</strong> (useful work), while kVA measures <strong>apparent power</strong> (total power flowing). The relationship depends on the <strong>power factor (PF)</strong>.</p>
<h3>kW to kVA Formula</h3><div class="explanation__highlight"><strong>kVA = kW / PF</strong><br/><br/>Example: 10 kW at PF = 0.85 → kVA = 10 / 0.85 = <strong>11.76 kVA</strong></div>
<p>Generators and transformers are rated in kVA because they must supply the total apparent power regardless of the load's power factor.</p>`, highlight: "10 kW ÷ 0.85 PF = 11.76 kVA. Always specify your generator/transformer in kVA, not kW." },
        faq: [
            { question: "Is kW the same as kVA?", answer: "Only when power factor = 1 (purely resistive load). For motors and most industrial loads, kVA is always higher than kW because of reactive power." },
        ],
    },

    "kw-to-kwh-calculator": {
        subtitle: "Convert kilowatts (kW) to kilowatt-hours (kWh) to calculate energy consumption over time. Estimate daily and monthly electricity costs.",
        explanation: { heading: "How to Convert kW to kWh", contentHTML: `<p>kW is power (rate of energy use), kWh is energy (total consumption over time).</p>
<h3>Formula</h3><div class="explanation__highlight"><strong>kWh = kW × hours</strong><br/><br/>Example: 3 kW running for 8 hours = <strong>24 kWh</strong><br/>Cost = 24 × $0.16 = <strong>$3.84/day</strong></div>`, highlight: "3 kW × 8 hours = 24 kWh/day. At $0.16/kWh, that's $3.84/day or ~$115/month." },
        faq: [
            { question: "How do I calculate electricity cost from kW?", answer: "Multiply kW by hours of use to get kWh, then multiply by your electricity rate. Example: 2 kW × 6 hours × $0.16/kWh = $1.92/day." },
        ],
    },

    "kw-to-va-calculator": {
        subtitle: "Convert kilowatts (kW) to volt-amps (VA) using power factor. Calculate the apparent power in VA for UPS and power supply sizing.",
        explanation: { heading: "How to Convert kW to VA", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>VA = (kW × 1,000) / PF</strong><br/><br/>Example: 5 kW at PF = 0.85 → VA = 5,000 / 0.85 = <strong>5,882 VA</strong></div>
<p>UPS systems are rated in VA. To ensure your UPS can handle your load, convert the load's real power (kW) to apparent power (VA).</p>`, highlight: "5 kW ÷ 0.85 PF = 5,882 VA. Always size your UPS based on VA, not watts." },
    },

    "kwh-to-kw-calculator": {
        subtitle: "Convert kilowatt-hours (kWh) to kilowatts (kW) to determine average power consumption from your energy bill.",
        explanation: { heading: "How to Convert kWh to kW", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>kW = kWh / hours</strong><br/><br/>Example: 24 kWh over 8 hours → kW = 24/8 = <strong>3 kW average</strong></div>
<p>This helps you understand your average power draw from utility bill data. The US average household uses ~886 kWh/month, which equals about 1.23 kW continuous.</p>`, highlight: "886 kWh per month ÷ 720 hours = 1.23 kW average — the typical US household power draw." },
    },

    "kva-to-hp-calculator": {
        subtitle: "Convert kVA to horsepower (HP) for electric motor sizing. Includes power factor and motor efficiency adjustments.",
        explanation: { heading: "How to Convert kVA to HP", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>HP = (kVA × PF × Efficiency) / 0.746</strong><br/><br/>Where 1 HP = 746 watts<br/>Example: 25 kVA at PF=0.85, Eff=90% → HP = (25 × 0.85 × 0.9) / 0.746 = <strong>25.6 HP</strong></div>
<p>Motor nameplate ratings typically list HP, but electrical systems use kVA. This conversion is essential for matching motors to generators and transformers.</p>`, highlight: "25 kVA × 0.85 PF × 0.9 Eff ÷ 0.746 = 25.6 HP. Essential for generator-to-motor matching." },
    },

    "kva-to-kw-calculator": {
        subtitle: "Convert kVA to kW using power factor. Find the real power output of generators, transformers, and UPS systems.",
        explanation: { heading: "How to Convert kVA to kW", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>kW = kVA × PF</strong><br/><br/>Example: 100 kVA generator at PF = 0.8 → kW = 100 × 0.8 = <strong>80 kW</strong></div>
<p>A generator rated at 100 kVA can only deliver 80 kW of real power if the load has a power factor of 0.8. This is why kVA ratings are always higher than kW ratings for the same equipment.</p>`, highlight: "100 kVA × 0.8 PF = 80 kW. The power factor determines how much useful power you actually get." },
        faq: [
            { question: "Why is kVA higher than kW?", answer: "Because kVA includes reactive power (used by motors, capacitors). kW only counts real power doing useful work. The ratio is the power factor: kW = kVA × PF." },
        ],
    },

    "kva-to-va-calculator": {
        subtitle: "Convert kVA to VA — simple unit conversion multiplying by 1,000. Useful for UPS and power supply specifications.",
        explanation: { heading: "How to Convert kVA to VA", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>VA = kVA × 1,000</strong><br/><br/>Example: 25 kVA = <strong>25,000 VA</strong></div>
<p>This is a straightforward unit conversion. kVA and VA measure the same thing (apparent power) — kVA is just the larger unit (1 kVA = 1,000 VA).</p>` },
    },

    "kva-to-watts-calculator": {
        subtitle: "Convert kVA to watts using power factor. Calculate the real power delivered by generators, transformers, and UPS systems.",
        explanation: { heading: "How to Convert kVA to Watts", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Watts = kVA × PF × 1,000</strong><br/><br/>Example: 25 kVA at PF = 0.85 → W = 25 × 0.85 × 1,000 = <strong>21,250 watts</strong></div>`, highlight: "25 kVA × 0.85 PF × 1,000 = 21,250 watts of real power." },
    },

    "ah-to-kwh-calculator": {
        subtitle: "Convert amp-hours (Ah) to kilowatt-hours (kWh) for battery capacity calculations. Essential for solar, RV, and EV battery system design.",
        explanation: { heading: "How to Convert Ah to kWh", contentHTML: `<p>Amp-hours (Ah) measure how much current a battery can deliver over time. To find the <strong>energy</strong> stored, multiply by voltage.</p>
<h3>Formula</h3><div class="explanation__highlight"><strong>kWh = (Ah × V) / 1,000</strong><br/><br/>Example: 100 Ah battery at 12V → kWh = (100 × 12) / 1,000 = <strong>1.2 kWh</strong></div>
<h3>Common Battery Systems</h3>
<table><thead><tr><th>System</th><th>Voltage</th><th>Typical Ah</th><th>kWh</th></tr></thead><tbody>
<tr><td>Car battery</td><td>12V</td><td>60 Ah</td><td>0.72 kWh</td></tr>
<tr><td>RV battery bank</td><td>12V</td><td>200 Ah</td><td>2.4 kWh</td></tr>
<tr><td>Tesla Powerwall</td><td>48V</td><td>280 Ah</td><td>13.5 kWh</td></tr>
<tr><td>EV battery (typical)</td><td>400V</td><td>150 Ah</td><td>60 kWh</td></tr>
</tbody></table>`, highlight: "100 Ah × 12V = 1.2 kWh. A Tesla Powerwall at ~280 Ah × 48V = 13.5 kWh." },
        faq: [
            { question: "How many kWh is a 100Ah 12V battery?", answer: "100 Ah × 12V / 1,000 = 1.2 kWh. However, lead-acid batteries should only be discharged to 50%, so usable energy is ~0.6 kWh. Lithium batteries can use 80-100%." },
        ],
    },

    "ah-to-wh-calculator": {
        subtitle: "Convert amp-hours (Ah) to watt-hours (Wh). Multiply Ah by voltage to find the energy capacity of batteries.",
        explanation: { heading: "How to Convert Ah to Wh", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Wh = Ah × V</strong><br/><br/>Example: 100 Ah at 12V = <strong>1,200 Wh (1.2 kWh)</strong></div>
<p>Watt-hours give you the actual energy stored in a battery, making it easier to compare batteries of different voltages.</p>` },
    },

    "wh-to-ah-calculator": {
        subtitle: "Convert watt-hours (Wh) to amp-hours (Ah) for battery capacity. Divide Wh by voltage to determine the Ah rating.",
        explanation: { heading: "How to Convert Wh to Ah", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Ah = Wh / V</strong><br/><br/>Example: 1,200 Wh at 12V → Ah = 1,200 / 12 = <strong>100 Ah</strong></div>` },
    },

    "wh-to-mah-calculator": {
        subtitle: "Convert watt-hours (Wh) to milliamp-hours (mAh) for smartphone, laptop, and portable device battery comparisons.",
        explanation: { heading: "How to Convert Wh to mAh", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>mAh = (Wh / V) × 1,000</strong><br/><br/>Example: 50 Wh laptop battery at 3.7V → mAh = (50 / 3.7) × 1,000 = <strong>13,514 mAh</strong></div>
<p>Smartphone batteries are typically rated in mAh at their nominal voltage (3.7V for Li-ion). Wh gives a more accurate energy comparison across different battery voltages.</p>
<h3>Common Device Batteries</h3>
<table><thead><tr><th>Device</th><th>Wh</th><th>Voltage</th><th>mAh</th></tr></thead><tbody>
<tr><td>iPhone 15</td><td>12.98</td><td>3.85V</td><td>3,369</td></tr>
<tr><td>Samsung S24</td><td>18.5</td><td>3.87V</td><td>4,781</td></tr>
<tr><td>MacBook Air M2</td><td>52.6</td><td>11.55V</td><td>4,554</td></tr>
<tr><td>iPad Pro 12.9"</td><td>40.88</td><td>3.77V</td><td>10,843</td></tr>
</tbody></table>`, highlight: "A 50 Wh laptop battery at 3.7V = 13,514 mAh. Use Wh (not mAh) to compare batteries across different voltages." },
        faq: [
            { question: "Why is Wh better than mAh for comparing batteries?", answer: "mAh doesn't account for voltage. A 5,000 mAh phone battery (3.7V) has 18.5 Wh, while a 5,000 mAh laptop battery (7.4V) has 37 Wh — twice the energy. Wh gives the true energy comparison." },
        ],
    },

    "mah-to-wh-calculator": {
        subtitle: "Convert milliamp-hours (mAh) to watt-hours (Wh) to compare battery energy across devices.",
        explanation: { heading: "How to Convert mAh to Wh", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Wh = (mAh × V) / 1,000</strong><br/><br/>Example: 5,000 mAh at 3.7V → Wh = (5,000 × 3.7) / 1,000 = <strong>18.5 Wh</strong></div>
<p>This conversion is important for airline travel — the TSA/FAA limit for carry-on lithium batteries is <strong>100 Wh</strong> (160 Wh with airline approval).</p>`, highlight: "5,000 mAh × 3.7V / 1,000 = 18.5 Wh. TSA limit: 100 Wh for carry-on batteries." },
        faq: [
            { question: "What is the FAA battery limit for flights?", answer: "The FAA allows lithium-ion batteries up to 100 Wh in carry-on luggage without approval. Batteries between 100-160 Wh require airline approval. Above 160 Wh is prohibited on passenger aircraft." },
        ],
    },

    "kwh-to-ah-calculator": {
        subtitle: "Convert kWh to Ah for battery bank sizing. Find out how many amp-hours of battery capacity you need.",
        explanation: { heading: "How to Convert kWh to Ah", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Ah = (kWh × 1,000) / V</strong><br/><br/>Example: 5 kWh at 12V → Ah = (5 × 1,000) / 12 = <strong>416.7 Ah</strong></div>
<p>For solar battery banks, you'd need ~417 Ah at 12V to store 5 kWh. Account for depth of discharge: lead-acid (50% DoD) needs double, so ~834 Ah.</p>`, highlight: "5 kWh at 12V = 416.7 Ah needed. For lead-acid (50% DoD), double it to 833 Ah." },
    },

    "amps-to-va-calculator": {
        subtitle: "Convert amps to volt-amps (VA) for single-phase and three-phase circuits. Calculate apparent power for UPS sizing.",
        explanation: { heading: "How to Convert Amps to VA", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Single-Phase:</strong> VA = I × V<br/><strong>Three-Phase:</strong> VA = I × V × √3<br/><br/>Example: 15A at 120V → VA = 15 × 120 = <strong>1,800 VA</strong></div>`, highlight: "15A × 120V = 1,800 VA. This is the apparent power drawn from the circuit." },
    },

    "va-to-amps-calculator": {
        subtitle: "Convert volt-amps (VA) to amps for single-phase and three-phase circuits. Determine current draw from VA-rated equipment.",
        explanation: { heading: "How to Convert VA to Amps", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Single-Phase:</strong> I = VA / V<br/><strong>Three-Phase:</strong> I = VA / (V × √3)<br/><br/>Example: 1,800 VA at 120V → I = 1,800 / 120 = <strong>15 amps</strong></div>` },
    },

    "va-to-kva-calculator": {
        subtitle: "Convert volt-amps (VA) to kilovolt-amps (kVA) — divide by 1,000. Common for transformer and UPS ratings.",
        explanation: { heading: "How to Convert VA to kVA", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>kVA = VA / 1,000</strong><br/><br/>Example: 25,000 VA = <strong>25 kVA</strong></div>` },
    },

    "va-to-kw-calculator": {
        subtitle: "Convert volt-amps (VA) to kilowatts (kW) using power factor. Find real power from VA-rated equipment.",
        explanation: { heading: "How to Convert VA to kW", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>kW = (VA × PF) / 1,000</strong><br/><br/>Example: 25,000 VA at PF=0.85 → kW = (25,000 × 0.85) / 1,000 = <strong>21.25 kW</strong></div>
<p>A UPS rated at 3,000 VA with PF=0.9 delivers 2,700 watts (2.7 kW) of real power.</p>`, highlight: "3,000 VA UPS × 0.9 PF = 2,700W real power. Always check the UPS power factor." },
    },

    "amps-to-hp-calculator": {
        subtitle: "Convert amps to horsepower (HP) for electric motors. Enter current, voltage, power factor, and motor efficiency.",
        explanation: { heading: "How to Convert Amps to HP", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>HP = (I × V × PF × Eff) / 746</strong><br/><br/>Where 1 HP = 746 watts<br/>Example: 20A at 240V, PF=0.85, Eff=90% → HP = (20 × 240 × 0.85 × 0.9) / 746 = <strong>4.93 HP</strong></div>`, highlight: "20A × 240V × 0.85 PF × 0.9 Eff ÷ 746 = 4.93 HP." },
    },

    "hp-to-amps-calculator": {
        subtitle: "Convert horsepower (HP) to amps for electric motors. Calculate current draw for DC, single-phase, and three-phase motors.",
        explanation: { heading: "How to Convert HP to Amps", contentHTML: `<p>The HP to amps conversion is essential for selecting the right wire size, breaker, and starter for electric motors.</p>
<h3>Formula</h3><div class="explanation__highlight"><strong>I = (HP × 746) / (V × Eff × PF)</strong><br/><br/>Example: 5 HP motor at 240V, PF=0.85, Eff=90%:<br/>I = (5 × 746) / (240 × 0.9 × 0.85) = <strong>20.3 amps</strong></div>
<h3>NEC Motor Full Load Amps (FLA) Reference</h3>
<p>The NEC provides full-load amp tables (Tables 430.247-430.250) for standard motor ratings. These are used for wire and breaker sizing, not the nameplate amps.</p>`, highlight: "5 HP at 240V (PF=0.85, Eff=90%) = 20.3 amps. Always use NEC FLA tables for wire/breaker sizing." },
        faq: [
            { question: "How many amps does a 1 HP motor draw?", answer: "At 120V single-phase: approximately 8-10 amps. At 240V single-phase: approximately 4-5 amps. At 240V three-phase: approximately 2.5-3 amps. Exact values depend on efficiency and power factor." },
        ],
    },

    "hp-to-kva-calculator": {
        subtitle: "Convert HP to kVA for generator and transformer sizing. Includes power factor and motor efficiency.",
        explanation: { heading: "How to Convert HP to kVA", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>kVA = (HP × 746) / (PF × Eff × 1,000)</strong><br/><br/>Example: 10 HP motor, PF=0.85, Eff=90%:<br/>kVA = (10 × 746) / (0.85 × 0.9 × 1,000) = <strong>9.75 kVA</strong></div>
<p>When sizing a generator for a motor, add 25-50% for starting surge (motors draw 5-7× their rated current during startup).</p>`, highlight: "10 HP motor needs ~9.75 kVA running + 25-50% for starting surge." },
    },

    "volts-to-joules-calculator": {
        subtitle: "Convert volts to joules using electric charge (coulombs). J = V × C. Calculate energy transferred by voltage.",
        explanation: { heading: "How to Convert Volts to Joules", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>J = V × C</strong><br/><br/>Where J = energy (joules), V = voltage (volts), C = charge (coulombs)<br/>Example: 12V × 10C = <strong>120 joules</strong></div>
<p>This formula comes from the definition of a volt: 1 volt = 1 joule per coulomb. It's used in capacitor energy calculations and physics problems.</p>` },
    },

    "watts-to-joules-calculator": {
        subtitle: "Convert watts to joules by multiplying power by time in seconds. J = W × s.",
        explanation: { heading: "How to Convert Watts to Joules", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>J = W × s</strong><br/><br/>Where J = energy (joules), W = power (watts), s = time (seconds)<br/>Example: 1,000W × 60s = <strong>60,000 joules (60 kJ)</strong></div>
<p>A watt is defined as 1 joule per second. So watts × seconds = joules. For larger energies, use kWh: 1 kWh = 3,600,000 joules.</p>`, highlight: "1,000W × 60 seconds = 60,000 joules = 60 kJ. 1 kWh = 3.6 million joules." },
    },

    "joules-to-volts-calculator": {
        subtitle: "Convert joules to volts using charge (coulombs). V = J / C. Calculate voltage from energy and charge.",
        explanation: { heading: "How to Convert Joules to Volts", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>V = J / C</strong><br/><br/>Example: 120 joules / 10 coulombs = <strong>12 volts</strong></div>` },
    },

    "joules-to-watts-calculator": {
        subtitle: "Convert joules to watts by dividing by time in seconds. W = J / s.",
        explanation: { heading: "How to Convert Joules to Watts", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>W = J / s</strong><br/><br/>Example: 60,000 J / 60 s = <strong>1,000 watts</strong></div>
<p>Since a watt is one joule per second, dividing total energy (joules) by time (seconds) gives you the average power in watts.</p>` },
    },

    "watts-to-kva-calculator": {
        subtitle: "Convert watts to kVA using power factor. Calculate the apparent power rating needed for your electrical load.",
        explanation: { heading: "How to Convert Watts to kVA", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>kVA = W / (PF × 1,000)</strong><br/><br/>Example: 5,000W at PF=0.85 → kVA = 5,000 / (0.85 × 1,000) = <strong>5.88 kVA</strong></div>
<p>When sizing a UPS, convert your total wattage to kVA to ensure the UPS can handle both the real and reactive power components.</p>` },
    },

    "amps-to-kw-calculator": {
        subtitle: "Convert amps to kilowatts (kW) for DC and AC circuits. Enter current and voltage to calculate real power.",
        explanation: { heading: "How to Convert Amps to kW", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>DC:</strong> kW = (I × V) / 1,000<br/><strong>AC 1-Phase:</strong> kW = (I × V × PF) / 1,000<br/><strong>AC 3-Phase:</strong> kW = (I × V × PF × √3) / 1,000<br/><br/>Example: 20A at 240V DC → kW = (20 × 240) / 1,000 = <strong>4.8 kW</strong></div>`, highlight: "20A × 240V = 4,800W = 4.8 kW. For AC, multiply by power factor." },
        faq: [
            { question: "How many kW is 100 amps at 240V?", answer: "DC: 100 × 240 / 1,000 = 24 kW. AC (PF=0.85): 100 × 240 × 0.85 / 1,000 = 20.4 kW." },
        ],
    },

    "capacitance-to-charge-calculator": {
        subtitle: "Calculate electric charge (coulombs) from capacitance and voltage using Q = C × V. Supports pF, nF, μF, mF, and F.",
        explanation: { heading: "How to Calculate Charge from Capacitance", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Q = C × V</strong><br/><br/>Where Q = charge (coulombs), C = capacitance (farads), V = voltage (volts)<br/>Example: 100 μF at 12V → Q = 100×10⁻⁶ × 12 = <strong>0.0012 C (1.2 mC)</strong></div>
<p>The energy stored in a capacitor is: <strong>E = ½ × C × V²</strong>. This is useful for understanding how much energy a capacitor can release.</p>
<h3>Common Capacitor Sizes</h3>
<table><thead><tr><th>Use Case</th><th>Typical Range</th></tr></thead><tbody>
<tr><td>Ceramic (filtering)</td><td>1 pF – 100 nF</td></tr>
<tr><td>Electrolytic (power supply)</td><td>1 μF – 10,000 μF</td></tr>
<tr><td>Supercapacitor (energy storage)</td><td>0.1 F – 3,000 F</td></tr>
</tbody></table>`, highlight: "100 μF × 12V = 1.2 mC of charge. Energy stored: ½ × 100μF × 12² = 7.2 mJ." },
    },
};

export default async function ElectricalCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("electrical").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/electrical-calculators/${calc.slug}`);
    const schemas: Array<object | undefined> = [
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Electrical Calculators", url: canonicalUrl("/electrical-calculators") }, { name: calc.title }]),
        webAppSchema(calc.title, pageUrl, "USD", "EducationalApplication"),
    ];
    if (content?.faq && content.faq.length > 0) {
        schemas.push(faqSchema(content.faq));
    }
    const schemaData = JSON.stringify(schemas.filter(Boolean));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-electrical-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Electrical Calculators", href: "/electrical-calculators" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <AuthorBadge categoryKey="electrical" />
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <ElectricalCalculatorCore calcType={calc.calcType || "amps-to-watts"} />
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
