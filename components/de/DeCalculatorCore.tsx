"use client";
import { useState, useMemo } from "react";
import * as C from "@/lib/calculators/de";

/* ─── Shared helpers ─── */
const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="calc-field"><label className="calc-field__label">{label}</label>{children}</div>
);
const R = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
        <p className="calc-field__label">{label}</p>
        <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)" }}>{value}</p>
        {sub && <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{sub}</p>}
    </div>
);
const Grid = ({ cols, children }: { cols: number; children: React.ReactNode }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: "var(--s-3)", marginTop: "var(--s-3)" }}>{children}</div>
);
const Stat = ({ l, v }: { l: string; v: string | number }) => (
    <div><p className="calc-field__label">{l}</p><p style={{ fontWeight: 700 }}>{v}</p></div>
);

/* ─── 1. BMI ─── */
function BMI() {
    const [w, setW] = useState(75); const [h, setH] = useState(175);
    const r = useMemo(() => C.calculateBMI(w, h), [w, h]);
    return <div className="calc-card"><F label="⚖️ GEWICHT (KG)"><input type="number" className="calc-field__input" value={w} onChange={e => setW(+e.target.value)} /></F><F label="📏 GRÖSSE (CM)"><input type="number" className="calc-field__input" value={h} onChange={e => setH(+e.target.value)} /></F><R label="BMI" value={`${r.bmi}`} sub={`${r.category} • Idealbereich: ${r.idealMin}–${r.idealMax} kg`} /></div>;
}

/* ─── 2. Kalorien ─── */
function Kalorien() {
    const [w, setW] = useState(75); const [h, setH] = useState(175); const [a, setA] = useState(30);
    const [g, setG] = useState<"m"|"f">("m"); const [act, setAct] = useState(1.55);
    const r = useMemo(() => C.calculateCalories(w, h, a, g, act), [w, h, a, g, act]);
    return <div className="calc-card">
        <F label="⚖️ GEWICHT (KG)"><input type="number" className="calc-field__input" value={w} onChange={e => setW(+e.target.value)} /></F>
        <F label="📏 GRÖSSE (CM)"><input type="number" className="calc-field__input" value={h} onChange={e => setH(+e.target.value)} /></F>
        <F label="🎂 ALTER"><input type="number" className="calc-field__input" value={a} onChange={e => setA(+e.target.value)} /></F>
        <F label="👤 GESCHLECHT"><div className="tax-toggle"><button className={`tax-toggle__btn${g==="m"?" active":""}`} onClick={()=>setG("m")}>♂ Mann</button><button className={`tax-toggle__btn${g==="f"?" active":""}`} onClick={()=>setG("f")}>♀ Frau</button></div></F>
        <F label="🏃 AKTIVITÄT"><select className="calc-field__input" value={act} onChange={e=>setAct(+e.target.value)}><option value={1.2}>Kaum aktiv</option><option value={1.375}>Leicht aktiv</option><option value={1.55}>Moderat aktiv</option><option value={1.725}>Sehr aktiv</option><option value={1.9}>Extrem aktiv</option></select></F>
        <R label="TÄGLICHER KALORIENBEDARF" value={`${r.tdee} kcal`} />
        <Grid cols={3}><Stat l="GRUNDUMSATZ" v={`${r.bmr} kcal`} /><Stat l="ABNEHMEN" v={`${r.weightLoss} kcal`} /><Stat l="ZUNEHMEN" v={`${r.weightGain} kcal`} /></Grid>
    </div>;
}

/* ─── 3. Herzfrequenz ─── */
function Herzfrequenz() {
    const [age, setAge] = useState(30); const [rest, setRest] = useState(65);
    const r = useMemo(() => C.calculateHeartRate(age, rest), [age, rest]);
    return <div className="calc-card">
        <F label="🎂 ALTER"><input type="number" className="calc-field__input" value={age} onChange={e => setAge(+e.target.value)} /></F>
        <F label="❤️ RUHEPULS (BPM)"><input type="number" className="calc-field__input" value={rest} onChange={e => setRest(+e.target.value)} /></F>
        <R label="MAX. HERZFREQUENZ" value={`${r.maxHR} bpm`} />
        <table className="calc-table" style={{marginTop:"var(--s-3)"}}><thead><tr><th>Zone</th><th>Bereich</th><th>Beschreibung</th></tr></thead><tbody>{r.zones.map(z=><tr key={z.name}><td style={{fontWeight:700}}>{z.name}</td><td>{z.min}–{z.max} bpm</td><td>{z.desc}</td></tr>)}</tbody></table>
    </div>;
}

