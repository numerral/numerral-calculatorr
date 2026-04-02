import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400; // ISR — refresh once per day

/* ── Variant Definitions ── */
interface Variant { slug: string; days: number; direction: "future" | "past"; label: string; }

const FUTURE = [3, 5, 7, 10, 14, 15, 21, 28, 30, 45, 60, 75, 90, 100, 120, 150, 180, 200, 270, 365];
const PAST   = [3, 7, 14, 30, 45, 60, 90, 120, 180, 365];

function makeVariants(): Variant[] {
    const out: Variant[] = [];
    for (const n of FUTURE) out.push({ slug: `${n}-days-from-today`, days: n, direction: "future", label: `${n} Days From Today` });
    for (const n of PAST) out.push({ slug: `${n}-days-ago`, days: n, direction: "past", label: `${n} Days Ago` });
    return out;
}
const ALL_VARIANTS = makeVariants();

export function generateStaticParams() {
    return ALL_VARIANTS.map((v) => ({ variant: v.slug }));
}

/* ── Helpers ── */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function numberToWords(n: number): string {
    const ones = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
    const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + numberToWords(n % 100) : "");
    return n.toLocaleString("en-US");
}

function dateResult(days: number, dir: "future" | "past") {
    const d = new Date();
    d.setDate(d.getDate() + (dir === "future" ? days : -days));
    return {
        date: d,
        formatted: d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        month: MONTHS[d.getMonth()],
        day: d.getDate(),
        dayOfWeek: DAYS_OF_WEEK[d.getDay()],
        year: d.getFullYear(),
    };
}

