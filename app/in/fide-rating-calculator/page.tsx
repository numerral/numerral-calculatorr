import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import FIDERatingCalculatorCore from "@/components/calculator/FIDERatingCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "FIDE Rating Calculator India 2026 — Chess Elo Calculator, Performance Rating & Title Tracker",
    description: "Free FIDE Rating Calculator with 4 modes: Elo Calculator (multi-game tournament, K-factor 10/20/40, round-by-round breakdown), Performance Rating (TPR), Title Progress Tracker (GM/IM/FM/CM path), and Win Probability (expected score table). Covers Elo formula, K-factor rules, how to get FIDE rating in India (AICF), and FIDE title requirements.",
    keywords: ["FIDE rating calculator", "chess Elo calculator", "FIDE rating India", "chess rating calculator", "K-factor chess", "performance rating chess", "GM title requirements", "AICF rating", "Elo formula", "expected score chess"],
    alternates: buildCountryAlternates("IN", "/in/fide-rating-calculator", "fide-rating-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is a FIDE rating?", answer: "A FIDE rating (also called Elo rating) is an international numerical rating assigned by the World Chess Federation (FIDE) that measures a chess player's relative skill level. Ratings typically range from 1000 to 2800+. The system was invented by Arpad Elo and adopted by FIDE in 1970. Every FIDE-rated player has a unique FIDE ID and their rating is publicly visible on the FIDE website. As of 2026, the highest-rated player in the world is Magnus Carlsen (~2830), and India's D Gukesh is the reigning World Champion." },
    { question: "How is FIDE rating calculated?", answer: "The formula is: New Rating = Old Rating + K × (Actual Score − Expected Score). The Expected Score is calculated using the logistic formula: E = 1/(1 + 10^((Rb−Ra)/400)), where Ra and Rb are the ratings of the two players. K is the development coefficient (40, 20, or 10). If you beat a higher-rated opponent, your expected score was low, so (Actual − Expected) is large and you gain more points. If you lose to a lower-rated player, you lose more points." },
    { question: "What is K-factor in chess?", answer: "K-factor is the maximum number of rating points a player can gain or lose from a single game. FIDE uses three K-factor values: K=40 for new players (fewer than 30 rated games) and juniors under 18 with rating below 2300. K=20 for players with rating below 2400. K=10 for players who have ever reached rating 2400 (this stays K=10 permanently, even if rating drops later). Higher K means faster rating changes — new players' ratings adjust quickly to find their true level." },
    { question: "How to get a FIDE rating in India?", answer: "Step 1: Register with the All India Chess Federation (AICF) — your state chess association can help. Step 2: Obtain a FIDE ID through AICF. Step 3: Play in FIDE-rated tournaments (classical time control with minimum 60 min + 30 sec increment). Step 4: Complete at least 5 games against FIDE-rated opponents. Step 5: Achieve a performance rating of at least 1400. Your initial rating is calculated from your performance in these games. AICF organizes thousands of rated tournaments across India annually." },
    { question: "What is a good FIDE rating?", answer: "Rating levels in India: 1400–1600 — Beginner/Club level (basic tactics and openings). 1600–1800 — Intermediate club player. 1800–2000 — Strong club/State level player. 2000–2200 — Expert/National level. 2200+ — Candidate Master (CM) title eligible. 2300+ — FIDE Master (FM). 2400+ — International Master (IM) level. 2500+ — Grandmaster (GM) level. For context, the average FIDE-rated player worldwide is approximately 1600–1700." },
    { question: "What FIDE rating do you need for GM?", answer: "To become a Grandmaster, you need: (1) A FIDE rating of at least 2500 at any point, AND (2) Three GM norms — these are achieved by scoring well in tournaments with other titled and highly-rated players. Norm requirements include facing opponents from at least 3 different federations and achieving a performance rating of 2600+ across 9+ rounds. India has produced 85+ GMs, with D Gukesh becoming World Champion in 2024 and GM Arjun Erigaisi consistently in the world top 5." },
    { question: "What is the minimum FIDE rating?", answer: "The minimum published FIDE rating is 1400 (as of current FIDE regulations). If a player's calculated rating falls below 1400, they are removed from the FIDE rating list until they achieve 1400+ again. Before 2022, the minimum was 1000, but FIDE raised the floor to 1400 to improve statistical reliability. For initial rating calculation, FIDE also adds two hypothetical draws against 1800-rated opponents to stabilize the first rating." },
    { question: "How does expected score work?", answer: "Expected score represents the statistically predicted outcome based on rating difference. Formula: E = 1/(1+10^((Opponent_Rating − Your_Rating)/400)). For equal ratings (0 diff), expected score = 0.50 (50% each). For +200 difference, the higher player has ~0.76 expected score (76%). For +400 difference, ~0.92 (92%). This means if a 1800-rated player faces a 1600, they are expected to score 0.76 — winning 3 out of 4 games on average." },
    { question: "Can my FIDE rating go down?", answer: "Yes, absolutely. You lose rating points whenever your actual score is below your expected score. If you lose to a lower-rated player, you lose more points than losing to a higher-rated one. Common scenarios: losing to players 200+ rated below you can cost 15-18 points (at K=20). Drawing against a much lower opponent also costs points. Rating drops are normal and happen to all players — even Grandmasters. The key is long-term improvement trajectory, not individual tournament fluctuations." },
    { question: "What is a chess norm?", answer: "A norm is a high-level performance achievement in a FIDE-rated tournament that counts toward earning a title (GM, IM, WGM, WIM). For a GM norm, you must score a performance rating of 2600+ in a tournament with at least 9 rounds, against opponents averaging 2380+ rating, from at least 3 different federations, including at least 3 titled players (GM/IM). You need 3 such norms to qualify for the GM title (alongside the 2500+ rating requirement)." },
    { question: "How many GMs does India have?", answer: "India has produced over 85 Grandmasters as of 2026, making it one of the top chess nations globally. India's GM count exploded after Viswanathan Anand became World Champion in 2000. Key Indian GMs include: D Gukesh (World Champion 2024, youngest ever), R Praggnanandhaa (World Championship Challenger), Arjun Erigaisi (consistently world top 5), Viswanathan Anand (5-time World Champion), Pentala Harikrishna, Vidit Gujrathi, and many more. India now ranks #2 globally by number of GMs." },
    { question: "What is performance rating in chess?", answer: "Performance rating (TPR — Tournament Performance Rating) is the rating you 'performed at' during a specific tournament. It is calculated from your opponents' average rating plus a score-based adjustment: TPR = Avg_Opponent_Rating + dp(score). For example, if you scored 7/9 against opponents averaging 2000, your performance rating would be approximately 2210. Performance rating is used for norm calculations and for initial rating assignments. A GM norm requires a TPR of 2600+." },
    { question: "FIDE rating vs Chess.com rating — what's the difference?", answer: "Key differences: (1) FIDE ratings are official international rankings used for titles, norms, and official pairings. Chess.com/Lichess ratings are platform-specific and not recognized. (2) FIDE uses the Elo system; Chess.com uses Glicko. (3) FIDE ratings only change from over-the-board games; online ratings change from online games. (4) Most players' online ratings are 200-400+ points higher than their FIDE rating. (5) A 1500 on Chess.com is roughly 1200-1300 FIDE. Don't confuse the two systems." },
    { question: "How often does FIDE update ratings?", answer: "FIDE updates the official rating list once per month, on the 1st of every month. Before 2012, updates were only quarterly (every 3 months). The monthly update includes all games from FIDE-rated tournaments processed during the previous period. Tournament organizers must submit results to FIDE within a specific timeframe. You can check the latest FIDE rating list at ratings.fide.com. India's AICF also maintains a separate national rating list that updates more frequently." },
    { question: "Who is the highest-rated Indian chess player?", answer: "As of early 2026, the top Indian players by FIDE classical rating include D Gukesh (reigning World Champion, rating ~2780+), Arjun Erigaisi (consistently world top 5, rating ~2780+), R Praggnanandhaa (World Championship Challenger 2024, rating ~2750+), and Viswanathan Anand (5-time World Champion, rating ~2750, now primarily in advisory and rapid events). India has multiple players in the world top 20, marking an unprecedented 'Golden Era' for Indian chess." },
];

