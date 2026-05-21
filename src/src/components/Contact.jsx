import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Link, Globe, Phone, GraduationCap, MapPin, Calendar, Star, Cloud, Box } from "lucide-react";
import { personalInfo, education, certifications } from "../data/portfolioData";
import "../styles/Contact.css";

const contactItems = [
  {
    icon: <Mail size={20} strokeWidth={1.5} />,
    type: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
  },
  {
    icon: <Link size={20} strokeWidth={1.5} />,
    type: "LinkedIn",
    value: "aditya-sharma097",
    href: personalInfo.linkedin,
  },
  {
    icon: <Globe size={20} strokeWidth={1.5} />,
    type: "GitHub",
    value: "fearsomecity",
    href: personalInfo.github,
  },
  {
    icon: <Phone size={20} strokeWidth={1.5} />,
    type: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
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
                target={item.type !== "Phone" && item.type !== "Email" ? "_blank" : undefined}
                rel="noreferrer"
                className="contact-link-card"
                style={{ 
                  "--social-color": 
                    item.type === "Email" ? "var(--clr-red)" :
                    item.type === "LinkedIn" ? "var(--clr-blue)" :
                    item.type === "GitHub" ? "var(--clr-purple)" :
                    "var(--clr-green)"
                }}
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
