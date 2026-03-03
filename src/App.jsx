import { useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const STATE_DATA = {
  NY: { name: "New York", voterTurnout: 58, orgs: 4200, comments: 12400, uninsured: 5.7, prevHosp: 42, lifeExp: 80.5 },
  TX: { name: "Texas", voterTurnout: 46, orgs: 2800, comments: 5600, uninsured: 17.3, prevHosp: 68, lifeExp: 76.5 },
  CA: { name: "California", voterTurnout: 56, orgs: 5100, comments: 14200, uninsured: 7.0, prevHosp: 38, lifeExp: 81.0 },
  MS: { name: "Mississippi", voterTurnout: 40, orgs: 680, comments: 1800, uninsured: 14.0, prevHosp: 82, lifeExp: 74.4 },
  MN: { name: "Minnesota", voterTurnout: 72, orgs: 3100, comments: 9800, uninsured: 4.2, prevHosp: 28, lifeExp: 81.1 },
  WV: { name: "W. Virginia", voterTurnout: 42, orgs: 420, comments: 1200, uninsured: 8.0, prevHosp: 88, lifeExp: 74.8 },
  MA: { name: "Massachusetts", voterTurnout: 68, orgs: 3800, comments: 11200, uninsured: 2.9, prevHosp: 30, lifeExp: 80.4 },
  FL: { name: "Florida", voterTurnout: 52, orgs: 3200, comments: 7400, uninsured: 12.0, prevHosp: 55, lifeExp: 79.0 },
  OH: { name: "Ohio", voterTurnout: 55, orgs: 2400, comments: 6200, uninsured: 6.5, prevHosp: 60, lifeExp: 77.0 },
  CO: { name: "Colorado", voterTurnout: 70, orgs: 2900, comments: 9200, uninsured: 6.8, prevHosp: 32, lifeExp: 80.2 },
};

const HEX_GRID = {
  AK:[0,0],HI:[1,5],ME:[11,0],VT:[9,1],NH:[10,1],WA:[1,1],MT:[3,1],ND:[5,1],MN:[6,1],WI:[7,1],MI:[8,1],NY:[9,2],MA:[10,2],OR:[1,2],ID:[2,2],WY:[3,2],SD:[5,2],IA:[6,2],IL:[7,2],IN:[8,2],PA:[9,3],CT:[10,3],RI:[11,2],CA:[1,3],NV:[2,3],CO:[3,3],NE:[5,3],MO:[6,3],KY:[7,3],OH:[8,3],WV:[9,4],NJ:[10,4],UT:[2,4],AZ:[3,4],NM:[4,4],KS:[5,4],AR:[6,4],TN:[7,4],VA:[8,4],DC:[9,5],DE:[10,5],MD:[11,4],OK:[5,5],LA:[6,5],MS:[7,5],AL:[8,5],NC:[9,6],SC:[10,6],TX:[5,6],GA:[8,6],FL:[9,7],
};

const NYC_NEIGHBORHOODS = [
  { id:"ues",name:"Upper East Side",borough:"Manhattan",x:52,y:32,vt:72,orgs:185,comments:2400,unins:3.2,prevH:18,le:86.4,col:"#2a9d6e" },
  { id:"mott-haven",name:"Mott Haven",borough:"Bronx",x:62,y:14,vt:34,orgs:28,comments:320,unins:14.8,prevH:72,le:74.1,col:"#c0392b",isTarget:true },
  { id:"park-slope",name:"Park Slope",borough:"Brooklyn",x:56,y:58,vt:68,orgs:142,comments:1980,unins:4.1,prevH:22,le:84.2,col:"#27ae60" },
  { id:"jamaica",name:"Jamaica",borough:"Queens",x:82,y:42,vt:38,orgs:45,comments:480,unins:12.3,prevH:65,le:76.8,col:"#d35400" },
  { id:"east-flatbush",name:"East Flatbush",borough:"Brooklyn",x:64,y:68,vt:42,orgs:52,comments:620,unins:11.0,prevH:58,le:78.2,col:"#e67e22" },
  { id:"wash-hts",name:"Washington Heights",borough:"Manhattan",x:46,y:18,vt:44,orgs:68,comments:890,unins:10.5,prevH:48,le:79.5,col:"#f39c12" },
  { id:"st-george",name:"St. George",borough:"Staten Island",x:28,y:72,vt:50,orgs:38,comments:520,unins:8.2,prevH:42,le:80.1,col:"#16a085" },
  { id:"astoria",name:"Astoria",borough:"Queens",x:68,y:30,vt:55,orgs:92,comments:1100,unins:7.5,prevH:35,le:81.0,col:"#2ecc71" },
];

const HOSPITAL_PEOPLE = [
    { id:"maria",name:"Maria Santos",role:"Patient & Parent Advocate",x:60,y:69,color:"#e74c3c",
    age:34,bg:"Home health aide, mother of two. Her son Mateo was diagnosed with elevated lead levels at age 4 — caught early because parents organized at city council to fund lead screening.",
    timeline:[
      {date:"Mar 2019",type:"health",title:"Son's behavioral issues flagged",detail:"Pediatrician orders lead test — this screening only exists because parents organized at city council."},
      {date:"Jun 2019",type:"health",title:"Mateo diagnosed: BLL 8 \u03BCg/dL",detail:"Neighboring zip codes without the advocacy-funded program have detection delays of 14 months."},
      {date:"Sep 2019",type:"civic",title:"First community board meeting",detail:"Maria testifies about housing conditions. Landlord cited for lead paint violations within 6 weeks."},
      {date:"Nov 2020",type:"civic",title:"Votes for the first time",detail:"Also volunteers as poll worker. District turnout increases 8% over 2016."},
      {date:"Mar 2021",type:"civic",title:"Participatory budgeting vote",detail:"Votes to fund mobile health van and doula program. Both win. Van serves 1,200 residents/year."},
      {date:"Aug 2021",type:"health",title:"28-day wait for primary care",detail:"Suspected thyroid issue. Specialist referral takes 6 more weeks. Misses 3 days of work (~$480)."},
      {date:"Jan 2022",type:"civic",title:"Testifies at state health hearing",detail:"Her testimony cited in a report recommending Medicaid rate increases for community health centers."},
      {date:"Jun 2023",type:"health",title:"Mateo's BLL drops to 3.5 \u03BCg/dL",detail:"Monitoring + housing remediation from Maria's advocacy cut exposure significantly."},
      {date:"Nov 2023",type:"civic",title:"Misses health board election",detail:"Working a double shift. Turnout: 6%. Dental funding dies in committee for the 4th straight year."},
    ]},
    { id:"dr-okafor",name:"Dr. Adaeze Okafor",role:"Primary Care Physician",x:29,y:36,color:"#2980b9",
    age:41,bg:"One of only 3 PCPs at the center, serving 850 patients each. Returned to the South Bronx after a decade in suburban practice.",
    timeline:[
      {date:"2018",type:"health",title:"Joins Mott Haven CHC",detail:"Patient panel immediately reaches 850 — triple the recommended 300-400 for quality care."},
      {date:"2019",type:"civic",title:"Testifies on Medicaid reimbursement",detail:"Tells legislators that low rates make recruiting impossible. Helps secure a 4% rate increase."},
      {date:"2020",type:"health",title:"COVID overwhelms the center",detail:"Mott Haven's hospitalization rate is 3x the Manhattan average. Works 14-hour days for months."},
      {date:"2021",type:"civic",title:"Organizes provider coalition",detail:"Brings together 12 community health centers to lobby collectively. Wins $2.4M in emergency staffing funds."},
      {date:"2023",type:"health",title:"Burnout forces reduced hours",detail:"No replacement hired. Wait times rise from 21 to 28 days. 200 patients reassigned to full colleagues."},
    ]},
  { id:"james",name:"James Whitfield",role:"Uninsured Patient",x:72,y:36,color:"#8e44ad",
    age:52,bg:"Construction worker without employer insurance. Makes too much for Medicaid, too little for marketplace. Relies on sliding-scale fees.",
    timeline:[
      {date:"Jan 2021",type:"health",title:"Persistent chest pain begins",detail:"Ignores it for 3 months — can't afford to miss work for an appointment."},
      {date:"Jun 2021",type:"health",title:"Visits community health center",detail:"Diagnosed with hypertension. Sliding-scale fee: $20 vs $250 at nearby hospital."},
      {date:"2022",type:"civic",title:"Insurance navigator workshop",detail:"Community org helps him find a plan he didn't know he qualified for. Premiums: $45/month."},
      {date:"2023",type:"health",title:"Checkups catch pre-diabetes",detail:"Early intervention. Without the navigator program (funded by advocacy), this goes undetected."},
    ]},
  { id:"sofia",name:"Sofia Chen",role:"Dental Patient, Age 9",x:30,y:71,color:"#e67e22",
    age:9,bg:"Third-grader with severe tooth decay. On the dental waitlist for 8 months. Her school's dental program was defunded when the health board election had 6% turnout.",
    timeline:[
      {date:"Sep 2022",type:"health",title:"School nurse flags dental pain",detail:"Sofia has 4 cavities and an abscess. Referred to community health center dental clinic."},
      {date:"Oct 2022",type:"health",title:"Placed on 8-month waitlist",detail:"Dental dept has 1 dentist for 2,100 patients. Funding proposal died in committee."},
      {date:"Mar 2023",type:"health",title:"ER visit for dental abscess",detail:"Cost to Medicaid: $1,800. A preventive filling would have been $120."},
      {date:"Jun 2023",type:"health",title:"Finally seen — 3 extractions needed",detail:"Dentist notes this was entirely preventable with earlier access."},
      {date:"Nov 2023",type:"civic",title:"Health board election — 6% turnout",detail:"Incumbent who blocked dental expansion runs unopposed. Sofia's mother didn't know the election existed."},
    ]},
];

const DEPARTMENTS = [
  { id:"primary",label:"Primary Care",x:14,y:22,w:30,h:28,wait:28,severity:"high",note:"1 PCP per 850 patients" },
  { id:"waiting",label:"Waiting Room",x:56,y:22,w:32,h:28,wait:null,severity:"low",note:"Average 2.5 hr wait" },
  { id:"pediatrics",label:"Pediatrics",x:46,y:55,w:28,h:28,wait:14,severity:"medium",note:"Advocacy-funded screening" },
  { id:"dental",label:"Dental",x:18,y:55,w:24,h:28,wait:56,severity:"critical",note:"Funding stalled 4 yrs" },
];

const sevColor = { low:"#a3a3a3", medium:"#f59e0b", high:"#ea580c", critical:"#dc2626" };
const typeColor = { health:"#dc2626", civic:"#2563eb" };

function engagementColor(t) { return t >= 65 ? "#15803d" : t >= 55 ? "#65a30d" : t >= 45 ? "#eab308" : "#dc2626"; }

function Pulse({ cx, cy, r = 6, color = "#dc2626" }) {
  return (<g>
    <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.15}>
      <animate attributeName="r" from={r} to={r*3.5} dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" from={0.5} to={0} dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx={cx} cy={cy} r={r} fill={color} stroke="#fff" strokeWidth={r*0.25} style={{cursor:"pointer"}} />
  </g>);
}

