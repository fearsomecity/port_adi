import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/PixelPet.css";

// SVG Pixel Art Cat (16x16 grid)
function CatSprite({ state, isMovingLeft }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 16 16"
      style={{
        shapeRendering: "crispEdges",
        transform: isMovingLeft ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.3s ease, filter 0.3s ease",
        filter:
          state === "angry"
            ? "drop-shadow(0px 0px 1px rgba(239, 68, 68, 0.8)) sepia(0.3) saturate(2.5) hue-rotate(-50deg)"
            : "none",
      }}
    >
      {/* Tuxedo Cat Black Body */}
      <g fill="#222222">
        {/* Tail */}
        <rect x="2" y="7" width="1" height="2" />
        <rect x="3" y="6" width="1" height="2" />
        <rect x="4" y="5" width="1" height="2" />

        {/* Torso/Body */}
        <rect x="5" y="8" width="6" height="4" />
        <rect x="6" y="7" width="4" height="1" />

        {/* Head */}
        <rect x="9" y="4" width="5" height="5" />
        <rect x="9" y="3" width="1" height="1" /> {/* Left Ear */}
        <rect x="13" y="3" width="1" height="1" /> {/* Right Ear */}
      </g>

      {/* Shadow details */}
      <g fill="#000000">
        <rect x="5" y="11" width="5" height="1" />
      </g>

      {/* All 4 Legs with Swing Hinges */}
      <g className={state === "walking" || state === "chasing" ? "cat-legs-walking" : ""}>
        {/* Back-Right Leg (Background) */}
        <g className="leg-group-back-bg" style={{ transformOrigin: "5.5px 12px" }}>
          <rect x="5" y="12" width="1" height="2" fill="#0c0c0c" />
          <rect x="5" y="13" width="1" height="1" fill="#dddddd" />
        </g>

        {/* Back-Left Leg (Foreground) */}
        <g className="leg-group-back-fg" style={{ transformOrigin: "6.5px 12px" }}>
          <rect x="6" y="12" width="1" height="2" fill="#151515" />
          <rect x="6" y="13" width="1" height="1" fill="#FFFFFF" />
        </g>

        {/* Front-Right Leg (Background) */}
        <g className="leg-group-front-bg" style={{ transformOrigin: "8.5px 12px" }}>
          <rect x="8" y="12" width="1" height="2" fill="#0c0c0c" />
          <rect x="8" y="13" width="1" height="1" fill="#dddddd" />
        </g>

        {/* Front-Left Leg (Foreground) */}
        <g className="leg-group-front-fg" style={{ transformOrigin: "9.5px 12px" }}>
          <rect x="9" y="12" width="1" height="2" fill="#151515" />
          <rect x="9" y="13" width="1" height="1" fill="#FFFFFF" />
        </g>
      </g>

      {/* Eyes */}
      {state === "sleeping" ? (
        <g fill="#444444">
          <rect x="10" y="6" width="1" height="1" />
          <rect x="12" y="6" width="1" height="1" />
        </g>
      ) : state === "angry" ? (
        // Angry eyes — squinted/angled
        <g fill="#FF3333">
          <rect x="9" y="5" width="2" height="1" />
          <rect x="9" y="6" width="1" height="1" />
          <rect x="12" y="5" width="2" height="1" />
          <rect x="13" y="6" width="1" height="1" />
        </g>
      ) : (
        // Big White Shiny Eyes
        <g>
          <rect x="9" y="5" width="2" height="2" fill="#FFFFFF" />
          <rect x="10" y="5" width="1" height="2" fill="#000000" />
          <rect x="9" y="5" width="1" height="1" fill="#FFFFFF" />

          <rect x="12" y="5" width="2" height="2" fill="#FFFFFF" />
          <rect x="12" y="5" width="1" height="2" fill="#000000" />
          <rect x="13" y="5" width="1" height="1" fill="#FFFFFF" />
        </g>
      )}

      {/* Pink Nose */}
      <rect x="11" y="7" width="1" height="1" fill="#F472B6" />

      {/* Angry mouth */}
      {state === "angry" && (
        <g fill="#FF3333">
          <rect x="10" y="8" width="1" height="1" />
          <rect x="12" y="8" width="1" height="1" />
          <rect x="11" y="9" width="2" height="1" />
        </g>
      )}

      {/* White Chest & Snout Mask & Tail Tip */}
      <g fill="#FFFFFF">
        <rect x="4" y="5" width="1" height="1" /> {/* Tail Tip */}
        <rect x="9" y="8" width="1" height="2" /> {/* Chest patch */}
        <rect x="10" y="7" width="3" height="2" /> {/* Muzzle white mask */}
        <rect x="11" y="6" width="1" height="1" />
      </g>
    </svg>
  );
}

