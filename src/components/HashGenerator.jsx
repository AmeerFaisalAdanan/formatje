import React, { useState } from "react";
import { computeHash, computeHmac } from "../utils/hashUtils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select2";

const algorithms = ["md5", "sha1", "sha256", "sha512"];

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("md5");
  const [useHmac, setUseHmac] = useState(false);
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    if (useHmac) {
      setResult(computeHmac(input, secret, algorithm));
    } else {
      setResult(computeHash(input, algorithm));
    }
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-header">
          <span className="text-2xl">🔑</span> String to Hash Generator
        </h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full mb-2"
            placeholder="Enter string to hash"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Algorithm:
          </label>
          <Select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-auto"
          >
            {algorithms.map((algo) => (
              <option key={algo} value={algo}>
                {algo.toUpperCase()}
              </option>
            ))}
          </Select>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setUseHmac((v) => !v)}
          >
            {useHmac ? "Use Hash Only" : "Use HMAC"}
          </Button>
        </div>
        {useHmac && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Key
            </label>
            <Input
              type="text"
              className="input mb-2"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter secret key for HMAC"
            />
          </div>
        )}
        <div className="flex gap-3">
          <Button onClick={handleGenerate}>Generate</Button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Result
          </label>
          <div className="relative">
            <Textarea
              value={result}
              readOnly
              rows={2}
              className="w-full bg-gray-100 text-gray-700 pr-20"
            />
            <Button
              variant="primary"
              size="sm"
              type="button"
              className="absolute top-2 right-2"
              onClick={() => {
                if (result) {
                  navigator.clipboard.writeText(result);
                }
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
