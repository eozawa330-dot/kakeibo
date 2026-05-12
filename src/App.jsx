import { useState, useCallback, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// ─── Design Tokens ─────────────────────────────────────────────────────────
const BG  = "#EEF0F5";
const BG2 = "#E8EAF0";
const WHITE = "#FFFFFF";
const PINK  = "#E879A0";
const PINK_GLOW = "rgba(232,121,160,0.22)";
const TEAL  = "#2DD4BF";
const TEAL2 = "#0D9488";
const TEAL3 = "#0F766E";
const TEAL_GLOW = "rgba(45,212,191,0.28)";
const GRAY  = "#94A3B8";
const DARK  = "#334155";
const DARKER = "#1E293B";

const neuShadow    = (s=8) => `${s}px ${s}px ${s*2.2}px rgba(163,177,198,0.52), -${s}px -${s}px ${s*2}px rgba(255,255,255,0.92)`;
const neuInsetShadow=(s=6) => `inset ${s}px ${s}px ${s*2}px rgba(163,177,198,0.50), inset -${s}px -${s}px ${s*2}px rgba(255,255,255,0.88)`;

const neuCard  = { background:BG, borderRadius:24, boxShadow:neuShadow(10) };
const neuInset = (s=6) => ({ background:BG2, boxShadow:neuInsetShadow(s) });

const ACCENT_GRAD = `linear-gradient(135deg, ${TEAL} 0%, ${TEAL2} 50%, #0891B2 100%)`;
const ACCENT_SHADOW = `6px 6px 16px rgba(163,177,198,0.45), -4px -4px 10px rgba(255,255,255,0.9), 0 0 22px ${TEAL_GLOW}`;

// ─── 3D SVG Icons (18 types) ───────────────────────────────────────────────
const ICON_KEYS = ["coin","house","phone","food","star","wallet","pencil","chart","list","gear","car","heart","book","plane","shop","music","gym","pet"];

const Icon3D = ({ type = "star", size = 32 }) => {
  const s = size;
  const map = {
    coin: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="icoin1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#B45309"/></linearGradient>
          <linearGradient id="icoin2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="100%" stopColor="#FDE68A"/></linearGradient>
          <filter id="fcoin"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#B45309" floodOpacity="0.38"/></filter>
        </defs>
        <g filter="url(#fcoin)"><circle cx="24" cy="24" r="19" fill="url(#icoin1)"/><ellipse cx="21" cy="20" rx="13" ry="9" fill="url(#icoin2)" opacity="0.52"/></g>
        <text x="24" y="30" textAnchor="middle" fontSize="17" fontWeight="900" fill="#78350F" fontFamily="sans-serif">¥</text>
        <circle cx="24" cy="24" r="19" stroke="white" strokeWidth="1.5" opacity="0.22"/>
      </svg>
    ),
    house: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ihouse1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDA4CF"/><stop offset="100%" stopColor="#DB2777"/></linearGradient>
          <linearGradient id="ihouse2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="100%" stopColor="#FCA5A5"/></linearGradient>
          <filter id="fhouse"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#DB2777" floodOpacity="0.30"/></filter>
        </defs>
        <g filter="url(#fhouse)"><polygon points="24,5 43,23 5,23" fill="url(#ihouse1)"/><rect x="9" y="23" width="30" height="20" rx="3" fill="url(#ihouse2)"/><rect x="19" y="30" width="10" height="13" rx="2" fill="url(#ihouse1)" opacity="0.5"/><polygon points="24,5 43,23 38,23" fill="white" opacity="0.20"/></g>
      </svg>
    ),
    phone: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="iphone1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#1D4ED8"/></linearGradient>
          <filter id="fphone"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#1D4ED8" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#fphone)"><rect x="12" y="4" width="24" height="40" rx="7" fill="url(#iphone1)"/><rect x="12" y="4" width="24" height="16" rx="7" fill="white" opacity="0.20"/><rect x="17" y="8" width="14" height="3" rx="1.5" fill="white" opacity="0.6"/></g>
        <circle cx="24" cy="39" r="3" fill="white" opacity="0.5"/>
      </svg>
    ),
    food: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ifood1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#EA580C"/></linearGradient>
          <filter id="ffood"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#EA580C" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#ffood)"><ellipse cx="24" cy="30" rx="19" ry="13" fill="url(#ifood1)"/><ellipse cx="24" cy="26" rx="19" ry="9" fill="#FEF3C7" opacity="0.6"/><ellipse cx="24" cy="26" rx="12" ry="5.5" fill="#F97316" opacity="0.52"/></g>
        <rect x="22" y="8" width="4" height="16" rx="2" fill="#16A34A"/>
        <ellipse cx="24" cy="8" rx="6" ry="4.5" fill="#4ADE80"/>
      </svg>
    ),
    star: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="istar1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#DDD6FE"/><stop offset="100%" stopColor="#6D28D9"/></linearGradient>
          <filter id="fstar"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#6D28D9" floodOpacity="0.32"/></filter>
        </defs>
        <g filter="url(#fstar)"><polygon points="24,4 29.5,18.5 44,18.5 32.5,27.5 37,42 24,33.5 11,42 15.5,27.5 4,18.5 18.5,18.5" fill="url(#istar1)"/><polygon points="24,4 29.5,18.5 44,18.5" fill="white" opacity="0.18"/></g>
        <circle cx="24" cy="24" r="5" fill="white" opacity="0.32"/>
      </svg>
    ),
    wallet: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="iwallet1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#047857"/></linearGradient>
          <linearGradient id="iwallet2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A7F3D0"/><stop offset="100%" stopColor="#34D399"/></linearGradient>
          <filter id="fwallet"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#047857" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#fwallet)"><rect x="4" y="14" width="40" height="26" rx="9" fill="url(#iwallet1)"/><rect x="4" y="14" width="40" height="12" rx="9" fill="white" opacity="0.18"/><rect x="28" y="22" width="16" height="12" rx="6" fill="url(#iwallet2)"/><circle cx="36" cy="28" r="3" fill="#047857"/></g>
      </svg>
    ),
    pencil: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ipencil1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDA4CF"/><stop offset="100%" stopColor="#DB2777"/></linearGradient>
          <linearGradient id="ipencil2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#F59E0B"/></linearGradient>
          <filter id="fpencil"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#DB2777" floodOpacity="0.32"/></filter>
        </defs>
        <g filter="url(#fpencil)" transform="rotate(-45 24 24)"><rect x="14" y="6" width="20" height="30" rx="4" fill="url(#ipencil1)"/><rect x="14" y="6" width="20" height="10" rx="4" fill="white" opacity="0.22"/><rect x="14" y="32" width="20" height="8" rx="2" fill="url(#ipencil2)"/><polygon points="14,40 24,48 34,40" fill="#92400E"/></g>
        <circle cx="34" cy="12" r="4" fill="white" opacity="0.45"/>
      </svg>
    ),
    chart: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ichart1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#059669"/></linearGradient>
          <linearGradient id="ichart2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#2563EB"/></linearGradient>
          <linearGradient id="ichart3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F9A8D4"/><stop offset="100%" stopColor="#DB2777"/></linearGradient>
          <filter id="fchart"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#2563EB" floodOpacity="0.26"/></filter>
        </defs>
        <g filter="url(#fchart)"><rect x="5" y="28" width="10" height="14" rx="3" fill="url(#ichart1)"/><rect x="19" y="20" width="10" height="22" rx="3" fill="url(#ichart2)"/><rect x="33" y="12" width="10" height="30" rx="3" fill="url(#ichart3)"/></g>
        <rect x="5" y="28" width="10" height="5" rx="3" fill="white" opacity="0.28"/><rect x="19" y="20" width="10" height="5" rx="3" fill="white" opacity="0.28"/><rect x="33" y="12" width="10" height="5" rx="3" fill="white" opacity="0.28"/>
      </svg>
    ),
    list: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ilist1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="100%" stopColor="#7C3AED"/></linearGradient>
          <filter id="flist"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#7C3AED" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#flist)"><rect x="5" y="8" width="38" height="34" rx="9" fill="url(#ilist1)"/><rect x="5" y="8" width="38" height="14" rx="9" fill="white" opacity="0.16"/></g>
        <circle cx="13" cy="21" r="3.5" fill="white" opacity="0.88"/><rect x="20" y="18.5" width="17" height="5" rx="2.5" fill="white" opacity="0.78"/>
        <circle cx="13" cy="32" r="3.5" fill="white" opacity="0.58"/><rect x="20" y="29.5" width="12" height="5" rx="2.5" fill="white" opacity="0.48"/>
      </svg>
    ),
    gear: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="igear1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#D97706"/></linearGradient>
          <filter id="fgear"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#D97706" floodOpacity="0.38"/></filter>
        </defs>
        <g filter="url(#fgear)">
          <path d="M20 4h8l2 6 5 2 5-4 6 6-4 5 2 5 6 2v8l-6 2-2 5 4 5-6 6-5-4-5 2-2 6h-8l-2-6-5-2-5 4-6-6 4-5-2-5-6-2v-8l6-2 2-5-4-5 6-6 5 4 5-2z" fill="url(#igear1)"/>
          <circle cx="24" cy="24" r="7" fill="white" opacity="0.82"/><circle cx="24" cy="24" r="4" fill="url(#igear1)" opacity="0.48"/>
        </g>
      </svg>
    ),
    car: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="icar1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#1E40AF"/></linearGradient>
          <filter id="fcar"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1E40AF" floodOpacity="0.32"/></filter>
        </defs>
        <g filter="url(#fcar)">
          <rect x="4" y="22" width="40" height="16" rx="5" fill="url(#icar1)"/>
          <path d="M10 22 L16 12 H32 L38 22Z" fill="#60A5FA"/>
          <path d="M10 22 L16 12 H24" fill="white" opacity="0.18"/>
          <rect x="16" y="14" width="16" height="8" rx="2" fill="#BAE6FD" opacity="0.7"/>
        </g>
        <circle cx="14" cy="37" r="5" fill="#1E293B"/><circle cx="14" cy="37" r="2.5" fill="#94A3B8"/>
        <circle cx="34" cy="37" r="5" fill="#1E293B"/><circle cx="34" cy="37" r="2.5" fill="#94A3B8"/>
      </svg>
    ),
    heart: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="iheart1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FCA5A5"/><stop offset="100%" stopColor="#DC2626"/></linearGradient>
          <filter id="fheart"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#DC2626" floodOpacity="0.35"/></filter>
        </defs>
        <g filter="url(#fheart)">
          <path d="M24 40 C24 40 6 28 6 17 C6 11 10.5 7 15.5 7 C18.5 7 21.5 8.5 24 11 C26.5 8.5 29.5 7 32.5 7 C37.5 7 42 11 42 17 C42 28 24 40 24 40Z" fill="url(#iheart1)"/>
          <path d="M24 40 C24 40 6 28 6 17 C6 11 10.5 7 15.5 7" stroke="white" strokeWidth="1" opacity="0.25" fill="none"/>
        </g>
        <ellipse cx="17" cy="15" rx="5" ry="4" fill="white" opacity="0.3" transform="rotate(-20 17 15)"/>
      </svg>
    ),
    book: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ibook1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#065F46"/></linearGradient>
          <filter id="fbook"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#065F46" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#fbook)">
          <rect x="8" y="5" width="28" height="38" rx="4" fill="url(#ibook1)"/>
          <rect x="8" y="5" width="28" height="14" rx="4" fill="white" opacity="0.18"/>
          <rect x="6" y="7" width="6" height="34" rx="3" fill="#047857"/>
        </g>
        <rect x="15" y="14" width="14" height="2.5" rx="1.2" fill="white" opacity="0.7"/>
        <rect x="15" y="20" width="10" height="2.5" rx="1.2" fill="white" opacity="0.5"/>
        <rect x="15" y="26" width="12" height="2.5" rx="1.2" fill="white" opacity="0.4"/>
      </svg>
    ),
    plane: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="iplane1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#BAE6FD"/><stop offset="100%" stopColor="#0284C7"/></linearGradient>
          <filter id="fplane"><feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#0284C7" floodOpacity="0.32"/></filter>
        </defs>
        <g filter="url(#fplane)" transform="rotate(-35 24 24)">
          <path d="M24 4 L32 20 H44 L36 26 L40 42 L24 34 L8 42 L12 26 L4 20 H16Z" fill="url(#iplane1)"/>
          <path d="M24 4 L32 20 H44" fill="white" opacity="0.2"/>
        </g>
      </svg>
    ),
    shop: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ishop1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FCD34D"/><stop offset="100%" stopColor="#B45309"/></linearGradient>
          <linearGradient id="ishop2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FEF3C7"/><stop offset="100%" stopColor="#FDE68A"/></linearGradient>
          <filter id="fshop"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#B45309" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#fshop)">
          <rect x="6" y="18" width="36" height="26" rx="4" fill="url(#ishop2)"/>
          <path d="M6 18 L10 8 H38 L42 18Z" fill="url(#ishop1)"/>
          <path d="M6 18 L10 8 H24" fill="white" opacity="0.2"/>
        </g>
        <rect x="18" y="28" width="12" height="16" rx="3" fill="url(#ishop1)" opacity="0.6"/>
        <rect x="10" y="26" width="8" height="8" rx="2" fill="url(#ishop1)" opacity="0.5"/>
        <rect x="30" y="26" width="8" height="8" rx="2" fill="url(#ishop1)" opacity="0.5"/>
      </svg>
    ),
    music: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="imusic1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F9A8D4"/><stop offset="100%" stopColor="#9D174D"/></linearGradient>
          <filter id="fmusic"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#9D174D" floodOpacity="0.32"/></filter>
        </defs>
        <g filter="url(#fmusic)">
          <rect x="18" y="4" width="22" height="5" rx="2.5" fill="url(#imusic1)"/>
          <rect x="18" y="4" width="4" height="24" rx="2" fill="url(#imusic1)"/>
          <rect x="36" y="4" width="4" height="20" rx="2" fill="url(#imusic1)"/>
          <circle cx="14" cy="36" r="8" fill="url(#imusic1)"/>
          <circle cx="32" cy="32" r="8" fill="url(#imusic1)"/>
        </g>
        <circle cx="14" cy="36" r="3.5" fill="white" opacity="0.55"/>
        <circle cx="32" cy="32" r="3.5" fill="white" opacity="0.55"/>
      </svg>
    ),
    gym: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="igym1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6EE7B7"/><stop offset="100%" stopColor="#065F46"/></linearGradient>
          <filter id="fgym"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#065F46" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#fgym)">
          <rect x="2" y="20" width="8" height="8" rx="3" fill="url(#igym1)"/>
          <rect x="8" y="16" width="6" height="16" rx="3" fill="url(#igym1)"/>
          <rect x="34" y="16" width="6" height="16" rx="3" fill="url(#igym1)"/>
          <rect x="38" y="20" width="8" height="8" rx="3" fill="url(#igym1)"/>
          <rect x="14" y="22" width="20" height="4" rx="2" fill="#065F46"/>
        </g>
        <rect x="2" y="20" width="8" height="4" rx="3" fill="white" opacity="0.25"/>
        <rect x="38" y="20" width="8" height="4" rx="3" fill="white" opacity="0.25"/>
      </svg>
    ),
    pet: (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="ipet1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FDE68A"/><stop offset="100%" stopColor="#92400E"/></linearGradient>
          <filter id="fpet"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#92400E" floodOpacity="0.28"/></filter>
        </defs>
        <g filter="url(#fpet)">
          <circle cx="24" cy="28" r="14" fill="url(#ipet1)"/>
          <ellipse cx="11" cy="14" rx="5" ry="7" fill="url(#ipet1)" transform="rotate(-20 11 14)"/>
          <ellipse cx="37" cy="14" rx="5" ry="7" fill="url(#ipet1)" transform="rotate(20 37 14)"/>
          <ellipse cx="24" cy="25" rx="14" ry="10" fill="#FEF3C7" opacity="0.5"/>
        </g>
        <circle cx="20" cy="26" r="2" fill="#1E293B"/>
        <circle cx="28" cy="26" r="2" fill="#1E293B"/>
        <path d="M20 32 Q24 36 28 32" stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  };
  return map[type] || map["star"];
};

