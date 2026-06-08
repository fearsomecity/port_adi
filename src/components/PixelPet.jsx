import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/PixelPet.css";

/* ═══════════════════════════════════════════════════════════════════════════
   PIXEL ART FRAME DATA  (16×16 SVG user-unit grid, rendered 72×72)
   ═══════════════════════════════════════════════════════════════════════════

   Cat faces RIGHT.  scaleX(-1) flips for left-facing.
   Leg naming convention:
     flfg = front-left  foreground (white paw, x≈9 rest)
     flbg = front-right background (grey  paw, x≈8 rest)
     blfg = back-left   foreground (white paw, x≈6 rest)
     blbg = back-right  background (grey  paw, x≈5 rest)
   Each leg: { x, y, h }  → rect from (x,y) height h; paw pixel at (x, y+h)
   ═══════════════════════════════════════════════════════════════════════════ */

// ── 4-frame trot walk cycle ────────────────────────────────────────────────
//  A-stride: diagonal pair flfg+blbg swings (forward/raised)
//  B-stride: diagonal pair flbg+blfg swings
//  h:1 = short stubby legs; raised leg sits 1px higher (y=11 vs y=12)
const WALK_FRAMES = [
  /* 0 – A-stride contact */
  { bodyDY:  0, flfg:{x:10,y:11,h:1}, flbg:{x:8,y:12,h:1}, blfg:{x:6,y:12,h:1}, blbg:{x:4,y:11,h:1} },
  /* 1 – mid-stride, body rises */
  { bodyDY: -1, flfg:{x: 9,y:12,h:1}, flbg:{x:8,y:12,h:1}, blfg:{x:6,y:12,h:1}, blbg:{x:5,y:12,h:1} },
  /* 2 – B-stride contact */
  { bodyDY:  0, flfg:{x: 9,y:12,h:1}, flbg:{x:10,y:11,h:1}, blfg:{x:4,y:11,h:1}, blbg:{x:5,y:12,h:1} },
  /* 3 – mid-stride, body rises */
  { bodyDY: -1, flfg:{x: 9,y:12,h:1}, flbg:{x:8,y:12,h:1}, blfg:{x:6,y:12,h:1}, blbg:{x:5,y:12,h:1} },
];

// ── 4-frame gallop / chasing run (exaggerated reach) ──────────────────────
const RUN_FRAMES = [
  /* 0 – full extension A */
  { bodyDY: -2, flfg:{x:11,y:11,h:1}, flbg:{x:8,y:12,h:1}, blfg:{x:6,y:12,h:1}, blbg:{x:3,y:11,h:1} },
  /* 1 – gather */
  { bodyDY:  0, flfg:{x: 9,y:12,h:1}, flbg:{x:8,y:12,h:1}, blfg:{x:6,y:12,h:1}, blbg:{x:5,y:12,h:1} },
  /* 2 – full extension B */
  { bodyDY: -2, flfg:{x: 9,y:12,h:1}, flbg:{x:11,y:11,h:1}, blfg:{x:3,y:11,h:1}, blbg:{x:5,y:12,h:1} },
  /* 3 – gather */
  { bodyDY:  0, flfg:{x: 9,y:12,h:1}, flbg:{x:8,y:12,h:1}, blfg:{x:6,y:12,h:1}, blbg:{x:5,y:12,h:1} },
];

// ── static rest leg positions ──────────────────────────────────────────────
const IDLE_LEGS = { flfg:{x:9,y:12,h:1}, flbg:{x:8,y:12,h:1}, blfg:{x:6,y:12,h:1}, blbg:{x:5,y:12,h:1} };

// ── sleep belly-swell over 8 frames (1 = extra belly pixel) ───────────────
const SLEEP_SWELL = [0,0,0,1,1,1,1,0];

