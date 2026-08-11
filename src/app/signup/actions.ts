"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // TODO(Auth): formData から email と password を取得しましょう
  const email = "";
  const password = "";

  // TODO(Auth): signUp でアカウントを作成し、結果の error を取得しましょう
  const error = null;

  if (error) {
    // TODO(Auth): /signup?error=failed にリダイレクトしましょう
  }

  redirect("/signup?message=sent");
}
