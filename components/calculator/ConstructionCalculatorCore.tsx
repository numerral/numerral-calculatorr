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
    const [shape, setShape] = useState("slab");
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(4);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [diameter, setDiameter] = useState(2);
    const [height, setHeight] = useState(4);
    const [costPerYd, setCostPerYd] = useState(0);

    const result = useMemo(() => {
        let cuFt = 0;
        if (shape === "cylinder") {
            const r = diameter / 2;
            cuFt = Math.PI * r * r * height;
        } else {
            const depthFt = depthUnit === "inches" ? depth / 12 : depth;
            cuFt = length * width * depthFt;
        }
        const cuYd = cuFt / 27;
        const bags50 = cuFt / 0.375; // 50lb bag ≈ 0.375 cu ft
        const bags60 = cuFt / 0.45;  // 60lb bag ≈ 0.45 cu ft
        const bags80 = cuFt / 0.6;   // 80lb bag ≈ 0.6 cu ft
        const cuM = cuFt * 0.0283168;
        const weight = cuFt * 150; // concrete weighs ~150 lbs/cu ft
        const cost = costPerYd > 0 ? cuYd * costPerYd : 0;
        return { cuFt, cuYd, cuM, bags50, bags60, bags80, weight, cost };
    }, [shape, length, width, depth, depthUnit, diameter, height, costPerYd]);

    const isCylinder = shape === "cylinder";

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Concrete Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "slab", label: "Slab / Rectangle" },
                    { value: "cylinder", label: "Cylinder / Column" },
                    { value: "footing", label: "Footing / Wall" },
                ]} />
                {!isCylinder && <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />}
                {!isCylinder && <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />}
                {!isCylinder && <InputField label={shape === "footing" ? "Depth" : "Thickness"} value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />}
                {!isCylinder && <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" },
                ]} />}
                {isCylinder && <InputField label="Diameter" value={diameter} onChange={setDiameter} unit="ft" min={0.25} step={0.25} />}
                {isCylinder && <InputField label="Height" value={height} onChange={setHeight} unit="ft" min={0.5} step={0.5} />}
                <InputField label="Cost per Cubic Yard (optional)" value={costPerYd} onChange={setCostPerYd} unit="$" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Volume</h4>
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Cubic Meters" value={fmt(result.cuM, 4)} unit="m³" />
                <h4>Pre-Mix Bags</h4>
                <ResultRow label="50 lb Bags" value={fmtInt(result.bags50)} unit="bags" />
                <ResultRow label="60 lb Bags" value={fmtInt(result.bags60)} unit="bags" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
                <h4>Weight &amp; Cost</h4>
                <ResultRow label="Concrete Weight" value={fmt(result.weight)} unit="lbs" />
                {result.cost > 0 && <ResultRow label="Estimated Cost" value={`$${fmt(result.cost, 2)}`} />}
            </div>
        </div>
    );
}

/* ──────────── 2. CONCRETE BLOCK CALCULATOR ──────────── */
function ConcreteBlockCalc() {
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(8);
    const [blockSize, setBlockSize] = useState("8x8x16");
    const [blockLength, setBlockLength] = useState(16);
    const [blockHeight, setBlockHeight] = useState(8);
    const [blockWidth, setBlockWidth] = useState(8);
    const [openingsSqFt, setOpeningsSqFt] = useState(0);
    const [costPerBlock, setCostPerBlock] = useState(0);

    // Sync preset → dimensions
    const handlePreset = (v: string) => {
        setBlockSize(v);
        if (v === "8x8x16") { setBlockLength(16); setBlockHeight(8); setBlockWidth(8); }
        else if (v === "8x4x16") { setBlockLength(16); setBlockHeight(4); setBlockWidth(8); }
        else if (v === "8x8x8") { setBlockLength(8); setBlockHeight(8); setBlockWidth(8); }
        else if (v === "12x8x16") { setBlockLength(16); setBlockHeight(8); setBlockWidth(12); }
    };

    const result = useMemo(() => {
        const wallArea = Math.max(0, wallLength * wallHeight - openingsSqFt);
        const blockLenFt = blockLength / 12;
        const blockHtFt = blockHeight / 12;
        const blockArea = blockLenFt * blockHtFt;
        const blocksExact = blockArea > 0 ? wallArea / blockArea : 0;
        const blocksWithWaste = Math.ceil(blocksExact * 1.05);

        // Mortar: ~3 bags of cement per 100 blocks; 1 cu yd sand per 7 bags cement
        const mortarBags80 = Math.ceil(blocksWithWaste / 33);
        const cementBags = Math.ceil(blocksWithWaste * 3 / 100);
        const sandCuYd = Math.round(cementBags / 7 * 10) / 10;

        // Grout fill: cell volume per block (subtract webs and shells)
        // Standard 8x8x16: shell ~1.25", 3 webs ~1" each, 2 cells
        const shellIn = 1.25;
        const webIn = 1;
        const cellW = blockWidth - 2 * shellIn;
        const cellL = (blockLength - 3 * webIn) / 2;
        const cellH = blockHeight;
        const cellVolCuIn = cellW * cellL * cellH * 2; // 2 cells
        const groutCuYd = Math.round(blocksWithWaste * cellVolCuIn / 46656 * 100) / 100;

        // Cost
        const totalCost = costPerBlock > 0 ? blocksWithWaste * costPerBlock : 0;

        return { wallArea, blocksExact, blocksWithWaste, mortarBags80, cementBags, sandCuYd, groutCuYd, totalCost };
    }, [wallLength, wallHeight, openingsSqFt, blockLength, blockHeight, blockWidth, costPerBlock]);

    const isCustom = blockSize === "custom";

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Concrete Block Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Openings (optional)" value={openingsSqFt} onChange={setOpeningsSqFt} unit="sq ft" min={0} />
                <SelectField label="Block Size" value={blockSize} onChange={handlePreset} options={[
                    { value: "8x8x16", label: "Standard 8×8×16" },
                    { value: "8x4x16", label: "Half-Height 8×4×16" },
                    { value: "8x8x8", label: "Half-Length 8×8×8" },
                    { value: "12x8x16", label: "Thick 12×8×16" },
                    { value: "custom", label: "Custom Size" },
                ]} />
                {isCustom && <InputField label="Block Length" value={blockLength} onChange={setBlockLength} unit="in" min={4} />}
                {isCustom && <InputField label="Block Height" value={blockHeight} onChange={setBlockHeight} unit="in" min={4} />}
                {isCustom && <InputField label="Block Width (depth)" value={blockWidth} onChange={setBlockWidth} unit="in" min={4} />}
                <InputField label="Cost per Block (optional)" value={costPerBlock} onChange={setCostPerBlock} unit="$" min={0} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4>Blocks</h4>
                <ResultRow label="Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                <ResultRow label="Blocks (exact)" value={fmtInt(result.blocksExact)} unit="blocks" />
                <ResultRow label="Blocks (w/ 5% waste)" value={fmtInt(result.blocksWithWaste)} unit="blocks" />
                <h4>Mortar &amp; Fill</h4>
                <ResultRow label="Mortar Mix (80 lb bags)" value={fmtInt(result.mortarBags80)} unit="bags" />
                <ResultRow label="Portland Cement" value={fmtInt(result.cementBags)} unit="bags" />
                <ResultRow label="Sand" value={fmt(result.sandCuYd, 1)} unit="cu yd" />
                <ResultRow label="Grout / Core Fill" value={fmt(result.groutCuYd)} unit="cu yd" />
                {result.totalCost > 0 && <>
                    <h4>Cost</h4>
                    <ResultRow label="Block Cost" value={`$${fmt(result.totalCost, 2)}`} />
                </>}
            </div>
        </div>
    );
}

/* ──────────── 3. FLOORING CALCULATOR ──────────── */
function FlooringCalc() {
    const TYPES: Record<string, { price: number; waste: number; box: number }> = {
        hardwood: { price: 8, waste: 10, box: 20 },
        laminate: { price: 2.5, waste: 10, box: 22 },
        lvp: { price: 3.5, waste: 10, box: 24 },
        engineered: { price: 6, waste: 10, box: 20 },
        bamboo: { price: 5, waste: 10, box: 22 },
        tile: { price: 4, waste: 15, box: 15 },
    };

    const [floorType, setFloorType] = useState("hardwood");
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(10);
    const [waste, setWaste] = useState(10);
    const [boxCoverage, setBoxCoverage] = useState(20);
    const [pricePerSqFt, setPricePerSqFt] = useState(8);

    const handleType = (v: string) => {
        setFloorType(v);
        const t = TYPES[v];
        if (t) { setPricePerSqFt(t.price); setWaste(t.waste); setBoxCoverage(t.box); }
    };

    const result = useMemo(() => {
        const area = length * width;
        const withWaste = area * (1 + waste / 100);
        const boxes = boxCoverage > 0 ? Math.ceil(withWaste / boxCoverage) : 0;
        const cost = withWaste * pricePerSqFt;
        // Underlayment: standard roll = 200 sq ft
        const underlaymentRolls = Math.ceil(withWaste / 200);
        // Trim/baseboard: perimeter minus one doorway (~3 ft)
        const perimeter = 2 * (length + width);
        const trimLf = Math.max(0, perimeter - 3);
        return { area, withWaste, boxes, cost, underlaymentRolls, trimLf, perimeter };
    }, [length, width, waste, boxCoverage, pricePerSqFt]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Flooring Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Flooring Type" value={floorType} onChange={handleType} options={[
                    { value: "hardwood", label: "Hardwood" },
                    { value: "laminate", label: "Laminate" },
                    { value: "lvp", label: "Vinyl Plank (LVP)" },
                    { value: "engineered", label: "Engineered Wood" },
                    { value: "bamboo", label: "Bamboo" },
                    { value: "tile", label: "Tile" },
                ]} />
                <InputField label="Room Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Room Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
                <InputField label="Box Coverage" value={boxCoverage} onChange={setBoxCoverage} unit="sq ft/box" min={1} />
                <InputField label="Price per sq ft" value={pricePerSqFt} onChange={setPricePerSqFt} unit="$" min={0} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4>Area &amp; Material</h4>
                <ResultRow label="Room Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Material Needed (+ waste)" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Boxes Needed" value={fmtInt(result.boxes)} unit="boxes" />
                <h4>Underlayment &amp; Trim</h4>
                <ResultRow label="Underlayment Rolls" value={fmtInt(result.underlaymentRolls)} unit="rolls (200 sq ft)" />
                <ResultRow label="Baseboard / Trim" value={fmt(result.trimLf)} unit="linear ft" />
                <ResultRow label="Room Perimeter" value={fmt(result.perimeter)} unit="ft" />
                <h4>Cost</h4>
                <ResultRow label="Estimated Material Cost" value={`$${fmt(result.cost, 2)}`} />
            </div>
        </div>
    );
}

/* ──────────── 4. TILE CALCULATOR ──────────── */
function TileCalc() {
    const PRESETS: Record<string, { l: number; w: number; gap: number; perBox: number }> = {
        "12x12": { l: 12, w: 12, gap: 0.125, perBox: 10 },
        "6x6": { l: 6, w: 6, gap: 0.125, perBox: 44 },
        "18x18": { l: 18, w: 18, gap: 0.1875, perBox: 6 },
        "24x24": { l: 24, w: 24, gap: 0.1875, perBox: 4 },
        "3x6": { l: 6, w: 3, gap: 0.0625, perBox: 60 },
    };

    const [preset, setPreset] = useState("12x12");
    const [areaLength, setAreaLength] = useState(10);
    const [areaWidth, setAreaWidth] = useState(10);
    const [tileLength, setTileLength] = useState(12);
    const [tileWidth, setTileWidth] = useState(12);
    const [gap, setGap] = useState(0.125);
    const [waste, setWaste] = useState(10);
    const [tilesPerBox, setTilesPerBox] = useState(10);
    const [pricePerSqFt, setPricePerSqFt] = useState(0);

    const handlePreset = (v: string) => {
        setPreset(v);
        const p = PRESETS[v];
        if (p) { setTileLength(p.l); setTileWidth(p.w); setGap(p.gap); setTilesPerBox(p.perBox); }
    };

    const isCustom = preset === "custom";

    const result = useMemo(() => {
        const areaSqFt = areaLength * areaWidth;
        const tileLFt = tileLength / 12;
        const tileWFt = tileWidth / 12;
        const effectiveL = tileLFt + gap / 12;
        const effectiveW = tileWFt + gap / 12;
        const tileArea = effectiveL * effectiveW;
        const tilesRaw = tileArea > 0 ? areaSqFt / tileArea : 0;
        const tilesWithWaste = Math.ceil(tilesRaw * (1 + waste / 100));
        const boxes = tilesPerBox > 0 ? Math.ceil(tilesWithWaste / tilesPerBox) : 0;
        // Grout: ~1 lb per 10 sq ft for standard tile with 1/8" gap
        const groutLbs = Math.ceil(areaSqFt / 10);
        // Thinset: 50 lb bag covers ~50 sq ft with 1/4" x 1/4" trowel
        const thinsetBags = Math.ceil(areaSqFt / 50);
        // Cost
        const cost = pricePerSqFt > 0 ? areaSqFt * pricePerSqFt : 0;
        return { areaSqFt, tilesRaw, tilesWithWaste, boxes, groutLbs, thinsetBags, cost };
    }, [areaLength, areaWidth, tileLength, tileWidth, gap, waste, tilesPerBox, pricePerSqFt]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔲 Tile Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Tile Size" value={preset} onChange={handlePreset} options={[
                    { value: "12x12", label: '12×12" (Standard)' },
                    { value: "6x6", label: '6×6" (Small)' },
                    { value: "18x18", label: '18×18" (Large)' },
                    { value: "24x24", label: '24×24" (XL)' },
                    { value: "3x6", label: '3×6" (Subway)' },
                    { value: "custom", label: "Custom Size" },
                ]} />
                <InputField label="Area Length" value={areaLength} onChange={setAreaLength} unit="ft" min={1} />
                <InputField label="Area Width" value={areaWidth} onChange={setAreaWidth} unit="ft" min={1} />
                {isCustom && <InputField label="Tile Length" value={tileLength} onChange={setTileLength} unit="in" min={1} />}
                {isCustom && <InputField label="Tile Width" value={tileWidth} onChange={setTileWidth} unit="in" min={1} />}
                <InputField label="Gap Width" value={gap} onChange={setGap} unit="in" min={0} step={0.0625} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
                <InputField label="Tiles per Box" value={tilesPerBox} onChange={setTilesPerBox} min={1} />
                <InputField label="Price per sq ft (optional)" value={pricePerSqFt} onChange={setPricePerSqFt} unit="$" min={0} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Tiles</h4>
                <ResultRow label="Total Area" value={fmt(result.areaSqFt)} unit="sq ft" />
                <ResultRow label="Tiles (exact)" value={fmtInt(result.tilesRaw)} unit="tiles" />
                <ResultRow label="Tiles (+ waste)" value={fmtInt(result.tilesWithWaste)} unit="tiles" />
                <ResultRow label="Boxes Needed" value={fmtInt(result.boxes)} unit="boxes" />
                <h4>Materials</h4>
                <ResultRow label="Grout" value={fmtInt(result.groutLbs)} unit="lbs" />
                <ResultRow label="Thinset Mortar" value={fmtInt(result.thinsetBags)} unit="bags (50 lb)" />
                {result.cost > 0 && <>
                    <h4>Cost</h4>
                    <ResultRow label="Estimated Tile Cost" value={`$${fmt(result.cost, 2)}`} />
                </>}
            </div>
        </div>
    );
}

/* ──────────── 5. ROOFING CALCULATOR ──────────── */
function RoofingCalc() {
    const MATERIALS: Record<string, { costPerSq: number; label: string }> = {
        "3tab": { costPerSq: 90, label: "Asphalt 3-Tab" },
        "arch": { costPerSq: 130, label: "Architectural" },
        "metal": { costPerSq: 350, label: "Metal Panels" },
        "shake": { costPerSq: 400, label: "Wood Shake" },
        "clay": { costPerSq: 800, label: "Clay / Concrete Tile" },
    };

    const [material, setMaterial] = useState("arch");
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(40);
    const [pitch, setPitch] = useState("4");
    const [waste, setWaste] = useState(10);
    const [costPerSquare, setCostPerSquare] = useState(130);

    const handleMaterial = (v: string) => {
        setMaterial(v);
        const m = MATERIALS[v];
        if (m) setCostPerSquare(m.costPerSq);
    };

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
        const squares = withWaste / 100;
        const bundles = Math.ceil(squares * 3);
        const underlaymentRolls = Math.ceil(withWaste / 400);
        // Drip edge: perimeter of roof
        const perimeter = 2 * (length + width);
        const dripEdgeLf = Math.ceil(perimeter * 1.1); // 10% overlap
        // Ridge cap: ~length of roof (ridge runs along length)
        const ridgeCapLf = Math.ceil(length * 1.1);
        // Roofing nails: ~2.5 lbs per square
        const nailsLbs = Math.ceil(squares * 2.5);
        // Cost
        const totalCost = costPerSquare > 0 ? squares * costPerSquare : 0;
        return { footprintArea, actualArea, withWaste, squares, bundles, underlaymentRolls, dripEdgeLf, ridgeCapLf, nailsLbs, totalCost };
    }, [length, width, pitch, waste, costPerSquare]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Roofing Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Roofing Material" value={material} onChange={handleMaterial} options={
                    Object.entries(MATERIALS).map(([k, v]) => ({ value: k, label: v.label }))
                } />
                <InputField label="Roof Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Roof Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <SelectField label="Roof Pitch" value={pitch} onChange={setPitch} options={
                    Object.keys(PITCH_MULTIPLIERS).map((p) => ({ value: p, label: `${p}:12` }))
                } />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
                <InputField label="Cost per Square" value={costPerSquare} onChange={setCostPerSquare} unit="$" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Area</h4>
                <ResultRow label="Footprint Area" value={fmt(result.footprintArea)} unit="sq ft" />
                <ResultRow label="Actual Roof Area" value={fmt(result.actualArea)} unit="sq ft" />
                <ResultRow label="Total (+ waste)" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Roofing Squares" value={fmt(result.squares, 1)} unit="squares" />
                <h4>Materials</h4>
                <ResultRow label="Shingle Bundles" value={fmtInt(result.bundles)} unit="bundles" />
                <ResultRow label="Underlayment Rolls" value={fmtInt(result.underlaymentRolls)} unit="rolls (400 sq ft)" />
                <ResultRow label="Drip Edge" value={fmtInt(result.dripEdgeLf)} unit="linear ft" />
                <ResultRow label="Ridge Cap" value={fmtInt(result.ridgeCapLf)} unit="linear ft" />
                <ResultRow label="Roofing Nails" value={fmtInt(result.nailsLbs)} unit="lbs" />
                {result.totalCost > 0 && <>
                    <h4>Cost</h4>
                    <ResultRow label="Estimated Material Cost" value={`$${fmt(result.totalCost, 2)}`} />
                </>}
            </div>
        </div>
    );
}

/* ──────────── 6. ROOF PITCH CALCULATOR ──────────── */
function RoofPitchCalc() {
    const COMMON_PITCHES: Record<string, { rise: number; label: string }> = {
        "0": { rise: 0, label: "Flat (0:12)" },
        "2": { rise: 2, label: "Low (2:12)" },
        "4": { rise: 4, label: "Standard (4:12)" },
        "6": { rise: 6, label: "Conventional (6:12)" },
        "8": { rise: 8, label: "Steep (8:12)" },
        "10": { rise: 10, label: "Very Steep (10:12)" },
        "12": { rise: 12, label: "45° (12:12)" },
        "custom": { rise: 0, label: "Custom" },
    };

    const [preset, setPreset] = useState("6");
    const [rise, setRise] = useState(6);
    const [run, setRun] = useState(12);

    const handlePreset = (v: string) => {
        setPreset(v);
        const p = COMMON_PITCHES[v];
        if (p && v !== "custom") { setRise(p.rise); setRun(12); }
    };

    const isCustom = preset === "custom";

    const result = useMemo(() => {
        const pitchRatio = run > 0 ? rise / run * 12 : 0;
        const angleRad = run > 0 ? Math.atan(rise / run) : 0;
        const angleDeg = angleRad * (180 / Math.PI);
        const slopePercent = run > 0 ? (rise / run) * 100 : 0;
        const rafterLength = Math.sqrt(rise * rise + run * run);
        const multiplier = run > 0 ? rafterLength / run : 1;
        // Classification
        let classification = "Flat";
        let walkable = "Easy — no safety equipment needed";
        if (pitchRatio > 0 && pitchRatio <= 1) { classification = "Flat"; walkable = "Easy — no safety equipment needed"; }
        else if (pitchRatio <= 4) { classification = "Low Slope"; walkable = "Easy — standard footwear"; }
        else if (pitchRatio <= 8) { classification = "Conventional"; walkable = "Moderate — use caution and soft-soled shoes"; }
        else if (pitchRatio <= 12) { classification = "Steep"; walkable = "Difficult — roof jacks and harness required"; }
        else { classification = "Very Steep"; walkable = "Not walkable — scaffolding and equipment required"; }
        return { pitchRatio, angleDeg, slopePercent, rafterLength, multiplier, classification, walkable };
    }, [rise, run]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Roof Pitch Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Common Pitch" value={preset} onChange={handlePreset} options={
                    Object.entries(COMMON_PITCHES).map(([k, v]) => ({ value: k, label: v.label }))
                } />
                {isCustom && <InputField label="Rise" value={rise} onChange={setRise} unit="in" min={0} step={0.5} />}
                {isCustom && <InputField label="Run" value={run} onChange={setRun} unit="in" min={1} step={0.5} />}
            </div>
            <div className="con-calc__results">
                <h4>Pitch</h4>
                <ResultRow label="Pitch" value={`${fmt(result.pitchRatio, 1)}:12`} />
                <ResultRow label="Angle" value={fmt(result.angleDeg, 1)} unit="degrees" />
                <ResultRow label="Slope" value={fmt(result.slopePercent, 1)} unit="%" />
                <h4>Rafter</h4>
                <ResultRow label="Multiplier" value={fmt(result.multiplier, 3)} unit="×" />
                <ResultRow label="Rafter Length" value={fmt(result.rafterLength, 1)} unit="in per ft run" />
                <h4>Classification</h4>
                <ResultRow label="Roof Type" value={result.classification} />
                <ResultRow label="Walkability" value={result.walkable} />
            </div>
        </div>
    );
}

/* ──────────── 7. PAINT CALCULATOR ──────────── */
const PAINT_TYPES: { value: string; label: string; coverage: number }[] = [
    { value: "interior-flat", label: "Interior Flat / Matte", coverage: 400 },
    { value: "interior-eggshell", label: "Interior Eggshell / Satin", coverage: 350 },
    { value: "interior-semi", label: "Interior Semi-Gloss", coverage: 350 },
    { value: "interior-gloss", label: "Interior High-Gloss", coverage: 300 },
    { value: "exterior-flat", label: "Exterior Flat / Satin", coverage: 300 },
    { value: "exterior-semi", label: "Exterior Semi-Gloss", coverage: 275 },
    { value: "primer", label: "Primer / Sealer", coverage: 300 },
    { value: "ceiling", label: "Ceiling Paint", coverage: 400 },
    { value: "custom", label: "Custom Coverage", coverage: 350 },
];

function PaintCalc() {
    const [paintType, setPaintType] = useState("interior-eggshell");
    const [roomLength, setRoomLength] = useState(12);
    const [roomWidth, setRoomWidth] = useState(10);
    const [wallHeight, setWallHeight] = useState(8);
    const [doors, setDoors] = useState(1);
    const [windows, setWindows] = useState(2);
    const [coats, setCoats] = useState(2);
    const [coverage, setCoverage] = useState(350);
    const [includeCeiling, setIncludeCeiling] = useState(false);
    const [includeTrim, setIncludeTrim] = useState(false);
    const [primerCoats, setPrimerCoats] = useState(0);
    const [costPerGal, setCostPerGal] = useState(40);

    const handlePaintType = (v: string) => {
        setPaintType(v);
        const pt = PAINT_TYPES.find(p => p.value === v);
        if (pt && v !== "custom") setCoverage(pt.coverage);
    };

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const wallArea = perimeter * wallHeight;
        const doorArea = doors * 21;
        const windowArea = windows * 15;
        const wallPaintable = Math.max(0, wallArea - doorArea - windowArea);
        const ceilingArea = includeCeiling ? roomLength * roomWidth : 0;
        const trimLF = includeTrim ? perimeter : 0;
        const trimArea = trimLF * 0.33; // ~4 inches tall baseboard
        const totalPaintable = wallPaintable + ceilingArea + trimArea;
        const totalArea = totalPaintable * coats;
        const gallons = coverage > 0 ? totalArea / coverage : 0;
        const primerArea = totalPaintable * primerCoats;
        const primerGallons = primerArea / 300;
        const paintCost = Math.ceil(gallons) * costPerGal;
        const primerCost = Math.ceil(primerGallons) * 30; // avg primer ~$30/gal
        return { wallArea, wallPaintable, ceilingArea, trimArea, trimLF, totalPaintable, totalArea, gallons, primerGallons, paintCost, primerCost };
    }, [roomLength, roomWidth, wallHeight, doors, windows, coats, coverage, includeCeiling, includeTrim, primerCoats, costPerGal]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🎨 Paint Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Paint Type" value={paintType} onChange={handlePaintType}
                    options={PAINT_TYPES.map(p => ({ value: p.value, label: p.label }))} />
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
                <InputField label="Paint Coats" value={coats} onChange={setCoats} min={1} max={4} />
                <InputField label="Primer Coats" value={primerCoats} onChange={setPrimerCoats} min={0} max={2} />
                {paintType === "custom" && (
                    <InputField label="Coverage" value={coverage} onChange={setCoverage} unit="sq ft/gal" min={100} />
                )}
                <InputField label="Cost per Gallon" value={costPerGal} onChange={setCostPerGal} unit="$" min={0} />
                <div className="con-input">
                    <label className="con-input__label" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span><input type="checkbox" checked={includeCeiling} onChange={(e) => setIncludeCeiling(e.target.checked)} /> Include Ceiling</span>
                        <span><input type="checkbox" checked={includeTrim} onChange={(e) => setIncludeTrim(e.target.checked)} /> Include Trim / Baseboard</span>
                    </label>
                </div>
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">AREA</h4>
                <ResultRow label="Total Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                <ResultRow label="Paintable Wall Area" value={fmt(result.wallPaintable)} unit="sq ft" />
                {includeCeiling && <ResultRow label="Ceiling Area" value={fmt(result.ceilingArea)} unit="sq ft" />}
                {includeTrim && <ResultRow label="Trim Area" value={fmt(result.trimArea)} unit="sq ft" />}
                <ResultRow label="Total Paintable Area" value={fmt(result.totalPaintable)} unit="sq ft" />
                <h4 className="con-calc__group-label">PAINT</h4>
                <ResultRow label="Coverage (all coats)" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Paint Needed" value={fmt(result.gallons, 1)} unit="gallons" />
                <ResultRow label="Buy (rounded up)" value={fmtInt(result.gallons)} unit="gallons" />
                {primerCoats > 0 && <ResultRow label="Primer Needed" value={fmt(result.primerGallons, 1)} unit="gallons" />}
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Paint Cost" value={`$${fmtInt(result.paintCost)}`} />
                {primerCoats > 0 && <ResultRow label="Primer Cost (~$30/gal)" value={`$${fmtInt(result.primerCost)}`} />}
                <ResultRow label="Total Estimated Cost" value={`$${fmtInt(result.paintCost + result.primerCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 8. DRYWALL CALCULATOR ──────────── */
const DRYWALL_SHEETS: { value: string; label: string; sqft: number; weight: number }[] = [
    { value: "4x8", label: "4 × 8 ft (standard)", sqft: 32, weight: 54 },
    { value: "4x10", label: "4 × 10 ft", sqft: 40, weight: 68 },
    { value: "4x12", label: "4 × 12 ft", sqft: 48, weight: 82 },
];

const DRYWALL_TYPES: { value: string; label: string; pricePer: number }[] = [
    { value: "standard", label: "Standard ½\" (most common)", pricePer: 12 },
    { value: "fire-rated", label: "Fire-Rated ⅝\" (Type X)", pricePer: 16 },
    { value: "moisture", label: "Moisture-Resistant (green board)", pricePer: 15 },
    { value: "mold", label: "Mold-Resistant (purple board)", pricePer: 18 },
    { value: "soundproof", label: "Soundproof (QuietRock / 5⁄8\")", pricePer: 45 },
];

function DrywallCalc() {
    const [roomLength, setRoomLength] = useState(12);
    const [roomWidth, setRoomWidth] = useState(10);
    const [wallHeight, setWallHeight] = useState(8);
    const [doors, setDoors] = useState(1);
    const [windows, setWindows] = useState(2);
    const [includeCeiling, setIncludeCeiling] = useState(true);
    const [sheetSize, setSheetSize] = useState("4x8");
    const [drywallType, setDrywallType] = useState("standard");
    const [costPerSheet, setCostPerSheet] = useState(12);

    const handleDrywallType = (v: string) => {
        setDrywallType(v);
        const dt = DRYWALL_TYPES.find(d => d.value === v);
        if (dt) setCostPerSheet(dt.pricePer);
    };

    const result = useMemo(() => {
        const perimeter = 2 * (roomLength + roomWidth);
        const wallArea = perimeter * wallHeight;
        const ceilingArea = includeCeiling ? roomLength * roomWidth : 0;
        const openingsArea = (doors * 21) + (windows * 15);
        const netArea = Math.max(0, wallArea + ceilingArea - openingsArea);
        const wasteArea = netArea * 1.10; // 10% waste
        const sheet = DRYWALL_SHEETS.find(s => s.value === sheetSize) || DRYWALL_SHEETS[0];
        const sheets = wasteArea / sheet.sqft;
        const jointTape = sheets * 12;
        const jointCompound = netArea / 100;
        const screws = netArea * 0.8;
        const totalWeight = Math.ceil(sheets) * sheet.weight;
        const materialCost = Math.ceil(sheets) * costPerSheet;
        const tapeCost = Math.ceil(jointTape / 250) * 8; // ~250 ft roll = $8
        const mudCost = Math.ceil(jointCompound) * 16; // ~$16 per bucket
        const screwCost = Math.ceil(screws / 150) * 10; // ~150 screws/lb = $10/lb box
        return { wallArea, ceilingArea, netArea, wasteArea, sheets, jointTape, jointCompound, screws, totalWeight, materialCost, tapeCost, mudCost, screwCost };
    }, [roomLength, roomWidth, wallHeight, doors, windows, includeCeiling, sheetSize, costPerSheet]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪟 Drywall Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Drywall Type" value={drywallType} onChange={handleDrywallType}
                    options={DRYWALL_TYPES.map(d => ({ value: d.value, label: d.label }))} />
                <SelectField label="Sheet Size" value={sheetSize} onChange={setSheetSize}
                    options={DRYWALL_SHEETS.map(s => ({ value: s.value, label: s.label }))} />
                <InputField label="Room Length" value={roomLength} onChange={setRoomLength} unit="ft" min={1} />
                <InputField label="Room Width" value={roomWidth} onChange={setRoomWidth} unit="ft" min={1} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                <InputField label="Doors" value={doors} onChange={setDoors} min={0} />
                <InputField label="Windows" value={windows} onChange={setWindows} min={0} />
                <InputField label="Cost per Sheet" value={costPerSheet} onChange={setCostPerSheet} unit="$" min={0} />
                <div className="con-input">
                    <label className="con-input__label">Include Ceiling</label>
                    <div className="con-toggle">
                        <button className={`con-toggle__btn ${includeCeiling ? "con-toggle__btn--active" : ""}`} onClick={() => setIncludeCeiling(true)}>Yes</button>
                        <button className={`con-toggle__btn ${!includeCeiling ? "con-toggle__btn--active" : ""}`} onClick={() => setIncludeCeiling(false)}>No</button>
                    </div>
                </div>
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">AREA</h4>
                <ResultRow label="Wall Area" value={fmt(result.wallArea)} unit="sq ft" />
                {includeCeiling && <ResultRow label="Ceiling Area" value={fmt(result.ceilingArea)} unit="sq ft" />}
                <ResultRow label="Net Drywall Area" value={fmt(result.netArea)} unit="sq ft" />
                <ResultRow label="With 10% Waste" value={fmt(result.wasteArea)} unit="sq ft" />
                <h4 className="con-calc__group-label">MATERIALS</h4>
                <ResultRow label="Sheets Needed" value={fmtInt(result.sheets)} unit="sheets" />
                <ResultRow label="Total Weight" value={fmtInt(result.totalWeight)} unit="lbs" />
                <ResultRow label="Joint Tape" value={fmtInt(result.jointTape)} unit="ft" />
                <ResultRow label="Joint Compound" value={fmt(result.jointCompound, 1)} unit="buckets" />
                <ResultRow label="Drywall Screws" value={fmtInt(result.screws)} unit="screws" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Drywall Sheets" value={`$${fmtInt(result.materialCost)}`} />
                <ResultRow label="Joint Tape" value={`$${fmtInt(result.tapeCost)}`} />
                <ResultRow label="Joint Compound" value={`$${fmtInt(result.mudCost)}`} />
                <ResultRow label="Screws" value={`$${fmtInt(result.screwCost)}`} />
                <ResultRow label="Total Material Cost" value={`$${fmtInt(result.materialCost + result.tapeCost + result.mudCost + result.screwCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 9. SQUARE FOOTAGE CALCULATOR ──────────── */
function SquareFootageCalc() {
    const [shape, setShape] = useState("rectangle");
    const [dim1, setDim1] = useState(20);
    const [dim1in, setDim1in] = useState(0);
    const [dim2, setDim2] = useState(15);
    const [dim2in, setDim2in] = useState(0);
    const [dim3, setDim3] = useState(10);
    const [dim3in, setDim3in] = useState(0);
    const [dim4, setDim4] = useState(8);
    const [dim4in, setDim4in] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [waste, setWaste] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceUnit, setPriceUnit] = useState("sqft");
    const [boxCoverage, setBoxCoverage] = useState(20);

    const toFt = (ft: number, inches: number) => ft + inches / 12;
    const d1 = toFt(dim1, dim1in);
    const d2 = toFt(dim2, dim2in);
    const d3 = toFt(dim3, dim3in);
    const d4 = toFt(dim4, dim4in);

    const result = useMemo(() => {
        let sqFt = 0;
        switch (shape) {
            case "rectangle": sqFt = d1 * d2; break;
            case "square": sqFt = d1 * d1; break;
            case "rect-border": sqFt = Math.max(0, (d1 * d2) - (d3 * d4)); break;
            case "wall-window": sqFt = Math.max(0, (d1 * d2) - (d3 * d4)); break;
            case "cathedral": sqFt = 0.5 * d1 * (d2 + d3); break;
            case "circle": sqFt = Math.PI * (d1 / 2) * (d1 / 2); break;
            case "circle-border": { const outerD = d1 + 2 * d2; sqFt = Math.PI * (outerD / 2) ** 2 - Math.PI * (d1 / 2) ** 2; break; }
            case "annulus": sqFt = Math.max(0, Math.PI * (d1 / 2) ** 2 - Math.PI * (d2 / 2) ** 2); break;
            case "triangle": { const s = (d1 + d2 + d3) / 2; const a2 = s * (s - d1) * (s - d2) * (s - d3); sqFt = a2 > 0 ? Math.sqrt(a2) : 0; break; }
            case "triangle-bh": sqFt = 0.5 * d1 * d2; break;
            case "trapezoid": sqFt = 0.5 * (d1 + d2) * d3; break;
        }
        const totalSqFt = sqFt * quantity;
        const withWaste = totalSqFt * (1 + waste / 100);
        const sqM = withWaste * 0.092903;
        const sqYd = withWaste / 9;
        const acres = withWaste / 43560;
        const sqIn = withWaste * 144;
        let totalCost = 0;
        if (price > 0) {
            if (priceUnit === "sqft") totalCost = withWaste * price;
            else if (priceUnit === "sqyd") totalCost = sqYd * price;
            else if (priceUnit === "sqm") totalCost = sqM * price;
            else if (priceUnit === "box") totalCost = Math.ceil(withWaste / (boxCoverage || 1)) * price;
        }
        const boxesNeeded = priceUnit === "box" && boxCoverage > 0 ? Math.ceil(withWaste / boxCoverage) : 0;
        return { sqFt, totalSqFt, withWaste, sqM, sqYd, acres, sqIn, totalCost, boxesNeeded };
    }, [shape, d1, d2, d3, d4, quantity, waste, price, priceUnit, boxCoverage]);

    type SL = { d1: string; d2: string; d3: string; d4: string; formula: string };
    const CFG: Record<string, SL> = {
        rectangle:      { d1: "Length", d2: "Width", d3: "", d4: "", formula: "Area = Length x Width" },
        square:         { d1: "Side Length", d2: "", d3: "", d4: "", formula: "Area = Side squared" },
        "rect-border":  { d1: "Outer Length", d2: "Outer Width", d3: "Inner Length", d4: "Inner Width", formula: "Area = Outer Area minus Inner Area" },
        "wall-window":  { d1: "Wall Width", d2: "Wall Height", d3: "Window/Door Width", d4: "Window/Door Height", formula: "Area = Wall Area minus Opening Area" },
        cathedral:      { d1: "Width", d2: "Height 1 (short side)", d3: "Height 2 (tall side)", d4: "", formula: "Area = 0.5 x Width x (H1 + H2)" },
        circle:         { d1: "Diameter", d2: "", d3: "", d4: "", formula: "Area = PI x (Diameter / 2) squared" },
        "circle-border":{ d1: "Inner Diameter", d2: "Border Width", d3: "", d4: "", formula: "Area = Outer Circle minus Inner Circle" },
        annulus:        { d1: "Outer Diameter", d2: "Inner Diameter", d3: "", d4: "", formula: "Area = PI x (Outer/2) sq minus PI x (Inner/2) sq" },
        triangle:       { d1: "Side A", d2: "Side B", d3: "Side C", d4: "", formula: "Heron Formula - any triangle shape" },
        "triangle-bh":  { d1: "Base", d2: "Height (perpendicular)", d3: "", d4: "", formula: "Area = 0.5 x Base x Height" },
        trapezoid:      { d1: "Base 1 (a)", d2: "Base 2 (b)", d3: "Height", d4: "", formula: "Area = 0.5 x (a + b) x Height" },
    };
    const cfg = CFG[shape] || CFG.rectangle;

    function FtInInput({ label, ft, ftIn, onFt, onIn }: { label: string; ft: number; ftIn: number; onFt: (v: number) => void; onIn: (v: number) => void }) {
        return (
            <div className="con-input">
                <label className="con-input__label">{label}</label>
                <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" className="con-input__field" value={ft} onChange={e => onFt(Number(e.target.value))} min={0} step={1} style={{ flex: 2 }} placeholder="ft" />
                    <input type="number" className="con-input__field" value={ftIn} onChange={e => onIn(Number(e.target.value))} min={0} max={11} step={1} style={{ flex: 1 }} placeholder="in" />
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2, display: "block" }}>{ft}ft {ftIn}in = {(ft + ftIn / 12).toFixed(2)}ft</span>
            </div>
        );
    }

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Square Footage Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle",     label: "Rectangle" },
                    { value: "square",        label: "Square" },
                    { value: "rect-border",   label: "Rectangle Border / Frame" },
                    { value: "wall-window",   label: "Wall minus Window / Door" },
                    { value: "cathedral",     label: "Cathedral Wall (Right Trapezoid)" },
                    { value: "circle",        label: "Circle" },
                    { value: "circle-border", label: "Circle Border" },
                    { value: "annulus",       label: "Annulus (Ring / Donut)" },
                    { value: "triangle",      label: "Triangle - 3 sides (any shape)" },
                    { value: "triangle-bh",   label: "Triangle - Base and Height" },
                    { value: "trapezoid",     label: "Trapezoid" },
                ]} />
                <div style={{ background: "var(--n-surface-alt, #f0f4ff)", border: "1px solid var(--n-border)", borderRadius: 8, padding: "8px 12px", fontSize: "0.8rem", color: "var(--n-text-secondary)" }}>
                    Formula: <strong>{cfg.formula}</strong>
                </div>
                <FtInInput label={cfg.d1} ft={dim1} ftIn={dim1in} onFt={setDim1} onIn={setDim1in} />
                {cfg.d2 && <FtInInput label={cfg.d2} ft={dim2} ftIn={dim2in} onFt={setDim2} onIn={setDim2in} />}
                {cfg.d3 && <FtInInput label={cfg.d3} ft={dim3} ftIn={dim3in} onFt={setDim3} onIn={setDim3in} />}
                {cfg.d4 && <FtInInput label={cfg.d4} ft={dim4} ftIn={dim4in} onFt={setDim4} onIn={setDim4in} />}
                <InputField label="Quantity (rooms or sections)" value={quantity} onChange={setQuantity} min={1} step={1} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={50} step={1} />
                <div className="con-input">
                    <label className="con-input__label">Price per Unit (optional)</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        <input type="number" className="con-input__field" value={price} onChange={e => setPrice(Number(e.target.value))} min={0} step={0.5} style={{ flex: 2 }} placeholder="0.00" />
                        <select className="con-input__field" value={priceUnit} onChange={e => setPriceUnit(e.target.value)} style={{ flex: 2 }}>
                            <option value="sqft">$ / sq ft</option>
                            <option value="sqyd">$ / sq yd</option>
                            <option value="sqm">$ / sq m</option>
                            <option value="box">$ / box</option>
                        </select>
                    </div>
                </div>
                {priceUnit === "box" && <InputField label="Box Coverage" value={boxCoverage} onChange={setBoxCoverage} unit="sq ft/box" min={1} step={1} />}
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">AREA</h4>
                <ResultRow label={waste > 0 ? "Total Area (with waste)" : "Total Area"} value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Square Inches" value={fmtInt(result.sqIn)} unit="sq in" />
                {quantity > 1 && <ResultRow label={"Per section x " + quantity} value={fmt(result.sqFt) + " each"} />}
                <h4 className="con-calc__group-label">CONVERSIONS</h4>
                <ResultRow label="Square Yards" value={fmt(result.sqYd)} unit="sq yd" />
                <ResultRow label="Square Meters" value={fmt(result.sqM)} unit="sq m" />
                <ResultRow label="Acres" value={fmt(result.acres, 5)} unit="acres" />
                {result.totalCost > 0 && (<>
                    <h4 className="con-calc__group-label">COST</h4>
                    <ResultRow label="Total Estimated Cost" value={"$" + fmt(result.totalCost)} />
                    {result.boxesNeeded > 0 && <ResultRow label="Boxes Needed" value={fmtInt(result.boxesNeeded)} unit="boxes" />}
                </>)}
            </div>
        </div>
    );
}

