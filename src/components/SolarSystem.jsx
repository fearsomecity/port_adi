import React, { useEffect, useRef, useState } from "react";

export default function SolarSystem({ size = 340 }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Planetary configuration
  const planets = [
    {
      name: "Mercury",
      radius: 4,
      orbitRadius: 48,
      speed: 0.035,
      color: "#a1a1a6",
      angle: Math.random() * Math.PI * 2,
    },
    {
      name: "Venus",
      radius: 7,
      orbitRadius: 75,
      speed: 0.022,
      color: "#e3a857",
      angle: Math.random() * Math.PI * 2,
    },
    {
      name: "Earth",
      radius: 8.5,
      orbitRadius: 108,
      speed: 0.015,
      color: "#4ba3e3",
      angle: Math.random() * Math.PI * 2,
      moons: [{ radius: 2, orbitRadius: 15, speed: 0.06, angle: 0 }],
    },
    {
      name: "Mars",
      radius: 6,
      orbitRadius: 140,
      speed: 0.011,
      color: "#cf5c42",
      angle: Math.random() * Math.PI * 2,
    },
    {
      name: "Jupiter",
      radius: 13,
      orbitRadius: 180,
      speed: 0.007,
      color: "#dfb288",
      angle: Math.random() * Math.PI * 2,
      rings: true,
    },
  ];

  const planetsRef = useRef(planets);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = size;
    const H = size;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;

    function render(t) {
      ctx.clearRect(0, 0, W, H);

      // Deep space background with a subtle center radial glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, W / 2);
      bgGrad.addColorStop(0, "#080711");
      bgGrad.addColorStop(1, "#020205");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 1. Draw Orbit Paths
      planetsRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(cx, cy, p.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
      });

      // 2. Draw the Sun (Glowing Core)
      ctx.save();
      const sunRadius = 18;
      const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunRadius * 2.8);
      sunGlow.addColorStop(0, "#ffffff");
      sunGlow.addColorStop(0.2, "#ffe57f");
      sunGlow.addColorStop(0.5, "rgba(255, 145, 0, 0.35)");
      sunGlow.addColorStop(1, "rgba(255, 87, 34, 0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, sunRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Draw Planets & Moons
      let currentHovered = null;

      planetsRef.current.forEach((p) => {
        // Update planetary position
        p.angle += p.speed;

        // Current planet center coordinates
        const px = cx + Math.cos(p.angle) * p.orbitRadius;
        const py = cy + Math.sin(p.angle) * p.orbitRadius;

        // Mouse collision check for hover details
        const dx = mouseRef.current.x - px;
        const dy = mouseRef.current.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < p.radius + 8;

        if (isHovered) {
          currentHovered = p.name;
        }

        const renderRadius = isHovered ? p.radius * 1.3 : p.radius;

        // Planet Glow base
        ctx.save();
        const pGlow = ctx.createRadialGradient(px, py, 0, px, py, renderRadius * 2.0);
        pGlow.addColorStop(0, p.color);
        pGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = pGlow;
        ctx.beginPath();
        ctx.arc(px, py, renderRadius * 2.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Planet Body
        ctx.beginPath();
        ctx.arc(px, py, renderRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Subtle shaded side (3D look)
        ctx.save();
        const shadeGrad = ctx.createLinearGradient(
          px - renderRadius,
          py - renderRadius,
          px + renderRadius,
          py + renderRadius
        );
        shadeGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        shadeGrad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        shadeGrad.addColorStop(1, "rgba(0, 0, 0, 0.75)");
        ctx.fillStyle = shadeGrad;
        ctx.beginPath();
        ctx.arc(px, py, renderRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw Rings (for Jupiter)
        if (p.rings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(0.2); // Tilted rings
          ctx.beginPath();
          ctx.ellipse(0, 0, renderRadius * 1.8, renderRadius * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(223, 178, 136, 0.45)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        }

        // Draw Moons
        if (p.moons) {
          p.moons.forEach((m) => {
            m.angle += m.speed;
            const mx = px + Math.cos(m.angle) * m.orbitRadius;
            const my = py + Math.sin(m.angle) * m.orbitRadius;

            // Moon body
            ctx.beginPath();
            ctx.arc(mx, my, m.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#cbd5e1";
            ctx.fill();
          });
        }
      });

      setHoveredPlanet(currentHovered);
      frameRef.current = requestAnimationFrame(render);
    }

    frameRef.current = requestAnimationFrame(render);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [size]);

  // Track relative mouse position inside the canvas
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -100, y: -100 };
    setHoveredPlanet(null);
  };

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          borderRadius: "50%",
          display: "block",
          cursor: hoveredPlanet ? "pointer" : "default",
          boxShadow: "0 0 40px rgba(8, 7, 17, 0.6)",
        }}
      />
      {hoveredPlanet && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10, 10, 18, 0.85)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "6px 14px",
            borderRadius: "20px",
            color: "#fff",
            fontSize: "12px",
            fontFamily: "var(--font-primary, sans-serif)",
            letterSpacing: "1px",
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            animation: "fadeIn 0.2s ease-out forwards",
          }}
        >
          {hoveredPlanet.toUpperCase()}
        </div>
      )}
    </div>
  );
}
