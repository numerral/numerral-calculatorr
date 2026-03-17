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

// ─── 1. Mortgage Calculator (Enhanced) ───
function MortgageCalc({defaults}:P){
  const[price,setPrice]=useState(defaults.amount||400000);
  const[downMode,setDownMode]=useState<"percent"|"dollar">("percent");
  const[downPct,setDownPct]=useState(20);
  const[downAmt,setDownAmt]=useState(80000);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[termYears,setTermYears]=useState(30);
  const[taxPct,setTaxPct]=useState(1.2);
  const[insYr,setInsYr]=useState(1500);
  const[hoa,setHoa]=useState(0);
  const[showAmort,setShowAmort]=useState(false);

  const down=downMode==="percent"?Math.round(price*downPct/100):downAmt;
  const loan=Math.max(price-down,0);
  const tenure=termYears*12;
  const ltv=price>0?(loan/price*100):0;

  const r=useMemo(()=>{
    const mr=rate/100/12;const mp=pmt(mr,tenure,loan);
    const taxMo=Math.round(price*taxPct/100/12);const insMo=Math.round(insYr/12);
    const pmiMo=ltv>80?Math.round(loan*0.005/12):0;
    const total=mp+taxMo+insMo+pmiMo+hoa;
    const totalPaid=mp*tenure;const totalInt=totalPaid-loan;
    const payoffDate=new Date();payoffDate.setMonth(payoffDate.getMonth()+tenure);
    const payoffStr=payoffDate.toLocaleDateString("en-US",{month:"short",year:"numeric"});
    // Yearly amortization
    const years:{yr:number;prin:number;int:number;bal:number}[]=[];
    let bal=loan;
    for(let y=1;y<=termYears;y++){
      let yPrin=0,yInt=0;
      for(let m=0;m<12&&bal>0.5;m++){const i=bal*mr;const p=mp-i;yPrin+=p;yInt+=i;bal=Math.max(0,bal-p);}
      years.push({yr:y,prin:yPrin,int:yInt,bal});
    }
    return{loan,mp,taxMo,insMo,pmiMo,total,totalInt,totalPaid,ltv,payoff:payoffStr,years,totalCost:total*tenure};
  },[price,down,rate,tenure,taxPct,insYr,hoa,ltv,loan]);

  return(<div>
    <div className="calc-input-panel">
      {/* Home Price */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏡</span>Home Price</label>
        <input type="range" className="calc-field__slider" min={50000} max={2000000} step={5000} value={price} onChange={e=>setPrice(+e.target.value)}/>
        <input type="text" className="calc-field__input" value={price.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setPrice(v);}}/>
      </div>

      {/* Down Payment */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💵</span>Down Payment</label>
        <div className="tax-toggle" style={{marginBottom:"var(--s-2)"}}>
          <button className={`tax-toggle__btn${downMode==="percent"?" active":""}`} onClick={()=>setDownMode("percent")}>Percentage</button>
          <button className={`tax-toggle__btn${downMode==="dollar"?" active":""}`} onClick={()=>setDownMode("dollar")}>Dollar Amount</button>
        </div>
        {downMode==="percent"?(
          <>
            <input type="range" className="calc-field__slider" min={0} max={50} step={1} value={downPct} onChange={e=>setDownPct(+e.target.value)}/>
            <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
              <input type="text" className="calc-field__input" style={{maxWidth:"80px"}} value={downPct} inputMode="numeric"
                onChange={e=>{const v=parseInt(e.target.value);if(!isNaN(v))setDownPct(Math.min(50,Math.max(0,v)));}}/>
              <span className="t-body-sm text-muted">% = {fmtUSD(down)}</span>
            </div>
          </>
        ):(
          <>
            <input type="range" className="calc-field__slider" min={0} max={price} step={5000} value={downAmt} onChange={e=>setDownAmt(+e.target.value)}/>
            <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
              <input type="text" className="calc-field__input" value={downAmt.toLocaleString("en-US")} inputMode="numeric"
                onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setDownAmt(v);}}/>
              <span className="t-body-sm text-muted">= {price>0?(down/price*100).toFixed(1):0}%</span>
            </div>
          </>
        )}
        {ltv>80&&<span className="t-body-sm" style={{color:"var(--n-error, #ef4444)",marginTop:"4px",display:"block"}}>⚠ PMI required (LTV {ltv.toFixed(1)}% &gt; 80%)</span>}
      </div>

      {/* Loan Term */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📅</span>Loan Term</label>
        <div className="tax-toggle">
          {[30,20,15].map(y=>(
            <button key={y} className={`tax-toggle__btn${termYears===y?" active":""}`} onClick={()=>setTermYears(y)}>{y} Years</button>
          ))}
        </div>
      </div>

      {/* Interest Rate */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📊</span>Interest Rate (%)</label>
        <input type="range" className="calc-field__slider" min={2} max={12} step={0.125} value={rate} onChange={e=>setRate(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"100px"}} value={rate} inputMode="decimal"
          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setRate(v);}}/>
      </div>

      {/* Property Tax, Insurance, HOA */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
        <div className="calc-field">
          <label className="calc-field__label" style={{fontSize:"0.82rem"}}><span className="calc-field__label-icon">🏛️</span>Property Tax (%)</label>
          <input type="text" className="calc-field__input" value={taxPct} inputMode="decimal"
            onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setTaxPct(v);}}/>
        </div>
        <div className="calc-field">
          <label className="calc-field__label" style={{fontSize:"0.82rem"}}><span className="calc-field__label-icon">🛡️</span>Insurance ($/yr)</label>
          <input type="text" className="calc-field__input" value={insYr.toLocaleString("en-US")} inputMode="numeric"
            onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setInsYr(v);}}/>
        </div>
        <div className="calc-field">
          <label className="calc-field__label" style={{fontSize:"0.82rem"}}><span className="calc-field__label-icon">🏘️</span>HOA ($/mo)</label>
          <input type="text" className="calc-field__input" value={hoa} inputMode="numeric"
            onChange={e=>{const v=parseInt(e.target.value);if(!isNaN(v))setHoa(v);}}/>
        </div>
      </div>
    </div>

    {/* ── Results ── */}
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Total Monthly Payment</p>
      <p className="calc-result__emi">{fmtUSD(r.total)}<span style={{fontSize:"0.5em",fontWeight:400}}>/mo</span></p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Principal & Interest</p><p className="calc-result__stat-value">{fmtUSD(r.mp)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Loan Amount</p><p className="calc-result__stat-value">{fmtUSD(r.loan)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Payoff Date</p><p className="calc-result__stat-value" style={{color:"var(--n-success)"}}>{r.payoff}</p></div>
      </div>

      {/* PITI Breakdown Table */}
      <div style={{marginTop:"var(--s-4)",overflowX:"auto"}}>
        <table className="comparison-table">
          <thead><tr><th>Component</th><th>Monthly</th><th>Total ({termYears}yr)</th></tr></thead>
          <tbody>
            <tr><td>Principal & Interest</td><td>{fmtUSD(r.mp)}</td><td>{fmtUSD(r.mp*tenure)}</td></tr>
            <tr><td>Property Tax</td><td>{fmtUSD(r.taxMo)}</td><td>{fmtUSD(r.taxMo*tenure)}</td></tr>
            <tr><td>Home Insurance</td><td>{fmtUSD(r.insMo)}</td><td>{fmtUSD(r.insMo*tenure)}</td></tr>
            {r.pmiMo>0&&<tr><td>PMI <span style={{fontSize:"0.75em",color:"var(--n-error, #ef4444)"}}>(until 80% LTV)</span></td><td>{fmtUSD(r.pmiMo)}</td><td>—</td></tr>}
            {hoa>0&&<tr><td>HOA Fee</td><td>{fmtUSD(hoa)}</td><td>{fmtUSD(hoa*tenure)}</td></tr>}
            <tr style={{fontWeight:700}}><td>Total</td><td>{fmtUSD(r.total)}</td><td>{fmtUSD(r.totalCost)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Loan Summary */}
      <div className="calc-result__breakdown" style={{marginTop:"var(--s-4)"}}>
        <p className="calc-result__breakdown-title">Loan Summary</p>
        <p className="calc-result__breakdown-line">Home Price: {fmtUSD(price)}</p>
        <p className="calc-result__breakdown-line">Down Payment: {fmtUSD(down)} ({price>0?(down/price*100).toFixed(1):0}%)</p>
        <p className="calc-result__breakdown-line">Loan Amount: {fmtUSD(r.loan)}</p>
        <p className="calc-result__breakdown-line">Total Interest Paid: {fmtUSD(r.totalInt)}</p>
        <p className="calc-result__breakdown-line" style={{fontWeight:600}}>Total of All Payments: {fmtUSD(r.totalPaid)}</p>
      </div>
    </div>

    {/* ── Amortization Schedule ── */}
    <div style={{marginTop:"var(--s-6)"}}>
      <h3 className="t-h3" style={{marginBottom:"var(--s-4)"}}>Amortization Schedule (Yearly)</h3>
      <div style={{overflowX:"auto"}}>
        <table className="comparison-table">
          <thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Ending Balance</th></tr></thead>
          <tbody>{(showAmort?r.years:r.years.slice(0,10)).map(y=>(
            <tr key={y.yr}>
              <td>{y.yr}</td>
              <td>{fmtUSD(y.prin)}</td>
              <td>{fmtUSD(y.int)}</td>
              <td>{fmtUSD(y.bal)}</td>
            </tr>
          ))}</tbody>
        </table>
        {r.years.length>10&&(
          <button className="btn btn--ghost" style={{marginTop:"var(--s-2)"}} onClick={()=>setShowAmort(!showAmort)}>
            {showAmort?`Show Less`:`Show All ${r.years.length} Years`}
          </button>
        )}
      </div>
    </div>
  </div>);
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

// ─── 3. House Affordability (Enhanced) ───
function LoanAffordabilityCalc({defaults}:P){
  const[income,setIncome]=useState(85000);
  const[debts,setDebts]=useState(500);
  const[downPct,setDownPct]=useState(20);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[termYears,setTermYears]=useState(30);
  const[propTax,setPropTax]=useState(1.2);
  const[insurance,setInsurance]=useState(1500);
  const[hoa,setHoa]=useState(0);
  const[loanType,setLoanType]=useState<"conv"|"fha"|"va">("conv");

  const r=useMemo(()=>{
    // DTI limits by loan type
    const limits={conv:{front:28,back:36},fha:{front:31,back:43},va:{front:50,back:41}};
    const lim=limits[loanType];
    const monthlyIncome=income/12;
    // Back-end: total debts (housing + other) <= back% of income
    const maxTotalDebt=monthlyIncome*lim.back/100;
    const maxHousingFromBack=maxTotalDebt-debts;
    // Front-end: housing only <= front% of income
    const maxHousingFromFront=monthlyIncome*lim.front/100;
    // Use the lower of front-end and back-end
    const maxHousing=Math.max(0,Math.min(maxHousingFromFront,maxHousingFromBack));
    // Subtract non-P&I housing costs
    const monthlyTax=propTax/100; // will be applied per dollar of home price
    const monthlyIns=insurance/12;
    // We need to solve: P&I + (homePrice * propTax%/12) + insurance/12 + hoa + pmi <= maxHousing
    // P&I = pmt(mr, n, loanAmount) where loanAmount = homePrice * (1-downPct/100)
    const mr=rate/100/12;const n=termYears*12;
    const pmtFactor=mr*Math.pow(1+mr,n)/(Math.pow(1+mr,n)-1);
    const loanRatio=1-downPct/100;
    // PMI: ~0.5% of loan/yr if down < 20%
    const pmiRate=downPct<20?0.005/12:0;
    // homePrice * loanRatio * pmtFactor + homePrice * monthlyTax/12 + monthlyIns + hoa + homePrice * loanRatio * pmiRate <= maxHousing
    // homePrice * (loanRatio * pmtFactor + monthlyTax/12 + loanRatio * pmiRate) <= maxHousing - monthlyIns - hoa
    const perDollar=loanRatio*pmtFactor + propTax/100/12 + loanRatio*pmiRate;
    const available=maxHousing-monthlyIns-hoa;
    const maxHome=available>0&&perDollar>0?available/perDollar:0;
    const maxLoan=maxHome*loanRatio;
    const pi=maxLoan*pmtFactor;
    const tax=maxHome*propTax/100/12;
    const pmi=maxLoan*pmiRate;
    const totalMonthly=pi+tax+monthlyIns+hoa+pmi;
    const frontDti=monthlyIncome>0?(totalMonthly/monthlyIncome*100):0;
    const backDti=monthlyIncome>0?((totalMonthly+debts)/monthlyIncome*100):0;
    return{maxHome,maxLoan,pi,tax,ins:monthlyIns,hoa,pmi,totalMonthly,frontDti,backDti,downAmt:maxHome*downPct/100,lim};
  },[income,debts,downPct,rate,termYears,propTax,insurance,hoa,loanType]);

  return(<div>
    <div className="calc-input-panel">
      {/* Loan Type */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏦</span>Loan Type</label>
        <div className="tax-toggle">
          <button className={`tax-toggle__btn${loanType==="conv"?" active":""}`} onClick={()=>setLoanType("conv")}>Conventional</button>
          <button className={`tax-toggle__btn${loanType==="fha"?" active":""}`} onClick={()=>setLoanType("fha")}>FHA</button>
          <button className={`tax-toggle__btn${loanType==="va"?" active":""}`} onClick={()=>setLoanType("va")}>VA</button>
        </div>
        <p className="t-body-sm text-muted" style={{marginTop:"var(--s-1)"}}>
          {loanType==="conv"?"28/36 Rule: Housing ≤ 28%, Total debt ≤ 36%":loanType==="fha"?"FHA: Housing ≤ 31%, Total debt ≤ 43%":"VA: Total debt ≤ 41% (no front-end limit)"}
        </p>
      </div>

      {/* Annual Income */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💰</span>Annual Household Income</label>
        <input type="range" className="calc-field__slider" min={30000} max={300000} step={5000} value={income} onChange={e=>setIncome(+e.target.value)}/>
        <input type="text" className="calc-field__input" value={income.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setIncome(v);}}/>
      </div>

      {/* Monthly Debts */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💳</span>Monthly Debts (car, student, credit cards)</label>
        <input type="range" className="calc-field__slider" min={0} max={3000} step={50} value={debts} onChange={e=>setDebts(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={debts.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setDebts(v);}}/>
      </div>

      {/* Down Payment */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏠</span>Down Payment (%)</label>
        <input type="range" className="calc-field__slider" min={loanType==="va"?0:loanType==="fha"?3.5:3} max={30} step={0.5} value={downPct} onChange={e=>setDownPct(+e.target.value)}/>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
          <input type="text" className="calc-field__input" style={{maxWidth:"80px"}} value={downPct} inputMode="decimal"
            onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setDownPct(v);}}/>
          <span className="t-body-sm text-muted">{downPct<20?"⚠️ PMI required":"✅ No PMI"}</span>
        </div>
      </div>

      {/* Interest Rate */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📊</span>Interest Rate (%)</label>
        <input type="range" className="calc-field__slider" min={2} max={12} step={0.125} value={rate} onChange={e=>setRate(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"100px"}} value={rate} inputMode="decimal"
          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setRate(v);}}/>
      </div>

      {/* Loan Term */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📅</span>Loan Term</label>
        <div className="tax-toggle">
          <button className={`tax-toggle__btn${termYears===15?" active":""}`} onClick={()=>setTermYears(15)}>15 Years</button>
          <button className={`tax-toggle__btn${termYears===30?" active":""}`} onClick={()=>setTermYears(30)}>30 Years</button>
        </div>
      </div>

      {/* Property Tax */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏛️</span>Property Tax (% / year)</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"100px"}} value={propTax} inputMode="decimal"
          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setPropTax(v);}}/>
      </div>

      {/* Home Insurance */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🛡️</span>Home Insurance ($/year)</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={insurance.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setInsurance(v);}}/>
      </div>

      {/* HOA */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏘️</span>HOA Fee ($/month)</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={hoa===0?"":hoa.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));setHoa(isNaN(v)?0:v);}}/>
      </div>
    </div>

    {/* ── Results ── */}
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">You Can Afford a Home Up To</p>
      <p className="calc-result__emi">{fmtUSD(r.maxHome)}</p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Loan Amount</p><p className="calc-result__stat-value">{fmtUSD(r.maxLoan)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Down Payment</p><p className="calc-result__stat-value">{fmtUSD(r.downAmt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Monthly Payment</p><p className="calc-result__stat-value">{fmtUSD(r.totalMonthly)}</p></div>
      </div>

      {/* PITI Breakdown */}
      <div style={{marginTop:"var(--s-4)",overflowX:"auto"}}>
        <table className="comparison-table">
          <thead><tr><th>Component</th><th>Monthly</th></tr></thead>
          <tbody>
            <tr><td>Principal & Interest</td><td>{fmtUSD(r.pi)}</td></tr>
            <tr><td>Property Tax</td><td>{fmtUSD(r.tax)}</td></tr>
            <tr><td>Home Insurance</td><td>{fmtUSD(r.ins)}</td></tr>
            {r.pmi>0&&<tr><td>PMI (private mortgage ins.)</td><td style={{color:"var(--n-warning)"}}>{fmtUSD(r.pmi)}</td></tr>}
            {r.hoa>0&&<tr><td>HOA Fee</td><td>{fmtUSD(r.hoa)}</td></tr>}
            <tr style={{fontWeight:700}}><td>Total Housing Payment</td><td>{fmtUSD(r.totalMonthly)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* DTI Visualization */}
      <div style={{marginTop:"var(--s-4)"}}>
        <p className="calc-field__label">Debt-to-Income Ratios</p>
        <div style={{display:"flex",gap:"var(--s-4)",marginTop:"var(--s-2)"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span className="t-body-sm">Front-end (housing)</span><span className="t-body-sm" style={{fontWeight:600}}>{r.frontDti.toFixed(1)}%</span></div>
            <div style={{background:"var(--n-surface-alt)",borderRadius:"4px",height:"8px",overflow:"hidden"}}><div style={{width:`${Math.min(r.frontDti/50*100,100)}%`,height:"100%",background:r.frontDti<=r.lim.front?"var(--n-success)":"var(--n-error)",borderRadius:"4px",transition:"width 0.3s"}}/></div>
            <span className="t-body-sm text-muted">Limit: {r.lim.front}%</span>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span className="t-body-sm">Back-end (total debt)</span><span className="t-body-sm" style={{fontWeight:600}}>{r.backDti.toFixed(1)}%</span></div>
            <div style={{background:"var(--n-surface-alt)",borderRadius:"4px",height:"8px",overflow:"hidden"}}><div style={{width:`${Math.min(r.backDti/50*100,100)}%`,height:"100%",background:r.backDti<=r.lim.back?"var(--n-success)":"var(--n-error)",borderRadius:"4px",transition:"width 0.3s"}}/></div>
            <span className="t-body-sm text-muted">Limit: {r.lim.back}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>);
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
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-2)"}}>Total paid: {fmtUSD(r.totalPaid)} | Total interest: {fmtUSD(r.totalInt)}</p>
    </div></div>);
}

// ─── 5. Mortgage Payoff (Enhanced) ───
function LoanPayoffCalc({defaults}:P){
  const[bal,setBal]=useState(defaults.amount||300000);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[emi,setEmi]=useState(1896);
  const[extra,setExtra]=useState(500);
  const[biweekly,setBiweekly]=useState(false);

  const r=useMemo(()=>{
    const mr=rate/100/12;
    // Original payoff
    let b1=bal,m1=0,int1=0;
    while(b1>0.5&&m1<600){const i=b1*mr;int1+=i;b1=b1+i-emi;m1++;if(emi<=i)return{monthsOrig:999,monthsNew:999,intOrig:0,intNew:0,saved:0,monthsSaved:0,origDate:"N/A",newDate:"N/A"};}
    // With extra payments
    let b2=bal,m2=0,int2=0;
    const effectiveExtra=biweekly?Math.round(emi/12):extra; // biweekly = 1 extra payment/yr spread monthly
    const totalPay=emi+effectiveExtra;
    while(b2>0.5&&m2<600){const i=b2*mr;int2+=i;b2=b2+i-totalPay;m2++;}
    const now=new Date();
    const origDate=new Date(now);origDate.setMonth(origDate.getMonth()+m1);
    const newDate=new Date(now);newDate.setMonth(newDate.getMonth()+m2);
    const fmtDate=(d:Date)=>d.toLocaleDateString("en-US",{month:"short",year:"numeric"});
    return{monthsOrig:m1,monthsNew:m2,intOrig:int1,intNew:int2,saved:int1-int2,monthsSaved:m1-m2,origDate:fmtDate(origDate),newDate:fmtDate(newDate)};
  },[bal,rate,emi,extra,biweekly]);

  return(<div>
    <div className="calc-input-panel">
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💰</span>Outstanding Balance</label>
        <input type="range" className="calc-field__slider" min={10000} max={500000} step={5000} value={bal} onChange={e=>setBal(+e.target.value)}/>
        <input type="text" className="calc-field__input" value={bal.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setBal(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📊</span>Interest Rate (%)</label>
        <input type="range" className="calc-field__slider" min={2} max={12} step={0.125} value={rate} onChange={e=>setRate(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"100px"}} value={rate} inputMode="decimal"
          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setRate(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📋</span>Current Monthly Payment</label>
        <input type="text" className="calc-field__input" value={emi.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setEmi(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💸</span>Payoff Strategy</label>
        <div className="tax-toggle" style={{marginBottom:"var(--s-2)"}}>
          <button className={`tax-toggle__btn${!biweekly?" active":""}`} onClick={()=>setBiweekly(false)}>Extra Monthly</button>
          <button className={`tax-toggle__btn${biweekly?" active":""}`} onClick={()=>setBiweekly(true)}>Biweekly Payments</button>
        </div>
        {!biweekly?(
          <div>
            <input type="range" className="calc-field__slider" min={0} max={2000} step={50} value={extra} onChange={e=>setExtra(+e.target.value)}/>
            <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={extra.toLocaleString("en-US")} inputMode="numeric"
              onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setExtra(v);}}/>
          </div>
        ):(
          <p className="t-body-sm text-muted">Pay {fmtUSD(Math.round(emi/2))} every 2 weeks = 13 full payments/year (1 extra payment annually)</p>
        )}
      </div>
    </div>

    {/* ── Results ── */}
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">{biweekly?"Biweekly":"Extra Payment"} Payoff Results</p>
      <p className="calc-result__emi" style={{color:"var(--n-success)"}}>{Math.round(r.monthsSaved/12)} years earlier</p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Interest Saved</p><p className="calc-result__stat-value" style={{color:"var(--n-success)"}}>{fmtUSD(r.saved)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Time Saved</p><p className="calc-result__stat-value" style={{color:"var(--n-success)"}}>{Math.floor(r.monthsSaved/12)}yr {r.monthsSaved%12}mo</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">New Payoff Date</p><p className="calc-result__stat-value">{r.newDate}</p></div>
      </div>

      {/* Comparison Table */}
      <div style={{marginTop:"var(--s-4)",overflowX:"auto"}}>
        <table className="comparison-table">
          <thead><tr><th></th><th>Original</th><th>{biweekly?"Biweekly":"With Extra"}</th></tr></thead>
          <tbody>
            <tr><td>Monthly Payment</td><td>{fmtUSD(emi)}</td><td>{biweekly?fmtUSD(Math.round(emi/2))+" × 2/wk":fmtUSD(emi+extra)}</td></tr>
            <tr><td>Remaining Payments</td><td>{r.monthsOrig} months</td><td>{r.monthsNew} months</td></tr>
            <tr><td>Payoff Date</td><td>{r.origDate}</td><td style={{color:"var(--n-success)",fontWeight:600}}>{r.newDate}</td></tr>
            <tr><td>Total Interest</td><td>{fmtUSD(r.intOrig)}</td><td style={{color:"var(--n-success)",fontWeight:600}}>{fmtUSD(r.intNew)}</td></tr>
            <tr style={{fontWeight:700}}><td>Interest Savings</td><td>—</td><td style={{color:"var(--n-success)"}}>{fmtUSD(r.saved)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>);
}

// ─── 6. Loan Amortization (Enhanced) ───
function LoanAmortizationCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||200000);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[termYears,setTermYears]=useState(Math.round((defaults.tenure||360)/12));
  const[extra,setExtra]=useState(0);
  const[view,setView]=useState<"annual"|"monthly">("annual");
  const[showAll,setShowAll]=useState(false);
  const tenure=termYears*12;

  const r=useMemo(()=>{
    const mr=rate/100/12;const mp=pmt(mr,tenure,loan);
    // Monthly rows
    const rows:{m:number;pmt:number;prin:number;int:number;bal:number}[]=[];
    let bal=loan,totalInt=0,actualMonths=0;
    for(let i=1;i<=tenure&&bal>0.5;i++){
      const intP=bal*mr;const prinP=mp-intP+extra;const actualPrin=Math.min(prinP,bal);
      bal=Math.max(0,bal-actualPrin);totalInt+=intP;actualMonths=i;
      rows.push({m:i,pmt:mp+extra,prin:actualPrin,int:intP,bal});
    }
    // Yearly summary
    const years:{yr:number;prin:number;int:number;bal:number}[]=[];
    let yBal=loan;
    for(let y=1;y<=termYears&&yBal>0.5;y++){
      let yPrin=0,yInt=0;
      for(let m=0;m<12&&yBal>0.5;m++){const i=yBal*mr;const p=mp-i+extra;const ap=Math.min(p,yBal);yPrin+=ap;yInt+=i;yBal=Math.max(0,yBal-ap);}
      years.push({yr:y,prin:yPrin,int:yInt,bal:yBal});
    }
    const totalPaid=rows.reduce((s,r)=>s+r.pmt,0);
    const payoffDate=new Date();payoffDate.setMonth(payoffDate.getMonth()+actualMonths);
    const payoff=payoffDate.toLocaleDateString("en-US",{month:"short",year:"numeric"});
    const intRatio=totalPaid>0?(totalInt/totalPaid*100):0;
    return{mp,totalInt,totalPaid,rows,years,payoff,actualMonths,intRatio};
  },[loan,rate,tenure,extra]);

  const displayRows=view==="annual"
    ?(showAll?r.years:r.years.slice(0,10))
    :(showAll?r.rows:r.rows.slice(0,24));

  return(<div>
    <div className="calc-input-panel">
      {/* Loan Amount */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💰</span>Loan Amount</label>
        <input type="range" className="calc-field__slider" min={10000} max={1000000} step={5000} value={loan} onChange={e=>setLoan(+e.target.value)}/>
        <input type="text" className="calc-field__input" value={loan.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setLoan(v);}}/>
      </div>

      {/* Loan Term */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📅</span>Loan Term (Years)</label>
        <input type="range" className="calc-field__slider" min={1} max={30} step={1} value={termYears} onChange={e=>setTermYears(+e.target.value)}/>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
          <input type="text" className="calc-field__input" style={{maxWidth:"80px"}} value={termYears} inputMode="numeric"
            onChange={e=>{const v=parseInt(e.target.value);if(!isNaN(v)&&v>0&&v<=30)setTermYears(v);}}/>
          <span className="t-body-sm text-muted">years = {tenure} months</span>
        </div>
      </div>

      {/* Interest Rate */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📊</span>Interest Rate (%)</label>
        <input type="range" className="calc-field__slider" min={2} max={15} step={0.125} value={rate} onChange={e=>setRate(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"100px"}} value={rate} inputMode="decimal"
          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setRate(v);}}/>
      </div>

      {/* Extra Monthly Payment */}
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💸</span>Extra Monthly Payment (optional)</label>
        <input type="text" className="calc-field__input" value={extra===0?"":extra.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));setExtra(isNaN(v)?0:v);}}/>
      </div>
    </div>

    {/* ── Results ── */}
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Monthly Payment</p>
      <p className="calc-result__emi">{fmtUSD(r.mp+extra)}<span style={{fontSize:"0.5em",fontWeight:400}}>/mo</span></p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Total of {r.actualMonths} Payments</p><p className="calc-result__stat-value">{fmtUSD(r.totalPaid)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Total Interest</p><p className="calc-result__stat-value" style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.totalInt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Payoff Date</p><p className="calc-result__stat-value" style={{color:"var(--n-success)"}}>{r.payoff}</p></div>
      </div>
      {extra>0&&<div className="calc-result__breakdown" style={{marginTop:"var(--s-3)"}}>
        <p className="calc-result__breakdown-line" style={{color:"var(--n-success)",fontWeight:600}}>💡 Extra ${extra}/mo saves {fmtUSD(pmt(rate/100/12,tenure,loan)*tenure-loan-r.totalInt)} in interest and pays off {Math.round((tenure-r.actualMonths)/12)} years early!</p>
      </div>}
      <div className="calc-result__breakdown" style={{marginTop:"var(--s-3)"}}>
        <p className="calc-result__breakdown-line">Interest-to-Principal Ratio: {r.intRatio.toFixed(1)}% interest / {(100-r.intRatio).toFixed(1)}% principal</p>
      </div>
    </div>

    {/* ── Amortization Schedule ── */}
    <div style={{marginTop:"var(--s-6)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"var(--s-4)"}}>
        <h3 className="t-h3">Amortization Schedule</h3>
        <div className="tax-toggle">
          <button className={`tax-toggle__btn${view==="annual"?" active":""}`} onClick={()=>{setView("annual");setShowAll(false);}}>Annual</button>
          <button className={`tax-toggle__btn${view==="monthly"?" active":""}`} onClick={()=>{setView("monthly");setShowAll(false);}}>Monthly</button>
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        {view==="annual"?(
          <table className="comparison-table">
            <thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Ending Balance</th></tr></thead>
            <tbody>{(displayRows as typeof r.years).map(y=>(
              <tr key={y.yr}><td>{y.yr}</td><td>{fmtUSD(y.prin)}</td><td>{fmtUSD(y.int)}</td><td>{fmtUSD(y.bal)}</td></tr>
            ))}</tbody>
          </table>
        ):(
          <table className="comparison-table">
            <thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody>{(displayRows as typeof r.rows).map(row=>(
              <tr key={row.m}><td>{row.m}</td><td>{fmtUSD(row.pmt)}</td><td>{fmtUSD(row.prin)}</td><td>{fmtUSD(row.int)}</td><td>{fmtUSD(row.bal)}</td></tr>
            ))}</tbody>
          </table>
        )}
        {(view==="annual"?r.years.length>10:r.rows.length>24)&&(
          <button className="btn btn--ghost" style={{marginTop:"var(--s-2)"}} onClick={()=>setShowAll(!showAll)}>
            {showAll?"Show Less":`Show All ${view==="annual"?r.years.length:r.rows.length} ${view==="annual"?"Years":"Months"}`}
          </button>
        )}
      </div>
    </div>
  </div>);
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
      <p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-success)"}}>Save {fmtUSD(r.savedInt)} in interest</p>
      <p style={{fontSize:"var(--t-body)",fontWeight:700,color:"var(--n-success)"}}>Pay off {r.savedMonths} months earlier!</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-3)"}}>
        <div><p className="calc-field__label">ORIGINAL</p><p style={{fontWeight:700}}>{r.m1} months | Int: {fmtUSD(r.int1)}</p></div>
        <div><p className="calc-field__label">WITH EXTRA</p><p style={{fontWeight:700,color:"var(--n-success)"}}>{r.m2} months | Int: {fmtUSD(r.int2)}</p></div>
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
      <p style={{fontSize:"var(--t-h2)",fontWeight:700,color:worth?"var(--n-success)":"var(--n-error, #ef4444)"}}>{worth?"✅ Refinancing saves "+fmtUSD(r.saving):"❌ Refinancing costs "+fmtUSD(Math.abs(r.saving))+" more"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-3)"}}>
        <div><p className="calc-field__label">CURRENT EMI</p><p style={{fontWeight:700}}>{fmtUSD(r.emi1)}</p></div>
        <div><p className="calc-field__label">NEW EMI</p><p style={{fontWeight:700,color:"var(--n-success)"}}>{fmtUSD(r.emi2)}</p></div>
      </div>
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Monthly savings: {fmtUSD(r.monthlySave)} | Break-even: {r.breakEven} months</p>
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

// ─── 14. Debt-to-Income (DTI) Ratio ───
function DebtRatioCalc({defaults}:P){
  const[income,setIncome]=useState(85000);
  const[housing,setHousing]=useState(1500);
  const[carLoan,setCarLoan]=useState(350);
  const[studentLoan,setStudentLoan]=useState(300);
  const[creditCards,setCreditCards]=useState(200);
  const[otherDebt,setOtherDebt]=useState(0);
  const[creditLimit,setCreditLimit]=useState(15000);

  const r=useMemo(()=>{
    const monthlyGross=income/12;
    const totalDebt=housing+carLoan+studentLoan+creditCards+otherDebt;
    const frontEnd=monthlyGross>0?(housing/monthlyGross*100):0;
    const backEnd=monthlyGross>0?(totalDebt/monthlyGross*100):0;
    const creditUtil=creditLimit>0?(creditCards/creditLimit*100*12):0; // rough: monthly payment * 12 vs limit
    // Mortgage qualification
    const convOk=frontEnd<=28&&backEnd<=36;
    const fhaOk=frontEnd<=31&&backEnd<=43;
    const vaOk=backEnd<=41;
    // Health
    let health="Excellent";
    let healthColor="var(--n-success)";
    if(backEnd>20){health="Good";healthColor="var(--n-success)";}
    if(backEnd>36){health="Fair";healthColor="var(--n-warning)";}
    if(backEnd>43){health="Poor";healthColor="var(--n-error)";}
    if(backEnd>50){health="Critical";healthColor="var(--n-error)";}
    return{monthlyGross,totalDebt,frontEnd,backEnd,creditUtil:Math.min(creditUtil,100),convOk,fhaOk,vaOk,health,healthColor,remaining:monthlyGross-totalDebt};
  },[income,housing,carLoan,studentLoan,creditCards,otherDebt,creditLimit]);

  return(<div>
    <div className="calc-input-panel">
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💰</span>Annual Gross Income</label>
        <input type="range" className="calc-field__slider" min={20000} max={300000} step={5000} value={income} onChange={e=>setIncome(+e.target.value)}/>
        <input type="text" className="calc-field__input" value={income.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setIncome(v);}}/>
      </div>

      <p className="calc-field__label" style={{marginTop:"var(--s-4)",marginBottom:"var(--s-2)"}}>MONTHLY DEBT PAYMENTS</p>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏠</span>Housing (mortgage/rent)</label>
        <input type="range" className="calc-field__slider" min={0} max={5000} step={50} value={housing} onChange={e=>setHousing(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={housing.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setHousing(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🚗</span>Car Loan</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={carLoan===0?"":carLoan.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));setCarLoan(isNaN(v)?0:v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🎓</span>Student Loans</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={studentLoan===0?"":studentLoan.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));setStudentLoan(isNaN(v)?0:v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💳</span>Credit Card Min. Payments</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={creditCards===0?"":creditCards.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));setCreditCards(isNaN(v)?0:v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📝</span>Other Monthly Debts</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={otherDebt===0?"":otherDebt.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));setOtherDebt(isNaN(v)?0:v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏦</span>Total Credit Card Limit (for utilization)</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"140px"}} value={creditLimit.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setCreditLimit(v);}}/>
      </div>
    </div>

    {/* ── Results ── */}
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Your Debt-to-Income Ratio</p>
      <p className="calc-result__emi" style={{color:r.healthColor}}>{r.backEnd.toFixed(1)}%</p>
      <p className="t-body-sm" style={{textAlign:"center",fontWeight:600,color:r.healthColor,marginBottom:"var(--s-3)"}}>{r.health}</p>

      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Front-End DTI</p><p className="calc-result__stat-value">{r.frontEnd.toFixed(1)}%</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Back-End DTI</p><p className="calc-result__stat-value">{r.backEnd.toFixed(1)}%</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Monthly Remaining</p><p className="calc-result__stat-value" style={{color:r.remaining>0?"var(--n-success)":"var(--n-error)"}}>{fmtUSD(r.remaining)}</p></div>
      </div>

      {/* DTI Gauge */}
      <div style={{marginTop:"var(--s-4)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span className="t-body-sm">Back-End DTI</span><span className="t-body-sm" style={{fontWeight:600}}>{r.backEnd.toFixed(1)}%</span></div>
        <div style={{background:"var(--n-surface-alt)",borderRadius:"4px",height:"10px",overflow:"hidden",position:"relative"}}>
          <div style={{width:`${Math.min(r.backEnd/60*100,100)}%`,height:"100%",background:r.backEnd<=36?"var(--n-success)":r.backEnd<=43?"var(--n-warning)":"var(--n-error)",borderRadius:"4px",transition:"width 0.3s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"2px"}}><span className="t-body-sm text-muted">≤ 20% Excellent</span><span className="t-body-sm text-muted">36% Conv</span><span className="t-body-sm text-muted">43% FHA</span><span className="t-body-sm text-muted">50%+</span></div>
      </div>

      {/* Mortgage Qualification */}
      <div style={{marginTop:"var(--s-4)"}}>
        <p className="calc-field__label">Mortgage Qualification</p>
        <div style={{display:"flex",gap:"var(--s-3)",marginTop:"var(--s-2)",flexWrap:"wrap"}}>
          <div style={{padding:"var(--s-2) var(--s-3)",borderRadius:"8px",background:r.convOk?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${r.convOk?"var(--n-success)":"var(--n-error)"}`,fontSize:"var(--t-body-sm)"}}>{r.convOk?"✅":"❌"} Conventional (28/36)</div>
          <div style={{padding:"var(--s-2) var(--s-3)",borderRadius:"8px",background:r.fhaOk?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${r.fhaOk?"var(--n-success)":"var(--n-error)"}`,fontSize:"var(--t-body-sm)"}}>{r.fhaOk?"✅":"❌"} FHA (31/43)</div>
          <div style={{padding:"var(--s-2) var(--s-3)",borderRadius:"8px",background:r.vaOk?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${r.vaOk?"var(--n-success)":"var(--n-error)"}`,fontSize:"var(--t-body-sm)"}}>{r.vaOk?"✅":"❌"} VA (41)</div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div style={{marginTop:"var(--s-4)",overflowX:"auto"}}>
        <table className="comparison-table">
          <thead><tr><th>Debt Category</th><th>Monthly</th><th>% of Income</th></tr></thead>
          <tbody>
            <tr><td>Housing</td><td>{fmtUSD(housing)}</td><td>{(housing/r.monthlyGross*100).toFixed(1)}%</td></tr>
            {carLoan>0&&<tr><td>Car Loan</td><td>{fmtUSD(carLoan)}</td><td>{(carLoan/r.monthlyGross*100).toFixed(1)}%</td></tr>}
            {studentLoan>0&&<tr><td>Student Loans</td><td>{fmtUSD(studentLoan)}</td><td>{(studentLoan/r.monthlyGross*100).toFixed(1)}%</td></tr>}
            {creditCards>0&&<tr><td>Credit Cards</td><td>{fmtUSD(creditCards)}</td><td>{(creditCards/r.monthlyGross*100).toFixed(1)}%</td></tr>}
            {otherDebt>0&&<tr><td>Other Debts</td><td>{fmtUSD(otherDebt)}</td><td>{(otherDebt/r.monthlyGross*100).toFixed(1)}%</td></tr>}
            <tr style={{fontWeight:700}}><td>Total</td><td>{fmtUSD(r.totalDebt)}</td><td>{r.backEnd.toFixed(1)}%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>);
}

// ─── 15. Rent Affordability ───
function RentAffordabilityCalc({defaults}:P){
  const[income,setIncome]=useState(55000);
  const[debts,setDebts]=useState(400);
  const[rentPct,setRentPct]=useState(30);
  const[utilities,setUtilities]=useState(200);
  const[savings,setSavings]=useState(5000);

  const r=useMemo(()=>{
    const monthlyGross=income/12;
    const monthlyNet=monthlyGross*0.75; // approx after-tax
    const maxRent=monthlyGross*rentPct/100;
    const totalHousing=maxRent+utilities;
    const remaining=monthlyNet-totalHousing-debts;
    const annualRent=maxRent*12;
    const rentDti=monthlyGross>0?(maxRent/monthlyGross*100):0;
    const totalDti=monthlyGross>0?((maxRent+debts)/monthlyGross*100):0;
    const monthsEmergency=maxRent>0?(savings/maxRent):0;
    return{maxRent,totalHousing,remaining:Math.max(0,remaining),annualRent,rentDti,totalDti,monthlyGross,monthlyNet,monthsEmergency};
  },[income,debts,rentPct,utilities,savings]);

  return(<div>
    <div className="calc-input-panel">
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💰</span>Annual Gross Income</label>
        <input type="range" className="calc-field__slider" min={20000} max={200000} step={5000} value={income} onChange={e=>setIncome(+e.target.value)}/>
        <input type="text" className="calc-field__input" value={income.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setIncome(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💳</span>Monthly Debts (car, student loans, cards)</label>
        <input type="range" className="calc-field__slider" min={0} max={2000} step={50} value={debts} onChange={e=>setDebts(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={debts.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setDebts(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📊</span>Recommended Rent (% of gross income)</label>
        <input type="range" className="calc-field__slider" min={20} max={40} step={1} value={rentPct} onChange={e=>setRentPct(+e.target.value)}/>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center"}}>
          <input type="text" className="calc-field__input" style={{maxWidth:"80px"}} value={rentPct} inputMode="numeric"
            onChange={e=>{const v=parseInt(e.target.value);if(!isNaN(v))setRentPct(v);}}/>
          <span className="t-body-sm text-muted">{rentPct<=30?"✅ Within 30% rule":"⚠️ Above 30% guideline"}</span>
        </div>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">⚡</span>Estimated Monthly Utilities</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"120px"}} value={utilities.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setUtilities(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏦</span>Current Savings (emergency fund)</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"140px"}} value={savings.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setSavings(v);}}/>
      </div>
    </div>

    {/* ── Results ── */}
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Maximum Affordable Rent</p>
      <p className="calc-result__emi">{fmtUSD(r.maxRent)}<span style={{fontSize:"var(--t-body)",fontWeight:400}}>/month</span></p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Annual Rent Cost</p><p className="calc-result__stat-value">{fmtUSD(r.annualRent)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Monthly Remaining</p><p className="calc-result__stat-value" style={{color:r.remaining>0?"var(--n-success)":"var(--n-error)"}}>{fmtUSD(r.remaining)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Emergency Fund</p><p className="calc-result__stat-value">{r.monthsEmergency.toFixed(1)} months</p></div>
      </div>

      {/* Monthly Budget Breakdown */}
      <div style={{marginTop:"var(--s-4)",overflowX:"auto"}}>
        <table className="comparison-table">
          <thead><tr><th>Budget Category</th><th>Monthly</th><th>% of Gross</th></tr></thead>
          <tbody>
            <tr><td>Rent</td><td>{fmtUSD(r.maxRent)}</td><td>{r.rentDti.toFixed(1)}%</td></tr>
            <tr><td>Utilities</td><td>{fmtUSD(utilities)}</td><td>{(utilities/r.monthlyGross*100).toFixed(1)}%</td></tr>
            <tr><td>Debts</td><td>{fmtUSD(debts)}</td><td>{(debts/r.monthlyGross*100).toFixed(1)}%</td></tr>
            <tr><td>Est. Taxes (~25%)</td><td>{fmtUSD(r.monthlyGross*0.25)}</td><td>25.0%</td></tr>
            <tr style={{fontWeight:700,color:r.remaining>0?"var(--n-success)":"var(--n-error)"}}><td>Remaining</td><td>{fmtUSD(r.remaining)}</td><td>{(r.remaining/r.monthlyGross*100).toFixed(1)}%</td></tr>
          </tbody>
        </table>
      </div>

      {/* DTI Bar */}
      <div style={{marginTop:"var(--s-4)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span className="t-body-sm">Total DTI (rent + debts)</span><span className="t-body-sm" style={{fontWeight:600}}>{r.totalDti.toFixed(1)}%</span></div>
        <div style={{background:"var(--n-surface-alt)",borderRadius:"4px",height:"8px",overflow:"hidden"}}><div style={{width:`${Math.min(r.totalDti/60*100,100)}%`,height:"100%",background:r.totalDti<=36?"var(--n-success)":r.totalDti<=43?"var(--n-warning)":"var(--n-error)",borderRadius:"4px",transition:"width 0.3s"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span className="t-body-sm text-muted">Ideal: ≤ 30%</span><span className="t-body-sm text-muted">Max: 43%</span></div>
      </div>
    </div>
  </div>);
}

// ─── 16. Down Payment ───
function DownPaymentCalc({defaults}:P){
  const[homePrice,setHomePrice]=useState(350000);
  const[downPct,setDownPct]=useState(20);
  const[closingPct,setClosingPct]=useState(3);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[termYears]=useState(30);

  const r=useMemo(()=>{
    const downAmt=homePrice*downPct/100;
    const closingCosts=homePrice*closingPct/100;
    const totalUpfront=downAmt+closingCosts;
    const loanAmt=homePrice-downAmt;
    const mr=rate/100/12;const n=termYears*12;
    const monthlyPI=loanAmt>0?loanAmt*mr*Math.pow(1+mr,n)/(Math.pow(1+mr,n)-1):0;
    const pmiRate=downPct<20?0.005/12:0;
    const monthlyPMI=loanAmt*pmiRate;
    const totalMonthly=monthlyPI+monthlyPMI;
    // Comparison scenarios
    const scenarios=[5,10,20].map(pct=>{
      const dp=homePrice*pct/100;
      const la=homePrice-dp;
      const pi=la>0?la*mr*Math.pow(1+mr,n)/(Math.pow(1+mr,n)-1):0;
      const pmi=pct<20?la*0.005/12:0;
      return{pct,dp,la,pi,pmi,total:pi+pmi,upfront:dp+closingCosts,totalInterest:pi*n-la};
    });
    return{downAmt,closingCosts,totalUpfront,loanAmt,monthlyPI,monthlyPMI,totalMonthly,scenarios};
  },[homePrice,downPct,closingPct,rate,termYears]);

  return(<div>
    <div className="calc-input-panel">
      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">🏠</span>Home Price</label>
        <input type="range" className="calc-field__slider" min={100000} max={1000000} step={10000} value={homePrice} onChange={e=>setHomePrice(+e.target.value)}/>
        <input type="text" className="calc-field__input" value={homePrice.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=parseInt(e.target.value.replace(/,/g,""));if(!isNaN(v))setHomePrice(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">💰</span>Down Payment (%)</label>
        <input type="range" className="calc-field__slider" min={0} max={30} step={0.5} value={downPct} onChange={e=>setDownPct(+e.target.value)}/>
        <div style={{display:"flex",gap:"var(--s-2)",alignItems:"center",flexWrap:"wrap"}}>
          <input type="text" className="calc-field__input" style={{maxWidth:"80px"}} value={downPct} inputMode="decimal"
            onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setDownPct(v);}}/>
          <span className="t-body-sm" style={{fontWeight:600}}>{fmtUSD(r.downAmt)}</span>
        </div>
        <div className="tax-toggle" style={{marginTop:"var(--s-2)"}}>
          <button className={`tax-toggle__btn${downPct===20?" active":""}`} onClick={()=>setDownPct(20)}>Conv 20%</button>
          <button className={`tax-toggle__btn${downPct===3.5?" active":""}`} onClick={()=>setDownPct(3.5)}>FHA 3.5%</button>
          <button className={`tax-toggle__btn${downPct===0?" active":""}`} onClick={()=>setDownPct(0)}>VA 0%</button>
        </div>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📝</span>Closing Costs (%)</label>
        <input type="text" className="calc-field__input" style={{maxWidth:"80px"}} value={closingPct} inputMode="decimal"
          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setClosingPct(v);}}/>
      </div>

      <div className="calc-field">
        <label className="calc-field__label"><span className="calc-field__label-icon">📊</span>Interest Rate (%)</label>
        <input type="range" className="calc-field__slider" min={2} max={12} step={0.125} value={rate} onChange={e=>setRate(+e.target.value)}/>
        <input type="text" className="calc-field__input" style={{maxWidth:"100px"}} value={rate} inputMode="decimal"
          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setRate(v);}}/>
      </div>
    </div>

    {/* ── Results ── */}
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Total Upfront Cash Needed</p>
      <p className="calc-result__emi">{fmtUSD(r.totalUpfront)}</p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Down Payment</p><p className="calc-result__stat-value">{fmtUSD(r.downAmt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Closing Costs</p><p className="calc-result__stat-value">{fmtUSD(r.closingCosts)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Monthly Payment</p><p className="calc-result__stat-value">{fmtUSD(r.totalMonthly)}</p></div>
      </div>

      {/* PMI Status */}
      <div style={{marginTop:"var(--s-3)",padding:"var(--s-3)",borderRadius:"8px",background:downPct>=20?"rgba(34,197,94,0.1)":"rgba(234,179,8,0.1)",border:`1px solid ${downPct>=20?"var(--n-success)":"var(--n-warning)"}`}}>
        <p className="t-body-sm" style={{fontWeight:600}}>{downPct>=20?"✅ No PMI required":`⚠️ PMI required: ${fmtUSD(r.monthlyPMI)}/month (~${fmtUSD(r.monthlyPMI*12)}/year)`}</p>
        {downPct<20&&<p className="t-body-sm text-muted">PMI is removed once you reach 20% equity. On this loan, that's {fmtUSD(homePrice*0.20)} in equity.</p>}
      </div>

      {/* Comparison Table */}
      <div style={{marginTop:"var(--s-4)",overflowX:"auto"}}>
        <p className="calc-field__label">Down Payment Comparison</p>
        <table className="comparison-table">
          <thead><tr><th></th>{r.scenarios.map(s=><th key={s.pct}>{s.pct}% Down</th>)}</tr></thead>
          <tbody>
            <tr><td>Down Payment</td>{r.scenarios.map(s=><td key={s.pct}>{fmtUSD(s.dp)}</td>)}</tr>
            <tr><td>Total Upfront</td>{r.scenarios.map(s=><td key={s.pct}>{fmtUSD(s.upfront)}</td>)}</tr>
            <tr><td>Loan Amount</td>{r.scenarios.map(s=><td key={s.pct}>{fmtUSD(s.la)}</td>)}</tr>
            <tr><td>Monthly P&I</td>{r.scenarios.map(s=><td key={s.pct}>{fmtUSD(s.pi)}</td>)}</tr>
            <tr><td>Monthly PMI</td>{r.scenarios.map(s=><td key={s.pct} style={{color:s.pmi>0?"var(--n-warning)":"var(--n-success)"}}>{s.pmi>0?fmtUSD(s.pmi):"$0"}</td>)}</tr>
            <tr style={{fontWeight:700}}><td>Total Monthly</td>{r.scenarios.map(s=><td key={s.pct}>{fmtUSD(s.total)}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>);
}

// ─── 18. APR Calculator ───
function APRCalc({defaults}:P){
  const[loan,setLoan]=useState(defaults.amount||300000);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[tenure,setTenure]=useState(defaults.tenure||360);
  const[feeCompounded,setFeeCompounded]=useState(1500);
  const[feeFinanced,setFeeFinanced]=useState(2000);
  const[feePaidUpfront,setFeePaidUpfront]=useState(3000);

  const r=useMemo(()=>{
    const totalFees=feeCompounded+feeFinanced+feePaidUpfront;
    // Effective loan: add compounded + financed fees to principal
    const effectiveLoan=loan+feeCompounded+feeFinanced;
    const mr=rate/100/12;
    // Monthly payment on stated rate with actual loan
    const mp=pmt(mr,tenure,loan);
    // Monthly payment on effective loan (what you actually pay)
    const mpEffective=pmt(mr,tenure,effectiveLoan);
    // Total cost = payments + upfront fees
    const totalPaid=mpEffective*tenure+feePaidUpfront;
    const totalInterest=totalPaid-loan;
    // Newton-Raphson to find real APR
    // Real APR: solve for r where PV(r,tenure,mpEffective) = loan - feePaidUpfront
    // i.e., find monthly rate where payments equal net loan proceeds
    const netProceeds=loan-feePaidUpfront;
    let aprM=mr;
    for(let i=0;i<100;i++){
      const ea=Math.pow(1+aprM,tenure);
      const pvPayments=mpEffective*(ea-1)/(aprM*ea);
      const f=pvPayments-netProceeds;
      // derivative
      const dp=mpEffective*((tenure*Math.pow(1+aprM,tenure-1)*(aprM*ea)-(ea-1)*(ea+aprM*tenure*Math.pow(1+aprM,tenure-1)))/(aprM*ea)**2);
      const dApr=f/(dp||1);
      aprM-=dApr*0.5;
      if(Math.abs(dApr)<1e-10)break;
      if(aprM<=0)aprM=0.0001;
    }
    const realAPR=aprM*12*100;
    const rateDiff=realAPR-rate;
    return{mp,mpEffective,totalFees,totalPaid,totalInterest,realAPR,rateDiff,netProceeds,effectiveLoan};
  },[loan,rate,tenure,feeCompounded,feeFinanced,feePaidUpfront]);

  return(<div><div className="calc-input-panel">
    <div style={{display:"grid",gridTemplateColumns:"1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">🏠 LOAN AMOUNT ($)</label>
        <input type="text" className="calc-field__input" value={loan.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setLoan(v);}}/>
        <input type="range" className="calc-field__slider" min={50000} max={1000000} step={5000} value={loan} onChange={e=>setLoan(Number(e.target.value))}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
        <div className="calc-field">
          <label className="calc-field__label">% INTEREST RATE</label>
          <input type="number" className="calc-field__input" value={rate} onChange={e=>setRate(Number(e.target.value))} step={0.125} min={0.5} max={15}/>
          <input type="range" className="calc-field__slider" min={2} max={12} step={0.125} value={rate} onChange={e=>setRate(Number(e.target.value))}/>
        </div>
        <div className="calc-field">
          <label className="calc-field__label">📅 LOAN TERM (years)</label>
          <input type="number" className="calc-field__input" value={tenure/12} onChange={e=>setTenure(Number(e.target.value)*12)} step={1} min={1} max={30}/>
        </div>
      </div>
    </div>
    <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
    <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>FEES & CHARGES</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">Compounded Into Loan</label>
        <input type="text" className="calc-field__input" value={feeCompounded===0?"":feeCompounded.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setFeeCompounded(v);}}/>
        <p className="t-body-sm text-muted" style={{marginTop:"2px"}}>Added to balance & accrues interest</p>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">Financed Into Loan</label>
        <input type="text" className="calc-field__input" value={feeFinanced===0?"":feeFinanced.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setFeeFinanced(v);}}/>
        <p className="t-body-sm text-muted" style={{marginTop:"2px"}}>Added to balance, no extra interest</p>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">Paid Upfront at Closing</label>
        <input type="text" className="calc-field__input" value={feePaidUpfront===0?"":feePaidUpfront.toLocaleString("en-US")} inputMode="numeric" placeholder="$0"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setFeePaidUpfront(v);}}/>
        <p className="t-body-sm text-muted" style={{marginTop:"2px"}}>Paid cash at closing</p>
      </div>
    </div>
  </div>

    {/* Real APR Result */}
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">REAL APR (Annual Percentage Rate)</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)"}}>{r.realAPR.toFixed(3)}%</p>
      <p style={{fontSize:"var(--t-body)",fontWeight:600,color:"var(--n-warning)",marginTop:"var(--s-2)"}}>
        +{r.rateDiff.toFixed(3)}% higher than stated rate of {rate}%
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-4)"}}>
        <div><p className="calc-field__label">MONTHLY PAYMENT</p><p style={{fontWeight:700}}>{fmtUSD(r.mpEffective)}</p></div>
        <div><p className="calc-field__label">TOTAL FEES</p><p style={{fontWeight:700,color:"var(--n-warning)"}}>{fmtUSD(r.totalFees)}</p></div>
        <div><p className="calc-field__label">TOTAL COST</p><p style={{fontWeight:700}}>{fmtUSD(r.totalPaid)}</p></div>
      </div>
    </div>

    {/* Comparison */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>COST COMPARISON: WITH vs WITHOUT FEES</p>
      <table className="calc-table"><thead><tr><th></th><th>No Fees (Stated Rate)</th><th>With Fees (Real APR)</th><th>Difference</th></tr></thead><tbody>
        <tr><td>Rate</td><td>{rate}%</td><td style={{fontWeight:600,color:"var(--n-warning)"}}>{r.realAPR.toFixed(3)}%</td><td>+{r.rateDiff.toFixed(3)}%</td></tr>
        <tr><td>Monthly Payment</td><td>{fmtUSD(r.mp)}</td><td>{fmtUSD(r.mpEffective)}</td><td style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.mpEffective-r.mp)}</td></tr>
        <tr><td>Total Interest</td><td>{fmtUSD(r.mp*tenure-loan)}</td><td>{fmtUSD(r.totalInterest)}</td><td style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.totalInterest-(r.mp*tenure-loan))}</td></tr>
        <tr style={{fontWeight:700}}><td>Total Cost</td><td>{fmtUSD(r.mp*tenure)}</td><td>{fmtUSD(r.totalPaid)}</td><td style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.totalPaid-r.mp*tenure)}</td></tr>
      </tbody></table>
    </div>

    {/* Fee Breakdown */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>FEE BREAKDOWN</p>
      <table className="calc-table"><thead><tr><th>Fee Type</th><th>Amount</th><th>How It Affects Your Loan</th></tr></thead><tbody>
        <tr><td>Compounded Fees</td><td>{fmtUSD(feeCompounded)}</td><td>Added to principal — you pay interest on these fees</td></tr>
        <tr><td>Financed Fees</td><td>{fmtUSD(feeFinanced)}</td><td>Added to loan balance — increases payment amount</td></tr>
        <tr><td>Upfront Fees</td><td>{fmtUSD(feePaidUpfront)}</td><td>Paid cash at closing — reduces net loan proceeds</td></tr>
        <tr style={{fontWeight:700}}><td>Total Fees</td><td>{fmtUSD(r.totalFees)}</td><td>= {(r.totalFees/loan*100).toFixed(2)}% of loan amount</td></tr>
      </tbody></table>
    </div>
  </div>);
}

// ─── 19. Home Equity Loan Calculator ───
function HomeEquityCalc({defaults}:P){
  const[mode,setMode]=useState<"payment"|"borrow">("payment");
  // Payment mode
  const[loanAmt,setLoanAmt]=useState(defaults.amount||100000);
  const[rate,setRate]=useState(defaults.rate||8.5);
  const[tenure,setTenure]=useState(defaults.tenure||180);
  const[closingCost,setClosing]=useState(3000);
  // Borrow mode
  const[homeVal,setHomeVal]=useState(500000);
  const[mtgBalance,setMtgBal]=useState(250000);
  const[maxLTV,setMaxLTV]=useState(80);

  const payR=useMemo(()=>{
    const mr=rate/100/12;
    const mp=pmt(mr,tenure,loanAmt);
    const totalPaid=mp*tenure;
    const totalInt=totalPaid-loanAmt;
    // APR with closing costs
    let aprM=mr;
    const net=loanAmt-closingCost;
    if(net>0){
      for(let i=0;i<100;i++){
        const ea=Math.pow(1+aprM,tenure);
        const pv=mp*(ea-1)/(aprM*ea);
        const f=pv-net;
        const dp2=mp*((tenure*Math.pow(1+aprM,tenure-1)*(aprM*ea)-(ea-1)*(ea+aprM*tenure*Math.pow(1+aprM,tenure-1)))/(aprM*ea)**2);
        const d=f/(dp2||1);
        aprM-=d*0.5;
        if(Math.abs(d)<1e-10)break;
        if(aprM<=0)aprM=0.0001;
      }
    }
    const apr=aprM*12*100;
    return{mp,totalPaid,totalInt,apr};
  },[loanAmt,rate,tenure,closingCost]);

  const borR=useMemo(()=>{
    const maxBorrow=homeVal*(maxLTV/100)-mtgBalance;
    const equity=homeVal-mtgBalance;
    const eqPct=homeVal>0?(equity/homeVal*100):0;
    const currentLTV=homeVal>0?(mtgBalance/homeVal*100):0;
    return{maxBorrow:Math.max(0,maxBorrow),equity,eqPct,currentLTV};
  },[homeVal,mtgBalance,maxLTV]);

  return(<div>
    {/* Mode toggle */}
    <div style={{display:"flex",gap:"var(--s-2)",marginBottom:"var(--s-4)"}}>
      {(["payment","borrow"] as const).map(m=>(
        <button key={m} onClick={()=>setMode(m)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-3)",fontWeight:mode===m?700:400,background:mode===m?"var(--n-primary)":"var(--n-surface-alt)",color:mode===m?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-md)",cursor:"pointer"}}>
          {m==="payment"?"💰 Payment Calculator":"🏠 Borrowing Power"}
        </button>
      ))}
    </div>

    {mode==="payment"?(<>
      <div className="calc-input-panel">
        <div className="calc-field">
          <label className="calc-field__label">💰 LOAN AMOUNT ($)</label>
          <input type="text" className="calc-field__input" value={loanAmt.toLocaleString("en-US")} inputMode="numeric"
            onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setLoanAmt(v);}}/>
          <input type="range" className="calc-field__slider" min={10000} max={500000} step={5000} value={loanAmt} onChange={e=>setLoanAmt(Number(e.target.value))}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
          <div className="calc-field">
            <label className="calc-field__label">% INTEREST RATE</label>
            <input type="number" className="calc-field__input" value={rate} onChange={e=>setRate(Number(e.target.value))} step={0.25} min={3} max={15}/>
            <input type="range" className="calc-field__slider" min={3} max={15} step={0.25} value={rate} onChange={e=>setRate(Number(e.target.value))}/>
          </div>
          <div className="calc-field">
            <label className="calc-field__label">📅 LOAN TERM (years)</label>
            <input type="number" className="calc-field__input" value={tenure/12} onChange={e=>setTenure(Number(e.target.value)*12)} step={1} min={5} max={30}/>
          </div>
        </div>
        <div className="calc-field">
          <label className="calc-field__label">💳 CLOSING COSTS ($)</label>
          <input type="text" className="calc-field__input" value={closingCost.toLocaleString("en-US")} inputMode="numeric"
            onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setClosing(v);}}/>
        </div>
      </div>
      <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
        <p className="calc-field__label">MONTHLY PAYMENT</p>
        <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)"}}>{fmtUSD(payR.mp)}/mo</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-4)"}}>
          <div><p className="calc-field__label">TOTAL INTEREST</p><p style={{fontWeight:700}}>{fmtUSD(payR.totalInt)}</p></div>
          <div><p className="calc-field__label">CLOSING COSTS</p><p style={{fontWeight:700,color:"var(--n-warning)"}}>{fmtUSD(closingCost)}</p></div>
          <div><p className="calc-field__label">TOTAL COST</p><p style={{fontWeight:700}}>{fmtUSD(payR.totalPaid+closingCost)}</p></div>
          <div><p className="calc-field__label">EFFECTIVE APR</p><p style={{fontWeight:700,color:"var(--n-warning)"}}>{payR.apr.toFixed(3)}%</p></div>
        </div>
      </div>
      {/* Comparison with alternatives */}
      <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
        <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>HOME EQUITY LOAN vs ALTERNATIVES</p>
        <table className="calc-table"><thead><tr><th>Feature</th><th>Home Equity Loan</th><th>HELOC</th><th>Cash-Out Refinance</th></tr></thead><tbody>
          <tr><td>Rate Type</td><td style={{color:"var(--n-success)"}}>Fixed ✓</td><td>Variable</td><td>Fixed or Variable</td></tr>
          <tr><td>Disbursement</td><td>Lump sum</td><td>Draw as needed</td><td>Lump sum</td></tr>
          <tr><td>Typical Rate</td><td>8-10%</td><td>7-9%</td><td>6-8%</td></tr>
          <tr><td>Closing Costs</td><td>2-5%</td><td>0-2%</td><td>2-6%</td></tr>
          <tr><td>Tax Deductible</td><td>If for home improvement</td><td>If for home improvement</td><td>Mortgage interest</td></tr>
          <tr><td>Best For</td><td>One-time large expense</td><td>Ongoing expenses</td><td>Lower rate + cash</td></tr>
        </tbody></table>
      </div>
    </>):(<>
      <div className="calc-input-panel">
        <div className="calc-field">
          <label className="calc-field__label">🏠 CURRENT HOME VALUE ($)</label>
          <input type="text" className="calc-field__input" value={homeVal.toLocaleString("en-US")} inputMode="numeric"
            onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setHomeVal(v);}}/>
          <input type="range" className="calc-field__slider" min={100000} max={2000000} step={10000} value={homeVal} onChange={e=>setHomeVal(Number(e.target.value))}/>
        </div>
        <div className="calc-field">
          <label className="calc-field__label">🏦 REMAINING MORTGAGE BALANCE ($)</label>
          <input type="text" className="calc-field__input" value={mtgBalance.toLocaleString("en-US")} inputMode="numeric"
            onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setMtgBal(v);}}/>
          <input type="range" className="calc-field__slider" min={0} max={homeVal} step={5000} value={mtgBalance} onChange={e=>setMtgBal(Number(e.target.value))}/>
        </div>
        <div className="calc-field">
          <label className="calc-field__label">📊 MAX LOAN-TO-VALUE (LTV) RATIO</label>
          <div style={{display:"flex",gap:"var(--s-2)",marginBottom:"var(--s-2)"}}>
            {[70,80,85,90].map(v=>(
              <button key={v} onClick={()=>setMaxLTV(v)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-2)",fontWeight:maxLTV===v?700:400,background:maxLTV===v?"var(--n-primary)":"var(--n-surface-alt)",color:maxLTV===v?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-sm)",cursor:"pointer"}}>{v}%</button>
            ))}
          </div>
          <input type="range" className="calc-field__slider" min={60} max={95} step={5} value={maxLTV} onChange={e=>setMaxLTV(Number(e.target.value))}/>
        </div>
      </div>
      <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
        <p className="calc-field__label">MAX HOME EQUITY LOAN AMOUNT</p>
        <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:borR.maxBorrow>0?"var(--n-success)":"var(--n-error, #ef4444)"}}>{fmtUSD(borR.maxBorrow)}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-4)"}}>
          <div><p className="calc-field__label">HOME EQUITY</p><p style={{fontWeight:700}}>{fmtUSD(borR.equity)} ({borR.eqPct.toFixed(1)}%)</p></div>
          <div><p className="calc-field__label">CURRENT LTV</p><p style={{fontWeight:700}}>{borR.currentLTV.toFixed(1)}%</p></div>
          <div><p className="calc-field__label">MAX LTV ALLOWED</p><p style={{fontWeight:700}}>{maxLTV}%</p></div>
        </div>
        <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Formula: ({fmtUSD(homeVal)} × {maxLTV}%) − {fmtUSD(mtgBalance)} = {fmtUSD(borR.maxBorrow)}</p>
      </div>
      {/* LTV comparison */}
      <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
        <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>BORROWING AT DIFFERENT LTV RATIOS</p>
        <table className="calc-table"><thead><tr><th>LTV Ratio</th><th>Max Loan Amount</th><th>Risk Level</th></tr></thead><tbody>
          {[70,80,85,90].map(ltv=>{
            const mx=Math.max(0,homeVal*(ltv/100)-mtgBalance);
            return(<tr key={ltv} style={ltv===maxLTV?{background:"var(--n-primary-bg, rgba(59,130,246,0.1))"}:undefined}>
              <td style={{fontWeight:ltv===maxLTV?700:400}}>{ltv}%{ltv===maxLTV?" ←":""}</td>
              <td>{fmtUSD(mx)}</td>
              <td>{ltv<=75?"Low":ltv<=80?"Moderate":ltv<=85?"Higher":"High"}</td>
            </tr>);
          })}
        </tbody></table>
      </div>
    </>)}
  </div>);
}

// ─── 20. HELOC Calculator ───
function HELOCCalc({defaults}:P){
  const[mode,setMode]=useState<"payment"|"limit">("payment");
  // Payment mode
  const[creditLimit,setCreditLimit]=useState(defaults.amount||150000);
  const[amtDrawn,setAmtDrawn]=useState(100000);
  const[drawRate,setDrawRate]=useState(defaults.rate||8.25);
  const[drawYears,setDrawYears]=useState(10);
  const[repayRate,setRepayRate]=useState(9.0);
  const[repayYears,setRepayYears]=useState(20);
  const[closingCost,setClosing]=useState(1500);
  const[annualFee,setAnnualFee]=useState(50);
  // Limit mode
  const[homeVal,setHomeVal]=useState(500000);
  const[mtgBal,setMtgBal]=useState(250000);
  const[maxLTV,setMaxLTV]=useState(85);

  const payR=useMemo(()=>{
    // Draw period: interest-only payments
    const drawMr=drawRate/100/12;
    const drawMonths=drawYears*12;
    const drawPayment=amtDrawn*drawMr;
    const drawTotalInterest=drawPayment*drawMonths;
    const drawTotalAnnualFees=annualFee*drawYears;
    // Repayment period: fully amortizing P&I on remaining balance
    const repayMr=repayRate/100/12;
    const repayMonths=repayYears*12;
    const repayPayment=pmt(repayMr,repayMonths,amtDrawn);
    const repayTotalPaid=repayPayment*repayMonths;
    const repayTotalInterest=repayTotalPaid-amtDrawn;
    const repayTotalAnnualFees=annualFee*repayYears;
    // Totals
    const totalInterest=drawTotalInterest+repayTotalInterest;
    const totalFees=closingCost+drawTotalAnnualFees+repayTotalAnnualFees;
    const totalCost=amtDrawn+totalInterest+totalFees;
    return{drawPayment,drawTotalInterest,drawTotalAnnualFees,drawMonths,repayPayment,repayTotalPaid,repayTotalInterest,repayTotalAnnualFees,repayMonths,totalInterest,totalFees,totalCost};
  },[amtDrawn,drawRate,drawYears,repayRate,repayYears,closingCost,annualFee]);

  const limR=useMemo(()=>{
    const maxCredit=homeVal*(maxLTV/100)-mtgBal;
    const equity=homeVal-mtgBal;
    const eqPct=homeVal>0?(equity/homeVal*100):0;
    const curLTV=homeVal>0?(mtgBal/homeVal*100):0;
    return{maxCredit:Math.max(0,maxCredit),equity,eqPct,curLTV};
  },[homeVal,mtgBal,maxLTV]);

  return(<div>
    <div style={{display:"flex",gap:"var(--s-2)",marginBottom:"var(--s-4)"}}>
      {(["payment","limit"] as const).map(m=>(
        <button key={m} onClick={()=>setMode(m)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-3)",fontWeight:mode===m?700:400,background:mode===m?"var(--n-primary)":"var(--n-surface-alt)",color:mode===m?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-md)",cursor:"pointer"}}>
          {m==="payment"?"💰 Payment Calculator":"🏠 Credit Limit"}
        </button>
      ))}
    </div>

    {mode==="payment"?(<>
      <div className="calc-input-panel">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
          <div className="calc-field">
            <label className="calc-field__label">💳 CREDIT LIMIT ($)</label>
            <input type="text" className="calc-field__input" value={creditLimit.toLocaleString("en-US")} inputMode="numeric"
              onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setCreditLimit(v);}}/>
            <input type="range" className="calc-field__slider" min={10000} max={500000} step={5000} value={creditLimit} onChange={e=>setCreditLimit(Number(e.target.value))}/>
          </div>
          <div className="calc-field">
            <label className="calc-field__label">💰 AMOUNT DRAWN ($)</label>
            <input type="text" className="calc-field__input" value={amtDrawn.toLocaleString("en-US")} inputMode="numeric"
              onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setAmtDrawn(Math.min(v,creditLimit));}}/>
            <input type="range" className="calc-field__slider" min={5000} max={creditLimit} step={5000} value={amtDrawn} onChange={e=>setAmtDrawn(Number(e.target.value))}/>
          </div>
        </div>
        <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
        <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>📅 DRAW PERIOD (Interest-Only)</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
          <div className="calc-field">
            <label className="calc-field__label">% Draw Period Rate</label>
            <input type="number" className="calc-field__input" value={drawRate} onChange={e=>setDrawRate(Number(e.target.value))} step={0.25}/>
          </div>
          <div className="calc-field">
            <label className="calc-field__label">Draw Period (years)</label>
            <input type="number" className="calc-field__input" value={drawYears} onChange={e=>setDrawYears(Number(e.target.value))} step={1} min={1} max={15}/>
          </div>
        </div>
        <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
        <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>📅 REPAYMENT PERIOD (Principal + Interest)</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
          <div className="calc-field">
            <label className="calc-field__label">% Repayment Rate</label>
            <input type="number" className="calc-field__input" value={repayRate} onChange={e=>setRepayRate(Number(e.target.value))} step={0.25}/>
          </div>
          <div className="calc-field">
            <label className="calc-field__label">Repayment Period (years)</label>
            <input type="number" className="calc-field__input" value={repayYears} onChange={e=>setRepayYears(Number(e.target.value))} step={1} min={5} max={25}/>
          </div>
        </div>
        <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
          <div className="calc-field">
            <label className="calc-field__label">💳 CLOSING COSTS ($)</label>
            <input type="text" className="calc-field__input" value={closingCost.toLocaleString("en-US")} inputMode="numeric"
              onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setClosing(v);}}/>
          </div>
          <div className="calc-field">
            <label className="calc-field__label">📆 ANNUAL FEE ($/yr)</label>
            <input type="number" className="calc-field__input" value={annualFee} onChange={e=>setAnnualFee(Number(e.target.value))} step={25}/>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-4)"}}>
          <div style={{borderRight:"1px solid var(--n-border)",paddingRight:"var(--s-4)"}}>
            <p className="calc-field__label" style={{color:"var(--n-warning)"}}>DRAW PERIOD ({drawYears} years)</p>
            <p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-primary)"}}>{fmtUSD(payR.drawPayment)}/mo</p>
            <p className="t-body-sm text-muted">Interest-only payments</p>
          </div>
          <div>
            <p className="calc-field__label" style={{color:"var(--n-success)"}}>REPAYMENT PERIOD ({repayYears} years)</p>
            <p style={{fontSize:"var(--t-h2)",fontWeight:700,color:"var(--n-primary)"}}>{fmtUSD(payR.repayPayment)}/mo</p>
            <p className="t-body-sm text-muted">Principal + Interest</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-4)"}}>
          <div><p className="calc-field__label">TOTAL INTEREST</p><p style={{fontWeight:700}}>{fmtUSD(payR.totalInterest)}</p></div>
          <div><p className="calc-field__label">TOTAL FEES</p><p style={{fontWeight:700,color:"var(--n-warning)"}}>{fmtUSD(payR.totalFees)}</p></div>
          <div><p className="calc-field__label">TOTAL COST</p><p style={{fontWeight:700}}>{fmtUSD(payR.totalCost)}</p></div>
        </div>
      </div>

      {/* Period comparison */}
      <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
        <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>PERIOD BREAKDOWN</p>
        <table className="calc-table"><thead><tr><th></th><th>Draw Period</th><th>Repayment Period</th><th>Total</th></tr></thead><tbody>
          <tr><td>Duration</td><td>{drawYears} years ({payR.drawMonths} mo)</td><td>{repayYears} years ({payR.repayMonths} mo)</td><td>{drawYears+repayYears} years</td></tr>
          <tr><td>Payment Type</td><td>Interest-only</td><td>Principal + Interest</td><td>—</td></tr>
          <tr><td>Monthly Payment</td><td>{fmtUSD(payR.drawPayment)}</td><td>{fmtUSD(payR.repayPayment)}</td><td>—</td></tr>
          <tr><td>Interest Rate</td><td>{drawRate}% (variable)</td><td>{repayRate}% (variable)</td><td>—</td></tr>
          <tr><td>Total Interest</td><td>{fmtUSD(payR.drawTotalInterest)}</td><td>{fmtUSD(payR.repayTotalInterest)}</td><td style={{fontWeight:700}}>{fmtUSD(payR.totalInterest)}</td></tr>
          <tr><td>Annual Fees</td><td>{fmtUSD(payR.drawTotalAnnualFees)}</td><td>{fmtUSD(payR.repayTotalAnnualFees)}</td><td>{fmtUSD(payR.drawTotalAnnualFees+payR.repayTotalAnnualFees)}</td></tr>
        </tbody></table>
      </div>
    </>):(<>
      <div className="calc-input-panel">
        <div className="calc-field">
          <label className="calc-field__label">🏠 CURRENT HOME VALUE ($)</label>
          <input type="text" className="calc-field__input" value={homeVal.toLocaleString("en-US")} inputMode="numeric"
            onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setHomeVal(v);}}/>
          <input type="range" className="calc-field__slider" min={100000} max={2000000} step={10000} value={homeVal} onChange={e=>setHomeVal(Number(e.target.value))}/>
        </div>
        <div className="calc-field">
          <label className="calc-field__label">🏦 REMAINING MORTGAGE ($)</label>
          <input type="text" className="calc-field__input" value={mtgBal.toLocaleString("en-US")} inputMode="numeric"
            onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setMtgBal(v);}}/>
          <input type="range" className="calc-field__slider" min={0} max={homeVal} step={5000} value={mtgBal} onChange={e=>setMtgBal(Number(e.target.value))}/>
        </div>
        <div className="calc-field">
          <label className="calc-field__label">📊 MAX LTV RATIO</label>
          <div style={{display:"flex",gap:"var(--s-2)",marginBottom:"var(--s-2)"}}>
            {[75,80,85,90].map(v=>(
              <button key={v} onClick={()=>setMaxLTV(v)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-2)",fontWeight:maxLTV===v?700:400,background:maxLTV===v?"var(--n-primary)":"var(--n-surface-alt)",color:maxLTV===v?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-sm)",cursor:"pointer"}}>{v}%</button>
            ))}
          </div>
        </div>
      </div>
      <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
        <p className="calc-field__label">MAX HELOC CREDIT LINE</p>
        <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:limR.maxCredit>0?"var(--n-success)":"var(--n-error, #ef4444)"}}>{fmtUSD(limR.maxCredit)}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-4)"}}>
          <div><p className="calc-field__label">HOME EQUITY</p><p style={{fontWeight:700}}>{fmtUSD(limR.equity)} ({limR.eqPct.toFixed(1)}%)</p></div>
          <div><p className="calc-field__label">CURRENT LTV</p><p style={{fontWeight:700}}>{limR.curLTV.toFixed(1)}%</p></div>
          <div><p className="calc-field__label">MAX LTV</p><p style={{fontWeight:700}}>{maxLTV}%</p></div>
        </div>
        <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-3)"}}>Formula: ({fmtUSD(homeVal)} × {maxLTV}%) − {fmtUSD(mtgBal)} = {fmtUSD(limR.maxCredit)}</p>
      </div>
      <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
        <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>CREDIT LIMIT AT DIFFERENT LTV RATIOS</p>
        <table className="calc-table"><thead><tr><th>LTV</th><th>Max HELOC</th><th>Typical Lender</th></tr></thead><tbody>
          {[75,80,85,90].map(ltv=>{
            const mx=Math.max(0,homeVal*(ltv/100)-mtgBal);
            return(<tr key={ltv} style={ltv===maxLTV?{background:"var(--n-primary-bg, rgba(59,130,246,0.1))"}:undefined}>
              <td style={{fontWeight:ltv===maxLTV?700:400}}>{ltv}%{ltv===maxLTV?" ←":""}</td>
              <td>{fmtUSD(mx)}</td>
              <td>{ltv<=75?"Conservative":ltv<=80?"Most lenders":ltv<=85?"Some lenders":"Fewer lenders"}</td>
            </tr>);
          })}
        </tbody></table>
      </div>
    </>)}
  </div>);
}

// ─── 21. VA Mortgage Calculator ───
function VAMortgageCalc({defaults}:P){
  const[homePrice,setHomePrice]=useState(defaults.amount||350000);
  const[downPct,setDownPct]=useState(0);
  const[rate,setRate]=useState(defaults.rate||6.25);
  const[tenure,setTenure]=useState(defaults.tenure||360);
  const[propTax,setPropTax]=useState(3500);
  const[insurance,setInsurance]=useState(1200);
  const[firstUse,setFirstUse]=useState(true);
  const[feeExempt,setFeeExempt]=useState(false);

  const r=useMemo(()=>{
    const downAmt=homePrice*(downPct/100);
    const loanBase=homePrice-downAmt;
    // VA Funding Fee calculation
    let feePct=0;
    if(!feeExempt){
      if(firstUse){
        if(downPct>=10)feePct=1.25;
        else if(downPct>=5)feePct=1.5;
        else feePct=2.15;
      }else{
        if(downPct>=10)feePct=1.25;
        else if(downPct>=5)feePct=1.5;
        else feePct=3.3;
      }
    }
    const fundingFee=loanBase*(feePct/100);
    // Funding fee can be financed into loan
    const totalLoan=loanBase+fundingFee;
    const mr=rate/100/12;
    const mp=pmt(mr,tenure,totalLoan);
    const monthlyTax=propTax/12;
    const monthlyIns=insurance/12;
    const piti=mp+monthlyTax+monthlyIns;
    const totalPaid=mp*tenure;
    const totalInt=totalPaid-totalLoan;
    // Conventional comparison (5% down, PMI at 0.55% until 20% equity)
    const convDown=homePrice*0.05;
    const convLoan=homePrice-convDown;
    const convMp=pmt(mr,tenure,convLoan);
    const convPMI=convLoan*0.0055/12;
    const convPiti=convMp+monthlyTax+monthlyIns+convPMI;
    return{downAmt,loanBase,feePct,fundingFee,totalLoan,mp,monthlyTax,monthlyIns,piti,totalPaid,totalInt,convMp,convPMI,convPiti};
  },[homePrice,downPct,rate,tenure,propTax,insurance,firstUse,feeExempt]);

  return(<div><div className="calc-input-panel">
    <div className="calc-field">
      <label className="calc-field__label">🏠 HOME PRICE ($)</label>
      <input type="text" className="calc-field__input" value={homePrice.toLocaleString("en-US")} inputMode="numeric"
        onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setHomePrice(v);}}/>
      <input type="range" className="calc-field__slider" min={100000} max={1000000} step={5000} value={homePrice} onChange={e=>setHomePrice(Number(e.target.value))}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">⬇️ DOWN PAYMENT (%)</label>
        <div style={{display:"flex",gap:"var(--s-2)",marginBottom:"var(--s-2)"}}>
          {[0,5,10].map(v=>(
            <button key={v} onClick={()=>setDownPct(v)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-2)",fontWeight:downPct===v?700:400,background:downPct===v?"var(--n-primary)":"var(--n-surface-alt)",color:downPct===v?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-sm)",cursor:"pointer"}}>{v}%</button>
          ))}
        </div>
        <input type="range" className="calc-field__slider" min={0} max={20} step={1} value={downPct} onChange={e=>setDownPct(Number(e.target.value))}/>
        <p className="t-body-sm text-muted" style={{marginTop:"2px"}}>Down: {fmtUSD(r.downAmt)}</p>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">% INTEREST RATE</label>
        <input type="number" className="calc-field__input" value={rate} onChange={e=>setRate(Number(e.target.value))} step={0.125}/>
        <input type="range" className="calc-field__slider" min={3} max={10} step={0.125} value={rate} onChange={e=>setRate(Number(e.target.value))}/>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">📅 LOAN TERM</label>
        <div style={{display:"flex",gap:"var(--s-2)"}}>
          {[{l:"15yr",v:180},{l:"20yr",v:240},{l:"30yr",v:360}].map(t=>(
            <button key={t.v} onClick={()=>setTenure(t.v)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-2)",fontWeight:tenure===t.v?700:400,background:tenure===t.v?"var(--n-primary)":"var(--n-surface-alt)",color:tenure===t.v?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-sm)",cursor:"pointer"}}>{t.l}</button>
          ))}
        </div>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">🏛️ PROPERTY TAX ($/yr)</label>
        <input type="text" className="calc-field__input" value={propTax.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setPropTax(v);}}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">🛡️ HOME INSURANCE ($/yr)</label>
        <input type="text" className="calc-field__input" value={insurance.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setInsurance(v);}}/>
      </div>
    </div>
    <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
    <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>🎖️ VA FUNDING FEE OPTIONS</p>
    <div style={{display:"flex",gap:"var(--s-4)",alignItems:"center"}}>
      <label style={{display:"flex",alignItems:"center",gap:"var(--s-2)",cursor:"pointer"}}>
        <input type="checkbox" checked={firstUse} onChange={e=>setFirstUse(e.target.checked)}/> First-time VA loan use
      </label>
      <label style={{display:"flex",alignItems:"center",gap:"var(--s-2)",cursor:"pointer"}}>
        <input type="checkbox" checked={feeExempt} onChange={e=>setFeeExempt(e.target.checked)}/> 10%+ disability (fee exempt)
      </label>
    </div>
  </div>

    {/* Results */}
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">MONTHLY PAYMENT (PITI)</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)"}}>{fmtUSD(r.piti)}/mo</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"var(--s-3)",marginTop:"var(--s-4)"}}>
        <div><p className="calc-field__label">P&I</p><p style={{fontWeight:700}}>{fmtUSD(r.mp)}</p></div>
        <div><p className="calc-field__label">PROPERTY TAX</p><p style={{fontWeight:700}}>{fmtUSD(r.monthlyTax)}</p></div>
        <div><p className="calc-field__label">INSURANCE</p><p style={{fontWeight:700}}>{fmtUSD(r.monthlyIns)}</p></div>
        <div><p className="calc-field__label">PMI</p><p style={{fontWeight:700,color:"var(--n-success)"}}>$0 ✓</p></div>
      </div>
    </div>

    {/* VA Funding Fee */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:feeExempt?"rgba(34,197,94,0.08)":"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>🎖️ VA FUNDING FEE</p>
      {feeExempt?(<p style={{fontWeight:700,color:"var(--n-success)",fontSize:"var(--t-h3)"}}>$0 — Exempt (10%+ service-connected disability)</p>):(<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
          <div><p className="calc-field__label">FEE RATE</p><p style={{fontWeight:700}}>{r.feePct}%</p></div>
          <div><p className="calc-field__label">FEE AMOUNT</p><p style={{fontWeight:700,color:"var(--n-warning)"}}>{fmtUSD(r.fundingFee)}</p></div>
          <div><p className="calc-field__label">TOTAL LOAN (w/ fee)</p><p style={{fontWeight:700}}>{fmtUSD(r.totalLoan)}</p></div>
        </div>
        <p className="t-body-sm text-muted" style={{marginTop:"var(--s-2)"}}>
          {firstUse?"First-time use":"Subsequent use"} | {downPct}% down payment → {r.feePct}% fee. Financed into loan balance.
        </p>
      </>)}
      <table className="calc-table" style={{marginTop:"var(--s-3)"}}>
        <thead><tr><th>Down Payment</th><th>First Use</th><th>Subsequent Use</th></tr></thead><tbody>
        <tr style={downPct<5?{background:"var(--n-primary-bg, rgba(59,130,246,0.1))"}:undefined}><td>Less than 5%</td><td>2.15%</td><td>3.30%</td></tr>
        <tr style={downPct>=5&&downPct<10?{background:"var(--n-primary-bg, rgba(59,130,246,0.1))"}:undefined}><td>5% - 9.99%</td><td>1.50%</td><td>1.50%</td></tr>
        <tr style={downPct>=10?{background:"var(--n-primary-bg, rgba(59,130,246,0.1))"}:undefined}><td>10% or more</td><td>1.25%</td><td>1.25%</td></tr>
      </tbody></table>
    </div>

    {/* VA vs Conv vs FHA */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>VA LOAN vs CONVENTIONAL vs FHA</p>
      <table className="calc-table"><thead><tr><th></th><th style={{color:"var(--n-primary)"}}>VA Loan ✓</th><th>Conventional</th><th>FHA</th></tr></thead><tbody>
        <tr><td>Down Payment</td><td style={{color:"var(--n-success)",fontWeight:700}}>0%</td><td>5-20%</td><td>3.5%</td></tr>
        <tr><td>PMI/MIP</td><td style={{color:"var(--n-success)",fontWeight:700}}>None ✓</td><td>Required &lt;20% down</td><td>Required (life of loan)</td></tr>
        <tr><td>Funding Fee</td><td>{r.feePct}% ({fmtUSD(r.fundingFee)})</td><td>None</td><td>1.75% upfront + 0.85%/yr</td></tr>
        <tr><td>Monthly (est.)</td><td style={{fontWeight:700}}>{fmtUSD(r.piti)}</td><td>{fmtUSD(r.convPiti)}</td><td>—</td></tr>
        <tr><td>Credit Score</td><td>No VA minimum (lenders: 620+)</td><td>620-680+</td><td>580+ (3.5% down)</td></tr>
        <tr><td>Prepayment Penalty</td><td style={{color:"var(--n-success)"}}>None ✓</td><td>Varies</td><td>None</td></tr>
        <tr><td>Eligibility</td><td>Veterans/active duty/spouses</td><td>Anyone</td><td>Anyone</td></tr>
      </tbody></table>
    </div>
  </div>);
}

// ─── 22. FHA Loan Calculator ───
function FHALoanCalc({defaults}:P){
  const[homePrice,setHomePrice]=useState(defaults.amount||350000);
  const[downPct,setDownPct]=useState(3.5);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[tenure,setTenure]=useState(defaults.tenure||360);
  const[propTax,setPropTax]=useState(3500);
  const[insurance,setInsurance]=useState(1200);

  const r=useMemo(()=>{
    const downAmt=homePrice*(downPct/100);
    const loanBase=homePrice-downAmt;
    const ltv=homePrice>0?((loanBase/homePrice)*100):0;
    // Upfront MIP: 1.75% of base loan, financed into loan
    const upfrontMIP=loanBase*0.0175;
    const totalLoan=loanBase+upfrontMIP;
    // Annual MIP rate based on LTV, term, and amount (2024 FHA table)
    let annualMIPRate=0;
    if(tenure>180){// >15 years
      if(loanBase<=726200){
        annualMIPRate=ltv<=90?0.50:ltv<=95?0.55:0.55;
      }else{
        annualMIPRate=ltv<=90?0.70:ltv<=95?0.75:0.75;
      }
    }else{// <=15 years
      if(loanBase<=726200){
        annualMIPRate=ltv<=90?0.15:0.40;
      }else{
        annualMIPRate=ltv<=78?0.15:ltv<=90?0.40:0.65;
      }
    }
    const monthlyMIP=(loanBase*annualMIPRate/100)/12;
    // MIP cancellation: if down>=10% (LTV<=90), MIP drops after 11 years; else life of loan
    const mipDropsAfter11=downPct>=10;
    const mr=rate/100/12;
    const mp=pmt(mr,tenure,totalLoan);
    const monthlyTax=propTax/12;
    const monthlyIns=insurance/12;
    const piti=mp+monthlyTax+monthlyIns+monthlyMIP;
    const totalPaid=mp*tenure;
    const totalInt=totalPaid-totalLoan;
    // MIP total (simplified: if drops after 11yr, only 132 months of MIP)
    const mipMonths=mipDropsAfter11?Math.min(132,tenure):tenure;
    const totalMIP=upfrontMIP+(monthlyMIP*mipMonths);
    // Conventional comparison
    const convDown=homePrice*0.05;
    const convLoan=homePrice-convDown;
    const convMp=pmt(mr,tenure,convLoan);
    const convPMI=convLoan*0.005/12;
    const convPiti=convMp+monthlyTax+monthlyIns+convPMI;
    return{downAmt,loanBase,ltv,upfrontMIP,totalLoan,annualMIPRate,monthlyMIP,mipDropsAfter11,mipMonths,totalMIP,mp,monthlyTax,monthlyIns,piti,totalPaid,totalInt,convPiti};
  },[homePrice,downPct,rate,tenure,propTax,insurance]);

  return(<div><div className="calc-input-panel">
    <div className="calc-field">
      <label className="calc-field__label">🏠 HOME PRICE ($)</label>
      <input type="text" className="calc-field__input" value={homePrice.toLocaleString("en-US")} inputMode="numeric"
        onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setHomePrice(v);}}/>
      <input type="range" className="calc-field__slider" min={100000} max={800000} step={5000} value={homePrice} onChange={e=>setHomePrice(Number(e.target.value))}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">⬇️ DOWN PAYMENT (%)</label>
        <div style={{display:"flex",gap:"var(--s-2)",marginBottom:"var(--s-2)"}}>
          {[{l:"3.5% (580+)",v:3.5},{l:"10% (500-579)",v:10},{l:"20%",v:20}].map(p=>(
            <button key={p.v} onClick={()=>setDownPct(p.v)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-2)",fontSize:"var(--t-body-sm)",fontWeight:downPct===p.v?700:400,background:downPct===p.v?"var(--n-primary)":"var(--n-surface-alt)",color:downPct===p.v?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-sm)",cursor:"pointer"}}>{p.l}</button>
          ))}
        </div>
        <input type="range" className="calc-field__slider" min={3.5} max={25} step={0.5} value={downPct} onChange={e=>setDownPct(Number(e.target.value))}/>
        <p className="t-body-sm text-muted" style={{marginTop:"2px"}}>Down: {fmtUSD(r.downAmt)} | LTV: {r.ltv.toFixed(1)}%</p>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">% INTEREST RATE</label>
        <input type="number" className="calc-field__input" value={rate} onChange={e=>setRate(Number(e.target.value))} step={0.125}/>
        <input type="range" className="calc-field__slider" min={3} max={10} step={0.125} value={rate} onChange={e=>setRate(Number(e.target.value))}/>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">📅 LOAN TERM</label>
        <div style={{display:"flex",gap:"var(--s-2)"}}>
          {[{l:"15yr",v:180},{l:"30yr",v:360}].map(t=>(
            <button key={t.v} onClick={()=>setTenure(t.v)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-2)",fontWeight:tenure===t.v?700:400,background:tenure===t.v?"var(--n-primary)":"var(--n-surface-alt)",color:tenure===t.v?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-sm)",cursor:"pointer"}}>{t.l}</button>
          ))}
        </div>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">🏛️ PROPERTY TAX ($/yr)</label>
        <input type="text" className="calc-field__input" value={propTax.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setPropTax(v);}}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">🛡️ HOME INSURANCE ($/yr)</label>
        <input type="text" className="calc-field__input" value={insurance.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setInsurance(v);}}/>
      </div>
    </div>
  </div>

    {/* Results */}
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:"var(--n-surface-alt)"}}>
      <p className="calc-field__label">MONTHLY PAYMENT (PITI + MIP)</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:"var(--n-primary)"}}>{fmtUSD(r.piti)}/mo</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:"var(--s-2)",marginTop:"var(--s-4)"}}>
        <div><p className="calc-field__label" style={{fontSize:"11px"}}>P&I</p><p style={{fontWeight:700,fontSize:"var(--t-body-sm)"}}>{fmtUSD(r.mp)}</p></div>
        <div><p className="calc-field__label" style={{fontSize:"11px"}}>PROPERTY TAX</p><p style={{fontWeight:700,fontSize:"var(--t-body-sm)"}}>{fmtUSD(r.monthlyTax)}</p></div>
        <div><p className="calc-field__label" style={{fontSize:"11px"}}>INSURANCE</p><p style={{fontWeight:700,fontSize:"var(--t-body-sm)"}}>{fmtUSD(r.monthlyIns)}</p></div>
        <div><p className="calc-field__label" style={{fontSize:"11px"}}>ANNUAL MIP</p><p style={{fontWeight:700,fontSize:"var(--t-body-sm)",color:"var(--n-warning)"}}>{fmtUSD(r.monthlyMIP)}</p></div>
        <div><p className="calc-field__label" style={{fontSize:"11px"}}>PMI</p><p style={{fontWeight:700,fontSize:"var(--t-body-sm)",color:"var(--n-success)"}}>N/A</p></div>
      </div>
    </div>

    {/* FHA MIP Details */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>🏛️ FHA MORTGAGE INSURANCE PREMIUMS</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"var(--s-3)"}}>
        <div><p className="calc-field__label">UPFRONT MIP</p><p style={{fontWeight:700}}>{fmtUSD(r.upfrontMIP)}</p><p className="t-body-sm text-muted">1.75% (financed)</p></div>
        <div><p className="calc-field__label">ANNUAL MIP RATE</p><p style={{fontWeight:700}}>{r.annualMIPRate}%</p><p className="t-body-sm text-muted">{fmtUSD(r.monthlyMIP)}/mo</p></div>
        <div><p className="calc-field__label">MIP DURATION</p><p style={{fontWeight:700,color:r.mipDropsAfter11?"var(--n-success)":"var(--n-warning)"}}>{r.mipDropsAfter11?"11 years":"Life of loan"}</p></div>
        <div><p className="calc-field__label">TOTAL MIP COST</p><p style={{fontWeight:700,color:"var(--n-warning)"}}>{fmtUSD(r.totalMIP)}</p></div>
      </div>
      <p className="t-body-sm text-muted" style={{marginTop:"var(--s-3)",padding:"var(--s-2)",background:"rgba(59,130,246,0.05)",borderRadius:"var(--radius-sm)"}}>
        {r.mipDropsAfter11?"✅ With 10%+ down payment, annual MIP is cancelled after 11 years.":"⚠️ With less than 10% down, annual MIP is required for the entire life of the loan. Consider 10%+ down to save "+fmtUSD(r.monthlyMIP*(r.mipMonths>132?r.mipMonths-132:0))+" in MIP."}
      </p>
    </div>

    {/* FHA vs Conv vs VA */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>FHA vs CONVENTIONAL vs VA</p>
      <table className="calc-table"><thead><tr><th></th><th style={{color:"var(--n-primary)"}}>FHA Loan ✓</th><th>Conventional</th><th>VA Loan</th></tr></thead><tbody>
        <tr><td>Down Payment</td><td style={{fontWeight:700}}>3.5% (580+) / 10% (500-579)</td><td>5-20%</td><td>0%</td></tr>
        <tr><td>Credit Score</td><td style={{color:"var(--n-success)",fontWeight:700}}>580+ (3.5%) or 500+ (10%)</td><td>620-680+</td><td>620+ (lender)</td></tr>
        <tr><td>Mortgage Insurance</td><td>1.75% upfront + {r.annualMIPRate}%/yr</td><td>PMI until 20% equity</td><td>None</td></tr>
        <tr><td>MIP Cancellation</td><td>{r.mipDropsAfter11?"After 11 years":"Life of loan"}</td><td>At 20% equity</td><td>N/A</td></tr>
        <tr><td>Monthly (est.)</td><td style={{fontWeight:700}}>{fmtUSD(r.piti)}</td><td>{fmtUSD(r.convPiti)}</td><td>—</td></tr>
        <tr><td>Loan Limits</td><td>$498,257 – $1,149,825</td><td>$766,550 conforming</td><td>None (full)</td></tr>
        <tr><td>Best For</td><td>Low credit / low down</td><td>Good credit / 20% down</td><td>Veterans</td></tr>
      </tbody></table>
    </div>
  </div>);
}

// ─── 23. Rental Property Calculator ───
function RentalPropertyCalc({defaults}:P){
  const[price,setPrice]=useState(defaults.amount||300000);
  const[downPct,setDownPct]=useState(20);
  const[rate,setRate]=useState(defaults.rate||7.0);
  const[tenure,setTenure]=useState(defaults.tenure||360);
  const[rent,setRent]=useState(2000);
  const[vacancyPct,setVacancy]=useState(5);
  // Operating expenses
  const[propTaxYr,setPropTax]=useState(3600);
  const[insYr,setIns]=useState(1200);
  const[maintPct,setMaint]=useState(10); // % of rent
  const[mgmtPct,setMgmt]=useState(10); // % of rent
  const[hoa,setHoa]=useState(0);
  const[otherExp,setOther]=useState(0);

  const r=useMemo(()=>{
    const downAmt=price*(downPct/100);
    const loanAmt=price-downAmt;
    const mr=rate/100/12;
    const mortPmt=loanAmt>0?pmt(mr,tenure,loanAmt):0;
    // Income
    const grossAnnual=rent*12;
    const vacancyLoss=grossAnnual*(vacancyPct/100);
    const effectiveIncome=grossAnnual-vacancyLoss;
    // Expenses
    const maintYr=grossAnnual*(maintPct/100);
    const mgmtYr=grossAnnual*(mgmtPct/100);
    const totalOpEx=propTaxYr+insYr+maintYr+mgmtYr+(hoa*12)+(otherExp*12);
    // NOI, Cash Flow
    const noi=effectiveIncome-totalOpEx;
    const annualMort=mortPmt*12;
    const annualCashFlow=noi-annualMort;
    const monthlyCashFlow=annualCashFlow/12;
    // Metrics
    const capRate=price>0?(noi/price*100):0;
    const totalCashInvested=downAmt; // simplified: closing costs not included
    const cashOnCash=totalCashInvested>0?(annualCashFlow/totalCashInvested*100):0;
    const onePercentRule=price>0?(rent/(price)*100):0;
    const fiftyPercentTest=effectiveIncome>0?(totalOpEx/effectiveIncome*100):0;
    const grm=rent>0?(price/grossAnnual):0;
    return{downAmt,loanAmt,mortPmt,grossAnnual,vacancyLoss,effectiveIncome,maintYr,mgmtYr,totalOpEx,noi,annualMort,annualCashFlow,monthlyCashFlow,capRate,cashOnCash,onePercentRule,fiftyPercentTest,grm};
  },[price,downPct,rate,tenure,rent,vacancyPct,propTaxYr,insYr,maintPct,mgmtPct,hoa,otherExp]);

  const good=(v:boolean)=>v?"var(--n-success)":"var(--n-error, #ef4444)";

  return(<div><div className="calc-input-panel">
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">🏠 PURCHASE PRICE ($)</label>
        <input type="text" className="calc-field__input" value={price.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setPrice(v);}}/>
        <input type="range" className="calc-field__slider" min={50000} max={1000000} step={5000} value={price} onChange={e=>setPrice(Number(e.target.value))}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">💰 MONTHLY RENT ($)</label>
        <input type="text" className="calc-field__input" value={rent.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setRent(v);}}/>
        <input type="range" className="calc-field__slider" min={500} max={10000} step={50} value={rent} onChange={e=>setRent(Number(e.target.value))}/>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">⬇️ DOWN PAYMENT (%)</label>
        <input type="number" className="calc-field__input" value={downPct} onChange={e=>setDownPct(Number(e.target.value))} step={5}/>
        <input type="range" className="calc-field__slider" min={0} max={100} step={5} value={downPct} onChange={e=>setDownPct(Number(e.target.value))}/>
        <p className="t-body-sm text-muted">{fmtUSD(r.downAmt)}</p>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">% MORTGAGE RATE</label>
        <input type="number" className="calc-field__input" value={rate} onChange={e=>setRate(Number(e.target.value))} step={0.25}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">📅 LOAN TERM</label>
        <div style={{display:"flex",gap:"var(--s-2)"}}>
          {[{l:"15yr",v:180},{l:"30yr",v:360}].map(t=>(
            <button key={t.v} onClick={()=>setTenure(t.v)} className="calc-preset-btn" style={{flex:1,padding:"var(--s-2)",fontWeight:tenure===t.v?700:400,background:tenure===t.v?"var(--n-primary)":"var(--n-surface-alt)",color:tenure===t.v?"#fff":"var(--n-text)",border:"none",borderRadius:"var(--radius-sm)",cursor:"pointer"}}>{t.l}</button>
          ))}
        </div>
      </div>
    </div>
    <div className="calc-field">
      <label className="calc-field__label">📊 VACANCY RATE (%)</label>
      <input type="range" className="calc-field__slider" min={0} max={20} step={1} value={vacancyPct} onChange={e=>setVacancy(Number(e.target.value))}/>
      <p className="t-body-sm text-muted">{vacancyPct}% — Loss: {fmtUSD(r.vacancyLoss)}/yr</p>
    </div>
    <hr style={{margin:"var(--s-3) 0",border:"1px solid var(--n-border)"}}/>
    <p className="calc-field__label" style={{marginBottom:"var(--s-2)"}}>📋 OPERATING EXPENSES</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">🏛️ Property Tax ($/yr)</label>
        <input type="text" className="calc-field__input" value={propTaxYr.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setPropTax(v);}}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">🛡️ Insurance ($/yr)</label>
        <input type="text" className="calc-field__input" value={insYr.toLocaleString("en-US")} inputMode="numeric"
          onChange={e=>{const v=Number(e.target.value.replace(/,/g,""));if(!isNaN(v))setIns(v);}}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">🔧 Maintenance (% rent)</label>
        <input type="number" className="calc-field__input" value={maintPct} onChange={e=>setMaint(Number(e.target.value))} step={1}/>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"var(--s-3)"}}>
      <div className="calc-field">
        <label className="calc-field__label">👤 Property Mgmt (% rent)</label>
        <input type="number" className="calc-field__input" value={mgmtPct} onChange={e=>setMgmt(Number(e.target.value))} step={1}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">🏢 HOA ($/mo)</label>
        <input type="number" className="calc-field__input" value={hoa} onChange={e=>setHoa(Number(e.target.value))} step={25}/>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">📦 Other ($/mo)</label>
        <input type="number" className="calc-field__input" value={otherExp} onChange={e=>setOther(Number(e.target.value))} step={25}/>
      </div>
    </div>
  </div>

    {/* Cash Flow Results */}
    <div className="calc-card" style={{marginTop:"var(--s-6)",background:r.monthlyCashFlow>=0?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)"}}>
      <p className="calc-field__label">MONTHLY CASH FLOW</p>
      <p style={{fontSize:"var(--t-h1)",fontWeight:700,color:r.monthlyCashFlow>=0?"var(--n-success)":"var(--n-error, #ef4444)"}}>{fmtUSD(r.monthlyCashFlow)}/mo</p>
      <p className="t-body-sm text-muted">{fmtUSD(r.annualCashFlow)}/year | {r.monthlyCashFlow>=0?"✅ Positive cash flow":"❌ Negative cash flow"}</p>
    </div>

    {/* Income & Expense Breakdown */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>INCOME & EXPENSE BREAKDOWN (Annual)</p>
      <table className="calc-table"><tbody>
        <tr style={{background:"rgba(34,197,94,0.05)"}}><td><strong>Gross Rental Income</strong></td><td style={{textAlign:"right",fontWeight:700,color:"var(--n-success)"}}>{fmtUSD(r.grossAnnual)}</td></tr>
        <tr><td>− Vacancy Loss ({vacancyPct}%)</td><td style={{textAlign:"right",color:"var(--n-error, #ef4444)"}}>({fmtUSD(r.vacancyLoss)})</td></tr>
        <tr style={{borderTop:"2px solid var(--n-border)"}}><td><strong>Effective Income</strong></td><td style={{textAlign:"right",fontWeight:700}}>{fmtUSD(r.effectiveIncome)}</td></tr>
        <tr><td>− Property Tax</td><td style={{textAlign:"right"}}>({fmtUSD(propTaxYr)})</td></tr>
        <tr><td>− Insurance</td><td style={{textAlign:"right"}}>({fmtUSD(insYr)})</td></tr>
        <tr><td>− Maintenance ({maintPct}%)</td><td style={{textAlign:"right"}}>({fmtUSD(r.maintYr)})</td></tr>
        <tr><td>− Management ({mgmtPct}%)</td><td style={{textAlign:"right"}}>({fmtUSD(r.mgmtYr)})</td></tr>
        {hoa>0&&<tr><td>− HOA</td><td style={{textAlign:"right"}}>({fmtUSD(hoa*12)})</td></tr>}
        {otherExp>0&&<tr><td>− Other</td><td style={{textAlign:"right"}}>({fmtUSD(otherExp*12)})</td></tr>}
        <tr style={{borderTop:"2px solid var(--n-border)"}}><td><strong>Total Operating Expenses</strong></td><td style={{textAlign:"right",fontWeight:700,color:"var(--n-warning)"}}>{fmtUSD(r.totalOpEx)}</td></tr>
        <tr style={{background:"rgba(59,130,246,0.05)"}}><td><strong>Net Operating Income (NOI)</strong></td><td style={{textAlign:"right",fontWeight:700,color:"var(--n-primary)"}}>{fmtUSD(r.noi)}</td></tr>
        <tr><td>− Mortgage Payment</td><td style={{textAlign:"right"}}>({fmtUSD(r.annualMort)})</td></tr>
        <tr style={{borderTop:"2px solid var(--n-border)",background:r.annualCashFlow>=0?"rgba(34,197,94,0.05)":"rgba(239,68,68,0.05)"}}><td><strong>Net Cash Flow</strong></td><td style={{textAlign:"right",fontWeight:700,color:r.annualCashFlow>=0?"var(--n-success)":"var(--n-error, #ef4444)"}}>{fmtUSD(r.annualCashFlow)}</td></tr>
      </tbody></table>
    </div>

    {/* Investment Metrics */}
    <div className="calc-card" style={{marginTop:"var(--s-4)",background:"var(--n-surface)"}}>
      <p className="calc-field__label" style={{marginBottom:"var(--s-3)"}}>📊 INVESTMENT METRICS</p>
      <table className="calc-table"><thead><tr><th>Metric</th><th>Value</th><th>Target</th><th>Status</th></tr></thead><tbody>
        <tr><td>Cap Rate</td><td style={{fontWeight:700}}>{r.capRate.toFixed(2)}%</td><td>≥ 5%</td><td style={{color:good(r.capRate>=5)}}>{r.capRate>=5?"✅ Good":"⚠️ Low"}</td></tr>
        <tr><td>Cash-on-Cash Return</td><td style={{fontWeight:700}}>{r.cashOnCash.toFixed(2)}%</td><td>≥ 8%</td><td style={{color:good(r.cashOnCash>=8)}}>{r.cashOnCash>=8?"✅ Good":"⚠️ Low"}</td></tr>
        <tr><td>1% Rule (Rent/Price)</td><td style={{fontWeight:700}}>{r.onePercentRule.toFixed(2)}%</td><td>≥ 1%</td><td style={{color:good(r.onePercentRule>=1)}}>{r.onePercentRule>=1?"✅ Pass":"❌ Fail"}</td></tr>
        <tr><td>50% Rule (OpEx/Income)</td><td style={{fontWeight:700}}>{r.fiftyPercentTest.toFixed(1)}%</td><td>≤ 50%</td><td style={{color:good(r.fiftyPercentTest<=50)}}>{r.fiftyPercentTest<=50?"✅ Pass":"⚠️ High"}</td></tr>
        <tr><td>GRM (Price/Gross Rent)</td><td style={{fontWeight:700}}>{r.grm.toFixed(1)}x</td><td>≤ 15x</td><td style={{color:good(r.grm<=15)}}>{r.grm<=15?"✅ Good":"⚠️ High"}</td></tr>
        <tr><td>Monthly Mortgage</td><td style={{fontWeight:700}}>{fmtUSD(r.mortPmt)}</td><td>—</td><td>—</td></tr>
      </tbody></table>
    </div>
  </div>);
}

// ─── Dispatcher ───
const CALC_MAP:Record<string,React.FC<P>>={
  mortgage:MortgageCalc, debtConsolidation:DebtConsolidationCalc,
  loanAffordability:LoanAffordabilityCalc, loanInterestRate:LoanInterestRateCalc,
  loanPayoff:LoanPayoffCalc, loanAmortization:LoanAmortizationCalc,
  ltv:LTVCalc, balloonLoan:BalloonLoanCalc, arm:ARMCalc,
  fixedVsVariable:FixedVsVariableCalc, extraPayment:ExtraPaymentCalc,
  refinance:RefinanceCalc, mortgageRefinance:MortgageRefinanceCalc,
  rentAffordability:RentAffordabilityCalc, debtRatio:DebtRatioCalc,
  downPayment:DownPaymentCalc, aprCalc:APRCalc,
  homeEquity:HomeEquityCalc, heloc:HELOCCalc,
  vaMortgage:VAMortgageCalc, fhaLoan:FHALoanCalc,
  rentalProperty:RentalPropertyCalc,
};

export default function LoanToolsCore({calcType,defaults,sliderRanges}:{calcType:string;defaults:any;sliderRanges?:any}){
  const Comp=CALC_MAP[calcType];
  if(!Comp)return <p>Calculator not found.</p>;
  return <Comp defaults={defaults} sliderRanges={sliderRanges}/>;
}
