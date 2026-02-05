import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function OutputDisplay({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect language based on content
  const getLanguage = () => {
    if (!value) return "plaintext";
    const trimmed = value.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
    if (trimmed.startsWith("<")) return "xml";
    if (trimmed.startsWith("query") || trimmed.startsWith("mutation"))
      return "graphql";
    return "plaintext";
  };

  return (
    <div className="output-container">
      <div
        className="border rounded-lg overflow-hidden bg-white"
        style={{ height: "400px" }}
      >
        <Editor
          value={value}
          language={getLanguage()}
          theme="vs-light"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            folding: true,
            foldingStrategy: "auto",
            foldingHighlight: true,
            lineNumbers: "on",
            wordWrap: "on",
          }}
        />
      </div>
      {value && (
        <CopyToClipboard text={value} onCopy={handleCopy}>
          <button className="copy-btn">
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
        </CopyToClipboard>
      )}
    </div>
  );
}