/* ─── 4. Idealgewicht ─── */
function Idealgewicht() {
    const [h, setH] = useState(175); const [g, setG] = useState<"m"|"f">("m");
    const r = useMemo(() => C.calculateIdealWeight(h, g), [h, g]);
    return <div className="calc-card">
        <F label="📏 GRÖSSE (CM)"><input type="number" className="calc-field__input" value={h} onChange={e => setH(+e.target.value)} /></F>
        <F label="👤 GESCHLECHT"><div className="tax-toggle"><button className={`tax-toggle__btn${g==="m"?" active":""}`} onClick={()=>setG("m")}>♂ Mann</button><button className={`tax-toggle__btn${g==="f"?" active":""}`} onClick={()=>setG("f")}>♀ Frau</button></div></F>
        <R label="IDEALGEWICHT (DURCHSCHNITT)" value={`${r.average} kg`} />
        <Grid cols={4}><Stat l="ROBINSON" v={`${r.robinson} kg`} /><Stat l="MILLER" v={`${r.miller} kg`} /><Stat l="HAMWI" v={`${r.hamwi} kg`} /><Stat l="DEVINE" v={`${r.devine} kg`} /></Grid>
    </div>;
}

/* ─── 5. Körperfett ─── */
function Koerperfett() {
    const [waist, setWaist] = useState(85); const [neck, setNeck] = useState(38); const [h, setH] = useState(180); const [hip, setHip] = useState(95);
    const [g, setG] = useState<"m"|"f">("m");
    const r = useMemo(() => C.calculateBodyFat(waist, neck, h, hip, g), [waist, neck, h, hip, g]);
    return <div className="calc-card">
        <F label="👤 GESCHLECHT"><div className="tax-toggle"><button className={`tax-toggle__btn${g==="m"?" active":""}`} onClick={()=>setG("m")}>♂ Mann</button><button className={`tax-toggle__btn${g==="f"?" active":""}`} onClick={()=>setG("f")}>♀ Frau</button></div></F>
        <F label="📏 TAILLENUMFANG (CM)"><input type="number" className="calc-field__input" value={waist} onChange={e => setWaist(+e.target.value)} /></F>
        <F label="📏 HALSUMFANG (CM)"><input type="number" className="calc-field__input" value={neck} onChange={e => setNeck(+e.target.value)} /></F>
        <F label="📏 GRÖSSE (CM)"><input type="number" className="calc-field__input" value={h} onChange={e => setH(+e.target.value)} /></F>
        {g==="f"&&<F label="📏 HÜFTUMFANG (CM)"><input type="number" className="calc-field__input" value={hip} onChange={e => setHip(+e.target.value)} /></F>}
        <R label="KÖRPERFETTANTEIL" value={`${r.bodyFatPercent}%`} sub={r.category} />
    </div>;
}

/* ─── 6. Prozent ─── */
function Prozent() {
    const [v, setV] = useState(200); const [p, setP] = useState(15); const [mode, setMode] = useState<"of"|"increase"|"decrease"|"isWhat">("of");
    const r = useMemo(() => C.calculatePercent(v, p, mode), [v, p, mode]);
    return <div className="calc-card">
        <F label="⚙️ MODUS"><div className="tax-toggle"><button className={`tax-toggle__btn${mode==="of"?" active":""}`} onClick={()=>setMode("of")}>X% von Y</button><button className={`tax-toggle__btn${mode==="increase"?" active":""}`} onClick={()=>setMode("increase")}>+X%</button><button className={`tax-toggle__btn${mode==="decrease"?" active":""}`} onClick={()=>setMode("decrease")}>−X%</button><button className={`tax-toggle__btn${mode==="isWhat"?" active":""}`} onClick={()=>setMode("isWhat")}>X ist ?% von Y</button></div></F>
        <F label="WERT"><input type="number" className="calc-field__input" value={v} onChange={e => setV(+e.target.value)} /></F>
        <F label="PROZENT / ZWEITER WERT"><input type="number" className="calc-field__input" value={p} onChange={e => setP(+e.target.value)} /></F>
        <R label="ERGEBNIS" value={`${r.result}`} sub={r.formula} />
    </div>;
}

/* ─── 7. Dreisatz ─── */
function Dreisatz() {
    const [a, setA] = useState(3); const [b, setB] = useState(2.4); const [c, setC] = useState(5);
    const r = useMemo(() => C.calculateRuleOfThree(a, b, c), [a, b, c]);
    return <div className="calc-card">
        <F label="A (BEKANNTE MENGE)"><input type="number" className="calc-field__input" value={a} onChange={e => setA(+e.target.value)} /></F>
        <F label="B (BEKANNTER WERT)"><input type="number" className="calc-field__input" value={b} onChange={e => setB(+e.target.value)} /></F>
        <F label="C (GESUCHTE MENGE)"><input type="number" className="calc-field__input" value={c} onChange={e => setC(+e.target.value)} /></F>
        <R label="ERGEBNIS X" value={`${r.result}`} sub={r.formula} />
    </div>;
}

