import { useState, useRef, useEffect } from "react";

// ─── Palette: peach / soft orange / soft yellow ──────────────────────────────
const BG     = "#FFFFFF";
const CARD   = "#FFF6EE";
const SHADOW_DARK  = "rgba(214,178,140,0.35)";
const SHADOW_LIGHT = "rgba(255,255,255,0.98)";
const ACCENT       = "#F4894A";
const ACCENT_LIGHT = "#FFE3CC";
const TEXT_PRIMARY = "#5C3D1E";
const TEXT_SEC     = "#B07848";
const TEXT_HINT    = "#D9B68C";

const MINT  = { bg:"#EAF6E9", border:"#BFE3BC", text:"#4F8F4B" };
const AMBER = { bg:"#FFF3D6", border:"#FFD98A", text:"#A9760B" };
const BLUE  = { bg:"#E9F1FB", border:"#BBD8F5", text:"#3E6FA8" };
const RED   = { bg:"#FCEAE6", border:"#F4C3B8", text:"#C0573A" };
const LAV   = { bg:"#FFE3CC", border:"#FBC089", text:"#C0612A" };

const neu = (r=16, depth=8) => ({
  borderRadius: r, background: CARD,
  boxShadow: `-${depth}px -${depth}px ${depth*2.2}px ${SHADOW_LIGHT}, ${depth}px ${depth}px ${depth*2}px ${SHADOW_DARK}`,
});
const neuInset = (r=12) => ({
  borderRadius: r, background: CARD,
  boxShadow: `inset -4px -4px 10px ${SHADOW_LIGHT}, inset 4px 4px 10px ${SHADOW_DARK}`,
});
const neuBtn = (active) => ({
  borderRadius:24, background: active ? ACCENT : CARD, color: active ? "#fff" : TEXT_SEC,
  boxShadow: active
    ? `inset -2px -2px 6px rgba(255,255,255,0.25), inset 2px 2px 6px rgba(0,0,0,0.18), 0 4px 16px rgba(244,137,74,0.35)`
    : `-4px -4px 10px ${SHADOW_LIGHT}, 4px 4px 10px ${SHADOW_DARK}`,
});

const FOOD_DB = [
  { food:"Sweet potato", emoji:"🍠", category:"vegetable", risk:"low", gasRisk:false, tip:"Steam & mash. Great first food.", nutrients:["Beta-carotene","Vitamin C","Potassium","Fibre"], vitamins:["A","C","B6"], desc:"One of the best first foods — naturally sweet, easy to digest, and packed with beta-carotene for eye and immune health." },
  { food:"Carrot", emoji:"🥕", category:"vegetable", risk:"low", gasRisk:false, tip:"Boil soft, purée or finger food.", nutrients:["Beta-carotene","Vitamin K","Potassium","Fibre"], vitamins:["A","K","B6"], desc:"Rich in beta-carotene which converts to Vitamin A, supporting vision and immune function. Naturally sweet." },
  { food:"Broccoli", emoji:"🥦", category:"vegetable", risk:"low", gasRisk:true, tip:"Steam florets until very soft. Start with small amounts to avoid gas.", nutrients:["Vitamin C","Folate","Iron","Calcium"], vitamins:["C","K","B9"], desc:"A nutritional powerhouse with iron and calcium. Can cause gas — start with tiny portions and increase gradually." },
  { food:"Cauliflower", emoji:"🥦", category:"vegetable", risk:"low", gasRisk:true, tip:"Steam until very soft. Introduce in tiny portions — can cause gas.", nutrients:["Vitamin C","Folate","Vitamin K","Fibre"], vitamins:["C","K","B9"], desc:"Nutritious but a known gas producer. Introduce in small amounts and watch for bloating." },
  { food:"Courgette", emoji:"🥒", category:"vegetable", risk:"low", gasRisk:false, tip:"Sauté and blend or serve as fingers.", nutrients:["Vitamin C","Folate","Potassium","Water"], vitamins:["C","B9"], desc:"High water content makes it easy to digest and hydrating. Mild flavour pairs well with other vegetables." },
  { food:"Spinach", emoji:"🌿", category:"vegetable", risk:"low", gasRisk:false, tip:"Wilt and blend into purées.", nutrients:["Iron","Calcium","Folate","Vitamin K"], vitamins:["A","C","K","B9"], desc:"Excellent source of non-haem iron — pair with Vitamin C foods to boost absorption." },
  { food:"Apple", emoji:"🍎", category:"fruit", risk:"low", gasRisk:false, tip:"Bake or stew to soften.", nutrients:["Vitamin C","Fibre","Quercetin","Natural sugars"], vitamins:["C"], desc:"A classic first fruit. High in pectin fibre which supports digestion." },
  { food:"Pear", emoji:"🍐", category:"fruit", risk:"low", gasRisk:false, tip:"Ripe pear can be served raw, grated.", nutrients:["Fibre","Vitamin C","Copper","Potassium"], vitamins:["C","K"], desc:"Very gentle on tiny tummies and naturally helpful for constipation." },
  { food:"Banana", emoji:"🍌", category:"fruit", risk:"low", gasRisk:false, tip:"Mash or serve as finger food strips.", nutrients:["Potassium","Vitamin B6","Magnesium","Natural sugars"], vitamins:["B6","C"], desc:"Energy-dense and easy to prepare — no cooking needed." },
  { food:"Mango", emoji:"🥭", category:"fruit", risk:"low", gasRisk:false, tip:"Ripe and soft — great finger food.", nutrients:["Vitamin C","Beta-carotene","Folate","Fibre"], vitamins:["A","C","B9"], desc:"Exceptionally high in Vitamin C and beta-carotene. Ripe mango is naturally soft." },
  { food:"Blueberries", emoji:"🫐", category:"fruit", risk:"low", gasRisk:false, tip:"Squish before serving to reduce choking risk.", nutrients:["Antioxidants","Vitamin C","Vitamin K","Fibre"], vitamins:["C","K"], desc:"Rich in antioxidants that support brain development. Always squish or halve before serving." },
  { food:"Oats", emoji:"🌾", category:"carb", risk:"low", gasRisk:false, tip:"Cook into smooth porridge.", nutrients:["Beta-glucan fibre","Iron","Zinc","B vitamins"], vitamins:["B1","B5"], desc:"A brilliant breakfast base — slow-release energy and soluble fibre supports stable blood sugar." },
  { food:"Rice", emoji:"🍚", category:"carb", risk:"low", gasRisk:false, tip:"Well-cooked soft rice or rice porridge.", nutrients:["Carbohydrates","B vitamins","Magnesium","Iron (fortified)"], vitamins:["B1","B3"], desc:"Easy to digest and rarely allergenic. Baby rice cereal is often fortified with iron." },
  { food:"Pasta", emoji:"🍝", category:"carb", risk:"low", gasRisk:false, tip:"Cook very soft; small shapes work best.", nutrients:["Carbohydrates","B vitamins","Iron (enriched)","Folate"], vitamins:["B1","B9"], desc:"A versatile carb that pairs with almost any sauce. Cook until very soft." },
  { food:"Bread", emoji:"🍞", category:"carb", risk:"low", gasRisk:false, tip:"Soft wholemeal strips for BLW.", nutrients:["Carbohydrates","B vitamins","Iron","Fibre (wholemeal)"], vitamins:["B1","B3"], desc:"Wholemeal bread offers more fibre and nutrients than white. Good for BLW as toast fingers." },
  { food:"Potato", emoji:"🥔", category:"carb", risk:"low", gasRisk:false, tip:"Boil and mash with breast milk.", nutrients:["Vitamin C","Potassium","B6","Carbohydrates"], vitamins:["C","B6"], desc:"Filling and versatile. Boiled and mashed with breast milk or formula creates a smooth, familiar taste." },
  { food:"Chicken", emoji:"🍗", category:"protein", risk:"low", gasRisk:false, tip:"Slow-cook until very tender, shred finely.", nutrients:["Protein","Iron","Zinc","B vitamins"], vitamins:["B3","B6","B12"], desc:"Excellent source of haem iron and zinc for immune function." },
  { food:"Lentils", emoji:"🫘", category:"protein", risk:"low", gasRisk:true, tip:"Red lentil purée is easy to digest. Introduce in small amounts — can cause gas.", nutrients:["Plant protein","Iron","Folate","Fibre"], vitamins:["B9","B1"], desc:"A plant-based protein powerhouse. Red lentils cook quickly and blend into a smooth purée. Can cause gas — start small." },
  { food:"Beef", emoji:"🥩", category:"protein", risk:"low", gasRisk:false, tip:"Slow-cook and blend or shred.", nutrients:["Haem iron","Zinc","Protein","B12"], vitamins:["B12","B3","B6"], desc:"One of the best sources of haem iron and B12 for brain development." },
  { food:"Tofu", emoji:"🧊", category:"protein", risk:"low", gasRisk:false, tip:"Soft silken tofu — easy to grab.", nutrients:["Plant protein","Calcium","Iron","Isoflavones"], vitamins:["B1"], desc:"Silken tofu is naturally soft — no cooking needed. Good plant-based source of calcium and protein." },
  { food:"Salmon", emoji:"🐟", category:"protein", risk:"medium", gasRisk:false, tip:"Rich in omega-3, flake finely.", nutrients:["Omega-3 (DHA/EPA)","Protein","Vitamin D","B12"], vitamins:["D","B12","B3"], desc:"Outstanding source of DHA omega-3 for brain and eye development." },
  { food:"Yoghurt", emoji:"🥛", category:"dairy", risk:"medium", gasRisk:false, tip:"Full-fat plain yoghurt, no added sugar.", nutrients:["Calcium","Protein","Probiotics","B12"], vitamins:["B12","B2"], desc:"Full-fat plain yoghurt provides calcium for bone development and probiotics for gut health." },
  { food:"Cheese", emoji:"🧀", category:"dairy", risk:"medium", gasRisk:false, tip:"Grated mild cheddar on soft food.", nutrients:["Calcium","Protein","Fat","Vitamin A"], vitamins:["A","B12","B2"], desc:"Calcium-dense and flavourful. Choose mild, full-fat varieties." },
  { food:"Egg yolk", emoji:"🥚", category:"allergen", risk:"medium", gasRisk:false, tip:"Introduce allergen early.", nutrients:["Choline","Vitamin D","Lutein","Protein"], vitamins:["D","B12","A"], desc:"Rich in choline, critical for brain development. Early introduction is now recommended." },
  { food:"Peanut butter", emoji:"🥜", category:"allergen", risk:"high", gasRisk:false, tip:"Dilute with water first.", nutrients:["Healthy fats","Protein","Niacin","Magnesium"], vitamins:["E","B3"], desc:"Early introduction (from ~6 months) significantly reduces peanut allergy risk." },
  { food:"Wheat", emoji:"🌾", category:"allergen", risk:"medium", gasRisk:false, tip:"Soft bread or pasta — watch for reaction.", nutrients:["Carbohydrates","B vitamins","Iron","Fibre"], vitamins:["B1","B9"], desc:"Gluten-containing grain. Introduce gradually via soft bread or pasta." },
  { food:"Sesame", emoji:"🫙", category:"allergen", risk:"high", gasRisk:false, tip:"Tiny amount of tahini mixed in food.", nutrients:["Calcium","Healthy fats","Protein","Iron"], vitamins:["B1","E"], desc:"One of the top 14 allergens. Introduce via a tiny amount of tahini mixed into food." },
];

