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

// ── Formule Mifflin-St Jeor ──────────────────────────────────────────────────
const ACTIVITY_LEVELS={
  sedentary:  {label:"Sédentaire",       sub:"Bureau, peu de sport",        mult:1.2},
  light:      {label:"Légèrement actif", sub:"1-2 séances/semaine",         mult:1.375},
  moderate:   {label:"Modérément actif", sub:"3-4 séances/semaine",         mult:1.55},
  active:     {label:"Très actif",       sub:"5-6 séances/semaine",         mult:1.725},
  veryactive: {label:"Athlète",          sub:"Sport quotidien + physique",  mult:1.9},
};
function computeTDEE(age,weight,height,activity,goal){
  if(!age||!weight||!height)return null;
  // Femme : 10×poids + 6.25×taille − 5×âge − 161
  const bmr=10*weight+6.25*height-5*age-161;
  const mult=ACTIVITY_LEVELS[activity]?.mult||1.55;
  const tdee=Math.round(bmr*mult);
  // Ajustement selon objectif
  if(goal==="seche")return tdee-400;
  if(goal==="muscle")return tdee+250;
  return tdee;
}
const GOALS={
  seche:   {label:"Sèche",         emoji:"🔥",color:"#b5616e",desc:"Déficit calorique · Haute protéine"},
  maintien:{label:"Maintien",      emoji:"⚖️",color:"#9a7b5e",desc:"Macros équilibrés · Énergie stable"},
  muscle:  {label:"Prise de masse",emoji:"💪",color:"#6b8f72",desc:"Surplus calorique · Masse propre"},
};

