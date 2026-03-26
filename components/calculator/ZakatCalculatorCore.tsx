"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number) => n.toLocaleString("en-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const p = (v: string) => { const n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

/* Gold purity multipliers — convert carat to pure gold fraction */
const GOLD_PURITY: Record<string, number> = { "24": 1, "22": 22 / 24, "21": 21 / 24, "18": 18 / 24 };

/* Default gold/silver prices per gram in SAR (approximate mid-2026 values) */
const DEFAULT_GOLD_PRICE = 310; // SAR per gram (24k)
const DEFAULT_SILVER_PRICE = 3.8; // SAR per gram

/* Nisab thresholds in grams */
const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 612.36;

/* ── Sub-components ── */
function InputField({ label, value, onChange, unit, placeholder, step }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string; step?: number;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={0} step={step || 1} placeholder={placeholder || "0"} />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </div>
    );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="con-result-row" style={highlight ? { background: "rgba(0,100,60,0.06)", borderRadius: 6, padding: "12px 0", margin: "4px 0" } : {}}>
            <span className="con-result-row__label" style={highlight ? { fontWeight: 700, color: "var(--n-text)" } : {}}>{label}</span>
            <span className="con-result-row__value" style={highlight ? { fontSize: "1.1rem", color: "#006a3c" } : {}}>{value}</span>
        </div>
    );
}

function SectionHeader({ icon, title, collapsed, toggle }: { icon: string; title: string; collapsed: boolean; toggle: () => void }) {
    return (
        <button onClick={toggle} type="button" style={{
            display: "flex", alignItems: "center", gap: "var(--s-3)", width: "100%",
            padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)",
            borderRadius: "var(--r-sm)", cursor: "pointer", marginBottom: collapsed ? 0 : "var(--s-3)",
            transition: "all 0.15s ease",
        }}>
            <span style={{ fontSize: "1.2rem" }}>{icon}</span>
            <span style={{ flex: 1, textAlign: "left", fontWeight: 600, fontSize: "0.92rem", color: "var(--n-text)" }}>{title}</span>
            <span style={{ color: "var(--n-text-muted)", fontSize: "0.85rem", transition: "transform 0.2s" }}>{collapsed ? "▸" : "▾"}</span>
        </button>
    );
}

