import React, { useState } from 'react';
import { FormatSelector } from './FormatSelector';
import { InputEditor } from './InputEditor';
import { OutputDisplay } from './OutputDisplay';
import { ErrorDisplay } from './ErrorDisplay';
import { formatContent } from '../utils/formatters';
import { Button } from './ui/button';

export function FormatterSection() {
  const [format, setFormat] = useState('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormat = async () => {
    setLoading(true);
    try {
      const result = await formatContent(input, format);
      setOutput(result);
      setError('');
    } catch (e) {
      setError(e.message);
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-header">
          <span className="text-2xl">🎨</span> Formatter
        </h2>
        <FormatSelector value={format} onChange={setFormat} />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
          <InputEditor value={input} onChange={setInput} />
        </div>
        
        <div className="flex gap-3">
          <Button onClick={handleFormat} disabled={loading}>
            {loading ? '⏳ Formatting...' : '🚀 Format'}
          </Button>
        </div>
        
        <ErrorDisplay error={error} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Output</label>
          <OutputDisplay value={output} />
        </div>
      </div>
    </section>
  );
}
