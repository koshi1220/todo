// src/public/view/Landing.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>ToDoKoshi へようこそ</h1>
      <p>あなたの緊急度と重要度でタスクを整理できるToDoアプリです。</p>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/login')} style={{ marginRight: '1rem' }}>
          ログインする
        </button>
        <button onClick={() => navigate('/todo')}>
          ログインせずに使う（匿名）
        </button>
      </div>
    </div>
  );
};

export default Landing;
