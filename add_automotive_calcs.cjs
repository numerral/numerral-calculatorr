// Script to add 27 automotive calculator definitions to calculators.json
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'calculators.json');
const calcs = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newCalcs = [
    // ══════════════ ENGINE & PERFORMANCE (10) ══════════════
    {
        id: "engine-horsepower-calculator",
        category: "engine",
        title: "Engine Horsepower Calculator",
        slug: "engine-horsepower-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "🏎️",
        description: "Calculate engine horsepower using RPM & torque, quarter-mile elapsed time, or trap speed methods. Supports HP, kW, and PS conversions.",
        stars: 5,
        defaults: { amount: 350, rate: 5600, tenure: 0 },
        sliderRanges: { amount: { min: 50, max: 1500, step: 10 }, rate: { min: 1000, max: 10000, step: 100 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "engine-hp",
        keywords: "engine horsepower calculator, hp calculator, calculate hp from torque, horsepower formula, engine power calculator"
    },
    {
        id: "engine-torque-calculator",
        category: "engine",
        title: "Engine Torque Calculator",
        slug: "engine-torque-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "🔩",
        description: "Calculate engine torque from horsepower and RPM. Convert between lb-ft, Nm, and kg-m. See the torque curve relationship.",
        stars: 5,
        defaults: { amount: 300, rate: 5252, tenure: 0 },
        sliderRanges: { amount: { min: 50, max: 1000, step: 10 }, rate: { min: 1000, max: 10000, step: 100 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "engine-torque",
        keywords: "engine torque calculator, torque from hp, lb-ft to nm, torque formula, engine torque"
    },
    {
        id: "engine-displacement-calculator",
        category: "engine",
        title: "Engine Displacement Calculator",
        slug: "engine-displacement-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "⚙️",
        description: "Calculate engine displacement (CID/cc/L) from bore, stroke, and number of cylinders. Compare common engine configurations.",
        stars: 4,
        defaults: { amount: 4, rate: 3, tenure: 8 },
        sliderRanges: { amount: { min: 2, max: 16, step: 1 }, rate: { min: 1, max: 6, step: 0.1 }, tenure: { min: 1, max: 16, step: 1 } },
        calcType: "engine-displacement",
        keywords: "engine displacement calculator, cubic inch displacement, engine cc calculator, CID calculator, engine size"
    },
    {
        id: "engine-compression-ratio-calculator",
        category: "engine",
        title: "Engine Compression Ratio Calculator",
        slug: "engine-compression-ratio-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "🔬",
        description: "Calculate engine compression ratio from swept volume and clearance volume. Understand the impact on power and fuel octane requirements.",
        stars: 4,
        defaults: { amount: 500, rate: 50, tenure: 0 },
        sliderRanges: { amount: { min: 100, max: 2000, step: 10 }, rate: { min: 20, max: 200, step: 5 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "engine-compression",
        keywords: "compression ratio calculator, engine compression, CR calculator, swept volume, clearance volume"
    },
    {
        id: "carburetor-cfm-calculator",
        category: "engine",
        title: "Carburetor CFM Calculator",
        slug: "carburetor-cfm-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "🌬️",
        description: "Calculate the correct carburetor size in CFM for your engine using displacement, RPM, and volumetric efficiency.",
        stars: 4,
        defaults: { amount: 350, rate: 6000, tenure: 85 },
        sliderRanges: { amount: { min: 100, max: 800, step: 10 }, rate: { min: 2000, max: 9000, step: 100 }, tenure: { min: 50, max: 100, step: 1 } },
        calcType: "carburetor-cfm",
        keywords: "carburetor cfm calculator, carb size calculator, cfm calculator, carburetor sizing, how many cfm"
    },
    {
        id: "quarter-mile-calculator",
        category: "engine",
        title: "0–60 & Quarter Mile Calculator",
        slug: "quarter-mile-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "🏁",
        description: "Estimate quarter-mile elapsed time and trap speed from vehicle weight and horsepower. Calculate 0-60 mph time.",
        stars: 5,
        defaults: { amount: 350, rate: 3500, tenure: 0 },
        sliderRanges: { amount: { min: 50, max: 2000, step: 10 }, rate: { min: 1500, max: 8000, step: 50 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "quarter-mile",
        keywords: "quarter mile calculator, 0-60 calculator, quarter mile time, trap speed calculator, drag strip calculator"
    },
    {
        id: "hp-to-weight-ratio-calculator",
        category: "engine",
        title: "Horsepower-to-Weight Ratio Calculator",
        slug: "hp-to-weight-ratio-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "⚖️",
        description: "Calculate power-to-weight ratio in HP/ton, lb/HP, and HP/liter. Compare your vehicle's performance potential against common benchmarks.",
        stars: 4,
        defaults: { amount: 300, rate: 3500, tenure: 0 },
        sliderRanges: { amount: { min: 50, max: 2000, step: 10 }, rate: { min: 1000, max: 8000, step: 50 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "hp-weight-ratio",
        keywords: "power to weight ratio calculator, hp per ton, lb per hp, power weight ratio, performance calculator"
    },
    {
        id: "gear-ratio-calculator",
        category: "engine",
        title: "Gear Ratio Calculator",
        slug: "gear-ratio-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "⚙️",
        description: "Calculate overall gear ratio, RPM at speed, and speed at RPM from transmission gear, differential ratio, and tire size.",
        stars: 4,
        defaults: { amount: 3, rate: 3, tenure: 26 },
        sliderRanges: { amount: { min: 0.5, max: 6, step: 0.01 }, rate: { min: 2, max: 5, step: 0.01 }, tenure: { min: 20, max: 40, step: 0.5 } },
        calcType: "gear-ratio",
        keywords: "gear ratio calculator, final drive ratio, rpm at speed, speed at rpm, differential ratio"
    },
    {
        id: "top-speed-calculator",
        category: "engine",
        title: "Top Speed Estimator",
        slug: "top-speed-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "💨",
        description: "Estimate a vehicle's theoretical top speed from horsepower, weight, drag coefficient, and frontal area.",
        stars: 4,
        defaults: { amount: 300, rate: 3500, tenure: 0 },
        sliderRanges: { amount: { min: 50, max: 2000, step: 10 }, rate: { min: 1500, max: 8000, step: 50 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "top-speed",
        keywords: "top speed calculator, max speed calculator, vehicle top speed, top speed estimator, terminal velocity car"
    },
    {
        id: "dyno-correction-calculator",
        category: "engine",
        title: "Dyno Correction Factor Calculator",
        slug: "dyno-correction-calculator",
        categorySlug: "automotive-calculators/engine-performance",
        icon: "📊",
        description: "Calculate SAE J1349, DIN 70020, and STD dyno correction factors from temperature, barometric pressure, and humidity.",
        stars: 4,
        defaults: { amount: 77, rate: 29, tenure: 50 },
        sliderRanges: { amount: { min: 0, max: 120, step: 1 }, rate: { min: 25, max: 32, step: 0.01 }, tenure: { min: 0, max: 100, step: 1 } },
        calcType: "dyno-correction",
        keywords: "dyno correction factor, SAE correction, DIN correction, dyno correction calculator, weather correction factor"
    },

    // ══════════════ FUEL ECONOMY (9) ══════════════
    {
        id: "gas-mileage-calculator",
        category: "fuel",
        title: "Gas Mileage Calculator",
        slug: "gas-mileage-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "📏",
        description: "Calculate your vehicle's gas mileage (MPG) from distance traveled and fuel used. See cost per mile and metric equivalents.",
        stars: 5,
        defaults: { amount: 300, rate: 12, tenure: 0 },
        sliderRanges: { amount: { min: 10, max: 2000, step: 10 }, rate: { min: 1, max: 100, step: 0.5 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "gas-mileage",
        keywords: "gas mileage calculator, mpg calculator, fuel economy calculator, miles per gallon, fuel efficiency calculator"
    },
    {
        id: "fuel-cost-us-calculator",
        category: "fuel",
        title: "Fuel Cost Calculator",
        slug: "fuel-cost-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "💲",
        description: "Calculate the fuel cost for any trip distance based on your vehicle's MPG and current gas price. Compare regular, mid-grade, and premium.",
        stars: 5,
        defaults: { amount: 500, rate: 25, tenure: 3 },
        sliderRanges: { amount: { min: 10, max: 5000, step: 10 }, rate: { min: 5, max: 60, step: 1 }, tenure: { min: 1, max: 8, step: 0.01 } },
        calcType: "fuel-cost-us",
        keywords: "fuel cost calculator, trip fuel cost, gas cost calculator, fuel price calculator, drive cost calculator"
    },
    {
        id: "fuel-savings-calculator",
        category: "fuel",
        title: "Fuel Savings Calculator",
        slug: "fuel-savings-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "💰",
        description: "Compare annual fuel costs between two vehicles. See how much you'd save by switching to a more fuel-efficient car.",
        stars: 5,
        defaults: { amount: 15000, rate: 22, tenure: 3 },
        sliderRanges: { amount: { min: 1000, max: 50000, step: 500 }, rate: { min: 5, max: 60, step: 1 }, tenure: { min: 1, max: 8, step: 0.01 } },
        calcType: "fuel-savings",
        keywords: "fuel savings calculator, gas savings, compare fuel costs, vehicle comparison, fuel economy comparison"
    },
    {
        id: "cost-per-mile-calculator",
        category: "fuel",
        title: "Cost Per Mile Calculator",
        slug: "cost-per-mile-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "🛣️",
        description: "Calculate the true all-in cost per mile including fuel, insurance, maintenance, depreciation, and financing.",
        stars: 5,
        defaults: { amount: 15000, rate: 25, tenure: 3 },
        sliderRanges: { amount: { min: 1000, max: 50000, step: 500 }, rate: { min: 5, max: 60, step: 1 }, tenure: { min: 1, max: 8, step: 0.01 } },
        calcType: "cost-per-mile",
        keywords: "cost per mile calculator, cost per km, vehicle operating cost, true cost of driving, per mile cost"
    },
    {
        id: "mpg-to-l100km-converter",
        category: "fuel",
        title: "MPG to L/100km Converter",
        slug: "mpg-to-l100km-converter",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "🔄",
        description: "Convert between MPG (US), MPG (Imperial), km/L, and L/100km. Instant bidirectional fuel economy unit conversion.",
        stars: 4,
        defaults: { amount: 25, rate: 0, tenure: 0 },
        sliderRanges: { amount: { min: 1, max: 100, step: 0.5 }, rate: { min: 0, max: 0, step: 0 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "mpg-l100km",
        keywords: "mpg to l/100km, l/100km to mpg, fuel economy converter, mpg converter, km/l to mpg"
    },
    {
        id: "fuel-injector-calculator",
        category: "fuel",
        title: "Fuel Injector Flow Rate Calculator",
        slug: "fuel-injector-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "💉",
        description: "Calculate required fuel injector flow rate (lb/hr or cc/min) based on target horsepower, BSFC, number of injectors, and duty cycle.",
        stars: 4,
        defaults: { amount: 400, rate: 0.5, tenure: 8 },
        sliderRanges: { amount: { min: 50, max: 2000, step: 10 }, rate: { min: 0.3, max: 0.8, step: 0.01 }, tenure: { min: 1, max: 16, step: 1 } },
        calcType: "fuel-injector",
        keywords: "fuel injector calculator, injector flow rate, injector sizing, lb/hr to cc/min, fuel injector size"
    },
    {
        id: "fuel-tank-range-calculator",
        category: "fuel",
        title: "Fuel Tank Range Calculator",
        slug: "fuel-tank-range-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "🔋",
        description: "Calculate how far you can drive on a full tank or remaining fuel based on your vehicle's MPG and tank size.",
        stars: 4,
        defaults: { amount: 16, rate: 25, tenure: 0 },
        sliderRanges: { amount: { min: 5, max: 50, step: 0.5 }, rate: { min: 5, max: 60, step: 1 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "fuel-range",
        keywords: "fuel range calculator, how far can I drive, tank range, miles on full tank, driving range calculator"
    },
    {
        id: "annual-fuel-cost-calculator",
        category: "fuel",
        title: "Annual Fuel Cost Calculator",
        slug: "annual-fuel-cost-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "📅",
        description: "Calculate your total annual fuel expenditure based on yearly miles driven, vehicle MPG, and local fuel price.",
        stars: 4,
        defaults: { amount: 15000, rate: 25, tenure: 3 },
        sliderRanges: { amount: { min: 1000, max: 50000, step: 500 }, rate: { min: 5, max: 60, step: 1 }, tenure: { min: 1, max: 8, step: 0.01 } },
        calcType: "annual-fuel",
        keywords: "annual fuel cost, yearly gas cost, fuel budget calculator, how much gas per year, annual gas expenditure"
    },
    {
        id: "mpg-improvement-calculator",
        category: "fuel",
        title: "MPG Improvement Savings Calculator",
        slug: "mpg-improvement-calculator",
        categorySlug: "automotive-calculators/fuel-economy",
        icon: "📈",
        description: "Calculate how much money you save by improving your vehicle's fuel economy from one MPG to another over a year.",
        stars: 4,
        defaults: { amount: 15000, rate: 20, tenure: 3 },
        sliderRanges: { amount: { min: 1000, max: 50000, step: 500 }, rate: { min: 5, max: 60, step: 1 }, tenure: { min: 1, max: 8, step: 0.01 } },
        calcType: "mpg-improvement",
        keywords: "mpg improvement calculator, fuel savings from better mpg, gas savings calculator, improve fuel economy"
    },

    // ══════════════ WHEELS & TIRES (8) ══════════════
    {
        id: "tire-size-calculator",
        category: "wheels",
        title: "Tire Size Calculator",
        slug: "tire-size-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "🛞",
        description: "Decode any tire size (P-metric, LT-metric, flotation) into actual dimensions — diameter, width, sidewall height, circumference, and revolutions per mile.",
        stars: 5,
        defaults: { amount: 225, rate: 55, tenure: 17 },
        sliderRanges: { amount: { min: 125, max: 355, step: 5 }, rate: { min: 25, max: 85, step: 5 }, tenure: { min: 13, max: 24, step: 1 } },
        calcType: "tire-size",
        keywords: "tire size calculator, tire dimensions, tire diameter, tire circumference, tire specs calculator"
    },
    {
        id: "tire-comparison-calculator",
        category: "wheels",
        title: "Tire Size Comparison Calculator",
        slug: "tire-comparison-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "🔄",
        description: "Compare two tire sizes side by side — diameter difference, width difference, speedometer error, and fitment compatibility.",
        stars: 5,
        defaults: { amount: 225, rate: 55, tenure: 17 },
        sliderRanges: { amount: { min: 125, max: 355, step: 5 }, rate: { min: 25, max: 85, step: 5 }, tenure: { min: 13, max: 24, step: 1 } },
        calcType: "tire-compare",
        keywords: "tire size comparison, compare tire sizes, tire size difference, plus sizing, tire upgrade calculator"
    },
    {
        id: "tire-conversion-calculator",
        category: "wheels",
        title: "Tire Size Conversion Calculator",
        slug: "tire-conversion-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "↔️",
        description: "Convert tire sizes between P-metric (225/55R17), inches (28×10.50R15), and metric (750-16) formats.",
        stars: 4,
        defaults: { amount: 225, rate: 55, tenure: 17 },
        sliderRanges: { amount: { min: 125, max: 355, step: 5 }, rate: { min: 25, max: 85, step: 5 }, tenure: { min: 13, max: 24, step: 1 } },
        calcType: "tire-conversion",
        keywords: "tire size conversion, metric to inches tire, tire format converter, LT tire conversion, flotation to metric"
    },
    {
        id: "speedometer-error-calculator",
        category: "wheels",
        title: "Speedometer Error Calculator",
        slug: "speedometer-error-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "🏎️",
        description: "Calculate speedometer error caused by changing tire sizes. See your actual speed vs. displayed speed at any indicated speed.",
        stars: 5,
        defaults: { amount: 225, rate: 55, tenure: 17 },
        sliderRanges: { amount: { min: 125, max: 355, step: 5 }, rate: { min: 25, max: 85, step: 5 }, tenure: { min: 13, max: 24, step: 1 } },
        calcType: "speedo-error",
        keywords: "speedometer error calculator, speedometer correction, tire size speedometer, actual speed calculator"
    },
    {
        id: "speedometer-gear-calculator",
        category: "wheels",
        title: "Speedometer Gear Calculator",
        slug: "speedometer-gear-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "⚙️",
        description: "Calculate the correct speedometer driven gear tooth count for mechanical speedometers after changing tire size or axle ratio.",
        stars: 4,
        defaults: { amount: 26, rate: 3, tenure: 8 },
        sliderRanges: { amount: { min: 20, max: 40, step: 0.5 }, rate: { min: 2, max: 5, step: 0.01 }, tenure: { min: 6, max: 12, step: 1 } },
        calcType: "speedo-gear",
        keywords: "speedometer gear calculator, driven gear teeth, speedometer calibration, speedo gear, mechanical speedometer"
    },
    {
        id: "wheel-offset-calculator",
        category: "wheels",
        title: "Wheel Offset Calculator",
        slug: "wheel-offset-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "📐",
        description: "Calculate wheel offset (ET), backspacing, and track width change when switching to different wheels. Ensure safe fender clearance.",
        stars: 5,
        defaults: { amount: 8, rate: 45, tenure: 0 },
        sliderRanges: { amount: { min: 5, max: 14, step: 0.5 }, rate: { min: -30, max: 70, step: 1 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "wheel-offset",
        keywords: "wheel offset calculator, ET calculator, backspacing calculator, wheel fitment, track width calculator"
    },
    {
        id: "tire-pressure-calculator",
        category: "wheels",
        title: "Tire Pressure Adjustment Calculator",
        slug: "tire-pressure-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "🌡️",
        description: "Calculate the correct tire pressure adjustment for temperature changes, load variations, and altitude. PSI and bar units supported.",
        stars: 4,
        defaults: { amount: 35, rate: 70, tenure: 0 },
        sliderRanges: { amount: { min: 20, max: 60, step: 1 }, rate: { min: -20, max: 120, step: 1 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "tire-pressure",
        keywords: "tire pressure calculator, psi calculator, tire pressure temperature, correct tire pressure, inflation pressure"
    },
    {
        id: "bolt-pattern-calculator",
        category: "wheels",
        title: "Bolt Pattern / PCD Calculator",
        slug: "bolt-pattern-calculator",
        categorySlug: "automotive-calculators/wheels-tires",
        icon: "🔘",
        description: "Calculate Pitch Circle Diameter (PCD) from number of bolts and measurement between them. Find compatible wheel bolt patterns.",
        stars: 4,
        defaults: { amount: 5, rate: 4, tenure: 0 },
        sliderRanges: { amount: { min: 3, max: 8, step: 1 }, rate: { min: 2, max: 8, step: 0.1 }, tenure: { min: 0, max: 0, step: 0 } },
        calcType: "bolt-pattern",
        keywords: "bolt pattern calculator, PCD calculator, pitch circle diameter, wheel bolt pattern, lug pattern calculator"
    }
];

// Check for duplicates
const existingIds = new Set(calcs.map(c => c.id));
const toAdd = newCalcs.filter(c => {
    if (existingIds.has(c.id)) {
        console.log(`SKIP (already exists): ${c.id}`);
        return false;
    }
    return true;
});

calcs.push(...toAdd);
fs.writeFileSync(filePath, JSON.stringify(calcs, null, 4));
console.log(`\nAdded ${toAdd.length} new automotive calculators.`);
console.log(`Total calculators: ${calcs.length}`);
console.log(`\nEngine: ${calcs.filter(c => c.category === 'engine').length}`);
console.log(`Fuel: ${calcs.filter(c => c.category === 'fuel').length}`);
console.log(`Wheels: ${calcs.filter(c => c.category === 'wheels').length}`);
