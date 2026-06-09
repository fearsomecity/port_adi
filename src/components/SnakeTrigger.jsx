import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/SnakeTrigger.css";

/* ─── Game constants ───────────────────────────────────────── */
const GRID = 18;
const TICK = 130;
const randInt = (n) => Math.floor(Math.random() * n);
const spawnFood = (snake) => {
  let p;
  do { p = { x: randInt(GRID), y: randInt(GRID) }; }
  while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
};
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

/* ─── Surprise SVG icon (the hanging trigger) ─────────────────── */
function SurpriseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

/* ─── Main component ───────────────────────────────────────── */
export default function SnakeTrigger() {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Hanging trigger ── */}
      <div className="snake-hanger" title="Surprise! 🎁">
        {/* String */}
        <div className="snake-string" />
        {/* Icon */}
        <button
          className="snake-icon-btn"
          onClick={() => setOpen(true)}
          aria-label="Open surprise game easter egg"
        >
          <SurpriseIcon />
        </button>
      </div>

      {/* ── Modal (portal-rendered to escape CSS transforms) ── */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                className="snake-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
              />
              {/* Dialog Container */}
              <div className="snake-modal-container">
                <motion.div
                  className="snake-modal"
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SnakeGame onClose={() => setOpen(false)} />
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

/* ─── Snake game (self-contained) ──────────────────────────── */
function SnakeGame({ onClose }) {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const game = useRef({
    snake: [{ x: 9, y: 9 }],
    dir:   { x: 1, y: 0 },
    next:  { x: 1, y: 0 },
    food:  { x: 4, y: 4 },
    score: 0,
    running: false,
  });
  const intervalRef = useRef(null);
  const [score,    setScore]    = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("as_snake_hs") || "0")
  );
  const [phase, setPhase] = useState("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext("2d");
    const SIZE = canvas.width;
    const CELL = SIZE / GRID;
    const { snake, food } = game.current;
    const cs = getComputedStyle(document.documentElement);
    const bg      = cs.getPropertyValue("--bg-primary").trim()   || "#fff";
    const primary = cs.getPropertyValue("--text-primary").trim() || "#111";
    const border  = cs.getPropertyValue("--border-light").trim() || "#e4e4e4";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Dot grid
    ctx.fillStyle = border;
    for (let c = 0; c < GRID; c++)
      for (let r = 0; r < GRID; r++) {
        ctx.beginPath();
        ctx.arc(c * CELL + CELL / 2, r * CELL + CELL / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }

    // Food
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 3, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const pad = 2, r = i === 0 ? 5 : 3;
      ctx.fillStyle = primary;
      roundRect(ctx, seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, r);
      ctx.fill();
      if (i === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        roundRect(ctx, seg.x * CELL + pad + 3, seg.y * CELL + pad + 3, CELL * 0.35, CELL * 0.28, 2);
        ctx.fill();
      }
    });
  }, []);

  const tick = useCallback(() => {
    const g = game.current;
    if (!g.running) return;
    g.dir = g.next;
    const h = g.snake[0];
    const nh = { x: (h.x + g.dir.x + GRID) % GRID, y: (h.y + g.dir.y + GRID) % GRID };
    if (g.snake.some((s) => s.x === nh.x && s.y === nh.y)) {
      g.running = false;
      clearInterval(intervalRef.current);
      setPhase("dead");
      setHighScore((prev) => {
        const next = Math.max(prev, g.score);
        localStorage.setItem("as_snake_hs", next);
        return next;
      });
      draw();
      return;
    }
    g.snake = [nh, ...g.snake];
    if (nh.x === g.food.x && nh.y === g.food.y) {
      g.score += 1;
      setScore(g.score);
      g.food = spawnFood(g.snake);
    } else { g.snake.pop(); }
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    const g = game.current;
    g.snake = [{ x: 9, y: 9 }];
    g.dir   = { x: 1, y: 0 };
    g.next  = { x: 1, y: 0 };
    g.food  = spawnFood(g.snake);
    g.score = 0;
    g.running = true;
    setScore(0);
    setPhase("playing");
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, TICK);
    draw();
  }, [tick, draw]);

  const steer = useCallback((dx, dy) => {
    const g = game.current;
    if (!g.running) return;
    if (dx === -g.dir.x && dy === -g.dir.y) return;
    g.next = { x: dx, y: dy };
  }, []);

  // Keyboard
  useEffect(() => {
    const map = {
      ArrowUp: [0,-1], w:[0,-1], ArrowDown:[0,1], s:[0,1],
      ArrowLeft:[-1,0], a:[-1,0], ArrowRight:[1,0], d:[1,0],
    };
    const onKey = (e) => {
      if (!map[e.key]) return;
      e.preventDefault();
      steer(...map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steer]);

  // Touch Swipe controls for Mobile
  const touchStartRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e) => {
      if (e.cancelable) e.preventDefault();
      
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const threshold = 30; // Swipe threshold in pixels

      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) steer(1, 0); // Right
          else steer(-1, 0);       // Left
        } else {
          if (dy > 0) steer(0, 1); // Down
          else steer(0, -1);       // Up
        }
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    wrap.addEventListener("touchstart", handleTouchStart, { passive: true });
    wrap.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      wrap.removeEventListener("touchstart", handleTouchStart);
      wrap.removeEventListener("touchmove", handleTouchMove);
    };
  }, [steer]);

  // Canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    const size = Math.min(wrap.offsetWidth, 440);
    canvas.width  = size;
    canvas.height = size;
    draw();
    return () => clearInterval(intervalRef.current);
  }, [draw]);

  return (
    <div className="sg-wrap">
      {/* Left Column: Game Canvas */}
      <div className="sg-canvas-column">
        <div className="sg-canvas-wrap" ref={wrapRef}>
          <canvas ref={canvasRef} className="sg-canvas" />
          <AnimatePresence>
            {phase !== "playing" && (
              <motion.div className="sg-overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="sg-overlay-title">
                  {phase === "idle" ? "Snake" : "Game Over"}
                </p>
                {phase === "dead" && <p className="sg-overlay-sub">Score: {score}</p>}
                <button className="sg-btn" onClick={startGame}>
                  {phase === "idle" ? "Start" : "Retry"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Controls & Scoreboard */}
      <div className="sg-control-column">
        <div className="sg-header">
          <div className="sg-title-row">
            <span className="sg-title">🐍 Snake</span>
            <button className="sg-close" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="sg-scores">
            <span>Score <strong>{score}</strong></span>
            <span className="sg-sep">·</span>
            <span>Best <strong>{highScore}</strong></span>
          </div>
        </div>

        {/* D-pad */}
        <div className="sg-dpad">
          <button className="sg-dpad-btn" onClick={() => steer(0, -1)}>▲</button>
          <div className="sg-dpad-row">
            <button className="sg-dpad-btn" onClick={() => steer(-1, 0)}>◀</button>
            <div className="sg-dpad-mid" />
            <button className="sg-dpad-btn" onClick={() => steer(1, 0)}>▶</button>
          </div>
          <button className="sg-dpad-btn" onClick={() => steer(0, 1)}>▼</button>
        </div>

        <p className="sg-hint">Arrow keys · Swipe canvas · Esc to close</p>
      </div>
    </div>
  );
}
