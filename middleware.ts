import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute=createRouteMatcher(["/client(.*)","/api/client(.*)"]);
const isAuthRoute=createRouteMatcher(["/sign-in(.*)","/sign-up(.*)"]);

export default clerkMiddleware(async(auth,request)=>{
 const {userId}=await auth();
 if(isProtectedRoute(request)) await auth.protect();
 if(userId&&isAuthRoute(request)) return Response.redirect(new URL("/client",request.url));
});
export const config={matcher:["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)","/__clerk/(.*)"]};