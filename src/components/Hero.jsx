import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { TypeAnimation } from "react-type-animation";
import "../styles/Hero.css";

const CANVAS_PARTICLE_COUNT = 80;

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let mouse = { x: null, y: null };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const particles = Array.from({ length: CANVAS_PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 107, ${p.alpha})`;
        ctx.fill();

        // Connect to nearby particles
        particles.forEach((q) => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255, 107, 107, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });

        // Connect to mouse
        if (mouse.x !== null) {
          const mdist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (mdist < 180) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 107, 107, ${0.18 * (1 - mdist / 180)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// Letter-by-letter animation for heading
const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.06,
      type: "spring",
      stiffness: 200,
      damping: 18,
    },
  }),
};

function AnimatedText({ text, className }) {
  return (
    <span className={className} style={{ display: "block", perspective: "600px" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <ParticleCanvas />

      {/* Background blobs & grid */}
      <div className="hero-bg">
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <div className="hero-blob-3" />
      </div>
      <div className="hero-grid" />

      <div className="hero-content">
        {/* Left: Text */}
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Available for Internship
          </motion.div>

          <h1 className="hero-name">
            <AnimatedText text="Aditya" className="hero-name-first" />
            <AnimatedText text="Kumar" className="hero-name-last" />
          </h1>

          <div className="hero-typewriter">
            <TypeAnimation
              sequence={[
                "Full-Stack Developer",
                1800,
                "MERN Stack Engineer",
                1800,
                "Cloud & AWS Enthusiast",
                1800,
                "CS Student @ Chitkara",
                1800,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            CS student at Chitkara University with hands-on experience in{" "}
            <strong style={{ color: "var(--coral-light)" }}>
              full-stack development (MERN)
            </strong>{" "}
            and cloud deployment (AWS). Building products that matter.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link to="projects" smooth duration={700} offset={0}>
              <button className="btn-coral">View Projects →</button>
            </Link>
            <Link to="contact" smooth duration={700} offset={0}>
              <button className="btn-outline">Get In Touch</button>
            </Link>
          </motion.div>

          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <span className="hero-socials-label">Find me on</span>
            <a
              href="https://github.com/fearsomecity"
              target="_blank"
              rel="noreferrer"
              className="hero-social-link"
              title="GitHub"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-sharma097"
              target="_blank"
              rel="noreferrer"
              className="hero-social-link"
              title="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="mailto:sharma.adi1217@gmail.com"
              className="hero-social-link"
              title="Email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Floating Avatar Card */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.9, type: "spring", stiffness: 100 }}
        >
          {/* Spinning ring decoration */}
          <div className="hero-deco hero-deco-ring">
            <div className="hero-deco-ring-dot" />
          </div>

          <div className="hero-avatar-card">
            <div className="hero-avatar-image-container">
              <img src="/profile.jpg" alt="Aditya Sharma" className="hero-avatar-image" />
            </div>
            <div className="hero-avatar-name">Aditya Sharma</div>
            <div className="hero-avatar-role">Full-Stack Developer</div>
          </div>

          {/* Mini floating card */}
          <div className="hero-deco hero-deco-card2">
            <div>
              <div className="hero-deco-card2-text">MERN + AWS</div>
              <div className="hero-deco-card2-sub">Full-Stack Ready</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <Link to="about" smooth duration={700}>
        <div className="hero-scroll-indicator">
          <span className="scroll-label">Scroll</span>
          <div className="scroll-line">
            <div className="scroll-dot" />
          </div>
        </div>
      </Link>
    </section>
  );
}
