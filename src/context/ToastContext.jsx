import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <Toast message={toast} onClose={closeToast} />
    </ToastContext.Provider>
  );
}
