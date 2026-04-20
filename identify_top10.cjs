/**
 * identify_top10.cjs
 * Reads calculators.json and the existing dynamic hub pages to identify:
 * 1. The top-10 calculators by stars (popularity proxy)
 * 2. Which of those have thin contentHTML in their hub pages (<600 chars)
 */
const fs = require("fs");
const path = require("path");

const calcs = JSON.parse(fs.readFileSync("data/calculators.json", "utf8"));

// Flatten all calculators and sort by stars desc
const all = Object.entries(calcs).flatMap(([cat, items]) =>
  (Array.isArray(items) ? items : []).map(c => ({ ...c, _cat: cat }))
);
all.sort((a, b) => (b.stars || 0) - (a.stars || 0));

// Category → page file mapping
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
  cooking:      "app/cooking-calculators/[calculator]/page.tsx",
  engine:       "app/automotive-calculators/engine-performance/[calculator]/page.tsx",
  fuel:         "app/automotive-calculators/fuel-economy/[calculator]/page.tsx",
  wheels:       "app/automotive-calculators/wheels-tires/[calculator]/page.tsx",
};

// Cache page sources
const pageCache = {};
function getPageSrc(cat) {
  if (!pageCache[cat]) {
    const f = CAT_PAGE[cat];
    pageCache[cat] = f && fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
  }
  return pageCache[cat];
}

// Check if a calculator slug has rich content in its hub page
function getRichContentLength(cat, slug, id) {
  const src = getPageSrc(cat);
  if (!src) return "N/A (no page)";
  // Look for the calculator's entry in HUB_CONTENT
  const idKey = `"${id}"`;
  const slugKey = `"${slug}"`;
  const idxId = src.indexOf(idKey);
  const idxSlug = src.indexOf(slugKey);
  const start = Math.min(
    idxId > -1 ? idxId : Infinity,
    idxSlug > -1 ? idxSlug : Infinity
  );
  if (start === Infinity) return 0;
  // Find the content block - look for contentHTML or explanation
  const block = src.slice(start, start + 3000);
  const htmlMatch = block.match(/contentHTML:\s*`([\s\S]*?)`/);
  const paragraphMatch = block.match(/paragraphs:\s*\[([\s\S]*?)\]/);
  if (htmlMatch) return htmlMatch[1].replace(/<[^>]+>/g, "").length;
  if (paragraphMatch) return paragraphMatch[1].replace(/['"]/g, "").length;
  return 0;
}

console.log("\n╔══════ TOP CALCULATORS BY STARS ══════╗\n");
console.log("Rank  Stars  Slug".padEnd(60) + "Category".padEnd(20) + "Content chars");
console.log("─".repeat(100));

const top = all.slice(0, 30); // look at top 30 to identify true top-10 with thin content
const thin = []; // calculators with < 600 chars content

top.forEach((c, i) => {
  const contentLen = getRichContentLength(c._cat, c.slug, c.id);
  const flag = typeof contentLen === "number" && contentLen < 600 ? " ⚠️ THIN" : "";
  const rank = `${i + 1}.`.padEnd(6);
  const stars = `★${c.stars || 0}`.padEnd(7);
  const slug = (c.slug || c.id || "?").padEnd(52);
  const cat = (c._cat || "").padEnd(20);
  const chars = typeof contentLen === "number" ? contentLen.toLocaleString() : contentLen;
  console.log(`${rank}${stars}${slug}${cat}${chars}${flag}`);
  if (typeof contentLen === "number" && contentLen < 600) {
    thin.push({ rank: i + 1, cat: c._cat, slug: c.slug, id: c.id, stars: c.stars, title: c.title });
  }
});

console.log(`\n\n╔══════ THIN CONTENT TARGETS (< 600 chars) ══════╗\n`);
if (thin.length === 0) {
  console.log("  All top-30 calculators have 600+ chars of content!");
} else {
  thin.forEach(t => {
    console.log(`  #${t.rank} ★${t.stars} [${t.cat}] ${t.slug} — "${t.title}"`);
  });
  console.log(`\n  Total thin: ${thin.length} calculators need content expansion`);
}
