import React from "react";
import { motion } from "framer-motion";
import { Wrench, Cloud, Zap, Trophy } from "lucide-react";
import "../styles/About.css";

const highlights = [
  {
    icon: <Wrench size={24} strokeWidth={1.5} />,
    title: "Full-Stack (MERN)",
    desc: "React.js, Node.js, Express.js & MongoDB — end-to-end product development.",
    color: "var(--clr-red)",
  },
  {
    icon: <Cloud size={24} strokeWidth={1.5} />,
    title: "Cloud & DevOps",
    desc: "AWS EC2/S3, Docker, Git — deploying scalable, containerised applications.",
    color: "var(--clr-blue)",
  },
  {
    icon: <Zap size={24} strokeWidth={1.5} />,
    title: "AI Integration",
    desc: "Google Gemini API integration for real-time, AI-powered user experiences.",
    color: "var(--clr-purple)",
  },
  {
    icon: <Trophy size={24} strokeWidth={1.5} />,
    title: "8.37 CGPA",
    desc: "Maintaining a strong academic record at Chitkara University, Rajpura.",
    color: "var(--clr-green)",
  },
];

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          {/* Left: Code Block */}
          <motion.div
            className="about-visual"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="about-code-block">
              <div className="code-dots">
                <div className="code-dot" />
                <div className="code-dot" />
                <div className="code-dot" />
              </div>

              <code>
                <span className="code-line">
                  <span className="code-keyword">const </span>
                  <span className="code-var">developer</span>
                  <span className="code-punctuation"> = {"{"}</span>
                </span>
                <span className="code-line">
                  {"  "}<span className="code-property">name</span>
                  <span className="code-punctuation">: </span>
                  <span className="code-string">"Aditya Sharma"</span>
                  <span className="code-punctuation">,</span>
                </span>
                <span className="code-line">
                  {"  "}<span className="code-property">role</span>
                  <span className="code-punctuation">: </span>
                  <span className="code-string">"Full-Stack Developer"</span>
                  <span className="code-punctuation">,</span>
                </span>
                <span className="code-line">
                  {"  "}<span className="code-property">stack</span>
                  <span className="code-punctuation">: </span>
                  <span className="code-punctuation">["</span>
                  <span className="code-string">MERN</span>
                  <span className="code-punctuation">", "</span>
                  <span className="code-string">AWS</span>
                  <span className="code-punctuation">", "</span>
                  <span className="code-string">Docker</span>
                  <span className="code-punctuation">"],</span>
                </span>
                <span className="code-line">
                  {"  "}<span className="code-property">gpa</span>
                  <span className="code-punctuation">: </span>
                  <span className="code-string">8.37</span>
                  <span className="code-punctuation">,</span>
                </span>
                <span className="code-line">
                  {"  "}<span className="code-property">available</span>
                  <span className="code-punctuation">: </span>
                  <span className="code-keyword">true</span>
                  <span className="code-punctuation">,</span>
                </span>
                <span className="code-line">
                  {"  "}<span className="code-comment">// seeking internship 🙃</span>
                </span>
                <span className="code-line">
                  <span className="code-punctuation">{"}"}</span>
                </span>
              </code>
            </div>

            {/* Stats */}
            <div className="about-stats">
              {[
                { num: "8.37", label: "CGPA" },
                { num: "3+", label: "Projects" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="about-stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <span className="stat-num">{stat.num}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="section-label">About Me</div>
            <h2 className="section-title">
              Building <span className="high-purple">real-world</span> solutions
            </h2>

            <p className="about-description">
              I'm <span className="high-purple">Aditya Sharma</span>, a CS student at Chitkara
              University, Rajpura, passionate about crafting elegant, performant
              web applications. I thrive at the intersection of beautiful
              interfaces and robust backend systems.
            </p>
            <p className="about-description">
              With hands-on experience in the <span className="high-green">MERN stack</span> and{" "}
              <span className="high-blue">AWS cloud services</span>, I build production-ready
              applications — from AI-powered wellness platforms to IoT-driven
              smart environments.
            </p>

            <div className="about-highlights">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="about-highlight-item"
                  style={{ "--highlight-color": item.color }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                >
                  <span className="highlight-icon" style={{ color: item.color }}>{item.icon}</span>
                  <div className="highlight-text">
                    <strong>{item.title}</strong>
                    {item.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
