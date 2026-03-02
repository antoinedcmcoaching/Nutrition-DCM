import { useState, useMemo, useEffect } from "react";

// ─── Food Database ───────────────────────────────────────────────────────────
const FOOD_DB = [
  { id: 1, name: "Poulet (blanc, cuit)", unit: "100g", cal: 165, p: 31, c: 0, f: 3.6 },
  { id: 2, name: "Riz basmati (cuit)", unit: "100g", cal: 130, p: 2.7, c: 28, f: 0.3 },
  { id: 3, name: "Oeuf entier", unit: "1 oeuf", cal: 77, p: 6.3, c: 0.6, f: 5.3 },
  { id: 4, name: "Blanc d'oeuf", unit: "1 blanc", cal: 17, p: 3.6, c: 0.2, f: 0.1 },
  { id: 5, name: "Flocons d'avoine", unit: "100g", cal: 367, p: 13, c: 62, f: 7 },
  { id: 6, name: "Patate douce (cuite)", unit: "100g", cal: 90, p: 2, c: 20, f: 0.1 },
  { id: 7, name: "Brocoli (cuit)", unit: "100g", cal: 35, p: 2.4, c: 7, f: 0.4 },
  { id: 8, name: "Épinards (cru)", unit: "100g", cal: 23, p: 2.9, c: 3.6, f: 0.4 },
  { id: 9, name: "Fromage blanc 0%", unit: "100g", cal: 45, p: 7.8, c: 4.5, f: 0.1 },
  { id: 10, name: "Whey protéine", unit: "30g (1 dose)", cal: 120, p: 24, c: 3, f: 1.5 },
  { id: 11, name: "Amandes", unit: "30g", cal: 174, p: 6, c: 6, f: 15 },
  { id: 12, name: "Avocat", unit: "100g", cal: 160, p: 2, c: 9, f: 15 },
  { id: 13, name: "Saumon (filet)", unit: "100g", cal: 206, p: 20, c: 0, f: 13 },
  { id: 14, name: "Thon en boîte (eau)", unit: "100g", cal: 116, p: 26, c: 0, f: 1 },
  { id: 15, name: "Banane", unit: "1 moyenne", cal: 89, p: 1.1, c: 23, f: 0.3 },
  { id: 16, name: "Pomme", unit: "1 moyenne", cal: 72, p: 0.4, c: 19, f: 0.2 },
  { id: 17, name: "Pain de seigle", unit: "1 tranche", cal: 65, p: 2.7, c: 12, f: 0.8 },
  { id: 18, name: "Lentilles (cuites)", unit: "100g", cal: 116, p: 9, c: 20, f: 0.4 },
  { id: 19, name: "Quinoa (cuit)", unit: "100g", cal: 120, p: 4.4, c: 21, f: 1.9 },
  { id: 20, name: "Huile d'olive", unit: "1 c. à soupe", cal: 119, p: 0, c: 0, f: 13.5 },
  { id: 21, name: "Lait écrémé", unit: "250ml", cal: 85, p: 8.3, c: 12, f: 0.3 },
  { id: 22, name: "Yaourt grec 0%", unit: "150g", cal: 90, p: 15, c: 6, f: 0.5 },
  { id: 23, name: "Beurre de cacahuète", unit: "2 c. à soupe", cal: 188, p: 8, c: 7, f: 16 },
  { id: 24, name: "Cottage cheese", unit: "100g", cal: 98, p: 11, c: 3.4, f: 4.3 },
  { id: 25, name: "Dinde (blanc, cuit)", unit: "100g", cal: 135, p: 30, c: 0, f: 1.5 },
];