// ─── Icon Picker ────────────────────────────────────────────────────────────
const ICON_LABELS = { coin:"コイン", house:"家", phone:"スマホ", food:"食事", star:"スター", wallet:"財布", pencil:"鉛筆", chart:"グラフ", list:"リスト", gear:"歯車", car:"車", heart:"ハート", book:"本", plane:"飛行機", shop:"ショップ", music:"音楽", gym:"ジム", pet:"ペット" };

function IconPicker({ value, onChange }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8, padding:"4px 0" }}>
      {ICON_KEYS.map(k => (
        <button key={k} onClick={()=>onChange(k)} style={{
          background: value===k ? BG2 : BG,
          border:"none", borderRadius:12, padding:"8px 4px",
          display:"flex", flexDirection:"column", alignItems:"center", gap:4,
          cursor:"pointer", fontFamily:"inherit",
          boxShadow: value===k ? neuInsetShadow(3) : neuShadow(3),
          transition:"all 0.12s ease",
        }}>
          <Icon3D type={k} size={28}/>
          <span style={{ fontSize:9, color:value===k?TEAL2:GRAY, fontWeight:700 }}>{ICON_LABELS[k]}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = {
  income: [
    { id:"inc_1", name:"給与",   icon:"coin",   color:"#10B981" },
    { id:"inc_2", name:"副業",   icon:"star",   color:"#8B5CF6" },
    { id:"inc_3", name:"その他", icon:"wallet", color:"#60A5FA" },
  ],
  fixed: [
    { id:"fix_1", name:"家賃",   icon:"house",  color:"#E879A0" },
    { id:"fix_2", name:"通信費", icon:"phone",  color:"#3B82F6" },
    { id:"fix_3", name:"光熱費", icon:"gear",   color:"#F59E0B" },
    { id:"fix_4", name:"保険",   icon:"heart",  color:"#10B981" },
    { id:"fix_5", name:"サブスク",icon:"music", color:"#8B5CF6" },
  ],
  variable: [
    { id:"var_1", name:"食費",   icon:"food",   color:"#F97316" },
    { id:"var_2", name:"交通費", icon:"car",    color:"#38BDF8" },
    { id:"var_3", name:"衣服",   icon:"shop",   color:"#F472B6" },
    { id:"var_4", name:"医療",   icon:"heart",  color:"#34D399" },
    { id:"var_5", name:"娯楽",   icon:"music",  color:"#A78BFA" },
    { id:"var_6", name:"日用品", icon:"shop",   color:"#FBBF24" },
  ],
};

const SAMPLE_RECORDS = (() => {
  const now=new Date(); const y=now.getFullYear(); const m=now.getMonth();
  const prev=m===0?11:m-1; const prevY=m===0?y-1:y;
  const p=(n)=>String(n).padStart(2,"0");
  return [
    { id:"r1",  type:"income",   categoryId:"inc_1", amount:320000, date:`${y}-${p(m+1)}-25`, memo:"" },
    { id:"r2",  type:"fixed",    categoryId:"fix_1", amount:85000,  date:`${y}-${p(m+1)}-01`, memo:"" },
    { id:"r3",  type:"fixed",    categoryId:"fix_2", amount:8000,   date:`${y}-${p(m+1)}-05`, memo:"" },
    { id:"r4",  type:"fixed",    categoryId:"fix_3", amount:12000,  date:`${y}-${p(m+1)}-10`, memo:"" },
    { id:"r5",  type:"variable", categoryId:"var_1", amount:35000,  date:`${y}-${p(m+1)}-15`, memo:"" },
    { id:"r6",  type:"variable", categoryId:"var_2", amount:8500,   date:`${y}-${p(m+1)}-18`, memo:"" },
    { id:"r7",  type:"variable", categoryId:"var_5", amount:6000,   date:`${y}-${p(m+1)}-20`, memo:"" },
    { id:"r8",  type:"income",   categoryId:"inc_1", amount:310000, date:`${prevY}-${p(prev+1)}-25`, memo:"" },
    { id:"r9",  type:"fixed",    categoryId:"fix_1", amount:85000,  date:`${prevY}-${p(prev+1)}-01`, memo:"" },
    { id:"r10", type:"variable", categoryId:"var_1", amount:42000,  date:`${prevY}-${p(prev+1)}-14`, memo:"" },
  ];
})();

const fmt = n => "¥"+Math.abs(Math.round(n)).toLocaleString();
const getMonthKey = d => d.slice(0,7);
const monthLabel  = k => { const [y,m]=k.split("-"); return `${y}年${parseInt(m)}月`; };
const addMonths   = (k,d) => { const [y,m]=k.split("-").map(Number); const dt=new Date(y,m-1+d,1); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`; };
const currentMonthKey = () => { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; };

// ─── Pressable Button ───────────────────────────────────────────────────────
function NeuBtn({ children, onClick, accent, active, style={}, small=false }) {
  const [down, setDown] = useState(false);
  const pressed = down || active;
  return (
    <button
      onMouseDown={()=>setDown(true)} onMouseUp={()=>setDown(false)} onMouseLeave={()=>setDown(false)}
      onTouchStart={()=>setDown(true)} onTouchEnd={()=>setDown(false)}
      onClick={onClick}
      style={{
        background: accent ? ACCENT_GRAD : BG,
        border:"none", borderRadius:small?12:16,
        padding: small?"9px 14px":"14px 20px",
        cursor:"pointer", fontFamily:"inherit",
        color: accent ? WHITE : pressed ? TEAL2 : DARK,
        fontSize: small?13:15, fontWeight:700, letterSpacing:"0.2px",
        boxShadow: pressed
          ? (accent ? `inset 2px 2px 6px rgba(0,0,0,0.25), 0 0 14px ${TEAL_GLOW}` : neuInsetShadow(4))
          : (accent ? ACCENT_SHADOW : neuShadow(6)),
        transition:"box-shadow 0.12s ease, transform 0.1s ease",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        ...style,
      }}
    >{children}</button>
  );
}

// ─── Calculator ─────────────────────────────────────────────────────────────
function Calculator({ onConfirm }) {
  const [display, setDisplay] = useState("0");
  const press = k => setDisplay(p => {
    if (k==="⌫") return p.length<=1?"0":p.slice(0,-1);
    if (k==="AC") return "0";
    if (k==="00") return p==="0"?"0":p+"00";
    if (p==="0"&&k!==".") return k;
    if (p.replace(".","").length>=9) return p;
    return p+k;
  });
  const keys = [["7","8","9"],["4","5","6"],["1","2","3"],["AC","0","⌫"]];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ ...neuInset(8), borderRadius:20, padding:"20px 24px", textAlign:"right", marginBottom:4 }}>
        <div style={{ fontSize:11, color:GRAY, fontWeight:700, letterSpacing:"1.5px", marginBottom:4 }}>金額</div>
        <div style={{ fontSize:40, fontWeight:900, color:DARKER, letterSpacing:"-1px", fontVariantNumeric:"tabular-nums" }}>
          {parseFloat(display||"0").toLocaleString()}
          <span style={{ fontSize:20, color:TEAL2, marginLeft:4, fontWeight:700 }}>円</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {keys.flat().map(k => {
          const isAC=k==="AC", isDel=k==="⌫";
          return (
            <button key={k}
              onMouseDown={e=>{e.currentTarget.style.boxShadow=neuInsetShadow(4);e.currentTarget.style.transform="scale(0.96)";}}
              onMouseUp={e=>{e.currentTarget.style.boxShadow=neuShadow(5);e.currentTarget.style.transform="scale(1)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=neuShadow(5);e.currentTarget.style.transform="scale(1)";}}
              onClick={()=>press(k)}
              style={{ background:BG, border:"none", borderRadius:15, padding:"18px 0", fontSize:20, fontWeight:600, fontFamily:"inherit", color:isAC?PINK:isDel?"#0891B2":DARK, cursor:"pointer", boxShadow:neuShadow(5), transition:"box-shadow 0.1s ease, transform 0.1s ease" }}
            >{k}</button>
          );
        })}
      </div>
      <button
        onMouseDown={e=>{e.currentTarget.style.transform="scale(0.97)";e.currentTarget.style.boxShadow=`inset 2px 2px 8px rgba(0,0,0,0.2), 0 0 14px ${TEAL_GLOW}`;}}
        onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=ACCENT_SHADOW;}}
        onClick={()=>{ const v=parseFloat(display); if(v>0)onConfirm(v); }}
        style={{ background:ACCENT_GRAD, border:"none", borderRadius:18, padding:"18px", fontSize:16, fontWeight:800, fontFamily:"inherit", color:WHITE, cursor:"pointer", marginTop:4, letterSpacing:"0.5px", boxShadow:ACCENT_SHADOW, transition:"all 0.12s ease" }}
      >登録する ✓</button>
    </div>
  );
}

// ─── Category Card ──────────────────────────────────────────────────────────
function CatCard({ cat, onClick }) {
  const [down, setDown] = useState(false);
  return (
    <button
      onMouseDown={()=>setDown(true)} onMouseUp={()=>setDown(false)} onMouseLeave={()=>setDown(false)}
      onTouchStart={()=>setDown(true)} onTouchEnd={()=>setDown(false)}
      onClick={onClick}
      style={{ background:BG, border:"none", borderRadius:22, padding:"18px 8px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer", fontFamily:"inherit", boxShadow:down?neuInsetShadow(5):neuShadow(7), transform:down?"scale(0.96)":"scale(1)", transition:"all 0.12s ease" }}
    >
      <div style={{ width:54, height:54, borderRadius:18, background:cat.color+"1A", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`3px 3px 9px rgba(163,177,198,0.42),-3px -3px 9px rgba(255,255,255,0.9)` }}>
        <Icon3D type={cat.icon||"star"} size={36}/>
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:DARK }}>{cat.name}</div>
    </button>
  );
}

// ─── Opening Animation ──────────────────────────────────────────────────────
function Splash({ onDone }) {
  const [phase, setPhase] = useState(0);
  // 0=logo in, 1=hold, 2=fade out
  useEffect(()=>{
    const t1 = setTimeout(()=>setPhase(1), 900);
    const t2 = setTimeout(()=>setPhase(2), 2000);
    const t3 = setTimeout(()=>onDone(), 2600);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  },[]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background: BG,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      opacity: phase===2 ? 0 : 1,
      transition: phase===2 ? "opacity 0.55s ease" : "none",
    }}>
      {/* Outer ring */}
      <div style={{
        width:140, height:140, borderRadius:"50%",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow: neuShadow(18),
        background: BG,
        transform: phase>=1 ? "scale(1)" : "scale(0.6)",
        opacity: phase>=1 ? 1 : 0,
        transition:"transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
      }}>
        {/* Inner coin */}
        <div style={{
          width:96, height:96, borderRadius:"50%",
          background: ACCENT_GRAD,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`inset 3px 3px 8px rgba(255,255,255,0.3), inset -3px -3px 8px rgba(0,0,0,0.1), 0 0 32px ${TEAL_GLOW}`,
          transform: phase>=1 ? "rotate(0deg) scale(1)" : "rotate(-30deg) scale(0.5)",
          transition:"transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
        }}>
          <Icon3D type="wallet" size={52}/>
        </div>
      </div>

      {/* Text */}
      <div style={{
        marginTop:28, textAlign:"center",
        opacity: phase>=1 ? 1 : 0,
        transform: phase>=1 ? "translateY(0)" : "translateY(16px)",
        transition:"opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
      }}>
        <div style={{ fontSize:11, color:GRAY, fontWeight:700, letterSpacing:"3px", marginBottom:6 }}>KAKEIBO</div>
        <div style={{ fontSize:28, fontWeight:900, color:DARKER, letterSpacing:"-0.5px" }}>家計簿</div>
        <div style={{ fontSize:13, color:TEAL2, fontWeight:600, marginTop:6, letterSpacing:"0.5px" }}>あなたのお金を可視化する</div>
      </div>

      {/* Bottom dots loader */}
      <div style={{ display:"flex", gap:8, marginTop:48, opacity:phase>=1?1:0, transition:"opacity 0.4s ease 0.6s" }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            width:8, height:8, borderRadius:"50%",
            background:`linear-gradient(135deg,${TEAL},${TEAL2})`,
            boxShadow:neuShadow(3),
            animation:`bounce 1.2s ease-in-out ${i*0.18}s infinite`,
          }}/>
        ))}
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}

// ─── Input Tab ──────────────────────────────────────────────────────────────
function InputTab({ categories, onAdd }) {
  const [mode, setMode]             = useState("expense");
  const [expenseType, setExpenseType] = useState("fixed");
  const [selectedCat, setSelectedCat] = useState(null);
  const [step, setStep]             = useState("category");
  const [memo, setMemo]             = useState("");
  const [toast, setToast]           = useState(null);

  const cats = mode==="income" ? categories.income : expenseType==="fixed" ? categories.fixed : categories.variable;

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 2200); };

  const handleConfirm = amount => {
    const today=new Date();
    const date=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    onAdd({ id:"r"+Date.now(), type:mode==="income"?"income":expenseType, categoryId:selectedCat.id, amount, date, memo });
    showToast(`${selectedCat.name}  ${fmt(amount)} を記録しました`);
    setStep("category"); setSelectedCat(null); setMemo("");
  };

  return (
    <div style={{ paddingBottom:110 }}>
      {toast && (
        <div style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#1E293B,#334155)", color:WHITE, borderRadius:99, padding:"12px 24px", fontSize:14, fontWeight:700, zIndex:999, whiteSpace:"nowrap", boxShadow:neuShadow(8) }}>
          {toast}
        </div>
      )}

      {/* Mode toggle — NO emoji */}
      <div style={{ display:"flex", gap:10, marginBottom:22 }}>
        {[["income","収入"],["expense","支出"]].map(([v,l])=>(
          <NeuBtn key={v} onClick={()=>{setMode(v);setStep("category");setSelectedCat(null);}} accent={mode===v} style={{ flex:1, textAlign:"center" }}>{l}</NeuBtn>
        ))}
      </div>

      {mode==="expense" && (
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[["fixed","固定費"],["variable","変動費"]].map(([v,l])=>(
            <NeuBtn key={v} small onClick={()=>{setExpenseType(v);setStep("category");setSelectedCat(null);}} active={expenseType===v} style={{ flex:1, textAlign:"center", color:expenseType===v?TEAL2:GRAY }}>{l}</NeuBtn>
          ))}
        </div>
      )}

      {step==="category" ? (
        <>
          <div style={{ fontSize:10, color:GRAY, fontWeight:700, letterSpacing:"1.8px", marginBottom:14 }}>カテゴリを選択</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {cats.map(cat=><CatCard key={cat.id} cat={cat} onClick={()=>{setSelectedCat(cat);setStep("amount");}}/>)}
          </div>
        </>
      ) : (
        <>
          <button onClick={()=>setStep("category")} style={{ background:"none", border:"none", color:GRAY, fontSize:14, cursor:"pointer", marginBottom:16, padding:0, fontWeight:600, fontFamily:"inherit" }}>← 戻る</button>
          <div style={{ ...neuCard, padding:"16px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:14, borderRadius:22 }}>
            <div style={{ width:58, height:58, borderRadius:18, background:selectedCat.color+"1A", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`4px 4px 10px rgba(163,177,198,0.42),-4px -4px 10px rgba(255,255,255,0.9)` }}>
              <Icon3D type={selectedCat.icon||"star"} size={40}/>
            </div>
            <div>
              <div style={{ fontSize:10, color:GRAY, fontWeight:700, letterSpacing:"1px" }}>{mode==="income"?"収入":expenseType==="fixed"?"固定費":"変動費"}</div>
              <div style={{ fontSize:19, fontWeight:800, color:DARKER }}>{selectedCat.name}</div>
            </div>
          </div>
          <div style={{ ...neuInset(5), borderRadius:14, padding:"2px 4px", marginBottom:14 }}>
            <input placeholder="メモ（任意）" value={memo} onChange={e=>setMemo(e.target.value)} style={{ width:"100%", padding:"12px 14px", background:"none", border:"none", outline:"none", fontSize:14, color:DARK, fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <Calculator onConfirm={handleConfirm}/>
        </>
      )}
    </div>
  );
}

// ─── Report Tab ─────────────────────────────────────────────────────────────
function ReportTab({ records, categories, monthKey, onMonthChange }) {
  const allCats=[...categories.income,...categories.fixed,...categories.variable];
  const getCat=id=>allCats.find(c=>c.id===id)||{name:"不明",icon:"star",color:GRAY};

  const monthRecs   = records.filter(r=>getMonthKey(r.date)===monthKey);
  const totalIncome = monthRecs.filter(r=>r.type==="income").reduce((s,r)=>s+r.amount,0);
  const totalExpense= monthRecs.filter(r=>r.type!=="income").reduce((s,r)=>s+r.amount,0);
  const balance     = totalIncome - totalExpense;
  const savingRate  = totalIncome > 0 ? Math.round((balance / totalIncome)*100) : 0;

  const fixedTotal   = monthRecs.filter(r=>r.type==="fixed").reduce((s,r)=>s+r.amount,0);
  const variableTotal= monthRecs.filter(r=>r.type==="variable").reduce((s,r)=>s+r.amount,0);
  const pieData = [
    { name:"固定費",  value:fixedTotal,    color:PINK },
    { name:"変動費",  value:variableTotal, color:"#3B82F6" },
  ].filter(d=>d.value>0);

  const catMap={};
  monthRecs.filter(r=>r.type!=="income").forEach(r=>{catMap[r.categoryId]=(catMap[r.categoryId]||0)+r.amount;});
  const barData=Object.entries(catMap).map(([id,amount])=>{const c=getCat(id);return{name:c.name,amount,color:c.color};}).sort((a,b)=>b.amount-a.amount).slice(0,6);

  const lineData=[];
  for(let i=5;i>=0;i--){
    const mk=addMonths(monthKey,-i);
    const recs=records.filter(r=>getMonthKey(r.date)===mk);
    const inc=recs.filter(r=>r.type==="income").reduce((s,r)=>s+r.amount,0);
    const exp=recs.filter(r=>r.type!=="income").reduce((s,r)=>s+r.amount,0);
    const sr=inc>0?Math.round((inc-exp)/inc*100):0;
    const [,m]=mk.split("-");
    lineData.push({ month:parseInt(m)+"月", income:inc, expense:exp, savingRate:sr });
  }
  const isNow=monthKey===currentMonthKey();

  // saving rate color
  const srColor = savingRate>=20?"#10B981":savingRate>=10?TEAL2:savingRate>=0?"#F59E0B":PINK;

  return (
    <div style={{ paddingBottom:110 }}>
      {/* Month Nav */}
      <div style={{ ...neuCard, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", marginBottom:18 }}>
        <button onClick={()=>onMonthChange(addMonths(monthKey,-1))} style={{ background:BG, border:"none", borderRadius:12, width:40, height:40, fontSize:22, color:DARK, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:neuShadow(4) }}>‹</button>
        <div style={{ fontSize:17, fontWeight:800, color:DARKER }}>{monthLabel(monthKey)}</div>
        <button onClick={()=>!isNow&&onMonthChange(addMonths(monthKey,1))} style={{ background:BG, border:"none", borderRadius:12, width:40, height:40, fontSize:22, color:isNow?"#C8D0DC":DARK, cursor:isNow?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:neuShadow(4) }}>›</button>
      </div>

      {/* Summary cards: 2×2 grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
        {[
          { label:"収入",   value:totalIncome,  color:"#10B981", sign:"+", sub:null },
          { label:"支出",   value:totalExpense, color:PINK,      sign:"−", sub:null },
          { label:"収支",   value:balance,      color:balance>=0?"#10B981":PINK, sign:balance>=0?"+":"−", sub:null },
          { label:"貯蓄率", value:null,         color:srColor,   sign:"",  sub:`${savingRate}%` },
        ].map(({label,value,color,sign,sub})=>(
          <div key={label} style={{ ...neuCard, padding:"16px 14px", textAlign:"center", borderRadius:20 }}>
            <div style={{ fontSize:10, color:GRAY, fontWeight:700, letterSpacing:"1px", marginBottom:8 }}>{label}</div>
            {sub !== null ? (
              <>
                <div style={{ fontSize:26, fontWeight:900, color, letterSpacing:"-0.5px" }}>{sub}</div>
                <div style={{ fontSize:10, color:GRAY, marginTop:4, fontWeight:500 }}>
                  {savingRate>=20?"優秀 🌟":savingRate>=10?"良好 👍":savingRate>=0?"普通":"赤字 ⚠️"}
                </div>
              </>
            ) : (
              <div style={{ fontSize:14, fontWeight:900, color, letterSpacing:"-0.3px" }}>
                {sign}{fmt(value).replace("¥","")}<span style={{ fontSize:9, marginLeft:1 }}>円</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Saving rate bar */}
      <div style={{ ...neuCard, padding:"18px 20px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:DARK, letterSpacing:"1px" }}>貯蓄率</div>
          <div style={{ fontSize:13, fontWeight:800, color:srColor }}>{savingRate}%</div>
        </div>
        <div style={{ ...neuInset(3), borderRadius:99, height:12 }}>
          <div style={{
            height:"100%", borderRadius:99,
            background: `linear-gradient(90deg, ${TEAL}99, ${srColor})`,
            width:`${Math.max(0,Math.min(100,savingRate))}%`,
            transition:"width 0.8s cubic-bezier(0.34,1.1,0.64,1)",
            boxShadow:`0 0 8px ${srColor}66`,
          }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:10, color:GRAY }}>
          <span>0%</span><span>目標 20%</span><span>100%</span>
        </div>
      </div>

      {/* Donut */}
      {pieData.length>0&&(
        <div style={{ ...neuCard, padding:"20px", marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:DARK, marginBottom:16, letterSpacing:"1px" }}>支出内訳</div>
          <div style={{ display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ ...neuInset(6), borderRadius:"50%", width:118, height:118, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <ResponsiveContainer width={98} height={98}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" paddingAngle={4}>{pieData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex:1 }}>
              {pieData.map(d=>(
                <div key={d.name} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, color:DARK, fontWeight:700 }}>{d.name}</span>
                    <span style={{ fontSize:12, fontWeight:800, color:d.color }}>{fmt(d.value)}</span>
                  </div>
                  <div style={{ ...neuInset(3), borderRadius:99, height:8 }}>
                    <div style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${d.color}88,${d.color})`, width:`${totalExpense?Math.round(d.value/totalExpense*100):0}%`, transition:"width 0.6s ease" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bar */}
      {barData.length>0&&(
        <div style={{ ...neuCard, padding:"20px", marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:DARK, marginBottom:16, letterSpacing:"1px" }}>カテゴリ別支出</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} layout="vertical" margin={{left:0,right:16,top:0,bottom:0}}>
              <XAxis type="number" hide/>
              <YAxis type="category" dataKey="name" width={72} tick={{fontSize:11,fill:GRAY}}/>
              <Tooltip formatter={v=>fmt(v)} contentStyle={{background:BG,border:"none",borderRadius:12,boxShadow:neuShadow(4)}}/>
              <Bar dataKey="amount" radius={[0,10,10,0]}>{barData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Line: income + expense + saving rate */}
      <div style={{ ...neuCard, padding:"20px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:DARK, marginBottom:4, letterSpacing:"1px" }}>月別推移（直近6ヶ月）</div>
        <div style={{ display:"flex", gap:14, marginBottom:12 }}>
          {[{label:"収入",color:"#10B981"},{label:"支出",color:PINK},{label:"貯蓄率%×1000",color:TEAL2}].map(d=>(
            <div key={d.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:12, height:3, borderRadius:99, background:d.color }}/>
              <span style={{ fontSize:10, color:GRAY, fontWeight:600 }}>{d.label.replace("×1000","")}</span>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={lineData} margin={{left:0,right:8,top:4,bottom:0}}>
            <XAxis dataKey="month" tick={{fontSize:10,fill:GRAY}}/>
            <YAxis yAxisId="amt" hide/>
            <YAxis yAxisId="sr" orientation="right" hide/>
            <Tooltip formatter={(v,name)=>name==="貯蓄率"?`${v}%`:fmt(v)} contentStyle={{background:BG,border:"none",borderRadius:12,boxShadow:neuShadow(4)}}/>
            <Line yAxisId="amt" type="monotone" dataKey="income"  stroke="#10B981" strokeWidth={2.5} dot={{r:4,fill:"#10B981",strokeWidth:2,stroke:BG}} name="収入"/>
            <Line yAxisId="amt" type="monotone" dataKey="expense" stroke={PINK}    strokeWidth={2.5} dot={{r:4,fill:PINK,strokeWidth:2,stroke:BG}}    name="支出"/>
            <Line yAxisId="sr"  type="monotone" dataKey="savingRate" stroke={TEAL2} strokeWidth={2} strokeDasharray="5 3" dot={{r:3,fill:TEAL2,strokeWidth:1,stroke:BG}} name="貯蓄率"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── History Tab ─────────────────────────────────────────────────────────────
function HistoryTab({ records, categories, monthKey, onDelete }) {
  const [filter,setFilter]=useState("all");
  const allCats=[...categories.income,...categories.fixed,...categories.variable];
  const getCat=id=>allCats.find(c=>c.id===id)||{name:"不明",icon:"star",color:GRAY};
  const monthRecs=records.filter(r=>getMonthKey(r.date)===monthKey).filter(r=>filter==="all"||(filter==="income"?r.type==="income":r.type!=="income")).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div style={{ paddingBottom:110 }}>
      <div style={{ display:"flex", gap:8, marginBottom:18 }}>
        {[["all","すべて"],["income","収入"],["expense","支出"]].map(([v,l])=>(
          <NeuBtn key={v} small onClick={()=>setFilter(v)} accent={filter===v} style={{ flex:1, textAlign:"center" }}>{l}</NeuBtn>
        ))}
      </div>
      {monthRecs.length===0 ? (
        <div style={{ textAlign:"center", color:GRAY, padding:"60px 0" }}>
          <div style={{ fontSize:50, marginBottom:14 }}>📭</div>
          <div style={{ fontSize:14, fontWeight:600 }}>記録がありません</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {monthRecs.map(r=>{
            const cat=getCat(r.categoryId); const isIncome=r.type==="income";
            return (
              <div key={r.id} style={{ ...neuCard, display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }}>
                <div style={{ width:46, height:46, borderRadius:14, background:cat.color+"1A", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`3px 3px 8px rgba(163,177,198,0.4),-3px -3px 8px rgba(255,255,255,0.9)` }}>
                  <Icon3D type={cat.icon||"star"} size={30}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:DARKER }}>{cat.name}</div>
                  <div style={{ fontSize:11, color:GRAY, marginTop:2 }}>{r.date}{r.memo?` · ${r.memo}`:""}</div>
                </div>
                <div style={{ fontWeight:800, fontSize:15, color:isIncome?"#10B981":DARKER }}>{isIncome?"+":"−"}{fmt(r.amount)}</div>
                <button onClick={()=>onDelete(r.id)} style={{ background:BG, border:"none", borderRadius:10, width:32, height:32, cursor:"pointer", color:PINK, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:neuShadow(3), flexShrink:0 }}>✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
function SettingsTab({ categories, setCategories }) {
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingCat,   setEditingCat]   = useState(null); // {gkey, cat} for icon edit
  const [newName,      setNewName]      = useState("");
  const [newIcon,      setNewIcon]      = useState("star");
  const [selectedColor,setSelectedColor]= useState("#2DD4BF");
  const COLORS=["#F472B6","#2DD4BF","#34D399","#FBBF24","#A78BFA","#FB923C","#38BDF8","#F87171","#60A5FA","#C084FC","#10B981","#E879A0"];

  const groups=[{key:"income",label:"収入カテゴリ"},{key:"fixed",label:"固定費カテゴリ"},{key:"variable",label:"変動費カテゴリ"}];

  const addCat = gk => {
    if(!newName.trim()) return;
    setCategories(prev=>({...prev,[gk]:[...prev[gk],{id:gk+"_"+Date.now(),name:newName.trim(),icon:newIcon,color:selectedColor}]}));
    setNewName(""); setEditingGroup(null);
  };
  const deleteCat = (gk,id) => setCategories(prev=>({...prev,[gk]:prev[gk].filter(c=>c.id!==id)}));
  const updateCatIcon = (gk, id, icon) => {
    setCategories(prev=>({...prev,[gk]:prev[gk].map(c=>c.id===id?{...c,icon}:c)}));
  };
  const updateCatColor = (gk, id, color) => {
    setCategories(prev=>({...prev,[gk]:prev[gk].map(c=>c.id===id?{...c,color}:c)}));
  };

  return (
    <div style={{ paddingBottom:110 }}>
      {/* Icon edit modal */}
      {editingCat && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(238,240,245,0.85)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ ...neuCard, width:"100%", maxWidth:420, padding:"24px 20px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:DARKER, marginBottom:4 }}>{editingCat.cat.name}</div>
            <div style={{ fontSize:11, color:GRAY, marginBottom:16 }}>アイコンとカラーを選択</div>
            <IconPicker value={editingCat.cat.icon} onChange={icon=>updateCatIcon(editingCat.gkey,editingCat.cat.id,icon)}/>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", margin:"16px 0" }}>
              {COLORS.map(c=>(
                <div key={c} onClick={()=>updateCatColor(editingCat.gkey,editingCat.cat.id,c)} style={{ width:24,height:24,borderRadius:99,background:c,cursor:"pointer",boxShadow:editingCat.cat.color===c?`0 0 0 3px ${BG},0 0 0 5px ${c},${neuShadow(2)}`:neuShadow(2) }}/>
              ))}
            </div>
            <NeuBtn accent onClick={()=>setEditingCat(null)} style={{ width:"100%", textAlign:"center" }}>完了</NeuBtn>
          </div>
        </div>
      )}

      {groups.map(({key,label})=>(
        <div key={key} style={{ ...neuCard, marginBottom:16, padding:"20px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:DARK, marginBottom:14, letterSpacing:"1px" }}>{label}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {categories[key].map(cat=>(
              <div key={cat.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={()=>setEditingCat({gkey:key,cat})} style={{ width:42, height:42, borderRadius:13, background:cat.color+"1A", display:"flex", alignItems:"center", justifyContent:"center", border:"none", cursor:"pointer", flexShrink:0, boxShadow:`3px 3px 7px rgba(163,177,198,0.4),-3px -3px 7px rgba(255,255,255,0.9)` }}>
                  <Icon3D type={cat.icon||"star"} size={28}/>
                </button>
                <div style={{ flex:1, fontSize:13, fontWeight:600, color:DARK }}>{cat.name}</div>
                <div style={{ width:10, height:10, borderRadius:99, background:cat.color, flexShrink:0 }}/>
                <button onClick={()=>setEditingCat({gkey:key,cat})} style={{ background:BG, border:"none", borderRadius:9, padding:"5px 10px", cursor:"pointer", color:TEAL2, fontSize:11, fontWeight:700, boxShadow:neuShadow(3) }}>編集</button>
                <button onClick={()=>deleteCat(key,cat.id)} style={{ background:BG, border:"none", borderRadius:9, width:28, height:28, cursor:"pointer", color:PINK, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:neuShadow(3) }}>✕</button>
              </div>
            ))}
          </div>

          {editingGroup===key ? (
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:11, color:GRAY, fontWeight:700, letterSpacing:"1px", marginBottom:10 }}>アイコンを選択</div>
              <IconPicker value={newIcon} onChange={setNewIcon}/>
              <div style={{ ...neuInset(4), borderRadius:10, padding:"2px 4px", margin:"12px 0 10px" }}>
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="カテゴリ名" style={{ width:"100%", padding:"10px 12px", background:"none", border:"none", outline:"none", fontSize:14, color:DARK, fontFamily:"inherit", boxSizing:"border-box" }}/>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
                {COLORS.map(c=><div key={c} onClick={()=>setSelectedColor(c)} style={{ width:22,height:22,borderRadius:99,background:c,cursor:"pointer",boxShadow:selectedColor===c?`0 0 0 3px ${BG},0 0 0 5px ${c},${neuShadow(2)}`:neuShadow(2) }}/>)}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <NeuBtn small onClick={()=>setEditingGroup(null)} style={{ flex:1, textAlign:"center" }}>キャンセル</NeuBtn>
                <NeuBtn small onClick={()=>addCat(key)} accent style={{ flex:2, textAlign:"center" }}>追加する</NeuBtn>
              </div>
            </div>
          ) : (
            <button onClick={()=>{setEditingGroup(key);setNewName("");setNewIcon("star");}} style={{ width:"100%", padding:"12px", borderRadius:12, marginTop:14, background:"none", border:`1.5px dashed rgba(148,163,184,0.4)`, cursor:"pointer", color:GRAY, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>＋ カテゴリを追加</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [tab,        setTab]        = useState("input");
  const [monthKey,   setMonthKey]   = useState(currentMonthKey());
  const [records,    setRecords]    = useState(SAMPLE_RECORDS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const addRecord    = useCallback(r=>setRecords(p=>[r,...p]),[]);
  const deleteRecord = useCallback(id=>setRecords(p=>p.filter(r=>r.id!==id)),[]);

  const tabs = [
    { id:"input",    label:"入力",    icon:<Icon3D type="pencil" size={28}/> },
    { id:"report",   label:"レポート",icon:<Icon3D type="chart"  size={28}/> },
    { id:"history",  label:"履歴",    icon:<Icon3D type="list"   size={28}/> },
    { id:"settings", label:"設定",    icon:<Icon3D type="gear"   size={28}/> },
  ];

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,'Hiragino Sans',sans-serif" }}>
      {!splashDone && <Splash onDone={()=>setSplashDone(true)}/>}

      {/* Month header (only on report/history) */}
      {(tab==="report"||tab==="history") && (
        <div style={{ background:BG, padding:"20px 24px 12px", position:"sticky", top:0, zIndex:100, boxShadow:`0 6px 20px rgba(163,177,198,0.28)` }}>
          <div style={{ fontSize:22, fontWeight:900, color:DARKER, letterSpacing:"-0.5px" }}>{monthLabel(monthKey)}</div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding:"20px 20px 0" }}>
        {tab==="input"    && <InputTab    categories={categories} onAdd={addRecord}/>}
        {tab==="report"   && <ReportTab   records={records} categories={categories} monthKey={monthKey} onMonthChange={setMonthKey}/>}
        {tab==="history"  && <HistoryTab  records={records} categories={categories} monthKey={monthKey} onDelete={deleteRecord}/>}
        {tab==="settings" && <SettingsTab categories={categories} setCategories={setCategories}/>}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:BG, padding:"12px 8px 24px", display:"flex", justifyContent:"space-around", zIndex:100, boxShadow:`0 -6px 20px rgba(163,177,198,0.30)`, borderRadius:"24px 24px 0 0" }}>
        {tabs.map(({id,label,icon})=>{
          const active=tab===id;
          return (
            <button key={id} onClick={()=>setTab(id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", padding:"6px 14px", fontFamily:"inherit" }}>
              <div style={{ width:54, height:54, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", background:BG, boxShadow:active?neuInsetShadow(4):neuShadow(6), transition:"all 0.2s ease" }}>
                {icon}
              </div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.5px", color:active?TEAL2:GRAY, transition:"color 0.2s" }}>{label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
