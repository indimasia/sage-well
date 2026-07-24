import type { SVGProps } from "react";

/* Consistent 24px line icons, 1.5 stroke, currentColor. */
const base: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

type P = SVGProps<SVGSVGElement>;

/* ---- In-call control glyphs ---- */
export function Mic(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6" />
    </svg>
  );
}

export function MicOff(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M9 9v2a3 3 0 0 0 4.5 2.6M15 12.5V6a3 3 0 0 0-5.9-.7" />
      <path d="M6 11a6 6 0 0 0 9.3 5M18 11a6 6 0 0 1-.5 2.4M12 17v3.5M9 20.5h6" />
      <path d="m4 4 16 16" />
    </svg>
  );
}

export function VideoOff(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M15 10.5V8a2 2 0 0 0-2-2H8.5M4 6.5A2 2 0 0 0 3 8v8a2 2 0 0 0 2 2h8a2 2 0 0 0 1.5-.7" />
      <path d="m15 12 6-3v9l-4-2" />
      <path d="m3 3 18 18" />
    </svg>
  );
}

export function ScreenShare(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M9 20.5h6M12 16.5v4" />
      <path d="M12 8.5v4M10 10.5l2-2 2 2" />
    </svg>
  );
}

export function PhoneEnd(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 10.5c5-4 11.5-4 16.5 0 .9.7 1 1.6.5 2.4l-1.3 2c-.4.6-1.1.8-1.8.5l-2.4-1a1.4 1.4 0 0 1-.9-1.3v-1.4a10 10 0 0 0-6.2 0v1.4c0 .6-.35 1.1-.9 1.3l-2.4 1c-.7.3-1.4.1-1.8-.5l-1.3-2c-.5-.8-.4-1.7.5-2.4Z" />
    </svg>
  );
}

export function Home(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function CalendarDays(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
      <path d="M7.5 13h.01M12 13h.01M16.5 13h.01M7.5 17h.01M12 17h.01" />
    </svg>
  );
}

export function Users(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-3-4.9" />
    </svg>
  );
}

export function MessageSquare(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M4 5h16v11H8l-4 3.5V5Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}

export function FileText(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v4h4M9 12h6M9 16h6M9 8h2" />
    </svg>
  );
}

export function Settings(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" />
    </svg>
  );
}

export function Plus(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Clock(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function MapPin(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21c4.5-4.2 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 2.5 6.8 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Star(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
    </svg>
  );
}

export function CalendarX(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
      <path d="m10 13 4 4M14 13l-4 4" />
    </svg>
  );
}

export function ShieldAlert(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v5c0 4.2 2.9 7.4 7 8.6 4.1-1.2 7-4.4 7-8.6V6l-7-3Z" />
      <path d="M12 9v3.5M12 15.5h.01" />
    </svg>
  );
}

export function Scatter(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="6" height="6" rx="1.4" />
      <rect x="14.5" y="5.5" width="6" height="6" rx="1.4" />
      <rect x="6" y="14.5" width="6" height="6" rx="1.4" />
      <path d="M9 6h3.5M9.5 12.5l3-3M15 11.5v0" />
    </svg>
  );
}

export function Video(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 6-3v10l-6-3" />
    </svg>
  );
}

export function CalendarClock(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M20 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="M3 9h17M8 3v3M15 3v3" />
      <circle cx="17" cy="17" r="4" />
      <path d="M17 15.5V17l1 1" />
    </svg>
  );
}

export function Receipt(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M6 3h12v18l-2.4-1.4L13 21l-2.6-1.4L8 21l-2-1.4V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

export function LockMessage(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 21 12Z" />
      <rect x="9.5" y="10.5" width="5" height="4" rx="0.8" />
      <path d="M10.5 10.5v-1a1.5 1.5 0 0 1 3 0v1" />
    </svg>
  );
}

export function Notes(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="4.5" y="3" width="15" height="18" rx="2" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
      <path d="M4.5 3v0" />
    </svg>
  );
}

export function ShieldCheck(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v5c0 4.2 2.9 7.4 7 8.6 4.1-1.2 7-4.4 7-8.6V6l-7-3Z" />
      <path d="m9 11.5 2 2 4-4" />
    </svg>
  );
}

export function Lock(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5" />
    </svg>
  );
}

export function Database(p: P) {
  return (
    <svg {...base} {...p}>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
      <path d="M5 5.5v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" />
      <path d="M5 11.5v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" />
    </svg>
  );
}

export function AuditList(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M8 5h11M8 12h11M8 19h11" />
      <path d="m3 4.5 1.2 1.2L6.5 3.5M3 11.5l1.2 1.2 2.3-2.2M3 18.5l1.2 1.2 2.3-2.2" />
    </svg>
  );
}

export function Check(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="m5 12 4.5 4.5L19 6.5" />
    </svg>
  );
}

export function ArrowRight(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** SageWell mark — a sprig inside a rounded shield, warm + clinical. */
export function Logo(p: P) {
  return (
    <svg {...base} strokeWidth={1.6} {...p}>
      <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5v-6L12 2.5Z" />
      <path d="M12 16v-4.5M12 11.5c0-1.6-1.2-2.8-2.8-2.8M12 11.5c0-1.6 1.2-2.8 2.8-2.8" />
    </svg>
  );
}
