// Dynamic Hub — /automotive-calculators/engine-performance/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import EnginePerformanceCalculatorCore from "@/components/calculator/EnginePerformanceCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("engine").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("engine").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/automotive-calculators/engine-performance/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; contentHTML: string; faq?: { question: string; answer: string }[] }> = {
    "engine-horsepower-calculator": {
        subtitle: "Calculate engine horsepower using three proven methods: RPM & torque, quarter-mile elapsed time, or trap speed. Results display in HP, kW, and PS with full formula breakdown.",
        contentHTML: `<h2>How to Calculate Engine Horsepower</h2>
<p>Horsepower (HP) is the standard unit of engine power output, invented by James Watt in the late 1700s to compare steam engine output to the work done by draft horses. One horsepower equals 33,000 foot-pounds of work per minute, or approximately <strong>745.7 watts</strong>.</p>

<h3>Method 1: RPM & Torque (Most Accurate)</h3>
<div class="explanation__highlight"><strong>HP = (RPM × Torque) ÷ 5,252</strong></div>
<p>This is the definitive formula. If you know your engine's peak torque (in lb-ft) and the RPM at which it occurs, this gives you the exact horsepower at that RPM. This is what a dynamometer measures — torque at every RPM — and then calculates HP from it.</p>
<p><strong>Example:</strong> An engine produces 350 lb-ft of torque at 5,600 RPM: HP = (5,600 × 350) ÷ 5,252 = <strong>373 HP</strong>.</p>

<h3>Method 2: Quarter-Mile Elapsed Time</h3>
<div class="explanation__highlight"><strong>HP = Weight ÷ (ET ÷ 5.825)³</strong></div>
<p>The Roger Huntington formula estimates horsepower from the quarter-mile elapsed time (ET) and vehicle weight. This method is popular at drag strips where a dyno isn't available. Weight includes the vehicle + driver + passengers.</p>
<p><strong>Example:</strong> A 3,500 lb car runs a 13.0-second quarter mile: HP = 3,500 ÷ (13.0 ÷ 5.825)³ = <strong>337 HP</strong>.</p>

<h3>Method 3: Trap Speed</h3>
<div class="explanation__highlight"><strong>HP = Weight × (Speed ÷ 234)³</strong></div>
<p>The trap speed method uses the speed recorded at the end of the quarter mile instead of elapsed time. This can be more reliable because trap speed is less affected by traction and reaction time.</p>
<p><strong>Example:</strong> 3,500 lbs at 100 mph trap speed: HP = 3,500 × (100 ÷ 234)³ = <strong>271 HP</strong>.</p>

<h3>HP vs. kW vs. PS — What's the Difference?</h3>
<table><thead><tr><th>Unit</th><th>Full Name</th><th>Equivalent</th></tr></thead><tbody>
<tr><td>HP</td><td>Mechanical Horsepower</td><td>1 HP = 745.7 watts</td></tr>
<tr><td>kW</td><td>Kilowatt</td><td>1 kW = 1.341 HP</td></tr>
<tr><td>PS</td><td>Pferdestärke (metric HP)</td><td>1 PS = 0.9863 HP</td></tr>
</tbody></table>
<p>European manufacturers use kW or PS; American manufacturers use HP. The differences are minor but matter when comparing specs across markets.</p>

<h3>Crank HP vs. Wheel HP</h3>
<p>A dyno measures <strong>wheel horsepower (WHP)</strong> — the power that actually reaches the ground. Crank HP (what manufacturers advertise) is higher because the drivetrain loses 12–18% of power through the transmission and differential. Manual transmissions lose ~15%; automatics lose ~18%.</p>`,
        faq: [
            { question: "What is the formula for horsepower?", answer: "The most accurate formula is HP = (RPM × Torque in lb-ft) ÷ 5,252. This is derived from the definition of 1 HP = 33,000 ft-lb/min. You can also estimate HP from quarter-mile ET (HP = Weight ÷ (ET ÷ 5.825)³) or trap speed (HP = Weight × (Speed ÷ 234)³)." },
            { question: "What is the difference between crank HP and wheel HP?", answer: "Crank HP is measured at the engine crankshaft — this is what manufacturers advertise. Wheel HP (WHP) is measured at the wheels by a chassis dynamometer and is 12–18% lower due to drivetrain losses. A 300 HP engine typically puts 250–264 HP to the wheels." },
            { question: "How many HP does a car need to be fast?", answer: "Performance is about power-to-weight ratio, not HP alone. A 2,500 lb car with 200 HP (12.5 lb/HP) is faster than a 5,000 lb truck with 350 HP (14.3 lb/HP). For a street car, under 10 lb/HP is considered quick; under 7 lb/HP is very fast." },
            { question: "What does the 5,252 constant mean?", answer: "At exactly 5,252 RPM, torque (in lb-ft) and horsepower are always equal. Below 5,252 RPM, torque is numerically higher; above it, HP is higher. This is why diesel engines with peak torque at 2,000 RPM feel strong but don't produce high HP numbers — they peak below the crossover point." },
        ],
    },
    "engine-torque-calculator": {
        subtitle: "Calculate engine torque from horsepower and RPM. Convert between lb-ft, Newton-meters, and kilogram-meters instantly.",
        contentHTML: `<h2>How to Calculate Engine Torque</h2>
<p>Torque is the rotational force that an engine produces — it's what makes a vehicle accelerate, climb hills, and tow heavy loads. While horsepower measures how fast work is done, <strong>torque measures how much force is applied</strong> to the crankshaft at any given moment.</p>
<div class="explanation__highlight"><strong>Torque (lb-ft) = (HP × 5,252) ÷ RPM</strong></div>
<p><strong>Worked Example:</strong> A 300 HP engine at 5,252 RPM produces exactly 300 lb-ft of torque. At 3,000 RPM, that same engine produces: (300 × 5,252) ÷ 3,000 = <strong>525 lb-ft</strong>.</p>
<h3>Torque Unit Conversions</h3>
<table><thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead><tbody>
<tr><td>lb-ft</td><td>Nm</td><td>1.35582</td></tr>
<tr><td>Nm</td><td>lb-ft</td><td>0.73756</td></tr>
<tr><td>lb-ft</td><td>kg-m</td><td>0.13826</td></tr>
</tbody></table>
<h3>Why Torque Matters for Towing</h3>
<p>Towing capacity is determined primarily by torque, not horsepower. A diesel truck making 500 lb-ft at 1,800 RPM can pull a heavy trailer from a standstill because the force is available at low RPM. A gasoline sports car making 350 lb-ft at 5,500 RPM has the raw number but can't apply it at the low speeds where towing occurs.</p>`,
        faq: [
            { question: "Is torque or horsepower more important?", answer: "It depends on use case. Torque determines acceleration feel and towing ability. Horsepower determines top speed and sustained high-RPM performance. For daily driving and towing, torque matters more. For track days and drag racing, horsepower is king." },
            { question: "Why do diesel engines have more torque than gasoline?", answer: "Diesel engines have higher compression ratios (16:1 vs 10:1), longer strokes, and higher cylinder pressure. These factors create more rotational force (torque) per combustion event. However, diesels typically spin slower (peak at 2,000–4,000 RPM), so their HP output is often lower despite higher torque." },
        ],
    },
    "engine-displacement-calculator": {
        subtitle: "Calculate engine displacement in cubic inches, cubic centimeters, and liters from bore, stroke, and cylinder count. Includes presets for popular engines.",
        contentHTML: `<h2>How to Calculate Engine Displacement</h2>
<p>Engine displacement is the total volume swept by all pistons in one complete engine cycle. It's one of the fundamental specifications that determines an engine's power potential, fuel consumption, and character.</p>
<div class="explanation__highlight"><strong>Displacement = (π ÷ 4) × Bore² × Stroke × Cylinders</strong></div>
<p><strong>Example — Chevy 350:</strong> Bore = 4.00", Stroke = 3.48", 8 cylinders: V = (3.14159 ÷ 4) × 4² × 3.48 × 8 = <strong>349.85 CID = 5,733 cc = 5.7L</strong></p>
<h3>Common Engine Sizes</h3>
<table><thead><tr><th>Engine</th><th>CID</th><th>CC</th><th>Liters</th></tr></thead><tbody>
<tr><td>Honda Civic (K20)</td><td>122</td><td>1,998</td><td>2.0L</td></tr>
<tr><td>Toyota 2JZ-GTE</td><td>183</td><td>2,997</td><td>3.0L</td></tr>
<tr><td>Ford Coyote</td><td>302</td><td>4,951</td><td>5.0L</td></tr>
<tr><td>Chevy LS3</td><td>376</td><td>6,162</td><td>6.2L</td></tr>
<tr><td>Dodge Hellcat</td><td>376</td><td>6,166</td><td>6.2L</td></tr>
</tbody></table>`,
        faq: [
            { question: "What is better — a bigger or smaller engine?", answer: "Neither is inherently better. Larger displacement provides more natural power without forced induction. Smaller engines with turbocharging can match larger engines' power while using less fuel at part-throttle. A turbo 2.0L can make 300+ HP (Honda Type R), rivaling naturally aspirated 5.0L engines." },
            { question: "What do CID, cc, and liters mean?", answer: "They're all measures of engine volume. CID = Cubic Inch Displacement (American). cc = cubic centimeters (global). Liters = cc ÷ 1,000 (global). 1 CID = 16.387 cc. A '350' is 350 CID = 5,733 cc = 5.7L." },
        ],
    },
    "engine-compression-ratio-calculator": {
        subtitle: "Calculate engine compression ratio from swept volume and clearance volume. See recommended fuel octane for your ratio.",
        contentHTML: `<h2>How to Calculate Compression Ratio</h2>
<p>Compression ratio (CR) is the ratio of the cylinder's total volume (when the piston is at bottom dead center) to the clearance volume (when the piston is at top dead center). Higher compression extracts more energy from each combustion event, increasing power and efficiency — but requires higher-octane fuel to prevent detonation.</p>
<div class="explanation__highlight"><strong>CR = (Swept Volume + Clearance Volume) ÷ Clearance Volume</strong></div>
<p><strong>Example:</strong> 500cc swept + 50cc clearance = (500 + 50) ÷ 50 = <strong>11.0:1</strong></p>
<h3>Compression Ratio & Fuel Requirements</h3>
<table><thead><tr><th>CR</th><th>Minimum Octane</th><th>Typical Application</th></tr></thead><tbody>
<tr><td>8.0:1 – 9.5:1</td><td>87 (Regular)</td><td>Economy cars, trucks</td></tr>
<tr><td>9.5:1 – 10.5:1</td><td>91 (Mid-Grade)</td><td>Performance sedans</td></tr>
<tr><td>10.5:1 – 12.5:1</td><td>93 (Premium)</td><td>Sports cars, performance</td></tr>
<tr><td>12.5:1+</td><td>100+ (Race Fuel)</td><td>Race engines</td></tr>
</tbody></table>`,
        faq: [
            { question: "What happens if I use lower octane than required?", answer: "The engine may experience 'knock' or 'ping' — premature detonation that can cause severe engine damage. Modern ECUs detect knock and retard ignition timing, preventing damage but reducing power by 5–15%. Always use the manufacturer's recommended octane." },
        ],
    },
    "carburetor-cfm-calculator": {
        subtitle: "Calculate the correct carburetor size in CFM for your engine using displacement, RPM, and volumetric efficiency. Includes a complete CFM reference table for popular American V8 engines, volumetric efficiency guide, and carburetor brand comparison.",
        contentHTML: `<h2>How to Calculate Carburetor CFM — Step by Step</h2>
<p>Selecting the right carburetor size is one of the most critical decisions in building a carbureted engine. An undersized carburetor starves the engine of air at high RPM, costing peak power. An oversized carburetor reduces air velocity through the venturis, causing poor fuel atomization, lazy throttle response, and a rough idle — especially at low RPM in stop-and-go traffic.</p>
<p>The industry-standard formula uses three variables: <strong>engine displacement</strong> in cubic inches, <strong>maximum RPM</strong>, and <strong>volumetric efficiency (VE)</strong>. If you already know your displacement in liters or cc, use our <a href="/automotive-calculators/engine-performance/engine-displacement-calculator">engine displacement calculator</a> to convert it to cubic inches.</p>

<h3>Step 1 — Determine Your Engine Displacement (CID)</h3>
<p>Engine displacement is the total volume swept by all pistons in one complete cycle, measured in <strong>cubic inches (CID)</strong>. Common American V8 displacements include the Chevy 350 (5.7L), Ford 302 (5.0L), and Chevy 454 (7.4L). If you need to calculate your displacement from bore and stroke, use the <a href="/automotive-calculators/engine-performance/engine-displacement-calculator">engine displacement calculator</a>.</p>

<h3>Step 2 — Find Your Engine's Maximum RPM</h3>
<p>Use the RPM where the engine reaches <strong>peak horsepower</strong> — not redline. For most street engines this is 5,000–6,000 RPM. Race engines may rev to 7,000–8,500 RPM. You can determine this on a <a href="/automotive-calculators/engine-performance/dyno-correction-calculator">dynamometer</a> or from the cam manufacturer's specifications. Using redline instead of peak-HP RPM will oversize your carburetor.</p>

<h3>Step 3 — Estimate Your Volumetric Efficiency (VE)</h3>
<p>Volumetric efficiency is the percentage of the cylinder's swept volume that is actually filled with air on each intake stroke. A bone-stock engine with restrictive intake and exhaust may only achieve 70–75% VE, while a fully ported race engine with individual throttle bodies can exceed 100% VE with tuned intake runners.</p>
<table><thead><tr><th>Engine Build Level</th><th>Typical VE</th><th>Description</th></tr></thead><tbody>
<tr><td>Bone Stock</td><td>70–75%</td><td>Factory intake, exhaust manifolds, stock cam, stock heads</td></tr>
<tr><td>Mild Street</td><td>78–82%</td><td>Aftermarket intake, headers, mild cam (under 220° duration)</td></tr>
<tr><td>Performance Street</td><td>83–88%</td><td>Ported heads, performance cam (220–240° duration), long-tube headers</td></tr>
<tr><td>Hot Street / Strip</td><td>88–93%</td><td>CNC-ported heads, aggressive cam (240–260°), race intake</td></tr>
<tr><td>Full Race (N/A)</td><td>95–100%</td><td>Maximum port work, individual runners, race cam (260°+)</td></tr>
<tr><td>Forced Induction</td><td>100–110%+</td><td>Supercharged or turbocharged (effective VE exceeds 100%)</td></tr>
</tbody></table>
<p>When in doubt, <strong>use 80% VE for a mild street build</strong>. It's always better to err slightly small on a street car — a carburetor that's 50 CFM too small loses minimal peak HP, but one that's 100 CFM too large causes daily-driving problems.</p>

<h3>Step 4 — Apply the Carburetor Sizing Formula</h3>
<div class="explanation__highlight"><strong>CFM = (CID × RPM × VE%) ÷ 3,456</strong></div>
<p>The constant <strong>3,456</strong> comes from the unit conversion: 1,728 cubic inches per cubic foot × 2 (because a 4-stroke engine completes one intake stroke every two crankshaft revolutions). So 1,728 × 2 = 3,456.</p>

<h3>Step 5 — Round Up to the Nearest Available CFM Rating</h3>
<p>Carburetors are manufactured in specific CFM ratings — typically in increments of 50 CFM (e.g., 500, 550, 600, 650, 700, 750, 800, 850). After calculating your target CFM, <strong>select the nearest size that is equal to or slightly larger than your result</strong>. If your calculation falls exactly between two sizes, choose the smaller one for a street car and the larger one for a race application.</p>

<h2>Worked Examples — Popular American Engines</h2>

<h3>Example 1: Chevy 350 Small Block — Mild Street Build</h3>
<p>A 350 CID Chevy with a mild cam, intake, and headers (80% VE) revving to 5,500 RPM:</p>
<div class="explanation__highlight"><strong>CFM = (350 × 5,500 × 0.80) ÷ 3,456 = 445 CFM</strong></div>
<p><strong>Recommendation:</strong> A <strong>500 CFM</strong> carburetor like the Edelbrock Performer 1404 or Holley 0-80457SA. This leaves room for future modifications while providing excellent throttle response and idle quality.</p>

<h3>Example 2: Ford 302 Small Block — Performance Street</h3>
<p>A 302 CID Ford with ported heads and a performance cam (85% VE) revving to 6,500 RPM:</p>
<div class="explanation__highlight"><strong>CFM = (302 × 6,500 × 0.85) ÷ 3,456 = 483 CFM</strong></div>
<p><strong>Recommendation:</strong> A <strong>500–600 CFM</strong> carburetor. The popular choice is a 600 CFM Holley with vacuum secondaries — the vacuum secondaries won't open until the engine demands the airflow, effectively making it a 300 CFM carb at part-throttle.</p>

<h3>Example 3: Chevy 454 Big Block — Race Build</h3>
<p>A 454 CID Chevy with full race heads, radical cam, and race intake (95% VE) revving to 6,000 RPM:</p>
<div class="explanation__highlight"><strong>CFM = (454 × 6,000 × 0.95) ÷ 3,456 = 749 CFM</strong></div>
<p><strong>Recommendation:</strong> A <strong>750 CFM double-pumper</strong> (mechanical secondaries) like the Holley 0-4779C. The mechanical secondaries provide instant full-flow response for drag racing. This would be terrible on the street — see vacuum vs. mechanical below.</p>

<h2>Carburetor CFM Reference Table — Popular American Engines</h2>
<p>The table below shows recommended carburetor CFM for popular engines at both 80% VE (street) and 85% VE (performance). These assume the typical peak RPM for each engine in its common application. Use the calculator above to fine-tune for your specific <a href="/automotive-calculators/engine-performance/engine-horsepower-calculator">horsepower target</a>.</p>
<table><thead><tr><th>Engine</th><th>CID</th><th>Peak RPM</th><th>CFM @ 80%</th><th>CFM @ 85%</th><th>Recommended Carb</th></tr></thead><tbody>
<tr><td>Chevy 305 SBC</td><td>305</td><td>5,500</td><td>386</td><td>410</td><td>390 CFM</td></tr>
<tr><td>Chevy 350 SBC</td><td>350</td><td>5,600</td><td>453</td><td>481</td><td>500 CFM</td></tr>
<tr><td>Ford 289 SBF</td><td>289</td><td>6,000</td><td>401</td><td>426</td><td>500 CFM</td></tr>
<tr><td>Ford 302 SBF</td><td>302</td><td>6,000</td><td>419</td><td>445</td><td>500 CFM</td></tr>
<tr><td>Chevy 383 Stroker</td><td>383</td><td>5,800</td><td>514</td><td>546</td><td>550–600 CFM</td></tr>
<tr><td>Pontiac 400</td><td>400</td><td>5,500</td><td>509</td><td>540</td><td>600 CFM</td></tr>
<tr><td>Ford 351W</td><td>351</td><td>5,800</td><td>471</td><td>500</td><td>500–600 CFM</td></tr>
<tr><td>Chevy 396 BBC</td><td>396</td><td>5,500</td><td>504</td><td>535</td><td>600 CFM</td></tr>
<tr><td>Chrysler 440</td><td>440</td><td>5,200</td><td>529</td><td>562</td><td>600 CFM</td></tr>
<tr><td>Chevy 454 BBC</td><td>454</td><td>5,500</td><td>577</td><td>613</td><td>650 CFM</td></tr>
<tr><td>Ford 390 FE</td><td>390</td><td>5,200</td><td>469</td><td>498</td><td>500–600 CFM</td></tr>
<tr><td>Chevy 502 BBC</td><td>502</td><td>5,500</td><td>639</td><td>679</td><td>700–750 CFM</td></tr>
<tr><td>Ford 427 FE</td><td>427</td><td>6,000</td><td>592</td><td>629</td><td>650 CFM</td></tr>
<tr><td>Chrysler 426 Hemi</td><td>426</td><td>5,500</td><td>541</td><td>575</td><td>600 CFM</td></tr>
</tbody></table>

<h2>How to Choose the Right Carburetor</h2>

<h3>Vacuum Secondary vs. Mechanical Secondary</h3>
<p><strong>Vacuum secondary</strong> carburetors (like the Holley 0-80457SA) use a vacuum diaphragm to open the secondary throttle plates. They only open when engine vacuum drops enough to signal demand — making them self-regulating and excellent for street use with varied driving conditions. At part-throttle in town, the secondaries stay closed and the carb effectively operates at half its rated CFM.</p>
<p><strong>Mechanical secondary</strong> carburetors ("double-pumpers" like the Holley 0-4779C) open the secondaries via a direct linkage when you floor it. This provides maximum airflow instantly — ideal for drag racing — but can cause a bog on the street if the engine isn't making enough RPM to demand the airflow. For 90% of street builds, vacuum secondaries are the right choice.</p>

<h3>Single 4-Barrel vs. Dual Quad Setup</h3>
<p>A <strong>single 4-barrel</strong> carburetor is the standard configuration for most V8 engines. It's simpler to tune, lighter, and more efficient for street use. A <strong>dual quad</strong> (two smaller 4-barrel carbs, typically 450–500 CFM each, on a tunnel ram or cross-ram intake) is used for race applications where maximum peak airflow is needed. The front carb handles idle and cruise; both carbs open under wide-open throttle.</p>
<p>For street driving, a properly sized single 4-barrel always outperforms a dual quad setup below 4,000 RPM. Dual quads only shine above 5,500 RPM on race engines.</p>

<h2>What Happens If Your Carburetor Is the Wrong Size?</h2>

<h3>Symptoms of an Undersized Carburetor</h3>
<ul>
<li><strong>Power drops off sharply</strong> at high RPM — the engine "hits a wall"</li>
<li>Exhaust temperature rises because the mixture leans out under load</li>
<li>The engine feels strong in the mid-range but falls flat at peak RPM</li>
<li>Can cause engine damage from lean conditions at wide-open throttle</li>
</ul>

<h3>Symptoms of an Oversized Carburetor</h3>
<ul>
<li><strong>Sluggish throttle response</strong> — the "bog" when you stab the throttle from idle</li>
<li>Poor idle quality — rough, erratic, or won't hold a stable idle</li>
<li>Reduced fuel economy — poor atomization wastes fuel</li>
<li>Black smoke at cruise — fuel doesn't atomize properly in low-velocity airflow</li>
<li>Loss of low-RPM torque — the engine feels "lazy" below 3,000 RPM</li>
</ul>

<h2>Altitude and Temperature Corrections</h2>
<p>Air density decreases at higher altitudes and higher temperatures. This means engines at altitude produce less power — and need less carburetor CFM to match. The general rule is a <strong>3% reduction in required CFM per 1,000 feet of altitude above sea level</strong>. Temperature corrections are handled automatically by well-jetted carburetors but may need manual adjustment if your <a href="/automotive-calculators/engine-performance/dyno-correction-calculator">dyno correction factor</a> exceeds 1.05.</p>
<table><thead><tr><th>Altitude (ft)</th><th>CFM Reduction</th><th>Example (600 CFM at sea level)</th></tr></thead><tbody>
<tr><td>Sea Level</td><td>0%</td><td>600 CFM</td></tr>
<tr><td>2,000 ft</td><td>−6%</td><td>564 CFM</td></tr>
<tr><td>4,000 ft</td><td>−12%</td><td>528 CFM</td></tr>
<tr><td>5,280 ft (Denver)</td><td>−16%</td><td>504 CFM</td></tr>
<tr><td>7,000 ft</td><td>−21%</td><td>474 CFM</td></tr>
</tbody></table>
<p>This means a 350 Chevy in Denver that needs a 500 CFM carb at sea level would be best served by a <strong>390–450 CFM carb</strong> at 5,280 feet. Running a 600 CFM carb at altitude is a common mistake that causes all the oversized-carb symptoms listed above.</p>

<h2>Popular Carburetor Brands and Models</h2>
<p>The three most popular carburetor brands in the US aftermarket are Holley, Edelbrock, and Quick Fuel Technology. Each has distinct characteristics that suit different build types.</p>
<table><thead><tr><th>Brand</th><th>Model</th><th>CFM</th><th>Secondary Type</th><th>Best For</th></tr></thead><tbody>
<tr><td>Holley</td><td>0-80457SA</td><td>600</td><td>Vacuum</td><td>Street 350/302 — most popular street carb in America</td></tr>
<tr><td>Holley</td><td>0-80508SA</td><td>750</td><td>Vacuum</td><td>Street/strip 383/454 — good all-around performance</td></tr>
<tr><td>Holley</td><td>0-4779C</td><td>750</td><td>Mechanical (DP)</td><td>Drag racing 383+ — instant full-flow response</td></tr>
<tr><td>Holley</td><td>0-82651</td><td>650</td><td>Vacuum</td><td>Ultra Street series — great idle quality</td></tr>
<tr><td>Edelbrock</td><td>Performer 1406</td><td>600</td><td>Electric Choke</td><td>Street 305/350 — excellent cold-start behavior</td></tr>
<tr><td>Edelbrock</td><td>Thunder 1826</td><td>650</td><td>Electric Choke</td><td>Performance street 350 — premium materials</td></tr>
<tr><td>Edelbrock</td><td>Performer 1411</td><td>750</td><td>Electric Choke</td><td>Street/strip 383+ — higher-flow applications</td></tr>
<tr><td>Quick Fuel</td><td>SS-600-AN</td><td>600</td><td>Vacuum</td><td>CNC-machined billet base — race-quality street carb</td></tr>
<tr><td>Quick Fuel</td><td>SS-750-AN</td><td>750</td><td>Mechanical</td><td>Strip/race — billet construction, premium tuning</td></tr>
</tbody></table>
<p><strong>Holley vs. Edelbrock — which is better?</strong> For a first-time builder, Edelbrock carburetors are easier to tune (no float adjustments needed, comes factory-jetted). For experienced tuners who want maximum adjustability, Holley is the industry standard with the widest range of jets, power valves, accelerator pumps, and aftermarket support.</p>

<h2>Related Engine Calculators</h2>
<p>Carburetor sizing is one piece of the engine-build puzzle. Use these related tools to complete your build planning:</p>
<ul>
<li><a href="/automotive-calculators/engine-performance/engine-horsepower-calculator">Engine Horsepower Calculator</a> — estimate HP from torque and RPM</li>
<li><a href="/automotive-calculators/engine-performance/engine-displacement-calculator">Engine Displacement Calculator</a> — find CID from bore, stroke, and cylinder count</li>
<li><a href="/automotive-calculators/engine-performance/engine-compression-ratio-calculator">Compression Ratio Calculator</a> — ensure your CR matches your fuel octane</li>
<li><a href="/automotive-calculators/engine-performance/quarter-mile-calculator">Quarter-Mile Calculator</a> — estimate ET and trap speed from HP and weight</li>
<li><a href="/automotive-calculators/fuel-economy/fuel-injector-calculator">Fuel Injector Calculator</a> — size injectors for EFI conversions</li>
<li><a href="/automotive-calculators/engine-performance/dyno-correction-calculator">Dyno Correction Factor Calculator</a> — normalize dyno results for weather</li>
<li><a href="/automotive-calculators/engine-performance/engine-torque-calculator">Engine Torque Calculator</a> — convert between HP and torque</li>
<li><a href="/automotive-calculators/engine-performance/gear-ratio-calculator">Gear Ratio Calculator</a> — determine RPM at speed for gear selection</li>
</ul>`,
        faq: [
            { question: "What size carburetor do I need for a 350 Chevy?", answer: "For a mild street 350 with stock-to-mild modifications (80% VE, 5,500 RPM): 445 CFM calculated → select a 500 CFM carb. For a performance street 350 with ported heads and cam (85% VE, 6,000 RPM): 516 CFM → select a 500–600 CFM carb. The Holley 0-80457SA (600 CFM vacuum secondary) and Edelbrock Performer 1406 (600 CFM) are the two most popular choices for a 350 Chevy." },
            { question: "What CFM carburetor do I need for a 302 Ford?", answer: "At 80% VE and 6,000 RPM: (302 × 6,000 × 0.80) ÷ 3,456 = 419 CFM. A 500 CFM carburetor is the go-to choice. For a hot 302 with ported heads (85% VE, 6,500 RPM): 483 CFM → a 500 or 600 CFM carb with vacuum secondaries." },
            { question: "Is a 600 CFM carburetor too big for a 305?", answer: "For a stock 305, yes — it only needs about 386 CFM (at 80% VE, 5,500 RPM). A 600 CFM carb on a stock 305 will have poor throttle response, rough idle, and terrible fuel economy. A 390 or 500 CFM carb is a much better fit. However, if your 305 has significant head work and a performance cam (85% VE, 6,000 RPM), the calculation gives 424 CFM, and a 500 CFM carb is ideal." },
            { question: "What does the 3,456 constant in the carburetor formula mean?", answer: "It's a unit-conversion factor: 1,728 cubic inches per cubic foot × 2 (because a 4-stroke engine only has one intake event per two crankshaft revolutions) = 3,456. This converts the raw calculation from cubic inches per minute to cubic feet per minute (CFM)." },
            { question: "What happens if my carburetor is too big?", answer: "An oversized carb has lower air velocity through the venturis, causing: poor fuel atomization, sluggish throttle response (the dreaded 'bog' when you stab the gas), rough idle, black smoke at cruise, reduced low-RPM torque, and worse fuel economy. On a street car it's always better to err slightly small. A carb that's 50 CFM under is barely noticeable; one that's 100+ CFM over causes daily-driving misery." },
            { question: "What is the difference between vacuum and mechanical secondary carburetors?", answer: "Vacuum secondary carbs (like Holley 0-80457SA) use a diaphragm that only opens when the engine creates enough demand — perfect for street use because the secondaries stay closed in normal driving. Mechanical secondary 'double-pumpers' (like Holley 0-4779C) open via direct linkage when you floor it — instant full airflow for drag racing. For 90% of street builds, vacuum secondaries are the correct choice." },
            { question: "Does altitude affect carburetor sizing?", answer: "Yes — significantly. Air is less dense at higher altitudes, so the engine produces less power and needs less CFM. The rule of thumb is a 3% reduction per 1,000 feet above sea level. In Denver (5,280 ft), an engine needs about 16% less CFM than at sea level. A sea-level 600 CFM recommendation becomes about 500 CFM in Denver." },
            { question: "Can I use two carburetors on my engine?", answer: "Yes — a 'dual quad' setup uses two smaller 4-barrel carburetors (typically 450–500 CFM each) on a tunnel ram or cross-ram intake manifold. This provides higher peak airflow than a single 4-barrel but only benefits engines above 5,500 RPM. For street driving, a properly sized single 4-barrel always outperforms a dual quad below 4,000 RPM. Dual quads also require more tuning expertise." },
        ],
    },
    "quarter-mile-calculator": {
        subtitle: "Estimate quarter-mile elapsed time, trap speed, and 0–60 mph time from vehicle horsepower and weight.",
        contentHTML: `<h2>How to Estimate Quarter-Mile Performance</h2>
<p>The quarter mile (1,320 feet / 402 meters) is the standard drag racing distance. Two key metrics are measured: <strong>elapsed time (ET)</strong> — how long the run takes — and <strong>trap speed</strong> — the speed at the finish line.</p>
<div class="explanation__highlight"><strong>ET = ∛(Weight ÷ HP) × 5.825</strong><br/><strong>Trap = 234 ÷ ∛(Weight ÷ HP)</strong></div>
<p>These are the Roger Huntington formulas, accurate within 5% for most street vehicles between 10–18 second quarter miles. They assume good traction and competent driving.</p>
<h3>Quarter-Mile Benchmarks</h3>
<table><thead><tr><th>Vehicle Class</th><th>ET (sec)</th><th>Trap (mph)</th></tr></thead><tbody>
<tr><td>Economy Car (150 HP)</td><td>16–17</td><td>80–85</td></tr>
<tr><td>Sport Sedan (250 HP)</td><td>14–15</td><td>95–100</td></tr>
<tr><td>Sports Car (400 HP)</td><td>12–13</td><td>110–115</td></tr>
<tr><td>Muscle Car (500 HP)</td><td>11–12</td><td>120–125</td></tr>
<tr><td>Supercar (700+ HP)</td><td>9.5–10.5</td><td>135–145</td></tr>
</tbody></table>`,
        faq: [
            { question: "Why is my real quarter-mile time slower than calculated?", answer: "The formula assumes perfect traction, optimal launch, and no drivetrain losses. Real-world factors that add time: tire spin (0.2–1.0s), reaction time (0.1–0.5s), automatic transmission shift lag, altitude, temperature, and driver skill. A 12-second estimated car might run 12.5–13.0 in real conditions." },
        ],
    },
    "hp-to-weight-ratio-calculator": {
        subtitle: "Calculate your vehicle's power-to-weight ratio in HP per ton, pounds per HP, and HP per liter. Compare against performance benchmarks.",
        contentHTML: `<h2>Power-to-Weight Ratio Explained</h2>
<p>Power-to-weight ratio is the most meaningful performance metric — it determines acceleration, hill-climbing ability, and lap times better than raw horsepower alone. A lighter car with less power can outperform a heavier car with more power.</p>
<p><strong>Formula:</strong> HP/ton = HP ÷ (Weight in lbs ÷ 2,000) | lb/HP = Weight ÷ HP</p>
<h3>Real-World Comparisons</h3>
<table><thead><tr><th>Vehicle</th><th>HP</th><th>Weight</th><th>lb/HP</th></tr></thead><tbody>
<tr><td>Mazda MX-5</td><td>181</td><td>2,341 lbs</td><td>12.9</td></tr>
<tr><td>BMW M3</td><td>473</td><td>3,840 lbs</td><td>8.1</td></tr>
<tr><td>Corvette C8</td><td>495</td><td>3,366 lbs</td><td>6.8</td></tr>
<tr><td>Porsche 911 Turbo S</td><td>640</td><td>3,636 lbs</td><td>5.7</td></tr>
<tr><td>Bugatti Chiron</td><td>1,500</td><td>4,400 lbs</td><td>2.9</td></tr>
</tbody></table>`,
        faq: [
            { question: "What is a good power-to-weight ratio?", answer: "For a sporty daily driver: 10–13 lb/HP. For a fast car: 7–10 lb/HP. For a supercar: 4–7 lb/HP. Under 4 lb/HP is hypercar territory. For context, a 2024 Honda Civic Si is about 13 lb/HP; a Corvette Z06 is about 5.4 lb/HP." },
        ],
    },
    "gear-ratio-calculator": {
        subtitle: "Calculate overall gear ratio, RPM at speed, and speed at RPM from transmission gear ratio, differential ratio, and tire diameter.",
        contentHTML: `<h2>How Gear Ratios Work</h2>
<p>The overall gear ratio determines how many times the engine turns for each wheel revolution. It's the product of the <strong>transmission gear ratio</strong> and the <strong>differential (axle) ratio</strong>.</p>
<div class="explanation__highlight"><strong>Overall Ratio = Transmission Gear × Differential Ratio</strong><br/><strong>Speed (mph) = (RPM × Tire Circumference) ÷ (Overall Ratio × 63,360) × 60</strong></div>
<p>Lower (numerically higher) gears provide more torque multiplication for acceleration. Higher (numerically lower) gears allow cruising at lower RPM for fuel economy.</p>
<h3>Typical Gear Ratios</h3>
<table><thead><tr><th>Gear</th><th>Typical Ratio</th><th>Purpose</th></tr></thead><tbody>
<tr><td>1st</td><td>3.2–4.5:1</td><td>Launch, low-speed torque</td></tr>
<tr><td>2nd</td><td>1.8–2.5:1</td><td>Acceleration</td></tr>
<tr><td>3rd</td><td>1.2–1.5:1</td><td>Mid-range power</td></tr>
<tr><td>4th</td><td>1.0:1 (direct)</td><td>Cruising efficiency</td></tr>
<tr><td>5th/6th</td><td>0.65–0.85:1</td><td>Overdrive, highway fuel economy</td></tr>
</tbody></table>`,
        faq: [
            { question: "How does differential ratio affect performance?", answer: "A higher numerical axle ratio (e.g., 4.10:1 vs 3.23:1) gives better acceleration but higher RPM at highway speed (more fuel, more noise). A lower ratio gives better highway fuel economy but slower acceleration. Trucks that tow often run 3.73–4.10; fuel-economy cars run 2.73–3.23." },
        ],
    },
    "top-speed-calculator": {
        subtitle: "Estimate a vehicle's theoretical maximum speed from horsepower, weight, aerodynamic drag coefficient, and frontal area.",
        contentHTML: `<h2>How Top Speed Is Determined</h2>
<p>A vehicle's top speed is reached when engine power equals aerodynamic drag. At high speeds, drag increases with the cube of velocity — doubling your speed requires <strong>8× the power</strong>. This is why going from 150 to 200 mph requires massively more HP than going from 100 to 150.</p>
<p>The key factors are: engine power (HP), drag coefficient (Cd), frontal area, vehicle weight, and rolling resistance. For most road cars, aerodynamic drag is the dominant limiting factor above 100 mph.</p>
<h3>Drag Coefficients of Popular Vehicles</h3>
<table><thead><tr><th>Vehicle</th><th>Cd</th><th>Top Speed</th></tr></thead><tbody>
<tr><td>Tesla Model 3</td><td>0.23</td><td>162 mph</td></tr>
<tr><td>Toyota Camry</td><td>0.28</td><td>135 mph</td></tr>
<tr><td>Ford F-150</td><td>0.45</td><td>107 mph</td></tr>
<tr><td>Porsche 911</td><td>0.29</td><td>182 mph</td></tr>
<tr><td>Bugatti Chiron</td><td>0.35</td><td>261 mph</td></tr>
</tbody></table>`,
        faq: [
            { question: "Why does the Bugatti Chiron have a high Cd but still go 261 mph?", answer: "Raw power. The Chiron has 1,500 HP — enough to overcome its relatively high drag. Also, its Cd of 0.35 is a compromise: the car needs significant downforce for stability at 250+ mph, which increases drag. A slippery shape alone doesn't guarantee top speed; you need the power to push through the air." },
        ],
    },
    "dyno-correction-calculator": {
        subtitle: "Calculate SAE J1349, DIN 70020, and STD dyno correction factors from temperature, barometric pressure, and humidity to normalize dyno results.",
        contentHTML: `<h2>Why Dyno Correction Matters</h2>
<p>Engine output varies with atmospheric conditions. A hot, humid day at high altitude produces less power than a cold, dry day at sea level because the air is less dense — there's less oxygen per cubic foot for combustion.</p>
<p>Dyno correction factors normalize results to <strong>standard reference conditions</strong> so runs on different days can be fairly compared.</p>
<h3>Standard Reference Conditions</h3>
<table><thead><tr><th>Standard</th><th>Temp</th><th>Pressure</th><th>Used By</th></tr></thead><tbody>
<tr><td>SAE J1349</td><td>77°F (25°C)</td><td>29.235 inHg</td><td>US manufacturers</td></tr>
<tr><td>DIN 70020</td><td>68°F (20°C)</td><td>29.92 inHg</td><td>European manufacturers</td></tr>
<tr><td>STD (ISA)</td><td>59°F (15°C)</td><td>29.92 inHg</td><td>Aviation / general</td></tr>
</tbody></table>
<p><strong>Example:</strong> An engine makes 300 observed HP on a 95°F day at 28.5 inHg. SAE correction factor = 1.085, so corrected HP = 300 × 1.085 = <strong>325.5 HP</strong>.</p>`,
        faq: [
            { question: "Which correction standard should I use?", answer: "Use SAE J1349 for US-market comparisons. Use DIN for European vehicles. STD is most conservative (lower correction factors). Most US dyno shops report SAE-corrected numbers. When comparing runs, always use the same standard." },
        ],
    },
};

