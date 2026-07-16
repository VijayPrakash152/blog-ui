"use client";

import Matter from "matter-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import type { TechCategory } from "../tech-stack-data";
import CategoryBall from "./CategoryBall";
import TechBall from "./TechBall";

type CategoryNode = {
  kind: "category";
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  angle: number;
  size: number;
  color: string;
};

type TechNode = {
  kind: "tech";
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  angle: number;
  size: number;
  color: string;
};

type RenderNode = CategoryNode | TechNode;

const CATEGORY_COLORS = [
  "#7C61FF",
  "#17D2B9",
  "#82AAFF",
  "#F78C6C",
  "#C792EA",
  "#F07178",
  "#64D2FF",
  "#9CCC65",
  "#FFD166",
];

interface PhysicsWorldProps {
  categories: TechCategory[];
}

const PhysicsWorld = ({ categories }: PhysicsWorldProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const wallsRef = useRef<Matter.Body[]>([]);
  const bodyMapRef = useRef<Map<string, Matter.Body>>(new Map());
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const explodeTimerRef = useRef<number | null>(null);
  const phaseRef = useRef<"drop" | "tech" | "fade">("drop");
  const activeCategoryIndexRef = useRef<number>(-1);
  const hoveredTechCountRef = useRef(0);
  const inViewRef = useRef(true);
  const mountedRef = useRef(true);

  const [nodes, setNodes] = useState<RenderNode[]>([]);
  const [fading, setFading] = useState(false);
  const [tooltip, setTooltip] = useState<{ name: string; category: string } | null>(null);
  const [worldSize, setWorldSize] = useState({ width: 960, height: 520 });

  const isCompact = worldSize.width < 700;

  const orderedCategories = useMemo(() => categories.filter((item) => item.items.length > 0), [categories]);

  const pickNextCategoryIndex = () => {
    if (!orderedCategories.length) {
      return -1;
    }

    if (orderedCategories.length === 1) {
      return 0;
    }

    let next = 0;
    do {
      next = Math.floor(Math.random() * orderedCategories.length);
    } while (next === activeCategoryIndexRef.current);

    return next;
  };

  const clearTimers = () => {
    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (explodeTimerRef.current) {
      window.clearTimeout(explodeTimerRef.current);
      explodeTimerRef.current = null;
    }
  };

  const resetWorldBodies = () => {
    const engine = engineRef.current;
    if (!engine) return;

    bodyMapRef.current.forEach((body) => Matter.World.remove(engine.world, body));
    bodyMapRef.current.clear();
  };

  const buildBounds = (width: number, height: number) => {
    const engine = engineRef.current;
    if (!engine) return;

    wallsRef.current.forEach((wall) => Matter.World.remove(engine.world, wall));

    const t = 36;
    const left = Matter.Bodies.rectangle(-t / 2, height / 2, t, height * 2, { isStatic: true, restitution: 0.7, friction: 0.2 });
    const right = Matter.Bodies.rectangle(width + t / 2, height / 2, t, height * 2, { isStatic: true, restitution: 0.7, friction: 0.2 });
    const ground = Matter.Bodies.rectangle(width / 2, height + t / 2, width + 200, t, { isStatic: true, restitution: 0.66, friction: 0.8 });

    wallsRef.current = [left, right, ground];
    Matter.World.add(engine.world, wallsRef.current);
  };

  const syncNodes = () => {
    setNodes((current) =>
      current.map((node) => {
        const body = bodyMapRef.current.get(node.id);
        if (!body) return node;
        return { ...node, x: body.position.x, y: body.position.y, angle: body.angle };
      })
    );
  };

  const scheduleFade = () => {
    clearTimers();
    fadeTimerRef.current = window.setTimeout(() => {
      if (hoveredTechCountRef.current > 0) {
        scheduleFade();
        return;
      }

      phaseRef.current = "fade";
      setFading(true);

      fadeTimerRef.current = window.setTimeout(() => {
        setFading(false);
        startCategoryDrop();
      }, 900);
    }, isCompact ? 3200 : 4200);
  };

  const explodeCategory = () => {
    const engine = engineRef.current;
    if (!engine) return;

    const activeCategory = orderedCategories[activeCategoryIndexRef.current];
    if (!activeCategory) return;

    const categoryNode = nodes.find((n) => n.kind === "category");
    if (!categoryNode) return;

    const categoryBody = bodyMapRef.current.get(categoryNode.id);
    if (categoryBody) {
      Matter.World.remove(engine.world, categoryBody);
      bodyMapRef.current.delete(categoryNode.id);
    }

    phaseRef.current = "tech";

    const maxCount = isCompact ? 10 : 18;
    const techItems = activeCategory.items.slice(0, maxCount);

    const nextNodes: TechNode[] = techItems.map((tech, index) => {
      const radius = isCompact ? 24 : 27;
      const id = `tech-${activeCategory.category}-${index}-${Date.now()}`;
      const body = Matter.Bodies.circle(categoryNode.x + (Math.random() - 0.5) * 40, categoryNode.y, radius, {
        restitution: 0.72,
        friction: 0.03,
        frictionAir: isCompact ? 0.028 : 0.024,
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * (isCompact ? 9 : 12),
        y: -Math.random() * (isCompact ? 8 : 11) - 3,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);

      Matter.World.add(engine.world, body);
      bodyMapRef.current.set(id, body);

      return {
        kind: "tech",
        id,
        label: tech,
        category: activeCategory.category,
        x: body.position.x,
        y: body.position.y,
        angle: 0,
        size: radius * 2,
        color: CATEGORY_COLORS[activeCategoryIndexRef.current % CATEGORY_COLORS.length],
      };
    });

    setNodes(nextNodes);
    scheduleFade();
  };

  const startCategoryDrop = () => {
    clearTimers();
    resetWorldBodies();

    const engine = engineRef.current;
    if (!engine || !orderedCategories.length) {
      setNodes([]);
      return;
    }

    const nextIndex = pickNextCategoryIndex();
    if (nextIndex < 0) return;

    activeCategoryIndexRef.current = nextIndex;
    const activeCategory = orderedCategories[nextIndex];

    const radius = isCompact ? 38 : 46;
    const id = `category-${activeCategory.category}-${Date.now()}`;
    const body = Matter.Bodies.circle(worldSize.width / 2, 52, radius, {
      restitution: 0.7,
      friction: 0.06,
      frictionAir: 0.002,
    });
    Matter.Body.setAngularVelocity(body, 0.03);

    Matter.World.add(engine.world, body);
    bodyMapRef.current.set(id, body);

    phaseRef.current = "drop";
    setNodes([
      {
        kind: "category",
        id,
        label: activeCategory.category,
        category: activeCategory.category,
        x: body.position.x,
        y: body.position.y,
        angle: 0,
        size: radius * 2,
        color: CATEGORY_COLORS[nextIndex % CATEGORY_COLORS.length],
      },
    ]);

    explodeTimerRef.current = window.setTimeout(() => {
      if (phaseRef.current === "drop") {
        explodeCategory();
      }
    }, 1800);
  };

  useEffect(() => {
    mountedRef.current = true;
    const engine = Matter.Engine.create({ gravity: { x: 0, y: isCompact ? 0.82 : 1 } });
    engineRef.current = engine;

    buildBounds(worldSize.width, worldSize.height);
    startCategoryDrop();

    const step = () => {
      if (!mountedRef.current) return;

      if (runningRef.current && engineRef.current) {
        Matter.Engine.update(engineRef.current, 1000 / 60);
        syncNodes();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    runningRef.current = true;
    rafRef.current = requestAnimationFrame(step);

    return () => {
      mountedRef.current = false;
      clearTimers();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
      bodyMapRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    buildBounds(worldSize.width, worldSize.height);
    startCategoryDrop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldSize.width, worldSize.height, isCompact]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setWorldSize({ width: Math.max(320, rect.width), height: Math.max(360, rect.height) });
    });

    resizeObserver.observe(node);

    const visibility = () => {
      runningRef.current = !document.hidden && inViewRef.current;
    };

    document.addEventListener("visibilitychange", visibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
        runningRef.current = inViewRef.current && !document.hidden;
      },
      { threshold: 0.12 }
    );

    observer.observe(node);

    return () => {
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-6" hoverable={false}>
      <p className="text-xs uppercase tracking-[0.24em] text-[#7C61FF]">Tech Stack Physics Lab</p>
      <p className="mt-2 text-xs text-slate-400">A category sphere drops, bursts into technologies, then gracefully resets in a continuous loop.</p>

      <div ref={containerRef} className="relative mt-6 min-h-[28rem] overflow-hidden rounded-2xl border border-white/10 bg-[#060A14] md:min-h-[34rem]">
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#10182a] to-transparent" />

        {nodes.map((node) => {
          if (node.kind === "category") {
            return (
              <CategoryBall
                key={node.id}
                label={node.label}
                x={node.x}
                y={node.y}
                size={node.size}
                angle={node.angle}
                color={node.color}
              />
            );
          }

          return (
            <TechBall
              key={node.id}
              name={node.label}
              category={node.category}
              x={node.x}
              y={node.y}
              size={node.size}
              angle={node.angle}
              color={node.color}
              fading={fading}
              onHoverStart={() => {
                hoveredTechCountRef.current += 1;
                setTooltip({ name: node.label, category: node.category });
              }}
              onHoverEnd={() => {
                hoveredTechCountRef.current = Math.max(0, hoveredTechCountRef.current - 1);
                setTooltip((current) => (current?.name === node.label ? null : current));
              }}
              onClick={() => {
                setTooltip({ name: node.label, category: node.category });
              }}
            />
          );
        })}

        {tooltip ? (
          <div className="pointer-events-none absolute left-4 top-4 z-30 rounded-lg border border-white/10 bg-[#0B1220]/95 px-3 py-2 text-xs shadow-md shadow-black/30 backdrop-blur">
            <p className="font-semibold text-[#7C61FF]">{tooltip.name}</p>
            <p className="text-slate-400">{tooltip.category}</p>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default PhysicsWorld;
