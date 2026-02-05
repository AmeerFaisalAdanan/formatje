import React, { useState } from "react";
import { InputEditor } from "./InputEditor";
import { ErrorDisplay } from "./ErrorDisplay";
import { Button } from "./ui/button";
import { convertJsonToCurl, exampleJsonSchemas } from "../utils/curlConverter";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function JsonToCurlSection() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({ full: "", masked: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [curlOptions, setCurlOptions] = useState({
    verbose: false,
    insecure: false,
    includeHeaders: false,
    silent: false,
    followRedirects: false,
  });

  const handleConvert = async () => {
    setLoading(true);
    try {
      const result = convertJsonToCurl(input, curlOptions);
      setOutput(result);
      setError("");
    } catch (e) {
      setError(e.message);
      setOutput({ full: "", masked: "" });
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (option) => {
    setCurlOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertExample = (key) => {
    const example = exampleJsonSchemas[key];
    setInput(JSON.stringify(example, null, 2));
    setError("");
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-header">
          <span className="text-2xl">🌀</span> JSON to cURL
        </h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => insertExample("basic")}
          >
            Basic Example
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => insertExample("withHeaders")}
          >
            With Headers
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => insertExample("complex")}
          >
            Complex Example
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JSON Request Object
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Expected keys:{" "}
              <code className="bg-gray-100 px-1 rounded">url</code>,
              <code className="bg-gray-100 px-1 rounded ml-1">method</code>{" "}
              (optional),
              <code className="bg-gray-100 px-1 rounded ml-1">
                headers
              </code>{" "}
              (optional),
              <code className="bg-gray-100 px-1 rounded ml-1">body</code>{" "}
              (optional)
            </p>
            <InputEditor
              value={input}
              onChange={setInput}
              placeholder={`{
  "url": "https://api.example.com/users",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123"
  },
  "body": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}`}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleConvert} disabled={loading}>
              {loading ? "⏳ Converting..." : "🚀 Generate cURL"}
            </Button>
            {input && (
              <Button variant="secondary" onClick={() => setInput("")}>
                Clear
              </Button>
            )}
          </div>

          {/* cURL Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">cURL Options</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={curlOptions.verbose}
                  onChange={() => toggleOption("verbose")}
                  className="rounded border-gray-300"
                />
                <span className="font-medium">-v (Verbose)</span>
                <span className="text-gray-500 text-xs">
                  Show request/response details
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={curlOptions.insecure}
                  onChange={() => toggleOption("insecure")}
                  className="rounded border-gray-300"
                />
                <span className="font-medium">-k (Insecure)</span>
                <span className="text-gray-500 text-xs">
                  Ignore SSL certificate errors
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={curlOptions.includeHeaders}
                  onChange={() => toggleOption("includeHeaders")}
                  className="rounded border-gray-300"
                />
                <span className="font-medium">-i (Include headers)</span>
                <span className="text-gray-500 text-xs">
                  Include response headers in output
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={curlOptions.silent}
                  onChange={() => toggleOption("silent")}
                  className="rounded border-gray-300"
                />
                <span className="font-medium">-s (Silent)</span>
                <span className="text-gray-500 text-xs">
                  Silent mode, no progress bar
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={curlOptions.followRedirects}
                  onChange={() => toggleOption("followRedirects")}
                  className="rounded border-gray-300"
                />
                <span className="font-medium">-L (Follow redirects)</span>
                <span className="text-gray-500 text-xs">
                  Follow HTTP redirects automatically
                </span>
              </label>
            </div>
          </div>

          <ErrorDisplay error={error} />
        </div>

        {/* Output Panel - Moved below options */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Generated cURL Command
                {output.full && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Tokens are masked for display)
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                {output.full && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setOutput({ full: "", masked: "" })}
                  >
                    🗑️ Clear
                  </Button>
                )}
                {output.full && (
                  <CopyToClipboard text={output.full} onCopy={handleCopy}>
                    <Button size="sm" variant="secondary">
                      {copied ? "✓ Copied!" : "📋 Copy Full Command"}
                    </Button>
                  </CopyToClipboard>
                )}
              </div>
            </div>

            {output.masked ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language="bash"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "13px",
                    lineHeight: "1.4",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                    maxWidth: "100%",
                    overflow: "auto",
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {output.masked}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 text-gray-500 text-sm min-h-[200px] flex items-center justify-center">
                Generated cURL command will appear here...
              </div>
            )}
          </div>

          {output.full && (
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-medium mb-1">💫 Usage Tips:</p>
              <ul className="space-y-1">
                <li>• Sensitive tokens are masked in display for security</li>
                <li>
                  • Click &quot;Copy Full Command&quot; to get the complete
                  unmasked command
                </li>
                <li>
                  • Add <code className="bg-blue-100 px-1 rounded">-i</code> to
                  include response headers
                </li>
                <li>
                  • Add <code className="bg-blue-100 px-1 rounded">-v</code> for
                  verbose output
                </li>
                <li>• The command is properly escaped for shell execution</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
