"use client";

import { useState, useMemo } from "react";

/* ──────────── shared helpers ──────────── */
const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtInt = (n: number) => Math.ceil(n).toLocaleString("en-US");

function ResultRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
    return (
        <div className="con-result-row">
            <span className="con-result-row__label">{label}</span>
            <span className="con-result-row__value">{value}{unit ? <span className="con-result-row__unit"> {unit}</span> : null}</span>
        </div>
    );
}

function InputField({ label, value, onChange, unit, min, max, step }: {
    label: string; value: number; onChange: (v: number) => void; unit?: string;
    min?: number; max?: number; step?: number;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input
                type="number"
                className="con-input__field"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                min={min}
                max={max}
                step={step || 1}
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

/* ──────────── 1. CONCRETE CALCULATOR ──────────── */
function ConcreteCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(4);
    const [unit, setUnit] = useState("inches");

    const result = useMemo(() => {
        const depthFt = unit === "inches" ? depth / 12 : depth;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const bags60 = cuFt / 0.45;  // 60lb bag ≈ 0.45 cu ft
        const bags80 = cuFt / 0.6;   // 80lb bag ≈ 0.6 cu ft
        const cuM = cuFt * 0.0283168;
        return { cuFt, cuYd, bags60, bags80, cuM };
    }, [length, width, depth, unit]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Concrete Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit={unit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={unit} onChange={setUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Volume" value={fmt(result.cuM)} unit="cu m" />
                <ResultRow label="60 lb Bags" value={fmtInt(result.bags60)} unit="bags" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 2. CONCRETE BLOCK CALCULATOR ──────────── */
function ConcreteBlockCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(8);
    const [blockLength, setBlockLength] = useState(16);
    const [blockHeight, setBlockHeight] = useState(8);

    const result = useMemo(() => {
        const wallArea = wallLength * wallHeight; // sq ft
        const blockLenFt = blockLength / 12;
        const blockHtFt = blockHeight / 12;
        const blockArea = blockLenFt * blockHtFt;
        const blocksNeeded = blockArea > 0 ? wallArea / blockArea : 0;
        const mortarBags = blocksNeeded / 33; // ~33 blocks per 80lb bag of mortar
        return { wallArea, blocksNeeded, mortarBags };
    }, [wallLength, wallHeight, blockLength, blockHeight]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Concrete Block Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Block Length" value={blockLength} onChange={setBlockLength} unit="in" min={1} />
                <InputField label="Block Height" value={blockHeight} onChange={setBlockHeight} unit="in" min={1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                <ResultRow label="Blocks Needed" value={fmtInt(result.blocksNeeded)} unit="blocks" />
                <ResultRow label="Mortar (80 lb bags)" value={fmtInt(result.mortarBags)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 3. FLOORING CALCULATOR ──────────── */
function FlooringCalc() {
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(10);
    const [waste, setWaste] = useState(10);
    const [boxCoverage, setBoxCoverage] = useState(20);
    const [pricePerSqFt, setPricePerSqFt] = useState(3);

    const result = useMemo(() => {
        const area = length * width;
        const withWaste = area * (1 + waste / 100);
        const boxes = boxCoverage > 0 ? withWaste / boxCoverage : 0;
        const cost = withWaste * pricePerSqFt;
        return { area, withWaste, boxes, cost };
    }, [length, width, waste, boxCoverage, pricePerSqFt]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Flooring Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Room Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
                <InputField label="Box Coverage" value={boxCoverage} onChange={setBoxCoverage} unit="sq ft/box" min={1} />
                <InputField label="Price per sq ft" value={pricePerSqFt} onChange={setPricePerSqFt} unit="$" min={0} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Room Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Material Needed (+ waste)" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Boxes Needed" value={fmtInt(result.boxes)} unit="boxes" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 4. TILE CALCULATOR ──────────── */
function TileCalc() {
    const [areaLength, setAreaLength] = useState(10);
    const [areaWidth, setAreaWidth] = useState(10);
    const [tileSize, setTileSize] = useState(12);
    const [gap, setGap] = useState(0.125);
    const [waste, setWaste] = useState(10);
    const [tilesPerBox, setTilesPerBox] = useState(10);

    const result = useMemo(() => {
        const areaSqFt = areaLength * areaWidth;
        const tileSizeFt = tileSize / 12;
        const effectiveTile = tileSizeFt + gap / 12;
        const tileArea = effectiveTile * effectiveTile;
        const tilesRaw = tileArea > 0 ? areaSqFt / tileArea : 0;
        const tilesWithWaste = tilesRaw * (1 + waste / 100);
        const boxes = tilesPerBox > 0 ? tilesWithWaste / tilesPerBox : 0;
        // Grout: ~1 lb per 10 sq ft for standard tile
        const groutLbs = areaSqFt / 10;
        return { areaSqFt, tilesRaw, tilesWithWaste, boxes, groutLbs };
    }, [areaLength, areaWidth, tileSize, gap, waste, tilesPerBox]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔲 Tile Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Area Length" value={areaLength} onChange={setAreaLength} unit="ft" min={1} />
                <InputField label="Area Width" value={areaWidth} onChange={setAreaWidth} unit="ft" min={1} />
                <InputField label="Tile Size" value={tileSize} onChange={setTileSize} unit="in" min={1} />
                <InputField label="Gap Width" value={gap} onChange={setGap} unit="in" min={0} step={0.0625} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
                <InputField label="Tiles per Box" value={tilesPerBox} onChange={setTilesPerBox} min={1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Area" value={fmt(result.areaSqFt)} unit="sq ft" />
                <ResultRow label="Tiles (exact)" value={fmtInt(result.tilesRaw)} unit="tiles" />
                <ResultRow label="Tiles (+ waste)" value={fmtInt(result.tilesWithWaste)} unit="tiles" />
                <ResultRow label="Boxes Needed" value={fmtInt(result.boxes)} unit="boxes" />
                <ResultRow label="Grout Needed" value={fmt(result.groutLbs, 1)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 5. ROOFING CALCULATOR ──────────── */
function RoofingCalc() {
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(40);
    const [pitch, setPitch] = useState("4");
    const [waste, setWaste] = useState(10);

    const PITCH_MULTIPLIERS: Record<string, number> = {
        "0": 1.000, "1": 1.003, "2": 1.014, "3": 1.031, "4": 1.054,
        "5": 1.083, "6": 1.118, "7": 1.158, "8": 1.202, "9": 1.250,
        "10": 1.302, "11": 1.357, "12": 1.414,
    };

    const result = useMemo(() => {
        const footprintArea = length * width;
        const multiplier = PITCH_MULTIPLIERS[pitch] || 1;
        const actualArea = footprintArea * multiplier;
        const withWaste = actualArea * (1 + waste / 100);
        const squares = withWaste / 100;         // 1 square = 100 sq ft
        const bundles = squares * 3;              // 3 bundles per square
        const underlaymentRolls = withWaste / 400; // 1 roll ≈ 400 sq ft
        return { footprintArea, actualArea, withWaste, squares, bundles, underlaymentRolls };
    }, [length, width, pitch, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Roofing Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Roof Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <SelectField label="Roof Pitch" value={pitch} onChange={setPitch} options={
                    Object.keys(PITCH_MULTIPLIERS).map((p) => ({ value: p, label: `${p}:12` }))
                } />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Footprint Area" value={fmt(result.footprintArea)} unit="sq ft" />
                <ResultRow label="Actual Roof Area" value={fmt(result.actualArea)} unit="sq ft" />
                <ResultRow label="Total (+ waste)" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Roofing Squares" value={fmt(result.squares, 1)} unit="squares" />
                <ResultRow label="Shingle Bundles" value={fmtInt(result.bundles)} unit="bundles" />
                <ResultRow label="Underlayment Rolls" value={fmt(result.underlaymentRolls, 1)} unit="rolls" />
            </div>
        </div>
    );
}

/* ──────────── 6. ROOF PITCH CALCULATOR ──────────── */
function RoofPitchCalc() {
    const [rise, setRise] = useState(6);
    const [run, setRun] = useState(12);

    const result = useMemo(() => {
        const pitchRatio = run > 0 ? rise / run * 12 : 0;
        const angleRad = run > 0 ? Math.atan(rise / run) : 0;
        const angleDeg = angleRad * (180 / Math.PI);
        const slopePercent = run > 0 ? (rise / run) * 100 : 0;
        const rafterLength = Math.sqrt(rise * rise + run * run);
        const multiplier = run > 0 ? rafterLength / run : 1;
        return { pitchRatio, angleDeg, slopePercent, rafterLength, multiplier };
    }, [rise, run]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Roof Pitch Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Rise" value={rise} onChange={setRise} unit="in" min={0} step={0.5} />
                <InputField label="Run" value={run} onChange={setRun} unit="in (12 = standard)" min={1} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Pitch" value={`${fmt(result.pitchRatio, 1)}:12`} />
                <ResultRow label="Angle" value={fmt(result.angleDeg, 1)} unit="degrees" />
                <ResultRow label="Slope" value={fmt(result.slopePercent, 1)} unit="%" />
                <ResultRow label="Rafter Length Factor" value={fmt(result.multiplier, 3)} unit="× run" />
                <ResultRow label="Rafter Length" value={fmt(result.rafterLength, 1)} unit="in per ft run" />
            </div>
        </div>
    );
}

/* ──────────── 7. PAINT CALCULATOR ──────────── */
function PaintCalc() {
    const [roomLength, setRoomLength] = useState(12);
    const [roomWidth, setRoomWidth] = useState(10);
    const [wallHeight, setWallHeight] = useState(8);
    const [doors, setDoors] = useState(1);
    const [windows, setWindows] = useState(2);
    const [coats, setCoats] = useState(2);
    const [coverage, setCoverage] = useState(350);

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const wallArea = perimeter * wallHeight;
        const doorArea = doors * 21;       // standard door ≈ 21 sq ft
        const windowArea = windows * 15;   // standard window ≈ 15 sq ft
        const paintableArea = wallArea - doorArea - windowArea;
        const totalArea = paintableArea * coats;
        const gallons = coverage > 0 ? totalArea / coverage : 0;
        return { wallArea, paintableArea, totalArea, gallons };
    }, [roomLength, roomWidth, wallHeight, doors, windows, coats, coverage]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🎨 Paint Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
                <InputField label="Coats" value={coats} onChange={setCoats} min={1} max={4} />
                <InputField label="Paint Coverage" value={coverage} onChange={setCoverage} unit="sq ft/gal" min={100} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                <ResultRow label="Paintable Area" value={fmt(result.paintableArea)} unit="sq ft" />
                <ResultRow label="Total Area (all coats)" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Paint Needed" value={fmt(result.gallons, 1)} unit="gallons" />
                <ResultRow label="Quarts Needed" value={fmt(result.gallons * 4, 1)} unit="quarts" />
            </div>
        </div>
    );
}

/* ──────────── 8. DRYWALL CALCULATOR ──────────── */
function DrywallCalc() {
    const [roomLength, setRoomLength] = useState(12);
    const [roomWidth, setRoomWidth] = useState(10);
    const [wallHeight, setWallHeight] = useState(8);
    const [doors, setDoors] = useState(1);
    const [windows, setWindows] = useState(2);
    const [includeCeiling, setIncludeCeiling] = useState(true);

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const wallArea = perimeter * wallHeight;
        const ceilingArea = includeCeiling ? roomLength * roomWidth : 0;
        const openingsArea = (doors * 21) + (windows * 15);
        const totalArea = wallArea + ceilingArea - openingsArea;
        const sheets = totalArea / 32;           // 4×8 sheet = 32 sq ft
        const jointTape = (totalArea / 32) * 12; // ~12 ft of tape per sheet
        const jointCompound = totalArea / 100;    // ~1 bucket per 100 sq ft
        const screws = totalArea * 0.8;           // ~0.8 screws per sq ft
        return { totalArea, wallArea, ceilingArea, sheets, jointTape, jointCompound, screws };
    }, [roomLength, roomWidth, wallHeight, doors, windows, includeCeiling]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪟 Drywall Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
                <div className="con-input">
                    <label className="con-input__label">Include Ceiling</label>
                    <div className="con-toggle">
                        <button
                            className={`con-toggle__btn ${includeCeiling ? "con-toggle__btn--active" : ""}`}
                            onClick={() => setIncludeCeiling(true)}
                        >Yes</button>
                        <button
                            className={`con-toggle__btn ${!includeCeiling ? "con-toggle__btn--active" : ""}`}
                            onClick={() => setIncludeCeiling(false)}
                        >No</button>
                    </div>
                </div>
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                {includeCeiling && <ResultRow label="Ceiling Area" value={fmt(result.ceilingArea)} unit="sq ft" />}
                <ResultRow label="Total Drywall Area" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="4×8 Sheets" value={fmtInt(result.sheets)} unit="sheets" />
                <ResultRow label="Joint Tape" value={fmtInt(result.jointTape)} unit="ft" />
                <ResultRow label="Joint Compound" value={fmt(result.jointCompound, 1)} unit="buckets" />
                <ResultRow label="Drywall Screws" value={fmtInt(result.screws)} unit="screws" />
            </div>
        </div>
    );
}

/* ──────────── 9. SQUARE FOOTAGE CALCULATOR ──────────── */
function SquareFootageCalc() {
    const [shape, setShape] = useState("rectangle");
    const [dim1, setDim1] = useState(20);
    const [dim2, setDim2] = useState(15);
    const [dim3, setDim3] = useState(10);

    const result = useMemo(() => {
        let sqFt = 0;
        switch (shape) {
            case "rectangle": sqFt = dim1 * dim2; break;
            case "triangle": sqFt = 0.5 * dim1 * dim2; break;
            case "circle": sqFt = Math.PI * (dim1 / 2) * (dim1 / 2); break;
            case "trapezoid": sqFt = 0.5 * (dim1 + dim2) * dim3; break;
        }
        const sqM = sqFt * 0.092903;
        const sqYd = sqFt / 9;
        const acres = sqFt / 43560;
        return { sqFt, sqM, sqYd, acres };
    }, [shape, dim1, dim2, dim3]);

    const labels = shape === "circle"
        ? { d1: "Diameter", d2: "", d3: "" }
        : shape === "trapezoid"
        ? { d1: "Base 1 (a)", d2: "Base 2 (b)", d3: "Height" }
        : shape === "triangle"
        ? { d1: "Base", d2: "Height", d3: "" }
        : { d1: "Length", d2: "Width", d3: "" };

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Square Footage Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle" },
                    { value: "triangle", label: "Triangle" },
                    { value: "circle", label: "Circle" },
                    { value: "trapezoid", label: "Trapezoid" },
                ]} />
                <InputField label={labels.d1} value={dim1} onChange={setDim1} unit="ft" min={0.1} step={0.5} />
                {labels.d2 && <InputField label={labels.d2} value={dim2} onChange={setDim2} unit="ft" min={0.1} step={0.5} />}
                {labels.d3 && <InputField label={labels.d3} value={dim3} onChange={setDim3} unit="ft" min={0.1} step={0.5} />}
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area" value={fmt(result.sqFt)} unit="sq ft" />
                <ResultRow label="Area" value={fmt(result.sqM)} unit="sq m" />
                <ResultRow label="Area" value={fmt(result.sqYd)} unit="sq yd" />
                <ResultRow label="Area" value={fmt(result.acres, 4)} unit="acres" />
            </div>
        </div>
    );
}

/* ──────────── 10. CUBIC YARDS CALCULATOR ──────────── */
function CubicYardsCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(6);
    const [depthUnit, setDepthUnit] = useState("inches");

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const cuM = cuFt * 0.0283168;
        const tons = cuYd * 1.4; // rough estimate: 1 cu yd ≈ 1.4 tons for gravel
        return { cuFt, cuYd, cuM, tons };
    }, [length, width, depth, depthUnit]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📦 Cubic Yards Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Volume" value={fmt(result.cuM)} unit="cu m" />
                <ResultRow label="Est. Weight (gravel)" value={fmt(result.tons, 1)} unit="tons" />
            </div>
        </div>
    );
}

/* ──────────── DISPATCHER ──────────── */
const CALC_MAP: Record<string, React.FC> = {
    "concrete": ConcreteCalc,
    "concrete-block": ConcreteBlockCalc,
    "flooring": FlooringCalc,
    "tile": TileCalc,
    "roofing": RoofingCalc,
    "roof-pitch": RoofPitchCalc,
    "paint": PaintCalc,
    "drywall": DrywallCalc,
    "square-footage": SquareFootageCalc,
    "cubic-yards": CubicYardsCalc,
};

export default function ConstructionCalculatorCore({ calcType }: { calcType: string }) {
    const CalcComponent = CALC_MAP[calcType];
    if (!CalcComponent) return <p>Calculator not found: {calcType}</p>;
    return <CalcComponent />;
}