function generateMealPlan(goal) {
  const high_p = goal === "muscle";
  return [
    { name: "Petit-déjeuner", emoji: "🌅", items: high_p ? [FOOD_DB[4], FOOD_DB[2], FOOD_DB[21]] : [FOOD_DB[4], FOOD_DB[14], FOOD_DB[10]] },
    { name: "Déjeuner", emoji: "☀️", items: high_p ? [FOOD_DB[0], FOOD_DB[1], FOOD_DB[6]] : [FOOD_DB[12], FOOD_DB[18], FOOD_DB[7]] },
    { name: "Collation", emoji: "⚡", items: [FOOD_DB[9], FOOD_DB[14]] },
    { name: "Dîner", emoji: "🌙", items: high_p ? [FOOD_DB[24], FOOD_DB[5], FOOD_DB[7]] : [FOOD_DB[13], FOOD_DB[18], FOOD_DB[6]] },
  ];
}

function calcBMR(weight, height, age, sex) {
  if (sex === "H") return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
}
const ACTIVITY = { sedentaire: 1.2, leger: 1.375, modere: 1.55, actif: 1.725, tres_actif: 1.9 };
const ACTIVITY_LABELS = { sedentaire: "Sédentaire", leger: "Légèrement actif", modere: "Modérément actif", actif: "Actif", tres_actif: "Très actif" };
const todayKey = () => new Date().toISOString().slice(0, 10);

function MacroBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>{Math.round(value)}g <span style={{ color: "#9ca3af", fontWeight: 400 }}>/ {max}g</span></span>
      </div>
      <div style={{ background: "#f3f4f6", borderRadius: 999, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </div>
    </div>
  );
}

function CalRing({ eaten, target }) {
  const pct = Math.min(eaten / target, 1);
  const r = 52, stroke = 8;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const over = eaten > target;
  const remaining = Math.max(target - eaten, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={130} height={130} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
        <circle cx={65} cy={65} r={r} fill="none" stroke={over ? "#ef4444" : "#4ade80"} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </svg>
      <div style={{ position: "relative", top: -90, textAlign: "center", lineHeight: 1.2 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: over ? "#ef4444" : "#1f2937", fontFamily: "'DM Serif Display', serif" }}>{Math.round(eaten)}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>kcal</div>
        <div style={{ fontSize: 12, color: over ? "#ef4444" : "#6b7280", marginTop: 2 }}>{over ? "+" + Math.round(eaten - target) + " dépassé" : remaining + " restant"}</div>
      </div>
    </div>
  );
}