/* ──────────── 10. CUBIC YARDS CALCULATOR ──────────── */
const MATERIAL_DENSITIES: { value: string; label: string; tonsPerYd: number; costPerYd: number }[] = [
    { value: "topsoil", label: "Topsoil", tonsPerYd: 1.1, costPerYd: 35 },
    { value: "mulch", label: "Mulch (wood chips)", tonsPerYd: 0.5, costPerYd: 30 },
    { value: "gravel", label: "Gravel / Crushed Stone", tonsPerYd: 1.4, costPerYd: 50 },
    { value: "sand", label: "Sand", tonsPerYd: 1.3, costPerYd: 40 },
    { value: "fill-dirt", label: "Fill Dirt", tonsPerYd: 1.15, costPerYd: 15 },
    { value: "concrete", label: "Concrete", tonsPerYd: 2.0, costPerYd: 130 },
    { value: "river-rock", label: "River Rock", tonsPerYd: 1.5, costPerYd: 65 },
    { value: "compost", label: "Compost", tonsPerYd: 0.6, costPerYd: 40 },
    { value: "custom", label: "Custom", tonsPerYd: 1.0, costPerYd: 0 },
];

function CubicYardsCalc() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [diameter, setDiameter] = useState(6);
    const [depth, setDepth] = useState(6);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [material, setMaterial] = useState("gravel");
    const [tonsPerYd, setTonsPerYd] = useState(1.4);
    const [costPerYd, setCostPerYd] = useState(50);

    const handleMaterial = (v: string) => {
        setMaterial(v);
        const m = MATERIAL_DENSITIES.find(d => d.value === v);
        if (m && v !== "custom") { setTonsPerYd(m.tonsPerYd); setCostPerYd(m.costPerYd); }
    };

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        let cuFt = 0;
        if (shape === "cylinder") {
            const r = diameter / 2;
            cuFt = Math.PI * r * r * depthFt;
        } else {
            cuFt = length * width * depthFt;
        }
        const cuYd = cuFt / 27;
        const cuM = cuFt * 0.0283168;
        const tons = cuYd * tonsPerYd;
        const coverageSqFt = shape === "cylinder" ? Math.PI * (diameter / 2) * (diameter / 2) : length * width;
        const totalCost = costPerYd > 0 ? Math.ceil(cuYd) * costPerYd : 0;
        return { cuFt, cuYd, cuM, tons, coverageSqFt, totalCost };
    }, [shape, length, width, diameter, depth, depthUnit, tonsPerYd, costPerYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📦 Cubic Yards Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle / Square" },
                    { value: "cylinder", label: "Circle / Cylinder" },
                ]} />
                <SelectField label="Material" value={material} onChange={handleMaterial}
                    options={MATERIAL_DENSITIES.map(d => ({ value: d.value, label: d.label }))} />
                {shape === "rectangle" ? (
                    <>
                        <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                        <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                    </>
                ) : (
                    <InputField label="Diameter" value={diameter} onChange={setDiameter} unit="ft" min={0.1} step={0.5} />
                )}
                <InputField label="Depth" value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
                <InputField label="Cost per Cu Yd" value={costPerYd} onChange={setCostPerYd} unit="$" min={0} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">VOLUME</h4>
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Cubic Meters" value={fmt(result.cuM, 2)} unit="cu m" />
                <ResultRow label="Coverage Area" value={fmt(result.coverageSqFt)} unit="sq ft" />
                <h4 className="con-calc__group-label">WEIGHT</h4>
                <ResultRow label="Estimated Weight" value={fmt(result.tons, 2)} unit="tons" />
                <ResultRow label="Buy (rounded up)" value={fmtInt(result.cuYd)} unit="cu yd" />
                {costPerYd > 0 && (
                    <>
                        <h4 className="con-calc__group-label">COST</h4>
                        <ResultRow label="Material Cost" value={`$${fmtInt(result.totalCost)}`} />
                    </>
                )}
            </div>
        </div>
    );
}

/* ──────────── 11. GRAVEL CALCULATOR ──────────── */
const GRAVEL_TYPES: { value: string; label: string; density: number; costPerTon: number }[] = [
    { value: "crushed-stone", label: "Crushed Stone", density: 1.4, costPerTon: 35 },
    { value: "pea-gravel", label: "Pea Gravel", density: 1.4, costPerTon: 40 },
    { value: "river-rock", label: "River Rock", density: 1.5, costPerTon: 50 },
    { value: "limestone", label: "Limestone", density: 1.5, costPerTon: 30 },
    { value: "decomposed-granite", label: "Decomposed Granite", density: 1.3, costPerTon: 45 },
    { value: "quarry-process", label: "Quarry Process / QP", density: 1.5, costPerTon: 25 },
    { value: "marble-chips", label: "Marble Chips", density: 1.4, costPerTon: 70 },
    { value: "slate-chips", label: "Slate Chips", density: 1.5, costPerTon: 60 },
    { value: "custom", label: "Custom", density: 1.4, costPerTon: 0 },
];

