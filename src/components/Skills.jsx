import React from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Cog, Database, Wrench, Brain } from "lucide-react";
import { skills } from "../data/portfolioData";
import "../styles/Skills.css";

const categoryIcons = {
  Languages: <Code2 size={24} strokeWidth={1.5} />,
  Frontend: <Palette size={24} strokeWidth={1.5} />,
  Backend: <Cog size={24} strokeWidth={1.5} />,
  Database: <Database size={24} strokeWidth={1.5} />,
  "Tools / Platforms": <Wrench size={24} strokeWidth={1.5} />,
  "Core CS": <Brain size={24} strokeWidth={1.5} />,
};

const categoryColors = {
  Languages: "var(--clr-red)",
  Frontend: "var(--clr-purple)",
  Backend: "var(--clr-green)",
  Database: "var(--clr-yellow)",
  "Tools / Platforms": "var(--clr-blue)",
  "Core CS": "var(--clr-orange)",
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
          <p className="skills-subtitle">
            A curated toolkit refined through real-world projects and academic deep-dives.
          </p>
        </motion.div>

        <div className="skills-bento">
          {Object.entries(skills).map(([category, items], i) => {
            const bentoClass = category.toLowerCase().replace(/[^a-z]/g, "");
            const bentoColor = categoryColors[category] || "var(--clr-orange)";

            return (
              <motion.div
                key={category}
                className={`skill-bento-card card-${bentoClass}`}
                style={{ "--bento-color": bentoColor }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="skill-card-glass" />
                <div className="skill-card-content">
                  <div className="skill-cat-header">
                    <div className="skill-cat-icon">
                      {categoryIcons[category] || "💡"}
                    </div>
                    <h3 className="skill-cat-name">{category}</h3>
                  </div>

                  <div className="skill-pills">
                    {items.map((skill, si) => (
                      <motion.span
                        key={si}
                        className="skill-pill"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (si * 0.05) }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                {/* Decorative background glow */}
                <div className="skill-card-glow" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
