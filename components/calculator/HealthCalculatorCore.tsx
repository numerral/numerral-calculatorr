"use client";
import { useState, useMemo } from "react";

const fmt = (n: number, d = 1) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

function ResultRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
    return (<div className="con-result-row"><span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value">{value}{unit ? <span className="con-result-row__unit"> {unit}</span> : null}</span></div>);
}
function InputField({ label, value, onChange, unit, min, max, step }: {
    label: string; value: number; onChange: (v: number) => void; unit?: string; min?: number; max?: number; step?: number;
}) {
    return (<div className="con-input"><label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
        <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step || 1} /></div>);
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
    return (<div className="con-input"><label className="con-input__label">{label}</label>
        <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

function mifflinBMR(w: number, h: number, age: number, sex: string) {
    return sex === "male" ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
}
const ACT: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };

/* 1. BMI */
function BmiCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [sex, setSex] = useState("male");
    const r = useMemo(() => { const hm = h / 100; const bmi = w / (hm * hm); const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
        const lo = 18.5 * hm * hm; const hi = 24.9 * hm * hm; return { bmi, cat, lo, hi }; }, [w, h]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚖️ BMI Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} max={250} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="BMI" value={fmt(r.bmi)} /><ResultRow label="Category" value={r.cat} />
        <ResultRow label="Healthy Range" value={`${fmt(r.lo)} – ${fmt(r.hi)}`} unit="kg" /></div></div>);
}

/* 2. Calorie Calculator */
function CalorieCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate");
    const r = useMemo(() => { const bmr = mifflinBMR(w, h, age, sex); const tdee = bmr * (ACT[act] || 1.55);
        return { bmr, tdee, lose: tdee - 500, gain: tdee + 500 }; }, [w, h, age, sex, act]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔥 Calorie Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary (office job)"},{value:"light",label:"Light (1-3 days/wk)"},{value:"moderate",label:"Moderate (3-5 days/wk)"},{value:"active",label:"Active (6-7 days/wk)"},{value:"very_active",label:"Very Active (athlete)"}]} />
    </div><div className="con-calc__results"><h4>Daily Calories</h4>
        <ResultRow label="BMR" value={fmt(r.bmr, 0)} unit="kcal" /><ResultRow label="Maintenance" value={fmt(r.tdee, 0)} unit="kcal" />
        <ResultRow label="Weight Loss" value={fmt(r.lose, 0)} unit="kcal" /><ResultRow label="Weight Gain" value={fmt(r.gain, 0)} unit="kcal" /></div></div>);
}

/* 3. TDEE */
function TdeeCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate");
    const r = useMemo(() => { const bmr = mifflinBMR(w, h, age, sex); return Object.entries(ACT).map(([k, m]) => ({ level: k, tdee: bmr * m, active: k === act })); }, [w, h, age, sex, act]);
    const cur = r.find(x => x.active);
    return (<div className="con-calc"><h3 className="con-calc__title">⚡ TDEE Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Your TDEE" value={fmt(cur?.tdee || 0, 0)} unit="kcal/day" />
        {r.map(x => <ResultRow key={x.level} label={x.level.replace("_"," ")} value={fmt(x.tdee, 0)} unit={x.active ? "kcal ← you" : "kcal"} />)}
    </div></div>);
}

/* 4. BMR */
function BmrCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30); const [sex, setSex] = useState("male");
    const r = useMemo(() => { const msj = mifflinBMR(w, h, age, sex);
        const hb = sex === "male" ? 88.362 + 13.397*w + 4.799*h - 5.677*age : 447.593 + 9.247*w + 3.098*h - 4.330*age;
        return { msj, hb }; }, [w, h, age, sex]);
    return (<div className="con-calc"><h3 className="con-calc__title">💤 BMR Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
    </div><div className="con-calc__results"><h4>Basal Metabolic Rate</h4>
        <ResultRow label="Mifflin-St Jeor" value={fmt(r.msj, 0)} unit="kcal/day" /><ResultRow label="Harris-Benedict" value={fmt(r.hb, 0)} unit="kcal/day" /></div></div>);
}

/* 5. Body Fat (Navy) */
function BodyFatCalc() {
    const [sex, setSex] = useState("male"); const [h, setH] = useState(170); const [waist, setWaist] = useState(85);
    const [neck, setNeck] = useState(38); const [hip, setHip] = useState(100);
    const r = useMemo(() => { let bf: number;
        if (sex === "male") bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
        else bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
        const cat = sex === "male" ? (bf < 6 ? "Essential" : bf < 14 ? "Athletic" : bf < 18 ? "Fit" : bf < 25 ? "Average" : "Obese")
            : (bf < 14 ? "Essential" : bf < 21 ? "Athletic" : bf < 25 ? "Fit" : bf < 32 ? "Average" : "Obese");
        return { bf: Math.max(bf, 2), cat }; }, [sex, h, waist, neck, hip]);
    return (<div className="con-calc"><h3 className="con-calc__title">📏 Body Fat Calculator</h3><div className="con-calc__inputs">
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={100} /><InputField label="Waist" value={waist} onChange={setWaist} unit="cm" min={50} />
        <InputField label="Neck" value={neck} onChange={setNeck} unit="cm" min={25} />
        {sex === "female" && <InputField label="Hip" value={hip} onChange={setHip} unit="cm" min={60} />}
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Body Fat" value={`${fmt(r.bf)}%`} /><ResultRow label="Category" value={r.cat} /></div></div>);
}

/* 6. Ideal Weight */
function IdealWeightCalc() {
    const [h, setH] = useState(170); const [sex, setSex] = useState("male");
    const r = useMemo(() => { const inches = h / 2.54; const over60 = Math.max(inches - 60, 0);
        const devine = sex === "male" ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
        const robinson = sex === "male" ? 52 + 1.9 * over60 : 49 + 1.7 * over60;
        const miller = sex === "male" ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60;
        const hm = h / 100; const bmiLo = 18.5 * hm * hm; const bmiHi = 24.9 * hm * hm;
        return { devine, robinson, miller, bmiLo, bmiHi }; }, [h, sex]);
    return (<div className="con-calc"><h3 className="con-calc__title">🎯 Ideal Weight Calculator</h3><div className="con-calc__inputs">
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={100} max={220} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
    </div><div className="con-calc__results"><h4>Ideal Weight (kg)</h4>
        <ResultRow label="Devine Formula" value={fmt(r.devine)} unit="kg" /><ResultRow label="Robinson Formula" value={fmt(r.robinson)} unit="kg" />
        <ResultRow label="Miller Formula" value={fmt(r.miller)} unit="kg" /><ResultRow label="BMI Healthy Range" value={`${fmt(r.bmiLo)} – ${fmt(r.bmiHi)}`} unit="kg" /></div></div>);
}

/* 7. Macro Calculator */
function MacroCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate"); const [goal, setGoal] = useState("maintain");
    const r = useMemo(() => { const bmr = mifflinBMR(w, h, age, sex); let tdee = bmr * (ACT[act] || 1.55);
        if (goal === "lose") tdee -= 500; else if (goal === "gain") tdee += 500;
        const protein = w * 2; const fat = tdee * 0.25 / 9; const carbs = (tdee - protein * 4 - fat * 9) / 4;
        return { tdee, protein, fat, carbs }; }, [w, h, age, sex, act, goal]);
    return (<div className="con-calc"><h3 className="con-calc__title">🥗 Macro Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
        <SelectField label="Goal" value={goal} onChange={setGoal} options={[{value:"lose",label:"Lose Weight"},{value:"maintain",label:"Maintain"},{value:"gain",label:"Gain Muscle"}]} />
    </div><div className="con-calc__results"><h4>Daily Targets ({fmt(r.tdee, 0)} kcal)</h4>
        <ResultRow label="Protein" value={fmt(r.protein, 0)} unit="g" /><ResultRow label="Carbs" value={fmt(Math.max(r.carbs, 0), 0)} unit="g" />
        <ResultRow label="Fat" value={fmt(r.fat, 0)} unit="g" /></div></div>);
}

/* 8. Water Intake */
function WaterIntakeCalc() {
    const [w, setW] = useState(70); const [act, setAct] = useState("moderate"); const [climate, setClimate] = useState("temperate");
    const r = useMemo(() => { let base = w * 0.033;
        if (act === "active" || act === "very_active") base *= 1.2; else if (act === "light") base *= 1.05;
        if (climate === "hot") base *= 1.15; else if (climate === "cold") base *= 0.95;
        return { litres: base, glasses: base / 0.25 }; }, [w, act, climate]);
    return (<div className="con-calc"><h3 className="con-calc__title">💧 Water Intake Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
        <SelectField label="Climate" value={climate} onChange={setClimate} options={[{value:"cold",label:"Cold"},{value:"temperate",label:"Temperate"},{value:"hot",label:"Hot/Humid"}]} />
    </div><div className="con-calc__results"><h4>Daily Water Intake</h4>
        <ResultRow label="Litres" value={fmt(r.litres)} unit="L/day" /><ResultRow label="Glasses (250 ml)" value={fmt(r.glasses, 0)} unit="glasses" /></div></div>);
}

