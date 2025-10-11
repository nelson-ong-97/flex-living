"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const signupUser = actionClient
  .metadata({ actionName: "signupUser" })
  .inputSchema(signupSchema)
  .action(async ({ parsedInput }) => {
    const { email, password, name } = parsedInput;

    const supabase = await createClient();

    // Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Signup failed");
    }

    // Create user record in our database
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email,
          name,
          role: "manager",
        },
      });
    } catch (dbError) {
      // If database creation fails, we should ideally delete the auth user
      // For now, we'll just log the error
      console.error("Failed to create user in database:", dbError);
    }

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  });

