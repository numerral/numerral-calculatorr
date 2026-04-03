// Height Converter Programmatic Child Pages 
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import HeightConverterCore from "@/components/calculator/HeightConverterCore";
import AuthorBadge from "@/components/shared/AuthorBadge";
import { canonicalUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper to parse slugs
function parseSlug(slug: string) {
  const imperialMatch = slug.match(/^(\d+)ft(?:-(\d+(?:\.\d+)?)in)?(?:-to-inches)?$/);
  if (imperialMatch) {
    const ft = parseInt(imperialMatch[1], 10);
    const inc = imperialMatch[2] ? parseFloat(imperialMatch[2]) : 0;
    const totalInches = ft * 12 + inc;
    const cm = totalInches * 2.54;
    return { type: "imperial" as const, ft, inc, cm, original: slug };
  }

  const metricMatch = slug.match(/^(\d+)cm(?:-to-feet)?$/);
  if (metricMatch) {
    const cm = parseInt(metricMatch[1], 10);
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inc = totalInches % 12;
    return { type: "metric" as const, ft, inc, cm, original: slug };
  }

  return null;
}

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  
  // Imperial combinations: 4'0" to 7'0"
  for (let ft = 4; ft <= 7; ft++) {
    for (let inc = 0; inc <= 11; inc++) {
        if (ft === 7 && inc > 0) continue; 
        params.push({ slug: `${ft}ft${inc > 0 ? `-${inc}in` : ""}-to-inches` });
    }
  }

  // Metric combinations: 120cm to 215cm
  for (let cm = 120; cm <= 215; cm++) {
    params.push({ slug: `${cm}cm-to-feet` });
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  if (!parsed) return {};

  const { type, ft, inc, cm } = parsed;
  const incFormatted = inc === 0 ? "0" : inc.toFixed(2).replace(/\.00$/, "");
  const cmFormatted = cm.toFixed(2).replace(/\.00$/, "");

  const title = type === "imperial" 
    ? `What is ${ft}' ${incFormatted}" in Inches? - Height Converter`
    : `What is ${cm} cm in Feet and Inches? - Height Converter`;

  const description = type === "imperial"
    ? `Convert ${ft} feet and ${incFormatted} inches to total inches and centimeters. ${ft}' ${incFormatted}" is exactly equal to ${ft * 12 + inc} inches or ${cmFormatted} cm.`
    : `Convert ${cm} centimeters to feet and inches. ${cm} cm is equivalent to ${ft} feet and ${incFormatted} inches. Convert metric heights easily.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(`/height-converter/${slug}`) },
    openGraph: {
      title,
      description,
      url: canonicalUrl(`/height-converter/${slug}`),
      siteName: "Numerral",
      images: [{ url: `${SITE_URL}/images/calculators/height-converter-og.png`, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/calculators/height-converter-og.png`],
    },
  };
}

