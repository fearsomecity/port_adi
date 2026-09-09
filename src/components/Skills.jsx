import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Code2, Palette, Cog, Database, Wrench, Brain, Flame, Trophy, ArrowUpRight, CheckCircle2, Calendar, TrendingUp } from "lucide-react";
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

/* ── LeetCode Mini Bento Card (Compact & Streamlined) ───────────── */
function LeetCodeMiniCard({ i }) {
  const [lc, setLc] = useState(leetcodeStats);
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  // Motion values for tilt tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-4, 4]);

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

  // Live fetch real stats from LeetCode API
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveStats() {
      try {
        const res = await fetch("https://alfa-leetcode-api.onrender.com/userProfile/Stoic_97");
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !data.totalSolved || !isMounted) return;

        const activeDays = data.submissionCalendar ? Object.keys(data.submissionCalendar).length : 118;

        setLc((prev) => ({
          ...prev,
          solved: data.totalSolved || prev.solved,
          easySolved: data.easySolved || prev.easySolved,
          mediumSolved: data.mediumSolved || prev.mediumSolved,
          hardSolved: data.hardSolved || prev.hardSolved,
          ranking: data.ranking ? Number(data.ranking).toLocaleString() : prev.ranking,
          activeDays: activeDays || prev.activeDays,
        }));
      } catch (e) {
        // Quiet fallback
      }
    }

    fetchLiveStats();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const totalSolved = Math.max(lc.solved, 1);
  const easyPct = ((lc.easySolved / totalSolved) * 100).toFixed(1);
  const medPct = ((lc.mediumSolved / totalSolved) * 100).toFixed(1);
  const hardPct = ((lc.hardSolved / totalSolved) * 100).toFixed(1);

  return (
    <motion.div
      ref={ref}
      className="skill-bento-card card-leetcode"
      style={{
        "--bento-color": "rgba(245, 158, 11, 0.4)",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="skill-card-glass" style={{ transform: "translateZ(0px)" }} />
      <div className="leetcode-compact-content" style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        
        {/* Compact Header */}
        <div className="leetcode-compact-header">
          <div className="leetcode-compact-identity">
            <div className="leetcode-brand-icon">
              <SiLeetcode size={18} />
            </div>
            <div className="leetcode-title-row">
              <h3 className="leetcode-compact-title">LeetCode</h3>
              <a
                href={lc.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="leetcode-profile-link"
              >
                <span>@{lc.username}</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          <div className="leetcode-compact-badges">
            <div className="leetcode-badge streak-badge">
              <Flame size={12} className="badge-icon-streak" />
              <span>{lc.streak}-Day Streak</span>
            </div>
            <div className="leetcode-badge active-badge">
              <Calendar size={12} />
              <span>{lc.activeDays} Active Days</span>
            </div>
          </div>
        </div>

        {/* Clean Developer Metrics Grid */}
        <div className="leetcode-metrics-grid">
          <div className="leetcode-metric-col">
            <span className="leetcode-metric-val val-total">{lc.solved}+</span>
            <span className="leetcode-metric-lbl">Total Solved</span>
          </div>
          <div className="leetcode-metric-divider" />
          <div className="leetcode-metric-col">
            <span className="leetcode-metric-val val-easy">{lc.easySolved}</span>
            <span className="leetcode-metric-lbl">Easy</span>
          </div>
          <div className="leetcode-metric-col">
            <span className="leetcode-metric-val val-med">{lc.mediumSolved}</span>
            <span className="leetcode-metric-lbl">Medium</span>
          </div>
          <div className="leetcode-metric-col">
            <span className="leetcode-metric-val val-hard">{lc.hardSolved}</span>
            <span className="leetcode-metric-lbl">Hard</span>
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
