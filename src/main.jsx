import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routs/AppRoutes";
import "./index.css";
import { Toaster } from "react-hot-toast";

// Silence external library deprecation warnings & browser preloading warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("THREE.Clock") ||
      args[0].includes("THREE.Timer") ||
      args[0].includes("preloaded using link preload"))
  ) {
    return;
  }
  originalWarn(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes />
    
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: '80px', 
      }}
      toastOptions={{
        className: '',
        duration: 4000,
        style: {
          background: '#020617', // slate-950
          color: '#f8fafc',
          border: '1px solid #1e293b', // slate-800
          padding: '14px 20px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.025em',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#dd2476',
            secondary: '#ffffff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ff512f',
            secondary: '#ffffff',
          },
        },
      }}
    />
  </React.StrictMode>
);
