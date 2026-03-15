// LoanToolsCore — Custom loan calculator components (non-EMI)
"use client";
import { useState, useMemo } from "react";

function fmt(n:number):string{if(n>=10000000)return"₹"+(n/10000000).toFixed(2)+" Cr";if(n>=100000)return"₹"+(n/100000).toFixed(2)+" L";return"₹"+n.toLocaleString("en-IN");}
function fmtUSD(n:number):string{if(Math.abs(n)>=1e6)return"$"+(n/1e6).toFixed(2)+"M";return"$"+n.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});}
function pmt(r:number,n:number,pv:number):number{if(r===0)return pv/n;return pv*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);}

interface P{defaults:any;sliderRanges?:any;}
const F=({label,value,onChange,min=0,max=1e7,step=1,prefix=""}:{label:string;value:number;onChange:(v:number)=>void;min?:number;max?:number;step?:number;prefix?:string})=>(
  <div className="calc-field"><label className="calc-field__label">{label}</label>
  <input type="number" className="calc-field__input" value={value} onChange={e=>onChange(Number(e.target.value))} inputMode="decimal" min={min} step={step}/></div>);

// ─── 1. Mortgage Calculator ───
function MortgageCalc({defaults}:P){
  const[price,setPrice]=useState(defaults.amount||300000);
  const[down,setDown]=useState(60000);
  const[rate,setRate]=useState(defaults.rate||7);
  const[tenure,setTenure]=useState(defaults.tenure||360);
  const[tax,setTax]=useState(250);
  const[ins,setIns]=useState(100);
  const[pmiRate,setPmi]=useState(0.5);
  const r=useMemo(()=>{
    const loan=price-down;const mr=rate/100/12;const mp=pmt(mr,tenure,loan);
    const ltv=price>0?loan/price*100:0;const pmiM=ltv>80?(loan*pmiRate/100/12):0;
    const total=mp+tax+ins+pmiM;const totalPaid=mp*tenure;const totalInt=totalPaid-loan;
    return{loan,mp,tax,ins:ins,pmi:pmiM,total,totalInt,ltv,totalPaid};
  },[price,down,rate,tenure,tax,ins,pmiRate]);
  return(<div><div className="calc-input-panel">
    <F label="🏡 HOME PRICE ($)" value={price} onChange={setPrice} step={5000}/>
    <F label="💵 DOWN PAYMENT ($)" value={down} onChange={setDown} step={1000}/>
    <F label="% INTEREST RATE" value={rate} onChange={setRate} step={0.125}/>
    <F label="📅 LOAN TERM (months)" value={tenure} onChange={setTenure} step={12}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
      <F label="🏛️ PROPERTY TAX/mo" value={tax} onChange={setTax}/>
      <F label="🛡️ INSURANCE/mo" value={ins} onChange={setIns}/>
      <F label="📊 PMI RATE (%)" value={pmiRate} onChange={setPmi} step={0.1}/>
    </div></div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">TOTAL MONTHLY PAYMENT</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)",marginBottom:"var(--s-4)"}}>{fmtUSD(r.total)}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"var(--s-3)"}}>
        <div><p className="calc-field__label">PRINCIPAL & INT</p><p style={{fontWeight:700}}>{fmtUSD(r.mp)}</p></div>
        <div><p className="calc-field__label">PROPERTY TAX</p><p style={{fontWeight:700}}>{fmtUSD(r.tax)}</p></div>
        <div><p className="calc-field__label">INSURANCE</p><p style={{fontWeight:700}}>{fmtUSD(r.ins)}</p></div>
        <div><p className="calc-field__label">PMI</p><p style={{fontWeight:700,color:r.pmi>0?"var(--n-error, #ef4444)":"var(--n-text)"}}>{fmtUSD(r.pmi)}{r.pmi>0?" ⚠":"✅"}</p></div>
      </div>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Loan: {fmtUSD(r.loan)} | LTV: {r.ltv.toFixed(1)}% | Total Interest: {fmtUSD(r.totalInt)}</p>
    </div></div>);
}

