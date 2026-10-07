import Link from "next/link";import HFLogo from "./HFLogo";
export default function BrandMark({compact=false}:{compact?:boolean}){return <Link className={compact?"brand-lockup compact":"brand-lockup"} href="/"><HFLogo small={compact}/><span className="brand-words"><strong>HUSTLE</strong><em>FIRST</em></span></Link>}
