import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Code2, Palette, Cog, Database, Wrench, Brain, Flame, Trophy } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
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
    </motion.div>
  );
}

/* ── LeetCode Mini Bento Card ──────────────────────────────────────────── */
function LeetCodeMiniCard({ i }) {
  const [lc, setLc] = useState(leetcodeStats);
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  // Live fetch real stats from LeetCode API
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveStats() {
      try {
        const res = await fetch("https://alfa-leetcode-api.onrender.com/userProfile/Stoic_97");
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !data.totalSolved || !isMounted) return;

        const totalAc = data.totalSubmissions?.[0]?.count || 386;
        const totalSub = data.totalSubmissions?.[0]?.submissions || 465;
        const rate = totalSub > 0 ? ((totalAc / totalSub) * 100).toFixed(1) + "%" : "83.0%";
        const activeDays = data.submissionCalendar ? Object.keys(data.submissionCalendar).length : 118;

        setLc({
          username: "Stoic_97",
          profileUrl: "https://leetcode.com/u/Stoic_97/",
          solved: data.totalSolved,
          totalQuestions: data.totalQuestions || 4042,
          easySolved: data.easySolved || 68,
          easyTotal: data.totalEasy || 962,
          mediumSolved: data.mediumSolved || 57,
          mediumTotal: data.totalMedium || 2109,
          hardSolved: data.hardSolved || 5,
          hardTotal: data.totalHard || 971,
          ranking: data.ranking ? Number(data.ranking).toLocaleString() : "1,315,880",
          streak: 15,
          activeDays,
          acceptanceRate: rate,
        });
      } catch (e) {
        // Quiet fallback to accurate default state
      }
    }

    fetchLiveStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Trigger animation once card enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const R = 42;
  const CIRC = 2 * Math.PI * R;
  const pct = lc.solved / lc.totalQuestions;
  const offset = CIRC * (1 - (animated ? pct : 0));

  const bars = [
    { label: "Easy",   solved: lc.easySolved,   total: lc.easyTotal,   color: "#28c840" },
    { label: "Medium", solved: lc.mediumSolved, total: lc.mediumTotal, color: "#febc2e" },
    { label: "Hard",   solved: lc.hardSolved,   total: lc.hardTotal,   color: "#ff5f57" },
  ];

  return (
    <motion.div
      ref={ref}
      className="skill-bento-card card-leetcode"
      style={{ "--bento-color": "#ffa116" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay: i * 0.08 }}
    >
      <div className="skill-card-glass" />
      <div className="skill-card-content leetcode-mini-content">

        {/* Header */}
        <div className="leetcode-mini-header">
          <div className="leetcode-mini-title-wrap">
            <div className="skill-cat-icon leetcode-icon-bg">
              <SiLeetcode size={22} />
            </div>
            <div>
              <h3 className="skill-cat-name">LeetCode</h3>
              <span className="leetcode-mini-username">
                <a href={lc.profileUrl} target="_blank" rel="noreferrer">@{lc.username}</a>
              </span>
            </div>
          </div>
          <div className="leetcode-mini-stats-top">
            <span className="leetcode-mini-stat-badge streak">
              <Flame size={13} /> {lc.streak}-day streak
            </span>
            <span className="leetcode-mini-stat-badge">
              <Trophy size={13} /> #{lc.ranking}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="leetcode-mini-body">
          {/* Circle progress */}
          <div className="leetcode-mini-circle-wrap">
            <svg className="leetcode-mini-circle-svg" viewBox="0 0 100 100">
              <circle className="leetcode-circle-bg" cx="50" cy="50" r={R} strokeWidth="8" />
              <circle
                className="leetcode-circle-progress"
                cx="50" cy="50" r={R}
                strokeWidth="8"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
              />
            </svg>
            <div className="leetcode-mini-circle-text">
              <span className="leetcode-mini-solved-num">{lc.solved}</span>
              <span className="leetcode-mini-solved-label">Solved</span>
            </div>
          </div>

          {/* Difficulty bars */}
          <div className="leetcode-mini-bars">
            {bars.map((b) => (
              <div key={b.label} className="leetcode-mini-bar-item">
                <div className="leetcode-mini-bar-info">
                  <span className="leetcode-mini-bar-label" style={{ color: b.color }}>{b.label}</span>
                  <span className="leetcode-mini-bar-nums">
                    {b.solved}<span className="leetcode-mini-bar-total">/{b.total}</span>
                  </span>
                </div>
                <div className="leetcode-mini-bar-track">
                  <div
                    className="leetcode-mini-bar-fill"
                    style={{
                      background: b.color,
                      width: animated ? `${(b.solved / b.total) * 100}%` : "0%",
                      transition: "width 1.1s ease-out"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Meta stats */}
          <div className="leetcode-mini-meta">
            <div className="leetcode-mini-meta-item">
              <span className="leetcode-mini-meta-val">{lc.acceptanceRate}</span>
              <span className="leetcode-mini-meta-lbl">Acceptance</span>
            </div>
            <div className="leetcode-mini-meta-item">
              <span className="leetcode-mini-meta-val">{lc.activeDays}</span>
              <span className="leetcode-mini-meta-lbl">Active Days</span>
            </div>
          </div>
        </div>

      </div>
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
          <LeetCodeMiniCard i={Object.keys(skills).length} />
        </div>
      </div>
    </section>
  );
}
