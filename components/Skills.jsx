import React from "react";
import { motion } from "framer-motion";
import { skills } from "../data/portfolioData";
import "../styles/Skills.css";

const categoryIcons = {
  Languages: "⌨️",
  Frontend: "🎨",
  Backend: "⚙️",
  Database: "🗄️",
  "Tools / Platforms": "🛠️",
  "Core CS": "🧠",
};

export default function Skills() {
  return (
    <section className="skills-section" id="skills">
      <div className="container">
        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">Technical Skills</div>
          <h2 className="section-title">
            My <span>Tech Stack</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
            A curated toolkit refined through real-world projects and academic deep-dives.
          </p>
        </motion.div>

        <div className="skills-grid">
          {Object.entries(skills).map(([category, items], i) => (
            <motion.div
              key={category}
              className="skill-category-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="skill-cat-header">
                <div className="skill-cat-icon">
                  {categoryIcons[category] || "💡"}
                </div>
                <span className="skill-cat-name">{category}</span>
              </div>

              <div className="skill-pills">
                {items.map((skill, si) => (
                  <motion.span
                    key={si}
                    className="skill-pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: i * 0.06 + si * 0.04, duration: 0.4 }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
