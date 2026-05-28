export const C = {
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

export const TIER_COLOR = {
  "High Performer – AI-Ready": C.green,
  "Needs AI Upskilling":       C.teal,
  "Moderate Performer":        C.amber,
  "PIP Required":              C.red,
};

export const TIER_BG = {
  "High Performer – AI-Ready": "#0D3B26",
  "Needs AI Upskilling":       "#0D3030",
  "Moderate Performer":        "#3B2800",
  "PIP Required":              "#3B0D0D",
};

export const PILLARS = [
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

export const DEPTS = ["Engineering","Sales","Marketing","Finance","HR","Operations","Product","Legal"];