const INITIAL_LOG = [
  { id:1, date:"2024-06-01", food:"Sweet potato", emoji:"🍠", category:"vegetable", reaction:"none", notes:"Loved it!" },
  { id:2, date:"2024-06-02", food:"Carrot", emoji:"🥕", category:"vegetable", reaction:"none", notes:"Ate half" },
  { id:3, date:"2024-06-03", food:"Chicken", emoji:"🍗", category:"protein", reaction:"none", notes:"Shredded finely" },
  { id:4, date:"2024-06-04", food:"Beef", emoji:"🥩", category:"protein", reaction:"none", notes:"Slow cooked" },
  { id:5, date:"2024-06-05", food:"Apple", emoji:"🍎", category:"fruit", reaction:"none", notes:"Finger food attempt" },
  { id:6, date:"2024-06-06", food:"Oats", emoji:"🌾", category:"carb", reaction:"mild", notes:"Small rash on chin" },
];

const CATEGORIES = ["vegetable","fruit","carb","protein","dairy","allergen"];
const CAT_LABELS  = { vegetable:"Vegetables", fruit:"Fruits", carb:"Carbs", protein:"Proteins", dairy:"Dairy", allergen:"Allergens" };
const CAT_EMOJI   = { vegetable:"🥦", fruit:"🍓", carb:"🍞", protein:"🍗", dairy:"🧀", allergen:"⚠️" };
const CAT_COLORS  = { vegetable:MINT, fruit:RED, carb:AMBER, protein:LAV, dairy:BLUE, allergen:RED };
const FEEDING_LABELS = { puree:"Purées only", blw:"Baby-led weaning (BLW)", mixed:"Mixed approach" };
const ALLERGY_OPTIONS = ["egg","peanut","wheat","dairy","soy","fish","sesame","tree nuts"];
const REACTION_OPTIONS = [
  { value:"none", label:"No allergic reaction" },
  { value:"mild", label:"Mild allergic reaction" },
  { value:"strong", label:"Strong allergic reaction" },
  { value:"constipation", label:"Constipation" },
  { value:"diarrhea", label:"Diarrhea" },
  { value:"bloating", label:"Bloating" },
  { value:"spitup", label:"Spit-up" },
];
const LLM_OPTIONS = [
  { id:"claude", name:"Claude (Anthropic)", emoji:"🔮", hint:"console.anthropic.com → API Keys", placeholder:"sk-ant-api03-…", color:LAV,
    models:[
      { id:"claude-haiku-3-5-20241022", label:"Haiku", desc:"Fast & economical" },
      { id:"claude-sonnet-4-20250514", label:"Sonnet", desc:"Smarter, default" },
    ]
  },
  { id:"openai", name:"GPT-4 (OpenAI)", emoji:"🤖", hint:"platform.openai.com → API Keys", placeholder:"sk-proj-…", color:MINT,
    models:[
      { id:"gpt-4o-mini", label:"4o mini", desc:"Fast & economical" },
      { id:"gpt-4o", label:"4o", desc:"Smarter, default" },
    ]
  },
  { id:"gemini", name:"Gemini (Google)", emoji:"✨", hint:"aistudio.google.com → API Keys", placeholder:"AIza…", color:AMBER,
    models:[
      { id:"gemini-1.5-flash", label:"Flash", desc:"Fast & economical" },
      { id:"gemini-1.5-pro", label:"Pro", desc:"Smarter, default" },
    ]
  },
  { id:"gemma", name:"Local Gemma (Ollama)", emoji:"🦙", hint:"Ollama local server at http://localhost:11434", placeholder:"(No API key required)", color:BLUE,
    models:[
      { id:"gemma", label:"Gemma", desc:"Local Gemma model" }
    ]
  },
];
const FLOW_STEPS = ["email","verify","profile","llm"];
const SIM_CODE = "4827";

function parseDob(str) {
  if (!str) return null;
  if (str.includes("/")) {
    const [d,m,y] = str.split("/");
    if (!d||!m||!y||y.length<4) return null;
    return new Date(+y, +m-1, +d);
  }
  const d = new Date(str);
  return isNaN(d) ? null : d;
}
function getAgeMonths(dob) {
  const d = parseDob(dob);
  if (!d) return 0;
  const now = new Date();
  return (now.getFullYear()-d.getFullYear())*12 + now.getMonth()-d.getMonth();
}
function getAgeLabel(dob) {
  const m = getAgeMonths(dob);
  if (m<=0) return "newborn";
  if (m<12) return m+" months";
  return Math.floor(m/12)+"y "+m%12+"m";
}
function formatDobDisplay(str) {
  const d = parseDob(str);
  if (!d) return str;
  return d.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
}
function reactionBadge(r) {
  if (r==="none") return { label:"No allergic reaction", ...MINT };
  if (r==="mild") return { label:"Mild allergic reaction", ...AMBER };
  if (r==="strong") return { label:"Strong allergic reaction", ...RED };
  if (r==="constipation") return { label:"Constipation", ...AMBER };
  if (r==="diarrhea") return { label:"Diarrhea", ...RED };
  if (r==="bloating") return { label:"Bloating", ...AMBER };
  if (r==="spitup") return { label:"Spit-up", ...AMBER };
  return { label:"Reaction", ...AMBER };
}
function riskBadge(r) {
  if (r==="low") return { label:"Low risk", ...MINT };
  if (r==="medium") return { label:"Medium", ...AMBER };
  return { label:"Allergen", ...RED };
}
function buildRoadmap(log, profile) {
  const introduced = new Set(log.map(e=>e.food.trim().toLowerCase()));
  const countByCat = Object.fromEntries(CATEGORIES.map(c=>[c,0]));
  log.forEach(e=>{ if(countByCat[e.category]!==undefined) countByCat[e.category]++; });
  const max = Math.max(...Object.values(countByCat),1);
  const deficit = Object.fromEntries(CATEGORIES.map(c=>[c,max-countByCat[c]]));
  const allergyKw = profile ? profile.allergies : [];
  const riskOrder = {low:0,medium:1,high:2};
  return FOOD_DB
    .filter(f=>!introduced.has(f.food.trim().toLowerCase()) && !allergyKw.some(a=>f.food.toLowerCase().includes(a)))
    .sort((a,b)=>{ const dd=deficit[b.category]-deficit[a.category]; return dd!==0?dd:riskOrder[a.risk]-riskOrder[b.risk]; })
    .slice(0,12)
    .map((item,i)=>({ ...item, week:i<2?"This week":i<5?"Week 2":i<8?"Week 3":"Week 4", deficit:deficit[item.category] }));
}

