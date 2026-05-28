const C = {
  navy:    "#0B1E3E",
  navyMid: "#112347",
  navyLt:  "#1A3260",
  gold:    "#C9A84C",
  goldLt:  "#E2C47A",
  goldPl:  "#F5E9C4",
  white:   "#FFFFFF",
  offWhite:"#F7F5EE",
  slate:   "#8A95A8",
  slateL:  "#C2C8D4",
  green:   "#2ECC71",
  amber:   "#F39C12",
  red:     "#E74C3C",
  teal:    "#1ABC9C",
  purple:  "#8E44AD",
  bg:      "#060F20",
  card:    "#0E1F3D",
  cardLt:  "#132545",
};

const TIER_COLOR = {
  "High Performer – AI-Ready": C.green,
  "Needs AI Upskilling":       C.teal,
  "Moderate Performer":        C.amber,
  "PIP Required":              C.red,
};

const TIER_BG = {
  "High Performer – AI-Ready": "#0D3B26",
  "Needs AI Upskilling":       "#0D3030",
  "Moderate Performer":        "#3B2800",
  "PIP Required":              "#3B0D0D",
};

const PILLARS = [
  { id:"A", name:"Output Quantity",      weight:0.10 },
  { id:"B", name:"Output Quality",       weight:0.10 },
  { id:"C", name:"Task Efficiency",      weight:0.09 },
  { id:"D", name:"Collaboration",        weight:0.08 },
  { id:"E", name:"Trustworthiness",      weight:0.08 },
  { id:"F", name:"Relationship Depth",   weight:0.07 },
  { id:"G", name:"Leadership",           weight:0.09 },
  { id:"H", name:"Initiative / Stretch", weight:0.08 },
  { id:"I", name:"Communication",        weight:0.07 },
  { id:"J", name:"Reliability",          weight:0.08 },
  { id:"K", name:"Growth Trajectory",    weight:0.08 },
  { id:"L", name:"AI Readiness",         weight:0.08 },
];

const DEPTS = ["Engineering","Sales","Marketing","Finance","HR","Operations","Product","Legal"];

function randBetween(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

function makeTier(composite){
  if(composite>=80) return "High Performer – AI-Ready";
  if(composite>=65) return "Needs AI Upskilling";
  if(composite>=50) return "Moderate Performer";
  return "PIP Required";
}

function makeEmployee(id,dept,role){
  const scores = {};
  PILLARS.forEach(p=>{ scores[p.id]=randBetween(30,98); });
  const composite = Math.round(PILLARS.reduce((s,p)=>s+(scores[p.id]*p.weight),0));
  const tier = makeTier(composite);
  const aiReplaceability = randBetween(20,95);
  return {
    id, dept, role,
    name:["Arjun Mehta","Sofia Reyes","Wei Zhang","Lena Fischer","Marcus Brown",
          "Priya Nair","Daniel Kim","Aisha Hassan","Lucas Müller","Elena Popescu",
          "Ryan O'Brien","Yuki Tanaka","Fatima Al-Rashid","Carlos Vega","Nina Patel",
          "James Okafor","Mei Lin","Alex Kovač","Sara Lindström","Raj Chandrasekaran"][id%20],
    scores, composite,
    tier,
    aiReplaceability,
    tenure: randBetween(1,12),
    salary: randBetween(60,220)*1000,
    trend: [randBetween(45,75),randBetween(50,80),randBetween(55,85),randBetween(55,90),composite],
    pipWeeks: tier==="PIP Required" ? randBetween(4,12) : null,
    pipComplete: tier==="PIP Required" ? Math.random()>0.5 : false,
    riskLevel: composite<50?"High":composite<65?"Medium":"Low",
  };
}

const EMPLOYEES = Array.from({length:48},(_,i)=>
  makeEmployee(i, DEPTS[i%DEPTS.length],
    ["IC","Senior IC","Manager","Director","VP","C-Suite"][Math.floor(i/8)])
);

const DEPT_STATS = DEPTS.map(d=>{
  const emps = EMPLOYEES.filter(e=>e.dept===d);
  const avg = Math.round(emps.reduce((s,e)=>s+e.composite,0)/emps.length);
  const pipCount = emps.filter(e=>e.tier==="PIP Required").length;
  const highCount = emps.filter(e=>e.tier==="High Performer – AI-Ready").length;
  const savingsPotential = emps
    .filter(e=>e.tier==="PIP Required"||e.aiReplaceability>75)
    .reduce((s,e)=>s+e.salary,0);
  return { dept:d, avg, count:emps.length, pipCount, highCount, savingsPotential };
});

const COMPANY_KPIs = {
  revenuePerHead: 412000,
  headcount: 48,
  avgComposite: Math.round(EMPLOYEES.reduce((s,e)=>s+e.composite,0)/EMPLOYEES.length),
  pipCount: EMPLOYEES.filter(e=>e.tier==="PIP Required").length,
  highCount: EMPLOYEES.filter(e=>e.tier==="High Performer – AI-Ready").length,
  totalSavings: EMPLOYEES
    .filter(e=>e.tier==="PIP Required"||e.aiReplaceability>75)
    .reduce((s,e)=>s+e.salary,0),
  projectedMarginGain: 4.7,
  shareImpact: "+11.2%",
};

const TREND_DATA = [
  {q:"Q1 2023",composite:61,revenue:38.2,headcount:52},
  {q:"Q2 2023",composite:63,revenue:41.0,headcount:51},
  {q:"Q3 2023",composite:64,revenue:43.5,headcount:50},
  {q:"Q4 2023",composite:66,revenue:46.1,headcount:49},
  {q:"Q1 2024",composite:67,revenue:48.8,headcount:48},
  {q:"Q2 2024",composite:69,revenue:52.2,headcount:46},
];

export {
  C,
  TIER_COLOR,
  TIER_BG,
  PILLARS,
  DEPTS,
  EMPLOYEES,
  DEPT_STATS,
  COMPANY_KPIs,
  TREND_DATA,
};
