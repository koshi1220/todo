import React from "react";
import { Routes, Route } from "react-router-dom";

import { useAuth } from "../public/controller/useAuth.js";

import Landing from "../public/view/Landing.js";
import SignIn from "../public/view/SignIn.js";

import MatrixPage from "../private/views/MatrixPageContent.js";
import CreatePage from "../private/views/CreatePage.js";

import { TicketProvider } from "../contexts/TicketContext.js";
import { Navigate, useLocation } from "react-router-dom"; // ← 追加

const AppRouter: React.FC = () => {
  const { user, loginGoogle, loginAnon, loading } = useAuth();
  const location = useLocation();
  console.log('[AppRouter] loading:', loading);
  console.log('[AppRouter] user:', user);
  console.log('[AppRouter] location:', location.pathname);
  
  if (loading) return <p>Loading...</p>;

  // ✅ 修正点：ログイン済み && "/" または "/login" にいるなら強制リダイレクト
  if (
    user &&
    (location.pathname === '/' || location.pathname === '/login')
  ) {
    const hasExternalId = Boolean(user.externalId);
    return <Navigate to={hasExternalId ? '/matrix' : '/initial-register'} replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<SignIn loginGoogle={loginGoogle} loginAnon={loginAnon} />} />
      {user && (
        <Route
          path="/initial-register"
          element={
            <TicketProvider userId={user.uid}>
              <CreatePage />
            </TicketProvider>
          }
        />
      )}
<Route
  path="/matrix"
  element={
    loading ? (
      <p>Loading...</p> // ✅ 一時待機中
    ) : user ? (
      <TicketProvider userId={user.uid}>
        <MatrixPage />
      </TicketProvider>
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>
    </Routes>
  );
};


export default AppRouter;
