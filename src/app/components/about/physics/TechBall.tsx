import type { CSSProperties } from "react";

interface TechBallProps {
  name: string;
  category: string;
  x: number;
  y: number;
  size: number;
  angle: number;
  color: string;
  fading: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

const TechBall = ({
  name,
  category,
  x,
  y,
  size,
  angle,
  color,
  fading,
  onHoverStart,
  onHoverEnd,
  onClick,
}: TechBallProps) => {
  const style: CSSProperties = {
    left: x,
    top: y,
    width: size,
    height: size,
    transform: `translate(-50%, -50%) rotate(${angle}rad) ${fading ? "scale(0.78)" : "scale(1)"}`,
    opacity: fading ? 0 : 1,
    background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.44), ${color})`,
    boxShadow: "inset -8px -10px 18px rgba(8,10,18,0.38), 0 10px 22px rgba(4,8,16,0.38)",
  };

  return (
    <button
      type="button"
      className="group absolute rounded-full border border-white/25 text-[10px] font-semibold text-white transition duration-180 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C61FF]"
      style={style}
      aria-label={`${name} in ${category}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onClick}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-2 text-center leading-tight">{name}</span>
    </button>
  );
};

export default TechBall;