// ─── 2. Debt Consolidation ───
function DebtConsolidationCalc({defaults}:P){
  const[debts,setDebts]=useState([{name:"Credit Card",bal:15000,rate:22,emi:450},{name:"Personal Loan",bal:10000,rate:14,emi:350},{name:"Auto Loan",bal:25000,rate:8,emi:500}]);
  const[newRate,setNewRate]=useState(defaults.rate||8);
  const[newTenure,setNewTenure]=useState(defaults.tenure||60);
  const upd=(i:number,k:string,v:number)=>{const d=[...debts];(d[i] as any)[k]=v;setDebts(d);};
  const r=useMemo(()=>{
    const totalBal=debts.reduce((s,d)=>s+d.bal,0);const totalEmi=debts.reduce((s,d)=>s+d.emi,0);
    const mr=newRate/100/12;const newEmi=pmt(mr,newTenure,totalBal);
    const totalOld=debts.reduce((s,d)=>{const months=d.bal>0&&d.emi>0?Math.ceil(d.bal/d.emi*1.5):0;return s+d.emi*months;},0);
    const totalNew=newEmi*newTenure;const saving=totalOld-totalNew;
    return{totalBal,totalEmi,newEmi,saving,totalNew,emiSaving:totalEmi-newEmi};
  },[debts,newRate,newTenure]);
  return(<div><div className="calc-input-panel">
    <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>EXISTING DEBTS</p>
    {debts.map((d,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",gap:"8px",marginBottom:"8px",alignItems:"end"}}>
      <div className="calc-field"><label className="calc-field__label">{d.name}</label></div>
      <F label="Balance" value={d.bal} onChange={v=>upd(i,"bal",v)}/>
      <F label="Rate%" value={d.rate} onChange={v=>upd(i,"rate",v)} step={0.5}/>
      <F label="EMI" value={d.emi} onChange={v=>upd(i,"emi",v)}/>
      <button className="btn btn--ghost" style={{padding:"6px"}} onClick={()=>setDebts(debts.filter((_,j)=>j!==i))}>✕</button>
    </div>))}
    <button className="btn btn--ghost" onClick={()=>setDebts([...debts,{name:"New Debt",bal:5000,rate:12,emi:200}])}>+ Add Debt</button>
    <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
    <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>CONSOLIDATED LOAN</p>
    <F label="% NEW INTEREST RATE" value={newRate} onChange={setNewRate} step={0.25}/>
    <F label="📅 NEW TENURE (months)" value={newTenure} onChange={setNewTenure} step={6}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-4)"}}>
        <div><p className="calc-field__label">CURRENT TOTAL EMI</p><p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.totalEmi)}/mo</p></div>
        <div><p className="calc-field__label">NEW CONSOLIDATED EMI</p><p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-success)"}}>{fmtUSD(r.newEmi)}/mo</p></div>
      </div>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Total debt: {fmtUSD(r.totalBal)} | Monthly savings: {fmtUSD(r.emiSaving)}</p>
    </div></div>);
}