/* 9. Pregnancy Due Date */
function PregnancyDueDateCalc() {
    const today = new Date(); const defLmp = new Date(today.getTime() - 56 * 86400000);
    const [lmpStr, setLmpStr] = useState(defLmp.toISOString().split("T")[0]);
    const r = useMemo(() => { const lmp = new Date(lmpStr); const due = new Date(lmp.getTime() + 280 * 86400000);
        const diff = today.getTime() - lmp.getTime(); const weeks = Math.floor(diff / (7 * 86400000)); const days = Math.floor((diff % (7 * 86400000)) / 86400000);
        const trim = weeks < 13 ? "1st" : weeks < 27 ? "2nd" : "3rd";
        return { due: due.toLocaleDateString(), weeks, days, trim }; }, [lmpStr]);
    return (<div className="con-calc"><h3 className="con-calc__title">🤰 Pregnancy Due Date</h3><div className="con-calc__inputs">
        <div className="con-input"><label className="con-input__label">Last Menstrual Period</label>
            <input type="date" className="con-input__field" value={lmpStr} onChange={e => setLmpStr(e.target.value)} /></div>
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Estimated Due Date" value={r.due} /><ResultRow label="Currently" value={`${r.weeks} weeks, ${r.days} days`} />
        <ResultRow label="Trimester" value={r.trim} /></div></div>);
}

/* 10. Ovulation */
function OvulationCalc() {
    const today = new Date(); const defStart = new Date(today.getTime() - 14 * 86400000);
    const [dateStr, setDateStr] = useState(defStart.toISOString().split("T")[0]); const [cycleLen, setCycleLen] = useState(28);
    const r = useMemo(() => { const start = new Date(dateStr); const ovDay = cycleLen - 14;
        const ovDate = new Date(start.getTime() + ovDay * 86400000);
        const fertStart = new Date(ovDate.getTime() - 5 * 86400000); const fertEnd = new Date(ovDate.getTime() + 1 * 86400000);
        const nextPeriod = new Date(start.getTime() + cycleLen * 86400000);
        return { ovDate: ovDate.toLocaleDateString(), fertStart: fertStart.toLocaleDateString(), fertEnd: fertEnd.toLocaleDateString(), nextPeriod: nextPeriod.toLocaleDateString() }; }, [dateStr, cycleLen]);
    return (<div className="con-calc"><h3 className="con-calc__title">📅 Ovulation Calculator</h3><div className="con-calc__inputs">
        <div className="con-input"><label className="con-input__label">First Day of Last Period</label>
            <input type="date" className="con-input__field" value={dateStr} onChange={e => setDateStr(e.target.value)} /></div>
        <InputField label="Cycle Length" value={cycleLen} onChange={setCycleLen} unit="days" min={21} max={40} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Estimated Ovulation" value={r.ovDate} /><ResultRow label="Fertile Window" value={`${r.fertStart} – ${r.fertEnd}`} />
        <ResultRow label="Next Period" value={r.nextPeriod} /></div></div>);
}

/* 11. Heart Rate Zones */
function HeartRateZoneCalc() {
    const [age, setAge] = useState(30); const [rhr, setRhr] = useState(65);
    const r = useMemo(() => { const mhr = 220 - age; const hrr = mhr - rhr;
        const z = (lo: number, hi: number) => ({ lo: Math.round(hrr * lo + rhr), hi: Math.round(hrr * hi + rhr) });
        return { mhr, z1: z(0.5, 0.6), z2: z(0.6, 0.7), z3: z(0.7, 0.8), z4: z(0.8, 0.9), z5: z(0.9, 1.0) }; }, [age, rhr]);
    return (<div className="con-calc"><h3 className="con-calc__title">❤️‍🔥 Heart Rate Zones</h3><div className="con-calc__inputs">
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <InputField label="Resting Heart Rate" value={rhr} onChange={setRhr} unit="bpm" min={40} max={100} />
    </div><div className="con-calc__results"><h4>Training Zones (Karvonen)</h4>
        <ResultRow label="Max HR" value={`${r.mhr}`} unit="bpm" />
        <ResultRow label="Zone 1 (Warm-up)" value={`${r.z1.lo} – ${r.z1.hi}`} unit="bpm" />
        <ResultRow label="Zone 2 (Fat Burn)" value={`${r.z2.lo} – ${r.z2.hi}`} unit="bpm" />
        <ResultRow label="Zone 3 (Cardio)" value={`${r.z3.lo} – ${r.z3.hi}`} unit="bpm" />
        <ResultRow label="Zone 4 (Threshold)" value={`${r.z4.lo} – ${r.z4.hi}`} unit="bpm" />
        <ResultRow label="Zone 5 (Max)" value={`${r.z5.lo} – ${r.z5.hi}`} unit="bpm" /></div></div>);
}

/* 12. BSA */
function BsaCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170);
    const r = useMemo(() => ({ dubois: 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725), mosteller: Math.sqrt(w * h / 3600), haycock: 0.024265 * Math.pow(w, 0.5378) * Math.pow(h, 0.3964) }), [w, h]);
    return (<div className="con-calc"><h3 className="con-calc__title">📐 Body Surface Area</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
    </div><div className="con-calc__results"><h4>BSA (m²)</h4>
        <ResultRow label="Du Bois" value={fmt(r.dubois, 2)} unit="m²" /><ResultRow label="Mosteller" value={fmt(r.mosteller, 2)} unit="m²" />
        <ResultRow label="Haycock" value={fmt(r.haycock, 2)} unit="m²" /></div></div>);
}

/* 13. Lean Body Mass */
function LeanBodyMassCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [sex, setSex] = useState("male");
    const r = useMemo(() => { const boer = sex === "male" ? 0.407 * w + 0.267 * h - 19.2 : 0.252 * w + 0.473 * h - 48.3;
        const james = sex === "male" ? 1.1 * w - 128 * (w / h) * (w / h) : 1.07 * w - 148 * (w / h) * (w / h);
        const hume = sex === "male" ? 0.32810 * w + 0.33929 * h - 29.5336 : 0.29569 * w + 0.41813 * h - 43.2933;
        const fatPct = ((w - boer) / w) * 100; return { boer, james, hume, fatPct }; }, [w, h, sex]);
    return (<div className="con-calc"><h3 className="con-calc__title">💪 Lean Body Mass</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
    </div><div className="con-calc__results"><h4>Lean Mass (kg)</h4>
        <ResultRow label="Boer" value={fmt(r.boer)} unit="kg" /><ResultRow label="James" value={fmt(r.james)} unit="kg" />
        <ResultRow label="Hume" value={fmt(r.hume)} unit="kg" /><ResultRow label="Est. Body Fat" value={`${fmt(r.fatPct)}%`} /></div></div>);
}

/* 14. Waist-to-Hip Ratio */
function WaistHipCalc() {
    const [waist, setWaist] = useState(80); const [hip, setHip] = useState(100); const [sex, setSex] = useState("male");
    const r = useMemo(() => { const whr = waist / hip;
        const risk = sex === "male" ? (whr < 0.9 ? "Low" : whr < 1.0 ? "Moderate" : "High") : (whr < 0.8 ? "Low" : whr < 0.85 ? "Moderate" : "High");
        return { whr, risk }; }, [waist, hip, sex]);
    return (<div className="con-calc"><h3 className="con-calc__title">📏 Waist-to-Hip Ratio</h3><div className="con-calc__inputs">
        <InputField label="Waist" value={waist} onChange={setWaist} unit="cm" min={40} /><InputField label="Hip" value={hip} onChange={setHip} unit="cm" min={50} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="WHR" value={fmt(r.whr, 2)} /><ResultRow label="Health Risk" value={r.risk} /></div></div>);
}

