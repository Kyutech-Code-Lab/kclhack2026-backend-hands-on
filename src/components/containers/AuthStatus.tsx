"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // ログイン状態の変化に合わせて表示を更新します。
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      setIsLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // ページ全体を読み込み直して、カートなどの表示をリセットします。
    window.location.href = "/";
  }

  if (isLoading) {
    return null;
  }

  if (!email) {
    return (
      <Link className="text-link" href="/login">
        ログイン
      </Link>
    );
  }

  return (
    <div className="auth-status">
      <span className="muted-text">{email}</span>
      <button className="text-button" onClick={handleLogout} type="button">
        ログアウト
      </button>
    </div>
  );
}
