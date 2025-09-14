import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/validation";

describe("leadSchema", () => {
  it("accepts a valid payload", () => {
    const out = leadSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      country: "UK",
      linkedin: "https://www.linkedin.com/in/ada",
      visas: ["O-1"],
      notes: "hello",
    });
    expect(out.success).toBe(true);
  });

  it("rejects invalid linkedin", () => {
    const out = leadSchema.safeParse({
      firstName: "Ada",
      lastName: "L",
      email: "a@b.co",
      country: "UK",
      linkedin: "https://example.com",
      visas: ["O-1"],
    });
    expect(out.success).toBe(false);
    if (!out.success) expect(out.error.issues.map((i) => i.message)).toContain("Must be a LinkedIn URL");
  });

  it("requires at least one visa", () => {
    const out = leadSchema.safeParse({
      firstName: "Ada",
      lastName: "L",
      email: "a@b.co",
      country: "UK",
      linkedin: "https://www.linkedin.com/in/x",
      visas: [],
    });
    expect(out.success).toBe(false);
  });
});
