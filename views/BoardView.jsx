import { MetricCard, SectionHeader } from "../components/Ui";
import { TIER_COLOR } from "../constants";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, ResponsiveContainer,
} from "recharts";

export default function BoardView({ data }){
  const tierCounts = {
    "High Performer – AI-Ready": data.EMPLOYEES.filter(e=>e.tier==="High Performer – AI-Ready").length,
    "Needs AI Upskilling": data.EMPLOYEES.filter(e=>e.tier==="Needs AI Upskilling").length,
    "Moderate Performer": data.EMPLOYEES.filter(e=>e.tier==="Moderate Performer").length,
    "PIP Required": data.EMPLOYEES.filter(e=>e.tier==="PIP Required").length,
  };
  const pieData = Object.entries(tierCounts).map(([name,value])=>({name,value}));

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:"#8A95A8",letterSpacing:"1px",marginBottom:4}}>BOARD OF DIRECTORS · WORKFORCE INTELLIGENCE SUMMARY</div>
        <div style={{fontSize:22,fontWeight:700,color:"#E2C47A"}}>Strategic Workforce Optimisation Dashboard</div>
        <div style={{fontSize:13,color:"#8A95A8"}}>Fiscal Year 2024 · Confidential Board Report</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <MetricCard label="Total Headcount" value={data.COMPANY_KPIs.headcount} sub="Active employees"/>
        <MetricCard label="Avg Composite Score" value={`${data.COMPANY_KPIs.avgComposite}/100`} sub="Company-wide"/>
        <MetricCard label="Projected Cost Savings" value={`$${(data.COMPANY_KPIs.totalSavings/1e6).toFixed(1)}M`} sub="Annual, post-optimisation" color="#2ECC71"/>
        <MetricCard label="Projected Margin Gain" value={`+${data.COMPANY_KPIs.projectedMarginGain}%`} sub="EBITDA impact" color="#1ABC9C"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
        <div style={{background:"#0E1F3D",border:`1px solid #C9A84C25`,borderRadius:10,padding:20}}>
          <SectionHeader title="Workforce Quality Distribution" sub="4-tier talent classification"/>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${value}`}>
                {pieData.map((entry,i)=>(
                  <Cell key={i} fill={TIER_COLOR[entry.name]}/>
                ))}
              </Pie>
              <Tooltip contentStyle={{background:"#060F20",border:`1px solid #C9A84C30`,borderRadius:8,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
            {Object.entries(TIER_COLOR).map(([t,c])=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#8A95A8"}}>
                <div style={{width:8,height:8,borderRadius:2,background:c}}/>
                {t.split("–")[0].trim()} ({tierCounts[t]})
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"#0E1F3D",border:`1px solid #C9A84C25`,borderRadius:10,padding:20}}>
          <SectionHeader title="Composite Score vs Revenue Trend" sub="6-quarter trajectory"/>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.TREND_DATA}>
              <CartesianGrid stroke="#1A3260" strokeDasharray="3 3"/>
              <XAxis dataKey="q" tick={{fill:"#8A95A8",fontSize:9}}/>
              <YAxis yAxisId="left" domain={[55,75]} tick={{fill:"#8A95A8",fontSize:9}}/>
              <YAxis yAxisId="right" orientation="right" tick={{fill:"#8A95A8",fontSize:9}}/>
              <Tooltip contentStyle={{background:"#060F20",border:`1px solid #C9A84C30`,borderRadius:8,fontSize:12}}/>
              <Line yAxisId="left" type="monotone" dataKey="composite" stroke="#C9A84C" strokeWidth={2} dot={{fill:"#C9A84C",r:3}} name="Avg Score"/>
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#1ABC9C" strokeWidth={2} dot={{fill:"#1ABC9C",r:3}} name="Revenue $M"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{background:"#0E1F3D",border:`1px solid #C9A84C25`,borderRadius:10,padding:20,marginBottom:16}}>
        <SectionHeader title="Department Performance Matrix" sub="Avg composite score, PIP count & savings potential"/>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.DEPT_STATS} margin={{top:0,right:0,bottom:0,left:0}}>
            <CartesianGrid stroke="#1A3260" strokeDasharray="3 3"/>
            <XAxis dataKey="dept" tick={{fill:"#8A95A8",fontSize:10}}/>
            <YAxis domain={[0,100]} tick={{fill:"#8A95A8",fontSize:9}}/>
            <Tooltip contentStyle={{background:"#060F20",border:`1px solid #C9A84C30`,borderRadius:8,fontSize:12}}/>
            <Bar dataKey="avg" name="Avg Score" fill="#C9A84C" opacity={0.85} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        background:"linear-gradient(135deg,#0E1F3D,#132545)",
        border:`1px solid #C9A84C40`,borderRadius:10,padding:20,
        display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20
      }}>
        <div>
          <div style={{fontSize:11,color:"#8A95A8",letterSpacing:"0.8px",marginBottom:6}}>INVESTOR NARRATIVE</div>
          <div style={{fontSize:13,color:"#C2C8D4",lineHeight:1.7}}>
            Optimising the workforce to a lean, AI-augmented model is projected to increase revenue-per-head from <span style={{color:"#E2C47A",fontWeight:600}}>${(COMPANY_KPIs.revenuePerHead/1000).toFixed(0)}K</span> to <span style={{color:"#E2C47A",fontWeight:600}}>$580K+</span>, directly improving EBITDA margins and long-term equity value.
          </div>
        </div>
        <div>
          <div style={{fontSize:11,color:"#8A95A8",letterSpacing:"0.8px",marginBottom:6}}>SHARE PRICE IMPACT (PROJECTED)</div>
          <div style={{fontSize:32,fontWeight:700,color:"#2ECC71"}}>{COMPANY_KPIs.shareImpact}</div>
          <div style={{fontSize:12,color:"#8A95A8"}}>12-month post-optimisation estimate</div>
        </div>
        <div>
          <div style={{fontSize:11,color:"#8A95A8",letterSpacing:"0.8px",marginBottom:6}}>KEY RISK FLAGS</div>
          <div style={{fontSize:13,color:"#E74C3C",fontWeight:600,marginBottom:4}}>{data.COMPANY_KPIs.pipCount} employees on PIP pathway</div>
          <div style={{fontSize:13,color:"#F39C12",fontWeight:600,marginBottom:4}}>{data.EMPLOYEES.filter(e=>e.aiReplaceability>75).length} high AI-replaceability roles</div>
          <div style={{fontSize:13,color:"#1ABC9C",fontWeight:600}}>{data.COMPANY_KPIs.highCount} top performers to retain</div>
        </div>
      </div>
    </div>
  );
}