/* ═══════════ LEVEL 0: US HEX MAP ═══════════ */

function USMap({ hovered, onHover, onZoomNYC }) {
  const R=26, H=R*Math.sqrt(3), pX=R*2.05, pY=H*0.88, oX=70, oY=46;
  const hex = (cx,cy) => Array.from({length:6},(_,i)=>{const a=(Math.PI/180)*(60*i-30);return`${cx+R*Math.cos(a)},${cy+R*Math.sin(a)}`;}).join(" ");
  const nyPos = (()=>{const[c,r]=HEX_GRID.NY;return{x:oX+c*pX+(r%2===1?pX/2:0),y:oY+r*pY};})();

  return (
    <svg viewBox="0 0 760 480" style={{width:"100%",height:"100%"}}>
      {Object.entries(HEX_GRID).map(([st,[col,row]])=>{
        const cx=oX+col*pX+(row%2===1?pX/2:0), cy=oY+row*pY;
        const d=STATE_DATA[st], has=!!d, isH=hovered===st, isNY=st==="NY";
        return(<g key={st} onMouseEnter={()=>has&&onHover(st)} onMouseLeave={()=>onHover(null)} onClick={()=>isNY&&onZoomNYC()} style={{cursor:isNY?"pointer":"default"}}>
          <polygon points={hex(cx,cy)} fill={has?engagementColor(d.voterTurnout):"#e8e4dc"} stroke={isH?"#1a1a1a":"#faf8f3"} strokeWidth={isH?2.5:1.5} opacity={has?(isH?1:0.82):0.3} style={{transition:"all 0.2s"}} />
          <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",fill:has?"#fff":"#b0a999",fontWeight:600,pointerEvents:"none"}}>{st}</text>
        </g>);
      })}
      <g transform="translate(420,420)">
        <text y={-6} style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",fill:"#9ca3af",letterSpacing:1}}>VOTER TURNOUT</text>
        {[["#dc2626","< 45%"],["#eab308","45\u201354%"],["#65a30d","55\u201364%"],["#15803d","65%+"]].map(([c,l],i)=>(
          <g key={i} transform={`translate(${i*94},8)`}><rect width={14} height={14} rx={2} fill={c}/><text x={20} y={11} style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",fill:"#6b7280"}}>{l}</text></g>
        ))}
        <text y={38} style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",fill:"#b0a999"}}>Gray = no data in demo</text>
      </g>
    </svg>
  );
}

