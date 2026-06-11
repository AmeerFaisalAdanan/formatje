import { describe, it, expect } from "vitest";
import { diffContents } from "../diffUtils";

describe("diffContents", () => {
  it("marks removed lines with '-' and added lines with '+'", async () => {
    const result = await diffContents("a\nb\n", "a\nc\n");
    expect(result).toContain("  a");
    expect(result).toContain("- b");
    expect(result).toContain("+ c");
  });

  it("leaves identical content unmarked", async () => {
    const result = await diffContents("same\n", "same\n");
    expect(result).not.toContain("+ ");
    expect(result).not.toContain("- ");
    expect(result).toContain("  same");
  });

  it("handles empty inputs", async () => {
    const result = await diffContents("", "new line\n");
    expect(result).toContain("+ new line");
  });
});
