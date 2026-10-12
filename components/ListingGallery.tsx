"use client";
import {useState} from "react";
import BrandMark from "./BrandMark";
import {GearIcon,TagIcon} from "./Icons";

type Photo={id:string;url:string};
export default function ListingGallery({photos,title,category,label}:{photos:Photo[];title:string;category:string;label:string}){
  const [selected,setSelected]=useState(0);
  const index=Math.min(selected,Math.max(0,photos.length-1));
  const active=photos[index];
  if(!active)return <div className="mock-detail-gallery"><div className="mock-detail-empty"><BrandMark compact/><p>No photo added yet.</p></div></div>;
  return <div className="mock-detail-gallery">
    <div className="mock-detail-main">
      <img src={active.url} alt={title+" — photo "+(index+1)}/>
      <span className={"mock-badge "+category}>{category==="services"?<GearIcon/>:<TagIcon/>} {label}</span>
      {photos.length>1&&<span className="mock-gallery-count">{index+1} / {photos.length}</span>}
    </div>
    {photos.length>1&&<div className="mock-detail-thumbs" role="group" aria-label="Listing photo gallery">
      {photos.map((p,i)=><button key={p.id} type="button" className={index===i?"active":""} onClick={()=>setSelected(i)} aria-label={"View photo "+(i+1)+" of "+photos.length} aria-pressed={index===i}><img src={p.url} alt={"Preview photo "+(i+1)}/></button>)}
    </div>}
  </div>;
}