/* ═══════════ LEVEL 1: NYC MAP ═══════════ */

function NYCMap({ hovered, onHover, onZoomCenter }) {
  const boros = [
    {name:"Manhattan",path:"M 44 18 L 49 12 L 55 15 L 57 25 L 56 38 L 55 50 L 51 55 L 47 50 L 44 38 Z",f:"#eae6dd"},
    {name:"Brooklyn",path:"M 51 56 L 59 52 L 72 55 L 77 63 L 75 77 L 67 83 L 53 79 L 47 69 L 49 61 Z",f:"#e2ded4"},
    {name:"Queens",path:"M 59 24 L 74 20 L 90 26 L 94 40 L 90 53 L 78 57 L 63 53 L 57 40 L 57 30 Z",f:"#e5e1d7"},
    {name:"Bronx",path:"M 51 10 L 58 5 L 68 3 L 76 10 L 74 19 L 66 23 L 57 22 L 53 16 Z",f:"#ddd8ce"},
    {name:"Staten Island",path:"M 22 64 L 32 60 L 40 66 L 38 80 L 30 86 L 22 80 L 20 72 Z",f:"#e8e4dc"},
  ];

  return (
    <svg viewBox="0 0 110 95" style={{width:"100%",height:"100%"}}>
      <defs><radialGradient id="wg" cx="50%" cy="50%" r="60%"><stop offset="0%" stopColor="#f5f0e8"/><stop offset="100%" stopColor="#e8e4dc"/></radialGradient></defs>
      <rect width="110" height="95" fill="url(#wg)" />
      {boros.map(b=><path key={b.name} d={b.path} fill={b.f} stroke="#c8c3b8" strokeWidth={0.4}/>)}
      {[["Manhattan",48,36],["Brooklyn",62,68],["Queens",76,38],["Bronx",63,12],["Staten Is.",29,73]].map(([n,x,y])=>(
        <text key={n} x={x} y={y} textAnchor="middle" style={{fontSize:2.6,fontFamily:"'JetBrains Mono',monospace",fill:"#b0a999",letterSpacing:0.3}}>{n}</text>
      ))}
      {NYC_NEIGHBORHOODS.map(n=>{
        const isH=hovered===n.id, r=Math.max(1.8,Math.min(4.5,n.orgs/45));
        return(<g key={n.id} onMouseEnter={()=>onHover(n.id)} onMouseLeave={()=>onHover(null)} onClick={()=>n.isTarget&&onZoomCenter()} style={{cursor:n.isTarget?"pointer":"default"}}>
          <circle cx={n.x} cy={n.y} r={isH?r+1.2:r} fill={n.col} stroke={isH?"#1a1a1a":"rgba(255,255,255,0.7)"} strokeWidth={isH?0.8:0.4} opacity={isH?1:0.8} style={{transition:"all 0.15s"}} />
          {n.isTarget&&<Pulse cx={n.x} cy={n.y} r={1.2} color="#c0392b"/>}
        </g>);
      })}
      <g transform="translate(2,2)"><rect width={35} height={16} rx={1} fill="rgba(26,26,26,0.88)"/>
        <text x={3} y={4.5} style={{fontSize:1.8,fontFamily:"'JetBrains Mono',monospace",fill:"#9ca3af"}}>LIFE EXPECTANCY GAP (YEARS)</text>
        <text x={3} y={8} style={{fontSize:3.2,fontFamily:"'Playfair Display',Georgia,serif",fill:"#2a9d6e",fontWeight:800}}>86.4</text>
        <text x={13} y={8} style={{fontSize:1.8,fontFamily:"'JetBrains Mono',monospace",fill:"#6b7280"}}>UES</text>
        <text x={3} y={12.5} style={{fontSize:3.2,fontFamily:"'Playfair Display',Georgia,serif",fill:"#c0392b",fontWeight:800}}>74.1</text>
        <text x={13} y={12.5} style={{fontSize:1.8,fontFamily:"'JetBrains Mono',monospace",fill:"#6b7280"}}>Mott Haven</text>
      </g>
    </svg>
  );
}

