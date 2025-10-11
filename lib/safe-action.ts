import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Define metadata schema for all actions
const metadataSchema = z.object({
  actionName: z.string(),
});

// Custom error class for action errors
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

// Base action client (no auth required)
export const actionClient = createSafeActionClient({
  defineMetadataSchema: () => metadataSchema,
  handleServerError: (e) => {
    console.error("Action error:", e.message);

    // Return custom error messages for known error types
    if (e instanceof ActionError) {
      return e.message;
    }

    if (e.message.includes("not found")) {
      return "Resource not found";
    }

    if (e.message.includes("Unauthorized")) {
      return "Unauthorized: Please log in";
    }

    // Return generic error message for unknown errors
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defaultValidationErrorsShape: "flattened",
});

// Authenticated action client (requires valid session)
export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new ActionError("Unauthorized: Please log in");
  }

  // Get user details
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    throw new ActionError("User not found");
  }

  // Pass user context to actions
  return next({
    ctx: {
      userId: userData.user.id,
      userEmail: userData.user.email || "",
      session,
    },
  });
});

