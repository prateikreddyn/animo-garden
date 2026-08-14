import type { CompanionState } from "@/lib/animo";

/**
 * A small digital garden: trees, flower beds, greenery and birds.
 * Every state is warm and welcoming.
 * "waiting" is a gentle, resting garden — never wilting, sad or decaying.
 */
export function Companion({
  state,
  size = 320,
  className = "",
}: {
  state: CompanionState;
  size?: number;
  className?: string;
}) {
  const celebrating = state === "celebrating";
  const thriving = state === "thriving" || celebrating;
  const bright = celebrating ? 1 : thriving ? 0.96 : 0.86;
  const bloomOpacity = celebrating ? 1 : thriving ? 0.95 : 0.6;
  const glowOpacity = celebrating ? 0.75 : thriving ? 0.45 : 0.28;

  const flowers: { x: number; y: number; r: number; delay: number }[] = [
    { x: 52, y: 262, r: 9, delay: 0 },
    { x: 84, y: 274, r: 7, delay: 0.5 },
    { x: 118, y: 262, r: 8, delay: 1 },
    { x: 205, y: 268, r: 8, delay: 0.3 },
    { x: 238, y: 258, r: 9, delay: 0.8 },
    { x: 270, y: 272, r: 7, delay: 1.3 },
  ];

  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      role="img"
      aria-label={`Your garden, currently ${state}`}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <defs>
        <radialGradient id="animo-sunglow" cx="72%" cy="20%" r="60%">
          <stop offset="0%" stopColor="var(--sun)" stopOpacity={glowOpacity} />
          <stop offset="100%" stopColor="var(--sun)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="animo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--card)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="animo-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--leaf)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--leaf)" stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="animo-clip">
          <circle cx="160" cy="160" r="150" />
        </clipPath>
      </defs>

      <g clipPath="url(#animo-clip)">
        {/* sky */}
        <rect x="0" y="0" width="320" height="320" fill="url(#animo-sky)" />
        <rect x="0" y="0" width="320" height="320" fill="url(#animo-sunglow)" />

        {/* sun */}
        <circle cx="242" cy="66" r="26" fill="var(--sun)" opacity={thriving ? 0.95 : 0.7} className="animate-breathe" />

        {/* soft clouds */}
        <g fill="var(--card)" opacity="0.75">
          <ellipse cx="74" cy="70" rx="30" ry="14" />
          <ellipse cx="96" cy="64" rx="20" ry="12" />
          <ellipse cx="176" cy="46" rx="22" ry="10" />
        </g>

        {/* rolling hills */}
        <path d="M0 214 C60 186 108 214 160 206 C214 198 262 178 320 200 V320 H0 Z" fill="var(--leaf)" opacity="0.35" />
        <path d="M0 236 C70 214 120 240 180 232 C244 224 280 214 320 228 V320 H0 Z" fill="url(#animo-ground)" />

        <g style={{ opacity: bright }}>
          {/* big tree (left) */}
          <g className="animate-sway" style={{ transformOrigin: "62px 250px" }}>
            <path d="M58 250 V196" stroke="var(--accent-foreground)" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
            <circle cx="58" cy="176" r="34" fill="var(--leaf)" opacity="0.95" />
            <circle cx="34" cy="192" r="22" fill="var(--leaf)" opacity="0.8" />
            <circle cx="82" cy="192" r="24" fill="var(--leaf)" opacity="0.85" />
            {thriving && (
              <>
                <circle cx="44" cy="168" r="4" fill="var(--bloom)" />
                <circle cx="72" cy="184" r="4" fill="var(--bloom)" />
                <circle cx="58" cy="200" r="3.5" fill="var(--sun)" />
              </>
            )}
          </g>

          {/* slim tree (right) */}
          <g className="animate-sway" style={{ transformOrigin: "268px 248px", animationDelay: "1.2s" }}>
            <path d="M266 248 V204" stroke="var(--accent-foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
            <ellipse cx="266" cy="186" rx="26" ry="32" fill="var(--leaf)" opacity="0.9" />
            {thriving && <circle cx="256" cy="180" r="3.5" fill="var(--sun)" />}
          </g>

          {/* shrubs */}
          <g fill="var(--leaf)" opacity="0.9">
            <ellipse cx="140" cy="244" rx="26" ry="17" />
            <ellipse cx="164" cy="248" rx="20" ry="13" />
            <ellipse cx="212" cy="238" rx="16" ry="11" />
          </g>

          {/* centre flower bed */}
          <g style={{ opacity: bloomOpacity }}>
            {[
              { x: 150, h: 44 },
              { x: 168, h: 56 },
              { x: 186, h: 40 },
            ].map((f, i) => (
              <g key={f.x} className="animate-sway" style={{ transformOrigin: `${f.x}px 280px`, animationDelay: `${i * 0.6}s` }}>
                <path
                  d={`M${f.x} 282 C${f.x - 3} ${282 - f.h / 2} ${f.x + 3} ${282 - f.h / 2} ${f.x} ${282 - f.h}`}
                  stroke="var(--leaf)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={`M${f.x} ${282 - f.h / 2} c-14 -4 -18 -12 -18 -18 12 0 18 8 18 18 z`}
                  fill="var(--leaf)"
                  opacity="0.85"
                />
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse
                    key={a}
                    cx={f.x}
                    cy={282 - f.h - 9}
                    rx="6"
                    ry="10"
                    fill="var(--bloom)"
                    transform={`rotate(${a} ${f.x} ${282 - f.h})`}
                  />
                ))}
                <circle cx={f.x} cy={282 - f.h} r="6" fill="var(--sun)" />
              </g>
            ))}
          </g>

          {/* scattered little flowers */}
          {flowers.map((f) => (
            <g key={`${f.x}-${f.y}`} className="animate-breathe" style={{ animationDelay: `${f.delay}s`, opacity: bloomOpacity }}>
              {[0, 90, 180, 270].map((a) => (
                <ellipse
                  key={a}
                  cx={f.x}
                  cy={f.y - f.r * 0.7}
                  rx={f.r * 0.42}
                  ry={f.r * 0.7}
                  fill="var(--bloom)"
                  transform={`rotate(${a} ${f.x} ${f.y})`}
                />
              ))}
              <circle cx={f.x} cy={f.y} r={f.r * 0.38} fill="var(--sun)" />
            </g>
          ))}

          {/* grass tufts */}
          <g stroke="var(--leaf)" strokeWidth="3" strokeLinecap="round" opacity="0.9" fill="none">
            {[30, 100, 190, 250, 300].map((x) => (
              <g key={x} className="animate-sway" style={{ transformOrigin: `${x}px 296px` }}>
                <path d={`M${x} 296 C${x - 4} 288 ${x - 6} 282 ${x - 8} 278`} />
                <path d={`M${x} 296 V276`} />
                <path d={`M${x} 296 C${x + 4} 288 ${x + 6} 282 ${x + 8} 278`} />
              </g>
            ))}
          </g>
        </g>

        {/* birds */}
        <g stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55">
          <g className="animate-breathe">
            <path d="M96 106 q9 -8 18 0" />
            <path d="M114 106 q9 -8 18 0" />
          </g>
          <g className="animate-breathe" style={{ animationDelay: "1.4s" }}>
            <path d="M186 84 q7 -6 14 0" />
            <path d="M200 84 q7 -6 14 0" />
          </g>
          {thriving && (
            <g className="animate-breathe" style={{ animationDelay: "0.7s" }}>
              <path d="M232 128 q6 -5 12 0" />
              <path d="M244 128 q6 -5 12 0" />
            </g>
          )}
        </g>

        {/* butterflies / sparkles when celebrating */}
        {celebrating &&
          [
            [70, 140],
            [252, 156],
            [160, 96],
            [118, 214],
            [216, 200],
          ].map(([x, y], i) => (
            <g key={i} className="animate-twinkle" style={{ animationDelay: `${i * 0.4}s` }}>
              <path d={`M${x} ${y! - 10} L${x! + 4} ${y} L${x} ${y! + 10} L${x! - 4} ${y} Z`} fill="var(--sun)" />
            </g>
          ))}
      </g>

      <circle cx="160" cy="160" r="149" fill="none" stroke="var(--border)" strokeWidth="2" />
    </svg>
  );
}