// ─── 3. Loan Affordability ───
function LoanAffordabilityCalc({defaults}:P){
  const[income,setIncome]=useState(defaults.amount||80000);
  const[expenses,setExpenses]=useState(30000);
  const[existEmi,setExistEmi]=useState(10000);
  const[dti,setDti]=useState(40);
  const[rate,setRate]=useState(defaults.rate||8.5);
  const[tenure,setTenure]=useState(defaults.tenure||240);
  const r=useMemo(()=>{
    const maxEmi=income*dti/100-existEmi;const mr=rate/100/12;
    const maxLoan=maxEmi>0?maxEmi*(Math.pow(1+mr,tenure)-1)/(mr*Math.pow(1+mr,tenure)):0;
    return{maxEmi:Math.max(0,maxEmi),maxLoan:Math.max(0,maxLoan),usedDti:income>0?(existEmi/income*100):0};
  },[income,expenses,existEmi,dti,rate,tenure]);
  return(<div><div className="calc-input-panel">
    <F label="💰 MONTHLY INCOME" value={income} onChange={setIncome} step={5000}/>
    <F label="🏠 MONTHLY EXPENSES" value={expenses} onChange={setExpenses} step={1000}/>
    <F label="📋 EXISTING EMIs" value={existEmi} onChange={setExistEmi} step={500}/>
    <F label="📊 MAX DEBT-TO-INCOME %" value={dti} onChange={setDti} min={10} max={60} step={5}/>
    <F label="% INTEREST RATE" value={rate} onChange={setRate} step={0.25}/>
    <F label="📅 TENURE (months)" value={tenure} onChange={setTenure} step={12}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">MAXIMUM AFFORDABLE LOAN</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)"}}>₹{r.maxLoan.toLocaleString("en-IN",{maximumFractionDigits:0})}</p>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-2)"}}>Max new EMI: {fmt(r.maxEmi)} | Current DTI: {r.usedDti.toFixed(1)}%</p>
    </div></div>);
}

// ─── 4. Loan Interest Rate (reverse calc) ───
function LoanInterestRateCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||1000000);
  const[emi,setEmi]=useState(defaults.rate||25000);
  const[tenure,setTenure]=useState(defaults.tenure||60);
  const r=useMemo(()=>{
    let lo=0.001,hi=50,mid=0;
    for(let i=0;i<100;i++){mid=(lo+hi)/2;const mr=mid/100/12;const calc=pmt(mr,tenure,loan);if(calc>emi)hi=mid;else lo=mid;if(Math.abs(calc-emi)<0.01)break;}
    const totalPaid=emi*tenure;const totalInt=totalPaid-loan;
    return{rate:mid,totalPaid,totalInt};
  },[loan,emi,tenure]);
  return(<div><div className="calc-input-panel">
    <F label="💰 LOAN AMOUNT" value={loan} onChange={setLoan} step={10000}/>
    <F label="📋 MONTHLY EMI" value={emi} onChange={setEmi} step={500}/>
    <F label="📅 TENURE (months)" value={tenure} onChange={setTenure} step={6}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">EFFECTIVE INTEREST RATE</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)"}}>{r.rate.toFixed(2)}% p.a.</p>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-2)"}}>Total paid: {fmt(r.totalPaid)} | Total interest: {fmt(r.totalInt)}</p>
    </div></div>);
}

// ─── 5. Loan Payoff ───
function LoanPayoffCalc({defaults}:P){
  const[bal,setBal]=useState(defaults.amount||500000);
  const[rate,setRate]=useState(defaults.rate||10);
  const[emi,setEmi]=useState(12000);
  const[extra,setExtra]=useState(2000);
  const r=useMemo(()=>{
    const mr=rate/100/12;let b1=bal,m1=0,int1=0;
    while(b1>0&&m1<600){const i=b1*mr;int1+=i;b1=b1+i-emi;m1++;if(emi<=i)return{monthsOrig:999,monthsExtra:999,intOrig:0,intExtra:0,saved:0};}
    let b2=bal,m2=0,int2=0;const totalEmi=emi+extra;
    while(b2>0&&m2<600){const i=b2*mr;int2+=i;b2=b2+i-totalEmi;m2++;}
    return{monthsOrig:m1,monthsExtra:m2,intOrig:int1,intExtra:int2,saved:int1-int2};
  },[bal,rate,emi,extra]);
  return(<div><div className="calc-input-panel">
    <F label="💰 OUTSTANDING BALANCE" value={bal} onChange={setBal} step={10000}/>
    <F label="% INTEREST RATE" value={rate} onChange={setRate} step={0.25}/>
    <F label="📋 CURRENT EMI" value={emi} onChange={setEmi} step={500}/>
    <F label="💸 EXTRA MONTHLY PAYMENT" value={extra} onChange={setExtra} step={500}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-4)"}}>
        <div><p className="calc-field__label">WITHOUT EXTRA</p><p style={{fontWeight:700}}>{r.monthsOrig} months ({(r.monthsOrig/12).toFixed(1)} yrs)</p><p style={{fontSize:"12px",color:"var(--n-text-muted)"}}>Interest: {fmt(r.intOrig)}</p></div>
        <div><p className="calc-field__label">WITH EXTRA</p><p style={{fontWeight:700,color:"var(--n-success)"}}>{r.monthsExtra} months ({(r.monthsExtra/12).toFixed(1)} yrs)</p><p style={{fontSize:"12px",color:"var(--n-success)"}}>Interest: {fmt(r.intExtra)}</p></div>
      </div>
      <p style={{fontSize:"var(--t-body)",fontWeight:700,color:"var(--n-success)",marginTop:"var(--s-3)"}}>You save {fmt(r.saved)} and {r.monthsOrig-r.monthsExtra} months!</p>
    </div></div>);
}

