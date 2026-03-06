import { useState, useMemo, useCallback } from "react";

const FOODS = {
  poulet:        { name: "Blanc de poulet",     cal: 165, p: 31.0, c: 0.0,  f: 3.6,  emoji: "🍗", type: "protein" },
  dinde:         { name: "Blanc de dinde",      cal: 135, p: 30.0, c: 0.0,  f: 1.5,  emoji: "🦃", type: "protein" },
  saumon:        { name: "Saumon",              cal: 206, p: 20.0, c: 0.0,  f: 13.0, emoji: "🐟", type: "protein" },
  thon:          { name: "Thon (eau)",          cal: 116, p: 26.0, c: 0.0,  f: 1.0,  emoji: "🐠", type: "protein" },
  crevettes:     { name: "Crevettes",           cal: 99,  p: 21.0, c: 0.0,  f: 1.5,  emoji: "🦐", type: "protein" },
  cabillaud:     { name: "Cabillaud",           cal: 82,  p: 18.0, c: 0.0,  f: 0.7,  emoji: "🐡", type: "protein" },
  oeuf:          { name: "Œuf entier",          cal: 155, p: 13.0, c: 1.1,  f: 11.0, emoji: "🥚", type: "protein" },
  blanc_oeuf:    { name: "Blanc d'œuf",         cal: 52,  p: 11.0, c: 0.7,  f: 0.2,  emoji: "🥚", type: "protein" },
  boeuf:         { name: "Bœuf maigre",         cal: 172, p: 26.0, c: 0.0,  f: 7.0,  emoji: "🥩", type: "protein" },
  cottage:       { name: "Cottage cheese",      cal: 98,  p: 11.0, c: 3.4,  f: 4.3,  emoji: "🧀", type: "protein" },
  yaourt_grec:   { name: "Yaourt grec 0%",      cal: 60,  p: 10.0, c: 4.0,  f: 0.3,  emoji: "🥛", type: "protein" },
  fromage_blanc: { name: "Fromage blanc 0%",    cal: 45,  p: 7.8,  c: 4.5,  f: 0.1,  emoji: "🥛", type: "protein" },
  skyr:          { name: "Skyr nature",         cal: 63,  p: 11.0, c: 4.0,  f: 0.2,  emoji: "🥛", type: "protein" },
  whey:          { name: "Whey protéine",       cal: 400, p: 80.0, c: 10.0, f: 5.0,  emoji: "💪", type: "protein" },
  ricotta:       { name: "Ricotta légère",      cal: 138, p: 9.0,  c: 3.0,  f: 10.0, emoji: "🧀", type: "protein" },
  mozzarella:    { name: "Mozzarella light",    cal: 156, p: 18.0, c: 2.0,  f: 9.0,  emoji: "🧀", type: "protein" },
  riz:           { name: "Riz basmati",         cal: 130, p: 2.7,  c: 28.0, f: 0.3,  emoji: "🍚", type: "carb" },
  riz_complet:   { name: "Riz complet",         cal: 112, p: 2.6,  c: 23.0, f: 0.9,  emoji: "🍚", type: "carb" },
  patate_douce:  { name: "Patate douce",        cal: 90,  p: 1.6,  c: 20.0, f: 0.1,  emoji: "🍠", type: "carb" },
  pomme_terre:   { name: "Pomme de terre",      cal: 77,  p: 2.0,  c: 17.0, f: 0.1,  emoji: "🥔", type: "carb" },
  avoine:        { name: "Flocons d'avoine",    cal: 367, p: 13.0, c: 62.0, f: 7.0,  emoji: "🌾", type: "carb" },
  quinoa:        { name: "Quinoa",              cal: 120, p: 4.4,  c: 21.0, f: 1.9,  emoji: "🌱", type: "carb" },
  pain_seigle:   { name: "Pain de seigle",      cal: 259, p: 8.5,  c: 48.0, f: 3.3,  emoji: "🍞", type: "carb" },
  pain_complet:  { name: "Pain complet",        cal: 247, p: 9.0,  c: 46.0, f: 3.0,  emoji: "🍞", type: "carb" },
  lentilles:     { name: "Lentilles",           cal: 116, p: 9.0,  c: 20.0, f: 0.4,  emoji: "🫘", type: "carb" },
  pois_chiches:  { name: "Pois chiches",        cal: 164, p: 8.9,  c: 27.0, f: 2.6,  emoji: "🫘", type: "carb" },
  haricots:      { name: "Haricots rouges",     cal: 127, p: 8.7,  c: 22.0, f: 0.5,  emoji: "🫘", type: "carb" },
  pates:         { name: "Pâtes complètes",     cal: 131, p: 5.5,  c: 25.0, f: 0.9,  emoji: "🍝", type: "carb" },
  banane:        { name: "Banane",              cal: 89,  p: 1.1,  c: 23.0, f: 0.3,  emoji: "🍌", type: "fruit" },
  myrtilles:     { name: "Myrtilles",           cal: 57,  p: 0.7,  c: 14.0, f: 0.3,  emoji: "🫐", type: "fruit" },
  fraises:       { name: "Fraises",             cal: 32,  p: 0.7,  c: 7.7,  f: 0.3,  emoji: "🍓", type: "fruit" },
  pomme:         { name: "Pomme",               cal: 52,  p: 0.3,  c: 14.0, f: 0.2,  emoji: "🍎", type: "fruit" },
  mangue:        { name: "Mangue",              cal: 65,  p: 0.5,  c: 15.0, f: 0.3,  emoji: "🥭", type: "fruit" },
  avocat:        { name: "Avocat",              cal: 160, p: 2.0,  c: 9.0,  f: 15.0, emoji: "🥑", type: "fat" },
  amandes:       { name: "Amandes",             cal: 579, p: 21.0, c: 22.0, f: 50.0, emoji: "🥜", type: "fat" },
  noix:          { name: "Noix",                cal: 654, p: 15.0, c: 14.0, f: 65.0, emoji: "🌰", type: "fat" },
  huile_olive:   { name: "Huile d'olive",       cal: 884, p: 0.0,  c: 0.0,  f: 100.0,emoji: "🫒", type: "fat" },
  beurre_cac:    { name: "Beurre de cacahuète", cal: 588, p: 25.0, c: 20.0, f: 50.0, emoji: "🥜", type: "fat" },
  tahini:        { name: "Tahini",              cal: 595, p: 17.0, c: 21.0, f: 54.0, emoji: "🌰", type: "fat" },
  graines_chia:  { name: "Graines de chia",     cal: 486, p: 17.0, c: 42.0, f: 31.0, emoji: "🌱", type: "fat" },
  brocoli:       { name: "Brocoli",             cal: 35,  p: 2.4,  c: 7.0,  f: 0.4,  emoji: "🥦", type: "veggie" },
  epinards:      { name: "Épinards",            cal: 23,  p: 2.9,  c: 3.6,  f: 0.4,  emoji: "🥬", type: "veggie" },
  courgette:     { name: "Courgette",           cal: 17,  p: 1.2,  c: 3.1,  f: 0.3,  emoji: "🥒", type: "veggie" },
  tomate:        { name: "Tomate",              cal: 18,  p: 0.9,  c: 3.5,  f: 0.2,  emoji: "🍅", type: "veggie" },
  concombre:     { name: "Concombre",           cal: 12,  p: 0.6,  c: 2.2,  f: 0.1,  emoji: "🥒", type: "veggie" },
  poivron:       { name: "Poivron",             cal: 26,  p: 1.0,  c: 5.0,  f: 0.2,  emoji: "🫑", type: "veggie" },
  champignon:    { name: "Champignons",         cal: 22,  p: 3.1,  c: 3.3,  f: 0.3,  emoji: "🍄", type: "veggie" },
  haricots_verts:{ name: "Haricots verts",      cal: 31,  p: 1.8,  c: 7.0,  f: 0.1,  emoji: "🫛", type: "veggie" },
  asperges:      { name: "Asperges",            cal: 20,  p: 2.2,  c: 3.9,  f: 0.1,  emoji: "🥗", type: "veggie" },
  salade:        { name: "Salade verte",        cal: 15,  p: 1.4,  c: 2.9,  f: 0.2,  emoji: "🥬", type: "veggie" },
  carotte:       { name: "Carottes",            cal: 41,  p: 0.9,  c: 10.0, f: 0.2,  emoji: "🥕", type: "veggie" },
  lait_amande:   { name: "Lait d'amande",       cal: 24,  p: 0.6,  c: 3.0,  f: 1.1,  emoji: "🥛", type: "liquid" },
  cacao:         { name: "Cacao en poudre",     cal: 228, p: 20.0, c: 54.0, f: 14.0, emoji: "🍫", type: "extra" },
  miel:          { name: "Miel",                cal: 304, p: 0.3,  c: 82.0, f: 0.0,  emoji: "🍯", type: "extra" },
};

