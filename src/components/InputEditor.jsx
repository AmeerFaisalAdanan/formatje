import React from 'react';
import { Textarea } from './ui/textarea';

export function InputEditor({ value, onChange }) {
  return (
    <Textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={8}
      className="w-full mb-2"
      placeholder="Paste or type your content here..."
    />
  );
}
