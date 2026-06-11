import React from "react";
import { Textarea } from "./ui/textarea";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useCopyFeedback } from "../hooks/useCopyFeedback";

export function CompareResultDisplay({ result }) {
  const [copied, handleCopy] = useCopyFeedback();

  return (
    <div className="output-container">
      <Textarea
        value={result}
        readOnly
        rows={10}
        placeholder="Diff result will appear here..."
      />
      {result && (
        <CopyToClipboard text={result} onCopy={handleCopy}>
          <button className="copy-btn">
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
        </CopyToClipboard>
      )}
    </div>
  );
}
