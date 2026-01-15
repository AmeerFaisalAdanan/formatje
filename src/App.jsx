import React, { useState } from 'react';
import { FormatterSection } from './components/FormatterSection';
import { CompareSection } from './components/CompareSection';
import { JsonToCurlSection } from './components/JsonToCurlSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('formatter');

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">formatje</h1>
          <p className="text-white/80">Format, compare, and convert developer tools</p>
        </header>

        <div className="tab-nav justify-center">
          <button
            className={`tab-btn ${activeTab === 'formatter' ? 'active' : ''}`}
            onClick={() => setActiveTab('formatter')}
          >
            🎨 Formatter
          </button>
          <button
            className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            🔍 Compare
          </button>
          <button
            className={`tab-btn ${activeTab === 'curl' ? 'active' : ''}`}
            onClick={() => setActiveTab('curl')}
          >
            🌀 JSON to cURL
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'formatter' ? (
            <FormatterSection />
          ) : activeTab === 'compare' ? (
            <CompareSection />
          ) : (
            <JsonToCurlSection />
          )}
        </div>
      </div>
    </div>
  );
}
