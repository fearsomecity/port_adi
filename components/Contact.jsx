import React from "react";
import { motion } from "framer-motion";
import { personalInfo, education, certifications } from "../data/portfolioData";
import "../styles/Contact.css";

const contactItems = [
  {
    icon: "✉️",
    type: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
  },
  {
    icon: "💼",
    type: "LinkedIn",
    value: "aditya-sharma097",
    href: personalInfo.linkedin,
  },
  {
    icon: "🐙",
    type: "GitHub",
    value: "fearsomecity",
    href: personalInfo.github,
  },
  {
    icon: "📱",
    type: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
  },
];

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      {/* Ghost background text */}
      <div className="contact-bg-text">LET'S CONNECT</div>

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
            I'm actively seeking software engineering internships in full-stack, backend, or cloud engineering. Let's talk!
          </motion.p>

          {/* Contact link cards */}
          <div className="contact-links">
            {contactItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.type !== "Phone" && item.type !== "Email" ? "_blank" : undefined}
                rel="noreferrer"
                className="contact-link-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="contact-link-icon">{item.icon}</div>
                <div className="contact-link-info">
                  <span className="contact-link-type">{item.type}</span>
                  <span className="contact-link-value">{item.value}</span>
                </div>
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="contact-cta"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <a href={`mailto:${personalInfo.email}`}>
              <button className="btn-coral">Send Me an Email 📩</button>
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
              <button className="btn-outline">Connect on LinkedIn</button>
            </a>
          </motion.div>

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
              <span className="edu-icon">🎓</span>
              <div className="edu-info">
                <div className="edu-degree">{education.degree}</div>
                <div className="edu-university">{education.university}</div>
                <div className="edu-meta">
                  <span className="edu-meta-item">📍 {education.location}</span>
                  <span className="edu-meta-item">📅 {education.duration}</span>
                  <span className="edu-gpa">⭐ {education.gpa} CGPA</span>
                </div>
              </div>
            </div>

            {/* Certs */}
            <div className="section-label" style={{ justifyContent: "center", margin: "2.5rem 0 1.5rem" }}>
              Certifications
            </div>

            <div className="certs-grid">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  className="cert-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  <span className="cert-icon">{cert.icon}</span>
                  <div>
                    <div className="cert-title">{cert.title}</div>
                    <div className="cert-issuer">{cert.issuer}</div>
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
