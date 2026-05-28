import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  C, PILLARS, TIER_COLOR, TIER_BG,
} from "../data";

export function Badge({tier}){
  return (
    <span style={{
      background:TIER_BG[tier]||"#1a1a1a",
      color:TIER_COLOR[tier]||"#fff",
      border:`1px solid ${TIER_COLOR[tier]||"#fff"}40`,
      borderRadius:4, padding:"2px 8px",
      fontSize:11, fontWeight:600, letterSpacing:"0.4px",
      whiteSpace:"nowrap",
    }}>{tier}</span>
  );
}

export function ScoreRing({value, size=56, color}){
  const r=22; const circ=2*Math.PI*r;
  const dash=circ*(value/100);
  const col = color || (value>=80?C.green:value>=65?C.teal:value>=50?C.amber:C.red);
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke={C.navyLt} strokeWidth="4"/>
      <circle cx="28" cy="28" r={r} fill="none" stroke={col} strokeWidth="4"
        strokeDasharray={`${dash} ${circ-dash}`}
        strokeLinecap="round" transform="rotate(-90 28 28)"/>
      <text x="28" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill={col}>{value}</text>
    </svg>
  );
}

export function MetricCard({label, value, sub, color}){
  return (
    <div style={{
      background:C.card, border:`1px solid ${C.gold}30`,
      borderRadius:10, padding:"14px 18px",
      borderTop:`2px solid ${color||C.gold}`,
    }}>
      <div style={{fontSize:11,color:C.slate,letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:4}}>{label}</div>
      <div style={{fontSize:24,fontWeight:700,color:color||C.goldLt,lineHeight:1.2}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:C.slate,marginTop:3}}>{sub}</div>}
    </div>
  );
}

export function SectionHeader({title,sub}){
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:3,height:18,background:C.gold,borderRadius:2}}/>
        <span style={{fontSize:15,fontWeight:700,color:C.goldLt,letterSpacing:"0.3px"}}>{title}</span>
      </div>
      {sub&&<div style={{fontSize:12,color:C.slate,marginTop:2,marginLeft:11}}>{sub}</div>}
    </div>
  );
}

