import { describe, it, expect } from "vitest";
import { formatContent } from "../formatters";

describe("formatContent", () => {
  it("formats minified JSON", async () => {
    const result = await formatContent('{"a":1,"b":[2,3]}', "json");
    expect(result).toContain('"a": 1');
    expect(result.split("\n").length).toBeGreaterThan(1);
  });

  it("throws on invalid JSON", async () => {
    await expect(formatContent("{broken", "json")).rejects.toThrow();
  });

  it("formats GraphQL queries", async () => {
    const result = await formatContent(
      "query{user(id:1){name email}}",
      "graphql"
    );
    expect(result).toContain("query {");
    expect(result).toContain("name");
  });

  it("formats XML with indentation", async () => {
    const result = await formatContent("<a><b>x</b></a>", "xml");
    expect(result).toContain("<a>");
    expect(result).toContain("  <b>x</b>");
  });

  it("throws on unknown format types", async () => {
    await expect(formatContent("data", "yaml")).rejects.toThrow(
      /Unknown format type/
    );
  });
});