/* ═══════════════════════════════════════════════════════════════════════════
   CAT SPRITE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function CatSprite({ state, isMovingLeft, animFrame, isBlinking, earTwitch, landSquash, angryPhase }) {
  const bodyFill = "#222"; // body stays black; only eyes turn red when angry

  // ── pick leg frame ───────────────────────────────────────────────────────
  let legs = IDLE_LEGS;
  let bodyDY = 0;
  if (state === "walking") {
    const f = WALK_FRAMES[animFrame % 4];
    legs = f; bodyDY = f.bodyDY;
  } else if (state === "chasing") {
    const f = RUN_FRAMES[animFrame % 4];
    legs = f; bodyDY = f.bodyDY;
  }

  const BY = 8 + bodyDY;
  const L  = legs;
  const bellySwell = state === "sleeping" && SLEEP_SWELL[animFrame % 8] === 1;

  // landing squash: widen + shorten body
  const bX = landSquash ? 4  : 5;
  const bY = landSquash ? 9  : BY;
  const bW = landSquash ? 7  : 6;
  const bH = landSquash ? 3  : 4;

  // ── eye rendering ────────────────────────────────────────────────────────
  const Eyes = () => {
    if (state === "sleeping") return (
      <g fill="#555">
        <rect x="10" y="6" width="1" height="1" />
        <rect x="12" y="6" width="1" height="1" />
      </g>
    );
    if (state === "angry") return (
      <g>
        <rect x="9"  y="5" width="2" height="1" fill="#FF2222" />
        <rect x="9"  y="6" width="1" height="1" fill="#FF2222" />
        <rect x="12" y="5" width="2" height="1" fill="#FF2222" />
        <rect x="13" y="6" width="1" height="1" fill="#FF2222" />
      </g>
    );
    if (isBlinking === 2) return (           // fully closed
      <g fill="#333">
        <rect x="9"  y="6" width="2" height="1" />
        <rect x="12" y="6" width="2" height="1" />
      </g>
    );
    if (isBlinking === 1) return (           // half-lid
      <g>
        <rect x="9"  y="5" width="2" height="2" fill="#FFF" />
        <rect x="9"  y="6" width="2" height="1" fill="#333" />
        <rect x="12" y="5" width="2" height="2" fill="#FFF" />
        <rect x="12" y="6" width="2" height="1" fill="#333" />
      </g>
    );
    return (                                 // open
      <g>
        <rect x="9"  y="5" width="2" height="2" fill="#FFF" />
        <rect x="10" y="5" width="1" height="2" fill="#000" />
        <rect x="9"  y="5" width="1" height="1" fill="#FFF" />
        <rect x="12" y="5" width="2" height="2" fill="#FFF" />
        <rect x="12" y="5" width="1" height="2" fill="#000" />
        <rect x="13" y="5" width="1" height="1" fill="#FFF" />
      </g>
    );
  };

  return (
    <svg
      width="72" height="72"
      viewBox="0 0 16 16"
      style={{
        shapeRendering: "crispEdges",
        transform: isMovingLeft ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.3s ease",
      }}
    >
      {/* ── TAIL (CSS sway, angry thrash) ── */}
      <g className={`cat-tail-sway${state === "angry" ? " cat-tail-angry" : ""}`}>
        <rect x="2" y="7" width="1" height="2" fill={bodyFill} />
        <rect x="3" y="6" width="1" height="2" fill={bodyFill} />
        <rect x="4" y="5" width="1" height="2" fill={bodyFill} />
        <rect x="4" y="5" width="1" height="1" fill="#FFF" />  {/* white tip */}
      </g>

      {/* ── BODY ── */}
      <rect x={bX} y={bY} width={bW} height={bH} fill={bodyFill} />
      {/* upper-body connector (follows body Y) */}
      {!landSquash && <rect x="6" y={bY - 1} width="4" height="1" fill={state === "angry" ? "#3a0000" : "#222"} />}
      {/* sleep belly swell */}
      {bellySwell    && <rect x="5" y={bY + bH} width="6" height="1" fill="#222" />}
      {/* bottom shadow stripe */}
      <rect x="5" y={bY + bH - 1} width="5" height="1" fill="#000" />

      {/* ── LEGS — back pair first (depth order) ── */}
      {/* back-right (bg) grey paw */}
      <rect x={L.blbg.x} y={L.blbg.y} width="1" height={L.blbg.h} fill="#111" />
      <rect x={L.blbg.x} y={L.blbg.y + L.blbg.h} width="1" height="1" fill="#ccc" />
      {/* back-left (fg) white paw */}
      <rect x={L.blfg.x} y={L.blfg.y} width="1" height={L.blfg.h} fill="#1a1a1a" />
      <rect x={L.blfg.x} y={L.blfg.y + L.blfg.h} width="1" height="1" fill="#FFF" />
      {/* front-right (bg) grey paw */}
      <rect x={L.flbg.x} y={L.flbg.y} width="1" height={L.flbg.h} fill="#111" />
      <rect x={L.flbg.x} y={L.flbg.y + L.flbg.h} width="1" height="1" fill="#ccc" />
      {/* front-left (fg) white paw */}
      <rect x={L.flfg.x} y={L.flfg.y} width="1" height={L.flfg.h} fill="#1a1a1a" />
      <rect x={L.flfg.x} y={L.flfg.y + L.flfg.h} width="1" height="1" fill="#FFF" />

      {/* ── HEAD ── */}
      <rect x="9" y="4" width="5" height="5" fill={bodyFill} />

      {/* ── EARS (ear tip above head; twitched ear disappears = flattened) ── */}
      <g fill="#222">
        {earTwitch !== "left"  && <rect x="9"  y="3" width="1" height="1" />}
        {earTwitch !== "right" && <rect x="13" y="3" width="1" height="1" />}
      </g>
      {/* Pink inner ear (visible when not angry/sleeping) */}
      {state !== "angry" && state !== "sleeping" && (
        <g fill="#F4A0C0">
          {earTwitch !== "left"  && <rect x="9"  y="4" width="1" height="1" />}
          {earTwitch !== "right" && <rect x="13" y="4" width="1" height="1" />}
        </g>
      )}

      {/* ── EYES ── */}
      <Eyes />

      {/* ── NOSE ── */}
      <rect x="11" y="7" width="1" height="1" fill="#F472B6" />

      {/* ── ANGRY MOUTH ── */}
      {state === "angry" && (
        <g fill="#CC1111">
          <rect x="10" y="8" width="1" height="1" />
          <rect x="12" y="8" width="1" height="1" />
          <rect x="11" y="9" width="2" height="1" />
        </g>
      )}

      {/* ── WHITE CHEST + MUZZLE ── */}
      <g fill="#FFF">
        <rect x="9"  y="8" width="1" height="2" />  {/* chest stripe */}
        <rect x="10" y="7" width="3" height="2" />  {/* muzzle */}
        <rect x="11" y="6" width="1" height="1" />  {/* muzzle bridge */}
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPEWRITER TEXT
   ═══════════════════════════════════════════════════════════════════════════ */