export default function NutritionApp() {
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [setupStep, setSetupStep] = useState(0);
  const [form, setForm] = useState({ name: "", weight: "", height: "", age: "", sex: "H", activity: "modere", goal: "muscle" });
  const [log, setLog] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState(1);
  const [qtyMeal, setQtyMeal] = useState("Déjeuner");
  const [planGoal, setPlanGoal] = useState("muscle");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("nutricoach_profile");
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      const savedLog = localStorage.getItem(`nutricoach_log_${todayKey()}`);
      if (savedLog) setLog(JSON.parse(savedLog));
    } catch (e) {}
  }, []);

  // ── Save profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem("nutricoach_profile", JSON.stringify(profile));
      setPlanGoal(profile.goal);
    }
  }, [profile]);

  // ── Save log to localStorage (per day)
  useEffect(() => {
    if (log.length > 0 || profile) {
      localStorage.setItem(`nutricoach_log_${todayKey()}`, JSON.stringify(log));
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [log]);

  const targets = useMemo(() => {
    if (!profile) return null;
    const bmr = calcBMR(+profile.weight, +profile.height, +profile.age, profile.sex);
    const tdee = bmr * ACTIVITY[profile.activity];
    const cal = profile.goal === "seche" ? tdee - 400 : profile.goal === "muscle" ? tdee + 300 : tdee;
    const protein = +profile.weight * (profile.goal === "muscle" ? 2.2 : 2);
    const fat = (cal * 0.25) / 9;
    const carbs = (cal - protein * 4 - fat * 9) / 4;
    return { cal: Math.round(cal), protein: Math.round(protein), fat: Math.round(fat), carbs: Math.round(carbs) };
  }, [profile]);

  const totals = useMemo(() => log.reduce((acc, e) => ({
    cal: acc.cal + e.food.cal * e.qty,
    protein: acc.protein + e.food.p * e.qty,
    carbs: acc.carbs + e.food.c * e.qty,
    fat: acc.fat + e.food.f * e.qty,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 }), [log]);

  const filteredFoods = FOOD_DB.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const mealPlan = useMemo(() => generateMealPlan(planGoal), [planGoal]);
  const mealsByTime = ["Petit-déjeuner", "Déjeuner", "Collation", "Dîner"];
  const GOAL_LABELS = { muscle: "Prise de masse", seche: "Sèche", maintien: "Maintien" };

  // ─── SETUP ────────────────────────────────────────────────────────────────
  if (!profile) {
    const steps = [
      { key: "name", label: "Ton prénom", type: "text", placeholder: "Ex: Sophie" },
      { key: "age", label: "Ton âge", type: "number", placeholder: "Ex: 28" },
      { key: "weight", label: "Ton poids (kg)", type: "number", placeholder: "Ex: 68" },
      { key: "height", label: "Ta taille (cm)", type: "number", placeholder: "Ex: 172" },
    ];
    const isLast = setupStep === steps.length;

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a2f 50%, #0f2027 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#fff", margin: 0 }}>NutriCoach</h1>
            <p style={{ color: "#6ee7b7", marginTop: 8, fontSize: 14 }}>Ton plan nutritionnel personnalisé</p>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 32, justifyContent: "center" }}>
            {[...steps, { key: "extra" }].map((_, i) => (
              <div key={i} style={{ width: i <= setupStep ? 28 : 8, height: 4, borderRadius: 999, background: i <= setupStep ? "#4ade80" : "rgba(255,255,255,0.2)", transition: "all 0.3s ease" }} />
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32 }}>
            {!isLast ? (
              <div>
                <label style={{ display: "block", color: "#a7f3d0", fontWeight: 600, marginBottom: 10, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>{steps[setupStep].label}</label>
                <input type={steps[setupStep].type} placeholder={steps[setupStep].placeholder} value={form[steps[setupStep].key]}
                  onChange={e => setForm({ ...form, [steps[setupStep].key]: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && form[steps[setupStep].key] && setSetupStep(s => s + 1)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 16, boxSizing: "border-box", outline: "none" }} />
                <button onClick={() => setSetupStep(s => s + 1)} disabled={!form[steps[setupStep].key]}
                  style={{ width: "100%", marginTop: 16, background: form[steps[setupStep].key] ? "linear-gradient(135deg, #4ade80, #22c55e)" : "rgba(255,255,255,0.1)", color: form[steps[setupStep].key] ? "#0f2027" : "rgba(255,255,255,0.3)", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}>
                  Continuer →
                </button>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", color: "#a7f3d0", fontWeight: 600, marginBottom: 16, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase" }}>Finalise ton profil</label>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sexe</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["H", "Homme"], ["F", "Femme"]].map(([val, lbl]) => (
                      <button key={val} onClick={() => setForm({ ...form, sex: val })}
                        style={{ flex: 1, padding: "10px", border: "1px solid", borderColor: form.sex === val ? "#4ade80" : "rgba(255,255,255,0.15)", borderRadius: 10, background: form.sex === val ? "rgba(74,222,128,0.15)" : "transparent", color: form.sex === val ? "#4ade80" : "#9ca3af", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Niveau d'activité</p>
                  <select value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })}
                    style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "11px 12px", color: "#fff", fontSize: 14, outline: "none" }}>
                    {Object.entries(ACTIVITY_LABELS).map(([val, lbl]) => <option key={val} value={val} style={{ background: "#1e3a2f" }}>{lbl}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Objectif</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["muscle", "🏋️ Prise de masse"], ["seche", "🔥 Sèche"], ["maintien", "⚖️ Maintien"]].map(([val, lbl]) => (
                      <button key={val} onClick={() => setForm({ ...form, goal: val })}
                        style={{ flex: 1, padding: "8px 4px", border: "1px solid", borderColor: form.goal === val ? "#4ade80" : "rgba(255,255,255,0.15)", borderRadius: 10, background: form.goal === val ? "rgba(74,222,128,0.15)" : "transparent", color: form.goal === val ? "#4ade80" : "#9ca3af", fontWeight: 600, cursor: "pointer", fontSize: 11, textAlign: "center" }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setProfile({ ...form })}
                  style={{ width: "100%", background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0f2027", border: "none", borderRadius: 12, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                  🚀 Lancer mon programme
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN APP ─────────────────────────────────────────────────────────────
  const TABS = [
    { id: "dashboard", label: "Tableau de bord", icon: "📊" },
    { id: "log", label: "Journal", icon: "✏️" },
    { id: "aliments", label: "Aliments", icon: "🥗" },
    { id: "plan", label: "Plan repas", icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf9", fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80 }}>
      {/* Saved indicator */}
      <div style={{ position: "fixed", top: 16, right: 16, background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 700, zIndex: 200, opacity: saved ? 1 : 0, transition: "opacity 0.3s", pointerEvents: "none" }}>
        ✓ Sauvegardé
      </div>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f2027 0%, #1e3a2f 100%)", padding: "20px 20px 28px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, color: "#6ee7b7", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Bonjour 👋</p>
            <h2 style={{ margin: "4px 0 0", fontFamily: "'DM Serif Display', serif", fontSize: 24, letterSpacing: "-0.02em" }}>{profile.name}</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#4ade80" }}>
              {GOAL_LABELS[profile.goal]}
            </div>
            <button onClick={() => { if (window.confirm("Réinitialiser le profil ?")) { localStorage.removeItem("nutricoach_profile"); setProfile(null); setLog([]); setSetupStep(0); }}}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer", padding: 0 }}>
              Changer de profil
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", marginBottom: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Calories du jour</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <CalRing eaten={totals.cal} target={targets.cal} />
                <div style={{ flex: 1 }}>
                  <MacroBar label="Protéines" value={totals.protein} max={targets.protein} color="linear-gradient(90deg, #f97316, #fb923c)" />
                  <MacroBar label="Glucides" value={totals.carbs} max={targets.carbs} color="linear-gradient(90deg, #3b82f6, #60a5fa)" />
                  <MacroBar label="Lipides" value={totals.fat} max={targets.fat} color="linear-gradient(90deg, #a855f7, #c084fc)" />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Objectif cal.", value: targets.cal + " kcal", icon: "🎯", bg: "#ecfdf5", accent: "#059669" },
                { label: "Poids", value: profile.weight + " kg", icon: "⚖️", bg: "#eff6ff", accent: "#3b82f6" },
                { label: "Protéines obj.", value: targets.protein + "g", icon: "💪", bg: "#fff7ed", accent: "#f97316" },
                { label: "Aliments logués", value: log.length, icon: "📝", bg: "#fdf4ff", accent: "#a855f7" },
              ].map((card, i) => (
                <div key={i} style={{ background: card.bg, borderRadius: 16, padding: "16px", border: `1px solid ${card.accent}22` }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{card.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: card.accent, fontFamily: "'DM Serif Display', serif" }}>{card.value}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{card.label}</div>
                </div>
              ))}
            </div>
            {log.length > 0 ? (
              <div style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Derniers ajouts</h3>
                {log.slice(-4).reverse().map((entry, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>{entry.food.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{entry.meal} · ×{entry.qty}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#059669" }}>{Math.round(entry.food.cal * entry.qty)} kcal</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{Math.round(entry.food.p * entry.qty)}g prot.</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 20px", background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🥗</div>
                <p style={{ color: "#6b7280", margin: 0, fontWeight: 500 }}>Commence à logger tes repas !</p>
                <button onClick={() => setTab("log")} style={{ marginTop: 14, background: "#ecfdf5", color: "#059669", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                  Ajouter un aliment →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── JOURNAL ── */}
        {tab === "log" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1f2937" }}>Journal du jour</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {log.length > 0 && (
                  <button onClick={() => { if (window.confirm("Effacer tout le journal ?")) setLog([]); }}
                    style={{ background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 10, padding: "10px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                    Effacer
                  </button>
                )}
                <button onClick={() => setShowAddModal(true)}
                  style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0f2027", border: "none", borderRadius: 12, padding: "10px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                  + Ajouter
                </button>
              </div>
            </div>
            {mealsByTime.map(meal => {
              const mealEntries = log.filter(e => e.meal === meal);
              const mealCal = mealEntries.reduce((s, e) => s + e.food.cal * e.qty, 0);
              return (
                <div key={meal} style={{ background: "#fff", borderRadius: 18, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: "#1f2937", fontSize: 14 }}>{meal}</span>
                    {mealCal > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>{Math.round(mealCal)} kcal</span>}
                  </div>
                  {mealEntries.length === 0 ? (
                    <div style={{ padding: "16px", color: "#d1d5db", fontSize: 13, textAlign: "center" }}>
                      Aucun aliment · <span style={{ cursor: "pointer", color: "#059669" }} onClick={() => { setQtyMeal(meal); setShowAddModal(true); }}>+ ajouter</span>
                    </div>
                  ) : (
                    mealEntries.map((entry, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: i < mealEntries.length - 1 ? "1px solid #f9fafb" : "none" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{entry.food.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{entry.food.unit} · ×{entry.qty} · P:{Math.round(entry.food.p * entry.qty)}g G:{Math.round(entry.food.c * entry.qty)}g L:{Math.round(entry.food.f * entry.qty)}g</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>{Math.round(entry.food.cal * entry.qty)}</span>
                          <button onClick={() => setLog(l => l.filter((_, idx) => idx !== log.indexOf(entry)))}
                            style={{ background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>✕</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── ALIMENTS ── */}
        {tab === "aliments" && (
          <div>
            <h2 style={{ margin: "0 0 14px", fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1f2937" }}>Base d'aliments</h2>
            <input placeholder="🔍 Rechercher un aliment..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "13px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 14 }} />
            {filteredFoods.map(food => (
              <div key={food.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.04)", cursor: "pointer" }}
                onClick={() => { setSelectedFood(food); setQty(1); setShowAddModal(true); }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1f2937" }}>{food.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{food.unit}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#059669", fontSize: 14 }}>{food.cal} kcal</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>P:{food.p}g G:{food.c}g L:{food.f}g</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PLAN REPAS ── */}
        {tab === "plan" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1f2937" }}>Plan de repas</h2>
              <div style={{ display: "flex", gap: 6 }}>
                {[["muscle", "💪"], ["seche", "🔥"], ["maintien", "⚖️"]].map(([g, e]) => (
                  <button key={g} onClick={() => setPlanGoal(g)}
                    style={{ background: planGoal === g ? "#ecfdf5" : "#f3f4f6", color: planGoal === g ? "#059669" : "#9ca3af", border: `1px solid ${planGoal === g ? "#059669" : "transparent"}`, borderRadius: 10, padding: "6px 10px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            {targets && (
              <div style={{ background: "linear-gradient(135deg, #0f2027, #1e3a2f)", borderRadius: 18, padding: "16px 20px", marginBottom: 16, color: "#fff" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#6ee7b7", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Objectifs journaliers</p>
                <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                  {[["cal", "kcal", "#fff"], ["protein", "g prot.", "#fb923c"], ["carbs", "g gluc.", "#60a5fa"], ["fat", "g lip.", "#c084fc"]].map(([k, u, c]) => (
                    <div key={k}>
                      <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'DM Serif Display', serif", color: c }}>{targets[k]}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{u}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {mealPlan.map((meal, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 18, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f9fafb" }}>
                  <span style={{ fontWeight: 700, color: "#1f2937", fontSize: 15 }}>{meal.emoji} {meal.name}</span>
                </div>
                {meal.items.map((food, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: j < meal.items.length - 1 ? "1px solid #f9fafb" : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{food.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{food.unit}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{food.cal} kcal</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>P:{food.p}g</div>
                      </div>
                      <button onClick={() => setLog(l => [...l, { food, qty: 1, meal: meal.name }])}
                        style={{ background: "#ecfdf5", color: "#059669", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontWeight: 800, fontSize: 16 }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL AJOUT ── */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={() => { setShowAddModal(false); setSelectedFood(null); setSearch(""); }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 480, borderRadius: "24px 24px 0 0", padding: "24px 20px 40px", maxHeight: "80vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 999, margin: "0 auto 20px" }} />
            {!selectedFood ? (
              <>
                <h3 style={{ margin: "0 0 16px", fontSize: 18, fontFamily: "'DM Serif Display', serif" }}>Choisir un aliment</h3>
                <input placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} autoFocus
                  style={{ width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
                {filteredFoods.map(food => (
                  <div key={food.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 4px", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
                    onClick={() => { setSelectedFood(food); setQty(1); }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{food.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{food.unit}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: "#059669", fontSize: 13 }}>{food.cal} kcal</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <button onClick={() => setSelectedFood(null)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 0, fontSize: 13, marginBottom: 12 }}>← Retour</button>
                <h3 style={{ margin: "0 0 4px", fontSize: 18, fontFamily: "'DM Serif Display', serif" }}>{selectedFood.name}</h3>
                <p style={{ color: "#9ca3af", margin: "0 0 20px", fontSize: 13 }}>{selectedFood.unit}</p>
                <div style={{ background: "#f9fafb", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                    {[["Calories", Math.round(selectedFood.cal * qty) + " kcal", "#059669"], ["Prot.", Math.round(selectedFood.p * qty) + "g", "#f97316"], ["Glucides", Math.round(selectedFood.c * qty) + "g", "#3b82f6"], ["Lipides", Math.round(selectedFood.f * qty) + "g", "#a855f7"]].map(([l, v, c]) => (
                      <div key={l}><div style={{ fontSize: 16, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase" }}>{l}</div></div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Quantité (×)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => setQty(q => Math.max(0.5, +(q - 0.5).toFixed(1)))}
                      style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontSize: 20, cursor: "pointer" }}>−</button>
                    <input type="number" value={qty} min={0.5} step={0.5} onChange={e => setQty(+e.target.value)}
                      style={{ flex: 1, textAlign: "center", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px", fontWeight: 700, fontSize: 18, outline: "none" }} />
                    <button onClick={() => setQty(q => +(q + 0.5).toFixed(1))}
                      style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontSize: 20, cursor: "pointer" }}>+</button>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Repas</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {mealsByTime.map(m => (
                      <button key={m} onClick={() => setQtyMeal(m)}
                        style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid", borderColor: qtyMeal === m ? "#059669" : "#e5e7eb", background: qtyMeal === m ? "#ecfdf5" : "#fff", color: qtyMeal === m ? "#059669" : "#6b7280", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setLog(l => [...l, { food: selectedFood, qty, meal: qtyMeal }]); setShowAddModal(false); setSelectedFood(null); setSearch(""); }}
                  style={{ width: "100%", background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#0f2027", border: "none", borderRadius: 14, padding: "15px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                  ✓ Ajouter au journal
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid #e5e7eb", display: "flex", padding: "8px 0 16px", zIndex: 50 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 0" }}>
            <span style={{ fontSize: tab === t.id ? 22 : 20, transition: "font-size 0.15s" }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "#059669" : "#9ca3af" }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 3, background: "#059669", borderRadius: 999, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