/* ─── 8. Bruch ─── */
function Bruch() {
    const [n1,setN1]=useState(3);const [d1,setD1]=useState(4);const [n2,setN2]=useState(1);const [d2,setD2]=useState(6);
    const [op,setOp]=useState<"+"|"-"|"×"|"÷">("+");
    const r = useMemo(() => C.addFractions(n1, d1, n2, d2, op), [n1, d1, n2, d2, op]);
    return <div className="calc-card">
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}><input type="number" className="calc-field__input" style={{flex:1}} value={n1} onChange={e=>setN1(+e.target.value)} /><span>/</span><input type="number" className="calc-field__input" style={{flex:1}} value={d1} onChange={e=>setD1(+e.target.value)} /></div>
        <F label="OPERATION"><div className="tax-toggle">{(["+","-","×","÷"] as const).map(o=><button key={o} className={`tax-toggle__btn${op===o?" active":""}`} onClick={()=>setOp(o)}>{o}</button>)}</div></F>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}><input type="number" className="calc-field__input" style={{flex:1}} value={n2} onChange={e=>setN2(+e.target.value)} /><span>/</span><input type="number" className="calc-field__input" style={{flex:1}} value={d2} onChange={e=>setD2(+e.target.value)} /></div>
        <R label="ERGEBNIS" value={r.simplified} sub={`Dezimal: ${r.decimal}`} />
    </div>;
}

/* ─── 9. GGT/KGV ─── */
function GGTKGV() {
    const [a, setA] = useState(12); const [b, setB] = useState(18);
    const r = useMemo(() => C.calculateGCDLCM(a, b), [a, b]);
    return <div className="calc-card">
        <F label="ERSTE ZAHL"><input type="number" className="calc-field__input" value={a} onChange={e=>setA(+e.target.value)} /></F>
        <F label="ZWEITE ZAHL"><input type="number" className="calc-field__input" value={b} onChange={e=>setB(+e.target.value)} /></F>
        <Grid cols={2}><R label="GGT" value={`${r.gcdVal}`} /><R label="KGV" value={`${r.lcmVal}`} /></Grid>
    </div>;
}

/* ─── 10. Fläche ─── */
function Flaeche() {
    const [shape, setShape] = useState<"rect"|"circle"|"triangle">("rect"); const [a, setA] = useState(5); const [b, setB] = useState(3);
    const r = useMemo(() => C.calculateArea(shape, a, b), [shape, a, b]);
    return <div className="calc-card">
        <F label="FORM"><div className="tax-toggle"><button className={`tax-toggle__btn${shape==="rect"?" active":""}`} onClick={()=>setShape("rect")}>Rechteck</button><button className={`tax-toggle__btn${shape==="circle"?" active":""}`} onClick={()=>setShape("circle")}>Kreis</button><button className={`tax-toggle__btn${shape==="triangle"?" active":""}`} onClick={()=>setShape("triangle")}>Dreieck</button></div></F>
        <F label={shape==="circle"?"RADIUS (M)":"SEITE A (M)"}><input type="number" className="calc-field__input" value={a} onChange={e=>setA(+e.target.value)} /></F>
        {shape!=="circle"&&<F label={shape==="triangle"?"HÖHE (M)":"SEITE B (M)"}><input type="number" className="calc-field__input" value={b} onChange={e=>setB(+e.target.value)} /></F>}
        <R label="FLÄCHE" value={`${r.area} m²`} sub={r.formula} />
    </div>;
}

/* ─── 11. Zins ─── */
function Zins() {
    const [k, setK] = useState(10000); const [z, setZ] = useState(5); const [j, setJ] = useState(10);
    const r = useMemo(() => C.calculateZins(k, z, j), [k, z, j]);
    return <div className="calc-card">
        <F label="💰 STARTKAPITAL (€)"><input type="number" className="calc-field__input" value={k} onChange={e=>setK(+e.target.value)} /></F>
        <F label="📈 ZINSSATZ (%)"><input type="number" className="calc-field__input" step={0.1} value={z} onChange={e=>setZ(+e.target.value)} /></F>
        <F label="📅 LAUFZEIT (JAHRE)"><input type="number" className="calc-field__input" value={j} onChange={e=>setJ(+e.target.value)} /></F>
        <R label="ENDKAPITAL" value={`${r.endBetrag.toLocaleString("de-DE")} €`} sub={`Zinsertrag: ${r.zinsBetrag.toLocaleString("de-DE")} €`} />
    </div>;
}