/* 15. Protein Intake */
function ProteinIntakeCalc() {
    const [w, setW] = useState(70); const [goal, setGoal] = useState("maintain"); const [act, setAct] = useState("moderate");
    const r = useMemo(() => { let factor = 0.8;
        if (goal === "gain") factor = act === "active" || act === "very_active" ? 2.2 : 1.8;
        else if (goal === "lose") factor = 1.6; else factor = act === "active" || act === "very_active" ? 1.4 : 1.0;
        const g = w * factor; return { g, lo: w * (factor - 0.2), hi: w * (factor + 0.2), factor }; }, [w, goal, act]);
    return (<div className="con-calc"><h3 className="con-calc__title">🥩 Protein Intake</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} />
        <SelectField label="Goal" value={goal} onChange={setGoal} options={[{value:"lose",label:"Lose Fat"},{value:"maintain",label:"Maintain"},{value:"gain",label:"Build Muscle"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
    </div><div className="con-calc__results"><h4>Daily Protein</h4>
        <ResultRow label="Recommended" value={fmt(r.g, 0)} unit="g/day" /><ResultRow label="Range" value={`${fmt(r.lo, 0)} – ${fmt(r.hi, 0)}`} unit="g/day" />
        <ResultRow label="Per kg Body Weight" value={fmt(r.factor, 1)} unit="g/kg" /></div></div>);
}

/* 16. Calories Burned */
function CaloriesBurnedCalc() {
    const [w, setW] = useState(70); const [dur, setDur] = useState(30);
    const [activity, setActivity] = useState("running-8");
    const METS: Record<string, number> = { "walking-slow": 2.5, "walking-brisk": 4.3, "running-8": 8.3, "running-10": 9.8, "running-12": 11.8, "cycling-light": 6.8, "cycling-vigorous": 10.0, "swimming": 7.0, "yoga": 3.0, "weight-training": 5.0, "hiit": 8.0, "dancing": 5.5, "hiking": 6.0, "jump-rope": 11.0 };
    const r = useMemo(() => { const met = METS[activity] || 5; const cal = met * w * (dur / 60); return { cal, met }; }, [w, dur, activity]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏃 Calories Burned</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Duration" value={dur} onChange={setDur} unit="min" min={5} max={300} />
        <SelectField label="Activity" value={activity} onChange={setActivity} options={[
            {value:"walking-slow",label:"Walking (slow)"},{value:"walking-brisk",label:"Walking (brisk)"},{value:"running-8",label:"Running (8 km/h)"},
            {value:"running-10",label:"Running (10 km/h)"},{value:"running-12",label:"Running (12 km/h)"},{value:"cycling-light",label:"Cycling (light)"},
            {value:"cycling-vigorous",label:"Cycling (vigorous)"},{value:"swimming",label:"Swimming"},{value:"yoga",label:"Yoga"},
            {value:"weight-training",label:"Weight Training"},{value:"hiit",label:"HIIT"},{value:"dancing",label:"Dancing"},
            {value:"hiking",label:"Hiking"},{value:"jump-rope",label:"Jump Rope"},
        ]} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Calories Burned" value={fmt(r.cal, 0)} unit="kcal" /><ResultRow label="MET Value" value={fmt(r.met)} /></div></div>);
}

/* 17. Sleep */
function SleepCalc() {
    const [mode, setMode] = useState("wake"); const [timeStr, setTimeStr] = useState("07:00");
    const r = useMemo(() => { const [hh, mm] = timeStr.split(":").map(Number); const base = hh * 60 + mm;
        const cycles = [4, 5, 6, 7];
        if (mode === "wake") { return cycles.map(c => { let t = base - c * 90 - 15; if (t < 0) t += 1440;
            return { cycles: c, hours: (c * 90 + 15) / 60, time: `${String(Math.floor(t / 60) % 24).padStart(2,"0")}:${String(t % 60).padStart(2,"0")}` }; }); }
        return cycles.map(c => { let t = (base + c * 90 + 15) % 1440;
            return { cycles: c, hours: (c * 90 + 15) / 60, time: `${String(Math.floor(t / 60) % 24).padStart(2,"0")}:${String(t % 60).padStart(2,"0")}` }; });
    }, [mode, timeStr]);
    return (<div className="con-calc"><h3 className="con-calc__title">😴 Sleep Calculator</h3><div className="con-calc__inputs">
        <SelectField label="I want to..." value={mode} onChange={setMode} options={[{value:"wake",label:"Wake up at..."},{value:"sleep",label:"Go to sleep at..."}]} />
        <div className="con-input"><label className="con-input__label">Time</label>
            <input type="time" className="con-input__field" value={timeStr} onChange={e => setTimeStr(e.target.value)} /></div>
    </div><div className="con-calc__results"><h4>{mode === "wake" ? "Go to sleep at" : "Wake up at"}</h4>
        {r.map(x => <ResultRow key={x.cycles} label={`${x.cycles} cycles (${fmt(x.hours)}h)`} value={x.time} />)}</div></div>);
}

/* 18. BAC */
function BacCalc() {
    const [w, setW] = useState(70); const [sex, setSex] = useState("male"); const [drinks, setDrinks] = useState(3); const [hours, setHours] = useState(2);
    const r = useMemo(() => { const r_factor = sex === "male" ? 0.68 : 0.55; const alcohol_g = drinks * 14;
        const bac = Math.max(0, (alcohol_g / (w * 1000 * r_factor)) * 100 - 0.015 * hours);
        const soberH = bac > 0 ? bac / 0.015 : 0;
        const status = bac < 0.02 ? "Sober" : bac < 0.05 ? "Mildly impaired" : bac < 0.08 ? "Impaired" : bac < 0.15 ? "Legally drunk" : "Severely impaired";
        return { bac, soberH, status }; }, [w, sex, drinks, hours]);
    return (<div className="con-calc"><h3 className="con-calc__title">🍺 Blood Alcohol Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <InputField label="Standard Drinks" value={drinks} onChange={setDrinks} min={1} max={20} />
        <InputField label="Hours Drinking" value={hours} onChange={setHours} unit="hrs" min={0} max={12} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Est. BAC" value={`${fmt(r.bac, 3)}%`} /><ResultRow label="Status" value={r.status} />
        <ResultRow label="Est. Time to Sober" value={fmt(r.soberH)} unit="hours" /></div></div>);
}

/* 19. Pace */
function PaceCalc() {
    const [dist, setDist] = useState(10); const [mins, setMins] = useState(50);
    const r = useMemo(() => { const paceMin = mins / dist; const speedKmh = dist / (mins / 60);
        const paceM = Math.floor(paceMin); const paceS = Math.round((paceMin - paceM) * 60);
        return { paceM, paceS, speedKmh, half: mins * 2.1097, full: mins * 4.2195 }; }, [dist, mins]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏅 Pace Calculator</h3><div className="con-calc__inputs">
        <InputField label="Distance" value={dist} onChange={setDist} unit="km" min={0.1} step={0.5} />
        <InputField label="Time" value={mins} onChange={setMins} unit="minutes" min={1} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Pace" value={`${r.paceM}:${String(r.paceS).padStart(2,"0")}`} unit="min/km" />
        <ResultRow label="Speed" value={fmt(r.speedKmh)} unit="km/h" />
        <ResultRow label="Half Marathon" value={`${Math.floor(r.half / 60)}h ${Math.round(r.half % 60)}m`} />
        <ResultRow label="Full Marathon" value={`${Math.floor(r.full / 60)}h ${Math.round(r.full % 60)}m`} /></div></div>);
}

/* 20. One Rep Max */
function OneRepMaxCalc() {
    const [weight, setWeight] = useState(100); const [reps, setReps] = useState(5);
    const r = useMemo(() => { const epley = weight * (1 + reps / 30); const brzycki = weight * 36 / (37 - reps); const lombardi = weight * Math.pow(reps, 0.1);
        const avg = (epley + brzycki + lombardi) / 3;
        return { epley, brzycki, lombardi, avg, p90: avg * 0.9, p80: avg * 0.8, p70: avg * 0.7 }; }, [weight, reps]);
    return (<div className="con-calc"><h3 className="con-calc__title">🏋️ One Rep Max (1RM)</h3><div className="con-calc__inputs">
        <InputField label="Weight Lifted" value={weight} onChange={setWeight} unit="kg" min={5} step={2.5} />
        <InputField label="Reps Performed" value={reps} onChange={setReps} min={1} max={15} />
    </div><div className="con-calc__results"><h4>Estimated 1RM</h4>
        <ResultRow label="Epley" value={fmt(r.epley)} unit="kg" /><ResultRow label="Brzycki" value={fmt(r.brzycki)} unit="kg" />
        <ResultRow label="Lombardi" value={fmt(r.lombardi)} unit="kg" />
        <h4>Training Percentages</h4>
        <ResultRow label="90% (Strength)" value={fmt(r.p90)} unit="kg" /><ResultRow label="80% (Hypertrophy)" value={fmt(r.p80)} unit="kg" />
        <ResultRow label="70% (Endurance)" value={fmt(r.p70)} unit="kg" /></div></div>);
}

/* 21. Body Recomp */
function BodyRecompCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate");
    const r = useMemo(() => { const bmr = mifflinBMR(w, h, age, sex); const tdee = bmr * (ACT[act] || 1.55);
        const trainCal = tdee * 1.1; const restCal = tdee * 0.85;
        const tP = w * 2.2; const tF = trainCal * 0.25 / 9; const tC = (trainCal - tP * 4 - tF * 9) / 4;
        const rP = w * 2.0; const rF = restCal * 0.30 / 9; const rC = (restCal - rP * 4 - rF * 9) / 4;
        return { tdee, trainCal, restCal, tP, tC: Math.max(tC, 0), tF, rP, rC: Math.max(rC, 0), rF }; }, [w, h, age, sex, act]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔄 Body Recomposition</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={20} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} /><SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
    </div><div className="con-calc__results"><h4>Training Days ({fmt(r.trainCal, 0)} kcal)</h4>
        <ResultRow label="Protein" value={fmt(r.tP, 0)} unit="g" /><ResultRow label="Carbs" value={fmt(r.tC, 0)} unit="g" /><ResultRow label="Fat" value={fmt(r.tF, 0)} unit="g" />
        <h4>Rest Days ({fmt(r.restCal, 0)} kcal)</h4>
        <ResultRow label="Protein" value={fmt(r.rP, 0)} unit="g" /><ResultRow label="Carbs" value={fmt(r.rC, 0)} unit="g" /><ResultRow label="Fat" value={fmt(r.rF, 0)} unit="g" /></div></div>);
}

/* 22. Glycemic Load */
function GlycemicIndexCalc() {
    const [gi, setGi] = useState(50); const [carbsG, setCarbsG] = useState(30);
    const r = useMemo(() => { const gl = (gi * carbsG) / 100; const cat = gl <= 10 ? "Low" : gl <= 20 ? "Medium" : "High"; return { gl, cat }; }, [gi, carbsG]);
    return (<div className="con-calc"><h3 className="con-calc__title">🍞 Glycemic Load</h3><div className="con-calc__inputs">
        <InputField label="Glycemic Index (GI)" value={gi} onChange={setGi} min={1} max={100} />
        <InputField label="Carbs per Serving" value={carbsG} onChange={setCarbsG} unit="g" min={1} max={200} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Glycemic Load" value={fmt(r.gl)} /><ResultRow label="Category" value={r.cat} /></div></div>);
}

/* 23. Blood Pressure */
function BloodPressureCalc() {
    const [sys, setSys] = useState(120); const [dia, setDia] = useState(80);
    const r = useMemo(() => { let cat: string; let risk: string;
        if (sys < 90 || dia < 60) { cat = "Low (Hypotension)"; risk = "May need medical attention"; }
        else if (sys < 120 && dia < 80) { cat = "Normal"; risk = "Low — maintain healthy habits"; }
        else if (sys < 130 && dia < 80) { cat = "Elevated"; risk = "Moderate — lifestyle changes recommended"; }
        else if (sys < 140 || dia < 90) { cat = "High BP Stage 1"; risk = "Moderate-High — consult a doctor"; }
        else if (sys < 180 || dia < 120) { cat = "High BP Stage 2"; risk = "High — medication likely needed"; }
        else { cat = "Hypertensive Crisis"; risk = "Seek emergency medical care"; }
        return { cat, risk }; }, [sys, dia]);
    return (<div className="con-calc"><h3 className="con-calc__title">🩺 Blood Pressure Check</h3><div className="con-calc__inputs">
        <InputField label="Systolic" value={sys} onChange={setSys} unit="mmHg" min={70} max={250} />
        <InputField label="Diastolic" value={dia} onChange={setDia} unit="mmHg" min={40} max={150} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Category" value={r.cat} /><ResultRow label="Risk Level" value={r.risk} /></div></div>);
}

/* 24. VO2 Max */
function Vo2MaxCalc() {
    const [method, setMethod] = useState("cooper"); const [age, setAge] = useState(30);
    const [dist, setDist] = useState(2400); const [time5k, setTime5k] = useState(25);
    const r = useMemo(() => { let vo2: number;
        if (method === "cooper") vo2 = (dist - 504.9) / 44.73;
        else vo2 = 3.5 + 483 / time5k;
        const cat = vo2 >= 55 ? "Superior" : vo2 >= 46 ? "Excellent" : vo2 >= 38 ? "Good" : vo2 >= 30 ? "Fair" : "Poor";
        return { vo2, cat }; }, [method, dist, time5k, age]);
    return (<div className="con-calc"><h3 className="con-calc__title">🫁 VO2 Max Estimator</h3><div className="con-calc__inputs">
        <SelectField label="Method" value={method} onChange={setMethod} options={[{value:"cooper",label:"Cooper Test (12-min run)"},{value:"5k",label:"5K Race Time"}]} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        {method === "cooper" ? <InputField label="Distance in 12 min" value={dist} onChange={setDist} unit="metres" min={800} max={4000} />
            : <InputField label="5K Time" value={time5k} onChange={setTime5k} unit="minutes" min={12} max={60} />}
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Est. VO2 Max" value={fmt(r.vo2)} unit="ml/kg/min" /><ResultRow label="Fitness Level" value={r.cat} /></div></div>);
}

/* 25. Army Body Fat */
function ArmyBodyFatCalc() {
    const [sex, setSex] = useState("male"); const [h, setH] = useState(170); const [waist, setWaist] = useState(85);
    const [neck, setNeck] = useState(38); const [hip, setHip] = useState(100);
    const r = useMemo(() => { let bf: number;
        if (sex === "male") bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
        else bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
        const limit = sex === "male" ? 26 : 36; const pass = bf <= limit;
        return { bf: Math.max(bf, 2), pass, limit }; }, [sex, h, waist, neck, hip]);
    return (<div className="con-calc"><h3 className="con-calc__title">🎖️ Army Body Fat</h3><div className="con-calc__inputs">
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={140} /><InputField label="Waist" value={waist} onChange={setWaist} unit="cm" min={50} />
        <InputField label="Neck" value={neck} onChange={setNeck} unit="cm" min={25} />
        {sex === "female" && <InputField label="Hip" value={hip} onChange={setHip} unit="cm" min={60} />}
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Body Fat" value={`${fmt(r.bf)}%`} /><ResultRow label="Max Allowed" value={`${r.limit}%`} />
        <ResultRow label="Status" value={r.pass ? "✅ Within standard" : "❌ Over limit"} /></div></div>);
}

/* 26. Adjusted Body Weight */
function AdjustedBodyWeightCalc() {
    const [w, setW] = useState(100); const [h, setH] = useState(170); const [sex, setSex] = useState("male"); const [factor, setFactor] = useState(0.4);
    const r = useMemo(() => { const inches = h / 2.54; const over60 = Math.max(inches - 60, 0);
        const ibw = sex === "male" ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
        const abw = ibw + factor * (w - ibw); return { ibw, abw, diff: w - ibw }; }, [w, h, sex, factor]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚖️ Adjusted Body Weight</h3><div className="con-calc__inputs">
        <InputField label="Actual Weight" value={w} onChange={setW} unit="kg" min={30} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={100} max={220} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Adjustment Factor" value={String(factor)} onChange={v => setFactor(Number(v))} options={[{value:"0.25",label:"0.25 (conservative)"},{value:"0.4",label:"0.4 (standard)"},{value:"0.5",label:"0.5 (liberal)"}]} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Ideal Body Weight (Devine)" value={fmt(r.ibw)} unit="kg" />
        <ResultRow label="Adjusted Body Weight" value={fmt(r.abw)} unit="kg" />
        <ResultRow label="Excess Weight" value={fmt(r.diff)} unit="kg" />
    </div></div>);
}

/* 27. Baby Growth Percentile */
function BabyGrowthPercentileCalc() {
    const [sex, setSex] = useState("male"); const [months, setMonths] = useState(12); const [weight, setWeight] = useState(10); const [length, setLength] = useState(75);
    const r = useMemo(() => {
        // Simplified WHO median (50th percentile) weight data for boys/girls 0-24 months
        const medianW_m = [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.7,11.9,12.2];
        const medianW_f = [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.7,8.9,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.9,11.1,11.3,11.5];
        const sdW = sex === "male" ? 1.2 : 1.1;
        const medianW = sex === "male" ? medianW_m : medianW_f;
        const idx = Math.min(Math.max(Math.round(months), 0), 24);
        const zW = (weight - medianW[idx]) / sdW;
        // Simplified WHO median length
        const medianL_m = [49.9,54.7,58.4,61.4,63.9,65.9,67.6,69.2,70.6,72.0,73.3,74.5,75.7,76.9,78.0,79.1,80.2,81.2,82.3,83.2,84.2,85.1,86.0,86.9,87.8];
        const medianL_f = [49.1,53.7,57.1,59.8,62.1,64.0,65.7,67.3,68.7,70.1,71.5,72.8,74.0,75.2,76.4,77.5,78.6,79.7,80.7,81.7,82.7,83.7,84.6,85.5,86.4];
        const sdL = sex === "male" ? 3.0 : 2.9;
        const medianL = sex === "male" ? medianL_m : medianL_f;
        const zL = (length - medianL[idx]) / sdL;
        const pctFromZ = (z: number) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989422802 * Math.exp(-z * z / 2);
            const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
            return z > 0 ? (1 - p) * 100 : p * 100; };
        return { zW, zL, pctW: pctFromZ(zW), pctL: pctFromZ(zL) };
    }, [sex, months, weight, length]);
    return (<div className="con-calc"><h3 className="con-calc__title">👶 Baby Growth Percentile</h3><div className="con-calc__inputs">
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Boy"},{value:"female",label:"Girl"}]} />
        <InputField label="Age" value={months} onChange={setMonths} unit="months" min={0} max={24} />
        <InputField label="Weight" value={weight} onChange={setWeight} unit="kg" min={1} max={25} step={0.1} />
        <InputField label="Length" value={length} onChange={setLength} unit="cm" min={40} max={100} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Weight Z-Score" value={fmt(r.zW, 2)} /><ResultRow label="Weight Percentile" value={`${fmt(r.pctW, 0)}th`} />
        <ResultRow label="Length Z-Score" value={fmt(r.zL, 2)} /><ResultRow label="Length Percentile" value={`${fmt(r.pctL, 0)}th`} />
    </div></div>);
}

/* 28. Body Shape */
function BodyShapeCalc() {
    const [bust, setBust] = useState(90); const [waist, setWaist] = useState(75); const [hip, setHip] = useState(100);
    const r = useMemo(() => {
        const whr = waist / hip; const wbr = waist / bust; const hbr = hip / bust;
        let shape: string;
        if (Math.abs(bust - hip) <= 5 && waist < bust * 0.75) shape = "Hourglass";
        else if (hip > bust * 1.05 && waist < hip * 0.85) shape = "Pear (Triangle)";
        else if (bust > hip * 1.05 && waist >= bust * 0.75) shape = "Apple (Inverted Triangle)";
        else if (Math.abs(bust - hip) <= 10 && waist >= bust * 0.75) shape = "Rectangle";
        else if (waist >= bust && waist >= hip) shape = "Apple (Round)";
        else shape = "Rectangle";
        return { shape, whr, wbr, hbr };
    }, [bust, waist, hip]);
    return (<div className="con-calc"><h3 className="con-calc__title">📐 Body Shape Calculator</h3><div className="con-calc__inputs">
        <InputField label="Bust" value={bust} onChange={setBust} unit="cm" min={50} max={160} />
        <InputField label="Waist" value={waist} onChange={setWaist} unit="cm" min={40} max={150} />
        <InputField label="Hip" value={hip} onChange={setHip} unit="cm" min={50} max={160} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Body Shape" value={r.shape} />
        <ResultRow label="Waist-to-Hip" value={fmt(r.whr, 2)} /><ResultRow label="Waist-to-Bust" value={fmt(r.wbr, 2)} />
        <ResultRow label="Hip-to-Bust" value={fmt(r.hbr, 2)} />
    </div></div>);
}

/* 29. Child & Teen BMI */
function ChildTeenBmiCalc() {
    const [age, setAge] = useState(10); const [sex, setSex] = useState("male"); const [w, setW] = useState(30); const [h, setH] = useState(140);
    const r = useMemo(() => { const hm = h / 100; const bmi = w / (hm * hm);
        // Simplified CDC-based 50th percentile BMI by age (roughly)
        const p50_m = [0,0,16.5,16.0,15.6,15.4,15.4,15.5,15.8,16.1,16.6,17.0,17.5,18.2,19.0,19.8,20.5,21.2,21.8,22.3,22.7];
        const p50_f = [0,0,16.3,15.8,15.4,15.2,15.2,15.4,15.7,16.1,16.6,17.0,17.6,18.3,19.0,19.7,20.3,20.7,21.0,21.2,21.4];
        const p85_m = [0,0,18.4,17.9,17.5,17.3,17.4,17.7,18.1,18.6,19.3,20.0,20.8,21.8,22.8,23.7,24.5,25.3,25.9,26.4,26.9];
        const p85_f = [0,0,18.1,17.6,17.2,17.0,17.1,17.4,17.9,18.5,19.2,20.0,20.8,21.8,22.7,23.5,24.1,24.6,24.9,25.1,25.3];
        const p95_m = [0,0,19.5,19.0,18.5,18.3,18.5,18.9,19.5,20.1,21.0,21.9,22.9,24.0,25.2,26.2,27.1,27.8,28.4,28.9,29.3];
        const p95_f = [0,0,19.3,18.7,18.3,18.1,18.2,18.7,19.3,20.0,20.8,21.7,22.8,23.9,24.9,25.7,26.3,26.7,27.0,27.2,27.4];
        const idx = Math.min(Math.max(Math.round(age), 2), 20);
        const m50 = sex === "male" ? p50_m[idx] : p50_f[idx];
        const m85 = sex === "male" ? p85_m[idx] : p85_f[idx];
        const m95 = sex === "male" ? p95_m[idx] : p95_f[idx];
        let cat: string; let pctApprox: string;
        if (bmi < m50 * 0.85) { cat = "Underweight (<5th)"; pctApprox = "<5th"; }
        else if (bmi < m50) { cat = "Healthy (5th-50th)"; pctApprox = "5th-50th"; }
        else if (bmi < m85) { cat = "Healthy (50th-85th)"; pctApprox = "50th-85th"; }
        else if (bmi < m95) { cat = "Overweight (85th-95th)"; pctApprox = "85th-95th"; }
        else { cat = "Obese (≥95th)"; pctApprox = "≥95th"; }
        return { bmi, cat, pctApprox };
    }, [age, sex, w, h]);
    return (<div className="con-calc"><h3 className="con-calc__title">🧒 Child & Teen BMI</h3><div className="con-calc__inputs">
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={2} max={20} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={5} max={150} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={60} max={200} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="BMI" value={fmt(r.bmi)} /><ResultRow label="Percentile Range" value={r.pctApprox} />
        <ResultRow label="Category" value={r.cat} />
    </div></div>);
}

/* 30. Child Height Percentile */
function ChildHeightPercentileCalc() {
    const [age, setAge] = useState(10); const [sex, setSex] = useState("male"); const [h, setH] = useState(140);
    const r = useMemo(() => {
        // CDC 50th percentile height (cm) ages 2-18 by sex
        const m50 = [0,0,87,95,102,109,115,121,127,132,137,143,149,156,163,170,174,176,177];
        const f50 = [0,0,86,94,101,107,114,120,126,132,138,144,151,157,160,162,163,163,163];
        const sd_m = [0,0,3.5,3.8,4.0,4.2,4.5,4.7,5.0,5.2,5.5,5.8,6.2,6.8,7.2,7.0,6.5,6.2,6.0];
        const sd_f = [0,0,3.5,3.7,3.9,4.1,4.3,4.6,4.9,5.2,5.6,6.0,6.4,6.5,6.4,6.2,6.0,5.8,5.6];
        const idx = Math.min(Math.max(Math.round(age), 2), 18);
        const median = sex === "male" ? m50[idx] : f50[idx];
        const sd = sex === "male" ? sd_m[idx] : sd_f[idx];
        const z = (h - median) / sd;
        const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989422802 * Math.exp(-z * z / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        const pct = z > 0 ? (1 - p) * 100 : p * 100;
        const cat = pct < 5 ? "Very Short (<5th)" : pct < 25 ? "Below Average (5-25th)" : pct < 75 ? "Average (25-75th)" : pct < 95 ? "Above Average (75-95th)" : "Very Tall (>95th)";
        return { z, pct, cat, median };
    }, [age, sex, h]);
    return (<div className="con-calc"><h3 className="con-calc__title">📏 Child Height Percentile</h3><div className="con-calc__inputs">
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={2} max={18} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={60} max={200} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Percentile" value={`${fmt(r.pct, 0)}th`} /><ResultRow label="Z-Score" value={fmt(r.z, 2)} />
        <ResultRow label="Category" value={r.cat} /><ResultRow label="50th Percentile" value={fmt(r.median, 0)} unit="cm" />
    </div></div>);
}

/* 31. Child Weight Percentile */
function ChildWeightPercentileCalc() {
    const [age, setAge] = useState(10); const [sex, setSex] = useState("male"); const [w, setW] = useState(30);
    const r = useMemo(() => {
        const m50 = [0,0,12.5,14.3,16.3,18.4,20.7,22.9,25.3,28.1,31.4,35.3,39.8,44.4,49.4,54.0,58.1,61.6,64.4];
        const f50 = [0,0,12.0,13.9,15.9,17.9,20.0,22.4,25.0,28.1,31.5,35.5,39.5,43.4,47.0,50.0,52.5,54.4,56.2];
        const sd_m = [0,0,1.5,1.7,2.0,2.3,2.6,3.0,3.5,4.0,4.8,5.5,6.5,7.5,8.0,8.5,8.8,9.0,9.0];
        const sd_f = [0,0,1.4,1.6,1.8,2.1,2.4,2.8,3.3,3.9,4.5,5.2,6.0,6.8,7.2,7.5,7.8,8.0,8.0];
        const idx = Math.min(Math.max(Math.round(age), 2), 18);
        const median = sex === "male" ? m50[idx] : f50[idx];
        const sd = sex === "male" ? sd_m[idx] : sd_f[idx];
        const z = (w - median) / sd;
        const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989422802 * Math.exp(-z * z / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        const pct = z > 0 ? (1 - p) * 100 : p * 100;
        const cat = pct < 5 ? "Underweight (<5th)" : pct < 25 ? "Below Average (5-25th)" : pct < 75 ? "Average (25-75th)" : pct < 85 ? "Above Average (75-85th)" : pct < 95 ? "Overweight (85-95th)" : "Obese (>95th)";
        return { z, pct, cat, median };
    }, [age, sex, w]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚖️ Child Weight Percentile</h3><div className="con-calc__inputs">
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={2} max={18} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={5} max={150} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Percentile" value={`${fmt(r.pct, 0)}th`} /><ResultRow label="Z-Score" value={fmt(r.z, 2)} />
        <ResultRow label="Category" value={r.cat} /><ResultRow label="50th Percentile" value={fmt(r.median, 0)} unit="kg" />
    </div></div>);
}

/* 32. Desk Height */
function DeskHeightCalc() {
    const [h, setH] = useState(170);
    const r = useMemo(() => {
        const chairSeat = h * 0.25; const deskH = h * 0.415; const monitorCenter = h * 0.75;
        const keyboardH = deskH - 3; const standingDesk = h * 0.6;
        return { chairSeat, deskH, monitorCenter, keyboardH, standingDesk };
    }, [h]);
    return (<div className="con-calc"><h3 className="con-calc__title">🪑 Desk Height Calculator</h3><div className="con-calc__inputs">
        <InputField label="Your Height" value={h} onChange={setH} unit="cm" min={140} max={210} />
    </div><div className="con-calc__results"><h4>Ergonomic Recommendations</h4>
        <ResultRow label="Chair Seat Height" value={fmt(r.chairSeat, 0)} unit="cm" />
        <ResultRow label="Desk Height (Sitting)" value={fmt(r.deskH, 0)} unit="cm" />
        <ResultRow label="Standing Desk Height" value={fmt(r.standingDesk, 0)} unit="cm" />
        <ResultRow label="Keyboard Height" value={fmt(r.keyboardH, 0)} unit="cm" />
        <ResultRow label="Monitor Center" value={fmt(r.monitorCenter, 0)} unit="cm from floor" />
    </div></div>);
}

/* 33. FFMI */
function FfmiCalc() {
    const [w, setW] = useState(80); const [h, setH] = useState(175); const [bf, setBf] = useState(15);
    const r = useMemo(() => { const hm = h / 100; const fatMass = w * (bf / 100); const lbm = w - fatMass;
        const ffmi = lbm / (hm * hm); const normFfmi = ffmi + 6.1 * (1.8 - hm);
        const cat = normFfmi < 18 ? "Below Average" : normFfmi < 20 ? "Average" : normFfmi < 22 ? "Above Average" : normFfmi < 25 ? "Excellent" : normFfmi < 26 ? "Superior (near natural limit)" : "Exceptional (likely not natural)";
        return { ffmi, normFfmi, lbm, fatMass, cat };
    }, [w, h, bf]);
    return (<div className="con-calc"><h3 className="con-calc__title">💪 FFMI Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} max={200} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={100} max={220} />
        <InputField label="Body Fat" value={bf} onChange={setBf} unit="%" min={3} max={50} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="FFMI" value={fmt(r.ffmi)} /><ResultRow label="Normalized FFMI" value={fmt(r.normFfmi)} />
        <ResultRow label="Lean Body Mass" value={fmt(r.lbm)} unit="kg" />
        <ResultRow label="Fat Mass" value={fmt(r.fatMass)} unit="kg" />
        <ResultRow label="Category" value={r.cat} />
    </div></div>);
}

/* 34. Height Calculator (predict child adult height) */
function HeightCalc() {
    const [fatherH, setFatherH] = useState(175); const [motherH, setMotherH] = useState(162); const [sex, setSex] = useState("male");
    const r = useMemo(() => {
        const mid = sex === "male" ? (fatherH + motherH + 13) / 2 : (fatherH + motherH - 13) / 2;
        return { predicted: mid, lo: mid - 8.5, hi: mid + 8.5 };
    }, [fatherH, motherH, sex]);
    return (<div className="con-calc"><h3 className="con-calc__title">📐 Height Calculator</h3><div className="con-calc__inputs">
        <InputField label="Father's Height" value={fatherH} onChange={setFatherH} unit="cm" min={140} max={220} />
        <InputField label="Mother's Height" value={motherH} onChange={setMotherH} unit="cm" min={130} max={200} />
        <SelectField label="Child's Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Boy"},{value:"female",label:"Girl"}]} />
    </div><div className="con-calc__results"><h4>Predicted Adult Height</h4>
        <ResultRow label="Mid-Parental Height" value={fmt(r.predicted)} unit="cm" />
        <ResultRow label="Likely Range" value={`${fmt(r.lo)} – ${fmt(r.hi)}`} unit="cm" />
        <ResultRow label="In Feet/Inches" value={`${Math.floor(r.predicted / 30.48)}'${Math.round((r.predicted % 30.48) / 2.54)}"`} />
    </div></div>);
}

/* 35. Height Converter */
function HeightConverterCalc() {
    const [cm, setCm] = useState(170);
    const r = useMemo(() => {
        const totalInches = cm / 2.54; const feet = Math.floor(totalInches / 12); const inches = totalInches % 12;
        const metres = cm / 100;
        return { feet, inches, metres, totalInches };
    }, [cm]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔄 Height Converter</h3><div className="con-calc__inputs">
        <InputField label="Height" value={cm} onChange={setCm} unit="cm" min={30} max={280} />
    </div><div className="con-calc__results"><h4>Conversions</h4>
        <ResultRow label="Feet & Inches" value={`${r.feet}'${fmt(r.inches, 1)}"`} />
        <ResultRow label="Metres" value={fmt(r.metres, 2)} unit="m" />
        <ResultRow label="Total Inches" value={fmt(r.totalInches, 1)} unit="in" />
        <ResultRow label="Centimetres" value={fmt(cm, 0)} unit="cm" />
    </div></div>);
}

/* 36. IQ Percentile */
function IqPercentileCalc() {
    const [iq, setIq] = useState(100);
    const r = useMemo(() => {
        const z = (iq - 100) / 15;
        const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989422802 * Math.exp(-z * z / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        const pct = z > 0 ? (1 - p) * 100 : p * 100;
        const rarity = pct >= 50 ? `1 in ${Math.round(100 / (100 - pct))}` : `1 in ${Math.round(100 / pct)}`;
        const cat = iq < 70 ? "Extremely Low" : iq < 80 ? "Borderline" : iq < 90 ? "Low Average" : iq < 110 ? "Average" : iq < 120 ? "High Average" : iq < 130 ? "Superior" : iq < 145 ? "Very Superior" : "Genius/Near-Genius";
        return { pct, cat, z, rarity };
    }, [iq]);
    return (<div className="con-calc"><h3 className="con-calc__title">🧠 IQ Percentile Calculator</h3><div className="con-calc__inputs">
        <InputField label="IQ Score" value={iq} onChange={setIq} min={40} max={200} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Percentile" value={`${fmt(r.pct, 1)}th`} />
        <ResultRow label="Classification" value={r.cat} />
        <ResultRow label="Z-Score" value={fmt(r.z, 2)} />
        <ResultRow label="Rarity" value={r.rarity} />
    </div></div>);
}

/* 37. Waist-to-Height Ratio */
function WaistHeightRatioCalc() {
    const [waist, setWaist] = useState(80); const [h, setH] = useState(170);
    const r = useMemo(() => {
        const ratio = waist / h;
        const cat = ratio < 0.4 ? "Underweight" : ratio < 0.5 ? "Healthy" : ratio < 0.6 ? "Overweight" : "Obese";
        const risk = ratio < 0.4 ? "Low (possible undernutrition)" : ratio < 0.5 ? "Low" : ratio < 0.53 ? "Increased" : ratio < 0.58 ? "High" : "Very High";
        return { ratio, cat, risk };
    }, [waist, h]);
    return (<div className="con-calc"><h3 className="con-calc__title">📏 Waist-to-Height Ratio</h3><div className="con-calc__inputs">
        <InputField label="Waist" value={waist} onChange={setWaist} unit="cm" min={40} max={160} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={100} max={220} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="WHtR" value={fmt(r.ratio, 3)} /><ResultRow label="Category" value={r.cat} />
        <ResultRow label="Health Risk" value={r.risk} />
    </div></div>);
}

/* 38. Weight Loss Percentage */
function WeightLossPctCalc() {
    const [startW, setStartW] = useState(90); const [currentW, setCurrentW] = useState(82);
    const r = useMemo(() => {
        const lost = startW - currentW; const pct = (lost / startW) * 100;
        const bmiStart = startW / (1.7 * 1.7); const bmiNow = currentW / (1.7 * 1.7);
        const milestone5 = startW * 0.95; const milestone10 = startW * 0.90;
        return { lost, pct, bmiStart, bmiNow, milestone5, milestone10 };
    }, [startW, currentW]);
    return (<div className="con-calc"><h3 className="con-calc__title">📉 Weight Loss Percentage</h3><div className="con-calc__inputs">
        <InputField label="Starting Weight" value={startW} onChange={setStartW} unit="kg" min={20} />
        <InputField label="Current Weight" value={currentW} onChange={setCurrentW} unit="kg" min={20} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Weight Lost" value={fmt(r.lost)} unit="kg" />
        <ResultRow label="Percentage Lost" value={`${fmt(r.pct)}%`} />
        <ResultRow label="5% Milestone" value={fmt(r.milestone5)} unit="kg" />
        <ResultRow label="10% Milestone" value={fmt(r.milestone10)} unit="kg" />
    </div></div>);
}

/* 39. Calorie Density */
function CalorieDensityCalc() {
    const [calories, setCalories] = useState(250); const [grams, setGrams] = useState(100);
    const r = useMemo(() => {
        const density = calories / Math.max(grams, 1);
        const cat = density < 0.6 ? "Very Low" : density < 1.5 ? "Low" : density < 4.0 ? "Medium" : "High";
        const tip = density < 0.6 ? "Eat freely — fruits, vegetables, broth" : density < 1.5 ? "Good for weight loss — whole grains, lean meat" : density < 4.0 ? "Eat in moderation — bread, cheese, meat" : "Limit intake — oils, nuts, chocolate, butter";
        return { density, cat, tip };
    }, [calories, grams]);
    return (<div className="con-calc"><h3 className="con-calc__title">🍎 Calorie Density Calculator</h3><div className="con-calc__inputs">
        <InputField label="Calories" value={calories} onChange={setCalories} unit="kcal" min={0} max={2000} />
        <InputField label="Serving Size" value={grams} onChange={setGrams} unit="g" min={1} max={1000} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Calorie Density" value={fmt(r.density, 2)} unit="kcal/g" />
        <ResultRow label="Category" value={r.cat} />
        <ResultRow label="Guidance" value={r.tip} />
    </div></div>);
}

/* 40. Carb Calculator */
function CarbCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate"); const [goal, setGoal] = useState("maintain");
    const r = useMemo(() => {
        const bmr = mifflinBMR(w, h, age, sex); let tdee = bmr * (ACT[act] || 1.55);
        if (goal === "lose") tdee -= 500; else if (goal === "gain") tdee += 500;
        const carbPct = goal === "lose" ? 0.40 : goal === "gain" ? 0.55 : 0.50;
        const carbG = (tdee * carbPct) / 4;
        const lo = (tdee * (carbPct - 0.05)) / 4; const hi = (tdee * (carbPct + 0.05)) / 4;
        return { tdee, carbG, carbPct: carbPct * 100, lo, hi };
    }, [w, h, age, sex, act, goal]);
    return (<div className="con-calc"><h3 className="con-calc__title">🍞 Carb Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
        <SelectField label="Goal" value={goal} onChange={setGoal} options={[{value:"lose",label:"Lose Weight"},{value:"maintain",label:"Maintain"},{value:"gain",label:"Gain Weight"}]} />
    </div><div className="con-calc__results"><h4>Daily Carb Intake ({fmt(r.tdee, 0)} kcal)</h4>
        <ResultRow label="Recommended Carbs" value={fmt(r.carbG, 0)} unit="g/day" />
        <ResultRow label="Carb % of Calories" value={`${fmt(r.carbPct, 0)}%`} />
        <ResultRow label="Range" value={`${fmt(r.lo, 0)} – ${fmt(r.hi, 0)}`} unit="g/day" />
    </div></div>);
}

/* 41. Fat Intake */
function FatIntakeCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate"); const [goal, setGoal] = useState("maintain");
    const r = useMemo(() => {
        const bmr = mifflinBMR(w, h, age, sex); let tdee = bmr * (ACT[act] || 1.55);
        if (goal === "lose") tdee -= 500; else if (goal === "gain") tdee += 500;
        const fatPct = goal === "lose" ? 0.30 : 0.25;
        const fatG = (tdee * fatPct) / 9;
        const lo = (tdee * 0.20) / 9; const hi = (tdee * 0.35) / 9;
        return { tdee, fatG, fatPct: fatPct * 100, lo, hi };
    }, [w, h, age, sex, act, goal]);
    return (<div className="con-calc"><h3 className="con-calc__title">🥑 Fat Intake Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
        <SelectField label="Goal" value={goal} onChange={setGoal} options={[{value:"lose",label:"Lose Weight"},{value:"maintain",label:"Maintain"},{value:"gain",label:"Gain Weight"}]} />
    </div><div className="con-calc__results"><h4>Daily Fat Intake ({fmt(r.tdee, 0)} kcal)</h4>
        <ResultRow label="Recommended Fat" value={fmt(r.fatG, 0)} unit="g/day" />
        <ResultRow label="Fat % of Calories" value={`${fmt(r.fatPct, 0)}%`} />
        <ResultRow label="Healthy Range" value={`${fmt(r.lo, 0)} – ${fmt(r.hi, 0)}`} unit="g/day" />
    </div></div>);
}

