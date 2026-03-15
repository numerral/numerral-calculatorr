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
        subtitle: "Compare the true annual cost of driving an EV vs a petrol/diesel car — fuel, maintenance, and total operating expenses side by side.",
        explanation: {
            heading: "How to Compare EV vs Gas Costs",
            paragraphs: [
                "The annual fuel cost for a petrol car = (annual km ÷ fuel efficiency in km/L) × fuel price per litre. For an EV = (annual km ÷ efficiency in km/kWh) × electricity rate per kWh. Enter your own local prices for accurate results.",
                "Beyond fuel, maintenance costs differ significantly. Petrol/diesel cars need oil changes, brake servicing, exhaust and transmission work. EVs skip all of that — they have no engine oil, brakes last 2–3× longer (regenerative braking), and no transmission fluid or exhaust system to maintain.",
            ],
            highlight: "At 20,000 km/year: a 12 km/L petrol car at 1.50/L costs 2,500 in fuel per year. An EV at 6 km/kWh and 0.15/kWh costs just 500. That's 2,000 saved annually on fuel alone.",
        },
        faq: [
            { question: "Is it really cheaper to drive an EV than a petrol car?", answer: "Almost always, yes — on a per-km basis. The average EV costs 60–80% less per km in energy compared to petrol. Combined with lower maintenance, most EV owners save 40–60% on total running costs." },
            { question: "What about the higher purchase price of EVs?", answer: "EVs have a higher upfront cost, but the gap is shrinking every year. Government incentives, lower running costs, and cheaper maintenance mean the total cost of ownership often favours EVs over 5–7 years." },
        ],
    },
    "ev-charging-cost-calculator": {
        subtitle: "Calculate how much it costs to charge your EV from any state of charge — at home or at a public DC fast charging station.",
        explanation: {
            heading: "How to Calculate EV Charging Cost",
            paragraphs: [
                "EV charging cost = kWh needed × electricity rate. The kWh needed = battery capacity × (target % − current %) ÷ 100. For example, charging a 75 kWh battery from 20% to 80% requires 75 × 0.60 = 45 kWh.",
                "Home charging is significantly cheaper than public fast charging. Enter your local home electricity rate and DC fast charging rate for accurate comparison. In most regions, home charging costs 2–3× less than public fast chargers.",
            ],
            highlight: "Charging a 75 kWh battery from 20% to 80% (45 kWh needed): at home rate of 0.15/kWh costs 6.75. At DC fast rate of 0.40/kWh costs 18.00. Home charging saves over 11 per session.",
        },
        faq: [
            { question: "How much does it cost to fully charge an EV at home?", answer: "Multiply your battery size by your local electricity rate. For a 75 kWh battery, a full charge costs 75 × your rate. A typical 20–80% charge uses about 60% of battery capacity. Monthly home charging for average driving is very affordable." },
            { question: "Is DC fast charging expensive?", answer: "Relative to home charging, yes — typically 2–3× more expensive per kWh. It's designed for road trips and convenience, not daily use. For everyday driving, home or workplace charging is far more economical." },
        ],
    },
    "ev-fuel-savings-calculator": {
        subtitle: "See how much you can save on fuel by switching to an EV — annual costs plus 5 and 10-year projections.",
        explanation: {
            heading: "How to Calculate EV Fuel Savings",
            paragraphs: [
                "EV fuel savings = annual petrol/diesel cost − annual EV electricity cost. The formula uses your local fuel and electricity prices. Enter your own values to see accurate savings for your situation.",
                "The savings compound over time. At 1,500 saved per year, that's 7,500 over 5 years and 15,000 over 10 years — often enough to offset the EV price premium. Electricity prices are also more stable than fuel prices, making EV costs more predictable.",
            ],
            highlight: "Switching from a 12 km/L car (fuel at 1.50/L) to an EV (6 km/kWh, 0.15/kWh) at 20,000 km/yr saves roughly 2,000/yr in fuel alone. Over 10 years, that's 20,000.",
        },
        faq: [
            { question: "How much do EV owners save on fuel per year?", answer: "Savings depend on your local fuel and electricity prices and how much you drive. Most EV owners report 50–75% lower energy costs compared to petrol. High-mileage drivers save the most." },
            { question: "Do fuel savings offset the higher EV purchase price?", answer: "Often yes, within 3–7 years. The break-even point depends on the price difference, government incentives, and your driving distance. Use our EV Break-Even Calculator for a personalised timeline." },
        ],
    },
    "ev-tco-calculator": {
        subtitle: "Calculate the true total cost of owning an EV over any time period — purchase price, charging, maintenance, insurance, and depreciation.",
        explanation: {
            heading: "How to Calculate EV Total Cost of Ownership",
            paragraphs: [
                "Total Cost of Ownership (TCO) includes: charging costs + maintenance + insurance + depreciation over your ownership period. This gives you the true running cost beyond the sticker price.",
                "EV maintenance is significantly lower: no oil changes, brakes last longer (regenerative braking), no transmission service, no exhaust repairs. The main EV maintenance items are tyres, cabin air filter, and coolant — that's it.",
            ],
            highlight: "5-year TCO for a 35,000 EV at 20,000 km/yr: Charging ≈ 2,500, Maintenance ≈ 2,000, Insurance ≈ 7,500, Depreciation ≈ 12,250. Total running cost = 24,250. Cost per km ≈ 0.24.",
        },
        faq: [
            { question: "What is included in EV total cost of ownership?", answer: "Charging costs (home + public), maintenance, insurance, tyre replacement, and depreciation. Our calculator lets you enter your own values for each, so the result reflects your actual situation." },
            { question: "Is an EV cheaper to own than a petrol car over 5 years?", answer: "In most scenarios, yes. While the purchase price may be higher, lower fuel and maintenance costs often make the 5-year TCO comparable or lower — especially with government incentives applied." },
        ],
    },
    "ev-tax-credit-calculator": {
        subtitle: "Calculate your effective EV price after applying national/federal incentives and state/regional subsidies available in your country.",
        explanation: {
            heading: "Understanding EV Government Incentives",
            paragraphs: [
                "Most countries offer incentives to encourage EV adoption. These range from direct purchase subsidies and tax credits to reduced registration fees and toll exemptions. Enter your available incentives to see the effective price.",
                "Incentives vary widely: some countries offer substantial purchase subsidies, while others provide tax reductions, free parking, or toll exemptions. Check your national and regional government websites for current EV incentive programs.",
            ],
            highlight: "A 40,000 EV with 5,000 national incentive + 2,000 regional subsidy = 33,000 effective price. That's a 17.5% price reduction through government support.",
        },
        faq: [
            { question: "What EV incentives are available?", answer: "It depends on your country and region. Common incentives include: purchase subsidies, reduced/zero registration tax, reduced road tax, free toll roads, free public parking, reduced company car tax, and home charger installation grants. Check your local government website." },
            { question: "Can incentives be combined?", answer: "In most countries, yes — national/federal incentives can be stacked with state/regional incentives and sometimes even municipal-level benefits. Our calculator lets you add both to see the combined effect on your effective purchase price." },
        ],
    },
    "ev-lease-vs-buy-calculator": {
        subtitle: "Compare the total cost of leasing vs buying an EV — monthly payments, total outlay, and which option makes more financial sense for you.",
        explanation: {
            heading: "EV Lease vs Buy: How to Decide",
            paragraphs: [
                "Buying: You finance the full price minus down payment. Monthly payments build equity. After the loan, you own the car with no payments. Buying makes sense if you plan to keep the car 5+ years.",
                "Leasing: You pay only for depreciation plus finance charges. Monthly payments are lower, but you own nothing at the end. Leasing can make sense for EV buyers who want the latest technology every 3 years, as EV tech improves rapidly.",
            ],
            highlight: "A 40,000 EV: Buying with 3,000 down at 6% for 60 months ≈ 716/month, 45,960 total. Leasing 36 months with 55% residual ≈ 430/month, 18,480 total (but no ownership at the end).",
        },
        faq: [
            { question: "Is it better to lease or buy an EV?", answer: "Lease if: you want the latest tech every 3 years, drive under average km/year, or want lower monthly payments. Buy if: you keep cars 5+ years, drive a lot, or want to build equity. EV technology evolves fast, which can make leasing attractive." },
            { question: "Does leasing affect incentive eligibility?", answer: "In many countries, leasing companies can claim incentives that may not be available to individual buyers (or vice versa). Check your local rules — in some cases, leasing offers a tax advantage." },
        ],
    },
    "ev-charging-time-calculator": {
        subtitle: "Compare charging times across AC slow, AC standard, AC fast, and DC fast charging for any EV battery size.",
        explanation: {
            heading: "Understanding EV Charging Speeds",
            paragraphs: [
                "AC Slow (2.3 kW, standard household outlet): ideal for overnight top-ups. AC Standard (7.4 kW, dedicated home charger): the most common home setup. AC Fast (11–22 kW): found at workplaces and public stations. DC Fast (50–350 kW): highway and rapid charging stations.",
                "Charging time = kWh needed ÷ charger power (kW). A 75 kWh battery from 20–80% needs 45 kWh. On AC Standard at 7.4 kW: 45 ÷ 7.4 = 6.1 hours. On DC Fast at 150 kW: 45 ÷ 150 = 18 minutes (though charging slows above 80%).",
            ],
            highlight: "75 kWh battery, 20% → 80% (45 kWh): AC Slow (2.3 kW) = 19.6 hrs, AC Standard (7.4 kW) = 6.1 hrs, AC Fast (11 kW) = 4.1 hrs, DC 150 kW = 18 min, DC 350 kW = 8 min.",
        },
        faq: [
            { question: "How long does it take to charge an EV at home?", answer: "With a standard household outlet (2.3 kW): 20–40 hours for a full charge — fine for overnight if you drive < 50 km/day. With a dedicated home charger (7.4 kW): 6–10 hours for a full charge — ideal for overnight charging." },
            { question: "Why does DC fast charging slow down above 80%?", answer: "Battery chemistry requires slower charging at high states of charge to prevent overheating and degradation. Most EVs taper speed above 80%. This is why road trip charging targets 80% — it's the optimal speed/efficiency balance." },
        ],
    },
    "ev-range-calculator": {
        subtitle: "Estimate your EV's real-world range from battery capacity and driving efficiency in km/kWh.",
        explanation: {
            heading: "How to Estimate EV Range",
            paragraphs: [
                "EV range = usable battery capacity (kWh) × efficiency (km/kWh). Not all battery capacity is usable — manufacturers reserve 5–10% as a buffer. So a 75 kWh battery may have only ~71 kWh usable.",
                "Efficiency varies: compact EVs achieve 6–7 km/kWh, midsize sedans 5–6, SUVs 4–5, and trucks 3–4. Real-world efficiency is typically 10–20% lower than manufacturer ratings due to highway speeds, climate control, and driving style.",
            ],
            highlight: "75 kWh battery with 95% usable (71.25 kWh) at 6 km/kWh = 427 km estimated range. Energy consumption = 167 Wh/km.",
        },
        faq: [
            { question: "Why is my real-world EV range lower than the rated range?", answer: "Manufacturer tests are conducted under controlled conditions. Real-world factors that reduce range: highway speeds, cold weather (−20–40%), hot weather (−10–15%), aggressive acceleration, hilly terrain, and HVAC use. Expect 70–85% of rated range in typical mixed driving." },
            { question: "What is a good EV efficiency in km/kWh?", answer: "6+ km/kWh = excellent (efficient sedans). 5–6 = good (most midsize EVs). 4–5 = average (SUVs, crossovers). Below 4 = heavy vehicles (trucks, large SUVs). Higher is better — more km per kWh of energy." },
        ],
    },
    "ev-range-conditions-calculator": {
        subtitle: "See exactly how temperature, speed, terrain, and HVAC use affect your EV's range. Adjust real conditions for a realistic estimate.",
        explanation: {
            heading: "How Driving Conditions Affect EV Range",
            paragraphs: [
                "Temperature is the biggest range factor. Cold weather (below 0°C) can reduce range by 20–40% due to battery chemistry slowdown and cabin heating. Hot weather (above 35°C) reduces range by 10–15% from AC and battery cooling.",
                "Highway speed is the next biggest factor. EVs are most efficient at 40–70 km/h. At 100 km/h, expect ~20% less range. At 130 km/h, expect ~35% less. Air resistance increases with the square of speed — so a small speed increase costs disproportionate range.",
            ],
            highlight: "400 km rated range in cold (−30%) at highway 130 km/h (−35%) with max heat (−18%): effective factor = 46%. Real range = 184 km — a 216 km reduction.",
        },
        faq: [
            { question: "How much range do I lose in cold weather?", answer: "At 0°C: −15–20%. At −10°C: −25–35%. At −20°C: −35–45%. The loss comes from reduced battery performance and cabin heating. EVs with heat pumps lose less (about 10% less than resistive heating)." },
            { question: "Does highway driving really use that much more energy?", answer: "Yes. At 100 km/h, energy use is ~20% more than mixed driving. At 130 km/h, ~35% more. Aerodynamic drag (which increases with speed squared) is the main reason. Driving 110 instead of 130 km/h can add 50+ km of range." },
        ],
    },
    "ev-home-charger-calculator": {
        subtitle: "Estimate the total cost to install a home EV charger — charger unit, wiring, panel upgrades, electrician labour, and permits.",
        explanation: {
            heading: "Home EV Charger Installation Costs",
            paragraphs: [
                "A home EV charger (AC, typically 7–22 kW) requires a dedicated circuit. The total installed cost depends on: charger unit cost, wiring distance from electrical panel to charging location, any panel upgrade needed, and electrician labour rates.",
                "Enter your local costs for accurate estimates. Charger units range from budget to premium. Wiring cost depends on distance (per metre). Some homes need an electrical panel upgrade to handle the extra load.",
            ],
            highlight: "Typical installation: AC 7.4 kW charger (500) + 8 m wiring (200) + no panel upgrade + electrician (400) + permit (100) = 1,200 total installed cost.",
        },
        faq: [
            { question: "Do I need a panel upgrade for an EV charger?", answer: "It depends on your home's electrical capacity. If your panel has spare capacity for a 32A circuit, usually no upgrade is needed. An electrician can assess this. Older homes with limited capacity may need an upgrade or dedicated sub-panel." },
            { question: "Can I install an EV charger myself?", answer: "In most countries, installing a dedicated 240V/400V circuit requires a licensed electrician and may need a permit/inspection. The charger unit itself is easy to mount — the electrical wiring is the regulated part. Always check local regulations." },
        ],
    },
    "ev-electricity-bill-calculator": {
        subtitle: "See exactly how much your monthly electricity bill will increase from charging your EV at home based on your daily driving.",
        explanation: {
            heading: "How EV Charging Affects Your Electric Bill",
            paragraphs: [
                "Daily EV energy use = daily km ÷ efficiency (km/kWh). For 50 km/day at 6 km/kWh, that's 8.3 kWh/day. Monthly: 8.3 × 30 = 250 kWh. Multiply by your local electricity rate for the monthly cost increase.",
                "Many electricity providers offer time-of-use tariffs with cheaper overnight rates. Setting your EV to charge during off-peak hours (typically late night) can significantly reduce your charging costs.",
            ],
            highlight: "At 50 km/day, 6 km/kWh, 0.15/kWh: Daily energy = 8.3 kWh. Monthly bill increase ≈ 37.50. Annual charging cost ≈ 450. Compare this to what you'd spend on petrol for the same distance.",
        },
        faq: [
            { question: "How much will my electric bill go up with an EV?", answer: "It depends on how much you drive and your electricity rate. As a rough guide, 50 km/day at 6 km/kWh adds about 250 kWh/month to your usage. Multiply by your rate: at 0.15/kWh that's about 37.50/month." },
            { question: "Should I switch to a time-of-use electricity tariff?", answer: "Often yes. Many providers offer overnight rates that are 40–60% cheaper than daytime rates. Set your EV to charge between midnight and 6am and you could nearly halve your charging cost. Check with your electricity provider." },
        ],
    },
    "ev-solar-calculator": {
        subtitle: "Calculate how many solar panels you need to fully offset your EV's electricity consumption and charge from the sun.",
        explanation: {
            heading: "How to Size Solar Panels for EV Charging",
            paragraphs: [
                "Solar panel daily output = panel wattage × peak sun hours ÷ 1000 = kWh per panel per day. A 400 W panel in an area with 5 peak sun hours produces 2.0 kWh/day. Divide your daily EV energy need by this to get panels needed.",
                "Peak sun hours vary by location: sunny regions get 5–7 hours, temperate regions 3–5, and northern regions 2–4. Enter your local peak sun hours for accurate results. System costs vary widely by region — enter your local cost per watt.",
            ],
            highlight: "50 km/day at 6 km/kWh = 8.3 kWh/day needed. With 400 W panels and 5 sun hours: each panel produces 2.0 kWh/day. Panels needed: 5. System size: 2.0 kW.",
        },
        faq: [
            { question: "Can solar panels fully charge my EV?", answer: "Yes, if you have enough panels and adequate sun. Most EV drivers need 4–8 additional panels beyond their home energy needs. With net metering or feed-in tariffs, solar panels produce during the day and you charge at night — no battery storage required." },
            { question: "Is adding solar panels for EV charging worth it?", answer: "In sunny regions, usually yes. The payback period depends on your local electricity cost, solar system cost, and how much you drive. In many regions, the payback is 5–10 years with 25+ year panel lifespan." },
        ],
    },
    "ev-trip-cost-calculator": {
        subtitle: "Calculate the electricity cost of any trip in your EV and compare it to what the same trip would cost in a petrol car.",
        explanation: {
            heading: "How to Calculate EV Trip Cost",
            paragraphs: [
                "EV trip cost = (distance ÷ efficiency in km/kWh) × electricity rate. For a 500 km trip at 6 km/kWh and 0.15/kWh: 83.3 kWh × 0.15 = 12.50. Compare this with the petrol equivalent.",
                "For road trips using DC fast charging, costs are higher than home rates. Enter both your home rate and the DC fast rate you expect to pay for accurate trip cost estimates.",
            ],
            highlight: "500 km trip: EV at home rates (0.15/kWh) ≈ 12.50. Petrol car (12 km/L at 1.50/L) ≈ 62.50. Even at DC fast rates (0.40/kWh) the EV costs ≈ 33.30 — still nearly half the petrol cost.",
        },
        faq: [
            { question: "How much does it cost to drive an EV on a road trip?", answer: "Using DC fast charging, costs depend on the network rate. Typically 2–3× home charging rates, but still cheaper than petrol per km. A 500 km trip might cost 25–40 at DC fast rates compared to 50–80 in petrol." },
            { question: "Is it cheaper to charge at home before a road trip?", answer: "Always. Home charging costs roughly half of DC fast charging. Start every trip with a full charge from home. Use DC fast chargers only when needed to extend range during the trip." },
        ],
    },
    "ev-road-trip-calculator": {
        subtitle: "Plan your EV road trip: calculate how many charging stops you need, total charging time, and estimated cost for any distance.",
        explanation: {
            heading: "How to Plan an EV Road Trip",
            paragraphs: [
                "Usable range per leg = rated range × 80% (to account for real-world conditions and charging from 20–80%). Charging stops = (total distance ÷ usable range) − 1, rounded up. Each stop typically takes 15–30 minutes at a 150 kW DC fast charger.",
                "Pro tip: plan to arrive at chargers with 10–20% battery and charge to 80%. Charging from 20–80% is the fastest window. Going from 80–100% takes nearly as long as 10–80% due to taper. Route planning apps like ABRP plan stops automatically.",
            ],
            highlight: "800 km trip in an EV with 400 km range: usable per leg = 320 km. Stops needed: 2. Time per stop (150 kW): ~20 min. Total charging time: 40 min.",
        },
        faq: [
            { question: "How many charging stops do I need for a road trip?", answer: "Divide your trip distance by 80% of your EV's range. Subtract 1. That's your number of stops. An 800 km trip in a 400 km EV: 800 ÷ 320 = 2.5 → 2 stops. Most stops take 15–30 minutes on a fast charger." },
            { question: "What apps help plan EV road trips?", answer: "A Better Route Planner (ABRP) is the gold standard — it accounts for your specific EV, weather, elevation, and speed. Most modern EVs also have built-in route planning that automatically adds charging stops." },
        ],
    },
    "ev-cost-per-mile-calculator": {
        subtitle: "Calculate the all-in cost per km for your EV — electricity, maintenance, insurance, and more.",
        explanation: {
            heading: "How to Calculate EV Cost per km",
            paragraphs: [
                "Electricity cost per km = electricity rate ÷ efficiency. At 0.15/kWh and 6 km/kWh, that's 0.025 per km. For comparison, petrol at 1.50/L in a 12 km/L car = 0.125 per km — 5× the EV electricity cost.",
                "All-in cost per km adds insurance, maintenance, and other costs divided by annual km. EVs typically run 0.15–0.30 per km all-in, while petrol cars run 0.25–0.50 per km. Higher annual km reduces the per-km fixed cost.",
            ],
            highlight: "At 20,000 km/yr: EV electricity = 0.025/km. With 1,500 insurance and 300 maintenance: total 2,300/yr ÷ 20,000 = 0.115/km all-in.",
        },
        faq: [
            { question: "What is the average cost per km for an EV?", answer: "Electricity only: 0.02–0.04 per km (home charging). All-in (electricity + insurance + maintenance): 0.10–0.25 per km. Compare to petrol cars: fuel only 0.08–0.15/km, all-in 0.25–0.50/km." },
            { question: "How does EV cost per km compare to petrol?", answer: "On electricity alone, EVs cost 60–80% less per km than petrol. All-in, EVs cost 30–50% less. The gap is largest for high-mileage drivers and in areas with cheap electricity." },
        ],
    },
    "ev-battery-degradation-calculator": {
        subtitle: "Estimate your EV battery's remaining health and capacity based on age, mileage, and charging habits.",
        explanation: {
            heading: "Understanding EV Battery Degradation",
            paragraphs: [
                "EV batteries lose capacity gradually over time and use. The average degradation rate is about 2.3% per year. By year 5, most EV batteries retain 85–90% of original capacity. By year 10, 75–85%. Modern batteries are lasting longer than early projections.",
                "Factors that accelerate degradation: frequent DC fast charging, extreme heat exposure, frequently charging to 100%, and frequently depleting below 10%. Best practices: charge daily to 80%, use AC home charging, avoid extreme temperatures.",
            ],
            highlight: "A 3-year-old EV with 80,000 km and 20% DC fast charging: estimated battery health = 89%. A 75 kWh battery retains 66.9 kWh of usable capacity.",
        },
        faq: [
            { question: "How long do EV batteries last?", answer: "Most EV batteries are warrantied for 8 years / 160,000 km with 70% capacity guaranteed. Real-world data shows average degradation of 2.3% per year. After 10 years, most retain 75–85% — still very usable for daily driving." },
            { question: "Does DC fast charging damage the battery?", answer: "Frequent DC fast charging causes slightly more degradation — about 1–2% additional loss over 160,000 km. Occasional fast charging on road trips is fine. For daily driving, AC home charging is gentler and much cheaper." },
        ],
    },
    "ev-battery-replacement-calculator": {
        subtitle: "Estimate how much it would cost to replace your EV battery pack — battery cost, labour, and total price.",
        explanation: {
            heading: "EV Battery Replacement Costs",
            paragraphs: [
                "Battery pack cost = capacity (kWh) × cost per kWh. Pack-level costs in 2024–2025 are approximately 100–200 per kWh. A 75 kWh pack costs roughly 7,500–15,000 for the battery, plus labour.",
                "Battery prices have dropped 90% since 2010 and continue to fall. Most EV batteries outlast the vehicle — only ~1.5% have been replaced outside of recalls. Warranty coverage (typically 8 years) provides peace of mind.",
            ],
            highlight: "75 kWh battery replacement: Pack at 150/kWh = 11,250. Labour (8 hrs at 100/hr) = 800. Total ≈ 12,050. Note: most batteries last 15+ years.",
        },
        faq: [
            { question: "How much does an EV battery replacement cost?", answer: "Roughly 100–200 per kWh for the pack, plus 500–1,500 in labour. A 50 kWh battery costs 5,000–10,000 total; a 100 kWh battery costs 10,000–20,000. Prices drop every year as technology improves." },
            { question: "Will I ever need to replace my EV battery?", answer: "Probably not during typical ownership. Less than 2% of EV batteries need replacement outside recalls. With proper care (charge to 80%, avoid extreme heat), batteries retain 80%+ capacity after 10 years." },
        ],
    },
    "ev-hp-kw-converter": {
        subtitle: "Convert between horsepower and kilowatts for EV motors. Includes mechanical, metric, and electrical horsepower equivalents.",
        explanation: {
            heading: "Converting HP to kW for Electric Motors",
            paragraphs: [
                "1 mechanical horsepower (HP) = 0.7457 kilowatts (kW). EV manufacturers specify motor power in kW (international standard) or HP (common in North American marketing). Both measure the same thing — motor output power.",
                "Electric motor HP differs from combustion engine HP in feel: electric motors produce maximum torque from 0 RPM instantly, while combustion engines need to rev up. A 300 HP electric motor feels significantly more powerful at low speeds than a 300 HP petrol engine.",
            ],
            highlight: "300 HP = 223.7 kW = 304.2 metric HP (PS). EV motors deliver all their torque instantly — a 300 HP EV feels like a 400+ HP petrol car off the line.",
        },
        faq: [
            { question: "Why do EVs use kW instead of horsepower?", answer: "kW is the SI (metric) unit used internationally. It directly relates to electrical energy (kWh for battery, kW for charging speed). Some markets list both kW and HP for convenience." },
            { question: "What is the difference between HP and PS?", answer: "HP is mechanical horsepower (US/UK), PS is metric horsepower (Pferdestärke, common in Europe/Asia). 1 HP = 1.0139 PS. The difference is negligible: 300 HP ≈ 304 PS." },
        ],
    },
    "ev-acceleration-calculator": {
        subtitle: "Estimate your EV's 0-100 km/h and 0-60 mph time from motor power, weight, and drivetrain.",
        explanation: {
            heading: "Estimating EV Acceleration",
            paragraphs: [
                "EV acceleration depends on power-to-weight ratio and traction. Enter motor power (kW), curb weight (kg), and drivetrain (RWD/AWD). AWD EVs have better traction, reducing wheelspin and improving launch times.",
                "EVs have an inherent advantage: electric motors deliver maximum torque instantly from 0 RPM. No gear changes means no power interruption. This is why even modest EVs can surprise faster petrol cars at traffic lights.",
            ],
            highlight: "300 kW (402 HP) dual motor AWD at 2,000 kg: estimated 0-100 km/h ≈ 5.5 sec, 0-60 mph ≈ 3.8 sec. That's supercar territory from a family car.",
        },
        faq: [
            { question: "Why are EVs so fast off the line?", answer: "Electric motors produce peak torque at 0 RPM — instant maximum force. No gears to shift means no power interruption. AWD EVs use both axles independently for optimal traction. Even mid-range EVs can outaccelerate most petrol cars." },
            { question: "Does more power always mean faster acceleration?", answer: "No — weight and traction matter equally. A 300 kW motor in a 1,800 kg car is faster than the same motor in a 2,500 kg truck. AWD significantly improves launch performance over RWD." },
        ],
    },
    "ev-loan-calculator": {
        subtitle: "Calculate monthly payments for your EV loan. Factor in down payment, trade-in, government incentive, and interest rate.",
        explanation: {
            heading: "How to Calculate EV Loan Payments",
            paragraphs: [
                "EV loan amount = vehicle price − down payment − trade-in − incentive. Monthly payment uses the standard amortisation formula. Enter your local interest rate and loan term for accurate results.",
                "Many countries and banks offer special EV financing with lower interest rates. Some automakers also offer promotional rates. It's worth comparing dedicated EV loan products with standard auto loans.",
            ],
            highlight: "40,000 EV − 5,000 down − 5,000 incentive = 30,000 loan. At 6% for 60 months ≈ 580/month. Total interest ≈ 4,800.",
        },
        faq: [
            { question: "Can government incentives reduce my loan amount?", answer: "In many cases, yes. If the incentive is applied at the point of sale, it directly reduces the amount you need to finance, lowering your monthly payment and total interest paid." },
            { question: "Are there special EV loan rates?", answer: "Many banks and credit unions offer green vehicle loans with preferential rates, typically 0.5–1% below standard auto loan rates. Some automakers offer promotional 0% or low-rate financing on new EVs." },
        ],
    },
    "ev-break-even-calculator": {
        subtitle: "Calculate how many years until your EV pays for itself compared to a petrol car through accumulated savings.",
        explanation: {
            heading: "How to Calculate EV Break-Even Point",
            paragraphs: [
                "Break-even period = EV price premium ÷ annual savings. The price premium is how much more the EV costs than a comparable petrol car (after incentives). Annual savings include fuel savings + maintenance savings.",
                "After reaching break-even, every additional year of ownership puts money back in your pocket. High-mileage drivers break even fastest because their annual fuel savings are proportionally larger.",
            ],
            highlight: "8,000 price premium with 1,200/yr fuel savings + 400/yr maintenance savings = 1,600/yr total. Break-even: 5.0 years. After that, pure savings.",
        },
        faq: [
            { question: "How long does it take for an EV to pay for itself?", answer: "Typically 3–7 years, depending on the price difference, incentives, driving distance, and local fuel/electricity costs. High-mileage drivers break even in 2–4 years." },
            { question: "What savings count toward break-even?", answer: "Fuel savings (largest component), maintenance savings (oil, brakes, transmission), and in some regions: reduced road tax, free parking, toll exemptions, and lower insurance premiums for EVs." },
        ],
    },
    "ev-resale-value-calculator": {
        subtitle: "Estimate your EV's resale value based on purchase price, age, and odometer reading.",
        explanation: {
            heading: "EV Depreciation and Resale Value",
            paragraphs: [
                "EVs depreciate faster in the first 2–3 years than petrol cars (losing ~30–40%), but then stabilise. Battery technology advancement drives early depreciation — buyers want the latest range and features. By year 5, retention rates are similar to petrol equivalents.",
                "Factors that improve resale: popular brand, larger battery (more range), low mileage, and good battery health. The used EV market is maturing rapidly with increasing demand.",
            ],
            highlight: "A 40,000 EV after 3 years and 60,000 km: estimated retention = 62%, resale ≈ 24,800, depreciation ≈ 15,200.",
        },
        faq: [
            { question: "Do EVs hold their value?", answer: "It varies by brand and model. Popular EVs with long range retain 55–70% after 3 years. Older/shorter-range models depreciate faster. The trend is improving as demand for used EVs grows globally." },
            { question: "What EVs have the best resale value?", answer: "Vehicles from established EV brands with 350+ km range tend to hold value best. Low-mileage examples with documented battery health reports command premium prices on the used market." },
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
