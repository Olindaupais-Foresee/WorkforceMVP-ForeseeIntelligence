import { useState } from "react";
import { MetricCard, SectionHeader, PillarRadar, Badge, ScoreRing } from "../components/Ui";
import { C, DEPTS, PILLARS } from "../constants";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function ManagerView({ data }){
  const [dept, setDept] = useState("Engineering");
  const team = data.EMPLOYEES.filter(e=>e.dept===dept);
  const [sel, setSel] = useState(null);

  const trendsData = team.slice(0,4).map(e=>({
    name:e.name.split(" ")[0],
    q1:e.trend[0],q2:e.trend[1],q3:e.trend[2],q4:e.trend[3],current:e.composite
  }));

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.slate,letterSpacing:"1px",marginBottom:4}}>TEAM MANAGER VIEW</div>
        <div style={{fontSize:22,fontWeight:700,color:C.goldLt}}>My Team Performance Centre</div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {DEPTS.map(d=>(
          <button key={d} onClick={()=>{setDept(d);setSel(null);}}
            style={{
              padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,
              cursor:"pointer",border:"none",
              background:dept===d?C.gold:C.cardLt,
              color:dept===d?C.navy:C.slate,
            }}>{d}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        <MetricCard label="Team Size" value={team.length}/>
        <MetricCard label="Team Avg Score" value={`${Math.round(team.reduce((s,e)=>s+e.composite,0)/team.length)}/100`}/>
        <MetricCard label="Flagged for Action" value={team.filter(e=>e.tier==="PIP Required"||e.tier==="Moderate Performer").length} color={C.amber}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
          <SectionHeader title="Individual Score Comparison"/>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={team.map(e=>({name:e.name.split(" ")[0],score:e.composite}))}>
              <CartesianGrid stroke={C.navyLt} strokeDasharray="3 3"/>
              <XAxis dataKey="name" tick={{fill:C.slate,fontSize:9}}/>
              <YAxis domain={[0,100]} tick={{fill:C.slate,fontSize:9}}/>
              <Tooltip contentStyle={{background:C.navy,border:`1px solid ${C.gold}30`,borderRadius:8,fontSize:12}}/>
              <Bar dataKey="score" radius={[4,4,0,0]} fill={C.gold} label={{position:"top",fill:C.slate,fontSize:8,formatter:v=>`${v}`}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
          <SectionHeader title="Score Trend (5 periods)" sub="Top 4 team members"/>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendsData[0]?[{
              period:"Q1",...Object.fromEntries(trendsData.map((d,i)=>[d.name,d.q1]))
            },{
              period:"Q2",...Object.fromEntries(trendsData.map((d,i)=>[d.name,d.q2]))
            },{
              period:"Q3",...Object.fromEntries(trendsData.map((d,i)=>[d.name,d.q3]))
            },{
              period:"Q4",...Object.fromEntries(trendsData.map((d,i)=>[d.name,d.q4]))
            },{
              period:"Now",...Object.fromEntries(trendsData.map((d,i)=>[d.name,d.current]))
            }]:[]}> 
              <CartesianGrid stroke={C.navyLt} strokeDasharray="3 3"/>
              <XAxis dataKey="period" tick={{fill:C.slate,fontSize:9}}/>
              <YAxis domain={[40,100]} tick={{fill:C.slate,fontSize:9}}/>
              <Tooltip contentStyle={{background:C.navy,border:`1px solid ${C.gold}30`,borderRadius:8,fontSize:12}}/>
              {trendsData.map((d,i)=>(
                <Line key={d.name} type="monotone" dataKey={d.name}
                  stroke={[C.gold,C.teal,C.green,C.purple][i]}
                  strokeWidth={2} dot={{r:3}}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",background:C.navyMid,borderBottom:`1px solid ${C.gold}30`,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:700,color:C.goldLt}}>Team Member Details</span>
          <span style={{fontSize:11,color:C.slate}}>Click a row for full breakdown</span>
        </div>
        {team.map(e=>(
          <div key={e.id} onClick={()=>setSel(sel?.id===e.id?null:e)}
            style={{
              display:"grid",gridTemplateColumns:"1fr 56px 80px 100px 60px 80px",
              gap:10,padding:"12px 16px",alignItems:"center",
              borderBottom:`1px solid ${C.navyLt}`,cursor:"pointer",
              background: sel?.id===e.id ? C.navyLt : "transparent",
            }}
            onMouseEnter={ev=>{ if(sel?.id!==e.id) ev.currentTarget.style.background=C.cardLt; }}
            onMouseLeave={ev=>{ if(sel?.id!==e.id) ev.currentTarget.style.background="transparent"; }}
          >
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.white}}>{e.name}</div>
              <div style={{fontSize:11,color:C.slate}}>{e.role}</div>
            </div>
            <ScoreRing value={e.composite} size={40}/>
            <div style={{fontSize:12,color:C.slate}}>AI: {e.aiReplaceability}%</div>
            <Badge tier={e.tier}/>
            <div style={{fontSize:11,color:e.riskLevel==="High"?C.red:e.riskLevel==="Medium"?C.amber:C.green,fontWeight:600}}>{e.riskLevel}</div>
            <div style={{fontSize:12,color:C.slate}}>${(e.salary/1000).toFixed(0)}K</div>
          </div>
        ))}
        {sel&&(
          <div style={{padding:20,borderTop:`2px solid ${C.gold}30`,background:C.cardLt}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <SectionHeader title={`${sel.name} — Pillar Breakdown`}/>
                <PillarRadar employee={sel}/>
              </div>
              <div>
                <SectionHeader title="12-Pillar Scores"/>
                {PILLARS.map(p=>(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                    <span style={{fontSize:10,color:C.slate,width:24}}>{p.id}</span>
                    <span style={{fontSize:11,color:C.slateL,flex:1}}>{p.name}</span>
                    <div style={{width:80,height:4,background:C.navyLt,borderRadius:2}}>
                      <div style={{
                        width:`${sel.scores[p.id]}%`,height:"100%",borderRadius:2,
                        background: sel.scores[p.id]>=80?C.green:sel.scores[p.id]>=60?C.gold:C.red
                      }}/>
                    </div>
                    <span style={{
                      fontSize:11,fontWeight:700,width:28,textAlign:"right",
                      color: sel.scores[p.id]>=80?C.green:sel.scores[p.id]>=60?C.gold:C.red
                    }}>{sel.scores[p.id]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
