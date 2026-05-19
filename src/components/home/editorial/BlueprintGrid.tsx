interface BlueprintGridProps {
  /** Line color (defaults to gold) */
  color?: string;
  /** Opacity 0-1 (defaults to 0.06) */
  opacity?: number;
  /** Cell size in px */
  size?: number;
}

/**
 * Subtle architectural grid overlay used across navy and gold blueprint sections.
 * Renders an absolutely-positioned, aria-hidden background layer.
 * Parent must be `relative` and content layered with `z-10`.
 */
export const BlueprintGrid = ({
  color = "#C9A84C",
  opacity = 0.06,
  size = 48,
}: BlueprintGridProps) => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none"
    style={{
      opacity,
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
    }}
  />
);

/** Four gold corner registration marks pinned to the section's edges. */
export const RegistrationMarks = ({
  color = "#C9A84C",
  inset = 24,
}: {
  color?: string;
  inset?: number;
}) => (
  <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
    {[
      { top: inset, left: inset, h: true, v: true },
      { top: inset, right: inset, h: true, v: true },
      { bottom: inset, left: inset, h: true, v: true },
      { bottom: inset, right: inset, h: true, v: true },
    ].map((pos, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="absolute"
        style={{
          top: pos.top,
          bottom: pos.bottom,
          left: pos.left,
          right: pos.right,
        }}
      >
        <line x1="0" y1="8" x2="16" y2="8" stroke={color} strokeWidth="1" />
        <line x1="8" y1="0" x2="8" y2="16" stroke={color} strokeWidth="1" />
      </svg>
    ))}
  </div>
);
