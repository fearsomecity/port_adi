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
          <a href="https://github.com/fearsomecity" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', fontSize: '1rem', fontWeight: 500, color: 'var(--text)', textDecoration: 'none' }}>
            <FaGithub size={18} />
          </a>
          <a href={leetcodeStats.profileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', fontSize: '1rem', fontWeight: 500, color: 'var(--text)', textDecoration: 'none' }}>
            <SiLeetcode size={18} />
          </a>
          <a
            href="/Aditya_Resume.pdf"
            download="Aditya_Resume.pdf"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-h)', textDecoration: 'none', borderTop: '1px solid var(--border)' }}
          >
            ↓ Download CV
          </a>
        </div>
      </nav>
    </>
  );
}