/* 42. Harris-Benedict */
function HarrisBenedictCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate");
    const r = useMemo(() => {
        const original = sex === "male" ? 66.5 + 13.75 * w + 5.003 * h - 6.755 * age : 655.1 + 9.563 * w + 1.850 * h - 4.676 * age;
        const revised = sex === "male" ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * age : 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
        const msj = mifflinBMR(w, h, age, sex);
        const actM = ACT[act] || 1.55;
        return { original, revised, msj, tdeeOrig: original * actM, tdeeRev: revised * actM, tdeeMsj: msj * actM };
    }, [w, h, age, sex, act]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔬 Harris-Benedict Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
    </div><div className="con-calc__results"><h4>BMR Comparison</h4>
        <ResultRow label="HB Original (1919)" value={fmt(r.original, 0)} unit="kcal/day" />
        <ResultRow label="HB Revised (1984)" value={fmt(r.revised, 0)} unit="kcal/day" />
        <ResultRow label="Mifflin-St Jeor" value={fmt(r.msj, 0)} unit="kcal/day" />
        <h4>Daily Calories (TDEE)</h4>
        <ResultRow label="HB Original" value={fmt(r.tdeeOrig, 0)} unit="kcal" />
        <ResultRow label="HB Revised" value={fmt(r.tdeeRev, 0)} unit="kcal" />
        <ResultRow label="Mifflin-St Jeor" value={fmt(r.tdeeMsj, 0)} unit="kcal" />
    </div></div>);
}

