import type { CompanionState } from "@/lib/animo";

/**
 * A small digital garden. Every state is warm and welcoming.
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
  const bright = state === "celebrating" ? 1 : state === "thriving" ? 0.92 : 0.72;
  const petals = state === "waiting" ? 0.8 : 1;

  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      role="img"
      aria-label={`Your garden companion, currently ${state}`}
      className={`animate-breathe ${className}`}
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="var(--sun)" stopOpacity={state === "celebrating" ? 0.75 : 0.4} />
          <stop offset="100%" stopColor="var(--sun)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--bloom)" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="150" r="140" fill="url(#glow)" />
      <circle cx="160" cy="150" r="118" fill="var(--card)" opacity="0.75" />

      {/* sparkles when celebrating */}
      {state === "celebrating" &&
        [
          [70, 70],
          [250, 86],
          [242, 200],
          [66, 190],
          [160, 32],
        ].map(([x, y], i) => (
          <g key={i} className="animate-twinkle" style={{ animationDelay: `${i * 0.4}s` }}>
            <path
              d={`M${x} ${y! - 12} L${x! + 4} ${y} L${x} ${y! + 12} L${x! - 4} ${y} Z`}
              fill="var(--sun)"
            />
          </g>
        ))}

      {/* plant */}
      <g style={{ opacity: bright, transformOrigin: "160px 250px" }} className="animate-sway">
        <path
          d="M160 250 C158 210 158 180 160 150"
          stroke="var(--leaf)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M160 205 C128 200 110 184 106 164 C136 160 156 176 160 205 Z"
          fill="var(--leaf)"
          opacity="0.95"
        />
        <path
          d="M160 186 C192 182 210 166 214 146 C184 142 164 158 160 186 Z"
          fill="var(--leaf)"
          opacity="0.8"
        />
        {/* bloom */}
        <g style={{ opacity: petals, transformOrigin: "160px 130px" }}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse
              key={a}
              cx="160"
              cy="106"
              rx="15"
              ry="26"
              fill="var(--bloom)"
              opacity={state === "waiting" ? 0.55 : 0.9}
              transform={`rotate(${a} 160 130)`}
            />
          ))}
          <circle cx="160" cy="130" r="16" fill="var(--sun)" />
        </g>
      </g>

      {/* pot */}
      <path d="M112 248 H208 L196 296 H124 Z" fill="url(#pot)" />
      <rect x="106" y="236" width="108" height="18" rx="9" fill="var(--accent)" />
    </svg>
  );
}