// ─── 6. Loan Amortization ───
function LoanAmortizationCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||1000000);
  const[rate,setRate]=useState(defaults.rate||9);
  const[tenure,setTenure]=useState(defaults.tenure||120);
  const[showAll,setShowAll]=useState(false);
  const r=useMemo(()=>{
    const mr=rate/100/12;const mp=pmt(mr,tenure,loan);const rows:any[]=[];let bal=loan;
    for(let i=1;i<=tenure;i++){const intP=bal*mr;const prinP=mp-intP;bal=Math.max(0,bal-prinP);rows.push({m:i,emi:mp,prin:prinP,int:intP,bal});}
    return{mp,rows,totalInt:rows.reduce((s,r)=>s+r.int,0)};
  },[loan,rate,tenure]);
  const display=showAll?r.rows:r.rows.slice(0,12);
  return(<div><div className="calc-input-panel">
    <F label="💰 LOAN AMOUNT" value={loan} onChange={setLoan} step={50000}/>
    <F label="% INTEREST RATE" value={rate} onChange={setRate} step={0.25}/>
    <F label="📅 TENURE (months)" value={tenure} onChange={setTenure} step={12}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">MONTHLY EMI</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)",marginBottom:"var(--s-2)"}}>{fmt(r.mp)}</p>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)"}}>Total interest: {fmt(r.totalInt)}</p>
    </div>
    <div style={{marginTop:"var(--s-4)",overflowX:"auto"}}>
      <table className="comparison-table"><thead><tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
      <tbody>{display.map(row=>(<tr key={row.m}><td>{row.m}</td><td>{fmt(row.emi)}</td><td>{fmt(row.prin)}</td><td>{fmt(row.int)}</td><td>{fmt(row.bal)}</td></tr>))}</tbody></table>
      {r.rows.length>12&&<button className="btn btn--ghost" style={{marginTop:"var(--s-2)"}} onClick={()=>setShowAll(!showAll)}>{showAll?"Show Less":"Show All "+r.rows.length+" Months"}</button>}
    </div></div>);
}

// ─── 7. LTV Calculator ───
function LTVCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||400000);
  const[value,setValue]=useState(defaults.rate||500000);
  const ltv=value>0?(loan/value*100):0;const downPmt=value-loan;
  return(<div><div className="calc-input-panel">
    <F label="💰 LOAN AMOUNT" value={loan} onChange={setLoan} step={5000}/>
    <F label="🏠 PROPERTY VALUE" value={value} onChange={setValue} step={5000}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">LOAN-TO-VALUE RATIO</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:ltv>80?"var(--n-error, #ef4444)":"var(--n-success)"}}>{ltv.toFixed(1)}%</p>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-2)"}}>Down payment: {fmtUSD(downPmt)} ({value>0?((downPmt/value)*100).toFixed(1):0}%){ltv>80?" — PMI likely required":""}</p>
    </div></div>);
}