export default async function HeightConverterQueryPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { type, ft, inc, cm } = parsed;
  const incFormatted = inc === 0 ? "0" : Number(inc.toFixed(2)).toString();
  const cmFormatted = Number(cm.toFixed(2)).toString();
  const totalInches = type === "imperial" ? (ft * 12 + inc) : null;

  const title = type === "imperial" 
    ? `What is ${ft}' ${incFormatted}" in Inches?`
    : `What is ${cm} cm in Feet and Inches?`;

  const faqs = [
    {
      question: type === "imperial" ? `How many inches is ${ft} feet ${incFormatted} inches?` : `How tall is ${cm} cm in feet?`,
      answer: type === "imperial" 
        ? `${ft} feet and ${incFormatted} inches equals exactly ${totalInches} inches (or ${cmFormatted} centimeters).`
        : `${cm} centimeters equals approximately ${ft} feet and ${incFormatted} inches.`
    },
    {
      question: type === "imperial" ? `What is ${ft}'${incFormatted}" in meters?` : `What is ${cm} cm in meters?`,
      answer: type === "imperial" 
        ? `${ft}'${incFormatted}" is ${Number((cm / 100).toFixed(3))} meters.`
        : `${cm} cm is ${cm / 100} meters.`
    }
  ];

  const schemaData = JSON.stringify([
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Height Converter", url: `${SITE_URL}/height-converter/` },
      { name: title },
    ]),
    faqSchema(faqs)
  ]);

  // Generators for the Dynamic Visual Content
  function generateContextualTableRows() {
    let rows = [];
    if (type === "imperial") {
        let totalCenter = ft * 12 + inc;
        for (let i = totalCenter - 5; i <= totalCenter + 5; i++) {
            if (i < 48 || i > 84) continue;
            let iterFt = Math.floor(i / 12);
            let iterInc = i % 12;
            let iterCm = i * 2.54;
            let isCenter = (i === totalCenter);
            rows.push(
                <tr key={i} className={isCenter ? "glass-row-alt2" : "glass-row"} style={{ borderBottom: "1px solid var(--n-border)", background: isCenter ? "rgba(250, 204, 21, 0.15)" : undefined, transition: "background 0.2s" }}>
                    <td style={{ padding: "1rem", fontWeight: isCenter ? 600 : "normal" }}>{iterFt}' {iterInc}"</td>
                    <td style={{ padding: "1rem", color: isCenter ? "#facc15" : undefined, fontWeight: isCenter ? 600 : "normal" }}>{i}"</td>
                    <td style={{ padding: "1rem" }}>{iterCm.toFixed(2).replace(/\.00$/, "")} cm</td>
                </tr>
            );
        }
    } else {
        for (let i = cm - 5; i <= cm + 5; i++) {
            if (i < 120 || i > 215) continue;
            let tInc = i / 2.54;
            let iterFt = Math.floor(tInc / 12);
            let iterInc = (tInc % 12).toFixed(2).replace(/\.00$/, "");
            let isCenter = (i === cm);
            rows.push(
                <tr key={i} className={isCenter ? "glass-row-alt2" : "glass-row"} style={{ borderBottom: "1px solid var(--n-border)", background: isCenter ? "rgba(250, 204, 21, 0.15)" : undefined, transition: "background 0.2s" }}>
                    <td style={{ padding: "1rem", color: isCenter ? "#facc15" : undefined, fontWeight: isCenter ? 600 : "normal" }}>{i} cm</td>
                    <td style={{ padding: "1rem", color: "var(--n-foreground)" }}>{Math.round(tInc)}"</td>
                    <td style={{ padding: "1rem", color: "var(--n-foreground)" }}>{iterFt}' {iterInc}"</td>
                </tr>
            );
        }
    }
    return rows;
  }

  function generateSimilarLinks() {
    let links = [];
    const pill_style = { 
        padding: "1rem", background: "var(--n-surface)", borderRadius: "0.75rem", 
        border: "1px solid var(--n-border)", textDecoration: "none", color: "var(--n-foreground)", 
        fontWeight: "500", display: "block", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    };
    if (type === "imperial") {
        let totalCenter = ft * 12 + inc;
        let candidates = [totalCenter - 2, totalCenter - 1, totalCenter + 1, totalCenter + 2];
        for (let i of candidates) {
            if (i < 48 || i > 84) continue;
            let iterFt = Math.floor(i / 12);
            let iterInc = i % 12;
            let linkSlug = `${iterFt}ft${iterInc > 0 ? `-${iterInc}in` : ""}-to-inches`;
            links.push(
                <Link key={linkSlug} href={`/height-converter/${linkSlug}`} className="pill-link" style={pill_style}>
                    What is {iterFt}' {iterInc}" in inches?
                </Link>
            )
        }
    } else {
        let candidates = [cm - 2, cm - 1, cm + 1, cm + 2];
        for (let i of candidates) {
            if (i < 120 || i > 215) continue;
            let linkSlug = `${i}cm-to-feet`;
            links.push(
                <Link key={linkSlug} href={`/height-converter/${linkSlug}`} className="pill-link" style={pill_style}>
                    What is {i} cm in feet?
                </Link>
            )
        }
    }
    return links;
  }

  return (
    <main className="container" style={{ paddingTop: "var(--s-4)", paddingBottom: "var(--s-12)" }}>
      <Script
        id={`schema-height-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaData }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        .glass-row:hover { background: var(--n-surface-hover) !important; }
        .glass-row-alt:hover { background: rgba(59, 130, 246, 0.15) !important; }
        .glass-row-alt2:hover { background: rgba(167, 139, 250, 0.15) !important; }
        .pill-link { transition: all 0.2s ease; }
        .pill-link:hover { transform: translateY(-2px); background: var(--n-surface-hover) !important; border-color: rgba(96, 165, 250, 0.4) !important; color: #3b82f6 !important; }
        .btn-hover-fx:hover { transform: translateY(-2px); }
        .rich-content h2 { padding-bottom: 0.5rem; border-bottom: 2px solid rgba(96, 165, 250, 0.2); margin-top: 3rem; margin-bottom: 1.5rem; }
        .rich-content h3 { color: var(--n-foreground); }
        .rich-content ul { list-style: disc outside; padding-left: 1.5rem !important; margin-bottom: 1rem; }
        .rich-content ol { list-style: decimal outside; padding-left: 1.5rem !important; margin-bottom: 1rem; }
        .rich-content ul li::marker { color: #3b82f6; font-size: 1.2em; }
        .rich-content ol li::marker { color: #8b5cf6; font-weight: bold; }
        .rich-content li { margin-bottom: 0.5rem; }
        .highlight-box { background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 1.25rem 1.5rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.5rem 0; font-size: 1.05rem; }
        sup { vertical-align: super; font-size: smaller; line-height: 0; }
        sub { vertical-align: sub; font-size: smaller; line-height: 0; }
        .shadow-heavy { box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3) !important; }
      `}} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Height Converter", href: "/height-converter" },
          { label: title },
        ]}
      />

      <article style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header style={{ marginBottom: "var(--s-6)", textAlign: "center" }}>
          <h1 className="t-h1" style={{ marginBottom: "var(--s-3)" }}>
            {title}
          </h1>
          <p className="t-body text-muted">
             {type === "imperial" 
                ? `Convert ${ft} feet and ${incFormatted} inches to total inches and the metric system.` 
                : `Convert ${cm} centimeters into US Customary measurements (feet and inches).`}
          </p>
        </header>

        {/* The Component correctly populated via our new props */}
        <section style={{ marginBottom: "var(--s-8)" }}>
          <HeightConverterCore 
             initialCm={cmFormatted}
             initialFt={ft.toString()}
             initialIn={incFormatted}
             defaultMode={type === "imperial" ? "imperial" : "cm"}
             intent={type === "imperial" ? "imperial" : "metric"}
          />
        </section>

        {/* E-E-A-T Author Injection */}
        <div style={{ marginBottom: "var(--s-10)", display: "flex", justifyContent: "center" }}>
          <AuthorBadge categoryKey="convert" />
        </div>

        <section className="rich-content" style={{ marginBottom: "var(--s-8)" }}>
          <h2 className="t-h2">The Math Behind The Conversion</h2>
          
          {type === "imperial" ? (
             <>
               <p>
                 You can convert <strong>{ft} feet and {incFormatted} inches</strong> to inches by following two simple steps. First, convert the feet to inches by multiplying by 12. Then, add that value to the remaining inches.
               </p>
               <pre style={{ background: "var(--n-surface)", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid var(--n-border)", color: "#8b5cf6", fontSize: "1.1rem", fontFamily: "monospace", overflowX: "auto", lineHeight: "1.6" }}>
{`Step 1: Convert feet to inches
${ft} ft × 12 = ${ft * 12} in

Step 2: Add the remaining inches
${ft * 12} in + ${incFormatted} in = ${ft * 12 + inc} in`}
               </pre>
             </>
          ) : (
             <>
               <p>
                 To convert <strong>{cm} centimeters</strong> into feet and inches, we use the standard conversion baseline where <mark>1 inch = 2.54 cm</mark>.
               </p>
               <pre style={{ background: "var(--n-surface)", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid var(--n-border)", color: "#3b82f6", fontSize: "1.1rem", fontFamily: "monospace", overflowX: "auto" }}>
{`inches = ${cm} cm ÷ 2.54
inches = ${Number((cm / 2.54).toFixed(3))}"

feet = ${Number((cm / 2.54).toFixed(3))}" ÷ 12
feet = ${Number((cm / 2.54 / 12).toFixed(3))}' (${ft}' & ${(cm / 2.54 / 12 - ft).toFixed(3)}' remainder)

remaining inches = ${(cm / 2.54 / 12 - ft).toFixed(3)}' × 12
remaining inches ≈ ${incFormatted}"`}
               </pre>
             </>
          )}

          <div className="highlight-box" style={{ marginTop: "var(--s-6)", marginBottom: "var(--s-4)" }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.1rem" }}>
                Conclusion: {type === "imperial" ? `${ft}' ${incFormatted}"` : `${cm} cm`} is exactly equal to <span style={{ color: "#3b82f6" }}>{type === "imperial" ? `${totalInches} total inches.` : `${ft}' ${incFormatted}".`}</span>
              </p>
          </div>
          
          {type === "imperial" && (
            <p className="t-body text-muted" style={{ fontSize: "0.95rem" }}>
              *Note: If you need this height in the metric system, multiplying the total inches by 2.54 reveals that {ft}&apos; {incFormatted}&quot; is equal to <strong>{cmFormatted} centimeters</strong>.
            </p>
          )}
        </section>

        {/* Contextual Reference Chart */}
        <section className="rich-content" style={{ marginBottom: "var(--s-8)" }}>
          <h2 className="t-h2">{type === "imperial" ? `${ft} ft ${incFormatted} in to Inches Conversion Chart` : `${cm} cm to Feet Conversion Chart`}</h2>
          <p>Chart showing the height conversion for {type === "imperial" ? `${ft} ft ${incFormatted} in` : `${cm} cm`} and other close measurements to {type === "imperial" ? "inches and centimeters" : "feet and inches"}.</p>
          <div className="table-responsive shadow-heavy" style={{ margin: "var(--s-6) 0", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "1rem", overflow: "hidden" }}>
             <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--n-foreground)", textAlign: "left" }}>
                 <thead style={{ background: "var(--n-surface-alt)", borderBottom: "1px solid var(--n-border)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <tr>
                       {type === "imperial" ? (
                           <>
                               <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Feet & Inches</th>
                               <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Total Inches</th>
                               <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Centimeters (cm)</th>
                           </>
                       ) : (
                           <>
                               <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Centimeters (cm)</th>
                               <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Total Inches</th>
                               <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Feet & Inches</th>
                           </>
                       )}
                    </tr>
                 </thead>
                 <tbody style={{ fontSize: "1rem" }}>
                    {generateContextualTableRows()}
                 </tbody>
             </table>
          </div>
        </section>

        {/* Similar Conversions Links */}
        <section style={{ marginBottom: "var(--s-8)" }}>
           <h2 className="t-h2" style={{ marginBottom: "var(--s-4)", fontSize: "1.5rem", fontWeight: 600 }}>Similar Height Conversions</h2>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--s-3)" }}>
               {generateSimilarLinks()}
           </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--s-4)", marginTop: "var(--s-10)" }}>
           <Link href="/height-converter" className="btn btn-secondary" style={{ width: "100%", textAlign: "center", padding: "1.25rem" }}>
             ← Back to Main Height Converter Hub
           </Link>
        </div>
      </article>
    </main>
  );
}
