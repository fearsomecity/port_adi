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
      width="56"
      height="56"
      viewBox="0 0 16 16"
      style={{
        shapeRendering: "crispEdges",
        transform: isFacingLeft ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.3s ease",
      }}
    >
      {/* ── TAIL ── */}
      <rect x="2" y="9" width="3" height="1" fill="#7C3AED" />
      <rect x="1" y="9" width="1" height="1" fill="#C084FC" />

      {/* ── BACK FEET ── */}
      <rect x="4" y="11" width="1" height="2" fill="#5B21B6" />
      <rect x="3" y="13" width="2" height="1" fill="#A78BFA" />

      {/* ── MAIN BODY ── */}
      <rect x="5" y="7" width="5" height="4" fill="#7C3AED" />
      <rect x="6" y="8" width="3" height="2" fill="#9333EA" />

      {/* ── CHEST HIGHLIGHT ── */}
      <rect x="8" y="8" width="2" height="2" fill="#DDD6FE" />

      {/* ── HEAD & CREST ── */}
      {/* Long backward crest */}
      <rect x="4" y="4" width="4" height="2" fill="#6D28D9" />
      <rect x="2" y="3" width="3" height="2" fill="#A78BFA" />
      <rect x="1" y="2" width="2" height="1" fill="#C084FC" />

      {/* Main head */}
      <rect x="7" y="5" width="4" height="4" fill="#7C3AED" />

      {/* Sharp Beak */}
      <rect x="11" y="7" width="4" height="2" fill="#F59E0B" />
      <rect x="12" y="8" width="4" height="1" fill="#FBBF24" />
      <rect x="15" y="8" width="1" height="1" fill="#D97706" />

      {/* EYE */}
      {isBlinking ? (
        <rect x="9" y="6" width="2" height="1" fill="#371B58" />
      ) : (
        <g>
          <rect x="9" y="5" width="2" height="2" fill="#FFFFFF" />
          <rect x="10" y="5" width="1" height="2" fill="#1E1B4B" />
        </g>
      )}

      {/* ── WINGS (Dynamic 4-frame flap) ── */}
      {wingState === 0 && (
        /* Wing Up */
        <g fill="#A78BFA">
          <rect x="6" y="2" width="2" height="5" fill="#7C3AED" />
          <rect x="5" y="1" width="3" height="2" fill="#8B5CF6" />
          <rect x="3" y="0" width="3" height="2" fill="#C084FC" />
          {/* Wing membrane inner */}
          <rect x="5" y="3" width="2" height="3" fill="rgba(192, 132, 252, 0.4)" />
        </g>
      )}

      {wingState === 1 && (
        /* Wing Mid-Horizontal */
        <g fill="#A78BFA">
          <rect x="3" y="6" width="4" height="2" fill="#7C3AED" />
          <rect x="1" y="5" width="3" height="2" fill="#8B5CF6" />
          <rect x="0" y="4" width="2" height="2" fill="#C084FC" />
          <rect x="2" y="7" width="3" height="1" fill="rgba(192, 132, 252, 0.4)" />
        </g>
      )}

      {wingState === 2 && (
        /* Wing Down */
        <g fill="#A78BFA">
          <rect x="6" y="11" width="2" height="4" fill="#7C3AED" />
          <rect x="5" y="13" width="2" height="3" fill="#8B5CF6" />
          <rect x="3" y="14" width="3" height="2" fill="#C084FC" />
          <rect x="5" y="10" width="2" height="2" fill="rgba(192, 132, 252, 0.4)" />
        </g>
      )}

      {wingState === 3 && (
        /* Soaring / Glide Spread */
        <g fill="#A78BFA">
          <rect x="4" y="5" width="4" height="2" fill="#7C3AED" />
          <rect x="2" y="4" width="3" height="2" fill="#8B5CF6" />
          <rect x="0" y="3" width="3" height="2" fill="#C084FC" />
          <rect x="2" y="6" width="4" height="2" fill="rgba(192, 132, 252, 0.45)" />
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
