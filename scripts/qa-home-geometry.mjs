// Hustle First ABL-39: local browser geometry QA; no Vercel preview or deployment.
// Uses installed Chrome/Chromium and Node WebSocket. Captures real rendered UI, not a mockup.
import {spawn, execFileSync} from "node:child_process";
import {mkdirSync, writeFileSync} from "node:fs";

const HOST="http://127.0.0.1:3000";
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
let binary;
for(const candidate of ["google-chrome","google-chrome-stable","chromium","chromium-browser"]){
  try{binary=execFileSync("which",[candidate],{encoding:"utf8"}).trim();break}catch{}
}
if(!binary)throw new Error("No Chrome/Chromium installed on this runner.");

for(let i=0;i<16;i++){
 try{const res=await fetch(HOST,{signal:AbortSignal.timeout(2500)});if(res.ok)break;if(i===15)throw new Error("App unhealthy: "+res.status)}catch(e){if(i===15)throw e}await sleep(300);
}

console.log('App is responding; launching '+binary);
const chrome=spawn(binary,["--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=9229","--remote-allow-origins=*","--user-data-dir=/tmp/hf-layout-check-"+process.pid,"about:blank"],{stdio:"ignore"});
async function connect(){
 for(let i=0;i<20;i++){
  try{
   const targets=await(await fetch("http://127.0.0.1:9229/json/list",{signal:AbortSignal.timeout(1500)})).json();
   const page=targets.find(t=>t.type==="page"&&t.webSocketDebuggerUrl);
   if(page)return new WebSocket(page.webSocketDebuggerUrl);
  }catch{}
  await sleep(250);
 }
 throw new Error("Chrome DevTools unavailable.");
}
let ws;
let serial=0;const pending=new Map();
try{
 ws=await connect();
 await new Promise((resolve,reject)=>{if(ws.readyState===WebSocket.OPEN)return resolve();const timeout=setTimeout(()=>reject(new Error("Chrome WebSocket open timeout")),8000);ws.addEventListener("open",()=>{clearTimeout(timeout);resolve()},{once:true});ws.addEventListener("error",e=>{clearTimeout(timeout);reject(e)},{once:true});ws.addEventListener("close",()=>{clearTimeout(timeout);reject(new Error("Chrome DevTools socket closed before opening"))},{once:true})});
 ws.addEventListener("message",ev=>{const m=JSON.parse(ev.data);if(!m.id)return;const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result)});
 function call(method,params={}){const id=++serial;return new Promise((resolve,reject)=>{const timeout=setTimeout(()=>{pending.delete(id);reject(new Error("CDP timed out: "+method))},14000);pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value)},reject:error=>{clearTimeout(timeout);reject(error)}});ws.send(JSON.stringify({id,method,params}))})}
 await call("Page.enable");
 await call("Runtime.enable");
 await call("Page.addScriptToEvaluateOnNewDocument",{source:"try{localStorage.setItem('hf_demo_seen:1','1');localStorage.setItem('hf_demo_dismissed:1','1')}catch{}"});
 mkdirSync("qa-artifacts",{recursive:true});
 const sizes=[{name:"android-short",width:320,height:580},{name:"android-phone",width:390,height:640},{name:"android-tall",width:390,height:844},{name:"fold-open",width:736,height:910}];
 for(const {name,width,height} of sizes){
  await call("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:true});
  await call("Page.navigate",{url:HOST+"/"});
  await sleep(2400);
  const out=await call("Runtime.evaluate",{returnByValue:true,expression:`(()=>{
   const rect=(selector)=>{const e=document.querySelector(selector);if(!e)return null;const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,width:r.width,left:r.left,right:r.right}};
   const fixedHelp=[...document.querySelectorAll('button')].some(e=>e.textContent?.trim()==='?'&&getComputedStyle(e).position==='fixed');
   const button=document.querySelector('.home-menu-wrap button[aria-label="Menu"]');
   return {width:innerWidth,height:innerHeight,pageWidth:document.documentElement.scrollWidth,header:rect('.exact-home-hero .mockup-topbar'),hero:rect('.exact-urban-hero'),categories:rect('.exact-category-grid'),firstAction:rect('.exact-actions .mockup-action'),nav:rect('.bottom-nav'),helpFixed:fixedHelp,helpFooter:!!document.querySelector('.footer-help'),menuButton:!!button};
  })()`});
  const m=out.result?.value;
  if(!m||!m.header||!m.hero||!m.nav||!m.firstAction)throw Error(name+": required elements missing");
  const headerMax=width<450?113:150,heroMax=width<450?260:310;
  const violations=[];
  if(m.pageWidth>width+2)violations.push("horizontal overflow: "+m.pageWidth+" > "+width);
  if(m.header.height>headerMax)violations.push("header too tall: "+m.header.height+" > "+headerMax);
  if(m.hero.height>heroMax)violations.push("hero too tall: "+m.hero.height+" > "+heroMax);
  if(m.firstAction.bottom>m.nav.top)violations.push("first action hidden behind bottom navigation");
  if(m.helpFixed)violations.push("fixed help overlaps interface");
  if(!m.helpFooter||!m.menuButton)violations.push("accessible Help trigger missing");
  console.log(name+" "+JSON.stringify({...m,violations}));
  const ss=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
  writeFileSync("qa-artifacts/"+name+".png",Buffer.from(ss.data,"base64"));
  writeFileSync("qa-artifacts/"+name+".json",JSON.stringify({...m,violations},null,2));
  if(violations.length)throw Error(name+": "+violations.join("; "));
 }
}finally{try{ws?.close()}catch{}chrome.kill("SIGTERM")}
