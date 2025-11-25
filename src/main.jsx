import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routs/AppRoutes";
import "./index.css";
import { Toaster } from "react-hot-toast";

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
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },

  
        success: {
          duration: 3000,
          theme: {
            primary: '#00FFFF',
            secondary: '#1f1b2e',
          },
        },
      }}
    />
  </React.StrictMode>
);
