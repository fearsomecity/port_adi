import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 1.5rem",
            borderRadius: "16px",
            background: "rgba(10, 10, 10, 0.45)",
            backdropFilter: "blur(24px) saturate(190%)",
            WebkitBackdropFilter: "blur(24px) saturate(190%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.3)",
            color: "#FFFFFF",
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            fontWeight: 550,
          }}
        >
          <CheckCircle size={18} style={{ color: "#10B981", flexShrink: 0 }} />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