// ─── MESSAGES DU JOUR ─────────────────────────────────────────────────────────
const DAILY_MESSAGES=[
  "La régularité bat toujours l'intensité. Une séance imparfaite vaut mieux qu'une séance parfaite jamais faite. 🔥",
  "Chaque repas est une opportunité de nourrir ton objectif. Fais des choix qui te rapprochent de là où tu veux être. 🎯",
  "Ton corps s'adapte à ce que tu lui donnes. Donne-lui de la cohérence, il te donnera des résultats. 💎",
  "L'énergie que tu mets dans ton assiette aujourd'hui se transforme en performance demain. Choisis bien. ⚡",
  "Ne cherche pas la perfection, cherche la progression. Chaque petit pas compte. 🚀",
  "Hydrate-toi, mange coloré, bouge ton corps. C'est aussi simple que ça — et aussi puissant. 🌿",
  "Les résultats ne se voient pas au jour le jour, mais au fil des semaines. Continue. 📈",
];
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
  // Haute protéine : ratio protéines/calories > 30% (en éq. calorique)
  if(m.cal>0&&(m.p*4/m.cal)>0.30)tags.push("💪 Haute protéine");
  // Léger : moins de 450 kcal
  if(m.cal<450)tags.push("⚡ Léger");
  // Rapide : 5 étapes ou moins (standard) et pas de viande à cuire longtemps
  if(!Object.keys(r.ingredients).some(k=>["boeuf","lentilles","pois_chiches","haricots","riz_complet"].includes(k)))tags.push("🕐 Rapide");
  // Végétarien : pas de viande/poisson
  if(!Object.keys(r.ingredients).some(k=>["poulet","dinde","saumon","thon","crevettes","cabillaud","boeuf"].includes(k)))tags.push("🌱 Végétarien");
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
  const [showCoaching,setShowCoaching]=useState(false);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<768);
  const [isLoading,setIsLoading]=useState(false);
  const loadingTimer=useRef(null);

  // ── Onboarding / Profil ──
  const [profile,setProfile]=useState(()=>{try{return JSON.parse(localStorage.getItem("fw_profile")||"null")||{done:false,name:"",goal:"seche",calTarget:1600};}catch{return{done:false,name:"",goal:"seche",calTarget:1600};}});
  const [showOnboarding,setShowOnboarding]=useState(()=>{try{const p=JSON.parse(localStorage.getItem("fw_profile")||"null");return!p?.done;}catch{return true;}});
  const [showProfile,setShowProfile]=useState(false);
  const [pName,setPName]=useState(profile.name||"");
  const [pGoal,setPGoal]=useState(profile.goal||"seche");
  const [pCal,setPCal]=useState(profile.calTarget||1600);
  const [pAge,setPAge]=useState(profile.age||0);
  const [pWeight,setPWeight]=useState(profile.weight||0);
  const [pHeight,setPHeight]=useState(profile.height||0);
  const [pActivity,setPActivity]=useState(profile.activity||"moderate");
  const [obStep,setObStep]=useState(0);
  const [obName,setObName]=useState("");
  const [obGoal,setObGoal]=useState("seche");
  const [obCal,setObCal]=useState(1600);
  const [obAge,setObAge]=useState(0);
  const [obWeight,setObWeight]=useState(0);
  const [obHeight,setObHeight]=useState(0);
  const [obActivity,setObActivity]=useState("moderate");
  const [obCalMode,setObCalMode]=useState("tdee"); // "tdee" | "manual" 

  // ── Favoris ──
  const [favorites,setFavorites]=useState(()=>{try{return JSON.parse(localStorage.getItem("fw_favs")||"[]");}catch{return[];}});
  const [showFavsOnly,setShowFavsOnly]=useState(false);

  // ── Tri & Tags ──
  const [sortBy,setSortBy]=useState("default");
  const [activeTagFilter,setActiveTagFilter]=useState(null);
  const [showSortPanel,setShowSortPanel]=useState(false);
  const [isListening,setIsListening]=useState(false);

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

  // ── Mode sombre ──
  const [darkMode,setDarkMode]=useState(()=>{try{return localStorage.getItem("fw_dark")==="1";}catch{return false;}});

  // ── Historique 7 jours ──
  const [dailyHistory,setDailyHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("fw_history")||"[]");}catch{return[];}});

  // ── Animations swipe ──
  const [swipeAnim,setSwipeAnim]=useState(null); // 'left'|'right'|null
  // ── Timers cuisson ──
  const [timers,setTimers]=useState({}); // {stepIdx: {total, remaining, running}}
  const timerRefs=useRef({});
  const [goalAnim,setGoalAnim]=useState(null); // direction slide entre objectifs
  const prevGoalRef=useRef(activeGoal);

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
  useEffect(()=>{localStorage.setItem("fw_dark",darkMode?"1":"0");},[darkMode]);
  useEffect(()=>{localStorage.setItem("fw_history",JSON.stringify(dailyHistory));},[dailyHistory]);

  // Sync objectif calorique avec le profil
  useEffect(()=>{if(profile.calTarget)setDailyGoalKcal(profile.calTarget);},[profile.calTarget]);
  // Sync états panneau profil quand on l'ouvre
  useEffect(()=>{if(showProfile){setPName(profile.name||"");setPGoal(profile.goal||"seche");setPCal(profile.calTarget||1600);setPAge(profile.age||0);setPWeight(profile.weight||0);setPHeight(profile.height||0);setPActivity(profile.activity||"moderate");}},[showProfile]);

  // ── Auto-reset journal + sauvegarde historique ──
  useEffect(()=>{
    const today=new Date().toISOString().slice(0,10);
    const lastDate=localStorage.getItem("fw_last_date");
    if(lastDate&&lastDate!==today){
      // Nouveau jour : sauvegarder hier dans l'historique
      const storedRecipes=JSON.parse(localStorage.getItem("fw_daily_snap")||"[]");
      if(storedRecipes.length>0){
        const tot=storedRecipes.reduce((acc,r)=>{const m=r.macros||{cal:0,p:0,c:0,f:0};return{cal:acc.cal+m.cal,p:acc.p+m.p,c:acc.c+m.c,f:acc.f+m.f};},{cal:0,p:0,c:0,f:0});
        const entry={date:lastDate,cal:Math.round(tot.cal),p:Math.round(tot.p),c:Math.round(tot.c),f:Math.round(tot.f),goal:Number(localStorage.getItem("fw_goal")||1600)};
        setDailyHistory(h=>[entry,...h].slice(0,7));
      }
      setDailyRecipes([]);
    }
    localStorage.setItem("fw_last_date",today);
  },[]);

  // Snapshot du journal pour la sauvegarde inter-sessions
  useEffect(()=>{localStorage.setItem("fw_daily_snap",JSON.stringify(dailyRecipes));},[dailyRecipes]);

  // Scroll to top on filter change
  useEffect(()=>{
    listRef.current?.scrollTo(0,0);window.scrollTo(0,0);
    setIsLoading(true);
    if(loadingTimer.current)clearTimeout(loadingTimer.current);
    loadingTimer.current=setTimeout(()=>setIsLoading(false),420);
    return()=>{if(loadingTimer.current)clearTimeout(loadingTimer.current);};
  },[activeGoal,activeMeal]);

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
    Object.values(timerRefs.current).forEach(id=>clearInterval(id));timerRefs.current={};setTimers({});
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

  // ── Recherche vocale (Web Speech API) ──────────────────
  const startVoice=useCallback(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert("Recherche vocale non supportée sur ce navigateur");return;}
    const rec=new SR();
    rec.lang="fr-FR";rec.interimResults=false;rec.maxAlternatives=1;
    rec.onstart=()=>setIsListening(true);
    rec.onend=()=>setIsListening(false);
    rec.onerror=()=>setIsListening(false);
    rec.onresult=(e)=>{
      const transcript=e.results[0][0].transcript;
      setSearch(transcript);setPage(1);
    };
    rec.start();
  },[]);

  // ── Logique timers de cuisson ──────────────────────────
  const parseStepDuration=(step)=>{
    // Cherche "X min", "X-Y min", "X à Y min"
    const m=step.match(/(\d+)(?:\s*[-àa]\s*(\d+))?\s*min/i);
    if(!m)return null;
    // Prend la valeur médiane si plage (ex: 3-4 min → 3 min 30s)
    const lo=parseInt(m[1]);
    const hi=m[2]?parseInt(m[2]):lo;
    return Math.round((lo+hi)/2)*60;
  };
  const startTimer=(idx,seconds)=>{
    if(timerRefs.current[idx])clearInterval(timerRefs.current[idx]);
    setTimers(t=>({...t,[idx]:{total:seconds,remaining:seconds,running:true}}));
    timerRefs.current[idx]=setInterval(()=>{
      setTimers(t=>{
        const cur=t[idx];
        if(!cur||!cur.running)return t;
        if(cur.remaining<=1){
          clearInterval(timerRefs.current[idx]);
          // Notification sonore simple
          try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator();const g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=880;g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.8);o.start();o.stop(ctx.currentTime+0.8);}catch(e){}
          return{...t,[idx]:{...cur,remaining:0,running:false,done:true}};
        }
        return{...t,[idx]:{...cur,remaining:cur.remaining-1}};
      });
    },1000);
  };
  const pauseTimer=(idx)=>{
    clearInterval(timerRefs.current[idx]);
    setTimers(t=>({...t,[idx]:{...t[idx],running:false}}));
  };
  const resetTimer=(idx,seconds)=>{
    clearInterval(timerRefs.current[idx]);
    setTimers(t=>({...t,[idx]:{total:seconds,remaining:seconds,running:false,done:false}}));
  };
  const fmtTime=(s)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  // ── Thème dark/light ──
  const T={
    pageBg:    darkMode?"#111113":"#f9f6f2",
    card:      darkMode?"#1c1c1e":"#fff",
    cardAlt:   darkMode?"#161618":"#faf7f4",
    cardAlt2:  darkMode?"#1a1a1c":"#faf7f4",
    border:    darkMode?"#2c2c2e":"#e8e2db",
    borderL:   darkMode?"#232325":"#f0ebe4",
    borderLL:  darkMode?"#1e1e20":"#f5f0ea",
    text:      darkMode?"#f2f2f7":DARK,
    textM:     darkMode?"#8e8e93":"#bbb",
    textF:     darkMode?"#48484a":"#ddd",
    input:     darkMode?"#2c2c2e":"#fff",
    inputBorder:darkMode?"#3a3a3c":"#e8e2db",
    tagBg:     darkMode?"#2a2a2c":"#f0ebe4",
    tagColor:  darkMode?"#a09080":"#8a7060",
    subBg:     darkMode?"rgba(255,255,255,0.04)":"#faf7f4",
    rose_l:    darkMode?"rgba(201,168,130,0.15)":ROSE_L,
    sheetBg:   darkMode?"#1a1a1c":"#fff",
    footerBg:  darkMode?"#1a1a1c":"#faf7f4",
  };

  // ── RENDER DETAIL ──────────────────────────────────────────────────────────
  function renderDetailContent(){
    if(!selected)return null;
    return(<div style={{animation:swipeAnim?`${swipeAnim==="left"?"slideFromRight":"slideFromLeft"} 0.28s ease`:"none"}}>
      {activeTab==="recette"&&<>
        {adjMacros&&(
          <div style={{background:T.cardAlt,borderRadius:16,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-around",textAlign:"center"}}>
            {[["Cal",adjMacros.cal,"kcal",ROSE],["Prot",adjMacros.p,"g","#d4826a"],["Gluc",adjMacros.c,"g","#7a9e87"],["Lip",adjMacros.f,"g","#b08a6e"]].map(([l,v,u,c])=>(
              <div key={l}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:9,color:"#ccc",textTransform:"uppercase",letterSpacing:"0.07em"}}>{l}</div></div>
            ))}
          </div>
        )}
        {/* Tags */}
        {(()=>{const tags=getTags(selected);return tags.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>{tags.map(t=><span key={t} style={{fontSize:10,background:T.tagBg,color:T.tagColor,borderRadius:99,padding:"3px 10px",fontWeight:600}}>{t}</span>)}</div>})()}
        {/* Boutons actions */}
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <button onClick={(e)=>addToDay(selected,e)}
            style={{flex:1,padding:"9px 6px",background:dailyRecipes.find(r=>r.addedAt&&r.id===selected.id)?(darkMode?"rgba(80,120,80,0.2)":"#e8f4ea"):T.cardAlt,border:`1px solid ${T.border}`,borderRadius:12,fontSize:10,fontWeight:700,color:"#5a8a5a",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            📅 Ajouter au jour
          </button>
          <button onClick={(e)=>{e.stopPropagation();setShowWeekPicker(true);}}
            style={{flex:1,padding:"9px 6px",background:darkMode?"rgba(100,70,140,0.15)":"#f5f0f8",border:darkMode?"1px solid rgba(100,70,140,0.3)":"1px solid #e0d8e8",borderRadius:12,fontSize:10,fontWeight:700,color:"#8060a0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            📆 Semainier
          </button>
          <button onClick={(e)=>addToCart(selected,e)}
            style={{flex:1,padding:"9px 6px",background:cart.find(x=>x.id===selected.id)?(darkMode?"rgba(180,130,80,0.15)":"#fdf3e8"):T.cardAlt,border:`1px solid ${T.border}`,borderRadius:12,fontSize:10,fontWeight:700,color:ROSE,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
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
              <div key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.borderLL}`}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontSize:17}}>{food.emoji}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{food.name}</div>
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
        {(selected.steps||[]).map((step,i)=>{
          const dur=parseStepDuration(step);
          const timer=timers[i];
          const isDone=timer?.done;
          const isRunning=timer?.running;
          const rem=timer?.remaining??dur;
          const pct=dur&&timer?Math.round((1-timer.remaining/timer.total)*100):0;
          return(
            <div key={i} style={{display:"flex",gap:11,marginBottom:13}}>
              <div style={{width:25,height:25,borderRadius:"50%",background:isDone?"#6b9e72":DARK,color:isDone?"#fff":ROSE,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontWeight:700,flexShrink:0,marginTop:2,transition:"background 0.3s"}}>
                {isDone?"✓":i+1}
              </div>
              <div style={{background:T.cardAlt,borderRadius:12,padding:"10px 13px",flex:1,border:`1px solid ${isDone?"#6b9e7244":T.borderL}`}}>
                <div style={{fontSize:12,color:T.text,lineHeight:1.6,marginBottom:dur?8:0}}>{step}</div>
                {dur&&(
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    {/* Barre de progression */}
                    {timer&&<div style={{flex:1,minWidth:60,height:3,background:T.border,borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:isDone?"#6b9e72":ROSE,borderRadius:99,transition:"width 1s linear"}}/>
                    </div>}
                    {/* Affichage temps */}
                    <span style={{fontSize:11,fontWeight:800,color:isDone?"#6b9e72":isRunning?ROSE:T.textM,fontFamily:"'Cormorant Garamond',serif",minWidth:32}}>
                      {timer?fmtTime(rem):fmtTime(dur)}
                    </span>
                    {/* Boutons */}
                    {!timer&&<button onClick={()=>startTimer(i,dur)}
                      style={{padding:"3px 10px",background:ROSE,border:"none",borderRadius:99,color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                      ⏱ Lancer
                    </button>}
                    {timer&&!isDone&&<>
                      <button onClick={()=>isRunning?pauseTimer(i):startTimer(i,timer.remaining)}
                        style={{width:26,height:26,borderRadius:"50%",background:isRunning?T.cardAlt:ROSE,border:`1px solid ${isRunning?T.border:ROSE}`,color:isRunning?T.textM:"#fff",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {isRunning?"⏸":"▶"}
                      </button>
                      <button onClick={()=>resetTimer(i,dur)}
                        style={{width:26,height:26,borderRadius:"50%",background:"transparent",border:`1px solid ${T.border}`,color:T.textM,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        ↺
                      </button>
                    </>}
                    {isDone&&<span style={{fontSize:10,color:"#6b9e72",fontWeight:700}}>✓ Terminé !</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div style={{marginTop:16,background:T.cardAlt,borderRadius:13,padding:"13px 15px",border:`1px solid ${ROSE}22`}}>
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
            <div key={key} style={{marginBottom:12,padding:"11px 13px",background:T.cardAlt,borderRadius:12}}>
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
        {isMobile&&<div style={{textAlign:"center",marginTop:8,fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:"0.14em",fontWeight:500}}>↓ GLISSER POUR FERMER &nbsp;·&nbsp; ← → NAVIGUER</div>}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:T.pageBg,fontFamily:"'Jost',sans-serif",color:DARK}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e0d4c8;border-radius:99px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes slideFromRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideFromLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeInScale{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,130,0.5)}50%{box-shadow:0 0 0 8px rgba(201,168,130,0)}}
        @media(max-width:400px){.budget-label{display:none!important}.budget-bar-wrap{width:48px!important}}
        @media(max-width:767px){.header-icon-hide{display:none!important}}
        @media(max-width:767px){.desktop-only{display:none!important}}
        @media(min-width:768px){.mobile-only{display:none!important}}
        button{-webkit-tap-highlight-color:transparent}
        button:active{opacity:0.82;transform:scale(0.97)}
        .skeleton{background:linear-gradient(90deg,#f0ebe4 25%,#faf6f1 50%,#f0ebe4 75%);background-size:400px 100%;animation:shimmer 1.4s infinite linear;border-radius:10px}
        *{transition:background-color 0.2s ease,border-color 0.2s ease,color 0.15s ease}
        button,input{transition:background-color 0.2s ease,border-color 0.2s ease,color 0.15s ease,transform 0.15s ease,opacity 0.15s ease}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:DARK,padding:"14px 20px",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 24px rgba(0,0,0,0.4)",borderBottom:"1px solid rgba(255,255,255,0.06)",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",backgroundRepeat:"repeat"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          {/* Logo + titre */}
          <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <div style={{width:44,height:44,borderRadius:8,overflow:"hidden",flexShrink:0,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <img src="data:image/png;base64,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" alt="FitWomen" style={{width:40,height:40,objectFit:"contain"}}/>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"#fff",letterSpacing:"0.12em",textTransform:"uppercase",lineHeight:1}}>Fitwomen</div>
              {profile.name
                ? <div style={{fontSize:11,color:ROSE,letterSpacing:"0.04em",marginTop:2,fontWeight:600,lineHeight:1.2}}>Bonjour {profile.name} 👋 <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",marginLeft:6}}>by Coach Antoine</span></div>
                : <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",letterSpacing:"0.14em",marginTop:2,textTransform:"uppercase"}}>by Coach Antoine</div>
              }
            </div>
          </div>

          {/* ── GOAL TABS HEADER (desktop only) ── */}
          <div className="desktop-only" style={{display:"flex",gap:6,flex:1,justifyContent:"flex-start"}}>
            {Object.entries(GOALS).map(([key,cfg])=>(
              <button key={key} onClick={()=>{
                  const order=["seche","maintien","muscle"];
                  const prev=prevGoalRef.current;
                  const fromIdx=order.indexOf(prev);
                  const toIdx=order.indexOf(key);
                  if(fromIdx!==toIdx){const dir=toIdx>fromIdx?"left":"right";setGoalAnim(dir);setTimeout(()=>setGoalAnim(null),350);}
                  prevGoalRef.current=key;
                  setActiveGoal(key);setShowCoaching(false);setSelected(null);setShowDetail(false);setPage(1);setActiveMeal("Tous");setShowFavsOnly(false);setActiveTagFilter(null);setSortBy("default");
                }}
                style={{
                  display:"flex",alignItems:"center",gap:7,
                  padding:"7px 14px",
                  border:`1.5px solid ${activeGoal===key?cfg.color:cfg.color+"44"}`,
                  borderRadius:99,
                  background:activeGoal===key?cfg.color+"22":"rgba(255,255,255,0.04)",
                  color:activeGoal===key?cfg.color:"rgba(255,255,255,0.45)",
                  fontFamily:"'Jost',sans-serif",fontWeight:700,fontSize:12,
                  cursor:"pointer",
                  transition:"all 0.2s",
                  whiteSpace:"nowrap",
                  boxShadow:activeGoal===key?`0 2px 12px ${cfg.color}44`:"none",
                }}>
                <span style={{fontSize:16,lineHeight:1}}>{cfg.emoji}</span>
                <span style={{letterSpacing:"0.04em"}}>{cfg.label}</span>
                {activeGoal===key&&<span style={{width:6,height:6,borderRadius:"50%",background:cfg.color,flexShrink:0,boxShadow:`0 0 6px ${cfg.color}`}}/>}
              </button>
            ))}
          </div>

          {/* Actions — version mobile compacte / desktop complète */}
          <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
            {/* Semainier - masqué mobile (bottom nav) */}
            <button onClick={()=>setShowWeek(true)} title="Semainier" className="header-icon-hide"
              style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:11,width:40,height:40,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              📆
            </button>
            {/* Budget journalier */}
            <button onClick={()=>setShowDailyPanel(true)} title="Journal du jour"
              style={{display:"flex",alignItems:"center",gap:9,background:dailyPct>90?"rgba(240,128,128,0.18)":dailyPct>0?"rgba(128,208,128,0.14)":"rgba(255,255,255,0.07)",border:`1.5px solid ${dailyPct>90?"rgba(240,128,128,0.55)":dailyPct>0?"rgba(128,208,128,0.45)":"rgba(255,255,255,0.14)"}`,borderRadius:11,padding:"7px 13px",cursor:"pointer",flexShrink:0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:4}}>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                  <span style={{fontSize:15,fontWeight:800,color:dailyPct>90?"#f08080":dailyPct>0?"#90d090":"#fff",fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{dailyCal}</span>
                  <span style={{fontSize:10,fontWeight:600,color:dailyPct>90?"#f08080":dailyPct>0?"#90d090":"rgba(255,255,255,0.5)",lineHeight:1}}>/ {dailyGoalKcal}</span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",lineHeight:1}}>kcal</span>
                </div>
                <div style={{width:72,height:4,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}} className="budget-bar-wrap">
                  <div style={{height:"100%",width:`${dailyPct}%`,background:dailyPct>90?"#f08080":dailyPct>60?"#e8d070":"#80d080",borderRadius:99,transition:"width 0.4s"}}/>
                </div>
                <span className="budget-label" style={{fontSize:9,fontWeight:600,color:dailyPct>90?"#f08080":remaining>0?"#80c880":"#80d080",lineHeight:1,whiteSpace:"nowrap"}}>
                  {dailyPct>100?`⚠ +${dailyCal-dailyGoalKcal} kcal`:remaining>0?`${remaining} restantes`:"✓ Atteint"}
                </span>
              </div>
            </button>
            {/* Panier - masqué mobile (bottom nav) */}
            <button onClick={()=>setShowCart(true)} title="Liste de courses" className="header-icon-hide"
              style={{position:"relative",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:11,width:40,height:40,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              🛒
              {cart.length>0&&<div style={{position:"absolute",top:-5,right:-5,width:17,height:17,borderRadius:"50%",background:ROSE,color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}>{cart.length}</div>}
            </button>
            {/* Profil - masqué mobile (bottom nav) */}
            <button onClick={()=>setShowProfile(true)} title="Mon profil" className="header-icon-hide"
              style={{background:"rgba(255,255,255,0.08)",border:`1.5px solid ${ROSE}66`,borderRadius:11,width:40,height:40,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              👤
            </button>
            {/* Coaching - masqué mobile (bottom nav) */}
            <button onClick={()=>{setShowWeek(false);setShowCart(false);setShowDailyPanel(false);setShowProfile(false);setShowCoaching(true);}} title="Mon Coach" className="header-icon-hide"
              style={{background:showCoaching?ROSE+"33":"rgba(255,255,255,0.08)",border:`1.5px solid ${showCoaching?ROSE:ROSE+"44"}`,borderRadius:11,width:40,height:40,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              🏋️
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1300,margin:"0 auto",padding:"0 14px"}}>
        {/* ── MESSAGE DU JOUR ── */}
        {(()=>{
          const msg=DAILY_MESSAGES[Math.floor(Date.now()/86400000)%DAILY_MESSAGES.length];
          return(
            <div style={{background:darkMode?"rgba(201,168,130,0.08)":"rgba(201,168,130,0.12)",border:`1px solid ${ROSE}33`,borderRadius:14,padding:"12px 16px",margin:"12px 0 4px",display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:16,flexShrink:0,marginTop:1}}>💬</span>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:ROSE,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Message du jour</div>
                <div style={{fontSize:12,color:T.text,lineHeight:1.55,fontStyle:"italic"}}>{msg}</div>
                <div style={{fontSize:10,color:T.textM,marginTop:4,textAlign:"right",fontWeight:600}}>— Antoine</div>
              </div>
            </div>
          );
        })()}

        {/* ── GOAL TABS (mobile only) ── */}
        <div className="mobile-only" style={{display:"flex",gap:10,padding:"14px 0 0"}}>
          {Object.entries(GOALS).map(([key,cfg])=>(
            <button key={key} onClick={()=>{
                const order=["seche","maintien","muscle"];
                const prev=prevGoalRef.current;
                const fromIdx=order.indexOf(prev);
                const toIdx=order.indexOf(key);
                if(fromIdx!==toIdx){
                  const dir=toIdx>fromIdx?"left":"right";
                  setGoalAnim(dir);
                  setTimeout(()=>setGoalAnim(null),350);
                }
                prevGoalRef.current=key;
                setActiveGoal(key);setSelected(null);setShowDetail(false);setPage(1);setActiveMeal("Tous");setShowFavsOnly(false);setActiveTagFilter(null);setSortBy("default");
              }}
              style={{
                flex:1,
                padding:"16px 8px 14px",
                border:`2px solid ${activeGoal===key?cfg.color:cfg.color+"28"}`,
                borderRadius:18,
                background:activeGoal===key
                  ?`linear-gradient(135deg,${cfg.color}22,${cfg.color}10)`
                  :darkMode?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.7)",
                color:activeGoal===key?cfg.color:T.textM,
                fontFamily:"'Jost',sans-serif",fontWeight:600,
                cursor:"pointer",
                transition:"all 0.22s",
                textAlign:"center",
                boxShadow:activeGoal===key?`0 6px 24px ${cfg.color}30`:"none",
                position:"relative",
                overflow:"hidden",
              }}>
              {activeGoal===key&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${cfg.color}00,${cfg.color},${cfg.color}00)`,borderRadius:"18px 18px 0 0"}}/>}
              <div style={{fontSize:26,marginBottom:6,lineHeight:1}}>{cfg.emoji}</div>
              <div style={{fontWeight:800,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:3}}>{cfg.label}</div>
              <div style={{fontSize:9,color:activeGoal===key?cfg.color+"bb":T.textM,lineHeight:1.3,opacity:0.8}}>{cfg.desc}</div>
            </button>
          ))}
        </div>


        {/* ── FILTRES ── */}
        <div style={{marginBottom:14}}>
          {/* Barre de recherche */}
          <div style={{marginBottom:8}}>
            <div style={{position:"relative",display:"flex",alignItems:"center"}}>
              <input placeholder="🔍 Rechercher une recette..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
                style={{width:"100%",padding:"9px 44px 9px 16px",border:`1px solid ${T.inputBorder}`,borderRadius:99,fontSize:12,outline:"none",color:T.text,background:T.input,fontFamily:"'Jost',sans-serif"}}/>
              <button onClick={startVoice} title="Recherche vocale"
                style={{position:"absolute",right:6,width:32,height:32,borderRadius:"50%",border:"none",background:isListening?ROSE:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"all 0.2s",animation:isListening?"pulse 1s infinite":"none"}}>
                🎙️
              </button>
            </div>
          </div>
          {/* Filtres repas */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
            {MEALS.map(m=>{
              const count=m==="Tous"?ALL_RECIPES.filter(r=>r.goal===activeGoal).length:(mealCounts[m]||0);
              return(
                <button key={m} onClick={()=>{setActiveMeal(m);setPage(1);setShowFavsOnly(false);}}
                  style={{padding:"5px 11px",border:"1px solid",borderColor:activeMeal===m&&!showFavsOnly?ROSE:"#e8e2db",borderRadius:99,background:activeMeal===m&&!showFavsOnly?T.rose_l:T.card,color:activeMeal===m&&!showFavsOnly?"#8a6040":T.textM,fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                  {m} <span style={{opacity:0.55}}>({count})</span>
                </button>
              );
            })}
            <button onClick={()=>{setShowFavsOnly(f=>!f);setPage(1);}}
              style={{padding:"5px 11px",border:"1px solid",borderColor:showFavsOnly?ROSE:"#e8e2db",borderRadius:99,background:showFavsOnly?T.rose_l:T.card,color:showFavsOnly?"#8a6040":T.textM,fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              ❤️ Favoris{favorites.length>0?` (${favorites.length})`:""}
            </button>
          </div>
          {/* Tags + Tri — séparés pour mobile */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginBottom:6}}>
            {ALL_TAGS.map(tag=>(
              <button key={tag} onClick={()=>{setActiveTagFilter(t=>t===tag?null:tag);setPage(1);}}
                style={{padding:"5px 11px",border:"1px solid",borderColor:activeTagFilter===tag?"#8060a0":"#e8e2db",borderRadius:99,background:activeTagFilter===tag?(darkMode?"rgba(120,90,160,0.2)":"#f5f0f8"):T.card,color:activeTagFilter===tag?"#a080d0":T.textM,fontFamily:"'Jost',sans-serif",fontWeight:600,fontSize:10,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                {tag}
              </button>
            ))}
          </div>
          {/* Tri — ligne dédiée, toujours visible */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
            <span style={{fontSize:10,color:"#ccc",fontWeight:500}}>{filtered.length} recette{filtered.length>1?"s":""}</span>
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowSortPanel(s=>!s)}
                style={{padding:"6px 14px",border:`1.5px solid ${sortBy!=="default"?ROSE:"#e8e2db"}`,borderRadius:99,background:sortBy!=="default"?T.rose_l:T.card,color:sortBy!=="default"?"#c09060":T.textM,fontFamily:"'Jost',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <span>↕</span> <span>{sortBy==="default"?"Trier":sortBy==="cal_asc"?"Cal ↑":sortBy==="cal_desc"?"Cal ↓":"Prot ↓"}</span>
              </button>
              {showSortPanel&&(
                <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,boxShadow:darkMode?"0 8px 30px rgba(0,0,0,0.5)":"0 8px 30px rgba(0,0,0,0.12)",zIndex:100,minWidth:175,overflow:"hidden",animation:"fadeInScale 0.15s ease"}}>
                  {[["default","Par défaut"],["cal_asc","Calories ↑"],["cal_desc","Calories ↓"],["prot_desc","Protéines ↓"]].map(([v,l])=>(
                    <button key={v} onClick={()=>{setSortBy(v);setShowSortPanel(false);}}
                      style={{display:"block",width:"100%",textAlign:"left",padding:"11px 16px",border:"none",background:sortBy===v?T.rose_l:T.card,color:sortBy===v?"#c09060":T.text,fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:sortBy===v?700:400,cursor:"pointer",borderBottom:`1px solid ${T.borderLL}`}}>
                      {sortBy===v?"✓  ":""}{l}
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
          <div ref={listRef} style={{animation:goalAnim?`${goalAnim==="left"?"slideFromRight":"slideFromLeft"} 0.3s ease`:"none"}}>
            <div style={{display:"grid",gridTemplateColumns:(!isMobile&&showDetail)?"1fr":"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
              {isLoading?Array.from({length:6}).map((_,i)=>(
                <div key={i} style={{background:"#fff",borderRadius:18,padding:"16px 18px",border:"1.5px solid #ede8e0"}}>
                  <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
                    <div className="skeleton" style={{width:28,height:28,borderRadius:"50%",flexShrink:0}}/>
                    <div className="skeleton" style={{width:70,height:16,borderRadius:8}}/>
                  </div>
                  <div className="skeleton" style={{width:"80%",height:18,borderRadius:8,marginBottom:8}}/>
                  <div className="skeleton" style={{width:"55%",height:14,borderRadius:8,marginBottom:14}}/>
                  <div style={{display:"flex",gap:8,paddingTop:10,borderTop:"1px solid #f5f0ea"}}>
                    <div className="skeleton" style={{width:50,height:20,borderRadius:8}}/>
                    <div className="skeleton" style={{width:36,height:20,borderRadius:8}}/>
                    <div className="skeleton" style={{width:36,height:20,borderRadius:8}}/>
                  </div>
                </div>
              )):paginated.map((r,i)=>{
                const m=computeMacros(r.ingredients);const isSel=selected?.id===r.id;const gc2=GOALS[r.goal];const isFav=favorites.includes(r.id);
                const tags=getTags(r);
                // Teinte de fond subtile selon l'objectif
                const cardBg=isSel?T.card:darkMode?(activeGoal==="seche"?"#1d1a1a":activeGoal==="muscle"?"#1a1d1a":"#1a1a1c"):(activeGoal==="seche"?"#fdf7f7":activeGoal==="muscle"?"#f7fdf8":"#faf7f4");
                const cardBorder=isSel?ROSE:darkMode?(activeGoal==="seche"?"#2a2020":activeGoal==="muscle"?"#202a20":"#252525"):(activeGoal==="seche"?"#f0e4e4":activeGoal==="muscle"?"#e4f0e6":"#ece6df");
                return(
                  <div key={r.id} onClick={()=>selectRecipe(r)}
                    style={{
                      background:cardBg,
                      border:`1.5px solid ${cardBorder}`,
                      borderRadius:18,padding:"16px 18px",
                      cursor:"pointer",
                      transition:"all 0.18s",
                      boxShadow:isSel?`0 6px 28px ${gc2.color}28`:"0 1px 4px rgba(0,0,0,0.05)",
                      animation:`fadeIn 0.3s ease ${(i%20)*0.02}s both`,
                      position:"relative",
                      // Tap feedback mobile
                      WebkitTapHighlightColor:"transparent",
                    }}
                    onTouchStart={e=>e.currentTarget.style.transform="scale(0.97)"}
                    onTouchEnd={e=>{e.currentTarget.style.transform="scale(1)"}}
                    onTouchCancel={e=>{e.currentTarget.style.transform="scale(1)"}}
                  >
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
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:700,color:T.text,lineHeight:1.25,marginBottom:5}}>{r.name}</div>
                    </div>
                    <div style={{display:"flex",gap:10,paddingTop:9,marginTop:6,borderTop:`1px solid ${T.borderL}`,alignItems:"center"}}>
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
            {filtered.length===0&&(
              <div style={{textAlign:"center",padding:"50px 20px"}}>
                {showFavsOnly?(
                  <>
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{margin:"0 auto 16px",display:"block",opacity:0.3}}>
                      <circle cx="45" cy="45" r="42" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                      <path d="M45 62 C45 62 22 48 22 35 C22 27 29 21 36 21 C40 21 43 23 45 26 C47 23 50 21 54 21 C61 21 68 27 68 35 C68 48 45 62 45 62Z" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                      <line x1="30" y1="30" x2="60" y2="60" stroke={T.textM} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div style={{fontSize:14,fontWeight:600,color:T.textM}}>Aucun favori</div>
                    <div style={{fontSize:11,marginTop:6,color:T.textF}}>Clique sur 🤍 sur une recette pour en ajouter</div>
                  </>
                ):(
                  <>
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{margin:"0 auto 16px",display:"block",opacity:0.3}}>
                      <circle cx="45" cy="45" r="42" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                      <circle cx="45" cy="38" r="14" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                      <line x1="54" y1="49" x2="64" y2="59" stroke={T.textM} strokeWidth="2" strokeLinecap="round"/>
                      <line x1="38" y1="38" x2="52" y2="38" stroke={T.textM} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div style={{fontSize:14,fontWeight:600,color:T.textM}}>Aucune recette trouvée</div>
                    <div style={{fontSize:11,marginTop:6,color:T.textF}}>Essaie d'autres filtres ou efface la recherche</div>
                  </>
                )}
              </div>
            )}
            <div style={{marginTop:14,padding:"10px 13px",background:T.footerBg,borderRadius:12,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:13}}>📋</span>
              <span style={{fontSize:10,color:"#bbb"}}>Valeurs issues de la <strong style={{color:"#aaa"}}>Table Ciqual 2025</strong> (Anses)</span>
            </div>
            <div style={{height:isMobile?90:36}}/>
          </div>
          {/* Desktop panel */}
          {!isMobile&&showDetail&&selected&&(
            <div style={{position:"sticky",top:68}}>
              <div style={{background:T.sheetBg,border:`1.5px solid ${T.border}`,borderRadius:20,overflow:"hidden",boxShadow:"0 10px 50px rgba(201,168,130,0.18)"}}>
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
          <div style={{position:"relative",background:T.sheetBg,borderRadius:"20px 20px 0 0",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 -6px 40px rgba(0,0,0,0.18)",animation:"slideUp 0.25s ease"}}>
            <div onTouchStart={onSheetTouchStart} onTouchEnd={onSheetTouchEnd} style={{padding:"10px 20px 0",display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,cursor:"grab"}}>
              <div style={{width:36,height:4,borderRadius:99,background:"#e0d8d0"}}/>
            </div>
            <SheetHeader/>
            <div style={{overflowY:"auto",padding:"16px 16px 80px",flex:1,WebkitOverflowScrolling:"touch"}}>
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
          <div style={{position:"relative",background:T.pageBg,borderRadius:"20px 20px 0 0",height:"90vh",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
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
                      style={{flexShrink:0,padding:"6px 10px 5px",border:`1.5px solid ${weekDay===d?ROSE:"rgba(255,255,255,0.1)"}`,borderRadius:10,background:weekDay===d?"rgba(201,168,130,0.15)":"transparent",color:weekDay===d?ROSE:"#666",cursor:"pointer",textAlign:"center",minWidth:46,position:"relative",overflow:"hidden"}}>
                      <div style={{fontSize:10,fontWeight:700}}>{d}</div>
                      <div style={{fontSize:8,color:tot>0?(weekDay===d?ROSE:"#999"):"#444",marginTop:1,marginBottom:4}}>{tot>0?`${Math.round(tot/100)/10}k`:"-"}</div>
                      {/* Barre progression vs objectif */}
                      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"rgba(255,255,255,0.06)"}}>
                        {tot>0&&<div style={{height:"100%",width:`${Math.min(100,Math.round(tot/dailyGoalKcal*100))}%`,background:tot>dailyGoalKcal?"#f08080":tot/dailyGoalKcal>0.8?"#e8d070":"#80d080",borderRadius:99,transition:"width 0.3s"}}/>}
                      </div>
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
                  <div style={{background:T.card,borderRadius:14,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${T.border}`,boxShadow:"0 2px 10px rgba(0,0,0,0.04)"}}>
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
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.card,borderRadius:12,padding:"10px 12px",marginBottom:6,border:`1px solid ${T.border}`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
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
          <div style={{position:"relative",background:T.sheetBg,borderRadius:"20px 20px 0 0",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
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
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{margin:"0 auto 14px",display:"block",opacity:0.3}}>
                    <circle cx="40" cy="40" r="38" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                    <path d="M18 24 L25 24 L32 50 L58 50 L63 34 L29 34" stroke={T.textM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <circle cx="35" cy="56" r="3" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                    <circle cx="55" cy="56" r="3" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                  </svg>
                  <div style={{fontSize:14,fontWeight:600,color:T.textM}}>Panier vide</div>
                  <div style={{fontSize:11,marginTop:5,color:T.textF}}>Ajoute des recettes depuis le panneau détail</div>
                </div>
              ):(
                <>
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Recettes sélectionnées</div>
                    {cart.map(item=>(
                      <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.borderLL}`}}>
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
                          style={{display:"flex",alignItems:"center",gap:9,padding:"8px 0",borderBottom:`1px solid ${T.borderLL}`,cursor:"pointer",opacity:checked?0.4:1}}>
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
          <div style={{position:"relative",background:T.sheetBg,borderRadius:"20px 20px 0 0",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp 0.25s ease"}}>
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
              {/* ── Historique 7 jours ── */}
              {dailyHistory.length>0&&(
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.textM,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>7 derniers jours</div>
                  {dailyHistory.map((entry,i)=>{
                    const d=new Date(entry.date);
                    const label=i===0?"Hier":d.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"});
                    const pct=Math.min(100,Math.round(entry.cal/entry.goal*100));
                    const ok=pct>=90&&pct<=110;
                    return(
                      <div key={entry.date} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:T.cardAlt,borderRadius:12,marginBottom:6}}>
                        <div style={{width:36,textAlign:"center"}}>
                          <div style={{fontSize:10,fontWeight:700,color:T.textM,textTransform:"capitalize"}}>{label}</div>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{height:5,background:T.border,borderRadius:99,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${pct}%`,background:pct>110?"#f08080":pct>80?"#80c880":"#e8c070",borderRadius:99}}/>
                          </div>
                        </div>
                        <div style={{textAlign:"right",minWidth:70}}>
                          <span style={{fontSize:12,fontWeight:800,color:ok?"#80c880":pct>110?"#f08080":T.textM,fontFamily:"'Cormorant Garamond',serif"}}>{entry.cal}</span>
                          <span style={{fontSize:9,color:T.textM}}> kcal</span>
                          <span style={{fontSize:11,marginLeft:4}}>{ok?"✓":pct>110?"↑":"↓"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {dailyRecipes.length===0?(
                <div style={{textAlign:"center",padding:"32px 20px"}}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{margin:"0 auto 14px",display:"block",opacity:0.35}}>
                    <circle cx="40" cy="40" r="38" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                    <rect x="24" y="22" width="32" height="36" rx="4" stroke={T.textM} strokeWidth="1.5" fill="none"/>
                    <line x1="30" y1="32" x2="50" y2="32" stroke={T.textM} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="30" y1="38" x2="50" y2="38" stroke={T.textM} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="30" y1="44" x2="42" y2="44" stroke={T.textM} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div style={{fontSize:14,fontWeight:600,color:T.textM}}>Aucun repas enregistré</div>
                  <div style={{fontSize:11,marginTop:5,color:T.textF}}>Clique sur "Ajouter au jour" dans une recette</div>
                </div>
              ):(
                dailyRecipes.map((r,i)=>{
                  const m=r.macros||computeMacros(r.ingredients);
                  return(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.borderLL}`}}>
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
            {/* Welcome Coach Antoine */}
            <div style={{background:`linear-gradient(135deg,${DARK}ee,#2a1a0e)`,borderRadius:18,padding:"18px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
              <img src="data:image/png;base64,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" alt="Coach Antoine" style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",objectPosition:"center top",flexShrink:0,border:`2px solid ${ROSE}`}}/>
              <div>
                <div style={{fontSize:11,color:ROSE,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Coach Antoine</div>
                <div style={{fontSize:12,color:"#fff",lineHeight:1.55,fontStyle:"italic"}}>
                  "Cette app est conçue pour mes clientes — suis le programme et les résultats suivront 💪"
                </div>
              </div>
            </div>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:DARK,marginBottom:4}}>Bienvenue ✨</div>
              <div style={{fontSize:12,color:"#888",lineHeight:1.6,maxWidth:300,margin:"0 auto"}}>Recettes sèche · maintien · prise de masse, planification hebdo et suivi calorique — tout ce qu'il faut pour atteindre ton objectif. 🎯</div>
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
              {/* Indicateur étapes step 0 */}
              <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:16}}>
                {[0,1].map(s=><div key={s} style={{width:s===0?24:8,height:8,borderRadius:99,background:s===0?ROSE:"#e8e2db",transition:"all 0.3s"}}/>)}
              </div>
              <button onClick={()=>setObStep(1)}
                style={{width:"100%",padding:"14px",background:DARK,color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                Continuer →
              </button>
            </>}
            {obStep===1&&(()=>{
              const tdeeResult=computeTDEE(obAge,obWeight,obHeight,obActivity,obGoal);
              return(<>
                {/* ── Indicateur étapes ── */}
                <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:20}}>
                  {[0,1].map(s=><div key={s} style={{width:s===1?24:8,height:8,borderRadius:99,background:s<=1?ROSE:"#e8e2db",transition:"all 0.3s"}}/>)}
                </div>
                <div style={{fontSize:13,fontWeight:700,color:DARK,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>Ton objectif calorique 🎯</div>

                {/* ── Toggle TDEE / Manuel ── */}
                <div style={{display:"flex",background:"#f5f0ea",borderRadius:12,padding:3,marginBottom:16,gap:3}}>
                  {[["tdee","🧮 Calculer mon TDEE"],["manual","✏️ Je connais mon objectif"]].map(([m,lbl])=>(
                    <button key={m} onClick={()=>setObCalMode(m)}
                      style={{flex:1,padding:"8px 6px",border:"none",borderRadius:10,background:obCalMode===m?"#fff":"transparent",
                        color:obCalMode===m?DARK:"#aaa",fontSize:10,fontWeight:700,cursor:"pointer",
                        boxShadow:obCalMode===m?"0 1px 6px rgba(0,0,0,0.08)":"none",transition:"all 0.18s"}}>
                      {lbl}
                    </button>
                  ))}
                </div>

                {obCalMode==="tdee"&&<>
                  {/* Champs morpho */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                    {[["Âge","ans",obAge,setObAge,16,80],["Poids","kg",obWeight,setObWeight,30,150],["Taille","cm",obHeight,setObHeight,140,210]].map(([lbl,unit,val,setter,mn,mx])=>(
                      <div key={lbl} style={{background:"#f5f0ea",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
                        <div style={{fontSize:9,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:5}}>{lbl}</div>
                        <input type="number" value={val||""} placeholder="—" min={mn} max={mx}
                          onChange={e=>setter(+e.target.value)}
                          style={{width:"100%",border:"none",background:"transparent",fontSize:18,fontWeight:800,color:DARK,textAlign:"center",outline:"none",fontFamily:"'Cormorant Garamond',serif"}}/>
                        <div style={{fontSize:9,color:"#aaa",marginTop:2}}>{unit}</div>
                      </div>
                    ))}
                  </div>
                  {/* Niveau d'activité */}
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                    {Object.entries(ACTIVITY_LEVELS).map(([k,v])=>(
                      <button key={k} onClick={()=>setObActivity(k)}
                        style={{padding:"8px 12px",border:`1.5px solid ${obActivity===k?ROSE:"#e8e2db"}`,borderRadius:10,
                          background:obActivity===k?ROSE_L:"#fff",cursor:"pointer",textAlign:"left",
                          display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}>
                        <div>
                          <span style={{fontSize:12,fontWeight:700,color:obActivity===k?"#8a6040":DARK}}>{v.label}</span>
                          <span style={{fontSize:10,color:"#bbb",marginLeft:7}}>{v.sub}</span>
                        </div>
                        {obActivity===k&&<span style={{color:ROSE,fontWeight:800}}>✓</span>}
                      </button>
                    ))}
                  </div>
                  {/* Résultat TDEE */}
                  {tdeeResult?(
                    <div style={{background:`linear-gradient(135deg,${ROSE}18,${ROSE}08)`,border:`1.5px solid ${ROSE}44`,borderRadius:14,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,color:ROSE,textTransform:"uppercase",letterSpacing:"0.08em"}}>Estimation TDEE</div>
                        <div style={{fontSize:9,color:"#aaa",marginTop:2}}>{obGoal==="seche"?"Déficit −400 kcal appliqué":obGoal==="muscle"?"Surplus +250 kcal appliqué":"Maintien"}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:ROSE}}>{tdeeResult}</div>
                        <button onClick={()=>setObCal(tdeeResult)}
                          style={{background:ROSE,border:"none",borderRadius:9,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:700,boxShadow:`0 2px 10px ${ROSE}44`}}>
                          Utiliser
                        </button>
                      </div>
                    </div>
                  ):(
                    <div style={{background:"#f5f0ea",borderRadius:12,padding:"10px 14px",marginBottom:14,textAlign:"center"}}>
                      <div style={{fontSize:11,color:"#bbb"}}>Remplis âge, poids et taille pour obtenir ton estimation</div>
                    </div>
                  )}
                </>}

                {obCalMode==="manual"&&<>
                  <div style={{fontSize:11,color:"#bbb",marginBottom:12,lineHeight:1.6}}>
                    {obGoal==="seche"?"En sèche, un déficit de 300-500 kcal est recommandé.":obGoal==="muscle"?"En prise de masse, un surplus de 200-400 kcal est idéal.":"En maintien, vise ton métabolisme total estimé."}
                  </div>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
                    {(obGoal==="seche"?[1400,1600,1800]:obGoal==="muscle"?[2000,2200,2500]:[1700,2000,2300]).map(v=>(
                      <button key={v} onClick={()=>setObCal(v)}
                        style={{padding:"7px 14px",border:`1.5px solid ${obCal===v?ROSE:"#e8e2db"}`,borderRadius:99,background:obCal===v?ROSE_L:"#fff",color:obCal===v?"#8a6040":"#bbb",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        {v} kcal
                      </button>
                    ))}
                  </div>
                </>}

                {/* Champ calorique final (toujours visible) */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                  <input type="number" value={obCal} min={1000} max={4000} step={50} onChange={e=>setObCal(+e.target.value)}
                    style={{flex:1,padding:"12px 14px",border:`2px solid ${ROSE}55`,borderRadius:12,fontSize:18,fontWeight:800,color:DARK,textAlign:"center",outline:"none",fontFamily:"'Cormorant Garamond',serif",background:ROSE_L}}/>
                  <span style={{fontSize:12,color:"#aaa",fontWeight:600,flexShrink:0}}>kcal / jour</span>
                </div>

                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setObStep(0)} style={{flex:"0 0 auto",padding:"13px 18px",background:"#f5f0ea",color:"#aaa",border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:"pointer"}}>← Retour</button>
                  <button onClick={finishOnboarding}
                    style={{flex:1,padding:"13px",background:DARK,color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 16px rgba(0,0,0,0.2)`}}>
                    C'est parti ! 🚀
                  </button>
                </div>
              </>);
            })()}
          </div>
        </div>
      )}

      {/* ── PANNEAU PROFIL (accessible à tout moment) ── */}
      {showProfile&&(
        <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div onClick={()=>setShowProfile(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}}/>
          <div style={{position:"relative",background:"#fff",borderRadius:24,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto",animation:"fadeInScale 0.25s ease",boxShadow:"0 24px 60px rgba(0,0,0,0.25)"}}>
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
                  {/* ── Calculateur TDEE ── */}
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Calcul automatique (facultatif)</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                      {[["Âge","ans",pAge,setPAge,18,80],["Poids","kg",pWeight,setPWeight,30,150],["Taille","cm",pHeight,setPHeight,140,210]].map(([lbl,unit,val,setter,mn,mx])=>(
                        <div key={lbl} style={{background:T.cardAlt,borderRadius:12,padding:"10px 10px 8px",textAlign:"center"}}>
                          <div style={{fontSize:9,fontWeight:700,color:"#aaa",textTransform:"uppercase",marginBottom:6}}>{lbl}</div>
                          <input type="number" value={val||""} placeholder="—" min={mn} max={mx}
                            onChange={e=>{setter(+e.target.value);}}
                            style={{width:"100%",border:"none",background:"transparent",fontSize:16,fontWeight:800,color:T.text,textAlign:"center",outline:"none",fontFamily:"'Cormorant Garamond',serif"}}/>
                          <div style={{fontSize:9,color:"#aaa"}}>{unit}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
                      {Object.entries(ACTIVITY_LEVELS).map(([k,v])=>(
                        <button key={k} onClick={()=>setPActivity(k)}
                          style={{padding:"8px 12px",border:`1.5px solid ${pActivity===k?ROSE:T.border}`,borderRadius:10,background:pActivity===k?T.rose_l:T.card,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <span style={{fontSize:12,fontWeight:700,color:pActivity===k?"#c09060":T.text}}>{v.label}</span>
                            <span style={{fontSize:10,color:T.textM,marginLeft:8}}>{v.sub}</span>
                          </div>
                          {pActivity===k&&<span style={{color:ROSE,fontSize:13}}>✓</span>}
                        </button>
                      ))}
                    </div>
                    {(()=>{
                      const tdee=computeTDEE(pAge,pWeight,pHeight,pActivity,pGoal);
                      return tdee&&(
                        <div style={{background:darkMode?"rgba(201,168,130,0.12)":"#fdf8f3",border:`1px solid ${ROSE}44`,borderRadius:12,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:10,color:ROSE,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>Estimation TDEE</div>
                            <div style={{fontSize:9,color:T.textM,marginTop:2}}>{pGoal==="seche"?"Déficit −400 kcal":pGoal==="muscle"?"Surplus +250 kcal":"Maintien"}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:ROSE}}>{tdee}</div>
                            <button onClick={()=>setPCal(tdee)}
                              style={{background:ROSE,border:"none",borderRadius:8,color:"#fff",padding:"5px 10px",cursor:"pointer",fontSize:10,fontWeight:700}}>
                              Appliquer
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{marginBottom:22}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Objectif calorique</div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <input type="number" value={pCal} onChange={e=>setPCal(+e.target.value)} min={1000} max={4000} step={50}
                        style={{flex:1,padding:"10px 14px",border:`1.5px solid ${T.inputBorder}`,borderRadius:12,fontSize:16,fontWeight:700,color:T.text,textAlign:"center",outline:"none",fontFamily:"'Cormorant Garamond',serif",background:T.input}}/>
                      <span style={{fontSize:12,color:"#aaa",flexShrink:0}}>kcal / jour</span>
                    </div>
                  </div>
                  <button onClick={()=>saveProfile({name:pName,goal:pGoal,calTarget:pCal,age:pAge,weight:pWeight,height:pHeight,activity:pActivity,done:true})}
                    style={{width:"100%",padding:"13px",background:DARK,color:"#fff",border:"none",borderRadius:14,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    ✓ Enregistrer
                  </button>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14,padding:"12px 16px",background:T.cardAlt,borderRadius:14}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:T.text}}>🌙 Mode sombre</div>
                      <div style={{fontSize:10,color:T.textM,marginTop:2}}>Interface sombre pour le soir</div>
                    </div>
                    <button onClick={()=>setDarkMode(d=>!d)}
                      style={{width:46,height:26,borderRadius:99,background:darkMode?"#80a0d0":"rgba(120,120,130,0.3)",border:"none",cursor:"pointer",position:"relative",transition:"background 0.25s",flexShrink:0}}>
                      <div style={{position:"absolute",top:3,left:darkMode?22:3,width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.3)",transition:"left 0.22s ease"}}/>
                    </button>
                  </div>
                  <button onClick={()=>{setShowProfile(false);setShowOnboarding(true);setObStep(0);}} style={{width:"100%",marginTop:8,padding:"10px",background:T.cardAlt,color:T.textM,border:"none",borderRadius:14,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                    Refaire l'onboarding
                  </button>
                </div>
          </div>
        </div>
      )}

      {/* Fermer le dropdown tri au clic extérieur */}
      {showSortPanel&&<div style={{position:"fixed",inset:0,zIndex:90}} onClick={()=>setShowSortPanel(false)}/>}


      {/* ── PANNEAU COACHING ── */}
      {showCoaching&&(
        <div style={{position:"fixed",inset:0,zIndex:300,background:T.pageBg,overflowY:"auto",paddingBottom:80}}>
          <div style={{background:DARK,padding:"16px 20px",position:"sticky",top:0,zIndex:10,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",backgroundRepeat:"repeat"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>setShowCoaching(false)}
                style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,width:34,height:34,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>‹</button>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"#fff",letterSpacing:"0.08em"}}>Mon Coach 🏋️</div>
            </div>
          </div>
          <div style={{maxWidth:480,margin:"0 auto",padding:"20px 18px"}}>
            <div style={{background:`linear-gradient(135deg,#1a0e06,${DARK})`,borderRadius:20,padding:"24px 20px",marginBottom:20,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
              <img src="data:image/png;base64,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" alt="Coach Antoine"
                style={{width:110,height:110,borderRadius:"50%",objectFit:"cover",objectPosition:"center top",border:`4px solid ${ROSE}`,marginBottom:14,boxShadow:`0 4px 20px ${ROSE}66`}}/>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#fff",marginBottom:4}}>Antoine DCM</div>
              <div style={{fontSize:12,color:ROSE,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>Coach Sportif en Ligne</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.65,fontStyle:"italic",maxWidth:300}}>
                "Je t'accompagne vers ton objectif avec des programmes personnalisés, une nutrition adaptée, et un suivi hebdomadaire."
              </div>
            </div>
            <div style={{background:T.card,border:`1px solid ${ROSE}33`,borderRadius:16,padding:"16px 18px",marginBottom:16}}>
              <div style={{fontSize:10,color:ROSE,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>💬 Message du jour</div>
              <div style={{fontSize:14,color:T.text,lineHeight:1.6,fontStyle:"italic"}}>
                "La régularité bat toujours l'intensité. Une séance imparfaite vaut mieux qu'une séance parfaite jamais faite. 🔥"
              </div>
              <div style={{fontSize:11,color:T.textM,marginTop:8,textAlign:"right",fontWeight:600}}>— Antoine</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {[
                {emoji:"📸", label:"Instagram", sub:"@antoiinedacosta", color:"#E1306C", href:"https://www.instagram.com/antoiinedacosta/"},
                {emoji:"📩", label:"Me contacter", sub:"contact@antoinecoaching.com", color:"#4fc3f7", href:"mailto:contact@antoinecoaching.com"},
              ].map((item)=>(
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",alignItems:"center",gap:14,background:T.card,borderRadius:14,padding:"14px 16px",textDecoration:"none",border:`1px solid ${item.color}33`}}>
                  <div style={{width:40,height:40,borderRadius:12,background:`${item.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text}}>{item.label}</div>
                    <div style={{fontSize:11,color:T.textM,marginTop:2}}>{item.sub}</div>
                  </div>
                  <div style={{fontSize:18,color:"rgba(255,255,255,0.3)"}}>›</div>
                </a>
              ))}
            </div>
            <div style={{background:T.card,borderRadius:16,padding:"16px 18px",border:`1px solid ${T.border}`}}>
              <div style={{fontSize:10,color:ROSE,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>🏆 Méthode Coach Antoine</div>
              {["✅ Programme nutrition 100% personnalisé","✅ Suivi hebdomadaire & ajustements","✅ Plans entraînement adaptés à ton objectif","✅ Groupe de suivi & communauté privée"].map(txt=>(
                <div key={txt} style={{fontSize:13,color:T.text,marginBottom:8,lineHeight:1.5}}>{txt}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAVIGATION BAR (mobile only) ── */}
      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:250,background:darkMode?"#000":DARK,borderTop:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 -4px 20px rgba(0,0,0,0.3)",paddingBottom:"env(safe-area-inset-bottom)",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",backgroundRepeat:"repeat"}}>
          <div style={{display:"flex",alignItems:"stretch",height:58}}>
            {[
              {icon:"🏠", label:"Recettes",  action:()=>{setShowWeek(false);setShowCart(false);setShowDailyPanel(false);setShowProfile(false);setShowCoaching(false);}, active:!showWeek&&!showCart&&!showDailyPanel&&!showProfile&&!showCoaching},
              {icon:"📆", label:"Semainier", action:()=>setShowWeek(true),  active:showWeek,  badge:null},
              {icon:"📅", label:"Journal",   action:()=>setShowDailyPanel(true), active:showDailyPanel,
                badge:dailyCal>0?<div style={{position:"absolute",top:6,right:"50%",transform:"translateX(calc(50% + 8px))",background:dailyPct>100?"#f08080":"#80d080",borderRadius:99,padding:"1px 5px",fontSize:7,fontWeight:800,color:"#fff",lineHeight:1.4}}>{dailyPct}%</div>:null},
              {icon:"🛒", label:"Courses",   action:()=>setShowCart(true),  active:showCart,
                badge:cart.length>0?<div style={{position:"absolute",top:6,right:"50%",transform:"translateX(calc(50% + 8px))",width:14,height:14,borderRadius:"50%",background:ROSE,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff"}}>{cart.length}</div>:null},
              {icon:"👤", label:"Profil",    action:()=>setShowProfile(true), active:showProfile, badge:null},
              {icon:"🏋️", label:"Coaching",  action:()=>{setShowWeek(false);setShowCart(false);setShowDailyPanel(false);setShowProfile(false);setShowCoaching(true);}, active:showCoaching, badge:null},
            ].map(({icon,label,action,active,badge})=>(
              <button key={label} onClick={action}
                style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",background:"transparent",cursor:"pointer",padding:"6px 0",position:"relative",transition:"all 0.15s"}}>
                {badge}
                <span style={{fontSize:20,lineHeight:1,filter:active?"none":"grayscale(0.4)",opacity:active?1:0.45,transition:"all 0.15s"}}>{icon}</span>
                <span style={{fontSize:9,fontWeight:active?700:500,color:active?ROSE:"rgba(255,255,255,0.35)",letterSpacing:"0.04em",lineHeight:1,transition:"all 0.15s"}}>{label}</span>
                {active&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:20,height:2,borderRadius:99,background:ROSE}}/>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
