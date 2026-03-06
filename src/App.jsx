import { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ─── Ciqual 2025 food database ────────────────────────────────────────────────
const FOODS = {
  poulet:        { name: "Blanc de poulet",     cal: 165, p: 31.0, c: 0.0,  f: 3.6,  emoji: "🍗" },
  dinde:         { name: "Blanc de dinde",      cal: 135, p: 30.0, c: 0.0,  f: 1.5,  emoji: "🦃" },
  saumon:        { name: "Saumon",              cal: 206, p: 20.0, c: 0.0,  f: 13.0, emoji: "🐟" },
  thon:          { name: "Thon (eau)",          cal: 116, p: 26.0, c: 0.0,  f: 1.0,  emoji: "🐠" },
  crevettes:     { name: "Crevettes",           cal: 99,  p: 21.0, c: 0.0,  f: 1.5,  emoji: "🦐" },
  cabillaud:     { name: "Cabillaud",           cal: 82,  p: 18.0, c: 0.0,  f: 0.7,  emoji: "🐡" },
  oeuf:          { name: "Œuf entier",          cal: 155, p: 13.0, c: 1.1,  f: 11.0, emoji: "🥚" },
  blanc_oeuf:    { name: "Blanc d'œuf",         cal: 52,  p: 11.0, c: 0.7,  f: 0.2,  emoji: "🥚" },
  boeuf:         { name: "Bœuf maigre",         cal: 172, p: 26.0, c: 0.0,  f: 7.0,  emoji: "🥩" },
  porc_filet:    { name: "Filet de porc",       cal: 143, p: 22.0, c: 0.0,  f: 6.0,  emoji: "🥩" },
  cottage:       { name: "Cottage cheese",      cal: 98,  p: 11.0, c: 3.4,  f: 4.3,  emoji: "🧀" },
  yaourt_grec:   { name: "Yaourt grec 0%",      cal: 60,  p: 10.0, c: 4.0,  f: 0.3,  emoji: "🥛" },
  fromage_blanc: { name: "Fromage blanc 0%",    cal: 45,  p: 7.8,  c: 4.5,  f: 0.1,  emoji: "🥛" },
  skyr:          { name: "Skyr nature",         cal: 63,  p: 11.0, c: 4.0,  f: 0.2,  emoji: "🥛" },
  whey:          { name: "Whey protéine",       cal: 400, p: 80.0, c: 10.0, f: 5.0,  emoji: "💪" },
  ricotta:       { name: "Ricotta légère",      cal: 138, p: 9.0,  c: 3.0,  f: 10.0, emoji: "🧀" },
  mozzarella:    { name: "Mozzarella light",    cal: 156, p: 18.0, c: 2.0,  f: 9.0,  emoji: "🧀" },
  riz:           { name: "Riz basmati",         cal: 130, p: 2.7,  c: 28.0, f: 0.3,  emoji: "🍚" },
  riz_complet:   { name: "Riz complet",         cal: 112, p: 2.6,  c: 23.0, f: 0.9,  emoji: "🍚" },
  patate_douce:  { name: "Patate douce",        cal: 90,  p: 1.6,  c: 20.0, f: 0.1,  emoji: "🍠" },
  pomme_terre:   { name: "Pomme de terre",      cal: 77,  p: 2.0,  c: 17.0, f: 0.1,  emoji: "🥔" },
  avoine:        { name: "Flocons d'avoine",    cal: 367, p: 13.0, c: 62.0, f: 7.0,  emoji: "🌾" },
  quinoa:        { name: "Quinoa",              cal: 120, p: 4.4,  c: 21.0, f: 1.9,  emoji: "🌱" },
  pain_seigle:   { name: "Pain de seigle",      cal: 259, p: 8.5,  c: 48.0, f: 3.3,  emoji: "🍞" },
  pain_complet:  { name: "Pain complet",        cal: 247, p: 9.0,  c: 46.0, f: 3.0,  emoji: "🍞" },
  lentilles:     { name: "Lentilles",           cal: 116, p: 9.0,  c: 20.0, f: 0.4,  emoji: "🫘" },
  pois_chiches:  { name: "Pois chiches",        cal: 164, p: 8.9,  c: 27.0, f: 2.6,  emoji: "🫘" },
  haricots:      { name: "Haricots rouges",     cal: 127, p: 8.7,  c: 22.0, f: 0.5,  emoji: "🫘" },
  pates:         { name: "Pâtes complètes",     cal: 131, p: 5.5,  c: 25.0, f: 0.9,  emoji: "🍝" },
  banane:        { name: "Banane",              cal: 89,  p: 1.1,  c: 23.0, f: 0.3,  emoji: "🍌" },
  myrtilles:     { name: "Myrtilles",           cal: 57,  p: 0.7,  c: 14.0, f: 0.3,  emoji: "🫐" },
  fraises:       { name: "Fraises",             cal: 32,  p: 0.7,  c: 7.7,  f: 0.3,  emoji: "🍓" },
  pomme:         { name: "Pomme",               cal: 52,  p: 0.3,  c: 14.0, f: 0.2,  emoji: "🍎" },
  mangue:        { name: "Mangue",              cal: 65,  p: 0.5,  c: 15.0, f: 0.3,  emoji: "🥭" },
  avocat:        { name: "Avocat",              cal: 160, p: 2.0,  c: 9.0,  f: 15.0, emoji: "🥑" },
  amandes:       { name: "Amandes",             cal: 579, p: 21.0, c: 22.0, f: 50.0, emoji: "🥜" },
  noix:          { name: "Noix",                cal: 654, p: 15.0, c: 14.0, f: 65.0, emoji: "🌰" },
  huile_olive:   { name: "Huile d'olive",       cal: 884, p: 0.0,  c: 0.0,  f: 100.0, emoji: "🫒" },
  beurre_cac:    { name: "Beurre de cacahuète", cal: 588, p: 25.0, c: 20.0, f: 50.0, emoji: "🥜" },
  tahini:        { name: "Tahini",              cal: 595, p: 17.0, c: 21.0, f: 54.0, emoji: "🌰" },
  graines_chia:  { name: "Graines de chia",     cal: 486, p: 17.0, c: 42.0, f: 31.0, emoji: "🌱" },
  brocoli:       { name: "Brocoli",             cal: 35,  p: 2.4,  c: 7.0,  f: 0.4,  emoji: "🥦" },
  epinards:      { name: "Épinards",            cal: 23,  p: 2.9,  c: 3.6,  f: 0.4,  emoji: "🥬" },
  courgette:     { name: "Courgette",           cal: 17,  p: 1.2,  c: 3.1,  f: 0.3,  emoji: "🥒" },
  tomate:        { name: "Tomate",              cal: 18,  p: 0.9,  c: 3.5,  f: 0.2,  emoji: "🍅" },
  concombre:     { name: "Concombre",           cal: 12,  p: 0.6,  c: 2.2,  f: 0.1,  emoji: "🥒" },
  poivron:       { name: "Poivron",             cal: 26,  p: 1.0,  c: 5.0,  f: 0.2,  emoji: "🫑" },
  champignon:    { name: "Champignons",         cal: 22,  p: 3.1,  c: 3.3,  f: 0.3,  emoji: "🍄" },
  haricots_verts:{ name: "Haricots verts",      cal: 31,  p: 1.8,  c: 7.0,  f: 0.1,  emoji: "🫛" },
  asperges:      { name: "Asperges",            cal: 20,  p: 2.2,  c: 3.9,  f: 0.1,  emoji: "🥗" },
  salade:        { name: "Salade verte",        cal: 15,  p: 1.4,  c: 2.9,  f: 0.2,  emoji: "🥬" },
  carotte:       { name: "Carottes",            cal: 41,  p: 0.9,  c: 10.0, f: 0.2,  emoji: "🥕" },
  lait_amande:   { name: "Lait d'amande",       cal: 24,  p: 0.6,  c: 3.0,  f: 1.1,  emoji: "🥛" },
  cacao:         { name: "Cacao en poudre",     cal: 228, p: 20.0, c: 54.0, f: 14.0, emoji: "🍫" },
  miel:          { name: "Miel",                cal: 304, p: 0.3,  c: 82.0, f: 0.0,  emoji: "🍯" },
};

const FOOD_KEYS = Object.keys(FOODS);

function computeMacros(ingredients) {
  let cal = 0, p = 0, c = 0, f = 0;
  Object.entries(ingredients).forEach(([key, grams]) => {
    const food = FOODS[key];
    if (!food || !grams) return;
    const s = grams / 100;
    cal += food.cal * s; p += food.p * s; c += food.c * s; f += food.f * s;
  });
  return { cal: Math.round(cal), p: Math.round(p), c: Math.round(c), f: Math.round(f) };
}

function adjustRecipe(base, targets) {
  const ingredients = { ...base };
  const keys = Object.keys(ingredients);
  const proteinSources = keys.filter(k => FOODS[k]?.p > 12);
  const carbSources    = keys.filter(k => FOODS[k]?.c > 12 && (FOODS[k]?.p || 0) < 12);
  const fatSources     = keys.filter(k => FOODS[k]?.f > 8);
  const bm = computeMacros(ingredients);
  if (proteinSources.length && bm.p > 0) {
    const r = Math.max(0.3, Math.min(4, targets.p / bm.p));
    proteinSources.forEach(k => { ingredients[k] = Math.round(ingredients[k] * r); });
  }
  if (carbSources.length && bm.c > 0) {
    const r = Math.max(0.2, Math.min(4, targets.c / Math.max(bm.c, 1)));
    carbSources.forEach(k => { ingredients[k] = Math.round(ingredients[k] * r); });
  }
  if (fatSources.length && bm.f > 0) {
    const r = Math.max(0.2, Math.min(4, targets.f / Math.max(bm.f, 1)));
    fatSources.forEach(k => { ingredients[k] = Math.round(ingredients[k] * r); });
  }
  keys.forEach(k => { if (ingredients[k] < 5) ingredients[k] = 5; });
  return ingredients;
}

// ─── Generate recipes via Claude API ─────────────────────────────────────────
async function generateRecipes(goal, meal, count, existingNames) {
  const goalDesc = { seche: "sèche / perte de gras (peu de calories, beaucoup de protéines, peu de glucides)", maintien: "maintien du poids (macros équilibrés)", muscle: "prise de masse musculaire (calorique, riche en protéines et glucides)" }[goal];
  const mealDesc = meal === "Tous" ? "tout type de repas (petit-déjeuner, déjeuner, dîner, collation)" : meal;
  const forbidden = existingNames.length ? `\nNe PAS répéter ces noms déjà existants : ${existingNames.slice(-30).join(", ")}` : "";
  const availableKeys = FOOD_KEYS.join(", ");

  const prompt = `Tu es diététicienne sportive experte pour femmes actives. Génère exactement ${count} recettes originales et variées pour l'objectif : ${goalDesc}. Type de repas : ${mealDesc}.${forbidden}

Utilise UNIQUEMENT ces clés d'ingrédients (exactement tels quels) : ${availableKeys}

Réponds UNIQUEMENT avec ce JSON valide, sans markdown, sans texte autour :
{
  "recipes": [
    {
      "name": "Nom créatif et appétissant de la recette",
      "meal": "Petit-déjeuner|Déjeuner|Dîner|Collation",
      "emoji": "un emoji représentatif",
      "shortDesc": "Une phrase accrocheuse résumant la recette (max 80 caractères)",
      "description": "Description détaillée de 3 à 5 phrases : comment préparer la recette, pourquoi ces ingrédients sont bons pour l'objectif, les bénéfices nutritionnels spécifiques de chaque ingrédient clé, les conseils de préparation et de dégustation.",
      "ingredients": {
        "cle_ingredient": quantiteEnGrammes
      }
    }
  ]
}

Règles importantes :
- Recettes VARIÉES et ORIGINALES (pas toujours poulet-riz)
- Quantités réalistes en grammes (ex: huile_olive max 15g, whey max 40g)
- Entre 3 et 6 ingrédients par recette
- Descriptions riches et motivantes, expliquant les bénéfices fitness
- Les clés d'ingrédients doivent être exactement celles de la liste`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  const text = (data.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(text);
  return parsed.recipes.map((r, i) => ({
    ...r,
    id: `gen_${goal}_${Date.now()}_${i}`,
    goal,
    ingredients: Object.fromEntries(
      Object.entries(r.ingredients).filter(([k]) => FOODS[k])
    ),
  }));
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GOALS = {
  seche:    { label: "Sèche",          emoji: "🔥", color: "#b5616e", desc: "Déficit calorique · Haute protéine" },
  maintien: { label: "Maintien",       emoji: "⚖️", color: "#9a7b5e", desc: "Macros équilibrés · Énergie stable" },
  muscle:   { label: "Prise de masse", emoji: "💪", color: "#6b8f72", desc: "Surplus calorique · Masse propre" },
};
const MEALS = ["Tous", "Petit-déjeuner", "Déjeuner", "Dîner", "Collation"];
const ROSE = "#c9a882";
const ROSE_L = "#f5ede3";
const DARK = "#1a1a1a";

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, unit, value, min, max, step = 1, onChange, color }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: DARK, fontFamily: "'Cormorant Garamond',serif" }}>{value} <span style={{ fontSize: 10, color: "#ccc", fontWeight: 400 }}>{unit}</span></span>
      </div>
      <div style={{ position: "relative", height: 5, background: "#ede7e0", borderRadius: 999 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${ROSE_L},${color})`, borderRadius: 999, transition: "width 0.1s" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
          style={{ position: "absolute", inset: "-7px 0", opacity: 0, cursor: "pointer", width: "100%", zIndex: 2 }} />
        <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: "#fff", border: `2px solid ${color}`, boxShadow: "0 1px 6px rgba(0,0,0,0.15)", transition: "left 0.1s", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ─── Recipe Card ──────────────────────────────────────────────────────────────
function RecipeCard({ recipe, isSelected, onClick }) {
  const m = computeMacros(recipe.ingredients);
  const gc = GOALS[recipe.goal];
  return (
    <div onClick={onClick}
      style={{ background: isSelected ? "#fff" : "#faf7f4", border: `1.5px solid ${isSelected ? ROSE : "#ece6df"}`, borderRadius: 18, padding: "15px 17px", cursor: "pointer", transition: "all 0.18s", boxShadow: isSelected ? "0 4px 24px rgba(201,168,130,0.22)" : "0 1px 4px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{ fontSize: 16 }}>{recipe.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: gc.color, background: gc.color + "18", borderRadius: 20, padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{recipe.meal}</span>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, color: DARK, lineHeight: 1.25, marginBottom: 5 }}>{recipe.name}</div>
          {recipe.shortDesc && <p style={{ fontSize: 11, color: "#bbb", margin: 0, lineHeight: 1.4 }}>{recipe.shortDesc}</p>}
        </div>
        <div style={{ textAlign: "right", marginLeft: 12, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: ROSE }}>{m.cal}</div>
          <div style={{ fontSize: 9, color: "#ccc", textTransform: "uppercase" }}>kcal</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, paddingTop: 8, borderTop: "1px solid #f0ebe4" }}>
        {[["P", m.p, "#d4826a"], ["G", m.c, "#7a9e87"], ["L", m.f, ROSE]].map(([l, v, c]) => (
          <span key={l} style={{ fontSize: 10, color: c, fontWeight: 700 }}>{l}: {v}g</span>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 10, color: isSelected ? ROSE : "#e0d8d0", fontWeight: 600 }}>
          {isSelected ? "✦ Sélectionnée" : "Ajuster →"}
        </span>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FitWomenApp() {
  const [activeGoal, setActiveGoal] = useState("seche");
  const [activeMeal, setActiveMeal] = useState("Tous");
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState({});        // { goal: [recipes...] }
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [customized, setCustomized] = useState(false);
  const [sliders, setSliders] = useState({ p: 35, c: 35, f: 15 });
  const loadingInterval = useRef(null);

  const currentRecipes = recipes[activeGoal] || [];

  const filtered = useMemo(() =>
    currentRecipes.filter(r =>
      (activeMeal === "Tous" || r.meal === activeMeal) &&
      (search === "" || r.name.toLowerCase().includes(search.toLowerCase()))
    ), [currentRecipes, activeMeal, search]);

  const loadRecipes = async (goal, more = false) => {
    setLoading(true);
    setError(null);
    const existing = recipes[goal] || [];
    const existingNames = existing.map(r => r.name);

    const messages = [
      "Consultation de la base Ciqual 2025...",
      "Analyse des profils nutritionnels...",
      "Création des recettes en cours...",
      "Calcul des macros...",
      "Finalisation des descriptions...",
    ];
    let mi = 0;
    setLoadingMsg(messages[0]);
    loadingInterval.current = setInterval(() => {
      mi = Math.min(mi + 1, messages.length - 1);
      setLoadingMsg(messages[mi]);
    }, 2500);

    try {
      // Generate 20 recipes per call, covering all meals
      const newRecipes = await generateRecipes(goal, "Tous", 20, existingNames);
      clearInterval(loadingInterval.current);
      setRecipes(prev => ({
        ...prev,
        [goal]: more ? [...existing, ...newRecipes] : newRecipes,
      }));
    } catch (e) {
      clearInterval(loadingInterval.current);
      setError("Erreur de génération. Vérifie ta connexion et réessaie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!recipes[activeGoal]) loadRecipes(activeGoal);
  }, [activeGoal]);

  const selectRecipe = (r) => {
    const m = computeMacros(r.ingredients);
    setSliders({ p: m.p, c: m.c, f: m.f });
    setSelected(r);
    setCustomized(false);
    setShowDetail(true);
  };

  const setSlider = useCallback((key, val) => {
    setSliders(s => ({ ...s, [key]: val }));
    setCustomized(true);
  }, []);

  const adjIngredients = useMemo(() => {
    if (!selected) return null;
    return adjustRecipe(selected.ingredients, sliders);
  }, [selected, sliders]);

  const adjMacros = useMemo(() => adjIngredients ? computeMacros(adjIngredients) : null, [adjIngredients]);

  const mealCounts = useMemo(() => {
    const counts = {};
    currentRecipes.forEach(r => { counts[r.meal] = (counts[r.meal] || 0) + 1; });
    return counts;
  }, [currentRecipes]);

  const gc = GOALS[activeGoal];

  return (
    <div style={{ minHeight: "100vh", background: "#f9f6f2", fontFamily: "'Jost', sans-serif", color: DARK }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #e0d4c8; border-radius: 99px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: DARK, padding: "16px 20px", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${ROSE},#e8c4a0)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: DARK, fontWeight: 800, fontSize: 12, fontFamily: "'Cormorant Garamond',serif" }}>FW</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase" }}>Fitwomen</div>
              <div style={{ fontSize: 9, color: ROSE, letterSpacing: "0.2em", textTransform: "uppercase" }}>Bibliothèque Nutritionnelle · IA</div>
            </div>
          </div>
          <div style={{ display: "flex", align: "center", gap: 16 }}>
            {currentRecipes.length > 0 && (
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.08em" }}>
                <span style={{ color: ROSE, fontWeight: 700 }}>{currentRecipes.length}</span> recettes générées
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 16px" }}>

        {/* ── GOAL TABS ── */}
        <div style={{ display: "flex", gap: 10, padding: "18px 0 14px" }}>
          {Object.entries(GOALS).map(([key, cfg]) => (
            <button key={key} onClick={() => { setActiveGoal(key); setSelected(null); setShowDetail(false); }}
              style={{ flex: 1, padding: "12px 8px", border: "1.5px solid", borderColor: activeGoal === key ? ROSE : "#e8e2db", borderRadius: 16, background: activeGoal === key ? DARK : "#fff", color: activeGoal === key ? "#fff" : "#aaa", fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer", letterSpacing: "0.05em", transition: "all 0.2s", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 3 }}>{cfg.emoji}</div>
              <div style={{ textTransform: "uppercase", fontWeight: 700 }}>{cfg.label}</div>
              <div style={{ fontSize: 9, color: activeGoal === key ? "#888" : "#ccc", marginTop: 3, fontWeight: 400 }}>{cfg.desc}</div>
            </button>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MEALS.map(m => {
              const count = m === "Tous" ? currentRecipes.length : (mealCounts[m] || 0);
              return (
                <button key={m} onClick={() => setActiveMeal(m)}
                  style={{ padding: "6px 12px", border: "1px solid", borderColor: activeMeal === m ? ROSE : "#e8e2db", borderRadius: 99, background: activeMeal === m ? ROSE_L : "#fff", color: activeMeal === m ? "#8a6040" : "#bbb", fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer", transition: "all 0.15s" }}>
                  {m} {count > 0 && <span style={{ opacity: 0.6 }}>({count})</span>}
                </button>
              );
            })}
          </div>
          <input placeholder="🔍 Rechercher une recette..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ marginLeft: "auto", padding: "7px 14px", border: "1px solid #e8e2db", borderRadius: 99, fontSize: 11, outline: "none", color: DARK, background: "#fff", width: 220, fontFamily: "'Jost',sans-serif" }} />
        </div>

        {/* ── CONTENT ── */}
        {loading && currentRecipes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 16, display: "inline-block", animation: "spin 3s linear infinite" }}>🌿</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#aaa", marginBottom: 8 }}>Génération en cours</div>
            <div style={{ fontSize: 13, color: "#ccc", animation: "pulse 2s ease-in-out infinite" }}>{loadingMsg}</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ROSE, animation: `pulse ${1 + i * 0.3}s ease-in-out infinite` }} />)}
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <div style={{ color: "#c97a7a", fontSize: 14, marginBottom: 16 }}>{error}</div>
            <button onClick={() => loadRecipes(activeGoal)}
              style={{ background: DARK, color: "#fff", border: "none", borderRadius: 12, padding: "11px 24px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              Réessayer
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: showDetail ? "1fr 420px" : "1fr", gap: 20, alignItems: "start" }}>

            {/* Recipe Grid */}
            <div>
              {filtered.length === 0 && currentRecipes.length > 0 && (
                <div style={{ textAlign: "center", padding: "30px 20px", color: "#ccc", fontSize: 14 }}>
                  Aucune recette pour ce filtre
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: showDetail ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {filtered.map((r, i) => (
                  <div key={r.id} style={{ animation: `fadeIn 0.3s ease ${(i % 20) * 0.03}s both` }}>
                    <RecipeCard recipe={r} isSelected={selected?.id === r.id} onClick={() => selectRecipe(r)} />
                  </div>
                ))}
              </div>

              {/* Load more buttons */}
              {currentRecipes.length > 0 && (
                <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => loadRecipes(activeGoal, true)} disabled={loading}
                    style={{ background: loading ? "#f0ebe4" : DARK, color: loading ? "#ccc" : "#fff", border: "none", borderRadius: 14, padding: "12px 28px", fontWeight: 700, cursor: loading ? "default" : "pointer", fontSize: 13, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                    {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>🌿</span> Génération...</> : <><span>✨</span> + 20 nouvelles recettes</>}
                  </button>
                  <button onClick={() => loadRecipes(activeGoal, false)} disabled={loading}
                    style={{ background: "transparent", color: "#ccc", border: "1px solid #e8e2db", borderRadius: 14, padding: "12px 20px", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                    🔄 Tout régénérer
                  </button>
                </div>
              )}

              {loading && currentRecipes.length > 0 && (
                <div style={{ textAlign: "center", padding: "16px", color: "#bbb", fontSize: 12, animation: "pulse 2s infinite" }}>
                  {loadingMsg}
                </div>
              )}
            </div>

            {/* ── DETAIL PANEL ── */}
            {showDetail && selected && (
              <div style={{ position: "sticky", top: 76, animation: "fadeIn 0.3s ease" }}>
                <div style={{ background: "#fff", border: "1.5px solid #ede8e3", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 48px rgba(201,168,130,0.16)" }}>

                  {/* Header */}
                  <div style={{ background: DARK, padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                        <span style={{ fontSize: 28, flexShrink: 0 }}>{selected.emoji}</span>
                        <div>
                          <div style={{ fontSize: 9, color: ROSE, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, marginBottom: 3 }}>{GOALS[selected.goal].label} · {selected.meal}</div>
                          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{selected.name}</div>
                        </div>
                      </div>
                      <button onClick={() => { setShowDetail(false); setSelected(null); }}
                        style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#666", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 14, flexShrink: 0, marginLeft: 8 }}>✕</button>
                    </div>
                    {selected.description && (
                      <p style={{ color: "#888", fontSize: 12, lineHeight: 1.7, margin: 0 }}>{selected.description}</p>
                    )}
                  </div>

                  <div style={{ padding: "18px 22px", maxHeight: "calc(100vh - 230px)", overflowY: "auto" }}>

                    {/* Macro summary */}
                    {adjMacros && (
                      <div style={{ background: "#faf7f4", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                        {[["Calories", adjMacros.cal, "kcal", ROSE], ["Protéines", adjMacros.p, "g", "#d4826a"], ["Glucides", adjMacros.c, "g", "#7a9e87"], ["Lipides", adjMacros.f, "g", "#b08a6e"]].map(([l, v, u, c]) => (
                          <div key={l}>
                            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                            <div style={{ fontSize: 9, color: "#ccc", textTransform: "uppercase", letterSpacing: "0.07em" }}>{l}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sliders */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700 }}>Ajuste ta recette</div>
                        {customized && (
                          <button onClick={() => { const m = computeMacros(selected.ingredients); setSliders({ p: m.p, c: m.c, f: m.f }); setCustomized(false); }}
                            style={{ fontSize: 11, color: ROSE, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>↺ Reset</button>
                        )}
                      </div>
                      <Slider label="Protéines" unit="g" value={sliders.p} min={5} max={100} onChange={v => setSlider("p", v)} color="#d4826a" />
                      <Slider label="Glucides"  unit="g" value={sliders.c} min={0} max={150} onChange={v => setSlider("c", v)} color="#7a9e87" />
                      <Slider label="Lipides"   unit="g" value={sliders.f} min={0} max={80}  onChange={v => setSlider("f", v)} color="#b08a6e" />
                    </div>

                    {/* Ingredients */}
                    {adjIngredients && (
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                          Ingrédients {customized && <span style={{ fontSize: 10, color: ROSE, fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>· ajustés</span>}
                        </div>
                        {Object.entries(adjIngredients).map(([key, grams]) => {
                          const food = FOODS[key];
                          if (!food) return null;
                          const s = grams / 100;
                          return (
                            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f5f0ea" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 17 }}>{food.emoji}</span>
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{food.name}</div>
                                  <div style={{ fontSize: 10, color: "#ccc" }}>{Math.round(food.cal * s)} kcal · P:{Math.round(food.p * s)}g · G:{Math.round(food.c * s)}g · L:{Math.round(food.f * s)}g</div>
                                </div>
                              </div>
                              <div style={{ background: ROSE_L, color: "#8a6040", fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "3px 10px", fontFamily: "'Cormorant Garamond',serif", flexShrink: 0, marginLeft: 8 }}>
                                {grams}g
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ marginTop: 14, background: "#faf7f4", borderRadius: 10, padding: "9px 12px", display: "flex", gap: 7, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 12, flexShrink: 0 }}>📋</span>
                          <div style={{ fontSize: 10, color: "#ccc", lineHeight: 1.5 }}>
                            Valeurs issues de la <strong style={{ color: "#aaa" }}>Table Ciqual 2025</strong> (Anses) — données nutritionnelles officielles françaises, pour 100g de partie comestible.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 50 }} />
      </div>
    </div>
  );
}