function businessDaysResult(days: number, dir: "future" | "past") {
    const d = new Date();
    let remaining = days;
    const step = dir === "future" ? 1 : -1;
    while (remaining > 0) {
        d.setDate(d.getDate() + step);
        const dow = d.getDay();
        if (dow !== 0 && dow !== 6) remaining--;
    }
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

/* ── US Context per Day Count ── */
const DAY_CONTEXT: Record<number, string> = {
    3: "The <strong>Right of Rescission</strong> under the Truth in Lending Act (TILA) gives borrowers 3 business days to cancel certain home equity loans after closing. Employers must also complete <strong>Form I-9 verification</strong> within 3 business days of a new hire's start date.",
    5: "Five days is a common <strong>demand letter response window</strong> in small claims court. Many employers use a 5-day window for disciplinary response requirements.",
    7: "Seven days is a standard <strong>return/exchange window</strong> for many retailers and the standard <strong>weekly pay cycle</strong>. In some states, landlords must return security deposits within 7 days.",
    10: "The IRS often gives <strong>10 days to respond</strong> to certain notices. Many states use 10 days as the <strong>eviction notice</strong> period for non-payment of rent.",
    14: "Fourteen days is the <strong>biweekly pay cycle</strong> used by most US employers. The <strong>FTC Cooling-Off Rule</strong> originally set a 14-day window (now 3 days for door-to-door sales). Amazon and many online retailers use a 14-day standard return period.",
    15: "Fifteen days is a common<strong> grace period for mortgage payments</strong>. Most mortgage servicers don't charge a late fee until 15 days after the due date.",
    21: "Under the <strong>CARD Act</strong>, credit card issuers must give at least 21 days between the statement closing date and the payment due date — this is the minimum <strong>grace period</strong> for credit card bills.",
    28: "Twenty-eight days is a <strong>lunar month</strong> and the standard billing cycle length for many subscription services. It's also the typical duration of a <strong>medication prescription</strong> (4-week supply).",
    30: "<strong>Net-30</strong> is the most common US payment term — invoices are due within 30 calendar days. It's also the standard <strong>lease termination notice</strong> for month-to-month rentals and the typical <strong>credit card billing cycle</strong>.",
    45: "Investors in a <strong>1031 tax-deferred exchange</strong> have 45 days from closing to identify replacement properties. <strong>HIPAA</strong> requires covered entities to notify individuals within 45 days of receiving an access request.",
    60: "The <strong>COBRA election period</strong> gives employees 60 calendar days to elect continuation health coverage after a qualifying event. The <strong>WARN Act</strong> requires employers with 100+ employees to give 60 days' advance notice before mass layoffs. An <strong>IRA rollover</strong> must be completed within 60 days to avoid taxes and penalties.",
    75: "Seventy-five days is a common <strong>escrow timeline</strong> for residential real estate transactions in competitive markets, allowing time for inspections, appraisals, and loan processing.",
    90: "Ninety days is the standard <strong>probationary period</strong> for new hires. <strong>FMLA</strong> protects employees' jobs for up to 12 weeks (approximately 90 days). The IRS offers <strong>90-day payment extensions</strong> for taxpayers who owe less than $100,000. Standard US <strong>passport processing</strong> takes 6–8 weeks but can approach 90 days during peak season.",
    100: "One hundred days is a milestone often used in <strong>presidential administration tracking</strong> and <strong>project management</strong> for initial phase assessments.",
    120: "The <strong>IRS extended filing deadline</strong> (October 15) is approximately 120 business days from the original April 15 deadline. Many states use 120 days for <strong>professional license renewal</strong>. Some real estate escrows for complex properties (commercial, short sales) can extend to 120 days.",
    150: "One hundred fifty days is approximately <strong>5 months</strong> — a common timeline for <strong>construction project milestones</strong>, mid-year performance reviews, and some government procurement cycles.",
    180: "One hundred eighty days (≈6 months) is a common <strong>statute of limitations</strong> for many tort claims. The <strong>EEOC</strong> requires charges of discrimination to be filed within 180 days (300 days if your state has a fair employment practices agency). Many insurance policies use 180 days as a review period.",
    200: "Two hundred days is approximately <strong>6.5 months</strong> — commonly used as a long-range planning horizon in business forecasting and the approximate length of a <strong>US school year</strong> (180 instructional days + breaks).",
    270: "Two hundred seventy days is approximately <strong>9 months</strong> — the average <strong>human gestation period</strong> and a common timeline for major capital projects, organizational restructuring, and long-term business planning.",
    365: "Three hundred sixty-five days is <strong>one calendar year</strong> (366 in a leap year). Used for annual contract terms, lease agreements, insurance policy periods, and <strong>employment anniversary</strong> calculations. The standard US work year contains approximately <strong>261 business days</strong> (365 − 104 weekend days).",
};

const ADJACENT_FUTURE = [3, 5, 7, 10, 14, 15, 21, 28, 30, 45, 60, 75, 90, 100, 120, 150, 180, 200, 270, 365];
const ADJACENT_PAST   = [3, 7, 14, 30, 45, 60, 90, 120, 180, 365];

function getAdjacentLinks(v: Variant): { label: string; href: string }[] {
    const pool = v.direction === "future" ? ADJACENT_FUTURE : ADJACENT_PAST;
    const idx = pool.indexOf(v.days);
    const near: number[] = [];
    for (let i = idx - 2; i <= idx + 2; i++) {
        if (i >= 0 && i < pool.length && pool[i] !== v.days) near.push(pool[i]);
    }
    // Add some from the opposite direction
    const oppPool = v.direction === "future" ? ADJACENT_PAST : ADJACENT_FUTURE;
    const oppSlice = oppPool.filter((n) => Math.abs(n - v.days) <= v.days * 0.5 || n === v.days).slice(0, 2);
    
    const links: { label: string; href: string }[] = [];
    for (const n of near) {
        const slug = v.direction === "future" ? `${n}-days-from-today` : `${n}-days-ago`;
        links.push({ label: v.direction === "future" ? `${n} days from today` : `${n} days ago`, href: `/time-calculators/days-from-today/${slug}` });
    }
    for (const n of oppSlice) {
        const slug = v.direction === "future" ? `${n}-days-ago` : `${n}-days-from-today`;
        links.push({ label: v.direction === "future" ? `${n} days ago` : `${n} days from today`, href: `/time-calculators/days-from-today/${slug}` });
    }
    return links.slice(0, 8);
}

/* ── Page Component ── */
interface PageProps { params: Promise<{ variant: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { variant } = await params;
    const v = ALL_VARIANTS.find((x) => x.slug === variant);
    if (!v) return {};
    const r = dateResult(v.days, v.direction);
    const titleQ = v.direction === "future" ? `What Date Is ${v.days} Days From Today?` : `What Date Was ${v.days} Days Ago?`;
    return {
        title: `${titleQ} — ${r.formatted} | Numerral`,
        description: `${v.days} ${v.direction === "future" ? "days from today" : "days ago"} is ${r.formatted}. See calendar-day and business-day results, time equivalents, and US deadline context.`,
        keywords: [`${v.days} days from today`, `what date is ${v.days} days from today`, `${v.days} days ago`, `${v.days} calendar days`],
        alternates: { canonical: canonicalUrl(`/time-calculators/days-from-today/${v.slug}`) },
    };
}

export default async function DaysFromTodayChild({ params }: PageProps) {
    const { variant } = await params;
    const v = ALL_VARIANTS.find((x) => x.slug === variant);
    if (!v) return notFound();

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const r = dateResult(v.days, v.direction);
    const biz = businessDaysResult(v.days, v.direction);
    const wordsN = numberToWords(v.days);
    const titleQ = v.direction === "future" ? `What Date Is ${v.days} Days From Today?` : `What Date Was ${v.days} Days Ago?`;
    const context = DAY_CONTEXT[v.days];
    const adjacent = getAdjacentLinks(v);

    const reverseSlug = v.direction === "future" ? `${v.days}-days-ago` : `${v.days}-days-from-today`;
    const reverseLabel = v.direction === "future" ? `${v.days} days ago` : `${v.days} days from today`;
    const hasReverse = ALL_VARIANTS.some((x) => x.slug === reverseSlug);

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
            { name: "Days From Today Calculator", url: canonicalUrl("/time-calculators/days-from-today") },
            { name: v.label },
        ]),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-child" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Time & Date Calculators", href: "/time-calculators" },
                { label: "Days From Today", href: "/time-calculators/days-from-today" },
                { label: v.label },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-3)" }}>{titleQ}</h1>

            {/* ── Result Card ── */}
            <div style={{
                background: "linear-gradient(135deg, var(--n-primary), var(--n-primary-dark, #1e40af))",
                borderRadius: "var(--r-lg)",
                padding: "var(--s-6)",
                color: "#fff",
                marginBottom: "var(--s-5)",
                textAlign: "center",
            }}>
                <p style={{ fontSize: "var(--t-body-sm)", opacity: 0.85, marginBottom: "var(--s-2)" }}>
                    {v.direction === "future" ? `Date in ${v.days} Days` : `Date ${v.days} Days Ago`}
                </p>
                <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "var(--s-2)" }}>
                    📅 {r.formatted}
                </p>
                <p style={{ fontSize: "var(--t-body-sm)", opacity: 0.75 }}>
                    Calculated from today&apos;s date: {todayStr}
                </p>
            </div>

            {/* ── Business Days ── */}
            <div style={{
                background: "var(--n-surface-alt)",
                borderRadius: "var(--r-md)",
                padding: "var(--s-4) var(--s-5)",
                marginBottom: "var(--s-5)",
                borderLeft: "4px solid var(--n-primary)",
            }}>
                <p style={{ fontWeight: 600, marginBottom: "var(--s-2)" }}>
                    💼 {v.days} Business Days {v.direction === "future" ? "From Today" : "Ago"}:
                </p>
                <p style={{ fontSize: "var(--t-h3)", fontWeight: 700, color: "var(--n-primary)" }}>
                    {biz}
                </p>
                <p className="text-muted" style={{ fontSize: "var(--t-body-sm)", marginTop: "var(--s-2)" }}>
                    Business days exclude weekends (Saturday & Sunday). Federal holidays are not excluded — adjust manually if needed.
                    Use our <a href="/time-calculators/business-days-calculator">Business Days Calculator</a> for precise working-day counts.
                </p>
            </div>

            {/* ── Content ── */}
            <section className="hub-content">
                <h2>How to Calculate the Date {wordsN.charAt(0).toUpperCase() + wordsN.slice(1)} Days {v.direction === "future" ? "From Now" : "Ago"}</h2>
                <p>
                    You can <a href="/time-calculators/date-calculator">figure out the date</a> {wordsN} days {v.direction === "future" ? "from now" : "ago"} manually by using a calendar.
                    {v.direction === "future"
                        ? ` Look at today's date on the calendar and count forward one day at a time until you've counted ${v.days} total days.`
                        : ` Look at today's date on the calendar and count backward one day at a time until you've counted ${v.days} total days.`
                    }
                </p>
                <p>
                    Instead of counting one day at a time, you can jump by weeks — {v.direction === "future" ? "add" : "subtract"} 7 days at a time while reducing your remaining count by 7 for each jump.
                    {v.days >= 7 ? ` For ${v.days} days: that's ${Math.floor(v.days / 7)} full weeks (${Math.floor(v.days / 7) * 7} days) plus ${v.days % 7} more day${v.days % 7 !== 1 ? "s" : ""}.` : ""}
                </p>
                <p>
                    You can validate this result using our <a href="/time-calculators/days-from-today">Days From Today Calculator</a> or
                    our <a href="/time-calculators/date-duration-calculator">Date Duration Calculator</a>.
                </p>

                {hasReverse && (
                    <p>
                        Looking for the opposite direction? See <a href={`/time-calculators/days-from-today/${reverseSlug}`}>{reverseLabel}</a>.
                    </p>
                )}

                <h2>How Much Time Is {wordsN.charAt(0).toUpperCase() + wordsN.slice(1)} Days?</h2>
                <p>{wordsN.charAt(0).toUpperCase() + wordsN.slice(1)} days is the same amount of time as:</p>
                <ul>
                    <li><strong>{(v.days * 24).toLocaleString("en-US")} hours</strong></li>
                    <li><strong>{(v.days * 1440).toLocaleString("en-US")} minutes</strong></li>
                    <li><strong>{(v.days * 86400).toLocaleString("en-US")} seconds</strong></li>
                    {v.days >= 7 && <li><strong>{(v.days / 7).toFixed(1)} weeks</strong></li>}
                    {v.days >= 30 && <li><strong>~{(v.days / 30.44).toFixed(1)} months</strong></li>}
                </ul>

                {context && (
                    <>
                        <h2>Why {v.days} Days Matters in the US</h2>
                        <p dangerouslySetInnerHTML={{ __html: context }} />
                    </>
                )}
            </section>

            {/* ── More Dates Grid ── */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>📅 More Dates Relative to Today</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {adjacent.map((lnk, i) => (
                        <Link key={i} href={lnk.href}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>What {lnk.label.includes("ago") ? "was" : "is"} the date {lnk.label}?</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