/* 43. Keto Calculator */
function KetoCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate"); const [deficit, setDeficit] = useState("20");
    const r = useMemo(() => {
        const bmr = mifflinBMR(w, h, age, sex); const tdee = bmr * (ACT[act] || 1.55);
        const target = tdee * (1 - Number(deficit) / 100);
        const carbG = 25; const proteinG = w * 1.5;
        const carbCal = carbG * 4; const proteinCal = proteinG * 4;
        const fatCal = target - carbCal - proteinCal; const fatG = fatCal / 9;
        return { tdee, target, carbG, proteinG, fatG: Math.max(fatG, 0), carbPct: (carbCal / target) * 100, proteinPct: (proteinCal / target) * 100, fatPct: (Math.max(fatCal, 0) / target) * 100 };
    }, [w, h, age, sex, act, deficit]);
    return (<div className="con-calc"><h3 className="con-calc__title">🥓 Keto Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
        <SelectField label="Calorie Deficit" value={deficit} onChange={setDeficit} options={[{value:"0",label:"0% (maintain)"},{value:"10",label:"10% deficit"},{value:"20",label:"20% deficit"},{value:"30",label:"30% deficit"}]} />
    </div><div className="con-calc__results"><h4>Keto Macros ({fmt(r.target, 0)} kcal/day)</h4>
        <ResultRow label="Net Carbs" value={`${fmt(r.carbG, 0)}g (${fmt(r.carbPct, 0)}%)`} />
        <ResultRow label="Protein" value={`${fmt(r.proteinG, 0)}g (${fmt(r.proteinPct, 0)}%)`} />
        <ResultRow label="Fat" value={`${fmt(r.fatG, 0)}g (${fmt(r.fatPct, 0)}%)`} />
        <ResultRow label="TDEE" value={fmt(r.tdee, 0)} unit="kcal" />
    </div></div>);
}