/* ─── 12. Kredit ─── */
function Kredit() {
    const [b, setB] = useState(20000); const [z, setZ] = useState(4.5); const [m, setM] = useState(48);
    const r = useMemo(() => C.calculateKredit(b, z, m), [b, z, m]);
    return <div className="calc-card">
        <F label="💰 KREDITBETRAG (€)"><input type="number" className="calc-field__input" value={b} onChange={e=>setB(+e.target.value)} /></F>
        <F label="📈 ZINSSATZ (%)"><input type="number" className="calc-field__input" step={0.1} value={z} onChange={e=>setZ(+e.target.value)} /></F>
        <F label="📅 LAUFZEIT (MONATE)"><input type="number" className="calc-field__input" value={m} onChange={e=>setM(+e.target.value)} /></F>
        <R label="MONATLICHE RATE" value={`${r.monatsRate.toLocaleString("de-DE")} €`} />
        <Grid cols={2}><Stat l="GESAMTKOSTEN" v={`${r.gesamtKosten.toLocaleString("de-DE")} €`} /><Stat l="GESAMTZINSEN" v={`${r.gesamtZinsen.toLocaleString("de-DE")} €`} /></Grid>
    </div>;
}

/* ─── 13. Sparen ─── */
function Sparen() {
    const [s, setS] = useState(1000); const [m, setM] = useState(100); const [z, setZ] = useState(5); const [j, setJ] = useState(20);
    const r = useMemo(() => C.calculateSparen(s, m, z, j), [s, m, z, j]);
    return <div className="calc-card">
        <F label="💰 STARTKAPITAL (€)"><input type="number" className="calc-field__input" value={s} onChange={e=>setS(+e.target.value)} /></F>
        <F label="📅 MONATLICHE SPARRATE (€)"><input type="number" className="calc-field__input" value={m} onChange={e=>setM(+e.target.value)} /></F>
        <F label="📈 ZINSSATZ (%)"><input type="number" className="calc-field__input" step={0.1} value={z} onChange={e=>setZ(+e.target.value)} /></F>
        <F label="📅 LAUFZEIT (JAHRE)"><input type="number" className="calc-field__input" value={j} onChange={e=>setJ(+e.target.value)} /></F>
        <R label="ENDKAPITAL" value={`${r.endBetrag.toLocaleString("de-DE")} €`} />
        <Grid cols={2}><Stat l="EINZAHLUNGEN" v={`${r.einzahlungen.toLocaleString("de-DE")} €`} /><Stat l="ZINSEN GESAMT" v={`${r.zinsenGesamt.toLocaleString("de-DE")} €`} /></Grid>
    </div>;
}

/* ─── 14. Inflation ─── */
function Inflation() {
    const [b, setB] = useState(1000); const [i, setI] = useState(3); const [j, setJ] = useState(10); const [n, setN] = useState(2);
    const r = useMemo(() => C.calculateInflation(b, i, j, n), [b, i, j, n]);
    return <div className="calc-card">
        <F label="💰 BETRAG (€)"><input type="number" className="calc-field__input" value={b} onChange={e=>setB(+e.target.value)} /></F>
        <F label="📉 INFLATIONSRATE (%)"><input type="number" className="calc-field__input" step={0.1} value={i} onChange={e=>setI(+e.target.value)} /></F>
        <F label="📅 ZEITRAUM (JAHRE)"><input type="number" className="calc-field__input" value={j} onChange={e=>setJ(+e.target.value)} /></F>
        <F label="📈 NOMINALZINS (%)"><input type="number" className="calc-field__input" step={0.1} value={n} onChange={e=>setN(+e.target.value)} /></F>
        <R label="REALER WERT" value={`${r.realWert.toLocaleString("de-DE")} €`} sub={`Kaufkraftverlust: ${r.kaufkraftVerlust.toLocaleString("de-DE")} € • Realer Zins: ${r.realerZins}%`} />
    </div>;
}

/* ─── 15. Tilgung ─── */
function Tilgung() {
    const [b, setB] = useState(300000); const [z, setZ] = useState(3.5); const [t, setT] = useState(2); const [j, setJ] = useState(10);
    const r = useMemo(() => C.calculateTilgung(b, z, t, j), [b, z, t, j]);
    return <div className="calc-card">
        <F label="💰 DARLEHENSBETRAG (€)"><input type="number" className="calc-field__input" value={b} onChange={e=>setB(+e.target.value)} /></F>
        <F label="📈 ZINSSATZ (%)"><input type="number" className="calc-field__input" step={0.1} value={z} onChange={e=>setZ(+e.target.value)} /></F>
        <F label="📈 ANFÄNGLICHE TILGUNG (%)"><input type="number" className="calc-field__input" step={0.5} value={t} onChange={e=>setT(+e.target.value)} /></F>
        <F label="📅 ANZEIGE (JAHRE)"><input type="number" className="calc-field__input" value={j} onChange={e=>setJ(+e.target.value)} /></F>
        <R label="MONATLICHE RATE" value={`${r.monatsRate.toLocaleString("de-DE")} €`} sub={`Restschuld nach ${j} Jahren: ${(r.restschuld[r.restschuld.length-1]||0).toLocaleString("de-DE")} €`} />
    </div>;
}

