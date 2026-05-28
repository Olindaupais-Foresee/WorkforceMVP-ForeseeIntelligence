import { useState } from "react";
import { MetricCard, ScoreRing, SectionHeader, PillarRadar, Badge } from "../components/Ui";
import { TIER_COLOR, C, PILLARS } from "../constants";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function EmployeeView({ data }){
  const emp = data.EMPLOYEES[3];
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.slate,letterSpacing:"1px",marginBottom:4}}>MY PERFORMANCE DASHBOARD</div>
        <div style={{fontSize:22,fontWeight:700,color:C.goldLt}}>Welcome, {emp.name}</div>
        <div style={{fontSize:13,color:C.slate}}>{emp.role} · {emp.dept} · Tenure: {emp.tenure} years</div>
      </div>

      <div style={{
        background:`linear-gradient(135deg, ${C.card}, ${C.cardLt})`,
        border:`1px solid ${C.gold}40`,borderRadius:14,
        padding:24, marginBottom:20,
        display:"flex",gap:24,alignItems:"center"
      }}>
        <ScoreRing value={emp.composite} size={90} color={C.gold}/>
        <div style={{flex:1}}>
          <div style={{fontSize:13,color:C.slate,marginBottom:4}}>Your Overall Performance Score</div>
          <div style={{fontSize:36,fontWeight:800,color:C.goldLt}}>{emp.composite}<span style={{fontSize:18,color:C.slate}}>/100</span></div>
          <div style={{marginTop:6}}><Badge tier={emp.tier}/></div>
          <div style={{
            marginTop:12,fontSize:13,color:C.slateL,lineHeight:1.6,
            padding:"10px 14px",background:C.navyMid,borderRadius:8,
            borderLeft:`3px solid ${TIER_COLOR[emp.tier]}`
          }}>
            {emp.tier==="High Performer – AI-Ready"
              ? "Excellent work! You are among the top performers in your department. Keep leveraging AI tools to stay ahead."
              : emp.tier==="Needs AI Upskilling"
              ? "You show strong performance fundamentals. Focus on building your AI tool proficiency to unlock the next level."
              : emp.tier==="Moderate Performer"
              ? "There are areas for growth in your performance profile. Your manager will discuss a development plan with you."
              : "A Performance Improvement Plan has been initiated. Please schedule time with your manager and HR to discuss next steps."
            }
          </div>
        </div>
        <div style={{display:"grid",gap:8}}>
          <MetricCard label="AI Readiness" value={`${emp.scores.L}/100`} color={emp.scores.L>=65?C.green:C.amber}/>
          <MetricCard label="Collaboration" value={`${emp.scores.D}/100`}/>
          <MetricCard label="Leadership" value={`${emp.scores.G}/100`}/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
          <SectionHeader title="Your Score Profile" sub="12 performance pillars"/>
          <PillarRadar employee={emp}/>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
          <SectionHeader title="Score History" sub="Your performance trend"/>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={emp.trend.map((v,i)=>({period:["Q1","Q2","Q3","Q4","Now"][i],score:v}))}>
              <CartesianGrid stroke={C.navyLt} strokeDasharray="3 3"/>
              <XAxis dataKey="period" tick={{fill:C.slate,fontSize:10}}/>
              <YAxis domain={[30,100]} tick={{fill:C.slate,fontSize:9}}/>
              <Tooltip contentStyle={{background:C.navy,border:`1px solid ${C.gold}30`,borderRadius:8,fontSize:12}}/>
              <Line type="monotone" dataKey="score" stroke={C.gold} strokeWidth={3} dot={{fill:C.gold,r:5}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20,marginBottom:16}}>
        <SectionHeader title="Pillar-by-Pillar Breakdown" sub="How you score across all 12 dimensions"/>
        <button onClick={()=>setShowDetails(!showDetails)}
          style={{
            padding:"6px 16px",borderRadius:20,fontSize:12,fontWeight:600,
            background:C.navyLt,border:`1px solid ${C.gold}40`,
            color:C.goldLt,cursor:"pointer",marginBottom:14
          }}>{showDetails?"Hide Details":"Show Full Breakdown"}</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {PILLARS.map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",
              background:C.navyMid,borderRadius:8}}>
              <span style={{fontSize:11,color:C.gold,fontWeight:700,width:20}}>{p.id}</span>
              <span style={{fontSize:11,color:C.slateL,flex:1}}>{p.name}</span>
              <div style={{width:60,height:6,background:C.navyLt,borderRadius:3}}>
                <div style={{
                  width:`${emp.scores[p.id]}%`,height:"100%",borderRadius:3,
                  background:emp.scores[p.id]>=80?C.green:emp.scores[p.id]>=60?C.gold:C.red,
                  transition:"width 0.6s"
                }}/>
              </div>
              <span style={{
                fontSize:12,fontWeight:700,width:26,textAlign:"right",
                color:emp.scores[p.id]>=80?C.green:emp.scores[p.id]>=60?C.gold:C.red
              }}>{emp.scores[p.id]}</span>
            </div>
          ))}
        </div>
        {showDetails&&(
          <div style={{marginTop:16,padding:14,background:C.navyMid,borderRadius:8,fontSize:12,color:C.slateL,lineHeight:1.8}}>
            <div style={{color:C.goldLt,fontWeight:700,marginBottom:8}}>What these scores mean for you:</div>
            {PILLARS.filter(p=>emp.scores[p.id]<60).length>0&&(
              <div style={{marginBottom:10}}>
                <span style={{color:C.red,fontWeight:600}}>Focus areas: </span>
                {PILLARS.filter(p=>emp.scores[p.id]<60).map(p=>p.name).join(", ")}. Consider discussing development opportunities with your manager.
              </div>
            )}
            {PILLARS.filter(p=>emp.scores[p.id]>=80).length>0&&(
              <div>
                <span style={{color:C.green,fontWeight:600}}>Strengths: </span>
                {PILLARS.filter(p=>emp.scores[p.id]>=80).map(p=>p.name).join(", ")}. These are your competitive advantages — keep building on them.
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{
        background:C.navyMid,border:`1px solid ${C.gold}20`,
        borderRadius:10,padding:16,
        fontSize:12,color:C.slate,lineHeight:1.7
      }}>
        <span style={{color:C.goldLt,fontWeight:600}}>How your score is calculated: </span>
        Your composite score is derived from 12 evidence-based pillars covering 300+ data points — including your output metrics, collaboration patterns, communication quality, reliability record, and AI tool adoption. Scores are benchmarked relative to your role and department, not absolute. Speak with your manager or HR for more detail on any specific pillar.
      </div>
    </div>
  );
}
