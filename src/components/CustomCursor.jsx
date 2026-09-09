import { useEffect, useRef } from "react";
import "../styles/CustomCursor.css";

/**
 * Bespoke Cyber-Precision & Liquid Silk Kinetic Cursor
 * 
 * - Zero-latency Precision Diamond Core (instantaneous click hotspot)
 * - Kinetic Architectural Reticle with 4 dynamic corner brackets
 * - Smooth Velocity Ribbon Stream (canvas-drawn fluid silk trail with inertia)
 * - Intelligent Contextual Morphing:
 *    * Button / Link: Magnetic Target Lock + Accent Bloom
 *    * Project Card: Lens Expansion + Floating "↗" Badge + Dynamic Accent Color
 *    * Text Reading: Morph into Precision Luminous Caret / I-Beam
 *    * Tactile Click: Shutter snap recoil + Micro-Shockwave ripple
 * - Hardware-accelerated GPU transforms & high-DPI canvas
 * - Touch & Reduced-Motion accessibility guard
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const reticleRef = useRef(null);
  const canvasRef = useRef(null);
  const shockwaveRef = useRef(null);

  useEffect(() => {
    // 1. Accessibility & Device Detection
    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dot = dotRef.current;
    const reticle = reticleRef.current;
    const canvas = canvasRef.current;
    const shockwave = shockwaveRef.current;
    if (!dot || !reticle || !canvas) return;

    const ctx = canvas.getContext("2d");

    // 2. High-DPI Canvas Resizing
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 3. Coordinate State
    const mouse = { x: width / 2, y: height / 2 };
    const dotPos = { x: mouse.x, y: mouse.y };
    const reticlePos = { x: mouse.x, y: mouse.y };

    let isVisible = false;
    let isDown = false;
    let currentMode = "default"; // "default" | "hover" | "card" | "text"
    let customColor = null;
    let animId = null;

    // 4. Fluid Silk Trail & Rainbow Sparkles State
    const trail = [];
    const particles = [];
    const MAX_TRAIL_POINTS = prefersReducedMotion ? 0 : 26;
    let currentRainbowHue = 0;

    // 5. Mouse Interaction Listeners
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.classList.add("cursor--visible");
        reticle.classList.add("cursor--visible");
      }

      // Add to fluid trail if moved enough distance
      if (MAX_TRAIL_POINTS > 0) {
        const last = trail[0];
        const dist = last ? Math.hypot(e.clientX - last.x, e.clientY - last.y) : 10;
        
        // If sudden large jump (e.g. entering window, fast scroll, tab switch), reset trail
        if (dist > 75) {
          trail.length = 0;
          particles.length = 0;
        } else if (dist > 2.2) {
          trail.unshift({
            x: e.clientX,
            y: e.clientY,
            age: 0,
            maxAge: 20,
            speed: Math.min(dist, 35),
            hue: currentRainbowHue,
            color: customColor,
          });
          if (trail.length > MAX_TRAIL_POINTS) {
            trail.pop();
          }

          // Spawn subtle luminous stardust matching the current rainbow color
          if (!prefersReducedMotion && particles.length < 16 && Math.random() > 0.55) {
            particles.push({
              x: e.clientX + (Math.random() - 0.5) * 6,
              y: e.clientY + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 0.9,
              vy: (Math.random() - 0.5) * 0.9 - 0.2,
              size: Math.random() * 1.2 + 0.6,
              hue: (currentRainbowHue + (Math.random() - 0.5) * 12 + 360) % 360,
              life: 1.0,
              decay: Math.random() * 0.04 + 0.03,
            });
          }
        }
      }
    };

    const onScroll = () => {
      trail.length = 0;
      particles.length = 0;
      if (ctx) ctx.clearRect(0, 0, width, height);
    };

    const onMouseDown = () => {
      isDown = true;
      dot.classList.add("cursor--active");
      reticle.classList.add("cursor--active");

      if (shockwave) {
        shockwave.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
        shockwave.classList.remove("shockwave--pulse");
        void shockwave.offsetWidth; // force reflow
        shockwave.classList.add("shockwave--pulse");
      }
    };

    const onMouseUp = () => {
      isDown = false;
      dot.classList.remove("cursor--active");
      reticle.classList.remove("cursor--active");
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.classList.add("cursor--visible");
      reticle.classList.add("cursor--visible");
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.classList.remove("cursor--visible");
      reticle.classList.remove("cursor--visible");
      trail.length = 0;
      particles.length = 0;
      ctx.clearRect(0, 0, width, height);
    };

    // 6. Contextual Target Detection via Event Delegation
    const interactiveClickable =
      "a, button, [role='button'], .btn-primary, .btn-outline, .navbar-cv, " +
      ".btn-resume, .btn-resume-circle, .navbar-logo, .theme-toggle, .hero-social-link, " +
      ".nav-link, .sg-btn, .sg-dpad-btn, .mg-start-btn, .mg-dpad-btn, .snake-icon-btn, " +
      "input[type='submit'], input[type='button'], .project-tech-pill, .skill-pill, .skill-tag";

    const interactiveCard =
      ".project-card, .contact-card, .skill-card, .mg-terminal-window, .timeline-item";

    const textSelectors =
      "p, h1, h2, h3, h4, h5, h6, blockquote, code, pre, span.hero-description, " +
      "input[type='text'], input[type='email'], textarea";

    const updateCursorState = (targetEl) => {
      if (!targetEl || !targetEl.closest) {
        setMode("default", null);
        return;
      }

      // 1. Check card / project preview targets first
      const cardEl = targetEl.closest(interactiveCard);
      if (cardEl) {
        // Extract project custom color if present
        const styleColor =
          cardEl.style.getPropertyValue("--project-color") ||
          window.getComputedStyle(cardEl).getPropertyValue("--project-color");
        const cleanColor = styleColor ? styleColor.trim() : null;
        setMode("card", cleanColor);
        return;
      }

      // 2. Check interactive clickable targets
      const clickableEl = targetEl.closest(interactiveClickable);
      if (clickableEl) {
        const socialColor =
          clickableEl.style.getPropertyValue("--social-color") ||
          window.getComputedStyle(clickableEl).getPropertyValue("--social-color");
        setMode("hover", socialColor ? socialColor.trim() : null);
        return;
      }

      // 3. Check text reading targets
      const textEl = targetEl.closest(textSelectors);
      if (textEl && !textEl.closest("button, a")) {
        setMode("text", null);
        return;
      }

      // Default state
      setMode("default", null);
    };

    const setMode = (mode, color) => {
      if (currentMode === mode && customColor === color) return;
      currentMode = mode;
      customColor = color;

      reticle.classList.remove("mode--hover", "mode--card", "mode--text");
      dot.classList.remove("mode--hover", "mode--card", "mode--text");

      if (mode !== "default") {
        reticle.classList.add(`mode--${mode}`);
        dot.classList.add(`mode--${mode}`);
      }

      if (color) {
        reticle.style.setProperty("--cursor-accent", color);
        dot.style.setProperty("--cursor-accent", color);
      } else {
        reticle.style.removeProperty("--cursor-accent");
        dot.style.removeProperty("--cursor-accent");
      }
    };

    const onMouseOver = (e) => updateCursorState(e.target);
    const onMouseOut = (e) => {
      const related = e.relatedTarget;
      updateCursorState(related);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // 7. Kinetic Physics & Fluid Rendering Loop
    let lastTime = performance.now();
    let reticleAngle = 0;

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Ultra-tight dot response (zero perceivable input lag)
      dotPos.x += (mouse.x - dotPos.x) * 0.92;
      dotPos.y += (mouse.y - dotPos.y) * 0.92;

      // Smooth floating reticle physics with inertia
      const dx = mouse.x - reticlePos.x;
      const dy = mouse.y - reticlePos.y;
      const speed = Math.hypot(dx, dy);

      reticlePos.x += dx * 0.22;
      reticlePos.y += dy * 0.22;

      // Subtle agile banking tilt while moving (clamped to ±16deg), returns upright (0deg) when resting
      if (speed > 2 && currentMode === "default") {
        const moveAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        // Clamp banking tilt
        const bankTarget = Math.sin((moveAngle * Math.PI) / 180) * 14;
        reticleAngle += (bankTarget - reticleAngle) * 0.15;
      } else {
        // Return smoothly to upright (0deg)
        reticleAngle += (0 - reticleAngle) * 0.15;
      }

      // Update positions via hardware-accelerated transforms
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;

      let reticleTransform = `translate3d(${reticlePos.x}px, ${reticlePos.y}px, 0) translate(-50%, -50%)`;
      if (currentMode === "text") {
        reticleTransform += ` rotate(0deg) scale(1)`;
      } else if (currentMode === "card") {
        reticleTransform += ` rotate(0deg) scale(1.05)`;
      } else if (currentMode === "hover") {
        reticleTransform += ` rotate(45deg) scale(1.05)`;
      } else if (isDown) {
        reticleTransform += ` rotate(${reticleAngle}deg) scale(0.85)`;
      } else {
        reticleTransform += ` rotate(${reticleAngle}deg) scale(1)`;
      }
      reticle.style.transform = reticleTransform;

      // Dynamic rainbow cycle - fluidly shifting through the spectrum over time
      currentRainbowHue = (time * 0.075) % 360;
      const isDark =
        document.documentElement.getAttribute("data-theme") !== "light";
      const rainbowAccent = `hsl(${Math.round(currentRainbowHue)}, 95%, ${isDark ? 66 : 50}%)`;

      reticle.style.setProperty("--rainbow-color", rainbowAccent);
      dot.style.setProperty("--rainbow-color", rainbowAccent);
      if (shockwave) {
        shockwave.style.setProperty("--rainbow-color", rainbowAccent);
      }

      // 8. Render Fluid Rainbow Trail & Stardust on Canvas
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // 8a. Draw Delicate Rainbow Stardust (matching current hue)
        if (particles.length > 0) {
          for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            p.size *= 0.95;

            if (p.life <= 0 || p.size < 0.25) {
              particles.splice(i, 1);
              continue;
            }

            const pAlpha = Math.max(0, p.life * 0.85);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${Math.round(p.hue)}, 95%, ${isDark ? 76 : 54}%)`;
            ctx.globalAlpha = pAlpha;
            ctx.fill();
          }
        }

        // 8b. Draw Fluid Rainbow Silk Velocity Ribbon
        if (trail.length > 2) {
          // Age points and remove expired ones
          for (let i = trail.length - 1; i >= 0; i--) {
            trail[i].age += 1;
            if (trail[i].age >= trail[i].maxAge) {
              trail.splice(i, 1);
            }
          }

          const pointCount = trail.length;
          if (pointCount > 2) {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Render each segment along the trail with sleek, thin width and fluid cohesive color
            for (let i = 0; i < pointCount - 1; i++) {
              const p1 = trail[i];
              const p2 = trail[i + 1];
              const segmentDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

              // Discontinuity guard
              if (segmentDist > 65) continue;

              const progress = i / pointCount; // 0 (head) to 1 (tail)
              const lifeAlpha = 1 - p1.age / p1.maxAge;
              const alpha = Math.max(0, lifeAlpha * (1 - progress * 0.72));

              // Sleek, refined, thin ribbon (tapering from ~2.2px down to 0.5px)
              const lineWidth = Math.max(0.5, 2.2 * (1 - progress * 0.78));

              // Fluid rainbow color progression (homogeneous along trail, shifting continuously through rainbow over time)
              const pointHue = p1.hue !== undefined ? p1.hue : currentRainbowHue;
              const segColor = p1.color || `hsl(${Math.round(pointHue)}, 95%, ${isDark ? 66 : 50}%)`;

              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;

              // Pass 1: Subtle Ambient Ethereal Glow
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
              ctx.strokeStyle = segColor;
              ctx.lineWidth = lineWidth * 1.6;
              ctx.globalAlpha = alpha * (isDark ? 0.22 : 0.14);
              ctx.stroke();

              // Pass 2: Sharp, Vivid Fluid Core Ribbon
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
              ctx.strokeStyle = segColor;
              ctx.lineWidth = lineWidth;
              ctx.globalAlpha = alpha * 0.9;
              ctx.stroke();
            }

            // Reset global alpha
            ctx.globalAlpha = 1;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      {/* 1. Fluid Silk Velocity Trail */}
      <canvas
        ref={canvasRef}
        className="custom-cursor-trail"
        aria-hidden="true"
      />

      {/* 2. Micro-Shockwave for Tactile Click */}
      <div
        ref={shockwaveRef}
        className="custom-cursor-shockwave"
        aria-hidden="true"
      />

      {/* 3. Architectural Kinetic Reticle */}
      <div ref={reticleRef} className="custom-cursor-reticle" aria-hidden="true">
        {/* Corner Precision Brackets */}
        <span className="reticle-corner reticle-corner--tl" />
        <span className="reticle-corner reticle-corner--tr" />
        <span className="reticle-corner reticle-corner--br" />
        <span className="reticle-corner reticle-corner--bl" />

        {/* Ambient Ring / Target Aura */}
        <span className="reticle-ring" />

        {/* Contextual Explore Indicator */}
        <span className="reticle-badge">
          <span className="reticle-badge-icon">↗</span>
        </span>
      </div>

      {/* 4. Zero-Latency Diamond Hotspot Core */}
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true">
        <span className="dot-inner" />
      </div>
    </>
  );
}
