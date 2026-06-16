"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import type { Profile } from "@/types";

export async function requireAuth(): Promise<Profile> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log('auth user:', user?.id ?? 'null', authError?.message ?? '');

  if (authError || !user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  console.log('profile:', profile?.id ?? 'null', profileError?.message ?? '');

  if (profileError || !profile) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    redirect("/login?error=account_disabled");
  }

  return profile as Profile;
}