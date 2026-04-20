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
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
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
        explanation: { heading: "How to Calculate Acceleration", contentHTML: `<h2>What Is Acceleration?</h2>
<p>In physics, acceleration is the rate at which an object's <a href="/physics-calculators/velocity-calculator">velocity</a> changes over time. It is a vector quantity, meaning it has both magnitude and direction. An object accelerates whenever it speeds up, slows down, or changes direction.</p>
<p>The standard unit of acceleration in the International System of Units (SI) is meters per second squared (m/s²). One m/s² means the object's velocity increases by one meter per second every second. You can also express acceleration in terms of the gravitational constant g, where 1 g = 9.81 m/s².</p>

<h2>How to Calculate Acceleration</h2>
<p>To calculate acceleration, you need to know the initial <a href="/physics-calculators/velocity-calculator">velocity</a>, the final velocity, and the time interval. You can then use the kinematic acceleration formula derived from Newton's second law of motion.</p>

<h3>Acceleration Formula</h3>
<p>The formula to calculate acceleration is:</p>
<div class="explanation__highlight"><strong>a = (v₂ − v₁) / t</strong></div>
<p>Where:</p>
<ul><li><strong>a</strong> = acceleration (m/s²)</li><li><strong>v₁</strong> = initial velocity (m/s)</li><li><strong>v₂</strong> = final velocity (m/s)</li><li><strong>t</strong> = time elapsed (s)</li></ul>
<p>For example, let's calculate the acceleration of a car that goes from 0 to 60 mph in 8 seconds. First, convert 60 mph to meters per second: 60 × 0.44704 = 26.82 m/s.</p>
<p>a = (26.82 − 0) / 8<br/>a = 26.82 / 8<br/>a = <strong>3.35 m/s²</strong></p>
<p>This is equivalent to about 0.34 g. A sports car doing 0–60 mph in 3 seconds has an acceleration of 8.94 m/s² (0.91 g).</p>

<h2>Deceleration (Negative Acceleration)</h2>
<p>When an object slows down, its acceleration is negative — this is often called deceleration. For example, a car braking from 60 mph to a complete stop in 5 seconds has a negative acceleration:</p>
<p>a = (0 − 26.82) / 5 = <strong>−5.36 m/s²</strong></p>
<p>The negative sign indicates the car's velocity is decreasing. You can use our <a href="/physics-calculators/force-calculator">force calculator</a> to find the braking force required to produce this deceleration using Newton's second law, F = ma.</p>

<h2>Acceleration Due to Gravity</h2>
<p>Near the Earth's surface, all objects in free fall experience the same acceleration due to gravity, regardless of their <a href="/physics-calculators/mass-calculator">mass</a>. This acceleration, denoted g, is approximately 9.81 m/s² (32.2 ft/s²).</p>
<p>This means a freely falling object increases its <a href="/physics-calculators/speed-calculator">speed</a> by 9.81 m/s every second, ignoring air resistance. After 5 seconds of free fall, an object reaches a velocity of 49 m/s (110 mph) and has fallen a <a href="/physics-calculators/displacement-calculator">displacement</a> of about 122.6 meters.</p>
<p>You can also find the <a href="/physics-calculators/magnitude-of-acceleration-calculator">magnitude of acceleration</a> when it has components in multiple directions.</p>`, highlight: "A car going 0–60 mph in 8 seconds has an acceleration of 3.35 m/s² (0.34 g). A sports car doing it in 3 seconds: 8.94 m/s² (0.91 g)." },
        faq: [
            { question: "What is the acceleration due to gravity?", answer: "On Earth, the acceleration due to gravity (g) is approximately 9.81 m/s² (32.2 ft/s²). This means a freely falling object increases its speed by 9.81 m/s every second, ignoring air resistance. On the Moon, g is about 1.62 m/s², and on Mars it is about 3.72 m/s²." },
            { question: "What is the difference between acceleration and velocity?", answer: "Velocity measures how fast something moves and in what direction (m/s). Acceleration measures how quickly the velocity changes (m/s²). A car traveling at a constant 60 mph has zero acceleration. A car speeding up from 0 to 60 mph has positive acceleration. You can calculate velocity using our velocity calculator." },
            { question: "Can acceleration be negative?", answer: "Yes — negative acceleration (deceleration) means the object is slowing down. When you apply the brakes on a car, the acceleration is negative because the velocity is decreasing. The force required to decelerate an object can be found using F = ma." },
        ],
    },

    "angular-acceleration-calculator": {
        subtitle: "Calculate angular acceleration (α) from initial and final angular velocity and time. Results in rad/s², RPM/s, and deg/s².",
        explanation: { heading: "How to Calculate Angular Acceleration", contentHTML: `<h2>What Is Angular Acceleration?</h2>
<p>Angular acceleration is the rate at which an object's <a href="/physics-calculators/angular-velocity-calculator">angular velocity</a> changes over time. It is the rotational equivalent of linear <a href="/physics-calculators/acceleration-calculator">acceleration</a>. Angular acceleration is measured in radians per second squared (rad/s²).</p>
<p>When a motor spins up from rest, or a spinning wheel slows to a stop, angular acceleration describes how quickly that rotational speed changes. A positive angular acceleration means the object is spinning faster, while a negative value means it is slowing down.</p>

<h2>How to Calculate Angular Acceleration</h2>
<p>To calculate angular acceleration, you need the initial angular velocity, the final angular velocity, and the time interval over which the change occurs.</p>

<h3>Angular Acceleration Formula</h3>
<p>The formula to find angular acceleration is:</p>
<div class="explanation__highlight"><strong>α = (ω₂ − ω₁) / t</strong></div>
<p>Where:</p>
<ul><li><strong>α</strong> = angular acceleration (rad/s²)</li><li><strong>ω₁</strong> = initial angular velocity (rad/s)</li><li><strong>ω₂</strong> = final angular velocity (rad/s)</li><li><strong>t</strong> = time (s)</li></ul>
<p>For example, let's find the angular acceleration of a motor that spins up from rest to 1,800 RPM in 5 seconds. First, convert RPM to rad/s: 1,800 × 2π / 60 = 188.5 rad/s.</p>
<p>α = (188.5 − 0) / 5 = <strong>37.7 rad/s²</strong></p>

<h2>Relationship to Linear Acceleration</h2>
<p>Angular acceleration and linear acceleration are connected through the radius: a = α × r. A point on the rim of a spinning wheel at radius r experiences a tangential (linear) acceleration proportional to α. This relationship is important for calculating <a href="/physics-calculators/centripetal-force-calculator">centripetal force</a> and <a href="/physics-calculators/centrifugal-force-calculator">centrifugal force</a> in rotating systems.</p>`, highlight: "A motor spinning up from 0 to 1,800 RPM in 5 seconds has an angular acceleration of 37.7 rad/s²." },
        faq: [
            { question: "What units is angular acceleration measured in?", answer: "Angular acceleration is typically measured in radians per second squared (rad/s²). It can also be expressed in RPM per second (RPM/s) or degrees per second squared (°/s²). To convert RPM/s to rad/s², multiply by 2π/60." },
        ],
    },

    "angular-velocity-calculator": {
        subtitle: "Calculate angular velocity (ω) from RPM or from angle and time. Convert between rad/s, RPM, and deg/s.",
        explanation: { heading: "How to Calculate Angular Velocity", contentHTML: `<h2>What Is Angular Velocity?</h2>
<p>Angular velocity describes how fast an object rotates or revolves. It measures the angle an object sweeps through per unit of time and is typically expressed in radians per second (rad/s), revolutions per minute (RPM), or degrees per second (°/s).</p>
<p>Angular velocity is a key concept in rotational mechanics, used to describe everything from motors and turbines to the rotation of the Earth. It is the rotational analog of the linear <a href="/physics-calculators/velocity-calculator">velocity</a> you would calculate for an object moving in a straight line.</p>

<h2>How to Calculate Angular Velocity</h2>
<p>There are two common ways to calculate angular velocity, depending on what information you have available.</p>

<h3>Angular Velocity from RPM</h3>
<p>If you know an object's rotational speed in revolutions per minute, you can convert to radians per second using the following formula:</p>
<div class="explanation__highlight"><strong>ω = 2π × RPM / 60</strong></div>
<p>For example, a standard US electrical motor running at 1,800 RPM has an angular velocity of:</p>
<p>ω = 2π × 1,800 / 60 = <strong>188.5 rad/s</strong></p>

<h3>Angular Velocity from Angle and Time</h3>
<p>If you know the angle swept and the time taken, use:</p>
<div class="explanation__highlight"><strong>ω = θ / t</strong></div>
<p>Where θ is the angle in radians and t is the time in seconds.</p>

<h2>Relationship to Linear Velocity</h2>
<p>Linear <a href="/physics-calculators/speed-calculator">speed</a> at the rim of a rotating object is related to angular velocity by v = ω × r, where r is the radius. This is why larger wheels cover more ground per revolution. It is also the basis for calculating <a href="/physics-calculators/centripetal-force-calculator">centripetal force</a> and <a href="/physics-calculators/angular-acceleration-calculator">angular acceleration</a>.</p>`, highlight: "1,800 RPM = 188.5 rad/s. Common US motor speeds: 900, 1,200, 1,800, and 3,600 RPM." },
    },

    "average-velocity-calculator": {
        subtitle: "Calculate average velocity from displacement and time. Results in m/s, km/h, and mph.",
        explanation: { heading: "How to Calculate Average Velocity", contentHTML: `<h2>What Is Average Velocity?</h2>
<p>Average velocity is the total <a href="/physics-calculators/displacement-calculator">displacement</a> of an object divided by the total time taken. Unlike average <a href="/physics-calculators/speed-calculator">speed</a>, which uses total distance, average velocity uses displacement — the straight-line distance from the starting point to the ending point, along with the direction.</p>
<p>This distinction matters in physics. If you drive 100 miles north and then 100 miles south, your total distance is 200 miles, but your displacement is zero. Your average speed is positive, but your average velocity is zero.</p>

<h2>How to Calculate Average Velocity</h2>
<p>To find average velocity, divide the displacement by the elapsed time.</p>

<h3>Average Velocity Formula</h3>
<div class="explanation__highlight"><strong>v = Δx / Δt</strong></div>
<p>Where:</p>
<ul><li><strong>v</strong> = average velocity (m/s)</li><li><strong>Δx</strong> = displacement (m)</li><li><strong>Δt</strong> = elapsed time (s)</li></ul>
<p>For example, if a runner completes a straight 400-meter dash in 50 seconds:</p>
<p>v = 400 / 50 = <strong>8 m/s</strong> = 28.8 km/h = 17.9 mph</p>

<h2>Average Velocity vs. Average Speed</h2>
<p>Average speed is always positive and uses total distance traveled, while average velocity can be zero or negative depending on the direction of displacement. For a round trip (returning to the starting point), average velocity is always zero, even though average speed is not. Use our <a href="/physics-calculators/velocity-calculator">velocity calculator</a> to find instantaneous velocity from <a href="/physics-calculators/acceleration-calculator">acceleration</a> instead.</p>` },
    },

    "centrifugal-force-calculator": {
        subtitle: "Calculate centrifugal force for rotating objects using F = mv²/r. Enter mass, velocity, and radius to find the outward force.",
        explanation: { heading: "How to Calculate Centrifugal Force", contentHTML: `<h2>What Is Centrifugal Force?</h2>
<p>Centrifugal force is the apparent outward <a href="/physics-calculators/force-calculator">force</a> experienced by an object moving in a circular path. When you are in a car that turns sharply, you feel pushed toward the outside of the turn — that sensation is the centrifugal force.</p>
<p>In physics, centrifugal force is classified as a pseudo-force, or fictitious force. It does not arise from any physical interaction but rather from the inertia of the object as observed from a rotating reference frame. It has the same magnitude as <a href="/physics-calculators/centripetal-force-calculator">centripetal force</a> but acts in the opposite direction — outward rather than inward.</p>

<h2>How to Calculate Centrifugal Force</h2>

<h3>Centrifugal Force Formula</h3>
<div class="explanation__highlight"><strong>F = mv² / r</strong></div>
<p>Where:</p>
<ul><li><strong>F</strong> = centrifugal force (N)</li><li><strong>m</strong> = <a href="/physics-calculators/mass-calculator">mass</a> of the object (kg)</li><li><strong>v</strong> = tangential <a href="/physics-calculators/velocity-calculator">velocity</a> (m/s)</li><li><strong>r</strong> = radius of rotation (m)</li></ul>
<p>You can also write this using <a href="/physics-calculators/angular-velocity-calculator">angular velocity</a>: F = mω²r.</p>
<p>For example, a 5 kg mass spinning at 10 m/s on a 2-meter string experiences:</p>
<p>F = 5 × 10² / 2 = 5 × 100 / 2 = <strong>250 N</strong></p>

<h2>Centrifugal Force vs. Centripetal Force</h2>
<p>Centripetal force is the real inward force that keeps an object on its curved path — for a car turning, this is the <a href="/physics-calculators/friction-force-calculator">friction</a> between the tires and the road. Centrifugal force is the equal and opposite apparent force felt by the object. Both have the same formula, F = mv²/r, but they act in opposite directions. Use our <a href="/physics-calculators/centripetal-force-calculator">centripetal force calculator</a> to find the inward force.</p>`, highlight: "A 5 kg mass spinning at 10 m/s on a 2 m string experiences 250 N of centrifugal force. This equals the centripetal force magnitude." },
    },

    "centripetal-force-calculator": {
        subtitle: "Calculate centripetal force for circular motion using F = mv²/r. Find the inward force keeping objects in a curved path.",
        explanation: { heading: "How to Calculate Centripetal Force", contentHTML: `<h2>What Is Centripetal Force?</h2>
<p>Centripetal force is the real inward <a href="/physics-calculators/force-calculator">force</a> that keeps an object moving along a curved or circular path. Without centripetal force, an object in motion would travel in a straight line, according to Newton's first law of motion (the law of inertia).</p>
<p>Different types of forces can act as centripetal force depending on the situation. For a car turning on a road, it is the <a href="/physics-calculators/friction-force-calculator">friction</a> between the tires and the pavement. For a satellite orbiting Earth, it is <a href="/physics-calculators/gravitational-force-calculator">gravity</a>. For a ball on a string, it is the tension in the string.</p>

<h2>How to Calculate Centripetal Force</h2>

<h3>Centripetal Force Formula</h3>
<p>The formula to calculate centripetal force is:</p>
<div class="explanation__highlight"><strong>F = mv² / r</strong></div>
<p>Where:</p>
<ul><li><strong>F</strong> = centripetal force (N)</li><li><strong>m</strong> = <a href="/physics-calculators/mass-calculator">mass</a> of the object (kg)</li><li><strong>v</strong> = <a href="/physics-calculators/speed-calculator">speed</a> of the object (m/s)</li><li><strong>r</strong> = radius of the circular path (m)</li></ul>
<p>You can also express this using <a href="/physics-calculators/angular-velocity-calculator">angular velocity</a>: F = mω²r, where ω is in rad/s.</p>

<h3>Worked Example: Car on a Curve</h3>
<p>Let's calculate the centripetal force for a 1,500 kg car traveling at 20 m/s (about 45 mph) around a curve with a 50-meter radius.</p>
<p>F = 1,500 × 20² / 50<br/>F = 1,500 × 400 / 50<br/>F = <strong>12,000 N</strong></p>
<p>The centripetal <a href="/physics-calculators/acceleration-calculator">acceleration</a> in this case is v²/r = 400/50 = 8 m/s², which is about 0.82 g of lateral force. This centripetal force must be provided entirely by the friction between the tires and the road surface.</p>

<h2>Centripetal Force vs. Centrifugal Force</h2>
<p>Centripetal force and <a href="/physics-calculators/centrifugal-force-calculator">centrifugal force</a> have the same magnitude but act in opposite directions. Centripetal force is the real inward force, while centrifugal force is the apparent outward force felt in a rotating reference frame. Use our <a href="/physics-calculators/centrifugal-force-calculator">centrifugal force calculator</a> to find the outward force.</p>`, highlight: "A 1,500 kg car at 45 mph on a 50 m curve needs 12,000 N of centripetal force — about 0.82 g of lateral acceleration." },
        faq: [
            { question: "What provides centripetal force?", answer: "Different forces can serve as centripetal force: friction (car turning on a road), gravity (planetary orbits and satellites), tension (ball on a string), the normal force (roller coaster loops), or electromagnetic force (charged particles in a magnetic field). The type of force depends on the physical situation." },
        ],
    },

    "coefficient-of-friction-calculator": {
        subtitle: "Calculate the coefficient of friction (μ) from friction force and normal force. Includes a reference table of common material pairs.",
        explanation: { heading: "How to Calculate Coefficient of Friction", contentHTML: `<h2>What Is the Coefficient of Friction?</h2>
<p>The coefficient of friction (μ) is a dimensionless number that describes how much <a href="/physics-calculators/friction-force-calculator">friction force</a> exists between two surfaces in contact. A higher coefficient means more friction. It has no units because it is a ratio of two forces.</p>
<p>There are two types: <strong>static friction</strong> (μs) describes the resistance to starting movement, while <strong>kinetic friction</strong> (μk) describes the resistance during sliding motion. Static friction is always greater than kinetic friction for the same surface pair — it takes more <a href="/physics-calculators/force-calculator">force</a> to start an object sliding than to keep it sliding.</p>

<h2>How to Calculate Coefficient of Friction</h2>

<h3>Coefficient of Friction Formula</h3>
<div class="explanation__highlight"><strong>μ = F_friction / F_normal</strong></div>
<p>Where:</p>
<ul><li><strong>μ</strong> = coefficient of friction (dimensionless)</li><li><strong>F_friction</strong> = <a href="/physics-calculators/friction-force-calculator">friction force</a> (N)</li><li><strong>F_normal</strong> = <a href="/physics-calculators/normal-force-calculator">normal force</a> (N)</li></ul>
<p>On a flat, level surface, the normal force equals the object's weight: F_normal = mg. So you can also write μ = F_friction / (mg).</p>

<h3>Worked Example</h3>
<p>You push a 20 kg box across a concrete floor with a steady 100 N of horizontal force. The box moves at constant <a href="/physics-calculators/velocity-calculator">velocity</a> (zero <a href="/physics-calculators/acceleration-calculator">acceleration</a>), so the friction force must equal the pushing force: 100 N.</p>
<p>μ = 100 / (20 × 9.81) = 100 / 196.2 = <strong>0.51</strong></p>

<h2>Static vs. Kinetic Friction</h2>
<p>Static friction (μs) prevents an object from starting to move. Kinetic friction (μk) acts on an object that is already sliding. For rubber on dry concrete: μs ≈ 1.0, μk ≈ 0.8. For steel on steel: μs ≈ 0.74, μk ≈ 0.57. This difference is why cars are harder to control once the tires start skidding.</p>` },
    },

    "displacement-calculator": {
        subtitle: "Calculate displacement using the kinematic equation s = v₀t + ½at². Enter initial velocity, acceleration, and time.",
        explanation: { heading: "How to Calculate Displacement", contentHTML: `<h2>What Is Displacement?</h2>
<p>Displacement is the straight-line distance an object has moved from its starting position, along with the direction. Unlike total distance traveled, displacement considers only the net change in position. It is a vector quantity and can be positive, negative, or zero.</p>
<p>For example, if you walk 5 meters forward and then 3 meters back, your total distance traveled is 8 meters, but your displacement is only 2 meters forward. Use our <a href="/physics-calculators/average-velocity-calculator">average velocity calculator</a> to find velocity from displacement and time.</p>

<h2>How to Calculate Displacement</h2>

<h3>Displacement Formula (SUVAT Equation)</h3>
<p>When an object moves with constant <a href="/physics-calculators/acceleration-calculator">acceleration</a>, its displacement can be calculated using one of the four SUVAT kinematic equations:</p>
<div class="explanation__highlight"><strong>s = v₀t + ½at²</strong></div>
<p>Where:</p>
<ul><li><strong>s</strong> = displacement (m)</li><li><strong>v₀</strong> = initial <a href="/physics-calculators/velocity-calculator">velocity</a> (m/s)</li><li><strong>a</strong> = acceleration (m/s²)</li><li><strong>t</strong> = time (s)</li></ul>

<h3>Worked Example: Free Fall</h3>
<p>An object dropped from rest (v₀ = 0) falls under gravity (a = 9.81 m/s²) for 5 seconds. What is its displacement?</p>
<p>s = 0 × 5 + ½ × 9.81 × 5²<br/>s = 0 + ½ × 9.81 × 25<br/>s = <strong>122.6 meters</strong> (about 402 feet)</p>
<p>After those 5 seconds, the object has reached a <a href="/physics-calculators/velocity-calculator">velocity</a> of v = 0 + 9.81 × 5 = 49 m/s (110 mph) and has <a href="/physics-calculators/kinetic-energy-calculator">kinetic energy</a> of ½mv².</p>

<h2>Other Kinematic (SUVAT) Equations</h2>
<p>The SUVAT equations are a set of four equations that describe motion with constant acceleration. The displacement formula above is just one of them. Others include v = v₀ + at (our <a href="/physics-calculators/velocity-calculator">velocity calculator</a>), v² = v₀² + 2as, and s = ½(v₀ + v)t. Together, they form the foundation of kinematics in classical mechanics.</p>`, highlight: "An object in free fall for 5 seconds drops 122.6 meters (402 feet). The SUVAT equation s = v₀t + ½at² is the foundation of kinematics." },
    },

    "elastic-potential-energy-calculator": {
        subtitle: "Calculate elastic potential energy stored in a spring using PE = ½kx². Enter spring constant (k) and displacement (x).",
        explanation: { heading: "How to Calculate Elastic Potential Energy", contentHTML: `<h2>What Is Elastic Potential Energy?</h2>
<p>Elastic potential energy is the energy stored in an elastic material — such as a spring, rubber band, or bow — when it is deformed. This stored energy can be converted into <a href="/physics-calculators/kinetic-energy-calculator">kinetic energy</a> when the material returns to its original shape.</p>
<p>Unlike <a href="/physics-calculators/gravitational-potential-energy-calculator">gravitational potential energy</a>, which depends on height, elastic PE depends on how far the material has been stretched or compressed from its equilibrium position and how stiff the material is.</p>

<h2>How to Calculate Elastic Potential Energy</h2>

<h3>Elastic Potential Energy Formula</h3>
<div class="explanation__highlight"><strong>PE = ½kx²</strong></div>
<p>Where:</p>
<ul><li><strong>PE</strong> = elastic potential energy (J)</li><li><strong>k</strong> = <a href="/physics-calculators/spring-constant-calculator">spring constant</a> (N/m)</li><li><strong>x</strong> = displacement from equilibrium (m)</li></ul>
<p>Because energy depends on x², doubling the stretch quadruples the stored energy. Compressing a spring by 10 cm stores 4 times as much energy as compressing it by 5 cm.</p>

<h3>Worked Example</h3>
<p>A spring with a spring constant of 500 N/m is compressed by 0.1 meters (10 cm). How much elastic potential energy is stored?</p>
<p>PE = ½ × 500 × 0.1² = ½ × 500 × 0.01 = <strong>2.5 J</strong></p>

<h2>Hooke's Law and the Spring Constant</h2>
<p>Elastic PE is derived from Hooke's Law (F = kx), which states that the restoring <a href="/physics-calculators/force-calculator">force</a> of a spring is proportional to its displacement. The <a href="/physics-calculators/spring-constant-calculator">spring constant</a> k measures stiffness — a higher k means a stiffer spring that stores more energy for the same displacement.</p>` },
    },

    "force-calculator": {
        subtitle: "Calculate force using Newton's Second Law: F = ma. Enter mass and acceleration to find force in newtons (N), pounds-force (lbf), and kilonewtons (kN).",
        explanation: { heading: "How to Calculate Force (Newton's Second Law)", contentHTML: `<h2>What Is Force?</h2>
<p>In physics, force is any interaction that, when unopposed, will change the motion of an object. A force can cause an object with <a href="/physics-calculators/mass-calculator">mass</a> to change its <a href="/physics-calculators/velocity-calculator">velocity</a>, meaning it can cause the object to <a href="/physics-calculators/acceleration-calculator">accelerate</a>.</p>
<p>Force can be described as a push or pull upon an object resulting from its interaction with another object, as is the case with <a href="/physics-calculators/gravitational-force-calculator">gravitational forces</a>. The standard unit of force in the International System of Units (SI) is the Newton (N). One Newton is defined as the force required to accelerate one kilogram of mass at the rate of one meter per second squared.</p>

<h2>How to Calculate Force</h2>
<p>To calculate force, you need to use Newton's second law of motion. It provides the formula for finding force when the <a href="/physics-calculators/mass-calculator">mass</a> and acceleration are known.</p>

<h3>Force Formula</h3>
<p>Newton's second law states that the force acting on an object is equal to the mass of that object multiplied by its acceleration. This can be expressed mathematically as:</p>
<div class="explanation__highlight"><strong>F = m × a</strong></div>
<p>Where:</p>
<ul><li><strong>F</strong> = force (N)</li><li><strong>m</strong> = mass of the object (kg)</li><li><strong>a</strong> = the object's acceleration (m/s²)</li></ul>
<p>For example, imagine a car with a mass of 1,500 kg accelerating at a rate of 2 meters per second squared. To find the force exerted on the car, plug the values into the formula:</p>
<p>F = 1,500 kg × 2 m/s²<br/>F = <strong>3,000 N</strong></p>
<p>After 5 seconds at this acceleration, the car reaches a <a href="/physics-calculators/velocity-calculator">velocity</a> of v = 0 + 2 × 5 = 10 m/s (22 mph).</p>

<h2>Weight vs. Force</h2>
<p>Weight is the <a href="/physics-calculators/gravitational-force-calculator">gravitational force</a> acting on an object: W = mg. A 70 kg person weighs 70 × 9.81 = 686.7 N (154.3 lbf) on Earth, but only 70 × 1.62 = 113.4 N on the Moon. Mass stays the same; weight changes with the local gravitational acceleration.</p>

<h2>Newton's Laws of Motion</h2>
<p>Newton's first law, often called the law of inertia, states that an object at rest stays at rest, and an object in motion continues in motion at the same <a href="/physics-calculators/speed-calculator">speed</a> and direction unless acted upon by an unbalanced force. <a href="/physics-calculators/centripetal-force-calculator">Centripetal force</a> is an example of this — it continuously changes the direction of a moving object.</p>
<p>Newton's second law, discussed above, provides the formula F = ma.</p>
<p>Newton's third law states that for every action, there is an equal and opposite reaction. This concept is crucial for <a href="/physics-calculators/normal-force-calculator">finding the normal force</a> exerted on an object by a surface.</p>

<h2>Individual Forces vs. Net Force</h2>
<p>When multiple forces act on an object, you must find the <a href="/physics-calculators/net-force-calculator">net force</a> — the vector sum of all individual forces — to determine the object's acceleration. If the net force is zero, the object is in equilibrium. You might also be interested in calculating <a href="/physics-calculators/friction-force-calculator">friction force</a> or <a href="/physics-calculators/spring-constant-calculator">spring force</a>.</p>`, highlight: "F = ma. A 70 kg person weighs 686.7 N on Earth. Weight on the Moon (g = 1.62 m/s²): only 113.4 N." },
        faq: [
            { question: "What is a newton?", answer: "A newton (N) is the SI unit of force. It is defined as the force needed to accelerate 1 kilogram of mass by 1 meter per second squared. On Earth, 1 kg of mass has a weight of about 9.81 N (2.2 lbf). The unit is named after Sir Isaac Newton." },
            { question: "What is the difference between mass and weight?", answer: "Mass (measured in kilograms) is the amount of matter in an object and remains the same everywhere. Weight (measured in newtons) is the gravitational force acting on that mass and changes with location. A 70 kg person weighs 686.7 N on Earth but only 113.4 N on the Moon." },
            { question: "Can force be negative?", answer: "Force is a vector quantity, so it has both magnitude and direction. A 'negative force' typically means force in the opposite direction to what is defined as positive. For example, if forward motion is positive, then a braking force or friction force acting backward is negative." },
        ],
    },

    "frequency-calculator": {
        subtitle: "Calculate frequency from period (f = 1/T) or from wave speed and wavelength (f = v/λ). Results in Hz, kHz, MHz.",
        explanation: { heading: "How to Calculate Frequency", contentHTML: `<h2>What Is Frequency?</h2>
<p>Frequency measures how often a repeating event occurs per unit of time. In physics, it is the number of complete cycles of a wave or oscillation that occur per second. The SI unit of frequency is the hertz (Hz), where 1 Hz equals one cycle per second.</p>
<p>Frequency is used to describe sound waves, light waves, radio signals, alternating current (AC), and any periodic motion. It is closely related to <a href="/physics-calculators/wavelength-calculator">wavelength</a> and wave <a href="/physics-calculators/speed-calculator">speed</a> through the wave equation.</p>

<h2>How to Calculate Frequency</h2>

<h3>Frequency from Period</h3>
<p>If you know the period (the time for one complete cycle), you can find frequency using:</p>
<div class="explanation__highlight"><strong>f = 1 / T</strong></div>
<p>Where f is frequency in hertz and T is the period in seconds. For example, if a pendulum completes one swing every 2 seconds, its frequency is f = 1/2 = 0.5 Hz.</p>

<h3>Frequency from Wave Speed and Wavelength</h3>
<p>For any wave, the frequency is related to the wave speed and <a href="/physics-calculators/wavelength-calculator">wavelength</a> by:</p>
<div class="explanation__highlight"><strong>f = v / λ</strong></div>
<p>Where v is the wave speed (m/s) and λ is the wavelength (m). For sound in air at room temperature (v ≈ 343 m/s), the concert pitch A has a frequency of 440 Hz and a wavelength of λ = 343/440 = 0.78 m.</p>

<h2>Common Frequency Ranges</h2>
<p>Human hearing ranges from about 20 Hz to 20,000 Hz. The AM radio band is 535–1,605 kHz. FM radio is 88–108 MHz. Wi-Fi operates at 2.4 GHz or 5 GHz. US household electricity alternates at 60 Hz.</p>`, highlight: "The speed of sound in air is 343 m/s. Concert A = 440 Hz, wavelength = 0.78 m. Human hearing: 20 Hz to 20,000 Hz." },
    },

    "friction-force-calculator": {
        subtitle: "Calculate friction force using F_f = μ × F_n. Enter the coefficient of friction and normal force.",
        explanation: { heading: "How to Calculate Friction Force", contentHTML: `<h2>What Is Friction Force?</h2>
<p>Friction is a <a href="/physics-calculators/force-calculator">force</a> that opposes the relative motion or tendency of motion between two surfaces in contact. It is essential for everyday life — without friction, you could not walk, drive, or grip objects.</p>
<p>There are two main types of friction: static friction (which prevents an object from starting to move) and kinetic friction (which opposes ongoing sliding motion). You can find the <a href="/physics-calculators/coefficient-of-friction-calculator">coefficient of friction</a> by dividing friction force by <a href="/physics-calculators/normal-force-calculator">normal force</a>.</p>

<h2>How to Calculate Friction Force</h2>

<h3>Friction Force Formula</h3>
<div class="explanation__highlight"><strong>F_f = μ × F_n</strong></div>
<p>Where:</p>
<ul><li><strong>F_f</strong> = friction force (N)</li><li><strong>μ</strong> = <a href="/physics-calculators/coefficient-of-friction-calculator">coefficient of friction</a> (dimensionless)</li><li><strong>F_n</strong> = <a href="/physics-calculators/normal-force-calculator">normal force</a> (N)</li></ul>
<p>On a flat, level surface, the normal force equals the weight of the object: F_n = mg, where m is the <a href="/physics-calculators/mass-calculator">mass</a> and g = 9.81 m/s². On an inclined surface at angle θ, the normal force is F_n = mg × cos(θ).</p>

<h3>Worked Example</h3>
<p>A 50 kg box sits on a concrete floor. The coefficient of kinetic friction between the box and floor is 0.6. What friction force resists sliding?</p>
<p>F_n = 50 × 9.81 = 490.5 N<br/>F_f = 0.6 × 490.5 = <strong>294.3 N</strong></p>

<h2>Friction on Inclined Surfaces</h2>
<p>On an incline at angle θ, the normal force decreases to mg × cos(θ), reducing friction. Meanwhile, a component of gravity (mg × sin(θ)) pulls the object down the slope. The object slides when the gravitational component exceeds the maximum static friction force.</p>` },
    },

    "gravitational-force-calculator": {
        subtitle: "Calculate gravitational attraction between two masses using Newton's Law of Universal Gravitation: F = Gm₁m₂/r².",
        explanation: { heading: "How to Calculate Gravitational Force", contentHTML: `<h2>What Is Gravitational Force?</h2>
<p>Gravitational force is the attractive <a href="/physics-calculators/force-calculator">force</a> between any two objects that have <a href="/physics-calculators/mass-calculator">mass</a>. Every object in the universe attracts every other object. The more massive the objects and the closer they are, the stronger the gravitational pull.</p>
<p>Gravity is the weakest of the four fundamental forces of nature, but it acts over infinite distance and always attracts — it never repels. It is the force responsible for your weight, the orbits of planets, and the structure of galaxies.</p>

<h2>How to Calculate Gravitational Force</h2>

<h3>Newton's Law of Universal Gravitation</h3>
<div class="explanation__highlight"><strong>F = G × m₁ × m₂ / r²</strong></div>
<p>Where:</p>
<ul><li><strong>F</strong> = gravitational force (N)</li><li><strong>G</strong> = gravitational constant = 6.674 × 10⁻¹¹ N⋅m²/kg²</li><li><strong>m₁, m₂</strong> = masses of the two objects (kg)</li><li><strong>r</strong> = distance between the centers of the objects (m)</li></ul>
<p>The force is proportional to the product of the masses and inversely proportional to the square of the distance — this is the inverse-square law.</p>

<h3>Worked Example: Your Weight</h3>
<p>The gravitational force between a 70 kg person and the Earth (mass = 5.972 × 10²⁴ kg, radius = 6.371 × 10⁶ m):</p>
<p>F = (6.674 × 10⁻¹¹ × 5.972 × 10²⁴ × 70) / (6.371 × 10⁶)²<br/>F = <strong>686.4 N</strong> (154.3 lbs)</p>
<p>This is exactly the same as calculating weight with W = mg = 70 × 9.81 = 686.7 N. The <a href="/physics-calculators/acceleration-calculator">acceleration</a> due to gravity (g = 9.81 m/s²) is itself derived from the universal gravitation equation.</p>

<h2>Gravity on Other Planets</h2>
<p>Surface gravity depends on both the planet's mass and radius. The Moon's gravity is about 1.62 m/s² (1/6 of Earth's), so a 70 kg person weighs only 113.4 N there. Mars has a surface gravity of 3.72 m/s². Jupiter's is 24.79 m/s² — nearly 2.5 times Earth's.</p>`, highlight: "Gravity between you (70 kg) and Earth: 686.4 N. This is your weight — it's the same as mg = 70 × 9.81." },
    },

    "gravitational-potential-energy-calculator": {
        subtitle: "Calculate gravitational potential energy using PE = mgh. Enter mass, height, and gravity (default g = 9.81 m/s²).",
        explanation: { heading: "How to Calculate Gravitational Potential Energy", contentHTML: `<h2>What Is Gravitational Potential Energy?</h2>
<p>Gravitational potential energy (PE) is the energy an object possesses because of its position in a gravitational field. The higher an object is above a reference point, the more gravitational PE it has stored. When the object falls, this potential energy converts into <a href="/physics-calculators/kinetic-energy-calculator">kinetic energy</a>.</p>
<p>This principle is the basis for hydroelectric power generation, roller coasters, and many engineering applications. It is different from <a href="/physics-calculators/elastic-potential-energy-calculator">elastic potential energy</a>, which is stored in deformed materials like springs.</p>

<h2>How to Calculate Gravitational Potential Energy</h2>

<h3>Gravitational PE Formula</h3>
<div class="explanation__highlight"><strong>PE = mgh</strong></div>
<p>Where:</p>
<ul><li><strong>PE</strong> = gravitational potential energy (J)</li><li><strong>m</strong> = <a href="/physics-calculators/mass-calculator">mass</a> of the object (kg)</li><li><strong>g</strong> = acceleration due to gravity (9.81 m/s² on Earth)</li><li><strong>h</strong> = height above the reference point (m)</li></ul>

<h3>Worked Example: Water Behind a Dam</h3>
<p>1,000 kg of water held at a height of 100 meters behind a hydroelectric dam:</p>
<p>PE = 1,000 × 9.81 × 100 = <strong>981,000 J = 981 kJ</strong></p>
<p>This is enough energy to power a 100-watt light bulb for about 2.7 hours. In a real hydroelectric plant, millions of kilograms of water flow through turbines continuously, generating megawatts of power.</p>

<h2>Conservation of Energy</h2>
<p>When an object falls freely, gravitational PE converts entirely to <a href="/physics-calculators/kinetic-energy-calculator">kinetic energy</a> (ignoring air resistance). At the bottom: KE = ½mv² = mgh. This means the <a href="/physics-calculators/velocity-calculator">velocity</a> at the bottom is v = √(2gh), regardless of the object's mass. A ball dropped from 10 m hits the ground at v = √(2 × 9.81 × 10) = 14 m/s.</p>`, highlight: "1,000 kg of water at 100 m = 981 kJ of potential energy. Hydroelectric dams convert this gravitational PE to electricity." },
    },

    "kinetic-energy-calculator": {
        subtitle: "Calculate kinetic energy using KE = ½mv². Enter mass and velocity to find energy in joules. Includes vehicle comparison table.",
        explanation: { heading: "How to Calculate Kinetic Energy", contentHTML: `<h2>What Is Kinetic Energy?</h2>
<p>Kinetic energy is the energy an object has because it is moving. If something is in motion, it has kinetic energy. The amount of kinetic energy depends on how heavy the object is and how fast it is moving.</p>
<p>For instance, a speeding car has more kinetic energy than a rolling soccer ball because it is much heavier and moving faster. Kinetic energy is different from <a href="/physics-calculators/gravitational-potential-energy-calculator">potential energy</a>, which is the stored energy of an object based on its position. Objects that are not in motion have no kinetic energy at all.</p>

<h2>How to Calculate Kinetic Energy</h2>
<p>Since the amount of kinetic energy an object has depends on its <a href="/physics-calculators/mass-calculator">mass</a> and <a href="/physics-calculators/velocity-calculator">velocity</a>, you need to calculate those things first. You can use our <a href="/physics-calculators/mass-calculator">mass calculator</a> and our <a href="/physics-calculators/velocity-calculator">velocity calculator</a> to find those properties.</p>
<p>Once you have the mass and velocity, you can use a simple formula to calculate kinetic energy.</p>

<h3>Kinetic Energy Formula</h3>
<p>The formula to calculate the kinetic energy of an object is:</p>
<div class="explanation__highlight"><strong>KE = ½mv²</strong></div>
<p>Thus, the kinetic energy KE in joules is equal to one-half times the object's mass m in kilograms times its velocity v in meters per second, squared.</p>
<p>Where:</p>
<ul><li><strong>KE</strong> = kinetic energy (J)</li><li><strong>m</strong> = mass (kg)</li><li><strong>v</strong> = velocity (m/s)</li></ul>

<h3>Worked Example: Car at 60 mph</h3>
<p>Let's calculate the kinetic energy of a 1,500 kg car traveling at 60 mph (26.8 m/s):</p>
<p>KE = ½ × 1,500 × 26.8²<br/>KE = 750 × 718.24<br/>KE = <strong>538,680 J ≈ 539 kJ</strong></p>
<p>At 30 mph: KE = ½ × 1,500 × 13.4² = 134,670 J ≈ 135 kJ. Doubling the <a href="/physics-calculators/speed-calculator">speed</a> quadruples the kinetic energy — and the stopping distance.</p>

<h2>Why Speed Matters More Than Mass</h2>
<p>Because KE depends on v² (velocity squared), speed has a much larger effect on kinetic energy than mass. A car at 60 mph has <strong>4 times the kinetic energy</strong> of the same car at 30 mph — and needs 4 times the braking distance. This is why highway accidents are far more destructive than city crashes, and why speed limits exist.</p>`, highlight: "A car at 60 mph has 539 kJ of kinetic energy — 4× more than at 30 mph. This is why stopping distance quadruples with doubled speed." },
        faq: [
            { question: "Why does doubling speed quadruple kinetic energy?", answer: "Because KE = ½mv², the velocity term is squared. Doubling v makes v² increase by a factor of 4, so kinetic energy increases by 4×. This is why highway accidents are far more destructive than city crashes, and why braking distance increases with the square of speed." },
            { question: "What is the kinetic energy of a bullet?", answer: "A typical 9mm bullet (8 g at 370 m/s): KE = ½ × 0.008 × 370² = 548 J. A .30-06 rifle bullet (10 g at 870 m/s): KE = 3,785 J. Despite very small mass, the high velocity creates enormous kinetic energy." },
        ],
    },

    "magnitude-of-acceleration-calculator": {
        subtitle: "Calculate the magnitude of acceleration from its x and y components using |a| = √(ax² + ay²). Find the resultant acceleration vector.",
        explanation: { heading: "How to Calculate Magnitude of Acceleration", contentHTML: `<h2>What Is the Magnitude of Acceleration?</h2>
<p>When <a href="/physics-calculators/acceleration-calculator">acceleration</a> has components in multiple directions (such as horizontal and vertical), the magnitude gives the total acceleration — a single number representing the overall rate of change of <a href="/physics-calculators/velocity-calculator">velocity</a>. This is calculated using the Pythagorean theorem applied to vectors.</p>

<h2>How to Calculate Magnitude of Acceleration</h2>

<h3>Magnitude Formula</h3>
<div class="explanation__highlight"><strong>|a| = √(ax² + ay²)</strong></div>
<p>Where ax is the horizontal component and ay is the vertical component of acceleration, both in m/s².</p>
<p>The direction of the resultant acceleration vector is given by: θ = arctan(ay / ax).</p>

<h3>Worked Example</h3>
<p>A projectile has a horizontal acceleration of 0 m/s² and a vertical acceleration of −9.81 m/s² (gravity). The magnitude is:</p>
<p>|a| = √(0² + 9.81²) = <strong>9.81 m/s²</strong></p>
<p>For a car accelerating forward at 3 m/s² while turning with a <a href="/physics-calculators/centripetal-force-calculator">centripetal</a> acceleration of 4 m/s²:</p>
<p>|a| = √(3² + 4²) = √(9 + 16) = √25 = <strong>5 m/s²</strong></p>

<h2>When to Use Magnitude of Acceleration</h2>
<p>You need to find the magnitude whenever <a href="/physics-calculators/force-calculator">forces</a> act in different directions simultaneously — such as projectile motion, banking turns, or objects on inclined planes. Use our <a href="/physics-calculators/net-force-calculator">net force calculator</a> to find the resultant of multiple forces acting at different angles.</p>` },
    },

    "mass-calculator": {
        subtitle: "Calculate mass from force and acceleration (m = F/a) or from density and volume (m = ρV). Convert between kg and lbs.",
        explanation: { heading: "How to Calculate Mass", contentHTML: `<h2>What Is Mass?</h2>
<p>Mass is a fundamental property of matter that measures the amount of material in an object. It determines how much an object resists <a href="/physics-calculators/acceleration-calculator">acceleration</a> (a property called inertia) and how strongly it is attracted by <a href="/physics-calculators/gravitational-force-calculator">gravity</a>.</p>
<p>Mass is measured in kilograms (kg) in the International System of Units (SI). Unlike weight, mass does not change with location — a 70 kg person has a mass of 70 kg whether they are on Earth, the Moon, or floating in space.</p>

<h2>How to Calculate Mass</h2>

<h3>Mass from Force and Acceleration</h3>
<p>Using Newton's second law (<a href="/physics-calculators/force-calculator">F = ma</a>), you can rearrange to solve for mass:</p>
<div class="explanation__highlight"><strong>m = F / a</strong></div>
<p>Where m is mass in kg, F is <a href="/physics-calculators/force-calculator">force</a> in newtons, and a is acceleration in m/s².</p>

<h3>Mass from Density and Volume</h3>
<p>If you know the density of the material and the volume of the object:</p>
<div class="explanation__highlight"><strong>m = ρ × V</strong></div>
<p>Where ρ is density (kg/m³) and V is volume (m³). This is useful for calculating the mass of liquids, gases, or solid objects with known dimensions. You can also use our <a href="/density-calculators/density-calculator">density calculator</a> to find or verify density values.</p>

<h2>Mass vs. Weight</h2>
<p>Mass and weight are often confused but are fundamentally different. Mass measures how much matter an object contains (kg). Weight is the <a href="/physics-calculators/gravitational-force-calculator">gravitational force</a> on that mass (N). Weight = mass × g. On Earth (g = 9.81 m/s²), a 10 kg object weighs 98.1 N. On the Moon (g = 1.62 m/s²), the same object weighs only 16.2 N — but its mass is still 10 kg.</p>` },
    },

    "momentum-calculator": {
        subtitle: "Calculate linear momentum using p = mv. Enter mass and velocity to find momentum in kg⋅m/s (N⋅s). Includes examples for common objects.",
        explanation: { heading: "How to Calculate Momentum", contentHTML: `<h2>What Is Momentum?</h2>
<p>Momentum is a measure of how much motion an object has. It depends on both an object's <a href="/physics-calculators/mass-calculator">mass</a> and its <a href="/physics-calculators/velocity-calculator">velocity</a>. A heavy object moving slowly can have the same momentum as a light object moving quickly.</p>
<p>Momentum is a vector quantity — it has both magnitude and direction. It is one of the most important concepts in physics because of the law of conservation of momentum, which governs every collision and interaction.</p>

<h2>How to Calculate Momentum</h2>

<h3>Momentum Formula</h3>
<div class="explanation__highlight"><strong>p = m × v</strong></div>
<p>Where:</p>
<ul><li><strong>p</strong> = momentum (kg⋅m/s or N⋅s)</li><li><strong>m</strong> = <a href="/physics-calculators/mass-calculator">mass</a> (kg)</li><li><strong>v</strong> = <a href="/physics-calculators/velocity-calculator">velocity</a> (m/s)</li></ul>
<p>For example, a 1,500 kg car traveling at 30 mph (13.4 m/s) has a momentum of:</p>
<p>p = 1,500 × 13.4 = <strong>20,100 kg⋅m/s</strong></p>

<h2>Conservation of Momentum</h2>
<p>In any closed system where no external <a href="/physics-calculators/force-calculator">forces</a> act, the total momentum before an event equals the total momentum after. This applies to billiard ball collisions, car crashes, rocket propulsion, and nuclear reactions.</p>

<h2>Impulse-Momentum Theorem</h2>
<p>The impulse-momentum theorem states that the change in momentum equals <a href="/physics-calculators/force-calculator">force</a> multiplied by time:</p>
<div class="explanation__highlight"><strong>F × Δt = Δp = m × Δv</strong></div>
<p>This explains why airbags work — by increasing the collision time, they reduce the <a href="/physics-calculators/force-calculator">force</a> on passengers while absorbing the same change in momentum.</p>`, highlight: "A 1,500 kg car at 30 mph has 20,100 kg⋅m/s of momentum. Airbags reduce force by increasing collision time (impulse)." },
        faq: [
            { question: "What is the law of conservation of momentum?", answer: "In any closed system (no external forces), total momentum is conserved. In a collision: m₁v₁ + m₂v₂ (before) = m₁v₁' + m₂v₂' (after). This applies to all collisions — both elastic (objects bounce) and inelastic (objects stick together)." },
        ],
    },

    "net-force-calculator": {
        subtitle: "Calculate the net (resultant) force from multiple forces with different magnitudes and directions. Add or remove forces dynamically.",
        explanation: { heading: "How to Calculate Net Force", contentHTML: `<h2>What Is Net Force?</h2>
<p>Net force (also called resultant force) is the overall <a href="/physics-calculators/force-calculator">force</a> acting on an object when you combine all individual forces. It is the vector sum of every force applied to the object. According to Newton's second law, the net force determines the object's <a href="/physics-calculators/acceleration-calculator">acceleration</a>: F_net = ma.</p>
<p>If the net force is zero, the object is in equilibrium — it is either stationary or moving at constant <a href="/physics-calculators/velocity-calculator">velocity</a>.</p>

<h2>How to Calculate Net Force</h2>

<h3>Vector Addition Method</h3>
<p>To find the net force from multiple forces acting at different angles:</p>
<div class="explanation__highlight"><strong>Step 1:</strong> Break each force into x and y components:<br/>Fx = F × cos(θ), Fy = F × sin(θ)<br/><br/><strong>Step 2:</strong> Sum all components:<br/>ΣFx = F₁x + F₂x + ...,  ΣFy = F₁y + F₂y + ...<br/><br/><strong>Step 3:</strong> Find magnitude and direction:<br/><strong>F_net = √(ΣFx² + ΣFy²)</strong><br/>θ = arctan(ΣFy / ΣFx)</div>

<h2>Balanced vs. Unbalanced Forces</h2>
<p>When all forces cancel out (F_net = 0), forces are balanced and the object does not accelerate. When forces do not cancel out (F_net ≠ 0), the unbalanced force causes the object to accelerate in the direction of the net force. Use our <a href="/physics-calculators/force-calculator">force calculator</a> to find the force from a known mass and acceleration.</p>` },
    },

    "normal-force-calculator": {
        subtitle: "Calculate normal force on flat and inclined surfaces using F_n = mg cos(θ). See the parallel component that drives sliding.",
        explanation: { heading: "How to Calculate Normal Force", contentHTML: `<h2>What Is Normal Force?</h2>
<p>Normal force is the perpendicular contact <a href="/physics-calculators/force-calculator">force</a> exerted by a surface on an object resting on it. It is called "normal" because it acts perpendicular (at a right angle) to the surface. The normal force prevents objects from passing through surfaces.</p>
<p>On a flat surface, the normal force equals the object's weight. On an inclined surface, the normal force is less than the weight because a component of gravity acts along the slope.</p>

<h2>How to Calculate Normal Force</h2>

<h3>Normal Force Formula</h3>
<div class="explanation__highlight"><strong>F_n = mg cos(θ)</strong></div>
<p>Where:</p>
<ul><li><strong>F_n</strong> = normal force (N)</li><li><strong>m</strong> = <a href="/physics-calculators/mass-calculator">mass</a> (kg)</li><li><strong>g</strong> = 9.81 m/s²</li><li><strong>θ</strong> = angle of incline (degrees)</li></ul>
<p>On a flat surface (θ = 0°): cos(0°) = 1, so F_n = mg (the full weight).<br/>On a 30° incline: F_n = mg × cos(30°) = 0.866 × mg — about 86.6% of the weight.</p>

<h2>Normal Force and Friction</h2>
<p>Normal force directly affects <a href="/physics-calculators/friction-force-calculator">friction</a>. Since friction F_f = μ × F_n, a lower normal force (such as on a steeper incline) means less friction. This is why objects are more likely to slide on steeper slopes. Use our <a href="/physics-calculators/coefficient-of-friction-calculator">coefficient of friction calculator</a> to find μ from the forces involved.</p>` },
    },

    "specific-heat-calculator": {
        subtitle: "Calculate heat energy using Q = mcΔT. Enter mass, specific heat capacity, and temperature change. Includes a table of common materials.",
        explanation: { heading: "How to Calculate Heat Energy (Specific Heat)", contentHTML: `<h2>What Is Specific Heat?</h2>
<p>Specific heat capacity is the amount of heat energy required to raise the temperature of one kilogram of a substance by one degree Celsius (or one kelvin). Different materials absorb and release heat at different rates — this property is what specific heat measures.</p>
<p>Water has one of the highest specific heat capacities of any common substance at 4,186 J/kg⋅°C. This is why water is used in cooling systems, why coastal climates are more moderate, and why it takes a long time to boil a pot of water.</p>

<h2>How to Calculate Heat Energy</h2>

<h3>Specific Heat Formula</h3>
<div class="explanation__highlight"><strong>Q = mcΔT</strong></div>
<p>Where:</p>
<ul><li><strong>Q</strong> = heat energy (J)</li><li><strong>m</strong> = <a href="/physics-calculators/mass-calculator">mass</a> (kg)</li><li><strong>c</strong> = specific heat capacity (J/kg⋅°C)</li><li><strong>ΔT</strong> = temperature change (°C)</li></ul>

<h3>Worked Example: Heating Water</h3>
<p>How much energy does it take to heat 1 liter (1 kg) of water from 20°C to 100°C?</p>
<p>Q = 1 × 4,186 × (100 − 20)<br/>Q = 1 × 4,186 × 80<br/>Q = <strong>334,880 J = 335 kJ</strong></p>
<p>That is about 80 food Calories (kcal). A typical electric kettle (2,000 W) takes about 167 seconds (just under 3 minutes) to deliver this energy.</p>

<h2>Why Water Has High Specific Heat</h2>
<p>Water molecules form extensive hydrogen bonds with neighboring molecules. Breaking these bonds requires significant energy, so water absorbs a lot of heat before its temperature rises. This property makes water an excellent coolant and thermal buffer in biological systems and engineering.</p>`, highlight: "Heating 1 kg of water by 80°C requires 335 kJ. Water's high specific heat (4,186 J/kg⋅°C) is why oceans moderate coastal climates." },
        faq: [
            { question: "Why does water have such a high specific heat?", answer: "Water molecules form extensive hydrogen bonds that require significant energy to break. This makes water excellent for storing thermal energy, for use in cooling systems, and for temperature regulation in biological organisms." },
        ],
    },

    "speed-calculator": {
        subtitle: "Calculate speed from distance and time. Results in m/s, km/h, and mph. Includes a speed reference table from walking to light speed.",
        explanation: { heading: "How to Calculate Speed", contentHTML: `<h2>What Is Speed?</h2>
<p>Speed is a measure of how fast an object is moving. It is a scalar quantity, meaning it has magnitude but no direction — unlike <a href="/physics-calculators/velocity-calculator">velocity</a>, which is a vector quantity with both magnitude and direction.</p>
<p>When someone says "the car is traveling at 60 mph," they are describing speed. If they say "the car is traveling at 60 mph north," they are describing velocity.</p>

<h2>How to Calculate Speed</h2>

<h3>Speed Formula</h3>
<div class="explanation__highlight"><strong>Speed = Distance / Time</strong></div>
<p>Where speed is in m/s, distance in meters, and time in seconds. You can also use km and hours, or miles and hours, to get km/h or mph directly.</p>
<p>For example, if a runner covers 400 meters in 50 seconds: Speed = 400/50 = <strong>8 m/s</strong> = 28.8 km/h = 17.9 mph.</p>

<h2>Speed vs. Velocity</h2>
<p><a href="/physics-calculators/velocity-calculator">Velocity</a> includes direction, while speed does not. If you drive 100 km north and then 100 km south in 4 hours, your average speed is 200/4 = 50 km/h, but your <a href="/physics-calculators/average-velocity-calculator">average velocity</a> is 0/4 = 0 km/h because your displacement is zero.</p>

<h2>Common Speed Conversions</h2>
<ul><li>1 m/s = 3.6 km/h = 2.237 mph</li><li>1 mph = 0.447 m/s = 1.609 km/h</li><li>1 km/h = 0.278 m/s = 0.621 mph</li></ul>` },
    },

    "spring-constant-calculator": {
        subtitle: "Calculate the spring constant (k) using Hooke's Law: k = F/x. Enter force and displacement to find stiffness in N/m.",
        explanation: { heading: "How to Calculate Spring Constant (Hooke's Law)", contentHTML: `<h2>What Is the Spring Constant?</h2>
<p>The spring constant (k) is a measure of a spring's stiffness. It tells you how much <a href="/physics-calculators/force-calculator">force</a> is required to stretch or compress a spring by a given distance. A higher spring constant means a stiffer spring that is harder to deform.</p>
<p>Car suspension springs typically have k values of 10,000–50,000 N/m to support the vehicle's weight while allowing controlled movement. A Slinky has k ≈ 1 N/m. A stiff industrial spring might exceed 100,000 N/m.</p>

<h2>How to Calculate Spring Constant</h2>

<h3>Spring Constant Formula (Hooke's Law)</h3>
<div class="explanation__highlight"><strong>k = F / x</strong></div>
<p>Where:</p>
<ul><li><strong>k</strong> = spring constant (N/m)</li><li><strong>F</strong> = applied <a href="/physics-calculators/force-calculator">force</a> (N)</li><li><strong>x</strong> = displacement from equilibrium (m)</li></ul>
<p>Hooke's Law states that the restoring force of a spring is proportional to its displacement: F = kx. This relationship holds as long as the spring is not stretched beyond its elastic limit.</p>

<h3>Worked Example</h3>
<p>A force of 50 N stretches a spring by 0.1 m (10 cm):</p>
<p>k = 50 / 0.1 = <strong>500 N/m</strong></p>

<h2>Elastic Potential Energy</h2>
<p>The spring constant is also used to calculate <a href="/physics-calculators/elastic-potential-energy-calculator">elastic potential energy</a>: PE = ½kx². A spring with k = 500 N/m compressed by 0.1 m stores PE = ½ × 500 × 0.01 = 2.5 J of energy.</p>` },
    },

    "terminal-velocity-calculator": {
        subtitle: "Calculate terminal velocity using v_t = √(2mg / ρACd). Enter mass, drag coefficient, cross-sectional area, and air density.",
        explanation: { heading: "How to Calculate Terminal Velocity", contentHTML: `<h2>What Is Terminal Velocity?</h2>
<p>Terminal velocity is the maximum <a href="/physics-calculators/speed-calculator">speed</a> a falling object can reach when the drag force (air resistance) equals the object's weight. At terminal velocity, the <a href="/physics-calculators/net-force-calculator">net force</a> on the object is zero, so there is no further <a href="/physics-calculators/acceleration-calculator">acceleration</a> — the object falls at a constant speed.</p>
<p>Terminal velocity depends on the object's <a href="/physics-calculators/mass-calculator">mass</a>, its shape (drag coefficient), its cross-sectional area, and the density of the air it is falling through.</p>

<h2>How to Calculate Terminal Velocity</h2>

<h3>Terminal Velocity Formula</h3>
<div class="explanation__highlight"><strong>vt = √(2mg / ρACd)</strong></div>
<p>Where:</p>
<ul><li><strong>vt</strong> = terminal velocity (m/s)</li><li><strong>m</strong> = mass (kg)</li><li><strong>g</strong> = 9.81 m/s²</li><li><strong>ρ</strong> = air density (≈ 1.225 kg/m³ at sea level)</li><li><strong>A</strong> = cross-sectional area (m²)</li><li><strong>Cd</strong> = drag coefficient</li></ul>

<h3>Worked Example: Skydiver</h3>
<p>A 75 kg skydiver in belly-down position (Cd = 1.0, A = 0.7 m²) at sea level:</p>
<p>vt = √(2 × 75 × 9.81 / (1.225 × 0.7 × 1.0))<br/>vt = √(1,471.5 / 0.8575)<br/>vt ≈ <strong>41.4 m/s ≈ 93 mph</strong></p>
<p>In a head-down position (Cd ≈ 0.4, A ≈ 0.3 m²), the same skydiver reaches about 90 m/s (200 mph) because both drag coefficient and area are reduced.</p>

<h2>Drag Coefficients for Common Shapes</h2>
<table><thead><tr><th>Shape</th><th>Cd</th></tr></thead><tbody>
<tr><td>Sphere</td><td>0.47</td></tr>
<tr><td>Cube</td><td>1.05</td></tr>
<tr><td>Flat plate</td><td>1.28</td></tr>
<tr><td>Skydiver (belly)</td><td>1.0</td></tr>
<tr><td>Streamlined body</td><td>0.04</td></tr>
</tbody></table>`, highlight: "A skydiver (75 kg, belly-down, Cd=1.0, A=0.7 m²) has a terminal velocity of ~55 m/s (120 mph). Head-down: ~90 m/s (200 mph)." },
    },

    "velocity-calculator": {
        subtitle: "Calculate final velocity using the kinematic equation v = v₀ + at. Enter initial velocity, acceleration, and time.",
        explanation: { heading: "How to Calculate Velocity", contentHTML: `<h2>What Is Velocity?</h2>
<p>Velocity is a vector quantity that describes both the <a href="/physics-calculators/speed-calculator">speed</a> and direction of an object's motion. While speed tells you how fast something is moving, velocity tells you how fast and in which direction.</p>
<p>The SI unit of velocity is meters per second (m/s). A car traveling at 60 mph north has a velocity of 26.8 m/s north. If the car turns around and goes 60 mph south, its speed is the same but its velocity has changed direction.</p>

<h2>How to Calculate Velocity</h2>

<h3>Velocity Formula (Kinematic Equation)</h3>
<p>When an object moves with constant <a href="/physics-calculators/acceleration-calculator">acceleration</a>, its final velocity can be found using the simplest of the four kinematic (SUVAT) equations:</p>
<div class="explanation__highlight"><strong>v = v₀ + at</strong></div>
<p>Where:</p>
<ul><li><strong>v</strong> = final velocity (m/s)</li><li><strong>v₀</strong> = initial velocity (m/s)</li><li><strong>a</strong> = acceleration (m/s²)</li><li><strong>t</strong> = time (s)</li></ul>

<h3>Worked Example: Free Fall</h3>
<p>An object dropped from rest (v₀ = 0) falls under gravity (a = 9.81 m/s²) for 5 seconds:</p>
<p>v = 0 + 9.81 × 5 = <strong>49.05 m/s</strong> (about 110 mph)</p>
<p>After 10 seconds: v = 98.1 m/s (220 mph). This illustrates how rapidly velocity increases during free fall — although in reality, <a href="/physics-calculators/terminal-velocity-calculator">terminal velocity</a> limits the maximum speed due to air resistance.</p>

<h2>Velocity vs. Speed</h2>
<p>Speed is the magnitude of velocity. A car traveling at 60 mph has a speed of 60 mph regardless of direction. Velocity requires direction — 60 mph north is a different velocity than 60 mph south. Use our <a href="/physics-calculators/average-velocity-calculator">average velocity calculator</a> to find velocity from <a href="/physics-calculators/displacement-calculator">displacement</a> and time.</p>`, highlight: "An object in free fall reaches 49 m/s (110 mph) after 5 seconds, and 98 m/s (220 mph) after 10 seconds." },
    },

    "wavelength-calculator": {
        subtitle: "Calculate wavelength from wave speed and frequency using λ = v/f. Works for sound, light, and any wave type. Includes musical note reference table.",
        explanation: { heading: "How to Calculate Wavelength", contentHTML: `<h2>What Is Wavelength?</h2>
<p>Wavelength is the distance between two consecutive identical points on a wave, such as from one peak to the next. It is typically represented by the Greek letter lambda (λ) and measured in meters (m) or nanometers (nm) for light.</p>
<p>Wavelength is inversely related to <a href="/physics-calculators/frequency-calculator">frequency</a> — higher frequencies have shorter wavelengths, and lower frequencies have longer wavelengths. Together with <a href="/physics-calculators/speed-calculator">wave speed</a>, the three form the wave equation.</p>

<h2>How to Calculate Wavelength</h2>

<h3>Wavelength Formula</h3>
<div class="explanation__highlight"><strong>λ = v / f</strong></div>
<p>Where:</p>
<ul><li><strong>λ</strong> = wavelength (m)</li><li><strong>v</strong> = wave speed (m/s)</li><li><strong>f</strong> = <a href="/physics-calculators/frequency-calculator">frequency</a> (Hz)</li></ul>
<p>For sound in air at room temperature (v ≈ 343 m/s), the concert pitch A (440 Hz) has a wavelength of:</p>
<p>λ = 343 / 440 = <strong>0.78 m</strong></p>
<p>For visible light (v = 3 × 10⁸ m/s), red light at 430 THz has a wavelength of about 700 nm, while violet light at 790 THz has a wavelength of about 380 nm.</p>

<h2>Wavelength of Visible Light</h2>
<p>The human eye can detect light with wavelengths between approximately 380 nm (violet) and 700 nm (red). The full visible spectrum includes: violet (380–450 nm), blue (450–495 nm), green (495–570 nm), yellow (570–590 nm), orange (590–620 nm), and red (620–700 nm).</p>

<h2>Speed of Sound in Different Media</h2>
<table><thead><tr><th>Medium</th><th>Speed (m/s)</th></tr></thead><tbody>
<tr><td>Air (20°C)</td><td>343</td></tr>
<tr><td>Water (25°C)</td><td>1,497</td></tr>
<tr><td>Steel</td><td>5,960</td></tr>
<tr><td>Glass</td><td>5,640</td></tr>
</tbody></table>
<p>Sound travels much faster in denser media. A sound wave that has a wavelength of 1 m in air would have a wavelength of about 4.4 m in water at the same <a href="/physics-calculators/frequency-calculator">frequency</a>.</p>`, highlight: "Sound in air: 343 m/s. Concert A (440 Hz) has a wavelength of 0.78 m. Light: 3×10⁸ m/s, visible light is 380–700 nm." },
        faq: [
            { question: "What is the wavelength of visible light?", answer: "Visible light ranges from about 380 nm (violet) to 700 nm (red). Blue light is approximately 470 nm, green is about 530 nm, yellow about 580 nm, and orange about 600 nm. All visible light travels at the speed of light: approximately 3 × 10⁸ m/s." },
        ],
    },
};

export default async function PhysicsCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("physics").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/physics-calculators/${calc.slug}`);
    const schemas: object[] = [
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Physics Calculators", url: canonicalUrl("/physics-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl, "USD", "EducationalApplication"),
    ];
    if (content?.faq && content.faq.length > 0) {
        schemas.push(faqSchema(content.faq));
    }
    const schemaData = JSON.stringify(schemas);


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
