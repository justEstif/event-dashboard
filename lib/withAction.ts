/**
 * withAction
 *
 * Wraps a server action with wide-event logging. Emits one structured JSON
 * log line per call containing:
 *   - action name
 *   - user_id (optional)
 *   - outcome (success | error | redirect)
 *   - duration_ms
 *   - error details (on failure)
 *   - any business context added by the handler via `addContext`
 *
 * Usage:
 *   export const createEvent = withAction("createEvent", async (addContext, input) => {
 *     addContext({ sport_type: input.sport_type });
 *     ...
 *   });
 *
 * Works alongside withAuth — compose them as needed:
 *   export const createEvent = withAuth(
 *     withAction("createEvent", async (addContext, user, input) => { ... })
 *   );
 */

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { logger } from "@/lib/logger";

export type AddContext = (fields: Record<string, unknown>) => void;

export function withAction<TArgs extends unknown[], TReturn>(
  actionName: string,
  fn: (addContext: AddContext, ...args: TArgs) => Promise<TReturn>,
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const start = Date.now();
    const wideEvent: Record<string, unknown> = { action: actionName };
    const addContext: AddContext = (fields) => Object.assign(wideEvent, fields);

    try {
      const result = await fn(addContext, ...args);

      // Reflect ActionResult outcome if present
      if (result && typeof result === "object" && "success" in result) {
        wideEvent.outcome = (result as { success: boolean }).success ? "success" : "error";
        if (!(result as { success: boolean }).success) {
          wideEvent.action_error = (result as unknown as { error: string }).error;
        }
      } else {
        wideEvent.outcome = "success";
      }

      return result;
    } catch (e) {
      // next/navigation redirect() throws internally — treat as success
      if (isRedirectError(e)) {
        wideEvent.outcome = "redirect";
        throw e;
      }
      wideEvent.outcome = "error";
      wideEvent.error = {
        message: e instanceof Error ? e.message : String(e),
        type: e instanceof Error ? e.name : "UnknownError",
      };
      throw e;
    } finally {
      wideEvent.duration_ms = Date.now() - start;
      const level = wideEvent.outcome === "error" ? "error" : "info";
      logger[level](wideEvent);
    }
  };
}
