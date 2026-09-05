import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/PteranodonPet.css";

/* ═══════════════════════════════════════════════════════════════════════════
   PTERANODON PIXEL ART SPRITE
   16×16 SVG unit grid, rendered 56×56
   Features: Backward head crest, sharp beak, flapping wings, tail & feet
   ═══════════════════════════════════════════════════════════════════════════ */

function PteranodonSprite({ flapFrame, isFacingLeft, state, isBlinking }) {
  // Wing positions: 0 = up, 1 = mid, 2 = down, 3 = glide
  const wingState = state === "soaring" ? 3 : (flapFrame % 4);

  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 100 100"
      style={{
        transform: isFacingLeft ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.3s ease",
      }}
    >
      <defs>
        {/* Realistic Red Body Gradient */}
        <linearGradient id="pteroRedBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>

        {/* Fiery Crest Gradient */}
        <linearGradient id="pteroCrest" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7F1D1D" />
          <stop offset="60%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Realistic Leather Wing Membrane Gradient */}
        <linearGradient id="pteroWingMembrane" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.9)" />
          <stop offset="60%" stopColor="rgba(220, 38, 38, 0.75)" />
          <stop offset="100%" stopColor="rgba(245, 158, 11, 0.65)" />
        </linearGradient>

        {/* Beak Gradient */}
        <linearGradient id="pteroBeak" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* ── TAIL & FEET ── */}
      <path d="M35 58 L20 62 L28 55 Z" fill="#991B1B" />
      {/* Legs & Talons */}
      <path d="M42 60 L38 72 L32 74 M38 72 L40 76 M38 72 L35 76" stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M48 59 L46 70 L42 72" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ── TORSO & NECK ── */}
      <path d="M40 45 C42 35 48 30 54 28 C58 35 56 48 50 56 C44 60 38 56 40 45 Z" fill="url(#pteroRedBody)" />
      {/* Chest Muscles / Scale Highlights */}
      <path d="M46 34 C49 38 48 46 44 52" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* ── HEAD & REALISTIC CREST ── */}
      {/* Backward Crest */}
      <path d="M54 26 C44 20 28 14 18 16 C30 22 42 25 50 28 Z" fill="url(#pteroCrest)" />
      {/* Head Base */}
      <path d="M52 24 C55 20 62 20 66 23 C68 26 66 30 60 32 Z" fill="#DC2626" />
      {/* Sharp Curved Beak */}
      <path d="M64 24 L86 28 C88 29 88 30 84 31 L60 32 Z" fill="url(#pteroBeak)" />
      <path d="M64 28 L84 31" stroke="#78350F" strokeWidth="1" opacity="0.5" />

      {/* REALISTIC EYE */}
      {isBlinking ? (
        <line x1="58" y1="24" x2="62" y2="24" stroke="#450A0A" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <g>
          <circle cx="60" cy="24" r="3" fill="#FBBF24" />
          <circle cx="60" cy="24" r="1.5" fill="#000000" />
          <circle cx="59.2" cy="23.2" r="0.6" fill="#FFFFFF" />
        </g>
      )}

      {/* ── DYNAMIC WINGS (4-Frame Flap Animation) ── */}
      {wingState === 0 && (
        /* Wing Up (Arched Upward) */
        <g>
          {/* Main Wing Arm & Finger Bones */}
          <path d="M48 40 C42 22 36 8 26 2 C34 16 38 28 42 38 Z" fill="#B91C1C" />
          <path d="M26 2 C18 12 12 24 8 36 C22 28 34 32 44 42 Z" fill="url(#pteroWingMembrane)" stroke="#DC2626" strokeWidth="1" />
          {/* Wing Finger Structure Lines */}
          <path d="M26 2 L12 28 M26 2 L22 34" stroke="#F87171" strokeWidth="1" opacity="0.6" fill="none" />
        </g>
      )}

      {wingState === 1 && (
        /* Wing Mid-Horizontal */
        <g>
          <path d="M46 42 C32 36 18 32 4 28 C14 42 26 48 38 48 Z" fill="url(#pteroWingMembrane)" stroke="#DC2626" strokeWidth="1" />
          <path d="M48 40 C34 35 20 30 4 28" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M24 31 L18 44 M34 33 L30 46" stroke="#F87171" strokeWidth="1" opacity="0.5" fill="none" />
        </g>
      )}

      {wingState === 2 && (
        /* Wing Down (Swept Downward) */
        <g>
          <path d="M48 42 C38 56 26 70 12 84 C22 72 32 60 42 50 Z" fill="#B91C1C" />
          <path d="M12 84 C24 76 34 62 40 48 Z" fill="url(#pteroWingMembrane)" stroke="#DC2626" strokeWidth="1" />
          <path d="M12 84 L30 62 M12 84 L36 56" stroke="#F87171" strokeWidth="1" opacity="0.5" fill="none" />
        </g>
      )}

      {wingState === 3 && (
        /* Soaring / Aerodynamic Delta Glide */
        <g>
          <path d="M48 40 C34 28 18 20 2 16 C12 34 26 46 42 48 Z" fill="url(#pteroWingMembrane)" stroke="#DC2626" strokeWidth="1.2" />
          <path d="M48 40 C34 27 18 19 2 16" stroke="#B91C1C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M24 22 L18 36 M36 26 L30 42 M14 20 L8 30" stroke="#F87171" strokeWidth="1" opacity="0.6" fill="none" />
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
   MAIN PTERANODON PET COMPONENT
   Lives in top-left region of the portfolio
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PteranodonPet() {
  const [posX, setPosX] = useState(60);     // Left offset
  const [posY, setPosY] = useState(110);    // Top offset
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const [state, setState] = useState("soaring"); // soaring | flapping | trick | held
  const [flapFrame, setFlapFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [speechIdx, setSpeechIdx] = useState(-1);

  const petRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 60, y: 110 });

  const messages = [
    "SKREEE! Sky Patrol reporting!",
    "I am Ptero, guardian of the header!",
    "Click me to watch me do an air flip!",
    "Flying high over Aditya's portfolio!",
  ];

  // ── WING FLAP TICKER ──────────────────────────────────────────────────────
  useEffect(() => {
    const fps = state === "soaring" ? 3 : 8;
    const timer = setInterval(() => setFlapFrame(f => f + 1), 1000 / fps);
    return () => clearInterval(timer);
  }, [state]);

  // ── RANDOM BLINK ──────────────────────────────────────────────────────────
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3500 + Math.random() * 4500;
      return setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 180);
      }, delay);
    };
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // ── AUTONOMOUS GLIDE & PATROL MOVEMENT ───────────────────────────────────
  useEffect(() => {
    if (isDragging || state === "trick" || speechIdx !== -1) return;

    const interval = setInterval(() => {
      // 45% chance to glide left/right across top section
      if (Math.random() < 0.45) {
        setState("flapping");
        const dir = Math.random() > 0.5;
        setIsFacingLeft(dir);
        
        setPosX(prev => {
          const max = Math.min(window.innerWidth - 120, 500);
          const min = 30;
          const delta = (Math.random() * 80 + 40) * (dir ? -1 : 1);
          return Math.max(min, Math.min(max, prev + delta));
        });

        setPosY(prev => {
          const min = 80;
          const max = 220;
          const delta = (Math.random() * 40 - 20);
          return Math.max(min, Math.min(max, prev + delta));
        });

        setTimeout(() => setState("soaring"), 2500);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isDragging, state, speechIdx]);

  // ── SPEECH ROTATION ───────────────────────────────────────────────────────
  useEffect(() => {
    if (speechIdx < 0 || speechIdx >= messages.length) return;
    const t = setTimeout(() => setSpeechIdx(i => i + 1), 3200);
    return () => clearTimeout(t);
  }, [speechIdx, messages.length]);

  // ── CLICK TRICK ───────────────────────────────────────────────────────────
  const handleClick = () => {
    if (isDragging || state === "trick") return;
    setSpeechIdx(-1);
    setState("trick");
    setTimeout(() => {
      setState("soaring");
    }, 1200);
  };

  const handleMouseEnter = () => {
    if (!isDragging && state !== "trick") {
      setSpeechIdx(0);
    }
  };

  const handleMouseLeave = () => {
    setSpeechIdx(-1);
  };

  // ── DRAG ENGINE ───────────────────────────────────────────────────────────
  const startDrag = (cx, cy) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    setState("held");
    setSpeechIdx(-1);
    dragStartRef.current = { x: cx, y: cy };
    offsetStartRef.current = { x: posX, y: posY };
  };

  const moveDrag = useCallback((cx, cy) => {
    if (!isDraggingRef.current) return;
    const dx = cx - dragStartRef.current.x;
    const dy = cy - dragStartRef.current.y;
    const newX = Math.max(20, Math.min(window.innerWidth - 100, offsetStartRef.current.x + dx));
    const newY = Math.max(60, Math.min(window.innerHeight - 100, offsetStartRef.current.y + dy));
    setPosX(newX);
    setPosY(newY);
  }, [posX, posY]);

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

  // Touch handlers
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  useEffect(() => {
    const el = petRef.current;
    if (!el) return;
    const onMove = (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    const onEnd = () => endDrag();
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [moveDrag, endDrag]);

  // Motion trick props
  const getMotionProps = () => {
    if (state === "trick") {
      return {
        rotate: [0, -20, 360, 340, 0],
        y: [0, -35, -45, -15, 0],
        scale: [1, 1.25, 1.3, 1.1, 1],
      };
    }
    if (state === "held") {
      return {
        rotate: [0, 8, -8, 0],
        scale: 0.9,
      };
    }
    return {
      y: [0, -8, 0],
      rotate: isFacingLeft ? [0, -3, 0] : [0, 3, 0],
    };
  };

  const getTransitionProps = () => {
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
        left: `${posX}px`,
        top: `${posY}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Pteranodon Motion Sprite */}
      <motion.div animate={getMotionProps()} transition={getTransitionProps()}>
        <PteranodonSprite
          flapFrame={flapFrame}
          isFacingLeft={isFacingLeft}
          state={state}
          isBlinking={isBlinking}
        />
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {speechIdx >= 0 && speechIdx < messages.length && (
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