// Retro Typewriter text effect
function TypewriterText({ text, speed = 50 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <span>{text.slice(0, index)}</span>;
}

export default function PixelPet() {
  const [state, setState] = useState("idle");
  const [posX, setPosX] = useState(100);   // offset from right (px)
  const [posY, setPosY] = useState(0);     // height offset from bottom (px)
  const [isMovingLeft, setIsMovingLeft] = useState(true);
  const [zs, setZs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [hoverSequenceIdx, setHoverSequenceIdx] = useState(-1);
  const [refuseBubble, setRefuseBubble] = useState(false);
  const [isThrown, setIsThrown] = useState(false);

  // Refs for drag (avoids stale closure issues in touch/mouse handlers)
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: posX, y: posY });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const petRef = useRef(null);

  // Keep posRef in sync
  useEffect(() => { posRef.current = { x: posX, y: posY }; }, [posX, posY]);

  const hoverMessages = [
    "Hi, I am Tinker 🐱",
    "Nice to meet you!!",
    "Click me — I might do a backflip!",
  ];

  // ─── Hover sequence timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (hoverSequenceIdx === -1) return;
    if (hoverSequenceIdx >= hoverMessages.length) return;
    const timer = setTimeout(() => {
      setHoverSequenceIdx((prev) => prev + 1);
    }, 2800);
    return () => clearTimeout(timer);
  }, [hoverSequenceIdx]);

  // ─── State engine (idle / walk / sleep / play) ────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        state === "playing" ||
        state === "pouncing" ||
        state === "chasing" ||
        state === "held" ||
        state === "angry" ||
        state === "ball" ||
        isDropping ||
        isThrown ||
        hoverSequenceIdx !== -1
      ) return;

      const rand = Math.random();
      if (rand < 0.25) {
        setState("idle");
      } else if (rand < 0.5) {
        setState("walking");
        setIsMovingLeft(Math.random() > 0.5);
      } else if (rand < 0.75) {
        const plays = ["pouncing", "chasing", "ball"];
        const playType = plays[Math.floor(Math.random() * plays.length)];
        setState(playType);
        setTimeout(() => {
          setState("idle");
        }, playType === "pouncing" ? 1800 : playType === "ball" ? 3000 : 2000);
      } else {
        setState("sleeping");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [state, isDropping, isThrown, hoverSequenceIdx]);

  // ─── Walking / chasing motion ─────────────────────────────────────────────
  useEffect(() => {
    if (state !== "walking" && state !== "chasing") return;
    if (hoverSequenceIdx !== -1) return;

    const intervalTime = state === "chasing" ? 30 : 40;
    const walkInterval = setInterval(() => {
      setPosX((prev) => {
        const step = state === "chasing" ? 3 : 2.2;
        const maxBoundary = window.innerWidth - 100;
        const minBoundary = 20;

        if (state === "chasing") {
          setIsMovingLeft((m) => !m);
          return Math.max(minBoundary, Math.min(maxBoundary, prev + (Math.random() > 0.5 ? step : -step)));
        }

        if (isMovingLeft) {
          if (prev >= maxBoundary) { setIsMovingLeft(false); return prev - step; }
          return prev + step;
        } else {
          if (prev <= minBoundary) { setIsMovingLeft(true); return prev + step; }
          return prev - step;
        }
      });
    }, intervalTime);
    return () => clearInterval(walkInterval);
  }, [state, isMovingLeft, hoverSequenceIdx]);

  // ─── Zzz particles ────────────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "sleeping" || hoverSequenceIdx !== -1) { setZs([]); return; }
    const zInterval = setInterval(() => {
      setZs((prev) => [
        ...prev,
        { id: Math.random(), x: Math.random() * 20 + 20, y: 0 },
      ].slice(-3));
    }, 1500);
    return () => clearInterval(zInterval);
  }, [state, hoverSequenceIdx]);

  // ─── Physics: drop / throw ────────────────────────────────────────────────
  const launchPhysics = useCallback((startHeight, velX, velY) => {
    setIsDropping(true);
    setIsThrown(true);

    let currentHeight = startHeight;
    let currentX = posRef.current.x;
    let vX = velX;   // horizontal velocity (px per frame, positive = moves left on screen i.e. posX increases)
    let vY = velY;   // vertical velocity (px per frame, positive = going up)
    const gravity = 1.5;
    const bounce = -0.38;
    const friction = 0.85;

    const dropTimer = setInterval(() => {
      vY -= gravity;          // gravity pulls down (reduces upward vel)
      currentHeight += vY;    // posY is height from bottom
      currentX += vX;         // posX is offset from right

      // Clamp horizontal bounds
      const maxX = window.innerWidth - 70;
      const minX = 20;
      if (currentX > maxX) { currentX = maxX; vX *= -0.5; }
      if (currentX < minX) { currentX = minX; vX *= -0.5; }

      if (currentHeight <= 0) {
        currentHeight = 0;
        vX *= friction;         // skid on landing
        if (Math.abs(vY) < 2.5) {
          // Settled — land angry
          clearInterval(dropTimer);
          setPosX(currentX);
          setPosY(0);
          setIsDropping(false);
          setIsThrown(false);
          setState("angry");
          setTimeout(() => setState("idle"), 2500);
          return;
        }
        vY = vY * bounce;       // bounce
      }

      setPosX(currentX);
      setPosY(currentHeight);
    }, 16);
  }, []);

  // ─── Shared drag-start logic (mouse + touch) ──────────────────────────────
  const startDrag = useCallback((clientX, clientY) => {
    if (isDropping || isThrown) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    setState("held");
    setHoverSequenceIdx(-1);
    dragStartRef.current = { x: clientX, y: clientY };
    dragOffsetRef.current = { x: posRef.current.x, y: posRef.current.y };
    lastPosRef.current = { x: clientX, y: clientY };
    lastTimeRef.current = performance.now();
    velocityRef.current = { x: 0, y: 0 };
  }, [isDropping, isThrown]);

  // ─── Shared drag-move logic ───────────────────────────────────────────────
  const moveDrag = useCallback((clientX, clientY) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);

    // Velocity in px/ms → convert to px/frame (≈16ms)
    const rawVX = (clientX - lastPosRef.current.x) / dt * 16;
    const rawVY = (clientY - lastPosRef.current.y) / dt * 16;

    // Smooth velocity with EMA
    velocityRef.current = {
      x: velocityRef.current.x * 0.6 + rawVX * 0.4,
      y: velocityRef.current.y * 0.6 + rawVY * 0.4,
    };

    lastPosRef.current = { x: clientX, y: clientY };
    lastTimeRef.current = now;

    const deltaX = dragStartRef.current.x - clientX;
    const deltaY = dragStartRef.current.y - clientY;

    const newPosX = Math.max(20, Math.min(window.innerWidth - 100, dragOffsetRef.current.x + deltaX));
    const newPosY = Math.max(0, dragOffsetRef.current.y + deltaY);
    setPosX(newPosX);
    setPosY(newPosY);
  }, []);

  // ─── Shared drag-end logic ────────────────────────────────────────────────
  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const currentHeight = posRef.current.y;
    const vel = velocityRef.current;

    // Compute throw speed (magnitude)
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

    if (currentHeight > 20 || speed > 3) {
      // Thrown or dropped from height — apply physics
      // posX increases to the left, so horizontal throw:
      // if user flicked right (vel.x positive on screen), posX decreases
      const throwVX = -vel.x;          // screen-right flick → posX decreases
      const throwVY = -vel.y * 0.8;   // screen-up flick → height increases (posY up)

      launchPhysics(currentHeight, throwVX, throwVY);
    } else {
      // Just placed gently
      setPosY(0);
      setState("idle");
    }
  }, [launchPhysics]);

  // ─── Mouse events ─────────────────────────────────────────────────────────
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

  // ─── Touch events ─────────────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent scroll
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const el = petRef.current;
    if (!el) return;

    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (e) => {
      e.preventDefault();
      endDrag();
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    el.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [moveDrag, endDrag]);

  // ─── Click / hover handlers ───────────────────────────────────────────────
  const handlePetClick = (e) => {
    if (state === "held" || state === "angry" || state === "ball" || state === "playing" || refuseBubble || isDropping || isThrown) return;
    setHoverSequenceIdx(-1);

    if (Math.random() < 0.6) {
      setState("playing");
      setTimeout(() => setState("idle"), 1200);
    } else {
      setRefuseBubble(true);
      setTimeout(() => setRefuseBubble(false), 2000);
    }
  };

  const handleMouseEnter = () => {
    if (state === "held" || state === "angry" || isDropping || isThrown) return;
    setHoverSequenceIdx(0);
  };

  const handleMouseLeave = () => {
    setHoverSequenceIdx(-1);
  };

  // ─── Framer Motion animation props ───────────────────────────────────────
  const getAnimationProps = () => {
    if (refuseBubble) return { x: [0, -4, 4, -4, 4, 0], scaleY: 0.95, scaleX: 1.05 };

    switch (state) {
      case "held":      return { y: 0, scaleY: 1.25, scaleX: 0.85 };
      case "angry":     return { x: [0, -3, 3, -3, 3, 0], scaleY: [0.75, 0.75, 0.75, 0.75, 0.75], scaleX: [1.25, 1.25, 1.25, 1.25, 1.25] };
      case "playing":   return { y: [0, -35, -45, -35, 0], rotate: [0, 180, 360, 360, 360], scaleY: [1, 0.7, 1.2, 1.2, 0.8, 1], scaleX: [1, 1.3, 0.8, 0.8, 1.2, 1] };
      case "pouncing":  return { y: [0, 2, 0, -25, -28, 0, 3, 0], x: isMovingLeft ? [0, -2, -5, -20, -35, -45, -46, -45] : [0, 2, 5, 20, 35, 45, 46, 45], scaleY: [1, 0.6, 0.7, 1.4, 1.3, 0.7, 0.9, 1], scaleX: [1, 1.4, 1.3, 0.7, 0.8, 1.4, 1.1, 1] };
      case "chasing":   return { y: [0, -4, 0, -4, 0], scaleY: [1, 0.85, 1.05, 0.85, 1], scaleX: [1, 1.1, 0.9, 1.1, 1] };
      case "ball":      return { x: isMovingLeft ? [0, 8, -6, -35, -45, -45] : [0, -8, 6, 35, 45, 45], y: [0, 0, -2, -18, 0, 0], scaleY: [1, 0.7, 1.2, 1.2, 0.7, 1], scaleX: [1, 1.3, 0.8, 0.8, 1.3, 1] };
      case "walking":   return { y: [0, -3, 0, -3, 0], scaleY: [1, 0.92, 1.03, 0.92, 1], scaleX: [1, 1.05, 0.95, 1.05, 1] };
      case "sleeping":  return { scaleY: [1, 0.94, 1], scaleX: [1, 1.03, 1] };
      case "idle":
      default:
        return hoverSequenceIdx !== -1
          ? { scaleY: [1, 0.97, 1], scaleX: [1, 1.03, 1] }
          : { scaleY: [1, 0.96, 1], scaleX: [1, 1.02, 1] };
    }
  };

  const getTransitionProps = () => {
    if (refuseBubble) return { duration: 0.5 };
    switch (state) {
      case "held":      return { duration: 0.2 };
      case "angry":     return { repeat: Infinity, duration: 0.15 };
      case "playing":   return { duration: 1.2, ease: "easeInOut" };
      case "pouncing":  return { duration: 1.8, ease: [0.25, 1, 0.5, 1] };
      case "chasing":   return { repeat: Infinity, duration: 0.6, ease: "linear" };
      case "ball":      return { duration: 2.2, ease: [0.25, 1, 0.5, 1] };
      case "walking":   return { repeat: Infinity, duration: 0.8, ease: "easeInOut" };
      case "sleeping":  return { repeat: Infinity, duration: 2.2, ease: "easeInOut" };
      case "idle":
      default:
        return { repeat: Infinity, duration: hoverSequenceIdx !== -1 ? 1.4 : 1.8, ease: "easeInOut" };
    }
  };

  return (
    <div
      ref={petRef}
      className={`pixel-pet-container ${isDragging ? "dragging" : ""} ${isDropping || isThrown ? "dropping" : ""}`}
      style={{
        right: `${posX}px`,
        bottom: `calc(0.5rem + ${posY}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none", // critical — prevent browser scroll hijacking touch
      }}
      onMouseDown={handleMouseDown}
      onClick={handlePetClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Zzz letters when sleeping */}
      <AnimatePresence>
        {state === "sleeping" && hoverSequenceIdx === -1 &&
          zs.map((z, idx) => (
            <motion.span
              key={z.id}
              className="pet-z"
              style={{ left: `${z.x}px` }}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 0.8, y: -40, scale: 1 + idx * 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              z
            </motion.span>
          ))}
      </AnimatePresence>

      {/* Throw trail effect */}
      {isThrown && (
        <div className="pet-throw-trail" />
      )}

      {/* Play Toy Ball */}
      {state === "ball" && (
        <motion.div
          className="pet-toy-ball"
          animate={{
            x: isMovingLeft ? [0, -10, -55, -50, -48, -48] : [0, 10, 55, 50, 48, 48],
            y: [0, -4, -14, -1, 0, 0],
            rotate: [0, 90, 720, 900, 950, 950],
          }}
          transition={{ duration: 2.2, ease: [0.15, 0.85, 0.45, 1] }}
        />
      )}

      <motion.div
        animate={getAnimationProps()}
        transition={getTransitionProps()}
      >
        <CatSprite state={state} isMovingLeft={isMovingLeft} />
      </motion.div>

      {/* Refusal Bubble */}
      {refuseBubble && (
        <div className="pet-speech" style={{ width: "max-content", maxWidth: "200px", textAlign: "center" }}>
          <TypewriterText text="Nah not in the mood." speed={50} />
        </div>
      )}

      {/* Angry speech */}
      {state === "angry" && (
        <div className="pet-speech" style={{ width: "max-content", maxWidth: "200px", textAlign: "center" }}>
          <TypewriterText text="How dare you!!" speed={50} />
        </div>
      )}

      {/* Hover message sequence */}
      {hoverSequenceIdx !== -1 && hoverSequenceIdx < hoverMessages.length && !refuseBubble && state !== "playing" && state !== "angry" && (
        <div
          className="pet-speech"
          key={hoverSequenceIdx}
          style={{ width: "max-content", maxWidth: "200px", textAlign: "center" }}
        >
          <TypewriterText text={hoverMessages[hoverSequenceIdx]} speed={50} />
        </div>
      )}
    </div>
  );
}
