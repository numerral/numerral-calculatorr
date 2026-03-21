// VehicleCalculatorCore — US-focused vehicle loan calculators
"use client";
import { useState, useMemo } from "react";

function fmtUSD(n:number):string{if(Math.abs(n)>=1e6)return"$"+(n/1e6).toFixed(2)+"M";return"$"+n.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0});}
function pmt(r:number,n:number,pv:number):number{if(r===0)return pv/n;return pv*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);}

interface P{defaults:any;sliderRanges?:any;}
const F=({label,value,onChange,min=0,max=1e7,step=1}:{label:string;value:number;onChange:(v:number)=>void;min?:number;max?:number;step?:number})=>(
  <div className="calc-field"><label className="calc-field__label">{label}</label>
  <input type="number" className="calc-field__input" value={value} onChange={e=>onChange(Number(e.target.value))} inputMode="decimal" min={min} step={step}/></div>);

// ─── Auto Loan Calculator ───
function AutoLoanCalc({defaults}:P){
  const[price,setPrice]=useState(defaults.amount||35000);
  const[warranty,setWarranty]=useState(0);
  const[taxRate,setTaxRate]=useState(7);
  const[tradeIn,setTradeIn]=useState(0);
  const[downPmt,setDownPmt]=useState(5000);
  const[rate,setRate]=useState(defaults.rate||6.5);
  const[term,setTerm]=useState(defaults.tenure||60);
  const r=useMemo(()=>{
    const subtotal=price+warranty;const tax=subtotal*taxRate/100;
    const totalPrice=subtotal+tax;const loanAmt=Math.max(0,totalPrice-tradeIn-downPmt);
    const mr=rate/100/12;const monthly=pmt(mr,term,loanAmt);
    const totalPaid=monthly*term;const totalInt=totalPaid-loanAmt;
    // Amortization first 12 months
    const amort:{mo:number;pmt:number;int:number;prin:number;bal:number}[]=[];
    let bal=loanAmt;
    for(let i=1;i<=Math.min(term,12);i++){const intPay=bal*mr;const prinPay=monthly-intPay;bal=Math.max(0,bal-prinPay);
      amort.push({mo:i,pmt:monthly,int:intPay,prin:prinPay,bal});}
    return{loanAmt,monthly,totalPaid,totalInt,tax,totalPrice,amort};
  },[price,warranty,taxRate,tradeIn,downPmt,rate,term]);
  return(<div><div className="calc-input-panel">
    <F label="🚗 Vehicle Price" value={price} onChange={setPrice} step={500}/>
    <F label="🛡️ Extended Warranty" value={warranty} onChange={setWarranty} step={500}/>
    <F label="📋 Sales Tax Rate (%)" value={taxRate} onChange={setTaxRate} step={0.25}/>
    <F label="🔄 Trade-In Value" value={tradeIn} onChange={setTradeIn} step={500}/>
    <F label="💵 Down Payment" value={downPmt} onChange={setDownPmt} step={500}/>
    <F label="📊 Interest Rate (APR %)" value={rate} onChange={setRate} step={0.1}/>
    <div className="calc-field"><label className="calc-field__label">📅 Loan Term</label>
      <div className="tax-toggle">{[{l:"36 mo",v:36},{l:"48 mo",v:48},{l:"60 mo",v:60},{l:"72 mo",v:72},{l:"84 mo",v:84}].map(o=>(<button key={o.v} className={`tax-toggle__btn${term===o.v?" active":""}`} onClick={()=>setTerm(o.v)}>{o.l}</button>))}</div></div>
  </div>
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Monthly Payment</p>
      <p className="calc-result__emi">{fmtUSD(r.monthly)}<span style={{fontSize:"0.4em",fontWeight:400}}>/mo</span></p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Loan Amount</p><p className="calc-result__stat-value">{fmtUSD(r.loanAmt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Total Interest</p><p className="calc-result__stat-value" style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.totalInt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Total Cost</p><p className="calc-result__stat-value">{fmtUSD(r.totalPaid+tradeIn+downPmt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Sales Tax</p><p className="calc-result__stat-value">{fmtUSD(r.tax)}</p></div>
      </div>
    </div>
    <div style={{marginTop:"var(--s-6)",overflowX:"auto"}}>
      <h3 className="t-h3" style={{marginBottom:"var(--s-3)"}}>Amortization Schedule (First 12 Months)</h3>
      <table className="comparison-table"><thead><tr><th>Month</th><th>Payment</th><th>Interest</th><th>Principal</th><th>Balance</th></tr></thead>
        <tbody>{r.amort.map(m=>(<tr key={m.mo}><td>{m.mo}</td><td>{fmtUSD(m.pmt)}</td><td style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(m.int)}</td><td style={{color:"var(--n-success)"}}>{fmtUSD(m.prin)}</td><td>{fmtUSD(m.bal)}</td></tr>))}</tbody></table>
    </div></div>);
}

// ─── Car Lease Calculator ───
function CarLeaseCalc({defaults}:P){
  const[msrp,setMsrp]=useState(defaults.amount||40000);
  const[negotiated,setNegotiated]=useState(defaults.amount||40000);
  const[downPmt,setDownPmt]=useState(3000);
  const[tradeIn,setTradeIn]=useState(0);
  const[residualPct,setResidualPct]=useState(55);
  const[moneyFactor,setMoneyFactor]=useState(0.0025);
  const[term,setTerm]=useState(defaults.tenure||36);
  const[taxRate,setTaxRate]=useState(7);
  const r=useMemo(()=>{
    const residualVal=msrp*residualPct/100;
    const capCost=negotiated-downPmt-tradeIn;
    const depreciation=(capCost-residualVal)/term;
    const finance=(capCost+residualVal)*moneyFactor;
    const preTax=depreciation+finance;
    const monthly=preTax*(1+taxRate/100);
    const totalLeaseCost=monthly*term+downPmt+tradeIn;
    const aprEquiv=moneyFactor*2400;
    return{residualVal,capCost,depreciation,finance,monthly,totalLeaseCost,aprEquiv};
  },[msrp,negotiated,downPmt,tradeIn,residualPct,moneyFactor,term,taxRate]);
  return(<div><div className="calc-input-panel">
    <F label="🚗 MSRP (Sticker Price)" value={msrp} onChange={setMsrp} step={1000}/>
    <F label="💰 Negotiated Price" value={negotiated} onChange={setNegotiated} step={500}/>
    <F label="💵 Down Payment (Cap Reduction)" value={downPmt} onChange={setDownPmt} step={500}/>
    <F label="🔄 Trade-In Value" value={tradeIn} onChange={setTradeIn} step={500}/>
    <F label="📉 Residual Value (%)" value={residualPct} onChange={setResidualPct} step={1} min={20} max={80}/>
    <F label="📊 Money Factor" value={moneyFactor} onChange={setMoneyFactor} step={0.0001} min={0.0001}/>
    <div className="calc-field"><label className="calc-field__label">📅 Lease Term</label>
      <div className="tax-toggle">{[{l:"24 mo",v:24},{l:"36 mo",v:36},{l:"39 mo",v:39},{l:"48 mo",v:48}].map(o=>(<button key={o.v} className={`tax-toggle__btn${term===o.v?" active":""}`} onClick={()=>setTerm(o.v)}>{o.l}</button>))}</div></div>
    <F label="📋 Sales Tax Rate (%)" value={taxRate} onChange={setTaxRate} step={0.25}/>
  </div>
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Monthly Lease Payment</p>
      <p className="calc-result__emi">{fmtUSD(r.monthly)}<span style={{fontSize:"0.4em",fontWeight:400}}>/mo</span></p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Depreciation/mo</p><p className="calc-result__stat-value">{fmtUSD(r.depreciation)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Finance Charge/mo</p><p className="calc-result__stat-value">{fmtUSD(r.finance)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Residual Value</p><p className="calc-result__stat-value">{fmtUSD(r.residualVal)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">APR Equivalent</p><p className="calc-result__stat-value">{r.aprEquiv.toFixed(1)}%</p></div>
      </div>
      <div className="calc-result__breakdown" style={{marginTop:"var(--s-3)"}}>
        <p className="calc-result__breakdown-line">Total lease cost: {fmtUSD(r.totalLeaseCost)} over {term} months</p>
        <p className="calc-result__breakdown-line">💡 Money Factor × 2400 = APR equivalent. Lower money factor = lower cost.</p>
      </div>
    </div></div>);
}

// ─── Lease vs Buy Calculator ───
function LeaseVsBuyCalc({defaults}:P){
  const[price,setPrice]=useState(defaults.amount||40000);
  const[downPmt,setDownPmt]=useState(5000);
  const[buyRate,setBuyRate]=useState(defaults.rate||6.5);
  const[buyTerm,setBuyTerm]=useState(60);
  const[residualPct,setResidualPct]=useState(55);
  const[moneyFactor,setMoneyFactor]=useState(0.0025);
  const[leaseTerm,setLeaseTerm]=useState(36);
  const[taxRate,setTaxRate]=useState(7);
  const r=useMemo(()=>{
    // Buy calculation
    const buyTax=price*taxRate/100;const buyLoan=price+buyTax-downPmt;
    const buyMr=buyRate/100/12;const buyMonthly=pmt(buyMr,buyTerm,buyLoan);
    const buyTotal=buyMonthly*buyTerm+downPmt;const buyInt=buyMonthly*buyTerm-buyLoan;
    // Estimated resale after lease term period
    const resaleAfterLease=price*residualPct/100;const buyNetCost=buyTotal-resaleAfterLease;
    // Lease calculation
    const residualVal=price*residualPct/100;const capCost=price-downPmt;
    const dep=(capCost-residualVal)/leaseTerm;const fin=(capCost+residualVal)*moneyFactor;
    const leaseMonthly=(dep+fin)*(1+taxRate/100);const leaseTotal=leaseMonthly*leaseTerm+downPmt;
    const winner=leaseTotal<buyNetCost?"lease":"buy";
    const savings=Math.abs(leaseTotal-buyNetCost);
    return{buyMonthly,buyTotal,buyInt,buyNetCost,leaseMonthly,leaseTotal,residualVal,winner,savings};
  },[price,downPmt,buyRate,buyTerm,residualPct,moneyFactor,leaseTerm,taxRate]);
  return(<div><div className="calc-input-panel">
    <F label="🚗 Vehicle Price" value={price} onChange={setPrice} step={1000}/>
    <F label="💵 Down Payment" value={downPmt} onChange={setDownPmt} step={500}/>
    <F label="📋 Sales Tax (%)" value={taxRate} onChange={setTaxRate} step={0.25}/>
    <h3 className="t-h3" style={{margin:"var(--s-3) 0"}}>📊 Buy Options</h3>
    <F label="Buy Loan APR (%)" value={buyRate} onChange={setBuyRate} step={0.1}/>
    <div className="calc-field"><label className="calc-field__label">Buy Loan Term</label>
      <div className="tax-toggle">{[{l:"48m",v:48},{l:"60m",v:60},{l:"72m",v:72}].map(o=>(<button key={o.v} className={`tax-toggle__btn${buyTerm===o.v?" active":""}`} onClick={()=>setBuyTerm(o.v)}>{o.l}</button>))}</div></div>
    <h3 className="t-h3" style={{margin:"var(--s-3) 0"}}>📋 Lease Options</h3>
    <F label="Residual Value (%)" value={residualPct} onChange={setResidualPct} step={1} min={20} max={80}/>
    <F label="Money Factor" value={moneyFactor} onChange={setMoneyFactor} step={0.0001}/>
    <div className="calc-field"><label className="calc-field__label">Lease Term</label>
      <div className="tax-toggle">{[{l:"24m",v:24},{l:"36m",v:36},{l:"39m",v:39}].map(o=>(<button key={o.v} className={`tax-toggle__btn${leaseTerm===o.v?" active":""}`} onClick={()=>setLeaseTerm(o.v)}>{o.l}</button>))}</div></div>
  </div>
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Recommendation</p>
      <p className="calc-result__emi" style={{color:"var(--n-success)"}}>{r.winner==="lease"?"Lease":"Buy"} saves {fmtUSD(r.savings)}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--s-4)",marginTop:"var(--s-4)"}}>
        <div style={{padding:"var(--s-4)",background:r.winner==="buy"?"var(--n-surface-success, #f0fdf4)":"var(--n-surface-2, #f5f5f5)",borderRadius:"var(--r-3)",border:r.winner==="buy"?"2px solid var(--n-success)":"1px solid var(--n-border)"}}>
          <h4 style={{fontWeight:700,marginBottom:"var(--s-2)"}}>🛒 Buy</h4>
          <p>Monthly: <strong>{fmtUSD(r.buyMonthly)}</strong></p>
          <p>Total paid: {fmtUSD(r.buyTotal)}</p>
          <p>Interest: {fmtUSD(r.buyInt)}</p>
          <p>Net cost (after resale): <strong>{fmtUSD(r.buyNetCost)}</strong></p>
        </div>
        <div style={{padding:"var(--s-4)",background:r.winner==="lease"?"var(--n-surface-success, #f0fdf4)":"var(--n-surface-2, #f5f5f5)",borderRadius:"var(--r-3)",border:r.winner==="lease"?"2px solid var(--n-success)":"1px solid var(--n-border)"}}>
          <h4 style={{fontWeight:700,marginBottom:"var(--s-2)"}}>📋 Lease</h4>
          <p>Monthly: <strong>{fmtUSD(r.leaseMonthly)}</strong></p>
          <p>Total cost: {fmtUSD(r.leaseTotal)}</p>
          <p>Residual: {fmtUSD(r.residualVal)}</p>
          <p>You return the car at end</p>
        </div>
      </div>
    </div></div>);
}

// ─── Generic Vehicle Loan (shared for Boat, Motorcycle, RV, ATV) ───
function VehicleLoanCalc({defaults, vehicleType, defaultRate, defaultTerm, icon}:{defaults:any;vehicleType:string;defaultRate:number;defaultTerm:number;icon:string}){
  const[price,setPrice]=useState(defaults.amount||25000);
  const[taxRate,setTaxRate]=useState(7);
  const[tradeIn,setTradeIn]=useState(0);
  const[downPmt,setDownPmt]=useState(0);
  const[rate,setRate]=useState(defaults.rate||defaultRate);
  const[term,setTerm]=useState(defaults.tenure||defaultTerm);
  const r=useMemo(()=>{
    const tax=price*taxRate/100;const loanAmt=Math.max(0,price+tax-tradeIn-downPmt);
    const mr=rate/100/12;const monthly=pmt(mr,term,loanAmt);
    const totalPaid=monthly*term;const totalInt=totalPaid-loanAmt;
    const amort:{mo:number;pmt:number;int:number;prin:number;bal:number}[]=[];
    let bal=loanAmt;
    for(let i=1;i<=Math.min(term,12);i++){const intPay=bal*mr;const prinPay=monthly-intPay;bal=Math.max(0,bal-prinPay);
      amort.push({mo:i,pmt:monthly,int:intPay,prin:prinPay,bal});}
    return{loanAmt,monthly,totalPaid,totalInt,tax,amort};
  },[price,taxRate,tradeIn,downPmt,rate,term]);
  const termOptions = vehicleType==="RV"?
    [{l:"5 yr",v:60},{l:"7 yr",v:84},{l:"10 yr",v:120},{l:"15 yr",v:180},{l:"20 yr",v:240}]:
    [{l:"24 mo",v:24},{l:"36 mo",v:36},{l:"48 mo",v:48},{l:"60 mo",v:60},{l:"72 mo",v:72}];
  return(<div><div className="calc-input-panel">
    <F label={`${icon} ${vehicleType} Price`} value={price} onChange={setPrice} step={500}/>
    <F label="📋 Sales Tax Rate (%)" value={taxRate} onChange={setTaxRate} step={0.25}/>
    <F label="🔄 Trade-In Value" value={tradeIn} onChange={setTradeIn} step={500}/>
    <F label="💵 Down Payment" value={downPmt} onChange={setDownPmt} step={500}/>
    <F label="📊 Interest Rate (APR %)" value={rate} onChange={setRate} step={0.1}/>
    <div className="calc-field"><label className="calc-field__label">📅 Loan Term</label>
      <div className="tax-toggle">{termOptions.map(o=>(<button key={o.v} className={`tax-toggle__btn${term===o.v?" active":""}`} onClick={()=>setTerm(o.v)}>{o.l}</button>))}</div></div>
  </div>
    <div className="calc-result" aria-live="polite">
      <p className="calc-result__label">Monthly {vehicleType} Payment</p>
      <p className="calc-result__emi">{fmtUSD(r.monthly)}<span style={{fontSize:"0.4em",fontWeight:400}}>/mo</span></p>
      <div className="calc-result__stats">
        <div className="calc-result__stat"><p className="calc-result__stat-label">Loan Amount</p><p className="calc-result__stat-value">{fmtUSD(r.loanAmt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Total Interest</p><p className="calc-result__stat-value" style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(r.totalInt)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Total Paid</p><p className="calc-result__stat-value">{fmtUSD(r.totalPaid)}</p></div>
        <div className="calc-result__stat"><p className="calc-result__stat-label">Sales Tax</p><p className="calc-result__stat-value">{fmtUSD(r.tax)}</p></div>
      </div>
    </div>
    <div style={{marginTop:"var(--s-6)",overflowX:"auto"}}>
      <h3 className="t-h3" style={{marginBottom:"var(--s-3)"}}>Amortization Schedule (First 12 Months)</h3>
      <table className="comparison-table"><thead><tr><th>Month</th><th>Payment</th><th>Interest</th><th>Principal</th><th>Balance</th></tr></thead>
        <tbody>{r.amort.map(m=>(<tr key={m.mo}><td>{m.mo}</td><td>{fmtUSD(m.pmt)}</td><td style={{color:"var(--n-error, #ef4444)"}}>{fmtUSD(m.int)}</td><td style={{color:"var(--n-success)"}}>{fmtUSD(m.prin)}</td><td>{fmtUSD(m.bal)}</td></tr>))}</tbody></table>
    </div></div>);
}

function BoatLoanCalc({defaults}:P){return<VehicleLoanCalc defaults={defaults} vehicleType="Boat" defaultRate={7.5} defaultTerm={60} icon="🚤"/>;}
function MotorcycleLoanCalc({defaults}:P){return<VehicleLoanCalc defaults={defaults} vehicleType="Motorcycle" defaultRate={7} defaultTerm={48} icon="🏍️"/>;}
function RVLoanCalc({defaults}:P){return<VehicleLoanCalc defaults={defaults} vehicleType="RV" defaultRate={6.5} defaultTerm={120} icon="🏕️"/>;}
function ATVLoanCalc({defaults}:P){return<VehicleLoanCalc defaults={defaults} vehicleType="ATV" defaultRate={8} defaultTerm={48} icon="🏎️"/>;}

// ─── Dispatcher ───
const CALC_MAP:Record<string,React.FC<P>>={
  autoLoan:AutoLoanCalc, carLease:CarLeaseCalc, leaseVsBuy:LeaseVsBuyCalc,
  boatLoan:BoatLoanCalc, motorcycleLoan:MotorcycleLoanCalc,
  rvLoan:RVLoanCalc, atvLoan:ATVLoanCalc,
};

export default function VehicleCalculatorCore({calcType,defaults,sliderRanges}:{calcType:string;defaults:any;sliderRanges?:any}){
  const Comp=CALC_MAP[calcType];
  if(!Comp)return<p className="text-muted">Calculator "{calcType}" coming soon.</p>;
  return<Comp defaults={defaults} sliderRanges={sliderRanges}/>;
}
