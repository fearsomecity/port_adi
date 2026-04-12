import React from "react";
import { motion } from "framer-motion";
import { projects } from "../data/portfolioData";
import "../styles/Projects.css";

function hexToRgba(hex, alpha) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
    : hex;
}

export default function Projects() {
  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">Projects</div>
          <h2 className="section-title">
            What I've <span>Built</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "500px" }}>
            Real-world applications solving real problems — from healthcare to IoT.
          </p>
        </motion.div>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className="project-card"
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              style={{
                "--project-color": project.color,
                "--project-glow": hexToRgba(project.color, 0.08),
              }}
            >
              <span className="project-icon">{project.icon}</span>
              <span className="project-year">{project.year}</span>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <ul className="project-bullets">
                {project.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>

              <div className="project-tech-pills">
                {project.tech.map((t, ti) => (
                  <span key={ti} className="project-tech-pill">
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-footer">
                <span className="project-link-btn" style={{ color: project.color }}>
                  View Project ↗
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {project.tech.length} tech used
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
