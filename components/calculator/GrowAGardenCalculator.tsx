"use client";
import { useState, useMemo } from "react";
import {
  PLANTS, MUTATIONS, PETS, PLANT_CATEGORIES, MUTATION_TIER_COLORS,
  calcMutationMultiplier, calcPlantValue, calcWeightFromValue, formatValue,
  type Plant, type Mutation, type Pet,
} from "@/lib/gagData";

// ─── Tab Definitions ───
const TABS = [
  { id: "crop", label: "🌱 Crop Value", short: "Crops" },
  { id: "petxp", label: "🐾 Pet XP", short: "Pet XP" },
  { id: "hatch", label: "🥚 Egg Hatch", short: "Hatch" },
  { id: "petweight", label: "⚖️ Pet Weight", short: "Weight" },
  { id: "petability", label: "🐉 Pet Ability", short: "Ability" },
  { id: "mutations", label: "📊 Mutation Guide", short: "Mutations" },
  { id: "profit", label: "💰 Profit Calc", short: "Profit" },
] as const;
type TabId = typeof TABS[number]["id"];

// ─── Inline styles (gamer accent) ───
const S = {
  neon: { color: "#22ff55" },
  neonBig: { color: "#22ff55", fontSize: "var(--t-h1)", fontWeight: 800 as const, fontFamily: "monospace", letterSpacing: "-1px" },
  tabBar: { display: "flex", gap: "var(--s-2)", flexWrap: "wrap" as const, marginBottom: "var(--s-4)" },
  tab: (active: boolean) => ({ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-md)", border: active ? "2px solid #22ff55" : "1px solid var(--n-border)", background: active ? "rgba(34,255,85,0.1)" : "var(--n-surface)", color: active ? "#22ff55" : "var(--n-text)", fontWeight: active ? 700 : 400, cursor: "pointer", fontSize: "var(--t-body-sm)", whiteSpace: "nowrap" as const } as const),
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "var(--s-2)" },
  plantBtn: (sel: boolean) => ({ padding: "var(--s-2)", borderRadius: "var(--r-md)", border: sel ? "2px solid #22ff55" : "1px solid var(--n-border)", background: sel ? "rgba(34,255,85,0.08)" : "var(--n-surface)", cursor: "pointer", textAlign: "center" as const, fontSize: "var(--t-body-sm)", transition: "all 0.15s" }),
  mutBtn: (sel: boolean, color: string) => ({ padding: "var(--s-1) var(--s-2)", borderRadius: "var(--r-sm)", border: sel ? `2px solid ${color}` : "1px solid var(--n-border)", background: sel ? `${color}18` : "var(--n-surface)", cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap" as const, transition: "all 0.15s" }),
  card: { padding: "var(--s-4)", borderRadius: "var(--r-lg)", background: "var(--n-surface-alt)", marginTop: "var(--s-4)" },
  row: { display: "flex", gap: "var(--s-3)", flexWrap: "wrap" as const, alignItems: "center" as const },
};

// ─── Tab 1: Crop Value Calculator ───
function CropValueCalc() {
  const [category, setCategory] = useState("seed-shop");
  const [search, setSearch] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(PLANTS[0]);
  const [selectedMuts, setSelectedMuts] = useState<Set<string>>(new Set());
  const [weight, setWeight] = useState(10);
  const [amount, setAmount] = useState(1);
  const [reverseMode, setReverseMode] = useState(false);
  const [targetValue, setTargetValue] = useState(1000000);
  const [plantList, setPlantList] = useState<{ plant: Plant; value: number }[]>([]);

  const filteredPlants = useMemo(() => {
    let list = PLANTS.filter((p) => p.category === category);
    if (search) list = PLANTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [category, search]);

  const activeMuts = useMemo(() => MUTATIONS.filter((m) => selectedMuts.has(m.id)), [selectedMuts]);
  const mutMult = calcMutationMultiplier(activeMuts);

  const value = selectedPlant ? calcPlantValue(selectedPlant.baseValue, weight, amount, mutMult) : 0;
  const reverseWeight = selectedPlant ? calcWeightFromValue(selectedPlant.baseValue, targetValue, mutMult) : 0;

  const toggleMut = (id: string) => {
    setSelectedMuts((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const addToList = () => {
    if (selectedPlant) setPlantList((prev) => [...prev, { plant: selectedPlant, value }]);
  };

  const mutsByTier = useMemo(() => {
    const tiers = ["common", "uncommon", "rare", "legendary", "mythic"] as const;
    return tiers.map((t) => ({ tier: t, muts: MUTATIONS.filter((m) => m.tier === t) }));
  }, []);

  return (
    <div>
      {/* Category Tabs */}
      <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
        <label className="calc-field__label">🛒 CATEGORY</label>
        <div style={{ display: "flex", gap: "var(--s-1)", flexWrap: "wrap" }}>
          {Object.entries(PLANT_CATEGORIES).map(([key, label]) => (
            <button key={key} onClick={() => { setCategory(key); setSearch(""); }} style={S.tab(category === key && !search)}>{label}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="calc-field" style={{ marginBottom: "var(--s-3)" }}>
        <input type="text" className="calc-field__input" placeholder="🔍 Search for a plant..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} />
      </div>

      {/* Plant Grid */}
      <div style={S.grid}>
        {filteredPlants.map((p) => (
          <button key={p.id} onClick={() => setSelectedPlant(p)} style={S.plantBtn(selectedPlant?.id === p.id)}>
            <div style={{ fontSize: "24px" }}>{p.emoji}</div>
            <div style={{ fontSize: "11px", marginTop: "2px" }}>{p.name}</div>
            <div style={{ fontSize: "10px", color: "var(--n-text-muted)" }}>{p.baseValue.toLocaleString()}¢</div>
          </button>
        ))}
      </div>

      {/* Mutations */}
      <div className="calc-field" style={{ marginTop: "var(--s-4)" }}>
        <label className="calc-field__label">⚡ MUTATIONS ({selectedMuts.size} selected → {mutMult.toLocaleString()}x total)</label>
        {mutsByTier.map(({ tier, muts }) => (
          <div key={tier} style={{ marginBottom: "var(--s-2)" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: MUTATION_TIER_COLORS[tier], textTransform: "uppercase", marginBottom: "var(--s-1)" }}>
              {tier} ({muts.length})
            </p>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {muts.map((m) => (
                <button key={m.id} onClick={() => toggleMut(m.id)} style={S.mutBtn(selectedMuts.has(m.id), MUTATION_TIER_COLORS[tier])}>
                  {m.emoji} {m.name} {m.multiplier}x
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Weight & Amount */}
      <div style={{ ...S.row, marginTop: "var(--s-4)" }}>
        <div className="calc-field" style={{ flex: 1 }}>
          <label className="calc-field__label">{reverseMode ? "💲 TARGET VALUE" : "⚖️ WEIGHT (kg)"}</label>
          {reverseMode ? (
            <input type="number" className="calc-field__input" value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))} style={{ width: "100%" }} />
          ) : (
            <input type="number" className="calc-field__input" min={0.1} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} style={{ width: "100%" }} />
          )}
        </div>
        {!reverseMode && (
          <div className="calc-field" style={{ flex: 1 }}>
            <label className="calc-field__label">📦 AMOUNT</label>
            <input type="number" className="calc-field__input" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
        )}
      </div>

      {/* Result */}
      <div style={S.card}>
        {selectedPlant && (
          <div>
            <p style={{ marginBottom: "var(--s-2)", fontSize: "var(--t-body)" }}>
              {activeMuts.map((m) => <span key={m.id} style={{ color: MUTATION_TIER_COLORS[m.tier], fontWeight: 700 }}>{m.name} </span>)}
              <strong>{selectedPlant.name}</strong> {reverseMode ? "" : `${weight}kg`} would {reverseMode ? "need" : "cost around"}:
            </p>
            {reverseMode ? (
              <p style={S.neonBig}>≈ {reverseWeight.toFixed(2)} kg</p>
            ) : (
              <p style={S.neonBig}>≈ ¢{value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({formatValue(value)})</p>
            )}
            <div style={{ ...S.row, marginTop: "var(--s-3)" }}>
              <button onClick={addToList} style={{ ...S.tab(false), background: "#22ff5520", color: "#22ff55", border: "1px solid #22ff55" }}>
                ➕ Add Plant to List
              </button>
              <button onClick={() => setReverseMode(!reverseMode)} style={S.tab(reverseMode)}>
                🔄 {reverseMode ? "Switch to Weight → Value" : "Toggle Value → Weight"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Multi-plant list */}
      {plantList.length > 0 && (
        <div style={S.card}>
          <label className="calc-field__label">📋 PLANT VALUE LIST</label>
          {plantList.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "var(--s-1) 0", borderBottom: "1px solid var(--n-border)" }}>
              <span>{item.plant.emoji} {item.plant.name}</span>
              <span style={S.neon}>¢{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--s-2)", fontWeight: 700 }}>
            <span>TOTAL ({plantList.length} plants)</span>
            <span style={S.neonBig}>¢{plantList.reduce((a, b) => a + b.value, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <button onClick={() => setPlantList([])} style={{ ...S.tab(false), marginTop: "var(--s-2)", color: "#ef4444", border: "1px solid #ef4444" }}>🗑️ Clear List</button>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Pet XP Calculator ───
function PetXPCalc() {
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState<Pet>(PETS[0]);
  const [currentXP, setCurrentXP] = useState(0);
  const [targetXP, setTargetXP] = useState(1000);

  const filtered = useMemo(() => search ? PETS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : PETS, [search]);
  const xpNeeded = Math.max(0, targetXP - currentXP);
  const actionsNeeded = selectedPet.baseXpRate > 0 ? Math.ceil(xpNeeded / selectedPet.baseXpRate) : 0;

  return (
    <div>
      <div className="calc-field"><input type="text" className="calc-field__input" placeholder="🔍 Search for a pet..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} /></div>
      <div style={{ ...S.grid, marginTop: "var(--s-3)" }}>
        {filtered.slice(0, 20).map((p) => (
          <button key={p.id} onClick={() => setSelectedPet(p)} style={S.plantBtn(selectedPet.id === p.id)}>
            <div style={{ fontSize: "24px" }}>{p.emoji}</div>
            <div style={{ fontSize: "11px" }}>{p.name}</div>
          </button>
        ))}
      </div>
      <div style={{ ...S.row, marginTop: "var(--s-4)" }}>
        <div className="calc-field" style={{ flex: 1 }}>
          <label className="calc-field__label">CURRENT XP</label>
          <input type="number" className="calc-field__input" min={0} value={currentXP} onChange={(e) => setCurrentXP(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
        <div className="calc-field" style={{ flex: 1 }}>
          <label className="calc-field__label">TARGET XP</label>
          <input type="number" className="calc-field__input" min={0} value={targetXP} onChange={(e) => setTargetXP(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      </div>
      <div style={S.card}>
        <p className="calc-field__label">SELECTED: {selectedPet.emoji} {selectedPet.name}</p>
        <p style={{ fontSize: "var(--t-body)", marginBottom: "var(--s-2)" }}>XP per action: <strong>{selectedPet.baseXpRate}</strong></p>
        <p style={S.neonBig}>{actionsNeeded.toLocaleString()} actions needed</p>
        <p style={{ color: "var(--n-text-muted)", fontSize: "var(--t-body-sm)", marginTop: "var(--s-1)" }}>({xpNeeded.toLocaleString()} XP remaining)</p>
      </div>
    </div>
  );
}

// ─── Tab 3: Egg Hatch Speed Calculator ───
function EggHatchCalc() {
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState<Pet>(PETS[0]);
  const [hasBoost, setHasBoost] = useState(false);
  const boostMultiplier = hasBoost ? 0.5 : 1;
  const hatchTime = selectedPet.hatchTimeMin * boostMultiplier;
  const filtered = useMemo(() => search ? PETS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : PETS, [search]);

  return (
    <div>
      <div className="calc-field"><input type="text" className="calc-field__input" placeholder="🔍 Search for a pet egg..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} /></div>
      <div style={{ ...S.grid, marginTop: "var(--s-3)" }}>
        {filtered.slice(0, 20).map((p) => (
          <button key={p.id} onClick={() => setSelectedPet(p)} style={S.plantBtn(selectedPet.id === p.id)}>
            <div style={{ fontSize: "24px" }}>{p.emoji}</div>
            <div style={{ fontSize: "11px" }}>{p.name}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: "var(--s-3)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", cursor: "pointer" }}>
          <input type="checkbox" checked={hasBoost} onChange={(e) => setHasBoost(e.target.checked)} />
          <span>⚡ Speed Boost Active (2x faster)</span>
        </label>
      </div>
      <div style={S.card}>
        <p className="calc-field__label">{selectedPet.emoji} {selectedPet.name} EGG</p>
        <p style={S.neonBig}>{hatchTime.toFixed(1)} minutes</p>
        <p style={{ color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>
          Base: {selectedPet.hatchTimeMin} min {hasBoost ? `→ Boosted: ${hatchTime.toFixed(1)} min` : ""}
        </p>
      </div>
      <div style={{ marginTop: "var(--s-4)" }}>
        <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Egg Hatch Speed Reference</h3>
        <table className="calc-table">
          <thead><tr><th>Pet</th><th>Base Time</th><th>With Boost</th></tr></thead>
          <tbody>
            {PETS.sort((a, b) => a.hatchTimeMin - b.hatchTimeMin).slice(0, 15).map((p) => (
              <tr key={p.id} style={p.id === selectedPet.id ? { background: "rgba(34,255,85,0.1)" } : {}}>
                <td>{p.emoji} {p.name}</td><td>{p.hatchTimeMin} min</td><td>{(p.hatchTimeMin * 0.5).toFixed(1)} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 4: Pet Weight by Age ───
function PetWeightCalc() {
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState<Pet>(PETS[0]);
  const [age, setAge] = useState(1);
  const filtered = useMemo(() => search ? PETS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : PETS, [search]);

  // Simplified growth model: weight = 1.0 + ln(age + 1) * growthFactor
  const growthFactor = selectedPet.baseXpRate / 15;
  const weight = 1.0 + Math.log(age + 1) * growthFactor;
  const ages = [1, 2, 3, 5, 7, 10, 14, 21, 30, 60, 90, 180, 365];

  return (
    <div>
      <div className="calc-field"><input type="text" className="calc-field__input" placeholder="🔍 Search for a pet..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} /></div>
      <div style={{ ...S.grid, marginTop: "var(--s-3)" }}>
        {filtered.slice(0, 20).map((p) => (
          <button key={p.id} onClick={() => setSelectedPet(p)} style={S.plantBtn(selectedPet.id === p.id)}>
            <div style={{ fontSize: "24px" }}>{p.emoji}</div>
            <div style={{ fontSize: "11px" }}>{p.name}</div>
          </button>
        ))}
      </div>
      <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
        <label className="calc-field__label">📅 AGE (days)</label>
        <input type="range" className="calc-field__slider" min={1} max={365} value={age} onChange={(e) => setAge(Number(e.target.value))} />
        <input type="number" className="calc-field__input" min={1} value={age} onChange={(e) => setAge(Number(e.target.value))} style={{ width: "120px" }} />
      </div>
      <div style={S.card}>
        <p className="calc-field__label">{selectedPet.emoji} {selectedPet.name} — {age} Day{age !== 1 ? "s" : ""} Old</p>
        <p style={S.neonBig}>≈ {weight.toFixed(2)} kg</p>
      </div>
      <div style={{ marginTop: "var(--s-4)" }}>
        <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>Weight by Age — {selectedPet.name}</h3>
        <table className="calc-table">
          <thead><tr><th>Age</th><th>Est. Weight</th></tr></thead>
          <tbody>
            {ages.map((a) => (
              <tr key={a} style={a === age ? { background: "rgba(34,255,85,0.1)" } : {}}>
                <td>{a} day{a !== 1 ? "s" : ""}</td>
                <td>{(1.0 + Math.log(a + 1) * growthFactor).toFixed(2)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 5: Pet Ability Calculator ───
function PetAbilityCalc() {
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState<Pet>(PETS.find((p) => p.mutationGranted) || PETS[0]);
  const filtered = useMemo(() => {
    let list = PETS.filter((p) => p.mutationGranted);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.mutationGranted || "").toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [search]);

  return (
    <div>
      <div className="calc-field"><input type="text" className="calc-field__input" placeholder="🔍 Search pet or mutation name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} /></div>
      <div style={{ ...S.grid, marginTop: "var(--s-3)" }}>
        {filtered.map((p) => (
          <button key={p.id} onClick={() => setSelectedPet(p)} style={S.plantBtn(selectedPet.id === p.id)}>
            <div style={{ fontSize: "24px" }}>{p.emoji}</div>
            <div style={{ fontSize: "11px" }}>{p.name}</div>
            <div style={{ fontSize: "10px", color: "#22ff55" }}>{p.mutationMultiplier}x</div>
          </button>
        ))}
      </div>
      <div style={S.card}>
        <p className="calc-field__label">SELECTED PET</p>
        <p style={{ fontSize: "var(--t-h2)", fontWeight: 700, marginBottom: "var(--s-2)" }}>{selectedPet.emoji} {selectedPet.name}</p>
        <p style={{ marginBottom: "var(--s-2)" }}><strong>Ability:</strong> {selectedPet.ability}</p>
        {selectedPet.mutationGranted && (
          <div style={{ padding: "var(--s-3)", borderRadius: "var(--r-md)", background: "rgba(34,255,85,0.08)", border: "1px solid rgba(34,255,85,0.3)" }}>
            <p style={{ fontWeight: 700, color: "#22ff55" }}>Grants: {selectedPet.mutationGranted} ({selectedPet.mutationMultiplier}x)</p>
            <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>This pet passively applies the {selectedPet.mutationGranted} mutation to crops within range.</p>
          </div>
        )}
      </div>
      <div style={{ marginTop: "var(--s-4)" }}>
        <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>All Pet Abilities — Ranked by Multiplier</h3>
        <table className="calc-table">
          <thead><tr><th>Pet</th><th>Mutation</th><th>Multiplier</th></tr></thead>
          <tbody>
            {PETS.filter((p) => p.mutationGranted).sort((a, b) => (b.mutationMultiplier || 0) - (a.mutationMultiplier || 0)).map((p) => (
              <tr key={p.id} style={p.id === selectedPet.id ? { background: "rgba(34,255,85,0.1)" } : {}}>
                <td>{p.emoji} {p.name}</td><td>{p.mutationGranted}</td><td style={S.neon}>{p.mutationMultiplier}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 6: Mutation Guide ───
function MutationGuide() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"mult" | "name">("mult");

  const filtered = useMemo(() => {
    let list = [...MUTATIONS];
    if (search) list = list.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.source.toLowerCase().includes(search.toLowerCase()));
    if (tierFilter !== "all") list = list.filter((m) => m.tier === tierFilter);
    list.sort(sortBy === "mult" ? (a, b) => b.multiplier - a.multiplier : (a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, tierFilter, sortBy]);

  return (
    <div>
      <div style={{ ...S.row, marginBottom: "var(--s-3)" }}>
        <input type="text" className="calc-field__input" placeholder="🔍 Search mutations..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select className="calc-field__input" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} style={{ width: "auto" }}>
          <option value="all">All Tiers</option>
          <option value="common">Common</option><option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option><option value="legendary">Legendary</option><option value="mythic">Mythic</option>
        </select>
        <select className="calc-field__input" value={sortBy} onChange={(e) => setSortBy(e.target.value as "mult" | "name")} style={{ width: "auto" }}>
          <option value="mult">Sort: Multiplier ↓</option><option value="name">Sort: A–Z</option>
        </select>
      </div>
      <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>Showing {filtered.length} of {MUTATIONS.length} mutations</p>
      <table className="calc-table">
        <thead><tr><th></th><th>Mutation</th><th>Multiplier</th><th>Tier</th><th>Source / Recipe</th></tr></thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>{m.emoji}</td>
              <td style={{ fontWeight: 600 }}>{m.name}</td>
              <td style={{ ...S.neon, fontWeight: 700 }}>{m.multiplier}x</td>
              <td><span style={{ color: MUTATION_TIER_COLORS[m.tier], fontWeight: 600, textTransform: "capitalize" }}>{m.tier}</span></td>
              <td style={{ fontSize: "var(--t-body-sm)" }}>{m.comboFrom ? `🔗 ${m.source}` : m.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab 7: Profit Calculator ───
function ProfitCalc() {
  const [selectedPlant, setSelectedPlant] = useState<Plant>(PLANTS[0]);
  const [selectedMuts, setSelectedMuts] = useState<Set<string>>(new Set());
  const [weight, setWeight] = useState(10);
  const [seedCost, setSeedCost] = useState(18);

  const activeMuts = useMemo(() => MUTATIONS.filter((m) => selectedMuts.has(m.id)), [selectedMuts]);
  const mutMult = calcMutationMultiplier(activeMuts);
  const sellValue = calcPlantValue(selectedPlant.baseValue, weight, 1, mutMult);
  const profit = sellValue - seedCost;
  const roi = seedCost > 0 ? ((profit / seedCost) * 100) : 0;

  const toggleMut = (id: string) => {
    setSelectedMuts((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  // Top 10 most profitable plants with current mutations
  const profitRanking = useMemo(() => {
    return PLANTS.filter((p) => p.category === "seed-shop").map((p) => ({
      plant: p, value: calcPlantValue(p.baseValue, weight, 1, mutMult), profit: calcPlantValue(p.baseValue, weight, 1, mutMult) - p.baseValue,
    })).sort((a, b) => b.profit - a.profit).slice(0, 10);
  }, [weight, mutMult]);

  return (
    <div>
      <div style={{ ...S.row, marginBottom: "var(--s-3)" }}>
        <div className="calc-field" style={{ flex: 1 }}>
          <label className="calc-field__label">🌱 SELECT PLANT</label>
          <select className="calc-field__input" value={selectedPlant.id} onChange={(e) => { const p = PLANTS.find((pl) => pl.id === e.target.value); if (p) { setSelectedPlant(p); setSeedCost(p.baseValue); } }} style={{ width: "100%" }}>
            {PLANTS.filter((p) => p.category === "seed-shop").map((p) => <option key={p.id} value={p.id}>{p.emoji} {p.name} ({p.baseValue}¢)</option>)}
          </select>
        </div>
        <div className="calc-field" style={{ flex: 1 }}>
          <label className="calc-field__label">🌱 SEED COST (¢)</label>
          <input type="number" className="calc-field__input" min={0} value={seedCost} onChange={(e) => setSeedCost(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      </div>
      <div className="calc-field">
        <label className="calc-field__label">⚖️ WEIGHT (kg)</label>
        <input type="range" className="calc-field__slider" min={0.1} max={50} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
        <input type="number" className="calc-field__input" min={0.1} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} style={{ width: "120px" }} />
      </div>
      <div className="calc-field" style={{ marginTop: "var(--s-3)" }}>
        <label className="calc-field__label">⚡ QUICK MUTATIONS</label>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {MUTATIONS.filter((m) => m.tier === "rare" || m.tier === "legendary" || m.tier === "mythic").slice(0, 25).map((m) => (
            <button key={m.id} onClick={() => toggleMut(m.id)} style={S.mutBtn(selectedMuts.has(m.id), MUTATION_TIER_COLORS[m.tier])}>
              {m.emoji} {m.name} {m.multiplier}x
            </button>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-4)" }}>
          <div>
            <p className="calc-field__label">SELL VALUE</p>
            <p style={{ ...S.neon, fontSize: "var(--t-h2)", fontWeight: 700 }}>¢{sellValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <p className="calc-field__label">NET PROFIT</p>
            <p style={{ color: profit >= 0 ? "#22ff55" : "#ef4444", fontSize: "var(--t-h2)", fontWeight: 700 }}>¢{profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div>
            <p className="calc-field__label">ROI</p>
            <p style={{ color: roi >= 0 ? "#22ff55" : "#ef4444", fontSize: "var(--t-h2)", fontWeight: 700 }}>{roi >= 1e6 ? formatValue(roi) : roi.toFixed(0)}%</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "var(--s-4)" }}>
        <h3 className="t-h3" style={{ marginBottom: "var(--s-3)" }}>🏆 Top 10 Most Profitable Seeds (Current Mutations)</h3>
        <table className="calc-table">
          <thead><tr><th>#</th><th>Plant</th><th>Seed Cost</th><th>Sell Value</th><th>Net Profit</th></tr></thead>
          <tbody>
            {profitRanking.map((r, i) => (
              <tr key={r.plant.id} style={r.plant.id === selectedPlant.id ? { background: "rgba(34,255,85,0.1)" } : {}}>
                <td>{i + 1}</td><td>{r.plant.emoji} {r.plant.name}</td>
                <td>¢{r.plant.baseValue.toLocaleString()}</td>
                <td style={S.neon}>¢{formatValue(r.value)}</td>
                <td style={{ color: "#22ff55", fontWeight: 700 }}>¢{formatValue(r.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function GrowAGardenCalculator() {
  const [activeTab, setActiveTab] = useState<TabId>("crop");

  return (
    <div className="calc-card">
      <p style={{ fontSize: "var(--t-body-sm)", color: "#f59e0b", marginBottom: "var(--s-3)", padding: "var(--s-2)", background: "rgba(245,158,11,0.08)", borderRadius: "var(--r-sm)", border: "1px solid rgba(245,158,11,0.2)" }}>
        ⚠️ <strong>Disclaimer:</strong> This is a fanmade calculator and is <strong>not affiliated</strong> with Grow a Garden or Roblox. All data is gathered through community testing — no game code is used.
      </p>

      {/* Tab Bar */}
      <div style={S.tabBar}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={S.tab(activeTab === t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "crop" && <CropValueCalc />}
      {activeTab === "petxp" && <PetXPCalc />}
      {activeTab === "hatch" && <EggHatchCalc />}
      {activeTab === "petweight" && <PetWeightCalc />}
      {activeTab === "petability" && <PetAbilityCalc />}
      {activeTab === "mutations" && <MutationGuide />}
      {activeTab === "profit" && <ProfitCalc />}
    </div>
  );
}
