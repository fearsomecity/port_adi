import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
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

function BentoCard({ category, items, i }) {
  const bentoClass = category.toLowerCase().replace(/[^a-z]/g, "");
  const bentoColor = categoryColors[category] || "var(--clr-orange)";

  // Motion values for tilt tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse offsets to degrees of rotation
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`skill-bento-card card-${bentoClass}`}
      style={{
        "--bento-color": bentoColor,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: i * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="skill-card-glass" style={{ transform: "translateZ(0px)" }} />
      <div className="skill-card-content" style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }}>
        <div className="skill-cat-header" style={{ transform: "translateZ(15px)" }}>
          <div className="skill-cat-icon">
            {categoryIcons[category] || "💡"}
          </div>
          <h3 className="skill-cat-name">{category}</h3>
        </div>

        <div className="skill-pills" style={{ transform: "translateZ(10px)" }}>
          {items.map((skill, si) => (
            <motion.span
              key={si}
              className="skill-pill"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + si * 0.03 }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className="skill-card-glow" style={{ transform: "translateZ(-5px)" }} />
    </motion.div>
  );
}

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
          {Object.entries(skills).map(([category, items], i) => (
            <BentoCard 
              key={category}
              category={category}
              items={items}
              i={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
