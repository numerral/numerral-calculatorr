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
};

export default function ConstructionCalculatorCore({ calcType }: { calcType: string }) {
    const CalcComponent = CALC_MAP[calcType];
    if (!CalcComponent) return <p>Calculator not found: {calcType}</p>;
    return <CalcComponent />;
}

