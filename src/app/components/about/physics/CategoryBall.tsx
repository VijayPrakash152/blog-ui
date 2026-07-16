import type { CSSProperties } from "react";

interface CategoryBallProps {
  label: string;
  x: number;
  y: number;
  size: number;
  angle: number;
  color: string;
}

const CategoryBall = ({ label, x, y, size, angle, color }: CategoryBallProps) => {
  const style: CSSProperties = {
    left: x,
    top: y,
    width: size,
    height: size,
    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
    background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.45), ${color})`,
    boxShadow: "inset -10px -12px 20px rgba(8,10,18,0.34), 0 16px 30px rgba(4,8,16,0.44)",
  };

  return (
    <div className="absolute rounded-full border border-white/30" style={style} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white">
        {label}
      </div>
    </div>
  );
};

export default CategoryBall;
