import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, GraduationCap, MapPin, Calendar, Star, Cloud, Box } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { personalInfo, education, certifications } from "../data/portfolioData";
import "../styles/Contact.css";

const contactItems = [
  {
    icon: <Mail size={20} strokeWidth={1.5} />,
    type: "Email",
    href: `mailto:${personalInfo.email}`,
    color: "var(--clr-red)",
  },
  {
    icon: <FaLinkedin size={20} />,
    type: "LinkedIn",
    href: personalInfo.linkedin,
    color: "var(--clr-blue)",
  },
  {
    icon: <FaGithub size={20} />,
    type: "GitHub",
    href: personalInfo.github,
    color: "var(--clr-purple)",
  },
];

export default function Contact() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-600, 600]);

  return (
    <section className="contact-section" id="contact" ref={containerRef}>
      {/* Ghost background text */}
      <motion.div 
        className="contact-bg-text" 
        style={{ y, x: "-50%" }}
      >
        LET'S CONNECT
      </motion.div>

      <div className="container">
        <div className="contact-inner">
          <motion.div
            className="contact-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-label">Contact</div>
          </motion.div>

          <motion.h2
            className="contact-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Let's Build<br />
            <span>Something Great</span>
          </motion.h2>

          <motion.p
            className="contact-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            I'm actively seeking <strong style={{ color: "var(--text-primary)" }}>software engineering internships</strong> in <strong style={{ color: "var(--text-primary)" }}>full-stack</strong>, <strong style={{ color: "var(--text-primary)" }}>backend</strong>, or <strong style={{ color: "var(--text-primary)" }}>cloud engineering</strong>. Let's talk!
          </motion.p>

          {/* Contact link cards */}
          <div className="contact-links">
            {contactItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="contact-link-card"
                style={{ "--social-color": item.color }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.15 }}
                title={item.type}
              >
                <div className="contact-link-icon">{item.icon}</div>
              </motion.a>
            ))}
          </div>



          {/* Education Card */}
          <motion.div
            className="contact-edu"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="section-label" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
              Education
            </div>

            <div className="edu-card">
              <span className="edu-icon">
                <GraduationCap size={44} strokeWidth={1.5} />
              </span>
              <div className="edu-info">
                <div className="edu-degree">{education.degree}</div>
                <div className="edu-university">{education.university}</div>
                <div className="edu-meta">
                  <span className="edu-meta-item">
                    <MapPin size={16} strokeWidth={1.5} style={{ color: "var(--clr-red)" }} /> 
                    {education.location}
                  </span>
                  <span className="edu-meta-item">
                    <Calendar size={16} strokeWidth={1.5} style={{ color: "var(--clr-blue)" }} />
                    {education.duration}
                  </span>
                  <span className="edu-gpa">
                    <Star size={18} fill="var(--clr-yellow)" strokeWidth={0} />
                    {education.gpa} CGPA
                  </span>
                </div>
              </div>
            </div>

            {/* Certs */}
            <div className="section-label" style={{ justifyContent: "center", margin: "2.5rem 0 1.5rem" }}>
              Certifications
            </div>

            <div className="certs-grid">
              {certifications.map((cert, i) => {
                const Icon = cert.icon === "cloud" ? Cloud : Box;
                return (
                  <motion.div
                    key={i}
                    className="cert-card"
                    style={{ "--cert-color": i % 2 === 0 ? "var(--clr-blue)" : "var(--clr-yellow)" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                  >
                    <span className="cert-icon" style={{ color: i % 2 === 0 ? "var(--clr-blue)" : "var(--clr-yellow)" }}>
                      <Icon size={24} strokeWidth={1.5} />
                    </span>
                    <div>
                      <div className="cert-title">{cert.title}</div>
                      <div className="cert-issuer">{cert.issuer}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
