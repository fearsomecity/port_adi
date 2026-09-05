import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/PteranodonPet.css";

/* ═══════════════════════════════════════════════════════════════════════════
   CUTE RED BIRD PIXEL ART SPRITE
   Chubby round body, rosy belly, golden beak, fluttering wings
   ═══════════════════════════════════════════════════════════════════════════ */

function PixelRedBirdSprite({ flapFrame, isFacingLeft, state, isBlinking }) {
  // Wing state: 0 = up, 1 = mid, 2 = down, 3 = glide
  const wingState = state === "soaring" ? 3 : (flapFrame % 4);

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 16 16"
      style={{
        shapeRendering: "crispEdges",
        transform: isFacingLeft ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.25s ease",
      }}
    >
      {/* ── TAIL FEATHERS ── */}
      <rect x="2" y="8" width="3" height="2" fill="#B91C1C" />
      <rect x="1" y="9" width="2" height="1" fill="#EF4444" />

      {/* ── TINY FEET ── */}
      <rect x="7" y="12" width="1" height="2" fill="#F59E0B" />
      <rect x="9" y="12" width="1" height="2" fill="#F59E0B" />

      {/* ── CHUBBY ROUND BODY ── */}
      <rect x="4" y="5" width="8" height="7" fill="#EF4444" />
      <rect x="5" y="4" width="6" height="8" fill="#EF4444" />

      {/* ── ROSY CHEST / UNDERBELLY ── */}
      <rect x="7" y="7" width="4" height="4" fill="#FECACA" />
      <rect x="8" y="6" width="3" height="5" fill="#F87171" />

      {/* ── CUTE HEAD CREST FEATHER ── */}
      <rect x="6" y="2" width="2" height="2" fill="#DC2626" />
      <rect x="7" y="1" width="1" height="2" fill="#EF4444" />

      {/* ── CUTE TINY BEAK ── */}
      <rect x="11" y="6" width="3" height="2" fill="#FBBF24" />
      <rect x="12" y="7" width="1" height="1" fill="#D97706" />

      {/* ── CUTE BIG EYE ── */}
      {isBlinking ? (
        <rect x="9" y="5" width="2" height="1" fill="#7F1D1D" />
      ) : (
        <g>
          <rect x="9" y="4" width="2" height="3" fill="#000000" />
          <rect x="9" y="4" width="1" height="1" fill="#FFFFFF" />
        </g>
      )}

      {/* ── FLUTTERING WINGS ── */}
      {wingState === 0 && (
        /* Wing High Up */
        <g fill="#DC2626">
          <rect x="5" y="1" width="3" height="4" />
          <rect x="4" y="2" width="2" height="3" fill="#B91C1C" />
        </g>
      )}

      {wingState === 1 && (
        /* Wing Mid Level */
        <g fill="#DC2626">
          <rect x="3" y="5" width="4" height="3" />
          <rect x="2" y="6" width="3" height="2" fill="#B91C1C" />
        </g>
      )}

      {wingState === 2 && (
        /* Wing Down */
        <g fill="#DC2626">
          <rect x="5" y="8" width="3" height="4" />
          <rect x="4" y="9" width="2" height="3" fill="#B91C1C" />
        </g>
      )}

      {wingState === 3 && (
        /* Soaring / Glide Wing */
        <g fill="#DC2626">
          <rect x="3" y="4" width="5" height="2" />
          <rect x="2" y="5" width="3" height="2" fill="#B91C1C" />
        </g>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPEWRITER SPEECH
   ═══════════════════════════════════════════════════════════════════════════ */
function TypewriterText({ text, speed = 45 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [text]);
  useEffect(() => {
    if (index < text.length) {
      const t = setTimeout(() => setIndex(i => i + 1), speed);
      return () => clearTimeout(t);
    }
  }, [index, text, speed]);
  return <span>{text.slice(0, index)}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN RED BIRD PET COMPONENT
   Hides behind Navbar, emerges when summoned via Navbar button,
   and flutters smoothly across the upper/middle viewport.
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PteranodonPet() {
  const [isSummoned, setIsSummoned] = useState(false);
  const [pos, setPos] = useState({ x: 200, y: 15 });
  const [targetPos, setTargetPos] = useState({ x: 200, y: 110 });
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const [state, setState] = useState("hidden");
  const [flapFrame, setFlapFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [speechIdx, setSpeechIdx] = useState(-1);
  const [rotation, setRotation] = useState(0);

  const petRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 200, y: 110 });

  const messages = [
    "Chirp chirp! Redbird emerged from the Navbar!",
    "I'm Redbird, your sky buddy!",
    "Click me to watch me do a somersault!",
    "Fluttering high over Aditya's portfolio!",
  ];

  // ── WING FLAP TICKER ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSummoned || state === "hidden") return;
    const fps = state === "soaring" ? 4 : 10;
    const timer = setInterval(() => setFlapFrame(f => f + 1), 1000 / fps);
    return () => clearInterval(timer);
  }, [isSummoned, state]);

  // ── RANDOM BLINK ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSummoned || state === "hidden") return;
    const scheduleBlink = () => {
      const delay = 3200 + Math.random() * 4000;
      return setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, delay);
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, [isSummoned, state]);

  // ── AUTONOMOUS SMOOTH FLIGHT ENGINE ──────────────────────────────────────
  useEffect(() => {
    if (!isSummoned || isDragging || state === "trick" || state === "retreating" || state === "emerging") return;

    let animId = null;

    const waypointInterval = setInterval(() => {
      const newTargetX = Math.random() * (window.innerWidth - 200) + 80;
      const newTargetY = Math.random() * 180 + 80;
      setTargetPos({ x: newTargetX, y: newTargetY });
      setState("flapping");
    }, 3600);

    const flyLoop = () => {
      setPos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          setState("soaring");
          return prev;
        }

        const nextX = prev.x + dx * 0.04;
        const nextY = prev.y + dy * 0.04;

        if (Math.abs(dx) > 1) {
          setIsFacingLeft(dx < 0);
        }
        const bankAngle = Math.max(-10, Math.min(10, dx * 0.04));
        setRotation(bankAngle);

        return { x: nextX, y: nextY };
      });

      animId = requestAnimationFrame(flyLoop);
    };

    animId = requestAnimationFrame(flyLoop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(waypointInterval);
    };
  }, [isSummoned, isDragging, state, targetPos]);

  // ── SPEECH ROTATION ───────────────────────────────────────────────────────
  useEffect(() => {
    if (speechIdx < 0 || speechIdx >= messages.length) return;
    const t = setTimeout(() => setSpeechIdx(i => i + 1), 3500);
    return () => clearTimeout(t);
  }, [speechIdx, messages.length]);

  // ── LISTEN FOR NAVBAR TOGGLE ──────────────────────────────────────────────
  useEffect(() => {
    const handleToggle = (e) => {
      const active = e.detail ? e.detail.active : !isSummoned;
      if (active) {
        setIsSummoned(true);
        setState("emerging");
        setPos({ x: Math.min(window.innerWidth - 160, Math.max(80, window.innerWidth - 220)), y: 15 });
        setTargetPos({ x: Math.min(window.innerWidth - 200, Math.max(100, window.innerWidth - 300)), y: 110 });
        setSpeechIdx(0);
        setTimeout(() => setState("soaring"), 750);
      } else {
        setState("retreating");
        setTargetPos({ x: pos.x, y: 15 });
        setSpeechIdx(-1);
        setTimeout(() => {
          setIsSummoned(false);
          setState("hidden");
        }, 850);
      }
    };

    window.addEventListener("toggle-ptero", handleToggle);
    return () => window.removeEventListener("toggle-ptero", handleToggle);
  }, [isSummoned, pos.x]);

  const handleClick = () => {
    if (!isSummoned || isDragging || state === "trick" || state === "retreating") return;
    setSpeechIdx(-1);
    setState("trick");
    setTimeout(() => {
      setState("soaring");
    }, 1100);
  };

  const handleMouseEnter = () => {
    if (isSummoned && !isDragging && state !== "trick" && state !== "retreating") {
      setSpeechIdx(0);
    }
  };

  const handleMouseLeave = () => {
    setSpeechIdx(-1);
  };

  const startDrag = (cx, cy) => {
    if (!isSummoned) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    setState("held");
    setSpeechIdx(-1);
    dragStartRef.current = { x: cx, y: cy };
    offsetStartRef.current = { x: pos.x, y: pos.y };
  };

  const moveDrag = useCallback((cx, cy) => {
    if (!isDraggingRef.current) return;
    const dx = cx - dragStartRef.current.x;
    const dy = cy - dragStartRef.current.y;
    const newX = Math.max(20, Math.min(window.innerWidth - 100, offsetStartRef.current.x + dx));
    const newY = Math.max(60, Math.min(window.innerHeight - 100, offsetStartRef.current.y + dy));
    setPos({ x: newX, y: newY });
    setTargetPos({ x: newX, y: newY });
  }, []);

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    setState("soaring");
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => moveDrag(e.clientX, e.clientY);
    const onUp = () => endDrag();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, moveDrag, endDrag]);

  if (!isSummoned && state === "hidden") return null;

  const getMotionProps = () => {
    if (state === "emerging") {
      return { y: [-30, 0], scale: [0.2, 1], opacity: [0, 1] };
    }
    if (state === "retreating") {
      return { y: [0, -40], scale: [1, 0.1], opacity: [1, 0] };
    }
    if (state === "trick") {
      return {
        rotate: [0, -20, 360, 340, 0],
        y: [0, -30, -40, -10, 0],
        scale: [1, 1.2, 1.25, 1.1, 1],
      };
    }
    if (state === "held") {
      return {
        rotate: [0, 6, -6, 0],
        scale: 0.9,
      };
    }
    return {
      y: [0, -6, 0],
      rotate: rotation,
    };
  };

  const getTransitionProps = () => {
    if (state === "emerging" || state === "retreating") {
      return { duration: 0.75, ease: [0.16, 1, 0.3, 1] };
    }
    if (state === "trick") {
      return { duration: 1.1, ease: "easeInOut" };
    }
    if (state === "held") {
      return { duration: 0.3, repeat: Infinity, ease: "easeInOut" };
    }
    return { duration: 2.2, repeat: Infinity, ease: "easeInOut" };
  };

  return (
    <div
      ref={petRef}
      className={`pteranodon-container ${isDragging ? "dragging" : ""}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div animate={getMotionProps()} transition={getTransitionProps()}>
        <PixelRedBirdSprite
          flapFrame={flapFrame}
          isFacingLeft={isFacingLeft}
          state={state}
          isBlinking={isBlinking}
        />
      </motion.div>

      <AnimatePresence>
        {isSummoned && speechIdx >= 0 && speechIdx < messages.length && (
          <motion.div
            key={speechIdx}
            className="ptero-speech"
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
          >
            <TypewriterText text={messages[speechIdx]} speed={40} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