export default function FIDERatingCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "FIDE Rating Calculator" },
        ]),
        webAppSchema("FIDE Rating Calculator India 2026", canonicalUrl("/in/fide-rating-calculator")),
        {
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map(f => ({
                "@type": "Question", name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-fide" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "FIDE Rating Calculator" },
            ]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>FIDE Rating Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your new FIDE Elo rating with 4 modes — Elo Calculator (multi-game tournament mode with K-factor
                selection and round-by-round breakdown), Performance Rating (TPR), Title Progress Tracker (GM/IM/FM/CM
                path with progress bar), and Win Probability Calculator (expected score formula with visual probability bar).
            </p>
            <AuthorBadge categoryKey="salary" />
            <FIDERatingCalculatorCore />

            <section className="in-content"><div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} /></section>
            <FAQAccordion title="FIDE Rating Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>More India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in" className="in-related-link">
                        <span className="in-related-link__icon">🇮🇳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">All India Calculators</div>
                            <div className="in-related-link__desc">Browse all financial, tax, and utility calculators</div>
                        </div>
                    </Link>
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Invest your chess winnings via systematic investment plan</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-fide-elo">What Is the FIDE Elo Rating System?</h2>
    <p>The <strong>FIDE Elo rating system</strong> is the official method used by the World Chess Federation (FIDE) to measure the relative playing strength of chess players worldwide. Developed by Hungarian-American physicist <strong>Arpad Elo</strong> in the 1960s and adopted by FIDE in 1970, it assigns a numerical rating to each player based on their game results against rated opponents.</p>
    <p>The rating system is fundamentally <strong>relative</strong> — it doesn&rsquo;t measure absolute skill, but rather how you perform against other rated players. A rating of 2000 doesn&rsquo;t mean anything in isolation; it means you are expected to beat a 1800-rated player about 76% of the time and lose to a 2200-rated player about 76% of the time.</p>
    <div class="explanation__highlight">
        <strong>🇮🇳 India Context:</strong> India is experiencing a <strong>chess golden era</strong>. With D Gukesh becoming the youngest World Champion ever in 2024, R Praggnanandhaa challenging for the world title, and Arjun Erigaisi consistently in the world top 5, India now has more players in the world top 20 than any other country except the US and Azerbaijan. India ranks #2 globally by number of Grandmasters (85+).
    </div>

    <h2 id="elo-formula">The Elo Rating Formula</h2>
    <p>After each rated game, your new rating is calculated using this formula:</p>
    <div class="explanation__highlight">
        <strong>R<sub>new</sub> = R<sub>old</sub> + K &times; (S &minus; E)</strong><br/><br/>
        Where: <strong>R<sub>old</sub></strong> = Current rating, <strong>K</strong> = Development coefficient (40, 20, or 10),<br/>
        <strong>S</strong> = Actual score (1 for win, 0.5 for draw, 0 for loss),<br/>
        <strong>E</strong> = Expected score = <strong>1 / (1 + 10<sup>(R<sub>b</sub>&minus;R<sub>a</sub>)/400</sup>)</strong>
    </div>

    <h3>Worked Example</h3>
    <p>Your rating: <strong>1500</strong> | Opponent: <strong>1700</strong> | K=20 | Result: <strong>Win</strong></p>
    <table>
        <thead><tr><th>Step</th><th>Calculation</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Rating difference</td><td>1700 &minus; 1500</td><td>200</td></tr>
            <tr><td>Expected score</td><td>1/(1 + 10<sup>200/400</sup>)</td><td>0.2403</td></tr>
            <tr><td>Actual score</td><td>Win</td><td>1.0</td></tr>
            <tr><td>Rating change</td><td>20 &times; (1.0 &minus; 0.2403)</td><td><strong>+15.2</strong></td></tr>
            <tr><td>New rating</td><td>1500 + 15.2</td><td><strong>1515.2</strong></td></tr>
        </tbody>
    </table>

    <h2 id="k-factor">K-Factor Rules (FIDE 2026)</h2>
    <p>The <strong>K-factor</strong> determines how much your rating can change from a single game:</p>
    <table>
        <thead><tr><th>K-Factor</th><th>Who It Applies To</th><th>Max Change/Game</th></tr></thead>
        <tbody>
            <tr><td><strong>K = 40</strong></td><td>New players (&lt;30 rated games) AND all juniors under 18 with rating &lt;2300</td><td>&plusmn;40 points</td></tr>
            <tr><td><strong>K = 20</strong></td><td>All players with rating &lt;2400</td><td>&plusmn;20 points</td></tr>
            <tr><td><strong>K = 10</strong></td><td>Players who have ever reached published rating &ge;2400 (permanent)</td><td>&plusmn;10 points</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Important:</strong> Once you reach K=10 (after hitting 2400), it stays K=10 <strong>permanently</strong> — even if your rating later drops below 2400. This is why GMs&rsquo; ratings are very stable. For junior Indian players, K=40 allows rapid rating growth during their formative years.
    </div>

    <h2 id="get-fide-rating">How to Get a FIDE Rating in India</h2>
    <ol>
        <li><strong>Register with AICF</strong> &mdash; Contact your state chess association (e.g., Maharashtra Chess Association, Tamil Nadu State Chess Association) to become a member of the All India Chess Federation.</li>
        <li><strong>Obtain FIDE ID</strong> &mdash; AICF will register you with FIDE and assign a unique FIDE ID number.</li>
        <li><strong>Play rated tournaments</strong> &mdash; Participate in FIDE-rated classical tournaments (minimum 60 minutes + 30 second increment per move). India has thousands of rated tournaments annually across all states.</li>
        <li><strong>Complete minimum 5 games</strong> &mdash; You must play at least 5 games against FIDE-rated opponents.</li>
        <li><strong>Achieve minimum performance</strong> &mdash; Your performance rating must be at least 1400 to receive an initial rating. FIDE adds two hypothetical draws against 1800-rated opponents to stabilize the initial calculation.</li>
    </ol>

    <h2 id="fide-titles">FIDE Title Requirements</h2>
    <table>
        <thead><tr><th>Title</th><th>Abbreviation</th><th>Required Rating</th><th>Norms</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Grandmaster</strong></td><td>GM</td><td>2500</td><td>3 GM norms</td><td>Performance of 2600+ required per norm</td></tr>
            <tr><td><strong>International Master</strong></td><td>IM</td><td>2400</td><td>3 IM norms</td><td>Performance of 2450+ required per norm</td></tr>
            <tr><td><strong>FIDE Master</strong></td><td>FM</td><td>2300</td><td>None</td><td>Rating achievement alone qualifies</td></tr>
            <tr><td><strong>Candidate Master</strong></td><td>CM</td><td>2200</td><td>None</td><td>Rating achievement alone qualifies</td></tr>
            <tr><td><strong>Woman Grandmaster</strong></td><td>WGM</td><td>2300</td><td>3 WGM norms</td><td>Women can also earn open titles</td></tr>
            <tr><td><strong>Woman Int&rsquo;l Master</strong></td><td>WIM</td><td>2200</td><td>3 WIM norms</td><td>Women can also earn open titles</td></tr>
        </tbody>
    </table>

    <h2 id="india-golden-era">India&rsquo;s Chess Golden Era</h2>
    <p>India is in the midst of an unprecedented chess boom, driven by multiple factors:</p>
    <table>
        <thead><tr><th>Player</th><th>Achievement</th><th>Significance</th></tr></thead>
        <tbody>
            <tr><td><strong>D Gukesh</strong></td><td>World Champion 2024</td><td>Youngest World Champion ever at 18 years</td></tr>
            <tr><td><strong>R Praggnanandhaa</strong></td><td>World Championship Challenger 2024</td><td>First Indian challenger since Anand</td></tr>
            <tr><td><strong>Arjun Erigaisi</strong></td><td>Consistently world top 5</td><td>Rapid rise from Indian prodigy to elite</td></tr>
            <tr><td><strong>Viswanathan Anand</strong></td><td>5-time World Champion</td><td>Pioneer who inspired India&rsquo;s chess revolution</td></tr>
            <tr><td><strong>Koneru Humpy</strong></td><td>Women&rsquo;s World Rapid Champion</td><td>India&rsquo;s strongest woman player ever</td></tr>
        </tbody>
    </table>

    <h2 id="rating-levels">Rating Distribution &amp; What Your Rating Means</h2>
    <table>
        <thead><tr><th>Rating Range</th><th>Level</th><th>What It Means</th></tr></thead>
        <tbody>
            <tr><td>1400&ndash;1600</td><td>Club Beginner</td><td>Knows basic tactics, openings; learning endgames. Most school-level players.</td></tr>
            <tr><td>1600&ndash;1800</td><td>Club Intermediate</td><td>Solid tactical play, developing strategy. Strong at district-level tournaments.</td></tr>
            <tr><td>1800&ndash;2000</td><td>Strong Club/State</td><td>Can compete in state championships. Understands positional play and endgames.</td></tr>
            <tr><td>2000&ndash;2200</td><td>Expert/National</td><td>Competitive at national level. Understanding of deep opening theory.</td></tr>
            <tr><td>2200&ndash;2300</td><td>Candidate Master (CM)</td><td>Titled player. Very strong. Top 5% of all rated players.</td></tr>
            <tr><td>2300&ndash;2400</td><td>FIDE Master (FM)</td><td>Professional-level understanding. Top 2% of rated players.</td></tr>
            <tr><td>2400&ndash;2500</td><td>International Master (IM)</td><td>Among the best in most countries. Top 0.5%.</td></tr>
            <tr><td>2500+</td><td>Grandmaster (GM)</td><td>Elite player. Approximately 2,000 active GMs worldwide. Top 0.1%.</td></tr>
        </tbody>
    </table>

    <h2 id="expected-score-table">Expected Score &amp; Win Probability Table</h2>
    <p>This table shows the expected score for the <strong>higher-rated player</strong> based on rating difference:</p>
    <table>
        <thead><tr><th>Rating Difference</th><th>Higher-Rated Expected</th><th>Lower-Rated Expected</th><th>Win Odds</th></tr></thead>
        <tbody>
            <tr><td>0 (Equal)</td><td>50.0%</td><td>50.0%</td><td>1:1</td></tr>
            <tr><td>50</td><td>57.1%</td><td>42.9%</td><td>4:3</td></tr>
            <tr><td>100</td><td>64.0%</td><td>36.0%</td><td>2:1</td></tr>
            <tr><td>150</td><td>70.3%</td><td>29.7%</td><td>7:3</td></tr>
            <tr><td>200</td><td>75.9%</td><td>24.1%</td><td>3:1</td></tr>
            <tr><td>250</td><td>80.8%</td><td>19.2%</td><td>4:1</td></tr>
            <tr><td>300</td><td>84.9%</td><td>15.1%</td><td>6:1</td></tr>
            <tr><td>400</td><td>90.9%</td><td>9.1%</td><td>10:1</td></tr>
        </tbody>
    </table>

    <h2 id="common-misconceptions">Common Rating Misconceptions</h2>
    <ol>
        <li><strong>&ldquo;My Chess.com rating is my FIDE rating&rdquo;</strong> &mdash; No. Online platform ratings (Chess.com, Lichess) use different algorithms (Glicko) and are typically 200&ndash;400+ points higher than FIDE. A 1500 on Chess.com is roughly 1200&ndash;1300 FIDE.</li>
        <li><strong>&ldquo;K=40 means I gain 40 points per win&rdquo;</strong> &mdash; K=40 is the <em>maximum possible</em> change. The actual change depends on the expected score. Beating an equal-rated opponent with K=40 gives +20 points (not 40).</li>
        <li><strong>&ldquo;Draws are always neutral&rdquo;</strong> &mdash; Drawing a much lower-rated player costs you points because your expected score was higher than 0.5. Drawing a much higher-rated player gains points.</li>
        <li><strong>&ldquo;Rating inflation means old ratings were harder&rdquo;</strong> &mdash; While average ratings have risen over decades, this is partly due to the larger player pool and more frequent tournaments. Fischer&rsquo;s 2785 in 1972 and Carlsen&rsquo;s 2882 peak are not directly comparable.</li>
        <li><strong>&ldquo;I should avoid playing lower-rated opponents&rdquo;</strong> &mdash; While you risk more points, the experience and tournament participation are valuable. Consistent play against varied opposition is key to long-term improvement.</li>
    </ol>
`;
