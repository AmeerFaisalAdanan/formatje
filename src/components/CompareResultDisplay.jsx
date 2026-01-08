import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export function CompareResultDisplay({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </CopyToClipboard>
      )}
    </div>
  );
}