/* 44. Maintenance Calorie */
function MaintenanceCalorieCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate");
    const r = useMemo(() => {
        const bmr = mifflinBMR(w, h, age, sex); const tdee = bmr * (ACT[act] || 1.55);
        return { bmr, tdee, perMeal3: tdee / 3, perMeal5: tdee / 5 };
    }, [w, h, age, sex, act]);
    return (<div className="con-calc"><h3 className="con-calc__title">⚖️ Maintenance Calories</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
    </div><div className="con-calc__results"><h4>Your Maintenance Calories</h4>
        <ResultRow label="Daily Maintenance" value={fmt(r.tdee, 0)} unit="kcal/day" />
        <ResultRow label="BMR" value={fmt(r.bmr, 0)} unit="kcal/day" />
        <ResultRow label="Per Meal (3 meals)" value={fmt(r.perMeal3, 0)} unit="kcal" />
        <ResultRow label="Per Meal (5 meals)" value={fmt(r.perMeal5, 0)} unit="kcal" />
    </div></div>);
}

/* 45. Mifflin-St Jeor */
function MifflinStJeorCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male");
    const r = useMemo(() => {
        const bmr = mifflinBMR(w, h, age, sex);
        return Object.entries(ACT).map(([k, m]) => ({ level: k.replace("_", " "), tdee: bmr * m })).concat([{ level: "BMR (at rest)", tdee: bmr }]).reverse();
    }, [w, h, age, sex]);
    const bmr = r[0].tdee;
    return (<div className="con-calc"><h3 className="con-calc__title">🧪 Mifflin-St Jeor Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
    </div><div className="con-calc__results"><h4>Mifflin-St Jeor BMR: {fmt(bmr, 0)} kcal/day</h4>
        {r.map(x => <ResultRow key={x.level} label={x.level} value={fmt(x.tdee, 0)} unit="kcal/day" />)}
    </div></div>);
}

