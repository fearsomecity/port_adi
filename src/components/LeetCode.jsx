import React from "react";
import { motion } from "framer-motion";
import { Code2, Trophy, Flame, Calendar, Award } from "lucide-react";
import { leetcodeStats } from "../data/portfolioData";
import "../styles/LeetCode.css";

export default function LeetCode() {
  const {
    username,
    profileUrl,
    solved,
    totalQuestions,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    ranking,
    streak,
    activeDays,
    acceptanceRate,
  } = leetcodeStats;

  // SVG calculations for radial progress
  const radius = 58;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const solvedPercentage = (solved / totalQuestions) * 100;
  const strokeDashoffset = circumference - (solvedPercentage / 100) * circumference;

  const diffs = [
    { type: "easy", solved: easySolved, total: easyTotal, pct: (easySolved / easyTotal) * 100 },
    { type: "medium", solved: mediumSolved, total: mediumTotal, pct: (mediumSolved / mediumTotal) * 100 },
    { type: "hard", solved: hardSolved, total: hardTotal, pct: (hardSolved / hardTotal) * 100 },
  ];

  return (
    <section className="leetcode-section" id="leetcode">
      <div className="container">
        <div className="leetcode-grid">
          {/* Left Side: Stats Text & Badges */}
          <motion.div
            className="leetcode-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="section-label">Competitive Programming</div>
            <h2 className="section-title">
              LeetCode <span className="high-orange" style={{ color: "#ffa116" }}>Profile</span>
            </h2>

            <p className="leetcode-description">
              Solving algorithmic challenges to build a strong foundation in data structures, 
              algorithms, and software design patterns. Continually sharpening problem-solving 
              speed, memory optimization, and runtime complexity.
            </p>

            <div className="leetcode-username-badge">
              <Code2 size={16} />
              Username: <a href={profileUrl} target="_blank" rel="noreferrer">{username}</a>
            </div>

            <div className="leetcode-badge-list">
              <div className="leetcode-badge-card">
                <span className="leetcode-badge-icon">
                  <Award size={18} />
                </span>
                <div>
                  Rank <span className="leetcode-badge-val">#{ranking}</span>
                </div>
              </div>

              <div className="leetcode-badge-card">
                <span className="leetcode-badge-icon" style={{ color: "var(--clr-red)" }}>
                  <Flame size={18} />
                </span>
                <div>
                  Streak <span className="leetcode-badge-val">{streak} Days</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Visual Metrics Widget */}
          <motion.div
            className="leetcode-visual-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header info */}
            <div className="leetcode-card-header">
              <div className="leetcode-card-title">
                <Trophy size={18} /> Stats Summary
              </div>
              <div className="leetcode-brand-label">LeetCode</div>
            </div>

            {/* Solved Count + Difficulty Breakdown */}
            <div className="leetcode-stats-overview">
              {/* Radial Progress Circle */}
              <div className="leetcode-progress-circle-wrap">
                <svg className="leetcode-progress-circle-svg">
                  <circle
                    className="leetcode-circle-bg"
                    cx="70"
                    cy="70"
                    r={radius}
                  />
                  <motion.circle
                    className="leetcode-circle-progress"
                    cx="70"
                    cy="70"
                    r={radius}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: strokeDashoffset }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
                  />
                </svg>
                <div className="leetcode-circle-text">
                  <span className="leetcode-circle-num">{solved}</span>
                  <span className="leetcode-circle-label">Solved</span>
                </div>
              </div>

              {/* Progress bars list */}
              <div className="leetcode-bars-list">
                {diffs.map((diff, i) => (
                  <div className="leetcode-bar-item" key={diff.type}>
                    <div className="leetcode-bar-info">
                      <span className={`leetcode-diff-label ${diff.type}`}>
                        {diff.type}
                      </span>
                      <span className="leetcode-bar-nums">
                        {diff.solved}
                        <span className="leetcode-bar-nums-total">
                          /{diff.total}
                        </span>
                      </span>
                    </div>
                    <div className="leetcode-bar-track">
                      <motion.div
                        className={`leetcode-bar-fill ${diff.type}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${diff.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 1.0, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acceptance rate & Active days footer stats */}
            <div className="leetcode-sub-grid">
              <div className="leetcode-sub-card">
                <span className="leetcode-sub-val" style={{ color: "#ffa116" }}>{acceptanceRate}</span>
                <span className="leetcode-sub-label">Acceptance</span>
              </div>
              <div className="leetcode-sub-card">
                <span className="leetcode-sub-val" style={{ color: "var(--clr-blue)" }}>{activeDays}</span>
                <span className="leetcode-sub-label">Active Days</span>
              </div>
              <div className="leetcode-sub-card">
                <span className="leetcode-sub-val" style={{ color: "var(--clr-green)" }}>{totalQuestions}</span>
                <span className="leetcode-sub-label">Total Qs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
