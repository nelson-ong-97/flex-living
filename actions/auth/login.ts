"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginUser = actionClient
  .metadata({ actionName: "loginUser" })
  .inputSchema(loginSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Login failed");
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  });

export const logoutUser = actionClient
  .metadata({ actionName: "logoutUser" })
  .action(async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    redirect("/auth/login");
  });

