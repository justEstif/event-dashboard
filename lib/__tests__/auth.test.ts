import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User } from "@supabase/supabase-js";

// --- mocks must be declared before imports that use them ---

// Mock next/navigation so redirect() doesn't throw in tests
vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

// Mock the Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { withAuth, getAuthUser, requireAuthUser } from "../auth";
import { createClient } from "@/lib/supabase/server";
import { ok } from "../result";

const mockUser: User = {
  id: "user-123",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
};

function mockSupabase(user: User | null, error: Error | null = null) {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error }),
    },
  } as any);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("withAuth()", () => {
  it("calls wrapped fn with user when authenticated", async () => {
    mockSupabase(mockUser);
    const action = withAuth(async (user) => ok(user.id));
    const result = await action();
    expect(result).toEqual({ success: true, data: "user-123" });
  });

  it("passes extra args through to the wrapped fn", async () => {
    mockSupabase(mockUser);
    const action = withAuth(async (user, input: { name: string }) =>
      ok(`${user.id}:${input.name}`),
    );
    const result = await action({ name: "Soccer Match" });
    expect(result).toEqual({ success: true, data: "user-123:Soccer Match" });
  });

  it("redirects to /auth/login when no user", async () => {
    mockSupabase(null);
    const action = withAuth(async (user) => ok(user.id));
    await expect(action()).rejects.toThrow("REDIRECT:/auth/login");
  });

  it("redirects to /auth/login on auth error", async () => {
    mockSupabase(null, new Error("session expired"));
    const action = withAuth(async (user) => ok(user.id));
    await expect(action()).rejects.toThrow("REDIRECT:/auth/login");
  });
});

describe("getAuthUser()", () => {
  it("returns user when authenticated", async () => {
    mockSupabase(mockUser);
    const user = await getAuthUser();
    expect(user).toEqual(mockUser);
  });

  it("returns null when unauthenticated", async () => {
    mockSupabase(null);
    const user = await getAuthUser();
    expect(user).toBeNull();
  });
});

describe("requireAuthUser()", () => {
  it("returns user when authenticated", async () => {
    mockSupabase(mockUser);
    const user = await requireAuthUser();
    expect(user).toEqual(mockUser);
  });

  it("redirects when unauthenticated", async () => {
    mockSupabase(null);
    await expect(requireAuthUser()).rejects.toThrow("REDIRECT:/auth/login");
  });
});