// ─── 8. Balloon Loan ───
function BalloonLoanCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||300000);
  const[rate,setRate]=useState(defaults.rate||7);
  const[tenure,setTenure]=useState(defaults.tenure||84);
  const[amortTenure,setAmort]=useState(360);
  const r=useMemo(()=>{
    const mr=rate/100/12;const fullEmi=pmt(mr,amortTenure,loan);
    let bal=loan;for(let i=0;i<tenure;i++){bal=bal*(1+mr)-fullEmi;}
    const totalPaid=fullEmi*tenure+Math.max(0,bal);const totalInt=totalPaid-loan;
    return{emi:fullEmi,balloon:Math.max(0,bal),totalPaid,totalInt};
  },[loan,rate,tenure,amortTenure]);
  return(<div><div className="calc-input-panel">
    <F label="💰 LOAN AMOUNT" value={loan} onChange={setLoan} step={5000}/>
    <F label="% INTEREST RATE" value={rate} onChange={setRate} step={0.125}/>
    <F label="📅 LOAN TERM (months)" value={tenure} onChange={setTenure} step={12}/>
    <F label="📅 AMORTIZATION PERIOD (months)" value={amortTenure} onChange={setAmort} step={12}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-4)"}}>
        <div><p className="calc-field__label">MONTHLY PAYMENT</p><p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-primary)"}}>{fmtUSD(r.emi)}</p></div>
        <div><p className="calc-field__label">BALLOON PAYMENT</p><p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.balloon)}</p></div>
      </div>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Total interest: {fmtUSD(r.totalInt)}</p>
    </div></div>);
}

// ─── 9. ARM Calculator ───
function ARMCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||300000);
  const[introRate,setIntro]=useState(defaults.rate||5.5);
  const[introPeriod,setIntroPeriod]=useState(60);
  const[adjRate,setAdjRate]=useState(7.5);
  const[tenure,setTenure]=useState(defaults.tenure||360);
  const r=useMemo(()=>{
    const mr1=introRate/100/12;const mr2=adjRate/100/12;
    const emi1=pmt(mr1,tenure,loan);let bal=loan;let int1=0;
    for(let i=0;i<introPeriod&&i<tenure;i++){const intP=bal*mr1;int1+=intP;bal=bal+intP-emi1;}
    const rem=tenure-introPeriod;const emi2=rem>0?pmt(mr2,rem,bal):0;let int2=0;let b2=bal;
    for(let i=0;i<rem;i++){const intP=b2*mr2;int2+=intP;b2=b2+intP-emi2;}
    return{emi1,emi2,int1,int2,totalInt:int1+int2,jump:emi2-emi1};
  },[loan,introRate,introPeriod,adjRate,tenure]);
  return(<div><div className="calc-input-panel">
    <F label="💰 LOAN AMOUNT" value={loan} onChange={setLoan} step={5000}/>
    <F label="% INTRO RATE" value={introRate} onChange={setIntro} step={0.125}/>
    <F label="📅 INTRO PERIOD (months)" value={introPeriod} onChange={setIntroPeriod} step={12}/>
    <F label="% ADJUSTED RATE" value={adjRate} onChange={setAdjRate} step={0.125}/>
    <F label="📅 TOTAL TERM (months)" value={tenure} onChange={setTenure} step={12}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-4)"}}>
        <div><p className="calc-field__label">INTRO PAYMENT</p><p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-success)"}}>{fmtUSD(r.emi1)}/mo</p></div>
        <div><p className="calc-field__label">AFTER ADJUSTMENT</p><p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.emi2)}/mo</p></div>
      </div>
      <p style={{fontSize:"var(--t-body)",fontWeight:700,color:"var(--n-error, #ef4444)",marginTop:"var(--s-3)"}}>Payment jump: +{fmtUSD(r.jump)}/mo ({r.emi1>0?((r.jump/r.emi1)*100).toFixed(1):0}% increase)</p>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)"}}>Total interest: {fmtUSD(r.totalInt)}</p>
    </div></div>);
}

