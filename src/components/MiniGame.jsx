import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/MiniGame.css";

const GRID = 20;
const TICK = 135; // ms per step

const randInt = (max) => Math.floor(Math.random() * max);

const spawnFood = (snake) => {
  let pos;
  do {
    pos = { x: randInt(GRID), y: randInt(GRID) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
};

// Cross-browser rounded rect
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

export default function MiniGame() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  // All game state in a single ref to avoid stale closures
  const game = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    next: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    score: 0,
    running: false,
  });

  const [uiScore, setUiScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("as_snake_hs") || "0")
  );
  const [phase, setPhase] = useState("idle"); // idle | playing | dead
  const intervalRef = useRef(null);

  // ── Draw ──────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const SIZE = canvas.width;
    const CELL = SIZE / GRID;
    const { snake, food } = game.current;

    // Read CSS vars for theme-awareness
    const cs = getComputedStyle(document.documentElement);
    const bgColor      = cs.getPropertyValue("--bg-primary").trim()    || "#ffffff";
    const primaryColor = cs.getPropertyValue("--text-primary").trim()  || "#111111";
    const mutedColor   = cs.getPropertyValue("--border-light").trim()  || "#e4e4e4";

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Subtle dot grid
    ctx.fillStyle = mutedColor;
    for (let col = 0; col < GRID; col++) {
      for (let row = 0; row < GRID; row++) {
        ctx.beginPath();
        ctx.arc(col * CELL + CELL / 2, row * CELL + CELL / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Food — filled circle
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      CELL / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake segments
    snake.forEach((seg, i) => {
      const x = seg.x * CELL;
      const y = seg.y * CELL;
      const pad = 2;
      const r = i === 0 ? 5 : 3;

      ctx.fillStyle = primaryColor;
      roundRect(ctx, x + pad, y + pad, CELL - pad * 2, CELL - pad * 2, r);
      ctx.fill();

      // Head eye-like highlight
      if (i === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        roundRect(ctx, x + pad + 3, y + pad + 3, CELL * 0.35, CELL * 0.3, 2);
        ctx.fill();
      }
    });
  }, []);

  // ── Tick ─────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const g = game.current;
    if (!g.running) return;

    g.dir = g.next;
    const head = g.snake[0];
    const newHead = {
      x: (head.x + g.dir.x + GRID) % GRID,
      y: (head.y + g.dir.y + GRID) % GRID,
    };

    // Collision
    if (g.snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
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

    g.snake = [newHead, ...g.snake];

    if (newHead.x === g.food.x && newHead.y === g.food.y) {
      g.score += 1;
      setUiScore(g.score);
      g.food = spawnFood(g.snake);
    } else {
      g.snake.pop();
    }

    draw();
  }, [draw]);

  // ── Start / Restart ──────────────────────────────────────────
  const startGame = useCallback(() => {
    const g = game.current;
    g.snake = [{ x: 10, y: 10 }];
    g.dir  = { x: 1, y: 0 };
    g.next = { x: 1, y: 0 };
    g.food = spawnFood(g.snake);
    g.score = 0;
    g.running = true;
    setUiScore(0);
    setPhase("playing");
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, TICK);
    draw();
  }, [tick, draw]);

  // ── Direction helper ─────────────────────────────────────────
  const steer = useCallback((dx, dy) => {
    const g = game.current;
    if (!g.running) return;
    // Prevent 180° reversal
    if (dx === -g.dir.x && dy === -g.dir.y) return;
    g.next = { x: dx, y: dy };
  }, []);

  // ── Keyboard ─────────────────────────────────────────────────
  useEffect(() => {
    const map = {
      ArrowUp:    [0, -1], w: [0, -1],
      ArrowDown:  [0,  1], s: [0,  1],
      ArrowLeft:  [-1, 0], a: [-1, 0],
      ArrowRight: [1,  0], d: [1,  0],
    };
    const onKey = (e) => {
      if (!map[e.key]) return;
      // Only prevent scroll when game is active
      if (game.current.running) e.preventDefault();
      steer(...map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steer]);

  // ── Canvas resize + initial draw ─────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const wrap   = wrapRef.current;
      if (!canvas || !wrap) return;
      const size = Math.min(wrap.offsetWidth, 420);
      canvas.width  = size;
      canvas.height = size;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(intervalRef.current);
    };
  }, [draw]);

  return (
    <section className="mg-section" id="playground">
      <div className="container">
        {/* Header */}
        <motion.div
          className="mg-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">Easter Egg</div>
          <h2 className="section-title">Need a break?</h2>
          <p className="mg-subtitle">
            A minimal Snake game, styled for the portfolio.{" "}
            <span style={{ color: "var(--text-muted)" }}>Arrow keys · WASD · D-pad</span>
          </p>
        </motion.div>

        {/* Game card */}
        <motion.div
          className="mg-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {/* Score bar */}
          <div className="mg-scorebar">
            <span className="mg-score-item">
              Score <strong>{uiScore}</strong>
            </span>
            <span className="mg-score-sep">·</span>
            <span className="mg-score-item">
              Best <strong>{highScore}</strong>
            </span>
          </div>

          {/* Canvas */}
          <div className="mg-canvas-wrap" ref={wrapRef}>
            <canvas ref={canvasRef} className="mg-canvas" />

            {/* Overlay */}
            <AnimatePresence>
              {phase !== "playing" && (
                <motion.div
                  className="mg-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {phase === "idle" ? (
                    <>
                      <p className="mg-overlay-title">Snake</p>
                      <p className="mg-overlay-sub">Classic · Minimal · Clean</p>
                    </>
                  ) : (
                    <>
                      <p className="mg-overlay-title">Game Over</p>
                      <p className="mg-overlay-sub">Score: {uiScore}</p>
                    </>
                  )}
                  <button className="mg-start-btn" onClick={startGame}>
                    {phase === "idle" ? "Start" : "Play Again"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* D-pad (mobile) */}
          <div className="mg-dpad">
            <button className="mg-dpad-btn" onClick={() => steer(0, -1)}>▲</button>
            <div className="mg-dpad-row">
              <button className="mg-dpad-btn" onClick={() => steer(-1, 0)}>◀</button>
              <div className="mg-dpad-center" />
              <button className="mg-dpad-btn" onClick={() => steer(1, 0)}>▶</button>
            </div>
            <button className="mg-dpad-btn" onClick={() => steer(0, 1)}>▼</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
