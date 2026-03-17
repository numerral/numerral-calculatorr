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
      <p style={{fontSize:"var(--t-body-sm)",color:"var(--n-text-muted)",marginTop:"var(--s-2)"}}>Total paid: {fmt(r.totalPaid)} | Total interest: {fmt(r.totalInt)}</p>
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
