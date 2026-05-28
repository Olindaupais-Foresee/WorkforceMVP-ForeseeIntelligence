import { useState } from "react";
import { MetricCard, SectionHeader, PillarRadar, Badge } from "../components/Ui";
import { C, DEPTS, TIER_COLOR } from "../constants";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
  LineChart,
} from "recharts";

export default function CSuiteView({ data }){
  const [activeDept, setActiveDept] = useState(DEPTS[0]);
  const deptEmps = data.EMPLOYEES.filter(e=>e.dept===activeDept);
  const deptStat = data.DEPT_STATS.find(d=>d.dept===activeDept);
  const pillarAvgs = data.PILLARS.map(p=>({
    name: p.id,
    fullName: p.name,
    avg: Math.round(deptEmps.reduce((s,e)=>s+e.scores[p.id],0)/deptEmps.length)
  }));

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.slate,letterSpacing:"1px",marginBottom:4}}>C-SUITE EXECUTIVE VIEW</div>
        <div style={{fontSize:22,fontWeight:700,color:C.goldLt}}>Operational Workforce Intelligence</div>
        <div style={{fontSize:13,color:C.slate}}>CEO · CFO · CTO · CRO · CHRO · CIO · CXO</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <MetricCard label="Workforce Efficiency Index" value={`${data.COMPANY_KPIs.avgComposite}%`}/>
        <MetricCard label="Annual Savings Potential" value={`$${(data.COMPANY_KPIs.totalSavings/1e6).toFixed(1)}M`} color={C.green}/>
        <MetricCard label="High-Risk Employees" value={data.EMPLOYEES.filter(e=>e.riskLevel==="High").length} color={C.red} sub="Immediate action required"/>
        <MetricCard label="AI-Replaceability >75%" value={data.EMPLOYEES.filter(e=>e.aiReplaceability>75).length} color={C.amber} sub="Roles ripe for automation"/>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {DEPTS.map(d=>(
          <button key={d} onClick={()=>setActiveDept(d)}
            style={{
              padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:600,
              cursor:"pointer",border:"none",transition:"all 0.15s",
              background: activeDept===d ? C.gold : C.cardLt,
              color: activeDept===d ? C.navy : C.slate,
            }}>{d}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
          <SectionHeader title={`${activeDept} — 12-Pillar Avg Scores`}/>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pillarAvgs} layout="vertical" margin={{left:20}}>
              <CartesianGrid stroke={C.navyLt} strokeDasharray="3 3"/>
              <XAxis type="number" domain={[0,100]} tick={{fill:C.slate,fontSize:9}}/>
              <YAxis type="category" dataKey="name" tick={{fill:C.slate,fontSize:10}} width={30}/>
              <Tooltip
                contentStyle={{background:C.navy,border:`1px solid ${C.gold}30`,borderRadius:8,fontSize:12}}
                formatter={(val,_,{payload})=>[`${val}/100`,payload.fullName]}
              />
              <Bar dataKey="avg" radius={[0,4,4,0]} fill={C.gold} opacity={0.8} label={{position:"right",fill:C.slate,fontSize:9,formatter:v=>`${v}`}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
          <SectionHeader title={`${activeDept} Department Summary`}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <MetricCard label="Headcount" value={deptStat.count}/>
            <MetricCard label="Avg Score" value={`${deptStat.avg}/100`}/>
            <MetricCard label="On PIP" value={deptStat.pipCount} color={C.red}/>
            <MetricCard label="Savings Potential" value={`$${(deptStat.savingsPotential/1e6).toFixed(1)}M`} color={C.green}/>
          </div>
          <div style={{background:C.navyMid,borderRadius:8,padding:12}}>
            <div style={{fontSize:11,color:C.slate,marginBottom:8,letterSpacing:"0.5px"}}>TIER DISTRIBUTION</div>
            {Object.entries(TIER_COLOR).map(([t,c])=>{
              const cnt = deptEmps.filter(e=>e.tier===t).length;
              const pct = Math.round((cnt/deptEmps.length)*100);
              return (
                <div key={t} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                    <span style={{color:C.slateL}}>{t}</span>
                    <span style={{color:c,fontWeight:600}}>{cnt} ({pct}%)</span>
                  </div>
                  <div style={{height:4,background:C.navyLt,borderRadius:2}}>
                    <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:2,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20}}>
        <SectionHeader title="AI Replaceability vs Composite Score" sub="Bubble = salary size · Right-bottom quadrant = highest optimisation opportunity"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:2}}>
          <div style={{background:C.navyMid,borderRadius:8,padding:12}}>
            <div style={{fontSize:11,color:C.red,fontWeight:600,marginBottom:8}}>HIGH REPLACEABILITY + LOW SCORE (Action Required)</div>
            {EMPLOYEES.filter(e=>e.aiReplaceability>65&&e.composite<60).slice(0,4).map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.navyLt}`,fontSize:12}}>
                <span style={{color:C.white}}>{e.name}</span>
                <span style={{color:C.slate}}>{e.dept}</span>
                <span style={{color:C.red}}>Score:{e.composite} AI:{e.aiReplaceability}%</span>
              </div>
            ))}
          </div>
          <div style={{background:C.navyMid,borderRadius:8,padding:12}}>
            <div style={{fontSize:11,color:C.green,fontWeight:600,marginBottom:8}}>LOW REPLACEABILITY + HIGH SCORE (Protect & Invest)</div>
            {EMPLOYEES.filter(e=>e.aiReplaceability<40&&e.composite>=75).slice(0,4).map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.navyLt}`,fontSize:12}}>
                <span style={{color:C.white}}>{e.name}</span>
                <span style={{color:C.slate}}>{e.dept}</span>
                <span style={{color:C.green}}>Score:{e.composite} AI:{e.aiReplaceability}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
