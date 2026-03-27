import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEGoldCalculatorCore from "@/components/calculator/UAEGoldCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Gold Price Calculator 2026 — Buy, Sell & Making Charges",
    description: "Calculate gold jewellery prices in Dubai and UAE. Enter today's 24K rate, select karat (22K/21K/18K), add making charges and 5% VAT. Includes buyback estimator and ESMA hallmark guide.",
    keywords: ["UAE gold price calculator", "Dubai gold calculator", "حاسبة سعر الذهب", "gold making charges Dubai", "22 karat gold price UAE", "gold buyback Dubai", "ESMA hallmark gold", "Dubai Gold Souk", "gold VAT UAE", "sell gold Dubai"],
    alternates: { canonical: canonicalUrl("/uae/gold-calculator") },
};

const FAQ_ITEMS = [
    { question: "How is the gold price determined in the UAE?", answer: "Gold prices in the UAE are based on the international gold spot price, primarily derived from the London Bullion Market Association (LBMA) and the London Gold Fix. The Dubai Gold & Jewellery Group publishes the official daily gold rate, which all retailers follow. The UAE Dirham is pegged to the US Dollar at AED 3.6725 per USD, so gold prices in AED move directly with the global USD price. Local factors like making charges, VAT, and seasonal demand (Diwali, Eid) affect the retail price but not the base gold rate." },
    { question: "What are making charges and how are they calculated?", answer: "Making charges (also called crafting or fabrication charges) are the cost of designing and producing gold jewellery. They cover design, labor, craftsmanship, and wastage. Calculation methods: (1) Percentage of gold value — most common, ranging from 6% for machine-made chains to 35% for bridal sets. (2) Flat rate per gram — some shops charge AED 15–50 per gram depending on complexity. (3) Fixed per piece — for branded or designer items. Making charges are the ONLY negotiable part of the gold price — the gold rate itself is fixed." },
    { question: "What is the difference between 24K, 22K, 21K, and 18K gold?", answer: "The karat system measures gold purity out of 24 parts. 24K (999 fineness) = 99.9% pure gold — too soft for most jewellery, used for bars and coins. 22K (916 fineness) = 91.6% gold + 8.4% alloy metals — the most popular for jewellery in the UAE and India. 21K (875 fineness) = 87.5% gold — popular in Gulf countries. 18K (750 fineness) = 75% gold — used for fine jewellery with gemstones, harder and more durable. Lower karat = more alloy = harder metal but less gold content." },
    { question: "Is gold cheaper in Dubai than other countries?", answer: "Gold is generally cheaper in Dubai compared to most countries for several reasons: (1) Lower making charges due to high competition and volume. (2) No income tax means lower operational costs for jewellers. (3) Only 5% VAT (compared to 12-18% GST in India, 20% VAT in UK). (4) Dubai is a major gold trading hub with direct supply chains. (5) Tourists can reclaim up to 85% of the VAT at departure. However, the base gold rate (per gram) is the same globally — the savings come from lower margins, taxes, and making charges." },
    { question: "How does VAT apply to gold in the UAE?", answer: "The UAE charges 5% VAT on gold: For jewellery — VAT is applied to (gold value + making charges). For investment-grade gold (≥99% purity bars) — zero-rated for B2B transactions between VAT-registered entities. For retail gold bars/coins — standard 5% VAT applies to individual buyers. Tourist VAT refund: Non-resident tourists can reclaim up to 85% of the 5% VAT (after processing fees) through the Planet Tax Free scheme at the airport. You need the original tax invoice and the items must be exported." },
    { question: "How do I verify the purity of gold in the UAE?", answer: "The UAE has mandatory hallmarking by ESMA (Emirates Authority for Standardization and Metrology). Check for: (1) UAE crescent moon logo on the piece. (2) Fineness number (e.g., 916 for 22K, 750 for 18K). (3) 12-digit serial number — you can verify this online through the ESMA portal. (4) Bareeq certification mark from Dubai Central Laboratory. Testing methods: visual inspection of hallmarks, electronic testers, X-Ray Fluorescence (XRF) — non-destructive and most accurate, and fire assay for bullion. Most Gold Souk shops offer free XRF purity testing." },
    { question: "What should I know before buying gold at the Dubai Gold Souk?", answer: "Key tips: (1) Check today's rate — displayed on boards at the Souk entrance and in shops. (2) Know the karat — 22K is most popular; 18K is more durable. (3) Negotiate making charges only — the gold rate per gram is fixed market-wide. (4) Aim for 25% off quoted making charges — this is standard practice. (5) Ask for the hallmark certificate with 12-digit serial number. (6) Compare 3-4 shops before buying. (7) Pay cash for better negotiation leverage on making charges. (8) Visit late afternoon/evening for the best atmosphere and deals. (9) Bring your passport for tourist VAT refund eligibility." },
    { question: "How do I sell old gold in Dubai?", answer: "Steps: (1) Know today's gold rate for your karat. (2) Get your gold weighed and purity-tested (free XRF testing at most shops). (3) Visit multiple buyers — Gold Souk, Meena Bazaar, or cash-for-gold shops. (4) Compare offers — most offer 95-100% of the current gold rate. (5) Making charges are NOT refunded on buyback — you receive gold value only. (6) Bring ID (Emirates ID or passport) and original invoice if available. (7) Gold bars and coins get closer to 100% buyback. (8) Time your sale — sell when global prices are high for maximum return." },
    { question: "What is the ESMA hallmark and why does it matter?", answer: "The ESMA hallmark is a mandatory quality mark on all gold sold in the UAE. It guarantees the purity of the gold has been independently verified. Components: UAE crescent moon logo, fineness number (e.g., 916, 750), manufacturer code, and a unique 12-digit serial number. The Bareeq certification from Dubai Central Laboratory is an additional purity verification. Without an ESMA hallmark, the gold has not been officially tested and may not be the stated purity. Always ask to see the hallmark before purchasing." },
    { question: "Can I take gold out of the UAE?", answer: "Yes, but with rules: (1) Maximum 10 kg per person when leaving the UAE. (2) All gold must be declared at UAE customs. (3) Investment gold bought in the UAE needs customs declaration paperwork. (4) Your destination country may have its own import limits and duties — check before traveling. (5) India allows duty-free: 20g for men (max ₹50,000 value) and 40g for women (max ₹1,00,000). Beyond this, 12.5% customs duty applies in India. (6) Always carry the original purchase invoice." },
    { question: "What is the difference between gold jewellery and gold bars for investment?", answer: "Gold bars: lower premium (0-2% over spot price), higher purity (24K, 99.9%), easier to sell near market rate (95-100% buyback), no making charges, zero-rated VAT for B2B. Gold jewellery: higher premium (6-35% making charges), lower purity (usually 18K-22K), making charges lost on resale, aesthetic/personal value, subject to 5% VAT. For pure investment, gold bars offer better returns. For personal use + investment, 22K jewellery is a good balance. Some Dubai shops offer 'zero making charge' 22K pieces for investment-minded buyers." },
    { question: "What is a tola and how does it relate to grams?", answer: "A tola is a traditional South Asian unit of weight commonly used in gold markets. 1 tola = 11.664 grams. This unit is widely used by Indian, Pakistani, and Bangladeshi buyers in Dubai's Gold Souk. Other common units: 1 troy ounce = 31.1035 grams (used in international bullion markets like LBMA and DGCX), 1 mithqal = 4.68 grams (traditional Arabic unit), and 1 kilogram = 1,000 grams (wholesale bars). When buying in Dubai, prices are quoted per gram in AED, regardless of the unit you're buying in." },
    { question: "What is the Dubai Gold and Commodities Exchange (DGCX)?", answer: "The DGCX, established in 2005, is the Middle East's leading derivatives exchange, located in the Dubai Multi Commodities Centre (DMCC). It provides futures and options contracts for gold, silver, and other commodities. While retail gold buyers don't trade on the DGCX directly, the exchange contributes to Dubai's position as a global gold trading hub and influences wholesale pricing. The DGCX uses troy ounces and USD for trading. The Dubai Good Delivery (DGD) standard ensures gold bars traded meet minimum purity and weight requirements." },
    { question: "When is the best time to buy gold in Dubai?", answer: "Strategically: (1) During festivals — many retailers offer discounts on making charges during DSF (Dubai Shopping Festival), Diwali, Eid, and Akshaya Tritiya. (2) When global prices dip — monitor the international spot price for dips. (3) During promotions — look for zero making charge offers. Practically: (4) Late afternoon/evening at the Gold Souk for the best negotiation atmosphere. (5) Weekdays are less crowded and shops may be more willing to negotiate. (6) End of month — some shops offer better deals to meet sales targets." },
    { question: "How do making charges affect the resale value of gold?", answer: "Making charges are a one-time cost that is not recovered when you sell. Example: If you buy 10g of 22K gold at AED 320/gram (AED 3,200 gold value), with 15% making charges (AED 480) and 5% VAT (AED 184), total paid = AED 3,864. When selling, you receive only the gold value at current rates (e.g., AED 3,200 at 98% buyback = AED 3,136). Net loss = AED 728 (making charges + VAT + 2% buyback margin). To recover, gold prices need to increase by approximately 23% for this purchase to break even." },
    { question: "What is the 2025 XRF kiosk for gold purity testing?", answer: "Dubai Municipality developed self-service XRF (X-Ray Fluorescence) kiosks expected in the Gold Souq and major malls from 2025. These machines provide non-destructive purity analysis in under 60 seconds, giving a detailed composition report showing exact gold percentage and other metals present. The service is designed to boost transparency for buyers and sellers — you can test any gold item without damaging it, before buying or selling. This technology reads the elemental composition of the metal through X-ray analysis, providing results comparable to lab-grade fire assay testing." },
];

