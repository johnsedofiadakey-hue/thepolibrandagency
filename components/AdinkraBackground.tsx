'use client';
import React from 'react';

/* ─────────────────────────────────────────────────────────────────────
   Adinkra symbols from the Akan people of Ghana.
   Rendered as fixed ambient layer across all pages — pointer-events
   disabled, very low opacity, slow animations for a living texture.
   ───────────────────────────────────────────────────────────────────── */

const GOLD = '#C9A227';

/* ── Individual symbol SVGs ─────────────────────────────── */

// Gye Nyame — "Except for God" | omnipotence
function GyeNyame({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      {/* Center ring + dot */}
      <circle cx="50" cy="50" r="13" stroke={GOLD} strokeWidth="2.2" fill="none" />
      <circle cx="50" cy="50" r="5" fill={GOLD} />
      {/* 4 petal arms */}
      <path d="M50,37 C44,27 40,12 50,4 C60,12 56,27 50,37Z" fill={GOLD} />
      <path d="M50,63 C44,73 40,88 50,96 C60,88 56,73 50,63Z" fill={GOLD} />
      <path d="M37,50 C27,44 12,40 4,50 C12,60 27,56 37,50Z" fill={GOLD} />
      <path d="M63,50 C73,44 88,40 96,50 C88,60 73,56 63,50Z" fill={GOLD} />
      {/* Corner diamond accents */}
      <path d="M33,33 L28,28 L33,23 L38,28Z" fill={GOLD} opacity="0.7" />
      <path d="M67,33 L72,28 L67,23 L62,28Z" fill={GOLD} opacity="0.7" />
      <path d="M33,67 L28,72 L33,77 L38,72Z" fill={GOLD} opacity="0.7" />
      <path d="M67,67 L72,72 L67,77 L62,72Z" fill={GOLD} opacity="0.7" />
    </svg>
  );
}

// Adinkrahene — "Chief of Adinkra symbols" | greatness, charisma
function Adinkrahene({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <circle cx="50" cy="50" r="47" stroke={GOLD} strokeWidth="1.8" />
      <circle cx="50" cy="50" r="36" stroke={GOLD} strokeWidth="1.8" />
      <circle cx="50" cy="50" r="25" stroke={GOLD} strokeWidth="1.8" />
      <circle cx="50" cy="50" r="14" stroke={GOLD} strokeWidth="1.8" />
      <circle cx="50" cy="50" r="4" fill={GOLD} />
      {/* Cardinal accent dots */}
      <circle cx="50" cy="2.5" r="2.8" fill={GOLD} />
      <circle cx="50" cy="97.5" r="2.8" fill={GOLD} />
      <circle cx="2.5" cy="50" r="2.8" fill={GOLD} />
      <circle cx="97.5" cy="50" r="2.8" fill={GOLD} />
      {/* Diagonal accent dots */}
      <circle cx="17" cy="17" r="2" fill={GOLD} opacity="0.6" />
      <circle cx="83" cy="17" r="2" fill={GOLD} opacity="0.6" />
      <circle cx="17" cy="83" r="2" fill={GOLD} opacity="0.6" />
      <circle cx="83" cy="83" r="2" fill={GOLD} opacity="0.6" />
    </svg>
  );
}

// Sankofa — "Go back and fetch it" | learning from the past
function Sankofa({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {/* Heart body */}
      <path
        d="M50,88 C22,66 6,46 6,28 C6,15 15,6 26,8 C35,10 44,18 50,28 C56,18 65,10 74,8 C85,6 94,15 94,28 C94,46 78,66 50,88Z"
        fill={GOLD}
      />
      {/* Spiral/egg at top center — the "fetch" motif */}
      <circle cx="50" cy="18" r="9" fill={GOLD} />
      <path
        d="M50,27 C56,22 62,14 58,8 C54,3 47,4 44,9 C42,14 46,20 50,18"
        fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Eye */}
      <circle cx="54" cy="16" r="2.5" fill="white" />
      <circle cx="55" cy="16" r="1.2" fill={GOLD} />
    </svg>
  );
}