/* ─── 16. Geschwindigkeit ─── */
function Geschwindigkeit() {
    const [d, setD] = useState(100); const [t, setT] = useState(1.5); const [mode, setMode] = useState<"speed"|"time"|"distance">("speed");
    const r = useMemo(() => C.calculateSpeed(d, t, mode), [d, t, mode]);
    return <div className="calc-card">
        <F label="⚙️ BERECHNEN"><div className="tax-toggle"><button className={`tax-toggle__btn${mode==="speed"?" active":""}`} onClick={()=>setMode("speed")}>v = s/t</button><button className={`tax-toggle__btn${mode==="distance"?" active":""}`} onClick={()=>setMode("distance")}>s = v×t</button><button className={`tax-toggle__btn${mode==="time"?" active":""}`} onClick={()=>setMode("time")}>t = s/v</button></div></F>
        <F label="WERT 1"><input type="number" className="calc-field__input" value={d} onChange={e=>setD(+e.target.value)} /></F>
        <F label="WERT 2"><input type="number" className="calc-field__input" value={t} onChange={e=>setT(+e.target.value)} /></F>
        <R label="ERGEBNIS" value={mode==="speed"?`${r.speed} km/h`:mode==="distance"?`${r.distance} km`:`${r.time} h`} />
    </div>;
}

/* ─── 17. Kraft ─── */
function Kraft() {
    const [m, setM] = useState(10); const [a, setA] = useState(9.81);
    const r = useMemo(() => C.calculateForce(m, a), [m, a]);
    return <div className="calc-card">
        <F label="⚖️ MASSE (KG)"><input type="number" className="calc-field__input" value={m} onChange={e=>setM(+e.target.value)} /></F>
        <F label="🚀 BESCHLEUNIGUNG (M/S²)"><input type="number" className="calc-field__input" step={0.01} value={a} onChange={e=>setA(+e.target.value)} /></F>
        <R label="KRAFT" value={`${r.force} N`} sub={r.formula} />
    </div>;
}

/* ─── 18. Dichte ─── */
function Dichte() {
    const [m, setM] = useState(5); const [v, setV] = useState(0.002);
    const r = useMemo(() => C.calculateDensity(m, v), [m, v]);
    return <div className="calc-card">
        <F label="⚖️ MASSE (KG)"><input type="number" className="calc-field__input" value={m} onChange={e=>setM(+e.target.value)} /></F>
        <F label="📦 VOLUMEN (M³)"><input type="number" className="calc-field__input" step={0.001} value={v} onChange={e=>setV(+e.target.value)} /></F>
        <R label="DICHTE" value={`${r.density} kg/m³`} sub={r.formula} />
    </div>;
}

/* ─── 19. Ohm ─── */
function Ohm() {
    const [v, setV] = useState(12); const [r2, setR2] = useState(100);
    const r = useMemo(() => C.calculateOhm("I", v, r2), [v, r2]);
    return <div className="calc-card">
        <F label="⚡ SPANNUNG (V)"><input type="number" className="calc-field__input" value={v} onChange={e=>setV(+e.target.value)} /></F>
        <F label="Ω WIDERSTAND (OHM)"><input type="number" className="calc-field__input" value={r2} onChange={e=>setR2(+e.target.value)} /></F>
        <R label="STROM" value={`${r.current} A`} sub={`Leistung: ${r.power} W`} />
    </div>;
}

/* ─── 20. Energie ─── */
function Energie() {
    const [v, setV] = useState(1000); const [f, setF] = useState<"kcal">("kcal");
    const r = useMemo(() => C.convertEnergy(v, f), [v, f]);
    return <div className="calc-card">
        <F label="WERT"><input type="number" className="calc-field__input" value={v} onChange={e=>setV(+e.target.value)} /></F>
        <F label="EINHEIT"><select className="calc-field__input" value={f} onChange={e=>setF(e.target.value as any)}><option value="J">Joule</option><option value="kJ">Kilojoule</option><option value="cal">Kalorien</option><option value="kcal">Kilokalorien</option><option value="kWh">Kilowattstunden</option></select></F>
        <table className="calc-table" style={{marginTop:"var(--s-3)"}}><thead><tr><th>Einheit</th><th>Wert</th></tr></thead><tbody>{r.map(e=><tr key={e.to}><td style={{fontWeight:700}}>{e.to}</td><td>{e.value.toLocaleString("de-DE")}</td></tr>)}</tbody></table>
    </div>;
}

/* ─── Stat input helper ─── */
function useStatValues(def: string = "3, 7, 5, 9, 6") {
    const [text, setText] = useState(def);
    const values = useMemo(() => text.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n)), [text]);
    return { text, setText, values };
}

