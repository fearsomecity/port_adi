import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner">
          <Link to="hero" smooth duration={600} className="navbar-logo" onClick={() => setMenuOpen(false)}>
            AS.
          </Link>

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
            <li>
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
            </li>
            <li>
              <Link
                to="contact"
                smooth
                duration={600}
                offset={0}
                className="navbar-cta"
              >
                <Sparkles size={16} style={{ strokeWidth: 2.5 }} />
                Hire Me
              </Link>
            </li>
          </ul>

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
        </div>
      </nav>
    </>
  );
}
