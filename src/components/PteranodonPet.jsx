import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/PteranodonPet.css";

/* ═══════════════════════════════════════════════════════════════════════════
   RED PIXEL ART PTERANODON SPRITE
   16×16 Pixel Grid (rendered crispEdges at 56×56)
   Colors: Fiery Red (#EF4444), Deep Crimson (#991B1B), Gold Beak (#FBBF24)
   ═══════════════════════════════════════════════════════════════════════════ */

function PixelPteranodonSprite({ flapFrame, isFacingLeft, state, isBlinking }) {
  // Wing state: 0 = up, 1 = mid, 2 = down, 3 = glide / folded sleep
  const wingState = state === "sleeping" ? 4 : (state === "soaring" ? 3 : (flapFrame % 4));

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
      <rect x="2" y="9" width="3" height="1" fill="#991B1B" />
      <rect x="1" y="9" width="1" height="1" fill="#EF4444" />

      {/* ── FEET / TALONS ── */}
      <rect x="4" y="11" width="1" height="2" fill="#7F1D1D" />
      <rect x="3" y="13" width="2" height="1" fill="#FBBF24" />

      {/* ── MAIN BODY ── */}
      <rect x="5" y="7" width="5" height="4" fill="#EF4444" />
      <rect x="6" y="8" width="3" height="2" fill="#DC2626" />
      <rect x="7" y="9" width="2" height="1" fill="#991B1B" />

      {/* ── HEAD & CREST ── */}
      {/* Head Crest */}
      <rect x="4" y="4" width="4" height="2" fill="#DC2626" />
      <rect x="2" y="3" width="3" height="2" fill="#EF4444" />
      <rect x="1" y="2" width="2" height="1" fill="#F59E0B" /> {/* Flame Crest Tip */}

      {/* Main Head */}
      <rect x="7" y="5" width="4" height="4" fill="#EF4444" />

      {/* Golden Beak */}
      <rect x="11" y="7" width="4" height="2" fill="#FBBF24" />
      <rect x="12" y="8" width="3" height="1" fill="#F59E0B" />

      {/* EYE */}
      {state === "sleeping" ? (
        <rect x="9" y="6" width="2" height="1" fill="#450A0A" />
      ) : isBlinking ? (
        <rect x="9" y="6" width="2" height="1" fill="#7F1D1D" />
      ) : (
        <g>
          <rect x="9" y="5" width="2" height="2" fill="#FFFFFF" />
          <rect x="10" y="5" width="1" height="2" fill="#000000" />
        </g>
      )}

      {/* ── PIXEL WINGS (4-Frame Flap + Sleeping Fold) ── */}
      {wingState === 4 && (
        /* Sleeping Folded Wings (Roosting) */
        <g fill="#DC2626">
          <rect x="4" y="6" width="3" height="4" fill="#991B1B" />
          <rect x="3" y="7" width="2" height="3" fill="#EF4444" />
        </g>
      )}

      {wingState === 0 && (
        /* Wing Up */
        <g>
          <rect x="6" y="2" width="2" height="5" fill="#EF4444" />
          <rect x="5" y="1" width="3" height="2" fill="#DC2626" />
          <rect x="3" y="0" width="3" height="2" fill="#F87171" />
          <rect x="5" y="3" width="2" height="3" fill="#991B1B" />
        </g>
      )}

      {wingState === 1 && (
        /* Wing Mid */
        <g>
          <rect x="3" y="6" width="4" height="2" fill="#EF4444" />
          <rect x="1" y="5" width="3" height="2" fill="#DC2626" />
          <rect x="0" y="4" width="2" height="2" fill="#F87171" />
          <rect x="2" y="7" width="3" height="1" fill="#991B1B" />
        </g>
      )}

      {wingState === 2 && (
        /* Wing Down */
        <g>
          <rect x="6" y="11" width="2" height="4" fill="#EF4444" />
          <rect x="5" y="13" width="2" height="3" fill="#DC2626" />
          <rect x="3" y="14" width="3" height="2" fill="#F87171" />
          <rect x="5" y="10" width="2" height="2" fill="#991B1B" />
        </g>
      )}

      {wingState === 3 && (
        /* Soaring / Glide */
        <g>
          <rect x="4" y="5" width="4" height="2" fill="#EF4444" />
          <rect x="2" y="4" width="3" height="2" fill="#DC2626" />
          <rect x="0" y="3" width="3" height="2" fill="#F87171" />
          <rect x="2" y="6" width="4" height="2" fill="#991B1B" />
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
   Hides & roosts in top-left sky, wakes up on user interaction
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PteranodonPet() {
  const [posX, setPosX] = useState(70);      // Left offset
  const [posY, setPosY] = useState(75);      // Top offset (hiding/perched near top edge)
  const [hasAwoken, setHasAwoken] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const [state, setState] = useState("sleeping"); // sleeping | waking | soaring | flapping | trick | held
  const [flapFrame, setFlapFrame] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [speechIdx, setSpeechIdx] = useState(-1);
  const [zs, setZs] = useState([]);

  const petRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 70, y: 75 });

  const messages = [
    "SKREEE! Red Ptero is awake!",
    "I am Ptero, sky guardian of the header!",
    "Click me to watch me do an air flip!",
    "Patrolling high over Aditya's portfolio!",
  ];

  // ── WING FLAP TICKER ──────────────────────────────────────────────────────
  useEffect(() => {
    if (state === "sleeping") return;
    const fps = state === "soaring" ? 3 : 8;
    const timer = setInterval(() => setFlapFrame(f => f + 1), 1000 / fps);
    return () => clearInterval(timer);
  }, [state]);

  // ── ZZZ FLOATING PARTICLES (WHEN SLEEPING) ────────────────────────────────
  useEffect(() => {
    if (state !== "sleeping") { setZs([]); return; }
    const t = setInterval(() => {
      setZs(p => [...p, { id: Math.random(), x: Math.random() * 15 + 15 }].slice(-3));
    }, 1600);
    return () => clearInterval(t);
  }, [state]);

  // ── RANDOM BLINK ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (state === "sleeping") return;
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
  }, [state]);

  // ── PATROL FLIGHT (ONLY WHEN AWOKEN) ──────────────────────────────────────
  useEffect(() => {
    if (!hasAwoken || isDragging || state === "trick" || speechIdx !== -1) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.5) {
        setState("flapping");
        const dir = Math.random() > 0.5;
        setIsFacingLeft(dir);
        
        setPosX(prev => {
          const max = Math.min(window.innerWidth - 120, 520);
          const min = 30;
          const delta = (Math.random() * 90 + 45) * (dir ? -1 : 1);
          return Math.max(min, Math.min(max, prev + delta));
        });

        setPosY(prev => {
          const min = 80;
          const max = 220;
          const delta = (Math.random() * 40 - 20);
          return Math.max(min, Math.min(max, prev + delta));
        });

        setTimeout(() => setState("soaring"), 2400);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [hasAwoken, isDragging, state, speechIdx]);

  // ── SPEECH ROTATION ───────────────────────────────────────────────────────
  useEffect(() => {
    if (speechIdx < 0 || speechIdx >= messages.length) return;
    const t = setTimeout(() => setSpeechIdx(i => i + 1), 3200);
    return () => clearTimeout(t);
  }, [speechIdx, messages.length]);

  // ── WAKE UP / CLICK INTERACTION ──────────────────────────────────────────
  const handleClick = () => {
    if (isDragging) return;

    // Wake up trigger if currently sleeping/roosting
    if (!hasAwoken) {
      setHasAwoken(true);
      setIsHovered(false);
      setState("waking");
      setPosY(110); // Fly down from perch
      setTimeout(() => {
        setState("soaring");
        setSpeechIdx(0); // Trigger "Red Ptero is awake!" message
      }, 600);
      return;
    }

    // Air trick if already awake
    if (state === "trick") return;
    setSpeechIdx(-1);
    setState("trick");
    setTimeout(() => {
      setState("soaring");
    }, 1200);
  };

  const handleMouseEnter = () => {
    if (isDragging || state === "trick") return;
    setIsHovered(true);
    if (hasAwoken) {
      setSpeechIdx(0);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSpeechIdx(-1);
  };

  // ── DRAG ENGINE ───────────────────────────────────────────────────────────
  const startDrag = (cx, cy) => {
    if (!hasAwoken) {
      setHasAwoken(true);
      setIsHovered(false);
    }
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

  // Motion props
  const getMotionProps = () => {
    if (state === "sleeping") {
      return { y: [0, -3, 0], scaleY: [1, 0.96, 1], rotate: 0 };
    }
    if (state === "waking") {
      return { y: [0, -20, 0], scale: [1, 1.2, 1], rotate: [0, -10, 0] };
    }
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
    if (state === "sleeping") {
      return { duration: 2.5, repeat: Infinity, ease: "easeInOut" };
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
        left: `${posX}px`,
        top: `${posY}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Zzz (when roosting/sleeping) */}
      <AnimatePresence>
        {!hasAwoken && state === "sleeping" &&
          zs.map((z, i) => (
            <motion.span
              key={z.id}
              className="ptero-z"
              style={{ left: `${z.x}px` }}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 0.85, y: -35, scale: 1 + i * 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            >
              z
            </motion.span>
          ))}
      </AnimatePresence>

      {/* Pteranodon Motion Sprite */}
      <motion.div animate={getMotionProps()} transition={getTransitionProps()}>
        <PixelPteranodonSprite
          flapFrame={flapFrame}
          isFacingLeft={isFacingLeft}
          state={state}
          isBlinking={isBlinking}
        />
      </motion.div>

      {/* Sleep hover prompt */}
      {!hasAwoken && isHovered && (
        <div className="ptero-speech" style={{ width: "max-content", textAlign: "center" }}>
          <TypewriterText text="Zzz... (Click to wake Red Ptero!)" speed={45} />
        </div>
      )}

      {/* Awoken Speech Bubble */}
      <AnimatePresence>
        {hasAwoken && speechIdx >= 0 && speechIdx < messages.length && (
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