/* ─── 21. Mittelwert ─── */
function Mittelwert() {
    const { text, setText, values } = useStatValues();
    const r = useMemo(() => values.length > 0 ? C.calculateMean(values) : null, [values]);
    return <div className="calc-card">
        <F label="📊 WERTE (KOMMA-GETRENNT)"><input type="text" className="calc-field__input" value={text} onChange={e=>setText(e.target.value)} placeholder="z.B. 3, 7, 5, 9, 6" /></F>
        {r && <><R label="MITTELWERT" value={`${r.mean}`} /><Grid cols={2}><Stat l="SUMME" v={r.sum} /><Stat l="ANZAHL" v={r.count} /></Grid></>}
    </div>;
}

/* ─── 22. Standardabweichung ─── */
function Standardabweichung() {
    const { text, setText, values } = useStatValues("2, 4, 4, 4, 5, 5, 7, 9");
    const r = useMemo(() => values.length > 1 ? C.calculateStdDev(values) : null, [values]);
    return <div className="calc-card">
        <F label="📊 WERTE"><input type="text" className="calc-field__input" value={text} onChange={e=>setText(e.target.value)} /></F>
        {r && <><R label="STANDARDABWEICHUNG" value={`${r.stdDev}`} /><Grid cols={3}><Stat l="MITTELWERT" v={r.mean} /><Stat l="VARIANZ" v={r.variance} /><Stat l="STD (POP)" v={r.stdDevPop} /></Grid></>}
    </div>;
}

/* ─── 23. Median ─── */
function MedianCalc() {
    const { text, setText, values } = useStatValues("1, 3, 5, 7, 9");
    const r = useMemo(() => values.length > 0 ? C.calculateMedian(values) : null, [values]);
    return <div className="calc-card">
        <F label="📊 WERTE"><input type="text" className="calc-field__input" value={text} onChange={e=>setText(e.target.value)} /></F>
        {r && <><R label="MEDIAN" value={`${r.median}`} /><Grid cols={3}><Stat l="Q1" v={r.q1} /><Stat l="Q3" v={r.q3} /><Stat l="IQR" v={r.iqr} /></Grid></>}
    </div>;
}

/* ─── 24. Perzentil ─── */
function Perzentil() {
    const { text, setText, values } = useStatValues("10, 20, 30, 40, 50");
    const [p, setP] = useState(25);
    const r = useMemo(() => values.length > 0 ? C.calculatePercentile(values, p) : null, [values, p]);
    return <div className="calc-card">
        <F label="📊 WERTE"><input type="text" className="calc-field__input" value={text} onChange={e=>setText(e.target.value)} /></F>
        <F label="PERZENTIL (0–100)"><input type="number" className="calc-field__input" min={0} max={100} value={p} onChange={e=>setP(+e.target.value)} /></F>
        {r && <R label={`${r.percentile}. PERZENTIL`} value={`${r.value}`} sub={`Rang: ${r.rank}`} />}
    </div>;
}

/* ─── 25. Wahrscheinlichkeit ─── */
function Wahrscheinlichkeit() {
    const [f, setF] = useState(1); const [t, setT] = useState(6);
    const r = useMemo(() => C.calculateProbability(f, t), [f, t]);
    return <div className="calc-card">
        <F label="✅ GÜNSTIGE ERGEBNISSE"><input type="number" className="calc-field__input" value={f} onChange={e=>setF(+e.target.value)} /></F>
        <F label="🎯 MÖGLICHE ERGEBNISSE"><input type="number" className="calc-field__input" value={t} onChange={e=>setT(+e.target.value)} /></F>
        <R label="WAHRSCHEINLICHKEIT" value={`${(r.probability*100).toFixed(2)}%`} sub={`Odds: ${r.odds} • Gegenw.: ${(r.complement*100).toFixed(2)}%`} />
    </div>;
}

/* ─── 26. Alter ─── */
function Alter() {
    const [date, setDate] = useState("1990-03-15");
    const r = useMemo(() => C.calculateAge(new Date(date)), [date]);
    return <div className="calc-card">
        <F label="🎂 GEBURTSDATUM"><input type="date" className="calc-field__input" value={date} onChange={e=>setDate(e.target.value)} /></F>
        <R label="ALTER" value={`${r.years} Jahre, ${r.months} Monate, ${r.days} Tage`} sub={`${r.totalDays.toLocaleString()} Tage gelebt • Nächster Geburtstag in ${r.nextBirthdayIn} Tagen`} />
    </div>;
}

/* ─── 27. Datum ─── */
function Datum() {
    const [s, setS] = useState(new Date().toISOString().split("T")[0]);
    const [e, setE] = useState(new Date(Date.now()+90*86400000).toISOString().split("T")[0]);
    const r = useMemo(() => C.calculateDateDiff(new Date(s), new Date(e)), [s, e]);
    return <div className="calc-card">
        <F label="📅 STARTDATUM"><input type="date" className="calc-field__input" value={s} onChange={ev=>setS(ev.target.value)} /></F>
        <F label="📅 ENDDATUM"><input type="date" className="calc-field__input" value={e} onChange={ev=>setE(ev.target.value)} /></F>
        <R label="DIFFERENZ" value={`${r.days} Tage`} />
        <Grid cols={3}><Stat l="WOCHEN" v={r.weeks} /><Stat l="MONATE" v={r.months} /><Stat l="JAHRE" v={r.years} /></Grid>
    </div>;
}

