import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAECurrencyConverterCore from "@/components/calculator/UAECurrencyConverterCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "AED Currency Converter 2025 — UAE Dirham Exchange Rates",
    description: "Convert AED to 22+ major currencies with indicative mid-market rates. Covers USD peg (3.6725), INR, PKR, PHP, GBP, EUR, and all GCC currencies. Includes UAE remittance guide and exchange house comparison.",
    keywords: ["AED currency converter", "UAE dirham exchange rate", "AED to USD", "AED to INR", "محول العملات الدرهم", "AED to PKR", "AED to PHP", "Dubai exchange rate", "CBUAE rates", "money transfer UAE", "remittance Dubai"],
    alternates: { canonical: canonicalUrl("/uae/currency-converter") },
};

const FAQ_ITEMS = [
    { question: "Is the AED pegged to the US Dollar?", answer: "Yes. The UAE Dirham (AED) has been officially pegged to the US Dollar (USD) at a fixed rate of 3.6725 AED per 1 USD since November 1997. The Central Bank of the UAE (CBUAE) maintains this peg by actively intervening in the foreign exchange market — buying USD at 3.672 and selling at 3.673. This means the AED/USD rate never changes, unlike all other currency pairs which fluctuate daily based on market conditions." },
    { question: "What currencies can I exchange in the UAE?", answer: "The UAE has one of the world's most diverse currency exchange markets. You can exchange virtually any major and most minor currencies in Dubai. The most commonly traded pairs include AED/USD (pegged), AED/EUR, AED/GBP, AED/INR, AED/PKR, AED/PHP, AED/BDT, AED/EGP, and all GCC currencies (SAR, KWD, BHD, OMR, QAR). Exchange houses in Dubai and Abu Dhabi typically stock 40–60 different currencies." },
    { question: "Where can I get the best exchange rate in Dubai?", answer: "Mobile money transfer apps (Wise, Remitly, InstaPay) typically offer rates closest to the mid-market rate with fees of only 1–3%. Licensed exchange houses (Al Ansari, Lulu Exchange, Sharaf Exchange) offer competitive rates with fees of 3–5%. Banks are usually the most expensive option (5–14% total cost). Avoid airport and hotel exchanges — they offer the worst rates (5–10% markup). Always compare rates from 3–4 providers before exchanging." },
    { question: "How much money can I send from UAE without declaration?", answer: "You can carry or transfer up to AED 60,000 (approximately USD 16,340) across UAE borders without a declaration. For amounts exceeding AED 60,000, you must complete a declaration form with UAE Customs. For wire transfers, there is no upper limit, but all transfers are subject to anti-money laundering (AML) monitoring by the CBUAE. Exchange houses are required to verify identity (Emirates ID) for all transactions and report suspicious activities." },
    { question: "What is the cheapest way to send money from UAE to India?", answer: "The cheapest methods for UAE-to-India remittance are: (1) Digital apps like Wise (TransferWise) — fees as low as AED 5–15 with near mid-market rates, delivery in minutes to hours. (2) InstaPay — competitive rates with instant UPI transfers. (3) Exchange house digital channels (Al Ansari app, Lulu Money) — slightly higher fees but trusted brands. (4) Bank wire transfers — most expensive but necessary for large amounts. For AED 1,000, the total cost difference between the cheapest app and a bank can be AED 50–100." },
    { question: "Are all GCC currencies pegged to the US Dollar?", answer: "Five of the six GCC currencies are pegged to the USD: UAE Dirham (AED) at 3.6725, Saudi Riyal (SAR) at 3.7500, Bahraini Dinar (BHD) at 0.3760, Qatari Riyal (QAR) at 3.6400, and Omani Rial (OMR) at 0.3845. The exception is the Kuwaiti Dinar (KWD), which is pegged to a basket of currencies (not solely USD), making it the world's highest-valued currency. This means GCC cross-rates are extremely stable." },
    { question: "What are the CBUAE exchange house regulations?", answer: "The CBUAE licenses and supervises all exchange houses in the UAE under its 'Regulations regarding Licensing and Monitoring of Exchange Business' rulebook. Key requirements include: minimum capital reserves, mandatory AML/CFT compliance programs, Emirates ID verification for all transactions, suspicious transaction reporting, transparent fee disclosure, regular CBUAE audits, and digital transaction monitoring. Operating without a CBUAE license is a criminal offense." },
    { question: "How does Dynamic Currency Conversion (DCC) work?", answer: "Dynamic Currency Conversion (DCC) occurs when you pay with a foreign credit/debit card in the UAE and the merchant offers to charge you in your home currency instead of AED. You should always choose to be charged in AED, because DCC uses a heavily marked-up exchange rate (typically 3–7% worse than your bank's rate). Your card issuer will convert AED to your home currency at a much better rate. Always select 'AED' or 'local currency' at POS terminals and ATMs." },
    { question: "What is the UAE's largest remittance corridor?", answer: "India is the UAE's largest remittance destination, receiving approximately $21.6 billion from the UAE in 2024 — nearly 19% of India's total inward remittances. The UAE-India corridor has evolved beyond blue-collar workers to include white-collar professionals, entrepreneurs, and business owners. Pakistan is the second-largest corridor ($8.4+ billion), followed by the Philippines ($4.2 billion), Bangladesh ($3.1 billion), and Egypt ($2.8 billion). Total outward remittances from the UAE exceed AED 145 billion annually." },
    { question: "Can I use USD directly in Dubai?", answer: "While the UAE Dirham is the official and required currency for all legal transactions, US Dollars are widely accepted in tourist areas, hotels, malls, and gold souks — especially in Dubai. However, you will almost always get a worse exchange rate when paying in USD compared to exchanging to AED first. Most shops will round to convenient numbers, effectively giving you a rate of 3.5–3.6 instead of the official 3.6725. For the best value, exchange USD to AED at an exchange house." },
    { question: "How do I read UAE currency denominations?", answer: "The UAE Dirham (AED, Dh, or د.إ) is divided into 100 fils. Banknotes come in denominations of 5, 10, 20, 50, 100, 200, 500, and 1,000 AED. Coins come in 1 AED (bimetallic), 50 fils, and 25 fils. The 1,000 AED note features Al Hosn Palace, the 100 AED note shows Al Fahidi Fort, and the modern polymer notes include enhanced security features like holograms and color-shifting ink. ATMs typically dispense 100, 200, and 500 AED notes." },
    { question: "What is the Wages Protection System (WPS) in UAE?", answer: "The Wages Protection System (WPS) is a mandatory electronic salary transfer system introduced by the UAE Ministry of Human Resources. All employers must pay employee salaries through WPS-approved channels (bank transfers, exchange houses, or financial institutions). This ensures workers receive their wages on time and allows the government to monitor compliance. Exchange houses like Al Ansari Exchange are authorized WPS agents, meaning workers can receive salaries and immediately send remittances in one visit." },
    { question: "How do crypto and stablecoins relate to AED exchange?", answer: "The UAE has become a major crypto hub, with Dubai's VARA (Virtual Assets Regulatory Authority) licensing crypto exchanges since 2022. Stablecoins pegged to the USD (like USDT and USDC) are increasingly used for cross-border transfers, offering near-instant settlement at minimal cost. The CBUAE has also announced plans for a Central Bank Digital Currency (CBDC) — the 'Digital Dirham' — as part of its Financial Infrastructure Transformation (FIT) program. Licensed exchanges in the UAE include Binance, Bybit, and OKX." },
    { question: "What happens to AED exchange rates during oil price changes?", answer: "Because the AED is pegged to the USD at a fixed rate, oil price changes do not directly affect the AED/USD exchange rate. However, oil prices indirectly affect rates through: (1) Government spending — high oil revenues increase economic activity and demand for AED. (2) USD strength — oil is priced in USD, so oil price rises strengthen the USD, which strengthens the AED against non-USD currencies. (3) Inflation — increased spending can drive inflation, affecting real purchasing power. The CBUAE adjusts interest rates in line with the US Federal Reserve to maintain the peg." },
    { question: "What is the best time to exchange currency in the UAE?", answer: "For USD/AED, timing doesn't matter — the rate is fixed at 3.6725. For all other currencies: (1) Mid-week (Tuesday–Thursday) tends to offer slightly better rates as weekend volatility settles. (2) Avoid exchanging on weekends when markets are closed and spreads widen. (3) Monitor major economic announcements (Fed rate decisions, RBI meetings) which cause temporary volatility — exchange just after announcements when rates stabilize. (4) Early morning rates at exchange houses may not yet reflect overnight movements." },
    { question: "What documents do I need to exchange currency in the UAE?", answer: "For exchange house transactions: Emirates ID (mandatory for residents) or passport (for tourists). No additional documents are needed for amounts under AED 60,000. For amounts over AED 60,000, exchange houses may request a source-of-funds declaration. For bank wire transfers, you'll need: beneficiary bank details (IBAN/SWIFT), beneficiary name and address, purpose of transfer, and your account details. Digital apps like Wise require online KYC verification (Emirates ID photo, selfie) during initial registration." },
];

