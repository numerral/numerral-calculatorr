// CIBILScoreInsight — Interactive CIBIL Score eligibility module
// Placed inside loan calculator pages after the EMI result/chart section.
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    SCORE_BANDS,
    LENDER_TYPES,
    INDIAN_LENDERS,
    CIBIL_DISCLAIMER,
    getScoreBand,
    getLenderType,
    type CibilLoanConfig,
} from "@/lib/cibilConfig";

interface Props {
    loanConfig: CibilLoanConfig;
}

export default function CIBILScoreInsight({ loanConfig }: Props) {
    const [score, setScore] = useState<number | null>(null);
    const [lenderTypeId, setLenderTypeId] = useState("any");
    const [showBankList, setShowBankList] = useState(false);

    const lender = useMemo(() => getLenderType(lenderTypeId), [lenderTypeId]);
    const band = useMemo(() => (score ? getScoreBand(score) : null), [score]);

    // Filter lenders by selected type
    const filteredLenders = useMemo(() => {
        if (lenderTypeId === "any") return INDIAN_LENDERS;
        return INDIAN_LENDERS.filter((l) => l.type === lenderTypeId);
    }, [lenderTypeId]);

    const handleScoreChange = (val: string) => {
        const n = parseInt(val, 10);
        if (isNaN(n)) { setScore(null); return; }
        setScore(Math.min(900, Math.max(300, n)));
    };

    return (
        <section className="cibil-module">
            <div className="cibil-module__header">
                <div className="cibil-module__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <div>
                    <h3 className="cibil-module__title">CIBIL Score Insight (India)</h3>
                    <p className="cibil-module__subtitle">
                        Check typical credit score requirements for {loanConfig.label.toLowerCase()} eligibility
                    </p>
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="cibil-module__controls">
                {/* Score Input */}
                <div className="cibil-control">
                    <label className="cibil-control__label" htmlFor="cibil-score">
                        Your CIBIL Score <span className="cibil-control__optional">(optional)</span>
                    </label>
                    <div className="cibil-control__row">
                        <input
                            id="cibil-score"
                            type="number"
                            min={300}
                            max={900}
                            placeholder="e.g. 750"
                            value={score ?? ""}
                            onChange={(e) => handleScoreChange(e.target.value)}
                            className="cibil-control__input"
                        />
                        <input
                            type="range"
                            min={300}
                            max={900}
                            step={10}
                            value={score ?? 600}
                            onChange={(e) => setScore(parseInt(e.target.value, 10))}
                            className="cibil-control__slider"
                        />
                    </div>
                    {/* Score scale labels */}
                    <div className="cibil-scale">
                        <span>300</span>
                        <span className="cibil-scale__mid">600</span>
                        <span className="cibil-scale__mid">750</span>
                        <span>900</span>
                    </div>
                </div>

                {/* Lender Type */}
                <div className="cibil-control">
                    <label className="cibil-control__label" htmlFor="lender-type">
                        Select Lender Type
                    </label>
                    <select
                        id="lender-type"
                        value={lenderTypeId}
                        onChange={(e) => setLenderTypeId(e.target.value)}
                        className="cibil-control__select"
                    >
                        {LENDER_TYPES.map((lt) => (
                            <option key={lt.id} value={lt.id}>{lt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Show bank list toggle */}
                <div className="cibil-control cibil-control--toggle">
                    <label className="cibil-toggle">
                        <input
                            type="checkbox"
                            checked={showBankList}
                            onChange={(e) => setShowBankList(e.target.checked)}
                        />
                        <span className="cibil-toggle__track">
                            <span className="cibil-toggle__thumb" />
                        </span>
                        <span className="cibil-toggle__label">Show bank list</span>
                    </label>
                </div>
            </div>

            {/* ── Result ── */}
            <div className="cibil-module__result">
                {score && band ? (
                    /* User entered a score — show personalized result */
                    <div className="cibil-result">
                        <div className="cibil-result__badge" style={{ borderColor: band.color, color: band.color }}>
                            <span className="cibil-result__score">{score}</span>
                            <span className="cibil-result__label">{band.label}</span>
                        </div>
                        <div className="cibil-result__details">
                            <div className="cibil-result__thresholds">
                                <div className="cibil-threshold">
                                    <span className="cibil-threshold__dot" style={{ background: "#3b82f6" }} />
                                    <span>Typical preferred: <strong>{lender.typicalPreferred}+</strong></span>
                                </div>
                                <div className="cibil-threshold">
                                    <span className="cibil-threshold__dot" style={{ background: "#059669" }} />
                                    <span>Ideal: <strong>{lender.idealScore}+</strong></span>
                                </div>
                            </div>
                            <p className="cibil-result__tip">
                                <strong>💡 Tip:</strong> {band.tip}
                            </p>
                        </div>
                    </div>
                ) : (
                    /* No score entered — show general info */
                    <div className="cibil-general">
                        <div className="cibil-general__thresholds">
                            <div className="cibil-general__item">
                                <div className="cibil-general__icon" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>✓</div>
                                <div>
                                    <strong>Typical preferred CIBIL score</strong>
                                    <span className="cibil-general__value">{lender.typicalPreferred}+</span>
                                </div>
                            </div>
                            <div className="cibil-general__item">
                                <div className="cibil-general__icon" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>★</div>
                                <div>
                                    <strong>Ideal for best approval & pricing</strong>
                                    <span className="cibil-general__value">{lender.idealScore}+</span>
                                </div>
                            </div>
                        </div>
                        <p className="cibil-general__note">
                            A higher CIBIL score improves your approval chances and may help you negotiate a lower interest rate. {loanConfig.description}
                        </p>
                    </div>
                )}

                {/* Lender note */}
                <p className="cibil-lender-note">
                    <strong>{lender.label}:</strong> {lender.note}
                </p>

                {/* Score band visual */}
                <div className="cibil-bands">
                    {SCORE_BANDS.map((b) => (
                        <div
                            key={b.min}
                            className={`cibil-band ${score && score >= b.min && score <= b.max ? "cibil-band--active" : ""}`}
                            style={{ background: `${b.color}18`, borderColor: score && score >= b.min && score <= b.max ? b.color : "transparent" }}
                        >
                            <span className="cibil-band__range">{b.min}–{b.max}</span>
                            <span className="cibil-band__label" style={{ color: b.color }}>{b.label.replace(" eligibility", "")}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bank list (toggle) ── */}
            {showBankList && (
                <div className="cibil-banks">
                    <h4 className="cibil-banks__title">Indian Lenders — Typical Score Preferences</h4>
                    <div className="cibil-banks__grid">
                        {filteredLenders.map((bank) => (
                            <div key={bank.name} className="cibil-bank">
                                <span className="cibil-bank__name">{bank.name}</span>
                                <div className="cibil-bank__scores">
                                    <span className="cibil-bank__tag cibil-bank__tag--preferred">Preferred: 700+</span>
                                    <span className="cibil-bank__tag cibil-bank__tag--ideal">Ideal: 750+</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Disclaimer ── */}
            <p className="cibil-disclaimer">
                ⚠️ {CIBIL_DISCLAIMER}{" "}
                <Link href="/glossary/cibil-score" className="cibil-disclaimer__link">
                    Learn more about CIBIL Score →
                </Link>
            </p>
        </section>
    );
}
