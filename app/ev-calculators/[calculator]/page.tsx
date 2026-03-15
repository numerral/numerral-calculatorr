// Dynamic Hub — /ev-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import EVCalculatorCore from "@/components/calculator/EVCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("ev");
    return calcs.map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("ev").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/ev-calculators/${calc.slug}`) },
    };
}

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    faq?: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "ev-vs-gas-calculator": {
        subtitle: "Compare the true annual cost of driving an EV vs a gas car — fuel, maintenance, and total operating expenses side by side.",
        explanation: {
            heading: "How to Compare EV vs Gas Costs",
            paragraphs: [
                "The annual fuel cost for a gas car is simple: (annual miles ÷ MPG) × gas price per gallon. For an EV, it's: (annual miles ÷ mi/kWh efficiency) × electricity rate per kWh. The average American drives 12,000 miles per year.",
                "Beyond fuel, maintenance costs differ significantly. Gas cars average $0.09/mile for maintenance (oil changes, brake pads, transmission service, exhaust). EVs average $0.03/mile — they have no oil to change, brakes last 2–3× longer (regenerative braking), and no transmission fluid, belts, or spark plugs to replace.",
            ],
            highlight: "At 12,000 miles/year with gas at $3.50/gal (28 MPG) vs electricity at $0.14/kWh (3.5 mi/kWh): gas fuel = $1,500/yr, EV electricity = $480/yr. Annual fuel savings alone: $1,020.",
        },
        faq: [
            { question: "Is it really cheaper to drive an EV than a gas car?", answer: "Almost always, yes — on a per-mile fuel cost basis. The average EV costs 3–5¢ per mile to charge, while a gas car costs 10–15¢ per mile in fuel. Combined with lower maintenance costs, an EV typically saves $1,000–$2,500 per year in operating costs." },
            { question: "What about the higher purchase price of EVs?", answer: "EVs have a higher sticker price, but the gap is narrowing. After the $7,500 federal tax credit, many EVs are price-competitive with gas equivalents. Use our EV Break-Even Calculator to see how quickly fuel and maintenance savings offset the price premium." },
        ],
    },
    "ev-charging-cost-calculator": {
        subtitle: "Calculate how much it costs to charge your EV from any state of charge at home or at a public DC fast charging station.",
        explanation: {
            heading: "How to Calculate EV Charging Cost",
            paragraphs: [
                "EV charging cost = kWh needed × electricity rate. The kWh needed = battery capacity × (target % − current %) ÷ 100. For example, charging a 75 kWh battery from 20% to 80% requires 75 × 0.60 = 45 kWh.",
                "Home charging is significantly cheaper than public fast charging. The US average home rate is ~$0.14/kWh, while DC fast chargers typically cost $0.30–$0.50/kWh. Some networks (like Tesla Supercharger) charge by the minute rather than by the kWh, which can vary by power level.",
            ],
            highlight: "Charging a 75 kWh battery from 20% to 80% (45 kWh needed): Home at $0.14/kWh = $6.30. DC Fast at $0.35/kWh = $15.75. That's a 2.5× cost difference — home charging saves over $9 per session.",
        },
        faq: [
            { question: "How much does it cost to fully charge an EV at home?", answer: "For a 75 kWh battery at the US average rate of $0.14/kWh: a full 0–100% charge costs $10.50. A more typical 20–80% charge costs $6.30. Monthly cost for average driving (12,000 mi/yr) is about $40–$60." },
            { question: "Is DC fast charging expensive?", answer: "Relatively, yes. DC fast charging costs $0.30–$0.50/kWh at most networks — 2–3× home rates. A 20–80% charge on a 75 kWh battery costs $13–$23 at a DC fast charger vs $6–$9 at home. It's best reserved for road trips." },
        ],
    },
    "ev-fuel-savings-calculator": {
        subtitle: "See how much you'll save on fuel by switching to an EV — annual gas costs vs electricity costs with 5-year and 10-year projections.",
        explanation: {
            heading: "How to Calculate EV Fuel Savings",
            paragraphs: [
                "EV fuel savings = annual gas cost − annual EV electricity cost. Gas cost = (annual miles ÷ MPG) × price per gallon. EV cost = (annual miles ÷ EV efficiency in mi/kWh) × electricity rate per kWh.",
                "The savings compound over time. At $1,000 saved per year, that's $5,000 over 5 years and $10,000 over 10 years — not accounting for gas price increases. Historically, gas prices have been more volatile than electricity rates, making EV costs more predictable.",
            ],
            highlight: "Switching from a 28 MPG car (gas $3.50/gal) to an EV (3.5 mi/kWh, $0.14/kWh) at 12,000 mi/yr saves $1,020/yr in fuel. Over 10 years, that's $10,200 in fuel savings alone.",
        },
        faq: [
            { question: "How much do EV owners save on fuel per year?", answer: "The average EV owner saves $800–$1,500 per year on fuel compared to a gas car, depending on local gas and electricity prices, driving distance, and the gas car's fuel efficiency. Drivers in high-gas-price states (CA, WA, HI) save more." },
            { question: "Do fuel savings offset the higher EV purchase price?", answer: "Often yes, within 3–7 years. Combined fuel and maintenance savings of $1,500–$2,500/year offset a $7,500–$15,000 price premium in 3–7 years. The federal tax credit can cut break-even time to 2–4 years for eligible buyers." },
        ],
    },
    "ev-tco-calculator": {
        subtitle: "Calculate the true total cost of owning an EV over any time period — purchase price, charging, maintenance, insurance, and depreciation.",
        explanation: {
            heading: "How to Calculate EV Total Cost of Ownership",
            paragraphs: [
                "Total Cost of Ownership (TCO) includes: purchase price + charging costs + maintenance + insurance − resale value. This gives the true cost of ownership, not just the sticker price. TCO per mile = total costs ÷ total miles driven.",
                "EV maintenance costs are significantly lower: no oil changes ($0), brake pads last 2–3× longer (regenerative braking), no transmission service, no timing belt, no exhaust system repairs. The main EV maintenance items are tires, cabin air filter, and coolant.",
            ],
            highlight: "5-year TCO for a $35,000 EV at 12,000 mi/yr: Charging = $2,400, Maintenance = $1,800, Insurance = $9,000, Depreciation = ~$12,250. TCO = ~$25,450. Cost per mile = $0.42.",
        },
        faq: [
            { question: "What is included in EV total cost of ownership?", answer: "Purchase price, financing/interest, federal and state tax credits, charging costs (home + public), maintenance, insurance, registration, tires, and depreciation (or resale value at end of ownership). Our calculator covers the major cost categories." },
            { question: "Is an EV cheaper to own than a gas car over 5 years?", answer: "In most scenarios, yes. While the purchase price is higher, lower fuel costs ($800–$1,500/yr savings), lower maintenance ($500–$1,000/yr savings), and tax credits make the 5-year TCO comparable or lower than a gas equivalent." },
        ],
    },
    "ev-tax-credit-calculator": {
        subtitle: "Check your eligibility for the $7,500 federal EV tax credit under the Inflation Reduction Act based on income, filing status, and vehicle type.",
        explanation: {
            heading: "Understanding the Federal EV Tax Credit",
            paragraphs: [
                "The Inflation Reduction Act (IRA) provides up to $7,500 for new EVs and $4,000 for used EVs. Eligibility depends on three factors: vehicle MSRP limit, buyer income limit, and vehicle assembly/battery sourcing requirements.",
                "New EVs: Sedans/hatchbacks must have MSRP ≤ $55,000; SUVs/trucks/vans ≤ $80,000. Buyer AGI limit: $150,000 single, $300,000 joint. Used EVs: price ≤ $25,000, max credit $4,000, AGI limit $75,000 single, $150,000 joint. The credit can be applied at the point of sale as a price reduction.",
            ],
            highlight: "A new EV SUV at $45,000 with buyer AGI of $120,000 (single filer): MSRP ✅ under $80K limit, Income ✅ under $150K limit. Eligible for full $7,500 credit, bringing effective price to $37,500.",
        },
        faq: [
            { question: "Who qualifies for the $7,500 EV tax credit?", answer: "You must meet income limits (Modified AGI ≤ $150K single or $300K joint for new EVs) and buy an eligible vehicle under the MSRP cap ($55K sedan, $80K SUV/truck). The vehicle must also meet battery and assembly requirements — check the IRS list of qualifying vehicles." },
            { question: "Can I get the EV tax credit at the dealership?", answer: "Yes — since January 2024, you can transfer the credit to the dealer and receive it as a point-of-sale discount. This means you don't have to wait until tax filing season. The dealer reduces your purchase price by the credit amount." },
        ],
    },
    "ev-lease-vs-buy-calculator": {
        subtitle: "Compare the total cost of leasing vs buying an EV — monthly payments, total outlay, and which option makes more financial sense.",
        explanation: {
            heading: "EV Lease vs Buy: How to Decide",
            paragraphs: [
                "Buying: You finance the full price minus down payment. Monthly payments build equity. After the loan, you own the car with no payments. Buying makes sense if you plan to keep the car 5+ years and want to maximize long-term value.",
                "Leasing: You pay only for depreciation (the difference between MSRP and residual value) plus finance charges. Monthly payments are typically lower, but you own nothing at the end. Leasing can be advantageous for EVs because the dealer (not you) claims the $7,500 tax credit and often passes it through as a lower price.",
            ],
            highlight: "A $45,000 EV: Buying with $3,000 down at 5.5% for 60 months = $802/month, $51,120 total. Leasing 36 months with 55% residual = $478/month, $20,208 total (but no ownership).",
        },
        faq: [
            { question: "Is it better to lease or buy an EV?", answer: "Lease if: you want the latest tech every 3 years, drive under 12K mi/yr, or want lower monthly payments. Buy if: you keep cars 5+ years, drive a lot, or want to build equity. EV leases have a unique advantage — the dealer can claim the $7,500 tax credit even if you're over the income limit." },
            { question: "Do EV leases include the tax credit?", answer: "Often yes. When a dealer leases an EV, the leasing company (not the buyer) claims the $7,500 credit. Many dealers pass this through as a 'lease cash' discount, lowering your capitalized cost. This effectively gives you the credit regardless of your income — a major lease advantage." },
        ],
    },
    "ev-charging-time-calculator": {
        subtitle: "Compare charging times across Level 1, Level 2, and DC fast charging for any EV battery. See how long each charger type takes.",
        explanation: {
            heading: "Understanding EV Charging Levels",
            paragraphs: [
                "Level 1 (120V household outlet, ~1.4 kW): adds 3–5 miles of range per hour. Level 2 (240V, 7.7–11.5 kW): adds 25–40 miles per hour. DC Fast Charging (50–350 kW): adds 150–1,000 miles per hour. Each level serves a different use case.",
                "Charging time = kWh needed ÷ charger power (kW). A 75 kWh battery from 20–80% needs 45 kWh. On Level 2 at 7.7 kW: 45 ÷ 7.7 = 5.8 hours. On DC Fast at 150 kW: 45 ÷ 150 = 18 minutes (though charging slows significantly above 80%).",
            ],
            highlight: "75 kWh battery, 20% → 80% (45 kWh needed): Level 1 = 32 hours, Level 2 (7.7 kW) = 5.8 hours, Level 2 Fast (11.5 kW) = 3.9 hours, DC 150 kW = 18 minutes, DC 350 kW = 8 minutes.",
        },
        faq: [
            { question: "How long does it take to charge an EV at home?", answer: "Level 1 (standard 120V outlet): 40–60 hours for a full charge — works for overnight top-ups if you drive < 40 mi/day. Level 2 (240V, requires installation): 6–10 hours for a full charge — ideal for overnight charging and the recommended home setup." },
            { question: "Why does DC fast charging slow down above 80%?", answer: "Battery chemistry requires slower charging rates at high states of charge to prevent overheating and degradation. Most EVs taper charging speed above 80%, making the last 20% take nearly as long as the first 60%. This is why road trip charging targets 80% — it's the optimal speed/efficiency balance." },
        ],
    },
    "ev-range-calculator": {
        subtitle: "Estimate your EV's real-world range from battery capacity and driving efficiency. See usable energy and Wh/mile consumption.",
        explanation: {
            heading: "How to Estimate EV Range",
            paragraphs: [
                "EV range = usable battery capacity (kWh) × efficiency (mi/kWh). Not all battery capacity is usable — manufacturers reserve 5–10% as a buffer to protect battery longevity. So a 75 kWh battery may have only 71 kWh usable.",
                "Efficiency varies by vehicle: compact EVs achieve 3.5–4.5 mi/kWh, midsize sedans 3.0–4.0, SUVs 2.5–3.5, and trucks 2.0–2.5. Real-world efficiency is typically 10–20% lower than EPA ratings due to highway speeds, climate control, and driving style.",
            ],
            highlight: "A 75 kWh battery with 95% usable (71.25 kWh) at 3.5 mi/kWh efficiency = 249 miles estimated range. At 285 Wh/mile energy consumption.",
        },
        faq: [
            { question: "Why is my real-world EV range lower than the EPA rating?", answer: "EPA tests are conducted under controlled conditions at moderate speeds. Real-world factors that reduce range: highway speeds (above 65 mph), cold weather (−20–40%), hot weather (−10–15%), aggressive acceleration, hilly terrain, and HVAC use. Expect 70–85% of EPA range in typical mixed driving." },
            { question: "What is a good EV efficiency in mi/kWh?", answer: "4.0+ mi/kWh = excellent (Tesla Model 3, Hyundai Ioniq 6). 3.0–4.0 = good (most midsize EVs). 2.5–3.0 = average (SUVs, crossovers). Below 2.5 = heavy vehicles (trucks, large SUVs). Higher is better — it means more miles per kWh of energy." },
        ],
    },
    "ev-range-conditions-calculator": {
        subtitle: "See exactly how temperature, speed, terrain, and HVAC use affect your EV's range. Adjust real conditions to get a realistic range estimate.",
        explanation: {
            heading: "How Driving Conditions Affect EV Range",
            paragraphs: [
                "Temperature is the biggest range factor. Cold weather (below 32°F) can reduce range by 20–40% due to battery chemistry slowdown and cabin heating. Hot weather (above 95°F) reduces range by 10–15% from AC load and battery cooling.",
                "Highway speed is the second biggest factor. EVs are most efficient at 25–45 mph. At 65 mph, expect ~20% less range than EPA. At 80 mph, expect ~35% less. The relationship between speed and energy use is exponential — air resistance increases with the square of speed.",
            ],
            highlight: "300-mile EPA range in cold weather (−30%) at highway speed (−20%) with max heat (−18%): effective factor = 0.70 × 0.80 × 0.82 = 46%. Real range = 138 miles. That's a 162-mile reduction from the sticker.",
        },
        faq: [
            { question: "How much range do I lose in cold weather?", answer: "At 32°F: −15–20%. At 0°F: −25–35%. At −10°F: −35–45%. The loss comes from reduced battery performance (chemistry slows) and cabin heating (3–5 kW draw). Using a heat pump (vs resistive heating) reduces cold-weather loss by about 10%." },
            { question: "Does highway driving really use that much more energy?", answer: "Yes. At 65 mph, energy use is ~20% higher than the EPA mixed-cycle test. At 80 mph, ~35% higher. The primary culprit is aerodynamic drag, which increases with the square of speed. Driving 70 mph instead of 80 mph can add 30+ miles of range." },
        ],
    },
    "ev-home-charger-calculator": {
        subtitle: "Estimate the total cost to install a Level 2 EV charger at home — charger unit, wiring, panel upgrades, labor, and permits.",
        explanation: {
            heading: "Home EV Charger Installation Costs",
            paragraphs: [
                "A Level 2 home charger requires a 240V dedicated circuit. The total installed cost ranges from $800 to $3,000+ depending on four factors: charger unit ($300–$800), wiring distance from panel to garage ($5–$10/foot), panel upgrade if needed ($1,200–$2,000), and installation labor ($400–$800).",
                "Most homes built after 2000 have 200-amp panels with room for a 50-amp EV circuit. Older homes with 100 or 150-amp panels may need an upgrade or sub-panel. The wiring run distance is the biggest variable — a long run from basement panel to detached garage can add $500–$1,500.",
            ],
            highlight: "Typical installation: Level 2 40A charger ($500) + 25 ft wiring ($200) + no panel upgrade + labor ($500) + permit ($150) = $1,350 total installed cost.",
        },
        faq: [
            { question: "Do I need a panel upgrade for an EV charger?", answer: "If you have a 200-amp panel with available breaker slots, usually no. A 40-amp EV circuit uses a 50-amp breaker. If your panel is 100 or 150 amps and already near capacity, you'll need a panel upgrade ($1,500–$2,500) or a sub-panel ($800–$1,500)." },
            { question: "Can I install an EV charger myself?", answer: "In most jurisdictions, a 240V circuit requires a licensed electrician and a permit. Some areas allow homeowners to do their own electrical work with a permit and inspection. The charger unit itself (plug-in type) is simple to mount — the electrical work is the regulated part." },
        ],
    },
    "ev-electricity-bill-calculator": {
        subtitle: "See exactly how much your monthly electric bill will increase from charging your EV at home based on your daily driving and electricity rate.",
        explanation: {
            heading: "How EV Charging Affects Your Electric Bill",
            paragraphs: [
                "Daily EV energy use = daily miles ÷ efficiency (mi/kWh). For 40 miles/day at 3.5 mi/kWh, that's 11.4 kWh/day. Monthly: 11.4 × 30 = 343 kWh. At $0.14/kWh, your bill increases by $48/month.",
                "For context, the average US household uses about 900 kWh/month. Charging an EV adds roughly 300–500 kWh/month (30–55% increase in electricity use). Many utilities offer Time-of-Use (TOU) rates with cheaper overnight electricity specifically for EV charging.",
            ],
            highlight: "At 40 miles/day, 3.5 mi/kWh, $0.14/kWh: Daily energy = 11.4 kWh. Monthly bill increase = $48. Annual charging cost = $576. Compare to $1,800/yr in gas for the same driving — you save $1,224/yr.",
        },
        faq: [
            { question: "How much will my electric bill go up with an EV?", answer: "Typically $30–$80/month depending on how much you drive and your electricity rate. The national average is about $45–$55/month for 12,000 mi/yr of driving. This replaces $100–$200/month in gas for most drivers — a net savings." },
            { question: "Should I switch to a Time-of-Use electricity rate?", answer: "Often yes. Many utilities offer EV-specific TOU rates with overnight rates of $0.05–$0.10/kWh (vs $0.14+ standard). Set your EV to charge at midnight and you could cut your charging cost by 40–60%. Check with your utility for available rate plans." },
        ],
    },
    "ev-solar-calculator": {
        subtitle: "Calculate how many solar panels you need to fully offset your EV's electricity consumption and charge for free from the sun.",
        explanation: {
            heading: "How to Size Solar Panels for EV Charging",
            paragraphs: [
                "Solar panel output = panel wattage × peak sun hours per day ÷ 1000 = kWh per panel per day. A 400W panel in an area with 5 peak sun hours produces 2.0 kWh/day. Divide your daily EV energy need by this to get panels needed.",
                "Peak sun hours vary by location: Phoenix AZ = 6.5, Los Angeles = 5.5, Denver = 5.0, New York = 4.0, Seattle = 3.5. System cost averages $2.80 per watt installed (before the 30% federal solar tax credit), so a 3 kW system costs about $5,880 after credit.",
            ],
            highlight: "40 miles/day at 3.5 mi/kWh = 11.4 kWh/day needed. With 400W panels and 5 sun hours: each panel produces 2.0 kWh/day. Panels needed: 6. System size: 2.4 kW. Est. cost: $6,720 (before 30% solar credit = $4,704).",
        },
        faq: [
            { question: "Can solar panels fully charge my EV?", answer: "Yes, if you have enough panels and adequate sun. Most EV drivers need 4–8 additional solar panels (1.6–3.2 kW) beyond their home energy needs. With net metering, solar panels feed the grid during the day and you draw from the grid at night when your EV charges — no battery storage needed." },
            { question: "Is adding solar panels for EV charging worth it?", answer: "Usually yes. A 2.4 kW system costs ~$4,700 after the 30% federal solar credit and saves ~$500–$700/year in charging costs. Payback period: 7–9 years with 25+ year panel lifespan. If you're already going solar for your home, adding capacity for EV charging is very cost-effective." },
        ],
    },
    "ev-trip-cost-calculator": {
        subtitle: "Calculate the electricity cost of any trip in your EV and compare it to what the same trip would cost in a gas car.",
        explanation: {
            heading: "How to Calculate EV Trip Cost",
            paragraphs: [
                "EV trip cost = (distance ÷ efficiency in mi/kWh) × electricity rate. For a 300-mile trip at 3.5 mi/kWh and $0.14/kWh: 85.7 kWh × $0.14 = $12.00. The same trip in a 28 MPG gas car at $3.50/gallon: 10.7 gallons × $3.50 = $37.50.",
                "For road trips using DC fast charging, costs are higher than home rates. Many networks charge $0.30–$0.50/kWh. Some offer subscription plans that reduce per-kWh costs. Factor in the charging network you'll use when planning trip costs.",
            ],
            highlight: "300-mile trip: EV at home rates ($0.14/kWh) = $12.00. EV at DC Fast rates ($0.35/kWh) = $30.00. Gas car (28 MPG, $3.50/gal) = $37.50. Even at DC fast rates, the EV is cheaper.",
        },
        faq: [
            { question: "How much does it cost to drive an EV on a road trip?", answer: "Using DC fast charging at $0.35/kWh with average EV efficiency of 3.5 mi/kWh: about $0.10 per mile. A 500-mile trip costs approximately $50. Compare to a gas car at $0.12–$0.15/mile. EVs are cheaper even with the most expensive charging." },
            { question: "Is it cheaper to charge at home before a road trip?", answer: "Always. Home charging at $0.14/kWh costs 4¢/mile. DC fast charging at $0.35/kWh costs 10¢/mile. Start every trip with a full charge from home. Use DC fast chargers only when needed to extend range during the trip." },
        ],
    },
    "ev-road-trip-calculator": {
        subtitle: "Plan your EV road trip: calculate how many charging stops you need, total charging time, and estimated cost for any distance.",
        explanation: {
            heading: "How to Plan an EV Road Trip",
            paragraphs: [
                "Usable range per leg = EPA range × 80% (to account for real-world conditions and charging from 20–80%). Charging stops = (total distance ÷ usable range) − 1, rounded up. Each stop typically takes 20–30 minutes at a 150 kW DC fast charger.",
                "Pro tip: Plan to arrive at chargers with 10–20% battery and charge to 80%. Charging from 20–80% is the fastest window. Going from 80–100% takes nearly as long as 10–80% due to charging speed taper. Apps like PlugShare, ABRP, and the built-in nav in most EVs plan stops automatically.",
            ],
            highlight: "500-mile trip in an EV with 270 miles range: usable range per leg = 216 miles. Stops needed: 2. Time per stop (at 150 kW): ~20 min. Total charging time: 40 min. Est. cost (DC fast): $65.",
        },
        faq: [
            { question: "How many charging stops do I need for a road trip?", answer: "Divide your trip distance by 80% of your EV's range. Subtract 1. That's your number of stops. A 500-mile trip in a 300-mile EV: 500 ÷ 240 = 2.1 → 2 stops. Most stops take 15–30 minutes on a fast charger." },
            { question: "What apps help plan EV road trips?", answer: "A Better Route Planner (ABRP) is the gold standard — it accounts for your specific EV, weather, elevation, and speed. PlugShare shows all charging stations with user reviews. Most modern EVs also have built-in route planning that adds charging stops to navigation." },
        ],
    },
    "ev-cost-per-mile-calculator": {
        subtitle: "Calculate the all-in cost per mile for your EV — electricity, maintenance, insurance, and more. Compare to gas car cost per mile.",
        explanation: {
            heading: "How to Calculate EV Cost per Mile",
            paragraphs: [
                "Electricity cost per mile = electricity rate ÷ efficiency. At $0.14/kWh and 3.5 mi/kWh, that's $0.04/mile. For comparison, gas at $3.50/gal in a 28 MPG car = $0.125/mile — more than 3× the EV electricity cost.",
                "All-in cost per mile adds insurance, maintenance, and other fixed costs divided by annual miles. EVs typically run $0.20–$0.35 per mile all-in, while gas cars run $0.35–$0.60 per mile. Higher annual mileage reduces the per-mile fixed cost component.",
            ],
            highlight: "At 12,000 mi/yr: EV electricity = 4.0¢/mile. With $1,800 insurance and $400 maintenance: total $2,680/yr ÷ 12,000 = 22.3¢/mile all-in.",
        },
        faq: [
            { question: "What is the average cost per mile for an EV?", answer: "Electricity only: 3–5¢ per mile (home charging). All-in (electricity + insurance + maintenance): 20–35¢ per mile. Compare to gas cars: fuel only 10–15¢/mile, all-in 35–60¢/mile. The EV advantage grows with higher gas prices and more annual miles driven." },
            { question: "How does EV cost per mile compare to gas?", answer: "On electricity alone, EVs cost 3–5¢/mile vs 10–15¢/mile for gas — about 70% cheaper. All-in, EVs cost 20–35¢/mile vs 35–60¢/mile for gas. The gap is largest for high-mileage drivers and in areas with cheap electricity and expensive gas." },
        ],
    },
    "ev-battery-degradation-calculator": {
        subtitle: "Estimate your EV battery's remaining health and capacity based on vehicle age, mileage, and charging habits.",
        explanation: {
            heading: "Understanding EV Battery Degradation",
            paragraphs: [
                "EV batteries lose capacity gradually over time and use. The average degradation rate is about 2.3% per year. By year 5, most EV batteries retain 85–90% of original capacity. By year 10, they retain 75–85%. Modern batteries are lasting longer than early projections.",
                "Factors that accelerate degradation: frequent DC fast charging (adds 1–2% extra loss), extreme heat exposure, frequently charging to 100%, and frequently depleting below 10%. Best practices: charge daily to 80%, use Level 2 at home, avoid extreme temperatures when possible.",
            ],
            highlight: "A 3-year-old EV with 50,000 miles and 20% DC fast charging: estimated battery health = 89%. A 75 kWh battery retains 66.9 kWh of usable capacity.",
        },
        faq: [
            { question: "How long do EV batteries last?", answer: "Most EV batteries are warrantied for 8 years / 100,000 miles with 70% capacity guaranteed. Real-world data shows average degradation of 2.3% per year. After 10 years, most batteries retain 75–85% capacity — still very usable for daily driving." },
            { question: "Does DC fast charging damage the battery?", answer: "Frequent DC fast charging causes slightly more degradation than Level 2 — about 1–2% additional capacity loss over 100,000 miles. Occasional fast charging on road trips is fine. For daily driving, Level 2 (240V) home charging is gentler on the battery and much cheaper." },
        ],
    },
    "ev-battery-replacement-calculator": {
        subtitle: "Estimate how much it would cost to replace your EV battery pack — battery module cost, labor, and total replacement price.",
        explanation: {
            heading: "EV Battery Replacement Costs",
            paragraphs: [
                "Battery pack cost = capacity (kWh) × cost per kWh. In 2024–2025, pack-level costs are approximately $100–$200 per kWh depending on chemistry and manufacturer. A 75 kWh pack costs $7,500–$15,000 for the battery alone, plus $1,000–$2,000 in labor.",
                "The good news: battery prices have dropped 90% since 2010 and continue to fall. Most EV batteries outlast the vehicle — only 1.5% of EV batteries have been replaced outside of recalls. Warranty coverage (8 years / 100,000 miles) provides peace of mind for most owners.",
            ],
            highlight: "75 kWh battery replacement: Pack cost at $150/kWh = $11,250. Labor (8 hours at $150/hr) = $1,200. Total = $12,450. Note: this is a worst-case scenario — most batteries last 15+ years.",
        },
        faq: [
            { question: "How much does a Tesla battery replacement cost?", answer: "Tesla battery replacement for a Model 3/Y: $12,000–$15,000 including labor. Model S/X: $15,000–$22,000. These are full pack replacements — individual module replacement (if just one module is faulty) costs $5,000–$7,000. Prices continue to drop annually." },
            { question: "Will I ever need to replace my EV battery?", answer: "Probably not during typical ownership. Data shows less than 2% of EV batteries need replacement outside recalls. With proper care (charging to 80%, avoiding extreme heat), batteries retain 80%+ capacity after 10 years. You'll likely sell the car before the battery needs replacing." },
        ],
    },
    "ev-hp-kw-converter": {
        subtitle: "Convert between horsepower and kilowatts for EV motors. Includes mechanical, metric, and electrical horsepower equivalents.",
        explanation: {
            heading: "Converting HP to kW for Electric Motors",
            paragraphs: [
                "1 mechanical horsepower (HP) = 0.7457 kilowatts (kW). This conversion applies to electric motor output ratings. EV manufacturers typically specify motor power in kW (common in Europe and for technical specs) or HP (common in US marketing).",
                "Electric motor HP is different from gas engine HP in one important way: electric motors produce maximum torque from 0 RPM, while gas engines need to rev up to reach peak power. A 300 HP electric motor feels significantly more powerful than a 300 HP gas engine at low speeds.",
            ],
            highlight: "300 HP = 223.7 kW = 304.2 metric HP (PS). EV motors deliver all their torque instantly, making a 300 HP EV feel like a 400+ HP gas car off the line.",
        },
        faq: [
            { question: "Why do EVs use kW instead of horsepower?", answer: "kW is the SI (metric) unit and is used internationally. It directly relates to electrical energy (kWh for battery capacity, kW for charging speed). US-market EVs often list both kW and HP. The Tesla Model 3 Performance, for example, is rated at 450 HP / 336 kW." },
            { question: "What is the difference between HP and PS?", answer: "HP is mechanical horsepower (US/UK), PS is metric horsepower (German 'Pferdestärke'). 1 HP = 1.0139 PS. The difference is negligible — 300 HP ≈ 304 PS. European manufacturers use PS in their specs." },
        ],
    },
    "ev-acceleration-calculator": {
        subtitle: "Estimate your EV's 0-60 mph time from motor power, vehicle weight, and drivetrain configuration.",
        explanation: {
            heading: "Estimating EV Acceleration",
            paragraphs: [
                "EV acceleration depends primarily on power-to-weight ratio and traction. Our estimator uses motor power (kW), curb weight, and drivetrain (RWD vs AWD) to approximate 0-60 mph time. AWD EVs have better traction, reducing wheelspin and improving launch times.",
                "EVs have an inherent advantage in acceleration: electric motors deliver maximum torque instantly from 0 RPM. There's no need to build RPM or shift gears. This is why even modest EVs can surprise on-paper faster gas cars at traffic lights.",
            ],
            highlight: "300 kW (402 HP) dual motor AWD at 4,500 lbs: estimated 0-60 = 3.8 seconds, quarter mile = 12.9 seconds. That's supercar territory from a family sedan.",
        },
        faq: [
            { question: "Why are EVs so fast off the line?", answer: "Electric motors produce peak torque at 0 RPM — instant, maximum force the moment you press the pedal. Gas engines need to rev to their power band. No gear changes means no power interruption. AWD EVs can use both axles independently for optimal traction." },
            { question: "Does more power always mean faster 0-60?", answer: "No — weight and traction matter equally. A 300 kW motor in a 4,000 lb car is faster than the same motor in a 6,000 lb truck. AWD improves traction and reduces wheelspin, which is why dual-motor EVs are significantly faster off the line than single-motor versions." },
        ],
    },
    "ev-loan-calculator": {
        subtitle: "Calculate monthly payments for your EV loan. Factor in down payment, trade-in value, tax credit, and interest rate.",
        explanation: {
            heading: "How to Calculate EV Loan Payments",
            paragraphs: [
                "EV loan amount = vehicle price − down payment − trade-in − tax credit applied at purchase. Monthly payment uses the standard amortization formula. EV-specific: the $7,500 federal tax credit can be applied at the point of sale since 2024, directly reducing your loan amount.",
                "Current EV loan rates (2025): Excellent credit (750+) → 4.5–6%. Good credit (700–749) → 6–8%. Fair credit (650–699) → 8–12%. Some automakers offer promotional 0% or low-rate financing for new EVs. Credit unions often have the best EV-specific loan rates.",
            ],
            highlight: "$45,000 EV − $5,000 down − $7,500 tax credit = $32,500 loan. At 5.5% for 60 months: $621/month. Total interest: $4,770. Total paid: $42,270.",
        },
        faq: [
            { question: "Can I include the EV tax credit in my loan calculation?", answer: "Yes — since January 2024, you can transfer the $7,500 credit to the dealer as a point-of-sale discount, reducing the amount you need to finance. This lowers your loan amount, monthly payment, and total interest paid." },
            { question: "What is a good interest rate for an EV loan?", answer: "As of 2025: under 5% is excellent, 5–7% is good, 7–9% is average, above 9% is high. Shop credit unions, which often offer EV-specific rates 0.5–1% below banks. Some manufacturers offer promotional rates (0–2.9%) that beat all third-party financing." },
        ],
    },
    "ev-break-even-calculator": {
        subtitle: "Calculate how many years until your EV pays for itself compared to a gas car through accumulated fuel and maintenance savings.",
        explanation: {
            heading: "How to Calculate EV Break-Even Point",
            paragraphs: [
                "Break-even period = EV price premium ÷ annual savings. The price premium is how much more the EV costs than a comparable gas car. Annual savings include fuel savings + maintenance savings. For most buyers, the break-even point is 3–7 years.",
                "After the federal tax credit, many EV price premiums are only $5,000–$10,000 over gas equivalents. With $1,500–$2,500/year in total savings, break-even can come as early as 2–4 years. After that, you're saving money every year compared to the gas alternative.",
            ],
            highlight: "$10,000 EV price premium with $1,500/yr fuel savings + $500/yr maintenance savings = $2,000/yr total savings. Break-even: 5.0 years (60 months). After that, pure savings.",
        },
        faq: [
            { question: "How long does it take for an EV to pay for itself?", answer: "Typically 3–7 years after accounting for fuel and maintenance savings. With the $7,500 tax credit, break-even can come in 2–4 years. High-mileage drivers (20,000+ mi/yr) break even fastest. Low gas prices or very expensive electricity extend the period." },
            { question: "What savings count toward break-even?", answer: "Fuel savings (largest): $800–$1,500/yr. Maintenance savings: $500–$1,000/yr. Some states offer additional savings: no emissions testing ($30–$50/yr), HOV lane access (time savings), reduced registration fees, and state tax credits that stack with the federal credit." },
        ],
    },
    "ev-resale-value-calculator": {
        subtitle: "Estimate your EV's resale value based on purchase price, vehicle age, and mileage. See depreciation and value retention over time.",
        explanation: {
            heading: "EV Depreciation and Resale Value",
            paragraphs: [
                "EVs depreciate faster in the first 2–3 years than gas cars (losing ~30–40% of value), but then stabilize. The primary depreciation driver is battery technology advancement — buyers want the latest range and features. By year 5, retention rates are similar to gas cars at 50–55%.",
                "Factors that improve EV resale: popular brand (Tesla retains the best value), larger battery (more range = higher demand), low mileage, and good battery health. The used EV market is maturing rapidly, with more price stability expected as the technology plateau continues.",
            ],
            highlight: "A $45,000 EV after 3 years and 36,000 miles: estimated retention = 62%, resale value = $27,900, depreciation = $17,100. Low-mileage vehicles (under 30K miles) retain ~2% more value.",
        },
        faq: [
            { question: "Do EVs hold their value?", answer: "It depends on the model. Teslas retain value very well (60–70% after 3 years). Most other EVs retain 50–60% after 3 years. Older EVs with small batteries (<150 mile range) depreciate faster. The trend is improving as EV demand grows and battery range stabilizes." },
            { question: "What EVs have the best resale value?", answer: "As of 2025: Tesla Model 3 and Model Y lead resale value (65–70% after 3 years). Hyundai Ioniq 5, Kia EV6, and Ford Mustang Mach-E also hold value well. Vehicles with 250+ mile range retain value much better than shorter-range models." },
        ],
    },
};

export default async function EVCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("ev").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];

    const pageUrl = canonicalUrl(`/ev-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "EV Calculators", url: canonicalUrl("/ev-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-ev-calc"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "EV Calculators", href: "/ev-calculators" },
                    { label: calc.title.replace(" Calculator", "") },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && (
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                    {content.subtitle}
                </p>
            )}

            <div className="layout-2col">
                <div className="layout-2col__main">
                    <EVCalculatorCore calcType={calc.calcType || "ev-vs-gas"} />

                    {content && (
                        <>
                            <DynamicExplanation
                                heading={content.explanation?.heading}
                                paragraphs={content.explanation?.paragraphs}
                                highlight={content.explanation?.highlight}
                                contentHTML={content.contentHTML}
                            />
                            {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                        </>
                    )}
                </div>

                <aside className="layout-2col__sidebar">
                    <TrendingCalculations variant="sidebar" />
                </aside>
            </div>
        </main>
    );
}