// ─── 10. Fixed vs Variable ───
function FixedVsVariableCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||300000);
  const[fixedRate,setFixed]=useState(defaults.rate||8);
  const[varRate,setVar]=useState(7);
  const[varIncrease,setVarInc]=useState(0.5);
  const[tenure,setTenure]=useState(defaults.tenure||240);
  const r=useMemo(()=>{
    const mr1=fixedRate/100/12;const emiF=pmt(mr1,tenure,loan);const totalF=emiF*tenure;
    let bal=loan,totalV=0;const yearlyMonths=12;
    for(let y=0;y<tenure/12;y++){const curRate=(varRate+y*varIncrease)/100/12;const rem=tenure-y*12;const emiV=pmt(curRate,rem,bal);const months=Math.min(12,rem);
      for(let m=0;m<months;m++){const intP=bal*curRate;totalV+=emiV;bal=bal+intP-emiV;}}
    return{emiF,totalF,totalV,intF:totalF-loan,intV:totalV-loan,winner:totalF<totalV?"Fixed":"Variable"};
  },[loan,fixedRate,varRate,varIncrease,tenure]);
  return(<div><div className="calc-input-panel">
    <F label="💰 LOAN AMOUNT" value={loan} onChange={setLoan} step={10000}/>
    <F label="🔒 FIXED RATE %" value={fixedRate} onChange={setFixed} step={0.25}/>
    <F label="📈 INITIAL VARIABLE RATE %" value={varRate} onChange={setVar} step={0.25}/>
    <F label="📈 ANNUAL RATE INCREASE %" value={varIncrease} onChange={setVarInc} step={0.25}/>
    <F label="📅 TENURE (months)" value={tenure} onChange={setTenure} step={12}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-4)"}}>
        <div style={{padding:"var(--s-3)",borderRadius:"8px",border:r.winner==="Fixed"?"2px solid var(--n-success)":"1px solid var(--n-border)"}}>
          <p className="calc-field__label">🔒 FIXED RATE</p><p style={{fontWeight:700}}>{fmtUSD(r.emiF)}/mo</p>
          <p style={{fontSize:"12px",color:"var(--n-text-muted)"}}>Total: {fmtUSD(r.totalF)}</p></div>
        <div style={{padding:"var(--s-3)",borderRadius:"8px",border:r.winner==="Variable"?"2px solid var(--n-success)":"1px solid var(--n-border)"}}>
          <p className="calc-field__label">📈 VARIABLE RATE</p><p style={{fontWeight:700}}>Starts {fmtUSD(pmt(varRate/100/12,tenure,loan))}/mo</p>
          <p style={{fontSize:"12px",color:"var(--n-text-muted)"}}>Total: {fmtUSD(r.totalV)}</p></div>
      </div>
      <p style={{fontSize:"var(--t-body)",fontWeight:700,color:"var(--n-success)",marginTop:"var(--s-3)"}}>{r.winner} wins — saves {fmtUSD(Math.abs(r.totalF-r.totalV))}</p>
    </div></div>);
}

