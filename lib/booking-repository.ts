import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { db } from "./db";

async function uid(){const {userId}=await auth();if(!userId)throw new Error("Unauthorized");return userId}
export function slots(a:{startsAt:Date;endsAt:Date;slotMinutes:number;bookings:{startsAt:Date;status:string}[]}){
 const taken=new Set(a.bookings.filter(b=>b.status==="booked").map(b=>b.startsAt.getTime()));
 const out:Date[]=[]; const step=a.slotMinutes*60000;
 for(let t=a.startsAt.getTime();t+step<=a.endsAt.getTime();t+=step)if(t>Date.now()&&!taken.has(t))out.push(new Date(t));
 return out;
}
export async function createAvailability(input:{listingId:string;label:string;startsAt:string;endsAt:string;slotMinutes:number;priceCents:number|null;isCommunityService:boolean}){
 const userId=await uid(), start=new Date(input.startsAt),end=new Date(input.endsAt);
 if(!input.label.trim()||!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||end<=start)throw new Error("Check the availability times.");
 if(!Number.isInteger(input.slotMinutes)||input.slotMinutes<10||input.slotMinutes>480)throw new Error("Appointment length must be 10–480 minutes.");
 const listing=await db.marketplaceListing.findFirst({where:{id:input.listingId,ownerId:userId,category:"services"},select:{id:true,priceCents:true}});
 if(!listing)throw new Error("Service listing not found.");
 const price=input.isCommunityService?null:(input.priceCents??listing.priceCents);
 return db.bookingAvailability.create({data:{listingId:listing.id,ownerId:userId,label:input.label.trim().slice(0,80),startsAt:start,endsAt:end,slotMinutes:input.slotMinutes,priceCents:price,isCommunityService:input.isCommunityService}});
}
export async function deleteAvailability(id:string){const userId=await uid();return (await db.bookingAvailability.deleteMany({where:{id,ownerId:userId}})).count===1}
export async function listingBookingView(listingId:string){
 const listing=await db.marketplaceListing.findFirst({where:{id:listingId,status:"active"},select:{id:true,title:true,description:true,category:true,priceCents:true,ownerId:true}});
 if(!listing||listing.category!=="services")return null;
 const availability=await db.bookingAvailability.findMany({where:{listingId,endsAt:{gt:new Date()}},include:{bookings:{select:{startsAt:true,status:true}}},orderBy:{startsAt:"asc"}});
 return {listing,availability:availability.map(a=>({...a,slots:slots(a) }))};
}
export async function bookSlot(availabilityId:string,startText:string){
 const customerId=await uid(),start=new Date(startText); if(!Number.isFinite(start.getTime()))throw new Error("Invalid appointment time.");
 const a=await db.bookingAvailability.findUnique({where:{id:availabilityId},include:{listing:{select:{status:true,category:true}}}});
 if(!a||a.listing.status!=="active"||a.listing.category!=="services")throw new Error("Appointment is unavailable.");
 if(a.ownerId===customerId)throw new Error("You cannot book your own service.");
 const step=a.slotMinutes*60000,end=new Date(start.getTime()+step);
 if(start<a.startsAt||end>a.endsAt||(start.getTime()-a.startsAt.getTime())%step!==0||start<=new Date())throw new Error("Appointment is unavailable.");
 try{return await db.serviceBooking.create({data:{availabilityId:a.id,listingId:a.listingId,providerId:a.ownerId,customerId,startsAt:start,endsAt:end,label:a.label,priceCents:a.priceCents,isCommunityService:a.isCommunityService}})}
 catch(e){if(e instanceof Prisma.PrismaClientKnownRequestError&&e.code==="P2002")throw new Error("That time was just booked. Pick another time.");throw e}
}
export async function myBookings(){const userId=await uid();return db.serviceBooking.findMany({where:{OR:[{providerId:userId},{customerId:userId}]},include:{listing:{select:{title:true}},availability:{select:{label:true}}},orderBy:{startsAt:"asc"},take:100})}
export async function cancelBooking(id:string){const userId=await uid();const r=await db.serviceBooking.updateMany({where:{id,status:"booked",OR:[{providerId:userId},{customerId:userId}]},data:{status:"cancelled"}});return r.count===1}
