import { useState, useEffect } from "react";
import OverviewView from "./views/OverviewView";
import BoardView from "./views/BoardView";
import CSuiteView from "./views/CSuiteView";
import HRView from "./views/HRView";
import ManagerView from "./views/ManagerView";
import EmployeeView from "./views/EmployeeView";
import { C } from "./constants";

const PAGES = [
  { id:"overview", label:"Overview", icon:"📊" },
  { id:"board", label:"Board", icon:"🏛️" },
  { id:"csuite", label:"C-Suite", icon:"⚡" },
  { id:"hr", label:"People Ops", icon:"📋" },
  { id:"manager", label:"Manager", icon:"👥" },
  { id:"employee", label:"Employee", icon:"👤" },
];

export default function App(){
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load backend data');
        return res.json();
      })
      .then(payload => setData(payload))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const renderPage = () => {
    if (loading) return <div style={{color:C.slate}}>Loading platform data...</div>;
    if (error) return <div style={{color:C.red}}>Error: {error}</div>;
    if(page==="overview") return <OverviewView onQuickStart={setPage} data={data}/>;
    if(page==="board") return <BoardView data={data}/>;
    if(page==="csuite") return <CSuiteView data={data}/>;
    if(page==="hr") return <HRView data={data}/>;
    if(page==="manager") return <ManagerView data={data}/>;
    if(page==="employee") return <EmployeeView data={data}/>;
  };

  return (
    <div style={{
      display:"flex", minHeight:"100vh",
      background:C.bg, fontFamily:"'Inter',sans-serif",
      color:C.white,
    }}>
      <div style={{
        width: sidebarOpen ? 220 : 60,
        background:C.navy,
        borderRight:`1px solid ${C.gold}20`,
        display:"flex",flexDirection:"column",
        transition:"width 0.25s",
        flexShrink:0,
        position:"sticky",top:0,height:"100vh",overflow:"hidden",
      }}>
        <div style={{
          padding:"20px 16px", borderBottom:`1px solid ${C.gold}20`,
          display:"flex",alignItems:"center",gap:10,
        }}>
          <div style={{
            width:32,height:32,borderRadius:8,
            background:`linear-gradient(135deg,${C.gold},${C.goldLt})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,flexShrink:0,
          }}>W</div>
          {sidebarOpen&&(
            <div>
              <div style={{fontSize:13,fontWeight:800,color:C.goldLt,letterSpacing:"0.5px"}}>WorkGenome</div>
              <div style={{fontSize:9,color:C.slate,letterSpacing:"1px"}}>INTELLIGENCE PLATFORM</div>
            </div>
          )}
        </div>

        <nav style={{flex:1,padding:"12px 8px"}}>
          <div style={{fontSize:9,color:C.slate,letterSpacing:"1px",padding:"8px 8px 4px",opacity:sidebarOpen?1:0}}>PLATFORM MENU</div>
          {PAGES.map(r=>(
            <div key={r.id} onClick={()=>setPage(r.id)}
              title={r.label}
              style={{
                display:"flex",alignItems:"center",gap:10,
                padding:"10px 8px",borderRadius:8,marginBottom:2,
                cursor:"pointer",transition:"all 0.15s",
                background: page===r.id ? `${C.gold}20` : "transparent",
                borderLeft: page===r.id ? `3px solid ${C.gold}` : "3px solid transparent",
              }}
              onMouseEnter={ev=>{ if(page!==r.id) ev.currentTarget.style.background=`${C.gold}10`; }}
              onMouseLeave={ev=>{ if(page!==r.id) ev.currentTarget.style.background="transparent"; }}
            >
              <span style={{fontSize:16,flexShrink:0}}>{r.icon}</span>
              {sidebarOpen&&(
                <span style={{
                  fontSize:12,fontWeight:600,
                  color: page===r.id ? C.goldLt : C.slate,
                  whiteSpace:"nowrap"
                }}>{r.label}</span>
              )}
            </div>
          ))}
        </nav>

        {sidebarOpen&&(
          <div style={{padding:"12px 14px",borderTop:`1px solid ${C.gold}15`}}>
            <div style={{fontSize:9,color:C.slate,letterSpacing:"1px",marginBottom:8}}>TIER LEGEND</div>
            {Object.entries({
              "High Performer – AI-Ready": C.green,
              "Needs AI Upskilling": C.teal,
              "Moderate Performer": C.amber,
              "PIP Required": C.red,
            }).map(([t,c])=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>
                <span style={{fontSize:9,color:C.slate,lineHeight:1.2}}>{t}</span>
              </div>
            ))}
          </div>
        )}

        <div onClick={()=>setSidebarOpen(!sidebarOpen)}
          style={{
            padding:"12px 16px",borderTop:`1px solid ${C.gold}15`,
            cursor:"pointer",fontSize:12,color:C.slate,
            display:"flex",alignItems:"center",gap:6,
            transition:"color 0.15s",
          }}
          onMouseEnter={ev=>ev.currentTarget.style.color=C.goldLt}
          onMouseLeave={ev=>ev.currentTarget.style.color=C.slate}
        >
          <span style={{fontSize:14}}>{sidebarOpen?"◀":"▶"}</span>
          {sidebarOpen&&<span>Collapse</span>}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{
          position:"sticky",top:0,zIndex:10,
          background:`${C.bg}F0`,backdropFilter:"blur(8px)",
          borderBottom:`1px solid ${C.gold}15`,
          padding:"12px 24px",
          display:"flex",justifyContent:"space-between",alignItems:"center",
        }}>
          <div>
            <span style={{fontSize:13,fontWeight:700,color:C.goldLt}}>
              {PAGES.find(r=>r.id===page)?.icon} {PAGES.find(r=>r.id===page)?.label}
            </span>
            <span style={{fontSize:12,color:C.slate,marginLeft:12}}>
              WorkGenome™ · {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
            </span>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{
              padding:"4px 12px",borderRadius:20,
              background:"#0D3B26",border:`1px solid ${C.green}40`,
              fontSize:11,color:C.green,fontWeight:600
            }}>● LIVE DATA</div>
            <div style={{
              padding:"4px 12px",borderRadius:20,
              background:`${C.gold}15`,border:`1px solid ${C.gold}40`,
              fontSize:11,color:C.goldLt,fontWeight:600,cursor:"pointer"
            }}>⬇ Export PDF</div>
          </div>
        </div>

        <div style={{padding:"24px 28px",maxWidth:1200,margin:"0 auto"}}>
          {renderPage()}
        </div>

        <div style={{
          padding:"16px 28px",
          borderTop:`1px solid ${C.gold}10`,
          fontSize:11,color:C.slate,
          display:"flex",justifyContent:"space-between"
        }}>
          <span>WorkGenome™ Enterprise Intelligence Platform · v1.0 MVP</span>
          <span>All data is confidential · Internal HR/Legal use only · © 2024</span>
        </div>
      </div>
    </div>
  );
}
