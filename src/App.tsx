// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routes/AppRouter.js";

const App: React.FC = () => {
  // ✅ モダン環境での高さ調整（モバイルでも正確な高さを取る）
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh(); // 初期実行
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <Router>
      <AppRouter />
    </Router>
  );
};

export default App;