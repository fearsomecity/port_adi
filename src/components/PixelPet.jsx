import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/PixelPet.css";

// SVG Pixel Art Cat (16x16 grid)
// Rendered crisp using shape-rendering="crispEdges"
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
        filter: state === "angry" ? "drop-shadow(0px 0px 1px rgba(239, 68, 68, 0.8)) sepia(0.3) saturate(2.5) hue-rotate(-50deg)" : "none",
      }}
    >
      {/* Tuxedo Cat Black Body (Slightly rounder, less rigid block) */}
      <g fill="#222222">
        {/* Tail (curves upwards cute) */}
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

      {/* Shorter, Cuter Legs with Swing Hinges (All 4 Legs) */}
      <g className={state === "walking" || state === "chasing" ? "cat-legs-walking" : ""}>
        {/* Back-Right Leg (Background, darker shadow) */}
        <g className="leg-group-back-bg" style={{ transformOrigin: "5.5px 12px" }}>
          <rect x="5" y="12" width="1" height="2" fill="#0c0c0c" />
          <rect x="5" y="13" width="1" height="1" fill="#dddddd" />
        </g>

        {/* Back-Left Leg (Foreground) */}
        <g className="leg-group-back-fg" style={{ transformOrigin: "6.5px 12px" }}>
          <rect x="6" y="12" width="1" height="2" fill="#151515" />
          <rect x="6" y="13" width="1" height="1" fill="#FFFFFF" />
        </g>

        {/* Front-Right Leg (Background, darker shadow) */}
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

      {/* Big White Eyes with Black Pupils */}
      {state === "sleeping" ? (
        // Closed Eyes
        <g fill="#444444">
          <rect x="10" y="6" width="1" height="1" />
          <rect x="12" y="6" width="1" height="1" />
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

// Retro Typewriter text effect (safe from React double-mount interval racing)
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
  const [state, setState] = useState("idle"); // idle, walking, sleeping, playing, pouncing, chasing, held, angry, ball
  const [posX, setPosX] = useState(100); // offset from right (px)
  const [posY, setPosY] = useState(0); // height offset from bottom (px)
  const [isMovingLeft, setIsMovingLeft] = useState(true);
  const [zs, setZs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoverSequenceIdx, setHoverSequenceIdx] = useState(-1); // -1 means not hovered
  const petRef = useRef(null);

  const hoverMessages = [
    "Hi ,I am Tinker",
    "Nice to meet you !!",
    "If you click on me, I might do a backflip."
  ];

  // Hover sequence timer
  useEffect(() => {
    if (hoverSequenceIdx === -1) return;
    if (hoverSequenceIdx >= hoverMessages.length) return;

    const timer = setTimeout(() => {
      setHoverSequenceIdx((prev) => prev + 1);
    }, 2800); // Show each message for 2.8s

    return () => clearTimeout(timer);
  }, [hoverSequenceIdx]);

  // States engine
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't interrupt active play, held, dropping, angry, or hovered states
      if (
        state === "playing" ||
        state === "pouncing" ||
        state === "chasing" ||
        state === "held" ||
        state === "angry" ||
        state === "ball" ||
        isDropping ||
        hoverSequenceIdx !== -1
      ) {
        return;
      }

      const rand = Math.random();
      if (rand < 0.25) {
        setState("idle");
      } else if (rand < 0.5) {
        setState("walking");
        // Pick new random direction/destination
        const direction = Math.random() > 0.5;
        setIsMovingLeft(direction);
      } else if (rand < 0.75) {
        // Randomly play by herself!
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
  }, [state, isDropping, hoverSequenceIdx]);

  // Walking & chasing motion logic
  useEffect(() => {
    if (state !== "walking" && state !== "chasing") return;
    if (hoverSequenceIdx !== -1) return; // Freeze walking during conversation

    const intervalTime = state === "chasing" ? 30 : 40;
    const walkInterval = setInterval(() => {
      setPosX((prev) => {
        let step = state === "chasing" ? 3 : 2.2;
        const maxBoundary = window.innerWidth - 100;
        const minBoundary = 20;

        if (state === "chasing") {
          setIsMovingLeft((m) => !m);
          return prev + (Math.random() > 0.5 ? step : -step);
        }

        if (isMovingLeft) {
          if (prev >= maxBoundary) {
            setIsMovingLeft(false);
            return prev - step;
          }
          return prev + step;
        } else {
          if (prev <= minBoundary) {
            setIsMovingLeft(true);
            return prev + step;
          }
          return prev - step;
        }
      });
    }, intervalTime);

    return () => clearInterval(walkInterval);
  }, [state, isMovingLeft, hoverSequenceIdx]);

  // Zzz sleeping particles logic
  useEffect(() => {
    if (state !== "sleeping" || hoverSequenceIdx !== -1) {
      setZs([]);
      return;
    }

    const zInterval = setInterval(() => {
      setZs((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: Math.random() * 20 + 20,
          y: 0,
        },
      ].slice(-3)); // Keep max 3 Zs
    }, 1500);

    return () => clearInterval(zInterval);
  }, [state, hoverSequenceIdx]);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    if (isDropping) return; // Ignore input while dropping
    setIsDragging(true);
    setState("held");
    setHoverSequenceIdx(-1); // Cancel hover chat when picked up
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
    setDragOffset({
      x: posX,
      y: posY,
    });
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = dragStart.x - e.clientX;
      const deltaY = dragStart.y - e.clientY;

      const newPosX = Math.max(20, Math.min(window.innerWidth - 100, dragOffset.x + deltaX));
      const newPosY = Math.max(0, dragOffset.y + deltaY);

      setPosX(newPosX);
      setPosY(newPosY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      if (posY > 20) {
        // Cat fell from a height! Physics drop sequence:
        setIsDropping(true);
        let currentHeight = posY;
        let velocity = 0;
        const gravity = 1.4;
        const bounce = -0.35;

        const dropTimer = setInterval(() => {
          velocity += gravity;
          currentHeight -= velocity;

          if (currentHeight <= 0) {
            currentHeight = 0;
            if (Math.abs(velocity) < 2.5) {
              clearInterval(dropTimer);
              // Landed! Become angry!
              setState("angry");
              setIsDropping(false);
              setPosY(0);
              setTimeout(() => {
                setState("idle");
              }, 2500);
            } else {
              velocity = velocity * bounce; // Bounce slightly
            }
          }
          setPosY(currentHeight);
        }, 16);
      } else {
        // Simple place down
        setPosY(0);
        setState("idle");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, dragOffset, posX, posY]);

  const [refuseBubble, setRefuseBubble] = useState(false);

  const handlePetClick = (e) => {
    if (state === "held" || state === "angry" || state === "ball" || state === "playing" || refuseBubble) return;

    setHoverSequenceIdx(-1); // Cancel hover chat when interacting

    // 60% chance to backflip, 40% to refuse
    if (Math.random() < 0.6) {
      setState("playing");
      setTimeout(() => {
        setState("idle");
      }, 1200);
    } else {
      // Refusal sequence: shakes head
      setRefuseBubble(true);
      setTimeout(() => {
        setRefuseBubble(false);
      }, 2000);
    }
  };

  const handleMouseEnter = () => {
    if (state === "held" || state === "angry" || isDropping) return;
    setHoverSequenceIdx(0); // Start chat sequence
  };

  const handleMouseLeave = () => {
    setHoverSequenceIdx(-1); // Close chat sequence
  };

  // Determine appropriate Squash & Stretch / Jump animations based on active states
  const getAnimationProps = () => {
    if (refuseBubble) {
      // Shakes back and forth horizontally to indicate refusal
      return {
        x: [0, -4, 4, -4, 4, 0],
        scaleY: 0.95,
        scaleX: 1.05,
      };
    }

    switch (state) {
      case "held":
        // Dangles leg details and stretches down
        return {
          y: 0,
          scaleY: 1.25,
          scaleX: 0.85,
        };
      case "angry":
        // vibrates with grumpiness
        return {
          x: [0, -3, 3, -3, 3, 0],
          scaleY: [0.75, 0.75, 0.75, 0.75, 0.75],
          scaleX: [1.25, 1.25, 1.25, 1.25, 1.25],
        };
      case "playing":
        // Excited Backflip
        return {
          y: [0, -35, -45, -35, 0],
          rotate: [0, 180, 360, 360, 360],
          scaleY: [1, 0.7, 1.2, 1.2, 0.8, 1],
          scaleX: [1, 1.3, 0.8, 0.8, 1.2, 1],
        };
      case "pouncing":
        return {
          y: [0, 2, 0, -25, -28, 0, 3, 0],
          x: isMovingLeft ? [0, -2, -5, -20, -35, -45, -46, -45] : [0, 2, 5, 20, 35, 45, 46, 45],
          scaleY: [1, 0.6, 0.7, 1.4, 1.3, 0.7, 0.9, 1],
          scaleX: [1, 1.4, 1.3, 0.7, 0.8, 1.4, 1.1, 1],
        };
      case "chasing":
        return {
          y: [0, -4, 0, -4, 0],
          scaleY: [1, 0.85, 1.05, 0.85, 1],
          scaleX: [1, 1.1, 0.9, 1.1, 1],
        };
      case "ball":
        // Coordinated swat: crouches/winds up, swats forward, leaps/pounces to follow, squashes, recovers
        return {
          x: isMovingLeft ? [0, 8, -6, -35, -45, -45] : [0, -8, 6, 35, 45, 45],
          y: [0, 0, -2, -18, 0, 0],
          scaleY: [1, 0.7, 1.2, 1.2, 0.7, 1],
          scaleX: [1, 1.3, 0.8, 0.8, 1.3, 1],
        };
      case "walking":
        return {
          y: [0, -3, 0, -3, 0],
          scaleY: [1, 0.92, 1.03, 0.92, 1],
          scaleX: [1, 1.05, 0.95, 1.05, 1],
        };
      case "sleeping":
        return {
          scaleY: [1, 0.94, 1],
          scaleX: [1, 1.03, 1],
        };
      case "idle":
      default:
        // Bob softly if talking or breathing
        return hoverSequenceIdx !== -1
          ? { scaleY: [1, 0.97, 1], scaleX: [1, 1.03, 1] }
          : { scaleY: [1, 0.96, 1], scaleX: [1, 1.02, 1] };
    }
  };

  const getTransitionProps = () => {
    if (refuseBubble) {
      return { duration: 0.5 };
    }

    switch (state) {
      case "held":
        return { duration: 0.2 };
      case "angry":
        return { repeat: Infinity, duration: 0.15 };
      case "playing":
        return { duration: 1.2, ease: "easeInOut" };
      case "pouncing":
        return { duration: 1.8, ease: [0.25, 1, 0.5, 1] };
      case "chasing":
        return { repeat: Infinity, duration: 0.6, ease: "linear" };
      case "ball":
        return { duration: 2.2, ease: [0.25, 1, 0.5, 1] };
      case "walking":
        return { repeat: Infinity, duration: 0.8, ease: "easeInOut" };
      case "sleeping":
        return { repeat: Infinity, duration: 2.2, ease: "easeInOut" };
      case "idle":
      default:
        return { repeat: Infinity, duration: hoverSequenceIdx !== -1 ? 1.4 : 1.8, ease: "easeInOut" };
    }
  };

  return (
    <div
      ref={petRef}
      className={`pixel-pet-container ${isDragging ? "dragging" : ""} ${isDropping ? "dropping" : ""}`}
      style={{
        right: `${posX}px`,
        bottom: `calc(0.5rem + ${posY}px)`,
        cursor: isDragging ? "grabbing" : "grab"
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


      {/* Play Toy Ball Object */}
      {state === "ball" && (
        <motion.div
          className="pet-toy-ball"
          animate={{
            x: isMovingLeft ? [0, -10, -55, -50, -48, -48] : [0, 10, 55, 50, 48, 48],
            y: [0, -4, -14, -1, 0, 0],
            rotate: [0, 90, 720, 900, 950, 950]
          }}
          transition={{
            duration: 2.2,
            ease: [0.15, 0.85, 0.45, 1]
          }}
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
          <TypewriterText text="Nah not in the mood" speed={50} />
        </div>
      )}

      {/* Backflip Bubble */}
      {state === "playing" && (
        <div className="pet-speech" style={{ width: "max-content", maxWidth: "200px", textAlign: "center" }}>
          <TypewriterText text="I am a ninja" speed={60} />
        </div>
      )}

      {/* Hover message sequence */}
      {hoverSequenceIdx !== -1 && hoverSequenceIdx < hoverMessages.length && !refuseBubble && state !== "playing" && (
        <div
          className="pet-speech"
          key={hoverSequenceIdx} // Force re-render key for fade-in animations
          style={{ width: "max-content", maxWidth: "200px", textAlign: "center" }}
        >
          <TypewriterText text={hoverMessages[hoverSequenceIdx]} speed={50} />
        </div>
      )}
    </div>
  );
}