/* ── Main Calculator Component ── */
export default function ZakatCalculatorCore() {
    /* Gold & Silver */
    const [goldWeight, setGoldWeight] = useState("");
    const [goldCarat, setGoldCarat] = useState("21");
    const [goldPrice, setGoldPrice] = useState(DEFAULT_GOLD_PRICE.toString());
    const [silverWeight, setSilverWeight] = useState("");
    const [silverPrice, setSilverPrice] = useState(DEFAULT_SILVER_PRICE.toString());

    /* Cash & Bank */
    const [cashOnHand, setCashOnHand] = useState("");
    const [savingsAcc, setSavingsAcc] = useState("");
    const [checkingAcc, setCheckingAcc] = useState("");
    const [foreignCurrency, setForeignCurrency] = useState("");

    /* Investments */
    const [stocksValue, setStocksValue] = useState("");
    const [mutualFunds, setMutualFunds] = useState("");
    const [crypto, setCrypto] = useState("");
    const [otherInvest, setOtherInvest] = useState("");

    /* Business Assets */
    const [inventory, setInventory] = useState("");
    const [receivables, setReceivables] = useState("");
    const [businessCash, setBusinessCash] = useState("");

    /* Real Estate */
    const [rentalSaved, setRentalSaved] = useState("");
    const [propertyResale, setPropertyResale] = useState("");

    /* Money Owed To You */
    const [loansGiven, setLoansGiven] = useState("");

    /* Deductible Liabilities */
    const [immediateDebts, setImmediateDebts] = useState("");
    const [installmentsDue, setInstallmentsDue] = useState("");
    const [overduePayments, setOverduePayments] = useState("");

    /* Nisab standard */
    const [nisabStandard, setNisabStandard] = useState<"silver" | "gold">("silver");

    /* Section collapse state */
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
        gold: false, cash: false, invest: true, business: true, realestate: true, owed: true, liabilities: false,
    });
    const toggle = (k: string) => setCollapsed((prev) => ({ ...prev, [k]: !prev[k] }));

    /* ── Calculations ── */
    const result = useMemo(() => {
        const gp = p(goldPrice);
        const sp = p(silverPrice);

        // Gold: weight × purity × price per gram (24k)
        const pureGoldGrams = p(goldWeight) * (GOLD_PURITY[goldCarat] || 1);
        const goldValue = pureGoldGrams * gp;

        // Silver
        const silverValue = p(silverWeight) * sp;

        // Cash
        const cashTotal = p(cashOnHand) + p(savingsAcc) + p(checkingAcc) + p(foreignCurrency);

        // Investments
        const investTotal = p(stocksValue) + p(mutualFunds) + p(crypto) + p(otherInvest);

        // Business
        const businessTotal = p(inventory) + p(receivables) + p(businessCash);

        // Real Estate
        const realEstateTotal = p(rentalSaved) + p(propertyResale);

        // Receivables
        const owedTotal = p(loansGiven);

        // Total Assets
        const totalAssets = goldValue + silverValue + cashTotal + investTotal + businessTotal + realEstateTotal + owedTotal;

        // Liabilities
        const totalLiabilities = p(immediateDebts) + p(installmentsDue) + p(overduePayments);

        // Net Wealth
        const netWealth = Math.max(totalAssets - totalLiabilities, 0);

        // Nisab in SAR
        const nisabGoldSAR = NISAB_GOLD_GRAMS * gp;
        const nisabSilverSAR = NISAB_SILVER_GRAMS * sp;
        const nisabValue = nisabStandard === "gold" ? nisabGoldSAR : nisabSilverSAR;
        const meetsNisab = netWealth >= nisabValue;

        // Zakat
        const zakatDue = meetsNisab ? netWealth * 0.025 : 0;

        return {
            goldValue, silverValue, cashTotal, investTotal, businessTotal, realEstateTotal, owedTotal,
            totalAssets, totalLiabilities, netWealth,
            nisabGoldSAR, nisabSilverSAR, nisabValue, meetsNisab, zakatDue,
            pureGoldGrams,
        };
    }, [goldWeight, goldCarat, goldPrice, silverWeight, silverPrice, cashOnHand, savingsAcc, checkingAcc, foreignCurrency, stocksValue, mutualFunds, crypto, otherInvest, inventory, receivables, businessCash, rentalSaved, propertyResale, loansGiven, immediateDebts, installmentsDue, overduePayments, nisabStandard]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة الزكاة — Zakat Calculator</h2>
                <p className="con-calc__desc">Enter your assets and liabilities in SAR to calculate your Zakat obligation.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>

                {/* ── 1. Gold & Silver ── */}
                <div>
                    <SectionHeader icon="🥇" title="Gold & Silver (الذهب والفضة)" collapsed={collapsed.gold} toggle={() => toggle("gold")} />
                    {!collapsed.gold && (
                        <div style={{ padding: "0 var(--s-2)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                                <InputField label="Gold Weight" value={goldWeight} onChange={setGoldWeight} unit="grams" placeholder="0" step={0.1} />
                                <SelectField label="Gold Carat" value={goldCarat} onChange={setGoldCarat} options={[
                                    { value: "24", label: "24K (Pure)" }, { value: "22", label: "22K" },
                                    { value: "21", label: "21K (KSA Standard)" }, { value: "18", label: "18K" },
                                ]} />
                            </div>
                            <InputField label="Gold Price per Gram (24K)" value={goldPrice} onChange={setGoldPrice} unit="SAR" step={0.01} />
                            <InputField label="Silver Weight" value={silverWeight} onChange={setSilverWeight} unit="grams" placeholder="0" step={0.1} />
                            <InputField label="Silver Price per Gram" value={silverPrice} onChange={setSilverPrice} unit="SAR" step={0.01} />
                            {p(goldWeight) > 0 && (
                                <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", margin: "var(--s-2) 0 0", padding: "0 2px" }}>
                                    Pure gold equivalent: <strong>{result.pureGoldGrams.toFixed(2)}g</strong> • Value: <strong>SAR {fmt(result.goldValue)}</strong>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* ── 2. Cash & Bank ── */}
                <div>
                    <SectionHeader icon="💵" title="Cash & Bank Balances (النقد والأرصدة)" collapsed={collapsed.cash} toggle={() => toggle("cash")} />
                    {!collapsed.cash && (
                        <div style={{ padding: "0 var(--s-2)" }}>
                            <InputField label="Cash on Hand" value={cashOnHand} onChange={setCashOnHand} unit="SAR" />
                            <InputField label="Savings Accounts" value={savingsAcc} onChange={setSavingsAcc} unit="SAR" />
                            <InputField label="Current / Checking Accounts" value={checkingAcc} onChange={setCheckingAcc} unit="SAR" />
                            <InputField label="Foreign Currency Holdings (converted to SAR)" value={foreignCurrency} onChange={setForeignCurrency} unit="SAR" />
                        </div>
                    )}
                </div>

                {/* ── 3. Investments ── */}
                <div>
                    <SectionHeader icon="📈" title="Investments (الاستثمارات)" collapsed={collapsed.invest} toggle={() => toggle("invest")} />
                    {!collapsed.invest && (
                        <div style={{ padding: "0 var(--s-2)" }}>
                            <InputField label="Stocks / Shares (Tadawul, etc.)" value={stocksValue} onChange={setStocksValue} unit="SAR" />
                            <InputField label="Mutual Funds / Sukuk" value={mutualFunds} onChange={setMutualFunds} unit="SAR" />
                            <InputField label="Cryptocurrency (SAR value)" value={crypto} onChange={setCrypto} unit="SAR" />
                            <InputField label="Other Investments" value={otherInvest} onChange={setOtherInvest} unit="SAR" />
                        </div>
                    )}
                </div>

                {/* ── 4. Business Assets ── */}
                <div>
                    <SectionHeader icon="🏢" title="Business Assets (الأصول التجارية)" collapsed={collapsed.business} toggle={() => toggle("business")} />
                    {!collapsed.business && (
                        <div style={{ padding: "0 var(--s-2)" }}>
                            <InputField label="Inventory / Stock-in-Trade" value={inventory} onChange={setInventory} unit="SAR" />
                            <InputField label="Accounts Receivable" value={receivables} onChange={setReceivables} unit="SAR" />
                            <InputField label="Cash in Business Accounts" value={businessCash} onChange={setBusinessCash} unit="SAR" />
                        </div>
                    )}
                </div>

                {/* ── 5. Real Estate ── */}
                <div>
                    <SectionHeader icon="🏠" title="Real Estate Income (العقارات)" collapsed={collapsed.realestate} toggle={() => toggle("realestate")} />
                    {!collapsed.realestate && (
                        <div style={{ padding: "0 var(--s-2)" }}>
                            <InputField label="Accumulated Rental Income (saved)" value={rentalSaved} onChange={setRentalSaved} unit="SAR" />
                            <InputField label="Property Held for Resale (market value)" value={propertyResale} onChange={setPropertyResale} unit="SAR" />
                            <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", margin: "var(--s-2) 0 0" }}>
                                Note: Your primary residence is exempt from Zakat. Only enter rental income you&apos;ve saved or property bought for resale.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── 6. Money Owed To You ── */}
                <div>
                    <SectionHeader icon="🤝" title="Money Owed To You (الديون المستحقة لك)" collapsed={collapsed.owed} toggle={() => toggle("owed")} />
                    {!collapsed.owed && (
                        <div style={{ padding: "0 var(--s-2)" }}>
                            <InputField label="Loans Given (expected repayment)" value={loansGiven} onChange={setLoansGiven} unit="SAR" />
                        </div>
                    )}
                </div>

                {/* ── 7. Deductible Liabilities ── */}
                <div>
                    <SectionHeader icon="📉" title="Deductible Liabilities (الخصوم)" collapsed={collapsed.liabilities} toggle={() => toggle("liabilities")} />
                    {!collapsed.liabilities && (
                        <div style={{ padding: "0 var(--s-2)" }}>
                            <InputField label="Immediate Debts (due within 12 months)" value={immediateDebts} onChange={setImmediateDebts} unit="SAR" />
                            <InputField label="Loan Installments Due (next 12 months)" value={installmentsDue} onChange={setInstallmentsDue} unit="SAR" />
                            <InputField label="Overdue Payments / Arrears" value={overduePayments} onChange={setOverduePayments} unit="SAR" />
                            <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", margin: "var(--s-2) 0 0" }}>
                                Only debts payable within the next 12 months are deductible. Interest (riba) payments cannot be deducted.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Nisab Standard ── */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-2)", color: "var(--n-text)" }}>Nisab Standard (حد النصاب)</p>
                    <div style={{ display: "flex", gap: "var(--s-3)" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.88rem", color: "var(--n-text-secondary)" }}>
                            <input type="radio" checked={nisabStandard === "silver"} onChange={() => setNisabStandard("silver")} /> Silver (612.36g) — SAR {fmt(result.nisabSilverSAR)}
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.88rem", color: "var(--n-text-secondary)" }}>
                            <input type="radio" checked={nisabStandard === "gold"} onChange={() => setNisabStandard("gold")} /> Gold (85g) — SAR {fmt(result.nisabGoldSAR)}
                        </label>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                        Most scholars recommend the silver standard as it has a lower threshold, benefiting more recipients.
                    </p>
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>Asset Breakdown</h4>
                <ResultRow label="Gold & Silver" value={`SAR ${fmt(result.goldValue + result.silverValue)}`} />
                <ResultRow label="Cash & Bank Balances" value={`SAR ${fmt(result.cashTotal)}`} />
                <ResultRow label="Investments" value={`SAR ${fmt(result.investTotal)}`} />
                <ResultRow label="Business Assets" value={`SAR ${fmt(result.businessTotal)}`} />
                <ResultRow label="Real Estate Income" value={`SAR ${fmt(result.realEstateTotal)}`} />
                <ResultRow label="Money Owed To You" value={`SAR ${fmt(result.owedTotal)}`} />

                <div style={{ height: 1, background: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <ResultRow label="Total Zakatable Assets" value={`SAR ${fmt(result.totalAssets)}`} />
                <ResultRow label="Total Deductible Liabilities" value={`SAR ${fmt(result.totalLiabilities)}`} />

                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <ResultRow label="Net Zakatable Wealth" value={`SAR ${fmt(result.netWealth)}`} highlight />

                <div style={{ height: 1, background: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <ResultRow label={`Nisab Threshold (${nisabStandard})`} value={`SAR ${fmt(result.nisabValue)}`} />
                <ResultRow label="Nisab Status" value={result.meetsNisab ? "✅ Eligible — Zakat is due" : "❌ Below Nisab — No Zakat due"} />

                {result.meetsNisab && (
                    <>
                        <div style={{ height: 2, background: "#006a3c", margin: "var(--s-4) 0 var(--s-3)", opacity: 0.3 }} />
                        <div style={{
                            textAlign: "center", padding: "var(--s-5)",
                            background: "linear-gradient(135deg, rgba(0,106,60,0.06) 0%, rgba(0,106,60,0.02) 100%)",
                            borderRadius: "var(--r-md)", border: "1px solid rgba(0,106,60,0.12)",
                        }}>
                            <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>Your Zakat Due (2.5%)</p>
                            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#006a3c", letterSpacing: "-1px" }}>SAR {fmt(result.zakatDue)}</p>
                            <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                                {fmt(result.netWealth)} × 2.5% = {fmt(result.zakatDue)}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
