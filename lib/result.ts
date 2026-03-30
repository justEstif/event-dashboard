/**
 * ActionResult<T>
 *
 * A discriminated union returned by every server action.
 * Client components narrow on `success` before using `data` or `error`.
 *
 * Usage:
 *   const result = await createEvent(input)
 *   if (!result.success) { toast.error(result.error); return }
 *   console.log(result.data)
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/** Wrap a successful value */
export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/** Wrap an error message */
export function err<T = never>(error: string): ActionResult<T> {
  return { success: false, error };
}

/**
 * Safely extract an error message from an unknown thrown value.
 * Use inside server action catch blocks.
 */
export function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "An unexpected error occurred";
}
