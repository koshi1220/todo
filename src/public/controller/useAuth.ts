// src/public/controller/useAuth.ts
import { useEffect, useState} from "react";
import {
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  User
} from "firebase/auth";
import { auth } from "../../private/firebase.js";
import { AppUser } from "../../private/models/User.js";

// import { useNavigate } from "react-router-dom"; // ✅ 追加

const formatUser = (user: User): AppUser => {
  const provider = user.providerData[0]?.providerId || '';
  const prefix = user.isAnonymous ? 'anon'
    : provider.includes('google') ? 'google'
    : provider.includes('password') ? 'email'
    : 'unknown';

  return {
    uid: user.uid,
    internalId: `${prefix}:${user.uid}`,
    externalId: user.email || '',
    displayName: user.displayName || '',
    isAnonymous: user.isAnonymous,
  };
};


export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  // const didRedirect = useRef(false); // ✅ 無限リダイレクト防止

  useEffect(() => {
    // ✅ リダイレクト後に戻ってきたか確認
    if (localStorage.getItem('loginTriggered') === 'true') {
      console.log('[Redirect] Googleログイン後に戻ってきた');
      localStorage.removeItem('loginTriggered');
    }
  
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log('[AuthStateChanged] Raw user:', u);
  
      if (u) {
        const formatted = formatUser(u);
        setUser(formatted);
      } else {
        setUser(null);
      }
  
      setLoading(false);
    });
  
    return () => unsub();
  }, []);  
  

  const loginGoogle = () => {
    console.log('[useAuth] Popup ログイン開始');
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('[useAuth] ログイン成功:', result.user);
      })
      .catch((error) => {
        console.error('[useAuth] ログインエラー:', error);
      });
  };
  

  const loginAnon = () => signInAnonymously(auth);
  const logout = () => signOut(auth);

  return { user, loading, loginGoogle, loginAnon, logout };
};

