// Height Converter Hub Page
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import AuthorBadge from "@/components/shared/AuthorBadge";
import HeightConverterCore from "@/components/calculator/HeightConverterCore";
import { canonicalUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Height Converter: Feet, Inches & Centimeters",
  description:
    "Free interactive height converter. Instantly convert between feet, inches, and centimeters. Includes metric to US Customary mappings for BMI, driver's licenses, passports, and medical forms.",
  alternates: { canonical: canonicalUrl("/height-converter") },
  openGraph: {
    title: "Height Converter: Feet, Inches & Centimeters",
    description: "Instantly convert human height between feet, inches, and metric centimeters accurately.",
    url: canonicalUrl("/height-converter"),
    siteName: "Numerral",
    images: [{ url: `${SITE_URL}/images/calculators/height-converter-og.png`, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Height Converter",
    description: "Instantly convert human height between feet, inches, and metric centimeters.",
    images: [`${SITE_URL}/images/calculators/height-converter-og.png`],
  },
};

export default function HeightConverterPage() {
  const faqs = [
    {
      question: "How do I format my height for a US Driver's License or Passport?",
      answer:
        "In the United States, official documents like driver's licenses and passports require your height formatted in feet and inches (e.g., 5' 8\"). If you only know your height in centimeters (e.g., 173 cm), you can use our converter to find the US Customary equivalent.",
    },
    {
      question: "Is BMI calculated using inches or centimeters?",
      answer:
        "Medical records and Body Mass Index (BMI) calculations frequently utilize the metric system (centimeters and kilograms) because it provides more precise scientific baselines. However, in the US, consumer-facing health portals will usually convert your BMI metrics back into feet, inches, and pounds for readability.",
    },
    {
      question: "How are military (MEPS) heights measured in the US?",
      answer:
        "The United States MEPS (Military Entrance Processing Station) typically documents height strictly in total inches (e.g., 68 inches rather than 5' 8\"). You must meet specific height-to-weight ratio restrictions to serve.",
    },
    {
      question: "What is 5 foot 9 inches in centimeters?",
      answer: "5 feet 9 inches is equal to exactly 175.26 centimeters.",
    },
    {
      question: "What is 170 cm in feet and inches?",
      answer: "170 centimeters translates roughly to 5 feet and 6.93 inches (often rounded up to 5' 7\").",
    }
  ];

  const schemaData = JSON.stringify([
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Height Converter" },
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Height Converter",
      applicationCategory: "UtilityApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ]);

  return (
    <main className="container" style={{ paddingTop: "var(--s-4)", paddingBottom: "var(--s-12)" }}>
      <Script
        id="schema-height-converter"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaData }}
      />

      
      <style dangerouslySetInnerHTML={{__html: `
        .glass-row:hover { background: var(--n-surface-hover) !important; }
        .glass-row-alt:hover { background: rgba(59, 130, 246, 0.15) !important; }
        .glass-row-alt2:hover { background: rgba(167, 139, 250, 0.15) !important; }
        .pill-link { transition: all 0.2s ease; }
        .pill-link:hover { transform: translateY(-2px); background: var(--n-surface-hover) !important; border-color: rgba(96, 165, 250, 0.4) !important; }
        .pill-link-alt:hover { transform: translateY(-2px); background: var(--n-surface-hover) !important; border-color: rgba(167, 139, 250, 0.4) !important; }
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
          { label: "Height Converter" },
        ]}
      />

      <article>
        <header style={{ marginBottom: "var(--s-8)", textAlign: "center" }}>
          <h1 className="t-h1" style={{ marginBottom: "var(--s-3)" }}>
            Height Converter: Feet, Inches & CM
          </h1>
          <p className="t-body text-muted" style={{ maxWidth: "800px", margin: "0 auto" }}>
            Instantly convert human height between the US Customary system (feet and inches) and the Metric system (centimeters). Ideal for measuring BMI, filling out DMV paperwork, calculating MEPS compliance, or tracking personal fitness.
          </p>
        </header>

        <section style={{ marginBottom: "var(--s-8)" }}>
          <HeightConverterCore />
        </section>

        <div style={{ marginBottom: "var(--s-10)", display: "flex", justifyContent: "center" }}>
          <AuthorBadge categoryKey="convert" />
        </div>

        <section className="rich-content" style={{ maxWidth: "800px", margin: "0 auto var(--s-12)" }}>
          <h2 className="t-h2">How to Convert Feet & Inches to Centimeters</h2>
          <p>
            To convert a height value from feet and inches to centimeters, follow a few easy steps. The mathematics rely on a simple standard:
          </p>
          
          <div className="highlight-box">
             <strong>Baseline Rule:</strong> 1 inch equals precisely <strong>2.54 centimeters</strong>.
          </div>
          <ul style={{ paddingLeft: "var(--s-6)", marginBottom: "var(--s-4)" }}>
            <li>Convert feet to inches by multiplying by 12.</li>
            <li>Add the inch value to the converted feet to get the total height in inches.</li>
            <li>Multiply the total height in inches by <strong>2.54</strong> to get the height in centimeters.</li>
          </ul>
          <p>For example, let&apos;s convert a height of 5&apos; 8&quot; to centimeters following the steps above:</p>
          <pre style={{ background: "var(--n-surface)", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid var(--n-border)", color: "#8b5cf6", fontSize: "1.1rem", fontFamily: "monospace", overflowX: "auto" }}>
{`inches = (5' × 12) + 8"
inches = 60" + 8"
inches = 68"
centimeters = 68" × 2.54
centimeters = 172.72 cm`}
          </pre>
          <p style={{ marginTop: "var(--s-4)", marginBottom: "var(--s-8)" }}>
            Thus, a height of 5&apos; 8&quot; is equal to exactly <strong>172.72 centimeters</strong>.
          </p>

          <h2 className="t-h2" style={{ marginTop: "var(--s-8)" }}>How to Convert Centimeters to Inches</h2>
          <p>
            The process to convert a height from centimeters back to feet and inches is essentially the reverse of the steps above.
          </p>
          <ul style={{ paddingLeft: "var(--s-6)", marginBottom: "var(--s-4)" }}>
            <li>Divide the height in centimeters by <strong>2.54</strong> to convert to inches.</li>
            <li>Divide the inches by <strong>12</strong> to find the number of feet. Take the whole number as the number of feet and note the remainder.</li>
            <li>Multiply the decimal remainder by 12 to find the remaining inches.</li>
          </ul>
          <p>For example, let&apos;s convert a height of 165 cm to feet and inches using these steps:</p>
          <pre style={{ background: "var(--n-surface)", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid var(--n-border)", color: "#3b82f6", fontSize: "1.1rem", fontFamily: "monospace", overflowX: "auto" }}>
{`inches = 165 cm ÷ 2.54
inches = 64.96"

feet = 64.96" ÷ 12
feet = 5.413' (5' & .413' remainder)

remaining inches = 0.413' × 12
remaining inches ≈ 5"`}
          </pre>
          <p style={{ marginTop: "var(--s-4)", marginBottom: "var(--s-8)" }}>
            So, a height of 165 cm is roughly equal to <strong>5&apos; 5&quot;</strong>.
          </p>

          <h2 className="t-h2" style={{ marginTop: "var(--s-8)" }}>Interactive Height Conversion Chart</h2>
          <p>
            A quick reference for the most common male and female baseline heights searched in the United States:
          </p>
          <div className="table-responsive shadow-heavy" style={{ margin: "var(--s-6) 0", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "1rem", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--n-foreground)", textAlign: "left" }}>
              <thead style={{ background: "var(--n-surface-alt)", borderBottom: "1px solid var(--n-border)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <tr>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Feet & Inches</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Total Inches</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 600 }}>Centimeters (cm)</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "1rem" }}>
                <tr className="glass-row" style={{ borderBottom: "1px solid var(--n-border)", transition: "background 0.2s" }} >
                  <td style={{ padding: "1rem" }}>5' 0"</td><td style={{ padding: "1rem" }}>60 in</td><td style={{ padding: "1rem", color: "#3b82f6", fontWeight: 500 }}>152.4 cm</td>
                </tr>
                <tr className="glass-row" style={{ borderBottom: "1px solid var(--n-border)", transition: "background 0.2s" }} >
                  <td style={{ padding: "1rem" }}>5' 2"</td><td style={{ padding: "1rem" }}>62 in</td><td style={{ padding: "1rem", color: "#3b82f6", fontWeight: 500 }}>157.48 cm</td>
                </tr>
                <tr className="glass-row-alt" style={{ borderBottom: "1px solid var(--n-border)", background: "rgba(59, 130, 246, 0.05)" }} >
                  <td style={{ padding: "1rem" }}>5' 4" <span style={{ fontSize: "0.75rem", background: "rgba(59,130,246,0.15)", padding: "0.2rem 0.5rem", borderRadius: "1rem", marginLeft: "0.5rem" }}>Avg US Female</span></td><td style={{ padding: "1rem" }}>64 in</td><td style={{ padding: "1rem", color: "#3b82f6", fontWeight: 500 }}>162.56 cm</td>
                </tr>
                <tr className="glass-row" style={{ borderBottom: "1px solid var(--n-border)", transition: "background 0.2s" }} >
                  <td style={{ padding: "1rem" }}>5' 6"</td><td style={{ padding: "1rem" }}>66 in</td><td style={{ padding: "1rem", color: "#3b82f6", fontWeight: 500 }}>167.64 cm</td>
                </tr>
                <tr className="glass-row-alt2" style={{ borderBottom: "1px solid var(--n-border)", background: "rgba(167, 139, 250, 0.05)" }} >
                  <td style={{ padding: "1rem" }}>5' 9" <span style={{ fontSize: "0.75rem", background: "rgba(167,139,250,0.15)", padding: "0.2rem 0.5rem", borderRadius: "1rem", marginLeft: "0.5rem" }}>Avg US Male</span></td><td style={{ padding: "1rem" }}>69 in</td><td style={{ padding: "1rem", color: "#8b5cf6", fontWeight: 500 }}>175.26 cm</td>
                </tr>
                <tr className="glass-row" style={{ borderBottom: "1px solid var(--n-border)", transition: "background 0.2s" }} >
                  <td style={{ padding: "1rem" }}>6' 0"</td><td style={{ padding: "1rem" }}>72 in</td><td style={{ padding: "1rem", color: "#8b5cf6", fontWeight: 500 }}>182.88 cm</td>
                </tr>
                <tr className="glass-row" style={{ transition: "background 0.2s" }} >
                  <td style={{ padding: "1rem" }}>6' 2"</td><td style={{ padding: "1rem" }}>74 in</td><td style={{ padding: "1rem", color: "#8b5cf6", fontWeight: 500 }}>187.96 cm</td>
                </tr>
              </tbody>
            </table>
          </div>



          <h2 className="t-h2" style={{ marginTop: "var(--s-8)" }}>Common Reasons for Converting Height in the USA</h2>
          <p>
            Unlike most of the world which exclusively utilizes the metric system, the US operates on a hybrid system. It is very common to need a height converter for:
          </p>
          <ul style={{ paddingLeft: "var(--s-6)", marginBottom: "var(--s-4)" }}>
            <li><strong>Driver&apos;s License & Identification:</strong> All State Department passports and DMV forms mandate imperial formatting.</li>
            <li><strong>Medical and BMI Assessments:</strong> Doctors measure patients utilizing Stadiometers which frequently log directly into an EHR (Electronic Health Record) system in Centimeters to ensure universally standardized data. Tracking your Body Mass Index usually requires knowing your metric height.</li>
            <li><strong>Athletics:</strong> Comparing personal heights against combine stats for the NFL or NBA tracking profiles.</li>
          </ul>
        </section>

        <section style={{ maxWidth: "800px", margin: "0 auto var(--s-12)" }}>
          <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>Popular Height Conversions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
              {[
                  "5ft-0in", "5ft-2in", "5ft-4in", "5ft-5in", "5ft-7in", "5ft-8in", "5ft-9in", "5ft-11in", "6ft-0in", "6ft-2in"
              ].map(slug => (
                  <Link 
                     key={slug} 
                     href={`/height-converter/${slug}-to-inches`} 
                     className="pill-link"
                     style={{ 
                         padding: "0.85rem 1rem", 
                         background: "var(--n-surface)", 
                         borderRadius: "0.75rem", 
                         border: "1px solid var(--n-border)", 
                         textDecoration: "none", 
                         color: "#3b82f6", 
                         fontWeight: "600", 
                         textAlign: "center",
                         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                     }}
                  >
                      {slug.replace("ft", "'").replace("-", " ").replace("in", '"')} to inches
                  </Link>
              ))}
              {[
                  "150cm", "155cm", "160cm", "165cm", "170cm", "175cm", "180cm", "185cm", "190cm"
              ].map(slug => (
                  <Link 
                     key={slug} 
                     href={`/height-converter/${slug}-to-feet`} 
                     className="pill-link pill-link-alt"
                     style={{ 
                         padding: "0.85rem 1rem", 
                         background: "var(--n-surface)", 
                         borderRadius: "0.75rem", 
                         border: "1px solid var(--n-border)", 
                         textDecoration: "none", 
                         color: "#8b5cf6", 
                         fontWeight: "600", 
                         textAlign: "center",
                         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                     }}
                  >
                      {slug} to feet
                  </Link>
              ))}
          </div>
          <p className="t-body-sm text-muted" style={{ textAlign: "center", marginBottom: "var(--s-12)" }}>
              Not seeing the precise height you need? Use our instant calculator tool above for any custom input!
          </p>

          <FAQAccordion title="Frequently Asked Questions" items={faqs} />
        </section>
        
      </article>
    </main>
  );
}
