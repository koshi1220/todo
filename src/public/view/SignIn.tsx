// src/public/views/SignIn.tsx
import React from "react";

const SignIn: React.FC<{
  loginGoogle: () => void;
  loginAnon: () => void;
}> = ({ loginGoogle, loginAnon }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>ToDoKoshi</h2>
      <p>ログイン方法を選んでください：</p>
      <button
        onClick={() => {
            console.log('[SignIn] Googleでログインボタンが押された');
            loginGoogle();
        }}
        >
        Googleでログイン
        </button>
      <button onClick={loginAnon} style={{ marginLeft: '1rem' }}>匿名で使う</button>
    </div>
  );
};

export default SignIn;