export default function CurrencyConverterPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Currency Converter" },
        ]),
        webAppSchema("AED Currency Converter", canonicalUrl("/uae/currency-converter")),
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
                "@type": "Question", name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-cc-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Currency Converter" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>AED Currency Converter 2025</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Convert UAE Dirhams (AED) to 22+ major world currencies with indicative mid-market reference rates. Covers the fixed USD peg, GCC currencies, and top remittance corridors to India, Pakistan, Philippines, Bangladesh, and Egypt.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAECurrencyConverterCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Currency Converter FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE VAT Calculator</div>
                            <div className="uae-related-link__desc">5% VAT calculation</div>
                        </div>
                    </Link>
                    <Link href="/uae/gold-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">✨</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Gold Price Calculator</div>
                            <div className="uae-related-link__desc">Gold pricing with VAT</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Net salary & cost of living</div>
                        </div>
                    </Link>
                    <Link href="/uae/dewa-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">⚡</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">DEWA Bill Calculator</div>
                            <div className="uae-related-link__desc">Electricity & water bill</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="aed-usd-peg">The AED–USD Peg: Why It Matters</h2>
    <p>The <strong>UAE Dirham (AED)</strong> has been <strong>pegged to the US Dollar at a fixed rate of 3.6725 AED per 1 USD</strong> since November 1997. This means the Central Bank of the UAE (CBUAE) guarantees that 1 US Dollar will always equal 3.6725 Dirhams — the rate does not fluctuate.</p>
    <p>The CBUAE maintains this peg by actively intervening in the foreign exchange market. It buys USD at 3.672 AED and sells at 3.673 AED, creating a tight corridor that prevents any meaningful deviation. The peg is backed by the UAE&apos;s substantial foreign exchange reserves, which exceeded <strong>$195 billion</strong> as of 2025.</p>

    <h3>Why Is the AED Pegged?</h3>
    <ul>
        <li><strong>Oil trade stability</strong> — The UAE&apos;s oil exports are priced in USD, so a fixed AED/USD rate eliminates currency risk for the nation&apos;s largest revenue source</li>
        <li><strong>Investor confidence</strong> — Foreign investors know their AED assets won&apos;t lose value due to currency depreciation</li>
        <li><strong>Trade simplification</strong> — Dubai is a global trade hub; a USD-pegged currency makes international commerce seamless</li>
        <li><strong>Inflation anchor</strong> — The peg ties UAE monetary policy to the US Federal Reserve, providing price stability</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Key implication:</strong> Because the AED is pegged to USD, when the US Dollar strengthens against other currencies (EUR, GBP, INR), the <strong>AED automatically strengthens</strong> too. This means your Dirham salary buys more when the dollar is strong — and less when it weakens.
    </div>

    <h2 id="gcc-pegs">GCC Currency Pegs</h2>
    <p>Five of the six Gulf Cooperation Council (GCC) currencies are pegged to the US Dollar, making cross-border transactions within the Gulf region extremely stable:</p>
    <table>
        <thead><tr><th>Currency</th><th>Code</th><th>USD Peg Rate</th><th>Since</th></tr></thead>
        <tbody>
            <tr><td><strong>UAE Dirham</strong></td><td>AED</td><td>3.6725</td><td>1997</td></tr>
            <tr><td><strong>Saudi Riyal</strong></td><td>SAR</td><td>3.7500</td><td>1986</td></tr>
            <tr><td><strong>Bahraini Dinar</strong></td><td>BHD</td><td>0.3760</td><td>1980</td></tr>
            <tr><td><strong>Qatari Riyal</strong></td><td>QAR</td><td>3.6400</td><td>2001</td></tr>
            <tr><td><strong>Omani Rial</strong></td><td>OMR</td><td>0.3845</td><td>1986</td></tr>
            <tr><td><strong>Kuwaiti Dinar</strong></td><td>KWD</td><td>~0.306 (basket)</td><td>Basket peg</td></tr>
        </tbody>
    </table>
    <p>The <strong>Kuwaiti Dinar (KWD)</strong> is the notable exception — it is pegged to a basket of currencies rather than solely to the USD, which is why it&apos;s the world&apos;s highest-valued currency unit (1 KWD ≈ $3.27).</p>

    <h2 id="remittance-corridors">Top Remittance Corridors from the UAE</h2>
    <p>The UAE is one of the world&apos;s largest remittance-sending countries. With a population that is approximately <strong>88% expatriate</strong>, cross-border money transfers are a fundamental part of the economy. Total outward remittances from the UAE exceed <strong>AED 145 billion (US$39.5 billion)</strong> annually.</p>
    <table>
        <thead><tr><th>Country</th><th>Annual Volume</th><th>Share of UAE Outflows</th><th>Key Facts</th></tr></thead>
        <tbody>
            <tr><td><strong>🇮🇳 India</strong></td><td>$21.6 billion</td><td>~30%</td><td>Largest corridor; 3.4M+ Indian expats in UAE</td></tr>
            <tr><td><strong>🇵🇰 Pakistan</strong></td><td>$8.4 billion</td><td>~12%</td><td>1.5M+ Pakistani workers; surged in 2025</td></tr>
            <tr><td><strong>🇵🇭 Philippines</strong></td><td>$4.2 billion</td><td>~6%</td><td>900K+ OFWs; critical for Philippine economy</td></tr>
            <tr><td><strong>🇧🇩 Bangladesh</strong></td><td>$3.1 billion</td><td>~4%</td><td>700K+ workers; growing digital remittance</td></tr>
            <tr><td><strong>🇪🇬 Egypt</strong></td><td>$2.8 billion</td><td>~4%</td><td>500K+ Egyptians; pound devaluation boosted flows</td></tr>
            <tr><td><strong>🇳🇵 Nepal</strong></td><td>$1.2 billion</td><td>~2%</td><td>400K+ workers; remittances = 25% of GDP</td></tr>
        </tbody>
    </table>

    <h2 id="exchange-methods">Currency Exchange Methods in the UAE</h2>
    <p>There are several ways to exchange currency in the UAE, each with different costs, speeds, and convenience levels:</p>

    <h3>1. Licensed Exchange Houses</h3>
    <p>The UAE has over <strong>120 CBUAE-licensed exchange houses</strong> operating hundreds of branches. Major players include:</p>
    <ul>
        <li><strong>Al Ansari Exchange</strong> — UAE&apos;s largest; 200+ branches; competitive rates for INR, PKR, PHP</li>
        <li><strong>Al Fardan Exchange</strong> — Strong in Pakistan corridor; competitive PKR rates</li>
        <li><strong>Lulu Exchange</strong> — Popular in Abu Dhabi; good rates for South Asian currencies</li>
        <li><strong>Sharaf Exchange</strong> — Known for competitive European currency rates</li>
        <li><strong>GCC Exchange</strong> — Specialist in GCC cross-border transfers</li>
    </ul>
    <p>Average cost: <strong>3–5% total</strong> (spread + fee). Best for: cash exchange and popular remittance corridors.</p>

    <h3>2. Digital Money Transfer Apps</h3>
    <p>Online platforms consistently offer the <strong>best exchange rates</strong>, with total costs of just 1–3%:</p>
    <ul>
        <li><strong>Wise (TransferWise)</strong> — Mid-market rate with transparent fees; best overall value</li>
        <li><strong>Remitly</strong> — Fast delivery to India, Philippines, Pakistan; promotional rates</li>
        <li><strong>InstaPay</strong> — Instant UPI transfers to India; no intermediary banks</li>
        <li><strong>Western Union (online)</strong> — Global reach; better rates online than in-branch</li>
    </ul>

    <h3>3. Bank Wire Transfers</h3>
    <p>Banks are the <strong>most expensive</strong> option for currency exchange, with total costs averaging <strong>5–14%</strong> when you factor in the exchange rate spread and transfer fees (typically AED 50–200 per transfer). However, banks are necessary for large transfers (>AED 100,000) and corporate payments.</p>

    <h3>4. ATM Withdrawals Abroad</h3>
    <p>If you&apos;re a UAE resident traveling abroad, withdrawing local currency from ATMs using your UAE bank card typically costs 2–4% (exchange rate markup + international ATM fee). Some UAE banks (Liv., Mashreq Neo) offer fee-free international ATM withdrawals with competitive exchange rates.</p>

    <h2 id="dcc-scam">Dynamic Currency Conversion (DCC) — The Hidden Fee</h2>
    <p><strong>Dynamic Currency Conversion</strong> is when a merchant or ATM offers to charge your foreign card in your home currency instead of AED. This seems convenient but is actually a trap:</p>
    <ul>
        <li>DCC uses a <strong>3–7% worse exchange rate</strong> than your bank would provide</li>
        <li>The merchant or ATM operator pockets the difference as commission</li>
        <li><strong>Always choose &quot;AED&quot; or &quot;local currency&quot;</strong> when asked at POS terminals or ATMs</li>
        <li>Your bank will convert at a much better rate (typically 1–2% markup)</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Pro tip:</strong> If a Dubai merchant asks &quot;Would you like to pay in AED or [your currency]?&quot; — <strong>always choose AED</strong>. Saying yes to your home currency activates DCC and costs you 3–7% more.
    </div>

    <h2 id="cbuae-regulation">CBUAE Regulation of Exchange Houses</h2>
    <p>The Central Bank of the UAE regulates all currency exchange activities under its <strong>Regulations regarding Licensing and Monitoring of Exchange Business</strong>. Key regulatory requirements include:</p>
    <ul>
        <li><strong>Licensing</strong> — All exchange houses must obtain a CBUAE license; operating without one is a criminal offense</li>
        <li><strong>Minimum capital</strong> — Exchange houses must maintain minimum capital reserves to ensure solvency</li>
        <li><strong>AML/CFT compliance</strong> — Mandatory anti-money laundering and counter-terrorist financing programs</li>
        <li><strong>ID verification</strong> — Emirates ID required for all transactions; passports for tourists</li>
        <li><strong>Transaction reporting</strong> — Suspicious transactions must be reported to the UAE Financial Intelligence Unit (FIU)</li>
        <li><strong>Fee transparency</strong> — Exchange rates and fees must be clearly displayed</li>
        <li><strong>WPS authorization</strong> — Some exchange houses are authorized agents for the Wages Protection System</li>
    </ul>

    <h2 id="declaration-limits">Currency Declaration Limits</h2>
    <p>UAE customs requires declaration of cash and monetary instruments when crossing borders:</p>
    <table>
        <thead><tr><th>Scenario</th><th>Limit</th><th>Action Required</th></tr></thead>
        <tbody>
            <tr><td><strong>Carrying into UAE</strong></td><td>AED 60,000 or equivalent</td><td>Must declare to UAE Customs</td></tr>
            <tr><td><strong>Carrying out of UAE</strong></td><td>AED 60,000 or equivalent</td><td>Must declare to UAE Customs</td></tr>
            <tr><td><strong>Wire transfers</strong></td><td>No upper limit</td><td>AML monitoring applies</td></tr>
            <tr><td><strong>Exchange house transaction</strong></td><td>No upper limit</td><td>Emirates ID required; source-of-funds for large amounts</td></tr>
        </tbody>
    </table>

    <h2 id="digital-dirham">Digital Dirham — CBDC Initiative</h2>
    <p>The CBUAE has announced plans for a <strong>Central Bank Digital Currency (CBDC)</strong> — the <strong>Digital Dirham</strong> — as part of its Financial Infrastructure Transformation (FIT) program. The Digital Dirham aims to:</p>
    <ul>
        <li><strong>Reduce cross-border transfer costs</strong> — Potentially making remittances near-free</li>
        <li><strong>Enable instant settlement</strong> — Real-time finality for domestic and international payments</li>
        <li><strong>Enhance financial inclusion</strong> — Provide digital payment access to unbanked populations</li>
        <li><strong>Strengthen AML compliance</strong> — Full traceability of all transactions</li>
    </ul>
    <p>The project is being developed in collaboration with the Reserve Bank of India, the Hong Kong Monetary Authority, and the Bank of Thailand through the <strong>mBridge</strong> platform.</p>

    <h2 id="best-practices">Best Practices for Currency Exchange in the UAE</h2>
    <ol>
        <li><strong>Compare 3–4 providers</strong> before exchanging — rates can vary by 2–5% between providers</li>
        <li><strong>Avoid airport and hotel exchanges</strong> — they offer the worst rates (5–10% markup)</li>
        <li><strong>Use digital apps for remittances</strong> — Wise, Remitly, and InstaPay offer the best value</li>
        <li><strong>Always choose AED at POS/ATM</strong> — Reject Dynamic Currency Conversion (DCC)</li>
        <li><strong>Exchange large amounts through negotiation</strong> — Exchange houses offer better rates for >AED 10,000</li>
        <li><strong>Monitor rates before large transfers</strong> — Currency pairs (except USD) fluctuate daily</li>
        <li><strong>Keep receipts</strong> — Required for customs declaration and dispute resolution</li>
        <li><strong>Beware of &quot;zero-fee&quot; claims</strong> — The cost is hidden in a worse exchange rate</li>
    </ol>

    <h2 id="aed-notes">AED Banknotes and Coins</h2>
    <p>The UAE Dirham (AED, Dh, or د.إ) is divided into 100 fils. Understanding the denominations is helpful for tourists and new residents:</p>
    <table>
        <thead><tr><th>Value</th><th>Type</th><th>USD Equivalent</th><th>Feature</th></tr></thead>
        <tbody>
            <tr><td><strong>1,000 AED</strong></td><td>Banknote</td><td>$272</td><td>Al Hosn Palace (Abu Dhabi)</td></tr>
            <tr><td><strong>500 AED</strong></td><td>Banknote</td><td>$136</td><td>Sparrowhawk (national bird)</td></tr>
            <tr><td><strong>200 AED</strong></td><td>Banknote</td><td>$54</td><td>Central Bank HQ</td></tr>
            <tr><td><strong>100 AED</strong></td><td>Banknote</td><td>$27</td><td>Al Fahidi Fort (Dubai Museum)</td></tr>
            <tr><td><strong>50 AED</strong></td><td>Banknote</td><td>$14</td><td>Al Jahili Fort (Al Ain)</td></tr>
            <tr><td><strong>20 AED</strong></td><td>Banknote</td><td>$5</td><td>Dubai Creek dhow</td></tr>
            <tr><td><strong>10 AED</strong></td><td>Banknote</td><td>$3</td><td>Khor Fakkan (Sharjah)</td></tr>
            <tr><td><strong>5 AED</strong></td><td>Banknote</td><td>$1.36</td><td>Al Ain Oasis (UNESCO site)</td></tr>
            <tr><td><strong>1 AED</strong></td><td>Coin</td><td>$0.27</td><td>Bimetallic; palm tree design</td></tr>
        </tbody>
    </table>
    <p>In 2023–2024, the CBUAE introduced new polymer banknotes for the 5 AED and 10 AED denominations, featuring enhanced security elements including transparent windows and color-shifting ink.</p>

    <h2 id="historical-context">Brief History of the UAE Dirham</h2>
    <p>The UAE Dirham was introduced on <strong>May 19, 1973</strong>, replacing the Qatar and Dubai Riyal (and the Bahraini Dinar used in Abu Dhabi). Key milestones:</p>
    <ul>
        <li><strong>1973</strong> — AED introduced at par with the Qatar Riyal</li>
        <li><strong>1978</strong> — Initial peg to the IMF&apos;s Special Drawing Rights (SDR)</li>
        <li><strong>1980</strong> — De facto peg to the USD begins</li>
        <li><strong>1997</strong> — Official USD peg formalized at 3.6725</li>
        <li><strong>2017</strong> — CBUAE introduces Dirham Monetary Framework (DMF)</li>
        <li><strong>2023</strong> — New polymer banknotes introduced</li>
        <li><strong>2025</strong> — Digital Dirham CBDC development continues</li>
    </ul>
`;