function TypewriterText({ text, speed = 50 }) {
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
   MAIN PIXEL PET COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function PixelPet() {
  // ── core state ─────────────────────────────────────────────────────────────
  const [state, setState]               = useState("idle");
  const [posX,  setPosX]               = useState(100);   // offset from right
  const [posY,  setPosY]               = useState(0);     // height from bottom
  const [isMovingLeft, setIsMovingLeft] = useState(true);
  const [zs,    setZs]                 = useState([]);
  const [isDragging, setIsDragging]    = useState(false);
  const [isDropping, setIsDropping]    = useState(false);
  const [isThrown,   setIsThrown]      = useState(false);
  const [hoverSeqIdx, setHoverSeqIdx]  = useState(-1);
  const [refuseBubble, setRefuseBubble]= useState(false);

  // ── pixel animation state ──────────────────────────────────────────────────
  const [animFrame,   setAnimFrame]   = useState(0);
  const [isBlinking,  setIsBlinking]  = useState(0);    // 0=open, 1=half, 2=closed
  const [earTwitch,   setEarTwitch]   = useState(null); // null | 'left' | 'right'
  const [landSquash,  setLandSquash]  = useState(false);
  const [angryPhase,  setAngryPhase]  = useState(null); // null | 'intro' | 'loop'
  const [angryParticles, setAngryParticles] = useState([]);

  // ── refs ───────────────────────────────────────────────────────────────────
  const petRef         = useRef(null);
  const posRef         = useRef({ x: posX, y: posY });
  const isDraggingRef  = useRef(false);
  const dragStartRef   = useRef({ x: 0, y: 0 });
  const dragOffsetRef  = useRef({ x: 0, y: 0 });
  const velocityRef    = useRef({ x: 0, y: 0 });
  const lastPosRef     = useRef({ x: 0, y: 0 });
  const lastTimeRef    = useRef(0);
  const blinkTimerRef  = useRef(null);
  const earTimerRef    = useRef(null);
  const angrySpawnRef  = useRef(null);

  useEffect(() => { posRef.current = { x: posX, y: posY }; }, [posX, posY]);

  // ── ANGRY PARTICLE SPAWNER ─────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "angry") { setAngryParticles([]); clearInterval(angrySpawnRef.current); return; }
    angrySpawnRef.current = setInterval(() => {
      setAngryParticles(prev => [
        ...prev,
        {
          id: Math.random(),
          x:  20 + Math.random() * 30,
          vx: (Math.random() - 0.5) * 40,
          vy: 20 + Math.random() * 30,
        },
      ].slice(-8));
    }, 200);
    return () => clearInterval(angrySpawnRef.current);
  }, [state]);

  const hoverMessages = [
    "Hi, I am Tinker",
    "Nice to meet you!!",
    "Click me — I might backflip!",
  ];

  // ── hover sequence timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (hoverSeqIdx < 0 || hoverSeqIdx >= hoverMessages.length) return;
    const t = setTimeout(() => setHoverSeqIdx(i => i + 1), 2800);
    return () => clearTimeout(t);
  }, [hoverSeqIdx]);

  // ── ANIMATION FRAME TICKER ─────────────────────────────────────────────────
  useEffect(() => {
    const fps =
      state === "walking"  ? 8  :
      state === "chasing"  ? 14 :
      state === "sleeping" ? 2  : 4;
    const ticker = setInterval(() => setAnimFrame(f => f + 1), 1000 / fps);
    return () => clearInterval(ticker);
  }, [state]);

  // ── RANDOM BLINK ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (state === "sleeping" || state === "held") { setIsBlinking(0); return; }

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 4000;
      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(1);
        setTimeout(() => setIsBlinking(2), 80);
        setTimeout(() => setIsBlinking(1), 160);
        setTimeout(() => { setIsBlinking(0); scheduleBlink(); }, 240);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimerRef.current);
  }, [state]);

  // ── RANDOM EAR TWITCH ─────────────────────────────────────────────────────
  useEffect(() => {
    if (state === "sleeping" || state === "held" || state === "angry") {
      setEarTwitch(null); return;
    }

    const scheduleEar = () => {
      const delay = 4000 + Math.random() * 5000;
      earTimerRef.current = setTimeout(() => {
        const which = Math.random() > 0.5 ? "left" : "right";
        setEarTwitch(which);
        setTimeout(() => {
          setEarTwitch(null);
          scheduleEar();
        }, 180 + Math.random() * 220);
      }, delay);
    };

    scheduleEar();
    return () => clearTimeout(earTimerRef.current);
  }, [state]);

  // ── STATE ENGINE (idle / walk / sleep / self-play) ─────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (["playing","pouncing","chasing","held","angry"].includes(state)
          || isDropping || isThrown || hoverSeqIdx !== -1) return;

      const r = Math.random();
      if      (r < 0.25) setState("idle");
      else if (r < 0.5)  { setState("walking"); setIsMovingLeft(Math.random() > 0.5); }
      else if (r < 0.75) {
        const plays = ["pouncing","chasing"];
        const p = plays[Math.floor(Math.random() * plays.length)];
        setState(p);
        setTimeout(() => setState("idle"),
          p === "pouncing" ? 1800 : p === "ball" ? 3000 : 2000);
      } else setState("sleeping");
    }, 5000);
    return () => clearInterval(interval);
  }, [state, isDropping, isThrown, hoverSeqIdx]);

  // ── WALKING POSITION TICKER ────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "walking" && state !== "chasing") return;
    if (hoverSeqIdx !== -1) return;

    const ms   = state === "chasing" ? 30 : 40;
    const step = state === "chasing" ? 3  : 2.2;
    const walk = setInterval(() => {
      setPosX(prev => {
        const max = window.innerWidth - 100, min = 20;
        if (state === "chasing") {
          setIsMovingLeft(m => !m);
          return Math.max(min, Math.min(max, prev + (Math.random() > 0.5 ? step : -step)));
        }
        if (isMovingLeft) {
          if (prev >= max) { setIsMovingLeft(false); return prev - step; }
          return prev + step;
        } else {
          if (prev <= min) { setIsMovingLeft(true);  return prev + step; }
          return prev - step;
        }
      });
    }, ms);
    return () => clearInterval(walk);
  }, [state, isMovingLeft, hoverSeqIdx]);

  // ── ZZZ PARTICLES ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "sleeping" || hoverSeqIdx !== -1) { setZs([]); return; }
    const t = setInterval(() => {
      setZs(p => [...p, { id: Math.random(), x: Math.random() * 20 + 20 }].slice(-3));
    }, 1500);
    return () => clearInterval(t);
  }, [state, hoverSeqIdx]);

  // ── PHYSICS DROP / THROW ───────────────────────────────────────────────────
  const launchPhysics = useCallback((startH, velX, velY) => {
    setIsDropping(true); setIsThrown(true);
    let h = startH, x = posRef.current.x;
    let vX = velX, vY = velY;
    const g = 1.5, bounce = -0.38, friction = 0.84;

    const timer = setInterval(() => {
      vY -= g;
      h  += vY;
      x  += vX;

      const maxX = window.innerWidth - 70, minX = 20;
      if (x > maxX) { x = maxX; vX *= -0.5; }
      if (x < minX) { x = minX; vX *= -0.5; }

      if (h <= 0) {
        h  = 0;
        vX *= friction;
        if (Math.abs(vY) < 2.5) {
          clearInterval(timer);
          setPosX(x); setPosY(0);
          setIsDropping(false); setIsThrown(false);
          // Landing squash + angry sequence
          setLandSquash(true);
          setTimeout(() => setLandSquash(false), 300);
          setAngryPhase("intro");
          setState("angry");
          // Spawn burst of sparks on impact
          setAngryParticles(Array.from({ length: 8 }, (_, i) => ({
            id: Math.random() + i,
            x: 10 + Math.random() * 50,
            vx: (Math.random() - 0.5) * 60,
            vy: 30 + Math.random() * 40,
          })));
          setTimeout(() => setAngryPhase("loop"), 450);
          setTimeout(() => { setState("idle"); setAngryPhase(null); }, 1500);
          return;
        }
        vY *= bounce;
      }
      setPosX(x); setPosY(h);
    }, 16);
  }, []);

  // ── DRAG SHARED LOGIC ─────────────────────────────────────────────────────
  const startDrag = useCallback((cx, cy) => {
    if (isDropping || isThrown) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    setState("held");
    setHoverSeqIdx(-1);
    dragStartRef.current  = { x: cx, y: cy };
    dragOffsetRef.current = { x: posRef.current.x, y: posRef.current.y };
    lastPosRef.current    = { x: cx, y: cy };
    lastTimeRef.current   = performance.now();
    velocityRef.current   = { x: 0, y: 0 };
  }, [isDropping, isThrown]);

  const moveDrag = useCallback((cx, cy) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt  = Math.max(1, now - lastTimeRef.current);
    const rvX = (cx - lastPosRef.current.x) / dt * 16;
    const rvY = (cy - lastPosRef.current.y) / dt * 16;
    velocityRef.current = {
      x: velocityRef.current.x * 0.6 + rvX * 0.4,
      y: velocityRef.current.y * 0.6 + rvY * 0.4,
    };
    lastPosRef.current = { x: cx, y: cy };
    lastTimeRef.current = now;

    const dX = dragStartRef.current.x - cx;
    const dY = dragStartRef.current.y - cy;
    setPosX(Math.max(20, Math.min(window.innerWidth - 100, dragOffsetRef.current.x + dX)));
    setPosY(Math.max(0, dragOffsetRef.current.y + dY));
  }, []);

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const h   = posRef.current.y;
    const vel = velocityRef.current;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

    if (h > 20 || speed > 3) {
      launchPhysics(h, -vel.x, -vel.y * 0.8);
    } else {
      setPosY(0); setState("idle");
    }
  }, [launchPhysics]);

  // ── MOUSE EVENTS ──────────────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => moveDrag(e.clientX, e.clientY);
    const onUp   = ()  => endDrag();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [isDragging, moveDrag, endDrag]);

  // ── TOUCH EVENTS ──────────────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };

  useEffect(() => {
    const el = petRef.current;
    if (!el) return;
    const onMove = (e) => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); };
    const onEnd  = (e) => { e.preventDefault(); endDrag(); };
    el.addEventListener("touchstart",  handleTouchStart, { passive: false });
    el.addEventListener("touchmove",   onMove,           { passive: false });
    el.addEventListener("touchend",    onEnd,            { passive: false });
    el.addEventListener("touchcancel", onEnd,            { passive: false });
    return () => {
      el.removeEventListener("touchstart",  handleTouchStart);
      el.removeEventListener("touchmove",   onMove);
      el.removeEventListener("touchend",    onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [moveDrag, endDrag]);

  // ── CLICK / HOVER ─────────────────────────────────────────────────────────
  const handlePetClick = (e) => {
    if (["held","angry","ball","playing"].includes(state) || refuseBubble || isDropping || isThrown) return;
    setHoverSeqIdx(-1);
    if (Math.random() < 0.6) {
      setState("playing");
      setTimeout(() => setState("idle"), 1200);
    } else {
      setRefuseBubble(true);
      setTimeout(() => setRefuseBubble(false), 2000);
    }
  };

  const handleMouseEnter = () => {
    if (["held","angry"].includes(state) || isDropping || isThrown) return;
    setHoverSeqIdx(0);
  };

  const handleMouseLeave = () => setHoverSeqIdx(-1);

  // ── FRAMER MOTION ANIMATION PROPS ─────────────────────────────────────────
  const getAnimProps = () => {
    if (refuseBubble) return { x:[0,-4,4,-4,4,0], scaleY:0.95, scaleX:1.05 };
    switch (state) {
      case "held":      return { y:0, scaleY:1.25, scaleX:0.85 };
      case "angry":
        if (angryPhase === "intro") return {
          // Dramatic stomp entry: squash → explode up → slam down → inflate in rage
          y:      [0, -28, -10, 6, 0],
          scaleX: [1.3, 0.75, 1.1, 0.85, 1.25],
          scaleY: [0.6, 1.45, 0.85, 1.15, 0.82],
          rotate: [0, -8, 6, -4, 0],
        };
        // looping rage vibration
        return {
          x:      [0, -5, 5, -4, 4, -3, 3, 0],
          scaleX: [1.25, 1.28, 1.22, 1.28, 1.22, 1.26, 1.23, 1.25],
          scaleY: [0.80, 0.77, 0.83, 0.77, 0.83, 0.79, 0.81, 0.80],
        };
      case "playing":   return { y:[0,-35,-45,-35,0], rotate:[0,180,360,360,360], scaleY:[1,.7,1.2,1.2,.8,1], scaleX:[1,1.3,.8,.8,1.2,1] };
      case "pouncing":  return { y:[0,2,0,-25,-28,0,3,0], x:isMovingLeft?[0,-2,-5,-20,-35,-45,-46,-45]:[0,2,5,20,35,45,46,45], scaleY:[1,.6,.7,1.4,1.3,.7,.9,1], scaleX:[1,1.4,1.3,.7,.8,1.4,1.1,1] };
      case "chasing":   return { y:[0,-3,0,-3,0], scaleY:[1,.9,1.05,.9,1], scaleX:[1,1.08,.95,1.08,1] };
      case "walking":   return { y:[0,-1,0,-1,0], scaleY:[1,1.01,1,1.01,1] };
      case "sleeping":  return { scaleY:[1,.94,1], scaleX:[1,1.03,1] };
      default:
        return hoverSeqIdx !== -1
          ? { scaleY:[1,.97,1], scaleX:[1,1.03,1] }
          : { scaleY:[1,.96,1], scaleX:[1,1.02,1] };
    }
  };

  const getTransProps = () => {
    if (refuseBubble) return { duration:0.5 };
    switch (state) {
      case "held":      return { duration:0.2 };
      case "angry":
        if (angryPhase === "intro") return { duration: 0.65, ease: [0.2, 1.4, 0.4, 1] };
        return { repeat: Infinity, duration: 0.18, ease: "easeInOut" };
      case "playing":   return { duration:1.2, ease:"easeInOut" };
      case "pouncing":  return { duration:1.8, ease:[.25,1,.5,1] };
      case "chasing":   return { repeat:Infinity, duration:0.5, ease:"linear" };
      case "walking":   return { repeat:Infinity, duration:0.7, ease:"easeInOut" };
      case "sleeping":  return { repeat:Infinity, duration:2.4, ease:"easeInOut" };
      default:
        return { repeat:Infinity, duration:hoverSeqIdx !== -1 ? 1.4 : 1.8, ease:"easeInOut" };
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={petRef}
      className={`pixel-pet-container ${isDragging ? "dragging" : ""} ${isDropping || isThrown ? "dropping" : ""} ${state === "angry" ? "pet-angry" : ""}`}
      style={{
        right:  `${posX}px`,
        bottom: `calc(0.5rem + ${posY}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      onClick={handlePetClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Zzz */}
      <AnimatePresence>
        {state === "sleeping" && hoverSeqIdx === -1 &&
          zs.map((z, i) => (
            <motion.span key={z.id} className="pet-z" style={{ left: `${z.x}px` }}
              initial={{ opacity:0, y:0, scale:0.5 }}
              animate={{ opacity:0.8, y:-40, scale:1 + i * 0.15 }}
              exit={{ opacity:0 }}
              transition={{ duration:2, ease:"easeOut" }}
            >z</motion.span>
          ))}
      </AnimatePresence>

      {/* Throw trail */}
      {isThrown && <div className="pet-throw-trail" />}

      {/* Angry spark particles */}
      <AnimatePresence>
        {state === "angry" && angryParticles.map(p => (
          <motion.div
            key={p.id}
            className="pet-spark"
            style={{ left: `${p.x}px`, bottom: "56px" }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.vx, y: -p.vy, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Cat sprite */}
      <motion.div
        animate={getAnimProps()}
        transition={getTransProps()}
      >
        <CatSprite
          state={state}
          isMovingLeft={isMovingLeft}
          animFrame={animFrame}
          isBlinking={isBlinking}
          earTwitch={earTwitch}
          landSquash={landSquash}
          angryPhase={angryPhase}
        />
      </motion.div>

      {/* Refusal bubble */}
      {refuseBubble && (
        <div className="pet-speech" style={{ width:"max-content", maxWidth:"200px", textAlign:"center" }}>
          <TypewriterText text="Nah not in the mood." speed={50} />
        </div>
      )}

      {/* Angry speech */}
      {state === "angry" && (
        <div className="pet-speech" style={{ width:"max-content", maxWidth:"200px", textAlign:"center" }}>
          <TypewriterText text="How dare you!!" speed={50} />
        </div>
      )}

      {/* Hover chat */}
      {hoverSeqIdx >= 0 && hoverSeqIdx < hoverMessages.length && !refuseBubble && state !== "playing" && state !== "angry" && (
        <div className="pet-speech" key={hoverSeqIdx} style={{ width:"max-content", maxWidth:"200px", textAlign:"center" }}>
          <TypewriterText text={hoverMessages[hoverSeqIdx]} speed={50} />
        </div>
      )}
    </div>
  );
}
