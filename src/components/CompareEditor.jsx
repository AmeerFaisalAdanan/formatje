import React from "react";
import { Textarea } from "./ui/textarea";

export function CompareEditor({ value, onChange, label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder={`Paste or type ${label.toLowerCase()} content...`}
      />
    </div>
  );
}
