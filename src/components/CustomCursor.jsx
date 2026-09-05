import { useEffect, useRef } from "react";
import "../styles/CustomCursor.css";

/**
 * Ultra-smooth fluid custom cursor.
 * 
 * - Inner Precision Dot: high-responsiveness lerp (zero click lag, crisp precision)
 * - Outer Fluid Aura: physics lerp + velocity squash & stretch dynamics
 * - Click Ripple: tactile feedback on click
 * - Hardware Accelerated: translate3d GPU layer compositing
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const auraRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on touch/pointer-coarse devices
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const aura = auraRef.current;
    const ripple = rippleRef.current;
    if (!dot || !aura) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { x: target.x, y: target.y };
    const auraPos = { x: target.x, y: target.y };

    let isVisible = false;
    let isHovered = false;
    let isClicked = false;
    let animId = null;

    const onMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.classList.add("cursor--visible");
        aura.classList.add("cursor--visible");
      }
    };

    const onMouseDown = () => {
      isClicked = true;
      dot.classList.add("cursor--active");
      aura.classList.add("cursor--active");

      if (ripple) {
        ripple.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
        ripple.classList.remove("ripple--animating");
        void ripple.offsetWidth; // trigger reflow to restart CSS animation
        ripple.classList.add("ripple--animating");
      }
    };

    const onMouseUp = () => {
      isClicked = false;
      dot.classList.remove("cursor--active");
      aura.classList.remove("cursor--active");
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.classList.add("cursor--visible");
      aura.classList.add("cursor--visible");
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.classList.remove("cursor--visible");
      aura.classList.remove("cursor--visible");
    };

    // Interactive target checking via event delegation
    const interactiveSelector =
      "a, button, [role='button'], label, select, textarea, input, " +
      ".navbar-logo, .theme-toggle, .hero-social-link, " +
      ".project-card, .navbar-cv, .btn-resume, .btn-resume-circle, .snake-icon-btn, " +
      ".sg-btn, .sg-dpad-btn, .mg-start-btn, .mg-dpad-btn, .btn-primary, .btn-outline, " +
      ".skill-card, .contact-card, .nav-link";

    const onMouseOver = (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        isHovered = true;
        aura.classList.add("cursor--hover");
        dot.classList.add("cursor--hover");
      }
    };

    const onMouseOut = (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        const related = e.relatedTarget;
        if (!related || !related.closest || !related.closest(interactiveSelector)) {
          isHovered = false;
          aura.classList.remove("cursor--hover");
          dot.classList.remove("cursor--hover");
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    // Smooth physics loop
    const render = () => {
      // Tight inner dot lerp (0.85) -> zero input lag
      dotPos.x += (target.x - dotPos.x) * 0.85;
      dotPos.y += (target.y - dotPos.y) * 0.85;

      // Smooth outer aura lerp (0.18) -> fluid floating halo
      const dx = target.x - auraPos.x;
      const dy = target.y - auraPos.y;
      auraPos.x += dx * 0.18;
      auraPos.y += dy * 0.18;

      // Organic squash & stretch velocity physics
      const speed = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const scaleX = Math.min(1 + speed * 0.003, 1.35);
      const scaleY = Math.max(1 / (1 + speed * 0.003), 0.75);

      // GPU hardware accelerated rendering
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;

      if (isHovered) {
        aura.style.transform = `translate3d(${auraPos.x}px, ${auraPos.y}px, 0) translate(-50%, -50%) scale(1.2)`;
      } else if (isClicked) {
        aura.style.transform = `translate3d(${auraPos.x}px, ${auraPos.y}px, 0) translate(-50%, -50%) scale(0.85)`;
      } else {
        aura.style.transform = `translate3d(${auraPos.x}px, ${auraPos.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
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
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
      <div ref={auraRef} className="custom-cursor-aura" aria-hidden="true" />
      <div ref={rippleRef} className="custom-cursor-ripple" aria-hidden="true" />
    </>
  );
}

