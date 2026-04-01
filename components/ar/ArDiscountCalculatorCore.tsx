"use client";
import { useState, useMemo } from "react";

// ─── SAR Formatter ───
function fmtSAR(n: number): string {
    if (!isFinite(n) || isNaN(n)) return "٠ ر.س";
    return n.toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " ر.س";
}

type Mode = "after" | "before" | "percent";

export default function ArDiscountCalculatorCore() {
    const [mode, setMode] = useState<Mode>("after");

    // Mode 1: السعر بعد الخصم
    const [price, setPrice] = useState(1000);
    const [discountPct, setDiscountPct] = useState(25);
    const [extraPct, setExtraPct] = useState(0);

    // Mode 2: السعر قبل الخصم
    const [salePrice, setSalePrice] = useState(750);
    const [reverseDiscountPct, setReverseDiscountPct] = useState(25);

    // Mode 3: نسبة الخصم
    const [originalForPercent, setOriginalForPercent] = useState(1000);
    const [salePriceForPercent, setSalePriceForPercent] = useState(750);

    // ─── Mode 1: Price after discount ───
    const afterResult = useMemo(() => {
        const d1 = price * (discountPct / 100);
        const afterFirst = price - d1;
        const d2 = extraPct > 0 ? afterFirst * (extraPct / 100) : 0;
        const finalPrice = afterFirst - d2;
        const totalSaved = price - finalPrice;
        const effectivePct = price > 0 ? (totalSaved / price) * 100 : 0;
        return { finalPrice, totalSaved, effectivePct, afterFirst, d1, d2 };
    }, [price, discountPct, extraPct]);

    // ─── Mode 2: Price before discount (reverse) ───
    const beforeResult = useMemo(() => {
        if (reverseDiscountPct >= 100) return { originalPrice: 0, discountAmount: 0 };
        const original = salePrice / (1 - reverseDiscountPct / 100);
        const discountAmount = original - salePrice;
        return { originalPrice: original, discountAmount };
    }, [salePrice, reverseDiscountPct]);

    // ─── Mode 3: Find discount percentage ───
    const percentResult = useMemo(() => {
        if (originalForPercent <= 0) return { discountPct: 0, discountAmount: 0 };
        const discountAmount = originalForPercent - salePriceForPercent;
        const pct = (discountAmount / originalForPercent) * 100;
        return { discountPct: pct, discountAmount };
    }, [originalForPercent, salePriceForPercent]);

    const modes: { key: Mode; label: string; icon: string }[] = [
        { key: "after", label: "السعر بعد الخصم", icon: "🏷️" },
        { key: "before", label: "السعر قبل الخصم", icon: "🔄" },
        { key: "percent", label: "نسبة الخصم", icon: "📊" },
    ];

    return (
        <div className="calc-card">
            {/* Mode Selector */}
            <div className="calc-field">
                <label className="calc-field__label">📊 نوع الحساب</label>
                <div className="tax-toggle">
                    {modes.map((m) => (
                        <button key={m.key}
                            className={`tax-toggle__btn${mode === m.key ? " active" : ""}`}
                            onClick={() => setMode(m.key)}>
                            {m.icon} {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══ MODE 1: السعر بعد الخصم ═══ */}
            {mode === "after" && (
                <>
                    <div className="calc-field">
                        <label className="calc-field__label">💰 السعر الأصلي (ر.س)</label>
                        <input type="range" className="calc-field__slider" min={0} max={100000} step={50}
                            value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                        <input type="number" className="calc-field__input" value={price}
                            onChange={(e) => setPrice(Number(e.target.value))} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label">🏷️ نسبة الخصم (%)</label>
                        <input type="range" className="calc-field__slider" min={0} max={100} step={0.5}
                            value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} />
                        <input type="number" className="calc-field__input" value={discountPct}
                            onChange={(e) => setDiscountPct(Number(e.target.value))} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label">🎁 خصم إضافي (%)</label>
                        <input type="range" className="calc-field__slider" min={0} max={100} step={0.5}
                            value={extraPct} onChange={(e) => setExtraPct(Number(e.target.value))} />
                        <input type="number" className="calc-field__input" value={extraPct}
                            onChange={(e) => setExtraPct(Number(e.target.value))} />
                    </div>

                    <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                        <p className="calc-field__label">السعر بعد الخصم</p>
                        <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                            {fmtSAR(afterResult.finalPrice)}
                        </p>
                        <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                            <div><p className="calc-field__label">التوفير</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmtSAR(afterResult.totalSaved)}</p></div>
                            <div><p className="calc-field__label">نسبة التوفير</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{afterResult.effectivePct.toFixed(1)}%</p></div>
                            <div><p className="calc-field__label">السعر الأصلي</p><p style={{ fontWeight: 700, textDecoration: "line-through", color: "var(--n-text-muted)" }}>{fmtSAR(price)}</p></div>
                        </div>
                        {extraPct > 0 && (
                            <>
                                <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                                    ⚠️ الخصم المتتالي: {discountPct}% + {extraPct}% ≠ {discountPct + extraPct}%. الخصم الفعلي = {afterResult.effectivePct.toFixed(1)}%.
                                    الخصم الثاني يُطبق على {fmtSAR(afterResult.afterFirst)} وليس على السعر الأصلي.
                                </p>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* ═══ MODE 2: السعر قبل الخصم (عكسي) ═══ */}
            {mode === "before" && (
                <>
                    <div className="calc-field">
                        <label className="calc-field__label">🛒 سعر البيع بعد الخصم (ر.س)</label>
                        <input type="range" className="calc-field__slider" min={0} max={100000} step={50}
                            value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} />
                        <input type="number" className="calc-field__input" value={salePrice}
                            onChange={(e) => setSalePrice(Number(e.target.value))} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label">🏷️ نسبة الخصم المُطبقة (%)</label>
                        <input type="range" className="calc-field__slider" min={0} max={99} step={0.5}
                            value={reverseDiscountPct} onChange={(e) => setReverseDiscountPct(Number(e.target.value))} />
                        <input type="number" className="calc-field__input" value={reverseDiscountPct}
                            onChange={(e) => setReverseDiscountPct(Number(e.target.value))} />
                    </div>

                    <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                        <p className="calc-field__label">السعر الأصلي (قبل الخصم)</p>
                        <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                            {fmtSAR(beforeResult.originalPrice)}
                        </p>
                        <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                            <div><p className="calc-field__label">قيمة الخصم</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmtSAR(beforeResult.discountAmount)}</p></div>
                            <div><p className="calc-field__label">نسبة الخصم</p><p style={{ fontWeight: 700 }}>{reverseDiscountPct}%</p></div>
                            <div><p className="calc-field__label">سعر البيع</p><p style={{ fontWeight: 700 }}>{fmtSAR(salePrice)}</p></div>
                        </div>
                        <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                            المعادلة: السعر قبل الخصم = سعر البيع ÷ (1 − نسبة الخصم) = {salePrice} ÷ {(1 - reverseDiscountPct / 100).toFixed(2)} = {beforeResult.originalPrice.toFixed(0)} ر.س
                        </p>
                    </div>
                </>
            )}

            {/* ═══ MODE 3: حساب نسبة الخصم ═══ */}
            {mode === "percent" && (
                <>
                    <div className="calc-field">
                        <label className="calc-field__label">💰 السعر الأصلي (ر.س)</label>
                        <input type="range" className="calc-field__slider" min={0} max={100000} step={50}
                            value={originalForPercent} onChange={(e) => setOriginalForPercent(Number(e.target.value))} />
                        <input type="number" className="calc-field__input" value={originalForPercent}
                            onChange={(e) => setOriginalForPercent(Number(e.target.value))} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label">🛒 سعر البيع (ر.س)</label>
                        <input type="range" className="calc-field__slider" min={0} max={100000} step={50}
                            value={salePriceForPercent} onChange={(e) => setSalePriceForPercent(Number(e.target.value))} />
                        <input type="number" className="calc-field__input" value={salePriceForPercent}
                            onChange={(e) => setSalePriceForPercent(Number(e.target.value))} />
                    </div>

                    <div className="calc-card" style={{ marginTop: "var(--s-4)", background: "var(--n-surface-alt)" }}>
                        <p className="calc-field__label">نسبة الخصم</p>
                        <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: percentResult.discountPct >= 0 ? "var(--n-primary)" : "var(--n-error)", marginBottom: "var(--s-3)" }}>
                            {percentResult.discountPct.toFixed(1)}%
                        </p>
                        <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
                            <div><p className="calc-field__label">قيمة الخصم</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{fmtSAR(percentResult.discountAmount)}</p></div>
                            <div><p className="calc-field__label">السعر الأصلي</p><p style={{ fontWeight: 700 }}>{fmtSAR(originalForPercent)}</p></div>
                            <div><p className="calc-field__label">سعر البيع</p><p style={{ fontWeight: 700 }}>{fmtSAR(salePriceForPercent)}</p></div>
                        </div>
                        <hr style={{ borderColor: "var(--n-border)", margin: "var(--s-3) 0" }} />
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                            المعادلة: نسبة الخصم = ((السعر الأصلي − سعر البيع) ÷ السعر الأصلي) × 100 = (({originalForPercent} − {salePriceForPercent}) ÷ {originalForPercent}) × 100 = {percentResult.discountPct.toFixed(1)}%
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
