import React from "react";
import { Link } from "react-scroll";
import "../styles/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <Link to="hero" smooth duration={800}>
          <div className="footer-logo">AS.</div>
        </Link>

        <p className="footer-text">
          Aditya Sharma — Full-Stack Developer · MERN · AWS · {year}
        </p>
      </div>
    </footer>
  );
}