export function PillarRadar({employee}){
  const data = PILLARS.map(p=>({
    subject: p.id+": "+p.name.split(" ")[0],
    score: employee.scores[p.id],
    fullMark:100,
  }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} margin={{top:10,right:20,bottom:10,left:20}}>
        <PolarGrid stroke={C.navyLt}/>
        <PolarAngleAxis dataKey="subject" tick={{fill:C.slate,fontSize:9}}/>
        <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
        <Radar name="Score" dataKey="score" stroke={C.gold} fill={C.gold} fillOpacity={0.25}/>
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function EmployeeRow({e, onSelect, selected}){
  return (
    <div onClick={()=>onSelect(e)}
      style={{
        display:"grid", gridTemplateColumns:"200px 100px 70px 70px 90px 110px 60px",
        gap:8, padding:"10px 16px", alignItems:"center",
        background: selected ? C.navyLt : "transparent",
        borderBottom:`1px solid ${C.navyLt}`,
        cursor:"pointer",
        transition:"background 0.15s",
      }}
      onMouseEnter={ev=>{ if(!selected) ev.currentTarget.style.background=C.cardLt; }}
      onMouseLeave={ev=>{ if(!selected) ev.currentTarget.style.background="transparent"; }}
    >
      <div>
        <div style={{fontSize:13,fontWeight:600,color:C.white}}>{e.name}</div>
        <div style={{fontSize:11,color:C.slate}}>{e.dept} · {e.role}</div>
      </div>
      <ScoreRing value={e.composite} size={42}/>
      <div style={{fontSize:13,color:C.slateL}}>{e.aiReplaceability}%</div>
      <div style={{fontSize:13,color:C.slateL}}>{e.tenure}y</div>
      <Badge tier={e.tier}/>
      <div style={{fontSize:12,color:C.slate}}>${(e.salary/1000).toFixed(0)}K</div>
      <div style={{
        fontSize:11,fontWeight:600,
        color:e.riskLevel==="High"?C.red:e.riskLevel==="Medium"?C.amber:C.green
      }}>{e.riskLevel}</div>
    </div>
  );
}

export function GovernanceReport({e}){
  const lowPillars = PILLARS.filter(p=>e.scores[p.id]<60).sort((a,b)=>e.scores[a.id]-e.scores[b.id]);
  const highPillars = PILLARS.filter(p=>e.scores[p.id]>=80).sort((a,b)=>e.scores[b.id]-e.scores[a.id]);
  const narrative = (() => {
    if(e.tier==="High Performer – AI-Ready")
      return `${e.name} is a top-quartile contributor in ${e.dept}. Composite score of ${e.composite}/100 places them in the retain-and-invest tier. AI Readiness score of ${e.scores.L}/100 confirms adaptability to AI-augmented workflows. Recommend: retain, fast-track for leadership development.`;
    if(e.tier==="Needs AI Upskilling")
      return `${e.name} demonstrates solid operational performance (${e.composite}/100) but AI Readiness (${e.scores.L}/100) lags the department baseline. Core competencies in ${highPillars[0]?.name||"delivery"} are strong. Recommend: enrol in structured AI upskilling programme (est. 6–8 weeks), then re-score. Exit decision deferred pending re-assessment.`;
    if(e.tier==="Moderate Performer")
      return `${e.name} scores ${e.composite}/100 composite. Underperformance is concentrated in ${lowPillars.slice(0,2).map(p=>p.name).join(" and ")}. AI Readiness is ${e.scores.L}/100. Recommend: 8-week PIP with specific targets in underperforming pillars and mandatory AI tool adoption. Re-score at PIP completion.`;
    return `${e.name} scores ${e.composite}/100, placing them in the lowest performance tier across ${e.dept}. Significant gaps identified in ${lowPillars.slice(0,3).map(p=>p.name).join(", ")}. AI Readiness of ${e.scores.L}/100 further limits replaceability mitigation. Recommend: immediate PIP initiation. Legal documentation generated. If KPIs not met in ${e.pipWeeks||8} weeks, proceed to structured separation with full HR/Legal sign-off.`;
  })();

  return (
    <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:C.goldLt}}>Governance & Legal Report</div>
          <div style={{fontSize:11,color:C.slate}}>Internal HR/Legal use only · Not for employee distribution</div>
        </div>
        <div style={{
          background:"#1A0A00",border:`1px solid ${C.amber}40`,
          borderRadius:6,padding:"4px 10px",fontSize:10,color:C.amber,
          fontWeight:600,letterSpacing:"0.5px"
        }}>CONFIDENTIAL</div>
      </div>

      <div style={{
        background:TIER_BG[e.tier]||C.navyMid,
        border:`1px solid ${TIER_COLOR[e.tier]||C.gold}40`,
        borderRadius:8,padding:"12px 16px",marginBottom:16
      }}>
        <div style={{fontSize:11,color:C.slate,marginBottom:4}}>DECISION RECOMMENDATION</div>
        <div style={{fontSize:15,fontWeight:700,color:TIER_COLOR[e.tier]||C.gold}}>{e.tier}</div>
        <div style={{fontSize:12,color:C.slateL,marginTop:6,lineHeight:1.6}}>{narrative}</div>
      </div>

      {lowPillars.length>0&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:C.red,fontWeight:700,marginBottom:8,letterSpacing:"0.5px"}}>DEFICIENCY FLAGS (score < 60)</div>
          {lowPillars.map(p=>(
            <div key={p.id} style={{
              display:"flex",justifyContent:"space-between",
              padding:"6px 12px",marginBottom:4,
              background:"#2A0A0A",borderRadius:6,
              fontSize:12,color:C.slateL
            }}>
              <span>{p.id}. {p.name}</span>
              <span style={{color:C.red,fontWeight:700}}>{e.scores[p.id]}/100</span>
            </div>
          ))}
        </div>
      )}

      <div style={{
        background:C.navyMid,borderRadius:8,padding:"10px 14px",
        fontSize:11,color:C.slate,lineHeight:1.7,
        borderLeft:`3px solid ${C.gold}`,
      }}>
        <span style={{color:C.goldLt,fontWeight:600}}>Legal Note: </span>
        This report is generated from objective, multi-source performance data across 12 evidence-based pillars (300+ variables). All scoring is role-relative and baseline-adjusted. Report must be reviewed and countersigned by CHRO + Legal Counsel before any employment action is initiated. No communication may be sent to the employee without explicit HR/Legal approval.
      </div>
    </div>
  );
}