export default async function EngineCalcHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("engine").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/automotive-calculators/engine-performance/${calc.slug}`);
    const schemaData = JSON.stringify([breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Automotive Calculators", url: canonicalUrl("/automotive-calculators") }, { name: "Engine & Performance", url: canonicalUrl("/automotive-calculators/engine-performance") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl)]);
    const allEngineCalcs = getCalculatorsByCategory("engine").filter(c => c.slug !== calculator);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-engine-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Automotive", href: "/automotive-calculators" }, { label: "Engine & Performance", href: "/automotive-calculators/engine-performance" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <EnginePerformanceCalculatorCore calcType={calc.calcType || "engine-hp"} />
                    <AuthorBadge categoryKey="engine" />
                    {content && (<>
                        <DynamicExplanation heading={`How to Use the ${calc.title}`} contentHTML={content.contentHTML} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    <RelatedCalculators calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar">
                    <div className="sidebar-card" style={{ position: "sticky", top: "80px" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>🔧 Engine & Performance Tools</h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            {allEngineCalcs.slice(0, 9).map(c => (
                                <li key={c.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                                    <a href={`/automotive-calculators/engine-performance/${c.slug}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.87rem", textDecoration: "none", color: "var(--text)" }}>
                                        <span>{c.title.replace(/ Calculator$/, "")}</span>
                                        <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>→</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <a href="/automotive-calculators/engine-performance" style={{ display: "block", marginTop: "14px", fontSize: "0.82rem", color: "#d4620a", fontWeight: 600, textDecoration: "none" }}>View all Engine Calculators →</a>
                    </div>
                </aside>
            </div>
        </main>
    );
}
