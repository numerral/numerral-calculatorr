/**
 * content_audit.cjs — Identify top calculators with thin content
 */
const fs = require("fs");

const calcs = JSON.parse(fs.readFileSync("data/calculators.json", "utf8"));

const CAT_PAGE = {
  loan:         "app/loan-calculators/[calculator]/page.tsx",
  invest:       "app/investment-calculators/[calculator]/page.tsx",
  tax:          "app/tax-calculators/[calculator]/page.tsx",
  salary:       "app/salary-calculators/[calculator]/page.tsx",
  utility:      "app/utility-calculators/[calculator]/page.tsx",
  construction: "app/construction-calculators/[calculator]/page.tsx",
  ev:           "app/ev-calculators/[calculator]/page.tsx",
  health:       "app/health-calculators/[calculator]/page.tsx",
  math:         "app/math-calculators/[calculator]/page.tsx",
  pet:          "app/pet-calculators/[calculator]/page.tsx",
  time:         "app/time-calculators/[calculator]/page.tsx",
  vehicle:      "app/vehicle-loan-calculators/[calculator]/page.tsx",
  physics:      "app/physics-calculators/[calculator]/page.tsx",
  chemistry:    "app/chemistry-calculators/[calculator]/page.tsx",
  density:      "app/density-calculators/[calculator]/page.tsx",
  electrical:   "app/electrical-calculators/[calculator]/page.tsx",
  business:     "app/business-calculators/[calculator]/page.tsx",
};

const pageCache = {};
function getSrc(cat) {
  if (!pageCache[cat]) {
    const f = CAT_PAGE[cat];
    pageCache[cat] = (f && fs.existsSync(f)) ? fs.readFileSync(f, "utf8") : "";
  }
  return pageCache[cat];
}

function getContentLen(cat, slug, id) {
  const src = getSrc(cat);
  if (!src) return -1;
  const keys = [id, slug].filter(Boolean);
  for (const k of keys) {
    const marker = '"' + k + '"';
    const idx = src.indexOf(marker);
    if (idx === -1) continue;
    const block = src.slice(idx, idx + 8000);
    const m1 = block.match(/contentHTML:\s*`([\s\S]*?)`/);
    const m2 = block.match(/paragraphs:\s*\[([\s\S]*?)\]/);
    const m = m1 || m2;
    if (m) return m[1].replace(/<[^>]+>/g, "").trim().length;
  }
  return 0;
}

// Sort by stars, take top 40
const sorted = calcs
  .filter(c => c.stars >= 4)
  .sort((a, b) => (b.stars || 0) - (a.stars || 0))
  .slice(0, 40);

console.log("\nRank Stars  Category      Slug                                       Content  Status");
console.log("─".repeat(110));

const thin = [];
sorted.forEach((c, i) => {
  const len = getContentLen(c.category, c.slug, c.id);
  const status = len < 600 ? "⚠️  THIN" : len < 1200 ? "📝 OK" : "✅ RICH";
  const rank = (i + 1 + ".").padEnd(6);
  const stars = ("★" + c.stars).padEnd(7);
  const cat = (c.category || "").padEnd(14);
  const slug = (c.slug || c.id || "").padEnd(43);
  const chars = (len >= 0 ? len.toString() : "N/A").padEnd(9);
  console.log(`${rank}${stars}${cat}${slug}${chars}${status}`);
  if (len < 600) thin.push({ rank: i + 1, stars: c.stars, cat: c.category, slug: c.slug, id: c.id, title: c.title, len });
});

console.log("\n\n╔══ THIN CONTENT PRIORITY LIST (top candidates for 600+ word expansion) ══╗");
thin.slice(0, 10).forEach((t, i) => {
  console.log(`  ${i + 1}. [${t.cat}] ${t.slug} — "${t.title}" (${t.len} chars)`);
});
console.log(`\n  Total thin in top-40: ${thin.length}`);
