import React from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Cog, Database, Wrench, Brain, Trophy, Award, Flame } from "lucide-react";
import { skills, leetcodeStats } from "../data/portfolioData";
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

          {/* Custom LeetCode Profile Bento Card */}
          <motion.div
            className="skill-bento-card card-leetcode"
            style={{ "--bento-color": "#ffa116" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="skill-card-glass" />
            <div className="skill-card-content leetcode-mini-content">
              <div className="leetcode-mini-header">
                <div className="leetcode-mini-title-wrap">
                  <div className="skill-cat-icon leetcode-icon-bg">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="skill-cat-name">LeetCode Profile</h3>
                    <span className="leetcode-mini-username">
                      Username: <a href={leetcodeStats.profileUrl} target="_blank" rel="noreferrer">{leetcodeStats.username}</a>
                    </span>
                  </div>
                </div>
                <div className="leetcode-mini-stats-top">
                  <div className="leetcode-mini-stat-badge">
                    <Award size={14} /> Rank: #{leetcodeStats.ranking}
                  </div>
                  <div className="leetcode-mini-stat-badge streak">
                    <Flame size={14} /> {leetcodeStats.streak} Days
                  </div>
                </div>
              </div>

              <div className="leetcode-mini-body">
                {/* Circle Solved Progress */}
                <div className="leetcode-mini-circle-section">
                  <div className="leetcode-mini-circle-wrap">
                    <svg className="leetcode-mini-circle-svg" viewBox="0 0 100 100">
                      <circle className="leetcode-circle-bg" cx="50" cy="50" r="40" strokeWidth="6" />
                      <circle 
                        className="leetcode-circle-progress" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        strokeWidth="6" 
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 - (leetcodeStats.solved / leetcodeStats.totalQuestions) * 2 * Math.PI * 40}
                      />
                    </svg>
                    <div className="leetcode-mini-circle-text">
                      <span className="leetcode-mini-solved-num">{leetcodeStats.solved}</span>
                      <span className="leetcode-mini-solved-label">Solved</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="leetcode-mini-bars">
                  {[
                    { label: "Easy", solved: leetcodeStats.easySolved, total: leetcodeStats.easyTotal, color: "#00b8a3" },
                    { label: "Medium", solved: leetcodeStats.mediumSolved, total: leetcodeStats.mediumTotal, color: "#ffc01e" },
                    { label: "Hard", solved: leetcodeStats.hardSolved, total: leetcodeStats.hardTotal, color: "#ef4743" },
                  ].map((item) => (
                    <div className="leetcode-mini-bar-item" key={item.label}>
                      <div className="leetcode-mini-bar-info">
                        <span className="leetcode-mini-bar-label" style={{ color: item.color }}>{item.label}</span>
                        <span className="leetcode-mini-bar-nums">
                          {item.solved}<span className="leetcode-mini-bar-total">/{item.total}</span>
                        </span>
                      </div>
                      <div className="leetcode-mini-bar-track">
                        <div 
                          className="leetcode-mini-bar-fill" 
                          style={{ 
                            width: `${(item.solved / item.total) * 100}%`,
                            backgroundColor: item.color
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meta Stats */}
                <div className="leetcode-mini-meta">
                  <div className="leetcode-mini-meta-item">
                    <span className="leetcode-mini-meta-val">{leetcodeStats.acceptanceRate}</span>
                    <span className="leetcode-mini-meta-lbl">Acceptance</span>
                  </div>
                  <div className="leetcode-mini-meta-item">
                    <span className="leetcode-mini-meta-val">{leetcodeStats.activeDays}</span>
                    <span className="leetcode-mini-meta-lbl">Active Days</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="skill-card-glow" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