// ─── Food log compression: turns verbose per-entry log into 2 compact lines ───
function compressFoodLog(log) {
  const tolerated = log.filter(e=>e.reaction==="none").map(e=>e.food);
  const reacted   = log.filter(e=>e.reaction!=="none").map(e=>{
    const note = e.notes ? ` (${e.notes})` : "";
    return `${e.food} [${e.reaction}${note}]`;
  });
  const lines = [];
  if (tolerated.length) lines.push("Tolerated foods: "+tolerated.join(", "));
  if (reacted.length)   lines.push("Foods with reactions: "+reacted.join(", "));
  return lines.length ? lines.join("\n") : "No foods logged yet.";
}

const baseInput = { width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid "+ACCENT_LIGHT, fontSize:14, background:"#fff", color:TEXT_PRIMARY, boxSizing:"border-box", marginTop:6, outline:"none" };

function PrimaryBtn({children,onClick,disabled}) {
  return <button onClick={onClick} disabled={disabled} style={{ width:"100%", padding:"13px 20px", borderRadius:24, border:"none", background:disabled?"#f0e6da":ACCENT, color:disabled?"#bba48f":"#fff", fontSize:14, fontWeight:600, cursor:disabled?"not-allowed":"pointer", marginTop:8, boxShadow: disabled?"none":"0 4px 14px rgba(244,137,74,0.35)" }}>{children}</button>;
}
function GhostBtn({children,onClick}) {
  return <button onClick={onClick} style={{ width:"100%", padding:"13px 20px", borderRadius:24, border:"1px solid "+ACCENT_LIGHT, background:"transparent", color:TEXT_SEC, fontSize:14, cursor:"pointer", marginTop:8 }}>{children}</button>;
}
function Badge({label,bg,border,color}) {
  return <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, background:bg, border:"0.5px solid "+border, color, whiteSpace:"nowrap" }}>{label}</span>;
}
function FoodAvatar({ emoji, size=44 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:ACCENT_LIGHT, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.5, flexShrink:0, boxShadow:`-3px -3px 8px ${SHADOW_LIGHT}, 3px 3px 8px ${SHADOW_DARK}` }}>
      {emoji}
    </div>
  );
}