/* 46. Net Carb */
function NetCarbCalc() {
    const [totalCarbs, setTotalCarbs] = useState(30); const [fiber, setFiber] = useState(5); const [sugarAlcohols, setSugarAlcohols] = useState(0);
    const r = useMemo(() => {
        const netCarbs = Math.max(totalCarbs - fiber - sugarAlcohols * 0.5, 0);
        const ketoOk = netCarbs <= 20 ? "Yes — strict keto" : netCarbs <= 50 ? "Maybe — liberal keto" : "No — too many net carbs";
        return { netCarbs, ketoOk, calories: netCarbs * 4 };
    }, [totalCarbs, fiber, sugarAlcohols]);
    return (<div className="con-calc"><h3 className="con-calc__title">🧮 Net Carb Calculator</h3><div className="con-calc__inputs">
        <InputField label="Total Carbs" value={totalCarbs} onChange={setTotalCarbs} unit="g" min={0} max={200} />
        <InputField label="Fiber" value={fiber} onChange={setFiber} unit="g" min={0} max={100} />
        <InputField label="Sugar Alcohols" value={sugarAlcohols} onChange={setSugarAlcohols} unit="g" min={0} max={50} />
    </div><div className="con-calc__results"><h4>Results</h4>
        <ResultRow label="Net Carbs" value={fmt(r.netCarbs, 0)} unit="g" />
        <ResultRow label="Calories from Net Carbs" value={fmt(r.calories, 0)} unit="kcal" />
        <ResultRow label="Keto-Friendly?" value={r.ketoOk} />
    </div></div>);
}