/* ═══════════ LEVEL 2: HOSPITAL ═══════════ */

function PersonFig({x,y,color,variant="adult"}) {
  const s=0.45;
  return(<g transform={`translate(${x},${y}) scale(${s})`}>
    {variant==="child"?<>
      <circle cx={0} cy={0} r={2.4} fill={color}/><rect x={-2.5} y={3} width={5} height={7} rx={1.5} fill={color} opacity={0.85}/>
      <line x1={-2.5} y1={5} x2={-5} y2={8} stroke={color} strokeWidth={1.4} strokeLinecap="round"/>
      <line x1={2.5} y1={5} x2={5} y2={8} stroke={color} strokeWidth={1.4} strokeLinecap="round"/>
      <line x1={-1} y1={10} x2={-1.5} y2={15} stroke={color} strokeWidth={1.4} strokeLinecap="round"/>
      <line x1={1} y1={10} x2={1.5} y2={15} stroke={color} strokeWidth={1.4} strokeLinecap="round"/>
    </>:<>
      <circle cx={0} cy={0} r={3} fill={color}/><circle cx={-0.8} cy={-0.6} r={0.7} fill="#fff" opacity={0.3}/>
      <rect x={-3.5} y={4} width={7} height={10} rx={2} fill={color} opacity={0.85}/>
      {variant==="doctor"&&<rect x={-4} y={4} width={8} height={10} rx={2} fill="none" stroke="#fff" strokeWidth={0.5} opacity={0.4}/>}
      <line x1={-3.5} y1={6} x2={-6.5} y2={10} stroke={color} strokeWidth={1.6} strokeLinecap="round"/>
      <line x1={3.5} y1={6} x2={6.5} y2={10} stroke={color} strokeWidth={1.6} strokeLinecap="round"/>
      <line x1={-1.5} y1={14} x2={-2.2} y2={20} stroke={color} strokeWidth={1.6} strokeLinecap="round"/>
      <line x1={1.5} y1={14} x2={2.2} y2={20} stroke={color} strokeWidth={1.6} strokeLinecap="round"/>
    </>}
  </g>);
}

