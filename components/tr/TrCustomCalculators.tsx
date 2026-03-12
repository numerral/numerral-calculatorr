// TrCustomCalculators — Client components for Turkish calculators
"use client";

import { useState, useMemo } from "react";

const fmtTRY = (n: number) =>
    n.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " ₺";

const fmtPct = (n: number) => "%" + n.toFixed(2);

// ═══ EMI / Loan ═══
function EMICalc({ label }: { label?: string }) {
    const [amount, setAmount] = useState(500000);
    const [rate, setRate] = useState(2.49);
    const [tenure, setTenure] = useState(60);
    const res = useMemo(() => {
        const r = rate / 100;
        const emi = r > 0 ? (amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1) : amount / tenure;
        const total = emi * tenure;
        const interest = total - amount;
        return { emi, total, interest };
    }, [amount, rate, tenure]);
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>{label || "Kredi Tutarı (₺)"}</label>
                    <input type="number" className="ar-custom-calc__number-input" value={amount} onChange={e => setAmount(+e.target.value)} min={1000} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Aylık Faiz (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rate} onChange={e => setRate(+e.target.value)} min={0.01} max={10} step={0.01} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Vade (ay)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={tenure} onChange={e => setTenure(+e.target.value)} min={1} max={360} step={1} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Aylık Taksit</span>
                    <span className="ar-custom-calc__result-value">{fmtTRY(res.emi)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">{fmtTRY(amount)}</span><span className="ar-custom-calc__card-label">Anapara</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtTRY(res.interest)}</span><span className="ar-custom-calc__card-label">Toplam Faiz</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💳</span><span className="ar-custom-calc__card-value">{fmtTRY(res.total)}</span><span className="ar-custom-calc__card-label">Toplam Geri Ödeme</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Compound Interest ═══
function CompoundCalc() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(45);
    const [years, setYears] = useState(5);
    const res = useMemo(() => {
        const fv = principal * Math.pow(1 + rate / 100, years);
        return { fv, interest: fv - principal };
    }, [principal, rate, years]);
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Anapara (₺)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={principal} onChange={e => setPrincipal(+e.target.value)} min={0} step={10000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Yıllık Faiz (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rate} onChange={e => setRate(+e.target.value)} min={0.1} max={200} step={0.5} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Süre (yıl)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={years} onChange={e => setYears(+e.target.value)} min={1} max={50} step={1} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Gelecek Değer</span>
                    <span className="ar-custom-calc__result-value">{fmtTRY(res.fv)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">{fmtTRY(principal)}</span><span className="ar-custom-calc__card-label">Anapara</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📈</span><span className="ar-custom-calc__card-value">{fmtTRY(res.interest)}</span><span className="ar-custom-calc__card-label">Kazanç</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">⏳</span><span className="ar-custom-calc__card-value">{(72 / rate).toFixed(1)} yıl</span><span className="ar-custom-calc__card-label">2× Katlanma</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ KDV ═══
function KDVCalc() {
    const [price, setPrice] = useState(1000);
    const [kdvRate, setKdvRate] = useState(20);
    const [mode, setMode] = useState<"add" | "extract">("add");
    const res = useMemo(() => {
        if (mode === "add") { const kdv = price * kdvRate / 100; return { base: price, kdv, total: price + kdv }; }
        const base = price / (1 + kdvRate / 100); const kdv = price - base; return { base, kdv, total: price };
    }, [price, kdvRate, mode]);
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>{mode === "add" ? "KDV Hariç Fiyat (₺)" : "KDV Dahil Fiyat (₺)"}</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={0} step={100} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>KDV Oranı</label>
                    <select className="ar-custom-calc__number-input" value={kdvRate} onChange={e => setKdvRate(+e.target.value)}>
                        <option value={1}>%1</option>
                        <option value={10}>%10</option>
                        <option value={20}>%20</option>
                    </select>
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>İşlem</label>
                    <select className="ar-custom-calc__number-input" value={mode} onChange={e => setMode(e.target.value as "add" | "extract")}>
                        <option value="add">KDV Ekle</option>
                        <option value="extract">KDV Çıkar</option>
                    </select>
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">KDV Tutarı</span>
                    <span className="ar-custom-calc__result-value">{fmtTRY(res.kdv)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏷️</span><span className="ar-custom-calc__card-value">{fmtTRY(res.base)}</span><span className="ar-custom-calc__card-label">KDV Hariç</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🧾</span><span className="ar-custom-calc__card-value">{fmtTRY(res.kdv)}</span><span className="ar-custom-calc__card-label">KDV</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💳</span><span className="ar-custom-calc__card-value">{fmtTRY(res.total)}</span><span className="ar-custom-calc__card-label">KDV Dahil</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Percentage ═══
function PercentageCalc() {
    const [a, setA] = useState(250);
    const [b, setB] = useState(1000);
    const pct = b !== 0 ? (a / b) * 100 : 0;
    const ofB = (a / 100) * b;
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Değer A</label><input type="number" className="ar-custom-calc__number-input" value={a} onChange={e => setA(+e.target.value)} /></div>
                <div className="ar-custom-calc__input-group"><label>Değer B</label><input type="number" className="ar-custom-calc__number-input" value={b} onChange={e => setB(+e.target.value)} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtPct(pct)}</span><span className="ar-custom-calc__card-label">{a}, {b}'nin %kaçı?</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🔢</span><span className="ar-custom-calc__card-value">{ofB.toLocaleString("tr-TR")}</span><span className="ar-custom-calc__card-label">{b}'nin %{a}'i?</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📈</span><span className="ar-custom-calc__card-value">{b !== 0 ? fmtPct(((a - b) / b) * 100) : "—"}</span><span className="ar-custom-calc__card-label">{b} → {a} değişim</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Discount ═══
function DiscountCalc() {
    const [price, setPrice] = useState(1000);
    const [disc, setDisc] = useState(30);
    const saved = price * disc / 100;
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Orijinal Fiyat (₺)</label><input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={0} step={100} /></div>
                <div className="ar-custom-calc__input-group"><label>İndirim (%)</label><input type="number" className="ar-custom-calc__number-input" value={disc} onChange={e => setDisc(+e.target.value)} min={0} max={100} step={0.5} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">İndirimli Fiyat</span><span className="ar-custom-calc__result-value">{fmtTRY(price - saved)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏷️</span><span className="ar-custom-calc__card-value">{fmtTRY(price)}</span><span className="ar-custom-calc__card-label">Orijinal</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💚</span><span className="ar-custom-calc__card-value">{fmtTRY(saved)}</span><span className="ar-custom-calc__card-label">Tasarruf</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ BMI (VKİ) ═══
function BMICalc() {
    const [weight, setWeight] = useState(80);
    const [height, setHeight] = useState(175);
    const bmi = weight / Math.pow(height / 100, 2);
    const cat = bmi < 18.5 ? "Zayıf" : bmi < 25 ? "Normal" : bmi < 30 ? "Fazla Kilolu" : "Obez";
    const col = bmi < 18.5 ? "#3b82f6" : bmi < 25 ? "#22c55e" : bmi < 30 ? "#f59e0b" : "#ef4444";
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group"><label>Kilo (kg)</label><input type="number" className="ar-custom-calc__number-input" value={weight} onChange={e => setWeight(+e.target.value)} min={1} max={300} step={0.5} /></div>
                <div className="ar-custom-calc__input-group"><label>Boy (cm)</label><input type="number" className="ar-custom-calc__number-input" value={height} onChange={e => setHeight(+e.target.value)} min={50} max={250} step={1} /></div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">VKİ (BMI)</span><span className="ar-custom-calc__result-value" style={{ color: col }}>{bmi.toFixed(1)}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📋</span><span className="ar-custom-calc__card-value" style={{ color: col }}>{cat}</span><span className="ar-custom-calc__card-label">Kategori</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">⚖️</span><span className="ar-custom-calc__card-value">{(18.5 * Math.pow(height / 100, 2)).toFixed(0)}-{(24.9 * Math.pow(height / 100, 2)).toFixed(0)} kg</span><span className="ar-custom-calc__card-label">İdeal Kilo</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Age ═══
function AgeCalc() {
    const [dob, setDob] = useState("1990-01-01");
    const res = useMemo(() => {
        const birth = new Date(dob); const now = new Date();
        let y = now.getFullYear() - birth.getFullYear(); let m = now.getMonth() - birth.getMonth(); let d = now.getDate() - birth.getDate();
        if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
        return { y, m, d, totalDays };
    }, [dob]);
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row"><div className="ar-custom-calc__input-group"><label>Doğum Tarihi</label><input type="date" className="ar-custom-calc__number-input" value={dob} onChange={e => setDob(e.target.value)} /></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Yaşınız</span><span className="ar-custom-calc__result-value">{res.y} Yıl {res.m} Ay {res.d} Gün</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">{res.totalDays.toLocaleString("tr-TR")}</span><span className="ar-custom-calc__card-label">Toplam Gün</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📆</span><span className="ar-custom-calc__card-value">{(res.y * 12 + res.m).toLocaleString("tr-TR")}</span><span className="ar-custom-calc__card-label">Toplam Ay</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Pregnancy ═══
function PregnancyCalc() {
    const [lmp, setLmp] = useState("2026-01-01");
    const res = useMemo(() => {
        const lmpDate = new Date(lmp); const edd = new Date(lmpDate.getTime() + 280 * 86400000);
        const now = new Date(); const daysPassed = Math.max(0, Math.floor((now.getTime() - lmpDate.getTime()) / 86400000));
        const weeks = Math.floor(daysPassed / 7); const days = daysPassed % 7;
        const trimester = weeks < 13 ? 1 : weeks < 28 ? 2 : 3;
        return { edd, weeks, days, trimester };
    }, [lmp]);
    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row"><div className="ar-custom-calc__input-group"><label>Son Adet Tarihi (SAT)</label><input type="date" className="ar-custom-calc__number-input" value={lmp} onChange={e => setLmp(e.target.value)} /></div></div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main"><span className="ar-custom-calc__result-label">Tahmini Doğum Tarihi</span><span className="ar-custom-calc__result-value">{res.edd.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span></div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">{res.weeks}H {res.days}G</span><span className="ar-custom-calc__card-label">Gebelik Haftası</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🤰</span><span className="ar-custom-calc__card-value">{res.trimester}. Trimester</span><span className="ar-custom-calc__card-label">Dönem</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ ROUTER ═══
export default function TrCustomCalculatorCore({ calcType }: { calcType: string }) {
    switch (calcType) {
        case "mortgage": return <EMICalc label="Kredi Tutarı (₺)" />;
        case "emi": return <EMICalc />;
        case "compound-interest": return <CompoundCalc />;
        case "kdv": return <KDVCalc />;
        case "percentage": return <PercentageCalc />;
        case "discount": return <DiscountCalc />;
        case "bmi": return <BMICalc />;
        case "age": return <AgeCalc />;
        case "pregnancy": return <PregnancyCalc />;
        case "gelir-vergisi": return <EMICalc label="Brüt Yıllık Gelir (₺)" />;
        case "maas": return <EMICalc label="Brüt Maaş (₺)" />;
        case "sgk": return <EMICalc label="Brüt Maaş (₺)" />;
        case "kidem": return <EMICalc label="Brüt Maaş (₺)" />;
        case "profit": return <DiscountCalc />;
        case "margin": return <DiscountCalc />;
        case "roi": return <CompoundCalc />;
        case "average": return <PercentageCalc />;
        case "fraction": return <PercentageCalc />;
        case "power": return <PercentageCalc />;
        case "currency": return <PercentageCalc />;
        default: return <EMICalc />;
    }
}