// ─── 11. Extra Payment ───
function ExtraPaymentCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||500000);
  const[rate,setRate]=useState(defaults.rate||9);
  const[tenure,setTenure]=useState(defaults.tenure||240);
  const[extraM,setExtraM]=useState(5000);
  const[lumpSum,setLump]=useState(0);
  const[lumpMonth,setLumpMonth]=useState(12);
  const r=useMemo(()=>{
    const mr=rate/100/12;const emi=pmt(mr,tenure,loan);
    let b1=loan,m1=0,int1=0;while(b1>0.5&&m1<tenure){const i=b1*mr;int1+=i;b1=b1+i-emi;m1++;}
    let b2=loan-lumpSum,m2=0,int2=0;if(lumpMonth===0)b2=loan-lumpSum;
    b2=loan;
    while(b2>0.5&&m2<600){if(m2===lumpMonth-1)b2=Math.max(0,b2-lumpSum);const i=b2*mr;int2+=i;b2=b2+i-emi-extraM;m2++;}
    return{emi,m1,m2:Math.max(0,m2),int1,int2,savedInt:int1-int2,savedMonths:m1-Math.max(0,m2)};
  },[loan,rate,tenure,extraM,lumpSum,lumpMonth]);
  return(<div><div className="calc-input-panel">
    <F label="💰 LOAN AMOUNT" value={loan} onChange={setLoan} step={10000}/>
    <F label="% INTEREST RATE" value={rate} onChange={setRate} step={0.25}/>
    <F label="📅 ORIGINAL TENURE (months)" value={tenure} onChange={setTenure} step={12}/>
    <F label="💸 EXTRA MONTHLY PAYMENT" value={extraM} onChange={setExtraM} step={500}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
      <F label="🎁 ONE-TIME LUMP SUM" value={lumpSum} onChange={setLump} step={10000}/>
      <F label="📅 LUMP SUM AT MONTH #" value={lumpMonth} onChange={setLumpMonth} step={1} min={1}/>
    </div>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-success)"}}>Save {fmt(r.savedInt)} in interest</p>
      <p style={{fontSize:"var(--t-body)",fontWeight:700,color:"var(--n-success)"}}>Pay off {r.savedMonths} months earlier!</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-3)"}}>
        <div><p className="calc-field__label">ORIGINAL</p><p style={{fontWeight:700}}>{r.m1} months | Int: {fmt(r.int1)}</p></div>
        <div><p className="calc-field__label">WITH EXTRA</p><p style={{fontWeight:700,color:"var(--n-success)"}}>{r.m2} months | Int: {fmt(r.int2)}</p></div>
      </div>
    </div></div>);
}

// ─── 12. Refinance Calculator ───
function RefinanceCalc({defaults}:P){
  const[bal,setBal]=useState(defaults.amount||500000);
  const[curRate,setCurRate]=useState(defaults.rate||10);
  const[curTenure,setCurTenure]=useState(defaults.tenure||240);
  const[newRate,setNewRate]=useState(8);
  const[newTenure,setNewTenure]=useState(240);
  const[closingCost,setClosing]=useState(15000);
  const r=useMemo(()=>{
    const mr1=curRate/100/12;const mr2=newRate/100/12;
    const emi1=pmt(mr1,curTenure,bal);const emi2=pmt(mr2,newTenure,bal);
    const total1=emi1*curTenure;const total2=emi2*newTenure+closingCost;
    const saving=total1-total2;const monthlySave=emi1-emi2;
    const breakEven=monthlySave>0?Math.ceil(closingCost/monthlySave):999;
    return{emi1,emi2,total1,total2,saving,monthlySave,breakEven};
  },[bal,curRate,curTenure,newRate,newTenure,closingCost]);
  const worth=r.saving>0;
  return(<div><div className="calc-input-panel">
    <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>CURRENT LOAN</p>
    <F label="💰 OUTSTANDING BALANCE" value={bal} onChange={setBal} step={10000}/>
    <F label="% CURRENT RATE" value={curRate} onChange={setCurRate} step={0.25}/>
    <F label="📅 REMAINING TENURE (months)" value={curTenure} onChange={setCurTenure} step={12}/>
    <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
    <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>NEW LOAN</p>
    <F label="% NEW RATE" value={newRate} onChange={setNewRate} step={0.25}/>
    <F label="📅 NEW TENURE (months)" value={newTenure} onChange={setNewTenure} step={12}/>
    <F label="💳 CLOSING COSTS" value={closingCost} onChange={setClosing} step={1000}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p style={{fontSize:"var(--t-h2)",fontWeight:700,color:worth?"var(--n-success)":"var(--n-error, #ef4444)"}}>{worth?"✅ Refinancing saves "+fmt(r.saving):"❌ Refinancing costs "+fmt(Math.abs(r.saving))+" more"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-3)"}}>
        <div><p className="calc-field__label">CURRENT EMI</p><p style={{fontWeight:700}}>{fmt(r.emi1)}</p></div>
        <div><p className="calc-field__label">NEW EMI</p><p style={{fontWeight:700,color:"var(--n-success)"}}>{fmt(r.emi2)}</p></div>
      </div>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Monthly savings: {fmt(r.monthlySave)} | Break-even: {r.breakEven} months</p>
    </div></div>);
}

