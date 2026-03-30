import { describe, it, expect } from "vitest";
import { ok, err, toErrorMessage, type ActionResult } from "../result";

describe("ok()", () => {
  it("returns success: true with data", () => {
    const result = ok({ id: "123" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ id: "123" });
  });

  it("works with primitive values", () => {
    expect(ok(42)).toEqual({ success: true, data: 42 });
    expect(ok(null)).toEqual({ success: true, data: null });
  });
});

describe("err()", () => {
  it("returns success: false with error message", () => {
    const result = err("Something went wrong");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Something went wrong");
  });
});

describe("ActionResult discriminated union", () => {
  it("narrows correctly on success", () => {
    const result: ActionResult<number> = ok(5);
    if (result.success) {
      // TypeScript should allow result.data here
      expect(result.data).toBe(5);
    }
  });

  it("narrows correctly on failure", () => {
    const result: ActionResult<number> = err("fail");
    if (!result.success) {
      expect(result.error).toBe("fail");
    }
  });
});

describe("toErrorMessage()", () => {
  it("extracts message from Error instance", () => {
    expect(toErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns string as-is", () => {
    expect(toErrorMessage("plain error")).toBe("plain error");
  });

  it("returns fallback for unknown types", () => {
    expect(toErrorMessage(42)).toBe("An unexpected error occurred");
    expect(toErrorMessage(null)).toBe("An unexpected error occurred");
    expect(toErrorMessage({})).toBe("An unexpected error occurred");
  });
});