/* ─── 28. Einheiten ─── */
function Einheiten() {
    const [cat, setCat] = useState<"length"|"weight"|"temp">("length");
    const units = { length: ["mm","cm","m","km","in","ft","mi"], weight: ["mg","g","kg","t","oz","lb"], temp: ["°C","°F","K"] };
    const [from, setFrom] = useState("km"); const [to, setTo] = useState("mi"); const [v, setV] = useState(1);
    const r = useMemo(() => C.convertUnit(v, from, to, cat), [v, from, to, cat]);
    return <div className="calc-card">
        <F label="KATEGORIE"><div className="tax-toggle"><button className={`tax-toggle__btn${cat==="length"?" active":""}`} onClick={()=>{setCat("length");setFrom("km");setTo("mi")}}>Länge</button><button className={`tax-toggle__btn${cat==="weight"?" active":""}`} onClick={()=>{setCat("weight");setFrom("kg");setTo("lb")}}>Gewicht</button><button className={`tax-toggle__btn${cat==="temp"?" active":""}`} onClick={()=>{setCat("temp");setFrom("°C");setTo("°F")}}>Temperatur</button></div></F>
        <F label="WERT"><input type="number" className="calc-field__input" value={v} onChange={e=>setV(+e.target.value)} /></F>
        <div style={{display:"flex",gap:"var(--s-2)"}}><F label="VON"><select className="calc-field__input" value={from} onChange={e=>setFrom(e.target.value)}>{units[cat].map(u=><option key={u} value={u}>{u}</option>)}</select></F><F label="NACH"><select className="calc-field__input" value={to} onChange={e=>setTo(e.target.value)}>{units[cat].map(u=><option key={u} value={u}>{u}</option>)}</select></F></div>
        <R label="ERGEBNIS" value={`${r.result} ${to}`} sub={`${v} ${from} = ${r.result} ${to}`} />
    </div>;
}

/* ─── 29. Rabatt ─── */
function Rabatt() {
    const [p, setP] = useState(120); const [d, setD] = useState(25);
    const r = useMemo(() => C.calculateDiscount(p, d), [p, d]);
    return <div className="calc-card">
        <F label="💰 ORIGINALPREIS (€)"><input type="number" className="calc-field__input" value={p} onChange={e=>setP(+e.target.value)} /></F>
        <F label="🏷️ RABATT (%)"><input type="range" className="calc-field__slider" min={0} max={90} value={d} onChange={e=>setD(+e.target.value)} /><input type="number" className="calc-field__input" value={d} onChange={e=>setD(+e.target.value)} /></F>
        <R label="ENDPREIS" value={`${r.finalPrice.toLocaleString("de-DE")} €`} sub={`Ersparnis: ${r.savedAmount.toLocaleString("de-DE")} €`} />
    </div>;
}

/* ─── 30. Trinkgeld ─── */
function Trinkgeld() {
    const [b, setB] = useState(85); const [t, setT] = useState(10); const [p, setP] = useState(4);
    const r = useMemo(() => C.calculateTip(b, t, p), [b, t, p]);
    return <div className="calc-card">
        <F label="💶 RECHNUNGSBETRAG (€)"><input type="number" className="calc-field__input" value={b} onChange={e=>setB(+e.target.value)} /></F>
        <F label="💰 TRINKGELD (%)"><input type="range" className="calc-field__slider" min={0} max={30} value={t} onChange={e=>setT(+e.target.value)} /><input type="number" className="calc-field__input" value={t} onChange={e=>setT(+e.target.value)} /></F>
        <F label="👥 PERSONEN"><input type="number" className="calc-field__input" min={1} value={p} onChange={e=>setP(+e.target.value)} /></F>
        <R label="GESAMT" value={`${r.totalBill.toLocaleString("de-DE")} €`} sub={`Trinkgeld: ${r.tipAmount} € • Pro Person: ${r.totalPerPerson} €`} />
    </div>;
}

/* ─── Text input helper ─── */
function useText(def: string = "Fügen Sie Ihren Text hier ein, um ihn zu analysieren.") {
    const [text, setText] = useState(def);
    return { text, setText };
}