function GravelCalc() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(10);
    const [diameter, setDiameter] = useState(10);
    const [depth, setDepth] = useState(3);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [material, setMaterial] = useState("crushed-stone");
    const [density, setDensity] = useState(1.4);
    const [costPerTon, setCostPerTon] = useState(35);
    const [deliveryFee, setDeliveryFee] = useState(75);
    const [compact, setCompact] = useState(false);

    const handleMaterial = (v: string) => {
        setMaterial(v);
        const m = GRAVEL_TYPES.find(g => g.value === v);
        if (m && v !== "custom") { setDensity(m.density); setCostPerTon(m.costPerTon); }
    };

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        let areaSqFt = shape === "circle" ? Math.PI * (diameter / 2) ** 2 : length * width;
        let cuFt = areaSqFt * depthFt;
        let cuYd = cuFt / 27;
        // Add 10% overage
        cuYd *= 1.1;
        // Add 30% compaction if selected
        if (compact) cuYd *= 1.3;
        const tons = cuYd * density;
        const materialCost = tons * costPerTon;
        const totalCost = materialCost + deliveryFee;
        return { areaSqFt, cuFt: cuYd * 27, cuYd, tons, materialCost, totalCost };
    }, [shape, length, width, diameter, depth, depthUnit, density, costPerTon, deliveryFee, compact]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Gravel Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle / Square" },
                    { value: "circle", label: "Circle" },
                ]} />
                <SelectField label="Material" value={material} onChange={handleMaterial}
                    options={GRAVEL_TYPES.map(g => ({ value: g.value, label: g.label }))} />
                {shape === "rectangle" ? (
                    <>
                        <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                        <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                    </>
                ) : (
                    <InputField label="Diameter" value={diameter} onChange={setDiameter} unit="ft" min={0.1} step={0.5} />
                )}
                <InputField label="Depth" value={depth} onChange={setDepth} unit={depthUnit} min={0.5} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" }
                ]} />
                <InputField label="Cost per Ton" value={costPerTon} onChange={setCostPerTon} unit="$" min={0} />
                <InputField label="Delivery Fee" value={deliveryFee} onChange={setDeliveryFee} unit="$" min={0} />
                <SelectField label="Compaction" value={compact ? "yes" : "no"} onChange={(v) => setCompact(v === "yes")} options={[
                    { value: "no", label: "No compaction" }, { value: "yes", label: "Yes (+30%)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">VOLUME (incl. 10% overage{compact ? " + 30% compaction" : ""})</h4>
                <ResultRow label="Coverage Area" value={fmt(result.areaSqFt)} unit="sq ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt)} unit="cu ft" />
                <h4 className="con-calc__group-label">WEIGHT</h4>
                <ResultRow label="Estimated Weight" value={fmt(result.tons, 2)} unit="tons" />
                <ResultRow label="Order (rounded up)" value={`${Math.ceil(result.tons * 2) / 2}`} unit="tons" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Material Cost" value={`$${fmtInt(result.materialCost)}`} />
                <ResultRow label="Delivery" value={`$${fmtInt(deliveryFee)}`} />
                <ResultRow label="Total Cost" value={`$${fmtInt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 12. MULCH CALCULATOR ──────────── */
const MULCH_TYPES: { value: string; label: string; weightPerYd: number; bagCost: number; bulkPerYd: number }[] = [
    { value: "hardwood-bark", label: "Shredded Hardwood Bark", weightPerYd: 600, bagCost: 4.5, bulkPerYd: 30 },
    { value: "cedar", label: "Cedar Mulch", weightPerYd: 550, bagCost: 5.5, bulkPerYd: 40 },
    { value: "pine-bark", label: "Pine Bark Nuggets", weightPerYd: 450, bagCost: 5, bulkPerYd: 35 },
    { value: "pine-straw", label: "Pine Straw (bale)", weightPerYd: 300, bagCost: 6, bulkPerYd: 28 },
    { value: "wood-chips", label: "Wood Chips", weightPerYd: 500, bagCost: 4, bulkPerYd: 25 },
    { value: "dyed-mulch", label: "Dyed Mulch (black/red/brown)", weightPerYd: 600, bagCost: 5, bulkPerYd: 35 },
    { value: "rubber", label: "Rubber Mulch", weightPerYd: 1200, bagCost: 8, bulkPerYd: 160 },
    { value: "stone", label: "Decorative Stone Mulch", weightPerYd: 2800, bagCost: 6, bulkPerYd: 55 },
    { value: "custom", label: "Custom", weightPerYd: 500, bagCost: 5, bulkPerYd: 30 },
];

function MulchCalc() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [diameter, setDiameter] = useState(10);
    const [depth, setDepth] = useState(3);
    const [mulchType, setMulchType] = useState("hardwood-bark");
    const [bagSize, setBagSize] = useState(2);
    const [bagCost, setBagCost] = useState(4.5);
    const [bulkPerYd, setBulkPerYd] = useState(30);

    const handleType = (v: string) => {
        setMulchType(v);
        const m = MULCH_TYPES.find(t => t.value === v);
        if (m && v !== "custom") { setBagCost(m.bagCost); setBulkPerYd(m.bulkPerYd); }
    };

    const result = useMemo(() => {
        const depthFt = depth / 12;
        const areaSqFt = shape === "circle" ? Math.PI * (diameter / 2) ** 2 : length * width;
        let cuFt = areaSqFt * depthFt;
        cuFt *= 1.1; // 10% overage
        const cuYd = cuFt / 27;
        const bags = bagSize > 0 ? Math.ceil(cuFt / bagSize) : 0;
        const costBagged = bags * bagCost;
        const costBulk = cuYd * bulkPerYd;
        const preset = MULCH_TYPES.find(t => t.value === mulchType);
        const weightLbs = cuYd * (preset?.weightPerYd || 500);
        return { areaSqFt, cuFt, cuYd, bags, costBagged, costBulk, weightLbs };
    }, [shape, length, width, diameter, depth, mulchType, bagSize, bagCost, bulkPerYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌿 Mulch Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle / Square" },
                    { value: "circle", label: "Circle (tree ring, bed)" },
                ]} />
                <SelectField label="Mulch Type" value={mulchType} onChange={handleType}
                    options={MULCH_TYPES.map(m => ({ value: m.value, label: m.label }))} />
                {shape === "rectangle" ? (
                    <>
                        <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.1} step={0.5} />
                        <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.1} step={0.5} />
                    </>
                ) : (
                    <InputField label="Diameter" value={diameter} onChange={setDiameter} unit="ft" min={0.1} step={0.5} />
                )}
                <InputField label="Depth" value={depth} onChange={setDepth} unit="inches" min={1} max={12} />
                <SelectField label="Bag Size" value={String(bagSize)} onChange={(v) => setBagSize(Number(v))} options={[
                    { value: "2", label: "2 cu ft bag" }, { value: "3", label: "3 cu ft bag" },
                ]} />
                <InputField label="Price per Bag" value={bagCost} onChange={setBagCost} unit="$" min={0} step={0.5} />
                <InputField label="Bulk Price per cu yd" value={bulkPerYd} onChange={setBulkPerYd} unit="$" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">VOLUME (incl. 10% overage)</h4>
                <ResultRow label="Coverage Area" value={fmt(result.areaSqFt)} unit="sq ft" />
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Weight (approx)" value={fmtInt(result.weightLbs)} unit="lbs" />
                <h4 className="con-calc__group-label">BAGS</h4>
                <ResultRow label={`Bags (${bagSize} cu ft)`} value={fmtInt(result.bags)} unit="bags" />
                <h4 className="con-calc__group-label">COST COMPARISON</h4>
                <ResultRow label="Bagged Cost" value={`$${fmtInt(result.costBagged)}`} />
                <ResultRow label="Bulk Cost" value={`$${fmtInt(result.costBulk)}`} />
                <ResultRow label="You Save (bulk)" value={result.costBagged > result.costBulk ? `$${fmtInt(result.costBagged - result.costBulk)}` : "—"} />
            </div>
        </div>
    );
}

/* ──────────── 13. BRICK CALCULATOR ──────────── */
const BRICK_SIZES: { value: string; label: string; l: number; h: number; perSqFt: number; perPallet: number }[] = [
    { value: "modular", label: "Modular (7⅝×2¼\")", l: 7.625, h: 2.25, perSqFt: 6.86, perPallet: 532 },
    { value: "queen", label: "Queen (7⅝×2¾\")", l: 7.625, h: 2.75, perSqFt: 5.76, perPallet: 390 },
    { value: "king", label: "King (9⅝×2⅝\")", l: 9.625, h: 2.625, perSqFt: 4.61, perPallet: 360 },
    { value: "utility", label: "Utility (11⅝×3⅝\")", l: 11.625, h: 3.625, perSqFt: 3.00, perPallet: 270 },
    { value: "engineer", label: "Engineer (7⅝×2 13⁄16\")", l: 7.625, h: 2.8125, perSqFt: 5.63, perPallet: 410 },
    { value: "closure", label: "Closure (7⅝×3⅝\")", l: 7.625, h: 3.625, perSqFt: 4.50, perPallet: 340 },
    { value: "custom", label: "Custom Size", l: 8, h: 2.25, perSqFt: 0, perPallet: 500 },
];

function BrickCalc() {
    const [projectType, setProjectType] = useState("wall");
    const [wallLength, setWallLength] = useState(20);
    const [wallHeight, setWallHeight] = useState(8);
    const [brickPreset, setBrickPreset] = useState("modular");
    const [brickLength, setBrickLength] = useState(7.625);
    const [brickHeight, setBrickHeight] = useState(2.25);
    const [mortarJoint, setMortarJoint] = useState(0.375);
    const [waste, setWaste] = useState(10);
    const [brickCost, setBrickCost] = useState(0.65);
    const [mortarCostPerBag, setMortarCostPerBag] = useState(12);

    const handlePreset = (v: string) => {
        setBrickPreset(v);
        const p = BRICK_SIZES.find(b => b.value === v);
        if (p && v !== "custom") { setBrickLength(p.l); setBrickHeight(p.h); }
    };

    const result = useMemo(() => {
        const wallArea = wallLength * wallHeight;
        const brickLenIn = brickLength + mortarJoint;
        const brickHtIn = brickHeight + mortarJoint;
        const brickAreaSqIn = brickLenIn * brickHtIn;
        const brickAreaSqFt = brickAreaSqIn / 144;
        const perSqFt = brickAreaSqFt > 0 ? 1 / brickAreaSqFt : 0;
        const bricksExact = wallArea * perSqFt;
        const bricksWithWaste = Math.ceil(bricksExact * (1 + waste / 100));
        // Mortar: 1 bag (80 lb) per ~35 bricks for pre-mix; 1 bag cement per 142 modular bricks for site-mix
        const mortarBags80lb = Math.ceil(bricksWithWaste / 35);
        const preset = BRICK_SIZES.find(b => b.value === brickPreset);
        const perPallet = preset?.perPallet || 500;
        const pallets = Math.ceil(bricksWithWaste / perPallet);
        const materialCostBrick = bricksWithWaste * brickCost;
        const materialCostMortar = mortarBags80lb * mortarCostPerBag;
        const totalCost = materialCostBrick + materialCostMortar;
        return { wallArea, perSqFt, bricksExact, bricksWithWaste, mortarBags80lb, pallets, perPallet, materialCostBrick, materialCostMortar, totalCost };
    }, [wallLength, wallHeight, brickLength, brickHeight, mortarJoint, waste, brickPreset, brickCost, mortarCostPerBag]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Brick Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Project Type" value={projectType} onChange={setProjectType} options={[
                    { value: "wall", label: "Wall / Façade" },
                    { value: "patio", label: "Patio / Walkway (flat)" },
                ]} />
                <SelectField label="Brick Size" value={brickPreset} onChange={handlePreset}
                    options={BRICK_SIZES.map(b => ({ value: b.value, label: b.label }))} />
                <InputField label={projectType === "wall" ? "Wall Length" : "Area Length"} value={wallLength} onChange={setWallLength} unit="ft" min={1} />
                <InputField label={projectType === "wall" ? "Wall Height" : "Area Width"} value={wallHeight} onChange={setWallHeight} unit="ft" min={1} />
                {brickPreset === "custom" && (
                    <>
                        <InputField label="Brick Length" value={brickLength} onChange={setBrickLength} unit="in" min={1} step={0.125} />
                        <InputField label="Brick Height" value={brickHeight} onChange={setBrickHeight} unit="in" min={0.5} step={0.125} />
                    </>
                )}
                <InputField label="Mortar Joint" value={mortarJoint} onChange={setMortarJoint} unit="in" min={0.25} step={0.125} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
                <InputField label="Brick Cost (each)" value={brickCost} onChange={setBrickCost} unit="$" min={0} step={0.05} />
                <InputField label="Mortar (80 lb bag)" value={mortarCostPerBag} onChange={setMortarCostPerBag} unit="$" min={0} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">BRICKS</h4>
                <ResultRow label="Wall / Area" value={fmt(result.wallArea)} unit="sq ft" />
                <ResultRow label="Bricks per sq ft" value={fmt(result.perSqFt, 1)} />
                <ResultRow label="Bricks (exact)" value={fmtInt(result.bricksExact)} unit="bricks" />
                <ResultRow label={`Bricks (+ ${waste}% waste)`} value={fmtInt(result.bricksWithWaste)} unit="bricks" />
                <ResultRow label={`Pallets (${result.perPallet}/pallet)`} value={fmtInt(result.pallets)} unit="pallets" />
                <h4 className="con-calc__group-label">MORTAR</h4>
                <ResultRow label="Mortar (80 lb bags)" value={fmtInt(result.mortarBags80lb)} unit="bags" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Brick Cost" value={`$${fmtInt(result.materialCostBrick)}`} />
                <ResultRow label="Mortar Cost" value={`$${fmtInt(result.materialCostMortar)}`} />
                <ResultRow label="Total Cost" value={`$${fmtInt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 14. FENCE CALCULATOR ──────────── */
const FENCE_STYLES: { value: string; label: string; picketW: number; spacing: number; railsPer: number }[] = [
    { value: "privacy", label: "Privacy (solid board)", picketW: 5.5, spacing: 0, railsPer: 3 },
    { value: "shadowbox", label: "Shadowbox (board-on-board)", picketW: 5.5, spacing: -1, railsPer: 3 },
    { value: "stockade", label: "Stockade", picketW: 2.5, spacing: 0, railsPer: 3 },
    { value: "picket", label: "Picket (spaced)", picketW: 3.5, spacing: 3.5, railsPer: 2 },
    { value: "rail", label: "Rail (no pickets)", picketW: 0, spacing: 0, railsPer: 3 },
    { value: "panel", label: "Pre-built Panel (6×8 ft)", picketW: 0, spacing: 0, railsPer: 0 },
    { value: "chain-link", label: "Chain Link", picketW: 0, spacing: 0, railsPer: 2 },
];

function FenceCalc() {
    const [fenceLength, setFenceLength] = useState(100);
    const [fenceHeight, setFenceHeight] = useState(6);
    const [postSpacing, setPostSpacing] = useState(8);
    const [style, setStyle] = useState("privacy");
    const [picketWidth, setPicketWidth] = useState(5.5);
    const [picketSpacing, setPicketSpacing] = useState(0);
    const [railsPerSection, setRailsPerSection] = useState(3);
    const [gates, setGates] = useState(1);
    const [postCost, setPostCost] = useState(12);
    const [railCost, setRailCost] = useState(6);
    const [picketCost, setPicketCost] = useState(3);

    const handleStyle = (v: string) => {
        setStyle(v);
        const s = FENCE_STYLES.find(f => f.value === v);
        if (s) { setPicketWidth(s.picketW); setPicketSpacing(s.spacing); setRailsPerSection(s.railsPer); }
    };

    const result = useMemo(() => {
        const posts = Math.ceil(fenceLength / postSpacing) + 1;
        const sections = posts - 1;
        const postLength = fenceHeight + Math.max(fenceHeight / 3, 2);
        const postHoleDepth = Math.max(fenceHeight / 3, 2);

        let rails = sections * railsPerSection;
        let pickets = 0;
        let panels = 0;

        if (style === "panel") {
            panels = sections;
        } else if (style === "chain-link") {
            // chain-link: linear feet of fabric
        } else if (style === "shadowbox") {
            // Shadowbox: pickets on both sides, offset for full coverage
            const effectiveW = picketWidth + picketSpacing; // spacing is -1, so 4.5" effective
            if (effectiveW > 0) pickets = Math.ceil((fenceLength * 12) / effectiveW) * 2;
        } else if (picketWidth > 0) {
            const effectiveW = picketWidth + Math.max(picketSpacing, 0);
            if (effectiveW > 0) pickets = Math.ceil((fenceLength * 12) / effectiveW);
        }

        // Add 10% waste
        const picketsWithWaste = Math.ceil(pickets * 1.1);
        const concreteBags = posts * 2; // 2 × 50lb bags per post
        const screws = picketsWithWaste * (railsPerSection > 0 ? railsPerSection * 2 : 6); // 2 screws per rail contact
        const gatePostsExtra = gates * 2;

        // Cost
        const totalPosts = posts + gatePostsExtra;
        const costPosts = totalPosts * postCost;
        const costRails = rails * railCost;
        const costPickets = style === "panel" ? panels * 45 : picketsWithWaste * picketCost;
        const costConcrete = concreteBags * 5; // ~$5 per 50lb bag
        const costScrews = Math.ceil(screws / 100) * 9; // ~$9 per lb (100 screws)
        const costGates = gates * 85;
        const totalCost = costPosts + costRails + costPickets + costConcrete + costScrews + costGates;

        return { posts: totalPosts, sections, rails, pickets: picketsWithWaste, panels, postLength, postHoleDepth, concreteBags, screws, totalCost, costPosts, costRails, costPickets, costConcrete, costGates };
    }, [fenceLength, fenceHeight, postSpacing, style, picketWidth, picketSpacing, railsPerSection, gates, postCost, railCost, picketCost]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏡 Fence Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Fence Style" value={style} onChange={handleStyle}
                    options={FENCE_STYLES.map(s => ({ value: s.value, label: s.label }))} />
                <InputField label="Fence Length" value={fenceLength} onChange={setFenceLength} unit="ft" min={1} />
                <InputField label="Fence Height" value={fenceHeight} onChange={setFenceHeight} unit="ft" min={3} max={12} />
                <InputField label="Post Spacing" value={postSpacing} onChange={setPostSpacing} unit="ft" min={4} max={12} />
                <InputField label="Gates" value={gates} onChange={setGates} unit="gates" min={0} max={10} />
                {picketWidth > 0 && (
                    <>
                        <InputField label="Picket Width" value={picketWidth} onChange={setPicketWidth} unit="in" min={1} step={0.5} />
                        <InputField label="Picket Spacing" value={picketSpacing} onChange={setPicketSpacing} unit="in" min={-2} step={0.5} />
                    </>
                )}
                <InputField label="Post Cost (4×4)" value={postCost} onChange={setPostCost} unit="$" min={0} />
                <InputField label="Rail Cost (2×4)" value={railCost} onChange={setRailCost} unit="$" min={0} />
                {picketWidth > 0 && <InputField label="Picket Cost (each)" value={picketCost} onChange={setPicketCost} unit="$" min={0} step={0.5} />}
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">STRUCTURE</h4>
                <ResultRow label="Posts (4×4)" value={fmtInt(result.posts)} unit={`@ ${fmt(result.postLength, 1)} ft each`} />
                <ResultRow label="Post Hole Depth" value={fmt(result.postHoleDepth, 1)} unit="ft" />
                <ResultRow label="Sections" value={fmtInt(result.sections)} />
                <ResultRow label="Rails (2×4)" value={fmtInt(result.rails)} />
                {result.pickets > 0 && <ResultRow label="Pickets (+ 10% waste)" value={fmtInt(result.pickets)} />}
                {result.panels > 0 && <ResultRow label="Panels (6×8 ft)" value={fmtInt(result.panels)} />}
                <h4 className="con-calc__group-label">HARDWARE</h4>
                <ResultRow label="Concrete (50 lb bags)" value={fmtInt(result.concreteBags)} unit="bags" />
                <ResultRow label="Screws (approx)" value={fmtInt(result.screws)} />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Posts" value={`$${fmtInt(result.costPosts)}`} />
                <ResultRow label="Rails" value={`$${fmtInt(result.costRails)}`} />
                <ResultRow label="Pickets / Panels" value={`$${fmtInt(result.costPickets)}`} />
                <ResultRow label="Concrete" value={`$${fmtInt(result.costConcrete)}`} />
                {gates > 0 && <ResultRow label={`Gates (${gates})`} value={`$${fmtInt(result.costGates)}`} />}
                <ResultRow label="Total Material Cost" value={`$${fmtInt(result.totalCost)}`} />
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
const WOOD_SPECIES: { value: string; label: string; density: number; costPerBF: number }[] = [
    { value: "spf", label: "SPF (Spruce-Pine-Fir)", density: 28, costPerBF: 3 },
    { value: "pt-pine", label: "Pressure-Treated Pine", density: 35, costPerBF: 4 },
    { value: "doug-fir", label: "Douglas Fir", density: 34, costPerBF: 4 },
    { value: "cedar", label: "Western Red Cedar", density: 23, costPerBF: 6 },
    { value: "redwood", label: "Redwood", density: 28, costPerBF: 8 },
    { value: "poplar", label: "Poplar", density: 29, costPerBF: 4 },
    { value: "red-oak", label: "Red Oak", density: 44, costPerBF: 6 },
    { value: "white-oak", label: "White Oak", density: 47, costPerBF: 7 },
    { value: "hard-maple", label: "Hard Maple", density: 44, costPerBF: 6 },
    { value: "walnut", label: "Black Walnut", density: 38, costPerBF: 12 },
    { value: "cherry", label: "Cherry", density: 35, costPerBF: 7 },
    { value: "custom", label: "Custom Species", density: 30, costPerBF: 5 },
];

const DIM_PRESETS: { value: string; label: string; w: number; t: number }[] = [
    { value: "custom", label: "Custom Dimensions", w: 6, t: 1 },
    { value: "2x4", label: "2×4 (1.5\" × 3.5\" actual)", w: 4, t: 2 },
    { value: "2x6", label: "2×6 (1.5\" × 5.5\" actual)", w: 6, t: 2 },
    { value: "2x8", label: "2×8 (1.5\" × 7.25\" actual)", w: 8, t: 2 },
    { value: "2x10", label: "2×10 (1.5\" × 9.25\" actual)", w: 10, t: 2 },
    { value: "2x12", label: "2×12 (1.5\" × 11.25\" actual)", w: 12, t: 2 },
    { value: "4x4", label: "4×4 (3.5\" × 3.5\" actual)", w: 4, t: 4 },
    { value: "1x6", label: "1×6 (0.75\" × 5.5\" actual)", w: 6, t: 1 },
    { value: "1x8", label: "1×8 (0.75\" × 7.25\" actual)", w: 8, t: 1 },
];

function LumberCalc() {
    const [species, setSpecies] = useState("spf");
    const [dimPreset, setDimPreset] = useState("custom");
    const [boardLength, setBoardLength] = useState(8);
    const [boardWidth, setBoardWidth] = useState(6);
    const [boardThickness, setBoardThickness] = useState(1);
    const [quantity, setQuantity] = useState(10);
    const [pricePerBF, setPricePerBF] = useState(3);

    const handleSpecies = (v: string) => {
        setSpecies(v);
        const s = WOOD_SPECIES.find(w => w.value === v);
        if (s && v !== "custom") setPricePerBF(s.costPerBF);
    };

    const handleDim = (v: string) => {
        setDimPreset(v);
        const d = DIM_PRESETS.find(p => p.value === v);
        if (d && v !== "custom") { setBoardWidth(d.w); setBoardThickness(d.t); }
    };

    const result = useMemo(() => {
        const boardFeetEach = (boardLength * boardWidth * boardThickness) / 12;
        const totalBF = boardFeetEach * quantity;
        const cuFtEach = boardFeetEach / 12;
        const sp = WOOD_SPECIES.find(w => w.value === species);
        const density = sp?.density || 30;
        const weightEach = cuFtEach * density;
        const totalWeight = weightEach * quantity;
        const cost = totalBF * pricePerBF;
        return { boardFeetEach, totalBF, cuFtEach, weightEach, totalWeight, cost };
    }, [boardLength, boardWidth, boardThickness, quantity, pricePerBF, species]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪓 Lumber Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Wood Species" value={species} onChange={handleSpecies}
                    options={WOOD_SPECIES.map(w => ({ value: w.value, label: w.label }))} />
                <SelectField label="Lumber Size" value={dimPreset} onChange={handleDim}
                    options={DIM_PRESETS.map(d => ({ value: d.value, label: d.label }))} />
                <InputField label="Board Length" value={boardLength} onChange={setBoardLength} unit="ft" min={1} />
                {dimPreset === "custom" && (
                    <>
                        <InputField label="Board Width" value={boardWidth} onChange={setBoardWidth} unit="in" min={1} />
                        <InputField label="Thickness" value={boardThickness} onChange={setBoardThickness} unit="in" min={0.25} step={0.25} />
                    </>
                )}
                <InputField label="Quantity" value={quantity} onChange={setQuantity} min={1} />
                <InputField label="Price per Board Foot" value={pricePerBF} onChange={setPricePerBF} unit="$" min={0} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">BOARD FEET</h4>
                <ResultRow label="Board Feet (each)" value={fmt(result.boardFeetEach)} unit="BF" />
                <ResultRow label="Total Board Feet" value={fmt(result.totalBF)} unit="BF" />
                <h4 className="con-calc__group-label">WEIGHT</h4>
                <ResultRow label="Weight per Board" value={fmt(result.weightEach, 1)} unit="lbs" />
                <ResultRow label="Total Weight" value={fmtInt(result.totalWeight)} unit="lbs" />
                <h4 className="con-calc__group-label">COST</h4>
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
const CARPET_TYPES: { value: string; label: string; costSqYd: number; padCostSqYd: number }[] = [
    { value: "polyester", label: "Polyester (economy)", costSqYd: 15, padCostSqYd: 3 },
    { value: "nylon", label: "Nylon (mid-range)", costSqYd: 30, padCostSqYd: 4 },
    { value: "olefin", label: "Olefin / Polypropylene", costSqYd: 18, padCostSqYd: 3 },
    { value: "triexta", label: "Triexta (SmartStrand)", costSqYd: 35, padCostSqYd: 4 },
    { value: "wool", label: "Wool (luxury)", costSqYd: 65, padCostSqYd: 5 },
    { value: "berber", label: "Berber (loop pile)", costSqYd: 22, padCostSqYd: 4 },
    { value: "custom", label: "Custom / Other", costSqYd: 25, padCostSqYd: 4 },
];

function CarpetCalc() {
    const [carpetType, setCarpetType] = useState("nylon");
    const [rollWidth, setRollWidth] = useState(12);
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(10);
    const [waste, setWaste] = useState(10);
    const [pricePerSqYd, setPricePerSqYd] = useState(30);
    const [padPrice, setPadPrice] = useState(4);
    const [laborPerSqFt, setLaborPerSqFt] = useState(1);

    const handleType = (v: string) => {
        setCarpetType(v);
        const t = CARPET_TYPES.find(c => c.value === v);
        if (t && v !== "custom") { setPricePerSqYd(t.costSqYd); setPadPrice(t.padCostSqYd); }
    };

    const result = useMemo(() => {
        const sqFt = length * width;
        const withWaste = sqFt * (1 + waste / 100);
        const sqYd = withWaste / 9;
        const seams = width > rollWidth ? Math.ceil(width / rollWidth) - 1 : 0;
        const carpetCost = sqYd * pricePerSqYd;
        const paddingCost = sqYd * padPrice;
        const laborCost = withWaste * laborPerSqFt;
        const totalCost = carpetCost + paddingCost + laborCost;
        return { sqFt, withWaste, sqYd, seams, carpetCost, paddingCost, laborCost, totalCost };
    }, [length, width, waste, pricePerSqYd, padPrice, laborPerSqFt, rollWidth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🟫 Carpet Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Carpet Type" value={carpetType} onChange={handleType}
                    options={CARPET_TYPES.map(c => ({ value: c.value, label: c.label }))} />
                <SelectField label="Roll Width" value={String(rollWidth)} onChange={(v) => setRollWidth(Number(v))}
                    options={[{ value: "12", label: "12 ft (standard)" }, { value: "15", label: "15 ft (wide)" }]} />
                <InputField label="Room Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Room Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={30} />
                <InputField label="Carpet Price" value={pricePerSqYd} onChange={setPricePerSqYd} unit="$/sq yd" min={0} step={1} />
                <InputField label="Padding Price" value={padPrice} onChange={setPadPrice} unit="$/sq yd" min={0} step={0.5} />
                <InputField label="Labor Cost" value={laborPerSqFt} onChange={setLaborPerSqFt} unit="$/sq ft" min={0} step={0.25} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">AREA</h4>
                <ResultRow label="Room Area" value={fmt(result.sqFt)} unit="sq ft" />
                <ResultRow label="With Waste" value={fmt(result.withWaste)} unit="sq ft" />
                <h4 className="con-calc__group-label">MATERIAL</h4>
                <ResultRow label="Carpet Needed" value={fmt(result.sqYd, 1)} unit="sq yd" />
                <ResultRow label="Seams Required" value={fmtInt(result.seams)} />
                <h4 className="con-calc__group-label">COST BREAKDOWN</h4>
                <ResultRow label="Carpet" value={`$${fmt(result.carpetCost)}`} />
                <ResultRow label="Padding" value={`$${fmt(result.paddingCost)}`} />
                <ResultRow label="Labor" value={`$${fmt(result.laborCost)}`} />
                <ResultRow label="Total Estimated" value={`$${fmt(result.totalCost)}`} />
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
const PLY_TYPES: { value: string; label: string; weightPerSheet: number; costPerSheet: number }[] = [
    { value: "cdx", label: "CDX (structural)", weightPerSheet: 60, costPerSheet: 40 },
    { value: "osb", label: "OSB (oriented strand)", weightPerSheet: 55, costPerSheet: 30 },
    { value: "sanded", label: "Sanded (cabinet grade)", weightPerSheet: 65, costPerSheet: 55 },
    { value: "marine", label: "Marine Grade", weightPerSheet: 70, costPerSheet: 85 },
    { value: "baltic-birch", label: "Baltic Birch", weightPerSheet: 68, costPerSheet: 70 },
    { value: "mdf", label: "MDF (medium density)", weightPerSheet: 85, costPerSheet: 35 },
    { value: "custom", label: "Custom / Other", weightPerSheet: 60, costPerSheet: 45 },
];

const PLY_THICK: { value: string; label: string; factor: number }[] = [
    { value: "1/4", label: "¼\" (6mm)", factor: 0.40 },
    { value: "3/8", label: "⅜\" (9mm)", factor: 0.55 },
    { value: "1/2", label: "½\" (12mm)", factor: 0.70 },
    { value: "5/8", label: "⅝\" (15mm)", factor: 0.85 },
    { value: "3/4", label: "¾\" (18mm)", factor: 1.0 },
];

function PlywoodCalc() {
    const [plyType, setPlyType] = useState("cdx");
    const [thickness, setThickness] = useState("3/4");
    const [sheetSize, setSheetSize] = useState("4x8");
    const [projectType, setProjectType] = useState("floor");
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(12);
    const [waste, setWaste] = useState(10);
    const [pricePerSheet, setPricePerSheet] = useState(40);

    const handleType = (v: string) => {
        setPlyType(v);
        const t = PLY_TYPES.find(p => p.value === v);
        if (t && v !== "custom") setPricePerSheet(t.costPerSheet);
    };

    const result = useMemo(() => {
        const area = length * width;
        const withWaste = area * (1 + waste / 100);
        const sheetArea = sheetSize === "4x8" ? 32 : 16;
        const sheets = Math.ceil(withWaste / sheetArea);
        const cost = sheets * pricePerSheet;
        const thickFactor = PLY_THICK.find(t => t.value === thickness)?.factor || 1;
        const typeData = PLY_TYPES.find(p => p.value === plyType);
        const weightPerSheet = (typeData?.weightPerSheet || 60) * thickFactor;
        const totalWeight = sheets * weightPerSheet;
        return { area, withWaste, sheetArea, sheets, cost, weightPerSheet, totalWeight };
    }, [length, width, waste, pricePerSheet, sheetSize, thickness, plyType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Plywood Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Plywood Type" value={plyType} onChange={handleType}
                    options={PLY_TYPES.map(p => ({ value: p.value, label: p.label }))} />
                <SelectField label="Thickness" value={thickness} onChange={setThickness}
                    options={PLY_THICK.map(t => ({ value: t.value, label: t.label }))} />
                <SelectField label="Sheet Size" value={sheetSize} onChange={setSheetSize}
                    options={[{ value: "4x8", label: "4×8 ft (32 sq ft)" }, { value: "4x4", label: "4×4 ft (16 sq ft)" }]} />
                <SelectField label="Project" value={projectType} onChange={setProjectType}
                    options={[{ value: "floor", label: "Subfloor / Floor" }, { value: "wall", label: "Wall Sheathing" }, { value: "roof", label: "Roof Sheathing" }, { value: "other", label: "Other / Custom" }]} />
                <InputField label="Area Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Area Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
                <InputField label="Price per Sheet" value={pricePerSheet} onChange={setPricePerSheet} unit="$" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">AREA</h4>
                <ResultRow label="Project Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="With Waste" value={fmt(result.withWaste)} unit="sq ft" />
                <h4 className="con-calc__group-label">SHEETS</h4>
                <ResultRow label={`${sheetSize === "4x8" ? "4×8" : "4×4"} Sheets`} value={fmtInt(result.sheets)} unit="sheets" />
                <ResultRow label="Weight per Sheet" value={fmtInt(result.weightPerSheet)} unit="lbs" />
                <ResultRow label="Total Weight" value={fmtInt(result.totalWeight)} unit="lbs" />
                <h4 className="con-calc__group-label">COST</h4>
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

/* ──────────── 101. CONCRETE BLOCK FILL CALCULATOR ──────────── */
function ConcreteBlockFillCalc() {
    const [numBlocks, setNumBlocks] = useState(100);
    const [blockSize, setBlockSize] = useState("8");
    const [fillPercent, setFillPercent] = useState(100);

    const CORE_VOLUME: Record<string, number> = {
        "4": 0.005, "6": 0.017, "8": 0.028, "10": 0.039, "12": 0.05,
    }; // cu ft per block core fill

    const result = useMemo(() => {
        const coreVol = CORE_VOLUME[blockSize] || 0.028;
        const totalCuFt = numBlocks * coreVol * (fillPercent / 100);
        const cuYd = totalCuFt / 27;
        const bags80 = Math.ceil(totalCuFt / 0.6);
        const withWaste = cuYd * 1.1;
        return { totalCuFt, cuYd, bags80, withWaste, coreVol };
    }, [numBlocks, blockSize, fillPercent]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Concrete Block Fill Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Number of Blocks" value={numBlocks} onChange={setNumBlocks} min={1} />
                <SelectField label="Block Width" value={blockSize} onChange={setBlockSize} options={[
                    { value: "4", label: '4" Block' },
                    { value: "6", label: '6" Block' },
                    { value: "8", label: '8" Block (Standard)' },
                    { value: "10", label: '10" Block' },
                    { value: "12", label: '12" Block' },
                ]} />
                <SelectField label="Fill %" value={String(fillPercent)} onChange={(v) => setFillPercent(Number(v))} options={[
                    { value: "100", label: "100% — All Cores (Solid Grout)" },
                    { value: "50", label: "50% — Every Other Core" },
                    { value: "25", label: "25% — Rebar Cells Only" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Fill Volume" value={fmt(result.totalCuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="With 10% Waste" value={fmt(result.withWaste, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 102. CONCRETE MIX CALCULATOR ──────────── */
function ConcreteMixCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [thickness, setThickness] = useState(4);
    const [wasteFactor, setWasteFactor] = useState(10);

    const result = useMemo(() => {
        const thickFt = thickness / 12;
        const cuFt = length * width * thickFt;
        const cuFtWithWaste = cuFt * (1 + wasteFactor / 100);
        const cuYd = cuFtWithWaste / 27;
        const bags40 = Math.ceil(cuFtWithWaste / 0.30);
        const bags50 = Math.ceil(cuFtWithWaste / 0.375);
        const bags60 = Math.ceil(cuFtWithWaste / 0.45);
        const bags80 = Math.ceil(cuFtWithWaste / 0.60);
        return { cuFt, cuFtWithWaste, cuYd, bags40, bags50, bags60, bags80 };
    }, [length, width, thickness, wasteFactor]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Concrete Mix Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={2} max={12} />
                <InputField label="Waste Factor" value={wasteFactor} onChange={setWasteFactor} unit="%" min={0} max={20} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFtWithWaste)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="40 lb Bags" value={fmtInt(result.bags40)} unit="bags" />
                <ResultRow label="60 lb Bags" value={fmtInt(result.bags60)} unit="bags" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 103. CONCRETE WEIGHT CALCULATOR ──────────── */
function ConcreteWeightCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [thickness, setThickness] = useState(4);
    const [concreteType, setConcreteType] = useState("standard");

    const WEIGHT_PER_CUFT: Record<string, number> = {
        "standard": 150, "lightweight": 110, "heavyweight": 180, "reinforced": 156,
    };

    const result = useMemo(() => {
        const thickFt = thickness / 12;
        const cuFt = length * width * thickFt;
        const cuYd = cuFt / 27;
        const weightPerCf = WEIGHT_PER_CUFT[concreteType] || 150;
        const totalWeight = cuFt * weightPerCf;
        const tons = totalWeight / 2000;
        return { cuFt, cuYd, totalWeight, tons, weightPerCf };
    }, [length, width, thickness, concreteType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⚖️ Concrete Weight Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={2} max={24} />
                <SelectField label="Concrete Type" value={concreteType} onChange={setConcreteType} options={[
                    { value: "standard", label: "Standard (150 lb/cu ft)" },
                    { value: "lightweight", label: "Lightweight (110 lb/cu ft)" },
                    { value: "reinforced", label: "Reinforced (156 lb/cu ft)" },
                    { value: "heavyweight", label: "Heavyweight (180 lb/cu ft)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.totalWeight)} unit="lbs" />
                <ResultRow label="Tons" value={fmt(result.tons, 2)} unit="tons" />
            </div>
        </div>
    );
}

/* ──────────── 104. REBAR WEIGHT CALCULATOR ──────────── */
function RebarWeightCalc() {
    const [barSize, setBarSize] = useState(4);
    const [totalLength, setTotalLength] = useState(100);

    const REBAR_DATA: Record<number, { diameter: number; weight: number; area: number }> = {
        3: { diameter: 0.375, weight: 0.376, area: 0.11 },
        4: { diameter: 0.500, weight: 0.668, area: 0.20 },
        5: { diameter: 0.625, weight: 1.043, area: 0.31 },
        6: { diameter: 0.750, weight: 1.502, area: 0.44 },
        7: { diameter: 0.875, weight: 2.044, area: 0.60 },
        8: { diameter: 1.000, weight: 2.670, area: 0.79 },
        9: { diameter: 1.128, weight: 3.400, area: 1.00 },
        10: { diameter: 1.270, weight: 4.303, area: 1.27 },
        11: { diameter: 1.410, weight: 5.313, area: 1.56 },
        14: { diameter: 1.693, weight: 7.650, area: 2.25 },
        18: { diameter: 2.257, weight: 13.600, area: 4.00 },
    };

    const result = useMemo(() => {
        const data = REBAR_DATA[barSize] || REBAR_DATA[4];
        const totalWeight = data.weight * totalLength;
        const bars20ft = Math.ceil(totalLength / 20);
        return { ...data, totalWeight, bars20ft };
    }, [barSize, totalLength]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Rebar Weight Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Bar Size" value={String(barSize)} onChange={(v) => setBarSize(Number(v))} options={[
                    { value: "3", label: "#3 (3/8\")" }, { value: "4", label: "#4 (1/2\")" },
                    { value: "5", label: "#5 (5/8\")" }, { value: "6", label: "#6 (3/4\")" },
                    { value: "7", label: "#7 (7/8\")" }, { value: "8", label: "#8 (1\")" },
                    { value: "9", label: "#9 (1-1/8\")" }, { value: "10", label: "#10 (1-1/4\")" },
                    { value: "11", label: "#11 (1-3/8\")" }, { value: "14", label: "#14 (1-11/16\")" },
                    { value: "18", label: "#18 (2-1/4\")" },
                ]} />
                <InputField label="Total Length" value={totalLength} onChange={setTotalLength} unit="ft" min={1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Bar Diameter" value={`${result.diameter}"`} />
                <ResultRow label="Weight per Foot" value={fmt(result.weight, 3)} unit="lb/ft" />
                <ResultRow label="Cross-Section Area" value={fmt(result.area, 2)} unit="sq in" />
                <ResultRow label="Total Weight" value={fmt(result.totalWeight)} unit="lbs" />
                <ResultRow label="20 ft Bars" value={fmtInt(result.bars20ft)} unit="bars" />
            </div>
        </div>
    );
}

/* ──────────── 105. CONCRETE COST CALCULATOR ──────────── */
function ConcreteCostCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(20);
    const [thickness, setThickness] = useState(4);
    const [finishType, setFinishType] = useState("broom");

    const FINISH_COST: Record<string, number> = {
        "broom": 6, "smooth": 7, "stamped": 14, "exposed": 10, "colored": 11,
    };

    const result = useMemo(() => {
        const area = length * width;
        const cuFt = area * (thickness / 12);
        const cuYd = cuFt / 27;
        const materialCost = cuYd * 140; // ~$140/cu yd ready mix
        const deliveryCost = cuYd < 5 ? 150 : 0; // short load fee
        const laborCost = area * (FINISH_COST[finishType] || 6);
        const totalCost = materialCost + deliveryCost + laborCost;
        return { area, cuYd, materialCost, deliveryCost, laborCost, totalCost };
    }, [length, width, thickness, finishType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💰 Concrete Cost Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={4} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={4} />
                <InputField label="Thickness" value={thickness} onChange={setThickness} unit="in" min={3} max={8} />
                <SelectField label="Finish Type" value={finishType} onChange={setFinishType} options={[
                    { value: "broom", label: "Broom Finish ($6/sq ft)" },
                    { value: "smooth", label: "Smooth Trowel ($7/sq ft)" },
                    { value: "exposed", label: "Exposed Aggregate ($10/sq ft)" },
                    { value: "colored", label: "Colored/Stained ($11/sq ft)" },
                    { value: "stamped", label: "Stamped ($14/sq ft)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Concrete" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Material" value={`$${fmt(result.materialCost)}`} />
                <ResultRow label="Labor & Finish" value={`$${fmt(result.laborCost)}`} />
                {result.deliveryCost > 0 && <ResultRow label="Short Load Fee" value={`$${fmt(result.deliveryCost)}`} />}
                <ResultRow label="Total Estimate" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 106. SOIL VOLUME CALCULATOR ──────────── */
function SoilVolumeCalc() {
    const [length, setLength] = useState(8);
    const [width, setWidth] = useState(4);
    const [depth, setDepth] = useState(12);
    const [numBeds, setNumBeds] = useState(1);

    const result = useMemo(() => {
        const depthFt = depth / 12;
        const cuFtEach = length * width * depthFt;
        const totalCuFt = cuFtEach * numBeds;
        const cuYd = totalCuFt / 27;
        const bags1cuft = Math.ceil(totalCuFt);
        const bags2cuft = Math.ceil(totalCuFt / 2);
        return { cuFtEach, totalCuFt, cuYd, bags1cuft, bags2cuft };
    }, [length, width, depth, numBeds]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌱 Soil Volume Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Depth" value={depth} onChange={setDepth} unit="in" min={4} max={36} />
                <InputField label="Number of Beds" value={numBeds} onChange={setNumBeds} min={1} max={20} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume per Bed" value={fmt(result.cuFtEach)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="1 cu ft Bags" value={fmtInt(result.bags1cuft)} unit="bags" />
                <ResultRow label="2 cu ft Bags" value={fmtInt(result.bags2cuft)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 107. ROOFING COST CALCULATOR ──────────── */
function RoofingCostCalc() {
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(24);
    const [pitch, setPitch] = useState(6);
    const [material, setMaterial] = useState("asphalt-3tab");

    const MATERIAL_COST: Record<string, { material: number; labor: number }> = {
        "asphalt-3tab": { material: 1.50, labor: 2.00 },
        "asphalt-arch": { material: 2.50, labor: 2.50 },
        "metal-standing": { material: 5.00, labor: 4.00 },
        "clay-tile": { material: 8.00, labor: 5.00 },
        "flat-tpo": { material: 3.50, labor: 3.00 },
    };

    const result = useMemo(() => {
        const flatArea = roofLength * roofWidth;
        const pitchMult = Math.sqrt(1 + Math.pow(pitch / 12, 2));
        const roofArea = flatArea * pitchMult;
        const squares = roofArea / 100;
        const costs = MATERIAL_COST[material] || MATERIAL_COST["asphalt-3tab"];
        const materialCost = roofArea * costs.material;
        const laborCost = roofArea * costs.labor;
        const tearOff = roofArea * 1.25;
        const totalCost = materialCost + laborCost + tearOff;
        return { flatArea, roofArea, squares, materialCost, laborCost, tearOff, totalCost };
    }, [roofLength, roofWidth, pitch, material]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Roofing Cost Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length" value={roofLength} onChange={setRoofLength} unit="ft" min={10} />
                <InputField label="Building Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={10} />
                <InputField label="Pitch" value={pitch} onChange={setPitch} unit="/12" min={0} max={12} />
                <SelectField label="Material" value={material} onChange={setMaterial} options={[
                    { value: "asphalt-3tab", label: "Asphalt 3-Tab ($3.50/sq ft)" },
                    { value: "asphalt-arch", label: "Architectural Shingle ($5/sq ft)" },
                    { value: "metal-standing", label: "Standing Seam Metal ($9/sq ft)" },
                    { value: "clay-tile", label: "Clay Tile ($13/sq ft)" },
                    { value: "flat-tpo", label: "TPO Flat Roof ($6.50/sq ft)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Roof Area" value={fmt(result.roofArea)} unit="sq ft" />
                <ResultRow label="Squares" value={fmt(result.squares, 1)} />
                <ResultRow label="Material" value={`$${fmt(result.materialCost)}`} />
                <ResultRow label="Labor" value={`$${fmt(result.laborCost)}`} />
                <ResultRow label="Tear-Off" value={`$${fmt(result.tearOff)}`} />
                <ResultRow label="Total Estimate" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 108. FOUNDATION CALCULATOR ──────────── */
function FoundationCalc() {
    const [perimeter, setPerimeter] = useState(140);
    const [footingWidth, setFootingWidth] = useState(16);
    const [footingDepth, setFootingDepth] = useState(8);
    const [wallHeight, setWallHeight] = useState(8);
    const [wallThickness, setWallThickness] = useState(8);

    const result = useMemo(() => {
        const footingWidthFt = footingWidth / 12;
        const footingDepthFt = footingDepth / 12;
        const wallThickFt = wallThickness / 12;
        const footingCuFt = perimeter * footingWidthFt * footingDepthFt;
        const wallCuFt = perimeter * wallThickFt * wallHeight;
        const totalCuFt = footingCuFt + wallCuFt;
        const cuYd = totalCuFt / 27;
        const cuYdWithWaste = cuYd * 1.1;
        return { footingCuFt, wallCuFt, totalCuFt, cuYd, cuYdWithWaste };
    }, [perimeter, footingWidth, footingDepth, wallHeight, wallThickness]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Foundation Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Perimeter" value={perimeter} onChange={setPerimeter} unit="ft" min={20} />
                <InputField label="Footing Width" value={footingWidth} onChange={setFootingWidth} unit="in" min={12} max={36} />
                <InputField label="Footing Depth" value={footingDepth} onChange={setFootingDepth} unit="in" min={6} max={24} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={0} max={12} />
                <InputField label="Wall Thickness" value={wallThickness} onChange={setWallThickness} unit="in" min={6} max={12} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Footing Volume" value={fmt(result.footingCuFt)} unit="cu ft" />
                <ResultRow label="Wall Volume" value={fmt(result.wallCuFt)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuFt)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 1)} unit="cu yd" />
                <ResultRow label="Order (+10%)" value={fmt(result.cuYdWithWaste, 1)} unit="cu yd" />
            </div>
        </div>
    );
}

/* ──────────── 109. BEAM SPAN CALCULATOR ──────────── */
function BeamSpanCalc() {
    const [beamType, setBeamType] = useState("lvl-1.75x11.25");
    const [tributaryWidth, setTributaryWidth] = useState(8);
    const [loadType, setLoadType] = useState("floor");

    const BEAM_SPANS: Record<string, Record<string, number>> = {
        "2x-2x8": { "floor": 5, "roof": 7 },
        "2x-2x10": { "floor": 7, "roof": 9 },
        "2x-2x12": { "floor": 9, "roof": 12 },
        "lvl-1.75x9.25": { "floor": 10, "roof": 14 },
        "lvl-1.75x11.25": { "floor": 13, "roof": 17 },
        "lvl-1.75x14": { "floor": 16, "roof": 21 },
        "glulam-3.125x9": { "floor": 11, "roof": 15 },
        "glulam-3.125x12": { "floor": 15, "roof": 20 },
        "steel-w8x18": { "floor": 18, "roof": 24 },
    };

    const result = useMemo(() => {
        const spans = BEAM_SPANS[beamType] || {};
        const baseSpan = spans[loadType] || 10;
        const adjustedSpan = tributaryWidth <= 8 ? baseSpan : baseSpan * (8 / tributaryWidth);
        return { baseSpan, adjustedSpan, tributaryWidth };
    }, [beamType, tributaryWidth, loadType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Beam Span Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Beam Type" value={beamType} onChange={setBeamType} options={[
                    { value: "2x-2x8", label: "Doubled 2×8" },
                    { value: "2x-2x10", label: "Doubled 2×10" },
                    { value: "2x-2x12", label: "Doubled 2×12" },
                    { value: "lvl-1.75x9.25", label: "LVL 1.75×9.25" },
                    { value: "lvl-1.75x11.25", label: "LVL 1.75×11.25" },
                    { value: "lvl-1.75x14", label: "LVL 1.75×14" },
                    { value: "glulam-3.125x9", label: "Glulam 3.125×9" },
                    { value: "glulam-3.125x12", label: "Glulam 3.125×12" },
                    { value: "steel-w8x18", label: "Steel W8×18" },
                ]} />
                <InputField label="Tributary Width" value={tributaryWidth} onChange={setTributaryWidth} unit="ft" min={4} max={20} />
                <SelectField label="Load Type" value={loadType} onChange={setLoadType} options={[
                    { value: "floor", label: "Floor Load (40 psf)" },
                    { value: "roof", label: "Roof Load (20 psf)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Max Span (8 ft trib.)" value={fmt(result.baseSpan, 1)} unit="ft" />
                <ResultRow label="Adjusted Span" value={fmt(result.adjustedSpan, 1)} unit="ft" />
            </div>
        </div>
    );
}

/* ──────────── 110. HEADER SIZE CALCULATOR ──────────── */
function HeaderSizeCalc() {
    const [openingWidth, setOpeningWidth] = useState(6);
    const [wallType, setWallType] = useState("load-bearing");
    const [stories, setStories] = useState(1);

    const result = useMemo(() => {
        let headerSize: string;
        let headerDepth: number;
        const span = openingWidth;

        if (wallType === "non-bearing") {
            headerSize = span <= 6 ? "2×4 flat" : span <= 8 ? "2×6" : "2×8";
            headerDepth = span <= 6 ? 3.5 : span <= 8 ? 5.5 : 7.25;
        } else {
            const multStory = stories >= 2 ? 1 : 0;
            if (span <= 4) { headerSize = "Doubled 2×6"; headerDepth = 5.5; }
            else if (span <= 6) { headerSize = multStory ? "Doubled 2×10" : "Doubled 2×8"; headerDepth = multStory ? 9.25 : 7.25; }
            else if (span <= 8) { headerSize = multStory ? "Doubled 2×12" : "Doubled 2×10"; headerDepth = multStory ? 11.25 : 9.25; }
            else if (span <= 10) { headerSize = multStory ? "LVL 1.75×11.25" : "Doubled 2×12"; headerDepth = multStory ? 11.25 : 11.25; }
            else { headerSize = "LVL or Engineered — consult engineer"; headerDepth = 14; }
        }

        const jackStudHeight = 80 - headerDepth; // rough opening assumes ~80" for door
        return { headerSize, headerDepth, jackStudHeight, span };
    }, [openingWidth, wallType, stories]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Header Size Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Opening Width" value={openingWidth} onChange={setOpeningWidth} unit="ft" min={2} max={16} />
                <SelectField label="Wall Type" value={wallType} onChange={setWallType} options={[
                    { value: "load-bearing", label: "Load-Bearing" },
                    { value: "non-bearing", label: "Non-Load-Bearing" },
                ]} />
                <SelectField label="Stories Supported" value={String(stories)} onChange={(v) => setStories(Number(v))} options={[
                    { value: "1", label: "1 Story (Roof Only)" },
                    { value: "2", label: "2 Stories (Floor + Roof)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Opening Span" value={fmtInt(result.span)} unit="ft" />
                <ResultRow label="Recommended Header" value={result.headerSize} />
                <ResultRow label="Header Depth" value={fmt(result.headerDepth, 2)} unit="in" />
                <ResultRow label="Jack Stud Height" value={fmt(result.jackStudHeight, 2)} unit="in" />
            </div>
        </div>
    );
}



/* ──────────── 111. DECK STAIN CALCULATOR ──────────── */
function DeckStainCalc() {
    const [deckArea, setDeckArea] = useState(300);
    const [numCoats, setNumCoats] = useState(2);
    const [stainType, setStainType] = useState("semi-transparent");

    const COVERAGE: Record<string, number> = {
        "transparent": 400, "semi-transparent": 300, "solid": 200, "sealer": 350,
    };

    const result = useMemo(() => {
        const coverage = COVERAGE[stainType] || 300;
        const totalArea = deckArea * numCoats;
        const gallons = Math.ceil(totalArea / coverage);
        const quarts = Math.ceil((totalArea / coverage) * 4);
        return { totalArea, coverage, gallons, quarts };
    }, [deckArea, numCoats, stainType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🖌️ Deck Stain Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Deck Area" value={deckArea} onChange={setDeckArea} unit="sq ft" min={50} />
                <SelectField label="Stain Type" value={stainType} onChange={setStainType} options={[
                    { value: "transparent", label: "Transparent (400 sq ft/gal)" },
                    { value: "semi-transparent", label: "Semi-Transparent (300 sq ft/gal)" },
                    { value: "solid", label: "Solid Color (200 sq ft/gal)" },
                    { value: "sealer", label: "Clear Sealer (350 sq ft/gal)" },
                ]} />
                <SelectField label="Coats" value={String(numCoats)} onChange={(v) => setNumCoats(Number(v))} options={[
                    { value: "1", label: "1 Coat" },
                    { value: "2", label: "2 Coats (Recommended)" },
                    { value: "3", label: "3 Coats" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Coverage" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Gallons Needed" value={fmtInt(result.gallons)} unit="gal" />
                <ResultRow label="Quarts Needed" value={fmtInt(result.quarts)} unit="qt" />
            </div>
        </div>
    );
}

/* ──────────── 112. PAVER BASE CALCULATOR ──────────── */
function PaverBaseCalc() {
    const [area, setArea] = useState(200);
    const [baseDepth, setBaseDepth] = useState(6);
    const [sandDepth, setSandDepth] = useState(1);

    const result = useMemo(() => {
        const baseCuFt = area * (baseDepth / 12);
        const baseCuYd = baseCuFt / 27;
        const baseTons = baseCuYd * 1.4; // crushed stone ~1.4 tons/cu yd
        const sandCuFt = area * (sandDepth / 12);
        const sandCuYd = sandCuFt / 27;
        const sandTons = sandCuYd * 1.35;
        return { baseCuFt, baseCuYd, baseTons, sandCuFt, sandCuYd, sandTons };
    }, [area, baseDepth, sandDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Paver Base Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Paver Area" value={area} onChange={setArea} unit="sq ft" min={10} />
                <InputField label="Gravel Base Depth" value={baseDepth} onChange={setBaseDepth} unit="in" min={4} max={12} />
                <InputField label="Sand Bedding Depth" value={sandDepth} onChange={setSandDepth} unit="in" min={1} max={2} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Gravel Base" value={fmt(result.baseCuYd, 2)} unit="cu yd" />
                <ResultRow label="Gravel Weight" value={fmt(result.baseTons, 1)} unit="tons" />
                <ResultRow label="Sand Bedding" value={fmt(result.sandCuYd, 2)} unit="cu yd" />
                <ResultRow label="Sand Weight" value={fmt(result.sandTons, 1)} unit="tons" />
            </div>
        </div>
    );
}

/* ──────────── 113. POLYMERIC SAND CALCULATOR ──────────── */
function PolymericSandCalc() {
    const [area, setArea] = useState(200);
    const [jointWidth, setJointWidth] = useState(0.25);
    const [paverThickness, setPaverThickness] = useState(2.375);

    const result = useMemo(() => {
        // Joint volume ≈ area × joint ratio × depth
        // Typical: ~50 sq ft per 50 lb bag for standard joints
        const jointRatio = jointWidth / (jointWidth + 6); // assume 6" avg paver size
        const jointVolCuFt = area * jointRatio * (paverThickness / 12);
        const bags50 = Math.ceil(jointVolCuFt / 0.5); // 50 lb bag ≈ 0.5 cu ft
        const bags50WithWaste = Math.ceil(bags50 * 1.1);
        return { jointVolCuFt, bags50, bags50WithWaste };
    }, [area, jointWidth, paverThickness]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⏳ Polymeric Sand Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Paver Area" value={area} onChange={setArea} unit="sq ft" min={10} />
                <SelectField label="Joint Width" value={String(jointWidth)} onChange={(v) => setJointWidth(Number(v))} options={[
                    { value: "0.125", label: '1/8" (Tight)' },
                    { value: "0.25", label: '1/4" (Standard)' },
                    { value: "0.375", label: '3/8" (Wide)' },
                    { value: "0.5", label: '1/2" (Extra Wide)' },
                ]} />
                <SelectField label="Paver Thickness" value={String(paverThickness)} onChange={(v) => setPaverThickness(Number(v))} options={[
                    { value: "1.5", label: '1.5" (Thin Overlay)' },
                    { value: "2.375", label: '2-3/8" (Standard)' },
                    { value: "3.125", label: '3-1/8" (Thick/Vehicular)' },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Joint Volume" value={fmt(result.jointVolCuFt, 2)} unit="cu ft" />
                <ResultRow label="50 lb Bags" value={fmtInt(result.bags50)} unit="bags" />
                <ResultRow label="With 10% Waste" value={fmtInt(result.bags50WithWaste)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 114. ASPHALT SEALER CALCULATOR ──────────── */
function AsphaltSealerCalc() {
    const [area, setArea] = useState(600);
    const [numCoats, setNumCoats] = useState(2);
    const [condition, setCondition] = useState("fair");

    const COVERAGE: Record<string, number> = {
        "good": 90, "fair": 70, "poor": 50,
    };

    const result = useMemo(() => {
        const coverage = COVERAGE[condition] || 70;
        const totalArea = area * numCoats;
        const gallons = totalArea / coverage;
        const buckets5gal = Math.ceil(gallons / 5);
        return { totalArea, coverage, gallons, buckets5gal };
    }, [area, numCoats, condition]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🛢️ Asphalt Sealer Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Driveway Area" value={area} onChange={setArea} unit="sq ft" min={100} />
                <SelectField label="Surface Condition" value={condition} onChange={setCondition} options={[
                    { value: "good", label: "Good — Smooth (90 sq ft/gal)" },
                    { value: "fair", label: "Fair — Some Cracks (70 sq ft/gal)" },
                    { value: "poor", label: "Poor — Rough/Porous (50 sq ft/gal)" },
                ]} />
                <SelectField label="Coats" value={String(numCoats)} onChange={(v) => setNumCoats(Number(v))} options={[
                    { value: "1", label: "1 Coat" },
                    { value: "2", label: "2 Coats (Recommended)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Coverage" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Gallons Needed" value={fmt(result.gallons, 1)} unit="gal" />
                <ResultRow label="5-Gal Buckets" value={fmtInt(result.buckets5gal)} unit="pails" />
            </div>
        </div>
    );
}

/* ──────────── 115. GRAVEL DRIVEWAY CALCULATOR ──────────── */
function GravelDrivewayCalc() {
    const [length, setLength] = useState(50);
    const [width, setWidth] = useState(12);
    const [totalDepth, setTotalDepth] = useState(6);

    const result = useMemo(() => {
        const area = length * width;
        const cuFt = area * (totalDepth / 12);
        const cuYd = cuFt / 27;
        const tons = cuYd * 1.4;
        // Layer breakdown: 60% base, 30% middle, 10% top
        const baseTons = tons * 0.6;
        const middleTons = tons * 0.3;
        const topTons = tons * 0.1;
        return { area, cuFt, cuYd, tons, baseTons, middleTons, topTons };
    }, [length, width, totalDepth]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Gravel Driveway Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={10} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={8} max={24} />
                <InputField label="Total Depth" value={totalDepth} onChange={setTotalDepth} unit="in" min={4} max={12} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Total Volume" value={fmt(result.cuYd, 1)} unit="cu yd" />
                <ResultRow label="Total Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Base Layer (#3)" value={fmt(result.baseTons, 1)} unit="tons" />
                <ResultRow label="Middle (#57)" value={fmt(result.middleTons, 1)} unit="tons" />
                <ResultRow label="Top Layer (#8)" value={fmt(result.topTons, 1)} unit="tons" />
            </div>
        </div>
    );
}

/* ──────────── 116. FENCE STAIN CALCULATOR ──────────── */
function FenceStainCalc() {
    const [fenceLength, setFenceLength] = useState(100);
    const [fenceHeight, setFenceHeight] = useState(6);
    const [sides, setSides] = useState(2);
    const [stainType, setStainType] = useState("semi-transparent");

    const COVERAGE: Record<string, number> = {
        "transparent": 350, "semi-transparent": 250, "solid": 200,
    };

    const result = useMemo(() => {
        const totalArea = fenceLength * fenceHeight * sides;
        const coverage = COVERAGE[stainType] || 250;
        const gallons = Math.ceil(totalArea / coverage);
        return { totalArea, coverage, gallons };
    }, [fenceLength, fenceHeight, sides, stainType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🖌️ Fence Stain Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Fence Length" value={fenceLength} onChange={setFenceLength} unit="ft" min={10} />
                <InputField label="Fence Height" value={fenceHeight} onChange={setFenceHeight} unit="ft" min={3} max={8} />
                <SelectField label="Sides to Stain" value={String(sides)} onChange={(v) => setSides(Number(v))} options={[
                    { value: "1", label: "1 Side" },
                    { value: "2", label: "Both Sides" },
                ]} />
                <SelectField label="Stain Type" value={stainType} onChange={setStainType} options={[
                    { value: "transparent", label: "Transparent (350 sq ft/gal)" },
                    { value: "semi-transparent", label: "Semi-Transparent (250 sq ft/gal)" },
                    { value: "solid", label: "Solid Color (200 sq ft/gal)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Total Area" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Gallons Needed" value={fmtInt(result.gallons)} unit="gal" />
            </div>
        </div>
    );
}

/* ──────────── 117. VINYL FENCE CALCULATOR ──────────── */
function VinylFenceCalc() {
    const [totalLength, setTotalLength] = useState(150);
    const [fenceHeight, setFenceHeight] = useState(6);
    const [panelWidth, setPanelWidth] = useState(8);
    const [numGates, setNumGates] = useState(1);

    const result = useMemo(() => {
        const gateWidth = 4; // ft
        const fenceableLength = totalLength - (numGates * gateWidth);
        const numPanels = Math.ceil(fenceableLength / panelWidth);
        const numPosts = numPanels + 1 + numGates; // end posts + gate posts
        const postCaps = numPosts;
        return { fenceableLength, numPanels, numPosts, postCaps, numGates };
    }, [totalLength, fenceHeight, panelWidth, numGates]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏡 Vinyl Fence Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Total Length" value={totalLength} onChange={setTotalLength} unit="ft" min={20} />
                <SelectField label="Fence Height" value={String(fenceHeight)} onChange={(v) => setFenceHeight(Number(v))} options={[
                    { value: "4", label: "4 ft (Picket)" },
                    { value: "5", label: "5 ft (Semi-Privacy)" },
                    { value: "6", label: "6 ft (Privacy)" },
                    { value: "8", label: "8 ft (Tall Privacy)" },
                ]} />
                <SelectField label="Panel Width" value={String(panelWidth)} onChange={(v) => setPanelWidth(Number(v))} options={[
                    { value: "6", label: "6 ft Panels" },
                    { value: "8", label: "8 ft Panels (Standard)" },
                ]} />
                <InputField label="Gates" value={numGates} onChange={setNumGates} min={0} max={5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Panels" value={fmtInt(result.numPanels)} />
                <ResultRow label="Posts" value={fmtInt(result.numPosts)} />
                <ResultRow label="Post Caps" value={fmtInt(result.postCaps)} />
                <ResultRow label="Gates" value={fmtInt(result.numGates)} />
            </div>
        </div>
    );
}

/* ──────────── 118. FENCE COST CALCULATOR ──────────── */
function FenceCostCalc() {
    const [fenceLength, setFenceLength] = useState(150);
    const [fenceHeight, setFenceHeight] = useState(6);
    const [material, setMaterial] = useState("wood-privacy");

    const COST_PER_LF: Record<string, { material: number; labor: number }> = {
        "wood-privacy": { material: 12, labor: 15 },
        "wood-picket": { material: 8, labor: 12 },
        "vinyl-privacy": { material: 25, labor: 18 },
        "chain-link": { material: 7, labor: 10 },
        "aluminum": { material: 30, labor: 20 },
        "wrought-iron": { material: 35, labor: 25 },
    };

    const result = useMemo(() => {
        const costs = COST_PER_LF[material] || COST_PER_LF["wood-privacy"];
        const heightMult = fenceHeight > 6 ? 1.3 : fenceHeight < 4 ? 0.7 : 1.0;
        const materialCost = fenceLength * costs.material * heightMult;
        const laborCost = fenceLength * costs.labor * heightMult;
        const totalCost = materialCost + laborCost;
        return { materialCost, laborCost, totalCost, costPerFoot: totalCost / fenceLength };
    }, [fenceLength, fenceHeight, material]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💰 Fence Cost Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Fence Length" value={fenceLength} onChange={setFenceLength} unit="ft" min={20} />
                <SelectField label="Height" value={String(fenceHeight)} onChange={(v) => setFenceHeight(Number(v))} options={[
                    { value: "3", label: "3 ft" }, { value: "4", label: "4 ft" },
                    { value: "6", label: "6 ft" }, { value: "8", label: "8 ft" },
                ]} />
                <SelectField label="Material" value={material} onChange={setMaterial} options={[
                    { value: "wood-privacy", label: "Wood Privacy ($27/ft)" },
                    { value: "wood-picket", label: "Wood Picket ($20/ft)" },
                    { value: "chain-link", label: "Chain Link ($17/ft)" },
                    { value: "vinyl-privacy", label: "Vinyl Privacy ($43/ft)" },
                    { value: "aluminum", label: "Aluminum ($50/ft)" },
                    { value: "wrought-iron", label: "Wrought Iron ($60/ft)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Material" value={`$${fmt(result.materialCost)}`} />
                <ResultRow label="Labor" value={`$${fmt(result.laborCost)}`} />
                <ResultRow label="Total" value={`$${fmt(result.totalCost)}`} />
                <ResultRow label="Per Foot" value={`$${fmt(result.costPerFoot, 2)}`} unit="/ft" />
            </div>
        </div>
    );
}

/* ──────────── 119. LINEAR FEET TO SQUARE FEET CALCULATOR ──────────── */
function LinearSqftCalc() {
    const [linearFeet, setLinearFeet] = useState(100);
    const [widthIn, setWidthIn] = useState(6);
    const [mode, setMode] = useState("lf-to-sf");

    const result = useMemo(() => {
        const widthFt = widthIn / 12;
        if (mode === "lf-to-sf") {
            const sqFt = linearFeet * widthFt;
            return { linearFeet, sqFt, widthFt };
        } else {
            const lf = linearFeet / widthFt; // linearFeet is being used as sqFt input
            return { linearFeet: lf, sqFt: linearFeet, widthFt };
        }
    }, [linearFeet, widthIn, mode]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Linear Feet ↔ Square Feet</h3>
            <div className="con-calc__inputs">
                <SelectField label="Convert" value={mode} onChange={setMode} options={[
                    { value: "lf-to-sf", label: "Linear Feet → Square Feet" },
                    { value: "sf-to-lf", label: "Square Feet → Linear Feet" },
                ]} />
                <InputField label={mode === "lf-to-sf" ? "Linear Feet" : "Square Feet"} value={linearFeet} onChange={setLinearFeet} unit={mode === "lf-to-sf" ? "lin ft" : "sq ft"} min={1} />
                <InputField label="Material Width" value={widthIn} onChange={setWidthIn} unit="in" min={1} max={48} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Linear Feet" value={fmt(result.linearFeet, 1)} unit="lin ft" />
                <ResultRow label="Square Feet" value={fmt(result.sqFt, 1)} unit="sq ft" />
                <ResultRow label="Width" value={`${widthIn}" (${fmt(result.widthFt, 2)} ft)`} />
            </div>
        </div>
    );
}

/* ──────────── 120. FLOORING COST CALCULATOR ──────────── */
function FlooringCostCalc() {
    const [length, setLength] = useState(15);
    const [width, setWidth] = useState(12);
    const [material, setMaterial] = useState("laminate");

    const COST_PER_SQFT: Record<string, { material: number; labor: number; underlay: number }> = {
        "hardwood": { material: 6, labor: 4, underlay: 0.5 },
        "engineered": { material: 5, labor: 3.5, underlay: 0.5 },
        "laminate": { material: 2.5, labor: 2, underlay: 0.3 },
        "vinyl-plank": { material: 3, labor: 2, underlay: 0.3 },
        "tile": { material: 4, labor: 6, underlay: 1 },
        "carpet": { material: 2, labor: 1.5, underlay: 0.5 },
    };

    const result = useMemo(() => {
        const area = length * width;
        const areaWithWaste = area * 1.1; // 10% waste
        const costs = COST_PER_SQFT[material] || COST_PER_SQFT["laminate"];
        const materialCost = areaWithWaste * costs.material;
        const laborCost = area * costs.labor;
        const underlayCost = area * costs.underlay;
        const totalCost = materialCost + laborCost + underlayCost;
        return { area, areaWithWaste, materialCost, laborCost, underlayCost, totalCost };
    }, [length, width, material]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💰 Flooring Cost Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={length} onChange={setLength} unit="ft" min={5} />
                <InputField label="Room Width" value={width} onChange={setWidth} unit="ft" min={5} />
                <SelectField label="Material" value={material} onChange={setMaterial} options={[
                    { value: "hardwood", label: "Hardwood ($10.50/sq ft)" },
                    { value: "engineered", label: "Engineered Wood ($9/sq ft)" },
                    { value: "laminate", label: "Laminate ($4.80/sq ft)" },
                    { value: "vinyl-plank", label: "Vinyl Plank ($5.30/sq ft)" },
                    { value: "tile", label: "Tile ($11/sq ft)" },
                    { value: "carpet", label: "Carpet ($4/sq ft)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Room Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Material (+10%)" value={fmt(result.areaWithWaste)} unit="sq ft" />
                <ResultRow label="Material Cost" value={`$${fmt(result.materialCost)}`} />
                <ResultRow label="Labor" value={`$${fmt(result.laborCost)}`} />
                <ResultRow label="Underlayment" value={`$${fmt(result.underlayCost)}`} />
                <ResultRow label="Total" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 121. BATHROOM RENOVATION COST CALCULATOR ──────────── */
function BathroomRenovationCostCalc() {
    const [bathSize, setBathSize] = useState("medium");
    const [scope, setScope] = useState("mid-range");

    const COSTS: Record<string, Record<string, { fixtures: number; tile: number; plumbing: number; electrical: number; labor: number }>> = {
        "small": {
            "cosmetic": { fixtures: 500, tile: 800, plumbing: 300, electrical: 200, labor: 1500 },
            "mid-range": { fixtures: 1500, tile: 2000, plumbing: 1200, electrical: 600, labor: 4000 },
            "upscale": { fixtures: 3500, tile: 4000, plumbing: 2500, electrical: 1200, labor: 7000 },
        },
        "medium": {
            "cosmetic": { fixtures: 800, tile: 1200, plumbing: 500, electrical: 300, labor: 2200 },
            "mid-range": { fixtures: 2500, tile: 3500, plumbing: 2000, electrical: 1000, labor: 6000 },
            "upscale": { fixtures: 5000, tile: 6000, plumbing: 3500, electrical: 2000, labor: 10000 },
        },
        "large": {
            "cosmetic": { fixtures: 1200, tile: 1800, plumbing: 800, electrical: 500, labor: 3200 },
            "mid-range": { fixtures: 4000, tile: 5000, plumbing: 3000, electrical: 1500, labor: 8500 },
            "upscale": { fixtures: 8000, tile: 9000, plumbing: 5000, electrical: 3000, labor: 15000 },
        },
    };

    const result = useMemo(() => {
        const c = COSTS[bathSize]?.[scope] || COSTS["medium"]["mid-range"];
        const total = c.fixtures + c.tile + c.plumbing + c.electrical + c.labor;
        return { ...c, total };
    }, [bathSize, scope]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🛁 Bathroom Renovation Cost Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Bathroom Size" value={bathSize} onChange={setBathSize} options={[
                    { value: "small", label: "Small (up to 40 sq ft)" },
                    { value: "medium", label: "Medium (40–75 sq ft)" },
                    { value: "large", label: "Large (75+ sq ft)" },
                ]} />
                <SelectField label="Renovation Scope" value={scope} onChange={setScope} options={[
                    { value: "cosmetic", label: "Cosmetic (paint, fixtures, accessories)" },
                    { value: "mid-range", label: "Mid-Range (new tile, vanity, tub)" },
                    { value: "upscale", label: "Upscale (full gut, custom finishes)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Fixtures" value={`$${fmt(result.fixtures)}`} />
                <ResultRow label="Tile & Surfaces" value={`$${fmt(result.tile)}`} />
                <ResultRow label="Plumbing" value={`$${fmt(result.plumbing)}`} />
                <ResultRow label="Electrical" value={`$${fmt(result.electrical)}`} />
                <ResultRow label="Labor" value={`$${fmt(result.labor)}`} />
                <ResultRow label="Total Estimate" value={`$${fmt(result.total)}`} />
            </div>
        </div>
    );
}

/* ──────────── 122. ELECTRICAL COST CALCULATOR ──────────── */
function ElectricalCostCalc() {
    const [sqFt, setSqFt] = useState(1500);
    const [projectType, setProjectType] = useState("new-circuits");

    const COST_DATA: Record<string, { perSqFt: number; permit: number; fixed: number }> = {
        "full-rewire": { perSqFt: 6, permit: 500, fixed: 2000 },
        "panel-upgrade": { perSqFt: 0, permit: 300, fixed: 2500 },
        "new-circuits": { perSqFt: 0, permit: 150, fixed: 0 },
        "whole-house-surge": { perSqFt: 0, permit: 100, fixed: 500 },
    };

    const [numCircuits, setNumCircuits] = useState(4);

    const result = useMemo(() => {
        const data = COST_DATA[projectType] || COST_DATA["new-circuits"];
        let material: number, labor: number;
        if (projectType === "full-rewire") {
            material = sqFt * data.perSqFt * 0.4;
            labor = sqFt * data.perSqFt * 0.6 + data.fixed;
        } else if (projectType === "panel-upgrade") {
            material = 800;
            labor = data.fixed;
        } else if (projectType === "new-circuits") {
            material = numCircuits * 75;
            labor = numCircuits * 200;
        } else {
            material = 150;
            labor = data.fixed;
        }
        const permit = data.permit;
        const total = material + labor + permit;
        return { material, labor, permit, total };
    }, [sqFt, projectType, numCircuits]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⚡ Electrical Cost Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Project Type" value={projectType} onChange={setProjectType} options={[
                    { value: "full-rewire", label: "Full House Rewire" },
                    { value: "panel-upgrade", label: "Panel Upgrade (100A→200A)" },
                    { value: "new-circuits", label: "Add New Circuits" },
                    { value: "whole-house-surge", label: "Whole-House Surge Protector" },
                ]} />
                {projectType === "full-rewire" && (
                    <InputField label="Home Size" value={sqFt} onChange={setSqFt} unit="sq ft" min={500} max={5000} />
                )}
                {projectType === "new-circuits" && (
                    <InputField label="Number of Circuits" value={numCircuits} onChange={setNumCircuits} min={1} max={20} />
                )}
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Material" value={`$${fmt(result.material)}`} />
                <ResultRow label="Labor" value={`$${fmt(result.labor)}`} />
                <ResultRow label="Permit" value={`$${fmt(result.permit)}`} />
                <ResultRow label="Total Estimate" value={`$${fmt(result.total)}`} />
            </div>
        </div>
    );
}

/* ──────────── 123. HVAC COST CALCULATOR ──────────── */
function HVACCostCalc() {
    const [sqFt, setSqFt] = useState(1500);
    const [systemType, setSystemType] = useState("central-ac");

    const SYSTEM_COSTS: Record<string, { unitPerSqFt: number; installBase: number; ductwork: number }> = {
        "central-ac": { unitPerSqFt: 1.5, installBase: 3000, ductwork: 2000 },
        "heat-pump": { unitPerSqFt: 2.0, installBase: 4000, ductwork: 2000 },
        "gas-furnace": { unitPerSqFt: 1.2, installBase: 2500, ductwork: 1500 },
        "mini-split": { unitPerSqFt: 2.5, installBase: 3500, ductwork: 0 },
        "full-system": { unitPerSqFt: 3.0, installBase: 5000, ductwork: 3000 },
    };

    const result = useMemo(() => {
        const data = SYSTEM_COSTS[systemType] || SYSTEM_COSTS["central-ac"];
        const unitCost = sqFt * data.unitPerSqFt;
        const installation = data.installBase;
        const ductwork = data.ductwork;
        const total = unitCost + installation + ductwork;
        return { unitCost, installation, ductwork, total };
    }, [sqFt, systemType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">❄️ HVAC Cost Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Home Size" value={sqFt} onChange={setSqFt} unit="sq ft" min={500} max={5000} />
                <SelectField label="System Type" value={systemType} onChange={setSystemType} options={[
                    { value: "central-ac", label: "Central Air Conditioning" },
                    { value: "heat-pump", label: "Heat Pump (Heating & Cooling)" },
                    { value: "gas-furnace", label: "Gas Furnace" },
                    { value: "mini-split", label: "Ductless Mini-Split" },
                    { value: "full-system", label: "Full System (AC + Furnace)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Equipment" value={`$${fmt(result.unitCost)}`} />
                <ResultRow label="Installation" value={`$${fmt(result.installation)}`} />
                <ResultRow label="Ductwork" value={`$${fmt(result.ductwork)}`} />
                <ResultRow label="Total Estimate" value={`$${fmt(result.total)}`} />
            </div>
        </div>
    );
}

/* ──────────── 124. KITCHEN RENOVATION COST CALCULATOR ──────────── */
function KitchenRenovationCostCalc() {
    const [kitchenSize, setKitchenSize] = useState("medium");
    const [scope, setScope] = useState("mid-range");

    const COSTS: Record<string, Record<string, { cabinets: number; countertops: number; appliances: number; flooring: number; labor: number }>> = {
        "small": {
            "cosmetic": { cabinets: 1000, countertops: 500, appliances: 0, flooring: 500, labor: 2000 },
            "mid-range": { cabinets: 5000, countertops: 2500, appliances: 3000, flooring: 1500, labor: 6000 },
            "upscale": { cabinets: 12000, countertops: 5000, appliances: 8000, flooring: 3000, labor: 12000 },
        },
        "medium": {
            "cosmetic": { cabinets: 1500, countertops: 800, appliances: 0, flooring: 800, labor: 3000 },
            "mid-range": { cabinets: 8000, countertops: 4000, appliances: 5000, flooring: 2500, labor: 9000 },
            "upscale": { cabinets: 20000, countertops: 8000, appliances: 12000, flooring: 5000, labor: 18000 },
        },
        "large": {
            "cosmetic": { cabinets: 2500, countertops: 1200, appliances: 0, flooring: 1200, labor: 4500 },
            "mid-range": { cabinets: 12000, countertops: 6000, appliances: 7000, flooring: 3500, labor: 12000 },
            "upscale": { cabinets: 30000, countertops: 12000, appliances: 18000, flooring: 7000, labor: 25000 },
        },
    };

    const result = useMemo(() => {
        const c = COSTS[kitchenSize]?.[scope] || COSTS["medium"]["mid-range"];
        const total = c.cabinets + c.countertops + c.appliances + c.flooring + c.labor;
        return { ...c, total };
    }, [kitchenSize, scope]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🍳 Kitchen Renovation Cost Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Kitchen Size" value={kitchenSize} onChange={setKitchenSize} options={[
                    { value: "small", label: "Small (under 70 sq ft)" },
                    { value: "medium", label: "Medium (70–150 sq ft)" },
                    { value: "large", label: "Large (150+ sq ft)" },
                ]} />
                <SelectField label="Renovation Scope" value={scope} onChange={setScope} options={[
                    { value: "cosmetic", label: "Cosmetic (paint, hardware, backsplash)" },
                    { value: "mid-range", label: "Mid-Range (new cabinets, counters, appliances)" },
                    { value: "upscale", label: "Upscale (custom, full gut renovation)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Cabinets" value={`$${fmt(result.cabinets)}`} />
                <ResultRow label="Countertops" value={`$${fmt(result.countertops)}`} />
                <ResultRow label="Appliances" value={`$${fmt(result.appliances)}`} />
                <ResultRow label="Flooring" value={`$${fmt(result.flooring)}`} />
                <ResultRow label="Labor" value={`$${fmt(result.labor)}`} />
                <ResultRow label="Total Estimate" value={`$${fmt(result.total)}`} />
            </div>
        </div>
    );
}

/* ──────────── 125. ACREAGE CALCULATOR ──────────── */
function AcreageCalc() {
    const [length, setLength] = useState(200);
    const [width, setWidth] = useState(200);

    const result = useMemo(() => {
        const sqFt = length * width;
        const acres = sqFt / 43560;
        const hectares = acres * 0.404686;
        const sqMeters = sqFt * 0.092903;
        return { sqFt, acres, hectares, sqMeters };
    }, [length, width]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Acreage Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Square Feet" value={fmt(result.sqFt)} unit="sq ft" />
                <ResultRow label="Acres" value={fmt(result.acres, 3)} unit="acres" />
                <ResultRow label="Hectares" value={fmt(result.hectares, 3)} unit="ha" />
                <ResultRow label="Square Meters" value={fmt(result.sqMeters)} unit="m²" />
            </div>
        </div>
    );
}

/* ──────────── 126. ELEVATION GRADE CALCULATOR ──────────── */
function ElevationGradeCalc() {
    const [run, setRun] = useState(100);
    const [rise, setRise] = useState(6);

    const result = useMemo(() => {
        const gradePercent = run > 0 ? (rise / run) * 100 : 0;
        const slopeRatio = run > 0 ? run / rise : 0;
        const angleDeg = run > 0 ? Math.atan(rise / run) * (180 / Math.PI) : 0;
        const slopeLength = Math.sqrt(run * run + rise * rise);
        return { gradePercent, slopeRatio, angleDeg, slopeLength };
    }, [run, rise]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⛰️ Elevation Grade Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Horizontal Run" value={run} onChange={setRun} unit="ft" min={1} />
                <InputField label="Rise (Elevation Change)" value={rise} onChange={setRise} unit="ft" min={0.1} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Grade" value={`${fmt(result.gradePercent, 2)}%`} />
                <ResultRow label="Slope Ratio" value={`1 : ${fmt(result.slopeRatio, 1)}`} />
                <ResultRow label="Angle" value={`${fmt(result.angleDeg, 2)}°`} />
                <ResultRow label="Slope Length" value={fmt(result.slopeLength, 1)} unit="ft" />
            </div>
        </div>
    );
}

/* ──────────── 127. GRASS SEED CALCULATOR ──────────── */
function GrassSeedCalc() {
    const [area, setArea] = useState(2000);
    const [seedType, setSeedType] = useState("kentucky-bluegrass");
    const [purpose, setPurpose] = useState("new-lawn");

    const SEED_RATES: Record<string, { newLawn: number; overseed: number }> = {
        "kentucky-bluegrass": { newLawn: 3, overseed: 1.5 },
        "tall-fescue": { newLawn: 8, overseed: 4 },
        "bermuda": { newLawn: 2, overseed: 1 },
        "perennial-rye": { newLawn: 8, overseed: 4 },
        "zoysia": { newLawn: 2, overseed: 1 },
    };

    const result = useMemo(() => {
        const rates = SEED_RATES[seedType] || SEED_RATES["kentucky-bluegrass"];
        const ratePerK = purpose === "new-lawn" ? rates.newLawn : rates.overseed;
        const lbs = (area / 1000) * ratePerK;
        const bags5lb = Math.ceil(lbs / 5);
        const bags25lb = Math.ceil(lbs / 25);
        return { ratePerK, lbs, bags5lb, bags25lb };
    }, [area, seedType, purpose]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌱 Grass Seed Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Lawn Area" value={area} onChange={setArea} unit="sq ft" min={100} />
                <SelectField label="Seed Type" value={seedType} onChange={setSeedType} options={[
                    { value: "kentucky-bluegrass", label: "Kentucky Bluegrass (3 lb/1000 sf)" },
                    { value: "tall-fescue", label: "Tall Fescue (8 lb/1000 sf)" },
                    { value: "bermuda", label: "Bermuda Grass (2 lb/1000 sf)" },
                    { value: "perennial-rye", label: "Perennial Ryegrass (8 lb/1000 sf)" },
                    { value: "zoysia", label: "Zoysia Grass (2 lb/1000 sf)" },
                ]} />
                <SelectField label="Purpose" value={purpose} onChange={setPurpose} options={[
                    { value: "new-lawn", label: "New Lawn (full rate)" },
                    { value: "overseed", label: "Overseeding (half rate)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Seed Rate" value={fmt(result.ratePerK, 1)} unit="lb/1000 sf" />
                <ResultRow label="Total Seed" value={fmt(result.lbs, 1)} unit="lbs" />
                <ResultRow label="5 lb Bags" value={fmtInt(result.bags5lb)} unit="bags" />
                <ResultRow label="25 lb Bags" value={fmtInt(result.bags25lb)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 128. LAWN MOWING CALCULATOR ──────────── */
function LawnMowingCalc() {
    const [area, setArea] = useState(5000);
    const [mowerType, setMowerType] = useState("push-gas");

    const MOWER_DATA: Record<string, { sqFtPerMin: number; costPerHour: number }> = {
        "push-gas": { sqFtPerMin: 150, costPerHour: 2.5 },
        "push-electric": { sqFtPerMin: 150, costPerHour: 0.15 },
        "self-propelled": { sqFtPerMin: 200, costPerHour: 2.5 },
        "riding-42": { sqFtPerMin: 500, costPerHour: 4.0 },
        "zero-turn": { sqFtPerMin: 800, costPerHour: 5.0 },
    };

    const result = useMemo(() => {
        const data = MOWER_DATA[mowerType] || MOWER_DATA["push-gas"];
        const minutes = area / data.sqFtPerMin;
        const hours = minutes / 60;
        const fuelCost = hours * data.costPerHour;
        const weeksPerSeason = 28; // ~April to October
        const seasonCost = fuelCost * weeksPerSeason;
        return { minutes, hours, fuelCost, seasonCost, weeksPerSeason };
    }, [area, mowerType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏡 Lawn Mowing Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Lawn Area" value={area} onChange={setArea} unit="sq ft" min={500} />
                <SelectField label="Mower Type" value={mowerType} onChange={setMowerType} options={[
                    { value: "push-gas", label: "Push Mower (Gas)" },
                    { value: "push-electric", label: "Push Mower (Electric)" },
                    { value: "self-propelled", label: "Self-Propelled (Gas)" },
                    { value: "riding-42", label: "Riding Mower (42\" deck)" },
                    { value: "zero-turn", label: "Zero-Turn (54\" deck)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Mowing Time" value={fmt(result.minutes, 0)} unit="min" />
                <ResultRow label="Fuel/Energy per Mow" value={`$${fmt(result.fuelCost, 2)}`} />
                <ResultRow label="Mows per Season" value={fmtInt(result.weeksPerSeason)} />
                <ResultRow label="Season Fuel Cost" value={`$${fmt(result.seasonCost, 2)}`} />
            </div>
        </div>
    );
}

/* ──────────── 129. PLANT AND FLOWER CALCULATOR ──────────── */
function PlantFlowerCalc() {
    const [bedLength, setBedLength] = useState(10);
    const [bedWidth, setBedWidth] = useState(8);
    const [spacingIn, setSpacingIn] = useState(12);

    const result = useMemo(() => {
        const areaSqFt = bedLength * bedWidth;
        const spacingFt = spacingIn / 12;
        const plantsPerRow = spacingFt > 0 ? Math.floor(bedLength / spacingFt) + 1 : 0;
        const rows = spacingFt > 0 ? Math.floor(bedWidth / spacingFt) + 1 : 0;
        const totalPlants = plantsPerRow * rows;
        const flats = Math.ceil(totalPlants / 18); // 18 plants per flat
        const fourInchPots = totalPlants;
        return { areaSqFt, plantsPerRow, rows, totalPlants, flats, fourInchPots };
    }, [bedLength, bedWidth, spacingIn]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌸 Plant and Flower Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Bed Length" value={bedLength} onChange={setBedLength} unit="ft" min={1} />
                <InputField label="Bed Width" value={bedWidth} onChange={setBedWidth} unit="ft" min={1} />
                <InputField label="Plant Spacing" value={spacingIn} onChange={setSpacingIn} unit="in" min={4} max={36} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Bed Area" value={fmt(result.areaSqFt)} unit="sq ft" />
                <ResultRow label="Plants Needed" value={fmtInt(result.totalPlants)} unit="plants" />
                <ResultRow label="Flats (18-count)" value={fmtInt(result.flats)} unit="flats" />
            </div>
        </div>
    );
}

/* ──────────── 130. SOD CALCULATOR ──────────── */
function SodCalc() {
    const [area, setArea] = useState(2000);
    const [wastePercent, setWastePercent] = useState(10);

    const result = useMemo(() => {
        const areaWithWaste = area * (1 + wastePercent / 100);
        const rolls = Math.ceil(areaWithWaste / 10); // standard roll = 10 sq ft (2 ft × 5 ft)
        const pallets = areaWithWaste / 450; // ~450 sq ft per pallet
        const costLow = areaWithWaste * 0.30; // $0.30/sq ft
        const costHigh = areaWithWaste * 0.80; // $0.80/sq ft
        return { areaWithWaste, rolls, pallets, costLow, costHigh };
    }, [area, wastePercent]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🟩 Sod Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Lawn Area" value={area} onChange={setArea} unit="sq ft" min={100} />
                <InputField label="Waste Factor" value={wastePercent} onChange={setWastePercent} unit="%" min={0} max={20} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Coverage Needed" value={fmt(result.areaWithWaste)} unit="sq ft" />
                <ResultRow label="Sod Rolls" value={fmtInt(result.rolls)} unit="rolls" />
                <ResultRow label="Pallets" value={fmt(result.pallets, 1)} unit="pallets" />
                <ResultRow label="Cost (Low)" value={`$${fmt(result.costLow)}`} />
                <ResultRow label="Cost (High)" value={`$${fmt(result.costHigh)}`} />
            </div>
        </div>
    );
}

/* ──────────── 131. SOD WEIGHT CALCULATOR ──────────── */
function SodWeightCalc() {
    const [numPallets, setNumPallets] = useState(1);
    const [numRolls, setNumRolls] = useState(50);
    const [moisture, setMoisture] = useState("normal");

    const MOISTURE_MULT: Record<string, number> = {
        "dry": 0.8, "normal": 1.0, "wet": 1.3,
    };

    const result = useMemo(() => {
        const mult = MOISTURE_MULT[moisture] || 1.0;
        const rollWeight = 15 * mult; // ~15 lbs dry per 10 sq ft roll
        const totalRollWeight = numRolls * rollWeight;
        const palletWeight = 1500 * mult; // ~1500 lbs per pallet (~450 sq ft)
        const totalPalletWeight = numPallets * palletWeight;
        const totalWeight = totalRollWeight + totalPalletWeight;
        return { rollWeight, totalRollWeight, palletWeight, totalPalletWeight, totalWeight };
    }, [numPallets, numRolls, moisture]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⚖️ Sod Weight Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Pallets" value={numPallets} onChange={setNumPallets} min={0} max={20} />
                <InputField label="Individual Rolls" value={numRolls} onChange={setNumRolls} min={0} max={500} />
                <SelectField label="Moisture Condition" value={moisture} onChange={setMoisture} options={[
                    { value: "dry", label: "Dry (recently cut)" },
                    { value: "normal", label: "Normal" },
                    { value: "wet", label: "Wet (recently watered)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Per Roll" value={fmt(result.rollWeight, 1)} unit="lbs" />
                <ResultRow label="Rolls Total" value={fmt(result.totalRollWeight)} unit="lbs" />
                <ResultRow label="Per Pallet" value={fmt(result.palletWeight)} unit="lbs" />
                <ResultRow label="Pallets Total" value={fmt(result.totalPalletWeight)} unit="lbs" />
                <ResultRow label="Grand Total" value={fmt(result.totalWeight)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 132. STONE CALCULATOR ──────────── */
function StoneCalc() {
    const [length, setLength] = useState(20);
    const [width, setWidth] = useState(15);
    const [depthIn, setDepthIn] = useState(3);
    const [stoneType, setStoneType] = useState("crushed-stone");

    const DENSITY: Record<string, number> = {
        "crushed-stone": 1.4,
        "river-rock": 1.35,
        "flagstone": 1.5,
        "limestone": 1.5,
        "lava-rock": 0.5,
        "pea-gravel": 1.35,
    };

    const result = useMemo(() => {
        const area = length * width;
        const cuFt = area * (depthIn / 12);
        const cuYd = cuFt / 27;
        const density = DENSITY[stoneType] || 1.4;
        const tons = cuYd * density;
        const costLow = tons * 35;
        const costHigh = tons * 75;
        return { area, cuFt, cuYd, tons, costLow, costHigh };
    }, [length, width, depthIn, stoneType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪨 Stone Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Depth" value={depthIn} onChange={setDepthIn} unit="in" min={1} max={12} />
                <SelectField label="Stone Type" value={stoneType} onChange={setStoneType} options={[
                    { value: "crushed-stone", label: "Crushed Stone (1.4 ton/yd³)" },
                    { value: "river-rock", label: "River Rock (1.35 ton/yd³)" },
                    { value: "flagstone", label: "Flagstone (1.5 ton/yd³)" },
                    { value: "limestone", label: "Limestone (1.5 ton/yd³)" },
                    { value: "lava-rock", label: "Lava Rock (0.5 ton/yd³)" },
                    { value: "pea-gravel", label: "Pea Gravel (1.35 ton/yd³)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Area" value={fmt(result.area)} unit="sq ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd, 1)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <ResultRow label="Cost (Low)" value={`$${fmt(result.costLow)}`} />
                <ResultRow label="Cost (High)" value={`$${fmt(result.costHigh)}`} />
            </div>
        </div>
    );
}

/* ──────────── 133. CUBIC FEET CALCULATOR ──────────── */
function CubicFeetCalc() {
    const [shape, setShape] = useState("rectangle");
    const [inputUnit, setInputUnit] = useState("ft");
    const [dim1, setDim1] = useState(10);
    const [dim2, setDim2] = useState(8);
    const [dim3, setDim3] = useState(4);
    const [costPerCuFt, setCostPerCuFt] = useState(0);

    const toFt = (v: number): number => {
        switch (inputUnit) {
            case "in": return v / 12;
            case "cm": return v / 30.48;
            case "m": return v * 3.28084;
            default: return v;
        }
    };

    const result = useMemo(() => {
        const a = toFt(dim1);
        const b = toFt(dim2);
        const c = toFt(dim3);
        let cuFt = 0;

        switch (shape) {
            case "rectangle": cuFt = a * b * c; break;
            case "cube": cuFt = a * a * a; break;
            case "cylinder": cuFt = Math.PI * (a / 2) * (a / 2) * b; break;
            case "sphere": cuFt = (4 / 3) * Math.PI * (a / 2) * (a / 2) * (a / 2); break;
            case "cone": cuFt = (1 / 3) * Math.PI * (a / 2) * (a / 2) * b; break;
            case "triangular-prism": cuFt = 0.5 * a * b * c; break;
        }

        const cuYd = cuFt / 27;
        const cuM = cuFt * 0.0283168;
        const gallons = cuFt * 7.48052;
        const liters = cuFt * 28.3168;
        const cost = costPerCuFt > 0 ? cuFt * costPerCuFt : 0;
        return { cuFt, cuYd, cuM, gallons, liters, cost };
    }, [shape, inputUnit, dim1, dim2, dim3, costPerCuFt]);

    const labels: Record<string, { d1: string; d2: string; d3: string; show: [boolean, boolean, boolean] }> = {
        rectangle: { d1: "Length", d2: "Width", d3: "Height", show: [true, true, true] },
        cube: { d1: "Side Length", d2: "", d3: "", show: [true, false, false] },
        cylinder: { d1: "Diameter", d2: "Height", d3: "", show: [true, true, false] },
        sphere: { d1: "Diameter", d2: "", d3: "", show: [true, false, false] },
        cone: { d1: "Diameter (base)", d2: "Height", d3: "", show: [true, true, false] },
        "triangular-prism": { d1: "Base Width", d2: "Triangle Height", d3: "Length (depth)", show: [true, true, true] },
    };

    const l = labels[shape] || labels.rectangle;
    const unitLabel = inputUnit === "ft" ? "ft" : inputUnit === "in" ? "in" : inputUnit === "cm" ? "cm" : "m";

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📦 Cubic Feet Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle / Box" },
                    { value: "cube", label: "Cube" },
                    { value: "cylinder", label: "Cylinder" },
                    { value: "sphere", label: "Sphere" },
                    { value: "cone", label: "Cone" },
                    { value: "triangular-prism", label: "Triangular Prism" },
                ]} />
                <SelectField label="Input Unit" value={inputUnit} onChange={setInputUnit} options={[
                    { value: "ft", label: "Feet" },
                    { value: "in", label: "Inches" },
                    { value: "cm", label: "Centimeters" },
                    { value: "m", label: "Meters" },
                ]} />
                {l.show[0] && <InputField label={l.d1} value={dim1} onChange={setDim1} unit={unitLabel} min={0.01} step={0.5} />}
                {l.show[1] && <InputField label={l.d2} value={dim2} onChange={setDim2} unit={unitLabel} min={0.01} step={0.5} />}
                {l.show[2] && <InputField label={l.d3} value={dim3} onChange={setDim3} unit={unitLabel} min={0.01} step={0.5} />}
                <InputField label="Cost per cu ft (optional)" value={costPerCuFt} onChange={setCostPerCuFt} unit="$" min={0} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume" value={fmt(result.cuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.cuYd)} unit="cu yd" />
                <ResultRow label="Volume" value={fmt(result.cuM, 4)} unit="cu m" />
                <ResultRow label="Liquid Volume" value={fmt(result.gallons)} unit="US gallons" />
                <ResultRow label="Liquid Volume" value={fmt(result.liters)} unit="liters" />
                {result.cost > 0 && <ResultRow label="Estimated Cost" value={`$${fmt(result.cost)}`} />}
            </div>
        </div>
    );
}

/* ──────────── 134. CUBIC INCHES CALCULATOR ──────────── */
function CubicInchesCalc() {
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(8);
    const [height, setHeight] = useState(6);

    const result = useMemo(() => {
        const cuIn = length * width * height;
        const cuFt = cuIn / 1728;
        const liters = cuIn * 0.016387;
        const gallons = cuIn / 231;
        const ml = cuIn * 16.387;
        return { cuIn, cuFt, liters, gallons, ml };
    }, [length, width, height]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Cubic Inches Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="in" min={0.1} step={0.1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="in" min={0.1} step={0.1} />
                <InputField label="Height / Depth" value={height} onChange={setHeight} unit="in" min={0.1} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Cubic Inches" value={fmt(result.cuIn, 1)} unit="cu in" />
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt, 3)} unit="cu ft" />
                <ResultRow label="US Gallons" value={fmt(result.gallons, 2)} unit="gal" />
                <ResultRow label="Liters" value={fmt(result.liters, 2)} unit="L" />
                <ResultRow label="Milliliters" value={fmt(result.ml, 1)} unit="mL" />
            </div>
        </div>
    );
}

/* ──────────── 135. CUBIC METERS CALCULATOR ──────────── */
function CubicMetersCalc() {
    const [length, setLength] = useState(3);
    const [width, setWidth] = useState(2);
    const [height, setHeight] = useState(1);

    const result = useMemo(() => {
        const cuM = length * width * height;
        const cuFt = cuM * 35.3147;
        const cuYd = cuM * 1.30795;
        const liters = cuM * 1000;
        const gallons = cuM * 264.172;
        return { cuM, cuFt, cuYd, liters, gallons };
    }, [length, width, height]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Cubic Meters Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="m" min={0.01} step={0.01} />
                <InputField label="Width" value={width} onChange={setWidth} unit="m" min={0.01} step={0.01} />
                <InputField label="Height / Depth" value={height} onChange={setHeight} unit="m" min={0.01} step={0.01} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Cubic Meters" value={fmt(result.cuM, 3)} unit="m³" />
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt, 2)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Liters" value={fmt(result.liters, 1)} unit="L" />
                <ResultRow label="US Gallons" value={fmt(result.gallons, 1)} unit="gal" />
            </div>
        </div>
    );
}

/* ──────────── 136. CUBIC YARDS TO TONS CALCULATOR ──────────── */
function CubicYardsToTonsCalc() {
    const [cuYd, setCuYd] = useState(5);
    const [material, setMaterial] = useState("gravel");

    const DENSITY: Record<string, number> = {
        "gravel": 1.4, "sand": 1.35, "topsoil": 1.1, "mulch": 0.4,
        "crushed-stone": 1.4, "dirt": 1.1, "asphalt": 1.15, "concrete": 2.0,
        "limestone": 1.5, "river-rock": 1.35,
    };

    const result = useMemo(() => {
        const density = DENSITY[material] || 1.4;
        const tons = cuYd * density;
        const lbs = tons * 2000;
        const kg = lbs * 0.453592;
        return { density, tons, lbs, kg };
    }, [cuYd, material]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⚖️ Cubic Yards to Tons Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Cubic Yards" value={cuYd} onChange={setCuYd} unit="cu yd" min={0.1} step={0.1} />
                <SelectField label="Material" value={material} onChange={setMaterial} options={[
                    { value: "gravel", label: "Gravel (1.4 ton/yd³)" },
                    { value: "sand", label: "Sand (1.35 ton/yd³)" },
                    { value: "topsoil", label: "Topsoil (1.1 ton/yd³)" },
                    { value: "mulch", label: "Mulch (0.4 ton/yd³)" },
                    { value: "crushed-stone", label: "Crushed Stone (1.4 ton/yd³)" },
                    { value: "dirt", label: "Fill Dirt (1.1 ton/yd³)" },
                    { value: "asphalt", label: "Asphalt (1.15 ton/yd³)" },
                    { value: "concrete", label: "Concrete (2.0 ton/yd³)" },
                    { value: "limestone", label: "Limestone (1.5 ton/yd³)" },
                    { value: "river-rock", label: "River Rock (1.35 ton/yd³)" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Tons" value={fmt(result.tons, 2)} unit="tons" />
                <ResultRow label="Pounds" value={fmt(result.lbs)} unit="lbs" />
                <ResultRow label="Kilograms" value={fmt(result.kg)} unit="kg" />
            </div>
        </div>
    );
}

/* ──────────── 137. CYLINDER CUBIC FOOTAGE CALCULATOR ──────────── */
function CylinderCubicFootageCalc() {
    const [diameter, setDiameter] = useState(4);
    const [height, setHeight] = useState(6);

    const result = useMemo(() => {
        const radius = diameter / 2;
        const cuFt = Math.PI * radius * radius * height;
        const cuYd = cuFt / 27;
        const gallons = cuFt * 7.48052;
        const liters = cuFt * 28.3168;
        return { cuFt, cuYd, gallons, liters };
    }, [diameter, height]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🛢️ Cylinder Cubic Footage Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Diameter" value={diameter} onChange={setDiameter} unit="ft" min={0.1} step={0.1} />
                <InputField label="Height / Length" value={height} onChange={setHeight} unit="ft" min={0.1} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt, 2)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="US Gallons" value={fmt(result.gallons, 1)} unit="gal" />
                <ResultRow label="Liters" value={fmt(result.liters, 1)} unit="L" />
            </div>
        </div>
    );
}

/* ──────────── 138. CYLINDER CUBIC YARDAGE CALCULATOR ──────────── */
function CylinderCubicYardageCalc() {
    const [diameterIn, setDiameterIn] = useState(12);
    const [depthIn, setDepthIn] = useState(48);
    const [numCylinders, setNumCylinders] = useState(1);

    const result = useMemo(() => {
        const radiusFt = (diameterIn / 12) / 2;
        const depthFt = depthIn / 12;
        const cuFtEach = Math.PI * radiusFt * radiusFt * depthFt;
        const totalCuFt = cuFtEach * numCylinders;
        const cuYd = totalCuFt / 27;
        const bags80 = Math.ceil(totalCuFt / 0.6);
        return { cuFtEach, totalCuFt, cuYd, bags80 };
    }, [diameterIn, depthIn, numCylinders]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Cylinder Cubic Yardage Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Diameter" value={diameterIn} onChange={setDiameterIn} unit="in" min={4} max={60} />
                <InputField label="Depth / Height" value={depthIn} onChange={setDepthIn} unit="in" min={6} max={120} />
                <InputField label="Number of Cylinders" value={numCylinders} onChange={setNumCylinders} min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Volume Each" value={fmt(result.cuFtEach, 2)} unit="cu ft" />
                <ResultRow label="Total Volume" value={fmt(result.totalCuFt, 2)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="80 lb Bags" value={fmtInt(result.bags80)} unit="bags" />
            </div>
        </div>
    );
}

/* ──────────── 139. FEET AND INCHES LENGTH CALCULATOR ──────────── */
function FeetAndInchesCalc() {
    const [feet1, setFeet1] = useState(10);
    const [inches1, setInches1] = useState(6);
    const [frac1, setFrac1] = useState("0");
    const [feet2, setFeet2] = useState(5);
    const [inches2, setInches2] = useState(3);
    const [frac2, setFrac2] = useState("0");
    const [operation, setOperation] = useState("add");

    const FRAC_OPTIONS = [
        { value: "0", label: "0 (none)" },
        { value: "0.0625", label: "1/16" },
        { value: "0.125", label: "1/8" },
        { value: "0.1875", label: "3/16" },
        { value: "0.25", label: "1/4" },
        { value: "0.3125", label: "5/16" },
        { value: "0.375", label: "3/8" },
        { value: "0.4375", label: "7/16" },
        { value: "0.5", label: "1/2" },
        { value: "0.5625", label: "9/16" },
        { value: "0.625", label: "5/8" },
        { value: "0.6875", label: "11/16" },
        { value: "0.75", label: "3/4" },
        { value: "0.8125", label: "13/16" },
        { value: "0.875", label: "7/8" },
        { value: "0.9375", label: "15/16" },
    ];

    const result = useMemo(() => {
        const totalIn1 = feet1 * 12 + inches1 + Number(frac1);
        const totalIn2 = feet2 * 12 + inches2 + Number(frac2);
        let resultIn: number;
        const isMultDiv = operation === "multiply" || operation === "divide";
        if (operation === "add") resultIn = totalIn1 + totalIn2;
        else if (operation === "subtract") resultIn = totalIn1 - totalIn2;
        else if (operation === "multiply") resultIn = totalIn1 * feet2;
        else resultIn = feet2 > 0 ? totalIn1 / feet2 : 0;
        const abs = Math.abs(resultIn);
        const resultFt = Math.floor(abs / 12);
        const resultInches = abs % 12;
        const sign = resultIn < 0 ? "-" : "";
        const totalFt = resultIn / 12;
        const meters = Math.abs(totalFt) * 0.3048;
        const cm = meters * 100;
        const mm = meters * 1000;
        const yards = Math.abs(totalFt) / 3;
        return { resultFt, resultInches, sign, totalFt, totalIn: resultIn, meters, cm, mm, yards, isMultDiv };
    }, [feet1, inches1, frac1, feet2, inches2, frac2, operation]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Feet and Inches Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Feet (A)" value={feet1} onChange={setFeet1} unit="ft" min={0} />
                <InputField label="Inches (A)" value={inches1} onChange={setInches1} unit="in" min={0} max={11} />
                <SelectField label="Fraction (A)" value={frac1} onChange={setFrac1} options={FRAC_OPTIONS} />
                <SelectField label="Operation" value={operation} onChange={setOperation} options={[
                    { value: "add", label: "Add (+)" },
                    { value: "subtract", label: "Subtract (−)" },
                    { value: "multiply", label: "Multiply (×)" },
                    { value: "divide", label: "Divide (÷)" },
                ]} />
                {!result.isMultDiv ? (
                    <>
                        <InputField label="Feet (B)" value={feet2} onChange={setFeet2} unit="ft" min={0} />
                        <InputField label="Inches (B)" value={inches2} onChange={setInches2} unit="in" min={0} max={11} />
                        <SelectField label="Fraction (B)" value={frac2} onChange={setFrac2} options={FRAC_OPTIONS} />
                    </>
                ) : (
                    <InputField label="Factor" value={feet2} onChange={setFeet2} min={1} />
                )}
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">IMPERIAL</h4>
                <ResultRow label="Feet & Inches" value={`${result.sign}${result.resultFt}' ${fmt(result.resultInches, 2)}"`} />
                <ResultRow label="Total Inches" value={fmt(result.totalIn, 2)} unit="in" />
                <ResultRow label="Decimal Feet" value={fmt(result.totalFt, 4)} unit="ft" />
                <ResultRow label="Yards" value={fmt(result.yards, 3)} unit="yd" />
                <h4 className="con-calc__group-label">METRIC</h4>
                <ResultRow label="Meters" value={fmt(result.meters, 4)} unit="m" />
                <ResultRow label="Centimeters" value={fmt(result.cm, 2)} unit="cm" />
                <ResultRow label="Millimeters" value={fmt(result.mm, 1)} unit="mm" />
            </div>
        </div>
    );
}

/* ──────────── 140. INCH FRACTION CALCULATOR ──────────── */
function InchFractionCalc() {
    const [mode, setMode] = useState("decimal-to-fraction");
    const [decimal, setDecimal] = useState(3.375);
    const [precision, setPrecision] = useState("16");
    // Fraction → Decimal inputs
    const [wholeIn, setWholeIn] = useState(3);
    const [fracNum, setFracNum] = useState(3);
    const [fracDen, setFracDen] = useState(8);

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    const result = useMemo(() => {
        let decValue: number;
        if (mode === "decimal-to-fraction") {
            decValue = decimal;
        } else {
            decValue = wholeIn + (fracDen > 0 ? fracNum / fracDen : 0);
        }
        const prec = Number(precision);
        const wholeInches = Math.floor(decValue);
        const fractionalPart = decValue - wholeInches;
        const numerator = Math.round(fractionalPart * prec);
        const g = numerator === 0 ? 1 : gcd(numerator, prec);
        const simpNum = numerator / g;
        const simpDen = prec / g;
        const fractionStr = simpNum === 0 ? `${wholeInches}"` : `${wholeInches} ${simpNum}/${simpDen}"`;
        const backToDecimal = wholeInches + (simpNum / simpDen);
        const mm = decValue * 25.4;
        const cm = decValue * 2.54;
        const totalFeet = Math.floor(decValue / 12);
        const remainIn = decValue - totalFeet * 12;
        const feetInStr = totalFeet > 0 ? `${totalFeet}' ${fmt(remainIn, 3)}"` : `${fmt(decValue, 4)}"`;
        return { fractionStr, backToDecimal, mm, cm, decValue, feetInStr, totalFeet };
    }, [mode, decimal, precision, wholeIn, fracNum, fracDen]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔢 Inch Fraction Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Mode" value={mode} onChange={setMode} options={[
                    { value: "decimal-to-fraction", label: "Decimal → Fraction" },
                    { value: "fraction-to-decimal", label: "Fraction → Decimal" },
                ]} />
                {mode === "decimal-to-fraction" ? (
                    <InputField label="Decimal Inches" value={decimal} onChange={setDecimal} unit="in" min={0} step={0.001} />
                ) : (
                    <>
                        <InputField label="Whole Inches" value={wholeIn} onChange={setWholeIn} unit="in" min={0} step={1} />
                        <InputField label="Numerator" value={fracNum} onChange={setFracNum} unit="" min={0} step={1} />
                        <SelectField label="Denominator" value={String(fracDen)} onChange={(v) => setFracDen(Number(v))} options={[
                            { value: "2", label: "2 (halves)" },
                            { value: "4", label: "4 (quarters)" },
                            { value: "8", label: "8 (eighths)" },
                            { value: "16", label: "16 (sixteenths)" },
                            { value: "32", label: "32 (thirty-seconds)" },
                            { value: "64", label: "64 (sixty-fourths)" },
                        ]} />
                    </>
                )}
                <SelectField label="Fraction Precision" value={precision} onChange={setPrecision} options={[
                    { value: "8", label: "1/8 inch" },
                    { value: "16", label: "1/16 inch" },
                    { value: "32", label: "1/32 inch" },
                    { value: "64", label: "1/64 inch" },
                ]} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">FRACTION</h4>
                <ResultRow label="Inch Fraction" value={result.fractionStr} />
                <h4 className="con-calc__group-label">DECIMAL</h4>
                <ResultRow label="Decimal Inches" value={`${fmt(result.backToDecimal, 4)}"`} />
                <h4 className="con-calc__group-label">METRIC</h4>
                <ResultRow label="Millimeters" value={fmt(result.mm, 2)} unit="mm" />
                <ResultRow label="Centimeters" value={fmt(result.cm, 3)} unit="cm" />
                {result.totalFeet > 0 && (
                    <>
                        <h4 className="con-calc__group-label">FEET & INCHES</h4>
                        <ResultRow label="Feet + Inches" value={result.feetInStr} />
                    </>
                )}
            </div>
        </div>
    );
}

/* ──────────── 141. SCALE CONVERSION CALCULATOR ──────────── */
const SCALE_PRESETS: { value: string; label: string }[] = [
    { value: "12", label: '1" = 1\' (1:12) — Dollhouse' },
    { value: "18", label: "1:18 — Large model cars" },
    { value: "24", label: '1/2" = 1\' (1:24) — Models' },
    { value: "43", label: "1:43 — O Gauge trains" },
    { value: "48", label: '1/4" = 1\' (1:48) — Residential' },
    { value: "64", label: "1:64 — Hot Wheels / S Gauge" },
    { value: "87", label: "1:87 — HO Scale trains" },
    { value: "96", label: '1/8" = 1\' (1:96) — Small residential' },
    { value: "160", label: "1:160 — N Scale trains" },
    { value: "192", label: '1/16" = 1\' (1:192) — Site plans' },
    { value: "240", label: '1" = 20\' (1:240) — Engineering' },
    { value: "600", label: '1" = 50\' (1:600) — Civil' },
    { value: "custom", label: "Custom ratio..." },
];

function ScaleConversionCalc() {
    const [mode, setMode] = useState("scale-to-actual");
    const [measurement, setMeasurement] = useState(6);
    const [scalePreset, setScalePreset] = useState("48");
    const [customRatio, setCustomRatio] = useState(48);
    const [actualMeasurement, setActualMeasurement] = useState(24);
    const [actualUnit, setActualUnit] = useState("feet");

    const ratio = scalePreset === "custom" ? customRatio : Number(scalePreset);

    const result = useMemo(() => {
        if (mode === "scale-to-actual") {
            const actualIn = measurement * ratio;
            const actualFt = actualIn / 12;
            const actualM = actualFt * 0.3048;
            return { actualIn, actualFt, actualM, scaleIn: measurement, ratio, scaleFraction: `1:${ratio}` };
        } else if (mode === "actual-to-scale") {
            let actualIn: number;
            if (actualUnit === "feet") actualIn = actualMeasurement * 12;
            else if (actualUnit === "meters") actualIn = actualMeasurement * 39.3701;
            else actualIn = actualMeasurement;
            const scaleIn = actualIn / ratio;
            return { actualIn, actualFt: actualIn / 12, actualM: actualIn * 0.0254, scaleIn, ratio, scaleFraction: `1:${ratio}` };
        } else {
            // find scale factor
            let actualIn: number;
            if (actualUnit === "feet") actualIn = actualMeasurement * 12;
            else if (actualUnit === "meters") actualIn = actualMeasurement * 39.3701;
            else actualIn = actualMeasurement;
            const foundRatio = actualIn / measurement;
            return { actualIn, actualFt: actualIn / 12, actualM: actualIn * 0.0254, scaleIn: measurement, ratio: foundRatio, scaleFraction: `1:${Math.round(foundRatio * 100) / 100}` };
        }
    }, [mode, measurement, scalePreset, customRatio, actualMeasurement, actualUnit, ratio]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🗺️ Scale Conversion Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Mode" value={mode} onChange={setMode} options={[
                    { value: "scale-to-actual", label: "Scale → Actual Size" },
                    { value: "actual-to-scale", label: "Actual → Scale Size" },
                    { value: "find-factor", label: "Find Scale Factor" },
                ]} />
                {mode !== "find-factor" && (
                    <SelectField label="Scale Ratio" value={scalePreset} onChange={setScalePreset} options={SCALE_PRESETS} />
                )}
                {scalePreset === "custom" && mode !== "find-factor" && (
                    <InputField label="Custom Ratio (1:X)" value={customRatio} onChange={setCustomRatio} unit="X" min={1} step={1} />
                )}
                {(mode === "scale-to-actual" || mode === "find-factor") && (
                    <InputField label="Scale Measurement" value={measurement} onChange={setMeasurement} unit="in" min={0.01} step={0.01} />
                )}
                {(mode === "actual-to-scale" || mode === "find-factor") && (
                    <>
                        <InputField label="Actual Measurement" value={actualMeasurement} onChange={setActualMeasurement} unit={actualUnit === "meters" ? "m" : actualUnit === "feet" ? "ft" : "in"} min={0.01} step={0.01} />
                        <SelectField label="Actual Unit" value={actualUnit} onChange={setActualUnit} options={[
                            { value: "inches", label: "Inches" },
                            { value: "feet", label: "Feet" },
                            { value: "meters", label: "Meters" },
                        ]} />
                    </>
                )}
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">RESULTS</h4>
                {mode !== "actual-to-scale" && (
                    <>
                        <ResultRow label="Actual (inches)" value={fmt(result.actualIn, 2)} unit="in" />
                        <ResultRow label="Actual (feet)" value={fmt(result.actualFt, 2)} unit="ft" />
                        <ResultRow label="Actual (meters)" value={fmt(result.actualM, 3)} unit="m" />
                    </>
                )}
                {mode === "actual-to-scale" && (
                    <ResultRow label="Scale Drawing Size" value={fmt(result.scaleIn, 3)} unit="in" />
                )}
                <ResultRow label="Scale Factor" value={result.scaleFraction} />
            </div>
        </div>
    );
}

/* ──────────── 142. SQUARE FEET TO CUBIC FEET CALCULATOR ──────────── */
function SqFtToCuFtCalc() {
    const [area, setArea] = useState(200);
    const [depthIn, setDepthIn] = useState(4);

    const result = useMemo(() => {
        const depthFt = depthIn / 12;
        const cuFt = area * depthFt;
        const cuYd = cuFt / 27;
        const liters = cuFt * 28.3168;
        return { depthFt, cuFt, cuYd, liters };
    }, [area, depthIn]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Square Feet to Cubic Feet</h3>
            <div className="con-calc__inputs">
                <InputField label="Area" value={area} onChange={setArea} unit="sq ft" min={1} />
                <InputField label="Depth / Thickness" value={depthIn} onChange={setDepthIn} unit="in" min={0.5} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Depth" value={fmt(result.depthFt, 3)} unit="ft" />
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt, 2)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Liters" value={fmt(result.liters, 1)} unit="L" />
            </div>
        </div>
    );
}

/* ──────────── 143. SQUARE FEET TO CUBIC YARDS CALCULATOR ──────────── */
const BULK_MATERIALS: { value: string; label: string; tonsPerCuYd: number }[] = [
    { value: "gravel", label: "Gravel", tonsPerCuYd: 1.4 },
    { value: "sand", label: "Sand", tonsPerCuYd: 1.35 },
    { value: "topsoil", label: "Topsoil", tonsPerCuYd: 1.08 },
    { value: "mulch", label: "Mulch (wood)", tonsPerCuYd: 0.4 },
    { value: "concrete", label: "Concrete", tonsPerCuYd: 2.0 },
    { value: "crushed-stone", label: "Crushed Stone", tonsPerCuYd: 1.3 },
    { value: "asphalt", label: "Asphalt", tonsPerCuYd: 1.15 },
];

function SqFtToCuYdCalc() {
    const [area, setArea] = useState(500);
    const [depthIn, setDepthIn] = useState(4);
    const [material, setMaterial] = useState("gravel");
    const [wastePct, setWastePct] = useState(10);
    const [costPerCuYd, setCostPerCuYd] = useState(50);

    const result = useMemo(() => {
        const depthFt = depthIn / 12;
        const cuFt = area * depthFt;
        const cuYd = cuFt / 27;
        const wasteMult = 1 + wastePct / 100;
        const cuYdWithWaste = cuYd * wasteMult;
        const mat = BULK_MATERIALS.find(m => m.value === material);
        const tons = cuYdWithWaste * (mat?.tonsPerCuYd || 1.4);
        const totalCost = cuYdWithWaste * costPerCuYd;
        const liters = cuFt * 28.3168;
        return { depthFt, cuFt, cuYd, cuYdWithWaste, tons, totalCost, liters };
    }, [area, depthIn, material, wastePct, costPerCuYd]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Square Feet to Cubic Yards</h3>
            <div className="con-calc__inputs">
                <InputField label="Area" value={area} onChange={setArea} unit="sq ft" min={1} />
                <InputField label="Depth / Thickness" value={depthIn} onChange={setDepthIn} unit="in" min={0.5} step={0.5} />
                <SelectField label="Material Type" value={material} onChange={setMaterial}
                    options={BULK_MATERIALS.map(m => ({ value: m.value, label: m.label }))} />
                <InputField label="Waste Factor" value={wastePct} onChange={setWastePct} unit="%" min={0} max={25} step={5} />
                <InputField label="Cost per Cubic Yard" value={costPerCuYd} onChange={setCostPerCuYd} unit="$/cu yd" min={0} step={5} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">VOLUME</h4>
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt, 1)} unit="cu ft" />
                <ResultRow label="Cubic Yards" value={fmt(result.cuYd, 2)} unit="cu yd" />
                <ResultRow label="Liters" value={fmt(result.liters, 1)} unit="L" />
                <h4 className="con-calc__group-label">MATERIAL ESTIMATE</h4>
                <ResultRow label={`With ${wastePct}% Waste`} value={fmt(result.cuYdWithWaste, 2)} unit="cu yd" />
                <ResultRow label="Weight" value={fmt(result.tons, 1)} unit="tons" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Total Cost" value={`$${fmt(result.totalCost, 2)}`} />
            </div>
        </div>
    );
}

/* ──────────── 144. SQUARE INCHES CALCULATOR ──────────── */
function SquareInchesCalc() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(8);
    const [inputUnit, setInputUnit] = useState("inches");

    const toInches = (v: number) => {
        if (inputUnit === "cm") return v / 2.54;
        if (inputUnit === "mm") return v / 25.4;
        if (inputUnit === "feet") return v * 12;
        return v;
    };
    const unitLabel = inputUnit === "cm" ? "cm" : inputUnit === "mm" ? "mm" : inputUnit === "feet" ? "ft" : "in";

    const result = useMemo(() => {
        let sqIn: number;
        if (shape === "rectangle") {
            sqIn = toInches(length) * toInches(width);
        } else if (shape === "circle") {
            const r = toInches(length);
            sqIn = Math.PI * r * r;
        } else {
            sqIn = 0.5 * toInches(length) * toInches(width);
        }
        const sqFt = sqIn / 144;
        const sqCm = sqIn * 6.4516;
        const sqMm = sqIn * 645.16;
        const sqM = sqIn * 0.00064516;
        return { sqIn, sqFt, sqCm, sqMm, sqM };
    }, [shape, length, width, inputUnit]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Square Inches Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Area Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle / Square" },
                    { value: "circle", label: "Circle (enter radius)" },
                    { value: "triangle", label: "Triangle (base × height)" },
                ]} />
                <SelectField label="Input Unit" value={inputUnit} onChange={setInputUnit} options={[
                    { value: "inches", label: "Inches" },
                    { value: "cm", label: "Centimeters" },
                    { value: "mm", label: "Millimeters" },
                    { value: "feet", label: "Feet" },
                ]} />
                <InputField label={shape === "circle" ? "Radius" : shape === "triangle" ? "Base" : "Length"} value={length} onChange={setLength} unit={unitLabel} min={0.1} step={0.1} />
                {shape !== "circle" && (
                    <InputField label={shape === "triangle" ? "Height" : "Width"} value={width} onChange={setWidth} unit={unitLabel} min={0.1} step={0.1} />
                )}
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">IMPERIAL</h4>
                <ResultRow label="Square Inches" value={fmt(result.sqIn, 2)} unit="sq in" />
                <ResultRow label="Square Feet" value={fmt(result.sqFt, 4)} unit="sq ft" />
                <h4 className="con-calc__group-label">METRIC</h4>
                <ResultRow label="Square Centimeters" value={fmt(result.sqCm, 2)} unit="cm²" />
                <ResultRow label="Square Millimeters" value={fmt(result.sqMm, 1)} unit="mm²" />
                <ResultRow label="Square Meters" value={fmt(result.sqM, 6)} unit="m²" />
            </div>
        </div>
    );
}

/* ──────────── 145. SQUARE METERS CALCULATOR ──────────── */
function SquareMetersCalc() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState(5);
    const [width, setWidth] = useState(4);
    const [inputUnit, setInputUnit] = useState("meters");
    const [costPerSqM, setCostPerSqM] = useState(50);

    const toMeters = (v: number) => {
        if (inputUnit === "cm") return v / 100;
        if (inputUnit === "feet") return v * 0.3048;
        if (inputUnit === "inches") return v * 0.0254;
        return v;
    };
    const unitLabel = inputUnit === "cm" ? "cm" : inputUnit === "feet" ? "ft" : inputUnit === "inches" ? "in" : "m";

    const result = useMemo(() => {
        let sqM: number;
        if (shape === "rectangle") {
            sqM = toMeters(length) * toMeters(width);
        } else if (shape === "circle") {
            const r = toMeters(length);
            sqM = Math.PI * r * r;
        } else {
            sqM = 0.5 * toMeters(length) * toMeters(width);
        }
        const sqFt = sqM * 10.7639;
        const sqYd = sqFt / 9;
        const hectares = sqM / 10000;
        const acres = sqM / 4046.86;
        const totalCost = sqM * costPerSqM;
        const sqCm = sqM * 10000;
        return { sqM, sqFt, sqYd, hectares, acres, totalCost, sqCm };
    }, [shape, length, width, inputUnit, costPerSqM]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📏 Square Meters Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Area Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle / Square" },
                    { value: "circle", label: "Circle (enter radius)" },
                    { value: "triangle", label: "Triangle (base × height)" },
                ]} />
                <SelectField label="Input Unit" value={inputUnit} onChange={setInputUnit} options={[
                    { value: "meters", label: "Meters" },
                    { value: "cm", label: "Centimeters" },
                    { value: "feet", label: "Feet" },
                    { value: "inches", label: "Inches" },
                ]} />
                <InputField label={shape === "circle" ? "Radius" : shape === "triangle" ? "Base" : "Length"} value={length} onChange={setLength} unit={unitLabel} min={0.01} step={0.01} />
                {shape !== "circle" && (
                    <InputField label={shape === "triangle" ? "Height" : "Width"} value={width} onChange={setWidth} unit={unitLabel} min={0.01} step={0.01} />
                )}
                <InputField label="Cost per m²" value={costPerSqM} onChange={setCostPerSqM} unit="$/m²" min={0} step={1} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">METRIC AREA</h4>
                <ResultRow label="Square Meters" value={fmt(result.sqM, 2)} unit="m²" />
                <ResultRow label="Square Centimeters" value={fmt(result.sqCm)} unit="cm²" />
                {result.sqM >= 1000 && <ResultRow label="Hectares" value={fmt(result.hectares, 4)} unit="ha" />}
                <h4 className="con-calc__group-label">IMPERIAL</h4>
                <ResultRow label="Square Feet" value={fmt(result.sqFt, 2)} unit="sq ft" />
                <ResultRow label="Square Yards" value={fmt(result.sqYd, 2)} unit="sq yd" />
                {result.sqM >= 1000 && <ResultRow label="Acres" value={fmt(result.acres, 4)} unit="acres" />}
                <h4 className="con-calc__group-label">COST ESTIMATE</h4>
                <ResultRow label="Total Cost" value={`$${fmt(result.totalCost, 2)}`} />
            </div>
        </div>
    );
}

/* ──────────── 146. SQUARE YARDS CALCULATOR ──────────── */
function SquareYardsCalc() {
    const [shape, setShape] = useState("rectangle");
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(10);
    const [inputUnit, setInputUnit] = useState("feet");
    const [costPerSqYd, setCostPerSqYd] = useState(25);
    const [wastePct, setWastePct] = useState(10);

    const toFeet = (v: number) => {
        if (inputUnit === "yards") return v * 3;
        if (inputUnit === "meters") return v * 3.28084;
        if (inputUnit === "inches") return v / 12;
        return v;
    };
    const unitLabel = inputUnit === "meters" ? "m" : inputUnit === "yards" ? "yd" : inputUnit === "inches" ? "in" : "ft";

    const result = useMemo(() => {
        let sqFt: number;
        if (shape === "rectangle") {
            sqFt = toFeet(length) * toFeet(width);
        } else if (shape === "circle") {
            const r = toFeet(length);
            sqFt = Math.PI * r * r;
        } else if (shape === "triangle") {
            sqFt = 0.5 * toFeet(length) * toFeet(width);
        } else {
            // border: outer - inner
            const outerSqFt = toFeet(length) * toFeet(width);
            sqFt = outerSqFt;
        }
        const sqYd = sqFt / 9;
        const sqM = sqFt * 0.092903;
        const wasteMultiplier = 1 + wastePct / 100;
        const sqYdWithWaste = sqYd * wasteMultiplier;
        const totalCost = sqYdWithWaste * costPerSqYd;
        const acres = sqFt / 43560;
        return { sqFt, sqYd, sqM, sqYdWithWaste, totalCost, acres };
    }, [shape, length, width, inputUnit, costPerSqYd, wastePct]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Square Yards Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Area Shape" value={shape} onChange={setShape} options={[
                    { value: "rectangle", label: "Rectangle / Square" },
                    { value: "circle", label: "Circle (enter radius)" },
                    { value: "triangle", label: "Triangle (base × height)" },
                ]} />
                <SelectField label="Input Unit" value={inputUnit} onChange={setInputUnit} options={[
                    { value: "feet", label: "Feet" },
                    { value: "inches", label: "Inches" },
                    { value: "yards", label: "Yards" },
                    { value: "meters", label: "Meters" },
                ]} />
                <InputField label={shape === "circle" ? "Radius" : shape === "triangle" ? "Base" : "Length"} value={length} onChange={setLength} unit={unitLabel} min={0.1} step={0.1} />
                {shape !== "circle" && (
                    <InputField label={shape === "triangle" ? "Height" : "Width"} value={width} onChange={setWidth} unit={unitLabel} min={0.1} step={0.1} />
                )}
                <InputField label="Cost per Sq Yd" value={costPerSqYd} onChange={setCostPerSqYd} unit="$/sq yd" min={0} step={1} />
                <InputField label="Waste Factor" value={wastePct} onChange={setWastePct} unit="%" min={0} max={30} step={5} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">AREA</h4>
                <ResultRow label="Square Yards" value={fmt(result.sqYd, 2)} unit="sq yd" />
                <ResultRow label="Square Feet" value={fmt(result.sqFt, 2)} unit="sq ft" />
                <ResultRow label="Square Meters" value={fmt(result.sqM, 2)} unit="m²" />
                {result.sqFt >= 10000 && <ResultRow label="Acres" value={fmt(result.acres, 3)} unit="acres" />}
                <h4 className="con-calc__group-label">COST ESTIMATE</h4>
                <ResultRow label={`With ${wastePct}% Waste`} value={fmt(result.sqYdWithWaste, 2)} unit="sq yd" />
                <ResultRow label="Total Cost" value={`$${fmt(result.totalCost, 2)}`} />
            </div>
        </div>
    );
}

/* ──────────── 147. TANK VOLUME CALCULATOR ──────────── */
const TANK_LIQUIDS: { value: string; label: string; lbsPerGal: number }[] = [
    { value: "water", label: "Water", lbsPerGal: 8.34 },
    { value: "diesel", label: "Diesel Fuel", lbsPerGal: 7.1 },
    { value: "gasoline", label: "Gasoline", lbsPerGal: 6.3 },
    { value: "propane", label: "Propane (liquid)", lbsPerGal: 4.2 },
    { value: "oil", label: "Heating Oil", lbsPerGal: 7.2 },
    { value: "empty", label: "Empty (no liquid)", lbsPerGal: 0 },
];

function TankVolumeCalc() {
    const [tankShape, setTankShape] = useState("cylindrical-h");
    const [lengthIn, setLengthIn] = useState(72);
    const [widthIn, setWidthIn] = useState(24);
    const [heightIn, setHeightIn] = useState(24);
    const [fillPct, setFillPct] = useState(100);
    const [liquidType, setLiquidType] = useState("water");

    const result = useMemo(() => {
        let cuIn: number;
        if (tankShape === "rectangular") {
            cuIn = lengthIn * widthIn * heightIn;
        } else if (tankShape === "cylindrical-h") {
            const r = widthIn / 2;
            cuIn = Math.PI * r * r * lengthIn;
        } else if (tankShape === "cylindrical-v") {
            const r = lengthIn / 2;
            cuIn = Math.PI * r * r * heightIn;
        } else if (tankShape === "oval") {
            const a = widthIn / 2;
            const b = heightIn / 2;
            cuIn = Math.PI * a * b * lengthIn;
        } else if (tankShape === "capsule") {
            const r = widthIn / 2;
            const cylLen = Math.max(lengthIn - widthIn, 0);
            cuIn = Math.PI * r * r * cylLen + (4 / 3) * Math.PI * r * r * r;
        } else {
            // sphere
            const r = lengthIn / 2;
            cuIn = (4 / 3) * Math.PI * r * r * r;
        }
        const cuFt = cuIn / 1728;
        const gallons = cuIn / 231;
        const liters = cuIn * 0.016387;
        const fillFrac = fillPct / 100;
        const filledGal = gallons * fillFrac;
        const filledLiters = liters * fillFrac;
        const liq = TANK_LIQUIDS.find(l => l.value === liquidType);
        const weightLbs = filledGal * (liq?.lbsPerGal || 0);
        return { cuIn, cuFt, gallons, liters, filledGal, filledLiters, weightLbs };
    }, [tankShape, lengthIn, widthIn, heightIn, fillPct, liquidType]);

    const needsWidth = tankShape === "rectangular" || tankShape === "cylindrical-h" || tankShape === "oval" || tankShape === "capsule";
    const needsHeight = tankShape === "rectangular" || tankShape === "cylindrical-v" || tankShape === "oval";

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🛢️ Tank Volume Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Tank Shape" value={tankShape} onChange={setTankShape} options={[
                    { value: "rectangular", label: "Rectangular" },
                    { value: "cylindrical-h", label: "Cylindrical (Horizontal)" },
                    { value: "cylindrical-v", label: "Cylindrical (Vertical)" },
                    { value: "oval", label: "Oval / Elliptical" },
                    { value: "capsule", label: "Capsule (Cylinder + Hemispheres)" },
                    { value: "sphere", label: "Sphere" },
                ]} />
                <InputField label={tankShape === "cylindrical-v" || tankShape === "sphere" ? "Diameter" : "Length"} value={lengthIn} onChange={setLengthIn} unit="in" min={1} />
                {needsWidth && (
                    <InputField label={tankShape === "cylindrical-h" || tankShape === "capsule" ? "Diameter" : "Width"} value={widthIn} onChange={setWidthIn} unit="in" min={1} />
                )}
                {needsHeight && (
                    <InputField label="Height" value={heightIn} onChange={setHeightIn} unit="in" min={1} />
                )}
                <InputField label="Fill Level" value={fillPct} onChange={setFillPct} unit="%" min={0} max={100} step={5} />
                <SelectField label="Liquid Type" value={liquidType} onChange={setLiquidType}
                    options={TANK_LIQUIDS.map(l => ({ value: l.value, label: l.label }))} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">TOTAL CAPACITY</h4>
                <ResultRow label="US Gallons" value={fmt(result.gallons, 1)} unit="gal" />
                <ResultRow label="Liters" value={fmt(result.liters, 1)} unit="L" />
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt, 2)} unit="cu ft" />
                <ResultRow label="Cubic Inches" value={fmt(result.cuIn)} unit="cu in" />
                <h4 className="con-calc__group-label">FILLED VOLUME ({fillPct}%)</h4>
                <ResultRow label="Filled Gallons" value={fmt(result.filledGal, 1)} unit="gal" />
                <ResultRow label="Filled Liters" value={fmt(result.filledLiters, 1)} unit="L" />
                {liquidType !== "empty" && (
                    <ResultRow label="Liquid Weight" value={fmt(result.weightLbs, 1)} unit="lbs" />
                )}
            </div>
        </div>
    );
}

/* ──────────── 148. CFM CALCULATOR ──────────── */
const ROOM_TYPES: { value: string; label: string; ach: number }[] = [
    { value: "bedroom", label: "Bedroom", ach: 4 },
    { value: "living", label: "Living Room", ach: 6 },
    { value: "office", label: "Office / Study", ach: 6 },
    { value: "kitchen", label: "Kitchen", ach: 8 },
    { value: "bathroom", label: "Bathroom", ach: 10 },
    { value: "laundry", label: "Laundry Room", ach: 10 },
    { value: "garage", label: "Garage / Workshop", ach: 12 },
    { value: "restaurant", label: "Restaurant Kitchen", ach: 15 },
    { value: "custom", label: "Custom ACH", ach: 6 },
];

function CfmCalc() {
    const [length, setLength] = useState(12);
    const [width, setWidth] = useState(10);
    const [ceilingHeight, setCeilingHeight] = useState(8);
    const [roomType, setRoomType] = useState("living");
    const [ach, setAch] = useState("6");
    const [occupants, setOccupants] = useState(2);

    const handleRoomType = (v: string) => {
        setRoomType(v);
        const rt = ROOM_TYPES.find(r => r.value === v);
        if (rt && v !== "custom") setAch(String(rt.ach));
    };

    const result = useMemo(() => {
        const volume = length * width * ceilingHeight;
        const sqFt = length * width;
        const achVal = Number(ach);
        const cfm = (volume * achVal) / 60;
        const cfmPerSqFt = cfm / sqFt;
        const ashraeMin = occupants * 15;
        const recommended = Math.max(cfm, ashraeMin);
        const lps = recommended * 0.4719;
        // Duct sizing: target ~900 FPM velocity
        const ductAreaSqIn = (recommended / 900) * 144;
        const ductDia = Math.sqrt(ductAreaSqIn / Math.PI) * 2;
        const ductRound = Math.ceil(ductDia);
        return { volume, sqFt, cfm, cfmPerSqFt, ashraeMin, recommended, lps, ductRound };
    }, [length, width, ceilingHeight, ach, occupants]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💨 CFM Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Room Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Ceiling Height" value={ceilingHeight} onChange={setCeilingHeight} unit="ft" min={6} max={20} />
                <SelectField label="Room Type" value={roomType} onChange={handleRoomType}
                    options={ROOM_TYPES.map(r => ({ value: r.value, label: `${r.label} (${r.ach} ACH)` }))} />
                {roomType === "custom" && (
                    <SelectField label="Air Changes / Hour" value={ach} onChange={setAch} options={[
                        { value: "2", label: "2 ACH" }, { value: "4", label: "4 ACH" }, { value: "6", label: "6 ACH" },
                        { value: "8", label: "8 ACH" }, { value: "10", label: "10 ACH" }, { value: "12", label: "12 ACH" },
                        { value: "15", label: "15 ACH" }, { value: "20", label: "20 ACH" },
                    ]} />
                )}
                <InputField label="Occupants" value={occupants} onChange={setOccupants} min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">ROOM</h4>
                <ResultRow label="Floor Area" value={fmt(result.sqFt)} unit="sq ft" />
                <ResultRow label="Volume" value={fmt(result.volume)} unit="cu ft" />
                <h4 className="con-calc__group-label">VENTILATION</h4>
                <ResultRow label={`CFM (${ach} ACH)`} value={fmt(result.cfm, 1)} unit="CFM" />
                <ResultRow label="ASHRAE Min (15 CFM/person)" value={fmt(result.ashraeMin)} unit="CFM" />
                <ResultRow label="Recommended CFM" value={fmt(result.recommended, 1)} unit="CFM" />
                <ResultRow label="Airflow (metric)" value={fmt(result.lps, 1)} unit="L/s" />
                <ResultRow label="CFM per Sq Ft" value={fmt(result.cfmPerSqFt, 2)} unit="CFM/ft²" />
                <h4 className="con-calc__group-label">DUCT SIZING</h4>
                <ResultRow label="Min Round Duct" value={`${result.ductRound}"`} unit="diameter" />
            </div>
        </div>
    );
}

/* ──────────── 149. FLOW RATE CALCULATOR ──────────── */
const FR_PIPES: { value: string; label: string; id: number }[] = [
    { value: "0.5", label: '½" (0.622" ID)', id: 0.622 },
    { value: "0.75", label: '¾" (0.824" ID)', id: 0.824 },
    { value: "1", label: '1" (1.049" ID)', id: 1.049 },
    { value: "1.25", label: '1¼" (1.368" ID)', id: 1.368 },
    { value: "1.5", label: '1½" (1.610" ID)', id: 1.610 },
    { value: "2", label: '2" (2.067" ID)', id: 2.067 },
    { value: "3", label: '3" (3.068" ID)', id: 3.068 },
    { value: "4", label: '4" (4.026" ID)', id: 4.026 },
    { value: "custom", label: "Custom Diameter", id: 1.0 },
];

function FlowRateCalc() {
    const [mode, setMode] = useState("velocity");
    const [pipeSize, setPipeSize] = useState("1");
    const [customDia, setCustomDia] = useState(1);
    const [velocity, setVelocity] = useState(5);
    const [volume, setVolume] = useState(5);
    const [time, setTime] = useState(1);
    const [hoursPerDay, setHoursPerDay] = useState(8);

    const result = useMemo(() => {
        if (mode === "velocity") {
            const pipeData = FR_PIPES.find(p => p.value === pipeSize);
            const idIn = pipeSize === "custom" ? customDia : (pipeData?.id || 1.049);
            const radiusFt = (idIn / 12) / 2;
            const areaSqFt = Math.PI * radiusFt * radiusFt;
            const areaSqIn = Math.PI * (idIn / 2) * (idIn / 2);
            const cfs = areaSqFt * velocity;
            const gpm = cfs * 448.831;
            const gph = gpm * 60;
            const lpm = gpm * 3.78541;
            const dailyGal = gpm * 60 * hoursPerDay;
            return { idIn, areaSqIn, cfs, gpm, gph, lpm, dailyGal };
        } else {
            const gpm = volume / time;
            const gph = gpm * 60;
            const lpm = gpm * 3.78541;
            const cfs = gpm / 448.831;
            const dailyGal = gpm * 60 * hoursPerDay;
            return { idIn: 0, areaSqIn: 0, cfs, gpm, gph, lpm, dailyGal };
        }
    }, [mode, pipeSize, customDia, velocity, volume, time, hoursPerDay]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌊 Flow Rate Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Calculation Method" value={mode} onChange={setMode} options={[
                    { value: "velocity", label: "Pipe Velocity × Area (Q = A × v)" },
                    { value: "bucket", label: "Volume ÷ Time (Q = V / t)" },
                ]} />
                {mode === "velocity" ? (<>
                    <SelectField label="Pipe Size" value={pipeSize} onChange={setPipeSize}
                        options={FR_PIPES.map(p => ({ value: p.value, label: p.label }))} />
                    {pipeSize === "custom" && (
                        <InputField label="Inner Diameter" value={customDia} onChange={setCustomDia} unit="in" min={0.25} step={0.125} />
                    )}
                    <InputField label="Flow Velocity" value={velocity} onChange={setVelocity} unit="ft/s" min={0.5} step={0.5} />
                </>) : (<>
                    <InputField label="Volume Collected" value={volume} onChange={setVolume} unit="gal" min={0.1} step={0.1} />
                    <InputField label="Time" value={time} onChange={setTime} unit="min" min={0.1} step={0.1} />
                </>)}
                <InputField label="Usage Hours/Day" value={hoursPerDay} onChange={setHoursPerDay} unit="hrs" min={0.5} step={0.5} />
            </div>
            <div className="con-calc__results">
                {mode === "velocity" && (<>
                    <h4 className="con-calc__group-label">PIPE</h4>
                    <ResultRow label="Inner Diameter" value={fmt(result.idIn, 3)} unit="in" />
                    <ResultRow label="Cross-Section" value={fmt(result.areaSqIn, 3)} unit="sq in" />
                </>)}
                <h4 className="con-calc__group-label">FLOW RATE</h4>
                <ResultRow label="GPM" value={fmt(result.gpm, 2)} unit="gal/min" />
                <ResultRow label="GPH" value={fmt(result.gph)} unit="gal/hr" />
                <ResultRow label="Liters/min" value={fmt(result.lpm, 2)} unit="L/min" />
                <ResultRow label="CFS" value={fmt(result.cfs, 4)} unit="ft³/s" />
                <h4 className="con-calc__group-label">DAILY ESTIMATE</h4>
                <ResultRow label="Daily Volume" value={fmt(result.dailyGal)} unit={`gal (${hoursPerDay} hrs)`} />
            </div>
        </div>
    );
}

/* ──────────── 150. FURNACE BTU CALCULATOR ──────────── */
const FUEL_TYPES: { value: string; label: string; unitLabel: string; btuPerUnit: number; defaultCost: number }[] = [
    { value: "gas", label: "Natural Gas", unitLabel: "therms", btuPerUnit: 100000, defaultCost: 1.20 },
    { value: "propane", label: "Propane (LP)", unitLabel: "gallons", btuPerUnit: 91500, defaultCost: 2.80 },
    { value: "oil", label: "Heating Oil", unitLabel: "gallons", btuPerUnit: 138500, defaultCost: 3.50 },
    { value: "electric", label: "Electric", unitLabel: "kWh", btuPerUnit: 3412, defaultCost: 0.16 },
];

function FurnaceBtuCalc() {
    const [sqFt, setSqFt] = useState(1500);
    const [climate, setClimate] = useState("moderate");
    const [insulation, setInsulation] = useState("average");
    const [ceilingHeight, setCeilingHeight] = useState("8");
    const [afue, setAfue] = useState("95");
    const [fuelType, setFuelType] = useState("gas");
    const [fuelCost, setFuelCost] = useState(1.20);

    const handleFuel = (v: string) => {
        setFuelType(v);
        const f = FUEL_TYPES.find(ft => ft.value === v);
        if (f) setFuelCost(f.defaultCost);
    };

    const CLIMATE_FACTOR: Record<string, number> = { "mild": 25, "moderate": 35, "cold": 45, "very-cold": 60 };
    const INSUL_FACTOR: Record<string, number> = { "poor": 1.3, "average": 1.0, "good": 0.85, "excellent": 0.7 };

    const result = useMemo(() => {
        const ceilFt = Number(ceilingHeight);
        const ceilMult = ceilFt > 8 ? (1 + (ceilFt - 8) * 0.05) : 1;
        const base = sqFt * (CLIMATE_FACTOR[climate] || 35) * ceilMult;
        const adjusted = base * (INSUL_FACTOR[insulation] || 1.0);
        const afueVal = Number(afue) / 100;
        const furnaceInput = adjusted / afueVal;
        const kw = adjusted / 3412;
        const fuel = FUEL_TYPES.find(f => f.value === fuelType);
        const heatingHours = climate === "mild" ? 1200 : climate === "moderate" ? 1800 : climate === "cold" ? 2400 : 3000;
        const annualBtu = adjusted * heatingHours * 0.5;
        const annualUnits = annualBtu / ((fuel?.btuPerUnit || 100000) * afueVal);
        const annualCost = annualUnits * fuelCost;
        return { btuOutput: adjusted, furnaceInput, kw, annualCost, annualUnits };
    }, [sqFt, climate, insulation, ceilingHeight, afue, fuelType, fuelCost]);

    const fuelData = FUEL_TYPES.find(f => f.value === fuelType);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔥 Furnace BTU Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Home Size" value={sqFt} onChange={setSqFt} unit="sq ft" min={200} step={100} />
                <SelectField label="Climate Zone" value={climate} onChange={setClimate} options={[
                    { value: "mild", label: "Mild (25 BTU/ft²) – Southern US" },
                    { value: "moderate", label: "Moderate (35 BTU/ft²) – Mid-Atlantic" },
                    { value: "cold", label: "Cold (45 BTU/ft²) – Northern US" },
                    { value: "very-cold", label: "Very Cold (60 BTU/ft²) – MN, AK, MT" },
                ]} />
                <SelectField label="Insulation" value={insulation} onChange={setInsulation} options={[
                    { value: "poor", label: "Poor (+30%)" },
                    { value: "average", label: "Average (baseline)" },
                    { value: "good", label: "Good (−15%)" },
                    { value: "excellent", label: "Excellent (−30%)" },
                ]} />
                <SelectField label="Ceiling Height" value={ceilingHeight} onChange={setCeilingHeight}
                    options={[{ value: "8", label: "8 ft (standard)" }, { value: "9", label: "9 ft" }, { value: "10", label: "10 ft" }, { value: "12", label: "12 ft (vaulted)" }]} />
                <SelectField label="Furnace Efficiency" value={afue} onChange={setAfue}
                    options={[{ value: "80", label: "80% AFUE (standard)" }, { value: "90", label: "90% AFUE (mid-efficiency)" }, { value: "95", label: "95% AFUE (high-efficiency)" }, { value: "98", label: "98% AFUE (condensing)" }]} />
                <SelectField label="Fuel Type" value={fuelType} onChange={handleFuel}
                    options={FUEL_TYPES.map(f => ({ value: f.value, label: f.label }))} />
                <InputField label="Fuel Cost" value={fuelCost} onChange={setFuelCost} unit={`$/${fuelData?.unitLabel || 'unit'}`} min={0.01} step={0.01} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">HOME</h4>
                <ResultRow label="Home Size" value={fmt(sqFt)} unit="sq ft" />
                <ResultRow label="Ceiling Height" value={`${ceilingHeight} ft`} />
                <h4 className="con-calc__group-label">BTU SIZING</h4>
                <ResultRow label="BTU Output Needed" value={fmt(result.btuOutput)} unit="BTU/hr" />
                <ResultRow label="Equivalent kW" value={fmt(result.kw, 1)} unit="kW" />
                <h4 className="con-calc__group-label">FURNACE & COST</h4>
                <ResultRow label={`Furnace Input (${afue}% AFUE)`} value={fmt(result.furnaceInput)} unit="BTU/hr" />
                <ResultRow label="Est. Annual Fuel" value={fmt(result.annualUnits, 0)} unit={fuelData?.unitLabel || "units"} />
                <ResultRow label="Est. Annual Cost" value={`$${fmt(result.annualCost, 0)}`} />
            </div>
        </div>
    );
}

/* ──────────── 151. PIPE VOLUME CALCULATOR ──────────── */
const PV_SIZES: { value: string; label: string; ids: Record<string, number> }[] = [
    { value: "0.5", label: '½"', ids: { copper: 0.622, pex: 0.475, cpvc: 0.536, pvc: 0.622, galv: 0.622 } },
    { value: "0.75", label: '¾"', ids: { copper: 0.824, pex: 0.681, cpvc: 0.720, pvc: 0.824, galv: 0.824 } },
    { value: "1", label: '1"', ids: { copper: 1.049, pex: 0.863, cpvc: 0.920, pvc: 1.049, galv: 1.049 } },
    { value: "1.25", label: '1¼"', ids: { copper: 1.368, pex: 1.102, cpvc: 1.188, pvc: 1.380, galv: 1.380 } },
    { value: "1.5", label: '1½"', ids: { copper: 1.610, pex: 1.358, cpvc: 1.470, pvc: 1.610, galv: 1.610 } },
    { value: "2", label: '2"', ids: { copper: 2.067, pex: 1.720, cpvc: 1.935, pvc: 2.067, galv: 2.067 } },
    { value: "3", label: '3"', ids: { copper: 3.068, pex: 0, cpvc: 0, pvc: 3.068, galv: 3.068 } },
    { value: "4", label: '4"', ids: { copper: 4.026, pex: 0, cpvc: 0, pvc: 4.026, galv: 4.026 } },
    { value: "custom", label: "Custom", ids: { copper: 1, pex: 1, cpvc: 1, pvc: 1, galv: 1 } },
];

const PV_MATS: { value: string; label: string }[] = [
    { value: "copper", label: "Copper (Type L)" },
    { value: "pex", label: "PEX" },
    { value: "cpvc", label: "CPVC" },
    { value: "pvc", label: "PVC (Sch 40)" },
    { value: "galv", label: "Galvanized Steel" },
];

function PipeVolumeCalc() {
    const [pipeSize, setPipeSize] = useState("1");
    const [material, setMaterial] = useState("copper");
    const [customDia, setCustomDia] = useState(1);
    const [lengthFt, setLengthFt] = useState(100);
    const [numPipes, setNumPipes] = useState(1);

    const result = useMemo(() => {
        const sizeData = PV_SIZES.find(s => s.value === pipeSize);
        const idIn = pipeSize === "custom" ? customDia : (sizeData?.ids[material] || 1.049);
        const radiusFt = (idIn / 12) / 2;
        const cuFt = Math.PI * radiusFt * radiusFt * lengthFt;
        const gallons = cuFt * 7.48052;
        const liters = cuFt * 28.3168;
        const cuIn = cuFt * 1728;
        const waterLbs = gallons * 8.34;
        const galPerFt = gallons / lengthFt;
        const totalGal = gallons * numPipes;
        const totalLbs = waterLbs * numPipes;
        const totalCuFt = cuFt * numPipes;
        return { idIn, cuFt, gallons, liters, cuIn, waterLbs, galPerFt, totalGal, totalLbs, totalCuFt };
    }, [pipeSize, material, customDia, lengthFt, numPipes]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🔧 Pipe Volume Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Pipe Size" value={pipeSize} onChange={setPipeSize}
                    options={PV_SIZES.map(s => ({ value: s.value, label: s.label }))} />
                <SelectField label="Pipe Material" value={material} onChange={setMaterial}
                    options={PV_MATS.map(m => ({ value: m.value, label: m.label }))} />
                {pipeSize === "custom" && (
                    <InputField label="Inner Diameter" value={customDia} onChange={setCustomDia} unit="in" min={0.25} step={0.125} />
                )}
                <InputField label="Pipe Length" value={lengthFt} onChange={setLengthFt} unit="ft" min={1} />
                <InputField label="Number of Pipes" value={numPipes} onChange={setNumPipes} min={1} max={50} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">PIPE</h4>
                <ResultRow label="Inner Diameter" value={fmt(result.idIn, 3)} unit="in" />
                <ResultRow label="Gallons/Foot" value={fmt(result.galPerFt, 4)} unit="gal/ft" />
                <h4 className="con-calc__group-label">VOLUME (per pipe)</h4>
                <ResultRow label="US Gallons" value={fmt(result.gallons, 2)} unit="gal" />
                <ResultRow label="Liters" value={fmt(result.liters, 2)} unit="L" />
                <ResultRow label="Cubic Feet" value={fmt(result.cuFt, 3)} unit="cu ft" />
                <ResultRow label="Cubic Inches" value={fmt(result.cuIn, 1)} unit="cu in" />
                <ResultRow label="Water Weight" value={fmt(result.waterLbs, 1)} unit="lbs" />
                {numPipes > 1 && (<>
                    <h4 className="con-calc__group-label">TOTAL SYSTEM ({numPipes} pipes)</h4>
                    <ResultRow label="Total Gallons" value={fmt(result.totalGal, 2)} unit="gal" />
                    <ResultRow label="Total Weight" value={fmt(result.totalLbs, 1)} unit="lbs" />
                    <ResultRow label="Total Volume" value={fmt(result.totalCuFt, 3)} unit="cu ft" />
                </>)}
            </div>
        </div>
    );
}

/* ──────────── 152. REFRIGERANT LINE CHARGE CALCULATOR ──────────── */
const REFRIG_TYPES: { value: string; label: string; liquid: Record<string, number>; suction: Record<string, number> }[] = [
    { value: "r410a", label: "R-410A (current standard)", liquid: { "1/4": 0.19, "5/16": 0.30, "3/8": 0.43, "1/2": 0.78, "5/8": 1.22, "3/4": 1.76, "7/8": 2.40 }, suction: { "1/2": 0.12, "5/8": 0.19, "3/4": 0.28, "7/8": 0.38, "1-1/8": 0.62, "1-3/8": 0.93 } },
    { value: "r22", label: "R-22 (legacy/phased out)", liquid: { "1/4": 0.15, "5/16": 0.24, "3/8": 0.34, "1/2": 0.62, "5/8": 0.97, "3/4": 1.40, "7/8": 1.91 }, suction: { "1/2": 0.06, "5/8": 0.10, "3/4": 0.14, "7/8": 0.19, "1-1/8": 0.31, "1-3/8": 0.47 } },
    { value: "r407c", label: "R-407C (R-22 replacement)", liquid: { "1/4": 0.18, "5/16": 0.28, "3/8": 0.40, "1/2": 0.73, "5/8": 1.14, "3/4": 1.64, "7/8": 2.24 }, suction: { "1/2": 0.11, "5/8": 0.18, "3/4": 0.26, "7/8": 0.35, "1-1/8": 0.58, "1-3/8": 0.87 } },
];

const SYSTEM_TONS: { value: string; label: string; factoryOz: number; factoryFt: number; liquidLine: string; suctionLine: string }[] = [
    { value: "1.5", label: "1.5 Ton (18,000 BTU)", factoryOz: 72, factoryFt: 15, liquidLine: "1/4", suctionLine: "5/8" },
    { value: "2", label: "2 Ton (24,000 BTU)", factoryOz: 96, factoryFt: 15, liquidLine: "5/16", suctionLine: "3/4" },
    { value: "2.5", label: "2.5 Ton (30,000 BTU)", factoryOz: 112, factoryFt: 15, liquidLine: "3/8", suctionLine: "3/4" },
    { value: "3", label: "3 Ton (36,000 BTU)", factoryOz: 128, factoryFt: 15, liquidLine: "3/8", suctionLine: "3/4" },
    { value: "3.5", label: "3.5 Ton (42,000 BTU)", factoryOz: 152, factoryFt: 25, liquidLine: "3/8", suctionLine: "7/8" },
    { value: "4", label: "4 Ton (48,000 BTU)", factoryOz: 176, factoryFt: 25, liquidLine: "3/8", suctionLine: "7/8" },
    { value: "5", label: "5 Ton (60,000 BTU)", factoryOz: 210, factoryFt: 25, liquidLine: "3/8", suctionLine: "1-1/8" },
    { value: "custom", label: "Custom / Other", factoryOz: 128, factoryFt: 15, liquidLine: "3/8", suctionLine: "3/4" },
];

function RefrigerantLineCalc() {
    const [refrigerant, setRefrigerant] = useState("r410a");
    const [tonnage, setTonnage] = useState("3");
    const [liquidLine, setLiquidLine] = useState("3/8");
    const [suctionLine, setSuctionLine] = useState("3/4");
    const [lineLength, setLineLength] = useState(50);
    const [factoryFt, setFactoryFt] = useState(15);
    const [factoryChargeOz, setFactoryChargeOz] = useState(128);

    const handleTonnage = (v: string) => {
        setTonnage(v);
        const t = SYSTEM_TONS.find(s => s.value === v);
        if (t && v !== "custom") { setFactoryChargeOz(t.factoryOz); setFactoryFt(t.factoryFt); setLiquidLine(t.liquidLine); setSuctionLine(t.suctionLine); }
    };

    const result = useMemo(() => {
        const ref = REFRIG_TYPES.find(r => r.value === refrigerant);
        const liqOzFt = ref?.liquid[liquidLine] || 0.43;
        const sucOzFt = ref?.suction[suctionLine] || 0.28;
        const combinedOzFt = liqOzFt + sucOzFt;
        const extraFt = Math.max(0, lineLength - factoryFt);
        const additionalOz = extraFt * combinedOzFt;
        const additionalLbs = additionalOz / 16;
        const totalLineOz = lineLength * combinedOzFt;
        const totalLineLbs = totalLineOz / 16;
        return { liqOzFt, sucOzFt, combinedOzFt, extraFt, additionalOz, additionalLbs, totalLineOz, totalLineLbs };
    }, [lineLength, factoryFt, factoryChargeOz, liquidLine, suctionLine, refrigerant]);

    const refData = REFRIG_TYPES.find(r => r.value === refrigerant);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">❄️ Refrigerant Line Charge Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Refrigerant Type" value={refrigerant} onChange={setRefrigerant}
                    options={REFRIG_TYPES.map(r => ({ value: r.value, label: r.label }))} />
                <SelectField label="System Size" value={tonnage} onChange={handleTonnage}
                    options={SYSTEM_TONS.map(s => ({ value: s.value, label: s.label }))} />
                <SelectField label="Liquid Line" value={liquidLine} onChange={setLiquidLine}
                    options={Object.keys(refData?.liquid || {}).map(k => ({ value: k, label: `${k}" (${refData?.liquid[k]} oz/ft)` }))} />
                <SelectField label="Suction Line" value={suctionLine} onChange={setSuctionLine}
                    options={Object.keys(refData?.suction || {}).map(k => ({ value: k, label: `${k}" (${refData?.suction[k]} oz/ft)` }))} />
                <InputField label="Total Line Length" value={lineLength} onChange={setLineLength} unit="ft" min={5} />
                <InputField label="Factory Line Length" value={factoryFt} onChange={setFactoryFt} unit="ft" min={0} />
                <InputField label="Factory Charge" value={factoryChargeOz} onChange={setFactoryChargeOz} unit="oz" min={0} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">LINE SET</h4>
                <ResultRow label="Liquid Line Rate" value={fmt(result.liqOzFt, 2)} unit="oz/ft" />
                <ResultRow label="Suction Line Rate" value={fmt(result.sucOzFt, 2)} unit="oz/ft" />
                <ResultRow label="Combined Rate" value={fmt(result.combinedOzFt, 2)} unit="oz/ft" />
                <h4 className="con-calc__group-label">CHARGE REQUIRED</h4>
                <ResultRow label="Extra Length" value={fmt(result.extraFt)} unit="ft beyond factory" />
                <ResultRow label="Additional Charge" value={fmt(result.additionalOz, 1)} unit="oz" />
                <ResultRow label="Additional Charge" value={fmt(result.additionalLbs, 2)} unit="lbs" />
                <h4 className="con-calc__group-label">TOTAL LINE CHARGE</h4>
                <ResultRow label="Total (full run)" value={fmt(result.totalLineOz, 1)} unit="oz" />
                <ResultRow label="Total (full run)" value={fmt(result.totalLineLbs, 2)} unit="lbs" />
            </div>
        </div>
    );
}

/* ──────────── 153. WATER VELOCITY CALCULATOR ──────────── */
const PIPE_SIZES: { value: string; label: string; id: number }[] = [
    { value: "0.5", label: '½" (0.622" ID – copper)', id: 0.622 },
    { value: "0.75", label: '¾" (0.824" ID – copper)', id: 0.824 },
    { value: "1", label: '1" (1.049" ID – copper)', id: 1.049 },
    { value: "1.25", label: '1¼" (1.368" ID – copper)', id: 1.368 },
    { value: "1.5", label: '1½" (1.610" ID – copper)', id: 1.610 },
    { value: "2", label: '2" (2.067" ID – copper)', id: 2.067 },
    { value: "3", label: '3" (3.068" ID – copper)', id: 3.068 },
    { value: "4", label: '4" (4.026" ID – copper)', id: 4.026 },
    { value: "custom", label: "Custom Diameter", id: 1.0 },
];

const PIPE_MATERIALS: { value: string; label: string; roughness: number; maxVel: number }[] = [
    { value: "copper", label: "Copper (Type L)", roughness: 0.000005, maxVel: 8 },
    { value: "pex", label: "PEX", roughness: 0.000005, maxVel: 8 },
    { value: "cpvc", label: "CPVC", roughness: 0.000005, maxVel: 5 },
    { value: "galvanized", label: "Galvanized Steel", roughness: 0.0005, maxVel: 5 },
    { value: "pvc", label: "PVC (Schedule 40)", roughness: 0.000005, maxVel: 5 },
];

function WaterVelocityCalc() {
    const [pipeSize, setPipeSize] = useState("1");
    const [customDia, setCustomDia] = useState(1);
    const [material, setMaterial] = useState("copper");
    const [gpm, setGpm] = useState(10);
    const [waterTemp, setWaterTemp] = useState("60");

    const result = useMemo(() => {
        const pipeData = PIPE_SIZES.find(p => p.value === pipeSize);
        const idInches = pipeSize === "custom" ? customDia : (pipeData?.id || 1.049);
        const idFt = idInches / 12;
        const radiusFt = idFt / 2;
        const areaSqFt = Math.PI * radiusFt * radiusFt;
        const areaSqIn = Math.PI * (idInches / 2) * (idInches / 2);
        const cfs = gpm / 448.831;
        const velocity = areaSqFt > 0 ? cfs / areaSqFt : 0;
        const mps = velocity * 0.3048;
        const matData = PIPE_MATERIALS.find(m => m.value === material);
        const maxVel = matData?.maxVel || 8;

        // Kinematic viscosity (ft²/s) at approx temp
        const viscosity = waterTemp === "40" ? 0.00001664 : waterTemp === "60" ? 0.00001217 : waterTemp === "140" ? 0.00000514 : 0.00000739;
        const reynolds = velocity * idFt / viscosity;
        const flowType = reynolds < 2300 ? "Laminar" : reynolds < 4000 ? "Transitional" : "Turbulent";

        const status = velocity <= 5 ? "✅ Within limits" : velocity <= maxVel ? "⚠️ Moderate" : "🔴 Too fast – risk of water hammer";
        return { idInches, areaSqIn, velocity, mps, reynolds, flowType, status };
    }, [gpm, pipeSize, customDia, material, waterTemp]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">💧 Water Velocity Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Pipe Size" value={pipeSize} onChange={setPipeSize}
                    options={PIPE_SIZES.map(p => ({ value: p.value, label: p.label }))} />
                {pipeSize === "custom" && (
                    <InputField label="Inner Diameter" value={customDia} onChange={setCustomDia} unit="in" min={0.25} step={0.125} />
                )}
                <SelectField label="Pipe Material" value={material} onChange={setMaterial}
                    options={PIPE_MATERIALS.map(m => ({ value: m.value, label: m.label }))} />
                <InputField label="Flow Rate" value={gpm} onChange={setGpm} unit="GPM" min={0.5} step={0.5} />
                <SelectField label="Water Temperature" value={waterTemp} onChange={setWaterTemp}
                    options={[{ value: "40", label: "40°F (cold supply)" }, { value: "60", label: "60°F (typical)" }, { value: "100", label: "100°F (warm)" }, { value: "140", label: "140°F (hot water)" }]} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">PIPE</h4>
                <ResultRow label="Inner Diameter" value={fmt(result.idInches, 3)} unit="in" />
                <ResultRow label="Cross-Section" value={fmt(result.areaSqIn, 3)} unit="sq in" />
                <h4 className="con-calc__group-label">VELOCITY</h4>
                <ResultRow label="Velocity" value={fmt(result.velocity, 2)} unit="ft/s" />
                <ResultRow label="Velocity (metric)" value={fmt(result.mps, 2)} unit="m/s" />
                <ResultRow label="Assessment" value={result.status} />
                <h4 className="con-calc__group-label">FLOW ANALYSIS</h4>
                <ResultRow label="Reynolds Number" value={fmt(result.reynolds, 0)} />
                <ResultRow label="Flow Type" value={result.flowType} />
            </div>
        </div>
    );
}

/* ──────────── 154. WINDOW AC SIZE CALCULATOR ──────────── */
function WindowAcSizeCalc() {
    const [sqFt, setSqFt] = useState(300);
    const [ceilingHeight, setCeilingHeight] = useState("8");
    const [sunExposure, setSunExposure] = useState("normal");
    const [insulation, setInsulation] = useState("average");
    const [isKitchen, setIsKitchen] = useState("no");
    const [occupants, setOccupants] = useState(2);
    const [electricRate, setElectricRate] = useState(0.16);

    const result = useMemo(() => {
        let baseBtu: number;
        if (sqFt <= 150) baseBtu = 5000;
        else if (sqFt <= 250) baseBtu = 6000;
        else if (sqFt <= 350) baseBtu = 8000;
        else if (sqFt <= 450) baseBtu = 10000;
        else if (sqFt <= 550) baseBtu = 12000;
        else if (sqFt <= 700) baseBtu = 14000;
        else if (sqFt <= 1000) baseBtu = 18000;
        else if (sqFt <= 1200) baseBtu = 21000;
        else if (sqFt <= 1400) baseBtu = 23000;
        else baseBtu = Math.ceil(sqFt * 20 / 1000) * 1000;

        const ceilFt = Number(ceilingHeight);
        if (ceilFt > 8) baseBtu *= (1 + (ceilFt - 8) * 0.05);

        if (sunExposure === "heavy") baseBtu *= 1.1;
        else if (sunExposure === "shaded") baseBtu *= 0.9;

        if (insulation === "poor") baseBtu *= 1.15;
        else if (insulation === "good") baseBtu *= 0.9;

        if (isKitchen === "yes") baseBtu += 4000;
        if (occupants > 2) baseBtu += (occupants - 2) * 600;

        const finalBtu = Math.ceil(baseBtu / 1000) * 1000;
        const tons = finalBtu / 12000;
        const watts = finalBtu / 10;
        const voltage = finalBtu > 14000 ? "230V (dedicated circuit)" : "115V (standard outlet)";
        const amps = finalBtu > 14000 ? watts / 230 : watts / 115;
        const monthlyKwh = (watts / 1000) * 8 * 30;
        const monthlyCost = monthlyKwh * electricRate;
        return { finalBtu, tons, watts, voltage, amps, monthlyKwh, monthlyCost };
    }, [sqFt, ceilingHeight, sunExposure, insulation, isKitchen, occupants, electricRate]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌡️ Window AC Size Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Room Area" value={sqFt} onChange={setSqFt} unit="sq ft" min={50} step={25} />
                <SelectField label="Ceiling Height" value={ceilingHeight} onChange={setCeilingHeight}
                    options={[{ value: "8", label: '8 ft (standard)' }, { value: "9", label: '9 ft' }, { value: "10", label: '10 ft' }, { value: "12", label: '12 ft (loft/old home)' }]} />
                <SelectField label="Sun Exposure" value={sunExposure} onChange={setSunExposure}
                    options={[{ value: "shaded", label: "Heavily Shaded (−10%)" }, { value: "normal", label: "Normal" }, { value: "heavy", label: "Very Sunny (+10%)" }]} />
                <SelectField label="Insulation Quality" value={insulation} onChange={setInsulation}
                    options={[{ value: "poor", label: "Poor / Old Home (+15%)" }, { value: "average", label: "Average" }, { value: "good", label: "Well-Insulated (−10%)" }]} />
                <SelectField label="Kitchen?" value={isKitchen} onChange={setIsKitchen}
                    options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes (+4,000 BTU)" }]} />
                <InputField label="Occupants" value={occupants} onChange={setOccupants} min={1} max={10} />
                <InputField label="Electric Rate" value={electricRate} onChange={setElectricRate} unit="$/kWh" min={0.05} max={0.50} step={0.01} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">ROOM</h4>
                <ResultRow label="Room Area" value={fmt(sqFt)} unit="sq ft" />
                <ResultRow label="Ceiling Height" value={`${ceilingHeight} ft`} />
                <h4 className="con-calc__group-label">BTU SIZING</h4>
                <ResultRow label="Recommended BTU" value={fmt(result.finalBtu)} unit="BTU" />
                <ResultRow label="Cooling Capacity" value={fmt(result.tons, 2)} unit="tons" />
                <ResultRow label="Wattage" value={fmt(result.watts)} unit="watts" />
                <h4 className="con-calc__group-label">ELECTRICAL & COST</h4>
                <ResultRow label="Circuit Required" value={result.voltage} />
                <ResultRow label="Amperage" value={fmt(result.amps, 1)} unit="amps" />
                <ResultRow label="Est. Monthly Cost" value={`$${fmt(result.monthlyCost, 2)}`} unit="(8 hrs/day)" />
            </div>
        </div>
    );
}

/* ──────────── 155. ICE & WATER SHIELD CALCULATOR ──────────── */
const IWS_ROLLS: { value: string; label: string; widthFt: number; lengthFt: number; sqFt: number; cost: number }[] = [
    { value: "3x75", label: '3\' × 75\' (225 sq ft)', widthFt: 3, lengthFt: 75, sqFt: 225, cost: 130 },
    { value: "3x67", label: '3\' × 67\' (200 sq ft)', widthFt: 3, lengthFt: 67, sqFt: 200, cost: 110 },
    { value: "3x36", label: '3\' × 36\' (108 sq ft)', widthFt: 3, lengthFt: 36, sqFt: 108, cost: 65 },
];

const IWS_PITCH: { value: string; label: string; mult: number }[] = [
    { value: "2", label: "2/12 (low slope)", mult: 1.014 },
    { value: "4", label: "4/12 (standard)", mult: 1.054 },
    { value: "6", label: "6/12 (moderate)", mult: 1.118 },
    { value: "8", label: "8/12 (steep)", mult: 1.202 },
    { value: "10", label: "10/12 (very steep)", mult: 1.302 },
    { value: "12", label: "12/12 (45°)", mult: 1.414 },
];

function IceWaterShieldCalc() {
    const [rollType, setRollType] = useState("3x75");
    const [pitch, setPitch] = useState("4");
    const [eaveLength, setEaveLength] = useState(40);
    const [eaveWidthFt, setEaveWidthFt] = useState(3);
    const [numValleys, setNumValleys] = useState(2);
    const [valleyLength, setValleyLength] = useState(15);
    const [skylights, setSkylights] = useState(0);
    const [chimneys, setChimneys] = useState(0);
    const [vents, setVents] = useState(2);
    const [wastePct, setWastePct] = useState(10);

    const result = useMemo(() => {
        const pitchData = IWS_PITCH.find(p => p.value === pitch);
        const mult = pitchData?.mult || 1;
        const eaveRunFt = eaveWidthFt * mult;
        const eaveArea = eaveLength * 2 * eaveRunFt;
        const valleyArea = numValleys * valleyLength * 3;
        const skyArea = skylights * 16;
        const chimArea = chimneys * 24;
        const ventArea = vents * 4;
        const penArea = skyArea + chimArea + ventArea;
        const subtotal = eaveArea + valleyArea + penArea;
        const total = subtotal * (1 + wastePct / 100);
        const rollData = IWS_ROLLS.find(r => r.value === rollType);
        const rollSqFt = rollData?.sqFt || 225;
        const rollCost = rollData?.cost || 130;
        const rolls = Math.ceil(total / rollSqFt);
        const totalCost = rolls * rollCost;
        return { eaveRunFt, eaveArea, valleyArea, penArea, subtotal, total, rolls, totalCost };
    }, [eaveLength, eaveWidthFt, numValleys, valleyLength, skylights, chimneys, vents, pitch, rollType, wastePct]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧊 Ice & Water Shield Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Roll Size" value={rollType} onChange={setRollType}
                    options={IWS_ROLLS.map(r => ({ value: r.value, label: r.label }))} />
                <SelectField label="Roof Pitch" value={pitch} onChange={setPitch}
                    options={IWS_PITCH.map(p => ({ value: p.value, label: p.label }))} />
                <InputField label="Eave Length (one side)" value={eaveLength} onChange={setEaveLength} unit="ft" min={10} />
                <InputField label="Eave Coverage Width" value={eaveWidthFt} onChange={setEaveWidthFt} unit="ft" min={2} max={6} />
                <InputField label="Valleys" value={numValleys} onChange={setNumValleys} min={0} max={10} />
                <InputField label="Avg Valley Length" value={valleyLength} onChange={setValleyLength} unit="ft" min={5} />
                <InputField label="Skylights" value={skylights} onChange={setSkylights} min={0} />
                <InputField label="Chimneys" value={chimneys} onChange={setChimneys} min={0} />
                <InputField label="Vent Pipes" value={vents} onChange={setVents} min={0} />
                <InputField label="Waste / Overlap" value={wastePct} onChange={setWastePct} unit="%" min={5} max={25} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">EAVES</h4>
                <ResultRow label="Eave Run (with pitch)" value={fmt(result.eaveRunFt, 1)} unit="ft" />
                <ResultRow label="Eave Area (both sides)" value={fmt(result.eaveArea)} unit="sq ft" />
                <h4 className="con-calc__group-label">VALLEYS & PENETRATIONS</h4>
                <ResultRow label="Valley Area" value={fmt(result.valleyArea)} unit="sq ft" />
                <ResultRow label="Penetration Area" value={fmt(result.penArea)} unit="sq ft" />
                <h4 className="con-calc__group-label">TOTAL</h4>
                <ResultRow label="Subtotal" value={fmt(result.subtotal)} unit="sq ft" />
                <ResultRow label="With Overlap/Waste" value={fmt(result.total)} unit="sq ft" />
                <ResultRow label="Rolls Needed" value={fmtInt(result.rolls)} unit="rolls" />
                <ResultRow label="Material Cost" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 156. METAL ROOFING CALCULATOR ──────────── */
const METAL_PANELS: { value: string; label: string; coverageIn: number; costPerSqFt: number; screwsPer100: number }[] = [
    { value: "standing-seam", label: "Standing Seam", coverageIn: 16, costPerSqFt: 10, screwsPer100: 30 },
    { value: "corrugated", label: "Corrugated", coverageIn: 26, costPerSqFt: 4, screwsPer100: 80 },
    { value: "r-panel", label: "Ribbed / R-Panel", coverageIn: 36, costPerSqFt: 5, screwsPer100: 80 },
    { value: "shingle", label: "Metal Shingle (interlocking)", coverageIn: 48, costPerSqFt: 8, screwsPer100: 60 },
    { value: "5v-crimp", label: "5V Crimp", coverageIn: 24, costPerSqFt: 4.50, screwsPer100: 75 },
    { value: "custom", label: "Custom / Other", coverageIn: 26, costPerSqFt: 6, screwsPer100: 75 },
];

const METAL_PITCH: { value: string; label: string; mult: number }[] = [
    { value: "flat", label: "Flat / Low (1/12–2/12)", mult: 1.01 },
    { value: "3", label: "3/12 (minimum for most metal)", mult: 1.031 },
    { value: "4", label: "4/12 (standard)", mult: 1.054 },
    { value: "6", label: "6/12 (moderate)", mult: 1.118 },
    { value: "8", label: "8/12 (steep)", mult: 1.202 },
    { value: "10", label: "10/12 (very steep)", mult: 1.302 },
    { value: "12", label: "12/12 (45°)", mult: 1.414 },
];

function MetalRoofingCalc() {
    const [panelType, setPanelType] = useState("standing-seam");
    const [pitch, setPitch] = useState("4");
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(20);
    const [gauge, setGauge] = useState("26");
    const [wastePct, setWastePct] = useState(10);
    const [costPerSqFt, setCostPerSqFt] = useState(10);

    const handlePanel = (v: string) => {
        setPanelType(v);
        const p = METAL_PANELS.find(m => m.value === v);
        if (p && v !== "custom") setCostPerSqFt(p.costPerSqFt);
    };

    const result = useMemo(() => {
        const footprint = roofLength * roofWidth;
        const pitchData = METAL_PITCH.find(p => p.value === pitch);
        const mult = pitchData?.mult || 1;
        const actualArea = footprint * mult;
        const withWaste = actualArea * (1 + wastePct / 100);
        const panelData = METAL_PANELS.find(m => m.value === panelType);
        const coverageIn = panelData?.coverageIn || 26;
        const coverageFt = coverageIn / 12;
        const panels = Math.ceil(roofWidth / coverageFt);
        const screwsPer100 = panelData?.screwsPer100 || 75;
        const squares = withWaste / 100;
        const screws = Math.ceil(squares) * screwsPer100;
        const ridgeCapFt = roofWidth;
        const totalCost = withWaste * costPerSqFt;
        return { footprint, actualArea, withWaste, squares, panels, screws, ridgeCapFt, totalCost };
    }, [roofLength, roofWidth, panelType, pitch, wastePct, costPerSqFt]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Metal Roofing Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Panel Type" value={panelType} onChange={handlePanel}
                    options={METAL_PANELS.map(m => ({ value: m.value, label: m.label }))} />
                <SelectField label="Roof Pitch" value={pitch} onChange={setPitch}
                    options={METAL_PITCH.map(p => ({ value: p.value, label: p.label }))} />
                <InputField label="Roof Length (eave to ridge)" value={roofLength} onChange={setRoofLength} unit="ft" min={5} />
                <InputField label="Roof Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={5} />
                <SelectField label="Gauge" value={gauge} onChange={setGauge}
                    options={[{ value: "29", label: "29 ga (economy)" }, { value: "26", label: "26 ga (standard)" }, { value: "24", label: "24 ga (premium)" }, { value: "22", label: "22 ga (commercial)" }]} />
                <InputField label="Waste Factor" value={wastePct} onChange={setWastePct} unit="%" min={5} max={25} />
                <InputField label="Cost per sq ft" value={costPerSqFt} onChange={setCostPerSqFt} unit="$" min={0} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">ROOF AREA</h4>
                <ResultRow label="Footprint" value={fmt(result.footprint)} unit="sq ft" />
                <ResultRow label="Actual (with pitch)" value={fmt(result.actualArea)} unit="sq ft" />
                <ResultRow label="With Waste" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Roofing Squares" value={fmt(result.squares, 1)} unit="squares" />
                <h4 className="con-calc__group-label">PANELS & FASTENERS</h4>
                <ResultRow label="Panels Needed" value={fmtInt(result.panels)} unit="panels" />
                <ResultRow label="Screws" value={fmt(result.screws)} unit="pcs" />
                <ResultRow label="Ridge Cap" value={fmt(result.ridgeCapFt)} unit="lin ft" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Material Cost" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 157. PLYWOOD SHEATHING CALCULATOR ──────────── */
const SHEATH_TYPES: { value: string; label: string; costPerSheet: number; weightPerSheet: number }[] = [
    { value: "cdx-12", label: 'CDX Plywood ½"', costPerSheet: 30, weightPerSheet: 42 },
    { value: "cdx-58", label: 'CDX Plywood ⅝"', costPerSheet: 38, weightPerSheet: 51 },
    { value: "cdx-34", label: 'CDX Plywood ¾"', costPerSheet: 45, weightPerSheet: 60 },
    { value: "osb-716", label: 'OSB 7/16"', costPerSheet: 22, weightPerSheet: 38 },
    { value: "osb-12", label: 'OSB ½"', costPerSheet: 26, weightPerSheet: 44 },
    { value: "tng-34", label: 'T&G Plywood ¾" (subfloor)', costPerSheet: 48, weightPerSheet: 62 },
    { value: "custom", label: "Custom / Other", costPerSheet: 35, weightPerSheet: 50 },
];

const PITCH_MULT: { value: string; label: string; mult: number }[] = [
    { value: "flat", label: "Flat (0/12)", mult: 1.000 },
    { value: "2", label: "2/12 (low slope)", mult: 1.014 },
    { value: "4", label: "4/12 (standard)", mult: 1.054 },
    { value: "6", label: "6/12 (moderate)", mult: 1.118 },
    { value: "8", label: "8/12 (steep)", mult: 1.202 },
    { value: "10", label: "10/12 (very steep)", mult: 1.302 },
    { value: "12", label: "12/12 (45°)", mult: 1.414 },
    { value: "wall", label: "Wall / Subfloor (flat)", mult: 1.000 },
];

function PlywoodSheathingCalc() {
    const [sheathType, setSheathType] = useState("osb-12");
    const [application, setApplication] = useState("roof");
    const [pitch, setPitch] = useState("4");
    const [length, setLength] = useState(30);
    const [width, setWidth] = useState(20);
    const [wastePct, setWastePct] = useState(10);
    const [costPerSheet, setCostPerSheet] = useState(26);

    const handleType = (v: string) => {
        setSheathType(v);
        const t = SHEATH_TYPES.find(s => s.value === v);
        if (t && v !== "custom") setCostPerSheet(t.costPerSheet);
    };

    const handleApp = (v: string) => {
        setApplication(v);
        if (v === "wall" || v === "subfloor") setPitch("wall");
        else if (pitch === "wall") setPitch("4");
    };

    const result = useMemo(() => {
        const footprint = length * width;
        const pitchData = PITCH_MULT.find(p => p.value === pitch);
        const multiplier = pitchData?.mult || 1;
        const actualArea = footprint * multiplier;
        const withWaste = actualArea * (1 + wastePct / 100);
        const sheets = Math.ceil(withWaste / 32);
        const typeData = SHEATH_TYPES.find(s => s.value === sheathType);
        const totalWeight = sheets * (typeData?.weightPerSheet || 50);
        const totalCost = sheets * costPerSheet;
        return { footprint, actualArea, withWaste, sheets, totalWeight, totalCost };
    }, [length, width, wastePct, costPerSheet, pitch, sheathType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🪵 Plywood Sheathing Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Sheathing Type" value={sheathType} onChange={handleType}
                    options={SHEATH_TYPES.map(s => ({ value: s.value, label: s.label }))} />
                <SelectField label="Application" value={application} onChange={handleApp}
                    options={[{ value: "roof", label: "Roof Sheathing" }, { value: "wall", label: "Wall Sheathing" }, { value: "subfloor", label: "Subfloor" }]} />
                {application === "roof" && (
                    <SelectField label="Roof Pitch" value={pitch} onChange={setPitch}
                        options={PITCH_MULT.filter(p => p.value !== "wall").map(p => ({ value: p.value, label: p.label }))} />
                )}
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={1} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={1} />
                <InputField label="Waste Factor" value={wastePct} onChange={setWastePct} unit="%" min={5} max={25} />
                <InputField label="Cost per Sheet" value={costPerSheet} onChange={setCostPerSheet} unit="$" min={0} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">AREA</h4>
                <ResultRow label="Footprint" value={fmt(result.footprint)} unit="sq ft" />
                {application === "roof" && <ResultRow label="Actual Roof Area" value={fmt(result.actualArea)} unit="sq ft" />}
                <ResultRow label="With Waste" value={fmt(result.withWaste)} unit="sq ft" />
                <h4 className="con-calc__group-label">SHEETS</h4>
                <ResultRow label="4×8 Sheets Needed" value={fmtInt(result.sheets)} unit="sheets" />
                <ResultRow label="Total Weight" value={fmtInt(result.totalWeight)} unit="lbs" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Material Cost" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 158. ROOF SNOW LOAD CALCULATOR ──────────── */
const SNOW_DENSITY: { value: string; label: string; psfPerIn: number }[] = [
    { value: "fresh", label: "Fresh / Light Powder", psfPerIn: 1.25 },
    { value: "settled", label: "Settled (few days old)", psfPerIn: 2.08 },
    { value: "packed", label: "Wind-Packed", psfPerIn: 3.13 },
    { value: "granular", label: "Granular / Old", psfPerIn: 3.75 },
    { value: "wet", label: "Wet / Heavy", psfPerIn: 5.20 },
    { value: "ice", label: "Ice Crust", psfPerIn: 4.69 },
];

const SNOW_PITCH: { value: string; label: string; mult: number }[] = [
    { value: "flat", label: "Flat (0/12)", mult: 1.000 },
    { value: "2", label: "2/12 (low slope)", mult: 1.014 },
    { value: "4", label: "4/12 (standard)", mult: 1.054 },
    { value: "6", label: "6/12 (moderate)", mult: 1.118 },
    { value: "8", label: "8/12 (steep)", mult: 1.202 },
    { value: "10", label: "10/12 (very steep)", mult: 1.302 },
    { value: "12", label: "12/12 (45°)", mult: 1.414 },
];

function RoofSnowLoadCalc() {
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(20);
    const [pitch, setPitch] = useState("4");
    const [snowDepth, setSnowDepth] = useState(12);
    const [snowType, setSnowType] = useState("packed");
    const [designLoad, setDesignLoad] = useState(30);

    const result = useMemo(() => {
        const footprint = roofLength * roofWidth;
        const pitchData = SNOW_PITCH.find(p => p.value === pitch);
        const mult = pitchData?.mult || 1;
        const actualArea = footprint * mult;
        const densData = SNOW_DENSITY.find(s => s.value === snowType);
        const psfPerIn = densData?.psfPerIn || 3.13;
        const psf = psfPerIn * snowDepth;
        const totalLbs = psf * actualArea;
        const totalTons = totalLbs / 2000;
        const volumeCuFt = actualArea * (snowDepth / 12);
        const capacityPct = designLoad > 0 ? (psf / designLoad) * 100 : 0;
        const overloaded = psf > designLoad;
        return { footprint, actualArea, psfPerIn, psf, totalLbs, totalTons, volumeCuFt, capacityPct, overloaded };
    }, [roofLength, roofWidth, pitch, snowDepth, snowType, designLoad]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">❄️ Roof Snow Load Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length" value={roofLength} onChange={setRoofLength} unit="ft" min={5} />
                <InputField label="Roof Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={5} />
                <SelectField label="Roof Pitch" value={pitch} onChange={setPitch}
                    options={SNOW_PITCH.map(p => ({ value: p.value, label: p.label }))} />
                <InputField label="Snow Depth" value={snowDepth} onChange={setSnowDepth} unit="in" min={1} max={72} />
                <SelectField label="Snow Type" value={snowType} onChange={(v) => setSnowType(v)}
                    options={SNOW_DENSITY.map(s => ({ value: s.value, label: `${s.label} (${s.psfPerIn} PSF/in)` }))} />
                <InputField label="Roof Design Load" value={designLoad} onChange={setDesignLoad} unit="PSF" min={10} max={100} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">ROOF</h4>
                <ResultRow label="Footprint" value={fmt(result.footprint)} unit="sq ft" />
                <ResultRow label="Actual Roof Area" value={fmt(result.actualArea)} unit="sq ft" />
                <ResultRow label="Snow Volume" value={fmt(result.volumeCuFt)} unit="cu ft" />
                <h4 className="con-calc__group-label">SNOW LOAD</h4>
                <ResultRow label="Density" value={fmt(result.psfPerIn, 2)} unit="PSF/inch" />
                <ResultRow label="Snow Load (PSF)" value={fmt(result.psf, 1)} unit="PSF" />
                <ResultRow label="Total Weight" value={fmt(result.totalLbs)} unit="lbs" />
                <ResultRow label="Total Weight" value={fmt(result.totalTons, 2)} unit="tons" />
                <h4 className="con-calc__group-label">STRUCTURAL CHECK</h4>
                <ResultRow label="Design Capacity" value={`${designLoad} PSF`} />
                <ResultRow label="Current Load" value={`${fmt(result.capacityPct, 0)}%`} unit={result.overloaded ? "⚠️ OVERLOADED" : "✅ Within limits"} />
            </div>
        </div>
    );
}

/* ──────────── 159. ROOFING MATERIAL CALCULATOR ──────────── */
function RoofingMaterialCalc() {
    const [roofLength, setRoofLength] = useState(30);
    const [roofWidth, setRoofWidth] = useState(20);
    const [ridgeLength, setRidgeLength] = useState(30);
    const [wastePct, setWastePct] = useState(15);

    const result = useMemo(() => {
        const area = roofLength * roofWidth;
        const areaWithWaste = area * (1 + wastePct / 100);
        const squares = areaWithWaste / 100;
        const shingleBundles = Math.ceil(squares * 3);
        const underlaymentRolls = Math.ceil(areaWithWaste / (4 * 250)); // 4x250 sq ft roll
        const nailLbs = Math.ceil(squares * 1.5);
        const ridgeCapPcs = Math.ceil(ridgeLength / 0.8); // ~10 in exposure per piece
        const dripEdgeFt = roofLength * 2 + roofWidth * 2;
        const dripEdgePcs = Math.ceil(dripEdgeFt / 10);
        return { area, squares, shingleBundles, underlaymentRolls, nailLbs, ridgeCapPcs, dripEdgePcs };
    }, [roofLength, roofWidth, ridgeLength, wastePct]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Roofing Material Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Roof Length (slope)" value={roofLength} onChange={setRoofLength} unit="ft" min={5} />
                <InputField label="Roof Width" value={roofWidth} onChange={setRoofWidth} unit="ft" min={5} />
                <InputField label="Ridge Length" value={ridgeLength} onChange={setRidgeLength} unit="ft" min={5} />
                <InputField label="Waste %" value={wastePct} onChange={setWastePct} unit="%" min={10} max={25} />
            </div>
            <div className="con-calc__results">
                <h4>Results</h4>
                <ResultRow label="Roofing Squares" value={fmt(result.squares, 1)} unit="squares" />
                <ResultRow label="Shingle Bundles" value={fmtInt(result.shingleBundles)} unit="bundles" />
                <ResultRow label="Underlayment Rolls" value={fmtInt(result.underlaymentRolls)} unit="rolls" />
                <ResultRow label="Roofing Nails" value={fmtInt(result.nailLbs)} unit="lbs" />
                <ResultRow label="Ridge Cap Pieces" value={fmtInt(result.ridgeCapPcs)} unit="pcs" />
                <ResultRow label="Drip Edge" value={fmtInt(result.dripEdgePcs)} unit="pcs (10')" />
            </div>
        </div>
    );
}

/* ──────────── 160. CLAPBOARD / LAP SIDING CALCULATOR ──────────── */
const CLAP_MATERIALS: { value: string; label: string; widthIn: number; overlapIn: number; costPerLf: number }[] = [
    { value: "cedar", label: "Western Red Cedar", widthIn: 6, overlapIn: 1.25, costPerLf: 2.50 },
    { value: "fiber-cement", label: "Fiber Cement (HardiePlank)", widthIn: 8, overlapIn: 1.25, costPerLf: 1.80 },
    { value: "pine", label: "Pine / Spruce (primed)", widthIn: 6, overlapIn: 1.25, costPerLf: 1.20 },
    { value: "engineered", label: "Engineered Wood (LP)", widthIn: 8, overlapIn: 1.25, costPerLf: 1.60 },
    { value: "composite", label: "Composite / PVC", widthIn: 8, overlapIn: 1.25, costPerLf: 3.00 },
    { value: "custom", label: "Custom / Other", widthIn: 6, overlapIn: 1.25, costPerLf: 2.00 },
];

function ClapboardSidingCalc() {
    const [material, setMaterial] = useState("cedar");
    const [boardWidthIn, setBoardWidthIn] = useState(6);
    const [overlapIn, setOverlapIn] = useState(1.25);
    const [boardLengthFt, setBoardLengthFt] = useState(12);
    const [wallLength, setWallLength] = useState(40);
    const [wallHeight, setWallHeight] = useState(9);
    const [gableArea, setGableArea] = useState(0);
    const [windowCount, setWindowCount] = useState(2);
    const [doorCount, setDoorCount] = useState(1);
    const [waste, setWaste] = useState(10);
    const [costPerLf, setCostPerLf] = useState(2.50);

    const handleMaterial = (v: string) => {
        setMaterial(v);
        const m = CLAP_MATERIALS.find(c => c.value === v);
        if (m && v !== "custom") { setBoardWidthIn(m.widthIn); setOverlapIn(m.overlapIn); setCostPerLf(m.costPerLf); }
    };

    const result = useMemo(() => {
        const exposureIn = boardWidthIn - overlapIn;
        const exposureFt = exposureIn / 12;
        const rectArea = wallLength * wallHeight;
        const grossArea = rectArea + gableArea;
        const openings = (windowCount * 15) + (doorCount * 21);
        const netArea = Math.max(0, grossArea - openings);
        const courses = Math.ceil((wallHeight * 12) / exposureIn);
        const boardsPerCourse = Math.ceil(wallLength / boardLengthFt);
        const totalBoards = courses * boardsPerCourse;
        const linearFt = totalBoards * boardLengthFt;
        const withWaste = Math.ceil(totalBoards * (1 + waste / 100));
        const linearFtWaste = withWaste * boardLengthFt;
        const totalCost = linearFtWaste * costPerLf;
        return { exposureIn, grossArea, openings, netArea, courses, boardsPerCourse, totalBoards, linearFt, withWaste, linearFtWaste, totalCost };
    }, [wallLength, wallHeight, gableArea, windowCount, doorCount, boardWidthIn, overlapIn, boardLengthFt, waste, costPerLf]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Clapboard & Lap Siding Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Board Material" value={material} onChange={handleMaterial}
                    options={CLAP_MATERIALS.map(c => ({ value: c.value, label: c.label }))} />
                <SelectField label="Board Width" value={String(boardWidthIn)} onChange={(v) => setBoardWidthIn(Number(v))}
                    options={[{ value: "6", label: '6" (standard)' }, { value: "8", label: '8" (wide)' }, { value: "10", label: '10" (extra wide)' }, { value: "12", label: '12" (maximum)' }]} />
                <InputField label="Board Overlap" value={overlapIn} onChange={setOverlapIn} unit="in" min={0.75} max={3} step={0.25} />
                <SelectField label="Board Length" value={String(boardLengthFt)} onChange={(v) => setBoardLengthFt(Number(v))}
                    options={[{ value: "8", label: "8 ft" }, { value: "10", label: "10 ft" }, { value: "12", label: "12 ft (standard)" }, { value: "16", label: "16 ft" }]} />
                <InputField label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={5} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={4} />
                <InputField label="Gable Area" value={gableArea} onChange={setGableArea} unit="sq ft" min={0} />
                <InputField label="Windows" value={windowCount} onChange={setWindowCount} min={0} />
                <InputField label="Doors" value={doorCount} onChange={setDoorCount} min={0} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
                <InputField label="Cost per Linear Ft" value={costPerLf} onChange={setCostPerLf} unit="$" min={0} step={0.1} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">WALL</h4>
                <ResultRow label="Gross Area" value={fmt(result.grossArea)} unit="sq ft" />
                <ResultRow label="Openings" value={fmt(result.openings)} unit="sq ft" />
                <ResultRow label="Net Area" value={fmt(result.netArea)} unit="sq ft" />
                <h4 className="con-calc__group-label">COURSES</h4>
                <ResultRow label="Board Exposure" value={fmt(result.exposureIn, 2)} unit="in" />
                <ResultRow label="Courses (rows)" value={fmtInt(result.courses)} />
                <ResultRow label="Boards per Course" value={fmtInt(result.boardsPerCourse)} />
                <h4 className="con-calc__group-label">MATERIAL</h4>
                <ResultRow label="Boards (before waste)" value={fmtInt(result.totalBoards)} />
                <ResultRow label="Boards (with waste)" value={fmtInt(result.withWaste)} unit="boards" />
                <ResultRow label="Linear Feet" value={fmt(result.linearFtWaste)} unit="lin ft" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Material Cost" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 161. SIDING MATERIAL CALCULATOR ──────────── */
const SIDING_TYPES: { value: string; label: string; costPerSq: number; weightPerSq: number; lifespan: string }[] = [
    { value: "vinyl", label: "Vinyl Siding", costPerSq: 150, weightPerSq: 60, lifespan: "20–40 yrs" },
    { value: "fiber-cement", label: "Fiber Cement (HardiePlank)", costPerSq: 350, weightPerSq: 300, lifespan: "30–50 yrs" },
    { value: "wood", label: "Wood / Cedar", costPerSq: 400, weightPerSq: 200, lifespan: "20–40 yrs" },
    { value: "engineered", label: "Engineered Wood (LP SmartSide)", costPerSq: 250, weightPerSq: 180, lifespan: "25–50 yrs" },
    { value: "metal", label: "Metal / Aluminum", costPerSq: 300, weightPerSq: 50, lifespan: "40–50 yrs" },
    { value: "stone-veneer", label: "Stone Veneer", costPerSq: 800, weightPerSq: 800, lifespan: "50+ yrs" },
    { value: "custom", label: "Custom / Other", costPerSq: 200, weightPerSq: 100, lifespan: "—" },
];

function SidingMaterialCalc() {
    const [sidingType, setSidingType] = useState("vinyl");
    const [perimeterFt, setPerimeterFt] = useState(150);
    const [wallHeight, setWallHeight] = useState(9);
    const [gableArea, setGableArea] = useState(100);
    const [windowCount, setWindowCount] = useState(8);
    const [doorCount, setDoorCount] = useState(2);
    const [waste, setWaste] = useState(10);
    const [costPerSq, setCostPerSq] = useState(150);

    const handleType = (v: string) => {
        setSidingType(v);
        const t = SIDING_TYPES.find(s => s.value === v);
        if (t && v !== "custom") setCostPerSq(t.costPerSq);
    };

    const result = useMemo(() => {
        const rectArea = perimeterFt * wallHeight;
        const grossArea = rectArea + gableArea;
        const openings = (windowCount * 15) + (doorCount * 21);
        const netArea = Math.max(0, grossArea - openings);
        const withWaste = netArea * (1 + waste / 100);
        const squares = withWaste / 100;
        const typeData = SIDING_TYPES.find(s => s.value === sidingType);
        const totalWeight = squares * (typeData?.weightPerSq || 100);
        const totalCost = squares * costPerSq;
        return { grossArea, openings, netArea, withWaste, squares, totalWeight, totalCost };
    }, [perimeterFt, wallHeight, gableArea, windowCount, doorCount, waste, costPerSq, sidingType]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏡 Siding Material Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="Siding Type" value={sidingType} onChange={handleType}
                    options={SIDING_TYPES.map(s => ({ value: s.value, label: s.label }))} />
                <InputField label="House Perimeter" value={perimeterFt} onChange={setPerimeterFt} unit="ft" min={40} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={4} />
                <InputField label="Gable Area" value={gableArea} onChange={setGableArea} unit="sq ft" min={0} />
                <InputField label="Windows" value={windowCount} onChange={setWindowCount} min={0} />
                <InputField label="Doors" value={doorCount} onChange={setDoorCount} min={0} />
                <InputField label="Waste Factor" value={waste} onChange={setWaste} unit="%" min={0} max={25} />
                <InputField label="Cost per Square" value={costPerSq} onChange={setCostPerSq} unit="$" min={0} />
            </div>
            <div className="con-calc__results">
                <h4 className="con-calc__group-label">WALL AREA</h4>
                <ResultRow label="Gross Area (incl. gables)" value={fmt(result.grossArea)} unit="sq ft" />
                <ResultRow label="Openings Deducted" value={fmt(result.openings)} unit="sq ft" />
                <ResultRow label="Net Siding Area" value={fmt(result.netArea)} unit="sq ft" />
                <h4 className="con-calc__group-label">MATERIAL</h4>
                <ResultRow label="With Waste" value={fmt(result.withWaste)} unit="sq ft" />
                <ResultRow label="Squares Needed" value={fmt(result.squares, 1)} unit="sq (100 ft²)" />
                <ResultRow label="Total Weight" value={fmtInt(result.totalWeight)} unit="lbs" />
                <h4 className="con-calc__group-label">COST</h4>
                <ResultRow label="Material Cost" value={`$${fmt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── 162. VINYL SIDING CALCULATOR ──────────── */
function VinylSidingCalc() {
    const [perimeterFt, setPerimeterFt] = useState(150);
    const [wallHeight, setWallHeight] = useState(9);
    const [numWindows, setNumWindows] = useState(8);
    const [numDoors, setNumDoors] = useState(2);
    const [numCorners, setNumCorners] = useState(4);
    const [fasciaFt, setFasciaFt] = useState(0);
    const [costPerSq, setCostPerSq] = useState(0);

    const result = useMemo(() => {
        // Opening area: avg window ~15 sq ft, avg door ~21 sq ft
        const openingsSqFt = numWindows * 15 + numDoors * 21;
        const grossArea = perimeterFt * wallHeight;
        const netArea = Math.max(0, grossArea - openingsSqFt);
        const squares = netArea / 100;
        const squaresWithWaste = Math.ceil(squares * 1.1 * 10) / 10;
        const boxes = Math.ceil(squaresWithWaste);

        // J-channel: perimeter of each window (~16 ft avg) + each door (~17 ft avg)
        const jChannelFt = numWindows * 16 + numDoors * 17;
        const jChannelPcs = Math.ceil(jChannelFt / 12.5);

        // Starter strips: bottom perimeter
        const starterPcs = Math.ceil(perimeterFt / 12);

        // Utility / undersill trim: under each window (~3.5 ft avg) + top of walls (perimeter)
        const utilityFt = numWindows * 3.5 + perimeterFt;
        const utilityPcs = Math.ceil(utilityFt / 12);

        // Corners
        const cornerPcs = numCorners;

        // Fascia: linear feet ÷ 12 ft pieces
        const fasciaPcs = fasciaFt > 0 ? Math.ceil(fasciaFt / 12) : 0;

        // House wrap: rolls ~9 ft × 150 ft = 1,350 sq ft coverage
        const houseWrapRolls = Math.ceil(grossArea / 1350);

        // Nails: ~2/3 lb per square of siding
        const nailsLbs = Math.round(squaresWithWaste * 0.67 * 10) / 10;

        // Cost
        const totalCost = costPerSq > 0 ? squaresWithWaste * costPerSq : 0;

        return { grossArea, netArea, openingsSqFt, squaresWithWaste, boxes, jChannelPcs, starterPcs, utilityPcs, cornerPcs, fasciaPcs, houseWrapRolls, nailsLbs, totalCost };
    }, [perimeterFt, wallHeight, numWindows, numDoors, numCorners, fasciaFt, costPerSq]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Vinyl Siding Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="House Perimeter" value={perimeterFt} onChange={setPerimeterFt} unit="ft" min={20} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={4} max={30} />
                <InputField label="Number of Windows" value={numWindows} onChange={setNumWindows} min={0} max={50} />
                <InputField label="Number of Doors" value={numDoors} onChange={setNumDoors} min={0} max={10} />
                <InputField label="Outside Corners" value={numCorners} onChange={setNumCorners} min={4} max={20} />
                <InputField label="Fascia Length (optional)" value={fasciaFt} onChange={setFasciaFt} unit="ft" min={0} />
                <InputField label="Cost per Square (optional)" value={costPerSq} onChange={setCostPerSq} unit="$" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Siding</h4>
                <ResultRow label="Gross Wall Area" value={fmt(result.grossArea)} unit="sq ft" />
                <ResultRow label="Openings" value={fmt(result.openingsSqFt)} unit="sq ft" />
                <ResultRow label="Net Siding Area" value={fmt(result.netArea)} unit="sq ft" />
                <ResultRow label="Squares (w/ 10% waste)" value={fmt(result.squaresWithWaste, 1)} unit="squares" />
                <ResultRow label="Siding Boxes" value={fmtInt(result.boxes)} unit="boxes" />
                <h4>Trim &amp; Accessories</h4>
                <ResultRow label="J-Channel" value={fmtInt(result.jChannelPcs)} unit="pcs (12.5')" />
                <ResultRow label="Starter Strips" value={fmtInt(result.starterPcs)} unit="pcs (12')" />
                <ResultRow label="Utility / Undersill Trim" value={fmtInt(result.utilityPcs)} unit="pcs (12')" />
                <ResultRow label="Corner Posts" value={fmtInt(result.cornerPcs)} unit="pcs" />
                {result.fasciaPcs > 0 && <ResultRow label="Fascia" value={fmtInt(result.fasciaPcs)} unit="pcs (12')" />}
                <h4>Other Materials</h4>
                <ResultRow label="House Wrap" value={fmtInt(result.houseWrapRolls)} unit="rolls (9'×150')" />
                <ResultRow label="Siding Nails" value={fmt(result.nailsLbs, 1)} unit="lbs" />
                {result.totalCost > 0 && <ResultRow label="Estimated Material Cost" value={`$${fmt(result.totalCost, 2)}`} />}
            </div>
        </div>
    );
}

/* ──────────── DISPATCHER ──────────── */

/* ──────────── PLASTERING CALCULATOR ──────────── */
function PlasteringCalc() {
    const [area, setArea] = useState(100);
    const [thickness, setThickness] = useState(12);
    const [mixRatio, setMixRatio] = useState("1:4");
    const [coats, setCoats] = useState(1);
    const [cementPrice, setCementPrice] = useState(350);

    const RATIOS: Record<string, { cement: number; sand: number }> = {
        "1:3": { cement: 1, sand: 3 },
        "1:4": { cement: 1, sand: 4 },
        "1:5": { cement: 1, sand: 5 },
        "1:6": { cement: 1, sand: 6 },
    };

    const result = useMemo(() => {
        const r = RATIOS[mixRatio] || RATIOS["1:4"];
        const thicknessM = thickness / 1000;
        const wetVolM3 = (area * 0.0929) * thicknessM * coats;
        const dryVolM3 = wetVolM3 * 1.35;
        const totalParts = r.cement + r.sand;
        const cementM3 = dryVolM3 * (r.cement / totalParts);
        const sandM3 = dryVolM3 * (r.sand / totalParts);
        const cementBags = cementM3 / 0.035;
        const sandCuFt = sandM3 * 35.3147;
        const waterLiters = cementBags * 25;
        const cost = Math.ceil(cementBags) * cementPrice;
        return { wetVolM3, dryVolM3, cementBags, sandCuFt, sandM3, waterLiters, cost };
    }, [area, thickness, mixRatio, coats, cementPrice]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏗️ Plastering Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Wall Area" value={area} onChange={setArea} unit="sq ft" min={1} />
                <InputField label="Plaster Thickness" value={thickness} onChange={setThickness} unit="mm" min={6} max={25} />
                <SelectField label="Mix Ratio (Cement : Sand)" value={mixRatio} onChange={setMixRatio} options={[
                    { value: "1:3", label: "1:3 (Rich — external walls)" },
                    { value: "1:4", label: "1:4 (Standard — external)" },
                    { value: "1:5", label: "1:5 (Standard — internal)" },
                    { value: "1:6", label: "1:6 (Lean — ceiling)" },
                ]} />
                <InputField label="Number of Coats" value={coats} onChange={setCoats} min={1} max={3} />
                <InputField label="Cement Price per Bag" value={cementPrice} onChange={setCementPrice} unit="₹" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Volume</h4>
                <ResultRow label="Wet Volume" value={fmt(result.wetVolM3, 3)} unit="m³" />
                <ResultRow label="Dry Volume (×1.35)" value={fmt(result.dryVolM3, 3)} unit="m³" />
                <h4>Materials</h4>
                <ResultRow label="Cement" value={fmt(result.cementBags, 1)} unit="bags (50 kg)" />
                <ResultRow label="Sand" value={fmt(result.sandCuFt, 1)} unit="cu ft" />
                <ResultRow label="Sand" value={fmt(result.sandM3, 3)} unit="m³" />
                <ResultRow label="Water (approx)" value={fmtInt(result.waterLiters)} unit="liters" />
                <h4>Cost</h4>
                <ResultRow label="Cement Cost" value={`₹${fmtInt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── PCC CALCULATOR ──────────── */
function PCCCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(6);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [mixRatio, setMixRatio] = useState("1:2:4");
    const [cementPrice, setCementPrice] = useState(350);

    const RATIOS: Record<string, { c: number; s: number; a: number }> = {
        "1:1.5:3": { c: 1, s: 1.5, a: 3 },
        "1:2:4": { c: 1, s: 2, a: 4 },
        "1:3:6": { c: 1, s: 3, a: 6 },
        "1:4:8": { c: 1, s: 4, a: 8 },
        "1:5:10": { c: 1, s: 5, a: 10 },
    };

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const volCuFt = length * width * depthFt;
        const volM3 = volCuFt * 0.0283168;
        const dryVolM3 = volM3 * 1.54;
        const r = RATIOS[mixRatio] || RATIOS["1:2:4"];
        const totalParts = r.c + r.s + r.a;
        const cementM3 = dryVolM3 * (r.c / totalParts);
        const sandM3 = dryVolM3 * (r.s / totalParts);
        const aggM3 = dryVolM3 * (r.a / totalParts);
        const cementBags = cementM3 / 0.035;
        const sandCuFt = sandM3 * 35.3147;
        const aggCuFt = aggM3 * 35.3147;
        const cost = Math.ceil(cementBags) * cementPrice;
        return { volCuFt, volM3, dryVolM3, cementBags, sandCuFt, sandM3, aggCuFt, aggM3, cost };
    }, [length, width, depth, depthUnit, mixRatio, cementPrice]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 PCC Calculator (Plain Cement Concrete)</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.5} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.5} step={0.5} />
                <InputField label="Depth / Thickness" value={depth} onChange={setDepth} unit={depthUnit} min={1} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" },
                ]} />
                <SelectField label="Mix Ratio (C:S:A)" value={mixRatio} onChange={setMixRatio} options={[
                    { value: "1:1.5:3", label: "M20 — 1:1.5:3 (High strength)" },
                    { value: "1:2:4", label: "M15 — 1:2:4 (Standard)" },
                    { value: "1:3:6", label: "M10 — 1:3:6 (Lean)" },
                    { value: "1:4:8", label: "M7.5 — 1:4:8 (Foundation)" },
                    { value: "1:5:10", label: "M5 — 1:5:10 (Leveling)" },
                ]} />
                <InputField label="Cement Price per Bag" value={cementPrice} onChange={setCementPrice} unit="₹" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Volume</h4>
                <ResultRow label="Wet Volume" value={fmt(result.volCuFt)} unit="cu ft" />
                <ResultRow label="Wet Volume" value={fmt(result.volM3, 3)} unit="m³" />
                <ResultRow label="Dry Volume (×1.54)" value={fmt(result.dryVolM3, 3)} unit="m³" />
                <h4>Materials</h4>
                <ResultRow label="Cement" value={fmt(result.cementBags, 1)} unit="bags (50 kg)" />
                <ResultRow label="Sand" value={fmt(result.sandCuFt, 1)} unit="cu ft" />
                <ResultRow label="Aggregate (Coarse)" value={fmt(result.aggCuFt, 1)} unit="cu ft" />
                <h4>Cost</h4>
                <ResultRow label="Cement Cost" value={`₹${fmtInt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── RCC CALCULATOR ──────────── */
function RCCCalc() {
    const [length, setLength] = useState(10);
    const [width, setWidth] = useState(10);
    const [depth, setDepth] = useState(6);
    const [depthUnit, setDepthUnit] = useState("inches");
    const [mixRatio, setMixRatio] = useState("1:1.5:3");
    const [steelPercent, setSteelPercent] = useState(1);
    const [cementPrice, setCementPrice] = useState(350);
    const [steelPrice, setSteelPrice] = useState(55);

    const RATIOS: Record<string, { c: number; s: number; a: number }> = {
        "1:1:2": { c: 1, s: 1, a: 2 },
        "1:1.5:3": { c: 1, s: 1.5, a: 3 },
        "1:2:4": { c: 1, s: 2, a: 4 },
    };

    const result = useMemo(() => {
        const depthFt = depthUnit === "inches" ? depth / 12 : depth;
        const volCuFt = length * width * depthFt;
        const volM3 = volCuFt * 0.0283168;
        const dryVolM3 = volM3 * 1.54;
        const r = RATIOS[mixRatio] || RATIOS["1:1.5:3"];
        const totalParts = r.c + r.s + r.a;
        const cementBags = (dryVolM3 * r.c / totalParts) / 0.035;
        const sandCuFt = (dryVolM3 * r.s / totalParts) * 35.3147;
        const aggCuFt = (dryVolM3 * r.a / totalParts) * 35.3147;
        const steelKg = volM3 * 7850 * (steelPercent / 100);
        const cementCost = Math.ceil(cementBags) * cementPrice;
        const steelCost = steelKg * steelPrice;
        return { volCuFt, volM3, cementBags, sandCuFt, aggCuFt, steelKg, cementCost, steelCost, totalCost: cementCost + steelCost };
    }, [length, width, depth, depthUnit, mixRatio, steelPercent, cementPrice, steelPrice]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏛️ RCC Calculator (Reinforced Cement Concrete)</h3>
            <div className="con-calc__inputs">
                <InputField label="Length" value={length} onChange={setLength} unit="ft" min={0.5} step={0.5} />
                <InputField label="Width" value={width} onChange={setWidth} unit="ft" min={0.5} step={0.5} />
                <InputField label="Depth / Thickness" value={depth} onChange={setDepth} unit={depthUnit} min={1} step={0.5} />
                <SelectField label="Depth Unit" value={depthUnit} onChange={setDepthUnit} options={[
                    { value: "inches", label: "Inches" }, { value: "feet", label: "Feet" },
                ]} />
                <SelectField label="Mix Ratio" value={mixRatio} onChange={setMixRatio} options={[
                    { value: "1:1:2", label: "M25 — 1:1:2 (Columns, beams)" },
                    { value: "1:1.5:3", label: "M20 — 1:1.5:3 (Standard RCC)" },
                    { value: "1:2:4", label: "M15 — 1:2:4 (Footings)" },
                ]} />
                <InputField label="Steel %" value={steelPercent} onChange={setSteelPercent} unit="%" min={0.5} max={4} step={0.25} />
                <InputField label="Cement ₹/bag" value={cementPrice} onChange={setCementPrice} unit="₹" min={0} />
                <InputField label="Steel ₹/kg" value={steelPrice} onChange={setSteelPrice} unit="₹" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Volume</h4>
                <ResultRow label="Volume" value={fmt(result.volCuFt)} unit="cu ft" />
                <ResultRow label="Volume" value={fmt(result.volM3, 3)} unit="m³" />
                <h4>Concrete Materials</h4>
                <ResultRow label="Cement" value={fmt(result.cementBags, 1)} unit="bags (50 kg)" />
                <ResultRow label="Sand" value={fmt(result.sandCuFt, 1)} unit="cu ft" />
                <ResultRow label="Aggregate" value={fmt(result.aggCuFt, 1)} unit="cu ft" />
                <h4>Steel Reinforcement</h4>
                <ResultRow label="Steel Weight" value={fmt(result.steelKg, 1)} unit="kg" />
                <ResultRow label="Steel Weight" value={fmt(result.steelKg / 1000, 3)} unit="tons" />
                <h4>Cost Estimate</h4>
                <ResultRow label="Cement Cost" value={`₹${fmtInt(result.cementCost)}`} />
                <ResultRow label="Steel Cost" value={`₹${fmtInt(result.steelCost)}`} />
                <ResultRow label="Total (Cement + Steel)" value={`₹${fmtInt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── CONSTRUCTION COST ESTIMATOR ──────────── */
function ConstructionCostCalc() {
    const [builtUpArea, setBuiltUpArea] = useState(1000);
    const [floors, setFloors] = useState(1);
    const [quality, setQuality] = useState("standard");
    const [cityTier, setCityTier] = useState("tier2");

    const QUALITY_RATES: Record<string, { rate: number; label: string }> = {
        economy: { rate: 1200, label: "Economy (₹1,200/sq ft)" },
        standard: { rate: 1700, label: "Standard (₹1,700/sq ft)" },
        premium: { rate: 2500, label: "Premium (₹2,500/sq ft)" },
        luxury: { rate: 3500, label: "Luxury (₹3,500/sq ft)" },
    };
    const CITY_MULT: Record<string, { mult: number; label: string }> = {
        tier1: { mult: 1.3, label: "Tier-1 (Mumbai, Delhi, Bangalore)" },
        tier2: { mult: 1.0, label: "Tier-2 (Pune, Jaipur, Lucknow)" },
        tier3: { mult: 0.8, label: "Tier-3 / Rural" },
    };

    const result = useMemo(() => {
        const totalArea = builtUpArea * floors;
        const baseRate = QUALITY_RATES[quality]?.rate || 1700;
        const mult = CITY_MULT[cityTier]?.mult || 1;
        const effectiveRate = baseRate * mult;
        const totalCost = totalArea * effectiveRate;
        const structure = totalCost * 0.45;
        const finishing = totalCost * 0.30;
        const plumbing = totalCost * 0.08;
        const electrical = totalCost * 0.07;
        const misc = totalCost * 0.10;
        return { totalArea, effectiveRate, totalCost, structure, finishing, plumbing, electrical, misc };
    }, [builtUpArea, floors, quality, cityTier]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🏠 Construction Cost Estimator</h3>
            <div className="con-calc__inputs">
                <InputField label="Built-Up Area (per floor)" value={builtUpArea} onChange={setBuiltUpArea} unit="sq ft" min={100} step={50} />
                <InputField label="Number of Floors" value={floors} onChange={setFloors} min={1} max={10} />
                <SelectField label="Construction Quality" value={quality} onChange={setQuality} options={Object.entries(QUALITY_RATES).map(([k, v]) => ({ value: k, label: v.label }))} />
                <SelectField label="City Tier" value={cityTier} onChange={setCityTier} options={Object.entries(CITY_MULT).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
            <div className="con-calc__results">
                <h4>Summary</h4>
                <ResultRow label="Total Built-Up Area" value={fmtInt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Effective Rate" value={`₹${fmtInt(result.effectiveRate)}`} unit="/sq ft" />
                <ResultRow label="Estimated Total Cost" value={`₹${fmtInt(result.totalCost)}`} />
                <h4>Cost Breakdown (Approx)</h4>
                <ResultRow label="Structure (45%)" value={`₹${fmtInt(result.structure)}`} />
                <ResultRow label="Finishing (30%)" value={`₹${fmtInt(result.finishing)}`} />
                <ResultRow label="Plumbing (8%)" value={`₹${fmtInt(result.plumbing)}`} />
                <ResultRow label="Electrical (7%)" value={`₹${fmtInt(result.electrical)}`} />
                <ResultRow label="Misc / Contingency (10%)" value={`₹${fmtInt(result.misc)}`} />
            </div>
        </div>
    );
}

/* ──────────── CARPET AREA CALCULATOR ──────────── */
function CarpetAreaCalc() {
    const [inputType, setInputType] = useState("carpet");
    const [inputArea, setInputArea] = useState(1000);
    const [builtUpLoading, setBuiltUpLoading] = useState(20);
    const [superLoading, setSuperLoading] = useState(35);

    const result = useMemo(() => {
        let carpet = 0, builtUp = 0, superBuiltUp = 0;
        const buFactor = 1 + builtUpLoading / 100;
        const sbuFactor = 1 + superLoading / 100;
        if (inputType === "carpet") {
            carpet = inputArea;
            builtUp = carpet * buFactor;
            superBuiltUp = builtUp * sbuFactor;
        } else if (inputType === "builtup") {
            builtUp = inputArea;
            carpet = builtUp / buFactor;
            superBuiltUp = builtUp * sbuFactor;
        } else {
            superBuiltUp = inputArea;
            builtUp = superBuiltUp / sbuFactor;
            carpet = builtUp / buFactor;
        }
        const carpetM2 = carpet * 0.0929;
        const builtUpM2 = builtUp * 0.0929;
        const superM2 = superBuiltUp * 0.0929;
        return { carpet, builtUp, superBuiltUp, carpetM2, builtUpM2, superM2 };
    }, [inputType, inputArea, builtUpLoading, superLoading]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">📐 Carpet Area Calculator</h3>
            <div className="con-calc__inputs">
                <SelectField label="I Know The" value={inputType} onChange={setInputType} options={[
                    { value: "carpet", label: "Carpet Area" },
                    { value: "builtup", label: "Built-Up Area" },
                    { value: "super", label: "Super Built-Up Area" },
                ]} />
                <InputField label={inputType === "carpet" ? "Carpet Area" : inputType === "builtup" ? "Built-Up Area" : "Super Built-Up Area"} value={inputArea} onChange={setInputArea} unit="sq ft" min={100} step={10} />
                <InputField label="Built-Up Loading %" value={builtUpLoading} onChange={setBuiltUpLoading} unit="%" min={10} max={40} />
                <InputField label="Super Built-Up Loading %" value={superLoading} onChange={setSuperLoading} unit="%" min={20} max={60} />
            </div>
            <div className="con-calc__results">
                <h4>Area Conversion (sq ft)</h4>
                <ResultRow label="Carpet Area" value={fmtInt(result.carpet)} unit="sq ft" />
                <ResultRow label="Built-Up Area" value={fmtInt(result.builtUp)} unit="sq ft" />
                <ResultRow label="Super Built-Up Area" value={fmtInt(result.superBuiltUp)} unit="sq ft" />
                <h4>Area (sq m)</h4>
                <ResultRow label="Carpet Area" value={fmt(result.carpetM2, 1)} unit="sq m" />
                <ResultRow label="Built-Up Area" value={fmt(result.builtUpM2, 1)} unit="sq m" />
                <ResultRow label="Super Built-Up Area" value={fmt(result.superM2, 1)} unit="sq m" />
            </div>
        </div>
    );
}

/* ──────────── STEEL QUANTITY CALCULATOR ──────────── */
function SteelQuantityCalc() {
    const [builtUpArea, setBuiltUpArea] = useState(1000);
    const [floors, setFloors] = useState(2);
    const [structureType, setStructureType] = useState("residential");
    const [steelPrice, setSteelPrice] = useState(55);

    const STEEL_RATES: Record<string, { kgPerSqFt: number; label: string }> = {
        residential: { kgPerSqFt: 4.5, label: "Residential (3.5–5.5 kg/sq ft)" },
        commercial: { kgPerSqFt: 6, label: "Commercial (5–7 kg/sq ft)" },
        industrial: { kgPerSqFt: 8, label: "Industrial (7–10 kg/sq ft)" },
    };

    const result = useMemo(() => {
        const totalArea = builtUpArea * floors;
        const rate = STEEL_RATES[structureType]?.kgPerSqFt || 4.5;
        const steelKg = totalArea * rate;
        const steelTons = steelKg / 1000;
        const cost = steelKg * steelPrice;
        const bars8mm = Math.ceil(steelKg * 0.10 / 3.95);
        const bars10mm = Math.ceil(steelKg * 0.15 / 6.17);
        const bars12mm = Math.ceil(steelKg * 0.30 / 8.88);
        const bars16mm = Math.ceil(steelKg * 0.30 / 15.78);
        const bars20mm = Math.ceil(steelKg * 0.15 / 24.66);
        return { totalArea, steelKg, steelTons, cost, bars8mm, bars10mm, bars12mm, bars16mm, bars20mm };
    }, [builtUpArea, floors, structureType, steelPrice]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">⚙️ Steel Quantity Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Built-Up Area (per floor)" value={builtUpArea} onChange={setBuiltUpArea} unit="sq ft" min={100} step={50} />
                <InputField label="Number of Floors" value={floors} onChange={setFloors} min={1} max={10} />
                <SelectField label="Structure Type" value={structureType} onChange={setStructureType} options={Object.entries(STEEL_RATES).map(([k, v]) => ({ value: k, label: v.label }))} />
                <InputField label="Steel Price" value={steelPrice} onChange={setSteelPrice} unit="₹/kg" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Steel Quantity</h4>
                <ResultRow label="Total Built-Up Area" value={fmtInt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Total Steel" value={fmt(result.steelKg, 0)} unit="kg" />
                <ResultRow label="Total Steel" value={fmt(result.steelTons, 2)} unit="metric tons" />
                <h4>Bars by Diameter (approx)</h4>
                <ResultRow label="8 mm (stirrups)" value={fmtInt(result.bars8mm)} unit="bars (12m)" />
                <ResultRow label="10 mm" value={fmtInt(result.bars10mm)} unit="bars (12m)" />
                <ResultRow label="12 mm" value={fmtInt(result.bars12mm)} unit="bars (12m)" />
                <ResultRow label="16 mm" value={fmtInt(result.bars16mm)} unit="bars (12m)" />
                <ResultRow label="20 mm" value={fmtInt(result.bars20mm)} unit="bars (12m)" />
                <h4>Cost</h4>
                <ResultRow label="Estimated Steel Cost" value={`₹${fmtInt(result.cost)}`} />
            </div>
        </div>
    );
}

/* ──────────── ANTI-TERMITE CALCULATOR ──────────── */
function AntiTermiteCalc() {
    const [plinthArea, setPlinthArea] = useState(1000);
    const [perimeterLength, setPerimeterLength] = useState(130);
    const [trenchDepth, setTrenchDepth] = useState(1.5);
    const [trenchWidth, setTrenchWidth] = useState(1);
    const [chemConc, setChemConc] = useState(1);

    const result = useMemo(() => {
        const soilTreatmentArea = plinthArea * 0.0929;
        const soilRate = 5;
        const soilSolution = soilTreatmentArea * soilRate;
        const trenchVol = perimeterLength * 0.3048 * trenchDepth * 0.3048 * trenchWidth * 0.3048;
        const trenchRate = 7.5;
        const trenchSolution = trenchVol * trenchRate;
        const totalSolution = soilSolution + trenchSolution;
        const chemicalLiters = totalSolution * (chemConc / 100);
        const waterLiters = totalSolution - chemicalLiters;
        return { soilSolution, trenchSolution, totalSolution, chemicalLiters, waterLiters };
    }, [plinthArea, perimeterLength, trenchDepth, trenchWidth, chemConc]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🐜 Anti-Termite Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Plinth Area" value={plinthArea} onChange={setPlinthArea} unit="sq ft" min={100} step={50} />
                <InputField label="Foundation Perimeter" value={perimeterLength} onChange={setPerimeterLength} unit="ft" min={10} />
                <InputField label="Trench Depth" value={trenchDepth} onChange={setTrenchDepth} unit="ft" min={0.5} step={0.5} />
                <InputField label="Trench Width" value={trenchWidth} onChange={setTrenchWidth} unit="ft" min={0.5} step={0.5} />
                <InputField label="Chemical Concentration" value={chemConc} onChange={setChemConc} unit="%" min={0.5} max={5} step={0.25} />
            </div>
            <div className="con-calc__results">
                <h4>Solution Required</h4>
                <ResultRow label="Soil Treatment" value={fmt(result.soilSolution, 1)} unit="liters" />
                <ResultRow label="Trench Treatment" value={fmt(result.trenchSolution, 1)} unit="liters" />
                <ResultRow label="Total Solution" value={fmt(result.totalSolution, 1)} unit="liters" />
                <h4>Chemical Breakdown</h4>
                <ResultRow label="Chemical (concentrate)" value={fmt(result.chemicalLiters, 2)} unit="liters" />
                <ResultRow label="Water" value={fmt(result.waterLiters, 1)} unit="liters" />
            </div>
        </div>
    );
}

/* ──────────── COMPOUND WALL CALCULATOR ──────────── */
function CompoundWallCalc() {
    const [wallLength, setWallLength] = useState(100);
    const [wallHeight, setWallHeight] = useState(7);
    const [pillarSpacing, setPillarSpacing] = useState(10);
    const [panelCost, setPanelCost] = useState(350);
    const [pillarCost, setPillarCost] = useState(1500);

    const result = useMemo(() => {
        const pillars = Math.ceil(wallLength / pillarSpacing) + 1;
        const panelsPerBay = Math.ceil(wallHeight / 1.5);
        const totalPanels = (pillars - 1) * panelsPerBay;
        const pillarFoundVol = pillars * 1.5 * 1.5 * 2;
        const panelTotalCost = totalPanels * panelCost;
        const pillarTotalCost = pillars * pillarCost;
        const foundationCost = pillarFoundVol * 130;
        const totalCost = panelTotalCost + pillarTotalCost + foundationCost;
        return { pillars, panelsPerBay, totalPanels, pillarFoundVol, panelTotalCost, pillarTotalCost, foundationCost, totalCost };
    }, [wallLength, wallHeight, pillarSpacing, panelCost, pillarCost]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🧱 Compound Wall Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Total Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={10} />
                <InputField label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={3} max={12} />
                <InputField label="Pillar Spacing" value={pillarSpacing} onChange={setPillarSpacing} unit="ft" min={5} max={15} />
                <InputField label="Panel Cost (each)" value={panelCost} onChange={setPanelCost} unit="₹" min={0} />
                <InputField label="Pillar Cost (each)" value={pillarCost} onChange={setPillarCost} unit="₹" min={0} />
            </div>
            <div className="con-calc__results">
                <h4>Quantities</h4>
                <ResultRow label="Pillars Needed" value={fmtInt(result.pillars)} unit="pillars" />
                <ResultRow label="Panels per Bay" value={fmtInt(result.panelsPerBay)} unit="panels" />
                <ResultRow label="Total Panels" value={fmtInt(result.totalPanels)} unit="panels" />
                <ResultRow label="Foundation Concrete" value={fmt(result.pillarFoundVol, 1)} unit="cu ft" />
                <h4>Cost</h4>
                <ResultRow label="Panels" value={`₹${fmtInt(result.panelTotalCost)}`} />
                <ResultRow label="Pillars" value={`₹${fmtInt(result.pillarTotalCost)}`} />
                <ResultRow label="Foundation" value={`₹${fmtInt(result.foundationCost)}`} />
                <ResultRow label="Total Estimated Cost" value={`₹${fmtInt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── COUNTERTOP CALCULATOR ──────────── */
function CountertopCalc() {
    const [runs, setRuns] = useState(10);
    const [depth, setDepth] = useState(25);
    const [material, setMaterial] = useState("granite");
    const [includeBacksplash, setIncludeBacksplash] = useState(true);
    const [backsplashHeight, setBacksplashHeight] = useState(4);

    const MATERIALS: Record<string, { price: number; label: string }> = {
        laminate: { price: 15, label: "Laminate ($10–$20/sq ft)" },
        granite: { price: 50, label: "Granite ($40–$60/sq ft)" },
        quartz: { price: 65, label: "Quartz ($50–$80/sq ft)" },
        marble: { price: 75, label: "Marble ($60–$100/sq ft)" },
        butcher: { price: 45, label: "Butcher Block ($35–$55/sq ft)" },
        concrete_ct: { price: 70, label: "Concrete ($60–$80/sq ft)" },
    };

    const result = useMemo(() => {
        const depthFt = depth / 12;
        const counterArea = runs * depthFt;
        const bsArea = includeBacksplash ? runs * (backsplashHeight / 12) : 0;
        const totalArea = counterArea + bsArea;
        const pricePerSqFt = MATERIALS[material]?.price || 50;
        const materialCost = totalArea * pricePerSqFt;
        const installCost = totalArea * 25;
        const totalCost = materialCost + installCost;
        const slabs = Math.ceil(totalArea / 45);
        return { counterArea, bsArea, totalArea, materialCost, installCost, totalCost, slabs };
    }, [runs, depth, material, includeBacksplash, backsplashHeight]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🍳 Countertop Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Counter Length (total runs)" value={runs} onChange={setRuns} unit="ft" min={1} />
                <InputField label="Counter Depth" value={depth} onChange={setDepth} unit="in" min={12} max={42} />
                <SelectField label="Material" value={material} onChange={setMaterial} options={Object.entries(MATERIALS).map(([k, v]) => ({ value: k, label: v.label }))} />
                <div className="con-input">
                    <label className="con-input__label"><input type="checkbox" checked={includeBacksplash} onChange={(e) => setIncludeBacksplash(e.target.checked)} /> Include Backsplash</label>
                </div>
                {includeBacksplash && <InputField label="Backsplash Height" value={backsplashHeight} onChange={setBacksplashHeight} unit="in" min={2} max={18} />}
            </div>
            <div className="con-calc__results">
                <h4>Area</h4>
                <ResultRow label="Counter Area" value={fmt(result.counterArea)} unit="sq ft" />
                {includeBacksplash && <ResultRow label="Backsplash Area" value={fmt(result.bsArea)} unit="sq ft" />}
                <ResultRow label="Total Area" value={fmt(result.totalArea)} unit="sq ft" />
                <ResultRow label="Slabs Needed (~45 sq ft each)" value={fmtInt(result.slabs)} unit="slabs" />
                <h4>Cost</h4>
                <ResultRow label="Material Cost" value={`$${fmtInt(result.materialCost)}`} />
                <ResultRow label="Installation (~$25/sq ft)" value={`$${fmtInt(result.installCost)}`} />
                <ResultRow label="Total Estimated Cost" value={`$${fmtInt(result.totalCost)}`} />
            </div>
        </div>
    );
}

/* ──────────── SOLAR ROOFTOP CALCULATOR ──────────── */
function SolarRooftopCalc() {
    const [roofArea, setRoofArea] = useState(500);
    const [sunHours, setSunHours] = useState(5);
    const [panelWatt, setPanelWatt] = useState(400);
    const [electricityRate, setElectricityRate] = useState(8);
    const [systemCost, setSystemCost] = useState(55000);

    const result = useMemo(() => {
        const usableArea = roofArea * 0.7;
        const panelArea = 18;
        const panelCount = Math.floor(usableArea / panelArea);
        const systemKW = (panelCount * panelWatt) / 1000;
        const dailyKWh = systemKW * sunHours * 0.80;
        const annualKWh = dailyKWh * 365;
        const annualSavings = annualKWh * electricityRate;
        const totalSystemCost = systemKW * systemCost;
        const paybackYears = annualSavings > 0 ? totalSystemCost / annualSavings : 0;
        const co2Saved = annualKWh * 0.82;
        return { panelCount, systemKW, dailyKWh, annualKWh, annualSavings, totalSystemCost, paybackYears, co2Saved };
    }, [roofArea, sunHours, panelWatt, electricityRate, systemCost]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">☀️ Solar Rooftop Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Available Roof Area" value={roofArea} onChange={setRoofArea} unit="sq ft" min={50} step={10} />
                <InputField label="Peak Sun Hours" value={sunHours} onChange={setSunHours} unit="hrs/day" min={2} max={8} step={0.5} />
                <InputField label="Panel Wattage" value={panelWatt} onChange={setPanelWatt} unit="W" min={250} max={600} step={50} />
                <InputField label="Electricity Rate" value={electricityRate} onChange={setElectricityRate} unit="₹/kWh" min={1} step={0.5} />
                <InputField label="System Cost" value={systemCost} onChange={setSystemCost} unit="₹/kW" min={30000} step={5000} />
            </div>
            <div className="con-calc__results">
                <h4>System Size</h4>
                <ResultRow label="Panels" value={fmtInt(result.panelCount)} unit="panels" />
                <ResultRow label="System Capacity" value={fmt(result.systemKW, 1)} unit="kW" />
                <h4>Generation</h4>
                <ResultRow label="Daily Output" value={fmt(result.dailyKWh, 1)} unit="kWh/day" />
                <ResultRow label="Annual Output" value={fmtInt(result.annualKWh)} unit="kWh/year" />
                <ResultRow label="CO₂ Saved" value={fmt(result.co2Saved / 1000, 1)} unit="tons/year" />
                <h4>Financials</h4>
                <ResultRow label="System Cost" value={`₹${fmtInt(result.totalSystemCost)}`} />
                <ResultRow label="Annual Savings" value={`₹${fmtInt(result.annualSavings)}`} />
                <ResultRow label="Payback Period" value={fmt(result.paybackYears, 1)} unit="years" />
            </div>
        </div>
    );
}

/* ──────────── SOLAR WATER HEATER CALCULATOR ──────────── */
function SolarWaterHeaterCalc() {
    const [familySize, setFamilySize] = useState(4);
    const [usagePerPerson, setUsagePerPerson] = useState(50);
    const [climate, setClimate] = useState("moderate");
    const [electricityRate, setElectricityRate] = useState(8);

    const CLIMATE_FACTOR: Record<string, { factor: number; label: string }> = {
        hot: { factor: 0.85, label: "Hot / Tropical (High solar)" },
        moderate: { factor: 0.70, label: "Moderate / Temperate" },
        cold: { factor: 0.55, label: "Cold / Cloudy" },
    };

    const result = useMemo(() => {
        const dailyHotWater = familySize * usagePerPerson;
        const tankCapacity = Math.ceil(dailyHotWater / 25) * 25;
        const collectorArea = Math.ceil(dailyHotWater / 50);
        const solarFraction = CLIMATE_FACTOR[climate]?.factor || 0.7;
        const energyPerLiter = 0.05;
        const dailySavedKWh = dailyHotWater * energyPerLiter * solarFraction;
        const annualSavedKWh = dailySavedKWh * 365;
        const annualSavings = annualSavedKWh * electricityRate;
        const systemCost = tankCapacity * 100;
        const paybackYears = annualSavings > 0 ? systemCost / annualSavings : 0;
        return { dailyHotWater, tankCapacity, collectorArea, solarFraction, dailySavedKWh, annualSavedKWh, annualSavings, systemCost, paybackYears };
    }, [familySize, usagePerPerson, climate, electricityRate]);

    return (
        <div className="con-calc">
            <h3 className="con-calc__title">🌊 Solar Water Heater Calculator</h3>
            <div className="con-calc__inputs">
                <InputField label="Family Members" value={familySize} onChange={setFamilySize} min={1} max={20} />
                <InputField label="Hot Water per Person" value={usagePerPerson} onChange={setUsagePerPerson} unit="liters/day" min={20} max={100} />
                <SelectField label="Climate Zone" value={climate} onChange={setClimate} options={Object.entries(CLIMATE_FACTOR).map(([k, v]) => ({ value: k, label: v.label }))} />
                <InputField label="Electricity Rate" value={electricityRate} onChange={setElectricityRate} unit="₹/kWh" min={1} step={0.5} />
            </div>
            <div className="con-calc__results">
                <h4>System Sizing</h4>
                <ResultRow label="Daily Hot Water Need" value={fmtInt(result.dailyHotWater)} unit="liters" />
                <ResultRow label="Recommended Tank" value={fmtInt(result.tankCapacity)} unit="liters" />
                <ResultRow label="Collector Area" value={fmtInt(result.collectorArea)} unit="sq m" />
                <ResultRow label="Solar Fraction" value={fmt(result.solarFraction * 100, 0)} unit="%" />
                <h4>Energy Savings</h4>
                <ResultRow label="Daily Savings" value={fmt(result.dailySavedKWh, 1)} unit="kWh" />
                <ResultRow label="Annual Savings" value={fmtInt(result.annualSavedKWh)} unit="kWh" />
                <h4>Financials</h4>
                <ResultRow label="Estimated System Cost" value={`₹${fmtInt(result.systemCost)}`} />
                <ResultRow label="Annual Monetary Savings" value={`₹${fmtInt(result.annualSavings)}`} />
                <ResultRow label="Payback Period" value={fmt(result.paybackYears, 1)} unit="years" />
            </div>
        </div>
    );
}


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
    "concrete-block-fill": ConcreteBlockFillCalc,
    "concrete-mix": ConcreteMixCalc,
    "concrete-weight": ConcreteWeightCalc,
    "rebar-weight": RebarWeightCalc,
    "concrete-cost": ConcreteCostCalc,
    "soil-volume": SoilVolumeCalc,
    "roofing-cost": RoofingCostCalc,
    "foundation": FoundationCalc,
    "beam-span": BeamSpanCalc,
    "header-size": HeaderSizeCalc,
    "deck-stain": DeckStainCalc,
    "paver-base": PaverBaseCalc,
    "polymeric-sand": PolymericSandCalc,
    "asphalt-sealer": AsphaltSealerCalc,
    "gravel-driveway": GravelDrivewayCalc,
    "fence-stain": FenceStainCalc,
    "vinyl-fence": VinylFenceCalc,
    "fence-cost": FenceCostCalc,
    "linear-sqft": LinearSqftCalc,
    "flooring-cost": FlooringCostCalc,
    "bathroom-renovation-cost": BathroomRenovationCostCalc,
    "electrical-cost": ElectricalCostCalc,
    "hvac-cost": HVACCostCalc,
    "kitchen-renovation-cost": KitchenRenovationCostCalc,
    "acreage": AcreageCalc,
    "elevation-grade": ElevationGradeCalc,
    "grass-seed": GrassSeedCalc,
    "lawn-mowing": LawnMowingCalc,
    "plant-flower": PlantFlowerCalc,
    "sod": SodCalc,
    "sod-weight": SodWeightCalc,
    "stone": StoneCalc,
    "cubic-feet": CubicFeetCalc,
    "cubic-inches": CubicInchesCalc,
    "cubic-meters": CubicMetersCalc,
    "cubic-yards-to-tons": CubicYardsToTonsCalc,
    "cylinder-cubic-footage": CylinderCubicFootageCalc,
    "cylinder-cubic-yardage": CylinderCubicYardageCalc,
    "feet-and-inches": FeetAndInchesCalc,
    "inch-fraction": InchFractionCalc,
    "scale-conversion": ScaleConversionCalc,
    "sqft-to-cuft": SqFtToCuFtCalc,
    "sqft-to-cuyd": SqFtToCuYdCalc,
    "square-inches": SquareInchesCalc,
    "square-meters": SquareMetersCalc,
    "square-yards": SquareYardsCalc,
    "tank-volume": TankVolumeCalc,
    "cfm": CfmCalc,
    "flow-rate": FlowRateCalc,
    "furnace-btu": FurnaceBtuCalc,
    "pipe-volume": PipeVolumeCalc,
    "refrigerant-line": RefrigerantLineCalc,
    "water-velocity": WaterVelocityCalc,
    "window-ac-size": WindowAcSizeCalc,
    "ice-water-shield": IceWaterShieldCalc,
    "metal-roofing": MetalRoofingCalc,
    "plywood-sheathing": PlywoodSheathingCalc,
    "roof-snow-load": RoofSnowLoadCalc,
    "roofing-material": RoofingMaterialCalc,
    "clapboard-siding": ClapboardSidingCalc,
    "siding-material": SidingMaterialCalc,
    "vinyl-siding": VinylSidingCalc,
    "plastering": PlasteringCalc,
    "pcc": PCCCalc,
    "rcc": RCCCalc,
    "construction-cost": ConstructionCostCalc,
    "carpet-area": CarpetAreaCalc,
    "steel-quantity": SteelQuantityCalc,
    "anti-termite": AntiTermiteCalc,
    "compound-wall": CompoundWallCalc,
    "countertop": CountertopCalc,
    "solar-rooftop": SolarRooftopCalc,
    "solar-water-heater": SolarWaterHeaterCalc,
};

export default function ConstructionCalculatorCore({ calcType }: { calcType: string }) {
    const CalcComponent = CALC_MAP[calcType];
    if (!CalcComponent) return <p>Calculator not found: {calcType}</p>;
    return <CalcComponent />;
}

