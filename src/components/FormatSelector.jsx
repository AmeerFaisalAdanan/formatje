import React from "react";
import { Select } from "./ui/select";

export function FormatSelector({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <Select.Item value="json">📄 JSON</Select.Item>
      <Select.Item value="xml">🗂️ XML</Select.Item>
      <Select.Item value="graphql">💎 GraphQL</Select.Item>
    </Select>
  );
}
