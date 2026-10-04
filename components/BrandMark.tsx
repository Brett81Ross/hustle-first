import Link from "next/link";
export default function BrandMark({compact=false}:{compact?:boolean}){return <Link className={compact?"brand-lockup compact":"brand-lockup"} href="/"><span className="hf-emblem" aria-hidden="true"><span>HF</span></span><span className="brand-words"><strong>HUSTLE</strong><em>FIRST</em></span></Link>}
