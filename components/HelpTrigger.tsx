"use client";
export default function HelpTrigger(){return <button type="button" className="footer-help" onClick={()=>window.dispatchEvent(new Event("hf:help-open"))}>Help</button>}
