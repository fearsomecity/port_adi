import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { TypeAnimation } from "react-type-animation";
import { Globe as GithubIcon, Link as LinkedinIcon, Mail } from "lucide-react";
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
        ctx.fillStyle = `rgba(34, 34, 34, ${p.alpha * 0.3})`;
        ctx.fill();

        // Connect to nearby particles
        particles.forEach((q) => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(34, 34, 34, ${0.06 * (1 - dist / 120)})`;
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
            ctx.strokeStyle = `rgba(34, 34, 34, ${0.12 * (1 - mdist / 180)})`;
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
            <span className="status-dot"></span>
            Available for Internship
          </motion.div>

          <h1 className="hero-name">
            <AnimatedText text="Aditya" className="hero-name-first" />
            <AnimatedText text="Sharma" className="hero-name-last" />
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
            <span className="high-red">
              full-stack development (MERN)
            </span>{" "}
            and <span className="high-blue">cloud deployment (AWS)</span>. Building products that matter.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
          <Link to="projects" smooth duration={700} offset={0}>
            <button className="btn-primary">View Projects →</button>
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
            style={{ "--social-color": "var(--clr-purple)" }}
          >
            <GithubIcon size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/in/aditya-sharma097"
            target="_blank"
            rel="noreferrer"
            className="hero-social-link"
            title="LinkedIn"
            style={{ "--social-color": "var(--clr-blue)" }}
          >
            <LinkedinIcon size={18} strokeWidth={1.5} />
          </a>
          <a
            href="mailto:sharma.adi1217@gmail.com"
            className="hero-social-link"
            title="Email"
            style={{ "--social-color": "var(--clr-red)" }}
          >
            <Mail size={18} strokeWidth={1.5} />
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
            <img 
              src="/profile.jpg" 
              alt="Aditya Sharma - Full-Stack Developer Portfolio Profile" 
              className="hero-avatar-image" 
            />
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