/* 47. RMR */
function RmrCalc() {
    const [w, setW] = useState(70); const [h, setH] = useState(170); const [age, setAge] = useState(30); const [sex, setSex] = useState("male");
    const r = useMemo(() => {
        const msj = mifflinBMR(w, h, age, sex);
        const rmr = msj * 1.1; // RMR is ~10% higher than BMR
        const hb = sex === "male" ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * age : 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
        const rmrHB = hb * 1.1;
        return { msj, rmr, hb, rmrHB };
    }, [w, h, age, sex]);
    return (<div className="con-calc"><h3 className="con-calc__title">🔥 RMR Calculator</h3><div className="con-calc__inputs">
        <InputField label="Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Height" value={h} onChange={setH} unit="cm" min={100} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
    </div><div className="con-calc__results"><h4>Resting Metabolic Rate</h4>
        <ResultRow label="RMR (Mifflin-based)" value={fmt(r.rmr, 0)} unit="kcal/day" />
        <ResultRow label="RMR (Harris-Benedict)" value={fmt(r.rmrHB, 0)} unit="kcal/day" />
        <ResultRow label="BMR (Mifflin)" value={fmt(r.msj, 0)} unit="kcal/day" />
        <ResultRow label="BMR (Harris-Benedict)" value={fmt(r.hb, 0)} unit="kcal/day" />
    </div></div>);
}

/* 48. Weight Gain */
function WeightGainCalc() {
    const [w, setW] = useState(60); const [h, setH] = useState(170); const [age, setAge] = useState(25);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate"); const [goalW, setGoalW] = useState(70);
    const r = useMemo(() => {
        const bmr = mifflinBMR(w, h, age, sex); const tdee = bmr * (ACT[act] || 1.55);
        const toGain = goalW - w; const surplus = 500;
        const dailyCal = tdee + surplus; const weeks = (toGain * 7700) / (surplus * 7);
        const protein = goalW * 2; const fat = dailyCal * 0.25 / 9; const carbs = (dailyCal - protein * 4 - fat * 9) / 4;
        return { tdee, dailyCal, surplus, toGain, weeks, protein, fat, carbs: Math.max(carbs, 0) };
    }, [w, h, age, sex, act, goalW]);
    return (<div className="con-calc"><h3 className="con-calc__title">📈 Weight Gain Calculator</h3><div className="con-calc__inputs">
        <InputField label="Current Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Goal Weight" value={goalW} onChange={setGoalW} unit="kg" min={30} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={100} /><InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
    </div><div className="con-calc__results"><h4>Weight Gain Plan</h4>
        <ResultRow label="Daily Calories" value={fmt(r.dailyCal, 0)} unit="kcal" />
        <ResultRow label="Surplus" value={`+${fmt(r.surplus, 0)}`} unit="kcal/day" />
        <ResultRow label="To Gain" value={fmt(r.toGain)} unit="kg" />
        <ResultRow label="Est. Timeline" value={fmt(r.weeks, 0)} unit="weeks" />
        <h4>Suggested Macros</h4>
        <ResultRow label="Protein" value={fmt(r.protein, 0)} unit="g" /><ResultRow label="Carbs" value={fmt(r.carbs, 0)} unit="g" />
        <ResultRow label="Fat" value={fmt(r.fat, 0)} unit="g" />
    </div></div>);
}

/* 49. Weight Loss */
function WeightLossCalc() {
    const [w, setW] = useState(90); const [h, setH] = useState(170); const [age, setAge] = useState(30);
    const [sex, setSex] = useState("male"); const [act, setAct] = useState("moderate"); const [goalW, setGoalW] = useState(75);
    const r = useMemo(() => {
        const bmr = mifflinBMR(w, h, age, sex); const tdee = bmr * (ACT[act] || 1.55);
        const toLose = w - goalW; const deficit = 500;
        const dailyCal = Math.max(tdee - deficit, sex === "male" ? 1500 : 1200);
        const actualDeficit = tdee - dailyCal;
        const weeks = (toLose * 7700) / (actualDeficit * 7);
        const protein = w * 1.8; const fat = dailyCal * 0.25 / 9; const carbs = (dailyCal - protein * 4 - fat * 9) / 4;
        return { tdee, dailyCal, actualDeficit, toLose, weeks, protein, fat, carbs: Math.max(carbs, 0) };
    }, [w, h, age, sex, act, goalW]);
    return (<div className="con-calc"><h3 className="con-calc__title">📉 Weight Loss Calculator</h3><div className="con-calc__inputs">
        <InputField label="Current Weight" value={w} onChange={setW} unit="kg" min={30} /><InputField label="Goal Weight" value={goalW} onChange={setGoalW} unit="kg" min={30} />
        <InputField label="Height" value={h} onChange={setH} unit="cm" min={100} /><InputField label="Age" value={age} onChange={setAge} unit="years" min={15} max={80} />
        <SelectField label="Sex" value={sex} onChange={setSex} options={[{value:"male",label:"Male"},{value:"female",label:"Female"}]} />
        <SelectField label="Activity" value={act} onChange={setAct} options={[{value:"sedentary",label:"Sedentary"},{value:"light",label:"Light"},{value:"moderate",label:"Moderate"},{value:"active",label:"Active"},{value:"very_active",label:"Very Active"}]} />
    </div><div className="con-calc__results"><h4>Weight Loss Plan</h4>
        <ResultRow label="Daily Calories" value={fmt(r.dailyCal, 0)} unit="kcal" />
        <ResultRow label="Daily Deficit" value={`-${fmt(r.actualDeficit, 0)}`} unit="kcal" />
        <ResultRow label="To Lose" value={fmt(r.toLose)} unit="kg" />
        <ResultRow label="Est. Timeline" value={fmt(r.weeks, 0)} unit="weeks" />
        <h4>Suggested Macros</h4>
        <ResultRow label="Protein" value={fmt(r.protein, 0)} unit="g" /><ResultRow label="Carbs" value={fmt(r.carbs, 0)} unit="g" />
        <ResultRow label="Fat" value={fmt(r.fat, 0)} unit="g" />
    </div></div>);
}

/* ──── DISPATCHER ──── */
const CALC_MAP: Record<string, React.FC> = {
    "bmi": BmiCalc, "calorie": CalorieCalc, "tdee": TdeeCalc, "bmr": BmrCalc,
    "body-fat": BodyFatCalc, "ideal-weight": IdealWeightCalc, "macro": MacroCalc,
    "water-intake": WaterIntakeCalc, "pregnancy-due-date": PregnancyDueDateCalc,
    "ovulation": OvulationCalc, "heart-rate-zone": HeartRateZoneCalc, "bsa": BsaCalc,
    "lean-body-mass": LeanBodyMassCalc, "waist-hip-ratio": WaistHipCalc,
    "protein-intake": ProteinIntakeCalc, "calories-burned": CaloriesBurnedCalc,
    "sleep": SleepCalc, "bac": BacCalc, "pace": PaceCalc, "one-rep-max": OneRepMaxCalc,
    "body-recomp": BodyRecompCalc, "glycemic-index": GlycemicIndexCalc,
    "blood-pressure": BloodPressureCalc, "vo2-max": Vo2MaxCalc, "army-body-fat": ArmyBodyFatCalc,
    "adjusted-body-weight": AdjustedBodyWeightCalc, "baby-growth-percentile": BabyGrowthPercentileCalc,
    "body-shape": BodyShapeCalc, "child-teen-bmi": ChildTeenBmiCalc,
    "child-height-percentile": ChildHeightPercentileCalc, "child-weight-percentile": ChildWeightPercentileCalc,
    "desk-height": DeskHeightCalc, "ffmi": FfmiCalc, "height": HeightCalc,
    "height-converter": HeightConverterCalc, "iq-percentile": IqPercentileCalc,
    "waist-height-ratio": WaistHeightRatioCalc, "weight-loss-pct": WeightLossPctCalc,
    "calorie-density": CalorieDensityCalc, "carb": CarbCalc, "fat-intake": FatIntakeCalc,
    "harris-benedict": HarrisBenedictCalc, "keto": KetoCalc, "maintenance-calorie": MaintenanceCalorieCalc,
    "mifflin-st-jeor": MifflinStJeorCalc, "net-carb": NetCarbCalc, "rmr": RmrCalc,
    "weight-gain": WeightGainCalc, "weight-loss": WeightLossCalc,
};

export default function HealthCalculatorCore({ calcType }: { calcType: string }) {
    const C = CALC_MAP[calcType];
    if (!C) return <p>Calculator not found: {calcType}</p>;
    return <C />;
}
