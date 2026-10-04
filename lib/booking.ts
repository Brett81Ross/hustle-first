export function parseAvailabilityInput(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Invalid availability.");
  const v=value as Record<string,unknown>;
  const label=String(v.label??"").trim().slice(0,80);
  const startsAt=new Date(String(v.startsAt??""));
  const endsAt=new Date(String(v.endsAt??""));
  const slotMinutes=Number(v.slotMinutes);
  const isCommunityService=Boolean(v.isCommunityService);
  const rawPrice=v.priceCents;
  const priceCents=isCommunityService?null:(rawPrice===null||rawPrice===""||rawPrice===undefined?null:Number(rawPrice));
  if(!label) throw new Error("Add a label.");
  if(Number.isNaN(startsAt.getTime())||Number.isNaN(endsAt.getTime())||endsAt<=startsAt) throw new Error("Choose a valid start and end time.");
  if(endsAt<=new Date()) throw new Error("Availability must end in the future.");
  if(!Number.isInteger(slotMinutes)||slotMinutes<10||slotMinutes>480) throw new Error("Appointment length must be 10 to 480 minutes.");
  if(priceCents!==null&&(!Number.isInteger(priceCents)||priceCents<0)) throw new Error("Invalid appointment price.");
  return {label,startsAt,endsAt,slotMinutes,isCommunityService,priceCents};
}
export function slotsFor(block:{startsAt:Date;endsAt:Date;slotMinutes:number;bookings:{startsAt:Date;status:string}[]}){
 const taken=new Set(block.bookings.filter(b=>b.status==="booked").map(b=>b.startsAt.getTime()));
 const out:{startsAt:Date;endsAt:Date}[]=[]; const step=block.slotMinutes*60000,now=Date.now();
 for(let t=block.startsAt.getTime();t+step<=block.endsAt.getTime();t+=step) if(t>now&&!taken.has(t)) out.push({startsAt:new Date(t),endsAt:new Date(t+step)});
 return out;
}