function HospitalScene({hoveredPerson,onHoverPerson,onClickPerson,hoveredDept,onHoverDept}) {
  return (
    <svg viewBox="0 0 100 96" style={{width:"100%",height:"100%"}}>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8f5ee"/><stop offset="100%" stopColor="#ede9e0"/></linearGradient>
        <pattern id="gp" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M 4 0 L 0 0 0 4" fill="none" stroke="#e2ded4" strokeWidth="0.1"/></pattern>
      </defs>
      <rect x={6} y={10} width={88} height={80} rx={1.5} fill="url(#bg)" stroke="#c8c3b8" strokeWidth={0.4}/>
      <rect x={6} y={10} width={88} height={80} fill="url(#gp)" opacity={0.4}/>
      <rect x={6} y={4} width={88} height={9} rx={1} fill="#1a1a1a"/>
      <rect x={47} y={1} width={6} height={4} rx={0.8} fill="#1a1a1a"/>
      <rect x={49.5} y={1.5} width={0.8} height={2.8} rx={0.3} fill="#dc2626"/>
      <rect x={48} y={2.3} width={4} height={0.8} rx={0.3} fill="#dc2626"/>
      <text x={50} y={9.5} textAnchor="middle" style={{fontSize:2.4,fontFamily:"'Libre Baskerville',Georgia,serif",fill:"#faf8f3",fontWeight:700,letterSpacing:0.2}}>MOTT HAVEN COMMUNITY HEALTH CENTER</text>
      <text x={50} y={12} textAnchor="middle" style={{fontSize:1.5,fontFamily:"'JetBrains Mono',monospace",fill:"#9ca3af"}}>8,400 patients · 62 staff · Est. 2004</text>
      <line x1={6} y1={52} x2={94} y2={52} stroke="#c8c3b8" strokeWidth={0.3}/>
      <text x={9} y={19} style={{fontSize:1.6,fontFamily:"'JetBrains Mono',monospace",fill:"#b0a999"}}>2F</text>
      <text x={9} y={57} style={{fontSize:1.6,fontFamily:"'JetBrains Mono',monospace",fill:"#b0a999"}}>1F</text>

      {DEPARTMENTS.map(d=>{const isH=hoveredDept===d.id;return(
        <g key={d.id} onMouseEnter={()=>onHoverDept(d.id)} onMouseLeave={()=>onHoverDept(null)}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={0.8} fill={isH?"#fff":"rgba(255,255,255,0.5)"} stroke={sevColor[d.severity]} strokeWidth={isH?0.7:0.35} strokeDasharray={d.severity==="critical"?"1.2,0.6":"none"} style={{transition:"all 0.15s"}}/>
          <text x={d.x+d.w/2} y={d.y+4.5} textAnchor="middle" style={{fontSize:2.4,fontFamily:"'Libre Baskerville',Georgia,serif",fill:"#374151",fontWeight:700}}>{d.label}</text>
          {d.wait!==null&&<><text x={d.x+d.w/2} y={d.y+8} textAnchor="middle" style={{fontSize:3.5,fontFamily:"'JetBrains Mono',monospace",fill:d.wait>30?"#dc2626":"#059669",fontWeight:700}}>{d.wait}</text>
            <text x={d.x+d.w/2} y={d.y+10.5} textAnchor="middle" style={{fontSize:1.5,fontFamily:"'JetBrains Mono',monospace",fill:"#9ca3af"}}>day wait</text></>}
          <text x={d.x+d.w/2} y={d.y+d.h-2.5} textAnchor="middle" style={{fontSize:1.6,fontFamily:"'JetBrains Mono',monospace",fill:"#9ca3af"}}>{d.note}</text>
        </g>);
      })}

      {HOSPITAL_PEOPLE.map(p=>(
        <g key={p.id} onMouseEnter={()=>onHoverPerson(p.id)} onMouseLeave={()=>onHoverPerson(null)} onClick={()=>onClickPerson(p.id)} style={{cursor:"pointer"}}>
          <PersonFig x={p.x} y={p.y} color={p.color} variant={p.id==="sofia"?"child":p.id==="dr-okafor"?"doctor":"adult"}/>
          <Pulse cx={p.x} cy={p.y-3} r={0.8} color={p.color}/>
          {hoveredPerson===p.id&&<g>
            <rect x={p.x-16} y={p.y-15} width={32} height={7} rx={1} fill="rgba(26,26,26,0.92)"/>
            <text x={p.x} y={p.y-11.2} textAnchor="middle" style={{fontSize:2.4,fontFamily:"'Libre Baskerville',Georgia,serif",fill:"#fff",fontWeight:700}}>{p.name}</text>
            <text x={p.x} y={p.y-9} textAnchor="middle" style={{fontSize:1.7,fontFamily:"'JetBrains Mono',monospace",fill:"#d1d5db"}}>{p.role}</text>
          </g>}
        </g>
      ))}
      <text x={50} y={94} textAnchor="middle" style={{fontSize:1.8,fontFamily:"'Libre Baskerville',Georgia,serif",fill:"#b0a999",fontStyle:"italic"}}>Hover rooms for data · Click any person to explore their story</text>
    </svg>
  );
}

