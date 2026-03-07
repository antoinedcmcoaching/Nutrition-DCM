import { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ─── CIQUAL 2025 + Micronutriments ────────────────────────────────────────────
const FOODS = {
  poulet:        { name:"Blanc de poulet",     cal:165,p:31,c:0,  f:3.6, emoji:"🍗", fiber:0,  iron:0.9, vitC:0,  calcium:11, magnesium:29,  omega3:0.1 },
  dinde:         { name:"Blanc de dinde",      cal:135,p:30,c:0,  f:1.5, emoji:"🦃", fiber:0,  iron:1.2, vitC:0,  calcium:8,  magnesium:25,  omega3:0.05},
  saumon:        { name:"Saumon",              cal:206,p:20,c:0,  f:13,  emoji:"🐟", fiber:0,  iron:0.8, vitC:0,  calcium:12, magnesium:27,  omega3:2.3 },
  thon:          { name:"Thon (eau)",          cal:116,p:26,c:0,  f:1,   emoji:"🐠", fiber:0,  iron:1.3, vitC:0,  calcium:15, magnesium:30,  omega3:0.5 },
  crevettes:     { name:"Crevettes",           cal:99, p:21,c:0,  f:1.5, emoji:"🦐", fiber:0,  iron:2.4, vitC:2,  calcium:70, magnesium:34,  omega3:0.3 },
  cabillaud:     { name:"Cabillaud",           cal:82, p:18,c:0,  f:0.7, emoji:"🐡", fiber:0,  iron:0.5, vitC:0,  calcium:18, magnesium:22,  omega3:0.15},
  oeuf:          { name:"Œuf entier",          cal:155,p:13,c:1.1,f:11,  emoji:"🥚", fiber:0,  iron:1.8, vitC:0,  calcium:55, magnesium:12,  omega3:0.1 },
  blanc_oeuf:    { name:"Blanc d'œuf",         cal:52, p:11,c:0.7,f:0.2, emoji:"🥚", fiber:0,  iron:0.1, vitC:0,  calcium:7,  magnesium:11,  omega3:0   },
  boeuf:         { name:"Bœuf maigre",         cal:172,p:26,c:0,  f:7,   emoji:"🥩", fiber:0,  iron:2.7, vitC:0,  calcium:8,  magnesium:22,  omega3:0.05},
  cottage:       { name:"Cottage cheese",      cal:98, p:11,c:3.4,f:4.3, emoji:"🧀", fiber:0,  iron:0.1, vitC:0,  calcium:60, magnesium:9,   omega3:0.1 },
  yaourt_grec:   { name:"Yaourt grec 0%",      cal:60, p:10,c:4,  f:0.3, emoji:"🥛", fiber:0,  iron:0.1, vitC:1,  calcium:110,magnesium:12,  omega3:0   },
  fromage_blanc: { name:"Fromage blanc 0%",    cal:45, p:7.8,c:4.5,f:0.1,emoji:"🥛", fiber:0,  iron:0.1, vitC:0,  calcium:90, magnesium:11,  omega3:0   },
  skyr:          { name:"Skyr nature",         cal:63, p:11,c:4,  f:0.2, emoji:"🥛", fiber:0,  iron:0.1, vitC:0,  calcium:120,magnesium:13,  omega3:0   },
  whey:          { name:"Whey protéine",       cal:400,p:80,c:10, f:5,   emoji:"💪", fiber:0,  iron:1,   vitC:0,  calcium:200,magnesium:50,  omega3:0   },
  ricotta:       { name:"Ricotta légère",      cal:138,p:9, c:3,  f:10,  emoji:"🧀", fiber:0,  iron:0.2, vitC:0,  calcium:105,magnesium:10,  omega3:0.2 },
  mozzarella:    { name:"Mozzarella light",    cal:156,p:18,c:2,  f:9,   emoji:"🧀", fiber:0,  iron:0.3, vitC:0,  calcium:400,magnesium:18,  omega3:0.1 },
  riz:           { name:"Riz basmati",         cal:130,p:2.7,c:28,f:0.3, emoji:"🍚", fiber:0.4,iron:0.2, vitC:0,  calcium:10, magnesium:13,  omega3:0   },
  riz_complet:   { name:"Riz complet",         cal:112,p:2.6,c:23,f:0.9, emoji:"🍚", fiber:1.8,iron:0.5, vitC:0,  calcium:10, magnesium:43,  omega3:0   },
  patate_douce:  { name:"Patate douce",        cal:90, p:1.6,c:20,f:0.1, emoji:"🍠", fiber:2.5,iron:0.6, vitC:19, calcium:30, magnesium:25,  omega3:0   },
  pomme_terre:   { name:"Pomme de terre",      cal:77, p:2,  c:17,f:0.1, emoji:"🥔", fiber:1.8,iron:0.4, vitC:13, calcium:5,  magnesium:21,  omega3:0   },
  avoine:        { name:"Flocons d'avoine",    cal:367,p:13, c:62,f:7,   emoji:"🌾", fiber:8,  iron:4.3, vitC:0,  calcium:47, magnesium:138, omega3:0.1 },
  quinoa:        { name:"Quinoa",              cal:120,p:4.4,c:21,f:1.9, emoji:"🌱", fiber:2.7,iron:1.5, vitC:0,  calcium:17, magnesium:64,  omega3:0.08},
  pain_seigle:   { name:"Pain de seigle",      cal:259,p:8.5,c:48,f:3.3, emoji:"🍞", fiber:5.8,iron:2.4, vitC:0,  calcium:24, magnesium:40,  omega3:0.1 },
  pain_complet:  { name:"Pain complet",        cal:247,p:9,  c:46,f:3,   emoji:"🍞", fiber:6,  iron:2.5, vitC:0,  calcium:37, magnesium:57,  omega3:0.1 },
  lentilles:     { name:"Lentilles",           cal:116,p:9,  c:20,f:0.4, emoji:"🫘", fiber:7.9,iron:3.3, vitC:1,  calcium:19, magnesium:35,  omega3:0.05},
  pois_chiches:  { name:"Pois chiches",        cal:164,p:8.9,c:27,f:2.6, emoji:"🫘", fiber:7.6,iron:2.9, vitC:1,  calcium:49, magnesium:48,  omega3:0   },
  haricots:      { name:"Haricots rouges",     cal:127,p:8.7,c:22,f:0.5, emoji:"🫘", fiber:7.4,iron:2.5, vitC:0,  calcium:28, magnesium:40,  omega3:0   },
  pates:         { name:"Pâtes complètes",     cal:131,p:5.5,c:25,f:0.9, emoji:"🍝", fiber:5,  iron:1.5, vitC:0,  calcium:21, magnesium:40,  omega3:0.05},
  banane:        { name:"Banane",              cal:89, p:1.1,c:23,f:0.3, emoji:"🍌", fiber:2.6,iron:0.3, vitC:9,  calcium:5,  magnesium:27,  omega3:0   },
  myrtilles:     { name:"Myrtilles",           cal:57, p:0.7,c:14,f:0.3, emoji:"🫐", fiber:2.4,iron:0.3, vitC:10, calcium:6,  magnesium:6,   omega3:0.05},
  fraises:       { name:"Fraises",             cal:32, p:0.7,c:7.7,f:0.3,emoji:"🍓", fiber:2,  iron:0.4, vitC:59, calcium:16, magnesium:13,  omega3:0.1 },
  pomme:         { name:"Pomme",               cal:52, p:0.3,c:14,f:0.2, emoji:"🍎", fiber:2.4,iron:0.1, vitC:5,  calcium:6,  magnesium:5,   omega3:0   },
  mangue:        { name:"Mangue",              cal:65, p:0.5,c:15,f:0.3, emoji:"🥭", fiber:1.6,iron:0.2, vitC:28, calcium:11, magnesium:10,  omega3:0   },
  avocat:        { name:"Avocat",              cal:160,p:2,  c:9,  f:15,  emoji:"🥑", fiber:6.7,iron:0.6, vitC:10, calcium:12, magnesium:29,  omega3:0.1 },
  amandes:       { name:"Amandes",             cal:579,p:21, c:22, f:50,  emoji:"🥜", fiber:12.5,iron:3.7,vitC:0,  calcium:264,magnesium:270, omega3:0.1 },
  noix:          { name:"Noix",                cal:654,p:15, c:14, f:65,  emoji:"🌰", fiber:6.7,iron:2.9, vitC:1,  calcium:98, magnesium:158, omega3:9.1 },
  huile_olive:   { name:"Huile d'olive",       cal:884,p:0,  c:0,  f:100, emoji:"🫒", fiber:0,  iron:0,   vitC:0,  calcium:1,  magnesium:0,   omega3:0.8 },
  beurre_cac:    { name:"Beurre de cacahuète", cal:588,p:25, c:20, f:50,  emoji:"🥜", fiber:6,  iron:1.9, vitC:0,  calcium:49, magnesium:154, omega3:0   },
  tahini:        { name:"Tahini",              cal:595,p:17, c:21, f:54,  emoji:"🌰", fiber:9,  iron:8.9, vitC:0,  calcium:426,magnesium:95,  omega3:0.5 },
  graines_chia:  { name:"Graines de chia",     cal:486,p:17, c:42, f:31,  emoji:"🌱", fiber:34, iron:7.7, vitC:1,  calcium:631,magnesium:335, omega3:17.8},
  brocoli:       { name:"Brocoli",             cal:35, p:2.4,c:7,  f:0.4, emoji:"🥦", fiber:2.6,iron:0.7, vitC:89, calcium:47, magnesium:21,  omega3:0.1 },
  epinards:      { name:"Épinards",            cal:23, p:2.9,c:3.6,f:0.4, emoji:"🥬", fiber:2.2,iron:2.7, vitC:28, calcium:99, magnesium:79,  omega3:0.1 },
  courgette:     { name:"Courgette",           cal:17, p:1.2,c:3.1,f:0.3, emoji:"🥒", fiber:1.1,iron:0.4, vitC:17, calcium:16, magnesium:18,  omega3:0   },
  tomate:        { name:"Tomate",              cal:18, p:0.9,c:3.5,f:0.2, emoji:"🍅", fiber:1.2,iron:0.5, vitC:14, calcium:10, magnesium:11,  omega3:0.05},
  concombre:     { name:"Concombre",           cal:12, p:0.6,c:2.2,f:0.1, emoji:"🥒", fiber:0.5,iron:0.3, vitC:3,  calcium:16, magnesium:13,  omega3:0   },
  poivron:       { name:"Poivron",             cal:26, p:1,  c:5,  f:0.2, emoji:"🫑", fiber:1.7,iron:0.4, vitC:128,calcium:9,  magnesium:11,  omega3:0   },
  champignon:    { name:"Champignons",         cal:22, p:3.1,c:3.3,f:0.3, emoji:"🍄", fiber:1,  iron:0.5, vitC:3,  calcium:3,  magnesium:10,  omega3:0   },
  haricots_verts:{ name:"Haricots verts",      cal:31, p:1.8,c:7,  f:0.1, emoji:"🫛", fiber:3.4,iron:1,   vitC:16, calcium:37, magnesium:25,  omega3:0.1 },
  asperges:      { name:"Asperges",            cal:20, p:2.2,c:3.9,f:0.1, emoji:"🥗", fiber:2.1,iron:2,   vitC:6,  calcium:24, magnesium:14,  omega3:0.05},
  salade:        { name:"Salade verte",        cal:15, p:1.4,c:2.9,f:0.2, emoji:"🥬", fiber:1.5,iron:0.9, vitC:10, calcium:36, magnesium:13,  omega3:0.1 },
  carotte:       { name:"Carottes",            cal:41, p:0.9,c:10, f:0.2, emoji:"🥕", fiber:2.8,iron:0.4, vitC:6,  calcium:33, magnesium:12,  omega3:0   },
  cacao:         { name:"Cacao en poudre",     cal:228,p:20, c:54, f:14,  emoji:"🍫", fiber:33, iron:13.9,vitC:0,  calcium:128,magnesium:499, omega3:0.1 },
  miel:          { name:"Miel",                cal:304,p:0.3,c:82, f:0,   emoji:"🍯", fiber:0.2,iron:0.4, vitC:1,  calcium:6,  magnesium:2,   omega3:0   },
};

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
const TEMPLATES = {
  seche: {
    "Petit-déjeuner": [
      { name:"Bowl protéiné aux {fruit}", emoji:"🫐",
        proteins:["skyr","yaourt_grec","fromage_blanc","cottage","blanc_oeuf"], carbs:["avoine"], fruits:["myrtilles","fraises","pomme","mangue","banane"], fats:["graines_chia"], veggies:[],
        qty:{protein:180,carb:40,fruit:80,fat:8},
        desc:(p,_,fr)=>`Un bol ultra-protéiné pour démarrer en sèche. Le ${FOODS[p]?.name} apporte des protéines sans lipides excessifs. Les ${FOODS[fr]?.name} fournissent antioxydants et vitamines. Les graines de chia créent une satiété durable grâce à leurs fibres.`,
        steps:["Verser le yaourt dans un bol","Parsemer les flocons d'avoine (si inclus)","Ajouter les fruits frais ou décongelés","Saupoudrer les graines de chia","Laisser gonfler 2 min avant de déguster"] },
      { name:"Omelette aux {veggie}", emoji:"🥚",
        proteins:["blanc_oeuf","oeuf"], carbs:[], fruits:[], fats:[], veggies:["epinards","champignon","poivron","tomate","courgette","asperges"],
        qty:{protein:200,veggie:150},
        desc:(p,_,__,v)=>`L'omelette sèche par excellence. Les ${FOODS[p]?.name}s sont la source de protéines la plus pure : zéro glucide, minimal en lipides. Les ${FOODS[v]?.name} apportent fer, magnésium et vitamines B.`,
        steps:["Faire revenir les légumes 3-4 min à la poêle antiadhésive","Battre les œufs/blancs d'œuf avec sel et poivre","Verser sur les légumes dans la poêle","Cuire à feu moyen 3-4 min en pliant l'omelette","Servir immédiatement"] },
      { name:"Toast {protein} & {veggie}", emoji:"🍞",
        proteins:["thon","cottage","fromage_blanc","skyr"], carbs:["pain_seigle","pain_complet"], fruits:[], fats:[], veggies:["concombre","tomate","salade","poivron"],
        qty:{protein:100,carb:60,veggie:80},
        desc:(p,c,_,v)=>`Le petit-déjeuner salé parfait en sèche. Le pain ${FOODS[c]?.name} à IG bas libère l'énergie lentement. Le ${FOODS[p]?.name} apporte les protéines dès le matin.`,
        steps:["Griller les tranches de pain","Couper les légumes en fines tranches","Étaler le ${FOODS[p]?.name} sur le pain","Disposer joliment les légumes par-dessus","Assaisonner avec herbes aromatiques au goût"] },
      { name:"Shake minceur {fruit}", emoji:"💜",
        proteins:["whey","skyr","fromage_blanc"], carbs:[], fruits:["myrtilles","fraises","pomme","mangue","banane"], fats:["graines_chia"], veggies:[],
        qty:{protein:120,fruit:80,fat:8},
        desc:(p,_,fr)=>`Le shake express de la sèche. La ${FOODS[p]?.name} fournit les acides aminés essentiels rapidement. Les ${FOODS[fr]?.name} apportent vitamine C et antioxydants.`,
        steps:["Verser 200ml d'eau froide ou lait d'amande dans le shaker","Ajouter la protéine en poudre","Ajouter les fruits (frais ou surgelés)","Mixer 30 secondes si blender, sinon shaker vigoureusement","Ajouter les graines de chia et laisser gonfler 5 min"] },
      { name:"Yaourt & {fruit} & chia", emoji:"🍓",
        proteins:["yaourt_grec","skyr","fromage_blanc"], carbs:[], fruits:["fraises","myrtilles","pomme","mangue"], fats:["graines_chia"],
        qty:{protein:200,fruit:90,fat:12},
        desc:(p,_,fr)=>`La recette minimaliste redoutable. Le ${FOODS[p]?.name} a un rapport protéines/calories imbattable en sèche. Les ${FOODS[fr]?.name} sucrées naturellement remplacent tout sucre ajouté.`,
        steps:["Verser le yaourt dans un bol","Couper les fruits en morceaux","Déposer les fruits sur le yaourt","Saupoudrer les graines de chia","Déguster immédiatement ou réfrigérer 1h pour un effet 'pudding'"] },
      { name:"Shake cacao protéiné", emoji:"🍫",
        proteins:["whey","fromage_blanc","skyr"], carbs:["avoine"], fruits:["banane","myrtilles"], fats:[], veggies:[],
        qty:{protein:100,carb:40,fruit:60},
        desc:(p,c,fr)=>`Un shake chocolaté zéro culpabilité. Le cacao cru est riche en magnésium anti-fatigue. La ${FOODS[p]?.name} + les ${FOODS[c]?.name} forment un combo satiété/énergie parfait.`,
        steps:["Ajouter tous les ingrédients dans le blender","Verser 250ml d'eau froide","Mixer 1 minute jusqu'à texture lisse","Goûter et ajuster avec 1 pincée de cacao si besoin","Servir frais avec quelques glaçons"] },
    ],
    "Déjeuner": [
      { name:"Bowl {protein} & {carb} & {veggie}", emoji:"🥗",
        proteins:["poulet","dinde","cabillaud","crevettes","thon"], carbs:["quinoa","riz_complet","lentilles","pois_chiches"], fruits:[], fats:["huile_olive"], veggies:["brocoli","epinards","haricots_verts","asperges","courgette"],
        qty:{protein:160,carb:70,fat:5,veggie:180},
        desc:(p,c,_,v)=>`Le bowl sèche calibré. Le ${FOODS[p]?.name} est une protéine maigre complète. Le ${FOODS[c]?.name} fournit les glucides sans faire grimper l'insuline. Les ${FOODS[v]?.name} apportent fibres et micronutriments.`,
        steps:["Cuire le ${FOODS[c]?.name} selon paquet (10-15 min)","Cuire le ${FOODS[p]?.name} à la vapeur ou poêle antiadhésive 5-7 min","Cuire les légumes vapeur ou sauté 5 min","Assembler dans le bol avec le céréale en base","Arroser d'un filet d'huile d'olive et herbes fraîches"] },
      { name:"Salade {protein} & {carb}", emoji:"🥗",
        proteins:["thon","poulet","crevettes","cabillaud","dinde"], carbs:["lentilles","pois_chiches","haricots"], fruits:[], fats:["huile_olive"], veggies:["salade","concombre","tomate","poivron","carotte"],
        qty:{protein:140,carb:80,fat:5,veggie:100},
        desc:(p,c,_,v)=>`Une salade complète rassasiante. Le ${FOODS[p]?.name} maigre + les ${FOODS[c]?.name} riches en fibres forment un repas complet minceur.`,
        steps:["Égoutter et rincer les légumineuses (si en boîte)","Laver et couper les légumes en morceaux","Effilocher ou couper le ${FOODS[p]?.name}","Assembler tous les ingrédients dans un grand saladier","Préparer la vinaigrette : huile d'olive + citron + moutarde + herbes","Assaisonner et mélanger juste avant de servir"] },
      { name:"{protein} vapeur & {veggie}", emoji:"🐡",
        proteins:["cabillaud","saumon","crevettes","dinde","poulet"], carbs:["patate_douce","riz_complet","quinoa"], fruits:[], fats:["huile_olive"], veggies:["brocoli","courgette","asperges","epinards","haricots_verts"],
        qty:{protein:180,carb:90,fat:5,veggie:150},
        desc:(p,c,_,v)=>`La cuisson vapeur préserve tous les nutriments sans matière grasse. Le ${FOODS[p]?.name} reste tendre et juteux. La ${FOODS[c]?.name} à IG bas recharge l'énergie proprement.`,
        steps:["Remplir le bas du cuit-vapeur d'eau","Couper les légumes en morceaux réguliers","Placer les légumes et le ${FOODS[p]?.name} dans le panier vapeur","Cuire 12-15 min selon épaisseur","Assaisonner avec herbes, citron, sel marin","Servir chaud avec la ${FOODS[c]?.name} cuite à part"] },
      { name:"Wok {protein} & {veggie}", emoji:"🥢",
        proteins:["poulet","dinde","crevettes","cabillaud","boeuf"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["champignon","poivron","brocoli","courgette","epinards","carotte"],
        qty:{protein:160,fat:8,veggie:200},
        desc:(p,_,__,v)=>`Le wok sèche ultra-rapide. Cuisson à haute température, saveurs caramélisées, zéro excès de matière grasse. Le ${FOODS[p]?.name} reste tendre et les ${FOODS[v]?.name} conservent leur croquant.`,
        steps:["Couper tous les ingrédients en morceaux similaires","Chauffer le wok ou poêle à feu vif 2 min","Faire sauter le ${FOODS[p]?.name} 3-4 min en remuant constamment","Ajouter les légumes les plus durs d'abord (carotte, brocoli)","Puis les plus tendres (courgette, épinards)","Assaisonner avec sauce soja légère, gingembre, ail","Servir immédiatement"] },
      { name:"Wrap {protein} & {veggie}", emoji:"🌯",
        proteins:["dinde","poulet","thon","crevettes","cabillaud"], carbs:["pain_seigle","pain_complet"], fruits:[], fats:[], veggies:["salade","tomate","concombre","poivron","carotte"],
        qty:{protein:130,carb:60,veggie:100},
        desc:(p,c,_,v)=>`Le déjeuner nomade de la sèche. Le ${FOODS[p]?.name} est pratique et riche en protéines. Le pain ${FOODS[c]?.name} à IG bas évite les coups de barre.`,
        steps:["Couper tous les légumes en julienne ou rondelles","Réchauffer ou griller le pain légèrement","Étaler une fine couche de moutarde ou fromage blanc","Disposer la salade en base","Ajouter le ${FOODS[p]?.name} puis les légumes","Rouler serré et couper en deux","Envelopper dans du papier cuisson si à emporter"] },
    ],
    "Dîner": [
      { name:"{protein} grillé & {veggie}", emoji:"🍗",
        proteins:["saumon","cabillaud","poulet","crevettes","dinde","thon"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["asperges","brocoli","epinards","courgette","haricots_verts","champignon"],
        qty:{protein:160,fat:5,veggie:220},
        desc:(p,_,__,v)=>`Le dîner sèche idéal : riche en protéines, pauvre en glucides. Le ${FOODS[p]?.name} grillé favorise la récupération nocturne. Les ${FOODS[v]?.name} sont diurétiques et drainants.`,
        steps:["Préchauffer le four à 200°C ou préparer le grill","Assaisonner le ${FOODS[p]?.name} avec herbes, ail, citron","Disposer les légumes sur une plaque de four avec filet d'huile","Enfourner les légumes 20 min en les retournant à mi-cuisson","Griller le ${FOODS[p]?.name} 5-7 min de chaque côté","Vérifier la cuisson et servir avec quartier de citron"] },
      { name:"Omelette {veggie} du soir", emoji:"🍳",
        proteins:["oeuf","blanc_oeuf"], carbs:[], fruits:[], fats:[], veggies:["champignon","epinards","poivron","courgette","tomate","asperges"],
        qty:{protein:180,veggie:150},
        desc:(p,_,__,v)=>`L'omelette du soir — simple, rapide, efficace. Les ${FOODS[p]?.name}s apportent des protéines à digestion modérée. Les ${FOODS[v]?.name} sautés apportent saveur et micronutriments.`,
        steps:["Faire revenir les légumes 4-5 min à feu moyen","Battre les œufs avec sel, poivre, herbes","Verser les œufs sur les légumes dans la poêle","Baisser le feu, cuire 3 min sans mélanger","Plier délicatement en deux et servir"] },
      { name:"Papillote de {protein} & {veggie}", emoji:"📦",
        proteins:["saumon","cabillaud","crevettes","dinde"], carbs:[], fruits:[], fats:["huile_olive"], veggies:["courgette","poivron","tomate","champignon","asperges","carotte"],
        qty:{protein:180,fat:5,veggie:180},
        desc:(p,_,__,v)=>`La technique reine de la sèche. Aucune matière grasse ajoutée, tous les nutriments préservés. Le ${FOODS[p]?.name} fondant avec les ${FOODS[v]?.name} confits.`,
        steps:["Préchauffer le four à 180°C","Couper une feuille de papier cuisson de 40x40cm","Déposer les légumes coupés en base","Poser le ${FOODS[p]?.name} dessus","Assaisonner avec herbes, ail, filet de citron","Refermer hermétiquement la papillote","Cuire 20-25 min selon épaisseur","Ouvrir délicatement (vapeur chaude !) et servir"] },
      { name:"Bowl zéro-carb {protein}", emoji:"🥣",
        proteins:["thon","poulet","dinde","cabillaud","crevettes"], carbs:[], fruits:[], fats:["avocat"], veggies:["salade","concombre","tomate","poivron","epinards","carotte"],
        qty:{protein:160,fat:50,veggie:150},
        desc:(p,_,__,v)=>`Le dîner zéro glucide pour maximiser la lipolyse nocturne. Sans glucides le soir, le corps puise dans les réserves de graisse pendant le sommeil.`,
        steps:["Laver et préparer tous les légumes","Couper l'avocat en deux, retirer le noyau","Émincer ou éffilocher le ${FOODS[p]?.name}","Assembler les légumes dans un bol","Ajouter le ${FOODS[p]?.name} puis l'avocat en dés","Assaisonner : huile d'olive, vinaigre balsamique, sel, herbes","Mélanger délicatement et servir frais"] },
    ],
    "Collation": [
      { name:"Shake {protein} & {fruit}", emoji:"💪",
        proteins:["whey","skyr","fromage_blanc"], carbs:[], fruits:["fraises","myrtilles","pomme","mangue","banane"], fats:[],
        qty:{protein:110,fruit:80},
        desc:(p,_,fr)=>`La collation express anti-fringale. La ${FOODS[p]?.name} apporte les acides aminés entre les repas. Les ${FOODS[fr]?.name} sucrées naturellement rendent ce shake délicieux.`,
        steps:["Ajouter le ${FOODS[p]?.name} dans le shaker","Verser 200ml d'eau froide","Ajouter les fruits frais ou surgelés","Shaker 30 secondes énergiquement","Consommer dans les 15 minutes"] },
      { name:"{protein} & crudités {veggie}", emoji:"🥒",
        proteins:["thon","cottage","fromage_blanc","skyr"], carbs:[], fruits:[], fats:[], veggies:["concombre","carotte","poivron","tomate","asperges"],
        qty:{protein:120,veggie:150},
        desc:(p,_,__,v)=>`La collation la plus simple de la sèche. Le ${FOODS[p]?.name} apporte des protéines rassasiantes, les ${FOODS[v]?.name} la texture et les fibres.`,
        steps:["Laver et couper les légumes en bâtonnets","Assaisonner le ${FOODS[p]?.name} avec herbes et citron","Servir les crudités avec le ${FOODS[p]?.name} en dip","Se conserve au frigo 24h dans une boîte hermétique"] },
      { name:"Yaourt {protein} & {fruit}", emoji:"🍓",
        proteins:["yaourt_grec","skyr","fromage_blanc","cottage"], carbs:[], fruits:["fraises","myrtilles","pomme","mangue"], fats:["graines_chia"],
        qty:{protein:180,fruit:80,fat:8},
        desc:(p,_,fr)=>`Collation fraîche et antioxydante. La caséine du ${FOODS[p]?.name} nourrit les muscles durablement. Les ${FOODS[fr]?.name} sont riches en vitamine C et polyphénols.`,
        steps:["Verser le yaourt dans un pot ou bol","Ajouter les fruits frais","Parsemer de graines de chia","Optionnel : quelques gouttes de vanille liquide","Peut se préparer la veille au soir"] },
    ],
  },

  maintien: {
    "Petit-déjeuner": [
      { name:"Porridge {fruit} & {fat}", emoji:"🌾",
        proteins:["yaourt_grec","skyr","fromage_blanc"], carbs:["avoine"], fruits:["banane","myrtilles","fraises","pomme","mangue"], fats:["amandes","graines_chia","noix","beurre_cac"], veggies:[],
        qty:{protein:120,carb:80,fruit:80,fat:20},
        desc:(p,c,fr,_,fat)=>`Le petit-déjeuner maintien par excellence. Les ${FOODS[c]?.name} libèrent l'énergie progressivement grâce à leurs fibres solubles. Le ${FOODS[p]?.name} complète les protéines.`,
        steps:["Faire chauffer 200ml de lait ou eau dans une casserole","Verser les flocons d'avoine et cuire 3-5 min en remuant","Retirer du feu et incorporer le yaourt","Ajouter les fruits frais ou décongelés","Parsemer d'amandes ou graines de chia","Servir tiède — ne jamais trop cuire le yaourt"] },
      { name:"Toast avocat & {protein}", emoji:"🥑",
        proteins:["oeuf","saumon","cottage","ricotta"], carbs:["pain_complet","pain_seigle"], fruits:[], fats:["avocat"], veggies:["tomate","epinards","salade","concombre"],
        qty:{protein:100,carb:80,fat:80,veggie:60},
        desc:(p,c,_,v)=>`Le toast équilibré tendance. L'avocat apporte des acides gras mono-insaturés excellents pour le cœur. Le ${FOODS[p]?.name} complète avec les protéines.`,
        steps:["Griller le pain jusqu'à belle coloration","Écraser l'avocat avec une fourchette, saler, citronner","Étaler généreusement sur le pain","Cuire l'œuf à la coque (6 min) ou pocher (4 min) si souhaité","Trancher les légumes finement","Déposer l'œuf et les légumes sur l'avocat","Finir avec piment d'Espelette et graines"] },
      { name:"Pancakes {carb} & {fruit}", emoji:"🥞",
        proteins:["oeuf","fromage_blanc","ricotta"], carbs:["avoine","banane"], fruits:["banane","myrtilles","fraises","mangue"], fats:["beurre_cac","miel"],
        qty:{protein:120,carb:80,fruit:80,fat:15},
        desc:(p,c,fr)=>`Des pancakes moelleux sans culpabilité. Les ${FOODS[p]?.name}s et les ${FOODS[c]?.name} forment une pâte naturellement sucrée sans farine raffinée.`,
        steps:["Mixer les flocons d'avoine en farine grossière","Ajouter les œufs, le fromage blanc, un peu de levure","Mélanger jusqu'à obtenir une pâte lisse et épaisse","Chauffer une poêle antiadhésive à feu moyen","Verser des cercles de pâte, cuire 2-3 min de chaque côté","Empiler et garnir des fruits frais","Arroser d'un filet de miel ou beurre de cacahuète"] },
      { name:"Smoothie bowl {fruit} & {fat}", emoji:"🍌",
        proteins:["yaourt_grec","skyr"], carbs:["avoine"], fruits:["myrtilles","fraises","mangue","banane","pomme"], fats:["graines_chia","amandes","noix","tahini"],
        qty:{protein:150,carb:60,fruit:100,fat:20},
        desc:(p,c,fr,_,fat)=>`Un smoothie bowl coloré et nutritif. La base ${FOODS[p]?.name} crémeuse, les ${FOODS[fr]?.name} en garniture pour les antioxydants, les ${FOODS[fat]?.name} pour le croquant.`,
        steps:["Mixer le yaourt avec la moitié des fruits jusqu'à consistance épaisse","Verser dans un bol large et plat","Disposer artistiquement les fruits restants sur le dessus","Parsemer les flocons d'avoine et les graines/oléagineux","Ajouter un trait de tahini ou beurre de cacahuète","Servir immédiatement (sans attendre, ça se liquéfie)"] },
      { name:"Granola maison {fruit}", emoji:"🌰",
        proteins:["yaourt_grec","fromage_blanc"], carbs:["avoine"], fruits:["myrtilles","fraises","banane","pomme","mangue"], fats:["amandes","noix","graines_chia"],
        qty:{protein:150,carb:60,fruit:80,fat:20},
        desc:(p,c,fr,_,fat)=>`Le granola maison sain et gourmand. Les ${FOODS[c]?.name} grillés avec les oléagineux créent ce croquant irrésistible. À préparer en grande quantité.`,
        steps:["Mélanger avoine, amandes et noix dans un grand plat","Ajouter 1 CS d'huile de coco et miel","Étaler sur plaque et cuire 20 min à 160°C en remuant à mi-cuisson","Laisser refroidir complètement (ça croquille en refroidissant)","Servir sur le yaourt avec les fruits frais","Se conserve 2 semaines en boîte hermétique"] },
    ],
    "Déjeuner": [
      { name:"Bowl {protein} & {carb} complet", emoji:"🍚",
        proteins:["poulet","dinde","saumon","boeuf","crevettes","oeuf"], carbs:["riz","quinoa","patate_douce","pates","riz_complet","pomme_terre"], fruits:[], fats:["huile_olive"], veggies:["brocoli","poivron","tomate","courgette","epinards","champignon"],
        qty:{protein:140,carb:110,fat:8,veggie:140},
        desc:(p,c,_,v)=>`Le bowl maintien idéalement équilibré. Le ${FOODS[p]?.name} fournit les protéines. Le ${FOODS[c]?.name} apporte les glucides complexes. Les ${FOODS[v]?.name} complètent avec fibres et micronutriments.`,
        steps:["Cuire le ${FOODS[c]?.name} selon les indications (10-20 min)","Préparer le ${FOODS[p]?.name} : mariner 10 min avec ail, herbes, citron","Cuire à la poêle ou four jusqu'à coloration","Sauter les légumes 5 min à feu vif","Assembler dans le bol : céréale en base, légumes, protéine","Finaliser avec filet d'huile d'olive et jus de citron"] },
      { name:"Salade {carb} & {protein}", emoji:"🌱",
        proteins:["poulet","thon","crevettes","saumon","cottage"], carbs:["quinoa","lentilles","pois_chiches","haricots"], fruits:[], fats:["huile_olive","avocat","tahini"], veggies:["epinards","tomate","concombre","poivron","salade","carotte"],
        qty:{protein:120,carb:100,fat:12,veggie:100},
        desc:(p,c,_,v)=>`Une salade complète et nutritive. Le ${FOODS[c]?.name} apporte protéines végétales et fibres. Le ${FOODS[p]?.name} complète avec les acides aminés essentiels.`,
        steps:["Cuire les légumineuses si fraîches (20 min) ou égoutter si en boîte","Laver et hacher les légumes verts","Préparer le ${FOODS[p]?.name} : cuire ou ouvrir la boîte","Vinaigrette : citron, huile d'olive, moutarde, ail, herbes","Assembler dans l'ordre : légumes verts, légumineuses, protéine","Arroser de sauce et mélanger délicatement"] },
      { name:"Pâtes {protein} & {veggie}", emoji:"🍝",
        proteins:["poulet","saumon","crevettes","boeuf","ricotta"], carbs:["pates"], fruits:[], fats:["huile_olive","mozzarella"], veggies:["poivron","champignon","tomate","courgette","epinards","asperges"],
        qty:{protein:130,carb:130,fat:12,veggie:100},
        desc:(p,c,_,v)=>`Les pâtes complètes sont excellentes en maintien. Leur IG bas libère l'énergie progressivement. Le ${FOODS[p]?.name} et les ${FOODS[v]?.name} forment un plat complet savoureux.`,
        steps:["Faire bouillir l'eau salée et cuire les pâtes al dente","Pendant ce temps, faire revenir l'ail dans l'huile d'olive","Ajouter les légumes les plus durs d'abord","Cuire le ${FOODS[p]?.name} à part ou ajouter aux légumes","Égoutter les pâtes en conservant un peu d'eau de cuisson","Mélanger pâtes, légumes, protéine avec l'eau de cuisson","Finir avec herbes fraîches et parmesan léger si souhaité"] },
      { name:"Wrap {protein} & {fat}", emoji:"🌯",
        proteins:["poulet","dinde","saumon","boeuf","thon"], carbs:["pain_complet","pain_seigle"], fruits:[], fats:["avocat","beurre_cac","tahini"], veggies:["salade","tomate","concombre","poivron","carotte"],
        qty:{protein:130,carb:80,fat:70,veggie:80},
        desc:(p,c,_,v,fat)=>`Le wrap du déjeuner généreux et équilibré. Le ${FOODS[p]?.name} avec le crémeux dans du pain ${FOODS[c]?.name} — un combo rassasiant qui dure jusqu'au dîner.`,
        steps:["Griller légèrement le pain plat","Étaler l'avocat écrasé ou le tahini sur toute la surface","Disposer les feuilles de salade en base","Ajouter le ${FOODS[p]?.name} coupé en lamelles","Garnir des légumes croquants","Rouler fermement en serrant bien","Couper en biais pour la présentation"] },
      { name:"{protein} & {carb} mijoté", emoji:"🫘",
        proteins:["boeuf","poulet","dinde","saumon"], carbs:["lentilles","haricots","pois_chiches","quinoa"], fruits:[], fats:["huile_olive"], veggies:["carotte","tomate","epinards","champignon","courgette"],
        qty:{protein:150,carb:120,fat:8,veggie:100},
        desc:(p,c,_,v)=>`Un plat mijoté réconfortant. Les ${FOODS[c]?.name} mijotées sont riches en fer et fibres. Le ${FOODS[p]?.name} complète avec les protéines animales complètes.`,
        steps:["Faire revenir l'oignon et l'ail dans l'huile d'olive 2 min","Dorer le ${FOODS[p]?.name} sur toutes les faces","Ajouter les légumes coupés et les légumineuses rincées","Couvrir de bouillon (500ml) et laisser mijoter 25-30 min","Goûter et rectifier l'assaisonnement","Finir avec herbes fraîches : persil, coriandre, thym","Peut se préparer en grande quantité et se congèle très bien"] },
    ],
    "Dîner": [
      { name:"{protein} rôti & {carb} & {veggie}", emoji:"🍗",
        proteins:["poulet","saumon","boeuf","dinde","cabillaud"], carbs:["patate_douce","pomme_terre","quinoa","riz_complet"], fruits:[], fats:["huile_olive"], veggies:["brocoli","asperges","haricots_verts","courgette","champignon","carotte"],
        qty:{protein:160,carb:150,fat:10,veggie:150},
        desc:(p,c,_,v)=>`Le plat réconfort du maintien. Le ${FOODS[p]?.name} rôti développe des saveurs profondes. La ${FOODS[c]?.name} apporte les glucides pour la récupération nocturne.`,
        steps:["Préchauffer le four à 200°C","Couper la ${FOODS[c]?.name} en dés et les légumes en morceaux","Mélanger avec huile d'olive, herbes, sel, poivre","Disposer sur plaque en une seule couche","Enfourner 25-30 min, retourner à mi-cuisson","Saisir le ${FOODS[p]?.name} à la poêle puis finir au four 15 min","Repos 5 min hors du four avant de découper","Servir avec sauce au yaourt-herbes si souhaité"] },
      { name:"Omelette complète {veggie} & {fat}", emoji:"🥚",
        proteins:["oeuf","ricotta","mozzarella"], carbs:[], fruits:[], fats:["avocat","amandes"], veggies:["epinards","champignon","poivron","tomate","courgette","asperges"],
        qty:{protein:200,fat:60,veggie:150},
        desc:(p,_,__,v,fat)=>`Un dîner chaud et équilibré. Les ${FOODS[p]?.name}s entiers apportent toutes les vitamines liposolubles. Les ${FOODS[v]?.name} sautés apportent la saveur.`,
        steps:["Saler et égoutter les légumes aqueux (tomate, courgette)","Faire revenir les légumes 5 min dans une poêle","Battre les œufs avec ricotta ou mozzarella, sel, poivre","Verser sur les légumes en formant un demi-cercle","Cuire à feu doux 4-5 min sans mélanger","Servir avec tranches d'avocat et quelques amandes effilées"] },
      { name:"Bowl {carb} & {protein} du soir", emoji:"🌟",
        proteins:["saumon","poulet","crevettes","dinde","thon"], carbs:["quinoa","riz_complet","lentilles","pois_chiches"], fruits:[], fats:["huile_olive","avocat"], veggies:["epinards","tomate","concombre","poivron","champignon"],
        qty:{protein:160,carb:100,fat:12,veggie:100},
        desc:(p,c,_,v)=>`Un dîner équilibré et anti-inflammatoire. Le ${FOODS[p]?.name} en soirée favorise la production de sérotonine. Le ${FOODS[c]?.name} apporte les glucides pour la récupération nocturne.`,
        steps:["Cuire le ${FOODS[c]?.name} (10-15 min) et laisser refroidir légèrement","Griller le ${FOODS[p]?.name} avec herbes et épices","Préparer les légumes frais : laver, couper, assaisonner","Assembler le bowl : céréale, légumes cuits et crus","Déposer le ${FOODS[p]?.name} et l'avocat en tranches","Sauce : tahini dilué avec citron et eau ou vinaigrette légère"] },
    ],
    "Collation": [
      { name:"Pain {fat} & {fruit}", emoji:"🥜",
        proteins:["yaourt_grec","skyr"], carbs:["pain_complet","pain_seigle"], fruits:["banane","pomme","fraises","mangue"], fats:["beurre_cac","amandes","tahini","noix"],
        qty:{protein:100,carb:60,fruit:100,fat:20},
        desc:(p,c,fr,_,fat)=>`La collation rassasiante. Le ${FOODS[fat]?.name} apporte protéines et graisses saines. Le pain ${FOODS[c]?.name} à IG bas et les ${FOODS[fr]?.name} complètent avec énergie et vitamines.`,
        steps:["Griller ou non le pain selon préférence","Étaler généreusement le ${FOODS[fat]?.name}","Ajouter les tranches de fruit frais sur le dessus","Optionnel : quelques flocons de sel sur le beurre de cacahuète","Accompagner d'un yaourt pour les protéines supplémentaires"] },
      { name:"Shake {protein} & cacao {carb}", emoji:"🍫",
        proteins:["whey","yaourt_grec","skyr"], carbs:["avoine","banane"], fruits:["banane"],
        qty:{protein:130,carb:70,fruit:60},
        desc:(p,c,fr)=>`Une collation façon dessert chocolaté. Le cacao cru est riche en magnésium anti-stress. La ${FOODS[p]?.name} + les ${FOODS[c]?.name} forment un duo protéiné-glucidique optimal.`,
        steps:["Verser tous les ingrédients dans le blender","Ajouter 250ml de lait d'amande ou eau","Mixer 45 secondes à puissance max","Ajouter 2-3 glaçons et remixer 15 sec","Verser dans un grand verre et savourer comme un vrai milkshake"] },
      { name:"Bowl fruits & {fat} & {protein}", emoji:"🍎",
        proteins:["yaourt_grec","skyr","cottage"], carbs:[], fruits:["pomme","banane","fraises","myrtilles","mangue"], fats:["amandes","noix","graines_chia","tahini"],
        qty:{protein:100,fruit:150,fat:25},
        desc:(p,_,fr,__,fat)=>`La collation naturelle et saine. Les ${FOODS[fr]?.name} apportent fibres et vitamine C. Les ${FOODS[fat]?.name} les graisses insaturées. Le ${FOODS[p]?.name} lie le tout.`,
        steps:["Laver et couper les fruits en morceaux","Verser le yaourt dans un bol","Déposer les fruits sur le yaourt","Parsemer les oléagineux et graines","Ajouter une cuillère de tahini ou miel si souhaité"] },
    ],
  },

  muscle: {
    "Petit-déjeuner": [
      { name:"Mega bowl {carb} & {protein} & {fat}", emoji:"💪",
        proteins:["oeuf","yaourt_grec","skyr","fromage_blanc","ricotta"], carbs:["avoine","banane","pain_complet"], fruits:["myrtilles","fraises","mangue","banane","pomme"], fats:["beurre_cac","amandes","noix","graines_chia"],
        qty:{protein:180,carb:160,fruit:80,fat:30},
        desc:(p,c,fr,_,fat)=>`Le petit-déjeuner champion de la prise de masse. Les ${FOODS[c]?.name} rechargent le glycogène dès le matin. Les ${FOODS[p]?.name}s arrêtent le catabolisme nocturne. Le ${FOODS[fat]?.name} supporte la synthèse hormonale anabolique.`,
        steps:["Cuire les flocons d'avoine dans 300ml de lait (5 min)","Incorporer le yaourt et laisser tiédir","Scrambler les œufs séparément avec beurre","Assembler dans un grand bol : avoine, œufs","Couper les fruits et les disposer sur le dessus","Ajouter une généreuse cuillère de beurre de cacahuète","Parsemer d'amandes et graines de chia","Arroser d'un filet de miel si énergie intensive prévue"] },
      { name:"Pancakes masse {carb} & {fruit}", emoji:"🥞",
        proteins:["oeuf","fromage_blanc","ricotta"], carbs:["avoine","banane","pain_complet"], fruits:["myrtilles","fraises","banane","mangue"], fats:["beurre_cac","noix","amandes","miel"],
        qty:{protein:160,carb:150,fruit:80,fat:25},
        desc:(p,c,fr,_,fat)=>`Des pancakes épais pour un réveil de champion. Les ${FOODS[p]?.name}s entiers apportent toutes les vitamines pour la synthèse hormonale. Les ${FOODS[c]?.name} fournissent l'énergie rapide.`,
        steps:["Mixer finement les flocons d'avoine et la banane écrasée","Ajouter les œufs, fromage blanc, 1/2 cc de levure chimique","Mélanger jusqu'à pâte homogène (ni trop liquide ni trop épaisse)","Chauffer poêle légèrement huilée à feu moyen","Verser des disques généreux, cuire 2-3 min par face","Empiler en hauteur et garnir fruits + beurre de cacahuète + miel","Manger chaud pour la meilleure texture"] },
      { name:"Shake masse {carb} & {fruit}", emoji:"🚀",
        proteins:["whey","yaourt_grec","skyr"], carbs:["avoine","banane"], fruits:["banane","mangue","myrtilles","fraises"], fats:["beurre_cac","amandes","noix"],
        qty:{protein:150,carb:150,fruit:100,fat:30},
        desc:(p,c,fr,_,fat)=>`Le shake de réveil pour casser le jeûne nocturne rapidement. Ce shake double absorption (whey rapide + yaourt lent) couvre le spectre complet des besoins.`,
        steps:["Verser le lait ou lait d'amande dans le blender","Ajouter la whey, le yaourt, les flocons d'avoine","Ajouter les fruits frais ou congelés","Ajouter le beurre de cacahuète ou les noix","Mixer 1 minute à puissance maximum","Vérifier la consistance — ajouter liquide si trop épais","Boire dans les 20 min après le réveil"] },
      { name:"Porridge masse {fat} & {fruit}", emoji:"🌰",
        proteins:["skyr","yaourt_grec","fromage_blanc"], carbs:["avoine"], fruits:["myrtilles","fraises","banane","mangue"], fats:["noix","amandes","beurre_cac","tahini","graines_chia"],
        qty:{protein:160,carb:130,fruit:80,fat:40},
        desc:(p,c,fr,_,fat)=>`Un porridge généreux et calorique. Les ${FOODS[fat]?.name} sont riches en oméga-3 et oméga-6 essentiels aux hormones anaboliques.`,
        steps:["Faire gonfler les flocons d'avoine dans le lait (5-7 min)","Hors feu, incorporer le yaourt pour crémer","Ajouter le beurre de cacahuète chaud pour qu'il fonde","Couper généreusement les fruits","Garnir avec noix, amandes, graines de chia","Arroser d'un filet de miel ou sirop d'érable si besoin calorique","Servir dans un grand bol — ne pas rogner sur les quantités !"] },
      { name:"Toast masse {protein} & {fat}", emoji:"🍞",
        proteins:["oeuf","ricotta","mozzarella","skyr"], carbs:["pain_complet","pain_seigle"], fruits:["banane","mangue"], fats:["avocat","beurre_cac","tahini"],
        qty:{protein:150,carb:120,fat:100,fruit:80},
        desc:(p,c,_,__,fat)=>`Un petit-déjeuner solide pour la prise de masse. Le pain ${FOODS[c]?.name} apporte glucides complexes et fibres. Le ${FOODS[fat]?.name} ajoute les calories et graisses saines.`,
        steps:["Griller les toasts épaisseur généreuse","Scrambler les œufs avec ricotta pour crémeux (feu très doux)","Écraser l'avocat sur un toast avec sel et citron","Étaler beurre de cacahuète généreusement sur l'autre","Déposer les œufs scramblés sur l'avocat","Disposer les fruits coupés sur le beurre de cacahuète","Assembler les deux toasts ou manger séparément","Accompagner d'un grand verre de lait si insuffisant"] },
    ],
    "Déjeuner": [
      { name:"Assiette force {protein} & {carb}", emoji:"🥩",
        proteins:["boeuf","poulet","dinde","saumon","oeuf","crevettes"], carbs:["patate_douce","riz","quinoa","pates","pomme_terre","riz_complet"], fruits:[], fats:["huile_olive"], veggies:["brocoli","epinards","carotte","haricots_verts","poivron","champignon"],
        qty:{protein:250,carb:250,fat:12,veggie:150},
        desc:(p,c,_,v)=>`L'assiette de force pour la prise de masse. Le ${FOODS[p]?.name} est riche en créatine naturelle et zinc — clés de la synthèse protéique. La ${FOODS[c]?.name} reconstitue les stocks de glycogène.`,
        steps:["Peser et préparer toutes les portions avec précision","Cuire le ${FOODS[c]?.name} selon le paquet","Mariner le ${FOODS[p]?.name} : ail, herbes, soja, huile d'olive (minimum 30 min)","Cuire à la poêle en finissant au four si morceau épais","Préparer les légumes vapeur ou sautés","Assembler sur une grande assiette : céréale, légumes, viande","Ne pas hésiter sur les quantités — c'est le but du maintien calorique !","Peser la portion pour s'assurer du surplus calorique"] },
      { name:"Bowl {carb} power & {protein}", emoji:"💥",
        proteins:["poulet","boeuf","saumon","dinde","oeuf"], carbs:["riz","quinoa","pates","patate_douce","riz_complet","lentilles"], fruits:[], fats:["huile_olive","avocat"], veggies:["brocoli","epinards","poivron","champignon","courgette"],
        qty:{protein:220,carb:230,fat:15,veggie:150},
        desc:(p,c,_,v)=>`Le bowl de bodybuilding classique. Le ${FOODS[p]?.name} apporte les protéines complètes, le ${FOODS[c]?.name} les glucides complexes. Les ${FOODS[v]?.name} fournissent les vitamines B.`,
        steps:["Cuire une grande quantité de ${FOODS[c]?.name} (meal prep semaine)","Mariner le ${FOODS[p]?.name} 1h si possible pour plus de saveur","Cuire à feu vif pour la caramélisation en surface","Préparer légumes sautés à l'ail et gingembre","Assembler généreusement dans un grand bol","Sauce : soja, miel, huile de sésame, ail, citron","Parsemer graines de sésame et herbes fraîches","Peser le tout pour vérifier les macros cibles"] },
      { name:"Pâtes masse {protein} & {veggie}", emoji:"🍝",
        proteins:["poulet","boeuf","saumon","crevettes","ricotta"], carbs:["pates"], fruits:[], fats:["huile_olive","mozzarella","ricotta"], veggies:["epinards","tomate","champignon","poivron","courgette","asperges"],
        qty:{protein:200,carb:230,fat:18,veggie:120},
        desc:(p,c,_,v)=>`Un plat de pâtes hypercalorique pour la masse. Les pâtes complètes apportent une quantité importante de glucides complexes.`,
        steps:["Cuire généreusement les pâtes al dente dans eau bouillante salée","Préparer la sauce : ail doré, tomates cerises, herbes fraîches","Cuire le ${FOODS[p]?.name} à la poêle puis déglacer avec eau de cuisson","Incorporer épinards et champignons dans la sauce","Mélanger pâtes, sauce, protéine dans le grand plat","Finir avec mozzarella fondue par-dessus","Servir immédiatement dans un grand plat — portion généreuse !"] },
      { name:"Riz {protein} & légumes sautés", emoji:"🍚",
        proteins:["poulet","boeuf","crevettes","saumon","dinde"], carbs:["riz","riz_complet"], fruits:[], fats:["huile_olive"], veggies:["brocoli","poivron","carotte","champignon","epinards","haricots_verts"],
        qty:{protein:230,carb:250,fat:12,veggie:150},
        desc:(p,c,_,v)=>`Le classique riz-${FOODS[p]?.name} version gastro. Le ${FOODS[c]?.name} basmati avec les légumes colorés — un plat complet pour la prise de masse propre.`,
        steps:["Rincer le riz plusieurs fois et cuire à absorption (1 riz/2 eau)","Pendant ce temps, préparer la marinade pour le ${FOODS[p]?.name}","Saisir le ${FOODS[p]?.name} à feu vif 4-5 min","Retirer et réserver au chaud sous papier alu","Sauter les légumes dans le même wok","Déglacer avec bouillon, soja, ail","Remettre le ${FOODS[p]?.name} et mélanger","Servir riz en base, dessus les légumes et la protéine"] },
    ],
    "Dîner": [
      { name:"{protein} & {carb} anabolique", emoji:"🌙",
        proteins:["saumon","poulet","boeuf","oeuf","dinde","cabillaud"], carbs:["quinoa","riz_complet","patate_douce","lentilles","pomme_terre","pois_chiches"], fruits:[], fats:["huile_olive","avocat"], veggies:["epinards","brocoli","champignon","tomate","haricots_verts"],
        qty:{protein:220,carb:200,fat:14,veggie:150},
        desc:(p,c,_,v)=>`Le dîner anabolique par excellence. Le ${FOODS[p]?.name} riche en oméga-3 active les voies de synthèse protéique pendant la nuit. Le ${FOODS[c]?.name} fournit les glucides pour la récupération.`,
        steps:["Cuire le ${FOODS[c]?.name} : vapeur ou four selon le légume","Assaisonner généreusement le ${FOODS[p]?.name}","Rôtir au four 20-25 min à 190°C","Sauter les légumes verts rapidement à l'ail","Assembler dans un grand plat : céréale en base","Disposer les légumes et la protéine artistiquement","Finir avec tranches d'avocat et herbes fraîches","Consommer 2h avant le coucher pour optimiser la synthèse"] },
      { name:"Omelette massive & {carb}", emoji:"🥚",
        proteins:["oeuf"], carbs:["patate_douce","pomme_terre","quinoa","riz_complet"], fruits:[], fats:["avocat","ricotta","mozzarella"], veggies:["epinards","champignon","poivron","tomate","courgette"],
        qty:{protein:280,carb:220,fat:70,veggie:150},
        desc:(p,c,_,v)=>`Un dîner chaud et hypercalorique pour les soirs d'entraînement. Les ${FOODS[p]?.name}s avant le sommeil fournissent des protéines à digestion progressive.`,
        steps:["Cuire la ${FOODS[c]?.name} au four ou vapeur (20 min)","Faire revenir les légumes à l'ail 5 min","Battre 4-5 œufs avec ricotta, sel, poivre généreusement","Verser sur les légumes dans grande poêle","Ajouter mozzarella râpée sur le dessus","Couvrir et cuire 4-5 min à feu doux","Servir avec la ${FOODS[c]?.name} et tranches d'avocat","Un repas complet et généreux pour la récupération nocturne"] },
      { name:"{protein} mijoté & {carb}", emoji:"🍖",
        proteins:["boeuf","poulet","dinde","saumon"], carbs:["lentilles","haricots","pois_chiches","patate_douce","quinoa"], fruits:[], fats:["huile_olive"], veggies:["carotte","tomate","champignon","epinards","poivron"],
        qty:{protein:230,carb:180,fat:12,veggie:120},
        desc:(p,c,_,v)=>`Un plat mijoté riche pour la fin de journée. Le ${FOODS[p]?.name} mijoté libère ses protéines progressivement. Les ${FOODS[c]?.name} apportent protéines végétales et fibres.`,
        steps:["Faire revenir oignon, ail, épices dans l'huile chaude","Dorer le ${FOODS[p]?.name} en morceaux sur toutes les faces","Déglacer avec bouillon chaud (500ml minimum)","Ajouter ${FOODS[c]?.name} et légumes en morceaux","Mijoter à feu doux couvert 35-45 min","Vérifier la cuisson : légumineuses fondantes, viande tendre","Rectifier assaisonnement, ajouter herbes fraîches","Ce plat est encore meilleur le lendemain — préparer double portion"] },
    ],
    "Collation": [
      { name:"Shake masse post-workout {fruit}", emoji:"🏋️",
        proteins:["whey","yaourt_grec"], carbs:["avoine","banane"], fruits:["banane","mangue","myrtilles","fraises"], fats:["beurre_cac","amandes","noix"],
        qty:{protein:160,carb:150,fruit:100,fat:30},
        desc:(p,c,fr,_,fat)=>`La collation post-entraînement optimale. Dans les 30-60 min après l'effort, la ${FOODS[p]?.name} + les ${FOODS[fr]?.name} créent un pic insulinique qui transporte les acides aminés dans les muscles.`,
        steps:["Préparer le shaker à l'avance dans le sac de sport","Immédiatement après l'entraînement, mélanger whey + eau froide","Mixer séparément : banane, yaourt, avoine, autres fruits","Combiner les deux préparations","Ajouter beurre de cacahuète et mixer 30 sec","Boire dans les 20 min pour optimiser la fenêtre anabolique","Accompagner d'une banane si entraînement très intense"] },
      { name:"Bol {carb} pré-workout & {fat}", emoji:"⚡",
        proteins:["yaourt_grec","skyr","fromage_blanc"], carbs:["avoine","banane","pain_complet"], fruits:["banane","myrtilles","fraises"], fats:["noix","amandes","beurre_cac","tahini"],
        qty:{protein:150,carb:150,fruit:80,fat:35},
        desc:(p,c,fr,_,fat)=>`La collation idéale 90 minutes avant l'entraînement. Les glucides complexes des ${FOODS[c]?.name} libèrent une énergie stable pendant tout l'effort.`,
        steps:["Préparer 90 minutes avant l'entraînement (pas moins !)","Mélanger le yaourt avec les flocons d'avoine crus","Ajouter les fruits coupés en morceaux","Incorporer les noix/amandes pour les graisses lentes","Optionnel : ajouter 1/2 banane pour énergie rapide supplémentaire","Manger tranquillement, mastiquer bien","Hydrater correctement avec 500ml d'eau après"] },
      { name:"Toast masse {fat} & {carb}", emoji:"🥜",
        proteins:["yaourt_grec","fromage_blanc","ricotta"], carbs:["pain_complet","pain_seigle","banane"], fruits:["banane","fraises","mangue"], fats:["beurre_cac","amandes","tahini","noix"],
        qty:{protein:120,carb:100,fruit:80,fat:35},
        desc:(p,c,fr,_,fat)=>`La collation énergétique des athlètes. Le ${FOODS[fat]?.name} + les ${FOODS[fr]?.name} sur du pain ${FOODS[c]?.name} — combinaison plébiscitée par les sportifs de haut niveau.`,
        steps:["Griller généreusement le pain ou manger à température ambiante","Étaler une couche épaisse de beurre de cacahuète ou tahini","Couper fruits frais en tranches","Disposer joliment sur le dessus","Optionnel : filet de miel et quelques amandes concassées","Accompagner d'un yaourt pour les protéines complémentaires","Idéal entre deux entraînements ou après l'école/travail"] },
    ],
  },
};

// ─── Fonctions core ───────────────────────────────────────────────────────────
function computeMacros(ingredients) {
  let cal=0,p=0,c=0,f=0;
  Object.entries(ingredients).forEach(([k,g])=>{
    const fd=FOODS[k]; if(!fd||!g)return;
    const s=g/100; cal+=fd.cal*s; p+=fd.p*s; c+=fd.c*s; f+=fd.f*s;
  });
  return {cal:Math.round(cal),p:Math.round(p*10)/10,c:Math.round(c*10)/10,f:Math.round(f*10)/10};
}

function computeMicros(ingredients) {
  let fiber=0,iron=0,vitC=0,calcium=0,magnesium=0,omega3=0;
  Object.entries(ingredients).forEach(([k,g])=>{
    const fd=FOODS[k]; if(!fd||!g)return;
    const s=g/100;
    fiber+=fd.fiber*s; iron+=fd.iron*s; vitC+=fd.vitC*s;
    calcium+=fd.calcium*s; magnesium+=fd.magnesium*s; omega3+=fd.omega3*s;
  });
  return {
    fiber:Math.round(fiber*10)/10, iron:Math.round(iron*10)/10,
    vitC:Math.round(vitC), calcium:Math.round(calcium),
    magnesium:Math.round(magnesium), omega3:Math.round(omega3*10)/10
  };
}

function getAdjustableInfo(ingredients) {
  const keys=Object.keys(ingredients);
  const hasProtein=keys.some(k=>FOODS[k]?.p>12);
  const hasCarb=keys.some(k=>FOODS[k]?.c>12&&(FOODS[k]?.p||0)<12);
  const hasFat=keys.some(k=>FOODS[k]?.f>8);
  return {hasProtein,hasCarb,hasFat};
}

function adjustRecipe(base,targets) {
  const ing={...base}; const keys=Object.keys(ing);
  const PS=keys.filter(k=>FOODS[k]?.p>12);
  const CS=keys.filter(k=>FOODS[k]?.c>12&&(FOODS[k]?.p||0)<12);
  const FS=keys.filter(k=>FOODS[k]?.f>8);
  const bm=computeMacros(ing);
  if(PS.length&&bm.p>0&&targets.p!=null){
    const r=Math.max(0.3,Math.min(4,targets.p/bm.p));
    PS.forEach(k=>{ing[k]=Math.max(10,Math.round(ing[k]*r));});
  }
  if(CS.length&&bm.c>0&&targets.c!=null){
    const r=Math.max(0.2,Math.min(4,targets.c/Math.max(bm.c,1)));
    CS.forEach(k=>{ing[k]=Math.max(10,Math.round(ing[k]*r));});
  }
  if(FS.length&&bm.f>0&&targets.f!=null){
    const r=Math.max(0.2,Math.min(4,targets.f/Math.max(bm.f,1)));
    FS.forEach(k=>{ing[k]=Math.max(5,Math.round(ing[k]*r));});
  }
  return ing;
}

function generateRecipes() {
  const all=[]; let id=0;
  Object.entries(TEMPLATES).forEach(([goal,meals])=>{
    Object.entries(meals).forEach(([meal,tpls])=>{
      tpls.forEach(tpl=>{
        const P=tpl.proteins?.length?tpl.proteins:[null];
        const C=tpl.carbs?.length?tpl.carbs:[null];
        const FR=tpl.fruits?.length?tpl.fruits:[null];
        const V=tpl.veggies?.length?tpl.veggies:[null];
        const FA=tpl.fats?.length?tpl.fats:[null];
        P.forEach(p=>C.forEach(c=>FR.forEach(fr=>V.forEach(v=>FA.forEach(fat=>{
          const ing={};
          if(p&&tpl.qty.protein)ing[p]=tpl.qty.protein;
          if(c&&tpl.qty.carb)ing[c]=tpl.qty.carb;
          if(fr&&tpl.qty.fruit)ing[fr]=tpl.qty.fruit;
          if(v&&tpl.qty.veggie)ing[v]=tpl.qty.veggie;
          if(fat&&tpl.qty.fat)ing[fat]=tpl.qty.fat;
          if(Object.keys(ing).length<2)return;
          const m=computeMacros(ing); if(m.cal<80)return;
          let name=tpl.name
            .replace("{protein}",p?FOODS[p]?.name:"").replace("{carb}",c?FOODS[c]?.name:"")
            .replace("{fruit}",fr?FOODS[fr]?.name:"").replace("{veggie}",v?FOODS[v]?.name:"")
            .replace("{fat}",fat?FOODS[fat]?.name:"");
          let descTxt=""; try{descTxt=tpl.desc(p,c,fr,v,fat)||"";}catch(e){}
          all.push({id:`r${id++}`,goal,meal,name,emoji:tpl.emoji,desc:descTxt,steps:tpl.steps||[],ingredients:ing});
        })))));
      });
    });
  });
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

const MICRO_INFO={
  fiber:    {label:"Fibres",   unit:"g",  rdi:25,  color:"#8a9e70",icon:"🌾"},
  iron:     {label:"Fer",      unit:"mg", rdi:16,  color:"#c87a5a",icon:"⚡"},
  vitC:     {label:"Vit. C",   unit:"mg", rdi:80,  color:"#e0a030",icon:"🍋"},
  calcium:  {label:"Calcium",  unit:"mg", rdi:900, color:"#7a9eb8",icon:"🦴"},
  magnesium:{label:"Magnésium",unit:"mg", rdi:300, color:"#9e7ab8",icon:"💜"},
  omega3:   {label:"Oméga-3",  unit:"g",  rdi:1.6, color:"#5a9e8a",icon:"🐟"},
};


// ─── SLIDER MOBILE-FIRST (touch natif non-passif) ─────────────────────────────
function Slider({label,unit,value,min,max,step=1,onChange,color,disabled}){
  const trackRef=useRef(null);
  const pct=disabled?0:Math.max(0,Math.min(100,((value-min)/(max-min))*100));

  // Attach non-passive touchmove so we can e.preventDefault() → empêche le scroll
  useEffect(()=>{
    const el=trackRef.current; if(!el||disabled)return;
    const onMove=(e)=>{
      e.preventDefault();
      const r=el.getBoundingClientRect();
      const ratio=Math.max(0,Math.min(1,(e.touches[0].clientX-r.left)/r.width));
      const v=Math.round((min+ratio*(max-min))/step)*step;
      onChange(Math.max(min,Math.min(max,v)));
    };
    el.addEventListener("touchmove",onMove,{passive:false});
    return()=>el.removeEventListener("touchmove",onMove);
  },[disabled,min,max,step,onChange]);

  const onTouchStart=(e)=>{
    if(disabled)return;
    const r=trackRef.current.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(e.touches[0].clientX-r.left)/r.width));
    const v=Math.round((min+ratio*(max-min))/step)*step;
    onChange(Math.max(min,Math.min(max,v)));
  };

  return(
    <div style={{marginBottom:16,opacity:disabled?0.4:1}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
        <span style={{fontSize:10,fontWeight:700,color:"#999",textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {disabled&&<span style={{fontSize:9,color:"#ccc",fontStyle:"italic"}}>non ajustable</span>}
          <span style={{fontSize:14,fontWeight:800,color:DARK,fontFamily:"'Cormorant Garamond',serif"}}>{value}<span style={{fontSize:10,color:"#ccc",fontWeight:400,marginLeft:2}}>{unit}</span></span>
        </div>
      </div>
      {/* Zone de touch large 44px min (Apple HIG) avec touchAction:none */}
      <div ref={trackRef} onTouchStart={onTouchStart}
        style={{position:"relative",height:44,display:"flex",alignItems:"center",touchAction:"none",cursor:disabled?"default":"pointer"}}>
        <div style={{position:"absolute",left:0,right:0,height:6,background:"#ede7e0",borderRadius:999}}>
          <div style={{height:"100%",width:`${pct}%`,background:disabled?"#e0d8d0":`linear-gradient(90deg,${ROSE_L},${color})`,borderRadius:999}}/>
        </div>
        {/* input range visible uniquement desktop (fallback) */}
        {!disabled&&<input type="range" min={min} max={max} step={step} value={value}
          onChange={e=>onChange(+e.target.value)}
          style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",zIndex:3}}/>}
        {/* Thumb visuel agrandi */}
        <div style={{position:"absolute",left:`${pct}%`,transform:"translateX(-50%)",
          width:22,height:22,borderRadius:"50%",
          background:disabled?"#e0d8d0":"#fff",
          border:`2px solid ${disabled?"#e0d8d0":color}`,
          boxShadow:disabled?"none":"0 2px 10px rgba(0,0,0,0.18)",
          pointerEvents:"none",zIndex:2,transition:"left 0.05s"}}/>
      </div>
      {!disabled&&<div style={{display:"flex",justifyContent:"space-between",marginTop:-4}}>
        <span style={{fontSize:9,color:"#ddd"}}>{min}{unit}</span>
        <span style={{fontSize:9,color:"#ddd"}}>{max}{unit}</span>
      </div>}
    </div>
  );
}

// ─── CONSTANTES SEMAINIER ─────────────────────────────────────────────────────
const DAYS=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const DAYLABELS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const SLOTS=["Petit-déjeuner","Déjeuner","Dîner","Collation"];
const SLOT_ICONS={"Petit-déjeuner":"☀️","Déjeuner":"🌤️","Dîner":"🌙","Collation":"🍎"};
const emptyWeek=()=>Object.fromEntries(DAYS.map(d=>[d,Object.fromEntries(SLOTS.map(s=>[s,[]]))]))

// Tags auto-calculés sur les recettes
const getTags=(r)=>{
  const m=computeMacros(r.ingredients);
  const tags=[];
  if(m.p/m.cal>0.24)tags.push("💪 Haute protéine");
  if(m.cal<320)tags.push("⚡ Léger");
  if(r.steps&&r.steps.length<=3)tags.push("🕐 Rapide");
  if(Object.keys(r.ingredients).some(k=>["lentilles","pois_chiches","haricots","quinoa"].includes(k)))tags.push("🌱 Végétarien");
  return tags;
};
const ALL_TAGS=["💪 Haute protéine","⚡ Léger","🕐 Rapide","🌱 Végétarien"];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function FitWomenApp(){
  // ── États de base ──
  const [activeGoal,setActiveGoal]=useState("seche");
  const [activeMeal,setActiveMeal]=useState("Tous");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [showDetail,setShowDetail]=useState(false);
  const [customized,setCustomized]=useState(false);
  const [sliders,setSliders]=useState({p:35,c:35,f:15});
  const [page,setPage]=useState(1);
  const [activeTab,setActiveTab]=useState("recette");
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<768);

  // ── Onboarding / Profil ──
  const [profile,setProfile]=useState(()=>{try{return JSON.parse(localStorage.getItem("fw_profile")||"null")||{done:false,name:"",goal:"seche",calTarget:1600};}catch{return{done:false,name:"",goal:"seche",calTarget:1600};}});
  const [showOnboarding,setShowOnboarding]=useState(()=>{try{const p=JSON.parse(localStorage.getItem("fw_profile")||"null");return!p?.done;}catch{return true;}});
  const [showProfile,setShowProfile]=useState(false);
  const [pName,setPName]=useState(profile.name||"");
  const [pGoal,setPGoal]=useState(profile.goal||"seche");
  const [pCal,setPCal]=useState(profile.calTarget||1600);
  const [obStep,setObStep]=useState(0);
  const [obName,setObName]=useState("");
  const [obGoal,setObGoal]=useState("seche");
  const [obCal,setObCal]=useState(1600);

  // ── Favoris ──
  const [favorites,setFavorites]=useState(()=>{try{return JSON.parse(localStorage.getItem("fw_favs")||"[]");}catch{return[];}});
  const [showFavsOnly,setShowFavsOnly]=useState(false);

  // ── Tri & Tags ──
  const [sortBy,setSortBy]=useState("default");
  const [activeTagFilter,setActiveTagFilter]=useState(null);
  const [showSortPanel,setShowSortPanel]=useState(false);

  // ── Liste de courses ──
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem("fw_cart")||"[]");}catch{return[];}});
  const [showCart,setShowCart]=useState(false);
  const [checkedItems,setCheckedItems]=useState({});

  // ── Budget journalier ──
  const [dailyGoalKcal,setDailyGoalKcal]=useState(()=>profile.calTarget||1600);
  const [dailyRecipes,setDailyRecipes]=useState([]);
  const [showDailyPanel,setShowDailyPanel]=useState(false);
  const [editingGoal,setEditingGoal]=useState(false);
  const [tmpGoal,setTmpGoal]=useState(dailyGoalKcal);

  // ── Semainier ──
  const [week,setWeek]=useState(()=>{try{return JSON.parse(localStorage.getItem("fw_week")||"null")||emptyWeek();}catch{return emptyWeek();}});
  const [showWeek,setShowWeek]=useState(false);
  const [weekDay,setWeekDay]=useState(DAYS[new Date().getDay()===0?6:new Date().getDay()-1]);
  const [addToWeekTarget,setAddToWeekTarget]=useState(null); // {day,slot}
  const [showWeekPicker,setShowWeekPicker]=useState(false);

  // ── Animations swipe ──
  const [swipeAnim,setSwipeAnim]=useState(null); // 'left'|'right'|null

  const PER_PAGE=20;
  const listRef=useRef(null);

  // ── Resize ──
  useEffect(()=>{
    const r=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",r);
    return()=>window.removeEventListener("resize",r);
  },[]);

  // ── Persistance ──
  useEffect(()=>{localStorage.setItem("fw_favs",JSON.stringify(favorites));},[favorites]);
  useEffect(()=>{localStorage.setItem("fw_cart",JSON.stringify(cart));},[cart]);
  useEffect(()=>{localStorage.setItem("fw_goal",String(dailyGoalKcal));},[dailyGoalKcal]);
  useEffect(()=>{localStorage.setItem("fw_week",JSON.stringify(week));},[week]);
  useEffect(()=>{if(profile.done)localStorage.setItem("fw_profile",JSON.stringify(profile));},[profile]);

  // Sync objectif calorique avec le profil
  useEffect(()=>{if(profile.calTarget)setDailyGoalKcal(profile.calTarget);},[profile.calTarget]);
  // Sync états panneau profil quand on l'ouvre
  useEffect(()=>{if(showProfile){setPName(profile.name||"");setPGoal(profile.goal||"seche");setPCal(profile.calTarget||1600);}},[showProfile]);

  // Scroll to top on filter change
  useEffect(()=>{listRef.current?.scrollTo(0,0);window.scrollTo(0,0);},[activeGoal,activeMeal]);

  // ── Filtrage + Tri ──
  const filtered=useMemo(()=>{
    let list=ALL_RECIPES.filter(r=>
      r.goal===activeGoal&&
      (activeMeal==="Tous"||r.meal===activeMeal)&&
      (search===""||r.name.toLowerCase().includes(search.toLowerCase()))&&
      (!showFavsOnly||favorites.includes(r.id))&&
      (!activeTagFilter||getTags(r).includes(activeTagFilter))
    );
    if(sortBy==="cal_asc")list=[...list].sort((a,b)=>computeMacros(a.ingredients).cal-computeMacros(b.ingredients).cal);
    else if(sortBy==="cal_desc")list=[...list].sort((a,b)=>computeMacros(b.ingredients).cal-computeMacros(a.ingredients).cal);
    else if(sortBy==="prot_desc")list=[...list].sort((a,b)=>computeMacros(b.ingredients).p-computeMacros(a.ingredients).p);
    return list;
  },[activeGoal,activeMeal,search,showFavsOnly,favorites,activeTagFilter,sortBy]);

  const paginated=useMemo(()=>filtered.slice(0,page*PER_PAGE),[filtered,page]);
  const mealCounts=useMemo(()=>{const c={};ALL_RECIPES.filter(r=>r.goal===activeGoal).forEach(r=>{c[r.meal]=(c[r.meal]||0)+1;});return c;},[activeGoal]);

  // ── Touch bottom sheet ──
  const touchRef=useRef({});
  const filteredRef=useRef(filtered);
  useEffect(()=>{filteredRef.current=filtered;},[filtered]);

  const onSheetTouchStart=useCallback((e)=>{
    touchRef.current={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()};
  },[]);
  const onSheetTouchEnd=useCallback((e)=>{
    const dx=e.changedTouches[0].clientX-touchRef.current.x;
    const dy=e.changedTouches[0].clientY-touchRef.current.y;
    const dt=Date.now()-touchRef.current.t;
    if(dt>700)return;
    if(dy>55&&Math.abs(dx)<100){setShowDetail(false);setSelected(null);return;}
    if(Math.abs(dx)>65&&Math.abs(dy)<65){
      const dir=dx<0?"left":"right";
      const list=filteredRef.current;
      setSelected(prev=>{
        if(!prev)return prev;
        const idx=list.findIndex(r=>r.id===prev.id);
        const target=dx<0?(idx<list.length-1?list[idx+1]:null):(idx>0?list[idx-1]:null);
        if(!target)return prev;
        setSwipeAnim(dir);
        setTimeout(()=>setSwipeAnim(null),350);
        const m=computeMacros(target.ingredients);
        setSliders({p:Math.round(m.p),c:Math.round(m.c),f:Math.round(m.f)});
        setCustomized(false);setActiveTab("recette");
        return target;
      });
    }
  },[]);

  // ── Sélection recette ──
  const selectRecipe=useCallback((r)=>{
    const m=computeMacros(r.ingredients);
    setSliders({p:Math.round(m.p),c:Math.round(m.c),f:Math.round(m.f)});
    setSelected(r);setCustomized(false);setShowDetail(true);setActiveTab("recette");
  },[]);
  const setSlider=useCallback((key,val)=>{setSliders(s=>({...s,[key]:val}));setCustomized(true);},[]);

  // ── Favoris ──
  const toggleFav=(id,e)=>{e?.stopPropagation();setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);};

  // ── Courses ──
  const addToCart=(recipe,e)=>{
    e?.stopPropagation();
    setCart(c=>{const ex=c.find(x=>x.id===recipe.id);if(ex)return c.map(x=>x.id===recipe.id?{...x,qty:x.qty+1}:x);return[...c,{id:recipe.id,name:recipe.name,emoji:recipe.emoji,ingredients:recipe.ingredients,qty:1}];});
  };
  const removeFromCart=(id)=>setCart(c=>c.filter(x=>x.id!==id));
  const clearCart=()=>{setCart([]);setCheckedItems({});};
  const shoppingList=useMemo(()=>{
    const agg={};
    cart.forEach(item=>{Object.entries(item.ingredients).forEach(([k,g])=>{agg[k]=(agg[k]||0)+g*item.qty;});});
    return Object.entries(agg).map(([k,g])=>({key:k,food:FOODS[k],grams:Math.round(g)})).filter(x=>x.food).sort((a,b)=>a.food.name.localeCompare(b.food.name));
  },[cart]);

  // ── Budget journalier ──
  const adjIngredients=useMemo(()=>selected?adjustRecipe(selected.ingredients,sliders):null,[selected,sliders]);
  const adjMacros=useMemo(()=>adjIngredients?computeMacros(adjIngredients):null,[adjIngredients]);
  const adjMicros=useMemo(()=>adjIngredients?computeMicros(adjIngredients):null,[adjIngredients]);
  const adjInfo=useMemo(()=>selected?getAdjustableInfo(selected.ingredients):null,[selected]);
  const baseMacros=useMemo(()=>selected?computeMacros(selected.ingredients):null,[selected]);
  const sliderRanges=useMemo(()=>{
    if(!baseMacros||!adjInfo)return{p:{min:5,max:100},c:{min:0,max:150},f:{min:0,max:80}};
    return{
      p:{min:adjInfo.hasProtein?Math.max(5,Math.round(baseMacros.p*0.3)):Math.round(baseMacros.p),max:adjInfo.hasProtein?Math.round(baseMacros.p*3.5):Math.round(baseMacros.p)},
      c:{min:adjInfo.hasCarb?Math.max(0,Math.round(baseMacros.c*0.2)):Math.round(baseMacros.c),max:adjInfo.hasCarb?Math.round(baseMacros.c*3.5):Math.round(baseMacros.c)},
      f:{min:adjInfo.hasFat?Math.max(0,Math.round(baseMacros.f*0.2)):Math.round(baseMacros.f),max:adjInfo.hasFat?Math.round(baseMacros.f*3.5):Math.round(baseMacros.f)},
    };
  },[baseMacros,adjInfo]);

  const addToDay=(recipe,e)=>{
    e?.stopPropagation();
    const ing=adjIngredients||recipe.ingredients;
    const snap=computeMacros(ing);
    setDailyRecipes(d=>[...d,{id:recipe.id,name:recipe.name,emoji:recipe.emoji,meal:recipe.meal,ingredients:ing,macros:snap,addedAt:Date.now()}]);
  };
  const removeFromDay=(idx)=>setDailyRecipes(d=>d.filter((_,i)=>i!==idx));
  const dailyTotals=useMemo(()=>dailyRecipes.reduce((acc,r)=>{const m=r.macros||computeMacros(r.ingredients);return{cal:acc.cal+m.cal,p:acc.p+m.p,c:acc.c+m.c,f:acc.f+m.f};},{cal:0,p:0,c:0,f:0}),[dailyRecipes]);
  const dailyCal=Math.round(dailyTotals.cal);
  const dailyPct=Math.min(100,Math.round((dailyCal/dailyGoalKcal)*100));
  const remaining=Math.max(0,dailyGoalKcal-dailyCal);

  // ── Semainier ──
  const addToWeek=(day,slot,recipe)=>{
    const ing=adjIngredients||recipe.ingredients;
    const snap=computeMacros(ing);
    setWeek(w=>({...w,[day]:{...w[day],[slot]:[...w[day][slot],{id:recipe.id,name:recipe.name,emoji:recipe.emoji,macros:snap}]}}));
  };
  const removeFromWeek=(day,slot,idx)=>{
    setWeek(w=>({...w,[day]:{...w[day],[slot]:w[day][slot].filter((_,i)=>i!==idx)}}));
  };
  const weekDayTotal=(day)=>SLOTS.reduce((s,slot)=>s+week[day][slot].reduce((ss,r)=>ss+(r.macros?.cal||0),0),0);
  const clearWeek=()=>setWeek(emptyWeek());

  // ── Onboarding ──
  const finishOnboarding=()=>{
    const p={done:true,name:obName||"",goal:obGoal,calTarget:obCal};
    setProfile(p);
    setActiveGoal(obGoal);
    setDailyGoalKcal(obCal);
    setShowOnboarding(false);
  };
  const saveProfile=(p)=>{
    setProfile({...p,done:true});
    setActiveGoal(p.goal);
    setDailyGoalKcal(p.calTarget);
    setShowProfile(false);
  };

  const gc=GOALS[activeGoal];

  // ── RENDER DETAIL ──────────────────────────────────────────────────────────
  function renderDetailContent(){
    if(!selected)return null;
    return(<div style={{animation:swipeAnim?`${swipeAnim==="left"?"slideFromRight":"slideFromLeft"} 0.28s ease`:"none"}}>
      {activeTab==="recette"&&<>
        {adjMacros&&(
          <div style={{background:"#faf7f4",borderRadius:16,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-around",textAlign:"center"}}>
            {[["Cal",adjMacros.cal,"kcal",ROSE],["Prot",adjMacros.p,"g","#d4826a"],["Gluc",adjMacros.c,"g","#7a9e87"],["Lip",adjMacros.f,"g","#b08a6e"]].map(([l,v,u,c])=>(
              <div key={l}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:9,color:"#ccc",textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div></div>
            ))}
          </div>
        )}
        {/* Tags */}
        {(()=>{const tags=getTags(selected);return tags.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>{tags.map(t=><span key={t} style={{fontSize:10,background:"#f0ebe4",color:"#8a7060",borderRadius:99,padding:"3px 10px",fontWeight:600}}>{t}</span>)}</div>})()}
        {/* Boutons actions */}
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <button onClick={(e)=>addToDay(selected,e)}
            style={{flex:1,padding:"9px 6px",background:dailyRecipes.find(r=>r.addedAt&&r.id===selected.id)?"#e8f4ea":"#faf7f4",border:"1px solid #e8e2db",borderRadius:12,fontSize:10,fontWeight:700,color:"#5a8a5a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            📅 Ajouter au jour
          </button>
          <button onClick={(e)=>{e.stopPropagation();setShowWeekPicker(true);}}
            style={{flex:1,padding:"9px 6px",background:"#f5f0f8",border:"1px solid #e0d8e8",borderRadius:12,fontSize:10,fontWeight:700,color:"#8060a0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            📆 Semainier
          </button>
          <button onClick={(e)=>addToCart(selected,e)}
            style={{flex:1,padding:"9px 6px",background:cart.find(x=>x.id===selected.id)?"#fdf3e8":"#faf7f4",border:"1px solid #e8e2db",borderRadius:12,fontSize:10,fontWeight:700,color:ROSE,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            🛒 Courses
          </button>
        </div>
        {/* Sliders */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700}}>Ajuste les quantités</div>
            {customized&&<button onClick={()=>{const m=computeMacros(selected.ingredients);setSliders({p:Math.round(m.p),c:Math.round(m.c),f:Math.round(m.f)});setCustomized(false);}} style={{fontSize:10,color:ROSE,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>↺ Reset</button>}
          </div>
          {adjInfo&&<>
            <Slider label="Protéines" unit="g" value={sliders.p} min={sliderRanges.p.min} max={Math.max(sliderRanges.p.min+1,sliderRanges.p.max)} onChange={v=>setSlider("p",v)} color="#d4826a" disabled={!adjInfo.hasProtein}/>
            <Slider label="Glucides"  unit="g" value={sliders.c} min={sliderRanges.c.min} max={Math.max(sliderRanges.c.min+1,sliderRanges.c.max)} onChange={v=>setSlider("c",v)} color="#7a9e87" disabled={!adjInfo.hasCarb}/>
            <Slider label="Lipides"   unit="g" value={sliders.f} min={sliderRanges.f.min} max={Math.max(sliderRanges.f.min+1,sliderRanges.f.max)} onChange={v=>setSlider("f",v)} color="#b08a6e" disabled={!adjInfo.hasFat}/>
          </>}
        </div>
        {/* Ingrédients */}
        {adjIngredients&&<div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,marginBottom:10}}>
            Ingrédients {customized&&<span style={{fontSize:10,color:ROSE,fontFamily:"'Jost',sans-serif",fontWeight:500}}>· ajustés</span>}
          </div>
          {Object.entries(adjIngredients).map(([key,grams])=>{
            const food=FOODS[key];if(!food)return null;const s=grams/100;
            return(
              <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f5f0ea"}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontSize:17}}>{food.emoji}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:DARK}}>{food.name}</div>
                    <div style={{fontSize:10,color:"#ccc",marginTop:1}}>{Math.round(food.cal*s)} kcal · P:{Math.round(food.p*s)}g G:{Math.round(food.c*s)}g L:{Math.round(food.f*s)}g</div>
                  </div>
                </div>
                <div style={{background:ROSE_L,color:"#8a6040",fontWeight:800,fontSize:13,borderRadius:10,padding:"3px 11px",fontFamily:"'Cormorant Garamond',serif",flexShrink:0,marginLeft:8}}>{grams}g</div>
              </div>
            );
          })}
        </div>}
      </>}

      {activeTab==="etapes"&&<div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,marginBottom:6}}>Préparation</div>
        <p style={{fontSize:11,color:"#bbb",marginBottom:18,lineHeight:1.55}}>{selected.desc}</p>
        {(selected.steps||[]).map((step,i)=>(
          <div key={i} style={{display:"flex",gap:11,marginBottom:13}}>
            <div style={{width:25,height:25,borderRadius:"50%",background:DARK,color:ROSE,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</div>
            <div style={{background:"#faf7f4",borderRadius:12,padding:"10px 13px",flex:1,fontSize:12,color:"#444",lineHeight:1.6}}>{step}</div>
          </div>
        ))}
        <div style={{marginTop:16,background:"#fdf8f3",borderRadius:13,padding:"13px 15px",border:`1px solid ${ROSE}22`}}>
          <div style={{fontSize:10,fontWeight:700,color:ROSE,marginBottom:4}}>💡 Conseil</div>
          <div style={{fontSize:11,color:"#aaa",lineHeight:1.6}}>{selected.goal==="seche"?"Peser les ingrédients pour rester dans ton déficit. Chaque gramme compte !":selected.goal==="muscle"?"Ne pas rogner sur les portions — le surplus est indispensable.":"Écoute tes sensations de faim et satiété."}</div>
        </div>
      </div>}

      {activeTab==="micros"&&adjMicros&&<div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,marginBottom:6}}>Micronutriments</div>
        <p style={{fontSize:11,color:"#bbb",marginBottom:16,lineHeight:1.5}}>Apports pour cette recette · % AJR femme active.</p>
        {Object.entries(MICRO_INFO).map(([key,info])=>{
          const val=adjMicros[key];const pct=Math.min(100,Math.round((val/info.rdi)*100));
          const isGreat=pct>=50;const isGood=pct>=20;
          return(
            <div key={key} style={{marginBottom:12,padding:"11px 13px",background:"#faf7f4",borderRadius:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:15}}>{info.icon}</span>
                  <div><div style={{fontSize:12,fontWeight:700,color:DARK}}>{info.label}</div><div style={{fontSize:9,color:"#bbb"}}>AJR : {info.rdi}{info.unit}</div></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:isGreat?"#6b9e72":isGood?info.color:"#ccc"}}>{val}{info.unit}</div>
                  <div style={{fontSize:9,color:isGreat?"#6b9e72":isGood?info.color:"#ccc",fontWeight:700}}>{pct}%</div>
                </div>
              </div>
              <div style={{height:4,background:"#ede7e0",borderRadius:999}}><div style={{height:"100%",width:`${pct}%`,background:isGreat?"#6b9e72":isGood?info.color:"#e8e2db",borderRadius:999}}/></div>
            </div>
          );
        })}
      </div>}
    </div>);
  }

  function SheetHeader(){
    return(
      <div onTouchStart={onSheetTouchStart} onTouchEnd={onSheetTouchEnd}
        style={{background:DARK,padding:isMobile?"13px 18px":"20px 24px",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1}}>
            <span style={{fontSize:isMobile?24:28,flexShrink:0}}>{selected?.emoji}</span>
            <div>
              <div style={{fontSize:9,color:ROSE,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:2}}>{GOALS[selected?.goal]?.label} · {selected?.meal}</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:isMobile?15:18,fontWeight:700,color:"#fff",lineHeight:1.2}}>{selected?.name}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0,marginLeft:8}}>
            <button onClick={(e)=>toggleFav(selected?.id,e)} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {favorites.includes(selected?.id)?"❤️":"🤍"}
            </button>
            <button onClick={()=>{setShowDetail(false);setSelected(null);}} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#888",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          {[["recette","📊 Recette"],["etapes","👨‍🍳 Prépa"],["micros","🔬 Micros"]].map(([tab,label])=>(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              style={{flex:1,padding:"7px 4px",border:`1px solid ${activeTab===tab?ROSE:"rgba(255,255,255,0.1)"}`,borderRadius:9,background:activeTab===tab?ROSE+"22":"transparent",color:activeTab===tab?ROSE:"#666",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.15s"}}>
              {label}
            </button>
          ))}
        </div>
        {isMobile&&<div style={{textAlign:"center",marginTop:7,fontSize:8,color:"#333",letterSpacing:"0.12em"}}>↓ GLISSER POUR FERMER &nbsp;·&nbsp; ← → NAVIGUER</div>}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:"#f9f6f2",fontFamily:"'Jost',sans-serif",color:DARK}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e0d4c8;border-radius:99px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes slideFromRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideFromLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeInScale{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:DARK,padding:"11px 18px",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 20px rgba(0,0,0,0.3)"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${ROSE},#e8c4a0)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:DARK,fontWeight:800,fontSize:10,fontFamily:"'Cormorant Garamond',serif"}}>FW</span>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:"#fff",letterSpacing:"0.1em",textTransform:"uppercase",whiteSpace:"nowrap"}}>Fitwomen</div>
              {profile.name&&<div style={{fontSize:8,color:"#555",letterSpacing:"0.1em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Bonjour {profile.name} 👋</div>}
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
            {/* Semainier */}
            <button onClick={()=>setShowWeek(true)}
              style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
              📆
            </button>
            {/* Budget */}
            <button onClick={()=>setShowDailyPanel(true)}
              style={{display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(255,255,255,0.06)",border:`1px solid ${dailyPct>90?"#e8a0a0":dailyPct>0?"#a0c8a0":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"4px 9px",cursor:"pointer",minWidth:58}}>
              <div style={{fontSize:10,fontWeight:700,color:dailyPct>90?"#e88080":dailyPct>0?"#90c090":"#666",lineHeight:1}}>{dailyCal}</div>
              <div style={{width:42,height:3,background:"#333",borderRadius:99,margin:"3px 0",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${dailyPct}%`,background:dailyPct>90?"#e88080":"#90c090",borderRadius:99}}/>
              </div>
              <div style={{fontSize:8,color:"#444",lineHeight:1}}>{remaining>0?`-${remaining}`:"✓"} kcal</div>
            </button>
            {/* Panier */}
            <button onClick={()=>setShowCart(true)}
              style={{position:"relative",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
              🛒
              {cart.length>0&&<div style={{position:"absolute",top:-4,right:-4,width:15,height:15,borderRadius:"50%",background:ROSE,color:"#fff",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{cart.length}</div>}
            </button>
            {/* Profil */}
            <button onClick={()=>setShowProfile(true)}
              style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${ROSE}44`,borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
              👤
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1300,margin:"0 auto",padding:"0 14px"}}>
        {/* ── GOAL TABS ── */}
        <div style={{display:"flex",gap:8,padding:"14px 0 10px"}}>
          {Object.entries(GOALS).map(([key,cfg])=>(
            <button key={key} onClick={()=>{setActiveGoal(key);setSelected(null);setShowDetail(false);setPage(1);setActiveMeal("Tous");setShowFavsOnly(false);setActiveTagFilter(null);setSortBy("default");}}
              style={{flex:1,padding:"10px 6px",border:"1.5px solid",borderColor:activeGoal===key?ROSE:"#e8e2db",borderRadius:14,background:activeGoal===key?DARK:"#fff",color:activeGoal===key?"#fff":"#aaa",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.2s",textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:2}}>{cfg.emoji}</div>
              <div style={{textTransform:"uppercase",fontWeight:700,fontSize:9}}>{cfg.label}</div>
            </button>
          ))}
        </div>

        {/* ── FILTRES ── */}
        <div style={{marginBottom:14}}>
          {/* Barre de recherche */}
          <div style={{marginBottom:8}}>
            <input placeholder="🔍 Rechercher une recette..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
              style={{width:"100%",padding:"9px 16px",border:"1px solid #e8e2db",borderRadius:99,fontSize:12,outline:"none",color:DARK,background:"#fff",fontFamily:"'Jost',sans-serif"}}/>
          </div>
          {/* Filtres repas */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
            {MEALS.map(m=>{
              const count=m==="Tous"?ALL_RECIPES.filter(r=>r.goal===activeGoal).length:(mealCounts[m]||0);
              return(
                <button key={m} onClick={()=>{setActiveMeal(m);setPage(1);setShowFavsOnly(false);}}
                  style={{padding:"5px 11px",border:"1px solid",borderColor:activeMeal===m&&!showFavsOnly?ROSE:"#e8e2db",borderRadius:99,background:activeMeal===m&&!showFavsOnly?ROSE_L:"#fff",color:activeMeal===m&&!showFavsOnly?"#8a6040":"#bbb",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                  {m} <span style={{opacity:0.55}}>({count})</span>
                </button>
              );
            })}
            <button onClick={()=>{setShowFavsOnly(f=>!f);setPage(1);}}
              style={{padding:"5px 11px",border:"1px solid",borderColor:showFavsOnly?ROSE:"#e8e2db",borderRadius:99,background:showFavsOnly?ROSE_L:"#fff",color:showFavsOnly?"#8a6040":"#bbb",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              ❤️ Favoris{favorites.length>0?` (${favorites.length})`:""}
            </button>
          </div>
          {/* Tags + Tri */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
            {ALL_TAGS.map(tag=>(
              <button key={tag} onClick={()=>{setActiveTagFilter(t=>t===tag?null:tag);setPage(1);}}
                style={{padding:"4px 10px",border:"1px solid",borderColor:activeTagFilter===tag?"#8060a0":"#e8e2db",borderRadius:99,background:activeTagFilter===tag?"#f5f0f8":"#fff",color:activeTagFilter===tag?"#8060a0":"#ccc",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                {tag}
              </button>
            ))}
            {/* Tri */}
            <div style={{marginLeft:"auto",position:"relative"}}>
              <button onClick={()=>setShowSortPanel(s=>!s)}
                style={{padding:"4px 11px",border:`1px solid ${sortBy!=="default"?ROSE:"#e8e2db"}`,borderRadius:99,background:sortBy!=="default"?ROSE_L:"#fff",color:sortBy!=="default"?"#8a6040":"#bbb",fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>
                ↕ Trier
              </button>
              {showSortPanel&&(
                <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"#fff",border:"1px solid #e8e2db",borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,0.1)",zIndex:100,minWidth:170,overflow:"hidden",animation:"fadeInScale 0.15s ease"}}>
                  {[["default","Par défaut"],["cal_asc","Calories ↑"],["cal_desc","Calories ↓"],["prot_desc","Protéines ↓"]].map(([v,l])=>(
                    <button key={v} onClick={()=>{setSortBy(v);setShowSortPanel(false);}}
                      style={{display:"block",width:"100%",textAlign:"left",padding:"10px 16px",border:"none",background:sortBy===v?ROSE_L:"#fff",color:sortBy===v?"#8a6040":DARK,fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:sortBy===v?700:400,cursor:"pointer",borderBottom:"1px solid #f5f0ea"}}>
                      {sortBy===v?"✓ ":""}{l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Indicateur filtres actifs */}
          {(sortBy!=="default"||activeTagFilter||showFavsOnly)&&(
            <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:9,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.08em"}}>Filtres actifs :</span>
              {activeTagFilter&&<span style={{fontSize:10,background:"#f5f0f8",color:"#8060a0",borderRadius:99,padding:"2px 9px",fontWeight:600}}>{activeTagFilter} ✕</span>}
              {showFavsOnly&&<span style={{fontSize:10,background:ROSE_L,color:"#8a6040",borderRadius:99,padding:"2px 9px",fontWeight:600}}>Favoris ✕</span>}
              {sortBy!=="default"&&<span style={{fontSize:10,background:"#f0f4f8",color:"#607090",borderRadius:99,padding:"2px 9px",fontWeight:600}}>{sortBy==="cal_asc"?"Cal ↑":sortBy==="cal_desc"?"Cal ↓":"Prot ↓"} ✕</span>}
              <button onClick={()=>{setSortBy("default");setActiveTagFilter(null);setShowFavsOnly(false);}} style={{fontSize:10,color:"#ccc",background:"none",border:"none",cursor:"pointer",fontWeight:600,marginLeft:2}}>Tout effacer</button>
            </div>
          )}
        </div>

        {/* ── GRILLE RECETTES + PANEL DESKTOP ── */}
        <div style={{display:"grid",gridTemplateColumns:(!isMobile&&showDetail)?"1fr 450px":"1fr",gap:22,alignItems:"start"}}>
          <div ref={listRef}>
            <div style={{display:"grid",gridTemplateColumns:(!isMobile&&showDetail)?"1fr":"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
              {paginated.map((r,i)=>{
                const m=computeMacros(r.ingredients);const isSel=selected?.id===r.id;const gc2=GOALS[r.goal];const isFav=favorites.includes(r.id);
                const tags=getTags(r);
                return(
                  <div key={r.id} onClick={()=>selectRecipe(r)}
                    style={{background:isSel?"#fff":"#faf7f4",border:`1.5px solid ${isSel?ROSE:"#ece6df"}`,borderRadius:18,padding:"16px 18px",cursor:"pointer",transition:"all 0.18s",boxShadow:isSel?"0 6px 28px rgba(201,168,130,0.22)":"0 1px 4px rgba(0,0,0,0.04)",animation:`fadeIn 0.3s ease ${(i%20)*0.02}s both`,position:"relative"}}>
                    <button onClick={(e)=>toggleFav(r.id,e)}
                      style={{position:"absolute",top:11,right:11,background:"none",border:"none",cursor:"pointer",fontSize:15,padding:4,zIndex:2,lineHeight:1}}>
                      {isFav?"❤️":"🤍"}
                    </button>
                    <div style={{paddingRight:26}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                        <span style={{fontSize:17}}>{r.emoji}</span>
                        <span style={{fontSize:9,fontWeight:700,color:gc2.color,background:gc2.color+"18",borderRadius:20,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{r.meal}</span>
                        {tags.slice(0,1).map(t=><span key={t} style={{fontSize:8,color:"#aaa",background:"#f0ebe4",borderRadius:99,padding:"1px 7px",fontWeight:600}}>{t}</span>)}
                      </div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:DARK,lineHeight:1.25,marginBottom:5}}>{r.name}</div>
                    </div>
                    <div style={{display:"flex",gap:10,paddingTop:9,marginTop:6,borderTop:"1px solid #f0ebe4",alignItems:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:ROSE}}>{m.cal}<span style={{fontSize:9,color:"#ccc",fontWeight:400,marginLeft:1}}>kcal</span></div>
                      {[["P",m.p,"#d4826a"],["G",m.c,"#7a9e87"],["L",m.f,ROSE]].map(([l,v,c])=>(
                        <span key={l} style={{fontSize:10,color:c,fontWeight:700}}>{l}:{v}g</span>
                      ))}
                      <span style={{marginLeft:"auto",fontSize:9,color:isSel?ROSE:"#ddd",fontWeight:700}}>{isSel?"✦":"→"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {paginated.length<filtered.length&&(
              <div style={{textAlign:"center",marginTop:22,paddingBottom:6}}>
                <button onClick={()=>setPage(p=>p+1)} style={{background:DARK,color:"#fff",border:"none",borderRadius:12,padding:"11px 30px",fontWeight:700,cursor:"pointer",fontSize:12}}>
                  ✦ Voir plus ({filtered.length-paginated.length})
                </button>
              </div>
            )}
            {filtered.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:"#ccc"}}>
              {showFavsOnly?"Aucun favori — clique sur 🤍 pour en ajouter":"Aucune recette trouvée"}
            </div>}
            <div style={{marginTop:14,padding:"10px 13px",background:"#faf7f4",borderRadius:12,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:13}}>📋</span>
              <span style={{fontSize:10,color:"#bbb"}}>Valeurs issues de la <strong style={{color:"#aaa"}}>Table Ciqual 2025</strong> (Anses)</span>
            </div>
            <div style={{height:36}}/>
          </div>
          {/* Desktop panel */}
          {!isMobile&&showDetail&&selected&&(
            <div style={{position:"sticky",top:68}}>
              <div style={{background:"#fff",border:"1.5px solid #ede8e3",borderRadius:20,overflow:"hidden",boxShadow:"0 10px 50px rgba(201,168,130,0.18)"}}>
                <SheetHeader/>
                <div style={{maxHeight:"calc(100vh - 250px)",overflowY:"auto",padding:"18px 22px"}}>
                  {renderDetailContent()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL MOBILE ── */}
      {isMobile&&showDetail&&selected&&(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div onClick={()=>{setShowDetail(false);setSelected(null);}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.42)",backdropFilter:"blur(2px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -6px 40px rgba(0,0,0,0.18)",animation:"slideUp 0.25s ease"}}>
            <div onTouchStart={onSheetTouchStart} onTouchEnd={onSheetTouchEnd} style={{padding:"10px 20px 0",display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,cursor:"grab"}}>
              <div style={{width:36,height:4,borderRadius:99,background:"#e0d8d0"}}/>
            </div>
            <SheetHeader/>
            <div style={{overflowY:"auto",padding:"16px 16px 48px",flex:1,WebkitOverflowScrolling:"touch"}}>
              {renderDetailContent()}
            </div>
          </div>
        </div>
      )}

      {/* ── PICKER SEMAINIER ── */}
      {showWeekPicker&&selected&&(
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={()=>setShowWeekPicker(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:20,padding:"20px",minWidth:280,maxWidth:340,width:"100%",animation:"fadeInScale 0.2s ease"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,marginBottom:4}}>{selected.emoji} Ajouter au semainier</div>
            <div style={{fontSize:11,color:"#bbb",marginBottom:16}}>{selected.name}</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Quel jour ?</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {DAYS.map(d=>(
                  <button key={d} onClick={()=>setWeekDay(d)}
                    style={{padding:"6px 10px",border:`1.5px solid ${weekDay===d?ROSE:"#e8e2db"}`,borderRadius:10,background:weekDay===d?ROSE_L:"#fff",color:weekDay===d?"#8a6040":"#bbb",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:10,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Quel repas ?</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {SLOTS.map(slot=>(
                  <button key={slot} onClick={()=>{addToWeek(weekDay,slot,selected);setShowWeekPicker(false);}}
                    style={{padding:"10px 14px",border:"1px solid #e8e2db",borderRadius:12,background:"#faf7f4",color:DARK,fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
                    <span>{SLOT_ICONS[slot]}</span>{slot}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={()=>setShowWeekPicker(false)} style={{width:"100%",padding:"10px",border:"none",borderRadius:12,background:"#f5f0ea",color:"#bbb",fontSize:12,fontWeight:700,cursor:"pointer"}}>Annuler</button>
          </div>
        </div>
      )}

      {/* ── SEMAINIER ── */}
      {showWeek&&(
        <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div onClick={()=>setShowWeek(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.42)",backdropFilter:"blur(2px)"}}/>
          <div style={{position:"relative",background:"#f9f6f2",borderRadius:"20px 20px 0 0",height:"90vh",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
            {/* Header semainier */}
            <div style={{background:DARK,borderRadius:"20px 20px 0 0",padding:"14px 18px",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"#fff"}}>📆 Mon Semainier</div>
                  <div style={{fontSize:10,color:ROSE,marginTop:2}}>Planifie tes repas de la semaine</div>
                </div>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <button onClick={()=>{if(window.confirm("Effacer toute la semaine ?"))clearWeek();}} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#888",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:700}}>Vider</button>
                  <button onClick={()=>setShowWeek(false)} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#888",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
              </div>
              {/* Onglets jours */}
              <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:2}}>
                {DAYS.map((d,i)=>{
                  const tot=weekDayTotal(d);
                  return(
                    <button key={d} onClick={()=>setWeekDay(d)}
                      style={{flexShrink:0,padding:"6px 10px",border:`1.5px solid ${weekDay===d?ROSE:"rgba(255,255,255,0.1)"}`,borderRadius:10,background:weekDay===d?"rgba(201,168,130,0.15)":"transparent",color:weekDay===d?ROSE:"#666",cursor:"pointer",textAlign:"center",minWidth:46}}>
                      <div style={{fontSize:10,fontWeight:700}}>{d}</div>
                      <div style={{fontSize:8,color:tot>0?(weekDay===d?ROSE:"#888"):"#444",marginTop:1}}>{tot>0?`${tot}k`:"-"}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Contenu jour sélectionné */}
            <div style={{overflowY:"auto",flex:1,padding:"14px 16px 40px"}}>
              {/* Total du jour */}
              {(()=>{
                const tot=weekDayTotal(weekDay);
                const totMacros=SLOTS.reduce((acc,slot)=>week[weekDay][slot].reduce((a,r)=>{const m=r.macros||{p:0,c:0,f:0};return{p:a.p+m.p,c:a.c+m.c,f:a.f+m.f};},acc),{p:0,c:0,f:0});
                return tot>0&&(
                  <div style={{background:"#fff",borderRadius:14,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #ede8e0",boxShadow:"0 2px 10px rgba(0,0,0,0.04)"}}>
                    <div style={{fontSize:11,color:"#aaa",fontWeight:700}}>Total {DAYLABELS[DAYS.indexOf(weekDay)]}</div>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:ROSE}}>{tot}<span style={{fontSize:9,color:"#ccc",marginLeft:1}}>kcal</span></div>
                      {[["P",Math.round(totMacros.p),"#d4826a"],["G",Math.round(totMacros.c),"#7a9e87"],["L",Math.round(totMacros.f),"#b08a6e"]].map(([l,v,c])=>(
                        <span key={l} style={{fontSize:10,color:c,fontWeight:700}}>{l}:{v}g</span>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {/* Slots */}
              {SLOTS.map(slot=>(
                <div key={slot} style={{marginBottom:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                    <span style={{fontSize:16}}>{SLOT_ICONS[slot]}</span>
                    <span style={{fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.08em"}}>{slot}</span>
                    {week[weekDay][slot].length===0&&<span style={{fontSize:10,color:"#ddd",marginLeft:4}}>— vide</span>}
                  </div>
                  {week[weekDay][slot].map((item,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",borderRadius:12,padding:"10px 12px",marginBottom:6,border:"1px solid #ede8e0",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:18}}>{item.emoji}</span>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color:DARK}}>{item.name}</div>
                          {item.macros&&<div style={{fontSize:10,color:"#bbb"}}>{item.macros.cal} kcal · P:{item.macros.p}g G:{item.macros.c}g L:{item.macros.f}g</div>}
                        </div>
                      </div>
                      <button onClick={()=>removeFromWeek(weekDay,slot,i)} style={{background:"#faf0f0",border:"none",borderRadius:8,width:26,height:26,cursor:"pointer",color:"#c88080",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    </div>
                  ))}
                  {/* Bouton ajouter dans ce slot */}
                  <button onClick={()=>{setShowWeek(false);setTimeout(()=>setShowDetail(!!selected),100);}}
                    style={{width:"100%",padding:"7px",border:"1px dashed #e0d8d0",borderRadius:12,background:"transparent",color:"#ccc",fontSize:10,fontWeight:600,cursor:"pointer",marginTop:2}}>
                    + Ajouter depuis une recette
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PANIER ── */}
      {showCart&&(
        <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div onClick={()=>setShowCart(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.42)",backdropFilter:"blur(2px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
            <div style={{padding:"12px 20px 0",display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}><div style={{width:36,height:4,borderRadius:99,background:"#e0d8d0"}}/></div>
            <div style={{background:DARK,padding:"13px 18px",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:"#fff"}}>🛒 Liste de courses</div>
                <div style={{fontSize:10,color:ROSE,marginTop:2}}>{cart.length} recette{cart.length>1?"s":""} · {shoppingList.length} ingrédient{shoppingList.length>1?"s":""}</div>
              </div>
              <div style={{display:"flex",gap:7}}>
                {cart.length>0&&<button onClick={clearCart} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#888",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:700}}>Vider</button>}
                <button onClick={()=>setShowCart(false)} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#888",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            </div>
            <div style={{overflowY:"auto",padding:"14px 18px 40px",flex:1}}>
              {cart.length===0?(
                <div style={{textAlign:"center",padding:"40px 20px",color:"#ccc"}}>
                  <div style={{fontSize:36,marginBottom:10}}>🛒</div>
                  <div style={{fontSize:14}}>Panier vide</div>
                  <div style={{fontSize:11,marginTop:5}}>Ajoute des recettes depuis le panneau détail</div>
                </div>
              ):(
                <>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Recettes sélectionnées</div>
                    {cart.map(item=>(
                      <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f5f0ea"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:17}}>{item.emoji}</span>
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:DARK}}>{item.name}</div>
                            <div style={{fontSize:10,color:"#bbb"}}>×{item.qty} portion{item.qty>1?"s":""}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:5,alignItems:"center"}}>
                          <button onClick={()=>setCart(c=>c.map(x=>x.id===item.id&&x.qty>1?{...x,qty:x.qty-1}:x))} style={{width:25,height:25,borderRadius:7,border:"1px solid #e8e2db",background:"#fff",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                          <span style={{fontSize:12,fontWeight:700,color:DARK,minWidth:14,textAlign:"center"}}>{item.qty}</span>
                          <button onClick={()=>setCart(c=>c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x))} style={{width:25,height:25,borderRadius:7,border:"1px solid #e8e2db",background:"#fff",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                          <button onClick={()=>removeFromCart(item.id)} style={{width:25,height:25,borderRadius:7,border:"none",background:"#faf0f0",cursor:"pointer",fontSize:11,color:"#c88080",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Ingrédients à acheter</div>
                    {shoppingList.map(({key,food,grams})=>{
                      const checked=checkedItems[key];
                      return(
                        <div key={key} onClick={()=>setCheckedItems(c=>({...c,[key]:!c[key]}))}
                          style={{display:"flex",alignItems:"center",gap:9,padding:"8px 0",borderBottom:"1px solid #f5f0ea",cursor:"pointer",opacity:checked?0.4:1}}>
                          <div style={{width:19,height:19,borderRadius:5,border:`2px solid ${checked?ROSE:"#e0d8d0"}`,background:checked?ROSE:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            {checked&&<span style={{color:"#fff",fontSize:10}}>✓</span>}
                          </div>
                          <span style={{fontSize:17}}>{food.emoji}</span>
                          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:DARK,textDecoration:checked?"line-through":"none"}}>{food.name}</div></div>
                          <div style={{background:ROSE_L,color:"#8a6040",fontWeight:800,fontSize:12,borderRadius:8,padding:"2px 9px",fontFamily:"'Cormorant Garamond',serif"}}>{grams}g</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── JOURNAL DU JOUR ── */}
      {showDailyPanel&&(
        <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          <div onClick={()=>setShowDailyPanel(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.42)",backdropFilter:"blur(2px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:"20px 20px 0 0",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
            <div style={{padding:"12px 20px 0",display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}><div style={{width:36,height:4,borderRadius:99,background:"#e0d8d0"}}/></div>
            <div style={{background:DARK,padding:"13px 18px",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:"#fff"}}>📅 Journal du jour</div>
                  <div style={{fontSize:10,color:ROSE,marginTop:2}}>{dailyRecipes.length} repas · {dailyCal} kcal</div>
                </div>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  {dailyRecipes.length>0&&<button onClick={()=>setDailyRecipes([])} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#888",borderRadius:8,padding:"5px 9px",cursor:"pointer",fontSize:10,fontWeight:700}}>Vider</button>}
                  <button onClick={()=>setShowDailyPanel(false)} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"#888",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"11px 13px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <div style={{fontSize:10,color:"#aaa",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>Objectif</div>
                  {editingGoal?(
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      <input type="number" value={tmpGoal} onChange={e=>setTmpGoal(+e.target.value)}
                        style={{width:65,padding:"2px 7px",borderRadius:7,border:`1px solid ${ROSE}`,fontSize:12,fontWeight:700,color:DARK,textAlign:"center",outline:"none"}}/>
                      <button onClick={()=>{setDailyGoalKcal(tmpGoal);setProfile(p=>({...p,calTarget:tmpGoal}));setEditingGoal(false);}} style={{background:ROSE,border:"none",borderRadius:7,color:"#fff",padding:"3px 9px",cursor:"pointer",fontSize:10,fontWeight:700}}>OK</button>
                    </div>
                  ):(
                    <button onClick={()=>{setTmpGoal(dailyGoalKcal);setEditingGoal(true);}} style={{background:"rgba(255,255,255,0.08)",border:"none",color:ROSE,borderRadius:7,padding:"3px 9px",cursor:"pointer",fontSize:10,fontWeight:700}}>{dailyGoalKcal} kcal ✏️</button>
                  )}
                </div>
                <div style={{height:7,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden",marginBottom:5}}>
                  <div style={{height:"100%",width:`${dailyPct}%`,background:dailyPct>100?"linear-gradient(90deg,#e88080,#c06060)":dailyPct>80?"linear-gradient(90deg,#e8c080,#c09040)":"linear-gradient(90deg,#a0d4a8,#6b9e72)",borderRadius:99,transition:"width 0.4s ease"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:700,color:dailyPct>100?"#e88080":"#90d090"}}>{dailyCal} kcal</span>
                  <span style={{fontSize:11,color:"#666"}}>{dailyPct>100?`+${dailyCal-dailyGoalKcal} dépassé`:`${remaining} restantes`}</span>
                </div>
                {dailyRecipes.length>0&&<div style={{display:"flex",gap:10,justifyContent:"center",paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                  {[["P",Math.round(dailyTotals.p),"#d4826a"],["G",Math.round(dailyTotals.c),"#7a9e87"],["L",Math.round(dailyTotals.f),"#b08a6e"]].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,color:c}}>{v}g</div>
                      <div style={{fontSize:9,color:"#666",textTransform:"uppercase"}}>{l}</div>
                    </div>
                  ))}
                </div>}
              </div>
            </div>
            <div style={{overflowY:"auto",padding:"14px 18px 40px",flex:1}}>
              {dailyRecipes.length===0?(
                <div style={{textAlign:"center",padding:"40px 20px",color:"#ccc"}}>
                  <div style={{fontSize:36,marginBottom:10}}>📅</div>
                  <div style={{fontSize:14}}>Aucun repas enregistré</div>
                  <div style={{fontSize:11,marginTop:5}}>Clique sur "Ajouter au jour" dans une recette</div>
                </div>
              ):(
                dailyRecipes.map((r,i)=>{
                  const m=r.macros||computeMacros(r.ingredients);
                  return(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f5f0ea"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <span style={{fontSize:19}}>{r.emoji}</span>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color:DARK}}>{r.name}</div>
                          <div style={{fontSize:10,color:"#bbb"}}>{m.cal} kcal · P:{m.p}g G:{m.c}g L:{m.f}g</div>
                        </div>
                      </div>
                      <button onClick={()=>removeFromDay(i)} style={{background:"#faf0f0",border:"none",borderRadius:8,width:27,height:27,cursor:"pointer",color:"#c88080",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ONBOARDING ── */}
      {showOnboarding&&(
        <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,padding:"28px 28px 40px",animation:"slideUp 0.35s ease"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${ROSE},#e8c4a0)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:800,fontSize:16,color:DARK}}>FW</span>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:DARK,marginBottom:4}}>Bienvenue ✨</div>
              <div style={{fontSize:12,color:"#bbb",lineHeight:1.6}}>Personnalise ton expérience nutrition<br/>en quelques secondes</div>
            </div>
            {obStep===0&&<>
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Ton prénom (optionnel)</div>
                <input placeholder="Ex: Sophie" value={obName} onChange={e=>setObName(e.target.value)}
                  style={{width:"100%",padding:"12px 16px",border:"1.5px solid #e8e2db",borderRadius:14,fontSize:14,outline:"none",color:DARK,fontFamily:"'Jost',sans-serif"}}/>
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Ton objectif principal</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {Object.entries(GOALS).map(([k,cfg])=>(
                    <button key={k} onClick={()=>setObGoal(k)}
                      style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",border:`1.5px solid ${obGoal===k?ROSE:"#e8e2db"}`,borderRadius:14,background:obGoal===k?ROSE_L:"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                      <span style={{fontSize:22}}>{cfg.emoji}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:obGoal===k?"#8a6040":DARK}}>{cfg.label}</div>
                        <div style={{fontSize:10,color:"#bbb",marginTop:1}}>{cfg.desc}</div>
                      </div>
                      {obGoal===k&&<div style={{marginLeft:"auto",color:ROSE,fontWeight:800,fontSize:16}}>✓</div>}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={()=>setObStep(1)}
                style={{width:"100%",padding:"14px",background:DARK,color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                Continuer →
              </button>
            </>}
            {obStep===1&&<>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Objectif calorique journalier</div>
                <div style={{fontSize:11,color:"#bbb",marginBottom:14,lineHeight:1.6}}>
                  {obGoal==="seche"?"En sèche, un déficit de 300-500 kcal est recommandé.":obGoal==="muscle"?"En prise de masse, un surplus de 200-400 kcal est idéal.":"En maintien, vise ton métabolisme total estimé."}
                </div>
                {/* Suggestions rapides */}
                <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
                  {(obGoal==="seche"?[1400,1600,1800]:obGoal==="muscle"?[2000,2200,2500]:[1700,2000,2300]).map(v=>(
                    <button key={v} onClick={()=>setObCal(v)}
                      style={{padding:"7px 14px",border:`1.5px solid ${obCal===v?ROSE:"#e8e2db"}`,borderRadius:99,background:obCal===v?ROSE_L:"#fff",color:obCal===v?"#8a6040":"#bbb",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                      {v} kcal
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <input type="number" value={obCal} min={1000} max={4000} step={50} onChange={e=>setObCal(+e.target.value)}
                    style={{flex:1,padding:"11px 14px",border:"1.5px solid #e8e2db",borderRadius:12,fontSize:16,fontWeight:700,color:DARK,textAlign:"center",outline:"none",fontFamily:"'Cormorant Garamond',serif"}}/>
                  <span style={{fontSize:12,color:"#aaa",fontWeight:600,flexShrink:0}}>kcal / jour</span>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setObStep(0)} style={{flex:"0 0 auto",padding:"13px 18px",background:"#f5f0ea",color:"#aaa",border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:"pointer"}}>← Retour</button>
                <button onClick={finishOnboarding}
                  style={{flex:1,padding:"13px",background:DARK,color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                  C'est parti ! 🚀
                </button>
              </div>
            </>}
          </div>
        </div>
      )}

      {/* ── PANNEAU PROFIL (accessible à tout moment) ── */}
      {showProfile&&(
        <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={()=>setShowProfile(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,animation:"slideUp 0.28s ease"}}>
            <div style={{padding:"12px 20px 0",display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:36,height:4,borderRadius:99,background:"#e0d8d0"}}/></div>
            {(true&&(
                <div style={{padding:"20px 24px 36px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700}}>👤 Mon profil</div>
                    <button onClick={()=>setShowProfile(false)} style={{background:"#f5f0ea",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",color:"#aaa"}}>✕</button>
                  </div>
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Prénom</div>
                    <input value={pName} onChange={e=>setPName(e.target.value)} placeholder="Ex: Sophie"
                      style={{width:"100%",padding:"11px 14px",border:"1.5px solid #e8e2db",borderRadius:12,fontSize:13,outline:"none",color:DARK,fontFamily:"'Jost',sans-serif"}}/>
                  </div>
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Objectif</div>
                    <div style={{display:"flex",gap:7}}>
                      {Object.entries(GOALS).map(([k,cfg])=>(
                        <button key={k} onClick={()=>setPGoal(k)}
                          style={{flex:1,padding:"9px 6px",border:`1.5px solid ${pGoal===k?ROSE:"#e8e2db"}`,borderRadius:12,background:pGoal===k?ROSE_L:"#fff",color:pGoal===k?"#8a6040":"#bbb",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
                          <div style={{fontSize:18,marginBottom:2}}>{cfg.emoji}</div>
                          <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{cfg.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:22}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Objectif calorique</div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <input type="number" value={pCal} onChange={e=>setPCal(+e.target.value)} min={1000} max={4000} step={50}
                        style={{flex:1,padding:"10px 14px",border:"1.5px solid #e8e2db",borderRadius:12,fontSize:16,fontWeight:700,color:DARK,textAlign:"center",outline:"none",fontFamily:"'Cormorant Garamond',serif"}}/>
                      <span style={{fontSize:12,color:"#aaa",flexShrink:0}}>kcal / jour</span>
                    </div>
                  </div>
                  <button onClick={()=>saveProfile({name:pName,goal:pGoal,calTarget:pCal,done:true})}
                    style={{width:"100%",padding:"13px",background:DARK,color:"#fff",border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    ✓ Enregistrer
                  </button>
                  <button onClick={()=>{setShowProfile(false);setShowOnboarding(true);setObStep(0);}} style={{width:"100%",marginTop:8,padding:"10px",background:"#f5f0ea",color:"#aaa",border:"none",borderRadius:14,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    Refaire l'onboarding
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Fermer le dropdown tri au clic extérieur */}
      {showSortPanel&&<div style={{position:"fixed",inset:0,zIndex:90}} onClick={()=>setShowSortPanel(false)}/>}
    </div>
  );
}
