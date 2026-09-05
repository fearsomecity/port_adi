import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { Sun, Moon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { motion, useScroll, useSpring } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import SnakeTrigger from "./SnakeTrigger";
import { leetcodeStats } from "../data/portfolioData";
import "../styles/Navbar.css";

const navLinks = [
  { label: "About", to: "about" },
  { label: "Skills", to: "skills" },
  { label: "Projects", to: "projects" },
  { label: "Contact", to: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [pteroActive, setPteroActive] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div
        className="scroll-progress-bar"
        style={{
          scaleX,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "var(--text-primary)",
          transformOrigin: "0%",
          zIndex: 999999
        }}
      />
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="hero" smooth duration={600} className="navbar-logo" onClick={() => setMenuOpen(false)}>
              <div className="logo-icon"></div>
              AS.
            </Link>
            <button
              className={`ptero-nav-btn ${pteroActive ? "active" : ""}`}
              onClick={() => {
                const next = !pteroActive;
                setPteroActive(next);
                window.dispatchEvent(new CustomEvent("toggle-ptero", { detail: { active: next } }));
              }}
              title={pteroActive ? "Recall Redbird to Navbar" : "Summon Flying Redbird from Navbar"}
              aria-label="Toggle Flying Redbird"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" style={{ shapeRendering: "crispEdges" }}>
                <rect x="2" y="8" width="3" height="2" fill="currentColor" opacity="0.6" />
                <rect x="4" y="5" width="8" height="7" fill="currentColor" />
                <rect x="6" y="2" width="2" height="2" fill="currentColor" />
                <rect x="11" y="6" width="3" height="2" fill="currentColor" opacity="0.85" />
                <rect x="9" y="4" width="2" height="3" fill="currentColor" opacity="0.4" />
              </svg>
            </button>
          </div>

          <div className="navbar-center">
            <ul className="navbar-links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    smooth
                    duration={600}
                    offset={0}
                    spy
                    onSetActive={() => setActive(link.to)}
                    className={active === link.to ? "active" : ""}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="navbar-right">
            <div className="navbar-social-group">
              <a href="https://github.com/fearsomecity" target="_blank" rel="noreferrer" className="navbar-social-icon-btn" title="GitHub">
                <FaGithub size={18} />
              </a>
              <div className="navbar-social-separator" />
              <a href={leetcodeStats.profileUrl} target="_blank" rel="noreferrer" className="navbar-social-icon-btn" title="LeetCode">
                <SiLeetcode size={18} />
              </a>
            </div>

            <a
              href="/Aditya_Resume.pdf"
              download="Aditya_Resume.pdf"
              className="navbar-cv"
              title="Download Resume"
            >
              ↓ CV
            </a>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={isDark ? "Light mode" : "Dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={18} style={{ strokeWidth: 2 }} />
              ) : (
                <Moon size={18} style={{ strokeWidth: 2 }} />
              )}
            </button>

            <div className="navbar-cta-wrapper" style={{ position: "relative" }}>
              <Link
                to="contact"
                smooth
                duration={600}
                offset={0}
                className="navbar-cta"
              >
                Let's Talk
              </Link>
              <SnakeTrigger />
            </div>

            <button
              className={`navbar-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`navbar-mobile${menuOpen ? " open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              duration={600}
              offset={0}
              spy
              className={active === link.to ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a href="https://github.com/fearsomecity" target="_blank" rel="noreferrer" className="navbar-mobile-social" title="GitHub">
            <FaGithub size={18} /> GitHub
          </a>
          <a href={leetcodeStats.profileUrl} target="_blank" rel="noreferrer" className="navbar-mobile-social" title="LeetCode">
            <SiLeetcode size={18} /> LeetCode
          </a>
          <a
            href="/Aditya_Resume.pdf"
            download="Aditya_Resume.pdf"
            className="navbar-mobile-cv"
            title="Download CV"
          >
            ↓ Download CV
          </a>
        </div>
      </nav>
    </>
  );
}
