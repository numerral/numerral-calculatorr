const fs = require("fs");
const checks = [
  { f: "app/utility-calculators/[calculator]/page.tsx", ids: ["age-calculator","percentage-calculator","compound-interest-calculator"] },
  { f: "app/tax-calculators/[calculator]/page.tsx", ids: ["gst-calculator","hra-exemption-calculator"] },
  { f: "app/salary-calculators/[calculator]/page.tsx", ids: ["salary-after-tax","in-hand-salary","gratuity-calculator"] },
  { f: "app/loan-calculators/[calculator]/page.tsx", ids: ["apr-to-apy-calculator","daily-compound-interest-calculator","interest-calculator","interest-rate-calc","cd-calculator","extra-payment-calculator"] },
];
checks.forEach(({ f, ids }) => {
  if (!fs.existsSync(f)) { console.log("MISSING:", f); return; }
  const src = fs.readFileSync(f, "utf8");
  ids.forEach(id => {
    const marker = '"' + id + '"';
    const idx = src.indexOf(marker);
    if (idx === -1) { console.log(id + ": NOT in HUB_CONTENT"); return; }
    const block = src.slice(idx, idx + 6000);
    const m = block.match(/contentHTML:\s*`([\s\S]*?)`/) || block.match(/paragraphs:\s*\[([\s\S]*?)\]/);
    const txt = m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
    console.log(id + ": " + txt.length + " chars" + (txt.length < 600 ? " <<THIN" : ""));
    if (txt.length < 600 && txt.length > 0) console.log("  Sample:", txt.slice(0, 120) + "...");
  });
});
