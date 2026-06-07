import { useEffect, useRef } from "react";
import "../styles/CustomCursor.css";

/**
 * Blob cursor with a pointing tip.
 *
 * Uses CSS custom properties (--cx, --cy) so both default and
 * hover states can independently offset the position:
 *  - Default blob: tip (top-left corner) at exactly (--cx, --cy)
 *  - Hover circle: circle CENTER at (--cx, --cy) via calc offset
 *
 * This makes clicking always feel precise regardless of shape.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const el = cursorRef.current;
    if (!el) return;

    const move = (e) => {
      el.style.setProperty("--cx", `${e.clientX}px`);
      el.style.setProperty("--cy", `${e.clientY}px`);
    };

    const show = () => el.classList.add("cursor--visible");
    const hide = () => el.classList.remove("cursor--visible");

    const detect = (e) => {
      const over = e.target.closest(
        "a, button, [role='button'], label, select, textarea, input, " +
        ".navbar-logo, .theme-toggle, .hero-social-link, " +
        ".project-card, .navbar-cv, .btn-resume, .btn-resume-circle, .snake-icon-btn, " +
        ".sg-btn, .sg-dpad-btn, .mg-start-btn, .mg-dpad-btn"
      );
      el.classList.toggle("cursor--hover", !!over);
    };

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mousemove", detect, { passive: true });
    document.addEventListener("mouseenter", show);
    document.addEventListener("mouseleave", hide);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousemove", detect);
      document.removeEventListener("mouseenter", show);
      document.removeEventListener("mouseleave", hide);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}
