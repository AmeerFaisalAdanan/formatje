import { describe, it, expect } from "vitest";
import { convertJsonToCurl, exampleJsonSchemas } from "../curlConverter";

describe("convertJsonToCurl", () => {
  it("converts a basic GET request", () => {
    const { full, masked } = convertJsonToCurl(
      JSON.stringify({ url: "https://api.example.com/users" })
    );
    expect(full).toBe("curl \\\n  'https://api.example.com/users'");
    expect(masked).toBe(full);
  });

  it("adds -X for non-GET methods and -d for bodies", () => {
    const { full } = convertJsonToCurl(
      JSON.stringify({
        url: "https://api.example.com/users",
        method: "post",
        body: { name: "John" },
      })
    );
    expect(full).toContain("-X POST");
    expect(full).toContain(`-d '{"name":"John"}'`);
  });

  it("includes headers as -H flags", () => {
    const { full } = convertJsonToCurl(
      JSON.stringify({
        url: "https://api.example.com",
        headers: { "Content-Type": "application/json" },
      })
    );
    expect(full).toContain("-H 'Content-Type: application/json'");
  });

  it("masks long sensitive header values in the masked variant only", () => {
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const { full, masked } = convertJsonToCurl(
      JSON.stringify({
        url: "https://api.example.com",
        headers: { Authorization: token },
      })
    );
    expect(full).toContain(token);
    expect(masked).not.toContain(token);
    expect(masked).toContain("Bearer eyJ"); // first 10 chars preserved
    expect(masked).toContain("••••");
  });

  it("applies cURL option flags", () => {
    const { full } = convertJsonToCurl(
      JSON.stringify({ url: "https://x.test" }),
      { verbose: true, insecure: true, silent: true, followRedirects: true }
    );
    for (const flag of ["-v", "-k", "-s", "-L"]) {
      expect(full).toContain(flag);
    }
  });

  it("shell-escapes single quotes in values", () => {
    const { full } = convertJsonToCurl(
      JSON.stringify({
        url: "https://x.test",
        body: { name: "Jane O'Connor" },
      })
    );
    expect(full).toContain(`O'"'"'Connor`);
  });

  it("rejects empty input", () => {
    expect(() => convertJsonToCurl("   ")).toThrow(/provide a JSON object/);
  });

  it("rejects invalid JSON", () => {
    expect(() => convertJsonToCurl("{nope")).toThrow(/Invalid JSON/);
  });

  it("rejects a missing url", () => {
    expect(() => convertJsonToCurl(JSON.stringify({ method: "GET" }))).toThrow(
      /URL is required/
    );
  });

  it("rejects a malformed url", () => {
    expect(() =>
      convertJsonToCurl(JSON.stringify({ url: "not a url" }))
    ).toThrow(/Invalid URL/);
  });

  it("rejects array headers", () => {
    expect(() =>
      convertJsonToCurl(
        JSON.stringify({ url: "https://x.test", headers: ["bad"] })
      )
    ).toThrow(/Headers must be an object/);
  });

  it("converts every bundled example schema without throwing", () => {
    for (const schema of Object.values(exampleJsonSchemas)) {
      const { full } = convertJsonToCurl(JSON.stringify(schema));
      expect(full.startsWith("curl")).toBe(true);
    }
  });
});
