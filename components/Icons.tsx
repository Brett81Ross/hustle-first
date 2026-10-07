import type {SVGProps} from "react";
type P=SVGProps<SVGSVGElement>;
const base=(children:React.ReactNode,p:P)=> <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>{children}</svg>;
export function MenuIcon(p:P){return base(<><path d="M4 7h16M4 12h16M4 17h16"/></>,p)}
export function BellIcon(p:P){return base(<><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 20h4"/></>,p)}
export function HomeIcon(p:P){return base(<><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9h13v-9"/></>,p)}
export function SearchIcon(p:P){return base(<><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>,p)}
export function PlusIcon(p:P){return base(<><path d="M12 5v14M5 12h14"/></>,p)}
export function MessageIcon(p:P){return base(<><path d="M4 5h16v11H9l-5 4z"/></>,p)}
export function UserIcon(p:P){return base(<><circle cx="12" cy="8" r="4"/><path d="M4.5 20c1.2-4 3.7-6 7.5-6s6.3 2 7.5 6"/></>,p)}
export function TagIcon(p:P){return base(<><path d="M3 12V5h7l10 10-7 7z"/><circle cx="7.5" cy="8.5" r="1"/></>,p)}
export function SwapIcon(p:P){return base(<><path d="M7 7h12l-3-3M17 17H5l3 3"/></>,p)}
export function GiftIcon(p:P){return base(<><rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M3 9h18M12 9H8.5C6 9 6 5 8.5 5 10.5 5 12 9 12 9Zm0 0h3.5C18 9 18 5 15.5 5 13.5 5 12 9 12 9Z"/></>,p)}
export function GearIcon(p:P){return base(<><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></>,p)}
export function ArrowRightIcon(p:P){return base(<><path d="M5 12h14M14 7l5 5-5 5"/></>,p)}
export function ArrowLeftIcon(p:P){return base(<><path d="M19 12H5M10 7l-5 5 5 5"/></>,p)}
export function ChartIcon(p:P){return base(<><path d="M5 20V10M12 20V4M19 20v-7"/></>,p)}
export function ShareIcon(p:P){return base(<><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4"/></>,p)}
export function CameraIcon(p:P){return base(<><path d="M4 8h4l2-3h4l2 3h4v11H4z"/><circle cx="12" cy="13" r="3.5"/></>,p)}
