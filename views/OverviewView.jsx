import { SectionHeader, MetricCard } from "../components/Ui";

export default function OverviewView({onQuickStart, data}){
  const overviewCards = [
    {label:"Headcount", value:data.COMPANY_KPIs.headcount},
    {label:"Avg Workforce Score", value:`${data.COMPANY_KPIs.avgComposite}/100`},
    {label:"Projected Savings", value:`$${(data.COMPANY_KPIs.totalSavings/1e6).toFixed(1)}M`},
    {label:"AI-Ready Talent", value:data.EMPLOYEES.filter(e=>e.tier==="High Performer – AI-Ready").length},
  ];

  const quickLinks = [
    {id:"board", label:"Board Dashboard", icon:"🏛️"},
    {id:"csuite", label:"C-Suite View", icon:"⚡"},
    {id:"hr", label:"People Ops", icon:"📋"},
    {id:"manager", label:"Manager Portal", icon:"👥"},
    {id:"employee", label:"Employee Portal", icon:"👤"},
  ];

  return (
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,color:"#C2C8D4",letterSpacing:"1px",marginBottom:6}}>WORKGENOME SAAS MVP</div>
        <div style={{fontSize:34,fontWeight:800,color:"#E2C47A",lineHeight:1.05}}>A clear, role-based workforce intelligence platform.</div>
        <div style={{fontSize:14,color:"#8A95A8",marginTop:10,maxWidth:720,lineHeight:1.7}}>
          Navigate your organisation using a single, intuitive SaaS MVP experience. Review executive insights, people analytics, manager operations, and employee self-service from one product.
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        {overviewCards.map(card=> (
          <div key={card.label} style={{background:"#0E1F3D",border:`1px solid #C9A84C30`,borderRadius:12,padding:18}}>
            <div style={{fontSize:11,color:"#8A95A8",marginBottom:6,letterSpacing:"0.8px"}}>{card.label}</div>
            <div style={{fontSize:28,fontWeight:700,color:"#E2C47A"}}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:28}}>
        {quickLinks.map(link=>(
          <button key={link.id} onClick={()=>onQuickStart(link.id)}
            style={{
              background:"#0E1F3D",border:`1px solid #C9A84C20`,borderRadius:14,
              padding:"18px 14px",cursor:"pointer",color:"#FFFFFF",
              display:"flex",flexDirection:"column",alignItems:"flex-start",gap:10,
            }}>
            <div style={{fontSize:24}}>{link.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#E2C47A"}}>{link.label}</div>
            <div style={{fontSize:11,color:"#8A95A8"}}>Open view</div>
          </button>
        ))}
      </div>

      <div style={{background:"#0E1F3D",border:`1px solid #C9A84C25`,borderRadius:12,padding:22}}>
        <SectionHeader title="How the SaaS MVP works" sub="Launch any view and explore actionable insights"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{fontSize:13,color:"#8A95A8",lineHeight:1.8}}>
            <div><strong>1.</strong> Start from the Overview and access the right role with one click.</div>
            <div><strong>2.</strong> Use the Sidebar to move between executive, HR, manager, or employee experiences.</div>
            <div><strong>3.</strong> Review metrics, drill into people data, and validate decisions with built-in governance guidance.</div>
          </div>
          <div style={{fontSize:13,color:"#8A95A8",lineHeight:1.8}}>
            <div><strong>4.</strong> The platform is designed for SaaS flow: simple navigation, clear sections, and rapid discovery.</div>
            <div><strong>5.</strong> Export reports, track workforce health, and align operations with AI readiness and retention signals.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