// ─── 13. Mortgage Refinance ───
function MortgageRefinanceCalc({defaults}:P){
  const[bal,setBal]=useState(defaults.amount||300000);
  const[curRate,setCur]=useState(defaults.rate||7.5);
  const[curTenure,setCurT]=useState(defaults.tenure||300);
  const[newRate,setNew]=useState(6);
  const[newTenure,setNewT]=useState(360);
  const[closing,setClosing]=useState(5000);
  const r=useMemo(()=>{
    const mr1=curRate/100/12;const mr2=newRate/100/12;
    const emi1=pmt(mr1,curTenure,bal);const emi2=pmt(mr2,newTenure,bal);
    const total1=emi1*curTenure;const total2=emi2*newTenure+closing;
    const save=total1-total2;const monthlySave=emi1-emi2;
    const breakEven=monthlySave>0?Math.ceil(closing/monthlySave):999;
    return{emi1,emi2,total1,total2,save,monthlySave,breakEven};
  },[bal,curRate,curTenure,newRate,newTenure,closing]);
  return(<div><div className="calc-input-panel">
    <p className="calc-field__label">CURRENT MORTGAGE</p>
    <F label="💰 REMAINING BALANCE" value={bal} onChange={setBal} step={5000}/>
    <F label="% CURRENT RATE" value={curRate} onChange={setCur} step={0.125}/>
    <F label="📅 REMAINING TERM (months)" value={curTenure} onChange={setCurT} step={12}/>
    <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
    <p className="calc-field__label">NEW MORTGAGE</p>
    <F label="% NEW RATE" value={newRate} onChange={setNew} step={0.125}/>
    <F label="📅 NEW TERM (months)" value={newTenure} onChange={setNewT} step={12}/>
    <F label="💳 CLOSING COSTS" value={closing} onChange={setClosing} step={500}/>
  </div>
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p style={{fontSize:"var(--t-h2)",fontWeight:700,color:r.save>0?"var(--n-success)":"var(--n-error, #ef4444)"}}>{r.save>0?"✅ Save "+fmtUSD(r.save)+" by refinancing":"❌ Refinancing costs "+fmtUSD(Math.abs(r.save))+" more"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-3)"}}>
        <div><p className="calc-field__label">CURRENT</p><p style={{fontWeight:700}}>{fmtUSD(r.emi1)}/mo</p></div>
        <div><p className="calc-field__label">NEW</p><p style={{fontWeight:700,color:"var(--n-success)"}}>{fmtUSD(r.emi2)}/mo</p></div>
      </div>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Monthly savings: {fmtUSD(r.monthlySave)} | Break-even: {r.breakEven} months</p>
    </div></div>);
}

// ─── Dispatcher ───
const CALC_MAP:Record<string,React.FC<P>>={
  mortgage:MortgageCalc, debtConsolidation:DebtConsolidationCalc,
  loanAffordability:LoanAffordabilityCalc, loanInterestRate:LoanInterestRateCalc,
  loanPayoff:LoanPayoffCalc, loanAmortization:LoanAmortizationCalc,
  ltv:LTVCalc, balloonLoan:BalloonLoanCalc, arm:ARMCalc,
  fixedVsVariable:FixedVsVariableCalc, extraPayment:ExtraPaymentCalc,
  refinance:RefinanceCalc, mortgageRefinance:MortgageRefinanceCalc,
};

export default function LoanToolsCore({calcType,defaults,sliderRanges}:{calcType:string;defaults:any;sliderRanges?:any}){
  const Comp=CALC_MAP[calcType];
  if(!Comp)return <p>Calculator not found.</p>;
  return <Comp defaults={defaults} sliderRanges={sliderRanges}/>;
}
