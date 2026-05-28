import { useState } from "react";
import { MetricCard, SectionHeader, PillarRadar, EmployeeRow, GovernanceReport, Badge, ScoreRing } from "../components/Ui";
import { C, TIER_COLOR, TIER_BG } from "../constants";

export default function HRView({ data }){
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("composite");

  const filtered = data.EMPLOYEES
    .filter(e=> filter==="All" || e.tier===filter)
    .filter(e=> e.name.toLowerCase().includes(search.toLowerCase()) ||
                e.dept.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=> sort==="composite" ? b.composite-a.composite :
                  sort==="aiReplaceability" ? b.aiReplaceability-a.aiReplaceability :
                  a.name.localeCompare(b.name));

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.slate,letterSpacing:"1px",marginBottom:4}}>HR & PEOPLE OPERATIONS</div>
        <div style={{fontSize:22,fontWeight:700,color:C.goldLt}}>Employee Performance & Governance Centre</div>
        <div style={{fontSize:13,color:C.slate}}>CHRO · HR Business Partners · People Analytics</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {Object.entries(TIER_COLOR).map(([t,c])=>(
          <div key={t} onClick={()=>setFilter(filter===t?"All":t)}
            style={{
              background: filter===t ? TIER_BG[t] : C.card,
              border: `1px solid ${c}${filter===t?"80":"25"}`,
              borderRadius:10, padding:"12px 16px",
              cursor:"pointer", transition:"all 0.15s",
            }}>
            <div style={{fontSize:11,color:C.slate,marginBottom:4}}>{t.split("–")[0].trim()}</div>
            <div style={{fontSize:24,fontWeight:700,color:c}}>
              {data.EMPLOYEES.filter(e=>e.tier===t).length}
            </div>
            <div style={{fontSize:11,color:C.slate}}>employees</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by name or department..."
          style={{
            flex:1, padding:"8px 14px", borderRadius:8,
            background:C.cardLt, border:`1px solid ${C.navyLt}`,
            color:C.white, fontSize:13, outline:"none",
          }}
        />
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{
            padding:"8px 12px",borderRadius:8,
            background:C.cardLt,border:`1px solid ${C.navyLt}`,
            color:C.slateL,fontSize:12,outline:"none",cursor:"pointer"
          }}>
          <option value="composite">Sort: Composite Score</option>
          <option value="aiReplaceability">Sort: AI Replaceability</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      <div style={{display:"grid",gridTemplateColumns:selectedEmp?"1fr 1fr":"1fr",gap:16}}>
        <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,overflow:"hidden"}}>
          <div style={{
            display:"grid",
            gridTemplateColumns:"200px 100px 70px 70px 90px 110px 60px",
            gap:8,padding:"10px 16px",
            background:C.navyMid,
            borderBottom:`1px solid ${C.gold}30`,
          }}>
            {['Employee','Score','AI Rep.','Tenure','Tier','Salary','Risk'].map(h=>(
              <div key={h} style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.5px"}}>{h}</div>
            ))}
          </div>
          <div style={{maxHeight:480,overflowY:"auto"}}>
            {filtered.map(e=>(
              <EmployeeRow key={e.id} e={e}
                onSelect={emp=>setSelectedEmp(selectedEmp?.id===emp.id?null:emp)}
                selected={selectedEmp?.id===e.id}/>
            ))}
          </div>
        </div>

        {selectedEmp&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.gold}25`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
                <ScoreRing value={selectedEmp.composite} size={64}/>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:C.white}}>{selectedEmp.name}</div>
                  <div style={{fontSize:12,color:C.slate}}>{selectedEmp.role} · {selectedEmp.dept}</div>
                  <div style={{marginTop:6}}><Badge tier={selectedEmp.tier}/></div>
                </div>
              </div>
              <PillarRadar employee={selectedEmp}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12}}>
                <MetricCard label="AI Replaceability" value={`${selectedEmp.aiReplaceability}%`} color={selectedEmp.aiReplaceability>75?C.red:C.green}/>
                <MetricCard label="Tenure" value={`${selectedEmp.tenure}y`}/>
                <MetricCard label="Salary" value={`$${(selectedEmp.salary/1000).toFixed(0)}K`}/>
              </div>
            </div>
            <GovernanceReport e={selectedEmp}/>
          </div>
        )}
      </div>
    </div>
  );
}
