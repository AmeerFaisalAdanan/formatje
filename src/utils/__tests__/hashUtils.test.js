import { describe, it, expect } from "vitest";
import { computeHash, computeHmac } from "../hashUtils";

describe("computeHash", () => {
  it("computes MD5", () => {
    expect(computeHash("abc", "md5")).toBe("900150983cd24fb0d6963f7d28e17f72");
  });

  it("computes SHA-1", () => {
    expect(computeHash("abc", "sha1")).toBe(
      "a9993e364706816aba3e25717850c26c9cd0d89d"
    );
  });

  it("computes SHA-256", () => {
    expect(computeHash("abc", "sha256")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });

  it("computes SHA-512", () => {
    expect(computeHash("abc", "sha512")).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a" +
        "2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
    );
  });

  it("returns an empty string for unsupported algorithms", () => {
    expect(computeHash("abc", "sha3")).toBe("");
  });
});

describe("computeHmac", () => {
  it("computes HMAC-SHA256 against a known vector", () => {
    expect(
      computeHmac(
        "The quick brown fox jumps over the lazy dog",
        "key",
        "sha256"
      )
    ).toBe("f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8");
  });

  it("produces different output for different secrets", () => {
    const a = computeHmac("message", "secret-a", "sha256");
    const b = computeHmac("message", "secret-b", "sha256");
    expect(a).not.toBe(b);
  });

  it("returns an empty string for unsupported algorithms", () => {
    expect(computeHmac("abc", "key", "blake2")).toBe("");
  });
});