// Nkyinkyim — "Adaptability" | versatility, toughness
function Nkyinkyim({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      {/* Vertical twisted arm */}
      <path
        d="M50,5 L50,22 C50,28 42,32 42,40 C42,48 58,52 58,60 C58,68 50,72 50,78 L50,95"
        stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none"
      />
      {/* Horizontal twisted arm */}
      <path
        d="M5,50 L22,50 C28,50 32,42 40,42 C48,42 52,58 60,58 C68,58 72,50 78,50 L95,50"
        stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none"
      />
      {/* Center knot */}
      <circle cx="50" cy="50" r="7" fill={GOLD} />
      <circle cx="50" cy="50" r="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

// Aya — "Fern" | endurance, resourcefulness
function Aya({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {/* Central stem */}
      <line x1="50" y1="96" x2="50" y2="8" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      {/* Left fronds — larger at base, smaller toward tip */}
      <path d="M50,82 C38,68 22,70 20,80 C28,84 42,80 50,82Z" fill={GOLD} />
      <path d="M50,70 C38,56 20,58 18,68 C26,72 40,68 50,70Z" fill={GOLD} />
      <path d="M50,58 C40,44 24,46 22,56 C30,60 44,56 50,58Z" fill={GOLD} />
      <path d="M50,46 C41,33 27,36 26,45 C33,49 46,45 50,46Z" fill={GOLD} />
      <path d="M50,35 C43,24 31,26 30,34 C36,38 47,35 50,35Z" fill={GOLD} />
      <path d="M50,25 C44,16 35,18 35,25 C40,28 48,26 50,25Z" fill={GOLD} />
      {/* Right fronds */}
      <path d="M50,82 C62,68 78,70 80,80 C72,84 58,80 50,82Z" fill={GOLD} />
      <path d="M50,70 C62,56 80,58 82,68 C74,72 60,68 50,70Z" fill={GOLD} />
      <path d="M50,58 C60,44 76,46 78,56 C70,60 56,56 50,58Z" fill={GOLD} />
      <path d="M50,46 C59,33 73,36 74,45 C67,49 54,45 50,46Z" fill={GOLD} />
      <path d="M50,35 C57,24 69,26 70,34 C64,38 53,35 50,35Z" fill={GOLD} />
      <path d="M50,25 C56,16 65,18 65,25 C60,28 52,26 50,25Z" fill={GOLD} />
      {/* Tip bud */}
      <ellipse cx="50" cy="9" rx="4" ry="6" fill={GOLD} />
    </svg>
  );
}

// Dwennimmen — "Ram's horns" | humility and strength
function Dwennimmen({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      {/* Top-left horn spiral */}
      <path
        d="M50,50 C50,34 38,24 28,28 C18,32 16,44 24,52 C32,60 44,56 46,48 C48,40 40,36 34,40 C30,44 33,50 38,48"
        stroke={GOLD} strokeWidth="4.5" strokeLinecap="round"
      />
      {/* Top-right horn spiral */}
      <path
        d="M50,50 C50,34 62,24 72,28 C82,32 84,44 76,52 C68,60 56,56 54,48 C52,40 60,36 66,40 C70,44 67,50 62,48"
        stroke={GOLD} strokeWidth="4.5" strokeLinecap="round"
      />
      {/* Bottom-left horn spiral */}
      <path
        d="M50,50 C50,66 38,76 28,72 C18,68 16,56 24,48 C32,40 44,44 46,52 C48,60 40,64 34,60 C30,56 33,50 38,52"
        stroke={GOLD} strokeWidth="4.5" strokeLinecap="round"
      />
      {/* Bottom-right horn spiral */}
      <path
        d="M50,50 C50,66 62,76 72,72 C82,68 84,56 76,48 C68,40 56,44 54,52 C52,60 60,64 66,60 C70,56 67,50 62,52"
        stroke={GOLD} strokeWidth="4.5" strokeLinecap="round"
      />
      {/* Center knot */}
      <circle cx="50" cy="50" r="6" fill={GOLD} />
    </svg>
  );
}

/* ── Symbol placement config ──────────────────────────────── */
interface SymbolConfig {
  symbol: string;
  size: number;
  style: React.CSSProperties;
  opacity: number;
  animation: string;
  duration: string;
  delay: string;
}

const SYMBOLS: SymbolConfig[] = [
  // Large Gye Nyame — top-left, partially clipped
  { symbol: 'gye-nyame', size: 300, style: { top: -70, left: -80 }, opacity: 0.07, animation: 'adinkraFloat', duration: '14s', delay: '0s' },
  // Adinkrahene — top-right, spins slowly
  { symbol: 'adinkrahene-lg', size: 260, style: { top: -60, right: -60 }, opacity: 0.055, animation: 'adinkraSpin', duration: '90s', delay: '-22s' },
  // Sankofa — left mid, drifts
  { symbol: 'sankofa', size: 210, style: { top: '32%', left: -65 }, opacity: 0.065, animation: 'adinkraFloat', duration: '11s', delay: '-4s' },
  // Nkyinkyim — right mid
  { symbol: 'nkyinkyim', size: 200, style: { top: '52%', right: -55 }, opacity: 0.06, animation: 'adinkraFloatAlt', duration: '13s', delay: '-8s' },
  // Aya — bottom-left, partially clipped
  { symbol: 'aya', size: 240, style: { bottom: -70, left: 40 }, opacity: 0.065, animation: 'adinkraFloatAlt', duration: '16s', delay: '-12s' },
  // Dwennimmen — bottom-right, spins
  { symbol: 'dwennimmen', size: 280, style: { bottom: -80, right: -60 }, opacity: 0.055, animation: 'adinkraSpin', duration: '75s', delay: '-40s' },
  // Small Adinkrahene — center-right, accent pulse
  { symbol: 'adinkrahene-sm', size: 150, style: { top: '18%', right: '14%' }, opacity: 0.04, animation: 'adinkraPulse', duration: '7s', delay: '-2s' },
  // Small Gye Nyame — center-left, accent pulse
  { symbol: 'gye-nyame-sm', size: 130, style: { top: '70%', left: '8%' }, opacity: 0.04, animation: 'adinkraPulse', duration: '9s', delay: '-6s' },
];

function renderSymbol(id: string, size: number) {
  if (id.startsWith('gye-nyame')) return <GyeNyame size={size} />;
  if (id.startsWith('adinkrahene')) return <Adinkrahene size={size} />;
  if (id === 'sankofa') return <Sankofa size={size} />;
  if (id === 'nkyinkyim') return <Nkyinkyim size={size} />;
  if (id === 'aya') return <Aya size={size} />;
  if (id === 'dwennimmen') return <Dwennimmen size={size} />;
  return null;
}

export default function AdinkraBackground() {
  return (
    <>
      <style>{`
        @keyframes adinkraFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-16px) rotate(1.5deg); }
          66% { transform: translateY(8px) rotate(-1deg); }
        }
        @keyframes adinkraFloatAlt {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          40% { transform: translateY(14px) rotate(-1.5deg); }
          70% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes adinkraSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes adinkraPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: var(--ao); }
          50% { transform: scale(1.06) rotate(3deg); opacity: calc(var(--ao) * 1.7); }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          zIndex: 1, pointerEvents: 'none', overflow: 'hidden',
        }}
      >
        {SYMBOLS.map((s) => (
          <div
            key={s.symbol}
            style={{
              position: 'absolute',
              ...s.style,
              opacity: s.opacity,
              animation: `${s.animation} ${s.duration} ease-in-out ${s.delay} infinite`,
              willChange: 'transform, opacity',
              ...({ '--ao': s.opacity } as React.CSSProperties),
            }}
          >
            {renderSymbol(s.symbol, s.size)}
          </div>
        ))}
      </div>
    </>
  );
}