/* ═══════════ LEVEL 3: PERSON STORY ═══════════ */

function PersonStory({person}) {
  if(!person) return null;
  return (
    <div style={{padding:"28px 24px",maxWidth:640,margin:"0 auto"}}>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:24}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:person.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,color:"#fff",fontWeight:800}}>{person.name[0]}</span>
        </div>
        <div>
          <h3 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:800,color:"#1a1a1a",marginBottom:1}}>{person.name}, {person.age}</h3>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#6b7280"}}>{person.role}</p>
        </div>
      </div>
      <p style={{fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:14,lineHeight:1.75,color:"#4b5563",marginBottom:28}}>{person.bg}</p>
      <div style={{display:"flex",gap:16,marginBottom:20}}>
        {[["health","Health Event"],["civic","Civic Action"]].map(([k,l])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:9,height:9,borderRadius:2,background:typeColor[k]}}/><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#6b7280"}}>{l}</span>
          </div>))}
      </div>
      <div style={{position:"relative",paddingLeft:18}}>
        <div style={{position:"absolute",left:4.5,top:0,bottom:0,width:1.5,background:"#e5e1d8"}}/>
        {person.timeline.map((t,i)=>{const tc=typeColor[t.type];return(
          <div key={i} style={{position:"relative",marginBottom:20,paddingLeft:18,animation:`fadeIn 0.35s ease-out ${i*0.05}s both`}}>
            <div style={{position:"absolute",left:-3,top:3,width:12,height:12,borderRadius:"50%",background:tc,border:"2px solid #faf8f3"}}/>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9ca3af",marginBottom:2}}>{t.date}</div>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:3}}>{t.title}</div>
            <div style={{fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:13,lineHeight:1.7,color:"#4b5563",borderLeft:`2.5px solid ${tc}25`,paddingLeft:10}}>{t.detail}</div>
          </div>);})}
      </div>
      <div style={{background:"#1a1a1a",color:"#faf8f3",padding:"28px 24px",marginTop:32,textAlign:"center"}}>
        <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:16,fontWeight:700,lineHeight:1.45,marginBottom:10}}>
          {person.id==="maria"&&"Her son got screened because parents organized. Her housing got fixed because she testified. Her dental care stalled because nobody voted."}
          {person.id==="dr-okafor"&&"She came home to serve her community. Low reimbursement rates — set without local input — mean she carries triple the recommended patient load."}
          {person.id==="james"&&"He almost lost years of his life to a coverage gap. A navigator program, funded through local advocacy, caught him in time."}
          {person.id==="sofia"&&"She waited 8 months for a $120 filling. The ER visit cost $1,800. The dental program died in an election with 6% turnout."}
        </p>
        <p style={{fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:12,color:"#9ca3af"}}>Civic engagement isn't abstract — it is the mechanism by which need becomes care.</p>
      </div>
    </div>
  );
}

