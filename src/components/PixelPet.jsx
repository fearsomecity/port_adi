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
        transition: "transform 0.3s ease",
      }}
    >
      {/* Cat body pixels */}
      {/* Main Orange Body */}
      <g fill="#FB923C">
        {/* Tail (depends on state for wagging) */}
        <rect x="1" y="8" width="1" height="3" />
        <rect x="2" y="7" width="1" height="2" />
        
        {/* Back/Torso */}
        <rect x="3" y="8" width="8" height="5" />
        <rect x="4" y="7" width="6" height="1" />
        
        {/* Head */}
        <rect x="10" y="5" width="5" height="5" />
        <rect x="10" y="4" width="1" height="1" /> {/* Left Ear */}
        <rect x="14" y="4" width="1" height="1" /> {/* Right Ear */}
      </g>

      {/* Darker Orange Shadow/Details */}
      <g fill="#EA580C">
        <rect x="3" y="11" width="7" height="2" />
        <rect x="10" y="9" width="1" height="1" />
      </g>

      {/* Cat Legs (Walk Animation keyframes handled by shifting these rects) */}
      <g fill="#E05A10" className={state === "walking" ? "cat-legs-walking" : ""}>
        <rect x="4" y="13" width="1" height="2" className="leg-1" />
        <rect x="6" y="13" width="1" height="2" className="leg-2" />
        <rect x="8" y="13" width="1" height="2" className="leg-3" />
        <rect x="10" y="13" width="1" height="2" className="leg-4" />
      </g>

      {/* Eyes */}
      {state === "sleeping" ? (
        // Closed Eyes
        <g fill="#9A3412">
          <rect x="11" y="7" width="1" height="1" />
          <rect x="13" y="7" width="1" height="1" />
        </g>
      ) : (
        // Open Eyes
        <g fill="#000000">
          <rect x="11" y="6" width="1" height="2" />
          <rect x="13" y="6" width="1" height="2" />
        </g>
      )}

      {/* Nose/Snout */}
      <rect x="12" y="8" width="1" height="1" fill="#F472B6" />

      {/* White Paws/Chest */}
      <g fill="#FFF">
        <rect x="10" y="8" width="1" height="1" />
        <rect x="4" y="14" width="1" height="1" className="paw-1" />
        <rect x="6" y="14" width="1" height="1" className="paw-2" />
        <rect x="8" y="14" width="1" height="1" className="paw-3" />
        <rect x="10" y="14" width="1" height="1" className="paw-4" />
      </g>
    </svg>
  );
}

export default function PixelPet() {
  const [state, setState] = useState("idle"); // idle, walking, sleeping, playing
  const [posX, setPosX] = useState(100); // offset from right (px)
  const [isMovingLeft, setIsMovingLeft] = useState(true);
  const [zs, setZs] = useState([]);
  const petRef = useRef(null);

  // States engine
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't interrupt playing state
      if (state === "playing") return;

      const rand = Math.random();
      if (rand < 0.4) {
        setState("idle");
      } else if (rand < 0.75) {
        setState("walking");
        // Pick new random direction/destination
        const direction = Math.random() > 0.5;
        setIsMovingLeft(direction);
      } else {
        setState("sleeping");
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [state]);

  // Walking logic
  useEffect(() => {
    if (state !== "walking") return;

    const walkInterval = setInterval(() => {
      setPosX((prev) => {
        const step = 2;
        const maxBoundary = window.innerWidth - 100;
        const minBoundary = 20;

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
    }, 40);

    return () => clearInterval(walkInterval);
  }, [state, isMovingLeft]);

  // Zzz sleeping particles logic
  useEffect(() => {
    if (state !== "sleeping") {
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
  }, [state]);

  const handlePetClick = () => {
    setState("playing");
    // Play happy jump/spin and then return to idle
    setTimeout(() => {
      setState("idle");
    }, 1200);
  };

  return (
    <div
      ref={petRef}
      className="pixel-pet-container"
      style={{ right: `${posX}px` }}
      onClick={handlePetClick}
      title="Click to play with me! 🐾"
    >
      {/* Floating Zzz letters when sleeping */}
      <AnimatePresence>
        {state === "sleeping" &&
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

      {/* Floating heart when clicked/playing */}
      {state === "playing" && (
        <motion.span
          className="pet-heart"
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -30, scale: 1.2 }}
          transition={{ duration: 1 }}
        >
          ❤️
        </motion.span>
      )}

      <motion.div
        animate={
          state === "playing"
            ? { y: [0, -30, 0], rotate: [0, 360, 360] }
            : state === "idle"
            ? { y: [0, -2, 0] }
            : {}
        }
        transition={
          state === "playing"
            ? { duration: 0.8, ease: "easeInOut" }
            : state === "idle"
            ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            : {}
        }
      >
        <CatSprite state={state} isMovingLeft={isMovingLeft} />
      </motion.div>

      {/* Speech Bubble */}
      {state === "idle" && Math.random() > 0.95 && (
        <div className="pet-speech">Meow!</div>
      )}
      {state === "sleeping" && Math.random() > 0.95 && (
        <div className="pet-speech">Purr...</div>
      )}
    </div>
  );
}
