"use client";
import {useEffect,useState} from "react";

const DEMO_VERSION="1";
const SEEN_KEY=`hf_demo_seen:${DEMO_VERSION}`;
const DISMISS_KEY=`hf_demo_dismissed:${DEMO_VERSION}`;

const steps=[
  ["Browse the marketplace","Use Sell, Trade, Free, and Services on the home screen or open Browse Marketplace to search what is available."],
  ["Create a listing","Tap New Listing, choose the listing type, add the details, and attach clear photos when the item or service needs them."],
  ["Manage My Hustle","Open My Hustle to review your listings and activity. Keep contact and meetup details current so people know how to reach you."],
  ["Messages and appointments","Use the app's message and appointment areas to keep service conversations and scheduling organized."],
  ["Share Hustle First","Use the built-in Share controls or QR code to invite another person into the marketplace."],
  ["Use Help anytime","Tap the ? button whenever you want this walkthrough again. The eventual demo video will live here too."]
];

export default function DemoHelp(){
  const[open,setOpen]=useState(false);
  const[dontShow,setDontShow]=useState(false);
  useEffect(()=>{
    try{
      const seen=localStorage.getItem(SEEN_KEY)==="1";
      const dismissed=localStorage.getItem(DISMISS_KEY)==="1";
      if(!seen&&!dismissed){
        const t=window.setTimeout(()=>{setOpen(true);localStorage.setItem(SEEN_KEY,"1")},900);
        return()=>window.clearTimeout(t);
      }
    }catch{}
  },[]);
  const close=()=>{
    try{if(dontShow)localStorage.setItem(DISMISS_KEY,"1")}catch{}
    setOpen(false);
  };
  return <>
    <button type="button" aria-label="How to use Hustle First" title="How to use Hustle First" onClick={()=>setOpen(true)}
      style={{position:"fixed",right:16,bottom:"calc(82px + env(safe-area-inset-bottom))",zIndex:1200,width:44,height:44,borderRadius:15,border:"1px solid rgba(132,255,198,.35)",background:"rgba(12,18,17,.94)",color:"#eafff3",fontWeight:950,fontSize:18,boxShadow:"0 12px 34px rgba(0,0,0,.38)",cursor:"pointer"}}>?</button>
    {open&&<div role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}
      style={{position:"fixed",inset:0,zIndex:1400,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,.76)",paddingTop:"env(safe-area-inset-top)"}}>
      <section role="dialog" aria-modal="true" aria-labelledby="hfDemoTitle"
        style={{width:"min(100%,760px)",maxHeight:"92vh",overflowY:"auto",background:"#0b0e0e",color:"#f6fff9",border:"1px solid rgba(132,255,198,.26)",borderBottom:0,borderRadius:"28px 28px 0 0",padding:"18px 16px calc(26px + env(safe-area-inset-bottom))",boxShadow:"0 -24px 70px rgba(0,0,0,.55)"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
          <div><div style={{fontSize:11,fontWeight:900,letterSpacing:".14em",color:"#72e5b1"}}>HUSTLE FIRST™ · HELP</div><h2 id="hfDemoTitle" style={{margin:"5px 0 0",fontSize:22}}>How to use Hustle First</h2></div>
          <button type="button" onClick={close} aria-label="Close help" style={{width:40,height:40,borderRadius:"50%",border:"1px solid #34423d",background:"#151b19",color:"#fff",fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        <p style={{margin:"10px 0 14px",color:"#aabbb3",fontSize:13,lineHeight:1.5}}>A quick walkthrough of the marketplace. You can skip this at any time and reopen it later with the ? button.</p>
        <div style={{border:"1px dashed #3c5b4e",borderRadius:18,padding:16,background:"#0f1513",color:"#aabbb3",fontSize:12,lineHeight:1.5}}>
          <strong style={{color:"#eafff3"}}>Demo video slot ready.</strong><br/>The written walkthrough works now. The final short screen-recorded tutorial can be added here once the interface is locked.
        </div>
        <div style={{display:"grid",gap:9,marginTop:14}}>
          {steps.map(([title,text],i)=><div key={title} style={{border:"1px solid #293631",borderRadius:16,padding:13,background:"#111715"}}>
            <strong style={{display:"block",fontSize:13,color:"#72e5b1"}}>{i+1}. {title}</strong>
            <span style={{display:"block",marginTop:4,color:"#b3c0ba",fontSize:12,lineHeight:1.45}}>{text}</span>
          </div>)}
        </div>
        <label style={{display:"flex",gap:9,alignItems:"flex-start",marginTop:14,color:"#9aa9a2",fontSize:12,lineHeight:1.4}}>
          <input type="checkbox" checked={dontShow} onChange={e=>setDontShow(e.target.checked)} style={{marginTop:2}}/>
          <span>Don’t show this automatically again. Help will always remain available from the ? button.</span>
        </label>
        <button type="button" onClick={close} style={{width:"100%",marginTop:14,border:0,borderRadius:14,padding:13,fontWeight:950,background:"linear-gradient(135deg,#72e5b1,#b9ff75)",color:"#07110c",cursor:"pointer"}}>Got it — Start Hustling</button>
      </section>
    </div>}
  </>;
}