/* ═══════════ INFO PANEL ═══════════ */

function InfoPanel({level,data}) {
  if(!data) return null;
  const st = level===0 ? (()=>{const d=STATE_DATA[data];if(!d)return null;return(
    <div><h4 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:16,fontWeight:800,marginBottom:10}}>{d.name}</h4>
      {[["Voter Turnout",`${d.voterTurnout}%`,d.voterTurnout,"#2563eb"],["Community Orgs",d.orgs.toLocaleString(),d.orgs/60,"#7c3aed"],["Public Comments",d.comments.toLocaleString(),d.comments/160,"#0891b2"]].map(([l,v,bar,c])=>(
        <div key={l} style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#6b7280"}}>{l}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:600,color:"#1a1a1a"}}>{v}</span></div>
          <div style={{height:3,background:"#f0ede6",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,bar)}%`,background:c,borderRadius:2,transition:"width 0.4s"}}/></div>
        </div>))}
      <div style={{borderTop:"1px solid #e5e1d8",paddingTop:8,marginTop:6}}>
        {[["Uninsured",`${d.uninsured}%`,d.uninsured>10],["Prev. Hosp.",`${d.prevHosp}/10K`,d.prevHosp>50],["Life Exp.",`${d.lifeExp} yrs`,d.lifeExp<77]].map(([l,v,bad])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#6b7280"}}>{l}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:bad?"#dc2626":"#059669"}}>{v}</span></div>
        ))}</div></div>);})() : level===1 ? (()=>{const n=NYC_NEIGHBORHOODS.find(nb=>nb.id===data);if(!n)return null;return(
    <div><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><div style={{width:10,height:10,borderRadius:"50%",background:n.col}}/><h4 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:15,fontWeight:800}}>{n.name}</h4></div>
      <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#9ca3af",marginBottom:10}}>{n.borough}</p>
      {[["Voter Turnout",`${n.vt}%`],["Community Orgs",n.orgs],["Comments/yr",n.comments.toLocaleString()],["Uninsured",`${n.unins}%`],["Life Expectancy",`${n.le} yrs`]].map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#6b7280"}}>{l}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:600,color:"#1a1a1a"}}>{v}</span></div>
      ))}</div>);})() : null;
  if(!st) return null;
  return(<div style={{position:"absolute",right:16,top:60,width:220,background:"#fff",border:"1px solid #e5e1d8",padding:18,zIndex:50,boxShadow:"0 4px 16px rgba(0,0,0,0.06)",animation:"fadeIn 0.15s ease-out"}}>{st}</div>);
}

/* ═══════════ NARRATIVE OVERLAY ═══════════ */

function NarrativeOverlay({level}) {
  const t = [{ch:"Chapter 1",title:"The National Picture",body:"States where residents vote more and attend public hearings have measurably better health outcomes. Hover any colored state. Click New York to zoom in."},
    {ch:"Chapter 2",title:"12 Miles, 12 Years",body:"In NYC, the gap between a life expectancy of 86 and 74 is a single subway ride. Hover neighborhoods, then click the pulsing dot in the Bronx."},
    {ch:"Chapter 3",title:"Inside the Walls",body:"Every department tells a story about civic power — or its absence. Hover rooms for details. Click any person to follow their story."}][level];
  if(!t) return null;
  return(<div style={{position:"absolute",left:16,bottom:16,maxWidth:300,zIndex:50,background:"rgba(250,248,243,0.94)",backdropFilter:"blur(6px)",padding:"16px 20px",border:"1px solid #e5e1d8"}}>
    <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#9ca3af",marginBottom:4}}>{t.ch}</p>
    <h3 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:15,fontWeight:800,color:"#1a1a1a",lineHeight:1.25,marginBottom:6}}>{t.title}</h3>
    <p style={{fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:11.5,lineHeight:1.6,color:"#4b5563"}}>{t.body}</p>
  </div>);
}

/* ═══════════ APP ═══════════ */

export default function App() {
  const [level,setLevel] = useState(-1);
  const [phase,setPhase] = useState("idle");
  const [hovState,setHovState] = useState(null);
  const [hovHood,setHovHood] = useState(null);
  const [hovPerson,setHovPerson] = useState(null);
  const [hovDept,setHovDept] = useState(null);
  const [selectedPerson,setSelectedPerson] = useState(null);

  const zoomTo = useCallback((nl,pid)=>{
    setPhase("out");
    setTimeout(()=>{
      setLevel(nl);
      if(pid!==undefined) setSelectedPerson(pid?HOSPITAL_PEOPLE.find(p=>p.id===pid):null);
      setHovState(null);setHovHood(null);setHovPerson(null);setHovDept(null);
      setPhase("in");
      setTimeout(()=>setPhase("idle"),450);
    },400);
  },[]);

  const crumbs=["U.S. Map","New York City","Health Center"];
  if(level===3&&selectedPerson) crumbs.push(selectedPerson.name);

  const anim = phase==="out"
    ?{opacity:0,transform:"scale(1.6)",transition:"all 0.4s cubic-bezier(0.4,0,1,1)"}
    :phase==="in"
    ?{opacity:1,transform:"scale(1)",transition:"all 0.45s cubic-bezier(0,0,0.2,1)"}
    :{opacity:1,transform:"scale(1)"};

  return (
    <div style={{width:"100vw",height:"100vh",overflow:"hidden",background:"#faf8f3",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:2px;}
      `}</style>

      {level===-1&&(
        <div style={{...anim,position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:24,background:"linear-gradient(180deg,#faf8f3,#f0ede6)"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"#9ca3af",marginBottom:20}}>A Visual Investigation</p>
          <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(38px,6.5vw,68px)",fontWeight:900,lineHeight:1.06,color:"#1a1a1a",letterSpacing:"-0.02em",marginBottom:20}}>Civic Health<br/>Alliance</h1>
          <p style={{fontFamily:"'Libre Baskerville',Georgia,serif",fontSize:"clamp(14px,1.8vw,18px)",lineHeight:1.7,color:"#6b7280",maxWidth:460,marginBottom:44}}>How voter turnout, community organizing, and public testimony shape the healthcare communities receive — from nation to neighborhood to hospital to a single human life.</p>
          <button onClick={()=>zoomTo(0)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,padding:"14px 40px",background:"#1a1a1a",border:"none",color:"#faf8f3",cursor:"pointer",letterSpacing:2,textTransform:"uppercase"}}>Begin</button>
        </div>
      )}

      {level>=0&&(
        <nav style={{position:"absolute",top:0,left:0,right:0,height:44,zIndex:100,background:"rgba(26,26,26,0.92)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",padding:"0 16px",gap:6}}>
          <button onClick={()=>zoomTo(-1)} style={{background:"none",border:"none",fontFamily:"'Playfair Display',Georgia,serif",fontSize:13,fontWeight:800,color:"#faf8f3",cursor:"pointer",marginRight:6}}>Civic Health Alliance</button>
          {crumbs.slice(0,level+1).map((l,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:"#555",fontSize:11}}>›</span>
              <button onClick={()=>i<=2?zoomTo(i,null):null} style={{background:"none",border:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:i===level?"#faf8f3":"#777",cursor:i<level?"pointer":"default",textDecoration:i<level?"underline":"none",textUnderlineOffset:3}}>{l}</button>
            </span>))}
        </nav>
      )}

      {level>=0&&level<=2&&(
        <div style={{...anim,position:"absolute",inset:0,paddingTop:44}}>
          <div style={{width:"100%",height:"100%",position:"relative"}}>
            {level===0&&<USMap hovered={hovState} onHover={setHovState} onZoomNYC={()=>zoomTo(1)}/>}
            {level===1&&<div style={{width:"100%",height:"100%",background:"#e8e4dc"}}><NYCMap hovered={hovHood} onHover={setHovHood} onZoomCenter={()=>zoomTo(2)}/></div>}
            {level===2&&<HospitalScene hoveredPerson={hovPerson} onHoverPerson={setHovPerson} onClickPerson={(id)=>zoomTo(3,id)} hoveredDept={hovDept} onHoverDept={setHovDept}/>}
            <NarrativeOverlay level={level}/>
            <InfoPanel level={level} data={level===0?hovState:level===1?hovHood:null}/>
          </div>
        </div>
      )}

      {level===3&&selectedPerson&&(
        <div style={{...anim,position:"absolute",inset:0,paddingTop:44,overflowY:"auto",background:"#faf8f3"}}>
          <PersonStory person={selectedPerson}/>
          <div style={{textAlign:"center",paddingBottom:36,marginTop:8}}>
            <button onClick={()=>zoomTo(2,null)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,padding:"10px 24px",background:"transparent",border:"1.5px solid #1a1a1a",cursor:"pointer",letterSpacing:1.5,textTransform:"uppercase"}}>← Back to Health Center</button>
          </div>
        </div>
      )}
    </div>
  );
}