// Templates : chaque combinaison génère une recette unique
const TEMPLATES = {
  seche: {
    "Petit-déjeuner": [
      { name: "Bowl protéiné aux {fruit}", emoji:"🫐", proteins:["skyr","yaourt_grec","fromage_blanc","cottage","blanc_oeuf"], carbs:["avoine"], fruits:["myrtilles","fraises","pomme","mangue","banane"], fats:["graines_chia"], veggies:[], qty:{protein:180,carb:40,fruit:80,fat:8}, desc:(p,_,fr)=>`Un bol ultra-protéiné pour démarrer en sèche. Le ${FOODS[p]?.name} apporte les protéines sans les lipides. Les ${FOODS[fr]?.name} fournissent antioxydants et vitamines. Les graines de chia créent la satiété durable.` },
      { name: "Omelette aux {veggie}", emoji:"🥚", proteins:["blanc_oeuf","oeuf"], carbs:[], fruits:[], fats:[], veggies:["epinards","champignon","poivron","tomate","courgette","asperges","haricots_verts"], qty:{protein:200,veggie:150}, desc:(p,_,__,v)=>`L'omelette sèche par excellence. Les ${FOODS[p]?.name}s sont la source de protéines la plus pure : zéro glucide, minimal en lipides. Les ${FOODS[v]?.name} apportent fer, magnésium et vitamines B pour l'énergie matinale.` },
      { name: "Toast {protein} & {veggie}", emoji:"🍞", proteins:["thon","cottage","fromage_blanc","skyr","blanc_oeuf"], carbs:["pain_seigle","pain_complet"], fruits:[], fats:[], veggies:["concombre","tomate","salade","poivron","asperges"], qty:{protein:100,carb:60,veggie:80}, desc:(p,c,_,v)=>`Le petit-déjeuner salé parfait en sèche. Le pain ${FOODS[c]?.name} à IG bas libère l'énergie lentement. Le ${FOODS[p]?.name} apporte les protéines dès le matin. Les ${FOODS[v]?.name} rafraîchissent et hydratent le corps.` },
      { name: "Shake minceur {fruit}", emoji:"💜", proteins:["whey","skyr","fromage_blanc"], carbs:[], fruits:["myrtilles","fraises","pomme","mangue","banane"], fats:["graines_chia"], veggies:[], qty:{protein:120,fruit:80,fat:8}, desc:(p,_,fr)=>`Le shake express de la sèche. La ${FOODS[p]?.name} fournit les acides aminés essentiels en quelques minutes. Les ${FOODS[fr]?.name} apportent vitamine C et antioxydants. Les graines de chia créent une texture rassasiante.` },
      { name: "Yaourt & {fruit} & chia", emoji:"🍓", proteins:["yaourt_grec","skyr","fromage_blanc"], carbs:[], fruits:["fraises","myrtilles","pomme","mangue"], fats:["graines_chia","amandes"], veggies:[], qty:{protein:200,fruit:90,fat:12}, desc:(p,_,fr)=>`La recette minimaliste mais redoutable. Le ${FOODS[p]?.name} a un rapport protéines/calories imbattable en sèche. Les ${FOODS[fr]?.name} sucrées naturellement évitent tout sucre ajouté.` },
      { name: "Shake cacao protéiné", emoji:"🍫", proteins:["whey","fromage_blanc","skyr"], carbs:["avoine"], fruits:["banane","myrtilles"], fats:[], veggies:[], qty:{protein:100,carb:40,fruit:60}, desc:(p,c,fr)=>`Un shake chocolaté zéro culpabilité. Le cacao cru est riche en magnésium anti-fatigue. La ${FOODS[p]?.name} + les ${FOODS[c]?.name} forment un combo satiété/énergie parfait pour tenir jusqu'au déjeuner.` },
    ],
    "Déjeuner": [
      { name: "Bowl {protein} & {carb} & {veggie}", emoji:"🥗", proteins:["poulet","dinde","cabillaud","crevettes","thon","blanc_oeuf"], carbs:["quinoa","riz_complet","lentilles","pois_chiches"], fruits:[], fats:["huile_olive"], veggies:["brocoli","epinards","haricots_verts","asperges","courgette","carotte"], qty:{protein:160,carb:70,fat:5,veggie:180}, desc:(p,c,_,v)=>`Le bowl sèche calibré. Le ${FOODS[p]?.name} est une protéine maigre complète. Le ${FOODS[c]?.name} fournit les glucides complexes sans faire grimper l'insuline. Les ${FOODS[v]?.name} apportent fibres et micronutriments essentiels.` },
      { name: "Salade {protein} & {carb}", emoji:"🥗", proteins:["thon","poulet","crevettes","cabillaud","dinde"], carbs:["lentilles","pois_chiches","haricots"], fruits:[], fats:["huile_olive"], veggies:["salade","concombre","tomate","poivron","carotte","champignon"], qty:{protein:140,carb:80,fat:5,veggie:100}, desc:(p,c,_,v)=>`Une salade complète et rassasiante. Le ${FOODS[p]?.name} maigre + les ${FOODS[c]?.name} riches en fibres forment un repas complet minceur. L'huile d'olive vierge extra apporte les graisses mono-insaturées cardioprotectrices.` },
      { name: "{protein} vapeur & {veggie}", emoji:"🐡", proteins:["cabillaud","saumon","crevettes","dinde","poulet"], carbs:["patate_douce","riz_complet","quinoa"], fruits:[], fats:["huile_olive"], veggies:["brocoli","courgette","asperges","epinards","haricots_verts"], qty:{protein:180,carb:90,fat:5,veggie:150}, desc:(p,c,_,v)=>`La cuisson vapeur préserve tous les nutriments sans matière grasse. Le ${FOODS[p]?.name} reste tendre et juteux. La ${FOODS[c]?.name} à IG bas recharge l'énergie proprement. Les ${FOODS[v]?.name} complètent avec leurs minéraux.` },
      { name: "Wok {protein} & {veggie}", emoji:"🥢", proteins:["poulet","dinde","crevettes","cabillaud","boeuf"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["champignon","poivron","brocoli","courgette","epinards","carotte","haricots_verts"], qty:{protein:160,fat:8,veggie:200}, desc:(p,_,__,v)=>`Le wok sèche ultra-rapide. Cuisson à haute température, saveurs caramélisées, zéro excès de matière grasse. Le ${FOODS[p]?.name} sauté reste tendre et les ${FOODS[v]?.name} conservent leur croquant et vitamines.` },
      { name: "Wrap {protein} & {veggie}", emoji:"🌯", proteins:["dinde","poulet","thon","crevettes","cabillaud"], carbs:["pain_seigle","pain_complet"], fruits:[], fats:[], veggies:["salade","tomate","concombre","poivron","carotte"], qty:{protein:130,carb:60,veggie:100}, desc:(p,c,_,v)=>`Le déjeuner nomade de la sèche. Le ${FOODS[p]?.name} froid est pratique et riche en protéines. Le pain ${FOODS[c]?.name} à IG bas évite les coups de barre. Les ${FOODS[v]?.name} croquants apportent fraîcheur et vitamines.` },
      { name: "Salade tiède {protein} & {carb}", emoji:"🌿", proteins:["poulet","saumon","crevettes","thon"], carbs:["quinoa","lentilles","riz_complet","pois_chiches"], fruits:[], fats:["huile_olive"], veggies:["epinards","tomate","asperges","champignon","poivron"], qty:{protein:150,carb:80,fat:6,veggie:130}, desc:(p,c,_,v)=>`Une salade tiède réconfortante qui garde tous les bénéfices d'un repas chaud avec la légèreté d'une salade. Le ${FOODS[p]?.name} grillé sur un lit de ${FOODS[c]?.name} et de ${FOODS[v]?.name} — un classique diététique revisité.` },
    ],
    "Dîner": [
      { name: "{protein} grillé & {veggie}", emoji:"🍗", proteins:["saumon","cabillaud","poulet","crevettes","dinde","thon"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["asperges","brocoli","epinards","courgette","haricots_verts","champignon"], qty:{protein:160,fat:5,veggie:220}, desc:(p,_,__,v)=>`Le dîner sèche idéal : riche en protéines, pauvre en glucides. Le ${FOODS[p]?.name} grillé favorise la récupération nocturne. Les ${FOODS[v]?.name} sont diurétiques et drainants — parfaits pour l'élimination nocturne.` },
      { name: "Omelette {veggie} du soir", emoji:"🍳", proteins:["oeuf","blanc_oeuf"], carbs:[], fruits:[], fats:[], veggies:["champignon","epinards","poivron","courgette","tomate","asperges"], qty:{protein:180,veggie:150}, desc:(p,_,__,v)=>`L'omelette du soir — simple, rapide, efficace. Les ${FOODS[p]?.name}s en soirée apportent des protéines à digestion modérée. Les ${FOODS[v]?.name} sautés apportent saveur et micronutriments. Prêt en 5 minutes.` },
      { name: "Papillote de {protein} & {veggie}", emoji:"📦", proteins:["saumon","cabillaud","crevettes","dinde"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["courgette","poivron","tomate","champignon","asperges","carotte"], qty:{protein:180,fat:5,veggie:180}, desc:(p,_,__,v)=>`La technique culinaire reine de la sèche. Aucune matière grasse ajoutée, tous les nutriments préservés. Le ${FOODS[p]?.name} fondant avec les ${FOODS[v]?.name} confits — un dîner gastronomique et diététique.` },
      { name: "Bowl zéro-carb {protein}", emoji:"🥣", proteins:["thon","poulet","dinde","cabillaud","crevettes"], carbs:[], fruits:[], fats:["avocat","huile_olive"], veggies:["salade","concombre","tomate","poivron","epinards","carotte"], qty:{protein:160,fat:50,veggie:150}, desc:(p,_,__,v)=>`Le dîner zéro glucide pour maximiser la lipolyse nocturne. Sans glucides le soir, le corps puise dans les réserves de graisse pendant le sommeil. Le ${FOODS[p]?.name} et l'avocat apportent les nutriments essentiels.` },
      { name: "Soupe détox {protein} & {veggie}", emoji:"🍲", proteins:["cabillaud","crevettes","poulet","dinde"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["courgette","carotte","epinards","poivron","tomate","champignon"], qty:{protein:150,fat:5,veggie:250}, desc:(p,_,__,v)=>`Une soupe chaude et réconfortante, parfaite pour finir la journée légèrement. Le ${FOODS[p]?.name} pochée dans le bouillon apporte des protéines douces. Les ${FOODS[v]?.name} fondantes libèrent tous leurs minéraux.` },
      { name: "{protein} en croûte d'herbes & {veggie}", emoji:"✨", proteins:["saumon","poulet","cabillaud","dinde"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["haricots_verts","asperges","brocoli","epinards","courgette"], qty:{protein:160,fat:6,veggie:200}, desc:(p,_,__,v)=>`Un dîner élégant et léger. Le ${FOODS[p]?.name} en croûte d'herbes aromatiques développe des arômes intenses avec très peu de matière grasse. Les ${FOODS[v]?.name} vapeur complètent ce repas gastronomique diététique.` },
    ],
    "Collation": [
      { name: "Shake {protein} & {fruit}", emoji:"💪", proteins:["whey","skyr","fromage_blanc"], carbs:[], fruits:["fraises","myrtilles","pomme","mangue","banane"], fats:[], veggies:[], qty:{protein:110,fruit:80}, desc:(p,_,fr)=>`La collation express anti-fringale. La ${FOODS[p]?.name} apporte les acides aminés entre les repas pour éviter le catabolisme. Les ${FOODS[fr]?.name} sucrées naturellement rendent ce shake délicieux sans calories vides.` },
      { name: "{protein} & crudités {veggie}", emoji:"🥒", proteins:["thon","cottage","fromage_blanc","skyr"], carbs:[], fruits:[], fats:[], veggies:["concombre","carotte","poivron","tomate","asperges","celeri"], qty:{protein:120,veggie:150}, desc:(p,_,__,v)=>`La collation la plus simple de la sèche. Le ${FOODS[p]?.name} apporte des protéines rassasiantes, les ${FOODS[v]?.name} croquants la texture et les fibres. Zéro préparation, zéro compromis.` },
      { name: "Yaourt {protein} & {fruit}", emoji:"🍓", proteins:["yaourt_grec","skyr","fromage_blanc","cottage"], carbs:[], fruits:["fraises","myrtilles","pomme","mangue"], fats:["graines_chia"], veggies:[], qty:{protein:180,fruit:80,fat:8}, desc:(p,_,fr)=>`Collation fraîche et antioxydante. La caséine du ${FOODS[p]?.name} nourrit les muscles durablement. Les ${FOODS[fr]?.name} sont riches en vitamine C et polyphénols anti-inflammatoires.` },
      { name: "Mini-omelette express {veggie}", emoji:"🥚", proteins:["blanc_oeuf","oeuf"], carbs:[], fruits:[], fats:[], veggies:["champignon","poivron","tomate","epinards"], qty:{protein:150,veggie:100}, desc:(p,_,__,v)=>`La collation salée protéinée. Deux ${FOODS[p]?.name}s battus avec des ${FOODS[v]?.name} — une mini-omelette prête en 3 minutes qui cale efficacement entre les repas.` },
    ],
  },

  maintien: {
    "Petit-déjeuner": [
      { name: "Porridge {fruit} & {fat}", emoji:"🌾", proteins:["yaourt_grec","skyr","fromage_blanc"], carbs:["avoine"], fruits:["banane","myrtilles","fraises","pomme","mangue"], fats:["amandes","graines_chia","noix","beurre_cac"], veggies:[], qty:{protein:120,carb:80,fruit:80,fat:20}, desc:(p,c,fr,_,fat)=>`Le petit-déjeuner maintien par excellence. Les ${FOODS[c]?.name} libèrent l'énergie progressivement grâce à leurs fibres solubles. Le ${FOODS[p]?.name} complète avec les protéines. Les ${FOODS[fr]?.name} et ${FOODS[fat]?.name} finalisent ce bol complet.` },
      { name: "Toast avocat & {protein}", emoji:"🥑", proteins:["oeuf","saumon","cottage","ricotta","blanc_oeuf"], carbs:["pain_complet","pain_seigle"], fruits:[], fats:["avocat"], veggies:["tomate","epinards","salade","concombre"], qty:{protein:100,carb:80,fat:80,veggie:60}, desc:(p,c,_,v)=>`Le toast équilibré tendance. L'avocat apporte des acides gras mono-insaturés excellents pour le cœur. Le ${FOODS[p]?.name} complète avec les protéines. Le pain ${FOODS[c]?.name} fournit l'énergie durable de la matinée.` },
      { name: "Pancakes {carb} & {fruit}", emoji:"🥞", proteins:["oeuf","fromage_blanc","ricotta"], carbs:["avoine","banane"], fruits:["banane","myrtilles","fraises","mangue"], fats:["beurre_cac","miel"], veggies:[], qty:{protein:120,carb:80,fruit:80,fat:15}, desc:(p,c,fr)=>`Des pancakes moelleux sans culpabilité. Les ${FOODS[p]?.name}s et les ${FOODS[c]?.name} forment une pâte naturellement sucrée. Les ${FOODS[fr]?.name} sur le dessus apportent leur douceur naturelle et leurs vitamines.` },
      { name: "Smoothie bowl {fruit} & {fat}", emoji:"🍌", proteins:["yaourt_grec","skyr"], carbs:["avoine"], fruits:["myrtilles","fraises","mangue","banane","pomme"], fats:["graines_chia","amandes","noix","tahini"], veggies:[], qty:{protein:150,carb:60,fruit:100,fat:20}, desc:(p,c,fr,_,fat)=>`Un smoothie bowl coloré et nutritif. La base ${FOODS[p]?.name} crémeuse et protéinée, les ${FOODS[fr]?.name} en garniture pour les antioxydants, les ${FOODS[fat]?.name} pour le croquant et les bons gras. Un breakfast Instagram-worthy.` },
      { name: "Bowl skyr {fruit} & {fat}", emoji:"🫐", proteins:["skyr","yaourt_grec"], carbs:[], fruits:["myrtilles","mangue","banane","fraises","pomme"], fats:["noix","amandes","graines_chia","beurre_cac"], veggies:[], qty:{protein:200,fruit:100,fat:25}, desc:(p,_,fr,__,fat)=>`Un bol crémeux et nutritif. Le ${FOODS[p]?.name} islandais est riche en protéines et en probiotiques bénéfiques. Les ${FOODS[fr]?.name} apportent antioxydants et saveur, les ${FOODS[fat]?.name} les bonnes graisses et le croquant.` },
      { name: "Granola maison {fruit}", emoji:"🌰", proteins:["yaourt_grec","fromage_blanc"], carbs:["avoine"], fruits:["myrtilles","fraises","banane","pomme","mangue"], fats:["amandes","noix","graines_chia"], veggies:[], qty:{protein:150,carb:60,fruit:80,fat:20}, desc:(p,c,fr,_,fat)=>`Le granola maison sain et gourmand. Les ${FOODS[c]?.name} grillés avec les ${FOODS[fat]?.name} créent ce croquant irrésistible. Les ${FOODS[fr]?.name} fraîches apportent la touche fruitée. À préparer en grande quantité le dimanche.` },
    ],
    "Déjeuner": [
      { name: "Bowl {protein} & {carb} complet", emoji:"🍚", proteins:["poulet","dinde","saumon","boeuf","crevettes","oeuf"], carbs:["riz","quinoa","patate_douce","pates","riz_complet","pomme_terre"], fruits:[], fats:["huile_olive"], veggies:["brocoli","poivron","tomate","courgette","epinards","champignon"], qty:{protein:140,carb:110,fat:8,veggie:140}, desc:(p,c,_,v)=>`Le bowl maintien idéalement équilibré. Le ${FOODS[p]?.name} fournit les protéines pour la réparation musculaire. Le ${FOODS[c]?.name} apporte l'énergie complexe. Les ${FOODS[v]?.name} complètent avec fibres et micronutriments. Macros : 35/40/25.` },
      { name: "Salade {carb} & {protein}", emoji:"🌱", proteins:["poulet","thon","crevettes","saumon","cottage"], carbs:["quinoa","lentilles","pois_chiches","haricots"], fruits:[], fats:["huile_olive","avocat","tahini"], veggies:["epinards","tomate","concombre","poivron","salade","carotte"], qty:{protein:120,carb:100,fat:12,veggie:100}, desc:(p,c,_,v)=>`Une salade complète et nutritive. Le ${FOODS[c]?.name} apporte protéines végétales et fibres. Le ${FOODS[p]?.name} complète avec les acides aminés essentiels. Un repas du déjeuner à la fois nourrissant et digeste.` },
      { name: "Pâtes {protein} & {veggie}", emoji:"🍝", proteins:["poulet","saumon","crevettes","boeuf","ricotta"], carbs:["pates"], fruits:[], fats:["huile_olive","mozzarella"], veggies:["poivron","champignon","tomate","courgette","epinards","asperges"], qty:{protein:130,carb:130,fat:12,veggie:100}, desc:(p,c,_,v)=>`Les pâtes complètes sont excellentes en maintien ! Leur IG bas libère l'énergie progressivement. Le ${FOODS[p]?.name} et les ${FOODS[v]?.name} forment un plat complet savoureux et bien équilibré.` },
      { name: "Wrap {protein} & {fat}", emoji:"🌯", proteins:["poulet","dinde","saumon","boeuf","thon"], carbs:["pain_complet","pain_seigle"], fruits:[], fats:["avocat","beurre_cac","tahini"], veggies:["salade","tomate","concombre","poivron","carotte"], qty:{protein:130,carb:80,fat:70,veggie:80}, desc:(p,c,_,v,fat)=>`Le wrap du déjeuner généreux et équilibré. Le ${FOODS[p]?.name} avec le ${FOODS[fat]?.name} crémeux dans un pain ${FOODS[c]?.name} — un combo rassasiant qui dure jusqu'au dîner. Les légumes apportent la fraîcheur et les vitamines.` },
      { name: "{protein} & {carb} mijoté", emoji:"🫘", proteins:["boeuf","poulet","dinde","saumon"], carbs:["lentilles","haricots","pois_chiches","quinoa"], fruits:[], fats:["huile_olive"], veggies:["carotte","tomate","epinards","champignon","courgette"], qty:{protein:150,carb:120,fat:8,veggie:100}, desc:(p,c,_,v)=>`Un plat mijoté réconfortant et nutritif. Les ${FOODS[c]?.name} mijotées sont riches en fer, protéines végétales et fibres. Le ${FOODS[p]?.name} complète avec les protéines animales. Parfait à préparer en grande quantité.` },
      { name: "Risotto léger {protein} & {veggie}", emoji:"🍚", proteins:["crevettes","saumon","poulet","ricotta"], carbs:["riz","riz_complet"], fruits:[], fats:["huile_olive","mozzarella"], veggies:["champignon","asperges","epinards","courgette","poivron"], qty:{protein:140,carb:120,fat:12,veggie:120}, desc:(p,c,_,v)=>`Un risotto équilibré et réconfortant. Le ${FOODS[c]?.name} cuit lentement libère son amidon pour une texture crémeuse sans excès de matière grasse. Le ${FOODS[p]?.name} et les ${FOODS[v]?.name} complètent ce plat complet et savoureux.` },
    ],
    "Dîner": [
      { name: "{protein} rôti & {carb} & {veggie}", emoji:"🍗", proteins:["poulet","saumon","boeuf","dinde","cabillaud"], carbs:["patate_douce","pomme_terre","quinoa","riz_complet"], fruits:[], fats:["huile_olive"], veggies:["brocoli","asperges","haricots_verts","courgette","champignon","carotte"], qty:{protein:160,carb:150,fat:10,veggie:150}, desc:(p,c,_,v)=>`Le plat réconfort du maintien. Le ${FOODS[p]?.name} rôti au four développe des saveurs profondes. La ${FOODS[c]?.name} apporte les glucides pour la récupération nocturne. Les ${FOODS[v]?.name} complètent avec les micronutriments essentiels.` },
      { name: "Omelette complète {veggie} & {fat}", emoji:"🥚", proteins:["oeuf","ricotta","mozzarella"], carbs:[], fruits:[], fats:["avocat","amandes"], veggies:["epinards","champignon","poivron","tomate","courgette","asperges"], qty:{protein:200,fat:60,veggie:150}, desc:(p,_,__,v,fat)=>`Un dîner chaud et équilibré. Les ${FOODS[p]?.name}s entiers apportent toutes les vitamines liposolubles. Les ${FOODS[v]?.name} sautés apportent la saveur. Le ${FOODS[fat]?.name} ajoute les graisses saines pour la satiété nocturne.` },
      { name: "Bowl {carb} & {protein} du soir", emoji:"🌟", proteins:["saumon","poulet","crevettes","dinde","thon"], carbs:["quinoa","riz_complet","lentilles","pois_chiches"], fruits:[], fats:["huile_olive","avocat"], veggies:["epinards","tomate","concombre","poivron","champignon"], qty:{protein:160,carb:100,fat:12,veggie:100}, desc:(p,c,_,v)=>`Un dîner équilibré et anti-inflammatoire. Le ${FOODS[p]?.name} en soirée favorise la production de sérotonine. Le ${FOODS[c]?.name} apporte les glucides complexes pour la récupération musculaire nocturne.` },
      { name: "Gratin léger {protein} & {veggie}", emoji:"🧀", proteins:["poulet","cabillaud","ricotta","mozzarella"], carbs:["patate_douce","pomme_terre"], fruits:[], fats:["huile_olive","mozzarella"], veggies:["courgette","epinards","champignon","tomate","brocoli"], qty:{protein:140,carb:120,fat:15,veggie:150}, desc:(p,c,_,v)=>`Un gratin réconfortant et équilibré. Le ${FOODS[p]?.name} fondant avec les ${FOODS[v]?.name} gratinés au four — un plat convivial qui respecte tes macros. La ${FOODS[c]?.name} apporte les glucides pour la récupération nocturne.` },
    ],
    "Collation": [
      { name: "Pain {fat} & {fruit}", emoji:"🥜", proteins:["yaourt_grec","skyr"], carbs:["pain_complet","pain_seigle"], fruits:["banane","pomme","fraises","mangue"], fats:["beurre_cac","amandes","tahini","noix"], veggies:[], qty:{protein:100,carb:60,fruit:100,fat:20}, desc:(p,c,fr,_,fat)=>`La collation rassasiante. Le ${FOODS[fat]?.name} apporte protéines et graisses saines qui calent durablement. Le pain ${FOODS[c]?.name} à IG bas et les ${FOODS[fr]?.name} complètent avec énergie et vitamines.` },
      { name: "Shake {protein} & cacao {carb}", emoji:"🍫", proteins:["whey","yaourt_grec","skyr"], carbs:["avoine","banane"], fruits:["banane"], fats:[], veggies:[], qty:{protein:130,carb:70,fruit:60}, desc:(p,c,fr)=>`Une collation qui ressemble à un dessert chocolaté. Le cacao cru est riche en magnésium anti-stress et flavonoïdes antioxydants. La ${FOODS[p]?.name} + les ${FOODS[c]?.name} forment un duo optimal.` },
      { name: "Bowl fruits & {fat} & {protein}", emoji:"🍎", proteins:["yaourt_grec","skyr","cottage"], carbs:[], fruits:["pomme","banane","fraises","myrtilles","mangue"], fats:["amandes","noix","graines_chia","tahini"], veggies:[], qty:{protein:100,fruit:150,fat:25}, desc:(p,_,fr,__,fat)=>`La collation naturelle et saine. Les ${FOODS[fr]?.name} apportent fibres et vitamine C. Les ${FOODS[fat]?.name} les graisses insaturées. Le ${FOODS[p]?.name} lie le tout avec ses protéines. Simple et efficace.` },
      { name: "Muffin protéiné {fruit}", emoji:"🧁", proteins:["oeuf","fromage_blanc","ricotta"], carbs:["avoine","banane"], fruits:["myrtilles","fraises","banane","pomme"], fats:["amandes","noix"], veggies:[], qty:{protein:120,carb:80,fruit:80,fat:15}, desc:(p,c,fr)=>`Des muffins sains à préparer en avance. Les ${FOODS[p]?.name}s et les ${FOODS[c]?.name} forment la base nutritive. Les ${FOODS[fr]?.name} apportent humidité et saveur naturelle. À stocker pour la semaine.` },
    ],
  },

  muscle: {
    "Petit-déjeuner": [
      { name: "Mega bowl {carb} & {protein} & {fat}", emoji:"💪", proteins:["oeuf","yaourt_grec","skyr","fromage_blanc","ricotta"], carbs:["avoine","banane","pain_complet"], fruits:["myrtilles","fraises","mangue","banane","pomme"], fats:["beurre_cac","amandes","noix","graines_chia"], veggies:[], qty:{protein:180,carb:160,fruit:80,fat:30}, desc:(p,c,fr,_,fat)=>`Le petit-déjeuner champion de la prise de masse. Les ${FOODS[c]?.name} rechargent le glycogène dès le matin. Les ${FOODS[p]?.name}s apportent les acides aminés pour stopper le catabolisme nocturne. Le ${FOODS[fat]?.name} fournit les calories pour la synthèse hormonale anabolique.` },
      { name: "Pancakes masse {carb} & {fruit}", emoji:"🥞", proteins:["oeuf","fromage_blanc","ricotta"], carbs:["avoine","banane","pain_complet"], fruits:["myrtilles","fraises","banane","mangue"], fats:["beurre_cac","noix","amandes","miel"], veggies:[], qty:{protein:160,carb:150,fruit:80,fat:25}, desc:(p,c,fr,_,fat)=>`Des pancakes épais pour un réveil de champion. Les ${FOODS[p]?.name}s entiers apportent toutes les vitamines pour la synthèse hormonale. Les ${FOODS[c]?.name} fournissent l'énergie rapide pour recharger les stocks de glycogène.` },
      { name: "Shake masse {carb} & {fruit}", emoji:"🚀", proteins:["whey","yaourt_grec","skyr"], carbs:["avoine","banane"], fruits:["banane","mangue","myrtilles","fraises"], fats:["beurre_cac","amandes","noix"], veggies:[], qty:{protein:150,carb:150,fruit:100,fat:30}, desc:(p,c,fr,_,fat)=>`Le shake de réveil pour casser le jeûne nocturne. Ce shake double absorption (whey rapide + yaourt lent) couvre le spectre complet des besoins. Les ${FOODS[fr]?.name} et ${FOODS[c]?.name} rechargent le glycogène en priorité.` },
      { name: "Porridge masse {fat} & {fruit}", emoji:"🌰", proteins:["skyr","yaourt_grec","fromage_blanc"], carbs:["avoine"], fruits:["myrtilles","fraises","banane","mangue"], fats:["noix","amandes","beurre_cac","tahini","graines_chia"], veggies:[], qty:{protein:160,carb:130,fruit:80,fat:40}, desc:(p,c,fr,_,fat)=>`Un porridge généreux et calorique. Les ${FOODS[fat]?.name} sont riches en oméga-3 et oméga-6 essentiels à la synthèse des hormones anaboliques (testostérone, IGF-1). Les ${FOODS[c]?.name} libèrent leur énergie progressivement.` },
      { name: "Toast masse {protein} & {fat}", emoji:"🍞", proteins:["oeuf","ricotta","mozzarella","skyr"], carbs:["pain_complet","pain_seigle"], fruits:["banane","mangue"], fats:["avocat","beurre_cac","tahini"], veggies:[], qty:{protein:150,carb:120,fat:100,fruit:80}, desc:(p,c,_,__,fat)=>`Un petit-déjeuner solide pour la prise de masse. Le pain ${FOODS[c]?.name} apporte glucides complexes et fibres. Le ${FOODS[p]?.name} les protéines complètes. Le ${FOODS[fat]?.name} ajoute les calories et graisses indispensables à la croissance musculaire.` },
      { name: "Bowl masse banane & {protein}", emoji:"🍌", proteins:["yaourt_grec","skyr","fromage_blanc","cottage"], carbs:["avoine"], fruits:["banane"], fats:["beurre_cac","amandes","noix"], veggies:[], qty:{protein:180,carb:130,fruit:120,fat:30}, desc:(p,c,fr,_,fat)=>`Un bowl hypercalorique et nutritif. La banane est l'aliment pré-workout préféré des athlètes — riche en potassium et glucides rapides. Le ${FOODS[p]?.name} apporte les protéines, les ${FOODS[fat]?.name} les calories et graisses saines.` },
    ],
    "Déjeuner": [
      { name: "Assiette force {protein} & {carb}", emoji:"🥩", proteins:["boeuf","poulet","dinde","saumon","oeuf","crevettes"], carbs:["patate_douce","riz","quinoa","pates","pomme_terre","riz_complet"], fruits:[], fats:["huile_olive"], veggies:["brocoli","epinards","carotte","haricots_verts","poivron","champignon"], qty:{protein:250,carb:250,fat:12,veggie:150}, desc:(p,c,_,v)=>`L'assiette de force pour la prise de masse. Le ${FOODS[p]?.name} est riche en créatine naturelle et zinc — clés de la synthèse protéique. La ${FOODS[c]?.name} reconstitue les stocks de glycogène. Les ${FOODS[v]?.name} apportent les cofacteurs de l'anabolisme.` },
      { name: "Bowl {carb} power & {protein}", emoji:"💥", proteins:["poulet","boeuf","saumon","dinde","oeuf"], carbs:["riz","quinoa","pates","patate_douce","riz_complet","lentilles"], fruits:[], fats:["huile_olive","avocat"], veggies:["brocoli","epinards","poivron","champignon","courgette"], qty:{protein:220,carb:230,fat:15,veggie:150}, desc:(p,c,_,v)=>`Le bowl de bodybuilding classique. Le ${FOODS[p]?.name} apporte les protéines complètes, le ${FOODS[c]?.name} les glucides complexes. Les ${FOODS[v]?.name} fournissent les vitamines B essentielles au métabolisme protéique.` },
      { name: "Pâtes masse {protein} & {veggie}", emoji:"🍝", proteins:["poulet","boeuf","saumon","crevettes","ricotta"], carbs:["pates"], fruits:[], fats:["huile_olive","mozzarella","ricotta"], veggies:["epinards","tomate","champignon","poivron","courgette","asperges"], qty:{protein:200,carb:230,fat:18,veggie:120}, desc:(p,c,_,v)=>`Un plat de pâtes hypercalorique pour la masse. Les pâtes complètes apportent une quantité importante de glucides complexes. Le ${FOODS[p]?.name} et les ${FOODS[v]?.name} complètent ce plat gagnant.` },
      { name: "Riz {protein} & légumes sautés", emoji:"🍚", proteins:["poulet","boeuf","crevettes","saumon","dinde"], carbs:["riz","riz_complet"], fruits:[], fats:["huile_olive"], veggies:["brocoli","poivron","carotte","champignon","epinards","haricots_verts"], qty:{protein:230,carb:250,fat:12,veggie:150}, desc:(p,c,_,v)=>`Le classique riz-poulet version gastro. Le ${FOODS[c]?.name} basmati avec ses ${FOODS[p]?.name} sautés et ses ${FOODS[v]?.name} colorés — un plat complet et savoureux pour la prise de masse propre.` },
      { name: "Bowl végétal {carb} & {fat}", emoji:"🌱", proteins:["pois_chiches","lentilles","haricots"], carbs:["quinoa","riz_complet","patate_douce","pomme_terre"], fruits:[], fats:["avocat","tahini","huile_olive","amandes"], veggies:["epinards","tomate","concombre","poivron","carotte"], qty:{protein:160,carb:180,fat:20,veggie:100}, desc:(p,c,_,v,fat)=>`Un repas végétarien haute performance. Les ${FOODS[p]?.name} + ${FOODS[c]?.name} forment une protéine végétale complète couvrant tous les acides aminés. Le ${FOODS[fat]?.name} apporte les calories pour le surplus de masse.` },
      { name: "Quinoa power {protein} & {fat}", emoji:"🌟", proteins:["saumon","poulet","oeuf","boeuf"], carbs:["quinoa"], fruits:[], fats:["avocat","amandes","noix","tahini"], veggies:["epinards","poivron","tomate","champignon","brocoli"], qty:{protein:220,carb:200,fat:25,veggie:120}, desc:(p,c,_,v,fat)=>`Le quinoa est la seule céréale apportant les 9 acides aminés essentiels — parfait pour la masse. Associé au ${FOODS[p]?.name} et au ${FOODS[fat]?.name} crémeux, ce bowl est une bombe nutritionnelle anabolique.` },
    ],
    "Dîner": [
      { name: "{protein} & {carb} anabolique", emoji:"🌙", proteins:["saumon","poulet","boeuf","oeuf","dinde","cabillaud"], carbs:["quinoa","riz_complet","patate_douce","lentilles","pomme_terre","pois_chiches"], fruits:[], fats:["huile_olive","avocat"], veggies:["epinards","brocoli","champignon","tomate","haricots_verts"], qty:{protein:220,carb:200,fat:14,veggie:150}, desc:(p,c,_,v)=>`Le dîner anabolique par excellence. Le ${FOODS[p]?.name} riche en oméga-3 active les voies de synthèse protéique pendant la nuit. Le ${FOODS[c]?.name} fournit les glucides pour la récupération. Les ${FOODS[v]?.name} apportent les cofacteurs enzymatiques.` },
      { name: "Omelette massive & {carb}", emoji:"🥚", proteins:["oeuf"], carbs:["patate_douce","pomme_terre","quinoa","riz_complet"], fruits:[], fats:["avocat","ricotta","mozzarella"], veggies:["epinards","champignon","poivron","tomate","courgette"], qty:{protein:280,carb:220,fat:70,veggie:150}, desc:(p,c,_,v)=>`Un dîner chaud et hypercalorique pour les soirs d'entraînement. Les ${FOODS[p]?.name}s entiers avant le sommeil fournissent des protéines à digestion progressive. La ${FOODS[c]?.name} recharge le glycogène pour la récupération nocturne.` },
      { name: "{protein} mijoté & {carb}", emoji:"🍖", proteins:["boeuf","poulet","dinde","saumon"], carbs:["lentilles","haricots","pois_chiches","patate_douce","quinoa"], fruits:[], fats:["huile_olive"], veggies:["carotte","tomate","champignon","epinards","poivron"], qty:{protein:230,carb:180,fat:12,veggie:120}, desc:(p,c,_,v)=>`Un plat mijoté riche pour la fin de journée. Le ${FOODS[p]?.name} mijoté libère ses protéines progressivement — idéal pour la récupération prolongée. Les ${FOODS[c]?.name} apportent protéines végétales et fibres.` },
      { name: "Gratin masse {protein} & {carb}", emoji:"🧀", proteins:["poulet","boeuf","saumon","ricotta"], carbs:["patate_douce","pomme_terre","pates"], fruits:[], fats:["mozzarella","ricotta","huile_olive"], veggies:["brocoli","champignon","tomate","epinards","courgette"], qty:{protein:220,carb:220,fat:20,veggie:120}, desc:(p,c,_,v)=>`Un gratin généreux pour la prise de masse. Le ${FOODS[p]?.name} fondant avec la ${FOODS[c]?.name} et les ${FOODS[v]?.name} gratinés — un plat réconfortant et hypercalorique pour soutenir la croissance musculaire.` },
    ],
    "Collation": [
      { name: "Shake masse post-workout {fruit}", emoji:"🏋️", proteins:["whey","yaourt_grec"], carbs:["avoine","banane"], fruits:["banane","mangue","myrtilles","fraises"], fats:["beurre_cac","amandes","noix"], veggies:[], qty:{protein:160,carb:150,fruit:100,fat:30}, desc:(p,c,fr,_,fat)=>`La collation post-entraînement optimale. La fenêtre anabolique dure 30-60 min après l'effort. La ${FOODS[p]?.name} + les ${FOODS[fr]?.name} créent le pic insulinique qui transporte les acides aminés directement dans les muscles.` },
      { name: "Bol {carb} pré-workout & {fat}", emoji:"⚡", proteins:["yaourt_grec","skyr","fromage_blanc"], carbs:["avoine","banane","pain_complet"], fruits:["banane","myrtilles","fraises"], fats:["noix","amandes","beurre_cac","tahini"], veggies:[], qty:{protein:150,carb:150,fruit:80,fat:35}, desc:(p,c,fr,_,fat)=>`La collation idéale 90 minutes avant l'entraînement. Les glucides complexes des ${FOODS[c]?.name} libèrent une énergie stable pendant tout l'effort. Les ${FOODS[fat]?.name} maintiennent l'endurance.` },
      { name: "Toast masse {fat} & {carb}", emoji:"🥜", proteins:["yaourt_grec","fromage_blanc","ricotta"], carbs:["pain_complet","pain_seigle","banane"], fruits:["banane","fraises","mangue"], fats:["beurre_cac","amandes","tahini","noix"], veggies:[], qty:{protein:120,carb:100,fruit:80,fat:35}, desc:(p,c,fr,_,fat)=>`La collation énergétique des athlètes. Le ${FOODS[fat]?.name} + les ${FOODS[fr]?.name} sur du pain ${FOODS[c]?.name} — une combinaison plébiscitée par les sportifs de haut niveau pour soutenir performance et récupération.` },
      { name: "Shake cacao masse & {protein}", emoji:"🍫", proteins:["whey","yaourt_grec","skyr"], carbs:["avoine","banane"], fruits:["banane"], fats:["amandes","noix"], veggies:[], qty:{protein:160,carb:130,fruit:80,fat:20}, desc:(p,c,fr)=>`Une collation délicieuse façon milk-shake chocolaté. Le cacao cru est riche en magnésium essentiel pour la contraction musculaire. La ${FOODS[p]?.name} et les ${FOODS[c]?.name} forment un duo protéiné-glucidique optimal.` },
    ],
  },
};

function computeMacros(ingredients) {
  let cal=0,p=0,c=0,f=0;
  Object.entries(ingredients).forEach(([key,grams]) => {
    const food=FOODS[key]; if(!food||!grams)return;
    const s=grams/100; cal+=food.cal*s; p+=food.p*s; c+=food.c*s; f+=food.f*s;
  });
  return {cal:Math.round(cal),p:Math.round(p),c:Math.round(c),f:Math.round(f)};
}

function adjustRecipe(base,targets) {
  const ing={...base}; const keys=Object.keys(ing);
  const PS=keys.filter(k=>FOODS[k]?.p>12);
  const CS=keys.filter(k=>FOODS[k]?.c>12&&(FOODS[k]?.p||0)<12);
  const FS=keys.filter(k=>FOODS[k]?.f>8);
  const bm=computeMacros(ing);
  if(PS.length&&bm.p>0){const r=Math.max(0.3,Math.min(4,targets.p/bm.p));PS.forEach(k=>{ing[k]=Math.round(ing[k]*r);});}
  if(CS.length&&bm.c>0){const r=Math.max(0.2,Math.min(4,targets.c/Math.max(bm.c,1)));CS.forEach(k=>{ing[k]=Math.round(ing[k]*r);});}
  if(FS.length&&bm.f>0){const r=Math.max(0.2,Math.min(4,targets.f/Math.max(bm.f,1)));FS.forEach(k=>{ing[k]=Math.round(ing[k]*r);});}
  keys.forEach(k=>{if(ing[k]<5)ing[k]=5;}); return ing;
}

function generateRecipes() {
  const all=[]; let id=0;
  Object.entries(TEMPLATES).forEach(([goal,meals])=>{
    Object.entries(meals).forEach(([meal,templates])=>{
      templates.forEach(tpl=>{
        const proteins=tpl.proteins?.length?tpl.proteins:[null];
        const carbs=tpl.carbs?.length?tpl.carbs:[null];
        const fruits=tpl.fruits?.length?tpl.fruits:[null];
        const veggies=tpl.veggies?.length?tpl.veggies:[null];
        const fats=tpl.fats?.length?tpl.fats:[null];
        proteins.forEach(p=>{ carbs.forEach(c=>{ fruits.forEach(fr=>{ veggies.forEach(v=>{ fats.forEach(fat=>{
          const ing={};
          if(p&&tpl.qty.protein)ing[p]=tpl.qty.protein;
          if(c&&tpl.qty.carb)ing[c]=tpl.qty.carb;
          if(fr&&tpl.qty.fruit)ing[fr]=tpl.qty.fruit;
          if(v&&tpl.qty.veggie)ing[v]=tpl.qty.veggie;
          if(fat&&tpl.qty.fat)ing[fat]=tpl.qty.fat;
          if(Object.keys(ing).length<2)return;
          const m=computeMacros(ing); if(m.cal<80||m.p<3)return;
          let name=tpl.name
            .replace("{protein}",p?FOODS[p]?.name:"")
            .replace("{carb}",c?FOODS[c]?.name:"")
            .replace("{fruit}",fr?FOODS[fr]?.name:"")
            .replace("{veggie}",v?FOODS[v]?.name:"")
            .replace("{fat}",fat?FOODS[fat]?.name:"");
          let desc=""; try{desc=tpl.desc(p,c,fr,v,fat)||"";}catch(e){}
          all.push({id:`r${id++}`,goal,meal,name,emoji:tpl.emoji,desc,ingredients:ing});
        });});});});});
      });
    });
  });
  // Deduplicate
  const seen=new Set();
  return all.filter(r=>{if(seen.has(r.name))return false;seen.add(r.name);return true;});
}

const ALL_RECIPES=generateRecipes();

const GOALS={
  seche:   {label:"Sèche",         emoji:"🔥",color:"#b5616e",desc:"Déficit calorique · Haute protéine"},
  maintien:{label:"Maintien",      emoji:"⚖️",color:"#9a7b5e",desc:"Macros équilibrés · Énergie stable"},
  muscle:  {label:"Prise de masse",emoji:"💪",color:"#6b8f72",desc:"Surplus calorique · Masse propre"},
};
const MEALS=["Tous","Petit-déjeuner","Déjeuner","Dîner","Collation"];
const ROSE="#c9a882",ROSE_L="#f5ede3",DARK="#1a1a1a";

function Slider({label,unit,value,min,max,step=1,onChange,color}){
  const pct=((value-min)/(max-min))*100;
  return(
    <div style={{marginBottom:15}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
        <span style={{fontSize:13,fontWeight:800,color:DARK,fontFamily:"'Cormorant Garamond',serif"}}>{value} <span style={{fontSize:10,color:"#ccc",fontWeight:400}}>{unit}</span></span>
      </div>
      <div style={{position:"relative",height:5,background:"#ede7e0",borderRadius:999}}>
        <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${ROSE_L},${color})`,borderRadius:999,transition:"width 0.1s"}}/>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} style={{position:"absolute",inset:"-7px 0",opacity:0,cursor:"pointer",width:"100%",zIndex:2}}/>
        <div style={{position:"absolute",top:"50%",left:`${pct}%`,transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:"#fff",border:`2px solid ${color}`,boxShadow:"0 1px 6px rgba(0,0,0,0.15)",transition:"left 0.1s",pointerEvents:"none"}}/>
      </div>
    </div>
  );
}

export default function FitWomenApp(){
  const [activeGoal,setActiveGoal]=useState("seche");
  const [activeMeal,setActiveMeal]=useState("Tous");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [showDetail,setShowDetail]=useState(false);
  const [customized,setCustomized]=useState(false);
  const [sliders,setSliders]=useState({p:35,c:35,f:15});
  const [page,setPage]=useState(1);
  const PER_PAGE=24;

  const setSlider=useCallback((key,val)=>{setSliders(s=>({...s,[key]:val}));setCustomized(true);},[]);
  const selectRecipe=(r)=>{const m=computeMacros(r.ingredients);setSliders({p:m.p,c:m.c,f:m.f});setSelected(r);setCustomized(false);setShowDetail(true);};

  const filtered=useMemo(()=>ALL_RECIPES.filter(r=>
    r.goal===activeGoal&&
    (activeMeal==="Tous"||r.meal===activeMeal)&&
    (search===""||r.name.toLowerCase().includes(search.toLowerCase()))
  ),[activeGoal,activeMeal,search]);

  const paginated=useMemo(()=>filtered.slice(0,page*PER_PAGE),[filtered,page]);
  const mealCounts=useMemo(()=>{const c={};ALL_RECIPES.filter(r=>r.goal===activeGoal).forEach(r=>{c[r.meal]=(c[r.meal]||0)+1;});return c;},[activeGoal]);
  const adjIngredients=useMemo(()=>selected?adjustRecipe(selected.ingredients,sliders):null,[selected,sliders]);
  const adjMacros=useMemo(()=>adjIngredients?computeMacros(adjIngredients):null,[adjIngredients]);
  const gc=GOALS[activeGoal];
  const goalTotal=ALL_RECIPES.filter(r=>r.goal===activeGoal).length;

  return(
    <div style={{minHeight:"100vh",background:"#f9f6f2",fontFamily:"'Jost',sans-serif",color:DARK}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#e0d4c8;border-radius:99px}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{background:DARK,padding:"16px 20px",position:"sticky",top:0,zIndex:200}}>
        <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${ROSE},#e8c4a0)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:DARK,fontWeight:800,fontSize:12,fontFamily:"'Cormorant Garamond',serif"}}>FW</span>
            </div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,color:"#fff",letterSpacing:"0.14em",textTransform:"uppercase"}}>Fitwomen</div>
              <div style={{fontSize:9,color:ROSE,letterSpacing:"0.2em",textTransform:"uppercase"}}>Bibliothèque Nutritionnelle · Ciqual 2025</div>
            </div>
          </div>
          <div style={{fontSize:10,color:"#555"}}>
            <span style={{color:ROSE,fontWeight:700}}>{goalTotal}</span> recettes · {gc.label}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1140,margin:"0 auto",padding:"0 16px"}}>
        <div style={{display:"flex",gap:10,padding:"18px 0 14px"}}>
          {Object.entries(GOALS).map(([key,cfg])=>(
            <button key={key} onClick={()=>{setActiveGoal(key);setSelected(null);setShowDetail(false);setPage(1);setActiveMeal("Tous");}}
              style={{flex:1,padding:"12px 8px",border:"1.5px solid",borderColor:activeGoal===key?ROSE:"#e8e2db",borderRadius:16,background:activeGoal===key?DARK:"#fff",color:activeGoal===key?"#fff":"#aaa",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer",letterSpacing:"0.05em",transition:"all 0.2s",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:3}}>{cfg.emoji}</div>
              <div style={{textTransform:"uppercase",fontWeight:700}}>{cfg.label}</div>
              <div style={{fontSize:9,color:activeGoal===key?"#888":"#ccc",marginTop:3,fontWeight:400}}>{cfg.desc}</div>
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {MEALS.map(m=>{
              const count=m==="Tous"?ALL_RECIPES.filter(r=>r.goal===activeGoal).length:(mealCounts[m]||0);
              return(
                <button key={m} onClick={()=>{setActiveMeal(m);setPage(1);}}
                  style={{padding:"6px 12px",border:"1px solid",borderColor:activeMeal===m?ROSE:"#e8e2db",borderRadius:99,background:activeMeal===m?ROSE_L:"#fff",color:activeMeal===m?"#8a6040":"#bbb",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer",transition:"all 0.15s"}}>
                  {m} <span style={{opacity:0.6}}>({count})</span>
                </button>
              );
            })}
          </div>
          <input placeholder="🔍 Rechercher une recette..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            style={{marginLeft:"auto",padding:"7px 14px",border:"1px solid #e8e2db",borderRadius:99,fontSize:11,outline:"none",color:DARK,background:"#fff",width:220,fontFamily:"'Jost',sans-serif"}}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:showDetail?"1fr 420px":"1fr",gap:20,alignItems:"start"}}>
          <div>
            <div style={{display:"grid",gridTemplateColumns:showDetail?"1fr":"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
              {paginated.map((r,i)=>{
                const m=computeMacros(r.ingredients); const isSel=selected?.id===r.id; const gc2=GOALS[r.goal];
                return(
                  <div key={r.id} onClick={()=>selectRecipe(r)}
                    style={{background:isSel?"#fff":"#faf7f4",border:`1.5px solid ${isSel?ROSE:"#ece6df"}`,borderRadius:18,padding:"15px 17px",cursor:"pointer",transition:"all 0.18s",boxShadow:isSel?"0 4px 24px rgba(201,168,130,0.22)":"0 1px 4px rgba(0,0,0,0.03)",animation:`fadeIn 0.3s ease ${(i%24)*0.02}s both`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                          <span style={{fontSize:16}}>{r.emoji}</span>
                          <span style={{fontSize:10,fontWeight:700,color:gc2.color,background:gc2.color+"18",borderRadius:20,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{r.meal}</span>
                        </div>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:DARK,lineHeight:1.25,marginBottom:5}}>{r.name}</div>
                        {r.desc&&<p style={{fontSize:11,color:"#bbb",margin:0,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{r.desc}</p>}
                      </div>
                      <div style={{textAlign:"right",marginLeft:12,flexShrink:0}}>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:ROSE}}>{m.cal}</div>
                        <div style={{fontSize:9,color:"#ccc",textTransform:"uppercase"}}>kcal</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:12,paddingTop:8,borderTop:"1px solid #f0ebe4"}}>
                      {[["P",m.p,"#d4826a"],["G",m.c,"#7a9e87"],["L",m.f,ROSE]].map(([l,v,c])=>(
                        <span key={l} style={{fontSize:10,color:c,fontWeight:700}}>{l}: {v}g</span>
                      ))}
                      <span style={{marginLeft:"auto",fontSize:10,color:isSel?ROSE:"#e0d8d0",fontWeight:600}}>{isSel?"✦ Sélectionnée":"Ajuster →"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {paginated.length<filtered.length&&(
              <div style={{textAlign:"center",marginTop:24}}>
                <button onClick={()=>setPage(p=>p+1)}
                  style={{background:DARK,color:"#fff",border:"none",borderRadius:14,padding:"12px 32px",fontWeight:700,cursor:"pointer",fontSize:13,letterSpacing:"0.04em"}}>
                  ✦ Voir plus ({filtered.length-paginated.length} recettes restantes)
                </button>
              </div>
            )}
            {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#ccc"}}>Aucune recette trouvée</div>}
            <div style={{marginTop:16,padding:"10px 14px",background:"#faf7f4",borderRadius:12,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:14}}>📋</span>
              <span style={{fontSize:11,color:"#bbb"}}>Valeurs issues de la <strong style={{color:"#aaa"}}>Table Ciqual 2025</strong> (Anses) — données nutritionnelles officielles françaises.</span>
            </div>
          </div>

          {showDetail&&selected&&(
            <div style={{position:"sticky",top:76}}>
              <div style={{background:"#fff",border:"1.5px solid #ede8e3",borderRadius:22,overflow:"hidden",boxShadow:"0 8px 48px rgba(201,168,130,0.16)"}}>
                <div style={{background:DARK,padding:"20px 22px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1}}>
                      <span style={{fontSize:28,flexShrink:0}}>{selected.emoji}</span>
                      <div>
                        <div style={{fontSize:9,color:ROSE,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600,marginBottom:3}}>{GOALS[selected.goal].label} · {selected.meal}</div>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"#fff",lineHeight:1.2}}>{selected.name}</div>
                      </div>
                    </div>
                    <button onClick={()=>{setShowDetail(false);setSelected(null);}} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#666",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
                  </div>
                  {selected.desc&&<p style={{color:"#888",fontSize:12,lineHeight:1.7,margin:0}}>{selected.desc}</p>}
                </div>
                <div style={{padding:"18px 22px",maxHeight:"calc(100vh - 230px)",overflowY:"auto"}}>
                  {adjMacros&&(
                    <div style={{background:"#faf7f4",borderRadius:14,padding:"12px 16px",marginBottom:20,display:"flex",justifyContent:"space-around",textAlign:"center"}}>
                      {[["Calories",adjMacros.cal,"kcal",ROSE],["Protéines",adjMacros.p,"g","#d4826a"],["Glucides",adjMacros.c,"g","#7a9e87"],["Lipides",adjMacros.f,"g","#b08a6e"]].map(([l,v,u,c])=>(
                        <div key={l}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:9,color:"#ccc",textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div></div>
                      ))}
                    </div>
                  )}
                  <div style={{marginBottom:20}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700}}>Ajuste ta recette</div>
                      {customized&&<button onClick={()=>{const m=computeMacros(selected.ingredients);setSliders({p:m.p,c:m.c,f:m.f});setCustomized(false);}} style={{fontSize:11,color:ROSE,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>↺ Reset</button>}
                    </div>
                    <Slider label="Protéines" unit="g" value={sliders.p} min={5} max={100} onChange={v=>setSlider("p",v)} color="#d4826a"/>
                    <Slider label="Glucides"  unit="g" value={sliders.c} min={0} max={150} onChange={v=>setSlider("c",v)} color="#7a9e87"/>
                    <Slider label="Lipides"   unit="g" value={sliders.f} min={0} max={80}  onChange={v=>setSlider("f",v)} color="#b08a6e"/>
                  </div>
                  {adjIngredients&&(
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,marginBottom:12}}>
                        Ingrédients {customized&&<span style={{fontSize:10,color:ROSE,fontFamily:"'Jost',sans-serif",fontWeight:500}}>· ajustés</span>}
                      </div>
                      {Object.entries(adjIngredients).map(([key,grams])=>{
                        const food=FOODS[key]; if(!food)return null; const s=grams/100;
                        return(
                          <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f5f0ea"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:17}}>{food.emoji}</span>
                              <div>
                                <div style={{fontSize:12,fontWeight:600,color:DARK}}>{food.name}</div>
                                <div style={{fontSize:10,color:"#ccc"}}>{Math.round(food.cal*s)} kcal · P:{Math.round(food.p*s)}g · G:{Math.round(food.c*s)}g · L:{Math.round(food.f*s)}g</div>
                              </div>
                            </div>
                            <div style={{background:ROSE_L,color:"#8a6040",fontWeight:700,fontSize:13,borderRadius:8,padding:"3px 10px",fontFamily:"'Cormorant Garamond',serif",flexShrink:0}}>{grams}g</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{height:50}}/>
      </div>
    </div>
  );
}