export default function GoldCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Gold Price Calculator" },
        ]),
        webAppSchema("UAE Gold Price Calculator", canonicalUrl("/uae/gold-calculator")),
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
            <Script id="schema-gold-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Gold Price Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Gold Price Calculator 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate gold jewellery prices in Dubai and the UAE. Enter today&apos;s 24K rate, select your karat, add making charges and VAT. Includes a buyback estimator for selling old gold and a complete ESMA hallmark verification guide.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAEGoldCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE Gold Price Calculator FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE VAT Calculator</div>
                            <div className="uae-related-link__desc">5% VAT, tourist refund</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💼</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Gross to net, overtime</div>
                        </div>
                    </Link>
                    <Link href="/uae/mortgage-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Mortgage Calculator</div>
                            <div className="uae-related-link__desc">EMI, DLD fees, DBR</div>
                        </div>
                    </Link>
                    <Link href="/uae/gratuity-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💼</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Gratuity Calculator</div>
                            <div className="uae-related-link__desc">End-of-service benefits</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="gold-uae">Gold in the UAE — Why Dubai Is the City of Gold</h2>
    <p>Dubai has earned its title as the <strong>"City of Gold"</strong> through centuries of gold trading, a strategic location at the crossroads of Asia, Europe, and Africa, and one of the world&apos;s most transparent and well-regulated gold markets. The UAE imports over <strong>900 tonnes of gold annually</strong>, with much of it processed, crafted, and re-exported.</p>
    <p>For consumers, buying gold in the UAE offers several advantages: <strong>no income tax</strong> environment keeps prices competitive, only <strong>5% VAT</strong> (refundable for tourists), and the gold market is rigorously regulated by <strong>ESMA</strong> to ensure purity and fair pricing.</p>

    <h2 id="how-pricing-works">How Gold Pricing Works in the UAE</h2>
    <p>The retail price of gold jewellery in the UAE has three components:</p>
    <table>
        <thead><tr><th>Component</th><th>Description</th><th>Negotiable?</th></tr></thead>
        <tbody>
            <tr><td><strong>Gold Value</strong></td><td>Weight × per-gram rate for your karat</td><td>No — fixed daily rate</td></tr>
            <tr><td><strong>Making Charges</strong></td><td>Design, labor, craftsmanship, wastage</td><td><strong>Yes — always negotiate</strong></td></tr>
            <tr><td><strong>5% VAT</strong></td><td>Applied to (gold value + making charges)</td><td>No — refundable for tourists</td></tr>
        </tbody>
    </table>
    <p>The daily gold rate is set by the <strong>Dubai Gold &amp; Jewellery Group</strong> based on the global LBMA spot price. This rate is <strong>uniform across all shops</strong> — you&apos;ll see it displayed on boards in the Gold Souk, in retail shops, and online.</p>

    <h2 id="karat-system">The Karat System — Gold Purity Explained</h2>
    <table>
        <thead><tr><th>Karat</th><th>Fineness</th><th>Gold Content</th><th>Common Use in UAE</th></tr></thead>
        <tbody>
            <tr><td><strong>24K</strong></td><td>999</td><td>99.9%</td><td>Investment bars, coins, bullion</td></tr>
            <tr><td><strong>22K</strong></td><td>916</td><td>91.6%</td><td>Most popular for jewellery</td></tr>
            <tr><td><strong>21K</strong></td><td>875</td><td>87.5%</td><td>Popular in Gulf countries</td></tr>
            <tr><td><strong>18K</strong></td><td>750</td><td>75.0%</td><td>Fine jewellery, watches, designer pieces</td></tr>
        </tbody>
    </table>
    <p><strong>Why does purity matter?</strong> Higher karat = more gold = higher price per gram but softer metal. <strong>22K</strong> is the sweet spot for jewellery in the UAE — high gold content with enough alloy for durability. <strong>18K</strong> is preferred for intricate designs and settings with gemstones because it&apos;s harder.</p>

    <h2 id="making-charges">Making Charges — The Only Negotiable Cost</h2>
    <table>
        <thead><tr><th>Jewellery Type</th><th>Typical Making Charge</th><th>Negotiation Potential</th></tr></thead>
        <tbody>
            <tr><td>Machine-made chains/bangles</td><td>6–10%</td><td>Low — already at minimum</td></tr>
            <tr><td>Standard rings/earrings</td><td>10–15%</td><td>Moderate — can reduce by 15-20%</td></tr>
            <tr><td>Handcrafted designer pieces</td><td>15–25%</td><td>High — aim for 25% off</td></tr>
            <tr><td>Bridal/wedding sets</td><td>20–35%</td><td>Highest — negotiate firmly</td></tr>
            <tr><td>Gold coins (plain)</td><td>1–3%</td><td>Minimal — near spot price</td></tr>
            <tr><td>Gold bars/ingots</td><td>0–2%</td><td>None — fixed premium</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Negotiation tip:</strong> At the Gold Souk, aim for <strong>~25% off</strong> the initially quoted making charge. Some shops offer <strong>"zero making charges"</strong> on plain 22K/24K pieces — these are near-spot deals ideal for investment-minded buyers. Always compare 3-4 shops before committing.
    </div>

    <h2 id="esma-hallmark">ESMA Hallmarking — How to Verify Gold Purity</h2>
    <p>The <strong>Emirates Authority for Standardization and Metrology (ESMA)</strong> mandates hallmarking on all gold sold in the UAE. This is your guarantee of purity.</p>
    <table>
        <thead><tr><th>Hallmark Component</th><th>What It Tells You</th></tr></thead>
        <tbody>
            <tr><td><strong>UAE crescent moon</strong></td><td>Tested and hallmarked in the UAE</td></tr>
            <tr><td><strong>Fineness number</strong></td><td>Gold purity — 916 = 22K, 750 = 18K</td></tr>
            <tr><td><strong>Manufacturer code</strong></td><td>Unique ID of the workshop/brand</td></tr>
            <tr><td><strong>12-digit serial</strong></td><td>Verifiable online via ESMA portal</td></tr>
            <tr><td><strong>Bareeq mark</strong></td><td>Dubai Central Lab purity certification</td></tr>
        </tbody>
    </table>
    <p>Always ask to see the hallmark under a magnifier and request the <strong>assay certificate</strong>. The 12-digit serial can be verified online through the ESMA portal or Dubai Municipality&apos;s gold verification service.</p>

    <h2 id="purity-testing">Gold Purity Testing Methods</h2>
    <ul>
        <li><strong>Visual inspection</strong> — Check hallmarks, stamps, and weight engravings</li>
        <li><strong>Magnet test</strong> — Real gold is not magnetic (basic but not conclusive)</li>
        <li><strong>Acid test</strong> — Scratches surface, applies acid — less common now</li>
        <li><strong>Electronic tester</strong> — Electrical signal through metal — quick but approximate</li>
        <li><strong>XRF (X-Ray Fluorescence)</strong> — Non-destructive, lab-grade accuracy, <strong>free at most Gold Souk shops</strong></li>
        <li><strong>Fire assay</strong> — Most accurate for bullion — melts a sample to isolate pure gold</li>
    </ul>
    <p><strong>2025 update:</strong> Dubai Municipality has introduced <strong>self-service XRF kiosks</strong> at the Gold Souq and major malls. These provide a detailed purity report in under 60 seconds without damaging the item — ideal for both buyers and sellers.</p>

    <h2 id="buying-guide">Dubai Gold Souk — Complete Buying Guide</h2>
    <ol>
        <li><strong>Check today&apos;s rate</strong> — Displayed at Gold Souk entrance and on retailer boards</li>
        <li><strong>Choose your karat</strong> — 22K for traditional, 18K for fine jewellery</li>
        <li><strong>Compare shops</strong> — Walk through 3-4 shops before buying</li>
        <li><strong>Ask about making charges</strong> — This is where prices differ between shops</li>
        <li><strong>Negotiate</strong> — Aim for 25% off making charges; gold rate is non-negotiable</li>
        <li><strong>Check the hallmark</strong> — ESMA crescent, fineness, serial number</li>
        <li><strong>Request documentation</strong> — Assay certificate, tax invoice, warranty card</li>
        <li><strong>Pay wisely</strong> — Cash gets better making charge rates; card is safer</li>
        <li><strong>Keep the invoice</strong> — Essential for VAT refund and future resale</li>
    </ol>

    <h2 id="selling-gold">Selling Gold in Dubai</h2>
    <p>When selling gold, you receive the <strong>gold value only</strong> — making charges are <strong>never refunded</strong>. This is the most misunderstood aspect of gold buying.</p>
    <table>
        <thead><tr><th>Sold Item</th><th>Typical Buyback Rate</th><th>Making Charge Recovery</th></tr></thead>
        <tbody>
            <tr><td>Gold bars/coins</td><td>98–100% of market rate</td><td>0–2% premium lost</td></tr>
            <tr><td>22K jewellery (good condition)</td><td>95–98% of gold value</td><td>No making charges returned</td></tr>
            <tr><td>18K jewellery</td><td>93–97% of gold value</td><td>No making charges returned</td></tr>
            <tr><td>Damaged/old jewellery</td><td>90–95% of gold value</td><td>No making charges returned</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Example:</strong> You bought 10g of 22K gold at AED 320/g = AED 3,200 gold value + 15% making (AED 480) + 5% VAT (AED 184) = <strong>AED 3,864 paid</strong>. On resale at 98% buyback: AED 3,200 × 0.98 = <strong>AED 3,136 received</strong>. Net loss = AED 728 (18.8%). For gold prices to break even, they need to rise ~23%.
    </div>

    <h2 id="vat-gold">VAT on Gold — Rules for Residents and Tourists</h2>
    <table>
        <thead><tr><th>Category</th><th>VAT Rate</th><th>Who Pays</th></tr></thead>
        <tbody>
            <tr><td>Gold jewellery (retail)</td><td><strong>5%</strong></td><td>All buyers</td></tr>
            <tr><td>Investment gold ≥99% (B2B)</td><td><strong>Zero-rated</strong></td><td>VAT-registered businesses only</td></tr>
            <tr><td>Gold bars/coins (retail)</td><td><strong>5%</strong></td><td>Individual buyers</td></tr>
            <tr><td>Tourist VAT refund</td><td><strong>~4.25% back</strong></td><td>Non-resident tourists via Planet Tax Free</td></tr>
        </tbody>
    </table>
    <p><strong>Tourist refund process:</strong> (1) Minimum AED 250 purchase from a single shop. (2) Get the Planet Tax Free validation from the retailer. (3) Present items + documents at the airport VAT refund counter before check-in. (4) Receive a refund of approximately 85% of the VAT (after AED 4.80/tag processing fee).</p>

    <h2 id="import-export">Gold Import and Export Rules</h2>
    <table>
        <thead><tr><th>Rule</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Export limit</strong></td><td>10 kg per person when leaving the UAE</td></tr>
            <tr><td><strong>Customs declaration</strong></td><td>Mandatory for all gold (entering or leaving)</td></tr>
            <tr><td><strong>Import duty (jewellery)</strong></td><td>5% customs duty</td></tr>
            <tr><td><strong>Import duty (bullion)</strong></td><td>Typically duty-free for investment-grade</td></tr>
            <tr><td><strong>India allowance</strong></td><td>Men: 20g (₹50K); Women: 40g (₹1L) duty-free</td></tr>
            <tr><td><strong>Exceeding allowance</strong></td><td>Subject to destination country&apos;s customs duty</td></tr>
        </tbody>
    </table>

    <h2 id="investment">Gold as Investment in the UAE</h2>
    <ul>
        <li><strong>No capital gains tax</strong> — UAE residents pay zero tax on gold investment profits</li>
        <li><strong>Gold ETFs</strong> — Available on DFSA-regulated platforms; unit-based gold investment</li>
        <li><strong>DGCX futures</strong> — Dubai Gold and Commodities Exchange for institutional/derivatives trading</li>
        <li><strong>Physical bars</strong> — 1g to 1kg bars from LBMA-accredited refineries (lowest premiums)</li>
        <li><strong>Gold savings plans</strong> — Some jewellers offer monthly gold saving schemes</li>
        <li><strong>Digital gold</strong> — Select fintech platforms in the UAE offer fractional gold ownership</li>
    </ul>

    <h2 id="common-mistakes">Common Mistakes When Buying Gold in the UAE</h2>
    <ol>
        <li><strong>Not checking the daily rate</strong> — Always verify today&apos;s rate before entering a shop</li>
        <li><strong>Not negotiating making charges</strong> — Gold Souk making charges are always negotiable</li>
        <li><strong>Confusing karat with carat</strong> — Karat = gold purity, Carat = gemstone weight</li>
        <li><strong>Not checking the ESMA hallmark</strong> — The hallmark is your purity guarantee</li>
        <li><strong>Expecting making charges back on resale</strong> — They are never refunded</li>
        <li><strong>Buying for investment with high making charges</strong> — Use bars or zero-MC pieces instead</li>
        <li><strong>Not getting a proper invoice</strong> — Needed for VAT refund and customs declarations</li>
        <li><strong>Not declaring at customs</strong> — UAE requires declaration of all gold when traveling</li>
    </ol>
`;
