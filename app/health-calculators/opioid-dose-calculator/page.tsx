// Standalone page — /health-calculators/opioid-dose-calculator/
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import OpioidDoseCalculatorCore from "@/components/calculator/OpioidDoseCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const PAGE_TITLE = "Opioid Dose Calculator (MME Calculator) — Morphine Milligram Equivalents 2026";
const PAGE_DESC = "Free Opioid Dose Calculator: calculate total daily Morphine Milligram Equivalents (MME) for 11 opioids. CDC 2022 thresholds, naloxone guidance, methadone dose-dependent conversion, benzodiazepine risk alerts, and comprehensive clinical reference.";

export const metadata: Metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    keywords: [
        "opioid dose calculator", "MME calculator", "morphine milligram equivalents",
        "opioid conversion calculator", "equianalgesic calculator", "morphine equivalent dose",
        "CDC opioid guideline", "opioid prescribing", "opioid risk assessment",
        "methadone conversion", "naloxone co-prescribing", "opioid rotation",
        "PDMP", "benzodiazepine opioid risk", "MED calculator",
    ],
    alternates: { canonical: canonicalUrl("/health-calculators/opioid-dose-calculator") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Health Calculators", url: canonicalUrl("/health-calculators") },
        { name: "Opioid Dose Calculator (MME)" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: "Opioid Dose Calculator (MME Calculator)",
        description: PAGE_DESC,
        url: canonicalUrl("/health-calculators/opioid-dose-calculator"),
        audience: { "@type": "MedicalAudience", audienceType: "Clinician" },
        specialty: { "@type": "MedicalSpecialty", name: "Pain Management" },
        lastReviewed: "2026-03-28",
    },
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Opioid Dose Calculator",
        applicationCategory: "HealthApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: canonicalUrl("/health-calculators/opioid-dose-calculator"),
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            { "@type": "Question", name: "What is MME and why is it important?", acceptedAnswer: { "@type": "Answer", text: "Morphine Milligram Equivalents (MME) is a standardized metric that converts any opioid dose into an equivalent morphine dose for risk comparison. It allows clinicians to assess the total opioid burden regardless of which specific opioids a patient takes. The CDC uses MME thresholds (50 and 90 MME/day) in its 2022 Clinical Practice Guideline to guide prescribing decisions." } },
            { "@type": "Question", name: "How do I calculate total daily MME?", acceptedAnswer: { "@type": "Answer", text: "For each opioid the patient takes: multiply the daily dose by its MME conversion factor. Then sum all values. For example: Oxycodone 30mg/day × 1.5 = 45 MME + Morphine 30mg/day × 1.0 = 30 MME → Total = 75 MME/day." } },
            { "@type": "Question", name: "What are the CDC recommended MME thresholds?", acceptedAnswer: { "@type": "Answer", text: "The CDC 2022 guideline identifies two key thresholds: ≥50 MME/day (reassess benefits/risks, consider naloxone) and ≥90 MME/day (avoid increase or carefully justify). The AMDG adds a ≥120 MED/day threshold requiring pain specialist consultation. These are guidelines, not rigid limits." } },
            { "@type": "Question", name: "Why is methadone conversion different from other opioids?", acceptedAnswer: { "@type": "Answer", text: "Methadone has unique pharmacokinetics: a very long and variable half-life (8-59 hours), dose-dependent potency, and accumulation with repeated dosing. Its MME conversion factor increases as the daily dose increases: 4× for 1-20mg, 8× for 21-40mg, 10× for 41-60mg, and 12× for >60mg/day." } },
            { "@type": "Question", name: "Can I use this calculator to switch between opioids?", acceptedAnswer: { "@type": "Answer", text: "No. This calculator estimates total daily MME for risk assessment only. It should NOT be used to determine conversion doses between opioids. Opioid rotation requires accounting for incomplete cross-tolerance (typically reducing the calculated dose by 25-50%) and should be managed by experienced clinicians." } },
        ],
    },
]);

export default function OpioidDoseCalculatorPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-opioid" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Health Calculators", href: "/health-calculators" },
                { label: "Opioid Dose Calculator (MME)" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Opioid Dose Calculator — Morphine Milligram Equivalents (MME)
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate total daily Morphine Milligram Equivalents (MME) for 11 opioids using CDC and AMDG conversion factors. See risk-tier classification, naloxone co-prescribing recommendations, benzodiazepine interaction warnings, and per-opioid MME breakdown — instantly.
            </p>

            <AuthorBadge categoryKey="health" />

            <div className="layout-2col">
                <div className="layout-2col__main">
                    {/* ── Calculator Core ── */}
                    <OpioidDoseCalculatorCore />

                    {/* ── Educational Content ── */}
                    <DynamicExplanation
                        heading="What Is Morphine Milligram Equivalent (MME)?"
                        contentHTML={`
<p><strong>Morphine Milligram Equivalents (MME)</strong> — also called Morphine Equivalent Dose (MED) — is a standardized metric that converts any opioid dose to the equivalent amount of oral morphine. This allows clinicians to compare the potency and risk across different opioid medications, regardless of the specific drug prescribed.</p>

<p>MME was developed to address a critical challenge: since different opioids have vastly different potencies (hydromorphone is 5× stronger than morphine per mg, while codeine is only 0.15×), comparing raw milligram doses between drugs is meaningless. By converting everything to morphine equivalents, clinicians can assess the total opioid burden on a patient.</p>

<div class="explanation__highlight">💡 <strong>Key Concept:</strong> If a patient takes Oxycodone 20mg/day (MME factor 1.5) and Hydrocodone 30mg/day (MME factor 1.0), their total daily MME = (20 × 1.5) + (30 × 1.0) = 60 MME/day — placing them in the "Increased Caution" tier.</div>

<h3>Why Clinicians Track MME</h3>
<p>Research consistently shows that higher daily MME is associated with increased risk of opioid-related adverse events:</p>
<ul>
<li><strong>Respiratory depression</strong> — the primary cause of opioid overdose death</li>
<li><strong>Accidental overdose</strong> — risk increases roughly linearly with dose</li>
<li><strong>Opioid use disorder</strong> — higher doses correlate with greater dependence risk</li>
<li><strong>Regulatory compliance</strong> — state PDMPs and insurers use MME thresholds for prescribing oversight</li>
</ul>
<p>The CDC, state medical boards, and insurance payers use MME as a common language for opioid prescribing safety. It is NOT a direct measure of clinical appropriateness — dosing decisions must always be individualized.</p>

<h3>Understanding CDC Risk Thresholds (2022 Guideline)</h3>
<p>The <strong>CDC Clinical Practice Guideline for Prescribing Opioids for Pain (2022)</strong> — which remains the current national standard as of 2026 — identifies key MME thresholds. These are <strong>guidelines for clinician decision-making</strong>, not rigid limits:</p>

<table class="comparison-table">
<thead><tr><th>Threshold</th><th>Risk Level</th><th>CDC Recommendation</th></tr></thead>
<tbody>
<tr><td><strong>&lt;50 MME/day</strong></td><td>🟢 Lower Risk</td><td>Standard clinical monitoring. Reassess periodically.</td></tr>
<tr><td><strong>≥50 MME/day</strong></td><td>🟡 Increased Caution</td><td>Reassess individual benefits and risks. Offer overdose prevention education. Consider co-prescribing naloxone.</td></tr>
<tr><td><strong>≥90 MME/day</strong></td><td>🟠 High Risk</td><td>Avoid increasing to this level, or carefully justify based on individual patient circumstances. Pain specialist consultation advised.</td></tr>
<tr><td><strong>≥120 MED/day</strong></td><td>🔴 Very High Risk</td><td>AMDG Guideline: mandatory pain specialist consultation before continuing at this dose level.</td></tr>
</tbody>
</table>

<p><strong>Critical clarification:</strong> The 2022 CDC guideline explicitly warns against using these thresholds as rigid, absolute limits. Policies that force abrupt dose reduction or mandatory tapering can cause significant patient harm (withdrawal, pain crisis, suicidality). These are tools for clinical decision-making, not administrative mandates.</p>

<h3>Complete Equianalgesic Conversion Table</h3>
<p>The following conversion factors are used by this calculator and are aligned with CDC/CMS and AMDG (Washington State Agency Medical Directors' Group) sources:</p>

<table class="comparison-table">
<thead><tr><th>Opioid</th><th>Route</th><th>Unit</th><th>MME Factor</th><th>Clinical Notes</th></tr></thead>
<tbody>
<tr><td><strong>Codeine</strong></td><td>Oral</td><td>mg/day</td><td>0.15</td><td>Low potency. Often combined with acetaminophen.</td></tr>
<tr><td><strong>Fentanyl</strong></td><td>Transdermal</td><td>mcg/hr</td><td>2.4</td><td>Patch only. Factor converts mcg/hr → MME/day. NOT for IV/IM.</td></tr>
<tr><td><strong>Hydrocodone</strong></td><td>Oral</td><td>mg/day</td><td>1.0</td><td>1:1 with morphine. Most prescribed opioid in US.</td></tr>
<tr><td><strong>Hydromorphone</strong></td><td>Oral</td><td>mg/day</td><td>5.0</td><td>High potency — 5× stronger than morphine per mg.</td></tr>
<tr><td><strong>Methadone</strong></td><td>Oral</td><td>mg/day</td><td>4–12 (variable)</td><td>Dose-dependent. Long half-life. See methadone section.</td></tr>
<tr><td><strong>Morphine</strong></td><td>Oral</td><td>mg/day</td><td>1.0</td><td>Reference standard. Factor is 1.0 by definition.</td></tr>
<tr><td><strong>Oxycodone</strong></td><td>Oral</td><td>mg/day</td><td>1.5</td><td>50% more potent than morphine per mg.</td></tr>
<tr><td><strong>Oxymorphone</strong></td><td>Oral</td><td>mg/day</td><td>3.0</td><td>3× morphine. Less commonly prescribed.</td></tr>
<tr><td><strong>Tapentadol</strong></td><td>Oral</td><td>mg/day</td><td>0.4</td><td>Dual mechanism (µ-opioid + norepinephrine). Conversion is approximate.</td></tr>
<tr><td><strong>Tramadol</strong></td><td>Oral</td><td>mg/day</td><td>0.1</td><td>Weakest opioid. Also serotonergic — watch for interactions.</td></tr>
<tr><td><strong>Buprenorphine</strong></td><td>Transdermal</td><td>mcg/hr</td><td>12.6</td><td>Partial agonist with ceiling effect. Not for OUD management.</td></tr>
</tbody>
</table>

<h3>Methadone: Special Pharmacokinetic Considerations</h3>
<p>Methadone requires separate discussion because its pharmacokinetics are fundamentally different from other opioids:</p>
<ul>
<li><strong>Non-linear dose-potency relationship:</strong> As the daily dose increases, methadone becomes disproportionately more potent relative to morphine. At 1-20 mg/day, the factor is 4×. At >60 mg/day, it jumps to 12×. This is why a linear conversion factor cannot be used.</li>
<li><strong>Long and variable half-life:</strong> Methadone's half-life ranges from 8 to 59 hours (average ~22 hours), compared to 2-3 hours for morphine. This means methadone accumulates over days, and steady-state may not be reached for 5-7 days.</li>
<li><strong>Delayed respiratory depression:</strong> Peak respiratory depressant effects occur later and persist longer than peak analgesic effects. A dose that seems safe initially can become dangerous as the drug accumulates.</li>
<li><strong>NMDA receptor activity:</strong> Methadone's unique NMDA receptor antagonist activity makes it useful for neuropathic pain but also contributes to its complex pharmacology.</li>
</ul>

<table class="comparison-table">
<thead><tr><th>Methadone Daily Dose</th><th>MME Factor</th><th>20 mg Example</th></tr></thead>
<tbody>
<tr><td>1–20 mg/day</td><td>4×</td><td>20 × 4 = 80 MME</td></tr>
<tr><td>21–40 mg/day</td><td>8×</td><td>30 × 8 = 240 MME</td></tr>
<tr><td>41–60 mg/day</td><td>10×</td><td>50 × 10 = 500 MME</td></tr>
<tr><td>&gt;60 mg/day</td><td>12×</td><td>80 × 12 = 960 MME</td></tr>
</tbody>
</table>

<p><strong>Clinical bottom line:</strong> Methadone initiation, titration, and conversion should be managed by clinicians with specialized training. The dose-dependent conversion scale above is from the Washington State AMDG. Reference: <a href="https://www.agencymeddirectors.wa.gov/MethadoneFactors" target="_blank" rel="noopener noreferrer">AMDG Methadone Conversion Factors</a>.</p>

<h3>Incomplete Cross-Tolerance & Opioid Rotation Safety</h3>
<p>A critical safety principle that this calculator <strong>cannot account for</strong>: when switching a patient from one opioid to another, the patient does not have equivalent tolerance to the new drug. This phenomenon — called <strong>incomplete cross-tolerance</strong> — means that a mathematically equivalent dose of the new opioid may be significantly <strong>too high</strong>.</p>
<ul>
<li><strong>Standard practice:</strong> Reduce the calculated equianalgesic dose of the new opioid by <strong>25–50%</strong> when switching.</li>
<li><strong>For methadone or fentanyl rotations:</strong> Reductions of <strong>50–75%</strong> are common due to their unique pharmacokinetics.</li>
<li><strong>Then titrate up:</strong> Gradually increase based on clinical response and monitoring.</li>
</ul>
<div class="explanation__highlight">⚠️ <strong>This MME calculator is designed for risk assessment and monitoring — NOT for opioid rotation calculations.</strong> Never use these conversion factors to directly determine a patient's dose of a new opioid without applying cross-tolerance reduction and clinical judgment.</div>

<h3>Benzodiazepine Co-Prescribing Risk</h3>
<p>The concurrent prescribing of opioids and benzodiazepines represents one of the highest-risk drug combinations in modern medicine:</p>
<ul>
<li><strong>FDA Black Box Warning (2016):</strong> Concurrent use can result in profound sedation, respiratory depression, coma, and death.</li>
<li><strong>Risk amplification:</strong> Benzodiazepines do not simply "add" to opioid respiratory depression — they potentiate it synergistically. Even low opioid doses become dangerous with concurrent benzodiazepines.</li>
<li><strong>Overdose data:</strong> In 2024, approximately 14% of opioid overdose deaths involved concurrent benzodiazepine use (CDC provisional data).</li>
<li><strong>Clinical guidance:</strong> Avoid co-prescribing whenever possible. If unavoidable, use the lowest effective doses for the shortest duration and closely monitor.</li>
</ul>

<h3>Naloxone Co-Prescribing Guidelines</h3>
<p>Naloxone (brand names: Narcan, Kloxxado) is an opioid antagonist that rapidly reverses opioid overdose. The CDC recommends clinicians consider naloxone co-prescribing for patients who:</p>
<ul>
<li>Take ≥50 MME/day of any opioid(s)</li>
<li>Take opioids concurrently with benzodiazepines or other CNS depressants</li>
<li>Have a history of opioid use disorder or prior overdose</li>
<li>Have respiratory conditions (e.g., COPD, sleep apnea)</li>
<li>Are being discharged from the emergency department after non-fatal overdose</li>
</ul>
<p><strong>Available formulations:</strong> Narcan nasal spray (4mg — available over-the-counter since 2023), Kloxxado nasal spray (8mg for higher-potency opioid emergencies), and injectable naloxone. Patient and caregiver education on recognition of overdose symptoms and naloxone administration should accompany every prescription.</p>

<h3>The US Opioid Crisis: Key Statistics (2024–2026)</h3>
<p>The United States has experienced a significant shift in the opioid landscape. Here are the latest provisional data points from CDC and AMA:</p>
<table class="comparison-table">
<thead><tr><th>Metric</th><th>2023</th><th>2024</th><th>Change</th></tr></thead>
<tbody>
<tr><td><strong>Total drug overdose deaths</strong></td><td>110,037</td><td>80,391</td><td>↓ 27%</td></tr>
<tr><td><strong>Opioid-involved deaths</strong></td><td>83,140</td><td>54,743</td><td>↓ 34%</td></tr>
<tr><td><strong>Synthetic opioid deaths (fentanyl)</strong></td><td>76,282</td><td>48,422</td><td>↓ 37%</td></tr>
<tr><td><strong>Opioid prescriptions dispensed</strong></td><td>~130M</td><td>~125.7M</td><td>↓ 3.3%</td></tr>
<tr><td><strong>Dispensing rate per 100 persons</strong></td><td>36.8</td><td>35.4</td><td>↓ 3.8%</td></tr>
</tbody>
</table>
<p>While overdose deaths have declined significantly (the largest annual decrease on record), illicit fentanyl remains the primary driver. The total number of opioid prescriptions has fallen over 50% since its 2012 peak. Over-the-counter naloxone access, expanded PDMP usage, and improved treatment access have contributed to these gains.</p>

<h3>Prescription Drug Monitoring Programs (PDMPs)</h3>
<p><strong>PDMPs</strong> are state-managed electronic databases that track controlled substance prescriptions. As of 2025, all 50 states, D.C., and Guam operate PDMPs. Key facts:</p>
<ul>
<li><strong>Mandatory checking:</strong> Most states now require clinicians to check their state PDMP before prescribing opioids or renewing prescriptions</li>
<li><strong>Purpose:</strong> Identify patients receiving opioids from multiple providers ("doctor shopping"), detect concerning patterns, and support informed prescribing decisions</li>
<li><strong>Integration:</strong> Many states have integrated PDMP data into electronic health record (EHR) workflows for seamless access</li>
<li><strong>Interstate sharing:</strong> Through PMP InterConnect, most states share PDMP data across state lines</li>
<li><strong>Evidence:</strong> Research associates comprehensive PDMP mandates with reductions in opioid prescribing volumes and opioid-related hospitalizations</li>
</ul>

<h3>Clinical Limitations & Important Disclaimers</h3>
<p>This calculator has significant clinical limitations that every user must understand:</p>
<ul>
<li><strong>NOT for opioid rotation:</strong> Equianalgesic ratios are approximations. They do not account for incomplete cross-tolerance, individual pharmacokinetics, or genetic variability.</li>
<li><strong>Does not account for:</strong> renal/hepatic function impairment, age-related pharmacokinetic changes, genetic polymorphisms in opioid metabolism (e.g., CYP2D6 poor/ultra-rapid metabolizers), prior tolerance, drug-drug interactions, or concurrent CNS depressants beyond benzodiazepines.</li>
<li><strong>Not for acute pain settings:</strong> MME thresholds were developed for chronic pain prescribing. Acute and perioperative opioid use involve different risk-benefit calculations.</li>
<li><strong>Not applicable to:</strong> cancer-related pain, palliative care, end-of-life care, sickle cell disease management, or opioid use disorder treatment with buprenorphine/methadone.</li>
<li><strong>Regulatory scope:</strong> The CDC guideline recommendations are voluntary clinical tools. They are not federal mandates, standards of care, or grounds for disciplinary action.</li>
</ul>
`}
                    />

                    {/* ── FAQ Section ── */}
                    <FAQAccordion
                        title="Opioid Dose Calculator FAQ"
                        items={[
                            {
                                question: "What is MME and why is it important?",
                                answer: "Morphine Milligram Equivalents (MME) is a standardized metric that converts any opioid dose into an equivalent morphine dose for risk comparison. It allows clinicians to assess the total opioid burden regardless of which specific opioids a patient takes. The CDC uses MME thresholds (50 and 90 MME/day) in its 2022 Clinical Practice Guideline to guide prescribing decisions and identify patients who may benefit from close monitoring or naloxone co-prescribing.",
                            },
                            {
                                question: "How do I calculate total daily MME?",
                                answer: "For each opioid the patient takes: multiply the daily dose by its MME conversion factor, then sum all values. Example: Oxycodone 30mg/day × 1.5 = 45 MME + Morphine 30mg/day × 1.0 = 30 MME → Total = 75 MME/day. For methadone, the factor depends on the daily dose (4× for 1-20mg, 8× for 21-40mg, 10× for 41-60mg, 12× for >60mg). For fentanyl patches and buprenorphine patches, enter the mcg/hr rate — the factor converts directly to MME/day.",
                            },
                            {
                                question: "What are the CDC-recommended MME thresholds?",
                                answer: "The CDC 2022 guideline identifies two primary thresholds: ≥50 MME/day (reassess benefits and risks, offer overdose prevention education, consider naloxone) and ≥90 MME/day (avoid increasing to this level, or carefully justify based on individual circumstances, consider specialist consultation). The Washington State AMDG adds ≥120 MED/day as requiring pain specialist consultation. Importantly, the CDC explicitly states these are NOT rigid limits — they should guide clinical decision-making, not trigger automatic dose reductions.",
                            },
                            {
                                question: "Why is methadone conversion different from other opioids?",
                                answer: "Methadone has unique pharmacokinetics: a very long and variable half-life (8-59 hours vs 2-3 for morphine), dose-dependent potency that increases nonlinearly, and accumulation with repeated dosing. At low doses (1-20 mg), methadone is 4× as potent as morphine. At >60 mg/day, it is 12× as potent. This means even small dose increases at higher levels cause dramatic increases in MME. Methadone also blocks NMDA receptors, contributing to its complex clinical profile.",
                            },
                            {
                                question: "Can I use this calculator to switch between opioids?",
                                answer: "No. This calculator is for risk assessment and monitoring only — NOT for determining conversion doses during opioid rotation. When switching opioids, clinicians must account for incomplete cross-tolerance (a patient tolerant to one opioid is not equally tolerant to another). Standard practice is to reduce the calculated equianalgesic dose by 25-50% (or 50-75% for methadone/fentanyl) and then titrate up based on clinical response.",
                            },
                            {
                                question: "What is incomplete cross-tolerance?",
                                answer: "Incomplete cross-tolerance means that a patient who has developed tolerance to one opioid does not have equivalent tolerance to a different opioid, even at mathematically equivalent doses. This occurs because different opioids interact with µ-opioid receptors in slightly different ways. Failing to account for this during opioid rotation is one of the most common causes of accidental overdose during medication changes.",
                            },
                            {
                                question: "When should naloxone be co-prescribed?",
                                answer: "The CDC recommends offering naloxone and overdose prevention education when: the patient is taking ≥50 MME/day, opioids are co-prescribed with benzodiazepines or other CNS depressants, the patient has a history of overdose or opioid use disorder, or the patient has respiratory conditions like COPD. Naloxone nasal spray (Narcan) has been available over-the-counter since 2023.",
                            },
                            {
                                question: "What is the AMDG 120 MED threshold?",
                                answer: "The Washington State Agency Medical Directors' Group (AMDG) recommends that clinicians should not exceed 120 mg/day Morphine Equivalent Dose (MED) without first obtaining a consultation from a trained pain specialist who agrees that a higher dose is indicated and appropriate. This is more conservative than the CDC's 90 MME threshold and reflects the AMDG's state-level guideline for Washington state prescribers.",
                            },
                            {
                                question: "How does buprenorphine's ceiling effect impact MME?",
                                answer: "Buprenorphine is a partial µ-opioid receptor agonist, meaning its effects plateau at higher doses (the 'ceiling effect'). This makes it inherently safer than full agonists like morphine — the risk of respiratory depression plateaus rather than continuing to increase linearly. The MME conversion factor (12.6 per mcg/hr for transdermal) is an approximation. Note: buprenorphine used for opioid use disorder (Suboxone/Sublocade) serves a different clinical purpose and should not be included in pain-management MME calculations.",
                            },
                            {
                                question: "What are PDMPs and are they mandatory?",
                                answer: "Prescription Drug Monitoring Programs (PDMPs) are state-managed electronic databases that track every controlled substance prescription dispensed. As of 2025, all 50 states operate PDMPs, and most states mandate that clinicians check the PDMP before prescribing opioids or renewing prescriptions. Through PMP InterConnect, most states also share data across state lines. PDMPs help identify patients receiving medications from multiple prescribers and inform clinical decisions.",
                            },
                            {
                                question: "Does fentanyl transdermal use the same conversion factor as IV fentanyl?",
                                answer: "No. Transdermal fentanyl (patches) uses a factor of 2.4, which converts mcg/hr directly to MME/day. This factor is specific to the sustained-release patch formulation. IV/IM fentanyl has different bioavailability and pharmacokinetics. This calculator only covers transdermal fentanyl. For IV fentanyl conversions, consult a clinical pharmacist or specialized resources.",
                            },
                            {
                                question: "What risks does concurrent benzodiazepine use add?",
                                answer: "The combination of opioids and benzodiazepines carries an FDA Black Box Warning because both depress the central nervous system. The effect is synergistic — meaning the combined respiratory depression is greater than the sum of each drug's individual effect. In 2024, approximately 14% of opioid overdose deaths involved concurrent benzodiazepine use. If co-prescribing is unavoidable, use the lowest effective doses for the shortest possible duration.",
                            },
                            {
                                question: "How have US opioid prescribing rates changed?",
                                answer: "US opioid prescribing has declined dramatically since peaking in 2012. Total prescriptions have fallen over 50% — from approximately 255 million in 2012 to 125.7 million in 2024. The dispensing rate has dropped from 81.3 per 100 persons (2012) to 35.4 per 100 (2024). Meanwhile, overdose deaths fell 27% in 2024 (to 80,391) — the largest annual decline recorded — though illicit fentanyl remains the primary driver of remaining deaths.",
                            },
                            {
                                question: "Is tapentadol truly equivalent to 0.4 MME?",
                                answer: "Tapentadol's MME conversion factor (0.4) is approximate and somewhat controversial. Tapentadol has a dual mechanism of action: it activates µ-opioid receptors AND inhibits norepinephrine reuptake. The norepinephrine component contributes to pain relief without contributing to opioid-specific risks. Some sources argue the true opioid-equivalent risk is lower than 0.4, while others maintain it is appropriate for population-level risk assessment. CDC/CMS uses the 0.4 factor.",
                            },
                            {
                                question: "Where can clinicians find state-specific opioid prescribing guidelines?",
                                answer: "Each state may have additional prescribing requirements beyond the CDC guideline. Resources include: your state medical board website (prescribing limits, PDMP mandates), the Federation of State Medical Boards (FSMB) guidelines database, your state's PDMP portal, and the SAMHSA Opioid Overdose Prevention Toolkit. Washington State's AMDG guideline (agencymeddirectors.wa.gov) is one of the most comprehensive state-level resources available.",
                            },
                        ]}
                    />

                    {/* ── Internal Links ── */}
                    <section style={{ marginTop: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>Related Health Calculators</h2>
                        <div className="calc-index-grid" style={{ maxWidth: "100%" }}>
                            {[
                                { href: "/health-calculators/bmi-calculator", icon: "⚖️", title: "BMI Calculator", desc: "Calculate your Body Mass Index" },
                                { href: "/health-calculators/calorie-calculator", icon: "🔥", title: "Calorie Calculator", desc: "Daily calorie needs for weight management" },
                                { href: "/health-calculators/body-fat-calculator", icon: "📊", title: "Body Fat Calculator", desc: "Estimate body fat percentage" },
                                { href: "/health-calculators/sleep-calculator", icon: "😴", title: "Sleep Calculator", desc: "Optimal sleep and wake times" },
                            ].map((c) => (
                                <Link key={c.href} href={c.href} className="calc-index-card">
                                    <span className="calc-index-card__icon">{c.icon}</span>
                                    <div className="calc-index-card__body">
                                        <h3>{c.title}</h3>
                                        <p>{c.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="layout-2col__sidebar">
                    <TrendingCalculations variant="sidebar" />
                </aside>
            </div>
        </main>
    );
}
