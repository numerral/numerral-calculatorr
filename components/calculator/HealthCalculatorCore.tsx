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
};

export default function HealthCalculatorCore({ calcType }: { calcType: string }) {
    const C = CALC_MAP[calcType];
    if (!C) return <p>Calculator not found: {calcType}</p>;
    return <C />;
}
