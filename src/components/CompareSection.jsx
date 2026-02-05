import React, { useState } from "react";
import { CompareEditor } from "./CompareEditor";
import { CompareResultDisplay } from "./CompareResultDisplay";
import { diffContents } from "../utils/diffUtils";
import { Button } from "./ui/button";

export function CompareSection() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState("");

  const handleCompare = async () => {
    setResult(await diffContents(left, right));
  };

  return (
    <section className="card">
      <h2 className="section-header mb-6">
        <span className="text-2xl">🔍</span> Compare Tool
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <CompareEditor value={left} onChange={setLeft} label="Left" />
        <CompareEditor value={right} onChange={setRight} label="Right" />
      </div>

      <div className="flex gap-3 mb-4">
        <Button onClick={handleCompare}>↔️ Compare</Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diff Result
        </label>
        <CompareResultDisplay result={result} />
      </div>
    </section>
  );
}
