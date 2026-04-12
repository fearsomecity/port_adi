import React from "react";
import { Link } from "react-scroll";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-glass)",
        padding: "2.5rem 0",
        textAlign: "center",
      }}
    >
      <div className="container">
        <Link to="hero" smooth duration={800} style={{ cursor: "pointer" }}>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.8rem",
              fontWeight: 800,
              background: "var(--gradient-coral)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.75rem",
              display: "inline-block",
            }}
          >
            AS.
          </div>
        </Link>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            marginBottom: "1rem",
          }}
        >
          Aditya Sharma — Full-Stack Developer · MERN · AWS · {year}
        </p>


      </div>
    </footer>
  );
}
