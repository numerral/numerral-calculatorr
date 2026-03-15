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

/* ──────────── 11. GRAVEL CALCULATOR ──────────── */
function GravelCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(3);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [material, setMaterial] = useState("crushed-stone");
    const [pricePerYd, setPricePerYd] = useState(50);

    const DENSITY: Record<string, number> = {
        "crushed-stone": 1.4, "pea-gravel": 1.4, "river-rock": 1.5,
        "limestone": 1.5, "decomposed-granite": 1.3,
    };

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const tons = cuYd * (DENSITY[material] || 1.4);
        const cost = cuYd * pricePerYd;
        return { cuFt, cuYd, tons, cost };
    }, [length, width, depth, depthUnit, material, pricePerYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Gravel Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
                <SelectField label="Material" value={material} onChange={setMaterial} options={[
                    { value: "crushed-stone", label: "Crushed Stone" },
                    { value: "pea-gravel", label: "Pea Gravel" },
                    { value: "river-rock", label: "River Rock" },
                    { value: "limestone", label: "Limestone" },
                    { value: "decomposed-granite", label: "Decomposed Granite" },
                ]} />
                <InputField label="Price per cu yd" value={pricePerYd} onChange={setPricePerYd} unit="$" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 12. MULCH CALCULATOR ──────────── */
function MulchCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(3);
    const [bagSize, setBagSize] = useState(2);
    const [pricePerBag, setPricePerBag] = useState(5);

    const result = useMemo(() => {
        const depthFt = depth / 12;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const bags = bagSize > 0 ? cuFt / bagSize : 0;
        const cost = bags * pricePerBag;
        return { cuFt, cuYd, bags, cost };
    }, [length, width, depth, bagSize, pricePerBag]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌿 Mulch Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit="inches" min={1} max={12} />
                <InputField label="Bag Size" value={bagSize} onChange={setBagSize} unit="cu ft/bag" min={1} step={0.5} />
                <InputField label="Price per Bag" value={pricePerBag} onChange={setPricePerBag} unit="$" min={0} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Bags Needed" value={fmtInt(result.bags)} unit="bags" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 13. BRICK CALCULATOR ──────────── */
function BrickCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(8);
    const [brickLength, setBrickLength] = useState(8);
    const [brickHeight, setBrickHeight] = useState(2.25);
    const [mortarJoint, setMortarJoint] = useState(0.375);
    const [waste, setWaste] = useState(5);

    const result = useMemo(() => {
        const wallArea = wallLength * wallHeight;
        const brickLenFt = (brickLength + mortarJoint) / 12;
        const brickHtFt = (brickHeight + mortarJoint) / 12;
        const brickArea = brickLenFt * brickHtFt;
        const bricksExact = brickArea > 0 ? wallArea / brickArea : 0;
        const bricksWithWaste = bricksExact * (1 + waste / 100);
        const mortarBags = bricksWithWaste / 35;
        return { wallArea, bricksExact, bricksWithWaste, mortarBags };
    }, [wallLength, wallHeight, brickLength, brickHeight, mortarJoint, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Brick Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Brick Length" value={brickLength} onChange={setBrickLength} unit="in" min={1} step={0.25} />
                <InputField label="Brick Height" value={brickHeight} onChange={setBrickHeight} unit="in" min={0.5} step={0.25} />
                <InputField label="Mortar Joint" value={mortarJoint} onChange={setMortarJoint} unit="in" min={0.25} step={0.125} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={20} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                <ResultRow label="Bricks (exact)" value={fmtInt(result.bricksExact)} unit="bricks" />
                <ResultRow label="Bricks (+ waste)" value={fmtInt(result.bricksWithWaste)} unit="bricks" />
                <ResultRow label="Mortar (80 lb bags)" value={fmtInt(result.mortarBags)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 14. FENCE CALCULATOR ──────────── */
function FenceCalc() {
    const [fenceLength, setFenceLength] = useState(100);
    const [fenceHeight, setFenceHeight] = useState(6);
    const [postSpacing, setPostSpacing] = useState(8);
    const [fenceType, setFenceType] = useState("wood-picket");

    const result = useMemo(() => {
        const posts = Math.ceil(fenceLength / postSpacing) + 1;
        const sections = posts - 1;
        let rails = 0, pickets = 0, panels = 0;
        if (fenceType === "wood-picket") {
            rails = sections * (fenceHeight > 4 ? 3 : 2);
            pickets = Math.ceil(fenceLength / 0.5); // 6" wide pickets
        } else if (fenceType === "wood-panel") {
            panels = sections;
            rails = 0;
        } else {
            // chain-link: measured in linear feet of fabric
            rails = sections * 2; // top + bottom rail
        }
        const postHoleDepth = Math.max(fenceHeight / 3 + 0.5, 2);
        const concreteBags = posts * 2;
        return { posts, sections, rails, pickets, panels, postHoleDepth, concreteBags };
    }, [fenceLength, fenceHeight, postSpacing, fenceType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏡 Fence Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Fence Length" value={fenceLength} onChange={setFenceLength} unit="ft" min={1} />
                <InputField label="Fence Height" value={fenceHeight} onChange={setFenceHeight} unit="ft" min={3} max={10} />
                <InputField label="Post Spacing" value={postSpacing} onChange={setPostSpacing} unit="ft" min={4} max={12} />
                <SelectField label="Fence Type" value={fenceType} onChange={setFenceType} options={[
                    { value: "wood-picket", label: "Wood Picket" },
                    { value: "wood-panel", label: "Wood Panel (Pre-built)" },
                    { value: "chain-link", label: "Chain Link" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Posts Needed" value={fmtInt(result.posts)} unit="posts" />
                <ResultRow label="Sections" value={fmtInt(result.sections)} unit="sections" />
                <ResultRow label="Rails" value={fmtInt(result.rails)} unit="rails" />
                {result.pickets > 0 && <ResultRow label="Pickets" value={fmtInt(result.pickets)} unit="pickets" />}
                {result.panels > 0 && <ResultRow label="Panels" value={fmtInt(result.panels)} unit="panels" />}
                <ResultRow label="Post Hole Depth" value={fmt(result.postHoleDepth, 1)} unit="ft" />
                <ResultRow label="Concrete (50 lb bags)" value={fmtInt(result.concreteBags)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 15. DECK CALCULATOR ──────────── */
function DeckCalc() {
    const [deckLength, setDeckLength] = useState(12);
    const [deckWidth, setDeckWidth] = useState(16);
    const [boardWidth, setBoardWidth] = useState(5.5);
    const [joistSpacing, setJoistSpacing] = useState(16);
    const [pricePerBoard, setPricePerBoard] = useState(15);

    const result = useMemo(() => {
        const area = deckLength * deckWidth;
        const boardWidthFt = boardWidth / 12;
        const boardsNeeded = boardWidthFt > 0 ? Math.ceil(deckWidth / boardWidthFt) : 0;
        const totalLinearFt = boardsNeeded * deckLength;
        const joistSpacingFt = joistSpacing / 12;
        const joists = joistSpacingFt > 0 ? Math.ceil(deckLength / joistSpacingFt) + 1 : 0;
        const screws = boardsNeeded * joists * 2;
        const posts = Math.ceil(deckLength / 6) * Math.ceil(deckWidth / 6);
        const cost = boardsNeeded * pricePerBoard;
        return { area, boardsNeeded, totalLinearFt, joists, screws, posts, cost };
    }, [deckLength, deckWidth, boardWidth, joistSpacing, pricePerBoard]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Deck Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Deck Length" value={deckLength} onChange={setDeckLength} unit="ft" min={4} />
                <InputField label="Deck Width" value={deckWidth} onChange={setDeckWidth} unit="ft" min={4} />
                <InputField label="Board Width" value={boardWidth} onChange={setBoardWidth} unit="in" min={3} max={12} step={0.5} />
                <InputField label="Joist Spacing" value={joistSpacing} onChange={setJoistSpacing} unit="in OC" min={12} max={24} />
                <InputField label="Price per Board" value={pricePerBoard} onChange={setPricePerBoard} unit="$" min={0} step={1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Deck Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Deck Boards" value={fmtInt(result.boardsNeeded)} unit="boards" />
                <ResultRow label="Total Linear Feet" value={fmt(result.totalLinearFt)} unit="lin ft" />
                <ResultRow label="Joists" value={fmtInt(result.joists)} unit="joists" />
                <ResultRow label="Support Posts" value={fmtInt(result.posts)} unit="posts" />
                <ResultRow label="Deck Screws" value={fmtInt(result.screws)} unit="screws" />
                <ResultRow label="Est. Board Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 16. STAIRCASE CALCULATOR ──────────── */
function StaircaseCalc() {
    const [totalRise, setTotalRise] = useState(108);
    const [stairWidth, setStairWidth] = useState(36);
    const [riserTarget, setRiserTarget] = useState(7.5);

    const result = useMemo(() => {
        const numRisers = Math.round(totalRise / riserTarget);
        const actualRiser = numRisers > 0 ? totalRise / numRisers : 0;
        const numTreads = numRisers - 1;
        const treadDepth = 10.5;
        const totalRun = numTreads * treadDepth;
        const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);
        const numStringers = stairWidth > 36 ? 3 : 2;
        return { numRisers, actualRiser, numTreads, treadDepth, totalRun, stringerLength, numStringers };
    }, [totalRise, stairWidth, riserTarget]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪜 Staircase Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Total Rise" value={totalRise} onChange={setTotalRise} unit="in" min={12} />
                <InputField label="Stair Width" value={stairWidth} onChange={setStairWidth} unit="in" min={24} max={72} />
                <InputField label="Target Riser Height" value={riserTarget} onChange={setRiserTarget} unit="in" min={6} max={8} step={0.25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Number of Risers" value={fmtInt(result.numRisers)} unit="risers" />
                <ResultRow label="Actual Riser Height" value={fmt(result.actualRiser, 2)} unit="in" />
                <ResultRow label="Number of Treads" value={fmtInt(result.numTreads)} unit="treads" />
                <ResultRow label="Tread Depth" value={fmt(result.treadDepth, 1)} unit="in" />
                <ResultRow label="Total Run" value={fmt(result.totalRun, 1)} unit="in" />
                <ResultRow label="Stringer Length" value={fmt(result.stringerLength, 1)} unit="in" />
                <ResultRow label="Stringers Needed" value={fmtInt(result.numStringers)} />
            </div>
        </div>
    );
}

/* ──────────── 17. LUMBER CALCULATOR ──────────── */
function LumberCalc() {
    const [boardLength, setBoardLength] = useState(8);
    const [boardWidth, setBoardWidth] = useState(6);
    const [boardThickness, setBoardThickness] = useState(1);
    const [quantity, setQuantity] = useState(10);
    const [pricePerBF, setPricePerBF] = useState(5);

    const result = useMemo(() => {
        const boardFeetEach = (boardLength * boardWidth * boardThickness) / 12;
        const totalBF = boardFeetEach * quantity;
        const cost = totalBF * pricePerBF;
        return { boardFeetEach, totalBF, cost };
    }, [boardLength, boardWidth, boardThickness, quantity, pricePerBF]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪓 Lumber Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Board Length" value={boardLength} onChange={setBoardLength} unit="ft" min={1} />
                <InputField label="Board Width" value={boardWidth} onChange={setBoardWidth} unit="in" min={1} />
                <InputField label="Board Thickness" value={boardThickness} onChange={setBoardThickness} unit="in" min={0.25} step={0.25} />
                <InputField label="Quantity" value={quantity} onChange={setQuantity} min={1} />
                <InputField label="Price per Board Foot" value={pricePerBF} onChange={setPricePerBF} unit="$" min={0} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Board Feet (each)" value={fmt(result.boardFeetEach)} unit="BF" />
                <ResultRow label="Total Board Feet" value={fmt(result.totalBF)} unit="BF" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 18. INSULATION CALCULATOR ──────────── */
function InsulationCalc() {
    const [wallLength, setWallLength] = useState(40);
    const [wallHeight, setWallHeight] = useState(8);
    const [insulationType, setInsulationType] = useState("batt");
    const [rValue, setRValue] = useState("R-13");

    const BATT_COVERAGE: Record<string, number> = {
        "R-13": 40, "R-19": 48, "R-30": 31, "R-38": 24,
    };

    const result = useMemo(() => {
        const area = wallLength * wallHeight;
        if (insulationType === "batt") {
            const coverage = BATT_COVERAGE[rValue] || 40;
            const rolls = area / coverage;
            return { area, rolls, bags: 0 };
        } else {
            const bags = area / 40;
            return { area, rolls: 0, bags };
        }
    }, [wallLength, wallHeight, insulationType, rValue]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧤 Insulation Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <SelectField label="Type" value={insulationType} onChange={setInsulationType} options={[
                    { value: "batt", label: "Batt / Roll" },
                    { value: "blown-in", label: "Blown-In (Cellulose)" },
                ]} />
                {insulationType === "batt" && (
                    <SelectField label="R-Value" value={rValue} onChange={setRValue} options={[
                        { value: "R-13", label: "R-13 (2×4 walls)" },
                        { value: "R-19", label: "R-19 (2×6 walls)" },
                        { value: "R-30", label: "R-30 (attic floors)" },
                        { value: "R-38", label: "R-38 (attic floors)" },
                    ]} />
                )}
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Area" value={fmt(result.area)} unit="sq ft" />
                {result.rolls > 0 && <ResultRow label="Rolls / Batts" value={fmtInt(result.rolls)} unit="rolls" />}
                {result.bags > 0 && <ResultRow label="Bags (blown-in)" value={fmtInt(result.bags)} unit="bags" />}
            </div>
        </div>
    );
}

/* ──────────── 19. CARPET CALCULATOR ──────────── */
function CarpetCalc() {
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(10);
    const [waste, setWaste] = useState(10);
    const [pricePerSqYd, setPricePerSqYd] = useState(25);

    const result = useMemo(() => {
        const sqFt = length * width;
        const withWaste = sqFt * (1 + waste / 100);
        const sqYd = withWaste / 9;
        const cost = sqYd * pricePerSqYd;
        return { sqFt, withWaste, sqYd, cost };
    }, [length, width, waste, pricePerSqYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🟫 Carpet Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Room Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
                <InputField label="Price per sq yd" value={pricePerSqYd} onChange={setPricePerSqYd} unit="$" min={0} step={1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Room Area" value={fmt(result.sqFt)} unit="sq ft" />
                <ResultRow label="Carpet Needed (+ waste)" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Carpet Needed" value={fmt(result.sqYd, 1)} unit="sq yd" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 20. SAND CALCULATOR ──────────── */
function SandCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(4);
    const [depthUnit, setDepthUnit] = useState("inches");

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const tons = cuYd * 1.35;
        const bags50lb = cuFt * 100 / 50;
        return { cuFt, cuYd, tons, bags50lb };
    }, [length, width, depth, depthUnit]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⏳ Sand Calculator</h3>
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
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="50 lb Bags" value={fmtInt(result.bags50lb)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 21. TOPSOIL CALCULATOR ──────────── */
function TopsoilCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(6);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [material, setMaterial] = useState("topsoil");
    const [pricePerYd, setPricePerYd] = useState(35);

    const DENSITY: Record<string, number> = {
        "topsoil": 1.1, "garden-mix": 1.0, "compost": 0.6, "potting-soil": 0.5,
    };

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const tons = cuYd * (DENSITY[material] || 1.1);
        const bags40lb = (tons * 2000) / 40;
        const cost = cuYd * pricePerYd;
        return { cuFt, cuYd, tons, bags40lb, cost };
    }, [length, width, depth, depthUnit, material, pricePerYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌱 Topsoil Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
                <SelectField label="Material" value={material} onChange={setMaterial} options={[
                    { value: "topsoil", label: "Topsoil" },
                    { value: "garden-mix", label: "Garden Mix" },
                    { value: "compost", label: "Compost" },
                    { value: "potting-soil", label: "Potting Soil" },
                ]} />
                <InputField label="Price per cu yd" value={pricePerYd} onChange={setPricePerYd} unit="$" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="40 lb Bags" value={fmtInt(result.bags40lb)} unit="bags" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 22. RETAINING WALL CALCULATOR ──────────── */
function RetainingWallCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(3);
    const [blockLength, setBlockLength] = useState(12);
    const [blockHeight, setBlockHeight] = useState(4);
    const [blockDepth, setBlockDepth] = useState(8);

    const result = useMemo(() => {
        const rows = Math.ceil((wallHeight * 12) / blockHeight);
        const blocksPerRow = Math.ceil((wallLength * 12) / blockLength);
        const totalBlocks = rows * blocksPerRow;
        const capBlocks = blocksPerRow;
        const gravelCuFt = wallLength * (blockDepth / 12) * wallHeight * 0.5;
        const gravelCuYd = gravelCuFt / 27;
        const drainagePipe = wallLength;
        return { rows, blocksPerRow, totalBlocks, capBlocks, gravelCuYd, drainagePipe };
    }, [wallLength, wallHeight, blockLength, blockHeight, blockDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Retaining Wall Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={0.5} step={0.5} />
                <InputField label="Block Length" value={blockLength} onChange={setBlockLength} unit="in" min={4} />
                <InputField label="Block Height" value={blockHeight} onChange={setBlockHeight} unit="in" min={2} />
                <InputField label="Block Depth" value={blockDepth} onChange={setBlockDepth} unit="in" min={4} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Rows" value={fmtInt(result.rows)} unit="rows" />
                <ResultRow label="Blocks per Row" value={fmtInt(result.blocksPerRow)} unit="blocks" />
                <ResultRow label="Total Blocks" value={fmtInt(result.totalBlocks)} unit="blocks" />
                <ResultRow label="Cap Blocks" value={fmtInt(result.capBlocks)} unit="blocks" />
                <ResultRow label="Gravel Backfill" value={fmt(result.gravelCuYd, 1)} unit="cu yd" />
                <ResultRow label="Drainage Pipe" value={fmt(result.drainagePipe)} unit="ft" />
            </div>
        </div>
    );
}

/* ──────────── 23. ASPHALT CALCULATOR ──────────── */
function AsphaltCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(12);
    const [thickness, setThickness] = useState(3);
    const [pricePerTon, setPricePerTon] = useState(100);

    const result = useMemo(() => {
        const area = length * width;
        const thicknessFt = thickness / 12;
        const cuFt = area * thicknessFt;
        const cuYd = cuFt / 27;
        const tons = cuFt * 145 / 2000; // hot mix asphalt ≈ 145 lbs/cu ft
        const truckloads = tons / 20; // typical truck = ~20 tons
        const cost = tons * pricePerTon;
        return { area, cuFt, cuYd, tons, truckloads, cost };
    }, [length, width, thickness, pricePerTon]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🛣️ Asphalt Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={1} max={12} step={0.5} />
                <InputField label="Price per Ton" value={pricePerTon} onChange={setPricePerTon} unit="$" min={0} step={10} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Hot Mix Needed" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Truckloads (20 ton)" value={fmt(result.truckloads, 1)} unit="loads" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 24. REBAR CALCULATOR ──────────── */
function RebarCalc() {
    const [slabLength, setSlabLength] = useState(20);
    const [slabWidth, setSlabWidth] = useState(20);
    const [spacing, setSpacing] = useState(12);
    const [barSize, setBarSize] = useState("#4");

    const BAR_WEIGHT: Record<string, number> = {
        "#3": 0.376, "#4": 0.668, "#5": 1.043, "#6": 1.502, "#7": 2.044, "#8": 2.670,
    };

    const result = useMemo(() => {
        const spacingFt = spacing / 12;
        const barsLength = spacingFt > 0 ? Math.floor(slabWidth / spacingFt) + 1 : 0;
        const barsWidth = spacingFt > 0 ? Math.floor(slabLength / spacingFt) + 1 : 0;
        const totalBars = barsLength + barsWidth;
        const linearFtLength = barsLength * slabLength;
        const linearFtWidth = barsWidth * slabWidth;
        const totalLinearFt = linearFtLength + linearFtWidth;
        const weightPerFt = BAR_WEIGHT[barSize] || 0.668;
        const totalWeight = totalLinearFt * weightPerFt;
        return { barsLength, barsWidth, totalBars, totalLinearFt, totalWeight };
    }, [slabLength, slabWidth, spacing, barSize]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔩 Rebar Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Slab Length" value={slabLength} onChange={setSlabLength} unit="ft" min={1} />
                <InputField label="Slab Width" value={slabWidth} onChange={setSlabWidth} unit="ft" min={1} />
                <InputField label="Bar Spacing" value={spacing} onChange={setSpacing} unit="in OC" min={6} max={24} />
                <SelectField label="Bar Size" value={barSize} onChange={setBarSize} options={[
                    { value: "#3", label: "#3 (⅜ in)" },
                    { value: "#4", label: "#4 (½ in)" },
                    { value: "#5", label: "#5 (⅝ in)" },
                    { value: "#6", label: "#6 (¾ in)" },
                    { value: "#7", label: "#7 (⅞ in)" },
                    { value: "#8", label: "#8 (1 in)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Bars (lengthwise)" value={fmtInt(result.barsLength)} unit="bars" />
                <ResultRow label="Bars (widthwise)" value={fmtInt(result.barsWidth)} unit="bars" />
                <ResultRow label="Total Bars" value={fmtInt(result.totalBars)} unit="bars" />
                <ResultRow label="Total Linear Feet" value={fmt(result.totalLinearFt)} unit="ft" />
                <ResultRow label="Total Weight" value={fmt(result.totalWeight, 1)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 25. SIDING CALCULATOR ──────────── */
function SidingCalc() {
    const [wallLength, setWallLength] = useState(40);
    const [wallHeight, setWallHeight] = useState(9);
    const [walls, setWalls] = useState(4);
    const [doors, setDoors] = useState(2);
    const [windows, setWindows] = useState(8);
    const [gableArea, setGableArea] = useState(60);
    const [waste, setWaste] = useState(10);

    const result = useMemo(() => {
        const grossArea = wallLength * wallHeight * walls + gableArea;
        const openingsArea = (doors * 21) + (windows * 15);
        const netArea = grossArea - openingsArea;
        const withWaste = netArea * (1 + waste / 100);
        const squares = withWaste / 100; // 1 "square" = 100 sq ft of siding
        return { grossArea, openingsArea, netArea, withWaste, squares };
    }, [wallLength, wallHeight, walls, doors, windows, gableArea, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Siding Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Avg Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Number of Walls" value={walls} onChange={setWalls} min={1} max={10} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
                <InputField label="Gable Area" value={gableArea} onChange={setGableArea} unit="sq ft" min={0} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Gross Wall Area" value={fmt(result.grossArea)} unit="sq ft" />
                <ResultRow label="Openings Deducted" value={fmt(result.openingsArea)} unit="sq ft" />
                <ResultRow label="Net Siding Area" value={fmt(result.netArea)} unit="sq ft" />
                <ResultRow label="Total (+ waste)" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Siding Squares" value={fmt(result.squares, 1)} unit="squares" />
            </div>
        </div>
    );
}

/* ──────────── 26. GUTTER CALCULATOR ──────────── */
function GutterCalc() {
    const [roofEdge, setRoofEdge] = useState(100);
    const [downspoutSpacing, setDownspoutSpacing] = useState(40);
    const [gutterSection, setGutterSection] = useState(10);

    const result = useMemo(() => {
        const sections = Math.ceil(roofEdge / gutterSection);
        const downspouts = Math.max(Math.ceil(roofEdge / downspoutSpacing), 2);
        const brackets = Math.ceil(roofEdge / 3); // 1 bracket every 3 ft
        const insideCorners = 2;
        const outsideCorners = 2;
        const elbowsPerDownspout = 3; // 2 at top + 1 at bottom
        const totalElbows = downspouts * elbowsPerDownspout;
        const endCaps = 2;
        return { sections, downspouts, brackets, insideCorners, outsideCorners, totalElbows, endCaps };
    }, [roofEdge, downspoutSpacing, gutterSection]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌧️ Gutter Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Total Roof Edge" value={roofEdge} onChange={setRoofEdge} unit="ft" min={10} />
                <InputField label="Downspout Spacing" value={downspoutSpacing} onChange={setDownspoutSpacing} unit="ft" min={20} max={60} />
                <InputField label="Gutter Section Length" value={gutterSection} onChange={setGutterSection} unit="ft" min={5} max={20} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Gutter Sections" value={fmtInt(result.sections)} unit="sections" />
                <ResultRow label="Downspouts" value={fmtInt(result.downspouts)} unit="downspouts" />
                <ResultRow label="Brackets / Hangers" value={fmtInt(result.brackets)} unit="brackets" />
                <ResultRow label="Elbows" value={fmtInt(result.totalElbows)} unit="elbows" />
                <ResultRow label="End Caps" value={fmtInt(result.endCaps)} unit="caps" />
            </div>
        </div>
    );
}

/* ──────────── 27. PAVER CALCULATOR ──────────── */
function PaverCalc() {
    const [areaLength, setAreaLength] = useState(12);
    const [areaWidth, setAreaWidth] = useState(10);
    const [paverLength, setPaverLength] = useState(8);
    const [paverWidth, setPaverWidth] = useState(4);
    const [gap, setGap] = useState(0.25);
    const [waste, setWaste] = useState(10);
    const [baseDepth, setBaseDepth] = useState(4);

    const result = useMemo(() => {
        const areaSqFt = areaLength * areaWidth;
        const effectiveL = (paverLength + gap) / 12;
        const effectiveW = (paverWidth + gap) / 12;
        const paverArea = effectiveL * effectiveW;
        const paversExact = paverArea > 0 ? areaSqFt / paverArea : 0;
        const paversWithWaste = paversExact * (1 + waste / 100);
        const baseCuFt = areaSqFt * (baseDepth / 12);
        const baseCuYd = baseCuFt / 27;
        const sandCuFt = areaSqFt * (1 / 12); // 1 inch leveling sand
        const sandCuYd = sandCuFt / 27;
        const polymericBags = areaSqFt / 25; // ~1 bag per 25 sq ft
        return { areaSqFt, paversExact, paversWithWaste, baseCuYd, sandCuYd, polymericBags };
    }, [areaLength, areaWidth, paverLength, paverWidth, gap, waste, baseDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Paver Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Area Length" value={areaLength} onChange={setAreaLength} unit="ft" min={1} />
                <InputField label="Area Width" value={areaWidth} onChange={setAreaWidth} unit="ft" min={1} />
                <InputField label="Paver Length" value={paverLength} onChange={setPaverLength} unit="in" min={2} />
                <InputField label="Paver Width" value={paverWidth} onChange={setPaverWidth} unit="in" min={2} />
                <InputField label="Joint Gap" value={gap} onChange={setGap} unit="in" min={0} step={0.0625} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={20} />
                <InputField label="Gravel Base Depth" value={baseDepth} onChange={setBaseDepth} unit="in" min={2} max={8} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Area" value={fmt(result.areaSqFt)} unit="sq ft" />
                <ResultRow label="Pavers (exact)" value={fmtInt(result.paversExact)} unit="pavers" />
                <ResultRow label="Pavers (+ waste)" value={fmtInt(result.paversWithWaste)} unit="pavers" />
                <ResultRow label="Gravel Base" value={fmt(result.baseCuYd, 1)} unit="cu yd" />
                <ResultRow label="Leveling Sand" value={fmt(result.sandCuYd, 1)} unit="cu yd" />
                <ResultRow label="Polymeric Sand" value={fmtInt(result.polymericBags)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 28. WALLPAPER CALCULATOR ──────────── */
function WallpaperCalc() {
    const [roomLength, setRoomLength] = useState(12);
    const [roomWidth, setRoomWidth] = useState(10);
    const [wallHeight, setWallHeight] = useState(8);
    const [doors, setDoors] = useState(1);
    const [windows, setWindows] = useState(2);
    const [rollWidth, setRollWidth] = useState(21);
    const [rollLength, setRollLength] = useState(33);
    const [patternRepeat, setPatternRepeat] = useState(0);

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const wallArea = perimeter * wallHeight;
        const openingsArea = (doors * 21) + (windows * 15);
        const coverableArea = wallArea - openingsArea;
        const rollWidthFt = rollWidth / 12;
        const usableLength = patternRepeat > 0 ? rollLength * 0.85 : rollLength; // 15% pattern waste
        const rollCoverage = rollWidthFt * usableLength;
        const rolls = rollCoverage > 0 ? Math.ceil(coverableArea / rollCoverage) : 0;
        return { wallArea, coverableArea, rollCoverage, rolls };
    }, [roomLength, roomWidth, wallHeight, doors, windows, rollWidth, rollLength, patternRepeat]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🎨 Wallpaper Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
                <InputField label="Roll Width" value={rollWidth} onChange={setRollWidth} unit="in" min={15} max={36} />
                <InputField label="Roll Length" value={rollLength} onChange={setRollLength} unit="ft" min={10} max={60} />
                <InputField label="Pattern Repeat" value={patternRepeat} onChange={setPatternRepeat} unit="in" min={0} max={36} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                <ResultRow label="Coverable Area" value={fmt(result.coverableArea)} unit="sq ft" />
                <ResultRow label="Coverage per Roll" value={fmt(result.rollCoverage, 1)} unit="sq ft" />
                <ResultRow label="Rolls Needed" value={fmtInt(result.rolls)} unit="rolls" />
            </div>
        </div>
    );
}

/* ──────────── 29. POOL VOLUME CALCULATOR ──────────── */
function PoolVolumeCalc() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(15);
    const [shallowDepth, setShallowDepth] = useState(3);
    const [deepDepth, setDeepDepth] = useState(8);

    const result = useMemo(() => {
        const avgDepth = (shallowDepth + deepDepth) / 2;
        let cuFt = 0;
        if (shape === "rectangle") {
            cuFt = length * width * avgDepth;
        } else if (shape === "round") {
            const radius = length / 2;
            cuFt = Math.PI * radius * radius * avgDepth;
        } else if (shape === "oval") {
            cuFt = Math.PI * (length / 2) * (width / 2) * avgDepth;
        }
        const gallons = cuFt * 7.48052;
        const liters = gallons * 3.78541;
        return { avgDepth, cuFt, gallons, liters };
    }, [shape, length, width, shallowDepth, deepDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏊 Pool Volume Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Pool Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle" },
                    { value: "round", label: "Round" },
                    { value: "oval", label: "Oval" },
                ]} />
                <InputField label={shape === "round" ? "Diameter" : "Length"} value={length} onChange={setLength} unit="ft" min={4} />
                {shape !== "round" && <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={4} />}
                <InputField label="Shallow End Depth" value={shallowDepth} onChange={setShallowDepth} unit="ft" min={1} max={12} step={0.5} />
                <InputField label="Deep End Depth" value={deepDepth} onChange={setDeepDepth} unit="ft" min={1} max={16} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Average Depth" value={fmt(result.avgDepth, 1)} unit="ft" />
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmtInt(result.gallons)} unit="gallons" />
                <ResultRow label="Volume" value={fmtInt(result.liters)} unit="liters" />
            </div>
        </div>
    );
}

/* ──────────── 30. FILL DIRT CALCULATOR ──────────── */
function FillDirtCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(20);
    const [depth, setDepth] = useState(12);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [compaction, setCompaction] = useState(25);

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const cuFt = length * width * depthFt;
        const cuFtWithCompaction = cuFt * (1 + compaction / 100);
        const cuYd = cuFtWithCompaction / 27;
        const tons = cuYd * 1.15; // fill dirt ≈ 1.15 tons/cu yd
        const truckloads = cuYd / 14; // typical dump truck ≈ 14 cu yd
        return { cuFt, cuFtWithCompaction, cuYd, tons, truckloads };
    }, [length, width, depth, depthUnit, compaction]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⛰️ Fill Dirt Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
                <InputField label="Compaction Factor" value={compaction} onChange={setCompaction} unit="%" min={0} max={50} step={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume (loose)" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume (+ compaction)" value={fmt(result.cuFtWithCompaction)} unit="cu ft" />
                <ResultRow label="Order Amount" value={fmt(result.cuYd, 1)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Truckloads (14 yd)" value={fmt(result.truckloads, 1)} unit="loads" />
            </div>
        </div>
    );
}

/* ──────────── 31. SOIL AMENDMENT CALCULATOR ──────────── */
function SoilAmendmentCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [amendment, setAmendment] = useState("lime");
    const [appRate, setAppRate] = useState(5);

    const RATES: Record<string, { label: string; unit: string; defaultRate: number }> = {
        "lime": { label: "Agricultural Lime", unit: "lbs/100 sq ft", defaultRate: 5 },
        "sulfur": { label: "Eleite Sulfur", unit: "lbs/100 sq ft", defaultRate: 1 },
        "gypsum": { label: "Gypsum", unit: "lbs/100 sq ft", defaultRate: 4 },
        "compost": { label: "Compost", unit: "cu ft/100 sq ft", defaultRate: 8 },
    };

    const result = useMemo(() => {
        const area = length * width;
        const totalAmount = (area / 100) * appRate;
        const bags40lb = amendment !== "compost" ? totalAmount / 40 : 0;
        const bags50lb = amendment !== "compost" ? totalAmount / 50 : 0;
        const cuYd = amendment === "compost" ? totalAmount / 27 : 0;
        return { area, totalAmount, bags40lb, bags50lb, cuYd };
    }, [length, width, amendment, appRate]);

    const info = RATES[amendment] || RATES["lime"];

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧪 Soil Amendment Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Area Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Area Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <SelectField label="Amendment Type" value={amendment} onChange={(v) => { setAmendment(v); setAppRate(RATES[v]?.defaultRate || 5); }} options={[
                    { value: "lime", label: "Agricultural Lime" },
                    { value: "sulfur", label: "Sulfur (Elemental)" },
                    { value: "gypsum", label: "Gypsum" },
                    { value: "compost", label: "Compost" },
                ]} />
                <InputField label="Application Rate" value={appRate} onChange={setAppRate} unit={info.unit} min={0.5} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Total Amount" value={fmt(result.totalAmount, 1)} unit={amendment === "compost" ? "cu ft" : "lbs"} />
                {amendment !== "compost" && <ResultRow label="40 lb Bags" value={fmtInt(result.bags40lb)} unit="bags" />}
                {amendment !== "compost" && <ResultRow label="50 lb Bags" value={fmtInt(result.bags50lb)} unit="bags" />}
                {amendment === "compost" && <ResultRow label="Volume" value={fmt(result.cuYd, 1)} unit="cu yd" />}
            </div>
        </div>
    );
}

/* ──────────── 32. CONCRETE STAIRS CALCULATOR ──────────── */
function ConcreteStairsCalc() {
    const [totalRise, setTotalRise] = useState(36);
    const [stairWidth, setStairWidth] = useState(36);
    const [riserHeight, setRiserHeight] = useState(7.5);
    const [treadDepth, setTreadDepth] = useState(11);
    const [treadThickness, setTreadThickness] = useState(6);

    const result = useMemo(() => {
        const numSteps = Math.round(totalRise / riserHeight);
        const actualRiser = numSteps > 0 ? totalRise / numSteps : 0;
        const widthFt = stairWidth / 12;
        // Each step is a rectangle: treadDepth × treadThickness (inch) × width
        const stepVolCuIn = treadDepth * treadThickness * stairWidth;
        const totalStepVol = stepVolCuIn * numSteps;
        // Side triangles (stringers): roughly totalRise × totalRun / 2 × thickness(6")
        const totalRun = numSteps * treadDepth;
        const sideVolCuIn = (totalRise * totalRun / 2) * 6 * 2; // 2 sides
        const totalCuIn = totalStepVol + sideVolCuIn;
        const cuFt = totalCuIn / 1728;
        const cuYd = cuFt / 27;
        const bags80 = cuFt / 0.6;
        return { numSteps, actualRiser, cuFt, cuYd, bags80 };
    }, [totalRise, stairWidth, riserHeight, treadDepth, treadThickness]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪜 Concrete Stairs Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Total Rise" value={totalRise} onChange={setTotalRise} unit="in" min={6} />
                <InputField label="Stair Width" value={stairWidth} onChange={setStairWidth} unit="in" min={24} max={72} />
                <InputField label="Riser Height" value={riserHeight} onChange={setRiserHeight} unit="in" min={5} max={8} step={0.25} />
                <InputField label="Tread Depth" value={treadDepth} onChange={setTreadDepth} unit="in" min={9} max={14} />
                <InputField label="Slab Thickness" value={treadThickness} onChange={setTreadThickness} unit="in" min={4} max={8} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Number of Steps" value={fmtInt(result.numSteps)} unit="steps" />
                <ResultRow label="Actual Riser Height" value={fmt(result.actualRiser, 2)} unit="in" />
                <ResultRow label="Volume" value={fmt(result.cuFt, 1)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 33. AGGREGATE CALCULATOR ──────────── */
function AggregateCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(20);
    const [depth, setDepth] = useState(4);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [material, setMaterial] = useState("crushed-stone");
    const [pricePerTon, setPricePerTon] = useState(25);

    const DENSITY: Record<string, number> = {
        "crushed-stone": 1.4, "road-base": 1.6, "pea-gravel": 1.4,
        "recycled-concrete": 1.3, "slag": 1.5,
    };

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const tons = cuYd * (DENSITY[material] || 1.4);
        const cost = tons * pricePerTon;
        return { cuFt, cuYd, tons, cost };
    }, [length, width, depth, depthUnit, material, pricePerTon]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Aggregate Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
                <SelectField label="Aggregate Type" value={material} onChange={setMaterial} options={[
                    { value: "crushed-stone", label: "Crushed Stone" },
                    { value: "road-base", label: "Road Base (Class 5)" },
                    { value: "pea-gravel", label: "Pea Gravel" },
                    { value: "recycled-concrete", label: "Recycled Concrete" },
                    { value: "slag", label: "Slag" },
                ]} />
                <InputField label="Price per Ton" value={pricePerTon} onChange={setPricePerTon} unit="$" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 34. COLUMN CALCULATOR ──────────── */
function ColumnCalc() {
    const [shape, setShape] = useState("round");
    const [diameter, setDiameter] = useState(12);
    const [height, setHeight] = useState(48);
    const [quantity, setQuantity] = useState(4);

    const result = useMemo(() => {
        const diamFt = diameter / 12;
        const heightFt = height / 12;
        let volEachCuFt = 0;
        if (shape === "round") {
            const radius = diamFt / 2;
            volEachCuFt = Math.PI * radius * radius * heightFt;
        } else {
            volEachCuFt = diamFt * diamFt * heightFt;
        }
        const totalCuFt = volEachCuFt * quantity;
        const totalCuYd = totalCuFt / 27;
        const bags60 = totalCuFt / 0.45;
        const bags80 = totalCuFt / 0.6;
        return { volEachCuFt, totalCuFt, totalCuYd, bags60, bags80 };
    }, [shape, diameter, height, quantity]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏛️ Column / Pier Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "round", label: "Round (Sonotube)" },
                    { value: "square", label: "Square" },
                ]} />
                <InputField label={shape === "round" ? "Diameter" : "Side Length"} value={diameter} onChange={setDiameter} unit="in" min={4} max={48} />
                <InputField label="Height / Depth" value={height} onChange={setHeight} unit="in" min={12} max={120} />
                <InputField label="Quantity" value={quantity} onChange={setQuantity} min={1} max={100} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume (each)" value={fmt(result.volEachCuFt, 2)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuFt)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuYd, 2)} unit="cu yd" />
                <ResultRow label="60 lb Bags" value={fmtInt(result.bags60)} unit="bags" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 35. BOARD & BATTEN CALCULATOR ──────────── */
function BoardAndBattenCalc() {
    const [wallWidth, setWallWidth] = useState(12);
    const [wallHeight, setWallHeight] = useState(8);
    const [boardWidth, setBoardWidth] = useState(6);
    const [battenWidth, setBattenWidth] = useState(1.5);
    const [gap, setGap] = useState(0.5);

    const result = useMemo(() => {
        const wallWidthIn = wallWidth * 12;
        const repeat = boardWidth + gap;
        const numBoards = Math.ceil(wallWidthIn / repeat);
        const numBattens = numBoards - 1;
        const boardLinearFt = numBoards * wallHeight;
        const battenLinearFt = numBattens * wallHeight;
        const totalLinearFt = boardLinearFt + battenLinearFt;
        return { numBoards, numBattens, boardLinearFt, battenLinearFt, totalLinearFt };
    }, [wallWidth, wallHeight, boardWidth, battenWidth, gap]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Board & Batten Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Width" value={wallWidth} onChange={setWallWidth} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Board Width" value={boardWidth} onChange={setBoardWidth} unit="in" min={3} max={12} step={0.5} />
                <InputField label="Batten Width" value={battenWidth} onChange={setBattenWidth} unit="in" min={0.75} max={4} step={0.25} />
                <InputField label="Gap Between Boards" value={gap} onChange={setGap} unit="in" min={0} max={2} step={0.25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Boards Needed" value={fmtInt(result.numBoards)} unit="boards" />
                <ResultRow label="Battens Needed" value={fmtInt(result.numBattens)} unit="battens" />
                <ResultRow label="Board Linear Feet" value={fmt(result.boardLinearFt)} unit="ft" />
                <ResultRow label="Batten Linear Feet" value={fmt(result.battenLinearFt)} unit="ft" />
                <ResultRow label="Total Linear Feet" value={fmt(result.totalLinearFt)} unit="ft" />
            </div>
        </div>
    );
}

/* ──────────── 36. DRAINAGE CALCULATOR ──────────── */
function DrainageCalc() {
    const [trenchLength, setTrenchLength] = useState(50);
    const [trenchWidth, setTrenchWidth] = useState(12);
    const [trenchDepth, setTrenchDepth] = useState(18);

    const result = useMemo(() => {
        const widthFt = trenchWidth / 12;
        const depthFt = trenchDepth / 12;
        const cuFt = trenchLength * widthFt * depthFt;
        const gravelCuYd = cuFt / 27;
        const pipeLength = trenchLength;
        const fabricSqFt = trenchLength * ((2 * depthFt) + widthFt + 2); // wrap around gravel with overlap
        const fabricRolls = fabricSqFt / 300; // typical roll ~300 sq ft
        const catchBasins = Math.max(Math.floor(trenchLength / 50), 1);
        return { cuFt, gravelCuYd, pipeLength, fabricSqFt, fabricRolls, catchBasins };
    }, [trenchLength, trenchWidth, trenchDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💧 Drainage Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Trench Length" value={trenchLength} onChange={setTrenchLength} unit="ft" min={5} />
                <InputField label="Trench Width" value={trenchWidth} onChange={setTrenchWidth} unit="in" min={6} max={36} />
                <InputField label="Trench Depth" value={trenchDepth} onChange={setTrenchDepth} unit="in" min={8} max={36} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Gravel Fill" value={fmt(result.gravelCuYd, 1)} unit="cu yd" />
                <ResultRow label="Perforated Pipe" value={fmt(result.pipeLength)} unit="ft" />
                <ResultRow label="Landscape Fabric" value={fmt(result.fabricSqFt)} unit="sq ft" />
                <ResultRow label="Fabric Rolls" value={fmt(result.fabricRolls, 1)} unit="rolls" />
                <ResultRow label="Catch Basins" value={fmtInt(result.catchBasins)} unit="basins" />
            </div>
        </div>
    );
}

/* ──────────── 37. PLYWOOD CALCULATOR ──────────── */
function PlywoodCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(12);
    const [waste, setWaste] = useState(10);
    const [pricePerSheet, setPricePerSheet] = useState(45);

    const result = useMemo(() => {
        const area = length * width;
        const withWaste = area * (1 + waste / 100);
        const sheets = Math.ceil(withWaste / 32); // 4×8 = 32 sq ft
        const cost = sheets * pricePerSheet;
        return { area, withWaste, sheets, cost };
    }, [length, width, waste, pricePerSheet]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Plywood Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Area Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Area Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
                <InputField label="Price per Sheet" value={pricePerSheet} onChange={setPricePerSheet} unit="$" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Total (+ waste)" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="4×8 Sheets Needed" value={fmtInt(result.sheets)} unit="sheets" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 38. CEILING TILE CALCULATOR ──────────── */
function CeilingTileCalc() {
    const [roomLength, setRoomLength] = useState(20);
    const [roomWidth, setRoomWidth] = useState(12);
    const [tileSize, setTileSize] = useState("2x4");

    const result = useMemo(() => {
        const area = roomLength * roomWidth;
        const perimeter = 2 * (roomLength + roomWidth);
        const tileW = tileSize === "2x4" ? 2 : 2;
        const tileL = tileSize === "2x4" ? 4 : 2;
        const tileArea = tileW * tileL;
        const tiles = Math.ceil(area / tileArea);
        const mainRunners = Math.ceil(roomWidth / 4) * Math.ceil(roomLength / tileW);
        const crossTees = tileSize === "2x4"
            ? 0 // 2x4 tiles don't need cross tees (tiles span full 4 ft)
            : Math.ceil(roomLength / 4) * (Math.ceil(roomWidth / 2) - 1);
        const wallAngle = Math.ceil(perimeter);
        const hangWires = Math.ceil(area / 16); // 1 wire per 16 sq ft
        return { area, perimeter, tiles, mainRunners, crossTees, wallAngle, hangWires };
    }, [roomLength, roomWidth, tileSize]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔲 Ceiling Tile Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={4} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={4} />
                <SelectField label="Tile Size" value={tileSize} onChange={setTileSize} options={[
                    { value: "2x4", label: "2 ft × 4 ft" },
                    { value: "2x2", label: "2 ft × 2 ft" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Ceiling Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Ceiling Tiles" value={fmtInt(result.tiles)} unit="tiles" />
                <ResultRow label="Main Runners (12 ft)" value={fmtInt(result.mainRunners)} unit="pcs" />
                {result.crossTees > 0 && <ResultRow label="Cross Tees (2 ft)" value={fmtInt(result.crossTees)} unit="pcs" />}
                <ResultRow label="Wall Angle" value={fmtInt(result.wallAngle)} unit="lin ft" />
                <ResultRow label="Hanger Wires" value={fmtInt(result.hangWires)} unit="wires" />
            </div>
        </div>
    );
}

/* ──────────── 39. GABION WALL CALCULATOR ──────────── */
function GabionWallCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(3);
    const [basketLength, setBasketLength] = useState(6);
    const [basketHeight, setBasketHeight] = useState(3);
    const [basketDepth, setBasketDepth] = useState(3);

    const result = useMemo(() => {
        const rows = Math.ceil(wallHeight / basketHeight);
        const basketsPerRow = Math.ceil(wallLength / basketLength);
        const totalBaskets = rows * basketsPerRow;
        const basketVolCuFt = basketLength * basketHeight * basketDepth;
        const totalRockCuFt = totalBaskets * basketVolCuFt;
        const totalRockCuYd = totalRockCuFt / 27;
        const totalRockTons = totalRockCuYd * 1.4;
        return { rows, basketsPerRow, totalBaskets, totalRockCuYd, totalRockTons };
    }, [wallLength, wallHeight, basketLength, basketHeight, basketDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Gabion Wall Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} step={0.5} />
                <InputField label="Basket Length" value={basketLength} onChange={setBasketLength} unit="ft" min={2} max={10} />
                <InputField label="Basket Height" value={basketHeight} onChange={setBasketHeight} unit="ft" min={1} max={4} step={0.5} />
                <InputField label="Basket Depth" value={basketDepth} onChange={setBasketDepth} unit="ft" min={1} max={4} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Rows" value={fmtInt(result.rows)} unit="rows" />
                <ResultRow label="Baskets per Row" value={fmtInt(result.basketsPerRow)} unit="baskets" />
                <ResultRow label="Total Baskets" value={fmtInt(result.totalBaskets)} unit="baskets" />
                <ResultRow label="Rock Fill" value={fmt(result.totalRockCuYd, 1)} unit="cu yd" />
                <ResultRow label="Rock Weight" value={fmt(result.totalRockTons, 1)} unit="tons" />
            </div>
        </div>
    );
}

/* ──────────── 40. POST HOLE CALCULATOR ──────────── */
function PostHoleCalc() {
    const [holeDiameter, setHoleDiameter] = useState(10);
    const [holeDepth, setHoleDepth] = useState(36);
    const [postDiameter, setPostDiameter] = useState(4);
    const [numHoles, setNumHoles] = useState(10);

    const result = useMemo(() => {
        const holeRadiusFt = (holeDiameter / 2) / 12;
        const postRadiusFt = (postDiameter / 2) / 12;
        const depthFt = holeDepth / 12;
        const holeVolCuFt = Math.PI * holeRadiusFt * holeRadiusFt * depthFt;
        const postVolCuFt = Math.PI * postRadiusFt * postRadiusFt * depthFt;
        const concretePerHole = holeVolCuFt - postVolCuFt;
        const totalConcreteCuFt = concretePerHole * numHoles;
        const totalCuYd = totalConcreteCuFt / 27;
        const bags60 = totalConcreteCuFt / 0.45;
        const bags80 = totalConcreteCuFt / 0.6;
        return { concretePerHole, totalConcreteCuFt, totalCuYd, bags60, bags80 };
    }, [holeDiameter, holeDepth, postDiameter, numHoles]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🕳️ Post Hole Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Hole Diameter" value={holeDiameter} onChange={setHoleDiameter} unit="in" min={6} max={24} />
                <InputField label="Hole Depth" value={holeDepth} onChange={setHoleDepth} unit="in" min={12} max={60} />
                <InputField label="Post Size" value={postDiameter} onChange={setPostDiameter} unit="in" min={2} max={8} />
                <InputField label="Number of Holes" value={numHoles} onChange={setNumHoles} min={1} max={200} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Concrete per Hole" value={fmt(result.concretePerHole, 2)} unit="cu ft" />
                <ResultRow label="Total Concrete" value={fmt(result.totalConcreteCuFt)} unit="cu ft" />
                <ResultRow label="Total Concrete" value={fmt(result.totalCuYd, 2)} unit="cu yd" />
                <ResultRow label="60 lb Bags" value={fmtInt(result.bags60)} unit="bags" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 41. MORTAR CALCULATOR ──────────── */
function MortarCalc() {
    const [wallArea, setWallArea] = useState(100);
    const [jointThickness, setJointThickness] = useState(0.375);
    const [unitType, setUnitType] = useState("standard-brick");

    const COVERAGE: Record<string, number> = {
        "standard-brick": 7, "queen-brick": 5.5, "cmu-8": 3.5, "stone": 10,
    };

    const result = useMemo(() => {
        const cuFtPerSqFt = (COVERAGE[unitType] || 7) * jointThickness / 144;
        const totalCuFt = wallArea * cuFtPerSqFt;
        const bags60lb = totalCuFt / 0.5;  // 60 lb bag ≈ 0.5 cu ft
        const bags80lb = totalCuFt / 0.6;
        const portlandBags = totalCuFt / 4; // 1:3 mix ratio
        const sandCuFt = totalCuFt * 0.75;
        return { totalCuFt, bags60lb, bags80lb, portlandBags, sandCuFt };
    }, [wallArea, jointThickness, unitType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Mortar Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Area" value={wallArea} onChange={setWallArea} unit="sq ft" min={1} />
                <SelectField label="Masonry Unit" value={unitType} onChange={setUnitType} options={[
                    { value: "standard-brick", label: "Standard Brick" },
                    { value: "queen-brick", label: "Queen Brick" },
                    { value: "cmu-8", label: "8\" CMU Block" },
                    { value: "stone", label: "Natural Stone" },
                ]} />
                <InputField label="Joint Thickness" value={jointThickness} onChange={setJointThickness} unit="in" min={0.25} max={0.75} step={0.0625} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Mortar Volume" value={fmt(result.totalCuFt, 1)} unit="cu ft" />
                <ResultRow label="60 lb Pre-Mix Bags" value={fmtInt(result.bags60lb)} unit="bags" />
                <ResultRow label="80 lb Pre-Mix Bags" value={fmtInt(result.bags80lb)} unit="bags" />
                <ResultRow label="Portland Cement" value={fmt(result.portlandBags, 1)} unit="bags" />
                <ResultRow label="Mason Sand" value={fmt(result.sandCuFt, 1)} unit="cu ft" />
            </div>
        </div>
    );
}

/* ──────────── 42. CONCRETE FOOTING CALCULATOR ──────────── */
function ConcreteFootingCalc() {
    const [length, setLength] = useState(40);
    const [width, setWidth] = useState(16);
    const [depth, setDepth] = useState(8);

    const result = useMemo(() => {
        const widthFt = width / 12;
        const depthFt = depth / 12;
        const cuFt = length * widthFt * depthFt;
        const cuYd = cuFt / 27;
        const bags60 = cuFt / 0.45;
        const bags80 = cuFt / 0.6;
        return { cuFt, cuYd, bags60, bags80 };
    }, [length, width, depth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Concrete Footing Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Footing Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Footing Width" value={width} onChange={setWidth} unit="in" min={6} max={48} />
                <InputField label="Footing Depth" value={depth} onChange={setDepth} unit="in" min={4} max={24} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="60 lb Bags" value={fmtInt(result.bags60)} unit="bags" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 43. LANDSCAPE ROCK CALCULATOR ──────────── */
function LandscapeRockCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(3);
    const [rockType, setRockType] = useState("river-rock");
    const [pricePerTon, setPricePerTon] = useState(50);

    const DENSITY: Record<string, number> = {
        "river-rock": 1.3, "lava-rock": 0.5, "pea-gravel": 1.4,
        "flagstone": 1.5, "boulders": 1.5, "decomposed-granite": 1.4,
    };

    const result = useMemo(() => {
        const depthFt = depth / 12;
        const cuFt = length * width * depthFt;
        const cuYd = cuFt / 27;
        const tons = cuYd * (DENSITY[rockType] || 1.4);
        const cost = tons * pricePerTon;
        return { cuFt, cuYd, tons, cost };
    }, [length, width, depth, rockType, pricePerTon]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Landscape Rock Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.5} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.5} step={0.5} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit="in" min={1} max={12} />
                <SelectField label="Rock Type" value={rockType} onChange={setRockType} options={[
                    { value: "river-rock", label: "River Rock" },
                    { value: "lava-rock", label: "Lava Rock" },
                    { value: "pea-gravel", label: "Pea Gravel" },
                    { value: "flagstone", label: "Flagstone" },
                    { value: "boulders", label: "Boulders" },
                    { value: "decomposed-granite", label: "Decomposed Granite" },
                ]} />
                <InputField label="Price per Ton" value={pricePerTon} onChange={setPricePerTon} unit="$" min={0} step={10} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 1)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 44. ROOF TRUSS CALCULATOR ──────────── */
function RoofTrussCalc() {
    const [buildingLength, setBuildingLength] = useState(30);
    const [spacing, setSpacing] = useState(24);
    const [buildingWidth, setBuildingWidth] = useState(24);
    const [pitch, setPitch] = useState(6);

    const result = useMemo(() => {
        const spacingFt = spacing / 12;
        const numTrusses = spacingFt > 0 ? Math.ceil(buildingLength / spacingFt) + 1 : 0;
        const rise = (buildingWidth / 2) * (pitch / 12);
        const rafterLength = Math.sqrt(Math.pow(buildingWidth / 2, 2) + Math.pow(rise, 2));
        const trussBoardFt = (rafterLength * 2 + buildingWidth) * 0.5; // rough 2× lumber per truss
        const totalBoardFt = numTrusses * trussBoardFt;
        return { numTrusses, rise, rafterLength, trussBoardFt, totalBoardFt };
    }, [buildingLength, spacing, buildingWidth, pitch]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Roof Truss Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Building Length" value={buildingLength} onChange={setBuildingLength} unit="ft" min={8} />
                <InputField label="Building Width (Span)" value={buildingWidth} onChange={setBuildingWidth} unit="ft" min={8} />
                <InputField label="Truss Spacing" value={spacing} onChange={setSpacing} unit="in OC" min={16} max={48} />
                <InputField label="Roof Pitch" value={pitch} onChange={setPitch} unit="/12" min={2} max={12} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Number of Trusses" value={fmtInt(result.numTrusses)} unit="trusses" />
                <ResultRow label="Roof Rise" value={fmt(result.rise, 1)} unit="ft" />
                <ResultRow label="Rafter Length" value={fmt(result.rafterLength, 1)} unit="ft" />
                <ResultRow label="Lumber per Truss" value={fmtInt(result.trussBoardFt)} unit="bd ft" />
                <ResultRow label="Total Lumber (est.)" value={fmtInt(result.totalBoardFt)} unit="bd ft" />
            </div>
        </div>
    );
}

/* ──────────── 45. WAINSCOTING CALCULATOR ──────────── */
function WainscotingCalc() {
    const [roomLength, setRoomLength] = useState(12);
    const [roomWidth, setRoomWidth] = useState(10);
    const [wainscotHeight, setWainscotHeight] = useState(36);
    const [doors, setDoors] = useState(1);
    const [panelWidth, setPanelWidth] = useState(48);

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const doorWidthFt = doors * 3;
        const coverableLength = perimeter - doorWidthFt;
        const heightFt = wainscotHeight / 12;
        const area = coverableLength * heightFt;
        const panelWidthFt = panelWidth / 12;
        const panels = panelWidthFt > 0 ? Math.ceil(coverableLength / panelWidthFt) : 0;
        const topRail = coverableLength;
        const chairRail = coverableLength;
        const baseboard = coverableLength;
        return { perimeter, coverableLength, area, panels, topRail, chairRail, baseboard };
    }, [roomLength, roomWidth, wainscotHeight, doors, panelWidth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Wainscoting Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Wainscot Height" value={wainscotHeight} onChange={setWainscotHeight} unit="in" min={24} max={60} />
                <InputField label="Doors to Exclude" value={doors} onChange={setDoors} min={0} />
                <InputField label="Panel Width" value={panelWidth} onChange={setPanelWidth} unit="in" min={12} max={96} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Coverable Length" value={fmt(result.coverableLength)} unit="ft" />
                <ResultRow label="Wainscot Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Panels Needed" value={fmtInt(result.panels)} unit="panels" />
                <ResultRow label="Chair Rail" value={fmt(result.chairRail)} unit="lin ft" />
                <ResultRow label="Baseboard" value={fmt(result.baseboard)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 46. GRADING CALCULATOR ──────────── */
function GradingCalc() {
    const [length, setLength] = useState(50);
    const [width, setWidth] = useState(50);
    const [cutDepth, setCutDepth] = useState(6);
    const [fillDepth, setFillDepth] = useState(0);
    const [depthUnit, setDepthUnit] = useState("inches");

    const result = useMemo(() => {
        const cutFt = depthUnit === "inches" ? cutDepth / 12 : cutDepth;
        const fillFt = depthUnit === "inches" ? fillDepth / 12 : fillDepth;
        const area = length * width;
        const cutCuFt = area * cutFt;
        const fillCuFt = area * fillFt;
        const cutCuYd = cutCuFt / 27;
        const fillCuYd = fillCuFt / 27;
        const netCuYd = cutCuYd - fillCuYd;
        const haul = netCuYd > 0 ? netCuYd / 14 : 0;
        const importLoads = netCuYd < 0 ? Math.abs(netCuYd) / 14 : 0;
        return { area, cutCuYd, fillCuYd, netCuYd, haul, importLoads };
    }, [length, width, cutDepth, fillDepth, depthUnit]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🚜 Grading Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Area Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Area Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
                <InputField label="Cut Depth (remove)" value={cutDepth} onChange={setCutDepth} unit={depthUnit} min={0} step={0.5} />
                <InputField label="Fill Depth (add)" value={fillDepth} onChange={setFillDepth} unit={depthUnit} min={0} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Site Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Cut Volume" value={fmt(result.cutCuYd, 1)} unit="cu yd" />
                <ResultRow label="Fill Volume" value={fmt(result.fillCuYd, 1)} unit="cu yd" />
                <ResultRow label="Net Earthwork" value={fmt(Math.abs(result.netCuYd), 1)} unit={`cu yd ${result.netCuYd >= 0 ? "(export)" : "(import)"}`} />
                {result.haul > 0 && <ResultRow label="Haul-away Loads" value={fmt(result.haul, 1)} unit="loads" />}
                {result.importLoads > 0 && <ResultRow label="Import Loads" value={fmt(result.importLoads, 1)} unit="loads" />}
            </div>
        </div>
    );
}

/* ──────────── 47. STUCCO CALCULATOR ──────────── */
function StuccoCalc() {
    const [wallLength, setWallLength] = useState(40);
    const [wallHeight, setWallHeight] = useState(9);
    const [walls, setWalls] = useState(4);
    const [doors, setDoors] = useState(2);
    const [windows, setWindows] = useState(8);
    const [coats, setCoats] = useState(3);

    const result = useMemo(() => {
        const grossArea = wallLength * wallHeight * walls;
        const openingsArea = (doors * 21) + (windows * 15);
        const netArea = grossArea - openingsArea;
        const lathSheets = Math.ceil(netArea / 27); // 2.5×10.5 ft sheets ≈ 27 sq ft
        const stuccoMixBags80 = Math.ceil((netArea * coats) / 25); // ~25 sq ft per 80lb bag per coat
        const scratchCoat = Math.ceil(netArea / 100); // bags for scratch coat
        return { grossArea, openingsArea, netArea, lathSheets, stuccoMixBags80, scratchCoat };
    }, [wallLength, wallHeight, walls, doors, windows, coats]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏘️ Stucco Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Avg Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Number of Walls" value={walls} onChange={setWalls} min={1} max={10} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
                <SelectField label="Number of Coats" value={String(coats)} onChange={(v) => setCoats(Number(v))} options={[
                    { value: "2", label: "2 Coats" },
                    { value: "3", label: "3 Coats (standard)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Gross Wall Area" value={fmt(result.grossArea)} unit="sq ft" />
                <ResultRow label="Net Stucco Area" value={fmt(result.netArea)} unit="sq ft" />
                <ResultRow label="Metal Lath Sheets" value={fmtInt(result.lathSheets)} unit="sheets" />
                <ResultRow label="Stucco Mix (80 lb)" value={fmtInt(result.stuccoMixBags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 48. RAIN BARREL CALCULATOR ──────────── */
function RainBarrelCalc() {
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(40);
    const [rainfall, setRainfall] = useState(1);
    const [efficiency, setEfficiency] = useState(80);
    const [barrelSize, setBarrelSize] = useState(55);

    const result = useMemo(() => {
        const roofArea = roofLength * roofWidth;
        const gallonsPerInch = roofArea * 0.623; // 1 sq ft × 1 inch rain = 0.623 gallons
        const collectible = gallonsPerInch * rainfall * (efficiency / 100);
        const barrels = barrelSize > 0 ? Math.ceil(collectible / barrelSize) : 0;
        const annualGallons = collectible * 12; // rough annual estimate
        return { roofArea, gallonsPerInch, collectible, barrels, annualGallons };
    }, [roofLength, roofWidth, rainfall, efficiency, barrelSize]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌧️ Rain Barrel Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length" value={roofLength} onChange={setRoofLength} unit="ft" min={5} />
                <InputField label="Roof Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={5} />
                <InputField label="Rainfall per Storm" value={rainfall} onChange={setRainfall} unit="in" min={0.25} max={6} step={0.25} />
                <InputField label="Collection Efficiency" value={efficiency} onChange={setEfficiency} unit="%" min={50} max={95} step={5} />
                <InputField label="Barrel Size" value={barrelSize} onChange={setBarrelSize} unit="gal" min={20} max={100} step={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Roof Area" value={fmt(result.roofArea)} unit="sq ft" />
                <ResultRow label={`Gallons per 1\u2033 Rain`} value={fmtInt(result.gallonsPerInch)} unit="gal" />
                <ResultRow label="Collectible per Storm" value={fmtInt(result.collectible)} unit="gal" />
                <ResultRow label="Barrels Needed" value={fmtInt(result.barrels)} unit="barrels" />
            </div>
        </div>
    );
}

/* ──────────── 49. CONCRETE CURB CALCULATOR ──────────── */
function ConcreteCurbCalc() {
    const [curbLength, setCurbLength] = useState(50);
    const [curbHeight, setCurbHeight] = useState(6);
    const [curbWidth, setCurbWidth] = useState(6);

    const result = useMemo(() => {
        const heightFt = curbHeight / 12;
        const widthFt = curbWidth / 12;
        const cuFt = curbLength * heightFt * widthFt;
        const cuYd = cuFt / 27;
        const bags60 = cuFt / 0.45;
        const bags80 = cuFt / 0.6;
        return { cuFt, cuYd, bags60, bags80 };
    }, [curbLength, curbHeight, curbWidth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🛤️ Concrete Curb Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Curb Length" value={curbLength} onChange={setCurbLength} unit="ft" min={1} />
                <InputField label="Curb Height" value={curbHeight} onChange={setCurbHeight} unit="in" min={4} max={18} />
                <InputField label="Curb Width" value={curbWidth} onChange={setCurbWidth} unit="in" min={4} max={12} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt, 1)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="60 lb Bags" value={fmtInt(result.bags60)} unit="bags" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 50. WIRE MESH CALCULATOR ──────────── */
function WireMeshCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(20);
    const [overlap, setOverlap] = useState(6);
    const [meshType, setMeshType] = useState("6x6-W1.4");

    const result = useMemo(() => {
        const area = length * width;
        const sheetW = 5; // standard 5 ft wide
        const sheetL = 10; // standard 10 ft long
        const overlapFt = overlap / 12;
        const effectiveW = sheetW - overlapFt;
        const effectiveL = sheetL - overlapFt;
        const sheetsWide = effectiveW > 0 ? Math.ceil(width / effectiveW) : 0;
        const sheetsLong = effectiveL > 0 ? Math.ceil(length / effectiveL) : 0;
        const totalSheets = sheetsWide * sheetsLong;
        const tieWires = totalSheets * 8; // ~8 ties per sheet
        return { area, totalSheets, sheetsWide, sheetsLong, tieWires };
    }, [length, width, overlap, meshType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔗 Wire Mesh Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Slab Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Slab Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Overlap" value={overlap} onChange={setOverlap} unit="in" min={4} max={12} />
                <SelectField label="Mesh Type" value={meshType} onChange={setMeshType} options={[
                    { value: "6x6-W1.4", label: "6×6 W1.4/W1.4 (10 ga)" },
                    { value: "6x6-W2.9", label: "6×6 W2.9/W2.9 (6 ga)" },
                    { value: "4x4-W1.4", label: "4×4 W1.4/W1.4 (10 ga)" },
                    { value: "4x4-W2.9", label: "4×4 W2.9/W2.9 (6 ga)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Slab Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Sheets (5×10 ft)" value={fmtInt(result.totalSheets)} unit="sheets" />
                <ResultRow label="Sheets Wide" value={fmtInt(result.sheetsWide)} unit="sheets" />
                <ResultRow label="Sheets Long" value={fmtInt(result.sheetsLong)} unit="sheets" />
                <ResultRow label="Tie Wires" value={fmtInt(result.tieWires)} unit="ties" />
            </div>
        </div>
    );
}



/* ──────────── 51. LINTEL CALCULATOR ──────────── */
function LintelCalc() {
    const [span, setSpan] = useState(36);
    const [wallThickness, setWallThickness] = useState(8);
    const [loadType, setLoadType] = useState("light");
    const [quantity, setQuantity] = useState(4);

    const DEPTH_FACTOR: Record<string, number> = {
        "light": 1, "medium": 1.25, "heavy": 1.5,
    };

    const result = useMemo(() => {
        const spanFt = span / 12;
        const minDepth = Math.max(span / 8, 4) * (DEPTH_FACTOR[loadType] || 1);
        const depthIn = Math.ceil(minDepth);
        const volEachCuIn = span * wallThickness * depthIn;
        const volEachCuFt = volEachCuIn / 1728;
        const totalCuFt = volEachCuFt * quantity;
        const totalCuYd = totalCuFt / 27;
        const bags80 = totalCuFt / 0.6;
        const bearing = Math.max(span * 0.5, 4);
        return { depthIn, volEachCuFt, totalCuFt, totalCuYd, bags80, bearing };
    }, [span, wallThickness, loadType, quantity]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Lintel Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Opening Span" value={span} onChange={setSpan} unit="in" min={12} max={240} />
                <InputField label="Wall Thickness" value={wallThickness} onChange={setWallThickness} unit="in" min={4} max={16} />
                <SelectField label="Load Type" value={loadType} onChange={setLoadType} options={[
                    { value: "light", label: "Light (non-load-bearing)" },
                    { value: "medium", label: "Medium (1 floor above)" },
                    { value: "heavy", label: "Heavy (2+ floors above)" },
                ]} />
                <InputField label="Number of Lintels" value={quantity} onChange={setQuantity} min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Min Lintel Depth" value={fmtInt(result.depthIn)} unit="in" />
                <ResultRow label="Min Bearing (each end)" value={fmt(result.bearing)} unit="in" />
                <ResultRow label="Concrete per Lintel" value={fmt(result.volEachCuFt, 2)} unit="cu ft" />
                <ResultRow label="Total Concrete" value={fmt(result.totalCuFt, 1)} unit="cu ft" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 52. CONCRETE SLAB CALCULATOR ──────────── */
function ConcreteSlabCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(12);
    const [thickness, setThickness] = useState(4);
    const [pricePerYd, setPricePerYd] = useState(130);

    const result = useMemo(() => {
        const thickFt = thickness / 12;
        const cuFt = length * width * thickFt;
        const cuYd = cuFt / 27;
        const cuYdWithWaste = cuYd * 1.1;
        const bags60 = cuFt / 0.45;
        const bags80 = cuFt / 0.6;
        const readyMixCost = cuYdWithWaste * pricePerYd;
        return { cuFt, cuYd, cuYdWithWaste, bags60, bags80, readyMixCost };
    }, [length, width, thickness, pricePerYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⬜ Concrete Slab Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={2} max={12} />
                <InputField label="Ready-Mix Price" value={pricePerYd} onChange={setPricePerYd} unit="$/yd" min={0} step={10} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Order (+10% waste)" value={fmt(result.cuYdWithWaste, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
                <ResultRow label="Ready-Mix Cost" value={`$${fmt(result.readyMixCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 53. ROOF DECKING CALCULATOR ──────────── */
function RoofDeckingCalc() {
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(24);
    const [pitch, setPitch] = useState(6);
    const [waste, setWaste] = useState(10);

    const result = useMemo(() => {
        const flatArea = roofLength * roofWidth;
        const pitchMultiplier = Math.sqrt(1 + Math.pow(pitch / 12, 2));
        const actualArea = flatArea * pitchMultiplier;
        const totalWithWaste = actualArea * (1 + waste / 100);
        const sheets4x8 = Math.ceil(totalWithWaste / 32);
        return { flatArea, actualArea, totalWithWaste, sheets4x8, pitchMultiplier };
    }, [roofLength, roofWidth, pitch, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Roof Decking Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length" value={roofLength} onChange={setRoofLength} unit="ft" min={5} />
                <InputField label="Building Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={5} />
                <InputField label="Roof Pitch" value={pitch} onChange={setPitch} unit="/12" min={0} max={12} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Flat Area" value={fmt(result.flatArea)} unit="sq ft" />
                <ResultRow label="Pitch Multiplier" value={fmt(result.pitchMultiplier, 3)} />
                <ResultRow label="Actual Roof Area" value={fmt(result.actualArea)} unit="sq ft" />
                <ResultRow label="Total (+ waste)" value={fmt(result.totalWithWaste)} unit="sq ft" />
                <ResultRow label="4x8 Sheets" value={fmtInt(result.sheets4x8)} unit="sheets" />
            </div>
        </div>
    );
}

/* ──────────── 54. VAPOR BARRIER CALCULATOR ──────────── */
function VaporBarrierCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(15);
    const [overlap, setOverlap] = useState(12);
    const [rollWidth, setRollWidth] = useState(10);
    const [rollLength, setRollLength] = useState(100);

    const result = useMemo(() => {
        const area = length * width;
        const overlapFt = overlap / 12;
        const effectiveRollW = rollWidth - overlapFt;
        const strips = effectiveRollW > 0 ? Math.ceil(width / effectiveRollW) : 0;
        const materialLength = strips * length;
        const rolls = rollLength > 0 ? Math.ceil(materialLength / rollLength) : 0;
        const seamTapeFt = (strips - 1) * length;
        return { area, strips, materialLength, rolls, seamTapeFt };
    }, [length, width, overlap, rollWidth, rollLength]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🛡️ Vapor Barrier Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Area Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Area Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Overlap" value={overlap} onChange={setOverlap} unit="in" min={6} max={24} />
                <InputField label="Roll Width" value={rollWidth} onChange={setRollWidth} unit="ft" min={4} max={20} />
                <InputField label="Roll Length" value={rollLength} onChange={setRollLength} unit="ft" min={50} max={200} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Floor Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Strips Needed" value={fmtInt(result.strips)} unit="strips" />
                <ResultRow label="Rolls Needed" value={fmtInt(result.rolls)} unit="rolls" />
                <ResultRow label="Seam Tape" value={fmt(result.seamTapeFt)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 55. EXCAVATION CALCULATOR ──────────── */
function ExcavationCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(15);
    const [depth, setDepth] = useState(4);
    const [soilType, setSoilType] = useState("common");

    const SWELL: Record<string, number> = {
        "common": 1.25, "clay": 1.35, "sand": 1.10, "rock": 1.50, "topsoil": 1.20,
    };

    const result = useMemo(() => {
        const cuFt = length * width * depth;
        const bankCuYd = cuFt / 27;
        const swellFactor = SWELL[soilType] || 1.25;
        const looseCuYd = bankCuYd * swellFactor;
        const truckLoads = looseCuYd / 14;
        return { cuFt, bankCuYd, swellFactor, looseCuYd, truckLoads };
    }, [length, width, depth, soilType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⛏️ Excavation Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit="ft" min={0.5} step={0.5} />
                <SelectField label="Soil Type" value={soilType} onChange={setSoilType} options={[
                    { value: "common", label: "Common Earth" },
                    { value: "clay", label: "Clay" },
                    { value: "sand", label: "Sand / Gravel" },
                    { value: "rock", label: "Rock" },
                    { value: "topsoil", label: "Topsoil" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Bank Volume" value={fmt(result.bankCuYd, 1)} unit="cu yd" />
                <ResultRow label="Swell Factor" value={`×${fmt(result.swellFactor, 2)}`} />
                <ResultRow label="Loose Volume" value={fmt(result.looseCuYd, 1)} unit="cu yd" />
                <ResultRow label="Truck Loads (14 yd)" value={fmt(result.truckLoads, 1)} unit="loads" />
            </div>
        </div>
    );
}

/* ──────────── 56. CROWN MOLDING CALCULATOR ──────────── */
function CrownMoldingCalc() {
    const [roomLength, setRoomLength] = useState(14);
    const [roomWidth, setRoomWidth] = useState(12);
    const [moldingPieceLength, setMoldingPieceLength] = useState(8);
    const [waste, setWaste] = useState(10);

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const withWaste = perimeter * (1 + waste / 100);
        const pieces = moldingPieceLength > 0 ? Math.ceil(withWaste / moldingPieceLength) : 0;
        const insideCorners = 4;
        const outsideCorners = 0;
        return { perimeter, withWaste, pieces, insideCorners, outsideCorners };
    }, [roomLength, roomWidth, moldingPieceLength, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">👑 Crown Molding Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Piece Length" value={moldingPieceLength} onChange={setMoldingPieceLength} unit="ft" min={4} max={16} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Room Perimeter" value={fmt(result.perimeter)} unit="lin ft" />
                <ResultRow label="Total (+ waste)" value={fmt(result.withWaste)} unit="lin ft" />
                <ResultRow label="Pieces Needed" value={fmtInt(result.pieces)} unit="pieces" />
                <ResultRow label="Inside Corners" value={fmtInt(result.insideCorners)} unit="cuts" />
            </div>
        </div>
    );
}

/* ──────────── 57. SOFFIT CALCULATOR ──────────── */
function SoffitCalc() {
    const [perimeter, setPerimeter] = useState(120);
    const [overhangWidth, setOverhangWidth] = useState(12);
    const [panelWidth, setPanelWidth] = useState(12);

    const result = useMemo(() => {
        const overhangFt = overhangWidth / 12;
        const soffitArea = perimeter * overhangFt;
        const panelWidthFt = panelWidth / 12;
        const panels = panelWidthFt > 0 ? Math.ceil(soffitArea / (panelWidthFt * 12)) : 0; // 12 ft long panels
        const jChannel = perimeter * 2; // both inside and outside edge
        const fasciaLinFt = perimeter;
        const fBlocks = Math.ceil(perimeter / 16); // F-channel every 16 inches
        return { soffitArea, panels, jChannel, fasciaLinFt };
    }, [perimeter, overhangWidth, panelWidth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Soffit Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="House Perimeter" value={perimeter} onChange={setPerimeter} unit="ft" min={10} />
                <InputField label="Overhang Width" value={overhangWidth} onChange={setOverhangWidth} unit="in" min={4} max={36} />
                <InputField label="Panel Width" value={panelWidth} onChange={setPanelWidth} unit="in" min={8} max={16} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Soffit Area" value={fmt(result.soffitArea)} unit="sq ft" />
                <ResultRow label="Soffit Panels (12 ft)" value={fmtInt(result.panels)} unit="panels" />
                <ResultRow label="J-Channel" value={fmt(result.jChannel)} unit="lin ft" />
                <ResultRow label="Fascia" value={fmt(result.fasciaLinFt)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 58. RIP RAP CALCULATOR ──────────── */
function RipRapCalc() {
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(10);
    const [thickness, setThickness] = useState(12);
    const [pricePerTon, setPricePerTon] = useState(40);

    const result = useMemo(() => {
        const thickFt = thickness / 12;
        const cuFt = length * width * thickFt;
        const cuYd = cuFt / 27;
        const tons = cuYd * 1.5; // rip rap density ~1.5 tons/cu yd
        const cost = tons * pricePerTon;
        return { cuFt, cuYd, tons, cost };
    }, [length, width, thickness, pricePerTon]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Rip Rap Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Area Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Area Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={6} max={36} />
                <InputField label="Price per Ton" value={pricePerTon} onChange={setPricePerTon} unit="$" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 1)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 59. BASEBOARD CALCULATOR ──────────── */
function BaseboardCalc() {
    const [roomLength, setRoomLength] = useState(14);
    const [roomWidth, setRoomWidth] = useState(12);
    const [doors, setDoors] = useState(2);
    const [pieceLength, setPieceLength] = useState(8);
    const [waste, setWaste] = useState(10);

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const doorWidth = doors * 3;
        const netLength = perimeter - doorWidth;
        const withWaste = netLength * (1 + waste / 100);
        const pieces = pieceLength > 0 ? Math.ceil(withWaste / pieceLength) : 0;
        const insideCorners = 4 - doors; // reduced by door positions
        const outsideCorners = 0;
        return { perimeter, netLength, withWaste, pieces, insideCorners };
    }, [roomLength, roomWidth, doors, pieceLength, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Baseboard Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} max={6} />
                <InputField label="Piece Length" value={pieceLength} onChange={setPieceLength} unit="ft" min={4} max={16} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Net Length" value={fmt(result.netLength)} unit="lin ft" />
                <ResultRow label="Total (+ waste)" value={fmt(result.withWaste)} unit="lin ft" />
                <ResultRow label="Pieces Needed" value={fmtInt(result.pieces)} unit="pieces" />
                <ResultRow label="Inside Corners" value={fmtInt(Math.max(result.insideCorners, 0))} unit="cuts" />
            </div>
        </div>
    );
}

/* ──────────── 60. CONCRETE WALL CALCULATOR ──────────── */
function ConcreteWallCalc() {
    const [wallLength, setWallLength] = useState(40);
    const [wallHeight, setWallHeight] = useState(8);
    const [wallThickness, setWallThickness] = useState(8);

    const result = useMemo(() => {
        const thickFt = wallThickness / 12;
        const cuFt = wallLength * wallHeight * thickFt;
        const cuYd = cuFt / 27;
        const cuYdWithWaste = cuYd * 1.05;
        const bags80 = cuFt / 0.6;
        return { cuFt, cuYd, cuYdWithWaste, bags80 };
    }, [wallLength, wallHeight, wallThickness]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Concrete Wall Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Wall Thickness" value={wallThickness} onChange={setWallThickness} unit="in" min={4} max={16} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Order (+5% waste)" value={fmt(result.cuYdWithWaste, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 61. FRENCH DRAIN CALCULATOR ──────────── */
function FrenchDrainCalc() {
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(12);
    const [depth, setDepth] = useState(18);
    const [pipeSize, setPipeSize] = useState(4);

    const result = useMemo(() => {
        const widthFt = width / 12;
        const depthFt = depth / 12;
        const trenchCuFt = length * widthFt * depthFt;
        const pipeCuFt = length * Math.PI * Math.pow(pipeSize / 24, 2);
        const gravelCuFt = trenchCuFt - pipeCuFt;
        const gravelCuYd = gravelCuFt / 27;
        const gravelTons = gravelCuYd * 1.4;
        const fabricSqFt = length * (widthFt + 2 * depthFt + 1);
        return { trenchCuFt, gravelCuYd, gravelTons, fabricSqFt, pipeLenFt: length };
    }, [length, width, depth, pipeSize]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🚰 French Drain Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Drain Length" value={length} onChange={setLength} unit="ft" min={5} />
                <InputField label="Trench Width" value={width} onChange={setWidth} unit="in" min={6} max={24} />
                <InputField label="Trench Depth" value={depth} onChange={setDepth} unit="in" min={12} max={36} />
                <SelectField label="Pipe Diameter" value={String(pipeSize)} onChange={(v) => setPipeSize(Number(v))} options={[
                    { value: "3", label: '3" Perforated' },
                    { value: "4", label: '4" Perforated' },
                    { value: "6", label: '6" Perforated' },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Gravel Needed" value={fmt(result.gravelCuYd, 1)} unit="cu yd" />
                <ResultRow label="Gravel Weight" value={fmt(result.gravelTons, 1)} unit="tons" />
                <ResultRow label="Perforated Pipe" value={fmt(result.pipeLenFt)} unit="lin ft" />
                <ResultRow label="Filter Fabric" value={fmt(result.fabricSqFt)} unit="sq ft" />
            </div>
        </div>
    );
}

/* ──────────── 62. CONCRETE PIER CALCULATOR ──────────── */
function ConcretePierCalc() {
    const [diameter, setDiameter] = useState(12);
    const [depthIn, setDepthIn] = useState(48);
    const [quantity, setQuantity] = useState(6);

    const result = useMemo(() => {
        const radiusFt = diameter / 24;
        const depthFt = depthIn / 12;
        const volEach = Math.PI * Math.pow(radiusFt, 2) * depthFt;
        const totalCuFt = volEach * quantity;
        const totalCuYd = totalCuFt / 27;
        const bags80 = totalCuFt / 0.6;
        return { volEach, totalCuFt, totalCuYd, bags80 };
    }, [diameter, depthIn, quantity]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Concrete Pier Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Pier Diameter" value={diameter} onChange={setDiameter} unit="in" min={6} max={36} />
                <InputField label="Pier Depth" value={depthIn} onChange={setDepthIn} unit="in" min={12} max={96} />
                <InputField label="Number of Piers" value={quantity} onChange={setQuantity} min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume per Pier" value={fmt(result.volEach, 2)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuFt, 1)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuYd, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 63. HOUSE WRAP CALCULATOR ──────────── */
function HouseWrapCalc() {
    const [avgWallLen, setAvgWallLen] = useState(40);
    const [wallHeight, setWallHeight] = useState(9);
    const [walls, setWalls] = useState(4);
    const [doors, setDoors] = useState(2);
    const [windows, setWindows] = useState(8);

    const result = useMemo(() => {
        const grossArea = avgWallLen * wallHeight * walls;
        const openings = (doors * 21) + (windows * 15);
        const netArea = grossArea - openings;
        const overlap = netArea * 0.1;
        const totalNeeded = netArea + overlap;
        const rolls = Math.ceil(totalNeeded / 1000); // standard roll: 9ft × 100ft = 900 sq ft, use 1000 for easy math
        return { grossArea, netArea, totalNeeded, rolls };
    }, [avgWallLen, wallHeight, walls, doors, windows]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 House Wrap Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Avg Wall Length" value={avgWallLen} onChange={setAvgWallLen} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Number of Walls" value={walls} onChange={setWalls} min={1} max={10} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Net Wall Area" value={fmt(result.netArea)} unit="sq ft" />
                <ResultRow label="Total (+10% overlap)" value={fmt(result.totalNeeded)} unit="sq ft" />
                <ResultRow label="Rolls (9×100 ft)" value={fmtInt(result.rolls)} unit="rolls" />
            </div>
        </div>
    );
}

/* ──────────── 64. STAIR RAILING CALCULATOR ──────────── */
function StairRailingCalc() {
    const [runLength, setRunLength] = useState(12);
    const [railHeight, setRailHeight] = useState(36);
    const [balusterSpacing, setBalusterSpacing] = useState(4);

    const result = useMemo(() => {
        const runLengthIn = runLength * 12;
        const numBalusters = balusterSpacing > 0 ? Math.ceil(runLengthIn / balusterSpacing) + 1 : 0;
        const posts = Math.ceil(runLength / 6) + 1; // post every 6 ft max
        const topRail = runLength;
        const bottomRail = runLength;
        return { numBalusters, posts, topRail, bottomRail };
    }, [runLength, railHeight, balusterSpacing]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪜 Stair Railing Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Railing Length" value={runLength} onChange={setRunLength} unit="ft" min={3} />
                <InputField label="Rail Height" value={railHeight} onChange={setRailHeight} unit="in" min={30} max={42} />
                <InputField label="Baluster Spacing" value={balusterSpacing} onChange={setBalusterSpacing} unit="in" min={2} max={6} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Balusters" value={fmtInt(result.numBalusters)} unit="pcs" />
                <ResultRow label="Posts" value={fmtInt(result.posts)} unit="pcs" />
                <ResultRow label="Top Rail" value={fmt(result.topRail)} unit="lin ft" />
                <ResultRow label="Bottom Rail" value={fmt(result.bottomRail)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 65. DROP CEILING CALCULATOR ──────────── */
function DropCeilingCalc() {
    const [roomLength, setRoomLength] = useState(14);
    const [roomWidth, setRoomWidth] = useState(12);
    const [tileSize, setTileSize] = useState("2x4");

    const TILE_AREA: Record<string, number> = { "2x2": 4, "2x4": 8 };

    const result = useMemo(() => {
        const area = roomLength * roomWidth;
        const perimeter = 2 * (roomLength + roomWidth);
        const tileArea = TILE_AREA[tileSize] || 8;
        const tiles = Math.ceil(area / tileArea);
        const mainRunners = Math.ceil(roomWidth / 4) * roomLength; // main runners every 4 ft
        const crossTees = tileSize === "2x4" ? Math.ceil(area / 8) : Math.ceil(area / 2);
        const wallAngle = perimeter;
        const hangWires = Math.ceil(area / 16); // wire every 4x4 ft
        return { area, tiles, mainRunners, crossTees, wallAngle, hangWires };
    }, [roomLength, roomWidth, tileSize]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔲 Drop Ceiling Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={4} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={4} />
                <SelectField label="Tile Size" value={tileSize} onChange={setTileSize} options={[
                    { value: "2x4", label: "2×4 ft Tiles" },
                    { value: "2x2", label: "2×2 ft Tiles" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Ceiling Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Tiles" value={fmtInt(result.tiles)} unit="tiles" />
                <ResultRow label="Main Runners" value={fmtInt(result.mainRunners)} unit="lin ft" />
                <ResultRow label="Wall Angle" value={fmt(result.wallAngle)} unit="lin ft" />
                <ResultRow label="Hang Wires" value={fmtInt(result.hangWires)} unit="pcs" />
            </div>
        </div>
    );
}

/* ──────────── 66. CONCRETE COLUMN CALCULATOR ──────────── */
function ConcreteColumnCalc() {
    const [widthIn, setWidthIn] = useState(12);
    const [depthIn, setDepthIn] = useState(12);
    const [heightFt, setHeightFt] = useState(10);
    const [quantity, setQuantity] = useState(4);
    const [shape, setShape] = useState("square");

    const result = useMemo(() => {
        let volEachCuFt: number;
        if (shape === "round") {
            const radiusFt = widthIn / 24;
            volEachCuFt = Math.PI * Math.pow(radiusFt, 2) * heightFt;
        } else {
            volEachCuFt = (widthIn / 12) * (depthIn / 12) * heightFt;
        }
        const totalCuFt = volEachCuFt * quantity;
        const totalCuYd = totalCuFt / 27;
        const bags80 = totalCuFt / 0.6;
        return { volEachCuFt, totalCuFt, totalCuYd, bags80 };
    }, [widthIn, depthIn, heightFt, quantity, shape]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏛️ Concrete Column Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "square", label: "Square / Rectangular" },
                    { value: "round", label: "Round" },
                ]} />
                <InputField label={shape === "round" ? "Diameter" : "Width"} value={widthIn} onChange={setWidthIn} unit="in" min={6} max={48} />
                {shape === "square" && <InputField label="Depth" value={depthIn} onChange={setDepthIn} unit="in" min={6} max={48} />}
                <InputField label="Height" value={heightFt} onChange={setHeightFt} unit="ft" min={2} max={30} />
                <InputField label="Quantity" value={quantity} onChange={setQuantity} min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume per Column" value={fmt(result.volEachCuFt, 2)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuFt, 1)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuYd, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 67. FLASHING CALCULATOR ──────────── */
function FlashingCalc() {
    const [valleyLen, setValleyLen] = useState(0);
    const [stepLen, setStepLen] = useState(0);
    const [chimneyPerimeter, setChimneyPerimeter] = useState(0);
    const [dripEdge, setDripEdge] = useState(0);
    const [flashingWidth, setFlashingWidth] = useState(8);

    const result = useMemo(() => {
        const totalLinFt = valleyLen + stepLen + chimneyPerimeter + dripEdge;
        const sqFt = totalLinFt * (flashingWidth / 12);
        const rolls10ft = Math.ceil(totalLinFt / 10);
        return { totalLinFt, sqFt, rolls10ft };
    }, [valleyLen, stepLen, chimneyPerimeter, dripEdge, flashingWidth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔩 Flashing Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Valley Runs" value={valleyLen} onChange={setValleyLen} unit="ft" min={0} />
                <InputField label="Step Flashing" value={stepLen} onChange={setStepLen} unit="ft" min={0} />
                <InputField label="Chimney Perimeter" value={chimneyPerimeter} onChange={setChimneyPerimeter} unit="ft" min={0} />
                <InputField label="Drip Edge" value={dripEdge} onChange={setDripEdge} unit="ft" min={0} />
                <InputField label="Flashing Width" value={flashingWidth} onChange={setFlashingWidth} unit="in" min={4} max={24} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Flashing" value={fmt(result.totalLinFt)} unit="lin ft" />
                <ResultRow label="Metal Area" value={fmt(result.sqFt, 1)} unit="sq ft" />
                <ResultRow label="10 ft Rolls" value={fmtInt(result.rolls10ft)} unit="rolls" />
            </div>
        </div>
    );
}

/* ──────────── 68. BALUSTER CALCULATOR ──────────── */
function BalusterCalc() {
    const [railLength, setRailLength] = useState(20);
    const [balusterWidth, setBalusterWidth] = useState(1.5);
    const [maxGap, setMaxGap] = useState(4);

    const result = useMemo(() => {
        const railLenIn = railLength * 12;
        const spacing = balusterWidth + maxGap;
        const balusters = spacing > 0 ? Math.ceil(railLenIn / spacing) + 1 : 0;
        const actualGap = balusters > 1 ? (railLenIn - balusters * balusterWidth) / (balusters - 1) : 0;
        return { balusters, actualGap, spacing };
    }, [railLength, balusterWidth, maxGap]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Baluster Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Railing Length" value={railLength} onChange={setRailLength} unit="ft" min={3} />
                <InputField label="Baluster Width" value={balusterWidth} onChange={setBalusterWidth} unit="in" min={0.75} max={3.5} step={0.25} />
                <InputField label="Max Gap (code)" value={maxGap} onChange={setMaxGap} unit="in" min={2} max={6} step={0.25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Balusters Needed" value={fmtInt(result.balusters)} unit="pcs" />
                <ResultRow label="Actual Gap" value={fmt(result.actualGap, 2)} unit="in" />
                <ResultRow label="On-Center Spacing" value={fmt(result.spacing, 2)} unit="in" />
            </div>
        </div>
    );
}

/* ──────────── 69. BACKSPLASH CALCULATOR ──────────── */
function BacksplashCalc() {
    const [length, setLength] = useState(10);
    const [height, setHeight] = useState(18);
    const [tileSize, setTileSize] = useState("3x6");
    const [waste, setWaste] = useState(10);

    const TILE_AREA: Record<string, number> = {
        "3x6": 0.125, "4x4": 0.111, "4x12": 0.333, "6x6": 0.25, "2x4": 0.056,
    };

    const result = useMemo(() => {
        const heightFt = height / 12;
        const area = length * heightFt;
        const areaWithWaste = area * (1 + waste / 100);
        const tileAreaSqFt = TILE_AREA[tileSize] || 0.125;
        const tiles = Math.ceil(areaWithWaste / tileAreaSqFt);
        const groutLbs = area * 0.5;
        const adhesiveSqFt = area;
        return { area, areaWithWaste, tiles, groutLbs, adhesiveSqFt };
    }, [length, height, tileSize, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪞 Backsplash Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Backsplash Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Backsplash Height" value={height} onChange={setHeight} unit="in" min={4} max={48} />
                <SelectField label="Tile Size" value={tileSize} onChange={setTileSize} options={[
                    { value: "3x6", label: '3×6" Subway' },
                    { value: "4x4", label: '4×4" Square' },
                    { value: "4x12", label: '4×12" Plank' },
                    { value: "6x6", label: '6×6" Square' },
                    { value: "2x4", label: '2×4" Mosaic' },
                ]} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Backsplash Area" value={fmt(result.area, 1)} unit="sq ft" />
                <ResultRow label="With Waste" value={fmt(result.areaWithWaste, 1)} unit="sq ft" />
                <ResultRow label="Tiles Needed" value={fmtInt(result.tiles)} unit="tiles" />
                <ResultRow label="Grout" value={fmt(result.groutLbs, 1)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 70. TRENCH FILL CALCULATOR ──────────── */
function TrenchFillCalc() {
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(12);
    const [depth, setDepth] = useState(24);
    const [fillType, setFillType] = useState("gravel");

    const DENSITY: Record<string, number> = {
        "gravel": 1.4, "sand": 1.3, "topsoil": 1.1, "crushed-stone": 1.4, "pea-gravel": 1.4,
    };

    const result = useMemo(() => {
        const widthFt = width / 12;
        const depthFt = depth / 12;
        const cuFt = length * widthFt * depthFt;
        const cuYd = cuFt / 27;
        const tons = cuYd * (DENSITY[fillType] || 1.4);
        return { cuFt, cuYd, tons };
    }, [length, width, depth, fillType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⛏️ Trench Fill Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Trench Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Trench Width" value={width} onChange={setWidth} unit="in" min={4} max={48} />
                <InputField label="Trench Depth" value={depth} onChange={setDepth} unit="in" min={6} max={60} />
                <SelectField label="Fill Material" value={fillType} onChange={setFillType} options={[
                    { value: "gravel", label: "Gravel" },
                    { value: "sand", label: "Sand" },
                    { value: "crushed-stone", label: "Crushed Stone" },
                    { value: "pea-gravel", label: "Pea Gravel" },
                    { value: "topsoil", label: "Topsoil / Dirt" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 1)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
            </div>
        </div>
    );
}

/* ──────────── 71. CONCRETE DRIVEWAY CALCULATOR ──────────── */
function ConcreteDrivewayCalc() {
    const [length, setLength] = useState(40);
    const [width, setWidth] = useState(12);
    const [thickness, setThickness] = useState(5);
    const [pricePerYd, setPricePerYd] = useState(130);

    const result = useMemo(() => {
        const thickFt = thickness / 12;
        const cuFt = length * width * thickFt;
        const cuYd = cuFt / 27;
        const cuYdWithWaste = cuYd * 1.1;
        const bags80 = cuFt / 0.6;
        const readyMixCost = cuYdWithWaste * pricePerYd;
        return { cuFt, cuYd, cuYdWithWaste, bags80, readyMixCost };
    }, [length, width, thickness, pricePerYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🚗 Concrete Driveway Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={10} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={8} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={4} max={8} />
                <InputField label="Ready-Mix Price" value={pricePerYd} onChange={setPricePerYd} unit="$/yd" min={0} step={10} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Order (+10% waste)" value={fmt(result.cuYdWithWaste, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
                <ResultRow label="Ready-Mix Cost" value={`$${fmt(result.readyMixCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 72. SHINGLE CALCULATOR ──────────── */
function ShingleCalc() {
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(24);
    const [pitch, setPitch] = useState(6);
    const [waste, setWaste] = useState(10);

    const result = useMemo(() => {
        const flatArea = roofLength * roofWidth;
        const pitchMultiplier = Math.sqrt(1 + Math.pow(pitch / 12, 2));
        const actualArea = flatArea * pitchMultiplier;
        const withWaste = actualArea * (1 + waste / 100);
        const squares = withWaste / 100;
        const bundles = Math.ceil(squares * 3);
        const nails = Math.ceil(withWaste * 4 / 250); // ~4 nails/shingle, 250 nails/lb
        return { flatArea, actualArea, withWaste, squares, bundles, nails };
    }, [roofLength, roofWidth, pitch, waste]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Shingle Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length" value={roofLength} onChange={setRoofLength} unit="ft" min={10} />
                <InputField label="Building Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={10} />
                <InputField label="Roof Pitch" value={pitch} onChange={setPitch} unit="/12" min={1} max={12} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Actual Roof Area" value={fmt(result.actualArea)} unit="sq ft" />
                <ResultRow label="Roofing Squares" value={fmt(result.squares, 1)} unit="squares" />
                <ResultRow label="Bundles (3-tab)" value={fmtInt(result.bundles)} unit="bundles" />
                <ResultRow label="Roofing Nails" value={fmtInt(result.nails)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 73. CAULK CALCULATOR ──────────── */
function CaulkCalc() {
    const [jointLength, setJointLength] = useState(50);
    const [jointWidth, setJointWidth] = useState(0.25);
    const [jointDepth, setJointDepth] = useState(0.25);

    const result = useMemo(() => {
        const jointLenIn = jointLength * 12;
        const volCuIn = jointLenIn * jointWidth * jointDepth;
        const tubeVolCuIn = 10.3; // standard 10.3 oz cartridge ≈ 18.8 cu in
        const tubes = Math.ceil(volCuIn / 18.8);
        return { volCuIn, tubes };
    }, [jointLength, jointWidth, jointDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔧 Caulk Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Total Joint Length" value={jointLength} onChange={setJointLength} unit="ft" min={1} />
                <InputField label="Joint Width" value={jointWidth} onChange={setJointWidth} unit="in" min={0.125} max={1} step={0.125} />
                <InputField label="Joint Depth" value={jointDepth} onChange={setJointDepth} unit="in" min={0.125} max={1} step={0.125} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Joint Volume" value={fmt(result.volCuIn, 1)} unit="cu in" />
                <ResultRow label="Tubes (10.3 oz)" value={fmtInt(result.tubes)} unit="tubes" />
            </div>
        </div>
    );
}

/* ──────────── 74. GABLE WALL CALCULATOR ──────────── */
function GableWallCalc() {
    const [baseWidth, setBaseWidth] = useState(24);
    const [peakHeight, setPeakHeight] = useState(8);
    const [numGables, setNumGables] = useState(2);

    const result = useMemo(() => {
        const areaEach = (baseWidth * peakHeight) / 2;
        const totalArea = areaEach * numGables;
        const sheets4x8 = Math.ceil(totalArea / 32);
        const sidingSqFt = totalArea * 1.1; // 10% waste
        return { areaEach, totalArea, sheets4x8, sidingSqFt };
    }, [baseWidth, peakHeight, numGables]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔺 Gable Wall Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Gable Base Width" value={baseWidth} onChange={setBaseWidth} unit="ft" min={8} />
                <InputField label="Peak Height" value={peakHeight} onChange={setPeakHeight} unit="ft" min={2} />
                <InputField label="Number of Gables" value={numGables} onChange={setNumGables} min={1} max={6} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area per Gable" value={fmt(result.areaEach)} unit="sq ft" />
                <ResultRow label="Total Gable Area" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Sheathing (4×8)" value={fmtInt(result.sheets4x8)} unit="sheets" />
                <ResultRow label="Siding (+10%)" value={fmt(result.sidingSqFt)} unit="sq ft" />
            </div>
        </div>
    );
}

/* ──────────── 75. DECK BOARD CALCULATOR ──────────── */
function DeckBoardCalc() {
    const [deckLength, setDeckLength] = useState(16);
    const [deckWidth, setDeckWidth] = useState(12);
    const [boardWidth, setBoardWidth] = useState(5.5);
    const [gap, setGap] = useState(0.125);

    const result = useMemo(() => {
        const area = deckLength * deckWidth;
        const boardWidthFt = (boardWidth + gap) / 12;
        const numBoards = boardWidthFt > 0 ? Math.ceil(deckWidth / boardWidthFt) : 0;
        const totalLinFt = numBoards * deckLength;
        const screwsPerBoard = Math.ceil(deckLength * 2); // 2 screws per joist crossing
        const totalScrews = screwsPerBoard * numBoards;
        const screwLbs = Math.ceil(totalScrews / 75); // ~75 screws/lb for deck screws
        return { area, numBoards, totalLinFt, totalScrews, screwLbs };
    }, [deckLength, deckWidth, boardWidth, gap]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Deck Board Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Deck Length" value={deckLength} onChange={setDeckLength} unit="ft" min={4} />
                <InputField label="Deck Width" value={deckWidth} onChange={setDeckWidth} unit="ft" min={4} />
                <InputField label="Board Width" value={boardWidth} onChange={setBoardWidth} unit="in" min={3.5} max={7.25} step={0.25} />
                <InputField label="Gap Between" value={gap} onChange={setGap} unit="in" min={0} max={0.25} step={0.0625} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Deck Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Boards Needed" value={fmtInt(result.numBoards)} unit="boards" />
                <ResultRow label="Total Linear Feet" value={fmt(result.totalLinFt)} unit="lin ft" />
                <ResultRow label="Deck Screws" value={fmt(result.totalScrews)} unit="screws" />
            </div>
        </div>
    );
}

/* ──────────── 76. MORTAR BED CALCULATOR ──────────── */
function MortarBedCalc() {
    const [area, setArea] = useState(50);
    const [thickness, setThickness] = useState(1);
    const [mortarType, setMortarType] = useState("thinset");

    const COVERAGE: Record<string, number> = {
        "thinset": 95, "medium-bed": 50, "thick-bed": 25,
    };

    const result = useMemo(() => {
        const thickFactor = thickness / 0.25;
        const coveragePerBag = (COVERAGE[mortarType] || 95) / thickFactor;
        const bags50 = coveragePerBag > 0 ? Math.ceil(area / coveragePerBag) : 0;
        const totalWeight = bags50 * 50;
        return { coveragePerBag, bags50, totalWeight };
    }, [area, thickness, mortarType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Mortar Bed Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Floor Area" value={area} onChange={setArea} unit="sq ft" min={1} />
                <SelectField label="Mortar Type" value={mortarType} onChange={setMortarType} options={[
                    { value: "thinset", label: "Thinset (1/4 inch)" },
                    { value: "medium-bed", label: "Medium Bed (1/2 inch)" },
                    { value: "thick-bed", label: "Thick Bed (3/4–1 inch)" },
                ]} />
                <InputField label="Bed Thickness" value={thickness} onChange={setThickness} unit="in" min={0.25} max={1.5} step={0.25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Coverage/Bag" value={fmt(result.coveragePerBag, 1)} unit="sq ft" />
                <ResultRow label="50 lb Bags" value={fmtInt(result.bags50)} unit="bags" />
                <ResultRow label="Total Weight" value={fmt(result.totalWeight)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 77. WINDOW TRIM CALCULATOR ──────────── */
function WindowTrimCalc() {
    const [windowWidth, setWindowWidth] = useState(36);
    const [windowHeight, setWindowHeight] = useState(48);
    const [numWindows, setNumWindows] = useState(8);
    const [trimWidth, setTrimWidth] = useState(3.5);

    const result = useMemo(() => {
        const perimeterEach = (2 * (windowWidth + windowHeight)) / 12; // in feet
        const totalLinFt = perimeterEach * numWindows;
        const withWaste = totalLinFt * 1.1;
        const pieces8ft = Math.ceil(withWaste / 8);
        return { perimeterEach, totalLinFt, withWaste, pieces8ft };
    }, [windowWidth, windowHeight, numWindows, trimWidth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪟 Window Trim Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Window Width" value={windowWidth} onChange={setWindowWidth} unit="in" min={12} max={96} />
                <InputField label="Window Height" value={windowHeight} onChange={setWindowHeight} unit="in" min={12} max={96} />
                <InputField label="Number of Windows" value={numWindows} onChange={setNumWindows} min={1} max={30} />
                <InputField label="Trim Width" value={trimWidth} onChange={setTrimWidth} unit="in" min={2} max={6} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Trim per Window" value={fmt(result.perimeterEach, 1)} unit="lin ft" />
                <ResultRow label="Total Trim" value={fmt(result.totalLinFt)} unit="lin ft" />
                <ResultRow label="With 10% Waste" value={fmt(result.withWaste)} unit="lin ft" />
                <ResultRow label="8 ft Pieces" value={fmtInt(result.pieces8ft)} unit="pieces" />
            </div>
        </div>
    );
}

/* ──────────── 78. GROUT CALCULATOR ──────────── */
function GroutCalc() {
    const [area, setArea] = useState(100);
    const [tileSizeIn, setTileSizeIn] = useState(12);
    const [jointWidth, setJointWidth] = useState(0.125);
    const [tileThickness, setTileThickness] = useState(0.375);

    const result = useMemo(() => {
        const jointVolumePerSqFt = tileSizeIn > 0
            ? (2 * 12 / tileSizeIn) * jointWidth * tileThickness
            : 0;
        const totalVolCuIn = jointVolumePerSqFt * area;
        const lbs = totalVolCuIn * 0.045; // ~0.045 lbs per cu in
        const bags25 = Math.ceil(lbs / 25);
        const groutType = jointWidth <= 0.125 ? "Unsanded" : "Sanded";
        return { lbs, bags25, groutType };
    }, [area, tileSizeIn, jointWidth, tileThickness]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧽 Grout Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Tile Area" value={area} onChange={setArea} unit="sq ft" min={1} />
                <InputField label="Tile Size" value={tileSizeIn} onChange={setTileSizeIn} unit="in" min={1} max={24} />
                <InputField label="Joint Width" value={jointWidth} onChange={setJointWidth} unit="in" min={0.0625} max={0.5} step={0.0625} />
                <InputField label="Tile Thickness" value={tileThickness} onChange={setTileThickness} unit="in" min={0.25} max={0.75} step={0.125} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Grout Type" value={result.groutType} />
                <ResultRow label="Grout Needed" value={fmt(result.lbs, 1)} unit="lbs" />
                <ResultRow label="25 lb Bags" value={fmtInt(result.bags25)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 79. CONCRETE PATIO CALCULATOR ──────────── */
function ConcretePatioCalc() {
    const [length, setLength] = useState(16);
    const [width, setWidth] = useState(12);
    const [thickness, setThickness] = useState(4);
    const [finish, setFinish] = useState("broom");

    const FINISH_COST: Record<string, number> = {
        "broom": 8, "stamped": 15, "exposed": 10, "colored": 12,
    };

    const result = useMemo(() => {
        const thickFt = thickness / 12;
        const area = length * width;
        const cuFt = area * thickFt;
        const cuYd = cuFt / 27;
        const cuYdWithWaste = cuYd * 1.1;
        const finishCost = area * (FINISH_COST[finish] || 8);
        return { area, cuFt, cuYd, cuYdWithWaste, finishCost };
    }, [length, width, thickness, finish]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏡 Concrete Patio Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={4} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={4} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={3} max={8} />
                <SelectField label="Finish Style" value={finish} onChange={setFinish} options={[
                    { value: "broom", label: "Broom Finish" },
                    { value: "stamped", label: "Stamped" },
                    { value: "exposed", label: "Exposed Aggregate" },
                    { value: "colored", label: "Colored/Stained" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Patio Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Concrete" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Order (+10%)" value={fmt(result.cuYdWithWaste, 2)} unit="cu yd" />
                <ResultRow label="Finish Cost Est." value={`$${fmt(result.finishCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 80. ROOF UNDERLAYMENT CALCULATOR ──────────── */
function RoofUnderlaymentCalc() {
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(24);
    const [pitch, setPitch] = useState(6);
    const [underlaymentType, setUnderlaymentType] = useState("synthetic");

    const ROLL_COVERAGE: Record<string, number> = {
        "15lb-felt": 400, "30lb-felt": 200, "synthetic": 1000, "ice-shield": 75,
    };

    const result = useMemo(() => {
        const flatArea = roofLength * roofWidth;
        const pitchMultiplier = Math.sqrt(1 + Math.pow(pitch / 12, 2));
        const actualArea = flatArea * pitchMultiplier;
        const withOverlap = actualArea * 1.15;
        const rollCoverage = ROLL_COVERAGE[underlaymentType] || 1000;
        const rolls = Math.ceil(withOverlap / rollCoverage);
        return { flatArea, actualArea, withOverlap, rolls, rollCoverage };
    }, [roofLength, roofWidth, pitch, underlaymentType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Roof Underlayment Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length" value={roofLength} onChange={setRoofLength} unit="ft" min={10} />
                <InputField label="Building Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={10} />
                <InputField label="Roof Pitch" value={pitch} onChange={setPitch} unit="/12" min={1} max={12} />
                <SelectField label="Underlayment Type" value={underlaymentType} onChange={setUnderlaymentType} options={[
                    { value: "synthetic", label: "Synthetic (1,000 sq ft/roll)" },
                    { value: "15lb-felt", label: "#15 Felt (400 sq ft/roll)" },
                    { value: "30lb-felt", label: "#30 Felt (200 sq ft/roll)" },
                    { value: "ice-shield", label: "Ice & Water Shield (75 sq ft/roll)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Actual Roof Area" value={fmt(result.actualArea)} unit="sq ft" />
                <ResultRow label="With 15% Overlap" value={fmt(result.withOverlap)} unit="sq ft" />
                <ResultRow label="Rolls Needed" value={fmtInt(result.rolls)} unit="rolls" />
            </div>
        </div>
    );
}

/* ──────────── 81. ANCHOR BOLT CALCULATOR ──────────── */
function AnchorBoltCalc() {
    const [wallLength, setWallLength] = useState(40);
    const [spacing, setSpacing] = useState(6);
    const [boltDiameter, setBoltDiameter] = useState(0.5);
    const [numWalls, setNumWalls] = useState(4);

    const result = useMemo(() => {
        const boltsPerWall = Math.ceil(wallLength / spacing) + 1;
        const totalBolts = boltsPerWall * numWalls;
        const embedment = boltDiameter === 0.5 ? 7 : boltDiameter === 0.625 ? 8 : 10;
        const nutWasherSets = totalBolts;
        return { boltsPerWall, totalBolts, embedment, nutWasherSets };
    }, [wallLength, spacing, boltDiameter, numWalls]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔩 Anchor Bolt Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={4} />
                <InputField label="Bolt Spacing" value={spacing} onChange={setSpacing} unit="ft" min={2} max={8} />
                <SelectField label="Bolt Diameter" value={String(boltDiameter)} onChange={(v) => setBoltDiameter(Number(v))} options={[
                    { value: "0.5", label: '1/2" (Standard)' },
                    { value: "0.625", label: '5/8" (Heavy)' },
                    { value: "0.75", label: '3/4" (Commercial)' },
                ]} />
                <InputField label="Number of Walls" value={numWalls} onChange={setNumWalls} min={1} max={20} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Bolts per Wall" value={fmtInt(result.boltsPerWall)} />
                <ResultRow label="Total Anchor Bolts" value={fmtInt(result.totalBolts)} unit="bolts" />
                <ResultRow label="Min. Embedment" value={fmtInt(result.embedment)} unit="in" />
                <ResultRow label="Nut & Washer Sets" value={fmtInt(result.nutWasherSets)} unit="sets" />
            </div>
        </div>
    );
}

/* ──────────── 82. BRICK VENEER CALCULATOR ──────────── */
function BrickVeneerCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(9);
    const [openings, setOpenings] = useState(2);
    const [avgOpeningArea, setAvgOpeningArea] = useState(15);

    const result = useMemo(() => {
        const grossArea = wallLength * wallHeight;
        const netArea = Math.max(0, grossArea - openings * avgOpeningArea);
        const bricks = Math.ceil(netArea * 6.75); // ~6.75 standard bricks per sq ft
        const mortarBags = Math.ceil(netArea / 35); // 1 bag per 35 sq ft
        const wallTies = Math.ceil(netArea / 2.67); // 1 tie per 2.67 sq ft
        const flashingLf = wallLength; // base flashing
        return { grossArea, netArea, bricks, mortarBags, wallTies, flashingLf };
    }, [wallLength, wallHeight, openings, avgOpeningArea]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Brick Veneer Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={4} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={4} />
                <InputField label="Number of Openings" value={openings} onChange={setOpenings} min={0} max={20} />
                <InputField label="Avg Opening Area" value={avgOpeningArea} onChange={setAvgOpeningArea} unit="sq ft" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Net Wall Area" value={fmt(result.netArea)} unit="sq ft" />
                <ResultRow label="Bricks Needed" value={fmtInt(result.bricks)} unit="bricks" />
                <ResultRow label="Mortar Bags (80 lb)" value={fmtInt(result.mortarBags)} unit="bags" />
                <ResultRow label="Wall Ties" value={fmtInt(result.wallTies)} unit="ties" />
                <ResultRow label="Base Flashing" value={fmt(result.flashingLf)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 83. CONCRETE WASHOUT CALCULATOR ──────────── */
function ConcreteWashoutCalc() {
    const [trucks, setTrucks] = useState(3);
    const [washoutGallons, setWashoutGallons] = useState(150);
    const [pitDepth, setPitDepth] = useState(2);

    const result = useMemo(() => {
        const totalGallons = trucks * washoutGallons;
        const totalCuFt = totalGallons / 7.48; // 1 cu ft = 7.48 gal
        const pitArea = totalCuFt / pitDepth;
        const pitSide = Math.ceil(Math.sqrt(pitArea));
        const linerSqFt = (pitSide + 2 * pitDepth) * (pitSide + 2 * pitDepth); // liner includes sides
        return { totalGallons, totalCuFt, pitArea, pitSide, linerSqFt };
    }, [trucks, washoutGallons, pitDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🚿 Concrete Washout Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Concrete Trucks" value={trucks} onChange={setTrucks} min={1} max={20} />
                <InputField label="Washout per Truck" value={washoutGallons} onChange={setWashoutGallons} unit="gal" min={50} max={300} />
                <InputField label="Pit Depth" value={pitDepth} onChange={setPitDepth} unit="ft" min={1} max={4} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Washout" value={fmtInt(result.totalGallons)} unit="gal" />
                <ResultRow label="Pit Volume" value={fmt(result.totalCuFt)} unit="cu ft" />
                <ResultRow label="Min Pit Size" value={`${result.pitSide} × ${result.pitSide}`} unit="ft" />
                <ResultRow label="Liner Needed" value={fmtInt(result.linerSqFt)} unit="sq ft" />
            </div>
        </div>
    );
}

/* ──────────── 84. RIDGE VENT CALCULATOR ──────────── */
function RidgeVentCalc() {
    const [ridgeLength, setRidgeLength] = useState(30);
    const [ventWidth, setVentWidth] = useState(12);
    const [pieceLengthFt, setPieceLengthFt] = useState(4);

    const result = useMemo(() => {
        const pieces = Math.ceil(ridgeLength / pieceLengthFt);
        const nfa = ridgeLength * (ventWidth / 12) * 9; // ~9 sq in NFA per sq ft of vent
        const capShingleBundles = Math.ceil(ridgeLength / 25); // 1 bundle per 25 lin ft
        const nails = pieces * 8; // ~8 nails per piece
        return { pieces, nfa, capShingleBundles, nails };
    }, [ridgeLength, ventWidth, pieceLengthFt]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌬️ Ridge Vent Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Ridge Length" value={ridgeLength} onChange={setRidgeLength} unit="ft" min={8} />
                <InputField label="Vent Width" value={ventWidth} onChange={setVentWidth} unit="in" min={8} max={16} />
                <InputField label="Piece Length" value={pieceLengthFt} onChange={setPieceLengthFt} unit="ft" min={2} max={8} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Vent Pieces" value={fmtInt(result.pieces)} unit="pcs" />
                <ResultRow label="Net Free Area" value={fmt(result.nfa)} unit="sq in" />
                <ResultRow label="Cap Shingle Bundles" value={fmtInt(result.capShingleBundles)} unit="bundles" />
                <ResultRow label="Nails Needed" value={fmtInt(result.nails)} />
            </div>
        </div>
    );
}

/* ──────────── 85. STAIR STRINGER CALCULATOR ──────────── */
function StairStringerCalc() {
    const [totalRise, setTotalRise] = useState(36);
    const [riserHeight, setRiserHeight] = useState(7.5);
    const [treadDepth, setTreadDepth] = useState(10);
    const [stairWidth, setStairWidth] = useState(36);

    const result = useMemo(() => {
        const risers = Math.round(totalRise / riserHeight);
        const actualRiser = totalRise / risers;
        const treads = risers - 1;
        const totalRun = treads * treadDepth;
        const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun) / 12; // in ft
        const numStringers = stairWidth <= 36 ? 3 : Math.ceil(stairWidth / 16) + 1;
        return { risers, actualRiser, treads, totalRun, stringerLength, numStringers };
    }, [totalRise, riserHeight, treadDepth, stairWidth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Stair Stringer Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Total Rise" value={totalRise} onChange={setTotalRise} unit="in" min={12} max={144} />
                <InputField label="Desired Riser Height" value={riserHeight} onChange={setRiserHeight} unit="in" min={5} max={8} step={0.25} />
                <InputField label="Tread Depth" value={treadDepth} onChange={setTreadDepth} unit="in" min={9} max={14} />
                <InputField label="Stair Width" value={stairWidth} onChange={setStairWidth} unit="in" min={24} max={60} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Number of Risers" value={fmtInt(result.risers)} />
                <ResultRow label="Actual Riser Height" value={fmt(result.actualRiser, 2)} unit="in" />
                <ResultRow label="Number of Treads" value={fmtInt(result.treads)} />
                <ResultRow label="Total Run" value={fmt(result.totalRun)} unit="in" />
                <ResultRow label="Stringer Length" value={fmt(result.stringerLength, 1)} unit="ft" />
                <ResultRow label="Stringers Needed" value={fmtInt(result.numStringers)} />
            </div>
        </div>
    );
}

/* ──────────── 86. WATERPROOFING MEMBRANE CALCULATOR ──────────── */
function WaterproofingMembraneCalc() {
    const [areaLength, setAreaLength] = useState(30);
    const [areaHeight, setAreaHeight] = useState(8);
    const [membraneType, setMembraneType] = useState("sheet");

    const ROLL_COVERAGE: Record<string, number> = {
        "sheet": 200, "liquid": 100, "peel-stick": 75,
    };

    const result = useMemo(() => {
        const area = areaLength * areaHeight;
        const withOverlap = area * 1.15;
        const coverage = ROLL_COVERAGE[membraneType] || 200;
        const rolls = Math.ceil(withOverlap / coverage);
        const seamTape = Math.ceil(areaLength * 1.5); // seam tape estimate
        return { area, withOverlap, rolls, seamTape, coverage };
    }, [areaLength, areaHeight, membraneType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💧 Waterproofing Membrane Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall/Area Length" value={areaLength} onChange={setAreaLength} unit="ft" min={4} />
                <InputField label="Wall/Area Height" value={areaHeight} onChange={setAreaHeight} unit="ft" min={2} />
                <SelectField label="Membrane Type" value={membraneType} onChange={setMembraneType} options={[
                    { value: "sheet", label: "Sheet Membrane (200 sq ft/roll)" },
                    { value: "liquid", label: "Liquid Applied (100 sq ft/gal)" },
                    { value: "peel-stick", label: "Peel & Stick (75 sq ft/roll)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Surface Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="With 15% Overlap" value={fmt(result.withOverlap)} unit="sq ft" />
                <ResultRow label="Rolls/Units Needed" value={fmtInt(result.rolls)} />
                <ResultRow label="Seam Tape" value={fmtInt(result.seamTape)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 87. WEEP SCREED CALCULATOR ──────────── */
function WeepScreedCalc() {
    const [perimeter, setPerimeter] = useState(120);
    const [pieceLength, setPieceLength] = useState(10);
    const [overlap, setOverlap] = useState(2);

    const result = useMemo(() => {
        const effectiveLength = pieceLength - overlap / 12;
        const pieces = Math.ceil(perimeter / effectiveLength);
        const totalLength = pieces * pieceLength;
        const nails = pieces * 6; // ~6 nails per piece
        return { pieces, totalLength, nails, effectiveLength };
    }, [perimeter, pieceLength, overlap]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Weep Screed Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Perimeter" value={perimeter} onChange={setPerimeter} unit="ft" min={10} />
                <InputField label="Piece Length" value={pieceLength} onChange={setPieceLength} unit="ft" min={8} max={12} />
                <InputField label="Overlap per Joint" value={overlap} onChange={setOverlap} unit="in" min={1} max={4} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Pieces Needed" value={fmtInt(result.pieces)} unit="pcs" />
                <ResultRow label="Total Stock Length" value={fmt(result.totalLength)} unit="lin ft" />
                <ResultRow label="Nails Needed" value={fmtInt(result.nails)} />
            </div>
        </div>
    );
}

/* ──────────── 88. BOARD FOOT CALCULATOR ──────────── */
function BoardFootCalc() {
    const [thickness, setThickness] = useState(2);
    const [widthIn, setWidthIn] = useState(6);
    const [lengthFt, setLengthFt] = useState(8);
    const [qty, setQty] = useState(10);
    const [pricePerBf, setPricePerBf] = useState(5);

    const result = useMemo(() => {
        const bfPerPiece = (thickness * widthIn * lengthFt) / 12;
        const totalBf = bfPerPiece * qty;
        const totalCost = totalBf * pricePerBf;
        return { bfPerPiece, totalBf, totalCost };
    }, [thickness, widthIn, lengthFt, qty, pricePerBf]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Board Foot Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={1} max={16} />
                <InputField label="Width" value={widthIn} onChange={setWidthIn} unit="in" min={2} max={16} />
                <InputField label="Length" value={lengthFt} onChange={setLengthFt} unit="ft" min={4} max={20} />
                <InputField label="Quantity" value={qty} onChange={setQty} min={1} max={500} />
                <InputField label="Price per BF" value={pricePerBf} onChange={setPricePerBf} unit="$" min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="BF per Piece" value={fmt(result.bfPerPiece, 2)} unit="BF" />
                <ResultRow label="Total Board Feet" value={fmt(result.totalBf, 1)} unit="BF" />
                <ResultRow label="Total Cost" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 89. CONCRETE BEAM CALCULATOR ──────────── */
function ConcreteBeamCalc() {
    const [beamLength, setBeamLength] = useState(20);
    const [beamWidth, setBeamWidth] = useState(12);
    const [beamDepth, setBeamDepth] = useState(18);
    const [numBeams, setNumBeams] = useState(2);

    const result = useMemo(() => {
        const widthFt = beamWidth / 12;
        const depthFt = beamDepth / 12;
        const cuFtEach = beamLength * widthFt * depthFt;
        const totalCuFt = cuFtEach * numBeams;
        const cuYd = totalCuFt / 27;
        const bags80 = Math.ceil(totalCuFt / 0.6);
        const rebarLf = beamLength * numBeams * 4; // 4 longitudinal bars per beam
        return { cuFtEach, totalCuFt, cuYd, bags80, rebarLf };
    }, [beamLength, beamWidth, beamDepth, numBeams]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Concrete Beam Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Beam Length" value={beamLength} onChange={setBeamLength} unit="ft" min={4} />
                <InputField label="Beam Width" value={beamWidth} onChange={setBeamWidth} unit="in" min={6} max={36} />
                <InputField label="Beam Depth" value={beamDepth} onChange={setBeamDepth} unit="in" min={8} max={48} />
                <InputField label="Number of Beams" value={numBeams} onChange={setNumBeams} min={1} max={20} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume per Beam" value={fmt(result.cuFtEach)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
                <ResultRow label="Rebar (4 bars)" value={fmtInt(result.rebarLf)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 90. DOWNSPOUT CALCULATOR ──────────── */
function DownspoutCalc() {
    const [roofArea, setRoofArea] = useState(1200);
    const [wallHeight, setWallHeight] = useState(9);
    const [extensionLength, setExtensionLength] = useState(4);

    const result = useMemo(() => {
        // 1 downspout per 600 sq ft of roof area (standard rule)
        const numDownspouts = Math.ceil(roofArea / 600);
        const downspoutLength = wallHeight + 1; // wall height + 1 ft for top elbow
        const totalDownspoutLf = downspoutLength * numDownspouts;
        const elbows = numDownspouts * 2; // top and bottom elbows
        const extensions = numDownspouts;
        const totalExtensionLf = extensionLength * numDownspouts;
        return { numDownspouts, downspoutLength, totalDownspoutLf, elbows, extensions, totalExtensionLf };
    }, [roofArea, wallHeight, extensionLength]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌧️ Downspout Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Area" value={roofArea} onChange={setRoofArea} unit="sq ft" min={200} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={6} max={30} />
                <InputField label="Extension Length" value={extensionLength} onChange={setExtensionLength} unit="ft" min={2} max={10} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Downspouts Needed" value={fmtInt(result.numDownspouts)} />
                <ResultRow label="Length Each" value={fmt(result.downspoutLength, 1)} unit="ft" />
                <ResultRow label="Total Downspout" value={fmt(result.totalDownspoutLf)} unit="lin ft" />
                <ResultRow label="Elbows" value={fmtInt(result.elbows)} unit="pcs" />
                <ResultRow label="Extension Total" value={fmt(result.totalExtensionLf)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 91. CABINET DOOR CALCULATOR ──────────── */
function CabinetDoorCalc() {
    const [openingWidth, setOpeningWidth] = useState(15);
    const [openingHeight, setOpeningHeight] = useState(30);
    const [overlay, setOverlay] = useState(0.5);
    const [numDoors, setNumDoors] = useState(1);
    const [numCabinets, setNumCabinets] = useState(10);

    const result = useMemo(() => {
        const doorWidth = numDoors === 2 ? (openingWidth / 2) + overlay : openingWidth + (2 * overlay);
        const doorHeight = openingHeight + (2 * overlay);
        const hingesPerDoor = doorHeight > 40 ? 3 : 2;
        const totalDoors = numDoors * numCabinets;
        const totalHinges = hingesPerDoor * totalDoors;
        const doorArea = (doorWidth * doorHeight) / 144; // sq ft per door
        return { doorWidth, doorHeight, hingesPerDoor, totalDoors, totalHinges, doorArea };
    }, [openingWidth, openingHeight, overlay, numDoors, numCabinets]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🚪 Cabinet Door Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Opening Width" value={openingWidth} onChange={setOpeningWidth} unit="in" min={8} max={48} />
                <InputField label="Opening Height" value={openingHeight} onChange={setOpeningHeight} unit="in" min={8} max={48} />
                <SelectField label="Overlay" value={String(overlay)} onChange={(v) => setOverlay(Number(v))} options={[
                    { value: "0.5", label: '1/2" Standard Overlay' },
                    { value: "1.25", label: '1-1/4" Full Overlay' },
                    { value: "0", label: 'Inset (Flush)' },
                ]} />
                <SelectField label="Doors per Opening" value={String(numDoors)} onChange={(v) => setNumDoors(Number(v))} options={[
                    { value: "1", label: "Single Door" },
                    { value: "2", label: "Double Door" },
                ]} />
                <InputField label="Number of Cabinets" value={numCabinets} onChange={setNumCabinets} min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Door Size" value={`${fmt(result.doorWidth, 1)} × ${fmt(result.doorHeight, 1)}`} unit="in" />
                <ResultRow label="Door Area" value={fmt(result.doorArea, 2)} unit="sq ft" />
                <ResultRow label="Total Doors" value={fmtInt(result.totalDoors)} />
                <ResultRow label="Hinges per Door" value={fmtInt(result.hingesPerDoor)} />
                <ResultRow label="Total Hinges" value={fmtInt(result.totalHinges)} />
            </div>
        </div>
    );
}

/* ──────────── 92. FRAMING CALCULATOR ──────────── */
function FramingCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(8);
    const [spacing, setSpacing] = useState(16);
    const [numCorners, setNumCorners] = useState(2);

    const result = useMemo(() => {
        const wallLengthIn = wallLength * 12;
        const studs = Math.ceil(wallLengthIn / spacing) + 1;
        const cornerStuds = numCorners * 3; // 3-stud corners
        const totalStuds = studs + cornerStuds;
        const plates = wallLength * 3; // top plate, double top plate, bottom plate
        const studLength = wallHeight; // in ft
        const totalStudLf = totalStuds * studLength;
        const totalLf = totalStudLf + plates;
        return { studs, cornerStuds, totalStuds, plates, totalStudLf, totalLf };
    }, [wallLength, wallHeight, spacing, numCorners]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Framing Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={4} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={8} max={12} />
                <SelectField label="Stud Spacing" value={String(spacing)} onChange={(v) => setSpacing(Number(v))} options={[
                    { value: "16", label: '16" OC (Standard)' },
                    { value: "24", label: '24" OC (Non-Load)' },
                    { value: "12", label: '12" OC (Heavy Load)' },
                ]} />
                <InputField label="Corners" value={numCorners} onChange={setNumCorners} min={0} max={8} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Field Studs" value={fmtInt(result.studs)} />
                <ResultRow label="Corner Studs" value={fmtInt(result.cornerStuds)} />
                <ResultRow label="Total Studs" value={fmtInt(result.totalStuds)} />
                <ResultRow label="Plate Stock" value={fmt(result.plates)} unit="lin ft" />
                <ResultRow label="Total Lumber" value={fmt(result.totalLf)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 93. LUMBER WEIGHT CALCULATOR ──────────── */
function LumberWeightCalc() {
    const [thickness, setThickness] = useState(2);
    const [widthIn, setWidthIn] = useState(6);
    const [lengthFt, setLengthFt] = useState(8);
    const [qty, setQty] = useState(10);
    const [species, setSpecies] = useState("spf");

    const DENSITY: Record<string, number> = {
        "spf": 28, "df": 34, "hem-fir": 29, "southern-pine": 36,
        "cedar": 23, "oak": 47, "maple": 44, "walnut": 38, "cherry": 35,
    };

    const result = useMemo(() => {
        const actualT = thickness <= 1 ? thickness * 0.75 : thickness - 0.5;
        const actualW = widthIn <= 6 ? widthIn - 0.5 : widthIn - 0.75;
        const volumeCuFt = (actualT * actualW * lengthFt * 12) / 1728;
        const density = DENSITY[species] || 28;
        const weightPerPiece = volumeCuFt * density;
        const totalWeight = weightPerPiece * qty;
        return { actualT, actualW, volumeCuFt, weightPerPiece, totalWeight, density };
    }, [thickness, widthIn, lengthFt, qty, species]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⚖️ Lumber Weight Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Nominal Thickness" value={thickness} onChange={setThickness} unit="in" min={1} max={6} />
                <InputField label="Nominal Width" value={widthIn} onChange={setWidthIn} unit="in" min={2} max={16} />
                <InputField label="Length" value={lengthFt} onChange={setLengthFt} unit="ft" min={4} max={20} />
                <InputField label="Quantity" value={qty} onChange={setQty} min={1} max={500} />
                <SelectField label="Species" value={species} onChange={setSpecies} options={[
                    { value: "spf", label: "Spruce-Pine-Fir (28 lb/cu ft)" },
                    { value: "df", label: "Douglas Fir (34 lb/cu ft)" },
                    { value: "southern-pine", label: "Southern Pine (36 lb/cu ft)" },
                    { value: "hem-fir", label: "Hem-Fir (29 lb/cu ft)" },
                    { value: "cedar", label: "Western Cedar (23 lb/cu ft)" },
                    { value: "oak", label: "Oak (47 lb/cu ft)" },
                    { value: "maple", label: "Maple (44 lb/cu ft)" },
                    { value: "walnut", label: "Walnut (38 lb/cu ft)" },
                    { value: "cherry", label: "Cherry (35 lb/cu ft)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Actual Size" value={`${fmt(result.actualT, 2)} × ${fmt(result.actualW, 2)}`} unit="in" />
                <ResultRow label="Weight per Piece" value={fmt(result.weightPerPiece, 1)} unit="lbs" />
                <ResultRow label="Total Weight" value={fmt(result.totalWeight)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 94. RAFTER LENGTH CALCULATOR ──────────── */
function RafterLengthCalc() {
    const [buildingSpan, setBuildingSpan] = useState(24);
    const [pitch, setPitch] = useState(6);
    const [overhang, setOverhang] = useState(12);
    const [ridgeThickness, setRidgeThickness] = useState(1.5);

    const result = useMemo(() => {
        const run = (buildingSpan / 2) - (ridgeThickness / 2 / 12); // in ft
        const rise = run * (pitch / 12);
        const rafterLength = Math.sqrt(run * run + rise * rise);
        const overhangFt = overhang / 12;
        const tailLength = overhangFt * Math.sqrt(1 + Math.pow(pitch / 12, 2));
        const totalLength = rafterLength + tailLength;
        const birdsmouthSeat = ridgeThickness > 0 ? 3.5 : 0; // typical 2x4 wall seat cut
        return { run, rise, rafterLength, tailLength, totalLength, birdsmouthSeat };
    }, [buildingSpan, pitch, overhang, ridgeThickness]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Rafter Length Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Building Span" value={buildingSpan} onChange={setBuildingSpan} unit="ft" min={8} max={60} />
                <InputField label="Roof Pitch" value={pitch} onChange={setPitch} unit="/12" min={2} max={12} />
                <InputField label="Overhang" value={overhang} onChange={setOverhang} unit="in" min={0} max={24} />
                <InputField label="Ridge Board Thickness" value={ridgeThickness} onChange={setRidgeThickness} unit="in" min={0} max={3} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Run" value={fmt(result.run, 2)} unit="ft" />
                <ResultRow label="Rise" value={fmt(result.rise, 2)} unit="ft" />
                <ResultRow label="Rafter Length" value={fmt(result.rafterLength, 2)} unit="ft" />
                <ResultRow label="Tail Length" value={fmt(result.tailLength, 2)} unit="ft" />
                <ResultRow label="Total Length" value={fmt(result.totalLength, 2)} unit="ft" />
                <ResultRow label="Birdsmouth Seat" value={fmt(result.birdsmouthSeat, 1)} unit="in" />
            </div>
        </div>
    );
}

/* ──────────── 95. DIMENSIONAL LUMBER CALCULATOR ──────────── */
function DimensionalLumberCalc() {
    const [nominalT, setNominalT] = useState(2);
    const [nominalW, setNominalW] = useState(4);
    const [lengthFt, setLengthFt] = useState(8);
    const [qty, setQty] = useState(1);

    const ACTUAL_SIZES: Record<string, [number, number]> = {
        "1x2": [0.75, 1.5], "1x3": [0.75, 2.5], "1x4": [0.75, 3.5], "1x6": [0.75, 5.5],
        "1x8": [0.75, 7.25], "1x10": [0.75, 9.25], "1x12": [0.75, 11.25],
        "2x2": [1.5, 1.5], "2x3": [1.5, 2.5], "2x4": [1.5, 3.5], "2x6": [1.5, 5.5],
        "2x8": [1.5, 7.25], "2x10": [1.5, 9.25], "2x12": [1.5, 11.25],
        "4x4": [3.5, 3.5], "4x6": [3.5, 5.5], "6x6": [5.5, 5.5],
    };

    const result = useMemo(() => {
        const key = `${nominalT}x${nominalW}`;
        const actual = ACTUAL_SIZES[key] || [nominalT - 0.5, nominalW - 0.5];
        const areaSqIn = actual[0] * actual[1];
        const volumeCuFt = (areaSqIn * lengthFt * 12) / 1728;
        const boardFeet = (nominalT * nominalW * lengthFt) / 12;
        const totalBf = boardFeet * qty;
        return { actualT: actual[0], actualW: actual[1], areaSqIn, volumeCuFt, boardFeet, totalBf };
    }, [nominalT, nominalW, lengthFt, qty]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Dimensional Lumber Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Nominal Size" value={`${nominalT}x${nominalW}`} onChange={(v) => {
                    const parts = v.split("x"); setNominalT(Number(parts[0])); setNominalW(Number(parts[1]));
                }} options={[
                    { value: "1x2", label: '1×2' }, { value: "1x3", label: '1×3' }, { value: "1x4", label: '1×4' },
                    { value: "1x6", label: '1×6' }, { value: "1x8", label: '1×8' }, { value: "1x10", label: '1×10' },
                    { value: "1x12", label: '1×12' }, { value: "2x2", label: '2×2' }, { value: "2x3", label: '2×3' },
                    { value: "2x4", label: '2×4' }, { value: "2x6", label: '2×6' }, { value: "2x8", label: '2×8' },
                    { value: "2x10", label: '2×10' }, { value: "2x12", label: '2×12' }, { value: "4x4", label: '4×4' },
                    { value: "4x6", label: '4×6' }, { value: "6x6", label: '6×6' },
                ]} />
                <InputField label="Length" value={lengthFt} onChange={setLengthFt} unit="ft" min={4} max={20} />
                <InputField label="Quantity" value={qty} onChange={setQty} min={1} max={500} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Nominal Size" value={`${nominalT} × ${nominalW}`} unit="in" />
                <ResultRow label="Actual Size" value={`${result.actualT} × ${result.actualW}`} unit="in" />
                <ResultRow label="Cross-Section Area" value={fmt(result.areaSqIn, 2)} unit="sq in" />
                <ResultRow label="Board Feet Each" value={fmt(result.boardFeet, 2)} unit="BF" />
                <ResultRow label="Total Board Feet" value={fmt(result.totalBf, 1)} unit="BF" />
            </div>
        </div>
    );
}

/* ──────────── 96. PLYWOOD THICKNESS CALCULATOR ──────────── */
function PlywoodThicknessCalc() {
    const [nominalThickness, setNominalThickness] = useState("3/4");
    const [sheetWidth, setSheetWidth] = useState(4);
    const [sheetLength, setSheetLength] = useState(8);
    const [numSheets, setNumSheets] = useState(1);

    const THICKNESS_MAP: Record<string, { actual: number; weight: number }> = {
        "1/4": { actual: 0.219, weight: 22 },
        "3/8": { actual: 0.344, weight: 28.5 },
        "1/2": { actual: 0.469, weight: 40.6 },
        "5/8": { actual: 0.578, weight: 48 },
        "3/4": { actual: 0.703, weight: 60.8 },
        "1": { actual: 0.953, weight: 80 },
    };

    const result = useMemo(() => {
        const info = THICKNESS_MAP[nominalThickness] || { actual: 0.75, weight: 61 };
        const areaPerSheet = sheetWidth * sheetLength;
        const totalArea = areaPerSheet * numSheets;
        const totalWeight = info.weight * numSheets;
        return { actual: info.actual, weightPerSheet: info.weight, areaPerSheet, totalArea, totalWeight };
    }, [nominalThickness, sheetWidth, sheetLength, numSheets]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Plywood Thickness Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Nominal Thickness" value={nominalThickness} onChange={setNominalThickness} options={[
                    { value: "1/4", label: '1/4" (Underlayment)' },
                    { value: "3/8", label: '3/8" (Wall Sheathing)' },
                    { value: "1/2", label: '1/2" (Roof Sheathing)' },
                    { value: "5/8", label: '5/8" (Subfloor)' },
                    { value: "3/4", label: '3/4" (Subfloor/Shelving)' },
                    { value: "1", label: '1" (Heavy Duty)' },
                ]} />
                <InputField label="Sheet Width" value={sheetWidth} onChange={setSheetWidth} unit="ft" min={4} max={5} />
                <InputField label="Sheet Length" value={sheetLength} onChange={setSheetLength} unit="ft" min={8} max={10} />
                <InputField label="Number of Sheets" value={numSheets} onChange={setNumSheets} min={1} max={200} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Nominal" value={`${nominalThickness}"`} />
                <ResultRow label="Actual Thickness" value={`${result.actual}"`} />
                <ResultRow label="Weight per Sheet" value={fmt(result.weightPerSheet, 1)} unit="lbs" />
                <ResultRow label="Total Area" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Total Weight" value={fmt(result.totalWeight)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 97. CARPENTRY COST CALCULATOR ──────────── */
function CarpentryCostCalc() {
    const [area, setArea] = useState(200);
    const [laborRate, setLaborRate] = useState(50);
    const [projectType, setProjectType] = useState("framing");
    const [complexity, setComplexity] = useState("standard");

    const HOURS_PER_SQFT: Record<string, number> = {
        "framing": 0.08, "trim-install": 0.12, "deck-build": 0.1,
        "cabinet-install": 0.15, "door-install": 0.5, "shelving": 0.06,
    };
    const COMPLEXITY_MULT: Record<string, number> = {
        "simple": 0.8, "standard": 1.0, "complex": 1.4,
    };

    const result = useMemo(() => {
        const hoursPerSqFt = HOURS_PER_SQFT[projectType] || 0.1;
        const mult = COMPLEXITY_MULT[complexity] || 1.0;
        const totalHours = area * hoursPerSqFt * mult;
        const laborCost = totalHours * laborRate;
        const materialEst = laborCost * 0.6; // materials ~60% of labor
        const totalLow = laborCost + materialEst * 0.8;
        const totalHigh = laborCost * 1.2 + materialEst * 1.2;
        return { totalHours, laborCost, materialEst, totalLow, totalHigh };
    }, [area, laborRate, projectType, complexity]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💰 Carpentry Cost Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Project Area" value={area} onChange={setArea} unit="sq ft" min={10} />
                <InputField label="Labor Rate" value={laborRate} onChange={setLaborRate} unit="$/hr" min={25} max={150} />
                <SelectField label="Project Type" value={projectType} onChange={setProjectType} options={[
                    { value: "framing", label: "Wall Framing" },
                    { value: "trim-install", label: "Trim & Molding Install" },
                    { value: "deck-build", label: "Deck Building" },
                    { value: "cabinet-install", label: "Cabinet Installation" },
                    { value: "door-install", label: "Door Installation" },
                    { value: "shelving", label: "Shelving & Storage" },
                ]} />
                <SelectField label="Complexity" value={complexity} onChange={setComplexity} options={[
                    { value: "simple", label: "Simple (Basic)" },
                    { value: "standard", label: "Standard" },
                    { value: "complex", label: "Complex (Custom)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Estimated Hours" value={fmt(result.totalHours, 1)} unit="hrs" />
                <ResultRow label="Labor Cost" value={`$${fmt(result.laborCost)}`} />
                <ResultRow label="Material Est." value={`$${fmt(result.materialEst)}`} />
                <ResultRow label="Total Range" value={`$${fmt(result.totalLow)} – $${fmt(result.totalHigh)}`} />
            </div>
        </div>
    );
}

/* ──────────── 98. STUD CALCULATOR ──────────── */
function StudCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(8);
    const [spacing, setSpacing] = useState(16);
    const [numDoors, setNumDoors] = useState(1);
    const [numWindows, setNumWindows] = useState(2);

    const result = useMemo(() => {
        const wallLengthIn = wallLength * 12;
        const fieldStuds = Math.ceil(wallLengthIn / spacing) + 1;
        const kingStuds = (numDoors + numWindows) * 2;
        const jackStuds = (numDoors + numWindows) * 2;
        const cripplesEst = numWindows * 2; // top and bottom per window
        const totalStuds = fieldStuds + kingStuds + jackStuds + cripplesEst;
        const studLf = totalStuds * wallHeight;
        const plateLf = wallLength * 3; // bottom + double top
        return { fieldStuds, kingStuds, jackStuds, cripplesEst, totalStuds, studLf, plateLf };
    }, [wallLength, wallHeight, spacing, numDoors, numWindows]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Stud Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={4} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={8} max={12} />
                <SelectField label="Stud Spacing" value={String(spacing)} onChange={(v) => setSpacing(Number(v))} options={[
                    { value: "16", label: '16" OC (Standard)' },
                    { value: "24", label: '24" OC' },
                    { value: "12", label: '12" OC' },
                ]} />
                <InputField label="Doors" value={numDoors} onChange={setNumDoors} min={0} max={10} />
                <InputField label="Windows" value={numWindows} onChange={setNumWindows} min={0} max={10} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Field Studs" value={fmtInt(result.fieldStuds)} />
                <ResultRow label="King + Jack Studs" value={fmtInt(result.kingStuds + result.jackStuds)} />
                <ResultRow label="Cripples Est." value={fmtInt(result.cripplesEst)} />
                <ResultRow label="Total Studs" value={fmtInt(result.totalStuds)} />
                <ResultRow label="Stud Lumber" value={fmt(result.studLf)} unit="lin ft" />
                <ResultRow label="Plate Lumber" value={fmt(result.plateLf)} unit="lin ft" />
            </div>
        </div>
    );
}

/* ──────────── 99. JOIST SPAN CALCULATOR ──────────── */
function JoistSpanCalc() {
    const [joistSize, setJoistSize] = useState("2x10");
    const [spacing, setSpacing] = useState(16);
    const [grade, setGrade] = useState("no2");
    const [joistType, setJoistType] = useState("floor");

    // Approximate max spans for SPF #2 floor joists (40 psf live load)
    const SPAN_TABLE: Record<string, Record<string, Record<string, number>>> = {
        "floor": {
            "12": { "2x6": 10.5, "2x8": 14, "2x10": 17.5, "2x12": 21 },
            "16": { "2x6": 9.5, "2x8": 12.5, "2x10": 16, "2x12": 19 },
            "24": { "2x6": 8, "2x8": 10.5, "2x10": 13, "2x12": 16 },
        },
        "ceiling": {
            "12": { "2x6": 14, "2x8": 18.5, "2x10": 23.5, "2x12": 27 },
            "16": { "2x6": 12.5, "2x8": 17, "2x10": 21, "2x12": 25 },
            "24": { "2x6": 11, "2x8": 14, "2x10": 18, "2x12": 21 },
        },
    };

    const result = useMemo(() => {
        const spans = SPAN_TABLE[joistType]?.[String(spacing)] || {};
        const maxSpan = spans[joistSize] || 0;
        const gradeMult = grade === "sel" ? 1.1 : grade === "no1" ? 1.05 : 1.0;
        const adjustedSpan = maxSpan * gradeMult;
        return { maxSpan, adjustedSpan, joistSize, spacing };
    }, [joistSize, spacing, grade, joistType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Joist Span Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Joist Size" value={joistSize} onChange={setJoistSize} options={[
                    { value: "2x6", label: "2×6" },
                    { value: "2x8", label: "2×8" },
                    { value: "2x10", label: "2×10" },
                    { value: "2x12", label: "2×12" },
                ]} />
                <SelectField label="Spacing" value={String(spacing)} onChange={(v) => setSpacing(Number(v))} options={[
                    { value: "12", label: '12" OC' },
                    { value: "16", label: '16" OC (Standard)' },
                    { value: "24", label: '24" OC' },
                ]} />
                <SelectField label="Lumber Grade" value={grade} onChange={setGrade} options={[
                    { value: "sel", label: "Select Structural" },
                    { value: "no1", label: "#1 Grade" },
                    { value: "no2", label: "#2 Grade (Common)" },
                ]} />
                <SelectField label="Joist Type" value={joistType} onChange={setJoistType} options={[
                    { value: "floor", label: "Floor Joist (40 psf)" },
                    { value: "ceiling", label: "Ceiling Joist (20 psf)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Joist Size" value={joistSize} />
                <ResultRow label="Max Span (SPF #2)" value={fmt(result.maxSpan, 1)} unit="ft" />
                <ResultRow label="Adjusted Span" value={fmt(result.adjustedSpan, 1)} unit="ft" />
            </div>
        </div>
    );
}

/* ──────────── 100. SHELF BRACKET CALCULATOR ──────────── */
function ShelfBracketCalc() {
    const [shelfLength, setShelfLength] = useState(48);
    const [loadWeight, setLoadWeight] = useState(20);
    const [shelfMaterial, setShelfMaterial] = useState("3/4-plywood");

    const MATERIAL_MAX_SPAN: Record<string, number> = {
        "3/4-plywood": 36, "1-hardwood": 42, "3/4-mdf": 24,
        "3/4-particleboard": 20, "glass": 18,
    };

    const result = useMemo(() => {
        const maxSpan = MATERIAL_MAX_SPAN[shelfMaterial] || 36;
        const bracketSpacing = loadWeight > 30 ? Math.min(maxSpan, 24) : maxSpan;
        const numBrackets = Math.ceil(shelfLength / bracketSpacing) + 1;
        const actualSpacing = shelfLength / (numBrackets - 1);
        const overhang = Math.min(actualSpacing * 0.25, 6); // max 25% or 6 inches
        return { numBrackets, actualSpacing, bracketSpacing, maxSpan, overhang };
    }, [shelfLength, loadWeight, shelfMaterial]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📚 Shelf Bracket Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Shelf Length" value={shelfLength} onChange={setShelfLength} unit="in" min={12} max={120} />
                <InputField label="Load Weight" value={loadWeight} onChange={setLoadWeight} unit="lbs" min={5} max={100} />
                <SelectField label="Shelf Material" value={shelfMaterial} onChange={setShelfMaterial} options={[
                    { value: "3/4-plywood", label: '3/4" Plywood' },
                    { value: "1-hardwood", label: '1" Solid Hardwood' },
                    { value: "3/4-mdf", label: '3/4" MDF' },
                    { value: "3/4-particleboard", label: '3/4" Particleboard' },
                    { value: "glass", label: 'Tempered Glass' },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Brackets Needed" value={fmtInt(result.numBrackets)} />
                <ResultRow label="Bracket Spacing" value={fmt(result.actualSpacing, 1)} unit="in" />
                <ResultRow label="Max Unsupported Span" value={fmtInt(result.maxSpan)} unit="in" />
                <ResultRow label="End Overhang" value={fmt(result.overhang, 1)} unit="in" />
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
    "gravel": GravelCalc,
    "mulch": MulchCalc,
    "brick": BrickCalc,
    "fence": FenceCalc,
    "deck": DeckCalc,
    "staircase": StaircaseCalc,
    "lumber": LumberCalc,
    "insulation": InsulationCalc,
    "carpet": CarpetCalc,
    "sand": SandCalc,
    "topsoil": TopsoilCalc,
    "retaining-wall": RetainingWallCalc,
    "asphalt": AsphaltCalc,
    "rebar": RebarCalc,
    "siding": SidingCalc,
    "gutter": GutterCalc,
    "paver": PaverCalc,
    "wallpaper": WallpaperCalc,
    "pool-volume": PoolVolumeCalc,
    "fill-dirt": FillDirtCalc,
    "soil-amendment": SoilAmendmentCalc,
    "concrete-stairs": ConcreteStairsCalc,
    "aggregate": AggregateCalc,
    "column": ColumnCalc,
    "board-and-batten": BoardAndBattenCalc,
    "drainage": DrainageCalc,
    "plywood": PlywoodCalc,
    "ceiling-tile": CeilingTileCalc,
    "gabion-wall": GabionWallCalc,
    "post-hole": PostHoleCalc,
    "mortar": MortarCalc,
    "concrete-footing": ConcreteFootingCalc,
    "landscape-rock": LandscapeRockCalc,
    "roof-truss": RoofTrussCalc,
    "wainscoting": WainscotingCalc,
    "grading": GradingCalc,
    "stucco": StuccoCalc,
    "rain-barrel": RainBarrelCalc,
    "concrete-curb": ConcreteCurbCalc,
    "wire-mesh": WireMeshCalc,
    "lintel": LintelCalc,
    "concrete-slab": ConcreteSlabCalc,
    "roof-decking": RoofDeckingCalc,
    "vapor-barrier": VaporBarrierCalc,
    "excavation": ExcavationCalc,
    "crown-molding": CrownMoldingCalc,
    "soffit": SoffitCalc,
    "rip-rap": RipRapCalc,
    "baseboard": BaseboardCalc,
    "concrete-wall": ConcreteWallCalc,
    "french-drain": FrenchDrainCalc,
    "concrete-pier": ConcretePierCalc,
    "house-wrap": HouseWrapCalc,
    "stair-railing": StairRailingCalc,
    "drop-ceiling": DropCeilingCalc,
    "concrete-column": ConcreteColumnCalc,
    "flashing": FlashingCalc,
    "baluster": BalusterCalc,
    "backsplash": BacksplashCalc,
    "trench-fill": TrenchFillCalc,
    "concrete-driveway": ConcreteDrivewayCalc,
    "shingle": ShingleCalc,
    "caulk": CaulkCalc,
    "gable-wall": GableWallCalc,
    "deck-board": DeckBoardCalc,
    "mortar-bed": MortarBedCalc,
    "window-trim": WindowTrimCalc,
    "grout": GroutCalc,
    "concrete-patio": ConcretePatioCalc,
    "roof-underlayment": RoofUnderlaymentCalc,
    "anchor-bolt": AnchorBoltCalc,
    "brick-veneer": BrickVeneerCalc,
    "concrete-washout": ConcreteWashoutCalc,
    "ridge-vent": RidgeVentCalc,
    "stair-stringer": StairStringerCalc,
    "waterproofing-membrane": WaterproofingMembraneCalc,
    "weep-screed": WeepScreedCalc,
    "board-foot": BoardFootCalc,
    "concrete-beam": ConcreteBeamCalc,
    "downspout": DownspoutCalc,
    "cabinet-door": CabinetDoorCalc,
    "framing": FramingCalc,
    "lumber-weight": LumberWeightCalc,
    "rafter-length": RafterLengthCalc,
    "dimensional-lumber": DimensionalLumberCalc,
    "plywood-thickness": PlywoodThicknessCalc,
    "carpentry-cost": CarpentryCostCalc,
    "stud": StudCalc,
    "joist-span": JoistSpanCalc,
    "shelf-bracket": ShelfBracketCalc,
};

export default function ConstructionCalculatorCore({ calcType }: { calcType: string }) {
    const CalcComponent = CALC_MAP[calcType];
    if (!CalcComponent) return <p>Calculator not found: {calcType}</p>;
    return <CalcComponent />;
}

