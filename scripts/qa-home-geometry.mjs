// Hustle First ABL-39: local browser geometry QA; no Vercel preview or deployment.
// Uses installed Chrome/Chromium and Node WebSocket. Captures real rendered UI, not a mockup.
import {spawn, execFileSync} from "node:child_process";
import {mkdirSync, writeFileSync, createWriteStream, existsSync as hasFile} from "node:fs";

// The homepage is a static Next.js output: inspect its actual rendered HTML locally,
// avoiding network-dependent Clerk middleware during QA.
import {createServer} from "node:http";
import {existsSync, readFileSync} from "node:fs";
import {resolve, extname, join, sep} from "node:path";
const PORT=38751, HOST="http://127.0.0.1:"+PORT;
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const root=process.cwd(), publicRoot=resolve(root,"public"), chunksRoot=resolve(root,".next/static"), htmlPath=resolve(root,".next/server/app/index.html");
if(!existsSync(htmlPath))throw Error("Next.js prerendered homepage missing at "+htmlPath);
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".webp":"image/webp",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".woff2":"font/woff2",".ico":"image/x-icon"};
const server=createServer((req,res)=>{
 const pathname=new URL(req.url??"/",HOST).pathname;
 let path=htmlPath,base=root;
 if(pathname!=="/"){
  if(pathname.startsWith("/_next/static/")){base=chunksRoot;path=resolve(chunksRoot,pathname.slice("/_next/static/".length));}
  else{base=publicRoot;path=resolve(publicRoot,pathname.slice(1));}
 }
 if(path!==base && !path.startsWith(base+sep) && path!==htmlPath){res.writeHead(403).end();return;}
 if(!existsSync(path)){res.writeHead(404).end();return;}
 try{const data=readFileSync(path);res.writeHead(200,{"Content-Type":mime[extname(path)]??"application/octet-stream","Cache-Control":"no-store"});res.end(data)}
 catch(e){res.writeHead(500).end(String(e))}
});
await new Promise((resolve,reject)=>{server.once("error",reject);server.listen(PORT,"127.0.0.1",resolve)});
console.log("Real built static homepage served at "+HOST);
let binary;
for(const candidate of ["google-chrome","google-chrome-stable","chromium","chromium-browser"]){
 try{binary=execFileSync("which",[candidate],{encoding:"utf8"}).trim();break}catch{}
}
if(!binary)throw new Error("Chrome/Chromium not on runner");
console.log("Launching browser "+binary);
const profile="/tmp/hf-layout-check-"+process.pid;
const diagnostics=createWriteStream("/tmp/hf-chrome-debug-"+process.pid+".log");
const chrome=spawn(binary,["--headless=new","--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--disable-gpu","--no-zygote","--disable-extensions","--no-first-run","--no-default-browser-check","--remote-debugging-port=0","--remote-allow-origins=*","--user-data-dir="+profile,"about:blank"],{stdio:["ignore","ignore","pipe"]});
chrome.stderr.pipe(diagnostics);
chrome.on("error",err=>console.error("Chrome launch error:",err.message));
async function connect(){
 let lastError="";
 for(let i=0;i<45;i++){
  try{
   const portFile=profile+"/DevToolsActivePort";
   if(hasFile(portFile)){
    const port=readFileSync(portFile,"utf8").split(/\r?\n/)[0].trim();
    const targets=await(await fetch("http://127.0.0.1:"+port+"/json/list",{signal:AbortSignal.timeout(1250)})).json();
    const page=targets.find(t=>t.type==="page"&&t.webSocketDebuggerUrl);
    if(page)return new WebSocket(page.webSocketDebuggerUrl);
   }
  }catch(e){lastError=String(e)}
  if(chrome.exitCode!==null)break;
  await sleep(250);
 }
 diagnostics.end();
 let errorLog="";try{errorLog=readFileSync("/tmp/hf-chrome-debug-"+process.pid+".log","utf8").slice(-2800)}catch{}
 throw new Error("Chrome DevTools unavailable. exit="+chrome.exitCode+" signal="+chrome.signalCode+"; "+lastError+"; log: "+errorLog);
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
  const logoCheck=await call("Runtime.evaluate",{returnByValue:true,expression:`(()=>{const i=document.querySelector('.exact-home-hero .hf-logo-svg');return i?{src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight}:null})()`});
  if(!logoCheck.result?.value?.loaded||!logoCheck.result.value.src?.includes("hf-approved-original-2026.webp"))violations.push("corrected HF image missing or failed to load");
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
}finally{try{ws?.close()}catch{}chrome.kill("SIGTERM");server.close()}