function ProductSheet({ entry, onClose, onAskAI }) {
  let f = null;
  let enriched = null;
  if (typeof entry === "string") {
    f = FOOD_DB.find(x=>x.food===entry);
  } else if (entry && entry.isUnknown && entry.enrichedDescription) {
    enriched = entry;
    f = { food:entry.food, emoji:entry.emoji, category:entry.category };
  } else if (entry && entry.food) {
    f = FOOD_DB.find(x=>x.food===entry.food);
    if (!f) f = { food:entry.food, emoji:entry.emoji||"🍽️", category:entry.category||"vegetable" };
  }
  if (!f) return null;
  const cc = CAT_COLORS[f.category]||MINT;
  const dbEntry = FOOD_DB.find(x=>x.food===f.food);
  const rb = dbEntry ? riskBadge(dbEntry.risk) : null;
  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(92,61,30,0.30)", zIndex:100, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:BG, borderRadius:"20px 20px 0 0", width:"100%", maxHeight:"80%", overflowY:"auto", padding:"20px 18px 28px" }}>
        <div style={{ width:36, height:4, borderRadius:2, background:ACCENT_LIGHT, margin:"0 auto 16px" }} />
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <FoodAvatar emoji={f.emoji} size={56} />
          <div>
            <div style={{ fontSize:20, fontWeight:700, color:TEXT_PRIMARY }}>{f.food}</div>
            <div style={{ display:"flex", gap:6, marginTop:4, flexWrap:"wrap" }}>
              <Badge label={CAT_LABELS[f.category]||f.category} {...cc} />
              {rb && <Badge label={rb.label} bg={rb.bg} border={rb.border} color={rb.color} />}
              {dbEntry?.gasRisk && <Badge label="⚠️ Gas risk" bg={AMBER.bg} border={AMBER.border} color={AMBER.text} />}
              {enriched && <Badge label="AI enriched" bg="#FFF4E8" border="#F7C29B" color="#B45A19" />}
            </div>
          </div>
        </div>
        {enriched ? (
          <div style={{ fontSize:14, color:"#7A5A3A", lineHeight:1.6, marginBottom:16 }}>{enriched.enrichedDescription}</div>
        ) : dbEntry ? (
          <>
            <div style={{ fontSize:14, color:"#7A5A3A", lineHeight:1.6, marginBottom:16 }}>{dbEntry.desc}</div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:700, color:TEXT_SEC, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Key nutrients</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {dbEntry.nutrients.map(n=><span key={n} style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:cc.bg, border:"0.5px solid "+cc.border, color:cc.text }}>{n}</span>)}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:TEXT_SEC, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Vitamins</div>
              <div style={{ display:"flex", gap:6 }}>
                {dbEntry.vitamins.map(v=><span key={v} style={{ fontSize:13, fontWeight:600, width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:ACCENT_LIGHT, color:ACCENT }}>{v}</span>)}
              </div>
            </div>
            <div style={{ fontSize:13, color:"#8A6A48", background:"#fff", borderRadius:10, padding:"10px 12px" }}>
              <span style={{ fontWeight:600 }}>💡 Tip: </span>{dbEntry.tip}
            </div>
          </>
        ) : (
          <div style={{ fontSize:14, color:"#7A5A3A", lineHeight:1.6 }}>No details available yet for this food. Try tapping "Enrich descriptions" in the Log tab.</div>
        )}
        <div style={{ display:"flex", gap:8, marginTop:16 }}>
          {onAskAI && (
            <button onClick={()=>{ onAskAI(`How do I prepare ${f.food} for my baby? Include cooking method, time, and ideal texture.`); onClose(); }}
              style={{ flex:1, padding:"12px", borderRadius:24, border:"none", background:ACCENT, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              🤖 How to prepare this?
            </button>
          )}
          <button onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:24, border:"none", background:ACCENT_LIGHT, color:ACCENT, fontSize:14, fontWeight:600, cursor:"pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function RoadmapTab({ log, profile, onOpenProduct }) {
  const roadmap = buildRoadmap(log, profile);
  const todayFood = roadmap[0];
  const tomorrowFood = roadmap[1];
  const rest = roadmap.slice(2);
  let lastWeek = null;

  return (
    <div>
      {(todayFood || tomorrowFood) && (
        <div style={{ ...neu(20), padding:"18px 18px 14px", marginBottom:14 }}>
          {todayFood && (
            <>
              <div style={{ fontSize:11, fontWeight:700, color:TEXT_HINT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>🍽️ Introduce today</div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <FoodAvatar emoji={todayFood.emoji} size={60} />
                <div style={{ flex:1 }}>
                  <button onClick={()=>onOpenProduct(todayFood)} style={{ fontSize:17, fontWeight:700, color:TEXT_PRIMARY, background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left" }}>{todayFood.food}</button>
                  <div style={{ fontSize:12, color:TEXT_SEC, marginTop:2, lineHeight:1.4 }}>{todayFood.tip}</div>
                  <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                    {todayFood.nutrients.slice(0,2).map(n=><span key={n} style={{ fontSize:10, padding:"3px 8px", borderRadius:20, background:ACCENT_LIGHT, color:ACCENT, fontWeight:600 }}>{n}</span>)}
                  </div>
                </div>
              </div>
            </>
          )}
          {tomorrowFood && (
            <>
              <div style={{ height:1, background:`linear-gradient(90deg,transparent,${SHADOW_DARK},transparent)`, margin:"14px 0" }} />
              <div style={{ fontSize:11, fontWeight:700, color:TEXT_HINT, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>📅 Tomorrow</div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <FoodAvatar emoji={tomorrowFood.emoji} size={52} />
                <div style={{ flex:1 }}>
                  <button onClick={()=>onOpenProduct(tomorrowFood)} style={{ fontSize:15, fontWeight:600, color:TEXT_PRIMARY, background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left" }}>{tomorrowFood.food}</button>
                  <div style={{ fontSize:12, color:TEXT_SEC, marginTop:1 }}>{tomorrowFood.tip}</div>
                  <div style={{ display:"flex", gap:6, marginTop:7, flexWrap:"wrap" }}>
                    {tomorrowFood.nutrients.slice(0,2).map(n=><span key={n} style={{ fontSize:10, padding:"3px 8px", borderRadius:20, background:ACCENT_LIGHT, color:ACCENT, fontWeight:600 }}>{n}</span>)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <div style={{ ...neu(20), padding:"16px 18px", marginBottom:14 }}>
        <div style={{ fontSize:12, fontWeight:700, color:TEXT_PRIMARY, marginBottom:12 }}>Category balance</div>
        {CATEGORIES.map(cat=>{
          const count=log.filter(e=>e.category===cat).length;
          const maxC=Math.max(...CATEGORIES.map(c=>log.filter(e=>e.category===c).length),1);
          return (
            <div key={cat} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ width:76, fontSize:11, color:TEXT_SEC }}>{CAT_EMOJI[cat]} {CAT_LABELS[cat]}</div>
              <div style={{ flex:1, height:6, borderRadius:3, ...neuInset(3) }}>
                <div style={{ width:(count/maxC*100)+"%", height:"100%", borderRadius:3, background:ACCENT, transition:"width 0.4s" }} />
              </div>
              <div style={{ fontSize:11, color:TEXT_HINT, width:14, textAlign:"right" }}>{count}</div>
            </div>
          );
        })}
      </div>
      {rest.map((item,i)=>{
        const showWeek = item.week!==lastWeek; lastWeek=item.week;
        const rb = riskBadge(item.risk); const cc = CAT_COLORS[item.category];
        return (
          <div key={i}>
            {showWeek && <div style={{ fontSize:11, fontWeight:700, color:TEXT_HINT, marginBottom:8, marginTop:i===0?2:14, textTransform:"uppercase", letterSpacing:"0.08em", paddingLeft:4 }}>{item.week}</div>}
            <div style={{ ...neu(16,6), padding:"12px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
              <FoodAvatar emoji={item.emoji} size={44} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
                  <button onClick={()=>onOpenProduct(item)} style={{ fontWeight:600, fontSize:14, color:TEXT_PRIMARY, background:"none", border:"none", cursor:"pointer", padding:0 }}>{item.food}</button>
                  <Badge label={CAT_LABELS[item.category]} {...cc} />
                  {item.deficit>0 && <Badge label="↑ needs balance" {...LAV} />}
                </div>
                <div style={{ fontSize:12, color:TEXT_SEC }}>{item.tip}</div>
              </div>
              <Badge label={rb.label} bg={rb.bg} border={rb.border} color={rb.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LogTab({ log, setLog, onOpenProduct }) {
  const [showAdd, setShowAdd] = useState(false);
  const [entry, setEntry] = useState({ food:"", emoji:"🍽️", category:"vegetable", reaction:"none", notes:"" });
  const [suggestions, setSuggestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [enriching, setEnriching] = useState(false);

  const handleFoodInput = (val) => {
    setEntry(n=>({...n, food:val}));
    setError("");
    if (val.length<1) { setSuggestions([]); return; }
    const matches = FOOD_DB.filter(f=>f.food.toLowerCase().includes(val.toLowerCase())).slice(0,5);
    setSuggestions(matches);
  };
  const pickSuggestion = (f) => {
    setEntry(n=>({...n, food:f.food, emoji:f.emoji, category:f.category}));
    setSuggestions([]);
    setError("");
  };
  const normalizeFood = (food) => food.trim().toLowerCase();
  const isDuplicateFood = (food, currentId) => {
    const normalized = normalizeFood(food);
    return log.some(item=>item.food.trim().toLowerCase()===normalized && item.id!==currentId);
  };
  const isUnknownFood = (food) => !FOOD_DB.some(item=>normalizeFood(item.food)===normalizeFood(food));
  const resetForm = () => {
    setEntry({ food:"", emoji:"🍽️", category:"vegetable", reaction:"none", notes:"" });
    setSuggestions([]);
    setEditingId(null);
    setError("");
    setShowAdd(false);
  };
  const getMockEnrichment = (item) => {
    const category = item.category ? CAT_LABELS[item.category].toLowerCase().replace(/s$/,"") : "food";
    return `Demo enrichment for ${item.food}: this ${category} can be introduced in small, soft portions and is generally gentle on baby tummies. Track notes and adjust texture based on response.`;
  };
  const enrichUnknownFoods = () => {
    if (!log.some(item=>item.isUnknown)) return;
    setEnriching(true);
    window.setTimeout(()=>{
      setLog(currentLog=>currentLog.map(item=>item.isUnknown ? { ...item, enrichedDescription: item.enrichedDescription || getMockEnrichment(item) } : item));
      setEnriching(false);
    }, 500);
  };
  const saveEntry = () => {
    if (!entry.food.trim()) { setError("Please enter a food name."); return; }
    if (isDuplicateFood(entry.food, editingId)) { setError("This food is already logged. Duplicate entries are not allowed."); return; }
    const unknown = isUnknownFood(entry.food);
    const newEntry = { ...entry, id:editingId||Date.now(), date:new Date().toISOString().slice(0,10), isUnknown:unknown };
    setLog(l=>editingId ? l.map(item=>item.id===editingId ? {...item,...newEntry,date:item.date} : item) : [newEntry,...l]);
    resetForm();
  };
  const editEntry = (item) => {
    setEntry({ food:item.food, emoji:item.emoji, category:item.category, reaction:item.reaction, notes:item.notes });
    setEditingId(item.id);
    setShowAdd(true);
    setError("");
  };

  return (
    <div>
      <button onClick={()=>setShowAdd(s=>!s)} style={{ ...neu(16,6), width:"100%", marginBottom:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", textAlign:"left", border:"none" }}>
        <div style={{ width:44, height:44, borderRadius:"50%", ...neuInset(22), display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:ACCENT }}>+</div>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:ACCENT }}>Log a new food</div>
          <div style={{ fontSize:12, color:TEXT_SEC, marginTop:1 }}>Tap to add today's meal</div>
        </div>
      </button>
      {showAdd && (
        <div style={{ ...neu(16,6), background:"#fff", marginBottom:12, padding:"14px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:ACCENT, marginBottom:10 }}>{editingId?"Edit food entry":"New food entry"}</div>
          {error && <div style={{ fontSize:12, color:RED.text, background:RED.bg, border:"1px solid "+RED.border, borderRadius:8, padding:"10px 12px", marginBottom:10 }}>{error}</div>}
          <div style={{ position:"relative" }}>
            <input placeholder="Food name — start typing to search…" value={entry.food}
              onChange={e=>handleFoodInput(e.target.value)}
              style={{ ...baseInput, marginBottom:suggestions.length?0:8 }} />
            {suggestions.length>0 && (
              <div style={{ background:"#fff", border:"1px solid "+ACCENT_LIGHT, borderRadius:8, overflow:"hidden", marginBottom:8, boxShadow:"0 4px 12px rgba(180,140,100,0.15)" }}>
                {suggestions.map(f=>(
                  <div key={f.food} onClick={()=>pickSuggestion(f)}
                    style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", cursor:"pointer", borderBottom:"0.5px solid #f5ede3" }}
                    onMouseEnter={e=>e.currentTarget.style.background=ACCENT_LIGHT}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <span style={{ fontSize:20 }}>{f.emoji}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:TEXT_PRIMARY }}>{f.food}</div>
                      <div style={{ fontSize:11, color:TEXT_SEC }}>{CAT_LABELS[f.category]} · {f.nutrients.slice(0,2).join(", ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <select value={entry.category} onChange={e=>setEntry(n=>({...n,category:e.target.value}))} style={{ ...baseInput, marginBottom:8 }}>
            {CATEGORIES.map(c=><option key={c} value={c}>{CAT_EMOJI[c]+" "+CAT_LABELS[c]}</option>)}
          </select>
          <select value={entry.reaction} onChange={e=>setEntry(n=>({...n,reaction:e.target.value}))} style={{ ...baseInput, marginBottom:8 }}>
            {REACTION_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input placeholder="Notes (optional)" value={entry.notes} onChange={e=>setEntry(n=>({...n,notes:e.target.value}))} style={{ ...baseInput, marginBottom:10 }} />
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={saveEntry} style={{ flex:1, padding:10, borderRadius:20, background:ACCENT, border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Save</button>
            <button onClick={resetForm} style={{ flex:1, padding:10, borderRadius:20, background:ACCENT_LIGHT, border:"none", color:ACCENT, fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ marginBottom:12, display:"flex", gap:10, alignItems:"center" }}>
        <button onClick={enrichUnknownFoods}
          disabled={enriching || !log.some(item=>item.isUnknown && !item.enrichedDescription)}
          style={{ flex:1, padding:12, borderRadius:20, background:enriching?"#f0e6da":ACCENT, border:"none", color:enriching?"#b89f80":"#fff", fontSize:13, fontWeight:700, cursor:enriching?"not-allowed":"pointer" }}>
          {enriching?"Enriching…":"Enrich descriptions (demo)"}
        </button>
        <div style={{ fontSize:12, color:TEXT_SEC, lineHeight:1.4 }}>
          {log.some(item=>item.isUnknown) ? `${log.filter(item=>item.isUnknown).length} food(s) need enrichment` : "No unknown foods yet"}
        </div>
      </div>
      {log.map(e=>{
        const rb=reactionBadge(e.reaction); const cc=CAT_COLORS[e.category]||MINT;
        return (
          <div key={e.id} style={{ ...neu(16,6), padding:"12px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
            <FoodAvatar emoji={e.emoji} size={48} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
                <button onClick={()=>onOpenProduct(e)} style={{ fontWeight:600, fontSize:14, color:TEXT_PRIMARY, background:"none", border:"none", cursor:"pointer", padding:0 }}>{e.food}</button>
                <Badge label={rb.label} bg={rb.bg} border={rb.border} color={rb.color} />
                {e.category && <Badge label={CAT_LABELS[e.category]} {...cc} />}
                {e.isUnknown && !e.enrichedDescription && <Badge label="Needs enrichment" bg="#FFF4E8" border="#F7C29B" color="#B45A19" />}
              </div>
              {e.notes && <div style={{ fontSize:12, color:TEXT_SEC }}>{e.notes}</div>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
              <div style={{ fontSize:11, color:TEXT_HINT }}>{e.date}</div>
              <button onClick={()=>editEntry(e)} style={{ fontSize:11, color:ACCENT, background:"none", border:"none", cursor:"pointer", padding:0 }}>Edit</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SUMMARY_EVERY = 10; // summarise after every N new turns

function ChatTab({ log, profile, llmConfig, onSendPreset }) {
  const WELCOME = { role:"assistant", text:"Hi! I'm your Growing Taste AI 🍑 I know your baby's profile and food history. Ask me anything about weaning!" };
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("gt_chat_messages");
      if (saved) return JSON.parse(saved);
    } catch (e) { console.error("Error reading chat history", e); }
    return [WELCOME];
  });
  const [summary, setSummary] = useState(() => localStorage.getItem("gt_chat_summary") || "");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Persist messages
  useEffect(() => {
    try { localStorage.setItem("gt_chat_messages", JSON.stringify(messages)); }
    catch (e) { console.error("Error saving chat history", e); }
  }, [messages]);

  // Persist summary
  useEffect(() => {
    try { localStorage.setItem("gt_chat_summary", summary); }
    catch (e) {}
  }, [summary]);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  // If parent sends a preset question (e.g. from ProductSheet), fire it
  const presetRef = useRef(null);
  useEffect(() => {
    if (onSendPreset && onSendPreset !== presetRef.current) {
      presetRef.current = onSendPreset;
      send(onSendPreset);
    }
  }, [onSendPreset]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearChat = () => {
    setMessages([WELCOME]);
    setSummary("");
    localStorage.removeItem("gt_chat_messages");
    localStorage.removeItem("gt_chat_summary");
  };

  // ── Build system prompt ────────────────────────────────────────────────────
  const buildSystemPrompt = (currentSummary) => {
    const allergiesStr = profile.allergies.length ? profile.allergies.join(", ") : "none";
    const ageMonths = getAgeMonths(profile.dob);
    const compressedLog = compressFoodLog(log);
    const gasRiskFoods = log
      .filter(e => { const db = FOOD_DB.find(f=>f.food===e.food); return db?.gasRisk; })
      .map(e=>e.food).join(", ") || "none";

    return [
      `You are the Growing Taste AI, a warm, professional, expert assistant for baby weaning.`,
      ``,
      `Baby Profile:`,
      `- Name: ${profile.name}`,
      `- Age: ${getAgeLabel(profile.dob)} (${ageMonths} months old)`,
      `- Feeding Style: ${FEEDING_LABELS[profile.feedingStyle]}`,
      `- Allergies: ${allergiesStr}`,
      ``,
      `Food Log (compressed):`,
      compressedLog,
      `Gas-risk foods already introduced: ${gasRiskFoods}`,
      ``,
      currentSummary ? `[Conversation so far]\n${currentSummary}\n[End of summary]\n` : "",
      `CRITICAL SAFETY & ROLE BOUNDARIES (Strictly Enforced):`,
      `1. SAFETY & WHO COMPLIANCE: Follow WHO guidelines. Never recommend solid foods before 6 months. Baby is ${ageMonths} months old.`,
      `2. ALLERGY GUARDRAILS: Never suggest foods containing or derived from known allergies (${allergiesStr}).`,
      `3. REACTION AWARENESS: You may recommend foods that previously caused a reaction, but MUST mention the past reaction as a clear warning/sidenote.`,
      `4. ALLERGEN SPACING: When building introduction plans, space potential allergens at least 3 days apart from each other. When asked what to try next, suggest 2–3 foods considering what has already been introduced.`,
      `5. COOKING & TEXTURE: When discussing food preparation, always mention: (a) recommended cooking method, (b) approximate cooking time, (c) target texture appropriate for the baby's age (${ageMonths} months).`,
      `6. SYMPTOM REASONING: When a parent describes a physical symptom (rash, red cheeks, gas, bloating), reason through common non-allergic causes first (e.g. carotene colouration, fruit acids, high-fibre foods) before suggesting an immune/allergic reaction. Distinguish cosmetic reactions from immune reactions clearly.`,
      `7. GAS-RISK FOODS: Broccoli, cauliflower, lentils, beans and similar foods carry a gas risk. Always advise starting with minimal portions and increasing gradually.`,
      `8. ROLE LIMIT: You are strictly a baby weaning and infant nutrition assistant. Politely decline unrelated questions.`,
      `9. STYLE: Be warm, empathetic, concise, under 130 words. Tailor to the baby's feeding style and age.`,
    ].join("\n");
  };

  // ── Background summarisation (fires silently after every SUMMARY_EVERY turns) ─
  const triggerSummarise = async (recentMessages, currentSummary) => {
    if (!llmConfig?.apiKey && llmConfig?.provider !== "gemma") return; // skip in demo mode
    const older = recentMessages.slice(0, -SUMMARY_EVERY);
    if (!older.length) return;
    const toSummarise = older.map(m=>`${m.role}: ${m.text}`).join("\n");
    const summaryPrompt = `You are a helpful assistant. Summarise the following weaning chat conversation in 3–5 bullet points, preserving key facts, decisions, and any foods or symptoms discussed. Be concise.\n\nPrevious summary:\n${currentSummary || "(none)"}\n\nConversation:\n${toSummarise}`;
    try {
      let newSummary = null;
      if (llmConfig?.provider === "gemma") {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: llmConfig?.model || "gemma",
            messages: [
              { role: "system", content: "You are a concise summariser." },
              { role: "user", content: summaryPrompt }
            ],
            stream: false
          })
        });
        const data = await res.json();
        newSummary = data.message?.content;
      } else {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            model: "claude-haiku-3-5-20241022", // always use cheapest model for summarisation
            max_tokens: 300,
            system: "You are a concise summariser.",
            messages: [{ role:"user", content: summaryPrompt }]
          })
        });
        const data = await res.json();
        newSummary = data.content?.[0]?.text;
      }
      if (newSummary) setSummary(newSummary);
    } catch { /* silent fail */ }
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const send = async (override) => {
    const userMsg = (override||input).trim();
    if (!userMsg||loading) return;
    setInput("");
    setMessages(m=>[...m,{role:"user",text:userMsg}]);
    setLoading(true);

    const systemPromptText = buildSystemPrompt(summary);
    // Keep only the last SUMMARY_EVERY turns for the API call (sliding window)
    const windowMessages = messages.filter((_,i)=>i>0).slice(-SUMMARY_EVERY);

    const provider = llmConfig?.provider || "claude";

    try {
      let reply = "";
      if (provider === "gemma") {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: llmConfig?.model || "gemma",
            messages: [
              { role: "system", content: systemPromptText },
              ...windowMessages.map(m=>({role:m.role, content:m.text})),
              { role: "user", content: userMsg }
            ],
            stream: false
          })
        });
        const data = await res.json();
        if (data.error) {
          reply = `Ollama Error: ${data.error}`;
        } else if (!res.ok) {
          reply = `Ollama connection failed with status ${res.status}`;
        } else {
          reply = data.message?.content || "Sorry, try again! (Empty response from Ollama)";
        }
      } else {
        const isClaudeProvider = provider === "claude";
        const systemPayload = isClaudeProvider
          ? [{ type:"text", text: systemPromptText, cache_control: { type:"ephemeral" } }]
          : systemPromptText;

        const model = llmConfig?.model || "claude-sonnet-4-20250514";
        const apiKey = llmConfig?.apiKey || null;
        const headers = { "Content-Type":"application/json" };
        if (apiKey) headers["x-api-key"] = apiKey;
        // Anthropic also requires the version header
        if (isClaudeProvider) headers["anthropic-version"] = "2023-06-01";
        // Enable prompt caching beta for Claude
        if (isClaudeProvider) headers["anthropic-beta"] = "prompt-caching-2024-07-31";

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers,
          body: JSON.stringify({
            model,
            max_tokens: 1000,
            system: systemPayload,
            messages: windowMessages
              .map(m=>({role:m.role, content:m.text}))
              .concat([{role:"user", content:userMsg}])
          })
        });
        const data = await res.json();
        reply = data.content?.[0]?.text || "Sorry, try again!";
      }
      setMessages(m => {
        const updated = [...m, {role:"assistant", text:reply}];
        // Trigger background summarisation if we've crossed a SUMMARY_EVERY boundary
        const turnCount = updated.filter(x=>x.role==="user").length;
        if (turnCount > 0 && turnCount % SUMMARY_EVERY === 0) {
          triggerSummarise(updated, summary);
        }
        return updated;
      });
    } catch {
      setMessages(m=>[...m,{role:"assistant",text:"Connection error."}]);
    }
    setLoading(false);
  };

  const CHIPS = [
    "What should we try next?",
    "How to cook this safely?",
    "Why the red cheeks?",
    "Could this cause gas?",
    "Plan this week's menu",
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ flex:1, overflowY:"auto", paddingBottom:8 }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:8 }}>
            <div style={{ maxWidth:"82%", padding:"10px 14px", fontSize:13, lineHeight:1.5,
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              background:m.role==="user"?ACCENT:"#fff",
              color:m.role==="user"?"#fff":TEXT_PRIMARY,
              boxShadow: m.role==="user" ? "none" : `-3px -3px 8px ${SHADOW_LIGHT}, 3px 3px 8px ${SHADOW_DARK}` }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ display:"flex", justifyContent:"flex-start", marginBottom:8 }}><div style={{ padding:"10px 14px", borderRadius:"16px 16px 16px 4px", background:"#fff", fontSize:13, color:TEXT_SEC, boxShadow:`-3px -3px 8px ${SHADOW_LIGHT}, 3px 3px 8px ${SHADOW_DARK}` }}>Thinking…</div></div>}
        <div ref={endRef} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, width:"100%" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", flex:1 }}>
          {CHIPS.map(q=>(
            <button key={q} onClick={()=>send(q)} style={{ ...neu(20,4), fontSize:10, padding:"5px 10px", border:"none", color:TEXT_SEC, cursor:"pointer" }}>{q}</button>
          ))}
        </div>
        <button onClick={clearChat} style={{ background:"none", border:"none", color:TEXT_SEC, fontSize:11, cursor:"pointer", padding:"6px 12px", flexShrink:0 }}>Clear</button>
      </div>
      <div style={{ ...neuInset(24), padding:"4px 6px 4px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about weaning…"
          style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:13, color:TEXT_PRIMARY, padding:"10px 0" }} />
        <button onClick={()=>send()} style={{ ...neu(18,4), width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:ACCENT, fontSize:16, border:"none", flexShrink:0 }}>↑</button>
      </div>
    </div>
  );
}

function ProfileTab({ profile, setProfile }) {
  const [draft, setDraft] = useState(null);
  const p = draft||profile; const editing=!!draft;
  const ageM = getAgeMonths(p.dob);
  return (
    <div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:16 }}>
        <div style={{ width:72, height:72, borderRadius:"50%", ...neuInset(36), display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:8 }}>👶</div>
        {editing
          ? <input value={p.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} style={{ textAlign:"center", fontWeight:700, fontSize:18, border:"none", borderBottom:"1px solid "+ACCENT_LIGHT, background:"transparent", color:TEXT_PRIMARY, width:140, outline:"none" }} />
          : <div style={{ fontSize:18, fontWeight:700, color:TEXT_PRIMARY }}>{p.name}</div>}
        <div style={{ fontSize:13, color:TEXT_SEC, marginTop:2 }}>{getAgeLabel(p.dob)}</div>
      </div>
      <div style={{ ...neu(16,6), padding:"13px 16px", marginBottom:10 }}>
        <div style={{ fontSize:11, color:TEXT_SEC, marginBottom:4 }}>Date of birth</div>
        {editing
          ? <input type="text" placeholder="DD/MM/YYYY" value={p.dob} onChange={e=>{ let v=e.target.value.replace(/\D/g,""); if(v.length>2)v=v.slice(0,2)+"/"+v.slice(2); if(v.length>5)v=v.slice(0,5)+"/"+v.slice(5); setDraft(d=>({...d,dob:v.slice(0,10)})); }} style={{ ...baseInput, marginTop:0 }} />
          : <div style={{ fontSize:14, color:TEXT_PRIMARY }}>{formatDobDisplay(p.dob)}</div>}
        {ageM<6 && <div style={{ marginTop:6, fontSize:12, padding:"4px 10px", borderRadius:6, ...AMBER }}>WHO recommends starting solids at 6 months</div>}
        {ageM>=6 && ageM<12 && <div style={{ marginTop:6, fontSize:12, padding:"4px 10px", borderRadius:6, ...MINT }}>Great age for weaning — exploring textures!</div>}
      </div>
      <div style={{ ...neu(16,6), padding:"13px 16px", marginBottom:10 }}>
        <div style={{ fontSize:11, color:TEXT_SEC, marginBottom:8 }}>Feeding style</div>
        {Object.entries(FEEDING_LABELS).map(([val,label])=>(
          <button key={val} onClick={()=>editing&&setDraft(d=>({...d,feedingStyle:val}))}
            style={{ width:"100%", textAlign:"left", padding:"9px 12px", borderRadius:10, fontSize:13, cursor:editing?"pointer":"default", marginBottom:6,
              background:p.feedingStyle===val?ACCENT_LIGHT:"transparent",
              border:p.feedingStyle===val?"1.5px solid "+ACCENT:"1px solid #f0e0d0",
              color:p.feedingStyle===val?ACCENT:TEXT_SEC, fontWeight:p.feedingStyle===val?700:400 }}>
            {val==="puree"?"🥣":val==="blw"?"✋":"🍽️"} {label}
          </button>
        ))}
      </div>
      <div style={{ ...neu(16,6), padding:"13px 16px", marginBottom:10 }}>
        <div style={{ fontSize:11, color:TEXT_SEC, marginBottom:8 }}>Known allergies</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {ALLERGY_OPTIONS.map(a=>{ const sel=p.allergies.includes(a); return (
            <button key={a} onClick={()=>editing&&setDraft(d=>({...d,allergies:sel?d.allergies.filter(x=>x!==a):[...d.allergies,a]}))}
              style={{ fontSize:12, padding:"5px 12px", borderRadius:20, cursor:editing?"pointer":"default", background:sel?RED.bg:"transparent", border:sel?"1px solid "+RED.border:"1px solid #f0e0d0", color:sel?RED.text:TEXT_SEC, fontWeight:sel?600:400 }}>
              {a}
            </button>
          ); })}
        </div>
      </div>
      <div style={{ ...neu(16,6), padding:"13px 16px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:TEXT_PRIMARY }}>Family allergy history</div>
            <div style={{ fontSize:12, color:TEXT_SEC }}>Parent or sibling with allergies</div>
          </div>
          <button onClick={()=>editing&&setDraft(d=>({...d,familyAllergy:!d.familyAllergy}))}
            style={{ width:44, height:24, borderRadius:12, border:"none", cursor:editing?"pointer":"default", background:p.familyAllergy?ACCENT:"#f0e0d0", position:"relative" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:"white", position:"absolute", top:3, left:p.familyAllergy?23:3, transition:"left 0.2s" }} />
          </button>
        </div>
        {p.familyAllergy && <div style={{ marginTop:8, fontSize:12, padding:"4px 10px", borderRadius:6, ...AMBER }}>Allergens will be introduced extra cautiously</div>}
      </div>
      {editing
        ? <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <button onClick={()=>{setProfile(draft);setDraft(null);}} style={{ flex:1, padding:12, borderRadius:20, background:ACCENT, border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>Save</button>
            <button onClick={()=>setDraft(null)} style={{ flex:1, padding:12, borderRadius:20, background:ACCENT_LIGHT, border:"none", color:ACCENT, fontSize:14, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          </div>
        : <button onClick={()=>setDraft({...profile})} style={{ width:"100%", marginBottom:16, padding:12, borderRadius:20, background:ACCENT_LIGHT, border:"none", color:ACCENT, fontSize:14, fontWeight:700, cursor:"pointer" }}>Edit profile</button>}
    </div>
  );
}

const NAV = [["📍","Roadmap"],["📓","Log"],["🤖","AI Chat"],["👶","Profile"]];

function MainApp({ initProfile, llmConfig, onSignOut }) {
  const [tab, setTab]         = useState(0);
  const [log, setLog]         = useState(INITIAL_LOG);
  const [profile, setProfile] = useState(initProfile);
  const [productSheet, setProductSheet] = useState(null);
  const [chatPreset, setChatPreset] = useState(null);

  const handleAskAI = (question) => {
    setChatPreset(question + "__" + Date.now()); // unique key forces re-fire
    setTab(2);
  };

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:380, margin:"0 auto", display:"flex", flexDirection:"column", height:640, position:"relative", background:BG }}>
      <div style={{ padding:"16px 18px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #F5DEC8" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ ...neu(16,5), width:42, height:42, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
            <img src="/icon.png" style={{ width:42, height:42, borderRadius:14, objectFit:"cover" }} alt="Growing Taste" />
          </div>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:TEXT_PRIMARY, letterSpacing:"-0.3px" }}>Growing Taste</div>
            <div style={{ fontSize:11, color:TEXT_SEC }}>{"Hi "+profile.name+" 👋  "+getAgeLabel(profile.dob)+" · "+FEEDING_LABELS[profile.feedingStyle]}</div>
          </div>
        </div>
        <button onClick={onSignOut} style={{ ...neu(20,4), fontSize:11, color:TEXT_SEC, border:"none", padding:"6px 12px", cursor:"pointer" }}>Sign out</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"6px 18px 0" }}>
        {tab===0 && <RoadmapTab log={log} profile={profile} onOpenProduct={setProductSheet} />}
        {tab===1 && <LogTab log={log} setLog={setLog} onOpenProduct={setProductSheet} />}
        {tab===2 && <ChatTab log={log} profile={profile} llmConfig={llmConfig} onSendPreset={chatPreset} />}
        {tab===3 && <ProfileTab profile={profile} setProfile={p=>setProfile(p)} />}
      </div>

      <div style={{ display:"flex", gap:8, padding:"12px 18px 18px", background:"#FFF6EE", borderTop:"1px solid #F5DEC8", boxShadow:`0 -4px 16px rgba(214,178,140,0.18)` }}>
        {NAV.map(([icon,label],i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{ ...neuBtn(tab===i), flex:1, padding:"9px 4px", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontSize:10, fontWeight:600 }}>
            <span style={{ fontSize:16 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {productSheet && <ProductSheet entry={productSheet} onClose={()=>setProductSheet(null)} onAskAI={handleAskAI} />}
    </div>
  );
}

function OnboardingShell({ step, title, subtitle, children }) {
  const idx = FLOW_STEPS.indexOf(step);
  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:380, margin:"0 auto", minHeight:620, display:"flex", flexDirection:"column", background:BG }}>
      <div style={{ padding:"20px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ ...neu(16,5), width:42, height:42, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
            <img src="/icon.png" style={{ width:42, height:42, borderRadius:14, objectFit:"cover" }} alt="Growing Taste" />
          </div>
          <div style={{ fontSize:18, fontWeight:800, color:TEXT_PRIMARY, letterSpacing:"-0.3px" }}>Growing Taste</div>
        </div>
        {idx>=0 && (
          <div style={{ display:"flex", gap:4, marginTop:16 }}>
            {FLOW_STEPS.map((_,i)=>(<div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=idx?ACCENT:ACCENT_LIGHT }} />))}
          </div>
        )}
      </div>
      <div style={{ flex:1, padding:"24px 20px 20px", display:"flex", flexDirection:"column" }}>
        {title    && <div style={{ fontSize:20, fontWeight:700, color:TEXT_PRIMARY, marginBottom:6 }}>{title}</div>}
        {subtitle && <div style={{ fontSize:14, color:TEXT_SEC, lineHeight:1.5, marginBottom:20 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen]     = useState("welcome");
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail]       = useState("");
  const [code, setCode]         = useState(["","","",""]);
  const [codeError, setCE]      = useState(false);
  const [verifying, setVer]     = useState(false);
  const [babyName, setBabyName] = useState("");
  const [dob, setDob]           = useState("");
  const [feedingStyle, setFS]   = useState("mixed");
  const [selectedLLM, setSLLM]  = useState(null);
  const [selectedModel, setSModel] = useState(null);
  const [apiKey, setApiKey]     = useState("");
  const [showKey, setShowKey]   = useState(false);
  const [keyError, setKE]       = useState("");
  const codeRefs = [useRef(),useRef(),useRef(),useRef()];

  function handleCodeChange(i,val) {
    if(!/^\d?$/.test(val))return;
    const next=[...code];next[i]=val;setCode(next);setCE(false);
    if(val&&i<3)codeRefs[i+1].current.focus();
  }
  function handleCodeKey(i,e){ if(e.key==="Backspace"&&!code[i]&&i>0)codeRefs[i-1].current.focus(); }
  function verifyCode(){
    setVer(true);
    setTimeout(()=>{ setVer(false); if(code.join("")===SIM_CODE){ setScreen(isSignIn?"app":"profile"); } else{ setCE(true);setCode(["","","",""]);setTimeout(()=>codeRefs[0].current.focus(),50); } },800);
  }
  function validateKey(){
    setKE("");
    if (selectedLLM !== "gemma") {
      if(!apiKey.trim()){setKE("Please enter your API key.");return;}
      if(selectedLLM==="claude"&&!apiKey.startsWith("sk-ant")){setKE("Claude keys start with sk-ant-api03-");return;}
      if(selectedLLM==="openai"&&!apiKey.startsWith("sk-")){setKE("OpenAI keys start with sk-");return;}
      if(selectedLLM==="gemini"&&!apiKey.startsWith("AIza")){setKE("Gemini keys start with AIza");return;}
    }
    setScreen("app");
  }

  const initProfile = { name:babyName||"Baby", dob:dob||"15/10/2025", feedingStyle:feedingStyle, allergies:[], familyAllergy:false };
  const llmConfig = selectedLLM
    ? { provider: selectedLLM, model: selectedModel || LLM_OPTIONS.find(l=>l.id===selectedLLM)?.models[0]?.id, apiKey }
    : null;

  if(screen==="app") return <MainApp initProfile={initProfile} llmConfig={llmConfig} onSignOut={()=>setScreen("welcome")} />;

  if(screen==="welcome") return (
    <OnboardingShell step="welcome">
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:12 }}>
        <div style={{ ...neu(28,8), width:96, height:96, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, marginBottom:8 }}>
          <img src="/icon.png" style={{ width:96, height:96, borderRadius:28, objectFit:"cover" }} alt="Growing Taste" />
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:TEXT_PRIMARY }}>Welcome to Growing Taste</div>
        <div style={{ fontSize:14, color:TEXT_SEC, lineHeight:1.6, maxWidth:280 }}>Your AI-powered weaning companion. Track foods, spot reactions, and get a personalized roadmap for your baby.</div>
        <div style={{ width:"100%", marginTop:16 }}>
          <PrimaryBtn onClick={()=>{setIsSignIn(false);setScreen("email");}}>Create an account</PrimaryBtn>
          <GhostBtn onClick={()=>{setIsSignIn(true);setScreen("email");}}>Sign in</GhostBtn>
        </div>
        <div style={{ fontSize:12, color:TEXT_HINT, marginTop:8 }}>By continuing you agree to our Terms of Service and Privacy Policy.</div>
      </div>
    </OnboardingShell>
  );

  if(screen==="email") return (
    <OnboardingShell step="email" title={isSignIn?"Sign in":"Create your account"} subtitle="We'll send a 4-digit code to your email to confirm it's you.">
      <label style={{ fontSize:13, color:TEXT_SEC }}>Email address</label>
      <input style={baseInput} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&email.includes("@")&&setScreen("verify")} autoFocus />
      <div style={{ flex:1 }} />
      <PrimaryBtn onClick={()=>setScreen("verify")} disabled={!email.includes("@")}>Send verification code →</PrimaryBtn>
      <GhostBtn onClick={()=>setScreen("welcome")}>← Back</GhostBtn>
    </OnboardingShell>
  );

  if(screen==="verify") return (
    <OnboardingShell step="verify" title="Check your inbox" subtitle={"We sent a 4-digit code to "+email+"."}>
      <div style={{ display:"flex", justifyContent:"center", gap:10, margin:"16px 0" }}>
        {code.map((d,i)=>(
          <input key={i} ref={codeRefs[i]} value={d} maxLength={1} inputMode="numeric"
            onChange={e=>handleCodeChange(i,e.target.value)} onKeyDown={e=>handleCodeKey(i,e)}
            style={{ width:56, height:64, textAlign:"center", fontSize:26, fontWeight:700, borderRadius:14, border:"2px solid "+(codeError?RED.border:d?ACCENT:ACCENT_LIGHT), background:codeError?RED.bg:d?ACCENT_LIGHT:"#fff", color:codeError?RED.text:ACCENT, boxSizing:"border-box", outline:"none" }} />
        ))}
      </div>
      <div style={{ fontSize:13, color:TEXT_SEC, textAlign:"center", padding:"6px 12px", background:"#fff", borderRadius:8 }}>Demo code: <strong style={{ color:ACCENT }}>4827</strong></div>
      {codeError && <div style={{ textAlign:"center", fontSize:13, color:RED.text, background:RED.bg, border:"1px solid "+RED.border, borderRadius:8, padding:10, marginTop:10 }}>Incorrect code — try again</div>}
      <div style={{ flex:1 }} />
      <PrimaryBtn onClick={verifyCode} disabled={code.join("").length<4||verifying}>{verifying?"Verifying…":"Verify →"}</PrimaryBtn>
      <GhostBtn onClick={()=>setScreen("email")}>← Change email</GhostBtn>
    </OnboardingShell>
  );

  if(screen==="profile") return (
    <OnboardingShell step="profile" title="Tell us about your baby" subtitle="Helps us build a personalized weaning roadmap from day one.">
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:13, color:TEXT_SEC }}>Baby's name</label>
        <input style={baseInput} placeholder="e.g. Mia" value={babyName} onChange={e=>setBabyName(e.target.value)} autoFocus />
      </div>
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:13, color:TEXT_SEC }}>Date of birth</label>
        <input style={baseInput} type="text" placeholder="DD/MM/YYYY" value={dob}
          onChange={e=>{ let v=e.target.value.replace(/\D/g,""); if(v.length>2)v=v.slice(0,2)+"/"+v.slice(2); if(v.length>5)v=v.slice(0,5)+"/"+v.slice(5); setDob(v.slice(0,10)); }} />
      </div>
      <div>
        <label style={{ fontSize:13, color:TEXT_SEC, display:"block", marginBottom:8 }}>Feeding approach</label>
        {[["puree","🥣","Purées"],["blw","✋","Baby-led weaning"],["mixed","🍽️","Mixed"]].map(([val,emoji,label])=>(
          <button key={val} onClick={()=>setFS(val)} style={{ width:"100%", textAlign:"left", padding:"10px 14px", borderRadius:12, fontSize:13, cursor:"pointer", marginBottom:6, background:feedingStyle===val?ACCENT_LIGHT:"#fff", border:feedingStyle===val?"2px solid "+ACCENT:"1px solid #f0e0d0", color:feedingStyle===val?ACCENT:TEXT_SEC, fontWeight:feedingStyle===val?700:400 }}>
            {emoji} {label}
          </button>
        ))}
      </div>
      <div style={{ flex:1 }} />
      <PrimaryBtn onClick={()=>setScreen("llm")} disabled={!babyName||dob.length<10}>Continue →</PrimaryBtn>
      <div style={{ fontSize:12, color:TEXT_HINT, textAlign:"center", marginTop:8 }}>You can add allergies and more details later</div>
    </OnboardingShell>
  );

  if(screen==="llm") return (
    <OnboardingShell step="llm" title="Connect your AI" subtitle="Choose your AI provider and model tier. Your key is stored securely on-device.">
      {LLM_OPTIONS.map(llm=>(
        <div key={llm.id} onClick={()=>{setSLLM(llm.id);setSModel(llm.models[1]?.id || llm.models[0]?.id);setApiKey("");setKE("");}}
          style={{ padding:"14px 16px", borderRadius:16, cursor:"pointer", marginBottom:10, border:selectedLLM===llm.id?"2px solid "+ACCENT:"1px solid #f0e0d0", background:selectedLLM===llm.id?ACCENT_LIGHT:"#fff" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:24 }}>{llm.emoji}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:selectedLLM===llm.id?ACCENT:TEXT_PRIMARY }}>{llm.name}</div>
              <div style={{ fontSize:12, color:TEXT_SEC }}>{llm.hint}</div>
            </div>
          </div>
          {selectedLLM===llm.id && (
            <div style={{ marginTop:12 }} onClick={e=>e.stopPropagation()}>
              {/* Model tier selector */}
              {llm.models && llm.models.length > 1 && (
                <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                  {llm.models.map(m=>(
                    <button key={m.id} onClick={()=>setSModel(m.id)}
                      style={{ flex:1, padding:"8px 6px", borderRadius:10, border:selectedModel===m.id?"2px solid "+ACCENT:"1px solid #f0e0d0",
                        background:selectedModel===m.id?ACCENT_LIGHT:"#fff", cursor:"pointer" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:selectedModel===m.id?ACCENT:TEXT_PRIMARY }}>{m.label}</div>
                      <div style={{ fontSize:10, color:TEXT_SEC }}>{m.desc}</div>
                    </button>
                  ))}
                </div>
              )}
              {selectedLLM === "gemma" && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize:12, color:ACCENT, marginBottom:6 }}>Model name in Ollama (default: gemma)</div>
                  <input type="text" placeholder="e.g. gemma, gemma:2b, llama3" value={selectedModel || ""}
                    onChange={e=>setSModel(e.target.value)}
                    style={{ ...baseInput, marginTop:0, fontFamily:"monospace", fontSize:12 }} />
                </div>
              )}
              {selectedLLM !== "gemma" && (
                <>
                  <div style={{ fontSize:12, color:ACCENT, marginBottom:6 }}>Paste your API key below</div>
                  <div style={{ position:"relative" }}>
                    <input type={showKey?"text":"password"} placeholder={llm.placeholder} value={apiKey}
                      onChange={e=>{setApiKey(e.target.value);setKE("");}}
                      style={{ ...baseInput, marginTop:0, paddingRight:44, fontFamily:"monospace", fontSize:12 }} />
                    <button onClick={()=>setShowKey(s=>!s)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>{showKey?"🙈":"👁️"}</button>
                  </div>
                </>
              )}
              {keyError && <div style={{ fontSize:12, color:RED.text, marginTop:6 }}>{keyError}</div>}
            </div>
          )}
        </div>
      ))}
      <div style={{ flex:1 }} />
      <PrimaryBtn onClick={validateKey} disabled={!selectedLLM || (selectedLLM !== "gemma" && !apiKey)}>Connect & finish →</PrimaryBtn>
      <GhostBtn onClick={()=>setScreen("app")}>Skip for now (use demo mode)</GhostBtn>
    </OnboardingShell>
  );

  return null;
}