/* ─── 31. Zeichenanzahl ─── */
function Zeichenanzahl() {
    const { text, setText } = useText();
    const r = useMemo(() => C.countChars(text), [text]);
    return <div className="calc-card">
        <F label="📝 TEXT"><textarea className="calc-field__input" rows={5} value={text} onChange={e=>setText(e.target.value)} style={{resize:"vertical",fontFamily:"inherit"}} /></F>
        <Grid cols={5}><Stat l="ZEICHEN" v={r.chars} /><Stat l="OHNE LEERZ." v={r.charsNoSpaces} /><Stat l="WÖRTER" v={r.words} /><Stat l="SÄTZE" v={r.sentences} /><Stat l="ABSÄTZE" v={r.paragraphs} /></Grid>
    </div>;
}

/* ─── 32. Wortanzahl ─── */
function Wortanzahl() {
    const { text, setText } = useText();
    const r = useMemo(() => C.countWords(text), [text]);
    return <div className="calc-card">
        <F label="📝 TEXT"><textarea className="calc-field__input" rows={5} value={text} onChange={e=>setText(e.target.value)} style={{resize:"vertical",fontFamily:"inherit"}} /></F>
        <R label="WÖRTER" value={`${r.words}`} />
        <Grid cols={2}><Stat l="LESEZEIT" v={r.readingTime} /><Stat l="SPRECHZEIT" v={r.speakingTime} /></Grid>
    </div>;
}

/* ─── 33. Seitenanzahl ─── */
function Seitenanzahl() {
    const { text, setText } = useText();
    const [wpp, setWpp] = useState(250);
    const r = useMemo(() => C.countPages(text, wpp), [text, wpp]);
    return <div className="calc-card">
        <F label="📝 TEXT"><textarea className="calc-field__input" rows={5} value={text} onChange={e=>setText(e.target.value)} style={{resize:"vertical",fontFamily:"inherit"}} /></F>
        <F label="WÖRTER PRO SEITE"><select className="calc-field__input" value={wpp} onChange={e=>setWpp(+e.target.value)}><option value={250}>250 (doppelter ZA)</option><option value={500}>500 (einfacher ZA)</option></select></F>
        <R label="SEITEN" value={`${r.pages}`} sub={`${r.words} Wörter bei ${r.wordsPerPage} Wörtern/Seite`} />
    </div>;
}

/* ─── 34. Token ─── */
function Token() {
    const { text, setText } = useText();
    const r = useMemo(() => C.countTokens(text), [text]);
    return <div className="calc-card">
        <F label="📝 TEXT"><textarea className="calc-field__input" rows={5} value={text} onChange={e=>setText(e.target.value)} style={{resize:"vertical",fontFamily:"inherit"}} /></F>
        <R label="GESCHÄTZTE TOKENS" value={`~${r.tokens}`} />
        <Grid cols={4}><Stat l="ZEICHEN" v={r.chars} /><Stat l="WÖRTER" v={r.words} /><Stat l="GPT-4o" v={r.cost4o} /><Stat l="GPT-4o-mini" v={r.cost4oMini} /></Grid>
    </div>;
}

/* ─── 35. Textanalyse ─── */
function Textanalyse() {
    const { text, setText } = useText();
    const r = useMemo(() => C.analyzeText(text), [text]);
    return <div className="calc-card">
        <F label="📝 TEXT"><textarea className="calc-field__input" rows={5} value={text} onChange={e=>setText(e.target.value)} style={{resize:"vertical",fontFamily:"inherit"}} /></F>
        <R label="LESBARKEIT" value={r.readability} />
        <Grid cols={5}><Stat l="WÖRTER" v={r.words} /><Stat l="ZEICHEN" v={r.chars} /><Stat l="SÄTZE" v={r.sentences} /><Stat l="∅ WORTLÄNGE" v={r.avgWordLength} /><Stat l="∅ SATZLÄNGE" v={r.avgSentenceLength} /></Grid>
    </div>;
}

/* ─── Dispatcher ─── */
const CALCS: Record<string, React.FC> = {
    bmi: BMI, calories: Kalorien, heartrate: Herzfrequenz, idealweight: Idealgewicht, bodyfat: Koerperfett,
    percent: Prozent, ruleofthree: Dreisatz, fraction: Bruch, gcdlcm: GGTKGV, area: Flaeche,
    zins: Zins, kredit: Kredit, sparen: Sparen, inflation: Inflation, tilgung: Tilgung,
    speed: Geschwindigkeit, force: Kraft, density: Dichte, ohm: Ohm, energy: Energie,
    mean: Mittelwert, stddev: Standardabweichung, median: MedianCalc, percentile: Perzentil, probability: Wahrscheinlichkeit,
    age: Alter, dateCalc: Datum, unit: Einheiten, discount: Rabatt, tip: Trinkgeld,
    charcount: Zeichenanzahl, wordcount: Wortanzahl, pagecount: Seitenanzahl, token: Token, textanalysis: Textanalyse,
};

export default function DeCalculatorCore({ calcType }: { calcType: string }) {
    const Calc = CALCS[calcType];
    if (!Calc) return <p>Unbekannter Rechnertyp: {calcType}</p>;
    return <Calc />;
}
