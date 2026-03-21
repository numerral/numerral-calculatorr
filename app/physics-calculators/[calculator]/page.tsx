// Dynamic Hub — /physics-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PhysicsCalculatorCore from "@/components/calculator/PhysicsCalculatorCore";
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
    return getCalculatorsByCategory("physics").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("physics").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/physics-calculators/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; explanation?: { heading: string; paragraphs?: string[]; contentHTML?: string; highlight?: string }; faq?: { question: string; answer: string }[] }> = {

    "acceleration-calculator": {
        subtitle: "Calculate acceleration from initial velocity, final velocity, and time using the kinematic equation a = (v₂ − v₁) / t. Supports m/s², ft/s², and g-force conversions.",
        explanation: { heading: "How to Calculate Acceleration", contentHTML: `<p><strong>Acceleration</strong> measures the rate of change of velocity over time. It's a vector quantity — it has both magnitude and direction.</p>
<h3>Formula</h3><div class="explanation__highlight"><strong>a = (v₂ − v₁) / t</strong><br/><br/>Where a = acceleration (m/s²), v₁ = initial velocity (m/s), v₂ = final velocity (m/s), t = time (s).</div>
<h3>Example: Car Accelerating 0–60 mph</h3><div class="explanation__highlight">0 to 60 mph = 0 to 26.82 m/s in 8 seconds:<br/>a = (26.82 − 0) / 8 = <strong>3.35 m/s²</strong> = 0.34 g</div>
<p>Negative acceleration (deceleration) occurs when the final velocity is less than the initial velocity. A car braking from 60 mph to 0 in 5 seconds has a = (0 − 26.82) / 5 = −5.36 m/s².</p>
<h3>References</h3><ul><li>Halliday, Resnick & Walker — Fundamentals of Physics, 12th Edition</li><li>University Physics — Young & Freedman, 15th Edition</li></ul>`, highlight: "A car going 0–60 mph in 8 seconds has an acceleration of 3.35 m/s² (0.34 g). A sports car doing it in 3 seconds: 8.94 m/s² (0.91 g)." },
        faq: [
            { question: "What is the acceleration due to gravity?", answer: "On Earth, the acceleration due to gravity (g) is approximately 9.81 m/s² (32.2 ft/s²). This means a freely falling object increases its speed by 9.81 m/s every second, ignoring air resistance." },
            { question: "What is the difference between acceleration and velocity?", answer: "Velocity is how fast something moves (m/s). Acceleration is how quickly the velocity changes (m/s²). A car traveling at a constant 60 mph has zero acceleration. A car speeding up from 0 to 60 mph has positive acceleration." },
            { question: "Can acceleration be negative?", answer: "Yes — negative acceleration (deceleration) means the object is slowing down. When you brake a car, the acceleration is negative." },
        ],
    },

    "angular-acceleration-calculator": {
        subtitle: "Calculate angular acceleration (α) from initial and final angular velocity and time. Results in rad/s², RPM/s, and deg/s².",
        explanation: { heading: "How to Calculate Angular Acceleration", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>α = (ω₂ − ω₁) / t</strong><br/><br/>Where α = angular acceleration (rad/s²), ω = angular velocity (rad/s), t = time (s).</div>
<p>Angular acceleration describes how quickly a rotating object speeds up or slows down. It's the rotational equivalent of linear acceleration.</p>`, highlight: "A motor spinning up from 0 to 1,800 RPM in 5 seconds has α = 37.7 rad/s²." },
    },

    "angular-velocity-calculator": {
        subtitle: "Calculate angular velocity (ω) from RPM or from angle and time. Convert between rad/s, RPM, and deg/s.",
        explanation: { heading: "How to Calculate Angular Velocity", contentHTML: `<h3>Formulas</h3><div class="explanation__highlight"><strong>From RPM:</strong> ω = 2π × RPM / 60<br/><strong>From angle:</strong> ω = θ / t<br/><br/>Where ω is in rad/s, RPM = revolutions per minute, θ = angle in radians, t = time in seconds.</div>
<p>Angular velocity describes how fast something rotates. A standard US electrical motor runs at 1,800 RPM = 188.5 rad/s.</p>`, highlight: "1,800 RPM = 188.5 rad/s. Common motor speeds: 900, 1200, 1800, and 3600 RPM." },
    },

    "average-velocity-calculator": {
        subtitle: "Calculate average velocity from displacement and time. Results in m/s, km/h, and mph.",
        explanation: { heading: "How to Calculate Average Velocity", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>v = Δx / Δt</strong><br/><br/>Where v = average velocity (m/s), Δx = displacement (m), Δt = time (s).</div>
<p>Average velocity uses <strong>displacement</strong> (straight-line distance from start to end), not total distance traveled. If you drive 100 miles north and then 100 miles south, your displacement is 0, so your average velocity is 0 — even though your average speed wasn't.</p>` },
    },

    "centrifugal-force-calculator": {
        subtitle: "Calculate centrifugal force for rotating objects using F = mv²/r. Enter mass, velocity, and radius to find the outward force.",
        explanation: { heading: "How to Calculate Centrifugal Force", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>F = mv²/r</strong> = mω²r<br/><br/>Where F = centrifugal force (N), m = mass (kg), v = tangential velocity (m/s), r = radius (m).</div>
<p>Centrifugal force is the <strong>apparent outward force</strong> experienced by an object moving in a circle. In physics, it's a "pseudo-force" that arises in a rotating reference frame. It has the same magnitude as centripetal force but acts outward.</p>`, highlight: "A 5 kg mass spinning at 10 m/s on a 2 m string experiences 250 N of centrifugal force." },
    },

    "centripetal-force-calculator": {
        subtitle: "Calculate centripetal force for circular motion using F = mv²/r. Find the inward force keeping objects in a curved path.",
        explanation: { heading: "How to Calculate Centripetal Force", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>F = mv²/r</strong><br/><br/>Where F = centripetal force (N), m = mass (kg), v = speed (m/s), r = radius of curvature (m).</div>
<p>Centripetal force is the <strong>real inward force</strong> that keeps an object moving in a circle. For a car turning, it's the friction between tires and road. For a satellite, it's gravity. For a ball on a string, it's the tension.</p>
<h3>Example: Car on a Curve</h3><div class="explanation__highlight">A 1,500 kg car traveling at 20 m/s (45 mph) around a 50 m radius curve:<br/>F = 1,500 × 20² / 50 = <strong>12,000 N</strong><br/>Centripetal acceleration = v²/r = 400/50 = 8 m/s² (0.82 g)</div>`, highlight: "A 1,500 kg car at 45 mph on a 50 m curve needs 12,000 N of friction — about 0.82 g of lateral force." },
        faq: [
            { question: "What provides centripetal force?", answer: "Different forces can act as centripetal force: friction (car turning), gravity (planetary orbits), tension (ball on string), normal force (roller coaster loops), or electromagnetic force (charged particles in magnetic fields)." },
        ],
    },

    "coefficient-of-friction-calculator": {
        subtitle: "Calculate the coefficient of friction (μ) from friction force and normal force. Includes a reference table of common material pairs.",
        explanation: { heading: "How to Calculate Coefficient of Friction", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>μ = F_friction / F_normal</strong><br/><br/>The coefficient of friction is dimensionless — it has no units. Static friction (μs) > Kinetic friction (μk) for the same surface pair.</div>
<p>There are two types: <strong>static friction</strong> (resistance to starting movement) and <strong>kinetic friction</strong> (resistance during movement). Static μ is always higher than kinetic μ — it takes more force to start sliding than to keep sliding.</p>` },
    },

    "displacement-calculator": {
        subtitle: "Calculate displacement using the kinematic equation s = v₀t + ½at². Enter initial velocity, acceleration, and time.",
        explanation: { heading: "How to Calculate Displacement", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>s = v₀t + ½at²</strong><br/><br/>Where s = displacement (m), v₀ = initial velocity (m/s), a = acceleration (m/s²), t = time (s).</div>
<p>This is one of the four SUVAT equations (kinematics equations) used to describe motion with constant acceleration. It gives the total displacement from the starting point.</p>
<h3>Example: Free Fall</h3><div class="explanation__highlight">An object dropped from rest (v₀ = 0) under gravity (a = 9.81 m/s²) for 5 seconds:<br/>s = 0 + ½(9.81)(25) = <strong>122.6 meters</strong></div>`, highlight: "An object in free fall for 5 seconds drops 122.6 meters (402 feet). The SUVAT equation s = v₀t + ½at² is the foundation of kinematics." },
    },

    "elastic-potential-energy-calculator": {
        subtitle: "Calculate elastic potential energy stored in a spring using PE = ½kx². Enter spring constant (k) and displacement (x).",
        explanation: { heading: "How to Calculate Elastic Potential Energy", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>PE = ½kx²</strong><br/><br/>Where PE = elastic potential energy (J), k = spring constant (N/m), x = displacement from equilibrium (m).</div>
<p>Elastic PE is the energy stored in any elastic material when it's deformed — springs, rubber bands, bows, and even trampoline mats. The energy increases with the <strong>square</strong> of displacement, so doubling the stretch quadruples the stored energy.</p>` },
    },

    "force-calculator": {
        subtitle: "Calculate force using Newton's Second Law: F = ma. Enter mass and acceleration to find force in newtons (N), pounds-force (lbf), and kilonewtons (kN).",
        explanation: { heading: "How to Calculate Force (Newton's Second Law)", contentHTML: `<p><strong>Newton's Second Law</strong> is the most fundamental equation in classical mechanics. It states that the net force on an object equals its mass times its acceleration.</p>
<h3>Formula</h3><div class="explanation__highlight"><strong>F = m × a</strong><br/><br/>Where F = force (newtons, N), m = mass (kg), a = acceleration (m/s²).<br/><br/>1 newton = 1 kg⋅m/s² = the force needed to accelerate 1 kg by 1 m/s².</div>
<h3>Weight vs. Force</h3><p><strong>Weight</strong> is just the force of gravity on an object: W = mg. A 70 kg person weighs 70 × 9.81 = 686.7 N (154.3 lbf) on Earth.</p>
<h3>Example: Pushing a Car</h3><div class="explanation__highlight">Pushing a 1,500 kg car with 3,000 N of force:<br/>a = F/m = 3,000 / 1,500 = <strong>2 m/s²</strong><br/>After 5 seconds: v = 0 + 2(5) = 10 m/s (22 mph)</div>
<h3>References</h3><ul><li>Newton's Principia Mathematica, 1687</li><li>Halliday, Resnick & Walker — Fundamentals of Physics</li></ul>`, highlight: "F = ma. A 70 kg person weighs 686.7 N on Earth. Weight on the Moon (g = 1.62 m/s²): only 113.4 N." },
        faq: [
            { question: "What is a newton?", answer: "A newton (N) is the SI unit of force. 1 N = the force needed to accelerate 1 kg by 1 m/s². On Earth, 1 kg of mass has a weight of about 9.81 N (2.2 lbf)." },
            { question: "What is the difference between mass and weight?", answer: "Mass (kg) is the amount of matter — it's the same everywhere. Weight (N) is the force of gravity on that mass — it changes with location. A 70 kg person weighs 686.7 N on Earth but only 113.4 N on the Moon." },
            { question: "Can force be negative?", answer: "Force is a vector, so it has direction. 'Negative force' typically means force in the opposite direction to what's defined as positive. For example, if forward is positive, a braking force is negative." },
        ],
    },

    "frequency-calculator": {
        subtitle: "Calculate frequency from period (f = 1/T) or from wave speed and wavelength (f = v/λ). Results in Hz, kHz, MHz.",
        explanation: { heading: "How to Calculate Frequency", contentHTML: `<h3>Formulas</h3><div class="explanation__highlight"><strong>From period:</strong> f = 1/T<br/><strong>From wave:</strong> f = v/λ<br/><br/>Where f = frequency (Hz), T = period (s), v = wave speed (m/s), λ = wavelength (m).</div>
<p>Frequency measures how often a repeating event occurs per second. 1 Hz = 1 cycle per second. Sound frequencies range from 20 Hz (lowest bass) to 20,000 Hz (highest pitch humans hear).</p>`, highlight: "The speed of sound in air is 343 m/s. Concert A = 440 Hz, wavelength = 0.78 m." },
    },

    "friction-force-calculator": {
        subtitle: "Calculate friction force using F_f = μ × F_n. Enter the coefficient of friction and normal force.",
        explanation: { heading: "How to Calculate Friction Force", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>F_f = μ × F_n</strong><br/><br/>Where F_f = friction force (N), μ = coefficient of friction, F_n = normal force (N).</div>
<p>Friction always opposes the direction of motion (or attempted motion). On a flat surface, the normal force equals weight (mg). On an incline at angle θ, normal force = mg cos(θ).</p>` },
    },

    "gravitational-force-calculator": {
        subtitle: "Calculate gravitational attraction between two masses using Newton's Law of Universal Gravitation: F = Gm₁m₂/r².",
        explanation: { heading: "How to Calculate Gravitational Force", contentHTML: `<h3>Newton's Law of Universal Gravitation</h3><div class="explanation__highlight"><strong>F = G × m₁ × m₂ / r²</strong><br/><br/>Where G = 6.674 × 10⁻¹¹ N⋅m²/kg², m₁ and m₂ = masses (kg), r = distance between centers (m).</div>
<p>Every object with mass attracts every other object with mass. The force is proportional to both masses and inversely proportional to the square of the distance between them.</p>
<h3>Example: Your Weight</h3><div class="explanation__highlight">Earth mass = 5.972 × 10²⁴ kg, a 70 kg person, r = 6.371 × 10⁶ m:<br/>F = (6.674e-11 × 5.972e24 × 70) / (6.371e6)² = <strong>686.4 N</strong> (154.3 lbs)</div>`, highlight: "Gravity between you (70 kg) and Earth: 686.4 N. This is your weight — it's the same as mg = 70 × 9.81." },
    },

    "gravitational-potential-energy-calculator": {
        subtitle: "Calculate gravitational potential energy using PE = mgh. Enter mass, height, and gravity (default g = 9.81 m/s²).",
        explanation: { heading: "How to Calculate Gravitational Potential Energy", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>PE = mgh</strong><br/><br/>Where PE = potential energy (J), m = mass (kg), g = 9.81 m/s², h = height (m).</div>
<p>Gravitational PE is the energy stored by an object due to its position in a gravitational field. When the object falls, this PE converts to kinetic energy. At the bottom, all PE has become KE (ignoring air resistance).</p>
<h3>Example: Water Behind a Dam</h3><div class="explanation__highlight">1,000 kg of water at 100 m height:<br/>PE = 1,000 × 9.81 × 100 = <strong>981,000 J = 981 kJ</strong><br/>This is enough to power a 100W bulb for 2.7 hours.</div>`, highlight: "1,000 kg of water at 100 m = 981 kJ of potential energy. Hydroelectric dams convert this PE to electricity." },
    },

    "kinetic-energy-calculator": {
        subtitle: "Calculate kinetic energy using KE = ½mv². Enter mass and velocity to find energy in joules. Includes vehicle comparison table.",
        explanation: { heading: "How to Calculate Kinetic Energy", contentHTML: `<p><strong>Kinetic energy</strong> is the energy of motion. Any moving object has kinetic energy proportional to its mass and the <strong>square</strong> of its velocity — meaning doubling speed quadruples KE.</p>
<h3>Formula</h3><div class="explanation__highlight"><strong>KE = ½mv²</strong><br/><br/>Where KE = kinetic energy (J), m = mass (kg), v = velocity (m/s).</div>
<h3>Why Speed Matters More Than Mass</h3><p>Because KE depends on v², speed has a much larger effect than mass. A car at 60 mph has <strong>4× the KE</strong> of the same car at 30 mph — and needs 4× the braking distance.</p>
<h3>Example: Car at 60 mph</h3><div class="explanation__highlight">A 1,500 kg car at 60 mph (26.8 m/s):<br/>KE = ½ × 1,500 × 26.8² = <strong>538,680 J ≈ 539 kJ</strong><br/><br/>At 30 mph: KE = 134,670 J ≈ 135 kJ<br/>Doubling speed → 4× the energy → 4× the stopping distance.</div>
<h3>References</h3><ul><li>Halliday, Resnick & Walker — Fundamentals of Physics</li><li>NHTSA — Vehicle Stopping Distance Research</li></ul>`, highlight: "A car at 60 mph has 539 kJ of kinetic energy — 4× more than at 30 mph. This is why stopping distance quadruples with doubled speed." },
        faq: [
            { question: "Why does doubling speed quadruple kinetic energy?", answer: "Because KE = ½mv², the velocity is squared. Doubling v makes v² = 4×, so KE increases by 4×. This is why highway accidents are far more destructive than city crashes." },
            { question: "What is the kinetic energy of a bullet?", answer: "A typical 9mm bullet (8g, 370 m/s): KE = ½ × 0.008 × 370² = 548 J. A .30-06 rifle bullet (10g, 870 m/s): KE = 3,785 J. Despite tiny mass, high velocity creates enormous KE." },
        ],
    },

    "magnitude-of-acceleration-calculator": {
        subtitle: "Calculate the magnitude of acceleration from its x and y components using |a| = √(ax² + ay²). Find the resultant acceleration vector.",
        explanation: { heading: "How to Calculate Magnitude of Acceleration", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>|a| = √(ax² + ay²)</strong><br/><br/>Direction: θ = arctan(ay / ax)</div>
<p>When acceleration has components in multiple directions, the magnitude gives the total acceleration. This is the Pythagorean theorem applied to vectors.</p>` },
    },

    "mass-calculator": {
        subtitle: "Calculate mass from force and acceleration (m = F/a) or from density and volume (m = ρV). Convert between kg and lbs.",
        explanation: { heading: "How to Calculate Mass", contentHTML: `<h3>Formulas</h3><div class="explanation__highlight"><strong>From Newton's Law:</strong> m = F / a<br/><strong>From density:</strong> m = ρ × V<br/><br/>Where m = mass (kg), F = force (N), a = acceleration (m/s²), ρ = density (kg/m³), V = volume (m³).</div>
<p>Mass is a fundamental property of matter. It determines how much an object resists acceleration (inertia) and how strongly it's attracted by gravity.</p>` },
    },

    "momentum-calculator": {
        subtitle: "Calculate linear momentum using p = mv. Enter mass and velocity to find momentum in kg⋅m/s (N⋅s). Includes examples for common objects.",
        explanation: { heading: "How to Calculate Momentum", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>p = m × v</strong><br/><br/>Where p = momentum (kg⋅m/s), m = mass (kg), v = velocity (m/s).</div>
<p><strong>Conservation of momentum</strong> is one of the most important principles in physics: in any collision, total momentum before = total momentum after (if no external forces act). This applies to billiard balls, car crashes, rocket propulsion, and nuclear reactions.</p>
<h3>Impulse-Momentum Theorem</h3><div class="explanation__highlight"><strong>F × Δt = Δp = m × Δv</strong><br/><br/>Force × time = change in momentum. This is why airbags work — they increase the collision time, reducing the force on passengers.</div>`, highlight: "A 1,500 kg car at 30 mph has 20,100 kg⋅m/s of momentum. Airbags reduce force by increasing collision time (impulse)." },
        faq: [
            { question: "What is the law of conservation of momentum?", answer: "In any closed system (no external forces), total momentum is conserved. In a collision: m₁v₁ + m₂v₂ (before) = m₁v₁' + m₂v₂' (after). This applies to all collisions — elastic and inelastic." },
        ],
    },

    "net-force-calculator": {
        subtitle: "Calculate the net (resultant) force from multiple forces with different magnitudes and directions. Add or remove forces dynamically.",
        explanation: { heading: "How to Calculate Net Force", contentHTML: `<h3>Method</h3><div class="explanation__highlight">1. Break each force into x and y components:<br/>Fx = F × cos(θ), Fy = F × sin(θ)<br/><br/>2. Sum all x-components and y-components:<br/>ΣFx = F₁x + F₂x + ..., ΣFy = F₁y + F₂y + ...<br/><br/>3. Find magnitude and direction:<br/><strong>F_net = √(ΣFx² + ΣFy²)</strong><br/>θ = arctan(ΣFy / ΣFx)</div>
<p>Net force determines the acceleration of an object (F = ma). If net force is zero, the object is in <strong>equilibrium</strong> — either stationary or moving at constant velocity.</p>` },
    },

    "normal-force-calculator": {
        subtitle: "Calculate normal force on flat and inclined surfaces using F_n = mg cos(θ). See the parallel component that drives sliding.",
        explanation: { heading: "How to Calculate Normal Force", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>F_n = mg cos(θ)</strong><br/><br/>Where F_n = normal force (N), m = mass (kg), g = 9.81 m/s², θ = incline angle (°).<br/><br/>On a flat surface (θ = 0°): F_n = mg (full weight).<br/>On a 30° incline: F_n = mg × cos(30°) = 0.866 × mg.</div>
<p>The normal force is the <strong>perpendicular contact force</strong> from a surface. It prevents objects from falling through the surface. On inclines, it's less than the full weight because part of gravity acts along the slope.</p>` },
    },

    "specific-heat-calculator": {
        subtitle: "Calculate heat energy using Q = mcΔT. Enter mass, specific heat capacity, and temperature change. Includes a table of common materials.",
        explanation: { heading: "How to Calculate Heat Energy (Specific Heat)", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Q = mcΔT</strong><br/><br/>Where Q = heat energy (J), m = mass (kg), c = specific heat capacity (J/kg⋅°C), ΔT = temperature change (°C).</div>
<p>Specific heat capacity tells you how much energy is needed to raise 1 kg of a material by 1°C. Water has one of the highest specific heats (4,186 J/kg⋅°C), which is why it's used in cooling systems and why coastal climates are more moderate.</p>
<h3>Example: Heating Water</h3><div class="explanation__highlight">Heating 1 liter (1 kg) of water from 20°C to 100°C:<br/>Q = 1 × 4,186 × 80 = <strong>334,880 J = 335 kJ</strong><br/>That's about 80 food calories (Calories).</div>`, highlight: "Heating 1 kg of water by 80°C requires 335 kJ. Water's high specific heat (4,186 J/kg⋅°C) is why oceans moderate coastal climates." },
        faq: [
            { question: "Why does water have such a high specific heat?", answer: "Water molecules form strong hydrogen bonds that require significant energy to break. This makes water excellent for storing thermal energy, cooling systems, and temperature regulation in biological organisms." },
        ],
    },

    "speed-calculator": {
        subtitle: "Calculate speed from distance and time. Results in m/s, km/h, and mph. Includes a speed reference table from walking to light speed.",
        explanation: { heading: "How to Calculate Speed", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>Speed = Distance / Time</strong><br/><br/>Where speed is in m/s, distance in meters, time in seconds.</div>
<p>Speed is a <strong>scalar</strong> quantity — it has magnitude but no direction. The average speed of a US highway driver is about 31.3 m/s (70 mph).</p>
<h3>Unit Conversions</h3><ul><li>1 m/s = 3.6 km/h = 2.237 mph</li><li>1 mph = 0.447 m/s = 1.609 km/h</li><li>1 km/h = 0.278 m/s = 0.621 mph</li></ul>` },
    },

    "spring-constant-calculator": {
        subtitle: "Calculate the spring constant (k) using Hooke's Law: k = F/x. Enter force and displacement to find stiffness in N/m.",
        explanation: { heading: "How to Calculate Spring Constant (Hooke's Law)", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>k = F / x</strong><br/><br/>Where k = spring constant (N/m), F = applied force (N), x = displacement (m).<br/><br/>This is Hooke's Law: F = kx (the restoring force is proportional to displacement).</div>
<p>The spring constant measures <strong>stiffness</strong>. A higher k means a stiffer spring. Car suspension springs typically have k = 10,000–50,000 N/m, while a Slinky has k ≈ 1 N/m.</p>` },
    },

    "terminal-velocity-calculator": {
        subtitle: "Calculate terminal velocity using v_t = √(2mg / ρACd). Enter mass, drag coefficient, cross-sectional area, and air density.",
        explanation: { heading: "How to Calculate Terminal Velocity", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>vt = √(2mg / ρACd)</strong><br/><br/>Where vt = terminal velocity (m/s), m = mass (kg), g = 9.81 m/s², ρ = air density (kg/m³), A = cross-sectional area (m²), Cd = drag coefficient.</div>
<p>Terminal velocity occurs when the <strong>drag force equals weight</strong>, resulting in zero net force and zero acceleration. The object falls at constant speed. It depends on mass, shape (Cd), size (A), and air density (ρ).</p>
<h3>Typical Drag Coefficients</h3>
<table><thead><tr><th>Shape</th><th>Cd</th></tr></thead><tbody>
<tr><td>Sphere</td><td>0.47</td></tr>
<tr><td>Cube</td><td>1.05</td></tr>
<tr><td>Flat plate (perpendicular)</td><td>1.28</td></tr>
<tr><td>Skydiver (belly)</td><td>1.0</td></tr>
<tr><td>Streamlined body</td><td>0.04</td></tr>
</tbody></table>`, highlight: "A skydiver (75 kg, belly-down, Cd=1.0, A=0.7 m²) has a terminal velocity of ~55 m/s (120 mph). Head-down: ~90 m/s (200 mph)." },
    },

    "velocity-calculator": {
        subtitle: "Calculate final velocity using the kinematic equation v = v₀ + at. Enter initial velocity, acceleration, and time.",
        explanation: { heading: "How to Calculate Velocity", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>v = v₀ + at</strong><br/><br/>Where v = final velocity (m/s), v₀ = initial velocity (m/s), a = acceleration (m/s²), t = time (s).</div>
<p>This is the simplest kinematic equation. It tells you the velocity at any time given constant acceleration. An object in free fall (a = 9.81 m/s²) starting from rest reaches 49 m/s (110 mph) after just 5 seconds.</p>`, highlight: "An object in free fall reaches 49 m/s (110 mph) after 5 seconds, and 98 m/s (220 mph) after 10 seconds." },
    },

    "wavelength-calculator": {
        subtitle: "Calculate wavelength from wave speed and frequency using λ = v/f. Works for sound, light, and any wave type. Includes musical note reference table.",
        explanation: { heading: "How to Calculate Wavelength", contentHTML: `<h3>Formula</h3><div class="explanation__highlight"><strong>λ = v / f</strong><br/><br/>Where λ = wavelength (m), v = wave speed (m/s), f = frequency (Hz).</div>
<p>The wave equation connects three fundamental wave properties. For sound in air (v ≈ 343 m/s), audible wavelengths range from about 17 m (20 Hz) to 1.7 cm (20,000 Hz). For light (v = 3×10⁸ m/s), visible wavelengths are 380–700 nm.</p>
<h3>Speed of Sound in Different Media</h3>
<table><thead><tr><th>Medium</th><th>Speed (m/s)</th></tr></thead><tbody>
<tr><td>Air (20°C)</td><td>343</td></tr>
<tr><td>Water (25°C)</td><td>1,497</td></tr>
<tr><td>Steel</td><td>5,960</td></tr>
<tr><td>Glass</td><td>5,640</td></tr>
</tbody></table>`, highlight: "Sound in air: 343 m/s. Concert A (440 Hz) has a wavelength of 0.78 m. Light: 3×10⁸ m/s, visible light is 380–700 nm." },
        faq: [
            { question: "What is the wavelength of visible light?", answer: "Visible light ranges from about 380 nm (violet) to 700 nm (red). Blue ≈ 470 nm, green ≈ 530 nm, yellow ≈ 580 nm, orange ≈ 600 nm. All at the speed of light: 3×10⁸ m/s." },
        ],
    },
};

export default async function PhysicsCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("physics").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/physics-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Physics Calculators", url: canonicalUrl("/physics-calculators") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl)]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-physics-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Physics Calculators", href: "/physics-calculators" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <AuthorBadge categoryKey="physics" />
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <PhysicsCalculatorCore calcType={calc.calcType || "acceleration"} />
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
