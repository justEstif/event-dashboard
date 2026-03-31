"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { err, toErrorMessage, type ActionResult } from "@/lib/result";
import { withAction } from "@/lib/withAction";

export const signIn = withAction(
  "signIn",
  async (addContext, email: string, _password: string): Promise<ActionResult<void>> => {
    addContext({ email });
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: _password });
    if (error) {
      addContext({ auth_error_code: error.code });
      return err(error.message);
    }
    redirect("/dashboard");
  },
);

export const signUp = withAction(
  "signUp",
  async (addContext, email: string, _password: string): Promise<ActionResult<void>> => {
    addContext({ email });
    const supabase = await createClient();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: _password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
        },
      });
      if (error) {
        addContext({ auth_error_code: error.code });
        return err(error.message);
      }
      redirect("/dashboard");
    } catch (e) {
      return err(toErrorMessage(e));
    }
  },
);

export const signOut = withAction("signOut", async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
});
