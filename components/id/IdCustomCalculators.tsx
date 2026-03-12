// IdCustomCalculators — Client components for Indonesian calculators
// Reuses the same ar-custom-calc CSS classes
"use client";

import { useState, useMemo } from "react";

const fmtIDR = (n: number) =>
    "Rp " + n.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const fmtPct = (n: number) => n.toFixed(2) + "%";

// ═══ EMI / Mortgage / Loan Calculator ═══
function EMICalc({ label }: { label?: string }) {
    const [amount, setAmount] = useState(100000000);
    const [rate, setRate] = useState(8);
    const [tenure, setTenure] = useState(60);

    const res = useMemo(() => {
        const r = rate / 100 / 12;
        const n = tenure;
        const emi = r > 0 ? (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : amount / n;
        const totalPayment = emi * n;
        const totalInterest = totalPayment - amount;
        return { emi, totalPayment, totalInterest };
    }, [amount, rate, tenure]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>{label || "Jumlah Pinjaman (Rp)"}</label>
                    <input type="number" className="ar-custom-calc__number-input" value={amount} onChange={e => setAmount(+e.target.value)} min={1000000} step={1000000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Suku Bunga (%/tahun)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rate} onChange={e => setRate(+e.target.value)} min={0.1} max={50} step={0.1} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Tenor (bulan)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={tenure} onChange={e => setTenure(+e.target.value)} min={1} max={360} step={1} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Cicilan Bulanan</span>
                    <span className="ar-custom-calc__result-value">{fmtIDR(res.emi)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">{fmtIDR(amount)}</span><span className="ar-custom-calc__card-label">Pokok Pinjaman</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{fmtIDR(res.totalInterest)}</span><span className="ar-custom-calc__card-label">Total Bunga</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💳</span><span className="ar-custom-calc__card-value">{fmtIDR(res.totalPayment)}</span><span className="ar-custom-calc__card-label">Total Pembayaran</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Compound Interest ═══
function CompoundCalc() {
    const [principal, setPrincipal] = useState(10000000);
    const [rate, setRate] = useState(10);
    const [years, setYears] = useState(10);

    const res = useMemo(() => {
        const fv = principal * Math.pow(1 + rate / 100, years);
        const interest = fv - principal;
        return { fv, interest };
    }, [principal, rate, years]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Modal Awal (Rp)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={principal} onChange={e => setPrincipal(+e.target.value)} min={0} step={1000000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Return/Bunga (%/tahun)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={rate} onChange={e => setRate(+e.target.value)} min={0.1} max={100} step={0.1} />
                </div>
            </div>
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Jangka Waktu (tahun)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={years} onChange={e => setYears(+e.target.value)} min={1} max={50} step={1} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Nilai Akhir</span>
                    <span className="ar-custom-calc__result-value">{fmtIDR(res.fv)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💰</span><span className="ar-custom-calc__card-value">{fmtIDR(principal)}</span><span className="ar-custom-calc__card-label">Modal Awal</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📈</span><span className="ar-custom-calc__card-value">{fmtIDR(res.interest)}</span><span className="ar-custom-calc__card-label">Keuntungan</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">⏳</span><span className="ar-custom-calc__card-value">{(72 / rate).toFixed(1)} thn</span><span className="ar-custom-calc__card-label">Waktu 2× Lipat</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ PPN (VAT 12%) ═══
function PPNCalc() {
    const [price, setPrice] = useState(1000000);
    const [ppnRate] = useState(12);
    const [mode, setMode] = useState<"add" | "extract">("add");

    const res = useMemo(() => {
        if (mode === "add") {
            const ppn = price * ppnRate / 100;
            return { base: price, ppn, total: price + ppn };
        } else {
            const base = price / (1 + ppnRate / 100);
            const ppn = price - base;
            return { base, ppn, total: price };
        }
    }, [price, ppnRate, mode]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>{mode === "add" ? "Harga Belum Termasuk PPN" : "Harga Termasuk PPN"}</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={0} step={1000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Mode</label>
                    <select className="ar-custom-calc__number-input" value={mode} onChange={e => setMode(e.target.value as "add" | "extract")}>
                        <option value="add">Tambahkan PPN</option>
                        <option value="extract">Ekstrak PPN</option>
                    </select>
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">PPN {ppnRate}%</span>
                    <span className="ar-custom-calc__result-value">{fmtIDR(res.ppn)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏷️</span><span className="ar-custom-calc__card-value">{fmtIDR(res.base)}</span><span className="ar-custom-calc__card-label">Harga Dasar</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🧾</span><span className="ar-custom-calc__card-value">{fmtIDR(res.ppn)}</span><span className="ar-custom-calc__card-label">PPN</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💳</span><span className="ar-custom-calc__card-value">{fmtIDR(res.total)}</span><span className="ar-custom-calc__card-label">Harga Akhir</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Percentage Calculator ═══
function PercentageCalc() {
    const [a, setA] = useState(250);
    const [b, setB] = useState(1000);

    const pct = b !== 0 ? (a / b) * 100 : 0;
    const ofB = (a / 100) * b;

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Nilai A</label>
                    <input type="number" className="ar-custom-calc__number-input" value={a} onChange={e => setA(+e.target.value)} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Nilai B</label>
                    <input type="number" className="ar-custom-calc__number-input" value={b} onChange={e => setB(+e.target.value)} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📊</span><span className="ar-custom-calc__card-value">{pct.toFixed(2)}%</span><span className="ar-custom-calc__card-label">{a} dari {b} = ?%</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🔢</span><span className="ar-custom-calc__card-value">{ofB.toLocaleString("id-ID")}</span><span className="ar-custom-calc__card-label">{a}% dari {b} = ?</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📈</span><span className="ar-custom-calc__card-value">{b !== 0 ? (((a - b) / b) * 100).toFixed(2) : 0}%</span><span className="ar-custom-calc__card-label">Perubahan {b} → {a}</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Discount Calculator ═══
function DiscountCalc() {
    const [price, setPrice] = useState(500000);
    const [disc, setDisc] = useState(25);
    const saved = price * disc / 100;
    const finalPrice = price - saved;

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Harga Asli (Rp)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={price} onChange={e => setPrice(+e.target.value)} min={0} step={1000} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Diskon (%)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={disc} onChange={e => setDisc(+e.target.value)} min={0} max={100} step={0.5} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Harga Setelah Diskon</span>
                    <span className="ar-custom-calc__result-value">{fmtIDR(finalPrice)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🏷️</span><span className="ar-custom-calc__card-value">{fmtIDR(price)}</span><span className="ar-custom-calc__card-label">Harga Asli</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">💚</span><span className="ar-custom-calc__card-value">{fmtIDR(saved)}</span><span className="ar-custom-calc__card-label">Anda Hemat</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ BMI Calculator ═══
function BMICalc() {
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const bmi = weight / Math.pow(height / 100, 2);
    const category = bmi < 18.5 ? "Kurus" : bmi < 23 ? "Normal" : bmi < 25 ? "Kelebihan BB" : "Obesitas";
    const color = bmi < 18.5 ? "#3b82f6" : bmi < 23 ? "#22c55e" : bmi < 25 ? "#f59e0b" : "#ef4444";

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Berat Badan (kg)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={weight} onChange={e => setWeight(+e.target.value)} min={1} max={300} step={0.5} />
                </div>
                <div className="ar-custom-calc__input-group">
                    <label>Tinggi Badan (cm)</label>
                    <input type="number" className="ar-custom-calc__number-input" value={height} onChange={e => setHeight(+e.target.value)} min={50} max={250} step={1} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">BMI Anda</span>
                    <span className="ar-custom-calc__result-value" style={{ color }}>{bmi.toFixed(1)}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📋</span><span className="ar-custom-calc__card-value" style={{ color }}>{category}</span><span className="ar-custom-calc__card-label">Kategori (Asia)</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">⚖️</span><span className="ar-custom-calc__card-value">{(18.5 * Math.pow(height / 100, 2)).toFixed(0)}-{(22.9 * Math.pow(height / 100, 2)).toFixed(0)} kg</span><span className="ar-custom-calc__card-label">BB Ideal</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Age Calculator ═══
function AgeCalc() {
    const [dob, setDob] = useState("1995-01-15");
    const res = useMemo(() => {
        const birth = new Date(dob);
        const now = new Date();
        let y = now.getFullYear() - birth.getFullYear();
        let m = now.getMonth() - birth.getMonth();
        let d = now.getDate() - birth.getDate();
        if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
        return { y, m, d, totalDays };
    }, [dob]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Tanggal Lahir</label>
                    <input type="date" className="ar-custom-calc__number-input" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Usia Anda</span>
                    <span className="ar-custom-calc__result-value">{res.y} Tahun {res.m} Bulan {res.d} Hari</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">{res.totalDays.toLocaleString("id-ID")}</span><span className="ar-custom-calc__card-label">Total Hari</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📆</span><span className="ar-custom-calc__card-value">{(res.y * 12 + res.m).toLocaleString("id-ID")}</span><span className="ar-custom-calc__card-label">Total Bulan</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Pregnancy Calculator ═══
function PregnancyCalc() {
    const [lmp, setLmp] = useState("2026-01-01");
    const res = useMemo(() => {
        const lmpDate = new Date(lmp);
        const edd = new Date(lmpDate.getTime() + 280 * 86400000);
        const now = new Date();
        const daysPassed = Math.max(0, Math.floor((now.getTime() - lmpDate.getTime()) / 86400000));
        const weeks = Math.floor(daysPassed / 7);
        const days = daysPassed % 7;
        const trimester = weeks < 13 ? 1 : weeks < 28 ? 2 : 3;
        return { edd, weeks, days, trimester };
    }, [lmp]);

    return (
        <div className="ar-custom-calc">
            <div className="ar-custom-calc__input-row">
                <div className="ar-custom-calc__input-group">
                    <label>Hari Pertama Haid Terakhir (HPHT)</label>
                    <input type="date" className="ar-custom-calc__number-input" value={lmp} onChange={e => setLmp(e.target.value)} />
                </div>
            </div>
            <div className="ar-custom-calc__results">
                <div className="ar-custom-calc__result-main">
                    <span className="ar-custom-calc__result-label">Hari Perkiraan Lahir (HPL)</span>
                    <span className="ar-custom-calc__result-value">{res.edd.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="ar-custom-calc__result-grid">
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">📅</span><span className="ar-custom-calc__card-value">{res.weeks}W {res.days}D</span><span className="ar-custom-calc__card-label">Usia Kehamilan</span></div>
                    <div className="ar-custom-calc__result-card"><span className="ar-custom-calc__card-icon">🤰</span><span className="ar-custom-calc__card-value">Trimester {res.trimester}</span><span className="ar-custom-calc__card-label">Fase Kehamilan</span></div>
                </div>
            </div>
        </div>
    );
}

// ═══ Fallback generic ═══
function GenericCalc({ label }: { label: string }) {
    return <EMICalc label={label} />;
}

// ═══ ROUTER ═══
export default function IdCustomCalculatorCore({ calcType }: { calcType: string }) {
    switch (calcType) {
        case "mortgage": return <EMICalc label="Harga Rumah / Pinjaman (Rp)" />;
        case "emi": return <EMICalc />;
        case "compound-interest": return <CompoundCalc />;
        case "ppn": return <PPNCalc />;
        case "percentage": return <PercentageCalc />;
        case "discount": return <DiscountCalc />;
        case "bmi": return <BMICalc />;
        case "age": return <AgeCalc />;
        case "pregnancy": return <PregnancyCalc />;
        // Tax/Salary calcs reuse simpler patterns
        case "pph21": return <GenericCalc label="Gaji Bruto (Rp)" />;
        case "gaji": return <GenericCalc label="Gaji Bruto (Rp)" />;
        case "lembur": return <GenericCalc label="Gaji Pokok (Rp)" />;
        case "bpjs": return <GenericCalc label="Gaji Bruto (Rp)" />;
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
