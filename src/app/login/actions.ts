"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // TODO(Auth): formData から email と password を取得しましょう
  const email = "";
  const password = "";

  // TODO(Auth): signInWithPassword でログインし、結果の error を取得しましょう
  const error = null;

  if (error) {
    // TODO(Auth): /login?error=invalid にリダイレクトしましょう
  }

  revalidatePath("/", "layout");
  redirect("/");
}
